# LOOP — Guides (exhaustive principles)

Deepen `/guides` and `/guides/:slug`. This is the **only** literacy hub. Shortcuts render on the guide. Each guide links a step-by-step coach on the same slug.

Companions: [`src/lib/guides.ts`](../src/lib/guides.ts) · [`src/lib/tracks.ts`](../src/lib/tracks.ts) · [`RESOURCES.md`](../RESOURCES.md) · [`LOOP-Coach.md`](./LOOP-Coach.md)

---

## How to run

```text
/loop exhaustive Guides content using LOOPS/LOOP-Guides.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` && `npm run test` && `npm run build`.
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(guides).

**On each tick**
- Re-inventory guides by `familyId` and `track`.
- Add **exactly one** new guide (`slug` unique, slug = `familyId` unless a second distinct lesson).
- Set `track` via `trackForFamily`. Wire `relatedCoachSlug` to the same slug.
- Include a shortcut row in `tricks.ts` if the family has none.
- Lint + test + build.

---

## Product intent

One hub. Two tracks, labeled in full:

- **A. Quick math for business and everyday life** (`quick`)
- **B. Business and entrepreneurship stakeholder discussion and planning math** (`stakeholder`)

Every guide shows: track eyebrow, shortcut, principle, coach CTA. Missing coach trees still get a slot page — do not 404.

Do not add an Archive nav or `/archive` index. `/archive` stays a redirect to `/guides`.

---

## Coverage queue (strict order)

Floor **≥1 guide per family**. Skip a family that already has a guide.

1. Track A — `TRACK_A_FAMILY_IDS` order (`src/lib/tracks.ts`)
2. Track B — `TRACK_B_FAMILY_IDS` order

Then optional second guide only if the family still confuses two distinct shortcuts (must be a new slug, not a clone). Default: stop at one per family.

If Phase A is already met, a standalone Guides loop STOPs. Under the graph, Stage 1 then pairs Coach.

**Done(guides):** Every family in RESOURCES / `allCurriculumFamilyIds()` has ≥1 guide with `track` set and a coach CTA on the same slug.

---

## Loop prompt

```markdown
# OBJECTIVE
One principle guide per familyId, on a two-track Guides hub.

**Done (guides):** Coverage queue complete.

**Done (per tick):** Exactly one new guide.

# CONTEXT
- `src/lib/guides.ts` (slug, familyId, title, summary, body, track, relatedCoachSlug)
- Tracks: `src/lib/tracks.ts`
- Shortcut rows: `src/lib/tricks.ts` (render on the guide, not a separate Archive)
- Source ideas: `context/docs/_Biz Math/` and `context/docs-more/` — original wording
- Auto-verify: `npm run lint` && `npm run test` && `npm run build`

# STEP-BY-STEP CADENCE
1. **Orient** — first family with zero guides (Track A, then Track B).
2. **Author** — kebab slug = familyId; 300–800 words max; worked example; when to use.
3. **Wire** track + relatedCoachSlug; add a trick row if missing.
4. **Verify** — `/guides` lists it under the correct track heading; `/guides/:slug` shows shortcut + coach CTA; no verbatim paste from context docs.
5. **On FAIL** — ≤10 rounds.

# VERIFICATION RUBRIC
- [ ] One guide; unique slug; familyId + track set
- [ ] Correct track heading (A or B full label)
- [ ] Coach CTA uses the same slug
- [ ] Original copy
- [ ] lint + test + build 0

# STOP CONDITIONS
- Done(guides) → STOP with family → slug → track list.
- Error budget 10 → handoff.
- Abort: rewriting the guide renderer “for cleanup”; restoring Archive as a second list.

# TICK OUTPUT
1. slug + familyId + track
2. PASS | FIXING (n/10) | STOP
3. Next family
4. lint/test/build status
```
