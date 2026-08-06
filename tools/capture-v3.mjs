#!/usr/bin/env node
/**
 * Capture original ChessMod layout on game v3 as a reference artifact.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "tools", "fixtures", "chess-v3.json");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.addInitScript(() => {
    localStorage.setItem("snakeChosenMod", "ChessMod");
    localStorage.setItem("snakeForceDevMode", "true");
  });

  await page.goto("https://googlesnakemods.com/v/3/", {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });

  await page.waitForTimeout(5000);

  const snapshot = await page.evaluate(() => {
    return {
      hasChess: typeof window.ChessMod !== "undefined" || !!window.head_state,
      head_state: window.head_state,
      appleCount: window.appleArray?.length ?? null,
      apples: (window.appleArray || []).slice(0, 40).map((a) => ({
        x: a.pos?.x,
        y: a.pos?.y,
        isPiece: a.isPiece,
        ChessColor: a.ChessColor,
        ChessPiece: a.ChessPiece,
        type: a.type,
      })),
      title: document.title,
      bodySnippet: document.body?.innerText?.slice(0, 200),
    };
  });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const payload = {
    capturedAt: new Date().toISOString(),
    url: "https://googlesnakemods.com/v/3/",
    note: "Reference dump of original ChessMod on game v3. Layouts may need a started game; re-run after manual play if empty.",
    snapshot,
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log("Wrote", OUT);
  console.log(JSON.stringify(snapshot, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
