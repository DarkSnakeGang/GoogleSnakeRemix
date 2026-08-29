import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

function read(rel) {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("Cat Mode (offline)", () => {
  it("CatInit defines CAT_MODE wiring, lives, grace, and death intercept", () => {
    const cat = read("src/CatInit.js");
    assert.match(cat, /window\.CatMod\s*=/);
    assert.match(cat, /CAT_MODE/);
    assert.match(cat, /cat_peaceful_ticks/);
    assert.match(cat, /cat_try_spend_life/);
    assert.match(cat, /cat_wrap_head_if_needed/);
    assert.match(cat, /Sc\(a\)\{if\(window\.isCatActive/);
    assert.match(cat, /i7\(this\.ka,a\)/);
    assert.match(cat, /try\{window\.cat_tick_logic\(this\);\}/);
    assert.doesNotMatch(
      cat,
      /\}tick\(\)\{window\.__remixGame=this;if\(window\.isCatActive&&window\.isCatActive\(\)\)\{try\{window\.cat_tick_logic/
    );
    assert.match(cat, /CAT_PEACEFUL_ALPHA\s*=\s*0\.75/);
    assert.match(cat, /CAT_LIFE_EVERY\s*=\s*5/);
    assert.match(cat, /CAT_MAX_LIVES\s*=\s*9/);
    assert.match(cat, /CAT_GRACE_EXTRA\s*=\s*3/);
    assert.match(cat, /Math\.ceil\(\(sh\s*\+\s*\(window\.CAT_GRACE_EXTRA/);
    assert.match(cat, /cat_try_spend_life\(this\)/);
    assert.match(cat, /b===21&&window\.isCatActive/);
    assert.match(cat, /remix-cat-lives/);
    assert.match(cat, /slotIndex:\s*3/);
    // Must not key Ta patch off bare "13m2Cr16" (false-positive in burger URL).
    assert.match(cat, /catReplace/);
    assert.doesNotMatch(
      cat,
      /if\s*\(\s*code\.indexOf\(\s*"13m2Cr16"\s*\)\s*>=\s*0\s*\)/
    );
  });

  it("RemixInit claims next blender empty and unhides Speed Info", () => {
    const remix = read("src/RemixInit.js");
    assert.match(remix, /remixEnsureBlenderCapacity/);
    assert.match(remix, /remixCompactBlenderEmpties/);
    assert.match(remix, /remixCollectBlenderEmpties/);
    assert.match(remix, /remixFitBlenderModeGrid/);
    assert.match(remix, /gridTemplateColumns\s*=\s*"repeat\(6,/);
    assert.match(remix, /window\.CatMod\.runCodeBefore/);
    assert.match(remix, /window\.CatMod\.alterSnakeCode/);
    // Speed Info must not be CSS-hidden or binned.
    assert.doesNotMatch(
      remix,
      /#AlwaysOnTimeKeeper,\s*\nlabel\[for="AlwaysOnTimeKeeper"\]/
    );
    assert.doesNotMatch(
      remix,
      /remixHideSettingsNode\(window\.remixSettingsWrap\("AlwaysOnTimeKeeper"/
    );
    assert.match(
      remix,
      /remixHideSettingsNode\(window\.remixSettingsWrap\("ShowSplitPanel"/
    );
  });

  it("builder / splice include CatInit before CatSpeed", () => {
    const builder = read("RemixBuilder.py");
    const splice = read("tools/splice_remix_bundles.cjs");
    assert.match(builder, /src\/CatInit\.js/);
    assert.match(splice, /src\/CatInit\.js/);
    const bIdx = builder.indexOf("src/CatInit.js");
    const bSpeed = builder.indexOf("src/CatSpeedInit.js");
    assert.ok(bIdx >= 0 && bSpeed > bIdx);
    const sIdx = splice.indexOf("src/CatInit.js");
    const sSpeed = splice.indexOf("src/CatSpeedInit.js");
    assert.ok(sIdx >= 0 && sSpeed > sIdx);
  });

  it("SpeedInfo registers Cat without CE mapping", () => {
    const si = read("src/RemixSpeedInfoInit.js");
    assert.match(si, /LABELS\.cat\s*=\s*"Cat"/);
    assert.match(si, /modeToTxt\[window\.CAT_MODE\]/);
    assert.match(si, /cat_blending/);
    assert.match(si, /name:\s*"Cat"/);
    // Still Chess/Burger-only for TimeKeeper / SRC data.
    assert.match(si, /remixChessBurgerTimeKeeperActive/);
    assert.doesNotMatch(si, /isCatActive.*remixSpeedInfoAllowed/);
  });

  it("life banking is incremental every 5 apples (spend sticks)", () => {
    const cat = read("src/CatInit.js");
    assert.match(cat, /sh\s*%\s*every\s*===\s*0/);
    assert.match(cat, /cat_lives\s*=\s*Math\.min\(max,\s*\(window\.cat_lives\s*\|\s*0\)\s*\+\s*1\)/);
    assert.doesNotMatch(cat, /Math\.floor\(sh\s*\/\s*every\)/);
  });
});

describe("Cat Mode (browser)", { skip: !runBrowser }, () => {
  it("banks lives, spends into grace with alpha, then dies at 0", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 42, headless: true });
    try {
      await h.start({ mode: "cat", count: COUNT.ONE, size: SIZE.NORMAL });

      const setup = await h.page.evaluate(() => {
        return {
          catMode: window.CAT_MODE,
          active: window.isCatActive && window.isCatActive(),
          lives: window.cat_lives,
          grace: window.cat_peaceful_ticks,
          icon: !!(window.CAT_ICON || window.CAT_SPEED_ICON),
        };
      });
      assert.equal(typeof setup.catMode, "number", JSON.stringify(setup));
      assert.equal(setup.active, true, JSON.stringify(setup));
      assert.equal(setup.lives, 0);
      assert.equal(setup.grace, 0);
      assert.equal(setup.icon, true);

      // Simulate 5 apples → 1 life.
      const after5 = await h.page.evaluate(() => {
        const g = window.__remixGame;
        for (let i = 0; i < 5; i++) {
          g.Sh = (g.Sh | 0) + 1;
          window.cat_on_apple_eaten(g);
        }
        return { lives: window.cat_lives, sh: g.Sh };
      });
      assert.equal(after5.lives, 1, JSON.stringify(after5));

      const spent = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const cancelled = window.cat_try_spend_life(g);
        return {
          cancelled,
          lives: window.cat_lives,
          grace: window.cat_peaceful_ticks,
          expectedGrace: Math.ceil(
            ((g.Sh | 0) + (window.CAT_GRACE_EXTRA | 3)) / 2
          ),
        };
      });
      assert.equal(spent.cancelled, true, JSON.stringify(spent));
      assert.equal(spent.lives, 0);
      assert.equal(spent.grace, spent.expectedGrace);
      assert.ok(spent.grace >= 2);

      // During grace, another fatal hit is ignored without spending.
      const duringGrace = await h.page.evaluate(() => {
        const cancelled = window.cat_try_spend_life(window.__remixGame);
        return {
          cancelled,
          lives: window.cat_lives,
          grace: window.cat_peaceful_ticks,
        };
      });
      assert.equal(duringGrace.cancelled, true);
      assert.equal(duringGrace.lives, 0);

      // Expire grace, then fatal with 0 lives → death allowed.
      const noLives = await h.page.evaluate(() => {
        window.cat_peaceful_ticks = 0;
        const cancelled = window.cat_try_spend_life(window.__remixGame);
        return { cancelled, lives: window.cat_lives };
      });
      assert.equal(noLives.cancelled, false, JSON.stringify(noLives));

      // Reset clears state.
      const reset = await h.page.evaluate(() => {
        window.cat_lives = 3;
        window.cat_peaceful_ticks = 9;
        window.cat_reset_state();
        return {
          lives: window.cat_lives,
          grace: window.cat_peaceful_ticks,
        };
      });
      assert.equal(reset.lives, 0);
      assert.equal(reset.grace, 0);

      assert.deepEqual(
        h.modErrors().filter((e) => !/CatMod: failed to find/.test(e.text)),
        [],
        "no unexpected mod errors"
      );
    } finally {
      await h.close();
    }
  });

  it("border hit spends a life and wraps same tick like Peaceful", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 44, headless: true });
    try {
      await h.start({ mode: "cat", count: COUNT.ONE, size: SIZE.NORMAL });

      const probe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.cat_lives = 1;
        window.cat_peaceful_ticks = 0;
        const snake = g.oa.ka;
        for (let i = 0; i < snake.length; i++) {
          snake[i].x = 1;
          snake[i].y = 7;
        }
        g.oa.direction = "LEFT";
        g.nj = false;
        const w = g.Ca.wa[0].length;

        g.tick(); // 1 → 0
        const atEdge = { x: g.oa.ka[0].x, y: g.oa.ka[0].y };
        g.tick(); // should wrap to w-1, not sit at -1
        const after = {
          x: g.oa.ka[0].x,
          y: g.oa.ka[0].y,
          lives: window.cat_lives,
          grace: window.cat_peaceful_ticks,
          dead: !!g.nj,
          width: w,
        };
        return { atEdge, after };
      });

      assert.equal(probe.atEdge.x, 0, JSON.stringify(probe));
      assert.equal(probe.after.x, probe.after.width - 1, JSON.stringify(probe));
      assert.equal(probe.after.y, 7, JSON.stringify(probe));
      assert.equal(probe.after.lives, 0, JSON.stringify(probe));
      assert.ok(probe.after.grace > 0, JSON.stringify(probe));
      assert.equal(probe.after.dead, false, JSON.stringify(probe));

      assert.deepEqual(
        h.modErrors().filter((e) => !/CatMod: failed to find/.test(e.text)),
        [],
        "no unexpected mod errors"
      );
    } finally {
      await h.close();
    }
  });

  it("lives HUD hides when Cat mode is not active", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 46, headless: true });
    try {
      await h.start({ mode: "cat", count: COUNT.ONE, size: SIZE.NORMAL });
      const onCat = await h.page.evaluate(() => {
        window.cat_lives = 2;
        window.catUpdateLivesHud();
        const hud = document.getElementById("remix-cat-lives");
        return {
          display: hud && hud.style.display,
          active: window.isCatActive(),
        };
      });
      assert.equal(onCat.active, true, JSON.stringify(onCat));
      assert.equal(onCat.display, "flex", JSON.stringify(onCat));

      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const offCat = await h.page.evaluate(() => {
        // Tick path should refresh HUD; call once in case of race.
        window.catUpdateLivesHud && window.catUpdateLivesHud();
        const hud = document.getElementById("remix-cat-lives");
        return {
          display: hud && hud.style.display,
          active: window.isCatActive && window.isCatActive(),
          mode: window.CurrentModeNum,
        };
      });
      assert.equal(offCat.active, false, JSON.stringify(offCat));
      assert.equal(offCat.display, "none", JSON.stringify(offCat));
    } finally {
      await h.close();
    }
  });

  it("blender has Cat toggle flush after Burger; Speed Info visible", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 43, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });

      const ui = await h.page.evaluate(() => {
        if (typeof window.remixCompactBlenderEmpties === "function") {
          window.remixCompactBlenderEmpties(0);
        }
        window.add_cat_blender_toggle && window.add_cat_blender_toggle();
        window.add_mexico_blender_toggle && window.add_mexico_blender_toggle();
        if (typeof window.remixCompactBlenderEmpties === "function") {
          window.remixCompactBlenderEmpties(0);
        }
        const panel = document.querySelector(".PWIidc");
        const cells = panel ? [...panel.children] : [];
        const idOf = (id) =>
          cells.findIndex((c) => {
            const inner = c.querySelector(":scope > .vuOknd");
            return inner && inner.id === id;
          });
        const emptyCount = panel
          ? panel.querySelectorAll(".vuOknd.oBBKec").length
          : -1;
        const cb = document.getElementById("AlwaysOnTimeKeeper");
        const wrap =
          cb &&
          (cb.closest(".form-check") ||
            cb.closest(".form-check-inline") ||
            cb.parentElement);
        const wrapDisplay = wrap ? getComputedStyle(wrap).display : null;
        const cbDisplay = cb ? getComputedStyle(cb).display : null;
        const inBin = !!(cb && cb.closest("#ultra-settings-hidden"));
        return {
          hasPanel: !!panel,
          candy: idOf("remix-candy-blend"),
          chess: idOf("remix-chess-blend"),
          burger: idOf("remix-burger-blend"),
          cat: idOf("remix-cat-blend"),
          mexico: idOf("remix-mexico-blend"),
          emptyCount,
          hasCb: !!cb,
          wrapDisplay,
          cbDisplay,
          inBin,
          grid: panel && (panel.style.gridTemplateColumns || ""),
        };
      });
      assert.equal(ui.hasPanel, true, JSON.stringify(ui));
      assert.ok(ui.candy > 0, JSON.stringify(ui));
      assert.equal(ui.chess, ui.candy + 1, JSON.stringify(ui));
      assert.equal(ui.burger, ui.chess + 1, JSON.stringify(ui));
      assert.equal(ui.cat, ui.burger + 1, JSON.stringify(ui));
      assert.equal(ui.mexico, ui.cat + 1, JSON.stringify(ui));
      assert.equal(ui.emptyCount, 0, JSON.stringify(ui));
      assert.equal(ui.hasCb, true, JSON.stringify(ui));
      assert.equal(ui.inBin, false, JSON.stringify(ui));
      assert.notEqual(ui.wrapDisplay, "none", JSON.stringify(ui));
      assert.notEqual(ui.cbDisplay, "none", JSON.stringify(ui));
      // 6 columns so Cat/Mexico fit in the stock viewport (no scroll / clip).
      assert.match(ui.grid || "", /repeat\(6/, JSON.stringify(ui));

      assert.deepEqual(
        h.modErrors().filter((e) => !/CatMod: failed to find/.test(e.text)),
        [],
        "no unexpected mod errors"
      );
    } finally {
      await h.close();
    }
  });
});
