# LOOP — Drills (exhaustive timed banks)

Deepen `/drills` groups. Drill engine, timer, and writeback already exist.

Companions: [`src/lib/drillData.ts`](../src/lib/drillData.ts) · [`src/lib/grading.ts`](../src/lib/grading.ts)

---

## How to run

```text
/loop exhaustive Drills content using LOOPS/LOOP-Drills.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` && `npm run test` && `npm run build`.
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(drills).

**On each tick**
- Re-count items per group.
- Add **exactly one** new drill item (or one new group + first item in Phase D).
- Include `thoughtChain` and `familyId`; lint + test + build.

---

## Product intent

Path groups stay accurate and varied. Extra CFO groups only after path floors.

**Do not** change fluency-gate thresholds or Beginner unlock order.

---

## Coverage queue (strict order)

### Phase A — path groups to floor **≥12**

1. `anchors`  
2. `magnitude`  
3. `percents` (must keep all five percent familyIds represented)  
4. `conversions` (must keep ÷5, ×720, ÷30, ×12 represented)  
5. `break-even` (break-even **and** markup)

### Phase B — second pass to floor **≥16** on the same five groups, unique numbers

### Phase C — fill any familyId that appears in Guides but has **<3** drill items globally

### Phase D — new groups (only after A–C): `cfo-feasibility` `cfo-unit-econ` `cfo-runway` `cfo-growth` floor **≥8** each

### Phase E — docs-more groups (only after D): `foundations` covering EXTRA_MENTAL_FAMILY_IDS; `startup` covering EXTRA_STARTUP_FAMILY_IDS; floor **≥8** each group, every extra familyId represented ≥1 time

Do **not** put Phase D or E groups on the Beginner spine.

**Done(drills):** Phases A–E complete.

---

## Loop prompt

```markdown
# OBJECTIVE
Make drill banks exhaustive per Coverage queue.

**Done (drills):** Phases A–E floors met.

**Done (per tick):** Exactly one new item (or one new group + first item).

# CONTEXT
- `src/lib/drillData.ts`
- Grade with existing `gradeAnswer` — expected values must match that function
- Auto-verify: `npm run lint` && `npm run test` && `npm run build`

# STEP-BY-STEP CADENCE
1. **Orient** — first group below floor.
2. **Author one item** — unique id; familyId; prompt; expectedAnswer; unit; thoughtChain (the taught shortcut); optional trickId.
3. **Wrong-number hygiene** — if MCQ, distractors are plausible mis-shifts (forgot a zero, reversed percent incorrectly).
4. **Verify** — tests for unique ids; group picker lists it.
5. **On FAIL** — ≤10 rounds.

# VERIFICATION RUBRIC
- [ ] One item
- [ ] Closes next gap
- [ ] thoughtChain uses the family shortcut
- [ ] Unlock order / gate thresholds unchanged
- [ ] lint + test + build 0

# STOP CONDITIONS
- Done(drills) → STOP with per-group counts.
- Error budget 10 → handoff.
- Abort: changing POINTS or gate constants; rewriting the timer.

# TICK OUTPUT
1. group id + item id + familyId
2. PASS | FIXING (n/10) | STOP
3. Next gap
4. lint/test/build status
```
