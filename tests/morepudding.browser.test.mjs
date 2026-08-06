import { describe, it } from "node:test";
import assert from "node:assert/strict";

const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("MorePudding base (browser)", { skip: !runBrowser }, () => {
  it("loads Pudding, Visibility and MoreMenu with no patch failures", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 7, headless: true });
    try {
      await h.start({ mode: "burger", count: COUNT.ONE, size: SIZE.NORMAL });
      const mods = await h.page.evaluate(() => ({
        morePudding: !!window.MorePudding,
        pudding: !!window.PuddingMod,
        visibility: !!window.VisibilityModCode,
        moreMenu: !!window.moreMenu,
      }));
      assert.deepEqual(mods, {
        morePudding: true,
        pudding: true,
        visibility: true,
        moreMenu: true,
      });
      assert.deepEqual(h.modErrors(), [], "no mod reported a failed patch");
    } finally {
      await h.close();
    }
  });

  it("keeps Pudding's secret fruit tail addressable after chess pieces are added", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 7, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      const info = await h.page.evaluate(() => {
        const fruits = window.new_fruit;
        const base = window.last_fruit_num;
        return {
          skullIsLast: /poison-skull/.test(fruits[fruits.length - 1].Real || ""),
          // Pudding derives goldenIndex as (fruit array length - 6), so it must
          // still land on the Golden Apple rather than on a chess piece.
          goldenIsGoldApple: /gold-apple/.test(
            (fruits[window.goldenIndex - base - 1] || {}).Normal || ""
          ),
          highestChessType: window.wrook,
          goldenIndex: window.goldenIndex,
        };
      });
      assert.equal(info.skullIsLast, true);
      assert.equal(info.goldenIsGoldApple, true);
      assert.ok(
        info.highestChessType < info.goldenIndex,
        "chess pieces sit below the secret fruits: " + JSON.stringify(info)
      );
    } finally {
      await h.close();
    }
  });

  it("adds a working Chess Pieces row to the Visibility panel", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 7, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      const before = await h.page.evaluate(() => {
        const box = document.getElementById("chess-pieces");
        return {
          exists: !!box,
          checked: box && box.checked,
          status: window.checkboxes.checkboxStatuses.chessPieces,
          inShadowPass: window.visiShadowPassKeys.includes("chessPieces"),
          hasTooltip:
            !!box &&
            !!box.parentElement.parentElement.querySelector(".tooltiptext"),
        };
      });
      assert.deepEqual(before, {
        exists: true,
        checked: true,
        status: true,
        inShadowPass: true,
        hasTooltip: true,
      });

      const after = await h.page.evaluate(() => {
        const box = document.getElementById("chess-pieces");
        box.checked = false;
        box.dispatchEvent(new Event("change"));
        return window.checkboxes.checkboxStatuses.chessPieces;
      });
      assert.equal(after, false, "unchecking updates the render gate");
    } finally {
      await h.close();
    }
  });

  it("gives Candy, Chess and Burger consecutive blender slots", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 7, headless: true });
    try {
      await h.start({ mode: "burger", count: COUNT.ONE, size: SIZE.NORMAL });
      const slots = await h.page.evaluate(() => {
        const panel = document.querySelector(".PWIidc");
        const cells = [...panel.children];
        const idOf = (id) =>
          cells.findIndex((c) => {
            const inner = c.querySelector(":scope > .vuOknd");
            return inner && inner.id === id;
          });
        return {
          candy: idOf("remix-candy-blend"),
          chess: idOf("remix-chess-blend"),
          burger: idOf("remix-burger-blend"),
        };
      });
      assert.ok(slots.candy > 0, "candy slot claimed: " + JSON.stringify(slots));
      assert.equal(slots.chess, slots.candy + 1, JSON.stringify(slots));
      assert.equal(slots.burger, slots.chess + 1, JSON.stringify(slots));
    } finally {
      await h.close();
    }
  });
});
