// Soroban rod game logic (add and take away). Pure functions plus one markup builder that
// mirrors app/Soroban.php, so `node --test tests/js` can check the rules.

export const KINDS = ["direct", "five", "ten"];

// Practice order: each add move, then each take-away move.
export const MOVES = [
  { op: "+", kind: "direct" },
  { op: "+", kind: "five" },
  { op: "+", kind: "ten" },
  { op: "-", kind: "direct" },
  { op: "-", kind: "five" },
  { op: "-", kind: "ten" },
];

// How a soroban adds k (1–9) to a ones rod showing v (0–9).
export function classifyAdd(v, k) {
  if (v + k >= 10) return "ten";
  if (k < 5 && (v % 5) + k > 4) return "five";
  return "direct";
}

// How a soroban takes k (1–9) off a ones rod showing v (0–9).
// The mirror of adding: take beads off, −5 and give some back, or borrow ten.
export function classifySub(v, k) {
  if (v - k < 0) return "ten";
  if (k < 5 && v % 5 < k) return "five";
  return "direct";
}

export function classifyMove(v, k, op) {
  return op === "-" ? classifySub(v, k) : classifyAdd(v, k);
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

function addWhy(v, k) {
  const free = 4 - (v % 5);
  return {
    direct: {
      five: `Only ${plural(free, "lower bead")} free on a rod showing ${v}. Bring the five in: +5, −${5 - k}.`,
      ten: `${v} + ${k} passes 9, so this rod cannot hold it. Carry one to the tens rod and take ${10 - k} back.`,
    },
    five: {
      direct: `${plural(free, "lower bead")} free, enough for ${k}. Push them straight on.`,
      ten: `${v} + ${k} passes 9, so the rod must carry: +10, −${10 - k}.`,
    },
    ten: {
      direct: `${v} + ${k} = ${v + k} stays under 10. No carry needed: push ${k} on.`,
      five: `${v} + ${k} = ${v + k} stays under 10. Bring the five in instead: +5, −${5 - k}.`,
    },
  };
}

function subWhy(v, k) {
  const on = v % 5;
  return {
    direct: {
      five: `Only ${plural(on, "lower bead")} on a rod showing ${v}. Take the five off and give ${5 - k} back: −5, +${5 - k}.`,
      ten: `${v} − ${k} goes below 0 on this rod. Borrow one from the tens rod and add ${10 - k} back.`,
    },
    five: {
      direct: `${plural(on, "lower bead")} on, enough to take ${k} off directly.`,
      ten: `${v} − ${k} goes below 0, so borrow from the tens rod: −10, +${10 - k}.`,
    },
    ten: {
      direct: `${v} − ${k} = ${v - k} stays at 0 or above. No borrow needed: take ${k} off.`,
      five: `${v} − ${k} = ${v - k} stays at 0 or above. Use the five bead instead: −5, +${5 - k}.`,
    },
  };
}

// Options shown for one move; exactly one is ok.
export function moveOptions(value, k, op = "+") {
  const v = value % 10;
  const kind = classifyMove(v, k, op);
  const why = op === "-" ? subWhy(v, k) : addWhy(v, k);
  const after = op === "-" ? value - k : value + k;
  const opts =
    op === "-"
      ? [{ kind: "direct", text: k === 5 ? "Take the five bead off" : `Take ${k} off this rod` }]
      : [{ kind: "direct", text: k === 5 ? "Push the five bead on" : `Push ${k} on this rod` }];
  if (k < 5) opts.push({ kind: "five", text: op === "-" ? `−5, +${5 - k}` : `+5, −${5 - k}` });
  opts.push({ kind: "ten", text: op === "-" ? `−10, +${10 - k}` : `+10, −${10 - k}` });
  return opts.map((o) => ({ ...o, after, ...(o.kind === kind ? { ok: true } : { why: why[o.kind][kind] }) }));
}

export const wantedMove = (step) => MOVES[step % MOVES.length];

// Ones digits that make the wanted five-complement possible next time.
const FIVE_SETUP = { "+": [1, 2, 3, 4], "-": [5, 6, 7, 8] };

// Next move for a board showing value: { op, k }. Steps cycle through MOVES.
// When the wanted move cannot happen on this rod, pick a move of the same op
// that sets it up; the caller only advances step when the wanted move was
// served. null means the board has no room for that op and should reset.
export function nextMove(value, step, rand = Math.random) {
  const { op, kind } = wantedMove(step);
  if (op === "+" && value > 90) return null;
  if (op === "-" && value < 10) return null;
  const room = [];
  for (let k = 1; k <= 9; k += 1) {
    const after = op === "-" ? value - k : value + k;
    if (after >= 0 && after <= 99) room.push(k);
  }
  const fits = room.filter((k) => classifyMove(value % 10, k, op) === kind);
  const setup = room.filter((k) => {
    const after = op === "-" ? value - k : value + k;
    return FIVE_SETUP[op].includes(after % 10) && after >= 10 && after <= 90;
  });
  const pool = fits.length ? fits : setup.length ? setup : room;
  return { op, k: pool[Math.floor(rand() * pool.length)] };
}

export function freshBoard(rand = Math.random) {
  return 11 + Math.floor(rand() * 29); // 11–39 leaves room for several adds
}

export function beadState(digit) {
  return { five: digit >= 5, ones: digit % 5 };
}

// Build rods with the same classes as app/Soroban.php.
export function renderRods(doc, value, places = 2) {
  const frame = doc.createElement("div");
  frame.className = "soroban__frame";
  const digits = String(value).padStart(places, "0").split("").map(Number);
  for (const d of digits) {
    const { five, ones } = beadState(d);
    const rod = doc.createElement("div");
    rod.className = "soroban__rod";
    rod.dataset.digit = String(d);
    const span = (cls) => {
      const el = doc.createElement("span");
      el.className = cls;
      return el;
    };
    const upper = doc.createElement("div");
    upper.className = "soroban__upper";
    const fiveBead = span(`soroban__bead soroban__bead--five${five ? " is-on" : ""}`);
    if (five) upper.append(span("soroban__gap"), fiveBead);
    else upper.append(fiveBead, span("soroban__gap"));
    const beam = doc.createElement("div");
    beam.className = "soroban__beam";
    const lower = doc.createElement("div");
    lower.className = "soroban__lower";
    for (let i = 0; i < ones; i += 1) lower.append(span("soroban__bead is-on"));
    lower.append(span("soroban__gap"));
    for (let i = ones; i < 4; i += 1) lower.append(span("soroban__bead"));
    const digit = span("soroban__digit");
    digit.textContent = String(d);
    rod.append(upper, beam, lower, digit);
    frame.append(rod);
  }
  return frame;
}
