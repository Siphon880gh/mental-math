# AGENTS_LOOP — Continue Milestone

Reusable loop prompt for advancing Mental Math Trainer (REFLEX_CORE) through **all** milestone queues: P0 → post-P0 → later (E7) → advanced (E9), until every ordered milestone is `done`.

Companions: [`.agents/state.json`](./.agents/state.json) · [`IMPLEMENTATION_STORIES.md`](./IMPLEMENTATION_STORIES.md) · [`EPIC_MAP.md`](./EPIC_MAP.md) · [`RESOURCES.md`](./RESOURCES.md) · spec: [`docs/superpowers/specs/2026-09-10-mental-math-trainer-design.md`](./docs/superpowers/specs/2026-09-10-mental-math-trainer-design.md)

Content drain after freeze: [`LOOPS/LOOP-Graph.md`](./LOOPS/LOOP-Graph.md) — **not this file**. Do not mix this loop and the content graph in the same session.

---

## How to run

**Preferred (dynamic — agent self-paces after each tick):**

```text
/loop continue milestones using AGENTS_LOOP-Continue-Milestone.md
```

Prefer **no interval** so each wake continues the next story.

**Before starting**
1. Confirm `.agents/state.json` points at the story you want (`current_milestone_id`, `next_action`).
2. Leave working `npm run dev` alone. Auto-verify is `npm run lint` && `npm run test` && `npm run build`.
3. Stop the loop yourself when you want. Hard-stop on the error budget or Done(global).

**On each tick the agent should**
- Read this file + `.agents/state.json` + the current milestone in `IMPLEMENTATION_STORIES.md`
- Implement one story, auto-verify, update state, continue
- Create/adapt skills under `.agents/skills/*` when work repeats

---

## Milestone queues (in order)

Read from `.agents/state.json` → `milestones`:

| Queue key | When to enter | Contents |
|-----------|---------------|----------|
| `implementation_order` | First | P0 through MVP freeze |
| `post_mvp_order` | After MVP freeze checklist is green | E5.M3, E8.M4, E2.M2, E4.M4 |
| `later_order` | After `post_mvp_order` is fully done | E7 mini-games |
| `advanced_order` | After `later_order` is fully done | E9 CFO packs |

**Never skip a queue.** Finish every id in the current queue before starting the next.

After **Done(global)** on milestones, start content drain:

```text
/loop content graph using LOOPS/LOOP-Graph.md
```

---

## Loop prompt

```markdown
# OBJECTIVE
Advance Mental Math Trainer (REFLEX_CORE) through **every** milestone queue until global Done.

Work queues (strict order), from `.agents/state.json` → `milestones`:
1. `implementation_order` (P0 → MVP freeze)
2. `post_mvp_order` (only after MVP freeze checklist green)
3. `later_order` (E7 mini-games)
4. `advanced_order` (E9 CFO)

**Done (global):** Every milestone id in all four queues is complete, with stories meeting acceptance in `IMPLEMENTATION_STORIES.md`.

**Done (per tick):** Exactly one story advanced to acceptance-pass, or one error-recovery round completed with a clear next action.

# CONTEXT
- State of record: `.agents/state.json`
- Story + acceptance: `IMPLEMENTATION_STORIES.md`
- Product map: `EPIC_MAP.md`, `RESOURCES.md`, spec under `docs/superpowers/specs/`
- Execution: one milestone `in_progress` at a time; follow the active queue; do not invent milestones
- Auto-verify: `npm run lint` && `npm run test` && `npm run build`
- Optional skills: `.agents/skills/*`
- familyId is the problem-type join key; resource type is separate; tracks A/B live on the Guides hub
- Guide → Coach uses the same slug; do not restore Archive as a learner surface
- No runtime LLM; SAMPLE numbers; do not paste `context/docs` verbatim

# STEP-BY-STEP CADENCE
1. **Orient**
   - Read `.agents/state.json` and the current milestone in `IMPLEMENTATION_STORIES.md`.
   - Pick the active queue (first with unfinished ids). Else Done(global) → STOP and tell the human to run `LOOPS/LOOP-Graph.md`.
   - Identify the single next unfinished story (e.g. `E1.M1.S1`). Do not skip ahead inside a queue.

2. **Implement the current story only**
   - Minimal changes that satisfy that story’s Acceptance column.
   - Prefer extending registries / existing patterns.
   - Scaffold Vite/React only if `package.json` is missing (first P0 stories).
   - For E8: decision graphs only; no LLM.
   - For E7: skip families with no distinct mechanic.
   - For E9: do not replace Beginner Reflex Path unlocks.

3. **Automatic verification (required before marking progress)**
   - Run `npm run lint` then `npm run test` then `npm run build`.
   - Check story Acceptance + global definition of done.

4. **On PASS**
   - Update `.agents/state.json`: story/milestone progress, `next_action`, `last_updated_iso`.
   - Update Status columns in `IMPLEMENTATION_STORIES.md` when a milestone flips.
   - Continue to the next story; when a queue finishes, enter the next automatically.
   - After `E6.M1`, mark `P0_MVP_FREEZE` only if the freeze checklist in IMPLEMENTATION_STORIES is green.

5. **On FAIL (lint/test/build/acceptance)**
   - Error-fix mode; max **10** fix rounds; then Error Handoff Summary.

6. **Skills**
   - If “add trick / drill item / case / coaching session” repeats, add `.agents/skills/<name>/SKILL.md`.

# VERIFICATION RUBRIC
PASS only if ALL are true:
- [ ] Story Acceptance criteria met
- [ ] lint, test, build exit 0
- [ ] No scope creep beyond the current story
- [ ] `.agents/state.json` next_action points at the real next story
- [ ] familyId set on new content rows

# STOP CONDITIONS
- Done(global) → STOP; next human command is the content graph.
- Error budget 10 → handoff (epic, milestone, story, stderr, files, suspected cause).
- Human verification: ambiguous UX not locked in spec/EPIC_MAP; paid APIs (none expected).
- Abort: unrelated major upgrades; deleting progress keys; mixing LOOPS/ graph in this session.
- MVP freeze gate: do not enter `post_mvp_order` until freeze checklist is green.

# TICK OUTPUT (keep short)
1. milestone/story (+ queue)
2. PASS | FIXING (n/10) | STOP
3. Commands + exit status
4. next_action
5. Skills created/updated (paths only), if any
```
