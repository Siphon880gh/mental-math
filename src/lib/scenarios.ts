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
];

export function scenariosForTrack(track: TrackId): Scenario[] {
  return SCENARIOS.filter((row) => row.track === track);
}

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((row) => row.id === id);
}
