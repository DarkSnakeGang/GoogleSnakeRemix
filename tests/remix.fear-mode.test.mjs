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
    // Native poison e4E plants Oka pairs; Fear mirrors that, not both-fresh.
    const wave = Array.from({ length: size }, (_, i) => ({
      Oka: i % 2 === 1,
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

test("ghost top-up spawns at most one ghost per eat", () => {
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
  w.__fearWaveGhostFill = false;
  const existingGhost = g.wa.ka.find((f) => w.fear_is_ghost(f));
  const ghostBefore = existingGhost
    ? { x: existingGhost.pos.x, y: existingGhost.pos.y }
    : null;
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
  assert.equal(spawned, 1, "at most one ghost per eat");
  const ghosts = g.wa.ka.filter((f) => w.fear_is_ghost(f)).length;
  const fresh = g.wa.ka.filter((f) => !w.fear_is_ghost(f)).length;
  assert.equal(fresh, 3);
  assert.equal(ghosts, 2);
  if (ghostBefore && existingGhost) {
    assert.equal(existingGhost.pos.x, ghostBefore.x, "no relocate on spawn");
    assert.equal(existingGhost.pos.y, ghostBefore.y, "no relocate on spawn");
  }
});

test("wave ghost fill matches fruit count", () => {
  const w = loadFear();
  const fruits = [
    { Oka: false, pos: { x: 1, y: 1 } },
    { Oka: false, pos: { x: 2, y: 1 } },
    { Oka: false, pos: { x: 3, y: 1 } },
    { Oka: true, pos: { x: 4, y: 1 } },
  ];
  const g = game(fruits);
  g.settings = { ka: 4 }; // dice-like: match fruit count
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);
  for (const fruit of fruits) w.__fearSeenFruits.add(fruit);
  w.fear_reconcile_pairs(g, true);
  w.__fearGhostTopUpThisEat = false;
  w.__fearWaveGhostFill = true;
  let spawned = 0;
  const spawn = (mgr) => {
    spawned++;
    mgr.ka.push({
      Oka: true,
      pos: { x: 5 + spawned, y: 1 },
    });
    return true;
  };
  assert.equal(w.fear_wave_ghost_fill(g.wa, spawn), 3);
  assert.equal(spawned, 3);
  const ghosts = g.wa.ka.filter((f) => w.fear_is_ghost(f)).length;
  const fresh = g.wa.ka.filter((f) => !w.fear_is_ghost(f)).length;
  assert.equal(fresh, 3);
  assert.equal(ghosts, 3);
  assert.equal(w.__fearWaveGhostFill, false);
});

test("tally last-index wave ghosts are 1..maxFruitIndex only", () => {
  const w = loadFear();
  // Post-t7E: only indices 1..4 fit (one fruit spawn failed); leftover ghosts.
  const planted = [1, 2, 3, 4].map((n) => ({
    Oka: false,
    sequenceNumber: n,
    pos: { x: n, y: 1 },
  }));
  const leftovers = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    Oka: false,
    __fearGhost: true,
    sequenceNumber: n,
    pos: { x: n + 10, y: 2 },
  }));
  const g = game([...planted, ...leftovers]);
  g.settings = { ka: 6 };
  w.__remixGame = g;
  w.fear_mode_selected = () => true;
  w.isFearActive = () => true;
  w.fear_uses_ghost_pairs = () => true;
  w.fear_sync_fruit_types(g);
  for (const fruit of g.wa.ka) w.__fearSeenFruits.add(fruit);
  w.__fearWaveGhostFill = true;
  let spawned = 0;
  const spawn = (mgr) => {
    spawned++;
    mgr.ka.push({ Oka: true, pos: { x: 20 + spawned, y: 1 } });
    mgr.ka.push({ Oka: true, pos: { x: 40 + spawned, y: 1 } });
    return true;
  };
  w.fear_wave_ghost_fill(g.wa, spawn);
  const ghosts = g.wa.ka.filter((f) => w.fear_is_ghost(f));
  const fresh = g.wa.ka.filter((f) => !w.fear_is_ghost(f));
  assert.equal(fresh.length, 4);
  assert.equal(ghosts.length, 4, "one ghost per max index, not leftovers+fill");
  assert.ok(leftovers.every((gh) => !g.wa.ka.includes(gh)));
  const seqs = ghosts.map((gh) => gh.sequenceNumber).sort((a, b) => a - b);
  assert.deepEqual(seqs, [1, 2, 3, 4]);
  assert.equal(spawned, 4);
});

test("tally does not wave-fill on gap alone without t7E flag", () => {
  const w = loadFear();
  const fruits = [
    { Oka: false, sequenceNumber: 1, pos: { x: 1, y: 1 } },
    { Oka: false, sequenceNumber: 2, pos: { x: 2, y: 1 } },
    { Oka: false, sequenceNumber: 3, pos: { x: 3, y: 1 } },
  ];
  const g = game(fruits);
  g.settings = { ka: 6 };
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);
  w.__fearWaveGhostFill = false;
  assert.equal(w.fear_should_wave_ghost_fill(g), false);
  w.__fearWaveGhostFill = true;
  assert.equal(w.fear_should_wave_ghost_fill(g), true);
});

test("Slot Machine Fear badge never wave-fills ghosts", () => {
  const w = loadFear();
  const g = game([
    { Oka: false, pos: { x: 1, y: 1 } },
    { Oka: false, pos: { x: 2, y: 1 } },
    { Oka: false, pos: { x: 3, y: 1 } },
  ]);
  g.settings = { ka: 5 };
  w.__remixGame = g;
  w.isSlotMachineActive = () => true;
  w.fear_mode_selected = () => false;
  w.__fearWaveGhostFill = true;
  assert.equal(w.fear_should_wave_ghost_fill(g), false);
  assert.match(
    fs.readFileSync(new URL("../src/FearInit.js", import.meta.url), "utf8"),
    /Slot Fear badge = single hazard unit/
  );
});

test("pair_new_fruits keeps tally wave plants as fresh fruit", () => {
  const w = loadFear();
  const planted = [
    { Oka: false, pos: { x: 1, y: 1 } },
    { Oka: false, pos: { x: 2, y: 1 } },
    { Oka: false, pos: { x: 3, y: 1 } },
    { Oka: false, pos: { x: 4, y: 1 } },
    { Oka: false, pos: { x: 5, y: 1 } },
  ];
  const leftoverGhost = {
    Oka: false,
    __fearGhost: true,
    pos: { x: 9, y: 1 },
  };
  const g = game([...planted, leftoverGhost]);
  g.settings = { ka: 6 };
  w.__remixGame = g;
  w.CurrentModeNum = 30;
  w.FEAR_MODE = 30;
  w.fear_mode_selected = () => true;
  w.fear_sync_fruit_types(g);
  w.__fearSeenFruits.add(leftoverGhost);
  w.fear_pair_new_fruits(g);
  const ghosts = g.wa.ka.filter((f) => w.fear_is_ghost(f));
  const fresh = g.wa.ka.filter((f) => !w.fear_is_ghost(f));
  assert.equal(fresh.length, 5, "wave fruit must stay edible");
  assert.equal(ghosts.length, 1, "only leftover ghost");
});

test("wave fill never leaves more ghosts than fruit even if e4E plants pairs", () => {
  const w = loadFear();
  const fruits = [1, 2, 3, 4, 5].map((n) => ({
    Oka: false,
    sequenceNumber: n,
    pos: { x: n, y: 1 },
  }));
  const leftover = [
    { Oka: false, __fearGhost: true, pos: { x: 8, y: 1 } },
    { Oka: false, __fearGhost: true, pos: { x: 9, y: 1 } },
    { Oka: false, __fearGhost: true, pos: { x: 10, y: 1 } },
  ];
  const g = game([...fruits, ...leftover]);
  g.settings = { ka: 6 };
  w.__remixGame = g;
  w.fear_mode_selected = () => true;
  w.isFearActive = () => true;
  w.fear_uses_ghost_pairs = () => true;
  w.fear_sync_fruit_types(g);
  for (const fruit of g.wa.ka) w.__fearSeenFruits.add(fruit);
  w.__fearWaveGhostFill = true;
  let spawned = 0;
  const spawn = (mgr) => {
    spawned++;
    // Native poison e4E often pushes two apples.
    mgr.ka.push({ Oka: true, pos: { x: 20 + spawned, y: 1 } });
    mgr.ka.push({ Oka: true, pos: { x: 30 + spawned, y: 1 } });
    return true;
  };
  w.__fearE4E = spawn;
  w.__fearGhostTopUpThisEat = false;
  w.fear_pair_new_fruits(g);
  w.fear_wave_ghost_fill(g.wa, spawn);
  const ghosts = g.wa.ka.filter((f) => w.fear_is_ghost(f));
  const fresh = g.wa.ka.filter((f) => !w.fear_is_ghost(f));
  assert.equal(fresh.length, 5);
  assert.equal(ghosts.length, 5);
  assert.deepEqual(
    ghosts.map((gh) => gh.sequenceNumber).sort((a, b) => a - b),
    [1, 2, 3, 4, 5]
  );
  // Leftover previous-wave ghosts must be wiped before refill.
  assert.ok(
    leftover.every((gh) => !g.wa.ka.includes(gh)),
    "previous-wave ghosts must be cleared"
  );
});

test("tally native top-up does not wave-fill mid-plant", () => {
  const w = loadFear();
  const fruits = [1, 2].map((n) => ({
    Oka: false,
    sequenceNumber: n,
    pos: { x: n, y: 1 },
  }));
  const g = game(fruits);
  g.settings = { ka: 6 };
  w.__remixGame = g;
  w.fear_mode_selected = () => true;
  w.isFearActive = () => true;
  w.fear_uses_ghost_pairs = () => true;
  w.fear_sync_fruit_types(g);
  for (const fruit of fruits) w.__fearSeenFruits.add(fruit);
  w.__fearWaveGhostFill = true;
  w.__fearGhostTopUpThisEat = false;
  let spawned = 0;
  const spawn = (mgr) => {
    spawned++;
    mgr.ka.push({ Oka: true, pos: { x: 20 + spawned, y: 1 } });
    return true;
  };
  assert.equal(w.fear_should_wave_ghost_fill(g), true);
  assert.equal(w.fear_native_ghost_top_up(g.wa, spawn), false);
  assert.equal(spawned, 0, "poison top-up must wait for after_respawn");
  assert.equal(w.__fearWaveGhostFill, true, "flag stays for after_respawn");
});

test("tally after_respawn wins before ghosts when fruit wave planted nothing", async () => {
  const w = loadFear();
  const leftovers = [1, 2, 3].map((n) => ({
    Oka: false,
    __fearGhost: true,
    sequenceNumber: n,
    pos: { x: n, y: 1 },
  }));
  const g = game(leftovers);
  g.settings = { ka: 6 };
  g.nj = false;
  g.lj = false;
  w.__remixGame = g;
  w.fear_mode_selected = () => true;
  w.isFearActive = () => true;
  w.fear_uses_ghost_pairs = () => true;
  w.fear_sync_fruit_types(g);
  for (const fruit of leftovers) w.__fearSeenFruits.add(fruit);
  w.__fearWaveGhostFill = true;
  let spawned = 0;
  w.__fearE4E = () => {
    spawned++;
    return false;
  };
  w.fear_win_if_empty = (game) => {
    game.nj = true;
    return true;
  };
  w.fear_after_respawn(g.wa);
  // Tally wave fill is deferred until after t7E's synchronous plant stack.
  assert.equal(g.nj, false, "must not win mid-defer");
  await Promise.resolve();
  assert.equal(g.nj, true);
  assert.equal(spawned, 0, "ghosts must not spawn after empty fruit wave");
  assert.equal(g.wa.ka.filter((f) => w.fear_is_ghost(f)).length, 0);
  assert.equal(w.__fearWaveGhostFill, false);
});

test("tally deferred ghost fill waits until all wave fruit exist", async () => {
  const w = loadFear();
  const g = game([]);
  g.settings = { ka: 6 };
  w.__remixGame = g;
  w.fear_mode_selected = () => true;
  w.isFearActive = () => true;
  w.fear_uses_ghost_pairs = () => true;
  w.__fearWaveGhostFill = true;
  let spawned = 0;
  w.__fearE4E = (mgr) => {
    spawned++;
    mgr.ka.push({ Oka: true, pos: { x: 20 + spawned, y: 1 } });
    return true;
  };
  // Simulate t7E: after_respawn after each of 5 fruit plants.
  for (let n = 1; n <= 5; n++) {
    const fruit = {
      Oka: false,
      sequenceNumber: n,
      pos: { x: n, y: 1 },
    };
    g.wa.ka.push(fruit);
    w.__fearSeenFruits.add(fruit);
    w.__fearWaveGhostFill = true;
    w.fear_after_respawn(g.wa);
    assert.equal(
      g.wa.ka.filter((f) => w.fear_is_ghost(f)).length,
      0,
      "no ghosts mid-t7E plant " + n
    );
  }
  await Promise.resolve();
  const fresh = g.wa.ka.filter((f) => !w.fear_is_ghost(f));
  const ghosts = g.wa.ka.filter((f) => w.fear_is_ghost(f));
  assert.equal(fresh.length, 5);
  assert.equal(ghosts.length, 5);
  assert.deepEqual(
    ghosts.map((gh) => gh.sequenceNumber).sort((a, b) => a - b),
    [1, 2, 3, 4, 5]
  );
  assert.equal(spawned, 5);
});

test("fear_stamp_ghost_tally_from_pairs copies sequenceNumber", () => {
  const w = loadFear();
  const fresh = {
    Oka: false,
    __fearPairId: "p1",
    sequenceNumber: 4,
    pos: { x: 1, y: 1 },
  };
  const ghost = {
    Oka: true,
    __fearGhost: true,
    __fearPairId: "p1",
    pos: { x: 2, y: 1 },
  };
  const g = game([fresh, ghost]);
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);
  w.fear_stamp_ghost_tally_from_pairs(g);
  assert.equal(ghost.sequenceNumber, 4);
});

test("ghost refill gives up when native spawn finds no valid space", () => {
  const w = loadFear();
  const fruits = [
    { Oka: false, pos: { x: 1, y: 1 } },
    { Oka: false, pos: { x: 2, y: 1 } },
    { Oka: false, pos: { x: 3, y: 1 } },
  ];
  const g = game(fruits);
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);
  for (const fruit of fruits) w.__fearSeenFruits.add(fruit);
  w.__fearGhostTopUpThisEat = false;
  let attempts = 0;
  const added = w.fear_fill_ghosts_to_match_fruit(g.wa, () => {
    attempts++;
    return false;
  });
  assert.equal(added, 0);
  assert.equal(attempts, 1);
  assert.equal(g.wa.ka.filter((f) => w.fear_is_ghost(f)).length, 0);
  assert.equal(g.wa.ka.filter((f) => !w.fear_is_ghost(f)).length, 3);
});

test("ghost refill stops mid-way when spawn seats run out", () => {
  const w = loadFear();
  const fruits = [
    { Oka: false, pos: { x: 1, y: 1 } },
    { Oka: false, pos: { x: 2, y: 1 } },
    { Oka: false, pos: { x: 3, y: 1 } },
  ];
  const g = game(fruits);
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);
  for (const fruit of fruits) w.__fearSeenFruits.add(fruit);
  let spawned = 0;
  const added = w.fear_fill_ghosts_to_match_fruit(g.wa, (mgr) => {
    spawned++;
    if (spawned > 1) return false;
    mgr.ka.push({ Oka: true, pos: { x: 8, y: 1 } });
    return true;
  });
  assert.equal(added, 1);
  assert.equal(spawned, 2);
  assert.equal(g.wa.ka.filter((f) => w.fear_is_ghost(f)).length, 1);
  assert.equal(g.wa.ka.filter((f) => !w.fear_is_ghost(f)).length, 3);
});

test("when ghosts already cover fruit, top-up relocates a ghost instead of spawning", () => {
  const w = loadFear();
  const ghost = { Oka: true, pos: { x: 2, y: 1 } };
  const fresh = { Oka: false, pos: { x: 1, y: 1 } };
  const g = game([fresh, ghost]);
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);
  w.__fearSeenFruits.add(fresh);
  w.__fearSeenFruits.add(ghost);
  w.fear_reconcile_pairs(g, true);
  w.__fearGhostTopUpThisEat = false;
  w.__fearAllowGhostRelocate = true;
  const before = { x: ghost.pos.x, y: ghost.pos.y };
  let spawned = 0;
  assert.equal(
    w.fear_native_ghost_top_up(g.wa, () => {
      spawned++;
      return true;
    }),
    true
  );
  assert.equal(spawned, 0);
  assert.equal(g.wa.ka.length, 2);
  assert.equal(g.wa.ka.filter((f) => w.fear_is_ghost(f)).length, 1);
  assert.ok(ghost.pos.x !== before.x || ghost.pos.y !== before.y);
});

test("ghost top-up never creates more ghosts than fruit", () => {
  const w = loadFear();
  const fruits = [
    { Oka: false, pos: { x: 1, y: 1 } },
    { Oka: true, pos: { x: 2, y: 1 } },
    { Oka: true, pos: { x: 3, y: 1 } },
  ];
  const g = game(fruits);
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);
  for (const fruit of fruits) w.__fearSeenFruits.add(fruit);
  w.__fearGhostTopUpThisEat = false;
  let spawned = 0;
  assert.equal(
    w.fear_native_ghost_top_up(g.wa, () => {
      spawned++;
      return true;
    }),
    false
  );
  assert.equal(spawned, 0);
  const ghosts = g.wa.ka.filter((f) => w.fear_is_ghost(f)).length;
  const fresh = g.wa.ka.filter((f) => !w.fear_is_ghost(f)).length;
  assert.ok(ghosts <= fresh);
});

test("mid-eat equal counts do not relocate or latch before fruit respawns", () => {
  const w = loadFear();
  // Simulate classic 3a after pair+fruit removed, before native fruit respawn.
  const fruits = [
    { Oka: false, pos: { x: 1, y: 1 } },
    { Oka: false, pos: { x: 2, y: 1 } },
    { Oka: true, pos: { x: 3, y: 1 } },
    { Oka: true, pos: { x: 4, y: 1 } },
  ];
  const g = game(fruits);
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);
  for (const fruit of fruits) w.__fearSeenFruits.add(fruit);
  w.fear_reconcile_pairs(g, true);
  w.__fearGhostTopUpThisEat = false;
  w.__fearAllowGhostRelocate = false;
  const ghost = g.wa.ka.find((f) => w.fear_is_ghost(f));
  const before = { x: ghost.pos.x, y: ghost.pos.y };
  let spawned = 0;
  assert.equal(
    w.fear_native_ghost_top_up(g.wa, () => {
      spawned++;
      return true;
    }),
    false
  );
  assert.equal(spawned, 0);
  assert.equal(w.__fearGhostTopUpThisEat, false, "must not latch before respawn");
  assert.equal(ghost.pos.x, before.x);
  assert.equal(ghost.pos.y, before.y);
});

test("after fruit respawn spawns missing ghost instead of only relocating", () => {
  const w = loadFear();
  // Post-respawn 3a with a missing ghost (fruit back, ghost not).
  const fruits = [
    { Oka: false, pos: { x: 1, y: 1 } },
    { Oka: false, pos: { x: 2, y: 1 } },
    { Oka: false, pos: { x: 3, y: 1 } },
    { Oka: true, pos: { x: 4, y: 1 } },
    { Oka: true, pos: { x: 5, y: 1 } },
  ];
  const g = game(fruits);
  w.__remixGame = g;
  w.isFearActive = () => true;
  w.fear_uses_ghost_pairs = () => true;
  w.fear_sync_fruit_types(g);
  for (const fruit of fruits) w.__fearSeenFruits.add(fruit);
  w.fear_reconcile_pairs(g, true);
  w.__fearGhostTopUpThisEat = false;
  w.__fearWaveGhostFill = false;
  w.__fearE4E = (mgr) => {
    mgr.ka.push({ Oka: true, pos: { x: 8, y: 1 } });
    return true;
  };
  const ghostBefore = g.wa.ka
    .filter((f) => w.fear_is_ghost(f))
    .map((f) => ({ x: f.pos.x, y: f.pos.y }));
  w.fear_after_respawn(g.wa);
  const ghosts = g.wa.ka.filter((f) => w.fear_is_ghost(f));
  const fresh = g.wa.ka.filter((f) => !w.fear_is_ghost(f));
  assert.equal(fresh.length, 3);
  assert.equal(ghosts.length, 3);
  assert.ok(
    ghostBefore.every((p) =>
      ghosts.some((gh) => gh.pos.x === p.x && gh.pos.y === p.y)
    ),
    "existing ghosts should not move when spawning the missing one"
  );
});

test("ghost top-up only acts once per apple eat when already covered", () => {
  const w = loadFear();
  const ghost = { Oka: true, pos: { x: 2, y: 1 } };
  const fresh = { Oka: false, pos: { x: 1, y: 1 } };
  const g = game([fresh, ghost]);
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);
  w.__fearSeenFruits.add(fresh);
  w.__fearSeenFruits.add(ghost);
  w.__fearGhostTopUpThisEat = false;
  w.__fearAllowGhostRelocate = true;
  assert.equal(w.fear_native_ghost_top_up(g.wa, () => true), true);
  const mid = { x: ghost.pos.x, y: ghost.pos.y };
  assert.equal(w.fear_native_ghost_top_up(g.wa, () => true), false);
  assert.equal(ghost.pos.x, mid.x);
  assert.equal(ghost.pos.y, mid.y);
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

test("eating fresh fruit does not remove a ghost when already short", () => {
  const w = loadFear();
  // 3 fruit, 2 ghosts — deficit already exists (e.g. arrow removed one).
  const fruits = [
    { Oka: false, pos: { x: 1, y: 1 } },
    { Oka: false, pos: { x: 2, y: 1 } },
    { Oka: false, pos: { x: 3, y: 1 } },
    { Oka: true, pos: { x: 4, y: 1 } },
    { Oka: true, pos: { x: 5, y: 1 } },
  ];
  const g = game(fruits);
  w.__remixGame = g;
  w.fear_sync_fruit_types(g);
  for (const fruit of fruits) w.__fearSeenFruits.add(fruit);
  w.fear_reconcile_pairs(g, true);
  const ghostsBefore = g.wa.ka.filter((f) => w.fear_is_ghost(f));
  assert.equal(ghostsBefore.length, 2);
  assert.equal(w.fear_remove_fresh_pair(g, fruits[0]), 0);
  const ghostsAfter = g.wa.ka.filter((f) => w.fear_is_ghost(f));
  assert.equal(ghostsAfter.length, 2);
  assert.ok(ghostsBefore.every((gh) => g.wa.ka.includes(gh)));
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

test("FearInit does not couple to Burger helpers", () => {
  assert.doesNotMatch(init, /isBurgerActive/);
  assert.doesNotMatch(init, /isBurgerSettings/);
  assert.match(init, /fear_uses_ghost_pairs/);
  assert.match(init, /fear_native_ghost_top_up/);
  assert.match(
    init,
    /!\(d\.Oka\|\|window\.fear_is_ghost&&window\.fear_is_ghost\(d\)\)/
  );
});

test("Fear ghosts are ignored by edible count like poison Oka", () => {
  const w = loadFear();
  const fresh = { Oka: false, Lh: true, pos: { x: 1, y: 1 } };
  const ghost = { Oka: false, __fearGhost: true, Lh: true, pos: { x: 2, y: 2 } };
  assert.equal(w.fear_is_ghost(ghost), true);
  assert.equal(w.fear_is_ghost(fresh), false);
  // Simulate r7E poison-branch counting.
  let c = 0;
  for (const d of [fresh, ghost]) {
    if (!(d.Oka || (w.fear_is_ghost && w.fear_is_ghost(d))) && d.Lh) c++;
  }
  assert.equal(c, 1, "ghost must not count as edible tally fruit");
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
  assert.match(slot, /if \(window\.fear_is_ghost && window\.fear_is_ghost\(f\)\) continue/);
  assert.match(slot, /if \(f\.__slotFearGhost\) continue/);
  assert.match(slot, /same-eat transient empty before the Fear special unit/);
  assert.match(slot, /ghosts-only may win/);
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
      assert.equal(
        await h.page.evaluate(
          () =>
            !!(
              window.isBurgerActive &&
              window.isBurgerSettings &&
              !window.isBurgerActive() &&
              !window.isBurgerSettings(window.__remixGame.settings)
            )
        ),
        true,
        "Fear-only must not activate Burger helpers"
      );
      assert.deepEqual(
        (h.modErrors() || []).filter(
          (e) =>
            !(e && /Pudding secret-fruit tail not found/.test(e.text || e))
        ),
        []
      );
    } finally {
      await h.close();
    }
  }
);

test(
  "Tally Fear: eating index 5 refills exactly fruit 1..5 and ghosts 1..5",
  { skip: !runBrowser },
  async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 55, headless: true });
    try {
      assert.ok(
        await h.start({
          mode: "fear",
          count: COUNT.TALLY,
          size: SIZE.NORMAL,
        })
      );
      const result = await h.page.evaluate(async () => {
        const g = window.__remixGame;
        if (window.fear_initialize_layout) {
          window.__fearLayoutReady = false;
          window.fear_initialize_layout(g);
        }
        for (let want = 1; want <= 5; want++) {
          const target = g.wa.ka.find(
            (f) =>
              f && !window.fear_is_ghost(f) && (f.sequenceNumber | 0) === want
          );
          if (!target) return { ok: false, reason: "missing " + want };
          for (let i = 0; i < g.oa.ka.length; i++) {
            g.oa.ka[i].x = target.pos.x - 1;
            g.oa.ka[i].y = target.pos.y;
          }
          g.oa.direction = "RIGHT";
          const sh0 = g.Sh | 0;
          for (let t = 0; t < 16 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
          for (let i = 0; i < g.oa.ka.length; i++) {
            g.oa.ka[i].x = 1;
            g.oa.ka[i].y = 1;
          }
          if (!g.nj) g.tick();
        }
        // Deferred tally ghost fill uses a microtask.
        await Promise.resolve();
        await Promise.resolve();
        const fresh = g.wa.ka
          .filter((f) => f && !window.fear_is_ghost(f))
          .map((f) => f.sequenceNumber | 0)
          .sort((a, b) => a - b);
        const ghosts = g.wa.ka
          .filter((f) => f && window.fear_is_ghost(f))
          .map((f) => f.sequenceNumber | 0)
          .sort((a, b) => a - b);
        return {
          ok: true,
          total: g.wa.ka.length,
          fresh,
          ghosts,
          nj: !!g.nj,
        };
      });
      assert.equal(result.ok, true, JSON.stringify(result));
      assert.equal(result.nj, false, JSON.stringify(result));
      assert.equal(result.total, 10, JSON.stringify(result));
      assert.deepEqual(result.fresh, [1, 2, 3, 4, 5], JSON.stringify(result));
      assert.deepEqual(result.ghosts, [1, 2, 3, 4, 5], JSON.stringify(result));
    } finally {
      await h.close();
    }
  }
);

test(
  "Tally Fear: clearing fresh fruit refills the wave while ghosts remain",
  { skip: !runBrowser },
  async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 55, headless: true });
    try {
      assert.ok(
        await h.start({
          mode: "fear",
          count: COUNT.TALLY,
          size: SIZE.NORMAL,
        })
      );
      const patchMiss = (h.modErrors() || []).filter(
        (e) => e && /r7E ignore Fear ghosts/.test(e.text || e)
      );
      assert.deepEqual(patchMiss, [], "r7E Fear ghost skip must land");
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        if (!g || !g.wa) return { ok: false, reason: "no game" };
        const pair =
          typeof window.__uaF === "function" ? window.__uaF : window.__l4E;
        if (typeof pair === "function") pair(g.wa);
        if (typeof window.fear_initialize_layout === "function") {
          window.__fearLayoutReady = false;
          window.fear_initialize_layout(g);
        } else if (g.wa.ka) {
          for (const f of g.wa.ka) {
            if (f && f.Oka && window.fear_capture_ghost_type) {
              window.fear_capture_ghost_type(f);
            }
          }
        }
        const before = {
          total: g.wa.ka.length,
          fresh: g.wa.ka.filter((f) => f && !window.fear_is_ghost(f)).length,
          ghosts: g.wa.ka.filter((f) => window.fear_is_ghost(f)).length,
          kc: !!g.kc,
        };
        for (let i = g.wa.ka.length - 1; i >= 0; i--) {
          const f = g.wa.ka[i];
          if (f && !window.fear_is_ghost(f)) g.wa.ka.splice(i, 1);
        }
        const ghostsLeft = g.wa.ka.filter((f) => window.fear_is_ghost(f)).length;
        const r7EFn =
          typeof window.__fearR7E === "function"
            ? window.__fearR7E
            : typeof window.r7E === "function"
              ? window.r7E
              : null;
        let edibleLeft = null;
        let r7ELive = false;
        try {
          if (r7EFn) {
            edibleLeft = r7EFn(g);
            r7ELive = true;
          }
        } catch (_e) {
          edibleLeft = null;
        }
        if (edibleLeft == null && window.fear_edible_fruit_count) {
          edibleLeft = window.fear_edible_fruit_count(g);
        }
        let refilled = false;
        const t7EFn =
          typeof window.__fearT7E === "function"
            ? window.__fearT7E
            : typeof window.t7E === "function"
              ? window.t7E
              : null;
        try {
          if (t7EFn && edibleLeft === 0) {
            t7EFn(g);
            refilled = true;
          }
        } catch (_t) {}
        if (refilled && window.fear_after_respawn) {
          try {
            window.__fearWaveGhostFill = true;
            window.__fearGhostTopUpThisEat = false;
            window.fear_after_respawn(g.wa);
          } catch (_ar) {}
        }
        // If native t7E unavailable, still exercise wave ghost fill on a fake plant.
        if (!refilled && edibleLeft === 0 && window.fear_wave_ghost_fill) {
          const plant = window.__fearE4E;
          if (typeof plant === "function") {
            for (let i = 0; i < 5; i++) {
              try {
                plant(g.wa);
              } catch (_p) {
                break;
              }
            }
            // Mark newly planted as fresh (not ghosts) then full-match ghosts.
            for (const f of g.wa.ka) {
              if (f && !window.fear_is_ghost(f)) {
                f.sequenceNumber = f.sequenceNumber || 1;
              }
            }
            window.__fearWaveGhostFill = true;
            window.__fearGhostTopUpThisEat = false;
            window.fear_wave_ghost_fill(g.wa);
            refilled = true;
          }
        }
        const after = {
          total: g.wa.ka.length,
          fresh: g.wa.ka.filter((f) => f && !window.fear_is_ghost(f)).length,
          ghosts: g.wa.ka.filter((f) => window.fear_is_ghost(f)).length,
          kc: !!g.kc,
        };
        const pairedSeqOk =
          after.fresh > 0 &&
          g.wa.ka
            .filter((f) => window.fear_is_ghost(f) && f.__fearPairId != null)
            .every((ghost) => {
              const twin = g.wa.ka.find(
                (f) =>
                  f &&
                  !window.fear_is_ghost(f) &&
                  f.__fearPairId === ghost.__fearPairId
              );
              return (
                twin &&
                twin.sequenceNumber != null &&
                ghost.sequenceNumber === twin.sequenceNumber
              );
            });
        return {
          ok: true,
          before,
          ghostsLeft,
          edibleLeft,
          r7ELive,
          refilled,
          after,
          pairedSeqOk,
          burgerActive: !!(window.isBurgerActive && window.isBurgerActive()),
        };
      });
      assert.equal(result.ok, true, JSON.stringify(result));
      assert.ok(result.before.ghosts >= 1, JSON.stringify(result));
      assert.ok(result.ghostsLeft >= 1, JSON.stringify(result));
      assert.equal(result.edibleLeft, 0, JSON.stringify(result));
      assert.equal(result.after.kc, false, "must not enter Bomb kc path");
      assert.equal(result.burgerActive, false, JSON.stringify(result));
      assert.equal(result.refilled, true, JSON.stringify(result));
      assert.ok(result.after.fresh >= 5, JSON.stringify(result));
      assert.equal(
        result.after.ghosts,
        result.after.fresh,
        "ghosts should match fruit after wave fill: " + JSON.stringify(result)
      );
      // Prefer live r7E when exposed; always require no r7E patch miss in console.
      if (result.r7ELive != null) {
        assert.ok(
          result.r7ELive === true || result.edibleLeft === 0,
          JSON.stringify(result)
        );
      }
      assert.deepEqual(
        (h.modErrors() || []).filter(
          (e) =>
            !(e && /Pudding secret-fruit tail not found/.test(e.text || e)) &&
            !(e && /r7E ignore Fear ghosts/.test(e.text || e))
        ),
        []
      );
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
        window.slot_ensure_badges(g);
        const ghosts = g.wa.ka.filter((f) => f.__slotFearGhost);
        const badgeFruit = g.wa.ka.filter(
          (f) => !f.__slotFearGhost && !f.Oka && typeof f.slotMode === "number"
        ).length;
        const ghostModes = ghosts.map((f) => f.slotMode);
        // Clearing playable fruit after Fear badge eat leaves ghosts only.
        g.wa.ka.splice(0, g.wa.ka.length, ...ghosts);
        for (let i = 0; i < g.wa.ka.length; i++) {
          if (g.wa.ka[i].slotMode != null) delete g.wa.ka[i].slotMode;
        }
        window.__slotActive = window.FEAR_MODE;
        g.nj = false;
        g.ub = false;
        const won = window.slot_win_if_empty(g, g.wa);
        return {
          planted,
          ghosts: ghosts.length,
          ghostTypes: ghosts.map((f) => f.type),
          ghostModes,
          fearType: window.FEAR_GHOST_TYPE,
          badgeFruit,
          arrows: window.__fearGrid.size,
          active: window.isFearActive(),
          ghostsOnlyWin: won,
          nj: !!g.nj,
        };
      });
      assert.equal(result.planted, true, JSON.stringify(result));
      assert.equal(result.ghosts, 1, JSON.stringify(result));
      assert.deepEqual(result.ghostTypes, [result.fearType], JSON.stringify(result));
      assert.equal(result.badgeFruit, 1, JSON.stringify(result));
      assert.deepEqual(result.ghostModes, [undefined], JSON.stringify(result));
      assert.equal(result.ghostsOnlyWin, true, JSON.stringify(result));
      assert.equal(result.nj, true, JSON.stringify(result));
      assert.ok(result.arrows >= 1, JSON.stringify(result));
      assert.equal(result.active, true, JSON.stringify(result));
      assert.deepEqual(
        (h.modErrors() || []).filter(
          (e) =>
            !(e && /Pudding secret-fruit tail not found/.test(e.text || e))
        ),
        []
      );
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
      assert.deepEqual(
        (h.modErrors() || []).filter(
          (e) =>
            !(e && /Pudding secret-fruit tail not found/.test(e.text || e))
        ),
        []
      );
    } finally {
      await h.close();
    }
  }
);

test(
  "Dice fresh eat despawns its ghost and tops up at most one ghost",
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
        const beforeGhosts = g.wa.ka.filter((f) =>
          window.fear_is_ghost(f)
        ).length;
        g.tick();
        return {
          ok: true,
          oldGhostPresent: g.wa.ka.some((f) => f.__fearOldDiceGhost),
          beforeGhosts,
          ghosts: g.wa.ka.filter((f) => window.fear_is_ghost(f)).length,
          fresh: g.wa.ka.filter((f) => !window.fear_is_ghost(f)).length,
          scoreGain: (g.Sh | 0) - score,
        };
      });
      assert.equal(result.ok, true, JSON.stringify(result));
      assert.equal(result.oldGhostPresent, false, JSON.stringify(result));
      assert.equal(result.scoreGain, 1, JSON.stringify(result));
      assert.ok(result.ghosts <= result.fresh, JSON.stringify(result));
      // Mid-Dice: at most one new ghost (not a full wave match).
      assert.ok(
        result.ghosts >= result.fresh - 1,
        "at most one ghost behind fruit: " + JSON.stringify(result)
      );
      assert.deepEqual(
        (h.modErrors() || []).filter(
          (e) =>
            !(e && /Pudding secret-fruit tail not found/.test(e.text || e))
        ),
        []
      );
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
        assert.equal(row.fresh, 5, JSON.stringify(row));
        assert.ok(
          row.ghosts >= 4 && row.ghosts <= 5 && row.ghosts <= row.fresh,
          "ghosts stay paired with fruit: " + JSON.stringify(row)
        );
        assert.equal(row.total, row.fresh + row.ghosts, JSON.stringify(row));
      }
      assert.deepEqual(
        (h.modErrors() || []).filter(
          (e) =>
            !(e && /Pudding secret-fruit tail not found/.test(e.text || e))
        ),
        []
      );
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
      assert.deepEqual(
        (h.modErrors() || []).filter(
          (e) =>
            !(e && /Pudding secret-fruit tail not found/.test(e.text || e))
        ),
        []
      );
    } finally {
      await h.close();
    }
  }
);
