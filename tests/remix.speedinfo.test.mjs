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
        const modes = window.ModeRegistry
          ? window.ModeRegistry.listActiveModes()
          : [];
        return {
          allowed: window.remixSpeedInfoAllowed(),
          modeLabel: label,
          isSwitch: /Switch to PuddingMod/.test(label),
          hasUnknown: /Unknown/.test(label) || /Unknown/.test(formatted),
          formatted,
          modeStr,
          modeKeyIsChess: modeStr === "chess",
          registryHasChess: modes.some((m) => m.id === "chess"),
          blenderNotLast:
            modes.length > 0 && modes[modes.length - 1].id !== "blender",
        };
      });
      assert.equal(chess.allowed, true, JSON.stringify(chess));
      assert.equal(chess.isSwitch, false, JSON.stringify(chess));
      assert.equal(chess.hasUnknown, false, JSON.stringify(chess));
      assert.equal(chess.modeKeyIsChess, true, JSON.stringify(chess));
      assert.equal(chess.registryHasChess, true, JSON.stringify(chess));
      assert.equal(chess.blenderNotLast, true, JSON.stringify(chess));
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

  it("Chess/Burger TimeKeeper only tracks official counts through Tally", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 16, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const official = [];
        for (let count = 0; count <= 6; count++) {
          official.push(
            window.timeKeeper.shouldTrack({
              modeKey: "chess",
              count,
              speed: 0,
              size: 0,
            })
          );
        }
        const beyond = [7, 12, window.BLUE_DICE_COUNT, window.BLACK_DICE_COUNT].map(
          (count) => ({
            count,
            track: window.timeKeeper.shouldTrack({
              modeKey: "chess",
              count,
              speed: 0,
              size: 0,
            }),
          })
        );

        return {
          official,
          beyond,
          patched: !!window.timeKeeper.shouldTrack.__remixOfficial,
          blueOfficial: window.remixTimeKeeperOfficialSettings({
            modeKey: "chess",
            count: window.BLUE_DICE_COUNT,
            speed: 0,
            size: 0,
          }),
        };
      });

      assert.equal(probe.patched, true, JSON.stringify(probe));
      assert.ok(
        probe.official.every(Boolean),
        "0..Tally must track: " + JSON.stringify(probe.official)
      );
      for (const row of probe.beyond) {
        assert.equal(row.track, false, JSON.stringify(row));
      }
      assert.equal(probe.blueOfficial, false, JSON.stringify(probe));

      await h.start({ mode: "burger", count: COUNT.TALLY, size: SIZE.NORMAL });
      const burger = await h.page.evaluate(async () => {
        window.pudding_settings.SpeedInfo = true;
        const tallyTrack = window.timeKeeper.shouldTrack({
          modeKey: "burger",
          count: 6,
          speed: 0,
          size: 0,
        });
        // TimeKeeper reads count from the settings DOM; stub a MoreMenu index.
        const origGet = window.timeKeeper.getCurrentSetting.bind(window.timeKeeper);
        window.timeKeeper.getCurrentSetting = function (name) {
          if (name === "count") return 7;
          return origGet(name);
        };
        const allowed = window.remixSpeedInfoAllowed();
        await window.SpeedInfoUpdate();
        const out = {
          tallyTrack,
          allowed,
          label: (document.getElementById("mode-selected") || {}).innerHTML || "",
          att: (document.getElementById("att") || {}).innerHTML || "",
        };
        window.timeKeeper.getCurrentSetting = origGet;
        return out;
      });
      assert.equal(burger.tallyTrack, true, JSON.stringify(burger));
      assert.equal(burger.allowed, false, JSON.stringify(burger));
      assert.match(burger.label, /Official counts only/i);
      assert.equal(burger.att, "", JSON.stringify(burger));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("Chess/Burger SRC Highscore rows use CE level boards (not blank)", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 15, headless: true });
    try {
      for (const mode of ["chess", "burger"]) {
        await h.start({ mode, count: COUNT.ONE, size: SIZE.NORMAL });
        const probe = await h.page.evaluate(async () => {
          if (window.pudding_settings) window.pudding_settings.SpeedInfo = true;
          window.remixSpeedInfoEnsureModeLabels();
          const modeId = window.CurrentModeNum;
          const modeName = window.modeToTxt[modeId]?.name;
          const modeKey = window.timeKeeper.getCurrentMode();
          const count = window.timeKeeper.getCurrentSetting("count");
          const speed = window.timeKeeper.getCurrentSetting("speed");
          const size = window.timeKeeper.getCurrentSetting("size");
          // Seed a personal HS so SpeedInfoUpdate can attach a submit link.
          const key = "H-" + modeKey + "-" + count + "-" + speed + "-" + size;
          const storage = JSON.parse(localStorage.getItem("snake_timeKeeper") || "{}");
          storage[key] = { high: 12, attempts: 1, average: 12 };
          localStorage.setItem("snake_timeKeeper", JSON.stringify(storage));

          await window.getRecordSRC("H");
          const hsrc = (document.getElementById("Hsrc") || {}).innerHTML || "";
          await window.SpeedInfoUpdate();
          const personal = (document.getElementById("H") || {}).innerHTML || "";
          return {
            modeId,
            modeName,
            modeKey,
            key,
            hsrc,
            personal,
            hsrcBlank: !hsrc.trim(),
            hsrcShows:
              /Highscore:\s*None/i.test(hsrc) || /Highscore:.*Apple/i.test(hsrc),
            personalHasCeLink: /speedrun\.com\/snake_game_ce/.test(personal),
          };
        });
        assert.ok(
          probe.modeName === "Chess" || probe.modeName === "Burger",
          JSON.stringify(probe)
        );
        assert.equal(
          probe.hsrcBlank,
          false,
          mode + " Hsrc must not be emptied: " + JSON.stringify(probe)
        );
        assert.equal(
          probe.hsrcShows,
          true,
          mode + " Hsrc should show WR or None: " + JSON.stringify(probe)
        );
        assert.equal(
          probe.personalHasCeLink,
          true,
          mode + " personal HS must link to CE: " + JSON.stringify(probe)
        );
      }
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("Timer settings lists Candy, Chess and Burger modes", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 14, headless: true });
    try {
      await h.start({ mode: "candy", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const btn = document.getElementById("TimerSettings");
        if (!btn) return { ok: false, reason: "no TimerSettings button" };
        // Close if already open via window API, then open via the real button
        // (BootstrapMenu originally captured a stale editTimer reference).
        if (document.getElementById("edit-box") && window.editTimer) {
          window.editTimer();
        }
        btn.click();
        const editMode = document.getElementById("edit-mode");
        if (!editMode) {
          return { ok: false, reason: "missing edit-mode after button click" };
        }
        const candyIdx = window.CANDY_MODE;
        const chessIdx = window.CHESS_MODE;
        const burgerIdx = window.BURGER_MODE;
        const blenderIdx = window.remixNativeBlenderMode;
        const blenderEl = editMode.children[blenderIdx];
        return {
          ok: true,
          candyIdx,
          chessIdx,
          burgerIdx,
          blenderIdx,
          hasCandy: !!editMode.children[candyIdx],
          hasChess: !!editMode.children[chessIdx],
          hasBurger: !!editMode.children[burgerIdx],
          candySrc: editMode.children[candyIdx]?.src || "",
          chessSrc: editMode.children[chessIdx]?.src || "",
          burgerSrc: editMode.children[burgerIdx]?.src || "",
          candySel: editMode.children[candyIdx]?.className === "sel",
          candyAlt: editMode.children[candyIdx]?.alt,
          chessAlt: editMode.children[chessIdx]?.alt,
          burgerAlt: editMode.children[burgerIdx]?.alt,
          blenderHidden:
            !blenderEl ||
            blenderEl.style.display === "none" ||
            blenderEl.getAttribute("data-remix-placeholder") === "1",
          blenderVisibleSrc:
            blenderEl && blenderEl.style.display !== "none" ? blenderEl.src : "",
          patched: !!window.editTimer.__remixModes,
          btnBound: !!btn.__remixEditBound,
        };
      });
      assert.equal(probe.ok, true, JSON.stringify(probe));
      assert.equal(probe.patched, true, JSON.stringify(probe));
      assert.equal(probe.hasCandy, true, JSON.stringify(probe));
      assert.equal(probe.hasChess, true, JSON.stringify(probe));
      assert.equal(probe.hasBurger, true, JSON.stringify(probe));
      assert.equal(probe.candyAlt, "Candy", JSON.stringify(probe));
      assert.equal(probe.chessAlt, "Chess", JSON.stringify(probe));
      assert.equal(probe.burgerAlt, "Burger", JSON.stringify(probe));
      assert.equal(probe.candySel, true, "candy selected when live mode is candy");
      assert.equal(probe.blenderHidden, true, "Blender must not appear: " + JSON.stringify(probe));
      assert.equal(probe.blenderVisibleSrc, "", JSON.stringify(probe));
      assert.ok(probe.chessSrc.includes("bn.png") || probe.chessSrc.length > 0, JSON.stringify(probe));
      assert.ok(probe.burgerSrc.includes("burger") || probe.burgerSrc.length > 0, JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });
});
