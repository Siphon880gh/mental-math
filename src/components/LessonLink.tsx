import { Link } from "react-router-dom";
import { guideForFamily, hrefForFamilyGuide } from "../lib/guides";
import type { FamilyId } from "../lib/tricks";

export function LessonLink({
  familyId,
  children,
}: {
  familyId: FamilyId;
  children?: string;
}) {
  const href = hrefForFamilyGuide(familyId);
  const guide = guideForFamily(familyId);
  const label = children ?? familyId;
  if (!href) return <span>{label}</span>;
  return (
    <Link
      to={href}
      target="_blank"
      rel="noopener noreferrer"
      className="lesson-link"
      title={guide ? `Open “${guide.title}” in a new window` : `Open ${label} in a new window`}
      aria-label={`${label}, opens in a new window`}
    >
      {label}
      <span className="lesson-link__ext" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}

export function SkillLinks({
  ids,
  label = "Skills in play",
}: {
  ids: FamilyId[];
  label?: string | null;
}) {
  if (ids.length === 0) return null;
  return (
    <span className="skill-line">
      {label ? <span className="skill-line__label">{label}: </span> : null}
      {ids.map((id, index) => (
        <span key={id}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          <LessonLink familyId={id} />
        </span>
      ))}
    </span>
  );
}
