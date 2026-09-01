window.TempWallsMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.TempWallsMod.runCodeBefore = function () {
  console.log("Adding Temp Walls Mode (v1)");

  window.TEMP_WALLS_ICON = "data:image/png;base64,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";
  window.TEMP_WALL_LIFESPAN = 35;
  window.TEMP_WALL_FADE_MOVES = 5;
  window.TEMP_WALL_FADE_ORANGE = "#ff6600";
  window.TEMP_WALL_PER_EAT = 2;
  window.TEMP_WALL_SPAWN_ATTEMPTS = 15;
  window.TEMP_WALL_MIN_DIST = 6;

  window.uiImage =
    window.uiImage ||
    function (src) {
      let img = new Image();
      img.src = src;
      img.classList.add("DqMRee");
      img.classList.add("SsAred");
      return img;
    };

  function tempWallsEnsureTrophy() {
    if (window.TEMP_WALLS_MODE != null) return;
    if (!window.TEMP_WALLS_ICON) return;
    const rootEl = document.querySelector("#trophy");
    if (!rootEl) return;
    rootEl.appendChild(uiImage(window.TEMP_WALLS_ICON));
    window.TEMP_WALLS_MODE = rootEl.children.length - 1;
  }
  tempWallsEnsureTrophy();

  let trophyEl = document.querySelector('img[src$="trophy_00.png"]');
  if (trophyEl) {
    let trophy_jsname = trophyEl.getAttribute("jsname");
    window.trophy_src =
      window.trophy_src ||
      `document.querySelector('img[jsname="${trophy_jsname}"]').src `;
  }

  window.temp_walls_blending = false;

  window.toggle_temp_walls_blender = function () {
    window.temp_walls_blending = !window.temp_walls_blending;
    window.correct_temp_walls_selection();
  };

  window.correct_temp_walls_selection = function correct_temp_walls_selection() {
    let el = document.getElementById("remix-temp-walls-blend");
    if (!el) return;
    if (window.temp_walls_blending) {
      el.setAttribute("class", "vuOknd lH9Ipd blender_icon blender_icon_on");
      el.innerHTML =
        `<img class="DEvgAc FMN3L blender_icon_img blender_icon_img_selected" src="` +
        window.TEMP_WALLS_ICON +
        `" alt="">`;
    } else {
      el.setAttribute("class", "vuOknd blender_icon");
      el.innerHTML =
        `<img class="DEvgAc blender_icon_img" src="` +
        window.TEMP_WALLS_ICON +
        `" alt="">`;
    }
  };

  window.add_temp_walls_blender_toggle = function add_temp_walls_blender_toggle() {
    if (document.getElementById("remix-temp-walls-blend")) return;
    if (!window.populateRemixBlenderSlot) return;
    window.populateRemixBlenderSlot({
      id: "remix-temp-walls-blend",
      slotIndex: 6,
      icon: window.TEMP_WALLS_ICON,
      ariaLabel: "Toggle Temp Walls in Blender",
      onToggle: window.toggle_temp_walls_blender,
    });
    window.correct_temp_walls_selection();
  };

  window.add_temp_walls_blender_toggle();
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.TempWallsMod.alterSnakeCode = function (code) {
  console.log("Coding Temp Walls Mode into the game (v1)");

  function twReplace(label, re, replacement) {
    if (!code.match(re)) {
      console.error("TempWallsMod: failed to find " + label);
      return false;
    }
    try {
      code = code.assertReplace(re, replacement);
      return true;
    } catch (e) {
      console.error("TempWallsMod: replace failed for " + label, e);
      return false;
    }
  }

  window.isTempWallsActive = function isTempWallsActive() {
    if (window.TEMP_WALLS_MODE == null) return false;
    if (window.CurrentModeNum === window.TEMP_WALLS_MODE) return true;
    if (window.CurrentModeNum === 22 && window.temp_walls_blending) return true;
    const g = window.__remixGame;
    const mode =
      g && g.settings
        ? g.settings.ub != null
          ? g.settings.ub
          : g.settings.ob
        : null;
    if (mode === window.TEMP_WALLS_MODE) return true;
    if (mode === 22 && window.temp_walls_blending) return true;
    return false;
  };

  window.updateTempWallsTrophySRC = function updateTempWallsTrophySRC() {
    if (window.trophy_src && window.TEMP_WALLS_ICON) {
      eval(window.trophy_src + `= window.TEMP_WALLS_ICON`);
    }
  };

  window.tempWalls_reset_state = function tempWalls_reset_state(game) {
    window.__tempWallsLastSh = null;
    window.__tempWallsLastHeadKey = null;
    window.__tempWallsSpawnedForSh = null;
    window.tempWalls_clear_all(game || window.__remixGame);
  };

  window.tempWalls_serial = function tempWalls_serial(pos) {
    if (!pos) return 0;
    if (typeof window.mexico_serial_coord === "function") {
      return window.mexico_serial_coord(pos);
    }
    return (pos.x << 16) | pos.y;
  };

  window.tempWalls_make_pos = function tempWalls_make_pos(x, y) {
    if (typeof window.mexico_make_pos === "function") {
      return window.mexico_make_pos(x, y);
    }
    if (typeof window.chess_make_pos === "function") {
      return window.chess_make_pos(x, y);
    }
    return { x: x, y: y };
  };

  window.tempWalls_should_spawn = function tempWalls_should_spawn() {
    // Trophy / blender only — never Slot leftover wrap (spawn only while roll 29).
    if (window.TEMP_WALLS_MODE != null) {
      if (window.CurrentModeNum === window.TEMP_WALLS_MODE) return true;
      if (window.CurrentModeNum === 22 && window.temp_walls_blending) return true;
      const g = window.__remixGame;
      const mode =
        g && g.settings
          ? g.settings.ub != null
            ? g.settings.ub
            : g.settings.ob
          : null;
      if (mode === window.TEMP_WALLS_MODE) return true;
      if (mode === 22 && window.temp_walls_blending) return true;
    }
    if (
      window.isSlotMachineActive &&
      window.isSlotMachineActive() &&
      (window.__slotActive | 0) === 29
    ) {
      return true;
    }
    return false;
  };

  window.tempWalls_should_check_win = function tempWalls_should_check_win() {
    if (window.tempWalls_should_spawn()) return true;
    if (
      window.isSlotMachineActive &&
      window.isSlotMachineActive() &&
      window.tempWalls_has_any(window.__remixGame)
    ) {
      return true;
    }
    return !!(window.isTempWallsActive && window.isTempWallsActive());
  };

  window.tempWalls_has_any = function tempWalls_has_any(game) {
    const g = game || window.__remixGame;
    const walls = g && g.Ca;
    if (!walls || !walls.Aa || typeof walls.Aa.values !== "function") return false;
    try {
      for (const w of walls.Aa.values()) {
        if (w && w.__tempWall) return true;
      }
    } catch (_e) {}
    return false;
  };

  window.tempWalls_list = function tempWalls_list(game) {
    const out = [];
    const g = game || window.__remixGame;
    const walls = g && g.Ca;
    if (!walls || !walls.Aa || typeof walls.Aa.values !== "function") return out;
    try {
      for (const w of walls.Aa.values()) {
        if (w && w.__tempWall) out.push(w);
      }
    } catch (_e) {}
    return out;
  };

  window.tempWalls_cell_blocked = function tempWalls_cell_blocked(game, x, y) {
    const g = game || window.__remixGame;
    if (!g) return true;
    const walls = g.Ca;
    if (walls && Array.isArray(walls.wa) && walls.wa[y] && (walls.wa[y][x] | 0) > 0) {
      return true;
    }
    const snake = g.oa && g.oa.ka;
    if (snake) {
      for (let i = 0; i < snake.length; i++) {
        const s = snake[i];
        if (s && (s.x | 0) === (x | 0) && (s.y | 0) === (y | 0)) return true;
      }
    }
    const fruits = g.wa && g.wa.ka;
    if (fruits) {
      for (let i = 0; i < fruits.length; i++) {
        const f = fruits[i];
        const p = f && f.pos;
        if (p && (p.x | 0) === (x | 0) && (p.y | 0) === (y | 0)) return true;
      }
    }
    return false;
  };

  window.tempWalls_remove_one = function tempWalls_remove_one(game, wall) {
    const g = game || window.__remixGame;
    if (!g || !wall || !wall.pos) return;
    const walls = g.Ca;
    if (!walls) return;
    const x = wall.pos.x | 0;
    const y = wall.pos.y | 0;
    try {
      if (walls.Aa && typeof walls.Aa.delete === "function") {
        walls.Aa.delete(window.tempWalls_serial(wall.pos));
      }
    } catch (_e) {}
    try {
      if (walls.wa && walls.wa[y] && (walls.wa[y][x] | 0) > 0) {
        walls.wa[y][x]--;
      }
    } catch (_e2) {}
  };

  window.tempWalls_clear_all = function tempWalls_clear_all(game) {
    const g = game || window.__remixGame;
    const list = window.tempWalls_list(g);
    for (let i = 0; i < list.length; i++) {
      window.tempWalls_remove_one(g, list[i]);
    }
  };

  window.tempWalls_place_at = function tempWalls_place_at(game, x, y) {
    const g = game || window.__remixGame;
    if (!g) return false;
    const walls = g.Ca;
    if (!walls || !walls.Aa || !Array.isArray(walls.wa) || !walls.wa.length) {
      return false;
    }
    const yi = y | 0;
    const xi = x | 0;
    if (!walls.wa[yi] || xi < 0 || xi >= walls.wa[yi].length) return false;
    if ((walls.wa[yi][xi] | 0) > 0) return false;
    const pos = window.tempWalls_make_pos(xi, yi);
    const obj = {
      pos: pos,
      wm: false,
      m0: false,
      Lh: true,
      __tempWall: true,
      movesRemaining: window.TEMP_WALL_LIFESPAN | 35,
    };
    try {
      walls.Aa.set(window.tempWalls_serial(pos), obj);
      walls.wa[yi][xi]++;
      if (window.slot_clear_arrow_at) {
        try {
          window.slot_clear_arrow_at(g, xi, yi);
        } catch (_ar) {}
      }
      return true;
    } catch (_e) {
      return false;
    }
  };

  window.tempWalls_spawn_on_eat = function tempWalls_spawn_on_eat(game) {
    const g = game || window.__remixGame;
    if (!g || !window.tempWalls_should_spawn()) return 0;
    // One batch of ≤2 walls per apple. Slot Machine skips native f4E and must
    // key off the eaten fruit; trophy mode keys off score (skip layout Sh==0).
    let key;
    if (
      window.isSlotMachineActive &&
      window.isSlotMachineActive() &&
      (window.__slotActive | 0) === 29 &&
      (window.__slotActivatedFruit || window.__slotEatenFruit)
    ) {
      key = window.__slotActivatedFruit || window.__slotEatenFruit;
    } else {
      const sh = g.Sh | 0;
      if (sh <= 0) return 0;
      key = "sh:" + sh;
    }
    if (window.__tempWallsSpawnedForSh === key) return 0;
    window.__tempWallsSpawnedForSh = key;
    const walls = g.Ca;
    if (!walls || !Array.isArray(walls.wa) || !walls.wa.length) return 0;
    const h = walls.wa.length;
    const w = walls.wa[0] ? walls.wa[0].length : 0;
    if (!w) return 0;
    const head = g.oa && g.oa.ka && g.oa.ka[0];
    const minDist = window.TEMP_WALL_MIN_DIST | 6;
    const attempts = window.TEMP_WALL_SPAWN_ATTEMPTS | 15;
    const perEat = window.TEMP_WALL_PER_EAT | 2;
    let planted = 0;
    for (let n = 0; n < perEat; n++) {
      let ok = false;
      for (let a = 0; a < attempts; a++) {
        const x = (Math.random() * w) | 0;
        const y = (Math.random() * h) | 0;
        if (head) {
          const dist = Math.abs(x - (head.x | 0)) + Math.abs(y - (head.y | 0));
          if (dist < minDist) continue;
        }
        if (window.tempWalls_cell_blocked(g, x, y)) continue;
        if (window.tempWalls_place_at(g, x, y)) {
          planted++;
          ok = true;
          break;
        }
      }
      if (!ok) break;
    }
    return planted;
  };

  window.tempWalls_age = function tempWalls_age(game) {
    const g = game || window.__remixGame;
    const list = window.tempWalls_list(g);
    for (let i = 0; i < list.length; i++) {
      const wall = list[i];
      wall.movesRemaining = (wall.movesRemaining | 0) - 1;
      if ((wall.movesRemaining | 0) <= 0) {
        window.tempWalls_remove_one(g, wall);
      }
    }
  };

  window.tempWalls_trigger_win = function tempWalls_trigger_win(game) {
    if (!game || game.nj) return;
    if (
      window.isSlotMachineActive &&
      window.isSlotMachineActive() &&
      typeof window.slot_trigger_win === "function"
    ) {
      window.slot_trigger_win(game);
      return;
    }
    try {
      const winBank =
        (typeof s5E !== "undefined" && s5E) || window.__bombFruitS5E;
      if (winBank && winBank.WIN && winBank.WIN.play) winBank.WIN.play();
      else if (typeof Q4E !== "undefined" && Q4E.rWd && Q4E.rWd.play)
        Q4E.rWd.play();
      else if (typeof ybF !== "undefined" && ybF.WIN) ybF.WIN.play();
    } catch (_e) {}
    game.ub = true;
    game.nj = true;
    try {
      const score = game.Sh != null ? game.Sh : game.Oh;
      if (typeof A7E === "function") A7E(game.menu, 1400, score);
      else if (typeof vdF === "function") vdF(game.menu, 1400, score);
    } catch (_e2) {}
  };

  window.tempWalls_win_if_empty = function tempWalls_win_if_empty(game, mgr) {
    if (!game || game.nj) return false;
    if (!window.tempWalls_should_check_win()) return false;
    if (
      window.isSlotMachineActive &&
      window.isSlotMachineActive() &&
      typeof window.slot_win_if_empty === "function"
    ) {
      return window.slot_win_if_empty(game, mgr);
    }
    const list = mgr && mgr.ka;
    if (list && list.length > 0) return false;
    window.tempWalls_trigger_win(game);
    return true;
  };

  window.tempWalls_after_eat = function tempWalls_after_eat(mgr, allowEmptyWin) {
    const game = window.__remixGame;
    if (!game || game.nj) return;
    if (window.tempWalls_should_spawn()) {
      try {
        window.tempWalls_spawn_on_eat(game);
      } catch (_e) {}
    }
    if (allowEmptyWin) {
      try {
        window.tempWalls_win_if_empty(game, mgr || game.wa);
      } catch (_e2) {}
    }
  };

  window.tempWalls_tick_logic = function tempWalls_tick_logic(game) {
    const g = game || window.__remixGame;
    if (!g) return;
    if (window.tempWalls_has_any(g)) {
      const head = g.oa && g.oa.ka && g.oa.ka[0];
      if (head && head.x != null) {
        const key = (head.x | 0) + "," + (head.y | 0);
        if (
          window.__tempWallsLastHeadKey != null &&
          window.__tempWallsLastHeadKey !== key
        ) {
          try {
            window.tempWalls_age(g);
          } catch (_age) {}
        }
        window.__tempWallsLastHeadKey = key;
      }
    } else {
      window.__tempWallsLastHeadKey = null;
    }
    if (
      window.__tempWallsLastSh != null &&
      (g.Sh | 0) > (window.__tempWallsLastSh | 0)
    ) {
      // Slot Machine plants from slot_on_eating_fruit (no native f4E). Skip the
      // Sh-delta path so we don't plant a second batch after flags clear.
      if (!(window.isSlotMachineActive && window.isSlotMachineActive())) {
        window.tempWalls_after_eat(g.wa, true);
      }
    }
    window.__tempWallsLastSh = g.Sh;
  };

  window.tempWalls_has_fading = function tempWalls_has_fading(game) {
    const list = window.tempWalls_list(game || window.__remixGame);
    const fadeAt = window.TEMP_WALL_FADE_MOVES | 5;
    for (let i = 0; i < list.length; i++) {
      const w = list[i];
      if (w && (w.movesRemaining | 0) <= fadeAt && (w.movesRemaining | 0) > 0) {
        return true;
      }
    }
    return false;
  };

  window.tempWalls_parse_hex = function tempWalls_parse_hex(hex) {
    let h = String(hex || "#ff8c00").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const n = parseInt(h, 16);
    if (!n && n !== 0) return { r: 255, g: 140, b: 0 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  };

  window.tempWalls_lerp_color = function tempWalls_lerp_color(a, b, t) {
    const ca = window.tempWalls_parse_hex(a);
    const cb = window.tempWalls_parse_hex(b);
    const u = Math.max(0, Math.min(1, t));
    const r = (ca.r + (cb.r - ca.r) * u) | 0;
    const g = (ca.g + (cb.g - ca.g) * u) | 0;
    const bl = (ca.b + (cb.b - ca.b) * u) | 0;
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)
    );
  };

  // Theme wall color for fade pulse (orange alternates with this).
  window.tempWalls_theme_brick = function tempWalls_theme_brick(settingsOrBoard) {
    let settings = settingsOrBoard;
    if (settingsOrBoard && settingsOrBoard.settings) {
      settings = settingsOrBoard.settings;
    }
    if (!settings) {
      const g = window.__remixGame;
      settings = g && g.settings;
    }
    let brick = "#578a34";
    try {
      if (settings && typeof c7 === "function") {
        brick = c7(settings, settings.oa, 3);
      }
    } catch (_e) {}
    return { brick: brick, mortar: brick };
  };

  window.tempWalls_tile_size = function tempWalls_tile_size(board) {
    if (board && board.wb && board.wb.ka && board.wb.ka.ka) return board.wb.ka.ka;
    const g = window.__remixGame;
    if (g && g.ka && g.ka.ka) return g.ka.ka;
    if (g && g.Ja && g.Ja.wb && g.Ja.wb.ka && g.Ja.wb.ka.ka) return g.Ja.wb.ka.ka;
    return 0;
  };

  // Pulse fading temp walls on the same canvas layer the game just used for
  // solid walls: Ka.ka (classic / Temp Walls trophy) or Ka.oa (Dimension mode).
  window.tempWalls_drawPulse = function tempWalls_drawPulse(board, layer) {
    const game = (board && board.wb) || window.__remixGame;
    if (!game || game.nj) return;
    if (!window.tempWalls_has_fading(game)) return;
    if (!board) return;

    const useOa = layer === "oa";
    const ctx = useOa ? board.oa : board.ka;
    if (!ctx || typeof ctx.fillRect !== "function") return;

    let tile = 0;
    try {
      tile =
        (board.wb && board.wb.ka && board.wb.ka.ka) ||
        window.tempWalls_tile_size(board) ||
        0;
    } catch (_t) {}
    if (!tile) return;

    const list = window.tempWalls_list(game);
    const fadeAt = window.TEMP_WALL_FADE_MOVES | 5;
    const orange = window.TEMP_WALL_FADE_ORANGE || "#ff6600";
    const theme = window.tempWalls_theme_brick(board.settings || board);
    const brick = theme.brick || "#5fa038";
    const now = Date.now();
    const blink = 0.5 + 0.5 * Math.sin(now * 0.014);

    let pixel = false;
    try {
      if (typeof $6 === "function" && board.settings) {
        pixel = !!$6(board.settings);
      }
    } catch (_p) {}

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    for (let i = 0; i < list.length; i++) {
      const wall = list[i];
      if (!wall || !wall.pos || (wall.movesRemaining | 0) > fadeAt) continue;
      if ((wall.movesRemaining | 0) <= 0) continue;

      const moves = wall.movesRemaining | 0;
      const urgency = (fadeAt - moves + 1) / fadeAt;
      const blinkMix = blink * (0.5 + 0.5 * urgency);
      const alpha = 0.25 + 0.35 * blinkMix;
      const color = window.tempWalls_lerp_color(brick, orange, blink);

      const cx = (wall.pos.x | 0) * tile + tile / 2;
      const cy = (wall.pos.y | 0) * tile + tile / 2;
      const Se = tile;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;

      if (useOa && pixel) {
        const kd = (320 / 120) * Se * 1.4;
        ctx.fillRect(cx - kd, cy - kd, kd * 2, kd * 2);
      } else if (useOa) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-Se, -Se, Se * 2, Se * 2);
        ctx.restore();
      } else {
        // F5E.render classic path: axis-aligned full cell on ka.
        ctx.fillRect(cx - Se / 2, cy - Se / 2, Se, Se);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  };

  if (
    !twReplace(
      "e7 wall collide after bomb fruit",
      /if\(!r&&b===15&&window\.BOMB_FRUIT_MODE!=null\)\{if\(a\.ub===window\.BOMB_FRUIT_MODE\)return!0;if\(a\.ub===22&&a\.rSa&&a\.rSa\.has\(window\.BOMB_FRUIT_MODE\)\)return!0;\}return r\}/,
      "if(!r&&b===15&&window.BOMB_FRUIT_MODE!=null){if(a.ub===window.BOMB_FRUIT_MODE)return!0;if(a.ub===22&&a.rSa&&a.rSa.has(window.BOMB_FRUIT_MODE))return!0;}if(!r&&b===1&&((window.isTempWallsActive&&window.isTempWallsActive())||(window.tempWalls_has_any&&window.tempWalls_has_any(window.__remixGame))))return!0;return r}"
    )
  ) {
    twReplace(
      "e7 wall collide fallback",
      /if\(!r&&b===2&&window\.isMexicoActive&&window\.isMexicoActive\(\)\)return!0;if\(!r&&b===1&&window\.isMexicoActive&&window\.isMexicoActive\(\)\)return!0;return r\}/,
      "if(!r&&b===2&&window.isMexicoActive&&window.isMexicoActive())return!0;if(!r&&b===1&&window.isMexicoActive&&window.isMexicoActive())return!0;if(!r&&b===1&&((window.isTempWallsActive&&window.isTempWallsActive())||(window.tempWalls_has_any&&window.tempWalls_has_any(window.__remixGame))))return!0;return r}"
    );
  }

  // Classic / trophy path: walls paint on Ka.ka via F5E.render — pulse there.
  if (
    !twReplace(
      "Ka render temp walls pulse",
      /this\.Ka\.render\(a\);this\.hb\.render\(a\)/,
      'this.Ka.render(a);try{window.tempWalls_drawPulse&&window.tempWalls_drawPulse(this.Ka,"ka");}catch(_tw){}this.hb.render(a)'
    )
  ) {
    console.error("TempWallsMod: Ka render pulse hook failed");
  }

  // Dimension mode path: second wall pass paints on Ka.oa — pulse there too.
  if (
    !twReplace(
      "wall render temp walls pulse",
      /td\.oa\.restore\(\)\}var Fd=this\.Fb;let se=Fd\.wb\.nj\?0:Pc/,
      'td.oa.restore()}try{window.tempWalls_drawPulse&&window.tempWalls_drawPulse(td,"oa");}catch(_tw){}var Fd=this.Fb;let se=Fd.wb.nj?0:Pc'
    )
  ) {
    console.error("TempWallsMod: wall render pulse hook failed");
  }

  twReplace(
    "D5E call gate classic temp walls",
    /!e7\(this\.settings,4\)&&\(e7\(this\.settings,12\)\|\|window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)&&D5E\(this\.Ja,a\)/,
    "!e7(this.settings,4)&&(e7(this.settings,12)||window.isBombFruitActive&&window.isBombFruitActive()||window.tempWalls_has_fading&&window.tempWalls_has_fading(this)||window.tempWalls_has_any&&window.tempWalls_has_any(this))&&D5E(this.Ja,a)"
  );
  twReplace(
    "D5E call gate pixel temp walls",
    /\(e7\(this\.settings,12\)\|\|window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)&&D5E\(this\.Ja,dd\)/,
    "(e7(this.settings,12)||window.isBombFruitActive&&window.isBombFruitActive()||window.tempWalls_has_fading&&window.tempWalls_has_fading(this)||window.tempWalls_has_any&&window.tempWalls_has_any(this))&&D5E(this.Ja,dd)"
  );

  if (
    !twReplace(
      "f4E temp walls after bomb fruit",
      /if\(window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)\{try\{window\.bombFruit_after_respawn\(a,g,!0\);\}catch\(_bf\)\{\}\}/,
      "if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_after_respawn(a,g,!0);}catch(_bf){}}if((window.tempWalls_should_spawn&&window.tempWalls_should_spawn())||(window.tempWalls_should_check_win&&window.tempWalls_should_check_win())){try{window.tempWalls_after_eat(a,!0);}catch(_tw){}}"
    )
  ) {
    console.error("TempWallsMod: f4E hook failed");
  }

  if (
    !twReplace(
      "j4E temp walls after bomb fruit",
      /window\.isBombFruitActive&&window\.isBombFruitActive\(\)&&\(window\.bombFruit_after_respawn\(a\.wa,0,!1\),0\)/,
      "window.isBombFruitActive&&window.isBombFruitActive()&&(window.bombFruit_after_respawn(a.wa,0,!1),0),(window.tempWalls_should_check_win&&window.tempWalls_should_check_win()&&(window.tempWalls_win_if_empty(window.__remixGame,a.wa),0))"
    )
  ) {
    console.error("TempWallsMod: j4E hook failed");
  }

  if (
    !twReplace(
      "tick temp walls after bomb fruit",
      /if\(window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)\{try\{window\.bombFruit_tick_logic\(this\);\}catch\(_bf\)\{console\.error\("BombFruitMod: tick failed",_bf\);\}\}/,
      'if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_tick_logic(this);}catch(_bf){console.error("BombFruitMod: tick failed",_bf);}}if((window.isTempWallsActive&&window.isTempWallsActive())||(window.tempWalls_has_any&&window.tempWalls_has_any(this))){try{window.tempWalls_tick_logic(this);}catch(_tw){console.error("TempWallsMod: tick failed",_tw);}}'
    )
  ) {
    console.error("TempWallsMod: tick hook failed");
  }

  try {
    const resetRe =
      /if\(window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)\{try\{window\.bombFruit_reset_state\(\);\}catch\(_bf\)\{\}\}/g;
    if (code.match(resetRe)) {
      code = code.replace(
        resetRe,
        "if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_reset_state();}catch(_bf){}}if(window.isTempWallsActive&&window.isTempWallsActive()||window.TEMP_WALLS_MODE!=null){try{window.tempWalls_reset_state(this);}catch(_tw){}}"
      );
    } else {
      console.error("TempWallsMod: failed to find reset");
    }
  } catch (e) {
    console.error("TempWallsMod: replace failed for reset", e);
  }

  if (code.indexOf("updateTempWallsTrophySRC()") < 0) {
    twReplace(
      "play-start temp walls trophy",
      /if\(window\.CurrentModeNum===window\.BOMB_FRUIT_MODE\)\{window\.updateBombFruitTrophySRC\(\);window\.bombFruit_reset_state\(\);\}/,
      "if(window.CurrentModeNum===window.BOMB_FRUIT_MODE){window.updateBombFruitTrophySRC();window.bombFruit_reset_state();}if(window.CurrentModeNum===window.TEMP_WALLS_MODE){window.updateTempWallsTrophySRC();window.tempWalls_reset_state();}"
    );
  }

  if (code.indexOf("window.TEMP_WALLS_MODE)?window.TEMP_WALLS_ICON") < 0) {
    twReplace(
      "deathscreen Zb temp walls icon",
      /\(a\.settings\.ob===window\.BOMB_FRUIT_MODE\)\?window\.BOMB_FRUIT_ICON:/,
      "(a.settings.ob===window.BOMB_FRUIT_MODE)?window.BOMB_FRUIT_ICON:(a.settings.ob===window.TEMP_WALLS_MODE)?window.TEMP_WALLS_ICON:"
    );
    twReplace(
      "blender b3E temp walls icon",
      /\(c===window\.BOMB_FRUIT_MODE\)\?window\.BOMB_FRUIT_ICON:/,
      "(c===window.BOMB_FRUIT_MODE)?window.BOMB_FRUIT_ICON:(c===window.TEMP_WALLS_MODE)?window.TEMP_WALLS_ICON:"
    );
  }

  twReplace(
    "blender mode push temp walls",
    /if\(window\.bomb_fruit_blending&&window\.BOMB_FRUIT_MODE!=null\)b\.push\(window\.BOMB_FRUIT_MODE\)/,
    "if(window.bomb_fruit_blending&&window.BOMB_FRUIT_MODE!=null)b.push(window.BOMB_FRUIT_MODE);if(window.temp_walls_blending&&window.TEMP_WALLS_MODE!=null)b.push(window.TEMP_WALLS_MODE)"
  );

  if (code.indexOf('el.id==="remix-temp-walls-blend"') < 0) {
    const taBomb =
      /else if\(window\.BOMB_FRUIT_MODE!=null&&el\.id==="remix-bomb-fruit-blend"\)m=window\.BOMB_FRUIT_MODE;/;
    if (code.match(taBomb)) {
      twReplace(
        "Ta blender temp walls after bomb fruit",
        taBomb,
        'else if(window.BOMB_FRUIT_MODE!=null&&el.id==="remix-bomb-fruit-blend")m=window.BOMB_FRUIT_MODE;else if(window.TEMP_WALLS_MODE!=null&&el.id==="remix-temp-walls-blend")m=window.TEMP_WALLS_MODE;'
      );
    } else {
      console.error("TempWallsMod: failed to find Ta blender slot");
    }
  }

  return code;
};

////////////////////////////////////////////////////////////////////
//RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.TempWallsMod.runCodeAfter = function () {
  if (window.TEMP_WALLS_MODE == null && window.TEMP_WALLS_ICON) {
    const rootEl = document.querySelector("#trophy");
    if (rootEl) {
      rootEl.appendChild(uiImage(window.TEMP_WALLS_ICON));
      window.TEMP_WALLS_MODE = rootEl.children.length - 1;
    }
  }
  window.add_temp_walls_blender_toggle && window.add_temp_walls_blender_toggle();
};
