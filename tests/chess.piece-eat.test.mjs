import { describe, it } from "node:test";
import assert from "node:assert/strict";

const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

/**
 * Place apple[0] one cell ahead of the head, tick once so the snake eats it.
 * Returns before/after snapshots for assertions.
 */
async function eatPieceAtHead(page) {
  return page.evaluate(() => {
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

    // Ensure OPEN so shields don't block the eat; place piece 0 on next cell.
    window.head_state = "OPEN";
    window.shield_empty_all && window.shield_empty_all();

    const eaten = apples[0];
    const beforePositions = apples.map((a) => ({
      x: a.pos.x,
      y: a.pos.y,
      isPiece: !!a.isPiece,
      ChessColor: a.ChessColor,
      ChessPiece: a.ChessPiece,
    }));
    const beforeKeys = new Set(
      beforePositions.slice(1).map((a) => `${a.x},${a.y}`)
    );

    eaten.pos.x = next.x;
    eaten.pos.y = next.y;
    eaten.isPiece = true;
    if (!eaten.ChessPiece) eaten.ChessPiece = "pawn";
    if (!eaten.ChessColor) eaten.ChessColor = "w";
    eaten.Oba = undefined;

    const beforeCount = apples.length;
    const beforeScore = g.Sh;
    const beforeLen = g.oa.Ta;
    const beforeUb = g.ub;
    const beforeLj = g.lj;

    g.tick();

    function shieldCount(a) {
      if (a.nba) {
        if (typeof a.nba.size === "number") return a.nba.size;
        if (Array.isArray(a.nba)) return a.nba.length;
      }
      if (a.Oba) return a.Oba.length;
      return 0;
    }

    const after = g.wa.ka;
    const afterPositions = after.map((a) => ({
      x: a.pos.x,
      y: a.pos.y,
      isPiece: !!a.isPiece,
      ChessColor: a.ChessColor,
      ChessPiece: a.ChessPiece,
      shieldCount: shieldCount(a),
    }));
    const survivorsMatch = afterPositions.every((a) =>
      beforeKeys.has(`${a.x},${a.y}`)
    );
    // Every survivor was in the pre-eat set excluding the eaten one.
    // Also no extras appeared (no spawn on piece eat).
    const afterKeys = new Set(afterPositions.map((a) => `${a.x},${a.y}`));
    let extras = 0;
    for (const k of afterKeys) if (!beforeKeys.has(k)) extras++;

    return {
      ok: true,
      beforeCount,
      afterCount: after.length,
      removed: beforeCount - after.length,
      scoreBefore: beforeScore,
      scoreAfter: g.Sh,
      lenBefore: beforeLen,
      lenAfter: g.oa.Ta,
      head_state: window.head_state,
      head_color: window.head_color,
      just_ate: window.just_ate,
      won: !!(g.ub && g.lj),
      ubBefore: beforeUb,
      ljBefore: beforeLj,
      ubAfter: g.ub,
      ljAfter: g.lj,
      survivorsMatch,
      extras,
      afterPositions,
      remainingShielded: afterPositions.every((a) => a.shieldCount >= 4),
    };
  });
}

describe("chess piece eat (browser)", { skip: !runBrowser }, () => {
  it("1a: eating a piece removes exactly one apple and does not win", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 21, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      await h.page.waitForTimeout(200);
      const r = await eatPieceAtHead(h.page);
      assert.equal(r.ok, true, JSON.stringify(r));
      assert.equal(r.beforeCount, 2, "1a starts with 2 pieces");
      assert.equal(r.removed, 1, "exactly one apple removed");
      assert.equal(r.afterCount, 1, "one piece remains");
      assert.equal(r.scoreAfter, r.scoreBefore, "no score on piece eat");
      assert.equal(r.lenAfter, r.lenBefore, "no growth on piece eat");
      assert.equal(r.extras, 0, "no spawn on piece eat");
      assert.equal(r.survivorsMatch, true, "remaining piece kept its cell");
      assert.equal(r.won, false, "must not win with apples still on board");
      assert.ok(
        ["pawn", "rook", "bishop", "knight", "king", "queen"].includes(
          r.head_state
        ),
        "head_state is a piece: " + r.head_state
      );
      assert.equal(r.just_ate, "piece");
      assert.equal(r.remainingShielded, true, "remaining apples shielded");
    } finally {
      await h.close();
    }
  });

  it("5a: eating a piece removes one and leaves the other nine untouched", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 33, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.FIVE, size: SIZE.NORMAL });
      await h.page.waitForTimeout(200);
      const r = await eatPieceAtHead(h.page);
      assert.equal(r.ok, true, JSON.stringify(r));
      assert.equal(r.beforeCount, 10, "5a starts with 10 pieces");
      assert.equal(r.removed, 1, "exactly one apple removed");
      assert.equal(r.afterCount, 9);
      assert.equal(r.scoreAfter, r.scoreBefore);
      assert.equal(r.lenAfter, r.lenBefore);
      assert.equal(r.extras, 0);
      assert.equal(r.survivorsMatch, true);
      assert.equal(r.won, false);
      assert.equal(r.just_ate, "piece");
    } finally {
      await h.close();
    }
  });
});
