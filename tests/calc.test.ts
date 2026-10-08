import { describe, expect, test } from "vitest";

import {
  validateTankSize,
  calculatePerLitreDose,
  calculatePerAcreDose,
  calculateHarvestDate,
  calculateDoseRange,
} from "../library/calc";


describe("validateTankSize", () => {
  test("accepts a valid tank size", () => {
    expect(validateTankSize(15)).toBe(true);
  });

  test("accepts the minimum tank size", () => {
    expect(validateTankSize(1)).toBe(true);
  });

  test("accepts the maximum tank size", () => {
    expect(validateTankSize(200)).toBe(true);
  });

  test("rejects zero", () => {
    expect(validateTankSize(0)).toBe(false);
  });

  test("rejects a tank larger than 200 litres", () => {
    expect(validateTankSize(500)).toBe(false);
  });
});


describe("calculatePerLitreDose", () => {
  test("calculates a simple per-litre dose", () => {
    expect(calculatePerLitreDose(2, 15)).toBe(30);
  });
});


describe("calculatePerAcreDose", () => {
  test("calculates a per-acre dose", () => {
    expect(
      calculatePerAcreDose(400, 15, 200)
    ).toBe(30);
  });

  test("rejects zero water per acre", () => {
    expect(() =>
      calculatePerAcreDose(400, 15, 0)
    ).toThrow();
  });
});


describe("calculateDoseRange", () => {
  test("calculates both ends of a dose range", () => {
    expect(
      calculateDoseRange(
        2,
        2.5,
        15,
        "ml_per_litre"
      )
    ).toEqual({
      min: 30,
      max: 37.5,
      unit: "ml",
    });
  });

  test("returns grams for gram-based doses", () => {
    expect(
      calculateDoseRange(
        1,
        2,
        10,
        "g_per_litre"
      )
    ).toEqual({
      min: 10,
      max: 20,
      unit: "g",
    });
  });
});


describe("calculateHarvestDate", () => {
  test("adds PHI days to the spray date", () => {
    expect(
      calculateHarvestDate("2026-10-05", 7)
    ).toBe("2026-10-12");
  });

  test("handles month rollover", () => {
    expect(
      calculateHarvestDate("2026-10-28", 7)
    ).toBe("2026-11-04");
  });

  test("handles leap year", () => {
    expect(
      calculateHarvestDate("2028-02-25", 7)
    ).toBe("2028-03-03");
  });
});