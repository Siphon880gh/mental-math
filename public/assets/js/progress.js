export const PROGRESS_KEY = "reflex_core_progress_v1";
export const BEGINNER_PATH_ID = "beginner-reflex";
export const OPERATOR_PATH_ID = "operator-cfo";
export const BEGINNER_MILESTONE_IDS = ["E4.M1", "E4.M2", "E4.M3", "E4.M0", "E5.M2"];
export const OPERATOR_MILESTONE_IDS = ["op-feasibility", "op-unit-econ", "op-runway", "op-growth"];
export const FLUENCY_GATE = {
  percents: { minAccuracy: 0.8, medianLatencyMs: 5000 },
  conversions: { minAccuracy: 0.8, medianLatencyMs: 6000 },
};
const PATH_GROUPS = {
  "E4.M1": ["anchors", "magnitude"],
  "E4.M2": ["percents"],
  "E4.M3": ["conversions", "break-even"],
};
const BEGINNER_GROUP_MILESTONE = {
  anchors: "E4.M1",
  magnitude: "E4.M1",
  percents: "E4.M2",
  conversions: "E4.M3",
  "break-even": "E4.M3",
};
const MONEY = new Set(["usd", "dollar", "dollars", "$"]);

function memory() {
  try {
    return localStorage;
  } catch {
    return undefined;
  }
}

export function gradeAnswer(expected, given, unit) {
  if (!Number.isFinite(given) || !Number.isFinite(expected)) return "incorrect";
  if (given === expected) return "correct";
  const money = unit ? MONEY.has(String(unit).toLowerCase()) : false;
  if (money && Math.abs(given - expected) < 1) return "close";
  return "incorrect";
}

export function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

export function fluencyPassed({ accuracy, medianLatencyMs, maxMedianMs, minAccuracy }) {
  return accuracy >= minAccuracy && medianLatencyMs <= maxMedianMs;
}

function seedMilestones() {
  const milestones = {};
  for (const id of BEGINNER_MILESTONE_IDS) milestones[id] = id === "E4.M1" ? "active" : "locked";
  for (const id of OPERATOR_MILESTONE_IDS) {
    milestones[id] = id === "op-feasibility" ? "active" : "locked";
  }
  return milestones;
}

export function defaultProgress() {
  return {
    version: 1,
    pathId: BEGINNER_PATH_ID,
    milestones: seedMilestones(),
    drillScores: {},
    streaks: { current: 0 },
  };
}

function knownPath(pathId) {
  return pathId === BEGINNER_PATH_ID || pathId === OPERATOR_PATH_ID;
}

export function loadProgress() {
  const raw = memory()?.getItem(PROGRESS_KEY);
  if (!raw) return defaultProgress();
  try {
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1 || !knownPath(parsed.pathId)) return defaultProgress();
    const next = defaultProgress();
    next.pathId = parsed.pathId;
    next.drillScores = parsed.drillScores ?? {};
    next.streaks = parsed.streaks ?? { current: 0 };
    for (const id of [...BEGINNER_MILESTONE_IDS, ...OPERATOR_MILESTONE_IDS]) {
      if (parsed.milestones?.[id]) next.milestones[id] = parsed.milestones[id];
    }
    return next;
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(state) {
  memory()?.setItem(PROGRESS_KEY, JSON.stringify(state));
}

export function resetProgress() {
  const next = defaultProgress();
  memory()?.setItem(PROGRESS_KEY, JSON.stringify(next));
  applyDocumentClasses(next);
  return next;
}

export function groupsComplete(state, groupIds) {
  return groupIds.every((id) => state.drillScores[id]?.total);
}

export function isFluencyMet(state) {
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

export function refreshUnlocks(state) {
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
    const id = ops[i];
    if (i === 0 && m[id] !== "complete") m[id] = "active";
    if (m[id] === "complete" && ops[i + 1] && m[ops[i + 1]] !== "complete") {
      m[ops[i + 1]] = "active";
    }
  }
  return { ...state, milestones: m };
}

export function recordDrillGroup(groupId, score) {
  const state = loadProgress();
  state.drillScores[groupId] = score;
  if (score.correct === score.total) state.streaks.current += 1;
  else state.streaks.current = 0;
  const opMap = {
    "cfo-feasibility": "op-feasibility",
    "cfo-unit-econ": "op-unit-econ",
    "cfo-runway": "op-runway",
    "cfo-growth": "op-growth",
  };
  const opId = opMap[groupId];
  if (opId) state.milestones[opId] = "complete";
  const next = refreshUnlocks(state);
  saveProgress(next);
  applyDocumentClasses(next);
  return next;
}

export function recordCaseComplete(packId) {
  const state = loadProgress();
  if (packId === "stacked-founder") state.milestones["E5.M2"] = "complete";
  const next = refreshUnlocks(state);
  saveProgress(next);
  applyDocumentClasses(next);
  return next;
}

export function switchPath(pathId) {
  const state = loadProgress();
  state.pathId = pathId;
  saveProgress(state);
  return state;
}

export function isPathDrillLocked(groupId, state = loadProgress()) {
  const milestone = BEGINNER_GROUP_MILESTONE[groupId];
  if (!milestone) return false;
  return state.milestones[milestone] === "locked";
}

export function areCasesLocked(state = loadProgress()) {
  return state.milestones["E4.M0"] !== "complete";
}

export function appUrl(path) {
  return (window.__reflexBase || "") + path;
}

export function hrefForRef(ref) {
  const [kind, slug] = ref.split(":");
  if (kind === "drill") return appUrl(`/drills/${slug}`);
  if (kind === "guide") return appUrl(`/guides/${slug}`);
  if (kind === "coach") return appUrl(`/coach/${slug}`);
  if (kind === "cases") return appUrl(`/cases?pack=${slug}`);
  if (kind === "game") return appUrl(`/games/${slug}`);
  return appUrl("/track-a");
}

export function applyDocumentClasses(state = loadProgress()) {
  const root = document.documentElement;
  [...root.classList].forEach((cls) => {
    if (cls.startsWith("ms-") && cls.endsWith("-open")) root.classList.remove(cls);
  });
  root.classList.toggle("cases-unlocked", !areCasesLocked(state));
  for (const [id, status] of Object.entries(state.milestones)) {
    if (status && status !== "locked") {
      root.classList.add(`ms-${id.replaceAll(".", "-")}-open`);
    }
  }
}
