export const SESSION_PEEK_KEY = "reflex_core_session_peek_v1";

export function isSessionPeekOn() {
  try {
    return sessionStorage.getItem(SESSION_PEEK_KEY) === "1";
  } catch {
    return false;
  }
}

export function setSessionPeek(enabled) {
  try {
    if (enabled) sessionStorage.setItem(SESSION_PEEK_KEY, "1");
    else sessionStorage.removeItem(SESSION_PEEK_KEY);
  } catch {
    /* ignore */
  }
  document.documentElement.classList.toggle("peek-on", enabled);
}

export function initPeek() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-peek]");
    if (!btn) return;
    setSessionPeek(btn.getAttribute("data-peek") === "on");
  });
}
