import { Link, useSearchParams } from "react-router-dom";
import { CASE_PACKS, casesForPack } from "../lib/cases";
import { areCasesLocked } from "../lib/progressStore";

export default function Cases() {
  const locked = areCasesLocked();
  const [params] = useSearchParams();
  const packFilter = params.get("pack");
  const packs = packFilter
    ? CASE_PACKS.filter((pack) => pack.id === packFilter)
    : CASE_PACKS;

  return (
    <section>
      <h2>Cases</h2>
      {locked ? (
        <p>
          Graded cases stay locked until the timed fluency gate: ≥80% on
          /drills/percents (median ≤5s) and /drills/conversions (median ≤6s).
        </p>
      ) : (
        <p className="lede">Conversation prompt, commit a number, then see the chain. SAMPLE only.</p>
      )}
      {packs.map((pack) => {
        const rows = casesForPack(pack.id);
        return (
          <section key={pack.id} className="track-block">
            <h3>{pack.title}</h3>
            <p className="lede">{pack.summary}</p>
            {locked || rows.length === 0 ? (
              <p className="example">
                {locked ? "Pack locked behind the percents + conversions timed gate." : "No cases in this pack yet."}
              </p>
            ) : (
              <ul className="cards">
                {rows.map((row) => (
                  <li key={row.id}>
                    <Link to={`/cases/${row.id}`}>{row.id}</Link>
                    <p>
                      {row.difficulty} · {row.thinkingMode}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
      <p>
        <Link to="/">Home</Link>
      </p>
    </section>
  );
}
