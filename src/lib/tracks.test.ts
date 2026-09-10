import { describe, expect, it } from "vitest";
import {
  allCurriculumFamilyIds,
  hrefForTrack,
  TRACK_A_FAMILY_IDS,
  TRACK_B_FAMILY_IDS,
  trackForFamily,
} from "./tracks";

describe("tracks", () => {
  it("splits every family into A or B with no overlap", () => {
    const all = allCurriculumFamilyIds();
    expect(new Set(all).size).toBe(all.length);
    expect(TRACK_A_FAMILY_IDS.length + TRACK_B_FAMILY_IDS.length).toBe(all.length);
    for (const id of TRACK_A_FAMILY_IDS) {
      expect(trackForFamily(id)).toBe("quick");
    }
    for (const id of TRACK_B_FAMILY_IDS) {
      expect(trackForFamily(id)).toBe("stakeholder");
    }
    expect(hrefForTrack("quick")).toBe("/track-a");
    expect(hrefForTrack("stakeholder")).toBe("/track-b");
  });
});
