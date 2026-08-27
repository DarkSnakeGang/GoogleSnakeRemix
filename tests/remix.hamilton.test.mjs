import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("Hamilton tour (offline)", () => {
  it("ships HamiltonMod + Play toggle glue in both bundles", () => {
    const remix = fs.readFileSync(path.join(ROOT, "RemixMod.js"), "utf8");
    assert.match(remix, /window\.HamiltonMod/);
    assert.match(remix, /window\.HamiltonRemix/);
    assert.match(remix, /HamiltonTour/);
    assert.match(remix, /remixHamiltonSolveCurrentPattern/);
    assert.match(remix, /remixGateHamiltonMod/);
    assert.match(remix, /Vendored from GoogleSnakeWallSolver/);
    const ultra = fs.readFileSync(path.join(ROOT, "RemixUltraMod.js"), "utf8");
    assert.match(ultra, /window\.HamiltonMod/);
    assert.match(ultra, /ultraMaybeHamiltonAfterRandomHam/);
    assert.match(ultra, /ultraSyncWallCoordsFromBoard/);
  });

  it("HamiltonInit gates solve when toggle is off", () => {
    globalThis.window = globalThis;
    globalThis.document = {
      getElementById() {
        return null;
      },
      getElementsByClassName() {
        return [];
      },
      querySelector() {
        return null;
      },
    };
    const src = fs.readFileSync(path.join(ROOT, "src/HamiltonInit.js"), "utf8");
    eval(src);
    globalThis.pudding_settings = { Hamilton: false };
    let started = false;
    globalThis.HamiltonMod = {
      _startSolve() {
        started = true;
      },
      getBoardDims() {
        return { width: 10, height: 9, cells: 90 };
      },
      buildWallBits() {
        return "0".repeat(90);
      },
      updateIndicator() {},
    };
    assert.equal(globalThis.remixHamiltonSolveCurrentPattern(), false);
    assert.equal(started, false);
    globalThis.pudding_settings.Hamilton = true;
    assert.equal(globalThis.remixHamiltonSolveCurrentPattern(), true);
    assert.equal(started, true);
  });

  it("gates retarget score-bar icon to UEI8qf and offsets indicator", () => {
    globalThis.window = globalThis;
    const modeIcon = { jsname: "UEI8qf", src: "trophy_01.png" };
    const counterIcon = { id: "stat-icon", src: "keys.svg" };
    const bar = {
      querySelector(sel) {
        return sel.includes("UEI8qf") ? modeIcon : null;
      },
    };
    globalThis.document = {
      getElementById(id) {
        if (id === "stat-icon") return counterIcon;
        if (id === "hamilton-mod-indicator") return { style: {} };
        return null;
      },
      getElementsByClassName(name) {
        return name === "sEOCsb" ? [bar] : [];
      },
      querySelector(sel) {
        return sel.includes("UEI8qf") ? modeIcon : null;
      },
    };
    const src = fs.readFileSync(path.join(ROOT, "src/HamiltonInit.js"), "utf8");
    eval(src);
    globalThis.pudding_settings = { Hamilton: true };
    const HM = {
      WALL_ICON_SRC: "https://example/trophy_01.png",
      _statIconOrigSrc: "https://example/orig_trophy_01.png",
      getScoreBarIcon() {
        return counterIcon;
      },
      _restoreWallIconSrc() {
        return "keys.svg";
      },
      updateIndicator() {},
      notifyWallSpawn() {},
    };
    globalThis.HamiltonMod = HM;
    globalThis.remixGateHamiltonMod();
    assert.equal(HM.getScoreBarIcon(), modeIcon);
    assert.equal(HM._restoreWallIconSrc(), "https://example/orig_trophy_01.png");
    const ind = { style: { paddingTop: "4px" } };
    HM._indicatorEl = ind;
    globalThis.remixOffsetHamiltonIndicator();
    assert.equal(ind.style.paddingTop, "22px");
  });

  it("skips notifyWallSpawn re-solve while Random Ham is chosen", () => {
    globalThis.window = globalThis;
    let notified = 0;
    let indicated = 0;
    const hamEl = { classList: { contains: (c) => c === "preset-random-ham" } };
    globalThis.document = {
      getElementById() {
        return null;
      },
      getElementsByClassName() {
        return [];
      },
      querySelector(sel) {
        return sel === ".chosen-preset" ? hamEl : null;
      },
    };
    const src = fs.readFileSync(path.join(ROOT, "src/HamiltonInit.js"), "utf8");
    eval(src);
    globalThis.pudding_settings = { Hamilton: true };
    globalThis.HamiltonMod = {
      __remixGated: false,
      notifyWallSpawn() {
        notified++;
      },
      updateIndicator() {
        indicated++;
      },
    };
    globalThis.remixGateHamiltonMod();
    globalThis.HamiltonMod.notifyWallSpawn();
    assert.equal(notified, 0);
    assert.equal(indicated, 1);
    assert.equal(globalThis.remixHamiltonRandomHamChosen(), true);
  });

  it("does not tint mode trophy while Random Ham is chosen", () => {
    globalThis.window = globalThis;
    const modeIcon = {
      jsname: "UEI8qf",
      src: "https://example.com/candy_trophy.png",
    };
    const hamEl = { classList: { contains: (c) => c === "preset-random-ham" } };
    const bar = {
      querySelector(sel) {
        return sel.includes("UEI8qf") ? modeIcon : null;
      },
    };
    globalThis.document = {
      getElementById() {
        return null;
      },
      getElementsByClassName(name) {
        return name === "sEOCsb" ? [bar] : [];
      },
      querySelector(sel) {
        if (sel === ".chosen-preset") return hamEl;
        return sel.includes("UEI8qf") ? modeIcon : null;
      },
    };
    const src = fs.readFileSync(path.join(ROOT, "src/HamiltonInit.js"), "utf8");
    eval(src);
    globalThis.pudding_settings = { Hamilton: true };
    let tinted = 0;
    globalThis.HamiltonMod = {
      __remixGated: false,
      __remixPatternSolve: true,
      iconState: "idle",
      _iconLoadGen: 0,
      getScoreBarIcon() {
        return modeIcon;
      },
      setWallIconState(state) {
        tinted++;
        this.iconState = state;
        modeIcon.src = "data:image/png;base64,wall";
      },
      _clearIconTint() {},
      isWallMode() {
        return false;
      },
    };
    globalThis.remixGateHamiltonMod();
    assert.equal(globalThis.remixHamiltonShouldTintModeTrophy(), false);
    globalThis.HamiltonMod.setWallIconState("searching");
    assert.equal(tinted, 0, "Random Ham must not recolor mode trophy");
    assert.equal(globalThis.HamiltonMod.iconState, "searching");
    assert.match(modeIcon.src, /candy_trophy/);
  });

  it("does not rewrite mode trophy on reset outside Wall mode", () => {
    globalThis.window = globalThis;
    const modeIcon = {
      jsname: "UEI8qf",
      src: "https://example.com/trophy_00.png",
    };
    const bar = {
      querySelector(sel) {
        return sel.includes("UEI8qf") ? modeIcon : null;
      },
    };
    globalThis.document = {
      getElementById() {
        return null;
      },
      getElementsByClassName(name) {
        return name === "sEOCsb" ? [bar] : [];
      },
      querySelector(sel) {
        return sel.includes("UEI8qf") ? modeIcon : null;
      },
    };
    const src = fs.readFileSync(path.join(ROOT, "src/HamiltonInit.js"), "utf8");
    eval(src);
    globalThis.pudding_settings = { Hamilton: true };
    let tinted = 0;
    globalThis.HamiltonMod = {
      __remixGated: false,
      __remixPatternSolve: false,
      iconState: "idle",
      _iconLoadGen: 0,
      _statIconOrigSrc:
        "https://www.google.com/logos/fnbx/snake_arcade/v22/trophy_01.png",
      getScoreBarIcon() {
        return modeIcon;
      },
      setWallIconState(state) {
        tinted++;
        this.iconState = state;
        modeIcon.src = this._statIconOrigSrc;
      },
      _clearIconTint() {},
      isWallMode() {
        return false;
      },
    };
    globalThis.remixGateHamiltonMod();
    assert.equal(globalThis.remixHamiltonShouldTintModeTrophy(), false);
    globalThis.HamiltonMod.setWallIconState("idle");
    assert.equal(tinted, 0, "non-wall reset must not restore wall trophy");
    assert.match(modeIcon.src, /trophy_00/);
    assert.equal(globalThis.HamiltonMod._statIconOrigSrc, null);
  });
});

describe("Hamilton tour (browser)", { skip: !runBrowser }, () => {
  it("Play checkbox defaults off and gates notifyWallSpawn", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 81, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        window.remixOrganizeSettings();
        document.getElementById("ultra-settings-tab-play").click();
        const box = document.getElementById("HamiltonTour");
        const before = {
          exists: !!box,
          checked: !!(box && box.checked),
          setting: !!window.pudding_settings.Hamilton,
        };
        let calls = 0;
        const HM = window.HamiltonMod;
        const orig = HM && HM._startSolve;
        if (HM && orig) {
          HM._startSolve = function () {
            calls++;
            return orig.apply(this, arguments);
          };
        }
        window.wallCoords = [[1, 1]];
        if (typeof window.HamiltonMod.notifyWallSpawn === "function") {
          window.HamiltonMod.notifyWallSpawn();
        }
        const offCalls = calls;
        if (box) {
          box.checked = true;
          box.dispatchEvent(new Event("change", { bubbles: true }));
        }
        window.CurrentModeNum = 1;
        if (window.ModeRegistry) {
          /* keep wall path via CurrentModeNum fallback if registry differs */
        }
        if (typeof window.HamiltonMod.notifyWallSpawn === "function") {
          window.HamiltonMod.notifyWallSpawn();
        }
        const onCalls = calls;
        return {
          before,
          offCalls,
          onCalls,
          enabled: !!window.pudding_settings.Hamilton,
          hasSolve: typeof window.remixHamiltonSolveCurrentPattern === "function",
          modErr: window.modErrors ? window.modErrors() : null,
        };
      });
      assert.equal(probe.before.exists, true, JSON.stringify(probe));
      assert.equal(probe.before.checked, false, JSON.stringify(probe));
      assert.equal(probe.offCalls, 0, JSON.stringify(probe));
      assert.equal(probe.enabled, true, JSON.stringify(probe));
      assert.ok(probe.onCalls >= 1, JSON.stringify(probe));
      assert.equal(probe.modErr, null, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });
});

describe("Hamilton + Random Ham (Ultra browser)", { skip: !runBrowser }, () => {
  it("Random Ham with Hamilton on syncs wallCoords and starts solve", async () => {
    const { launchHarness, COUNT, SIZE, ultraHarnessOpts } = await import(
      "../tools/harness.mjs"
    );
    const h = await launchHarness(
      ultraHarnessOpts({ seed: 82, headless: true })
    );
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(async () => {
        window.remixOrganizeSettings();
        window.ultraOrganizeSettings && window.ultraOrganizeSettings();
        const box = document.getElementById("HamiltonTour");
        if (box) {
          box.checked = true;
          box.dispatchEvent(new Event("change", { bubbles: true }));
        }
        window.pudding_settings.Hamilton = true;
        let solves = 0;
        const HM = window.HamiltonMod;
        if (HM && typeof HM._startSolve === "function") {
          const orig = HM._startSolve;
          HM._startSolve = function () {
            solves++;
            return orig.apply(this, arguments);
          };
        }
        document.getElementById("ultra-tab-presets").click();
        const ham = document.querySelector("#preset-panel .preset-random-ham");
        if (ham) ham.click();
        await new Promise((r) => setTimeout(r, 400));
        const solvesAfterBlit = solves;
        // Wall-mode apple spawn must not clear/re-solve the Random Ham tour.
        if (!window.wallCoords) window.wallCoords = [];
        window.wallCoords.push([2, 2]);
        if (typeof HM.notifyWallSpawn === "function") HM.notifyWallSpawn();
        return {
          solvesAfterBlit,
          solvesAfterWallSpawn: solves,
          wallCoords: (window.wallCoords || []).length,
          patternFlag: !!(HM && HM.__remixPatternSolve),
          chosen: !!(
            document.querySelector(".chosen-preset") &&
            document
              .querySelector(".chosen-preset")
              .classList.contains("preset-random-ham")
          ),
          modErr: window.modErrors ? window.modErrors() : null,
        };
      });
      assert.equal(probe.modErr, null, JSON.stringify(probe));
      assert.equal(probe.chosen, true, JSON.stringify(probe));
      assert.ok(probe.wallCoords > 0, JSON.stringify(probe));
      assert.ok(probe.solvesAfterBlit >= 1, JSON.stringify(probe));
      assert.equal(
        probe.solvesAfterWallSpawn,
        probe.solvesAfterBlit,
        JSON.stringify(probe)
      );
    } finally {
      await h.close();
    }
  });
});
