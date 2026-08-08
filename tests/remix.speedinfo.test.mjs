import { describe, it } from "node:test";
import assert from "node:assert/strict";

const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("Remix SpeedInfo gate (browser)", { skip: !runBrowser }, () => {
  it("keeps SpeedInfo toggle enabled and gates data to Chess/Burger", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 13, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });

      const classic = await h.page.evaluate(async () => {
        const cb = document.getElementById("AlwaysOnTimeKeeper");
        if (!cb || cb.disabled) {
          return { ok: false, reason: "checkbox missing or disabled" };
        }
        if (!window.pudding_settings) {
          return { ok: false, reason: "no pudding_settings" };
        }
        window.pudding_settings.SpeedInfo = true;
        cb.checked = true;
        if (typeof window.SpeedInfoShow === "function") window.SpeedInfoShow();
        await window.SpeedInfoUpdate();
        return {
          ok: true,
          gated: !!window.SpeedInfoUpdate.__remixGated,
          allowed: window.remixSpeedInfoAllowed(),
          modeLabel: (document.getElementById("mode-selected") || {}).innerHTML,
        };
      });
      assert.equal(classic.ok, true, JSON.stringify(classic));
      assert.equal(classic.gated, true);
      assert.equal(classic.allowed, false);
      assert.match(classic.modeLabel, /Switch to PuddingMod/);

      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      const chess = await h.page.evaluate(async () => {
        if (window.pudding_settings) window.pudding_settings.SpeedInfo = true;
        await window.SpeedInfoUpdate();
        const label = (document.getElementById("mode-selected") || {}).innerHTML || "";
        const modeStr = window.timeKeeper.getCurrentMode();
        const formatted = window.remixTimeKeeperFormatGamemode(modeStr);
        return {
          allowed: window.remixSpeedInfoAllowed(),
          modeLabel: label,
          isSwitch: /Switch to PuddingMod/.test(label),
          hasUnknown: /Unknown/.test(label) || /Unknown/.test(formatted),
          formatted,
          modeStr,
        };
      });
      assert.equal(chess.allowed, true, JSON.stringify(chess));
      assert.equal(chess.isSwitch, false, JSON.stringify(chess));
      assert.equal(chess.hasUnknown, false, JSON.stringify(chess));
      assert.match(chess.modeLabel, /Chess/);

      await h.start({ mode: "burger", count: COUNT.ONE, size: SIZE.NORMAL });
      const burger = await h.page.evaluate(async () => {
        if (window.pudding_settings) window.pudding_settings.SpeedInfo = true;
        await window.SpeedInfoUpdate();
        const label = (document.getElementById("mode-selected") || {}).innerHTML || "";
        const formatted = window.remixTimeKeeperFormatGamemode(
          window.timeKeeper.getCurrentMode()
        );
        return {
          allowed: window.remixSpeedInfoAllowed(),
          isSwitch: /Switch to PuddingMod/.test(label),
          hasUnknown: /Unknown/.test(label) || /Unknown/.test(formatted),
          modeLabel: label,
          formatted,
        };
      });
      assert.equal(burger.allowed, true, JSON.stringify(burger));
      assert.equal(burger.isSwitch, false, JSON.stringify(burger));
      assert.equal(burger.hasUnknown, false, JSON.stringify(burger));
      assert.match(burger.modeLabel, /Burger/);

      await h.start({ mode: "candy", count: COUNT.ONE, size: SIZE.NORMAL });
      const candy = await h.page.evaluate(async () => {
        if (window.pudding_settings) window.pudding_settings.SpeedInfo = true;
        await window.SpeedInfoUpdate();
        const label = (document.getElementById("mode-selected") || {}).innerHTML || "";
        // SpeedInfo panel is gated, but TimeKeeper naming must still resolve.
        const formatted = window.remixTimeKeeperFormatGamemode(
          window.timeKeeper.getCurrentMode()
        );
        return {
          allowed: window.remixSpeedInfoAllowed(),
          modeLabel: label,
          formatted,
          hasUnknown: /Unknown/.test(formatted),
        };
      });
      assert.equal(candy.allowed, false, JSON.stringify(candy));
      assert.match(candy.modeLabel, /Switch to PuddingMod/);
      assert.equal(candy.hasUnknown, false, JSON.stringify(candy));
      assert.match(candy.formatted, /Candy/);

      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });
});
