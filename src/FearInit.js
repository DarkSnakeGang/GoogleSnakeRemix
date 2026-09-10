window.FearMod = {};

////////////////////////////////////////////////////////////////////
// RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.FearMod.runCodeBefore = function () {
  console.log("Adding Fear Mode (v1)");

  // RemixBuilder replaces these tokens with embedded data URIs.
  window.FEAR_ICON = "__FEAR_MODE_ICON__";
  window.FEAR_GHOST_NORMAL = "__FEAR_GHOST_NORMAL__";
  window.FEAR_GHOST_PIXEL = "__FEAR_GHOST_PIXEL__";
  window.FEAR_GHOST_REAL = "__FEAR_GHOST_REAL__";
  window.FEAR_ARROW_PURPLE = "#6038A0";

  window.uiImage =
    window.uiImage ||
    function (src) {
      const img = new Image();
      img.src = src;
      img.classList.add("DqMRee");
      img.classList.add("SsAred");
      return img;
    };

  window.fearEnsureTrophy = function fearEnsureTrophy() {
    if (window.FEAR_MODE != null) return;
    const root = document.querySelector("#trophy");
    if (!root || !window.FEAR_ICON) return;
    root.appendChild(window.uiImage(window.FEAR_ICON));
    window.FEAR_MODE = root.children.length - 1;
  };
  window.fearEnsureTrophy();

  const trophy = document.querySelector('img[src$="trophy_00.png"]');
  if (trophy) {
    const jsname = trophy.getAttribute("jsname");
    window.trophy_src =
      window.trophy_src ||
      `document.querySelector('img[jsname="${jsname}"]').src `;
  }

  window.fear_blending = false;
  window.toggle_fear_blender = function toggle_fear_blender() {
    window.fear_blending = !window.fear_blending;
    window.correct_fear_selection();
  };
  window.correct_fear_selection = function correct_fear_selection() {
    const el = document.getElementById("remix-fear-blend");
    if (!el) return;
    if (window.fear_blending) {
      el.className = "vuOknd lH9Ipd blender_icon blender_icon_on";
      el.innerHTML =
        '<img class="DEvgAc FMN3L blender_icon_img blender_icon_img_selected" src="' +
        window.FEAR_ICON +
        '" alt="">';
    } else {
      el.className = "vuOknd blender_icon";
      el.innerHTML =
        '<img class="DEvgAc blender_icon_img" src="' +
        window.FEAR_ICON +
        '" alt="">';
    }
  };
  window.add_fear_blender_toggle = function add_fear_blender_toggle() {
    if (document.getElementById("remix-fear-blend")) return;
    if (!window.populateRemixBlenderSlot) return;
    window.populateRemixBlenderSlot({
      id: "remix-fear-blend",
      slotIndex: 7,
      icon: window.FEAR_ICON,
      ariaLabel: "Toggle Fear in Blender",
      onToggle: window.toggle_fear_blender,
    });
    window.correct_fear_selection();
  };
  window.add_fear_blender_toggle();

  window.fearInjectFruitType = function fearInjectFruitType() {
    if (!window.new_fruit || window._fearFruitInjected) return;
    let insertAt =
      typeof window.CUSTOM_FRUIT_NEW_FRUIT_INDEX === "number"
        ? window.CUSTOM_FRUIT_NEW_FRUIT_INDEX + 1
        : Math.max(0, window.new_fruit.length - 18);
    insertAt = Math.max(0, Math.min(insertAt, window.new_fruit.length));
    window.new_fruit.splice(insertAt, 0, {
      Normal: window.FEAR_GHOST_NORMAL,
      Pixel: window.FEAR_GHOST_PIXEL,
      Real: window.FEAR_GHOST_REAL,
      Poison_values: "b,'#6038A0','#6038A0',20",
      __fearGhostFruit: true,
    });
    window.FEAR_GHOST_NEW_FRUIT_INDEX = insertAt;
    const base =
      typeof last_fruit_num !== "undefined"
        ? last_fruit_num
        : document.querySelector("#apple").children.length - 1;
    window.FEAR_GHOST_TYPE = base + 1 + insertAt;

    // Fear is inserted immediately before Chess's hidden fruit entries.
    if (window._chessFruitsInjected) {
      [
        "bbishop",
        "bking",
        "bknight",
        "bpawn",
        "bqueen",
        "brook",
        "wbishop",
        "wking",
        "wknight",
        "wpawn",
        "wqueen",
        "wrook",
      ].forEach(function (key) {
        if (typeof window[key] === "number") window[key] += 1;
      });
    }
    window._fearFruitInjected = true;
  };
  window.fearInjectFruitType();
};

////////////////////////////////////////////////////////////////////
// RUNTIME
////////////////////////////////////////////////////////////////////

window.fear_mode_selected = function fear_mode_selected() {
  if (window.FEAR_MODE == null) return false;
  if (
    window.CurrentModeNum === window.FEAR_MODE ||
    window.CurrentModeNum === "fear"
  ) {
    return true;
  }
  if (
    (window.CurrentModeNum === 22 ||
      window.CurrentModeNum === "blender") &&
    window.fear_blending
  ) {
    return true;
  }
  const g = window.__remixGame;
  const mode =
    g && g.settings
      ? g.settings.ub != null
        ? g.settings.ub
        : g.settings.ob
      : null;
  return (
    mode === window.FEAR_MODE ||
    mode === "fear" ||
    ((mode === 22 || mode === "blender") && window.fear_blending)
  );
};

window.fear_has_slot_ghost = function fear_has_slot_ghost(game) {
  const g = game || window.__remixGame;
  const list = g && g.wa && g.wa.ka;
  if (!list) return false;
  for (let i = 0; i < list.length; i++) {
    if (list[i] && list[i].__slotFearGhost) return true;
  }
  return false;
};

window.isFearActive = function isFearActive() {
  return !!(
    window.fear_mode_selected() ||
    window.fear_has_slot_ghost() ||
    (window.fearTurnsRemaining | 0) > 0 ||
    (window.isSlotMachineActive &&
      window.isSlotMachineActive() &&
      window.FEAR_MODE != null &&
      (window.__slotActive | 0) === (window.FEAR_MODE | 0))
  );
};

window.fear_uses_ghost_pairs = function fear_uses_ghost_pairs(game) {
  return !!(
    window.fear_mode_selected() ||
    window.fear_has_slot_ghost(game)
  );
};

window.updateFearTrophySRC = function updateFearTrophySRC() {
  if (window.trophy_src && window.FEAR_ICON) {
    eval(window.trophy_src + "=window.FEAR_ICON");
  }
};

window.fear_reset_state = function fear_reset_state() {
  window.__fearGrid = new Map();
  window.__fearGridSignature = "";
  window.__fearOwnerSeq = 0;
  window.__fearPairSeq = 0;
  window.__fearLastHeadKey = null;
  window.__fearLastProcessedKey = null;
  window.__fearLayoutReady = false;
  window.__fearTenSide = null;
  window.__fearSeenFruits = new WeakSet();
  window.fearTurnsRemaining = 0;
  window.__fearRefreshedMove = false;
  window.__fearGhostTopUpThisEat = false;
};
window.fear_reset_state();

window.fear_key = function fear_key(x, y) {
  return (x | 0) + "," + (y | 0);
};

window.fear_head = function fear_head(game) {
  const snake = game && game.oa;
  return snake && snake.ka && snake.ka[0];
};

window.fear_box = function fear_box(game) {
  const g = game || window.__remixGame;
  const box =
    g &&
    ((g.ka && g.ka.oa) ||
      (g.wa && g.wa.oa && g.wa.oa.oa) ||
      (g.oa && g.oa.oa));
  return box
    ? { width: box.width | 0, height: box.height | 0 }
    : null;
};

window.fear_wraps = function fear_wraps(game) {
  const g = game || window.__remixGame;
  try {
    if (typeof e7 === "function" && g && g.settings) {
      return !!(e7(g.settings, 4) || e7(g.settings, 21));
    }
  } catch (_e) {}
  return !!(
    window.slot_borderless_wrap && window.slot_borderless_wrap()
  );
};

window.fear_step = function fear_step(pos, dir, game) {
  if (!pos) return null;
  const box = window.fear_box(game);
  if (!box || box.width <= 0 || box.height <= 0) return null;
  let x = Math.round(+pos.x);
  let y = Math.round(+pos.y);
  if (dir === "LEFT") x--;
  else if (dir === "RIGHT") x++;
  else if (dir === "UP") y--;
  else if (dir === "DOWN") y++;
  if (window.fear_wraps(game)) {
    x = (x + box.width) % box.width;
    y = (y + box.height) % box.height;
  }
  if (x < 0 || y < 0 || x >= box.width || y >= box.height) return null;
  return { x: x, y: y };
};

window.fear_wall_keys = function fear_wall_keys(game) {
  const keys = new Set();
  const walls = game && game.Ca && game.Ca.Aa;
  if (!walls || typeof walls.values !== "function") return keys;
  try {
    for (const wall of walls.values()) {
      if (wall && wall.pos) {
        keys.add(window.fear_key(wall.pos.x, wall.pos.y));
      }
    }
  } catch (_e) {}
  return keys;
};

window.fear_is_ghost = function fear_is_ghost(fruit) {
  if (!fruit) return false;
  return !!(
    fruit.__fearGhost ||
    fruit.__slotFearGhost ||
    (fruit.Oka && window.fear_mode_selected())
  );
};

// Oka is Poison's rendering flag. Capture native Poison pairing into a
// dedicated Fear marker, then clear Oka so every animation path uses the
// hidden ghost fruit atlas instead of briefly drawing a poison skull.
window.fear_capture_ghost_type = function fear_capture_ghost_type(fruit) {
  if (!fruit) return false;
  if (
    fruit.__slotFearGhost ||
    fruit.__fearGhost ||
    (fruit.Oka && window.fear_mode_selected())
  ) {
    fruit.__fearGhost = true;
    fruit.Oka = false;
    return true;
  }
  return false;
};

window.fear_sync_fruit_type = function fear_sync_fruit_type(fruit) {
  if (!fruit) return;
  window.fear_capture_ghost_type(fruit);
  if (typeof window.FEAR_GHOST_TYPE !== "number") return;
  if (window.fear_is_ghost(fruit)) {
    if (
      fruit.type !== window.FEAR_GHOST_TYPE &&
      fruit.__fearOriginalType == null
    ) {
      fruit.__fearOriginalType = fruit.type;
    }
    fruit.type = window.FEAR_GHOST_TYPE;
  } else if (
    fruit.type === window.FEAR_GHOST_TYPE &&
    fruit.__fearOriginalType != null
  ) {
    fruit.type = fruit.__fearOriginalType;
    delete fruit.__fearOriginalType;
  }
};

window.fear_sync_fruit_types = function fear_sync_fruit_types(game) {
  const g = game || window.__remixGame;
  const list = g && g.wa && g.wa.ka;
  if (!list) return;
  for (let i = 0; i < list.length; i++) {
    window.fear_sync_fruit_type(list[i]);
  }
};

window.fear_owner_id = function fear_owner_id(fruit) {
  if (!fruit.__fearOwnerId) {
    fruit.__fearOwnerId = "fear-" + ++window.__fearOwnerSeq;
  }
  return fruit.__fearOwnerId;
};

window.fear_is_moving_mode = function fear_is_moving_mode(game) {
  const g = game || window.__remixGame;
  try {
    if (typeof e7 === "function" && g && g.settings) {
      if (e7(g.settings, 6) || e7(g.settings, 18)) return true;
    }
  } catch (_e) {}
  return !!(
    window.isSlotMachineActive &&
    window.isSlotMachineActive() &&
    ((window.__slotActive | 0) === 6 || (window.__slotActive | 0) === 18)
  );
};

window.fear_is_corner = function fear_is_corner(x, y, game) {
  const box = window.fear_box(game);
  if (!box) return false;
  return (
    (x === 0 || x === box.width - 1) &&
    (y === 0 || y === box.height - 1)
  );
};

window.fear_fruit_near_corner = function fear_fruit_near_corner(x, y, game) {
  const box = window.fear_box(game);
  if (!box) return false;
  const corners = [
    [0, 0],
    [box.width - 1, 0],
    [0, box.height - 1],
    [box.width - 1, box.height - 1],
  ];
  for (let i = 0; i < corners.length; i++) {
    if (Math.abs(x - corners[i][0]) + Math.abs(y - corners[i][1]) === 1) {
      return true;
    }
  }
  return false;
};

window.fear_regroup_ten = function fear_regroup_ten(game) {
  if (window.__fearTenSide != null) return;
  const g = game || window.__remixGame;
  const list = g && g.wa && g.wa.ka;
  if (!window.fear_mode_selected() || !list || !g.settings) return;
  // Keep every count layout, including 10a, in its native Poison-pair
  // positions. Fear only swaps the paired bad fruit to the ghost atlas.
  window.__fearTenSide = "native";
};

window.fear_initialize_layout = function fear_initialize_layout(game) {
  const g = game || window.__remixGame;
  const list = g && g.wa && g.wa.ka;
  if (!window.fear_mode_selected() || !list || window.__fearLayoutReady) return;
  window.fear_regroup_ten(g);
  if (!list.some(function (fruit) {
    return fruit && window.fear_is_ghost(fruit);
  })) {
    // Stable ModeRegistry ids can make native l4E see "fear" rather than 10.
    // If native made no poison at all, repair the paired layout in place.
    for (let i = 0; i + 1 < list.length; i += 2) {
      const a = list[i];
      const b = list[i + 1];
      if (!a || !b) continue;
      const firstGhost = Math.random() < 0.5;
      a.__fearGhost = firstGhost;
      b.__fearGhost = !firstGhost;
      a.Oka = false;
      b.Oka = false;
    }
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i]) {
      window.fear_capture_ghost_type(list[i]);
      window.__fearSeenFruits.add(list[i]);
    }
  }
};

window.fear_pair_new_fruits = function fear_pair_new_fruits(game) {
  const g = game || window.__remixGame;
  const list = g && g.wa && g.wa.ka;
  if (!window.fear_mode_selected() || !list) return;
  const freshObjects = [];
  for (let i = 0; i < list.length; i++) {
    const fruit = list[i];
    if (!fruit || window.__fearSeenFruits.has(fruit)) continue;
    freshObjects.push(fruit);
    window.__fearSeenFruits.add(fruit);
  }
  for (let i = 0; i + 1 < freshObjects.length; i += 2) {
    const a = freshObjects[i];
    const b = freshObjects[i + 1];
    if (!!a.Oka === !!b.Oka) {
      const firstGhost = Math.random() < 0.5;
      a.__fearGhost = firstGhost;
      b.__fearGhost = !firstGhost;
    } else {
      a.__fearGhost = !!a.Oka;
      b.__fearGhost = !!b.Oka;
    }
    a.Oka = false;
    b.Oka = false;
    window.fear_sync_fruit_type(a);
    window.fear_sync_fruit_type(b);
  }
};

window.fear_position_occupied = function fear_position_occupied(
  game,
  x,
  y,
  except
) {
  const g = game || window.__remixGame;
  const list = g && g.wa && g.wa.ka;
  if (list) {
    for (let i = 0; i < list.length; i++) {
      const fruit = list[i];
      if (!fruit || fruit === except || !fruit.pos) continue;
      if (
        Math.round(+fruit.pos.x) === x &&
        Math.round(+fruit.pos.y) === y
      ) {
        return true;
      }
    }
  }
  const snake = g && g.oa && g.oa.ka;
  if (snake) {
    for (let i = 0; i < snake.length; i++) {
      if (
        snake[i] &&
        Math.round(+snake[i].x) === x &&
        Math.round(+snake[i].y) === y
      ) {
        return true;
      }
    }
  }
  return window.fear_wall_keys(g).has(window.fear_key(x, y));
};

window.fear_position_allowed = function fear_position_allowed(
  game,
  x,
  y,
  fruit
) {
  const box = window.fear_box(game);
  if (!box || x < 0 || y < 0 || x >= box.width || y >= box.height) return false;
  if (window.fear_fruit_near_corner(x, y, game)) return false;
  if (
    window.__fearGrid &&
    window.__fearGrid.has(window.fear_key(x, y))
  ) {
    return false;
  }
  return !window.fear_position_occupied(game, x, y, fruit);
};

window.fear_spawn_candidate_allowed = function fear_spawn_candidate_allowed(
  pos,
  game
) {
  if (!pos || pos.x == null || pos.y == null) return false;
  const g = game || window.__remixGame;
  const x = Math.round(+pos.x);
  const y = Math.round(+pos.y);
  if (window.fear_fruit_near_corner(x, y, g)) return false;
  return !(
    window.__fearGrid &&
    window.__fearGrid.has(window.fear_key(x, y))
  );
};

// Filter the native free-position picker before an apple is created. Native
// collision/radius/entity rules remain authoritative; Fear adds only its
// arrow-seat and corner-seat exclusions. The finite unique-result budget
// returns null through the normal native spawn-failure path instead of moving
// a fruit after placement or retrying forever.
window.fear_spawn_pick = function fear_spawn_pick(nativePicker) {
  const args = Array.prototype.slice.call(arguments, 1);
  if (typeof nativePicker !== "function") return null;
  if (!window.isFearActive || !window.isFearActive()) {
    return nativePicker.apply(null, args);
  }
  // Native reset owns fixed/bulk opening coordinates. Their arrow/fruit
  // collisions are handled by ring omission; filtering starts after the
  // opening has been classified and the first Fear grid has been built.
  if (window.fear_mode_selected() && !window.__fearLayoutReady) {
    return nativePicker.apply(null, args);
  }
  const g = window.__remixGame;
  const box = window.fear_box(g);
  const total = box ? Math.max(1, box.width * box.height) : 256;
  const budget = Math.min(total, 32);
  const seen = new Set();
  for (let attempt = 0; attempt < budget; attempt++) {
    const pos = nativePicker.apply(null, args);
    if (!pos) return null;
    const key = window.fear_key(pos.x, pos.y);
    if (seen.has(key)) continue;
    seen.add(key);
    if (window.fear_spawn_candidate_allowed(pos, g)) return pos;
    if (seen.size >= total) break;
  }
  return null;
};

window.fear_add_owner = function fear_add_owner(grid, x, y, owner) {
  const key = window.fear_key(x, y);
  let cell = grid.get(key);
  if (!cell) {
    cell = { x: x, y: y, direction: "NONE", owners: [] };
    grid.set(key, cell);
  }
  for (let i = 0; i < cell.owners.length; i++) {
    if (cell.owners[i].id === owner.id) return;
  }
  cell.owners.push(owner);
};

window.fear_direction_delta = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

window.fear_inward_direction = function fear_inward_direction(cell, fruit) {
  const dx = Math.round(+fruit.pos.x) - cell.x;
  const dy = Math.round(+fruit.pos.y) - cell.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "RIGHT" : "LEFT";
  return dy > 0 ? "DOWN" : "UP";
};

window.fear_preferred_direction = function fear_preferred_direction(
  head,
  facing,
  fruit
) {
  if (facing === "UP" || facing === "DOWN") {
    if (+head.x < +fruit.pos.x) return "LEFT";
    if (+head.x > +fruit.pos.x) return "RIGHT";
    return Math.random() < 0.5 ? "LEFT" : "RIGHT";
  }
  if (+head.y < +fruit.pos.y) return "UP";
  if (+head.y > +fruit.pos.y) return "DOWN";
  return Math.random() < 0.5 ? "UP" : "DOWN";
};

window.fear_opposite = function fear_opposite(dir) {
  return dir === "UP"
    ? "DOWN"
    : dir === "DOWN"
      ? "UP"
      : dir === "LEFT"
        ? "RIGHT"
        : "LEFT";
};

window.fear_direction_safe = function fear_direction_safe(
  game,
  cell,
  dir
) {
  const next = window.fear_step(cell, dir, game);
  if (!next) return false;
  const key = window.fear_key(next.x, next.y);
  if (window.fear_wall_keys(game).has(key)) return false;
  const body = game && game.oa && game.oa.ka;
  if (body) {
    for (let i = 1; i < body.length; i++) {
      if (
        body[i] &&
        Math.round(+body[i].x) === next.x &&
        Math.round(+body[i].y) === next.y
      ) {
        return false;
      }
    }
  }
  return true;
};

window.fear_choose_direction = function fear_choose_direction(
  game,
  cell,
  owner
) {
  const snake = game && game.oa;
  const head = window.fear_head(game);
  const facing = (snake && snake.direction) || window.head_dir || "RIGHT";
  if (!owner || !owner.fruit || !owner.fruit.pos || !head) return facing;
  const inward = window.fear_inward_direction(cell, owner.fruit);
  const preferred = window.fear_preferred_direction(
    head,
    facing,
    owner.fruit
  );
  const opposite = window.fear_opposite(facing);
  const valid = function (dir) {
    return (
      dir !== inward &&
      dir !== opposite &&
      window.fear_direction_safe(game, cell, dir)
    );
  };
  let chosen;
  if (valid(preferred)) {
    chosen = preferred;
  } else if (valid(facing)) {
    chosen = facing;
  } else {
    const alternatives = ["UP", "DOWN", "LEFT", "RIGHT"].filter(function (
      dir
    ) {
      return dir !== preferred && dir !== facing && valid(dir);
    });
    chosen = alternatives.length
      ? alternatives[(Math.random() * alternatives.length) | 0]
      : facing;
  }

  const box = window.fear_box(game);
  if (box && !window.fear_wraps(game)) {
    const intoBorder =
      (cell.x === 0 && chosen === "LEFT") ||
      (cell.x === box.width - 1 && chosen === "RIGHT") ||
      (cell.y === 0 && chosen === "UP") ||
      (cell.y === box.height - 1 && chosen === "DOWN");
    if (intoBorder) chosen = facing;
  }
  return chosen;
};

window.fear_rebuild_grid = function fear_rebuild_grid(game) {
  const g = game || window.__remixGame;
  const mgr = g && g.wa;
  const list = mgr && mgr.ka;
  if (!list) {
    window.__fearGrid = new Map();
    window.__fearGridSignature = "";
    return window.__fearGrid;
  }
  window.fear_initialize_layout(g);
  window.fear_regroup_ten(g);
  window.fear_sync_fruit_types(g);
  const grid = new Map();
  const walls = window.fear_wall_keys(g);
  const occupied = new Set();
  for (let i = 0; i < list.length; i++) {
    const f = list[i];
    if (f && f.pos) {
      occupied.add(
        window.fear_key(Math.round(+f.pos.x), Math.round(+f.pos.y))
      );
    }
  }
  const moving = window.fear_is_moving_mode(g);
  const dirs = ["UP", "DOWN", "LEFT", "RIGHT"];
  for (let i = 0; i < list.length; i++) {
    const fruit = list[i];
    if (!fruit || !fruit.pos) continue;
    const ghost = window.fear_is_ghost(fruit);
    const temporary = !ghost && (window.fearTurnsRemaining | 0) > 0;
    if (!ghost && !temporary) continue;
    if (ghost && moving) continue;
    const owner = {
      id: window.fear_owner_id(fruit),
      fruit: fruit,
      kind: ghost ? "ghost" : "temporary",
    };
    for (let d = 0; d < dirs.length; d++) {
      const p = window.fear_step(fruit.pos, dirs[d], g);
      if (!p) continue;
      const key = window.fear_key(p.x, p.y);
      if (
        window.fear_is_corner(p.x, p.y, g) ||
        walls.has(key) ||
        occupied.has(key)
      ) {
        continue;
      }
      window.fear_add_owner(grid, p.x, p.y, owner);
    }
  }
  const head = window.fear_head(g);
  for (const cell of grid.values()) {
    cell.direction =
      cell.owners.length > 1
        ? (g.oa && g.oa.direction) || window.head_dir || "RIGHT"
        : window.fear_choose_direction(g, cell, cell.owners[0]);
    cell.__fearArrow = true;
  }
  window.__fearGrid = grid;
  window.__fearGridSignature = window.fear_layout_signature(g);
  window.__fearLayoutReady = true;
  return grid;
};

window.fear_layout_signature = function fear_layout_signature(game) {
  const g = game || window.__remixGame;
  const list = g && g.wa && g.wa.ka;
  if (!list) return "";
  const parts = [];
  for (let i = 0; i < list.length; i++) {
    const fruit = list[i];
    if (!fruit || !fruit.pos) continue;
    parts.push(
      window.fear_owner_id(fruit) +
        ":" +
        Math.round(+fruit.pos.x) +
        "," +
        Math.round(+fruit.pos.y) +
        ":" +
        (window.fear_is_ghost(fruit) ? "g" : "f")
    );
  }
  parts.sort();
  return parts.join("|") + "#t" + ((window.fearTurnsRemaining | 0) > 0 ? 1 : 0);
};

window.fear_apply_direction = function fear_apply_direction(game, dir) {
  const snake = game && game.oa;
  if (!snake || !dir || dir === "NONE") return;
  const x = Math.round(+window.fear_head(game).x);
  const y = Math.round(+window.fear_head(game).y);
  const rows = [];
  rows[y] = [];
  rows[y][x] = { direction: dir, wm: true };
  const manager = {
    ka: rows,
    settings: { ub: -1, ob: -1, Qa: false },
    oa: game && game.oa && game.oa.oa,
  };
  if (typeof window.__fearNativeArrowStep === "function") {
    const result = window.__fearNativeArrowStep(
      game,
      manager,
      snake,
      { x: x, y: y }
    );
    window.head_dir = snake.direction;
    return result;
  } else if (dir === window.fear_opposite(snake.direction)) {
    // Unit-test/unsupported-build fallback mirrors Arrow mode's reverse-arrow
    // collision. Live games always use the exposed native adapter.
    if (game && typeof game.Oa === "function") game.Oa();
    return "CRASH";
  } else if (typeof window.__fearNativeTurn === "function") {
    window.__fearNativeTurn(snake, dir);
  } else {
    // Unit-test/unsupported-build fallback only. Live games use S6E.
    snake.direction = dir;
    snake.Qb = true;
    snake.yb = "NONE";
    snake.Ga = "NONE";
    if (snake.Fb) snake.kc = snake.direction;
    snake.Fb = false;
  }
  window.head_dir = snake.direction;
  return dir;
};

window.fear_native_arrow_feedback = function fear_native_arrow_feedback(
  game,
  cell,
  dir
) {
  if (
    !cell ||
    typeof window.__fearNativeArrowConsume !== "function" ||
    dir === "NONE"
  ) {
    return;
  }
  const x = Math.round(+cell.x);
  const y = Math.round(+cell.y);
  const rows = [];
  rows[y] = [];
  rows[y][x] = { direction: dir, wm: true };
  // h7 clears this disposable tile and plays the same directional sound as a
  // real Arrow-mode collision. The persistent Fear grid is left untouched.
  window.__fearNativeArrowConsume(
    {
      ka: rows,
      settings: { ub: -1, ob: -1, Qa: false },
      oa: game && game.oa && game.oa.oa,
    },
    { x: x, y: y },
    true
  );
};

window.fear_resolve_cell_direction = function fear_resolve_cell_direction(
  game,
  cell
) {
  if (!cell || !cell.owners || !cell.owners.length) return "NONE";
  const facing =
    (game && game.oa && game.oa.direction) ||
    window.head_dir ||
    cell.direction;
  if (cell.owners.length > 1) {
    return facing;
  }
  // Fear arrows may be rebuilt before the snake turns elsewhere. Never leave
  // a now-reversed arrow visible: forward is both safe and visually truthful.
  if (cell.direction === window.fear_opposite(facing)) return facing;
  return cell.direction;
};

window.fear_remove_ghosts = function fear_remove_ghosts(game, owners) {
  const list = game && game.wa && game.wa.ka;
  if (!list) return 0;
  const remove = new Set();
  for (let i = 0; i < owners.length; i++) {
    if (owners[i] && owners[i].kind === "ghost") {
      remove.add(owners[i].fruit);
    }
  }
  let n = 0;
  for (let i = list.length - 1; i >= 0; i--) {
    if (remove.has(list[i])) {
      list.splice(i, 1);
      n++;
    }
  }
  return n;
};

window.fear_win_if_empty = function fear_win_if_empty(game, mgr) {
  const g = game || window.__remixGame;
  const manager = mgr || (g && g.wa);
  if (!g || g.nj || !manager || !manager.ka || manager.ka.length) return false;
  if (
    window.isSlotMachineActive &&
    window.isSlotMachineActive() &&
    typeof window.slot_win_if_empty === "function"
  ) {
    return !!window.slot_win_if_empty(g, manager);
  }
  if (typeof window.bombFruit_trigger_win === "function") {
    window.bombFruit_trigger_win(g);
    return true;
  }
  g.ub = true;
  g.nj = true;
  return true;
};

window.fear_activate = function fear_activate(game, multiplier) {
  const roll =
    typeof window.burger_timer_roll === "function"
      ? window.burger_timer_roll(game)
      : 25;
  const scale = multiplier == null ? 1 : Math.max(1, +multiplier || 1);
  const baseDuration = Math.max(1, Math.floor(roll / 2));
  window.fearTurnsRemaining = Math.max(1, Math.floor(baseDuration * scale));
  window.__fearRefreshedMove = true;
};

window.fear_expire = function fear_expire() {
  window.fearTurnsRemaining = 0;
  if (window.__fearGrid) {
    for (const [key, cell] of window.__fearGrid.entries()) {
      cell.owners = cell.owners.filter(function (owner) {
        return owner.kind === "ghost";
      });
      if (!cell.owners.length) window.__fearGrid.delete(key);
    }
  }
};

window.fear_process_arrow = function fear_process_arrow(game, cell) {
  if (!cell || !cell.owners || !cell.owners.length) return false;
  const owners = cell.owners.slice();
  const ghosts = owners.filter(function (owner) {
    return owner.kind === "ghost";
  });
  const dir = window.fear_resolve_cell_direction(game, cell);
  const arrowResult = window.fear_apply_direction(game, dir);
  if (arrowResult === "CRASH") return true;
  if (typeof window.__fearNativeArrowStep !== "function") {
    window.fear_native_arrow_feedback(game, cell, dir);
  }
  if (ghosts.length) {
    window.fear_remove_ghosts(game, ghosts);
    window.fear_activate(game);
  } else {
    window.fear_expire();
  }
  window.fear_rebuild_grid(game);
  window.fear_win_if_empty(game, game && game.wa);
  return true;
};

window.fear_find_fruit = function fear_find_fruit(game, pos) {
  const list = game && game.wa && game.wa.ka;
  if (!list || !pos) return null;
  for (let i = 0; i < list.length; i++) {
    const f = list[i];
    if (
      f &&
      f.pos &&
      Math.round(+f.pos.x) === Math.round(+pos.x) &&
      Math.round(+f.pos.y) === Math.round(+pos.y)
    ) {
      return f;
    }
  }
  return null;
};

window.fear_reconcile_pairs = function fear_reconcile_pairs(game, trimExcess) {
  const list = game && game.wa && game.wa.ka;
  if (!list) return;
  const groups = new Map();
  for (let i = 0; i < list.length; i++) {
    const fruit = list[i];
    if (!fruit || fruit.__fearPairId == null) continue;
    const id = fruit.__fearPairId;
    if (!groups.has(id)) groups.set(id, { ghosts: [], fresh: [] });
    groups.get(id)[window.fear_is_ghost(fruit) ? "ghosts" : "fresh"].push(fruit);
  }
  const paired = new Set();
  for (const group of groups.values()) {
    if (group.ghosts.length === 1 && group.fresh.length === 1) {
      paired.add(group.ghosts[0]);
      paired.add(group.fresh[0]);
    } else {
      group.ghosts.concat(group.fresh).forEach(function (fruit) {
        delete fruit.__fearPairId;
      });
    }
  }
  const ghosts = [];
  const fresh = [];
  for (let i = 0; i < list.length; i++) {
    const fruit = list[i];
    if (!fruit || paired.has(fruit)) continue;
    (window.fear_is_ghost(fruit) ? ghosts : fresh).push(fruit);
  }
  const count = Math.min(ghosts.length, fresh.length);
  for (let i = 0; i < count; i++) {
    const id = "fear-pair-" + ++window.__fearPairSeq;
    ghosts[i].__fearPairId = id;
    fresh[i].__fearPairId = id;
  }
  if (trimExcess && ghosts.length > fresh.length) {
    const excess = new Set(ghosts.slice(count));
    for (let i = list.length - 1; i >= 0; i--) {
      if (excess.has(list[i])) list.splice(i, 1);
    }
  }
};

window.fear_remove_fresh_pair = function fear_remove_fresh_pair(game, fruit) {
  const list = game && game.wa && game.wa.ka;
  if (!list || !fruit || window.fear_is_ghost(fruit)) return 0;
  window.fear_reconcile_pairs(game, true);
  const index = list.indexOf(fruit);
  if (index < 0) return 0;
  if (fruit.__fearPairId != null) {
    for (let i = 0; i < list.length; i++) {
      const twin = list[i];
      if (
        twin !== fruit &&
        twin &&
        twin.__fearPairId === fruit.__fearPairId &&
        window.fear_is_ghost(twin)
      ) {
        list.splice(i, 1);
        delete fruit.__fearPairId;
        return 1;
      }
    }
  }
  const preferred = index % 2 === 0 ? index + 1 : index - 1;
  const candidates = [preferred, index - 1, index + 1];
  for (let i = 0; i < candidates.length; i++) {
    const twinIndex = candidates[i];
    if (twinIndex < 0 || twinIndex >= list.length) continue;
    const twin = list[twinIndex];
    if (!twin || twin === fruit || !window.fear_is_ghost(twin)) continue;
    list.splice(twinIndex, 1);
    delete fruit.__fearPairId;
    return 1;
  }
  return 0;
};

window.fear_before_native_fruit_eat =
  function fear_before_native_fruit_eat(game, fruit, nativeIndex) {
    if (!game || !fruit) return nativeIndex;
    window.__fearGhostTopUpThisEat = false;
    if (window.fear_is_ghost(fruit)) {
      window.fear_direct_contact(game, fruit);
      // The native branch has already retained this object in `d`. Mark that
      // stale reference as poison so it cannot score, grow, or trigger refill.
      fruit.Oka = true;
      return Math.max(0, nativeIndex | 0);
    }
    window.fear_remove_fresh_pair(game, fruit);
    const updated = game.wa && game.wa.ka
      ? game.wa.ka.indexOf(fruit)
      : -1;
    return updated >= 0 ? updated : nativeIndex;
  };

window.fear_native_ghost_top_up =
  function fear_native_ghost_top_up(mgr, nativeTopUp) {
    const g = window.__remixGame;
    const list = mgr && mgr.ka;
    const spawn =
      typeof nativeTopUp === "function"
        ? nativeTopUp
        : typeof window.__fearE4E === "function"
          ? window.__fearE4E
          : null;
    if (!g || !list || !spawn) return false;
    window.__fearE4E = spawn;
    // At most one ghost spawn attempt per apple eat (e4E / g4E / after_respawn).
    if (window.__fearGhostTopUpThisEat) return false;
    window.fear_sync_fruit_types(g);
    const ghosts = list.filter(function (fruit) {
      return window.fear_is_ghost(fruit);
    }).length;
    const fresh = list.length - ghosts;
    if (ghosts >= fresh) return false;
    window.__fearGhostTopUpThisEat = true;
    const before = list.length;
    const ok = spawn(mgr);
    if (ok === false || list.length <= before) {
      window.fear_sync_fruit_types(g);
      window.fear_reconcile_pairs(g, true);
      return false;
    }
    for (let i = before; i < list.length; i++) {
      const fruit = list[i];
      if (!fruit) continue;
      fruit.__fearGhost = true;
      fruit.Oka = false;
      window.__fearSeenFruits.add(fruit);
      window.fear_sync_fruit_type(fruit);
    }
    window.fear_pair_new_fruits(g);
    window.fear_sync_fruit_types(g);
    window.fear_reconcile_pairs(g, true);
    return true;
  };

window.fear_direct_contact = function fear_direct_contact(game, fruit) {
  if (!fruit) return false;
  const head = window.fear_head(game);
  const snake = game && game.oa;
  const facing = (snake && snake.direction) || window.head_dir || "RIGHT";
  const virtual = {
    x: Math.round(+head.x),
    y: Math.round(+head.y),
  };
  const owner = {
    id: window.fear_owner_id(fruit),
    fruit: fruit,
    kind: window.fear_is_ghost(fruit) ? "ghost" : "temporary",
  };
  const dir = window.fear_choose_direction(game, virtual, owner) || facing;
  window.fear_apply_direction(game, dir);
  if (owner.kind === "ghost") {
    window.fear_remove_ghosts(game, [owner]);
    // Reaching the ghost itself is harder than taking one of its arrows.
    window.fear_activate(game, 2);
  } else {
    window.fear_expire();
  }
  window.fear_win_if_empty(game, game && game.wa);
  return true;
};

window.fear_tick_logic = function fear_tick_logic(game) {
  const g = game || window.__remixGame;
  if (!g || !g.wa || !g.oa || g.nj) return;
  window.__remixGame = g;
  window.__fearRefreshedMove = false;
  const head = window.fear_head(g);
  if (!head) return;
  const headKey = window.fear_key(head.x, head.y);
  const moved =
    window.__fearLastHeadKey != null &&
    window.__fearLastHeadKey !== headKey;

  // Resolve the grid that was actually visible when this tile was entered
  // before rebuilding around any fruit that spawned/moved onto that cell.
  // This preserves the locked "Fear arrow wins over fruit" miracle rule.
  let processed = false;
  const landedCell = window.__fearGrid && window.__fearGrid.get(headKey);
  if (landedCell && window.__fearLastProcessedKey !== headKey) {
    window.fear_process_arrow(g, landedCell);
    window.__fearLastProcessedKey = headKey;
    processed = true;
  }

  window.fear_regroup_ten(g);
  window.fear_rebuild_grid(g);
  const cell = window.__fearGrid.get(headKey);
  if (!processed && cell && window.__fearLastProcessedKey !== headKey) {
    window.fear_process_arrow(g, cell);
    window.__fearLastProcessedKey = headKey;
  } else if (!processed && !cell) {
    window.__fearLastProcessedKey = null;
  }

  if (
    moved &&
    (window.fearTurnsRemaining | 0) > 0 &&
    !window.__fearRefreshedMove
  ) {
    window.fearTurnsRemaining = Math.max(
      0,
      (window.fearTurnsRemaining | 0) - 1
    );
    if ((window.fearTurnsRemaining | 0) === 0) window.fear_expire();
  }

  // Prevent the missing-arrow fallback from ever entering a ghost. During
  // Fear, direct entry into ordinary fruit behaves like its temporary arrow.
  const facing = (g.oa && g.oa.direction) || window.head_dir || "RIGHT";
  const next = window.fear_step(head, facing, g);
  const target = window.fear_find_fruit(g, next);
  if (
    target &&
    (window.fear_is_ghost(target) ||
      ((window.fearTurnsRemaining | 0) > 0 && !target.Oka))
  ) {
    window.fear_direct_contact(g, target);
  }

  window.__fearLastHeadKey = headKey;
  window.fear_rebuild_grid(g);
};

window.fear_draw_arrows = function fear_draw_arrows(board) {
  const game = board.wb || window.__remixGame;
  if (!game || game.nj) return;
  // Fruit may move or be spawned after the pre-move Fear tick. Reconcile once
  // when its rounded tile layout changes, before any arrow pixels are drawn.
  if (window.fear_layout_signature(game) !== window.__fearGridSignature) {
    window.fear_rebuild_grid(game);
  }
  if (!window.__fearGrid || !window.__fearGrid.size || !board) return;
  const ctx = board.ka;
  const tile = game.ka && game.ka.ka;
  if (!ctx || !tile) return;

  // Native q4E/r4E Arrow-mode geometry.
  const pixel = (function () {
    try {
      return typeof $6 === "function" && board.settings
        ? !!$6(board.settings)
        : false;
    } catch (_e) {
      return false;
    }
  })();
  const halfTile = tile / 2;
  const halfHeight = halfTile * 0.6;
  const halfWidth = Math.sqrt((3 * Math.pow(halfHeight, 2)) / 4);

  ctx.save();
  ctx.fillStyle = window.FEAR_ARROW_PURPLE || "#6038A0";
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = tile / 8;
  ctx.lineCap = "butt";
  ctx.setLineDash([]);
  for (const cell of window.__fearGrid.values()) {
    const direction = window.fear_resolve_cell_direction(game, cell);
    if (!cell || direction === "NONE") continue;
    // Never paint an arrow under any current fruit, including a late external
    // spawn that did not use d4E.
    if (
      window.fear_position_occupied(
        game,
        cell.x,
        cell.y,
        null
      ) &&
      window.fear_find_fruit(game, cell)
    ) {
      continue;
    }
    const cx = cell.x * tile + tile / 2;
    const cy = cell.y * tile + tile / 2;
    ctx.save();
    ctx.translate(cx, cy);
    if (direction === "UP") ctx.rotate(-Math.PI / 2);
    else if (direction === "DOWN") ctx.rotate(Math.PI / 2);
    else if (direction === "LEFT") ctx.rotate(Math.PI);
    ctx.fillStyle = window.FEAR_ARROW_PURPLE || "#6038A0";
    ctx.strokeStyle = ctx.fillStyle;
    if (pixel) {
      const step = halfHeight / 2;
      const origin = (step * 3) / 2;
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(origin - step / 2 - i * step, -step / 2 - i * step, step, step);
        if (i > 0) {
          ctx.fillRect(
            origin - step / 2 - i * step,
            -step / 2 + i * step,
            step,
            step
          );
        }
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(-halfWidth, -halfHeight);
      ctx.lineTo(halfWidth, 0);
      ctx.lineTo(-halfWidth, halfHeight);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
};

window.fear_after_respawn = function fear_after_respawn(mgr) {
  const g = window.__remixGame;
  if (!g || !mgr || !window.isFearActive()) return;
  window.fear_pair_new_fruits(g);
  if (window.fear_uses_ghost_pairs && window.fear_uses_ghost_pairs(g)) {
    window.fear_native_ghost_top_up(mgr);
  } else {
    window.fear_sync_fruit_types(g);
    window.fear_reconcile_pairs(g, true);
  }
  window.fear_rebuild_grid(g);
  window.fear_win_if_empty(g, mgr);
};

////////////////////////////////////////////////////////////////////
// ALTER SNAKE CODE
////////////////////////////////////////////////////////////////////

window.FearMod.alterSnakeCode = function (code) {
  console.log("Coding Fear Mode into the game (v1)");

  function fearReplace(label, re, replacement) {
    if (!code.match(re)) {
      console.error("FearMod: failed to find " + label);
      return false;
    }
    try {
      code = code.assertReplace(re, replacement);
      return true;
    } catch (e) {
      console.error("FearMod: replace failed for " + label, e);
      return false;
    }
  }

  // Expose Arrow Mode's complete collision sequence. This uses the native
  // direction lookup, reverse-arrow crash, turn transition, and tile consume.
  fearReplace(
    "native Arrow collision exposure",
    /S6E=function\(a,b\)\{a\.direction=b;a\.Qb=!0;a\.yb="NONE";a\.Ga="NONE";a\.Fb&&\(a\.kc=a\.direction\);a\.Fb=!1\}/,
    'S6E=(window.__fearNativeArrowConsume=h7,window.__fearNativeTurn=function(a,b){a.direction=b;a.Qb=!0;a.yb="NONE";a.Ga="NONE";a.Fb&&(a.kc=a.direction);a.Fb=!1},window.__fearNativeArrowStep=function(a,b,c,d){var e=U3E(b,d);if(e==="NONE")return e;if(e===Z6(c.direction)){a&&typeof a.Oa==="function"&&a.Oa();return"CRASH"}S6E(c,e);h7(b,d,!0);return e},window.__fearNativeTurn)'
  );

  // Keep a handle so post-respawn can top-up ghosts when fresh > ghosts.
  fearReplace(
    "expose native e4E",
    /,e4E=function\(a\)\{/,
    ",e4E=window.__fearE4E=function(a){"
  );

  // Treat full Fear / Fear blender as native Poison for pair counts and refill.
  fearReplace(
    "e7 poison clone",
    /if\(!r&&b===1&&\(\(window\.isTempWallsActive&&window\.isTempWallsActive\(\)\)\|\|\(window\.tempWalls_has_any&&window\.tempWalls_has_any\(window\.__remixGame\)\)\)\)return!0;return r\}/,
    "if(!r&&b===1&&((window.isTempWallsActive&&window.isTempWallsActive())||(window.tempWalls_has_any&&window.tempWalls_has_any(window.__remixGame))))return!0;if(!r&&b===10&&window.FEAR_MODE!=null){if(a.ub===window.FEAR_MODE||a.ub==='fear'||a.ob==='fear')return!0;if((a.ub===22||a.ub==='blender')&&a.rSa&&a.rSa.has(window.FEAR_MODE))return!0;if(a.Qa&&a.Lc&&(a.Lc.has(window.FEAR_MODE)||a.Lc.has('fear')))return!0;}return r}"
  );

  // Draw ghost art for Fear Oka only; normal Poison/custom poison stays intact.
  const poisonDraw =
    /([a-zA-Z0-9_$])=([a-zA-Z0-9_$])\.Oka\?E3E\(this\.([a-zA-Z0-9_$]{1,8})\[([a-zA-Z0-9_$])\],\2\.([a-zA-Z0-9_$]{1,8})\)\.ka\.canvas:this\.\3\[\4\]\.uH\(\2\.\5\)/;
  if (poisonDraw.test(code)) {
    code = code.assertReplace(
      poisonDraw,
      "$1=(window.fear_sync_fruit_type&&window.fear_sync_fruit_type($2),window.fear_is_ghost&&window.fear_is_ghost($2)?this.$3[$4].uH($2.$5):($2.Oka?E3E(this.$3[$4],$2.$5).ka.canvas:this.$3[$4].uH($2.$5)))"
    );
  } else {
    console.error("FearMod: failed to find poison draw");
  }

  fearReplace(
    "draw Fear arrows after temp walls",
    /this\.Ka\.render\(a\);try\{window\.tempWalls_drawPulse&&window\.tempWalls_drawPulse\(this\.Ka,"ka"\);\}catch\(_tw\)\{\}this\.hb\.render\(a\)/,
    'this.Ka.render(a);try{window.tempWalls_drawPulse&&window.tempWalls_drawPulse(this.Ka,"ka");}catch(_tw){}try{window.fear_draw_arrows&&window.fear_draw_arrows(this.Ka);}catch(_fr){}this.hb.render(a)'
  );

  // Run at Arrow mode's native post-movement point, before the queued yb input
  // is applied. S6E then clears yb/Ga exactly like a real forced arrow turn.
  fearReplace(
    "Fear tick at native Arrow timing",
    /if\(e7\(this\.settings,16\)\)\{var Mb=this\.oa;let fd=Mb\.ka\[0\];if\(!e7\(Mb\.settings,11\)\|\|T3E\(Mb\.Rb,fd\)\)\{var Kb=U3E\(Mb\.Rb,fd\);Kb!=="NONE"&&\(Kb!==Z6\(Mb\.direction\)&&S6E\(Mb,Kb\),h7\(Mb\.Rb,fd,!0\)\)\}\}/,
    '$&if(window.isFearActive&&window.isFearActive()){try{window.fear_tick_logic(this);}catch(_fr){console.error("FearMod: tick failed",_fr);}}'
  );

  fearReplace(
    "Fear paired fruit before native eat",
    /if\(e\|\|f\)\{g=d\.Oka;/,
    "if(e||f){if(window.fear_uses_ghost_pairs&&window.fear_uses_ghost_pairs(a))k=window.fear_before_native_fruit_eat(a,d,k);g=d.Oka;"
  );

  // Ghost mode removes the paired ghost just before this eat loop. Do not let
  // Poison's Oka-based helper remove a second, unrelated fruit afterward.
  fearReplace(
    "skip native poison pair removal for Fear",
    /e7\(a\.settings,10\)&&i4E\(a\.wa,([a-zA-Z0-9_$]{1,6}),([a-zA-Z0-9_$]{1,6}),a\.Lc\.bind\(a\)\)&&\1--/,
    "e7(a.settings,10)&&!(window.fear_uses_ghost_pairs&&window.fear_uses_ghost_pairs(a))&&i4E(a.wa,$1,$2,a.Lc.bind(a))&&$1--"
  );

  fearReplace(
    "conditional Fear poison twin spawn",
    /e7\(a\.settings,10\)&&!f&&!\(window\.isBurgerActive&&window\.isBurgerActive\(\)\)&&e4E\(a\)/,
    "e7(a.settings,10)&&!f&&!(window.isBurgerActive&&window.isBurgerActive())&&((window.fear_uses_ghost_pairs&&window.fear_uses_ghost_pairs(window.__remixGame))?window.fear_native_ghost_top_up(a,e4E):e4E(a))"
  );

  fearReplace(
    "conditional Fear poison top-up",
    /b<a\.ka\.length\/2&&!\(window\.isBurgerActive&&window\.isBurgerActive\(\)\)&&e4E\(a\)/,
    "b<a.ka.length/2&&!(window.isBurgerActive&&window.isBurgerActive())&&((window.fear_uses_ghost_pairs&&window.fear_uses_ghost_pairs(window.__remixGame))?window.fear_native_ghost_top_up(a,e4E):e4E(a))"
  );

  fearReplace(
    "reset after temp walls",
    /if\(window\.isTempWallsActive&&window\.isTempWallsActive\(\)\|\|window\.TEMP_WALLS_MODE!=null\)\{try\{window\.tempWalls_reset_state\(this\);\}catch\(_tw\)\{\}\}/,
    "if(window.isTempWallsActive&&window.isTempWallsActive()||window.TEMP_WALLS_MODE!=null){try{window.tempWalls_reset_state(this);}catch(_tw){}}if(window.FEAR_MODE!=null){try{window.fear_reset_state();}catch(_fr){}}"
  );

  fearReplace(
    "play start Fear trophy",
    /if\(window\.CurrentModeNum===window\.TEMP_WALLS_MODE\)\{window\.updateTempWallsTrophySRC\(\);window\.tempWalls_reset_state\(\);\}/,
    "if(window.CurrentModeNum===window.TEMP_WALLS_MODE){window.updateTempWallsTrophySRC();window.tempWalls_reset_state();}if(window.CurrentModeNum===window.FEAR_MODE){window.updateFearTrophySRC();window.fear_reset_state();}"
  );

  fearReplace(
    "deathscreen Fear icon",
    /\(a\.settings\.ob===window\.TEMP_WALLS_MODE\)\?window\.TEMP_WALLS_ICON:/,
    "(a.settings.ob===window.TEMP_WALLS_MODE)?window.TEMP_WALLS_ICON:(a.settings.ob===window.FEAR_MODE)?window.FEAR_ICON:"
  );
  fearReplace(
    "blender Fear icon",
    /\(c===window\.TEMP_WALLS_MODE\)\?window\.TEMP_WALLS_ICON:/,
    "(c===window.TEMP_WALLS_MODE)?window.TEMP_WALLS_ICON:(c===window.FEAR_MODE)?window.FEAR_ICON:"
  );

  fearReplace(
    "blender mode push Fear",
    /if\(window\.temp_walls_blending&&window\.TEMP_WALLS_MODE!=null\)b\.push\(window\.TEMP_WALLS_MODE\)/,
    "if(window.temp_walls_blending&&window.TEMP_WALLS_MODE!=null)b.push(window.TEMP_WALLS_MODE);if(window.fear_blending&&window.FEAR_MODE!=null)b.push(window.FEAR_MODE)"
  );

  fearReplace(
    "Ta blender Fear slot",
    /else if\(window\.TEMP_WALLS_MODE!=null&&el\.id==="remix-temp-walls-blend"\)m=window\.TEMP_WALLS_MODE;/,
    'else if(window.TEMP_WALLS_MODE!=null&&el.id==="remix-temp-walls-blend")m=window.TEMP_WALLS_MODE;else if(window.FEAR_MODE!=null&&el.id==="remix-fear-blend")m=window.FEAR_MODE;'
  );

  // New native refills are reconciled before the next movement.
  fearReplace(
    "f4E Fear respawn sync",
    /if\(\(window\.tempWalls_should_spawn&&window\.tempWalls_should_spawn\(\)\)\|\|\(window\.tempWalls_should_check_win&&window\.tempWalls_should_check_win\(\)\)\)\{try\{window\.tempWalls_after_eat\(a,!0\);\}catch\(_tw\)\{\}\}/,
    "if((window.tempWalls_should_spawn&&window.tempWalls_should_spawn())||(window.tempWalls_should_check_win&&window.tempWalls_should_check_win())){try{window.tempWalls_after_eat(a,!0);}catch(_tw){}}if(window.isFearActive&&window.isFearActive()){try{window.fear_after_respawn(a);}catch(_fr){}}"
  );

  return code;
};

////////////////////////////////////////////////////////////////////
// RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.FearMod.runCodeAfter = function () {
  window.fearInjectFruitType && window.fearInjectFruitType();
  window.fearEnsureTrophy && window.fearEnsureTrophy();
  window.add_fear_blender_toggle && window.add_fear_blender_toggle();
};
