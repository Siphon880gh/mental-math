import { describe, expect, it, afterEach } from "vitest";
import {
  PASS_TAGS,
  PASS_TAGS_KEY,
  PASS_FILTERS_KEY,
  resourceMatchesFilters,
  toggleResourceTag,
  toggleSectionFilter,
  clearSectionFilters,
  tagsForResource,
} from "./passTags";

afterEach(() => {
  localStorage.removeItem(PASS_TAGS_KEY);
  localStorage.removeItem(PASS_FILTERS_KEY);
});

describe("pass tags", () => {
  it("has first-pass and second-pass presets", () => {
    expect(PASS_TAGS.filter((t) => t.group === "first-pass").length).toBe(3);
    expect(PASS_TAGS.filter((t) => t.group === "second-pass").length).toBe(4);
  });

  it("ORs selected filters against applied tags", () => {
    toggleResourceTag("guide:anchors", "pass");
    expect(tagsForResource("guide:anchors")).toContain("pass");
    expect(resourceMatchesFilters("guide:anchors", "track-a")).toBe(true);
    toggleSectionFilter("track-a", "extreme");
    expect(resourceMatchesFilters("guide:anchors", "track-a")).toBe(false);
    toggleSectionFilter("track-a", "pass");
    expect(resourceMatchesFilters("guide:anchors", "track-a")).toBe(true);
    clearSectionFilters("track-a");
    expect(resourceMatchesFilters("guide:anchors", "track-a")).toBe(true);
  });
});
