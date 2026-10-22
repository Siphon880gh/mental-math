# Churn and lifetime months

Logo churn:

> churn ≈ customers lost ÷ customers at start

Retention ≈ 1 − churn.

## Lifetime from monthly churn

A usable mental estimate:

> expected months ≈ 1 / monthly churn

5% monthly churn → 1 / 0.05 = **20 months**.

This matches the original LTV note (lifetime ≈ 1/churn). It assumes a steady churn and ignores expansion.

## Annual vs monthly

5% **annual** churn is healthy SaaS. 5% **monthly** is a leak (about 46% gone in a year if it compounds: you do not need the exact (1−0.05)^12 — smell “almost half”).

Quick annualization: monthly × 12 **overstates** true compounded loss but is fine as a red flag: 5% × 12 = 60% “would be terrible.”

## Conversation use

“We churn 2% a month” → lifetime ~ **50 months**. LTV ≈ ARPU × 50 before you get fancy with gross margin.

## Worked example

A base of 1,400 customers at the start of the month loses 42 by the end.

1. Churn: 42 ÷ 1,400 = **3%** (42 is 3 × 14).
2. Lifetime: 1 ÷ 0.03 ≈ **33 months**.
3. LTV smell: at $60/mo gross profit, 60 × 33 ≈ **$2,000**.

## Why it works

If a steady fraction leaves every month, the average customer lasts about one over that fraction. A 1-in-20 chance each month means about 20 months of waiting, on average. It is an average of a geometric decay, so it is best when churn is roughly stable month to month.

## Where it goes wrong

- Wrong denominator: divide by customers at the **start** of the month. Folding in this month's signups (42 ÷ 1,600 ≈ 2.6%) makes churn look better than it is.
- Mixing periods: 3% **yearly** churn inverts to about 33 *years*. Say "monthly" out loud before you invert.
- Treating logo life as revenue life: expansion stretches revenue past logo lifetime (see NRR), and contraction shortens it.

## Same idea, new numbers

- 10% monthly → ~10 months
- 2.5% monthly → ~40 months
- 100 customers, 8 left → 8% churn
