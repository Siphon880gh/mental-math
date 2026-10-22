import { arrRound } from "./arr.js";
import { elevenRound } from "./eleven.js";
import { nearBaseRound } from "./nearbase.js";
import { pairMiss, pairRound } from "./pairs.js";
import { runwayRound } from "./runway.js";
import { classifyMove, freshBoard, moveOptions, nextMove, renderRods, wantedMove } from "./soroban.js";

const STEP_ROUNDS = { "runway-check": runwayRound, "arr-read": arrRound };

// Multiple-choice step games: each round has steps, then a final pick. Wrong picks explain; right picks advance.
function runStepGame(root, makeRound) {
  const q = (name) => root.querySelector(`.js-step-${name}`);
  const [prompt, info, status, stepEl, choices, miss, win, next, tally] = ["prompt", "info", "status", "label", "choices", "miss", "win", "next", "tally"].map(q);
  let index = 0;
  let solved = 0;
  let round = null;
  let done = [];
  const show = (label, opts, onOk) => {
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
            miss.textContent = o.why;
            miss.hidden = false;
          }
        });
        return btn;
      }),
    );
  };
  const ask = () => {
    status.textContent = done.length ? done.join(" → ") : "";
    if (done.length < round.steps.length) {
      const step = round.steps[done.length];
      show(step.label, step.options, () => {
        done.push(step.done);
        ask();
      });
      return;
    }
    show(round.finalLabel, round.finals, () => {
      solved += 1;
      stepEl.textContent = "";
      choices.replaceChildren();
      win.textContent = round.winText;
      win.hidden = false;
      next.hidden = false;
      tally.textContent = `Rounds solved: ${solved}`;
    });
  };
  const start = () => {
    round = makeRound(index);
    done = [];
    prompt.textContent = round.prompt;
    info.textContent = round.info;
    win.hidden = true;
    next.hidden = true;
    miss.hidden = true;
    ask();
  };
  next.addEventListener("click", () => {
    index += 1;
    start();
  });
  q("reset").addEventListener("click", start);
  start();
}

export function initGames() {
  document.querySelectorAll(".js-game-step").forEach((root) => {
    const makeRound = STEP_ROUNDS[root.dataset.game];
    if (makeRound) runStepGame(root, makeRound);
  });

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
    const tiles = pairs.querySelector(".js-pair-tiles");
    const miss = pairs.querySelector(".js-pair-miss");
    const win = pairs.querySelector(".js-pair-win");
    const next = pairs.querySelector(".js-pair-next");
    let index = 0;
    let round = null;
    let picked = null;
    let found = 0;
    const paint = () => {
      status.textContent = `Pairs found: ${found} of ${round.pairs.length}`;
      const done = found === round.pairs.length;
      win.hidden = !done;
      next.hidden = !done;
      if (done) {
        win.textContent = `${round.pairs.map(([a, b]) => `${a}+${b}`).join(", ")} → three hundreds = 300.`;
      }
    };
    const deal = () => {
      picked = null;
      found = 0;
      miss.hidden = true;
      tiles.replaceChildren(
        ...round.numbers.map((n) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = String(n);
          btn.dataset.pair = String(n);
          btn.setAttribute("aria-pressed", "false");
          btn.addEventListener("click", () => {
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
            if (first + n === round.target) {
              picked.disabled = true;
              btn.disabled = true;
              found += 1;
            } else {
              miss.textContent = pairMiss(first, n, round.target);
              miss.hidden = false;
            }
            picked.setAttribute("aria-pressed", "false");
            picked = null;
            paint();
          });
          return btn;
        }),
      );
      paint();
    };
    next.addEventListener("click", () => {
      index += 1;
      round = pairRound(index);
      deal();
    });
    pairs.querySelector(".js-pair-reset").addEventListener("click", deal);
    round = pairRound(index);
    deal();
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
    const prompt = nearBase.querySelector(".js-nb-prompt");
    const gapsEl = nearBase.querySelector(".js-nb-gaps");
    const status = nearBase.querySelector(".js-nb-status");
    const stepEl = nearBase.querySelector(".js-nb-step");
    const choices = nearBase.querySelector(".js-nb-choices");
    const miss = nearBase.querySelector(".js-nb-miss");
    const win = nearBase.querySelector(".js-nb-win");
    const next = nearBase.querySelector(".js-nb-next");
    const tally = nearBase.querySelector(".js-nb-tally");
    let index = 0;
    let solved = 0;
    let round = null;
    let parts = [];
    const width = () => String(round.shape.base).length - 1;
    const paintParts = () => {
      const left = parts.length > 0 ? String(parts[0]) : "?";
      const right = parts.length > 1 ? (parts[1] < 0 ? "−" : "") + String(Math.abs(parts[1])).padStart(width(), "0") : "?";
      status.textContent = `${left} | ${right}`;
    };
    const show = (label, opts, onOk) => {
      stepEl.textContent = label;
      choices.replaceChildren(
        ...opts.map((o) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = o.text;
          btn.dataset.nb = String(o.value);
          if (o.ok) btn.dataset.ok = "1";
          btn.addEventListener("click", () => {
            if (o.ok) {
              miss.hidden = true;
              onOk();
            } else {
              miss.textContent = o.why;
              miss.hidden = false;
            }
          });
          return btn;
        }),
      );
    };
    const ask = () => {
      paintParts();
      if (parts.length < round.steps.length) {
        const step = round.steps[parts.length];
        show(step.label, step.options, () => {
          parts.push(step.answer);
          ask();
        });
        return;
      }
      show(round.finalLabel, round.finals, () => {
        solved += 1;
        stepEl.textContent = "";
        choices.replaceChildren();
        win.textContent = `${status.textContent} → ${round.answer.toLocaleString("en-US")}.`;
        win.hidden = false;
        next.hidden = false;
        tally.textContent = `Rounds solved: ${solved}`;
      });
    };
    const start = () => {
      round = nearBaseRound(index);
      parts = [];
      prompt.textContent = round.prompt;
      gapsEl.textContent = round.gapsText;
      win.hidden = true;
      next.hidden = true;
      miss.hidden = true;
      ask();
    };
    next.addEventListener("click", () => {
      index += 1;
      start();
    });
    nearBase.querySelector(".js-nb-reset").addEventListener("click", start);
    start();
  }

  const soroban = document.querySelector(".js-game-soroban");
  if (soroban) {
    const board = soroban.querySelector(".js-soroban-board");
    const prompt = soroban.querySelector(".js-soroban-prompt");
    const choices = soroban.querySelector(".js-soroban-choices");
    const miss = soroban.querySelector(".js-soroban-miss");
    const okEl = soroban.querySelector(".js-soroban-ok");
    const next = soroban.querySelector(".js-soroban-next");
    const tally = soroban.querySelector(".js-soroban-tally");
    let value = 0;
    let step = 0;
    let done = 0;
    const paintBoard = () => {
      const fig = board.querySelector(".soroban");
      fig.querySelector(".soroban__frame").replaceWith(renderRods(document, value));
      fig.setAttribute("aria-label", `Soroban showing ${value}`);
    };
    const ask = () => {
      let move = nextMove(value, step);
      if (move === null) {
        value = freshBoard();
        paintBoard();
        move = nextMove(value, step);
      }
      const { op, k } = move;
      const sign = op === "-" ? "−" : "+";
      prompt.textContent = `${value} ${sign} ${k}`;
      okEl.hidden = true;
      miss.hidden = true;
      next.hidden = true;
      choices.replaceChildren(
        ...moveOptions(value, k, op).map((o) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = o.text;
          btn.dataset.kind = o.kind;
          if (o.ok) btn.dataset.ok = "1";
          btn.addEventListener("click", () => {
            if (!o.ok) {
              miss.textContent = o.why;
              miss.hidden = false;
              return;
            }
            const before = value;
            const want = wantedMove(step);
            if (want.op === op && classifyMove(before % 10, k, op) === want.kind) step += 1;
            value = o.after;
            done += 1;
            paintBoard();
            miss.hidden = true;
            choices.replaceChildren();
            okEl.textContent = `${before} ${sign} ${k} = ${value}. ${o.text}.`;
            okEl.hidden = false;
            next.hidden = false;
            tally.textContent = `Moves done: ${done}`;
          });
          return btn;
        }),
      );
    };
    next.addEventListener("click", ask);
    soroban.querySelector(".js-soroban-reset").addEventListener("click", () => {
      value = freshBoard();
      step = 0;
      paintBoard();
      ask();
    });
    value = 47;
    step = 2; // open on the guide sample shape: 47 needs a ten-complement add
    ask();
  }
}
