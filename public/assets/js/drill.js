import { appUrl, gradeAnswer, isPathDrillLocked, loadProgress, median, recordDrillGroup } from "./progress.js";
import { isSessionPeekOn } from "./session-peek.js";

export function initDrill() {
  const root = document.querySelector(".js-drill-player");
  const payloadNode = document.getElementById("drill-payload");
  if (!root || !payloadNode) return;
  const payload = JSON.parse(payloadNode.textContent);
  const { group, items } = payload;
  if (!items.length) return;

  const gated = isPathDrillLocked(group.id);
  if (gated) {
    /* play UI stays hidden until peek / unlock; still bind so peek works */
  }

  const run = root.querySelector(".js-drill-run");
  const done = root.querySelector(".js-drill-done");
  const meta = root.querySelector(".js-drill-meta");
  const prompt = root.querySelector(".js-drill-prompt");
  const skill = root.querySelector(".js-drill-skill");
  const unit = root.querySelector(".js-drill-unit");
  const form = root.querySelector(".js-drill-form");
  const input = form.querySelector("input");
  const submitRow = root.querySelector(".js-drill-submit-row");
  const reveal = root.querySelector(".js-drill-reveal");

  let index = 0;
  let started = Date.now();
  let revealed = false;
  const grades = [];
  const latencies = [];

  const tick = () => {
    const elapsed = Math.round((Date.now() - started) / 100) / 10;
    meta.textContent = `${group.title} · ${index + 1}/${items.length} · ${elapsed}s`;
  };
  window.setInterval(tick, 250);

  const showItem = () => {
    const item = items[index];
    tick();
    prompt.textContent = item.prompt;
    skill.innerHTML = `Skill: <a class="lesson-link" href="${appUrl(`/guides/${item.familyId}`)}" target="_blank" rel="noopener noreferrer" aria-label="${item.familyId}, opens in a new window">${item.familyId}<span class="lesson-link__ext" aria-hidden="true">↗</span></a>`;
    if (item.unit) {
      unit.hidden = false;
      unit.textContent = `Unit: ${item.unit}`;
    } else {
      unit.hidden = true;
    }
    input.value = "";
    input.disabled = false;
    submitRow.hidden = false;
    reveal.hidden = true;
    revealed = false;
    started = Date.now();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (revealed) return;
    const item = items[index];
    const given = Number(input.value);
    const grade = gradeAnswer(item.expectedAnswer, given, item.unit);
    grades.push(grade);
    latencies.push(Date.now() - started);
    revealed = true;
    input.disabled = true;
    submitRow.hidden = true;
    const wrong = grade === "incorrect";
    reveal.hidden = false;
    reveal.className = `js-drill-reveal coach-panel ${wrong ? "coach-wrong" : "coach-success"}`;
    const steps = item.thoughtChain.map((step) => `<li>${step}</li>`).join("");
    const nextLabel = index + 1 >= items.length ? "Finish" : "Next";
    reveal.innerHTML = `<p>${grade} — expected ${item.expectedAnswer}</p><ol>${steps}</ol><p class="coach-controls"><button type="button" class="js-drill-next">${nextLabel}</button></p>`;
  });

  root.addEventListener("click", (event) => {
    if (!event.target.closest(".js-drill-next")) return;
    if (index + 1 >= items.length) {
      const correct = grades.filter((g) => g === "correct" || g === "close").length;
      if (!isSessionPeekOn()) {
        recordDrillGroup(group.id, {
          correct,
          total: items.length,
          medianLatencyMs: median(latencies),
        });
      }
      const stored = loadProgress().drillScores[group.id];
      const score = stored ?? {
        correct,
        total: items.length,
        medianLatencyMs: median(latencies),
      };
      run.hidden = true;
      done.hidden = false;
      done.innerHTML = `<h2>${group.title} complete</h2><p>${score.correct}/${score.total} with median ${Math.round((score.medianLatencyMs ?? 0) / 100) / 10}s. SAMPLE only.</p><p><a href="${appUrl("/drills")}">All drills</a> · <a href="${appUrl("/")}">Home</a></p>`;
      return;
    }
    index += 1;
    showItem();
  });

  showItem();
}
