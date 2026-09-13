# Digit roots and last digits

These are **error detectors**, not a way to compute the answer. A failed check proves the claim is wrong. A passed check does not prove it is right.

## Casting out nines

Repeatedly add digits until one remains. That digit is the number mod 9 (with 9 written as 9, not 0, unless the number is 0).

347 → 3+4+7=14 → **5**  
26 → **8**  
5×8=40 → **4**

If someone claims 347×26=9,022: 9+0+2+2=13 → **4**. The roots match, so the claim *might* be right.

If they had said 9,023, the root would be 5 and you would reject it immediately.

## Last digit

327×648: ones digits 7×8=56, so the product **must end in 6**. A claim ending in 5 is already false. You never touch the other digits.

You can also check last two digits, parity, or a divisibility test before redoing the whole product.

## Conversation use

A slide that says “327 × 648 = 211,895” dies on the last digit before you argue about the thousands. Treat checks as a separate breath from the calculation.

## Same idea, new numbers

- Digit root of 87,946 = 7
- 7×8 ends in 6, so 56, 16, 96 are legal ones digits
- 15×4 ends in 0, not 2
