import { describe, expect, it } from "vitest";
import {
  choose,
  initialNavState,
  listSessions,
  loadSession,
  rewindTo,
  stepBack,
  validateDecisionGraph,
  validateSession,
  type CoachingSession,
} from "./index";
import { GUIDES } from "../guides";
import { allCurriculumFamilyIds } from "../tracks";
import { COACHING_NAV_KEY_PREFIX } from "./persist";
import { SESSION_SPECS } from "./sessions/specs";

describe("coaching validation", () => {
  it("accepts the percent-shift sample", () => {
    const loaded = loadSession("percent-shift");
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    const r = validateSession(loaded.session);
    expect(r.ok).toBe(true);
    const wrongs = Object.values(loaded.session.tree.nodes).filter((n) => n.outcome === "wrong");
    const successes = Object.values(loaded.session.tree.nodes).filter((n) => n.outcome === "success");
    expect(wrongs.length).toBeGreaterThanOrEqual(2);
    expect(successes.length).toBeGreaterThanOrEqual(1);
  });

  it("rejects missing rewind, unknown next, and empty success choices", () => {
    const bad: CoachingSession = {
      meta: {
        slug: "bad",
        title: "Bad",
        summary: "Bad",
        familyId: "bad",
        tags: ["beginner"],
      },
      tree: {
        start: "start",
        nodes: {
          start: {
            message: "Go",
            outcome: "continue",
            choices: [{ id: "x", label: "x", next: "missing" }],
          },
          wrong: {
            message: "oops",
            outcome: "wrong",
            choices: [],
          },
          success: {
            message: "done",
            outcome: "success",
            choices: [{ id: "nope", label: "leave", next: "start" }],
          },
        },
      },
    };
    const r = validateSession(bad);
    expect(r.ok).toBe(false);
    const codes = new Set(r.issues.map((i) => i.code));
    expect(codes.has("bad_next")).toBe(true);
    expect(codes.has("missing_rewind")).toBe(true);
    expect(codes.has("terminal_choices")).toBe(true);
  });

  it("rejects invalid start reference", () => {
    const r = validateDecisionGraph({
      start: "nope",
      nodes: {
        start: { message: "x", outcome: "success", choices: [] },
      },
    });
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.code === "missing_start")).toBe(true);
  });
});

describe("coaching catalog pairing", () => {
  it("authors one valid session per guide / familyId", () => {
    const slugs = listSessions().map((s) => s.slug).sort();
    expect(slugs).toEqual([...allCurriculumFamilyIds()].sort());
    expect(SESSION_SPECS.map((s) => s.slug)).toEqual(allCurriculumFamilyIds());
    for (const guide of GUIDES) {
      const loaded = loadSession(guide.relatedCoachSlug);
      expect(loaded.ok, guide.slug).toBe(true);
      if (!loaded.ok) continue;
      expect(loaded.session.meta.familyId).toBe(guide.familyId);
      expect(loaded.session.meta.slug).toBe(guide.slug);
    }
  });

  it("documents the sessionStorage recovery key prefix", () => {
    expect(COACHING_NAV_KEY_PREFIX).toBe("reflex_core_coaching_nav_v1:");
  });
});

describe("coaching navigation", () => {
  it("choose follows choiceId and grows history; rewind from wrong returns to rewind_to", () => {
    const loaded = loadSession("percent-shift");
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    const session = loaded.session;
    const start = initialNavState(session.tree);
    const startNode = session.tree.nodes[start.currentNodeId]!;
    const correct = startNode.choices.find((c) => c.id === "two");
    expect(correct).toBeTruthy();
    const next = choose(session, start.currentNodeId, correct!.id, start.history);
    expect(next.ok).toBe(true);
    if (!next.ok) return;
    expect(next.state.currentNodeId).toBe("apply");
    expect(next.state.history).toEqual(["start"]);

    const apply = session.tree.nodes.apply!;
    const wrongChoice = apply.choices.find((c) => c.next.startsWith("wrong_"));
    expect(wrongChoice).toBeTruthy();
    const landed = choose(session, next.state.currentNodeId, wrongChoice!.id, next.state.history);
    expect(landed.ok).toBe(true);
    if (!landed.ok) return;
    expect(session.tree.nodes[landed.state.currentNodeId]?.outcome).toBe("wrong");
    const back = stepBack(session.tree, landed.state);
    expect(back.ok).toBe(true);
    if (!back.ok) return;
    expect(back.state.currentNodeId).toBe("apply");

    const targeted = rewindTo(session.tree, landed.state, "apply");
    expect(targeted.ok).toBe(true);
    if (!targeted.ok) return;
    expect(targeted.state.currentNodeId).toBe("apply");
  });

  it("rejects an invalid choice id", () => {
    const loaded = loadSession("anchors");
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    const r = choose(loaded.session, "start", "nope", []);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toBe("invalid_choice");
  });
});
