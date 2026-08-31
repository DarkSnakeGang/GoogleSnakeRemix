window.CatMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.CatMod.runCodeBefore = function () {
  console.log("Adding Cat Mode (v13)");

  window.CAT_PEACEFUL_ALPHA = 0.75;
  window.CAT_LIFE_EVERY = 5;
  window.CAT_MAX_LIVES = 9;
  window.CAT_GRACE_EXTRA = 3;
  // Initial snake length — max score = board cells − this (fill the board).
  window.CAT_SNAKE_START_LEN = 3;

  // Same CSP-safe cat art as Cat Speed (#speed). Prefer live CatSpeed icon;
  // fall back if run order ever drifts.
  window.CAT_ICON = window.CAT_SPEED_ICON || window.CAT_ICON || "";
  if (!window.CAT_ICON && typeof window.CatSpeed === "object") {
    // CatSpeedInit may not have run yet — it will fill CAT_SPEED_ICON first.
  }

  window.uiImage =
    window.uiImage ||
    function (src) {
      let img = new Image();
      img.src = src;
      img.classList.add("DqMRee");
      img.classList.add("SsAred");
      return img;
    };

  function catEnsureTrophy() {
    if (window.CAT_MODE != null) return;
    window.CAT_ICON = window.CAT_SPEED_ICON || window.CAT_ICON || "";
    if (!window.CAT_ICON) return;
    const root = document.querySelector("#trophy");
    if (!root) return;
    root.appendChild(uiImage(window.CAT_ICON));
    window.CAT_MODE = root.children.length - 1;
  }
  catEnsureTrophy();

  let trophyEl = document.querySelector('img[src$="trophy_00.png"]');
  if (trophyEl) {
    let trophy_jsname = trophyEl.getAttribute("jsname");
    window.trophy_src =
      window.trophy_src ||
      `document.querySelector('img[jsname="${trophy_jsname}"]').src `;
  }

  window.cat_blending = false;
  window.cat_lives = 0;
  window.cat_peaceful_ticks = 0;
  window.__catLastSh = null;

  window.toggle_cat_blender = function () {
    window.cat_blending = !window.cat_blending;
    window.correct_cat_selection();
  };

  window.correct_cat_selection = function correct_cat_selection() {
    let el = document.getElementById("remix-cat-blend");
    if (!el) return;
    if (window.cat_blending) {
      el.setAttribute("class", "vuOknd lH9Ipd blender_icon blender_icon_on");
      el.innerHTML =
        `<img class="DEvgAc FMN3L blender_icon_img blender_icon_img_selected" src="` +
        window.CAT_ICON +
        `" alt="">`;
    } else {
      el.setAttribute("class", "vuOknd blender_icon");
      el.innerHTML =
        `<img class="DEvgAc blender_icon_img" src="` +
        window.CAT_ICON +
        `" alt="">`;
    }
  };

  window.add_cat_blender_toggle = function add_cat_blender_toggle() {
    if (document.getElementById("remix-cat-blend")) return;
    if (!window.populateRemixBlenderSlot) return;
    window.populateRemixBlenderSlot({
      id: "remix-cat-blend",
      slotIndex: 3,
      icon: window.CAT_ICON,
      ariaLabel: "Toggle Cat in Blender",
      onToggle: window.toggle_cat_blender,
    });
    window.correct_cat_selection();
  };

  window.catEnsureLivesHud = function catEnsureLivesHud() {
    if (document.getElementById("remix-cat-lives")) return;
    const hud = document.createElement("div");
    hud.id = "remix-cat-lives";
    hud.setAttribute("aria-label", "Cat lives");
    // Match Remix Mod / Remix Ultra indicator row (static absolute position,
    // same padding-top) — centered under the score/timer.
    hud.style.cssText =
      "position:absolute;left:50%;transform:translateX(-50%);" +
      "font-family:Arial,sans-serif;padding-top:4px;display:none;" +
      "gap:3px;align-items:center;justify-content:center;" +
      "z-index:5;pointer-events:none;user-select:none;";
    const parent = document.getElementsByClassName("EjCLSb")[0];
    const canvasNode = document.getElementsByClassName("jNB0Ic")[0];
    if (parent && canvasNode && canvasNode.parentElement === parent) {
      parent.insertBefore(hud, canvasNode);
    } else if (parent) {
      parent.appendChild(hud);
    } else {
      document.body.appendChild(hud);
    }
  };

  window.catUpdateLivesHud = function catUpdateLivesHud() {
    window.catEnsureLivesHud();
    const hud = document.getElementById("remix-cat-lives");
    if (!hud) return;
    const active = window.isCatActive && window.isCatActive();
    if (!active) {
      hud.style.display = "none";
      return;
    }
    hud.style.display = "flex";
    const lives = window.cat_lives | 0;
    const max = window.CAT_MAX_LIVES | 9;
    let html = "";
    const icon = window.CAT_ICON || "";
    for (let i = 0; i < max; i++) {
      const on = i < lives;
      html +=
        `<img src="` +
        icon +
        `" alt="" style="width:14px;height:14px;object-fit:contain;opacity:` +
        (on ? "1" : "0.22") +
        `;filter:` +
        (on ? "none" : "grayscale(1)") +
        `;">`;
    }
    if (window.cat_peaceful_ticks > 0) {
      html +=
        `<span style="margin-left:6px;font:11px/1 Arial,sans-serif;color:#cfe8ff;opacity:0.9;">` +
        (window.cat_peaceful_ticks | 0) +
        `</span>`;
    }
    hud.innerHTML = html;
  };

  window.add_cat_blender_toggle();
  window.catEnsureLivesHud();
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.CatMod.alterSnakeCode = function (code) {
  console.log("Coding Cat Mode into the game (v13)");

  // Never abort the whole Ultra/Remix alter chain on a missed optional patch.
  function catReplace(label, re, replacement) {
    if (!code.match(re)) {
      console.error("CatMod: failed to find " + label);
      return false;
    }
    try {
      code = code.assertReplace(re, replacement);
      return true;
    } catch (e) {
      console.error("CatMod: replace failed for " + label, e);
      return false;
    }
  }

  window.isCatActive = function isCatActive() {
    if (window.CAT_MODE == null) return false;
    if (window.CurrentModeNum === window.CAT_MODE) return true;
    if (window.CurrentModeNum === 22 && window.cat_blending) return true;
    const g = window.__remixGame;
    const mode =
      g && g.settings
        ? g.settings.ub != null
          ? g.settings.ub
          : g.settings.ob
        : null;
    if (mode === window.CAT_MODE) return true;
    if (mode === 22 && window.cat_blending) return true;
    return false;
  };

  window.updateCatTrophySRC = function updateCatTrophySRC() {
    if (window.trophy_src && window.CAT_ICON) {
      eval(window.trophy_src + `= window.CAT_ICON`);
    }
  };

  window.cat_reset_state = function cat_reset_state() {
    window.cat_lives = 0;
    window.cat_peaceful_ticks = 0;
    window.__catLastSh = null;
    window.catUpdateLivesHud && window.catUpdateLivesHud();
  };

  window.cat_on_apple_eaten = function cat_on_apple_eaten(game) {
    if (!window.isCatActive || !window.isCatActive()) return;
    const sh = (game && game.Sh) | 0;
    const every = window.CAT_LIFE_EVERY | 5;
    const max = window.CAT_MAX_LIVES | 9;
    // +1 life every 5 apples (not floor(Sh/5) — spending must stick).
    if (sh > 0 && sh % every === 0) {
      window.cat_lives = Math.min(max, (window.cat_lives | 0) + 1);
    }
    window.catUpdateLivesHud && window.catUpdateLivesHud();
    window.cat_enforce_fruit_cap(game);
    window.cat_check_score_win(game);
  };

  // Spend a life instead of dying. Returns true if death should be cancelled.
  // Oa() runs after the fatal cell is already applied, so border hits land
  // off-board (e.g. x=-1) before e7(21) can wrap. Re-apply Peaceful wrap
  // immediately so the same tick teleports like native Peaceful.
  window.cat_board_size = function cat_board_size(game) {
    const g = game || window.__remixGame;
    // Prefer playable board box (works for custom sizes too).
    if (g && g.ka && g.ka.oa && g.ka.oa.width && g.ka.oa.height) {
      return {
        width: g.ka.oa.width | 0,
        height: g.ka.oa.height | 0,
      };
    }
    if (g && g.Ca && Array.isArray(g.Ca.wa) && g.Ca.wa.length) {
      return {
        width: g.Ca.wa[0] ? g.Ca.wa[0].length : 0,
        height: g.Ca.wa.length,
      };
    }
    if (typeof window.chess_board_size === "function" && g) {
      const board = g.ka || g.wa || g;
      return window.chess_board_size(board) || { width: 0, height: 0 };
    }
    return { width: 0, height: 0 };
  };

  /** Max score to fill the board: width × height − starting snake length. */
  window.cat_max_score = function cat_max_score(game) {
    const sz = window.cat_board_size(game);
    const w = sz.width | 0;
    const h = sz.height | 0;
    if (!w || !h) return 0;
    return w * h - (window.CAT_SNAKE_START_LEN | 3);
  };

  /** Portal / Chess / Mexico: two apples = one score unit. */
  window.cat_pair_scoring = function cat_pair_scoring(game) {
    const g = game || window.__remixGame;
    if (!g) return false;
    try {
      if (typeof e7 === "function" && g.settings && e7(g.settings, 2)) return true;
    } catch (_e) {}
    if (window.isChessActive && window.isChessActive()) return true;
    if (window.isMexicoActive && window.isMexicoActive()) return true;
    return false;
  };

  window.cat_score_units_for_apples = function cat_score_units_for_apples(
    appleCount,
    paired
  ) {
    const n = Math.max(0, appleCount | 0);
    return paired ? n >> 1 : n;
  };

  window.cat_score_room = function cat_score_room(game) {
    const g = game || window.__remixGame;
    if (!g) return 0;
    const cap = window.cat_max_score(g) | 0;
    if (!cap) return 0;
    const score = (g.Sh != null ? g.Sh : g.Oh) | 0;
    return Math.max(0, cap - score);
  };

  /** Max apples allowed on the board for the remaining score room. */
  window.cat_max_apples_on_board = function cat_max_apples_on_board(game) {
    const g = game || window.__remixGame;
    const room = window.cat_score_room(g);
    return window.cat_pair_scoring(g) ? room * 2 : room;
  };

  /**
   * How many NEW apples may spawn. `aboutToRemove` is apples this eat will
   * clear (1 classic, 2 portal/chess-pair) still present in the array.
   */
  window.cat_spawn_budget_apples = function cat_spawn_budget_apples(
    game,
    aboutToRemove
  ) {
    if (!window.isCatActive || !window.isCatActive()) return 1e9;
    const g = game || window.__remixGame;
    if (!g) return 0;
    const max = window.cat_max_apples_on_board(g);
    const cur = (g.wa && g.wa.ka && g.wa.ka.length) | 0;
    const rem = aboutToRemove == null ? 1 : aboutToRemove | 0;
    const after = Math.max(0, cur - rem);
    return Math.max(0, max - after);
  };

  window.cat_allows_fruit_spawn = function cat_allows_fruit_spawn(
    game,
    wantApples,
    aboutToRemove
  ) {
    if (!window.isCatActive || !window.isCatActive()) return true;
    return (
      window.cat_spawn_budget_apples(game, aboutToRemove) >= (wantApples | 0)
    );
  };

  window.cat_allows_pair_spawn = function cat_allows_pair_spawn(game) {
    return window.cat_allows_fruit_spawn(game, 2, 2);
  };

  /** Drop excess fruit so eating can't push score past the board-fill cap. */
  window.cat_enforce_fruit_cap = function cat_enforce_fruit_cap(game) {
    if (!window.isCatActive || !window.isCatActive()) return 0;
    const g = game || window.__remixGame;
    if (!g || !g.wa || !Array.isArray(g.wa.ka)) return 0;
    const paired = window.cat_pair_scoring(g);
    let max = window.cat_max_apples_on_board(g);
    if (paired) max -= max % 2;
    let removed = 0;
    while (g.wa.ka.length > max) {
      if (paired && g.wa.ka.length >= 2) {
        g.wa.ka.pop();
        g.wa.ka.pop();
        removed += 2;
      } else {
        g.wa.ka.pop();
        removed++;
      }
    }
    window.appleArray = g.wa.ka;
    return removed;
  };

  window.cat_trigger_win = function cat_trigger_win(game) {
    if (!game) return;
    if (game.nj || game.lj) return;
    // Slot Machine: same board-fill win, but use Slot's native-style path
    // (gotAll + ub/nj + end menu). Plain nj+lj never opens the win screen.
    if (
      window.isSlotMachineActive &&
      window.isSlotMachineActive() &&
      typeof window.slot_trigger_win === "function"
    ) {
      window.slot_trigger_win(game);
      return;
    }
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
      else if (typeof window.__slotShowEndMenu === "function")
        window.__slotShowEndMenu(game.menu, 1400, score);
    } catch (_e2) {}
  };

  /** Hard cap: reaching board-fill score wins the run. */
  window.cat_check_score_win = function cat_check_score_win(game) {
    if (!window.isCatActive || !window.isCatActive()) return false;
    const g = game || window.__remixGame;
    if (!g || g.nj || g.lj) return false;
    const cap = window.cat_max_score(g);
    if (!cap) return false;
    let score = (g.Sh != null ? g.Sh : g.Oh) | 0;
    if (score > cap) {
      if (g.Sh != null) g.Sh = cap;
      if (g.Oh != null) g.Oh = cap;
      score = cap;
    }
    if (score < cap) return false;
    window.cat_enforce_fruit_cap(g);
    window.cat_trigger_win(g);
    return true;
  };

  /** Wrap Chess/Dice spawn helpers so pair/mass fills respect the score room. */
  window.cat_install_spawn_caps = function cat_install_spawn_caps() {
    if (window.__catSpawnCapsInstalled) return;
    window.__catSpawnCapsInstalled = true;

    if (typeof window.chess_fruit_respawn === "function") {
      const origFruit = window.chess_fruit_respawn;
      window.chess_fruit_respawn = function (mgr, makeApple, freePos, pickType) {
        const g = window.__remixGame;
        if (
          window.isCatActive &&
          window.isCatActive() &&
          !window.cat_allows_fruit_spawn(g, 2, 1)
        ) {
          return 0;
        }
        return origFruit(mgr, makeApple, freePos, pickType);
      };
    }

    if (typeof window.chess_spawn_n_pairs === "function") {
      const origPairs = window.chess_spawn_n_pairs;
      window.chess_spawn_n_pairs = function (
        mgr,
        makeApple,
        freePos,
        pickType,
        pairCount,
        assignSeq
      ) {
        let n = Math.max(0, pairCount | 0);
        if (window.isCatActive && window.isCatActive()) {
          const budget = window.cat_spawn_budget_apples(window.__remixGame, 0);
          n = Math.min(n, budget >> 1);
        }
        if (n <= 0) return 0;
        return origPairs(mgr, makeApple, freePos, pickType, n, assignSeq);
      };
    }
  };
  window.cat_install_spawn_caps();

  window.cat_wrap_head_if_needed = function cat_wrap_head_if_needed(game) {
    const g = game || window.__remixGame;
    if (!g || !g.oa || !Array.isArray(g.oa.ka) || !g.oa.ka.length) return false;
    const head = g.oa.ka[0];
    if (!head || head.x == null || head.y == null) return false;
    const sz = window.cat_board_size(g);
    const w = sz.width | 0;
    const h = sz.height | 0;
    if (!w || !h) return false;
    let x = head.x | 0;
    let y = head.y | 0;
    let wrapped = false;
    if (x < 0 || x >= w) {
      x = ((x % w) + w) % w;
      wrapped = true;
    }
    if (y < 0 || y >= h) {
      y = ((y % h) + h) % h;
      wrapped = true;
    }
    if (!wrapped) return false;
    head.x = x;
    head.y = y;
    return true;
  };

  window.cat_try_spend_life = function cat_try_spend_life(game) {
    if (!window.isCatActive || !window.isCatActive()) return false;
    if ((window.cat_peaceful_ticks | 0) > 0) {
      window.cat_wrap_head_if_needed(game);
      return true;
    }
    if ((window.cat_lives | 0) <= 0) return false;
    window.cat_lives = (window.cat_lives | 0) - 1;
    const sh = (game && game.Sh) | 0;
    // Half of (score + extra), rounded up.
    const grace = Math.ceil((sh + (window.CAT_GRACE_EXTRA | 3)) / 2);
    window.cat_peaceful_ticks = Math.max(window.cat_peaceful_ticks | 0, grace);
    window.cat_wrap_head_if_needed(game);
    window.catUpdateLivesHud && window.catUpdateLivesHud();
    return true;
  };

  window.cat_tick_logic = function cat_tick_logic(game) {
    if (!window.isCatActive || !window.isCatActive()) {
      window.catUpdateLivesHud && window.catUpdateLivesHud();
      return;
    }
    const g = game || window.__remixGame;
    if (!g) return;
    if (window.__catLastSh != null && g.Sh > window.__catLastSh) {
      window.cat_on_apple_eaten(g);
    }
    window.__catLastSh = g.Sh;
    if ((window.cat_peaceful_ticks | 0) > 0) {
      window.cat_peaceful_ticks = (window.cat_peaceful_ticks | 0) - 1;
    }
    // Late-bind Dice spawn clamp (DiceCounts runs after Cat in the bundle).
    if (
      typeof window.remixDiceSpawnCount === "function" &&
      !window.remixDiceSpawnCount.__catWrapped
    ) {
      const origDice = window.remixDiceSpawnCount;
      window.remixDiceSpawnCount = function (ka, fallback) {
        let n = origDice(ka, fallback) | 0;
        if (window.isCatActive && window.isCatActive()) {
          const budget = window.cat_spawn_budget_apples(window.__remixGame, 0);
          n = Math.min(n, budget);
          if (window.cat_pair_scoring(window.__remixGame)) n -= n % 2;
        }
        return n;
      };
      window.remixDiceSpawnCount.__catWrapped = true;
    }
    window.cat_enforce_fruit_cap(g);
    window.cat_check_score_win(g);
    window.catUpdateLivesHud && window.catUpdateLivesHud();
  };

  // --- Border wrap on life-spend (same tick as Peaceful) ---
  // Sc(a) checks m7 then Oa; the off-board cell `a` is applied after Oa returns,
  // so cancelling death alone leaves the head at x=-1 until the next tick.
  // When Cat can absorb the hit, wrap `a` via native i7 before the m7/Oa check.
  catReplace(
    "Sc border wrap on life",
    /Sc\(a\)\{m7\(this\.ka,a\)\|\|this\.Oa\(\);/,
    `Sc(a){if(window.isCatActive&&window.isCatActive()&&!m7(this.ka,a)&&((window.cat_peaceful_ticks|0)>0||(window.cat_lives|0)>0)){if((window.cat_peaceful_ticks|0)<=0){window.cat_try_spend_life(this);}i7(this.ka,a);}m7(this.ka,a)||this.Oa();`
  );

  // --- e7: temporary Peaceful (mode 21) while grace ticks remain ---
  catReplace(
    "e7 temporary Peaceful",
    /if\(!r&&b===10&&window\.BURGER_MODE!=null\)\{if\(a\.ub===window\.BURGER_MODE\)return!0;if\(a\.ub===22&&a\.rSa&&a\.rSa\.has\(window\.BURGER_MODE\)\)return!0;\}return r\}/,
    `if(!r&&b===10&&window.BURGER_MODE!=null){if(a.ub===window.BURGER_MODE)return!0;if(a.ub===22&&a.rSa&&a.rSa.has(window.BURGER_MODE))return!0;}if(!r&&b===21&&window.isCatActive&&window.isCatActive()&&(window.cat_peaceful_ticks|0)>0)return!0;return r}`
  );

  // --- Death intercept: Oa() is the real kill path (wall/self/poison crash) ---
  catReplace(
    "Oa() death entry",
    /Oa\(\)\{if\(!this\.nj\)\{/,
    `Oa(){if(window.isCatActive&&window.isCatActive()&&window.cat_try_spend_life(this))return;if(!this.nj){`
  );

  // Minesweeper A6E kills via Ub+Dc — never calls Oa(). Treat Cat life/grace
  // like Peaceful so the mine arms instead of ending the run.
  catReplace(
    "A6E mine death respects cat life",
    /g!==0&&\(c\|\|!f\|\|g!==1\|\|e7\(a\.settings,21\)\?b\.X1a===-1&&\(b\.X1a=3\):\(h=!0,s5E\.Ktc\.play\(\),d\(\),y6E\(a\.Ca\),a\.Ca\.Ka=0,e\(\)\)\)/,
    "g!==0&&(c||!f||g!==1||e7(a.settings,21)||window.isCatActive&&window.isCatActive()&&window.cat_try_spend_life(window.__remixGame||a.wb)?b.X1a===-1&&(b.X1a=3):(h=!0,s5E.Ktc.play(),d(),y6E(a.Ca),a.Ca.Ka=0,e()))"
  );

  // --- Tick: cat logic (always run so HUD hides when Cat is off) ---
  if (
    !catReplace(
      "tick with __remixGame",
      /\}tick\(\)\{window\.__remixGame=this;/,
      `}tick(){window.__remixGame=this;try{window.cat_tick_logic(this);}catch(_cat){console.error("CatMod: tick failed",_cat);}`
    )
  ) {
    // Last-resort: only patch the main game tick that already has chess/burger hooks.
    catReplace(
      "tick fallback",
      /\}tick\(\)\{window\.__remixGame=this;if\(window\.is/,
      `}tick(){window.__remixGame=this;try{window.cat_tick_logic(this);}catch(_cat){}if(window.is`
    );
  }

  // Cap classic Vm respawn: no new fruit once score room is exhausted / within reach.
  // Mexico replaces the chess/portal prefix but leaves this Vm suffix intact.
  catReplace(
    "Vm score-cap gate",
    /e=a\.settings\.ka!==6&&\(d7\(a\.settings\)\|\|e7\(a\.settings,7\)\),e=a\.Vm\(k,!e,null\)\);/,
    `e=a.settings.ka!==6&&(d7(a.settings)||e7(a.settings,7)),e=window.isCatActive&&window.isCatActive()&&window.cat_allows_fruit_spawn&&!window.cat_allows_fruit_spawn(a,1,1)?!1:a.Vm(k,!e,null));`
  );

  // --- Reset state (burger shield-init + tally paths) ---
  // Prefer the console.error form; also cover the quieter tally inject.
  if (
    !catReplace(
      "burger reset hook",
      /if\(window\.isBurgerActive&&window\.isBurgerActive\(\)\)\{try\{window\.burger_fruits_eaten=0;window\.burger_assign_timers_all\(this\.ka\);\}catch\(_be\)\{console\.error\("BurgerMod: reset failed",_be\);\}\}/,
      `if(window.isBurgerActive&&window.isBurgerActive()){try{window.burger_fruits_eaten=0;window.burger_assign_timers_all(this.ka);}catch(_be){console.error("BurgerMod: reset failed",_be);}}if(window.isCatActive&&window.isCatActive()){try{window.cat_reset_state();}catch(_cat){}}`
    )
  ) {
    catReplace(
      "burger reset hook quiet",
      /if\(window\.isBurgerActive&&window\.isBurgerActive\(\)\)\{try\{window\.burger_fruits_eaten=0;window\.burger_assign_timers_all\(this\.ka\);\}catch\(_be\)\{\}\}/,
      `if(window.isBurgerActive&&window.isBurgerActive()){try{window.burger_fruits_eaten=0;window.burger_assign_timers_all(this.ka);}catch(_be){}}if(window.isCatActive&&window.isCatActive()){try{window.cat_reset_state();}catch(_cat){}}`
    );
  }

  // Play-start: refresh HUD whenever mode changes (hide if not Cat).
  if (code.indexOf("updateCatTrophySRC()") < 0) {
    if (
      !catReplace(
        "play-start after Burger trophy",
        /if\(window\.CurrentModeNum===window\.BURGER_MODE\)\{window\.updateBurgerTrophySRC\(\);\}/,
        `if(window.CurrentModeNum===window.BURGER_MODE){window.updateBurgerTrophySRC();}if(window.CurrentModeNum===window.CAT_MODE){window.updateCatTrophySRC();window.cat_reset_state();}else{window.catUpdateLivesHud&&window.catUpdateLivesHud();}`
      )
    ) {
      catReplace(
        "play-start after Candy trophy",
        /if\(window\.CurrentModeNum===window\.CANDY_MODE\)\{window\.updateCandyTrophySRC\(\);\}/,
        `if(window.CurrentModeNum===window.CANDY_MODE){window.updateCandyTrophySRC();}if(window.CurrentModeNum===window.CAT_MODE){window.updateCatTrophySRC();window.cat_reset_state();}else{window.catUpdateLivesHud&&window.catUpdateLivesHud();}`
      );
    }
  } else if (code.indexOf("catUpdateLivesHud&&window.catUpdateLivesHud()") < 0) {
    catReplace(
      "play-start cat hud refresh",
      /if\(window\.CurrentModeNum===window\.CAT_MODE\)\{window\.updateCatTrophySRC\(\);window\.cat_reset_state\(\);\}/,
      `if(window.CurrentModeNum===window.CAT_MODE){window.updateCatTrophySRC();window.cat_reset_state();}else{window.catUpdateLivesHud&&window.catUpdateLivesHud();}`
    );
  }

  // Tally reset: Burger may have already injected, or the raw ka===6 line remains.
  // Match quietly — missing Burger inject is expected when its patch drifts.
  {
    const tallyBurger =
      /this\.settings\.ka===6&&\(\$3E\(this\),this\.Ca=!1\);if\(window\.isBurgerActive&&window\.isBurgerActive\(\)\)\{try\{window\.burger_fruits_eaten=0;window\.burger_assign_timers_all\(this\.ka\);\}catch\(_be\)\{\}\}/;
    const tallyRaw = /this\.settings\.ka===6&&\(\$3E\(this\),this\.Ca=!1\)\}/;
    if (code.match(tallyBurger)) {
      catReplace(
        "tally reset after burger",
        tallyBurger,
        `this.settings.ka===6&&($3E(this),this.Ca=!1);if(window.isBurgerActive&&window.isBurgerActive()){try{window.burger_fruits_eaten=0;window.burger_assign_timers_all(this.ka);}catch(_be){}}if(window.isCatActive&&window.isCatActive()){try{window.cat_reset_state();}catch(_cat){}}`
      );
    } else if (code.match(tallyRaw)) {
      catReplace(
        "tally reset raw",
        tallyRaw,
        `this.settings.ka===6&&($3E(this),this.Ca=!1);if(window.isCatActive&&window.isCatActive()){try{window.cat_reset_state();}catch(_cat){}}}`
      );
    }
  }

  // --- Snake transparency during grace ---
  if (
    catReplace(
      "snake render alpha",
      /render\(a,b,c\)\{var d=a,e=Math\.pow\(d,\.2\);this\.wb\.nj&&/,
      `render(a,b,c){var _catGa=this.ka.globalAlpha;if(window.isCatActive&&window.isCatActive()&&(window.cat_peaceful_ticks|0)>0)this.ka.globalAlpha=_catGa*(window.CAT_PEACEFUL_ALPHA||.75);var d=a,e=Math.pow(d,.2);this.wb.nj&&`
    )
  ) {
    catReplace(
      "snake render alpha restore",
      /J5E\(this,f,d,!1,!1\)\}/,
      `J5E(this,f,d,!1,!1);this.ka.globalAlpha=_catGa;}`
    );
  }

  // --- Deathscreen / blender icons (each optional; never use indexOf of icon URL hashes) ---
  if (code.indexOf("window.CAT_MODE)?window.CAT_ICON") < 0) {
    catReplace(
      "deathscreen Zb cat icon",
      /\(a\.settings\.ob===window\.BURGER_MODE\)\?window\.BURGER_ICON:/,
      `(a.settings.ob===window.BURGER_MODE)?window.BURGER_ICON:(a.settings.ob===window.CAT_MODE)?window.CAT_ICON:`
    );
    catReplace(
      "blender b3E cat icon",
      /\(c===window\.BURGER_MODE\)\?window\.BURGER_ICON:/,
      `(c===window.BURGER_MODE)?window.BURGER_ICON:(c===window.CAT_MODE)?window.CAT_ICON:`
    );
  }

  catReplace(
    "blender mode push",
    /if\(window\.burger_blending&&window\.BURGER_MODE!=null\)b\.push\(window\.BURGER_MODE\)/,
    `if(window.burger_blending&&window.BURGER_MODE!=null)b.push(window.BURGER_MODE);if(window.cat_blending&&window.CAT_MODE!=null)b.push(window.CAT_MODE)`
  );

  // Match the Ta blender line specifically — do NOT key off "13m2Cr16" alone
  // (that hash also appears inside Burger fruit URLs, so Burger often skips its
  // Ta inject). Fall back to Candy/Chess Ta like Mexico does.
  if (code.indexOf('el.id==="remix-cat-blend"') < 0) {
    const taBurger =
      /else if\(window\.BURGER_MODE!=null&&s\.indexOf\("13m2Cr16"\)>=0\)m=window\.BURGER_MODE;/;
    const taChess =
      /else if\(window\.CHESS_MODE!=null&&s\.indexOf\("ZqK0CB95"\)>=0\)m=window\.CHESS_MODE;/;
    if (code.match(taBurger)) {
      catReplace(
        "Ta blender cat after burger",
        taBurger,
        `else if(window.BURGER_MODE!=null&&s.indexOf("13m2Cr16")>=0)m=window.BURGER_MODE;else if(window.CAT_MODE!=null&&el.id==="remix-cat-blend")m=window.CAT_MODE;`
      );
    } else if (code.match(taChess)) {
      catReplace(
        "Ta blender cat after chess",
        taChess,
        `else if(window.CHESS_MODE!=null&&s.indexOf("ZqK0CB95")>=0)m=window.CHESS_MODE;else if(window.BURGER_MODE!=null&&el.id==="remix-burger-blend")m=window.BURGER_MODE;else if(window.CAT_MODE!=null&&el.id==="remix-cat-blend")m=window.CAT_MODE;`
      );
    } else {
      console.error("CatMod: failed to find Ta blender cat slot");
    }
  }

  return code;
};

////////////////////////////////////////////////////////////////////
//RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.CatMod.runCodeAfter = function () {
  if (!window.CAT_ICON && window.CAT_SPEED_ICON) {
    window.CAT_ICON = window.CAT_SPEED_ICON;
  }
  if (window.CAT_MODE == null && window.CAT_ICON) {
    const root = document.querySelector("#trophy");
    if (root) {
      root.appendChild(uiImage(window.CAT_ICON));
      window.CAT_MODE = root.children.length - 1;
    }
  }
  window.add_cat_blender_toggle && window.add_cat_blender_toggle();
  window.catEnsureLivesHud && window.catEnsureLivesHud();
};
