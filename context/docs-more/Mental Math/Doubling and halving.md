# Doubling and halving

Many “hard” multiplies are a **chain of doubles** or a **×10 then half**.

## Double to multiply by 4, 8, 16

×2 once is double. ×4 is double twice. ×8 is double three times.

35 × 8

- 35 × 2 = 70
- 70 × 2 = 140
- 140 × 2 = **280**

## ×5 is ×10 then half

×10 is a zero; half is easy.

86 × 5 → 860 / 2 = **430**

## ×25 is ×100 then ÷4

25¢ is a quarter of a dollar, so ×25 is “add two zeros, halve, halve.”

48 × 25 → 4,800 / 2 = 2,400 / 2 = **1,200**

## ×50 and ×125

×50 is ×100 then half: 34 × 50 → 3,400 / 2 = **1,700**.

×125 is ×1000 then ÷8: 48 × 125 → 48,000 / 8 = **6,000**.

## Halve both sides (even × even)

If both numbers are even, you may halve one and double the other (same product):

16 × 35 → 8 × 70 = **560**

Use this when one side becomes a multiple of 10.

## Peasant / binary doubling

27 × 18: keep halving the left and doubling the right. Add the rows where the left was odd (the 1-bits):

27→18, 13→36, 6→72 (drop), 3→144, 1→288  
18+36+144+288 = **486**

Why it works: you are writing 27 in powers of two (16 + 8 + 2 + 1) without saying “binary.”

## Egyptian doubling

Egyptian multiplication is the same idea from the other side: build a doubling ladder of one factor, then add the rungs that make the other.

13 × 27, and 13 = 8 + 4 + 1:

- 1 × 27 = 27
- 2 × 27 = 54
- 4 × 27 = 108
- 8 × 27 = 216

216 + 108 + 27 = **351**. Skip the 2× rung because 13 has no 2 in it.

## Conversation use

Headcount of 12 people × $80k is painful. 12 × 8 = 96, then three zeros for thousands → **$960k**. Or 10 × 80k = 800k plus 2 × 80k = 160k.

## Same idea, new numbers

- 45 × 4 = 180
- 64 × 5 = 320
- 36 × 25 = 900
- 34 × 50 = 1,700
- 48 × 125 = 6,000
- 37 × 8 → 74 → 148 → 296
- 21 × 14 (peasant) → keep 14, 56, 224 → 294
- 11 × 23 (Egyptian, 8+2+1) → 184 + 46 + 23 = 253
