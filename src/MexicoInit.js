window.MexicoMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.MexicoMod.runCodeBefore = function () {
  console.log("Adding Mexico Mode (v13)");

  window.MEXICO_ICON = "data:image/png;base64,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";

  window.uiImage =
    window.uiImage ||
    function (src) {
      let img = new Image();
      img.src = src;
      img.classList.add("DqMRee");
      img.classList.add("SsAred");
      return img;
    };

  function mexicoEnsureTrophy() {
    if (window.MEXICO_MODE != null) return;
    if (!window.MEXICO_ICON) return;
    const root = document.querySelector("#trophy");
    if (!root) return;
    root.appendChild(uiImage(window.MEXICO_ICON));
    window.MEXICO_MODE = root.children.length - 1;
  }
  mexicoEnsureTrophy();

  let trophyEl = document.querySelector('img[src$="trophy_00.png"]');
  if (trophyEl) {
    let trophy_jsname = trophyEl.getAttribute("jsname");
    window.trophy_src =
      window.trophy_src ||
      `document.querySelector('img[jsname="${trophy_jsname}"]').src `;
  }

  window.mexico_blending = false;
  window.__mexicoWallDone = false;
  window.__mexicoLastSh = null;

  window.toggle_mexico_blender = function () {
    window.mexico_blending = !window.mexico_blending;
    window.correct_mexico_selection();
  };

  window.correct_mexico_selection = function correct_mexico_selection() {
    let el = document.getElementById("remix-mexico-blend");
    if (!el) return;
    if (window.mexico_blending) {
      el.setAttribute("class", "vuOknd lH9Ipd blender_icon blender_icon_on");
      el.innerHTML =
        `<img class="DEvgAc FMN3L blender_icon_img blender_icon_img_selected" src="` +
        window.MEXICO_ICON +
        `" alt="">`;
    } else {
      el.setAttribute("class", "vuOknd blender_icon");
      el.innerHTML =
        `<img class="DEvgAc blender_icon_img" src="` +
        window.MEXICO_ICON +
        `" alt="">`;
    }
  };

  window.add_mexico_blender_toggle = function add_mexico_blender_toggle() {
    if (document.getElementById("remix-mexico-blend")) return;
    if (!window.populateRemixBlenderSlot) return;
    window.populateRemixBlenderSlot({
      id: "remix-mexico-blend",
      slotIndex: 4,
      icon: window.MEXICO_ICON,
      ariaLabel: "Toggle Mexico in Blender",
      onToggle: window.toggle_mexico_blender,
    });
    window.correct_mexico_selection();
  };

  window.add_mexico_blender_toggle();
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.MexicoMod.alterSnakeCode = function (code) {
  console.log("Coding Mexico Mode into the game (v13)");
  // Soft-fail debug stash for harness probes (no behavior change).
  if (window.RemixDebug) window.__remixPreMexicoCode = code;

  function mexicoReplace(label, re, replacement) {
    if (!code.match(re)) {
      console.error("MexicoMod: failed to find " + label);
      return false;
    }
    try {
      code = code.assertReplace(re, replacement);
      return true;
    } catch (e) {
      console.error("MexicoMod: replace failed for " + label, e);
      return false;
    }
  }

  window.isMexicoActive = function isMexicoActive() {
    if (window.MEXICO_MODE == null) return false;
    if (window.CurrentModeNum === window.MEXICO_MODE) return true;
    if (window.CurrentModeNum === 22 && window.mexico_blending) return true;
    const g = window.__remixGame;
    const mode =
      g && g.settings
        ? g.settings.ub != null
          ? g.settings.ub
          : g.settings.ob
        : null;
    if (mode === window.MEXICO_MODE) return true;
    if (mode === 22 && window.mexico_blending) return true;
    return false;
  };

  window.updateMexicoTrophySRC = function updateMexicoTrophySRC() {
    if (window.trophy_src && window.MEXICO_ICON) {
      eval(window.trophy_src + `= window.MEXICO_ICON`);
    }
  };

  window.mexico_reset_state = function mexico_reset_state() {
    window.__mexicoWallDone = false;
    window.__mexicoLastSh = null;
  };

  window.mexico_trigger_win = function mexico_trigger_win(game) {
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

  // Win only when the board has no fruit left — a failed half-spawn alone is
  // not a win (drop the incomplete pair and keep any remaining fruit).
  window.mexico_win_if_empty = function mexico_win_if_empty(game, mgr) {
    const list = mgr && mgr.ka;
    if (list && list.length > 0) return false;
    window.mexico_trigger_win(game || window.__remixGame);
    return true;
  };

  window.mexico_drop_pair_at = function mexico_drop_pair_at(mgr, pairBase) {
    if (!mgr || !mgr.ka || pairBase < 0) return 0;
    if (pairBase >= mgr.ka.length) return 0;
    const n = Math.min(2, mgr.ka.length - pairBase);
    mgr.ka.splice(pairBase, n);
    window.appleArray = mgr.ka;
    return n;
  };

  window.mexico_mid_y = function mexico_mid_y(boardOrGame) {
    let h = 0;
    if (boardOrGame && Array.isArray(boardOrGame) && boardOrGame.length) {
      h = boardOrGame.length;
    } else if (
      boardOrGame &&
      boardOrGame.wa &&
      Array.isArray(boardOrGame.wa) &&
      boardOrGame.wa.length
    ) {
      h = boardOrGame.wa.length;
    } else if (typeof window.chess_board_size === "function" && boardOrGame) {
      const sz = window.chess_board_size(boardOrGame);
      if (sz && sz.height) h = sz.height;
    }
    if (!h) {
      const g = window.__remixGame;
      if (g && g.Ca && Array.isArray(g.Ca.wa) && g.Ca.wa.length) {
        h = g.Ca.wa.length;
      }
    }
    return Math.floor((h | 0) / 2);
  };

  window.mexico_serial_coord = function mexico_serial_coord(pos) {
    if (!pos) return 0;
    return (pos.x << 16) | pos.y;
  };

  window.mexico_make_pos = function mexico_make_pos(x, y) {
    if (typeof window.chess_make_pos === "function") {
      return window.chess_make_pos(x, y);
    }
    return { x: x, y: y };
  };

  // True if pos sits on a wall cell (incl. Mexico mid-row walls).
  window.mexico_pos_on_wall = function mexico_pos_on_wall(game, pos) {
    if (!pos || pos.x == null || pos.y == null) return false;
    const walls = game && game.Ca;
    if (!walls || !Array.isArray(walls.wa) || !walls.wa[pos.y]) return false;
    return (walls.wa[pos.y][pos.x] | 0) > 0;
  };

  // One-shot middle row — never enables Wall Mode spawn (e7 bit 1).
  window.mexico_place_mid_walls = function mexico_place_mid_walls(game) {
    if (!game || window.__mexicoWallDone) return;
    const walls = game.Ca;
    if (!walls || !walls.Aa || !Array.isArray(walls.wa) || !walls.wa.length) {
      console.error("MexicoMod: wall manager missing");
      return;
    }
    const h = walls.wa.length;
    const w = walls.wa[0] ? walls.wa[0].length : 0;
    if (!w) return;
    const mid = Math.floor(h / 2);
    for (let x = 0; x < w; x++) {
      if (walls.wa[mid] && walls.wa[mid][x] > 0) continue;
      const pos = window.mexico_make_pos(x, mid);
      const obj = { pos: pos, wm: false, m0: false, Lh: true };
      try {
        walls.Aa.set(window.mexico_serial_coord(pos), obj);
        if (walls.wa[mid]) walls.wa[mid][x]++;
      } catch (_e) {}
    }
    window.__mexicoWallDone = true;
  };

  window.mexico_find_spawn = function mexico_find_spawn(
    board,
    freePos,
    occupiedKeys,
    half
  ) {
    const game = window.__remixGame;
    const mid = window.mexico_mid_y(board || (game && game.Ca));
    const ok = function (p) {
      if (!p || p.y == null) return false;
      if (p.y === mid) return false;
      if (half === "top" && !(p.y < mid)) return false;
      if (half === "bottom" && !(p.y > mid)) return false;
      if (typeof window.chess_is_legal_spawn === "function") {
        if (!window.chess_is_legal_spawn(board, p, occupiedKeys)) return false;
      } else if (occupiedKeys) {
        const k =
          typeof window.chess_pos_key === "function"
            ? window.chess_pos_key(p)
            : p.x + "," + p.y;
        if (occupiedKeys.has(k)) return false;
      }
      if (window.mexico_pos_on_wall(game, p)) return false;
      if (
        typeof window.chess_outside_spawn_radius === "function" &&
        !window.chess_outside_spawn_radius(game, p)
      ) {
        return false;
      }
      return true;
    };
    if (typeof freePos === "function" && board) {
      for (let attempt = 0; attempt < 24; attempt++) {
        const p = freePos(board, null, 2);
        if (ok(p)) return p;
      }
    }
    const nativeFree =
      game && typeof game.Rb === "function"
        ? game.Rb.bind(game)
        : game && typeof game.Tb === "function"
          ? game.Tb.bind(game)
          : null;
    if (nativeFree) {
      for (let attempt = 0; attempt < 16; attempt++) {
        const p = nativeFree(null, 2);
        if (ok(p)) return p;
      }
    }
    let width = 0;
    let height = 0;
    if (typeof window.chess_board_size === "function" && board) {
      const sz = window.chess_board_size(board);
      if (sz) {
        width = sz.width | 0;
        height = sz.height | 0;
      }
    }
    if ((!width || !height) && game && game.Ca && game.Ca.wa) {
      height = game.Ca.wa.length;
      width = game.Ca.wa[0] ? game.Ca.wa[0].length : 0;
    }
    if (!width || !height) return null;
    const y0 = half === "top" ? 0 : mid + 1;
    const y1 = half === "top" ? mid : height;
    const cells = [];
    for (let y = y0; y < y1; y++) {
      for (let x = 0; x < width; x++) cells.push([x, y]);
    }
    for (let i = cells.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = cells[i];
      cells[i] = cells[j];
      cells[j] = t;
    }
    for (let n = 0; n < cells.length; n++) {
      const pos = window.mexico_make_pos(cells[n][0], cells[n][1]);
      if (ok(pos)) return pos;
    }
    return null;
  };

  window.mexico_fruit_respawn = function mexico_fruit_respawn(
    mgr,
    makeApple,
    freePos,
    pickType
  ) {
    if (!mgr || !mgr.ka) return 0;
    if (typeof makeApple !== "function") return 0;
    const game = window.__remixGame;
    if (game && (game.Sh | 0) >= 1 && !window.__mexicoWallDone) {
      window.mexico_place_mid_walls(game);
    }
    const board = mgr.oa;
    window.appleArray = mgr.ka;
    const occ =
      typeof window.chess_occupied_keys === "function"
        ? window.chess_occupied_keys(game, mgr.ka, new Set())
        : new Set();

    const posTop = window.mexico_find_spawn(board, freePos, occ, "top");
    if (!posTop) {
      window.mexico_win_if_empty(game, mgr);
      return 0;
    }
    const keyTop =
      typeof window.chess_pos_key === "function"
        ? window.chess_pos_key(posTop)
        : posTop.x + "," + posTop.y;
    occ.add(keyTop);
    const posBot = window.mexico_find_spawn(board, freePos, occ, "bottom");
    if (!posBot) {
      // Pair incomplete — do not leave a lone top apple; win only if empty.
      window.mexico_win_if_empty(game, mgr);
      return 0;
    }

    const mk = function (pos) {
      let dup = makeApple(mgr, 0, 0);
      if (typeof pos.clone === "function") {
        dup.pos = pos.clone();
      } else {
        dup.pos.x = pos.x;
        dup.pos.y = pos.y;
      }
      if (typeof pickType === "function") {
        try {
          dup.type = pickType(mgr);
        } catch (_e) {}
      }
      return dup;
    };
    mgr.ka.push(mk(posTop));
    mgr.ka.push(mk(posBot));
    window.appleArray = mgr.ka;
    return 2;
  };

  window.mexico_constrain_new_apples = function mexico_constrain_new_apples(
    mgr,
    count
  ) {
    if (!mgr || !mgr.ka) return;
    if (!window.isMexicoActive || !window.isMexicoActive()) return;
    const game = window.__remixGame;
    if (game && (game.Sh | 0) >= 1 && !window.__mexicoWallDone) {
      window.mexico_place_mid_walls(game);
    }
    // Native portal may leave a singleton when the twin half fails — drop it.
    // Win only if that leaves the board empty (not on a transient empty between
    // j4E clearing the eaten pair and bomb/dice f4E pushing new pairs).
    if (mgr.ka.length % 2 !== 0) {
      mgr.ka.pop();
      window.appleArray = mgr.ka;
      if (window.mexico_win_if_empty(game, mgr)) return;
    }
    if (!mgr.ka.length) return;
    if (!count || count < 1) return;
    const board = mgr.oa;
    const mid = window.mexico_mid_y(board || (game && game.Ca));
    let start = Math.max(0, mgr.ka.length - count);
    // Keep start on a pair boundary so we never orphan a twin.
    if (start % 2 !== 0) start -= 1;
    const freePos = typeof d4E === "function" ? d4E : null;

    // Portal pairs are consecutive even/odd indices: even → top, odd → bottom.
    // Relocate when wrong half OR illegal (snake / other fruit / wall). If a
    // required half has no cell, drop that whole pair and keep other fruit;
    // win only when nothing remains.
    for (let i = start; i < mgr.ka.length; ) {
      const el = mgr.ka[i];
      if (!el || !el.pos) {
        i++;
        continue;
      }
      const wantTop = i % 2 === 0;
      const half = wantTop ? "top" : "bottom";
      const y = el.pos.y;
      const okHalf = y !== mid && (wantTop ? y < mid : y > mid);
      const occ =
        typeof window.chess_occupied_keys === "function"
          ? window.chess_occupied_keys(game, mgr.ka, new Set([i]))
          : new Set();
      let okCell = okHalf;
      if (okCell && typeof window.chess_is_legal_spawn === "function") {
        okCell = window.chess_is_legal_spawn(board, el.pos, occ);
      } else if (okCell && occ) {
        const k =
          typeof window.chess_pos_key === "function"
            ? window.chess_pos_key(el.pos)
            : el.pos.x + "," + el.pos.y;
        if (k != null && occ.has(k)) okCell = false;
      }
      if (okCell && window.mexico_pos_on_wall(game, el.pos)) okCell = false;
      if (okCell) {
        i++;
        continue;
      }
      const pos = window.mexico_find_spawn(board, freePos, occ, half);
      if (!pos) {
        const pairBase = i - (i % 2);
        window.mexico_drop_pair_at(mgr, pairBase);
        if (window.mexico_win_if_empty(game, mgr)) return;
        // Next apple shifted into pairBase; re-check from there.
        i = pairBase;
        continue;
      }
      if (typeof el.pos.clone === "function" && pos.clone) {
        el.pos = pos.clone();
      } else {
        el.pos.x = pos.x;
        el.pos.y = pos.y;
      }
      i++;
    }
  };

  window.mexico_tick_logic = function mexico_tick_logic(game) {
    if (!window.isMexicoActive || !window.isMexicoActive()) return;
    const g = game || window.__remixGame;
    if (!g) return;
    if (window.__mexicoLastSh != null && g.Sh > window.__mexicoLastSh) {
      if ((g.Sh | 0) >= 1 && !window.__mexicoWallDone) {
        window.mexico_place_mid_walls(g);
      }
      // After the eat/respawn pipeline finishes: empty board → win; otherwise
      // re-validate pairs (illegal/wrong-half fruit).
      if (g.wa && g.wa.ka) {
        try {
          if (g.wa.ka.length === 0) {
            window.mexico_win_if_empty(g, g.wa);
          } else {
            window.mexico_constrain_new_apples(g.wa, g.wa.ka.length);
          }
        } catch (_e) {}
      }
    }
    window.__mexicoLastSh = g.Sh;
  };

  // Force Portal physics. Also force Wall Mode bit for collision with the
  // one-shot mid-row walls — spawn is gated off separately (see RemixInit
  // remixPatchWallEveryApple / remixMexicoBlocksWallSpawn).
  mexicoReplace(
    "e7 portal + wall collide",
    /if\(!r&&b===21&&window\.isCatActive&&window\.isCatActive\(\)&&\(window\.cat_peaceful_ticks\|0\)>0\)return!0;return r\}/,
    "if(!r&&b===21&&window.isCatActive&&window.isCatActive()&&(window.cat_peaceful_ticks|0)>0)return!0;if(!r&&b===2&&window.isMexicoActive&&window.isMexicoActive())return!0;if(!r&&b===1&&window.isMexicoActive&&window.isMexicoActive())return!0;return r}"
  );

  mexicoReplace(
    "Y3E mexico",
    /Y3E\(this\.settings\)\|\|!!\(window\.isChessActive&&window\.isChessActive\(\)\)/,
    "Y3E(this.settings)||!!(window.isChessActive&&window.isChessActive())||!!(window.isMexicoActive&&window.isMexicoActive())"
  );
  mexicoReplace(
    "pair-splice mexico",
    /\(e7\(this\.settings,2\)\|\|\(window\.isChessActive&&window\.isChessActive\(\)\)\)/,
    "(e7(this.settings,2)||(window.isChessActive&&window.isChessActive())||(window.isMexicoActive&&window.isMexicoActive()))"
  );
  mexicoReplace(
    "f4E portal pair mexico",
    /\(e7\(a\.settings,2\)\|\|\(window\.isChessActive&&window\.isChessActive\(\)\)\)&&!f\?/,
    "(e7(a.settings,2)||(window.isChessActive&&window.isChessActive())||(window.isMexicoActive&&window.isMexicoActive()))&&!f?"
  );

  mexicoReplace(
    "f4E mexico constrain",
    /if\(window\.isChessActive&&window\.isChessActive\(\)&&g>0\)\{window\.chess_convert_new_apples\(a,g\);\}/,
    "if(window.isChessActive&&window.isChessActive()&&g>0){window.chess_convert_new_apples(a,g);}if(window.isMexicoActive&&window.isMexicoActive()&&g>0){try{window.mexico_constrain_new_apples(a,g);}catch(_mx){}}"
  );

  // Mexico uses native Portal twin respawn (j4E via e=!0). Do NOT Chess-style
  // takeover with mexico_fruit_respawn — that splices only the eaten apple and
  // leaves the exit twin on the board. Half placement is enforced in f4E via
  // mexico_constrain_new_apples (all counts: 1/3/5/10/dice/bomb/tally).
  mexicoReplace(
    "eat respawn mexico as portal",
    /e=!1;if\(window\.isChessActive&&window\.isChessActive\(\)\)\{e=!1;if\(window\.just_ate==='fruit'&&!\(a\.settings\.ka===4\|\|a\.settings\.ka===6\|\|\(a\.settings\.ka===5&&!a\.kc\)\|\|e7\(a\.settings,8\)\|\|e7\(a\.settings,9\)\)\)\{window\.chess_fruit_respawn\(a\.wa,g7,d4E,Q3E\);if\(window\.isBurgerActive&&window\.isBurgerActive\(\)&&window\.just_ate==='fruit'\)\{window\.burger_after_respawn\(a\);\}\}\}else e7\(a\.settings,2\)\?e=!0:/,
    "e=!1;if(window.isChessActive&&window.isChessActive()){e=!1;if(window.just_ate==='fruit'&&!(a.settings.ka===4||a.settings.ka===6||(a.settings.ka===5&&!a.kc)||e7(a.settings,8)||e7(a.settings,9))){window.chess_fruit_respawn(a.wa,g7,d4E,Q3E);if(window.isBurgerActive&&window.isBurgerActive()&&window.just_ate==='fruit'){window.burger_after_respawn(a);}}}else if(window.isMexicoActive&&window.isMexicoActive()){e=!0;}else e7(a.settings,2)?e=!0:"
  );

  // j4E sits inside a ternary — must not insert `;` statements. Comma-op only.
  mexicoReplace(
    "j4E mexico constrain pair",
    /j4E\(a\.wa,k,d,a\.Vm\.bind\(a\)\)/,
    "j4E(a.wa,k,d,a.Vm.bind(a)),window.isMexicoActive&&window.isMexicoActive()&&a.wa.ka.length>0&&(window.mexico_constrain_new_apples(a.wa,a.wa.ka.length),0)"
  );

  if (
    !mexicoReplace(
      "tick mexico",
      /\}tick\(\)\{window\.__remixGame=this;try\{window\.cat_tick_logic\(this\);\}catch\(_cat\)\{console\.error\("CatMod: tick failed",_cat\);\}/,
      "}tick(){window.__remixGame=this;try{window.cat_tick_logic(this);}catch(_cat){console.error(\"CatMod: tick failed\",_cat);}if(window.isMexicoActive&&window.isMexicoActive()){try{window.mexico_tick_logic(this);}catch(_mx){}}"
    )
  ) {
    if (
      !mexicoReplace(
        "tick mexico after cat-gated",
        /\}tick\(\)\{window\.__remixGame=this;if\(window\.isCatActive&&window\.isCatActive\(\)\)\{try\{window\.cat_tick_logic\(this\);\}catch\(_cat\)\{console\.error\("CatMod: tick failed",_cat\);\}\}/,
        "}tick(){window.__remixGame=this;if(window.isCatActive&&window.isCatActive()){try{window.cat_tick_logic(this);}catch(_cat){console.error(\"CatMod: tick failed\",_cat);}}if(window.isMexicoActive&&window.isMexicoActive()){try{window.mexico_tick_logic(this);}catch(_mx){}}"
      )
    ) {
      mexicoReplace(
        "tick mexico fallback",
        /\}tick\(\)\{window\.__remixGame=this;/,
        "}tick(){window.__remixGame=this;if(window.isMexicoActive&&window.isMexicoActive()){try{window.mexico_tick_logic(this);}catch(_mx){}}"
      );
    }
  }

  // Both burger + tally reset hooks share this Cat suffix.
  try {
    const resetRe =
      /if\(window\.isCatActive&&window\.isCatActive\(\)\)\{try\{window\.cat_reset_state\(\);\}catch\(_cat\)\{\}\}/g;
    if (code.match(resetRe)) {
      code = code.replace(
        resetRe,
        "if(window.isCatActive&&window.isCatActive()){try{window.cat_reset_state();}catch(_cat){}}if(window.isMexicoActive&&window.isMexicoActive()){try{window.mexico_reset_state();}catch(_mx){}}"
      );
    } else {
      console.error("MexicoMod: failed to find reset mexico");
    }
  } catch (e) {
    console.error("MexicoMod: replace failed for reset mexico", e);
  }

  if (code.indexOf("updateMexicoTrophySRC()") < 0) {
    mexicoReplace(
      "play-start mexico trophy",
      /if\(window\.CurrentModeNum===window\.CAT_MODE\)\{window\.updateCatTrophySRC\(\);window\.cat_reset_state\(\);\}/,
      "if(window.CurrentModeNum===window.CAT_MODE){window.updateCatTrophySRC();window.cat_reset_state();}if(window.CurrentModeNum===window.MEXICO_MODE){window.updateMexicoTrophySRC();window.mexico_reset_state();}"
    );
  }

  if (code.indexOf("window.MEXICO_MODE)?window.MEXICO_ICON") < 0) {
    mexicoReplace(
      "deathscreen Zb mexico icon",
      /\(a\.settings\.ob===window\.CAT_MODE\)\?window\.CAT_ICON:/,
      "(a.settings.ob===window.CAT_MODE)?window.CAT_ICON:(a.settings.ob===window.MEXICO_MODE)?window.MEXICO_ICON:"
    );
    mexicoReplace(
      "blender b3E mexico icon",
      /\(c===window\.CAT_MODE\)\?window\.CAT_ICON:/,
      "(c===window.CAT_MODE)?window.CAT_ICON:(c===window.MEXICO_MODE)?window.MEXICO_ICON:"
    );
  }

  mexicoReplace(
    "blender mode push mexico",
    /if\(window\.cat_blending&&window\.CAT_MODE!=null\)b\.push\(window\.CAT_MODE\)/,
    "if(window.cat_blending&&window.CAT_MODE!=null)b.push(window.CAT_MODE);if(window.mexico_blending&&window.MEXICO_MODE!=null)b.push(window.MEXICO_MODE)"
  );

  if (code.indexOf('el.id==="remix-mexico-blend"') < 0) {
    // Prefer Cat's el.id chain; fall back to Candy/Chess Ta (Burger/Cat URL
    // patches often skip when fruit URLs already appear in new_fruit).
    const taCat =
      /else if\(window\.CAT_MODE!=null&&el\.id==="remix-cat-blend"\)m=window\.CAT_MODE;/;
    const taChess =
      /else if\(window\.CHESS_MODE!=null&&s\.indexOf\("ZqK0CB95"\)>=0\)m=window\.CHESS_MODE;/;
    if (code.match(taCat)) {
      mexicoReplace(
        "Ta blender mexico after cat",
        taCat,
        'else if(window.CAT_MODE!=null&&el.id==="remix-cat-blend")m=window.CAT_MODE;else if(window.MEXICO_MODE!=null&&el.id==="remix-mexico-blend")m=window.MEXICO_MODE;'
      );
    } else if (code.match(taChess)) {
      mexicoReplace(
        "Ta blender mexico after chess",
        taChess,
        'else if(window.CHESS_MODE!=null&&s.indexOf("ZqK0CB95")>=0)m=window.CHESS_MODE;else if(window.BURGER_MODE!=null&&el.id==="remix-burger-blend")m=window.BURGER_MODE;else if(window.CAT_MODE!=null&&el.id==="remix-cat-blend")m=window.CAT_MODE;else if(window.MEXICO_MODE!=null&&el.id==="remix-mexico-blend")m=window.MEXICO_MODE;'
      );
    } else {
      console.error("MexicoMod: failed to find Ta blender mexico slot");
    }
  }

  return code;
};

////////////////////////////////////////////////////////////////////
//RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.MexicoMod.runCodeAfter = function () {
  if (window.MEXICO_MODE == null && window.MEXICO_ICON) {
    const root = document.querySelector("#trophy");
    if (root) {
      root.appendChild(uiImage(window.MEXICO_ICON));
      window.MEXICO_MODE = root.children.length - 1;
    }
  }
  window.add_mexico_blender_toggle && window.add_mexico_blender_toggle();
};
