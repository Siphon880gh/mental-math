export type Grade = "correct" | "close" | "incorrect";

export const FLUENCY_GATE = {
  percents: { minAccuracy: 0.8, medianLatencyMs: 5000 },
  conversions: { minAccuracy: 0.8, medianLatencyMs: 6000 },
} as const;

const MONEY_UNITS = new Set(["usd", "dollar", "dollars", "$"]);

export function gradeAnswer(
  expected: number,
  given: number,
  unit?: string,
): Grade {
  if (!Number.isFinite(given) || !Number.isFinite(expected)) return "incorrect";
  if (given === expected) return "correct";
  const money = unit ? MONEY_UNITS.has(unit.toLowerCase()) : false;
  if (money && Math.abs(given - expected) < 1) return "close";
  return "incorrect";
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  }
  return sorted[mid]!;
}

export function fluencyPassed(input: {
  accuracy: number;
  medianLatencyMs: number;
  maxMedianMs: number;
  minAccuracy: number;
}): boolean {
  return input.accuracy >= input.minAccuracy && input.medianLatencyMs <= input.maxMedianMs;
}
