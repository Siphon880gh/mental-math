export type PassGroupId = "first-pass" | "second-pass";

export interface PassTag {
  id: string;
  group: PassGroupId;
  label: string;
  color: string;
}

export const PASS_TAG_GROUPS: { id: PassGroupId; label: string }[] = [
  { id: "first-pass", label: "First-Pass Tag" },
  { id: "second-pass", label: "Second-Pass Tag" },
];

/** Same preset labels as leetcode-coach (algos) user tags. */
export const PASS_TAGS: PassTag[] = [
  {
    id: "first-no-stick",
    group: "first-pass",
    label: "Might not have stick for the most part",
    color: "#9a3412",
  },
  {
    id: "first-maybe-stick",
    group: "first-pass",
    label: "Might not have stick or might have stick",
    color: "#1d4ed8",
  },
  {
    id: "first-attention",
    group: "first-pass",
    label: "Couldn't keep attention on it",
    color: "#57534e",
  },
  {
    id: "first-ready",
    group: "first-pass",
    label: "Ready to transition",
    color: "#0f766e",
  },
  {
    id: "extreme",
    group: "second-pass",
    label: "Need extreme review",
    color: "#c23a2b",
  },
  {
    id: "much",
    group: "second-pass",
    label: "Need much review",
    color: "#d97706",
  },
  {
    id: "unsure",
    group: "second-pass",
    label: "Unsure if need review or that it sticks",
    color: "#7c3aed",
  },
  {
    id: "pass",
    group: "second-pass",
    label: "Confident Pass",
    color: "#166534",
  },
];

export const PASS_TAGS_KEY = "reflex_core_pass_tags_v1";
export const PASS_FILTERS_KEY = "reflex_core_pass_filters_v1";

export type AppliedMap = Record<string, string[]>;
export type FilterMap = Record<string, string[]>;

function memory(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function readJson<T>(key: string, fallback: T): T {
  const raw = memory()?.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  memory()?.setItem(key, JSON.stringify(value));
}

export function getPassTag(id: string): PassTag | undefined {
  return PASS_TAGS.find((tag) => tag.id === id);
}

export function tagsInGroup(group: PassGroupId): PassTag[] {
  return PASS_TAGS.filter((tag) => tag.group === group);
}

export function loadAppliedTags(): AppliedMap {
  const parsed = readJson<AppliedMap>(PASS_TAGS_KEY, {});
  return parsed && typeof parsed === "object" ? parsed : {};
}

export function loadPassFilters(): FilterMap {
  const parsed = readJson<FilterMap>(PASS_FILTERS_KEY, {});
  return parsed && typeof parsed === "object" ? parsed : {};
}

export function tagsForResource(key: string, applied = loadAppliedTags()): string[] {
  return applied[key] ?? [];
}

export function filtersForSection(section: string, filters = loadPassFilters()): string[] {
  return filters[section] ?? [];
}

export function toggleResourceTag(key: string, tagId: string): AppliedMap {
  const applied = loadAppliedTags();
  const current = new Set(applied[key] ?? []);
  if (current.has(tagId)) current.delete(tagId);
  else current.add(tagId);
  const next = { ...applied, [key]: [...current] };
  if (next[key]!.length === 0) delete next[key];
  writeJson(PASS_TAGS_KEY, next);
  return next;
}

export function toggleSectionFilter(section: string, tagId: string): FilterMap {
  const filters = loadPassFilters();
  const current = new Set(filters[section] ?? []);
  if (current.has(tagId)) current.delete(tagId);
  else current.add(tagId);
  const next = { ...filters, [section]: [...current] };
  if (next[section]!.length === 0) delete next[section];
  writeJson(PASS_FILTERS_KEY, next);
  return next;
}

export function clearSectionFilters(section: string): FilterMap {
  const filters = loadPassFilters();
  const next = { ...filters };
  delete next[section];
  writeJson(PASS_FILTERS_KEY, next);
  return next;
}

/** OR match: any selected filter tag on the resource. No filters → show all. */
export function resourceMatchesFilters(
  key: string,
  section: string,
  applied = loadAppliedTags(),
  filters = loadPassFilters(),
): boolean {
  const selected = filtersForSection(section, filters);
  if (selected.length === 0) return true;
  const tags = tagsForResource(key, applied);
  return selected.some((id) => tags.includes(id));
}
