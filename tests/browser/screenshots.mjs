// Re-shoot the README screenshots for the newer pages. Starts `php -S` on a
// free port with router.php, drives one wrong pick per game so the shot shows
// the explanation, saves to docs/screenshots, and always stops the server.
//
//   npm run screenshots              # all shots below
//   npm run screenshots -- toolbox   # only the named ones
//
// Same viewport as the older shots: 1315×717 CSS px at 2× (2630×1434), dark.
// Games deal random numbers, so each run shows a different round.
// Env: PHP_BIN (default "php"), BROWSER_CHANNEL (default "chrome").
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = resolve(ROOT, "docs/screenshots");

const wrongAfterRight = (choices) => async (page) => {
  await page.click(`${choices} button[data-ok]`);
  await page.locator(`${choices} button:not([data-ok])`).first().click();
};

const SHOTS = {
  "pair-hundred": {
    path: "/games/pair-hundred",
    async act(page) {
      const nums = await page.locator("[data-pair]").evaluateAll((els) => els.map((e) => Number(e.dataset.pair)));
      const a = nums[0];
      await page.click(`[data-pair="${a}"]`);
      await page.click(`[data-pair="${100 - a}"]`);
      const b = nums.find((n) => n !== a && n !== 100 - a);
      const wrong = nums.find((n) => ![a, 100 - a, b, 100 - b].includes(n));
      await page.click(`[data-pair="${b}"]`);
      await page.click(`[data-pair="${wrong}"]`);
    },
  },
  "eleven-neighbors": { path: "/games/eleven-neighbors", act: wrongAfterRight(".js-eleven-choices") },
  "near-base-gaps": { path: "/games/near-base-gaps", act: wrongAfterRight(".js-nb-choices") },
  "runway-check": { path: "/games/runway-check", act: wrongAfterRight(".js-step-choices"), scrollY: 110 },
  "arr-read": { path: "/games/arr-read", act: wrongAfterRight(".js-step-choices"), scrollY: 110 },
  toolbox: { path: "/toolbox" },
  "case-advanced": {
    path: "/cases/sf-adv-fleet-bill",
    async act(page) {
      await page.click("text=Open this case this session");
      await page.fill("input >> visible=true", "14400");
      await page.press("input >> visible=true", "Enter");
      await page.waitForTimeout(500);
    },
    scrollY: 430,
  },
};

function freePort() {
  return new Promise((ok, fail) => {
    const srv = createServer();
    srv.unref();
    srv.on("error", fail);
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => ok(port));
    });
  });
}

const wanted = process.argv.slice(2);
const names = wanted.length ? wanted : Object.keys(SHOTS);
for (const n of names) if (!SHOTS[n]) throw new Error(`unknown shot "${n}"; known: ${Object.keys(SHOTS).join(", ")}`);

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.env.PHP_BIN || "php", ["-S", `127.0.0.1:${port}`, "router.php"], { cwd: ROOT, stdio: "ignore" });
let browser = null;
try {
  for (let i = 0; i < 100; i += 1) {
    try {
      if ((await fetch(`${base}/`)).ok) break;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  const { chromium } = await import("playwright-core");
  const channel = process.env.BROWSER_CHANNEL || "chrome";
  browser = await chromium.launch(channel === "chromium" ? {} : { channel });
  const ctx = await browser.newContext({ viewport: { width: 1315, height: 717 }, deviceScaleFactor: 2, colorScheme: "dark" });
  const page = await ctx.newPage();
  for (const name of names) {
    const shot = SHOTS[name];
    await page.goto(base + shot.path);
    await page.waitForLoadState("networkidle");
    if (shot.act) await shot.act(page);
    await page.evaluate((y) => {
      window.scrollTo(0, y);
      if (document.activeElement) document.activeElement.blur();
    }, shot.scrollY || 0);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${OUT}/${name}.png` });
    console.log(`docs/screenshots/${name}.png`);
  }
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill("SIGTERM");
}
