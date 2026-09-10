import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TRACK_LABEL, TRACK_NAV, type TrackId } from "../lib/tracks";

function activeTrackForPath(pathname: string): TrackId | null {
  if (pathname.startsWith(TRACK_NAV.quick.href)) return "quick";
  if (pathname.startsWith(TRACK_NAV.stakeholder.href)) return "stakeholder";
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
      >
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
          data-visible={showing !== null && !stuck}
          aria-live="polite"
        >
          <span key={showing ?? "empty"} className="site-nav__caption-text">
            {showing ? TRACK_LABEL[showing] : "\u00A0"}
          </span>
        </p>
      </nav>
    </>
  );
}
