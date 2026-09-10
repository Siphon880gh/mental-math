---
name: add-coaching-session
description: >-
  Add one Mental Math Trainer step-by-step coaching tree for a guide slug.
  Use when authoring or pairing `/coach/:slug` with a guide / familyId.
---

# Add a coaching session

One valid decision graph per guide. Slug = `familyId` = guide slug. No runtime LLM.

## Files

- New: `src/lib/coaching/sessions/<slug>.ts`
- Spec copy: `src/lib/coaching/sessions/specs.ts` (`SESSION_SPECS` + `specBySlug`)
- Register default export in `src/lib/coaching/sessions/index.ts`

## Shape

Use `buildMethodTree` from `src/lib/coaching/buildMethodTree.ts`.

Minimum: `start` + two more continue layers, ≥2 `wrong` nodes with `rewind_to`, ≥1 `success` with empty choices.

`meta.familyId` = slug. Tags must include `beginner` or `intermediate`. First message is a SAMPLE setup. Teach **which shortcut to pick**, not a quiz restated as buttons.

Wrong nodes: explanation + empty `choices` + `rewind_to` back to the continue layer.

## Verify

`validateSession` must pass. Then `npm run lint` && `npm run test` && `npm run build`.

Guide CTA `/coach/<slug>` should play the tree, not show “not authored yet.”
