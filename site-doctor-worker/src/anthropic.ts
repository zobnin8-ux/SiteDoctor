import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;
const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";

if (!apiKey) {
  console.error("⚠️ Missing ANTHROPIC_API_KEY — AI analysis will be skipped");
}

export const anthropic = apiKey ? new Anthropic({ apiKey }) : null;
export const ANTHROPIC_MODEL = model;
export const HAS_AI = !!apiKey;
