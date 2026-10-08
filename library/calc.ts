export function validateTankSize(tankLitres: number): boolean {
  return tankLitres >= 1 && tankLitres <= 200;
}

export function calculatePerLitreDose(
  dose: number,
  tankLitres: number
): number {
  return dose * tankLitres;
}

export function calculatePerAcreDose(
  dosePerAcre: number,
  tankLitres: number,
  waterPerAcreLitres: number
): number {
  if (waterPerAcreLitres <= 0) {
    throw new Error("Water per acre must be greater than zero.");
  }

  return (dosePerAcre * tankLitres) / waterPerAcreLitres;
}

export function calculateHarvestDate(
  sprayDate: string,
  phiDays: number
): string {
  const date = new Date(`${sprayDate}T00:00:00Z`);

  date.setUTCDate(date.getUTCDate() + phiDays);

  return date.toISOString().slice(0, 10);
}

export function calculateDoseRange(
  doseMin: number,
  doseMax: number,
  tankLitres: number,
  doseUnit: "ml_per_litre" | "g_per_litre"
): {
  min: number;
  max: number;
  unit: "ml" | "g";
} {
  const min = calculatePerLitreDose(doseMin, tankLitres);
  const max = calculatePerLitreDose(doseMax, tankLitres);

  return {
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    unit: doseUnit === "ml_per_litre" ? "ml" : "g",
  };
}