Most fast methods reduce to a handful of ideas: place value, complements, distributive law, factoring, doubling/halving, and modular arithmetic.

One historical correction first: the modern system called **“Vedic Mathematics”** comes from Bharati Krishna Tirtha's 1965 book. The arithmetic methods are legitimate, but the claim that the 16 sutras themselves come directly from ancient Vedic mathematical texts is historically disputed. Likewise, viral **“Japanese line multiplication”** has no well-established Japanese origin. Japan's documented rapid-calculation tradition is much more strongly associated with the **soroban and mental-abacus calculation**; China's historical traditions include counting rods and the suanpan.

# 1. Divisibility tricks

These should probably be the first things to memorize because they help with division, fractions, factoring, and mental checking.

|Divisor|Mental test|Example|
|---|---|---|
|**2**|Last digit even|4,738 → yes|
|**3**|Digit sum divisible by 3|4,731 → 4+7+3+1=15 → yes|
|**4**|Last 2 digits divisible by 4|7,316 → 16 → yes|
|**5**|Ends in 0 or 5|2,345 → yes|
|**6**|Divisible by both 2 and 3|738 → yes|
|**7**|Remove last digit; subtract twice it from remainder; repeat|203 → 20−6=14 → yes|
|**8**|Last 3 digits divisible by 8|12,344 → 344÷8=43|
|**9**|Digit sum divisible by 9|7,236 → 18 → yes|
|**10**|Ends in 0|470|
|**11**|Alternating digit sum is 0 or multiple of 11|2728 → 2−7+2−8=−11|
|**12**|Divisible by 3 and 4|1,236 → yes|
|**13**|Remove last digit and add 4× that digit|286 → 28+24=52 → yes|
|**14**|Divisible by 2 and 7|—|
|**15**|Divisible by 3 and 5|—|
|**16**|Last four digits determine divisibility|31,168 → test 1,168|
|**17**|Remove last digit; subtract 5× it|221 → 22−5=17|
|**18**|Divisible by 2 and 9|—|
|**19**|Remove last digit; add twice it|133 → 13+6=19|
|**20**|Last two digits: 00,20,40,60,80|—|
|**24**|Divisible by 3 and 8|—|
|**25**|Ends 00, 25, 50, or 75|3,475|
|**30**|Divisible by 3 and 10|—|
|**50**|Ends 00 or 50|—|
|**100**|Last two digits 00|—|
|**125**|Last three digits divisible by 125|000,125,250,…875|

The 3/9 rules work because powers of 10 have remainder 1 modulo 3 or 9. That same modular idea produces many other divisibility tests.

# 2. Core mental multiplication methods

These are the techniques I would prioritize most heavily.

|Technique|Mental rule|Example|
|---|---|---|
|**Distributive splitting**|Break into easy pieces|23×17 = 23×10 + 23×7|
|**Place-value expansion**|Expand tens/hundreds|48×32 = 48×30 + 48×2|
|**Compensation**|Round one factor, correct afterward|39×24 = 40×24−24|
|**Doubling**|×2|37×2=74|
|**Repeated doubling**|×4, ×8, ×16|37×8: 74→148→296|
|**Halve-and-double**|Halve one factor, double the other|16×35 → 8×70 → 4×140=560|
|**Factorization**|Replace multiplier with factors|×18 = ×9×2|
|**Near-base multiplication**|Work around 10, 100, 1000|97×94|
|**Difference of squares**|(a−b)(a+b)=a²−b²|48×52 =2500−4=2496|
|**Square expansion**|(a+b)²|43²=(40+3)²=1849|
|**Square subtraction**|(a−b)²|98²=(100−2)²=9604|
|**Criss-cross**|Multiply digits vertically/crosswise|23×21=483|
|**Area/grid method**|Break both numbers by place|23×14 → 20×10 etc.|
|**Partial products**|Calculate each useful component|67×34 = 67×30+67×4|

Common Core itself emphasizes place value, properties of operations, arrays/area models, decomposition, and the inverse relationship between multiplication and division rather than one special trick.

# 3. Extremely useful fixed-multiplier tricks

These are worth memorizing because they occur constantly.

|Multiply by|Shortcut|Example|
|---|---|---|
|**2**|Double|47×2=94|
|**3**|Double + original|47×3=94+47=141|
|**4**|Double twice|37→74→148|
|**5**|×10 then halve|68×5=680/2=340|
|**6**|×5 + original|43×6=215+43=258|
|**8**|Double three times|27→54→108→216|
|**9**|×10 − original|47×9=470−47=423|
|**10**|Shift place value|37→370|
|**11**|Neighbor-sum trick|43×11=473|
|**12**|×10 + ×2|37×12=370+74=444|
|**15**|×10 + ×5|46×15=460+230=690|
|**18**|×20 − ×2|37×18=740−74=666|
|**19**|×20 − original|42×19=840−42=798|
|**20**|×2 then ×10|46×20=920|
|**25**|×100 ÷4|36×25=3600/4=900|
|**50**|×100 ÷2|34×50=1700|
|**75**|×3/4 of 100|28×75=2100|
|**99**|×100 − original|63×99=6300−63=6237|
|**101**|×100 + original|47×101=4747|
|**125**|×1000 ÷8|48×125=6000|
|**999**|×1000 − original|74×999=73,926|
|**1001**|×1000 + original|38×1001=38,038|

### The full ×11 trick

For:

**347 × 11**

Use adjacent sums:

3 | 3+4 | 4+7 | 7

→ 3 | 7 | 11 | 7

Carry:

**3817**

This is closely related to one of the well-known Trachtenberg-style neighbor algorithms. The Trachtenberg system contains specialized digit-by-digit rules for multipliers such as 11 and 12.

# 4. Vedic-style multiplication techniques

## Urdhva-Tiryagbhyam — “vertical and crosswise”

For:

**23 × 21**

Ones:

3×1 = 3

Crosswise:

2×1 + 3×2 = 8

Tens:

2×2 = 4

Answer:

**483**

With larger numbers, you continue the same diagonal-convolution pattern and carry as needed.

## Nikhilam — numbers near a power of 10

This is one of the best mental tricks.

### Example

**97 × 94**

Both are near 100.

Deficiencies:

97 → −3  
94 → −6

Cross subtract:

97−6 = 91

Multiply deficiencies:

3×6=18

Because the base is 100, reserve **two digits** for the right side:

**91 | 18**

Therefore:

**9,118**

### Above the base

**103 × 107**

Excesses:

+3 and +7.

Cross add:

103+7=110

Multiply:

3×7=21

Answer:

**110 | 21 = 11,021**

This family is commonly taught under the Nikhilam label in modern Vedic Mathematics.

# 5. Squaring tricks

## Numbers ending in 5

For any:

**n5²**

Multiply everything before the 5 by the next integer, then append 25.

### 75²

7×8=56

append 25:

**5,625**

### 125²

12×13=156

append 25:

**15,625**

Algebraically:

(10n+5)2=100n(n+1)+25(10n+5)^2=100n(n+1)+25

This is often associated with **Ekadhikena Purvena** in Vedic Mathematics.

## Same tens digit, ones add to 10

This one is exceptionally useful.

### 43 × 47

Same tens digit = 4.

Multiply:

4×5 = 20

Multiply last digits:

3×7=21

Combine:

**20 | 21 = 2021**

Another:

**62 × 68**

6×7=42

2×8=16

→ **4216**

## Same ones digit, tens digits add to 10

Example:

**23 × 83**

Same last digit = 3.

Tens digits:

2+8=10.

Left side:

2×8 + 3 = 19

Right side:

3²=09

Answer:

**19 | 09 = 1909**

## Numbers equally far from a center

Use:

(a−b)(a+b)=a2−b2(a-b)(a+b)=a^2-b^2

### 47×53

Both are 3 away from 50.

502−3250^2-3^2 2500−9=24912500-9=\boxed{2491}

### 96×104

1002−42=9984100^2-4^2=9984

This may be the single most useful algebraic mental-multiplication identity.

# 6. Japanese / Chinese visual traditions

## “Japanese” line multiplication

For something like:

**12 × 32**

draw:

1 line, then 2 lines in one direction;

3 lines, then 2 lines crossing them.

Count intersection groups according to place value.

The intersection totals correspond to:

(10+2)(30+2)(10+2)(30+2)

so you're visually performing the distributive law.

It's clever for **understanding multiplication**, but usually slower than mental arithmetic once numbers become large. Its Japanese origin is not established.

## Japanese soroban → anzan

This is much more interesting for genuine high-speed mental arithmetic.

You first learn calculations physically on a **soroban**. With enough training, you visualize the bead positions and manipulate a **mental abacus**.

Experts therefore aren't necessarily verbally thinking:

> “47 + 68…”

They can mentally manipulate bead configurations.

Research on Japanese abacus experts describes this mental-abacus representation explicitly.

Core soroban ideas include:

**Complements to 5**

4 = 5−1  
3 = 5−2

and **complements to 10**

9 = 10−1  
8 = 10−2  
7 = 10−3  
6 = 10−4

These complement relationships become automatic.

## Chinese counting rods

Chinese arithmetic historically used **counting rods on place-value boards**, including algorithms for multiplication, division, and square roots. Movement between columns naturally represented multiplication or division by powers of ten.

## Chinese suanpan

The later Chinese **suanpan** developed into a fast bead-calculation system and influenced Japan's soroban tradition.

# 7. Other historical rapid-multiplication systems

## Russian peasant / doubling-and-halving multiplication

Example:

**27 × 18**

Repeatedly halve the left and double the right:

27 → 18  
13 → 36  
6 → 72  
3 → 144  
1 → 288

Ignore rows where the left side is even.

Use:

27 → 18  
13 → 36  
3 →144  
1 →288

Add:

18+36+144+288 = **486**

Why it works: you're decomposing the first number into powers of two.

## Egyptian multiplication

Closely related.

Build powers of two:

1×27=27  
2×27=54  
4×27=108  
8×27=216

To calculate:

13×27

13=8+4+1

so:

216+108+27=**351**

This is essentially binary decomposition.

## Lattice multiplication

Write each digit product in a grid and add along diagonals.

It is closely related conceptually to:

- long multiplication
    
- line multiplication
    
- area models
    
- criss-cross multiplication
    

Historical lattice/gelosia multiplication is documented across Mediterranean mathematical traditions.

# 8. Fast division techniques

The best mental division technique is often to **change division into an easier multiplication**.

|Division|Rewrite|
|---|---|
|÷2|halve|
|÷4|halve twice|
|÷8|halve three times|
|÷5|×2 ÷10|
|÷20|÷2 ÷10, or ×5÷100|
|÷25|×4 ÷100|
|÷50|×2 ÷100|
|÷125|×8 ÷1000|
|÷0.5|×2|
|÷0.25|×4|
|÷0.125|×8|

### Example

785÷5

Double:

1570

divide by 10:

**157**

### Divide by 25

675÷25

Multiply by 4:

2700

divide by 100:

**27**

# 9. Factor the divisor

Instead of:

936÷12

notice:

12=3×412=3×4

So:

936÷3=312

312÷4=78

Answer:

**78**

Or reverse the order:

936÷4=234  
234÷3=78

Pick whichever path is mentally easiest.

# 10. Scale both numbers

Division is unchanged when both dividend and divisor are multiplied by the same amount.

### Example

4.8÷0.06

multiply both by 100:

480÷6=80

This is indispensable for decimals.

# 11. Partial-quotient division

Instead of formal long division:

936÷24

Recognize:

24×40 = 960

That's one 24 too many.

Therefore:

24×39=936

Answer:

**39**

This is sometimes dramatically faster than long division.

# 12. Division as a missing-factor problem

Instead of asking:

168÷12=?

ask:

> 12 × what = 168?

You may immediately recognize:

12×14=168.

This inverse relationship is explicitly emphasized in Common Core multiplication/division fluency.

# 13. Addition techniques

## Make 10

8+7

Turn:

8+2+5

= **15**

## Make 100

68+47

68 needs 32 to reach 100.

Take 32 from 47:

100+15

= **115**

## Left-to-right addition

457+368

400+300=700  
50+60=110  
7+8=15

700+110+15=

**825**

This often fits working memory better than mentally copying the written column algorithm.

# 14. Compensation

### Add 99

347+99

Add 100, subtract 1:

447−1=

**446**

### Add 998

Add 1000, subtract 2.

# 15. Subtraction by equal adjustment

This is underused.

### 502 − 198

Add 2 to **both numbers**:

504−200=

**304**

Because:

a−b=(a+c)−(b+c)a-b=(a+c)-(b+c)

Another:

725−397

→ 728−400

= **328**

# 16. Complements

Know these instantly:

|To 10|Pair|
|---|---|
|1|9|
|2|8|
|3|7|
|4|6|
|5|5|

Then extend them:

37 needs **63** to make 100.

428 needs **572** to make 1000.

This is fundamental to abacus arithmetic and fast subtraction.

# 17. Pairing numbers

For a long sum, look for pairs making 10, 100, 1000, etc.

18+72+35+65+28+82

Pair:

18+82=100  
72+28=100  
35+65=100

Total:

**300**

# 18. Gauss / arithmetic-series pairing

Instead of:

1+2+3+...+100

pair:

1+100=101  
2+99=101

There are 50 pairs:

50×101=505050×101=5050

General formula:

1+2+⋯+n=n(n+1)21+2+\cdots+n=\frac{n(n+1)}2

More generally:

sum=number of terms×average\text{sum}=\text{number of terms}×\text{average}

# 19. Fast percentages

These are essential mental conversions.

|Percentage|Mental operation|
|---|---|
|50%|÷2|
|25%|÷4|
|20%|÷5|
|10%|move decimal one left|
|5%|half of 10%|
|2%|twice 1%|
|1%|÷100|
|0.5%|half of 1%|
|12.5%|÷8|
|33⅓%|÷3|
|66⅔%|×2÷3|
|75%|×3÷4|

### 15%

10% + 5%.

15% of 80:

8 + 4 = **12**

### 17%

10% + 5% + 2%.

# 20. Swap percentages

One of the best tricks:

x% of y=y% of xx\%\text{ of }y=y\%\text{ of }x

### 4% of 75

Maybe awkward.

But:

75% of 4 = **3**

Therefore:

4% of 75 = **3**

### 18% of 50

50% of 18 = **9**

# 21. Fraction ↔ percentage benchmarks

These should become automatic.

|Fraction|Decimal|Percent|
|---|---|---|
|1/2|.5|50%|
|1/3|.333…|33⅓%|
|2/3|.666…|66⅔%|
|1/4|.25|25%|
|3/4|.75|75%|
|1/5|.2|20%|
|1/8|.125|12.5%|
|3/8|.375|37.5%|
|5/8|.625|62.5%|
|7/8|.875|87.5%|
|1/10|.1|10%|
|1/20|.05|5%|
|1/25|.04|4%|

# 22. Cross-cancel before multiplying fractions

Instead of:

1835×1427\frac{18}{35}\times\frac{14}{27}

cancel first:

18/27 → 2/3

14/35 → 2/5

Now:

23×25=415\frac23×\frac25=\frac4{15}

Much easier than multiplying large numbers and reducing later.

# 23. Compare fractions by cross multiplication

Which is larger?

711or813\frac7{11}\quad \text{or}\quad\frac8{13}

Compare:

7×13=91

8×11=88

Since 91>88:

711>813\frac7{11}>\frac8{13}

No decimal calculation needed.

# 24. Estimation by compatible numbers

Instead of mentally calculating:

598×21

first estimate:

600×20=12,000.

Then calculate exactly:

598×21 = 598×20+598

=11,960+598

= **12,558**

The estimate immediately tells you what magnitude to expect.

# 25. Rounding and correcting

### Multiplication

198×37

Use 200:

200×37=7400

subtract:

2×37=74

Answer:

**7326**

### Division

602÷3

Use:

600÷3=200

plus:

2÷3

≈ **200.67**

# 26. Casting out nines

This is not primarily a calculation trick—it is an excellent **error detector**.

Suppose:

347×26=9022

Digit root:

347 → 3+4+7=14 →5

26→8

5×8=40→4

Answer:

9022 → 9+0+2+2=13→4

They match.

That doesn't prove the answer is correct, but if they **don't match**, the multiplication is definitely wrong. The method works because decimal digit sums preserve the number modulo 9.

# 27. Last-digit checking

Suppose someone claims:

327×648=211,895

You don't need to recalculate everything.

Last digits:

7×8=56

so the answer **must end in 6**.

211,895 ends in 5.

Therefore it's wrong immediately.

You can similarly check:

- last 2 digits
    
- parity
    
- divisibility
    
- magnitude
    

before doing a complete recalculation.

# 28. Digital-root shortcuts

Repeatedly add digits until one digit remains.

Example:

87,946

8+7+9+4+6=34

3+4=**7**

Useful for:

- divisibility by 3
    
- divisibility by 9
    
- checking multiplication
    
- checking addition
    

# 29. Power-of-10 thinking

Treat:

10, 100, 1000, 0.1, 0.01

as **place shifts**, rather than multiplication problems.

Historically, Chinese counting-board arithmetic represented this literally by moving positions on the board.

# 30. Fast decimal multiplication

Ignore decimals temporarily.

### 1.7 × 2.4

Compute:

17×24

17×20 +17×4

340+68=408

Two total decimal places:

**4.08**

# 31. Fast decimal division

Remove the decimal from the divisor.

12.6÷0.3

multiply both by 10:

126÷3=

**42**

# 32. Difference-of-squares recognition

Memorize:

(a+b)(a−b)=a2−b2(a+b)(a-b)=a^2-b^2

You'll begin seeing calculations differently.

Instead of:

99×101

see:

(100−1)(100+1)(100-1)(100+1) 10000−110000-1

= **9999**

Instead of:

997×1003

10002−321000^2-3^2

= **999,991**

# 33. Algebraic square identities

Memorize these completely:

(a+b)2=a2+2ab+b2(a+b)^2=a^2+2ab+b^2 (a−b)2=a2−2ab+b2(a-b)^2=a^2-2ab+b^2 (a+b)(a−b)=a2−b2(a+b)(a-b)=a^2-b^2

For mental arithmetic, these are arguably more powerful than dozens of isolated tricks.

# 34. Near-square multiplication

Suppose:

73×77

center =75.

So:

(75−2)(75+2)(75-2)(75+2) 752−475^2-4

Since 75²=5625:

**5621**

# 35. Square near 100

### 97²

(100−3)2(100-3)^2 10000−600+910000-600+9

= **9409**

### 104²

10000+800+1610000+800+16

= **10816**

# 36. Approximate square roots

If you know:

a2a^2

and your number is nearby:

a2+d≈a+d2a\sqrt{a^2+d}\approx a+\frac{d}{2a}

Example:

103\sqrt{103}

Since 10²=100:

10+32010+\frac3{20}

≈ **10.15**

Actual ≈10.1489.

Very good mentally.

# 37. Babylonian/Newton square-root method

For N\sqrt N, guess xx, then compute:

xnew=x+N/x2x_{\text{new}} = \frac{x+N/x}{2}

Example:

10\sqrt{10}

guess 3:

(3+10/3)/2(3+10/3)/2

≈3.1667.

Repeat once:

≈ **3.1623**

This converges extremely quickly.

# 38. Multiplication-table relationships

Don't memorize every fact independently.

For example:

7×8

could be:

7×4=28

double:

**56**

Or:

7×10−7×2

=70−14

=56.

Likewise:

6×7

=5×7+7

=35+7

=42.

This reduces memory load dramatically.

# 39. Commutative switching

Remember:

a×b=b×aa×b=b×a

If:

17×6

feels inconvenient, you can mentally interpret it as six 17s or seventeen 6s—whichever decomposition is easier.

Likewise:

4% of 75

becomes 75% of 4 through the same multiplication commutativity.

# 40. Associative regrouping

(a×b)×c=a×(b×c)(a×b)×c=a×(b×c)

Example:

25×16×4

Instead of left-to-right:

pair:

25×4=100

then:

100×16=1600.

# 41. Choose the easiest order

For:

8×37×125

don't do:

8×37 first.

Pair:

8×125=1000

then:

37×1000=

**37,000**

This habit alone can massively improve mental arithmetic.

# 42. Memorize strategically useful number facts

The highest-return facts are not just the 1–12 multiplication table. Learn:

**Squares**

1² through at least 30².

Especially:

15²=225  
20²=400  
25²=625  
30²=900

**Powers of 2**

2, 4, 8, 16, 32, 64, 128, 256, 512, 1024.

**Powers of 10**

obvious, but mentally foundational.

**Common cubes**

1³=1  
2³=8  
3³=27  
4³=64  
5³=125  
6³=216  
7³=343  
8³=512  
9³=729  
10³=1000.

**Common reciprocals**

1/2=.5  
1/3=.333…  
1/4=.25  
1/5=.2  
1/6≈.1667  
1/8=.125  
1/9=.111…  
1/10=.1.

# The underlying “master techniques”

If I condensed this entire catalog into the **12 skills that give you most of the benefit**, they would be:

1. **Complements to 10/100/1000**
    
2. **Place-value decomposition**
    
3. **Distributive property**
    
4. **Round and compensate**
    
5. **Double and halve**
    
6. **Factor before calculating**
    
7. **Difference of squares**
    
8. **Near-base multiplication**
    
9. **Divisibility rules**
    
10. **Convert division into multiplication**
    
11. **Memorize squares/powers/common fractions**
    
12. **Estimate and independently check the result**
    

Everything from Vedic criss-cross multiplication to Common Core area models to line multiplication is, underneath, largely manipulating these same mathematical structures.

A particularly effective progression for becoming genuinely fast in your head would be **divisibility → complements → doubling/halving → ×5/9/11/25/50/125 → compensation → near-base multiplication → difference of squares → criss-cross → percentage/fraction conversions → mental-abacus techniques**.