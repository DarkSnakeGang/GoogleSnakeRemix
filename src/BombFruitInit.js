window.BombFruitMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.BombFruitMod.runCodeBefore = function () {
  console.log("Adding Bomb Fruit Mode (v13)");

  window.BOMB_FRUIT_ICON =
    "https://www.google.com/logos/fnbx/snake_arcade/v18/count_05.png";
  window.BOMB_FRUIT_ARM_TICKS = 4;

  window.uiImage =
    window.uiImage ||
    function (src) {
      let img = new Image();
      img.src = src;
      img.classList.add("DqMRee");
      img.classList.add("SsAred");
      return img;
    };

  function bombFruitEnsureTrophy() {
    if (window.BOMB_FRUIT_MODE != null) return;
    if (!window.BOMB_FRUIT_ICON) return;
    const root = document.querySelector("#trophy");
    if (!root) return;
    root.appendChild(uiImage(window.BOMB_FRUIT_ICON));
    window.BOMB_FRUIT_MODE = root.children.length - 1;
  }
  bombFruitEnsureTrophy();

  let trophyEl = document.querySelector('img[src$="trophy_00.png"]');
  if (trophyEl) {
    let trophy_jsname = trophyEl.getAttribute("jsname");
    window.trophy_src =
      window.trophy_src ||
      `document.querySelector('img[jsname="${trophy_jsname}"]').src `;
  }

  window.bomb_fruit_blending = false;

  window.toggle_bomb_fruit_blender = function () {
    window.bomb_fruit_blending = !window.bomb_fruit_blending;
    window.correct_bomb_fruit_selection();
  };

  window.correct_bomb_fruit_selection = function correct_bomb_fruit_selection() {
    let el = document.getElementById("remix-bomb-fruit-blend");
    if (!el) return;
    if (window.bomb_fruit_blending) {
      el.setAttribute("class", "vuOknd lH9Ipd blender_icon blender_icon_on");
      el.innerHTML =
        `<img class="DEvgAc FMN3L blender_icon_img blender_icon_img_selected" src="` +
        window.BOMB_FRUIT_ICON +
        `" alt="">`;
    } else {
      el.setAttribute("class", "vuOknd blender_icon");
      el.innerHTML =
        `<img class="DEvgAc blender_icon_img" src="` +
        window.BOMB_FRUIT_ICON +
        `" alt="">`;
    }
  };

  window.add_bomb_fruit_blender_toggle = function add_bomb_fruit_blender_toggle() {
    if (document.getElementById("remix-bomb-fruit-blend")) return;
    if (!window.populateRemixBlenderSlot) return;
    window.populateRemixBlenderSlot({
      id: "remix-bomb-fruit-blend",
      slotIndex: 5,
      icon: window.BOMB_FRUIT_ICON,
      ariaLabel: "Toggle Bomb Fruit in Blender",
      onToggle: window.toggle_bomb_fruit_blender,
    });
    window.correct_bomb_fruit_selection();
  };

  window.add_bomb_fruit_blender_toggle();
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.BombFruitMod.alterSnakeCode = function (code) {
  console.log("Coding Bomb Fruit Mode into the game (v13)");

  function bfReplace(label, re, replacement) {
    if (!code.match(re)) {
      console.error("BombFruitMod: failed to find " + label);
      return false;
    }
    try {
      code = code.assertReplace(re, replacement);
      return true;
    } catch (e) {
      console.error("BombFruitMod: replace failed for " + label, e);
      return false;
    }
  }

  window.isBombFruitActive = function isBombFruitActive() {
    if (window.BOMB_FRUIT_MODE == null) return false;
    if (window.CurrentModeNum === window.BOMB_FRUIT_MODE) return true;
    if (window.CurrentModeNum === 22 && window.bomb_fruit_blending) return true;
    const g = window.__remixGame;
    const mode =
      g && g.settings
        ? g.settings.ub != null
          ? g.settings.ub
          : g.settings.ob
        : null;
    if (mode === window.BOMB_FRUIT_MODE) return true;
    if (mode === 22 && window.bomb_fruit_blending) return true;
    return false;
  };

  window.updateBombFruitTrophySRC = function updateBombFruitTrophySRC() {
    if (window.trophy_src && window.BOMB_FRUIT_ICON) {
      eval(window.trophy_src + `= window.BOMB_FRUIT_ICON`);
    }
  };

  window.bombFruit_reset_state = function bombFruit_reset_state() {
    window.__bombFruitBootstrapped = false;
    window.__bombFruitOrphans = [];
    window.__bombFruitLastPos = null;
    window.__bombFruitAppleSnap = null;
  };

  window.bombFruit_chebyshev = function bombFruit_chebyshev(a, b) {
    if (!a || !b) return Infinity;
    if (typeof T2E === "function") {
      try {
        return T2E(a.x, a.y, b.x, b.y);
      } catch (_e) {}
    }
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  };

  window.bombFruit_pos_key = function bombFruit_pos_key(pos) {
    if (!pos || pos.x == null || pos.y == null) return null;
    return pos.x + "," + pos.y;
  };

  window.bombFruit_parse_pos_key = function bombFruit_parse_pos_key(key) {
    if (!key || typeof key !== "string") return null;
    const parts = key.split(",");
    if (parts.length < 2) return null;
    const x = +parts[0];
    const y = +parts[1];
    if (!isFinite(x) || !isFinite(y)) return null;
    return { x: x, y: y };
  };

  /** Armed bomb left behind when a fruit relocates or is removed (eat / dice). */
  window.bombFruit_detach_bomb = function bombFruit_detach_bomb(oldKey, ticks) {
    if (!oldKey || ticks == null || ticks < 0) return;
    if (!window.__bombFruitOrphans) window.__bombFruitOrphans = [];
    const pos = window.bombFruit_parse_pos_key(oldKey);
    if (!pos) return;
    // Avoid stacking duplicate orphans on the same cell.
    const list = window.__bombFruitOrphans;
    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].x === pos.x && list[i].y === pos.y) {
        list[i].bombX1a = Math.max(list[i].bombX1a | 0, ticks | 0);
        return;
      }
    }
    list.push({
      x: pos.x,
      y: pos.y,
      bombX1a: ticks | 0,
    });
  };

  /** Drop a fruit from the snap so explode doesn't also spawn an orphan. */
  window.bombFruit_forget_apple = function bombFruit_forget_apple(el) {
    const snap = window.__bombFruitAppleSnap;
    if (!snap || !el) return;
    window.__bombFruitAppleSnap = snap.filter(function (e) {
      return e && e.el !== el;
    });
  };

  /**
   * Keep armed bombs cell-bound:
   * - same object relocated (classic eat) → orphan at old cell
   * - object removed (dice/bomb/tally splice) → orphan at last cell
   * WeakMap alone can't see deletions; __bombFruitAppleSnap tracks them.
   */
  window.bombFruit_sync_fruit_bombs = function bombFruit_sync_fruit_bombs(mgr) {
    if (!mgr || !mgr.ka) return;
    if (!window.__bombFruitLastPos) window.__bombFruitLastPos = new WeakMap();
    const last = window.__bombFruitLastPos;
    const prevSnap = window.__bombFruitAppleSnap || [];
    const living = new Set();
    for (let i = 0; i < mgr.ka.length; i++) living.add(mgr.ka[i]);

    for (let i = 0; i < prevSnap.length; i++) {
      const entry = prevSnap[i];
      if (!entry || !entry.el) continue;
      if (living.has(entry.el)) continue;
      // Fruit was removed (dice clear / eat splice) while armed — leave blast.
      if (entry.bombX1a >= 0 && entry.key) {
        window.bombFruit_detach_bomb(entry.key, entry.bombX1a);
      }
    }

    const nextSnap = [];
    for (let i = 0; i < mgr.ka.length; i++) {
      const el = mgr.ka[i];
      if (!el || !el.pos) continue;
      window.bombFruit_init_apple(el);
      const cur = window.bombFruit_pos_key(el.pos);
      if (!cur) continue;
      const prev = last.get(el);
      if (prev && prev !== cur && el.bombX1a >= 0) {
        window.bombFruit_detach_bomb(prev, el.bombX1a);
        el.bombX1a = -1;
      }
      last.set(el, cur);
      nextSnap.push({ el: el, key: cur, bombX1a: el.bombX1a | 0 });
    }
    window.__bombFruitAppleSnap = nextSnap;
  };

  /** Refresh snap countdowns after tick arm/decrement (no orphan side-effects). */
  window.bombFruit_refresh_snap = function bombFruit_refresh_snap(mgr) {
    if (!mgr || !mgr.ka) return;
    if (!window.__bombFruitLastPos) window.__bombFruitLastPos = new WeakMap();
    const last = window.__bombFruitLastPos;
    const nextSnap = [];
    for (let i = 0; i < mgr.ka.length; i++) {
      const el = mgr.ka[i];
      if (!el || !el.pos) continue;
      window.bombFruit_init_apple(el);
      const cur = window.bombFruit_pos_key(el.pos);
      if (!cur) continue;
      last.set(el, cur);
      nextSnap.push({ el: el, key: cur, bombX1a: el.bombX1a | 0 });
    }
    window.__bombFruitAppleSnap = nextSnap;
  };

  window.bombFruit_init_apple = function bombFruit_init_apple(el) {
    if (!el) return;
    if (el.bombX1a == null) el.bombX1a = -1;
  };

  window.bombFruit_init_all = function bombFruit_init_all(mgr) {
    const list = mgr && mgr.ka;
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      window.bombFruit_init_apple(list[i]);
    }
  };

  window.bombFruit_trigger_win = function bombFruit_trigger_win(game) {
    if (!game) return;
    if (game.nj || game.lj) return;
    try {
      if (typeof Q4E !== "undefined" && Q4E.rWd && Q4E.rWd.play) Q4E.rWd.play();
      else if (typeof ybF !== "undefined" && ybF.WIN) ybF.WIN.play();
    } catch (_e) {}
    game.nj = true;
    game.lj = true;
    try {
      const score = game.Sh != null ? game.Sh : game.Oh;
      if (typeof A7E === "function") A7E(game.menu, 1400, score);
      else if (typeof vdF === "function") vdF(game.menu, 1400, score);
    } catch (_e2) {}
  };

  window.bombFruit_find_spawn = function bombFruit_find_spawn(mgr, excludeIdx) {
    const board = mgr && mgr.oa;
    const game = window.__remixGame;
    const freePos =
      window.__bombFruitFreePos ||
      window.__chessFreePos ||
      (typeof d4E === "function" ? d4E : null);
    const skip = new Set();
    if (excludeIdx != null) skip.add(excludeIdx);
    const occ =
      typeof window.chess_occupied_keys === "function"
        ? window.chess_occupied_keys(game, mgr.ka, skip)
        : new Set();
    if (typeof window.chess_find_legal_spawn === "function") {
      return window.chess_find_legal_spawn(board, freePos, occ, null);
    }
    // Fallback: scan board with Manhattan > 3 from head.
    const size =
      typeof window.chess_board_size === "function"
        ? window.chess_board_size(board)
        : null;
    if (!size || !size.width) return null;
    const head = game && game.oa && game.oa.ka && game.oa.ka[0];
    const total = size.width * size.height;
    const start = Math.floor(Math.random() * total);
    for (let n = 0; n < total; n++) {
      const i = (start + n) % total;
      const x = i % size.width;
      const y = (i / size.width) | 0;
      const pos =
        typeof window.chess_make_pos === "function"
          ? window.chess_make_pos(x, y)
          : { x: x, y: y };
      // Match shield/chess: Manhattan > 3 (not Chebyshev).
      if (
        head &&
        typeof window.chess_outside_spawn_radius === "function"
          ? !window.chess_outside_spawn_radius(game, pos)
          : Math.abs(head.x - pos.x) + Math.abs(head.y - pos.y) <= 3
      ) {
        continue;
      }
      const key = x + "," + y;
      if (occ.has(key)) continue;
      return pos;
    }
    return null;
  };

  /**
   * Relocate apples that sit inside the shield head-radius.
   * Only touch apples from startIdx onward — start-of-game layout must stay
   * put; only new spawns (post-eat / post-boom) care about spawn radius.
   */
  window.bombFruit_constrain_apples = function bombFruit_constrain_apples(
    mgr,
    startIdx
  ) {
    if (!mgr || !mgr.ka) return true;
    const game = window.__remixGame;
    const start = startIdx == null ? 0 : Math.max(0, startIdx | 0);
    for (let i = start; i < mgr.ka.length; i++) {
      const el = mgr.ka[i];
      if (!el || !el.pos) continue;
      window.bombFruit_init_apple(el);
      const ok =
        typeof window.chess_outside_spawn_radius === "function"
          ? window.chess_outside_spawn_radius(game, el.pos)
          : true;
      if (ok) continue;
      const pos = window.bombFruit_find_spawn(mgr, i);
      if (!pos) {
        // Can't legally keep this apple — drop it. Win only if none remain
        // (so 3/5/10/dice/bomb/tally don't false-win while siblings exist).
        mgr.ka.splice(i, 1);
        i--;
        window.appleArray = mgr.ka;
        if (!mgr.ka.length) {
          window.bombFruit_trigger_win(game);
          return false;
        }
        continue;
      }
      const oldKey =
        (window.__bombFruitLastPos && window.__bombFruitLastPos.get(el)) ||
        window.bombFruit_pos_key(el.pos);
      const armedTicks = el.bombX1a;
      if (typeof el.pos.clone === "function" && pos.clone) {
        el.pos = pos.clone();
      } else {
        el.pos.x = pos.x;
        el.pos.y = pos.y;
      }
      // Shield nudge also must not teleport an armed countdown.
      if (armedTicks >= 0) {
        if (oldKey) window.bombFruit_detach_bomb(oldKey, armedTicks);
        el.bombX1a = -1;
      }
      if (window.__bombFruitLastPos) {
        const cur = window.bombFruit_pos_key(el.pos);
        if (cur) window.__bombFruitLastPos.set(el, cur);
      }
    }
    window.appleArray = mgr.ka;
    return true;
  };

  window.bombFruit_make_apple_at = function bombFruit_make_apple_at(mgr, pos, template) {
    const makeApple =
      window.__bombFruitMakeApple ||
      window.__chessMakeApple ||
      (typeof g7 === "function" ? g7 : null);
    const pickType =
      window.__bombFruitPickType ||
      window.__chessPickType ||
      (typeof Q3E === "function" ? Q3E : null);
    let dup;
    const lenBefore = mgr && mgr.ka ? mgr.ka.length : 0;
    if (typeof makeApple === "function") {
      dup = makeApple(mgr, 0, 0);
      // If g7 auto-appended into mgr.ka, pull it back out — caller decides
      // when to insert, so sibling fruits are never wiped/replaced.
      if (mgr && mgr.ka && mgr.ka.length > lenBefore) {
        dup = mgr.ka.pop();
        while (mgr.ka.length > lenBefore) mgr.ka.pop();
      }
    } else if (template) {
      dup = Object.assign({}, template);
    } else {
      return null;
    }
    if (typeof pos.clone === "function") {
      dup.pos = pos.clone();
    } else {
      dup.pos = dup.pos || {};
      dup.pos.x = pos.x;
      dup.pos.y = pos.y;
    }
    if (typeof pickType === "function") {
      try {
        dup.type = pickType(mgr);
      } catch (_e) {}
    } else if (template && template.type != null) {
      dup.type = template.type;
    }
    // Keep tally index (and portal twin meta) from the fruit we replaced.
    if (template) {
      if (template.sequenceNumber !== undefined) {
        dup.sequenceNumber = template.sequenceNumber;
      }
      if (template.yNa !== undefined) dup.yNa = template.yNa;
      if (template.Lh !== undefined) dup.Lh = template.Lh;
    }
    dup.wm = true;
    dup.cM = 0;
    dup.nD = 0;
    dup.bombX1a = -1;
    return dup;
  };

  window.bombFruit_inlineY6E = function bombFruit_inlineY6E(snake) {
    if (!snake) return;
    // Mirror native y6E(snake): clear queued turn / direction lock.
    try {
      snake.yb = "NONE";
      snake.Qb = false;
      if (snake.Ga !== "NONE") {
        snake.direction = snake.Ga;
        snake.Ga = "NONE";
      }
    } catch (_e) {}
  };

  /**
   * Same kill sequence A6E uses for mines:
   *   s5E.Ktc.play(), Ub(), y6E(snake), snake.Ka=0, Dc()
   * Ka=0 skips the Oa() crumple (Ka 3→2→1 body-shift). Also freeze the
   * idle head blink (R6E + Ub=0) so death doesn't keep "looping" the face.
   */
  window.bombFruit_mineStyleDeath = function bombFruit_mineStyleDeath(game) {
    if (!game || game.nj) return;
    try {
      const deathBank =
        (typeof s5E !== "undefined" && s5E) || window.__bombFruitS5E;
      if (deathBank && deathBank.Ktc && deathBank.Ktc.play) deathBank.Ktc.play();
    } catch (_s) {}
    try {
      if (typeof game.Ub === "function") game.Ub();
    } catch (_u) {}
    const snake = game.oa;
    try {
      if (typeof y6E === "function") y6E(snake);
      else window.bombFruit_inlineY6E(snake);
    } catch (_y) {
      window.bombFruit_inlineY6E(snake);
    }
    if (snake) {
      snake.Ka = 0;
      try {
        snake.Ub = 0;
        snake.Zb = 0;
        if (typeof R6E === "function") R6E(snake);
      } catch (_r) {}
    }
    // Stop any leftover armed pulses from animating under the death screen.
    window.__bombFruitOrphans = [];
    try {
      if (typeof game.Dc === "function") game.Dc();
      else {
        game.nj = true;
        game.lj = true;
        const score = game.Sh != null ? game.Sh : game.Oh;
        if (typeof A7E === "function") A7E(game.menu, 1400, score);
        else if (typeof vdF === "function") vdF(game.menu, 1400, score);
      }
    } catch (_d) {
      game.nj = true;
    }
  };

  /** Boom FX matching A6E: random t6E boom SFX + one Ga.particles puff only. */
  window.bombFruit_mineBoomFx = function bombFruit_mineBoomFx(Ma, pos) {
    if (!Ma || !pos || !Ma.ka) return;
    try {
      const boomBank =
        (typeof t6E !== "undefined" && t6E) || window.__bombFruitT6E;
      if (boomBank) {
        const pack = [
          boomBank.evc,
          boomBank.fvc,
          boomBank.gvc,
          boomBank.hvc,
          boomBank.ivc,
        ];
        const snd = pack[Math.floor(Math.random() * 5)];
        if (snd && snd.play) snd.play();
      }
    } catch (_s) {}
    try {
      const tile = Ma.ka.ka;
      if (Ma.Ga && Ma.Ga.particles && typeof _ !== "undefined" && _.Od) {
        Ma.Ga.particles.push({
          pos: new _.Od(pos.x * tile, pos.y * tile),
          He: new _.Od(Math.random() * 20 - 10, Math.random() * -20),
          angle: 0,
          s_: Math.random() * 20 - 10,
          size: 1,
          type: 2,
        });
      }
    } catch (_fx) {}
  };

  window.bombFruit_explode = function bombFruit_explode(game, mgr, index) {
    if (!game || !mgr || !mgr.ka || index < 0 || index >= mgr.ka.length) return;
    const apple = mgr.ka[index];
    if (!apple) return;
    const pos = apple.pos
      ? { x: apple.pos.x, y: apple.pos.y }
      : null;
    const head = game.oa && game.oa.ka && game.oa.ka[0];
    const inBlast =
      pos && head && window.bombFruit_chebyshev(head, pos) <= 1;

    // Snapshot every other fruit — explosion may only remove the center apple.
    const others = [];
    for (let i = 0; i < mgr.ka.length; i++) {
      if (i !== index) others.push(mgr.ka[i]);
    }

    // Already handling this blast — don't also orphan on the next sync.
    window.bombFruit_forget_apple(apple);

    // Mine-style boom SFX/particles (same pipeline as A6E).
    try {
      window.bombFruit_mineBoomFx(game.Ma, pos);
    } catch (_fx) {}

    // Restore list to "others only" (drop the detonating middle fruit alone).
    mgr.ka.length = 0;
    for (let i = 0; i < others.length; i++) mgr.ka.push(others[i]);
    window.appleArray = mgr.ka;

    if (inBlast && !game.nj && !game.lj) {
      window.bombFruit_mineStyleDeath(game);
      return;
    }

    const spawn = window.bombFruit_find_spawn(mgr, null);
    if (!spawn) {
      // Multi-count: keep remaining fruit; win only when the board is empty.
      if (mgr.ka.length === 0) window.bombFruit_trigger_win(game);
      return;
    }
    const neu = window.bombFruit_make_apple_at(mgr, spawn, apple);
    if (!neu) {
      if (mgr.ka.length === 0) window.bombFruit_trigger_win(game);
      return;
    }
    // makeApple must not wipe siblings — re-assert others then append.
    const still = [];
    for (let i = 0; i < others.length; i++) {
      if (mgr.ka.indexOf(others[i]) >= 0) still.push(others[i]);
    }
    if (still.length !== others.length || mgr.ka.indexOf(neu) >= 0) {
      mgr.ka.length = 0;
      for (let i = 0; i < others.length; i++) mgr.ka.push(others[i]);
    }
    if (mgr.ka.indexOf(neu) < 0) mgr.ka.push(neu);
    neu.bombX1a = -1;
    window.appleArray = mgr.ka;
  };

  /** Boom at a detached cell — never removes / relocates fruit. */
  window.bombFruit_orphan_boom = function bombFruit_orphan_boom(game, orphan) {
    if (!game || !orphan) return;
    const pos = { x: orphan.x, y: orphan.y };
    const head = game.oa && game.oa.ka && game.oa.ka[0];
    const dist = window.bombFruit_chebyshev(head, pos);
    try {
      window.bombFruit_mineBoomFx(game.Ma, pos);
    } catch (_fx) {}
    // Center of the old blast (the eaten tile) stays safe — ring kills.
    if (dist > 0 && dist <= 1 && !game.nj && !game.lj) {
      window.bombFruit_mineStyleDeath(game);
    }
  };

  window.bombFruit_tick_orphans = function bombFruit_tick_orphans(game) {
    const list = window.__bombFruitOrphans;
    if (!list || !list.length) return;
    const head = game.oa && game.oa.ka && game.oa.ka[0];
    for (let i = list.length - 1; i >= 0; i--) {
      const o = list[i];
      if (!o) {
        list.splice(i, 1);
        continue;
      }
      if (o.bombX1a > 0) o.bombX1a--;
      if (o.bombX1a === 0) {
        const dist = window.bombFruit_chebyshev(head, o);
        if (dist === 0) {
          // Standing on the eaten center — disarm, no kill.
          list.splice(i, 1);
          continue;
        }
        window.bombFruit_orphan_boom(game, o);
        list.splice(i, 1);
        if (game.nj || game.lj) return;
        continue;
      }
    }
  };

  window.bombFruit_tick_logic = function bombFruit_tick_logic(game) {
    if (!window.isBombFruitActive || !window.isBombFruitActive()) return;
    const g = game || window.__remixGame;
    if (!g || g.nj || g.lj) return;
    const mgr = g.wa;
    if (!mgr || !mgr.ka) return;

    if (!window.__bombFruitBootstrapped) {
      window.__bombFruitBootstrapped = true;
      window.__bombFruitOrphans = [];
      // Capture native freePos early (eat path also sets these) so boom
      // spawns use d4E(..., 2) shield head radius without waiting for an eat.
      try {
        if (typeof g7 === "function") window.__bombFruitMakeApple = g7;
        if (typeof d4E === "function") window.__bombFruitFreePos = d4E;
        if (typeof Q3E === "function") window.__bombFruitPickType = Q3E;
      } catch (_cap) {}
      // Do NOT constrain at start — keep native 1a/3a/5a/10a/tally layout.
      // Spawn radius applies only to new fruits (eat / boom refill).
      window.bombFruit_init_all(mgr);
      window.bombFruit_sync_fruit_bombs(mgr);
    }

    // Eat reuses apple objects — detach armed bombs before ticking them.
    window.bombFruit_sync_fruit_bombs(mgr);

    const head = g.oa && g.oa.ka && g.oa.ka[0];
    if (!head) return;

    window.bombFruit_tick_orphans(g);
    if (g.nj || g.lj) return;

    // Snapshot indices; explode may splice.
    for (let i = mgr.ka.length - 1; i >= 0; i--) {
      const el = mgr.ka[i];
      if (!el || !el.pos) continue;
      window.bombFruit_init_apple(el);
      const dist = window.bombFruit_chebyshev(head, el.pos);
      // Minesweeper order: decrement → boom check → arm.
      if (el.bombX1a > 0) el.bombX1a--;
      if (el.bombX1a === 0) {
        // Center is edible — never boom-kill on the fruit tile itself.
        if (dist === 0) {
          el.bombX1a = -1;
          continue;
        }
        window.bombFruit_explode(g, mgr, i);
        if (g.nj || g.lj) return;
        continue;
      }
      if (dist <= 1 && el.bombX1a === -1) {
        el.bombX1a = window.BOMB_FRUIT_ARM_TICKS | 4;
      }
    }
    // Keep snap countdowns current so a mid-tick dice/eat removal orphans
    // with the post-decrement timer, not a stale pre-tick value.
    window.bombFruit_refresh_snap(mgr);
  };

  window.bombFruit_draw_one_radius = function bombFruit_draw_one_radius(
    board,
    pos,
    bombX1a,
    game
  ) {
    if (!board || !board.ka || !pos) return;
    const tile = board.wb && board.wb.ka && board.wb.ka.ka;
    if (!tile) return;
    const ctx = board.ka;
    const px =
      typeof _ !== "undefined" && _ && typeof _.Od === "function"
        ? new _.Od(pos.x * tile, pos.y * tile)
        : { x: pos.x * tile, y: pos.y * tile };
    const side = tile * 3;
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#f23606";
    ctx.lineWidth = tile / 12;
    ctx.lineDashOffset = tile / 8;
    ctx.setLineDash([tile / 4, tile / 4]);
    if (typeof B5E === "function") {
      B5E(board, px, 0, 0, side);
    } else {
      ctx.beginPath();
      ctx.rect(px.x + tile / 2 - side / 2, px.y + tile / 2 - side / 2, side, side);
      ctx.stroke();
    }
    if (bombX1a > 0 && !(game && game.nj)) {
      const arm = window.BOMB_FRUIT_ARM_TICKS | 4;
      const f = (arm - bombX1a) / arm;
      let pulseSide = side * f;
      let alpha = 0.15;
      if (typeof U2E === "function") {
        try {
          alpha = U2E(f) * 0.15;
        } catch (_e) {}
      }
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#f23606";
      if (typeof C5E === "function") {
        C5E(board, px, 0, 0, pulseSide);
      } else {
        ctx.fillRect(
          px.x + tile / 2 - pulseSide / 2,
          px.y + tile / 2 - pulseSide / 2,
          pulseSide,
          pulseSide
        );
      }
      ctx.globalAlpha = 1;
    }
  };

  /** Draw Minesweeper-style dashed 3×3 rings; gated by Mine Radius checkbox. */
  window.bombFruit_drawRadii = function bombFruit_drawRadii(board, _frac) {
    if (!window.isBombFruitActive || !window.isBombFruitActive()) return;
    const boxes = window.checkboxes && window.checkboxes.checkboxStatuses;
    if (boxes && boxes.mineRadius === false) return;
    const game = (board && board.wb) || window.__remixGame;
    if (game && game.nj) return;
    const mgr = game && game.wa;
    if (!board || !board.ka || !mgr || !mgr.ka) return;
    const ctx = board.ka;
    ctx.save();
    for (let i = 0; i < mgr.ka.length; i++) {
      const el = mgr.ka[i];
      if (!el || !el.pos) continue;
      window.bombFruit_draw_one_radius(board, el.pos, el.bombX1a | 0, game);
    }
    // Orphan armed radii stay on the eaten cell (do not follow the new fruit).
    const orphans = window.__bombFruitOrphans;
    if (orphans && orphans.length) {
      for (let i = 0; i < orphans.length; i++) {
        const o = orphans[i];
        if (!o) continue;
        window.bombFruit_draw_one_radius(
          board,
          { x: o.x, y: o.y },
          o.bombX1a | 0,
          game
        );
      }
    }
    ctx.setLineDash([]);
    ctx.restore();
  };

  // After eat/respawn pipeline: detach any armed bomb that rode an in-place
  // relocate, reset bomb state on newly pushed apples, then shield-constrain
  // ONLY those new apples (start layout stays put).
  // Works for every apple count (1/3/5/10/dice/bomb/tally + colored dice):
  // pass `added` = newly pushed count from f4E, or 0/omit from j4E board sync.
  window.bombFruit_after_respawn = function bombFruit_after_respawn(mgr, added) {
    if (!window.isBombFruitActive || !window.isBombFruitActive()) return;
    if (!mgr) return;
    window.bombFruit_sync_fruit_bombs(mgr);
    const n = added | 0;
    if (n > 0 && mgr.ka) {
      const start = Math.max(0, mgr.ka.length - n);
      for (let i = start; i < mgr.ka.length; i++) {
        const el = mgr.ka[i];
        if (!el) continue;
        // New fruit must not inherit a countdown (object reuse or copy).
        if (el.bombX1a > 0 || el.bombX1a === 0) {
          // Prefer leaving it at the previous cell if we still know it.
          const prev =
            window.__bombFruitLastPos && window.__bombFruitLastPos.get(el);
          const cur = window.bombFruit_pos_key(el.pos);
          if (prev && cur && prev !== cur) {
            window.bombFruit_detach_bomb(prev, el.bombX1a);
          }
        }
        el.bombX1a = -1;
        if (el.pos && window.__bombFruitLastPos) {
          const cur = window.bombFruit_pos_key(el.pos);
          if (cur) window.__bombFruitLastPos.set(el, cur);
        }
      }
      window.bombFruit_init_all(mgr);
      // Spawn radius only for the newly added fruits.
      window.bombFruit_constrain_apples(mgr, start);
    } else {
      window.bombFruit_init_all(mgr);
    }
  };

  // --- Draw: D5E is only invoked when Minesweeper (e7 12) is on. Also call
  // it for Bomb Fruit so fruit radii render without enabling real mines.
  bfReplace(
    "D5E call gate classic",
    /!e7\(this\.settings,4\)&&e7\(this\.settings,12\)&&D5E\(this\.Ja,a\)/,
    "!e7(this.settings,4)&&(e7(this.settings,12)||window.isBombFruitActive&&window.isBombFruitActive())&&D5E(this.Ja,a)"
  );
  bfReplace(
    "D5E call gate pixel",
    /e7\(this\.settings,12\)&&D5E\(this\.Ja,dd\)/,
    "(e7(this.settings,12)||window.isBombFruitActive&&window.isBombFruitActive())&&D5E(this.Ja,dd)"
  );

  // --- Draw hook: D5E is the mines/FX board pass (Visibility gates #f23606) ---
  bfReplace(
    "D5E bomb fruit radii",
    /D5E=function\(a,b\)\{for\(var c of a\.wb\.Ma\.Aa\)\{/,
    "D5E=function(a,b){if(!window.__bombFruitS5E){try{window.__bombFruitS5E=s5E;window.__bombFruitT6E=t6E;window.__bombFruitX3E=x3E;}catch(_bfAud){}}if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_drawRadii(a,b);}catch(_bf){}}for(var c of a.wb.Ma.Aa){"
  );

  // Capture apple helpers early on eat (before Chess branch).
  bfReplace(
    "eat capture helpers",
    /e=!1;if\(window\.isChessActive&&window\.isChessActive\(\)\)\{window\.__chessMakeApple=g7;window\.__chessFreePos=d4E;window\.__chessPickType=Q3E;/,
    "e=!1;if(window.isBombFruitActive&&window.isBombFruitActive()){window.__bombFruitMakeApple=g7;window.__bombFruitFreePos=d4E;window.__bombFruitPickType=Q3E;}if(window.isChessActive&&window.isChessActive()){window.__chessMakeApple=g7;window.__chessFreePos=d4E;window.__chessPickType=Q3E;"
  );

  if (
    !bfReplace(
      "f4E bomb fruit after mexico",
      /if\(window\.isMexicoActive&&window\.isMexicoActive\(\)&&g>0\)\{try\{window\.mexico_constrain_new_apples\(a,g\);\}catch\(_mx\)\{\}\}/,
      "if(window.isMexicoActive&&window.isMexicoActive()&&g>0){try{window.mexico_constrain_new_apples(a,g);}catch(_mx){}}if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_after_respawn(a,g);}catch(_bf){}}"
    )
  ) {
    bfReplace(
      "f4E bomb fruit after chess",
      /if\(window\.isChessActive&&window\.isChessActive\(\)&&g>0\)\{window\.chess_convert_new_apples\(a,g\);\}/,
      "if(window.isChessActive&&window.isChessActive()&&g>0){window.chess_convert_new_apples(a,g);}if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_after_respawn(a,g);}catch(_bf){}}"
    );
  }

  // j4E runs for every count (1/3/5/10/dice/bomb/tally): sync board after eat
  // without mass-disarming (added=0). Mexico may already have comma-patched j4E.
  if (
    !bfReplace(
      "j4E bomb fruit after mexico",
      /j4E\(a\.wa,k,d,a\.Vm\.bind\(a\)\),window\.isMexicoActive&&window\.isMexicoActive\(\)&&a\.wa\.ka\.length>0&&\(window\.mexico_constrain_new_apples\(a\.wa,a\.wa\.ka\.length\),0\)/,
      "j4E(a.wa,k,d,a.Vm.bind(a)),window.isMexicoActive&&window.isMexicoActive()&&a.wa.ka.length>0&&(window.mexico_constrain_new_apples(a.wa,a.wa.ka.length),0),window.isBombFruitActive&&window.isBombFruitActive()&&a.wa.ka.length>0&&(window.bombFruit_after_respawn(a.wa,0),0)"
    )
  ) {
    bfReplace(
      "j4E bomb fruit",
      /j4E\(a\.wa,k,d,a\.Vm\.bind\(a\)\)/,
      "j4E(a.wa,k,d,a.Vm.bind(a)),window.isBombFruitActive&&window.isBombFruitActive()&&a.wa.ka.length>0&&(window.bombFruit_after_respawn(a.wa,0),0)"
    );
  }

  // Tick after Mexico.
  if (
    !bfReplace(
      "tick bomb fruit after mexico",
      /if\(window\.isMexicoActive&&window\.isMexicoActive\(\)\)\{try\{window\.mexico_tick_logic\(this\);\}catch\(_mx\)\{\}\}/,
      "if(window.isMexicoActive&&window.isMexicoActive()){try{window.mexico_tick_logic(this);}catch(_mx){}}if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_tick_logic(this);}catch(_bf){console.error(\"BombFruitMod: tick failed\",_bf);}}"
    )
  ) {
    bfReplace(
      "tick bomb fruit fallback",
      /\}tick\(\)\{window\.__remixGame=this;/,
      "}tick(){window.__remixGame=this;if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_tick_logic(this);}catch(_bf){console.error(\"BombFruitMod: tick failed\",_bf);}}"
    );
  }

  // Reset after Mexico.
  try {
    const resetRe =
      /if\(window\.isMexicoActive&&window\.isMexicoActive\(\)\)\{try\{window\.mexico_reset_state\(\);\}catch\(_mx\)\{\}\}/g;
    if (code.match(resetRe)) {
      code = code.replace(
        resetRe,
        "if(window.isMexicoActive&&window.isMexicoActive()){try{window.mexico_reset_state();}catch(_mx){}}if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_reset_state();}catch(_bf){}}"
      );
    } else {
      console.error("BombFruitMod: failed to find reset bomb fruit");
    }
  } catch (e) {
    console.error("BombFruitMod: replace failed for reset", e);
  }

  if (code.indexOf("updateBombFruitTrophySRC()") < 0) {
    bfReplace(
      "play-start bomb fruit trophy",
      /if\(window\.CurrentModeNum===window\.MEXICO_MODE\)\{window\.updateMexicoTrophySRC\(\);window\.mexico_reset_state\(\);\}/,
      "if(window.CurrentModeNum===window.MEXICO_MODE){window.updateMexicoTrophySRC();window.mexico_reset_state();}if(window.CurrentModeNum===window.BOMB_FRUIT_MODE){window.updateBombFruitTrophySRC();window.bombFruit_reset_state();}"
    );
  }

  if (code.indexOf("window.BOMB_FRUIT_MODE)?window.BOMB_FRUIT_ICON") < 0) {
    bfReplace(
      "deathscreen Zb bomb fruit icon",
      /\(a\.settings\.ob===window\.MEXICO_MODE\)\?window\.MEXICO_ICON:/,
      "(a.settings.ob===window.MEXICO_MODE)?window.MEXICO_ICON:(a.settings.ob===window.BOMB_FRUIT_MODE)?window.BOMB_FRUIT_ICON:"
    );
    bfReplace(
      "blender b3E bomb fruit icon",
      /\(c===window\.MEXICO_MODE\)\?window\.MEXICO_ICON:/,
      "(c===window.MEXICO_MODE)?window.MEXICO_ICON:(c===window.BOMB_FRUIT_MODE)?window.BOMB_FRUIT_ICON:"
    );
  }

  bfReplace(
    "blender mode push bomb fruit",
    /if\(window\.mexico_blending&&window\.MEXICO_MODE!=null\)b\.push\(window\.MEXICO_MODE\)/,
    "if(window.mexico_blending&&window.MEXICO_MODE!=null)b.push(window.MEXICO_MODE);if(window.bomb_fruit_blending&&window.BOMB_FRUIT_MODE!=null)b.push(window.BOMB_FRUIT_MODE)"
  );

  if (code.indexOf('el.id==="remix-bomb-fruit-blend"') < 0) {
    const taMexico =
      /else if\(window\.MEXICO_MODE!=null&&el\.id==="remix-mexico-blend"\)m=window\.MEXICO_MODE;/;
    if (code.match(taMexico)) {
      bfReplace(
        "Ta blender bomb fruit after mexico",
        taMexico,
        'else if(window.MEXICO_MODE!=null&&el.id==="remix-mexico-blend")m=window.MEXICO_MODE;else if(window.BOMB_FRUIT_MODE!=null&&el.id==="remix-bomb-fruit-blend")m=window.BOMB_FRUIT_MODE;'
      );
    } else {
      console.error("BombFruitMod: failed to find Ta blender slot");
    }
  }

  return code;
};

////////////////////////////////////////////////////////////////////
//RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.BombFruitMod.runCodeAfter = function () {
  if (window.BOMB_FRUIT_MODE == null && window.BOMB_FRUIT_ICON) {
    const root = document.querySelector("#trophy");
    if (root) {
      root.appendChild(uiImage(window.BOMB_FRUIT_ICON));
      window.BOMB_FRUIT_MODE = root.children.length - 1;
    }
  }
  window.add_bomb_fruit_blender_toggle && window.add_bomb_fruit_blender_toggle();
};
