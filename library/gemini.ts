import { GoogleGenAI } from "@google/genai";

import { EXTRACTION_PROMPT } from "./prompt";
import {
  ExtractionSchema,
  type Extraction,
} from "./schema";


const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

if (!model) {
  throw new Error("GEMINI_MODEL is not configured.");
}


const ai = new GoogleGenAI({
  apiKey,
});


export async function extractLabelFromImage(
  imageBase64: string,
  mimeType: string
): Promise<Extraction> {

  const response = await ai.models.generateContent({
    model: model!,

    contents: [
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
      {
        text: EXTRACTION_PROMPT,
      },
    ],

    config: {
      responseMimeType: "application/json",
    },
  });


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