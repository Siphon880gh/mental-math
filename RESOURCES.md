# Resource types

A **resource** is a teaching unit the learner can open. Guides, timed drills, mini-games, step-by-step sessions, and cases are resources. A **shortcut** (rule + example from `data/tricks.json`) is not its own nav surface — it lives on the matching guide.

**Not resources:** the Beginner Reflex Path, Dashboard chrome, and nav. Those find or sequence resources.

All numbers are **SAMPLE / educational**. This is not a calculator, brokerage, or live-market product.

Problem type is `familyId` (what you calculate). **Track** is which conversation the family belongs to. Cognitive ability is the **resource type** (how you practice). Same `familyId` should echo across types — see [`LOOPS/LOOP-Graph.md`](./LOOPS/LOOP-Graph.md).

---

## Tracks

One **Guides** hub. Two tracks. Every guide has a step-by-step coach on the **same slug**.

| Track | Label | What it trains |
|-------|--------|----------------|
| **A** `quick` | Quick math for business and everyday life | Shortcuts you run in your head: percents, zeros, time-money, break-even arithmetic, extra foundations |
| **B** `stakeholder` | Business and entrepreneurship stakeholder discussion and planning math | Numbers you use in a planning discussion: stacked infra, CFO smell tests, NRR, dilution, TAM. Cases live primarily here |

Track A fluency still gates Track B **graded** cases (Beginner Reflex Path unlock order is unchanged).

**Track A families:** `P0_FAMILY_IDS` plus `EXTRA_MENTAL_FAMILY_IDS` (`app/Catalog/Tracks.php`) including 80/20, the revenue triangle, and the more-tricks arithmetic families (divisibility, complements, difference of squares, …).

**Track B families:** `stacked-founder`, `cfo-*`, `EXTRA_STARTUP_FAMILY_IDS`, plus `EXTRA_OPERATOR_FAMILY_IDS` (concurrency, capacity, box contribution, 70% utilization, estimate pad, funnel bands).

---

## Catalog

| Type | What the learner does | Route | Registry |
|------|------------------------|-------|----------|
| **Guide** | Read the shortcut + why it works; open the coach | `/guides`, `/guides/:slug` | `app/Catalog/Guides.php` + `data/inline-guides.json` + `data/guide-specs.json` |
| **Step-by-step** | Walk a method tree: wrong → explain → rewind → success | `/coach/:slug` (same slug as the guide) | `data/coaching/` |
| **Drill** | Answer a timed bank (type or MCQ) | `/drills/:groupId` | `data/drills.json` |
| **Mini-game** | Play one mechanic | `/games/:slug` | `data/games.json` + `public/assets/js/games.js` |
| **Case** | Hear a conversation prompt, commit a number, reveal the chain | `/cases/:caseId` | `data/cases.json` |

`/archive` redirects to `/track-a`. Do not restore Archive as a second literacy list.

Path milestones point at resources with `contentRefs` such as `guide:percent-reversible`, `drill:percents`, `game:decimal-shift`, `coach:percent-shift`, `cases:stacked-founder` (`app/Catalog/LearningPaths.php`). Prefer `guide:` over a separate `trick:` ref.

---

## Guide (hub)

A **guide** is the literacy page: `slug` (= `familyId`), `track`, shortcut (from `data/tricks.json`), principle `body`, and a coach CTA (`relatedCoachSlug` = same slug).

Extra families load `body` from `context/docs-more/`. P0 and CFO families use original inline lessons in `data/inline-guides.json`.

If the coach tree is not authored yet, the CTA still opens `/coach/:slug` with a “not authored yet” state. Do not 404.

Chrome may also link `relatedDrillGroup` / `relatedCaseId` / `relatedGameSlug` when those resources exist.

---

## Shortcut (on the guide)

A **shortcut** is a lookup row: name, `familyId`, one-line rule, worked example. Stored in `data/tricks.json`. Rendered on `/guides/:slug`. Extra rows for the same family deepen the same page — they are not a second nav.

---

## Drill

A **drill group** is a timed bank. Finishing path groups writes progress. Extra groups do not unlock the path.

**Item shapes**

- Numeric entry (users, dollars, percents)
- Multiple choice when the skill is “which shortcut” not “what number”
- Optional `trickId` / `familyId` deep-link back to the guide after reveal

**Grade** (see spec): exact / close / incorrect, plus thought-chain reveal. Timer records latency; fluency gate uses latency + accuracy, not accuracy alone.

**Path / gate groups** (P0, Track A):

| Group id | Families |
|----------|----------|
| `anchors` | `anchors` |
| `magnitude` | `magnitude` |
| `percents` | `percent-shift`, `percent-reversible`, `percent-tens`, `percent-chunks`, `percent-tip` |
| `conversions` | `div-by-5`, `hour-month`, `month-day`, `month-year` |
| `break-even` | `break-even`, `markup` |

Post-P0 extra: Track B drill groups `cfo-feasibility`, `cfo-unit-econ`, `cfo-runway`, `cfo-growth`, then `foundations` (left-to-right … regroup-factors), `startup` (mrr-arr … tam-fermi), and `operator` (concurrency … funnel-bands).

---

## Mini-game

A **mini-game** teaches **one** interactive mechanic. Skip a family if the mechanic would just be another numeric drill.

Examples: decimal-place shifter; swap percent ↔ base (reversible); chunk adder (10% + 10% + 5%).

Authoring: `.agents/skills/add-mini-game` when that skill exists. Register in `data/games.json` and `public/assets/js/games.js`.

---

## Step-by-step

Coach (`/coach/:slug`) is a **deterministic decision graph** (no runtime LLM). **One tree per guide.** Slug matches the guide / `familyId`.

Each session has `meta` (`slug`, `title`, `summary`, `familyId`, `tags`) and nodes:

- `continue` — next decision (which shortcut, which reduction)
- `wrong` — explanation plus `rewind_to`
- `success` — session complete

P0 ships runtime + one Track A tree (`percent-shift`). `LOOPS/LOOP-Coach.md` pairs the rest, Track A then Track B.

Authoring: `.agents/skills/add-coaching-session` when that skill exists.

---

## Case

Cases are **decide-and-reveal for a number**, not BUY/SELL/HOLD. They belong primarily to **Track B** (planning talk), using Track A shortcuts inside the chain.

| Field | Role |
|-------|------|
| `familyId` | Primary trick the case exercises (often `stacked-founder` plus supporting families) |
| `thinkingMode` | `break_even`, `infra_chain`, `conversion_funnel`, `markup_read`, `smell_test`, `runway`, `ltv_cac`, `growth_claim`, `nrr_read`, `rule_of_40`, `burn_multiple`, `payback`, `take_rate`, `fees`, `loaded_cost`, `dilution`, `tam_fermi` |
| `prompt` | What the other person said (conversation) |
| `expectedAnswer` | Number (and unit) |
| `thoughtChain` | The taught steps (reveal after submit) |
| `difficulty` | `beginner` · `intermediate` |
| `packId` | Library grouping |

**Packs:** `stacked-founder` (P0), then `cfo-feasibility`, `cfo-unit-econ`, `cfo-runway`, `cfo-growth`, then docs-more packs `startup-efficiency` (rule of 40, burn, payback), `startup-marketplace` (take rate, fees), `startup-people-capital` (loaded cost, dilution, TAM).

Debriefs teach **process** (which shape you should have seen), not “the spreadsheet says.”

---

## How types combine

```text
Guide (+ shortcut)  →  Step-by-step coach (same slug)  →  Drill  →  Mini-game (optional)  →  Case
familyId is the join key on every row
track (A or B) is labeled on the guide
```

Do not invent a new panel type to wire a family. Add a registry row the existing player already understands. Do not split literacy across Archive and Guides.
