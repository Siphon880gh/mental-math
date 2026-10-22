// Run with: node --test tests/js/*.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import { addOptions, beadState, classifyAdd, freshBoard, nextAdd, wantedKind } from "../../public/assets/js/soroban.js";

// Independent bead simulation: can k go on with beads alone, with the five, or does it carry?
function simulate(v, k) {
  if (v + k > 9) return "ten";
  const { five, ones } = beadState(v);
  if (k < 5) return ones + k <= 4 ? "direct" : "five";
  if (k === 5) return five ? "ten" : "direct";
  return !five && ones + (k - 5) <= 4 ? "direct" : "ten";
}

test("guide samples", () => {
  assert.equal(classifyAdd(3, 4), "five");
  assert.equal(classifyAdd(7, 8), "ten");
  assert.equal(classifyAdd(2, 4), "five");
  assert.equal(classifyAdd(1, 3), "direct");
  assert.equal(classifyAdd(6, 3), "direct");
});

test("classification matches a bead-by-bead simulation for every rod and add", () => {
  for (let v = 0; v <= 9; v += 1) {
    for (let k = 1; k <= 9; k += 1) assert.equal(classifyAdd(v, k), simulate(v, k), `${v}+${k}`);
  }
});

test("options: one ok, the rest explain, after is the true sum", () => {
  for (let value = 0; value <= 90; value += 1) {
    for (let k = 1; k <= 9; k += 1) {
      const opts = addOptions(value, k);
      assert.equal(opts.filter((o) => o.ok).length, 1, `${value}+${k}`);
      assert.equal(opts.find((o) => o.ok).kind, classifyAdd(value % 10, k));
      for (const o of opts) {
        assert.equal(o.after, value + k);
        if (!o.ok) assert.ok(o.why && o.why.length > 15, `${value}+${k} ${o.kind}`);
      }
      assert.equal(new Set(opts.map((o) => o.text)).size, opts.length);
    }
  }
});

test("nextAdd cycles the three moves and stays on the board", () => {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const seen = { direct: 0, five: 0, ten: 0 };
  let value = freshBoard(rand);
  for (let step = 0, i = 0; i < 300; i += 1) {
    let k = nextAdd(value, step, rand);
    if (k === null) {
      value = freshBoard(rand);
      k = nextAdd(value, step, rand);
    }
    assert.ok(k >= 1 && k <= 9 && value + k <= 99, `${value}+${k}`);
    const kind = classifyAdd(value % 10, k);
    seen[kind] += 1;
    if (kind === wantedKind(step)) step += 1;
    value += k;
  }
  for (const kind of Object.keys(seen)) assert.ok(seen[kind] > 50, `${kind} ${seen[kind]}`);
});
