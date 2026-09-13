# LOOPS — section content loops

Reusable `/loop` prompts that deepen **content** per app section. Runtime and milestone queues stay in [`AGENTS_LOOP-Continue-Milestone.md`](../AGENTS_LOOP-Continue-Milestone.md). These loops assume P0 runtime already exists (MVP freeze green).

**Preferred for first-pass exhaustive content:** one graph session that picks the next section each tick — [`LOOP-Graph.md`](./LOOP-Graph.md). Default policy drains **Guides** (Track A then Track B), then **pairs each guide with its coach**, then echoes remaining hops, then drains leftovers.

```text
/loop content graph using LOOPS/LOOP-Graph.md
```

To pin a policy: `policy=DRAIN` or `policy=ECHO`. Default is `FOUNDATION_THEN_ECHO`.

Catalog import from [`context/docs-more-more/more-tricks.md`](../context/docs-more-more/more-tricks.md) is a **separate** pair of loops. Drain incorporate to Done, then audit. Do not run them in the same session as the graph or a section loop.

```text
/loop exhaustive more-tricks incorporate using LOOPS/LOOP-More-Tricks.md
/loop exhaustive more-tricks audit using LOOPS/LOOP-More-Tricks-Audit.md
```

To run a **single** section instead, use that file only. Do not start the graph and a section loop in the same session.

## How to run (one section)

Preferred (dynamic — agent self-paces after each tick):

```text
/loop exhaustive Drills content using LOOPS/LOOP-Drills.md
```

| Section (nav / route) | Loop file | `/loop` line |
|-----------------------|-----------|--------------|
| **Graph (all sections)** | [`LOOP-Graph.md`](./LOOP-Graph.md) | `/loop content graph using LOOPS/LOOP-Graph.md` |
| Guides `/guides` | [`LOOP-Guides.md`](./LOOP-Guides.md) | `/loop exhaustive Guides content using LOOPS/LOOP-Guides.md` |
| Coach `/coach/:slug` | [`LOOP-Coach.md`](./LOOP-Coach.md) | `/loop exhaustive Coach content using LOOPS/LOOP-Coach.md` |
| Drills `/drills` | [`LOOP-Drills.md`](./LOOP-Drills.md) | `/loop exhaustive Drills content using LOOPS/LOOP-Drills.md` |
| Games `/games` | [`LOOP-Games.md`](./LOOP-Games.md) | `/loop exhaustive Games content using LOOPS/LOOP-Games.md` |
| Cases `/cases` | [`LOOP-Cases.md`](./LOOP-Cases.md) | `/loop exhaustive Cases content using LOOPS/LOOP-Cases.md` |
| Home `/` | [`LOOP-Home.md`](./LOOP-Home.md) | `/loop exhaustive Home content using LOOPS/LOOP-Home.md` |
| **more-tricks incorporate** | [`LOOP-More-Tricks.md`](./LOOP-More-Tricks.md) | `/loop exhaustive more-tricks incorporate using LOOPS/LOOP-More-Tricks.md` |
| **more-tricks audit** | [`LOOP-More-Tricks-Audit.md`](./LOOP-More-Tricks-Audit.md) | `/loop exhaustive more-tricks audit using LOOPS/LOOP-More-Tricks-Audit.md` |

Archive is retired. See [`LOOP-Archive.md`](./LOOP-Archive.md). Do not restore it as a second literacy list.

Prefer **no interval** so each wake adds the next content unit.

**Before starting**
1. Leave working `composer serve` / `php -S` alone. Verify with `./vendor/bin/phpunit`.
2. Stop the loop yourself when you want. Hard-stop on the error budget or Done(section).
3. Do not run [`AGENTS_LOOP-Continue-Milestone.md`](../AGENTS_LOOP-Continue-Milestone.md) in the same session.

## Shared rules (every section)

- SAMPLE / educational numbers only. No calculator chrome on drill/case screens.
- Rewrite from `context/docs/_Biz Math/` — do not paste those files verbatim.
- `familyId` is the problem-type join key. Do not invent a parallel enum.
- **Track A** = quick math for business and everyday life. **Track B** = stakeholder discussion and planning math. Label both on Guides.
- Guide → Coach uses the **same slug**.
- One content unit per tick.
- Distinct items: do not clone-and-tweak a prompt with a renamed title.
- Thought chains teach the **shape**, not long division.
- After any code change: `./vendor/bin/phpunit`.
- Create or adapt `.agents/skills/*` when the same authoring workflow repeats.
- Do not change Beginner Reflex Path unlock order.

## Not these files

Milestone delivery (P0 → E9) stays in [`AGENTS_LOOP-Continue-Milestone.md`](../AGENTS_LOOP-Continue-Milestone.md).
