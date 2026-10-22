// Round generator for the Eleven neighbors game. Pure functions, no DOM,
// so the same logic can be checked with `node --test tests/js`.

// Round shapes cycle so every few rounds cover 2- and 3-digit numbers,
// with and without a carry.
export const ELEVEN_SHAPES = [
  { digits: 2, carry: false },
  { digits: 2, carry: true },
  { digits: 3, carry: false },
  { digits: 3, carry: true },
];

const fmt = (n) => n.toLocaleString("en-US");

export function digitsOf(n) {
  return String(n).split("").map(Number);
}

// Raw slots before carrying: first digit, each neighbor sum, last digit.
export function elevenSlots(n) {
  const d = digitsOf(n);
  const slots = [d[0]];
  for (let i = 0; i < d.length - 1; i += 1) slots.push(d[i] + d[i + 1]);
  slots.push(d[d.length - 1]);
  return slots;
}

export function needsCarry(n) {
  return elevenSlots(n).some((v) => v >= 10);
}

// Carry from the right, the way the guide teaches it.
export function carrySlots(slots) {
  const out = [];
  let carry = 0;
  for (let i = slots.length - 1; i >= 0; i -= 1) {
    const v = slots[i] + carry;
    out.unshift(i === 0 ? v : v % 10);
    carry = i === 0 ? 0 : Math.floor(v / 10);
  }
  return Number(out.join(""));
}

function pickNumber(shape, rand) {
  const lo = 10 ** (shape.digits - 1);
  const hi = 10 ** shape.digits - 1;
  for (let tries = 0; tries < 500; tries += 1) {
    const n = lo + Math.floor(rand() * (hi - lo + 1));
    if (n % 10 === 0) continue; // a trailing zero teaches nothing extra
    if (needsCarry(n) === shape.carry) return n;
  }
  // Fallbacks keep the shape honest if rand is degenerate.
  return { "2false": 43, "2true": 78, "3false": 352, "3true": 487 }[`${shape.digits}${shape.carry}`];
}

function shuffle(items, rand) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Up to three distinct options; the first entry is the correct one.
function options(list, rand) {
  const seen = new Set();
  const out = [];
  for (const o of list) {
    if (out.length === 3 || seen.has(o.value)) continue;
    seen.add(o.value);
    out.push(o);
  }
  return shuffle(out, rand);
}

export function elevenRound(index, rand = Math.random) {
  const shape = ELEVEN_SHAPES[index % ELEVEN_SHAPES.length];
  const n = pickNumber(shape, rand);
  const d = digitsOf(n);
  const last = d.length - 1;
  const slots = elevenSlots(n);
  const steps = slots.map((answer, i) => {
    if (i === 0) {
      return {
        label: "First digit",
        answer,
        options: options([
          { value: d[0], text: `First digit: ${d[0]}`, ok: true },
          { value: d[0] + d[1], text: `${d[0]} + ${d[1]}`, why: `The first slot copies the first digit, ${d[0]}. Sums start in the second slot.` },
          { value: d[last], text: `Last digit: ${d[last]}`, why: `Work left to right: the first slot is the first digit, ${d[0]}.` },
          { value: d[0] + 1, text: `${d[0] + 1}`, why: `Copy the first digit, ${d[0]}. Any carry comes at the end.` },
        ], rand),
      };
    }
    if (i === slots.length - 1) {
      return {
        label: "Last digit",
        answer,
        options: options([
          { value: d[last], text: `Last digit: ${d[last]}`, ok: true },
          { value: d[last - 1] + d[last], text: `${d[last - 1]} + ${d[last]}`, why: `That sum is already the slot before. The last slot copies ${d[last]}.` },
          { value: d[0], text: `First digit: ${d[0]}`, why: `The last slot copies the last digit, ${d[last]}.` },
          { value: (d[last] + 1) % 10, text: `${(d[last] + 1) % 10}`, why: `The last digit never changes: ${d[last]}.` },
        ], rand),
      };
    }
    const a = d[i - 1];
    const b = d[i];
    const sum = a + b;
    return {
      label: `Neighbors ${a} and ${b}`,
      answer,
      options: options([
        { value: sum, text: `${a} + ${b} = ${sum}`, ok: true },
        { value: a * b, text: `${a} × ${b} = ${a * b}`, why: `Neighbors are added, not multiplied: ${a} + ${b} = ${sum}.` },
        sum >= 10
          ? { value: sum % 10, text: `Write ${sum % 10}, drop the 1`, why: `Keep the full ${sum} in the slot for now. The 1 carries left at the end.` }
          : { value: sum + 1, text: `${sum + 1}`, why: `Recount the neighbors: ${a} + ${b} = ${sum}.` },
        { value: Math.abs(a - b) === sum ? sum + 2 : Math.abs(a - b), text: `${Math.abs(a - b) === sum ? sum + 2 : Math.abs(a - b)}`, why: `Add the neighbors: ${a} + ${b} = ${sum}.` },
      ], rand),
    };
  });
  const answer = n * 11;
  const raw = slots.join("");
  const finals = shape.carry
    ? [
        { value: answer, text: fmt(answer), ok: true },
        { value: Number(raw), text: fmt(Number(raw)), why: `Each slot holds one digit. Carry every 10 one place left: ${slots.join(" | ")} → ${fmt(answer)}.` },
        { value: Number(slots.map((v) => v % 10).join("")), text: fmt(Number(slots.map((v) => v % 10).join(""))), why: `Dropping the 1 loses ten of the next place. Carry it left: ${fmt(answer)}.` },
      ]
    : [
        { value: answer, text: fmt(answer), ok: true },
        { value: n * 10, text: fmt(n * 10), why: `That is ${n} × 10. × 11 is one more ${n}: ${fmt(answer)}.` },
        { value: n * 12, text: fmt(n * 12), why: `That is ${n} × 12. Read the slots straight across: ${fmt(answer)}.` },
      ];
  return {
    shape,
    n,
    slots,
    steps,
    answer,
    finalLabel: shape.carry ? "Carry and read" : "No carries: read it",
    finals: options(finals, rand),
  };
}
