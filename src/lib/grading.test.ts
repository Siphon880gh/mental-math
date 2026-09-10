import { describe, expect, it } from "vitest";
import { FLUENCY_GATE, fluencyPassed, gradeAnswer, median } from "./grading";

describe("gradeAnswer", () => {
  it("grades exact integer products", () => {
    expect(gradeAnswer(2000, 2000)).toBe("correct");
    expect(gradeAnswer(200, 200)).toBe("correct");
    expect(gradeAnswer(2000, 200)).toBe("incorrect");
  });

  it("accepts nearest-dollar close on money", () => {
    expect(gradeAnswer(8.46, 8, "usd")).toBe("close");
    expect(gradeAnswer(8.46, 8.46, "$")).toBe("correct");
    expect(gradeAnswer(8.46, 20, "usd")).toBe("incorrect");
  });
});

describe("fluency gate", () => {
  it("fails slow medians even at high accuracy", () => {
    expect(
      fluencyPassed({
        accuracy: 1,
        medianLatencyMs: FLUENCY_GATE.percents.medianLatencyMs + 1,
        maxMedianMs: FLUENCY_GATE.percents.medianLatencyMs,
        minAccuracy: FLUENCY_GATE.percents.minAccuracy,
      }),
    ).toBe(false);
    expect(
      fluencyPassed({
        accuracy: 0.8,
        medianLatencyMs: 4000,
        maxMedianMs: FLUENCY_GATE.percents.medianLatencyMs,
        minAccuracy: FLUENCY_GATE.percents.minAccuracy,
      }),
    ).toBe(true);
  });

  it("computes median", () => {
    expect(median([5000, 1000, 3000])).toBe(3000);
  });
});
