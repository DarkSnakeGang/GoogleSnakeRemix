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
#settings-popup-pudding .remix-custom-toolbar-actions .btn,
#settings-popup-pudding .remix-custom-btn-inline {
  display: inline-block;
  width: auto !important;
  margin: 0 !important;
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
/* Native number spinners keep auto-repeating on hover/drag — hide them. */
#black-dice-settings input[type="number"],
.remix-custom-card input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
#black-dice-settings input[type="number"]::-webkit-outer-spin-button,
#black-dice-settings input[type="number"]::-webkit-inner-spin-button,
.remix-custom-card input[type="number"]::-webkit-outer-spin-button,
.remix-custom-card input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
#remix-custom-settings {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  flex: 1 1 auto;
}
.remix-custom-subpager {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  flex-shrink: 0;
  margin-bottom: 2px;
}
.remix-custom-subtab {
  min-width: 0;
  font-family: Roboto, Arial, sans-serif !important;
  font-size: 11px !important;
  padding: 6px 4px !important;
  border: none !important;
  border-radius: 8px !important;
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
.remix-slot-mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 8px;
  margin-top: 8px;
  width: 100%;
  box-sizing: border-box;
}
.remix-slot-mode-cell {
  position: relative !important;
  left: auto !important;
  top: auto !important;
  right: auto !important;
  bottom: auto !important;
  width: 48px !important;
  height: 48px !important;
  min-width: 48px;
  min-height: 48px;
  margin: 0 auto !important;
  padding: 2px !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid transparent !important;
  border-radius: 8px !important;
  background: rgba(0, 0, 0, 0.22) !important;
  opacity: 0.42;
  float: none !important;
  transform: none !important;
}
.remix-slot-mode-cell.remix-slot-mode-on {
  opacity: 1;
  border-color: rgba(255, 255, 255, 0.85) !important;
  background: rgba(17, 85, 204, 0.35) !important;
}
.remix-slot-mode-cell img,
.remix-slot-mode-cell .remix-slot-mode-img {
  position: static !important;
  width: 40px !important;
  height: 40px !important;
  max-width: 100%;
  object-fit: contain;
  pointer-events: none;
  display: block;
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
.remix-custom-toolbar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: stretch;
  margin: 8px 0;
}
.remix-custom-toolbar-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: stretch;
}
.remix-custom-toolbar .remix-custom-select {
  width: 100%;
  flex: 0 0 auto;
  min-width: 0;
}
.remix-custom-select,
.remix-custom-card .remix-custom-input {
  flex: 1 1 140px;
  min-width: 120px;
  box-sizing: border-box;
  padding: 8px 10px !important;
  border-radius: 8px !important;
  border: none !important;
  font-size: 12px !important;
  font-family: Roboto, Arial, sans-serif !important;
  color: #fff !important;
  background-color: var(--ultra-btn, #1155CC) !important;
}
.remix-custom-select option {
  color: #111;
  background: #fff;
}
.remix-custom-btn-inline {
  width: auto !important;
  flex: 0 0 auto;
  margin: 0 !important;
  padding: 8px 12px !important;
  white-space: nowrap;
}
.remix-custom-fruit-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin: 6px 0;
}
.remix-custom-fruit-row label {
  min-width: 3.6em;
  color: #fff;
}
.remix-custom-file {
  max-width: 100%;
  color: #fff;
  font-size: 11px;
  font-family: Roboto, Arial, sans-serif;
}
.remix-custom-status {
  margin-top: 6px;
}
.remix-custom-status-ok {
  color: #9fef9f !important;
}
.remix-custom-status-err {
  color: #ffb4b4 !important;
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

// Mexico enables e7(1) for mid-wall collision only — never native wall spawns.
// Slot Machine uses the same pattern: leftover walls still collide via e7(1),
// but new walls only spawn while the active roll is Wall (1).
window.remixMexicoBlocksWallSpawn = function remixMexicoBlocksWallSpawn() {
  if (window.isMexicoActive && window.isMexicoActive()) return true;
  if (window.isSlotMachineActive && window.isSlotMachineActive()) {
    return (window.__slotActive | 0) !== 1;
  }
  return false;
};

window.remixShouldSpawnWallEveryApple = function remixShouldSpawnWallEveryApple() {
  window.remixEnsureWallEveryAppleSetting();
  if (window.disableWallMode) return false;
  if (window.remixMexicoBlocksWallSpawn()) return false;
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
  // Slot Machine may have already extended the every-other `f` flag with
  // slot_force_entity_spawn — keep that when patching wall spawn.
  const reSlot =
    /([a-zA-Z_$][\w$]*)=!([a-zA-Z_$][\w$]*)\.nj&&!([a-zA-Z_$][\w$]*)&&\(\2\.Sh%2===1\|\|e7\(\2\.settings,11\)\|\|window\.slot_force_entity_spawn&&window\.slot_force_entity_spawn\(\)\);e7\(\2\.settings,1\)&&\1&&/;
  const rePlain =
    /([a-zA-Z_$][\w$]*)=!([a-zA-Z_$][\w$]*)\.nj&&!([a-zA-Z_$][\w$]*)&&\(\2\.Sh%2===1\|\|e7\(\2\.settings,11\)\);e7\(\2\.settings,1\)&&\1&&/;
  if (reSlot.test(code)) {
    return code.replace(
      reSlot,
      "$1=!$2.nj&&!$3&&($2.Sh%2===1||e7($2.settings,11)||window.slot_force_entity_spawn&&window.slot_force_entity_spawn());e7($2.settings,1)&&!window.remixMexicoBlocksWallSpawn()&&($1||window.remixShouldSpawnWallEveryApple()&&!$2.nj&&!$3)&&"
    );
  }
  if (!rePlain.test(code)) {
    console.error("Remix: failed to find wall-mode every-other-apple spawn gate");
    return code;
  }
  return code.replace(
    rePlain,
    "$1=!$2.nj&&!$3&&($2.Sh%2===1||e7($2.settings,11));e7($2.settings,1)&&!window.remixMexicoBlocksWallSpawn()&&($1||window.remixShouldSpawnWallEveryApple()&&!$2.nj&&!$3)&&"
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
      window.remixSyncInputDisplayVsSettings();
    };
    window.__remixBootstrapFlex = true;
  }
  if (typeof window.BootstrapHide === "function" && !window.__remixBootstrapHideInput) {
    const origHide = window.BootstrapHide;
    window.BootstrapHide = function () {
      origHide.apply(this, arguments);
      window.remixSyncInputDisplayVsSettings();
    };
    window.__remixBootstrapHideInput = true;
  }
};

/** Hide Input Display while Pudding settings are open (Speed Info footer / Ultra slot). */
window.remixSyncInputDisplayVsSettings = function remixSyncInputDisplayVsSettings() {
  const settingsOpen = !!window.bootstrapVisible;
  const want =
    !!(window.pudding_settings && window.pudding_settings.InputDisplay) &&
    !settingsOpen;
  const sec = document.getElementById("input-display-section");
  const slot = document.getElementById("ultra-input-slot");
  // Ultra layout owns the slot; only poke the Speed Info-hosted section here.
  if (sec && (!slot || !slot.contains(sec))) {
    sec.style.display = want ? "flex" : "none";
  }
  if (slot && settingsOpen) {
    slot.style.display = "none";
  } else if (
    slot &&
    want &&
    typeof window.ultraLayoutMenus === "function" &&
    window.__ultraLayoutReady
  ) {
    window.ultraLayoutMenus();
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
  if (typeof window.remixInjectCustomFruitSettingsUi === "function") {
    window.remixInjectCustomFruitSettingsUi();
  }
  if (typeof window.remixInjectCustomPoisonSettingsUi === "function") {
    window.remixInjectCustomPoisonSettingsUi();
  }
  if (typeof window.remixInjectSlotMachineSettingsUi === "function") {
    window.remixInjectSlotMachineSettingsUi();
  }

  let bin = document.getElementById("ultra-settings-hidden");
  if (!bin) {
    bin = document.createElement("div");
    bin.id = "ultra-settings-hidden";
    bin.className = "ultra-hide";
    root.appendChild(bin);
  }

  // Speed Info (#AlwaysOnTimeKeeper) stays visible — RemixSpeedInfo gates data.
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
  if (typeof window.remixInstallHamiltonCheckbox === "function") {
    window.remixInstallHamiltonCheckbox(play);
  }
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
  // Shared Blender placement: fill empty cells after Peaceful (trophy_21).
  // Always claim the next remaining empty — never an absolute slotIndex into a
  // rebuilt empties list (that skipped cells and left holes once Cat/Mexico
  // grew capacity after Candy/Chess/Burger had already claimed).
  window.remixBlenderPeacefulOuter = function remixBlenderPeacefulOuter(panel) {
    const root = panel || document.querySelector(".PWIidc");
    if (!root) return null;
    const peacefulImg = root.querySelector('img[src$="trophy_21.png"]');
    if (!peacefulImg) return null;
    const outer =
      (peacefulImg.closest &&
        peacefulImg.closest(".vuOknd") &&
        peacefulImg.closest(".vuOknd").parentElement) ||
      (peacefulImg.parentElement && peacefulImg.parentElement.parentElement);
    if (!outer || outer.parentElement !== root) return null;
    return { panel: root, outer: outer };
  };

  window.remixCollectBlenderEmpties = function remixCollectBlenderEmpties(panel) {
    const ctx = window.remixBlenderPeacefulOuter(panel);
    if (!ctx) return [];
    const empties = [];
    let sib = ctx.outer.nextElementSibling;
    while (sib) {
      const inner = sib.querySelector(":scope > .vuOknd");
      if (inner && inner.classList.contains("oBBKec")) {
        empties.push(inner);
      }
      sib = sib.nextElementSibling;
    }
    return empties;
  };

  window.remixEnsureBlenderCapacity = function remixEnsureBlenderCapacity(
    minEmptySlots
  ) {
    const need = typeof minEmptySlots === "number" ? minEmptySlots : 1;
    const ctx = window.remixBlenderPeacefulOuter();
    if (!ctx) return null;
    const panel = ctx.panel;
    const outer = ctx.outer;

    let empties = window.remixCollectBlenderEmpties(panel);
    let templateOuter = outer.nextElementSibling || outer;
    let guard = 0;
    while (empties.length < need && guard++ < 24) {
      const clone = templateOuter.cloneNode(true);
      const inner = clone.querySelector(".vuOknd") || clone;
      if (inner) {
        inner.removeAttribute("id");
        inner.className = "vuOknd oBBKec";
        inner.innerHTML = "";
        inner.removeAttribute("aria-label");
        inner.removeAttribute("role");
        inner.removeAttribute("tabindex");
      }
      panel.appendChild(clone);
      empties = window.remixCollectBlenderEmpties(panel);
    }
    return empties;
  };

  // Drop unused empty placeholders so they do not show as holes in the grid.
  // Pack into 6 columns so Candy…Mexico still fit in the stock 5-row viewport
  // (5 columns overflows into a clipped 6th row). No scrolling.
  window.remixFitBlenderModeGrid = function remixFitBlenderModeGrid(panel) {
    const root = panel || document.querySelector(".PWIidc");
    if (!root) return false;
    try {
      root.style.gridTemplateColumns = "repeat(6, minmax(0, 1fr))";
      root.style.overflow = "hidden";
    } catch (_e) {
      return false;
    }
    return true;
  };

  window.remixCompactBlenderEmpties = function remixCompactBlenderEmpties(
    keepSpare
  ) {
    const keep = typeof keepSpare === "number" ? keepSpare : 0;
    const ctx = window.remixBlenderPeacefulOuter();
    if (!ctx) return 0;
    const empties = window.remixCollectBlenderEmpties(ctx.panel);
    let removed = 0;
    for (let i = keep; i < empties.length; i++) {
      const inner = empties[i];
      const shell = inner.parentElement;
      if (shell && shell.parentElement === ctx.panel && shell !== ctx.outer) {
        shell.remove();
        removed++;
      } else if (inner.parentElement === ctx.panel) {
        inner.remove();
        removed++;
      }
    }
    window.remixFitBlenderModeGrid(ctx.panel);
    return removed;
  };

  window.claimPeacefulFollowSlot = function claimPeacefulFollowSlot(_slotIndex) {
    if (typeof window.remixEnsureBlenderCapacity === "function") {
      window.remixEnsureBlenderCapacity(1);
    }
    const empties = window.remixCollectBlenderEmpties();
    return empties[0] || null;
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
  // Custom fruit must land in new_fruit before Chess pieces so the #apple menu
  // index still maps to the custom entry (not black bishop).
  window.CustomFruit.runCodeBefore();
  window.ChessMod.runCodeBefore();
  window.BurgerMod.runCodeBefore();
  // Cat Speed first so CAT_SPEED_ICON exists for Cat Mode trophy art.
  window.CatSpeed.runCodeBefore();
  window.CatMod.runCodeBefore();
  window.MexicoMod.runCodeBefore();
  window.BombFruitMod.runCodeBefore();
  window.SlotMachineMod.runCodeBefore();
  window.DiceCounts.runCodeBefore();
  window.CustomSettings.runCodeBefore();
  window.CustomSize.runCodeBefore();
  window.CustomColors.runCodeBefore();
  window.CustomSpeeds.runCodeBefore();
  // After Chess/Burger helpers exist: re-enable SpeedInfo and gate its data.
  window.RemixSpeedInfo.runCodeBefore();
  window.PauseMod.runCodeBefore();
  window.HamiltonRemix.runCodeBefore();
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.RemixMod.alterSnakeCode = function (code) {
  code = window.remixBaseAlterSnakeCode(code);
  // Candy → Chess → Burger → Cat → Mexico (Mexico builds on Cat-patched e7/tick/reset)
  code = window.CandyMod.alterSnakeCode(code);
  code = window.ChessMod.alterSnakeCode(code);
  code = window.BurgerMod.alterSnakeCode(code);
  try {
    code = window.CatMod.alterSnakeCode(code);
  } catch (e) {
    console.error("RemixMod: CatMod.alterSnakeCode failed", e);
  }
  try {
    code = window.MexicoMod.alterSnakeCode(code);
  } catch (e) {
    console.error("RemixMod: MexicoMod.alterSnakeCode failed", e);
  }
  try {
    code = window.BombFruitMod.alterSnakeCode(code);
  } catch (e) {
    console.error("RemixMod: BombFruitMod.alterSnakeCode failed", e);
  }
  try {
    code = window.SlotMachineMod.alterSnakeCode(code);
  } catch (e) {
    console.error("RemixMod: SlotMachineMod.alterSnakeCode failed", e);
  }
  code = window.CatSpeed.alterSnakeCode(code);
  code = window.DiceCounts.alterSnakeCode(code);
  code = window.CustomSize.alterSnakeCode(code);
  code = window.CustomColors.alterSnakeCode(code);
  code = window.CustomSpeeds.alterSnakeCode(code);
  code = window.CustomFruit.alterSnakeCode(code);
  code = window.HamiltonRemix.alterSnakeCode(code);
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
  window.CatMod.runCodeAfter && window.CatMod.runCodeAfter();
  window.MexicoMod.runCodeAfter && window.MexicoMod.runCodeAfter();
  window.BombFruitMod.runCodeAfter && window.BombFruitMod.runCodeAfter();
  window.SlotMachineMod.runCodeAfter && window.SlotMachineMod.runCodeAfter();
  // Remove leftover empty placeholders so Cat/Mexico sit flush after Burger.
  // Also pack to 6 columns so the extra modes fit without a clipped 6th row.
  if (typeof window.remixCompactBlenderEmpties === "function") {
    window.remixCompactBlenderEmpties(0);
  } else if (typeof window.remixFitBlenderModeGrid === "function") {
    window.remixFitBlenderModeGrid();
  }
  window.RemixSpeedInfo.runCodeAfter && window.RemixSpeedInfo.runCodeAfter();
  window.PauseMod.runCodeAfter && window.PauseMod.runCodeAfter();
  window.HamiltonRemix.runCodeAfter && window.HamiltonRemix.runCodeAfter();
  window.remixHookSetTheme();
  window.remixHookResetKeyMake();
  window.remixOrganizeSettings();
  setTimeout(function () {
    window.remixOrganizeSettings();
    if (typeof window.remixCompactBlenderEmpties === "function") {
      window.remixCompactBlenderEmpties(0);
    }
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
