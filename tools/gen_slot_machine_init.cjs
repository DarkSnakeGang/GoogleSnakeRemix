/**
 * Generates src/SlotMachineInit.js with inlined trophy icon data-URI.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const b64 = fs
  .readFileSync(path.join(root, "assets", "slot-machine-icon.b64.txt"), "utf8")
  .trim();
const icon = `data:image/png;base64,${b64}`;

const body = `window.SlotMachineMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.SlotMachineMod.runCodeBefore = function () {
  console.log("Adding Slot Machine Mode (v13)");

  window.SLOT_MACHINE_ICON = ${JSON.stringify(icon)};

  // Eligible bag modes (excludes Classic 0, Borderless 4, Yin Yang 7,
  // Dimension 11, Blender 22, Mexico 27).
  window.SLOT_MACHINE_POOL = [
    1, 2, 3, 5, 6, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25,
    26, 28,
  ];

  window.uiImage =
    window.uiImage ||
    function (src) {
      let img = new Image();
      img.src = src;
      img.classList.add("DqMRee");
      img.classList.add("SsAred");
      return img;
    };

  function slotEnsureTrophy() {
    if (window.SLOT_MACHINE_MODE != null) return;
    if (!window.SLOT_MACHINE_ICON) return;
    const root = document.querySelector("#trophy");
    if (!root) return;
    root.appendChild(uiImage(window.SLOT_MACHINE_ICON));
    window.SLOT_MACHINE_MODE = root.children.length - 1;
  }
  slotEnsureTrophy();

  let trophyEl = document.querySelector('img[src$="trophy_00.png"]');
  if (trophyEl) {
    let trophy_jsname = trophyEl.getAttribute("jsname");
    window.trophy_src =
      window.trophy_src ||
      \`document.querySelector('img[jsname="\${trophy_jsname}"]').src \`;
  }

  // No blender slot — Slot Machine is a meta-switcher.
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.SlotMachineMod.alterSnakeCode = function (code) {
  console.log("Coding Slot Machine Mode into the game (v13)");

  function smReplace(label, re, replacement) {
    if (!code.match(re)) {
      console.error("SlotMachineMod: failed to find " + label);
      return false;
    }
    try {
      code = code.assertReplace(re, replacement);
      return true;
    } catch (e) {
      console.error("SlotMachineMod: replace failed for " + label, e);
      return false;
    }
  }

  window.isSlotMachineActive = function isSlotMachineActive() {
    if (window.SLOT_MACHINE_MODE == null) return false;
    if (window.CurrentModeNum === window.SLOT_MACHINE_MODE) return true;
    const g = window.__remixGame;
    const mode =
      g && g.settings
        ? g.settings.ub != null
          ? g.settings.ub
          : g.settings.ob
        : null;
    return mode === window.SLOT_MACHINE_MODE;
  };

  window.updateSlotMachineTrophySRC = function updateSlotMachineTrophySRC() {
    if (window.trophy_src && window.SLOT_MACHINE_ICON) {
      eval(window.trophy_src + \`= window.SLOT_MACHINE_ICON\`);
    }
  };

  window.slot_reset_state = function slot_reset_state() {
    window.__slotActive = null;
    window.__slotPrevActive = null;
    window.__slotBag = null;
    window.__slotCatFruitEaten = 0;
    window.__slotBadgeCache = Object.create(null);
    window.__slotEating = false;
  };

  window.slot_shuffle_bag = function slot_shuffle_bag() {
    const pool = (window.SLOT_MACHINE_POOL || []).slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = pool[i];
      pool[i] = pool[j];
      pool[j] = t;
    }
    window.__slotBag = pool;
    return pool;
  };

  window.slot_draw_mode = function slot_draw_mode() {
    if (!window.__slotBag || !window.__slotBag.length) {
      window.slot_shuffle_bag();
    }
    return window.__slotBag.pop();
  };

  window.slot_trophy_url_for_mode = function slot_trophy_url_for_mode(mode) {
    const m = mode | 0;
    if (m === 23 && window.CANDY_ICON) return window.CANDY_ICON;
    if (m === 24 && window.CHESS_ICON) return window.CHESS_ICON;
    if (m === 25 && window.BURGER_ICON) return window.BURGER_ICON;
    if (m === 26 && window.CAT_ICON) return window.CAT_ICON;
    if (m === 28 && window.BOMB_FRUIT_ICON) return window.BOMB_FRUIT_ICON;
    if (m === 15) {
      return "https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_15.png";
    }
    if (m === 16) {
      return "https://www.google.com/logos/fnbx/snake_arcade/v17/trophy_15.png";
    }
    const map = {
      1: "01",
      2: "02",
      3: "03",
      5: "05",
      6: "06",
      8: "08",
      9: "09",
      10: "10",
      12: "12",
      13: "13",
      14: "14",
      17: "16",
      18: "17",
      19: "18",
      20: "19",
      21: "21",
    };
    const id = map[m];
    if (!id) return window.SLOT_MACHINE_ICON;
    return (
      "https://www.google.com/logos/fnbx/snake_arcade/v22/trophy_" + id + ".png"
    );
  };

  window.assignSlotMode = function assignSlotMode(fruit, sharedMode) {
    if (!fruit || fruit.Oka) return null;
    if (fruit.isPiece) return null;
    const mode =
      sharedMode != null ? sharedMode | 0 : window.slot_draw_mode() | 0;
    fruit.slotMode = mode;
    return mode;
  };

  window.slot_assign_pair = function slot_assign_pair(a, b) {
    const mode = window.slot_draw_mode() | 0;
    if (a) a.slotMode = mode;
    if (b) b.slotMode = mode;
    return mode;
  };

  window.slot_clear_poison_badges = function slot_clear_poison_badges(mgr) {
    const list = mgr && mgr.ka;
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (f && f.Oka && f.slotMode != null) delete f.slotMode;
    }
  };

  window.slot_has_walls = function slot_has_walls(game) {
    const g = game || window.__remixGame;
    const walls = g && g.Ca;
    if (!walls || !Array.isArray(walls.wa)) return false;
    for (let y = 0; y < walls.wa.length; y++) {
      const row = walls.wa[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        if ((row[x] | 0) > 0) return true;
      }
    }
    return false;
  };

  window.slot_has_portal_pairs = function slot_has_portal_pairs(mgr) {
    const list = (mgr && mgr.ka) || [];
    // Native portal pairs are consecutive; also treat explicit pairMark.
    for (let i = 0; i + 1 < list.length; i += 2) {
      const a = list[i];
      const b = list[i + 1];
      if (a && b && a.slotMode != null && a.slotMode === b.slotMode) {
        // Heuristic: shared badge often means portal pair under Slot Machine.
        if (a.__slotPortal || b.__slotPortal) return true;
      }
      if (a && b && (a.__slotPortal || b.__slotPortal)) return true;
    }
    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].__slotPortal) return true;
    }
    return false;
  };

  window.slot_has_oka = function slot_has_oka(mgr) {
    const list = (mgr && mgr.ka) || [];
    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].Oka) return true;
    }
    return false;
  };

  window.slot_has_pieces = function slot_has_pieces(mgr) {
    const list = (mgr && mgr.ka) || [];
    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].isPiece) return true;
    }
    return false;
  };

  window.slot_has_mines = function slot_has_mines(game) {
    const g = game || window.__remixGame;
    try {
      const set = g && g.Ma && g.Ma.oa;
      if (set && typeof set.size === "number") return set.size > 0;
      if (set && typeof set[Symbol.iterator] === "function") {
        for (const _ of set) return true;
      }
    } catch (_e) {}
    return false;
  };

  window.slot_snap_winged = function slot_snap_winged(mgr) {
    const list = mgr && mgr.ka;
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || !f.pos) continue;
      f.pos.x = Math.round(f.pos.x);
      f.pos.y = Math.round(f.pos.y);
      if (f.He) {
        try {
          f.He.x = 0;
          f.He.y = 0;
        } catch (_e) {
          f.He = null;
        }
      }
    }
  };

  window.slot_clear_slot_poisons = function slot_clear_slot_poisons(mgr) {
    const list = mgr && mgr.ka;
    if (!list) return;
    for (let i = list.length - 1; i >= 0; i--) {
      const f = list[i];
      if (f && f.Oka && f.__slotPoison) {
        list.splice(i, 1);
      }
    }
  };

  window.setSlotActive = function setSlotActive(mode, game) {
    const g = game || window.__remixGame;
    const next = mode == null ? null : mode | 0;
    const prev = window.__slotActive;
    if (prev === next) {
      window.__slotActive = next;
      return;
    }

    // Leave previous gimmick.
    if (prev === 6 && g && g.wa) {
      try {
        window.slot_snap_winged(g.wa);
      } catch (_e) {}
    }
    if (prev === 10 && g && g.wa) {
      try {
        window.slot_clear_slot_poisons(g.wa);
      } catch (_e) {}
    }

    window.__slotPrevActive = prev;
    window.__slotActive = next;

    // Wall spawn suppress when Slot Machine is on but Wall is not active.
    if (window.isSlotMachineActive && window.isSlotMachineActive()) {
      window.disableWallMode = next !== 1;
    }
  };

  window.slot_on_eating_fruit = function slot_on_eating_fruit(game, fruit) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if (!fruit) return;
    // Poison hazard: no activate / no respawn.
    if (fruit.Oka) return;
    window.__slotEating = true;
    window.__slotEatenFruit = fruit;
    window.__slotEatenMode =
      fruit.slotMode != null ? fruit.slotMode | 0 : null;
    if (fruit.slotMode != null) {
      window.setSlotActive(fruit.slotMode, game);
      if ((fruit.slotMode | 0) === 26) {
        window.__slotCatFruitEaten = (window.__slotCatFruitEaten | 0) + 1;
        const every = window.CAT_LIFE_EVERY | 5;
        const max = window.CAT_MAX_LIVES | 9;
        if (
          window.__slotCatFruitEaten > 0 &&
          window.__slotCatFruitEaten % every === 0
        ) {
          window.cat_lives = Math.min(
            max,
            (window.cat_lives | 0) + 1
          );
          try {
            window.catUpdateLivesHud && window.catUpdateLivesHud();
          } catch (_e) {}
        }
        // Ensure cat life system is initialized for spends.
        if (window.cat_lives == null) window.cat_lives = 0;
      }
    }
  };

  window.slot_win_if_empty = function slot_win_if_empty(game, mgr) {
    const list = mgr && mgr.ka;
    if (list && list.length > 0) return false;
    window.slot_trigger_win(game || window.__remixGame);
    return true;
  };

  window.slot_trigger_win = function slot_trigger_win(game) {
    if (!game || game.nj) return;
    game.nj = true;
    game.lj = true;
    try {
      const score = game.Sh != null ? game.Sh : game.Oh;
      if (typeof A7E === "function") A7E(game.menu, 1400, score);
      else if (typeof vdF === "function") vdF(game.menu, 1400, score);
    } catch (_e2) {}
  };

  window.slot_make_apple = function slot_make_apple(mgr, pos) {
    try {
      if (typeof window.__bombFruitMakeApple === "function") {
        return window.__bombFruitMakeApple(mgr, pos);
      }
      if (typeof window.__chessMakeApple === "function") {
        return window.__chessMakeApple(mgr, pos);
      }
      if (typeof g7 === "function") return g7(mgr, pos);
    } catch (_e) {}
    return {
      pos: pos,
      type: 0,
      Oka: false,
      nba: void 0,
    };
  };

  window.slot_free_pos = function slot_free_pos(mgr, flag) {
    try {
      if (typeof window.__bombFruitFreePos === "function") {
        return window.__bombFruitFreePos(mgr, flag);
      }
      if (typeof window.__chessFreePos === "function") {
        return window.__chessFreePos(mgr, flag);
      }
      if (typeof d4E === "function") return d4E(mgr, flag);
    } catch (_e) {}
    return null;
  };

  window.slot_stamp_new = function slot_stamp_new(mgr, fromIndex, pairShared) {
    if (!mgr || !mgr.ka) return;
    const list = mgr.ka;
    if (pairShared && list.length - fromIndex >= 2) {
      const a = list[list.length - 2];
      const b = list[list.length - 1];
      window.slot_assign_pair(a, b);
      if (a) a.__slotPortal = true;
      if (b) b.__slotPortal = true;
      return;
    }
    for (let i = fromIndex; i < list.length; i++) {
      const f = list[i];
      if (!f || f.Oka || f.isPiece) continue;
      if (f.slotMode == null) window.assignSlotMode(f);
    }
  };

  window.slotRespawn = function slotRespawn(mode, game) {
    const g = game || window.__remixGame;
    if (!g || !g.wa) return false;
    const mgr = g.wa;
    const m = mode | 0;
    const before = mgr.ka.length;

    // Portal / Chess pairs: both or neither.
    if (m === 2 || m === 24) {
      const p1 = window.slot_free_pos(mgr, 0);
      if (!p1) {
        window.slot_win_if_empty(g, mgr);
        return false;
      }
      // Temporarily occupy p1 so second freePos differs.
      const occ = window.slot_make_apple(mgr, p1);
      mgr.ka.push(occ);
      const p2 = window.slot_free_pos(mgr, 0);
      mgr.ka.pop();
      if (!p2) {
        window.slot_win_if_empty(g, mgr);
        return false;
      }
      const a = window.slot_make_apple(mgr, p1);
      const b = window.slot_make_apple(mgr, p2);
      if (m === 2) {
        a.__slotPortal = true;
        b.__slotPortal = true;
        window.slot_assign_pair(a, b);
        mgr.ka.push(a, b);
      } else {
        // Chess pieces — unbadged.
        a.isPiece = true;
        b.isPiece = true;
        a.ChessColor = 0;
        b.ChessColor = 1;
        try {
          if (typeof window.randomize_pieces === "function") {
            mgr.ka.push(a, b);
            window.appleArray = mgr.ka;
            window.randomize_pieces();
          } else {
            a.ChessPiece = "pawn";
            b.ChessPiece = "pawn";
            mgr.ka.push(a, b);
          }
        } catch (_e) {
          mgr.ka.push(a, b);
        }
      }
      window.appleArray = mgr.ka;
      return true;
    }

    if (m === 10) {
      const pos = window.slot_free_pos(mgr, 0);
      if (!pos) {
        window.slot_win_if_empty(g, mgr);
        return false;
      }
      const poison = window.slot_make_apple(mgr, pos);
      poison.Oka = true;
      poison.__slotPoison = true;
      delete poison.slotMode;
      mgr.ka.push(poison);
      window.appleArray = mgr.ka;
      return true;
    }

    // Default single fruit (Shield gets bars; Bomb may arm later via BombFruit).
    const pos = window.slot_free_pos(mgr, m === 15 ? 2 : 0);
    if (!pos) {
      window.slot_win_if_empty(g, mgr);
      return false;
    }
    const fruit = window.slot_make_apple(mgr, pos);
    window.assignSlotMode(fruit);
    if (m === 15) {
      try {
        if (typeof P3E === "function") fruit.nba = P3E(mgr, fruit.pos);
        else fruit.nba = new Set([0, 1, 2, 3]);
      } catch (_e) {
        fruit.nba = new Set([0]);
      }
    }
    if (m === 28 && window.isBombFruitActive) {
      // Arming handled by bombFruit when Bomb is slot-active; ensure zone helpers see fruit.
    }
    mgr.ka.push(fruit);
    window.appleArray = mgr.ka;

    // Burger: assign timer if Burger helpers exist and mode is burger.
    if (m === 25 && typeof window.burger_assign_timers_all === "function") {
      try {
        window.burger_assign_timers_all([fruit]);
      } catch (_e) {}
    }

    if (mgr.ka.length === before) {
      window.slot_win_if_empty(g, mgr);
      return false;
    }
    return true;
  };

  // After native eat/respawn: if Slot Machine, replace default refill with
  // slotRespawn for the eaten badge, or stamp badges on whatever spawned.
  window.slot_after_native_respawn = function slot_after_native_respawn(
    mgr,
    addedHint
  ) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    const g = window.__remixGame;
    const eatenMode = window.__slotEatenMode;
    window.__slotEating = false;

    // Poison eat: no slot respawn.
    if (window.__slotEatenFruit && window.__slotEatenFruit.Oka) {
      window.__slotEatenFruit = null;
      window.__slotEatenMode = null;
      window.slot_win_if_empty(g, mgr);
      return;
    }

    if (eatenMode != null) {
      // Remove native refill apples added for this eat, then slotRespawn.
      // Heuristic: drop trailing fruits that lack slotMode and were just added.
      if (mgr && mgr.ka && (addedHint | 0) > 0) {
        const n = Math.min(addedHint | 0, mgr.ka.length);
        // Only strip unbadged non-piece non-poison trailing spawns.
        let stripped = 0;
        for (let i = mgr.ka.length - 1; i >= 0 && stripped < n; i--) {
          const f = mgr.ka[i];
          if (!f || f.isPiece) break;
          if (f.slotMode != null) break;
          if (f.__slotPortal) break;
          mgr.ka.splice(i, 1);
          stripped++;
        }
      }
      window.slotRespawn(eatenMode, g);
      window.__slotEatenFruit = null;
      window.__slotEatenMode = null;
      window.slot_win_if_empty(g, mgr);
      return;
    }

    // No eaten mode (shouldn't happen often): stamp any new unbadged fruit.
    if (mgr && mgr.ka) {
      for (let i = 0; i < mgr.ka.length; i++) {
        const f = mgr.ka[i];
        if (f && !f.Oka && !f.isPiece && f.slotMode == null) {
          window.assignSlotMode(f);
        }
      }
    }
  };

  window.slot_after_layout = function slot_after_layout(mgr) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if (!mgr || !mgr.ka) return;
    // Start: singletons only — stamp each fruit uniquely from bag (repeats OK).
    for (let i = 0; i < mgr.ka.length; i++) {
      const f = mgr.ka[i];
      if (f && !f.Oka && !f.isPiece && f.slotMode == null) {
        window.assignSlotMode(f);
      }
    }
  };

  window.slot_tick_logic = function slot_tick_logic(game) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if (!game) return;
    window.__remixGame = game;
    const mgr = game.wa;
    if (!mgr || !mgr.ka) return;

    // Unlock badge: any non-piece non-poison fruit missing slotMode gets one
    // (Chess unlock, Key→keyblock, Sokobox→sokogoal).
    for (let i = 0; i < mgr.ka.length; i++) {
      const f = mgr.ka[i];
      if (!f) continue;
      if (f.Oka) {
        if (f.slotMode != null) delete f.slotMode;
        continue;
      }
      if (f.isPiece) continue;
      if (f.slotMode == null) window.assignSlotMode(f);
    }

    // Burger skull conversion clears badge.
    window.slot_clear_poison_badges(mgr);

    // Keep disableWallMode in sync.
    window.disableWallMode = (window.__slotActive | 0) !== 1;

    // Cat lives always spendable once bank exists — ensure HUD.
    if ((window.__slotCatFruitEaten | 0) > 0 || (window.cat_lives | 0) > 0) {
      try {
        window.catUpdateLivesHud && window.catUpdateLivesHud();
      } catch (_e) {}
    }

    if (mgr.ka.length === 0 && !game.nj) {
      window.slot_win_if_empty(game, mgr);
    }
  };

  // ---- isXActive extensions under Slot Machine ----
  const wrapActive = function (name, modeNum, extra) {
    const key = "__slotWrap_" + name;
    if (window[key]) return;
    const orig = window[name];
    if (typeof orig !== "function") return;
    window[key] = true;
    window[name] = function () {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        if (extra && extra()) return true;
        if ((window.__slotActive | 0) === (modeNum | 0)) return true;
        return false;
      }
      return orig.apply(this, arguments);
    };
  };

  // Defer wraps to runCodeAfter so Candy/Chess/etc. exist; also try now.
  window.__slotWrapActives = function __slotWrapActives() {
    wrapActive("isCandyActive", 23);
    wrapActive("isBurgerActive", 25);
    wrapActive(
      "isChessActive",
      24,
      function () {
        const g = window.__remixGame;
        return !!(g && g.wa && window.slot_has_pieces(g.wa));
      }
    );
    wrapActive("isBombFruitActive", 28, function () {
      // Zones always boom: treat Bomb Fruit path as on when zones exist OR roll is Bomb.
      try {
        if (
          window.__bombFruitZones &&
          window.__bombFruitZones.length > 0 &&
          window.isSlotMachineActive &&
          window.isSlotMachineActive()
        ) {
          return true;
        }
      } catch (_e) {}
      return (window.__slotActive | 0) === 28;
    });
    // Cat: lives always — keep isCatActive true once Slot Machine run has cat bank,
    // but gain only via slot_on_eating_fruit. For spend paths need isCatActive.
    wrapActive("isCatActive", 26, function () {
      return (
        (window.cat_lives | 0) > 0 ||
        (window.cat_peaceful_ticks | 0) > 0 ||
        (window.__slotCatFruitEaten | 0) > 0 ||
        (window.__slotActive | 0) === 26
      );
    });
  };
  window.__slotWrapActives();

  // Patch cat gain so Slot Machine only gains on Cat-badge eats (handled above),
  // not every 5 score apples while Cat appears "active".
  if (
    typeof window.cat_on_apple_eaten === "function" &&
    !window.cat_on_apple_eaten.__slotGate
  ) {
    const origCatGain = window.cat_on_apple_eaten;
    window.cat_on_apple_eaten = function (game) {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        // Gain is counted in slot_on_eating_fruit for Cat badges only.
        return;
      }
      return origCatGain.apply(this, arguments);
    };
    window.cat_on_apple_eaten.__slotGate = true;
  }

  // Bomb Fruit: only arm new zones when __slotActive === Bomb; boom always via
  // isBombFruitActive wrap when zones exist.
  if (
    typeof window.bombFruit_after_respawn === "function" &&
    !window.bombFruit_after_respawn.__slotGate
  ) {
    const origBf = window.bombFruit_after_respawn;
    window.bombFruit_after_respawn = function (mgr, from, arm) {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        if ((window.__slotActive | 0) !== 28) {
          // Still sync fruit list but do not arm.
          return origBf.call(this, mgr, from, false);
        }
      }
      return origBf.apply(this, arguments);
    };
    window.bombFruit_after_respawn.__slotGate = true;
  }

  // ---- e7: Slot Machine active roll + leftovers ----
  if (code.indexOf("isSlotMachineActive()&&(b===window.__slotActive") < 0) {
    // Append to the end of the chained e7 return used by BombFruit.
    const e7Bomb =
      /if\(!r&&b===15&&window\.BOMB_FRUIT_MODE!=null\)\{if\(a\.ub===window\.BOMB_FRUIT_MODE\)return!0;if\(a\.ub===22&&a\.rSa&&a\.rSa\.has\(window\.BOMB_FRUIT_MODE\)\)return!0;\}return r\}/;
    if (code.match(e7Bomb)) {
      smReplace(
        "e7 slot machine leftovers",
        e7Bomb,
        "if(!r&&b===15&&window.BOMB_FRUIT_MODE!=null){if(a.ub===window.BOMB_FRUIT_MODE)return!0;if(a.ub===22&&a.rSa&&a.rSa.has(window.BOMB_FRUIT_MODE))return!0;}if(!r&&window.isSlotMachineActive&&window.isSlotMachineActive()&&a.ub===window.SLOT_MACHINE_MODE){if(b===window.__slotActive)return!0;if(b===1&&window.slot_has_walls&&window.slot_has_walls())return!0;if(b===2&&window.slot_has_portal_pairs&&window.slot_has_portal_pairs(window.__remixGame&&window.__remixGame.wa))return!0;if(b===5&&window.__remixGame&&window.__remixGame.yc)return!0;if(b===10&&window.slot_has_oka&&window.slot_has_oka(window.__remixGame&&window.__remixGame.wa))return!0;if(b===12&&window.slot_has_mines&&window.slot_has_mines())return!0;if(b===21&&window.__slotActive===21)return!0;if(b===15&&window.__slotActive===15)return!0;}return r}"
      );
    } else {
      console.error("SlotMachineMod: failed to find e7 bomb fruit chain");
    }
  }

  // Capture makeApple/freePos like BombFruit (may already be patched).
  if (code.indexOf("window.__slotMakeApple=g7") < 0) {
    smReplace(
      "slot capture apple helpers",
      /e=!1;if\(window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)\{window\.__bombFruitMakeApple=g7;window\.__bombFruitFreePos=d4E;window\.__bombFruitPickType=Q3E;\}/,
      "e=!1;if(window.isBombFruitActive&&window.isBombFruitActive()){window.__bombFruitMakeApple=g7;window.__bombFruitFreePos=d4E;window.__bombFruitPickType=Q3E;}if(window.isSlotMachineActive&&window.isSlotMachineActive()){window.__bombFruitMakeApple=g7;window.__bombFruitFreePos=d4E;}"
    );
  }

  // Before fruit splice on eat: activate slot mode.
  if (code.indexOf("slot_on_eating_fruit") < 0) {
    const spliceRe =
      /\\(a\\.wa\\.ka\\.splice\\(k,1\\),k--,window\\.chess_portal_after_fruit_splice&&window\\.chess_portal_after_fruit_splice\\(a\\.wa,a\\),window\\.isBombFruitActive&&window\\.isBombFruitActive\\(\\)&&\\(window\\.bombFruit_after_respawn\\(a\\.wa,0,!1\\),0\\)\\)/;
    const spliceRe2 =
      /(a\\.wa\\.ka\\.splice\\(k,1\\),k--,window\\.chess_portal_after_fruit_splice&&window\\.chess_portal_after_fruit_splice\\(a\\.wa,a\\),window\\.isBombFruitActive&&window\\.isBombFruitActive\\(\\)&&\\(window\\.bombFruit_after_respawn\\(a\\.wa,0,!1\\),0\\))/;
    if (code.match(spliceRe2)) {
      smReplace(
        "slot eat before splice",
        spliceRe2,
        "(window.slot_on_eating_fruit&&window.slot_on_eating_fruit(a,a.wa.ka[k]),a.wa.ka.splice(k,1),k--,window.chess_portal_after_fruit_splice&&window.chess_portal_after_fruit_splice(a.wa,a),window.isBombFruitActive&&window.isBombFruitActive()&&(window.bombFruit_after_respawn(a.wa,0,!1),0),window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_after_native_respawn(a.wa,2),0))"
      );
    } else {
      // Fallback: simpler splice with chess only
      const simple =
        /(a\\.wa\\.ka\\.splice\\(k,1\\),k--,window\\.chess_portal_after_fruit_splice&&window\\.chess_portal_after_fruit_splice\\(a\\.wa,a\\))/;
      if (code.match(simple)) {
        smReplace(
          "slot eat before splice simple",
          simple,
          "(window.slot_on_eating_fruit&&window.slot_on_eating_fruit(a,a.wa.ka[k]),a.wa.ka.splice(k,1),k--,window.chess_portal_after_fruit_splice&&window.chess_portal_after_fruit_splice(a.wa,a),window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_after_native_respawn(a.wa,2),0))"
        );
      } else {
        console.error("SlotMachineMod: failed to find fruit splice eat hook");
      }
    }
  }

  // After f4E respawn (added count g): stamp / slot respawn.
  if (code.indexOf("slot_after_native_respawn(a,g") < 0) {
    smReplace(
      "slot after f4E respawn",
      /if\\(window\\.isBombFruitActive&&window\\.isBombFruitActive\\(\\)\\)\\{try\\{window\\.bombFruit_after_respawn\\(a,g,!0\\);\\}catch\\(_bf\\)\\{\\}\\}/,
      'if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_after_respawn(a,g,!0);}catch(_bf){}}if(window.isSlotMachineActive&&window.isSlotMachineActive()){try{window.slot_after_native_respawn(a,g);}catch(_sm){}}'
    );
  }

  // Initial layout / j4E: stamp badges.
  if (code.indexOf("slot_after_layout") < 0) {
    smReplace(
      "slot after j4E layout",
      /window\\.isBombFruitActive&&window\\.isBombFruitActive\\(\\)&&\\(window\\.bombFruit_after_respawn\\(a\\.wa,0,!1\\),0\\)/,
      "window.isBombFruitActive&&window.isBombFruitActive()&&(window.bombFruit_after_respawn(a.wa,0,!1),0),window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_after_layout(a.wa),0)"
    );
  }

  // Tick hook after BombFruit.
  if (code.indexOf("slot_tick_logic") < 0) {
    const tickBf =
      /if\\(window\\.isBombFruitActive&&window\\.isBombFruitActive\\(\\)\\)\\{try\\{window\\.bombFruit_tick_logic\\(this\\);\\}catch\\(_bf\\)\\{console\\.error\\(\\\\"BombFruitMod: tick failed\\\\",_bf\\);\\}\\}/;
    if (code.match(tickBf)) {
      smReplace(
        "slot tick after bomb",
        tickBf,
        'if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_tick_logic(this);}catch(_bf){console.error(\\"BombFruitMod: tick failed\\",_bf);}}if(window.isSlotMachineActive&&window.isSlotMachineActive()){try{window.slot_tick_logic(this);}catch(_sm){console.error(\\"SlotMachineMod: tick failed\\",_sm);}}'
      );
    } else {
      smReplace(
        "slot tick fallback",
        /\\}tick\\(\\)\\{window\\.__remixGame=this;if\\(window\\.isBombFruitActive&&window\\.isBombFruitActive\\(\\)\\)\\{try\\{window\\.bombFruit_tick_logic\\(this\\);\\}catch\\(_bf\\)\\{console\\.error\\(\\\\"BombFruitMod: tick failed\\\\",_bf\\);\\}\\}/,
        '}tick(){window.__remixGame=this;if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_tick_logic(this);}catch(_bf){console.error(\\"BombFruitMod: tick failed\\",_bf);}}if(window.isSlotMachineActive&&window.isSlotMachineActive()){try{window.slot_tick_logic(this);}catch(_sm){console.error(\\"SlotMachineMod: tick failed\\",_sm);}}'
      );
    }
  }

  // Draw badge overlay after fruit draw — piggyback D5E / apple draw if possible.
  // Inject a small post-draw call near bombFruit_drawRadii.
  if (code.indexOf("slot_draw_badges") < 0) {
    smReplace(
      "slot draw badges",
      /if\\(window\\.isBombFruitActive&&window\\.isBombFruitActive\\(\\)\\)\\{try\\{window\\.bombFruit_drawRadii\\(a,b\\);\\}catch\\(_bf\\)\\{\\}\\}/,
      'if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_drawRadii(a,b);}catch(_bf){}}if(window.isSlotMachineActive&&window.isSlotMachineActive()){try{window.slot_draw_badges(a,b);}catch(_sm){}}'
    );
  }

  window.slot_draw_badges = function slot_draw_badges(renderer, boardOrGame) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    const g = window.__remixGame;
    const mgr = g && g.wa;
    const list = mgr && mgr.ka;
    if (!list || !renderer) return;
    const ctx =
      renderer.ka ||
      renderer.context ||
      (renderer.Ja && renderer.Ja.ka) ||
      null;
    // renderer passed as Ja sometimes; try common paths.
    const c =
      (boardOrGame && boardOrGame.ka && boardOrGame.ka.canvas && boardOrGame) ||
      renderer;
    let drawCtx = null;
    try {
      drawCtx =
        (c && c.ka) ||
        (renderer && renderer.ka) ||
        (g && g.Ja && g.Ja.ka) ||
        null;
    } catch (_e) {}
    if (!drawCtx || typeof drawCtx.drawImage !== "function") return;

    const cell =
      (g && g.settings && (g.settings.Xa || g.settings.cellSize)) || 16;

    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || f.Oka || f.isPiece || f.slotMode == null || !f.pos) continue;
      const url = window.slot_trophy_url_for_mode(f.slotMode);
      if (!url) continue;
      let img = window.__slotBadgeCache && window.__slotBadgeCache[url];
      if (!img) {
        img = new Image();
        img.src = url;
        if (!window.__slotBadgeCache) window.__slotBadgeCache = Object.create(null);
        window.__slotBadgeCache[url] = img;
      }
      if (!img.complete || !img.naturalWidth) continue;
      const size = Math.max(6, (cell * 0.45) | 0);
      const px = f.pos.x * cell + cell - size - 1;
      const py = f.pos.y * cell + 1;
      try {
        drawCtx.save();
        drawCtx.globalAlpha = 0.95;
        drawCtx.drawImage(img, px, py, size, size);
        drawCtx.restore();
      } catch (_e2) {}
    }
  };

  // Reset state.
  if (code.indexOf("slot_reset_state") < 0) {
    smReplace(
      "slot reset",
      /if\\(window\\.isBombFruitActive&&window\\.isBombFruitActive\\(\\)\\)\\{try\\{window\\.bombFruit_reset_state\\(\\);\\}catch\\(_bf\\)\\{\\}\\}/,
      'if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_reset_state();}catch(_bf){}}if(window.isSlotMachineActive&&window.isSlotMachineActive()){try{window.slot_reset_state();}catch(_sm){}}'
    );
  }

  // Play-start trophy + reset.
  if (code.indexOf("updateSlotMachineTrophySRC()") < 0) {
    smReplace(
      "play-start slot trophy",
      /if\\(window\\.CurrentModeNum===window\\.BOMB_FRUIT_MODE\\)\\{window\\.updateBombFruitTrophySRC\\(\\);window\\.bombFruit_reset_state\\(\\);\\}/,
      "if(window.CurrentModeNum===window.BOMB_FRUIT_MODE){window.updateBombFruitTrophySRC();window.bombFruit_reset_state();}if(window.CurrentModeNum===window.SLOT_MACHINE_MODE){window.updateSlotMachineTrophySRC();window.slot_reset_state();}"
    );
  }

  // Deathscreen / blender icons (no blender toggle, but deathscreen needs icon).
  if (code.indexOf("window.SLOT_MACHINE_MODE)?window.SLOT_MACHINE_ICON") < 0) {
    smReplace(
      "deathscreen Zb slot icon",
      /\\(a\\.settings\\.ob===window\\.BOMB_FRUIT_MODE\\)\\?window\\.BOMB_FRUIT_ICON:/,
      "(a.settings.ob===window.BOMB_FRUIT_MODE)?window.BOMB_FRUIT_ICON:(a.settings.ob===window.SLOT_MACHINE_MODE)?window.SLOT_MACHINE_ICON:"
    );
    smReplace(
      "blender b3E slot icon",
      /\\(c===window\\.BOMB_FRUIT_MODE\\)\\?window\\.BOMB_FRUIT_ICON:/,
      "(c===window.BOMB_FRUIT_MODE)?window.BOMB_FRUIT_ICON:(c===window.SLOT_MACHINE_MODE)?window.SLOT_MACHINE_ICON:"
    );
  }

  // Cat life spend while Slot Machine even when Cat not the roll:
  // Oa already checks isCatActive — our wrap keeps it true when lives>0.

  return code;
};

////////////////////////////////////////////////////////////////////
//RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.SlotMachineMod.runCodeAfter = function () {
  if (window.SLOT_MACHINE_MODE == null && window.SLOT_MACHINE_ICON) {
    const root = document.querySelector("#trophy");
    if (root) {
      root.appendChild(uiImage(window.SLOT_MACHINE_ICON));
      window.SLOT_MACHINE_MODE = root.children.length - 1;
    }
  }
  if (typeof window.__slotWrapActives === "function") {
    window.__slotWrapActives();
  }
  // Re-gate cat gain after CatMod finished defining it.
  if (
    typeof window.cat_on_apple_eaten === "function" &&
    !window.cat_on_apple_eaten.__slotGate
  ) {
    const origCatGain = window.cat_on_apple_eaten;
    window.cat_on_apple_eaten = function (game) {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) return;
      return origCatGain.apply(this, arguments);
    };
    window.cat_on_apple_eaten.__slotGate = true;
  }
};
`;

fs.writeFileSync(path.join(root, "src", "SlotMachineInit.js"), body, "utf8");
console.log("wrote SlotMachineInit.js", body.length);
