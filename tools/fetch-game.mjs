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

  const scriptMatch =
    html.match(/src="([^"]*snake[^"]*\.js[^"]*)"/i) ||
    html.match(/src="(\.\/[^"]+\.js)"/);
  if (!scriptMatch) {
    // Fall back: find any large game script reference
    const all = [...html.matchAll(/src="([^"]+\.js)"/g)].map((m) => m[1]);
    console.error("Scripts found:", all);
    throw new Error("Could not find snake JS URL in HTML");
  }
  let jsUrl = scriptMatch[1];
  if (jsUrl.startsWith("./") || jsUrl.startsWith("/")) {
    jsUrl = new URL(jsUrl, base).href;
  } else if (!jsUrl.startsWith("http")) {
    jsUrl = new URL(jsUrl, base).href;
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
