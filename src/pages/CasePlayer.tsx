import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCase } from "../lib/cases";
import { gradeAnswer } from "../lib/grading";
import { THINKING_MODE_TIPS } from "../lib/thinkingModeTips";
import {
  areCasesLocked,
  recordCaseComplete,
} from "../lib/progressStore";

export default function CasePlayer() {
  const { caseId = "" } = useParams();
  const study = getCase(caseId);
  const locked = areCasesLocked();
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
        <p>
          Graded cases stay locked until you pass percents and conversions on a
          timer (≥80%, median ≤5s percents / ≤6s conversions).
        </p>
        <Link to="/drills/percents">Percents drill</Link>
        {" · "}
        <Link to="/drills/conversions">Conversions drill</Link>
      </section>
    );
  }

  const grade = submitted
    ? gradeAnswer(study.expectedAnswer, Number(draft), study.unit)
    : null;

  return (
    <section>
      <p className="eyebrow">
        {study.packId} · {study.difficulty} · {study.thinkingMode}
      </p>
      <h2>{study.prompt}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!submitted) {
            setSubmitted(true);
            recordCaseComplete(study.packId);
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
