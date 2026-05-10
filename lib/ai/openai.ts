import "server-only";

import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

// AI SDK v6: model adapter is created via createOpenAI({ apiKey }), then
// invoked with the model name. Keeping the provider centralized here
// means a swap to Anthropic/Google/Groq is one file: change the import
// and the createX call.

const DEFAULT_MODEL = "gpt-4o-mini";

let cachedModel: LanguageModel | null = null;

export function getChatModel(): LanguageModel {
  if (cachedModel) return cachedModel;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const provider = createOpenAI({ apiKey });
  cachedModel = provider(process.env.OPENAI_MODEL || DEFAULT_MODEL);
  return cachedModel;
}

export function getModelName(): string {
  return process.env.OPENAI_MODEL || DEFAULT_MODEL;
}
