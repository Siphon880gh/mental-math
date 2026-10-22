// Every main page loads with CSS and JS, no console errors; unknown slugs 404.
import { watch } from "./games.spec.mjs";

const PAGES = [
  "/",
  "/track-a",
  "/track-b",
  "/toolbox",
  "/guides/mental-abacus",
  "/guides/fixed-multipliers",
  "/coach/fixed-multipliers",
  "/coach/easy-division",
  "/drills",
  "/drills/foundations",
  "/cases",
  "/cases?pack=arithmetic-in-the-room",
  "/cases/ar-licenses-3158x7",
  "/scenarios",
  "/scenarios/restock-six-budget",
  "/games",
];

const MISSING = ["/guides/nope", "/coach/nope", "/drills/nope", "/cases/nope", "/cases?pack=nope", "/scenarios/nope", "/games/nope", "/nope"];

export async function runPages(browser, base, rep) {
  rep.section("Pages");
  const page = await browser.newPage();
  const flush = watch(page, rep);
  for (const path of PAGES) {
    const res = await page.goto(base + path);
    const styled = await page.evaluate(() => getComputedStyle(document.body).backgroundColor !== "rgba(0, 0, 0, 0)");
    rep.ok(res.status() === 200 && styled, `${path} → ${res.status()}, styled`);
  }
  for (const path of MISSING) {
    const res = await page.goto(base + path);
    rep.ok(res.status() === 404 && (await page.locator("h1").count()) > 0, `${path} → ${res.status()} with the site layout`);
    flush.expect404();
  }
  await page.goto(`${base}/coach/fixed-multipliers`);
  const choices = await page.locator(".js-coach-choices button, .js-coach-choices a").count();
  rep.ok(choices >= 2, `coach renders choices (${choices})`);
  await page.goto(`${base}/guides/mental-abacus`);
  rep.ok((await page.locator("figure.soroban").count()) === 9, "soroban guide: 9 bead figures");
  flush();
  await page.close();
}
