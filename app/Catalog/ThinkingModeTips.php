<?php

declare(strict_types=1);

namespace Reflex\Catalog;

final class ThinkingModeTips
{
    public const ALL = [
        'infra_chain' => 'Hourly ×720 then ÷ price. Drill /drills/conversions or walk /coach/hour-month.',
        'break_even' => 'Users = cost ÷ price. Reduce both sides on /drills/break-even.',
        'conversion_funnel' => '1% is two places left, then scale. /drills/percents or /coach/percent-shift.',
        'markup_read' => 'Price ÷ cost. Track A guide /guides/markup.',
        'smell_test' => 'Ceiling = price × possible customers. /guides/cfo-feasibility on Track B.',
        'ltv_cac' => 'LTV ≈ price × months; smell ~3× CAC. /drills/cfo-unit-econ.',
        'runway' => 'Cash ÷ monthly burn. /drills/cfo-runway.',
        'growth_claim' => '20%/mo ≈ 9× in a year, not 50×. /coach/cfo-growth names the table.',
        'rule_of_40' => 'Growth % + margin %. /guides/rule-of-40.',
        'burn_multiple' => 'Burn ÷ net new ARR. /guides/burn-multiple.',
        'payback' => 'CAC ÷ monthly gross profit, aim ≤12. /guides/cac-payback.',
        'take_rate' => 'Revenue is GMV × take. /guides/take-rate.',
        'fees' => 'About 2.9% + 30 cents. /guides/processing-fees.',
        'loaded_cost' => 'Salary × 1.3. /guides/fully-loaded.',
        'dilution' => 'Cash ÷ post-money. Ask pre vs post. /coach/dilution.',
        'tam_fermi' => 'Customers × yearly price, then a slice. /guides/tam-fermi.',
        'nrr_read' => 'Same-customer revenue later. /guides/nrr.',
        'arr_read' => 'MRR × 12 is ARR; ARR ÷ 12 is MRR. /guides/mrr-arr.',
        'churn_life' => 'Lifetime months ≈ 1 ÷ monthly churn, and back again. /guides/churn.',
        'fixed_multiplier' => '×19 is ×20 minus one copy; ×12 is ×10 plus ×2. /guides/fixed-multipliers.',
        'near_base' => 'Distances from 100, cross, multiply the gaps. /coach/near-base.',
        'square_shape' => '(a + b)² = a² + 2ab + b². /guides/square-identities.',
        'divisibility_split' => 'Trim or digit-sum before you divide. /guides/divisibility.',
        'partial_products' => 'Split by place, add the big piece first. /guides/area-grid.',
        'complement_count' => 'Count × average for an even run. /guides/complements.',
        'decimal_shift' => 'Multiply digits, then park the decimal places. /guides/magnitude.',
        'division_rewrite' => 'Overshoot to a round multiple, then back off. /coach/easy-division.',
        'digit_check' => 'Digit roots add for sums. A mismatch is a hard fail. /guides/cast-nines.',
        'digit_rule' => 'Trachtenberg digit rule: pad a zero, go right to left, and write one digit per step from the digit and its right-hand neighbor. Carry the rest. /guides/fixed-multipliers.',
    ];
}
