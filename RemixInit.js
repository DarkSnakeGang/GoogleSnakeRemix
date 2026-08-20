window.RemixMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

// Remix has extra trophies / counts / speeds and its own settings (Black Dice,
// etc.). Keep those on Remix-only localStorage keys so PuddingMod's
// PuddingSettings + snake_timeKeeper stay untouched.
window.REMIX_SETTINGS_KEY = "RemixSettings";
window.REMIX_TIMEKEEPER_KEY = "snake_timeKeeper_remix";

window.remixSeedIsolatedStorage = function remixSeedIsolatedStorage() {
  try {
    if (!localStorage.getItem(window.REMIX_SETTINGS_KEY)) {
      const pud = localStorage.getItem("PuddingSettings");
      if (pud) localStorage.setItem(window.REMIX_SETTINGS_KEY, pud);
    }
    if (!localStorage.getItem(window.REMIX_TIMEKEEPER_KEY)) {
      const tk = localStorage.getItem("snake_timeKeeper");
      if (tk) localStorage.setItem(window.REMIX_TIMEKEEPER_KEY, tk);
    }
  } catch (_e) {}
};

// MorePudding bundles Pudding + Visibility + MoreMenu and runs them in that
// order. Fall back to the individual mods if a build ever ships without it.
window.remixBaseRunCodeBefore = function remixBaseRunCodeBefore() {
  window.remixSeedIsolatedStorage();
  if (window.MorePudding) {
    window.MorePudding.runCodeBefore();
    return;
  }
  window.PuddingMod.runCodeBefore();
  window.VisibilityModCode.runCodeBefore();
};

window.remixBaseAlterSnakeCode = function remixBaseAlterSnakeCode(code) {
  if (window.MorePudding) return window.MorePudding.alterSnakeCode(code);
  code = window.PuddingMod.alterSnakeCode(code);
  return window.VisibilityModCode.alterSnakeCode(code);
};

window.remixInjectSettingsCss = function remixInjectSettingsCss() {
  if (document.getElementById("remix-settings-css")) return;
  const style = document.createElement("style");
  style.id = "remix-settings-css";
  style.textContent = `
#ultra-settings-pager {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  margin: 6px 0 8px;
}
#ultra-settings-pager.ultra-pager-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.ultra-settings-tab {
  flex: 1;
  min-width: 0;
  font-family: Roboto, Arial, sans-serif !important;
  font-size: 11px !important;
  padding: 5px 2px !important;
  border: none !important;
  border-radius: 8px !important;
  cursor: pointer;
  line-height: 1.2;
  background: rgba(0,0,0,0.22);
  color: #fff;
}
.ultra-settings-tab.ultra-tab-on {
  background: var(--ultra-btn, #1155CC) !important;
  color: #fff;
}
.ultra-settings-page {
  display: none;
  overflow: hidden;
  min-height: 0;
}
.ultra-settings-page.ultra-page-on {
  display: block;
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 0;
  scrollbar-width: none;
}
.ultra-settings-page.ultra-page-on::-webkit-scrollbar {
  display: none;
}
#settings-popup-pudding {
  flex-direction: column;
  padding: 8px !important;
  box-sizing: border-box !important;
}
#settings-popup-pudding > span {
  flex-shrink: 0;
  font-size: 13px;
}
#settings-popup-pudding .form-check,
#settings-popup-pudding .form-check-inline {
  display: flex !important;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  margin: 4px 0 !important;
  margin-right: 0 !important;
  padding: 0 !important;
  gap: 4px;
}
#ultra-settings-hidden,
#ultra-settings-hidden .form-check,
#ultra-settings-hidden .form-check-inline,
#settings-popup-pudding .form-check.ultra-hide,
#settings-popup-pudding .form-check-inline.ultra-hide,
#settings-popup-pudding .ultra-hide,
#AlwaysOnTimeKeeper,
label[for="AlwaysOnTimeKeeper"],
#ShowSplitPanel,
label[for="ShowSplitPanel"],
#RemoveScrollbar,
label[for="RemoveScrollbar"] {
  display: none !important;
}
#ultra-settings-page-play .form-check:has(#EatThemeRandomizer),
#settings-popup-pudding .form-check:has(#EatThemeRandomizer) {
  display: flex !important;
}
#settings-popup-pudding .form-check-input {
  float: none !important;
  position: static !important;
  margin: 0 !important;
  flex-shrink: 0;
}
#settings-popup-pudding .form-check.remix-toggle-disabled {
  opacity: 0.55;
}
#settings-popup-pudding .form-check-input:disabled {
  cursor: not-allowed;
}
#settings-popup-pudding .form-check-label {
  margin: 3px !important;
  color: #fff !important;
  font-family: Roboto, Arial, sans-serif !important;
}
#settings-popup-pudding .btn {
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 5px 0 !important;
  border-radius: 8px !important;
  background: var(--ultra-btn, #1155CC) !important;
  color: #fff !important;
  border: none !important;
  font-size: 12px !important;
}
#stat-chooser {
  width: 100% !important;
  box-sizing: border-box;
  display: block !important;
  min-height: 36px !important;
  height: 36px !important;
  line-height: 20px !important;
  padding: 8px 10px !important;
  margin: 4px 0 8px !important;
  border-radius: 8px !important;
  border: none !important;
  font-size: 13px !important;
  color: #fff !important;
  background-color: var(--ultra-btn, #1155CC) !important;
}
#black-dice-settings {
  margin: 8px 0 0 !important;
  padding: 6px 8px !important;
  border-radius: 8px !important;
}
#black-dice-settings input {
  width: 4.4em !important;
}
#remix-custom-settings {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  flex: 1 1 auto;
}
.remix-custom-subpager {
  display: flex;
  gap: 3px;
  flex-shrink: 0;
}
.remix-custom-subtab {
  flex: 1;
  min-width: 0;
  font-family: Roboto, Arial, sans-serif !important;
  font-size: 10px !important;
  padding: 4px 2px !important;
  border: none !important;
  border-radius: 6px !important;
  cursor: pointer;
  line-height: 1.2;
  background: rgba(0,0,0,0.22);
  color: #fff;
}
.remix-custom-subtab.remix-custom-subtab-on {
  background: var(--ultra-btn, #1155CC) !important;
}
.remix-custom-panel {
  display: none;
  overflow-y: auto;
  max-height: 100%;
  min-height: 0;
  scrollbar-width: none;
}
.remix-custom-panel.remix-custom-panel-on {
  display: block;
}
.remix-custom-panel::-webkit-scrollbar {
  display: none;
}
.remix-custom-card {
  margin: 4px 0;
  padding: 6px 8px;
  border-radius: 8px;
  background: rgba(0,0,0,0.18);
  border: 1px solid rgba(255,255,255,0.14);
  color: #fff;
  font-family: Roboto, Arial, sans-serif;
}
.remix-custom-card .remix-custom-title {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 2px;
}
.remix-custom-card .remix-custom-hint {
  font-size: 11px;
  opacity: 0.85;
  margin-bottom: 6px;
}
.remix-custom-card label {
  font-size: 12px;
  margin: 0;
}
.remix-custom-card input[type="number"] {
  width: 4.8em !important;
  margin-left: 4px;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.remix-custom-card input[type="color"] {
  width: 2.4em;
  height: 1.6em;
  padding: 0;
  border: none;
  background: transparent;
  vertical-align: middle;
}
#remix-custom-rainbow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(2.4em, 1fr));
  gap: 4px;
  max-height: 140px;
  overflow-y: auto;
  margin-top: 6px;
}
`;
  document.head.appendChild(style);
};

window.remixApplyThemeColors = function remixApplyThemeColors() {
  const btn = window.button_color || "#1155CC";
  const bar = window.real_topbar_color || "#4a752c";
  const root = document.documentElement;
  if (!root || !root.style) return;
  root.style.setProperty("--ultra-btn", btn);
  root.style.setProperty("--ultra-bar", bar);
  if (typeof window.remixPaintSettingsTabs === "function") {
    window.remixPaintSettingsTabs();
  }
};

window.remixPaintSettingsTabs = function remixPaintSettingsTabs() {
  const btn = window.button_color || "#1155CC";
  document.querySelectorAll(".ultra-settings-tab").forEach(function (el) {
    const on = el.classList.contains("ultra-tab-on");
    const color = on ? btn : "rgba(0,0,0,0.22)";
    el.style.setProperty("background", color, "important");
    el.style.setProperty("background-color", color, "important");
  });
};

window.remixHookSetTheme = function remixHookSetTheme() {
  window.remixApplyThemeColors();
  if (typeof window.setTheme !== "function" || window.setTheme.__remixTheme) return;
  const orig = window.setTheme;
  window.setTheme = function () {
    try {
      return orig.apply(this, arguments);
    } finally {
      window.remixApplyThemeColors();
    }
  };
  window.setTheme.__remixTheme = true;
};

window.remixSettingsEl = function remixSettingsEl(id, root) {
  const scope = root || document.getElementById("settings-popup-pudding");
  if (scope && typeof scope.querySelector === "function") {
    return scope.querySelector("#" + id);
  }
  return document.getElementById(id);
};

window.remixSettingsWrap = function remixSettingsWrap(id, root) {
  const el = window.remixSettingsEl(id, root);
  if (!el) return null;
  return el.closest(".form-check") || el;
};

window.remixShowDragonFruitCheckbox = function remixShowDragonFruitCheckbox(play) {
  const wrap = window.remixSettingsWrap("EatThemeRandomizer");
  if (!wrap) return null;
  wrap.classList.remove("ultra-hide");
  wrap.style.display = "flex";
  const input = document.getElementById("EatThemeRandomizer");
  const label = document.getElementById("EatThemeRandomizer2");
  if (input) input.style.display = "";
  if (label) {
    label.style.display = "";
    label.textContent = "Dragon Fruit";
  }
  const host = play || document.getElementById("ultra-settings-page-play");
  if (host && wrap.parentElement !== host) host.appendChild(wrap);
  return wrap;
};

window.remixEnsureWallEveryAppleSetting = function remixEnsureWallEveryAppleSetting() {
  const s = window.pudding_settings || (window.pudding_settings = {});
  if (typeof s.WallEveryApple !== "boolean") s.WallEveryApple = false;
  return s;
};

window.remixShouldSpawnWallEveryApple = function remixShouldSpawnWallEveryApple() {
  window.remixEnsureWallEveryAppleSetting();
  if (window.disableWallMode) return false;
  return !!window.pudding_settings.WallEveryApple;
};

window.remixSyncWallEveryAppleEnabled = function remixSyncWallEveryAppleEnabled() {
  const input = document.getElementById("WallEveryApple");
  if (!input) return;
  const wallsOn = !window.disableWallMode;
  input.disabled = !wallsOn;
  const wrap = input.closest(".form-check");
  if (wrap) wrap.classList.toggle("remix-toggle-disabled", !wallsOn);
};

window.remixInstallWallEveryAppleToggle = function remixInstallWallEveryAppleToggle(play) {
  window.remixEnsureWallEveryAppleSetting();
  const host = play || document.getElementById("ultra-settings-page-play");
  if (!host) return null;
  let input = document.getElementById("WallEveryApple");
  if (!input) {
    const wrap = document.createElement("div");
    wrap.className = "form-check form-check-inline";
    wrap.innerHTML =
      '<input class="form-check-input" type="checkbox" role="switch" id="WallEveryApple">' +
      '<label class="form-check-label" for="WallEveryApple">Walls spawn every apple</label>';
    host.appendChild(wrap);
    input = wrap.querySelector("input");
    input.checked = !!window.pudding_settings.WallEveryApple;
    input.addEventListener("change", function () {
      window.pudding_settings.WallEveryApple = !!input.checked;
      if (typeof window.saveSettings === "function") window.saveSettings();
    });
  }
  window.remixSyncWallEveryAppleEnabled();
  return input;
};

window.remixPatchWallEveryApple = function remixPatchWallEveryApple(code) {
  const re =
    /([a-zA-Z_$][\w$]*)=!([a-zA-Z_$][\w$]*)\.nj&&!([a-zA-Z_$][\w$]*)&&\(\2\.Sh%2===1\|\|e7\(\2\.settings,11\)\);e7\(\2\.settings,1\)&&\1&&/;
  if (!re.test(code)) {
    console.error("Remix: failed to find wall-mode every-other-apple spawn gate");
    return code;
  }
  return code.replace(
    re,
    "$1=!$2.nj&&!$3&&($2.Sh%2===1||e7($2.settings,11));e7($2.settings,1)&&($1||window.remixShouldSpawnWallEveryApple()&&!$2.nj&&!$3)&&"
  );
};

window.remixBindResetKeyButtons = function remixBindResetKeyButtons() {
  let keybinds = {};
  try {
    keybinds = JSON.parse(localStorage.getItem("keybinds")) || {};
  } catch (_e) {}
  if (!keybinds.resetKey) keybinds.resetKey = "Shift";
  Array.from(document.querySelectorAll('[id="ResetKeybind"]')).forEach(function (button) {
    let el = button;
    if (!el.__remixResetBound) {
      const fresh = el.cloneNode(true);
      if (el.parentNode) el.parentNode.replaceChild(fresh, el);
      el = fresh;
      el.__remixResetBound = true;
      el.addEventListener("click", function () {
        Array.from(document.querySelectorAll('[id="ResetKeybind"]')).forEach(function (b) {
          b.textContent = "Press any key...";
        });
        const handler = function (e) {
          keybinds.resetKey = e.key;
          try {
            localStorage.setItem("keybinds", JSON.stringify(keybinds));
          } catch (_err) {}
          Array.from(document.querySelectorAll('[id="ResetKeybind"]')).forEach(function (b) {
            b.textContent = "Reset Key: " + e.key;
          });
          document.removeEventListener("keydown", handler);
        };
        document.addEventListener("keydown", handler);
      });
    }
    if (el.textContent !== "Press any key...") {
      el.textContent = "Reset Key: " + keybinds.resetKey;
    }
  });
};

window.remixHookResetKeyMake = function remixHookResetKeyMake() {
  if (!window.ResetKey || typeof window.ResetKey.make !== "function") return;
  if (window.ResetKey.make.__remix) return;
  const orig = window.ResetKey.make;
  window.ResetKey.make = function () {
    orig.apply(this, arguments);
    window.remixBindResetKeyButtons();
  };
  window.ResetKey.make.__remix = true;
};

window.remixHideSettingsNode = function remixHideSettingsNode(el, bin) {
  if (!el) return;
  el.classList.add("ultra-hide");
  el.style.display = "none";
  if (bin && el.parentElement !== bin) bin.appendChild(el);
};

window.remixShowSettingsPage = function remixShowSettingsPage(id) {
  if (id === "stats") id = "setup";
  window.__remixSettingsPage = id;
  window.__ultraSettingsPage = id;
  document.querySelectorAll(".ultra-settings-page").forEach(function (page) {
    const pageId = String(page.id || "").replace("ultra-settings-page-", "");
    page.classList.toggle("ultra-page-on", pageId === id);
  });
  document.querySelectorAll(".ultra-settings-tab").forEach(function (tab) {
    const pageId = String(tab.id || "").replace("ultra-settings-tab-", "");
    tab.classList.toggle("ultra-tab-on", pageId === id);
  });
  if (typeof window.remixPaintSettingsTabs === "function") {
    window.remixPaintSettingsTabs();
  }
};

window.remixVisibilityPopup = function remixVisibilityPopup() {
  return document.getElementById("delete-stuff-popup");
};

window.remixVisibilityIsOpen = function remixVisibilityIsOpen() {
  const el = window.remixVisibilityPopup();
  if (!el) return false;
  if (el.hidden) return false;
  const s = getComputedStyle(el);
  return s.display !== "none" && s.visibility !== "hidden";
};

window.remixSyncVisibilityButton = function remixSyncVisibilityButton() {
  const btn = document.getElementById("remix-visibility-settings");
  if (!btn) return;
  btn.textContent = window.remixVisibilityIsOpen()
    ? "Hide Visibility settings"
    : "Show Visibility settings";
};

window.remixSetVisibilityOpen = function remixSetVisibilityOpen(open) {
  const el = window.remixVisibilityPopup();
  if (!el) return;
  el.hidden = !open;
  window.remixSyncVisibilityButton();
};

window.remixToggleVisibilitySettings = function remixToggleVisibilitySettings() {
  window.remixSetVisibilityOpen(!window.remixVisibilityIsOpen());
};

window.remixEnsureVisibilityButton = function remixEnsureVisibilityButton(setup) {
  if (!setup) return;
  let btn = document.getElementById("remix-visibility-settings");
  if (!btn) {
    btn = document.createElement("button");
    btn.type = "button";
    btn.id = "remix-visibility-settings";
    btn.className = "btn";
    btn.addEventListener("click", function () {
      window.remixToggleVisibilitySettings();
    });
  }
  if (setup.firstChild !== btn) setup.insertBefore(btn, setup.firstChild);
  window.remixSyncVisibilityButton();
  const popup = window.remixVisibilityPopup();
  if (popup && !popup.__remixVisObs) {
    const obs = new MutationObserver(function () {
      window.remixSyncVisibilityButton();
    });
    obs.observe(popup, { attributes: true, attributeFilter: ["hidden", "style"] });
    popup.__remixVisObs = true;
  }
};

window.remixEnsureSettingsFlex = function remixEnsureSettingsFlex() {
  const root = document.getElementById("settings-popup-pudding");
  if (root && root.style.display !== "none" && root.style.visibility !== "hidden") {
    root.style.display = "flex";
    root.style.flexDirection = "column";
  }
  if (typeof window.BootstrapShow === "function" && !window.__remixBootstrapFlex) {
    const orig = window.BootstrapShow;
    window.BootstrapShow = function () {
      orig.apply(this, arguments);
      const box = document.getElementById("settings-popup-pudding");
      if (box) {
        box.style.display = "flex";
        box.style.flexDirection = "column";
      }
    };
    window.__remixBootstrapFlex = true;
  }
};

window.remixOrganizeSettings = function remixOrganizeSettings() {
  const root = document.getElementById("settings-popup-pudding");
  if (!root) return;

  window.remixInjectSettingsCss();

  if (typeof window.remixInjectBlackDiceSettingsUi === "function") {
    window.remixInjectBlackDiceSettingsUi();
  }
  if (typeof window.remixEnsureCustomSettingsUi === "function") {
    window.remixEnsureCustomSettingsUi();
  }
  if (typeof window.remixInjectCustomBoardSettingsUi === "function") {
    window.remixInjectCustomBoardSettingsUi();
  }
  if (typeof window.remixInjectCustomColorSettingsUi === "function") {
    window.remixInjectCustomColorSettingsUi();
  }
  if (typeof window.remixInjectCustomSpeedSettingsUi === "function") {
    window.remixInjectCustomSpeedSettingsUi();
  }

  let bin = document.getElementById("ultra-settings-hidden");
  if (!bin) {
    bin = document.createElement("div");
    bin.id = "ultra-settings-hidden";
    bin.className = "ultra-hide";
    root.appendChild(bin);
  }

  window.remixHideSettingsNode(window.remixSettingsWrap("AlwaysOnTimeKeeper", root), bin);
  window.remixHideSettingsNode(window.remixSettingsWrap("ShowSplitPanel", root), bin);
  window.remixHideSettingsNode(window.remixSettingsWrap("RemoveScrollbar", root), bin);
  window.remixHideSettingsNode(window.remixSettingsEl("ScrollLeftBtn", root), bin);
  window.remixHideSettingsNode(window.remixSettingsEl("settings-close", root), bin);
  window.remixHideSettingsNode(window.remixSettingsEl("snakePride", root), bin);
  Array.from(root.querySelectorAll(":scope > br")).forEach(function (el) {
    window.remixHideSettingsNode(el, bin);
  });

  let pager = document.getElementById("ultra-settings-pager");
  if (!pager) {
    pager = document.createElement("div");
    pager.id = "ultra-settings-pager";
    const title = root.querySelector(":scope > span");
    if (title && title.nextSibling) root.insertBefore(pager, title.nextSibling);
    else root.insertBefore(pager, root.firstChild);

    [
      ["play", "Play"],
      ["setup", "Setup"],
    ].forEach(function (pair) {
      const page = document.createElement("div");
      page.id = "ultra-settings-page-" + pair[0];
      page.className = "ultra-settings-page";
      root.appendChild(page);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.id = "ultra-settings-tab-" + pair[0];
      btn.className = "ultra-settings-tab";
      btn.textContent = pair[1];
      btn.addEventListener("click", function () {
        window.remixShowSettingsPage(pair[0]);
      });
      pager.appendChild(btn);
    });
  }

  // Drop legacy Stats tab/page (merged into Setup).
  const legacyStatsTab = document.getElementById("ultra-settings-tab-stats");
  const legacyStatsPage = document.getElementById("ultra-settings-page-stats");
  if (legacyStatsTab) window.remixHideSettingsNode(legacyStatsTab, bin);
  if (legacyStatsPage) {
    Array.from(legacyStatsPage.children).forEach(function (ch) {
      const setupTmp = document.getElementById("ultra-settings-page-setup");
      if (setupTmp) setupTmp.appendChild(ch);
    });
    window.remixHideSettingsNode(legacyStatsPage, bin);
  }

  if (typeof window.remixEnsureCustomSettingsUi === "function") {
    window.remixEnsureCustomSettingsUi();
  }

  const play = document.getElementById("ultra-settings-page-play");
  const setup = document.getElementById("ultra-settings-page-setup");
  const custom = document.getElementById("ultra-settings-page-custom");
  const modes = document.getElementById("ultra-settings-page-modes");
  if (!play || !setup) return;

  [
    "SkullPoisonFruit",
    "DistinctSokoGoals",
    "InputDisplay",
    "TopBarIcons",
    "EatThemeRandomizer",
    "DisableRandom",
  ].forEach(function (id) {
    const el = window.remixSettingsWrap(id, root);
    if (el && el.parentElement !== play) play.appendChild(el);
  });
  window.remixShowDragonFruitCheckbox(play);
  window.remixInstallWallEveryAppleToggle(play);
  ["stat-chooser", "edit-stat", "reset-stats"].forEach(function (id) {
    const el = window.remixSettingsEl(id, root);
    if (el && el.parentElement !== setup) setup.appendChild(el);
  });
  [
    "SaveGameSettings",
    "TimerSettings",
    "ResetKeybind",
    "CustomBowlFruits",
  ].forEach(function (id) {
    const el = window.remixSettingsWrap(id, root) || window.remixSettingsEl(id, root);
    if (el && el.parentElement !== setup) setup.appendChild(el);
  });

  const dicePanel = document.getElementById("remix-custom-panel-dice");
  const blackDice = document.getElementById("black-dice-settings");
  if (dicePanel && blackDice && blackDice.parentElement !== dicePanel) {
    dicePanel.appendChild(blackDice);
  }
  const customHost = document.getElementById("remix-custom-settings");
  if (custom && customHost && customHost.parentElement !== custom) {
    custom.appendChild(customHost);
  }

  const keepIds = {
    "ultra-settings-hidden": 1,
    "ultra-settings-pager": 1,
    "ultra-settings-page-play": 1,
    "ultra-settings-page-setup": 1,
    "ultra-settings-page-custom": 1,
    "ultra-settings-page-modes": 1,
    "ultra-settings-page-stats": 1,
  };
  Array.from(root.children).forEach(function (el) {
    if (el.tagName === "SPAN") return;
    if (keepIds[el.id]) return;
    if (el.id) {
      const already =
        play.querySelector("#" + el.id) ||
        setup.querySelector("#" + el.id) ||
        (custom && custom.querySelector("#" + el.id)) ||
        (modes && modes.querySelector("#" + el.id));
      if (already) {
        window.remixHideSettingsNode(el, bin);
        return;
      }
    }
    setup.appendChild(el);
  });
  const extraResets = setup.querySelectorAll('[id="ResetKeybind"]');
  for (let i = 1; i < extraResets.length; i++) {
    window.remixHideSettingsNode(extraResets[i], bin);
  }
  window.remixEnsureVisibilityButton(setup);
  window.remixEnsureSettingsFlex();
  window.remixHookSetTheme();
  window.remixHookResetKeyMake();
  window.remixBindResetKeyButtons();

  let startPage = window.__remixSettingsPage || window.__ultraSettingsPage || "play";
  if (startPage === "stats") startPage = "setup";
  window.remixShowSettingsPage(startPage);
};

window.RemixMod.runCodeBefore = function () {
  // Shared Blender placement: fill existing empty cells after Peaceful (trophy_21).
  // The list is cached per panel because claiming a cell drops its "empty"
  // marker class — rescanning would renumber the slots for every later mode,
  // which used to leave the third mode with no slot at all.
  window.claimPeacefulFollowSlot = function claimPeacefulFollowSlot(slotIndex) {
    let panel = document.querySelector(".PWIidc");
    if (!panel) return null;

    let cached = window.remixBlenderSlots;
    if (!cached || cached.panel !== panel) {
      let peacefulImg = panel.querySelector('img[src$="trophy_21.png"]');
      if (!peacefulImg) return null;
      let outer =
        (peacefulImg.closest &&
          peacefulImg.closest(".vuOknd") &&
          peacefulImg.closest(".vuOknd").parentElement) ||
        (peacefulImg.parentElement && peacefulImg.parentElement.parentElement);
      if (!outer || outer.parentElement !== panel) return null;
      let empties = [];
      let sib = outer.nextElementSibling;
      while (sib) {
        let inner = sib.querySelector(":scope > .vuOknd");
        if (inner && inner.classList.contains("oBBKec")) {
          empties.push(inner);
        }
        sib = sib.nextElementSibling;
      }
      cached = window.remixBlenderSlots = { panel: panel, slots: empties };
    }

    return cached.slots[slotIndex] || null;
  };

  window.populateRemixBlenderSlot = function populateRemixBlenderSlot(opts) {
    if (!opts || !opts.id) return null;
    let existing = document.getElementById(opts.id);
    if (existing) return existing;
    let slot = window.claimPeacefulFollowSlot(opts.slotIndex);
    if (!slot) return null;
    slot.id = opts.id;
    slot.setAttribute("aria-label", opts.ariaLabel || "Toggle game mode");
    slot.setAttribute("role", "button");
    slot.setAttribute("tabindex", "0");
    slot.classList.remove("oBBKec");
    slot.setAttribute("class", "vuOknd blender_icon");
    slot.innerHTML =
      `<img class="DEvgAc blender_icon_img" src="` + opts.icon + `" alt="">`;
    let onToggle = opts.onToggle;
    slot.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (onToggle) onToggle();
    });
    slot.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        ev.stopPropagation();
        if (onToggle) onToggle();
      }
    });
    return slot;
  };

  window.remixBaseRunCodeBefore();
  window.remixHookSetTheme();
  window.remixHookResetKeyMake();
  if (typeof window.remixInlineCspMenuIcons === "function") {
    window.remixInlineCspMenuIcons();
  }
  // Modes claim their trophy slots after MorePudding (incl. MoreMenu) has
  // finished adding its own, so their ids land at the end.
  window.CandyMod.runCodeBefore();
  window.ChessMod.runCodeBefore();
  window.BurgerMod.runCodeBefore();
  window.CatSpeed.runCodeBefore();
  window.DiceCounts.runCodeBefore();
  window.CustomSettings.runCodeBefore();
  window.CustomSize.runCodeBefore();
  window.CustomColors.runCodeBefore();
  window.CustomSpeeds.runCodeBefore();
  // After Chess/Burger helpers exist: re-enable SpeedInfo and gate its data.
  window.RemixSpeedInfo.runCodeBefore();
  window.PauseMod.runCodeBefore();
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.RemixMod.alterSnakeCode = function (code) {
  code = window.remixBaseAlterSnakeCode(code);
  // Candy → Chess → Burger (Burger builds on Chess-patched tick/f7/score)
  code = window.CandyMod.alterSnakeCode(code);
  code = window.ChessMod.alterSnakeCode(code);
  code = window.BurgerMod.alterSnakeCode(code);
  code = window.CatSpeed.alterSnakeCode(code);
  code = window.DiceCounts.alterSnakeCode(code);
  code = window.CustomSize.alterSnakeCode(code);
  code = window.CustomColors.alterSnakeCode(code);
  code = window.CustomSpeeds.alterSnakeCode(code);
  code = window.RemixSpeedInfo.alterSnakeCode(code);
  // After MoreMenu: skip if the tick is already gated.
  code = window.PauseMod.alterSnakeCode(code);
  code = window.remixPatchWallEveryApple(code);
  return code;
};

////////////////////////////////////////////////////////////////////
//RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.RemixMod.runCodeAfter = function () {
  // Re-ensure blender toggles exist after DOM settles
  window.CandyMod.runCodeAfter && window.CandyMod.runCodeAfter();
  window.ChessMod.runCodeAfter && window.ChessMod.runCodeAfter();
  window.BurgerMod.runCodeAfter && window.BurgerMod.runCodeAfter();
  window.RemixSpeedInfo.runCodeAfter && window.RemixSpeedInfo.runCodeAfter();
  window.PauseMod.runCodeAfter && window.PauseMod.runCodeAfter();
  window.remixHookSetTheme();
  window.remixHookResetKeyMake();
  window.remixOrganizeSettings();
  setTimeout(function () {
    window.remixOrganizeSettings();
  }, 0);

  let modIndicator = document.createElement("div");
  modIndicator.style =
    "position:absolute;font-family:Arial,sans-serif;color:white;font-size:14px;padding-top:4px;padding-left:30px;user-select: none;";
  modIndicator.textContent = "Remix Mod";
  let canvasNode = document.getElementsByClassName("jNB0Ic")[0];
  let parent = document.getElementsByClassName("EjCLSb")[0];
  if (parent && canvasNode) {
    parent.insertBefore(modIndicator, canvasNode);
  }
};
