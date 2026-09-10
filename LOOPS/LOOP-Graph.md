# LOOP — Graph (which section loop next)

Orchestrator for the six section content loops. One `/loop` session; this file **picks** which section loop to execute each tick. Authoring rules always come from the chosen section file — this file does not invent guides, drills, games, cases, or sessions.

Companions: [`README.md`](./README.md) · [`LOOP-Guides.md`](./LOOP-Guides.md) · [`LOOP-Coach.md`](./LOOP-Coach.md) · [`LOOP-Drills.md`](./LOOP-Drills.md) · [`LOOP-Games.md`](./LOOP-Games.md) · [`LOOP-Cases.md`](./LOOP-Cases.md) · [`LOOP-Home.md`](./LOOP-Home.md)

[`LOOP-Archive.md`](./LOOP-Archive.md) is retired. Shortcuts live on Guides. `/archive` redirects to `/guides`.

Requires **MVP freeze** (runtime exists). If P0 is incomplete, stop and use [`AGENTS_LOOP-Continue-Milestone.md`](../AGENTS_LOOP-Continue-Milestone.md) instead.

---

## How to run

```text
/loop content graph using LOOPS/LOOP-Graph.md
```

```text
/loop content graph using LOOPS/LOOP-Graph.md policy=DRAIN
/loop content graph using LOOPS/LOOP-Graph.md policy=ECHO
```

**Default policy: `FOUNDATION_THEN_ECHO`.** Drain Guides (Track A then Track B), then **pair each guide with its coach**, then walk remaining family echo chains, then drain leftover floors.

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` && `npm run test` && `npm run build`.
2. Stop yourself anytime; hard-stop on the error budget or Done(graph).
3. Do not also start a single-section `/loop` or the milestone loop in the same session.

---

## Policies

| Policy | When to use | Rule |
|--------|-------------|------|
| **`FOUNDATION_THEN_ECHO`** *(default)* | Normal exhaustive pass | Stage 0 drain Guides. Stage 1 pair Coach (one tree per guide). Stage 2 echo remaining hops. Stage 3 leftover floors. |
| **`DRAIN`** | Finish one surface before another | Stay on one section file until Done(section). Then next node in drain order. |
| **`ECHO`** | Keep related teaching in lockstep from tick 1 | No foundation drain. Each PASS follows the echo edge for the `familyId` just shipped. |

Do not mix policies mid-run unless the human names a new one.

**Required pair:** Guide → Coach on the same slug. If unpaired guides exist after Stage 0, Stage 1 is exclusive Coach ticks (Track A families first, then Track B). Do not author more guides while unpaired coaches remain, except a second distinct guide that LOOP-Guides itself requires.

---

## Nodes (section loops)

| Node | File | Unit per tick |
|------|------|----------------|
| Guides | `LOOP-Guides.md` | 1 guide |
| Coach | `LOOP-Coach.md` | 1 coaching session (slug = familyId) |
| Drills | `LOOP-Drills.md` | 1 drill item (or 1 new group + first item) |
| Games | `LOOP-Games.md` | 1 game **or** 1 skip |
| Cases | `LOOP-Cases.md` | 1 case |
| Home | `LOOP-Home.md` | 1 copy cluster |

---

## Drain order

Used by `DRAIN`, and by Stage 0 / Stage 3 of `FOUNDATION_THEN_ECHO`.

```text
Guides → Coach → Drills → Games → Cases → Home
```

Why this order:

1. **Guides** — one hub, Track A then Track B. Shortcut + principle live here.
2. **Coach** — step-by-step tree for each guide (same slug). Pair before more drill volume.
3. **Drills** — Track A path banks before cases that assume the shortcut.
4. **Games** — only when a mechanic exists; skips are cheap.
5. **Cases** — Track B conversation after fluency content exists.
6. **Home** — tips that **name** slugs that already exist.

Never skip a node in `DRAIN` while it is short of its own Done(section). Games may Done early via skips — that still counts as Done(games) when the mechanic table is exhausted.

If Games runtime (E7) is missing, **park** Games: treat as Done(games) for graph purposes and note `parked: e7_missing` in tick output. Do not scaffold E7 inside a content tick.

If Coach runtime (E8) is missing, **park** Coach only until E8.M1–M3 ship; then Stage 1 pairing is mandatory.

---

## Echo families (similar resource hops)

A **family** is one `familyId` expressed on several surfaces. After a PASS, hop to the next **unfilled** hop in that family’s chain.

Walk **Track A first**, then Track B:

| # | familyId | Track | Typical chain (skip missing hops) |
|---|----------|-------|-------------------------------------|
| 1 | `anchors` | A | Guide → Coach → Drill(`anchors`) → Home |
| 2 | `magnitude` | A | Guide → Coach → Drill(`magnitude`) → Game (shifter) → Home |
| 3 | `percent-shift` | A | Guide → Coach → Drill(`percents`) → Game → Home |
| 4 | `percent-reversible` | A | Guide → Coach → Drill(`percents`) → Game (swap) → Home |
| 5 | `percent-tens` | A | Guide → Coach → Drill(`percents`) → Home |
| 6 | `percent-chunks` | A | Guide → Coach → Drill(`percents`) → Game (chips) → Home |
| 7 | `percent-tip` | A | Guide → Coach → Drill(`percents`) → Home |
| 8 | `div-by-5` | A | Guide → Coach → Drill(`conversions`) → Home |
| 9 | `hour-month` | A | Guide → Coach → Drill(`conversions`) → Cases(`stacked-founder` infra) → Home |
| 10 | `month-day` | A | Guide → Coach → Drill(`conversions`) → Home |
| 11 | `month-year` | A | Guide → Coach → Drill(`conversions`) → Home |
| 12 | `break-even` | A | Guide → Coach → Drill(`break-even`) → Cases(break_even) → Home |
| 13 | `markup` | A | Guide → Coach → Drill(`break-even`) → Cases(markup_read) → Home |
| 14 | `left-to-right` | A | Guide → Coach → Drill(`foundations`) → Home |
| 15 | `round-compensate` | A | same, Drill(`foundations`) |
| 16 | `double-half` | A | same |
| 17 | `multiply-near` | A | same |
| 18 | `fraction-percent` | A | same |
| 19 | `rule-of-72` | A | same |
| 20 | `stacked-founder` | B | Guide → Coach → Cases pack fill → Home |
| 21 | `cfo-feasibility` | B | Guide → Coach → Drill(Phase D) → Cases pack → Home |
| 22 | `cfo-unit-econ` | B | same |
| 23 | `cfo-runway` | B | same |
| 24 | `cfo-growth` | B | same |
| 25 | `mrr-arr` | B | Guide → Coach → Drill(`startup`) → Home |
| 26 | `churn` | B | Guide → Coach → Drill(`startup`) → Home |
| 27 | `nrr` | B | Guide → Coach → Cases(`startup-people-capital`) → Home |
| 28 | `rule-of-40` | B | Guide → Coach → Cases(`startup-efficiency`) → Home |
| 29 | `burn-multiple` | B | … → Cases(`startup-efficiency`) |
| 30 | `cac-payback` | B | … → Cases(`startup-efficiency`) |
| 31 | `take-rate` | B | … → Cases(`startup-marketplace`) |
| 32 | `processing-fees` | B | … → Cases(`startup-marketplace`) |
| 33 | `fully-loaded` | B | … → Cases(`startup-people-capital`) |
| 34 | `dilution` | B | … → Cases(`startup-people-capital`) |
| 35 | `tam-fermi` | B | … → Cases(`startup-people-capital`) |

**Echo edge rules**

- First hop after a new guide is always **Coach** (same slug) if that session is missing.
- One hop = one tick = one unit in the **target** section file.
- Drills Phase D (`cfo-*` groups) and Phase E (`foundations` / `startup`) only after earlier drill floors — park extra families until then unless policy is pure `ECHO` (then still follow Drills’ own queue if the hop is illegal).
- Cases pack order (`stacked-founder` before CFO packs before startup-* packs) still binds Cases ticks.
- Games hops: if the family is skip-only, record skip and continue the chain.
- Home hops only after the named surface exists.

---

## Stage machine (`FOUNDATION_THEN_ECHO`)

```text
Stage 0  DRAIN Guides until Done(guides) — Track A families first, then Track B
Stage 1  PAIR Coach: exclusive coach ticks until every guide slug has a session
         (Track A then Track B). Skip families that already have a tree.
Stage 2  ECHO families 1 → 35 (remaining hops: drill / game / case / home)
Stage 3  DRAIN leftover section floors in drain order
         (Drills → Games → Cases → Home)
Done(graph) when every section file’s Done(section) is true
```

If Stage 0 is already met (every family has a guide), start at Stage 1.

Stage 2 may complete some floors early. Stage 3 only fills gaps.

---

## Per-tick algorithm

1. **Read** this file + the six section files’ coverage queues (do not trust stale counts).
2. **Policy** — default `FOUNDATION_THEN_ECHO`; honor `policy=` from the user line.
3. **Pick target**
   - `DRAIN`: first node in drain order that is not Done(section).
   - `ECHO`: current family + next unfilled hop; if none, next family; if none, drain leftovers.
   - `FOUNDATION_THEN_ECHO`: Stage 0–3 as above. Remember `stage`, `family_id`, and `last_unit` across ticks (chat state is enough).
4. **Execute** the target section’s **Loop prompt** for **one** unit.
5. **On PASS** — record `{ loop, family_id, unit_id, next_hop }`.
6. **On FAIL** — stay on the **same** section loop; consume that loop’s 10-round budget. Graph error budget is the same 10 rounds on the blocking failure.
7. **Done(graph)** — all six Done(section) → STOP with a per-node tally.

---

## Loop prompt

```markdown
# OBJECTIVE
Run the six LOOPS/ section content loops as one graph until every section’s Done(section) is true.

**Done (graph):** Guides, Coach, Drills, Games, Cases, and Home coverage floors all met per their files.

**Done (per tick):** Exactly one content unit in **one** section loop, chosen by the policy’s picker, verified with that section’s rubric.

# CONTEXT
- Picker + families: `LOOPS/LOOP-Graph.md`
- Authoring: only the chosen `LOOPS/LOOP-*.md`
- Shared: SAMPLE; original copy from context docs; familyId join key; tracks A/B on Guides; Guide→Coach same slug; Beginner unlocks unchanged; one unit per tick
- Auto-verify: `npm run lint` && `npm run test` && `npm run build`
- Policy default: FOUNDATION_THEN_ECHO
- If MVP freeze is not green: STOP and run AGENTS_LOOP-Continue-Milestone.md instead
- Do not restore `/archive` as a learner surface

# STEP-BY-STEP CADENCE
1. **Orient** — inventory counts from source; determine stage/family; pick target loop + gap.
2. **Announce** which loop and why (drain node vs coach pair vs echo hop vs leftover).
3. **Author** using that section file’s cadence only.
4. **Verify** using that section’s rubric + lint/test/build.
5. **On PASS** — compute next hop (echo) or stay (drain until Done(section)). Unpaired guide → next_hop Coach.
6. **On FAIL** — same section; max 10 rounds → Error Handoff Summary (include graph stage/family).
7. **Do not** start a second section unit in the same tick after PASS unless time remains **and** you re-run the picker (still one unit).

# VERIFICATION RUBRIC
PASS only if:
- [ ] Picker chose a legal target
- [ ] Section rubric for that loop also PASSes
- [ ] No unlock/schema drift; no pasted context docs; tracks labeled A/B
- [ ] lint + test + build 0

# STOP CONDITIONS
- Done(graph) → STOP with per-section floors vs counts.
- Error budget 10 on the blocking unit → handoff (stage, family, loop, id, stderr).
- Human verification: policy change; new familyId not in RESOURCES.
- Abort: running two section loops without the picker; rewriting runtime “for cleanup”; running milestone loop in the same session; adding an Archive nav.

# TICK OUTPUT (keep short)
1. policy + stage (if any) + family_id (if any) + track (A or B)
2. target loop + unit id
3. why this loop (guides drain | coach pair | echo hop from X | leftover drain)
4. PASS | FIXING (n/10) | STOP
5. next_hop (loop + family) or Done(section) / Done(graph)
6. lint/test/build status
```

---

## Authoring notes

- Section files still say “stop at Done(section).” Under the graph, that is **not** a process stop unless policy is `DRAIN` and you just finished that node — continue to the next node/family.
- Cases pack order still binds Cases ticks.
- Drills A–C before Phase D even in `ECHO`.
- Home is last in drain order so copy can name real ids.
- Milestone `AGENTS_LOOP-*.md` files are out of this graph.
- Track A drills still gate Track B graded cases. Content order does not change unlocks.
