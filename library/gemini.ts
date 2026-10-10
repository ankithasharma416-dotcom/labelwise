import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import { EXTRACTION_PROMPT } from "./prompt";
import { ExtractionSchema, type Extraction } from "./schema";

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL;
const fallbackModel =
  process.env.GEMINI_FALLBACK_MODEL ?? "gemini-flash-latest";

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

if (!model) {
  throw new Error("GEMINI_MODEL is not configured.");
}

const ai = new GoogleGenAI({ apiKey });

const { $schema, ...responseJsonSchema } = z.toJSONSchema(ExtractionSchema);

const REQUEST_TIMEOUT_MS = 30_000;

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function isRetryable(error: unknown): boolean {
  const status = (error as { status?: number })?.status;

  // Bad key, bad request, etc. will not fix themselves
  if (
    typeof status === "number" &&
    status < 500 &&
    status !== 429 &&
    status !== 408
  ) {
    return false;
  }

  // 429, 5xx, timeouts, "fetch failed"
  return true;
}

function generate(
  modelName: string,
  imageBase64: string,
  mimeType: string
) {
  return ai.models.generateContent({
    model: modelName,
    contents: [
      { inlineData: { mimeType, data: imageBase64 } },
      { text: EXTRACTION_PROMPT },
    ],
    config: {
      responseMimeType: "application/json",
      responseJsonSchema,
      httpOptions: { timeout: REQUEST_TIMEOUT_MS },
      ...(modelName.includes("2.5")
        ? { thinkingConfig: { thinkingBudget: 0 } }
        : {}),
    },
  });
}

export async function extractLabelFromImage(
  imageBase64: string,
  mimeType: string
): Promise<Extraction> {
  const attempts = [model!, model!, fallbackModel];

  let response: Awaited<ReturnType<typeof generate>> | undefined;
  let lastError: unknown;

  for (let i = 0; i < attempts.length; i++) {
    try {
      response = await generate(attempts[i], imageBase64, mimeType);
      break;
    } catch (error) {
      lastError = error;
      console.warn(
        `Gemini attempt ${i + 1} (${attempts[i]}) failed:`,
        error instanceof Error ? error.message.slice(0, 120) : error
      );

      if (!isRetryable(error)) {
        throw error;
      }

      await sleep(1500 * (i + 1));
    }
  }

  if (!response) {
    throw lastError;
  }

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }

  return ExtractionSchema.parse(parsed);
}