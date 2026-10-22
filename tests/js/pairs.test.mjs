// Run with: node --test tests/js/*.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import { PAIR_SHAPES, pairMiss, pairRound } from "../../public/assets/js/pairs.js";
import { seeded } from "./seeded.mjs";

test("every set is three pairs to 100 with exactly one partner per tile", () => {
  for (let seed = 1; seed <= 300; seed += 1) {
    const rand = seeded(seed);
    for (let i = 0; i < PAIR_SHAPES.length * 2; i += 1) {
      const r = pairRound(i, rand);
      assert.equal(r.target, 100);
      assert.equal(r.pairs.length, 3);
      assert.equal(r.numbers.length, 6);
      assert.equal(new Set(r.numbers).size, 6, "no repeated tiles");
      for (const [a, b] of r.pairs) assert.equal(a + b, 100);
      for (const n of r.numbers) {
        assert.ok(n >= 5 && n <= 95 && n !== 50, String(n));
        const partners = r.numbers.filter((m) => m !== n && m + n === 100);
        assert.equal(partners.length, 1, `${n} has one partner`);
        if (PAIR_SHAPES[i % PAIR_SHAPES.length].step === 5) assert.equal(n % 5, 0);
      }
      assert.deepEqual([...r.numbers].sort((x, y) => x - y), r.pairs.flat().sort((x, y) => x - y));
    }
  }
});

test("same seed, same set", () => {
  assert.deepEqual(pairRound(1, seeded(42)), pairRound(1, seeded(42)));
});

test("miss explanations name the right partner and the 110 slip", () => {
  assert.equal(pairMiss(18, 35), "18 + 35 = 53, not 100. 18 needs 82.");
  assert.match(pairMiss(38, 72), /= 110\. When the ones make 10, the tens make 9, not 10\. 38 needs 62\./);
  for (let a = 5; a <= 95; a += 1) {
    for (let b = 5; b <= 95; b += 1) {
      if (a + b !== 100) assert.ok(pairMiss(a, b).endsWith(`${a} needs ${100 - a}.`));
    }
  }
});
