import { Link } from "react-router-dom";
import { PassFilterBar, ResourceTagger } from "../components/PassTags";
import { usePassTags } from "../components/usePassTags";
import { guidesForTrack } from "../lib/guides";
import { TRACK_BLURB, TRACK_LABEL, type TrackId } from "../lib/tracks";

export default function TrackGuides({ track }: { track: TrackId }) {
  const guides = guidesForTrack(track);
  const section = track === "quick" ? "track-a" : "track-b";
  const tags = usePassTags(section);
  const visible = guides.filter((guide) => tags.matches(`guide:${guide.slug}`));

  return (
    <section>
      <p className="eyebrow">{track === "quick" ? "Track A" : "Track B"}</p>
      <h2>{TRACK_LABEL[track]}</h2>
      <p className="lede">{TRACK_BLURB[track]}</p>
      <PassFilterBar
        selected={tags.selected}
        onToggle={tags.toggleFilter}
        onClear={tags.clearFilters}
      />
      {visible.length === 0 ? (
        <p className="example">No resources with that tag.</p>
      ) : (
        <ul className="cards">
          {visible.map((guide) => {
            const key = `guide:${guide.slug}`;
            return (
              <li key={guide.slug}>
                <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
                <p>{guide.summary}</p>
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
