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
}
