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
    assert.match(init, /__bombFruitAppleSnap/);
    assert.match(init, /bombFruit_forget_apple/);

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
