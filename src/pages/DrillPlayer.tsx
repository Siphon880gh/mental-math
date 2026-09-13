import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LessonLink } from "../components/LessonLink";
import { ResourcePageTagger } from "../components/PassTags";
import SessionPeekBanner from "../components/SessionPeekBanner";
import { useSessionPeek } from "../components/useSessionPeek";
import { getDrillGroup, itemsForGroup } from "../lib/drillData";
import { gradeAnswer, median } from "../lib/grading";
import {
  isPathDrillLocked,
  loadProgress,
  recordDrillGroup,
} from "../lib/progressStore";
import { isSessionPeekOn } from "../lib/sessionPeek";

export default function DrillPlayer() {
  const { groupId = "" } = useParams();
  const group = getDrillGroup(groupId);
  const items = useMemo(() => itemsForGroup(groupId), [groupId]);
  const gated = isPathDrillLocked(groupId);
  const { peek, enable, disable } = useSessionPeek();
  const locked = gated && !peek;
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [started, setStarted] = useState(() => Date.now());
  const [grades, setGrades] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [tick, setTick] = useState(() => Date.now());
  const gradesRef = useRef<string[]>([]);
  const latenciesRef = useRef<number[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setIndex(0);
    setDraft("");
    setStarted(Date.now());
    setGrades([]);
    gradesRef.current = [];
    latenciesRef.current = [];
    setRevealed(false);
    setDone(false);
  }, [groupId]);

  if (!group) {
    return (
      <section>
        <p>Unknown drill group.</p>
        <Link to="/drills">All drills</Link>
      </section>
    );
  }
  if (locked) {
    return (
      <section>
        <h2>{group.title}</h2>
        <SessionPeekBanner
          surface="drill"
          peek={peek}
          onEnable={enable}
          onDisable={disable}
        />
        <ResourcePageTagger resourceKey={`drill:${groupId}`} section="drills" />
        <p>
          <Link to="/">Home</Link>
          {" · "}
          <Link to="/drills">All drills</Link>
        </p>
      </section>
    );
  }
  if (items.length === 0) {
    return (
      <section>
        <p>Empty group.</p>
        <Link to="/drills">All drills</Link>
      </section>
    );
  }

  const item = items[index]!;
  const elapsed = Math.round((tick - started) / 100) / 10;

  const submit = () => {
    const given = Number(draft);
    const grade = gradeAnswer(item.expectedAnswer, given, item.unit);
    const latency = Date.now() - started;
    gradesRef.current = [...gradesRef.current, grade];
    latenciesRef.current = [...latenciesRef.current, latency];
    setGrades(gradesRef.current);
    setRevealed(true);
  };

  const next = () => {
    if (index + 1 >= items.length) {
      const correct = gradesRef.current.filter((g) => g === "correct" || g === "close").length;
      if (!isSessionPeekOn()) {
        recordDrillGroup(groupId, {
          correct,
          total: items.length,
          medianLatencyMs: median(latenciesRef.current),
        });
      }
      setDone(true);
      return;
    }
    setIndex((n) => n + 1);
    setDraft("");
    setRevealed(false);
    setStarted(Date.now());
  };

  if (done) {
    const stored = loadProgress().drillScores[groupId];
    const correct = gradesRef.current.filter((g) => g === "correct" || g === "close").length;
    const score = stored ?? {
      correct,
      total: items.length,
      medianLatencyMs: median(latenciesRef.current),
    };
    return (
      <section>
        <h2>{group.title} complete</h2>
        <p>
          {score?.correct}/{score?.total} with median {Math.round((score?.medianLatencyMs ?? 0) / 100) / 10}s.
          SAMPLE only.
        </p>
        <ResourcePageTagger resourceKey={`drill:${groupId}`} section="drills" />
        <Link to="/drills">All drills</Link>
        {" · "}
        <Link to="/">Home</Link>
      </section>
    );
  }

  return (
    <section>
      {gated ? (
        <SessionPeekBanner
          surface="drill"
          peek={peek}
          onEnable={enable}
          onDisable={disable}
        />
      ) : null}
      <p className="eyebrow">
        {group.title} · {index + 1}/{items.length} · {elapsed}s
      </p>
      <h2>{item.prompt}</h2>
      <p className="example">
        Skill: <LessonLink familyId={item.familyId} />
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!revealed) submit();
        }}
      >
        <label>
          Answer
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            inputMode="decimal"
            disabled={revealed}
          />
        </label>
        {item.unit ? <p className="example">Unit: {item.unit}</p> : null}
        {!revealed ? (
          <p className="coach-controls">
            <button type="submit">Submit</button>
          </p>
        ) : (
          <div className={`coach-panel coach-${grades[grades.length - 1] === "incorrect" ? "wrong" : "success"}`}>
            <p>{grades[grades.length - 1]} — expected {item.expectedAnswer}</p>
            <ol>
              {item.thoughtChain.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="coach-controls">
              <button type="button" onClick={next}>
                {index + 1 >= items.length ? "Finish" : "Next"}
              </button>
            </p>
          </div>
        )}
      </form>
      <ResourcePageTagger resourceKey={`drill:${groupId}`} section="drills" />
      <p>
        <Link to="/drills">All drills</Link>
      </p>
    </section>
  );
}
