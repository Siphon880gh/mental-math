// Click through every game with wrong answers first, then right ones.
export function watch(page, rep) {
  const problems = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") problems.push(`${page.url()} console.${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => problems.push(`${page.url()} pageerror: ${e.message}`));
  page.on("response", (r) => {
    if (r.status() >= 400 && !r.request().isNavigationRequest()) problems.push(`${r.url()} HTTP ${r.status()}`);
  });
  const flush = () => {
    rep.ok(problems.length === 0, `no console errors, page errors, or failed sub-requests${problems.length ? `: ${problems.join(" | ")}` : ""}`);
    problems.length = 0;
  };
  // Chrome logs "Failed to load resource" for a 404 document; drop only that
  // one line per deliberate 404 visit and keep everything else.
  flush.expect404 = () => {
    const i = problems.findIndex((p) => p.includes("Failed to load resource: the server responded with a status of 404"));
    if (i >= 0) problems.splice(i, 1);
  };
  return flush;
}

const visible = (page, sel) => page.locator(sel).isVisible();
const text = (page, sel) => page.locator(sel).innerText();

async function pairHundred(page, base, rep) {
  rep.section("Pair to 100");
  await page.goto(`${base}/games/pair-hundred`);
  for (let round = 0; round < 3; round += 1) {
    const nums = (await page.locator("[data-pair]").evaluateAll((els) => els.map((e) => Number(e.dataset.pair))));
    rep.ok(nums.length === 6 && new Set(nums).size === 6, `set ${round}: six distinct tiles (${nums.join(", ")})`);
    const first = nums[0];
    const wrong = nums.find((n) => n !== first && n + first !== 100);
    await page.click(`[data-pair="${first}"]`);
    await page.click(`[data-pair="${wrong}"]`);
    rep.ok((await text(page, ".js-pair-miss")).includes(`${first} needs ${100 - first}`), `set ${round}: wrong pair names the partner`);
    await page.click(`[data-pair="${first}"]`);
    await page.click(`[data-pair="${first}"]`);
    rep.ok((await page.getAttribute(`[data-pair="${first}"]`, "aria-pressed")) === "false", `set ${round}: tapping twice unpicks`);
    const done = new Set();
    for (const n of nums) {
      if (done.has(n)) continue;
      await page.click(`[data-pair="${n}"]`);
      await page.click(`[data-pair="${100 - n}"]`);
      done.add(n).add(100 - n);
    }
    rep.ok((await text(page, ".js-pair-status")) === "Pairs found: 3 of 3", `set ${round}: 3 of 3`);
    rep.ok((await visible(page, ".js-pair-win")) && (await page.locator("[data-pair]:not([disabled])").count()) === 0, `set ${round}: win, all tiles done`);
    if (round === 0) {
      await page.click(".js-pair-reset");
      rep.ok((await page.locator("[data-pair]:not([disabled])").count()) === 6 && !(await visible(page, ".js-pair-win")), "start over keeps the set and clears it");
      const again = await page.locator("[data-pair]").evaluateAll((els) => els.map((e) => Number(e.dataset.pair)));
      rep.ok(again.join() === nums.join(), "start over keeps the same tiles");
      for (const n of nums.filter((x) => x < 50)) {
        await page.click(`[data-pair="${n}"]`);
        await page.click(`[data-pair="${100 - n}"]`);
      }
    }
    await page.click(".js-pair-next");
  }
}

// Shared walker for the step-choice games (Eleven neighbors, Near-base gaps).
async function walkSteps(page, rep, { choices, miss, label, maxSteps }) {
  let steps = 0;
  while ((await page.locator(`${choices} button`).count()) && steps <= maxSteps) {
    const wrong = page.locator(`${choices} button:not([data-ok])`).first();
    if (await wrong.count()) {
      await wrong.click();
      rep.ok((await visible(page, miss)) && (await text(page, miss)).length > 20, `${label} step ${steps}: wrong option explains`);
    }
    await page.click(`${choices} button[data-ok]`);
    steps += 1;
  }
  return steps;
}

async function elevenNeighbors(page, base, rep) {
  rep.section("Eleven neighbors");
  await page.goto(`${base}/games/eleven-neighbors`);
  for (let round = 0; round < 6; round += 1) {
    const prompt = await text(page, ".js-eleven-prompt");
    const n = Number(prompt.split(" ")[0]);
    const steps = await walkSteps(page, rep, { choices: ".js-eleven-choices", miss: ".js-eleven-miss", label: `r${round} ${prompt}`, maxSteps: 6 });
    const expected = (n * 11).toLocaleString("en-US");
    rep.ok((await text(page, ".js-eleven-win")).includes(`→ ${expected}.`), `r${round}: ${n} × 11 = ${expected}`);
    rep.ok(steps === String(n).length + 2, `r${round}: ${steps} steps`);
    rep.ok((await text(page, ".js-eleven-tally")) === `Rounds solved: ${round + 1}`, `r${round}: tally`);
    await page.click(".js-eleven-next");
  }
  await page.click(".js-eleven-reset");
  rep.ok(!(await visible(page, ".js-eleven-win")) && (await page.locator(".js-eleven-choices button").count()) >= 2, "reset gives a fresh round");
}

async function nearBaseGaps(page, base, rep) {
  rep.section("Near-base gaps");
  await page.goto(`${base}/games/near-base-gaps`);
  const kinds = new Set();
  for (let round = 0; round < 8; round += 1) {
    const prompt = await text(page, ".js-nb-prompt");
    const [a, b] = prompt.split(" × ").map(Number);
    const baseN = a > 500 ? 1000 : 100;
    kinds.add(a < baseN && b < baseN ? `below${baseN}` : a > baseN && b > baseN ? "above" : "mixed");
    rep.ok((await text(page, ".js-nb-gaps")).includes(`Distances from ${baseN.toLocaleString("en-US")}`), `r${round} ${prompt}: gaps shown`);
    rep.ok(!(await visible(page, ".js-nb-miss")), `r${round}: no stale miss`);
    const steps = await walkSteps(page, rep, { choices: ".js-nb-choices", miss: ".js-nb-miss", label: `r${round} ${prompt}`, maxSteps: 4 });
    rep.ok(steps === 3, `r${round}: left, right, together (${steps} steps)`);
    rep.ok((await text(page, ".js-nb-win")).endsWith(`→ ${(a * b).toLocaleString("en-US")}.`), `r${round}: ${prompt} = ${(a * b).toLocaleString("en-US")}`);
    await page.click(".js-nb-next");
  }
  rep.ok(kinds.size === 4, `all four shapes came up (${[...kinds].join(", ")})`);
  await page.click(".js-nb-reset");
  rep.ok(!(await visible(page, ".js-nb-win")) && (await text(page, ".js-nb-status")) === "? | ?", "reset starts a fresh round");
}

async function stepGame(page, base, rep, { slug, title, rounds, check }) {
  rep.section(title);
  await page.goto(`${base}/games/${slug}`);
  for (let round = 0; round < rounds; round += 1) {
    const prompt = await text(page, ".js-step-prompt");
    const info = await text(page, ".js-step-info");
    rep.ok(!(await visible(page, ".js-step-miss")), `r${round}: no stale miss`);
    const steps = await walkSteps(page, rep, { choices: ".js-step-choices", miss: ".js-step-miss", label: `r${round} ${prompt}`, maxSteps: 4 });
    rep.ok(steps === 3, `r${round}: three picks (${steps})`);
    const win = await text(page, ".js-step-win");
    rep.ok(check(prompt, info, win), `r${round}: ${prompt} · ${info} → ${win}`);
    rep.ok((await text(page, ".js-step-tally")) === `Rounds solved: ${round + 1}`, `r${round}: tally`);
    await page.click(".js-step-next");
  }
  await page.click(".js-step-reset");
  rep.ok(!(await visible(page, ".js-step-win")) && (await page.locator(".js-step-choices button").count()) >= 3, "reset gives a fresh round");
}

const num = (s) => Number(s.replace(/[$,k]/g, ""));

async function runwayCheck(page, base, rep) {
  await stepGame(page, base, rep, {
    slug: "runway-check",
    title: "Runway check",
    rounds: 5,
    check: (prompt, info, win) => {
      const cash = num(prompt.split(" ")[0]);
      const [spend, revenue] = [...info.matchAll(/\$(\d+)k/g)].map((m) => Number(m[1]));
      const months = cash / (spend - revenue);
      const start = months - 6;
      return win.includes(`Net burn $${spend - revenue}k → ${months} months`) && win.endsWith(start === 0 ? "now." : `in ${start} month${start === 1 ? "" : "s"}.`);
    },
  });
}

async function arrRead(page, base, rep) {
  await stepGame(page, base, rep, {
    slug: "arr-read",
    title: "ARR read",
    rounds: 6,
    check: (prompt, info, win) => {
      const [, seats, price] = prompt.match(/^(\d+) seats at \$(\d+)\/mo$/) || [];
      const pct = Number(info.match(/Budget (\d+)% of ARR/)[1]);
      const arr = seats * price * 12;
      return win === `MRR $${(seats * price).toLocaleString("en-US")} → ARR $${arr.toLocaleString("en-US")} → ${pct}% = $${((arr * pct) / 100).toLocaleString("en-US")}.`;
    },
  });
}

async function sorobanRod(page, base, rep) {
  rep.section("Soroban rod");
  await page.goto(`${base}/games/soroban-rod`);
  const boardValue = () => page.evaluate(() => Number([...document.querySelectorAll(".js-soroban-board .soroban__rod")].map((r) => r.dataset.digit).join("")));
  const beadsMatch = () =>
    page.evaluate(() =>
      [...document.querySelectorAll(".js-soroban-board .soroban__rod")].every((r) => {
        const d = Number(r.dataset.digit);
        const five = r.querySelector(".soroban__bead--five").classList.contains("is-on");
        return five === d >= 5 && r.querySelectorAll(".soroban__lower .soroban__bead.is-on").length === d % 5;
      }),
    );
  rep.ok((await boardValue()) === 47 && (await beadsMatch()), "opens on 47 with matching beads");
  const seen = new Set();
  for (let i = 0; i < 24; i += 1) {
    const prompt = await text(page, ".js-soroban-prompt");
    const [, aStr, op, kStr] = prompt.match(/^(\d+) ([+−]) (\d)$/) || [];
    const a = Number(aStr);
    const k = Number(kStr);
    const after = op === "−" ? a - k : a + k;
    rep.ok(Boolean(op) && (await boardValue()) === a, `${i}: board shows ${a} for "${prompt}"`);
    await page.locator(".js-soroban-choices button:not([data-ok])").first().click();
    rep.ok(await visible(page, ".js-soroban-miss"), `${i}: wrong move explains`);
    seen.add(`${op}${await page.getAttribute(".js-soroban-choices button[data-ok]", "data-kind")}`);
    await page.click(".js-soroban-choices button[data-ok]");
    rep.ok((await boardValue()) === after && (await beadsMatch()), `${i}: ${prompt} → ${after}, beads redrawn`);
    await page.click(".js-soroban-next");
  }
  rep.ok(seen.size === 6, `all six moves came up (${[...seen].join(", ")})`);
  await page.click(".js-soroban-reset");
  const fresh = await boardValue();
  rep.ok(fresh >= 11 && fresh <= 39 && (await beadsMatch()), `new board ${fresh}`);
}

async function olderGames(page, base, rep) {
  rep.section("Decimal shifter, percent swap, percent chips");
  await page.goto(`${base}/games/percent-chips`);
  await page.click('[data-chip="25"]');
  await page.click('[data-chip="10"]');
  rep.ok(await visible(page, ".js-chip-win"), "chips: 35% win");
  await page.goto(`${base}/games/percent-swap`);
  await page.click(".js-swap");
  await page.click(".js-half");
  rep.ok(await visible(page, ".js-swap-win"), "swap: win");
  await page.goto(`${base}/games/decimal-shift`);
  await page.click(".js-shift-left");
  rep.ok(await visible(page, ".js-win-10"), "decimal: 10% win");
}

export async function runGames(browser, base, rep) {
  const page = await browser.newPage();
  const flush = watch(page, rep);
  for (const run of [pairHundred, elevenNeighbors, nearBaseGaps, sorobanRod, runwayCheck, arrRead, olderGames]) {
    await run(page, base, rep);
    flush();
  }
  await page.close();
}
