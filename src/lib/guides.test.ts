import { describe, expect, it } from "vitest";
import {
  extraFamilyIdsMissingGuides,
  familyIdsMissingGuides,
  getGuide,
  GUIDES,
  guidesForTrack,
} from "./guides";
import { allCurriculumFamilyIds } from "./tracks";

describe("guides catalog", () => {
  it("has a guide for every curriculum family, Track A then Track B", () => {
    expect(familyIdsMissingGuides()).toEqual([]);
    expect(extraFamilyIdsMissingGuides()).toEqual([]);
    expect(GUIDES.map((guide) => guide.familyId)).toEqual(allCurriculumFamilyIds());
  });

  it("labels tracks", () => {
    expect(guidesForTrack("quick").every((guide) => guide.track === "quick")).toBe(
      true,
    );
    expect(
      guidesForTrack("stakeholder").every((guide) => guide.track === "stakeholder"),
    ).toBe(true);
    expect(getGuide("anchors")?.track).toBe("quick");
    expect(getGuide("dilution")?.track).toBe("stakeholder");
    expect(getGuide("anchors")?.relatedCoachSlug).toBe("anchors");
  });

  it("round-trips getGuide and keeps lesson body", () => {
    const guide = getGuide("rule-of-72");
    expect(guide?.familyId).toBe("rule-of-72");
    expect(guide?.body).toMatch(/72 ÷/i);
    expect(getGuide("missing")).toBeUndefined();
  });
});
