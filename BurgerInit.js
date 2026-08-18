window.BurgerMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.BurgerMod.runCodeBefore = function () {
  console.log("Adding Burger Mode (v13)");

  window.BURGER_ICON = "https://i.postimg.cc/13m2Cr16/burger.png";

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
    return (
      window.CurrentModeNum === window.BURGER_MODE ||
      (window.CurrentModeNum === 22 && window.burger_blending)
    );
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
    const eaten = game.wa.ka[eatenIndex | 0];
    if (eaten && !eaten.Oka) {
      eaten.burgerTimer = null;
      eaten.burgerTimerMax = null;
      eaten.burgerGrey = 0;
    }
    return eatenIndex | 0;
  };

  window.burger_after_respawn = function burger_after_respawn(game) {
    if (!game || !game.wa) return;
    // Only apples that still lack a timer (the Mn-reused eaten slot, or a brand
    // new spawn) get a roll. Existing countdowns are left alone.
    for (let i = 0; i < game.wa.ka.length; i++) {
      const a = game.wa.ka[i];
      if (a && !a.Oka && a.burgerTimer == null) {
        window.burger_assign_timer(a, game);
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
      `l4E=function(a){if(window.isBurgerActive&&window.isBurgerActive())return;for(let b=0;b+1<a.ka.length;b+=2){let c=Math.random()<.5;a.ka[b].Oka=c;a.ka[b+1].Oka=!c}};window.__l4E=l4E`
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
  if (
    code.match(
      /if\(e7\(this\.settings,15\)\)for\(let q of this\.ka\)q\.nba=P3E\(this,q\.pos\);if\(window\.isChessActive&&window\.isChessActive\(\)\)/
    )
  ) {
    code = code.assertReplace(
      /if\(e7\(this\.settings,15\)\)for\(let q of this\.ka\)q\.nba=P3E\(this,q\.pos\);if\(window\.isChessActive&&window\.isChessActive\(\)\)\{try\{window\.appleArray=this\.ka;window\.randomize_pieces\(\);window\.shield_empty_all\(\);\}catch\(_ce\)\{console\.error\("ChessMod: reset failed",_ce\);\}\}/,
      `if(e7(this.settings,15))for(let q of this.ka)q.nba=P3E(this,q.pos);if(window.isChessActive&&window.isChessActive()){try{window.appleArray=this.ka;window.randomize_pieces();window.shield_empty_all();}catch(_ce){console.error("ChessMod: reset failed",_ce);}}if(window.isBurgerActive&&window.isBurgerActive()){try{window.burger_fruits_eaten=0;window.burger_assign_timers_all(this.ka);}catch(_be){console.error("BurgerMod: reset failed",_be);}}`
    );
  } else if (
    code.match(
      /if\(e7\(this\.settings,15\)\)for\(let q of this\.ka\)q\.nba=P3E\(this,q\.pos\);/
    )
  ) {
    code = code.assertReplace(
      /if\(e7\(this\.settings,15\)\)for\(let q of this\.ka\)q\.nba=P3E\(this,q\.pos\);/,
      `if(e7(this.settings,15))for(let q of this.ka)q.nba=P3E(this,q.pos);if(window.isBurgerActive&&window.isBurgerActive()){try{window.burger_fruits_eaten=0;window.burger_assign_timers_all(this.ka);}catch(_be){}}`
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
      /g=a\.ka\.length-g;if\(e!==void 0\)for\(c=0;c<g;c\+\+\)a\.ka\[a\.ka\.length-1-c\]\.sequenceNumber=e;if\(e7\(a\.settings,15\)\)for\(e=0;e<g;e\+\+\)c=a\.ka\[a\.ka\.length-1-e\],c\.nba=P3E\(a,c\.pos\);/
    )
  ) {
    code = code.assertReplace(
      /g=a\.ka\.length-g;if\(e!==void 0\)for\(c=0;c<g;c\+\+\)a\.ka\[a\.ka\.length-1-c\]\.sequenceNumber=e;if\(e7\(a\.settings,15\)\)for\(e=0;e<g;e\+\+\)c=a\.ka\[a\.ka\.length-1-e\],c\.nba=P3E\(a,c\.pos\);/,
      `g=a.ka.length-g;if(e!==void 0)for(c=0;c<g;c++)a.ka[a.ka.length-1-c].sequenceNumber=e;if(e7(a.settings,15))for(e=0;e<g;e++)c=a.ka[a.ka.length-1-e],c.nba=P3E(a,c.pos);if(window.isBurgerActive&&window.isBurgerActive()&&g>0){for(let _bi=a.ka.length-g;_bi<a.ka.length;_bi++){if(a.ka[_bi]&&!a.ka[_bi].Oka)window.burger_assign_timer(a.ka[_bi]);}}`
    );
  } else {
    console.error("BurgerMod: failed to find qaF trailing hook");
  }

  // Fresh eat: clear poisons + bump eat count BEFORE score side-effects finish / before Mn.
  // Hook at a.Sh++ — Chess may have replaced it; handle both.

  // Clearing poisons splices game.wa.ka, so the eat loop's index has to be
  // corrected in place. Its name is minified, so read it off the i4E call that
  // sits in the same statement (native Poison already decrements it there).
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

  if (
    code.match(
      /if\(window\.isChessActive&&window\.isChessActive\(\)\)\{let _ae=window\.findApple\(window\.head_pos\[0\],window\.appleArray\);if\(_ae&&!_ae\.isPiece\)\{window\.just_ate='fruit';a\.Sh\+\+;\}else if\(_ae&&_ae\.isPiece\)\{window\.just_ate='piece';window\.head_state=_ae\.ChessPiece;window\.updateTrophySRC\(_ae\.type\);window\.head_color=_ae\.ChessColor;window\.shield_all\(\);\}else\{window\.just_ate='fruit';a\.Sh\+\+;\}\}else\{a\.Sh\+\+;\}/
    )
  ) {
    code = code.assertReplace(
      /if\(window\.isChessActive&&window\.isChessActive\(\)\)\{let _ae=window\.findApple\(window\.head_pos\[0\],window\.appleArray\);if\(_ae&&!_ae\.isPiece\)\{window\.just_ate='fruit';a\.Sh\+\+;\}else if\(_ae&&_ae\.isPiece\)\{window\.just_ate='piece';window\.head_state=_ae\.ChessPiece;window\.updateTrophySRC\(_ae\.type\);window\.head_color=_ae\.ChessColor;window\.shield_all\(\);\}else\{window\.just_ate='fruit';a\.Sh\+\+;\}\}else\{a\.Sh\+\+;\}/,
      `if(window.isChessActive&&window.isChessActive()){let _ae=window.findApple(window.head_pos[0],window.appleArray);if(_ae&&!_ae.isPiece){window.just_ate='fruit';a.Sh++;${onFreshEaten}}else if(_ae&&_ae.isPiece){window.just_ate='piece';window.head_state=_ae.ChessPiece;window.updateTrophySRC(_ae.type);window.head_color=_ae.ChessColor;window.shield_all();}else{window.just_ate='fruit';a.Sh++;${onFreshEaten}}}else{a.Sh++;${onFreshEaten}}`
    );
  } else if (code.match(/a\.Sh\+\+;/)) {
    code = code.assertReplace(
      /a\.Sh\+\+;/,
      `a.Sh++;${onFreshEaten}`
    );
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
  // Burger-only eats go through native Vm, not chess_fruit_respawn.
  // The call sits in a comma-group: `e=a.Vm(k,!e,null));` — the extra ) is
  // required; matching through `null);` would miss and leave reused slots
  // without a timer (snake-length roll happens in burger_after_respawn).
  if (code.match(/e=a\.Vm\(k,\s*!e,null\)\);/)) {
    code = code.assertReplace(
      /e=a\.Vm\(k,\s*!e,null\)\);/,
      `e=a.Vm(k,!e,null));${afterRespawn}`
    );
  } else {
    console.error("BurgerMod: failed to find native Vm respawn for after_respawn");
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
