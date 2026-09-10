/** Session-only browse past locks — not written to ProgressStore. */
export const SESSION_PEEK_KEY = "reflex_core_session_peek_v1";

export function isSessionPeekOn(): boolean {
  try {
    return sessionStorage.getItem(SESSION_PEEK_KEY) === "1";
  } catch {
    return false;
  }
}

export function setSessionPeek(enabled: boolean): void {
  try {
    if (enabled) sessionStorage.setItem(SESSION_PEEK_KEY, "1");
    else sessionStorage.removeItem(SESSION_PEEK_KEY);
  } catch {
    /* private mode / blocked storage */
  }
}

export const SESSION_PEEK_TIP =
  "Temporary — clears when you close the tab. Does not save as path progress.";
