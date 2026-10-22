// Round generator for the Runway check game. Pure functions, no DOM.
// Every round: net burn = spend − revenue, runway = cash ÷ net burn, start the raise at runway − 6.
import { between, kilo, options, pick } from "./steps.js";

export const RAISE_MONTHS = 6;
const NET_BURNS = [10, 15, 20, 25, 30, 40, 50, 60];
const plural = (n) => (n === 1 ? "month" : "months");
const raiseText = (m) => (m === 0 ? "Now" : `In ${m} ${plural(m)}`);
const oneDecimal = (n) => Math.round(n * 10) / 10;

export function runwayRound(index, rand = Math.random) {
  const net = pick(NET_BURNS, rand);
  const months = between(RAISE_MONTHS, 24, rand);
  const cash = net * months;
  const revenue = 5 * between(1, Math.max(1, Math.floor(net / 5)), rand);
  const spend = net + revenue;
  const burnStep = {
    label: "Net burn a month",
    answer: net,
    done: `Net burn ${kilo(net)}`,
    options: options(
      [
        { value: net, text: `${kilo(spend)} − ${kilo(revenue)} = ${kilo(net)}`, ok: true },
        { value: spend, text: `${kilo(spend)}, the spend`, why: `Revenue offsets spend. Net burn is ${kilo(spend)} − ${kilo(revenue)} = ${kilo(net)}.` },
        { value: spend + revenue, text: `${kilo(spend)} + ${kilo(revenue)} = ${kilo(spend + revenue)}`, why: `Revenue comes in, so subtract it: ${kilo(spend)} − ${kilo(revenue)} = ${kilo(net)}.` },
      ],
      rand,
    ),
  };
  const gross = oneDecimal(cash / spend);
  const runwayStep = {
    label: "Months of runway",
    answer: months,
    done: `${months} ${plural(months)}`,
    options: options(
      [
        { value: months, text: `${kilo(cash)} ÷ ${kilo(net)} = ${months}`, ok: true },
        { value: gross, text: `${kilo(cash)} ÷ ${kilo(spend)} ≈ ${gross}`, why: `That divides by spend. Runway uses net burn: ${kilo(cash)} ÷ ${kilo(net)} = ${months}.` },
        { value: cash - net, text: `${kilo(cash)} − ${kilo(net)} = ${cash - net}`, why: `Subtracting gives the cash left after one month. Divide: ${kilo(cash)} ÷ ${kilo(net)} = ${months}.` },
      ],
      rand,
    ),
  };
  const start = months - RAISE_MONTHS;
  const finals = options(
    [
      { value: start, text: raiseText(start), ok: true },
      { value: months, text: raiseText(months), why: `That is when the cash hits zero. A raise takes about ${RAISE_MONTHS} months, so start at ${months} − ${RAISE_MONTHS} = ${start}.` },
      { value: months - 3, text: raiseText(months - 3), why: `Three months is too short for a raise. Start at runway − ${RAISE_MONTHS} = ${start}.` },
    ],
    rand,
  );
  return {
    cash,
    spend,
    revenue,
    net,
    months,
    start,
    answer: start,
    prompt: `${kilo(cash)} in the bank`,
    info: `Spend ${kilo(spend)} a month · revenue ${kilo(revenue)} a month`,
    steps: [burnStep, runwayStep],
    finalLabel: "When do you start the raise?",
    finals,
    winText: `Net burn ${kilo(net)} → ${months} ${plural(months)} of runway → start the raise ${start === 0 ? "now" : `in ${start} ${plural(start)}`}.`,
  };
}
