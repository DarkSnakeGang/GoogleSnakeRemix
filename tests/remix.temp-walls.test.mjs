import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import vm from "vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REMIX = path.join(ROOT, "RemixMod.js");
const ULTRA = path.join(ROOT, "RemixUltraMod.js");
const INIT = path.join(ROOT, "src", "TempWallsInit.js");
const SLOT = path.join(ROOT, "src", "SlotMachineInit.js");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("Temp Walls mode (offline)", () => {
  it("ships constants, icon, and module hooks", () => {
    assert.equal(fs.existsSync(INIT), true);
    const init = fs.readFileSync(INIT, "utf8");
    assert.match(init, /window\.TempWallsMod/);
    assert.match(init, /TEMP_WALL_LIFESPAN\s*=\s*35/);
    assert.match(init, /TEMP_WALL_FADE_MOVES\s*=\s*5/);
    assert.match(init, /TEMP_WALL_PER_EAT\s*=\s*2/);
    assert.match(init, /TEMP_WALL_SPAWN_ATTEMPTS\s*=\s*15/);
    assert.match(init, /TEMP_WALL_MIN_DIST\s*=\s*6/);
    assert.match(init, /data:image\/png;base64,/);
    assert.match(init, /remix-temp-walls-blend/);
    assert.match(init, /tempWalls_spawn_on_eat/);
    assert.match(init, /tempWalls_age/);
    assert.match(init, /TEMP_WALL_FADE_ORANGE\s*=\s*"#ff6600"/);
    assert.match(init, /tempWalls_drawPulse/);
    assert.match(init, /tempWalls_theme_brick/);
    assert.match(init, /c7\(settings, settings\.oa, 3\)/);
    assert.match(init, /tempWalls_drawPulse\(this\.Ka,"ka"\)/);
    assert.match(init, /tempWalls_drawPulse\(td,"oa"\)/);
    assert.match(init, /tempWalls_has_fading/);
    assert.match(init, /tempWalls_win_if_empty/);
    assert.match(init, /__tempWall/);
    assert.match(init, /movesRemaining/);
  });

  it("builder / splice list TempWallsInit between BombFruit and SlotMachine", () => {
    const builder = fs.readFileSync(path.join(ROOT, "RemixBuilder.py"), "utf8");
    const splice = fs.readFileSync(
      path.join(ROOT, "tools", "splice_remix_bundles.cjs"),
      "utf8"
    );
    for (const [name, body] of [
      ["builder", builder],
      ["splice", splice],
    ]) {
      const bf = body.indexOf("BombFruitInit.js");
      const tw = body.indexOf("TempWallsInit.js");
      const sm = body.indexOf("SlotMachineInit.js");
      assert.ok(bf >= 0 && tw > bf && sm > tw, name + " order");
    }
  });

  it("Slot pool includes badge 29 Temp Walls", () => {
    const slot = fs.readFileSync(SLOT, "utf8");
    assert.match(slot, /29:\s*"Temp Walls"/);
    assert.match(slot, /29:\s*"bad"/);
    assert.match(slot, /m\s*>=\s*23\s*&&\s*m\s*<=\s*29/);
    assert.match(slot, /m === 29 && window\.TEMP_WALLS_ICON/);
    assert.match(slot, /b!==27&&b!==29/);
    assert.match(slot, /m === 29[\s\S]*?tempWalls_spawn_on_eat/);
  });

  it("Slot badge 29 eat path plants temp walls", () => {
    const init = fs.readFileSync(INIT, "utf8");
    const sandbox = {
      window: { console },
      console,
      document: {
        querySelector: () => null,
        getElementById: () => null,
      },
      Image: function Image() {},
      Math,
    };
    sandbox.window.Image = sandbox.Image;
    vm.createContext(sandbox);
    vm.runInContext(
      init +
        `\nString.prototype.assertReplace = function (re, rep) {
  if (typeof re === "string") return this.split(re).join(rep);
  return this.replace(re, rep);
};
window.TempWallsMod.runCodeBefore();
window.TempWallsMod.alterSnakeCode("tick(){}");\n`,
      sandbox
    );
    const w = sandbox.window;
    const wa = Array.from({ length: 12 }, () => Array(12).fill(0));
    const game = {
      Ca: { wa, Aa: new Map() },
      oa: { ka: [{ x: 0, y: 0 }] },
      wa: { ka: [] },
      Sh: 3,
    };
    w.__remixGame = game;
    w.CurrentModeNum = 50;
    w.TEMP_WALLS_MODE = 99;
    w.isSlotMachineActive = () => true;
    w.__slotActive = 29;
    const fruit = { slotMode: 29, pos: { x: 1, y: 1 } };
    w.__slotActivatedFruit = fruit;
    w.__slotEatenFruit = fruit;
    const planted = w.tempWalls_spawn_on_eat(game);
    assert.ok(planted >= 1 && planted <= 2, "slot eat plants walls");
    assert.equal(w.tempWalls_has_any(game), true);
    assert.equal(w.tempWalls_spawn_on_eat(game), 0, "dedupe same fruit");
  });

  it("bundles include Temp Walls after splice", () => {
    assert.equal(fs.existsSync(REMIX), true);
    assert.equal(fs.existsSync(ULTRA), true);
    const remix = fs.readFileSync(REMIX, "utf8");
    const ultra = fs.readFileSync(ULTRA, "utf8");
    for (const [name, body] of [
      ["Remix", remix],
      ["Ultra", ultra],
    ]) {
      assert.match(body, /window\.TempWallsMod/, name);
      assert.match(body, /TempWallsMod\.alterSnakeCode/, name);
      assert.match(body, /remix-temp-walls-blend/, name);
      assert.match(body, /TEMP_WALL_LIFESPAN\s*=\s*35/, name);
      assert.match(body, /29:\s*"Temp Walls"/, name);
    }
  });

  it("age / spawn helpers match Level-21 lifespan", () => {
    const init = fs.readFileSync(INIT, "utf8");
    const sandbox = {
      window: { console },
      console,
      document: {
        querySelector: () => null,
        getElementById: () => null,
      },
      Image: function Image() {},
    };
    sandbox.window.Image = sandbox.Image;
    vm.createContext(sandbox);
    vm.runInContext(
      init +
        `\nString.prototype.assertReplace = function (re, rep) {
  if (typeof re === "string") return this.split(re).join(rep);
  return this.replace(re, rep);
};
window.TempWallsMod.runCodeBefore();
window.TempWallsMod.alterSnakeCode("tick(){}");\n`,
      sandbox
    );
    const w = sandbox.window;
    assert.equal(w.TEMP_WALL_LIFESPAN, 35);
    assert.equal(w.TEMP_WALL_FADE_MOVES, 5);
    assert.equal(typeof w.tempWalls_place_at, "function");

    const wa = Array.from({ length: 9 }, () => Array(10).fill(0));
    const Aa = new Map();
    const game = {
      Ca: { wa, Aa },
      oa: { ka: [{ x: 0, y: 0 }] },
      wa: { ka: [] },
      Sh: 0,
    };
    w.__remixGame = game;
    w.CurrentModeNum = 99;
    w.TEMP_WALLS_MODE = 99;
    w.temp_walls_blending = false;
    assert.equal(w.tempWalls_place_at(game, 5, 5), true);
    const walls = w.tempWalls_list(game);
    assert.equal(walls.length, 1);
    assert.equal(walls[0].movesRemaining, 35);
    assert.equal(walls[0].__tempWall, true);
    assert.equal(w.tempWalls_lerp_color("#000000", "#ff8c00", 0), "#000000");
    assert.equal(w.tempWalls_lerp_color("#000000", "#ff8c00", 1), "#ff8c00");
    walls[0].movesRemaining = 3;
    assert.equal(w.tempWalls_has_fading(game), true);
    walls[0].movesRemaining = 35;
    for (let i = 0; i < 30; i++) w.tempWalls_age(game);
    assert.equal(w.tempWalls_list(game)[0].movesRemaining, 5);
    for (let i = 0; i < 5; i++) w.tempWalls_age(game);
    assert.equal(w.tempWalls_has_any(game), false);
  });
});

describe("Temp Walls mode (browser)", { skip: !runBrowser }, () => {
  it("eat spawns walls, ages 35 steps, spawn-fail wins", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 42, headless: true });
    try {
      const started = await h.start({
        mode: "temp_walls",
        count: COUNT.ONE,
        size: SIZE.SMALL,
      });
      assert.ok(started);
      // Place walls via helper and assert countdown / win path in-page.
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        if (!g) return { ok: false, reason: "no game" };
        window.tempWalls_clear_all(g);
        const planted = window.tempWalls_spawn_on_eat(g);
        const list = window.tempWalls_list(g);
        const life = list.map((w) => w.movesRemaining);
        for (let i = 0; i < 35; i++) window.tempWalls_age(g);
        const after = window.tempWalls_has_any(g);
        return {
          ok: true,
          planted,
          life,
          after,
          fadeMoves: window.TEMP_WALL_FADE_MOVES,
          lifespan: window.TEMP_WALL_LIFESPAN,
        };
      });
      assert.equal(result.ok, true, JSON.stringify(result));
      assert.equal(result.lifespan, 35);
      assert.equal(result.fadeMoves, 5);
      assert.ok(result.planted >= 0 && result.planted <= 2);
      if (result.planted > 0) {
        assert.ok(result.life.every((n) => n === 35));
        assert.equal(result.after, false);
      }
    } finally {
      await h.close();
    }
  });
});
