// Round generator for the Pair to 100 game. Pure functions, no DOM.

export const PAIR_TARGET = 100;

// Round shapes cycle: friendly multiples of 5 first, then any two digits.
export const PAIR_SHAPES = [{ step: 5 }, { step: 1 }, { step: 1 }];

function shuffle(items, rand) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Three distinct pairs that each make 100. No 50 (it would pair with itself)
// and no repeats, so each tile has exactly one partner on the board.
export function pairRound(index, rand = Math.random) {
  const shape = PAIR_SHAPES[index % PAIR_SHAPES.length];
  const used = new Set();
  const pairs = [];
  for (let tries = 0; pairs.length < 3 && tries < 500; tries += 1) {
    const a = shape.step * (1 + Math.floor(rand() * Math.floor(49 / shape.step)));
    const b = PAIR_TARGET - a;
    if (a < 5 || a === 50 || used.has(a) || used.has(b)) continue;
    used.add(a);
    used.add(b);
    pairs.push([a, b]);
  }
  return { target: PAIR_TARGET, pairs, numbers: shuffle(pairs.flat(), rand) };
}

// Why two picked tiles are not a pair, naming the right partner.
export function pairMiss(a, b, target = PAIR_TARGET) {
  const sum = a + b;
  const need = target - a;
  if (sum === target + 10) {
    return `${a} + ${b} = ${sum}. When the ones make 10, the tens make 9, not 10. ${a} needs ${need}.`;
  }
  return `${a} + ${b} = ${sum}, not ${target}. ${a} needs ${need}.`;
}
