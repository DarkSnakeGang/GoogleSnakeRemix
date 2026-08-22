import { describe, it } from "node:test";
import assert from "node:assert/strict";

const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

/**
 * Move apple[0] onto the cell the head enters next and tick once.
 * asFruit=true simulates a post-unlock fruit (OPEN head, no shields).
 */
async function eatAheadOfHead(page, asFruit) {
  return page.evaluate((asFruit) => {
    const g = window.__remixGame;
    const apples = g.wa.ka;
    if (!apples.length) return { ok: false, reason: "no apples" };

    const head = g.oa.ka[0];
    const dir = g.oa.direction || "RIGHT";
    const next = { x: head.x, y: head.y };
    if (dir === "RIGHT") next.x += 1;
    else if (dir === "LEFT") next.x -= 1;
    else if (dir === "UP") next.y -= 1;
    else if (dir === "DOWN") next.y += 1;

    const target = apples[0];
    target.pos.x = next.x;
    target.pos.y = next.y;
    if (asFruit) {
      target.isPiece = false;
      target.type = 0;
    } else {
      target.isPiece = true;
      if (!target.ChessPiece) target.ChessPiece = "pawn";
      if (!target.ChessColor) target.ChessColor = "w";
    }

    // Head must be OPEN with shields cleared for the eat to register.
    window.head_state = "OPEN";
    window.shield_empty_all && window.shield_empty_all();
    apples.forEach((a) => (a.Oba = undefined));

    const before = apples.length;
    const beforeScore = g.Sh;
    const beforeKeys = apples.map((a) => `${a.pos.x},${a.pos.y}`);

    g.tick();

    const after = g.wa.ka;
    const afterKeys = after.map((a) => `${a.pos.x},${a.pos.y}`);
    const fresh = after.filter((a) => !beforeKeys.includes(`${a.pos.x},${a.pos.y}`));
    return {
      ok: true,
      before,
      after: after.length,
      added: fresh.length,
      freshAnimated: fresh.every((a) => a.wm === true),
      allPieces: after.every((a) => !!a.isPiece),
      scoreBefore: beforeScore,
      scoreAfter: g.Sh,
      head_state: window.head_state,
      just_ate: window.just_ate,
      won: !!(g.ub && g.lj),
      duplicates: afterKeys.length - new Set(afterKeys).size,
    };
  }, asFruit);
}

describe("chess fruit eat (browser)", { skip: !runBrowser }, () => {
  it("1a: eating a fruit spawns exactly 2 animated pieces, not 3", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 5, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      await h.page.waitForTimeout(200);

      const piece = await eatAheadOfHead(h.page, false);
      assert.equal(piece.ok, true, JSON.stringify(piece));
      assert.equal(piece.after, 1, "one piece remains after the piece eat");

      const fruit = await eatAheadOfHead(h.page, true);
      assert.equal(fruit.ok, true, JSON.stringify(fruit));
      assert.equal(fruit.just_ate, "fruit");
      assert.equal(fruit.added, 2, "exactly 2 pieces spawn: " + JSON.stringify(fruit));
      assert.equal(fruit.after, 2, "board is back to its 1a count of 2");
      assert.equal(fruit.freshAnimated, true, "new pieces carry the wm spawn animation");
      assert.equal(fruit.allPieces, true, "spawns are chess pieces");
      assert.equal(fruit.scoreAfter, fruit.scoreBefore + 1, "fruit scores");
      assert.equal(fruit.duplicates, 0, "no overlapping cells");
      assert.equal(fruit.won, false);
    } finally {
      await h.close();
    }
  });

  it("5a: fruit eat returns the board to 10 pieces", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 6, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.FIVE, size: SIZE.NORMAL });
      await h.page.waitForTimeout(200);

      const piece = await eatAheadOfHead(h.page, false);
      assert.equal(piece.after, 9, JSON.stringify(piece));

      const fruit = await eatAheadOfHead(h.page, true);
      assert.equal(fruit.added, 2, JSON.stringify(fruit));
      assert.equal(fruit.after, 10, "back to 5a count of 10");
      assert.equal(fruit.freshAnimated, true);
      assert.equal(fruit.duplicates, 0);
    } finally {
      await h.close();
    }
  });
});
