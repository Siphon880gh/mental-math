import type { FamilyId } from "../../tricks";
import type { MethodTreeSpec } from "../buildMethodTree";

const B = ["beginner"] as const;
const I = ["intermediate"] as const;

function spec(
  slug: FamilyId,
  title: string,
  summary: string,
  tags: readonly string[],
  rest: Omit<MethodTreeSpec, "slug" | "title" | "summary" | "tags">,
): MethodTreeSpec {
  return { slug, title, summary, tags: [...tags], ...rest };
}

export function specBySlug(slug: string): MethodTreeSpec {
  const hit = SESSION_SPECS.find((row) => row.slug === slug);
  if (!hit) {
    throw new Error(`Missing coaching spec for ${slug}`);
  }
  return hit;
}

export const SESSION_SPECS: MethodTreeSpec[] = [
  spec(
    "anchors",
    "Hear the chord, then scale zeros",
    "SAMPLE 50×40: do not long-multiply. Recognize 5×4=20, then park the zeros.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: someone asks 50 × 40 in a pricing chat.\n\nWhat do you reach for first?",
          correct: {
            id: "chord",
            label: "Hear 5 × 4 = 20, then put the extra zeros back",
            next: "scale",
          },
          wrongs: [
            {
              id: "long",
              label: "Stack 50 under 40 and multiply digit by digit",
              explain:
                "Long multiplication is slow on purpose. The chord 5×4=20 is already in your head — use it, then scale.\n\nReturn to the first move.",
            },
            {
              id: "guess",
              label: "Guess 2,000 because both numbers look big",
              explain:
                "A vibe is not a chord. 50×40 happens to be 2,000, but you got there by luck. Lock 5×4 first.\n\nReturn to the first move.",
            },
          ],
        },
        {
          id: "scale",
          message:
            "5 × 4 = 20. 50 has one extra zero, 40 has one extra zero.\n\nHow do the zeros land?",
          correct: {
            id: "two",
            label: "Two extra zeros → 2,000",
            next: "check",
          },
          wrongs: [
            {
              id: "one",
              label: "Only one extra zero because 50 already ends in zero",
              explain:
                "Each factor’s extra zero counts. 50 and 40 each donate one → two zeros on 20.\n\nRevisit the zeros.",
            },
            {
              id: "drop",
              label: "Drop all zeros and call it 20",
              explain:
                "You stripped the magnitude. The chord is 20; the business number is 2,000.\n\nRevisit the zeros.",
            },
          ],
        },
        {
          id: "check",
          message:
            "Same chord, new pair: 25 × 8. 25 × 4 = 100, so 25 × 8 is a double.\n\nWhat is it?",
          correct: {
            id: "two_hundred",
            label: "200 — double of the 100 chord",
            next: "success",
          },
          wrongs: [
            {
              id: "twenty",
              label: "20 — treat 25 like 2.5",
              explain:
                "Do not move the decimal on a whole 25. 25×4=100, ×8 is twice that → 200.\n\nTry the check again.",
            },
            {
              id: "two_k",
              label: "2,000 — copy the zeros from 50×40",
              explain:
                "Zeros are not a costume you reuse. 25 and 8 have no spare zeros.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. You used a memorized chord, scaled zeros on purpose, and checked with a second pair.\n\nSAMPLE only — 50×40=2,000 and 25×8=200.",
    },
  ),
  spec(
    "magnitude",
    "Move zeros, do not recompute",
    "SAMPLE 70×8: keep 7×8=56 and append the zero.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 70 × 8 in a headcount chat.\n\nWhat is the first move?",
          correct: {
            id: "keep",
            label: "Keep 7 × 8 = 56 and treat the 70 as ×10",
            next: "append",
          },
          wrongs: [
            {
              id: "redo",
              label: "Recompute 70 × 8 from scratch as a new fact",
              explain:
                "70×8 is not a new table. It is 7×8 with a zero moved.\n\nReturn to the first move.",
            },
            {
              id: "add",
              label: "Add 70 eight times",
              explain:
                "Repeated addition is the slow path. Magnitude scaling is append-zeros.\n\nReturn to the first move.",
            },
          ],
        },
        {
          id: "append",
          message: "7 × 8 = 56. 70 is 7 × 10.\n\nWhere does the zero go?",
          correct: {
            id: "560",
            label: "Append one zero → 560",
            next: "check",
          },
          wrongs: [
            {
              id: "56",
              label: "Leave it at 56",
              explain:
                "You dropped the ×10. 70 is ten times 7.\n\nRevisit the zero.",
            },
            {
              id: "5600",
              label: "Append two zeros because 70 looks like 700",
              explain:
                "70 has one extra zero, not two. 700 × 8 would be 5,600.\n\nRevisit the zero.",
            },
          ],
        },
        {
          id: "check",
          message: "Same base: 9 × 6 = 54. What is 90 × 6?",
          correct: {
            id: "540",
            label: "540 — one zero on 54",
            next: "success",
          },
          wrongs: [
            {
              id: "54",
              label: "54 — ignore the extra zero on 90",
              explain: "90 is 9 × 10. The product must grow by 10×.\n\nTry the check again.",
            },
            {
              id: "5400",
              label: "5,400 — treat 90 as 900",
              explain: "900 × 6 is the two-zero version. This prompt is 90.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. You kept the base fact and moved zeros instead of recomputing.\n\nSAMPLE: 70×8=560, 90×6=540.",
    },
  ),
  spec(
    "percent-shift",
    "1% is two places left",
    "SAMPLE 1% of 8,500 and 10% of 470: shift the decimal, do not divide by guessing.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 1% of 8,500 in a fee chat.\n\nWhich motion is 1%?",
          correct: {
            id: "two",
            label: "Move the decimal two places left",
            next: "apply",
          },
          wrongs: [
            {
              id: "one",
              label: "Move one place left (that is 10%)",
              explain:
                "10% is one place. 1% is two places. Mixing them off-by-tens the answer.\n\nReturn to the shift rule.",
            },
            {
              id: "divide_8",
              label: "Divide 8,500 by 8 because percent feels like eighths",
              explain:
                "Percent is per hundred, not per eight. Shift two places for 1%.\n\nReturn to the shift rule.",
            },
          ],
        },
        {
          id: "apply",
          message: "Two places left on 8,500.\n\nWhat is 1%?",
          correct: {
            id: "85",
            label: "85",
            next: "ten",
          },
          wrongs: [
            {
              id: "850",
              label: "850 — only one place",
              explain: "850 would be 10%. 1% of 8,500 is 85.\n\nRevisit the two-place move.",
            },
            {
              id: "8_5",
              label: "8.5 — three places",
              explain: "Three places is 0.1%. Stop at two.\n\nRevisit the two-place move.",
            },
          ],
        },
        {
          id: "ten",
          message: "Now 10% of 470. One place left.\n\nWhat is it?",
          correct: {
            id: "47",
            label: "47",
            next: "success",
          },
          wrongs: [
            {
              id: "4_7",
              label: "4.7 — used the 1% shift",
              explain: "4.7 is 1% of 470. 10% is one place: 47.\n\nTry 10% again.",
            },
            {
              id: "470",
              label: "470 — 10% of a number is the number",
              explain: "That would be 100%. One place left from 470 is 47.\n\nTry 10% again.",
            },
          ],
        },
      ],
      success:
        "Session complete. 1% = two places left; 10% = one place.\n\nSAMPLE: 1% of 8,500=85, 10% of 470=47.",
    },
  ),
  spec(
    "percent-reversible",
    "A% of B is B% of A",
    "SAMPLE 14% of 50: swap to 50% of 14 instead of grinding 0.14.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 14% of 50. Both numbers are awkward if you pick the wrong side.\n\nWhat is the move?",
          correct: {
            id: "swap",
            label: "Swap: 50% of 14 is the same product",
            next: "half",
          },
          wrongs: [
            {
              id: "point",
              label: "Compute 0.14 × 50 with a calculator habit",
              explain:
                "You can, but the swap is the taught shortcut. 50% of 14 is a half.\n\nReturn to the swap.",
            },
            {
              id: "onepct",
              label: "Take 1% of 14 and multiply by 50",
              explain:
                "That works slowly and ignores the easy half. Swap first when one side is 50, 25, or 10.\n\nReturn to the swap.",
            },
          ],
        },
        {
          id: "half",
          message: "50% of 14.\n\nWhat is it?",
          correct: {
            id: "seven",
            label: "7 — half of 14",
            next: "check",
          },
          wrongs: [
            {
              id: "fourteen",
              label: "14 — 50% means leave it",
              explain: "50% is half, not identity. Half of 14 is 7.\n\nRevisit the half.",
            },
            {
              id: "70",
              label: "70 — treat 50% like ×5",
              explain: "×5 would be 500%. Half of 14 is 7.\n\nRevisit the half.",
            },
          ],
        },
        {
          id: "check",
          message: "Same swap: 8% of 25.\n\nWhich side is easier?",
          correct: {
            id: "quarter",
            label: "25% of 8 = 2",
            next: "success",
          },
          wrongs: [
            {
              id: "eight_of_25",
              label: "Stay on 8% of 25 and grind it",
              explain:
                "25% of 8 is a quarter of 8. That is the easier half.\n\nTry the check again.",
            },
            {
              id: "swap_wrong",
              label: "8% of 25 = 25% of 25",
              explain:
                "You swapped only one number. A% of B = B% of A, so 8% of 25 = 25% of 8.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Pick the percent that is a nice chunk (50, 25, 10).\n\nSAMPLE: 14% of 50=7, 8% of 25=2.",
    },
  ),
  spec(
    "percent-tens",
    "Drop a zero from each side",
    "SAMPLE 30% of 40: 3×4=12. The two dropped zeros already moved two decimal places.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 30% of 40. Both are tens.\n\nWhat is the tens-of-tens move?",
          correct: {
            id: "drop",
            label: "Drop a zero from each side, then multiply 3 × 4",
            next: "product",
          },
          wrongs: [
            {
              id: "shift_only",
              label: "Take 1% of 40 and multiply by 30",
              explain:
                "Legal but slower. When both sides are tens, drop a zero each and multiply.\n\nReturn to the drop.",
            },
            {
              id: "add",
              label: "Add 30 and 40",
              explain: "Percent-of is a product, not a sum.\n\nReturn to the drop.",
            },
          ],
        },
        {
          id: "product",
          message: "3 × 4 = 12. Why is that already 30% of 40?",
          correct: {
            id: "places",
            label: "Dropping two zeros is the same as two decimal places (a percent)",
            next: "check",
          },
          wrongs: [
            {
              id: "luck",
              label: "It is 12 by coincidence; I still need to divide by 100",
              explain:
                "You already divided by 100 when you dropped both zeros. Stop.\n\nRevisit why 12 is finished.",
            },
            {
              id: "times_100",
              label: "Multiply 12 by 100 to put the zeros back",
              explain:
                "That would be 1,200 — 30 times 40, not 30% of 40.\n\nRevisit why 12 is finished.",
            },
          ],
        },
        {
          id: "check",
          message: "80% of 70. Drop zeros: 8 × 7.\n\nWhat is it?",
          correct: {
            id: "56",
            label: "56",
            next: "success",
          },
          wrongs: [
            {
              id: "560",
              label: "560 — put one zero back",
              explain: "Do not put zeros back. 8×7 is already 80% of 70.\n\nTry the check again.",
            },
            {
              id: "15",
              label: "15 — add 8 and 7",
              explain: "Multiply the stripped tens: 8×7=56.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Tens of percent of tens: drop a zero each, multiply, stop.\n\nSAMPLE: 30% of 40=12, 80% of 70=56.",
    },
  ),
  spec(
    "percent-chunks",
    "Build from 50 / 25 / 10 / 5",
    "SAMPLE 35% of 2,000: three tenths plus a 5% chunk.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 35% of 2,000. You do not need a 35% button.\n\nHow do you chunk it?",
          correct: {
            id: "tenths",
            label: "10% + 10% + 10% + 5%",
            next: "add",
          },
          wrongs: [
            {
              id: "thirty_five",
              label: "Treat 35% as 1/35 of 2,000",
              explain:
                "35% is 35 per hundred, not one thirty-fifth. Chunk from 10% and 5%.\n\nReturn to the chunks.",
            },
            {
              id: "half",
              label: "Call it about half because 35 is close to 50",
              explain:
                "Half would be 1,000 — way high. 35% is three tenths plus 5%.\n\nReturn to the chunks.",
            },
          ],
        },
        {
          id: "add",
          message: "10% of 2,000 is 200. 5% is 100.\n\nThree tenths plus 5%?",
          correct: {
            id: "700",
            label: "200 + 200 + 200 + 100 = 700",
            next: "check",
          },
          wrongs: [
            {
              id: "600",
              label: "600 — forget the 5%",
              explain: "Three tenths are 600. 35% still needs the 5% (100).\n\nRevisit the add.",
            },
            {
              id: "500",
              label: "500 — 25% plus 10% but drop a tenth",
              explain: "25%+10%=35% would be 500+200=700, same answer if you keep both chunks.\n\nRevisit the add.",
            },
          ],
        },
        {
          id: "check",
          message: "15% of 800. 10% is 80, 5% is 40.\n\nWhat is 15%?",
          correct: {
            id: "120",
            label: "120",
            next: "success",
          },
          wrongs: [
            {
              id: "80",
              label: "80 — only the tenth",
              explain: "15% needs the extra 5% (40). 80+40=120.\n\nTry the check again.",
            },
            {
              id: "200",
              label: "200 — 25% of 800",
              explain: "25% would be 200. This is 15% → 120.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Percents are Lego: 50, 25, 10, 5.\n\nSAMPLE: 35% of 2,000=700, 15% of 800=120.",
    },
  ),
  spec(
    "percent-tip",
    "Twenty percent is double, then one place left",
    "SAMPLE 20% of $42.30: ×2 → 84.60, then ÷10 → $8.46.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 20% tip on $42.30.\n\nWhat is the 20% motion?",
          correct: {
            id: "double_shift",
            label: "Double the bill, then move one place left",
            next: "apply",
          },
          wrongs: [
            {
              id: "ten_twice",
              label: "Take 10% twice in your head, but skip the double-shift name",
              explain:
                "10% twice is the same number. This family trains ×2, then one place left.\n\nReturn to the motion.",
            },
            {
              id: "twenty_bucks",
              label: "Round the tip to $20 because the bill is about 40",
              explain:
                "$20 would be ~50%. 20% of ~40 is about $8.\n\nReturn to the motion.",
            },
          ],
        },
        {
          id: "apply",
          message: "$42.30 × 2 = $84.60. One place left is ÷10.\n\nTip?",
          correct: {
            id: "846",
            label: "$8.46",
            next: "check",
          },
          wrongs: [
            {
              id: "84",
              label: "$84.60 — forgot the place shift",
              explain: "Doubling without ÷10 is 200%. One place left on 84.60 is 8.46.\n\nRevisit the shift.",
            },
            {
              id: "4_23",
              label: "$4.23 — that is 10%",
              explain: "4.23 is one place left on 42.30 (10%). 20% is twice that.\n\nRevisit the shift.",
            },
          ],
        },
        {
          id: "check",
          message: "20% of 80, same motion.\n\nWhat is it?",
          correct: {
            id: "16",
            label: "16",
            next: "success",
          },
          wrongs: [
            {
              id: "8",
              label: "8 — 10%",
              explain: "8 is 10% of 80. Double that for 20% → 16.\n\nTry the check again.",
            },
            {
              id: "160",
              label: "160 — doubled and kept the extra zero",
              explain: "160 would be 200%. ×2 then one place: 160 → 16.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. 20% = ×2, then one place left (÷10).\n\nSAMPLE: 20% of $42.30=$8.46, 20% of 80=16.",
    },
  ),
  spec(
    "div-by-5",
    "Divide by five: double, then shift",
    "SAMPLE 1,322 ÷ 5: ×2 → 2,644, one place left → 264.4.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 1,322 ÷ 5. Dividing by 5 feels sticky.\n\nWhat is the foreign-school move?",
          correct: {
            id: "double",
            label: "Double, then move one place left",
            next: "apply",
          },
          wrongs: [
            {
              id: "half",
              label: "Halve it because 5 is near 4",
              explain:
                "Halving would be ÷2. ÷5 is ×2 then ÷10.\n\nReturn to the motion.",
            },
            {
              id: "times_5",
              label: "Multiply by 5 instead",
              explain:
                "That is the inverse. You were asked to divide.\n\nReturn to the motion.",
            },
          ],
        },
        {
          id: "apply",
          message: "1,322 × 2 = 2,644. One place left?\n\nQuotient?",
          correct: {
            id: "2644",
            label: "264.4",
            next: "check",
          },
          wrongs: [
            {
              id: "2644_raw",
              label: "2,644 — skipped the place shift",
              explain: "Doubling without ÷10 is ×2, not ÷5.\n\nRevisit the shift.",
            },
            {
              id: "26",
              label: "26.44 — two places left",
              explain: "÷5 is one place after doubling, not two (that would be ÷50).\n\nRevisit the shift.",
            },
          ],
        },
        {
          id: "check",
          message: "80 ÷ 5, same motion. 80 × 2 = 160, one place left?",
          correct: {
            id: "16",
            label: "16",
            next: "success",
          },
          wrongs: [
            {
              id: "160",
              label: "160",
              explain: "160 is the double. One place left → 16.\n\nTry the check again.",
            },
            {
              id: "40",
              label: "40 — halved 80",
              explain: "40 would be ÷2. ÷5 of 80 is 16.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. ÷5 = ×2 then one place left.\n\nSAMPLE: 1,322÷5=264.4, 80÷5=16.",
    },
  ),
  spec(
    "hour-month",
    "Hourly to monthly is ×720",
    "SAMPLE $1/hr: 24×30≈720, so $720/mo. Do not invent a 365-hour month.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: a GPU is $1 per hour. You need a monthly smell test.\n\nWhich constant?",
          correct: {
            id: "720",
            label: "×720 because 24 × 30 ≈ 720",
            next: "apply",
          },
          wrongs: [
            {
              id: "24",
              label: "×24 only — that is a day, not a month",
              explain:
                "×24 is daily. Monthly still needs ~30 days → 720.\n\nReturn to the constant.",
            },
            {
              id: "365",
              label: "×365 — hours in a year accidentally",
              explain:
                "365 is days in a year, not hours in a month. 24×30≈720.\n\nReturn to the constant.",
            },
          ],
        },
        {
          id: "apply",
          message: "$1/hr × 720.\n\nMonthly?",
          correct: {
            id: "720b",
            label: "$720/mo",
            next: "check",
          },
          wrongs: [
            {
              id: "72",
              label: "$72/mo — dropped a zero",
              explain: "1×720 is 720, not 72.\n\nRevisit the multiply.",
            },
            {
              id: "24",
              label: "$24/mo — used hours in a day",
              explain: "$24 would be one day at $1/hr. Monthly is 720.\n\nRevisit the multiply.",
            },
          ],
        },
        {
          id: "check",
          message: "$2/hr, same constant.\n\nMonthly?",
          correct: {
            id: "1440",
            label: "$1,440/mo",
            next: "success",
          },
          wrongs: [
            {
              id: "144",
              label: "$144/mo",
              explain: "2×720=1,440. You dropped a zero.\n\nTry the check again.",
            },
            {
              id: "48",
              label: "$48/mo — two days",
              explain: "Two days at $1/hr is $48. This is $2/hr for a month.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Hourly × 720 ≈ monthly (24×30).\n\nSAMPLE: $1/hr→$720/mo, $2/hr→$1,440/mo.",
    },
  ),
  spec(
    "month-day",
    "Monthly to daily is ÷30",
    "SAMPLE $900/mo → $30/day. Reverse: daily × 30 ≈ monthly.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: $900 per month server bill. Someone asks the daily burn.\n\nWhich move?",
          correct: {
            id: "div30",
            label: "÷30",
            next: "apply",
          },
          wrongs: [
            {
              id: "div7",
              label: "÷7 because a week has seven days",
              explain:
                "Weekly would be ÷4-ish from monthly, not ÷7 from monthly. Daily is ÷30.\n\nReturn to the constant.",
            },
            {
              id: "div720",
              label: "÷720 — that is monthly back to hourly",
              explain:
                "÷720 is the hour-month inverse. Daily is ÷30.\n\nReturn to the constant.",
            },
          ],
        },
        {
          id: "apply",
          message: "900 ÷ 30.\n\nDaily?",
          correct: {
            id: "30",
            label: "$30/day",
            next: "check",
          },
          wrongs: [
            {
              id: "3",
              label: "$3/day — extra zero dropped",
              explain: "900÷30=30, not 3.\n\nRevisit the divide.",
            },
            {
              id: "90",
              label: "$90/day — ÷10",
              explain: "÷10 would be a 10-day month. Use 30.\n\nRevisit the divide.",
            },
          ],
        },
        {
          id: "check",
          message: "Reverse: $20/day back to monthly.\n\n×30?",
          correct: {
            id: "600",
            label: "$600/mo",
            next: "success",
          },
          wrongs: [
            {
              id: "200",
              label: "$200/mo — ×10",
              explain: "×10 is not a month. 20×30=600.\n\nTry the reverse again.",
            },
            {
              id: "20",
              label: "$20/mo — forgot to scale",
              explain: "Daily and monthly cannot be the same number here.\n\nTry the reverse again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Monthly ÷ 30 ≈ daily; daily × 30 ≈ monthly.\n\nSAMPLE: $900/mo→$30/day, $20/day→$600/mo.",
    },
  ),
  spec(
    "month-year",
    "Monthly to yearly is ×12",
    "SAMPLE $30/mo → $360/year as ×10 plus ×2. $100/mo is the same move: $1,000 + $200 = $1,200/year.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: $30/mo SaaS. Investor asks yearly.\n\nWhich move?",
          correct: {
            id: "x12",
            label: "×12 — that's ×10 plus ×2",
            next: "apply",
          },
          wrongs: [
            {
              id: "x10",
              label: "×10 as a round year",
              explain:
                "×10 is the easy chunk, not the year. 30×10=$300; still add ×2 ($60).\n\nReturn to ×12.",
            },
            {
              id: "x720",
              label: "×720 — mixing in the hourly constant",
              explain:
                "720 converts hours to months. Months to years is 12.\n\nReturn to ×12.",
            },
          ],
        },
        {
          id: "apply",
          message:
            "×12 is ×10 plus ×2.\n\n30×10 is $300. 30×2 is $60. Yearly?",
          correct: {
            id: "360",
            label: "$360/year (300+60)",
            next: "check",
          },
          wrongs: [
            {
              id: "300",
              label: "$300/year — stopped at ×10",
              explain:
                "×10 is $300. The extra two months are $60. Sum $360.\n\nRevisit ×12.",
            },
            {
              id: "60",
              label: "$60/year — only the ×2",
              explain:
                "×2 is the two extra months ($60). Add the ×10 chunk ($300) → $360.\n\nRevisit ×12.",
            },
          ],
        },
        {
          id: "check",
          message:
            "$100/mo. Same ×12: ×10 plus ×2.\n\n100×10 is $1,000. 100×2 is $200. Yearly?",
          correct: {
            id: "1200",
            label: "$1,200/year (1,000+200)",
            next: "success",
          },
          wrongs: [
            {
              id: "1000",
              label: "$1,000/year — stopped at ×10",
              explain:
                "×10 is $1,000. The extra two months are $200. Sum $1,200.\n\nTry the idea again.",
            },
            {
              id: "200",
              label: "$200/year — only the ×2",
              explain:
                "×2 is the two extra months ($200). Add the ×10 chunk ($1,000) → $1,200.\n\nTry the idea again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Monthly × 12 = yearly. Do ×12 as ×10 plus ×2.\n\nSAMPLE: $30/mo→$300+$60=$360/year. $100/mo→$1,000+$200=$1,200/year.",
    },
  ),
  spec(
    "break-even",
    "Users needed is cost ÷ price",
    "SAMPLE cost $3,000, price $50: reduce both sides → 60 users.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: $3,000 fixed cost, $50 price. Users to break even?\n\nWhich shape?",
          correct: {
            id: "divide",
            label: "Cost ÷ price, after canceling tens",
            next: "reduce",
          },
          wrongs: [
            {
              id: "multiply",
              label: "Cost × price",
              explain:
                "That is a revenue fantasy, not users. Users = cost ÷ price.\n\nReturn to the shape.",
            },
            {
              id: "minus",
              label: "Price − cost",
              explain:
                "Subtraction mixes units (dollars vs dollars) and does not yield users.\n\nReturn to the shape.",
            },
          ],
        },
        {
          id: "reduce",
          message: "3,000 ÷ 50. Cancel a zero: 300 ÷ 5.\n\nUsers?",
          correct: {
            id: "60",
            label: "60",
            next: "check",
          },
          wrongs: [
            {
              id: "6",
              label: "6 — extra zero canceled",
              explain: "300÷5=60, not 6. You canceled one too many zeros.\n\nRevisit the reduce.",
            },
            {
              id: "150",
              label: "150 — 3,000 ÷ 20",
              explain: "The price is 50, not 20. 300÷5=60.\n\nRevisit the reduce.",
            },
          ],
        },
        {
          id: "check",
          message: "Cost 1,000, price 50.\n\nUsers?",
          correct: {
            id: "20",
            label: "20",
            next: "success",
          },
          wrongs: [
            {
              id: "50",
              label: "50",
              explain: "1,000÷50=20. 50 would be if cost were 2,500.\n\nTry the check again.",
            },
            {
              id: "2",
              label: "2",
              explain: "You over-canceled zeros. 100÷5=20.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Break-even users = cost ÷ price; reduce both sides first.\n\nSAMPLE: 3,000/50=60, 1,000/50=20.",
    },
  ),
  spec(
    "markup",
    "Markup is price ÷ cost",
    "SAMPLE $2 on $0.33 cost ≈ 6×, so about 500% markup on cost — hear the extra as a multiple.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: cost $0.33, price $2. How rich is the markup?\n\nWhich ratio?",
          correct: {
            id: "p_over_c",
            label: "Price ÷ cost (how many times cost is the price)",
            next: "times",
          },
          wrongs: [
            {
              id: "c_over_p",
              label: "Cost ÷ price (that is a margin-ish invert)",
              explain:
                "Cost/price is a cost share, not markup multiple. Markup on cost is price/cost.\n\nReturn to the ratio.",
            },
            {
              id: "minus",
              label: "Price − cost = $1.67 and stop",
              explain:
                "Dollar spread is fine later. First hear the multiple: ~6×.\n\nReturn to the ratio.",
            },
          ],
        },
        {
          id: "times",
          message: "2 ÷ 0.33 is about 6. Subtract the original 1×.\n\nExtra on cost?",
          correct: {
            id: "five",
            label: "~5× extra → about 500% markup on cost",
            next: "check",
          },
          wrongs: [
            {
              id: "six_pct",
              label: "6% because the multiple is 6",
              explain:
                "6× is 600% of cost, and the extra above cost is ~500%, not 6%.\n\nRevisit the extra.",
            },
            {
              id: "keep_six",
              label: "Call it 600% extra without subtracting 1×",
              explain:
                "Price is ~6× cost, so you collected 5× extra on top of getting cost back.\n\nRevisit the extra.",
            },
          ],
        },
        {
          id: "check",
          message: "Cost 20, price 60. Multiple?",
          correct: {
            id: "three",
            label: "3× (100% extra on cost is 2× price)",
            next: "success",
          },
          wrongs: [
            {
              id: "40",
              label: "40× — mix the 20 and 60 as 20× something",
              explain: "60/20=3. Keep the ratio.\n\nTry the check again.",
            },
            {
              id: "two",
              label: "2× because the extra dollars are 40",
              explain: "Extra dollars 40 on cost 20 is +2×, so price is 3× cost.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Hear markup as a multiple of cost, then the extra above 1×.\n\nSAMPLE: $2 on $0.33≈6×; 20→60 is 3×.",
    },
  ),
  spec(
    "left-to-right",
    "Add from the large place first",
    "SAMPLE 47+36: lock 40+30=70, then pour 7+6=13 → 83. Running total, not right-to-left school addition.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 47 + 36 while walking. School habit is ones first.\n\nWhat does this family train?",
          correct: {
            id: "left",
            label: "Add tens first as a running total, then the ones",
            next: "tens",
          },
          wrongs: [
            {
              id: "ones",
              label: "Ones first: 7+6=13, write 3 carry 1",
              explain:
                "That works on paper. In conversation, lock the large place so you already know you are in the 70s.\n\nReturn to left-to-right.",
            },
            {
              id: "round_both",
              label: "Round both to 50 and 40 and stop at 90",
              explain:
                "That is round-then-compensate (a different family). Here, keep 47 and 36, just add left first.\n\nReturn to left-to-right.",
            },
          ],
        },
        {
          id: "tens",
          message: "40 + 30 = 70. Ones: 7 + 6 = 13.\n\nRunning total?",
          correct: {
            id: "83",
            label: "70 + 13 = 83",
            next: "check",
          },
          wrongs: [
            {
              id: "76",
              label: "76 — add 6 to 70 and drop the 7",
              explain: "Both ones still count: 7 and 6.\n\nRevisit the pour.",
            },
            {
              id: "107",
              label: "107 — treat 47+36 as 47+60",
              explain: "36 is 30+6, not 60.\n\nRevisit the pour.",
            },
          ],
        },
        {
          id: "check",
          message: "58 − 23, left to right. 50−20=30, 8−3=5.\n\nResult?",
          correct: {
            id: "35",
            label: "35",
            next: "success",
          },
          wrongs: [
            {
              id: "31",
              label: "31 — subtract 8−3 wrong as 3−8 with a borrow story",
              explain: "Left-to-right: tens 30, ones 5, total 35.\n\nTry the check again.",
            },
            {
              id: "81",
              label: "81 — added instead of subtracting",
              explain: "The prompt is subtract.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Large place first, then pour the rest as a running total.\n\nSAMPLE: 47+36=83, 58−23=35.",
    },
  ),
  spec(
    "round-compensate",
    "Round to easy, then pay it back",
    "SAMPLE 49×6: 50×6=300, minus the extra 6 → 294.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 49 × 6. 49 is almost 50.\n\nWhat is the move?",
          correct: {
            id: "round",
            label: "Round to 50×6, then subtract the extra 1×6",
            next: "pay",
          },
          wrongs: [
            {
              id: "forty",
              label: "Round down to 40×6=240 and stop",
              explain:
                "You under-rounded by 9 and did not compensate. 49 wants 50, then pay back.\n\nReturn to the round.",
            },
            {
              id: "table",
              label: "Recite a 49-times table if you had one",
              explain:
                "You will not. Near numbers exist so you can use 50.\n\nReturn to the round.",
            },
          ],
        },
        {
          id: "pay",
          message: "50 × 6 = 300. You used one extra 6.\n\nCompensate?",
          correct: {
            id: "294",
            label: "300 − 6 = 294",
            next: "check",
          },
          wrongs: [
            {
              id: "add",
              label: "300 + 6 = 306",
              explain:
                "You rounded up, so you owe a subtraction. Sign follows the round.\n\nRevisit the payback.",
            },
            {
              id: "minus_50",
              label: "300 − 50 = 250",
              explain:
                "You compensate the extra factor (the +1 on 49), times 6 — not the 50 itself.\n\nRevisit the payback.",
            },
          ],
        },
        {
          id: "check",
          message: "38 × 5. Round 38 to 40, 40×5=200. Extra 2×5=10.\n\nResult?",
          correct: {
            id: "190",
            label: "190",
            next: "success",
          },
          wrongs: [
            {
              id: "210",
              label: "210 — added the compensation",
              explain: "Rounded up → subtract 10.\n\nTry the check again.",
            },
            {
              id: "200",
              label: "200 — forgot to pay back",
              explain: "200 is the rounded product, not 38×5.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Round to an easy number, compute, compensate with the opposite sign.\n\nSAMPLE: 49×6=294, 38×5=190.",
    },
  ),
  spec(
    "double-half",
    "Times five is times ten, then half",
    "SAMPLE 86×5: 860/2=430. ×4 and ×8 are repeated doubles.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 86 × 5. Fives look messy.\n\nWhich identity?",
          correct: {
            id: "ten_half",
            label: "×10 then half (because 5 = 10/2)",
            next: "apply",
          },
          wrongs: [
            {
              id: "five_add",
              label: "Add 86 five times",
              explain:
                "Slow. ×5 is the ×10-then-half identity.\n\nReturn to the identity.",
            },
            {
              id: "double_only",
              label: "Double 86 and stop at 172",
              explain:
                "Doubling is ×2. ×5 still needs ×10 then half.\n\nReturn to the identity.",
            },
          ],
        },
        {
          id: "apply",
          message: "86 × 10 = 860. Half of 860?",
          correct: {
            id: "430",
            label: "430",
            next: "check",
          },
          wrongs: [
            {
              id: "860",
              label: "860 — skipped the half",
              explain: "That is ×10, not ×5.\n\nRevisit the half.",
            },
            {
              id: "86",
              label: "86 — halved first and forgot ×10",
              explain: "Half of 86 is 43, then ×10 would still be 430 — same answer if you finish. Stopping at 86 is ×1.\n\nRevisit the half.",
            },
          ],
        },
        {
          id: "check",
          message: "×4 is double-double. 15 × 4?",
          correct: {
            id: "60",
            label: "30, then 60",
            next: "success",
          },
          wrongs: [
            {
              id: "30",
              label: "30 — only one double",
              explain: "One double is ×2. ×4 needs a second double.\n\nTry the check again.",
            },
            {
              id: "120",
              label: "120 — three doubles (that is ×8)",
              explain: "×8 is double-double-double. ×4 is two doubles.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. ×5 = ×10 then half; ×4 and ×8 are repeated doubles.\n\nSAMPLE: 86×5=430, 15×4=60.",
    },
  ),
  spec(
    "multiply-near",
    "Near tens: ×9, ×11, n5 squared",
    "SAMPLE 35²: n(n+1) then glue 25 → 1,225. ×9 is ×10 minus the number.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 35 squared in a pricing square-footage aside.\n\nNumbers ending in 5?",
          correct: {
            id: "n_n1",
            label: "n(n+1), then glue 25 (here 3×4=12 → 1,225)",
            next: "nine",
          },
          wrongs: [
            {
              id: "thirty_five",
              label: "35 × 30 + 35 × 5 by distributing slowly",
              explain:
                "Distribution works; this family trains the n5 glue. 3×4=12, glue 25.\n\nReturn to the square.",
            },
            {
              id: "30_sq",
              label: "30²=900 and stop",
              explain:
                "You dropped the 5. The glue method keeps it.\n\nReturn to the square.",
            },
          ],
        },
        {
          id: "nine",
          message: "Now ×9: 27 × 9. Identity?",
          correct: {
            id: "minus",
            label: "27×10=270, minus 27 → 243",
            next: "check",
          },
          wrongs: [
            {
              id: "plus",
              label: "270 + 27 = 297",
              explain:
                "×9 is one less than ×10, so subtract.\n\nRevisit ×9.",
            },
            {
              id: "eleven",
              label: "Park a 2+7=9 in the middle as if it were ×11",
              explain:
                "×11 parks the digit sum. ×9 is ×10 minus the number.\n\nRevisit ×9.",
            },
          ],
        },
        {
          id: "check",
          message: "×11: 35 × 11. Park 3+5=8 in the middle.",
          correct: {
            id: "385",
            label: "385",
            next: "success",
          },
          wrongs: [
            {
              id: "350",
              label: "350 — ×10 only",
              explain: "×11 is ×10 plus the number: 350+35=385, or park 8.\n\nTry the check again.",
            },
            {
              id: "3535",
              label: "3,535 — concatenated 35 twice",
              explain: "That is not the park-the-sum rule.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. n5² glues 25; ×9 is ×10 minus n; ×11 parks the digit sum.\n\nSAMPLE: 35²=1,225, 27×9=243, 35×11=385.",
    },
  ),
  spec(
    "fraction-percent",
    "Common fractions are percents",
    "SAMPLE 1/8 of 800: 12.5% or ÷8 → 100. Keep 1/2, 1/3, 1/4, 1/5, 1/8, 1/10.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 1/8 of 800. Do you grind 0.125, or use a table?",
          correct: {
            id: "table",
            label: "1/8 is 12.5%, or just 800÷8",
            next: "apply",
          },
          wrongs: [
            {
              id: "ten",
              label: "Treat 1/8 like 10% because 8 is near 10",
              explain:
                "10% of 800 is 80. 1/8 is 12.5% → 100. Near is not same.\n\nReturn to the table.",
            },
            {
              id: "half_half",
              label: "Half of 800 is 400, and 1/8 is close enough to half",
              explain:
                "1/8 is half of 1/4, not half of the whole.\n\nReturn to the table.",
            },
          ],
        },
        {
          id: "apply",
          message: "800 ÷ 8, or 25% of 800 is 200, half of that is 1/8.\n\nValue?",
          correct: {
            id: "100",
            label: "100",
            next: "check",
          },
          wrongs: [
            {
              id: "200",
              label: "200 — that is 1/4",
              explain: "1/4 of 800 is 200. 1/8 is half of that.\n\nRevisit 1/8.",
            },
            {
              id: "80",
              label: "80 — 10%",
              explain: "10% is 1/10. 1/8 is larger: 100.\n\nRevisit 1/8.",
            },
          ],
        },
        {
          id: "check",
          message: "1/3 ≈ 33%. 1/3 of 3,000?",
          correct: {
            id: "1000",
            label: "1,000",
            next: "success",
          },
          wrongs: [
            {
              id: "300",
              label: "300 — 10%",
              explain: "10% of 3,000 is 300. A third is 1,000.\n\nTry the check again.",
            },
            {
              id: "33",
              label: "33 — copied the 33% digits",
              explain: "33% of 3,000 is 990–1,000, not 33.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Keep a tiny fraction↔percent table and scale.\n\nSAMPLE: 1/8 of 800=100, 1/3 of 3,000=1,000.",
    },
  ),
  spec(
    "rule-of-72",
    "Years to double ≈ 72 ÷ rate",
    "SAMPLE 6%/year → 12 years. 9% → 8 years. Compounding, not simple interest.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 6% a year, compounding. Years to double?\n\nWhich shortcut?",
          correct: {
            id: "div72",
            label: "72 ÷ 6 ≈ 12 years",
            next: "nine",
          },
          wrongs: [
            {
              id: "div100",
              label: "100 ÷ 6 ≈ 16 years (rule of 100)",
              explain:
                "Rule of 100 is closer to simple interest. Compounding uses ~72.\n\nReturn to 72.",
            },
            {
              id: "six",
              label: "6 years because the rate is 6%",
              explain:
                "The rate is not the year count. 72÷6=12.\n\nReturn to 72.",
            },
          ],
        },
        {
          id: "nine",
          message: "9% a year. 72 ÷ 9?",
          correct: {
            id: "eight",
            label: "8 years",
            next: "check",
          },
          wrongs: [
            {
              id: "9",
              label: "9 years",
              explain: "72÷9=8, not 9.\n\nRevisit 9%.",
            },
            {
              id: "72",
              label: "72 years",
              explain: "You skipped the divide.\n\nRevisit 9%.",
            },
          ],
        },
        {
          id: "check",
          message:
            "Someone says 10% doubles in 5 years. Smell test?",
          correct: {
            id: "seven",
            label: "72÷10 ≈ 7 years, so 5 years is too aggressive",
            next: "success",
          },
          wrongs: [
            {
              id: "agree",
              label: "Agree — 10% feels like a five-year double",
              explain:
                "Rule of 72 says ~7 years at 10%. 5 years would need ~14%.\n\nTry the smell test again.",
            },
            {
              id: "ten",
              label: "10 years because 10%",
              explain:
                "That is the rate copied as years. Use 72÷10.\n\nTry the smell test again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Years to double ≈ 72 ÷ annual percent (compounding).\n\nSAMPLE: 6%→12 years, 9%→8, 10%→~7.",
    },
  ),
  spec(
    "pareto",
    "Twenty percent carries about eighty",
    "SAMPLE 1,000 users: ~200 whales. Treat that slice as most of the load.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 1,000 users. Someone wants to size as if all 1,000 hit equally.\n\nFirst move?",
          correct: {
            id: "slice",
            label: "Take 20% as the heavy slice → about 200",
            next: "load",
          },
          wrongs: [
            {
              id: "flat",
              label: "Plan as 1,000 identical users",
              explain:
                "80/20 says a thin slice carries most of the load. Start with 20% of the count.\n\nReturn to the slice.",
            },
            {
              id: "half",
              label: "Assume half are heavy",
              explain:
                "The heuristic is 20%, not 50%. 1,000 → 200.\n\nReturn to the slice.",
            },
          ],
        },
        {
          id: "load",
          message: "Those ~200. How do you talk about load?",
          correct: {
            id: "eighty",
            label: "Treat them as ~80% of traffic or revenue",
            next: "check",
          },
          wrongs: [
            {
              id: "twenty_load",
              label: "They are 20% of load too",
              explain:
                "20% of users, 80% of load. Do not copy the headcount percent onto the load.\n\nRevisit load.",
            },
            {
              id: "all",
              label: "Still 1,000 of load — whales are extra",
              explain:
                "The point is concentration. Size the painful part for 200, not 1,000.\n\nRevisit load.",
            },
          ],
        },
        {
          id: "check",
          message: "500 customers. Heavy slice?",
          correct: {
            id: "hundred",
            label: "About 100 carry most of revenue",
            next: "success",
          },
          wrongs: [
            {
              id: "400",
              label: "400 — that is 80% of the count",
              explain:
                "You took 80% of customers. Take 20% of the count (100), then say those 100 ≈ 80% of revenue.\n\nTry the check again.",
            },
            {
              id: "500",
              label: "All 500 equally",
              explain:
                "That ignores 80/20.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. 20% of the count is the heavy slice; treat it as ~80% of load.\n\nSAMPLE: 1,000 users → ~200 whales.",
    },
  ),
  spec(
    "revenue-triangle",
    "Revenue is price times users",
    "SAMPLE $50 × 20 = $1,000. Invert: users = revenue ÷ price.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: $50 price, 20 users. Monthly revenue?\n\nWhich identity?",
          correct: {
            id: "times",
            label: "Revenue = price × users → $1,000",
            next: "invert",
          },
          wrongs: [
            {
              id: "divide",
              label: "Users = price ÷ 20",
              explain:
                "That mixed the triangle. R = P × U. 50×20=1,000.\n\nReturn to multiply.",
            },
            {
              id: "be",
              label: "Users needed = cost ÷ price",
              explain:
                "That is break-even. This prompt was revenue, not users-to-cover-cost.\n\nReturn to multiply.",
            },
          ],
        },
        {
          id: "invert",
          message: "Someone wants $5,000 at $50. Users?",
          correct: {
            id: "hundred",
            label: "Users = revenue ÷ price → 100",
            next: "check",
          },
          wrongs: [
            {
              id: "times_again",
              label: "50 × 5,000 = 250,000 users",
              explain:
                "You multiplied when you needed to divide. $5,000 ÷ $50 = 100.\n\nRevisit invert.",
            },
            {
              id: "fifty",
              label: "50 users because the price is 50",
              explain:
                "Price copied as headcount. Divide revenue by price.\n\nRevisit invert.",
            },
          ],
        },
        {
          id: "check",
          message: "$100 × 100 users. Revenue?",
          correct: {
            id: "10k",
            label: "$10,000",
            next: "success",
          },
          wrongs: [
            {
              id: "1k",
              label: "$1,000 — dropped a zero",
              explain: "100×100=10,000.\n\nTry the check again.",
            },
            {
              id: "200",
              label: "$200 — added instead of multiplied",
              explain: "The triangle multiplies.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. R = P × U. Invert any side.\n\nSAMPLE: $50×20=$1,000; $5,000 at $50 → 100 users.",
    },
  ),
  spec(
    "divisibility",
    "Last digits and digit sums",
    "SAMPLE 4,731: digit sum 15, so yes for 3. Last two / alternating sum for 4 and 11.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: is 4,731 divisible by 3? You do not want long division.\n\nFirst move?",
          correct: {
            id: "sum",
            label: "Add the digits: 4+7+3+1=15, and 15÷3 works",
            next: "four",
          },
          wrongs: [
            {
              id: "last",
              label: "Look at the last digit 1 — odd, so no",
              explain:
                "Last digit is the ×2 / ×5 test. Three is a digit-sum test.\n\nReturn to the sum.",
            },
            {
              id: "divide",
              label: "Divide 4,731 by 3 in columns",
              explain:
                "Works, but slow. Digit sum 15 already tells you yes.\n\nReturn to the sum.",
            },
          ],
        },
        {
          id: "four",
          message: "Now ÷4: 7,316. Which digits matter?",
          correct: {
            id: "two",
            label: "Last two: 16, and 16÷4, so yes",
            next: "check",
          },
          wrongs: [
            {
              id: "all_sum",
              label: "Digit sum 7+3+1+6=17",
              explain:
                "Digit sum is 3 and 9. Four only looks at the last two digits.\n\nRevisit ÷4.",
            },
            {
              id: "last_6",
              label: "Last digit 6 is even, so yes for 4",
              explain:
                "Even is the ×2 test. 14 is even and not divisible by 4. Need the last two.\n\nRevisit ÷4.",
            },
          ],
        },
        {
          id: "check",
          message: "2,728 for 11. Alternating sum?",
          correct: {
            id: "neg11",
            label: "2−7+2−8=−11, a multiple of 11, so yes",
            next: "success",
          },
          wrongs: [
            {
              id: "sum11",
              label: "2+7+2+8=19",
              explain: "That is a plain sum. Eleven alternates signs.\n\nTry the check again.",
            },
            {
              id: "last_two",
              label: "28÷11 is not whole, so no",
              explain: "Last two is not the 11 test. Use 2−7+2−8.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. 3/9 digit sum; 4 last two; 11 alternating.\n\nSAMPLE: 4,731 yes for 3; 7,316 yes for 4; 2,728 yes for 11.",
    },
  ),
  spec(
    "criss-cross",
    "Vertical, then crosswise, then vertical",
    "SAMPLE 23×21: ones 3, cross 8, tens 4 → 483.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 23 × 21 in a seating grid. You want three slots, not long multiply.\n\nOrder?",
          correct: {
            id: "slots",
            label: "Ones product, then the two crosses added, then tens product",
            next: "apply",
          },
          wrongs: [
            {
              id: "add",
              label: "23+21=44 and stop",
              explain: "That is addition. Need the three multiply slots.\n\nReturn to the slots.",
            },
            {
              id: "only_ones",
              label: "3×1=3 and call it 3",
              explain: "That is only the ones slot. Cross and tens still count.\n\nReturn to the slots.",
            },
          ],
        },
        {
          id: "apply",
          message: "23 × 21. Ones 3×1=3. Cross?",
          correct: {
            id: "eight",
            label: "2×1 + 3×2 = 8, tens 2×2=4 → 483",
            next: "check",
          },
          wrongs: [
            {
              id: "five",
              label: "2+1+3+2=8 as an add of the digits, tens leftover",
              explain:
                "The 8 happens to match but you must multiply crosses, not add digits.\n\nRevisit the cross.",
            },
            {
              id: "six",
              label: "2×3=6 for the cross",
              explain: "Cross is 2×1 plus 3×2, not the two tens digits.\n\nRevisit the cross.",
            },
          ],
        },
        {
          id: "check",
          message: "12 × 13. Same three slots?",
          correct: {
            id: "156",
            label: "2×3=6, 1×3+2×1=5, 1×1=1 → 156",
            next: "success",
          },
          wrongs: [
            {
              id: "36",
              label: "12+13+11=36",
              explain: "Not the slots. Ones 6, cross 5, tens 1.\n\nTry the check again.",
            },
            {
              id: "169",
              label: "13²=169",
              explain: "That is 13×13, not 12×13.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Ones, cross, tens — carry when a slot hits 10.\n\nSAMPLE: 23×21=483, 12×13=156.",
    },
  ),
  spec(
    "difference-squares",
    "Equally far from a center is a² − b²",
    "SAMPLE 48×52: 50² − 2² = 2,496. Same-tens ones-to-10 glues the same identity.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 48 × 52. Both hug 50.\n\nWhich identity?",
          correct: {
            id: "mid",
            label: "50² minus 2² → 2,500 − 4 = 2,496",
            next: "tens",
          },
          wrongs: [
            {
              id: "fifty_sq",
              label: "50×50=2,500 and stop",
              explain:
                "That skipped the gap. Each side is 2 away, so subtract 4.\n\nReturn to the center.",
            },
            {
              id: "add",
              label: "48+52=100, times something",
              explain:
                "The sum is 100, but the product is the difference of squares, not a sum trick.\n\nReturn to the center.",
            },
          ],
        },
        {
          id: "tens",
          message: "43 × 47. Same tens, ones add to 10. Glue?",
          correct: {
            id: "2021",
            label: "4×5=20, 3×7=21 → 2,021",
            next: "check",
          },
          wrongs: [
            {
              id: "12",
              label: "4×3=12 and glue 47",
              explain:
                "Left is tens×(tens+1), right is the ones product.\n\nRevisit the glue.",
            },
            {
              id: "2500",
              label: "Call it 2,500 because they look near 50",
              explain:
                "The center is 45, not 50. Use the same-tens glue.\n\nRevisit the glue.",
            },
          ],
        },
        {
          id: "check",
          message: "47 × 53. Center 50, gap 3.",
          correct: {
            id: "2491",
            label: "2,500 − 9 = 2,491",
            next: "success",
          },
          wrongs: [
            {
              id: "2509",
              label: "2,500 + 9",
              explain: "You add the squares? Subtract the gap squared.\n\nTry the check again.",
            },
            {
              id: "2496",
              label: "2,496 — used gap 2 from the 48×52 sample",
              explain: "This gap is 3. 3²=9.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Equally far from c is c²−d². Same-tens ones-to-10 glues tens×(tens+1) | ones product.\n\nSAMPLE: 48×52=2,496, 43×47=2,021.",
    },
  ),
  spec(
    "easy-division",
    "Turn division into an easier multiply",
    "SAMPLE 675÷25: ×4 then two places left → 27. Or factor the divisor; or scale both.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 675 ÷ 25. Twenty-fives look messy.\n\nRewrite?",
          correct: {
            id: "times4",
            label: "×4, then ÷100 → 2,700 → 27",
            next: "factor",
          },
          wrongs: [
            {
              id: "times5",
              label: "×2 then ÷10, the ÷5 move",
              explain:
                "÷5 is ×2÷10. ÷25 is ×4÷100.\n\nReturn to the rewrite.",
            },
            {
              id: "long",
              label: "Long divide 25 into 675",
              explain:
                "Works, but the rewrite is the family. ×4 then two places.\n\nReturn to the rewrite.",
            },
          ],
        },
        {
          id: "factor",
          message: "936 ÷ 12. 12 is 3×4. Path?",
          correct: {
            id: "78",
            label: "936÷3=312, then ÷4=78",
            next: "check",
          },
          wrongs: [
            {
              id: "times12",
              label: "936 × 12",
              explain: "That is the product, not the quotient.\n\nRevisit factoring.",
            },
            {
              id: "div2",
              label: "Halve 936 because 12 is even, stop at 468",
              explain:
                "One factor of 2 is not ÷12. Need ÷3 and ÷4 (or ÷2 and ÷6).\n\nRevisit factoring.",
            },
          ],
        },
        {
          id: "check",
          message: "4.8 ÷ 0.06. Scale both?",
          correct: {
            id: "80",
            label: "×100 → 480 ÷ 6 = 80",
            next: "success",
          },
          wrongs: [
            {
              id: "8",
              label: "×10 → 48 ÷ 6 = 8",
              explain:
                "0.06 needs two places to become 6. Scale both ×100.\n\nTry the check again.",
            },
            {
              id: "480",
              label: "480 — scaled the 4.8 and stopped",
              explain: "You still have to divide by 6.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Rewrite ÷ as × and a shift; or factor; or scale both.\n\nSAMPLE: 675÷25=27, 936÷12=78, 4.8÷0.06=80.",
    },
  ),
  spec(
    "complements",
    "What is missing to 10 or 100",
    "SAMPLE 8+7: 8 needs 2, leftover 5 → 15. Pair lists; Gauss pairs the ends of a run.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 8+7. Make 10, do not count up.\n\nMove?",
          correct: {
            id: "two",
            label: "8 needs 2 from the 7, leftover 5 → 15",
            next: "hundred",
          },
          wrongs: [
            {
              id: "count",
              label: "Count 9, 10, 11, 12, 13, 14, 15",
              explain:
                "Slow. Complements: 8+2=10, then +5.\n\nReturn to make 10.",
            },
            {
              id: "eight",
              label: "8+8=16 minus 1",
              explain:
                "A compensation works; this family trains the missing-to-10 split.\n\nReturn to make 10.",
            },
          ],
        },
        {
          id: "hundred",
          message: "68+47. Make 100?",
          correct: {
            id: "115",
            label: "68 needs 32, leftover 15 → 115",
            next: "check",
          },
          wrongs: [
            {
              id: "115_add",
              label: "60+40=100, 8+7=15, total 115 — but as columns from the right",
              explain:
                "Same numbers; the move is 68’s complement 32, not ones-first columns.\n\nRevisit make 100.",
            },
            {
              id: "32",
              label: "68 needs 32, and stop at 32",
              explain: "32 is what you took from 47. Leftover 15 sits on 100.\n\nRevisit make 100.",
            },
          ],
        },
        {
          id: "check",
          message: "1+2+…+10. Gauss pairing?",
          correct: {
            id: "55",
            label: "5 pairs of 11 = 55",
            next: "success",
          },
          wrongs: [
            {
              id: "10",
              label: "10 pairs of 1",
              explain: "Pair first with last: 1+10=11, and there are 5 such pairs.\n\nTry the check again.",
            },
            {
              id: "110",
              label: "10×11=110",
              explain: "That skipped the ÷2. n(n+1)/2 = 55.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Missing-to-10/100, pair a list, Gauss n(n+1)/2.\n\nSAMPLE: 8+7=15, 68+47=115, 1…10=55.",
    },
  ),
  spec(
    "equal-adjust",
    "Add the same to both sides of a subtract",
    "SAMPLE 502−198: add 2 to both → 504−200=304. Not the same as rounding one side.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 502 − 198. Crossing zeros is ugly.\n\nMove?",
          correct: {
            id: "both",
            label: "Add 2 to both: 504 − 200 = 304",
            next: "why",
          },
          wrongs: [
            {
              id: "one",
              label: "Round 198 to 200, 502−200=302, and stop",
              explain:
                "That rounded one side and forgot the payback. Equal-adjust moves both, so there is no payback.\n\nReturn to both sides.",
            },
            {
              id: "borrow",
              label: "Borrow across the zeros in columns",
              explain:
                "Works on paper. In the head, push 198 to 200 and bring 502 along.\n\nReturn to both sides.",
            },
          ],
        },
        {
          id: "why",
          message: "Why is 504−200 still 502−198?",
          correct: {
            id: "same_c",
            label: "a−b = (a+c)−(b+c). The gap is unchanged",
            next: "check",
          },
          wrongs: [
            {
              id: "lucky",
              label: "It just happens to work for 2",
              explain:
                "Any c works. You pick c so the subtrahend becomes round.\n\nRevisit the identity.",
            },
            {
              id: "add_ans",
              label: "You have to add the 2 back to 304",
              explain:
                "No payback. Both sides already moved.\n\nRevisit the identity.",
            },
          ],
        },
        {
          id: "check",
          message: "725 − 397. Add 3 to both.",
          correct: {
            id: "328",
            label: "728 − 400 = 328",
            next: "success",
          },
          wrongs: [
            {
              id: "325",
              label: "725 − 400 = 325",
              explain: "You moved only one side. Add 3 to 725 as well.\n\nTry the check again.",
            },
            {
              id: "331",
              label: "328 + 3 = 331 as a payback",
              explain: "No payback on this family.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Add the same to both; the difference is unchanged.\n\nSAMPLE: 502−198=304, 725−397=328.",
    },
  ),
  spec(
    "cross-cancel",
    "Cancel factors before you multiply",
    "SAMPLE 6/8 × 4/3 cancels to 1. Compare fractions with a×d vs b×c.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 6/8 × 4/3. Do not multiply 24/24 first.\n\nMove?",
          correct: {
            id: "cancel",
            label: "Cancel 6 with 3, 4 with 8 → 1",
            next: "compare",
          },
          wrongs: [
            {
              id: "twentyfour",
              label: "6×4=24, 8×3=24, then reduce 24/24",
              explain:
                "Same answer, extra work. Cancel on sight before the product.\n\nReturn to cancel.",
            },
            {
              id: "add",
              label: "Add 6/8 + 4/3",
              explain: "The prompt was a product, not a sum.\n\nReturn to cancel.",
            },
          ],
        },
        {
          id: "compare",
          message: "7/11 vs 8/13. Which is larger, without decimals?",
          correct: {
            id: "seven",
            label: "7×13=91, 8×11=88, so 7/11",
            next: "check",
          },
          wrongs: [
            {
              id: "eights",
              label: "8/13 because 8>7 and 13>11",
              explain:
                "Larger pieces on both sides is not a comparison. Cross multiply.\n\nRevisit the cross.",
            },
            {
              id: "eleven",
              label: "7×11 vs 8×13",
              explain:
                "That is a×b vs c×d, not a×d vs b×c.\n\nRevisit the cross.",
            },
          ],
        },
        {
          id: "check",
          message: "8/12 × 9/2 after cancel?",
          correct: {
            id: "three",
            label: "3",
            next: "success",
          },
          wrongs: [
            {
              id: "one",
              label: "1 — cancelled everything",
              explain: "8/12 is 2/3, times 9/2 = 3.\n\nTry the check again.",
            },
            {
              id: "36",
              label: "8×9 / 12×2 = 72/24 wait, 3… no, 36",
              explain: "72/24 is 3. Do not stop at 36.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Cancel across the fraction product. Compare with cross products.\n\nSAMPLE: 6/8×4/3=1; 7/11 > 8/13; 8/12×9/2=3.",
    },
  ),
  spec(
    "cast-nines",
    "Digit root and last-digit checks",
    "SAMPLE: a product that does not end in the right ones digit is already false. Digit roots matching does not prove the answer.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: someone claims 327 × 648 = 211,895.\n\nCheapest kill?",
          correct: {
            id: "ones",
            label: "7×8=56, so the product must end in 6, not 5",
            next: "nines",
          },
          wrongs: [
            {
              id: "recompute",
              label: "Re-multiply all six digits to argue",
              explain:
                "You do not owe them a full recompute. Last digit already kills it.\n\nReturn to ones.",
            },
            {
              id: "size",
              label: "211,895 looks about the right size, so it is fine",
              explain:
                "Magnitude can still be wrong in the ones place. Check the last digit.\n\nReturn to ones.",
            },
          ],
        },
        {
          id: "nines",
          message:
            "Digit root of 347 is 5, of 26 is 8. 5×8 → 4. A claim of 9,022 roots to 4. What did you prove?",
          correct: {
            id: "survive",
            label: "It survives the check — not that it is correct",
            next: "check",
          },
          wrongs: [
            {
              id: "proved",
              label: "The product is definitely 9,022",
              explain:
                "A matching root can still hide a 9-off error. Only a mismatch is decisive.\n\nRevisit what the check proves.",
            },
            {
              id: "fail",
              label: "4 vs 4 means it failed",
              explain: "Match = survives. Mismatch = definitely wrong.\n\nRevisit what the check proves.",
            },
          ],
        },
        {
          id: "check",
          message: "Digit root of 87,946?",
          correct: {
            id: "seven",
            label: "8+7+9+4+6=34 → 7",
            next: "success",
          },
          wrongs: [
            {
              id: "34",
              label: "34 — stop after one pass",
              explain: "Keep going until one digit: 3+4=7.\n\nTry the check again.",
            },
            {
              id: "nine",
              label: "9 because there is a 9 in the number",
              explain: "You sum all digits, including the 9.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Last digit is a hard fail. Digit root match is only a maybe.\n\nSAMPLE: 327×648 cannot end in 5; 87,946 roots to 7.",
    },
  ),
  spec(
    "approx-sqrt",
    "Nearby square, then bump d / 2a",
    "SAMPLE √104: 10²=100, leftover 4, 4/20=0.2 → 10.2. Or one Babylonian average.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: √104 in a “how long is the side” aside. 10²=100.\n\nBump?",
          correct: {
            id: "point2",
            label: "d=4, 2a=20, 4/20=0.2 → 10.2",
            next: "babylon",
          },
          wrongs: [
            {
              id: "eleven",
              label: "11, because 11²=121 is closer than 9²",
              explain:
                "104 is just above 100, not near 121. Use 10 + 4/20.\n\nReturn to the bump.",
            },
            {
              id: "four",
              label: "10+4=14",
              explain: "You add d, not d/(2a). The bump is 0.2.\n\nReturn to the bump.",
            },
          ],
        },
        {
          id: "babylon",
          message: "√16, sloppy guess 5. One Babylonian step?",
          correct: {
            id: "41",
            label: "(5 + 16/5)/2 = 4.1",
            next: "check",
          },
          wrongs: [
            {
              id: "five",
              label: "Stay at 5",
              explain: "The step averages 5 with 3.2.\n\nRevisit the average.",
            },
            {
              id: "21",
              label: "5 + 16/5 = 8.2, and stop (forgot the /2)",
              explain: "That is the sum, not the average. Divide by 2.\n\nRevisit the average.",
            },
          ],
        },
        {
          id: "check",
          message: "√103. 10²=100, d=3. Bump?",
          correct: {
            id: "1015",
            label: "3/20=0.15 → 10.15",
            next: "success",
          },
          wrongs: [
            {
              id: "103",
              label: "10.3 — added 3 as tenths",
              explain: "d/2a is 3/20, not 3/10.\n\nTry the check again.",
            },
            {
              id: "13",
              label: "10+3=13",
              explain: "Again, divide d by 2a.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. √(a²+d) ≈ a + d/(2a). One Babylonian average if you have a guess.\n\nSAMPLE: √104≈10.2, √16 from 5 → 4.1.",
    },
  ),
  spec(
    "regroup-factors",
    "Pair the easy factors first",
    "SAMPLE 25×16×4: 25×4=100, then ×16=1,600. Do not multiply left to right out of habit.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 25 × 16 × 4. Left-to-right 25×16 is ugly.\n\nFirst pair?",
          correct: {
            id: "hundred",
            label: "25×4=100, then 100×16=1,600",
            next: "scan",
          },
          wrongs: [
            {
              id: "left",
              label: "25×16=400, then ×4",
              explain:
                "You get 1,600 if you finish, but the habit is to hunt 25×4 first.\n\nReturn to the pair.",
            },
            {
              id: "add",
              label: "25+16+4=45",
              explain: "Product, not sum. Pair 25 with 4.\n\nReturn to the pair.",
            },
          ],
        },
        {
          id: "scan",
          message: "8 × 37 × 125. Scan the whole product.",
          correct: {
            id: "37k",
            label: "8×125=1,000, then ×37 = 37,000",
            next: "check",
          },
          wrongs: [
            {
              id: "296",
              label: "8×37=296, then worry about 125",
              explain:
                "296×125 is the slow path. 8×125 is the thousand.\n\nRevisit the scan.",
            },
            {
              id: "1000_stop",
              label: "8×125=1,000 and stop",
              explain: "You still have the 37. Dump it on the thousand.\n\nRevisit the scan.",
            },
          ],
        },
        {
          id: "check",
          message: "25 × 48. Factor 48 if it helps.",
          correct: {
            id: "1200",
            label: "25×4×12 = 100×12 = 1,200",
            next: "success",
          },
          wrongs: [
            {
              id: "1000",
              label: "25×40=1,000 and drop the 8",
              explain: "48=40+8 or 4×12. Do not drop the 8.\n\nTry the check again.",
            },
            {
              id: "73",
              label: "25+48=73",
              explain: "Product. Pair 25 with 4.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Associate so a pair makes 10 or 100, then dump the leftover.\n\nSAMPLE: 25×16×4=1,600, 8×37×125=37,000.",
    },
  ),
  spec(
    "stacked-founder",
    "Chain Track A shortcuts in one planning sentence",
    "SAMPLE $1/hr and $40/mo: ×720 then ÷ price → ~18 users per server.",
    B,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE planning sentence: GPU $1/hr, product $40/mo. Users per box?\n\nFirst link?",
          correct: {
            id: "hour",
            label: "Hourly ×720 → $720/mo cost, then ÷ $40 price",
            next: "users",
          },
          wrongs: [
            {
              id: "price_only",
              label: "Ignore the hourly and just guess from $40",
              explain:
                "Stacked founder math is a chain. Convert time first.\n\nReturn to the chain.",
            },
            {
              id: "times_40",
              label: "$1 × $40 = 40 users",
              explain:
                "You multiplied unlike units. Cost and price must share a time base.\n\nReturn to the chain.",
            },
          ],
        },
        {
          id: "users",
          message: "720 ÷ 40. Reduce: 72 ÷ 4.\n\nUsers per server?",
          correct: {
            id: "18",
            label: "About 18",
            next: "funnel",
          },
          wrongs: [
            {
              id: "180",
              label: "180 — extra zero",
              explain: "720÷40=18.\n\nRevisit the divide.",
            },
            {
              id: "40",
              label: "40 — copied the price",
              explain: "Users = monthly cost ÷ price, not the price itself.\n\nRevisit the divide.",
            },
          ],
        },
        {
          id: "funnel",
          message:
            "Second SAMPLE chain: 10k visitors, 5% conversion. Customers?",
          correct: {
            id: "500",
            label: "500 — 1% of 10k is 100, five of those",
            next: "success",
          },
          wrongs: [
            {
              id: "50",
              label: "50 — 0.5%",
              explain: "5% is five times 1%. 100×5=500.\n\nTry the funnel again.",
            },
            {
              id: "10000",
              label: "10,000 — ignore conversion",
              explain: "Visitors are not customers until the percent lands.\n\nTry the funnel again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Track B sentence, Track A links: ×720, ÷price, percent chunks.\n\nSAMPLE: ~18 users/server; 10k×5%=500 customers.",
    },
  ),
  spec(
    "cfo-feasibility",
    "Ceiling is price × possible customers",
    "SAMPLE $20/mo × 10k users = $200k/mo. A $150k cost base is tight vs $5k.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: $20/mo, maybe 10k customers. Instant feasibility?\n\nFirst number?",
          correct: {
            id: "ceiling",
            label: "Max revenue ≈ 20 × 10,000 = $200k/mo",
            next: "cost",
          },
          wrongs: [
            {
              id: "cost_first",
              label: "Start with server invoices and never size the ceiling",
              explain:
                "Smell test is ceiling vs cost scale. Price × reachable customers first.\n\nReturn to the ceiling.",
            },
            {
              id: "yearly",
              label: "20 × 10k × 12 in the first breath and lose the monthly",
              explain:
                "You can yearly later. Monthly ceiling vs monthly cost is the conversation unit.\n\nReturn to the ceiling.",
            },
          ],
        },
        {
          id: "cost",
          message: "Infra already $150k/mo against a $200k ceiling.\n\nRead?",
          correct: {
            id: "tight",
            label: "Tight — cost already rivals the ceiling",
            next: "check",
          },
          wrongs: [
            {
              id: "fine",
              label: "Fine — $50k leftover is a fat margin",
              explain:
                "25% leftover before people, ads, and support is not fat. The model is weak at this cost scale.\n\nRevisit the read.",
            },
            {
              id: "impossible_math",
              label: "$150k cost means revenue must already be $150k",
              explain:
                "Cost is not revenue. The ceiling is $200k if you get all 10k.\n\nRevisit the read.",
            },
          ],
        },
        {
          id: "check",
          message: "Same 10k users, $5k infra. Read?",
          correct: {
            id: "room",
            label: "Room to operate — cost is a small slice of $200k",
            next: "success",
          },
          wrongs: [
            {
              id: "same",
              label: "Still tight because 10k users is 10k users",
              explain:
                "User count did not change; cost scale did. $5k vs $200k is a different story.\n\nTry the check again.",
            },
            {
              id: "zero",
              label: "Revenue is $5k because cost is $5k",
              explain:
                "Do not equate cost and revenue.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Ceiling = price × possible customers; compare cost scale to that ceiling.\n\nSAMPLE: $200k/mo vs $150k (tight) vs $5k (room).",
    },
  ),
  spec(
    "cfo-unit-econ",
    "LTV should be about 3× CAC",
    "SAMPLE CAC $40, $20/mo, 3 months → LTV $60 → 1.5×, weak vs 3×.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: CAC $40, price $20/mo, they stay 3 months.\n\nLTV first?",
          correct: {
            id: "ltv",
            label: "20 × 3 = $60 LTV (revenue over life)",
            next: "ratio",
          },
          wrongs: [
            {
              id: "cac_only",
              label: "Judge CAC $40 in isolation",
              explain:
                "CAC needs LTV. $40 might be cheap or fatal depending on life.\n\nReturn to LTV.",
            },
            {
              id: "year",
              label: "Assume 12 months because SaaS is annual",
              explain:
                "The SAMPLE said 3 months. Do not upgrade the life.\n\nReturn to LTV.",
            },
          ],
        },
        {
          id: "ratio",
          message: "LTV $60 / CAC $40.\n\nRatio vs the 3× rule?",
          correct: {
            id: "thin",
            label: "1.5× — thin versus ~3×",
            next: "check",
          },
          wrongs: [
            {
              id: "three",
              label: "3× — close enough",
              explain:
                "60/40=1.5. 3× would need $120 LTV.\n\nRevisit the ratio.",
            },
            {
              id: "invert",
              label: "40/60 ≈ 0.67×, so CAC is 67% of LTV and that is the 3×",
              explain:
                "The taught ratio is LTV/CAC, target ~3.\n\nRevisit the ratio.",
            },
          ],
        },
        {
          id: "check",
          message: "Same CAC $40, LTV $120. Ratio?",
          correct: {
            id: "ok",
            label: "3× — the default healthy smell",
            next: "success",
          },
          wrongs: [
            {
              id: "still_thin",
              label: "Still thin because CAC is $40",
              explain:
                "CAC did not change; LTV did. 120/40=3.\n\nTry the check again.",
            },
            {
              id: "twelve",
              label: "12× — mix in the $20 price",
              explain:
                "Do not shove price into the ratio twice. LTV already used it.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. LTV ≈ price × months; smell LTV/CAC around 3×.\n\nSAMPLE: $60/$40=1.5× weak; $120/$40=3×.",
    },
  ),
  spec(
    "cfo-runway",
    "Runway is cash ÷ monthly burn",
    "SAMPLE $120k cash, $20k burn → 6 months. Directional, not a close.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: $120k in the bank, $20k net burn a month.\n\nRunway shape?",
          correct: {
            id: "div",
            label: "Cash ÷ monthly burn",
            next: "months",
          },
          wrongs: [
            {
              id: "times",
              label: "Cash × burn",
              explain:
                "That is a nonsense product. Months = cash / burn.\n\nReturn to the shape.",
            },
            {
              id: "revenue",
              label: "Ignore burn; use cash ÷ revenue",
              explain:
                "Revenue is not what empties the account. Burn is.\n\nReturn to the shape.",
            },
          ],
        },
        {
          id: "months",
          message: "120 ÷ 20.\n\nMonths?",
          correct: {
            id: "six",
            label: "6 months",
            next: "check",
          },
          wrongs: [
            {
              id: "12",
              label: "12 months — treated 20 as 10",
              explain: "120/20=6.\n\nRevisit the divide.",
            },
            {
              id: "20",
              label: "20 months — copied the burn",
              explain: "Burn is the denominator, not the answer.\n\nRevisit the divide.",
            },
          ],
        },
        {
          id: "check",
          message: "$50k cash, $25k burn.\n\nMonths?",
          correct: {
            id: "two",
            label: "2 months — short",
            next: "success",
          },
          wrongs: [
            {
              id: "25",
              label: "25 months",
              explain: "50/25=2.\n\nTry the check again.",
            },
            {
              id: "half",
              label: "0.5 months — inverted the ratio",
              explain: "That would be burn/cash. Runway is cash/burn.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Runway ≈ cash ÷ monthly burn. Directional SAMPLE math, not a board close.\n\nSAMPLE: 120/20=6 months, 50/25=2.",
    },
  ),
  spec(
    "cfo-growth",
    "20% a month is not a 50× year",
    "SAMPLE: 20%/mo ≈ 1.7× in 3 months, ~3× in 6, ~9× in 12. 100 users cannot become 50,000.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE claim: 100 users at 20%/mo will be 50,000 in a year.\n\nFirst instinct?",
          correct: {
            id: "table",
            label: "Pull the 20% table: ~9× in 12 months, not 500×",
            next: "nine",
          },
          wrongs: [
            {
              id: "linear",
              label: "20% × 12 = 240% so 100 → 340 users, close enough to 50k",
              explain:
                "Linear add is the wrong model, and 340 is not 50k anyway. Compound ~9×.\n\nReturn to the table.",
            },
            {
              id: "believe",
              label: "Believe 50k — 20% sounds fast",
              explain:
                "Fast is not 500×. Memorize ~9× in a year at 20%/mo.\n\nReturn to the table.",
            },
          ],
        },
        {
          id: "nine",
          message: "100 × ~9.\n\nYear-end users?",
          correct: {
            id: "900",
            label: "About 900, not 50,000",
            next: "check",
          },
          wrongs: [
            {
              id: "50000",
              label: "50,000 if we round 9× up aggressively",
              explain:
                "9× on 100 is 900. 50,000 is 500×.\n\nRevisit 9×.",
            },
            {
              id: "120",
              label: "120 — added 20 once",
              explain:
                "That is one month, not twelve compounded.\n\nRevisit 9×.",
            },
          ],
        },
        {
          id: "check",
          message: "Same 20% table: 3 months is about 1.7×. 100 users?",
          correct: {
            id: "170",
            label: "About 170",
            next: "success",
          },
          wrongs: [
            {
              id: "160",
              label: "160 — 20%×3 linear then 100+60",
              explain:
                "Linear 60% would be 160. Compound is a bit more (~1.73× ≈ 173). The taught round is ~1.7×.\n\n160 is the linear trap — try again and pick the table.",
            },
            {
              id: "300",
              label: "300 — 20%× something with 100×3",
              explain:
                "Do not multiply users by 3. 1.7× on 100 ≈ 170.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Keep the 20%/mo table: ~1.7× / 3× / 9× at 3 / 6 / 12 months.\n\nSAMPLE: 100 cannot become 50k; ~900 in a year.",
    },
  ),
  spec(
    "mrr-arr",
    "ARR is MRR × 12",
    "SAMPLE $80k MRR → about $1M ARR. One-time fees are not MRR.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: $80k MRR. Someone says ARR.\n\nMove?",
          correct: {
            id: "x12",
            label: "×12 → about $960k, smell as ~$1M ARR",
            next: "onetime",
          },
          wrongs: [
            {
              id: "x10",
              label: "×10 because a million is easier",
              explain:
                "×10 understates 20%. ARR is twelve months of MRR.\n\nReturn to ×12.",
            },
            {
              id: "same",
              label: "ARR is the same $80k, just yearly branding",
              explain:
                "ARR is the annualized run rate, not the monthly number relabeled.\n\nReturn to ×12.",
            },
          ],
        },
        {
          id: "onetime",
          message:
            "That $80k includes $10k of one-time setup this month.\n\nMRR to annualize?",
          correct: {
            id: "strip",
            label: "$70k recurring × 12, not the $80k blob",
            next: "check",
          },
          wrongs: [
            {
              id: "keep",
              label: "Keep $80k — cash is cash",
              explain:
                "MRR excludes one-time. Annualizing a setup fee pretends it repeats.\n\nRevisit the strip.",
            },
            {
              id: "zero",
              label: "MRR is $0 because of the contamination",
              explain:
                "Strip the $10k; $70k still recurs.\n\nRevisit the strip.",
            },
          ],
        },
        {
          id: "check",
          message: "Clean $100k MRR. ARR smell?",
          correct: {
            id: "1_2",
            label: "About $1.2M",
            next: "success",
          },
          wrongs: [
            {
              id: "1m",
              label: "$1M even",
              explain: "100k×12=1.2M. $1M would be ~83k MRR.\n\nTry the check again.",
            },
            {
              id: "100k",
              label: "$100k ARR",
              explain: "That is still monthly.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. ARR ≈ MRR × 12. One-time is not MRR.\n\nSAMPLE: $80k→~$1M; strip setup before you annualize.",
    },
  ),
  spec(
    "churn",
    "Lifetime months ≈ 1 / monthly churn",
    "SAMPLE 5% monthly churn → ~20 months. Do not mix monthly with annual churn.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 5% monthly churn. How long do they stay, roughly?",
          correct: {
            id: "inv",
            label: "1 / 0.05 ≈ 20 months",
            next: "mix",
          },
          wrongs: [
            {
              id: "times",
              label: "5 × 12 = 60 months",
              explain:
                "You annualized the percent as if it were years of life. Inverse the monthly rate.\n\nReturn to 1/churn.",
            },
            {
              id: "five",
              label: "5 months because the number is 5",
              explain:
                "The 5 is a percent, not a month count. 1/0.05=20.\n\nReturn to 1/churn.",
            },
          ],
        },
        {
          id: "mix",
          message:
            "Someone quotes 5% churn without saying monthly vs yearly.\n\nWhat do you do?",
          correct: {
            id: "ask",
            label: "Ask the period before inverting — 5% yearly is ~20 years, not 20 months",
            next: "check",
          },
          wrongs: [
            {
              id: "assume_m",
              label: "Always assume monthly",
              explain:
                "Founders mix periods. 5% yearly inverted is decades. Ask.\n\nRevisit the period.",
            },
            {
              id: "assume_y",
              label: "Always assume yearly",
              explain:
                "SaaS often means monthly. The skill is to notice the missing unit.\n\nRevisit the period.",
            },
          ],
        },
        {
          id: "check",
          message: "2% monthly. Lifetime months?",
          correct: {
            id: "fifty",
            label: "About 50",
            next: "success",
          },
          wrongs: [
            {
              id: "2",
              label: "2 months",
              explain: "1/0.02=50.\n\nTry the check again.",
            },
            {
              id: "24",
              label: "24 months — 2%×12",
              explain: "That mixes percent and months. Inverse the rate.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Lifetime months ≈ 1 / monthly churn. Name the period.\n\nSAMPLE: 5%→~20 months, 2%→~50.",
    },
  ),
  spec(
    "nrr",
    "NRR is same-customer revenue later",
    "SAMPLE start $100k, later $130k from those accounts → 130% NRR. Expansion can exceed 100%.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: a cohort starts at $100k. A year later those same accounts are $130k.\n\nNRR?",
          correct: {
            id: "130",
            label: "130% — ending ÷ starting from the same customers",
            next: "new",
          },
          wrongs: [
            {
              id: "30",
              label: "30% — the growth chunk only",
              explain:
                "NRR is a retention index around 100, not the delta. 130/100=130%.\n\nReturn to the ratio.",
            },
            {
              id: "logo",
              label: "Logo retention: they kept 100% of customers so NRR is 100%",
              explain:
                "NRR is revenue, including expansion. Logos can stay flat while dollars grow.\n\nReturn to the ratio.",
            },
          ],
        },
        {
          id: "new",
          message:
            "The company also added $50k from brand-new customers.\n\nDoes that enter NRR?",
          correct: {
            id: "no",
            label: "No — NRR is the starting cohort only",
            next: "check",
          },
          wrongs: [
            {
              id: "yes",
              label: "Yes — all revenue growth counts",
              explain:
                "That would be a company-level growth rate. NRR holds the cohort still.\n\nRevisit new logos.",
            },
            {
              id: "half",
              label: "Count half the new revenue as expansion",
              explain:
                "New logos are not expansion of the starting cohort.\n\nRevisit new logos.",
            },
          ],
        },
        {
          id: "check",
          message:
            "Start $100k, later $80k from those accounts (churn/contraction).\n\nNRR?",
          correct: {
            id: "80",
            label: "80%",
            next: "success",
          },
          wrongs: [
            {
              id: "20",
              label: "20% churn, so NRR is 20%",
              explain:
                "20% is the drop. NRR is what remains: 80%.\n\nTry the check again.",
            },
            {
              id: "180",
              label: "180% — add start and end",
              explain:
                "Do not add the two snapshots.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. NRR = later revenue from the same customers ÷ starting revenue. Can be over 100%.\n\nSAMPLE: 130%; new logos stay out.",
    },
  ),
  spec(
    "rule-of-40",
    "Growth percent plus margin percent",
    "SAMPLE 30% growth and 15% margin → 45, later-stage smell test around 40.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 30% growth, 15% profit margin. Rule of 40?\n\nOperation?",
          correct: {
            id: "sum",
            label: "Add them: 30 + 15 = 45",
            next: "pass",
          },
          wrongs: [
            {
              id: "product",
              label: "Multiply 30% × 15%",
              explain:
                "The rule is a sum of two percents, not a product.\n\nReturn to the sum.",
            },
            {
              id: "growth_only",
              label: "Use 30 only because growth is the 40",
              explain:
                "You still add margin. High growth with negative margin can fail.\n\nReturn to the sum.",
            },
          ],
        },
        {
          id: "pass",
          message: "45 versus 40.\n\nRead?",
          correct: {
            id: "pass40",
            label: "Passes the later-stage smell test",
            next: "check",
          },
          wrongs: [
            {
              id: "fail",
              label: "Fails because neither number is 40",
              explain:
                "The test is the sum, not each term.\n\nRevisit the read.",
            },
            {
              id: "early",
              label: "Treat 40 as a seed-stage law",
              explain:
                "It is a later-stage heuristic. Still compute the sum; do not weaponize it on a pre-revenue SAMPLE.\n\nRevisit the read.",
            },
          ],
        },
        {
          id: "check",
          message: "80% growth, −50% margin. Sum?",
          correct: {
            id: "thirty",
            label: "30 — misses 40 even with hot growth",
            next: "success",
          },
          wrongs: [
            {
              id: "80",
              label: "80 — ignore the loss",
              explain:
                "Margin is in the sum. 80−50=30.\n\nTry the check again.",
            },
            {
              id: "130",
              label: "130 — add 80 and 50 as positives",
              explain:
                "The margin is negative.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Rule of 40 ≈ growth% + margin%. Later-stage smell, not a law of physics.\n\nSAMPLE: 30+15=45 pass; 80−50=30 miss.",
    },
  ),
  spec(
    "burn-multiple",
    "Burn multiple is burn over new ARR",
    "SAMPLE burn $2M, ARR +$1M → 2×. 1–2× efficient; 5×+ expensive growth.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: net burn $2M, net new ARR $1M this period.\n\nBurn multiple?",
          correct: {
            id: "two",
            label: "2 ÷ 1 = 2×",
            next: "read",
          },
          wrongs: [
            {
              id: "invert",
              label: "1 ÷ 2 = 0.5×",
              explain:
                "The taught ratio is burn / new ARR, how many dollars of burn per new ARR dollar.\n\nReturn to the ratio.",
            },
            {
              id: "arr_stock",
              label: "Divide burn by total ARR stock, not the new slice",
              explain:
                "Efficiency is about the increment: net new ARR.\n\nReturn to the ratio.",
            },
          ],
        },
        {
          id: "read",
          message: "2× versus the 1–2× efficient band, 5×+ expensive.\n\nRead?",
          correct: {
            id: "ok",
            label: "Efficient-enough SAMPLE — not the 5× red zone",
            next: "check",
          },
          wrongs: [
            {
              id: "fail",
              label: "Failed because it is not 1×",
              explain:
                "1–2× is the efficient band. 2× sits on the edge, not in the 5× junk pile.\n\nRevisit the band.",
            },
            {
              id: "five",
              label: "Call it 5× because burn is $2M",
              explain:
                "The 2 is already the multiple. Do not promote it to 5.\n\nRevisit the band.",
            },
          ],
        },
        {
          id: "check",
          message: "Burn $5M, new ARR $1M. Multiple?",
          correct: {
            id: "five",
            label: "5× — expensive growth",
            next: "success",
          },
          wrongs: [
            {
              id: "one",
              label: "1× — they added a million",
              explain:
                "The million is the denominator. 5/1=5.\n\nTry the check again.",
            },
            {
              id: "six",
              label: "6× — add burn and ARR",
              explain:
                "Do not add the two dollars. Divide.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Burn multiple = net burn ÷ net new ARR. 1–2× vs 5×+.\n\nSAMPLE: $2M/$1M=2×; $5M/$1M=5×.",
    },
  ),
  spec(
    "cac-payback",
    "Payback is CAC over monthly gross profit",
    "SAMPLE CAC $240, $40/mo gross profit → 6 months. Aim ≤12. Use profit after COGS, not list price.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: CAC $240, $40/mo gross profit after COGS.\n\nPayback months?",
          correct: {
            id: "six",
            label: "240 ÷ 40 = 6 months",
            next: "list",
          },
          wrongs: [
            {
              id: "price",
              label: "240 ÷ list price $80/mo = 3 months",
              explain:
                "List price is not gross profit. Payback uses profit after COGS.\n\nReturn to GP.",
            },
            {
              id: "year",
              label: "240 months because CAC is 240",
              explain:
                "You copied CAC as months. Divide by monthly GP.\n\nReturn to GP.",
            },
          ],
        },
        {
          id: "list",
          message: "6 months versus the ≤12 healthy SaaS smell.\n\nRead?",
          correct: {
            id: "good",
            label: "Inside a year — passes the SAMPLE bar",
            next: "check",
          },
          wrongs: [
            {
              id: "slow",
              label: "Too slow because it is not one month",
              explain:
                "The bar is about a year, not overnight.\n\nRevisit the bar.",
            },
            {
              id: "ignore",
              label: "Ignore 12; any payback is fine",
              explain:
                "Long payback is a working-capital story. The taught bar is ≤12.\n\nRevisit the bar.",
            },
          ],
        },
        {
          id: "check",
          message: "CAC $240, GP $15/mo. Months?",
          correct: {
            id: "sixteen",
            label: "16 — misses ≤12",
            next: "success",
          },
          wrongs: [
            {
              id: "12",
              label: "12 — round to the target",
              explain:
                "240/15=16. Do not round to the slogan.\n\nTry the check again.",
            },
            {
              id: "15",
              label: "15 months — copy GP",
              explain:
                "GP is the denominator, not the month count.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Payback months = CAC ÷ monthly gross profit. Aim ≤12. Not list price.\n\nSAMPLE: 240/40=6; 240/15=16.",
    },
  ),
  spec(
    "take-rate",
    "Marketplace revenue is GMV times take",
    "SAMPLE $2M GMV at 15% take → $300k. Volume is not revenue.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: $2M GMV, 15% take rate. Company revenue?\n\nMove?",
          correct: {
            id: "times",
            label: "GMV × take → 2M × 0.15",
            next: "apply",
          },
          wrongs: [
            {
              id: "gmv",
              label: "Revenue is $2M — they touched the volume",
              explain:
                "Marketplaces do not keep GMV. They keep the cut.\n\nReturn to take × GMV.",
            },
            {
              id: "minus",
              label: "$2M − 15%",
              explain:
                "Subtracting a percent without a base is not a take. Multiply.\n\nReturn to take × GMV.",
            },
          ],
        },
        {
          id: "apply",
          message: "10% of $2M is $200k. 5% more is $100k.\n\n15%?",
          correct: {
            id: "300",
            label: "$300k",
            next: "check",
          },
          wrongs: [
            {
              id: "200",
              label: "$200k — 10% only",
              explain: "15% still needs the extra 5%.\n\nRevisit the chunks.",
            },
            {
              id: "2m",
              label: "$2M",
              explain: "That is GMV again.\n\nRevisit the chunks.",
            },
          ],
        },
        {
          id: "check",
          message: "$1M GMV, 10% take.",
          correct: {
            id: "100k",
            label: "$100k revenue",
            next: "success",
          },
          wrongs: [
            {
              id: "1m",
              label: "$1M",
              explain: "10% of 1M is 100k, not the GMV.\n\nTry the check again.",
            },
            {
              id: "10k",
              label: "$10k",
              explain: "1% of $1M is $10k. 10% is $100k.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Marketplace revenue = GMV × take. Never quote GMV as if it were yours.\n\nSAMPLE: $2M at 15%=$300k.",
    },
  ),
  spec(
    "processing-fees",
    "Card fees ≈ 2.9% plus 30 cents",
    "SAMPLE $10 charge → ~$0.59. Smell test ~3% of volume; small tickets are a much higher percent.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: $10 charge. Processor is 2.9% + $0.30.\n\nFee?",
          correct: {
            id: "combo",
            label: "2.9% of $10 ≈ $0.29, plus $0.30 → about $0.59",
            next: "pct",
          },
          wrongs: [
            {
              id: "three",
              label: "3% of $10 = $0.30 and ignore the flat 30 cents",
              explain:
                "On small tickets the flat 30¢ is as big as the percent. Add both.\n\nReturn to 2.9+30.",
            },
            {
              id: "ten",
              label: "$10 fee because the charge is $10",
              explain:
                "The charge is the volume, not the fee.\n\nReturn to 2.9+30.",
            },
          ],
        },
        {
          id: "pct",
          message: "$0.59 on $10 is what percent?",
          correct: {
            id: "six",
            label: "About 6% — small tickets hurt",
            next: "check",
          },
          wrongs: [
            {
              id: "three",
              label: "Still ~3%",
              explain:
                "3% is the large-ticket smell. $0.59/$10 ≈ 6%.\n\nRevisit the percent.",
            },
            {
              id: "thirty",
              label: "30%",
              explain:
                "You treated 30 cents as 30 percent.\n\nRevisit the percent.",
            },
          ],
        },
        {
          id: "check",
          message: "$50k processed, large tickets. ~3% smell?",
          correct: {
            id: "1500",
            label: "About $1,500",
            next: "success",
          },
          wrongs: [
            {
              id: "50k",
              label: "$50k — the volume",
              explain: "Fees are a slice of volume, ~3% → $1.5k.\n\nTry the check again.",
            },
            {
              id: "150",
              label: "$150 — 0.3%",
              explain: "3% of 50k is 1,500, not 150.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. 2.9%+$0.30; small tickets are a higher effective percent; ~3% on large volume.\n\nSAMPLE: $10→~$0.59; $50k→~$1.5k.",
    },
  ),
  spec(
    "fully-loaded",
    "Fully loaded is salary times 1.3",
    "SAMPLE $120k salary → about $156k loaded. Benefits and tax are not free.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: $120k salary. Planning cost for the seat?\n\nDefault load?",
          correct: {
            id: "thirteen",
            label: "×1.3 for benefits and tax",
            next: "apply",
          },
          wrongs: [
            {
              id: "salary",
              label: "Use $120k — offer letter is the cost",
              explain:
                "Loaded cost is why finance multiplies. Default ×1.3.\n\nReturn to 1.3.",
            },
            {
              id: "double",
              label: "×2 because fully loaded sounds like double",
              explain:
                "2× is a heavy contractor/overhead story, not the default salary load.\n\nReturn to 1.3.",
            },
          ],
        },
        {
          id: "apply",
          message: "120 × 1.3 = 120 + 36.\n\nLoaded?",
          correct: {
            id: "156",
            label: "About $156k",
            next: "check",
          },
          wrongs: [
            {
              id: "123",
              label: "$123k — added 3%",
              explain: "1.3 is +30%, not +3%.\n\nRevisit 1.3.",
            },
            {
              id: "1200",
              label: "$1.2M — extra zero",
              explain: "120×1.3=156, in thousands: $156k.\n\nRevisit 1.3.",
            },
          ],
        },
        {
          id: "check",
          message: "$100k salary, same 1.3.",
          correct: {
            id: "130",
            label: "$130k loaded",
            next: "success",
          },
          wrongs: [
            {
              id: "100",
              label: "$100k",
              explain: "You skipped the load.\n\nTry the check again.",
            },
            {
              id: "103",
              label: "$103k",
              explain: "+3% is not +30%.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Default loaded headcount ≈ salary × 1.3.\n\nSAMPLE: $120k→$156k, $100k→$130k.",
    },
  ),
  spec(
    "dilution",
    "Percent sold is cash over post-money",
    "SAMPLE pre $8M, raise $2M → post $10M, sold 20%. Listen for pre vs post.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: pre-money $8M, raise $2M. What percent did you sell?\n\nWhich denominator?",
          correct: {
            id: "post",
            label: "Cash ÷ post-money; post = pre + cash → $10M, 20%",
            next: "listen",
          },
          wrongs: [
            {
              id: "pre",
              label: "$2M / $8M pre = 25%",
              explain:
                "That uses the wrong denominator. Investor % is cash/post, not cash/pre.\n\nReturn to post.",
            },
            {
              id: "two",
              label: "2% because they put in $2M",
              explain:
                "Dollars are not percents. 2/10=20%.\n\nReturn to post.",
            },
          ],
        },
        {
          id: "listen",
          message:
            "A term sheet says '$8M' without pre or post.\n\nWhat do you do?",
          correct: {
            id: "ask",
            label: "Ask pre vs post — it changes the sold percent",
            next: "check",
          },
          wrongs: [
            {
              id: "assume_pre",
              label: "Always assume pre",
              explain:
                "Ambiguity is the trick. The math changes if $8M is already post.\n\nRevisit the question.",
            },
            {
              id: "assume_post",
              label: "Always assume post",
              explain:
                "Same problem. Force the word pre or post.\n\nRevisit the question.",
            },
          ],
        },
        {
          id: "check",
          message: "Pre $8M, raise $2M. If someone used pre as the base they said 25%. True sold?",
          correct: {
            id: "twenty",
            label: "20% of post ($10M)",
            next: "success",
          },
          wrongs: [
            {
              id: "25",
              label: "25% is close enough",
              explain:
                "25 vs 20 is a real extra fifth of the company in the story. Use post.\n\nTry the check again.",
            },
            {
              id: "80",
              label: "80% — founders keep 8 of 10",
              explain:
                "Founders remaining is 80%; sold is 20%. The question was percent sold.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Post-money = pre + cash. Percent sold ≈ cash / post. Ask pre vs post.\n\nSAMPLE: $2M on $10M post = 20%.",
    },
  ),
  spec(
    "tam-fermi",
    "Fermi TAM is customers times yearly price",
    "SAMPLE 200k dentists × $600/year → $120M TAM; 1,000 customers is $600k ARR. Watch a 10× error in one factor.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 200k dentists, $50/mo tool. Yearly TAM stack?\n\nFirst?",
          correct: {
            id: "year",
            label: "Price yearly: $50×12=$600, then × 200k dentists",
            next: "tam",
          },
          wrongs: [
            {
              id: "monthly_tam",
              label: "200k × $50 and call that TAM",
              explain:
                "That is a monthly ceiling. TAM talk is usually yearly: ×12 first.\n\nReturn to yearly.",
            },
            {
              id: "pop",
              label: "Use US population 330M as the customer count",
              explain:
                "Fermi TAM uses the reachable buyer, not census.\n\nReturn to yearly.",
            },
          ],
        },
        {
          id: "tam",
          message: "200,000 × $600. 200k×600=120,000k.\n\nTAM?",
          correct: {
            id: "120m",
            label: "$120M",
            next: "slice",
          },
          wrongs: [
            {
              id: "12m",
              label: "$12M — dropped a zero",
              explain:
                "200k×600: 2×6=12, then five zeros from 200,000 and two from 600 wait — 200,000×600=120,000,000.\n\nRevisit the zeros.",
            },
            {
              id: "1_2b",
              label: "$1.2B — extra zero",
              explain:
                "That would be 2M dentists or $6,000/year.\n\nRevisit the zeros.",
            },
          ],
        },
        {
          id: "slice",
          message: "You might get 1,000 of those dentists. ARR?",
          correct: {
            id: "600k",
            label: "1,000 × $600 = $600k ARR, not $120M",
            next: "success",
          },
          wrongs: [
            {
              id: "tam_as_arr",
              label: "Quote $120M as if it were your ARR",
              explain:
                "TAM is the pond. Your slice is customers × price.\n\nTry the slice again.",
            },
            {
              id: "50k",
              label: "$50k — 1,000 × $50 and forget yearly",
              explain:
                "$50 is monthly. Yearly is $600 × 1,000 = $600k.\n\nTry the slice again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Stack customers × yearly price, then take a believable slice. Watch 10× zeros.\n\nSAMPLE: 200k×$600=$120M TAM; 1,000 customers=$600k ARR.",
    },
  ),
  spec(
    "concurrency",
    "Only 10–20% are on at once",
    "SAMPLE 100 logos → about 10–20 concurrent. Size infra for the slice, not the roster.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 100 paying logos. Someone sizes GPUs as if all 100 run now.\n\nFirst?",
          correct: {
            id: "slice",
            label: "Concurrent ≈ 10–20% → about 10–20 jobs, not 100",
            next: "busy",
          },
          wrongs: [
            {
              id: "all",
              label: "100 logos = 100 simultaneous jobs",
              explain:
                "That is how you overbuy. Most logos are idle. Use 10–20%.\n\nReturn to concurrency.",
            },
            {
              id: "one",
              label: "Assume 1% — one person on",
              explain:
                "1% is too quiet for this heuristic. Band is 10–20%.\n\nReturn to concurrency.",
            },
          ],
        },
        {
          id: "busy",
          message: "They say it will be a busy hour. Which end of the band?",
          correct: {
            id: "twenty",
            label: "20% of 100 → 20 concurrent",
            next: "check",
          },
          wrongs: [
            {
              id: "ten",
              label: "Still 10 — the band does not move",
              explain:
                "Quiet ≈ 10%, busy ≈ 20%. Busy hour uses the top of the band.\n\nRevisit the band.",
            },
            {
              id: "fifty",
              label: "50% because busy means half",
              explain:
                "Busy in this shortcut is 20%, not 50%.\n\nRevisit the band.",
            },
          ],
        },
        {
          id: "check",
          message: "1,000 logos, quiet day. Concurrent smell?",
          correct: {
            id: "hundred",
            label: "About 100 (10%)",
            next: "success",
          },
          wrongs: [
            {
              id: "thousand",
              label: "1,000 — every logo is on",
              explain: "Quiet day is the low end: 10%.\n\nTry the check again.",
            },
            {
              id: "200",
              label: "200 — always use 20%",
              explain:
                "20% is the busy end. Quiet is 10% → 100.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Concurrent ≈ 10–20% of logos. Size for the slice.\n\nSAMPLE: 100 logos → 10 quiet / 20 busy.",
    },
  ),
  spec(
    "capacity-split",
    "Boxes is users divided by per-box capacity",
    "SAMPLE 1,000 users / 20 per server = 50 servers. Cancel zeros first.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 1,000 simultaneous users, 20 per server. How many boxes?\n\nMove?",
          correct: {
            id: "div",
            label: "Users ÷ capacity → 1,000 / 20 = 50",
            next: "zeros",
          },
          wrongs: [
            {
              id: "times",
              label: "1,000 × 20 = 20,000 servers",
              explain:
                "That explodes the fleet. Divide users by how many each box holds.\n\nReturn to divide.",
            },
            {
              id: "twenty",
              label: "20 servers because capacity is 20",
              explain:
                "You copied capacity as the fleet size. 1,000/20=50.\n\nReturn to divide.",
            },
          ],
        },
        {
          id: "zeros",
          message: "1,000 / 20. Fast cancel?",
          correct: {
            id: "cancel",
            label: "1,000 / 20 = 50",
            next: "check",
          },
          wrongs: [
            {
              id: "10",
              label: "10 — cancelled too far",
              explain: "1,000/20 is 50, not 10.\n\nRevisit the cancel.",
            },
            {
              id: "2000",
              label: "2,000 — multiplied after cancelling",
              explain: "Stay on divide.\n\nRevisit the cancel.",
            },
          ],
        },
        {
          id: "check",
          message: "400 users, 20 per box. Fleet?",
          correct: {
            id: "twenty_boxes",
            label: "20 servers",
            next: "success",
          },
          wrongs: [
            {
              id: "400",
              label: "400 servers",
              explain: "400/20=20.\n\nTry the check again.",
            },
            {
              id: "8",
              label: "8 servers",
              explain: "That would be 400/50. Capacity was 20.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Boxes = users ÷ per-box capacity. Cancel zeros.\n\nSAMPLE: 1,000/20=50.",
    },
  ),
  spec(
    "box-contribution",
    "Revenue per box versus cost per box",
    "SAMPLE $30 × 20 users = $600 vs $720/mo box → losing $120 per server.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: $30/mo price, 20 users on one GPU that costs $720/mo.\n\nFirst number?",
          correct: {
            id: "rev",
            label: "Revenue on the box = $30 × 20 = $600",
            next: "compare",
          },
          wrongs: [
            {
              id: "cost_only",
              label: "Just quote $720 — that is the cost",
              explain:
                "You need revenue on that box before you judge. Price × users-on-the-box.\n\nReturn to $600.",
            },
            {
              id: "720_div_30",
              label: "720 ÷ 30 = 24 users needed — stop there",
              explain:
                "That is break-even users. This prompt asks whether the current 20 cover the box.\n\nReturn to $600.",
            },
          ],
        },
        {
          id: "compare",
          message: "$600 revenue, $720 cost. Smell?",
          correct: {
            id: "lose",
            label: "Losing $120 per server",
            next: "check",
          },
          wrongs: [
            {
              id: "win",
              label: "Winning because $720 is a round infra number",
              explain:
                "$600 < $720. The box loses money.\n\nRevisit the gap.",
            },
            {
              id: "1200",
              label: "Gap is $1,200",
              explain: "720 − 600 = 120, not 1,200.\n\nRevisit the gap.",
            },
          ],
        },
        {
          id: "check",
          message: "$40 × 20 users vs $720 box. Contribution?",
          correct: {
            id: "eighty",
            label: "$800 − $720 = $80 positive",
            next: "success",
          },
          wrongs: [
            {
              id: "lose40",
              label: "Still losing — infra always loses",
              explain: "$800 covers $720. +$80.\n\nTry the check again.",
            },
            {
              id: "800_cost",
              label: "Cost is $800",
              explain: "Cost was $720. Revenue is $800.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Price × users-on-the-box, then compare to monthly box cost.\n\nSAMPLE: $30×20=$600 vs $720 → −$120.",
    },
  ),
  spec(
    "utilization",
    "Plan at about 70% of max",
    "SAMPLE 10 jobs/sec advertised → plan on 7. Do not size as if you run at 100%.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: a box claims 10 jobs/sec. What do you plan for?\n\nShortcut?",
          correct: {
            id: "seventy",
            label: "About 70% → 7 jobs/sec safe",
            next: "why",
          },
          wrongs: [
            {
              id: "ten",
              label: "10 — they published 10",
              explain:
                "Published max is a ceiling. Sustained load uses ~70%.\n\nReturn to 70%.",
            },
            {
              id: "half",
              label: "5 — always half",
              explain: "The rule is ~70%, not 50%. 0.7×10=7.\n\nReturn to 70%.",
            },
          ],
        },
        {
          id: "why",
          message: "Why not plan at 100%?",
          correct: {
            id: "headroom",
            label: "Spikes and degradation — 100% is not a plan",
            next: "check",
          },
          wrongs: [
            {
              id: "vendor",
              label: "Vendors lie by 30%",
              explain:
                "Maybe, but the move is operational: leave headroom.\n\nRevisit why.",
            },
            {
              id: "always70",
              label: "Because 70 is a lucky number",
              explain:
                "It is a load-planning heuristic, not superstition.\n\nRevisit why.",
            },
          ],
        },
        {
          id: "check",
          message: "100 seats advertised. Filled plan?",
          correct: {
            id: "70seats",
            label: "70 filled",
            next: "success",
          },
          wrongs: [
            {
              id: "100seats",
              label: "100 filled — sold out",
              explain: "0.7×100=70.\n\nTry the check again.",
            },
            {
              id: "30seats",
              label: "30 — that is the 30% pad",
              explain:
                "You reserved 30% empty, so filled is 70, not 30.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Safe load ≈ 0.7 × advertised max.\n\nSAMPLE: 10/sec → 7; 100 seats → 70.",
    },
  ),
  spec(
    "estimate-pad",
    "Always add 30% to a cost guess",
    "SAMPLE $2,000 guess → ×1.3 → $2,600. Undercount pad, not salary benefits.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: someone quotes a $2,000 infra guess.\n\nWhat do you do?",
          correct: {
            id: "pad",
            label: "×1.3 → about $2,600",
            next: "not_salary",
          },
          wrongs: [
            {
              id: "face",
              label: "Keep $2,000 — they already estimated",
              explain:
                "Estimates run short. Pad ×1.3.\n\nReturn to the pad.",
            },
            {
              id: "double",
              label: "Double it to $4,000",
              explain:
                "That is a different panic. The operator pad is 30%.\n\nReturn to the pad.",
            },
          ],
        },
        {
          id: "not_salary",
          message: "Is this the same as salary ×1.3?",
          correct: {
            id: "story",
            label: "Same multiple, different story — this is undercount, not benefits",
            next: "check",
          },
          wrongs: [
            {
              id: "same",
              label: "Yes — always ×1.3 means benefits",
              explain:
                "Fully loaded headcount is benefits. This pad is 'the estimate was low.'\n\nRevisit the story.",
            },
            {
              id: "13pct",
              label: "Add 13%, not 30%",
              explain: "1.3 is thirty percent, not thirteen.\n\nRevisit the story.",
            },
          ],
        },
        {
          id: "check",
          message: "$5,000 guess padded?",
          correct: {
            id: "65",
            label: "$6,500",
            next: "success",
          },
          wrongs: [
            {
              id: "5300",
              label: "$5,300 — added 300",
              explain: "×1.3 is 30% of 5,000 = 1,500 → 6,500.\n\nTry the check again.",
            },
            {
              id: "15000",
              label: "$15,000 — ×3",
              explain: "×1.3, not ×3.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Cost guess ×1.3. Not the salary-benefits sentence.\n\nSAMPLE: $2,000 → $2,600; $5,000 → $6,500.",
    },
  ),
  spec(
    "funnel-bands",
    "SaaS funnel bands, then compress",
    "SAMPLE 10,000 visits: ~20% signup then ~5% paid → about 100 paying.",
    I,
    {
      layers: [
        {
          id: "start",
          message:
            "SAMPLE: 10,000 visits, no analytics. Paying users in the ballpark?\n\nFirst band?",
          correct: {
            id: "signup",
            label: "Visit→signup ~10–30%, mid 20% → ~2,000 signups",
            next: "paid",
          },
          wrongs: [
            {
              id: "all_pay",
              label: "10,000 paying — traffic is customers",
              explain:
                "Funnels compress. Most visits never pay.\n\nReturn to signup band.",
            },
            {
              id: "one_pct",
              label: "1% signup because 1% is a round percent",
              explain:
                "Visit→signup typically 10–30%, not 1%.\n\nReturn to signup band.",
            },
          ],
        },
        {
          id: "paid",
          message: "~2,000 signups. Signup→paid band, mid smell?",
          correct: {
            id: "five",
            label: "~5% of 2,000 → about 100 paid",
            next: "check",
          },
          wrongs: [
            {
              id: "twenty_again",
              label: "Another 20% → 400 paid",
              explain:
                "Paid conversion is tighter: about 2–10%, mid 5%.\n\nRevisit paid.",
            },
            {
              id: "2000_paid",
              label: "2,000 paid — signups all convert",
              explain: "Signup is not paid.\n\nRevisit paid.",
            },
          ],
        },
        {
          id: "check",
          message: "8,000 visits, conservative 10% then 10%. Paid?",
          correct: {
            id: "eighty",
            label: "80 paying",
            next: "success",
          },
          wrongs: [
            {
              id: "800",
              label: "800 — only the first 10%",
              explain:
                "You stopped at signups. 800 signups × 10% paid = 80.\n\nTry the check again.",
            },
            {
              id: "8",
              label: "8 — two extra zeros dropped",
              explain: "8,000×0.1×0.1=80.\n\nTry the check again.",
            },
          ],
        },
      ],
      success:
        "Session complete. Visit→signup 10–30%, signup→paid 2–10%. Mid: 20% then 5%.\n\nSAMPLE: 10k visits → ~100 paid.",
    },
  ),
];

