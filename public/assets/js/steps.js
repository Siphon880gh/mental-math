// Shared helpers for the multiple-choice step games (runway check, ARR read). Pure, no DOM.

export const between = (lo, hi, rand) => lo + Math.floor(rand() * (hi - lo + 1));

export const pick = (list, rand) => list[Math.floor(rand() * list.length)];

export function shuffle(items, rand) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Drop options whose label or value repeats an earlier one (first wins, so list the right one first).
export function distinct(list) {
  const texts = new Set();
  const values = new Set();
  return list.filter((o) => {
    if (texts.has(o.text) || values.has(o.value)) return false;
    texts.add(o.text);
    values.add(o.value);
    return true;
  });
}

export const options = (list, rand) => shuffle(distinct(list), rand);

const trim = (n) => String(Math.round(n * 100) / 100);

// Dollars: whole numbers with separators, cents kept when present.
export const money = (n) => `$${Number.isInteger(n) ? n.toLocaleString("en-US") : Number(trim(n)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Thousands of dollars as "$240k".
export const kilo = (n) => `$${trim(n)}k`;
