// Soroban rod game logic. Pure functions plus one markup builder that
// mirrors app/Soroban.php, so `node --test tests/js` can check the rules.

export const KINDS = ["direct", "five", "ten"];

// How a soroban adds k (1–9) to a ones rod showing v (0–9).
export function classifyAdd(v, k) {
  if (v + k >= 10) return "ten";
  if (k < 5 && (v % 5) + k > 4) return "five";
  return "direct";
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// Options shown for one add; exactly one is ok.
export function addOptions(value, k) {
  const v = value % 10;
  const kind = classifyAdd(v, k);
  const free = 4 - (v % 5);
  const after = value + k;
  const why = {
    direct: {
      five: `Only ${plural(free, "lower bead")} free on a rod showing ${v}. Bring the five in: +5, −${5 - k}.`,
      ten: `${v} + ${k} passes 9, so this rod cannot hold it. Carry one to the tens rod and take ${10 - k} back.`,
    },
    five: {
      direct: k < 5 ? `${plural(free, "lower bead")} free, enough for ${k}. Push them straight on.` : "",
      ten: `${v} + ${k} passes 9, so the rod must carry: +10, −${10 - k}.`,
    },
    ten: {
      direct: `${v} + ${k} = ${v + k} stays under 10. No carry needed: push ${k} on.`,
      five: `${v} + ${k} = ${v + k} stays under 10. Bring the five in instead: +5, −${5 - k}.`,
    },
  };
  const opts = [{ kind: "direct", text: k === 5 ? "Push the five bead on" : `Push ${k} on this rod` }];
  if (k < 5) opts.push({ kind: "five", text: `+5, −${5 - k}` });
  opts.push({ kind: "ten", text: `+10, −${10 - k}` });
  return opts.map((o) => (o.kind === kind ? { ...o, ok: true } : { ...o, why: why[o.kind][kind] }))
    .map((o) => ({ ...o, after }));
}

export const wantedKind = (step) => KINDS[step % KINDS.length];

// Next k for a board showing value. Steps cycle direct → five → ten so every
// move gets practice. When the wanted move cannot happen on this rod (a
// five-complement needs a ones digit of 1–4), pick an add that sets it up;
// the caller only advances step when the wanted move was served.
// null means the board is too full and should reset.
export function nextAdd(value, step, rand = Math.random) {
  if (value > 90) return null;
  const want = wantedKind(step);
  const room = [];
  for (let k = 1; k <= 9 && value + k <= 99; k += 1) room.push(k);
  const fits = room.filter((k) => classifyAdd(value % 10, k) === want);
  const setup = room.filter((k) => {
    const ones = (value + k) % 10;
    return ones >= 1 && ones <= 4 && value + k <= 90;
  });
  const pool = fits.length ? fits : setup.length ? setup : room;
  return pool[Math.floor(rand() * pool.length)];
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
