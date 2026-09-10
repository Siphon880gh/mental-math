import { describe, expect, it } from "vitest";
import { CASES, casesForPack } from "./cases";
import { THINKING_MODE_TIPS } from "./thinkingModeTips";

describe("case packs", () => {
  it("has unique ids and hidden-chain-ready thoughtChain", () => {
    const ids = CASES.map((row) => row.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const row of CASES) {
      expect(row.thoughtChain.length).toBeGreaterThan(0);
      expect(row.prompt.length).toBeGreaterThan(10);
    }
  });

  it("meets LOOP-Cases floors and modes", () => {
    const stacked = casesForPack("stacked-founder");
    expect(stacked.filter((c) => c.difficulty === "beginner").length).toBeGreaterThanOrEqual(8);
    expect(stacked.filter((c) => c.difficulty === "intermediate").length).toBeGreaterThanOrEqual(4);
    expect(stacked.some((c) => c.thinkingMode === "infra_chain")).toBe(true);
    expect(stacked.some((c) => c.thinkingMode === "break_even")).toBe(true);
    expect(stacked.some((c) => c.thinkingMode === "conversion_funnel")).toBe(true);
    expect(stacked.some((c) => c.thinkingMode === "markup_read")).toBe(true);
    expect(
      stacked.filter((c) => c.difficulty === "intermediate").every((c) => c.thoughtChain.length >= 3),
    ).toBe(true);

    const floors: [Parameters<typeof casesForPack>[0], string][] = [
      ["cfo-feasibility", "smell_test"],
      ["cfo-unit-econ", "ltv_cac"],
      ["cfo-runway", "runway"],
      ["cfo-growth", "growth_claim"],
    ];
    for (const [pack, mode] of floors) {
      const rows = casesForPack(pack);
      expect(rows.filter((c) => c.difficulty === "beginner").length).toBeGreaterThanOrEqual(6);
      expect(rows.filter((c) => c.difficulty === "intermediate").length).toBeGreaterThanOrEqual(3);
      expect(rows.some((c) => c.thinkingMode === mode)).toBe(true);
    }
    expect(casesForPack("cfo-growth").some((c) => c.id === "gr-impossible")).toBe(true);

    const efficiency = casesForPack("startup-efficiency");
    expect(efficiency.filter((c) => c.difficulty === "beginner").length).toBeGreaterThanOrEqual(6);
    expect(efficiency.some((c) => c.thinkingMode === "rule_of_40")).toBe(true);
    expect(efficiency.some((c) => c.thinkingMode === "burn_multiple")).toBe(true);
    expect(efficiency.some((c) => c.thinkingMode === "payback")).toBe(true);

    const market = casesForPack("startup-marketplace");
    expect(market.some((c) => c.thinkingMode === "take_rate")).toBe(true);
    expect(market.some((c) => c.thinkingMode === "fees")).toBe(true);

    const people = casesForPack("startup-people-capital");
    expect(people.some((c) => c.thinkingMode === "loaded_cost")).toBe(true);
    expect(people.some((c) => c.thinkingMode === "dilution")).toBe(true);
    expect(people.some((c) => c.thinkingMode === "tam_fermi")).toBe(true);
    expect(people.some((c) => c.thinkingMode === "nrr_read")).toBe(true);
  });

  it("has a home tip for every thinkingMode", () => {
    const modes = new Set(CASES.map((row) => row.thinkingMode));
    for (const mode of modes) {
      expect(THINKING_MODE_TIPS[mode].length).toBeGreaterThan(10);
    }
  });
});
