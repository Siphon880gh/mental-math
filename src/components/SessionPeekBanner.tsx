import { Link } from "react-router-dom";
import { SESSION_PEEK_TIP } from "../lib/sessionPeek";

export type PeekSurface = "cases" | "case" | "drills" | "drill";

const COPY: Record<PeekSurface, { locked: string; enable: string }> = {
  cases: {
    locked:
      "Cases make more sense after the timed fluency gate on percents and conversions. Want to look around first? You can open every pack for this browser session only.",
    enable: "Browse this session",
  },
  case: {
    locked:
      "This case is clearer after percents and conversions on a timer. You can still open it for this browser session only — that peek is temporary and does not save as path progress.",
    enable: "Open this case this session",
  },
  drills: {
    locked:
      "Later path groups stay locked until the previous milestone is complete. You can open them for this browser session only.",
    enable: "Browse this session",
  },
  drill: {
    locked:
      "This path group is locked until the previous milestone is complete. You can still open it for this browser session only.",
    enable: "Open this drill this session",
  },
};

export default function SessionPeekBanner({
  surface,
  peek,
  onEnable,
  onDisable,
  showGateLinks = false,
}: {
  surface: PeekSurface;
  peek: boolean;
  onEnable: () => void;
  onDisable: () => void;
  showGateLinks?: boolean;
}) {
  const copy = COPY[surface];

  if (peek) {
    return (
      <div className="coach-panel">
        <p>Temporary session peek is on — path progress is not saved.</p>
        <p className="example">{SESSION_PEEK_TIP}</p>
        <p className="coach-controls">
          <button type="button" onClick={onDisable}>
            Turn off temporary peek
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="coach-panel">
      <p>{copy.locked}</p>
      <p className="example">{SESSION_PEEK_TIP}</p>
      <p className="coach-controls">
        {showGateLinks ? (
          <>
            <Link to="/drills/percents">Percents drill</Link>
            <Link to="/drills/conversions">Conversions drill</Link>
          </>
        ) : null}
        <button type="button" onClick={onEnable}>
          {copy.enable}
        </button>
      </p>
    </div>
  );
}
