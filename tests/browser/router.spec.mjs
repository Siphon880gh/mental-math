// router.php serves assets under both /public/assets and /assets, refuses
// paths that climb out of public/assets, and leaves everything else to index.php.
import { request } from "node:http";

// Raw GET so "../" and "%2e%2e" reach the server unnormalized.
function rawGet(base, path) {
  const { hostname, port } = new URL(base);
  return new Promise((ok, fail) => {
    const req = request({ hostname, port, path, method: "GET" }, (res) => {
      let body = "";
      res.on("data", (c) => {
        body += c;
      });
      res.on("end", () => ok({ status: res.statusCode, type: res.headers["content-type"] || "", length: res.headers["content-length"], body }));
    });
    req.on("error", fail);
    req.end();
  });
}

export async function runRouter(base, rep) {
  rep.section("router.php");
  const assets = [
    ["/public/assets/js/main.js", "text/javascript"],
    ["/public/assets/js/games.js", "text/javascript"],
    ["/public/assets/css/app.css", "text/css"],
    ["/assets/js/main.js", "text/javascript"],
    ["/assets/css/app.css", "text/css"],
  ];
  for (const [path, type] of assets) {
    const res = await rawGet(base, path);
    rep.ok(res.status === 200 && res.type.startsWith(type), `${path} → ${res.status} ${res.type}`);
    rep.ok(Number(res.length) === Buffer.byteLength(res.body), `${path} Content-Length matches the body`);
  }
  const refused = [
    "/public/assets/../../composer.json",
    "/public/assets/%2e%2e/%2e%2e/router.php",
    "/assets/../../data/cases.json",
    "/public/assets/js/nope.js",
    "/public/assets/js",
  ];
  for (const path of refused) {
    const res = await rawGet(base, path);
    rep.ok(res.status === 404 && !res.body.includes('"cases"') && !res.body.includes("<?php"), `${path} → ${res.status} (not served)`);
  }
  for (const [path, status] of [["/", 200], ["/games", 200], ["/index.php?route=%2Fgames", 200], ["/cases/ar-nope", 404], ["/cases?pack=nope", 404], ["/nope", 404]]) {
    const res = await rawGet(base, path);
    rep.ok(res.status === status && res.type.startsWith("text/html"), `${path} → ${res.status} html`);
  }
}
