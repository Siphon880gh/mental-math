const TAGS_KEY = "reflex_core_pass_tags_v1";
const FILTERS_KEY = "reflex_core_pass_filters_v1";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function catalog() {
  const node = document.getElementById("pass-tags-catalog");
  return node ? JSON.parse(node.textContent) : [];
}

export function loadApplied() {
  return readJson(TAGS_KEY, {});
}

export function loadFilters() {
  return readJson(FILTERS_KEY, {});
}

export function toggleResourceTag(key, tagId) {
  const applied = loadApplied();
  const current = new Set(applied[key] ?? []);
  if (current.has(tagId)) current.delete(tagId);
  else current.add(tagId);
  const next = { ...applied, [key]: [...current] };
  if (next[key].length === 0) delete next[key];
  writeJson(TAGS_KEY, next);
  return next;
}

export function toggleSectionFilter(section, tagId) {
  const filters = loadFilters();
  const current = new Set(filters[section] ?? []);
  if (current.has(tagId)) current.delete(tagId);
  else current.add(tagId);
  const next = { ...filters, [section]: [...current] };
  if (next[section].length === 0) delete next[section];
  writeJson(FILTERS_KEY, next);
  return next;
}

export function clearSectionFilters(section) {
  const filters = loadFilters();
  const next = { ...filters };
  delete next[section];
  writeJson(FILTERS_KEY, next);
  return next;
}

export function resourceMatchesFilters(key, section, applied = loadApplied(), filters = loadFilters()) {
  const selected = filters[section] ?? [];
  if (selected.length === 0) return true;
  const tags = applied[key] ?? [];
  return selected.some((id) => tags.includes(id));
}

function bindPopover(root, toggleBtn) {
  const panel = root.querySelector(".pop__panel");
  const close = () => {
    if (panel) panel.hidden = true;
    toggleBtn?.setAttribute("aria-expanded", "false");
  };
  toggleBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = panel?.hidden;
    document.querySelectorAll(".pop__panel").forEach((el) => {
      el.hidden = true;
    });
    document.querySelectorAll("[aria-haspopup='dialog']").forEach((el) => {
      el.setAttribute("aria-expanded", "false");
    });
    if (panel) panel.hidden = !open;
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("mousedown", (event) => {
    if (!root.contains(event.target)) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function paintRows(root, appliedIds) {
  root.querySelectorAll(".js-tag-row").forEach((btn) => {
    const on = appliedIds.includes(btn.dataset.tagId);
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    const mark = btn.querySelector(".tag-row__mark");
    if (mark) mark.hidden = !on;
  });
}

function chipHtml(tag) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tag-chip";
  btn.title = `Remove ${tag.label}`;
  btn.setAttribute("aria-label", `Remove tag: ${tag.label}`);
  btn.style.setProperty("--tag", tag.color);
  btn.dataset.tagId = tag.id;
  btn.innerHTML =
    '<span class="tag-chip__dot" aria-hidden="true"></span>' +
    `<span class="tag-chip__label">${tag.label}</span>` +
    '<span class="tag-chip__x" aria-hidden="true">×</span>';
  return btn;
}

function refreshTaggers() {
  const applied = loadApplied();
  const tags = catalog();
  document.querySelectorAll(".js-tagger").forEach((root) => {
    const key = root.dataset.resourceKey;
    const ids = applied[key] ?? [];
    const holder = root.querySelector(".js-tag-chips");
    if (holder) {
      holder.replaceChildren();
      ids.forEach((id) => {
        const tag = tags.find((t) => t.id === id);
        if (!tag) return;
        const chip = chipHtml(tag);
        chip.addEventListener("click", () => {
          toggleResourceTag(key, id);
          refreshTaggers();
          applyFilters();
        });
        holder.append(chip);
      });
    }
    paintRows(root, ids);
    const add = root.querySelector(".js-tag-add");
    add?.classList.toggle("is-attached", ids.length > 0);
  });
}

function applyFilters() {
  document.querySelectorAll("[data-filter-section]").forEach((section) => {
    const name = section.dataset.filterSection;
    const selected = loadFilters()[name] ?? [];
    const bar = section.querySelector(".js-filter");
    const btn = bar?.querySelector(".js-filter-btn");
    const count = bar?.querySelector(".js-filter-count");
    const clear = bar?.querySelector(".js-filter-clear");
    btn?.classList.toggle("has-filter", selected.length > 0);
    if (count) {
      count.hidden = selected.length === 0;
      count.textContent = String(selected.length);
    }
    if (clear) clear.disabled = selected.length === 0;
    paintRows(bar ?? section, selected);

    const cards = [...section.querySelectorAll(".cards")];
    cards.forEach((list) => {
      const items = [...list.querySelectorAll(":scope > li[data-resource-key]")];
      items.forEach((li) => {
        const ok = resourceMatchesFilters(li.dataset.resourceKey, name);
        li.classList.toggle("is-filtered-out", !ok);
      });
      const empty = section.querySelector(".js-empty-filter");
      const visible = items.filter((li) => !li.classList.contains("is-filtered-out"));
      if (empty && items.length) {
        const blockEmpty = list.parentElement?.querySelector(".js-empty-filter");
        const target = blockEmpty ?? empty;
        if (list.closest(".track-block")) {
          if (blockEmpty) blockEmpty.hidden = visible.length > 0;
        } else {
          empty.hidden = visible.length > 0;
        }
      }
    });
  });
}

export function initPassTags() {
  document.querySelectorAll(".js-filter").forEach((root) => {
    bindPopover(root, root.querySelector(".js-filter-btn"));
    const section = root.closest("[data-filter-section]")?.dataset.filterSection;
    root.querySelectorAll(".js-tag-row").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!section) return;
        toggleSectionFilter(section, btn.dataset.tagId);
        applyFilters();
      });
    });
    root.querySelector(".js-filter-clear")?.addEventListener("click", () => {
      if (!section) return;
      clearSectionFilters(section);
      applyFilters();
    });
  });
  document.querySelectorAll(".js-tagger").forEach((root) => {
    bindPopover(root, root.querySelector(".js-tag-add"));
    root.querySelectorAll(".js-tag-row").forEach((btn) => {
      btn.addEventListener("click", () => {
        toggleResourceTag(root.dataset.resourceKey, btn.dataset.tagId);
        refreshTaggers();
        applyFilters();
      });
    });
  });
  refreshTaggers();
  applyFilters();
}
