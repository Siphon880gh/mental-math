# LOOP — Home / Dashboard (exhaustive learner copy)

Deepen Home `/` copy. **Not** a feature-rewrite loop.

Companions: [`src/pages/Dashboard.tsx`](../src/pages/Dashboard.tsx) · [`src/lib/learningPaths.ts`](../src/lib/learningPaths.ts)

---

## How to run

```text
/loop exhaustive Home content using LOOPS/LOOP-Home.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` && `npm run test` && `npm run build`.
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(home).

**On each tick**
- Change **one** learner-facing string cluster.
- Do not change unlock logic, progress keys, or path order.

---

## Coverage queue (strict order)

1. `coachTip` on every Beginner (and Operator, if shipped) milestone — names a real `/drills/…`, `/guides/…`, `/cases/…`, or `/coach/…`. Do not name `/archive`. When naming Guides, say Track A or Track B if the tip is a catalog CTA.
2. Path-complete credential line.
3. Fluency-gate locked copy on Home and Cases entry.
4. First-run empty state (5 minutes, no calculator).
5. Reset-path helper (local only).
6. Tips for thinkingModes that Cases already shipped (one mode per tick until each has a tip).

Skip a row when copy already names the real next surface.

**Done(home):** Rows 1–6 accurate vs current registries.

---

## Loop prompt

```markdown
# OBJECTIVE
Home copy matches shipped resources; no path mechanic changes.

**Done (home):** Coverage rows accurate.

**Done (per tick):** One copy cluster.

# CONTEXT
- Dashboard + learningPaths + any thinking-mode tip map
- Tone: sentence case; SAMPLE honesty; no SNAKE_CASE in UI
- Auto-verify: `npm run lint` && `npm run test` && `npm run build`

# STEP-BY-STEP CADENCE
1. **Orient** — next Coverage row vs source strings.
2. **Edit one cluster** — keep button labels stable if QA depends on them.
3. **Verify** — progress key still `reflex_core_progress_v1`.
4. **On FAIL** — ≤10 rounds.

# VERIFICATION RUBRIC
- [ ] One copy cluster
- [ ] No unlock / schema / route changes
- [ ] Tips do not name missing slugs
- [ ] lint + test + build 0

# STOP CONDITIONS
- Done(home) → STOP.
- Error budget 10 → handoff.
- Abort: GoalPicker behavior change; dropping reset confirm.

# TICK OUTPUT
1. file + which string
2. PASS | FIXING (n/10) | STOP
3. Next row
4. lint/test/build status
```
