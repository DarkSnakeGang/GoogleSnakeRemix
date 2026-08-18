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
