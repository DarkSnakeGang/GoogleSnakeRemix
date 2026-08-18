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
    assert.match(ultra, /ultraOrganizeSettings/);
    assert.match(ultra, /ULTRA_PRESET_PNG/);
    assert.match(ultra, /ULTRA_CHALLENGE_TXT/);
    assert.match(ultra, /setupMakePatternHtml/);
    assert.match(ultra, /textContent = "Remix Ultra"/);
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
        return [...document.querySelectorAll("#preset-panel img.preset-option")].map(
          (el) => {
            const r = el.getBoundingClientRect();
            return { w: r.width, h: r.height };
          }
        );
      });
      assert.ok(presetThumbs.length >= 15, JSON.stringify(presetThumbs));
      assert.ok(
        presetThumbs.every((t) => t.w >= 40 && t.h >= 40),
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
        document.getElementById("ultra-settings-tab-play").click();
        return {
          overflowY: s && s.overflowY,
          scroll: root && root.scrollHeight - root.clientHeight,
          pager: !!document.getElementById("ultra-settings-pager"),
          play: !!play,
          stats: !!stats,
          setup: !!document.getElementById("ultra-settings-page-setup"),
          skullInPlay: !!(
            play && play.querySelector("#SkullPoisonFruit")
          ),
          chooserInStats: !!(
            stats && stats.querySelector("#stat-chooser")
          ),
          afterStats,
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
      assert.equal(chrome.toPreset.display, "none", JSON.stringify(chrome));
      assert.equal(chrome.toPlace.display, "none", JSON.stringify(chrome));
      assert.equal(chrome.customBtn, "none", JSON.stringify(chrome));
      assert.equal(chrome.challengeBtn, "none", JSON.stringify(chrome));
      assert.equal(chrome.leftTabs.display, "flex", JSON.stringify(chrome));
      assert.notEqual(chrome.place.radius, "0px", JSON.stringify(chrome));
      assert.equal(chrome.speedTab, null, JSON.stringify(chrome));
      assert.equal(chrome.speedInfoWrap, "none", JSON.stringify(chrome));
      assert.equal(chrome.splitWrap, "none", JSON.stringify(chrome));
      assert.equal(chrome.scrollbarWrap, "none", JSON.stringify(chrome));

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
      assert.equal(afterCustom.customDisplay, "block", JSON.stringify(afterCustom));
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
        };
      });
      assert.match(String(after.chosen), /preset-challenge/, JSON.stringify(after));
      assert.equal(after.Aa === 0 || after.Sa === 0, true, JSON.stringify(after));
      if (after.board && after.board.w) {
        assert.equal(after.board.w, 17, JSON.stringify(after));
      }
      assert.equal(alerts.length, 0, JSON.stringify({ alerts, after }));
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
});
