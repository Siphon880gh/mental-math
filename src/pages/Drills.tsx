import { Link } from "react-router-dom";
import { PassFilterBar, ResourceTagger } from "../components/PassTags";
import SessionPeekBanner from "../components/SessionPeekBanner";
import { usePassTags } from "../components/usePassTags";
import { useSessionPeek } from "../components/useSessionPeek";
import { DRILL_GROUPS } from "../lib/drillData";
import { isPathDrillLocked, loadProgress } from "../lib/progressStore";

export default function Drills() {
  const progress = loadProgress();
  const { peek, enable, disable } = useSessionPeek();
  const tags = usePassTags("drills");
  const anyLocked = DRILL_GROUPS.some((group) => isPathDrillLocked(group.id, progress));
  const rows = DRILL_GROUPS.filter((group) => tags.matches(`drill:${group.id}`));

  return (
    <section>
      <h2>Drills</h2>
      <p className="lede">Timed banks. Path groups gate the next milestone. Extra groups stay off the Beginner spine.</p>
      {anyLocked ? (
        <SessionPeekBanner
          surface="drills"
          peek={peek}
          onEnable={enable}
          onDisable={disable}
        />
      ) : null}
      <PassFilterBar
        selected={tags.selected}
        onToggle={tags.toggleFilter}
        onClear={tags.clearFilters}
      />
      {rows.length === 0 ? (
        <p className="example">No resources with that tag.</p>
      ) : (
        <ul className="cards">
          {rows.map((group) => {
            const key = `drill:${group.id}`;
            const locked = isPathDrillLocked(group.id, progress) && !peek;
            return (
              <li key={group.id}>
                {locked ? (
                  <span>{group.title} (locked)</span>
                ) : (
                  <Link to={`/drills/${group.id}`}>{group.title}</Link>
                )}
                <p>
                  {group.summary}
                  {group.pathGroup ? " Path group." : " Extra group."}
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
