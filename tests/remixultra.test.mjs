import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REMIX = path.join(ROOT, "RemixMod.js");
const ULTRA = path.join(ROOT, "RemixUltraMod.js");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("RemixUltra build artifacts", () => {
  it("RemixMod.js stays Remix-only (no LE / Ultra export)", () => {
    assert.equal(fs.existsSync(REMIX), true, "run python RemixBuilder.py");
    const remix = fs.readFileSync(REMIX, "utf8");
    assert.match(remix, /window\.RemixMod = \{\}/);
    assert.doesNotMatch(remix, /window\.RemixUltraMod/);
    assert.doesNotMatch(remix, /window\.levelEditorMod/);
    assert.match(remix, /window\.PauseMod/);
    assert.match(remix, /remixOrganizeSettings/);
    assert.match(remix, /remix-visibility-settings/);
    assert.match(remix, /remixSettingsEl/);
    assert.match(remix, /var\(--ultra-btn/);
    assert.match(remix, /\(b\.nla\|\|b\.Oka\)/);
    assert.match(remix, /RemixSettings/);
    assert.doesNotMatch(remix, /RemixUltraSettings/);
  });

  it("RemixUltraMod.js concatenates LE + Ultra keys + dock helper", () => {
    assert.equal(fs.existsSync(ULTRA), true, "run python RemixBuilder.py");
    const ultra = fs.readFileSync(ULTRA, "utf8");
    assert.match(ultra, /window\.PauseMod/);
    assert.match(ultra, /window\.RemixUltraMod/);
    assert.match(ultra, /window\.levelEditorMod/);
    assert.match(ultra, /RemixUltraSettings/);
    assert.match(ultra, /snake_timeKeeper_remix_ultra/);
    assert.match(ultra, /ultraLayoutMenus/);
    assert.match(ultra, /ultraBlitChosenPreset/);
    assert.match(ultra, /selectNewSizeSettingAndHardReset\.__ultra = true/);
    assert.match(ultra, /ultraOrganizeSettings/);
    assert.match(ultra, /remixSettingsEl/);
    assert.match(ultra, /var\(--ultra-btn/);
    assert.match(ultra, /ULTRA_PRESET_PNG/);
    assert.match(ultra, /ULTRA_CHALLENGE_TXT/);
    assert.match(ultra, /setupMakePatternHtml/);
    assert.match(ultra, /textContent = "Remix Ultra"/);
    assert.match(ultra, /window\.UltraPlace/);
    assert.match(ultra, /wa\\s\*===\\s\*10/);
    assert.match(ultra, /ultraPlaceBuildGridHtml/);
  });
});

describe("RemixUltra (browser)", { skip: !runBrowser }, () => {
  async function launchUltra(extra = {}) {
    const { launchHarness, ultraHarnessOpts } = await import(
      "../tools/harness.mjs"
    );
    return launchHarness(ultraHarnessOpts(extra));
  }

  function visibleDockIds(boxes) {
    return Object.entries(boxes)
      .filter(([, v]) => v && v.visible)
      .map(([id]) => id);
  }

  it("loads without patch errors and shows a single Remix Ultra indicator", async () => {
    const h = await launchUltra({ seed: 31, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const parent = document.getElementsByClassName("EjCLSb")[0];
        const labels = parent
          ? [...parent.querySelectorAll("div")]
              .map((el) => (el.textContent || "").trim())
              .filter(
                (t) =>
                  t === "Remix Mod" ||
                  t === "Level Editor Mod" ||
                  t === "Remix Ultra"
              )
          : [];
        return {
          ultra: !!window.RemixUltraMod,
          le: !!window.levelEditorMod,
          keys: {
            settings: window.REMIX_SETTINGS_KEY,
            tk: window.REMIX_TIMEKEEPER_KEY,
          },
          labels,
          place: !!document.getElementById("place-panel"),
          tabs: !!document.getElementById("ultra-dock-tabs"),
          splitsTab: !!document.getElementById("ultra-tab-splits"),
          leftTabs: !!document.getElementById("ultra-left-dock-tabs"),
        };
      });
      assert.equal(probe.ultra, true, JSON.stringify(probe));
      assert.equal(probe.le, true, JSON.stringify(probe));
      assert.equal(probe.keys.settings, "RemixUltraSettings");
      assert.equal(probe.keys.tk, "snake_timeKeeper_remix_ultra");
      assert.deepEqual(probe.labels, ["Remix Ultra"], JSON.stringify(probe));
      assert.equal(probe.place, true);
      assert.equal(probe.tabs, true);
      assert.equal(probe.splitsTab, true);
      assert.equal(probe.leftTabs, true);
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("right dock shows only one of Place / Presets / Speed / More at a time", async () => {
    const h = await launchUltra({ seed: 32, headless: true });
    try {
      await h.page.waitForFunction(
        () => !!document.getElementById("ultra-dock-tabs"),
        null,
        { timeout: 60000 }
      );
      const clickTab = (id) =>
        h.page.evaluate((id) => {
          const el = document.getElementById(id);
          if (!el) throw new Error("missing " + id);
          el.click();
        }, id);

      await h.page.evaluate(() => window.ultraSetRight("place"));
      const boxesFor = () =>
        h.page.evaluate(() => {
          const ids = [
            "place-panel",
            "preset-panel",
            "speedinfo-popup-pudding",
            "settings-popup-pudding",
          ];
          const out = {};
          for (const id of ids) {
            const el = document.getElementById(id);
            if (!el) {
              out[id] = null;
              continue;
            }
            const r = el.getBoundingClientRect();
            const s = getComputedStyle(el);
            out[id] = {
              visible:
                s.display !== "none" &&
                s.visibility !== "hidden" &&
                r.width > 0 &&
                r.height > 0,
              display: el.style.display || s.display,
              vis: s.visibility,
              w: r.width,
              h: r.height,
            };
          }
          out._dock = window.ultraDock;
          out._modal = window.ultraModalOpen && window.ultraModalOpen();
          return out;
        });

      let boxes = await boxesFor();
      assert.deepEqual(visibleDockIds(boxes), ["place-panel"], JSON.stringify(boxes));

      await clickTab("ultra-tab-presets");
      boxes = await boxesFor();
      assert.deepEqual(visibleDockIds(boxes), ["preset-panel"], JSON.stringify(boxes));
      const presetThumbs = await h.page.evaluate(() => {
        const none = document.querySelector("#preset-panel .preset-none");
        const ham = document.querySelector("#preset-panel .preset-random-ham");
        const nr = none && none.getBoundingClientRect();
        const hr = ham && ham.getBoundingClientRect();
        return {
          thumbs: [...document.querySelectorAll("#preset-panel img.preset-option")].map(
            (el) => {
              const r = el.getBoundingClientRect();
              return { w: r.width, h: r.height };
            }
          ),
          noneTag: none && none.tagName,
          noneText: none && none.textContent.trim(),
          noneTop: nr && nr.top,
          hamTop: hr && hr.top,
          noneW: nr && nr.width,
          hamW: hr && hr.width,
        };
      });
      assert.ok(presetThumbs.thumbs.length >= 15, JSON.stringify(presetThumbs));
      assert.ok(
        presetThumbs.thumbs.every((t) => t.w >= 40 && t.h >= 40),
        JSON.stringify(presetThumbs)
      );
      assert.equal(presetThumbs.noneTag, "DIV", JSON.stringify(presetThumbs));
      assert.match(String(presetThumbs.noneText), /none/i);
      assert.ok(
        Math.abs(presetThumbs.noneTop - presetThumbs.hamTop) < 2,
        "None should sit on the same row as Random Ham " + JSON.stringify(presetThumbs)
      );
      assert.ok(
        presetThumbs.noneW > 40 && presetThumbs.hamW > 40,
        JSON.stringify(presetThumbs)
      );

      await clickTab("ultra-tab-more");
      boxes = await boxesFor();
      assert.deepEqual(
        visibleDockIds(boxes),
        ["settings-popup-pudding"],
        JSON.stringify(boxes)
      );
      const more = await h.page.evaluate(() => {
        const root = document.getElementById("settings-popup-pudding");
        const s = root && getComputedStyle(root);
        const play = document.getElementById("ultra-settings-page-play");
        const stats = document.getElementById("ultra-settings-page-stats");
        document.getElementById("ultra-settings-tab-stats").click();
        const afterStats = {
          playOn: play && play.classList.contains("ultra-page-on"),
          statsOn: stats && stats.classList.contains("ultra-page-on"),
        };
        const chooser = document.getElementById("stat-chooser");
        const chooserH = chooser && chooser.getBoundingClientRect().height;
        document.getElementById("ultra-settings-tab-setup").click();
        const setup = document.getElementById("ultra-settings-page-setup");
        const visBtn = document.getElementById("remix-visibility-settings");
        const vis = document.getElementById("delete-stuff-popup");
        const visBtnBox = visBtn && visBtn.getBoundingClientRect();
        const setupBox = setup && setup.getBoundingClientRect();
        const visWasHidden = !!(vis && vis.hidden);
        const visBtnShow = visBtn && visBtn.textContent;
        if (visBtn) visBtn.click();
        const visShown = !!(vis && vis.hidden === false);
        const visBtnHide = visBtn && visBtn.textContent;
        const modalWhileVis = window.ultraModalOpen && window.ultraModalOpen();
        if (visBtn) visBtn.click();
        const visHiddenAgain = !!(vis && vis.hidden);
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
        if (typeof window.ultraApplyTheme === "function") {
          window.ultraApplyTheme();
        }
        const resetCs = setupResets[0] && getComputedStyle(setupResets[0]);
        const onTab = document.querySelector("#ultra-settings-pager .ultra-settings-tab.ultra-tab-on");
        const tabCs = onTab && getComputedStyle(onTab);
        document.getElementById("ultra-settings-tab-play").click();
        const setupKids = setup
          ? [...setup.children].map((el) => el.id || el.tagName)
          : [];
        return {
          overflowY: s && s.overflowY,
          scroll: root && root.scrollHeight - root.clientHeight,
          pager: !!document.getElementById("ultra-settings-pager"),
          play: !!play,
          stats: !!stats,
          setup: !!setup,
          skullInPlay: !!(
            play && play.querySelector("#SkullPoisonFruit")
          ),
          chooserInStats: !!(
            stats && stats.querySelector("#stat-chooser")
          ),
          visBtn: !!(visBtn && visBtn.parentElement === setup),
          visBtnFirst: setupKids[0] === "remix-visibility-settings",
          visBtnShow,
          visWasHidden,
          visShown,
          visBtnHide,
          visHiddenAgain,
          modalWhileVis,
          setupKids,
          chooserH,
          visBtnW: visBtnBox && visBtnBox.width,
          setupW: setupBox && setupBox.width,
          afterStats,
          setupResetCount: setupResets.length,
          speedinfoKeep: !!speedinfoReset,
          resetBg: resetCs && resetCs.backgroundColor,
          tabBg: tabCs && tabCs.backgroundColor,
        };
      });
      assert.equal(more.overflowY, "hidden", JSON.stringify(more));
      assert.ok(more.scroll <= 2, JSON.stringify(more));
      assert.equal(more.pager, true, JSON.stringify(more));
      assert.equal(more.play, true, JSON.stringify(more));
      assert.equal(more.stats, true, JSON.stringify(more));
      assert.equal(more.setup, true, JSON.stringify(more));
      assert.equal(more.skullInPlay, true, JSON.stringify(more));
      assert.equal(more.chooserInStats, true, JSON.stringify(more));
      assert.equal(more.afterStats.playOn, false, JSON.stringify(more));
      assert.equal(more.afterStats.statsOn, true, JSON.stringify(more));
      assert.equal(more.visBtn, true, JSON.stringify(more));
      assert.equal(more.visBtnFirst, true, JSON.stringify(more));
      assert.equal(more.visWasHidden, true, JSON.stringify(more));
      assert.equal(more.visShown, true, JSON.stringify(more));
      assert.equal(more.visBtnHide, "Hide Visibility settings", JSON.stringify(more));
      assert.equal(more.visHiddenAgain, true, JSON.stringify(more));
      assert.equal(more.visBtnShow, "Show Visibility settings", JSON.stringify(more));
      assert.equal(more.modalWhileVis, false, JSON.stringify(more));
      assert.ok(more.chooserH >= 34 && more.chooserH <= 40, JSON.stringify(more));
      assert.ok(
        more.visBtnW >= more.setupW - 4,
        JSON.stringify(more)
      );
      assert.equal(more.setupResetCount, 1, JSON.stringify(more));
      assert.match(String(more.resetBg), /rgb\(\s*17,\s*17,\s*17\s*\)/, JSON.stringify(more));

      boxes = await boxesFor();
      assert.deepEqual(
        visibleDockIds(boxes),
        ["settings-popup-pudding"],
        JSON.stringify(boxes)
      );

      await clickTab("ultra-tab-more");
      boxes = await boxesFor();
      assert.deepEqual(visibleDockIds(boxes), [], JSON.stringify(boxes));
      assert.equal(boxes._dock && boxes._dock.right, null, JSON.stringify(boxes));

      await clickTab("ultra-tab-place");
      boxes = await boxesFor();
      assert.deepEqual(visibleDockIds(boxes), ["place-panel"], JSON.stringify(boxes));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("hides LE Place/Presets/Custom/Challenge buttons and themes docks", async () => {
    const h = await launchUltra({ seed: 37, headless: true });
    try {
      await h.page.waitForFunction(
        () => !!document.getElementById("ultra-tab-splits"),
        null,
        { timeout: 60000 }
      );
      const chrome = await h.page.evaluate(() => {
        const cs = (id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const s = getComputedStyle(el);
          return { display: s.display, radius: s.borderRadius };
        };
        const presetCustom = document.querySelector("#preset-panel > .preset-custom");
        const presetChallenge = document.querySelector(
          "#preset-panel > .preset-challenge"
        );
        return {
          toPreset: cs("link-to-preset"),
          toPlace: cs("link-to-place"),
          customBtn: presetCustom && getComputedStyle(presetCustom).display,
          challengeBtn: presetChallenge && getComputedStyle(presetChallenge).display,
          leftTabs: cs("ultra-left-dock-tabs"),
          place: cs("place-panel"),
          css: !!document.getElementById("ultra-theme-css"),
          speedTab: document.getElementById("ultra-tab-speed"),
          speedInfoCb: document.getElementById("AlwaysOnTimeKeeper"),
          speedInfoWrap:
            document.getElementById("AlwaysOnTimeKeeper") &&
            getComputedStyle(
              document.getElementById("AlwaysOnTimeKeeper").closest(".form-check") ||
                document.getElementById("AlwaysOnTimeKeeper").parentElement
            ).display,
          splitWrap:
            document.getElementById("ShowSplitPanel") &&
            getComputedStyle(
              document.getElementById("ShowSplitPanel").closest(".form-check") ||
                document.getElementById("ShowSplitPanel").parentElement
            ).display,
          scrollbarWrap:
            document.getElementById("RemoveScrollbar") &&
            getComputedStyle(
              document.getElementById("RemoveScrollbar").closest(".form-check") ||
                document.getElementById("RemoveScrollbar").parentElement
            ).display,
          customW: document.getElementById("custom-panel") &&
            document.getElementById("custom-panel").getBoundingClientRect().width,
          challengeW: document.getElementById("challenge-panel") &&
            document.getElementById("challenge-panel").getBoundingClientRect().width,
        };
      });
      assert.equal(chrome.css, true, JSON.stringify(chrome));
      assert.ok(
        !chrome.toPreset || chrome.toPreset.display === "none",
        JSON.stringify(chrome)
      );
      assert.ok(
        !chrome.toPlace || chrome.toPlace.display === "none",
        JSON.stringify(chrome)
      );
      assert.equal(chrome.customBtn, "none", JSON.stringify(chrome));
      assert.equal(chrome.challengeBtn, "none", JSON.stringify(chrome));
      assert.equal(chrome.leftTabs.display, "flex", JSON.stringify(chrome));
      assert.notEqual(chrome.place.radius, "0px", JSON.stringify(chrome));
      assert.equal(chrome.speedTab, null, JSON.stringify(chrome));
      assert.equal(chrome.speedInfoWrap, "none", JSON.stringify(chrome));
      assert.equal(chrome.splitWrap, "none", JSON.stringify(chrome));
      assert.ok(
        !chrome.scrollbarWrap || chrome.scrollbarWrap === "none",
        JSON.stringify(chrome)
      );

      await h.page.evaluate(() => document.getElementById("ultra-tab-custom").click());
      const afterCustom = await h.page.evaluate(() => {
        const custom = document.getElementById("custom-panel");
        const chosen = document.querySelector(".chosen-preset");
        const s = custom && getComputedStyle(custom);
        return {
          customDisplay: s && s.display,
          chosen: chosen && chosen.className,
          left: window.ultraDock.left,
          customW: custom && custom.getBoundingClientRect().width,
        };
      });
      assert.equal(afterCustom.left, "custom", JSON.stringify(afterCustom));
      assert.equal(afterCustom.customDisplay, "flex", JSON.stringify(afterCustom));
      assert.match(String(afterCustom.chosen), /preset-custom/);
      assert.ok(afterCustom.customW <= 230, JSON.stringify(afterCustom));

      await h.page.evaluate(() => document.getElementById("ultra-tab-challenge").click());
      const afterCh = await h.page.evaluate(() => {
        const ch = document.getElementById("challenge-panel");
        return {
          display: ch && getComputedStyle(ch).display,
          w: ch && ch.getBoundingClientRect().width,
          left: window.ultraDock.left,
        };
      });
      assert.equal(afterCh.left, "challenge", JSON.stringify(afterCh));
      assert.equal(afterCh.display, "block", JSON.stringify(afterCh));
      assert.ok(afterCh.w <= 230, JSON.stringify(afterCh));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("Challenge level change sets Normal size and resets without the too-small popup", async () => {
    const h = await launchUltra({ seed: 39, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.SMALL });
      const alerts = [];
      h.page.on("dialog", async (d) => {
        alerts.push(d.message());
        await d.dismiss();
      });
      const after = await h.page.evaluate(() => {
        document.getElementById("ultra-tab-challenge").click();
        const sel = document.getElementById("challenge-level");
        sel.value = "2";
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        const g = window.__remixGame;
        const sizeEl = document.getElementById("size");
        const selected =
          sizeEl &&
          [...sizeEl.children].findIndex((c) =>
            /tuJOWd|DqMRee tuJOWd/.test(c.className)
          );
        const pixels =
          window.otherPresetmanager &&
          window.otherPresetmanager.getChallengePixelList();
        const wall = pixels && pixels.find((p) => p && p.category === "wall");
        return {
          Aa: g && g.settings && g.settings.Aa,
          Sa: g && g.settings && g.settings.Sa,
          board: g && g.wa && g.wa.oa && g.wa.oa.oa && {
            w: g.wa.oa.oa.width,
            h: g.wa.oa.oa.height,
          },
          chosen: document.querySelector(".chosen-preset") &&
            document.querySelector(".chosen-preset").className,
          selectedSize: selected,
          wrapped: !!(
            window.selectNewSizeSettingAndHardReset &&
            window.selectNewSizeSettingAndHardReset.__ultra
          ),
          challengePixels: pixels ? pixels.length : 0,
          wallAt: wall ? { x: wall.x, y: wall.y } : null,
          hasWall: !!(
            wall &&
            typeof window.checkWall === "function" &&
            window.checkWall(wall.x, wall.y)
          ),
        };
      });
      assert.match(String(after.chosen), /preset-challenge/, JSON.stringify(after));
      assert.equal(after.Aa === 0 || after.Sa === 0, true, JSON.stringify(after));
      if (after.board && after.board.w) {
        assert.equal(after.board.w, 17, JSON.stringify(after));
      }
      assert.equal(after.wrapped, true, JSON.stringify(after));
      assert.ok(after.challengePixels > 0, JSON.stringify(after));
      assert.equal(after.hasWall, true, JSON.stringify(after));
      assert.equal(alerts.length, 0, JSON.stringify({ alerts, after }));

      const preset = await h.page.evaluate(() => {
        document.getElementById("ultra-tab-presets").click();
        const img = [
          ...document.querySelectorAll("#preset-panel img.preset-option"),
        ].find((el) => {
          if (el.classList.contains("preset-none")) return false;
          const key = el.getAttribute("data-ultra-pattern");
          const pat = key && window.presetPatterns && window.presetPatterns[key];
          return (
            pat &&
            pat.pixelList &&
            pat.pixelList.some((p) => p.category === "wall")
          );
        });
        if (!img) return { found: false };
        img.click();
        const key = img.getAttribute("data-ultra-pattern");
        const pat = window.presetPatterns[key];
        const wall = pat.pixelList.find((p) => p.category === "wall");
        return {
          found: true,
          chosen: document.querySelector(".chosen-preset") &&
            document.querySelector(".chosen-preset").className,
          srcKey: key,
          wallAt: wall ? { x: wall.x, y: wall.y } : null,
          hasWall: !!(
            wall &&
            typeof window.checkWall === "function" &&
            window.checkWall(wall.x, wall.y)
          ),
        };
      });
      assert.equal(preset.found, true, JSON.stringify(preset));
      assert.ok(!/preset-none|preset-challenge/.test(String(preset.chosen)), JSON.stringify(preset));
      assert.equal(preset.hasWall, true, JSON.stringify(preset));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("keeps Input Display in a dock footer instead of over Place", async () => {
    const h = await launchUltra({ seed: 38, headless: true });
    try {
      await h.page.waitForFunction(
        () => !!document.getElementById("ultra-tab-place"),
        null,
        { timeout: 60000 }
      );
      await h.page.evaluate(() => {
        if (!window.pudding_settings.InputDisplay) window.toggle_input_display();
        window.ultraSetRight("place");
      });
      const probe = await h.page.evaluate(() => {
        const speed = document.getElementById("speedinfo-popup-pudding");
        const slot = document.getElementById("ultra-input-slot");
        const pad = document.getElementById("input-display-container");
        const place = document.getElementById("place-panel");
        const section = document.getElementById("input-display-section");
        const ss = speed && getComputedStyle(speed);
        const sl = slot && getComputedStyle(slot);
        return {
          speedDisplay: ss && ss.display,
          slotDisplay: sl && sl.display,
          sectionParent: section && section.parentElement && section.parentElement.id,
          padExists: !!pad,
          placeH: place && place.getBoundingClientRect().height,
          slotTop: slot && slot.getBoundingClientRect().top,
          placeBottom: place && place.getBoundingClientRect().bottom,
        };
      });
      assert.equal(probe.speedDisplay, "none", JSON.stringify(probe));
      assert.equal(probe.slotDisplay, "flex", JSON.stringify(probe));
      assert.equal(probe.sectionParent, "ultra-input-slot", JSON.stringify(probe));
      assert.equal(probe.padExists, true);
      assert.ok(probe.placeH < 520, JSON.stringify(probe));
      assert.ok(
        probe.slotTop + 1 >= probe.placeBottom,
        "input slot should sit under place panel " + JSON.stringify(probe)
      );
      const hamFit = await h.page.evaluate(() => {
        window.ultraSetRight("presets");
        const ham = document.querySelector("#preset-panel .preset-random-ham");
        const none = document.querySelector("#preset-panel .preset-none");
        const panel = document.getElementById("preset-panel");
        const slot = document.getElementById("ultra-input-slot");
        const hr = ham && ham.getBoundingClientRect();
        const nr = none && none.getBoundingClientRect();
        const pr = panel && panel.getBoundingClientRect();
        const sr = slot && slot.getBoundingClientRect();
        return {
          hamBottom: hr && hr.bottom,
          noneBottom: nr && nr.bottom,
          panelBottom: pr && pr.bottom,
          slotTop: sr && sr.top,
          sameRow: hr && nr && Math.abs(hr.top - nr.top) < 2,
        };
      });
      assert.equal(hamFit.sameRow, true, JSON.stringify(hamFit));
      assert.ok(
        hamFit.hamBottom <= hamFit.panelBottom + 1,
        "Random Ham should stay inside the preset panel " + JSON.stringify(hamFit)
      );
      assert.ok(
        hamFit.hamBottom <= hamFit.slotTop + 1,
        "Random Ham should not be cut off by Input Display " + JSON.stringify(hamFit)
      );
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("keeps dock tabs visible while Timer settings is open", async () => {
    const h = await launchUltra({ seed: 39, headless: true });
    try {
      await h.page.waitForFunction(
        () => !!document.getElementById("ultra-tab-more"),
        null,
        { timeout: 60000 }
      );
      await h.page.evaluate(() => {
        if (typeof window.ultraSetRight === "function") window.ultraSetRight("more");
        const setup = document.getElementById("ultra-settings-tab-setup");
        if (setup) setup.click();
        const btn = document.getElementById("TimerSettings");
        if (btn) btn.click();
        else if (typeof window.editTimer === "function") window.editTimer();
      });
      const probe = await h.page.evaluate(() => {
        const tabs = document.getElementById("ultra-dock-tabs");
        const pager = document.getElementById("ultra-settings-pager");
        const play = document.getElementById("ultra-settings-tab-play");
        const more = document.getElementById("settings-popup-pudding");
        return {
          hasEdit: !!document.getElementById("edit-box"),
          modal: window.ultraModalOpen && window.ultraModalOpen(),
          tabsDisplay: tabs ? getComputedStyle(tabs).display : null,
          pagerDisplay: pager ? getComputedStyle(pager).display : null,
          playDisplay: play ? getComputedStyle(play).display : null,
          moreDisplay: more ? getComputedStyle(more).display : null,
        };
      });
      assert.equal(probe.hasEdit, true, JSON.stringify(probe));
      assert.equal(probe.modal, false, JSON.stringify(probe));
      assert.notEqual(probe.tabsDisplay, "none", JSON.stringify(probe));
      assert.notEqual(probe.pagerDisplay, "none", JSON.stringify(probe));
      assert.notEqual(probe.playDisplay, "none", JSON.stringify(probe));
      assert.notEqual(probe.moreDisplay, "none", JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("hides docks while Custom Bowl is open and restores the previous tab", async () => {
    const h = await launchUltra({ seed: 33, headless: true });
    try {
      await h.page.waitForFunction(
        () => !!document.getElementById("ultra-tab-place"),
        null,
        { timeout: 60000 }
      );
      await h.page.evaluate(() => window.ultraSetRight("place"));
      await h.page.evaluate(() => {
        if (typeof window.PortalPairsPanelShow === "function") {
          window.PortalPairsPanelShow();
        }
      });
      const whileOpen = await h.page.evaluate(() => {
        const tabs = document.getElementById("ultra-dock-tabs");
        const place = document.getElementById("place-panel");
        return {
          tabsDisplay: tabs && tabs.style.display,
          placeDisplay: place && place.style.display,
          modal: window.ultraModalOpen(),
        };
      });
      assert.equal(whileOpen.modal, true, JSON.stringify(whileOpen));
      assert.equal(whileOpen.tabsDisplay, "none", JSON.stringify(whileOpen));
      assert.equal(whileOpen.placeDisplay, "none", JSON.stringify(whileOpen));

      await h.page.evaluate(() => {
        if (typeof window.PortalPairsPanelHide === "function") {
          window.PortalPairsPanelHide();
        }
      });
      const after = await h.page.evaluate(() => {
        const place = document.getElementById("place-panel");
        const tabs = document.getElementById("ultra-dock-tabs");
        return {
          right: window.ultraDock.right,
          placeDisplay: place && place.style.display,
          tabsDisplay: tabs && tabs.style.display,
        };
      });
      assert.equal(after.right, "place", JSON.stringify(after));
      assert.equal(after.placeDisplay, "grid", JSON.stringify(after));
      assert.equal(after.tabsDisplay, "flex", JSON.stringify(after));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("saves Ultra settings/TimeKeeper without touching Pudding or Remix keys", async () => {
    const h = await launchUltra({ seed: 34, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const pudKey = "PuddingSettings";
        const remixKey = "RemixSettings";
        const ultraKey = window.REMIX_SETTINGS_KEY || "RemixUltraSettings";
        const pudTk = "snake_timeKeeper";
        const remixTk = "snake_timeKeeper_remix";
        const ultraTk = window.REMIX_TIMEKEEPER_KEY || "snake_timeKeeper_remix_ultra";

        localStorage.setItem(
          pudKey,
          JSON.stringify({ marker: "pudding-only", SpeedInfo: false })
        );
        localStorage.setItem(
          remixKey,
          JSON.stringify({ marker: "remix-only", SpeedInfo: false })
        );
        localStorage.setItem(pudTk, JSON.stringify({ marker: "pudding-tk-only" }));
        localStorage.setItem(remixTk, JSON.stringify({ marker: "remix-tk-only" }));

        window.pudding_settings.BlackDiceMin = 8;
        window.pudding_settings.marker = "ultra-write";
        if (typeof window.saveSettings === "function") window.saveSettings();

        const tkStorage = window.timeKeeper.getStorage();
        tkStorage.marker = "ultra-tk-write";
        window.timeKeeper.setStorage(tkStorage);

        return {
          ultraKey,
          ultraTk,
          pudAfter: JSON.parse(localStorage.getItem(pudKey) || "null"),
          remixAfter: JSON.parse(localStorage.getItem(remixKey) || "null"),
          ultraAfter: JSON.parse(localStorage.getItem(ultraKey) || "null"),
          pudTkAfter: JSON.parse(localStorage.getItem(pudTk) || "null"),
          remixTkAfter: JSON.parse(localStorage.getItem(remixTk) || "null"),
          ultraTkAfter: JSON.parse(localStorage.getItem(ultraTk) || "null"),
        };
      });

      assert.equal(probe.pudAfter.marker, "pudding-only", JSON.stringify(probe));
      assert.equal(probe.remixAfter.marker, "remix-only", JSON.stringify(probe));
      assert.equal(probe.ultraAfter.marker, "ultra-write", JSON.stringify(probe));
      assert.equal(probe.ultraAfter.BlackDiceMin, 8, JSON.stringify(probe));
      assert.equal(probe.pudTkAfter.marker, "pudding-tk-only", JSON.stringify(probe));
      assert.equal(probe.remixTkAfter.marker, "remix-tk-only", JSON.stringify(probe));
      assert.equal(probe.ultraTkAfter.marker, "ultra-tk-write", JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("Chess start still produces pieces", async () => {
    const h = await launchUltra({ seed: 35, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      const start = await h.start({
        mode: "chess",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      assert.ok(start.pieces >= 2, JSON.stringify(start));
      const s = await h.state();
      assert.ok(
        s.apples.some((a) => a.isPiece),
        JSON.stringify(s.apples)
      );
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("Burger expire still makes skulls", async () => {
    const h = await launchUltra({ seed: 36, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "burger", count: COUNT.ONE, size: SIZE.NORMAL });
      const after = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const fresh = g.wa.ka.find((a) => a && !a.Oka);
        if (!fresh) return { ok: false };
        fresh.burgerTimer = 1;
        fresh.burgerTimerMax = 20;
        g.tick();
        const poisons = g.wa.ka.filter((a) => a.Oka);
        return {
          ok: true,
          poisons: poisons.length,
          poisonTimer: poisons[0] && poisons[0].burgerTimer,
        };
      });
      assert.equal(after.ok, true, JSON.stringify(after));
      assert.equal(after.poisons, 1, JSON.stringify(after));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("Random Ham places small-board walls and count-matching apples", async () => {
    const h = await launchUltra({ seed: 46, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        function boardSize() {
          try {
            return eval("window.wholeSnakeObject." + window.boardDimensions);
          } catch (_e) {
            return null;
          }
        }
        function wallCount() {
          try {
            const size = boardSize();
            if (!size || typeof window.checkWall !== "function") return -1;
            let n = 0;
            for (let y = 0; y < size.height; y++) {
              for (let x = 0; x < size.width; x++) {
                if (window.checkWall(x, y)) n++;
              }
            }
            return n;
          } catch (_e) {
            return -2;
          }
        }
        function appleInfo() {
          const apples =
            (window.wholeSnakeObject &&
              window.wholeSnakeObject.wa &&
              window.wholeSnakeObject.wa.ka) ||
            [];
          return {
            n: apples.length,
            pos: apples.slice(0, 12).map((a) => {
              const p = a && (a.pos || a);
              return p && typeof p.x === "number" ? { x: p.x, y: p.y } : null;
            }),
          };
        }
        document.getElementById("ultra-tab-presets").click();
        const ham = document.querySelector("#preset-panel .preset-random-ham");
        const before = {
          size: boardSize(),
          walls: wallCount(),
          apples: appleInfo(),
          countIdx:
            typeof window.ultraHamCountIndex === "function"
              ? window.ultraHamCountIndex()
              : null,
          ka:
            window.__remixGame &&
            window.__remixGame.settings &&
            window.__remixGame.settings.ka,
        };
        let list = null;
        let listErr = null;
        try {
          if (window.otherPresetmanager && window.otherPresetmanager.getRandomHamPixelList) {
            const origRand = Math.random;
            Math.random = function () {
              return 0;
            };
            list = window.otherPresetmanager.getRandomHamPixelList();
            Math.random = origRand;
          }
        } catch (e) {
          listErr = String(e && e.message ? e.message : e);
        }
        let clickErr = null;
        try {
          if (ham) ham.click();
        } catch (e) {
          clickErr = String(e && e.message ? e.message : e);
        }
        const after = {
          size: boardSize(),
          walls: wallCount(),
          apples: appleInfo(),
          chosen:
            document.querySelector(".chosen-preset") &&
            document.querySelector(".chosen-preset").className,
          offset:
            typeof window.getAppleSpawnPointOffset === "function"
              ? window.getAppleSpawnPointOffset()
              : null,
        };
        const cats = {};
        if (list) {
          for (let i = 0; i < list.length; i++) {
            const c = list[i] && list[i].category;
            cats[c] = (cats[c] || 0) + 1;
          }
        }
        const origCount = window.ultraHamCountIndex;
        const byCount = {};
        const origRand = Math.random;
        Math.random = function () {
          return 0;
        };
        [0, 1, 2, 3, 4, 5].forEach(function (idx) {
          window.ultraHamCountIndex = function () {
            return idx;
          };
          const px = window.otherPresetmanager.getRandomHamPixelList();
          byCount[idx] = {
            apples: px.filter((e) => e.category === "apple").map((e) => ({ x: e.x, y: e.y })),
            walls: px.filter((e) => e.category === "wall").length,
          };
        });
        Math.random = origRand;
        window.ultraHamCountIndex = origCount;
        return {
          before,
          after,
          listLen: list ? list.length : -1,
          cats,
          listSample: list ? list.slice(0, 5) : null,
          listErr,
          clickErr,
          byCount,
          loaded: !!(
            window.otherPresetmanager && window.otherPresetmanager.isHamsLoaded
          ),
          hamCodes:
            window.otherPresetmanager && window.otherPresetmanager.hamLevelCodes
              ? window.otherPresetmanager.hamLevelCodes.length
              : 0,
          wrappedGet: !!(
            window.otherPresetmanager && window.otherPresetmanager.__ultra
          ),
        };
      });
      assert.equal(probe.loaded, true, JSON.stringify(probe));
      assert.ok(probe.hamCodes > 0, JSON.stringify(probe));
      assert.ok(probe.cats.wall > 0, JSON.stringify(probe));
      assert.ok(probe.after.walls > 0, JSON.stringify(probe));
      assert.match(String(probe.after.chosen), /preset-random-ham/, JSON.stringify(probe));
      assert.equal(probe.after.size && probe.after.size.width, 10, JSON.stringify(probe));
      assert.equal(probe.byCount[0].apples.length, 1, JSON.stringify(probe.byCount[0]));
      assert.equal(probe.byCount[2].apples.length, 5, JSON.stringify(probe.byCount[2]));
      const five = probe.byCount[2].apples.map((p) => p.x + "," + p.y).sort();
      assert.deepEqual(
        five,
        ["4,2", "4,6", "6,4", "8,2", "8,6"],
        "5a should use the native small pentagon " + JSON.stringify(probe.byCount[2])
      );
      assert.equal(probe.byCount[3].apples.length, 10, JSON.stringify(probe.byCount[3]));
      const ten = probe.byCount[3].apples.map((p) => p.x + "," + p.y).sort();
      const pattern0Walls = new Set([
        "3,0", "5,1", "8,1", "0,2", "3,2", "9,3", "1,4", "4,4", "7,4", "2,6", "5,7", "8,7", "0,8", "3,8",
      ]);
      assert.ok(
        ten.every((t) => !pattern0Walls.has(t)),
        "10a apples must not sit on walls " + JSON.stringify(ten)
      );
      assert.ok(
        ten.every((t) => {
          const [x, y] = t.split(",").map(Number);
          return x >= 0 && y >= 0 && x < 10 && y < 9;
        }),
        JSON.stringify(ten)
      );
      const fiveLive = await h.page.evaluate(() => {
        const g = window.__remixGame;
        g.settings.ka = 2;
        const origRand = Math.random;
        Math.random = function () {
          return 0;
        };
        const list = window.otherPresetmanager.getRandomHamPixelList();
        Math.random = origRand;
        const off = window.getAppleSpawnPointOffset();
        window.blitPattern(list, off.x, off.y);
        const apples = (g.wa && g.wa.ka) || [];
        return {
          apples: apples
            .map((a) => {
              const p = a && a.pos;
              return p ? p.x + "," + p.y : "";
            })
            .sort(),
          listApples: list
            .filter((e) => e.category === "apple")
            .map((e) => e.x + "," + e.y)
            .sort(),
        };
      });
      assert.deepEqual(
        fiveLive.listApples,
        ["4,2", "4,6", "6,4", "8,2", "8,6"],
        "5a pixel list " + JSON.stringify(fiveLive)
      );
      assert.deepEqual(
        fiveLive.apples,
        ["4,2", "4,6", "6,4", "8,2", "8,6"],
        "live 5a blit " + JSON.stringify(fiveLive)
      );
    } finally {
      await h.close();
    }
  });
});
