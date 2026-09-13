import { Link } from "react-router-dom";
import { PassFilterBar, ResourceTagger } from "../components/PassTags";
import { usePassTags } from "../components/usePassTags";
import { GAMES } from "../lib/games";

export default function Games() {
  const tags = usePassTags("games");
  const rows = GAMES.filter((game) => tags.matches(`game:${game.slug}`));

  return (
    <section>
      <h2>Mini-games</h2>
      <p className="lede">One mechanic each. Not another typed drill.</p>
      <PassFilterBar
        selected={tags.selected}
        onToggle={tags.toggleFilter}
        onClear={tags.clearFilters}
      />
      {rows.length === 0 ? (
        <p className="example">No resources with that tag.</p>
      ) : (
        <ul className="cards">
          {rows.map((game) => {
            const key = `game:${game.slug}`;
            return (
              <li key={game.slug}>
                <Link to={`/games/${game.slug}`}>{game.title}</Link>
                <p>{game.summary}</p>
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
