# LOOP — more-tricks audit (coverage check)

Second pass after [`LOOP-More-Tricks.md`](./LOOP-More-Tricks.md). Do **not** invent families here. Check that every numbered section and every master technique in [`context/docs-more-more/more-tricks.md`](../context/docs-more-more/more-tricks.md) is either taught in the app or an explicit skip.

Companion: [`data/more-tricks.json`](../data/more-tricks.json)

---

## How to run

```text
/loop exhaustive more-tricks audit using LOOPS/LOOP-More-Tricks-Audit.md
```

Run only after Done(more-tricks), or when you suspect drift. Do not start the incorporate loop in the same session.

**Before starting**
1. Leave working `composer serve` / `php -S` alone; verify with `./vendor/bin/phpunit`.
2. Hard-stop on 10-round error budget or Done(audit).

**On each tick**
- Check **exactly one** coverage row (section 1 → 42, then master-1 → master-12).
- PASS if the row’s `familyIds` exist in `allCurriculumFamilyIds()`, listed trick ids exist in `TRICKS` when `status === "shipped"`, and skip rows have a reason.
- If a gap is real (doc move taught neither by those families nor a skip): **do not** author a family in this loop — mark the row `gap` and STOP with a handoff back to LOOP-More-Tricks.
- Tiny wiring fixes (coverage comment, missing extra-trick id, GAME_SKIPS) are allowed. New `familyId`s are not.

---

## Product intent

The incorporate loop can miss a subsection (three-digit ×11, Gauss pairing, last-digit check). This loop is the checklist against the document, not a second content factory.

---

## Coverage queue (strict order)

1. Sections **1 through 42** in document order (one per tick).
2. Master techniques **1 through 12**.

For each row, open the mapped guide(s) and confirm the **move** is named (shortcut row or lesson body), not just a related family sitting nearby.

**Done(audit):** Every row PASSes; `tests/MoreTricksTest.php` is green; no `gap` status remains.

---

## Loop prompt

```markdown
# OBJECTIVE
Prove more-tricks.md is fully mapped onto the live curriculum.

**Done (audit):** All section + master rows PASS.

**Done (per tick):** Exactly one coverage row checked (or one tiny wiring fix for that row).

# CONTEXT
- Document: `context/docs-more-more/more-tricks.md`
- Map: `data/more-tricks.json`
- Live: `data/tricks.json`, guides catalog, `data/coaching/`, `data/drills.json`
- Auto-verify: `./vendor/bin/phpunit`

# STEP-BY-STEP CADENCE
1. **Orient** — next row in queue.
2. **Read** the doc section and the mapped guide / trick / skip reason.
3. **Decide** PASS (taught or honest skip) | GAP (handoff) | FIXING (wiring only).
4. **On GAP** — STOP; name the missing move; point at LOOP-More-Tricks.md.
5. **On FAIL** (tests) — ≤10 rounds.

# VERIFICATION RUBRIC
- [ ] One row
- [ ] familyIds are real curriculum ids
- [ ] shipped rows have a visible shortcut or lesson sentence for the move
- [ ] skip rows name why (visual / historical / duplicate)
- [ ] PHPUnit 0

# STOP CONDITIONS
- Done(audit) → STOP with PASS count vs 54 rows (42+12).
- Any `gap` → handoff to incorporate loop.
- Error budget 10 → handoff.
- Abort: adding a new familyId in the audit loop; rewriting runtime.

# TICK OUTPUT
1. row id + status
2. PASS | FIXING (n/10) | GAP | STOP
3. Next row
4. PHPUnit status
```
