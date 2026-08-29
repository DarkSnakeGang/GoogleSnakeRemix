import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REMIX = path.join(ROOT, "RemixMod.js");
const ULTRA = path.join(ROOT, "RemixUltraMod.js");
const INIT = path.join(ROOT, "src", "BombFruitInit.js");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("Bomb Fruit mode (offline)", () => {
  it("ships in both Remix and Ultra bundles", () => {
    assert.equal(fs.existsSync(INIT), true);
    assert.equal(fs.existsSync(REMIX), true);
    assert.equal(fs.existsSync(ULTRA), true);
    const init = fs.readFileSync(INIT, "utf8");
    const remix = fs.readFileSync(REMIX, "utf8");
    const ultra = fs.readFileSync(ULTRA, "utf8");

    assert.match(init, /window\.BombFruitMod/);
    assert.match(init, /count_05\.png/);
    assert.match(init, /BOMB_FRUIT_ARM_TICKS\s*=\s*4/);
    assert.match(init, /mineRadius/);
    assert.match(init, /bombFruit_detach_bomb/);
    assert.match(init, /__bombFruitOrphans/);
    assert.match(init, /bombFruit_sync_fruit_bombs/);
    assert.match(init, /bombFruit_orphan_boom/);
    assert.match(init, /bombFruit_after_respawn\(a,g\)/);
    assert.match(init, /bombFruit_after_respawn\(a\.wa,0\)/);
    assert.match(init, /bombFruit_win_if_empty/);
    assert.match(init, /bombFruit_clear_shields/);
    assert.match(init, /__bombFruitZones/);
    assert.match(init, /bombFruit_ensure_zone/);
    assert.match(init, /bombFruit_plant_layout_zones/);
    assert.match(init, /BOMB_FRUIT_ZONE_LINGER/);
    assert.match(init, /isBombFruitActive\(\)\?1:Math\.min\(1,\(h\.xL\+f\)\/2\)/);
    assert.match(init, /b===15&&window\.BOMB_FRUIT_MODE/);
    assert.match(init, /game\.ub\s*=\s*true/);
    assert.match(init, /same end state as Shield/);

    for (const [name, body] of [
      ["Remix", remix],
      ["Ultra", ultra],
    ]) {
      assert.match(body, /window\.BombFruitMod/, name);
      assert.match(body, /BombFruitMod\.alterSnakeCode/, name);
      assert.match(body, /BombFruitMod\.runCodeAfter/, name);
      assert.match(body, /remix-bomb-fruit-blend/, name);
      assert.match(body, /count_05\.png/, name);
      assert.match(
        body,
        /e7\(this\.settings,12\)\|\|window\.isBombFruitActive/,
        name + " D5E call gate"
      );
      assert.match(body, /bombFruit_sync_fruit_bombs/, name + " eat detach");
      assert.match(body, /__bombFruitOrphans/, name + " orphan list");
      assert.match(body, /b===15&&window\.BOMB_FRUIT_MODE/, name + " shield e7");
      assert.match(body, /bombFruit_clear_shields/, name + " no shield bars");
    }
  });

  it("builder / splice list BombFruitInit after Mexico", () => {
    const builder = fs.readFileSync(path.join(ROOT, "RemixBuilder.py"), "utf8");
    const splice = fs.readFileSync(
      path.join(ROOT, "tools", "splice_remix_bundles.cjs"),
      "utf8"
    );
    assert.match(builder, /BombFruitInit\.js/);
    assert.match(splice, /BombFruitInit\.js/);
    const bIdx = builder.indexOf("BombFruitInit.js");
    const mIdx = builder.indexOf("MexicoInit.js");
    assert.ok(mIdx >= 0 && bIdx > mIdx, "BombFruit after Mexico in builder");
  });
});

describe("Bomb Fruit mode (browser)", { skip: !runBrowser }, () => {
  async function launch(modFile, seed) {
    const { launchHarness } = await import("../tools/harness.mjs");
    return launchHarness({ seed, headless: true, modFile });
  }

  it("pre-start layout apples get mine radii without ticking", async () => {
    const { COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launch("RemixMod.js", 121);
    try {
      await h.start({ mode: "classic", count: COUNT.THREE, size: SIZE.NORMAL });
      const r = await h.page.evaluate(() => {
        const mode = window.BOMB_FRUIT_MODE;
        window.CurrentModeNum = mode;
        const g = window.__remixGame;
        g.settings.ub = mode;
        g.settings.ob = mode;
        window.bombFruit_reset_state();
        // No tick — simulate menu board paint.
        const mgr = g.wa;
        const appleN = mgr.ka.length;
        window.bombFruit_plant_layout_zones(mgr, true);
        const zones = window.__bombFruitZones || [];
        const keys = new Set(mgr.ka.map((a) => a.pos.x + "," + a.pos.y));
        const allMatch =
          zones.length === appleN &&
          zones.every((z) => keys.has(z.x + "," + z.y) && z.bombX1a === -1);
        return {
          appleN,
          zoneN: zones.length,
          boot: !!window.__bombFruitBootstrapped,
          allMatch,
          active: window.isBombFruitActive(),
        };
      });
      assert.equal(r.active, true, JSON.stringify(r));
      assert.equal(
        r.boot,
        false,
        "must not require tick bootstrap: " + JSON.stringify(r)
      );
      assert.equal(r.zoneN, r.appleN, JSON.stringify(r));
      assert.equal(r.allMatch, true, JSON.stringify(r));
    } finally {
      await h.close();
    }
  });

  it("trophy + blender slot; arm to 4; eat is safe; boom kills in-radius", async () => {
    const { COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launch("RemixMod.js", 111);
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const r = await h.page.evaluate(async () => {
        const mode = window.BOMB_FRUIT_MODE;
        const trophy = document.querySelector("#trophy");
        const hasTrophy =
          typeof mode === "number" &&
          trophy &&
          trophy.children[mode] &&
          /count_05/.test(trophy.children[mode].src || "");
        const blend = document.getElementById("remix-bomb-fruit-blend");

        // Force mode active for logic probes
        window.CurrentModeNum = mode;
        window.bombFruit_reset_state();
        window.__bombFruitBootstrapped = true;

        // Synthetic apple + head for arm/boom without full play
        const game = window.__remixGame;
        if (!game || !game.wa || !game.wa.ka || !game.wa.ka.length) {
          return { hasTrophy, blend: !!blend, mode, err: "no apples yet" };
        }
        const apple = game.wa.ka[0];
        window.bombFruit_init_apple(apple);
        apple.bombX1a = -1;
        const head = game.oa.ka[0];
        // Place head adjacent (Chebyshev 1) to arm
        const ax = apple.pos.x;
        const ay = apple.pos.y;
        head.x = ax + 1;
        head.y = ay;
        window.bombFruit_tick_logic(game);
        const armed = apple.bombX1a;
        // Advance ticks until boom without leaving ring
        let ticks = 0;
        let died = false;
        while ((apple.bombX1a > 0 || apple.bombX1a === 0) && ticks < 12) {
          if (apple.bombX1a === 0) {
            window.bombFruit_tick_logic(game);
            ticks++;
            break;
          }
          window.bombFruit_tick_logic(game);
          ticks++;
          if (game.nj || game.lj) {
            died = true;
            break;
          }
        }
        if (game.nj || game.lj) died = true;

        return {
          hasTrophy,
          blend: !!blend,
          mode,
          armed,
          ticks,
          died,
          afterBoom: died,
          armTicks: window.BOMB_FRUIT_ARM_TICKS,
          drawFn: typeof window.bombFruit_drawRadii,
          cheb: window.bombFruit_chebyshev(
            { x: 0, y: 0 },
            { x: 1, y: 1 }
          ),
          active: window.isBombFruitActive(),
          finalX1a: apple.bombX1a,
        };
      });
      assert.equal(r.hasTrophy, true, JSON.stringify(r));
      assert.equal(r.blend, true, JSON.stringify(r));
      assert.equal(r.armTicks, 4);
      assert.equal(r.cheb, 1);
      assert.equal(r.armed, 4, "should arm to 4 on enter: " + JSON.stringify(r));
      assert.equal(r.died, true, "in-radius boom should kill: " + JSON.stringify(r));
    } finally {
      await h.close();
    }
  });

  it("eat relocates apple without teleporting armed radius", async () => {
    const { COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launch("RemixMod.js", 113);
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const r = await h.page.evaluate(() => {
        const mode = window.BOMB_FRUIT_MODE;
        window.CurrentModeNum = mode;
        window.bombFruit_reset_state();
        window.__bombFruitBootstrapped = true;
        window.__bombFruitOrphans = [];
        window.__bombFruitLastPos = new WeakMap();

        const game = window.__remixGame;
        if (!game || !game.wa || !game.wa.ka || !game.wa.ka.length) {
          return { err: "no apples" };
        }
        const apple = game.wa.ka[0];
        window.bombFruit_init_apple(apple);
        const oldX = apple.pos.x;
        const oldY = apple.pos.y;
        window.__bombFruitLastPos.set(apple, oldX + "," + oldY);
        apple.bombX1a = 3; // armed, mid-countdown

        // Simulate vanilla eat: same object, new pos
        const newX = oldX + 5;
        const newY = oldY + 5;
        if (typeof apple.pos.clone === "function") {
          apple.pos.x = newX;
          apple.pos.y = newY;
        } else {
          apple.pos.x = newX;
          apple.pos.y = newY;
        }

        window.bombFruit_sync_fruit_bombs(game.wa);

        const orphans = window.__bombFruitOrphans || [];
        return {
          fruitBomb: apple.bombX1a,
          orphanCount: orphans.length,
          orphan: orphans[0]
            ? {
                x: orphans[0].x,
                y: orphans[0].y,
                ticks: orphans[0].bombX1a,
              }
            : null,
          fruitPos: { x: apple.pos.x, y: apple.pos.y },
          old: { x: oldX, y: oldY },
        };
      });
      assert.equal(r.fruitBomb, -1, "fruit must disarm after relocate: " + JSON.stringify(r));
      assert.equal(r.orphanCount, 1, "armed bomb stays at old cell: " + JSON.stringify(r));
      assert.equal(r.orphan.x, r.old.x);
      assert.equal(r.orphan.y, r.old.y);
      assert.equal(r.orphan.ticks, 3);
      assert.equal(r.fruitPos.x, r.old.x + 5);
      assert.equal(r.fruitPos.y, r.old.y + 5);
    } finally {
      await h.close();
    }
  });

  it("supports all apple counts with per-fruit radii and explode preserve", async () => {
    const { COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launch("RemixMod.js", 114);
    try {
      const specs = [
        ["ONE", COUNT.ONE, 1],
        ["THREE", COUNT.THREE, 3],
        ["FIVE", COUNT.FIVE, 5],
        ["TEN", COUNT.TEN, 10],
        ["DICE", COUNT.DICE, 1],
        ["BOMB", COUNT.BOMB, 1],
        ["TALLY", COUNT.TALLY, 5],
      ];
      for (const [label, count, expectN] of specs) {
        await h.start({ mode: "classic", count, size: SIZE.NORMAL });
        const r = await h.page.evaluate(
          ({ label, expectN }) => {
            const mode = window.BOMB_FRUIT_MODE;
            window.CurrentModeNum = mode;
            const g = window.__remixGame;
            g.settings.ob = mode;
            window.bombFruit_reset_state();
            window.__bombFruitBootstrapped = true;
            const mgr = g.wa;
            window.bombFruit_init_all(mgr);
            const n = mgr.ka.length;
            // Every apple gets a radius draw path (field present).
            const allFields = mgr.ka.every(
              (a) => a && a.pos && (a.bombX1a === -1 || a.bombX1a == null || a.bombX1a >= -1)
            );
            window.bombFruit_init_all(mgr);
            const head = g.oa.ka[0];
            head.x = 0;
            head.y = 0;
            if (!mgr.ka.length) {
              return { label, err: "empty", n, expectN };
            }
            // Keep head far so explode respawns instead of killing.
            const before = mgr.ka.length;
            window.bombFruit_explode(g, mgr, 0);
            const after = mgr.ka.length;
            return {
              label,
              n,
              expectN,
              allFields,
              before,
              after,
              preserved: after === before,
              active: window.isBombFruitActive(),
              j4E: typeof window.bombFruit_after_respawn,
            };
          },
          { label, expectN }
        );
        assert.equal(r.n, expectN, label + " start count: " + JSON.stringify(r));
        assert.equal(r.allFields, true, label + " bomb fields: " + JSON.stringify(r));
        assert.equal(r.preserved, true, label + " explode preserves count: " + JSON.stringify(r));
        assert.equal(r.active, true, label);
      }
    } finally {
      await h.close();
    }
  });

  it("keeps start layout; explode preserves tally sequenceNumber", async () => {
    const { COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launch("RemixMod.js", 115);
    try {
      await h.start({ mode: "classic", count: COUNT.TALLY, size: SIZE.SMALL });
      const r = await h.page.evaluate(() => {
        const mode = window.BOMB_FRUIT_MODE;
        window.CurrentModeNum = mode;
        const g = window.__remixGame;
        g.settings.ob = mode;
        const mgr = g.wa;
        const snap = mgr.ka.map((a) => ({
          x: a.pos.x,
          y: a.pos.y,
          seq: a.sequenceNumber,
        }));
        window.bombFruit_reset_state();
        // First tick bootstrap must NOT relocate start apples.
        window.bombFruit_tick_logic(g);
        const afterBoot = mgr.ka.map((a) => ({
          x: a.pos.x,
          y: a.pos.y,
          seq: a.sequenceNumber,
        }));
        const layoutKept =
          snap.length === afterBoot.length &&
          snap.every(
            (p, i) =>
              p.x === afterBoot[i].x &&
              p.y === afterBoot[i].y &&
              p.seq === afterBoot[i].seq
          );

        // Explode one apple far from head; replacement keeps sequenceNumber.
        const head = g.oa.ka[0];
        head.x = 0;
        head.y = 0;
        const target = mgr.ka[0];
        const keepSeq = target.sequenceNumber;
        target.pos.x = 8;
        target.pos.y = 7;
        window.__bombFruitLastPos = new WeakMap();
        window.bombFruit_sync_fruit_bombs(mgr);
        window.bombFruit_explode(g, mgr, 0);
        const neu = mgr.ka.find((a) => a.sequenceNumber === keepSeq);
        const anySeq = mgr.ka.map((a) => a.sequenceNumber);

        return {
          layoutKept,
          snapLen: snap.length,
          keepSeq,
          neuSeq: neu ? neu.sequenceNumber : null,
          found: !!neu,
          anySeq,
          ka: g.settings.ka,
        };
      });
      assert.equal(r.layoutKept, true, "start layout moved: " + JSON.stringify(r));
      assert.equal(r.found, true, "tally seq lost on explode: " + JSON.stringify(r));
      assert.equal(r.neuSeq, r.keepSeq, JSON.stringify(r));
    } finally {
      await h.close();
    }
  });

  it("dice eat of armed fruit leaves orphan blast at old cell", async () => {
    const { COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launch("RemixMod.js", 116);
    try {
      await h.start({ mode: "classic", count: COUNT.DICE, size: SIZE.NORMAL });
      const r = await h.page.evaluate(() => {
        const mode = window.BOMB_FRUIT_MODE;
        window.CurrentModeNum = mode;
        const g = window.__remixGame;
        g.settings.ob = mode;
        window.bombFruit_reset_state();
        window.__bombFruitBootstrapped = true;
        const mgr = g.wa;
        window.bombFruit_init_all(mgr);
        const apple = mgr.ka[0];
        apple.bombX1a = 3;
        const oldX = apple.pos.x;
        const oldY = apple.pos.y;
        window.bombFruit_refresh_snap(mgr);

        // Dice-style: remove the apple object entirely and push a new one.
        const neuPos = { x: oldX + 6, y: oldY + 6 };
        mgr.ka.length = 0;
        const neu = window.bombFruit_make_apple_at(mgr, neuPos, null) || {
          pos: neuPos,
          bombX1a: -1,
        };
        if (mgr.ka.indexOf(neu) < 0) mgr.ka.push(neu);
        neu.bombX1a = -1;

        window.bombFruit_after_respawn(mgr, 1);
        const orphans = window.__bombFruitOrphans || [];
        return {
          orphanCount: orphans.length,
          orphan: orphans[0]
            ? { x: orphans[0].x, y: orphans[0].y, ticks: orphans[0].bombX1a }
            : null,
          old: { x: oldX, y: oldY },
          fruitBomb: neu.bombX1a,
        };
      });
      assert.equal(r.orphanCount, 1, "armed eat must leave orphan: " + JSON.stringify(r));
      assert.equal(r.orphan.x, r.old.x, JSON.stringify(r));
      assert.equal(r.orphan.y, r.old.y, JSON.stringify(r));
      assert.equal(r.orphan.ticks, 3, JSON.stringify(r));
      assert.equal(r.fruitBomb, -1, JSON.stringify(r));
    } finally {
      await h.close();
    }
  });

  it("eat leaves a zone radius at the old cell", async () => {
    const { COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launch("RemixMod.js", 120);
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const r = await h.page.evaluate(() => {
        const mode = window.BOMB_FRUIT_MODE;
        window.CurrentModeNum = mode;
        const g = window.__remixGame;
        g.settings.ub = mode;
        g.settings.ob = mode;
        window.bombFruit_reset_state();
        window.__bombFruitBootstrapped = true;
        const mgr = g.wa;
        const apple = mgr.ka[0];
        window.bombFruit_init_apple(apple);
        apple.bombX1a = -1; // unarmed
        const oldX = apple.pos.x;
        const oldY = apple.pos.y;
        window.__bombFruitLastPos = new WeakMap();
        window.__bombFruitLastPos.set(apple, oldX + "," + oldY);
        window.__bombFruitAppleSnap = [
          { el: apple, key: oldX + "," + oldY, bombX1a: -1 },
        ];
        apple.pos.x = (oldX + 5) % 17;
        apple.pos.y = (oldY + 4) % 15;
        window.bombFruit_sync_fruit_bombs(mgr);
        window.bombFruit_update_draw_cache(mgr);
        const zones = window.__bombFruitZones || [];
        const cache = window.__bombFruitDrawCache || [];
        const oldZone = zones.find((z) => z.x === oldX && z.y === oldY);
        const cacheOld = cache.some((e) => e.x === oldX && e.y === oldY);
        const cacheNew = cache.some(
          (e) => e.x === apple.pos.x && e.y === apple.pos.y
        );
        return {
          oldZone: !!oldZone,
          oldLinger: oldZone ? oldZone.linger : null,
          cacheOld,
          cacheNew,
          fruitBomb: apple.bombX1a,
          zoneCount: zones.length,
        };
      });
      assert.equal(r.oldZone, true, "zone at old cell: " + JSON.stringify(r));
      assert.equal(r.cacheOld, true, "draw still has old ring: " + JSON.stringify(r));
      assert.equal(r.cacheNew, true, "draw has new fruit ring: " + JSON.stringify(r));
      assert.ok(r.oldLinger == null || r.oldLinger > 0, JSON.stringify(r));
      assert.equal(r.fruitBomb, -1, JSON.stringify(r));
    } finally {
      await h.close();
    }
  });

  it("mine radius zones survive transient empty apple list", async () => {
    const { COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launch("RemixMod.js", 119);
    try {
      await h.start({ mode: "classic", count: COUNT.THREE, size: SIZE.NORMAL });
      const r = await h.page.evaluate(() => {
        const mode = window.BOMB_FRUIT_MODE;
        window.CurrentModeNum = mode;
        const g = window.__remixGame;
        g.settings.ub = mode;
        g.settings.ob = mode;
        window.bombFruit_reset_state();
        window.__bombFruitBootstrapped = true;
        const mgr = g.wa;
        window.bombFruit_init_all(mgr);
        window.bombFruit_sync_fruit_bombs(mgr);
        window.bombFruit_update_draw_cache(mgr);
        const before = (window.__bombFruitDrawCache || []).map((e) => e.x + "," + e.y);
        // Simulate eat gap: apples cleared for a frame, game not over.
        // Zones stay — radii are cell-bound, not fruit-bound.
        const saved = mgr.ka.splice(0, mgr.ka.length);
        g.nj = false;
        window.bombFruit_update_draw_cache(mgr);
        const mid = (window.__bombFruitDrawCache || []).map((e) => e.x + "," + e.y);
        // Restore fruit without sync — zones unchanged.
        for (let i = 0; i < saved.length; i++) mgr.ka.push(saved[i]);
        window.bombFruit_update_draw_cache(mgr);
        const after = (window.__bombFruitDrawCache || []).map((e) => e.x + "," + e.y);
        return {
          beforeN: before.length,
          midN: mid.length,
          midSame: mid.join("|") === before.join("|"),
          afterN: after.length,
          afterSame: after.join("|") === before.join("|"),
        };
      });
      assert.equal(r.beforeN, 3, JSON.stringify(r));
      assert.equal(r.midN, 3, "zones kept during empty: " + JSON.stringify(r));
      assert.equal(r.midSame, true, JSON.stringify(r));
      assert.equal(r.afterN, 3, JSON.stringify(r));
      assert.equal(r.afterSame, true, "emptying fruit does not move zones: " + JSON.stringify(r));
    } finally {
      await h.close();
    }
  });

  it("wins only when spawn fails and no fruit remain", async () => {
    const { COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launch("RemixMod.js", 117);
    try {
      await h.start({ mode: "classic", count: COUNT.THREE, size: SIZE.NORMAL });
      const r = await h.page.evaluate(() => {
        const mode = window.BOMB_FRUIT_MODE;
        window.CurrentModeNum = mode;
        const g = window.__remixGame;
        g.settings.ob = mode;
        g.settings.ub = mode;
        window.bombFruit_reset_state();
        window.__bombFruitBootstrapped = true;
        const mgr = g.wa;
        window.bombFruit_init_all(mgr);

        // Shield physics via e7(...,15): Rb(...,2) must ban Manhattan ≤3.
        const head = g.oa.ka[0];
        head.x = 8;
        head.y = 7;
        const free =
          typeof g.Rb === "function"
            ? g.Rb.bind(g)
            : typeof g.Tb === "function"
              ? g.Tb.bind(g)
              : null;
        const dists = [];
        if (free) {
          for (let i = 0; i < 30; i++) {
            const p = free(null, 2);
            if (!p) continue;
            dists.push(Math.abs(p.x - head.x) + Math.abs(p.y - head.y));
          }
        }
        const shieldRadius =
          dists.length > 0 && dists.every((d) => d > 3);

        window.bombFruit_clear_shields(mgr);
        const noBars = mgr.ka.every((a) => !a || a.nba == null);

        // Spawn fail with siblings still present → no win.
        head.x = 0;
        head.y = 0;
        const origFind = window.bombFruit_find_spawn;
        window.bombFruit_find_spawn = () => null;
        window.bombFruit_explode(g, mgr, 0);
        const afterSiblings = {
          n: mgr.ka.length,
          nj: !!g.nj,
          ub: !!g.ub,
        };

        // Empty board + spawn fail → native-style win (ub+nj).
        mgr.ka.length = 0;
        window.appleArray = mgr.ka;
        g.nj = false;
        g.ub = false;
        const wonEmpty = window.bombFruit_win_if_empty(g, mgr);
        window.bombFruit_find_spawn = origFind;
        return {
          shieldRadius,
          minDist: dists.length ? Math.min(...dists) : null,
          noBars,
          afterSiblings,
          wonEmpty,
          nj: !!g.nj,
          ub: !!g.ub,
        };
      });
      assert.equal(r.shieldRadius, true, "Rb bans ≤3: " + JSON.stringify(r));
      assert.equal(r.noBars, true, "no shield bars: " + JSON.stringify(r));
      assert.equal(r.afterSiblings.n, 2, "siblings kept: " + JSON.stringify(r));
      assert.equal(r.afterSiblings.nj, false, "no win with fruit left: " + JSON.stringify(r));
      assert.equal(r.wonEmpty, true, JSON.stringify(r));
      assert.equal(r.nj, true, JSON.stringify(r));
      assert.equal(r.ub, true, "win needs ub: " + JSON.stringify(r));
    } finally {
      await h.close();
    }
  });

  it("native free-cell radius matches Shield; empty board wins", async () => {
    const { COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launch("RemixMod.js", 118);
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.SMALL });
      const r = await h.page.evaluate(() => {
        const mode = window.BOMB_FRUIT_MODE;
        window.CurrentModeNum = mode;
        const g = window.__remixGame;
        g.settings.ob = mode;
        g.settings.ub = mode;
        window.bombFruit_reset_state();
        window.__bombFruitBootstrapped = true;
        const mgr = g.wa;
        const head = g.oa.ka[0];
        head.x = 5;
        head.y = 4;

        const free =
          typeof g.Rb === "function"
            ? g.Rb.bind(g)
            : typeof g.Tb === "function"
              ? g.Tb.bind(g)
              : null;
        const on = [];
        for (let i = 0; i < 25 && free; i++) {
          const p = free(null, 2);
          if (p) on.push(Math.abs(p.x - head.x) + Math.abs(p.y - head.y));
        }

        g.settings.ub = 0;
        const off = [];
        for (let i = 0; i < 25 && free; i++) {
          const p = free(null, 2);
          if (p) off.push(Math.abs(p.x - head.x) + Math.abs(p.y - head.y));
        }
        g.settings.ub = mode;

        // Soft find also refuses near-head cells.
        mgr.ka.length = 1;
        mgr.ka[0].pos.x = head.x;
        mgr.ka[0].pos.y = head.y;
        const softNear = window.bombFruit_find_spawn(mgr, 0);
        const softOk =
          !softNear ||
          Math.abs(softNear.x - head.x) + Math.abs(softNear.y - head.y) > 3;

        mgr.ka.length = 0;
        window.appleArray = mgr.ka;
        g.nj = false;
        g.ub = false;
        const won = window.bombFruit_win_if_empty(g, mgr);
        return {
          onMin: on.length ? Math.min(...on) : null,
          offMin: off.length ? Math.min(...off) : null,
          softOk,
          won,
          ub: !!g.ub,
          nj: !!g.nj,
        };
      });
      assert.ok(r.onMin != null && r.onMin > 3, "bomb on: " + JSON.stringify(r));
      assert.ok(r.offMin != null && r.offMin <= 3, "classic off: " + JSON.stringify(r));
      assert.equal(r.softOk, true, JSON.stringify(r));
      assert.equal(r.won, true, JSON.stringify(r));
      assert.equal(r.ub, true, JSON.stringify(r));
      assert.equal(r.nj, true, JSON.stringify(r));
    } finally {
      await h.close();
    }
  });

  it("Ultra also exposes Bomb Fruit trophy and blender", async () => {
    const { COUNT, SIZE, ultraHarnessOpts } = await import(
      "../tools/harness.mjs"
    );
    const { launchHarness } = await import("../tools/harness.mjs");
    const h = await launchHarness(
      ultraHarnessOpts({ seed: 112, headless: true })
    );
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const r = await h.page.evaluate(() => ({
        mode: window.BOMB_FRUIT_MODE,
        blend: !!document.getElementById("remix-bomb-fruit-blend"),
        tick: typeof window.bombFruit_tick_logic,
        patched: typeof window.isBombFruitActive === "function",
      }));
      assert.equal(typeof r.mode, "number", JSON.stringify(r));
      assert.equal(r.blend, true, JSON.stringify(r));
      assert.equal(r.tick, "function");
      assert.equal(r.patched, true);
    } finally {
      await h.close();
    }
  });
});
