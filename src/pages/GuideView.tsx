import { Link, useParams } from "react-router-dom";
import { hasCoachSession } from "../lib/coaching/catalog";
import { getGuide } from "../lib/guides";
import { Markdown } from "../lib/Markdown";
import { hrefForTrack, TRACK_LABEL } from "../lib/tracks";
import { tricksForFamily } from "../lib/tricks";

export default function GuideView() {
  const { slug } = useParams();
  const guide = slug ? getGuide(slug) : undefined;
  if (!guide) {
    return (
      <section>
        <p>That guide is missing.</p>
        <Link to={hrefForTrack("quick")}>Back to Track A</Link>
      </section>
    );
  }
  const trick = tricksForFamily(guide.familyId)[0];
  const coachReady = hasCoachSession(guide.relatedCoachSlug);
  return (
    <article>
      <p className="eyebrow">{TRACK_LABEL[guide.track]}</p>
      {trick ? (
        <div className="shortcut">
          <p className="shortcut-label">Shortcut</p>
          <p>
            <strong>{trick.title}.</strong> {trick.rule}
          </p>
          <p className="example">{trick.example}</p>
        </div>
      ) : null}
      <Markdown source={guide.body} />
      <aside className="coach-cta">
        <h3>Step-by-step coach</h3>
        <p>
          Same slug as this guide. Walk the method: wrong choice explains, then
          rewinds.
        </p>
        <p>
          <Link to={`/coach/${guide.relatedCoachSlug}`}>
            Open coach: {guide.relatedCoachSlug}
          </Link>
          {" · "}
          <Link to="/drills">Drills</Link>
          {" · "}
          <Link to="/games">Games</Link>
        </p>
        {coachReady ? null : (
          <p className="example">
            The decision tree is not authored yet. The page stays so every guide
            already has a coach slot.
          </p>
        )}
      </aside>
      <p>
        <Link to={hrefForTrack(guide.track)}>
          {guide.track === "quick" ? "Track A" : "Track B"}
        </Link>
      </p>
    </article>
  );
}
