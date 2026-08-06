#!/usr/bin/env node
/**
 * Dump ASCII boards for Chess vs Portal under the same seed / count / size.
 * Usage: node tools/board.mjs [countIndex] [sizeIndex]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { launchHarness, COUNT, SIZE, renderAscii } from "./harness.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const count = Number(process.argv[2] ?? COUNT.FIVE);
const size = Number(process.argv[3] ?? SIZE.NORMAL);
const seed = 42;

async function dumpOne(mode, label) {
  const h = await launchHarness({ seed, headless: true });
  try {
    await h.start({ mode, count, size });
    // Give the game a moment to reset apples
    await h.page.waitForTimeout(1500);
    try {
      await h.waitForGame(20000);
    } catch {
      /* may still have apples via window */
    }
    // Force a tick if possible
    try {
      await h.tick(1);
    } catch {
      /* */
    }
    const state = await h.state();
    const ascii = renderAscii(state);
    console.log("\n==== " + label + " ====");
    console.log(ascii);
    console.log(
      "positions:",
      JSON.stringify(
        (state.apples || []).map((a) => [a.x, a.y, a.isPiece, a.ChessColor])
      )
    );
    return state;
  } finally {
    await h.close();
  }
}

async function main() {
  const portal = await dumpOne("portal", "PORTAL");
  const chess = await dumpOne("chess", "CHESS");

  const fixtureDir = path.join(ROOT, "tools", "fixtures");
  fs.mkdirSync(fixtureDir, { recursive: true });
  const out = {
    seed,
    count,
    size,
    capturedAt: new Date().toISOString(),
    portal: {
      board: portal.board,
      positions: (portal.apples || []).map((a) => ({ x: a.x, y: a.y })),
    },
    chess: {
      board: chess.board,
      positions: (chess.apples || []).map((a) => ({
        x: a.x,
        y: a.y,
        color: a.ChessColor,
        piece: a.ChessPiece,
      })),
    },
  };
  const outPath = path.join(
    fixtureDir,
    `chess-spawn-table-c${count}-s${size}.json`
  );
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("\nWrote", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
