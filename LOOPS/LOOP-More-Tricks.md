# LOOP — more-tricks catalog (incorporate gaps)

Walk [`context/docs-more-more/more-tricks.md`](../context/docs-more-more/more-tricks.md). For each numbered section and each of the 12 “master techniques,” either **map it to an existing family** or **ship a new Track A family**. Do not clone a shortcut the app already teaches.

Companions: [`src/lib/moreTricksCoverage.ts`](../src/lib/moreTricksCoverage.ts) · [`LOOP-More-Tricks-Audit.md`](./LOOP-More-Tricks-Audit.md) · [`LOOP-Guides.md`](./LOOP-Guides.md) · [`LOOP-Coach.md`](./LOOP-Coach.md)

These families are **not** on the Beginner Reflex Path. They append to `EXTRA_MENTAL_FAMILY_IDS`.

---

## How to run

```text
/loop exhaustive more-tricks incorporate using LOOPS/LOOP-More-Tricks.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` && `npm run test` && `npm run build`.
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(more-tricks).
3. Do not run the graph loop or the audit loop in the same session until this file’s Done.

**On each tick**
- Re-read the Coverage queue vs `src/lib/moreTricksCoverage.ts` and live registries.
- Ship **exactly one** unit (see Unit types).
- Rewrite from more-tricks.md — do not paste it. SAMPLE numbers only.
- Lint + test + build.

---

## Product intent

The doc is a catalog of arithmetic *moves*. The app already covers a large subset (percents, ×5/×9/×11, doubling, round-and-payback, near-100, fraction table, left-to-right). New `familyId`s only when the **move is different**. Variants of an existing move become extra `TRICKS` rows on that family (they render on the same guide).

Skip visual-only or historical-system rows (line multiplication, lattice, soroban-as-training). Complements *from* the abacus tradition still ship — that is a mental move.

---

## Already covered (do not new-family)

| Doc | Existing `familyId` |
|-----|---------------------|
| Distributive / place-value / partial products | `magnitude`, `regroup-factors` once shipped |
| Compensation, compatible estimate, add 99 | `round-compensate` |
| Doubling, ×4/×8, ×5, ×25, halve-and-double | `double-half` |
| ×9, ×11 two-digit, Nikhilam near 100, n5² | `multiply-near` |
| Left-to-right add/subtract | `left-to-right` |
| 1%/10% shift, 20% tip, 50/25/10/5 chunks, swap A% of B | `percent-shift`, `percent-tip`, `percent-chunks`, `percent-reversible` |
| Fraction ↔ percent benchmarks (core table) | `fraction-percent` |
| Power-of-10 place shift | `magnitude` |
| Commutative “flip the product” | `percent-reversible` (same algebra) |

---

## Coverage queue (strict order)

Skip a row whose `status` in `moreTricksCoverage.ts` is already `shipped` or `skip`.

### Phase A — new Track A families (one complete family per tick)

A complete family keeps tests green: `familyId` + ≥1 trick + docs-more lesson + guide spec + coach tree + ≥3 `foundations` drills + `GAME_SKIPS` + echo row in `LOOP-Graph.md` + coverage row `shipped`.

| # | familyId | Doc sections | One-line move |
|---|----------|--------------|---------------|
| A1 | `divisibility` | 1, 28 | Last digits / digit sum / alternating sum |
| A2 | `criss-cross` | 4 (Urdhva) | Vertical and crosswise digit products |
| A3 | `difference-squares` | 2 (identity), 5, 32–34 | (a−b)(a+b), near-square, same-tens ones-to-10 |
| A4 | `easy-division` | 8–12, 31 | Rewrite ÷ as ×, factor the divisor, scale both |
| A5 | `complements` | 13 (make 10/100), 16–18 | Missing-to-10/100, pairing, Gauss |
| A6 | `equal-adjust` | 15 | Add the same to both sides of a subtract |
| A7 | `cross-cancel` | 22–23 | Cancel factors first; compare by cross product |
| A8 | `cast-nines` | 26–27 | Digit-root and last-digit error checks |
| A9 | `approx-sqrt` | 36–37 | Nearby square bump; one Babylonian step |
| A10 | `regroup-factors` | 2 (factor), 40–41 | Associate / pick the easy pair first |

Do **not** put these on the Beginner spine. Coach slug = familyId.

### Phase B — extra trick rows + short guide notes (one family deepen per tick)

Only if that variant is still missing from `TRICKS` / the guide body.

| # | familyId | Doc | Variant to add |
|---|----------|-----|----------------|
| B1 | `multiply-near` | 3, 4 (Nikhilam already), 35 | Three-digit ×11; square near 100; ×99 / ×101 |
| B2 | `double-half` | 3, 7 | ×50, ×125; peasant / binary doubling |
| B3 | `fraction-percent` | 21 | 3/8, 5/8, 7/8, 1/25 |
| B4 | `magnitude` | 30 | Ignore decimal points, then put them back |
| B5 | `anchors` | 38, 42 | Squares through 25, powers of two |
| B6 | `round-compensate` | 24 | Compatible-number estimate *before* the exact payback |
| B7 | `percent-chunks` | 19 | 12.5% is ÷8 (if not already obvious on fraction-percent) |

GuideView must list **every** trick for the family (not only `[0]`).

### Phase C — recorded skips (one tick can record the remaining skip rows)

| Doc | Reason `skip` |
|-----|----------------|
| 6 line multiplication | Visual; slower than mental once digits grow |
| 6 soroban / anzan as a system | Training apparatus, not one shortcut; complements already taught |
| 6 rods / suanpan | Historical place-value; `magnitude` is the move |
| 7 lattice / gelosia | Visual grid; same as area / criss-cross conceptually |
| Intro Vedic / “Japanese” origin notes | History, not a calculation move |

**Done(more-tricks):** Phases A–C complete; `moreTricksCoverage.ts` has a row for sections 1–42 and master 1–12, each `shipped` or `skip`.

---

## Loop prompt

```markdown
# OBJECTIVE
Incorporate every uncovered mental move from more-tricks.md into Track A.

**Done (more-tricks):** Phases A–C complete; coverage registry complete.

**Done (per tick):** Exactly one unit (new family, or one deepen, or remaining skips).

# CONTEXT
- Source: `context/docs-more-more/more-tricks.md` — rewrite, do not paste
- Registry: `src/lib/moreTricksCoverage.ts`
- New families: EXTRA_MENTAL_FAMILY_IDS, tricks.ts, docs-more lesson, guides.ts SPECS, coaching spec + session file, foundations drills ≥3, GAME_SKIPS, LOOP-Graph echo
- Extra rows: same familyId; they render on `/guides/:slug`
- SAMPLE numbers; Beginner unlocks unchanged
- Auto-verify: `npm run lint` && `npm run test` && `npm run build`

# STEP-BY-STEP CADENCE
1. **Orient** — first queue row not shipped/skip.
2. **Author** — original copy; kebab slug = familyId for Phase A.
3. **Wire** — coverage row status `shipped` or `skip`.
4. **Verify** — `/guides/:slug` shows shortcut(s) + playable coach; foundations bank includes the family; tests require ≥3 drills.
5. **On FAIL** — ≤10 rounds.

# VERIFICATION RUBRIC
- [ ] One unit
- [ ] Closes next gap (no duplicate of an already-taught move)
- [ ] Original wording; ## Same idea, new numbers on new guides
- [ ] Unlock order / gate thresholds unchanged
- [ ] lint + test + build 0

# STOP CONDITIONS
- Done(more-tricks) → STOP with family list + skip list.
- Error budget 10 → handoff.
- Abort: putting new families on the Beginner spine; restoring Archive; pasting more-tricks.md.

# TICK OUTPUT
1. unit (familyId or deepen target or skip ids)
2. PASS | FIXING (n/10) | STOP
3. Next gap
4. lint/test/build status
```
