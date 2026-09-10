import { FLUENCY_GATE, fluencyPassed, median } from "./grading";

export const PROGRESS_KEY = "reflex_core_progress_v1";
export const BEGINNER_PATH_ID = "beginner-reflex";
export const OPERATOR_PATH_ID = "operator-cfo";

export const BEGINNER_MILESTONE_IDS = [
  "E4.M1",
  "E4.M2",
  "E4.M3",
  "E4.M0",
  "E5.M2",
] as const;

export const OPERATOR_MILESTONE_IDS = [
  "op-feasibility",
  "op-unit-econ",
  "op-runway",
  "op-growth",
] as const;

export type MilestoneId =
  | (typeof BEGINNER_MILESTONE_IDS)[number]
  | (typeof OPERATOR_MILESTONE_IDS)[number];
export type MilestoneStatus = "locked" | "active" | "complete";

export interface DrillGroupScore {
  correct: number;
  total: number;
  medianLatencyMs: number;
}

export interface ProgressState {
  version: 1;
  pathId: string;
  milestones: Record<string, MilestoneStatus>;
  drillScores: Record<string, DrillGroupScore>;
  streaks: { current: number };
}

const PATH_GROUPS: Record<string, string[]> = {
  "E4.M1": ["anchors", "magnitude"],
  "E4.M2": ["percents"],
  "E4.M3": ["conversions", "break-even"],
};

const BEGINNER_GROUP_MILESTONE: Record<string, (typeof BEGINNER_MILESTONE_IDS)[number]> = {
  anchors: "E4.M1",
  magnitude: "E4.M1",
  percents: "E4.M2",
  conversions: "E4.M3",
  "break-even": "E4.M3",
};

let lastRecovery = false;

function memory(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function seedMilestones(): Record<string, MilestoneStatus> {
  const milestones: Record<string, MilestoneStatus> = {};
  for (const id of BEGINNER_MILESTONE_IDS) {
    milestones[id] = id === "E4.M1" ? "active" : "locked";
  }
  for (const id of OPERATOR_MILESTONE_IDS) {
    milestones[id] = id === "op-feasibility" ? "active" : "locked";
  }
  return milestones;
}

export function defaultProgress(): ProgressState {
  return {
    version: 1,
    pathId: BEGINNER_PATH_ID,
    milestones: seedMilestones(),
    drillScores: {},
    streaks: { current: 0 },
  };
}

export function getLastRecovery(): boolean {
  return lastRecovery;
}

function knownPath(pathId: string): boolean {
  return pathId === BEGINNER_PATH_ID || pathId === OPERATOR_PATH_ID;
}

export function loadProgress(): ProgressState {
  lastRecovery = false;
  const raw = memory()?.getItem(PROGRESS_KEY);
  if (!raw) return defaultProgress();
  try {
    const parsed = JSON.parse(raw) as ProgressState;
    if (parsed.version !== 1 || !knownPath(parsed.pathId)) {
      lastRecovery = true;
      return defaultProgress();
    }
    const next = defaultProgress();
    next.pathId = parsed.pathId;
    next.drillScores = parsed.drillScores ?? {};
    next.streaks = parsed.streaks ?? { current: 0 };
    for (const id of [...BEGINNER_MILESTONE_IDS, ...OPERATOR_MILESTONE_IDS]) {
      if (parsed.milestones?.[id]) next.milestones[id] = parsed.milestones[id];
      else lastRecovery = true;
    }
    if (lastRecovery && !parsed.milestones) return defaultProgress();
    return next;
  } catch {
    lastRecovery = true;
    return defaultProgress();
  }
}

export function saveProgress(state: ProgressState): void {
  memory()?.setItem(PROGRESS_KEY, JSON.stringify(state));
}

export function resetProgress(): ProgressState {
  const next = defaultProgress();
  lastRecovery = false;
  memory()?.setItem(PROGRESS_KEY, JSON.stringify(next));
  return next;
}

export function groupsComplete(
  state: ProgressState,
  groupIds: string[],
): boolean {
  return groupIds.every((id) => state.drillScores[id]?.total);
}

export function isFluencyMet(state: ProgressState): boolean {
  const percents = state.drillScores.percents;
  const conversions = state.drillScores.conversions;
  if (!percents || !conversions) return false;
  const pOk = fluencyPassed({
    accuracy: percents.correct / percents.total,
    medianLatencyMs: percents.medianLatencyMs,
    maxMedianMs: FLUENCY_GATE.percents.medianLatencyMs,
    minAccuracy: FLUENCY_GATE.percents.minAccuracy,
  });
  const cOk = fluencyPassed({
    accuracy: conversions.correct / conversions.total,
    medianLatencyMs: conversions.medianLatencyMs,
    maxMedianMs: FLUENCY_GATE.conversions.medianLatencyMs,
    minAccuracy: FLUENCY_GATE.conversions.minAccuracy,
  });
  return pOk && cOk;
}

export function refreshUnlocks(state: ProgressState): ProgressState {
  const m = { ...state.milestones };
  if (groupsComplete(state, PATH_GROUPS["E4.M1"])) m["E4.M1"] = "complete";
  if (m["E4.M1"] === "complete") {
    m["E4.M2"] = groupsComplete(state, PATH_GROUPS["E4.M2"]) ? "complete" : "active";
  }
  if (m["E4.M2"] === "complete") {
    m["E4.M3"] = groupsComplete(state, PATH_GROUPS["E4.M3"]) ? "complete" : "active";
  }
  if (m["E4.M3"] === "complete") {
    m["E4.M0"] = isFluencyMet(state) ? "complete" : "active";
  }
  if (m["E4.M0"] === "complete") {
    if (m["E5.M2"] !== "complete") m["E5.M2"] = "active";
  } else {
    m["E5.M2"] = "locked";
  }

  const ops = [...OPERATOR_MILESTONE_IDS];
  for (let i = 0; i < ops.length; i += 1) {
    const id = ops[i]!;
    if (i === 0 && m[id] !== "complete") m[id] = "active";
    if (m[id] === "complete" && ops[i + 1] && m[ops[i + 1]!] !== "complete") {
      m[ops[i + 1]!] = "active";
    }
  }
  return { ...state, milestones: m };
}

export function recordDrillGroup(
  groupId: string,
  score: DrillGroupScore,
): ProgressState {
  const state = loadProgress();
  state.drillScores[groupId] = score;
  if (score.correct === score.total) state.streaks.current += 1;
  else state.streaks.current = 0;
  const opMap: Record<string, (typeof OPERATOR_MILESTONE_IDS)[number]> = {
    "cfo-feasibility": "op-feasibility",
    "cfo-unit-econ": "op-unit-econ",
    "cfo-runway": "op-runway",
    "cfo-growth": "op-growth",
  };
  const opId = opMap[groupId];
  if (opId) state.milestones[opId] = "complete";
  const next = refreshUnlocks(state);
  saveProgress(next);
  return next;
}

export function recordCaseComplete(packId: string): ProgressState {
  const state = loadProgress();
  if (packId === "stacked-founder") state.milestones["E5.M2"] = "complete";
  const next = refreshUnlocks(state);
  saveProgress(next);
  return next;
}

export function completeOperatorMilestone(id: string): ProgressState {
  const state = loadProgress();
  if (OPERATOR_MILESTONE_IDS.includes(id as (typeof OPERATOR_MILESTONE_IDS)[number])) {
    state.milestones[id] = "complete";
  }
  const next = refreshUnlocks(state);
  saveProgress(next);
  return next;
}

export function switchPath(pathId: string): ProgressState {
  const state = loadProgress();
  state.pathId = pathId;
  saveProgress(state);
  return state;
}

export function isPathDrillLocked(groupId: string, state = loadProgress()): boolean {
  const milestone = BEGINNER_GROUP_MILESTONE[groupId];
  if (!milestone) return false;
  const status = state.milestones[milestone];
  return status === "locked";
}

export function areCasesLocked(state = loadProgress()): boolean {
  return state.milestones["E4.M0"] !== "complete";
}

export { median };
export type { DrillGroupScore as DrillScore };
