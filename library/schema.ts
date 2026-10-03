import { z } from "zod";

export const CROP_IDS = [
  "tomato",
  "chilli",
  "brinjal",
  "okra",
  "cabbage",
  "potato",
  "onion",
  "cotton",
  "other",
] as const;

export const DOSE_UNITS = [
  "ml_per_litre",
  "g_per_litre",
  "ml_per_acre",
  "g_per_acre",
] as const;

export const PPE_ITEMS = [
  "gloves",
  "mask",
  "goggles",
  "long_sleeves",
  "boots",
  "apron",
  "hat",
] as const;

export const WARNING_TYPES = [
  "water",
  "wind",
  "heat",
  "bees",
  "reentry",
  "storage",
  "other",
] as const;

const confidence = z.number().min(0).max(1);

const TextField = z.object({
  value: z.string().nullable(),
  confidence,
  source_text: z.string().nullable(),
});

export const CropEntrySchema = z.object({
  crop_label_text: z.string(),
  crop_id: z.enum(CROP_IDS),

  dose_min: z.number().nullable(),
  dose_max: z.number().nullable(),

  dose_unit: z.enum(DOSE_UNITS).nullable(),

  water_per_acre_litres: z.number().nullable(),

  phi_days: z.number().int().nullable(),

  dose_confidence: confidence,
  phi_confidence: confidence,

  dose_source_text: z.string().nullable(),
  phi_source_text: z.string().nullable(),
});

export const ExtractionSchema = z.object({
  legible: z.boolean(),
  overall_confidence: confidence,

  label_language: z.string().nullable(),

  product_name: TextField,
  active_ingredient: TextField,
  concentration: TextField,

  crops: z.array(CropEntrySchema),

  ppe: z.array(
    z.object({
      item: z.enum(PPE_ITEMS),
      source_text: z.string(),
    })
  ),

  warnings: z.array(
    z.object({
      type: z.enum(WARNING_TYPES),
      source_text: z.string(),
    })
  ),
});

export type CropEntry = z.infer<typeof CropEntrySchema>;
export type Extraction = z.infer<typeof ExtractionSchema>;