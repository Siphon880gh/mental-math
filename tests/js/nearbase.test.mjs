// Run with: node --test tests/js/*.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import { NEAR_BASE_SHAPES, nearBaseRound } from "../../public/assets/js/nearbase.js";
import { seeded } from "./seeded.mjs";

test("guide sample identity holds for every pair near 100 and 1,000", () => {
  for (const base of [100, 1000]) {
    for (let a = base - 15; a <= base + 15; a += 1) {
      for (let b = base - 15; b <= base + 15; b += 1) {
        const left = a + (b - base);
        assert.equal(left * base + (a - base) * (b - base), a * b);
      }
    }
  }
});

test("rounds match their shape, the answer is a × b, and each step has one right option", () => {
  for (let seed = 1; seed <= 300; seed += 1) {
    const rand = seeded(seed);
    for (let i = 0; i < NEAR_BASE_SHAPES.length * 2; i += 1) {
      const r = nearBaseRound(i, rand);
      const shape = NEAR_BASE_SHAPES[i % NEAR_BASE_SHAPES.length];
      const { base } = shape;
      assert.equal(r.a, base + r.da);
      assert.equal(r.b, base + r.db);
      assert.ok(r.da !== 0 && r.db !== 0);
      if (shape.kind === "below") assert.ok(r.da < 0 && r.db < 0);
      if (shape.kind === "above") assert.ok(r.da > 0 && r.db > 0);
      if (shape.kind === "mixed") assert.ok(r.da * r.db < 0);
      assert.equal(r.answer, r.a * r.b, `${r.a} × ${r.b}`);
      assert.equal(r.left, r.a + r.db);
      assert.equal(r.left, r.b + r.da);
      assert.equal(r.prod, r.da * r.db);
      assert.ok(Math.abs(r.prod) < base);
      const steps = [...r.steps, { answer: r.answer, options: r.finals }];
      for (const [k, step] of steps.entries()) {
        assert.ok(step.options.length >= 2, `${r.prompt} step ${k} has a wrong option`);
        const ok = step.options.filter((o) => o.ok);
        assert.equal(ok.length, 1);
        assert.equal(ok[0].value, step.answer);
        assert.equal(new Set(step.options.map((o) => o.text)).size, step.options.length);
        assert.equal(new Set(step.options.map((o) => o.value)).size, step.options.length);
        for (const o of step.options.filter((x) => !x.ok)) {
          assert.ok(o.why && o.why.length > 20, `${r.prompt} step ${k} explains ${o.text}`);
        }
      }
      assert.ok(r.finals.length <= 3);
    }
  }
});

test("right part keeps the base's digit count", () => {
  const rand = seeded(9);
  for (let i = 0; i < 400; i += 1) {
    const r = nearBaseRound(i, rand);
    const width = String(r.shape.base).length - 1;
    const ok = r.steps[1].options.find((o) => o.ok);
    const digits = ok.text.split("= ")[1].replace("−", "");
    assert.equal(digits.length, width, ok.text);
  }
});
