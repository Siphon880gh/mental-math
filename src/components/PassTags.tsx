import { type CSSProperties } from "react";
import {
  PASS_TAG_GROUPS,
  PASS_TAGS,
  getPassTag,
} from "../lib/passTags";

export function PassFilterBar({
  selected,
  onToggle,
  onClear,
}: {
  selected: string[];
  onToggle: (tagId: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="pass-filters">
      {PASS_TAG_GROUPS.map((group) => (
        <fieldset key={group.id} className="pass-group">
          <legend>{group.label}</legend>
          <div className="pass-chips">
            {PASS_TAGS.filter((tag) => tag.group === group.id).map((tag) => {
              const on = selected.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  className={on ? "pass-chip is-on" : "pass-chip"}
                  aria-pressed={on}
                  style={{ "--tag": tag.color } as CSSProperties}
                  onClick={() => onToggle(tag.id)}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      {selected.length > 0 ? (
        <p className="coach-controls">
          <button type="button" onClick={onClear}>
            Clear tags
          </button>
        </p>
      ) : null}
    </div>
  );
}

export function ResourceTagger({
  resourceKey,
  appliedIds,
  onToggle,
}: {
  resourceKey: string;
  appliedIds: string[];
  onToggle: (key: string, tagId: string) => void;
}) {
  return (
    <details className="tagger">
      <summary>Tag</summary>
      <div className="tagger-applied">
        {appliedIds.map((id) => {
          const tag = getPassTag(id);
          if (!tag) return null;
          return (
            <button
              key={id}
              type="button"
              className="pass-chip is-on"
              style={{ "--tag": tag.color } as CSSProperties}
              onClick={() => onToggle(resourceKey, id)}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
      {PASS_TAG_GROUPS.map((group) => (
        <fieldset key={group.id} className="pass-group">
          <legend>{group.label}</legend>
          <div className="pass-chips">
            {PASS_TAGS.filter((tag) => tag.group === group.id).map((tag) => {
              const on = appliedIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  className={on ? "pass-chip is-on" : "pass-chip"}
                  aria-pressed={on}
                  style={{ "--tag": tag.color } as CSSProperties}
                  onClick={() => onToggle(resourceKey, tag.id)}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </details>
  );
}
