export function initScenario() {
  const root = document.querySelector(".js-scenario");
  const node = document.getElementById("scenario-payload");
  if (!root || !node) return;
  const study = JSON.parse(node.textContent);
  let hintCount = 0;
  let cheated = false;
  let picked = null;
  const hints = root.querySelector(".js-hints");
  const skills = root.querySelector(".js-scenario-skills");
  const cheat = root.querySelector(".js-cheat-text");
  const hintBtn = root.querySelector(".js-hint");
  const cheatBtn = root.querySelector(".js-cheat");
  const feedback = root.querySelector(".js-scenario-feedback");

  const revealSkills = () => {
    if (hintCount > 0 || cheated) skills.hidden = false;
  };

  hintBtn.addEventListener("click", () => {
    hintCount = Math.min(study.hints.length, hintCount + 1);
    hints.hidden = false;
    hints.replaceChildren();
    study.hints.slice(0, hintCount).forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      hints.append(li);
    });
    if (hintCount >= study.hints.length) hintBtn.disabled = true;
    revealSkills();
  });
  cheatBtn.addEventListener("click", () => {
    cheated = true;
    cheat.hidden = false;
    cheat.textContent = study.cheat;
    cheatBtn.disabled = true;
    revealSkills();
    paintChoices();
  });

  const paintChoices = () => {
    root.querySelectorAll(".choice").forEach((btn) => {
      const selected = picked === btn.dataset.choiceId;
      const reveal = cheated || picked !== null;
      btn.classList.toggle("is-picked", selected);
      btn.classList.toggle("is-correct", reveal && btn.dataset.correct === "1");
      btn.classList.toggle("is-wrong", selected && btn.dataset.correct !== "1");
    });
    if (!picked) {
      feedback.hidden = true;
      return;
    }
    const choice = study.choices.find((row) => row.id === picked);
    feedback.hidden = false;
    feedback.className = choice.correct ? "js-scenario-feedback coach-panel coach-success" : "js-scenario-feedback coach-panel coach-wrong";
    feedback.textContent = choice.correct
      ? "Correct. SAMPLE only."
      : "Not that one. Hint, cheat, or pick again.";
  };

  root.querySelectorAll(".choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      picked = btn.dataset.choiceId;
      paintChoices();
    });
  });
}
