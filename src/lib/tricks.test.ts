import { describe, expect, it } from "vitest";
import { allCurriculumFamilyIds } from "./tracks";
import { EXTRA_FAMILY_IDS, P0_FAMILY_IDS, TRICKS, getTrick, tricksForFamily } from "./tricks";

describe("tricks catalog", () => {
  it("has unique ids", () => {
    const ids = TRICKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("seeds at least one trick per P0 family", () => {
    for (const familyId of P0_FAMILY_IDS) {
      expect(tricksForFamily(familyId).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("seeds at least one trick per extra docs-more family", () => {
    for (const familyId of EXTRA_FAMILY_IDS) {
      expect(tricksForFamily(familyId).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("seeds at least one shortcut per curriculum family", () => {
    for (const familyId of allCurriculumFamilyIds()) {
      expect(tricksForFamily(familyId).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("round-trips getTrick", () => {
    const first = TRICKS[0];
    expect(getTrick(first.id)).toEqual(first);
    expect(getTrick("missing")).toBeUndefined();
  });
});
