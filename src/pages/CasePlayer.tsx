import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SessionPeekBanner from "../components/SessionPeekBanner";
import { useSessionPeek } from "../components/useSessionPeek";
import { getCase } from "../lib/cases";
import { gradeAnswer } from "../lib/grading";
import { THINKING_MODE_TIPS } from "../lib/thinkingModeTips";
import {
  areCasesLocked,
  recordCaseComplete,
} from "../lib/progressStore";
import { isSessionPeekOn } from "../lib/sessionPeek";

export default function CasePlayer() {
  const { caseId = "" } = useParams();
  const study = getCase(caseId);
  const gated = areCasesLocked();
  const { peek, enable, disable } = useSessionPeek();
  const locked = gated && !peek;
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!study) {
    return (
      <section>
        <p>Unknown case.</p>
        <Link to="/cases">All cases</Link>
      </section>
    );
  }
  if (locked) {
    return (
      <section>
        <h2>Cases locked</h2>
        <SessionPeekBanner
          surface="case"
          peek={peek}
          onEnable={enable}
          onDisable={disable}
          showGateLinks
        />
      </section>
    );
  }

  const grade = submitted
    ? gradeAnswer(study.expectedAnswer, Number(draft), study.unit)
    : null;

  return (
    <section>
      {gated ? (
        <SessionPeekBanner
          surface="case"
          peek={peek}
          onEnable={enable}
          onDisable={disable}
        />
      ) : null}
      <p className="eyebrow">
        {study.packId} · {study.difficulty} · {study.thinkingMode}
      </p>
      <h2>{study.prompt}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!submitted) {
            setSubmitted(true);
            if (!isSessionPeekOn()) recordCaseComplete(study.packId);
          }
        }}
      >
        <label>
          Your number
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            inputMode="decimal"
            disabled={submitted}
          />
        </label>
        {!submitted ? (
          <p className="coach-controls">
            <button type="submit">Submit</button>
          </p>
        ) : (
          <div className={`coach-panel ${grade === "incorrect" ? "coach-wrong" : "coach-success"}`}>
            <p>
              {grade} — expected {study.expectedAnswer}
              {study.unit ? ` ${study.unit}` : ""}. SAMPLE debrief.
            </p>
            <ol>
              {study.thoughtChain.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="example">{THINKING_MODE_TIPS[study.thinkingMode]}</p>
          </div>
        )}
      </form>
      <p>
        <Link to="/cases">All cases</Link>
      </p>
    </section>
  );
}
