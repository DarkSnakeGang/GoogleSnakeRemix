import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const initPath = new URL("../src/FearInit.js", import.meta.url);
const init = fs.readFileSync(initPath, "utf8");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

function loadFear() {
  const context = {
    console,
    Map,
    Set,
    WeakMap,
    Math: Object.create(Math),
    Image: class {
      set src(value) {
        this._src = value;
      }
      get src() {
        return this._src;
      }
    },
    document: {
      querySelector() {
        return null;
      },
      getElementById() {
        return null;
      },
    },
  };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(init, context);
  context.FEAR_MODE = 30;
  context.CurrentModeNum = 30;
  context.burger_timer_roll = () => 21;
  return context;
}

function game(fruits, options = {}) {
  const width = options.width || 12;
  const height = options.height || 10;
  return {
    settings: { ub: 30, ob: 30, ka: options.count ?? 0 },
    ka: { oa: { width, height }, ka: 20 },
    wa: { ka: fruits },
    oa: {
      direction: options.direction || "UP",
      ka: [{ x: options.headX ?? 2, y: options.headY ?? 7 }],
    },
    Ca: { Aa: new Map() },
    nj: false,
  };
}

test("Fear assets and build wiring exist in menu order", () => {
  for (const name of [
    "fear-mode-icon.png",
    "fear-ghost-normal.png",
    "fear-ghost-pixel.png",
    "fear-ghost-real.png",
  ]) {
    assert.ok(
      fs.existsSync(new URL("../assets/" + name, import.meta.url)),
      name
    );
  }
  const builder = fs.readFileSync(
    new URL("../RemixBuilder.py", import.meta.url),
    "utf8"
  );
  assert.match(builder, /src\/TempWallsInit\.js"[\s\S]*src\/FearInit\.js"[\s\S]*src\/SlotMachineInit\.js"/);
  assert.match(builder, /__FEAR_GHOST_REAL__/);
});

test("Fear ghosts use a dedicated hidden fruit-atlas type", () => {
  const w = loadFear();
  w.last_fruit_num = 24;
  w.CUSTOM_FRUIT_NEW_FRUIT_INDEX = 0;
  w.new_fruit = [{ Normal: "custom" }, { Normal: "chess" }];
  w._chessFruitsInjected = true;
  w.bbishop = 26;
  w.FearMod.runCodeBefore();

  assert.equal(w.FEAR_GHOST_NEW_FRUIT_INDEX, 1);
  assert.equal(w.FEAR_GHOST_TYPE, 26);
  assert.equal(w.new_fruit[1].__fearGhostFruit, true);
  assert.equal(w.bbishop, 27, "later hidden fruit type ids shift once");

  const ghost = { Oka: true, type: 3 };
  w.fear_sync_fruit_type(ghost);
  assert.equal(ghost.type, w.FEAR_GHOST_TYPE);
  assert.equal(ghost.Oka, false, "ghost must not enter poison rendering");
  assert.equal(ghost.__fearGhost, true);
  assert.equal(ghost.__fearOriginalType, 3);
  assert.doesNotMatch(init, /fearGhostSprite/);
});

test("single-owner arrows never point inward", () => {
  const w = loadFear();
  const ghost = { Oka: true, pos: { x: 6, y: 4 } };
  const g = game([ghost], { headX: 2, headY: 8, direction: "UP" });
  w.__remixGame = g;
  const grid = w.fear_rebuild_grid(g);
  assert.equal(grid.size, 4);
  for (const cell of grid.values()) {
    assert.notEqual(
      cell.direction,
      w.fear_inward_direction(cell, ghost),
      `${cell.x},${cell.y}`
    );
  }
});

test("equal positional arrow choices use the random roll", () => {
  const w = loadFear();
  const fruit = { pos: { x: 5, y: 5 } };
  const head = { x: 5, y: 8 };
  w.Math.random = () => 0.25;
  assert.equal(w.fear_preferred_direction(head, "UP", fruit), "LEFT");
  w.Math.random = () => 0.75;
  assert.equal(w.fear_preferred_direction(head, "UP", fruit), "RIGHT");
});

test("arrows shared by multiple fruit face the snake's direction", () => {
  const w = loadFear();
  const left = { Oka: true, pos: { x: 4, y: 4 } };
  const right = { Oka: true, pos: { x: 6, y: 4 } };
  const g = game([left, right], { direction: "DOWN" });
  w.__remixGame = g;
  const grid = w.fear_rebuild_grid(g);
  const shared = grid.get("5,4");
  assert.ok(shared);
  assert.equal(shared.owners.length, 2);
  assert.equal(shared.direction, "DOWN");
  g.oa.direction = "LEFT";
  assert.equal(w.fear_resolve_cell_direction(g, shared), "LEFT");
});

test("two, three, and four-owner arrows follow the live facing direction", () => {
  const w = loadFear();
  const g = game([], { direction: "UP" });
  for (const count of [2, 3, 4]) {
    const cell = {
      direction: "RIGHT",
      owners: Array.from({ length: count }, (_, id) => ({ id })),
    };
    assert.equal(w.fear_resolve_cell_direction(g, cell), "UP");
    g.oa.direction = "DOWN";
    assert.equal(w.fear_resolve_cell_direction(g, cell), "DOWN");
    g.oa.direction = "UP";
  }
});

test("a Fear arrow never resolves opposite the snake head", () => {
  const w = loadFear();
  const g = game([], { direction: "RIGHT" });
  const cell = {
    direction: "LEFT",
    owners: [{ id: 1 }],
  };
  assert.equal(w.fear_resolve_cell_direction(g, cell), "RIGHT");
  g.oa.direction = "UP";
  cell.direction = "DOWN";
  assert.equal(w.fear_resolve_cell_direction(g, cell), "UP");
});

test("mixed fruit/ghost overlap displays the direction collision applies", () => {
  const w = loadFear();
  const fruit = { Oka: false, pos: { x: 4, y: 4 } };
  const ghost = { Oka: true, pos: { x: 6, y: 4 } };
  const g = game([fruit, ghost], { direction: "DOWN" });
  w.__remixGame = g;
  w.fearTurnsRemaining = 3;
  const shared = w.fear_rebuild_grid(g).get("5,4");
  assert.ok(shared);
  assert.equal(shared.owners.length, 2);
  g.oa.direction = "LEFT";
  assert.equal(w.fear_resolve_cell_direction(g, shared), "LEFT");
  assert.ok(w.fear_process_arrow(g, shared));
  assert.equal(g.oa.direction, "LEFT");
});

test("Fear collisions use the complete native Arrow step", () => {
  const w = loadFear();
  const fruit = { Oka: false, pos: { x: 4, y: 4 } };
  const g = game([fruit], { direction: "UP" });
  w.__remixGame = g;
  w.fearTurnsRemaining = 3;
  let stepped = null;
  w.__fearNativeArrowStep = (liveGame, mgr, snake, pos) => {
    stepped = mgr.ka[pos.y][pos.x].direction;
    snake.direction = stepped;
    return stepped;
  };
  const cell = {
    x: 4,
    y: 5,
    direction: "LEFT",
    owners: [{ id: 1, fruit, kind: "temporary" }],
  };

  assert.ok(w.fear_process_arrow(g, cell));
  assert.equal(g.oa.direction, "LEFT");
  assert.equal(stepped, "LEFT");
});

test("reverse Fear arrows use Arrow mode's crash result", () => {
  const w = loadFear();
  const g = game([], { direction: "RIGHT" });
  let crashed = 0;
  g.Oa = () => crashed++;
  const result = w.fear_apply_direction(g, "LEFT");
  assert.equal(result, "CRASH");
  assert.equal(crashed, 1);
  assert.equal(g.oa.direction, "RIGHT");
});

test("corner arrow seats are omitted", () => {
  const w = loadFear();
  const ghost = { Oka: true, pos: { x: 1, y: 0 } };
  const g = game([ghost], { width: 8, height: 8 });
  w.__remixGame = g;
  const grid = w.fear_rebuild_grid(g);
  assert.equal(grid.has("0,0"), false);
});

test("native spawn picker rejects Fear-arrow seats before placement", () => {
  const w = loadFear();
  const ghost = { Oka: true, pos: { x: 6, y: 4 } };
  const g = game([ghost], { width: 12, height: 10 });
  w.__remixGame = g;
  const grid = w.fear_rebuild_grid(g);
  const seat = grid.get("6,5");
  assert.ok(seat);
  const candidates = [
    { x: seat.x, y: seat.y },
    { x: 1, y: 0 }, // one cardinal step from a corner
    { x: 9, y: 7 },
  ];
  let calls = 0;
  const picked = w.fear_spawn_pick(() => candidates[calls++]);
  assert.deepEqual({ x: picked.x, y: picked.y }, { x: 9, y: 7 });
  assert.equal(calls, 3);
  assert.equal(g.wa.ka.length, 1, "picker never commits or relocates fruit");
});

test("native spawn picker fails finitely when every result is blocked", () => {
  const w = loadFear();
  const ghost = { Oka: true, pos: { x: 6, y: 4 } };
  const g = game([ghost], { width: 12, height: 10 });
  w.__remixGame = g;
  w.fear_rebuild_grid(g);
  let calls = 0;
  const picked = w.fear_spawn_pick(() => {
    calls++;
    return { x: 6, y: 5 };
  });
  assert.equal(picked, null);
  assert.equal(calls, 32);
});

test("draw-time reconciliation removes arrows beneath externally moved fruit", () => {
  const w = loadFear();
  const ghost = { Oka: true, pos: { x: 6, y: 4 } };
  const g = game([ghost], { width: 12, height: 10 });
  w.__remixGame = g;
  w.fear_rebuild_grid(g);
  assert.ok(w.__fearGrid.has("6,5"));
  g.wa.ka.push({ Oka: false, pos: { x: 6, y: 5 } });
  const ctx = {
    save() {},
    restore() {},
    setLineDash() {},
    translate() {},
    rotate() {},
    fillRect() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() {},
  };
  w.fear_draw_arrows({ wb: g, ka: ctx, settings: g.settings });
  assert.equal(w.__fearGrid.has("6,5"), false);
});

test("landing resolves the visible Fear arrow before overlapping fruit", () => {
  const w = loadFear();
  const ghost = { Oka: true, pos: { x: 6, y: 4 } };
  const fresh = { Oka: false, pos: { x: 9, y: 7 } };
  const g = game([ghost, fresh], {
    width: 12,
    height: 10,
    headX: 6,
    headY: 5,
  });
  w.__remixGame = g;
  w.fear_rebuild_grid(g);
  assert.ok(w.__fearGrid.has("6,5"));
  fresh.pos.x = 6;
  fresh.pos.y = 5;
  w.__fearLastHeadKey = "6,6";
  w.fear_tick_logic(g);
  assert.equal(g.wa.ka.includes(ghost), false);
  assert.equal(g.wa.ka.includes(fresh), true);
  assert.ok(w.fearTurnsRemaining > 0);
});

test("Fear arrows use native q4E/r4E chevron geometry", () => {
  assert.match(init, /lineWidth = tile \/ 8/);
  assert.match(init, /lineCap = "butt"/);
  assert.match(init, /halfHeight = halfTile \* 0\.6/);
  assert.match(init, /ctx\.moveTo\(-halfWidth, -halfHeight\)/);
  assert.match(init, /ctx\.lineTo\(halfWidth, 0\)/);
  assert.doesNotMatch(init, /lineCap = "round"/);
});

test("Fear arrow collision runs at native post-movement input timing", () => {
  assert.match(init, /Fear tick at native Arrow timing/);
  assert.match(init, /var Kb=U3E\\\(Mb\\\.Rb,fd\\\)/);
  assert.match(init, /\$&if\(window\.isFearActive[\s\S]*fear_tick_logic\(this\)/);
  assert.doesNotMatch(init, /"tick after temp walls"/);
});

test("fixed and Nuke-style opening layouts bypass runtime spawn filtering", () => {
  const w = loadFear();
  const g = game([], { width: 17, height: 15 });
  w.__remixGame = g;
  w.__fearLayoutReady = false;
  let calls = 0;
  const fixedCornerSeat = { x: 1, y: 0 };
  const picked = w.fear_spawn_pick(() => {
    calls++;
    return fixedCornerSeat;
  });
  assert.equal(picked, fixedCornerSeat);
  assert.equal(calls, 1);
});

test("all Poison-style refill wave sizes remain equally paired", () => {
  const waveSizes = [2, 4, 8, 16, 24, 32, 48, 250];
  for (const size of waveSizes) {
    const w = loadFear();
    const g = game([]);
    w.__remixGame = g;
    w.__fearLayoutReady = true;
    const wave = Array.from({ length: size }, (_, i) => ({
      Oka: false,
      pos: { x: i % 12, y: (i / 12) | 0 },
    }));
    g.wa.ka.push(...wave);
    w.fear_pair_new_fruits(g);
    assert.equal(
      wave.filter((fruit) => w.fear_is_ghost(fruit)).length,
      size / 2,
      `wave ${size}`
    );
  }
});

test("Winged or Magnet Slot ghosts use direct contact without arrows", () => {
  const w = loadFear();
  const ghost = {
    Oka: true,
    __slotFearGhost: true,
    pos: { x: 6, y: 4 },
  };
  const g = game([ghost]);
  w.CurrentModeNum = "slot_machine";
  w.isSlotMachineActive = () => true;
  w.__slotActive = 6;
  w.__remixGame = g;
  assert.equal(w.fear_rebuild_grid(g).size, 0);
});

test("Fear duration is half Burger roll and refresh does not decrement", () => {
  const w = loadFear();
  const ghost = { Oka: true, pos: { x: 6, y: 4 } };
  const g = game([ghost]);
  w.__remixGame = g;
  w.fear_activate(g);
  assert.equal(w.fearTurnsRemaining, 10);
  assert.equal(w.__fearRefreshedMove, true);
});

test("directly eating a ghost doubles that Fear instance's duration", () => {
  const w = loadFear();
  const ghost = { Oka: true, pos: { x: 2, y: 6 } };
  const g = game([ghost], {
    headX: 2,
    headY: 7,
    direction: "UP",
  });
  w.__remixGame = g;
  assert.ok(w.fear_direct_contact(g, ghost));
  assert.equal(w.fearTurnsRemaining, 20);
  assert.equal(g.wa.ka.includes(ghost), false);
});

test("ghost top-up spawns at most one ghost per apple eat", () => {
  const w = loadFear();
  const fruits = [
    { Oka: false, pos: { x: 1, y: 1 } },
    { Oka: false, pos: { x: 2, y: 1 } },
    { Oka: false, pos: { x: 3, y: 1 } },
    { Oka: true, pos: { x: 4, y: 1 } },
  ];
  const g = game(fruits);
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);
  for (const fruit of fruits) w.__fearSeenFruits.add(fruit);
  w.fear_reconcile_pairs(g, true);
  w.__fearGhostTopUpThisEat = false;
  let spawned = 0;
  const spawn = (mgr) => {
    spawned++;
    mgr.ka.push({
      Oka: true,
      pos: { x: 5 + spawned, y: 1 },
    });
    return true;
  };
  assert.equal(w.fear_native_ghost_top_up(g.wa, spawn), true);
  assert.equal(w.fear_native_ghost_top_up(g.wa, spawn), false);
  assert.equal(spawned, 1);
  const ghosts = g.wa.ka.filter((f) => w.fear_is_ghost(f)).length;
  const fresh = g.wa.ka.filter((f) => !w.fear_is_ghost(f)).length;
  assert.equal(fresh, 3);
  assert.equal(ghosts, 2);
});

test("ghost top-up is a no-op when ghosts already match fresh", () => {
  const w = loadFear();
  const g = game([
    { Oka: false, pos: { x: 1, y: 1 } },
    { Oka: true, pos: { x: 2, y: 1 } },
  ]);
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);
  let spawned = 0;
  assert.equal(
    w.fear_native_ghost_top_up(g.wa, () => {
      spawned++;
      return true;
    }),
    false
  );
  assert.equal(spawned, 0);
});

test("eating fresh fruit removes only its paired ghost before refill", () => {
  const w = loadFear();
  const ghostA = { Oka: true, pos: { x: 1, y: 1 } };
  const freshA = { Oka: false, pos: { x: 2, y: 1 } };
  const freshB = { Oka: false, pos: { x: 3, y: 1 } };
  const ghostB = { Oka: true, pos: { x: 4, y: 1 } };
  const g = game([ghostA, freshA, freshB, ghostB]);
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);

  assert.equal(w.fear_remove_fresh_pair(g, freshA), 1);
  assert.equal(g.wa.ka.includes(ghostA), false);
  assert.equal(g.wa.ka.includes(freshA), true);
  assert.equal(g.wa.ka.includes(freshB), true);
  assert.equal(g.wa.ka.includes(ghostB), true);
});

test("pair removal preserves ghost <= fruit across every count size", () => {
  const pairCounts = [1, 3, 5, 10, 25, 40, 87, 125];
  for (const pairCount of pairCounts) {
    for (const freshFirst of [true, false]) {
      for (let eatenPair = 0; eatenPair < pairCount; eatenPair++) {
        const w = loadFear();
        const fruits = [];
        for (let pair = 0; pair < pairCount; pair++) {
          const fresh = {
            Oka: false,
            pos: { x: (pair * 2) % 20, y: (pair / 10) | 0 },
          };
          const ghost = {
            Oka: true,
            pos: { x: (pair * 2 + 1) % 20, y: (pair / 10) | 0 },
          };
          fruits.push(...(freshFirst ? [fresh, ghost] : [ghost, fresh]));
        }
        const g = game(fruits);
        w.__remixGame = g;
        w.fear_sync_fruit_types(g);
        const freshObjects = fruits.filter((f) => !w.fear_is_ghost(f));
        const eaten = freshObjects[eatenPair];
        assert.equal(w.fear_remove_fresh_pair(g, eaten), 1);
        const ghostsAfter = g.wa.ka.filter((f) => w.fear_is_ghost(f)).length;
        // The contacted fresh fruit is still present until native eat removes
        // it, so this is equal after that removal; paired refill adds 1:1.
        const fruitAfterNativeEat =
          g.wa.ka.filter((f) => !w.fear_is_ghost(f)).length - 1;
        assert.equal(
          ghostsAfter,
          fruitAfterNativeEat,
          `pairs=${pairCount}, freshFirst=${freshFirst}, eaten=${eatenPair}`
        );
      }
    }
  }
});

test("ghost arrow activates Fear; a temporary arrow consumes it once", () => {
  const w = loadFear();
  const ghost = { Oka: true, pos: { x: 6, y: 4 } };
  const fresh = { Oka: false, pos: { x: 9, y: 6 } };
  const g = game([ghost, fresh], { headX: 6, headY: 5, direction: "UP" });
  w.__remixGame = g;
  let grid = w.fear_rebuild_grid(g);
  assert.ok(w.fear_process_arrow(g, grid.get("6,5")));
  assert.equal(g.wa.ka.includes(ghost), false);
  assert.equal(w.fearTurnsRemaining, 10);
  grid = w.fear_rebuild_grid(g);
  const temporary = [...grid.values()].find((cell) =>
    cell.owners.some((owner) => owner.kind === "temporary")
  );
  assert.ok(temporary);
  assert.ok(w.fear_process_arrow(g, temporary));
  assert.equal(w.fearTurnsRemaining, 0);
  assert.ok(
    [...w.__fearGrid.values()].every((cell) =>
      cell.owners.every((owner) => owner.kind === "ghost")
    )
  );
});

test("10a keeps the native alternating ghost layout", () => {
  const w = loadFear();
  const fruits = [];
  for (let i = 0; i < 20; i++) {
    fruits.push({
      Oka: i % 2 === 0,
      pos: { x: (i % 10) + 1, y: i < 10 ? 2 : 7 },
    });
  }
  const g = game(fruits, { width: 14, count: 3 });
  w.__remixGame = g;
  w.fear_regroup_ten(g);
  w.fear_sync_fruit_types(g);
  assert.equal(fruits.filter((f) => w.fear_is_ghost(f)).length, 10);
  assert.deepEqual(
    fruits.map((f) => w.fear_is_ghost(f)),
    fruits.map((_f, i) => i % 2 === 0)
  );
  assert.ok(fruits.every((f) => !f.Oka));
});

test("10a preserves native positions and never leaves regular fruit on ghost art", () => {
  const w = loadFear();
  w.FEAR_GHOST_TYPE = 99;
  const fruits = Array.from({ length: 2 }, (_, i) => ({
    Oka: i === 0,
    type: 0,
    pos: { x: i, y: 2 },
  }));
  const g = game(fruits, { count: 3 });
  w.__remixGame = g;

  w.fear_regroup_ten(g);
  assert.equal(w.__fearTenSide, "native");

  for (let i = 2; i < 20; i++) {
    fruits.push({
      Oka: i % 2 === 0,
      type: 0,
      pos: { x: i % 10, y: i < 10 ? 2 : 7 },
    });
  }
  w.fear_sync_fruit_types(g);
  assert.equal(fruits.filter((f) => w.fear_is_ghost(f)).length, 10);
  assert.ok(
    fruits.filter((f) => w.fear_is_ghost(f)).every((f) => f.type === 99)
  );
  assert.ok(
    fruits.filter((f) => !w.fear_is_ghost(f)).every((f) => f.type === 0)
  );
  assert.ok(fruits.every((f) => !f.Oka));
});

test("Slot Machine includes dynamic bad Fear badge and special ghost unit", () => {
  const slot = fs.readFileSync(
    new URL("../src/SlotMachineInit.js", import.meta.url),
    "utf8"
  );
  assert.match(slot, /SLOT_MACHINE_POOL\.push\(window\.FEAR_MODE/);
  assert.match(slot, /SLOT_BADGE_POLARITY\[window\.FEAR_MODE \| 0\] = "bad"/);
  assert.match(slot, /ghost\.__slotFearGhost = true/);
  assert.match(slot, /m === \(window\.FEAR_MODE \| 0\)/);
  assert.match(slot, /if \(f\.__slotFearGhost\) return true/);
  assert.match(slot, /same transient empty phase before its special unit/);
  assert.match(
    slot,
    /window\.FEAR_MODE == null \|\| em !== \(window\.FEAR_MODE \| 0\)/
  );
  assert.match(slot, /delete f\.__slotFearGhost/);
  assert.match(slot, /delete el\.__slotFearGhost/);
  assert.doesNotMatch(init, /fear_relocate_illegal/);
  assert.match(slot, /code\.replace\(\/\\bd4E\\\(\/g, "window\.fear_spawn_pick/);
});

test(
  "Fear trophy starts paired ghosts with a cloned arrow grid",
  { skip: !runBrowser },
  async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 42, headless: true });
    try {
      const started = await h.start({
        mode: "fear",
        count: COUNT.ONE,
        size: SIZE.SMALL,
      });
      assert.ok(started);
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        if (!g || !g.wa) return { ok: false };
        window.fear_rebuild_grid(g);
        const fruits = g.wa.ka || [];
        return {
          ok: true,
          mode: window.FEAR_MODE,
          slot: window.SLOT_MACHINE_MODE,
          ghosts: fruits.filter((f) => window.fear_is_ghost(f)).length,
          ghostTypes: fruits
            .filter((f) => window.fear_is_ghost(f))
            .map((f) => f.type),
          fearType: window.FEAR_GHOST_TYPE,
          fresh: fruits.filter((f) => f && !window.fear_is_ghost(f)).length,
          arrows: window.__fearGrid ? window.__fearGrid.size : 0,
          settings: {
            ub: g.settings && g.settings.ub,
            ob: g.settings && g.settings.ob,
            Qa: g.settings && g.settings.Qa,
          },
          poisonGate:
            typeof e7 === "function" && g.settings
              ? e7(g.settings, 10)
              : null,
          errors: window.__remixErrors || [],
        };
      });
      assert.equal(result.ok, true, JSON.stringify(result));
      assert.ok(result.mode < result.slot, JSON.stringify(result));
      assert.equal(result.ghosts, 1, JSON.stringify(result));
      assert.deepEqual(result.ghostTypes, [result.fearType], JSON.stringify(result));
      assert.equal(result.fresh, 1, JSON.stringify(result));
      assert.ok(result.arrows >= 1 && result.arrows <= 4, JSON.stringify(result));
      assert.deepEqual(h.modErrors(), []);
    } finally {
      await h.close();
    }
  }
);

test(
  "Fear Slot badge plants one badge fruit and one persistent ghost",
  { skip: !runBrowser },
  async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 84, headless: true });
    try {
      assert.ok(
        await h.start({
          mode: "slot_machine",
          count: COUNT.ONE,
          size: SIZE.SMALL,
        })
      );
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        g.wa.ka.splice(0, g.wa.ka.length);
        const planted = window.slot_plant_special_unit(window.FEAR_MODE, g);
        window.fear_rebuild_grid(g);
        return {
          planted,
          ghosts: g.wa.ka.filter((f) => f.__slotFearGhost).length,
          ghostTypes: g.wa.ka
            .filter((f) => f.__slotFearGhost)
            .map((f) => f.type),
          fearType: window.FEAR_GHOST_TYPE,
          badgeFruit: g.wa.ka.filter(
            (f) => !f.Oka && typeof f.slotMode === "number"
          ).length,
          arrows: window.__fearGrid.size,
          active: window.isFearActive(),
        };
      });
      assert.equal(result.planted, true, JSON.stringify(result));
      assert.equal(result.ghosts, 1, JSON.stringify(result));
      assert.deepEqual(result.ghostTypes, [result.fearType], JSON.stringify(result));
      assert.equal(result.badgeFruit, 1, JSON.stringify(result));
      assert.ok(result.arrows >= 1, JSON.stringify(result));
      assert.equal(result.active, true, JSON.stringify(result));
      assert.deepEqual(h.modErrors(), []);
    } finally {
      await h.close();
    }
  }
);

test(
  "all live count openings preserve native totals and Poison pairing",
  { skip: !runBrowser },
  async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 606, headless: true });
    try {
      assert.ok(
        await h.start({
          mode: "fear",
          count: COUNT.ONE,
          size: SIZE.NORMAL,
        })
      );
      const rows = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16];
        return indices.map((index) => {
          g.settings.Ca = index;
          g.settings.ka = index;
          window.fear_reset_state();
          g.wa.reset();
          window.fear_rebuild_grid(g);
          const fruit = g.wa.ka || [];
          return {
            index,
            total: fruit.length,
            ghosts: fruit.filter((f) => window.fear_is_ghost(f)).length,
            fresh: fruit.filter(
              (f) => f && !window.fear_is_ghost(f)
            ).length,
            wrongGhostTypes: fruit.filter(
              (f) => window.fear_is_ghost(f) && f.type !== window.FEAR_GHOST_TYPE
            ).length,
            wrongFreshTypes: fruit.filter(
              (f) =>
                f &&
                !window.fear_is_ghost(f) &&
                f.type === window.FEAR_GHOST_TYPE
            ).length,
          };
        });
      });
      const expectedTotals = new Map([
        [0, 2],
        [1, 6],
        [2, 10],
        [3, 20],
        [4, 2],
        [5, 2],
        [6, 10],
        [7, 50],
        [8, 80],
        [9, 174],
        [10, 251],
        [11, 0], // Apple Bomb's native incompatible opening
        [13, 2],
        [14, 2],
        [15, 2],
        [16, 2],
      ]);
      for (const row of rows) {
        assert.equal(
          row.total,
          expectedTotals.get(row.index),
          JSON.stringify(row)
        );
        assert.ok(
          Math.abs(row.ghosts - row.fresh) <= 1,
          JSON.stringify(row)
        );
      }
      const ten = rows.find((row) => row.index === 3);
      assert.equal(ten.ghosts, 10);
      assert.equal(ten.fresh, 10);
      assert.equal(ten.wrongGhostTypes, 0);
      assert.equal(ten.wrongFreshTypes, 0);
      assert.deepEqual(h.modErrors(), []);
    } finally {
      await h.close();
    }
  }
);

test(
  "Dice fresh eat despawns its ghost and refills rolled ghost pairs",
  { skip: !runBrowser },
  async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 919, headless: true });
    try {
      assert.ok(
        await h.start({
          mode: "fear",
          count: COUNT.DICE,
          size: SIZE.NORMAL,
        })
      );
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.fear_rebuild_grid(g);
        const fresh = g.wa.ka.find((f) => !window.fear_is_ghost(f));
        const ghost = g.wa.ka.find((f) => window.fear_is_ghost(f));
        const target = window.fear_step(
          g.oa.ka[0],
          g.oa.direction,
          g
        );
        if (!fresh || !ghost || !target) return { ok: false };
        fresh.pos.x = target.x;
        fresh.pos.y = target.y;
        ghost.__fearOldDiceGhost = true;
        window.fear_rebuild_grid(g);
        const score = g.Sh | 0;
        g.tick();
        return {
          ok: true,
          oldGhostPresent: g.wa.ka.some((f) => f.__fearOldDiceGhost),
          ghosts: g.wa.ka.filter((f) => window.fear_is_ghost(f)).length,
          fresh: g.wa.ka.filter((f) => !window.fear_is_ghost(f)).length,
          scoreGain: (g.Sh | 0) - score,
        };
      });
      assert.equal(result.ok, true, JSON.stringify(result));
      assert.equal(result.oldGhostPresent, false, JSON.stringify(result));
      assert.equal(result.scoreGain, 1, JSON.stringify(result));
      assert.ok(result.ghosts >= 1, JSON.stringify(result));
      assert.equal(result.ghosts, result.fresh, JSON.stringify(result));
      assert.deepEqual(h.modErrors(), []);
    } finally {
      await h.close();
    }
  }
);

test(
  "repeated 5a fruit eats never accumulate extra ghosts",
  { skip: !runBrowser },
  async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 1234, headless: true });
    try {
      assert.ok(
        await h.start({
          mode: "fear",
          count: COUNT.FIVE,
          size: SIZE.NORMAL,
        })
      );
      const rows = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const out = [];
        for (let eat = 0; eat < 12; eat++) {
          window.fear_rebuild_grid(g);
          const fresh = g.wa.ka.find((f) => !window.fear_is_ghost(f));
          const head = g.oa.ka[0];
          const box = window.fear_box(g);
          const directions = ["RIGHT", "DOWN", "LEFT", "UP"];
          const direction = directions.find((dir) => {
            const p = window.fear_step(head, dir, g);
            return (
              p &&
              p.x > 1 &&
              p.y > 1 &&
              p.x < box.width - 2 &&
              p.y < box.height - 2
            );
          });
          if (!fresh || !direction || g.nj) break;
          g.oa.direction = direction;
          g.oa.Ca = direction;
          g.oa.yb = "NONE";
          g.oa.Ga = "NONE";
          const target = window.fear_step(head, direction, g);
          fresh.pos.x = target.x;
          fresh.pos.y = target.y;
          window.fear_rebuild_grid(g);
          g.tick();
          out.push({
            total: g.wa.ka.length,
            ghosts: g.wa.ka.filter((f) => window.fear_is_ghost(f)).length,
            fresh: g.wa.ka.filter((f) => !window.fear_is_ghost(f)).length,
          });
        }
        return out;
      });
      assert.equal(rows.length, 12, JSON.stringify(rows));
      for (const row of rows) {
        assert.deepEqual(row, { total: 10, ghosts: 5, fresh: 5 });
      }
      assert.deepEqual(h.modErrors(), []);
    } finally {
      await h.close();
    }
  }
);

test(
  "non-last Dice fruit removes one pair without spawning a ghost",
  { skip: !runBrowser },
  async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 333, headless: true });
    try {
      await h.start({
        mode: "fear",
        count: COUNT.DICE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.fear_rebuild_grid(g);
        const baseFresh = g.wa.ka.find((f) => !window.fear_is_ghost(f));
        const baseGhost = g.wa.ka.find((f) => window.fear_is_ghost(f));
        const copy = (source, x, y, ghost) => {
          const fruit = Object.assign(
            Object.create(Object.getPrototypeOf(source)),
            source
          );
          fruit.pos = source.pos.clone();
          fruit.pos.x = x;
          fruit.pos.y = y;
          delete fruit.__fearOwnerId;
          delete fruit.__fearPairId;
          fruit.__fearGhost = ghost;
          fruit.Oka = false;
          return fruit;
        };
        g.wa.ka.push(
          copy(baseFresh, 3, 3, false),
          copy(baseGhost, 4, 3, true),
          copy(baseFresh, 5, 3, false),
          copy(baseGhost, 6, 3, true)
        );
        window.fear_reconcile_pairs(g, true);
        const target = g.wa.ka.find((f) => !window.fear_is_ghost(f));
        const next = window.fear_step(g.oa.ka[0], g.oa.direction, g);
        target.pos.x = next.x;
        target.pos.y = next.y;
        window.fear_rebuild_grid(g);
        g.tick();
        return {
          total: g.wa.ka.length,
          ghosts: g.wa.ka.filter((f) => window.fear_is_ghost(f)).length,
          fresh: g.wa.ka.filter((f) => !window.fear_is_ghost(f)).length,
        };
      });
      assert.deepEqual(result, { total: 4, ghosts: 2, fresh: 2 });
      assert.deepEqual(h.modErrors(), []);
    } finally {
      await h.close();
    }
  }
);
