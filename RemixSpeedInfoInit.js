window.RemixSpeedInfo = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

// Pudding's BootstrapMenu disables SpeedInfo unless snakeChosenMod is
// "PuddingMod". Remix keeps the toggle usable, but only Chess / Burger show
// real SpeedInfo data — every other mode shows a switch prompt.
//
// TimeKeeper's mode bit → name switch only knows Wall…Peaceful, so Remix
// trophies rendered as "Unknown". We also fix getCurrentMode: Pudding treated
// the last trophy as Blender, but Remix appends Candy/Chess/Burger after it.
window.RemixSpeedInfo.runCodeBefore = function () {
  window.remixNativeBlenderMode = 22;

  window.remixSpeedInfoAllowed = function remixSpeedInfoAllowed() {
    return !!(
      (window.isChessActive && window.isChessActive()) ||
      (window.isBurgerActive && window.isBurgerActive())
    );
  };

  window.remixSpeedInfoEnsureModeLabels = function remixSpeedInfoEnsureModeLabels() {
    if (!window.modeToTxt) window.modeToTxt = {};
    if (window.CANDY_MODE != null) {
      window.modeToTxt[window.CANDY_MODE] = { name: "Candy" };
    }
    if (window.CHESS_MODE != null) {
      window.modeToTxt[window.CHESS_MODE] = { name: "Chess" };
    }
    if (window.BURGER_MODE != null) {
      window.modeToTxt[window.BURGER_MODE] = { name: "Burger" };
    }
  };

  const VANILLA_BRIDGE = [
    "Wall",
    "Portal",
    "Cheese",
    "Borderless",
    "Twin",
    "Winged",
    "YinYang",
    "Key",
    "Sokoban",
    "Poison",
    "Dimension",
    "Minesweeper",
    "Statue",
    "Light",
    "Shield",
    "Arrow",
    "Hotdog",
    "Magnet",
    "Gate",
    "Bridge",
    "Peaceful",
  ];
  const VANILLA_SKIP = VANILLA_BRIDGE.slice();
  VANILLA_SKIP[19] = "Skip";

  window.remixTimeKeeperNameForBit = function remixTimeKeeperNameForBit(
    bitIndex
  ) {
    const trophyId = bitIndex + 1;
    if (window.CANDY_MODE != null && trophyId === window.CANDY_MODE) {
      return "Candy";
    }
    if (window.CHESS_MODE != null && trophyId === window.CHESS_MODE) {
      return "Chess";
    }
    if (window.BURGER_MODE != null && trophyId === window.BURGER_MODE) {
      return "Burger";
    }
    if (trophyId === window.remixNativeBlenderMode) return "Blender";
    const names = window.isBridge ? VANILLA_BRIDGE : VANILLA_SKIP;
    if (bitIndex >= 0 && bitIndex < names.length) return names[bitIndex];
    return "Unknown";
  };

  // Build "Wall, Chess, " style label (trailing comma+space, matching Pudding).
  window.remixTimeKeeperFormatGamemode = function remixTimeKeeperFormatGamemode(
    modeStr
  ) {
    modeStr = modeStr || "";
    const trophyMode =
      typeof window.CurrentModeNum === "number"
        ? window.CurrentModeNum
        : typeof window.timeKeeper.getCurrentSetting === "function"
          ? window.timeKeeper.getCurrentSetting("trophy")
          : 0;

    if (trophyMode === window.remixNativeBlenderMode) {
      let gamemode = "";
      const vanillaLen = Math.min(modeStr.length, 21);
      for (let i = 0; i < vanillaLen; i++) {
        if (modeStr.charAt(i) === "1") {
          gamemode += window.remixTimeKeeperNameForBit(i) + ", ";
        }
      }
      if (window.candy_blending) gamemode += "Candy, ";
      if (window.chess_blending) gamemode += "Chess, ";
      if (window.burger_blending) gamemode += "Burger, ";
      if (!gamemode) gamemode = "Classic, ";
      return gamemode;
    }

    let gamemode = "";
    for (let i = 0; i < modeStr.length; i++) {
      if (modeStr.charAt(i) === "1") {
        gamemode += window.remixTimeKeeperNameForBit(i) + ", ";
      }
    }
    if (!gamemode) gamemode = "Classic, ";
    return gamemode;
  };

  window.remixSpeedInfoApplyModeLabel = function remixSpeedInfoApplyModeLabel() {
    const modeLabel = document.getElementById("mode-selected");
    if (!modeLabel || typeof window.HandleCount !== "function") return;
    const count = window.timeKeeper.getCurrentSetting("count");
    const modeStr = window.timeKeeper.getCurrentMode();
    const gamemode = window.remixTimeKeeperFormatGamemode(modeStr);
    const countTxt = window.HandleCount(count);
    modeLabel.innerHTML =
      gamemode + countTxt.substring(0, countTxt.lastIndexOf(","));
  };

  window.remixSpeedInfoShowSwitchMessage = function remixSpeedInfoShowSwitchMessage() {
    const set = function (id, html) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };
    set("mode-selected", "Switch to PuddingMod");
    set("mode-selected2", "");
    for (const id of [
      "25",
      "50",
      "100",
      "ALL",
      "H",
      "att",
      "25src",
      "50src",
      "100src",
      "Allsrc",
      "Hsrc",
    ]) {
      set(id, "");
    }
  };

  window.remixSpeedInfoEnableCheckbox = function remixSpeedInfoEnableCheckbox() {
    if (window.isSnakeMobileVersion) return;
    const cb = document.getElementById("AlwaysOnTimeKeeper");
    if (!cb) return;

    cb.disabled = false;

    let want = !!(window.pudding_settings && window.pudding_settings.SpeedInfo);
    try {
      const raw = JSON.parse(localStorage.getItem("PuddingSettings") || "null");
      if (raw && raw.SpeedInfo) want = true;
    } catch (_e) {}

    if (want) {
      if (window.pudding_settings) window.pudding_settings.SpeedInfo = true;
      cb.checked = true;
      const box = document.getElementById("speedinfo-popup-pudding");
      if (box) {
        box.style.display = "block";
        box.style.visibility = "visible";
      }
    }
  };

  // Fix mode bitstring: Blender is always trophy 22, not "last child".
  if (
    window.timeKeeper &&
    typeof window.timeKeeper.getCurrentMode === "function" &&
    !window.timeKeeper.getCurrentMode.__remixPatched
  ) {
    window.timeKeeper.getCurrentMode = function remixGetCurrentMode() {
      const blenderId = window.remixNativeBlenderMode;
      // CurrentModeNum is updated on trophy change (and by the harness); prefer it
      // over the DOM trophy index so labels stay correct during play.
      const mode =
        typeof window.CurrentModeNum === "number"
          ? window.CurrentModeNum
          : window.timeKeeper.getCurrentSetting("trophy");
      const trophyRoot = document.getElementById("trophy");
      const trophyCount = trophyRoot ? trophyRoot.children.length : 0;

      if (mode === blenderId) {
        let element = null;
        for (const img of document.querySelectorAll("img")) {
          if (img.src && img.src.includes("random.png")) {
            element = img;
            break;
          }
        }
        let modeStr = "";
        if (
          element &&
          element.parentElement &&
          element.parentElement.parentElement &&
          element.parentElement.parentElement.parentElement
        ) {
          let counter = -1;
          for (const child of element.parentElement.parentElement.parentElement
            .children) {
            counter++;
            if (counter === 0) continue;
            const inner = child.firstElementChild;
            if (
              inner &&
              inner.classList.length > 1 &&
              inner.children.length > 0
            ) {
              modeStr += "1";
            } else {
              modeStr += "0";
            }
          }
        }
        modeStr += window.candy_blending ? "1" : "0";
        modeStr += window.chess_blending ? "1" : "0";
        modeStr += window.burger_blending ? "1" : "0";
        return modeStr;
      }

      // One bit per trophy after Classic (includes Blender + Remix modes).
      let modeStr = "";
      for (let t = 1; t < trophyCount; t++) {
        modeStr += t === mode ? "1" : "0";
      }
      return modeStr;
    };
    window.timeKeeper.getCurrentMode.__remixPatched = true;
  }

  if (
    window.timeKeeper &&
    typeof window.timeKeeper.showDialog === "function" &&
    !window.timeKeeper.showDialog.__remixPatched
  ) {
    const origShow = window.timeKeeper.showDialog;
    window.timeKeeper.showDialog = function remixShowDialog() {
      origShow.apply(this, arguments);
      const dialog = document.getElementById("timeKeeperDialog");
      if (!dialog) return;
      const nice = window
        .remixTimeKeeperFormatGamemode(window.timeKeeper.getCurrentMode())
        .replace(/,\s*$/, "");
      for (let i = 0; i < dialog.childNodes.length; i++) {
        const node = dialog.childNodes[i];
        if (
          node.nodeType === 3 &&
          typeof node.textContent === "string" &&
          node.textContent.indexOf("Mode: ") === 0
        ) {
          node.textContent = "Mode: " + nice;
          break;
        }
      }
    };
    window.timeKeeper.showDialog.__remixPatched = true;
  }

  if (
    typeof window.SpeedInfoUpdate === "function" &&
    !window.SpeedInfoUpdate.__remixGated
  ) {
    const origUpdate = window.SpeedInfoUpdate;
    window.SpeedInfoUpdate = async function remixSpeedInfoUpdate() {
      if (!window.pudding_settings || !window.pudding_settings.SpeedInfo) {
        return;
      }
      if (!window.remixSpeedInfoAllowed()) {
        window.remixSpeedInfoShowSwitchMessage();
        return;
      }
      window.remixSpeedInfoEnsureModeLabels();
      const result = await origUpdate.apply(this, arguments);
      window.remixSpeedInfoApplyModeLabel();
      return result;
    };
    window.SpeedInfoUpdate.__remixGated = true;
  }

  if (typeof window.getAllSrc === "function" && !window.getAllSrc.__remixGated) {
    const origAll = window.getAllSrc;
    window.getAllSrc = async function remixGetAllSrc() {
      if (!window.pudding_settings || !window.pudding_settings.SpeedInfo) {
        return;
      }
      if (!window.remixSpeedInfoAllowed()) {
        window.remixSpeedInfoShowSwitchMessage();
        return;
      }
      window.remixSpeedInfoEnsureModeLabels();
      return origAll.apply(this, arguments);
    };
    window.getAllSrc.__remixGated = true;
  }

  if (
    typeof window.getRecordSRC === "function" &&
    !window.getRecordSRC.__remixGated
  ) {
    const origRec = window.getRecordSRC;
    window.getRecordSRC = async function remixGetRecordSRC(level) {
      if (!window.pudding_settings || !window.pudding_settings.SpeedInfo) {
        return;
      }
      if (!window.remixSpeedInfoAllowed()) {
        window.remixSpeedInfoShowSwitchMessage();
        return;
      }
      window.remixSpeedInfoEnsureModeLabels();
      return origRec.apply(this, arguments);
    };
    window.getRecordSRC.__remixGated = true;
  }

  window.remixSpeedInfoEnableCheckbox();
  if (
    window.pudding_settings &&
    window.pudding_settings.SpeedInfo &&
    typeof window.SpeedInfoUpdate === "function"
  ) {
    window.SpeedInfoUpdate().catch(function (e) {
      console.error("RemixSpeedInfo: initial update failed", e);
    });
  }
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.RemixSpeedInfo.alterSnakeCode = function (code) {
  if (code.match(/case "trophy":window\.CurrentModeNum = /)) {
    code = code.assertReplace(
      /case "trophy":window\.CurrentModeNum = /,
      `case "trophy":setTimeout(function(){window.SpeedInfoUpdate&&window.SpeedInfoUpdate().catch(function(e){console.error("RemixSpeedInfo: trophy update failed",e);});},0);window.CurrentModeNum = `
    );
  } else {
    console.error("RemixSpeedInfo: failed to find trophy CurrentModeNum hook");
  }
  return code;
};

////////////////////////////////////////////////////////////////////
//RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.RemixSpeedInfo.runCodeAfter = function () {
  window.remixSpeedInfoEnableCheckbox && window.remixSpeedInfoEnableCheckbox();
  if (
    window.pudding_settings &&
    window.pudding_settings.SpeedInfo &&
    typeof window.SpeedInfoUpdate === "function"
  ) {
    window.SpeedInfoUpdate().catch(function () {});
  }
};
