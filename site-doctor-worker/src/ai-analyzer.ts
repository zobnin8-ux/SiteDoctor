import { anthropic, ANTHROPIC_MODEL, HAS_AI } from "./anthropic.js";
import { SYSTEM_PROMPT, buildUserPrompt, type PageData } from "./ai-prompt.js";

export interface AiAnalysis {
  industry: string;
  industry_label: string;
  industry_confidence: number;

  scores: {
    overall: number;
    trust: number;
    cta: number;
    clarity: number;
    mobile: number;
    visual: number;
  };

  diagnosis: {
    summary: string;
    verdict: string;
  };

  top_issues: Array<{
    id: number;
    title: string;
    severity: "critical" | "warning" | "minor";
    description: string;
  }>;

  fixes: {
    hero_before: string | null;
    hero_after: string | null;
    cta_before: string | null;
    cta_after: string | null;
    about_before: string | null;
    about_after: string | null;
  };

  model: string;
  tokens_used: { input: number; output: number };
  generated_at: string;
}

export interface AiAnalyzerResult {
  ok: boolean;
  analysis?: AiAnalysis;
  error?: string;
}

const MAX_RETRIES = 2;
const TIMEOUT_MS = 90_000;
/** Загрузка PNG из Storage для Vision — без лимита fetch мог зависнуть навсегда. */
const FETCH_SCREENSHOT_MS = 45_000;

export async function analyzeScan(data: PageData): Promise<AiAnalyzerResult> {
  if (!HAS_AI || !anthropic) {
    return { ok: false, error: "AI is not configured (no API key)" };
  }

  const userPrompt = buildUserPrompt(data);
  const imageBlocks = await loadScreenshotsAsBlocks(data.screenshots);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[AI] Attempt ${attempt}/${MAX_RETRIES}, model=${ANTHROPIC_MODEL}`);

      const response = await Promise.race([
        anthropic.messages.create({
          model: ANTHROPIC_MODEL,
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: [...imageBlocks, { type: "text", text: userPrompt }],
            },
          ],
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("AI timeout")), TIMEOUT_MS)
        ),
      ]);

      const text = extractTextFromMessage(response);
      const parsed = extractJson(text);
      validateAnalysis(parsed);

      const analysis: AiAnalysis = {
        ...parsed,
        model: ANTHROPIC_MODEL,
        tokens_used: {
          input: response.usage?.input_tokens ?? 0,
          output: response.usage?.output_tokens ?? 0,
        },
        generated_at: new Date().toISOString(),
      };

      console.log(
        `[AI] Success on attempt ${attempt}, tokens: ${analysis.tokens_used.input} in / ${analysis.tokens_used.output} out`
      );

      return { ok: true, analysis };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[AI] Attempt ${attempt} failed:`, message);

      if (attempt === MAX_RETRIES) {
        return { ok: false, error: message };
      }

      await sleep(2000 * attempt);
    }
  }

  return { ok: false, error: "All retries exhausted" };
}

type ImageBlock = {
  type: "image";
  source: {
    type: "base64";
    media_type: "image/png";
    data: string;
  };
};

async function loadScreenshotsAsBlocks(
  screenshots?: PageData["screenshots"]
): Promise<ImageBlock[]> {
  if (!screenshots) return [];

  const blocks: ImageBlock[] = [];

  if (screenshots.desktop) {
    const data = await fetchAsBase64(screenshots.desktop);
    if (data) {
      blocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/png",
          data,
        },
      });
    }
  }

  if (screenshots.mobile) {
    const data = await fetchAsBase64(screenshots.mobile);
    if (data) {
      blocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/png",
          data,
        },
      });
    }
  }

  return blocks;
}

async function fetchAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_SCREENSHOT_MS),
    });
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.toString("base64");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("timeout") || msg.includes("aborted") || msg.includes("AbortError")) {
      console.warn(
        `[AI] Screenshot fetch timed out after ${FETCH_SCREENSHOT_MS}ms: ${url}`
      );
    } else {
      console.warn(`[AI] Failed to fetch screenshot ${url}:`, e);
    }
    return null;
  }
}

function extractTextFromMessage(response: {
  content: ReadonlyArray<{ type: string; text?: string }>;
  usage?: { input_tokens?: number; output_tokens?: number };
}): string {
  const textBlock = response.content.find(
    (b): b is { type: "text"; text: string } => b.type === "text"
  );
  if (!textBlock) {
    throw new Error("No text block in Claude response");
  }
  return textBlock.text;
}

function extractJson(text: string): unknown {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error(
      `Invalid JSON in Claude response: ${cleaned.substring(0, 200)}`
    );
  }
}

function validateAnalysis(obj: unknown): asserts obj is Omit<
  AiAnalysis,
  "model" | "tokens_used" | "generated_at"
> {
  if (!obj || typeof obj !== "object") {
    throw new Error("Analysis is not an object");
  }
  const r = obj as Record<string, unknown>;
  const required = [
    "industry",
    "industry_label",
    "industry_confidence",
    "scores",
    "diagnosis",
    "top_issues",
    "fixes",
  ];
  for (const key of required) {
    if (!(key in r)) {
      throw new Error(`Missing required field: ${key}`);
    }
  }

  if (typeof r.industry_confidence !== "number") {
    throw new Error("industry_confidence must be a number");
  }

  const diag = r.diagnosis as Record<string, unknown> | undefined;
  if (
    !diag ||
    typeof diag.summary !== "string" ||
    typeof diag.verdict !== "string"
  ) {
    throw new Error("diagnosis.summary and diagnosis.verdict must be strings");
  }

  const fixes = r.fixes as Record<string, unknown> | undefined;
  if (!fixes || typeof fixes !== "object") {
    throw new Error("fixes must be an object");
  }

  if (!Array.isArray(r.top_issues) || r.top_issues.length < 1) {
    throw new Error("top_issues must be a non-empty array");
  }

  const scores = r.scores as Record<string, unknown> | undefined;
  if (!scores || typeof scores.overall !== "number") {
    throw new Error("scores.overall must be a number");
  }

  for (const k of ["trust", "cta", "clarity", "mobile", "visual"]) {
    if (typeof scores[k] !== "number") {
      throw new Error(`scores.${k} must be a number`);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
