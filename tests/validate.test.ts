import { describe, expect, test } from "vitest";

import { validateExtraction } from "../library/validate";
import type { Extraction } from "../library/schema";


const validExtraction: Extraction = {
  legible: true,
  overall_confidence: 0.95,

  label_language: "English",

  product_name: {
    value: "Example Pesticide",
    confidence: 0.95,
    source_text: "Example Pesticide",
  },

  active_ingredient: {
    value: "Example Ingredient",
    confidence: 0.95,
    source_text: "Example Ingredient",
  },

  concentration: {
    value: "20%",
    confidence: 0.95,
    source_text: "20%",
  },

  crops: [
    {
      crop_label_text: "Tomato",
      crop_id: "tomato",

      dose_min: 2,
      dose_max: 2.5,
      dose_unit: "ml_per_litre",

      water_per_acre_litres: null,

      phi_days: 7,

      dose_confidence: 0.95,
      phi_confidence: 0.95,

      dose_source_text: "Dose: 2–2.5 ml per litre",
      phi_source_text: "Pre-harvest interval: 7 days",
    },
  ],

  ppe: [
    {
      item: "gloves",
      source_text: "Wear protective gloves",
    },
  ],

  warnings: [],
};


describe("validateExtraction", () => {

  test("accepts a valid extraction", () => {
    const result = validateExtraction(
      validExtraction,
      "tomato"
    );

    expect(result.status).toBe("ok");
  });


  test("rejects a blurry label", () => {
    const extraction = {
      ...validExtraction,
      overall_confidence: 0.5,
    };

    const result = validateExtraction(
      extraction,
      "tomato"
    );

    expect(result).toEqual({
      status: "cant_read",
      reason: "blurry",
    });
  });


  test("rejects a crop that is not listed on the label", () => {
    const result = validateExtraction(
      validExtraction,
      "chilli"
    );

    expect(result).toEqual({
      status: "crop_not_labeled",
    });
  });


  test("rejects a missing dose", () => {
    const extraction: Extraction = {
      ...validExtraction,
      crops: [
        {
          ...validExtraction.crops[0],
          dose_min: null,
          dose_max: null,
        },
      ],
    };

    const result = validateExtraction(
      extraction,
      "tomato"
    );

    expect(result).toEqual({
      status: "cant_read",
      reason: "dose_unclear",
    });
  });


  test("rejects a low-confidence dose", () => {
    const extraction: Extraction = {
      ...validExtraction,
      crops: [
        {
          ...validExtraction.crops[0],
          dose_confidence: 0.7,
        },
      ],
    };

    const result = validateExtraction(
      extraction,
      "tomato"
    );

    expect(result).toEqual({
      status: "cant_read",
      reason: "dose_unclear",
    });
  });


  test("rejects a missing PHI", () => {
    const extraction: Extraction = {
      ...validExtraction,
      crops: [
        {
          ...validExtraction.crops[0],
          phi_days: null,
        },
      ],
    };

    const result = validateExtraction(
      extraction,
      "tomato"
    );

    expect(result).toEqual({
      status: "cant_read",
      reason: "phi_missing",
    });
  });
    test("accepts a single dose that appears in the source text", () => {
    const extraction: Extraction = {
      ...validExtraction,
      crops: [
        {
          ...validExtraction.crops[0],
          dose_min: 0.3,
          dose_max: 0.3,
          dose_source_text: "0.3 ml per litre of water",
        },
      ],
    };

    const result = validateExtraction(
      extraction,
      "tomato"
    );

    expect(result.status).toBe("ok");
  });


  test("rejects a PHI number that only appears inside a larger number", () => {
    const extraction: Extraction = {
      ...validExtraction,
      crops: [
        {
          ...validExtraction.crops[0],
          phi_days: 7,
          phi_source_text: "Pre-harvest interval: 17 days",
        },
      ],
    };

    const result = validateExtraction(
      extraction,
      "tomato"
    );

    expect(result).toEqual({
      status: "cant_read",
      reason: "phi_missing",
    });
  });


  test("rejects a dose that only matches part of a decimal", () => {
    const extraction: Extraction = {
      ...validExtraction,
      crops: [
        {
          ...validExtraction.crops[0],
          dose_min: 3,
          dose_max: 3,
          dose_source_text: "0.3 ml per litre",
        },
      ],
    };

    const result = validateExtraction(
      extraction,
      "tomato"
    );

    expect(result).toEqual({
      status: "cant_read",
      reason: "dose_unclear",
    });
  });

});