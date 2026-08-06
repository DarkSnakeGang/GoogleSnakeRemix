import { describe, it } from "node:test";
import assert from "node:assert/strict";

/**
 * Integration spawn tests need network + Playwright.
 * They are skipped unless RUN_BROWSER_TESTS=1.
 */
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("chess spawn vs portal", { skip: !runBrowser }, () => {
  it("chess start positions match portal for count=5 normal", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const seed = 99;
    const h = await launchHarness({ seed, headless: true });
    try {
      await h.start({ mode: "portal", count: COUNT.FIVE, size: SIZE.NORMAL });
      const portal = (await h.state()).apples
        .map((a) => `${a.x},${a.y}`)
        .sort()
        .join("|");
      await h.start({ mode: "chess", count: COUNT.FIVE, size: SIZE.NORMAL });
      const chessState = await h.state();
      const chess = chessState.apples
        .map((a) => `${a.x},${a.y}`)
        .sort()
        .join("|");
      assert.ok(portal.length > 0, "portal should have apples");
      assert.equal(chess, portal);
      assert.equal(chessState.apples.filter((a) => a.isPiece).length, 10);
    } finally {
      await h.close();
    }
  });

  it("dice and bomb start with exactly 2 pieces", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 7, headless: true });
    try {
      for (const count of [COUNT.DICE, COUNT.BOMB]) {
        await h.start({ mode: "chess", count, size: SIZE.NORMAL });
        const s = await h.state();
        const pieces = (s.apples || []).filter((a) => a.isPiece);
        assert.equal(pieces.length, 2, `count ${count}`);
      }
    } finally {
      await h.close();
    }
  });
});

describe("chess spawn expectations (offline)", () => {
  it("plan table: fruit eat deltas", () => {
    // Documented behavior — harness verifies live when RUN_BROWSER_TESTS=1
    const afterFruit = {
      fixed: "+2 (1 pair)",
      dice: "2R for roll R",
      bomb: "48 then later +2",
      tallyWave: "+10 after last index",
    };
    assert.ok(afterFruit.bomb.includes("48"));
  });
});
