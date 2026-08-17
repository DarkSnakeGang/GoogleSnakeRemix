window.RemixUltraMod = {};

window.REMIX_ULTRA_SETTINGS_KEY = "RemixUltraSettings";
window.REMIX_ULTRA_TIMEKEEPER_KEY = "snake_timeKeeper_remix_ultra";

// RemixInit already assigned RemixSettings keys at parse time. Point the
// isolated-storage helpers at Ultra keys before any runCodeBefore runs, and
// seed once from Remix (then Pudding) if Ultra is empty.
window.REMIX_SETTINGS_KEY = window.REMIX_ULTRA_SETTINGS_KEY;
window.REMIX_TIMEKEEPER_KEY = window.REMIX_ULTRA_TIMEKEEPER_KEY;

window.remixSeedIsolatedStorage = function remixSeedIsolatedStorage() {
  try {
    if (!localStorage.getItem(window.REMIX_SETTINGS_KEY)) {
      const remix = localStorage.getItem("RemixSettings");
      if (remix) localStorage.setItem(window.REMIX_SETTINGS_KEY, remix);
      else {
        const pud = localStorage.getItem("PuddingSettings");
        if (pud) localStorage.setItem(window.REMIX_SETTINGS_KEY, pud);
      }
    }
    if (!localStorage.getItem(window.REMIX_TIMEKEEPER_KEY)) {
      const remixTk = localStorage.getItem("snake_timeKeeper_remix");
      if (remixTk) localStorage.setItem(window.REMIX_TIMEKEEPER_KEY, remixTk);
      else {
        const tk = localStorage.getItem("snake_timeKeeper");
        if (tk) localStorage.setItem(window.REMIX_TIMEKEEPER_KEY, tk);
      }
    }
  } catch (_e) {}
};

window.__remixCore = {
  runCodeBefore: window.RemixMod.runCodeBefore,
  alterSnakeCode: window.RemixMod.alterSnakeCode,
  runCodeAfter: window.RemixMod.runCodeAfter,
};

window.ultraDock = {
  right: "place",
  left: null,
  lastPlace: "place",
  savedRight: null,
};

window.__ultraApplying = false;
window.__ultraLayoutReady = false;

window.ultraChallengeOrHamActive = function ultraChallengeOrHamActive() {
  try {
    const el = document.getElementsByClassName("chosen-preset")[0];
    if (!el) return false;
    return (
      el.classList.contains("preset-challenge") ||
      el.classList.contains("preset-random-ham")
    );
  } catch (_e) {
    return false;
  }
};

window.ultraSpeedInfoEnabled = function ultraSpeedInfoEnabled() {
  return false;
};

window.ultraElShown = function ultraElShown(el) {
  if (!el || el.hidden) return false;
  const s = getComputedStyle(el);
  return s.display !== "none" && s.visibility !== "hidden";
};

window.ultraModalOpen = function ultraModalOpen() {
  if (window.portalPairsPanelVisible) return true;
  if (window.timeKeeper && window.timeKeeper.dialogActive) return true;
  const edit = document.getElementById("edit-box");
  if (edit && edit.offsetWidth > 0 && window.ultraElShown(edit)) return true;
  const vis = document.getElementById("delete-stuff-popup");
  if (vis && vis.hidden === false && vis.offsetWidth > 0) return true;
  const exp = document.getElementById("custom-export-dialogue-container");
  if (exp && exp.style.display === "block") return true;
  const tk = document.getElementById("timeKeeperDialog");
  if (tk && window.ultraElShown(tk) && tk.offsetWidth > 0) return true;
  return false;
};

window.ultraPersistDock = function ultraPersistDock() {
  try {
    if (!window.pudding_settings) return;
    window.pudding_settings.ultraDockRight = window.ultraDock.right;
    if (typeof window.saveSettings === "function") window.saveSettings();
  } catch (_e) {}
};

window.ultraDefaultRightTab = function ultraDefaultRightTab() {
  const saved =
    window.pudding_settings && window.pudding_settings.ultraDockRight;
  if (saved === "place" || saved === "presets" || saved === "more") return saved;
  if (saved === null || saved === "" || saved === "off") return null;
  return "place";
};

window.ultraDockTabH = 28;
window.ultraDockH = 584;
window.ultraInputH = 110;

window.ultraInputOn = function ultraInputOn() {
  return !!(window.pudding_settings && window.pudding_settings.InputDisplay);
};

window.ultraPanelH = function ultraPanelH() {
  return (
    window.ultraDockH -
    window.ultraDockTabH -
    (window.ultraInputOn() ? window.ultraInputH : 0)
  );
};

window.ultraApplyTheme = function ultraApplyTheme() {
  const bar = window.real_topbar_color || "#4a752c";
  const btn = window.button_color || "#1155CC";
  const root = document.documentElement;
  root.style.setProperty("--ultra-bar", bar);
  root.style.setProperty("--ultra-btn", btn);
  window.ultraPaintTabs();
};

window.ultraInjectThemeCss = function ultraInjectThemeCss() {
  if (document.getElementById("ultra-theme-css")) return;
  const css = document.createElement("style");
  css.id = "ultra-theme-css";
  css.textContent = `
#ultra-dock-tabs, #ultra-left-dock-tabs {
  display: flex;
  gap: 4px;
  padding: 0 2px;
  box-sizing: border-box;
}
.ultra-tab {
  font-family: Roboto, Arial, sans-serif !important;
  font-size: 12px !important;
  padding: 5px 10px !important;
  border: none !important;
  border-radius: 8px 8px 0 0 !important;
  cursor: pointer;
  line-height: 1.2;
  background: var(--ultra-bar, #4a752c);
  color: #fff;
  box-shadow: 0 -1px 4px rgba(0,0,0,0.18);
}
.ultra-tab.ultra-tab-on {
  background: var(--ultra-btn, #1155CC);
  color: #fff;
}
#place-panel, #preset-panel, #custom-panel, #challenge-panel,
#speedinfo-popup-pudding, #settings-popup-pudding, #split-panel-pudding,
#ultra-input-slot {
  background: var(--ultra-bar, #4a752c) !important;
  background-color: var(--ultra-bar, #4a752c) !important;
  border: none !important;
  border-radius: 0 0 8px 8px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.28);
  color: #fff !important;
  font-family: Roboto, Arial, sans-serif !important;
  box-sizing: border-box !important;
  scrollbar-width: none !important;
}
.sEOCsb, .sEOCsb * {
  scrollbar-width: none !important;
}
.sEOCsb::-webkit-scrollbar,
.sEOCsb *::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
#place-panel, #preset-panel {
  width: 220px !important;
  overflow: hidden !important;
  padding: 8px 4px 6px !important;
  align-content: start !important;
  justify-content: space-evenly !important;
  gap: 6px 0 !important;
}
#place-panel {
  grid-template-columns: repeat(4, 48px) !important;
}
#preset-panel {
  grid-template-columns: repeat(3, 56px) !important;
}
#place-panel img.place-option {
  width: 48px !important;
  height: 48px !important;
  max-width: 48px !important;
  object-fit: contain !important;
}
#preset-panel img.preset-option {
  width: 56px !important;
  height: 56px !important;
  max-width: 56px !important;
  object-fit: contain !important;
  background: rgba(0,0,0,0.18);
  image-rendering: pixelated;
}
#preset-panel .preset-random-ham {
  grid-column: 1 / -1 !important;
  width: auto !important;
  max-width: none !important;
  height: 32px !important;
  line-height: 32px !important;
  margin-top: 4px !important;
  font-size: 13px !important;
}
#custom-panel, #challenge-panel {
  width: 220px !important;
  overflow: hidden !important;
  padding: 8px !important;
  color: #fff !important;
}
#custom-panel > div {
  padding: 0 !important;
}
#settings-popup-pudding {
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column;
  padding: 8px !important;
  box-sizing: border-box !important;
}
#settings-popup-pudding > span {
  flex-shrink: 0;
  font-size: 13px;
}
#ultra-settings-pager {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  margin: 6px 0 8px;
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
  background: var(--ultra-btn, #1155CC);
  color: #fff;
}
.ultra-settings-page {
  display: none;
  overflow: hidden;
  min-height: 0;
}
.ultra-settings-page.ultra-page-on {
  display: block;
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
#settings-popup-pudding .form-check-input {
  float: none !important;
  position: static !important;
  margin: 0 !important;
  flex-shrink: 0;
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
#split-panel-pudding,
#split-panel-list {
  overflow: hidden !important;
}
#split-panel-list {
  overflow-y: auto !important;
}
#custom-panel p, #challenge-panel p,
#custom-panel label, #challenge-panel label {
  color: #fff !important;
}
#custom-preset-canvas {
  width: 196px !important;
  max-width: 100% !important;
  height: auto !important;
  display: block;
  margin: 8px auto !important;
  border: 2px solid rgba(255,255,255,0.28) !important;
  border-radius: 8px !important;
}
#custom-panel p, #challenge-panel p {
  font-size: 12px !important;
  line-height: 1.35;
}
#custom-panel button, #challenge-panel button,
#custom-import, #custom-export, #custom-clear, #custom-refresh {
  padding: 5px 7px !important;
  font-size: 11px !important;
  margin: 2px 4px 6px 0 !important;
}
#custom-panel button, #challenge-panel button,
#custom-import, #custom-export, #custom-clear, #custom-refresh {
  border-radius: 8px !important;
  background: var(--ultra-btn, #1155CC) !important;
  color: #fff !important;
  border: none !important;
  font-family: Roboto, Arial, sans-serif !important;
}
#custom-clear { background: #b41111 !important; }
#custom-map-size, #custom-brush, #challenge-level {
  border-radius: 8px !important;
  border: none !important;
  padding: 4px 8px;
}
#link-to-preset, #link-to-place {
  display: none !important;
}
#preset-panel > .preset-custom,
#preset-panel > .preset-challenge {
  display: none !important;
}
.place-option, .preset-option {
  border-radius: 8px;
}
.chosen-preset {
  outline: 3px solid #ffe566 !important;
  border-radius: 8px;
}
#ultra-input-slot {
  position: absolute;
  left: 100%;
  z-index: 10003;
  width: 220px;
  padding: 6px 8px 8px;
  display: none;
  justify-content: center;
  align-items: flex-end;
}
#ultra-input-slot #input-display-section {
  display: flex !important;
  border-top: none !important;
  min-height: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  width: 100%;
  justify-content: center;
  align-items: flex-end;
}
#speedinfo-popup-pudding, #settings-popup-pudding, #split-panel-pudding {
  border-radius: 0 0 8px 8px !important;
}
#custom-export-dialogue {
  border-radius: 8px !important;
}
`;
  document.head.appendChild(css);
};

window.ultraSetPanelDisplay = function ultraSetPanelDisplay(el, show, shown) {
  if (!el) return;
  el.style.display = show ? shown : "none";
  el.style.visibility = show ? "visible" : "hidden";
};

window.ultraFitRightPanel = function ultraFitRightPanel(el) {
  if (!el) return;
  const abs =
    el.id === "speedinfo-popup-pudding" ||
    el.id === "settings-popup-pudding" ||
    el.id === "split-panel-pudding";
  if (abs) el.style.top = window.ultraDockTabH + "px";
  el.style.height = window.ultraPanelH() + "px";
  el.style.width = "220px";
};

window.ultraLayoutMenus = function ultraLayoutMenus() {
  if (!window.__ultraLayoutReady) return;
  if (window.__ultraApplying) return;
  window.__ultraApplying = true;
  try {
    const modal = window.ultraModalOpen();
    const tabBar = document.getElementById("ultra-dock-tabs");
    const leftBar = document.getElementById("ultra-left-dock-tabs");
    const place = document.getElementById("place-panel");
    const preset = document.getElementById("preset-panel");
    const custom = document.getElementById("custom-panel");
    const challenge = document.getElementById("challenge-panel");
    const speed = document.getElementById("speedinfo-popup-pudding");
    const more = document.getElementById("settings-popup-pudding");
    const splits = document.getElementById("split-panel-pudding");
    const inputSlot = document.getElementById("ultra-input-slot");

    if (modal) {
      if (window.ultraDock.savedRight == null) {
        window.ultraDock.savedRight = window.ultraDock.right;
      }
      if (tabBar) tabBar.style.display = "none";
      if (leftBar) leftBar.style.display = "none";
      window.ultraSetPanelDisplay(place, false, "grid");
      window.ultraSetPanelDisplay(preset, false, "grid");
      window.ultraSetPanelDisplay(custom, false, "block");
      window.ultraSetPanelDisplay(challenge, false, "block");
      window.ultraSetPanelDisplay(speed, false, "flex");
      window.ultraSetPanelDisplay(more, false, "block");
      window.ultraSetPanelDisplay(splits, false, "flex");
      if (inputSlot) inputSlot.style.display = "none";
      return;
    }

    if (window.ultraDock.savedRight != null) {
      window.ultraDock.right = window.ultraDock.savedRight;
      window.ultraDock.savedRight = null;
    }

    if (window.ultraDock.right === "speed") {
      window.ultraDock.right = window.ultraDock.lastPlace || "place";
    }

    if (tabBar) tabBar.style.display = "flex";
    if (leftBar) leftBar.style.display = "flex";

    const right = window.ultraDock.right;
    window.ultraSetPanelDisplay(place, right === "place", "grid");
    window.ultraSetPanelDisplay(preset, right === "presets", "grid");
    window.ultraFitRightPanel(place);
    window.ultraFitRightPanel(preset);
    const tabPx = window.ultraDockTabH + "px";
    if (place && place.parentElement) {
      place.parentElement.style.top = tabPx;
      place.parentElement.style.zIndex = "10000";
    }
    if (custom && custom.parentElement) {
      custom.parentElement.style.top = tabPx;
      custom.parentElement.style.zIndex = "10000";
    }

    if (speed) {
      speed.style.display = "none";
      speed.style.visibility = "hidden";
    }
    if (more) {
      window.ultraFitRightPanel(more);
      if (right === "more") {
        more.style.display = "block";
        more.style.visibility = "visible";
      } else {
        more.style.display = "none";
        more.style.visibility = "hidden";
      }
    }

    if (inputSlot) {
      if (window.ultraInputOn()) {
        inputSlot.style.display = "flex";
        inputSlot.style.top =
          (right
            ? window.ultraDockTabH + window.ultraPanelH()
            : window.ultraDockTabH) + "px";
        inputSlot.style.height = window.ultraInputH + "px";
      } else {
        inputSlot.style.display = "none";
      }
    }

    const left = window.ultraDock.left;
    const leftH = window.ultraDockH - window.ultraDockTabH + "px";
    window.ultraSetPanelDisplay(custom, left === "custom", "block");
    window.ultraSetPanelDisplay(challenge, left === "challenge", "block");
    if (custom) custom.style.height = leftH;
    if (challenge) challenge.style.height = leftH;
    if (splits) {
      splits.style.top = window.ultraDockTabH + "px";
      splits.style.height = leftH;
      splits.style.width = "220px";
      if (left === "splits") {
        splits.style.display = "flex";
        splits.style.visibility = "visible";
      } else {
        splits.style.display = "none";
        splits.style.visibility = "hidden";
      }
    }

    window.ultraPaintTabs();
  } finally {
    window.__ultraApplying = false;
  }
};

window.ultraPaintTabs = function ultraPaintTabs() {
  const ids = [
    ["ultra-tab-place", "place"],
    ["ultra-tab-presets", "presets"],
    ["ultra-tab-more", "more"],
    ["ultra-tab-custom", "custom"],
    ["ultra-tab-challenge", "challenge"],
    ["ultra-tab-splits", "splits"],
  ];
  for (const [id, key] of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const on =
      window.ultraDock.right === key || window.ultraDock.left === key;
    el.classList.toggle("ultra-tab-on", on);
  }
};

window.ultraSetRight = function ultraSetRight(tab, opts) {
  if (tab === "place" || tab === "presets") {
    window.ultraDock.lastPlace = tab;
  }
  window.ultraDock.right = tab;
  if (!opts || opts.persist !== false) window.ultraPersistDock();
  window.ultraLayoutMenus();
};

window.ultraOpenRight = function ultraOpenRight(tab) {
  if (window.ultraDock.right === tab) {
    window.ultraSetRight(null);
    return;
  }
  window.ultraSetRight(tab);
};

window.ultraSetLeft = function ultraSetLeft(tab) {
  window.ultraDock.left = tab;
  window.ultraLayoutMenus();
};

window.ultraSelectPresetKind = function ultraSelectPresetKind(kind, forceReset) {
  const panel = document.getElementById("preset-panel");
  if (!panel) return;
  const el = panel.querySelector(".preset-" + kind);
  if (!el) return;
  const already = el.classList.contains("chosen-preset");
  Array.from(panel.children).forEach(function (c) {
    c.classList.remove("chosen-preset");
  });
  el.classList.add("chosen-preset");
  if (!window.megaWholeSnakeObject && !window.__remixGame) return;
  if (kind === "challenge") {
    window.selectNewSizeSettingAndHardReset(0);
    return;
  }
  if (!already || forceReset) window.ultraHardResetBoard();
};

window.ultraOpenLeft = function ultraOpenLeft(tab) {
  if (window.ultraDock.left === tab) {
    window.ultraSetLeft(null);
    return;
  }
  window.ultraSetLeft(tab);
  if (tab === "custom") window.ultraSelectPresetKind("custom", true);
  if (tab === "challenge") window.ultraSelectPresetKind("challenge", true);
  if (tab === "splits" && typeof window.SplitPanelRefresh === "function") {
    window.SplitPanelRefresh();
  }
};

window.ultraSetSizeSetting = function ultraSetSizeSetting(sizeIndex) {
  if (sizeIndex == null || sizeIndex < 0) return;
  const sizeEl = document.getElementById("size");
  if (sizeEl && sizeEl.children[sizeIndex]) {
    try {
      sizeEl.children[sizeIndex].click();
    } catch (_e) {}
    try {
      sizeEl.style.left =
        sizeIndex === 0 ? "129.25px" : sizeIndex === 1 ? "91.5px" : "51.5px";
    } catch (_e2) {}
  }
  const g = window.__remixGame || window.megaWholeSnakeObject;
  if (g && g.settings) {
    if ("Sa" in g.settings) g.settings.Sa = sizeIndex;
    if ("Aa" in g.settings) g.settings.Aa = sizeIndex;
  }
};

window.ultraResetBoard = function ultraResetBoard() {
  const g = window.__remixGame || window.megaWholeSnakeObject;
  try {
    const fn = window.fullResetFuncName;
    if (g && fn && typeof g[fn] === "function") {
      try {
        if (g.menu) g.menu.visible = true;
      } catch (_m) {}
      g[fn]();
      try {
        if (g.menu) g.menu.visible = false;
      } catch (_m2) {}
      return;
    }
  } catch (_e) {}
  try {
    if (g && g.wa && typeof g.wa.reset === "function") g.wa.reset();
  } catch (_e2) {}
};

window.ultraHardResetBoard = function ultraHardResetBoard() {
  window.selectNewSizeSettingAndHardReset(null);
};

window.ultraInstallSizeReset = function ultraInstallSizeReset() {
  window.selectNewSizeSettingAndHardReset = function selectNewSizeSettingAndHardReset(
    newSizeSetting
  ) {
    if (newSizeSetting != null) window.ultraSetSizeSetting(newSizeSetting);
    window.ultraResetBoard();
  };
};

window.selectNewSizeSettingAndHardReset = function selectNewSizeSettingAndHardReset(
  newSizeSetting
) {
  if (newSizeSetting != null) window.ultraSetSizeSetting(newSizeSetting);
  window.ultraResetBoard();
};

window.ultraInstallBlitGuard = function ultraInstallBlitGuard() {
  if (typeof window.blitSelectedPreset !== "function") return;
  if (window.blitSelectedPreset.__ultra) return;
  const orig = window.blitSelectedPreset;
  window.blitSelectedPreset = function () {
    const presetEl = document.getElementsByClassName("chosen-preset")[0];
    if (presetEl && presetEl.classList.contains("preset-challenge")) {
      window.ultraSetSizeSetting(0);
    }
    if (presetEl && presetEl.tagName === "IMG") {
      const key = presetEl.getAttribute("data-ultra-pattern");
      if (
        key &&
        window.presetPatterns &&
        window.presetPatterns[key] &&
        !window.presetPatterns[presetEl.src]
      ) {
        window.presetPatterns[presetEl.src] = window.presetPatterns[key];
      }
    }
    const origAlert = window.alert;
    let tooSmall = false;
    window.alert = function (msg) {
      if (/too small/i.test(String(msg))) {
        tooSmall = true;
        return;
      }
      return origAlert.apply(this, arguments);
    };
    try {
      orig.apply(this, arguments);
    } finally {
      window.alert = origAlert;
    }
    if (tooSmall && !window.__ultraFixingSize) {
      window.__ultraFixingSize = true;
      window.ultraSetSizeSetting(0);
      window.ultraResetBoard();
      window.__ultraFixingSize = false;
    }
  };
  window.blitSelectedPreset.__ultra = true;
};

window.ultraScaleCustomCanvas = function ultraScaleCustomCanvas() {
  const mgr = window.customPresetManager;
  if (!mgr || mgr.__ultraScale) return;
  const orig = mgr.attemptPlace;
  mgr.attemptPlace = function (xPixelCoord, yPixelCoord, isErase) {
    const canvas = document.getElementById("custom-preset-canvas");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0) xPixelCoord *= this.canvasWidth / rect.width;
      if (rect.height > 0) yPixelCoord *= this.canvasHeight / rect.height;
    }
    return orig.call(this, xPixelCoord, yPixelCoord, isErase);
  };
  mgr.__ultraScale = true;
};

window.ultraDisableSpeedInfo = function ultraDisableSpeedInfo() {
  try {
    if (window.pudding_settings) window.pudding_settings.SpeedInfo = false;
  } catch (_e) {}
  try {
    if (typeof window.SpeedInfoHide === "function") window.SpeedInfoHide();
  } catch (_e2) {}
  const speed = document.getElementById("speedinfo-popup-pudding");
  if (speed) {
    speed.style.display = "none";
    speed.style.visibility = "hidden";
  }
  const cb = document.getElementById("AlwaysOnTimeKeeper");
  if (cb) {
    cb.checked = false;
    const wrap = cb.closest(".form-check") || cb.parentElement;
    if (wrap) {
      wrap.classList.add("ultra-hide");
      wrap.style.display = "none";
    }
  }
  const tab = document.getElementById("ultra-tab-speed");
  if (tab) tab.remove();
};

window.ultraMakeTab = function ultraMakeTab(id, label, onClick) {
  const b = document.createElement("button");
  b.type = "button";
  b.id = id;
  b.className = "ultra-tab";
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
};

window.ultraMoveInputDisplay = function ultraMoveInputDisplay() {
  const host = document.getElementsByClassName("sEOCsb")[0];
  if (!host) return;
  let slot = document.getElementById("ultra-input-slot");
  if (!slot) {
    slot = document.createElement("div");
    slot.id = "ultra-input-slot";
    host.appendChild(slot);
  }
  const section = document.getElementById("input-display-section");
  if (section && section.parentElement !== slot) {
    slot.appendChild(section);
  }
};

window.ultraInjectTabStrip = function ultraInjectTabStrip() {
  const host = document.getElementsByClassName("sEOCsb")[0];
  if (!host || document.getElementById("ultra-dock-tabs")) return;

  const right = document.createElement("div");
  right.id = "ultra-dock-tabs";
  right.style.cssText =
    "position:absolute;left:100%;top:0;z-index:10002;display:flex;gap:4px;white-space:nowrap;pointer-events:auto;";
  right.appendChild(
    window.ultraMakeTab("ultra-tab-place", "Place", function () {
      window.ultraOpenRight("place");
    })
  );
  right.appendChild(
    window.ultraMakeTab("ultra-tab-presets", "Presets", function () {
      window.ultraOpenRight("presets");
    })
  );
  right.appendChild(
    window.ultraMakeTab("ultra-tab-more", "More", function () {
      window.ultraOpenRight("more");
    })
  );
  host.appendChild(right);

  const left = document.createElement("div");
  left.id = "ultra-left-dock-tabs";
  left.style.cssText =
    "position:absolute;right:100%;top:0;z-index:10002;display:flex;gap:4px;white-space:nowrap;pointer-events:auto;";
  left.appendChild(
    window.ultraMakeTab("ultra-tab-custom", "Custom", function () {
      window.ultraOpenLeft("custom");
    })
  );
  left.appendChild(
    window.ultraMakeTab("ultra-tab-challenge", "Challenge", function () {
      window.ultraOpenLeft("challenge");
    })
  );
  left.appendChild(
    window.ultraMakeTab("ultra-tab-splits", "Splits", function () {
      window.ultraOpenLeft("splits");
    })
  );
  host.appendChild(left);
};

window.ultraSyncLeNav = function ultraSyncLeNav() {
  const toPreset = document.getElementById("link-to-preset");
  if (toPreset) toPreset.style.display = "none";
  const toPlace = document.getElementById("link-to-place");
  if (toPlace) toPlace.style.display = "none";

  Array.from(document.getElementsByClassName("preset-option")).forEach(
    function (el) {
      if (el.__ultraBound) return;
      el.addEventListener(
        "click",
        function (ev) {
          this.__ultraWasChosen = this.classList.contains("chosen-preset");
          if (this.tagName === "IMG" && !this.classList.contains("preset-none")) {
            ev.stopImmediatePropagation();
            window.ultraApplyImagePreset(this);
          }
        },
        true
      );
      el.addEventListener("click", function () {
        if (this.classList.contains("preset-custom")) {
          window.ultraSetRight("presets");
          window.ultraSetLeft("custom");
        } else if (this.classList.contains("preset-challenge")) {
          window.ultraSetRight("presets");
          window.ultraSetLeft("challenge");
        } else if (!this.classList.contains("preset-none")) {
          window.ultraSetLeft(null);
        }
        if (this.__ultraWasChosen && this.tagName !== "IMG") {
          window.ultraHardResetBoard();
        }
      });
      el.__ultraBound = true;
    }
  );

  const challengeLevel = document.getElementById("challenge-level");
  if (challengeLevel && !challengeLevel.__ultraBound) {
    challengeLevel.addEventListener("change", function () {
      window.ultraSetLeft("challenge");
    });
    challengeLevel.__ultraBound = true;
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "]") return;
    setTimeout(function () {
      const place = document.getElementById("place-panel");
      if (place && place.style.display === "grid") {
        window.ultraSetRight("place");
      } else if (document.getElementById("preset-panel")?.style.display === "grid") {
        window.ultraSetRight("presets");
      }
    }, 0);
  });
};

window.ultraWrapShowHide = function ultraWrapShowHide() {
  if (typeof window.SpeedInfoShow === "function" && !window.SpeedInfoShow.__ultra) {
    window.SpeedInfoShow = function () {
      if (window.pudding_settings) window.pudding_settings.SpeedInfo = false;
      const box = document.getElementById("speedinfo-popup-pudding");
      if (box) {
        box.style.display = "none";
        box.style.visibility = "hidden";
      }
    };
    window.SpeedInfoShow.__ultra = true;
  }
  if (typeof window.ToggleSpeedInfo === "function" && !window.ToggleSpeedInfo.__ultra) {
    window.ToggleSpeedInfo = function () {
      window.ultraDisableSpeedInfo();
    };
    window.ToggleSpeedInfo.__ultra = true;
  }
  if (typeof window.SpeedInfoHide === "function" && !window.SpeedInfoHide.__ultra) {
    const origHide = window.SpeedInfoHide;
    window.SpeedInfoHide = function () {
      origHide.apply(this, arguments);
      if (!window.__ultraApplying) window.ultraLayoutMenus();
    };
    window.SpeedInfoHide.__ultra = true;
  }
  if (typeof window.BootstrapShow === "function" && !window.BootstrapShow.__ultra) {
    const orig = window.BootstrapShow;
    window.BootstrapShow = function () {
      orig.apply(this, arguments);
      if (!window.__ultraApplying) window.ultraSetRight("more");
    };
    window.BootstrapShow.__ultra = true;
  }
  if (typeof window.BootstrapHide === "function" && !window.BootstrapHide.__ultra) {
    const orig = window.BootstrapHide;
    window.BootstrapHide = function () {
      orig.apply(this, arguments);
      if (!window.__ultraApplying && window.ultraDock.right === "more") {
        window.ultraSetRight(window.ultraDock.lastPlace || "place");
      } else if (!window.__ultraApplying) {
        window.ultraLayoutMenus();
      }
    };
    window.BootstrapHide.__ultra = true;
  }
  if (
    typeof window.PortalPairsPanelShow === "function" &&
    !window.PortalPairsPanelShow.__ultra
  ) {
    const orig = window.PortalPairsPanelShow;
    window.PortalPairsPanelShow = function () {
      orig.apply(this, arguments);
      window.ultraLayoutMenus();
    };
    window.PortalPairsPanelShow.__ultra = true;
  }
  if (
    typeof window.PortalPairsPanelHide === "function" &&
    !window.PortalPairsPanelHide.__ultra
  ) {
    const orig = window.PortalPairsPanelHide;
    window.PortalPairsPanelHide = function () {
      orig.apply(this, arguments);
      window.ultraLayoutMenus();
    };
    window.PortalPairsPanelHide.__ultra = true;
  }
  if (typeof window.editTimer === "function" && !window.editTimer.__ultraDock) {
    const orig = window.editTimer;
    window.editTimer = function () {
      orig.apply(this, arguments);
      window.ultraLayoutMenus();
    };
    window.editTimer.__ultraDock = true;
  }
  if (
    window.timeKeeper &&
    typeof window.timeKeeper.toggleDialog === "function" &&
    !window.timeKeeper.toggleDialog.__ultra
  ) {
    const orig = window.timeKeeper.toggleDialog;
    window.timeKeeper.toggleDialog = function () {
      orig.apply(this, arguments);
      window.ultraLayoutMenus();
    };
    window.timeKeeper.toggleDialog.__ultra = true;
  }

  if (
    typeof window.SplitPanelShow === "function" &&
    !window.SplitPanelShow.__ultra
  ) {
    const orig = window.SplitPanelShow;
    window.SplitPanelShow = function () {
      orig.apply(this, arguments);
      if (!window.__ultraApplying) window.ultraSetLeft("splits");
    };
    window.SplitPanelShow.__ultra = true;
  }
  if (
    typeof window.SplitPanelHide === "function" &&
    !window.SplitPanelHide.__ultra
  ) {
    const orig = window.SplitPanelHide;
    window.SplitPanelHide = function () {
      orig.apply(this, arguments);
      if (!window.__ultraApplying && window.ultraDock.left === "splits") {
        window.ultraSetLeft(null);
      } else if (!window.__ultraApplying) {
        window.ultraLayoutMenus();
      }
    };
    window.SplitPanelHide.__ultra = true;
  }
  if (typeof window.setTheme === "function" && !window.setTheme.__ultra) {
    const orig = window.setTheme;
    window.setTheme = function () {
      orig.apply(this, arguments);
      window.ultraApplyTheme();
    };
    window.setTheme.__ultra = true;
  }
  if (
    typeof window.toggle_input_display === "function" &&
    !window.toggle_input_display.__ultra
  ) {
    const orig = window.toggle_input_display;
    window.toggle_input_display = function () {
      orig.apply(this, arguments);
      window.ultraLayoutMenus();
    };
    window.toggle_input_display.__ultra = true;
  }

  const vis = document.getElementById("delete-stuff-popup");
  if (vis && !vis.__ultraObs) {
    const obs = new MutationObserver(function () {
      window.ultraLayoutMenus();
    });
    obs.observe(vis, { attributes: true, attributeFilter: ["hidden", "style"] });
    vis.__ultraObs = true;
  }
  const exp = document.getElementById("custom-export-dialogue-container");
  if (exp && !exp.__ultraObs) {
    const obs = new MutationObserver(function () {
      window.ultraLayoutMenus();
    });
    obs.observe(exp, { attributes: true, attributeFilter: ["style"] });
    exp.__ultraObs = true;
  }
};

window.ultraSetIndicator = function ultraSetIndicator() {
  const parent = document.getElementsByClassName("EjCLSb")[0];
  if (!parent) return;
  for (const el of [...parent.querySelectorAll("div")]) {
    const t = (el.textContent || "").trim();
    if (t === "Remix Mod" || t === "Level Editor Mod" || t === "Remix Ultra") {
      el.remove();
    }
  }
  const canvasNode = document.getElementsByClassName("jNB0Ic")[0];
  const modIndicator = document.createElement("div");
  modIndicator.id = "remix-ultra-indicator";
  modIndicator.style =
    "position:absolute;font-family:Arial,sans-serif;color:white;font-size:14px;padding-top:4px;padding-left:30px;user-select: none;";
  modIndicator.textContent = "Remix Ultra";
  if (canvasNode) parent.insertBefore(modIndicator, canvasNode);
  else parent.appendChild(modIndicator);
};

window.ultraAppleManager = function ultraAppleManager() {
  const game = window.__remixGame || window.megaWholeSnakeObject;
  if (game && game.wa && Array.isArray(game.wa.ka)) return game.wa;
  if (window.wholeSnakeObject && window.wholeSnakeObject.wa && Array.isArray(window.wholeSnakeObject.wa.ka)) {
    return window.wholeSnakeObject.wa;
  }
  return null;
};

window.ultraAssignNewApples = function ultraAssignNewApples(added) {
  const mgr = window.ultraAppleManager();
  if (!mgr || !mgr.ka || !added || added <= 0) return;
  window.appleArray = mgr.ka;
  if (window.isChessActive && window.isChessActive() && typeof window.chess_convert_new_apples === "function") {
    window.chess_convert_new_apples(mgr, added);
  }
  if (window.isBurgerActive && window.isBurgerActive() && typeof window.burger_assign_timer === "function") {
    for (let i = mgr.ka.length - added; i < mgr.ka.length; i++) {
      if (mgr.ka[i] && !mgr.ka[i].nla) window.burger_assign_timer(mgr.ka[i]);
    }
  }
};

window.ultraAssignAllBoardApples = function ultraAssignAllBoardApples() {
  const mgr = window.ultraAppleManager();
  if (!mgr || !mgr.ka) return;
  window.appleArray = mgr.ka;
  if (
    window.isChessActive &&
    window.isChessActive() &&
    typeof window.chess_assign_piece === "function"
  ) {
    let converted = 0;
    let first = -1;
    for (let i = 0; i < mgr.ka.length; i++) {
      const a = mgr.ka[i];
      if (!a || a.isPiece || a.nla) continue;
      window.chess_assign_piece(a);
      converted++;
      if (first < 0) first = i;
    }
    if (
      converted > 0 &&
      typeof window.chess_sanitize_spawns === "function"
    ) {
      const freePos =
        window.__remixGame && typeof window.__remixGame.Tb === "function"
          ? function (board, excl, radius) {
              return window.__remixGame.Tb(excl, radius);
            }
          : null;
      window.chess_sanitize_spawns(mgr, freePos, first);
    }
  }
  if (
    window.isBurgerActive &&
    window.isBurgerActive() &&
    typeof window.burger_assign_timer === "function"
  ) {
    for (let i = 0; i < mgr.ka.length; i++) {
      const a = mgr.ka[i];
      if (a && !a.nla && a.burgerTimer == null) {
        window.burger_assign_timer(a);
      }
    }
  }
};

window.ultraSetupGameplayHooks = function ultraSetupGameplayHooks() {
  if (typeof window.placeApple === "function" && !window.placeApple.__ultra) {
    const orig = window.placeApple;
    window.placeApple = function () {
      const mgr = window.ultraAppleManager();
      const before = mgr && mgr.ka ? mgr.ka.length : 0;
      orig.apply(this, arguments);
      const after = mgr && mgr.ka ? mgr.ka.length : 0;
      const added = after - before;
      if (added > 0) window.ultraAssignNewApples(added);
    };
    window.placeApple.__ultra = true;
  }

  if (window.simpleHookManager && typeof window.simpleHookManager.registerHook === "function") {
    window.simpleHookManager.registerHook(
      "afterResetBoard",
      "ultraChessBurgerApples",
      window.ultraAssignAllBoardApples
    );
  }

  if (
    window.timeKeeper &&
    typeof window.timeKeeper.shouldTrack === "function" &&
    !window.timeKeeper.shouldTrack.__ultra
  ) {
    const origShouldTrack = window.timeKeeper.shouldTrack;
    window.timeKeeper.shouldTrack = function ultraShouldTrack(ctx) {
      if (window.ultraChallengeOrHamActive()) return false;
      if (window.daily_challenge) return false;
      const c =
        ctx ||
        (typeof window.timeKeeper.resolveRunContext === "function"
          ? window.timeKeeper.resolveRunContext()
          : null);
      if (!c) return origShouldTrack.call(this, ctx);
      // LE always assigns megaWholeSnakeObject; do not treat that as MouseMode.
      if (c.count > 6 || c.speed > 2 || c.size > 2) return false;
      if (
        window.remixChessBurgerTimeKeeperActive &&
        window.remixChessBurgerTimeKeeperActive()
      ) {
        return window.remixTimeKeeperOfficialSettings
          ? window.remixTimeKeeperOfficialSettings(ctx)
          : origShouldTrack.call(this, ctx);
      }
      return true;
    };
    window.timeKeeper.shouldTrack.__ultra = true;
  }
};

window.ultraSettingsWrap = function ultraSettingsWrap(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  return el.closest(".form-check") || el;
};

window.ultraHideSettingsNode = function ultraHideSettingsNode(el, bin) {
  if (!el) return;
  el.classList.add("ultra-hide");
  el.style.display = "none";
  if (bin && el.parentElement !== bin) bin.appendChild(el);
};

window.ultraPresetDataUri = function ultraPresetDataUri(url) {
  if (!url || !window.ULTRA_PRESET_PNG) return url;
  if (String(url).indexOf("data:image/png") === 0) return url;
  const keys = Object.keys(window.ULTRA_PRESET_PNG);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (url === key || url.endsWith("/" + key) || url.endsWith(key)) {
      return window.ULTRA_PRESET_PNG[key];
    }
  }
  return url;
};

window.ultraExtractPresetPixels = function ultraExtractPresetPixels(img) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;
  const pixelList = [];
  for (let i = 0; i < data.length; i += 4) {
    const hex = window.rgbToHex(data[i], data[i + 1], data[i + 2]);
    const details = window.hexToPixelDetails(hex);
    pixelList.push({
      x: (i / 4) % w,
      y: Math.floor(i / 4 / w),
      hex: hex,
      category: details.category,
      type: details.type,
    });
  }
  return pixelList;
};

window.ultraPresetSizeIndex = function ultraPresetSizeIndex(el) {
  const w = el.naturalWidth;
  if (w === 17) return 0;
  if (w === 10) return 1;
  if (w === 24) return 2;
  const key = el.getAttribute("data-ultra-pattern");
  const pat = key && window.presetPatterns && window.presetPatterns[key];
  if (pat && pat.pixelList && pat.pixelList.length) {
    let maxX = 0;
    for (let i = 0; i < pat.pixelList.length; i++) {
      if (pat.pixelList[i].x > maxX) maxX = pat.pixelList[i].x;
    }
    const width = maxX + 1;
    if (width <= 10) return 1;
    if (width <= 17) return 0;
    return 2;
  }
  return 0;
};

window.ultraApplyImagePreset = function ultraApplyImagePreset(el) {
  const panel = document.getElementById("preset-panel");
  if (!panel || !el) return;
  Array.from(panel.children).forEach(function (c) {
    c.classList.remove("chosen-preset");
  });
  el.classList.add("chosen-preset");
  const key = el.getAttribute("data-ultra-pattern");
  if (key && window.presetPatterns && window.presetPatterns[key]) {
    window.presetPatterns[el.src] = window.presetPatterns[key];
  }
  window.ultraSetLeft(null);
  window.selectNewSizeSettingAndHardReset(window.ultraPresetSizeIndex(el));
};

window.ultraPatchPresetLoads = function ultraPatchPresetLoads() {
  window.setPixelData = function (target, url, callback) {
    url = window.ultraPresetDataUri(url);
    target.complete = false;
    const img = new Image();
    let ran = false;
    function done() {
      if (ran) return;
      ran = true;
      try {
        target.pixelList = window.ultraExtractPresetPixels(img);
        target.complete = true;
        if (typeof callback === "function") callback();
      } catch (e) {
        console.error("RemixUltra: preset decode failed", e);
      }
    }
    img.onload = done;
    img.onerror = function () {
      console.error("RemixUltra: preset image error");
    };
    img.src = url;
    if (img.complete && img.naturalWidth) done();
  };
  window.setPixelData.__ultra = true;
};

window.ULTRA_HAM_W = 10;
window.ULTRA_HAM_H = 9;
window.ULTRA_HAM_MIDDLE = { x: 7, y: 4 };

// Vanilla 10-apple start in spawn-relative coords (same offsets the game
// passes to makeApple). On small, (4,0) is off the board and (-5,0) sits
// on the snake's head; those are dropped when converting to tiles.
window.ULTRA_TEN_APPLE_VANILLA = [
  [-5, -4],
  [-2, -4],
  [1, -4],
  [-5, 0],
  [-2, 0],
  [1, 0],
  [-5, 4],
  [-2, 4],
  [1, 4],
  [4, 0],
];

window.ultraHamOffset = function ultraHamOffset() {
  try {
    if (typeof window.getAppleSpawnPointOffset === "function") {
      const off = window.getAppleSpawnPointOffset();
      if (off && typeof off.x === "number") return off;
    }
  } catch (_e) {}
  return { x: -7, y: -4 };
};

window.ultraVanillaToHamBoard = function ultraVanillaToHamBoard(vx, vy) {
  const off = window.ultraHamOffset();
  return { x: vx - off.x, y: vy - off.y };
};

window.ultraHamKey = function ultraHamKey(x, y) {
  return x + "," + y;
};

window.ultraHamInBounds = function ultraHamInBounds(x, y) {
  return x >= 0 && y >= 0 && x < window.ULTRA_HAM_W && y < window.ULTRA_HAM_H;
};

window.ultraHamSnakeBoardCells = function ultraHamSnakeBoardCells() {
  const off = window.ultraHamOffset();
  const fallback = [
    { x: 2, y: 4 },
    { x: 1, y: 4 },
    { x: 0, y: 4 },
    { x: -1, y: 4 },
  ];
  try {
    const g = window.__remixGame || window.megaWholeSnakeObject;
    const segs = g && g.oa && g.oa.ka;
    if (!Array.isArray(segs) || !segs.length) return fallback;
    const raw = segs.map(function (s) {
      return { x: s.x, y: s.y };
    });
    const h = raw[0];
    if (h.x < 0 || h.x >= window.ULTRA_HAM_W || h.y < 0 || h.y >= window.ULTRA_HAM_H) {
      return raw.map(function (s) {
        return { x: s.x - off.x, y: s.y - off.y };
      });
    }
    return raw;
  } catch (_e) {
    return fallback;
  }
};

window.ultraHamBlockedSet = function ultraHamBlockedSet(walls) {
  const set = Object.create(null);
  if (walls) {
    for (let i = 0; i < walls.length; i++) {
      set[window.ultraHamKey(walls[i].x, walls[i].y)] = true;
    }
  }
  const snake = window.ultraHamSnakeBoardCells();
  for (let i = 0; i < snake.length; i++) {
    set[window.ultraHamKey(snake[i].x, snake[i].y)] = true;
  }
  return set;
};

window.ultraHamIsFree = function ultraHamIsFree(x, y, blocked) {
  return window.ultraHamInBounds(x, y) && !blocked[window.ultraHamKey(x, y)];
};

window.ultraHamNearestFree = function ultraHamNearestFree(tx, ty, blocked) {
  if (window.ultraHamIsFree(tx, ty, blocked)) return { x: tx, y: ty };
  let best = null;
  let bestD = 1e9;
  for (let y = 0; y < window.ULTRA_HAM_H; y++) {
    for (let x = 0; x < window.ULTRA_HAM_W; x++) {
      if (!window.ultraHamIsFree(x, y, blocked)) continue;
      const d = (x - tx) * (x - tx) + (y - ty) * (y - ty);
      if (d < bestD) {
        bestD = d;
        best = { x: x, y: y };
      }
    }
  }
  return best;
};

window.ultraHamCountIndex = function ultraHamCountIndex() {
  try {
    const g = window.__remixGame;
    if (g && g.settings && typeof g.settings.ka === "number") return g.settings.ka;
    if (window.timeKeeper && typeof window.timeKeeper.getCurrentSetting === "function") {
      const c = window.timeKeeper.getCurrentSetting("count");
      if (typeof c === "number") return c;
    }
  } catch (_e) {}
  return 0;
};

window.ultraHamWantSingleApple = function ultraHamWantSingleApple(count) {
  if (count === 0 || count === 4 || count === 5) return true;
  if (typeof window.remixIsColoredDice === "function" && window.remixIsColoredDice(count)) {
    return true;
  }
  if (
    count === window.BLUE_DICE_COUNT ||
    count === window.GREEN_DICE_COUNT ||
    count === window.BLACK_DICE_COUNT
  ) {
    return true;
  }
  return false;
};

window.ultraTenAppleBoardCoords = function ultraTenAppleBoardCoords() {
  const pts = window.ULTRA_TEN_APPLE_VANILLA;
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    out.push(window.ultraVanillaToHamBoard(pts[i][0], pts[i][1]));
  }
  return out;
};

window.ultraNativeAppleBoardCoords = function ultraNativeAppleBoardCoords() {
  const off = window.ultraHamOffset();
  const pts = [];
  try {
    const g = window.__remixGame;
    const apples = (g && g.wa && g.wa.ka) || window.appleArray || [];
    for (let i = 0; i < apples.length; i++) {
      const p = apples[i] && apples[i].pos;
      if (!p || typeof p.x !== "number") continue;
      pts.push({ x: p.x, y: p.y });
    }
  } catch (_e) {}
  if (!pts.length) return [];
  let spawnRel = false;
  for (let i = 0; i < pts.length; i++) {
    if (pts[i].x < 0 || pts[i].y < 0) {
      spawnRel = true;
      break;
    }
  }
  if (spawnRel) {
    return pts.map(function (p) {
      return { x: p.x - off.x, y: p.y - off.y };
    });
  }
  return pts;
};

window.ultraHamFilterCoords = function ultraHamFilterCoords(coords, blocked) {
  const out = [];
  const seen = Object.create(null);
  if (!coords) return out;
  for (let i = 0; i < coords.length; i++) {
    const x = coords[i].x;
    const y = coords[i].y;
    if (!window.ultraHamIsFree(x, y, blocked)) continue;
    const k = window.ultraHamKey(x, y);
    if (seen[k]) continue;
    seen[k] = true;
    out.push({ x: x, y: y });
  }
  return out;
};

window.ultraHamClosestToSnake = function ultraHamClosestToSnake(coords, n, blocked) {
  const snake = window.ultraHamSnakeBoardCells();
  const head = snake[0] || { x: 2, y: 4 };
  const free = window.ultraHamFilterCoords(coords, blocked);
  free.sort(function (a, b) {
    const da = (a.x - head.x) * (a.x - head.x) + (a.y - head.y) * (a.y - head.y);
    const db = (b.x - head.x) * (b.x - head.x) + (b.y - head.y) * (b.y - head.y);
    return da - db || a.y - b.y || a.x - b.x;
  });
  return free.slice(0, n);
};

window.ultraHamPlaceCount = function ultraHamPlaceCount(intended, blocked, want) {
  const occ = Object.assign(Object.create(null), blocked);
  const out = [];
  const src = intended ? intended.slice() : [];
  for (let i = 0; i < src.length && out.length < want; i++) {
    const p = src[i];
    const at = window.ultraHamNearestFree(p.x, p.y, occ);
    if (!at) continue;
    occ[window.ultraHamKey(at.x, at.y)] = true;
    out.push(at);
  }
  if (out.length < want) {
    const mid = window.ULTRA_HAM_MIDDLE;
    const extras = [];
    for (let y = 0; y < window.ULTRA_HAM_H; y++) {
      for (let x = 0; x < window.ULTRA_HAM_W; x++) {
        if (window.ultraHamIsFree(x, y, occ)) extras.push({ x: x, y: y });
      }
    }
    extras.sort(function (a, b) {
      const da = (a.x - mid.x) * (a.x - mid.x) + (a.y - mid.y) * (a.y - mid.y);
      const db = (b.x - mid.x) * (b.x - mid.x) + (b.y - mid.y) * (b.y - mid.y);
      return da - db || a.y - b.y || a.x - b.x;
    });
    for (let i = 0; i < extras.length && out.length < want; i++) {
      const p = extras[i];
      occ[window.ultraHamKey(p.x, p.y)] = true;
      out.push(p);
    }
  }
  return out;
};

window.ultraHamAppleCoords = function ultraHamAppleCoords(walls) {
  const blocked = window.ultraHamBlockedSet(walls);
  const count = window.ultraHamCountIndex();
  const ten = window.ultraTenAppleBoardCoords();
  const native = window.ultraNativeAppleBoardCoords();
  const mid = window.ULTRA_HAM_MIDDLE;

  if (window.ultraHamWantSingleApple(count)) {
    const at = window.ultraHamNearestFree(mid.x, mid.y, blocked);
    return at ? [at] : [];
  }

  if (count === 1) {
    let picked = window.ultraHamClosestToSnake(ten, 3, blocked);
    if (picked.length < 3) {
      const extra = [];
      for (let y = 0; y < window.ULTRA_HAM_H; y++) {
        for (let x = 0; x < window.ULTRA_HAM_W; x++) extra.push({ x: x, y: y });
      }
      picked = window.ultraHamClosestToSnake(extra, 3, blocked);
    }
    return picked;
  }

  if (count === 2) {
    const five = [
      [-5, -4],
      [1, -4],
      [-2, 0],
      [-5, 4],
      [1, 4],
    ].map(function (p) {
      return window.ultraVanillaToHamBoard(p[0], p[1]);
    });
    return window.ultraHamFilterCoords(five, blocked);
  }

  if (count === 3) {
    const intended = [];
    const seen = Object.create(null);
    function addIntended(list) {
      if (!list) return;
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        const k = window.ultraHamKey(p.x, p.y);
        if (seen[k]) continue;
        seen[k] = true;
        intended.push({ x: p.x, y: p.y });
      }
    }
    addIntended(native);
    addIntended(ten);
    return window.ultraHamPlaceCount(intended, blocked, 10);
  }

  return window.ultraHamFilterCoords(native.length ? native : ten, blocked);
};

window.ultraPatchLevelLoads = function ultraPatchLevelLoads() {
  const mgr = window.otherPresetmanager;
  if (!mgr || mgr.__ultra) return;
  if (window.ULTRA_CHALLENGE_TXT) {
    mgr.challengeLevelCodes = String(window.ULTRA_CHALLENGE_TXT)
      .split(/\r?\n/)
      .filter(function (line) {
        return line.trim().length > 0;
      });
    mgr.isChallengeLoaded = mgr.challengeLevelCodes.length > 0;
  }
  if (window.ULTRA_HAM_TXT) {
    mgr.hamLevelCodes = String(window.ULTRA_HAM_TXT).split(/\r?\n/);
    mgr.isHamsLoaded = mgr.hamLevelCodes.length > 0;
  }
  const origGet = mgr.getChallengePixelList;
  mgr.getChallengePixelList = function () {
    this.challengelevel = Number(this.challengelevel) || 1;
    return origGet.call(this);
  };
  mgr.loadChallenge = function () {};
  mgr.loadRandomHams = function () {};
  mgr.getRandomHamPixelList = function () {
    if (!this.isHamsLoaded || !this.hamLevelCodes || !this.hamLevelCodes.length) {
      return [];
    }
    const chosen =
      this.hamLevelCodes[Math.floor(Math.random() * this.hamLevelCodes.length)];
    const decoded = window.customPresetManager.getPixelListFromLevelCode(chosen);
    const walls = decoded.filter(function (e) {
      return e.category === "wall";
    });
    const apples = window.ultraHamAppleCoords(walls);
    for (let i = 0; i < apples.length; i++) {
      walls.push({
        x: apples[i].x,
        y: apples[i].y,
        category: "apple",
        type: 0,
      });
    }
    return walls;
  };
  mgr.__ultra = true;
};

window.ultraFixPresetImages = function ultraFixPresetImages() {
  document.querySelectorAll("#preset-panel img.preset-option").forEach(function (img) {
    const src = img.getAttribute("src") || img.src || "";
    const key = src.replace(window.rootUrl || "", "");
    if (key) img.setAttribute("data-ultra-pattern", key);
    const uri = window.ultraPresetDataUri(src);
    if (!uri || uri === src) return;
    if (window.presetPatterns && key && window.presetPatterns[key]) {
      window.presetPatterns[uri] = window.presetPatterns[key];
    }
    img.src = uri;
  });
};

window.ultraShowSettingsPage = function ultraShowSettingsPage(id) {
  window.__ultraSettingsPage = id;
  ["play", "stats", "setup"].forEach(function (pageId) {
    const page = document.getElementById("ultra-settings-page-" + pageId);
    const tab = document.getElementById("ultra-settings-tab-" + pageId);
    if (page) page.classList.toggle("ultra-page-on", pageId === id);
    if (tab) tab.classList.toggle("ultra-tab-on", pageId === id);
  });
};

window.ultraOrganizeSettings = function ultraOrganizeSettings() {
  const root = document.getElementById("settings-popup-pudding");
  if (!root) return;

  if (typeof window.remixInjectBlackDiceSettingsUi === "function") {
    window.remixInjectBlackDiceSettingsUi();
  }

  let bin = document.getElementById("ultra-settings-hidden");
  if (!bin) {
    bin = document.createElement("div");
    bin.id = "ultra-settings-hidden";
    bin.className = "ultra-hide";
    root.appendChild(bin);
  }

  window.ultraHideSettingsNode(window.ultraSettingsWrap("AlwaysOnTimeKeeper"), bin);
  window.ultraHideSettingsNode(window.ultraSettingsWrap("ShowSplitPanel"), bin);
  window.ultraHideSettingsNode(window.ultraSettingsWrap("RemoveScrollbar"), bin);
  window.ultraHideSettingsNode(document.getElementById("ScrollLeftBtn"), bin);
  window.ultraHideSettingsNode(document.getElementById("settings-close"), bin);
  window.ultraHideSettingsNode(document.getElementById("snakePride"), bin);
  Array.from(root.querySelectorAll(":scope > br")).forEach(function (el) {
    window.ultraHideSettingsNode(el, bin);
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
      ["stats", "Stats"],
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
        window.ultraShowSettingsPage(pair[0]);
      });
      pager.appendChild(btn);
    });
  }

  const play = document.getElementById("ultra-settings-page-play");
  const stats = document.getElementById("ultra-settings-page-stats");
  const setup = document.getElementById("ultra-settings-page-setup");
  if (!play || !stats || !setup) return;

  [
    "SkullPoisonFruit",
    "DistinctSokoGoals",
    "InputDisplay",
    "TopBarIcons",
    "EatThemeRandomizer",
    "DisableRandom",
  ].forEach(function (id) {
    const el = window.ultraSettingsWrap(id);
    if (el && el.parentElement !== play) play.appendChild(el);
  });
  ["stat-chooser", "edit-stat", "reset-stats"].forEach(function (id) {
    const el = document.getElementById(id);
    if (el && el.parentElement !== stats) stats.appendChild(el);
  });
  [
    "SaveGameSettings",
    "TimerSettings",
    "ResetKeybind",
    "CustomBowlFruits",
    "black-dice-settings",
  ].forEach(function (id) {
    const el = window.ultraSettingsWrap(id) || document.getElementById(id);
    if (el && el.parentElement !== setup) setup.appendChild(el);
  });

  window.ultraShowSettingsPage(window.__ultraSettingsPage || "play");
};

window.ultraSetupLayout = function ultraSetupLayout() {
  const vis = document.getElementById("delete-stuff-popup");
  if (vis && !vis.hasAttribute("hidden")) vis.hidden = true;
  window.ultraInjectThemeCss();
  window.ultraInjectTabStrip();
  window.ultraMoveInputDisplay();
  window.ultraSyncLeNav();
  window.ultraWrapShowHide();
  window.ultraDisableSpeedInfo();
  window.ultraOrganizeSettings();
  window.ultraFixPresetImages();
  window.ultraInstallSizeReset();
  window.ultraInstallBlitGuard();
  window.ultraScaleCustomCanvas();
  window.ultraApplyTheme();
  window.ultraDock.right = window.ultraDefaultRightTab();
  if (window.ultraDock.right === "place" || window.ultraDock.right === "presets") {
    window.ultraDock.lastPlace = window.ultraDock.right;
  }
  if (window.pudding_settings && window.pudding_settings.SplitPanel) {
    window.ultraDock.left = "splits";
  }
  window.__ultraLayoutReady = true;
  window.ultraLayoutMenus();
};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.RemixUltraMod.runCodeBefore = function () {
  window.__remixCore.runCodeBefore();
  window.levelEditorMod.runCodeBefore();
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.ultraMatchWallContainer = function ultraMatchWallContainer(text) {
  const pats = [
    /&&\s*\(\s*([$a-zA-Z0-9_]{1,8})\(\s*this\.([$a-zA-Z0-9_]{1,8})\s*,\s*[$a-zA-Z0-9_]{1,8}\s*\)\s*,\s*[$a-zA-Z0-9_]{1,8}\(\s*this\.[$a-zA-Z0-9_]{1,8}\s*,\s*7\s*\)/,
    /&&\s*\(\s*([$a-zA-Z0-9_]{1,8})\(\s*this\.([$a-zA-Z0-9_]{1,8})\s*,\s*[$a-zA-Z0-9_]{1,8}\s*\)\s*&&\s*[$a-zA-Z0-9_]{1,8}\(\s*this\.[$a-zA-Z0-9_]{1,8}\s*,\s*7\s*\)/,
    /([$a-zA-Z0-9_]{1,8})\(\s*this\.([$a-zA-Z0-9_]{1,8})\s*,\s*[$a-zA-Z0-9_]{1,8}\s*\)\s*,\s*[$a-zA-Z0-9_]{1,8}\(\s*this\.[$a-zA-Z0-9_]{1,8}\s*,\s*7\s*\)/,
  ];
  const needles = [",7)", ", 7)", ",7 )"];
  for (let n = 0; n < needles.length; n++) {
    let from = 0;
    while (from < text.length) {
      const i = text.indexOf(needles[n], from);
      if (i < 0) break;
      const start = Math.max(0, i - 160);
      const slice = text.slice(start, i + 8);
      for (let p = 0; p < pats.length; p++) {
        const m = slice.match(pats[p]);
        if (m) {
          const out = [m[0], m[2]];
          out.index = start + slice.indexOf(m[0]);
          out.input = text;
          return out;
        }
      }
      from = i + 2;
    }
  }
  return null;
};

window.ultraQuietFinderLogs = function ultraQuietFinderLogs(fn) {
  const origLog = console.log;
  const origError = console.error;

  function isFinderNoise(args) {
    const parts = [];
    for (let i = 0; i < (args ? args.length : 0); i++) {
      parts.push(String(args[i] == null ? "" : args[i]));
    }
    return parts.join(" ").indexOf("Couldn't find a match for somethingInsideFunction") !== -1;
  }

  console.log = function () {
    if (isFinderNoise(arguments)) return;
    return origLog.apply(console, arguments);
  };
  console.error = function () {
    if (isFinderNoise(arguments)) return;
    return origError.apply(console, arguments);
  };
  try {
    return fn();
  } finally {
    console.log = origLog;
    console.error = origError;
  }
};

window.ultraWithLeRegexFallbacks = function ultraWithLeRegexFallbacks(fn) {
  const origFind = window.findFunctionInCode;
  const origAssert = window.assertReplace;
  const origError = console.error;
  const origLog = console.log;
  const origProto =
    String.prototype.assertReplace && String.prototype.assertReplace.__ultra
      ? null
      : String.prototype.assertReplace;

  function spacedEquals(re) {
    if (!(re instanceof RegExp)) return re;
    return new RegExp(re.source.replace(/=/g, "\\s*=\\s*"), re.flags);
  }

  function isExpectedLeMiss(args) {
    const parts = [];
    for (let i = 0; i < (args ? args.length : 0); i++) {
      parts.push(String(args[i] == null ? "" : args[i]));
    }
    return parts.join(" ").indexOf("Couldn't find a match for somethingInsideFunction") !== -1;
  }

  // Loader uses console.log('%c...somethingInsideFunction', 'color:red'), not console.error.
  console.log = function () {
    if (isExpectedLeMiss(arguments)) return;
    return origLog.apply(console, arguments);
  };
  console.error = function () {
    if (isExpectedLeMiss(arguments)) return;
    return origError.apply(console, arguments);
  };

  if (typeof origFind === "function") {
    window.findFunctionInCode = function (src, sig, inside, logging) {
      try {
        return origFind.apply(this, arguments);
      } catch (e) {
        const insides = inside instanceof RegExp ? [inside] : [];
        const sigs = [sig];
        if (inside instanceof RegExp) {
          insides.push(
            new RegExp(inside.source.replace(/=/g, "\\s*=\\s*"), inside.flags)
          );
          insides.push(
            new RegExp(
              inside.source.replace(/:/g, ":\\s*").replace(/=/g, "\\s*=\\s*"),
              inside.flags
            )
          );
          if (/case 1/.test(inside.source)) {
            insides.push(/case 1:\s*a\s*=\s*\.66/);
          }
          if (/case "apple"/.test(inside.source)) {
            insides.push(/case "apple":/);
          }
          if (/isVisible/.test(inside.source)) {
            insides.push(
              /isVisible\(\)\|\|this\.[$a-zA-Z0-9_]{0,8}\.[$a-zA-Z0-9_]{0,8}/
            );
          }
        }
        if (sig instanceof RegExp) {
          if (/d=-1/.test(sig.source)) {
            sigs.push(/[$a-zA-Z0-9_]{0,8}=function\(a,b,c,d=-1\)/);
            sigs.push(/[$a-zA-Z0-9_]{0,8}=function\(a,b,c,d\s*=\s*-1\)/);
            sigs.push(/[$a-zA-Z0-9_]{0,8}=function\(a,b,c,d\)/);
          }
          if (/\\(\\)\\\{/.test(sig.source) || /\(\)\\\{/.test(sig.source)) {
            sigs.push(/[$a-zA-Z0-9_]{0,8}\(\)\{/);
          }
        }
        for (let s = 0; s < sigs.length; s++) {
          for (let i = 0; i < insides.length; i++) {
            try {
              return origFind.call(this, src, sigs[s], insides[i], logging);
            } catch (_e2) {}
          }
        }
        throw e;
      }
    };
  }

  if (typeof origAssert === "function") {
    window.assertReplace = function (base, regex, replacement) {
      try {
        return origAssert.apply(this, arguments);
      } catch (e) {
        if (regex instanceof RegExp) {
          const flexes = [
            spacedEquals(regex),
            new RegExp(
              regex.source.replace(/:/g, ":\\s*").replace(/=/g, "\\s*=\\s*"),
              regex.flags
            ),
          ];
          for (let i = 0; i < flexes.length; i++) {
            try {
              return origAssert.call(this, base, flexes[i], replacement);
            } catch (_e2) {}
          }
          if (/odF|WIN\\.play|leftBorderWidth|\\$d/.test(regex.source)) {
            return base;
          }
        }
        throw e;
      }
    };
  }

  if (typeof origProto === "function") {
    String.prototype.assertReplace = function (regex, replacement) {
      try {
        return origProto.call(this, regex, replacement);
      } catch (e) {
        if (regex instanceof RegExp) {
          const flexes = [
            spacedEquals(regex),
            new RegExp(
              regex.source.replace(/:/g, ":\\s*").replace(/=/g, "\\s*=\\s*"),
              regex.flags
            ),
          ];
          for (let i = 0; i < flexes.length; i++) {
            try {
              return origProto.call(this, flexes[i], replacement);
            } catch (_e2) {}
          }
          if (/odF|WIN\\.play|leftBorderWidth|\\$d/.test(regex.source)) {
            return String(this);
          }
        }
        throw e;
      }
    };
  }

  const origMatch = String.prototype.assertMatch;
  if (typeof origMatch === "function") {
    String.prototype.assertMatch = function (regex) {
      try {
        return origMatch.call(this, regex);
      } catch (e) {
        if (regex instanceof RegExp) {
          const tries = [
            spacedEquals(regex),
            new RegExp(regex.source.replace(/\\n\?/g, "\\s*"), regex.flags),
            new RegExp(
              regex.source.replace(/,/g, ",\\s*").replace(/=/g, "\\s*=\\s*"),
              regex.flags
            ),
            new RegExp(
              regex.source
                .replace(/\\n\?/g, "\\s*")
                .replace(/&&/g, "\\s*&&\\s*")
                .replace(/,/g, ",\\s*"),
              regex.flags
            ),
          ];
          const text = String(this);
          if (/,7/.test(regex.source)) {
            const wall = window.ultraMatchWallContainer(text);
            if (wall) return wall;
          }
          for (let i = 0; i < tries.length; i++) {
            try {
              const m = text.match(tries[i]);
              if (m) return m;
            } catch (_badRe) {}
          }
        }
        throw e;
      }
    };
  }

  try {
    return fn();
  } finally {
    console.log = origLog;
    console.error = origError;
    if (origFind) window.findFunctionInCode = origFind;
    if (origAssert) window.assertReplace = origAssert;
    if (origProto) String.prototype.assertReplace = origProto;
    if (origMatch) String.prototype.assertMatch = origMatch;
  }
};

window.RemixUltraMod.alterSnakeCode = function (code) {
  return window.ultraQuietFinderLogs(function () {
    code = window.remixBaseAlterSnakeCode(code);
    // Apply Cat before LE so the tick/reset speed cases exist even if LE
    // rewrites reset(). Re-apply after LE in case that rewrite dropped them.
    code = window.CatSpeed.alterSnakeCode(code);
    try {
      code = window.ultraWithLeRegexFallbacks(function () {
        return window.levelEditorMod.alterSnakeCode(code);
      });
    } catch (e) {
      console.error("RemixUltraMod: Level Editor alterSnakeCode failed", e);
    }
    code = window.CandyMod.alterSnakeCode(code);
    code = window.ChessMod.alterSnakeCode(code);
    code = window.BurgerMod.alterSnakeCode(code);
    code = window.CatSpeed.alterSnakeCode(code);
    code = window.DiceCounts.alterSnakeCode(code);
    code = window.RemixSpeedInfo.alterSnakeCode(code);
    return code;
  });
};

////////////////////////////////////////////////////////////////////
//RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.RemixUltraMod.runCodeAfter = function () {
  window.CandyMod.runCodeAfter && window.CandyMod.runCodeAfter();
  window.ChessMod.runCodeAfter && window.ChessMod.runCodeAfter();
  window.BurgerMod.runCodeAfter && window.BurgerMod.runCodeAfter();
  window.DiceCounts &&
    window.DiceCounts.runCodeAfter &&
    window.DiceCounts.runCodeAfter();
  window.RemixSpeedInfo.runCodeAfter && window.RemixSpeedInfo.runCodeAfter();

  window.ultraPatchPresetLoads();
  window.ultraPatchLevelLoads();
  window.levelEditorMod.runCodeAfter();
  window.ultraPatchLevelLoads();
  window.ultraFixPresetImages();

  window.ultraSetIndicator();
  window.ultraSetupLayout();
  window.ultraSetupGameplayHooks();
};

// Custom URL often keeps customModName as RemixMod. Alias so either name
// runs the Ultra chain. Inner Remix methods live on window.__remixCore.
window.RemixMod = window.RemixUltraMod;
