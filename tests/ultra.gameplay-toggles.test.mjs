import { describe, it } from "node:test";
import assert from "node:assert/strict";

const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("Ultra gameplay toggles (browser)", { skip: !runBrowser }, () => {
  async function launchUltra(seed) {
    const { launchHarness, ultraHarnessOpts } = await import(
      "../tools/harness.mjs"
    );
    return launchHarness(ultraHarnessOpts({ seed, headless: true }));
  }

  it("Play tab has three spawn toggles, default off", async () => {
    const h = await launchUltra(81);
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        window.ultraOrganizeSettings();
        const playTab = document.getElementById("ultra-settings-tab-play");
        if (playTab) playTab.click();
        const ids = [
          "UltraShieldedFruitSpawn",
          "UltraWallModeSpawn",
          "UltraArrowTurnSpawn",
        ];
        const items = ids.map((id) => {
          const el = document.getElementById(id);
          const label = el && document.querySelector(`label[for="${id}"]`);
          const wrap = el && el.closest(".form-check");
          const cs = wrap && getComputedStyle(wrap);
          return {
            id,
            has: !!el,
            checked: !!(el && el.checked),
            label: label && String(label.textContent || "").trim(),
            display: cs && cs.display,
          };
        });
        const every = document.getElementById("WallEveryApple");
        const everyLabel =
          every && document.querySelector('label[for="WallEveryApple"]');
        const wallWrap = document.getElementById("UltraWallModeSpawn") &&
          document.getElementById("UltraWallModeSpawn").closest(".form-check");
        const everyWrap = every && every.closest(".form-check");
        return {
          items,
          everyApple: {
            has: !!every,
            checked: !!(every && every.checked),
            disabled: !!(every && every.disabled),
            label: everyLabel && String(everyLabel.textContent || "").trim(),
            afterWallSpawn: !!(
              wallWrap &&
              everyWrap &&
              wallWrap.nextElementSibling === everyWrap
            ),
          },
          settings: {
            shields: window.pudding_settings.UltraShieldedFruitSpawn,
            walls: window.pudding_settings.UltraWallModeSpawn,
            arrows: window.pudding_settings.UltraArrowTurnSpawn,
            everyApple: window.pudding_settings.WallEveryApple,
          },
          disableWallMode: !!window.disableWallMode,
          shouldShields: window.ultraShouldSpawnFruitShields(),
          blockArrows: window.ultraBlockNativeArrowTurns(),
          shouldEvery: window.remixShouldSpawnWallEveryApple(),
        };
      });
      assert.deepEqual(
        probe.items.map((x) => x.has),
        [true, true, true],
        JSON.stringify(probe)
      );
      assert.deepEqual(
        probe.items.map((x) => x.checked),
        [false, false, false],
        JSON.stringify(probe)
      );
      assert.equal(probe.items[0].label, "Spawn fruit with shields");
      assert.equal(probe.items[1].label, "Walls spawn in wall mode");
      assert.equal(probe.items[2].label, "Arrows spawn on turns");
      for (const item of probe.items) {
        assert.notEqual(item.display, "none", JSON.stringify(item));
      }
      assert.equal(probe.settings.shields, false, JSON.stringify(probe));
      assert.equal(probe.settings.walls, false, JSON.stringify(probe));
      assert.equal(probe.settings.arrows, false, JSON.stringify(probe));
      assert.equal(probe.settings.everyApple, false, JSON.stringify(probe));
      assert.equal(probe.disableWallMode, true, JSON.stringify(probe));
      assert.equal(probe.shouldShields, false, JSON.stringify(probe));
      assert.equal(probe.blockArrows, true, JSON.stringify(probe));
      assert.equal(probe.shouldEvery, false, JSON.stringify(probe));
      assert.equal(probe.everyApple.has, true, JSON.stringify(probe));
      assert.equal(probe.everyApple.checked, false, JSON.stringify(probe));
      assert.equal(probe.everyApple.disabled, true, JSON.stringify(probe));
      assert.equal(
        probe.everyApple.label,
        "Walls spawn every apple",
        JSON.stringify(probe)
      );
      assert.equal(probe.everyApple.afterWallSpawn, true, JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("shield-mode fruit get nba only when the shield-spawn toggle is on", async () => {
    const h = await launchUltra(82);
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        function nbaSize(a) {
          if (!a || !a.nba) return 0;
          return typeof a.nba.size === "number" ? a.nba.size : 1;
        }
        function fruitShields() {
          return (g.wa.ka || [])
            .filter((a) => a && !a.isPiece)
            .map((a) => nbaSize(a));
        }
        function startShield() {
          g.settings.ub = 15;
          g.settings.ob = 15;
          window.CurrentModeNum = 15;
          g.wa.reset();
          return fruitShields();
        }
        function eatSpawn() {
          const apples = g.wa.ka;
          if (!apples.length) return { ok: false, reason: "no apples" };
          const head = g.oa.ka[0];
          const dir = g.oa.direction || "RIGHT";
          const next = { x: head.x, y: head.y };
          if (dir === "RIGHT") next.x += 1;
          else if (dir === "LEFT") next.x -= 1;
          else if (dir === "UP") next.y -= 1;
          else next.y += 1;
          const beforeKeys = new Set(
            apples.map((a) => a.pos.x + "," + a.pos.y)
          );
          apples[0].pos.x = next.x;
          apples[0].pos.y = next.y;
          apples[0].nba = undefined;
          window.ultraInstallFruitShieldSpawnGate();
          g.tick();
          window.ultraStripUnwantedFruitShields(g.wa.ka);
          const fresh = (g.wa.ka || []).filter(
            (a) => a && !beforeKeys.has(a.pos.x + "," + a.pos.y)
          );
          return {
            ok: true,
            added: fresh.length,
            shields: fresh.filter((a) => !a.isPiece).map((a) => nbaSize(a)),
          };
        }

        window.pudding_settings.UltraShieldedFruitSpawn = false;
        window.ultraEnsureGameplayToggles();
        if (typeof window.ultraInstallFruitShieldSpawnGate === "function") {
          window.ultraInstallFruitShieldSpawnGate();
        }
        const offReset = startShield();
        const offSpawn = eatSpawn();

        window.pudding_settings.UltraShieldedFruitSpawn = true;
        const onReset = startShield();
        const onSpawn = eatSpawn();

        const box = document.getElementById("UltraShieldedFruitSpawn");
        if (box) {
          box.checked = false;
          box.dispatchEvent(new Event("change"));
        }
        return {
          offReset,
          offSpawn,
          onReset,
          onSpawn,
          afterUncheck: window.pudding_settings.UltraShieldedFruitSpawn,
        };
      });
      assert.ok(
        probe.offReset.every((n) => n === 0),
        "default reset should not shield fruit " + JSON.stringify(probe)
      );
      assert.ok(probe.offSpawn.ok, JSON.stringify(probe.offSpawn));
      assert.ok(
        probe.offSpawn.shields.every((n) => n === 0),
        "default spawn should not shield fruit " + JSON.stringify(probe)
      );
      assert.ok(
        probe.onReset.some((n) => n > 0),
        "toggle on should shield reset fruit " + JSON.stringify(probe)
      );
      assert.ok(probe.onSpawn.ok, JSON.stringify(probe.onSpawn));
      if (probe.onSpawn.added > 0) {
        assert.ok(
          probe.onSpawn.shields.some((n) => n > 0),
          "toggle on should shield spawned fruit " + JSON.stringify(probe)
        );
      }
      assert.equal(probe.afterUncheck, false, JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("chess fruit spawn stays unshielded unless the shield-spawn toggle is on", async () => {
    const h = await launchUltra(83);
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        function nbaSize(a) {
          if (!a || !a.nba) return 0;
          return typeof a.nba.size === "number" ? a.nba.size : 1;
        }
        function eatFruit() {
          const apples = g.wa.ka;
          if (!apples.length) return { ok: false, reason: "no apples" };
          const head = g.oa.ka[0];
          const dir = g.oa.direction || "RIGHT";
          const next = { x: head.x, y: head.y };
          if (dir === "RIGHT") next.x += 1;
          else if (dir === "LEFT") next.x -= 1;
          else if (dir === "UP") next.y -= 1;
          else next.y += 1;
          const beforeKeys = new Set(
            apples.map((a) => a.pos.x + "," + a.pos.y)
          );
          const target = apples[0];
          target.pos.x = next.x;
          target.pos.y = next.y;
          target.isPiece = false;
          target.type = 0;
          target.nba = undefined;
          window.head_state = "OPEN";
          window.shield_empty_all && window.shield_empty_all();
          g.tick();
          const fresh = (g.wa.ka || []).filter(
            (a) => a && !beforeKeys.has(a.pos.x + "," + a.pos.y)
          );
          return {
            ok: true,
            added: fresh.length,
            fruit: fresh
              .filter((a) => !a.isPiece)
              .map((a) => nbaSize(a)),
            pieces: fresh.filter((a) => a.isPiece).map((a) => nbaSize(a)),
          };
        }
        window.pudding_settings.UltraShieldedFruitSpawn = false;
        const off = eatFruit();
        window.pudding_settings.UltraShieldedFruitSpawn = true;
        g.wa.reset();
        window.head_state = "OPEN";
        window.shield_empty_all && window.shield_empty_all();
        const on = eatFruit();
        return { off, on };
      });
      assert.ok(probe.off.ok && probe.off.added > 0, JSON.stringify(probe));
      assert.ok(
        probe.off.fruit.every((n) => n === 0),
        "chess fruit should not inherit shield-mode nba " + JSON.stringify(probe)
      );
      assert.ok(probe.on.ok && probe.on.added > 0, JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("wall mode does not spawn walls unless the wall-spawn toggle is on", async () => {
    const h = await launchUltra(84);
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        function wallCount() {
          const size = eval("window.wholeSnakeObject." + window.boardDimensions);
          let n = 0;
          for (let y = 0; y < size.height; y++) {
            for (let x = 0; x < size.width; x++) {
              if (window.checkWall(x, y)) n++;
            }
          }
          return n;
        }
        function reviveCenter() {
          g.nj = false;
          const snake = g.oa.ka;
          for (let i = 0; i < snake.length; i++) {
            snake[i].x = 8;
            snake[i].y = 10;
          }
          g.oa.direction = "RIGHT";
        }
        function startWall() {
          g.settings.ub = 1;
          g.settings.ob = 1;
          window.CurrentModeNum = 1;
          if (typeof window.ensureGameMode === "function") window.ensureGameMode(1);
          g.wa.reset();
          reviveCenter();
        }
        function eatAhead() {
          const apples = g.wa.ka;
          if (!apples.length) return;
          const head = g.oa.ka[0];
          apples[0].pos.x = head.x + 1;
          apples[0].pos.y = head.y;
        }
        function tickSafe(n) {
          for (let i = 0; i < n; i++) {
            if (g.nj) break;
            g.tick();
          }
        }

        window.pudding_settings.UltraWallModeSpawn = false;
        window.ultraEnsureGameplayToggles();
        const disableOff = !!window.disableWallMode;
        startWall();
        const offBefore = wallCount();
        eatAhead();
        tickSafe(20);
        const offAfter = wallCount();
        const deadOff = !!g.nj;

        window.pudding_settings.UltraWallModeSpawn = true;
        window.ultraEnsureGameplayToggles();
        const disableOn = !!window.disableWallMode;
        startWall();
        const onBefore = wallCount();
        for (let n = 0; n < 4; n++) {
          reviveCenter();
          eatAhead();
          tickSafe(8);
        }
        const onAfter = wallCount();
        const deadOn = !!g.nj;

        window.pudding_settings.UltraWallModeSpawn = false;
        window.ultraEnsureGameplayToggles();
        const placed = typeof window.placeWall === "function";
        if (placed) window.placeWall(3, 3);
        const afterPlace = window.checkWall(3, 3);
        return {
          disableOff,
          offBefore,
          offAfter,
          deadOff,
          disableOn,
          onBefore,
          onAfter,
          deadOn,
          placed,
          afterPlace,
        };
      });
      assert.equal(probe.disableOff, true, JSON.stringify(probe));
      assert.equal(probe.disableOn, false, JSON.stringify(probe));
      assert.equal(probe.afterPlace, true, "placeWall still works " + JSON.stringify(probe));
      assert.equal(probe.offAfter, probe.offBefore, JSON.stringify(probe));
      assert.ok(
        probe.onAfter > probe.onBefore,
        "wall mode should spawn walls when toggle is on " + JSON.stringify(probe)
      );
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("every-apple wall toggle is disabled until wall spawning is on", async () => {
    const h = await launchUltra(86);
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        window.ultraOrganizeSettings();
        const playTab = document.getElementById("ultra-settings-tab-play");
        if (playTab) playTab.click();
        const every = document.getElementById("WallEveryApple");
        const spawn = document.getElementById("UltraWallModeSpawn");
        const off = {
          spawn: !!(spawn && spawn.checked),
          everyDisabled: !!(every && every.disabled),
          should: window.remixShouldSpawnWallEveryApple(),
        };
        spawn.checked = true;
        spawn.dispatchEvent(new Event("change"));
        const on = {
          spawn: !!(spawn && spawn.checked),
          everyDisabled: !!(every && every.disabled),
          disableWallMode: !!window.disableWallMode,
          shouldOff: window.remixShouldSpawnWallEveryApple(),
        };
        every.checked = true;
        every.dispatchEvent(new Event("change"));
        const everyOn = {
          checked: !!every.checked,
          setting: !!window.pudding_settings.WallEveryApple,
          should: window.remixShouldSpawnWallEveryApple(),
          disabled: !!every.disabled,
        };
        spawn.checked = false;
        spawn.dispatchEvent(new Event("change"));
        const spawnOffAgain = {
          everyDisabled: !!every.disabled,
          everyChecked: !!every.checked,
          setting: !!window.pudding_settings.WallEveryApple,
          should: window.remixShouldSpawnWallEveryApple(),
          disableWallMode: !!window.disableWallMode,
        };
        return { off, on, everyOn, spawnOffAgain };
      });
      assert.equal(probe.off.spawn, false, JSON.stringify(probe));
      assert.equal(probe.off.everyDisabled, true, JSON.stringify(probe));
      assert.equal(probe.off.should, false, JSON.stringify(probe));
      assert.equal(probe.on.spawn, true, JSON.stringify(probe));
      assert.equal(probe.on.everyDisabled, false, JSON.stringify(probe));
      assert.equal(probe.on.disableWallMode, false, JSON.stringify(probe));
      assert.equal(probe.on.shouldOff, false, JSON.stringify(probe));
      assert.equal(probe.everyOn.checked, true, JSON.stringify(probe));
      assert.equal(probe.everyOn.setting, true, JSON.stringify(probe));
      assert.equal(probe.everyOn.should, true, JSON.stringify(probe));
      assert.equal(probe.everyOn.disabled, false, JSON.stringify(probe));
      assert.equal(probe.spawnOffAgain.everyDisabled, true, JSON.stringify(probe));
      assert.equal(probe.spawnOffAgain.everyChecked, true, JSON.stringify(probe));
      assert.equal(probe.spawnOffAgain.setting, true, JSON.stringify(probe));
      assert.equal(probe.spawnOffAgain.should, false, JSON.stringify(probe));
      assert.equal(probe.spawnOffAgain.disableWallMode, true, JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("wall mode spawns a wall every apple when that toggle is on", async () => {
    const h = await launchUltra(87);
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.LARGE });
      const probe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        function wallCount() {
          const size = eval("window.wholeSnakeObject." + window.boardDimensions);
          let n = 0;
          for (let y = 0; y < size.height; y++) {
            for (let x = 0; x < size.width; x++) {
              if (window.checkWall(x, y)) n++;
            }
          }
          return n;
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
          if (typeof window.ensureGameMode === "function") window.ensureGameMode(1);
          g.wa.reset();
          if (typeof window.emptyWalls === "function") window.emptyWalls();
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
          window.pudding_settings.UltraWallModeSpawn = true;
          window.pudding_settings.WallEveryApple = !!everyApple;
          window.ultraEnsureGameplayToggles();
          window.remixEnsureWallEveryAppleSetting();
          startWall();
          const before = wallCount();
          const ate = [eatOne(), eatOne()];
          return {
            everyApple: window.remixShouldSpawnWallEveryApple(),
            ate,
            delta: wallCount() - before,
            dead: !!g.nj,
          };
        }
        return {
          off: eatTwo(false),
          on: eatTwo(true),
        };
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

  it("arrow turns do not paint arrows unless the arrow-spawn toggle is on", async () => {
    const h = await launchUltra(85);
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.LARGE });
      const setup = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.pudding_settings.UltraArrowTurnSpawn = false;
        window.ultraEnsureGameplayToggles();
        g.settings.ub = 16;
        g.settings.ob = 16;
        window.CurrentModeNum = 16;
        if (typeof window.ensureGameMode === "function") window.ensureGameMode(16);
        g.wa.reset();
        if (typeof window.emptyArrows === "function") window.emptyArrows();
        const snake = g.oa.ka;
        for (let i = 0; i < snake.length; i++) {
          snake[i].x = 4;
          snake[i].y = 8;
        }
        g.oa.direction = "RIGHT";
        return {
          blockOff: window.ultraBlockNativeArrowTurns(),
          addArrow: window.ultraPlaceNames && window.ultraPlaceNames.addArrow,
        };
      });
      await h.dir("RIGHT");
      await h.tick(3);
      await h.dir("UP");
      await h.tick(3);
      const offTurns = await h.page.evaluate(() => {
        const arrows = window.ultraArrowManager && window.ultraArrowManager();
        const out = [];
        if (!arrows || !arrows.ka) return out;
        for (let y = 0; y < arrows.ka.length; y++) {
          for (let x = 0; x < (arrows.ka[y] || []).length; x++) {
            const c = arrows.ka[y][x];
            const d = c && c.direction;
            if (d && d !== "NONE") out.push({ x, y, d, Lh: c.Lh });
          }
        }
        window.placeArrow(3, 3, "LEFT");
        const cell = arrows.ka[3] && arrows.ka[3][3];
        return { turns: out, placed: cell && cell.direction };
      });

      await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.pudding_settings.UltraArrowTurnSpawn = true;
        window.ultraEnsureGameplayToggles();
        g.nj = false;
        g.settings.ub = 16;
        g.settings.ob = 16;
        window.CurrentModeNum = 16;
        if (typeof window.ensureGameMode === "function") window.ensureGameMode(16);
        g.wa.reset();
        if (typeof window.emptyArrows === "function") window.emptyArrows();
        const snake = g.oa.ka;
        for (let i = 0; i < snake.length; i++) {
          snake[i].x = 4;
          snake[i].y = 8;
        }
        g.oa.direction = "RIGHT";
      });
      await h.dir("RIGHT");
      await h.tick(3);
      await h.dir("UP");
      await h.tick(3);
      const onProbe = await h.page.evaluate(() => {
        const arrows = window.ultraArrowManager && window.ultraArrowManager();
        const out = [];
        if (arrows && arrows.ka) {
          for (let y = 0; y < arrows.ka.length; y++) {
            for (let x = 0; x < (arrows.ka[y] || []).length; x++) {
              const c = arrows.ka[y][x];
              const d = c && c.direction;
              if (d && d !== "NONE") out.push({ x, y, d, Lh: c.Lh });
            }
          }
        }
        const addName = window.ultraPlaceNames && window.ultraPlaceNames.addArrow;
        const addFn = addName && window[addName];
        const addSrc =
          typeof addFn === "function"
            ? Function.prototype.toString.call(addFn)
            : "";
        return {
          blockOn: window.ultraBlockNativeArrowTurns(),
          turns: out,
          addHasGate: addSrc.includes("ultraBlockNativeArrowTurns"),
        };
      });
      assert.equal(setup.blockOff, true, JSON.stringify(setup));
      assert.equal(offTurns.turns.length, 0, JSON.stringify(offTurns));
      assert.equal(offTurns.placed, "LEFT", JSON.stringify(offTurns));
      assert.equal(onProbe.blockOn, false, JSON.stringify(onProbe));
      assert.ok(
        onProbe.turns.length > 0,
        "turns should paint arrows when toggle is on " + JSON.stringify(onProbe)
      );
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });
});
