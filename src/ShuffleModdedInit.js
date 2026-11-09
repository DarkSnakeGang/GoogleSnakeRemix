// Extra toolbar button beside Google's shuffle (jsname qycu7d).
// The original button and a8E are left alone. This one draws from the same
// rows, plus the modes and options Remix appends, and it is disabled whenever
// the original shuffle control is disabled.

window.remixShuffleModdedLogic = (function () {
  const VANILLA_MODE_LAST = 20;
  const PEACEFUL_MODE = 21;
  const BLENDER_MODE = 22;
  const TALLY_COUNT = 6;
  const LABEL = "Shuffle incl. modded modes";

  // Blender ingredients Remix adds. Slot Machine has a trophy but no toggle.
  const BLEND_TOGGLES = [
    {
      id: "remix-candy-blend",
      flag: "candy_blending",
      correct: "correct_candy_selection",
    },
    {
      id: "remix-chess-blend",
      flag: "chess_blending",
      correct: "correct_chess_selection",
    },
    {
      id: "remix-burger-blend",
      flag: "burger_blending",
      correct: "correct_burger_selection",
    },
    {
      id: "remix-cat-blend",
      flag: "cat_blending",
      correct: "correct_cat_selection",
    },
    {
      id: "remix-mexico-blend",
      flag: "mexico_blending",
      correct: "correct_mexico_selection",
    },
    {
      id: "remix-bomb-fruit-blend",
      flag: "bomb_fruit_blending",
      correct: "correct_bomb_fruit_selection",
    },
    {
      id: "remix-temp-walls-blend",
      flag: "temp_walls_blending",
      correct: "correct_temp_walls_selection",
    },
    {
      id: "remix-fear-blend",
      flag: "fear_blending",
      correct: "correct_fear_selection",
    },
  ];

  function fullRow(childCount) {
    const n = Math.max(0, childCount | 0);
    const out = [];
    for (let i = 0; i < n; i++) out.push(i);
    return out;
  }

  // Classic..Bridge, plus every trophy appended after Blender (Candy onward).
  // Peaceful (21) and Blender (22) stay out — the native shuffler never picks them.
  function trophyPool(childCount) {
    const n = Math.max(0, childCount | 0);
    const out = [];
    for (let i = 0; i < n; i++) {
      if (i <= VANILLA_MODE_LAST || i > BLENDER_MODE) out.push(i);
    }
    return out;
  }

  // Vanilla 1/3/5/10/dice/bomb, plus MoreMenu layouts, colored dice, and cluster.
  // Tally (6) stays out — the native shuffler never picks it.
  function countPool(childCount) {
    const n = Math.max(0, childCount | 0);
    const out = [];
    for (let i = 0; i < n; i++) {
      if (i !== TALLY_COUNT) out.push(i);
    }
    return out;
  }

  function unit(rng) {
    let r = typeof rng === "function" ? rng() : Math.random();
    if (!Number.isFinite(r) || r < 0) r = 0;
    if (r >= 1) r = 0.999999999;
    return r;
  }

  function pick(pool, current, skipCurrent, rng) {
    if (!pool || !pool.length) return null;
    let choices = pool;
    if (skipCurrent && pool.length > 1 && pool.indexOf(current) !== -1) {
      choices = pool.filter((i) => i !== current);
    }
    return choices[Math.floor(unit(rng) * choices.length)];
  }

  // Same loop as Google's $5E(false): at least two while the pool allows it,
  // then a 30% chance to keep adding.
  function blenderPick(entries, rng) {
    const remaining = (entries || []).slice();
    const chosen = [];
    if (!remaining.length) return chosen;
    do {
      const idx = Math.floor(unit(rng) * remaining.length);
      chosen.push(remaining.splice(idx, 1)[0]);
    } while (
      remaining.length > 0 &&
      (unit(rng) < 0.3 || chosen.length < 2)
    );
    return chosen;
  }

  function chooseSettings(input, rng) {
    const rows = (input && input.rows) || {};
    const current = (input && input.current) || {};
    const chosen = {
      apple: pick(fullRow(rows.apple), current.apple, true, rng),
      color: pick(fullRow(rows.color), current.color, true, rng),
      theme: pick(fullRow(rows.theme), current.theme, true, rng),
      graphics: pick(fullRow(rows.graphics), current.graphics, false, rng),
    };
    if (!input || !input.daily) {
      chosen.trophy = pick(trophyPool(rows.trophy), current.trophy, true, rng);
      chosen.count = pick(countPool(rows.count), current.count, false, rng);
      chosen.speed = pick(fullRow(rows.speed), current.speed, false, rng);
      chosen.size = pick(fullRow(rows.size), current.size, false, rng);
    }
    return chosen;
  }

  function buildBlenderPool(hasToggle) {
    const pool = [];
    for (let id = 1; id <= VANILLA_MODE_LAST; id++) {
      pool.push({ kind: "native", id: id });
    }
    for (let i = 0; i < BLEND_TOGGLES.length; i++) {
      const toggle = BLEND_TOGGLES[i];
      if (typeof hasToggle === "function" && !hasToggle(toggle.id)) continue;
      pool.push({
        kind: "mod",
        id: toggle.id,
        flag: toggle.flag,
        correct: toggle.correct,
      });
    }
    return pool;
  }

  // True when the original shuffle control is in its disabled state.
  function controlDisabled(state) {
    state = state || {};
    if (state.disableRandom) return true;
    if (state.pointerEvents === "none") return true;
    if (String(state.text || "").replace(/\s+/g, " ").trim() === "Disabled") {
      return true;
    }
    return false;
  }

  return {
    LABEL: LABEL,
    VANILLA_MODE_LAST: VANILLA_MODE_LAST,
    PEACEFUL_MODE: PEACEFUL_MODE,
    BLENDER_MODE: BLENDER_MODE,
    TALLY_COUNT: TALLY_COUNT,
    BLEND_TOGGLES: BLEND_TOGGLES,
    fullRow: fullRow,
    trophyPool: trophyPool,
    countPool: countPool,
    pick: pick,
    blenderPick: blenderPick,
    chooseSettings: chooseSettings,
    buildBlenderPool: buildBlenderPool,
    controlDisabled: controlDisabled,
  };
})();

(function () {
  const logic = window.remixShuffleModdedLogic;
  const LABEL = logic.LABEL;
  // 5-pip die in the same viewBox and stroke as Google's 3-pip shuffle icon.
  const ICON_PATH =
    "M323.122-266.924q23.416 0 39.762-16.391t16.346-39.807q0-23.417-16.391-39.763-16.391-16.346-39.807-16.346-23.417 0-39.763 16.392-16.346 16.391-16.346 39.807 0 23.416 16.392 39.762 16.391 16.346 39.807 16.346Z" +
    "M636.968-266.924q23.416 0 39.762-16.391t16.346-39.807q0-23.417-16.391-39.763-16.391-16.346-39.807-16.346-23.417 0-39.763 16.392-16.346 16.391-16.346 39.807 0 23.416 16.392 39.762 16.391 16.346 39.807 16.346Z" +
    "M480.045-423.846q23.416 0 39.762-16.392 16.347-16.391 16.347-39.807 0-23.416-16.392-39.762-16.391-16.347-39.807-16.347-23.416 0-39.762 16.392-16.347 16.391-16.347 39.807 0 23.416 16.392 39.762 16.391 16.347 39.807 16.347Z" +
    "M323.122-580.769q23.417 0 39.763-16.392 16.346-16.391 16.346-39.807 0-23.416-16.392-39.762-16.391-16.346-39.807-16.346-23.416 0-39.762 16.391t-16.346 39.807q0 23.417 16.391 39.763 16.391 16.346 39.807 16.346Z" +
    "M636.968-580.769q23.417 0 39.763-16.392 16.346-16.391 16.346-39.807 0-23.416-16.392-39.762-16.391-16.346-39.807-16.346-23.416 0-39.762 16.391t-16.346 39.807q0 23.417 16.391 39.763 16.391 16.346 39.807 16.346Z" +
    "M212.309-140.001q-30.308 0-51.308-21t-21-51.308v-535.382q0-30.308 21-51.308t51.308-21h535.382q30.308 0 51.308 21t21 51.308v535.382q0 30.308-21 51.308t-51.308 21H212.309Z";

  function buttonHtml() {
    return (
      '<div class="DwxlBd"><svg aria-hidden="true" height="100%" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg"><path d="' +
      ICON_PATH +
      '" fill="#FFFFFF"></path></svg></div><div class="l3ryBd">' +
      LABEL +
      "</div>"
    );
  }

  function originalButton() {
    const cached = window.random_button;
    if (cached && cached.isConnected !== false) return cached;
    if (typeof document === "undefined") return null;
    const el = document.querySelector('[jsname="qycu7d"]');
    if (el) window.random_button = el;
    return el;
  }

  window.remixShuffleModdedIsDisabled = function remixShuffleModdedIsDisabled() {
    const orig = originalButton();
    return logic.controlDisabled({
      disableRandom: !!(
        window.pudding_settings && window.pudding_settings.DisableRandom
      ),
      pointerEvents: orig && orig.style ? orig.style.pointerEvents : "",
      text: orig ? orig.textContent : "",
    });
  };

  function rowLength(id) {
    const row = document.getElementById(id);
    return row && row.children ? row.children.length : 0;
  }

  function selectRow(id, index) {
    if (index == null || index < 0) return false;
    if (typeof window.puddingMenuSelect === "function") {
      if (window.puddingMenuSelect(id, index)) return true;
    }
    const menu = window._puddingSnakeMenu;
    const p7 = window._puddingSnakeP7;
    const row = document.getElementById(id);
    if (!menu || typeof p7 !== "function" || !row || !row.children.length) {
      return false;
    }
    const i = Math.max(0, Math.min(index, row.children.length - 1));
    p7(menu, row, true, i);
    return true;
  }

  function applyBlender(menu, chosen) {
    const native = new Set();
    const mods = new Set();
    for (let i = 0; i < chosen.length; i++) {
      const item = chosen[i];
      if (item.kind === "native") native.add(item.id);
      else if (item.flag) mods.add(item.flag);
    }
    const ua = menu && menu.settings && menu.settings.Ua;
    if (ua && typeof ua.forEach === "function") {
      ua.forEach(function (el, id) {
        if (!el || !el.classList) return;
        if (native.has(id)) el.classList.add("lH9Ipd");
        else el.classList.remove("lH9Ipd");
      });
    }
    for (let i = 0; i < logic.BLEND_TOGGLES.length; i++) {
      const toggle = logic.BLEND_TOGGLES[i];
      if (!document.getElementById(toggle.id)) continue;
      window[toggle.flag] = mods.has(toggle.flag);
      if (typeof window[toggle.correct] === "function") window[toggle.correct]();
    }
  }

  window.remixShuffleModdedRun = function remixShuffleModdedRun(rng) {
    if (window.remixShuffleModdedIsDisabled()) return false;
    const menu = window._puddingSnakeMenu;
    if (!menu || (menu.oa !== "settings" && menu.oa !== "combo")) return false;
    if (menu.oa === "combo") {
      const pool = logic.buildBlenderPool(function (id) {
        return !!document.getElementById(id);
      });
      applyBlender(menu, logic.blenderPick(pool, rng));
      return true;
    }
    const settings = menu.settings || {};
    const chosen = logic.chooseSettings(
      {
        daily: !!settings.Ga,
        current: {
          apple: settings.Fb,
          color: settings.Jb,
          theme: settings.Qb,
          trophy: settings.ob,
        },
        rows: {
          apple: rowLength("apple"),
          color: rowLength("color"),
          theme: rowLength("theme"),
          graphics: rowLength("graphics"),
          trophy: rowLength("trophy"),
          count: rowLength("count"),
          speed: rowLength("speed"),
          size: rowLength("size"),
        },
      },
      rng
    );
    const order = [
      "apple",
      "color",
      "theme",
      "graphics",
      "trophy",
      "count",
      "speed",
      "size",
    ];
    for (let i = 0; i < order.length; i++) {
      const key = order[i];
      if (Object.prototype.hasOwnProperty.call(chosen, key)) {
        selectRow(key, chosen[key]);
      }
    }
    return true;
  };

  function syncButton() {
    const orig = originalButton();
    const btn = document.getElementById("remix-shuffle-modded");
    if (!orig || !btn) return;
    btn.classList.toggle("LaTyvd", orig.classList.contains("LaTyvd"));
    if (window.remixShuffleModdedIsDisabled()) {
      btn.style.pointerEvents = "none";
      btn.textContent = "Disabled";
      btn.style.color = (orig.style && orig.style.color) || "grey";
      btn.setAttribute("aria-disabled", "true");
      btn.dataset.remixDisabled = "1";
      return;
    }
    btn.style.pointerEvents = "auto";
    if (btn.dataset.remixDisabled === "1" || !btn.querySelector("svg")) {
      btn.innerHTML = btn.__remixHtml || buttonHtml();
    }
    btn.style.color = (orig.style && orig.style.color) || "";
    btn.setAttribute("aria-disabled", "false");
    delete btn.dataset.remixDisabled;
  }

  window.remixSyncShuffleModdedButton = syncButton;

  function onClick(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    window.remixShuffleModdedRun();
  }

  function ensureButton(orig) {
    let btn = document.getElementById("remix-shuffle-modded");
    if (btn) {
      if (!btn.__remixHtml) btn.__remixHtml = buttonHtml();
      return btn;
    }
    btn = document.createElement("div");
    btn.id = "remix-shuffle-modded";
    btn.className = orig.className || "FL0z2d LaTyvd";
    if (!btn.classList.contains("FL0z2d")) btn.classList.add("FL0z2d");
    btn.setAttribute("role", "button");
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-label", LABEL);
    btn.setAttribute("title", LABEL);
    btn.__remixHtml = buttonHtml();
    btn.innerHTML = btn.__remixHtml;
    orig.insertAdjacentElement("afterend", btn);
    btn.addEventListener("click", onClick);
    btn.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") onClick(ev);
    });
    return btn;
  }

  function observeOriginal(orig) {
    if (!orig || orig.__remixShuffleObserved || typeof MutationObserver !== "function") {
      return;
    }
    orig.__remixShuffleObserved = true;
    const observer = new MutationObserver(function () {
      syncButton();
    });
    observer.observe(orig, {
      attributes: true,
      attributeFilter: ["class", "style"],
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  function hookRandomState() {
    const fn = window.applyRandomButtonState;
    if (typeof fn !== "function" || fn.__remixWrapped) return;
    const wrapped = function () {
      const result = fn.apply(this, arguments);
      syncButton();
      return result;
    };
    wrapped.__remixWrapped = true;
    window.applyRandomButtonState = wrapped;
  }

  function hookHostAfter() {
    // Look the Ultra host up by name. A dotted property here would mark the
    // Remix bundle as an Ultra build.
    const host = window["RemixUltraMod"];
    if (
      !host ||
      host.__shuffleModdedAfter ||
      typeof host.runCodeAfter !== "function"
    ) {
      return;
    }
    const prev = host.runCodeAfter;
    host.runCodeAfter = function () {
      const result = prev.apply(this, arguments);
      window.remixInstallShuffleModdedButton();
      return result;
    };
    host.__shuffleModdedAfter = true;
  }

  window.remixInstallShuffleModdedButton =
    function remixInstallShuffleModdedButton() {
      if (typeof document === "undefined") return;
      hookHostAfter();
      hookRandomState();
      const orig = originalButton();
      if (!orig) {
        const tries = window.remixInstallShuffleModdedButton._tries || 0;
        if (tries < 20) {
          window.remixInstallShuffleModdedButton._tries = tries + 1;
          setTimeout(window.remixInstallShuffleModdedButton, 250);
        }
        return;
      }
      window.remixInstallShuffleModdedButton._tries = 0;
      ensureButton(orig);
      observeOriginal(orig);
      syncButton();
    };

  if (window.RemixMod && !window.RemixMod.__shuffleModdedWrapped) {
    const before = window.RemixMod.runCodeBefore;
    const after = window.RemixMod.runCodeAfter;
    window.RemixMod.runCodeBefore = function () {
      if (typeof before === "function") before.apply(this, arguments);
      window.remixInstallShuffleModdedButton();
    };
    window.RemixMod.runCodeAfter = function () {
      if (typeof after === "function") after.apply(this, arguments);
      window.remixInstallShuffleModdedButton();
    };
    window.RemixMod.__shuffleModdedWrapped = true;
  }
})();
