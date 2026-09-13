import { useState } from "react";
import { Link } from "react-router-dom";
import { LessonLink } from "../components/LessonLink";
import { ResourcePageTagger } from "../components/PassTags";

export default function PercentSwap() {
  const [swapped, setSwapped] = useState(false);
  const [halved, setHalved] = useState(false);
  return (
    <section>
      <h2>Percent swap</h2>
      <p className="lede">SAMPLE: 14% of 50. Swap to the easy half.</p>
      <p className="coach-message">
        {swapped ? "50% of 14" : "14% of 50"}
        {halved ? " = 7" : ""}
      </p>
      <p className="coach-controls">
        <button type="button" onClick={() => setSwapped(true)} disabled={swapped}>
          Swap A% of B
        </button>
        <button type="button" onClick={() => swapped && setHalved(true)} disabled={!swapped || halved}>
          Take 50%
        </button>
        <button
          type="button"
          onClick={() => {
            setSwapped(false);
            setHalved(false);
          }}
        >
          Reset
        </button>
      </p>
      {halved ? (
        <p className="coach-success coach-panel">14% of 50 is 50% of 14 → 7.</p>
      ) : null}
      <ResourcePageTagger resourceKey="game:percent-swap" section="games" />
      <p>
        <LessonLink familyId="percent-reversible">Related guide</LessonLink>
        {" · "}
        <Link to="/games">All games</Link>
      </p>
    </section>
  );
}
