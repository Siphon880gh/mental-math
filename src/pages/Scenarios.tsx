import { Link } from "react-router-dom";
import { PassFilterBar, ResourceTagger } from "../components/PassTags";
import { usePassTags } from "../components/usePassTags";
import { scenariosForTrack } from "../lib/scenarios";
import { TRACK_LABEL, type TrackId } from "../lib/tracks";

function TrackBlock({
  track,
  tags,
}: {
  track: TrackId;
  tags: ReturnType<typeof usePassTags>;
}) {
  const rows = scenariosForTrack(track).filter((row) => tags.matches(`scenario:${row.id}`));
  return (
    <section className="track-block">
      <h3>{TRACK_LABEL[track]}</h3>
      {rows.length === 0 ? (
        <p className="example">No resources with that tag.</p>
      ) : (
        <ul className="cards">
          {rows.map((row) => {
            const key = `scenario:${row.id}`;
            return (
              <li key={row.id}>
                <Link to={`/scenarios/${row.id}`}>{row.title}</Link>
                <p>
                  {row.skillIds.length} skills · SAMPLE
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
}

export default function Scenarios() {
  const tags = usePassTags("scenarios");
  return (
    <section>
      <h2>Scenarios</h2>
      <p className="lede">
        Multi-skill stories. Hint when stuck, Cheat for the full chain, then pick
        a number. Separate from conversation Cases.
      </p>
      <PassFilterBar
        selected={tags.selected}
        onToggle={tags.toggleFilter}
        onClear={tags.clearFilters}
      />
      <TrackBlock track="quick" tags={tags} />
      <TrackBlock track="stakeholder" tags={tags} />
    </section>
  );
}
