import { afterEach, describe, expect, it } from "vitest";
import {
  BEGINNER_MILESTONE_IDS,
  PROGRESS_KEY,
  areCasesLocked,
  defaultProgress,
  getLastRecovery,
  loadProgress,
  refreshUnlocks,
  resetProgress,
  saveProgress,
} from "./progressStore";

afterEach(() => {
  localStorage.clear();
});

describe("progressStore", () => {
  it("defaults E4.M1 active and later milestones locked, including the fluency gate", () => {
    const state = defaultProgress();
    expect(BEGINNER_MILESTONE_IDS).toContain("E4.M0");
    expect(state.milestones["E4.M1"]).toBe("active");
    expect(state.milestones["E4.M0"]).toBe("locked");
    expect(state.milestones["E5.M2"]).toBe("locked");
    expect(state.version).toBe(1);
  });

  it("round-trips through localStorage", () => {
    const state = defaultProgress();
    state.streaks.current = 3;
    saveProgress(state);
    expect(localStorage.getItem(PROGRESS_KEY)).toContain("beginner-reflex");
    const loaded = loadProgress();
    expect(loaded.streaks.current).toBe(3);
    expect(getLastRecovery()).toBe(false);
  });

  it("resets corrupt JSON and flags recovery", () => {
    localStorage.setItem(PROGRESS_KEY, "{not-json");
    const loaded = loadProgress();
    expect(loaded.milestones["E4.M1"]).toBe("active");
    expect(getLastRecovery()).toBe(true);
  });

  it("resetProgress returns first-run state", () => {
    const dirty = defaultProgress();
    dirty.streaks.current = 9;
    saveProgress(dirty);
    const fresh = resetProgress();
    expect(fresh.streaks.current).toBe(0);
    expect(loadProgress().streaks.current).toBe(0);
  });

  it("does not complete the fluency gate on slow medians", () => {
    const state = defaultProgress();
    state.drillScores = {
      anchors: { correct: 16, total: 16, medianLatencyMs: 1000 },
      magnitude: { correct: 16, total: 16, medianLatencyMs: 1000 },
      percents: { correct: 16, total: 16, medianLatencyMs: 9000 },
      conversions: { correct: 16, total: 16, medianLatencyMs: 1000 },
      "break-even": { correct: 16, total: 16, medianLatencyMs: 1000 },
    };
    const next = refreshUnlocks(state);
    expect(next.milestones["E4.M3"]).toBe("complete");
    expect(next.milestones["E4.M0"]).toBe("active");
    expect(areCasesLocked(next)).toBe(true);
  });
});
