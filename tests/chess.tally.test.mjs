import { describe, it } from "node:test";
import assert from "node:assert/strict";

const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("chess tally waves (browser)", { skip: !runBrowser }, () => {
  it("emptying the board refills 10 pieces, each with its own tally index", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 13, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.TALLY, size: SIZE.NORMAL });
      await h.page.waitForTimeout(250);

      const start = await h.state();
      assert.equal(start.apples.length, 10, "tally starts with 10 pieces");

      // Leave a single edible piece in front of the head; eating it empties the
      // board, which is what makes the game run its tally wave refill (sdF).
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const keep = g.wa.ka[0];
        g.wa.ka.length = 0;
        g.wa.ka.push(keep);
        window.appleArray = g.wa.ka;

        const head = g.oa.ka[0];
        const dir = g.oa.direction || "RIGHT";
        const next = { x: head.x, y: head.y };
        if (dir === "RIGHT") next.x += 1;
        else if (dir === "LEFT") next.x -= 1;
        else if (dir === "UP") next.y -= 1;
        else if (dir === "DOWN") next.y += 1;
        keep.pos.x = next.x;
        keep.pos.y = next.y;
        keep.isPiece = true;
        if (!keep.ChessPiece) keep.ChessPiece = "pawn";
        if (!keep.ChessColor) keep.ChessColor = "w";
        keep.Oba = undefined;

        // Tally only allows eating the apple whose sequenceNumber is current.
        if (keep.sequenceNumber !== undefined) g.wa.wa = keep.sequenceNumber;
        window.head_state = "OPEN";

        g.tick();

        const apples = g.wa.ka;
        const seqs = apples.map((a) => a.sequenceNumber);
        const keys = apples.map((a) => `${a.pos.x},${a.pos.y}`);
        return {
          count: apples.length,
          allPieces: apples.every((a) => !!a.isPiece),
          seqs,
          uniqueSeqs: new Set(seqs).size,
          duplicates: keys.length - new Set(keys).size,
          counter: g.wa.wa,
          won: !!(g.ub && g.lj),
        };
      });

      assert.equal(result.count, 10, "wave refills 10 pieces: " + JSON.stringify(result));
      assert.equal(result.allPieces, true, "refilled apples are chess pieces");
      assert.equal(result.uniqueSeqs, 10, "each piece gets its own tally index");
      assert.equal(result.duplicates, 0, "no overlapping cells");
      assert.ok(
        result.seqs.includes(result.counter),
        "one piece matches the current tally counter so play can continue"
      );
      assert.equal(result.won, false);

      const after = await h.state();
      const board = after.board;
      for (const a of after.apples) {
        assert.ok(
          a.x >= 0 && a.y >= 0 && a.x < board.width && a.y < board.height,
          `refilled piece off board at ${a.x},${a.y}`
        );
      }
    } finally {
      await h.close();
    }
  });
});
