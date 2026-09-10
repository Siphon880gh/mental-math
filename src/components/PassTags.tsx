import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  PASS_TAG_GROUPS,
  getPassTag,
  tagsInGroup,
  type PassGroupId,
} from "../lib/passTags";

const GROUP_ICON: Record<PassGroupId, string> = {
  "first-pass": "①",
  "second-pass": "②",
};

function usePopover(): {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  ref: React.RefObject<HTMLDivElement | null>;
} {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      const node = ref.current;
      if (!node) return;
      if (!node.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return { open, setOpen, ref };
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="tag-swatch"
      aria-hidden="true"
      style={{ "--tag": color } as CSSProperties}
    />
  );
}

function TagRow({
  label,
  color,
  on,
  onClick,
}: {
  label: string;
  color: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={on ? "tag-row is-on" : "tag-row"}
      aria-pressed={on}
      onClick={onClick}
    >
      <Swatch color={color} />
      <span className="tag-row__label">{label}</span>
      {on ? (
        <span className="tag-row__mark" aria-hidden="true">
          ✓
        </span>
      ) : null}
    </button>
  );
}

function TagGroups({
  applied,
  onToggle,
}: {
  applied: string[];
  onToggle: (tagId: string) => void;
}) {
  return (
    <>
      {PASS_TAG_GROUPS.map((group) => (
        <section key={group.id} className="tag-group">
          <p className="tag-group__label">
            <span aria-hidden="true">{GROUP_ICON[group.id]}</span> {group.label}
          </p>
          <ul className="tag-list">
            {tagsInGroup(group.id).map((tag) => (
              <li key={tag.id}>
                <TagRow
                  label={tag.label}
                  color={tag.color}
                  on={applied.includes(tag.id)}
                  onClick={() => onToggle(tag.id)}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

export function PassFilterBar({
  selected,
  onToggle,
  onClear,
}: {
  selected: string[];
  onToggle: (tagId: string) => void;
  onClear: () => void;
}) {
  const { open, setOpen, ref } = usePopover();
  const active = selected.length > 0;
  return (
    <div className="pop pop--filter" ref={ref}>
      <button
        type="button"
        className={active ? "pop__btn has-filter" : "pop__btn"}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="pop__caret" aria-hidden="true">
          ⌄
        </span>
        Filter
        {active ? <span className="pop__count">{selected.length}</span> : null}
      </button>
      <div
        className="pop__panel"
        hidden={!open}
        role="dialog"
        aria-label="Filter by tag"
      >
        <TagGroups applied={selected} onToggle={onToggle} />
        <div className="pop__foot">
          <button
            type="button"
            className="tag-clear"
            onClick={onClear}
            disabled={!active}
          >
            Clear tags
          </button>
        </div>
      </div>
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
  const { open, setOpen, ref } = usePopover();
  return (
    <div className="tags-row" ref={ref}>
      {appliedIds.map((id) => {
        const tag = getPassTag(id);
        if (!tag) return null;
        return (
          <button
            key={id}
            type="button"
            className="tag-chip"
            title={`Remove ${tag.label}`}
            aria-label={`Remove tag: ${tag.label}`}
            style={{ "--tag": tag.color } as CSSProperties}
            onClick={() => onToggle(resourceKey, id)}
          >
            <span className="tag-chip__dot" aria-hidden="true" />
            <span className="tag-chip__label">{tag.label}</span>
            <span className="tag-chip__x" aria-hidden="true">
              ×
            </span>
          </button>
        );
      })}
      <div className="pop pop--tags">
        <button
          type="button"
          className={appliedIds.length > 0 ? "tag-add is-attached" : "tag-add"}
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((prev) => !prev)}
        >
          + Tag
        </button>
        <div
          className="pop__panel pop__panel--tags"
          hidden={!open}
          role="dialog"
          aria-label="Add tag"
        >
          <TagGroups
            applied={appliedIds}
            onToggle={(tagId) => onToggle(resourceKey, tagId)}
          />
        </div>
      </div>
    </div>
  );
}
