import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getGuide } from "../lib/guides";
import { getScenario } from "../lib/scenarios";
import {
  TRACK_A_FAMILY_IDS,
  TRACK_B_FAMILY_IDS,
  TRACK_LABEL,
  TRACK_NAV,
  type TrackId,
} from "../lib/tracks";

function slugAfter(pathname: string, prefix: string): string | null {
  if (!pathname.startsWith(prefix)) return null;
  const slug = pathname.slice(prefix.length).split("/")[0];
  return slug || null;
}

function activeTrackForPath(pathname: string): TrackId | null {
  if (pathname === TRACK_NAV.quick.href || pathname.startsWith(`${TRACK_NAV.quick.href}/`)) {
    return "quick";
  }
  if (
    pathname === TRACK_NAV.stakeholder.href ||
    pathname.startsWith(`${TRACK_NAV.stakeholder.href}/`)
  ) {
    return "stakeholder";
  }
  const guideSlug = slugAfter(pathname, "/guides/");
  if (guideSlug) return getGuide(guideSlug)?.track ?? null;
  const coachSlug = slugAfter(pathname, "/coach/");
  if (coachSlug) {
    if ((TRACK_B_FAMILY_IDS as readonly string[]).includes(coachSlug)) return "stakeholder";
    if ((TRACK_A_FAMILY_IDS as readonly string[]).includes(coachSlug)) return "quick";
    return null;
  }
  const scenarioId = slugAfter(pathname, "/scenarios/");
  if (scenarioId) return getScenario(scenarioId)?.track ?? null;
  return null;
}

export default function SiteNav() {
  const location = useLocation();
  const [hovered, setHovered] = useState<TrackId | null>(null);
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const active = activeTrackForPath(location.pathname);
  const showing: TrackId | null = hovered ?? active;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: [1] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const trackHandlers = (id: TrackId) => ({
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(id),
    onBlur: () => setHovered(null),
  });

  return (
    <>
      <div
        ref={sentinelRef}
        className="site-nav__sentinel"
        aria-hidden="true"
      />
      <nav
        className={stuck ? "site-nav is-stuck" : "site-nav"}
        aria-label="Primary"
        data-stuck={stuck ? "true" : "false"}
        data-caption={showing ? "true" : "false"}
      >
        <div className="site-nav__inner">
          <ul className="site-nav__row">
            <li>
              <Link
                to={TRACK_NAV.quick.href}
                className={active === "quick" ? "is-current" : undefined}
                {...trackHandlers("quick")}
              >
                {TRACK_NAV.quick.label}
              </Link>
            </li>
            <li>
              <Link
                to={TRACK_NAV.stakeholder.href}
                className={active === "stakeholder" ? "is-current" : undefined}
                {...trackHandlers("stakeholder")}
              >
                {TRACK_NAV.stakeholder.label}
              </Link>
            </li>
            <li>
              <Link to="/drills">Drills</Link>
            </li>
            <li>
              <Link to="/cases">Cases</Link>
            </li>
            <li>
              <Link to="/scenarios">Scenarios</Link>
            </li>
            <li>
              <Link to="/games">Games</Link>
            </li>
          </ul>
          <p
            className="site-nav__caption"
            data-visible={showing !== null}
            aria-live="polite"
          >
            <span key={showing ?? "empty"} className="site-nav__caption-text">
              {showing ? TRACK_LABEL[showing] : "\u00A0"}
            </span>
          </p>
        </div>
      </nav>
    </>
  );
}
