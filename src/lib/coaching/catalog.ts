import { listSessions, loadSession } from "./index";

/** Pairing key: one step-by-step tree per guide / familyId. */
export function coachSlugForFamily(familyId: string): string {
  return familyId;
}

export function hasCoachSession(slug: string): boolean {
  return loadSession(slug).ok;
}

export function listCoachSessionSlugs(): string[] {
  return listSessions().map((meta) => meta.slug);
}
