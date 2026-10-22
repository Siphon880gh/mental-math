// Run with: node --test tests/js
import assert from "node:assert/strict";
import test from "node:test";
import { carrySlots, ELEVEN_SHAPES, elevenRound, elevenSlots, needsCarry } from "../../public/assets/js/eleven.js";

function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test("guide sample 347 × 11 slots and carry", () => {
  assert.deepEqual(elevenSlots(347), [3, 7, 11, 7]);
  assert.equal(carrySlots([3, 7, 11, 7]), 3817);
  assert.equal(needsCarry(347), true);
  assert.equal(needsCarry(352), false);
  assert.equal(carrySlots(elevenSlots(99)), 1089);
  assert.equal(carrySlots(elevenSlots(999)), 10989);
});

test("every two-digit and three-digit number carries to n × 11", () => {
  for (let n = 10; n < 1000; n += 1) {
    assert.equal(carrySlots(elevenSlots(n)), n * 11, String(n));
  }
});

test("generated rounds match their shape and have one right answer per step", () => {
  for (let seed = 1; seed <= 200; seed += 1) {
    const rand = seeded(seed);
    for (let i = 0; i < ELEVEN_SHAPES.length * 2; i += 1) {
      const r = elevenRound(i, rand);
      const shape = ELEVEN_SHAPES[i % ELEVEN_SHAPES.length];
      assert.equal(String(r.n).length, shape.digits);
      assert.equal(needsCarry(r.n), shape.carry, `${r.n} carry`);
      assert.notEqual(r.n % 10, 0);
      assert.equal(r.answer, r.n * 11);
      assert.equal(carrySlots(r.slots), r.answer);
      assert.equal(r.steps.length, shape.digits + 1);
      for (const [k, step] of [...r.steps, { answer: r.answer, options: r.finals }].entries()) {
        const values = step.options.map((o) => o.value);
        assert.equal(new Set(values).size, values.length, `${r.n} step ${k} distinct`);
        assert.ok(values.length >= 2, `${r.n} step ${k} has a wrong option`);
        const ok = step.options.filter((o) => o.ok);
        assert.equal(ok.length, 1);
        assert.equal(ok[0].value, step.answer);
        for (const o of step.options.filter((x) => !x.ok)) {
          assert.ok(o.why && o.why.length > 10, `${r.n} step ${k} explains ${o.value}`);
        }
        const texts = step.options.map((o) => o.text);
        assert.equal(new Set(texts).size, texts.length, `${r.n} step ${k} distinct labels`);
      }
    }
  }
});
