import { Link } from "react-router-dom";
import SessionPeekBanner from "../components/SessionPeekBanner";
import { useSessionPeek } from "../components/useSessionPeek";
import { DRILL_GROUPS } from "../lib/drillData";
import { isPathDrillLocked, loadProgress } from "../lib/progressStore";

export default function Drills() {
  const progress = loadProgress();
  const { peek, enable, disable } = useSessionPeek();
  const anyLocked = DRILL_GROUPS.some((group) => isPathDrillLocked(group.id, progress));

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
      <ul className="cards">
        {DRILL_GROUPS.map((group) => {
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
            </li>
          );
        })}
      </ul>
    </section>
  );
}
