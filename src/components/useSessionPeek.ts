import { useState } from "react";
import { isSessionPeekOn, setSessionPeek } from "../lib/sessionPeek";

export function useSessionPeek() {
  const [peek, setPeek] = useState(isSessionPeekOn);
  return {
    peek,
    enable: () => {
      setSessionPeek(true);
      setPeek(true);
    },
    disable: () => {
      setSessionPeek(false);
      setPeek(false);
    },
  };
}
