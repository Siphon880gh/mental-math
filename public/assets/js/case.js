import { gradeAnswer, recordCaseComplete } from "./progress.js";
import { isSessionPeekOn } from "./session-peek.js";

export function initCase() {
  const root = document.querySelector(".js-case-player");
  const node = document.getElementById("case-payload");
  if (!root || !node) return;
  const { study, tip } = JSON.parse(node.textContent);
  const form = root.querySelector(".js-case-form");
  if (!form) return;
  const input = form.querySelector("input");
  const submitRow = root.querySelector(".js-case-submit-row");
  const reveal = root.querySelector(".js-case-reveal");
  let submitted = false;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitted) return;
    submitted = true;
    if (!isSessionPeekOn()) recordCaseComplete(study.packId);
    const grade = gradeAnswer(study.expectedAnswer, Number(input.value), study.unit);
    input.disabled = true;
    submitRow.hidden = true;
    reveal.hidden = false;
    reveal.className = `js-case-reveal coach-panel ${grade === "incorrect" ? "coach-wrong" : "coach-success"}`;
    const unit = study.unit ? ` ${study.unit}` : "";
    const steps = study.thoughtChain.map((step) => `<li>${step}</li>`).join("");
    reveal.innerHTML = `<p>${grade} — expected ${study.expectedAnswer}${unit}. SAMPLE debrief.</p><ol>${steps}</ol><p class="example">${tip}</p>`;
  });
}
