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

describe("Mexico Mode (offline)", () => {
  it("MexicoInit defines portal force, half-spawn, one-shot mid wall, win helper", () => {
    const mx = read("src/MexicoInit.js");
    assert.match(mx, /window\.MexicoMod\s*=/);
    assert.match(mx, /MEXICO_MODE/);
    assert.match(mx, /data:image\/png;base64,/);
    assert.match(mx, /isMexicoActive/);
    assert.match(mx, /mexico_trigger_win/);
    assert.match(mx, /mexico_place_mid_walls/);
    assert.match(mx, /mexico_find_spawn/);
    assert.match(mx, /mexico_constrain_new_apples/);
    assert.match(mx, /mexico_pos_on_wall/);
    assert.match(mx, /mexico_win_if_empty/);
    assert.match(mx, /mexico_drop_pair_at/);
    assert.match(mx, /mexico_is_wave_count/);
    assert.match(mx, /mexico_refill_wave/);
    assert.match(mx, /mexico_spawn_n_pairs/);
    assert.match(
      mx,
      /else if\(window\.isMexicoActive&&window\.isMexicoActive\(\)\)\{e=!1;if\(window\.just_ate==='fruit'/
    );
    assert.match(mx, /mexico_is_wave_count&&window\.mexico_is_wave_count\(a\)/);
    assert.match(mx, /j4E\(a\.wa,k,d,a\.Vm\.bind\(a\)\),window\.isMexicoActive/);
    assert.match(mx, /mexico_refill_wave&&window\.mexico_refill_wave/);
    assert.match(mx, /__mexicoWallDone/);
    assert.match(mx, /Math\.floor\(\(h\s*\|\s*0\)\s*\/\s*2\)/);
    assert.match(mx, /b===2&&window\.isMexicoActive/);
    assert.match(mx, /b===1&&window\.isMexicoActive/);
    assert.match(mx, /if\(!r&&b===1&&window\.isMexicoActive/);
    assert.doesNotMatch(mx, /if\(r&&b===1&&window\.isMexicoActive/);
    assert.match(mx, /slotIndex:\s*4/);
    assert.doesNotMatch(mx, /remixEnsureBlenderCapacity\(7\)/);
    assert.match(mx, /mexicoReplace/);
    assert.doesNotMatch(mx, /ensureGameMode\s*\(\s*1\s*\)/);
    assert.doesNotMatch(mx, /placeWall/);
  });

  it("mexico_refill_wave plants tally pairs instead of winning on empty", async () => {
    const vm = await import("node:vm");
    const src = read("src/MexicoInit.js");
    const sandbox = {
      window: {
        console,
        document: {
          querySelector: () => null,
          getElementById: () => null,
        },
        Image: class {
          constructor() {
            this.src = "";
            this.classList = { add() {} };
          }
        },
      },
      console,
      document: {
        querySelector: () => null,
        getElementById: () => null,
      },
      Image: class {
        constructor() {
          this.src = "";
          this.classList = { add() {} };
        }
      },
      g7: null,
      d4E: null,
      Q3E: null,
    };
    vm.createContext(sandbox);
    // Runtime helpers are registered inside alterSnakeCode (before patches).
    vm.runInContext(
      src +
        `
      window.MexicoMod.runCodeBefore();
      String.prototype.assertReplace = function(re, rep) {
        return this.replace(re, rep);
      };
      window.MexicoMod.alterSnakeCode("/* mexico stub */");
    `,
      sandbox
    );
    const w = sandbox.window;
    assert.equal(typeof w.mexico_is_wave_count, "function");
    assert.equal(typeof w.mexico_refill_wave, "function");
    const g = {
      settings: { ka: 6 },
      kc: false,
      nj: false,
      lj: false,
      Sh: 5,
      Ca: {
        wa: Array.from({ length: 9 }, () => Array(9).fill(0)),
        Aa: { set() {} },
      },
      oa: { ka: [{ x: 4, y: 4 }] },
      wa: { ka: [], oa: null },
    };
    g.wa.oa = g.oa;
    w.__remixGame = g;
    w.isMexicoActive = () => true;
    let seq = 0;
    sandbox.g7 = () => ({
      pos: {
        x: 0,
        y: 0,
        clone() {
          return { x: this.x, y: this.y };
        },
      },
      type: seq++,
    });
    sandbox.Q3E = () => 0;
    let calls = 0;
    w.mexico_find_spawn = function (_b, _f, _o, half) {
      calls++;
      const y = half === "top" ? 1 : 7;
      return {
        x: calls,
        y: y,
        clone() {
          return { x: this.x, y: this.y };
        },
      };
    };
    const added = w.mexico_refill_wave(g.wa, g);
    assert.equal(added, 10, "5 portal pairs");
    assert.equal(g.wa.ka.length, 10);
    assert.equal(g.nj, false, "must not win when refill succeeds");
    assert.equal(g.wa.wa, 1);
    const seqs = [...new Set(g.wa.ka.map((f) => f.sequenceNumber))].sort(
      (a, b) => a - b
    );
    assert.deepEqual(seqs, [1, 2, 3, 4, 5]);
  });

  it("RemixInit / UltraInit wire Mexico after Cat", () => {
    const remix = read("src/RemixInit.js");
    const ultra = read("src/UltraInit.js");
    assert.match(remix, /window\.MexicoMod\.runCodeBefore/);
    assert.match(remix, /window\.MexicoMod\.alterSnakeCode/);
    assert.match(remix, /window\.MexicoMod\.runCodeAfter/);
    assert.match(remix, /remixEnsureBlenderCapacity/);
    assert.match(remix, /remixCompactBlenderEmpties/);
    assert.match(ultra, /window\.MexicoMod\.alterSnakeCode/);
    assert.match(ultra, /window\.MexicoMod\.runCodeAfter/);
    const catAlter = remix.indexOf("window.CatMod.alterSnakeCode");
    const mxAlter = remix.indexOf("window.MexicoMod.alterSnakeCode");
    assert.ok(catAlter >= 0 && mxAlter > catAlter);
  });

  it("builder / splice include MexicoInit after Cat, before CatSpeed", () => {
    const builder = read("RemixBuilder.py");
    const splice = read("tools/splice_remix_bundles.cjs");
    for (const src of [builder, splice]) {
      const cat = src.indexOf("src/CatInit.js");
      const mexico = src.indexOf("src/MexicoInit.js");
      const speed = src.indexOf("src/CatSpeedInit.js");
      assert.ok(cat >= 0 && mexico > cat && speed > mexico, "order Cat→Mexico→CatSpeed");
    }
  });

  it("SpeedInfo registers Mexico for TimeKeeper / SpeedInfo", () => {
    const si = read("src/RemixSpeedInfoInit.js");
    assert.match(si, /LABELS\.mexico\s*=\s*"Mexico"/);
    assert.match(si, /modeToTxt\[window\.MEXICO_MODE\]/);
    assert.match(si, /mexico_blending/);
    assert.match(si, /name:\s*"Mexico"/);
    assert.match(si, /isMexicoActive/);
    assert.match(si, /remixCustomModeTimeKeeperActive/);
  });

  it("built bundles include MexicoMod after splice", () => {
    const remix = read("RemixMod.js");
    assert.match(remix, /window\.MexicoMod\s*=/);
    assert.match(remix, /mexico_place_mid_walls/);
    assert.match(remix, /MEXICO_ICON/);
  });
});

describe("Mexico Mode (browser)", { skip: !runBrowser }, () => {
  it("starts top+bottom pair, one-shot mid walls, no extra walls, win on fail, reset", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 42, headless: true });
    try {
      await h.start({ mode: "mexico", count: COUNT.ONE, size: SIZE.NORMAL });

      const setup = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const mid = window.mexico_mid_y(g.Ca);
        const apples = (g.wa.ka || []).map((a) => ({
          x: a.pos.x,
          y: a.pos.y,
        }));
        // e7 is closed over in game code — probe via forced portal helpers.
        return {
          mexicoMode: window.MEXICO_MODE,
          active: window.isMexicoActive && window.isMexicoActive(),
          icon: !!window.MEXICO_ICON,
          mid,
          apples,
          wallDone: !!window.__mexicoWallDone,
          walls:
            g.Ca && g.Ca.Aa && typeof g.Ca.Aa.size === "number"
              ? g.Ca.Aa.size
              : -1,
        };
      });
      assert.equal(typeof setup.mexicoMode, "number", JSON.stringify(setup));
      assert.equal(setup.active, true, JSON.stringify(setup));
      assert.equal(setup.icon, true);
      assert.equal(setup.apples.length, 2, JSON.stringify(setup));
      const tops = setup.apples.filter((a) => a.y < setup.mid);
      const bots = setup.apples.filter((a) => a.y > setup.mid);
      assert.equal(tops.length, 1, JSON.stringify(setup));
      assert.equal(bots.length, 1, JSON.stringify(setup));
      assert.equal(setup.wallDone, false);
      assert.equal(setup.walls, 0, JSON.stringify(setup));

      const afterFirst = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const mid = window.mexico_mid_y(g.Ca);
        const w = g.Ca.wa[0].length;
        g.Sh = 1;
        window.mexico_place_mid_walls(g);
        let midWalls = 0;
        for (let x = 0; x < w; x++) {
          if (g.Ca.wa[mid] && g.Ca.wa[mid][x] > 0) midWalls++;
        }
        return {
          wallDone: !!window.__mexicoWallDone,
          midWalls,
          width: w,
          walls: g.Ca.Aa.size,
        };
      });
      assert.equal(afterFirst.wallDone, true, JSON.stringify(afterFirst));
      assert.equal(afterFirst.midWalls, afterFirst.width, JSON.stringify(afterFirst));
      assert.equal(afterFirst.walls, afterFirst.width, JSON.stringify(afterFirst));

      const afterMore = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const before = g.Ca.Aa.size;
        for (let i = 0; i < 4; i++) {
          g.Sh = (g.Sh | 0) + 1;
          if (typeof window.mexico_tick_logic === "function") {
            window.mexico_tick_logic(g);
          }
        }
        // Re-call place — must stay one-shot.
        window.mexico_place_mid_walls(g);
        return {
          before,
          after: g.Ca.Aa.size,
          wallDone: !!window.__mexicoWallDone,
        };
      });
      assert.equal(afterMore.after, afterMore.before, JSON.stringify(afterMore));

      const winProbe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        g.nj = false;
        g.lj = false;
        const beforeLen = g.wa.ka.length;
        const orig = window.mexico_find_spawn;
        window.mexico_find_spawn = function () {
          return null;
        };
        try {
          const n = window.mexico_fruit_respawn(
            g.wa,
            function () {
              return { pos: { x: 0, y: 0 } };
            },
            null,
            function () {
              return 0;
            }
          );
          // Failed spawn with fruit still on the board → no win.
          return {
            n,
            beforeLen,
            afterLen: g.wa.ka.length,
            nj: !!g.nj,
            lj: !!g.lj,
          };
        } finally {
          window.mexico_find_spawn = orig;
        }
      });
      assert.equal(winProbe.n, 0, JSON.stringify(winProbe));
      assert.equal(winProbe.afterLen, winProbe.beforeLen, JSON.stringify(winProbe));
      assert.equal(winProbe.nj, false, JSON.stringify(winProbe));
      assert.ok(winProbe.beforeLen > 0, JSON.stringify(winProbe));

      const winWhenEmpty = await h.page.evaluate(() => {
        const g = window.__remixGame;
        g.nj = false;
        g.lj = false;
        g.wa.ka.length = 0;
        const orig = window.mexico_find_spawn;
        window.mexico_find_spawn = function () {
          return null;
        };
        try {
          window.mexico_fruit_respawn(
            g.wa,
            function () {
              return { pos: { x: 0, y: 0 } };
            },
            null,
            function () {
              return 0;
            }
          );
          return { nj: !!g.nj, lj: !!g.lj, len: g.wa.ka.length };
        } finally {
          window.mexico_find_spawn = orig;
        }
      });
      assert.equal(winWhenEmpty.nj, true, JSON.stringify(winWhenEmpty));
      assert.equal(winWhenEmpty.lj, true, JSON.stringify(winWhenEmpty));

      const winOccupiedHalf = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const mid = window.mexico_mid_y(g.Ca);
        const hgt = g.Ca.wa.length;
        const w = g.Ca.wa[0].length;
        g.Sh = Math.max(1, g.Sh | 0);
        window.mexico_place_mid_walls(g);
        const body = [];
        body.push(
          typeof _.Od === "function" ? new _.Od(1, 1) : { x: 1, y: 1 }
        );
        for (let y = mid + 1; y < hgt; y++) {
          for (let x = 0; x < w; x++) {
            body.push(
              typeof _.Od === "function" ? new _.Od(x, y) : { x: x, y: y }
            );
          }
        }
        g.oa.ka = body;
        g.nj = false;
        g.lj = false;
        // Only one pair: illegal bottom → drop pair → empty → win.
        g.wa.ka.length = 0;
        g.wa.ka.push({ pos: { x: 2, y: 2 } });
        g.wa.ka.push({ pos: { x: 0, y: mid + 1 } });
        window.mexico_constrain_new_apples(g.wa, g.wa.ka.length);
        return { nj: !!g.nj, lj: !!g.lj, len: g.wa.ka.length };
      });
      assert.equal(winOccupiedHalf.nj, true, JSON.stringify(winOccupiedHalf));
      assert.equal(winOccupiedHalf.lj, true, JSON.stringify(winOccupiedHalf));
      assert.equal(winOccupiedHalf.len, 0, JSON.stringify(winOccupiedHalf));

      // Stub find_spawn: fail bottom only; two pairs on board; constrain last pair only.
      const keepFruit = await h.page.evaluate(() => {
        const g = window.__remixGame;
        g.nj = false;
        g.lj = false;
        const mid = window.mexico_mid_y(g.Ca);
        g.wa.ka.length = 0;
        g.wa.ka.push({ pos: { x: 1, y: 1 } }); // top
        g.wa.ka.push({ pos: { x: 1, y: mid + 2 } }); // bottom — keep
        g.wa.ka.push({ pos: { x: 4, y: 2 } }); // top new
        g.wa.ka.push({ pos: { x: 5, y: 2 } }); // wrong half (should be bottom)
        const orig = window.mexico_find_spawn;
        window.mexico_find_spawn = function (board, freePos, occ, half) {
          if (half === "bottom") return null;
          return orig.apply(this, arguments);
        };
        try {
          window.mexico_constrain_new_apples(g.wa, 2);
          return {
            nj: !!g.nj,
            lj: !!g.lj,
            len: g.wa.ka.length,
            apples: g.wa.ka.map((a) => ({ x: a.pos.x, y: a.pos.y })),
          };
        } finally {
          window.mexico_find_spawn = orig;
        }
      });
      assert.equal(keepFruit.nj, false, JSON.stringify(keepFruit));
      assert.equal(keepFruit.len, 2, JSON.stringify(keepFruit));

      const winEmpty = await h.page.evaluate(() => {
        const g = window.__remixGame;
        g.nj = false;
        g.lj = false;
        g.wa.ka.length = 0;
        // Empty after a finished eat/respawn (tick path) — not mid-j4E.
        window.mexico_win_if_empty(g, g.wa);
        return { nj: !!g.nj, lj: !!g.lj };
      });
      assert.equal(winEmpty.nj, true, JSON.stringify(winEmpty));
      assert.equal(winEmpty.lj, true, JSON.stringify(winEmpty));

      const reset = await h.page.evaluate(() => {
        window.mexico_reset_state();
        const g = window.__remixGame;
        g.wa.reset();
        return {
          wallDone: !!window.__mexicoWallDone,
          lastSh: window.__mexicoLastSh,
        };
      });
      assert.equal(reset.wallDone, false, JSON.stringify(reset));
      assert.equal(reset.lastSh, null, JSON.stringify(reset));

      const mexicoErrors = h.modErrors().filter((e) => /MexicoMod/.test(e.text));
      assert.deepEqual(mexicoErrors, [], "no MexicoMod errors");
    } finally {
      await h.close();
    }
  });

  it("portal eat removes twin and respawns one top+bottom pair", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 45, headless: true });
    try {
      await h.start({ mode: "mexico", count: COUNT.ONE, size: SIZE.NORMAL });

      const probe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const mid = window.mexico_mid_y(g.Ca);
        const before = (g.wa.ka || []).map((a) => ({
          x: a.pos.x,
          y: a.pos.y,
        }));
        const target = g.wa.ka[0];
        const twinPos = {
          x: g.wa.ka[1].pos.x,
          y: g.wa.ka[1].pos.y,
        };
        const eatenPos = { x: target.pos.x, y: target.pos.y };
        const snake = g.oa.ka;
        for (let i = 0; i < snake.length; i++) {
          snake[i].x = target.pos.x - 1;
          snake[i].y = target.pos.y;
        }
        g.oa.direction = "RIGHT";
        const sh0 = g.Sh | 0;
        for (let t = 0; t < 8 && (g.Sh | 0) === sh0; t++) g.tick();
        const after = (g.wa.ka || []).map((a) => ({
          x: a.pos.x,
          y: a.pos.y,
          half:
            a.pos.y < mid ? "top" : a.pos.y > mid ? "bot" : "mid",
        }));
        const oldTwinStillThere = after.some(
          (a) => a.x === twinPos.x && a.y === twinPos.y
        );
        const oldEatenStillThere = after.some(
          (a) => a.x === eatenPos.x && a.y === eatenPos.y
        );
        const tops = after.filter((a) => a.half === "top").length;
        const bots = after.filter((a) => a.half === "bot").length;
        return {
          beforeCount: before.length,
          afterCount: after.length,
          sh: g.Sh,
          oldTwinStillThere,
          oldEatenStillThere,
          tops,
          bots,
          after,
          eatenPos,
          twinPos,
          mid,
        };
      });

      assert.ok(probe.sh > 0, JSON.stringify(probe));
      assert.equal(probe.afterCount, 2, JSON.stringify(probe));
      assert.equal(probe.oldTwinStillThere, false, JSON.stringify(probe));
      assert.equal(probe.oldEatenStillThere, false, JSON.stringify(probe));
      assert.equal(probe.tops, 1, JSON.stringify(probe));
      assert.equal(probe.bots, 1, JSON.stringify(probe));

      assert.deepEqual(
        h.modErrors().filter((e) => /MexicoMod/.test(e.text)),
        [],
        "no MexicoMod errors"
      );
    } finally {
      await h.close();
    }
  });

  it("mid-row walls kill; no extra wall spawns after first apple", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 47, headless: true });
    try {
      await h.start({ mode: "mexico", count: COUNT.ONE, size: SIZE.NORMAL });

      const probe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        g.Sh = 1;
        window.mexico_place_mid_walls(g);
        const mid = window.mexico_mid_y(g.Ca);
        const wallsAfterPlace = g.Ca.Aa.size;
        const snake = g.oa.ka;
        for (let i = 0; i < snake.length; i++) {
          snake[i].x = 8;
          snake[i].y = mid - 1;
        }
        g.oa.direction = "DOWN";
        g.nj = false;
        if (window.cat_lives != null) window.cat_lives = 0;
        if (window.cat_peaceful_ticks != null) window.cat_peaceful_ticks = 0;

        let died = false;
        for (let t = 0; t < 4; t++) {
          g.tick();
          if (g.nj) {
            died = true;
            break;
          }
        }

        const before = g.Ca.Aa.size;
        g.nj = false;
        for (let i = 0; i < snake.length; i++) {
          snake[i].x = 3;
          snake[i].y = 3;
        }
        for (let i = 0; i < 3; i++) {
          g.Sh = (g.Sh | 0) + 1;
          window.mexico_tick_logic(g);
        }
        return {
          died,
          wallsAfterPlace,
          wallsLater: g.Ca.Aa.size,
          before,
          width: g.Ca.wa[0].length,
          blocksSpawn:
            typeof window.remixMexicoBlocksWallSpawn === "function" &&
            window.remixMexicoBlocksWallSpawn(),
        };
      });

      assert.equal(probe.died, true, JSON.stringify(probe));
      assert.equal(probe.wallsAfterPlace, probe.width, JSON.stringify(probe));
      assert.equal(probe.wallsLater, probe.wallsAfterPlace, JSON.stringify(probe));
      assert.equal(probe.blocksSpawn, true, JSON.stringify(probe));

      assert.deepEqual(
        h.modErrors().filter((e) => /MexicoMod/.test(e.text)),
        [],
        "no MexicoMod errors"
      );
    } finally {
      await h.close();
    }
  });

  it("bomb count first apple spawns pairs without winning while fruit remains", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 7, headless: true });
    try {
      await h.start({ mode: "mexico", count: COUNT.BOMB, size: SIZE.SMALL });

      const before = await h.page.evaluate(() => {
        const g = window.__remixGame;
        return {
          len: (g.wa.ka || []).length,
          Sa: g.settings.Sa,
          Aa: g.settings.Aa,
        };
      });
      assert.equal(before.len, 2, JSON.stringify(before));
      assert.equal(before.Sa, SIZE.SMALL, JSON.stringify(before));

      const after = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const mid = window.mexico_mid_y(g.Ca);
        const target = g.wa.ka[0];
        for (let i = 0; i < g.oa.ka.length; i++) {
          g.oa.ka[i].x = target.pos.x - 1;
          g.oa.ka[i].y = target.pos.y;
        }
        g.oa.direction = "RIGHT";
        g.nj = false;
        g.lj = false;
        const sh0 = g.Sh | 0;
        for (let t = 0; t < 12 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
        g.tick();
        const apples = (g.wa.ka || []).map((a) => ({
          y: a.pos.y,
          half: a.pos.y < mid ? "top" : a.pos.y > mid ? "bot" : "mid",
        }));
        let bad = 0;
        for (let i = 0; i < apples.length; i++) {
          const want = i % 2 === 0 ? "top" : "bot";
          if (apples[i].half !== want) bad++;
        }
        return {
          sh: g.Sh | 0,
          nj: !!g.nj,
          lj: !!g.lj,
          len: apples.length,
          tops: apples.filter((a) => a.half === "top").length,
          bots: apples.filter((a) => a.half === "bot").length,
          bad,
          wallDone: !!window.__mexicoWallDone,
        };
      });

      assert.equal(after.sh, 1, JSON.stringify(after));
      assert.equal(after.nj, false, JSON.stringify(after));
      assert.equal(after.lj, false, JSON.stringify(after));
      assert.ok(after.len >= 2, JSON.stringify(after));
      assert.equal(after.len % 2, 0, JSON.stringify(after));
      assert.equal(after.tops, after.bots, JSON.stringify(after));
      assert.equal(after.bad, 0, JSON.stringify(after));
      assert.equal(after.wallDone, true, JSON.stringify(after));
      // Full bomb on this board fits many pairs; must keep playing with fruit.
      assert.ok(after.len > 2, JSON.stringify(after));
    } finally {
      await h.close();
    }
  });
});
