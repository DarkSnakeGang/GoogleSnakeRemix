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

describe("Ultra Animation Mod", () => {
  it("ships only in RemixUltraMod.js", () => {
    assert.equal(fs.existsSync(REMIX), true, "run splice / RemixBuilder");
    assert.equal(fs.existsSync(ULTRA), true, "run splice / RemixBuilder");
    const remix = fs.readFileSync(REMIX, "utf8");
    const ultra = fs.readFileSync(ULTRA, "utf8");

    assert.doesNotMatch(remix, /window\.AnimationMod/);
    assert.doesNotMatch(remix, /anim-mod-panel/);
    assert.doesNotMatch(remix, /animModInjectPanel/);
    assert.doesNotMatch(remix, /ANIMATED_COLOR_ALT_KEY/);

    assert.match(ultra, /window\.AnimationMod/);
    assert.match(ultra, /anim-mod-panel/);
    assert.match(ultra, /animModInjectPanel/);
    assert.match(ultra, /Animation Mod/);
    assert.match(ultra, /rollingRainbowRev/);
    assert.match(ultra, /updateAnimBackground/);
    assert.match(ultra, /animModApplyFrameRate/);
    assert.match(ultra, /AnimationMod\.alterSnakeCode/);
  });

  it("wires AnimationMod into Ultra init hooks", () => {
    const ultra = fs.readFileSync(ULTRA, "utf8");
    assert.match(ultra, /AnimationMod\.runCodeBefore/);
    assert.match(ultra, /AnimationMod\.alterSnakeCode/);
    assert.match(ultra, /AnimationMod\.runCodeAfter/);
    assert.match(ultra, /animModApplyTheme/);
  });
});

describe("Ultra Animation Mod browser", { skip: !runBrowser }, () => {
  it("Visibility shell hosts Animation column; FPS applies live", async () => {
    const { launchHarness, COUNT, SIZE, ultraHarnessOpts } = await import(
      "../tools/harness.mjs"
    );
    const h = await launchHarness(
      ultraHarnessOpts({ seed: 91, headless: true })
    );
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const r = await h.page.evaluate(() => {
        const popup = document.getElementById("delete-stuff-popup");
        const panel = document.getElementById("anim-mod-panel");
        const title = document.getElementById("anim-mod-title");
        const fps = document.getElementById("anim-frame-rate");
        const cur = document.getElementById("anim-current-frame-rate");
        const bg = document.getElementById("anim-bg-pattern");
        const snake = document.getElementById("anim-snake-pattern");

        if (popup) popup.hidden = false;

        let fpsOk = false;
        if (fps && cur) {
          fps.value = "24";
          fps.dispatchEvent(new Event("change", { bubbles: true }));
          fpsOk =
            cur.textContent === "24" &&
            window.animateSnakeGlobals.framesPerSecond === 24;
        }

        if (bg) {
          bg.value = "none";
          window.changePatterns(
            window.animateSnakeGlobals.currentPatternString,
            "none"
          );
        }
        const noneDisables =
          window.animateSnakeGlobals.isBackgroundPatternDisabled === true;

        const hasAnimatedIcon =
          typeof window.ANIMATED_COLOR_INDEX === "number" &&
          !!document.querySelector("#color")?.children[
            window.ANIMATED_COLOR_INDEX
          ];

        const patternHasNone =
          !!snake &&
          [...snake.options].some(function (o) {
            return o.value === "none";
          });

        // Force Animated colour selection (menu click is flaky headless)
        window.isRainbow = true;
        window.snakeRainbowOverride = window.ANIMATED_COLOR_ALT_KEY;
        window.animModSyncColourGate();
        const enabledWhenAnimated =
          window.animateSnakeGlobals.isPatternDisabled === false;

        window.isRainbow = false;
        window.animModSyncColourGate();
        const disabledOtherwise =
          window.animateSnakeGlobals.isPatternDisabled === true;

        return {
          popup: !!popup,
          panel: !!panel,
          title: !!(title && title.textContent.includes("Animation")),
          fpsOk,
          noneDisables,
          hasAnimatedIcon,
          patternHasNone,
          enabledWhenAnimated,
          disabledOtherwise,
          visiBoxes: !!document.getElementById("visi-boxes"),
          patched: !!window.__animModPatched,
          hasAfnHooks: typeof window.updateAnimBackground === "function",
        };
      });

      assert.equal(r.popup, true, JSON.stringify(r));
      assert.equal(r.panel, true, JSON.stringify(r));
      assert.equal(r.title, true, JSON.stringify(r));
      assert.equal(r.fpsOk, true, JSON.stringify(r));
      assert.equal(r.noneDisables, true, JSON.stringify(r));
      assert.equal(r.hasAnimatedIcon, true, JSON.stringify(r));
      assert.equal(r.patternHasNone, false, JSON.stringify(r));
      assert.equal(r.enabledWhenAnimated, true, JSON.stringify(r));
      assert.equal(r.disabledOtherwise, true, JSON.stringify(r));
      assert.equal(r.visiBoxes, true, JSON.stringify(r));
      assert.equal(r.patched, true, JSON.stringify(r));
      assert.equal(r.hasAfnHooks, true, JSON.stringify(r));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });
});
