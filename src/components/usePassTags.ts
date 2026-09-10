import { useState } from "react";
import {
  clearSectionFilters,
  filtersForSection,
  loadAppliedTags,
  loadPassFilters,
  resourceMatchesFilters,
  tagsForResource,
  toggleResourceTag,
  toggleSectionFilter,
  type AppliedMap,
  type FilterMap,
} from "../lib/passTags";

export function usePassTags(section: string) {
  const [applied, setApplied] = useState<AppliedMap>(() => loadAppliedTags());
  const [filters, setFilters] = useState<FilterMap>(() => loadPassFilters());
  const selected = filtersForSection(section, filters);

  return {
    selected,
    tagsFor: (key: string) => tagsForResource(key, applied),
    matches: (key: string) => resourceMatchesFilters(key, section, applied, filters),
    toggleTag: (key: string, tagId: string) => setApplied(toggleResourceTag(key, tagId)),
    toggleFilter: (tagId: string) => setFilters(toggleSectionFilter(section, tagId)),
    clearFilters: () => setFilters(clearSectionFilters(section)),
  };
}
