import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { generateImageBuffer } from "@workspace/integrations-openai-ai-server/image";
import { batchProcess } from "@workspace/integrations-openai-ai-server/batch";
import { GeneratePostsBody } from "@workspace/api-zod";
import { db, generationSessionsTable } from "@workspace/db";
import { logger } from "../../lib/logger";

const router: IRouter = Router();

interface BrandProfile {
  brandName: string;
  tone: string;
  emojiUsage: string;
  avgCaptionLengthLinkedin: number;
  avgCaptionLengthInstagram: number;
  colorPalette: string[];
  ctaStyle: string;
  hashtagCount: number;
  visualStyle: string;
  keywords: string[];
  voiceDescription: string;
}

interface ContentBrief {
  postType: string;
  keyMessages: string[];
  hookIdeas: string[];
  ctaOptions: string[];
  visualDirection: string;
  hashtags: string[];
}

async function createContentBrief(
  intent: string,
  platforms: string[],
  toneOverride: string | undefined,
  brandProfile: BrandProfile,
  additionalContext?: string
): Promise<ContentBrief> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 800,
    messages: [
      {
        role: "user",
        content: `You are a social media strategist. Create a content brief.

User Intent: ${intent}
Platforms: ${platforms.join(", ")}
Tone: ${toneOverride || brandProfile.tone}
Brand Voice: ${brandProfile.voiceDescription}
Keywords: ${brandProfile.keywords.join(", ")}
${additionalContext ? `Additional Context: ${additionalContext}` : ""}

Return ONLY a valid JSON object:
{
  "postType": "one of: announcement, promotion, event, educational, celebration",
  "keyMessages": ["message1", "message2", "message3"],
  "hookIdeas": ["hook1", "hook2", "hook3"],
  "ctaOptions": ["cta1", "cta2"],
  "visualDirection": "description of visual style for image generation (no text in image, brand colors ${brandProfile.colorPalette.slice(0, 2).join(", ")})",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
}

Return ONLY JSON, no explanation.`,
      },
    ],
    response_format: { type: "json_object" },
  });
  return JSON.parse(response.choices[0]?.message?.content ?? "{}");
}

async function generateCaptions(
  platform: string,
  contentBrief: ContentBrief,
  brandProfile: BrandProfile
): Promise<Array<{ variationNumber: number; caption: string; overlayText: string; hookType: string }>> {
  const maxLength =
    platform === "linkedin"
      ? brandProfile.avgCaptionLengthLinkedin
      : brandProfile.avgCaptionLengthInstagram;

  const response = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are a professional social media copywriter.

Platform: ${platform}
Brand tone: ${brandProfile.tone}
Emoji usage: ${brandProfile.emojiUsage}
CTA style: ${brandProfile.ctaStyle}
Max caption length: ${maxLength} words
Brand voice: ${brandProfile.voiceDescription}

Content Brief:
- Post type: ${contentBrief.postType}
- Key messages: ${contentBrief.keyMessages.join("; ")}
- Hook ideas: ${contentBrief.hookIdeas.join("; ")}
- CTA options: ${contentBrief.ctaOptions.join("; ")}
- Hashtags: ${contentBrief.hashtags.join(" ")}

Generate 3 DIFFERENT caption variations. Each must have a completely different hook and angle.

Return ONLY a valid JSON object:
{
  "variations": [
    {
      "variationNumber": 1,
      "caption": "full caption text here",
      "overlayText": "short 4-6 word overlay for image",
      "hookType": "question"
    },
    {
      "variationNumber": 2,
      "caption": "full caption text here",
      "overlayText": "short 4-6 word overlay for image",
      "hookType": "statement"
    },
    {
      "variationNumber": 3,
      "caption": "full caption text here",
      "overlayText": "short 4-6 word overlay for image",
      "hookType": "story"
    }
  ]
}

Return ONLY JSON.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");
  return result.variations ?? [];
}

async function reviewCaption(
  caption: string,
  platform: string,
  brandProfile: BrandProfile,
  contentBrief: ContentBrief
): Promise<{ finalCaption: string; finalScore: number; reviewNotes: string }> {
  const rounds = [
    {
      name: "Brand consistency",
      criteria: `Does the tone, voice, emoji usage, and CTA style match the brand profile? Brand tone: ${brandProfile.tone}, emoji: ${brandProfile.emojiUsage}, CTA style: ${brandProfile.ctaStyle}`,
    },
    {
      name: "Message clarity",
      criteria: "Is the main message clear? Is the hook engaging? Is the CTA actionable?",
    },
    {
      name: "Platform optimization",
      criteria: `Is this optimized for ${platform}? Correct length, format, hashtags?`,
    },
  ];

  let currentCaption = caption;
  const scores: number[] = [];
  let lastIssue = "";

  for (const round of rounds) {
    const response = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 600,
      messages: [
        {
          role: "user",
          content: `You are a senior social media quality reviewer.

Round: ${round.name}
Criteria: ${round.criteria}
Platform: ${platform}

Caption to review:
${currentCaption}

Return ONLY a valid JSON object:
{
  "score": 8.5,
  "mainIssue": "one sentence issue if any, or empty string if none",
  "improvedCaption": "improved version if score < 8, otherwise return the original caption unchanged"
}

Score must be between 0-10. Return ONLY JSON.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");
    scores.push(result.score ?? 7);
    if (result.mainIssue) lastIssue = result.mainIssue;
    if (result.improvedCaption && (result.score ?? 7) < 8) {
      currentCaption = result.improvedCaption;
    }
  }

  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  return {
    finalCaption: currentCaption,
    finalScore: Math.round(avgScore * 10) / 10,
    reviewNotes: lastIssue || "Looks great!",
  };
}

router.post("/brandmind/generate", async (req, res) => {
  const parsed = GeneratePostsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    return;
  }

  const { brandProfile, intent, platforms, toneOverride, additionalContext } = parsed.data;
  req.log.info({ brandName: brandProfile.brandName, intent, platforms }, "Generating posts");

  try {
    // Step 1: Create content brief
    const contentBrief = await createContentBrief(
      intent,
      platforms,
      toneOverride,
      brandProfile as BrandProfile,
      additionalContext
    );

    // Step 2: Generate captions + images for each platform in parallel
    const platformResults = await batchProcess(
      platforms,
      async (platform) => {
        // Generate captions and image in parallel
        const [captions, imageBuffer] = await Promise.all([
          generateCaptions(platform, contentBrief, brandProfile as BrandProfile),
          generateImageBuffer(
            `Professional social media background for ${brandProfile.brandName}. Style: ${brandProfile.visualStyle}. Theme: ${contentBrief.visualDirection}. Color scheme: ${brandProfile.colorPalette.slice(0, 2).join(" and ")}. Clean background with no text, suitable for text overlay. Platform: ${platform}.`,
            platform === "linkedin" ? "1536x1024" : "1024x1024"
          ).catch(() => null),
        ]);

        const imageB64 = imageBuffer ? imageBuffer.toString("base64") : undefined;

        // Step 3: Review each caption (3 rounds each)
        const reviewedVariations = await batchProcess(
          captions,
          async (cap) => {
            const review = await reviewCaption(
              cap.caption,
              platform,
              brandProfile as BrandProfile,
              contentBrief
            );
            return {
              variationNumber: cap.variationNumber,
              caption: review.finalCaption,
              imageB64,
              overlayText: cap.overlayText,
              reviewScore: review.finalScore,
              reviewNotes: review.reviewNotes,
              platform,
              recommended: false,
              hookType: cap.hookType,
            };
          },
          { concurrency: 2, retries: 3 }
        );

        // Mark the best as recommended
        let bestScore = -1;
        let bestIdx = 0;
        reviewedVariations.forEach((v, i) => {
          if (v.reviewScore > bestScore) {
            bestScore = v.reviewScore;
            bestIdx = i;
          }
        });
        reviewedVariations[bestIdx].recommended = true;

        return { platform, variations: reviewedVariations };
      },
      { concurrency: 1, retries: 2 }
    );

    // Build posts object
    const posts: Record<string, typeof platformResults[0]["variations"]> = {};
    for (const { platform, variations } of platformResults) {
      posts[platform] = variations;
    }

    // Step 4: Save to DB
    const [session] = await db
      .insert(generationSessionsTable)
      .values({
        brandName: brandProfile.brandName,
        intent,
        platforms,
        brandProfile: brandProfile as object,
        contentBrief: contentBrief as object,
        posts: posts as object,
      })
      .returning();

    req.log.info({ sessionId: session.id }, "Generation complete");

    res.json({
      sessionId: session.id,
      brandProfile,
      contentBrief,
      posts: {
        linkedin: posts["linkedin"] ?? [],
        instagram: posts["instagram"] ?? [],
      },
    });
  } catch (err) {
    req.log.error({ err }, "Post generation failed");
    res.status(500).json({ error: "Post generation failed" });
  }
});

export default router;
