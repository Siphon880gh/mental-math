# LOOP — Cases (exhaustive conversation library)

Deepen `/cases`. CasePlayer runtime already exists.

Companions: [`data/cases.json`](../data/cases.json)

---

## How to run

```text
/loop exhaustive Cases content using LOOPS/LOOP-Cases.md
```

**Before starting**
1. Leave working `composer serve` / `php -S` alone; verify with `./vendor/bin/phpunit`.
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(cases).

**On each tick**
- Add **exactly one** new `CaseStudy`.
- Distinct prompt (not a clone). Hide `thoughtChain` until submit (engine already does this — do not regress).

---

## Product intent

| Learner need | How this loop delivers |
|--------------|------------------------|
| On-the-fly conversation | More briefs that sound like an operator talking |
| Process | thoughtChain names the `familyId` shortcuts |

Fluency gate and Beginner unlocks unchanged.

---

## Coverage queue (strict order)

Do not skip a pack while it is thin.

| Step | packId | Floor | thinkingModes that must appear |
|------|--------|-------|--------------------------------|
| 1 | `stacked-founder` | ≥8 beginner **and** ≥4 intermediate | `infra_chain`, `break_even`, `conversion_funnel`, `markup_read` |
| 2 | `cfo-feasibility` | ≥6 beginner **and** ≥3 intermediate | `smell_test` |
| 3 | `cfo-unit-econ` | ≥6 beginner **and** ≥3 intermediate | `ltv_cac` |
| 4 | `cfo-runway` | ≥6 beginner **and** ≥3 intermediate | `runway` |
| 5 | `cfo-growth` | ≥6 beginner **and** ≥3 intermediate | `growth_claim` |
| 6 | `startup-efficiency` | ≥6 beginner **and** ≥3 intermediate | `rule_of_40`, `burn_multiple`, `payback` |
| 7 | `startup-marketplace` | ≥6 beginner **and** ≥3 intermediate | `take_rate`, `fees` |
| 8 | `startup-people-capital` | ≥6 beginner **and** ≥3 intermediate | `loaded_cost`, `dilution`, `tam_fermi`, `nrr_read` |

**Inside a pack:** missing thinkingMode at beginner → then intermediate → then a new sector/story (SaaS price, ads, infra, marketplace) with a new number shape.

**Done(cases):** All eight pack floors met.

---

## Loop prompt

```markdown
# OBJECTIVE
Exhaust case packs per Coverage queue.

**Done (cases):** All eight pack floors met.

**Done (per tick):** Exactly one new CaseStudy.

# CONTEXT
- `data/cases.json`
- Grade via `gradeAnswer`; expectedAnswer must match
- Ideas: ladder L5 + CEO/CFO drills in `context/docs/_Biz Math/` — rewrite
- Auto-verify: `./vendor/bin/phpunit`

# STEP-BY-STEP CADENCE
1. **Orient** — first thin pack; first missing mode/difficulty.
2. **Author** — unique id; packId; familyId (primary); thinkingMode; conversation `prompt`; expectedAnswer; unit; thoughtChain steps; difficulty.
3. **Anti-clone** — different numbers and story (do not rescale a prior case).
4. **Verify**.
5. **On FAIL** — ≤10 rounds.

# VERIFICATION RUBRIC
- [ ] One case
- [ ] Closes next pack gap
- [ ] thoughtChain is the taught method
- [ ] Gate / unlocks unchanged
- [ ] PHPUnit 0

# STOP CONDITIONS
- Done(cases) → STOP with pack counts.
- Error budget 10 → handoff.
- Abort: showing thoughtChain pre-submit; live business data.

# TICK OUTPUT
1. case id + pack + thinkingMode + difficulty
2. PASS | FIXING (n/10) | STOP
3. Next gap
4. PHPUnit status
```
