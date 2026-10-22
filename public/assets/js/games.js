import { elevenRound } from "./eleven.js";

export function initGames() {
  const shift = document.querySelector(".js-game-decimal");
  if (shift) {
    const START = 8500;
    let places = 0;
    const value = shift.querySelector(".js-shift-value");
    const win1 = shift.querySelector(".js-win-1");
    const win10 = shift.querySelector(".js-win-10");
    const paint = () => {
      value.textContent = String(START / 10 ** places);
      win10.hidden = places !== 1;
      win1.hidden = places !== 2;
    };
    shift.querySelector(".js-shift-left").addEventListener("click", () => {
      places = Math.min(4, places + 1);
      paint();
    });
    shift.querySelector(".js-shift-right").addEventListener("click", () => {
      places = Math.max(0, places - 1);
      paint();
    });
    shift.querySelector(".js-shift-reset").addEventListener("click", () => {
      places = 0;
      paint();
    });
  }

  const swap = document.querySelector(".js-game-swap");
  if (swap) {
    let swapped = false;
    let halved = false;
    const msg = swap.querySelector(".js-swap-msg");
    const half = swap.querySelector(".js-half");
    const win = swap.querySelector(".js-swap-win");
    const paint = () => {
      msg.textContent = (swapped ? "50% of 14" : "14% of 50") + (halved ? " = 7" : "");
      swap.querySelector(".js-swap").disabled = swapped;
      half.disabled = !swapped || halved;
      win.hidden = !halved;
    };
    swap.querySelector(".js-swap").addEventListener("click", () => {
      swapped = true;
      paint();
    });
    half.addEventListener("click", () => {
      if (swapped) halved = true;
      paint();
    });
    swap.querySelector(".js-swap-reset").addEventListener("click", () => {
      swapped = false;
      halved = false;
      paint();
    });
  }

  const chips = document.querySelector(".js-game-chips");
  if (chips) {
    const TARGET = 35;
    const base = 2000;
    let sum = 0;
    const status = chips.querySelector(".js-chip-status");
    const win = chips.querySelector(".js-chip-win");
    const paint = () => {
      status.textContent = `Chips: ${sum}% → ${(sum / 100) * base}`;
      win.hidden = sum !== TARGET;
    };
    chips.querySelectorAll("[data-chip]").forEach((btn) => {
      btn.addEventListener("click", () => {
        sum += Number(btn.dataset.chip);
        paint();
      });
    });
    chips.querySelector(".js-chip-reset").addEventListener("click", () => {
      sum = 0;
      paint();
    });
  }

  const pairs = document.querySelector(".js-game-pairs");
  if (pairs) {
    const status = pairs.querySelector(".js-pair-status");
    const miss = pairs.querySelector(".js-pair-miss");
    const win = pairs.querySelector(".js-pair-win");
    const buttons = [...pairs.querySelectorAll("[data-pair]")];
    let picked = null;
    let found = 0;
    const paint = () => {
      status.textContent = `Pairs found: ${found} of 3`;
      win.hidden = found !== 3;
    };
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const n = Number(btn.dataset.pair);
        miss.hidden = true;
        if (picked === null) {
          picked = btn;
          btn.setAttribute("aria-pressed", "true");
          return;
        }
        if (picked === btn) {
          picked = null;
          btn.setAttribute("aria-pressed", "false");
          return;
        }
        const first = Number(picked.dataset.pair);
        if (first + n === 100) {
          picked.disabled = true;
          btn.disabled = true;
          found += 1;
        } else {
          miss.textContent = `${first} + ${n} = ${first + n}, not 100. ${first} needs ${100 - first}.`;
          miss.hidden = false;
        }
        picked.setAttribute("aria-pressed", "false");
        picked = null;
        paint();
      });
    });
    pairs.querySelector(".js-pair-reset").addEventListener("click", () => {
      buttons.forEach((btn) => {
        btn.disabled = false;
        btn.setAttribute("aria-pressed", "false");
      });
      picked = null;
      found = 0;
      miss.hidden = true;
      paint();
    });
  }

  const eleven = document.querySelector(".js-game-eleven");
  if (eleven) {
    const prompt = eleven.querySelector(".js-eleven-prompt");
    const slotsEl = eleven.querySelector(".js-eleven-slots");
    const stepEl = eleven.querySelector(".js-eleven-step");
    const choices = eleven.querySelector(".js-eleven-choices");
    const miss = eleven.querySelector(".js-eleven-miss");
    const win = eleven.querySelector(".js-eleven-win");
    const next = eleven.querySelector(".js-eleven-next");
    const tally = eleven.querySelector(".js-eleven-tally");
    let index = 0;
    let solved = 0;
    let round = null;
    let filled = [];
    let missed = false;

    const paintSlots = () => {
      slotsEl.textContent = round.slots.map((_, i) => (i < filled.length ? String(filled[i]) : "_")).join(" | ");
    };
    const showChoices = (label, opts, onOk) => {
      stepEl.textContent = label;
      choices.replaceChildren(
        ...opts.map((o) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = o.text;
          btn.dataset.value = String(o.value);
          if (o.ok) btn.dataset.ok = "1";
          btn.addEventListener("click", () => {
            if (o.ok) {
              miss.hidden = true;
              onOk();
            } else {
              missed = true;
              miss.textContent = o.why;
              miss.hidden = false;
            }
          });
          return btn;
        }),
      );
    };
    const askStep = () => {
      paintSlots();
      if (filled.length < round.steps.length) {
        const step = round.steps[filled.length];
        showChoices(step.label, step.options, () => {
          filled.push(step.answer);
          askStep();
        });
        return;
      }
      showChoices(round.finalLabel, round.finals, () => {
        solved += 1;
        stepEl.textContent = "";
        choices.replaceChildren();
        win.textContent = `${round.slots.join(" | ")} → ${round.answer.toLocaleString("en-US")}.` +
          (missed ? " Worth another pass on this shape." : "");
        win.hidden = false;
        next.hidden = false;
        tally.textContent = `Rounds solved: ${solved}`;
      });
    };
    const start = () => {
      round = elevenRound(index);
      filled = [];
      missed = false;
      prompt.textContent = `${round.n} × 11`;
      win.hidden = true;
      next.hidden = true;
      miss.hidden = true;
      askStep();
    };
    next.addEventListener("click", () => {
      index += 1;
      start();
    });
    eleven.querySelector(".js-eleven-reset").addEventListener("click", start);
    start();
  }

  const nearBase = document.querySelector(".js-game-nearbase");
  if (nearBase) {
    const status = nearBase.querySelector(".js-nb-status");
    const left = nearBase.querySelector(".js-nb-left");
    const right = nearBase.querySelector(".js-nb-right");
    const miss = nearBase.querySelector(".js-nb-miss");
    const win = nearBase.querySelector(".js-nb-win");
    const choose = (row, onOk) => {
      row.querySelectorAll("[data-nb]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (btn.dataset.ok) {
            miss.hidden = true;
            onOk(btn.dataset.nb);
          } else {
            miss.textContent = btn.dataset.why;
            miss.hidden = false;
          }
        });
      });
    };
    choose(left, (value) => {
      status.textContent = `${value} | ?  Right part?`;
      left.hidden = true;
      right.hidden = false;
    });
    choose(right, (value) => {
      status.textContent = `91 | ${value}`;
      right.hidden = true;
      win.hidden = false;
    });
    nearBase.querySelector(".js-nb-reset").addEventListener("click", () => {
      status.textContent = "Left part?";
      left.hidden = false;
      right.hidden = true;
      miss.hidden = true;
      win.hidden = true;
    });
  }
}
