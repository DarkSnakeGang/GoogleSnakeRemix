#!/usr/bin/env node
/**
 * Cache game HTML + snake JS for a googlesnakemods.com version into .cache/
 * Usage: node tools/fetch-game.mjs [version]
 *   version defaults to "current"
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CACHE = path.join(ROOT, ".cache");
const version = process.argv[2] || "current";
const base = `https://googlesnakemods.com/v/${version}/`;

async function main() {
  fs.mkdirSync(CACHE, { recursive: true });
  const htmlRes = await fetch(base);
  if (!htmlRes.ok) throw new Error(`HTML ${htmlRes.status} ${base}`);
  const html = await htmlRes.text();
  const htmlPath = path.join(CACHE, `index-${version}.html`);
  fs.writeFileSync(htmlPath, html, "utf8");

  // googlesnakemods.com/v/current/ HTML is the Google search shell; the game
  // bundle is always sibling snake.js (same as Pudding's tools/verify.js).
  let jsUrl = new URL("snake.js", base).href;
  const scriptMatch =
    html.match(/src="([^"]*snake[^"]*\.js[^"]*)"/i) ||
    html.match(/src="(\.\/[^"]+\.js)"/);
  if (scriptMatch) {
    let fromHtml = scriptMatch[1];
    if (fromHtml.startsWith("./") || fromHtml.startsWith("/")) {
      fromHtml = new URL(fromHtml, base).href;
    } else if (!fromHtml.startsWith("http")) {
      fromHtml = new URL(fromHtml, base).href;
    }
    // Prefer snake.js over snake-loader.js / other shells.
    if (/snake\.js(\?|$)/i.test(fromHtml)) jsUrl = fromHtml;
  }
  const jsRes = await fetch(jsUrl);
  if (!jsRes.ok) throw new Error(`JS ${jsRes.status} ${jsUrl}`);
  const js = await jsRes.text();
  const jsPath = path.join(CACHE, `snake-${version}.js`);
  fs.writeFileSync(jsPath, js, "utf8");

  const meta = {
    version,
    fetchedAt: new Date().toISOString(),
    htmlPath,
    jsPath,
    jsUrl,
    jsBytes: js.length,
  };
  fs.writeFileSync(
    path.join(CACHE, `meta-${version}.json`),
    JSON.stringify(meta, null, 2)
  );
  console.log(JSON.stringify(meta, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
