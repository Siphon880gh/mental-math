import { afterEach, describe, expect, it } from "vitest";
import {
  SESSION_PEEK_KEY,
  isSessionPeekOn,
  setSessionPeek,
} from "./sessionPeek";

afterEach(() => {
  sessionStorage.clear();
});

describe("session peek", () => {
  it("defaults off and is not path progress", () => {
    expect(isSessionPeekOn()).toBe(false);
    expect(sessionStorage.getItem(SESSION_PEEK_KEY)).toBeNull();
  });

  it("toggles in sessionStorage only", () => {
    setSessionPeek(true);
    expect(isSessionPeekOn()).toBe(true);
    expect(sessionStorage.getItem(SESSION_PEEK_KEY)).toBe("1");
    setSessionPeek(false);
    expect(isSessionPeekOn()).toBe(false);
    expect(sessionStorage.getItem(SESSION_PEEK_KEY)).toBeNull();
  });
});
