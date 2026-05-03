import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { AnalyzeBrandBody } from "@workspace/api-zod";
import { logger } from "../../lib/logger";

const router: IRouter = Router();

async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BrandMind/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    const html = await response.text();
    // Strip HTML tags and extract meaningful text
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 3000);
    return text;
  } catch (err) {
    logger.warn({ err, url }, "Website scraping failed");
    return `Could not fetch website content for ${url}`;
  }
}

router.post("/brandmind/analyze", async (req, res) => {
  const parsed = AnalyzeBrandBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    return;
  }

  const { websiteUrl, brandName } = parsed.data;
  req.log.info({ brandName, websiteUrl }, "Analyzing brand");

  try {
    const websiteContent = await scrapeWebsite(websiteUrl);

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a brand strategist. Analyze this website content and extract the brand profile.

Brand Name: ${brandName}
Website Content: ${websiteContent}

Return ONLY a valid JSON object with these exact fields:
{
  "brandName": "${brandName}",
  "tone": "one of: professional, casual, energetic, inspirational, technical",
  "emojiUsage": "one of: none, minimal, moderate, heavy",
  "avgCaptionLengthLinkedin": 150,
  "avgCaptionLengthInstagram": 80,
  "colorPalette": ["#hex1", "#hex2", "#hex3"],
  "ctaStyle": "one of: action_oriented, soft, question_based",
  "hashtagCount": 5,
  "visualStyle": "one of: minimalist, bold_modern, corporate, playful, technical",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "voiceDescription": "2 sentence description of brand voice"
}

Return ONLY JSON, no explanation, no markdown.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const profile = JSON.parse(content);

    req.log.info({ brandName }, "Brand analysis complete");
    res.json(profile);
  } catch (err) {
    req.log.error({ err }, "Brand analysis failed");
    res.status(500).json({ error: "Brand analysis failed" });
  }
});

export default router;
