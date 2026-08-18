import { describe, it } from "node:test";
import assert from "node:assert/strict";

const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("Cat Speed + Dice counts (browser)", { skip: !runBrowser }, () => {
  it("places Cat after MoreMenu speeds and Blue/Green/Black dice after Nuke", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 21, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const menu = await h.page.evaluate(() => {
        const speed = [...document.querySelector("#speed").children].map(
          (c, i) => ({ i, alt: c.alt || "", src: (c.src || "").slice(-40) })
        );
        const count = [...document.querySelector("#count").children].map(
          (c, i) => ({ i, alt: c.alt || "", src: (c.src || "").slice(0, 30) })
        );
        return {
          catIndex: window.CAT_SPEED_INDEX,
          speedLen: speed.length,
          catChild: speed[window.CAT_SPEED_INDEX],
          catIsLast: window.CAT_SPEED_INDEX === speed.length - 1,
          turtleStill3: speed[3]?.src?.includes("Turtle-Bunny"),
          blue: window.BLUE_DICE_COUNT,
          green: window.GREEN_DICE_COUNT,
          black: window.BLACK_DICE_COUNT,
          blueAlt: count[window.BLUE_DICE_COUNT]?.alt,
          greenAlt: count[window.GREEN_DICE_COUNT]?.alt,
          blackAlt: count[window.BLACK_DICE_COUNT]?.alt,
          defaults: window.remixEnsureBlackDiceSettings(),
        };
      });
      assert.ok(menu.catIndex >= 14, "cat after MoreMenu: " + JSON.stringify(menu));
      assert.equal(menu.catIsLast, true, JSON.stringify(menu));
      assert.equal(menu.catChild?.alt, "Cat Speed", JSON.stringify(menu));
      assert.equal(menu.turtleStill3, true, JSON.stringify(menu));
      assert.ok(menu.blue > 12, "blue after MoreMenu: " + JSON.stringify(menu));
      assert.equal(menu.green, menu.blue + 1, JSON.stringify(menu));
      assert.equal(menu.black, menu.green + 1, JSON.stringify(menu));
      assert.equal(menu.blueAlt, "Blue Dice");
      assert.equal(menu.greenAlt, "Green Dice");
      assert.equal(menu.blackAlt, "Black Dice");
      assert.equal(menu.defaults.min, 6, JSON.stringify(menu));
      assert.equal(menu.defaults.max, 24, JSON.stringify(menu));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("Cat speed uses 0.85 multiplier (not turtle)", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 23, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => ({
        idx: window.CAT_SPEED_INDEX,
        mult: window.CAT_SPEED_MULT,
        label: window.speedToTxt?.[window.CAT_SPEED_INDEX]?.name,
        handle: typeof window.HandleSpeed === "function"
          ? window.HandleSpeed(window.CAT_SPEED_INDEX)
          : null,
      }));
      assert.equal(probe.mult, 0.85, JSON.stringify(probe));
      assert.ok(probe.idx >= 14, JSON.stringify(probe));
      assert.equal(probe.label, "Cat", JSON.stringify(probe));
      assert.match(String(probe.handle), /Cat/i, JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("blue/green dice roll in range when the last apple is eaten", async () => {
    const { launchHarness, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 22, headless: true });
    try {
      await h.start({ mode: "classic", count: 0, size: SIZE.NORMAL });

      const probe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const tickSrc = Function.prototype.toString.call(g.tick);
        const hasTdfPatch =
          tickSrc.includes("remixIsColoredDice") &&
          tickSrc.includes("remixColoredDiceRoll");

        function eatLast(ka) {
          g.settings.ka = ka;
          g.settings.Ca = ka;
          g.wa.reset();
          const snake = g.oa.ka;
          for (let i = 0; i < snake.length; i++) {
            snake[i].x = 3;
            snake[i].y = 3;
          }
          g.oa.direction = "RIGHT";
          const apples = g.wa.ka;
          while (apples.length > 1) apples.pop();
          if (!apples.length) return { after: 0, scored: false };
          apples[0].pos.x = 4;
          apples[0].pos.y = 3;
          const scoreBefore = g.Oh;
          g.tick();
          return {
            after: g.wa.ka.length,
            scored: g.Oh > scoreBefore,
            ka: g.settings.ka,
          };
        }

        const liveBlue = [];
        const liveGreen = [];
        for (let i = 0; i < 20; i++) {
          liveBlue.push(eatLast(window.BLUE_DICE_COUNT));
          liveGreen.push(eatLast(window.GREEN_DICE_COUNT));
        }

        return {
          hasTdfPatch,
          liveBlue: liveBlue.map((r) => r.after),
          liveGreen: liveGreen.map((r) => r.after),
          blueScored: liveBlue.every((r) => r.scored),
          greenScored: liveGreen.every((r) => r.scored),
        };
      });

      assert.equal(probe.hasTdfPatch, true, JSON.stringify(probe));
      assert.equal(probe.blueScored, true, JSON.stringify(probe));
      assert.equal(probe.greenScored, true, JSON.stringify(probe));
      for (const n of probe.liveBlue) {
        assert.ok(n >= 1 && n <= 12, "blue " + n + " " + JSON.stringify(probe.liveBlue));
      }
      for (const n of probe.liveGreen) {
        assert.ok(n >= 4 && n <= 9, "green " + n + " " + JSON.stringify(probe.liveGreen));
      }
      assert.ok(new Set(probe.liveBlue).size >= 3, JSON.stringify(probe.liveBlue));
      assert.ok(new Set(probe.liveGreen).size >= 2, JSON.stringify(probe.liveGreen));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("top bar count icon uses tinted blue/green dice", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 24, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(async () => {
        await new Promise((r) => {
          const t0 = Date.now();
          const tick = () => {
            const b = document.querySelector("#count").children[window.BLUE_DICE_COUNT];
            if (b && b.src.startsWith("data:")) return r(true);
            if (Date.now() - t0 > 5000) return r(false);
            setTimeout(tick, 40);
          };
          tick();
        });
        const root = document.querySelector("#count");
        const blue = root.children[window.BLUE_DICE_COUNT];
        const g = window.__remixGame;
        g.settings.ka = window.BLUE_DICE_COUNT;
        g.settings.Ca = window.BLUE_DICE_COUNT;
        for (const c of root.children) c.classList.remove("tuJOWd");
        blue.classList.add("tuJOWd");
        g.wa.reset();
        window.remixRefreshHudCountIcon(window.BLUE_DICE_COUNT, blue.src);
        const disp = document.body.getElementsByClassName("UJhXPd wSwbef EWyEF")[0];
        const visible = disp
          ? [...disp.querySelectorAll("img")].filter((img) => {
              if (img.style.display === "none") return false;
              const s = img.src || "";
              return /count_|data:image/.test(s) || /WwRsj/.test(img.className || "");
            })
          : [];
        return {
          blueData: blue.src.startsWith("data:"),
          visibleKinds: visible.map((img) =>
            img.src.startsWith("data:")
              ? "data"
              : /count_04/.test(img.src)
                ? "red"
                : "other"
          ),
          arrData: !!(
            window.count_img_arr &&
            window.count_img_arr[window.BLUE_DICE_COUNT] &&
            window.count_img_arr[window.BLUE_DICE_COUNT].startsWith("data:")
          ),
        };
      });
      assert.equal(probe.blueData, true, JSON.stringify(probe));
      assert.equal(probe.arrData, true, JSON.stringify(probe));
      assert.ok(probe.visibleKinds.includes("data"), JSON.stringify(probe));
      assert.ok(!probe.visibleKinds.includes("red"), JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("Black Dice rolls use Pudding Settings spawn range (default 6–24)", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 25, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const defaults = window.remixEnsureBlackDiceSettings();
        const rollsDefault = [];
        for (let i = 0; i < 40; i++) {
          rollsDefault.push(window.remixColoredDiceRoll(window.BLACK_DICE_COUNT));
        }

        window.pudding_settings.BlackDiceMin = 10;
        window.pudding_settings.BlackDiceMax = 12;
        window.remixEnsureBlackDiceSettings();
        const rollsCustom = [];
        for (let i = 0; i < 30; i++) {
          rollsCustom.push(window.remixBlackDiceRoll());
        }

        window.pudding_settings.BlackDiceMin = 50;
        window.pudding_settings.BlackDiceMax = 5;
        const swapped = window.remixEnsureBlackDiceSettings();

        window.pudding_settings.BlackDiceMin = 0;
        window.pudding_settings.BlackDiceMax = 99999;
        const clamped = window.remixEnsureBlackDiceSettings();

        // Settings UI in main Pudding Settings (not Custom Bowl)
        window.remixInjectBlackDiceSettingsUi();
        const inFruitBowl = !!document.querySelector(
          "#fruit-bowl-popup-pudding #black-dice-settings"
        );
        const minEl = document.getElementById("black-dice-min");
        const maxEl = document.getElementById("black-dice-max");
        if (minEl && maxEl) {
          minEl.value = "7";
          maxEl.value = "9";
          minEl.dispatchEvent(new Event("change"));
        }
        const afterUi = window.remixEnsureBlackDiceSettings();

        window.pudding_settings.BlackDiceMin = 6;
        window.pudding_settings.BlackDiceMax = 24;
        window.remixEnsureBlackDiceSettings();
        function eatLast(ka) {
          g.settings.ka = ka;
          g.settings.Ca = ka;
          g.wa.reset();
          const snake = g.oa.ka;
          for (let i = 0; i < snake.length; i++) {
            snake[i].x = 3;
            snake[i].y = 3;
          }
          g.oa.direction = "RIGHT";
          const apples = g.wa.ka;
          while (apples.length > 1) apples.pop();
          if (!apples.length) return 0;
          apples[0].pos.x = 4;
          apples[0].pos.y = 3;
          g.tick();
          return g.wa.ka.length;
        }
        const live = [];
        for (let i = 0; i < 12; i++) live.push(eatLast(window.BLACK_DICE_COUNT));

        return {
          defaults,
          rollsDefault,
          rollsCustom,
          swapped,
          clamped,
          afterUi,
          hasUi: !!(minEl && maxEl),
          inFruitBowl,
          live,
          blackIdx: window.BLACK_DICE_COUNT,
        };
      });

      assert.equal(probe.defaults.min, 6, JSON.stringify(probe));
      assert.equal(probe.defaults.max, 24, JSON.stringify(probe));
      for (const n of probe.rollsDefault) {
        assert.ok(n >= 6 && n <= 24, "default roll " + n);
      }
      for (const n of probe.rollsCustom) {
        assert.ok(n >= 10 && n <= 12, "custom roll " + n);
      }
      assert.equal(probe.swapped.min, 5, JSON.stringify(probe.swapped));
      assert.equal(probe.swapped.max, 50, JSON.stringify(probe.swapped));
      assert.equal(probe.clamped.min, 1, JSON.stringify(probe.clamped));
      assert.equal(probe.clamped.max, 10000, JSON.stringify(probe.clamped));
      assert.equal(probe.hasUi, true, JSON.stringify(probe));
      assert.equal(probe.inFruitBowl, false, "must not be in Custom Bowl panel");
      assert.equal(probe.afterUi.min, 7, JSON.stringify(probe));
      assert.equal(probe.afterUi.max, 9, JSON.stringify(probe));
      for (const n of probe.live) {
        assert.ok(n >= 6 && n <= 24, "live black " + n + " " + JSON.stringify(probe.live));
      }
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("Pudding Settings Setup can show/hide Visibility", async () => {
    const { launchHarness } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 26, headless: true });
    try {
      await h.page.waitForFunction(
        () =>
          !!document.getElementById("settings-popup-pudding") &&
          typeof window.remixOrganizeSettings === "function",
        null,
        { timeout: 60000 }
      );
      const probe = await h.page.evaluate(() => {
        window.remixOrganizeSettings();
        if (typeof window.BootstrapShow === "function") window.BootstrapShow();
        document.getElementById("ultra-settings-tab-stats").click();
        const stats = document.getElementById("ultra-settings-page-stats");
        const chooser = document.getElementById("stat-chooser");
        const chooserH = chooser && chooser.getBoundingClientRect().height;
        document.getElementById("ultra-settings-tab-setup").click();
        const setup = document.getElementById("ultra-settings-page-setup");
        const play = document.getElementById("ultra-settings-page-play");
        const visBtn = document.getElementById("remix-visibility-settings");
        const vis = document.getElementById("delete-stuff-popup");
        const setupResets = setup
          ? [...setup.querySelectorAll('[id="ResetKeybind"]')]
          : [];
        const speedinfoReset = document.querySelector(
          "#speedinfo-popup-pudding [id='ResetKeybind']"
        );
        window.button_color = "#111111";
        if (typeof window.remixApplyThemeColors === "function") {
          window.remixApplyThemeColors();
        }
        const resetBtn = setupResets[0];
        const resetCs = resetBtn && getComputedStyle(resetBtn);
        const onTab = document.querySelector("#ultra-settings-pager .ultra-settings-tab.ultra-tab-on");
        const tabCs = onTab && getComputedStyle(onTab);
        window.remixSetVisibilityOpen(false);
        const visBtnBox = visBtn && visBtn.getBoundingClientRect();
        const setupBox = setup && setup.getBoundingClientRect();
        const before = !!(vis && vis.hidden);
        const labelBefore = visBtn && visBtn.textContent;
        if (visBtn) visBtn.click();
        const shown = !!(vis && vis.hidden === false);
        const labelShown = visBtn && visBtn.textContent;
        if (visBtn) visBtn.click();
        const hiddenAgain = !!(vis && vis.hidden);
        const timerBtn = document.getElementById("TimerSettings");
        if (timerBtn) timerBtn.click();
        else if (typeof window.editTimer === "function") window.editTimer();
        const pager = document.getElementById("ultra-settings-pager");
        const playTab = document.getElementById("ultra-settings-tab-play");
        const settingsBox = document.getElementById("settings-popup-pudding");
        return {
          visBtnFirst: setup && setup.firstElementChild === visBtn,
          playSkull: !!(play && play.querySelector("#SkullPoisonFruit")),
          chooserInStats: !!(stats && stats.querySelector("#stat-chooser")),
          before,
          labelBefore,
          shown,
          labelShown,
          hiddenAgain,
          chooserH,
          visBtnW: visBtnBox && visBtnBox.width,
          setupW: setupBox && setupBox.width,
          setupResetCount: setupResets.length,
          speedinfoKeep: !!speedinfoReset,
          resetBg: resetCs && resetCs.backgroundColor,
          tabBg: tabCs && tabCs.backgroundColor,
          timerOpen: !!document.getElementById("edit-box"),
          pagerDisplay: pager ? getComputedStyle(pager).display : null,
          playTabDisplay: playTab ? getComputedStyle(playTab).display : null,
          settingsDisplay: settingsBox ? getComputedStyle(settingsBox).display : null,
        };
      });
      assert.equal(probe.visBtnFirst, true, JSON.stringify(probe));
      assert.equal(probe.playSkull, true, JSON.stringify(probe));
      assert.equal(probe.chooserInStats, true, JSON.stringify(probe));
      assert.equal(probe.before, true, JSON.stringify(probe));
      assert.equal(probe.labelBefore, "Show Visibility settings", JSON.stringify(probe));
      assert.equal(probe.shown, true, JSON.stringify(probe));
      assert.equal(probe.labelShown, "Hide Visibility settings", JSON.stringify(probe));
      assert.equal(probe.hiddenAgain, true, JSON.stringify(probe));
      assert.ok(probe.chooserH >= 34 && probe.chooserH <= 40, JSON.stringify(probe));
      assert.ok(probe.visBtnW >= probe.setupW - 4, JSON.stringify(probe));
      assert.equal(probe.setupResetCount, 1, JSON.stringify(probe));
      assert.match(String(probe.resetBg), /rgb\(\s*17,\s*17,\s*17\s*\)/, JSON.stringify(probe));
      assert.match(String(probe.tabBg), /rgb\(\s*17,\s*17,\s*17\s*\)/, JSON.stringify(probe));
      assert.equal(probe.timerOpen, true, JSON.stringify(probe));
      assert.notEqual(probe.pagerDisplay, "none", JSON.stringify(probe));
      assert.notEqual(probe.playTabDisplay, "none", JSON.stringify(probe));
      assert.notEqual(probe.settingsDisplay, "none", JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });
});
