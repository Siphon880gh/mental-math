import { describe, expect, it } from "vitest";
import { SCENARIOS, getScenario, scenariosForTrack } from "./scenarios";

describe("scenarios", () => {
  it("has unique ids, one correct choice, multiple skills, and both tracks", () => {
    const ids = SCENARIOS.map((row) => row.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(scenariosForTrack("quick").length).toBeGreaterThanOrEqual(12);
    expect(scenariosForTrack("stakeholder").length).toBeGreaterThanOrEqual(12);
    for (const row of SCENARIOS) {
      expect(row.skillIds.length).toBeGreaterThanOrEqual(2);
      expect(row.hints.length).toBeGreaterThanOrEqual(1);
      expect(row.choices.filter((c) => c.correct).length).toBe(1);
      expect(row.cheat.length).toBeGreaterThan(20);
    }
    expect(getScenario("box-cover")?.track).toBe("quick");
    expect(getScenario("missing")).toBeUndefined();
  });
});
