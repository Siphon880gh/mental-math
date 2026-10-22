// Round generator for the ARR read game. Pure functions, no DOM.
// Every round: MRR = seats × price (one-time fees out), ARR = MRR × 12, then a percent of ARR.
import { between, money, options, pick } from "./steps.js";

const PRICES = [15, 20, 25, 30, 40, 45, 50, 60, 75, 80];
const FEES = [500, 1000, 1500, 2000, 2500, 5000];
const PERCENTS = [5, 10, 15, 20, 25, 30];
const USES = ["sales tools", "the support team", "infrastructure", "a marketing test", "the bonus pool"];

export function arrRound(index, rand = Math.random) {
  const seats = 10 * between(2, 40, rand);
  const price = pick(PRICES, rand);
  const fee = pick(FEES, rand);
  const pct = PERCENTS[index % PERCENTS.length];
  const use = pick(USES, rand);
  const mrr = seats * price;
  const arr = mrr * 12;
  const slice = (arr * pct) / 100;
  const mrrStep = {
    label: "MRR",
    answer: mrr,
    done: `MRR ${money(mrr)}`,
    options: options(
      [
        { value: mrr, text: `${seats} × ${money(price)} = ${money(mrr)}`, ok: true },
        { value: mrr + fee, text: `${money(mrr)} + ${money(fee)} fee = ${money(mrr + fee)}`, why: `The ${money(fee)} setup fee happens once. MRR is only what repeats: ${money(mrr)}.` },
        { value: arr, text: `${money(mrr)} × 12 = ${money(arr)}`, why: `That is already the yearly figure. MRR is the month: ${money(mrr)}.` },
      ],
      rand,
    ),
  };
  const arrStep = {
    label: "ARR",
    answer: arr,
    done: `ARR ${money(arr)}`,
    options: options(
      [
        { value: arr, text: `${money(mrr)} × 12 = ${money(arr)}`, ok: true },
        { value: mrr * 10, text: `${money(mrr)} × 10 = ${money(mrr * 10)}`, why: `A year is 12 months: ×10 is ${money(mrr * 10)}, then add ×2 (${money(mrr * 2)}) → ${money(arr)}.` },
        { value: (mrr + fee) * 12, text: `(${money(mrr)} + ${money(fee)}) × 12 = ${money((mrr + fee) * 12)}`, why: `Twelve copies of a one-time fee is the classic inflated ARR. ${money(mrr)} × 12 = ${money(arr)}.` },
      ],
      rand,
    ),
  };
  const finals = options(
    [
      { value: slice, text: money(slice), ok: true },
      { value: (mrr * pct) / 100, text: money((mrr * pct) / 100), why: `That is ${pct}% of MRR. The budget is ${pct}% of ARR: ${money(slice)}.` },
      { value: slice * 10, text: money(slice * 10), why: `One place off: 10% of ${money(arr)} is ${money(arr / 10)}, so ${pct}% is ${money(slice)}.` },
    ],
    rand,
  );
  return {
    seats,
    price,
    fee,
    pct,
    mrr,
    arr,
    slice,
    answer: slice,
    prompt: `${seats} seats at ${money(price)}/mo`,
    info: `Plus a ${money(fee)} one-time setup fee this month. Budget ${pct}% of ARR for ${use}.`,
    steps: [mrrStep, arrStep],
    finalLabel: `${pct}% of ARR`,
    finals,
    winText: `MRR ${money(mrr)} → ARR ${money(arr)} → ${pct}% = ${money(slice)}.`,
  };
}
