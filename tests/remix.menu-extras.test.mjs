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

async function assertDragonFruitVisible(launch) {
  const h = await launch();
  try {
    await h.page.waitForFunction(
      () =>
        !!document.getElementById("EatThemeRandomizer") &&
        typeof window.remixOrganizeSettings === "function",
      null,
      { timeout: 60000 }
    );
    const probe = await h.page.evaluate(() => {
      window.remixOrganizeSettings();
      if (typeof window.ultraOrganizeSettings === "function") {
        window.ultraOrganizeSettings();
      }
      if (typeof window.BootstrapShow === "function") window.BootstrapShow();
      const playTab = document.getElementById("ultra-settings-tab-play");
      if (playTab) playTab.click();
      const input = document.getElementById("EatThemeRandomizer");
      const label = document.getElementById("EatThemeRandomizer2");
      const wrap = input && (input.closest(".form-check") || input.parentElement);
      const play = document.getElementById("ultra-settings-page-play");
      const wrapCs = wrap && getComputedStyle(wrap);
      const inputCs = input && getComputedStyle(input);
      const labelCs = label && getComputedStyle(label);
      const box = wrap && wrap.getBoundingClientRect();
      return {
        hasInput: !!input,
        inPlay: !!(play && input && play.contains(input)),
        wrapDisplay: wrapCs && wrapCs.display,
        inputDisplay: inputCs && inputCs.display,
        labelDisplay: labelCs && labelCs.display,
        boxH: box && box.height,
        boxW: box && box.width,
        label: label && String(label.textContent || "").trim(),
        ultraToggles: !!document.getElementById("UltraShieldedFruitSpawn"),
      };
    });
    assert.equal(probe.hasInput, true, JSON.stringify(probe));
    assert.equal(probe.inPlay, true, JSON.stringify(probe));
    assert.notEqual(probe.wrapDisplay, "none", JSON.stringify(probe));
    assert.notEqual(probe.inputDisplay, "none", JSON.stringify(probe));
    assert.notEqual(probe.labelDisplay, "none", JSON.stringify(probe));
    assert.ok(probe.boxH > 8 && probe.boxW > 8, JSON.stringify(probe));
    assert.equal(probe.label, "Dragon Fruit", JSON.stringify(probe));
    assert.deepEqual(h.modErrors(), [], "no mod errors");
    return probe;
  } finally {
    await h.close();
  }
}

describe("Dragon Fruit checkbox", { skip: !runBrowser }, () => {
  it("Remix Play tab shows Dragon Fruit", async () => {
    const { launchHarness } = await import("../tools/harness.mjs");
    const probe = await assertDragonFruitVisible(() =>
      launchHarness({ seed: 71, headless: true })
    );
    assert.equal(probe.ultraToggles, false, JSON.stringify(probe));
  });

  it("Ultra Play tab shows Dragon Fruit", async () => {
    const { launchHarness, ultraHarnessOpts } = await import("../tools/harness.mjs");
    await assertDragonFruitVisible(() =>
      launchHarness(ultraHarnessOpts({ seed: 72, headless: true }))
    );
  });
});

async function assertSokobanKeyBlackDiceStartsLikeDice(launch) {
  const { COUNT, SIZE } = await import("../tools/harness.mjs");
  const h = await launch();
  try {
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
    } catch (err) {
      const dump = await h.page
        .evaluate(() => ({
          href: location.href,
          title: document.title,
          remix: typeof window.RemixMod,
          ultra: typeof window.RemixUltraMod,
          game: !!window.__remixGame,
        }))
        .catch(() => null);
      err.message += " dump=" + JSON.stringify({ dump, errors: h.modErrors() });
      throw err;
    }
    const probe = await h.page.evaluate(() => {
      const g = window.__remixGame;
      function apples() {
        return (g.wa.ka || [])
          .map((a) => ({ x: a.pos.x, y: a.pos.y }))
          .sort((p, q) => p.x - q.x || p.y - q.y);
      }
      function snap(mode, ka, size) {
        g.settings.ub = mode;
        g.settings.ob = mode;
        g.settings.ka = ka;
        g.settings.Ca = ka;
        if (typeof size === "number") {
          g.settings.Aa = size;
          g.settings.Sa = size;
        }
        window.CurrentModeNum = mode;
        g.wa.reset();
        return apples();
      }
      const black = window.BLACK_DICE_COUNT;
      return {
        black,
        sokoDice: snap(9, 4),
        sokoBlack: snap(9, black),
        sokoOne: snap(9, 0),
        classicBlack: snap(0, black),
        classicDice: snap(0, 4),
        sokoSmallDice: snap(9, 4, 1),
        sokoSmallBlack: snap(9, black, 1),
      };
    });
    assert.ok(probe.sokoDice.length >= 1, JSON.stringify(probe));
    assert.deepEqual(probe.sokoBlack, probe.sokoDice, JSON.stringify(probe));
    assert.deepEqual(probe.sokoBlack, probe.sokoOne, JSON.stringify(probe));
    assert.deepEqual(probe.classicBlack, probe.classicDice, JSON.stringify(probe));
    assert.equal(probe.classicDice.length, 1, JSON.stringify(probe));
    assert.deepEqual(probe.sokoSmallBlack, probe.sokoSmallDice, JSON.stringify(probe));
    assert.deepEqual(h.modErrors(), [], "no mod errors");
  } finally {
    await h.close();
  }
}

describe("Sokoban/Key black dice start", { skip: !runBrowser }, () => {
  it("Remix: sokoban black dice start like Dice", async () => {
    const { launchHarness } = await import("../tools/harness.mjs");
    await assertSokobanKeyBlackDiceStartsLikeDice(() =>
      launchHarness({ seed: 62, headless: true })
    );
  });

  it("Ultra: sokoban black dice start like Dice", async () => {
    const { launchHarness, ultraHarnessOpts } = await import("../tools/harness.mjs");
    await assertSokobanKeyBlackDiceStartsLikeDice(() =>
      launchHarness(ultraHarnessOpts({ seed: 63, headless: true }))
    );
  });
});

async function assertKeyModeStartsWithKeyAndBlock(launch) {
  const { COUNT, SIZE } = await import("../tools/harness.mjs");
  const h = await launch();
  try {
    await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
    const probe = await h.page.evaluate(() => {
      const g = window.__remixGame;
      function keyBox() {
        if (g.Ba && Array.isArray(g.Ba.keys)) return g.Ba;
        const keys = Object.keys(g);
        for (let i = 0; i < keys.length; i++) {
          const v = g[keys[i]];
          if (v && Array.isArray(v.keys) && typeof v.reset === "function") return v;
        }
        return null;
      }
      function keyblocks() {
        const out = [];
        const hosts = Object.keys(g).map((k) => g[k]);
        for (let i = 0; i < hosts.length; i++) {
          const host = hosts[i];
          if (!host || typeof host !== "object") continue;
          for (const sk of Object.keys(host)) {
            const set = host[sk];
            if (!set || typeof set.values !== "function") continue;
            try {
              for (const v of set.values()) {
                if (v && v.yNa != null && v.pos) {
                  const rec = { x: v.pos.x, y: v.pos.y, type: v.yNa };
                  const id = rec.x + "," + rec.y + "," + rec.type;
                  if (!out._seen) out._seen = new Set();
                  if (out._seen.has(id)) continue;
                  out._seen.add(id);
                  out.push(rec);
                }
              }
            } catch (_e) {}
          }
        }
        delete out._seen;
        return out;
      }
      function snap(ka) {
        g.settings.ub = 8;
        g.settings.ob = 8;
        g.settings.ka = ka;
        g.settings.Ca = ka;
        window.CurrentModeNum = 8;
        g.nj = false;
        g.reset();
        const kb = keyBox();
        const keys = kb
          ? kb.keys.map((k) => ({
              x: k.pos.x,
              y: k.pos.y,
              type: k.type,
              bx: k.r7a && k.r7a.x,
              by: k.r7a && k.r7a.y,
            }))
          : [];
        const blocks = keyblocks();
        return {
          apples: (g.wa.ka || []).length,
          keys,
          blocks,
        };
      }
      return {
        disableKeyResetPlant: !!window.disableKeyResetPlant,
        one: snap(0),
        dice: snap(4),
        black: snap(window.BLACK_DICE_COUNT),
      };
    });
    assert.equal(probe.disableKeyResetPlant, false, JSON.stringify(probe));
    for (const name of ["one", "dice", "black"]) {
      const s = probe[name];
      assert.equal(s.apples, 0, name + " leftover fruit " + JSON.stringify(probe));
      assert.equal(s.keys.length, 1, name + " keys " + JSON.stringify(probe));
      assert.equal(s.blocks.length, 1, name + " blocks " + JSON.stringify(probe));
      assert.equal(s.keys[0].type, s.blocks[0].type, name + " type " + JSON.stringify(probe));
      assert.equal(s.keys[0].bx, s.blocks[0].x, name + " pair x " + JSON.stringify(probe));
      assert.equal(s.keys[0].by, s.blocks[0].y, name + " pair y " + JSON.stringify(probe));
    }
    assert.deepEqual(h.modErrors(), [], "no mod errors");
  } finally {
    await h.close();
  }
}

describe("Key mode start plants key + keyblock", { skip: !runBrowser }, () => {
  it("Remix: one/dice/black dice start with a matching key and keyblock", async () => {
    const { launchHarness } = await import("../tools/harness.mjs");
    await assertKeyModeStartsWithKeyAndBlock(() =>
      launchHarness({ seed: 64, headless: true })
    );
  });

  it("Ultra: one/dice/black dice start with a matching key and keyblock", async () => {
    const { launchHarness, ultraHarnessOpts } = await import("../tools/harness.mjs");
    await assertKeyModeStartsWithKeyAndBlock(() =>
      launchHarness(ultraHarnessOpts({ seed: 65, headless: true }))
    );
  });
});

describe("Walls spawn every apple", { skip: !runBrowser }, () => {
  it("Remix Play tab shows the toggle enabled and off by default", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 73, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        window.remixOrganizeSettings();
        if (typeof window.BootstrapShow === "function") window.BootstrapShow();
        const playTab = document.getElementById("ultra-settings-tab-play");
        if (playTab) playTab.click();
        const input = document.getElementById("WallEveryApple");
        const label = input && document.querySelector('label[for="WallEveryApple"]');
        const wrap = input && (input.closest(".form-check") || input.parentElement);
        const play = document.getElementById("ultra-settings-page-play");
        return {
          has: !!input,
          inPlay: !!(play && input && play.contains(input)),
          checked: !!(input && input.checked),
          disabled: !!(input && input.disabled),
          label: label && String(label.textContent || "").trim(),
          wrapDisplay: wrap && getComputedStyle(wrap).display,
          setting: window.pudding_settings.WallEveryApple,
          should: window.remixShouldSpawnWallEveryApple(),
          disableWallMode: !!window.disableWallMode,
        };
      });
      assert.equal(probe.has, true, JSON.stringify(probe));
      assert.equal(probe.inPlay, true, JSON.stringify(probe));
      assert.equal(probe.checked, false, JSON.stringify(probe));
      assert.equal(probe.disabled, false, JSON.stringify(probe));
      assert.equal(probe.label, "Walls spawn every apple", JSON.stringify(probe));
      assert.notEqual(probe.wrapDisplay, "none", JSON.stringify(probe));
      assert.equal(probe.setting, false, JSON.stringify(probe));
      assert.equal(probe.should, false, JSON.stringify(probe));
      assert.equal(probe.disableWallMode, false, JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("Remix wall mode spawns a wall every apple when the toggle is on", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 74, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.LARGE });
      const probe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        function wallCount() {
          const map = g.Ca && g.Ca.Aa;
          if (map && typeof map.size === "number") return map.size;
          return -1;
        }
        function revive() {
          g.nj = false;
          const snake = g.oa.ka;
          for (let i = 0; i < snake.length; i++) {
            snake[i].x = 6;
            snake[i].y = 8;
          }
          g.oa.direction = "RIGHT";
        }
        function startWall() {
          g.settings.ub = 1;
          g.settings.ob = 1;
          window.CurrentModeNum = 1;
          g.wa.reset();
          g.Sh = 0;
          revive();
        }
        function eatOne() {
          const apples = g.wa.ka;
          if (!apples.length) return false;
          revive();
          const head = g.oa.ka[0];
          apples[0].pos.x = head.x + 1;
          apples[0].pos.y = head.y;
          const before = g.Sh;
          for (let i = 0; i < 6; i++) {
            if (g.nj) revive();
            g.tick();
            if (g.Sh > before) return true;
          }
          return g.Sh > before;
        }
        function eatTwo(everyApple) {
          window.pudding_settings.WallEveryApple = !!everyApple;
          window.remixEnsureWallEveryAppleSetting();
          startWall();
          const before = wallCount();
          const ate = [eatOne(), eatOne()];
          return {
            everyApple: window.remixShouldSpawnWallEveryApple(),
            ate,
            delta: wallCount() - before,
          };
        }
        return { off: eatTwo(false), on: eatTwo(true) };
      });
      assert.equal(probe.off.everyApple, false, JSON.stringify(probe));
      assert.equal(probe.on.everyApple, true, JSON.stringify(probe));
      assert.ok(probe.off.ate.every(Boolean), "ate two apples off " + JSON.stringify(probe));
      assert.ok(probe.on.ate.every(Boolean), "ate two apples on " + JSON.stringify(probe));
      assert.equal(probe.off.delta, 1, JSON.stringify(probe));
      assert.equal(probe.on.delta, 2, JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });
});
