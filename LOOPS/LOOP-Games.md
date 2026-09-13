# LOOP — Games (one-mechanic playables)

Deepen `/games`. Host runtime already exists (E7 complete). **No runtime LLM.**

Companions: [`data/games.json`](../data/games.json) · [`public/assets/js/games.js`](../public/assets/js/games.js)

---

## How to run

```text
/loop exhaustive Games content using LOOPS/LOOP-Games.md
```

**Before starting**
1. Leave working `composer serve` / `php -S` alone; verify with `./vendor/bin/phpunit`.
2. If E7 is not done, STOP and run milestones instead.
3. Hard-stop on 10-round error budget or Done(games).

**On each tick**
- Add **exactly one** mini-game **or** skip one family with reason `no_mechanic`.
- Wire `familyId` and related guide/coach if they exist.

---

## Product intent

A game must be a **different interaction** than typing the answer in a drill. If it is not, skip.

Allowed mechanics (add new ones only if equally distinct):

| familyId | Mechanic |
|----------|----------|
| `magnitude` / `percent-shift` | Decimal / zero shifter |
| `percent-reversible` | Swap percent and base |
| `percent-chunks` | Add 50/25/10/5 chips to a target |
| `div-by-5` / `percent-tip` | ×2 then shift (same widget, different copy — only **one** of these if they share UI) |

Skip: `anchors` (pure recall), `break-even` (better as drill/case), `stacked-founder` (better as case), all `cfo-*` unless a genuinely new mechanic exists.

**Done(games):** Every row in the mechanic table is either shipped or recorded skip; no duplicate mechanics.

---

## Loop prompt

```markdown
# OBJECTIVE
Ship or skip each mechanic family once.

**Done (games):** Mechanic table exhausted.

**Done (per tick):** One game **or** one documented skip.

# CONTEXT
- `data/games.json` + widget in `public/assets/js/games.js` and `app/views/pages/game-*.php`
- Auto-verify: `./vendor/bin/phpunit`

# STEP-BY-STEP CADENCE
1. **Orient** — next mechanic row without a game or skip.
2. **Author or skip** — if skip, record in `data/games.json`: familyId + reason `no_mechanic`.
3. **If authoring** — unique slug; familyId; win condition; SAMPLE copy; link related guide if present.
4. **Verify**.
5. **On FAIL** — ≤10 rounds.

# VERIFICATION RUBRIC
- [ ] One unit (game or skip)
- [ ] Game ≠ numeric drill clone
- [ ] PHPUnit 0

# STOP CONDITIONS
- Done(games) → STOP with shipped/skipped list.
- Error budget 10 → handoff.
- Abort: adding a calculator widget; LLM in the game.

# TICK OUTPUT
1. slug or skip familyId
2. PASS | FIXING (n/10) | STOP
3. Next row
4. PHPUnit status
```
