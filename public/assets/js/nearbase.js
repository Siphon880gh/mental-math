// Round generator for the Near-base gaps game (Nikhilam). Pure functions, no DOM.

// Shapes cycle: both below 100, both above, one each side, both below 1,000.
export const NEAR_BASE_SHAPES = [
  { base: 100, kind: "below" },
  { base: 100, kind: "above" },
  { base: 100, kind: "mixed" },
  { base: 1000, kind: "below" },
];

const fmt = (n) => n.toLocaleString("en-US");
const signed = (n) => (n < 0 ? `−${-n}` : `+${n}`);
const pad = (n, width) => String(Math.abs(n)).padStart(width, "0");

function shuffle(items, rand) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Drop options whose label or value repeats an earlier one (first wins).
function distinct(list) {
  const texts = new Set();
  const values = new Set();
  return list.filter((o) => {
    if (texts.has(o.text) || values.has(o.value)) return false;
    texts.add(o.text);
    values.add(o.value);
    return true;
  });
}

const options = (list, rand) => shuffle(distinct(list), rand);

const between = (lo, hi, rand) => lo + Math.floor(rand() * (hi - lo + 1));

// Gaps stay small enough that the right part fits the base's digits
// (9 × 9 = 81 under 100; 15 × 15 = 225 under 1,000), so no carry is needed.
function gaps(shape, rand) {
  const max = shape.base === 1000 ? 15 : 9;
  if (shape.kind === "below") return [-between(1, max, rand), -between(1, max, rand)];
  if (shape.kind === "above") return [between(1, max, rand), between(1, max, rand)];
  const below = -between(1, 9, rand);
  const above = between(1, 9, rand);
  return rand() < 0.5 ? [below, above] : [above, below];
}

export function nearBaseRound(index, rand = Math.random) {
  const shape = NEAR_BASE_SHAPES[index % NEAR_BASE_SHAPES.length];
  const { base } = shape;
  const width = String(base).length - 1;
  const [da, db] = gaps(shape, rand);
  const a = base + da;
  const b = base + db;
  const left = a + db;
  const prod = da * db;
  const answer = left * base + prod;
  const crossText = `${a} ${db < 0 ? "−" : "+"} ${Math.abs(db)} = ${left}`;
  const wrongCross = a - db;
  const leftStep = {
    label: "Left part (cross)",
    answer: left,
    options: options(
      [
        { value: left, text: crossText, ok: true },
        {
          value: wrongCross,
          text: `${a} ${db < 0 ? "+" : "−"} ${Math.abs(db)} = ${wrongCross}`,
          why: `Cross by adding the other gap with its sign: ${a} ${signed(db)} = ${left}. ${db < 0 ? "Below the base that subtracts." : "Above the base that adds."}`,
        },
        {
          value: Math.abs(da) + Math.abs(db),
          text: `${Math.abs(da)} + ${Math.abs(db)} = ${Math.abs(da) + Math.abs(db)}`,
          why: `Adding the gap sizes is not the left part. Cross: ${crossText}.`,
        },
      ],
      rand,
    ),
  };
  const prodText = `(${signed(da)}) × (${signed(db)}) = ${prod < 0 ? "−" : ""}${pad(prod, width)}`;
  const gapSum = Math.abs(da) + Math.abs(db);
  const rightWrong = [
    {
      value: gapSum,
      text: `${Math.abs(da)} + ${Math.abs(db)} = ${pad(gapSum, width)}`,
      why: `Multiply the gaps, do not add them: ${prodText}.`,
      skip: gapSum === Math.abs(prod), // same digits by coincidence; not a fair wrong answer
    },
    {
      value: -prod,
      text: `(${signed(da)}) × (${signed(db)}) = ${prod > 0 ? "−" : ""}${pad(prod, width)}`,
      why:
        prod > 0
          ? `Two gaps on the same side of ${fmt(base)} multiply to a positive number: ${pad(prod, width)}.`
          : `One gap below ${fmt(base)} and one above: the product is negative, ${prod}.`,
    },
  ];
  const rightStep = {
    label: "Right part (multiply the gaps)",
    answer: prod,
    options: options([{ value: prod, text: prodText, ok: true }, ...rightWrong.filter((o) => !o.skip).map(({ skip, ...o }) => o)], rand),
  };
  const finals = [{ value: answer, text: fmt(answer), ok: true }];
  if (prod < 0) {
    finals.push({
      value: left * base - prod,
      text: fmt(left * base - prod),
      why: `The right part is ${prod}, so take it away: ${fmt(left * base)} − ${-prod} = ${fmt(answer)}.`,
    });
  } else if (String(prod).length < width) {
    const squashed = Number(`${left}${prod}`);
    finals.push({
      value: squashed,
      text: fmt(squashed),
      why: `Base ${fmt(base)} keeps ${width} digits on the right: ${left} | ${pad(prod, width)} → ${fmt(answer)}.`,
    });
  }
  finals.push({
    value: left * base + Math.abs(da) + Math.abs(db),
    text: fmt(left * base + Math.abs(da) + Math.abs(db)),
    why: `That adds the gaps on the right. Multiply them: ${prodText} → ${fmt(answer)}.`,
  });
  finals.push({
    value: left * 10 + prod,
    text: fmt(left * 10 + prod),
    why: `The left part counts ${fmt(base)}s: ${left} × ${fmt(base)} = ${fmt(left * base)}, then the right part → ${fmt(answer)}.`,
  });
  return {
    shape,
    a,
    b,
    da,
    db,
    left,
    prod,
    answer,
    prompt: `${a} × ${b}`,
    gapsText: `Distances from ${fmt(base)}: ${signed(da)} and ${signed(db)}`,
    steps: [leftStep, rightStep],
    finalLabel: "Put it together",
    finals: shuffle(distinct(finals).slice(0, 3), rand),
  };
}
