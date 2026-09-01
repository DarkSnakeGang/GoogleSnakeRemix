window.SlotMachineMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.SlotMachineMod.runCodeBefore = function () {
  console.log("Adding Slot Machine Mode (v16)");

  window.SLOT_MACHINE_ICON = "data:image/png;base64,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";

  // Eligible bag modes (excludes Classic 0, Blender 22). Yin Yang 7 /
  // Dimension 11 / Mexico 27 are Slot-local (no sticky native). Borderless (4)
  // is wrap-only (no e7(4) visuals / camera); Peaceful off; count unchanged.
  window.SLOT_MACHINE_POOL = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    23, 24, 25, 26, 27, 28,
  ];

  window.SLOT_MACHINE_MODE_LABELS = {
    1: "Wall",
    2: "Portal",
    3: "Cheese",
    4: "Borderless",
    5: "Twin",
    6: "Winged",
    7: "Yin Yang",
    8: "Key",
    9: "Sokoban",
    10: "Poison",
    11: "Dimension",
    12: "Minesweeper",
    13: "Statue",
    14: "Light",
    15: "Shield",
    16: "Arrow",
    17: "Hotdog",
    18: "Magnet",
    19: "Gate",
    20: "Bridge",
    21: "Peaceful",
    23: "Candy",
    24: "Chess",
    25: "Burger",
    26: "Cat",
    27: "Mexico",
    28: "Bomb Fruit",
  };

  // Polarity for Yin Yang paired badge flip (7 is both — in good and bad pools).
  window.SLOT_BADGE_POLARITY = {
    1: "bad",
    2: "bad",
    3: "good",
    4: "good",
    5: "bad",
    6: "bad",
    7: "both",
    8: "bad",
    9: "bad",
    10: "bad",
    11: "good",
    12: "bad",
    13: "bad",
    14: "bad",
    15: "bad",
    16: "bad",
    17: "bad",
    18: "bad",
    19: "bad",
    20: "bad",
    21: "good",
    23: "good",
    24: "bad",
    25: "bad",
    26: "good",
    27: "bad",
    28: "bad",
  };

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
      `document.querySelector('img[jsname="${trophy_jsname}"]').src `;
  }

  // No blender slot — Slot Machine is a meta-switcher.
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.SlotMachineMod.alterSnakeCode = function (code) {
  console.log("Coding Slot Machine Mode into the game (v16)");

  function smReplace(label, re, replacement, optional) {
    if (!code.match(re)) {
      if (!optional) {
        console.error("SlotMachineMod: failed to find " + label);
      }
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

  // Capture native yin-yang color matchmaking + solid snake color table
  // (pudding may have already extended both).
  // Snake color index is settings.wa (synced Ja/Jb). settings.oa is BOARD THEME
  // (c7/s3E) — never treat it as snake color.
  if (code.indexOf("window.__slotYyColorPairs=") < 0) {
    smReplace(
      "slot capture yy color pairs",
      /(\w+)=(\[5,4,7,7,1,2,0,3,9,8,0,14,15,15,11[^\]]*?\])/,
      "$1=$2;window.__slotYyColorPairs=$1",
      true
    );
  }
  if (code.indexOf("window.__slotSnakeColorTable=") < 0) {
    smReplace(
      "slot capture snake color table",
      /(\w+)=(\[\[\"#4E7CF6\",\"#17439F\"\][\s\S]*?\]\])/,
      "$1=$2;window.__slotSnakeColorTable=$1",
      true
    );
  }
  // Native sprite recolor (resets via C3E then tints). Used for eyes/mouth.
  if (code.indexOf("window.__slotA7=a7") < 0) {
    smReplace(
      "slot capture a7 sprite recolor",
      /a7=function\(a,b,c,d=-1\)\{/,
      "a7=function(a,b,c,d=-1){window.__slotA7=a7;",
      true
    );
  }
  // Face atlas lives on the canvas renderer (X5E.Ga = P5E blink/eat/die/tongue),
  // NOT on the game object (__remixGame.Ga is bridges). Capture the real atlas.
  if (code.indexOf("window.__slotFaceRef=") < 0) {
    if (
      !smReplace(
        "slot capture face atlas on construct",
        /this\.Ga=new (\w+)\(this\.wb,this\.settings,this\.ka,this\.oa,\s*this\.(\w+)\);/,
        "this.Ga=new $1(this.wb,this.settings,this.ka,this.oa,this.$2);window.__slotFaceRef=this.Ga;",
        true
      )
    ) {
      smReplace(
        "slot capture face on rainbow tint",
        /b=a\.Ga;var c=a\.wb\.oa\.Sc;/,
        "b=a.Ga;window.__slotFaceRef=b;var c=a.wb.oa.Sc;",
        true
      );
      smReplace(
        "slot capture face on classic tint",
        /b=a\.Ga,C3E\(b\.oa\),C3E\(b\.Aa\),C3E\(b\.Ba\),C3E\(b\.wa\);/,
        "b=a.Ga,window.__slotFaceRef=b,C3E(b.oa),C3E(b.Aa),C3E(b.Ba),C3E(b.wa);",
        true
      );
    }
  }
  // Live snake color index written on menu select (before pudding rainbow inject).
  window.__slotYyColorField = "wa";
  if (code.indexOf("window.__slotYyColorIndex=d") < 0) {
    smReplace(
      "slot stamp color index on select",
      /case "color":/,
      'case "color":window.__slotYyColorIndex=d;',
      true
    );
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

  // Slot Borderless: wrap through edges only — never sticky e7(4), so camera,
  // canvas, tiled boards, and checker/phase side-effects stay classic.
  window.slot_borderless_wrap = function slot_borderless_wrap() {
    return !!(
      window.isSlotMachineActive &&
      window.isSlotMachineActive() &&
      (window.__slotActive | 0) === 4
    );
  };

  window.updateSlotMachineTrophySRC = function updateSlotMachineTrophySRC() {
    if (window.trophy_src && window.SLOT_MACHINE_ICON) {
      eval(window.trophy_src + `= window.SLOT_MACHINE_ICON`);
    }
  };

  // Top-bar tracks active Slot badge (not Slot icon) while a roll is live.
  // Chess piece pickup still uses updateTrophySRC(type) while carrying.
  window.slot_update_active_trophy = function slot_update_active_trophy() {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if (window.head_state && window.head_state !== "OPEN") return;
    if (window.__slotActive == null) {
      window.updateSlotMachineTrophySRC();
      return;
    }
    if (!window.trophy_src) return;
    const url = window.slot_trophy_url_for_mode(window.__slotActive);
    if (!url) return;
    try {
      eval(window.trophy_src + "=(" + JSON.stringify(url) + ")");
    } catch (_e) {}
  };

  window.slot_reset_state = function slot_reset_state() {
    window.__slotActive = null;
    window.__slotPrevActive = null;
    window.__slotBag = null;
    window.__slotCatFruitEaten = 0;
    window.__slotTwinLive = false;
    window.__slotBadgeCache = Object.create(null);
    window.__slotEating = false;
    window.__slotForceEntitySpawn = false;
    window.__slotEatenFruit = null;
    window.__slotEatenMode = null;
    window.__slotActivatedFruit = null;
    window.__slotRespawnedThisEat = false;
    window.__slotPortalTwinToRemove = null;
    window.__slotPortalPairSeq = 0;
    window.__slotSpecialStore = [];
    window.slot_key_unlock_fruit = 0;
    window.slot_soko_unlock_fruit = 0;
    window.cat_lives = window.cat_lives | 0;
    window.__slotMexicoMidUp = false;
    window.__slotMexicoStartSide = null;
    window.__slotMexicoPairSeq = 0;
    try {
      window.slot_yy_restore_snake_colors &&
        window.slot_yy_restore_snake_colors();
    } catch (_yy) {}
    try {
      window.slot_sync_ultra_disables && window.slot_sync_ultra_disables();
    } catch (_e) {}
    try {
      window.updateSlotMachineTrophySRC &&
        window.updateSlotMachineTrophySRC();
    } catch (_t) {}
  };

  window.slot_shuffle_bag = function slot_shuffle_bag() {
    const pool = window.slot_enabled_pool
      ? window.slot_enabled_pool()
      : (window.SLOT_MACHINE_POOL || []).slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = pool[i];
      pool[i] = pool[j];
      pool[j] = t;
    }
    window.__slotBag = pool;
    return pool;
  };

  // Settings-selected badge pool (Custom → Slot). Missing/invalid → full pool.
  window.slot_default_enabled_modes = function slot_default_enabled_modes() {
    return (window.SLOT_MACHINE_POOL || []).slice();
  };

  window.slot_normalize_enabled_modes = function slot_normalize_enabled_modes(
    list
  ) {
    const full = window.SLOT_MACHINE_POOL || [];
    const allowed = new Set(full.map(function (m) {
      return m | 0;
    }));
    const out = [];
    const seen = new Set();
    if (Array.isArray(list)) {
      for (let i = 0; i < list.length; i++) {
        const m = list[i] | 0;
        if (!allowed.has(m) || seen.has(m)) continue;
        seen.add(m);
        out.push(m);
      }
    }
    return out.length ? out : full.slice();
  };

  window.slot_get_enabled_modes = function slot_get_enabled_modes() {
    const s = window.pudding_settings;
    if (!s || s.SlotMachineModes == null) {
      return window.slot_default_enabled_modes();
    }
    return window.slot_normalize_enabled_modes(s.SlotMachineModes);
  };

  window.slot_set_enabled_modes = function slot_set_enabled_modes(list) {
    if (!window.pudding_settings) window.pudding_settings = {};
    const next = window.slot_normalize_enabled_modes(list);
    window.pudding_settings.SlotMachineModes = next;
    window.__slotBag = null;
    if (typeof window.saveSettings === "function") {
      try {
        window.saveSettings();
      } catch (_e) {}
    }
    return next;
  };

  window.slot_enabled_pool = function slot_enabled_pool() {
    return window.slot_get_enabled_modes().slice();
  };

  window.slot_is_mode_enabled = function slot_is_mode_enabled(mode) {
    const m = mode | 0;
    const list = window.slot_get_enabled_modes();
    for (let i = 0; i < list.length; i++) {
      if ((list[i] | 0) === m) return true;
    }
    return false;
  };

  window.slot_toggle_enabled_mode = function slot_toggle_enabled_mode(mode) {
    const m = mode | 0;
    const cur = window.slot_get_enabled_modes().slice();
    const idx = cur.indexOf(m);
    if (idx >= 0) {
      if (cur.length <= 1) return cur; // keep at least one badge
      cur.splice(idx, 1);
    } else {
      const full = window.SLOT_MACHINE_POOL || [];
      if (full.indexOf(m) < 0) return cur;
      cur.push(m);
      cur.sort(function (a, b) {
        return (a | 0) - (b | 0);
      });
    }
    return window.slot_set_enabled_modes(cur);
  };

  // Remix-added Slot badges: Candy (23) through Bomb Fruit (28).
  window.slot_is_remix_added_mode = function slot_is_remix_added_mode(mode) {
    const m = mode | 0;
    return m >= 23 && m <= 28;
  };

  // "Deselect all" keeps the earliest pool badge only (cannot empty the set).
  window.slot_deselect_all_enabled_modes = function slot_deselect_all_enabled_modes() {
    const full = window.SLOT_MACHINE_POOL || [];
    const first = full.length ? full[0] | 0 : 1;
    return window.slot_set_enabled_modes([first]);
  };

  // Vanilla Google modes only — drop Candy…Bomb Remix additions.
  window.slot_vanilla_only_enabled_modes = function slot_vanilla_only_enabled_modes() {
    const full = window.SLOT_MACHINE_POOL || [];
    const vanilla = full.filter(function (m) {
      return !window.slot_is_remix_added_mode(m);
    });
    return window.slot_set_enabled_modes(vanilla);
  };

  window.slot_draw_mode = function slot_draw_mode() {
    if (!window.__slotBag || !window.__slotBag.length) {
      window.slot_shuffle_bag();
    }
    return window.__slotBag.pop();
  };

  window.slot_draw_mode_excluding = function slot_draw_mode_excluding(exclude) {
    const ban = exclude || [];
    const banned = function (m) {
      const v = m | 0;
      for (let i = 0; i < ban.length; i++) {
        if ((ban[i] | 0) === v) return true;
      }
      return false;
    };
    for (let attempt = 0; attempt < 48; attempt++) {
      const m = window.slot_draw_mode() | 0;
      if (!banned(m)) return m;
    }
    const pool = (window.slot_enabled_pool
      ? window.slot_enabled_pool()
      : (window.SLOT_MACHINE_POOL || []).slice()
    ).filter(function (m) {
      return !banned(m);
    });
    if (!pool.length) return window.slot_draw_mode() | 0;
    return pool[(Math.random() * pool.length) | 0] | 0;
  };

  window.slot_badge_polarity = function slot_badge_polarity(mode) {
    const map = window.SLOT_BADGE_POLARITY || {};
    return map[mode | 0] || "bad";
  };

  window.slot_roll_yy_pair = function slot_roll_yy_pair(primary, exclude) {
    const p = primary | 0;
    const ban = exclude || [];
    const banned = function (m) {
      const v = m | 0;
      for (let i = 0; i < ban.length; i++) {
        if ((ban[i] | 0) === v) return true;
      }
      return false;
    };
    const enabled = window.slot_enabled_pool
      ? window.slot_enabled_pool()
      : (window.SLOT_MACHINE_POOL || []).slice();
    const candidates = [];
    for (let i = 0; i < enabled.length; i++) {
      const m = enabled[i] | 0;
      if (banned(m)) continue;
      if (p === 7) {
        if (m !== 7) candidates.push(m);
        continue;
      }
      const pol = window.slot_badge_polarity(p);
      const q = window.slot_badge_polarity(m);
      if (pol === "good" && (q === "bad" || q === "both")) candidates.push(m);
      else if (pol === "bad" && (q === "good" || q === "both"))
        candidates.push(m);
      else if (pol === "both" && m !== p) candidates.push(m);
    }
    if (!candidates.length) return null;
    return candidates[(Math.random() * candidates.length) | 0] | 0;
  };

  // Portal / Mexico portal pairs never roll Twin (5) as badge or YY pair.
  window.slot_portal_pair_ban = [5];
  window.slot_is_portal_pair_fruit = function slot_is_portal_pair_fruit(fruit) {
    return !!(fruit && fruit.__slotPortal);
  };

  window.slot_mexico_mid_y = function slot_mexico_mid_y(game) {
    if (typeof window.mexico_mid_y === "function") {
      try {
        return window.mexico_mid_y(game && game.Ca) | 0;
      } catch (_e) {}
    }
    const g = game || window.__remixGame;
    const walls = g && g.Ca && g.Ca.wa;
    const h = walls && walls.length ? walls.length : 0;
    return Math.floor((h | 0) / 2);
  };

  window.slot_fruit_on_mid = function slot_fruit_on_mid(fruit, game) {
    if (!fruit || !fruit.pos || fruit.pos.y == null) return false;
    const g = game || window.__remixGame;
    return (fruit.pos.y | 0) === (window.slot_mexico_mid_y(g) | 0);
  };

  // True while Slot Mexico mid border is up, or when placing Mexico's pair.
  window.slot_mexico_blocks_mid_fruit = function slot_mexico_blocks_mid_fruit() {
    return !!window.__slotMexicoMidUp;
  };

  window.slot_trophy_url_for_mode = function slot_trophy_url_for_mode(mode) {
    const m = mode | 0;
    if (m === 23 && window.CANDY_ICON) return window.CANDY_ICON;
    if (
      (m === 24 || (window.CHESS_MODE != null && m === (window.CHESS_MODE | 0))) &&
      window.CHESS_ICON
    ) {
      return window.CHESS_ICON;
    }
    if (m === 25 && window.BURGER_ICON) return window.BURGER_ICON;
    if (m === 26 && window.CAT_ICON) return window.CAT_ICON;
    if (m === 27 && window.MEXICO_ICON) return window.MEXICO_ICON;
    if (m === 28 && window.BOMB_FRUIT_ICON) return window.BOMB_FRUIT_ICON;
    // Prefer live #trophy src (index === mode id, including Dimension at 11).
    try {
      const root = document.querySelector("#trophy");
      const el = root && root.children[m];
      const src = el && (el.getAttribute("src") || el.src);
      if (src) return src;
    } catch (_e) {}
    // Native modes 0–21: v22 trophy_XX matches mode id (Dimension = 11).
    if (m >= 0 && m <= 21) {
      const id = m < 10 ? "0" + m : String(m);
      return (
        "https://www.google.com/logos/fnbx/snake_arcade/v22/trophy_" + id + ".png"
      );
    }
    return window.SLOT_MACHINE_ICON;
  };

  window.assignSlotMode = function assignSlotMode(fruit, sharedMode) {
    if (!fruit || fruit.Oka) return null;
    if (fruit.isPiece) return null;
    const portalPair = window.slot_is_portal_pair_fruit(fruit);
    const portalBan = portalPair ? window.slot_portal_pair_ban || [5] : [];
    let mode =
      sharedMode != null ? sharedMode | 0 : window.slot_draw_mode() | 0;
    // Portal / Mexico pairs: Twin badge cannot land on either twin.
    if (portalPair && (mode | 0) === 5) {
      mode = window.slot_draw_mode_excluding(portalBan) | 0;
      if ((mode | 0) === 5) mode = 1;
    }
    // Mexico is never assigned to mid-row fruit (start layout / any assign).
    if (
      mode === 27 &&
      window.slot_fruit_on_mid(fruit, window.__remixGame)
    ) {
      const ban = portalPair ? [27, 5] : [27];
      mode = window.slot_draw_mode_excluding(ban) | 0;
      if (mode === 27 || (portalPair && (mode | 0) === 5)) {
        const pool = (window.slot_enabled_pool
          ? window.slot_enabled_pool()
          : (window.SLOT_MACHINE_POOL || []).slice()
        ).filter(function (m) {
          const v = m | 0;
          if (v === 27) return false;
          if (portalPair && v === 5) return false;
          return true;
        });
        mode = pool.length
          ? pool[(Math.random() * pool.length) | 0] | 0
          : 1;
      }
    }
    fruit.slotMode = mode;
    // YY pair also cannot be Twin on portal pairs (swap would put Twin on them).
    const yyPair = window.slot_roll_yy_pair(
      mode,
      portalPair ? portalBan : null
    );
    if (yyPair != null) fruit.__slotYinYangPair = yyPair | 0;
    else delete fruit.__slotYinYangPair;
    // Only while Shield is the active roll do new spawns get P3E bars
    // (the refill from a Shield-badge eat). Leaving Shield must not strip
    // already-marked leftovers — only bare new fruit stay unshielded.
    if ((window.__slotActive | 0) === 15) {
      try {
        window.slot_apply_shield(
          fruit,
          window.__remixGame && window.__remixGame.wa
        );
      } catch (_e) {}
    } else if (!fruit.__slotShield) {
      fruit.nba = undefined;
      fruit.__slotShield = false;
      fruit.__ultraKeepShield = false;
    }
    return mode;
  };

  // Relocate a portal pair onto strict top + bottom halves (never mid row).
  // Used when Mexico is the shared badge so neither twin sits on mid-y.
  window.slot_mexico_relocate_pair_halves = function slot_mexico_relocate_pair_halves(
    a,
    b,
    mgr
  ) {
    if (!a || !b || !mgr) return false;
    const g = window.__remixGame || (mgr && mgr.wb);
    const occ = new Set();
    const list = mgr.ka || [];
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || !f.pos || f === a || f === b) continue;
      occ.add((f.pos.x | 0) + "," + (f.pos.y | 0));
    }
    try {
      const body = g && g.oa && g.oa.ka;
      if (body && body.length) {
        for (let i = 0; i < body.length; i++) {
          const seg = body[i];
          if (!seg) continue;
          const sx = seg.x != null ? seg.x | 0 : seg.pos ? seg.pos.x | 0 : NaN;
          const sy = seg.y != null ? seg.y | 0 : seg.pos ? seg.pos.y | 0 : NaN;
          if (sx === sx && sy === sy) occ.add(sx + "," + sy);
        }
      }
    } catch (_sb) {}
    const top = window.slot_mexico_find_half_pos(mgr, "top", occ);
    if (!top) return false;
    occ.add((top.x | 0) + "," + (top.y | 0));
    const bot = window.slot_mexico_find_half_pos(mgr, "bottom", occ);
    if (!bot) return false;
    try {
      a.pos.x = top.x | 0;
      a.pos.y = top.y | 0;
      b.pos.x = bot.x | 0;
      b.pos.y = bot.y | 0;
      if (window.slot_clear_arrow_at) {
        window.slot_clear_arrow_at(g, a.pos.x, a.pos.y);
        window.slot_clear_arrow_at(g, b.pos.x, b.pos.y);
      }
    } catch (_e) {
      return false;
    }
    return true;
  };

  window.slot_assign_pair = function slot_assign_pair(a, b) {
    // Portal pairs never roll Twin (5).
    let mode = window.slot_draw_mode_excluding([5]) | 0;
    if ((mode | 0) === 5) mode = 1;
    const g = window.__remixGame;
    const mgr = (g && g.wa) || null;
    // Mexico badge portal pairs: neither twin may sit on the middle row.
    // Always pin them to opposite halves; if that fails and either is on mid,
    // re-roll away from Mexico (still never Twin).
    if (mode === 27 && a && b) {
      const ok =
        window.slot_mexico_relocate_pair_halves &&
        window.slot_mexico_relocate_pair_halves(a, b, mgr);
      if (
        !ok &&
        (window.slot_fruit_on_mid(a, g) || window.slot_fruit_on_mid(b, g))
      ) {
        mode = window.slot_draw_mode_excluding([27, 5]) | 0;
        if ((mode | 0) === 5 || (mode | 0) === 27) mode = 1;
      }
    }
    const pairId = (window.__slotPortalPairSeq =
      (window.__slotPortalPairSeq | 0) + 1);
    if (a) {
      a.__slotPortal = true;
      a.__slotPortalPairId = pairId;
      a.__slotPortalTwin = b || null;
      window.assignSlotMode(a, mode);
    }
    if (b) {
      b.__slotPortal = true;
      b.__slotPortalPairId = pairId;
      b.__slotPortalTwin = a || null;
      window.assignSlotMode(b, mode);
    }
    // Keep yin-yang pairs matched on portal twins.
    if (a && b) {
      if (a.__slotYinYangPair != null) b.__slotYinYangPair = a.__slotYinYangPair;
      else delete b.__slotYinYangPair;
    }
    // Portal pairs share one fruit type (native R3E); type is finalized by
    // slot_ensure_unique_fruit_types against the full board.
    return mode;
  };

  // Resolve portal exit index without assuming even/odd adjacency. Leftover
  // non-portal fruit must NEVER be treated as a twin — only marked pairs.
  window.slot_portal_twin_index = function slot_portal_twin_index(mgr, index) {
    const list = mgr && mgr.ka;
    if (!list || index == null) return -1;
    const i = index | 0;
    if (i < 0 || i >= list.length) return -1;
    const eaten = list[i];
    if (!eaten || !eaten.__slotPortal) return -1;
    if (eaten.__slotPortalTwin) {
      const ti = list.indexOf(eaten.__slotPortalTwin);
      if (ti >= 0 && ti !== i) return ti;
    }
    if (eaten.__slotPortalPairId != null) {
      const id = eaten.__slotPortalPairId;
      for (let j = 0; j < list.length; j++) {
        if (j === i) continue;
        const f = list[j];
        if (f && f.__slotPortal && f.__slotPortalPairId === id) return j;
      }
    }
    for (let j = 0; j < list.length; j++) {
      if (j === i) continue;
      const f = list[j];
      if (
        f &&
        f.__slotPortal &&
        f.type != null &&
        eaten.type != null &&
        (f.type | 0) === (eaten.type | 0)
      ) {
        return j;
      }
    }
    return -1;
  };

  window.slot_pick_unique_type = function slot_pick_unique_type(mgr, used) {
    const taken = used || new Set();
    try {
      if (typeof window.__aaF === "function" && mgr) {
        const t = window.__aaF(mgr) | 0;
        if (!taken.has(t)) return t;
      }
    } catch (_aa) {}
    try {
      const pick =
        window.__bombFruitPickType ||
        window.__chessPickType ||
        window.__slotQ3E ||
        (typeof Q3E === "function" ? Q3E : null);
      if (typeof pick === "function" && mgr) {
        for (let n = 0; n < 8; n++) {
          const t = pick(mgr) | 0;
          if (!taken.has(t)) return t;
        }
      }
    } catch (_q) {}
    const pool = [];
    for (let i = 0; i < 24; i++) {
      if (!taken.has(i)) pool.push(i);
    }
    if (!pool.length) return Math.floor(Math.random() * 24) | 0;
    return pool[Math.floor(Math.random() * pool.length) | 0];
  };

  // Portal pairs share one type. Never rewrite types of fruit already on the
  // board — only assign/fix portal pairs (and fill null types on new fruit).
  window.slot_ensure_unique_fruit_types = function slot_ensure_unique_fruit_types(
    mgr
  ) {
    const list = mgr && mgr.ka;
    if (!list || !list.length) return;
    const used = new Set();
    const seenPairs = Object.create(null);

    // Reserve types already owned by non-portal fruit so a new portal/Mexico
    // pair cannot steal them (and force those fruits to change).
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || f.Oka || f.isPiece || f.__slotPortal) continue;
      if (f.type != null) used.add(f.type | 0);
    }

    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || f.Oka || f.isPiece || !f.__slotPortal) continue;
      const id = f.__slotPortalPairId;
      if (id == null || seenPairs[id]) continue;
      seenPairs[id] = true;
      let twin = f.__slotPortalTwin;
      if (!twin || list.indexOf(twin) < 0) {
        twin = null;
        for (let j = 0; j < list.length; j++) {
          if (j === i) continue;
          const o = list[j];
          if (o && o.__slotPortal && o.__slotPortalPairId === id) {
            twin = o;
            break;
          }
        }
      }
      if (twin) {
        f.__slotPortalTwin = twin;
        twin.__slotPortalTwin = f;
      }
      const shared = f.type | 0;
      if (
        f.type != null &&
        twin &&
        (twin.type | 0) === shared &&
        !used.has(shared)
      ) {
        used.add(shared);
        continue;
      }
      const type = window.slot_pick_unique_type(mgr, used);
      used.add(type);
      f.type = type;
      if (twin) twin.type = type;
    }

    // Non-portal: only fill missing types. Never retag fruit that already has one.
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || f.Oka || f.isPiece) continue;
      if (f.__slotPortal) continue;
      if (f.type == null) {
        const type = window.slot_pick_unique_type(mgr, used);
        used.add(type);
        f.type = type;
      } else {
        used.add(f.type | 0);
      }
    }
  };

  // After teleport, native portal j4E would clear both ends — Slot Machine skips
  // that path (e=!1). Note the exit twin here; splice it after eaten is removed
  // so the eat-loop index `k` stays valid (same pattern as Chess+Portal).
  window.slot_note_portal_twin = function slot_note_portal_twin(mgr, eaten) {
    window.__slotPortalTwinToRemove = null;
    if (!mgr || !mgr.ka || !eaten || !eaten.__slotPortal) return false;
    const list = mgr.ka;
    const idx = list.indexOf(eaten);
    let twin = null;
    if (idx >= 0 && typeof window.slot_portal_twin_index === "function") {
      const ti = window.slot_portal_twin_index(mgr, idx);
      if (ti >= 0 && ti < list.length) twin = list[ti];
    }
    if (!twin) {
      twin = eaten.__slotPortalTwin;
      if (twin && list.indexOf(twin) < 0) twin = null;
      if (!twin && eaten.__slotPortalPairId != null) {
        const id = eaten.__slotPortalPairId;
        for (let i = 0; i < list.length; i++) {
          const f = list[i];
          if (f && f !== eaten && f.__slotPortal && f.__slotPortalPairId === id) {
            twin = f;
            break;
          }
        }
      }
    }
    if (!twin || twin === eaten) return false;
    window.__slotPortalTwinToRemove = twin;
    return true;
  };

  window.slot_flush_portal_twin = function slot_flush_portal_twin(mgr) {
    const twin = window.__slotPortalTwinToRemove;
    window.__slotPortalTwinToRemove = null;
    if (!twin || !mgr || !mgr.ka) return;
    const i = mgr.ka.indexOf(twin);
    if (i < 0) return;
    mgr.ka.splice(i, 1);
    try {
      delete twin.__slotPortalTwin;
      delete twin.__slotPortal;
    } catch (_e) {}
    window.appleArray = mgr.ka;
  };

  window.slot_clear_poison_badges = function slot_clear_poison_badges(mgr) {
    const list = mgr && mgr.ka;
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (f && f.Oka && f.slotMode != null) delete f.slotMode;
    }
  };

  // Chess pieces never carry Burger timers under Slot Machine.
  window.slot_strip_burger_from_pieces = function slot_strip_burger_from_pieces(
    mgr
  ) {
    const list = mgr && mgr.ka;
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || !f.isPiece) continue;
      f.burgerTimer = null;
      f.burgerTimerMax = null;
      f.burgerGrey = 0;
    }
  };

  // Leaving Burger roll: stop greying/expiring fresh fruit, but keep poison
  // countdowns so Burger skulls still despawn on schedule.
  window.slot_freeze_burger_fresh_timers = function slot_freeze_burger_fresh_timers(
    mgr
  ) {
    const list = mgr && mgr.ka;
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || f.isPiece || f.Oka) continue;
      f.burgerTimer = null;
      f.burgerTimerMax = null;
      f.burgerGrey = 0;
    }
  };

  window.slot_has_burger_poison_timers = function slot_has_burger_poison_timers(
    mgr
  ) {
    const list =
      (mgr && mgr.ka) ||
      (window.__remixGame &&
        window.__remixGame.wa &&
        window.__remixGame.wa.ka) ||
      [];
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (f && f.Oka && !f.isPiece && f.burgerTimer != null) return true;
    }
    return false;
  };

  // After Burger roll ends: keep ticking Burger poisons until they despawn.
  window.slot_burger_leftover_tick = function slot_burger_leftover_tick(game) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if ((window.__slotActive | 0) === 25) return; // live Burger tick owns it
    const g = game || window.__remixGame;
    if (!g || !g.wa || !g.wa.ka) return;
    if (typeof window.burger_ended === "function" && window.burger_ended(g)) {
      return;
    }
    const apples = g.wa.ka;
    const toDespawn = [];
    for (let i = 0; i < apples.length; i++) {
      const a = apples[i];
      if (!a || a.isPiece || !a.Oka) continue;
      if (a.burgerTimer == null) continue;
      if (
        typeof window.burger_apple_timer_eligible === "function" &&
        !window.burger_apple_timer_eligible(g, a)
      ) {
        continue;
      }
      if ((a.burgerTimer | 0) <= 0) {
        a.burgerTimer = 0;
        toDespawn.push(a);
        continue;
      }
      a.burgerTimer = (a.burgerTimer | 0) - 1;
      if (a.burgerTimer <= 0) {
        a.burgerTimer = 0;
        toDespawn.push(a);
      }
    }
    for (let i = 0; i < toDespawn.length; i++) {
      const a = toDespawn[i];
      if (apples.indexOf(a) < 0) continue;
      if (typeof window.burger_despawn_poison === "function") {
        window.burger_despawn_poison(g, a);
      } else {
        const ix = apples.indexOf(a);
        if (ix >= 0) apples.splice(ix, 1);
      }
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

  // Native y4E: cell is blocked unless wa value is 0 or 3.
  window.slot_pos_in_wall = function slot_pos_in_wall(game, x, y) {
    const g = game || window.__remixGame;
    const wm = g && g.Ca;
    if (!wm || !Array.isArray(wm.wa) || !wm.wa.length) return false;
    const xi = x | 0;
    const yi = y | 0;
    try {
      if (typeof y4E === "function") {
        return !!y4E(wm, { x: xi, y: yi });
      }
    } catch (_y) {}
    const row = wm.wa[yi];
    if (!row || xi < 0 || xi >= row.length) return false;
    const v = row[xi] | 0;
    return v !== 0 && v !== 3;
  };

  window.slot_add_wall_keys = function slot_add_wall_keys(game, keys) {
    const set = keys || new Set();
    const g = game || window.__remixGame;
    const walls = g && g.Ca && g.Ca.wa;
    if (!walls || !walls.length) return set;
    for (let y = 0; y < walls.length; y++) {
      const row = walls[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        const v = row[x] | 0;
        if (v !== 0 && v !== 3) set.add(x + "," + y);
      }
    }
    return set;
  };

  window.slot_add_bridge_keys = function slot_add_bridge_keys(game, keys) {
    const set = keys || new Set();
    const g = game || window.__remixGame;
    const grid = g && g.Ga && g.Ga.oa;
    if (!grid || !grid.length) return set;
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        if (row[x]) set.add(x + "," + y);
      }
    }
    return set;
  };

  // Statue cells live on game.Ya.oa (Map). Leftovers must keep e7(13) so apple
  // eats still crack/crumble them; new body-plants stay gated by disableStatue.
  window.slot_has_statues = function slot_has_statues(game) {
    const g = game || window.__remixGame;
    const ya = g && g.Ya;
    if (!ya || !ya.oa) return false;
    try {
      if (typeof ya.oa.size === "number") return ya.oa.size > 0;
      for (const _ of ya.oa.keys()) return true;
    } catch (_e) {}
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

  // Chess piece sprite type ids (injected by ChessInit into new_fruit).
  window.slot_is_chess_piece_type = function slot_is_chess_piece_type(type) {
    if (type == null) return false;
    const t = type | 0;
    const ids = [
      window.bbishop,
      window.bking,
      window.bknight,
      window.bpawn,
      window.bqueen,
      window.brook,
      window.wbishop,
      window.wking,
      window.wknight,
      window.wpawn,
      window.wqueen,
      window.wrook,
    ];
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] != null && (ids[i] | 0) === t) return true;
    }
    return false;
  };

  // Unlock / sanitize: drop piece identity and piece sprites from a fruit.
  window.slot_demote_chess_piece_to_fruit = function slot_demote_chess_piece_to_fruit(
    el,
    mgr
  ) {
    if (!el) return;
    el.isPiece = false;
    delete el.ChessPiece;
    delete el.ChessColor;
    if (!window.slot_is_chess_piece_type(el.type)) return;
    const game = window.__remixGame;
    const appleMgr = mgr || (game && game.wa);
    try {
      const pick =
        window.__bombFruitPickType ||
        window.__chessPickType ||
        (typeof Q3E === "function" ? Q3E : null);
      if (typeof pick === "function" && appleMgr) {
        for (let n = 0; n < 12; n++) {
          const t = pick(appleMgr);
          if (!window.slot_is_chess_piece_type(t)) {
            el.type = t;
            return;
          }
        }
      }
    } catch (_e) {}
    el.type = 0;
  };

  // Keep piece vs fruit identity unambiguous under Slot leftovers.
  window.slot_sanitize_chess_identity = function slot_sanitize_chess_identity(
    mgr
  ) {
    const list =
      (mgr && mgr.ka) ||
      window.appleArray ||
      (window.__remixGame &&
        window.__remixGame.wa &&
        window.__remixGame.wa.ka) ||
      [];
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || f.Oka) continue;
      if (f.isPiece) {
        // True pieces never carry fruit-only Slot state / badges.
        delete f.slotMode;
        delete f.__slotPortal;
        delete f.__slotPortalPairId;
        delete f.__slotPortalTwin;
        delete f.__slotBombPlant;
        delete f.__slotPoison;
        delete f.__slotFromChessUnlock;
        delete f.__slotNbaPrior;
        delete f.__slotNbaPriorSaved;
        f.__slotShield = false;
        f.__ultraKeepShield = false;
        f.burgerTimer = null;
        f.burgerTimerMax = null;
        f.burgerGrey = 0;
        // Incomplete piece flags → treat as fruit (avoids phantom pickups).
        if (!f.ChessPiece || !f.ChessColor) {
          window.slot_demote_chess_piece_to_fruit(f, mgr);
        }
        continue;
      }
      // Fruit must not keep piece identity or piece sprites after unlock.
      if (
        f.ChessPiece != null ||
        f.ChessColor != null ||
        window.slot_is_chess_piece_type(f.type)
      ) {
        window.slot_demote_chess_piece_to_fruit(f, mgr);
      }
    }
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
    window.slot_snap_fruit_tiles(mgr);
  };

  window.slot_pos_on_bridge = function slot_pos_on_bridge(game, x, y) {
    const g = game || window.__remixGame;
    const grid = g && g.Ga && g.Ga.oa;
    if (!grid || !grid.length) return false;
    const xi = x | 0;
    const yi = y | 0;
    return !!(grid[yi] && grid[yi][xi]);
  };

  // Move any fruit/chess piece sitting on a bridge tile to a free non-bridge
  // cell. Never relocate onto another bridge. If no safe cell exists, remove
  // the piece — that can empty the board and trigger a Slot win.
  window.slot_relocate_fruit_off_bridges = function slot_relocate_fruit_off_bridges(
    mgr,
    game
  ) {
    const list = mgr && mgr.ka;
    if (!list || !list.length) return;
    const g = game || window.__remixGame || (mgr && mgr.wb);
    if (!window.slot_has_bridges || !window.slot_has_bridges(g)) return;
    let removed = false;
    for (let i = list.length - 1; i >= 0; i--) {
      const f = list[i];
      if (!f || !f.pos) continue;
      if (!window.slot_pos_on_bridge(g, f.pos.x, f.pos.y)) continue;
      let moved = false;
      try {
        const oldKey = (f.pos.x | 0) + "," + (f.pos.y | 0);
        for (let attempt = 0; attempt < 48; attempt++) {
          const p =
            typeof window.slot_free_pos === "function"
              ? window.slot_free_pos(mgr)
              : null;
          if (!p || p.x == null || p.y == null) continue;
          const key = (p.x | 0) + "," + (p.y | 0);
          if (key === oldKey) continue;
          // slot_free_pos already rejects bridges; re-check so relocate never
          // parks on a bridge even if free_pos is stubbed/overridden.
          if (window.slot_pos_on_bridge(g, p.x, p.y)) continue;
          if (typeof f.pos.clone === "function" && p.clone) {
            f.pos = p.clone();
          } else {
            f.pos.x = p.x | 0;
            f.pos.y = p.y | 0;
          }
          try {
            window.slot_clear_arrow_at &&
              window.slot_clear_arrow_at(g, f.pos.x, f.pos.y);
          } catch (_ar) {}
          moved = true;
          break;
        }
      } catch (_br) {}
      if (!moved) {
        try {
          list.splice(i, 1);
          removed = true;
        } catch (_rm) {}
      }
    }
    if (removed) {
      try {
        window.slot_win_if_empty && window.slot_win_if_empty(g);
      } catch (_w) {}
    }
  };

  // Winged (6) and Magnet (18) both drive fractional pos via d7(). After either
  // roll ends, eat uses exact tile equals — snap or the snake passes through.
  // Never leave fruit parked on a bridge tile after the snap.
  window.slot_snap_fruit_tiles = function slot_snap_fruit_tiles(mgr) {
    const list = mgr && mgr.ka;
    if (!list) return;
    const game = window.__remixGame || (mgr && mgr.wb);
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || !f.pos) continue;
      const x = Number(f.pos.x);
      const y = Number(f.pos.y);
      if (Number.isFinite(x)) f.pos.x = Math.round(x);
      if (Number.isFinite(y)) f.pos.y = Math.round(y);
      try {
        if (f.He) {
          f.He.x = 0;
          f.He.y = 0;
        } else {
          f.He = window.slot_vec ? window.slot_vec(0, 0) : { x: 0, y: 0 };
        }
      } catch (_h) {
        try {
          f.He = window.slot_vec ? window.slot_vec(0, 0) : { x: 0, y: 0 };
        } catch (_h2) {}
      }
      try {
        if (f.CAb) {
          f.CAb.x = 0;
          f.CAb.y = 0;
        } else {
          f.CAb = window.slot_vec ? window.slot_vec(0, 0) : { x: 0, y: 0 };
        }
      } catch (_c) {}
      try {
        if (f.iL) {
          f.iL.x = 0;
          f.iL.y = 0;
        } else {
          // Zeroed after leave; next winged/magnet enter re-enables via ensure.
          f.iL = window.slot_vec ? window.slot_vec(0, 0) : { x: 0, y: 0 };
        }
      } catch (_i) {}
    }
    // Magnet/winged can round onto a bridge; fruit must not stay parked there.
    window.slot_relocate_fruit_off_bridges(mgr, game);
    try {
      window.slot_clear_arrows_under_fruit &&
        window.slot_clear_arrows_under_fruit(mgr, game);
    } catch (_ar) {}
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

  // --- Yin Yang: paired polarity flip + snake colors ---
  // Native: h3E[i] = [body, shade]; i3E[i] = partner index.
  // Live snake color = settings.wa (menu writes Jb/Ja; start copies → wa).
  // settings.oa / Mb / Qb are BOARD THEME (c7/s3E) — never touch those.
  window.__slotYyBaseColorPairs = [
    5, 4, 7, 7, 1, 2, 0, 3, 9, 8, 0, 14, 15, 15, 11, 12, 17, 16,
  ];

  // Never treat these settings fields as the snake color index.
  window.__slotYyColorFieldSkip = {
    // Board theme (was wrongly used before).
    oa: 1,
    Mb: 1,
    Qb: 1,
    qc: 1,
    // Speed / size / count / mode / graphics.
    ka: 1,
    Ca: 1,
    Sa: 1,
    Aa: 1,
    ub: 1,
    ob: 1,
    Ba: 1,
    Ma: 1,
    Fb: 1,
    kc: 1,
  };

  window.slot_yy_color_field = function slot_yy_color_field(settings) {
    if (!settings) return null;
    // Live in-game color index.
    if (typeof settings.wa === "number") {
      window.__slotYyColorField = "wa";
      return "wa";
    }
    if (typeof settings.Ja === "number") {
      window.__slotYyColorField = "Ja";
      return "Ja";
    }
    if (typeof settings.Jb === "number") {
      window.__slotYyColorField = "Jb";
      return "Jb";
    }
    return null;
  };

  window.slot_yy_read_color_index = function slot_yy_read_color_index(settings) {
    if (!settings) {
      return window.__slotYyColorIndex != null
        ? window.__slotYyColorIndex | 0
        : 0;
    }
    if (typeof settings.wa === "number") return settings.wa | 0;
    if (typeof settings.Ja === "number") return settings.Ja | 0;
    if (typeof settings.Jb === "number") return settings.Jb | 0;
    return window.__slotYyColorIndex != null
      ? window.__slotYyColorIndex | 0
      : 0;
  };

  window.slot_yy_pair_color_index = function slot_yy_pair_color_index(idx) {
    const i = idx | 0;
    const map = window.__slotYyColorPairs || window.__slotYyBaseColorPairs;
    if (map && map[i] != null) return map[i] | 0;
    return i;
  };

  // Resolve [body, shade] from the snake color table (h3E), not board theme.
  window.slot_yy_gradient_for_index = function slot_yy_gradient_for_index(
    game,
    colorIndex,
    opts
  ) {
    const o = opts || {};
    const idx = colorIndex | 0;
    if (o.isRainbow && window.rainbowAlts) {
      const alt =
        window.rainbowAlts[
          o.snakeRainbowOverride != null
            ? o.snakeRainbowOverride | 0
            : window.snakeRainbowOverride | 0
        ];
      if (alt && alt.set && alt.set.length) {
        return [alt.set[0], alt.set[1] || alt.set[0]];
      }
    }
    const table = window.__slotSnakeColorTable;
    try {
      if (table && table[idx]) {
        const c0 = table[idx][0];
        const c1 = table[idx][1] || c0;
        if (c0) return [c0, c1 || c0];
      }
    } catch (_t) {}
    return null;
  };

  window.slot_yy_restore_snake_colors = function slot_yy_restore_snake_colors(
    game
  ) {
    const g = game || window.__remixGame;
    const base = window.__slotYyColorBase;
    if (!base) {
      window.__slotYyColorFlipped = false;
      return;
    }
    window.__slotYyColorFlipped = false;
    window.slot_yy_apply_snake_color_index(g, base.color, {
      isRainbow: base.isRainbow,
      snakeRainbowOverride: base.snakeRainbowOverride,
      randomColor: base.randomColor,
      prevGradient: base.prevGradient || null,
    });
    window.__slotYyColorBase = null;
  };

  // Apply partner snake color: settings.wa (+ Ja/Jb) + Sc/Yc + face sprites.
  window.slot_yy_apply_snake_color_index = function slot_yy_apply_snake_color_index(
    game,
    colorIndex,
    opts
  ) {
    const g = game || window.__remixGame;
    const s = g && g.settings;
    const o = opts || {};
    if (o.randomColor != null) window.randomColor = !!o.randomColor;

    const prev =
      o.prevGradient ||
      window.slot_yy_gradient_for_index(g, window.__slotYyColorIndex | 0, {
        isRainbow: !!window.isRainbow,
        snakeRainbowOverride: window.snakeRainbowOverride | 0,
      });

    if (o.isRainbow) {
      window.isRainbow = true;
      if (o.snakeRainbowOverride != null) {
        window.snakeRainbowOverride = o.snakeRainbowOverride | 0;
      }
    } else {
      window.isRainbow = false;
    }

    const idx = colorIndex | 0;
    window.__slotYyColorIndex = idx;

    // Sync all three snake-color fields. Never touch theme (oa/Mb/Qb).
    if (s) {
      try {
        if (typeof s.wa === "number") s.wa = idx;
        if (typeof s.Ja === "number") s.Ja = idx;
        if (typeof s.Jb === "number") s.Jb = idx;
        if (typeof s.kc === "number") s.kc = idx;
      } catch (_e) {}
    }

    const grad = window.slot_yy_gradient_for_index(g, idx, {
      isRainbow: !!o.isRainbow,
      snakeRainbowOverride: o.snakeRainbowOverride,
    });
    if (!grad) return;
    window.slot_yy_paint_snake_hex(
      g,
      grad[0],
      grad[1] || grad[0],
      prev && prev[0],
      prev && prev[1]
    );
  };

  // True face atlas (P5E): blink/eat/die/tongue are b7 sprites with .render.
  // game.Ga is bridges — must never be treated as the face.
  window.slot_yy_is_face_atlas = function slot_yy_is_face_atlas(face) {
    if (!face || typeof face !== "object") return false;
    const blink = face.oa;
    if (!blink || typeof blink.render !== "function") return false;
    if (!face.Aa || typeof face.Aa.render !== "function") return false;
    return true;
  };

  window.slot_yy_resolve_face = function slot_yy_resolve_face(game) {
    const candidates = [
      window.__slotFaceRef,
      window.__animFaceRef,
      // Renderer sometimes stashed on game by AnimationMod / Ultra.
      game && game.__slotRenderer && game.__slotRenderer.Ga,
    ];
    for (let i = 0; i < candidates.length; i++) {
      if (window.slot_yy_is_face_atlas(candidates[i])) return candidates[i];
    }
    return null;
  };

  // Recolor eyes / blink / eat / tongue via native a7 (C3E reset + tint).
  window.slot_yy_recolor_face = function slot_yy_recolor_face(game, primary) {
    if (!primary) return;
    const g = game || window.__remixGame;
    const face = window.slot_yy_resolve_face(g);
    if (!face) return;

    const a7 = window.__slotA7;
    // Prefer direct a7 so Remix (no AnimationMod) still tints. AnimationMod
    // path is a fallback when a7 was not captured yet.
    if (typeof a7 === "function") {
      try {
        window.__animLastHeadHex = null;
        if (face.oa) a7(face.oa, "#5282F2", primary);
        if (face.Aa) a7(face.Aa, "#5282F2", primary);
        if (face.Ba) a7(face.Ba, "#5282F2", primary);
        // Twin-snake face sheets (native YY); harmless if unused in Slot.
        if (face.Ga && typeof face.Ga.render === "function") {
          a7(face.Ga, "#5282F2", primary);
        }
        if (face.Ma && typeof face.Ma.render === "function") {
          a7(face.Ma, "#5282F2", primary);
        }
        if (face.Ka && typeof face.Ka.render === "function") {
          a7(face.Ka, "#5282F2", primary);
        }
        if (typeof _ !== "undefined" && _.AKd && _.HG && _.yKd) {
          const hue = _.AKd(primary);
          const tongue = _.AKd("#C73104");
          tongue[0] = (hue[0] + 180) % 360;
          const tongueHex = _.HG(
            _.yKd(tongue[0], tongue[1], tongue[2])
          );
          if (face.wa) a7(face.wa, "#C73104", tongueHex);
          if (face.Oa && typeof face.Oa.render === "function") {
            a7(face.Oa, "#C73104", tongueHex);
          }
        }
        return;
      } catch (_face) {}
    }

    try {
      window.__animLastHeadHex = null;
      if (typeof window.updateAnimHeadColour === "function") {
        window.updateAnimHeadColour(face, primary);
      }
    } catch (_anim) {}
  };

  // Set live body/shade hex (Sc/Yc) and recolor the head atlas.
  window.slot_yy_paint_snake_hex = function slot_yy_paint_snake_hex(
    game,
    primary,
    secondary,
    prevPrimary,
    prevSecondary
  ) {
    const g = game || window.__remixGame;
    if (!g || !primary) return;
    const shade = secondary || primary;
    const op = prevPrimary ? (prevPrimary + "").toUpperCase() : null;
    const os = prevSecondary ? (prevSecondary + "").toUpperCase() : null;

    const snake = g.oa;
    if (snake) {
      try {
        // Canonical gradient slots used by the renderer.
        if (typeof snake.Sc === "string") snake.Sc = primary;
        if (typeof snake.Yc === "string") snake.Yc = shade;
      } catch (_sc) {}

      // Remap any other cached hex that still holds the previous gradient.
      try {
        for (const k of Object.keys(snake)) {
          const v = snake[k];
          if (typeof v !== "string" || !/^#[0-9A-Fa-f]{6}$/i.test(v)) continue;
          if (k === "Sc" || k === "Yc") continue;
          const u = v.toUpperCase();
          if (op && u === op) snake[k] = primary;
          else if (os && u === os) snake[k] = shade;
        }
      } catch (_p) {}
    }

    window.slot_yy_recolor_face(g, primary);
  };

  window.slot_flip_yy_snake_colors = function slot_flip_yy_snake_colors(game) {
    const g = game || window.__remixGame;
    const s = g && g.settings;
    if (!window.__slotYyColorBase) {
      const cur = window.slot_yy_read_color_index(s);
      window.__slotYyColorBase = {
        field: "wa",
        color: cur,
        isRainbow: !!window.isRainbow,
        snakeRainbowOverride: window.snakeRainbowOverride | 0,
        randomColor: !!window.randomColor,
        prevGradient: window.slot_yy_gradient_for_index(g, cur, {
          isRainbow: !!window.isRainbow,
          snakeRainbowOverride: window.snakeRainbowOverride | 0,
        }),
      };
      window.__slotYyColorFlipped = false;
    }
    const base = window.__slotYyColorBase;
    window.__slotYyColorFlipped = !window.__slotYyColorFlipped;
    if (!window.__slotYyColorFlipped) {
      window.slot_yy_apply_snake_color_index(g, base.color, {
        isRainbow: base.isRainbow,
        snakeRainbowOverride: base.snakeRainbowOverride,
        randomColor: base.randomColor,
        prevGradient: window.slot_yy_gradient_for_index(
          g,
          window.__slotYyColorIndex | 0,
          {
            isRainbow: !!window.isRainbow,
            snakeRainbowOverride: window.snakeRainbowOverride | 0,
          }
        ),
      });
      return;
    }
    if (base.isRainbow && window.rainbowAlts) {
      const cur = base.snakeRainbowOverride | 0;
      const alt = window.rainbowAlts[cur];
      const partner =
        alt && alt.yinyang != null ? alt.yinyang | 0 : cur;
      window.slot_yy_apply_snake_color_index(g, partner, {
        isRainbow: true,
        snakeRainbowOverride: partner,
        randomColor: false,
        prevGradient: base.prevGradient,
      });
      return;
    }
    // Rainbow skin (wa===10) without pudding override: pair via i3E[10]→0.
    const partner = window.slot_yy_pair_color_index(base.color | 0);
    window.slot_yy_apply_snake_color_index(g, partner, {
      isRainbow: false,
      randomColor: false,
      prevGradient: base.prevGradient,
    });
  };

  window.slot_yy_flip_chess_piece = function slot_yy_flip_chess_piece(f) {
    if (!f || !f.isPiece) return;
    const col = f.ChessColor === "b" ? "w" : "b";
    f.ChessColor = col;
    if (f.ChessPiece && window[col + f.ChessPiece] != null) {
      f.type = window[col + f.ChessPiece];
    }
  };

  window.slot_yy_swap_board = function slot_yy_swap_board(mgr) {
    const list = mgr && mgr.ka;
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || f.Oka) continue;
      if (f.isPiece) {
        window.slot_yy_flip_chess_piece(f);
        continue;
      }
      if (f.__slotYinYangPair == null || f.slotMode == null) continue;
      const cur = f.slotMode | 0;
      let pair = f.__slotYinYangPair | 0;
      const portalPair = !!(f.__slotPortal);
      // Never put Mexico onto a mid-row fruit via YY flip.
      // Portal pairs never flip onto Twin (5).
      const ban = [];
      if (
        pair === 27 &&
        window.slot_fruit_on_mid &&
        window.slot_fruit_on_mid(f, window.__remixGame)
      ) {
        ban.push(27);
      }
      if (portalPair && pair === 5) ban.push(5);
      if (ban.length) {
        ban.push(cur);
        const alt =
          window.slot_draw_mode_excluding &&
          window.slot_draw_mode_excluding(ban);
        if (alt == null || ban.indexOf(alt | 0) >= 0) continue;
        pair = alt | 0;
      }
      f.slotMode = pair;
      f.__slotYinYangPair = cur;
      // Burger timers: strip on flip (no carry across).
      f.burgerTimer = null;
      f.burgerTimerMax = null;
      // Bomb state unchanged.
    }
    // Portal pairs: force both twins to the same showing badge.
    const seen = Object.create(null);
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || !f.__slotPortal || f.slotMode == null) continue;
      const id = f.__slotPortalPairId;
      if (id == null || seen[id]) continue;
      seen[id] = 1;
      let twin = f.__slotPortalTwin;
      if (!twin || list.indexOf(twin) < 0) {
        twin = null;
        for (let j = 0; j < list.length; j++) {
          const o = list[j];
          if (
            o &&
            o !== f &&
            o.__slotPortal &&
            o.__slotPortalPairId === id
          ) {
            twin = o;
            break;
          }
        }
      }
      if (!twin) continue;
      twin.slotMode = f.slotMode;
      if (f.__slotYinYangPair != null) {
        twin.__slotYinYangPair = f.__slotYinYangPair;
      } else {
        delete twin.__slotYinYangPair;
      }
      // Portal pairs never keep Twin after YY sync.
      if ((f.slotMode | 0) === 5) {
        const alt =
          window.slot_draw_mode_excluding &&
          (window.slot_draw_mode_excluding([5]) | 0);
        if (alt != null && (alt | 0) !== 5) {
          f.slotMode = alt | 0;
          twin.slotMode = alt | 0;
        }
      }
      // Mexico must not remain on a mid-row twin after sync.
      if (
        (f.slotMode | 0) === 27 &&
        window.slot_fruit_on_mid &&
        (window.slot_fruit_on_mid(f, window.__remixGame) ||
          window.slot_fruit_on_mid(twin, window.__remixGame))
      ) {
        const moved =
          window.slot_mexico_relocate_pair_halves &&
          window.slot_mexico_relocate_pair_halves(
            f,
            twin,
            window.__remixGame && window.__remixGame.wa
          );
        if (
          !moved &&
          (window.slot_fruit_on_mid(f, window.__remixGame) ||
            window.slot_fruit_on_mid(twin, window.__remixGame))
        ) {
          const alt =
            window.slot_draw_mode_excluding &&
            (window.slot_draw_mode_excluding([27]) | 0);
          if (alt != null && (alt | 0) !== 27) {
            f.slotMode = alt | 0;
            twin.slotMode = alt | 0;
          }
        }
      }
    }
  };

  // --- Dimension: one-shot Cat life grant + immediate grace ---
  window.slot_dimension_activate_grace = function slot_dimension_activate_grace(
    game
  ) {
    const g = game || window.__remixGame;
    const max = window.CAT_MAX_LIVES | 9;
    if (window.cat_lives == null) window.cat_lives = 0;
    const before = window.cat_lives | 0;
    const atMax = before >= max;
    if (!atMax) {
      window.cat_lives = Math.min(max, before + 1);
    }
    const sh = (g && g.Sh) | 0;
    const grace = Math.ceil((sh + (window.CAT_GRACE_EXTRA | 3)) / 2);
    window.cat_peaceful_ticks = Math.max(
      window.cat_peaceful_ticks | 0,
      grace
    );
    // Below 9: spend the life just granted (net lives unchanged). At 9: free.
    if (!atMax) {
      window.cat_lives = Math.max(0, (window.cat_lives | 0) - 1);
    }
    try {
      window.cat_wrap_head_if_needed && window.cat_wrap_head_if_needed(g);
    } catch (_w) {}
    try {
      window.catEnsureLivesHud && window.catEnsureLivesHud();
      window.catUpdateLivesHud && window.catUpdateLivesHud();
    } catch (_h) {}
  };

  // --- Mexico: half portals + partial mid border ---
  window.slot_mexico_head_side = function slot_mexico_head_side(game) {
    const g = game || window.__remixGame;
    const mid = window.slot_mexico_mid_y(g);
    let hy = null;
    try {
      if (window.head_pos && window.head_pos[0] && window.head_pos[0].y != null) {
        hy = window.head_pos[0].y | 0;
      } else if (g && g.oa && g.oa.ka && g.oa.ka.y != null) {
        hy = g.oa.ka.y | 0;
      } else if (g && g.oa && g.oa.x && g.oa.x.y != null) {
        hy = g.oa.x.y | 0;
      }
    } catch (_e) {}
    if (hy == null) return "top";
    return hy < mid ? "top" : "bottom";
  };

  window.slot_mexico_find_half_pos = function slot_mexico_find_half_pos(
    mgr,
    half,
    occupied
  ) {
    const g = window.__remixGame;
    const mid = window.slot_mexico_mid_y(g);
    const occ = occupied || new Set();
    const ok = function (p) {
      if (!p || p.y == null || p.x == null) return false;
      if ((p.y | 0) === mid) return false;
      if (half === "top" && !((p.y | 0) < mid)) return false;
      if (half === "bottom" && !((p.y | 0) > mid)) return false;
      const k = (p.x | 0) + "," + (p.y | 0);
      if (occ.has(k)) return false;
      // Mexico badge pairs never land on the snake; no legal half = spawn fail.
      if (
        window.slot_soko_pos_on_snake &&
        window.slot_soko_pos_on_snake(g, p)
      ) {
        return false;
      }
      if (window.slot_pos_in_wall && window.slot_pos_in_wall(g, p.x, p.y))
        return false;
      if (window.slot_pos_on_bridge && window.slot_pos_on_bridge(g, p.x, p.y))
        return false;
      if (
        window.chess_outside_spawn_radius &&
        !window.chess_outside_spawn_radius(g, p)
      ) {
        return false;
      }
      return true;
    };
    for (let attempt = 0; attempt < 48; attempt++) {
      const p = window.slot_free_pos(mgr, 0);
      if (ok(p)) return p;
    }
    // Sweep board for a legal half cell.
    try {
      let w = 0;
      let h = 0;
      const walls = g && g.Ca && g.Ca.wa;
      if (walls && walls.length) {
        h = walls.length;
        w = walls[0] ? walls[0].length : 0;
      }
      if (w && h) {
        const y0 = half === "top" ? 0 : mid + 1;
        const y1 = half === "top" ? mid : h;
        for (let n = 0; n < 64; n++) {
          const x = (Math.random() * w) | 0;
          const y = y0 + ((Math.random() * Math.max(1, y1 - y0)) | 0);
          const p = window.slot_make_pos ? window.slot_make_pos(x, y) : { x, y };
          if (ok(p)) return p;
        }
      }
    } catch (_e) {}
    return null;
  };

  window.slot_mexico_plant_portal_pair = function slot_mexico_plant_portal_pair(
    game
  ) {
    const g = game || window.__remixGame;
    const mgr = g && g.wa;
    if (!mgr || !mgr.ka) return false;
    const occ = new Set();
    for (let i = 0; i < mgr.ka.length; i++) {
      const f = mgr.ka[i];
      if (!f || !f.pos) continue;
      occ.add((f.pos.x | 0) + "," + (f.pos.y | 0));
    }
    // Seed snake body so half search treats those tiles as occupied.
    try {
      const body = g && g.oa && g.oa.ka;
      if (body && body.length) {
        for (let i = 0; i < body.length; i++) {
          const seg = body[i];
          if (!seg) continue;
          const sx = seg.x != null ? seg.x | 0 : seg.pos ? seg.pos.x | 0 : NaN;
          const sy = seg.y != null ? seg.y | 0 : seg.pos ? seg.pos.y | 0 : NaN;
          if (sx === sx && sy === sy) occ.add(sx + "," + sy);
        }
      }
    } catch (_sb) {}
    const top = window.slot_mexico_find_half_pos(mgr, "top", occ);
    if (!top) return false;
    occ.add((top.x | 0) + "," + (top.y | 0));
    const bot = window.slot_mexico_find_half_pos(mgr, "bottom", occ);
    if (!bot) return false;
    const a = window.slot_make_apple(mgr, top);
    const b = window.slot_make_apple(mgr, bot);
    const pairId = (window.__slotPortalPairSeq =
      (window.__slotPortalPairSeq | 0) + 1);
    const mexId = (window.__slotMexicoPairSeq =
      (window.__slotMexicoPairSeq | 0) + 1);
    a.__slotPortal = true;
    b.__slotPortal = true;
    a.__slotPortalPairId = pairId;
    b.__slotPortalPairId = pairId;
    a.__slotPortalTwin = b;
    b.__slotPortalTwin = a;
    a.__slotMexicoPortal = true;
    b.__slotMexicoPortal = true;
    a.__slotMexicoPairId = mexId;
    b.__slotMexicoPairId = mexId;
    // Random non-Mexico / non-Twin badge for the pair; keep twins matched.
    let mode = window.slot_draw_mode_excluding([27, 5]) | 0;
    if ((mode | 0) === 5 || (mode | 0) === 27) mode = 1;
    window.assignSlotMode(a, mode);
    window.assignSlotMode(b, mode);
    // Keep yin-yang pairs matched on the portal twins.
    if (a.__slotYinYangPair != null) {
      b.__slotYinYangPair = a.__slotYinYangPair;
    } else {
      delete b.__slotYinYangPair;
    }
    mgr.ka.push(a, b);
    window.slot_ensure_unique_fruit_types(mgr);
    window.appleArray = mgr.ka;
    return true;
  };

  window.slot_mexico_cell_blocked_for_mid = function slot_mexico_cell_blocked_for_mid(
    game,
    x,
    y
  ) {
    const g = game || window.__remixGame;
    const xi = x | 0;
    const yi = y | 0;
    const pos = window.slot_make_pos ? window.slot_make_pos(xi, yi) : { x: xi, y: yi };
    // Never plant mid walls on the snake body (head or tail segments).
    if (
      window.slot_soko_pos_on_snake &&
      window.slot_soko_pos_on_snake(g, pos)
    ) {
      return true;
    }
    if (
      window.chess_outside_spawn_radius &&
      !window.chess_outside_spawn_radius(g, pos)
    ) {
      return true;
    }
    const mgr = g && g.wa;
    const list = mgr && mgr.ka;
    if (list) {
      for (let i = 0; i < list.length; i++) {
        const f = list[i];
        if (f && f.pos && (f.pos.x | 0) === xi && (f.pos.y | 0) === yi)
          return true;
      }
    }
    try {
      if (window.head_pos && window.head_pos[0]) {
        const hp = window.head_pos[0];
        if ((hp.x | 0) === xi && (hp.y | 0) === yi) return true;
      }
    } catch (_e) {}
    return false;
  };

  window.slot_mexico_place_partial_mid = function slot_mexico_place_partial_mid(
    game
  ) {
    const g = game || window.__remixGame;
    if (!g || window.__slotMexicoMidUp) return false;
    const walls = g.Ca;
    if (!walls || !Array.isArray(walls.wa) || !walls.wa.length) return false;
    const h = walls.wa.length;
    const w = walls.wa[0] ? walls.wa[0].length : 0;
    if (!w) return false;
    const mid = Math.floor(h / 2);
    const serial =
      typeof window.mexico_serial_coord === "function"
        ? window.mexico_serial_coord
        : function (pos) {
            return (pos.x << 16) | pos.y;
          };
    const makePos =
      typeof window.mexico_make_pos === "function"
        ? window.mexico_make_pos
        : window.slot_make_pos ||
          function (x, y) {
            return { x: x, y: y };
          };
    let planted = 0;
    for (let x = 0; x < w; x++) {
      if (walls.wa[mid] && (walls.wa[mid][x] | 0) > 0) continue;
      if (window.slot_mexico_cell_blocked_for_mid(g, x, mid)) continue;
      const pos = makePos(x, mid);
      const obj = { pos: pos, wm: false, m0: false, Lh: true };
      try {
        if (walls.Aa && typeof walls.Aa.set === "function") {
          walls.Aa.set(serial(pos), obj);
        }
        if (walls.wa[mid]) walls.wa[mid][x]++;
        planted++;
      } catch (_e) {}
    }
    if (planted > 0) window.__slotMexicoMidUp = true;
    return planted > 0;
  };

  window.slot_mexico_clear_mid = function slot_mexico_clear_mid(game) {
    const g = game || window.__remixGame;
    if (!g) return;
    const walls = g.Ca;
    if (!walls || !Array.isArray(walls.wa) || !walls.wa.length) {
      window.__slotMexicoMidUp = false;
      window.__slotMexicoStartSide = null;
      return;
    }
    const h = walls.wa.length;
    const w = walls.wa[0] ? walls.wa[0].length : 0;
    const mid = Math.floor(h / 2);
    const serial =
      typeof window.mexico_serial_coord === "function"
        ? window.mexico_serial_coord
        : function (pos) {
            return (pos.x << 16) | pos.y;
          };
    const makePos =
      typeof window.mexico_make_pos === "function"
        ? window.mexico_make_pos
        : window.slot_make_pos ||
          function (x, y) {
            return { x: x, y: y };
          };
    for (let x = 0; x < w; x++) {
      if (!walls.wa[mid] || (walls.wa[mid][x] | 0) <= 0) continue;
      const pos = makePos(x, mid);
      try {
        if (walls.Aa && typeof walls.Aa.delete === "function") {
          walls.Aa.delete(serial(pos));
        }
      } catch (_e) {}
      // Animate removal when possible (Lh / decrement).
      try {
        if (walls.Aa && typeof walls.Aa.get === "function") {
          const left = walls.Aa.get(serial(pos));
          if (left) left.Lh = true;
        }
      } catch (_e2) {}
      walls.wa[mid][x] = 0;
    }
    window.__slotMexicoMidUp = false;
    window.__slotMexicoStartSide = null;
  };

  window.slot_mexico_on_eat = function slot_mexico_on_eat(game) {
    const g = game || window.__remixGame;
    if (!g || !g.wa) return false;
    window.__slotMexicoStartSide = window.slot_mexico_head_side(g);
    const midWasUp = !!window.__slotMexicoMidUp;
    const pairOk = window.slot_mexico_plant_portal_pair(g);
    if (pairOk) {
      if (!midWasUp) {
        window.slot_mexico_place_partial_mid(g);
      }
      return true;
    }
    // Pair failed: do not spawn/rebuild mid wall. Try regular fruit.
    if (!midWasUp) {
      // leave mid alone (still down)
    }
    const pos = window.slot_free_pos(g.wa);
    if (pos) {
      const fruit = window.slot_make_apple(g.wa, pos);
      window.assignSlotMode(fruit);
      g.wa.ka.push(fruit);
      window.slot_ensure_unique_fruit_types(g.wa);
      window.appleArray = g.wa.ka;
      return true;
    }
    return false;
  };

  window.slot_mexico_tick_cross = function slot_mexico_tick_cross(game) {
    if (!window.__slotMexicoMidUp) return;
    const start = window.__slotMexicoStartSide;
    if (!start) return;
    const side = window.slot_mexico_head_side(game);
    if (side && side !== start) {
      window.slot_mexico_clear_mid(game);
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
    if ((prev === 6 || prev === 18) && g && g.wa) {
      try {
        window.slot_snap_fruit_tiles(g.wa);
      } catch (_e) {}
    }
    if (prev === 10 && g && g.wa) {
      try {
        window.slot_clear_slot_poisons(g.wa);
      } catch (_e) {}
    }
    // Arrow (16) tiles stay as leftovers — do not wipe Ka directions on leave.
    if (prev === 28) {
      try {
        window.slot_leave_bomb_fruit && window.slot_leave_bomb_fruit(g);
      } catch (_e) {}
    }
    // Hotdog (17): sidewalls only while active — wipe them on leave.
    if (prev === 17) {
      try {
        window.slot_clear_hotdog_walls && window.slot_clear_hotdog_walls(g);
      } catch (_e) {}
    }
    // Leaving Shield: keep nba on fruit, marked so Ultra/Chess won't strip them.
    if (prev === 15 && g && g.wa) {
      try {
        window.slot_mark_existing_shields && window.slot_mark_existing_shields(g.wa);
      } catch (_e) {}
    }
    // Twin (5): reverse only on Twin-badge eats. Drop leftover e7(5) so later
    // fruits don't keep flipping the snake. __slotTwinLive is pulsed only around
    // the native reverse (slot_prep_twin_eat / slot_finish_twin_eat).
    if (prev === 5) {
      window.__slotTwinLive = false;
      try {
        const snake = g && g.oa;
        if (snake) {
          snake.Oa = false;
          if (snake.Ga && snake.Ga !== "NONE") {
            snake.direction = snake.Ga;
            snake.Ga = "NONE";
          }
        }
      } catch (_t) {}
    }

    window.__slotPrevActive = prev;
    window.__slotActive = next;

    // Borderless (4): wrap-only via slot_borderless_wrap / n7 — never sticky
    // e7(4). Do not mutate settings.ka.

    // Bomb roll: skip native "zone every apple" bootstrap — only the badge
    // refill is armed via slot_arm_new_bomb_fruits.
    if (next === 28) {
      window.__bombFruitBootstrapped = true;
      if (!window.__bombFruitZones) window.__bombFruitZones = [];
      if (!window.__bombFruitOrphans) window.__bombFruitOrphans = [];
    }

    // Burger roll: strip piece timers, then arm every fresh fruit (same as
    // Burger mode reset). Without this, null timers become (null|0)===0 and
    // burger_tick expires the whole board into poison on the first tick.
    if (next === 25 && g && g.wa) {
      try {
        window.slot_strip_burger_from_pieces &&
          window.slot_strip_burger_from_pieces(g.wa);
      } catch (_bg) {}
      try {
        window.burger_fruits_eaten = 0;
        if (typeof window.burger_assign_timers_all === "function") {
          window.burger_assign_timers_all(g.wa.ka, g);
        }
      } catch (_ba) {}
    }
    // Leaving Burger: freeze fresh-fruit greying, keep poison countdowns.
    if (prev === 25 && g && g.wa) {
      try {
        window.slot_freeze_burger_fresh_timers &&
          window.slot_freeze_burger_fresh_timers(g.wa);
      } catch (_bf) {}
    }

    // Winged / Magnet: every fruit needs He/iL/CAb before m4E.update runs.
    if ((next === 6 || next === 18) && g && g.wa) {
      try {
        window.slot_ensure_board_motion &&
          window.slot_ensure_board_motion(g.wa, g);
      } catch (_m) {}
    }

    // Chess roll borrows e7(15) for piece lock — do NOT strip Shield-badge
    // leftover bars; those stay until eaten (new spawns stay unshielded).

    try {
      window.slot_sync_ultra_disables && window.slot_sync_ultra_disables();
    } catch (_e0) {}

    try {
      window.slot_update_cat_hud && window.slot_update_cat_hud();
    } catch (_e) {}
    try {
      window.slot_update_active_trophy && window.slot_update_active_trophy();
    } catch (_tr) {}
  };

  // Twin reverse runs BEFORE setSlotActive in the eat loop — pulse e7(5) for
  // this eat only, then clear so later fruits don't keep reversing.
  window.slot_prep_twin_eat = function slot_prep_twin_eat(game, fruit) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if (!fruit || fruit.Oka) return;
    if ((fruit.slotMode | 0) !== 5) return;
    window.__slotTwinLive = true;
  };
  window.slot_finish_twin_eat = function slot_finish_twin_eat() {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    window.__slotTwinLive = false;
  };

  // Leaving Bomb roll: keep planted idle rings until the player arms/explodes
  // them. Do not strip __slotBombPlant or idle zones — only new Bomb-badge
  // refills arm additional fruit (slot_arm_new_bomb_fruits while roll is 28).
  window.slot_has_armed_bombs = function slot_has_armed_bombs() {
    const zones = window.__bombFruitZones;
    if (!zones || !zones.length) return false;
    for (let i = 0; i < zones.length; i++) {
      if (zones[i] && (zones[i].bombX1a | 0) >= 0) return true;
    }
    return false;
  };

  window.slot_has_bomb_plants = function slot_has_bomb_plants(mgr) {
    const list =
      (mgr && mgr.ka) ||
      (window.__remixGame &&
        window.__remixGame.wa &&
        window.__remixGame.wa.ka) ||
      null;
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] && list[i].__slotBombPlant) return true;
      }
    }
    const zones = window.__bombFruitZones;
    if (zones && zones.length) {
      for (let i = 0; i < zones.length; i++) {
        const z = zones[i];
        if (!z) continue;
        if (z.__slotBombPlant || (z.bombX1a | 0) >= 0) return true;
      }
    }
    return false;
  };

  // Slot Bomb badge: only fruits spawned from that eat get idle rings — never
  // every leftover on the board (native Bomb Fruit zones all apples).
  window.slot_clear_bomb_plant_marks = function slot_clear_bomb_plant_marks(mgr) {
    const list = mgr && mgr.ka;
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (f) delete f.__slotBombPlant;
    }
  };

  window.slot_prune_bomb_zones_to_marked = function slot_prune_bomb_zones_to_marked(
    mgr
  ) {
    const zones = window.__bombFruitZones;
    if (!zones || !zones.length) return;
    const keep = new Set();
    const list = mgr && mgr.ka;
    if (list) {
      for (let i = 0; i < list.length; i++) {
        const f = list[i];
        if (!f || !f.__slotBombPlant || !f.pos) continue;
        const k =
          typeof window.bombFruit_pos_key === "function"
            ? window.bombFruit_pos_key(f.pos)
            : f.pos.x + "," + f.pos.y;
        if (k) keep.add(k);
      }
    }
    for (let i = zones.length - 1; i >= 0; i--) {
      const z = zones[i];
      if (!z) {
        zones.splice(i, 1);
        continue;
      }
      // Armed countdowns + Slot-planted idle rings stay until boom.
      if ((z.bombX1a | 0) >= 0 || z.__slotBombPlant) continue;
      const zk =
        typeof window.bombFruit_zone_key === "function"
          ? window.bombFruit_zone_key(z)
          : z.x + "," + z.y;
      if (!keep.has(zk)) zones.splice(i, 1);
    }
  };

  // Mark + idle-zone only fruits added from a Bomb-badge refill (fromIndex..).
  window.slot_arm_new_bomb_fruits = function slot_arm_new_bomb_fruits(
    mgr,
    fromIndex
  ) {
    if (!mgr || !mgr.ka) return;
    const start = Math.max(0, fromIndex | 0);
    for (let i = start; i < mgr.ka.length; i++) {
      const f = mgr.ka[i];
      if (!f || f.Oka || f.isPiece) continue;
      f.__slotBombPlant = true;
      if (typeof window.bombFruit_init_apple === "function") {
        window.bombFruit_init_apple(f);
      } else if (f.bombX1a == null) {
        f.bombX1a = -1;
      }
      if (f.pos && typeof window.bombFruit_ensure_zone === "function") {
        const z = window.bombFruit_ensure_zone(f.pos.x, f.pos.y, -1);
        if (z) z.__slotBombPlant = true;
      }
    }
    if (typeof window.bombFruit_constrain_apples === "function") {
      try {
        window.bombFruit_constrain_apples(mgr, start);
      } catch (_e) {}
    }
    for (let i = start; i < mgr.ka.length; i++) {
      const f = mgr.ka[i];
      if (!f || !f.__slotBombPlant || !f.pos) continue;
      if (typeof window.bombFruit_ensure_zone === "function") {
        const z = window.bombFruit_ensure_zone(f.pos.x, f.pos.y, -1);
        if (z) z.__slotBombPlant = true;
      }
    }
    window.slot_prune_bomb_zones_to_marked(mgr);
  };

  window.slot_leave_bomb_fruit = function slot_leave_bomb_fruit(_game) {
    // Intentionally keep __slotBombPlant fruit + idle/armed zones. New plants
    // only come from the next Bomb-badge eat while __slotActive===28.
    // Keep bootstrapped so tick won't re-init_all as a "fresh" Bomb board.
    window.__bombFruitBootstrapped = true;
    if (!window.__bombFruitZones) window.__bombFruitZones = [];
    if (!window.__bombFruitOrphans) window.__bombFruitOrphans = [];
  };

  // Arrow (16) paints direction tiles on Ka via s4E while rolled. Leftovers
  // stay after leaving; only new turn-spawns are gated by __slotAllowArrowTurns.
  window.slot_arrow_host = function slot_arrow_host(game) {
    const g = game || window.__remixGame;
    if (!g) return null;
    if (g.Ka && Array.isArray(g.Ka.ka)) return g.Ka;
    if (g.Rb && Array.isArray(g.Rb.ka) && g.Rb.ka[0] && g.Rb.ka[0][0] &&
        "direction" in g.Rb.ka[0][0]) {
      return g.Rb;
    }
    return null;
  };

  window.slot_count_arrows = function slot_count_arrows(game) {
    const host = window.slot_arrow_host(game);
    const ka = host && host.ka;
    if (!ka) return 0;
    let n = 0;
    for (let y = 0; y < ka.length; y++) {
      const row = ka[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell && cell.direction && cell.direction !== "NONE") n++;
      }
    }
    return n;
  };

  window.slot_has_arrows = function slot_has_arrows(game) {
    return window.slot_count_arrows(game) > 0;
  };

  window.slot_clear_arrows = function slot_clear_arrows(game) {
    const host = window.slot_arrow_host(game);
    if (!host) return false;
    if (typeof host.reset === "function") {
      try {
        host.reset();
        return true;
      } catch (_e) {}
    }
    const ka = host.ka;
    if (!ka) return false;
    for (let y = 0; y < ka.length; y++) {
      const row = ka[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (!cell) continue;
        cell.direction = "NONE";
        cell.wm = false;
      }
    }
    return true;
  };

  // Fruit sitting on an arrow tile removes that arrow (spawn / relocate / drift).
  window.slot_clear_arrow_at = function slot_clear_arrow_at(game, x, y) {
    const host = window.slot_arrow_host(game);
    if (!host || !host.ka) return false;
    const xi = Math.round(+x) | 0;
    const yi = Math.round(+y) | 0;
    const row = host.ka[yi];
    const cell = row && row[xi];
    if (!cell || !cell.direction || cell.direction === "NONE") return false;
    cell.direction = "NONE";
    cell.wm = false;
    return true;
  };

  window.slot_clear_arrows_under_fruit = function slot_clear_arrows_under_fruit(
    mgr,
    game
  ) {
    const list = mgr && mgr.ka;
    if (!list || !list.length) return;
    const g = game || window.__remixGame || (mgr && mgr.wb);
    if (!window.slot_has_arrows || !window.slot_has_arrows(g)) return;
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || !f.pos) continue;
      try {
        window.slot_clear_arrow_at(g, f.pos.x, f.pos.y);
      } catch (_e) {}
    }
  };

  // Hotdog (17) sidewalls live on the wall manager (Ca.Aa entries with .ty).
  // They exist only while Hotdog is the active roll — clear on leave.
  window.slot_hotdog_wall_host = function slot_hotdog_wall_host(game) {
    const g = game || window.__remixGame;
    return (g && g.Ca) || null;
  };

  window.slot_count_hotdog_walls = function slot_count_hotdog_walls(game) {
    const wm = window.slot_hotdog_wall_host(game);
    if (!wm || !wm.Aa) return 0;
    let n = 0;
    try {
      for (const wall of wm.Aa.values()) {
        if (wall && wall.ty != null) n++;
      }
    } catch (_e) {}
    return n;
  };

  window.slot_has_hotdog_walls = function slot_has_hotdog_walls(game) {
    return window.slot_count_hotdog_walls(game) > 0;
  };

  window.slot_clear_hotdog_walls = function slot_clear_hotdog_walls(game) {
    const wm = window.slot_hotdog_wall_host(game);
    if (!wm || !wm.Aa) return false;
    const remove =
      window.__slotK6E ||
      (typeof k6E === "function" ? k6E : null);
    const doomed = [];
    try {
      for (const wall of wm.Aa.values()) {
        if (wall && wall.ty != null && wall.pos) doomed.push(wall.pos);
      }
    } catch (_e) {
      return false;
    }
    for (let i = 0; i < doomed.length; i++) {
      const pos = doomed[i];
      try {
        if (typeof remove === "function") {
          remove(wm, pos);
        } else {
          const key =
            typeof Y6 === "function"
              ? Y6(pos)
              : ((pos.x | 0) << 16) | (pos.y | 0);
          wm.Aa.delete(key);
          if (wm.wa && wm.wa[pos.y] && wm.wa[pos.y][pos.x] != null) {
            wm.wa[pos.y][pos.x] = Math.max(0, (wm.wa[pos.y][pos.x] | 0) - 1);
          }
        }
      } catch (_e2) {}
    }
    return doomed.length > 0;
  };

  window.slot_bomb_leftover_tick = function slot_bomb_leftover_tick(game) {
    // Full bombFruit_tick_logic runs while plants/armed leftovers keep
    // isBombFruitActive true — avoid double-ticking zones.
    if (window.isBombFruitActive && window.isBombFruitActive()) return;
    if (!window.slot_has_armed_bombs || !window.slot_has_armed_bombs()) return;
    const g = game || window.__remixGame;
    if (!g || g.nj || !g.wa) return;
    try {
      if (typeof window.bombFruit_tick_zones === "function") {
        window.bombFruit_tick_zones(g, g.wa);
      }
    } catch (_e) {}
  };

  window.slot_bomb_leftover_draw = function slot_bomb_leftover_draw(board) {
    if (window.isBombFruitActive && window.isBombFruitActive()) return;
    if (!window.slot_has_armed_bombs || !window.slot_has_armed_bombs()) return;
    const boxes = window.checkboxes && window.checkboxes.checkboxStatuses;
    if (boxes && boxes.mineRadius === false) return;
    const game = (board && board.wb) || window.__remixGame;
    if (game && game.nj) return;
    if (!board || !board.ka) return;
    const zones = window.__bombFruitZones || [];
    const ctx = board.ka;
    try {
      ctx.save();
      for (let i = 0; i < zones.length; i++) {
        const z = zones[i];
        if (!z || (z.bombX1a | 0) < 0) continue;
        window.bombFruit_draw_one_radius(
          board,
          { x: z.x, y: z.y },
          z.bombX1a | 0,
          game
        );
      }
      ctx.setLineDash([]);
      ctx.restore();
    } catch (_e) {}
  };

  // Ultra defaults wall/mine/gate/bridge/statue/arrow spawns OFF via checkboxes.
  // Under Slot Machine those Ultra flags are ignored — this sync owns the
  // disable* bits from the active roll (and only the active roll).
  window.slot_sync_ultra_disables = function slot_sync_ultra_disables() {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    const m = window.__slotActive | 0;
    // No roll yet (or non-matching roll): keep Ultra's "disabled" behavior for
    // that spawn path so leftovers don't keep planting new entities.
    window.disableWallMode = m !== 1;
    window.disableMineMode = m !== 12;
    window.disableGateMode = m !== 19;
    window.disableBridgeMode = m !== 20;
    window.disableStatueBodyPlant = m !== 13;
    // Key/Soko entities are planted ONLY by slotRespawn (manual). Always block
    // native key-reset planting under Slot so enabling e7(8) never double-spawns.
    window.disableKeyResetPlant = true;
    // Shield is 15 (nba bars); Arrow is 16 (Ka direction tiles on turns).
    window.__slotAllowArrowTurns = m === 16;
    try {
      window.remixSyncWallEveryAppleEnabled &&
        window.remixSyncWallEveryAppleEnabled();
    } catch (_e) {}
  };

  // After any Ultra toggle refresh, re-assert Slot ownership of disable flags.
  window.slot_wrap_ultra_disable_flags = function slot_wrap_ultra_disable_flags() {
    if (
      typeof window.ultraEnsureGameplayToggles === "function" &&
      !window.ultraEnsureGameplayToggles.__slotWrap
    ) {
      const origEnsure = window.ultraEnsureGameplayToggles;
      window.ultraEnsureGameplayToggles = function () {
        origEnsure.apply(this, arguments);
        if (window.isSlotMachineActive && window.isSlotMachineActive()) {
          window.slot_sync_ultra_disables && window.slot_sync_ultra_disables();
        }
      };
      window.ultraEnsureGameplayToggles.__slotWrap = true;
    }
    if (
      typeof window.ultraApplyGameplayToggleFlags === "function" &&
      !window.ultraApplyGameplayToggleFlags.__slotWrap
    ) {
      const origApply = window.ultraApplyGameplayToggleFlags;
      window.ultraApplyGameplayToggleFlags = function () {
        const r = origApply.apply(this, arguments);
        if (window.isSlotMachineActive && window.isSlotMachineActive()) {
          window.slot_sync_ultra_disables && window.slot_sync_ultra_disables();
        }
        return r;
      };
      window.ultraApplyGameplayToggleFlags.__slotWrap = true;
    }
  };
  window.slot_wrap_ultra_disable_flags();

  window.slot_on_eating_fruit = function slot_on_eating_fruit(game, fruit) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if (!fruit) return;
    // Chess pieces: pickup only — never activate / never refill. Unlocked fruit
    // rolls a normal random badge (not forced Chess).
    if (fruit.isPiece) {
      window.just_ate = "piece";
      return;
    }
    // Authoritative eat class — do not trust a sticky just_ate from a prior
    // piece pickup (isChessActive may be false after the last unlock).
    window.just_ate = "fruit";
    // Poison hazard: no activate / no respawn.
    if (fruit.Oka) return;
    // Same fruit may be reported twice per eat (before entity plants + on
    // splice). After slot_eat_respawn clears flags, a second call used to
    // re-arm __slotEating — unlock f4E then wrongly slotRespawn'd key/soko.
    if (window.__slotActivatedFruit === fruit) return;
    window.__slotActivatedFruit = fruit;
    window.__slotRespawnedThisEat = false;
    window.__slotEating = true;
    window.__slotEatenFruit = fruit;
    window.__slotEatenMode =
      fruit.slotMode != null ? fruit.slotMode | 0 : null;
    if (fruit.slotMode != null) {
      window.setSlotActive(fruit.slotMode, game);
      const m = fruit.slotMode | 0;
      if (m === 7) {
        try {
          window.slot_yy_swap_board &&
            window.slot_yy_swap_board(game && game.wa);
        } catch (_yy) {}
        try {
          window.slot_flip_yy_snake_colors &&
            window.slot_flip_yy_snake_colors(game);
        } catch (_yc) {}
      }
      if (m === 11) {
        try {
          window.slot_dimension_activate_grace &&
            window.slot_dimension_activate_grace(game);
        } catch (_dim) {}
      }
      if (m === 26) {
        // Cat badge: +1 life immediately (not every N like native Cat mode).
        const max = window.CAT_MAX_LIVES | 9;
        if (window.cat_lives == null) window.cat_lives = 0;
        window.cat_lives = Math.min(max, (window.cat_lives | 0) + 1);
        window.__slotCatFruitEaten = (window.__slotCatFruitEaten | 0) + 1;
        try {
          window.catEnsureLivesHud && window.catEnsureLivesHud();
          window.catUpdateLivesHud && window.catUpdateLivesHud();
        } catch (_e) {}
      }
    }
    // Eating a Mexico-spawned portal twin clears mid border.
    if (fruit.__slotMexicoPortal && window.__slotMexicoMidUp) {
      try {
        window.slot_mexico_clear_mid && window.slot_mexico_clear_mid(game);
      } catch (_mx) {}
    }
  };

  // Native wall/gate/bridge/statue spawn runs BEFORE Vm/splice. Activate the
  // badge mode first, and force the every-other-apple `f` flag on that eat so
  // Gate (etc.) actually places an entity when the badge is eaten.
  window.slot_before_mode_spawns = function slot_before_mode_spawns(game, fruit) {
    window.__slotForceEntitySpawn = false;
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if (!fruit || fruit.Oka || fruit.isPiece) return;
    if (fruit.slotMode == null) return;
    window.slot_on_eating_fruit(game, fruit);
    const m = fruit.slotMode | 0;
    // Same `f` gate as wall/gate/bridge/statue entity plants.
    if (m === 1 || m === 13 || m === 19 || m === 20) {
      window.__slotForceEntitySpawn = true;
    }
  };

  window.slot_force_entity_spawn = function slot_force_entity_spawn() {
    return !!window.__slotForceEntitySpawn;
  };

  // If native m5E's freePos(flag 10) fails under Slot Machine, plant one bridge.
  window.slot_ensure_bridge_planted = function slot_ensure_bridge_planted(game) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if ((window.__slotActive | 0) !== 20 && !window.__slotForceEntitySpawn) return;
    const g = game || window.__remixGame;
    const ga = g && g.Ga;
    if (!ga || !Array.isArray(ga.oa) || !ga.oa.length) return;
    for (let y = 0; y < ga.oa.length; y++) {
      const row = ga.oa[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        if (row[x]) return;
      }
    }
    window.disableBridgeMode = false;
    try {
      if (typeof m5E === "function") {
        m5E(ga);
        for (let y = 0; y < ga.oa.length; y++) {
          const row = ga.oa[y];
          if (!row) continue;
          for (let x = 0; x < row.length; x++) {
            if (row[x]) return;
          }
        }
      }
    } catch (_e) {}
    try {
      const mgr = g.wa;
      const pos = window.slot_free_pos(mgr, 0);
      if (!pos) return;
      if (typeof window.placeBridge === "function") {
        window.placeBridge(pos.x | 0, pos.y | 0);
        return;
      }
      const y = pos.y | 0;
      const x = pos.x | 0;
      if (!ga.oa[y]) return;
      ga.oa[y][x] = {
        wm: true,
        color: "#e68f1b",
        Lh: true,
      };
    } catch (_e2) {}
  };

  window.slot_has_keys = function slot_has_keys(game) {
    const g = game || window.__remixGame;
    const keys = g && g.Ba && g.Ba.keys;
    return !!(keys && keys.length > 0);
  };

  window.slot_has_sokoboxes = function slot_has_sokoboxes(game) {
    const g = game || window.__remixGame;
    try {
      const set = g && g.Aa && g.Aa.oa;
      if (set && typeof set.size === "number") return set.size > 0;
      if (set && typeof set[Symbol.iterator] === "function") {
        for (const _ of set) return true;
      }
    } catch (_e) {}
    return false;
  };

  window.slot_has_sokogoals = function slot_has_sokogoals(game) {
    const g = game || window.__remixGame;
    try {
      const set = g && g.Aa && g.Aa.d_;
      if (set && typeof set.size === "number") return set.size > 0;
      if (set && typeof set[Symbol.iterator] === "function") {
        for (const _ of set) return true;
      }
      if (Array.isArray(set) && set.length) return true;
    } catch (_e) {}
    return false;
  };

  window.slot_add_soko_keys = function slot_add_soko_keys(game, keys, excludeBox) {
    const set = keys || new Set();
    const g = game || window.__remixGame;
    const aa = g && g.Aa;
    if (!aa) return set;
    try {
      if (aa.oa) {
        for (const box of aa.oa) {
          if (!box || box === excludeBox || !box.pos) continue;
          set.add((box.pos.x | 0) + "," + (box.pos.y | 0));
        }
      }
      if (aa.d_) {
        for (const goal of aa.d_) {
          if (!goal) continue;
          set.add((goal.x | 0) + "," + (goal.y | 0));
        }
      }
    } catch (_e) {}
    return set;
  };

  window.slot_soko_pos_on_snake = function slot_soko_pos_on_snake(game, pos) {
    if (!pos || pos.x == null || pos.y == null) return false;
    const body = game && game.oa && game.oa.ka;
    if (!body || !body.length) return false;
    const x = pos.x | 0;
    const y = pos.y | 0;
    for (let i = 0; i < body.length; i++) {
      const seg = body[i];
      if (!seg) continue;
      const sx = seg.x != null ? seg.x | 0 : seg.pos ? seg.pos.x | 0 : NaN;
      const sy = seg.y != null ? seg.y | 0 : seg.pos ? seg.pos.y | 0 : NaN;
      if (sx === x && sy === y) return true;
    }
    return false;
  };

  window.slot_soko_pos_on_fruit = function slot_soko_pos_on_fruit(game, pos) {
    if (!pos || pos.x == null || pos.y == null) return false;
    const g = game || window.__remixGame;
    const list =
      (g && g.wa && g.wa.ka) ||
      (window.appleArray && window.appleArray.length ? window.appleArray : null);
    if (!list || !list.length) return false;
    const x = pos.x | 0;
    const y = pos.y | 0;
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || !f.pos) continue;
      if ((f.pos.x | 0) === x && (f.pos.y | 0) === y) return true;
    }
    return false;
  };

  // Box on snake body or fruit: relocate outside head spawn radius, or
  // delete. Empty board (no fruit / key+keyblock / sokobox) → win.
  window.slot_soko_snap_box_positions = function slot_soko_snap_box_positions(
    game
  ) {
    const g = game || window.__remixGame;
    const aa = g && g.Aa;
    if (!aa || !aa.oa) return;
    try {
      for (const box of aa.oa) {
        if (!box || !box.pos) continue;
        const x = Math.round(+box.pos.x);
        const y = Math.round(+box.pos.y);
        if (box.pos.x !== x) box.pos.x = x;
        if (box.pos.y !== y) box.pos.y = y;
      }
    } catch (_e) {}
  };

  window.slot_soko_resolve_body_overlaps = function slot_soko_resolve_body_overlaps(
    game
  ) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    const g = game || window.__remixGame;
    if (!g || g.nj) return;
    window.slot_soko_snap_box_positions(g);
    const aa = g.Aa;
    if (!aa || !aa.oa) return;
    const hits = [];
    try {
      for (const box of aa.oa) {
        if (!box || !box.Lh || !box.pos) continue;
        if (
          window.slot_soko_pos_on_snake(g, box.pos) ||
          window.slot_soko_pos_on_fruit(g, box.pos)
        ) {
          hits.push(box);
        }
      }
    } catch (_e) {
      return;
    }
    if (!hits.length) return;

    for (let i = 0; i < hits.length; i++) {
      const box = hits[i];
      let moved = false;
      try {
        // Prefer slot_free_pos (radius + walls + fruit); also ban other boxes/goals.
        const occ = new Set();
        window.slot_add_soko_keys(g, occ, box);
        let pos = null;
        for (let attempt = 0; attempt < 32 && !pos; attempt++) {
          const p =
            typeof window.slot_free_pos === "function"
              ? window.slot_free_pos(g.wa)
              : null;
          if (!p || p.x == null || p.y == null) break;
          const key = (p.x | 0) + "," + (p.y | 0);
          if (occ.has(key)) continue;
          if (window.slot_soko_pos_on_snake(g, p)) continue;
          if (window.slot_soko_pos_on_fruit(g, p)) continue;
          pos = p;
        }
        if (pos) {
          try {
            if (typeof box.pos.clone === "function") {
              box.prev = box.pos.clone();
            } else {
              box.prev = { x: box.pos.x | 0, y: box.pos.y | 0 };
            }
          } catch (_p) {
            box.prev = { x: box.pos.x | 0, y: box.pos.y | 0 };
          }
          if (typeof box.pos.clone === "function" && pos.clone) {
            box.pos = pos.clone();
          } else {
            box.pos.x = pos.x | 0;
            box.pos.y = pos.y | 0;
          }
          box.wm = true;
          if (
            !window.slot_soko_pos_on_snake(g, box.pos) &&
            !window.slot_soko_pos_on_fruit(g, box.pos)
          ) {
            moved = true;
          }
        }
      } catch (_m) {
        moved = false;
      }
      if (!moved) {
        try {
          aa.oa.delete(box);
        } catch (_d) {}
      }
    }
    try {
      window.slot_win_if_empty(g, g.wa);
    } catch (_w) {}
  };

  window.slot_has_bridges = function slot_has_bridges(game) {
    const g = game || window.__remixGame;
    const ga = g && g.Ga;
    const grid = ga && ga.oa;
    if (!grid || !grid.length) return false;
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        if (row[x]) return true;
      }
    }
    return false;
  };

  window.slot_has_gates = function slot_has_gates(game) {
    const g = game || window.__remixGame;
    const qa = g && g.Qa;
    try {
      if (qa && qa.pfa && qa.pfa.length > 0) return true;
      if (qa && qa.Yfa && qa.Yfa.length > 0) return true;
    } catch (_e) {}
    return false;
  };

  // Shield bars (nba) on fruit spawned while Shield was the active roll.
  // Marked leftovers keep bars after leaving Shield; e7(15) stays true for
  // draw/physics, but g7/P3E stamps stay gated to __slotActive===15 only.
  window.slot_has_shields = function slot_has_shields(mgr) {
    const list =
      (mgr && mgr.ka) ||
      (window.__remixGame &&
        window.__remixGame.wa &&
        window.__remixGame.wa.ka) ||
      [];
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || f.isPiece || f.Oka) continue;
      if (f.__slotShield && f.nba && typeof f.nba.has === "function") return true;
    }
    return false;
  };

  window.slot_mark_existing_shields = function slot_mark_existing_shields(mgr) {
    const list = (mgr && mgr.ka) || [];
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || f.isPiece || f.Oka) continue;
      if (f.nba && typeof f.nba.has === "function") {
        f.__slotShield = true;
        f.__ultraKeepShield = true;
      }
    }
  };

  window.slot_clear_fruit_shields = function slot_clear_fruit_shields(mgr) {
    const list = (mgr && mgr.ka) || [];
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || f.isPiece) continue;
      f.nba = undefined;
      f.__slotShield = false;
      f.__ultraKeepShield = false;
      delete f.__slotNbaPrior;
      delete f.__slotNbaPriorSaved;
    }
  };

  // Chess piece-carry overwrites every apple to a full 4-way lock. Snapshot
  // Shield-badge nba first so unlock can restore the prior P3E structure.
  window.slot_snapshot_shield_nba_for_chess_lock =
    function slot_snapshot_shield_nba_for_chess_lock() {
      const field = window.chess_shield_field || "nba";
      const arr = window.appleArray;
      if (!arr) return;
      for (let i = 0; i < arr.length; i++) {
        const apple = arr[i];
        if (!apple || apple.isPiece || apple.Oka) continue;
        if (!(apple.__slotShield || apple.__ultraKeepShield)) continue;
        if (apple.__slotNbaPriorSaved) continue;
        const cur = apple[field];
        apple.__slotNbaPrior =
          cur && typeof cur.has === "function" ? new Set([...cur]) : null;
        apple.__slotNbaPriorSaved = true;
      }
    };

  window.slot_restore_shield_nba_after_chess_lock =
    function slot_restore_shield_nba_after_chess_lock(apple, field) {
      if (!apple) return false;
      const f = field || window.chess_shield_field || "nba";
      if (!(apple.__slotShield || apple.__ultraKeepShield)) return false;
      if (!apple.__slotNbaPriorSaved) return false;
      if (apple.__slotNbaPrior && typeof apple.__slotNbaPrior.has === "function") {
        apple[f] = new Set([...apple.__slotNbaPrior]);
      } else {
        apple[f] = undefined;
      }
      delete apple.__slotNbaPrior;
      delete apple.__slotNbaPriorSaved;
      return true;
    };

  window.slot_apply_shield = function slot_apply_shield(fruit, mgr) {
    if (!fruit || fruit.isPiece || fruit.Oka) return false;
    const p3e =
      window.__slotP3E ||
      (typeof P3E === "function" ? P3E : null);
    try {
      if (typeof p3e === "function" && mgr) {
        fruit.nba = p3e(mgr, fruit.pos);
      } else {
        // P3E not captured yet — 1–2 blocked dirs (never a full four-way lock).
        const dirs = ["UP", "DOWN", "LEFT", "RIGHT"];
        const n = 1 + ((Math.random() * 2) | 0);
        const set = new Set();
        while (set.size < n) {
          set.add(dirs[(Math.random() * 4) | 0]);
        }
        fruit.nba = set;
      }
    } catch (_e) {
      fruit.nba = new Set(["UP"]);
    }
    fruit.__slotShield = true;
    fruit.__ultraKeepShield = true;
    return true;
  };

  window.slot_win_if_empty = function slot_win_if_empty(game, mgr) {
    // Playable board content blocks win: badged fruit, portal pairs, chess
    // pieces, keys/keyblocks, sokoboxes/goals. Poison (Oka) and other hazards
    // (mines, arrows, walls, etc.) do NOT count — spawn-fail + empty playable
    // board → win.
    if (window.slot_board_has_playable_content(game, mgr)) return false;
    // Poison badge eat intentionally leaves no refill — empty is not a win.
    if ((window.__slotActive | 0) === 10) return false;
    const g = game || window.__remixGame;
    window.slot_trigger_win(g);
    return true;
  };

  // True when the board still has something the player must clear (not poison
  // / mines / arrows / other hazards).
  window.slot_board_has_playable_content = function slot_board_has_playable_content(
    game,
    mgr
  ) {
    const list = mgr && mgr.ka;
    // Eat path runs before the splice — ignore the apple being eaten.
    const eaten = window.__slotEatenFruit;
    if (list && list.length) {
      for (let i = 0; i < list.length; i++) {
        const f = list[i];
        if (!f) continue;
        if (eaten && f === eaten) continue;
        if (f.Oka) continue; // poison hazard — not playable fruit
        return true; // regular / portal / chess piece / badged fruit
      }
    }
    const g = game || window.__remixGame;
    if (window.slot_has_keys && window.slot_has_keys(g)) return true;
    if (window.slot_has_sokoboxes && window.slot_has_sokoboxes(g)) return true;
    if (window.slot_has_sokogoals && window.slot_has_sokogoals(g)) return true;
    return false;
  };

  /**
   * Native r7E win (after Timer.alter) does:
   *   _.hn(header.Aa, "ALL");
   *   _run/_pb + SplitPanelOnSplit("ALL", ticks*Fb*1e-3, delta);
   *   _.hn(header.Ba, S2E(ticks*Fb));
   *   B7E(header, Sh, x7E(game, d6E(settings)));
   *   Mb = ticks;
   * Slot gates that whole block, so mirror it here. Split-panel alone is not
   * enough — the visible score/time HUD is header.Aa / header.Ba.
   */
  window.slot_record_all_timer_split = function slot_record_all_timer_split(
    game
  ) {
    if (!game) return;
    const score = game.Sh != null ? game.Sh : game.Oh;
    const ticks = game.ticks | 0;
    const fb = typeof game.Fb === "number" ? game.Fb : 0;
    const timeMs = Math.floor(ticks * fb);
    const _time = timeMs * 1e-3;

    // 1) Native header label → "ALL" + freeze time (S2E formats ms).
    try {
      const header = game.header;
      const hn =
        window.__slotHn ||
        (typeof _ !== "undefined" && _ && typeof _.hn === "function"
          ? _.hn
          : null);
      if (hn && header && header.Aa) {
        hn(header.Aa, "ALL");
      }
      if (hn && header && header.Ba) {
        if (typeof window.__slotS2E === "function") {
          hn(header.Ba, window.__slotS2E(timeMs));
        } else if (typeof Number.prototype.timeFormat === "function") {
          hn(header.Ba, _time.timeFormat());
        }
      }
      if (
        header &&
        typeof window.__slotB7E === "function" &&
        typeof window.__slotX7E === "function" &&
        typeof window.__slotD6E === "function"
      ) {
        const fd = String(
          window.__slotX7E(game, window.__slotD6E(game.settings))
        );
        window.__slotB7E(header, score, fd);
      }
    } catch (_h) {}

    // 2) Pudding split panel / _run / _pb (same as Timer.alter inject).
    try {
      if (typeof getSelected !== "function") return;
      const _mode = getSelected("#trophy");
      const _count = getSelected("#count");
      const _speed = getSelected("#speed");
      const _size = getSelected("#size");
      const _cat = window._cat != null ? window._cat : 3;

      if (!window._run) window._run = {};
      if (!window._run[_mode]) window._run[_mode] = {};
      if (!window._run[_mode][_count]) window._run[_mode][_count] = {};
      if (!window._run[_mode][_count][_speed])
        window._run[_mode][_count][_speed] = {};
      if (!window._run[_mode][_count][_speed][_size])
        window._run[_mode][_count][_speed][_size] = {};
      if (!window._run[_mode][_count][_speed][_size][_cat])
        window._run[_mode][_count][_speed][_size][_cat] = {};

      if (!window._pb) window._pb = {};
      if (!window._pb[_mode]) window._pb[_mode] = {};
      if (!window._pb[_mode][_count]) window._pb[_mode][_count] = {};
      if (!window._pb[_mode][_count][_speed])
        window._pb[_mode][_count][_speed] = {};
      if (!window._pb[_mode][_count][_speed][_size])
        window._pb[_mode][_count][_speed][_size] = {};
      if (!window._pb[_mode][_count][_speed][_size][_cat])
        window._pb[_mode][_count][_speed][_size][_cat] = {};

      const runBucket = window._run[_mode][_count][_speed][_size][_cat];
      const pbBucket = window._pb[_mode][_count][_speed][_size][_cat];
      runBucket.ALL = _time;

      let _delta = NaN;
      const deltaDiv = document.getElementById("timerDelta");
      if (pbBucket.ALL != null) {
        _delta = _time - pbBucket.ALL;
        if (deltaDiv) {
          if (_delta !== 0 && typeof _delta.timeFormat === "function") {
            const abs = Math.abs(_delta).timeFormat();
            const last = window._lastDelta | 0;
            const key =
              _delta > 0
                ? _delta > last
                  ? "_snake_behindl"
                  : "_snake_behindg"
                : _delta > last
                  ? "_snake_aheadl"
                  : "_snake_aheadg";
            const colored =
              typeof String.prototype.color === "function"
                ? ((_delta < 0 ? "-" : "+") + abs).color(
                    localStorage[key] || (_delta < 0 ? "#008010" : "#dd3333")
                  )
                : (_delta < 0 ? "-" : "+") + abs;
            deltaDiv.innerHTML = colored;
            window._lastDelta = _delta;
          } else if (typeof "-".color === "function") {
            deltaDiv.innerHTML = "-".color("white");
          } else {
            deltaDiv.textContent = "-";
          }
        }
      } else if (deltaDiv) {
        if (typeof "-".color === "function")
          deltaDiv.innerHTML = "-".color("white");
        else deltaDiv.textContent = "-";
      }

      if (_delta < 0 || isNaN(_delta)) {
        window._pb[_mode][_count][_speed][_size][_cat] = runBucket;
        if (typeof window.persistSnakePb === "function") window.persistSnakePb();
        else if (typeof window.markSnakePbDirty === "function")
          window.markSnakePbDirty();
        else localStorage._snake_pb = JSON.stringify(window._pb);
      }

      if (typeof window.SplitPanelOnSplit === "function") {
        window.SplitPanelOnSplit("ALL", _time, _delta);
      }
    } catch (_e) {}

    try {
      if (game.ticks != null) game.Mb = game.ticks;
    } catch (_mb) {}
  };

  window.slot_trigger_win = function slot_trigger_win(game) {
    if (!game || game.nj) return;
    // All-apples win: restore Slot Machine topbar icon (not the last badge).
    try {
      window.__slotActive = null;
      window.updateSlotMachineTrophySRC &&
        window.updateSlotMachineTrophySRC();
    } catch (_tr) {}
    try {
      const winBank =
        (typeof s5E !== "undefined" && s5E) || window.__bombFruitS5E;
      if (winBank && winBank.WIN && winBank.WIN.play) winBank.WIN.play();
      else if (typeof Q4E !== "undefined" && Q4E.rWd && Q4E.rWd.play)
        Q4E.rWd.play();
      else if (typeof ybF !== "undefined" && ybF.WIN) ybF.WIN.play();
    } catch (_e) {}
    const score = game.Sh != null ? game.Sh : game.Oh;
    // Native order: WIN → gotAll → ub/nj → end menu → ALL header/split → Mb.
    try {
      if (window.timeKeeper && typeof window.timeKeeper.gotAll === "function") {
        let timeMs = 0;
        if (typeof game.ticks === "number" && typeof game.Fb === "number") {
          timeMs = Math.floor(game.ticks * game.Fb);
        } else if (typeof window.resetTime === "number" && window.resetTime > 0) {
          timeMs = Date.now() - window.resetTime;
        } else if (typeof game.ticks === "number") {
          timeMs = game.ticks | 0;
        }
        window.timeKeeper.gotAll(Math.floor(timeMs), score);
      }
    } catch (_tk) {}
    game.ub = true;
    game.nj = true;
    try {
      const show =
        window.__slotShowEndMenu ||
        (typeof A7E === "function" ? A7E : null) ||
        (typeof vdF === "function" ? vdF : null);
      if (typeof show === "function" && game.menu) {
        show(game.menu, 1400, score);
      }
    } catch (_e2) {}
    try {
      window.slot_record_all_timer_split(game);
    } catch (_split) {}
  };

  window.slot_make_pos = function slot_make_pos(x, y) {
    const xi = x | 0;
    const yi = y | 0;
    if (typeof window.chess_make_pos === "function") {
      return window.chess_make_pos(xi, yi);
    }
    if (typeof _ !== "undefined" && _ && typeof _.Od === "function") {
      return new _.Od(xi, yi);
    }
    return { x: xi, y: yi };
  };

  // Winged/Magnet m4E.update reads fruit.iL.x / fruit.He.x every tick.
  // slot_make_apple often runs before g7 is captured → bare fruits crash.
  window.slot_vec = function slot_vec(x, y) {
    if (typeof _ !== "undefined" && _ && typeof _.Od === "function") {
      return new _.Od(+x || 0, +y || 0);
    }
    return { x: +x || 0, y: +y || 0 };
  };

  window.slot_ensure_fruit_motion = function slot_ensure_fruit_motion(fruit, game) {
    if (!fruit) return fruit;
    const g = game || window.__remixGame;
    const mgr = (g && g.wa) || null;
    const needHe = !fruit.He || typeof fruit.He.x !== "number";
    if (needHe) {
      // Match g7: random He only while Winged; Magnet zeroes then pulls each tick.
      if (
        (window.__slotActive | 0) === 6 &&
        typeof N3E === "function" &&
        mgr
      ) {
        try {
          fruit.He = N3E(mgr);
        } catch (_n) {
          fruit.He = window.slot_vec(
            Math.random() < 0.5 ? -0.5 : 0.5,
            Math.random() < 0.5 ? -0.5 : 0.5
          );
        }
      } else {
        fruit.He = window.slot_vec(0, 0);
      }
    }
    if (!fruit.CAb || typeof fruit.CAb.x !== "number") {
      try {
        fruit.CAb =
          fruit.He && typeof fruit.He.clone === "function"
            ? fruit.He.clone()
            : window.slot_vec(fruit.He.x, fruit.He.y);
      } catch (_c) {
        fruit.CAb = window.slot_vec(
          fruit.He && fruit.He.x,
          fruit.He && fruit.He.y
        );
      }
    }
    if (!fruit.iL || typeof fruit.iL.x !== "number") {
      fruit.iL = window.slot_vec(1, 1);
    } else if (
      ((window.__slotActive | 0) === 6 || (window.__slotActive | 0) === 18) &&
      !fruit.iL.x &&
      !fruit.iL.y
    ) {
      // Leave-snap zeroes iL; re-enable while Winged/Magnet is live.
      fruit.iL.x = 1;
      fruit.iL.y = 1;
    }
    if (fruit.fD == null) fruit.fD = 0;
    if (fruit.xL == null) fruit.xL = 0;
    if (fruit.Lh == null) fruit.Lh = true;
    if (fruit.wm == null) fruit.wm = false;
    return fruit;
  };

  window.slot_ensure_board_motion = function slot_ensure_board_motion(mgr, game) {
    const list = mgr && mgr.ka;
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      window.slot_ensure_fruit_motion(list[i], game);
    }
  };

  // g7 expects (mgr, x, y) numeric — never pass a pos object (causes
  // Ultra off-board fruit + Arrow crash: setting '7[object Object]').
  window.slot_make_apple = function slot_make_apple(mgr, pos) {
    try {
      if (typeof window.bombFruit_make_apple_at === "function") {
        const made = window.bombFruit_make_apple_at(mgr, pos, null);
        if (made) {
          window.slot_ensure_fruit_motion(made);
          return made;
        }
      }
    } catch (_bf) {}
    const makeApple =
      window.__bombFruitMakeApple ||
      window.__chessMakeApple ||
      (typeof g7 === "function" ? g7 : null);
    const pickType =
      window.__bombFruitPickType ||
      window.__chessPickType ||
      (typeof Q3E === "function" ? Q3E : null);
    let dup = null;
    const lenBefore = mgr && mgr.ka ? mgr.ka.length : 0;
    try {
      if (typeof makeApple === "function") {
        dup = makeApple(mgr, 0, 0);
        if (mgr && mgr.ka && mgr.ka.length > lenBefore) {
          dup = mgr.ka.pop();
          while (mgr.ka.length > lenBefore) mgr.ka.pop();
        }
      }
    } catch (_e) {
      dup = null;
    }
    if (!dup) {
      dup = { type: 0, Oka: false, nba: void 0 };
    }
    const px = pos && pos.x != null ? pos.x | 0 : 0;
    const py = pos && pos.y != null ? pos.y | 0 : 0;
    if (pos && typeof pos.clone === "function") {
      try {
        dup.pos = pos.clone();
      } catch (_c) {
        dup.pos = window.slot_make_pos(px, py);
      }
    } else {
      dup.pos = window.slot_make_pos(px, py);
    }
    if (typeof pickType === "function") {
      try {
        dup.type = pickType(mgr);
      } catch (_t) {}
    }
    dup.Oka = !!dup.Oka;
    // g7 may stamp nba while e7(15) is borrowed (chess/bomb/shield leftovers).
    // Real Shield bars are re-applied only via slot_apply_shield.
    dup.nba = undefined;
    dup.__slotShield = false;
    dup.__ultraKeepShield = false;
    window.slot_ensure_fruit_motion(dup);
    try {
      const g = window.__remixGame || (mgr && mgr.wb);
      if (dup.pos) {
        window.slot_clear_arrow_at &&
          window.slot_clear_arrow_at(g, dup.pos.x, dup.pos.y);
      }
    } catch (_ar) {}
    return dup;
  };

  // Always use Shield-style head radius (native flag 2 / Manhattan > 3).
  // d4E signature is (mgr, exclude, radiusFlag) — never pass the flag as arg2.
  // Never return a wall or bridge cell (chess freePos ignores leftover walls).
  window.slot_free_pos = function slot_free_pos(mgr, _flagIgnored) {
    const board = mgr && mgr.oa;
    const game = window.__remixGame || (mgr && mgr.wb);
    const freePos =
      window.__bombFruitFreePos ||
      window.__chessFreePos ||
      (typeof d4E === "function" ? d4E : null);
    const sokoOcc = window.slot_add_soko_keys(game, new Set(), null);
    const ok = function (p) {
      if (!p || p.x == null || p.y == null) return false;
      if (window.slot_pos_in_wall(game, p.x, p.y)) return false;
      if (window.slot_pos_on_bridge(game, p.x, p.y)) return false;
      // While Slot Mexico mid border is up, never spawn fruit on mid-y
      // (partial wall leaves gaps that freePos would otherwise fill).
      if (
        window.slot_mexico_blocks_mid_fruit &&
        window.slot_mexico_blocks_mid_fruit()
      ) {
        const mid = window.slot_mexico_mid_y(game) | 0;
        if ((p.y | 0) === mid) return false;
      }
      if (sokoOcc.has((p.x | 0) + "," + (p.y | 0))) return false;
      if (
        window.chess_outside_spawn_radius &&
        !window.chess_outside_spawn_radius(game, p)
      ) {
        return false;
      }
      return true;
    };
    try {
      if (typeof window.chess_find_legal_spawn === "function") {
        const occ =
          typeof window.chess_occupied_keys === "function"
            ? window.chess_occupied_keys(game, (mgr && mgr.ka) || [], new Set())
            : new Set();
        window.slot_add_wall_keys(game, occ);
        window.slot_add_bridge_keys(game, occ);
        window.slot_add_soko_keys(game, occ, null);
        for (let attempt = 0; attempt < 24; attempt++) {
          const p = window.chess_find_legal_spawn(board, freePos, occ, null);
          if (ok(p)) return window.slot_make_pos(p.x, p.y);
        }
      }
    } catch (_chess) {}
    try {
      if (typeof freePos === "function" && mgr) {
        for (let attempt = 0; attempt < 24; attempt++) {
          const p = freePos(mgr, null, 2);
          if (ok(p)) return window.slot_make_pos(p.x, p.y);
        }
      }
    } catch (_e) {}
    try {
      const g = game || window.__remixGame;
      if (g && typeof g.Rb === "function") {
        for (let attempt = 0; attempt < 16; attempt++) {
          const p = g.Rb(null, 2);
          if (ok(p)) return window.slot_make_pos(p.x, p.y);
        }
      }
    } catch (_rb) {}
    try {
      const g = game || window.__remixGame;
      let w = 0;
      let h = 0;
      if (typeof window.chess_board_size === "function" && (board || mgr)) {
        const size = window.chess_board_size(board || mgr);
        if (size) {
          w = size.width | 0;
          h = size.height | 0;
        }
      }
      const walls = g && g.Ca && g.Ca.wa;
      if ((!w || !h) && walls && walls.length) {
        h = walls.length;
        w = walls[0] ? walls[0].length : 0;
      }
      if (!w || !h) return null;
      const occ = new Set();
      const list = (mgr && mgr.ka) || [];
      for (let i = 0; i < list.length; i++) {
        const p = list[i] && list[i].pos;
        if (p && typeof p.x === "number" && typeof p.y === "number") {
          occ.add((p.x | 0) + "," + (p.y | 0));
        }
      }
      try {
        // Snake body lives on game.oa.ka (same as Chess/BombFruit).
        const snake = g && g.oa;
        const body = snake && snake.ka;
        if (body && body.length) {
          for (let i = 0; i < body.length; i++) {
            const seg = body[i];
            const p = seg && (seg.pos || seg);
            if (p && typeof p.x === "number") {
              occ.add((p.x | 0) + "," + (p.y | 0));
            }
          }
        }
      } catch (_s) {}
      window.slot_add_wall_keys(g, occ);
      window.slot_add_bridge_keys(g, occ);
      window.slot_add_soko_keys(g, occ, null);
      const start = (Math.random() * (w * h)) | 0;
      for (let n = 0; n < w * h; n++) {
        const i = (start + n) % (w * h);
        const x = i % w;
        const y = (i / w) | 0;
        if (occ.has(x + "," + y)) continue;
        if (window.slot_pos_in_wall(g, x, y)) continue;
        if (window.slot_pos_on_bridge(g, x, y)) continue;
        if (
          window.slot_mexico_blocks_mid_fruit &&
          window.slot_mexico_blocks_mid_fruit() &&
          (y | 0) === (window.slot_mexico_mid_y(g) | 0)
        ) {
          continue;
        }
        const pos = window.slot_make_pos(x, y);
        if (
          window.chess_outside_spawn_radius &&
          !window.chess_outside_spawn_radius(g, pos)
        ) {
          continue;
        }
        return pos;
      }
    } catch (_e2) {}
    return null;
  };

  // After eat splice: native Vm relocates the same apple — skip Vm and spawn fresh.
  window.slot_eat_respawn = function slot_eat_respawn(game) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    const g = game || window.__remixGame;
    if (g) window.__remixGame = g;
    const mgr = g && g.wa;
    const eatenMode = window.__slotEatenMode;
    const eaten = window.__slotEatenFruit;
    window.__slotEating = false;
    window.__slotForceEntitySpawn = false;
    window.__slotPortalPairSeq = window.__slotPortalPairSeq | 0;
    // Mark before respawn so a later splice-time on_eating / f4E unlock
    // cannot re-arm eat-respawn and double-plant key/soko.
    window.__slotRespawnedThisEat = true;

    // Piece pickup: never refill. Unlock fruit handles the next spawn.
    // Prefer the eaten apple's isPiece over sticky just_ate.
    if (eaten) {
      if (eaten.isPiece) {
        window.__slotEatenFruit = null;
        window.__slotEatenMode = null;
        window.just_ate = "piece";
        return;
      }
      window.just_ate = "fruit";
    } else if (window.just_ate === "piece") {
      window.__slotEatenFruit = null;
      window.__slotEatenMode = null;
      return;
    }

    if (eaten && eaten.Oka) {
      // Poison hazard: never treat as board-clear win.
      window.__slotEatenFruit = null;
      window.__slotEatenMode = null;
      return;
    }

    // Portal pair teleport: note exit twin for post-splice removal (j4E skipped).
    // Only marked portal fruits — never even/odd-pair leftovers.
    if (eaten && eaten.__slotPortal) {
      try {
        window.slot_note_portal_twin(mgr, eaten);
      } catch (_e) {}
    }

    if (eatenMode != null) {
      // Mexico (27) goes through slotRespawn like Portal — tally/dice store it
      // instead of planting a mid-board pair.
      window.slotRespawn(eatenMode, g);
    } else if (eaten && !eaten.isPiece && !eaten.Oka) {
      // Unbadged unlock fruit (or missed stamp): still refill one badge fruit.
      const mode = window.slot_draw_mode() | 0;
      window.slotRespawn(mode, g);
    }
    // Win before clearing eaten so last-fruit + spawn-fail is detected even
    // though the splice has not removed the apple yet.
    window.slot_win_if_empty(g, mgr);
    window.__slotEatenFruit = null;
    window.__slotEatenMode = null;
  };

  window.slot_stamp_new = function slot_stamp_new(mgr, fromIndex, pairShared) {
    if (!mgr || !mgr.ka) return;
    const list = mgr.ka;
    if (pairShared && list.length - fromIndex >= 2) {
      const a = list[list.length - 2];
      const b = list[list.length - 1];
      window.slot_assign_pair(a, b);
      return;
    }
    for (let i = fromIndex; i < list.length; i++) {
      const f = list[i];
      if (!f || f.Oka || f.isPiece) continue;
      if (f.slotMode == null) window.assignSlotMode(f);
    }
  };

  window.slot_is_chess_mode = function slot_is_chess_mode(mode) {
    const m = mode | 0;
    if (window.CHESS_MODE != null && m === (window.CHESS_MODE | 0)) return true;
    // Pool / SpeedInfo use 24 for Chess after Candy (23).
    return m === 24;
  };

  // Match DiceCounts: classic dice (4) + blue/green/black colored dice.
  window.slot_is_dice_count = function slot_is_dice_count(game) {
    const g = game || window.__remixGame;
    const ka = g && g.settings && (g.settings.ka | 0);
    if (typeof window.remixIsDiceLike === "function") {
      try {
        return !!window.remixIsDiceLike(ka);
      } catch (_e) {}
    }
    return ka === 4;
  };

  window.slot_dice_spawn_n = function slot_dice_spawn_n(game) {
    const g = game || window.__remixGame;
    const ka = g && g.settings && g.settings.ka;
    const classic = Math.max(1, Math.ceil(Math.random() * 6) | 0);
    if (typeof window.remixDiceSpawnCount === "function") {
      try {
        const n = window.remixDiceSpawnCount(ka, classic);
        if (n > 0) return n | 0;
      } catch (_e) {}
    }
    if (typeof window.remixColoredDiceRoll === "function") {
      try {
        const n = window.remixColoredDiceRoll(ka);
        if (n != null && n > 0) return n | 0;
      } catch (_e2) {}
    }
    return classic;
  };

  // Native bomb count (ka===5): no mid-board top-up; first empty board → 24
  // via u7E (then kc so it does not repeat).
  window.slot_is_bomb_count = function slot_is_bomb_count(game) {
    const g = game || window.__remixGame;
    return !!(g && g.settings && (g.settings.ka | 0) === 5);
  };

  window.slot_bomb_spawn_n = function slot_bomb_spawn_n(_game) {
    return 24;
  };

  // Native tally (ka===6): no mid-board top-up; empty → t7E plants 5 (10 with
  // Dimension) and stamps sequenceNumber n..1 with mgr.wa = 1 (current index).
  window.slot_is_tally_count = function slot_is_tally_count(game) {
    const g = game || window.__remixGame;
    return !!(g && g.settings && (g.settings.ka | 0) === 6);
  };

  window.slot_tally_spawn_n = function slot_tally_spawn_n(game) {
    const g = game || window.__remixGame;
    try {
      if (
        g &&
        g.settings &&
        typeof e7 === "function" &&
        e7(g.settings, 11)
      ) {
        return 10;
      }
    } catch (_e) {}
    return 5;
  };

  window.slot_index_tally_fruits = function slot_index_tally_fruits(
    mgr,
    fromIndex
  ) {
    if (!mgr || !mgr.ka) return;
    const start = Math.max(0, fromIndex | 0);
    const list = mgr.ka;
    // Group into tally units: a portal pair shares one index; everything
    // else (including each chess piece) gets its own.
    const units = [];
    const seenPortalPair = Object.create(null);
    for (let i = start; i < list.length; i++) {
      const f = list[i];
      if (!f || f.Oka) continue;
      if (f.__slotPortal) {
        const pid = f.__slotPortalPairId;
        if (pid != null) {
          if (seenPortalPair[pid]) continue;
          seenPortalPair[pid] = 1;
          const pair = [f];
          let twin = f.__slotPortalTwin;
          if (!twin || list.indexOf(twin) < 0) {
            twin = null;
            for (let j = start; j < list.length; j++) {
              const o = list[j];
              if (
                o &&
                o !== f &&
                o.__slotPortal &&
                o.__slotPortalPairId === pid
              ) {
                twin = o;
                break;
              }
            }
          }
          if (twin) pair.push(twin);
          units.push(pair);
          continue;
        }
        // Marked portal without pair id: still try twin link.
        let twin = f.__slotPortalTwin;
        if (twin && list.indexOf(twin) >= 0 && !twin.Oka) {
          if (twin.__slotTallyGrouped) continue;
          f.__slotTallyGrouped = 1;
          twin.__slotTallyGrouped = 1;
          units.push([f, twin]);
          continue;
        }
      }
      units.push([f]);
    }
    for (let i = start; i < list.length; i++) {
      const f = list[i];
      if (f) delete f.__slotTallyGrouped;
    }
    const n = units.length;
    for (let e = 0; e < n; e++) {
      // Match t7E: first unit gets n, last gets 1. Portal pair both get it.
      const seq = n - e;
      const unit = units[e];
      for (let k = 0; k < unit.length; k++) {
        unit[k].sequenceNumber = seq;
      }
    }
    // Current edible tally index (native a.wa.wa = 1 after t7E).
    mgr.wa = 1;
    try {
      if (mgr.Ca != null) mgr.Ca = false;
    } catch (_c) {}
  };

  // Highest sequenceNumber among board apples (skip poison; optional exclude).
  window.slot_tally_board_max_sequence = function slot_tally_board_max_sequence(
    mgr,
    excludeFruit
  ) {
    if (!mgr || !mgr.ka) return 0;
    let max = 0;
    for (let i = 0; i < mgr.ka.length; i++) {
      const f = mgr.ka[i];
      if (!f || f.Oka || f === excludeFruit) continue;
      const s = f.sequenceNumber | 0;
      if (s > max) max = s;
    }
    return max;
  };

  // Key/soko unlock fruit under Slot tally: next index = board max + 1.
  window.slot_stamp_tally_unlock_index = function slot_stamp_tally_unlock_index(
    fruit,
    mgr
  ) {
    if (!fruit || fruit.Oka) return false;
    const g = window.__remixGame;
    if (!window.slot_is_tally_count || !window.slot_is_tally_count(g)) {
      return false;
    }
    const next = (window.slot_tally_board_max_sequence(mgr, fruit) | 0) + 1;
    fruit.sequenceNumber = next;
    return true;
  };

  // Fruit still on the board for refill purposes, excluding the eaten apple
  // (Vm/slot_eat_respawn run before the eat splice removes it).
  // Chess pieces count (they are indexed under tally and block empty waves).
  window.slot_fruit_left_excluding_eaten = function slot_fruit_left_excluding_eaten(
    mgr
  ) {
    const list = mgr && mgr.ka;
    if (!list || !list.length) return 0;
    const eaten = window.__slotEatenFruit;
    let n = 0;
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || f.Oka) continue;
      if (eaten && f === eaten) continue;
      n++;
    }
    return n;
  };

  // Portal / Mexico / Key / Soko / Chess / Poison — FIFO-deferred under Dice,
  // Tally, and Bomb first wave (pre-kc) instead of mid-wave refill.
  window.slot_is_store_special = function slot_is_store_special(mode) {
    const m = mode | 0;
    if (m === 2 || m === 27 || m === 8 || m === 9 || m === 10) return true;
    return !!(window.slot_is_chess_mode && window.slot_is_chess_mode(m));
  };

  window.slot_uses_special_store = function slot_uses_special_store(game) {
    const g = game || window.__remixGame;
    if (!g) return false;
    if (window.slot_is_dice_count && window.slot_is_dice_count(g)) return true;
    if (window.slot_is_tally_count && window.slot_is_tally_count(g)) return true;
    if (window.slot_is_bomb_count && window.slot_is_bomb_count(g) && !g.kc) {
      return true;
    }
    return false;
  };

  window.slot_store_push = function slot_store_push(mode) {
    if (!window.__slotSpecialStore) window.__slotSpecialStore = [];
    window.__slotSpecialStore.push(mode | 0);
  };

  window.slot_store_shift = function slot_store_shift() {
    if (!window.__slotSpecialStore || !window.__slotSpecialStore.length) {
      return null;
    }
    return window.__slotSpecialStore.shift();
  };

  window.slot_store_unshift = function slot_store_unshift(mode) {
    if (!window.__slotSpecialStore) window.__slotSpecialStore = [];
    window.__slotSpecialStore.unshift(mode | 0);
  };

  window.slot_keys_or_soko_blocking = function slot_keys_or_soko_blocking(game) {
    const g = game || window.__remixGame;
    if (window.slot_has_keys && window.slot_has_keys(g)) return true;
    if (window.slot_has_sokoboxes && window.slot_has_sokoboxes(g)) return true;
    return false;
  };

  // Plant one special spawn unit (may add multiple entities). Used by immediate
  // refill and by FIFO wave dequeue. Does not touch the store queue.
  window.slot_plant_special_unit = function slot_plant_special_unit(mode, game) {
    const g = game || window.__remixGame;
    if (!g || !g.wa) return false;
    const mgr = g.wa;
    const m = mode | 0;
    const chessMode = window.slot_is_chess_mode(m);

    if (m === 2) {
      // Portal pairs: while Mexico mid is up, plant strict top+bottom (never mid).
      // Do not tag as Mexico portals (those clear the mid border on eat).
      if (window.__slotMexicoMidUp) {
        const occ = new Set();
        for (let i = 0; i < mgr.ka.length; i++) {
          const f = mgr.ka[i];
          if (!f || !f.pos) continue;
          occ.add((f.pos.x | 0) + "," + (f.pos.y | 0));
        }
        const top = window.slot_mexico_find_half_pos(mgr, "top", occ);
        if (!top) return false;
        occ.add((top.x | 0) + "," + (top.y | 0));
        const bot = window.slot_mexico_find_half_pos(mgr, "bottom", occ);
        if (!bot) return false;
        const a = window.slot_make_apple(mgr, top);
        const b = window.slot_make_apple(mgr, bot);
        window.slot_assign_pair(a, b);
        mgr.ka.push(a, b);
        window.slot_ensure_unique_fruit_types(mgr);
        window.appleArray = mgr.ka;
        return true;
      }
      const p1 = window.slot_free_pos(mgr, 0);
      if (!p1) return false;
      const hold = window.slot_make_apple(mgr, p1);
      mgr.ka.push(hold);
      const p2 = window.slot_free_pos(mgr, 0);
      mgr.ka.pop();
      if (!p2) return false;
      const a = window.slot_make_apple(mgr, p1);
      const b = window.slot_make_apple(mgr, p2);
      window.slot_assign_pair(a, b);
      mgr.ka.push(a, b);
      window.slot_ensure_unique_fruit_types(mgr);
      window.appleArray = mgr.ka;
      return true;
    }

    // Mexico badge unit: top+bottom portal pair (+ mid wall if not already up).
    // Counts as one tally index (pair shares sequenceNumber via __slotPortal).
    if (m === 27) {
      return !!(window.slot_mexico_on_eat && window.slot_mexico_on_eat(g));
    }

    if (m === 8) {
      const ba = g.Ba;
      const plant =
        window.__slotQ6E ||
        (typeof q6E === "function" ? q6E : null);
      if (ba && typeof plant === "function") {
        const beforeKeys = (ba.keys && ba.keys.length) | 0;
        window.__slotAllowKeyPlant = true;
        try {
          plant(ba, beforeKeys, true);
        } catch (_e) {
        } finally {
          window.__slotAllowKeyPlant = false;
        }
        if (((ba.keys && ba.keys.length) | 0) > beforeKeys) return true;
      }
      if (
        typeof window.placeKey === "function" &&
        typeof window.placeKeyblock === "function"
      ) {
        const kp = window.slot_free_pos(mgr, 6) || window.slot_free_pos(mgr, 0);
        if (kp) {
          const hold = window.slot_make_apple(mgr, kp);
          mgr.ka.push(hold);
          const bp = window.slot_free_pos(mgr, 0);
          mgr.ka.pop();
          if (bp) {
            const type = Math.floor(Math.random() * 8) | 0;
            window.__slotAllowKeyPlant = true;
            try {
              window.placeKey(kp.x, kp.y, type);
              window.placeKeyblock(bp.x, bp.y, type);
              if (window.slot_has_keys(g)) return true;
            } catch (_e2) {
            } finally {
              window.__slotAllowKeyPlant = false;
            }
          }
        }
      }
      return false;
    }

    if (m === 9) {
      const aa = g.Aa;
      const sokoSize = (set) => {
        try {
          if (!set) return 0;
          if (typeof set.size === "number") return set.size | 0;
          let n = 0;
          for (const _ of set) n++;
          return n;
        } catch (_e) {
          return 0;
        }
      };
      const beforeBoxes = sokoSize(aa && aa.oa);
      const beforeGoals = sokoSize(aa && aa.d_);
      const hasFruit = !!(mgr.ka && mgr.ka.length);
      const plant =
        window.__slotE5E ||
        (typeof e5E === "function" ? e5E : null);
      // Native e5E ignores leftover fruit and can stack a box on an apple.
      // With fruit on the board, plant via slot_free_pos only.
      if (!hasFruit && aa && typeof plant === "function") {
        window.__slotAllowSokoPlant = true;
        try {
          plant(aa, (g.Ba && g.Ba.keys && g.Ba.keys.length) | 0, true, true);
        } catch (_e) {
        } finally {
          window.__slotAllowSokoPlant = false;
        }
      }
      let boxes = sokoSize(aa && aa.oa);
      let goals = sokoSize(aa && aa.d_);
      if (boxes > beforeBoxes || goals > beforeGoals) {
        try {
          window.slot_soko_resolve_body_overlaps &&
            window.slot_soko_resolve_body_overlaps(g);
        } catch (_r) {}
        boxes = sokoSize(aa && aa.oa);
        goals = sokoSize(aa && aa.d_);
        if (boxes > beforeBoxes || goals > beforeGoals) return true;
      }

      const bp = window.slot_free_pos(mgr, 8) || window.slot_free_pos(mgr, 0);
      if (bp && aa) {
        const hold = window.slot_make_apple(mgr, bp);
        mgr.ka.push(hold);
        const gp = window.slot_free_pos(mgr, 0);
        mgr.ka.pop();
        if (gp) {
          window.__slotAllowSokoPlant = true;
          try {
            if (
              typeof window.placeSokobox === "function" &&
              typeof window.placeSokogoal === "function"
            ) {
              window.placeSokobox(bp.x, bp.y);
              window.placeSokogoal(gp.x, gp.y);
            }
          } catch (_e2) {
          } finally {
            window.__slotAllowSokoPlant = false;
          }
          boxes = sokoSize(aa.oa);
          goals = sokoSize(aa.d_);
          if (boxes > beforeBoxes || goals > beforeGoals) {
            try {
              window.slot_soko_resolve_body_overlaps &&
                window.slot_soko_resolve_body_overlaps(g);
            } catch (_r2) {}
            return true;
          }
          window.__slotAllowSokoPlant = true;
          try {
            if (aa.oa && typeof aa.oa.add === "function") {
              aa.oa.add({
                pos: window.slot_make_pos(bp.x, bp.y),
                prev: null,
                wm: true,
                Lh: true,
              });
            }
            if (aa.d_ && typeof aa.d_.add === "function") {
              aa.d_.add(window.slot_make_pos(gp.x, gp.y));
            }
          } catch (_e3) {
          } finally {
            window.__slotAllowSokoPlant = false;
          }
          boxes = sokoSize(aa.oa);
          goals = sokoSize(aa.d_);
          if (boxes > beforeBoxes || goals > beforeGoals) {
            try {
              window.slot_soko_resolve_body_overlaps &&
                window.slot_soko_resolve_body_overlaps(g);
            } catch (_r3) {}
            return true;
          }
        }
      }
      return false;
    }

    if (chessMode) {
      const makeFn =
        window.__chessMakeApple ||
        window.__bombFruitMakeApple ||
        (typeof g7 === "function" ? g7 : null);
      const freeFn =
        window.__chessFreePos ||
        window.__bombFruitFreePos ||
        (typeof d4E === "function" ? d4E : null);
      const pickFn =
        window.__chessPickType ||
        window.__bombFruitPickType ||
        (typeof Q3E === "function" ? Q3E : null);

      let added = 0;
      if (typeof window.chess_fruit_respawn === "function" && makeFn) {
        try {
          window.__slotAllowChessFruitRespawn = true;
          added = window.chess_fruit_respawn(mgr, makeFn, freeFn, pickFn) | 0;
        } catch (_e) {
          added = 0;
        } finally {
          window.__slotAllowChessFruitRespawn = false;
        }
        // Native freePos can land on leftover bridges; kick pieces off.
        try {
          window.slot_relocate_fruit_off_bridges(mgr);
        } catch (_br) {}
      }

      if (added < 2) {
        const p1 = window.slot_free_pos(mgr, 0);
        if (!p1) return false;
        const hold = window.slot_make_apple(mgr, p1);
        mgr.ka.push(hold);
        const p2 = window.slot_free_pos(mgr, 0);
        mgr.ka.pop();
        if (!p2) return false;
        const a = window.slot_make_apple(mgr, p1);
        const b = window.slot_make_apple(mgr, p2);
        if (typeof window.chess_assign_piece === "function") {
          window.chess_assign_piece(a);
          window.chess_assign_piece(b);
        } else {
          a.isPiece = true;
          b.isPiece = true;
          a.ChessPiece = a.ChessPiece || "pawn";
          b.ChessPiece = b.ChessPiece || "pawn";
        }
        delete a.slotMode;
        delete b.slotMode;
        a.__slotShield = false;
        b.__slotShield = false;
        mgr.ka.push(a, b);
        added = 2;
      }

      for (let i = mgr.ka.length - added; i < mgr.ka.length; i++) {
        const f = mgr.ka[i];
        if (!f) continue;
        f.isPiece = true;
        delete f.slotMode;
      }
      window.appleArray = mgr.ka;
      return added > 0;
    }

    if (m === 10) {
      // Poison badge: one random-badge fruit + one badge-less poison hazard.
      // Native g4E/e4E/l4E top-up stays gated under Slot (no half-board Okas).
      let planted = 0;
      const safePos = window.slot_free_pos(mgr);
      if (safePos) {
        const fruit = window.slot_make_apple(mgr, safePos);
        fruit.Oka = false;
        window.assignSlotMode(fruit);
        mgr.ka.push(fruit);
        planted++;
      }
      const poisonPos = window.slot_free_pos(mgr);
      if (poisonPos) {
        const poison = window.slot_make_apple(mgr, poisonPos);
        poison.Oka = true;
        poison.__slotPoison = true;
        delete poison.slotMode;
        mgr.ka.push(poison);
        planted++;
      }
      window.slot_ensure_unique_fruit_types(mgr);
      window.appleArray = mgr.ka;
      return planted > 0;
    }

    return false;
  };

  window.slot_plant_badge_unit = function slot_plant_badge_unit(game, eatenMode) {
    const g = game || window.__remixGame;
    if (!g || !g.wa) return false;
    const mgr = g.wa;
    const m = eatenMode | 0;
    const pos = window.slot_free_pos(mgr);
    if (!pos) return false;
    const fruit = window.slot_make_apple(mgr, pos);
    window.assignSlotMode(fruit);
    mgr.ka.push(fruit);
    if (m === 25 && typeof window.burger_assign_timers_all === "function") {
      try {
        window.burger_assign_timers_all([fruit]);
      } catch (_e) {}
    }
    return true;
  };

  // Plant N spawn units: FIFO specials first, then random badge fruits.
  window.slot_plant_wave_units = function slot_plant_wave_units(
    game,
    n,
    eatenMode,
    opts
  ) {
    const g = game || window.__remixGame;
    if (!g || !g.wa) return 0;
    const mgr = g.wa;
    const count = Math.max(0, n | 0);
    const plantStart = mgr.ka.length;
    let units = 0;
    for (let i = 0; i < count; i++) {
      const special = window.slot_store_shift();
      if (special != null) {
        if (window.slot_plant_special_unit(special, g)) {
          units++;
        } else {
          window.slot_store_unshift(special);
          break;
        }
      } else if (window.slot_plant_badge_unit(g, eatenMode)) {
        units++;
      } else {
        break;
      }
    }
    if (opts && opts.indexTally) {
      window.slot_index_tally_fruits(mgr, plantStart);
    }
    window.slot_ensure_unique_fruit_types(mgr);
    window.appleArray = mgr.ka;
    return units;
  };

  window.slotRespawn = function slotRespawn(mode, game) {
    const g = game || window.__remixGame;
    if (!g || !g.wa) return false;
    const mgr = g.wa;
    const m = mode | 0;
    const before = mgr.ka.length;
    const usesStore = window.slot_uses_special_store(g);
    const isStoreSpecial = window.slot_is_store_special(m);

    // Dice / Tally / Bomb-pre-kc: defer store-set badges (no mid-wave plant).
    if (usesStore && isStoreSpecial) {
      window.slot_store_push(m);
    } else if (isStoreSpecial) {
      const ok = window.slot_plant_special_unit(m, g);
      if (!ok) window.slot_win_if_empty(g, mgr);
      return ok;
    }

    // Dice-like: empty → roll N units (FIFO specials then badges). Next wave
    // waits for keys/soko to clear (unlike Bomb first wave).
    if (window.slot_is_dice_count(g)) {
      if (window.slot_fruit_left_excluding_eaten(mgr) > 0) {
        window.appleArray = mgr.ka;
        return false;
      }
      if (window.slot_keys_or_soko_blocking(g)) {
        window.appleArray = mgr.ka;
        return false;
      }
      const n = window.slot_dice_spawn_n(g);
      const planted = window.slot_plant_wave_units(g, n, m, null);
      if (planted === 0) {
        window.slot_win_if_empty(g, mgr);
        return false;
      }
      if (m === 28) window.slot_arm_new_bomb_fruits(mgr, before);
      return true;
    }

    // Bomb count (ka===5): mid-board skip until first empty → 24 units + kc.
    // Do NOT wait for keys/soko; FIFO specials fold into the 24. After kc,
    // fall through to normal per-badge refill (immediate specials).
    if (window.slot_is_bomb_count(g) && !g.kc) {
      if (window.slot_fruit_left_excluding_eaten(mgr) > 0) {
        window.appleArray = mgr.ka;
        return false;
      }
      const n = window.slot_bomb_spawn_n(g);
      const planted = window.slot_plant_wave_units(g, n, m, null);
      if (planted > 0) g.kc = true;
      if (planted === 0) {
        window.slot_win_if_empty(g, mgr);
        return false;
      }
      if (m === 28) window.slot_arm_new_bomb_fruits(mgr, before);
      return true;
    }

    // Tally count (ka===6): empty → 5/10 indexed units; wait for keys/soko.
    if (window.slot_is_tally_count(g)) {
      if (window.slot_fruit_left_excluding_eaten(mgr) > 0) {
        window.appleArray = mgr.ka;
        return false;
      }
      if (window.slot_keys_or_soko_blocking(g)) {
        window.appleArray = mgr.ka;
        return false;
      }
      const n = window.slot_tally_spawn_n(g);
      const planted = window.slot_plant_wave_units(g, n, m, { indexTally: true });
      if (planted === 0) {
        window.slot_win_if_empty(g, mgr);
        return false;
      }
      if (m === 28) window.slot_arm_new_bomb_fruits(mgr, before);
      return true;
    }

    // Default single fruit (Shield gets bars; Bomb may arm later via BombFruit).
    const pos = window.slot_free_pos(mgr);
    if (!pos) {
      window.slot_win_if_empty(g, mgr);
      return false;
    }
    const fruit = window.slot_make_apple(mgr, pos);
    window.assignSlotMode(fruit);
    // Shields: assignSlotMode applies P3E while Shield roll is active (or the
    // fruit itself rolled Shield). Do not force bars from eaten mode alone
    // after leaving Shield — that would re-shield every later refill.
    mgr.ka.push(fruit);
    window.slot_ensure_unique_fruit_types(mgr);
    window.appleArray = mgr.ka;

    // Burger: assign timer if Burger helpers exist and mode is burger.
    if (m === 25 && typeof window.burger_assign_timers_all === "function") {
      try {
        window.burger_assign_timers_all([fruit]);
      } catch (_e) {}
    }

    // Bomb badge refill: idle ring only on the newly spawned fruit(s).
    if (m === 28) window.slot_arm_new_bomb_fruits(mgr, before);

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
    addedHint,
    game
  ) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    const g = game || window.__remixGame;
    if (g) window.__remixGame = g;

    // Eat path uses slot_eat_respawn (Vm skipped). This hook is for f4E /
    // dice / bomb multi-adds: strip unbadged native refill if we still owe
    // a slot respawn, otherwise just stamp badges.
    // Key/soko unlock also calls f4E — never treat that as badge eat-respawn.
    // Even if splice re-armed __slotEating, unlocking must keep the native
    // fruit at the keyblock/goal (not plant another key/box).
    const eatenMode = window.__slotEatenMode;
    const em = eatenMode | 0;
    // Burger expire→spawn uses qaF while the Burger roll is live. Never treat
    // that as a badge-eat refill (stale __slotEating would strip the replacement
    // and can cascade into mass poison conversions).
    if (window.__slotBurgerSpawning) {
      if (mgr && mgr.ka) {
        for (let i = 0; i < mgr.ka.length; i++) {
          const f = mgr.ka[i];
          if (f && !f.Oka && !f.isPiece && f.slotMode == null) {
            window.assignSlotMode(f);
          }
        }
        window.slot_ensure_unique_fruit_types(mgr);
      }
      return;
    }
    if (
      eatenMode != null &&
      window.__slotEating &&
      !window.__slotRespawnedThisEat &&
      em !== 8 &&
      em !== 9 &&
      em !== 10
    ) {
      if (mgr && mgr.ka && (addedHint | 0) > 0) {
        const n = Math.min(addedHint | 0, mgr.ka.length);
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
      window.__slotEating = false;
      window.__slotRespawnedThisEat = true;
      window.slot_win_if_empty(g, mgr);
      return;
    }
    // Stale eat flags after a completed badge respawn (splice re-armed them
    // before the activatedFruit guard existed) — drop them so unlock is safe.
    if (window.__slotRespawnedThisEat) {
      window.__slotEating = false;
      window.__slotEatenMode = null;
      window.__slotEatenFruit = null;
      window.__slotActivatedFruit = null;
    }

    if (mgr && mgr.ka) {
      // Key/soko unlock: never leave a chess piece in the keyblock/goal.
      // Chess-roll convert can race f4E; demote then badge.
      const unlock =
        !!window.slot_key_unlock_fruit || !!window.slot_soko_unlock_fruit;
      if (unlock) {
        const n = Math.max(1, addedHint | 0);
        const from = Math.max(0, mgr.ka.length - n);
        for (let i = from; i < mgr.ka.length; i++) {
          const f = mgr.ka[i];
          if (!f || f.Oka) continue;
          if (
            f.isPiece ||
            f.ChessPiece != null ||
            f.ChessColor != null ||
            (window.slot_is_chess_piece_type &&
              window.slot_is_chess_piece_type(f.type))
          ) {
            window.slot_demote_chess_piece_to_fruit(f, mgr);
          }
        }
      }

      const justBadged = [];
      for (let i = 0; i < mgr.ka.length; i++) {
        const f = mgr.ka[i];
        if (f && !f.Oka && !f.isPiece && f.slotMode == null) {
          window.assignSlotMode(f);
          justBadged.push(f);
        }
      }
      if ((window.__slotActive | 0) === 15) {
        window.slot_mark_existing_shields(mgr);
      }
      window.slot_ensure_unique_fruit_types(mgr);

      // Key / soko unlock under tally: fruit gets max(board index) + 1.
      window.slot_key_unlock_fruit = 0;
      window.slot_soko_unlock_fruit = 0;
      if (unlock && window.slot_is_tally_count && window.slot_is_tally_count(g)) {
        const targets =
          justBadged.length > 0
            ? justBadged
            : (addedHint | 0) > 0
              ? mgr.ka.slice(Math.max(0, mgr.ka.length - (addedHint | 0)))
              : [];
        for (let i = 0; i < targets.length; i++) {
          const f = targets[i];
          if (!f || f.Oka) continue;
          window.slot_stamp_tally_unlock_index(f, mgr);
        }
      }
    }
  };

  window.slot_after_layout = function slot_after_layout(mgr) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if (!mgr || !mgr.ka) return;
    // No mode is active until the first badge eat — never leave a roll on.
    window.__slotActive = null;
    window.__slotTwinLive = false;
    try {
      window.slot_sync_ultra_disables && window.slot_sync_ultra_disables();
    } catch (_e) {}
    // Start: strip any nba bars from shield-physics borrow during boot.
    window.slot_clear_fruit_shields(mgr);
    try {
      window.slot_sanitize_chess_identity(mgr);
    } catch (_id) {}
    // Start: singletons only — stamp each fruit uniquely from bag (repeats OK).
    // Do not form portal pairs here.
    for (let i = 0; i < mgr.ka.length; i++) {
      const f = mgr.ka[i];
      if (!f) continue;
      delete f.__slotPortal;
      delete f.__slotPortalPairId;
      delete f.__slotPortalTwin;
      if (!f.Oka && !f.isPiece && f.slotMode == null) {
        window.assignSlotMode(f);
      }
    }
    window.slot_ensure_unique_fruit_types(mgr);
    // Bridge plant can land on existing fruit; kick fruit off bridges.
    try {
      window.slot_relocate_fruit_off_bridges(mgr);
    } catch (_br) {}
    try {
      window.slot_clear_arrows_under_fruit &&
        window.slot_clear_arrows_under_fruit(mgr);
    } catch (_ar) {}
  };

  window.slot_tick_logic = function slot_tick_logic(game) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if (!game) return;
    window.__remixGame = game;
    const mgr = game.wa;
    if (!mgr || !mgr.ka) return;

    // Unlock badge: any non-piece non-poison fruit missing slotMode gets one
    // (Chess unlock, Key→keyblock, Sokobox→sokogoal).
    try {
      window.slot_sanitize_chess_identity(mgr);
    } catch (_id) {}
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
    window.slot_ensure_unique_fruit_types(mgr);

    // Burger skull conversion clears badge.
    window.slot_clear_poison_badges(mgr);

    // Burger roll must not timer/greyscale chess leftover pieces.
    if ((window.__slotActive | 0) === 25) {
      try {
        window.slot_strip_burger_from_pieces &&
          window.slot_strip_burger_from_pieces(mgr);
      } catch (_bg) {}
    }

    // If Winged/Magnet just ended (or leftovers drifted), keep fruit on tiles.
    const active = window.__slotActive | 0;
    if (active === 6 || active === 18) {
      // Safety: respawns / unlocks must never lack motion vectors under d7().
      try {
        window.slot_ensure_board_motion(mgr, game);
      } catch (_m) {}
    } else {
      let needsSnap = false;
      for (let i = 0; i < mgr.ka.length; i++) {
        const f = mgr.ka[i];
        if (!f || !f.pos) continue;
        if (f.pos.x !== Math.round(f.pos.x) || f.pos.y !== Math.round(f.pos.y)) {
          needsSnap = true;
          break;
        }
      }
      if (needsSnap) {
        try {
          window.slot_snap_fruit_tiles(mgr);
        } catch (_snap) {}
      }
    }

    // Keep Ultra disable flags + wall spawn in sync with active roll.
    try {
      window.slot_sync_ultra_disables && window.slot_sync_ultra_disables();
    } catch (_u) {}

    // Sokobox on snake body or fruit → relocate or despawn (+ win if empty).
    try {
      window.slot_soko_resolve_body_overlaps &&
        window.slot_soko_resolve_body_overlaps(game);
    } catch (_sk) {}

    // Bridges must never host fruit (spawn, plant-over, or leftover drift).
    try {
      window.slot_relocate_fruit_off_bridges(mgr, game);
    } catch (_br) {}

    // Fruit on an arrow tile clears that arrow.
    try {
      window.slot_clear_arrows_under_fruit &&
        window.slot_clear_arrows_under_fruit(mgr, game);
    } catch (_ar) {}

    // Armed Bomb zones left after leaving Bomb roll still countdown/boom.
    try {
      window.slot_bomb_leftover_tick && window.slot_bomb_leftover_tick(game);
    } catch (_bf) {}

    // Burger poisons keep despawning after leaving the Burger roll.
    try {
      window.slot_burger_leftover_tick && window.slot_burger_leftover_tick(game);
    } catch (_bg) {}

    // Mexico: clear mid when head is on the opposite half (teleport intentional).
    try {
      window.slot_mexico_tick_cross && window.slot_mexico_tick_cross(game);
    } catch (_mx) {}

      try {
      window.slot_update_cat_hud && window.slot_update_cat_hud();
      } catch (_e) {}

    // After chess unlock (head OPEN again), restore active badge trophy.
    try {
      if (
        (!window.head_state || window.head_state === "OPEN") &&
        window.__slotActive != null
      ) {
        window.slot_update_active_trophy && window.slot_update_active_trophy();
      }
    } catch (_tr) {}

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
      window.CHESS_MODE != null ? window.CHESS_MODE : 24,
      function () {
        const g = window.__remixGame;
        return !!(g && g.wa && window.slot_has_pieces(g.wa));
      }
    );
    wrapActive("isBombFruitActive", 28, function () {
      return !!(
        window.slot_has_bomb_plants && window.slot_has_bomb_plants()
      );
    });
    // Cat: always active under Slot Machine so lives HUD + spend work;
    // gain stays gated in cat_on_apple_eaten / slot_on_eating_fruit.
    wrapActive("isCatActive", 26, function () {
      return !!(window.isSlotMachineActive && window.isSlotMachineActive());
    });
  };
  window.__slotWrapActives();

  window.slot_update_cat_hud = function slot_update_cat_hud() {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if (typeof window.catEnsureLivesHud === "function") {
      window.catEnsureLivesHud();
    }
    if (typeof window.catUpdateLivesHud === "function") {
      window.catUpdateLivesHud();
    }
  };

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

  // Bomb Fruit: under Slot, never zone every apple — only __slotBombPlant
  // fruits from a Bomb-badge refill. Armed leftovers still tick/draw via
  // slot_bomb_leftover_* when the roll ends.
  if (
    typeof window.bombFruit_after_respawn === "function" &&
    !window.bombFruit_after_respawn.__slotGate
  ) {
    const origBf = window.bombFruit_after_respawn;
    window.bombFruit_after_respawn = function (mgr, added, allowEmptyWin) {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        if ((window.__slotActive | 0) !== 28) {
          // Left Bomb roll: still sync leftover plants/zones on eat, but never
          // arm new fruit or run init_all.
          if (
            mgr &&
            window.slot_has_bomb_plants &&
            window.slot_has_bomb_plants(mgr)
          ) {
            if (typeof window.bombFruit_sync_fruit_bombs === "function") {
              try {
                window.bombFruit_sync_fruit_bombs(mgr);
              } catch (_e) {}
            }
            window.slot_prune_bomb_zones_to_marked(mgr);
          }
          return;
        }
        // Bomb roll: sync/shields only for marked plants; never init_all.
        if (!mgr) return;
        if (typeof window.bombFruit_sync_fruit_bombs === "function") {
          try {
            window.bombFruit_sync_fruit_bombs(mgr);
          } catch (_e) {}
        }
        if (typeof window.bombFruit_clear_shields === "function") {
          try {
            window.bombFruit_clear_shields(mgr);
          } catch (_e2) {}
        }
        window.slot_prune_bomb_zones_to_marked(mgr);
        if (allowEmptyWin) {
          const g = window.__remixGame;
          // Under Slot, use slot win rules (keys/soko/chess count; poison does not).
          if (typeof window.slot_win_if_empty === "function") {
            window.slot_win_if_empty(g, mgr);
          } else if (typeof window.bombFruit_win_if_empty === "function") {
            window.bombFruit_win_if_empty(g, mgr);
          }
        }
        return;
      }
      return origBf.apply(this, arguments);
    };
    window.bombFruit_after_respawn.__slotGate = true;
  }

  // Bomb explode / constrain empty checks must honor Slot playable-content rules
  // (keys, soko, chess, portals, badged fruit keep playing; poison does not).
  if (
    typeof window.bombFruit_win_if_empty === "function" &&
    !window.bombFruit_win_if_empty.__slotGate
  ) {
    const origBfWin = window.bombFruit_win_if_empty;
    window.bombFruit_win_if_empty = function (game, mgr) {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        return !!(
          window.slot_win_if_empty && window.slot_win_if_empty(game, mgr)
        );
      }
      return origBfWin.apply(this, arguments);
    };
    window.bombFruit_win_if_empty.__slotGate = true;
  }

  if (
    typeof window.bombFruit_make_apple_at === "function" &&
    !window.bombFruit_make_apple_at.__slotArrowClear
  ) {
    const origMakeAt = window.bombFruit_make_apple_at;
    window.bombFruit_make_apple_at = function (mgr, pos, template) {
      const made = origMakeAt.apply(this, arguments);
      if (
        made &&
        made.pos &&
        window.isSlotMachineActive &&
        window.isSlotMachineActive()
      ) {
        try {
          window.slot_clear_arrow_at &&
            window.slot_clear_arrow_at(
              window.__remixGame || (mgr && mgr.wb),
              made.pos.x,
              made.pos.y
            );
        } catch (_ar) {}
      }
      return made;
    };
    window.bombFruit_make_apple_at.__slotArrowClear = true;
  }

  if (
    typeof window.bombFruit_init_all === "function" &&
    !window.bombFruit_init_all.__slotGate
  ) {
    const origInitAll = window.bombFruit_init_all;
    window.bombFruit_init_all = function (mgr) {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        const list = mgr && mgr.ka;
        if (!list) return;
        for (let i = 0; i < list.length; i++) {
          const f = list[i];
          if (!f || !f.__slotBombPlant) continue;
          if (typeof window.bombFruit_init_apple === "function") {
            window.bombFruit_init_apple(f);
          }
          if (f.pos && typeof window.bombFruit_ensure_zone === "function") {
            window.bombFruit_ensure_zone(f.pos.x, f.pos.y, -1);
          }
        }
        window.slot_prune_bomb_zones_to_marked(mgr);
        return;
      }
      return origInitAll.apply(this, arguments);
    };
    window.bombFruit_init_all.__slotGate = true;
  }

  if (
    typeof window.bombFruit_plant_layout_zones === "function" &&
    !window.bombFruit_plant_layout_zones.__slotGate
  ) {
    const origPlant = window.bombFruit_plant_layout_zones;
    window.bombFruit_plant_layout_zones = function (mgr, pruneIdle) {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        // Only (re)plant under marked bomb plants — never the whole board.
        window.bombFruit_init_all(mgr);
        return;
      }
      return origPlant.apply(this, arguments);
    };
    window.bombFruit_plant_layout_zones.__slotGate = true;
  }

  if (
    typeof window.bombFruit_sync_fruit_bombs === "function" &&
    !window.bombFruit_sync_fruit_bombs.__slotGate
  ) {
    const origSync = window.bombFruit_sync_fruit_bombs;
    window.bombFruit_sync_fruit_bombs = function (mgr) {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        // Sync's brandNew/relocated path applies shield spawn-radius and will
        // teleport board leftovers (snap often only knew plant fruits). Under
        // Slot, spawn radius is ONLY for new Bomb-badge arms via
        // slot_arm_new_bomb_fruits → constrain. Disable sync relocate here.
        const outside = window.chess_outside_spawn_radius;
        window.chess_outside_spawn_radius = function () {
          return true;
        };
        try {
          const r = origSync.apply(this, arguments);
          window.slot_prune_bomb_zones_to_marked(mgr);
          return r;
        } finally {
          window.chess_outside_spawn_radius = outside;
        }
      }
      return origSync.apply(this, arguments);
    };
    window.bombFruit_sync_fruit_bombs.__slotGate = true;
  }

  // Native refresh_snap (end of bombFruit_tick_logic) re-zones EVERY apple.
  // Under Slot: track ALL fruit in the snap (so sync won't treat leftovers as
  // brandNew), but only plant idle rings on __slotBombPlant.
  if (
    typeof window.bombFruit_refresh_snap === "function" &&
    !window.bombFruit_refresh_snap.__slotGate
  ) {
    const origRefresh = window.bombFruit_refresh_snap;
    window.bombFruit_refresh_snap = function (mgr) {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        if (!mgr || !mgr.ka) return;
        if (!window.__bombFruitLastPos) window.__bombFruitLastPos = new WeakMap();
        const last = window.__bombFruitLastPos;
        const nextSnap = [];
        for (let i = 0; i < mgr.ka.length; i++) {
          const el = mgr.ka[i];
          if (!el || !el.pos) continue;
          const cur =
            typeof window.bombFruit_pos_key === "function"
              ? window.bombFruit_pos_key(el.pos)
              : el.pos.x + "," + el.pos.y;
          if (!cur) continue;
          if (el.__slotBombPlant) {
            let z =
              typeof window.bombFruit_find_zone === "function"
                ? window.bombFruit_find_zone(el.pos.x, el.pos.y)
                : null;
            if (!z && typeof window.bombFruit_ensure_zone === "function") {
              z = window.bombFruit_ensure_zone(
                el.pos.x,
                el.pos.y,
                (el.bombX1a | 0) >= 0 ? el.bombX1a | 0 : -1
              );
            } else if (
              z &&
              (z.bombX1a | 0) < 0 &&
              (el.bombX1a | 0) >= 0
            ) {
              z.bombX1a = el.bombX1a | 0;
            }
            if (z) {
              z.__slotBombPlant = true;
              el.bombX1a = z.bombX1a | 0;
            }
          }
          last.set(el, cur);
          nextSnap.push({
            el: el,
            key: cur,
            bombX1a: el.bombX1a | 0,
          });
        }
        window.__bombFruitAppleSnap = nextSnap;
        window.slot_prune_bomb_zones_to_marked(mgr);
        return;
      }
      return origRefresh.apply(this, arguments);
    };
    window.bombFruit_refresh_snap.__slotGate = true;
  }

  // Native shield-clear b4E runs whenever e7(15) is true (Shield roll, shield
  // leftovers, chess/bomb borrow). Under Slot the eaten apple is often already
  // spliced / twin-flushed (portal) → .pos TypeError. Slot manages nba itself.
  if (code.indexOf("slot_skip_b4E") < 0 && code.indexOf("b4E(a.wa,") >= 0) {
    if (
      !smReplace(
        "slot skip b4E entirely under Slot",
        /e7\(a\.settings,15\)&&!\(window\.isChessActive&&window\.isChessActive\(\)\)&&!\(window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)&&\(\(window\.__slotActive\|0\)===28\|\|window\.slot_has_armed_bombs&&window\.slot_has_armed_bombs\(\)\)\)&&\(([a-zA-Z0-9_$]+)&&\1\.pos\)&&\(window\.slot_skip_b4E_bomb=1,b4E\(a\.wa,\1\),/,
        "e7(a.settings,15)&&!(window.isChessActive&&window.isChessActive())&&!(window.isSlotMachineActive&&window.isSlotMachineActive())&&($1&&$1.pos)&&(window.slot_skip_b4E=1,b4E(a.wa,$1),",
        true
      )
    ) {
      smReplace(
        "slot skip b4E under Slot (from chess gate)",
        /e7\(a\.settings,15\)&&!\(window\.isChessActive&&window\.isChessActive\(\)\)&&\(b4E\(a\.wa,([a-zA-Z0-9_$]+)\),/,
        "e7(a.settings,15)&&!(window.isChessActive&&window.isChessActive())&&!(window.isSlotMachineActive&&window.isSlotMachineActive())&&($1&&$1.pos)&&(window.slot_skip_b4E=1,b4E(a.wa,$1),"
      );
    }
  }

  // Key/Sokoban plant helpers: capture at eat site (same scope as g7).
  // Do NOT rewrite `q6E=function` as `window.__slotQ6E=q6E=function` — q6E
  // lives in a var-declaration list and that becomes `Unexpected token '.'`.
  // Stamp on first call so direct slotRespawn works without an eat first.
  // Under Slot: block native plants unless slotRespawn sets the allow flag
  // (manual spawn only — enabling e7(8)/e7(9) must not also plant).
  if (code.indexOf("__slotAllowKeyPlant)return;") < 0) {
    smReplace(
      "slot stamp+gate q6E on call",
      /q6E=function\(a,b,c\)\{(?:window\.__slotQ6E=q6E;)?/,
      "q6E=function(a,b,c){window.__slotQ6E=q6E;if(window.isSlotMachineActive&&window.isSlotMachineActive()&&!window.__slotAllowKeyPlant)return;"
    );
  }
  // Native q6E plants a sokogoal under the key when e7(9) (Key+Sokoban combo).
  // Under Slot, leftover sokoboxes keep e7(9) true via leftover gates, so a Key
  // badge eat would spawn an extra goal under the new key. Skip that combo.
  if (code.indexOf("slot_skip_key_soko_goal") < 0) {
    smReplace(
      "slot skip key→sokogoal under leftover soko",
      /e7\(a\.settings,9\)&&S4E\(a\.Ca,d\.clone\(\),a\.keys\.length\)/,
      "e7(a.settings,9)&&!(window.isSlotMachineActive&&window.isSlotMachineActive())&&(window.slot_skip_key_soko_goal=1,S4E(a.Ca,d.clone(),a.keys.length))"
    );
  }
  if (code.indexOf("__slotAllowSokoPlant)return;") < 0) {
    smReplace(
      "slot stamp+gate e5E on call",
      /e5E=function\(a,b,c,d=!1\)\{(?:window\.__slotE5E=e5E;)?/,
      "e5E=function(a,b,c,d=!1){window.__slotE5E=e5E;if(window.isSlotMachineActive&&window.isSlotMachineActive()&&!window.__slotAllowSokoPlant)return;"
    );
  }
  // Capture f4E so unlock/tests can call the native apple plant helper.
  if (code.indexOf("window.__slotF4E=f4E") < 0) {
    smReplace(
      "slot capture f4E on call",
      /f4E=function\(a,b,c,d,e,f=!1\)\{(?:window\.__slotF4E=f4E;)?/,
      "f4E=function(a,b,c,d,e,f=!1){window.__slotF4E=f4E;"
    );
  }
  // Bulk refill (s7E/t7E/u7E sibling) plants keys/boxes via o6E/d5E when e7(8/9).
  // Under Slot those must not fire — unlock/refill should stay fruit.
  if (code.indexOf("slot_block_key_soko_bulk") < 0) {
    smReplace(
      "slot block key/soko bulk refill plants",
      /e7\(a\.settings,8\)\?\(o6E\(a\.Ba,e,k,d\[e\],l,f\),e7\(a\.settings,9\)&&S4E\(a\.Aa,k\.clone\(\),a\.Ba\.keys\.length\)\):e7\(a\.settings,9\)\?\(n=d\[e\],d5E\(a\.Aa,\{pos:k\.clone\(\),prev:null,wm:!0,Lh:l,sequenceNumber:f\}\),S4E\(a\.Aa,n,a\.Ba\.keys\.length\)\):\(f4E\(a\.wa,k,void 0,\s*l,f,!0\)/,
      "window.isSlotMachineActive&&window.isSlotMachineActive()?(window.slot_block_key_soko_bulk=1,f4E(a.wa,k,void 0,l,f,!0)):e7(a.settings,8)?(o6E(a.Ba,e,k,d[e],l,f),e7(a.settings,9)&&S4E(a.Aa,k.clone(),a.Ba.keys.length)):e7(a.settings,9)?(n=d[e],d5E(a.Aa,{pos:k.clone(),prev:null,wm:!0,Lh:l,sequenceNumber:f}),S4E(a.Aa,n,a.Ba.keys.length)):(f4E(a.wa,k,void 0,l,f,!0)"
    );
  }
  // u7E initial/count plant: same — under Slot always fruit, never key/box.
  if (code.indexOf("slot_u7E_fruit_only") < 0) {
    smReplace(
      "slot u7E fruit only",
      /for\(let d=0;d<b;d\+\+\)\{if\(e7\(a\.settings,8\)\)q6E\(a\.Ba,d,c\);else if\(e7\(a\.settings,9\)\)e5E\(a\.Aa,a\.Ba\.keys\.length,c,!0\);else\{let e=a\.Rb\(null,2\);e&&f4E\(a\.wa,e,void 0,c\)\}/,
      "for(let d=0;d<b;d++){if(window.isSlotMachineActive&&window.isSlotMachineActive()){window.slot_u7E_fruit_only=1;let e=a.Rb(null,2);e&&f4E(a.wa,e,void 0,c)}else if(e7(a.settings,8))q6E(a.Ba,d,c);else if(e7(a.settings,9))e5E(a.Aa,a.Ba.keys.length,c,!0);else{let e=a.Rb(null,2);e&&f4E(a.wa,e,void 0,c)}"
    );
  }
  // Apple-manager reset uses Y3E to pick portal-style fixed offsets
  // (g7(-1,-2), g7(-1,2), …). Native Y3E is e7(2|8|9|10). Under Slot,
  // leftover keys/sokoboxes keep e7(8/9) true until Ba/Aa reset — which runs
  // AFTER wa.reset — so play-again sometimes got portal start positions.
  // Only the active Portal roll should force that layout; Chess/Mexico still
  // OR in isChessActive/isMexicoActive at the call site when those modes run.
  if (code.indexOf("slot_Y3E_gate") < 0) {
    if (
      !smReplace(
        "slot Y3E ignore leftover key/soko for layout",
        /Y3E=function\(a\)\{return e7\(a,2\)\|\|e7\(a,8\)\|\|e7\(a,9\)\|\|\(e7\(a,10\)&&!\(window\.isBurgerActive&&window\.isBurgerActive\(\)\)\)\}/,
        "Y3E=function(a){return window.isSlotMachineActive&&window.isSlotMachineActive()?(window.slot_Y3E_gate=1,(window.__slotActive|0)===2):e7(a,2)||e7(a,8)||e7(a,9)||(e7(a,10)&&!(window.isBurgerActive&&window.isBurgerActive()))}"
      )
    ) {
      smReplace(
        "slot Y3E ignore leftover key/soko for layout (no burger)",
        /Y3E=function\(a\)\{return e7\(a,2\)\|\|e7\(a,8\)\|\|e7\(a,9\)\|\|e7\(a,10\)\}/,
        "Y3E=function(a){return window.isSlotMachineActive&&window.isSlotMachineActive()?(window.slot_Y3E_gate=1,(window.__slotActive|0)===2):e7(a,2)||e7(a,8)||e7(a,9)||e7(a,10)}"
      );
    }
  }
  // Clear sticky __slotActive before Y3E so a prior Portal/Chess roll cannot
  // force pair layout on the next game's opening fruit.
  if (code.indexOf("slot_pre_layout_reset") < 0) {
    if (
      !smReplace(
        "slot reset before Y3E layout (chess line)",
        /this\.ka=\[\];window\.appleArray=this\.ka;window\.head_dir="RIGHT";window\.head_state="OPEN";window\.head_color="NONE";window\.color_turn="w";window\.just_ate="fruit";var a=Y3E\(this\.settings\)/,
        'this.ka=[];window.appleArray=this.ka;window.head_dir="RIGHT";window.head_state="OPEN";window.head_color="NONE";window.color_turn="w";window.just_ate="fruit";window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_pre_layout_reset=1,window.slot_reset_state&&window.slot_reset_state());var a=Y3E(this.settings)'
      )
    ) {
      smReplace(
        "slot reset before Y3E layout",
        /this\.ka=\[\];var a=Y3E\(this\.settings\)/,
        "this.ka=[];window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_pre_layout_reset=1,window.slot_reset_state&&window.slot_reset_state());var a=Y3E(this.settings)"
      );
    }
  }
  // Native r7E===0 win counts only non-Oka under poison — that instant-wins
  // after a poison-badge eat that left only Okas. Under Slot, skip this win;
  // slot_win_if_empty / tick handle true board-clear instead.
  // MorePudding timeKeeper inserts gotAll(...) between WIN.play() and this.ub.
  // End-menu helper (A7E/vdF) and ALL-split helpers (S2E/B7E/x7E/d6E) are
  // closure-local inside the gated win block — eager-capture on tick.
  if (code.indexOf("__slotEagerEndMenu") < 0) {
    const menuFnMatch = code.match(
      /([a-zA-Z0-9_$]{1,8})\(this\.menu,\s*1400,\s*this\.([a-zA-Z0-9_$]{1,8})\)/
    );
    const endMenuFn = menuFnMatch ? menuFnMatch[1] : "A7E";
    // _.hn(sc.Ba,S2E(zc*Hd));let fd=String(x7E(this,d6E(this.settings)));B7E(...)
    const allFmt = code.match(
      /_\.([a-zA-Z0-9_$]{1,8})\([a-zA-Z0-9_$]{1,8}\.Ba,([a-zA-Z0-9_$]{1,8})\([a-zA-Z0-9_$]{1,8}\*[a-zA-Z0-9_$]{1,8}\)\);let [a-zA-Z0-9_$]{1,8}=String\(([a-zA-Z0-9_$]{1,8})\(this,([a-zA-Z0-9_$]{1,8})\(this\.settings\)\)\);([a-zA-Z0-9_$]{1,8})\(this\.header/
    );
    const hnName = allFmt ? allFmt[1] : "hn";
    const s2eName = allFmt ? allFmt[2] : "S2E";
    const x7eName = allFmt ? allFmt[3] : "x7E";
    const d6eName = allFmt ? allFmt[4] : "d6E";
    const b7eName = allFmt ? allFmt[5] : "B7E";
    smReplace(
      "slot eager-capture end-menu + ALL-split helpers on tick",
      /\}tick\(\)\{window\.__remixGame=this;/,
      "}tick(){try{window.__slotEagerEndMenu=1;window.__slotShowEndMenu=" +
        endMenuFn +
        ";window.__slotHn=_." +
        hnName +
        ";window.__slotS2E=" +
        s2eName +
        ";window.__slotX7E=" +
        x7eName +
        ";window.__slotD6E=" +
        d6eName +
        ";window.__slotB7E=" +
        b7eName +
        ";}catch(_smM){}window.__remixGame=this;"
    );
  }
  if (code.indexOf("(window.__slotShowEndMenu=") < 0) {
    if (
      !smReplace(
        "slot capture end-menu helper",
        /([a-zA-Z0-9_$]{1,8})\(this\.menu,1400,this\.([a-zA-Z0-9_$]{1,8})\)/,
        "(window.__slotShowEndMenu=$1,$1(this.menu,1400,this.$2))"
      )
    ) {
      smReplace(
        "slot capture end-menu helper loose",
        /([a-zA-Z0-9_$]{1,8})\(this\.menu,\s*1400,\s*this\.([a-zA-Z0-9_$]{1,8})\)/,
        "(window.__slotShowEndMenu=$1,$1(this.menu,1400,this.$2))",
        true
      );
    }
  }
  if (code.indexOf("slot_r7E_win_gate") < 0) {
    smReplace(
      "slot gate r7E empty win",
      /if\(r7E\(this\)===0\)\{s5E\.WIN\.play\(\);(window\.timeKeeper\.gotAll\([^;]*?\),)?this\.ub=this\.nj=!0/,
      "if(r7E(this)===0&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_r7E_win_gate=1))){s5E.WIN.play();$1this.ub=this.nj=!0"
    );
  }
  if (code.indexOf("window.__slotK6E=k6E;") < 0) {
    smReplace(
      "slot stamp k6E on call",
      /k6E=function\(a,b\)\{/,
      "k6E=function(a,b){window.__slotK6E=k6E;"
    );
  }

  // Shield leftover fruit keep nba bars after leaving the roll. e7(15) stays
  // true via slot_has_shields so bars still draw; g7/P3E stamps are gated to
  // __slotActive===15 so later refills are not auto-shielded.
  if (
    code.indexOf("slot_has_shields&&window.slot_has_shields") < 0 &&
    code.indexOf("__slotActive===15||window.slot_is_chess_mode") >= 0
  ) {
    smReplace(
      "e7(15) keep shield leftovers",
      /if\(b===15&&\(window\.__slotActive===15\|\|/,
      "if(b===15&&(window.__slotActive===15||window.slot_has_shields&&window.slot_has_shields(window.__remixGame&&window.__remixGame.wa)||"
    );
  }
  // While carrying a chess piece, nba locks must actually block eats (e7(15)).
  // Fresh slotE7Tail already includes head_state; these are upgrade-only.
  if (code.indexOf("head_state!==\"OPEN\"") < 0 && code.indexOf("head_state!=='OPEN'") < 0) {
    if (
      !smReplace(
        "e7(15) while carrying chess piece",
        /if\(b===15&&\(window\.__slotActive===15\|\|window\.slot_has_shields&&window\.slot_has_shields\(window\.__remixGame&&window\.__remixGame\.wa\)\|\|window\.slot_is_chess_mode&&window\.slot_is_chess_mode\(window\.__slotActive\)\|\|window\.__slotActive===28\|\|window\.slot_has_armed_bombs&&window\.slot_has_armed_bombs\(\)\)\)return!0;/,
        'if(b===15&&(window.__slotActive===15||window.slot_has_shields&&window.slot_has_shields(window.__remixGame&&window.__remixGame.wa)||window.slot_is_chess_mode&&window.slot_is_chess_mode(window.__slotActive)||window.__slotActive===28||window.slot_has_armed_bombs&&window.slot_has_armed_bombs()||window.head_state&&window.head_state!=="OPEN"))return!0;',
        true
      )
    ) {
      smReplace(
        "e7(15) while carrying chess piece legacy",
        /if\(b===15&&\(window\.__slotActive===15\|\|window\.slot_is_chess_mode&&window\.slot_is_chess_mode\(window\.__slotActive\)\|\|window\.__slotActive===28\|\|window\.slot_has_armed_bombs&&window\.slot_has_armed_bombs\(\)\)\)return!0;/,
        'if(b===15&&(window.__slotActive===15||window.slot_has_shields&&window.slot_has_shields(window.__remixGame&&window.__remixGame.wa)||window.slot_is_chess_mode&&window.slot_is_chess_mode(window.__slotActive)||window.__slotActive===28||window.slot_has_armed_bombs&&window.slot_has_armed_bombs()||window.head_state&&window.head_state!=="OPEN"))return!0;',
        true
      );
    }
  }
  // Native g7 always stamps nba when e7(15). Under Slot only while Shield is
  // the active roll — chess/bomb borrow e7(15) for piece lock, not fruit bars.
  if (code.indexOf("slot_g7_shield_gate") < 0) {
    smReplace(
      "slot gate g7 nba stamp",
      /nba:e7\(a\.settings,15\)\?P3E\(a,b\):void 0/,
      "nba:e7(a.settings,15)&&(!(window.isSlotMachineActive&&window.isSlotMachineActive())||(window.__slotActive|0)===15)&&(window.slot_g7_shield_gate=1)?P3E(a,b):void 0"
    );
  }
  // Portal teleport twin: native P6E uses even/odd index mates. Under Slot,
  // leftover non-portal fruit breaks that — resolve via pair id / twin ref.
  if (code.indexOf("slot_portal_twin_index(a.Ga") < 0) {
    smReplace(
      "slot P6E twin via pair id",
      /c=a\.Ga\.ka\[b%2===0\?b\+1:b-1\]/,
      "c=a.Ga.ka[(window.isSlotMachineActive&&window.isSlotMachineActive()&&window.slot_portal_twin_index)?(function(){var _si=window.slot_portal_twin_index(a.Ga,b);return _si>=0?_si:b%2===0?b+1:b-1;})():b%2===0?b+1:b-1]"
    );
  }
  if (code.indexOf("slot_portal_twin_index(a.wa,k)") < 0) {
    smReplace(
      "slot portal _ti via pair id",
      /let _ti=k%2===0\?k\+1:k-1;if\(_ti>=0&&_ti<a\.wa\.ka\.length&&a\.wa\.ka\[_ti\]\)b=!0,P6E\(a\.Sa,k,f,e,g\)/,
      "let _ti=(window.isSlotMachineActive&&window.isSlotMachineActive()&&window.slot_portal_twin_index)?window.slot_portal_twin_index(a.wa,k):(k%2===0?k+1:k-1);if(_ti>=0&&_ti<a.wa.ka.length&&a.wa.ka[_ti])b=!0,P6E(a.Sa,k,f,e,g)"
    );
  }

  // Native portal treats EVERY fruit as an even/odd pair once e7(2) is on.
  // Under Slot only __slotPortal pairs should type-match / float / teleport —
  // leftovers keep their own badges and types.
  // MorePudding PortalPairs rewrites R3E to inject __bowlIsMode + assignCustom…
  if (code.indexOf("slot_R3E_gate") < 0) {
    if (
      !smReplace(
        "slot R3E only unique/portal pairs",
        /R3E=function\(a\)\{window\.__bowlIsMode=([a-zA-Z0-9_$]{1,8});/,
        "R3E=function(a){if(window.isSlotMachineActive&&window.isSlotMachineActive()){window.slot_R3E_gate=1;window.slot_ensure_unique_fruit_types&&window.slot_ensure_unique_fruit_types(a);return;}window.__bowlIsMode=$1;"
      )
    ) {
      smReplace(
        "slot R3E only unique/portal pairs native",
        /R3E=function\(a\)\{if\(e7\(a\.settings,2\)\)\{/,
        "R3E=function(a){if(window.isSlotMachineActive&&window.isSlotMachineActive()){window.slot_R3E_gate=1;window.slot_ensure_unique_fruit_types&&window.slot_ensure_unique_fruit_types(a);return;}if(e7(a.settings,2)){"
      );
    }
  }
  // Portal He sync: under Slot, sync only marked twin pairs (not even/odd leftovers).
  if (code.indexOf("slot_sync_portal_he_pairs") < 0) {
    smReplace(
      "slot portal He sync twin pairs only",
      /if\(e7\(k\.settings,2\)\)for\(let fd=0;fd<k\.ka\.length;fd\+=2\)\{let vc,ad,Yd=\(\(vc=\s*k\.ka\[fd\]\.EDc\)!=null\?vc:0\)<\(\(ad=k\.ka\[fd\+1\]\.EDc\)!=null\?ad:0\)\?fd:fd\+1,ud=k\.ka\[Yd\],od=k\.ka\[Yd===fd\?fd\+1:fd\];ud\.He\.x===0&&ud\.He\.y===0\|\|od\.He\.x===0&&od\.He\.y===0\?\(V3E\(ud,!0,!0\),V3E\(od,!0,!0\)\):\(ud\.He\.x===0\?V3E\(od,!0,!1\):od\.He\.x=ud\.He\.x,ud\.He\.y===0\?V3E\(od,!1,!0\):od\.He\.y=ud\.He\.y\)\}/,
      "if(e7(k.settings,2)){if(window.isSlotMachineActive&&window.isSlotMachineActive()){(function(){window.slot_sync_portal_he_pairs=1;var seen={};for(var i=0;i<k.ka.length;i++){var pa=k.ka[i];if(!pa||!pa.__slotPortal)continue;var pid=pa.__slotPortalPairId;if(pid!=null&&seen[pid])continue;if(pid!=null)seen[pid]=1;var pb=pa.__slotPortalTwin;if(!pb||k.ka.indexOf(pb)<0){pb=null;if(pid!=null)for(var j=0;j<k.ka.length;j++){var o=k.ka[j];if(o&&o!==pa&&o.__slotPortal&&o.__slotPortalPairId===pid){pb=o;break;}}}if(!pb)continue;var vc,ad,Yd=((vc=pa.EDc)!=null?vc:0)<((ad=pb.EDc)!=null?ad:0)?0:1,ud=Yd===0?pa:pb,od=Yd===0?pb:pa;ud.He.x===0&&ud.He.y===0||od.He.x===0&&od.He.y===0?(V3E(ud,!0,!0),V3E(od,!0,!0)):(ud.He.x===0?V3E(od,!0,!1):od.He.x=ud.He.x,ud.He.y===0?V3E(od,!1,!0):od.He.y=ud.He.y);}})();}else for(let fd=0;fd<k.ka.length;fd+=2){let vc,ad,Yd=((vc=k.ka[fd].EDc)!=null?vc:0)<((ad=k.ka[fd+1].EDc)!=null?ad:0)?fd:fd+1,ud=k.ka[Yd],od=k.ka[Yd===fd?fd+1:fd];ud.He.x===0&&ud.He.y===0||od.He.x===0&&od.He.y===0?(V3E(ud,!0,!0),V3E(od,!0,!0)):(ud.He.x===0?V3E(od,!0,!1):od.He.x=ud.He.x,ud.He.y===0?V3E(od,!1,!0):od.He.y=ud.He.y)}}"
    );
  }
  // MorePudding PortalPairs braces this into if{ PortalPairs? assign : for; enforce }.
  if (code.indexOf("slot_block_u7E_portal_pair_types") < 0) {
    if (
      !smReplace(
        "slot block u7E portal consecutive typing",
        /if\(e7\(a\.settings,2\)&&b\.length>0\)\{if\(window\.pudding_settings&&window\.pudding_settings\.PortalPairs/,
        "if(e7(a.settings,2)&&b.length>0&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_block_u7E_portal_pair_types=1))){if(window.pudding_settings&&window.pudding_settings.PortalPairs"
      )
    ) {
      smReplace(
        "slot block u7E portal consecutive typing native",
        /if\(e7\(a\.settings,2\)&&b\.length>0\)for\(b\[0\]\.type=Q3E\(a\.wa\),b\[1\]\.type=b\[0\]\.type,a=2;a<b\.length;a\+=2\)b\[a\]\.type=\(b\[a-2\]\.type\+1\)%\s*24,b\[a\+1\]\.type=b\[a\]\.type/,
        "if(e7(a.settings,2)&&b.length>0&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_block_u7E_portal_pair_types=1)))for(b[0].type=Q3E(a.wa),b[1].type=b[0].type,a=2;a<b.length;a+=2)b[a].type=(b[a-2].type+1)%24,b[a+1].type=b[a].type"
      );
    }
  }
  // Odd apple count under portal: native wipes the board. Chess exempts only
  // while Chess is active — Slot leftovers make length odd often, so always
  // skip the wipe under Slot. twin_index is patched above first, so match that
  // form (and fall back to simpler wipe-condition-only if needed).
  if (code.indexOf("slot_portal_no_wipe") < 0) {
    if (
      !smReplace(
        "slot portal no wipe after twin_index",
        /a\.wa\.ka\.length%2!==0&&!\(window\.isChessActive&&window\.isChessActive\(\)\)\)\{a\.wa\.ka\.splice\(0,a\.wa\.ka\.length\);break\}else\{let _ti=\(window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)&&window\.slot_portal_twin_index\)\?window\.slot_portal_twin_index\(a\.wa,k\):\(k%2===0\?k\+1:k-1\);if\(_ti>=0&&_ti<a\.wa\.ka\.length&&a\.wa\.ka\[_ti\]\)b=!0,P6E\(a\.Sa,k,f,e,g\)/,
        "a.wa.ka.length%2!==0&&!(window.isChessActive&&window.isChessActive())&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_portal_no_wipe=1))){a.wa.ka.splice(0,a.wa.ka.length);break}else{let _ti=(window.isSlotMachineActive&&window.isSlotMachineActive()&&window.slot_portal_twin_index)?window.slot_portal_twin_index(a.wa,k):(k%2===0?k+1:k-1);if(_ti>=0&&_ti<a.wa.ka.length&&a.wa.ka[_ti]&&(!(window.isSlotMachineActive&&window.isSlotMachineActive())||(a.wa.ka[k]&&a.wa.ka[k].__slotPortal)))b=!0,P6E(a.Sa,k,f,e,g)"
      )
    ) {
      if (
        !smReplace(
          "slot portal no wipe + twin after chess",
          /if\(e7\(a\.settings,2\)&&!\(window\.isChessActive&&window\.isChessActive\(\)&&window\.just_ate==='piece'\)\)if\(a\.wa\.ka\.length%2!==0&&!\(window\.isChessActive&&window\.isChessActive\(\)\)\)\{a\.wa\.ka\.splice\(0,a\.wa\.ka\.length\);break\}else\{let _ti=k%2===0\?k\+1:k-1;if\(_ti>=0&&_ti<a\.wa\.ka\.length&&a\.wa\.ka\[_ti\]\)b=!0,P6E\(a\.Sa,k,f,e,g\),f&&e7\(a\.settings,20\)&&p5E\(a\.Ga\);\}/,
          "if(e7(a.settings,2)&&!(window.isChessActive&&window.isChessActive()&&window.just_ate==='piece'))if(a.wa.ka.length%2!==0&&!(window.isChessActive&&window.isChessActive())&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_portal_no_wipe=1))){a.wa.ka.splice(0,a.wa.ka.length);break}else{let _ti=(window.isSlotMachineActive&&window.isSlotMachineActive()&&window.slot_portal_twin_index)?window.slot_portal_twin_index(a.wa,k):(k%2===0?k+1:k-1);if(_ti>=0&&_ti<a.wa.ka.length&&a.wa.ka[_ti]&&(!(window.isSlotMachineActive&&window.isSlotMachineActive())||(a.wa.ka[k]&&a.wa.ka[k].__slotPortal)))b=!0,P6E(a.Sa,k,f,e,g),f&&e7(a.settings,20)&&p5E(a.Ga);}"
        )
      ) {
        if (
          !smReplace(
            "slot portal no wipe condition only",
            /a\.wa\.ka\.length%2!==0&&!\(window\.isChessActive&&window\.isChessActive\(\)\)\)\{a\.wa\.ka\.splice\(0,a\.wa\.ka\.length\);break\}/,
            "a.wa.ka.length%2!==0&&!(window.isChessActive&&window.isChessActive())&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_portal_no_wipe=1))){a.wa.ka.splice(0,a.wa.ka.length);break}"
          )
        ) {
          smReplace(
            "slot portal no wipe native",
            /if\(e7\(a\.settings,2\)\)if\(a\.wa\.ka\.length%2!==0\)\{a\.wa\.ka\.splice\(0,a\.wa\.ka\.length\);break\}else b=!0,P6E\(a\.Sa,k,f,e,g\),f&&e7\(a\.settings,20\)&&p5E\(a\.Ga\);/,
            "if(e7(a.settings,2)&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&a.wa.ka[k]&&!a.wa.ka[k].__slotPortal))if(a.wa.ka.length%2!==0&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_portal_no_wipe=1))){a.wa.ka.splice(0,a.wa.ka.length);break}else{let _ti=(window.isSlotMachineActive&&window.isSlotMachineActive()&&window.slot_portal_twin_index)?window.slot_portal_twin_index(a.wa,k):(k%2===0?k+1:k-1);if(_ti>=0&&_ti<a.wa.ka.length&&a.wa.ka[_ti])b=!0,P6E(a.Sa,k,f,e,g),f&&e7(a.settings,20)&&p5E(a.Ga);}"
          );
        }
      }
    }
  }

  // n7E paints fruit into the wall grid with raw pos. Portal He-sync (and
  // winged leftovers) can leave half-tiles like 3.5 — wa[y] is then undefined
  // and tick crashes: Cannot set properties of undefined (setting '3.5').
  // MorePudding already bounds-checks the K3E mirror write; match that form.
  if (code.indexOf("slot_n7E_round_fruit") < 0) {
    if (
      !smReplace(
        "slot n7E round fractional fruit for grid",
        /else c\.push\(e\.pos\.clone\(\)\);for\(var f of c\)e=d7\(b\.settings\)\?3:2,b\.oa\.wa\[f\.y\]\[f\.x\]=\s*e,K3E\(b\.settings\)&&\(c=j7\(b\.oa,f\),c\.y\s*>=\s*0\s*&&\s*c\.y\s*<\s*a\.ka\.oa\.height\s*&&\s*c\.x\s*>=\s*0\s*&&\s*c\.x\s*<\s*a\.ka\.oa\.width\s*&&\s*\(b\.oa\.wa\[c\.y\]\[c\.x\]\s*=\s*e\)\)/,
        "else{if(window.isSlotMachineActive&&window.isSlotMachineActive()){window.slot_n7E_round_fruit=1;c.push(new _.Od(Math.round(e.pos.x),Math.round(e.pos.y)));}else c.push(e.pos.clone());}for(var f of c){var _sfx=Math.round(+f.x),_sfy=Math.round(+f.y);if(window.isSlotMachineActive&&window.isSlotMachineActive())window.slot_n7E_grid_guard=1;if(_sfy<0||_sfy>=b.oa.wa.length||!b.oa.wa[_sfy]||_sfx<0||_sfx>=b.oa.wa[_sfy].length)continue;e=d7(b.settings)?3:2,b.oa.wa[_sfy][_sfx]=e,K3E(b.settings)&&(c=j7(b.oa,new _.Od(_sfx,_sfy)),c.y>=0&&c.y<a.ka.oa.height&&c.x>=0&&c.x<a.ka.oa.width&&(b.oa.wa[c.y][c.x]=e));}"
      )
    ) {
      if (
        !smReplace(
          "slot n7E round fractional fruit (native K3E)",
          /else c\.push\(e\.pos\.clone\(\)\);for\(var f of c\)e=d7\(b\.settings\)\?3:2,b\.oa\.wa\[f\.y\]\[f\.x\]=\s*e,K3E\(b\.settings\)&&\(c=j7\(b\.oa,f\),b\.oa\.wa\[c\.y\]\[c\.x\]=e\)/,
          "else{if(window.isSlotMachineActive&&window.isSlotMachineActive()){window.slot_n7E_round_fruit=1;c.push(new _.Od(Math.round(e.pos.x),Math.round(e.pos.y)));}else c.push(e.pos.clone());}for(var f of c){var _sfx=Math.round(+f.x),_sfy=Math.round(+f.y);if(window.isSlotMachineActive&&window.isSlotMachineActive())window.slot_n7E_grid_guard=1;if(_sfy<0||_sfy>=b.oa.wa.length||!b.oa.wa[_sfy]||_sfx<0||_sfx>=b.oa.wa[_sfy].length)continue;e=d7(b.settings)?3:2,b.oa.wa[_sfy][_sfx]=e,K3E(b.settings)&&(c=j7(b.oa,new _.Od(_sfx,_sfy)),b.oa.wa[c.y]&&(b.oa.wa[c.y][c.x]=e));}"
        )
      ) {
        smReplace(
          "slot n7E safe fruit grid write only",
          /for\(var f of c\)e=d7\(b\.settings\)\?3:2,b\.oa\.wa\[f\.y\]\[f\.x\]=\s*e,/,
          "for(var f of c){var _sfx=Math.round(+f.x),_sfy=Math.round(+f.y);if(window.isSlotMachineActive&&window.isSlotMachineActive()){window.slot_n7E_grid_guard=1;}if(_sfy<0||_sfy>=b.oa.wa.length||!b.oa.wa[_sfy]||_sfx<0||_sfx>=b.oa.wa[_sfy].length)continue;e=d7(b.settings)?3:2,b.oa.wa[_sfy][_sfx]=e,"
        );
      }
    }
  }
  if (code.indexOf("window.__n7E=n7E") < 0) {
    smReplace(
      "slot stamp n7E on call",
      /n7E=function\(a\)\{/,
      "n7E=function(a){window.__n7E=n7E;"
    );
  }

  // n7E also paints keys(=6), sokoboxes(=7), walls, mines without bounds checks.
  // Leftover key at oob/fractional y → Cannot set properties of undefined (setting '6').
  if (code.indexOf("slot_n7E_entity_guard") < 0) {
    smReplace(
      "slot n7E guard key/soko/wall/mine grid writes",
      /f=a\.Ba;for\(var g of f\.keys\)g\.Lh&&\(f\.ka\.wa\[g\.pos\.y\]\[g\.pos\.x\]=6,e7\(f\.settings,7\)&&\(e=j7\(f\.ka,g\.pos\),f\.ka\.wa\[e\.y\]\[e\.x\]=6\)\);g=a\.Aa;for\(var h of g\.oa\)h\.Lh&&\(g\.ka\.wa\[h\.pos\.y\]\[h\.pos\.x\]=7,e7\(g\.settings,7\)&&\(f=j7\(g\.ka,h\.pos\),g\.ka\.wa\[f\.y\]\[f\.x\]=7\)\);h=a\.Ca;for\(var k of h\.Aa\.values\(\)\)k\.Lh&&!k\.m0&&O5E\(k\)&&\(h\.ka\.wa\[k\.pos\.y\]\[k\.pos\.x\]=k\.WQ\?11:k\.ty\?12:5\);k=a\.Ma;for\(var l of k\.oa\)l\.Lh&&\(k\.ka\.wa\[l\.pos\.y\]\[l\.pos\.x\]=9\)/,
      "f=a.Ba;for(var g of f.keys)if(g.Lh){window.slot_n7E_entity_guard=1;var _ky=Math.round(+g.pos.y),_kx=Math.round(+g.pos.x);if(_ky>=0&&_ky<f.ka.wa.length&&f.ka.wa[_ky]&&_kx>=0&&_kx<f.ka.wa[_ky].length)f.ka.wa[_ky][_kx]=6;if(e7(f.settings,7)){e=j7(f.ka,g.pos);if(e&&e.y>=0&&e.y<f.ka.wa.length&&f.ka.wa[e.y]&&e.x>=0&&e.x<f.ka.wa[e.y].length)f.ka.wa[e.y][e.x]=6;}}g=a.Aa;for(var h of g.oa)if(h.Lh){var _sy=Math.round(+h.pos.y),_sx=Math.round(+h.pos.x);if(_sy>=0&&_sy<g.ka.wa.length&&g.ka.wa[_sy]&&_sx>=0&&_sx<g.ka.wa[_sy].length)g.ka.wa[_sy][_sx]=7;if(e7(g.settings,7)){f=j7(g.ka,h.pos);if(f&&f.y>=0&&f.y<g.ka.wa.length&&g.ka.wa[f.y]&&f.x>=0&&f.x<g.ka.wa[f.y].length)g.ka.wa[f.y][f.x]=7;}}h=a.Ca;for(var k of h.Aa.values())if(k.Lh&&!k.m0&&O5E(k)){var _wy=Math.round(+k.pos.y),_wx=Math.round(+k.pos.x);if(_wy>=0&&_wy<h.ka.wa.length&&h.ka.wa[_wy]&&_wx>=0&&_wx<h.ka.wa[_wy].length)h.ka.wa[_wy][_wx]=k.WQ?11:k.ty?12:5;}k=a.Ma;for(var l of k.oa)if(l.Lh){var _my=Math.round(+l.pos.y),_mx=Math.round(+l.pos.x);if(_my>=0&&_my<k.ka.wa.length&&k.ka.wa[_my]&&_mx>=0&&_mx<k.ka.wa[_my].length)k.ka.wa[_my][_mx]=9;}"
    );
  }

  // Arrow helpers index ka[y][x] without rounding. Fractional box/fruit coords
  // (or a missing row) pass m7 then crash: Cannot read properties of undefined
  // (reading '0') — seen when sokobox+arrows run under Cat peaceful grace.
  if (code.indexOf("slot_U3E_guard") < 0) {
    smReplace(
      "slot guard T3E/U3E arrow cell lookup",
      /T3E=function\(a,b\)\{return m7\(a\.oa,b\)\?a\.ka\[b\.y\]\[b\.x\]\.Lh:!1\},U3E=function\(a,b\)\{return m7\(a\.oa,b\)\?a\.ka\[b\.y\]\[b\.x\]\.direction:"NONE"\}/,
      'T3E=function(a,b){if(!a||!a.ka||!b)return!1;var _ty=Math.round(+b.y),_tx=Math.round(+b.x);return m7(a.oa,b)&&a.ka[_ty]&&a.ka[_ty][_tx]?a.ka[_ty][_tx].Lh:!1},U3E=function(a,b){window.slot_U3E_guard=1;if(!a||!a.ka||!b)return"NONE";var _uy=Math.round(+b.y),_ux=Math.round(+b.x);return m7(a.oa,b)&&a.ka[_uy]&&a.ka[_uy][_ux]?a.ka[_uy][_ux].direction:"NONE"}'
    );
  }
  if (code.indexOf("slot_h7_guard") < 0) {
    smReplace(
      "slot guard h7 arrow clear",
      /h7=function\(a,b,c\)\{var d=a\.ka\[b\.y\]\[b\.x\];if\(c\)switch\(d\.direction\)\{case "DOWN":o4E\.DOWN\.play\(\);break;case "UP":o4E\.UP\.play\(\);break;case "LEFT":o4E\.LEFT\.play\(\);break;case "RIGHT":o4E\.RIGHT\.play\(\)\}d\.direction="NONE";d\.wm=!1;e7\(a\.settings,7\)&&\(b=j7\(a\.oa,b\),a=a\.ka\[b\.y\]\[b\.x\],a\.direction="NONE",a\.wm=!1\)\}/,
      'h7=function(a,b,c){window.slot_h7_guard=1;if(!a||!a.ka||!b)return;var _hy=Math.round(+b.y),_hx=Math.round(+b.x);if(!a.ka[_hy]||!a.ka[_hy][_hx])return;var d=a.ka[_hy][_hx];if(c)switch(d.direction){case "DOWN":o4E.DOWN.play();break;case "UP":o4E.UP.play();break;case "LEFT":o4E.LEFT.play();break;case "RIGHT":o4E.RIGHT.play()}d.direction="NONE";d.wm=!1;e7(a.settings,7)&&(b=j7(a.oa,b),b&&a.ka[b.y]&&a.ka[b.y][b.x]&&(a=a.ka[b.y][b.x],a.direction="NONE",a.wm=!1))}'
    );
  }
  // Sokobox respawn (W4E) compares against snake head — empty/missing body
  // must not throw while Cat grace keeps the run alive after a fruit block.
  if (code.indexOf("slot_W4E_head_guard") < 0) {
    smReplace(
      "slot guard W4E head for soko respawn",
      /return k7\(a\.ka,a\.Aa\.ka\[0\],d\)<=3\?c:d\}/,
      "return(window.slot_W4E_head_guard=1,!a.Aa||!a.Aa.ka||!a.Aa.ka[0]||k7(a.ka,a.Aa.ka[0],d)<=3)?c:d}"
    );
  }
  // Snake body mirror write (dimension) can also land oob.
  if (code.indexOf("slot_n7E_snake_mirror_guard") < 0) {
    smReplace(
      "slot n7E guard snake dimension mirror write",
      /b\.oa\.wa\[d\.y\]\[d\.x\]=1,e7\(b\.settings,7\)&&\(d=l7\(b,c\),b\.oa\.wa\[d\.y\]\[d\.x\]=\s*1\)/,
      "b.oa.wa[d.y]&&(b.oa.wa[d.y][d.x]=1),e7(b.settings,7)&&(d=l7(b,c),window.slot_n7E_snake_mirror_guard=1,d&&d.y>=0&&d.y<b.oa.wa.length&&b.oa.wa[d.y]&&d.x>=0&&d.x<b.oa.wa[d.y].length&&(b.oa.wa[d.y][d.x]=1))"
    );
  }

  // Capture native P3E on first call (scoped inside the snake bundle).
  // Do NOT inject between comma-assigned function defs — that can break boot.
  if (code.indexOf("window.__slotP3E=P3E") < 0) {
    smReplace(
      "slot stamp P3E on call",
      /P3E=function\(a,b\)\{/,
      "P3E=function(a,b){window.__slotP3E=P3E;"
    );
  }

  // ---- e7: Slot Machine active roll + leftovers ----
  // Twin (5) must NOT stay on via __slotActive — only the eat-time pulse.
  // Borderless (4) wrap-only; Yin Yang (7) / Dimension (11) / Mexico (27)
  // are Slot-local (no sticky native).
  if (
    code.indexOf("b===window.__slotActive&&b!==5&&b!==4&&b!==7&&b!==11&&b!==27") < 0 &&
    code.indexOf("isSlotMachineActive&&window.isSlotMachineActive()&&a.ub===window.SLOT_MACHINE_MODE") >= 0
  ) {
    if (
      !smReplace(
        "e7 exclude twin+borderless+yy+dim+mex from sticky active",
        /if\(window\.__slotActive!=null&&b===window\.__slotActive&&b!==5(?:&&b!==4)?(?:&&b!==7&&b!==11&&b!==27)?\)return!0;if\(b===5&&window\.__slotTwinLive\)return!0;/,
        "if(window.__slotActive!=null&&b===window.__slotActive&&b!==5&&b!==4&&b!==7&&b!==11&&b!==27)return!0;if(b===5&&window.__slotTwinLive)return!0;"
      )
    ) {
      if (
        !smReplace(
          "e7 exclude sticky null-safe yy/dim/mex",
          /if\(window\.__slotActive!=null&&b===window\.__slotActive(?:&&b!==5(?:&&b!==4)?(?:&&b!==7&&b!==11&&b!==27)?)?\)return!0;/,
          "if(window.__slotActive!=null&&b===window.__slotActive&&b!==5&&b!==4&&b!==7&&b!==11&&b!==27)return!0;"
        )
      ) {
        smReplace(
          "e7 exclude sticky legacy yy/dim/mex",
          /if\(b===window\.__slotActive\)return!0;if\(b===5&&window\.__slotTwinLive\)return!0;/,
          "if(window.__slotActive!=null&&b===window.__slotActive&&b!==5&&b!==4&&b!==7&&b!==11&&b!==27)return!0;if(b===5&&window.__slotTwinLive)return!0;"
        );
      }
    }
  }
  // Upgrade older sticky gates missing YY/Dimension/Mexico excludes.
  if (
    code.indexOf("b===window.__slotActive&&b!==5&&b!==4&&b!==7&&b!==11&&b!==27") < 0 &&
    code.indexOf("b===window.__slotActive&&b!==5") >= 0
  ) {
    smReplace(
      "e7 sticky also exclude yy/dim/mex",
      /b===window\.__slotActive&&b!==5(?:&&b!==4)?(?!&&b!==7)/,
      "b===window.__slotActive&&b!==5&&b!==4&&b!==7&&b!==11&&b!==27"
    );
  }
  if (code.indexOf("slot_has_keys") < 0 &&
      code.indexOf("isSlotMachineActive&&window.isSlotMachineActive()&&a.ub===window.SLOT_MACHINE_MODE") >= 0) {
    smReplace(
      "e7 slot machine add key/sokoban leftovers",
      /if\(b===5&&window\.__slotTwinLive\)return!0;if\(b===10&&window\.slot_has_oka/,
      "if(b===5&&window.__slotTwinLive)return!0;if(b===8&&window.slot_has_keys&&window.slot_has_keys())return!0;if(b===9&&window.slot_has_sokoboxes&&window.slot_has_sokoboxes())return!0;if(b===10&&window.slot_has_oka"
    );
  }
  if (
    code.indexOf("slot_has_arrows") < 0 &&
    code.indexOf("slot_has_mines&&window.slot_has_mines()") >= 0
  ) {
    smReplace(
      "e7 slot machine add arrow leftovers",
      /if\(b===12&&window\.slot_has_mines&&window\.slot_has_mines\(\)\)return!0;if\(b===21&&/,
      "if(b===12&&window.slot_has_mines&&window.slot_has_mines())return!0;if(b===13&&window.slot_has_statues&&window.slot_has_statues())return!0;if(b===16&&window.slot_has_arrows&&window.slot_has_arrows())return!0;if(b===21&&"
    );
  }
  if (
    code.indexOf("slot_has_bridges") < 0 &&
    code.indexOf("isSlotMachineActive&&window.isSlotMachineActive()&&a.ub===window.SLOT_MACHINE_MODE") >= 0
  ) {
    smReplace(
      "e7 slot machine add bridge/gate leftovers + null-safe active",
      /if\(!r&&window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)&&a\.ub===window\.SLOT_MACHINE_MODE\)\{if\(b===window\.__slotActive\)return!0;/,
      "if(!r&&window.isSlotMachineActive&&window.isSlotMachineActive()&&a.ub===window.SLOT_MACHINE_MODE){if(window.__slotActive!=null&&b===window.__slotActive&&b!==5&&b!==4&&b!==7&&b!==11&&b!==27)return!0;"
    );
    if (code.indexOf("slot_has_bridges") < 0) {
      smReplace(
        "e7 slot machine insert bridge/gate leftover checks",
        /if\(b===16&&window\.slot_has_arrows&&window\.slot_has_arrows\(\)\)return!0;if\(b===21&&/,
        "if(b===13&&window.slot_has_statues&&window.slot_has_statues())return!0;if(b===16&&window.slot_has_arrows&&window.slot_has_arrows())return!0;if(b===19&&window.slot_has_gates&&window.slot_has_gates())return!0;if(b===20&&window.slot_has_bridges&&window.slot_has_bridges())return!0;if(b===21&&"
      );
    }
  }
  // Cat Sc border wrap: also honor Slot Peaceful roll (lives may be 0).
  if (
    code.indexOf("(window.__slotActive|0)===21)){if((window.cat_peaceful_ticks|0)<=0)") < 0 &&
    code.indexOf("Sc(a){if(window.isCatActive&&window.isCatActive()&&!m7(this.ka,a)&&((window.cat_peaceful_ticks|0)>0||(window.cat_lives|0)>0))") >= 0
  ) {
    smReplace(
      "Sc slot peaceful border wrap",
      /Sc\(a\)\{if\(window\.isCatActive&&window\.isCatActive\(\)&&!m7\(this\.ka,a\)&&\(\(window\.cat_peaceful_ticks\|0\)>0\|\|\(window\.cat_lives\|0\)>0\)\)\{if\(\(window\.cat_peaceful_ticks\|0\)<=0\)\{window\.cat_try_spend_life\(this\);\}i7\(this\.ka,a\);\}/,
      "Sc(a){if(window.isCatActive&&window.isCatActive()&&!m7(this.ka,a)&&((window.cat_peaceful_ticks|0)>0||(window.cat_lives|0)>0||(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.__slotActive|0)===21))){if((window.cat_peaceful_ticks|0)<=0&&!((window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.__slotActive|0)===21))){window.cat_try_spend_life(this);}i7(this.ka,a);}"
    );
  }

  // Burger roll under Slot must enable e7(10) like standalone Burger (poison-eat
  // shrink), not only when Okas already exist. Pairing/top-up stay Slot-gated.
  if (
    code.indexOf("b===10&&((window.__slotActive|0)===25||window.slot_has_oka") < 0 &&
    code.indexOf("b===10&&window.slot_has_oka&&window.slot_has_oka") >= 0
  ) {
    smReplace(
      "e7 slot burger roll enables poison mode",
      /if\(b===10&&window\.slot_has_oka&&window\.slot_has_oka\(window\.__remixGame&&window\.__remixGame\.wa\)\)return!0;/,
      "if(b===10&&((window.__slotActive|0)===25||window.slot_has_oka&&window.slot_has_oka(window.__remixGame&&window.__remixGame.wa)))return!0;"
    );
  }
  if (code.indexOf("isSlotMachineActive()&&(b===window.__slotActive") < 0 &&
      code.indexOf("isSlotMachineActive&&window.isSlotMachineActive()&&a.ub===window.SLOT_MACHINE_MODE") < 0) {
    const slotE7Tail =
      "if(!r&&window.isSlotMachineActive&&window.isSlotMachineActive()&&a.ub===window.SLOT_MACHINE_MODE){if(window.__slotActive!=null&&b===window.__slotActive&&b!==5&&b!==4&&b!==7&&b!==11&&b!==27)return!0;if(b===5&&window.__slotTwinLive)return!0;if(b===1&&window.slot_has_walls&&window.slot_has_walls())return!0;if(b===2&&window.slot_has_portal_pairs&&window.slot_has_portal_pairs(window.__remixGame&&window.__remixGame.wa))return!0;if(b===8&&window.slot_has_keys&&window.slot_has_keys())return!0;if(b===9&&window.slot_has_sokoboxes&&window.slot_has_sokoboxes())return!0;if(b===10&&((window.__slotActive|0)===25||window.slot_has_oka&&window.slot_has_oka(window.__remixGame&&window.__remixGame.wa)))return!0;if(b===12&&window.slot_has_mines&&window.slot_has_mines())return!0;if(b===13&&window.slot_has_statues&&window.slot_has_statues())return!0;if(b===16&&window.slot_has_arrows&&window.slot_has_arrows())return!0;if(b===19&&window.slot_has_gates&&window.slot_has_gates())return!0;if(b===20&&window.slot_has_bridges&&window.slot_has_bridges())return!0;if(b===21&&window.__slotActive===21)return!0;if(b===15&&(window.__slotActive===15||window.slot_has_shields&&window.slot_has_shields(window.__remixGame&&window.__remixGame.wa)||window.slot_is_chess_mode&&window.slot_is_chess_mode(window.__slotActive)||window.__slotActive===28||window.slot_has_armed_bombs&&window.slot_has_armed_bombs()||window.head_state&&window.head_state!==\"OPEN\"))return!0;}return r}";
    const e7Bomb =
      /if\(!r&&b===15&&window\.BOMB_FRUIT_MODE!=null\)\{if\(a\.ub===window\.BOMB_FRUIT_MODE\)return!0;if\(a\.ub===22&&a\.rSa&&a\.rSa\.has\(window\.BOMB_FRUIT_MODE\)\)return!0;\}return r\}/;
    const e7Mexico =
      /if\(!r&&b===2&&window\.isMexicoActive&&window\.isMexicoActive\(\)\)return!0;if\(!r&&b===1&&window\.isMexicoActive&&window\.isMexicoActive\(\)\)return!0;return r\}/;
    const e7Cat =
      /if\(!r&&b===21&&window\.isCatActive&&window\.isCatActive\(\)&&\(window\.cat_peaceful_ticks\|0\)>0\)return!0;return r\}/;
    if (
      !smReplace(
        "e7 slot machine after bomb fruit",
        e7Bomb,
        "if(!r&&b===15&&window.BOMB_FRUIT_MODE!=null){if(a.ub===window.BOMB_FRUIT_MODE)return!0;if(a.ub===22&&a.rSa&&a.rSa.has(window.BOMB_FRUIT_MODE))return!0;}" +
          slotE7Tail
      )
    ) {
      if (
        !smReplace(
          "e7 slot machine after mexico",
          e7Mexico,
          "if(!r&&b===2&&window.isMexicoActive&&window.isMexicoActive())return!0;if(!r&&b===1&&window.isMexicoActive&&window.isMexicoActive())return!0;" +
            slotE7Tail
        )
      ) {
        if (
          !smReplace(
            "e7 slot machine after cat",
            e7Cat,
            "if(!r&&b===21&&window.isCatActive&&window.isCatActive()&&(window.cat_peaceful_ticks|0)>0)return!0;" +
              slotE7Tail
          )
        ) {
          console.error("SlotMachineMod: failed to find e7 chain for slot leftovers");
        }
      }
    }
  }

  // Borderless badge (4): wrap-only. Never sticky e7(4) (avoids camera /
  // canvas / tiled-board / checker jumps). Physics wrap via n7 + step sites.
  const slotWrap =
    "(window.slot_borderless_wrap&&window.slot_borderless_wrap())";
  if (code.indexOf("slot_borderless_wrap()") < 0) {
    smReplace(
      "n7 include slot borderless wrap",
      /n7=function\(a\)\{return e7\(a,21\)\|\|e7\(a,4\)\}/,
      "n7=function(a){return e7(a,21)||e7(a,4)||" + slotWrap + "}"
    );
    smReplace(
      "slot borderless wrap head step i7",
      /e7\(a\.settings,4\)&&i7\(a\.ka,e\);g=m7\(a\.ka,e\)&&a\.ka\.wa\[e\.y\]\[e\.x\]!==10&&y4E\(a\.ka,e\);f=!m7\(a\.ka,e\)&&!e7\(a\.settings,4\)&&f/,
      "(e7(a.settings,4)||" +
        slotWrap +
        ")&&i7(a.ka,e);g=m7(a.ka,e)&&a.ka.wa[e.y][e.x]!==10&&y4E(a.ka,e);f=!m7(a.ka,e)&&!e7(a.settings,4)&&!" +
        slotWrap +
        "&&f"
    );
    smReplace(
      "slot borderless wrap body continuous",
      /e7\(a\.settings,4\)&&!c\)b\.pos\.x<0\?/,
      "(e7(a.settings,4)||" + slotWrap + ")&&!c)b.pos.x<0?"
    );
    smReplace(
      "slot borderless wrap fruit motion",
      /e7\(this\.settings,4\)&&\(a\.pos\.x<0\?a\.pos\.x\+=this\.oa\.oa\.width/,
      "(e7(this.settings,4)||" +
        slotWrap +
        ")&&(a.pos.x<0?a.pos.x+=this.oa.oa.width"
    );
  }

  // Activate badge mode BEFORE wall/gate/bridge/statue spawn (those run prior
  // to Vm/splice). Force entity plant on the activating eat.
  if (code.indexOf("slot_before_mode_spawns") < 0) {
    smReplace(
      "slot before wall/gate/bridge spawn",
      /f=!a\.nj&&!g&&\(a\.Sh%2===1\|\|e7\(a\.settings,11\)\);e7\(a\.settings,1\)&&f&&/,
      "window.slot_before_mode_spawns&&window.slot_before_mode_spawns(a,d),f=!a.nj&&!g&&(a.Sh%2===1||e7(a.settings,11)||window.slot_force_entity_spawn&&window.slot_force_entity_spawn());e7(a.settings,1)&&f&&"
    );
  }

  // Gate/bridge plant sites: Ultra may leave disable* true; also honor force flag
  // even if `f` was rewritten by later wall-every-apple patching.
  if (code.indexOf("disableGateMode=!1,h6E") < 0 && code.indexOf("disableGateMode=!1,h6E") < 0) {
    smReplace(
      "slot force gate plant",
      /e7\(a\.settings,19\)&&f&&h6E\(a\.Qa,a\.oa\.ka\)/,
      "e7(a.settings,19)&&(!(window.isSlotMachineActive&&window.isSlotMachineActive())||(window.__slotActive|0)===19)&&(f||window.slot_force_entity_spawn&&window.slot_force_entity_spawn())&&(window.disableGateMode=!1,h6E(a.Qa,a.oa.ka))"
    );
  }
  if (code.indexOf("disableBridgeMode=!1,m5E") < 0) {
    smReplace(
      "slot force bridge plant",
      /e7\(a\.settings,20\)&&f&&\(m5E\(a\.Ga\),e7\(a\.settings,9\)&&n7E\(a\)\)/,
      "e7(a.settings,20)&&(!(window.isSlotMachineActive&&window.isSlotMachineActive())||(window.__slotActive|0)===20)&&(f||window.slot_force_entity_spawn&&window.slot_force_entity_spawn())&&(window.disableBridgeMode=!1,m5E(a.Ga),e7(a.settings,9)&&n7E(a),window.slot_ensure_bridge_planted&&window.slot_ensure_bridge_planted(a))"
    );
  }

  // UltraPlace injects disableBridgeMode/disableGateMode early-returns. Allow
  // plants while Slot Machine has that mode rolled in (defaults are OFF).
  // On Remix these strings are absent — optional.
  if (code.indexOf("__slotActive|0)===20))return;var b=") < 0) {
    smReplace(
      "slot allow bridge despite ultra disable",
      /if\(window\.disableBridgeMode\)return;var b=/,
      "if(window.disableBridgeMode&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.__slotActive|0)===20))return;var b=",
      true
    );
  }
  if (code.indexOf("__slotActive|0)===19))return;var c=[],d=[]") < 0) {
    smReplace(
      "slot allow gate despite ultra disable",
      /if\(window\.disableGateMode\)return;var c=\[\],d=\[\];/,
      "if(window.disableGateMode&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.__slotActive|0)===19))return;var c=[],d=[];",
      true
    );
  }
  // Mines: leftover e7(12) must stay on for tick/kill, but v6E must not plant
  // after rolling a different badge. Gate spawn on __slotActive===12 (and honor
  // Ultra disableMineMode except while Minesweeper is the active roll).
  if (code.indexOf("__slotActive|0)===12))return;var b=") < 0) {
    if (
      !smReplace(
        "slot allow mine despite ultra disable",
        /if\(window\.disableMineMode\)return;var b=/,
        "if(window.disableMineMode&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.__slotActive|0)===12))return;var b=",
        true
      )
    ) {
      smReplace(
        "slot disableMineMode on v6E",
        /([$a-zA-Z0-9_]{0,8}=function\(a\)\{)(var b=[$a-zA-Z0-9_]{0,8}\(a\.ka,null,9\);)/,
        "$1if(window.disableMineMode&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.__slotActive|0)===12))return;$2",
        true
      );
    }
  }
  if (
    code.indexOf("__slotActive|0)===12)&&v6E(a.Ma)") < 0 &&
    code.indexOf("e7(a.settings,12)&&v6E") >= 0
  ) {
    smReplace(
      "slot mine spawn only while minesweeper rolled",
      /e7\(a\.settings,12\)&&v6E\(a\.Ma\)/,
      "e7(a.settings,12)&&(!(window.isSlotMachineActive&&window.isSlotMachineActive())||(window.__slotActive|0)===12)&&v6E(a.Ma)"
    );
  }

  // UltraPlace gates statue body-plant AND crumble behind disableStatueBodyPlant.
  // Under Slot Machine: new plants only while Statue is rolled; crumble/break must
  // still run whenever statues exist (same as native statue mode apple eats).
  if (code.indexOf("slot_has_statues())))return;var b=a.wa.ka") < 0) {
    smReplace(
      "slot allow statue crumble despite ultra disable",
      /if\(window\.disableStatueBodyPlant\)return;var b=a\.wa\.ka,c=!1;/,
      "if(window.disableStatueBodyPlant&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&((window.__slotActive|0)===13||window.slot_has_statues&&window.slot_has_statues())))return;var b=a.wa.ka,c=!1;",
      true
    );
  }
  if (
    code.indexOf("__slotActive|0)===13))return;for(var c=a.wa.ka") < 0 &&
    code.indexOf("disableStatueBodyPlant)return;for(var c=a.wa.ka") >= 0
  ) {
    smReplace(
      "slot allow statue body plant only while rolled",
      /if\(window\.disableStatueBodyPlant\)return;for\(var c=a\.wa\.ka/,
      "if(window.disableStatueBodyPlant&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.__slotActive|0)===13))return;for(var c=a.wa.ka"
    );
  }
  // Remix (non-Ultra) has no UltraPlace disable gate — leftover e7(13) would
  // otherwise re-plant body statues on every apple. Gate only k7E to the roll;
  // l7E (break near head) + e7E (crumble) stay on whenever e7(13) is true.
  if (
    code.indexOf("__slotActive|0)===13)&&k7E(a.Ya") < 0 &&
    code.indexOf("e7(a.settings,13)&&(e&&l7E(a.Ya),e7E(a.Ya),k7E(a.Ya") >= 0
  ) {
    smReplace(
      "slot gate statue body-plant call site",
      /e7\(a\.settings,13\)&&\(e&&l7E\(a\.Ya\),e7E\(a\.Ya\),k7E\(a\.Ya,a\.Yc\.bind\(a\)\)/,
      "e7(a.settings,13)&&(e&&l7E(a.Ya),e7E(a.Ya),(!(window.isSlotMachineActive&&window.isSlotMachineActive())||(window.__slotActive|0)===13)&&k7E(a.Ya,a.Yc.bind(a))"
    );
  }

  // Arrow (16): leftover e7(16) keeps tiles interactive, but s4E must not plant
  // new arrows after leaving the Arrow roll.
  if (code.indexOf("__slotAllowArrowTurns)return;var d=a.ka") < 0) {
    if (
      !smReplace(
        "slot gate s4E after ultra arrow block",
        /if\(window\.ultraBlockNativeArrowTurns&&window\.ultraBlockNativeArrowTurns\(\)&&!window\.__ultraPaintArrowFromPlace\)return;var d=a\.ka\[c\.y\]\[c\.x\];d\.direction=b/,
        "if(window.ultraBlockNativeArrowTurns&&window.ultraBlockNativeArrowTurns()&&!window.__ultraPaintArrowFromPlace)return;if(window.isSlotMachineActive&&window.isSlotMachineActive()&&!window.__slotAllowArrowTurns&&!window.__ultraPaintArrowFromPlace)return;var d=a.ka[c.y][c.x];d.direction=b",
        true
      )
    ) {
      smReplace(
        "slot gate s4E arrow plant",
        /([$a-zA-Z0-9_]{0,8}=function\(a,b,c\)\{)(var d=a\.ka\[c\.y\]\[c\.x\];d\.direction=b)/,
        "$1if(window.isSlotMachineActive&&window.isSlotMachineActive()&&!window.__slotAllowArrowTurns)return;$2"
      );
    }
  }

  // Hotdog (17): native B6E returns ALL wall-manager entries unless blender/Qa.
  // Under Slot, Wall leftovers share Ca.Aa without .ty — F6E/tick then crash on
  // `.nea`. Always filter to real hotdog sidewalls while Slot is active.
  if (code.indexOf("slot_hotdog_B6E_filter") < 0) {
    smReplace(
      "slot B6E only hotdog ty walls",
      /B6E=function\(a\)\{return e7\(a\.settings,17\)\?e7\(a\.settings,22\)\|\|a\.settings\.Qa\?Array\.from\(a\.Aa\.values\(\)\)\.filter\(b=>b\.ty!==void 0\):Array\.from\(a\.Aa\.values\(\)\):\[\]\}/,
      "B6E=function(a){return e7(a.settings,17)?(window.isSlotMachineActive&&window.isSlotMachineActive()||e7(a.settings,22)||a.settings.Qa?(window.slot_hotdog_B6E_filter=1,Array.from(a.Aa.values()).filter(b=>b&&b.ty!==void 0)):Array.from(a.Aa.values())):[]}"
    );
  }
  // Belt-and-suspenders: F6E ages hotdog walls — skip entries missing ty.
  if (code.indexOf("slot_hotdog_F6E_guard") < 0) {
    smReplace(
      "slot F6E guard missing ty",
      /F6E=function\(a\)\{if\(!e7\(a\.settings,2\)\)\{a=B6E\(a\);for\(let b of a\)b\.ty\.nea\+=1\}\}/,
      "F6E=function(a){if(!e7(a.settings,2)){a=B6E(a);for(let b of a)b&&b.ty&&(window.slot_hotdog_F6E_guard=1,b.ty.nea+=1)}}"
    );
  }

  // Key/Sokoban unlock must yield a badged fruit — never another key/box via the
  // apple-manager refill path (e7 leftovers would otherwise re-plant entities).
  if (code.indexOf("slot_skip_key_soko_refill") < 0) {
    smReplace(
      "slot skip key/sokoban apple-manager refill",
      /e7\(this\.settings,8\)\?\(q6E\(this\.Ba,a,!0\),!1\):e7\(this\.settings,9\)\?\(e5E\(this\.Aa,this\.Ba\.keys\.length,!0\),!1\):\(c=this\.Rb\(c,2\)\)\?\(c4E\(this\.wa,a,c\),b&&this\.wa\.ka\.sort\(\(f,g\)=>f\.pos\.y-g\.pos\.y\),!0\):!1/,
      'window.isSlotMachineActive&&window.isSlotMachineActive()?(c=this.Rb(c,2))?(c4E(this.wa,a,c),b&&this.wa.ka.sort((f,g)=>f.pos.y-g.pos.y),window.slot_skip_key_soko_refill=1,!0):!1:e7(this.settings,8)?(q6E(this.Ba,a,!0),!1):e7(this.settings,9)?(e5E(this.Aa,this.Ba.keys.length,!0),!1):(c=this.Rb(c,2))?(c4E(this.wa,a,c),b&&this.wa.ka.sort((f,g)=>f.pos.y-g.pos.y),!0):!1'
    );
  }

  // Key→keyblock unlock: with sokoban leftovers e7(9) would convert to a box.
  // Under Slot Machine always spawn fruit at the keyblock (badge stamped later).
  // Pass f4E's final flag !0 so portal/poison pairing cannot plant a second apple.
  if (code.indexOf("slot_key_unlock_fruit") < 0) {
    smReplace(
      "slot key unlock always fruit",
      /e7\(a\.settings,9\)\?d5E\(a\.Ca,\{pos:b\.r7a\.clone\(\),prev:null,wm:!1,yNa:b\.type,Lh:!0,sequenceNumber:b\.sequenceNumber\}\):f4E\(a\.oa,b\.r7a,b\.type,!0,b\.sequenceNumber\)/,
      "window.isSlotMachineActive&&window.isSlotMachineActive()?(window.slot_key_unlock_fruit=1,f4E(a.oa,b.r7a,b.type,!0,b.sequenceNumber,!0)):e7(a.settings,9)?d5E(a.Ca,{pos:b.r7a.clone(),prev:null,wm:!1,yNa:b.type,Lh:!0,sequenceNumber:b.sequenceNumber}):f4E(a.oa,b.r7a,b.type,!0,b.sequenceNumber)"
    );
  } else if (
    code.indexOf("slot_key_unlock_fruit=1,f4E(a.oa,b.r7a,b.type,!0,b.sequenceNumber,!0)") < 0 &&
    code.indexOf("slot_key_unlock_fruit=1,f4E(a.oa,b.r7a,b.type,!0,b.sequenceNumber)") >= 0
  ) {
    smReplace(
      "slot key unlock no portal pair",
      /window\.slot_key_unlock_fruit=1,f4E\(a\.oa,b\.r7a,b\.type,!0,b\.sequenceNumber\)/,
      "window.slot_key_unlock_fruit=1,f4E(a.oa,b.r7a,b.type,!0,b.sequenceNumber,!0)"
    );
  }

  // Sokobox→goal unlock (X4E): one fruit only (f4E !0 skips portal twin) +
  // mark so Slot tally can stamp max+1.
  if (code.indexOf("slot_soko_unlock_fruit") < 0) {
    smReplace(
      "slot soko unlock single fruit",
      /c&&f4E\(a\.wa,c,b\.yNa,b\.Lh,b\.sequenceNumber\)/,
      "c&&(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_soko_unlock_fruit=1),f4E(a.wa,c,b.yNa,b.Lh,b.sequenceNumber,window.isSlotMachineActive&&window.isSlotMachineActive()?!0:!1))"
    );
  } else if (
    code.indexOf("slot_soko_unlock_fruit=1),f4E(a.wa,c,b.yNa,b.Lh,b.sequenceNumber,") < 0 &&
    code.indexOf("slot_soko_unlock_fruit=1),f4E(a.wa,c,b.yNa,b.Lh,b.sequenceNumber)") >= 0
  ) {
    smReplace(
      "slot soko unlock no portal pair",
      /window\.slot_soko_unlock_fruit=1\),f4E\(a\.wa,c,b\.yNa,b\.Lh,b\.sequenceNumber\)/,
      "window.slot_soko_unlock_fruit=1),f4E(a.wa,c,b.yNa,b.Lh,b.sequenceNumber,!0)"
    );
  }

  // Poison: under Slot Machine never pair/spawn Okas via native g4E/e4E/l4E —
  // poison badge refill is exactly one safe fruit + one Oka from slotRespawn.
  // Native g4E tops up to ~half the board (2+ poisons on 3a/5a).
  if (
    code.indexOf("(__slotActive|0)===10)&&(window.slot_poison_oka_gate") >= 0
  ) {
    smReplace(
      "slot poison Oka pairing never under Slot (upgrade)",
      /e7\(a\.settings,10\)&&\(!\(window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)\)\|\|\(window\.__slotActive\|0\)===10\)&&\(window\.slot_poison_oka_gate=1,c=Math\.random\(\)<\.5,a\.ka\[a\.ka\.length-1\]\.Oka=c,a\.ka\[a\.ka\.length-2\]\.Oka=!c\)/,
      "e7(a.settings,10)&&!(window.isSlotMachineActive&&window.isSlotMachineActive())&&(window.slot_poison_oka_gate=1,c=Math.random()<.5,a.ka[a.ka.length-1].Oka=c,a.ka[a.ka.length-2].Oka=!c)",
      true
    );
  } else if (code.indexOf("slot_poison_oka_gate") < 0) {
    if (
      !smReplace(
        "slot gate poison Oka pairing after burger",
        /e7\(a\.settings,10\)&&!\(window\.isBurgerActive&&window\.isBurgerActive\(\)\)&&\(c=Math\.random\(\)<\.5,a\.ka\[a\.ka\.length-1\]\.Oka=c,a\.ka\[a\.ka\.length-2\]\.Oka=!c\)/,
        "e7(a.settings,10)&&!(window.isBurgerActive&&window.isBurgerActive())&&!(window.isSlotMachineActive&&window.isSlotMachineActive())&&(window.slot_poison_oka_gate=1,c=Math.random()<.5,a.ka[a.ka.length-1].Oka=c,a.ka[a.ka.length-2].Oka=!c)"
      )
    ) {
      smReplace(
        "slot gate poison Oka pairing",
        /e7\(a\.settings,10\)&&\(c=Math\.random\(\)<\.5,a\.ka\[a\.ka\.length-1\]\.Oka=c,a\.ka\[a\.ka\.length-2\]\.Oka=!c\)/,
        "e7(a.settings,10)&&!(window.isSlotMachineActive&&window.isSlotMachineActive())&&(window.slot_poison_oka_gate=1,c=Math.random()<.5,a.ka[a.ka.length-1].Oka=c,a.ka[a.ka.length-2].Oka=!c)",
        true
      );
    }
  }
  // Burger already gates e4E/l4E/g4E top-up; add Slot so poison roll cannot
  // spawn extra Okas to fill half the board.
  if (code.indexOf("slot_block_e4E") < 0) {
    if (
      !smReplace(
        "slot block e4E after burger gate",
        /e7\(a\.settings,10\)&&!f&&!\(window\.isBurgerActive&&window\.isBurgerActive\(\)\)&&e4E\(a\)/,
        "e7(a.settings,10)&&!f&&!(window.isBurgerActive&&window.isBurgerActive())&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_block_e4E=1))&&e4E(a)"
      )
    ) {
      smReplace(
        "slot block e4E",
        /e7\(a\.settings,10\)&&!f&&e4E\(a\)/,
        "e7(a.settings,10)&&!f&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_block_e4E=1))&&e4E(a)"
      );
    }
  }
  if (code.indexOf("slot_block_l4E") < 0) {
    if (
      !smReplace(
        "slot block l4E after burger gate",
        /e7\((this|a)\.settings,10\)&&!\(window\.isBurgerActive&&window\.isBurgerActive\(\)\)&&l4E\(\1\.wa\)/g,
        "e7($1.settings,10)&&!(window.isBurgerActive&&window.isBurgerActive())&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_block_l4E=1))&&l4E($1.wa)"
      )
    ) {
      smReplace(
        "slot block l4E",
        /e7\((this|a)\.settings,10\)&&l4E\(\1\.wa\)/g,
        "e7($1.settings,10)&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_block_l4E=1))&&l4E($1.wa)"
      );
    }
    if (code.indexOf("l4E=function(a){if(window.isBurgerActive") >= 0) {
      smReplace(
        "slot block l4E function after burger",
        /l4E=function\(a\)\{if\(window\.isBurgerActive&&window\.isBurgerActive\(\)\)return;/,
        "l4E=function(a){if(window.isBurgerActive&&window.isBurgerActive())return;if(window.isSlotMachineActive&&window.isSlotMachineActive())return;"
      );
    } else if (code.indexOf("l4E=function(a){if(window.isSlotMachineActive") < 0) {
      smReplace(
        "slot block l4E function",
        /l4E=function\(a\)\{/,
        "l4E=function(a){if(window.isSlotMachineActive&&window.isSlotMachineActive())return;"
      );
    }
  }
  if (code.indexOf("slot_block_g4E") < 0) {
    if (
      !smReplace(
        "slot block g4E top-up after burger",
        /b<a\.ka\.length\/2&&!\(window\.isBurgerActive&&window\.isBurgerActive\(\)\)&&e4E\(a\)/,
        "b<a.ka.length/2&&!(window.isBurgerActive&&window.isBurgerActive())&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_block_g4E=1))&&e4E(a)"
      )
    ) {
      smReplace(
        "slot block g4E top-up",
        /b<a\.ka\.length\/2&&e4E\(a\)/,
        "b<a.ka.length/2&&!(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_block_g4E=1))&&e4E(a)"
      );
    }
  }

  // Shield (15) nba bars vs Chess (24) piece-lock: e7(15) is also borrowed by
  // Chess/Bomb under Slot. Only assign real fruit shields while Shield is rolled.
  if (code.indexOf("__slotActive|0)===15))for") < 0) {
    smReplace(
      "slot P3E fruit shields only on shield roll",
      /if\(e7\((this|a)\.settings,15\)&&\(!window\.ultraShouldSpawnFruitShields\|\|window\.ultraShouldSpawnFruitShields\(\)\)\)for/g,
      "if(e7($1.settings,15)&&(!window.ultraShouldSpawnFruitShields||window.ultraShouldSpawnFruitShields())&&(!(window.isSlotMachineActive&&window.isSlotMachineActive())||(window.__slotActive|0)===15))for"
    );
  }
  if (code.indexOf("chess_convert_new_apples(a,g)") >= 0) {
    if (
      code.indexOf(
        "!(window.slot_key_unlock_fruit||window.slot_soko_unlock_fruit)"
      ) < 0
    ) {
      // Upgrade path: prior Slot chess-roll gate already present. Optional —
      // fresh builds hit the base form below instead.
      if (
        !smReplace(
          "slot chess convert skip key/soko unlock (upgrade)",
          /if\(window\.isChessActive&&window\.isChessActive\(\)&&g>0&&\(\!\(window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)\)\|\|window\.slot_is_chess_mode&&window\.slot_is_chess_mode\(window\.__slotActive\)\)\)\{window\.chess_convert_new_apples\(a,g\);\}/,
          "if(window.isChessActive&&window.isChessActive()&&g>0&&!(window.slot_key_unlock_fruit||window.slot_soko_unlock_fruit)&&(!(window.isSlotMachineActive&&window.isSlotMachineActive())||window.slot_is_chess_mode&&window.slot_is_chess_mode(window.__slotActive))){window.chess_convert_new_apples(a,g);}",
          true
        )
      ) {
        smReplace(
          "slot chess convert only on chess roll (not unlock)",
          /if\(window\.isChessActive&&window\.isChessActive\(\)&&g>0\)\{window\.chess_convert_new_apples\(a,g\);\}/,
          "if(window.isChessActive&&window.isChessActive()&&g>0&&!(window.slot_key_unlock_fruit||window.slot_soko_unlock_fruit)&&(!(window.isSlotMachineActive&&window.isSlotMachineActive())||window.slot_is_chess_mode&&window.slot_is_chess_mode(window.__slotActive))){window.chess_convert_new_apples(a,g);}"
        );
      }
    }
  }
  if (
    code.indexOf("slot_is_chess_mode(window.__slotActive))){try{window.appleArray") < 0 &&
    code.indexOf("window.randomize_pieces();window.shield_empty_all()") >= 0
  ) {
    smReplace(
      "slot chess randomize only on chess roll",
      /if\(window\.isChessActive&&window\.isChessActive\(\)\)\{try\{window\.appleArray=this\.ka;window\.randomize_pieces\(\);window\.shield_empty_all\(\);\}/,
      "if(window.isChessActive&&window.isChessActive()&&(!(window.isSlotMachineActive&&window.isSlotMachineActive())||window.slot_is_chess_mode&&window.slot_is_chess_mode(window.__slotActive))){try{window.appleArray=this.ka;window.randomize_pieces();window.shield_empty_all();}"
    );
  }

  // Twin reverse: pulse __slotTwinLive around the native O6E flip so one Twin
  // badge eat reverses once — leftovers must not keep e7(5) true afterward.
  if (code.indexOf("slot_prep_twin_eat") < 0) {
    if (
      !smReplace(
        "slot pulse twin reverse before e7(5)",
        /\(f=e7\(a\.settings,5\)&&!a\.nj\)&&\(b=!0\)/,
        "window.slot_prep_twin_eat&&window.slot_prep_twin_eat(a,d),(f=e7(a.settings,5)&&!a.nj)&&(b=!0)"
      )
    ) {
      smReplace(
        "slot pulse twin reverse fallback",
        /\(f=e7\(a\.settings,5\)&&!a\.nj\)&&\(b=!0\);/,
        "window.slot_prep_twin_eat&&window.slot_prep_twin_eat(a,d),(f=e7(a.settings,5)&&!a.nj)&&(b=!0);"
      );
    }
  }
  if (code.indexOf("slot_finish_twin_eat") < 0) {
    if (
      !smReplace(
        "slot finish twin reverse after O6E",
        /if\(e=f&&!e7\(a\.settings,2\)\)O6E\(a\.oa,B6E\(a\.Ca\),a\.Ca\.Ca\.bind\(a\.Ca\)\),e7\(a\.settings,20\)&&p5E\(a\.Ga\);/,
        "if(e=f&&!e7(a.settings,2))O6E(a.oa,B6E(a.Ca),a.Ca.Ca.bind(a.Ca)),e7(a.settings,20)&&p5E(a.Ga);window.slot_finish_twin_eat&&window.slot_finish_twin_eat();"
      )
    ) {
      smReplace(
        "slot finish twin reverse after O6E loose",
        /O6E\(a\.oa,B6E\(a\.Ca\),a\.Ca\.Ca\.bind\(a\.Ca\)\),e7\(a\.settings,20\)&&p5E\(a\.Ga\);/,
        "O6E(a.oa,B6E(a.Ca),a.Ca.Ca.bind(a.Ca)),e7(a.settings,20)&&p5E(a.Ga);window.slot_finish_twin_eat&&window.slot_finish_twin_eat();"
      );
    }
  }

  // Upgrade older gate/bridge plant sites that lacked the active-roll gate.
  if (
    code.indexOf("(__slotActive|0)===19)&&(") < 0 &&
    code.indexOf("disableGateMode=!1,h6E") >= 0
  ) {
    smReplace(
      "slot gate plant active-roll upgrade",
      /e7\(a\.settings,19\)&&\(f\|\|window\.slot_force_entity_spawn&&window\.slot_force_entity_spawn\(\)\)&&\(window\.disableGateMode=!1,h6E\(a\.Qa,a\.oa\.ka\)\)/,
      "e7(a.settings,19)&&(!(window.isSlotMachineActive&&window.isSlotMachineActive())||(window.__slotActive|0)===19)&&(f||window.slot_force_entity_spawn&&window.slot_force_entity_spawn())&&(window.disableGateMode=!1,h6E(a.Qa,a.oa.ka))",
      true
    );
  }
  if (
    code.indexOf("(__slotActive|0)===20)&&(") < 0 &&
    code.indexOf("disableBridgeMode=!1,m5E") >= 0
  ) {
    smReplace(
      "slot bridge plant active-roll upgrade",
      /e7\(a\.settings,20\)&&\(f\|\|window\.slot_force_entity_spawn&&window\.slot_force_entity_spawn\(\)\)&&\(window\.disableBridgeMode=!1,m5E\(a\.Ga\),e7\(a\.settings,9\)&&n7E\(a\),window\.slot_ensure_bridge_planted&&window\.slot_ensure_bridge_planted\(a\)\)/,
      "e7(a.settings,20)&&(!(window.isSlotMachineActive&&window.isSlotMachineActive())||(window.__slotActive|0)===20)&&(f||window.slot_force_entity_spawn&&window.slot_force_entity_spawn())&&(window.disableBridgeMode=!1,m5E(a.Ga),e7(a.settings,9)&&n7E(a),window.slot_ensure_bridge_planted&&window.slot_ensure_bridge_planted(a))",
      true
    );
  }

  // Capture key/sokoban plant helpers at eat site. Prefer e=!1 BEFORE captures
  // so a missing q6E/e5E name never falls through to native Vm fruit refill.
  const slotEatCapture =
    "e=!1;try{window.__slotQ6E=q6E;}catch(_q){}try{window.__slotE5E=e5E;}catch(_s){}window.slot_eat_respawn&&window.slot_eat_respawn(a)";
  const slotEatCaptureComma =
    "(e=!1,function(){try{window.__slotQ6E=q6E;}catch(_q){}try{window.__slotE5E=e5E;}catch(_s){}window.slot_eat_respawn&&window.slot_eat_respawn(a);}(),!1)";

  // Upgrade older capture-before-e=!1 hooks (ReferenceError aborted refill skip).
  if (
    code.indexOf("try{window.__slotE5E=e5E;}") < 0 &&
    code.indexOf("window.__slotQ6E=q6E") >= 0 &&
    code.indexOf("slot_eat_respawn&&window.slot_eat_respawn(a)") >= 0
  ) {
    code = code.replace(
      /window\.__slotQ6E=q6E;window\.__slotE5E=e5E;e=!1;window\.slot_eat_respawn&&window\.slot_eat_respawn\(a\)/g,
      slotEatCapture
    );
    code = code.replace(
      /\(window\.__slotQ6E=q6E,window\.__slotE5E=e5E,window\.slot_eat_respawn&&window\.slot_eat_respawn\(a\),!1\)/g,
      slotEatCaptureComma
    );
    code = code.replace(
      /window\.__slotQ6E=q6E,window\.__slotE5E=e5E,window\.slot_eat_respawn&&window\.slot_eat_respawn\(a\)/g,
      "e=!1,function(){try{window.__slotQ6E=q6E;}catch(_q){}try{window.__slotE5E=e5E;}catch(_s){}window.slot_eat_respawn&&window.slot_eat_respawn(a);}()"
    );
  }

  if (code.indexOf("try{window.__slotE5E=e5E;}") < 0 && code.indexOf("slot_eat_respawn&&window.slot_eat_respawn(a)") >= 0) {
    const eatCapRe = /window\.slot_eat_respawn&&window\.slot_eat_respawn\(a\)/g;
    if (code.match(eatCapRe)) {
      code = code.replace(
        eatCapRe,
        "e=!1,function(){try{window.__slotQ6E=q6E;}catch(_q){}try{window.__slotE5E=e5E;}catch(_s){}window.slot_eat_respawn&&window.slot_eat_respawn(a);}()"
      );
    }
  }

  // Native Vm relocates the same apple; Chess leftover steals once pieces exist.
  // Slot also captures Chess freePos/makeApple so second-eat relocate works.
  const slotChessHelpers =
    "window.__chessMakeApple=g7;window.__chessFreePos=d4E;window.__chessPickType=Q3E;";
  if (
    code.indexOf(
      "isSlotMachineActive&&window.isSlotMachineActive()){window.__bombFruitMakeApple=g7"
    ) >= 0 &&
    code.indexOf(
      "isSlotMachineActive&&window.isSlotMachineActive()){window.__bombFruitMakeApple=g7;window.__bombFruitFreePos=d4E;window.__bombFruitPickType=Q3E;window.__chessMakeApple=g7"
    ) < 0
  ) {
    smReplace(
      "slot capture chess helpers on eat (upgrade)",
      /if\(window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)\)\{window\.__bombFruitMakeApple=g7;window\.__bombFruitFreePos=d4E;window\.__bombFruitPickType=Q3E;/,
      "if(window.isSlotMachineActive&&window.isSlotMachineActive()){window.__bombFruitMakeApple=g7;window.__bombFruitFreePos=d4E;window.__bombFruitPickType=Q3E;" +
        slotChessHelpers
    );
  }
  if (
    code.indexOf(
      "isSlotMachineActive&&window.isSlotMachineActive()){window.__bombFruitMakeApple=g7"
    ) < 0 &&
    code.indexOf("try{window.__slotE5E=e5E;}") < 0
  ) {
    if (
      !smReplace(
        "slot capture + eat before chess",
        /e=!1;if\(window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)\{window\.__bombFruitMakeApple=g7;window\.__bombFruitFreePos=d4E;window\.__bombFruitPickType=Q3E;\}if\(window\.isChessActive&&window\.isChessActive\(\)\)\{/,
        "e=!1;if(window.isBombFruitActive&&window.isBombFruitActive()){window.__bombFruitMakeApple=g7;window.__bombFruitFreePos=d4E;window.__bombFruitPickType=Q3E;}if(window.isSlotMachineActive&&window.isSlotMachineActive()){window.__bombFruitMakeApple=g7;window.__bombFruitFreePos=d4E;window.__bombFruitPickType=Q3E;" +
          slotChessHelpers +
          slotEatCapture +
          ";}else if(window.isChessActive&&window.isChessActive()){"
      )
    ) {
      if (
        !smReplace(
          "slot eat before mexico/portal",
          /else if\(window\.isMexicoActive&&window\.isMexicoActive\(\)\)\{e=!window\.cat_allows_pair_spawn\|\|window\.cat_allows_pair_spawn\(a\);\}else e7\(a\.settings,2\)\?/,
          "else if(window.isSlotMachineActive&&window.isSlotMachineActive()){" +
            slotChessHelpers +
            slotEatCapture +
            ";}else if(window.isMexicoActive&&window.isMexicoActive()){e=!window.cat_allows_pair_spawn||window.cat_allows_pair_spawn(a);}else e7(a.settings,2)?"
        )
      ) {
        smReplace(
          "slot skip Vm eat respawn fallback",
          /e=window\.isCatActive&&window\.isCatActive\(\)&&window\.cat_allows_fruit_spawn&&!window\.cat_allows_fruit_spawn\(a,1,1\)\?!1:a\.Vm\(k,!e,null\)/,
          "e=window.isCatActive&&window.isCatActive()&&window.cat_allows_fruit_spawn&&!window.cat_allows_fruit_spawn(a,1,1)?!1:window.isSlotMachineActive&&window.isSlotMachineActive()?" +
            slotEatCaptureComma +
            ":a.Vm(k,!e,null)"
        );
      }
    }
  }

  // Before fruit splice on eat: activate slot mode (respawn at slot_eat_respawn).
  // Also flush portal exit twin after splice (native j4E skipped under Slot Machine).
  if (code.indexOf("slot_flush_portal_twin") < 0) {
    if (
      smReplace(
        "slot flush portal twin on existing eat splice",
        /(window\.slot_on_eating_fruit&&window\.slot_on_eating_fruit\(a,a\.wa\.ka\[k\]\),a\.wa\.ka\.splice\(k,1\),k--,window\.chess_portal_after_fruit_splice&&window\.chess_portal_after_fruit_splice\(a\.wa,a\))/,
        "window.slot_on_eating_fruit&&window.slot_on_eating_fruit(a,a.wa.ka[k]),a.wa.ka.splice(k,1),k--,window.slot_flush_portal_twin&&window.slot_flush_portal_twin(a.wa),window.chess_portal_after_fruit_splice&&window.chess_portal_after_fruit_splice(a.wa,a)",
        true
      )
    ) {
      /* upgraded prior slot splice hook */
    } else if (code.indexOf("slot_on_eating_fruit") < 0) {
      const spliceRe2 =
        /(a\.wa\.ka\.splice\(k,1\),k--,window\.chess_portal_after_fruit_splice&&window\.chess_portal_after_fruit_splice\(a\.wa,a\),window\.isBombFruitActive&&window\.isBombFruitActive\(\)&&\(window\.bombFruit_after_respawn\(a\.wa,0,!1\),0\))/;
      if (code.match(spliceRe2)) {
        smReplace(
          "slot eat before splice",
          spliceRe2,
          "(window.slot_on_eating_fruit&&window.slot_on_eating_fruit(a,a.wa.ka[k]),a.wa.ka.splice(k,1),k--,window.slot_flush_portal_twin&&window.slot_flush_portal_twin(a.wa),window.chess_portal_after_fruit_splice&&window.chess_portal_after_fruit_splice(a.wa,a),window.isBombFruitActive&&window.isBombFruitActive()&&(window.bombFruit_after_respawn(a.wa,0,!1),0))"
        );
      } else {
        const simple =
          /(a\.wa\.ka\.splice\(k,1\),k--,window\.chess_portal_after_fruit_splice&&window\.chess_portal_after_fruit_splice\(a\.wa,a\))/;
        if (code.match(simple)) {
          smReplace(
            "slot eat before splice simple",
            simple,
            "(window.slot_on_eating_fruit&&window.slot_on_eating_fruit(a,a.wa.ka[k]),a.wa.ka.splice(k,1),k--,window.slot_flush_portal_twin&&window.slot_flush_portal_twin(a.wa),window.chess_portal_after_fruit_splice&&window.chess_portal_after_fruit_splice(a.wa,a))"
          );
        } else {
          console.error("SlotMachineMod: failed to find fruit splice eat hook");
        }
      }
    } else {
      console.error("SlotMachineMod: failed to add portal twin flush on eat splice");
    }
  }

  // After f4E respawn (added count g): stamp / slot respawn.
  if (code.indexOf("slot_after_native_respawn(a,g") < 0) {
    smReplace(
      "slot after f4E respawn",
      /if\(window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)\{try\{window\.bombFruit_after_respawn\(a,g,!0\);\}catch\(_bf\)\{\}\}/,
      'if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_after_respawn(a,g,!0);}catch(_bf){}}if(window.isSlotMachineActive&&window.isSlotMachineActive()){try{window.slot_after_native_respawn(a,g);}catch(_sm){}}'
    );
  }

  // Apple-manager reset: after native type assign (R3E / per-fruit Q3E), stamp
  // badges + enforce unique fruit types for the pre-start board. Slot keeps
  // Y3E/e7(2) false until a Portal roll, so R3E never runs on initial spawn —
  // this hook is the only start-layout unique-type path.
  if (code.indexOf("slot_after_layout(this)") < 0) {
    if (
      !smReplace(
        "slot after layout on apple reset (enforceUnique)",
        /if\(e7\(this\.settings,2\)\)\(R3E\(this\),window\.enforceUniquePortalFruitTypes&&window\.enforceUniquePortalFruitTypes\(this\)\);else\{for\(var n of this\.ka\)n\.type=-1;window\.ensureCustomBowlDimensionOka&&window\.ensureCustomBowlDimensionOka\(this\);for\(n of this\.ka\)n\.type=Q3E\(this\)\};/,
        "if(e7(this.settings,2))(R3E(this),window.enforceUniquePortalFruitTypes&&window.enforceUniquePortalFruitTypes(this));else{for(var n of this.ka)n.type=-1;window.ensureCustomBowlDimensionOka&&window.ensureCustomBowlDimensionOka(this);for(n of this.ka)n.type=Q3E(this)};window.isSlotMachineActive&&window.isSlotMachineActive()&&window.slot_after_layout&&window.slot_after_layout(this);"
      )
    ) {
      smReplace(
        "slot after layout on apple reset",
        /if\(e7\(this\.settings,2\)\)R3E\(this\);else\{for\(var n of this\.ka\)n\.type=-1;window\.ensureCustomBowlDimensionOka&&window\.ensureCustomBowlDimensionOka\(this\);for\(n of this\.ka\)n\.type=Q3E\(this\)\};/,
        "if(e7(this.settings,2))R3E(this);else{for(var n of this.ka)n.type=-1;window.ensureCustomBowlDimensionOka&&window.ensureCustomBowlDimensionOka(this);for(n of this.ka)n.type=Q3E(this)};window.isSlotMachineActive&&window.isSlotMachineActive()&&window.slot_after_layout&&window.slot_after_layout(this);"
      );
    }
  }

  // Eat-path j4E / splice: optional capture of key/sokoban helpers (not start layout).
  if (
    code.indexOf("window.__slotQ6E=q6E,window.__slotE5E=e5E,window.slot_after_layout") >= 0
  ) {
    smReplace(
      "slot after layout capture try/catch",
      /window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)&&\(window\.__slotQ6E=q6E,window\.__slotE5E=e5E,window\.slot_after_layout\(a\.wa\),0\)/,
      "window.isSlotMachineActive&&window.isSlotMachineActive()&&((function(){try{window.__slotQ6E=q6E;}catch(_q){}try{window.__slotE5E=e5E;}catch(_s){}})(),window.slot_after_layout(a.wa),0)"
    );
  } else if (
    code.indexOf("try{window.__slotE5E=e5E;}") < 0 &&
    code.indexOf("window.slot_after_layout(a.wa),0)") >= 0 &&
    code.indexOf("window.__slotQ6E=q6E") < 0
  ) {
    smReplace(
      "slot after layout capture key helpers",
      /window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)&&\(window\.slot_after_layout\(a\.wa\),0\)/,
      "window.isSlotMachineActive&&window.isSlotMachineActive()&&((function(){try{window.__slotQ6E=q6E;}catch(_q){}try{window.__slotE5E=e5E;}catch(_s){}})(),window.slot_after_layout(a.wa),0)"
    );
  }

  // Tick hook after BombFruit.
  if (code.indexOf("slot_tick_logic") < 0) {
    const tickBf =
      /if\(window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)\{try\{window\.bombFruit_tick_logic\(this\);\}catch\(_bf\)\{console\.error\("BombFruitMod: tick failed",_bf\);\}\}/;
    if (code.match(tickBf)) {
      smReplace(
        "slot tick after bomb",
        tickBf,
        'if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_tick_logic(this);}catch(_bf){console.error("BombFruitMod: tick failed",_bf);}}if(window.isSlotMachineActive&&window.isSlotMachineActive()){try{window.slot_tick_logic(this);}catch(_sm){console.error("SlotMachineMod: tick failed",_sm);}}'
      );
    } else {
      smReplace(
        "slot tick fallback",
        /\}tick\(\)\{window\.__remixGame=this;if\(window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)\{try\{window\.bombFruit_tick_logic\(this\);\}catch\(_bf\)\{console\.error\("BombFruitMod: tick failed",_bf\);\}\}/,
        '}tick(){window.__remixGame=this;if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_tick_logic(this);}catch(_bf){console.error("BombFruitMod: tick failed",_bf);}}if(window.isSlotMachineActive&&window.isSlotMachineActive()){try{window.slot_tick_logic(this);}catch(_sm){console.error("SlotMachineMod: tick failed",_sm);}}'
      );
    }
  }

  // D5E still opens for Slot Machine so mine/FX pass can run; badges draw AFTER
  // fruit sprites (drawImage hook) so they sit on top, not under the apple.
  if (code.indexOf("isSlotMachineActive()&&window.isSlotMachineActive())&&D5E") < 0 &&
      code.indexOf("isSlotMachineActive&&window.isSlotMachineActive())&&D5E") < 0) {
    smReplace(
      "D5E call gate classic for slot",
      /!e7\(this\.settings,4\)&&\(e7\(this\.settings,12\)\|\|window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)&&D5E\(this\.Ja,a\)/,
      "!e7(this.settings,4)&&(e7(this.settings,12)||window.isBombFruitActive&&window.isBombFruitActive()||window.isSlotMachineActive&&window.isSlotMachineActive())&&D5E(this.Ja,a)"
    );
    smReplace(
      "D5E call gate pixel for slot",
      /\(e7\(this\.settings,12\)\|\|window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)&&D5E\(this\.Ja,dd\)/,
      "(e7(this.settings,12)||window.isBombFruitActive&&window.isBombFruitActive()||window.isSlotMachineActive&&window.isSlotMachineActive())&&D5E(this.Ja,dd)"
    );
  }

  // Stamp missing badges during D5E (before fruit) without drawing yet.
  if (code.indexOf("slot_ensure_badges") < 0) {
    if (
      !smReplace(
        "slot ensure badges after bomb radii",
      /if\(window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)\{try\{window\.bombFruit_drawRadii\(a,b\);\}catch\(_bf\)\{\}\}/,
      'if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_drawRadii(a,b);}catch(_bf){}}if(window.isSlotMachineActive&&window.isSlotMachineActive()){try{window.slot_ensure_badges(a);window.slot_bomb_leftover_draw&&window.slot_bomb_leftover_draw(a);}catch(_sm){}}'
      )
    ) {
      smReplace(
        "slot ensure badges at D5E start",
        /D5E=function\(a,b\)\{/,
        "D5E=function(a,b){if(window.isSlotMachineActive&&window.isSlotMachineActive()){try{window.slot_ensure_badges(a);}catch(_sm){}}"
      );
    }
  }

  // Draw badge after each fruit sprite so it sits on top of the apple.
  if (code.indexOf("slot_draw_badge_at_fruit") < 0) {
    if (
      !smReplace(
        "slot badge after burger fruit draw",
        /\(this\.ka\.drawImage\(f,0,0,g,g,-d\/2,-d\/2,d,d\),b&&!b\.Oka&&b\.burgerGrey>0&&\(this\.ka\.globalAlpha=Math\.min\(\.85,b\.burgerGrey\/110\),this\.ka\.fillStyle="#1a1a1a",this\.ka\.beginPath\(\),this\.ka\.arc\(0,0,d\*\.32,0,6\.283185307179586\),this\.ka\.fill\(\),this\.ka\.globalAlpha=1\)\);/,
        '(this.ka.drawImage(f,0,0,g,g,-d/2,-d/2,d,d),b&&!b.Oka&&b.burgerGrey>0&&(this.ka.globalAlpha=Math.min(.85,b.burgerGrey/110),this.ka.fillStyle="#1a1a1a",this.ka.beginPath(),this.ka.arc(0,0,d*.32,0,6.283185307179586),this.ka.fill(),this.ka.globalAlpha=1),window.slot_draw_badge_at_fruit&&window.slot_draw_badge_at_fruit(this,b,d));'
      )
    ) {
      smReplace(
        "slot badge after fruit drawImage",
        /this\.ka\.drawImage\(f,0,0,g,g,-d\/2,-d\/2,d,d\);/,
        "this.ka.drawImage(f,0,0,g,g,-d/2,-d/2,d,d);window.slot_draw_badge_at_fruit&&window.slot_draw_badge_at_fruit(this,b,d);"
      );
    }
  }

  window.slot_ensure_badges = function slot_ensure_badges(board) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    const game = (board && board.wb) || window.__remixGame;
    if (game) window.__remixGame = game;
    const mgr = (game && game.wa) || (board && board.wb && board.wb.wa);
    if (!mgr || !mgr.ka) return;
    for (let i = 0; i < mgr.ka.length; i++) {
      const f = mgr.ka[i];
      if (!f || f.Oka || f.isPiece) continue;
      if (f.slotMode == null) window.assignSlotMode(f);
    }
  };

  // Fruit draw uses a local transform centered on the apple; badge in that space.
  window.slot_draw_badge_at_fruit = function slot_draw_badge_at_fruit(
    renderer,
    fruit,
    fruitSize
  ) {
    if (!window.isSlotMachineActive || !window.isSlotMachineActive()) return;
    if (!fruit || fruit.Oka || fruit.isPiece || fruit.slotMode == null) return;
    if (!renderer || !renderer.ka || typeof renderer.ka.drawImage !== "function")
      return;
    const url = window.slot_trophy_url_for_mode(fruit.slotMode);
    if (!url) return;
    if (!window.__slotBadgeCache) window.__slotBadgeCache = Object.create(null);
    let img = window.__slotBadgeCache[url];
    if (!img) {
      img = new Image();
      img.decoding = "async";
      img.src = url;
      window.__slotBadgeCache[url] = img;
    }
    if (!img.complete || !img.naturalWidth) return;
    const d = fruitSize > 0 ? fruitSize : 16;
    const size = Math.max(6, (d * 0.45) | 0);
    const pad = Math.max(1, (size * 0.18) | 0);
    const bg = size + pad * 2;
    const ctx = renderer.ka;
    try {
      ctx.save();
      ctx.globalAlpha = 1;
      // Local space: apple centered at origin; badge centered on the fruit.
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-bg / 2, -bg / 2, bg, bg, Math.max(2, bg * 0.22));
      } else {
        ctx.arc(0, 0, bg / 2, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    } catch (_e) {}
  };

  // Kept for tests / callers; board-space pass is unused for z-order now.
  window.slot_draw_badges = function slot_draw_badges(board, _frac) {
    window.slot_ensure_badges(board);
  };

  // Reset state.
  if (code.indexOf("slot_reset_state") < 0) {
    smReplace(
      "slot reset",
      /if\(window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)\{try\{window\.bombFruit_reset_state\(\);\}catch\(_bf\)\{\}\}/,
      'if(window.isBombFruitActive&&window.isBombFruitActive()){try{window.bombFruit_reset_state();}catch(_bf){}}if(window.isSlotMachineActive&&window.isSlotMachineActive()){try{window.slot_reset_state();}catch(_sm){}}'
    );
  }

  // Play-start trophy + reset.
  if (code.indexOf("updateSlotMachineTrophySRC()") < 0) {
    smReplace(
      "play-start slot trophy",
      /if\(window\.CurrentModeNum===window\.BOMB_FRUIT_MODE\)\{window\.updateBombFruitTrophySRC\(\);window\.bombFruit_reset_state\(\);\}/,
      "if(window.CurrentModeNum===window.BOMB_FRUIT_MODE){window.updateBombFruitTrophySRC();window.bombFruit_reset_state();}if(window.CurrentModeNum===window.SLOT_MACHINE_MODE){window.updateSlotMachineTrophySRC();window.slot_reset_state();window.slot_update_cat_hud&&window.slot_update_cat_hud();}"
    );
  }

  // Deathscreen / blender icons (no blender toggle, but deathscreen needs icon).
  if (code.indexOf("window.SLOT_MACHINE_MODE)?window.SLOT_MACHINE_ICON") < 0) {
    smReplace(
      "deathscreen Zb slot icon",
      /\(a\.settings\.ob===window\.BOMB_FRUIT_MODE\)\?window\.BOMB_FRUIT_ICON:/,
      "(a.settings.ob===window.BOMB_FRUIT_MODE)?window.BOMB_FRUIT_ICON:(a.settings.ob===window.SLOT_MACHINE_MODE)?window.SLOT_MACHINE_ICON:"
    );
    smReplace(
      "blender b3E slot icon",
      /\(c===window\.BOMB_FRUIT_MODE\)\?window\.BOMB_FRUIT_ICON:/,
      "(c===window.BOMB_FRUIT_MODE)?window.BOMB_FRUIT_ICON:(c===window.SLOT_MACHINE_MODE)?window.SLOT_MACHINE_ICON:"
    );
  }

  // Cat life spend while Slot Machine even when Cat not the roll:
  // Oa already checks isCatActive — our wrap keeps it true when lives>0.

  return code;
};

window.remixInjectSlotMachineSettingsUi = function remixInjectSlotMachineSettingsUi() {
  if (typeof window.remixEnsureCustomSettingsUi === "function") {
    window.remixEnsureCustomSettingsUi();
  }
  const panel = document.getElementById("remix-custom-panel-slot");
  if (!panel) return;
  if (!window.pudding_settings) window.pudding_settings = {};
  // First visit: persist full pool so saves round-trip explicitly.
  if (window.pudding_settings.SlotMachineModes == null) {
    window.pudding_settings.SlotMachineModes =
      window.slot_default_enabled_modes
        ? window.slot_default_enabled_modes()
        : (window.SLOT_MACHINE_POOL || []).slice();
  }

  let card = document.getElementById("remix-slot-modes-card");
  if (!card) {
    card = document.createElement("div");
    card.id = "remix-slot-modes-card";
    card.className = "remix-custom-card";
    card.innerHTML =
      '<div class="remix-custom-title">Slot Machine badges</div>' +
      '<div class="remix-custom-hint">Choose which mode badges can appear on fruit. At least one must stay on (default: all).</div>' +
      '<div class="remix-custom-toolbar">' +
      '<div class="remix-custom-toolbar-actions">' +
      '<button type="button" id="remix-slot-modes-all" class="btn remix-custom-btn-inline">Select all</button>' +
      '<button type="button" id="remix-slot-modes-none" class="btn remix-custom-btn-inline">Deselect all</button>' +
      '<button type="button" id="remix-slot-modes-vanilla" class="btn remix-custom-btn-inline">Vanilla only</button>' +
      "</div>" +
      '<span id="remix-slot-modes-status" class="remix-custom-hint remix-custom-status"></span>' +
      "</div>" +
      '<div id="remix-slot-mode-grid" class="remix-slot-mode-grid"></div>';
    panel.appendChild(card);

    const allBtn = document.getElementById("remix-slot-modes-all");
    if (allBtn) {
      allBtn.addEventListener("click", function () {
        if (typeof window.slot_set_enabled_modes === "function") {
          window.slot_set_enabled_modes(window.slot_default_enabled_modes());
        }
        window.remixRenderSlotMachineModeGrid();
      });
    }
    const noneBtn = document.getElementById("remix-slot-modes-none");
    if (noneBtn) {
      noneBtn.addEventListener("click", function () {
        if (typeof window.slot_deselect_all_enabled_modes === "function") {
          window.slot_deselect_all_enabled_modes();
        }
        window.remixRenderSlotMachineModeGrid();
      });
    }
    const vanillaBtn = document.getElementById("remix-slot-modes-vanilla");
    if (vanillaBtn) {
      vanillaBtn.addEventListener("click", function () {
        if (typeof window.slot_vanilla_only_enabled_modes === "function") {
          window.slot_vanilla_only_enabled_modes();
        }
        window.remixRenderSlotMachineModeGrid();
      });
    }
  }
  window.remixRenderSlotMachineModeGrid();
};

window.remixRenderSlotMachineModeGrid = function remixRenderSlotMachineModeGrid() {
  const grid = document.getElementById("remix-slot-mode-grid");
  if (!grid) return;
  const pool = window.SLOT_MACHINE_POOL || [];
  const enabled = new Set(
    (typeof window.slot_get_enabled_modes === "function"
      ? window.slot_get_enabled_modes()
      : pool
    ).map(function (m) {
      return m | 0;
    })
  );
  grid.innerHTML = "";
  for (let i = 0; i < pool.length; i++) {
    const mode = pool[i] | 0;
    const on = enabled.has(mode);
    const cell = document.createElement("button");
    cell.type = "button";
    // Do not reuse native blender classes (vuOknd / blender_icon) — those are
    // absolutely positioned for the trophy blender panel and stack here.
    cell.className =
      "remix-slot-mode-cell" + (on ? " remix-slot-mode-on" : "");
    cell.dataset.mode = String(mode);
    const labels = window.SLOT_MACHINE_MODE_LABELS || {};
    const label =
      labels[mode] ||
      (window.modeToTxt &&
        window.modeToTxt[mode] &&
        window.modeToTxt[mode].name) ||
      "Mode " + mode;
    cell.title = label;
    cell.setAttribute("aria-label", label);
    cell.setAttribute("aria-pressed", on ? "true" : "false");

    const img = document.createElement("img");
    img.className = "remix-slot-mode-img";
    img.alt = label;
    img.draggable = false;
    const src =
      typeof window.slot_trophy_url_for_mode === "function"
        ? window.slot_trophy_url_for_mode(mode)
        : "";
    if (src) img.src = src;
    cell.appendChild(img);

    cell.addEventListener("click", function () {
      if (typeof window.slot_toggle_enabled_mode === "function") {
        window.slot_toggle_enabled_mode(mode);
      }
      window.remixRenderSlotMachineModeGrid();
    });
    grid.appendChild(cell);
  }

  const status = document.getElementById("remix-slot-modes-status");
  if (status) {
    status.textContent =
      "Selected " + enabled.size + " / " + pool.length;
  }
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
  if (typeof window.slot_wrap_ultra_disable_flags === "function") {
    window.slot_wrap_ultra_disable_flags();
  }
  try {
    window.slot_sync_ultra_disables && window.slot_sync_ultra_disables();
  } catch (_eSync) {}

  if (typeof window.remixInjectSlotMachineSettingsUi === "function") {
    try {
      window.remixInjectSlotMachineSettingsUi();
    } catch (_ui) {}
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

  // Chess unlock calls updateTrophySRC() with no type → under Slot restore
  // the active badge icon (piece pickup with a type still shows the piece).
  if (
    typeof window.updateTrophySRC === "function" &&
    !window.updateTrophySRC.__slotWrap
  ) {
    const origTrophy = window.updateTrophySRC;
    window.updateTrophySRC = function (type) {
      if (
        window.isSlotMachineActive &&
        window.isSlotMachineActive() &&
        (type == null || arguments.length === 0)
      ) {
        if (window.__slotActive != null) {
          window.slot_update_active_trophy &&
            window.slot_update_active_trophy();
        } else {
          window.updateSlotMachineTrophySRC &&
            window.updateSlotMachineTrophySRC();
        }
        return;
      }
      return origTrophy.apply(this, arguments);
    };
    window.updateTrophySRC.__slotWrap = true;
  }

  // Ultra blocks native arrow turns when the checkbox is off — under Slot
  // Machine only allow new arrows while Arrow (16) is the active roll.
  if (
    typeof window.ultraBlockNativeArrowTurns === "function" &&
    !window.ultraBlockNativeArrowTurns.__slotWrap
  ) {
    const origBlock = window.ultraBlockNativeArrowTurns;
    window.ultraBlockNativeArrowTurns = function () {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        return !window.__slotAllowArrowTurns;
      }
      return origBlock.apply(this, arguments);
    };
    window.ultraBlockNativeArrowTurns.__slotWrap = true;
  }

  // Ultra defaults shielded-fruit spawn OFF — Slot Shield roll must still get
  // nba bars, and leftover __slotShield fruit must not be stripped each tick.
  if (
    typeof window.ultraShouldSpawnFruitShields === "function" &&
    !window.ultraShouldSpawnFruitShields.__slotWrap
  ) {
    const origSpawnShields = window.ultraShouldSpawnFruitShields;
    window.ultraShouldSpawnFruitShields = function () {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        return (window.__slotActive | 0) === 15;
      }
      return origSpawnShields.apply(this, arguments);
    };
    window.ultraShouldSpawnFruitShields.__slotWrap = true;
  }

  // Burger must never timer/expire chess leftover pieces under Slot
  // (Blender Chess+Burger can still convert pieces — Slot leaves them alone).
  if (
      typeof window.burger_assign_timer === "function" &&
      !window.burger_assign_timer.__slotPieceGate
    ) {
      const origBurgerAssign = window.burger_assign_timer;
      window.burger_assign_timer = function (apple, game) {
        if (
          window.isSlotMachineActive &&
          window.isSlotMachineActive() &&
          apple &&
          apple.isPiece
        ) {
          return;
        }
        return origBurgerAssign.apply(this, arguments);
      };
      window.burger_assign_timer.__slotPieceGate = true;
    }

    if (
      typeof window.burger_apple_timer_eligible === "function" &&
      !window.burger_apple_timer_eligible.__slotPieceGate
    ) {
      const origBurgerElig = window.burger_apple_timer_eligible;
      window.burger_apple_timer_eligible = function (game, apple) {
        if (
          window.isSlotMachineActive &&
          window.isSlotMachineActive() &&
          apple &&
          apple.isPiece
        ) {
          return false;
        }
        return origBurgerElig.apply(this, arguments);
      };
      window.burger_apple_timer_eligible.__slotPieceGate = true;
    }

    if (
      typeof window.burger_expire_apple === "function" &&
      !window.burger_expire_apple.__slotPieceGate
    ) {
      const origBurgerExpire = window.burger_expire_apple;
      window.burger_expire_apple = function (game, apple) {
        if (
          window.isSlotMachineActive &&
          window.isSlotMachineActive() &&
          apple &&
          apple.isPiece
        ) {
          return;
        }
        return origBurgerExpire.apply(this, arguments);
      };
      window.burger_expire_apple.__slotPieceGate = true;
    }

    if (
      typeof window.burger_make_poison === "function" &&
      !window.burger_make_poison.__slotPieceGate
    ) {
      const origBurgerPoison = window.burger_make_poison;
      window.burger_make_poison = function (apple, game) {
        if (
          window.isSlotMachineActive &&
          window.isSlotMachineActive() &&
          apple &&
          apple.isPiece
        ) {
          return;
        }
        const r = origBurgerPoison.apply(this, arguments);
        if (
          apple &&
          apple.Oka &&
          window.isSlotMachineActive &&
          window.isSlotMachineActive()
        ) {
          apple.__slotBurgerPoison = true;
          delete apple.slotMode;
        }
        return r;
      };
      window.burger_make_poison.__slotPieceGate = true;
    }

  // Burger tick is gated on isBurgerActive (false after leaving the roll).
  // Leftover Burger poisons still need countdown/despawn under Slot.
  if (
    typeof window.burger_tick_logic === "function" &&
    !window.burger_tick_logic.__slotLeftoverWrap
  ) {
    const origBurgerTick = window.burger_tick_logic;
    window.burger_tick_logic = function () {
      // Under live Burger roll, never age with null/NaN timers (treat as
      // unassigned and arm first). (null|0)===0 would otherwise poison the
      // whole board in one tick.
      if (
        window.isSlotMachineActive &&
        window.isSlotMachineActive() &&
        (window.__slotActive | 0) === 25
      ) {
        try {
          const g = window.__remixGame;
          const list = g && g.wa && g.wa.ka;
          if (list && typeof window.burger_assign_timer === "function") {
            for (let i = 0; i < list.length; i++) {
              const a = list[i];
              if (!a || a.Oka || a.isPiece) continue;
              if (
                a.burgerTimer == null ||
                !Number.isFinite(Number(a.burgerTimer)) ||
                !Number.isFinite(Number(a.burgerTimerMax)) ||
                (a.burgerTimerMax | 0) <= 0
              ) {
                window.burger_assign_timer(a, g);
              }
            }
          }
        } catch (_arm) {}
      }
      const r = origBurgerTick.apply(this, arguments);
      if (
        window.isSlotMachineActive &&
        window.isSlotMachineActive() &&
        (window.__slotActive | 0) !== 25
      ) {
        try {
          window.slot_burger_leftover_tick &&
            window.slot_burger_leftover_tick(window.__remixGame);
        } catch (_e) {}
      }
      return r;
    };
    window.burger_tick_logic.__slotLeftoverWrap = true;
  }

  // Burger expire spawn: avoid qaF eat-flag races under Slot; plant via Slot
  // helpers and flag after_native so it only badges (never strip+respawn).
  if (
    typeof window.burger_spawn_fresh === "function" &&
    !window.burger_spawn_fresh.__slotWrap
  ) {
    const origBurgerSpawn = window.burger_spawn_fresh;
    window.burger_spawn_fresh = function (game, sequenceNumber) {
      if (
        window.isSlotMachineActive &&
        window.isSlotMachineActive() &&
        (window.__slotActive | 0) === 25
      ) {
        const g = game || window.__remixGame;
        const mgr = g && g.wa;
        if (!mgr) return false;
        let pos = null;
        try {
          if (typeof window.burger_find_spawn_pos === "function") {
            pos = window.burger_find_spawn_pos(g);
          }
        } catch (_p) {}
        if (!pos && typeof window.slot_free_pos === "function") {
          pos = window.slot_free_pos(mgr);
        }
        if (!pos) return false;
        window.__slotBurgerSpawning = true;
        try {
          const apple =
            typeof window.slot_make_apple === "function"
              ? window.slot_make_apple(mgr, pos)
              : null;
          if (!apple) return false;
          apple.Oka = false;
          if (sequenceNumber !== undefined) {
            apple.sequenceNumber = sequenceNumber;
          }
          if (typeof window.assignSlotMode === "function") {
            window.assignSlotMode(apple);
          }
          if (typeof window.burger_assign_timer === "function") {
            window.burger_assign_timer(apple, g);
          }
          mgr.ka.push(apple);
          window.appleArray = mgr.ka;
          return true;
        } catch (_sp) {
          return false;
        } finally {
          window.__slotBurgerSpawning = false;
        }
      }
      window.__slotBurgerSpawning = true;
      try {
        return origBurgerSpawn.apply(this, arguments);
      } finally {
        window.__slotBurgerSpawning = false;
      }
    };
    window.burger_spawn_fresh.__slotWrap = true;
  }

  // Never return NaN/0 from burger_timer_roll under Slot (instant board poison).
  if (
    typeof window.burger_timer_roll === "function" &&
    !window.burger_timer_roll.__slotWrap
  ) {
    const origRoll = window.burger_timer_roll;
    window.burger_timer_roll = function () {
      const t = origRoll.apply(this, arguments);
      if (!Number.isFinite(t) || (t | 0) < 1) return 25;
      return t | 0;
    };
    window.burger_timer_roll.__slotWrap = true;
  }

  // Slot Peaceful roll: Cat is always "active" under Slot for HUD, so Oa/Sc
  // life-spend gates never see native e7(21) alone. Treat __slotActive===21 as
  // permanent grace (cancel death, wrap border) without spending lives.
  if (
    typeof window.cat_try_spend_life === "function" &&
    !window.cat_try_spend_life.__slotPeacefulWrap
  ) {
    const origSpend = window.cat_try_spend_life;
    window.cat_try_spend_life = function (game) {
      if (
        window.isSlotMachineActive &&
        window.isSlotMachineActive() &&
        (window.__slotActive | 0) === 21
      ) {
        try {
          window.cat_wrap_head_if_needed &&
            window.cat_wrap_head_if_needed(game || window.__remixGame);
        } catch (_w) {}
        return true;
      }
      return origSpend.apply(this, arguments);
    };
    window.cat_try_spend_life.__slotPeacefulWrap = true;
  }

  // Chess leftover pieces keep isChessActive true under Slot; never wipe real
  // Shield-badge fruit bars. Piece-lock uses shield_all / carrying path instead.
  if (typeof window.shield_empty_all === "function" && !window.shield_empty_all.__slotWrap) {
    const origEmpty = window.shield_empty_all;
    window.shield_empty_all = function () {
      if (!window.appleArray) return;
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        const field = window.chess_shield_field || "nba";
        window.appleArray.forEach(function (apple) {
          if (!apple) return;
          if (apple.isPiece) {
            apple[field] = undefined;
            return;
          }
          if (
            window.slot_restore_shield_nba_after_chess_lock &&
            window.slot_restore_shield_nba_after_chess_lock(apple, field)
          ) {
            return;
          }
          if (apple.__slotShield || apple.__ultraKeepShield) {
            // Marked shield fruit that was never chess-locked — keep bars.
            return;
          }
          apple[field] = undefined;
        });
        window.slot_chess_board_lock = 0;
        return;
      }
      return origEmpty.apply(this, arguments);
    };
    window.shield_empty_all.__slotWrap = true;
  }
  if (typeof window.shield_all === "function" && !window.shield_all.__slotWrap) {
    const origShieldAll = window.shield_all;
    window.shield_all = function () {
      if (!window.appleArray) return;
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        const chessRoll =
          window.slot_is_chess_mode &&
          window.slot_is_chess_mode(window.__slotActive);
        const carrying =
          !!window.head_state && window.head_state !== "OPEN";
        // Peaceful unlocks leftovers only when head is OPEN (not carrying).
        if (
          !carrying &&
          !chessRoll &&
          window.chess_peaceful_active &&
          window.chess_peaceful_active()
        ) {
          if (window.shield_empty_all) window.shield_empty_all();
          return;
        }
        // Carrying a piece (or Chess roll): lock every apple like Chess mode.
        if (chessRoll || carrying) {
          window.slot_chess_board_lock = 1;
          if (window.slot_snapshot_shield_nba_for_chess_lock) {
            window.slot_snapshot_shield_nba_for_chess_lock();
          }
          return origShieldAll.apply(this, arguments);
        }
        // Idle leftover pieces only: lock pieces, leave badged fruit playable.
        const field = window.chess_shield_field || "nba";
        window.appleArray.forEach(function (apple) {
          if (!apple || !apple.isPiece) return;
          apple[field] = new Set(["UP", "DOWN", "LEFT", "RIGHT"]);
        });
        return;
      }
      return origShieldAll.apply(this, arguments);
    };
    window.shield_all.__slotWrap = true;
  }
  if (
    typeof window.chess_convert_new_apples === "function" &&
    !window.chess_convert_new_apples.__slotWrap
  ) {
    const origConvert = window.chess_convert_new_apples;
    window.chess_convert_new_apples = function () {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        // Key/soko unlock must stay a regular badged fruit — never a piece,
        // even while the Chess badge roll is active.
        if (window.slot_key_unlock_fruit || window.slot_soko_unlock_fruit) {
          return;
        }
        if (
          !(
            window.slot_is_chess_mode &&
            window.slot_is_chess_mode(window.__slotActive)
          )
        ) {
          return;
        }
      }
      return origConvert.apply(this, arguments);
    };
    window.chess_convert_new_apples.__slotWrap = true;
  }
  if (
    typeof window.randomize_pieces === "function" &&
    !window.randomize_pieces.__slotWrap
  ) {
    const origRand = window.randomize_pieces;
    window.randomize_pieces = function () {
      if (
        window.isSlotMachineActive &&
        window.isSlotMachineActive() &&
        !(window.slot_is_chess_mode && window.slot_is_chess_mode(window.__slotActive))
      ) {
        return;
      }
      return origRand.apply(this, arguments);
    };
    window.randomize_pieces.__slotWrap = true;
  }
  // Native Chess Vm plants 2 pieces on every fruit eat while isChessActive.
  // Under Slot, only Chess-badge slotRespawn may plant pieces (allow flag).
  // Unlock-fruit eats must refill via slot_eat_respawn → one badge fruit.
  if (
    typeof window.chess_fruit_respawn === "function" &&
    !window.chess_fruit_respawn.__slotWrap
  ) {
    const origFruitRespawn = window.chess_fruit_respawn;
    window.chess_fruit_respawn = function () {
      if (window.isSlotMachineActive && window.isSlotMachineActive()) {
        if (window.__slotAllowChessFruitRespawn) {
          return origFruitRespawn.apply(this, arguments);
        }
        // Piece pickup: never refill here.
        if (window.just_ate === "piece") return 0;
        // Native Chess path stole a fruit eat — Slot owns badge refill.
        if (!window.__slotRespawnedThisEat) {
          try {
            window.slot_eat_respawn &&
              window.slot_eat_respawn(window.__remixGame);
          } catch (_e) {}
        }
        return 0;
      }
      return origFruitRespawn.apply(this, arguments);
    };
    window.chess_fruit_respawn.__slotWrap = true;
  }
  if (
    typeof window.chess_assign_piece === "function" &&
    !window.chess_assign_piece.__slotWrap
  ) {
    const origAssign = window.chess_assign_piece;
    window.chess_assign_piece = function (el) {
      const r = origAssign.apply(this, arguments);
      if (el) {
        el.isPiece = true;
        delete el.slotMode;
        delete el.__slotPortal;
        delete el.__slotPortalPairId;
        delete el.__slotPortalTwin;
        delete el.__slotBombPlant;
        delete el.__slotPoison;
        delete el.__slotNbaPrior;
        delete el.__slotNbaPriorSaved;
        el.__slotShield = false;
        el.__ultraKeepShield = false;
        el.burgerTimer = null;
        el.burgerTimerMax = null;
        el.burgerGrey = 0;
      }
      return r;
    };
    window.chess_assign_piece.__slotWrap = true;
  }
  // Stamp unlock fruit with a random badge (not forced Chess — otherwise the
  // chess loop never ends). Eating a Chess-badge fruit is what respawns pieces.
  if (
    typeof window.capture_attempt === "function" &&
    !window.capture_attempt.__slotWrap
  ) {
    const origCapture = window.capture_attempt;
    window.capture_attempt = function (x, y) {
      const before =
        window.__remixGame &&
        window.__remixGame.wa &&
        window.__remixGame.wa.ka
          ? window.__remixGame.wa.ka.slice()
          : null;
      const r = origCapture.apply(this, arguments);
      if (r && window.isSlotMachineActive && window.isSlotMachineActive()) {
        try {
          window.just_ate = "fruit";
          const list =
            (window.__remixGame &&
              window.__remixGame.wa &&
              window.__remixGame.wa.ka) ||
            window.appleArray ||
            [];
          for (let i = 0; i < list.length; i++) {
            const f = list[i];
            if (!f || f.isPiece || f.Oka) continue;
            if (f.slotMode != null) continue;
            if (
              before &&
              before.indexOf(f) >= 0 &&
              !(f.pos && f.pos.x === x && f.pos.y === y)
            ) {
              continue;
            }
            if (f.pos && (f.pos.x | 0) === (x | 0) && (f.pos.y | 0) === (y | 0)) {
              // Unlock must fully demote piece identity before badge stamp.
              window.slot_demote_chess_piece_to_fruit(
                f,
                window.__remixGame && window.__remixGame.wa
              );
              f.__slotFromChessUnlock = true;
              window.assignSlotMode(f);
              break;
            }
          }
          window.slot_sanitize_chess_identity(
            window.__remixGame && window.__remixGame.wa
          );
        } catch (_e) {}
      }
      return r;
    };
    window.capture_attempt.__slotWrap = true;
  }
};
