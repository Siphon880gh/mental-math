/** One-line index copy for families that have no docs-more file. */
export const INLINE_GUIDE_SUMMARIES: Record<string, string> = {
  anchors: "Memorize a few products, then scale zeros.",
  magnitude: "Do not recompute the base fact — move zeros.",
  "percent-shift": "1% is two places left; 10% is one place.",
  "percent-reversible": "A% of B is B% of A. Pick the easier half.",
  "percent-tens": "Drop a zero from each side, then multiply.",
  "percent-chunks": "Build percents from 50 / 25 / 10 / 5.",
  "percent-tip": "Twenty percent is double, then one place left.",
  "div-by-5": "Double, then shift one place left.",
  "hour-month": "Hourly to monthly is ×720.",
  "month-day": "Monthly to daily is ÷30.",
  "month-year": "Monthly to yearly is ×12.",
  "break-even": "Users needed is cost ÷ price. Reduce both sides.",
  markup: "Markup is price ÷ cost. Hear the extra as a multiple.",
  "stacked-founder": "Chain Track A shortcuts into one planning sentence.",
  "cfo-feasibility": "Ceiling is price × possible customers vs cost scale.",
  "cfo-unit-econ": "LTV should be about 3× CAC.",
  "cfo-runway": "Runway is cash ÷ monthly burn.",
  "cfo-growth": "20% a month is not a 50× year.",
  pareto: "20% of the count carries about 80% of load or revenue.",
  "revenue-triangle": "Revenue is price × users. Invert any side.",
  concurrency: "Only about 10–20% of logos are on at once.",
  "capacity-split": "Boxes = users ÷ how many each box holds.",
  "box-contribution": "Price × users-on-the-box vs the monthly box cost.",
  utilization: "Plan at about 70% of advertised max.",
  "estimate-pad": "Pad a cost guess ×1.3. Not the same story as salary load.",
  "funnel-bands": "Visit→signup 10–30%, signup→paid 2–10%. Compress.",
};

/** Short original lessons for families that have no docs-more file. */
export const INLINE_GUIDE_BODIES: Record<string, string> = {
  anchors: `# Number anchors

Memorize a few products until they are chords, not calculations: 5×4=20, 25×4=100, 75×4=300, 8×8=64.

Then scale zeros. 50×40 is the 5×4 chord with two extra zeros → 2,000.

A “hard” table fact is usually an easy one in disguise: 7×8 is 7×4=28, doubled. Keep squares through 25 and the powers of two (2…1024) as chords too.

## Same idea, new numbers
- 25×8 → 200
- 75×12 → 900
- 6×7 → 5×7+7 = 42
`,
  magnitude: `# Magnitude scaling

Do not recompute the base fact. ×10 appends a zero. ×100 appends two.

7×8=56, so 70×8=560 and 700×8=5,600.

Decimals are the same move: ignore the points, multiply the digits, then park as many places as you counted.

1.7 × 2.4 → 17×24=408, two places → **4.08**.

## Same idea, new numbers
- 9×6 → 54, so 90×6=540
- 12×3 → 36, so 120×3=360
- 0.3 × 1.2 → 36, two places → 0.36
`,
  "percent-shift": `# One percent is two places left

1% of a number is that number with the decimal moved two places left. 10% is one place.

1% of 2,000 is 20. 7% of 108: 7×108=756, two places left → 7.56.

## Same idea, new numbers
- 10% of 470 = 47
- 1% of 8,500 = 85
`,
  "percent-reversible": `# Percents swap

A% of B is the same as B% of A. Pick the easier half.

14% of 50 is 50% of 14 → 7.

## Same idea, new numbers
- 8% of 25 = 25% of 8 = 2
- 16% of 50 = 8
`,
  "percent-tens": `# Tens of percent of tens

Drop a zero from each side, multiply, and you already moved two decimal places.

30% of 40 → 3×4=12.

## Same idea, new numbers
- 80% of 70 = 56
- 20% of 90 = 18
`,
  "percent-chunks": `# Build percents from 50 / 25 / 10 / 5

Half, quarter, tenth, half of a tenth. Add the chunks you need.

35% of 2,000 = three tenths (600) plus 5% (100) → 700.

12.5% is an eighth: ÷8. 33⅓% is ÷3. 17% is 10% + 5% + 2%.

## Same idea, new numbers
- 15% of 800 = 80+40 = 120
- 75% of 400 = 300
- 12.5% of 80 = 10
`,
  "percent-tip": `# Twenty percent is double, then one place left

×2, then move the decimal one place left (that is ÷10).

20% of $42.30 → 84.60 → $8.46.

## Same idea, new numbers
- 20% of 80 = 16
- 20% of 15 = 3
`,
  "div-by-5": `# Divide by five: double, then shift

×2, then one place left.

1,322 ÷ 5 → 2,644 → 264.4.

## Same idea, new numbers
- 80 ÷ 5 = 16
- 45 ÷ 5 = 9
`,
  "hour-month": `# Hourly to monthly is ×720

24×30≈720. Hourly cost × 720 ≈ monthly cost.

$1/hr → $720/mo.

## Same idea, new numbers
- $2/hr → $1,440/mo
- $0.50/hr → $360/mo
`,
  "month-day": `# Monthly to daily is ÷30

A month is about 30 days. Reverse: daily × 30 ≈ monthly.

$900/mo → $30/day.

## Same idea, new numbers
- $300/mo → $10/day
- $20/day → $600/mo
`,
  "month-year": `# Monthly to yearly is ×12

Twelve months. Yearly to monthly is ÷12.

$30/mo → $360/year.

Multiply by 10 for $300/year. Then multiply by 2 for $60/year. Sum them for $360/year.

## Same idea, new numbers
- $100/mo → $1,200/year
- $2,400/year → $200/mo
`,
  "break-even": `# Users needed is cost ÷ price

Reduce both sides by tens first. 3,000÷50 → 300÷5 → 60 users.

## Same idea, new numbers
- Cost 1,000, price 50 → 20
- Cost 2,000, price 25 → 80
`,
  markup: `# Markup is price ÷ cost

How many times cost is the price? Subtract 1× to hear the extra as a percent of cost.

$2 on $0.33 cost is about 6×, so roughly a 500% markup on cost.

## Same idea, new numbers
- Cost 20, price 60 → 3×
- Cost 20, 5× markup → price 100
`,
  "stacked-founder": `# Stacked founder math

Chain shortcuts in one breath. Hourly server ×720 → monthly. Monthly ÷ price → users per box.

$1/hr and $40/mo → 720÷40 ≈ 18 users per server.

This is Track B: you use Track A shortcuts inside a planning sentence.

## Same idea, new numbers
- Traffic 10k, conversion 5% → 500 customers
- Cost 3,000, price 50 → 60 users
`,
  "cfo-feasibility": `# Instant feasibility

Max revenue ≈ price × possible customers. If infra already rivals that ceiling, the model is weak.

$20/mo × 10k users = $200k/mo. A $150k cost base is tight; $5k is not.

## Same idea, new numbers
- $50 × 1,000 = $50k ceiling
- $100 × 10k = $1M ceiling
`,
  "cfo-unit-econ": `# LTV should be about 3× CAC

Revenue over life versus what you paid to acquire. CAC $40, $20/mo, 3 months → LTV $60 → weak vs 3×.

## Same idea, new numbers
- CAC 40, LTV 120 → 3×
- CAC 100, LTV 150 → 1.5× (thin)
`,
  "cfo-runway": `# Runway is cash ÷ monthly burn

$120k cash, $20k burn → 6 months. Directional, not a spreadsheet close.

## Same idea, new numbers
- 90k / 15k = 6 months
- 50k / 25k = 2 months
`,
  "cfo-growth": `# Twenty percent a month is not a 50× year

Memorize: 20%/mo ≈ 1.7× in 3 months, ~3× in 6, ~9× in 12. 100 users cannot become 50,000 at 20% in a year.

## Same idea, new numbers
- 100 users × ~9 → ~900 in 12 months at 20%/mo
`,
  pareto: `# Twenty percent carries about eighty

Not a spreadsheet identity. In a planning sentence, take 20% of the logos as the heavy slice and treat that slice as most of the load or revenue.

1,000 users → about 200 whales. Those 200 ≈ 80% of traffic. Size the painful part of the system for 200, not for a flat 1,000.

## Same idea, new numbers
- 500 customers → ~100 carry most of revenue
- 80% of 50 boxes is 40 — the busy ones
`,
  "revenue-triangle": `# Revenue is price times users

Memorize R = P × U so you can solve any side: users = revenue ÷ price, price = revenue ÷ users.

$50 × 20 = $1,000. Someone says $5,000 at $50 → 100 users. The triangle is the invert of break-even (that one is cost ÷ price).

## Same idea, new numbers
- $100 × 100 = $10,000
- $50 × 40 = $2,000
`,
  concurrency: `# Only 10–20% are on at once

100 paying logos is not 100 simultaneous jobs. Concurrent load is about 10% on a quiet day and 20% when it is busy.

Size GPU or seats for the concurrent slice. Buying for 100 when 20 are on is how you overbuy.

## Same idea, new numbers
- 1,000 logos → about 100–200 active
- 50 logos → about 5–10 active
`,
  "capacity-split": `# Boxes is users divided by capacity

Server count ≈ users ÷ users each box can hold. Cancel zeros: 1,000 / 20 = 50.

Do this after concurrency if someone gave logos, not simultaneous users. 1,000 logos at 20% on → 200 active / 20 per box = 10 boxes, not 50.

## Same idea, new numbers
- 400 users, 20 per server → 20 servers
- 900 users, 30 per box → 30 boxes
`,
  "box-contribution": `# Revenue per box versus cost per box

Price × users sitting on that box, then compare to monthly infra.

$30 × 20 users = $600. Box costs $720/mo → losing $120 per server. The model is leaking even if the top-line looks fine.

## Same idea, new numbers
- $40 × 20 = $800 vs $720 → $80 contribution
- $30 × 18 = $540 vs $720 → worse leak
`,
  utilization: `# Plan at about 70% of max

Advertised capacity is a ceiling, not a plan. Safe load ≈ 0.7 × max.

10 jobs/sec peak → plan on 7. 100 seats → 70 filled. This is how you stop founders from quoting 100% as if it were sustainable.

## Same idea, new numbers
- 50 req/sec max → 35 safe
- 200 seats → 140 filled
`,
  "estimate-pad": `# Always add 30% to a cost guess

Real costs run long. Estimated cost × 1.3.

$2,000 guess → about $2,600. This is not salary ×1.3 (benefits). Same multiple, different sentence: you undercounted the bill of materials, contractors, or cloud.

## Same idea, new numbers
- $1,000 guess → $1,300
- $5,000 guess → $6,500
`,
  "funnel-bands": `# SaaS funnel bands, then compress

Memorize typical bands: visit → signup about 10–30%, signup → paid about 2–10%. Mid smell: 20% then 5%.

10,000 visits → ~2,000 signups → ~100 paid. You do not need their analytics export to smell whether 10,000 visits can fund the plan.

## Same idea, new numbers
- 8,000 visits, 10% then 10% → 80 paid
- 20,000 visits, 20% then 5% → 200 paid
`,
};
