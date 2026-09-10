import type { FamilyId } from "./tricks";
import type { TrackId } from "./tracks";

export interface ScenarioChoice {
  id: string;
  label: string;
  correct: boolean;
}

export interface Scenario {
  id: string;
  track: TrackId;
  title: string;
  prompt: string;
  skillIds: FamilyId[];
  choices: ScenarioChoice[];
  hints: string[];
  cheat: string;
}

function s(
  id: string,
  track: TrackId,
  title: string,
  prompt: string,
  skillIds: FamilyId[],
  choices: ScenarioChoice[],
  hints: string[],
  cheat: string,
): Scenario {
  return { id, track, title, prompt, skillIds, choices, hints, cheat };
}

export const SCENARIOS: Scenario[] = [
  s(
    "box-cover",
    "quick",
    "One GPU, one price",
    "SAMPLE: the GPU is $1/hr and you charge $40/mo. How many paying users cover one box?",
    ["hour-month", "break-even"],
    [
      { id: "a", label: "18", correct: true },
      { id: "b", label: "40", correct: false },
      { id: "c", label: "720", correct: false },
      { id: "d", label: "24", correct: false },
    ],
    [
      "Turn hourly into monthly first. The ×720 shortcut.",
      "Then users = monthly cost ÷ price. Cancel a zero if both sides have one.",
    ],
    "Hourly ×720 → $720/mo. Users = 720 ÷ 40 = 18. 40 is the price, 720 is the monthly box, 24 is hours in a day — none of those is the user count.",
  ),
  s(
    "funnel-covers-ads",
    "quick",
    "Funnel vs ads",
    "SAMPLE: 10,000 visitors, about 5% convert. Ads plus tools are $3,000 and price is $50. After conversion, how many customers do you have versus the 60 you need to break even? Surplus customers?",
    ["percent-shift", "break-even"],
    [
      { id: "a", label: "440", correct: true },
      { id: "b", label: "500", correct: false },
      { id: "c", label: "60", correct: false },
      { id: "d", label: "4400", correct: false },
    ],
    [
      "1% of 10,000 is two places left. Scale that to 5%.",
      "Break-even users = 3,000 ÷ 50. Surplus is converted customers minus that.",
    ],
    "1% of 10k = 100, so 5% = 500 customers. Break-even = 3,000 ÷ 50 = 60. Surplus = 500 − 60 = 440. 500 is the funnel, 60 is the floor, 4,400 added a stray zero.",
  ),
  s(
    "percent-then-year",
    "quick",
    "Chunk, then ×12",
    "SAMPLE: 35% of $2,000 is this month’s fee. What is that as a yearly number?",
    ["percent-chunks", "month-year"],
    [
      { id: "a", label: "8,400", correct: true },
      { id: "b", label: "700", correct: false },
      { id: "c", label: "2,400", correct: false },
      { id: "d", label: "24,000", correct: false },
    ],
    [
      "Build 35% with 10% chips: three tenths plus 5%.",
      "Yearly is monthly ×12, not ×10.",
    ],
    "10% of 2,000 = 200, three times = 600, plus 5% = 100 → $700/mo. ×12 = $8,400/year. 700 is still monthly. 2,400 is 12×200 (only 10%). 24,000 glued a zero.",
  ),
  s(
    "swap-then-tip",
    "quick",
    "Swap, then undo a tip",
    "SAMPLE: 14% of 50 dollars is the 20% tip on a bill. What was the bill?",
    ["percent-reversible", "percent-tip"],
    [
      { id: "a", label: "35", correct: true },
      { id: "b", label: "7", correct: false },
      { id: "c", label: "14", correct: false },
      { id: "d", label: "70", correct: false },
    ],
    [
      "Swap: 14% of 50 is 50% of 14.",
      "That tip is 20% of the bill. 20% is ×2 then one place left — undo it: ×5, or ×10 then half.",
    ],
    "Swap: 50% of 14 = 7. The tip is $7, which is 20% of the bill, so bill = 7 × 5 = $35. 7 is the tip, not the bill. 70 doubled instead of ×5.",
  ),
  s(
    "hire-runway",
    "stakeholder",
    "Loaded hire, shorter runway",
    "SAMPLE: $120k in the bank, $20k burn. A hire at $60k salary, loaded ×1.3, billed monthly. About how many months of runway after the hire?",
    ["fully-loaded", "cfo-runway"],
    [
      { id: "a", label: "4.5", correct: true },
      { id: "b", label: "6", correct: false },
      { id: "c", label: "5", correct: false },
      { id: "d", label: "78", correct: false },
    ],
    [
      "Loaded cost is salary ×1.3, then ÷12 for a monthly add to burn.",
      "New runway = cash ÷ new monthly burn.",
    ],
    "Loaded = 60 × 1.3 = $78k/year → $6.5k/mo. New burn = 20 + 6.5 = $26.5k. 120 ÷ 26.5 ≈ 4.5 months. 6 is the old runway. 78 is the yearly loaded dollars.",
  ),
  s(
    "table-not-fifty-x",
    "stakeholder",
    "Growth table, then MRR",
    "SAMPLE: 100 users at 20%/mo, they charge $20/mo. They claim 50,000 users in a year. Using the 20% table, about what monthly revenue should you smell after 12 months?",
    ["cfo-growth", "mrr-arr"],
    [
      { id: "a", label: "18,000", correct: true },
      { id: "b", label: "1,000,000", correct: false },
      { id: "c", label: "900", correct: false },
      { id: "d", label: "2,400", correct: false },
    ],
    [
      "20%/mo is about 9× in a year, not 50×. Start at 100 users.",
      "MRR is paying users × price. Do not treat the 50k claim as real.",
    ],
    "Table: 100 × ~9 = 900 users. 900 × $20 = $18,000 MRR. $1M is 50k × $20 (the false claim). 900 is headcount, not dollars. 2,400 is 120 × 20 (a 20% year, not 20% per month).",
  ),
  s(
    "take-after-fees",
    "stakeholder",
    "Take, then processing",
    "SAMPLE: $2M GMV, 15% take, then about 3% processing on the GMV. Net after fees?",
    ["take-rate", "processing-fees"],
    [
      { id: "a", label: "240,000", correct: true },
      { id: "b", label: "300,000", correct: false },
      { id: "c", label: "60,000", correct: false },
      { id: "d", label: "2,000,000", correct: false },
    ],
    [
      "Revenue is GMV × take, not GMV. 10% + 5%.",
      "Fees smell as 3% of GMV, then subtract from take.",
    ],
    "Take: 10% of 2M = 200k, plus 5% = 100k → $300k. Fees: 3% of 2M = $60k. Net 300 − 60 = $240k. 300k is gross take. 2M is GMV.",
  ),
  s(
    "post-and-tam-slice",
    "stakeholder",
    "Percent sold, then a slice",
    "SAMPLE: pre $8M, raise $2M. You can reach 1,000 of 200k buyers at $600/year. What percent did you sell, and what ARR is that slice in thousands? Pick the pair.",
    ["dilution", "tam-fermi"],
    [
      { id: "a", label: "20% sold, $600k ARR", correct: true },
      { id: "b", label: "25% sold, $120M TAM", correct: false },
      { id: "c", label: "20% sold, $120M TAM", correct: false },
      { id: "d", label: "2% sold, $600k ARR", correct: false },
    ],
    [
      "Post = pre + cash. Percent sold = cash ÷ post.",
      "The $120M is TAM (200k × $600). The slice is 1,000 buyers × $600.",
    ],
    "Post = 8 + 2 = $10M, 2/10 = 20% sold. Slice ARR = 1,000 × 600 = $600k. $120M is the whole TAM, not the slice. 25% would be cash ÷ pre.",
  ),
  s(
    "chord-then-zeros",
    "quick",
    "Hear 7×8, then park zeros",
    "SAMPLE: you already know 7×8=56. What is 700 × 8?",
    ["anchors", "magnitude"],
    [
      { id: "a", label: "5,600", correct: true },
      { id: "b", label: "560", correct: false },
      { id: "c", label: "56", correct: false },
      { id: "d", label: "4,900", correct: false },
    ],
    [
      "Keep the 56 chord. Do not long-multiply 700×8.",
      "700 has two extra zeros versus 7, so the product gets two zeros.",
    ],
    "7×8=56, two extra zeros → 5,600. 560 is only one zero (70×8). 56 is the chord with none. 4,900 is 700×7.",
  ),
  s(
    "hour-then-day",
    "quick",
    "Monthly box, daily quote",
    "SAMPLE: a GPU is $1/hr. What daily burn should you quote?",
    ["hour-month", "month-day"],
    [
      { id: "a", label: "24", correct: true },
      { id: "b", label: "720", correct: false },
      { id: "c", label: "30", correct: false },
      { id: "d", label: "365", correct: false },
    ],
    [
      "Hourly ×720 is monthly. $1/hr → $720/mo.",
      "Daily is monthly ÷30, not ÷365.",
    ],
    "×720 → $720/mo. 720÷30 = $24/day. 720 is still monthly. 30 is the divisor, not the dollars. 365 treats it as a year of hours.",
  ),
  s(
    "five-x-then-cover",
    "quick",
    "Markup, then heads to cover",
    "SAMPLE: cost is $20, you want 5× markup. Fixed cost this month is $2,000. How many units cover it?",
    ["markup", "break-even"],
    [
      { id: "a", label: "20", correct: true },
      { id: "b", label: "100", correct: false },
      { id: "c", label: "5", correct: false },
      { id: "d", label: "40", correct: false },
    ],
    [
      "Price is cost × the multiple. 5× on $20.",
      "Users = fixed cost ÷ price. Cancel zeros.",
    ],
    "Price = 20×5 = $100. Users = 2,000÷100 = 20. 100 is the price, not the headcount. 5 is the multiple. 40 would be if you left price at $50.",
  ),
  s(
    "tens-then-year",
    "quick",
    "Drop zeros, then ×12",
    "SAMPLE: 30% of $40 is this month’s fee. Yearly?",
    ["percent-tens", "month-year"],
    [
      { id: "a", label: "144", correct: true },
      { id: "b", label: "12", correct: false },
      { id: "c", label: "120", correct: false },
      { id: "d", label: "1,440", correct: false },
    ],
    [
      "Tens of percent of tens of dollars: drop zeros, 3×4.",
      "Yearly is ×12, not ×10.",
    ],
    "3×4=12 dollars this month. 12×12=$144/year. 12 is still monthly. 120 is ×10. 1,440 glued a zero onto 144.",
  ),
  s(
    "double-in-years",
    "quick",
    "Rule of 72 vs a third",
    "SAMPLE: 6% growth. About how many years to double, and what is 1/3 of that many years?",
    ["rule-of-72", "fraction-percent"],
    [
      { id: "a", label: "12 years to double, 4 years for a third of that span", correct: true },
      { id: "b", label: "6 years to double, 2 years for a third", correct: false },
      { id: "c", label: "72 years to double, 24 for a third", correct: false },
      { id: "d", label: "12 years to double, 3 years for a quarter of that span", correct: false },
    ],
    [
      "Years to double ≈ 72 ÷ rate.",
      "A third of that span is ÷3, not a 33% rate.",
    ],
    "72÷6=12 years to double. A third of 12 is 4. 6 swapped the 72 and the rate. 72 is the constant, not the years. 3 would be a quarter of 12.",
  ),
  s(
    "ceiling-vs-burn",
    "stakeholder",
    "Ceiling months if you hit it",
    "SAMPLE: $20/mo × 10k possible customers is the ceiling. Burn is $25k/mo. If you actually hit that ceiling as revenue, how many months of burn does one month of ceiling cover?",
    ["cfo-feasibility", "cfo-runway"],
    [
      { id: "a", label: "8", correct: true },
      { id: "b", label: "200,000", correct: false },
      { id: "c", label: "25,000", correct: false },
      { id: "d", label: "0.125", correct: false },
    ],
    [
      "Ceiling = price × reachable customers.",
      "Months of cover = ceiling ÷ monthly burn. Same shape as runway, with revenue instead of cash.",
    ],
    "20×10k = $200k ceiling. 200÷25 = 8 months of burn per month of ceiling. 200,000 is the ceiling dollars. 25,000 is burn. 0.125 inverted the ratio.",
  ),
  s(
    "churn-then-ltv",
    "stakeholder",
    "Lifetime months, then LTV",
    "SAMPLE: 5% monthly churn, $20/mo price. About what LTV?",
    ["churn", "cfo-unit-econ"],
    [
      { id: "a", label: "400", correct: true },
      { id: "b", label: "20", correct: false },
      { id: "c", label: "100", correct: false },
      { id: "d", label: "240", correct: false },
    ],
    [
      "Lifetime months ≈ 1 ÷ monthly churn.",
      "LTV ≈ price × those months.",
    ],
    "1/0.05 = 20 months. 20×$20 = $400. 20 is the months, not the dollars. 100 is 5×20 (churn percent as a multiple). 240 is 12 months × $20.",
  ),
  s(
    "forty-and-burn",
    "stakeholder",
    "Rule of 40, then burn multiple",
    "SAMPLE: 30% growth, 15% margin, burn $2M, net new ARR $1M. Pick the pair: Rule of 40 sum, then burn multiple.",
    ["rule-of-40", "burn-multiple"],
    [
      { id: "a", label: "45, then 2×", correct: true },
      { id: "b", label: "30, then 2×", correct: false },
      { id: "c", label: "45, then 0.5×", correct: false },
      { id: "d", label: "40, then 2×", correct: false },
    ],
    [
      "Rule of 40 is growth % plus profit margin %.",
      "Burn multiple is burn ÷ net new ARR.",
    ],
    "30+15=45 (passes ~40). 2÷1=2×. 30 forgot the margin. 0.5× inverted burn and ARR. 40 is the bar, not this company’s sum.",
  ),
  s(
    "payback-then-ratio",
    "stakeholder",
    "Payback months, then 3× smell",
    "SAMPLE: CAC $240, $40/mo gross profit. Payback months, and what LTV do you need for a 3× CAC?",
    ["cac-payback", "cfo-unit-econ"],
    [
      { id: "a", label: "6 months payback, $720 LTV", correct: true },
      { id: "b", label: "6 months payback, $240 LTV", correct: false },
      { id: "c", label: "12 months payback, $720 LTV", correct: false },
      { id: "d", label: "6 months payback, $80 LTV", correct: false },
    ],
    [
      "Payback = CAC ÷ monthly gross profit. Aim ≤12.",
      "3× CAC is the LTV smell. 3×$240.",
    ],
    "240÷40=6 months (inside ≤12). 3×240=$720 LTV. $240 is CAC, not LTV. 12 is the bar, not this payback. $80 is 2×$40 (two months of GP).",
  ),
  s(
    "nrr-vs-logo-churn",
    "stakeholder",
    "NRR 130, churn still 5%",
    "SAMPLE: same-customer revenue $100k → $130k. Monthly logo churn is still 5%. What is NRR, and about how many lifetime months from that churn?",
    ["nrr", "churn"],
    [
      { id: "a", label: "130% NRR, ~20 months", correct: true },
      { id: "b", label: "30% NRR, ~20 months", correct: false },
      { id: "c", label: "130% NRR, ~5 months", correct: false },
      { id: "d", label: "80% NRR, ~20 months", correct: false },
    ],
    [
      "NRR is later ÷ earlier on the same customers. New logos stay out.",
      "Lifetime months ≈ 1 ÷ monthly churn. NRR can be >100% while logos still leave.",
    ],
    "130/100=130% NRR. 1/0.05≈20 months. 30% subtracted instead of the ratio. 5 months treated 5% as months. 80% would be a shrinking cohort.",
  ),
  s(
    "day-then-year",
    "quick",
    "Daily rate, then a year",
    "SAMPLE: $30/day. Yearly cost if a month is 30 days?",
    ["month-day", "month-year"],
    [
      { id: "a", label: "10,800", correct: true },
      { id: "b", label: "900", correct: false },
      { id: "c", label: "360", correct: false },
      { id: "d", label: "10,950", correct: false },
    ],
    [
      "Monthly is daily ×30, not ×365.",
      "Yearly is that monthly ×12. Same as ×360 days.",
    ],
    "30×30 = $900/mo. 900×12 = $10,800/year. 900 is still monthly. 360 is 30×12 without the daily dollars. 10,950 is 365×30.",
  ),
  s(
    "chunks-then-cover",
    "quick",
    "15% convert, then surplus",
    "SAMPLE: 800 trial users, 15% pay. Ads plus tools are $3,000 and price is $50. Surplus customers after break-even?",
    ["percent-chunks", "break-even"],
    [
      { id: "a", label: "60", correct: true },
      { id: "b", label: "120", correct: false },
      { id: "c", label: "740", correct: false },
      { id: "d", label: "45", correct: false },
    ],
    [
      "15% is 10% plus 5%.",
      "Break-even users = 3,000 ÷ 50. Surplus is payers minus that floor.",
    ],
    "10% of 800 = 80, 5% = 40 → 120 payers. 3,000÷50 = 60 to cover. Surplus 120 − 60 = 60. 120 is the funnel, not the surplus. 740 treated 15% as 15 people.",
  ),
  s(
    "five-then-percent",
    "quick",
    "÷5, then undo 1%",
    "SAMPLE: 80 ÷ 5. That result is 1% of what number?",
    ["div-by-5", "percent-shift"],
    [
      { id: "a", label: "1,600", correct: true },
      { id: "b", label: "16", correct: false },
      { id: "c", label: "800", correct: false },
      { id: "d", label: "160", correct: false },
    ],
    [
      "÷5 is ×2 then one place left.",
      "1% is two places left, so undo 1% by appending two zeros.",
    ],
    "80×2=160, one place left → 16. 16 is 1% of 1,600. 16 is the quotient. 800 is the original. 160 forgot the last shift.",
  ),
  s(
    "add-then-times-five",
    "quick",
    "Left to right, then ×5",
    "SAMPLE: 47 + 36, then multiply that sum by 5.",
    ["left-to-right", "double-half"],
    [
      { id: "a", label: "415", correct: true },
      { id: "b", label: "83", correct: false },
      { id: "c", label: "830", correct: false },
      { id: "d", label: "235", correct: false },
    ],
    [
      "Add tens, then ones: 40+30 and 7+6.",
      "×5 is ×10 then half.",
    ],
    "70+13=83. 83×10=830, half → 415. 83 is the sum. 830 forgot to halve. 235 is 47×5.",
  ),
  s(
    "square-then-zeros",
    "quick",
    "35², then scale",
    "SAMPLE: you know 35² = 1,225. What is 350²?",
    ["multiply-near", "magnitude"],
    [
      { id: "a", label: "122,500", correct: true },
      { id: "b", label: "1,225", correct: false },
      { id: "c", label: "12,250", correct: false },
      { id: "d", label: "3,500", correct: false },
    ],
    [
      "35² is the near-ten glue: 3×4 and 25.",
      "350 is 35 with one extra zero, so the square gets two extra zeros.",
    ],
    "35²=1,225. One extra zero on the factor → two on the square → 122,500. 12,250 is only one extra zero. 1,225 is 35². 3,500 is 35×100.",
  ),
  s(
    "mrr-and-churn",
    "stakeholder",
    "ARR smell, then lifetime months",
    "SAMPLE: $80k MRR, 5% monthly logo churn. Pick the pair: ARR, then lifetime months.",
    ["mrr-arr", "churn"],
    [
      { id: "a", label: "$960k ARR, ~20 months", correct: true },
      { id: "b", label: "$80k ARR, ~20 months", correct: false },
      { id: "c", label: "$960k ARR, ~5 months", correct: false },
      { id: "d", label: "$1M ARR exactly, ~20 months", correct: false },
    ],
    [
      "ARR is MRR ×12. $80k ×12 is a ~$1M smell, not $80k.",
      "Lifetime months ≈ 1 ÷ monthly churn.",
    ],
    "80k×12=$960k ARR. 1/0.05=20 months. $80k forgot ×12. 5 months treated 5% as months. Exact $1M is the smell, not the product.",
  ),
  s(
    "slice-ceiling",
    "stakeholder",
    "Fermi slice as a ceiling",
    "SAMPLE: you can reach 1,000 buyers at $50/mo. Monthly ceiling for that slice?",
    ["tam-fermi", "cfo-feasibility"],
    [
      { id: "a", label: "50,000", correct: true },
      { id: "b", label: "600,000", correct: false },
      { id: "c", label: "1,000", correct: false },
      { id: "d", label: "50", correct: false },
    ],
    [
      "A slice is buyers × price, not the whole TAM.",
      "Ceiling = price × reachable customers. Same multiply.",
    ],
    "1,000×$50 = $50k/mo. $600k would be 1,000×$600/year (a different Fermi). 1,000 is headcount. 50 is the price.",
  ),
  s(
    "sold-and-loaded",
    "stakeholder",
    "Percent sold, then a loaded hire",
    "SAMPLE: $3M into $12M post. Then one $100k salary loaded ×1.3. Pick the pair.",
    ["dilution", "fully-loaded"],
    [
      { id: "a", label: "25% sold, $130k loaded", correct: true },
      { id: "b", label: "20% sold, $130k loaded", correct: false },
      { id: "c", label: "25% sold, $100k loaded", correct: false },
      { id: "d", label: "3% sold, $130k loaded", correct: false },
    ],
    [
      "Percent sold = cash ÷ post-money.",
      "Loaded cost is salary ×1.3, not the sticker salary.",
    ],
    "3/12=25% sold. 100×1.3=$130k loaded. 20% would be $2M into $10M. $100k is the sticker. 3% treated millions as a percent.",
  ),
];

export function scenariosForTrack(track: TrackId): Scenario[] {
  return SCENARIOS.filter((row) => row.track === track);
}

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((row) => row.id === id);
}
