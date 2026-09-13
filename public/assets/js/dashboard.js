import {
  BEGINNER_PATH_ID,
  OPERATOR_PATH_ID,
  appUrl,
  areCasesLocked,
  hrefForRef,
  loadProgress,
  resetProgress,
  switchPath,
} from "./progress.js";

function readJson(id) {
  const node = document.getElementById(id);
  return node ? JSON.parse(node.textContent) : null;
}

export function initDashboard() {
  const root = document.querySelector(".js-dashboard");
  if (!root) return;
  const paths = readJson("learning-paths");
  if (!paths) return;

  const render = () => {
    const progress = loadProgress();
    const operator = progress.pathId === OPERATOR_PATH_ID;
    const path = operator ? paths.operator : paths.beginner;
    const other = operator ? paths.beginner : paths.operator;
    const next = path.milestones.find((node) => progress.milestones[node.id] !== "complete");
    const complete = !next;
    const firstRun = Object.keys(progress.drillScores).length === 0;
    const ctaHref = next ? hrefForRef(next.contentRefs[0]) : appUrl("/track-a");

    root.querySelector(".js-path-title").textContent = path.title;
    root.querySelector(".js-first-run").hidden = !firstRun;
    const returning = root.querySelector(".js-returning");
    returning.hidden = firstRun;
    returning.textContent = path.description;
    root.querySelector(".js-complete").hidden = !complete;
    const nextEl = root.querySelector(".js-next");
    nextEl.hidden = complete;
    if (next) nextEl.textContent = `Next: ${next.title}. ${next.coachTip}`;
    const cta = root.querySelector(".js-cta");
    cta.textContent = complete ? "Browse guides" : "Continue";
    cta.setAttribute("href", ctaHref);

    const gate = root.querySelector(".js-cases-gate");
    if (gate) gate.hidden = !areCasesLocked(progress);

    const list = root.querySelector(".js-milestones");
    list.replaceChildren();
    path.milestones.forEach((node) => {
      const li = document.createElement("li");
      const refs = node.contentRefs
        .map((ref, index) => {
          const sep = index > 0 ? " · " : "";
          return `${sep}<a href="${hrefForRef(ref)}">${ref.replace(":", " ")}</a>`;
        })
        .join("");
      li.innerHTML = `<strong>${node.title}</strong><p>${progress.milestones[node.id] ?? "locked"} · ${node.coachTip}</p><p class="example">${refs}</p>`;
      list.append(li);
    });

    root.querySelector(".js-path-note").textContent = operator
      ? "Operator path: Home names CFO packs. Beginner unlocks are unchanged."
      : "Beginner path does not name CFO packs in the primary CTA.";

    const previewBtn = root.querySelector(".js-preview-switch");
    previewBtn.textContent = `Preview ${other.title}`;
    const preview = root.querySelector(".js-switch-preview");
    preview.querySelector("p").textContent = `Switch to ${other.title}?`;
    const ul = root.querySelector(".js-switch-list");
    ul.replaceChildren();
    other.milestones.forEach((node) => {
      const li = document.createElement("li");
      li.textContent = node.title;
      ul.append(li);
    });
    preview.hidden = true;
    root.querySelector(".js-switch-cta").hidden = false;
    preview.dataset.otherId = other.id;
  };

  root.querySelector(".js-preview-switch")?.addEventListener("click", () => {
    root.querySelector(".js-switch-preview").hidden = false;
    root.querySelector(".js-switch-cta").hidden = true;
  });
  root.querySelector(".js-cancel-switch")?.addEventListener("click", () => {
    root.querySelector(".js-switch-preview").hidden = true;
    root.querySelector(".js-switch-cta").hidden = false;
  });
  root.querySelector(".js-confirm-switch")?.addEventListener("click", () => {
    const otherId = root.querySelector(".js-switch-preview").dataset.otherId;
    switchPath(otherId === OPERATOR_PATH_ID ? OPERATOR_PATH_ID : BEGINNER_PATH_ID);
    render();
  });
  root.querySelector(".js-reset-path")?.addEventListener("click", () => {
    if (window.confirm("Reset this device path? Local only.")) {
      resetProgress();
      render();
    }
  });
  render();
}
