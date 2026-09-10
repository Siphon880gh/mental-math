import { describe, expect, it } from "vitest";
import { GAMES, GAME_SKIPS, getGame } from "./games";
import { BEGINNER_REFLEX_PATH, OPERATOR_CFO_PATH } from "./learningPaths";

describe("games", () => {
  it("ships three distinct mechanics and records skips", () => {
    expect(GAMES.map((g) => g.slug)).toEqual(["decimal-shift", "percent-swap", "percent-chips"]);
    expect(getGame("decimal-shift")?.familyId).toBe("percent-shift");
    expect(GAME_SKIPS.some((s) => s.familyId === "anchors" && s.reason === "no_mechanic")).toBe(true);
    expect(GAME_SKIPS.some((s) => s.familyId === "magnitude" && s.reason === "no_mechanic")).toBe(true);
    expect(GAME_SKIPS.some((s) => s.familyId === "dilution")).toBe(true);
    expect(getGame("missing")).toBeUndefined();
  });
});

describe("learning paths", () => {
  it("keeps Beginner ids and names real routes", () => {
    expect(BEGINNER_REFLEX_PATH.milestones[0]?.unlockFrom).toEqual([]);
    expect(BEGINNER_REFLEX_PATH.milestones.map((m) => m.id)).toEqual([
      "E4.M1",
      "E4.M2",
      "E4.M3",
      "E4.M0",
      "E5.M2",
    ]);
    for (const node of [...BEGINNER_REFLEX_PATH.milestones, ...OPERATOR_CFO_PATH.milestones]) {
      expect(node.coachTip).toMatch(/\/(drills|guides|cases|coach)/);
      expect(node.coachTip).not.toMatch(/\/archive/);
    }
  });

  it("does not replace Beginner unlocks on the Operator path", () => {
    expect(OPERATOR_CFO_PATH.milestones[0]?.id).toBe("op-feasibility");
    expect(BEGINNER_REFLEX_PATH.milestones.some((m) => m.id.startsWith("op-"))).toBe(false);
  });
});
