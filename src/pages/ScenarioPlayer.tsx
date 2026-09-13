import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SkillLinks } from "../components/LessonLink";
import { ResourcePageTagger } from "../components/PassTags";
import { getScenario } from "../lib/scenarios";
import { hrefForTrack, TRACK_LABEL } from "../lib/tracks";

export default function ScenarioPlayer() {
  const { scenarioId = "" } = useParams();
  const study = getScenario(scenarioId);
  const [hintCount, setHintCount] = useState(0);
  const [cheated, setCheated] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  if (!study) {
    return (
      <section>
        <h2>Scenario not found</h2>
        <Link to="/scenarios">All scenarios</Link>
      </section>
    );
  }

  const choice = study.choices.find((row) => row.id === picked);
  const showSkills = hintCount > 0 || cheated;

  return (
    <section>
      <p className="eyebrow">{TRACK_LABEL[study.track]}</p>
      <h2>{study.title}</h2>
      <p>{study.prompt}</p>
      {showSkills ? (
        <p className="example">
          <SkillLinks ids={study.skillIds} />
        </p>
      ) : null}
      <p className="coach-controls">
        <button
          type="button"
          onClick={() => setHintCount((n) => Math.min(study.hints.length, n + 1))}
          disabled={hintCount >= study.hints.length}
        >
          Hint
        </button>
        <button type="button" onClick={() => setCheated(true)} disabled={cheated}>
          Cheat
        </button>
      </p>
      {hintCount > 0 ? (
        <ol className="hint-list">
          {study.hints.slice(0, hintCount).map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ol>
      ) : null}
      {cheated ? <p className="coach-panel coach-success">{study.cheat}</p> : null}
      <div className="choice-list" role="group" aria-label="Answer choices">
        {study.choices.map((row) => {
          const selected = picked === row.id;
          const reveal = cheated || picked !== null;
          const mark = reveal && row.correct ? " is-correct" : "";
          const miss = selected && !row.correct ? " is-wrong" : "";
          return (
            <button
              key={row.id}
              type="button"
              className={`choice${selected ? " is-picked" : ""}${mark}${miss}`}
              onClick={() => setPicked(row.id)}
            >
              {row.label}
            </button>
          );
        })}
      </div>
      {choice ? (
        <p className={choice.correct ? "coach-panel coach-success" : "coach-panel coach-wrong"}>
          {choice.correct ? "Correct. SAMPLE only." : "Not that one. Hint, cheat, or pick again."}
        </p>
      ) : null}
      <ResourcePageTagger resourceKey={`scenario:${study.id}`} section="scenarios" />
      <p>
        <Link to="/scenarios">All scenarios</Link>
        {" · "}
        <Link to={hrefForTrack(study.track)}>
          {study.track === "quick" ? "Track A" : "Track B"}
        </Link>
      </p>
    </section>
  );
}
