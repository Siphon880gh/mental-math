/** One-line index copy for families that have no docs-more file. */
export const INLINE_GUIDE_SUMMARIES: Record<string, string> = {
  anchors: "Memorize a few products, then scale zeros.",
  magnitude: "Do not recompute the base fact — move zeros.",
  "percent-shift": "1% is two places left; 10% is one place.",
  "percent-reversible": "A% of B is B% of A. Pick the easier half.",
  "percent-tens": "Drop a zero from each side, then multiply.",
  "percent-chunks": "Build percents from 50 / 25 / 10 / 5.",
  "percent-tip": "Twenty percent is double, then one place left.",
  "div-by-5": "Double, then shift — same motion as a 20% tip.",
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
};

/** Short original lessons for families that have no docs-more file. */
export const INLINE_GUIDE_BODIES: Record<string, string> = {
  anchors: `# Number anchors

Memorize a few products until they are chords, not calculations: 5×4=20, 25×4=100, 75×4=300, 8×8=64.

Then scale zeros. 50×40 is the 5×4 chord with two extra zeros → 2,000.

## Check
- 25×8 → 200
- 75×12 → 900
`,
  magnitude: `# Magnitude scaling

Do not recompute the base fact. ×10 appends a zero. ×100 appends two.

7×8=56, so 70×8=560 and 700×8=5,600.

## Check
- 9×6 → 54, so 90×6=540
- 12×3 → 36, so 120×3=360
`,
  "percent-shift": `# One percent is two places left

1% of a number is that number with the decimal moved two places left. 10% is one place.

1% of 2,000 is 20. 7% of 108: 7×108=756, two places left → 7.56.

## Check
- 10% of 470 = 47
- 1% of 8,500 = 85
`,
  "percent-reversible": `# Percents swap

A% of B is the same as B% of A. Pick the easier half.

14% of 50 is 50% of 14 → 7.

## Check
- 8% of 25 = 25% of 8 = 2
- 16% of 50 = 8
`,
  "percent-tens": `# Tens of percent of tens

Drop a zero from each side, multiply, and you already moved two decimal places.

30% of 40 → 3×4=12.

## Check
- 80% of 70 = 56
- 20% of 90 = 18
`,
  "percent-chunks": `# Build percents from 50 / 25 / 10 / 5

Half, quarter, tenth, half of a tenth. Add the chunks you need.

35% of 2,000 = three tenths (600) plus 5% (100) → 700.

## Check
- 15% of 800 = 80+40 = 120
- 75% of 400 = 300
`,
  "percent-tip": `# Twenty percent is double, then one place left

×2, then move the decimal one place left (that is ÷10).

20% of $42.30 → 84.60 → $8.46.

## Check
- 20% of 80 = 16
- 20% of 15 = 3
`,
  "div-by-5": `# Divide by five: double, then shift

×2, then one place left. Same motion as a 20% tip, different story.

1,322 ÷ 5 → 2,644 → 264.4.

## Check
- 80 ÷ 5 = 16
- 45 ÷ 5 = 9
`,
  "hour-month": `# Hourly to monthly is ×720

24×30≈720. Hourly cost × 720 ≈ monthly cost.

$1/hr → $720/mo.

## Check
- $2/hr → $1,440/mo
- $0.50/hr → $360/mo
`,
  "month-day": `# Monthly to daily is ÷30

A month is about 30 days. Reverse: daily × 30 ≈ monthly.

$900/mo → $30/day.

## Check
- $300/mo → $10/day
- $24/day → $720/mo
`,
  "month-year": `# Monthly to yearly is ×12

Twelve months. Yearly to monthly is ÷12.

$30/mo → $360/year.

Multiply by 10 for $300/year. Then multiply by 2 for $60/year. Sum them for $360/year.

## Check
- $100/mo → $1,200/year
- $2/hr → $720/mo → $8,640/year
`,
  "break-even": `# Users needed is cost ÷ price

Reduce both sides by tens first. 3,000÷50 → 300÷5 → 60 users.

## Check
- Cost 1,000, price 50 → 20
- Cost 2,000, price 25 → 80
`,
  markup: `# Markup is price ÷ cost

How many times cost is the price? Subtract 1× to hear the extra as a percent of cost.

$2 on $0.33 cost is about 6×, so roughly a 500% markup on cost.

## Check
- Cost 20, price 60 → 3×
- Cost 20, 5× markup → price 100
`,
  "stacked-founder": `# Stacked founder math

Chain shortcuts in one breath. Hourly server ×720 → monthly. Monthly ÷ price → users per box.

$1/hr and $40/mo → 720÷40 ≈ 18 users per server.

This is Track B: you use Track A shortcuts inside a planning sentence.

## Check
- Traffic 10k, conversion 5% → 500 customers
- Cost 3,000, price 50 → 60 users
`,
  "cfo-feasibility": `# Instant feasibility

Max revenue ≈ price × possible customers. If infra already rivals that ceiling, the model is weak.

$20/mo × 10k users = $200k/mo. A $150k cost base is tight; $5k is not.

## Check
- $50 × 1,000 = $50k ceiling
- $100 × 10k = $1M ceiling
`,
  "cfo-unit-econ": `# LTV should be about 3× CAC

Revenue over life versus what you paid to acquire. CAC $40, $20/mo, 3 months → LTV $60 → weak vs 3×.

## Check
- CAC 40, LTV 120 → 3×
- CAC 100, LTV 150 → 1.5× (thin)
`,
  "cfo-runway": `# Runway is cash ÷ monthly burn

$120k cash, $20k burn → 6 months. Directional, not a spreadsheet close.

## Check
- 90k / 15k = 6 months
- 50k / 25k = 2 months
`,
  "cfo-growth": `# Twenty percent a month is not a 50× year

Memorize: 20%/mo ≈ 1.7× in 3 months, ~3× in 6, ~9× in 12. 100 users cannot become 50,000 at 20% in a year.

## Check
- 100 users × ~9 → ~900 in 12 months at 20%/mo
`,
};
