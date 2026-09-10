# LOOP — Coach (exhaustive method trees)

Deepen `/coach/:slug`. Runtime (validate, navigate, persist, path trail) already exists. **No runtime LLM.**

**Pairing rule:** one session per guide. Slug = `familyId` = guide slug.

Companions: [`src/lib/coaching/`](../src/lib/coaching/) · [`src/lib/guides.ts`](../src/lib/guides.ts) · [`LOOP-Guides.md`](./LOOP-Guides.md)

---

## How to run

```text
/loop exhaustive Coach content using LOOPS/LOOP-Coach.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` && `npm run test` && `npm run build` (include coaching tests).
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(coach).

**On each tick**
- Add **exactly one** new session file (slug unique, equals the unpaired guide).
- Minimum: `start` + ≥2 continue layers · ≥2 `wrong` with `rewind_to` · ≥1 `success`.
- Register so `hasCoachSession(slug)` is true.

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
- New file: `src/lib/coaching/sessions/<slug>.ts`
- Register in `src/lib/coaching/sessions/index.ts` and `src/lib/coaching/catalog.ts`
- slug = familyId = guide slug
- Track A then Track B
- validate must pass or the session is dropped
- Auto-verify: `npm run test` && `npm run lint` && `npm run build`

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
- [ ] lint + test + build 0

# STOP CONDITIONS
- Done(coach) → STOP with slug list by track.
- Error budget 10 → handoff.
- Abort: adding an LLM coach; mutating nav engine “for cleanup.”

# TICK OUTPUT
1. slug + familyId + track
2. PASS | FIXING (n/10) | STOP
3. Next family
4. test/lint/build status
```
