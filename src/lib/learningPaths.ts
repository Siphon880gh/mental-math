import {
  BEGINNER_PATH_ID,
  OPERATOR_PATH_ID,
} from "./progressStore";

export interface PathMilestoneNode {
  id: string;
  title: string;
  contentRefs: string[];
  unlockFrom: string[];
  coachTip: string;
}

export interface LearningPathTemplate {
  id: string;
  title: string;
  description: string;
  milestones: PathMilestoneNode[];
}

export const BEGINNER_REFLEX_PATH: LearningPathTemplate = {
  id: BEGINNER_PATH_ID,
  title: "Beginner Reflex Path",
  description:
    "Five-minute Track A fluency, then stacked founder cases. SAMPLE numbers only.",
  milestones: [
    {
      id: "E4.M1",
      title: "Anchors and magnitude",
      contentRefs: ["drill:anchors", "drill:magnitude", "guide:anchors"],
      unlockFrom: [],
      coachTip:
        "Open /drills/anchors, then /drills/magnitude. Track A guides live under /guides.",
    },
    {
      id: "E4.M2",
      title: "Percent shortcuts",
      contentRefs: ["drill:percents", "coach:percent-shift"],
      unlockFrom: ["E4.M1"],
      coachTip:
        "Open /drills/percents. The step-by-step tree is /coach/percent-shift.",
    },
    {
      id: "E4.M3",
      title: "Conversions and break-even",
      contentRefs: ["drill:conversions", "drill:break-even", "guide:hour-month"],
      unlockFrom: ["E4.M2"],
      coachTip:
        "Open /drills/conversions then /drills/break-even. Track A ×720 is /guides/hour-month.",
    },
    {
      id: "E4.M0",
      title: "Timed fluency gate",
      contentRefs: ["drill:percents", "drill:conversions"],
      unlockFrom: ["E4.M3"],
      coachTip:
        "Pass percents (≤5s median) and conversions (≤6s median) at ≥80% on /drills/percents and /drills/conversions. Cases stay locked until both.",
    },
    {
      id: "E5.M2",
      title: "Stacked founder cases",
      contentRefs: ["cases:stacked-founder"],
      unlockFrom: ["E4.M0"],
      coachTip: "Open /cases after the gate. Start with the stacked-founder pack.",
    },
  ],
};

export const OPERATOR_CFO_PATH: LearningPathTemplate = {
  id: OPERATOR_PATH_ID,
  title: "Operator CFO Path",
  description:
    "Stakeholder smell tests. Does not replace Beginner unlocks. Graded cases still need the fluency gate.",
  milestones: [
    {
      id: "op-feasibility",
      title: "Feasibility ceiling",
      contentRefs: ["drill:cfo-feasibility", "cases:cfo-feasibility", "guide:cfo-feasibility"],
      unlockFrom: [],
      coachTip:
        "Open /drills/cfo-feasibility and /cases for the feasibility pack. Track B guide: /guides/cfo-feasibility.",
    },
    {
      id: "op-unit-econ",
      title: "LTV / CAC",
      contentRefs: ["drill:cfo-unit-econ", "cases:cfo-unit-econ"],
      unlockFrom: ["op-feasibility"],
      coachTip: "Open /drills/cfo-unit-econ then the unit-econ cases.",
    },
    {
      id: "op-runway",
      title: "Runway",
      contentRefs: ["drill:cfo-runway", "cases:cfo-runway"],
      unlockFrom: ["op-unit-econ"],
      coachTip: "Open /drills/cfo-runway. Home only names this pack on the Operator path.",
    },
    {
      id: "op-growth",
      title: "Growth claims",
      contentRefs: ["drill:cfo-growth", "cases:cfo-growth", "coach:cfo-growth"],
      unlockFrom: ["op-runway"],
      coachTip:
        "Open /drills/cfo-growth. The 20%/mo table is /coach/cfo-growth. 100 users cannot become 50k in a year.",
    },
  ],
};

export const PATHS = [BEGINNER_REFLEX_PATH, OPERATOR_CFO_PATH];

export function getPathTemplate(pathId: string): LearningPathTemplate {
  return PATHS.find((path) => path.id === pathId) ?? BEGINNER_REFLEX_PATH;
}

export function hrefForRef(ref: string): string {
  const [kind, slug] = ref.split(":");
  if (kind === "drill") return `/drills/${slug}`;
  if (kind === "guide") return `/guides/${slug}`;
  if (kind === "coach") return `/coach/${slug}`;
  if (kind === "cases") return `/cases?pack=${slug}`;
  if (kind === "game") return `/games/${slug}`;
  return "/track-a";
}

export function nextMilestone(
  path: LearningPathTemplate,
  milestones: Record<string, string>,
): PathMilestoneNode | undefined {
  return path.milestones.find((node) => milestones[node.id] !== "complete");
}
