import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { EditPostBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/brandmind/edit", async (req, res) => {
  const parsed = EditPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    return;
  }

  const { caption, editInstruction, platform, brandProfile, contentBrief } = parsed.data;
  req.log.info({ platform, editInstruction }, "Editing post");

  try {
    // Step 1: Edit the caption
    const editResponse = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 800,
      messages: [
        {
          role: "user",
          content: `Edit this ${platform} caption based on the instruction. Preserve the brand voice.

Original caption:
${caption}

Edit instruction: ${editInstruction}

Brand voice: ${brandProfile.voiceDescription}
Brand tone: ${brandProfile.tone}
Emoji usage: ${brandProfile.emojiUsage}

Return ONLY the edited caption text. No explanation, no JSON.`,
        },
      ],
    });

    const editedCaption = editResponse.choices[0]?.message?.content?.trim() ?? caption;

    // Step 2: Re-review the edited caption
    const reviewResponse = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 400,
      messages: [
        {
          role: "user",
          content: `Review this ${platform} social media caption.

Caption:
${editedCaption}

Brand tone: ${brandProfile.tone}, emoji usage: ${brandProfile.emojiUsage}, CTA style: ${brandProfile.ctaStyle}
Post type: ${contentBrief.postType}

Return ONLY a valid JSON object:
{
  "score": 8.5,
  "reviewNotes": "brief assessment of quality"
}

Score must be between 0-10. Return ONLY JSON.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const review = JSON.parse(reviewResponse.choices[0]?.message?.content ?? "{}");

    req.log.info({ score: review.score }, "Post edit complete");

    res.json({
      caption: editedCaption,
      reviewScore: review.score ?? 7.5,
      reviewNotes: review.reviewNotes ?? "Post edited successfully",
    });
  } catch (err) {
    req.log.error({ err }, "Post edit failed");
    res.status(500).json({ error: "Post edit failed" });
  }
});

export default router;
