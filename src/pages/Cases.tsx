import { Link, useSearchParams } from "react-router-dom";
import { PassFilterBar, ResourceTagger } from "../components/PassTags";
import SessionPeekBanner from "../components/SessionPeekBanner";
import { usePassTags } from "../components/usePassTags";
import { useSessionPeek } from "../components/useSessionPeek";
import { CASE_PACKS, casesForPack } from "../lib/cases";
import { areCasesLocked } from "../lib/progressStore";

export default function Cases() {
  const gated = areCasesLocked();
  const { peek, enable, disable } = useSessionPeek();
  const locked = gated && !peek;
  const tags = usePassTags("cases");
  const [params] = useSearchParams();
  const packFilter = params.get("pack");
  const packs = packFilter
    ? CASE_PACKS.filter((pack) => pack.id === packFilter)
    : CASE_PACKS;

  return (
    <section>
      <h2>Cases</h2>
      {gated ? (
        <SessionPeekBanner
          surface="cases"
          peek={peek}
          onEnable={enable}
          onDisable={disable}
          showGateLinks
        />
      ) : (
        <p className="lede">Conversation prompt, commit a number, then see the chain. SAMPLE only.</p>
      )}
      {locked ? (
        <p>
          Graded cases stay locked until the timed fluency gate: ≥80% on
          /drills/percents (median ≤5s) and /drills/conversions (median ≤6s).
        </p>
      ) : null}
      {locked ? null : (
        <PassFilterBar
          selected={tags.selected}
          onToggle={tags.toggleFilter}
          onClear={tags.clearFilters}
        />
      )}
      {packs.map((pack) => {
        const allRows = casesForPack(pack.id);
        const rows = allRows.filter((row) => tags.matches(`case:${row.id}`));
        return (
          <section key={pack.id} className="track-block">
            <h3>{pack.title}</h3>
            <p className="lede">{pack.summary}</p>
            {locked || rows.length === 0 ? (
              <p className="example">
                {locked
                  ? "Pack locked behind the percents + conversions timed gate."
                  : allRows.length === 0
                    ? "No cases in this pack yet."
                    : "No resources with that tag."}
              </p>
            ) : (
              <ul className="cards">
                {rows.map((row) => {
                  const key = `case:${row.id}`;
                  return (
                    <li key={row.id}>
                      <Link to={`/cases/${row.id}`}>{row.id}</Link>
                      <p>
                        {row.difficulty} · {row.thinkingMode}
                      </p>
                      <ResourceTagger
                        resourceKey={key}
                        appliedIds={tags.tagsFor(key)}
                        onToggle={tags.toggleTag}
                      />
                    </li>
                  );
                })}
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
