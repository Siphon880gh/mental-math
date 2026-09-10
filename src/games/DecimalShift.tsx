import { useState } from "react";
import { Link } from "react-router-dom";
import { LessonLink } from "../components/LessonLink";

const START = 8500;

export default function DecimalShift() {
  const [places, setPlaces] = useState(0);
  const value = START / 10 ** places;
  const win1 = places === 2;
  const win10 = places === 1;
  return (
    <section>
      <h2>Decimal shifter</h2>
      <p className="lede">SAMPLE: start at 8,500. 10% is one place left. 1% is two.</p>
      <p className="coach-message" style={{ fontSize: "2rem" }}>{value}</p>
      <p className="coach-controls">
        <button type="button" onClick={() => setPlaces((n) => Math.min(4, n + 1))}>
          Shift left
        </button>
        <button type="button" onClick={() => setPlaces((n) => Math.max(0, n - 1))}>
          Shift right
        </button>
        <button type="button" onClick={() => setPlaces(0)}>
          Reset
        </button>
      </p>
      {win10 ? <p className="coach-success coach-panel">10% of 8,500 is 850. One more left for 1%.</p> : null}
      {win1 ? <p className="coach-success coach-panel">1% of 8,500 is 85. Two places left.</p> : null}
      <p>
        <LessonLink familyId="percent-shift">Related guide</LessonLink>
        {" · "}
        <Link to="/games">All games</Link>
      </p>
    </section>
  );
}
