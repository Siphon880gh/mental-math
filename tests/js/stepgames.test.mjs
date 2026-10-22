// Run with: node --test tests/js/*.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import { arrRound } from "../../public/assets/js/arr.js";
import { RAISE_MONTHS, runwayRound } from "../../public/assets/js/runway.js";
import { seeded } from "./seeded.mjs";

function checkSteps(r, label) {
  const steps = [...r.steps, { answer: r.answer, options: r.finals }];
  for (const [k, step] of steps.entries()) {
    assert.ok(step.options.length >= 3, `${label} step ${k} keeps two wrong options`);
    const ok = step.options.filter((o) => o.ok);
    assert.equal(ok.length, 1, `${label} step ${k}`);
    assert.equal(ok[0].value, step.answer, `${label} step ${k}`);
    assert.equal(new Set(step.options.map((o) => o.text)).size, step.options.length);
    assert.equal(new Set(step.options.map((o) => o.value)).size, step.options.length);
    for (const o of step.options.filter((x) => !x.ok)) {
      assert.ok(o.why && o.why.length > 20, `${label} step ${k} explains ${o.text}`);
    }
  }
}

test("runway rounds: net burn, cash ÷ net burn, raise at runway − 6", () => {
  for (let seed = 1; seed <= 300; seed += 1) {
    const rand = seeded(seed);
    for (let i = 0; i < 6; i += 1) {
      const r = runwayRound(i, rand);
      const label = `${r.cash}/${r.spend}/${r.revenue}`;
      assert.ok(r.revenue > 0 && r.revenue <= r.net, label);
      assert.equal(r.net, r.spend - r.revenue);
      assert.equal(r.cash / r.net, r.months);
      assert.ok(Number.isInteger(r.months) && r.months >= RAISE_MONTHS && r.months <= 24, label);
      assert.equal(r.start, r.months - RAISE_MONTHS);
      assert.equal(r.steps[0].answer, r.net);
      assert.equal(r.steps[1].answer, r.months);
      assert.ok(r.prompt.includes(`$${r.cash}k`) && r.info.includes(`$${r.spend}k`) && r.info.includes(`$${r.revenue}k`), label);
      checkSteps(r, label);
    }
  }
});

test("ARR rounds: setup fee stays out of MRR, ×12, then a percent of ARR", () => {
  const percents = new Set();
  for (let seed = 1; seed <= 300; seed += 1) {
    const rand = seeded(seed);
    for (let i = 0; i < 6; i += 1) {
      const r = arrRound(i, rand);
      const label = `${r.seats}×${r.price} fee ${r.fee} ${r.pct}%`;
      assert.equal(r.mrr, r.seats * r.price);
      assert.equal(r.arr, r.mrr * 12);
      assert.equal(r.slice, (r.arr * r.pct) / 100);
      assert.ok(Number.isInteger(r.slice), label);
      assert.equal(r.answer, r.slice);
      assert.ok(r.info.includes("one-time setup fee") && r.info.includes(`${r.pct}% of ARR`), label);
      percents.add(r.pct);
      checkSteps(r, label);
    }
  }
  assert.equal(percents.size, 6);
});
