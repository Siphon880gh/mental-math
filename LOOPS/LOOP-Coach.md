# LOOP — Coach (exhaustive method trees)

Deepen `/coach/:slug`. Runtime (validate, navigate, persist, path trail) already exists. **No runtime LLM.**

**Pairing rule:** one session per guide. Slug = `familyId` = guide slug.

Companions: [`data/coaching/`](../data/coaching/) · [`app/Catalog/Guides.php`](../app/Catalog/Guides.php) · [`LOOP-Guides.md`](./LOOP-Guides.md)

---

## How to run

```text
/loop exhaustive Coach content using LOOPS/LOOP-Coach.md
```

**Before starting**
1. Leave working `composer serve` / `php -S` alone; verify with `./vendor/bin/phpunit` (include coaching tests).
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(coach).

**On each tick**
- Add **exactly one** new session file (slug unique, equals the unpaired guide).
- Minimum: `start` + ≥2 continue layers · ≥2 `wrong` with `rewind_to` · ≥1 `success`.
- Drop `data/coaching/<slug>.json` so `Sessions::has($slug)` is true.

---

## Product intent

Each Guides page has a step-by-step coach. The tree teaches **which shortcut to pick**, not a quiz restated as buttons.

Walk **Track A** unpaired guides first, then **Track B**.

If a guide exists and the coach does not, this loop is the catch-up — the graph treats that as Stage 1 exclusive pairing.

Placeholder `/coach/:slug` (“not authored yet”) is not Done. Author the tree.

---

## Coverage queue (strict order)

Skip a family that already has a session with that `familyId`.

1. Track A — `TRACK_A_FAMILY_IDS`
2. Track B — `TRACK_B_FAMILY_IDS`

**Each session:** `meta.familyId` set; tags include `beginner` or `intermediate`; SAMPLE setup in the first message; `meta.slug` equals the guide slug.

**Done(coach):** Every guide in `GUIDES` has ≥1 session with the same slug.

---

## Loop prompt

```markdown
# OBJECTIVE
One valid decision graph per guide / familyId.

**Done (coach):** Coverage queue complete.

**Done (per tick):** Exactly one new session module.

# CONTEXT
- New file: `data/coaching/<slug>.json`
- Auto-loaded by `Reflex\Coaching\Sessions`; validate with `Reflex\Coaching\Validate::session`
- slug = familyId = guide slug
- Track A then Track B
- validate must pass or the session is dropped
- Auto-verify: `./vendor/bin/phpunit`

# STEP-BY-STEP CADENCE
1. **Orient** — first guide with no session (Track A, then Track B).
2. **Author** — unique slug matching the guide; wrong nodes empty choices + rewind_to; success empty choices; choice labels readable on the trail.
3. **Wire** + tests. Guide CTA should no longer show “not authored yet.”
4. **On FAIL** — ≤10 rounds (validation is the usual cause).
5. **Skills** — update add-coaching-session if rewind mistakes repeat.

# VERIFICATION RUBRIC
- [ ] One session; familyId set; slug matches guide
- [ ] validate ok; ≥2 wrong + rewind; ≥1 success
- [ ] No LLM / randomness
- [ ] PHPUnit 0

# STOP CONDITIONS
- Done(coach) → STOP with slug list by track.
- Error budget 10 → handoff.
- Abort: adding an LLM coach; mutating nav engine “for cleanup.”

# TICK OUTPUT
1. slug + familyId + track
2. PASS | FIXING (n/10) | STOP
3. Next family
4. PHPUnit status
```
