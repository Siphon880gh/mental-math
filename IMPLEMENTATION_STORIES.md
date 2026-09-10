# Mental Math Trainer (REFLEX_CORE) — Implementation Stories

Stories and acceptance criteria for each milestone.  
Parent map: [`EPIC_MAP.md`](./EPIC_MAP.md) · Runtime state: [`.agents/state.json`](./.agents/state.json) · Spec: [`docs/superpowers/specs/2026-09-10-mental-math-trainer-design.md`](./docs/superpowers/specs/2026-09-10-mental-math-trainer-design.md)

**Status key:** `todo` · `in_progress` · `done` · `blocked`  
**Finalize:** Approach A — fluency-first + timed gate + MVP freeze

---

## Global conventions

- Stack: React 19, TypeScript, Vite, React Router, Vitest, ESLint
- Persist in `localStorage` (`reflex_core_progress_v1`)
- Join key: `familyId` (problem type). Resource type is a separate field/route
- Grade: `correct` | `close` | `incorrect` + thought-chain reveal
- SAMPLE / educational numbers only
- Context docs are ideas only — rewrite lesson copy
- Do not start post-P0 until MVP freeze checklist is met
- Auto-verify: `npm run lint` && `npm run test` && `npm run build`

---

## Build order

### P0 — MVP freeze (do in sequence)

| # | Milestone | Epic | Tier | Status |
|---|-----------|------|------|--------|
| 1 | E1.M1 | E1 | P0 | done |
| 2 | E3.M1 | E3 | P0 | done |
| 3 | E4.M1 | E4 | P0 | todo |
| 4 | E4.M2 | E4 | P0 | todo |
| 5 | E4.M3 | E4 | P0 | todo |
| 6 | E4.M0 | E4 | P0 | todo |
| 7 | E5.M1 | E5 | P0 | todo |
| 8 | E5.M2 | E5 | P0 | todo |
| 9 | E8.M1 | E8 | P0 | todo |
| 10 | E8.M2 | E8 | P0 | todo |
| 11 | E8.M3 | E8 | P0 | todo |
| 12 | E2.M1 | E2 | P0 (thin) | todo |
| 13 | E3.M2 | E3 | P0 | todo |
| 14 | E6.M1 | E6 | P0 | todo |

**MVP freeze:** Beginner Reflex Path completable — two-track Guides hub + drills L1–L4 + fluency gate + case engine + ≥3 stacked-founder cases + one coaching tree + unlock + live dashboard + path-complete credential.

### Post-P0 — skill depth

| # | Milestone | Epic | Tier | Status |
|---|-----------|------|------|--------|
| 15 | E5.M3 | E5 | Post | todo |
| 16 | E8.M4 | E8 | Post | todo |
| 17 | E2.M2 | E2 | Post | todo |
| 18 | E4.M4 | E4 | Post | todo |

### Later — mini-games

| # | Milestone | Epic | Tier | Status |
|---|-----------|------|------|--------|
| 19 | E7.M1 | E7 | Later | todo |
| 20 | E7.M2 | E7 | Later | todo |

### Advanced — CFO

| # | Milestone | Epic | Tier | Status |
|---|-----------|------|------|--------|
| 21 | E9.M1 | E9 | Advanced | todo |
| 22 | E9.M2 | E9 | Advanced | todo |
| 23 | E9.M4 | E9 | Advanced | in_progress |
| 24 | E9.M3 | E9 | Advanced | todo |

---

## E1 — Family catalog

### E1.M1 — Schema + P0 seed *(P0)*

**Outcome:** `familyId` list and shortcut rows exist for every P0 family (rendered on Guides, not a separate Archive).

| ID | Story | Acceptance |
|----|--------|------------|
| E1.M1.S1 | Export `FamilyId` union and `Trick` type (`id`, `familyId`, `title`, `rule`, `example`, `category`) from `src/lib/tricks.ts` | Types compile; union includes all P0 families in RESOURCES (through `markup`) |
| E1.M1.S2 | Seed ≥1 trick per P0 family; unique kebab `id` | `TRICKS.length` ≥ number of P0 families; `getTrick(id)` round-trips |
| E1.M1.S3 | Vitest: every P0 family has ≥1 trick; no duplicate ids | `npm run test` covers `tricks.test.ts` |

---

## E3 — Progress & unlocks

### E3.M1 — Store + frozen path IDs *(P0)*

**Outcome:** Progress survives refresh; Beginner milestone IDs are canonical.

| ID | Story | Acceptance |
|----|--------|------------|
| E3.M1.S1 | `ProgressStore`: get/set pathId, milestone statuses, drill scores, latencies, streaks | JSON round-trip in `localStorage` key `reflex_core_progress_v1` |
| E3.M1.S2 | Schema version + corrupt → reset + recovery flag | Tests cover corrupt JSON |
| E3.M1.S3 | Seed Beginner Reflex Path skeleton IDs only: `E4.M1` `E4.M2` `E4.M3` `E4.M0` `E5.M2` | IDs match E2.M1 / stories; includes fluency gate id `E4.M0` |

### E3.M2 — Unlock rules & writeback *(P0)*

**Outcome:** Completing drills/cases unlocks the next milestone; cases stay locked until fluency gate.

| ID | Story | Acceptance |
|----|--------|------------|
| E3.M2.S1 | Unlock: prior milestone `complete`; `E5.M2` requires `E4.M0` complete | Locked drills/cases not startable |
| E3.M2.S2 | Drill + case sessions write scores and median latency | Store updates after a finished group |
| E3.M2.S3 | Reset path control with confirm | First-run state after confirm |

---

## E4 — Guides, drills, fluency gate

### E4.M1 — Anchors + magnitude *(P0)*

**Outcome:** Learner can drill L1–L2 and open those families from the Guides hub.

| ID | Story | Acceptance |
|----|--------|------------|
| E4.M1.S1 | `gradeAnswer` in `src/lib/grading.ts`: exact int, close money, incorrect | Unit tests for 50×40=2000, 25×8=200 |
| E4.M1.S2 | Drill groups `anchors` and `magnitude` ≥8 items each; thoughtChain on each | Unique ids; `familyId` set |
| E4.M1.S3 | `/drills/:groupId` player: prompt, timer, input, reveal | Completing writes progress |
| E4.M1.S4 | `/guides` shows Track A and Track B headings; anchors and magnitude guides include shortcut + coach CTA | Original copy; `/archive` redirects to `/guides`; no Archive nav |

### E4.M2 — Percents *(P0)*

**Outcome:** All five percent families appear in drills + at least two guides.

| ID | Story | Acceptance |
|----|--------|------------|
| E4.M2.S1 | Group `percents` ≥8 items covering `percent-shift`, `percent-reversible`, `percent-tens`, `percent-chunks`, `percent-tip` | Each of those familyIds appears ≥1 time |
| E4.M2.S2 | Guides for reversible percents and 1% shift | Linked `familyId`; Track A; coach CTA same slug |
| E4.M2.S3 | Writeback to E4.M2 milestone | Completing group marks milestone when unlocks exist (or records score until E3.M2) |

### E4.M3 — Conversions + break-even *(P0)*

**Outcome:** L3 conversions and L4 business shortcuts are drillable.

| ID | Story | Acceptance |
|----|--------|------------|
| E4.M3.S1 | Group `conversions` ≥8 covering `div-by-5`, `hour-month`, `month-day`, `month-year` | ×720 and ÷5 items present |
| E4.M3.S2 | Group `break-even` ≥8 covering `break-even` and `markup` | Reduce-both-sides chain in thoughtChain |
| E4.M3.S3 | Thin guides for ×720 and cost÷price | Launchable from `/guides` |

### E4.M0 — Fluency soft-gate *(P0)*

**Outcome:** Graded cases stay locked until percents + conversions meet accuracy and latency.

| ID | Story | Acceptance |
|----|--------|------------|
| E4.M0.S1 | Thresholds: ≥80% correct on `percents` and `conversions`; median latency ≤5s percents, ≤6s conversions | Constants in `progressStore` or `grading.ts`; tested |
| E4.M0.S2 | Completing both groups under threshold sets milestone `E4.M0` complete | Over-threshold accuracy with slow median does **not** complete the gate |
| E4.M0.S3 | Locked copy on `/cases` names the gate (percents + conversions timed) | No silent empty state |

---

## E5 — Conversation cases

### E5.M1 — Case engine *(P0)*

**Outcome:** Submit a number, then see aftermath chain (hidden until submit).

| ID | Story | Acceptance |
|----|--------|------------|
| E5.M1.S1 | `CaseStudy` type: id, packId, familyId, thinkingMode, prompt, expectedAnswer, unit, thoughtChain, difficulty | Exported from `src/lib/cases.ts` |
| E5.M1.S2 | `/cases/:caseId` player: prompt visible; thoughtChain hidden until submit; grade via `gradeAnswer` | Tests or UI contract: chain not in DOM before submit |
| E5.M1.S3 | Pack list on `/cases` | Empty pack copy if none unlocked |

### E5.M2 — Thin stacked-founder pack *(P0)*

**Outcome:** ≥3 beginner conversation cases.

| ID | Story | Acceptance |
|----|--------|------------|
| E5.M2.S1 | Case: $1/hr server, $40/mo price → users per server (≈18) | `thinkingMode: infra_chain`; thoughtChain uses ×720 |
| E5.M2.S2 | Case: cost 3000, price 50 → users | `thinkingMode: break_even` |
| E5.M2.S3 | Case: 10k visitors, 5% conversion → customers | `thinkingMode: conversion_funnel` |
| E5.M2.S4 | Distinct prompts; SAMPLE honesty in debrief | No clone-and-rename |

### E5.M3 — Scale stacked library *(post-P0)*

| ID | Story | Acceptance |
|----|--------|------------|
| E5.M3.S1 | `stacked-founder` ≥8 beginner and ≥4 intermediate | thinkingModes include `markup_read` |
| E5.M3.S2 | Intermediate cases chain ≥3 shortcuts | thoughtChain length ≥3 steps |

---

## E8 — Step-by-step coaching

### E8.M1 — Schema + validate + sample *(P0)*

| ID | Story | Acceptance |
|----|--------|------------|
| E8.M1.S1 | Session type: meta + nodes (`continue` / `wrong` / `success`) with `rewind_to` on wrong | `src/lib/coaching/types.ts` |
| E8.M1.S2 | `validateSession` rejects missing rewind, empty success choices, unknown ids | Tests in `coaching/validate.test.ts` |
| E8.M1.S3 | Sample session `percent-shift`: ≥2 wrong, ≥1 success | Loadable by slug |

### E8.M2 — Nav engine *(P0)*

| ID | Story | Acceptance |
|----|--------|------------|
| E8.M2.S1 | `choose(session, nodeId, choiceId)` returns next node; history stack | Unit tests |
| E8.M2.S2 | Wrong node offers rewind to `rewind_to` | Test covers rewind |

### E8.M3 — Catalog + session UI *(P0)*

| ID | Story | Acceptance |
|----|--------|------------|
| E8.M3.S1 | `/coach/:slug` plays from the matching guide; unknown or unauthored slug recovers (no 404) | Reached from Guides, not a second literacy hub |
| E8.M3.S2 | Path trail of choice labels | Collapsible trail |
| E8.M3.S3 | Optional sessionStorage adapter for refresh recovery | Documented key |

### E8.M4 — Topic library floor *(post-P0)*

| ID | Story | Acceptance |
|----|--------|------------|
| E8.M4.S1 | Pair remaining guides: Track A families first, then Track B; slug = guide slug | LOOP-Coach may finish the rest; this milestone at least anchors, break-even, stacked-founder beyond `percent-shift` |

---

## E2 — Path planner

### E2.M1 — Beginner Reflex Path template *(P0 thin)*

| ID | Story | Acceptance |
|----|--------|------------|
| E2.M1.S1 | `BEGINNER_REFLEX_PATH` with milestones matching frozen IDs and `contentRefs` | `src/lib/learningPaths.ts` |
| E2.M1.S2 | `coachTip` per milestone names a real route | Tips mention `/drills/…` or `/cases` |
| E2.M1.S3 | Unlock graph matches E3.M1 IDs | First milestone `unlockFrom: []` |

### E2.M2 — Operator path *(post-P0)*

| ID | Story | Acceptance |
|----|--------|------------|
| E2.M2.S1 | Second path template for CFO packs; does not replace Beginner unlocks | Switcher or GoalPicker |
| E2.M2.S2 | Preview of milestones before switch | Confirm switch |

---

## E6 — Dashboard

### E6.M1 — Home = real next action *(P0)*

| ID | Story | Acceptance |
|----|--------|------------|
| E6.M1.S1 | Home shows active path, completed vs locked milestones | Not a fake % |
| E6.M1.S2 | Primary CTA launches the next unlocked resource | Button href matches `contentRefs` |
| E6.M1.S3 | Path-complete credential copy | Shown only when last milestone complete |
| E6.M1.S4 | First-run empty state | Explains 5-minute reflex training |

---

## E4.M4 — Extra drill volume *(post-P0)*

| ID | Story | Acceptance |
|----|--------|------------|
| E4.M4.S1 | Each P0 drill group ≥12 items, still unique | No paraphrased clones |

---

## E7 — Mini-games

### E7.M1 — Host + first game *(Later)*

| ID | Story | Acceptance |
|----|--------|------------|
| E7.M1.S1 | `GameMeta` registry; `/games` list; `/games/:slug` host (iframe or component map) | Unknown slug 404 |
| E7.M1.S2 | One game: decimal-place shifter (`percent-shift` or `magnitude`) | Beats “just type the number” |
| E7.M1.S3 | `familyId` + optional `relatedGuide` | Chrome link if guide exists |

### E7.M2 — Mechanic families *(Later)*

| ID | Story | Acceptance |
|----|--------|------------|
| E7.M2.S1 | Reversible-percent swap game | Distinct from shifter |
| E7.M2.S2 | Percent-chunk adder game | Distinct mechanic |
| E7.M2.S3 | Skip families with no mechanic (document skip in games.ts comment) | No fake games |

---

## E9 — CFO / advanced

### E9.M1 — Cards + drills

| ID | Story | Acceptance |
|----|--------|------------|
| E9.M1.S1 | Shortcuts + Track B guides for `cfo-feasibility` `cfo-unit-econ` `cfo-runway` `cfo-growth` | Listed under stakeholder track, not Archive |
| E9.M1.S2 | Drill groups ≥8 each for those four | Not on Beginner unlock spine |

### E9.M2 — Case packs

| ID | Story | Acceptance |
|----|--------|------------|
| E9.M2.S1 | Packs with thinkingModes `smell_test` `runway` `ltv_cac` `growth_claim` | ≥3 beginner cases per pack |
| E9.M2.S2 | Growth-claim case: 20%/mo cannot 100→50k in 12 months | Process debrief names the 20% table |

### E9.M4 — docs-more extras *(Advanced)*

| ID | Story | Acceptance |
|----|--------|------------|
| E9.M4.S1 | Extra mental + startup `familyId`s exist with ≥1 shortcut and ≥1 guide each (`EXTRA_FAMILY_IDS`) | Track A foundations / Track B startup; `/guides/:slug` renders `context/docs-more` bodies |
| E9.M4.S2 | Drill groups `foundations` and `startup` ≥8 each; every extra familyId appears ≥1 time | Not on Beginner unlock spine |
| E9.M4.S3 | Case packs `startup-efficiency`, `startup-marketplace`, `startup-people-capital` meet LOOP-Cases floors | thinkingModes from RESOURCES |

### E9.M3 — Operator path + Home

| ID | Story | Acceptance |
|----|--------|------------|
| E9.M3.S1 | Operator path `contentRefs` point at E9 packs | Beginner path unchanged |
| E9.M3.S2 | Home tips name CFO packs only when that path is active | No stale CTAs |

---

## MVP freeze checklist

- [ ] E1.M1 catalog seeded
- [ ] E3.M1 IDs frozen; store round-trips
- [ ] E4.M1–M3 path drill groups meet ≥8 floors
- [ ] E4.M0 gate blocks cases until timed pass
- [ ] E5.M1 engine hides chain until submit
- [ ] E5.M2 ≥3 stacked-founder cases
- [ ] E8.M1–M3 one valid percent tree playable
- [ ] E2.M1 path template
- [ ] E3.M2 unlocks + reset
- [ ] E6.M1 live dashboard + credential
- [ ] lint + test + build 0

---

## Definition of done (every story)

- Acceptance column met
- `familyId` set on new content rows
- SAMPLE honesty
- No runtime LLM
- Beginner unlock order unchanged unless the current story is E3.M2 / E2.M1
