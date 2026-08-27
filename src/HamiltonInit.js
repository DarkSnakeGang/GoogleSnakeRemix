////////////////////////////////////////////////////////////////////
// Remix glue for WallSolver HamiltonMod (Play toggle + enable gate)
////////////////////////////////////////////////////////////////////

window.remixEnsureHamiltonSettings = function remixEnsureHamiltonSettings() {
  const s = window.pudding_settings || (window.pudding_settings = {});
  if (typeof s.Hamilton !== "boolean") s.Hamilton = false;
  return s;
};

window.remixHamiltonEnabled = function remixHamiltonEnabled() {
  window.remixEnsureHamiltonSettings();
  return !!window.pudding_settings.Hamilton;
};

/** Random Ham preset is selected (Ultra) — pattern tour should stay frozen. */
window.remixHamiltonRandomHamChosen = function remixHamiltonRandomHamChosen() {
  const chosen = document.querySelector(".chosen-preset");
  return !!(chosen && chosen.classList.contains("preset-random-ham"));
};

/**
 * Wall-icon tint is only for real Wall mode while Hamilton is on.
 * Any other mode (and Random Ham / LE pattern tours) must keep the selected
 * mode trophy — otherwise onGameReset → setWallIconState("idle") rewrites it
 * to a stale wall URL and mode changes look stuck.
 */
window.remixHamiltonShouldTintModeTrophy = function remixHamiltonShouldTintModeTrophy() {
  if (!window.remixHamiltonEnabled()) return false;
  if (window.remixHamiltonRandomHamChosen()) return false;
  const HM = window.HamiltonMod;
  if (!HM) return false;
  if (typeof HM.__remixNativeIsWallMode === "function") {
    try {
      return !!HM.__remixNativeIsWallMode();
    } catch (_e) {
      return false;
    }
  }
  if (HM.__remixPatternSolve) return false;
  if (typeof HM.isWallMode === "function") {
    try {
      return !!HM.isWallMode();
    } catch (_e2) {
      return false;
    }
  }
  return false;
};

/** Drop any Hamilton data:-URI recolor so the game can show the selected mode. */
window.remixHamiltonReleaseModeTrophy = function remixHamiltonReleaseModeTrophy() {
  const HM = window.HamiltonMod;
  if (!HM) return;
  if (HM._iconTimer) {
    clearInterval(HM._iconTimer);
    HM._iconTimer = null;
  }
  HM._iconLoadGen = (HM._iconLoadGen || 0) + 1;
  const el =
    typeof HM.getScoreBarIcon === "function" ? HM.getScoreBarIcon() : null;
  if (el) {
    const src = el.src || "";
    // Only undo our canvas recolor. Never force trophy_01 / a stale capture —
    // that is what made mode switches look broken.
    if (String(src).indexOf("data:") === 0) {
      const orig = HM._statIconOrigSrc;
      if (orig && String(orig).indexOf("data:") !== 0) {
        el.src = orig;
      }
    }
    if (typeof HM._clearIconTint === "function") HM._clearIconTint(el);
  }
  HM._statIconOrigSrc = null;
};

window.remixHamiltonDisableOverlay = function remixHamiltonDisableOverlay() {
  const HM = window.HamiltonMod;
  if (!HM) return;
  HM.__remixPatternSolve = false;
  try {
    if (typeof HM.cancelSolve === "function") HM.cancelSolve(true);
  } catch (_e) {}
  try {
    if (typeof HM.clearTour === "function") HM.clearTour();
  } catch (_e2) {}
  try {
    if (typeof HM.setWallIconState === "function") HM.setWallIconState("idle");
  } catch (_e3) {}
  try {
    if (typeof HM.updateIndicator === "function") HM.updateIndicator();
  } catch (_e4) {}
  const el =
    (HM && HM._indicatorEl) || document.getElementById("hamilton-mod-indicator");
  if (el) el.style.display = "none";
};

window.remixHamiltonEnableOverlay = function remixHamiltonEnableOverlay() {
  const el =
    (window.HamiltonMod && window.HamiltonMod._indicatorEl) ||
    document.getElementById("hamilton-mod-indicator");
  if (el) el.style.display = "";
  if (
    window.HamiltonMod &&
    typeof window.HamiltonMod.updateIndicator === "function"
  ) {
    window.HamiltonMod.updateIndicator();
  }
};

/**
 * Solve from current window.wallCoords even outside wall mode (Random Ham / LE).
 * No-ops when the Play toggle is off.
 */
window.remixHamiltonSolveCurrentPattern = function remixHamiltonSolveCurrentPattern() {
  if (!window.remixHamiltonEnabled()) return false;
  const HM = window.HamiltonMod;
  if (!HM || typeof HM._startSolve !== "function") return false;
  window.remixHamiltonEnableOverlay();
  // LE / Random Ham walls are not always "wall mode"; allow paint while a tour exists.
  HM.__remixPatternSolve = true;
  window.remixHamiltonReleaseModeTrophy();
  const dims =
    typeof HM.getBoardDims === "function" ? HM.getBoardDims() : null;
  const bits =
    dims && typeof HM.buildWallBits === "function"
      ? HM.buildWallBits(dims)
      : null;
  if (!dims || !bits) {
    console.warn("remixHamiltonSolveCurrentPattern: unknown board size");
    return false;
  }
  if (typeof HM.updateIndicator === "function") HM.updateIndicator();
  HM._startSolve(bits, dims);
  return true;
};

window.remixInstallHamiltonCheckbox = function remixInstallHamiltonCheckbox(play) {
  if (!play) return;
  window.remixEnsureHamiltonSettings();
  let wrap = document.getElementById("HamiltonTour");
  if (wrap) wrap = wrap.closest(".form-check") || wrap.parentElement;
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "form-check form-check-inline";
    wrap.innerHTML =
      '<input class="form-check-input" type="checkbox" role="switch" id="HamiltonTour">' +
      '<label class="form-check-label" for="HamiltonTour">Hamilton tour</label>';
    const skull = document.getElementById("SkullPoisonFruit");
    const skullWrap =
      skull && (skull.closest(".form-check") || skull.parentElement);
    if (skullWrap && skullWrap.parentElement === play) {
      play.insertBefore(wrap, skullWrap.nextSibling);
    } else {
      play.appendChild(wrap);
    }
  }
  const box = document.getElementById("HamiltonTour");
  if (!box || box.dataset.remixHamiltonBound === "1") return;
  box.dataset.remixHamiltonBound = "1";
  box.checked = !!window.pudding_settings.Hamilton;
  box.addEventListener("change", function () {
    window.pudding_settings.Hamilton = !!this.checked;
    if (typeof window.saveSettings === "function") window.saveSettings();
    if (this.checked) {
      window.remixHamiltonEnableOverlay();
      if (
        window.wallCoords &&
        window.wallCoords.length &&
        typeof window.remixHamiltonSolveCurrentPattern === "function"
      ) {
        window.remixHamiltonSolveCurrentPattern();
      }
    } else {
      window.remixHamiltonDisableOverlay();
    }
  });
};

window.remixGateHamiltonMod = function remixGateHamiltonMod() {
  const HM = window.HamiltonMod;
  if (!HM || HM.__remixGated) return;
  HM.__remixGated = true;

  const origIsWallMode = HM.isWallMode;
  if (typeof origIsWallMode === "function") {
    HM.__remixNativeIsWallMode = function () {
      return origIsWallMode.apply(HM, arguments);
    };
    HM.isWallMode = function () {
      if (HM.__remixPatternSolve && window.remixHamiltonEnabled()) return true;
      return origIsWallMode.apply(this, arguments);
    };
  }

  // Pudding Counter mounts `#stat-icon` on the score bar for apple/key counts.
  // Hamilton's WallSolver path prefers that id, which steals recolor from the
  // native mode trophy (`UEI8qf`) next to the score. Keep Hamilton's recolor
  // logic; only retarget the icon.
  HM.getScoreBarIcon = function getScoreBarIcon() {
    const bar = document.getElementsByClassName("sEOCsb")[0];
    if (bar) {
      const inBar = bar.querySelector('img[jsname="UEI8qf"]');
      if (inBar) return inBar;
    }
    return document.querySelector('img[jsname="UEI8qf"]');
  };

  // Do not restore Counter's getStatIconImageSrc() onto the mode trophy.
  HM._restoreWallIconSrc = function _restoreWallIconSrc() {
    if (HM._statIconOrigSrc && String(HM._statIconOrigSrc).indexOf("data:") !== 0) {
      return HM._statIconOrigSrc;
    }
    return (
      HM.WALL_ICON_SRC ||
      "https://www.google.com/logos/fnbx/snake_arcade/v22/trophy_01.png"
    );
  };

  // Random Ham / pattern tours must not overwrite the selected mode trophy.
  const origSetWallIconState = HM.setWallIconState;
  if (typeof origSetWallIconState === "function") {
    HM.setWallIconState = function (state) {
      if (!window.remixHamiltonShouldTintModeTrophy()) {
        HM.iconState = state;
        window.remixHamiltonReleaseModeTrophy();
        return;
      }
      return origSetWallIconState.apply(this, arguments);
    };
  }

  const wrap = function (name) {
    const orig = HM[name];
    if (typeof orig !== "function") return;
    HM[name] = function () {
      if (!window.remixHamiltonEnabled()) return;
      return orig.apply(this, arguments);
    };
  };

  // Wall-mode apple eats push wallCoords + notifyWallSpawn. For Random Ham the
  // tour is for the blit pattern; re-solving on each spawn clears it mid-run.
  const origNotify = HM.notifyWallSpawn;
  if (typeof origNotify === "function") {
    HM.notifyWallSpawn = function () {
      if (!window.remixHamiltonEnabled()) return;
      if (window.remixHamiltonRandomHamChosen()) {
        if (typeof HM.updateIndicator === "function") HM.updateIndicator();
        return;
      }
      return origNotify.apply(this, arguments);
    };
  }

  wrap("paintFrame");
  wrap("paintOntoBuffer");

  const origUpdate = HM.updateIndicator;
  if (typeof origUpdate === "function") {
    HM.updateIndicator = function () {
      if (!window.remixHamiltonEnabled()) {
        const el =
          HM._indicatorEl || document.getElementById("hamilton-mod-indicator");
        if (el) el.style.display = "none";
        return;
      }
      const el =
        HM._indicatorEl || document.getElementById("hamilton-mod-indicator");
      if (el) el.style.display = "";
      return origUpdate.apply(this, arguments);
    };
  }

  const origReset = HM.onGameReset;
  if (typeof origReset === "function") {
    HM.onGameReset = function () {
      HM.__remixPatternSolve = false;
      return origReset.apply(this, arguments);
    };
  }
};

/** Stack Hamilton status text under Remix / Remix Ultra (same top-left slot). */
window.remixOffsetHamiltonIndicator = function remixOffsetHamiltonIndicator() {
  const el =
    (window.HamiltonMod && window.HamiltonMod._indicatorEl) ||
    document.getElementById("hamilton-mod-indicator");
  if (!el) return;
  el.style.paddingTop = "22px";
};

window.HamiltonRemix = window.HamiltonRemix || {};

window.HamiltonRemix.runCodeBefore = function () {
  window.remixEnsureHamiltonSettings();
  if (window.HamiltonMod && typeof window.HamiltonMod.runCodeBefore === "function") {
    window.HamiltonMod.runCodeBefore();
  }
  window.remixGateHamiltonMod();
};

window.HamiltonRemix.alterSnakeCode = function (code) {
  if (window.HamiltonMod && typeof window.HamiltonMod.alterSnakeCode === "function") {
    code = window.HamiltonMod.alterSnakeCode(code);
  }
  return code;
};

window.HamiltonRemix.runCodeAfter = function () {
  if (window.HamiltonMod && typeof window.HamiltonMod.runCodeAfter === "function") {
    window.HamiltonMod.runCodeAfter();
  }
  window.remixOffsetHamiltonIndicator();
  if (!window.remixHamiltonEnabled()) {
    window.remixHamiltonDisableOverlay();
  }
};
