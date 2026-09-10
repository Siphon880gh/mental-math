# Mental Math Trainer (REFLEX_CORE) — Epic Map

Living product map for AI-assisted incremental delivery.  
Companions: [`IMPLEMENTATION_STORIES.md`](./IMPLEMENTATION_STORIES.md) · [`.agents/state.json`](./.agents/state.json) · [`RESOURCES.md`](./RESOURCES.md) · [`docs/superpowers/specs/2026-09-10-mental-math-trainer-design.md`](./docs/superpowers/specs/2026-09-10-mental-math-trainer-design.md)

| Field | Value |
|--------|--------|
| **Status** | E0 complete · E1.M1 + E3.M1 done · next E4.M1 |
| **Platform** | Web (React 19 + Vite + TypeScript) |
| **Primary learner** | Founder / operator who must calculate during conversation |
| **Curriculum principle** | Recognize number shapes, then scale; Guides (Track A then Track B) + coach per guide; literacy before graded conversation cases |
| **Finalize** | Approach A — fluency-first trainer + soft timed gate + MVP freeze; content drain via `LOOPS/` after runtime |

---

## App summary

| Field | Value |
|--------|--------|
| **App name** | Mental Math Trainer (REFLEX_CORE) |
| **One-liner** | Two-track Guides hub (quick everyday math vs stakeholder planning math), each with a step-by-step coach; Beginner path still anchors → percents → conversions → gate → stacked cases |
| **Success signal** | Learner completes Beginner Reflex Path with persisted progress; answers without a calculator; then deepens via echoed families and CFO packs |

---

## Scope

### MVP (P0 — playable Beginner Reflex Path)

- Family catalog (`familyId` + track A/B) with shortcuts rendered on Guides
- One Guides hub (no Archive nav); Track A and Track B labeled in full
- Timed drill engine (numeric + MCQ, thought-chain reveal)
- Guides for every P0 family plus extras; coach CTA on the same slug
- Fluency soft-gate: percents + conversions timed pass before graded Track B cases
- Case engine: conversation → number → reveal chain
- Thin stacked-founder pack (≥3 cases)
- One percent step-by-step session (schema + runtime + one tree); remaining trees via loops
- Fixed Beginner Reflex Path + progress + unlocks
- Dashboard wired to real next action (not decorative %)

### Post-MVP

- Mini-games for families that have one mechanic (E7)
- Step-by-step library across remaining families (E8)
- Case volume + thinking modes (E5 scale)
- CFO packs and extra Operator path (E9)
- Goal intake / second path (E2.M2)

### Constraints

- Client-first SPA; curated SAMPLE numbers (no live APIs)
- Progress in `localStorage` (`reflex_core_progress_v1`); no auth in MVP
- Step coaching = deterministic graphs only — no runtime LLM
- Context markdown is source of ideas; rewrite lessons (do not paste docs verbatim)
- `familyId` is the problem-type join key; resource type is the cognitive mode
- Do not skip P0 order without updating `.agents/state.json`

---

## Beginner learning order (user-facing)

1. Number anchors (instant facts)
2. Magnitude / zeros
3. Percent shortcuts
4. Time-money conversions and ÷5
5. Break-even and markup
6. Timed fluency gate
7. Stacked founder conversation cases
8. CFO smell tests *(post-MVP)*

---

## User needs

| Kind | Needs |
|------|--------|
| **Use** | 5-minute drills; typed answers; conversation cases that feel like a pitch room |
| **Usability** | Fast loop; works offline on bundled content; next action always obvious |
| **Meaning** | Pattern recognition, not school worksheets |
| **Social** | Path complete feels like a credential |

---

## Flows

- **First-run:** Beginner Reflex Path → Home with Anchors unlocked
- **Primary loop:** Next milestone → guide (with coach) / drill → score → unlock
- **Case loop:** Conversation prompt → commit number → thought chain + grade (Track B)
- **Coaching loop:** Guide → same-slug tree → choice nodes → wrong rewind → success
- **Errors:** Corrupt progress → reset; locked → show prerequisite; unknown slug → home

---

## State & persistence

| Layer | Contents |
|--------|-----------|
| Persisted business | Path, milestone status, drill/case scores, accuracy, median latency, streaks |
| Persisted prefs | Active path ID |
| Temporary UI | Drill index, timer, coach history |
| Offline | Bundled guides (with shortcuts), drills, cases, trees |

**UI states:** empty path · error · success (milestone complete) · first-run · locked · path complete

---

## Epic list

| ID | Name | Goal / outcome | Priority | Status |
|----|------|----------------|----------|--------|
| E0 | Planning & Decisions | Spec, epics, loops, agent state | Mandatory | Complete |
| E1 | Family catalog | Stable `familyId` + track A/B + shortcut rows on Guides | MVP | Complete |
| E2 | Learning path planner | Fixed Beginner path; Operator path later | MVP (thin) | todo |
| E3 | Progress & unlocks | Resume-able progress + fluency gate flags | MVP | in_progress |
| E4 | Guides, drills, fluency gate | Two-track Guides hub + ladder drills + timed gate | MVP | todo |
| E5 | Conversation cases | Engine + thin stacked-founder pack | MVP | todo |
| E6 | Dashboard | Home = real path + next CTA | MVP | todo |
| E7 | Mini-games | One-mechanic playables | Later | todo |
| E8 | Step-by-step coaching | One coach per guide (same slug); thin tree in P0 | MVP thin + later library | todo |
| E9 | CFO / advanced packs | Ceiling, LTV, runway, growth | Advanced | todo |

---

## Epic details

### E0. Planning & Decisions

- **Includes:** This map, stories, spec, `RESOURCES.md`, `LOOPS/`, `AGENTS_LOOP-Continue-Milestone.md`, `.agents/state.json`
- **Out of scope:** Product code

### E1. Family catalog

- **Goal:** Every P0 `familyId` has a stable id, a track, and a shortcut row the Guides page can join on
- **Includes:** `FamilyId` union; `Trick` type; seed ≥1 shortcut per P0 family; tracks in `src/lib/tracks.ts`
- **Out of scope:** A separate Archive nav (retired)

### E2. Learning path planner

- **P0:** Beginner Reflex Path template with frozen milestone IDs + `contentRefs`
- **Post:** Operator / CFO path + optional goal picker
- **Out of scope:** LMS admin, social sharing

### E3. Progress & unlocks

- **Includes:** `ProgressStore`, schema version, corrupt reset, unlock graph, drill/case writeback, path reset
- **Fluency gate:** `percents` and `conversions` groups must meet accuracy **and** latency thresholds before `cases:stacked-founder` unlocks
- **Out of scope:** Cloud sync

### E4. Guides, drills, fluency gate

- **Includes:** Two-track Guides hub (`/guides`); shortcut + coach CTA on each slug; drill engine; path groups `anchors` `magnitude` `percents` `conversions` `break-even`; E4.M0 gate wiring
- **Out of scope:** Mini-games (E7); CFO drill groups (E9); restoring Archive as a second list

### E5. Conversation cases

- **Mechanics:** Prompt → answer → reveal `thoughtChain` + grade
- **P0 pack:** `stacked-founder` ≥3 beginner cases (`infra_chain`, `break_even`, `conversion_funnel`)
- **Post:** Scale library + CFO packs
- **Out of scope:** Live pitch audio; predicting real businesses

### E6. Dashboard

- **Goal:** Next CTA names the real group/pack/slug
- **Out of scope:** Chatbot

### E7. Mini-games *(Later)*

- Registry + host page + games only when a family has a distinct mechanic
- Optional path links; never replace drills

### E8. Step-by-step coaching

- **P0 (E8.M1–M3):** schema, nav, **one** `percent-shift` session playable from that guide
- **Post / loops:** one tree per remaining **guide** (Track A then Track B) via `LOOPS/LOOP-Coach.md`
- **Out of scope:** Runtime LLM; a coach catalog that is a second literacy hub (reach coaches from Guides)

### E9. CFO / advanced *(Advanced)*

- Families `cfo-*` plus docs-more extras (`EXTRA_FAMILY_IDS`: Track A foundations + Track B startup metrics); extra drill groups; startup case packs; Operator path wiring
- **Out of scope:** Replacing Beginner unlocks

---

## Implementation order (milestones)

See [`IMPLEMENTATION_STORIES.md`](./IMPLEMENTATION_STORIES.md).

### P0 — MVP freeze

```
E1.M1 → E3.M1 → E4.M1 → E4.M2 → E4.M3 → E4.M0
  → E5.M1 → E5.M2 → E8.M1 → E8.M2 → E8.M3
  → E2.M1 → E3.M2 → E6.M1
── MVP FREEZE: path complete credential ──
```

**Rationale:** Catalog + path IDs → teach L1–L4 → timed gate → case engine + thin cases → one coaching tree so guides/cases/step-by-step all exist → path metadata → unlocks → dashboard.

### Post-P0 — skill depth (`post_mvp_order`)

```
E5.M3 (scale stacked cases) → E8.M4 (coach library floor)
  → E2.M2 (Operator path) → E4.M4 (extra drill volume on path groups)
```

### Later — mini-games (`later_order`)

```
E7.M1 (registry + host + 1 game) → E7.M2 (games for remaining mechanic families)
```

### Advanced — CFO (`advanced_order`)

```
E9.M1 (cfo shortcuts + drills on Track B guides) → E9.M2 (cfo case packs) → E9.M3 (Operator path cases + Home)
```

---

## Coverage check

| Requirement | Epics |
|-------------|--------|
| familyId + tracks A/B | E1, E4 Guides hub |
| Path + progress | E2, E3, E6 |
| Guides + timed drills + gate | E4 |
| Conversation cases (Track B) | E5 |
| Step-by-step (one per guide) | E8 |
| Mini-games | E7 |
| CFO | E9 |
| Content drain after runtime | `LOOPS/` |

---

## Agent notes

- Do **not** skip ahead of P0 without `.agents/state.json`
- After freeze, continue queues via [`AGENTS_LOOP-Continue-Milestone.md`](./AGENTS_LOOP-Continue-Milestone.md)
- After all milestone queues, drain content with [`LOOPS/LOOP-Graph.md`](./LOOPS/LOOP-Graph.md)
- Never mix a milestone loop and a content graph in the same session
- Process debriefs required on every case
- Coaching sessions are content graphs only
