# Last digits and digit sums

Divisibility is a **filter**, not long division. You only need the last few digits, a digit sum, or one small trim to know whether a cut is even.

## The table

| ÷ | Test | SAMPLE |
|---|------|--------|
| 2 | Last digit even | 4,738 → yes |
| 3 | Digit sum divisible by 3 | 4,731 → 15 → yes |
| 4 | Last two digits divisible by 4 | 7,316 → 16 → yes |
| 5 | Ends in 0 or 5 | 2,345 → yes |
| 6 | Passes 2 **and** 3 | 738 → yes |
| 7 | Drop the last digit, subtract twice it, repeat | 203 → 20 − 6 = 14 → yes |
| 8 | Last three digits divisible by 8 | 12,344 → 344 ÷ 8 = 43 → yes |
| 9 | Digit sum divisible by 9 | 7,236 → 18 → yes |
| 10 | Ends in 0 | 470 → yes |
| 11 | Alternating sum is 0 or a multiple of 11 | 2,728 → 2−7+2−8 = −11 → yes |
| 12 | Passes 3 **and** 4 | 1,236 → yes |
| 13 | Drop the last digit, add 4× it | 286 → 28 + 24 = 52 → yes |
| 14 | Passes 2 **and** 7 | 294 → even, 29 − 8 = 21 → yes |
| 15 | Passes 3 **and** 5 | 345 → yes |
| 16 | Last four digits divisible by 16 | 31,168 → 1,168 ÷ 16 = 73 → yes |
| 17 | Drop the last digit, subtract 5× it | 221 → 22 − 5 = 17 → yes |
| 18 | Passes 2 **and** 9 | 7,236 → yes |
| 19 | Drop the last digit, add twice it | 133 → 13 + 6 = 19 → yes |
| 20 | Last two digits are 00, 20, 40, 60, 80 | 3,460 → yes |
| 24 | Passes 3 **and** 8 | 1,344 → yes |
| 25 | Ends 00, 25, 50, or 75 | 3,475 → yes |
| 30 | Passes 3 **and** 10 | 2,130 → yes |
| 50 | Ends 00 or 50 | 6,750 → yes |
| 100 | Ends 00 | 9,300 → yes |
| 125 | Last three digits are 000, 125, 250, … 875 | 3,375 → yes |

## Three and nine

Add the digits. If that sum is divisible by 3, so is the number. Same for 9, and you can keep adding until one digit remains (the digital root).

4,731 → 4+7+3+1 = **15**. 15÷3 works, so 4,731 is divisible by 3. It is not divisible by 9 (15 is not).

This works because 10, 100, 1,000 all leave remainder 1 when divided by 3 or 9. Every digit counts once.

## Two, four, eight, sixteen

Powers of two only look at the tail. **2** looks at one digit, **4** at two, **8** at three, **16** at four. The rest of the number is a multiple of 10,000 (or 1,000…) and already divides cleanly.

## Five, twenty, twenty-five, fifty, one hundred twenty-five

Endings only: **5** ends 0/5. **20** ends 00/20/40/60/80. **25** ends 00/25/50/75. **50** ends 00/50. **125** has last three digits in the 125 ladder (000, 125, 250, 375, 500, 625, 750, 875).

## Seven, thirteen, seventeen, nineteen: trim the last digit

Chop the last digit off, then fix the stub with one small multiply. Repeat until the number is small enough to recognize.

- **7**: subtract twice the dropped digit. 203 → 20 − 2×3 = **14**, a multiple of 7, so yes.
- **13**: add four times it. 286 → 28 + 4×6 = **52** = 4×13, so yes.
- **17**: subtract five times it. 221 → 22 − 5×1 = **17**, so yes.
- **19**: add twice it. 133 → 13 + 2×3 = **19**, so yes.

Each trim keeps divisibility by that one prime. It does not keep the remainder, so use it for yes/no only.

## Composites are two cheap tests

Split the divisor into coprime pieces and run both tests.

- **6** = 2 and 3 · **12** = 3 and 4 · **14** = 2 and 7 · **15** = 3 and 5
- **18** = 2 and 9 · **24** = 3 and 8 · **30** = 3 and 10

Do not use 2 and 6 for 12 — they overlap. The pieces must share no factor.

## Eleven

Alternating sum: 2,728 → 2 − 7 + 2 − 8 = **−11**. Zero or a multiple of 11 (negative is fine) means yes.

## Conversation use

Before you believe a “split 4,731 three ways,” smell-test ÷3 with the digit sum. Before you believe 203 seats “fit seven to a table,” trim: 20 − 6 = 14. Before you believe an even split of a bill, glance at the last digit.

## Same idea, new numbers

- Digit sum of 2,145 = 12, so yes for 3
- Last two of 5,132 = 32, and 32÷4, so yes for 4
- 1,331 → 1−3+3−1=0, so yes for 11
- 343 for 7 → 34 − 6 = 28, so yes
- 1,236 for 12 → digit sum 12 and 36÷4, so yes
