// Browser + HTTP suite. Starts `php -S` on a free port with router.php, runs the
// specs, and always stops the server. PHPUnit does not depend on this.
//
//   npm install            # once: playwright-core only, no browser download
//   npm run test:browser   # uses installed Google Chrome (channel "chrome")
//
// Env: PHP_BIN (default "php"), BROWSER_CHANNEL (default "chrome"; set to
// "chromium" after `npx playwright-core install chromium`), HEADED=1 to watch.
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runGames } from "./games.spec.mjs";
import { runPages } from "./pages.spec.mjs";
import { runRouter } from "./router.spec.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

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

async function waitForServer(base, server) {
  for (let i = 0; i < 100; i += 1) {
    if (server.exitCode !== null) throw new Error(`php -S exited with ${server.exitCode}`);
    try {
      const res = await fetch(`${base}/`);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("php -S did not answer within 10s");
}

export function makeReporter() {
  const results = [];
  return {
    results,
    ok(cond, msg) {
      results.push({ pass: Boolean(cond), msg });
    },
    section(name) {
      results.push({ section: name });
    },
  };
}

async function launchBrowser() {
  const { chromium } = await import("playwright-core");
  const channel = process.env.BROWSER_CHANNEL || "chrome";
  const headless = !process.env.HEADED;
  try {
    return await chromium.launch(channel === "chromium" ? { headless } : { channel, headless });
  } catch (err) {
    throw new Error(
      `Could not launch ${channel}. Install Google Chrome, or run \`npx playwright-core install chromium\` and set BROWSER_CHANNEL=chromium.\n${err.message}`,
    );
  }
}

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const phpBin = process.env.PHP_BIN || "php";
const server = spawn(phpBin, ["-S", `127.0.0.1:${port}`, "router.php"], { cwd: ROOT, stdio: ["ignore", "ignore", "pipe"] });
let serverLog = "";
server.stderr.on("data", (chunk) => {
  serverLog += chunk;
});
const stop = () => {
  if (server.exitCode === null) server.kill("SIGTERM");
};
process.on("SIGINT", () => {
  stop();
  process.exit(130);
});

const rep = makeReporter();
let browser = null;
let crashed = null;
try {
  await waitForServer(base, server);
  await runRouter(base, rep);
  browser = await launchBrowser();
  await runGames(browser, base, rep);
  await runPages(browser, base, rep);
} catch (err) {
  crashed = err;
} finally {
  if (browser) await browser.close();
  stop();
}

let failed = 0;
for (const r of rep.results) {
  if (r.section) {
    console.log(`\n# ${r.section}`);
    continue;
  }
  if (!r.pass) failed += 1;
  if (!r.pass || process.env.VERBOSE) console.log(`${r.pass ? "ok  " : "FAIL"} ${r.msg}`);
}
const phpProblems = serverLog.split("\n").filter((l) => /PHP (Fatal|Warning|Deprecated|Notice|Parse)/i.test(l));
for (const line of phpProblems) console.log(`FAIL php: ${line}`);
const total = rep.results.filter((r) => !r.section).length;
console.log(`\n${total - failed} of ${total} checks passed on ${base} (${phpBin}).${crashed ? "" : ""}`);
if (crashed) {
  console.error(`\nSuite stopped early: ${crashed.stack || crashed}`);
  process.exit(1);
}
process.exit(failed || phpProblems.length ? 1 : 0);
