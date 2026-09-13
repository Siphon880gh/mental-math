import type { FamilyId } from "./tricks";

export type ThinkingMode =
  | "infra_chain"
  | "break_even"
  | "conversion_funnel"
  | "markup_read"
  | "smell_test"
  | "runway"
  | "ltv_cac"
  | "growth_claim"
  | "nrr_read"
  | "rule_of_40"
  | "burn_multiple"
  | "payback"
  | "take_rate"
  | "fees"
  | "loaded_cost"
  | "dilution"
  | "tam_fermi";

export type CaseDifficulty = "beginner" | "intermediate";

export type CasePackId =
  | "stacked-founder"
  | "cfo-feasibility"
  | "cfo-unit-econ"
  | "cfo-runway"
  | "cfo-growth"
  | "startup-efficiency"
  | "startup-marketplace"
  | "startup-people-capital";

export interface CaseStudy {
  id: string;
  packId: CasePackId;
  familyId: FamilyId;
  thinkingMode: ThinkingMode;
  prompt: string;
  expectedAnswer: number;
  unit?: string;
  thoughtChain: string[];
  difficulty: CaseDifficulty;
}

export const CASE_PACKS: { id: CasePackId; title: string; summary: string }[] = [
  { id: "stacked-founder", title: "Stacked founder", summary: "Track A shortcuts in one planning sentence." },
  { id: "cfo-feasibility", title: "CFO feasibility", summary: "Ceiling vs cost scale." },
  { id: "cfo-unit-econ", title: "CFO unit economics", summary: "LTV versus CAC." },
  { id: "cfo-runway", title: "CFO runway", summary: "Cash divided by burn." },
  { id: "cfo-growth", title: "CFO growth claims", summary: "20%/mo is not a 50× year." },
  { id: "startup-efficiency", title: "Startup efficiency", summary: "Rule of 40, burn, payback." },
  { id: "startup-marketplace", title: "Marketplace", summary: "Take rate and processing fees." },
  { id: "startup-people-capital", title: "People and capital", summary: "Loaded cost, dilution, TAM, NRR." },
];

function c(
  id: string,
  packId: CasePackId,
  familyId: FamilyId,
  thinkingMode: ThinkingMode,
  difficulty: CaseDifficulty,
  prompt: string,
  expectedAnswer: number,
  thoughtChain: string[],
  unit?: string,
): CaseStudy {
  return { id, packId, familyId, thinkingMode, prompt, expectedAnswer, thoughtChain, difficulty, unit };
}

export const CASES: CaseStudy[] = [
  c("sf-gpu-18", "stacked-founder", "hour-month", "infra_chain", "beginner",
    "SAMPLE: cofounder says the GPU is $1/hr and we charge $40/mo. How many paying users cover one box?",
    18, ["Hourly ×720 → $720/mo", "720 ÷ 40 ≈ 18 users"], "users"),
  c("sf-be-60", "stacked-founder", "break-even", "break_even", "beginner",
    "SAMPLE: ads plus tools are $3,000 this month. Price is $50. Users to break even?",
    60, ["Users = cost ÷ price", "3,000÷50 → 300÷5 = 60"], "users"),
  c("sf-funnel-500", "stacked-founder", "percent-shift", "conversion_funnel", "beginner",
    "SAMPLE: 10,000 visitors, about 5% convert. Paying customers?",
    500, ["1% of 10k = 100", "5% = 500"], "customers"),
  c("sf-markup-3", "stacked-founder", "markup", "markup_read", "beginner",
    "SAMPLE: we buy at $20 and sell at $60. What multiple of cost is price?",
    3, ["Markup is price ÷ cost", "60÷20 = 3×"]),
  c("sf-day-30", "stacked-founder", "month-day", "infra_chain", "beginner",
    "SAMPLE: the bill is $900/mo. What daily burn should we quote?",
    30, ["Monthly ÷ 30 ≈ daily", "900÷30 = $30"], "usd"),
  c("sf-year-360", "stacked-founder", "month-year", "infra_chain", "beginner",
    "SAMPLE: $30/mo plan. Investor asks yearly revenue per seat.",
    360, ["Monthly ×12", "30×12 = $360"], "usd"),
  c("sf-be-20", "stacked-founder", "break-even", "break_even", "beginner",
    "SAMPLE: studio rent $1,000, tickets $50. Heads to cover rent?",
    20, ["1,000÷50 = 20"], "users"),
  c("sf-tip-funnel", "stacked-founder", "percent-chunks", "conversion_funnel", "beginner",
    "SAMPLE: 800 trial users, 15% pay. Customers?",
    120, ["10% of 800 = 80", "5% = 40", "120"], "customers"),
  c("sf-int-chain", "stacked-founder", "stacked-founder", "infra_chain", "intermediate",
    "SAMPLE: $2/hr GPU, $40/mo product. Users per server is 1,440÷40=36. Enter the yearly cost of that box.",
    17280, ["$2×720 = $1,440/mo", "1,440÷40 = 36 users (not the answer)", "1,440×12 = $17,280/year"], "usd"),
  c("sf-int-be-markup", "stacked-founder", "markup", "markup_read", "intermediate",
    "SAMPLE: cost $20, we want 5× markup. Price, then users if fixed cost is $2,000?",
    20, ["Price = 20×5 = $100", "Users = 2,000÷100 = 20", "5× is price÷cost"], "users"),
  c("sf-int-funnel-rev", "stacked-founder", "percent-reversible", "conversion_funnel", "intermediate",
    "SAMPLE: 8% of 25k visitors buy a $40 plan. Customers, then monthly revenue?",
    80000, ["8% of 25k = 25% of 8k = 2,000 customers", "2,000×$40 = $80,000", "Swap percents first"], "usd"),
  c("sf-int-720-be", "stacked-founder", "hour-month", "break_even", "intermediate",
    "SAMPLE: $0.50/hr instance, price $20/mo. Users per instance?",
    18, ["0.50×720 = $360/mo", "360÷20 = 18", "Same 18 shape as $1/hr at $40"], "users"),
  c("sf-booth-30", "stacked-founder", "break-even", "break_even", "beginner",
    "SAMPLE: conference booth $2,400, tickets $80. Heads to cover the booth?",
    30, ["2,400÷80 = 30"], "users"),

  c("cf-200k", "cfo-feasibility", "cfo-feasibility", "smell_test", "beginner",
    "SAMPLE: $20/mo, 10k possible customers. Monthly ceiling?",
    200000, ["Ceiling = price × reachable customers", "20×10k = $200k"], "usd"),
  c("cf-50k", "cfo-feasibility", "cfo-feasibility", "smell_test", "beginner",
    "SAMPLE: $50 product, 1,000 buyers. Ceiling?",
    50000, ["50×1,000 = $50k"], "usd"),
  c("cf-1m", "cfo-feasibility", "cfo-feasibility", "smell_test", "beginner",
    "SAMPLE: $100 × 10k users. Ceiling?",
    1000000, ["100×10k = $1M"], "usd"),
  c("cf-30k", "cfo-feasibility", "cfo-feasibility", "smell_test", "beginner",
    "SAMPLE: niche of 2,000, $15/mo. Max monthly?",
    30000, ["2,000×15 = $30k"], "usd"),
  c("cf-72k", "cfo-feasibility", "cfo-feasibility", "smell_test", "beginner",
    "SAMPLE: $9 × 8,000 seats.",
    72000, ["9×8,000 = $72k"], "usd"),
  c("cf-20k", "cfo-feasibility", "cfo-feasibility", "smell_test", "beginner",
    "SAMPLE: $40 × 500 users.",
    20000, ["40×500 = $20k"], "usd"),
  c("cf-int-tight", "cfo-feasibility", "cfo-feasibility", "smell_test", "intermediate",
    "SAMPLE: $20×10k ceiling is $200k. Infra is already $150k. Leftover dollars before people?",
    50000, ["200k − 150k = $50k", "Tight vs the ceiling", "Not a fat margin"], "usd"),
  c("cf-int-3m", "cfo-feasibility", "cfo-feasibility", "smell_test", "intermediate",
    "SAMPLE: $30 × 100k. Ceiling?",
    3000000, ["30×100k = $3M"], "usd"),
  c("cf-int-room", "cfo-feasibility", "cfo-feasibility", "smell_test", "intermediate",
    "SAMPLE: same $200k ceiling, infra $5k. Infra as a percent of ceiling?",
    2.5, ["5k / 200k = 2.5%", "Room to operate"]),
  c("cf-12-5k", "cfo-feasibility", "cfo-feasibility", "smell_test", "beginner",
    "SAMPLE: $12/mo, 5,000 possible seats. Monthly ceiling?",
    60000, ["12×5,000 = $60k"], "usd"),

  c("ue-ltv-60", "cfo-unit-econ", "cfo-unit-econ", "ltv_cac", "beginner",
    "SAMPLE: $20/mo, they stay 3 months. LTV?",
    60, ["LTV ≈ price × months", "20×3 = $60"], "usd"),
  c("ue-ratio-15", "cfo-unit-econ", "cfo-unit-econ", "ltv_cac", "beginner",
    "SAMPLE: LTV $60, CAC $40. Ratio?",
    1.5, ["60÷40 = 1.5×", "Thin vs ~3×"]),
  c("ue-ratio-3", "cfo-unit-econ", "cfo-unit-econ", "ltv_cac", "beginner",
    "SAMPLE: LTV $120, CAC $40.",
    3, ["120÷40 = 3×"]),
  c("ue-ltv-100", "cfo-unit-econ", "cfo-unit-econ", "ltv_cac", "beginner",
    "SAMPLE: $25/mo, 4 months.",
    100, ["25×4 = $100"], "usd"),
  c("ue-ltv-300", "cfo-unit-econ", "cfo-unit-econ", "ltv_cac", "beginner",
    "SAMPLE: $50/mo, 6 months.",
    300, ["50×6 = $300"], "usd"),
  c("ue-ratio-25", "cfo-unit-econ", "cfo-unit-econ", "ltv_cac", "beginner",
    "SAMPLE: LTV $100, CAC $40.",
    2.5, ["100÷40 = 2.5×"]),
  c("ue-int-need", "cfo-unit-econ", "cfo-unit-econ", "ltv_cac", "intermediate",
    "SAMPLE: CAC $40. LTV needed for 3×?",
    120, ["3×40 = $120"], "usd"),
  c("ue-int-life", "cfo-unit-econ", "cfo-unit-econ", "ltv_cac", "intermediate",
    "SAMPLE: $20/mo, CAC $40, want 3×. Months of life needed?",
    6, ["Need LTV $120", "120÷20 = 6 months"]),
  c("ue-int-90", "cfo-unit-econ", "cfo-unit-econ", "ltv_cac", "intermediate",
    "SAMPLE: LTV $90, CAC $30.",
    3, ["90÷30 = 3×"]),
  c("ue-40x5", "cfo-unit-econ", "cfo-unit-econ", "ltv_cac", "beginner",
    "SAMPLE: $40/mo, they stay 5 months. LTV?",
    200, ["40×5 = $200"], "usd"),

  c("rw-6", "cfo-runway", "cfo-runway", "runway", "beginner",
    "SAMPLE: $120k in the bank, $20k burn. Months?",
    6, ["Runway = cash ÷ burn", "120÷20 = 6"]),
  c("rw-2", "cfo-runway", "cfo-runway", "runway", "beginner",
    "SAMPLE: $50k cash, $25k burn.",
    2, ["50÷25 = 2"]),
  c("rw-6b", "cfo-runway", "cfo-runway", "runway", "beginner",
    "SAMPLE: $90k cash, $15k burn.",
    6, ["90÷15 = 6"]),
  c("rw-8", "cfo-runway", "cfo-runway", "runway", "beginner",
    "SAMPLE: $80k cash, $10k burn.",
    8, ["80÷10 = 8"]),
  c("rw-3", "cfo-runway", "cfo-runway", "runway", "beginner",
    "SAMPLE: $36k cash, $12k burn.",
    3, ["36÷12 = 3"]),
  c("rw-5", "cfo-runway", "cfo-runway", "runway", "beginner",
    "SAMPLE: $45k cash, $9k burn.",
    5, ["45÷9 = 5"]),
  c("rw-int-hire", "cfo-runway", "cfo-runway", "runway", "intermediate",
    "SAMPLE: $120k cash. Burn today $20k. A hire adds $5k. New runway months?",
    4.8, ["New burn $25k", "120÷25 = 4.8"]),
  c("rw-int-8", "cfo-runway", "cfo-runway", "runway", "intermediate",
    "SAMPLE: $200k cash, $25k burn.",
    8, ["200÷25 = 8"]),
  c("rw-int-cut", "cfo-runway", "cfo-runway", "runway", "intermediate",
    "SAMPLE: $60k cash. Cut burn from $20k to $10k. Months after the cut?",
    6, ["60÷10 = 6"]),
  c("rw-10", "cfo-runway", "cfo-runway", "runway", "beginner",
    "SAMPLE: $100k cash, $10k burn. Months?",
    10, ["100÷10 = 10"]),

  c("gr-900", "cfo-growth", "cfo-growth", "growth_claim", "beginner",
    "SAMPLE: 100 users at 20%/mo. About how many in 12 months?",
    900, ["20%/mo ≈ 9× in 12 months", "100×9 ≈ 900"], "users"),
  c("gr-impossible", "cfo-growth", "cfo-growth", "growth_claim", "beginner",
    "SAMPLE: they claim 100 → 50,000 in 12 months at 20%/mo. What does the 20% table actually give?",
    900, ["20% table: ~9× in a year", "100×9 ≈ 900, not 50,000"], "users"),
  c("gr-170", "cfo-growth", "cfo-growth", "growth_claim", "beginner",
    "SAMPLE: 100 users, 20%/mo, 3 months. About?",
    170, ["3 months ≈ 1.7×", "170"], "users"),
  c("gr-300", "cfo-growth", "cfo-growth", "growth_claim", "beginner",
    "SAMPLE: 100 users, 20%/mo, 6 months.",
    300, ["6 months ≈ 3×", "300"], "users"),
  c("gr-1800", "cfo-growth", "cfo-growth", "growth_claim", "beginner",
    "SAMPLE: 200 users × ~9 in a year.",
    1800, ["200×9 = 1,800"], "users"),
  c("gr-450", "cfo-growth", "cfo-growth", "growth_claim", "beginner",
    "SAMPLE: 50 users × ~9 in a year.",
    450, ["50×9 = 450"], "users"),
  c("gr-int-gap", "cfo-growth", "cfo-growth", "growth_claim", "intermediate",
    "SAMPLE: claimed 50,000 vs table 900 from 100 users. How many times too high?",
    56, ["50,000 ÷ 900 ≈ 55–56×", "Order-of-magnitude miss"]),
  c("gr-int-start", "cfo-growth", "cfo-growth", "growth_claim", "intermediate",
    "SAMPLE: want ~900 in a year at 20%/mo. Starting users?",
    100, ["900 ÷ 9 ≈ 100"], "users"),
  c("gr-int-68", "cfo-growth", "cfo-growth", "growth_claim", "intermediate",
    "SAMPLE: 40 users × 1.7 in 3 months.",
    68, ["40×1.7 = 68"], "users"),
  c("gr-2250", "cfo-growth", "cfo-growth", "growth_claim", "beginner",
    "SAMPLE: 250 users × ~9 in a year at 20%/mo.",
    2250, ["250×9 = 2,250"], "users"),

  c("ef-45", "startup-efficiency", "rule-of-40", "rule_of_40", "beginner",
    "SAMPLE: 30% growth, 15% margin. Rule of 40 sum?",
    45, ["30+15=45", "Passes ~40"]),
  c("ef-30", "startup-efficiency", "rule-of-40", "rule_of_40", "beginner",
    "SAMPLE: 80% growth, −50% margin.",
    30, ["80−50=30", "Misses 40"]),
  c("ef-burn-2", "startup-efficiency", "burn-multiple", "burn_multiple", "beginner",
    "SAMPLE: burn $2M, net new ARR $1M. Multiple?",
    2, ["2÷1=2×"]),
  c("ef-burn-5", "startup-efficiency", "burn-multiple", "burn_multiple", "beginner",
    "SAMPLE: burn $5M, new ARR $1M.",
    5, ["5÷1=5×", "Expensive growth"]),
  c("ef-pay-6", "startup-efficiency", "cac-payback", "payback", "beginner",
    "SAMPLE: CAC $240, $40/mo gross profit. Months?",
    6, ["240÷40=6", "Inside ≤12"]),
  c("ef-pay-16", "startup-efficiency", "cac-payback", "payback", "beginner",
    "SAMPLE: CAC $240, $15/mo GP.",
    16, ["240÷15=16", "Misses ≤12"]),
  c("ef-int-55", "startup-efficiency", "rule-of-40", "rule_of_40", "intermediate",
    "SAMPLE: 40% growth + 15% margin.",
    55, ["40+15=55"]),
  c("ef-int-1", "startup-efficiency", "burn-multiple", "burn_multiple", "intermediate",
    "SAMPLE: burn $1.5M, new ARR $1.5M.",
    1, ["1.5/1.5=1×"]),
  c("ef-int-12", "startup-efficiency", "cac-payback", "payback", "intermediate",
    "SAMPLE: CAC $120, GP $10/mo.",
    12, ["120÷10=12", "On the ≤12 line"]),
  c("ef-50", "startup-efficiency", "rule-of-40", "rule_of_40", "beginner",
    "SAMPLE: 25% growth, 25% margin. Rule of 40 sum?",
    50, ["25+25=50", "Passes ~40"]),

  c("mp-300k", "startup-marketplace", "take-rate", "take_rate", "beginner",
    "SAMPLE: $2M GMV, 15% take. Revenue?",
    300000, ["GMV × take, not GMV", "10%=200k + 5%=100k → $300k"], "usd"),
  c("mp-100k", "startup-marketplace", "take-rate", "take_rate", "beginner",
    "SAMPLE: $1M GMV, 10% take.",
    100000, ["10% of 1M = $100k"], "usd"),
  c("mp-100k-20", "startup-marketplace", "take-rate", "take_rate", "beginner",
    "SAMPLE: $500k GMV, 20% take.",
    100000, ["20% of 500k = $100k"], "usd"),
  c("mp-fee-1500", "startup-marketplace", "processing-fees", "fees", "beginner",
    "SAMPLE: $50k processed, ~3% smell.",
    1500, ["3% of 50k = $1,500"], "usd"),
  c("mp-fee-059", "startup-marketplace", "processing-fees", "fees", "beginner",
    "SAMPLE: $10 charge at 2.9% + $0.30. Fee?",
    0.59, ["2.9% ≈ $0.29", "plus $0.30 → $0.59"], "usd"),
  c("mp-fee-3k", "startup-marketplace", "processing-fees", "fees", "beginner",
    "SAMPLE: $100k volume at ~3%.",
    3000, ["3% of 100k = $3,000"], "usd"),
  c("mp-int-net", "startup-marketplace", "take-rate", "take_rate", "intermediate",
    "SAMPLE: $2M GMV, 15% take, then ~3% processing on GMV. Net after fees?",
    240000, ["Take $300k", "3% of 2M = $60k fees", "300−60 = $240k"], "usd"),
  c("mp-int-8", "startup-marketplace", "take-rate", "take_rate", "intermediate",
    "SAMPLE: $4M GMV at 8% take.",
    320000, ["8% of 4M = $320k"], "usd"),
  c("mp-int-small", "startup-marketplace", "processing-fees", "fees", "intermediate",
    "SAMPLE: $0.59 fee on $10 is what percent?",
    5.9, ["0.59/10 = 5.9%", "Small tickets hurt"]),
  c("mp-75k", "startup-marketplace", "take-rate", "take_rate", "beginner",
    "SAMPLE: $1.5M GMV, 5% take. Revenue?",
    75000, ["5% of 1.5M = $75k"], "usd"),

  c("pc-156", "startup-people-capital", "fully-loaded", "loaded_cost", "beginner",
    "SAMPLE: $120k salary. Loaded at ×1.3?",
    156000, ["120×1.3 = $156k"], "usd"),
  c("pc-130", "startup-people-capital", "fully-loaded", "loaded_cost", "beginner",
    "SAMPLE: $100k salary ×1.3.",
    130000, ["100×1.3 = $130k"], "usd"),
  c("pc-dil-20", "startup-people-capital", "dilution", "dilution", "beginner",
    "SAMPLE: pre $8M, raise $2M. Percent sold?",
    20, ["Post = 8+2 = $10M", "2/10 = 20%"]),
  c("pc-dil-25", "startup-people-capital", "dilution", "dilution", "beginner",
    "SAMPLE: $3M into $12M post. Percent sold?",
    25, ["3/12 = 25%"]),
  c("pc-tam-120", "startup-people-capital", "tam-fermi", "tam_fermi", "beginner",
    "SAMPLE: 200k dentists × $600/year. TAM in millions?",
    120, ["200k×600 = $120M"]),
  c("pc-nrr-130", "startup-people-capital", "nrr", "nrr_read", "beginner",
    "SAMPLE: same customers $100k → $130k. NRR %?",
    130, ["130/100 = 130%", "New logos stay out"]),
  c("pc-int-pool", "startup-people-capital", "dilution", "dilution", "intermediate",
    "SAMPLE: raise $1M at $10M post. Percent sold?",
    10, ["1/10 = 10%"]),
  c("pc-int-slice", "startup-people-capital", "tam-fermi", "tam_fermi", "intermediate",
    "SAMPLE: 1,000 of those dentists at $600/year. ARR $k?",
    600, ["1,000×600 = $600k", "Not the $120M TAM"]),
  c("pc-int-nrr80", "startup-people-capital", "nrr", "nrr_read", "intermediate",
    "SAMPLE: cohort $100k → $80k. NRR %?",
    80, ["80/100 = 80%"]),
  c("pc-195", "startup-people-capital", "fully-loaded", "loaded_cost", "beginner",
    "SAMPLE: $150k salary ×1.3.",
    195000, ["150×1.3 = $195k"], "usd"),

  c("sf-conc-20", "stacked-founder", "concurrency", "infra_chain", "beginner",
    "SAMPLE: 100 logos, busy hour. How many concurrent at 20%?",
    20, ["Not 100 simultaneous", "20% of 100 = 20"], "users"),
  c("sf-boxes-50", "stacked-founder", "capacity-split", "infra_chain", "beginner",
    "SAMPLE: 1,000 simultaneous users, 20 per server. How many boxes?",
    50, ["Users ÷ capacity", "1,000/20 = 50"], "servers"),
  c("sf-box-120", "stacked-founder", "box-contribution", "smell_test", "intermediate",
    "SAMPLE: $30 price, 20 users on a $720/mo GPU. How many dollars is the box short?",
    120, ["30×20 = $600 revenue", "Box costs $720/mo", "720 − 600 = $120 short"], "usd"),
  c("sf-util-7", "stacked-founder", "utilization", "infra_chain", "beginner",
    "SAMPLE: box claims 10 jobs/sec. What sustained load do you plan?",
    7, ["~70% of max", "0.7×10 = 7"], "jobs/sec"),
  c("sf-pareto-200", "stacked-founder", "pareto", "smell_test", "beginner",
    "SAMPLE: 1,000 users. How many in the heavy 20% slice?",
    200, ["20% of 1,000 = 200", "Treat them as most of the load"], "users"),
  c("sf-pad-2600", "stacked-founder", "estimate-pad", "smell_test", "beginner",
    "SAMPLE: infra guess $2,000. Padded cost at ×1.3?",
    2600, ["Estimates run short", "2,000×1.3 = $2,600"], "usd"),
  c("sf-tri-1000", "stacked-founder", "revenue-triangle", "break_even", "beginner",
    "SAMPLE: $50 × 20 users. Monthly revenue?",
    1000, ["R = P × U", "50×20 = $1,000"], "usd"),
  c("sf-funnel-100", "stacked-founder", "funnel-bands", "conversion_funnel", "intermediate",
    "SAMPLE: 10,000 visits, no dashboard. Mid-band paid users (20% then 5%)?",
    100, ["Visit→signup mid 20% → 2,000", "Signup→paid mid 5%", "5% of 2,000 = 100"], "customers"),
];

export function casesForPack(packId: CasePackId): CaseStudy[] {
  return CASES.filter((row) => row.packId === packId);
}

export function getCase(id: string): CaseStudy | undefined {
  return CASES.find((row) => row.id === id);
}

export function getCasePack(packId: string) {
  return CASE_PACKS.find((pack) => pack.id === packId);
}
