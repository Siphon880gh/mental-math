import type { ThinkingMode } from "./cases";

/** One tip per shipped thinkingMode. Names a real route. */
export const THINKING_MODE_TIPS: Record<ThinkingMode, string> = {
  infra_chain:
    "Hourly ×720 then ÷ price. Drill /drills/conversions or walk /coach/hour-month.",
  break_even:
    "Users = cost ÷ price. Reduce both sides on /drills/break-even.",
  conversion_funnel:
    "1% is two places left, then scale. /drills/percents or /coach/percent-shift.",
  markup_read: "Price ÷ cost. Track A guide /guides/markup.",
  smell_test:
    "Ceiling = price × possible customers. /guides/cfo-feasibility on Track B.",
  ltv_cac: "LTV ≈ price × months; smell ~3× CAC. /drills/cfo-unit-econ.",
  runway: "Cash ÷ monthly burn. /drills/cfo-runway.",
  growth_claim:
    "20%/mo ≈ 9× in a year, not 50×. /coach/cfo-growth names the table.",
  rule_of_40: "Growth % + margin %. /guides/rule-of-40.",
  burn_multiple: "Burn ÷ net new ARR. /guides/burn-multiple.",
  payback: "CAC ÷ monthly gross profit, aim ≤12. /guides/cac-payback.",
  take_rate: "Revenue is GMV × take. /guides/take-rate.",
  fees: "About 2.9% + 30 cents. /guides/processing-fees.",
  loaded_cost: "Salary × 1.3. /guides/fully-loaded.",
  dilution: "Cash ÷ post-money. Ask pre vs post. /coach/dilution.",
  tam_fermi: "Customers × yearly price, then a slice. /guides/tam-fermi.",
  nrr_read: "Same-customer revenue later. /guides/nrr.",
};
