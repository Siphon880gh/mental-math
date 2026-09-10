# Mental Math Trainer (REFLEX_CORE) — Design

**Date:** 2026-09-10  
**Status:** Approved (Approach A — fluency-first trainer)  
**Primary learner:** Founder / builder / operator who must calculate on the fly in conversation  
**Curriculum source:** `context/docs/_Biz Math/` (ladder, patterns, percent tricks, CEO/CFO drills)

Companion product map: [`EPIC_MAP.md`](../../../EPIC_MAP.md) · [`RESOURCES.md`](../../../RESOURCES.md) · [`IMPLEMENTATION_STORIES.md`](../../../IMPLEMENTATION_STORIES.md) · [`LOOPS/`](../../../LOOPS/)

---

## Problem

School math trains exact written calculation. The docs train **number-shape recognition**: see 50 and 2000, recall 5×4=20, scale to 40 users. Success is no pause and no calculator during a live pricing, infra, or growth conversation.

This app is a trainer, not a calculator and not a spreadsheet course.

## Approach

React/Vite SPA modeled on Stocks-Trainer (paths, progress, decide-and-reveal) with Leetcode-coach resource types (guide, mechanic, step-by-step tree).

Two axes stay separate:

| Axis | What it is | Who owns it |
|------|------------|-------------|
| **Problem type** (`familyId`) | The trick or situation (anchors, reversible percents, ×720, break-even, …) | Registry ids on every resource |
| **Cognitive ability** (resource type) | How you practice it (look up, read, timed drill, mini-game, method tree, conversation case) | Separate routes and runtimes |

A learning path only **sequences** resources. It is not a resource.

## Learner spine (Beginner Reflex Path)

1. Number anchors (instant 5×4, 25×4, 75×4, 8×8, …)
2. Magnitude scaling (append zeros / move the decimal)
3. Percent tricks (1% shift, reversible, tens-of-percent, 20% tip, 50/25/10/5 chunks)
4. Time-money conversions (×720, ÷30, ×12) plus ÷5
5. Break-even and markup (cost÷price, price÷cost)
6. **Fluency soft-gate** — timed drills on percents + conversions must pass before graded cases
7. Stacked founder cases (server $/hr → monthly → users per server)
8. Later: CFO smell tests (ceiling, LTV/CAC, runway, growth tables)

Daily sessions stay short (about 5 minutes). Consistency beats volume.

## Resource types

See [`RESOURCES.md`](../../../RESOURCES.md) for fields and registries.

| Type | Cognitive job | Learner action |
|------|---------------|----------------|
| **Guide** | Understand why | Read shortcut + principle on one page; open the same-slug coach |
| **Drill** | Recall under time | Type or pick the answer; see the thought chain |
| **Mini-game** | Feel one mechanic | e.g. swap percent/base, shift the decimal |
| **Step-by-step** | Choose the method | Deterministic tree; wrong → explain → rewind |
| **Case** | Use it live | Conversation prompt → number → reveal process |

**Not resources:** Beginner Reflex Path, nav chrome, Home copy.

Echo (one family across types):

```text
Guide (+ shortcut) → Step-by-step coach (same slug) → Drill → Mini-game (if one mechanic) → Case → Home tip
```

## Tracks

One **Guides** hub. Two tracks, labeled in full in the UI:

| Track | Id | Label |
|-------|----|--------|
| **A** | `quick` | Quick math for business and everyday life |
| **B** | `stakeholder` | Business and entrepreneurship stakeholder discussion and planning math |

Each guide has a step-by-step coach on the same slug. Track A fluency still gates Track B graded cases.

## Problem families

Stable `familyId` values. Content loops echo these; do not invent parallel ids.

| familyId | Ladder | Track | Source |
|----------|--------|-------|--------|
| `anchors` | L1 | A | Number anchors table |
| `magnitude` | L2 | A | Zero-append / orders of magnitude |
| `percent-shift` | L3 | A | 1% = two-place shift; 10% = one-place |
| `percent-reversible` | L3 | A | 14% of 50 = 50% of 14 |
| `percent-tens` | L3 | A | 30% of 40 → 3×4 |
| `percent-chunks` | L3 | A | 50/25/10/5 decomposition |
| `percent-tip` | L3 | A | 20% = ×2 then one-place left |
| `div-by-5` | L3 | A | ×2 then one-place left |
| `hour-month` | L3 | A | ×720 |
| `month-day` | L3 | A | ÷30 / ×30 |
| `month-year` | L3 | A | ×12 |
| `break-even` | L4 | A | cost ÷ price, reduce both sides |
| `markup` | L4 | A | price ÷ cost, 3× / 5× |
| `left-to-right` | Extra | A | Add/subtract large place first |
| `round-compensate` | Extra | A | Round, then opposite-sign payback |
| `double-half` | Extra | A | ×4/×8 doubles; ×5 = ×10/2 |
| `multiply-near` | Extra | A | ×9, ×11, near-100, n5² |
| `fraction-percent` | Extra | A | 1/8=12.5% table |
| `rule-of-72` | Extra | A | Years to double ≈ 72 / rate |
| `stacked-founder` | L5 | B | Chain conversions in one breath. Also the P0 **case pack** id |
| `cfo-feasibility` | Advanced | B | Revenue ceiling vs cost scale |
| `cfo-unit-econ` | Advanced | B | LTV ≥ 3× CAC |
| `cfo-runway` | Advanced | B | cash ÷ burn |
| `cfo-growth` | Advanced | B | 20%/mo tables; doubling |
| `mrr-arr` | Extra | B | ARR ≈ MRR × 12 |
| `churn` | Extra | B | Lifetime months ≈ 1 / monthly churn |
| `nrr` | Extra | B | Same-customer revenue later |
| `rule-of-40` | Extra | B | Growth % + margin % |
| `burn-multiple` | Extra | B | Burn / net new ARR |
| `cac-payback` | Extra | B | CAC / monthly gross profit |
| `take-rate` | Extra | B | GMV × take |
| `processing-fees` | Extra | B | ~2.9% + $0.30 |
| `fully-loaded` | Extra | B | Salary × 1.3 |
| `dilution` | Extra | B | Cash / post-money |
| `tam-fermi` | Extra | B | Customers × yearly price |

P0 implements through `stacked-founder`. CFO families are post-MVP. Extra families already have Guides; drills/cases follow E9 / `LOOPS/` and do **not** change Beginner unlocks. `/archive` is not a learner surface.

## Architecture

Client-first SPA. No auth in MVP. No runtime LLM. Coaching trees are authored graphs.

```text
src/
  pages/          routes (Dashboard, Guides, Drills, Games, Cases, Coach)
  lib/tracks.ts   Track A / Track B
  lib/tricks.ts   shortcut rows rendered on guides
  lib/guides.ts   markdown/principle bodies + track
  lib/ladderGuides.ts  inline Track A/B lessons without docs-more files
  lib/drillData.ts + drillEngine.ts   timed items + grade
  lib/cases.ts    conversation briefs + expected chain
  lib/games.ts    mini-game registry (post-P0 volume)
  lib/coaching/   session graphs + nav (fail/rewind)
  lib/progressStore.ts
  lib/learningPaths.ts
  lib/grading.ts  exact / close / thought-chain compare
```

**Stack:** React 19, TypeScript, Vite, React Router, Vitest, ESLint. Progress key `reflex_core_progress_v1`.

**Data flow:** Path milestone `contentRefs` (`guide:percent-reversible`, `drill:percents`, `cases:stacked-founder`, `coach:percent-shift`) → player writes scores → store unlocks next → Dashboard shows next CTA.

**Grading**

| Mode | Rule |
|------|------|
| Integer / users | Exact |
| Money | Accept exact or nearest dollar when the prompt says “about” |
| Percent | Exact for taught shortcuts; otherwise ±0.5 percentage points |
| Timed drill | Target seconds per family (anchors 3s, percents 5s, conversions 6s, stacked cases untimed). Overtime can still score `correct` but fails the fluency gate |
| Case | Number grade + process: learner must have used the taught chain (shown after submit; P0 grades the number, shows the chain; post-P0 may require picking the chain) |

**Errors:** Corrupt localStorage → reset + message. Locked milestone → show prerequisite. Unknown coach node → recover to `start`. Missing slug → 404 with link home. Empty drill group → do not launch.

**Testing:** Vitest for grading, unlock graph, coaching validate, family id contracts. `npm run lint` && `npm run build` on every story. Playwright not required for P0.

## UI surfaces

| Route | Job |
|-------|-----|
| `/` | Path, next action, streak, credential when path complete |
| `/guides`, `/guides/:slug` | Two-track hub; shortcut + principle + coach CTA |
| `/coach/:slug` | Step-by-step tree (same slug as the guide) |
| `/drills`, `/drills/:groupId` | Timed bank |
| `/games`, `/games/:slug` | One-mechanic play (post-P0 volume) |
| `/cases`, `/cases/:caseId` | Conversation decide-and-reveal |

`/archive` redirects to `/guides`. Do not restore Archive as a second literacy list.

Tone: practiced, unhurried, sentence case. No calculator widget on drill/case screens. SAMPLE / educational numbers only (no live quotes, no brokerage).

## MVP freeze

Playable **Beginner Reflex Path**: catalog + progress + two-track Guides hub + anchors/magnitude/percents/conversions/break-even drills + fluency gate + case engine + ≥3 stacked-founder cases + one percent step-by-step session + unlock + live dashboard + path-complete credential.

Out of P0: mini-game library, CFO families, extra paths, auth, cloud sync, runtime LLM.

## Content drain

After runtime exists, [`LOOPS/LOOP-Graph.md`](../../../LOOPS/LOOP-Graph.md) picks one section loop per tick (`FOUNDATION_THEN_ECHO`: Guides Track A then B, then pair Coach per guide). Section files author one unit per tick. Milestone delivery stays in [`AGENTS_LOOP-Continue-Milestone.md`](../../../AGENTS_LOOP-Continue-Milestone.md).

## Constraints

- Do not merge problem type and resource type into one enum
- Do not replace the Beginner Reflex Path unlock order while adding content
- Coaching: no LLM at session runtime
- One content unit per content-loop tick
- Context docs are teaching source, not pasted copyrighted pages — rewrite into original lesson copy
