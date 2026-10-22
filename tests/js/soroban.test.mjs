// Run with: node --test tests/js/*.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import { beadState, classifyAdd, classifyMove, classifySub, freshBoard, MOVES, moveOptions, nextMove, wantedMove } from "../../public/assets/js/soroban.js";

// Independent bead simulation on one rod. "direct" = only the beads for k move,
// "five" = the five bead moves the other way, "ten" = a carry or borrow.
function simulateAdd(v, k) {
  if (v + k > 9) return "ten";
  const { five, ones } = beadState(v);
  if (k < 5) return ones + k <= 4 ? "direct" : "five";
  if (k === 5) return five ? "ten" : "direct";
  return !five && ones + (k - 5) <= 4 ? "direct" : "ten";
}

function simulateSub(v, k) {
  if (v - k < 0) return "ten";
  const { five, ones } = beadState(v);
  if (k < 5) {
    if (ones >= k) return "direct";
    // Take the five off and give 5 − k ones back.
    assert.ok(five && ones + (5 - k) <= 4, `five-complement must fit for ${v}−${k}`);
    return "five";
  }
  assert.ok(five && ones >= k - 5, `direct must fit for ${v}−${k}`);
  return "direct";
}

// Walk the beads move by move to check the arithmetic of each option.
function applyMove(value, k, op, kind) {
  let tens = Math.floor(value / 10);
  let ones = value % 10;
  const sign = op === "-" ? -1 : 1;
  if (kind === "direct") ones += sign * k;
  else if (kind === "five") ones += sign * 5 - sign * (5 - k);
  else {
    tens += sign;
    ones += -sign * (10 - k);
  }
  assert.ok(ones >= 0 && ones <= 9 && tens >= 0 && tens <= 9, `${value}${op}${k} ${kind} stays on the rods`);
  return tens * 10 + ones;
}

test("guide samples", () => {
  assert.equal(classifyAdd(3, 4), "five");
  assert.equal(classifyAdd(7, 8), "ten");
  assert.equal(classifyAdd(1, 3), "direct");
  assert.equal(classifySub(7, 4), "five"); // 7 − 4: −5, +1
  assert.equal(classifySub(2, 6), "ten"); // 52 − 6: −10, +4
  assert.equal(classifySub(8, 3), "direct");
  assert.equal(classifySub(9, 7), "direct");
});

test("classification matches the bead simulation for every rod, k, and op", () => {
  for (let v = 0; v <= 9; v += 1) {
    for (let k = 1; k <= 9; k += 1) {
      assert.equal(classifyAdd(v, k), simulateAdd(v, k), `${v}+${k}`);
      assert.equal(classifySub(v, k), simulateSub(v, k), `${v}-${k}`);
    }
  }
});

test("options: one ok, the rest explain, and the ok move lands on the true result", () => {
  for (const op of ["+", "-"]) {
    for (let value = 0; value <= 99; value += 1) {
      for (let k = 1; k <= 9; k += 1) {
        const after = op === "-" ? value - k : value + k;
        if (after < 0 || after > 99) continue;
        const opts = moveOptions(value, k, op);
        const ok = opts.filter((o) => o.ok);
        assert.equal(ok.length, 1, `${value}${op}${k}`);
        assert.equal(ok[0].kind, classifyMove(value % 10, k, op));
        assert.equal(applyMove(value, k, op, ok[0].kind), after);
        for (const o of opts) {
          assert.equal(o.after, after);
          if (!o.ok) assert.ok(o.why && o.why.length > 15, `${value}${op}${k} ${o.kind}`);
        }
        assert.equal(new Set(opts.map((o) => o.text)).size, opts.length);
      }
    }
  }
});

test("nextMove cycles all six moves and stays on the board", () => {
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const seen = Object.fromEntries(MOVES.map((m) => [`${m.op}${m.kind}`, 0]));
  let value = freshBoard(rand);
  for (let step = 0, i = 0; i < 600; i += 1) {
    let move = nextMove(value, step, rand);
    if (move === null) {
      value = freshBoard(rand);
      move = nextMove(value, step, rand);
    }
    const { op, k } = move;
    const after = op === "-" ? value - k : value + k;
    assert.ok(k >= 1 && k <= 9 && after >= 0 && after <= 99, `${value}${op}${k}`);
    const kind = classifyMove(value % 10, k, op);
    seen[`${op}${kind}`] += 1;
    const want = wantedMove(step);
    if (want.op === op && want.kind === kind) step += 1;
    value = after;
  }
  for (const [key, n] of Object.entries(seen)) assert.ok(n > 40, `${key} ${n}`);
});
