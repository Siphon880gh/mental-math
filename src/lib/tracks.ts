import type { FamilyId } from "./tricks";
import {
  EXTRA_MENTAL_FAMILY_IDS,
  EXTRA_OPERATOR_FAMILY_IDS,
  EXTRA_STARTUP_FAMILY_IDS,
  P0_FAMILY_IDS,
} from "./tricks";

/** A = calculation fluency. B = conversation / planning with stakeholders. */
export type TrackId = "quick" | "stakeholder";

export const TRACK_LABEL: Record<TrackId, string> = {
  quick: "A. Quick math for business and everyday life",
  stakeholder:
    "B. Business and entrepreneurship stakeholder discussion and planning math",
};

export const TRACK_BLURB: Record<TrackId, string> = {
  quick:
    "Shortcuts you run in your head: percents, zeros, complements, divisibility, 80/20, invert revenue.",
  stakeholder:
    "Numbers you use in a planning discussion: runway, NRR, dilution, TAM, stacked infra, concurrency, capacity.",
};

export const TRACK_NAV: Record<TrackId, { href: string; label: string }> = {
  quick: { href: "/track-a", label: "Track A" },
  stakeholder: { href: "/track-b", label: "Track B" },
};

export function hrefForTrack(track: TrackId): string {
  return TRACK_NAV[track].href;
}

const STAKEHOLDER: FamilyId[] = [
  "stacked-founder",
  "cfo-feasibility",
  "cfo-unit-econ",
  "cfo-runway",
  "cfo-growth",
  ...EXTRA_STARTUP_FAMILY_IDS,
  ...EXTRA_OPERATOR_FAMILY_IDS,
];

export const TRACK_A_FAMILY_IDS: FamilyId[] = [
  ...P0_FAMILY_IDS,
  ...EXTRA_MENTAL_FAMILY_IDS,
];

export const TRACK_B_FAMILY_IDS: FamilyId[] = STAKEHOLDER;

export function trackForFamily(familyId: FamilyId): TrackId {
  return STAKEHOLDER.includes(familyId) ? "stakeholder" : "quick";
}

export function allCurriculumFamilyIds(): FamilyId[] {
  return [...TRACK_A_FAMILY_IDS, ...TRACK_B_FAMILY_IDS];
}
