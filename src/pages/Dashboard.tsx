import { useState } from "react";
import { Link } from "react-router-dom";
import SessionPeekBanner from "../components/SessionPeekBanner";
import { useSessionPeek } from "../components/useSessionPeek";
import {
  BEGINNER_PATH_ID,
  OPERATOR_PATH_ID,
  areCasesLocked,
  loadProgress,
  resetProgress,
  switchPath,
  type ProgressState,
} from "../lib/progressStore";
import {
  getPathTemplate,
  hrefForRef,
  nextMilestone,
} from "../lib/learningPaths";
import { THINKING_MODE_TIPS } from "../lib/thinkingModeTips";
import type { ThinkingMode } from "../lib/cases";

export default function Dashboard() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [preview, setPreview] = useState<string | null>(null);
  const path = getPathTemplate(progress.pathId);
  const next = nextMilestone(path, progress.milestones);
  const complete = !next;
  const firstRun = Object.keys(progress.drillScores).length === 0;
  const ctaHref = next ? hrefForRef(next.contentRefs[0]!) : "/track-a";
  const operator = progress.pathId === OPERATOR_PATH_ID;
  const other = operator ? BEGINNER_PATH_ID : OPERATOR_PATH_ID;
  const otherPath = getPathTemplate(other);
  const gated = areCasesLocked(progress);
  const { peek, enable, disable } = useSessionPeek();

  return (
    <section>
      <h2>{path.title}</h2>
      {firstRun ? (
        <p>
          First run: five minutes of reflex training, no calculator. Track A
          shortcuts, then a timed gate, then conversation cases.
        </p>
      ) : (
        <p className="lede">{path.description}</p>
      )}
      {complete ? (
        <p className="coach-panel coach-success">
          Path complete. You can smell-test SAMPLE numbers in conversation without
          a calculator.
        </p>
      ) : (
        <p>
          Next: {next?.title}. {next?.coachTip}
        </p>
      )}
      <p className="coach-controls">
        <Link to={ctaHref}>{complete ? "Browse guides" : "Continue"}</Link>
      </p>
      {gated ? (
        <SessionPeekBanner
          surface="cases"
          peek={peek}
          onEnable={enable}
          onDisable={disable}
          showGateLinks
        />
      ) : null}
      <h3>Milestones</h3>
      <ul className="cards">
        {path.milestones.map((node) => (
          <li key={node.id}>
            <strong>{node.title}</strong>
            <p>
              {progress.milestones[node.id] ?? "locked"} · {node.coachTip}
            </p>
          </li>
        ))}
      </ul>
      {operator ? (
        <p className="example">
          Operator path: Home names CFO packs. Beginner unlocks are unchanged.
        </p>
      ) : (
        <p className="example">Beginner path does not name CFO packs in the primary CTA.</p>
      )}
      <h3>Switch path</h3>
      {preview === other ? (
        <div className="coach-panel">
          <p>Switch to {otherPath.title}?</p>
          <ul>
            {otherPath.milestones.map((node) => (
              <li key={node.id}>{node.title}</li>
            ))}
          </ul>
          <p className="coach-controls">
            <button
              type="button"
              onClick={() => {
                setProgress(switchPath(other));
                setPreview(null);
              }}
            >
              Confirm switch
            </button>
            <button type="button" onClick={() => setPreview(null)}>
              Cancel
            </button>
          </p>
        </div>
      ) : (
        <p className="coach-controls">
          <button type="button" onClick={() => setPreview(other)}>
            Preview {otherPath.title}
          </button>
        </p>
      )}
      <h3>Process tips</h3>
      <ul>
        {(Object.keys(THINKING_MODE_TIPS) as ThinkingMode[]).map((mode) => (
          <li key={mode}>
            <strong>{mode.replaceAll("_", " ")}.</strong> {THINKING_MODE_TIPS[mode]}
          </li>
        ))}
      </ul>
      <p className="coach-controls">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset this device path? Local only.")) {
              setProgress(resetProgress());
            }
          }}
        >
          Reset path
        </button>
      </p>
    </section>
  );
}
