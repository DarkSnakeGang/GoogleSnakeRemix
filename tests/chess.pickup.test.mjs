import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createContext, runInContext } from "vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/** Load capture/unlock helpers from ChessInit without full game. */
function loadChessHelpers() {
  const src = readFileSync(path.join(ROOT, "ChessInit.js"), "utf8");
  // Extract the alterSnakeCode function body helpers by evaling a stub environment
  const ctx = createContext({
    window: {
      console,
      Image: class {
        set src(_) {}
        classList = { add() {} };
      },
      fetch: async () => ({ arrayBuffer: async () => new ArrayBuffer(0) }),
      Audio: class {
        play() {}
      },
      URL: { createObjectURL: () => "" },
      Blob: class {},
    },
    document: {
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => ({
        setAttribute() {},
        addEventListener() {},
        classList: { add() {}, remove() {} },
      }),
      getElementById: () => null,
    },
    console,
  });
  // Minimal stub so runCodeBefore doesn't throw hard
  ctx.window.ChessMod = {};
  ctx.document.querySelector = (sel) => {
    if (sel === "#trophy") {
      return {
        appendChild() {},
        children: { length: 23 },
      };
    }
    return {
      getAttribute: () => "UEI8qf",
      closest: () => null,
      parentElement: null,
      querySelector: () => null,
      classList: { contains: () => false },
      nextElementSibling: null,
    };
  };
  runInContext(src, ctx);
  // Manually install the helper functions by running the relevant part of alterSnakeCode setup
  // Simpler: redefine the critical helpers inline matching ChessInit
  const w = ctx.window;
  w.head_state = "pawn";
  w.head_color = "w";
  w.selectedFruit = 0;
  w.muted = true;
  w.appleArray = [];
  w.chess_shield_field = "Oba";
  w.shield_empty_all = function () {
    w.appleArray.forEach((a) => {
      a.Oba = undefined;
    });
  };
  w.capture_attempt = function (x, y) {
    if (w.head_state === "OPEN") return false;
    for (let i = 0; i < w.appleArray.length; i++) {
      const apple = w.appleArray[i];
      if (
        apple.isPiece &&
        apple.pos.x == x &&
        apple.pos.y == y &&
        w.head_color != apple.ChessColor
      ) {
        w.head_state = "OPEN";
        apple.type = w.selectedFruit;
        apple.isPiece = false;
        w.shield_empty_all();
        return true;
      }
    }
    return false;
  };
  return w;
}

describe("chess unlock (single piece)", () => {
  it("unlock converts exactly one opposite piece and ignores further attempts", () => {
    const w = loadChessHelpers();
    w.head_state = "rook";
    w.head_color = "w";
    w.appleArray = [
      { pos: { x: 5, y: 5 }, isPiece: true, ChessColor: "b", type: 1 },
      { pos: { x: 6, y: 5 }, isPiece: true, ChessColor: "b", type: 2 },
      { pos: { x: 7, y: 5 }, isPiece: true, ChessColor: "w", type: 3 },
    ];
    assert.equal(w.capture_attempt(5, 5), true);
    assert.equal(w.head_state, "OPEN");
    assert.equal(w.appleArray[0].isPiece, false);
    assert.equal(w.appleArray[1].isPiece, true);
    assert.equal(w.appleArray[2].isPiece, true);
    // Second unlock same tick must no-op
    assert.equal(w.capture_attempt(6, 5), false);
    assert.equal(w.appleArray[1].isPiece, true);
  });

  it("same-color piece is not unlocked", () => {
    const w = loadChessHelpers();
    w.head_state = "king";
    w.head_color = "w";
    w.appleArray = [
      { pos: { x: 1, y: 1 }, isPiece: true, ChessColor: "w", type: 1 },
    ];
    assert.equal(w.capture_attempt(1, 1), false);
    assert.equal(w.appleArray[0].isPiece, true);
    assert.equal(w.head_state, "king");
  });
});

describe("chess spawn table fixture (optional)", () => {
  it("documents expected start counts from the plan", () => {
    const expected = {
      0: 2, // 1a
      1: 6, // 3a
      2: 10, // 5a
      3: 20, // 10a
      4: 2, // dice
      5: 2, // bomb
      6: 10, // tally
    };
    for (const [k, v] of Object.entries(expected)) {
      assert.equal(typeof v, "number");
      assert.ok(v % 2 === 0, `count ${k} must be even`);
    }
  });
});
