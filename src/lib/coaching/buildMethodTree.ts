import type { FamilyId } from "../tricks";
import type { CoachingNode, CoachingSession } from "./types";

export interface WrongChoiceSpec {
  id: string;
  label: string;
  explain: string;
}

export interface ContinueLayerSpec {
  id: string;
  message: string;
  correct: { id: string; label: string; next: string };
  wrongs: [WrongChoiceSpec, WrongChoiceSpec, ...WrongChoiceSpec[]];
}

export interface MethodTreeSpec {
  slug: FamilyId;
  title: string;
  summary: string;
  tags: string[];
  /** start + two more continue layers */
  layers: [ContinueLayerSpec, ContinueLayerSpec, ContinueLayerSpec];
  success: string;
}

function wrongNodeId(layerId: string, wrongId: string): string {
  return `wrong_${layerId}_${wrongId}`;
}

/** Shared three-layer method tree: pick the shortcut, apply it, sanity-check. */
export function buildMethodTree(spec: MethodTreeSpec): CoachingSession {
  const nodes: Record<string, CoachingNode> = {
    success: {
      message: spec.success,
      outcome: "success",
      choices: [],
    },
  };

  for (const layer of spec.layers) {
    nodes[layer.id] = {
      message: layer.message,
      outcome: "continue",
      choices: [
        { id: layer.correct.id, label: layer.correct.label, next: layer.correct.next },
        ...layer.wrongs.map((wrong) => ({
          id: wrong.id,
          label: wrong.label,
          next: wrongNodeId(layer.id, wrong.id),
        })),
      ],
    };
    for (const wrong of layer.wrongs) {
      nodes[wrongNodeId(layer.id, wrong.id)] = {
        message: wrong.explain,
        outcome: "wrong",
        choices: [],
        rewind_to: layer.id,
      };
    }
  }

  return {
    meta: {
      slug: spec.slug,
      title: spec.title,
      summary: spec.summary,
      familyId: spec.slug,
      tags: spec.tags,
    },
    tree: {
      start: spec.layers[0].id,
      nodes,
    },
  };
}
