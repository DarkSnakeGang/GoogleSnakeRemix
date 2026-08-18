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
  background: #1155CC;
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
#stat-chooser {
  width: 100% !important;
  box-sizing: border-box;
  display: block !important;
  margin: 4px 0 8px !important;
}
#black-dice-settings {
  margin: 8px 0 0 !important;
  padding: 6px 8px !important;
  border-radius: 8px !important;
}
`;
  document.head.appendChild(style);
};

window.remixSettingsWrap = function remixSettingsWrap(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  return el.closest(".form-check") || el;
};

window.remixHideSettingsNode = function remixHideSettingsNode(el, bin) {
  if (!el) return;
  el.classList.add("ultra-hide");
  el.style.display = "none";
  if (bin && el.parentElement !== bin) bin.appendChild(el);
};

window.remixShowSettingsPage = function remixShowSettingsPage(id) {
  window.__remixSettingsPage = id;
  window.__ultraSettingsPage = id;
  ["play", "stats", "setup"].forEach(function (pageId) {
    const page = document.getElementById("ultra-settings-page-" + pageId);
    const tab = document.getElementById("ultra-settings-tab-" + pageId);
    if (page) page.classList.toggle("ultra-page-on", pageId === id);
    if (tab) tab.classList.toggle("ultra-tab-on", pageId === id);
  });
};

window.remixOrganizeSettings = function remixOrganizeSettings() {
  const root = document.getElementById("settings-popup-pudding");
  if (!root) return;

  window.remixInjectSettingsCss();

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

  window.remixHideSettingsNode(window.remixSettingsWrap("AlwaysOnTimeKeeper"), bin);
  window.remixHideSettingsNode(window.remixSettingsWrap("ShowSplitPanel"), bin);
  window.remixHideSettingsNode(window.remixSettingsWrap("RemoveScrollbar"), bin);
  window.remixHideSettingsNode(document.getElementById("ScrollLeftBtn"), bin);
  window.remixHideSettingsNode(document.getElementById("settings-close"), bin);
  window.remixHideSettingsNode(document.getElementById("snakePride"), bin);
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
        window.remixShowSettingsPage(pair[0]);
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
    const el = window.remixSettingsWrap(id);
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
    const el = window.remixSettingsWrap(id) || document.getElementById(id);
    if (el && el.parentElement !== setup) setup.appendChild(el);
  });

  window.remixShowSettingsPage(
    window.__remixSettingsPage || window.__ultraSettingsPage || "play"
  );
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
  code = window.RemixSpeedInfo.alterSnakeCode(code);
  // After MoreMenu: skip if the tick is already gated.
  code = window.PauseMod.alterSnakeCode(code);
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
