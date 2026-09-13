import { describe, expect, it } from "vitest";
import {
  MORE_TRICKS_COVERAGE,
  MORE_TRICKS_MASTER_IDS,
  MORE_TRICKS_SECTION_IDS,
} from "./moreTricksCoverage";
import { allCurriculumFamilyIds } from "./tracks";
import { TRICKS } from "./tricks";

describe("more-tricks coverage map", () => {
  it("covers sections 1–42 and master-1–12 with no duplicate ids", () => {
    const ids = MORE_TRICKS_COVERAGE.map((row) => row.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.filter((id) => /^\d+$/.test(id)).sort((a, b) => Number(a) - Number(b))).toEqual(
      MORE_TRICKS_SECTION_IDS,
    );
    expect(ids.filter((id) => id.startsWith("master-"))).toEqual(MORE_TRICKS_MASTER_IDS);
  });

  it("maps shipped rows to live families and trick ids", () => {
    const families = new Set(allCurriculumFamilyIds());
    const trickIds = new Set(TRICKS.map((trick) => trick.id));
    for (const row of MORE_TRICKS_COVERAGE) {
      expect(row.status === "shipped" || row.status === "skip", row.id).toBe(true);
      for (const familyId of row.familyIds) {
        expect(families.has(familyId), `${row.id} ${familyId}`).toBe(true);
      }
      for (const trickId of row.trickIds ?? []) {
        expect(trickIds.has(trickId), `${row.id} ${trickId}`).toBe(true);
      }
      if (row.status === "skip") {
        expect(row.skipReason, row.id).toMatch(/\S/);
      }
    }
  });
});
