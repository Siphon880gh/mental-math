import { describe, expect, it } from "vitest";
import {
  DRILL_GROUPS,
  DRILL_ITEMS,
  PATH_DRILL_GROUP_IDS,
  itemsForGroup,
} from "./drillData";
import { EXTRA_MENTAL_FAMILY_IDS, EXTRA_OPERATOR_FAMILY_IDS, EXTRA_STARTUP_FAMILY_IDS } from "./tricks";
import { allCurriculumFamilyIds } from "./tracks";

describe("drill banks", () => {
  it("has unique item ids", () => {
    const ids = DRILL_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("meets path group floors of 16 and extra group floors of 8", () => {
    for (const id of PATH_DRILL_GROUP_IDS) {
      expect(itemsForGroup(id).length).toBeGreaterThanOrEqual(16);
    }
    for (const id of ["cfo-feasibility", "cfo-unit-econ", "cfo-runway", "cfo-growth", "foundations", "startup", "stacked-founder", "operator"]) {
      expect(itemsForGroup(id).length).toBeGreaterThanOrEqual(8);
    }
    expect(DRILL_GROUPS.filter((g) => g.pathGroup).map((g) => g.id)).toEqual([...PATH_DRILL_GROUP_IDS]);
  });

  it("keeps required familyIds in path groups", () => {
    const percents = itemsForGroup("percents").map((i) => i.familyId);
    for (const id of ["percent-shift", "percent-reversible", "percent-tens", "percent-chunks", "percent-tip"]) {
      expect(percents).toContain(id);
    }
    const conv = itemsForGroup("conversions").map((i) => i.familyId);
    for (const id of ["div-by-5", "hour-month", "month-day", "month-year"]) {
      expect(conv).toContain(id);
    }
    const be = itemsForGroup("break-even").map((i) => i.familyId);
    expect(be).toContain("break-even");
    expect(be).toContain("markup");
  });

  it("represents every extra family and ≥3 items per curriculum family", () => {
    for (const familyId of EXTRA_MENTAL_FAMILY_IDS) {
      expect(DRILL_ITEMS.some((item) => item.familyId === familyId)).toBe(true);
    }
    for (const familyId of EXTRA_STARTUP_FAMILY_IDS) {
      expect(DRILL_ITEMS.some((item) => item.familyId === familyId)).toBe(true);
    }
    for (const familyId of EXTRA_OPERATOR_FAMILY_IDS) {
      expect(DRILL_ITEMS.some((item) => item.familyId === familyId)).toBe(true);
    }
    for (const familyId of allCurriculumFamilyIds()) {
      const n = DRILL_ITEMS.filter((item) => item.familyId === familyId).length;
      expect(n, familyId).toBeGreaterThanOrEqual(3);
    }
  });
});
