window.BurgerMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.BurgerMod.runCodeBefore = function () {
  console.log("Adding Burger Mode (v13)");

  window.BURGER_ICON = "data:image/png;base64,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";

  window.uiImage =
    window.uiImage ||
    function (src) {
      let img = new Image();
      img.src = src;
      img.classList.add("DqMRee");
      img.classList.add("SsAred");
      return img;
    };

  document.querySelector("#trophy").appendChild(uiImage(window.BURGER_ICON));
  window.BURGER_MODE = document.querySelector("#trophy").children.length - 1;

  let trophyEl = document.querySelector('img[src$="trophy_00.png"]');
  if (trophyEl) {
    let trophy_jsname = trophyEl.getAttribute("jsname");
    window.trophy_src =
      window.trophy_src ||
      `document.querySelector('img[jsname="${trophy_jsname}"]').src `;
  }

  window.burger_blending = false;

  window.toggle_burger_blender = function () {
    window.burger_blending = !window.burger_blending;
    window.correct_burger_selection();
  };

  window.correct_burger_selection = function correct_burger_selection() {
    let el = document.getElementById("remix-burger-blend");
    if (!el) return;
    if (window.burger_blending) {
      el.setAttribute("class", "vuOknd lH9Ipd blender_icon blender_icon_on");
      el.innerHTML =
        `<img class="DEvgAc FMN3L blender_icon_img blender_icon_img_selected" src="` +
        window.BURGER_ICON +
        `" alt="">`;
    } else {
      el.setAttribute("class", "vuOknd blender_icon");
      el.innerHTML =
        `<img class="DEvgAc blender_icon_img" src="` +
        window.BURGER_ICON +
        `" alt="">`;
    }
  };

  window.add_burger_blender_toggle = function add_burger_blender_toggle() {
    if (document.getElementById("remix-burger-blend")) return;
    if (!window.populateRemixBlenderSlot) return;
    window.populateRemixBlenderSlot({
      id: "remix-burger-blend",
      slotIndex: 2,
      icon: window.BURGER_ICON,
      ariaLabel: "Toggle Burger in Blender",
      onToggle: window.toggle_burger_blender,
    });
    window.correct_burger_selection();
  };

  window.add_burger_blender_toggle();
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.BurgerMod.alterSnakeCode = function (code) {
  console.log("Coding Burger Mode into the game (v13)");

  window.isBurgerActive = function isBurgerActive() {
    if (window.BURGER_MODE == null) return false;
    if (window.CurrentModeNum === window.BURGER_MODE) return true;
    if (window.CurrentModeNum === 22 && window.burger_blending) return true;
    // Match e7(...,10): layout may pair Okas (l4E) while settings.ub is already
    // Burger but CurrentModeNum has not flipped yet — that half-poisoned the start.
    const g = window.__remixGame;
    const s = g && g.settings;
    if (!s) return false;
    if (s.ub === window.BURGER_MODE || s.ob === window.BURGER_MODE) return true;
    if (
      (s.ub === 22 || window.CurrentModeNum === 22) &&
      s.rSa &&
      typeof s.rSa.has === "function" &&
      s.rSa.has(window.BURGER_MODE)
    ) {
      return true;
    }
    if (s.ub === 22 && window.burger_blending) return true;
    return false;
  };

  window.updateBurgerTrophySRC = function updateBurgerTrophySRC() {
    if (window.trophy_src) {
      eval(window.trophy_src + `= window.BURGER_ICON`);
    }
  };

  window.burger_fruits_eaten = 0;

  window.burger_board_box = function burger_board_box() {
    const g = window.__remixGame;
    if (!g) return null;
    const box =
      (g.ka && g.ka.oa) ||
      (g.wa && g.wa.oa && g.wa.oa.oa) ||
      (g.oa && g.oa.oa);
    if (!box) return null;
    return { width: box.width | 0, height: box.height | 0 };
  };

  // Body-segment count (not Ta growth queue). Used by timers and late-game.
  window.burger_snake_length = function burger_snake_length(game) {
    const g = game || window.__remixGame;
    if (g && g.oa && g.oa.ka) return g.oa.ka.length | 0;
    // Apple manager uses .Aa for the snake reference.
    if (g && g.Aa && g.Aa.ka) return g.Aa.ka.length | 0;
    return 0;
  };

  // No stagger. Base is corner-to-corner (W+H) − 7. Timer grows +1 with
  // snake length until half the board, then shrinks −1 per segment after that.
  window.burger_timer_roll = function burger_timer_roll(game) {
    const box = window.burger_board_box();
    if (!box || box.width <= 0 || box.height <= 0) return 25;
    const base = box.width + box.height - 7;
    const half = Math.floor((box.width * box.height) / 2);
    const L = window.burger_snake_length(game);
    const delta = L <= half ? L : 2 * half - L;
    return Math.max(1, base + delta);
  };

  window.burger_assign_timer = function burger_assign_timer(apple, game) {
    if (!apple || apple.Oka) return;
    const t = window.burger_timer_roll(game);
    apple.burgerTimer = t;
    apple.burgerTimerMax = t;
    apple.burgerGrey = 0;
  };

  window.burger_assign_timers_all = function burger_assign_timers_all(
    apples,
    game
  ) {
    if (!apples) return;
    for (let i = 0; i < apples.length; i++) {
      window.burger_assign_timer(apples[i], game);
    }
  };

  // Cache greyscale on the apple (updated from tick, every 3 ticks). Draw
  // reads apple.burgerGrey only — no per-frame math or canvas.filter.
  window.burger_update_grey = function burger_update_grey(apple) {
    if (!apple || apple.Oka || !(apple.burgerTimerMax > 0)) {
      if (apple) apple.burgerGrey = 0;
      return;
    }
    const elapsed = Math.max(
      0,
      apple.burgerTimerMax - Math.max(0, apple.burgerTimer | 0)
    );
    const stepped = Math.floor(elapsed / 3) * 3;
    apple.burgerGrey =
      stepped <= 0
        ? 0
        : Math.min(100, Math.floor((stepped / apple.burgerTimerMax) * 100));
  };

  window.burger_fresh_count = function burger_fresh_count(apples) {
    let n = 0;
    if (!apples) return 0;
    for (let i = 0; i < apples.length; i++) {
      if (apples[i] && !apples[i].Oka) n++;
    }
    return n;
  };

  // Returns how many poisons were removed from below `beforeIndex`, so callers
  // holding an index into mgr.ka can shift it back by that much.
  window.burger_clear_all_poisons = function burger_clear_all_poisons(
    mgr,
    beforeIndex
  ) {
    if (!mgr || !mgr.ka) return 0;
    const limit = beforeIndex == null ? mgr.ka.length : beforeIndex;
    let removedBefore = 0;
    for (let i = mgr.ka.length - 1; i >= 0; i--) {
      if (mgr.ka[i] && mgr.ka[i].Oka) {
        mgr.ka.splice(i, 1);
        if (i < limit) removedBefore++;
      }
    }
    return removedBefore;
  };

  window.burger_head_neighbor_keys = function burger_head_neighbor_keys(game) {
    const keys = new Set();
    const head = game && game.oa && game.oa.ka && game.oa.ka[0];
    if (!head) return keys;
    const pts = [
      [head.x, head.y - 1],
      [head.x, head.y + 1],
      [head.x - 1, head.y],
      [head.x + 1, head.y],
    ];
    for (let i = 0; i < pts.length; i++) {
      keys.add((pts[i][0] << 16) | (pts[i][1] & 65535));
    }
    return keys;
  };

  window.burger_late_game = function burger_late_game(game) {
    const box = window.burger_board_box();
    if (!box) return false;
    const L = window.burger_snake_length(game);
    return L >= box.width * box.height - 5;
  };

  // Pick a legal free cell for a new fresh fruit. Returns null if none.
  window.burger_find_spawn_pos = function burger_find_spawn_pos(game) {
    if (!game) return null;
    const board = game.ka;
    const box = board && board.oa;
    if (!box) return null;
    const late = window.burger_late_game(game);
    const banned = late ? window.burger_head_neighbor_keys(game) : null;
    const keyOf = function (p) {
      return (p.x << 16) | (p.y & 65535);
    };
    // Prefer native free-cell picker (spawn radius / occupancy), then filter.
    // v13: game.Rb; v12: game.Tb.
    const free = game.Rb || game.Tb;
    if (typeof free === "function") {
      for (let attempt = 0; attempt < 24; attempt++) {
        const p = free.call(game, null, 2);
        if (!p) break;
        if (
          p.x >= 0 &&
          p.y >= 0 &&
          p.x < box.width &&
          p.y < box.height &&
          (!banned || !banned.has(keyOf(p)))
        ) {
          return p;
        }
      }
    }
    // Exhaustive scan fallback (still respect late-game ban).
    const occupied = new Set();
    if (game.oa && game.oa.ka) {
      for (let i = 0; i < game.oa.ka.length; i++) {
        const s = game.oa.ka[i];
        if (s) occupied.add(keyOf(s));
      }
    }
    if (game.wa && game.wa.ka) {
      for (let i = 0; i < game.wa.ka.length; i++) {
        const a = game.wa.ka[i];
        if (a && a.pos) occupied.add(keyOf(a.pos));
      }
    }
    const candidates = [];
    for (let x = 0; x < box.width; x++) {
      for (let y = 0; y < box.height; y++) {
        const k = (x << 16) | (y & 65535);
        if (occupied.has(k)) continue;
        if (banned && banned.has(k)) continue;
        candidates.push(
          typeof _ !== "undefined" && _.Od
            ? new _.Od(x, y)
            : typeof _ !== "undefined" && _.Sd
              ? new _.Sd(x, y)
              : { x: x, y: y }
        );
      }
    }
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  window.burger_ended = function burger_ended(game) {
    return !!(game && (game.nj || game.lj));
  };

  window.burger_trigger_win = function burger_trigger_win(game) {
    if (!game || window.burger_ended(game)) return;
    try {
      if (typeof Q4E !== "undefined" && Q4E.rWd && Q4E.rWd.play) Q4E.rWd.play();
      else if (typeof ybF !== "undefined" && ybF.WIN) ybF.WIN.play();
    } catch (_e) {}
    // v13 ended flag is nj; lj is the v12 name. Never set game.ub — that is the mode id.
    game.nj = true;
    game.lj = true;
    try {
      const score = game.Sh != null ? game.Sh : game.Oh;
      if (typeof A7E === "function") A7E(game.menu, 1400, score);
      else if (typeof vdF === "function") vdF(game.menu, 1400, score);
    } catch (_e2) {}
  };

  // Type index of Pudding's skull sprite, the one its "Skull Poison Fruit"
  // setting swaps poisons to. Pudding maps new_fruit[i] to last_fruit_num+1+i.
  window.burger_skull_type = function burger_skull_type() {
    const fruits = window.new_fruit;
    if (!Array.isArray(fruits)) return null;
    const base =
      typeof last_fruit_num !== "undefined"
        ? last_fruit_num
        : document.querySelector("#apple").children.length - 1;
    for (let i = 0; i < fruits.length; i++) {
      if (fruits[i] && /poison-skull/.test(fruits[i].Real || "")) {
        return base + 1 + i;
      }
    }
    return null;
  };

  window.burger_make_poison = function burger_make_poison(apple, game) {
    if (!apple) return;
    // Poison keeps the fruit's original max as its lifetime — no grey indicator.
    const life = apple.burgerTimerMax | 0;
    apple.Oka = true;
    apple.burgerGrey = 0;
    // Burger+Chess blender: expired pieces are plain poisons — not unlockable.
    apple.isPiece = false;
    apple.ChessPiece = undefined;
    apple.ChessColor = undefined;
    if (life > 0) {
      apple.burgerTimer = life;
      apple.burgerTimerMax = life;
    } else {
      const t = window.burger_timer_roll(game);
      apple.burgerTimer = t;
      apple.burgerTimerMax = t;
    }
    // nla alone only greys the fruit out, and Pudding's skull swap is behind a
    // user setting. Burger always wants the skull, so set the type directly.
    const skull = window.burger_skull_type();
    if (skull != null) apple.type = skull;
    else console.error("BurgerMod: could not resolve Pudding skull fruit type");
  };

  window.burger_spawn_fresh = function burger_spawn_fresh(game, sequenceNumber) {
    const pos = window.burger_find_spawn_pos(game);
    if (!pos) return false;
    const mgr = game.wa;
    if (!mgr) return false;
    // Prefer native qaF (sets Cm animation, type, etc.) with no-pairing flag.
    // Pass sequenceNumber through so Tally replacements stay on the open index.
    if (typeof window.__qaF === "function") {
      const before = mgr.ka.length;
      window.__qaF(mgr, pos, void 0, true, sequenceNumber, true);
      if (mgr.ka.length > before) {
        const last = mgr.ka[mgr.ka.length - 1];
        last.Oka = false;
        if (sequenceNumber !== undefined) last.sequenceNumber = sequenceNumber;
        window.burger_assign_timer(last, game);
        return true;
      }
    }
    if (typeof window.__h7 === "function") {
      const apple = window.__h7(mgr, 0, 0);
      if (typeof pos.clone === "function") apple.pos = pos.clone();
      else {
        apple.pos.x = pos.x;
        apple.pos.y = pos.y;
      }
      apple.wm = true;
      apple.Cm = true;
      apple.Oka = false;
      apple.Gh = true;
      if (sequenceNumber !== undefined) apple.sequenceNumber = sequenceNumber;
      if (typeof window.__aaF === "function") apple.type = window.__aaF(mgr);
      window.burger_assign_timer(apple, game);
      mgr.ka.push(apple);
      return true;
    }
    return false;
  };

  // Expire one fresh apple to poison, then try to spawn a replacement.
  window.burger_expire_apple = function burger_expire_apple(game, apple) {
    const seq = apple && apple.sequenceNumber;
    window.burger_make_poison(apple, game);
    const spawned = window.burger_spawn_fresh(game, seq);
    const freshLeft = window.burger_fresh_count(game.wa.ka);
    if (!spawned && freshLeft === 0) {
      window.burger_trigger_win(game);
    }
  };

  // Poison timer ran out — just remove it (no replacement, no indicator).
  window.burger_despawn_poison = function burger_despawn_poison(game, apple) {
    if (!game || !game.wa || !game.wa.ka || !apple) return;
    const i = game.wa.ka.indexOf(apple);
    if (i >= 0) game.wa.ka.splice(i, 1);
  };

  window.burger_apple_timer_eligible = function burger_apple_timer_eligible(
    game,
    apple
  ) {
    if (!apple) return false;
    // Poisons always count down (no tally gate, no grey overlay).
    if (apple.Oka) return true;
    // Tally: only the current index ages for fresh fruit.
    if (game.settings && game.settings.ka === 6) {
      const cur = game.wa ? game.wa.wa : 1;
      if (apple.sequenceNumber !== undefined && apple.sequenceNumber !== cur) {
        return false;
      }
    }
    return true;
  };

  window.burger_tick_logic = function burger_tick_logic() {
    if (!window.isBurgerActive || !window.isBurgerActive()) return;
    const game = window.__remixGame;
    if (!game || !game.wa || !game.wa.ka || window.burger_ended(game)) return;
    const apples = game.wa.ka;
    const toExpire = [];
    for (let i = 0; i < apples.length; i++) {
      const a = apples[i];
      if (!window.burger_apple_timer_eligible(game, a)) continue;
      if (a.burgerTimer == null) {
        if (a.Oka) {
          const t = window.burger_timer_roll(game);
          a.burgerTimer = t;
          a.burgerTimerMax = t;
        } else {
          window.burger_assign_timer(a, game);
        }
      }
      // Already at zero: resolve once, never keep decrementing past it.
      if ((a.burgerTimer | 0) <= 0) {
        a.burgerTimer = 0;
        toExpire.push(a);
        continue;
      }
      a.burgerTimer = (a.burgerTimer | 0) - 1;
      if (a.burgerTimer <= 0) {
        a.burgerTimer = 0;
        if (!a.Oka) a.burgerGrey = 100;
        toExpire.push(a);
      } else if (!a.Oka && (a.burgerTimerMax - a.burgerTimer) % 3 === 0) {
        // Only refresh the cached overlay every 3 ticks (fresh fruit only).
        window.burger_update_grey(a);
      }
    }
    for (let i = 0; i < toExpire.length; i++) {
      if (window.burger_ended(game)) break;
      const a = toExpire[i];
      if (apples.indexOf(a) < 0) continue;
      if (a.Oka) window.burger_despawn_poison(game, a);
      else window.burger_expire_apple(game, a);
    }
  };

  // Poisons are no longer cleared on fresh eat — they keep their own timers.
  // Still clear the eaten slot's timer so Mn's reused apple gets a new roll.
  window.burger_on_fresh_eaten = function burger_on_fresh_eaten(
    game,
    eatenIndex
  ) {
    if (!game || !game.wa) return eatenIndex;
    window.just_ate = "fruit";
    window.burger_fruits_eaten = (window.burger_fruits_eaten | 0) + 1;
    let eaten =
      eatenIndex != null && eatenIndex !== ""
        ? game.wa.ka[eatenIndex | 0]
        : null;
    // Index can be stale after poison splices; fall back to the apple under head.
    if (
      (!eaten || eaten.Oka) &&
      typeof window.findApple === "function" &&
      window.head_pos &&
      window.head_pos[0]
    ) {
      const under = window.findApple(window.head_pos[0], game.wa.ka);
      if (under && !under.Oka && !under.isPiece) eaten = under;
    }
    if (eaten && !eaten.Oka) {
      eaten.burgerTimer = null;
      eaten.burgerTimerMax = null;
      eaten.burgerGrey = 0;
      eaten.__burgerNeedsRoll = true;
    }
    return eatenIndex | 0;
  };

  window.burger_after_respawn = function burger_after_respawn(game) {
    if (!game || !game.wa) return;
    // Mn reuses the eaten apple in place (moves pos). Re-roll any slot that
    // was cleared on eat, or still lacks a timer (brand-new spawn).
    for (let i = 0; i < game.wa.ka.length; i++) {
      const a = game.wa.ka[i];
      if (!a || a.Oka) continue;
      if (a.__burgerNeedsRoll || a.burgerTimer == null) {
        window.burger_assign_timer(a, game);
        delete a.__burgerNeedsRoll;
      }
    }
  };

  // --- Patches ---

  // Burger patches the output of every earlier mod, so when one stops matching
  // it helps to see the exact text it was matched against.
  if (window.RemixDebug) window.__remixPreBurgerCode = code;

  // Extend Chess-patched e7 (or raw) so Burger activates Poison mode (10).
  if (
    code.match(
      /e7=function\(a,b\)\{var r=a\.Qa\?a\.Lc\.has\(b\):a\.ub===22&&a\.rSa\.has\(b\)\?!0:a\.ub===b;if\(!r&&b===15&&window\.CHESS_MODE!=null\)/
    )
  ) {
    code = code.assertReplace(
      /e7=function\(a,b\)\{var r=a\.Qa\?a\.Lc\.has\(b\):a\.ub===22&&a\.rSa\.has\(b\)\?!0:a\.ub===b;if\(!r&&b===15&&window\.CHESS_MODE!=null\)\{if\(a\.ub===window\.CHESS_MODE\)return!0;if\(a\.ub===22&&a\.rSa&&a\.rSa\.has\(window\.CHESS_MODE\)\)return!0;\}return r\}/,
      `e7=function(a,b){var r=a.Qa?a.Lc.has(b):a.ub===22&&a.rSa.has(b)?!0:a.ub===b;if(!r&&b===15&&window.CHESS_MODE!=null){if(a.ub===window.CHESS_MODE)return!0;if(a.ub===22&&a.rSa&&a.rSa.has(window.CHESS_MODE))return!0;}if(!r&&b===10&&window.BURGER_MODE!=null){if(a.ub===window.BURGER_MODE)return!0;if(a.ub===22&&a.rSa&&a.rSa.has(window.BURGER_MODE))return!0;}return r}`
    );
  } else if (
    code.match(
      /e7=function\(a,b\)\{return a\.Qa\?a\.Lc\.has\(b\):a\.ub===22&&a\.rSa\.has\(b\)\?!0:a\.ub===b\}/
    )
  ) {
    code = code.assertReplace(
      /e7=function\(a,b\)\{return a\.Qa\?a\.Lc\.has\(b\):a\.ub===22&&a\.rSa\.has\(b\)\?!0:a\.ub===b\}/,
      `e7=function(a,b){var r=a.Qa?a.Lc.has(b):a.ub===22&&a.rSa.has(b)?!0:a.ub===b;if(!r&&b===10&&window.BURGER_MODE!=null){if(a.ub===window.BURGER_MODE)return!0;if(a.ub===22&&a.rSa&&a.rSa.has(window.BURGER_MODE))return!0;}return r}`
    );
  } else {
    console.error("BurgerMod: failed to patch e7 for poison mode");
  }

  // Classic layout: Y3E must ignore Burger's e7(10).
  if (code.match(/Y3E=function\(a\)\{return e7\(a,2\)\|\|e7\(a,8\)\|\|e7\(a,9\)\|\|e7\(a,10\)\}/)) {
    code = code.assertReplace(
      /Y3E=function\(a\)\{return e7\(a,2\)\|\|e7\(a,8\)\|\|e7\(a,9\)\|\|e7\(a,10\)\}/,
      `Y3E=function(a){return e7(a,2)||e7(a,8)||e7(a,9)||(e7(a,10)&&!(window.isBurgerActive&&window.isBurgerActive()))}`
    );
  } else {
    console.error("BurgerMod: failed to patch Y3E");
  }

  // Suppress Poison's e4E auto-poison twin spawn for Burger.
  if (code.match(/e7\(a\.settings,10\)&&!f&&e4E\(a\)/)) {
    code = code.assertReplace(
      /e7\(a\.settings,10\)&&!f&&e4E\(a\)/,
      `e7(a.settings,10)&&!f&&!(window.isBurgerActive&&window.isBurgerActive())&&e4E(a)`
    );
  } else {
    console.error("BurgerMod: failed to patch e4E gate");
  }

  // Native Poison pairs every other apple as poison at game start / after some
  // spawns (l4E). That is exactly the "5a starts with 2 poisons" bug. Gate every
  // call site and the function itself.
  {
    const l4ECalls = code.match(
      /e7\((?:this|a)\.settings,10\)\s*&&\s*l4E\((?:this|a)\.wa\)/g
    );
    if (l4ECalls && l4ECalls.length) {
      code = code.replace(
        /e7\((this|a)\.settings,10\)\s*&&\s*l4E\(\1\.wa\)/g,
        `e7($1.settings,10)&&!(window.isBurgerActive&&window.isBurgerActive())&&l4E($1.wa)`
      );
    } else {
      console.error("BurgerMod: failed to patch l4E call sites");
    }
  }
  if (
    code.match(
      /l4E=function\(a\)\{for\(let b=0;b\+1<a\.ka\.length;b\+=2\)\{let c=Math\.random\(\)<\.5;\s*a\.ka\[b\]\.Oka=c;a\.ka\[b\+1\]\.Oka=!c\}\}/
    )
  ) {
    code = code.assertReplace(
      /l4E=function\(a\)\{for\(let b=0;b\+1<a\.ka\.length;b\+=2\)\{let c=Math\.random\(\)<\.5;\s*a\.ka\[b\]\.Oka=c;a\.ka\[b\+1\]\.Oka=!c\}\}/,
      `l4E=function(a){if(window.isBurgerActive&&window.isBurgerActive())return;for(let b=0;b+1<a.ka.length;b+=2){let c=Math.random()<.5;a.ka[b].Oka=c;a.ka[b+1].Oka=!c}};window.__l4E=l4E;window.__uaF=l4E`
    );
  } else {
    console.error("BurgerMod: failed to patch l4E function");
  }

  // Portal-pair path inside qaF also flips nla on the new pair under Poison.
  if (
    code.match(
      /e7\(a\.settings,10\)&&\(c=Math\.random\(\)<\.5,a\.ka\[a\.ka\.length-1\]\.Oka=c,a\.ka\[a\.ka\.length-2\]\.Oka=!c\)/
    )
  ) {
    code = code.assertReplace(
      /e7\(a\.settings,10\)&&\(c=Math\.random\(\)<\.5,a\.ka\[a\.ka\.length-1\]\.Oka=c,a\.ka\[a\.ka\.length-2\]\.Oka=!c\)/,
      `e7(a.settings,10)&&!(window.isBurgerActive&&window.isBurgerActive())&&(c=Math.random()<.5,a.ka[a.ka.length-1].Oka=c,a.ka[a.ka.length-2].Oka=!c)`
    );
  } else {
    console.error("BurgerMod: failed to patch qaF nla pair");
  }

  // Native Poison also top-ups poisons after a fresh eat (keep ≥ half poisoned).
  // Burger piles poisons only via timers, so disable that refill.
  // Only the e4E call is rewritten: MoreMenu respaces the operators in this
  // statement, so matching the whole `if` verbatim is too brittle.
  const poisonTopUp =
    /(for\(let c of a\.ka\)c\.Oka&&b\+\+;b<a\.ka\.length\/2&&\s*)e4E\(a\)/;
  if (code.match(poisonTopUp)) {
    code = code.assertReplace(
      poisonTopUp,
      `$1!(window.isBurgerActive&&window.isBurgerActive())&&e4E(a)`
    );
  } else {
    console.error("BurgerMod: failed to patch poison top-up e4E");
  }

  // Tick: run burger aging after chess hook (match Chess-injected tick).
  if (
    code.match(
      /\}tick\(\)\{window\.__remixGame=this;if\(window\.isChessActive&&window\.isChessActive\(\)\)\{try\{window\.head_pos=this\.oa\.ka;window\.head_dir=this\.oa\.direction;window\.appleArray=this\.wa\.ka;window\.chess_tick_logic\(\);\}catch\(_ce\)\{console\.error\("ChessMod: tick failed",_ce\);\}\}var a=this\.Aa,b=this\.nj;/
    )
  ) {
    code = code.assertReplace(
      /\}tick\(\)\{window\.__remixGame=this;if\(window\.isChessActive&&window\.isChessActive\(\)\)\{try\{window\.head_pos=this\.oa\.ka;window\.head_dir=this\.oa\.direction;window\.appleArray=this\.wa\.ka;window\.chess_tick_logic\(\);\}catch\(_ce\)\{console\.error\("ChessMod: tick failed",_ce\);\}\}var a=this\.Aa,b=this\.nj;/,
      `}tick(){window.__remixGame=this;if(window.isChessActive&&window.isChessActive()){try{window.head_pos=this.oa.ka;window.head_dir=this.oa.direction;window.appleArray=this.wa.ka;window.chess_tick_logic();}catch(_ce){console.error("ChessMod: tick failed",_ce);}}if(window.isBurgerActive&&window.isBurgerActive()){try{window.burger_tick_logic();}catch(_be){console.error("BurgerMod: tick failed",_be);}}var a=this.Aa,b=this.nj;`
    );
  } else if (code.match(/\}tick\(\)\{window\.__remixGame=this;/)) {
    code = code.assertReplace(
      /\}tick\(\)\{window\.__remixGame=this;/,
      `}tick(){window.__remixGame=this;if(window.isBurgerActive&&window.isBurgerActive()){try{window.burger_tick_logic();}catch(_be){}}`
    );
  } else {
    console.error("BurgerMod: failed to find tick()");
  }

  // After apple reset / shield init (Chess may have already appended): assign burger timers.
  // Hook the end of apple manager reset via shield init line (post-Pudding doubleDE).
  // Chess may gate P3E behind ultraShouldSpawnFruitShields (Remix Ultra).
  const burgerShieldInit =
    /if\(e7\(this\.settings,15\)(?:&&\(!window\.ultraShouldSpawnFruitShields\|\|window\.ultraShouldSpawnFruitShields\(\)\))?\)for\(let q of this\.ka\)q\.nba=P3E\(this,q\.pos\);/;
  const burgerShieldInitChess =
    /if\(e7\(this\.settings,15\)(?:&&\(!window\.ultraShouldSpawnFruitShields\|\|window\.ultraShouldSpawnFruitShields\(\)\))?\)for\(let q of this\.ka\)q\.nba=P3E\(this,q\.pos\);if\(window\.isChessActive&&window\.isChessActive\(\)\)\{try\{window\.appleArray=this\.ka;window\.randomize_pieces\(\);window\.shield_empty_all\(\);\}catch\(_ce\)\{console\.error\("ChessMod: reset failed",_ce\);\}\}/;
  if (code.match(burgerShieldInitChess)) {
    code = code.assertReplace(
      burgerShieldInitChess,
      `if(e7(this.settings,15)&&(!window.ultraShouldSpawnFruitShields||window.ultraShouldSpawnFruitShields()))for(let q of this.ka)q.nba=P3E(this,q.pos);if(window.isChessActive&&window.isChessActive()){try{window.appleArray=this.ka;window.randomize_pieces();window.shield_empty_all();}catch(_ce){console.error("ChessMod: reset failed",_ce);}}if(window.isBurgerActive&&window.isBurgerActive()){try{window.burger_fruits_eaten=0;window.burger_assign_timers_all(this.ka);}catch(_be){console.error("BurgerMod: reset failed",_be);}}`
    );
  } else if (code.match(burgerShieldInit)) {
    code = code.assertReplace(
      burgerShieldInit,
      `if(e7(this.settings,15)&&(!window.ultraShouldSpawnFruitShields||window.ultraShouldSpawnFruitShields()))for(let q of this.ka)q.nba=P3E(this,q.pos);if(window.isBurgerActive&&window.isBurgerActive()){try{window.burger_fruits_eaten=0;window.burger_assign_timers_all(this.ka);}catch(_be){}}`
    );
  } else {
    console.error("BurgerMod: failed to find reset timer hook");
  }

  // Also assign timers when no shield mode (classic reset without Oba loop).
  // After settings.ka===6 tally init on reset:
  if (code.match(/this\.settings\.ka===6&&\(\$3E\(this\),this\.Ca=!1\)\}/)) {
    code = code.assertReplace(
      /this\.settings\.ka===6&&\(\$3E\(this\),this\.Ca=!1\)\}/,
      `this.settings.ka===6&&($3E(this),this.Ca=!1);if(window.isBurgerActive&&window.isBurgerActive()){try{window.burger_fruits_eaten=0;window.burger_assign_timers_all(this.ka);}catch(_be){}}}`
    );
  }

  // After qaF adds apples: assign timers to new non-poison ones.
  // Chess may have appended chess_convert; match either form.
  if (
    code.match(
      /if\(window\.isChessActive&&window\.isChessActive\(\)&&g>0\)\{window\.chess_convert_new_apples\(a,g\);\}/
    )
  ) {
    code = code.assertReplace(
      /if\(window\.isChessActive&&window\.isChessActive\(\)&&g>0\)\{window\.chess_convert_new_apples\(a,g\);\}/,
      `if(window.isChessActive&&window.isChessActive()&&g>0){window.chess_convert_new_apples(a,g);}if(window.isBurgerActive&&window.isBurgerActive()&&g>0){for(let _bi=a.ka.length-g;_bi<a.ka.length;_bi++){if(a.ka[_bi]&&!a.ka[_bi].Oka)window.burger_assign_timer(a.ka[_bi]);}}`
    );
  } else if (
    code.match(
      /g=a\.ka\.length-g;if\(e!==void 0\)for\(c=0;c<g;c\+\+\)a\.ka\[a\.ka\.length-1-c\]\.sequenceNumber=e;if\(e7\(a\.settings,15\)(?:&&\(!window\.ultraShouldSpawnFruitShields\|\|window\.ultraShouldSpawnFruitShields\(\)\))?\)for\(e=0;e<g;e\+\+\)c=a\.ka\[a\.ka\.length-1-e\],c\.nba=P3E\(a,c\.pos\);/
    )
  ) {
    code = code.assertReplace(
      /g=a\.ka\.length-g;if\(e!==void 0\)for\(c=0;c<g;c\+\+\)a\.ka\[a\.ka\.length-1-c\]\.sequenceNumber=e;if\(e7\(a\.settings,15\)(?:&&\(!window\.ultraShouldSpawnFruitShields\|\|window\.ultraShouldSpawnFruitShields\(\)\))?\)for\(e=0;e<g;e\+\+\)c=a\.ka\[a\.ka\.length-1-e\],c\.nba=P3E\(a,c\.pos\);/,
      `g=a.ka.length-g;if(e!==void 0)for(c=0;c<g;c++)a.ka[a.ka.length-1-c].sequenceNumber=e;if(e7(a.settings,15)&&(!window.ultraShouldSpawnFruitShields||window.ultraShouldSpawnFruitShields()))for(e=0;e<g;e++)c=a.ka[a.ka.length-1-e],c.nba=P3E(a,c.pos);if(window.isBurgerActive&&window.isBurgerActive()&&g>0){for(let _bi=a.ka.length-g;_bi<a.ka.length;_bi++){if(a.ka[_bi]&&!a.ka[_bi].Oka)window.burger_assign_timer(a.ka[_bi]);}}`
    );
  } else {
    console.error("BurgerMod: failed to find qaF trailing hook");
  }

  // Fresh eat: clear timer on the eaten apple BEFORE Mn reuses/moves it.
  // Chess's Sh++ site has grown (second-piece eat); match current + fall back
  // to every a.Sh++; that is not already Burger-hooked.
  const appleIndexMatch = code.match(
    /e7\(a\.settings,10\)\s*&&\s*i4E\(a\.wa,([a-zA-Z0-9_$]{1,6}),[a-zA-Z0-9_$]{1,6},a\.Lc\.bind\(a\)\)\s*&&\s*\1--/
  );
  const idx = appleIndexMatch && appleIndexMatch[1];
  if (!idx) {
    console.error("BurgerMod: failed to find eat-loop apple index variable");
  }
  const onFreshEaten = idx
    ? `if(window.isBurgerActive&&window.isBurgerActive())${idx}=window.burger_on_fresh_eaten(a,${idx});`
    : `if(window.isBurgerActive&&window.isBurgerActive())window.burger_on_fresh_eaten(a);`;

  const chessScoreWithSecond =
    /if\(window\.isChessActive&&window\.isChessActive\(\)\)\{let _ae=window\.findApple\(window\.head_pos\[0\],window\.appleArray\);if\(_ae&&!_ae\.isPiece\)\{window\.just_ate='fruit';a\.Sh\+\+;\}else if\(_ae&&_ae\.isPiece\)\{window\.just_ate='piece';if\(window\.head_state!=='OPEN'&&window\.chess_on_second_piece_eat\)\{window\.chess_on_second_piece_eat\(_ae\);\}else\{window\.head_state=_ae\.ChessPiece;window\.updateTrophySRC\(_ae\.type\);window\.head_color=_ae\.ChessColor;window\.shield_all\(\);\}\}else\{window\.just_ate='fruit';a\.Sh\+\+;\}\}else\{a\.Sh\+\+;\}/;
  const chessScoreLegacy =
    /if\(window\.isChessActive&&window\.isChessActive\(\)\)\{let _ae=window\.findApple\(window\.head_pos\[0\],window\.appleArray\);if\(_ae&&!_ae\.isPiece\)\{window\.just_ate='fruit';a\.Sh\+\+;\}else if\(_ae&&_ae\.isPiece\)\{window\.just_ate='piece';window\.head_state=_ae\.ChessPiece;window\.updateTrophySRC\(_ae\.type\);window\.head_color=_ae\.ChessColor;window\.shield_all\(\);\}else\{window\.just_ate='fruit';a\.Sh\+\+;\}\}else\{a\.Sh\+\+;\}/;

  if (code.match(chessScoreWithSecond)) {
    code = code.assertReplace(
      chessScoreWithSecond,
      `if(window.isChessActive&&window.isChessActive()){let _ae=window.findApple(window.head_pos[0],window.appleArray);if(_ae&&!_ae.isPiece){window.just_ate='fruit';a.Sh++;${onFreshEaten}}else if(_ae&&_ae.isPiece){window.just_ate='piece';if(window.head_state!=='OPEN'&&window.chess_on_second_piece_eat){window.chess_on_second_piece_eat(_ae);}else{window.head_state=_ae.ChessPiece;window.updateTrophySRC(_ae.type);window.head_color=_ae.ChessColor;window.shield_all();}}else{window.just_ate='fruit';a.Sh++;${onFreshEaten}}}else{a.Sh++;${onFreshEaten}}`
    );
  } else if (code.match(chessScoreLegacy)) {
    code = code.assertReplace(
      chessScoreLegacy,
      `if(window.isChessActive&&window.isChessActive()){let _ae=window.findApple(window.head_pos[0],window.appleArray);if(_ae&&!_ae.isPiece){window.just_ate='fruit';a.Sh++;${onFreshEaten}}else if(_ae&&_ae.isPiece){window.just_ate='piece';window.head_state=_ae.ChessPiece;window.updateTrophySRC(_ae.type);window.head_color=_ae.ChessColor;window.shield_all();}else{window.just_ate='fruit';a.Sh++;${onFreshEaten}}}else{a.Sh++;${onFreshEaten}}`
    );
  } else if (code.match(/a\.Sh\+\+;/)) {
    // Last resort: hook every score bump that is not already Burger-aware.
    code = code.replace(/a\.Sh\+\+;/g, function (m, offset, full) {
      const next = full.slice(offset, offset + 160);
      if (next.indexOf("burger_on_fresh_eaten") >= 0) return m;
      return `a.Sh++;${onFreshEaten}`;
    });
  } else {
    console.error("BurgerMod: failed to find score hook");
  }

  // After chess fruit respawn AND native Vm, re-assign timers on new apples.
  const afterRespawn =
    `if(window.isBurgerActive&&window.isBurgerActive()&&window.just_ate==='fruit'){window.burger_after_respawn(a);}`;
  if (
    code.match(
      /window\.chess_fruit_respawn\(a\.wa,g7,d4E,Q3E\);/
    )
  ) {
    code = code.assertReplace(
      /window\.chess_fruit_respawn\(a\.wa,g7,d4E,Q3E\);/,
      `window.chess_fruit_respawn(a.wa,g7,d4E,Q3E);${afterRespawn}`
    );
  }
  // Burger-only eats go through native Vm (BombFruit may drop the `e=` assign).
  if (!/a\.Vm\(k,\s*!e,null\)\);if\(window\.isBurgerActive&&window\.isBurgerActive\(\)&&window\.just_ate===/.test(code)) {
    if (code.match(/(?:e=)?a\.Vm\(k,\s*!e,null\)\);/)) {
      code = code.replace(
        /((?:e=)?a\.Vm\(k,\s*!e,null\)\);)/,
        `$1${afterRespawn}`
      );
    } else {
      console.error("BurgerMod: failed to find native Vm respawn for after_respawn");
    }
  }

  // Aging overlay on fruit drawImage.
  // Expression-safe (Visibility leaves this call after `&&`). Dark circle from
  // the tick-cached burgerGrey — never canvas.filter. Near expiry it reads as a
  // near-black disk so the poison transition is obvious.
  if (code.match(/this\.ka\.drawImage\(f,0,0,g,g,-d\/2,-d\/2,d,d\);/)) {
    code = code.assertReplace(
      /this\.ka\.drawImage\(f,0,0,g,g,-d\/2,-d\/2,d,d\);/,
      `(this.ka.drawImage(f,0,0,g,g,-d/2,-d/2,d,d),b&&!b.Oka&&b.burgerGrey>0&&(this.ka.globalAlpha=Math.min(.85,b.burgerGrey/110),this.ka.fillStyle="#1a1a1a",this.ka.beginPath(),this.ka.arc(0,0,d*.32,0,6.283185307179586),this.ka.fill(),this.ka.globalAlpha=1));`
    );
  } else {
    console.error("BurgerMod: failed to find fruit drawImage for greyscale");
  }

  // Deathscreen / blender icons: extend Candy/Chess patches.
  if (code.indexOf("window.BURGER_MODE)?window.BURGER_ICON") < 0) {
    if (code.indexOf("window.CHESS_MODE)?window.CHESS_ICON") >= 0) {
      code = code.assertReplace(
        /\(a\.settings\.ob===window\.CANDY_MODE\)\?window\.CANDY_ICON:\(a\.settings\.ob===window\.CHESS_MODE\)\?window\.CHESS_ICON:/,
        `(a.settings.ob===window.CANDY_MODE)?window.CANDY_ICON:(a.settings.ob===window.CHESS_MODE)?window.CHESS_ICON:(a.settings.ob===window.BURGER_MODE)?window.BURGER_ICON:`
      );
      code = code.assertReplace(
        /\(c===window\.CANDY_MODE\)\?window\.CANDY_ICON:\(c===window\.CHESS_MODE\)\?window\.CHESS_ICON:/,
        `(c===window.CANDY_MODE)?window.CANDY_ICON:(c===window.CHESS_MODE)?window.CHESS_ICON:(c===window.BURGER_MODE)?window.BURGER_ICON:`
      );
    }
  }

  // Blender forEach: add burger
  if (
    code.match(
      /if\(window\.candy_blending&&window\.CANDY_MODE!=null\)b\.push\(window\.CANDY_MODE\);if\(window\.chess_blending&&window\.CHESS_MODE!=null\)b\.push\(window\.CHESS_MODE\)/
    )
  ) {
    code = code.assertReplace(
      /if\(window\.candy_blending&&window\.CANDY_MODE!=null\)b\.push\(window\.CANDY_MODE\);if\(window\.chess_blending&&window\.CHESS_MODE!=null\)b\.push\(window\.CHESS_MODE\)/,
      `if(window.candy_blending&&window.CANDY_MODE!=null)b.push(window.CANDY_MODE);if(window.chess_blending&&window.CHESS_MODE!=null)b.push(window.CHESS_MODE);if(window.burger_blending&&window.BURGER_MODE!=null)b.push(window.BURGER_MODE)`
    );
  }

  // Ta fallback: recognize burger icon
  if (code.indexOf("13m2Cr16") < 0 && code.indexOf("ZqK0CB95") >= 0) {
    code = code.assertReplace(
      /else if\(window\.CHESS_MODE!=null&&s\.indexOf\("ZqK0CB95"\)>=0\)m=window\.CHESS_MODE;/,
      `else if(window.CHESS_MODE!=null&&s.indexOf("ZqK0CB95")>=0)m=window.CHESS_MODE;else if(window.BURGER_MODE!=null&&s.indexOf("13m2Cr16")>=0)m=window.BURGER_MODE;`
    );
  }

  // Play start trophy
  if (code.indexOf("updateBurgerTrophySRC") < 0) {
    if (code.indexOf("updateCandyTrophySRC") >= 0) {
      // Chess may have appended CHESS update already
      if (code.indexOf("CurrentModeNum===window.CHESS_MODE") >= 0) {
        code = code.assertReplace(
          /if\(window\.CurrentModeNum===window\.CHESS_MODE\)\{window\.updateTrophySRC\(\);\}/,
          `if(window.CurrentModeNum===window.CHESS_MODE){window.updateTrophySRC();}if(window.CurrentModeNum===window.BURGER_MODE){window.updateBurgerTrophySRC();}`
        );
      } else {
        code = code.assertReplace(
          /if\(window\.CurrentModeNum===window\.CANDY_MODE\)\{window\.updateCandyTrophySRC\(\);\}/,
          `if(window.CurrentModeNum===window.CANDY_MODE){window.updateCandyTrophySRC();}if(window.CurrentModeNum===window.BURGER_MODE){window.updateBurgerTrophySRC();}`
        );
      }
    }
  }

  // Expose apple helpers after their definitions complete (assignment form).
  if (code.match(/g7=function\(a,b,c\)\{b=new _\.Od/)) {
    code = code.assertReplace(
      /g7=function\(a,b,c\)\{b=new _\.Od/,
      `g7=function(a,b,c){window.__h7=g7;window.__aaF=Q3E;window.__qaF=f4E;b=new _.Od`
    );
  } else {
    console.error("BurgerMod: failed to expose g7/f4E");
  }

  return code;
};

////////////////////////////////////////////////////////////////////
//RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.BurgerMod.runCodeAfter = function () {
  window.add_burger_blender_toggle && window.add_burger_blender_toggle();
};
