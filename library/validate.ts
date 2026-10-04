import type { CropEntry, Extraction } from "./schema";

export type CantReadReason =
  | "blurry"
  | "not_a_label"
  | "low_confidence"
  | "dose_unclear"
  | "dose_unit_unsupported"
  | "phi_missing"
  | "active_ingredient_unreadable"
  | "crop_unclear";

export type ValidationResult =
  | {
      status: "ok";
      entry: CropEntry;
    }
  | {
      status: "crop_not_labeled";
    }
  | {
      status: "cant_read";
      reason: CantReadReason;
    };

/**
 * Checks whether a number actually appears
 * inside the source text provided by Gemini.
 */
function numberAppearsInText(
  value: number,
  sourceText: string | null
): boolean {
  if (!sourceText) {
    return false;
  }

  const normalizedText = sourceText.replace(/,/g, "");

  return normalizedText.includes(String(value));
}

/**
 * Checks whether the dose is inside
 * the sanity bounds defined in the PRD.
 */
function doseWithinBounds(entry: CropEntry): boolean {
  if (entry.dose_min === null || entry.dose_max === null) {
    return false;
  }

  if (entry.dose_min > entry.dose_max) {
    return false;
  }

  if (
    entry.dose_unit === "ml_per_litre" ||
    entry.dose_unit === "g_per_litre"
  ) {
    return (
      entry.dose_min >= 0.05 &&
      entry.dose_max <= 20
    );
  }

  if (
    entry.dose_unit === "ml_per_acre" ||
    entry.dose_unit === "g_per_acre"
  ) {
    return (
      entry.dose_min >= 10 &&
      entry.dose_max <= 5000
    );
  }

  return false;
}

/**
 * Validates Gemini's extracted pesticide label data.
 *
 * The first failed check determines the result.
 */
export function validateExtraction(
  extraction: Extraction,
  selectedCrop: string
): ValidationResult {

  // --------------------------------------------------
  // 1. Check whether the label is readable
  // --------------------------------------------------

  if (!extraction.legible) {
    if (extraction.overall_confidence < 0.3) {
      return {
        status: "cant_read",
        reason: "not_a_label",
      };
    }

    return {
      status: "cant_read",
      reason: "blurry",
    };
  }

  if (extraction.overall_confidence < 0.7) {
    return {
      status: "cant_read",
      reason: "blurry",
    };
  }

  // --------------------------------------------------
  // 2. Active ingredient must be readable
  // --------------------------------------------------

  if (
    extraction.active_ingredient.value === null ||
    extraction.active_ingredient.confidence < 0.7
  ) {
    return {
      status: "cant_read",
      reason: "active_ingredient_unreadable",
    };
  }

  // --------------------------------------------------
  // 3. Product name must have enough confidence
  // --------------------------------------------------

  if (
    extraction.product_name.value === null ||
    extraction.product_name.confidence < 0.7
  ) {
    return {
      status: "cant_read",
      reason: "low_confidence",
    };
  }

  // --------------------------------------------------
  // 4. Find the selected crop
  // --------------------------------------------------

  const matchingCrop = extraction.crops.find(
    (crop) => crop.crop_id === selectedCrop
  );

  // If Gemini clearly found crops,
  // but the selected crop isn't one of them,
  // the product is not labeled for that crop.
  if (!matchingCrop) {

    // If there are no crop entries at all,
    // we cannot tell whether the crop is absent
    // or simply unreadable.
    if (extraction.crops.length === 0) {
      return {
        status: "cant_read",
        reason: "crop_unclear",
      };
    }

    return {
      status: "crop_not_labeled",
    };
  }

  // --------------------------------------------------
  // 5. Check crop information confidence
  // --------------------------------------------------

  if (
    !matchingCrop.crop_label_text ||
    matchingCrop.crop_label_text.trim() === ""
  ) {
    return {
      status: "cant_read",
      reason: "crop_unclear",
    };
  }

  // --------------------------------------------------
  // 6. Dose values must exist
  // --------------------------------------------------

  if (
    matchingCrop.dose_min === null ||
    matchingCrop.dose_max === null
  ) {
    return {
      status: "cant_read",
      reason: "dose_unclear",
    };
  }

  // --------------------------------------------------
  // 7. Dose unit must be supported
  // --------------------------------------------------

  if (matchingCrop.dose_unit === null) {
    return {
      status: "cant_read",
      reason: "dose_unit_unsupported",
    };
  }

  // --------------------------------------------------
  // 8. Dose confidence must be at least 0.85
  // --------------------------------------------------

  if (matchingCrop.dose_confidence < 0.85) {
    return {
      status: "cant_read",
      reason: "dose_unclear",
    };
  }

  // --------------------------------------------------
  // 9. Dose must be within sanity bounds
  // --------------------------------------------------

  if (!doseWithinBounds(matchingCrop)) {
    return {
      status: "cant_read",
      reason: "dose_unclear",
    };
  }

  // --------------------------------------------------
  // 10. Dose numbers must appear in source text
  // --------------------------------------------------

  if (
    !numberAppearsInText(
      matchingCrop.dose_min,
      matchingCrop.dose_source_text
    )
  ) {
    return {
      status: "cant_read",
      reason: "dose_unclear",
    };
  }

  if (
    !numberAppearsInText(
      matchingCrop.dose_max,
      matchingCrop.dose_source_text
    )
  ) {
    return {
      status: "cant_read",
      reason: "dose_unclear",
    };
  }

  // --------------------------------------------------
  // 11. PHI must exist and be reliable
  // --------------------------------------------------

  if (
    matchingCrop.phi_days === null ||
    matchingCrop.phi_confidence < 0.85
  ) {
    return {
      status: "cant_read",
      reason: "phi_missing",
    };
  }

  // --------------------------------------------------
  // 12. PHI number must appear in source text
  // --------------------------------------------------

  if (
    !numberAppearsInText(
      matchingCrop.phi_days,
      matchingCrop.phi_source_text
    )
  ) {
    return {
      status: "cant_read",
      reason: "phi_missing",
    };
  }

  // --------------------------------------------------
  // 13. Per-acre doses require water per acre
  // --------------------------------------------------

  if (
    (
      matchingCrop.dose_unit === "ml_per_acre" ||
      matchingCrop.dose_unit === "g_per_acre"
    ) &&
    matchingCrop.water_per_acre_litres === null
  ) {
    return {
      status: "cant_read",
      reason: "dose_unit_unsupported",
    };
  }

  // --------------------------------------------------
  // Everything passed
  // --------------------------------------------------

  return {
    status: "ok",
    entry: matchingCrop,
  };
}