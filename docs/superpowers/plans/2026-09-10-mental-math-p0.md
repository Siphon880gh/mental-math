# Mental Math Trainer P0 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Vite/React app and land E1.M1 (trick catalog) plus E3.M1 (progress store + frozen path IDs) so later P0 stories have types and persistence.

**Architecture:** Client SPA. `familyId` is the problem-type join key. Shortcuts live in `src/lib/tricks.ts` and render on Guides. Tracks A/B live in `src/lib/tracks.ts`. Progress is versioned JSON in `localStorage` (`reflex_core_progress_v1`). Remaining P0 stories (drills, cases, coach, dashboard) execute via [`AGENTS_LOOP-Continue-Milestone.md`](../../AGENTS_LOOP-Continue-Milestone.md) using [`IMPLEMENTATION_STORIES.md`](../../IMPLEMENTATION_STORIES.md).

**Tech Stack:** React 19, TypeScript, Vite, React Router 7, Vitest, ESLint.

## Global Constraints

- Progress key is exactly `reflex_core_progress_v1`
- `familyId` is problem type; resource type is a separate route/registry
- No runtime LLM
- SAMPLE / educational numbers only
- Rewrite `context/docs/_Biz Math/` ideas; do not paste those files
- Auto-verify: `npm run lint` && `npm run test` && `npm run build`
- Frozen Beginner milestone IDs: `E4.M1` `E4.M2` `E4.M3` `E4.M0` `E5.M2`

---

### Task 1: Vite + React + Vitest scaffold

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`, `eslint.config.js`, `.gitignore` (extend)
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: none
- Produces: `npm run dev` / `npm run test` / `npm run lint` / `npm run build` scripts

- [ ] **Step 1: Scaffold with Vite**

From repo root (`/Users/wengffung/dev/web/weng/app/math`), create the app in place (do not nest an extra folder). If `package.json` already exists, skip create and only fill missing scripts.

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom eslint
```

- [ ] **Step 2: Wire Vitest in `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Add scripts to `package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 3: Smoke test the root render**

`src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders app title", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByText(/mental math/i)).toBeInTheDocument();
});
```

`src/App.tsx` must include visible text `Mental Math Trainer`.

- [ ] **Step 4: Run test — expect FAIL until App copy exists, then PASS**

```bash
npm run test
```

Expected: PASS.

- [ ] **Step 5: Confirm lint and build**

```bash
npm run lint && npm run build
```

Expected: exit 0.

---

### Task 2: FamilyId + Trick catalog (E1.M1)

**Files:**
- Create: `src/lib/tricks.ts`, `src/lib/tricks.test.ts`
- Modify: none required beyond exports

**Interfaces:**
- Consumes: none
- Produces:

```ts
export type FamilyId =
  | "anchors"
  | "magnitude"
  | "percent-shift"
  | "percent-reversible"
  | "percent-tens"
  | "percent-chunks"
  | "percent-tip"
  | "div-by-5"
  | "hour-month"
  | "month-day"
  | "month-year"
  | "break-even"
  | "markup"
  | "stacked-founder"
  | "cfo-feasibility"
  | "cfo-unit-econ"
  | "cfo-runway"
  | "cfo-growth";

export type TrickCategory =
  | "Anchors"
  | "Percents"
  | "Conversions"
  | "Business"
  | "Advanced";

export interface Trick {
  id: string;
  familyId: FamilyId;
  title: string;
  rule: string;
  example: string;
  category: TrickCategory;
}

export const P0_FAMILY_IDS: FamilyId[]; // through markup, excluding stacked-founder and cfo-*
export const TRICKS: Trick[];
export function getTrick(id: string): Trick | undefined;
export function tricksForFamily(familyId: FamilyId): Trick[];
```

`P0_FAMILY_IDS` is: anchors, magnitude, percent-shift, percent-reversible, percent-tens, percent-chunks, percent-tip, div-by-5, hour-month, month-day, month-year, break-even, markup.

- [ ] **Step 1: Write failing tests in `src/lib/tricks.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { P0_FAMILY_IDS, TRICKS, getTrick, tricksForFamily } from "./tricks";

describe("tricks catalog", () => {
  it("has unique ids", () => {
    const ids = TRICKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("seeds at least one trick per P0 family", () => {
    for (const familyId of P0_FAMILY_IDS) {
      expect(tricksForFamily(familyId).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("round-trips getTrick", () => {
    const first = TRICKS[0];
    expect(getTrick(first.id)).toEqual(first);
    expect(getTrick("missing")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL (module missing)**

```bash
npx vitest run src/lib/tricks.test.ts
```

- [ ] **Step 3: Implement `src/lib/tricks.ts`**

Export the types above. Seed ≥1 original-wording card per P0 family (rule + example). Example for `hour-month`: rule `Hourly cost × 720 ≈ monthly`; example `$1/hr → $720/mo`.

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/lib/tricks.test.ts
```

- [ ] **Step 5: Update `.agents/state.json`**

Set `E1.M1.S1` `E1.M1.S2` `E1.M1.S3` to `done`, `E1.M1` complete, `current_milestone_id` to `E3.M1`, `next_action` to `E3.M1.S1`. Flip E1.M1 status in `IMPLEMENTATION_STORIES.md` to `done`.

---

### Task 3: Progress store + frozen IDs (E3.M1)

**Files:**
- Create: `src/lib/progressStore.ts`, `src/lib/progressStore.test.ts`

**Interfaces:**
- Consumes: none
- Produces:

```ts
export const PROGRESS_KEY = "reflex_core_progress_v1";
export const BEGINNER_PATH_ID = "beginner-reflex";
export const BEGINNER_MILESTONE_IDS = [
  "E4.M1",
  "E4.M2",
  "E4.M3",
  "E4.M0",
  "E5.M2",
] as const;
export type MilestoneId = (typeof BEGINNER_MILESTONE_IDS)[number];
export type MilestoneStatus = "locked" | "active" | "complete";

export interface DrillGroupScore {
  correct: number;
  total: number;
  medianLatencyMs: number;
}

export interface ProgressState {
  version: 1;
  pathId: string;
  milestones: Record<string, MilestoneStatus>;
  drillScores: Record<string, DrillGroupScore>;
  streaks: { current: number };
}

export function defaultProgress(): ProgressState;
export function loadProgress(): ProgressState; // corrupt → default + recovered flag via getLastRecovery()
export function saveProgress(state: ProgressState): void;
export function resetProgress(): ProgressState;
export function getLastRecovery(): boolean;
```

First-run: `E4.M1` is `active`; later IDs `locked`.

- [ ] **Step 1: Write `src/lib/progressStore.test.ts`**

Cover: default shape; save/load round-trip using a mock `localStorage`; corrupt JSON returns default and `getLastRecovery() === true`; milestone ids include `E4.M0`.

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/lib/progressStore.test.ts
```

- [ ] **Step 3: Implement store with try/catch on JSON.parse**

- [ ] **Step 4: Run tests — expect PASS; then lint + build**

```bash
npm run test && npm run lint && npm run build
```

- [ ] **Step 5: Update state.json** — E3.M1 stories done; `next_action` = `E4.M1.S1` (`gradeAnswer` + drill groups). Mark E3.M1 done in IMPLEMENTATION_STORIES.

---

### Task 4: Hand off remaining P0 to the milestone loop

**Files:** none (process)

**Interfaces:**
- Consumes: Tasks 1–3 artifacts
- Produces: agent continues at `E4.M1.S1` per `IMPLEMENTATION_STORIES.md`

Remaining P0 order (do not skip):

`E4.M1` → `E4.M2` → `E4.M3` → `E4.M0` → `E5.M1` → `E5.M2` → `E8.M1` → `E8.M2` → `E8.M3` → `E2.M1` → `E3.M2` → `E6.M1`

Then freeze. Then `post_mvp_order` → `later_order` → `advanced_order`. Then `/loop content graph using LOOPS/LOOP-Graph.md`.

- [ ] **Step 1: Confirm next_action is E4.M1.S1**
- [ ] **Step 2: Continue with `AGENTS_LOOP-Continue-Milestone.md` (one story per tick)**

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| React/Vite SPA | Task 1 |
| familyId catalog / tricks | Task 2 |
| localStorage progress + frozen IDs including fluency gate | Task 3 |
| Drills, guides, cases, coach, dashboard | Task 4 → stories E4–E6/E8 |
| Content graph after freeze | Task 4 + `LOOPS/LOOP-Graph.md` |
