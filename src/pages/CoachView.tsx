import { useEffect, useId, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ResourcePageTagger } from "../components/PassTags";
import {
  buildPathTrail,
  canStepBack,
  choose,
  currentNode,
  ensureKnownNode,
  getCoachingPersistAdapter,
  initialNavState,
  loadSession,
  restart,
  stepBack,
  type CoachingNavState,
} from "../lib/coaching";
import { getGuide } from "../lib/guides";
import { hrefForTrack, TRACK_LABEL } from "../lib/tracks";

function commitNav(
  slug: string,
  next: CoachingNavState,
  setNav: (s: CoachingNavState) => void,
  clear?: boolean,
): void {
  const adapter = getCoachingPersistAdapter();
  if (clear) adapter.clear(slug);
  else adapter.save(slug, next);
  setNav(next);
}

export default function CoachView() {
  const { slug } = useParams();
  const guide = slug ? getGuide(slug) : undefined;
  const loaded = slug ? loadSession(slug) : { ok: false as const, error: "not_found" as const };
  const messageId = useId();
  const messageRef = useRef<HTMLDivElement>(null);
  const skipFocusOnce = useRef(true);
  const [nav, setNav] = useState<CoachingNavState | null>(null);
  const [trailOpen, setTrailOpen] = useState(true);

  useEffect(() => {
    if (!slug) {
      setNav(null);
      return;
    }
    const r = loadSession(slug);
    if (!r.ok) {
      setNav(null);
      return;
    }
    skipFocusOnce.current = true;
    setNav(getCoachingPersistAdapter().load(slug, r.session.tree));
  }, [slug]);

  const currentNodeId = nav?.currentNodeId;
  useEffect(() => {
    if (!currentNodeId) return;
    if (skipFocusOnce.current) {
      skipFocusOnce.current = false;
      return;
    }
    messageRef.current?.focus();
  }, [currentNodeId]);

  if (!slug) {
    return (
      <section>
        <p>Missing coach slug.</p>
        <Link to={hrefForTrack("quick")}>Track A</Link>
      </section>
    );
  }

  if (!loaded.ok) {
    return (
      <section>
        <p className="eyebrow">
          {guide ? TRACK_LABEL[guide.track] : "Step-by-step coach"}
        </p>
        <h2>{guide ? `${guide.title} — coach` : slug}</h2>
        <p>
          Step-by-step coach for this guide is not authored yet. The page stays
          so every guide already has a coach slot.
        </p>
        {guide ? (
          <ResourcePageTagger
            resourceKey={`guide:${guide.slug}`}
            section={guide.track === "quick" ? "track-a" : "track-b"}
          />
        ) : null}
        <p>
          {guide ? (
            <>
              <Link to={`/guides/${guide.slug}`}>Back to guide</Link>
              {" · "}
            </>
          ) : null}
          <Link to={hrefForTrack(guide?.track ?? "quick")}>
            {guide?.track === "stakeholder" ? "Track B" : "Track A"}
          </Link>
        </p>
      </section>
    );
  }

  const { session } = loaded;
  const tree = session.tree;
  const state = nav ? ensureKnownNode(tree, nav) : initialNavState(tree);
  const node = currentNode(tree, state);
  if (!node) {
    return (
      <section>
        <p>Could not restore this coaching step.</p>
        <Link to={hrefForTrack("quick")}>Track A</Link>
      </section>
    );
  }

  const trail = buildPathTrail(tree, state);
  const backAvailable = canStepBack(tree, state);
  const showChoices = node.outcome === "continue" && node.choices.length > 0;

  return (
    <section className="coach">
      <p className="eyebrow">{guide ? TRACK_LABEL[guide.track] : "Step-by-step coach"}</p>
      <h2>{session.meta.title}</h2>
      <p className="example">{session.meta.summary}</p>

      <div
        className={`coach-panel coach-${node.outcome}`}
        id={messageId}
        ref={messageRef}
        tabIndex={-1}
      >
        <p className="shortcut-label">
          {node.outcome === "continue"
            ? "Decide"
            : node.outcome === "wrong"
              ? "Wrong · review"
              : "Success"}
        </p>
        <p className="coach-message">{node.message}</p>
      </div>

      {showChoices ? (
        <ul className="coach-choices">
          {node.choices.map((choice) => (
            <li key={choice.id}>
              <button
                type="button"
                onClick={() => {
                  const result = choose(session, state.currentNodeId, choice.id, state.history);
                  if (result.ok) commitNav(slug, result.state, setNav);
                }}
              >
                {choice.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="coach-controls">
        {node.outcome === "wrong" ? (
          <button
            type="button"
            onClick={() => {
              const result = stepBack(tree, state);
              if (result.ok) commitNav(slug, result.state, setNav);
            }}
          >
            Rewind and try again
          </button>
        ) : null}
        {node.outcome !== "wrong" && backAvailable ? (
          <button
            type="button"
            onClick={() => {
              const result = stepBack(tree, state);
              if (result.ok) commitNav(slug, result.state, setNav);
            }}
          >
            Step back
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => commitNav(slug, restart(tree), setNav, true)}
        >
          Restart
        </button>
      </p>

      <details className="coach-trail" open={trailOpen} onToggle={(e) => {
        setTrailOpen((e.target as HTMLDetailsElement).open);
      }}>
        <summary>Path trail</summary>
        <ol>
          {trail.map((step) => (
            <li key={`${step.index}-${step.nodeId}`} className={step.isCurrent ? "current" : undefined}>
              <span>{step.choiceLabel ? `${step.choiceLabel} → ` : ""}</span>
              {step.isCurrent ? "You are here" : step.outcome}
            </li>
          ))}
        </ol>
      </details>

      {guide ? (
        <ResourcePageTagger
          resourceKey={`guide:${guide.slug}`}
          section={guide.track === "quick" ? "track-a" : "track-b"}
        />
      ) : null}

      <p>
        {guide ? (
          <>
            <Link to={`/guides/${guide.slug}`}>Back to guide</Link>
            {" · "}
          </>
        ) : null}
        <Link to={hrefForTrack(guide?.track ?? "quick")}>
          {guide?.track === "stakeholder" ? "Track B" : "Track A"}
        </Link>
      </p>
    </section>
  );
}
