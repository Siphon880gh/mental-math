# Last digits and digit sums

Divisibility is a **filter**, not long division. You only need the last few digits, or a digit sum, to know whether a cut is even.

## Three and nine

Add the digits. If that sum is divisible by 3, so is the number. Same for 9, and you can keep adding until one digit remains (the digital root).

4,731 → 4+7+3+1 = **15**. 15÷3 works, so 4,731 is divisible by 3. It is not divisible by 9 (15 is not).

## Two, four, five, eight, twenty-five

- **2**: last digit even
- **4**: last two digits ÷4 (7,316 → 16)
- **8**: last three digits ÷8
- **5**: ends in 0 or 5
- **25**: ends 00, 25, 50, or 75
- **10 / 100**: trailing zeros

## Six, twelve, fifteen, and friends

A composite test is two cheap tests: **6** is 2 and 3. **12** is 3 and 4. **15** is 3 and 5.

## Eleven

Alternating sum: 2,728 → 2 − 7 + 2 − 8 = **−11**. Zero or a multiple of 11 (negative is fine) means yes.

## Conversation use

Before you believe a “split 4,731 three ways,” smell-test ÷3 with the digit sum. Before you believe an even split of a bill, glance at the last digit.

## Same idea, new numbers

- Digit sum of 2,145 = 12, so yes for 3
- Last two of 5,132 = 32, and 32÷4, so yes for 4
- 1,331 → 1−3+3−1=0, so yes for 11
