import { useState } from "react";
import { Link } from "react-router-dom";

const CHIPS = [50, 25, 10, 5];
const TARGET = 35;

export default function ChunkAdder() {
  const [sum, setSum] = useState(0);
  const base = 2000;
  const value = (sum / 100) * base;
  const win = sum === TARGET;
  return (
    <section>
      <h2>Percent chips</h2>
      <p className="lede">SAMPLE: build 35% of 2,000. Chips are 50 / 25 / 10 / 5.</p>
      <p>
        Chips: {sum}% → {value}
      </p>
      <p className="coach-controls">
        {CHIPS.map((chip) => (
          <button key={chip} type="button" onClick={() => setSum((n) => n + chip)}>
            +{chip}%
          </button>
        ))}
        <button type="button" onClick={() => setSum(0)}>
          Reset
        </button>
      </p>
      {win ? <p className="coach-success coach-panel">35% of 2,000 = 700. Three tenths plus 5%.</p> : null}
      <p>
        <Link to="/guides/percent-chunks">Related guide</Link>
        {" · "}
        <Link to="/games">All games</Link>
      </p>
    </section>
  );
}
