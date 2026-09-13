import type { FamilyId } from "./tricks";
import { EXTRA_FAMILY_IDS } from "./tricks";
import { INLINE_GUIDE_BODIES, INLINE_GUIDE_SUMMARIES } from "./ladderGuides";
import {
  allCurriculumFamilyIds,
  trackForFamily,
  type TrackId,
} from "./tracks";

const rawByPath = import.meta.glob("../../context/docs-more/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export interface Guide {
  slug: string;
  familyId: FamilyId;
  title: string;
  summary: string;
  body: string;
  track: TrackId;
  source: "inline" | "docs-more";
  relatedCoachSlug: string;
}

const SPECS: { slug: string; familyId: FamilyId; file: string; summary: string }[] = [
  {
    slug: "left-to-right",
    familyId: "left-to-right",
    file: "Left-to-right addition.md",
    summary: "Add and subtract from the large place first, as a running total.",
  },
  {
    slug: "round-compensate",
    familyId: "round-compensate",
    file: "Round then compensate.md",
    summary: "Round to an easy number, then pay back the difference.",
  },
  {
    slug: "double-half",
    familyId: "double-half",
    file: "Doubling and halving.md",
    summary: "×4 and ×8 by doubling; ×5 is ×10 then half.",
  },
  {
    slug: "multiply-near",
    familyId: "multiply-near",
    file: "Multiply near ten or hundred.md",
    summary: "×9, ×11, near-100, and squares that end in 5.",
  },
  {
    slug: "fraction-percent",
    familyId: "fraction-percent",
    file: "Fractions as percents.md",
    summary: "A small table of fractions that show up as percents.",
  },
  {
    slug: "rule-of-72",
    familyId: "rule-of-72",
    file: "Rule of 72.md",
    summary: "Years to double ≈ 72 ÷ the annual percent rate.",
  },
  {
    slug: "mrr-arr",
    familyId: "mrr-arr",
    file: "MRR and ARR.md",
    summary: "ARR is MRR × 12. One-time revenue is not MRR.",
  },
  {
    slug: "churn",
    familyId: "churn",
    file: "Churn and lifetime months.md",
    summary: "Lifetime months ≈ 1 / monthly churn.",
  },
  {
    slug: "nrr",
    familyId: "nrr",
    file: "Net revenue retention.md",
    summary: "Same-customer revenue later, including expansion.",
  },
  {
    slug: "rule-of-40",
    familyId: "rule-of-40",
    file: "Rule of 40.md",
    summary: "Growth percent plus margin percent, later-stage smell test.",
  },
  {
    slug: "burn-multiple",
    familyId: "burn-multiple",
    file: "Burn multiple.md",
    summary: "Net burn divided by net new ARR.",
  },
  {
    slug: "cac-payback",
    familyId: "cac-payback",
    file: "CAC payback.md",
    summary: "Months until gross profit returns CAC. Aim for ≤12.",
  },
  {
    slug: "take-rate",
    familyId: "take-rate",
    file: "Marketplace take rate.md",
    summary: "Revenue is GMV times the take, not the volume.",
  },
  {
    slug: "processing-fees",
    familyId: "processing-fees",
    file: "Processing fees.md",
    summary: "About 2.9% plus 30 cents per charge; ~3% as a smell test.",
  },
  {
    slug: "fully-loaded",
    familyId: "fully-loaded",
    file: "Fully loaded headcount.md",
    summary: "Salary × 1.3 is the default loaded cost.",
  },
  {
    slug: "dilution",
    familyId: "dilution",
    file: "Dilution and post-money.md",
    summary: "Percent sold is cash divided by post-money.",
  },
  {
    slug: "tam-fermi",
    familyId: "tam-fermi",
    file: "Fermi TAM.md",
    summary: "Customers × yearly price, then a believable slice.",
  },
  {
    slug: "divisibility",
    familyId: "divisibility",
    file: "Divisibility.md",
    summary: "Last digits, digit sums, and the alternating-11 test.",
  },
  {
    slug: "criss-cross",
    familyId: "criss-cross",
    file: "Criss-cross.md",
    summary: "Two-digit multiply: ones, cross, tens. Carry as you go.",
  },
  {
    slug: "difference-squares",
    familyId: "difference-squares",
    file: "Difference of squares.md",
    summary: "Equally far from a center is a² − b².",
  },
  {
    slug: "easy-division",
    familyId: "easy-division",
    file: "Easy division.md",
    summary: "Rewrite ÷ as ×, factor the divisor, or scale both sides.",
  },
  {
    slug: "complements",
    familyId: "complements",
    file: "Complements.md",
    summary: "What is missing to 10 or 100. Pair long sums. Gauss.",
  },
  {
    slug: "equal-adjust",
    familyId: "equal-adjust",
    file: "Equal adjustment.md",
    summary: "Add the same to both sides of a subtract.",
  },
  {
    slug: "cross-cancel",
    familyId: "cross-cancel",
    file: "Cross-cancel.md",
    summary: "Cancel factors first. Compare fractions by cross products.",
  },
  {
    slug: "cast-nines",
    familyId: "cast-nines",
    file: "Casting nines.md",
    summary: "Digit root and last-digit checks. A fail proves wrong.",
  },
  {
    slug: "approx-sqrt",
    familyId: "approx-sqrt",
    file: "Approximate square roots.md",
    summary: "Nearby square plus d/2a, or one Babylonian average.",
  },
  {
    slug: "regroup-factors",
    familyId: "regroup-factors",
    file: "Regroup factors.md",
    summary: "Pair factors that make 10 or 100 before you grind.",
  },
];

function bodyFor(file: string): string {
  const entry = Object.entries(rawByPath).find(([path]) => path.endsWith(file));
  if (!entry) {
    throw new Error(`Missing docs-more lesson: ${file}`);
  }
  return entry[1];
}

function titleFromBody(body: string, fallback: string): string {
  const line = body.split("\n").find((row) => row.startsWith("# "));
  return line ? line.slice(2).trim() : fallback;
}

function withTrack(
  guide: Omit<Guide, "track" | "relatedCoachSlug">,
): Guide {
  return {
    ...guide,
    track: trackForFamily(guide.familyId),
    relatedCoachSlug: guide.familyId,
  };
}

const DOCS_MORE_GUIDES: Guide[] = SPECS.map((spec) => {
  const body = bodyFor(spec.file);
  return withTrack({
    slug: spec.slug,
    familyId: spec.familyId,
    title: titleFromBody(body, spec.slug),
    summary: spec.summary,
    body,
    source: "docs-more",
  });
});

const INLINE_GUIDES: Guide[] = Object.keys(INLINE_GUIDE_BODIES).map((slug) => {
  const body = INLINE_GUIDE_BODIES[slug];
  return withTrack({
    slug,
    familyId: slug as FamilyId,
    title: titleFromBody(body, slug),
    summary: INLINE_GUIDE_SUMMARIES[slug] ?? slug,
    body,
    source: "inline",
  });
});

const bySlug = new Map(
  [...INLINE_GUIDES, ...DOCS_MORE_GUIDES].map((guide) => [guide.slug, guide]),
);

export const GUIDES: Guide[] = allCurriculumFamilyIds().map((familyId) => {
  const guide = bySlug.get(familyId);
  if (!guide) {
    throw new Error(`Missing guide for family ${familyId}`);
  }
  return guide;
});

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function guidesForFamily(familyId: FamilyId): Guide[] {
  return GUIDES.filter((guide) => guide.familyId === familyId);
}

export function guideForFamily(familyId: FamilyId): Guide | undefined {
  return getGuide(familyId) ?? guidesForFamily(familyId)[0];
}

/** Lesson URL for a skill / family. Null only if the catalog is missing that family. */
export function hrefForFamilyGuide(familyId: FamilyId): string | null {
  const guide = guideForFamily(familyId);
  return guide ? `/guides/${guide.slug}` : null;
}

export function guidesForTrack(track: TrackId): Guide[] {
  return GUIDES.filter((guide) => guide.track === track);
}

export function extraFamilyIdsMissingGuides(): FamilyId[] {
  return EXTRA_FAMILY_IDS.filter((id) => guidesForFamily(id).length === 0);
}

export function familyIdsMissingGuides(): FamilyId[] {
  return allCurriculumFamilyIds().filter((id) => guidesForFamily(id).length === 0);
}
