export type FamilyId =
  | "anchors"
  | "magnitude"
  | "percent-shift"
  | "percent-reversible"
  | "percent-tens"
  | "percent-chunks"
  | "percent-tip"
  | "div-by-5"
  | "hour-month"
  | "month-day"
  | "month-year"
  | "break-even"
  | "markup"
  | "stacked-founder"
  | "cfo-feasibility"
  | "cfo-unit-econ"
  | "cfo-runway"
  | "cfo-growth"
  | "left-to-right"
  | "round-compensate"
  | "double-half"
  | "multiply-near"
  | "fraction-percent"
  | "rule-of-72"
  | "mrr-arr"
  | "churn"
  | "nrr"
  | "rule-of-40"
  | "burn-multiple"
  | "cac-payback"
  | "take-rate"
  | "processing-fees"
  | "fully-loaded"
  | "dilution"
  | "tam-fermi";

export type TrickCategory =
  | "Anchors"
  | "Percents"
  | "Conversions"
  | "Business"
  | "Advanced"
  | "Foundations"
  | "Startup";

export interface Trick {
  id: string;
  familyId: FamilyId;
  title: string;
  rule: string;
  example: string;
  category: TrickCategory;
}

/** P0 lookup families — ladder L1–L4. Cases use `stacked-founder` as a pack id. */
export const P0_FAMILY_IDS: FamilyId[] = [
  "anchors",
  "magnitude",
  "percent-shift",
  "percent-reversible",
  "percent-tens",
  "percent-chunks",
  "percent-tip",
  "div-by-5",
  "hour-month",
  "month-day",
  "month-year",
  "break-even",
  "markup",
];

/** Extra arithmetic — not on the Beginner Reflex Path. Source: context/docs-more/Mental Math. */
export const EXTRA_MENTAL_FAMILY_IDS: FamilyId[] = [
  "left-to-right",
  "round-compensate",
  "double-half",
  "multiply-near",
  "fraction-percent",
  "rule-of-72",
];

/** Extra startup metrics — not on the Beginner Reflex Path. Source: context/docs-more/Startup Math. */
export const EXTRA_STARTUP_FAMILY_IDS: FamilyId[] = [
  "mrr-arr",
  "churn",
  "nrr",
  "rule-of-40",
  "burn-multiple",
  "cac-payback",
  "take-rate",
  "processing-fees",
  "fully-loaded",
  "dilution",
  "tam-fermi",
];

export const EXTRA_FAMILY_IDS: FamilyId[] = [
  ...EXTRA_MENTAL_FAMILY_IDS,
  ...EXTRA_STARTUP_FAMILY_IDS,
];

export const TRICKS: Trick[] = [
  {
    id: "anchor-5x4",
    familyId: "anchors",
    title: "Five times four is twenty",
    rule: "Treat 5×4=20 as a chord you already know, then scale zeros.",
    example: "50 × 40 is the same chord with two extra zeros → 2,000.",
    category: "Anchors",
  },
  {
    id: "magnitude-append-zeros",
    familyId: "magnitude",
    title: "Scale by tens by moving zeros",
    rule: "×10 appends a zero; ×100 appends two. Do not recompute the base fact.",
    example: "7 × 8 = 56, so 70 × 8 = 560 and 700 × 8 = 5,600.",
    category: "Anchors",
  },
  {
    id: "percent-1-shift",
    familyId: "percent-shift",
    title: "One percent is two places left",
    rule: "1% of a number is that number with the decimal moved two places left. 10% is one place.",
    example: "1% of 2,000 is 20. 7% of 108: 7×108=756, two places left → 7.56.",
    category: "Percents",
  },
  {
    id: "percent-swap",
    familyId: "percent-reversible",
    title: "Percents swap",
    rule: "A% of B is the same as B% of A. Pick the easier half.",
    example: "14% of 50 is 50% of 14 → 7.",
    category: "Percents",
  },
  {
    id: "percent-tens-drop-zeros",
    familyId: "percent-tens",
    title: "Tens of percent of tens",
    rule: "Drop a zero from each side, multiply, and you already moved two decimal places.",
    example: "30% of 40 → 3 × 4 = 12.",
    category: "Percents",
  },
  {
    id: "percent-chunks",
    familyId: "percent-chunks",
    title: "Build percents from 50 / 25 / 10 / 5",
    rule: "Half, quarter, tenth, and half of a tenth. Add the chunks you need.",
    example: "35% of 2,000 = three tenths (600) plus 5% (100) → 700.",
    category: "Percents",
  },
  {
    id: "percent-tip-20",
    familyId: "percent-tip",
    title: "Twenty percent is double then one place left",
    rule: "×2, then move the decimal one place left (that is ÷10).",
    example: "20% of $42.30 → 84.60 → $8.46.",
    category: "Percents",
  },
  {
    id: "div-by-5-double-shift",
    familyId: "div-by-5",
    title: "Divide by five: double, then shift",
    rule: "×2, then move one place left. Same motion as a 20% tip, different story.",
    example: "1,322 ÷ 5 → 2,644 → 264.4.",
    category: "Conversions",
  },
  {
    id: "hour-month-720",
    familyId: "hour-month",
    title: "Hourly to monthly is ×720",
    rule: "24 × 30 ≈ 720. Hourly cost × 720 ≈ monthly cost.",
    example: "$1/hr → $720/mo. $2/hr → $1,440/mo.",
    category: "Conversions",
  },
  {
    id: "month-day-30",
    familyId: "month-day",
    title: "Monthly to daily is ÷30",
    rule: "A month is about 30 days. Reverse: daily × 30 ≈ monthly.",
    example: "$900/mo → $30/day. $24/day → $720/mo.",
    category: "Conversions",
  },
  {
    id: "month-year-12",
    familyId: "month-year",
    title: "Monthly to yearly is ×12",
    rule: "Twelve months. Yearly to monthly is ÷12. ×12 is ×10 plus ×2.",
    example: "$30/mo → $300 + $60 = $360/year. $2/hr already became $720/mo → ×12 = $8,640/year.",
    category: "Conversions",
  },
  {
    id: "break-even-reduce",
    familyId: "break-even",
    title: "Users needed is cost ÷ price",
    rule: "Reduce both sides by tens first. 3,000 ÷ 50 → 300 ÷ 5 → 60.",
    example: "Cost $3,000, price $50 → 60 users to break even.",
    category: "Business",
  },
  {
    id: "markup-multiple",
    familyId: "markup",
    title: "Markup is price ÷ cost",
    rule: "How many times cost is the price? Subtract 1× to hear the extra as a percent of cost.",
    example: "$2 on $0.33 cost is about 6×, so roughly a 500% markup on cost.",
    category: "Business",
  },
  {
    id: "stacked-founder-chain",
    familyId: "stacked-founder",
    title: "Chain shortcuts in one breath",
    rule: "Hourly ×720 → monthly. Monthly ÷ price → users per box. Track A math inside a Track B sentence.",
    example: "$1/hr and $40/mo → 720÷40 ≈ 18 users per server.",
    category: "Advanced",
  },
  {
    id: "cfo-ceiling",
    familyId: "cfo-feasibility",
    title: "Ceiling is price times possible customers",
    rule: "Max revenue ≈ price × reachable customers. If infra already rivals that ceiling, the model is weak.",
    example: "$20/mo × 10k users = $200k/mo. A $150k cost base is tight.",
    category: "Advanced",
  },
  {
    id: "cfo-ltv-cac",
    familyId: "cfo-unit-econ",
    title: "LTV should be about 3× CAC",
    rule: "Revenue over life versus what you paid to acquire.",
    example: "CAC $40, $20/mo, 3 months → LTV $60 → weak vs 3×.",
    category: "Advanced",
  },
  {
    id: "cfo-runway-div",
    familyId: "cfo-runway",
    title: "Runway is cash divided by burn",
    rule: "Cash ÷ monthly burn. Directional, not a spreadsheet close.",
    example: "$120k cash, $20k burn → 6 months.",
    category: "Advanced",
  },
  {
    id: "cfo-growth-20",
    familyId: "cfo-growth",
    title: "Twenty percent a month is not a 50× year",
    rule: "20%/mo ≈ 1.7× in 3 months, ~3× in 6, ~9× in 12.",
    example: "100 users cannot become 50,000 at 20% in a year (~900).",
    category: "Advanced",
  },
  {
    id: "left-to-right-add",
    familyId: "left-to-right",
    title: "Add left to right",
    rule: "Lock the large place first, then pour in the rest as a running total.",
    example: "47 + 36 → 40+30=70, 7+6=13, total 83.",
    category: "Foundations",
  },
  {
    id: "round-compensate-49x6",
    familyId: "round-compensate",
    title: "Round, then pay it back",
    rule: "Round to an easy number, compute, then compensate with the opposite sign.",
    example: "49 × 6 → 50 × 6 = 300, minus the extra 6 → 294.",
    category: "Foundations",
  },
  {
    id: "double-half-x5",
    familyId: "double-half",
    title: "Times five is times ten, then half",
    rule: "×4 and ×8 are repeated doubles. ×25 is ×100 then ÷4.",
    example: "86 × 5 → 860 / 2 = 430.",
    category: "Foundations",
  },
  {
    id: "multiply-near-x9",
    familyId: "multiply-near",
    title: "Near tens: ×9, ×11, n5 squared",
    rule: "×9 is ×10 minus the number. ×11 parks the digit sum in the middle. n5² is n(n+1) then glue 25.",
    example: "35² → 3×4=12, glue 25 → 1,225.",
    category: "Foundations",
  },
  {
    id: "fraction-percent-eighth",
    familyId: "fraction-percent",
    title: "Common fractions are percents",
    rule: "Memorize 1/2, 1/3, 1/4, 1/5, 1/8, 1/10. Scale from there.",
    example: "1/8 of 800 is 100 (half of 25% of 800, or 800÷8).",
    category: "Foundations",
  },
  {
    id: "rule-of-72-double",
    familyId: "rule-of-72",
    title: "Rule of 72",
    rule: "Years to double ≈ 72 ÷ annual percent rate (compounding).",
    example: "6%/year → 12 years to double. 9% → 8 years.",
    category: "Foundations",
  },
  {
    id: "mrr-arr-x12",
    familyId: "mrr-arr",
    title: "ARR is MRR times twelve",
    rule: "ARR ≈ MRR × 12. One-time fees are not MRR.",
    example: "$80k MRR → about $1M ARR.",
    category: "Startup",
  },
  {
    id: "churn-lifetime",
    familyId: "churn",
    title: "Lifetime months ≈ 1 / monthly churn",
    rule: "5% monthly churn → about 20 months. Do not mix monthly with annual churn.",
    example: "2% monthly → about 50 months.",
    category: "Startup",
  },
  {
    id: "nrr-cohort",
    familyId: "nrr",
    title: "NRR is same-customer revenue later",
    rule: "Ending revenue from a cohort ÷ starting revenue. Expansion can push it over 100%.",
    example: "Start $100k, later $130k from those accounts → 130% NRR.",
    category: "Startup",
  },
  {
    id: "rule-of-40-sum",
    familyId: "rule-of-40",
    title: "Rule of 40",
    rule: "Growth % + margin % should land around 40 or better (later-stage smell test).",
    example: "30% growth and 15% margin → 45, passes.",
    category: "Startup",
  },
  {
    id: "burn-multiple-ratio",
    familyId: "burn-multiple",
    title: "Burn multiple is burn over new ARR",
    rule: "Net burn ÷ net new ARR. 1–2× is efficient; 5×+ is expensive growth.",
    example: "Burn $2M, ARR +$1M → 2×.",
    category: "Startup",
  },
  {
    id: "cac-payback-months",
    familyId: "cac-payback",
    title: "Payback is CAC over monthly gross profit",
    rule: "Aim for ≤12 months. Use profit after COGS, not list price.",
    example: "CAC $240, $40/mo gross profit → 6 months.",
    category: "Startup",
  },
  {
    id: "take-rate-gmv",
    familyId: "take-rate",
    title: "Marketplace revenue is GMV times take",
    rule: "Volume is not revenue. Multiply by the cut.",
    example: "$2M GMV at 15% take → $300k.",
    category: "Startup",
  },
  {
    id: "processing-fees-3pct",
    familyId: "processing-fees",
    title: "Card fees ≈ 2.9% plus 30 cents",
    rule: "Small tickets are a much higher percent. For a smell test, about 3% of volume.",
    example: "$10 charge → ~$0.59 fees. $50k processed → ~$1.5k at 3%.",
    category: "Startup",
  },
  {
    id: "fully-loaded-13",
    familyId: "fully-loaded",
    title: "Fully loaded is salary times 1.3",
    rule: "Benefits and tax are not free. Default load is ×1.3.",
    example: "$120k salary → about $156k loaded.",
    category: "Startup",
  },
  {
    id: "dilution-post-money",
    familyId: "dilution",
    title: "Percent sold is cash over post-money",
    rule: "Post-money = pre-money + cash. Investor % ≈ cash / post.",
    example: "Pre $8M, raise $2M → post $10M, sold 20%. Listen for pre vs post.",
    category: "Startup",
  },
  {
    id: "tam-fermi-stack",
    familyId: "tam-fermi",
    title: "Fermi TAM is customers times yearly price",
    rule: "Stack round numbers, then take a believable slice. Watch for a 10× error in one factor.",
    example: "200k dentists × $600/year → $120M TAM; 1,000 customers is $600k ARR.",
    category: "Startup",
  },
];

export function getTrick(id: string): Trick | undefined {
  return TRICKS.find((trick) => trick.id === id);
}

export function tricksForFamily(familyId: FamilyId): Trick[] {
  return TRICKS.filter((trick) => trick.familyId === familyId);
}
