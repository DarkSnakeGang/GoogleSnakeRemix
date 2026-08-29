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

  it("saves Remix settings/TimeKeeper without touching PuddingMod keys", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 8, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const pudKey = "PuddingSettings";
        const remixKey = window.REMIX_SETTINGS_KEY || "RemixSettings";
        const pudTk = "snake_timeKeeper";
        const remixTk = window.REMIX_TIMEKEEPER_KEY || "snake_timeKeeper_remix";

        // Plant distinct pudding-only payloads that Remix must leave alone.
        const pudSnap = {
          Skull: true,
          SokoGoals: true,
          InputDisplay: false,
          TopBar: true,
          SpeedInfo: false,
          PortalPairs: false,
          DisableRandom: false,
          randomizeThemeApple: false,
          marker: "pudding-only",
        };
        const pudTkSnap = { version: 4, marker: "pudding-tk-only" };
        localStorage.setItem(pudKey, JSON.stringify(pudSnap));
        localStorage.setItem(pudTk, JSON.stringify(pudTkSnap));

        window.pudding_settings.BlackDiceMin = 9;
        window.pudding_settings.BlackDiceMax = 11;
        window.pudding_settings.SpeedInfo = true;
        window.pudding_settings.marker = "remix-write";
        if (typeof window.saveSettings === "function") window.saveSettings();

        const tkStorage = window.timeKeeper.getStorage();
        tkStorage.marker = "remix-tk-write";
        window.timeKeeper.setStorage(tkStorage);

        return {
          remixKey,
          remixTk,
          pudAfter: JSON.parse(localStorage.getItem(pudKey) || "null"),
          remixAfter: JSON.parse(localStorage.getItem(remixKey) || "null"),
          pudTkAfter: JSON.parse(localStorage.getItem(pudTk) || "null"),
          remixTkAfter: JSON.parse(localStorage.getItem(remixTk) || "null"),
          saveSrc: String(window.saveSettings || ""),
          loadUsesRemix: String(window.loadSettings || "").includes(remixKey),
        };
      });

      assert.equal(probe.pudAfter.marker, "pudding-only", JSON.stringify(probe));
      assert.equal(probe.pudTkAfter.marker, "pudding-tk-only", JSON.stringify(probe));
      assert.equal(probe.remixAfter.marker, "remix-write", JSON.stringify(probe));
      assert.equal(probe.remixAfter.BlackDiceMin, 9, JSON.stringify(probe));
      assert.equal(probe.remixTkAfter.marker, "remix-tk-write", JSON.stringify(probe));
      assert.match(probe.saveSrc, /RemixSettings/);
      assert.equal(probe.loadUsesRemix, true, JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
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

  it("gives Candy, Chess, Burger, Cat and Mexico consecutive blender slots", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 7, headless: true });
    try {
      await h.start({ mode: "burger", count: COUNT.ONE, size: SIZE.NORMAL });
      const slots = await h.page.evaluate(() => {
        if (typeof window.remixCompactBlenderEmpties === "function") {
          window.remixCompactBlenderEmpties(0);
        }
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
          cat: idOf("remix-cat-blend"),
          mexico: idOf("remix-mexico-blend"),
          empties: panel.querySelectorAll(".vuOknd.oBBKec").length,
          forcedGrid: panel.style.gridTemplateColumns || "",
        };
      });
      assert.ok(slots.candy > 0, "candy slot claimed: " + JSON.stringify(slots));
      assert.equal(slots.chess, slots.candy + 1, JSON.stringify(slots));
      assert.equal(slots.burger, slots.chess + 1, JSON.stringify(slots));
      assert.equal(slots.cat, slots.burger + 1, JSON.stringify(slots));
      assert.equal(slots.mexico, slots.cat + 1, JSON.stringify(slots));
      assert.equal(slots.empties, 0, JSON.stringify(slots));
      assert.equal(slots.forcedGrid, "", JSON.stringify(slots));
    } finally {
      await h.close();
    }
  });

  it("loads Custom Bowl API, settings UI, and portal type picking with Remix modes", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 11, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.FIVE, size: SIZE.NORMAL });

      const api = await h.page.evaluate(() => {
        const btn = document.getElementById("CustomBowlFruits");
        if (typeof window.TogglePortalPairsPanel === "function") {
          window.TogglePortalPairsPanel();
        }
        const panel = document.getElementById("fruit-bowl-popup-pudding");
        const enable = document.getElementById("fruit-bowl-enable");
        const grid = document.getElementById("fruit-bowl-grid");
        const aaSrc =
          typeof window.__aaF === "function" ? String(window.__aaF) : "";
        return {
          hasCustomBowl: !!window.CustomBowl,
          hasPick: typeof window.pickCustomPortalType === "function",
          hasGive: typeof window.give_custom_pair === "function",
          hasToggle: typeof window.TogglePortalPairsPanel === "function",
          hasButton: !!btn,
          panelOpen:
            !!panel &&
            panel.style.display === "block" &&
            panel.style.visibility === "visible",
          hasEnable: !!enable,
          gridCells: grid ? grid.querySelectorAll("[data-fruit]").length : 0,
          aaFHooked: /pickCustomPortalType|PortalPairs/.test(aaSrc),
          settings: !!(
            window.pudding_settings &&
            typeof window.pudding_settings.PortalPairs === "boolean" &&
            window.pudding_settings.SelectedPairsByCount
          ),
          alwaysUniqueToggle: !!document.getElementById(
            "fruit-bowl-always-unique"
          ),
          alwaysUniqueSetting:
            window.pudding_settings &&
            typeof window.pudding_settings.AlwaysUniqueFruit === "boolean",
          modeRegistry: !!(
            window.ModeRegistry &&
            typeof window.ModeRegistry.getCurrentModeKey === "function"
          ),
          remixModeRegistry: !!(
            window.ModeRegistry &&
            window.ModeRegistry.listActiveModes &&
            window.ModeRegistry.listActiveModes.__remix
          ),
        };
      });
      assert.equal(api.hasCustomBowl, true, JSON.stringify(api));
      assert.equal(api.hasPick, true, JSON.stringify(api));
      assert.equal(api.hasGive, true, JSON.stringify(api));
      assert.equal(api.hasToggle, true, JSON.stringify(api));
      assert.equal(api.hasButton, true, JSON.stringify(api));
      assert.equal(api.panelOpen, true, JSON.stringify(api));
      assert.equal(api.hasEnable, true, JSON.stringify(api));
      assert.ok(api.gridCells >= 10, "fruit grid populated: " + JSON.stringify(api));
      assert.equal(api.settings, true, JSON.stringify(api));
      assert.equal(api.alwaysUniqueToggle, true, JSON.stringify(api));
      assert.equal(api.alwaysUniqueSetting, true, JSON.stringify(api));
      assert.equal(api.modeRegistry, true, JSON.stringify(api));
      assert.equal(api.remixModeRegistry, true, JSON.stringify(api));
      // __aaF is exposed after Burger's h7 patch once a game has booted.
      assert.equal(api.aaFHooked, true, "aaF carries Custom Bowl hook: " + JSON.stringify(api));

      // Enable custom bowl + fruit bowl on portal; types must stay in the pool.
      const portalRun = await h.page.evaluate(() => {
        const pool = [0, 1, 2, 3, 5];
        window.pudding_settings.PortalPairs = true;
        window.pudding_settings.SelectedPairs = pool.slice();
        window.pudding_settings.SelectedPairsByCount["2"] = pool.slice();
        window.fruit_selected = 24;
        if (typeof window.saveSettings === "function") window.saveSettings();

        const g = window.__remixGame;
        g.settings.ob = 2;
        g.settings.ub = 2;
        g.settings.Ca = 2;
        g.settings.ka = 2;
        // Fruit setting index used by aaF (bowl = 24).
        for (const key of Object.keys(g.settings)) {
          if (g.settings[key] === window.fruit_selected || key === "oa") {
            /* keep */
          }
        }
        // Match Fruit library's fruit_selected mirror onto the settings field aaF reads.
        const aaSrc = String(window.__aaF);
        const m = aaSrc.match(/a\.settings\.([A-Za-z0-9_$]+)===\s*24/);
        const fruitKey = m && m[1];
        if (fruitKey) g.settings[fruitKey] = 24;

        g.wa.reset();
        const types = g.wa.ka.map((a) => a.type);
        const inPool = types.every((t) => pool.includes(t));
        const paired =
          types.length >= 2 &&
          types.every((t, i) => i % 2 === 1 || types[i + 1] === t);

        // Remix modes still start cleanly with Custom Bowl enabled.
        const modes = {};
        for (const [name, id] of [
          ["candy", window.CANDY_MODE],
          ["chess", window.CHESS_MODE],
          ["burger", window.BURGER_MODE],
        ]) {
          window.CurrentModeNum = id;
          g.settings.ob = id;
          g.settings.ub = id;
          g.wa.reset();
          if (
            name === "burger" &&
            typeof window.__uaF === "function" &&
            window.isBurgerActive &&
            window.isBurgerActive()
          ) {
            window.__uaF(g.wa);
          }
          modes[name] = {
            apples: g.wa.ka.length,
            pieces: g.wa.ka.filter((a) => a.isPiece).length,
            poisons: g.wa.ka.filter((a) => a.nla).length,
          };
        }

        if (typeof window.PortalPairsPanelHide === "function") {
          window.PortalPairsPanelHide();
        }

        return {
          fruitKey,
          types,
          inPool,
          paired,
          modes,
          pick: window.pickCustomPortalType(g.wa),
        };
      });

      assert.ok(portalRun.fruitKey, "found aaF fruit settings key");
      assert.equal(portalRun.inPool, true, JSON.stringify(portalRun));
      assert.equal(portalRun.paired, true, JSON.stringify(portalRun));
      assert.ok(
        [0, 1, 2, 3, 5].includes(portalRun.pick),
        "pickCustomPortalType stays in pool: " + JSON.stringify(portalRun)
      );
      assert.ok(portalRun.modes.candy.apples > 0, JSON.stringify(portalRun.modes));
      assert.ok(portalRun.modes.chess.pieces > 0, JSON.stringify(portalRun.modes));
      assert.equal(portalRun.modes.burger.poisons, 0, JSON.stringify(portalRun.modes));
      assert.deepEqual(h.modErrors(), [], "no mod errors with Custom Bowl active");
    } finally {
      await h.close();
    }
  });
});
