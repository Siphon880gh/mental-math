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

## Check

- 10% monthly → ~10 months
- 2.5% monthly → ~40 months
- 100 customers, 8 left → 8% churn
