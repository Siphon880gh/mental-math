/**
 * Mini-game registry.
 *
 * Skips (no_mechanic): anchors (pure recall), magnitude (shares decimal-shift
 * with percent-shift), break-even (drill/case),
 * stacked-founder (case), all cfo-* and extra startup families, percent-tens,
 * hour-month / month-day / month-year, markup, extra mental families,
 * percent-tip (shares ×2-then-shift with div-by-5 — only one widget, used on
 * percent-shift shifter instead).
 */
import type { FamilyId } from "./tricks";

export interface GameMeta {
  slug: string;
  title: string;
  summary: string;
  familyId: FamilyId;
  relatedGuide?: string;
}

export const GAMES: GameMeta[] = [
  {
    slug: "decimal-shift",
    title: "Decimal shifter",
    summary: "Move the decimal to make 1% or 10%. Same motion as appending zeros (magnitude).",
    familyId: "percent-shift",
    relatedGuide: "percent-shift",
  },
  {
    slug: "percent-swap",
    title: "Percent swap",
    summary: "Flip A% of B to B% of A, then take the easy chunk.",
    familyId: "percent-reversible",
    relatedGuide: "percent-reversible",
  },
  {
    slug: "percent-chips",
    title: "Percent chips",
    summary: "Build a target with 50 / 25 / 10 / 5 chips.",
    familyId: "percent-chunks",
    relatedGuide: "percent-chunks",
  },
];

export const GAME_SKIPS: { familyId: FamilyId; reason: "no_mechanic" }[] = [
  { familyId: "anchors", reason: "no_mechanic" },
  { familyId: "magnitude", reason: "no_mechanic" },
  { familyId: "percent-tens", reason: "no_mechanic" },
  { familyId: "percent-tip", reason: "no_mechanic" },
  { familyId: "div-by-5", reason: "no_mechanic" },
  { familyId: "hour-month", reason: "no_mechanic" },
  { familyId: "month-day", reason: "no_mechanic" },
  { familyId: "month-year", reason: "no_mechanic" },
  { familyId: "break-even", reason: "no_mechanic" },
  { familyId: "markup", reason: "no_mechanic" },
  { familyId: "stacked-founder", reason: "no_mechanic" },
  { familyId: "cfo-feasibility", reason: "no_mechanic" },
  { familyId: "cfo-unit-econ", reason: "no_mechanic" },
  { familyId: "cfo-runway", reason: "no_mechanic" },
  { familyId: "cfo-growth", reason: "no_mechanic" },
  { familyId: "left-to-right", reason: "no_mechanic" },
  { familyId: "round-compensate", reason: "no_mechanic" },
  { familyId: "double-half", reason: "no_mechanic" },
  { familyId: "multiply-near", reason: "no_mechanic" },
  { familyId: "fraction-percent", reason: "no_mechanic" },
  { familyId: "rule-of-72", reason: "no_mechanic" },
  { familyId: "mrr-arr", reason: "no_mechanic" },
  { familyId: "churn", reason: "no_mechanic" },
  { familyId: "nrr", reason: "no_mechanic" },
  { familyId: "rule-of-40", reason: "no_mechanic" },
  { familyId: "burn-multiple", reason: "no_mechanic" },
  { familyId: "cac-payback", reason: "no_mechanic" },
  { familyId: "take-rate", reason: "no_mechanic" },
  { familyId: "processing-fees", reason: "no_mechanic" },
  { familyId: "fully-loaded", reason: "no_mechanic" },
  { familyId: "dilution", reason: "no_mechanic" },
  { familyId: "tam-fermi", reason: "no_mechanic" },
];

export function getGame(slug: string): GameMeta | undefined {
  return GAMES.find((game) => game.slug === slug);
}
