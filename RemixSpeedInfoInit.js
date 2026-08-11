window.RemixSpeedInfo = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

// Pudding now keys TimeKeeper / SpeedInfo through ModeRegistry (stable
// modeKeys like "chess", "wall+burger"). Remix still gates SpeedInfo panel
// data to Chess / Burger; other modes show a switch prompt.
//
// Chess/Burger TimeKeeper only tracks official apple counts 0..Tally (6),
// plus Normal/Fast/Slow and Standard/Small/Large — not MoreMenu / colored dice.
//
// Timer settings (#edit-mode) is hardcoded Classic…Peaceful; we add only
// Candy/Chess/Burger (index-aligned; gaps stay hidden so PB keys match).
window.RemixSpeedInfo.runCodeBefore = function () {
  window.remixNativeBlenderMode = 22;
  // Last vanilla count index (1 / 3 / 5 / 10 / Dice / Bomb / Tally).
  window.REMIX_OFFICIAL_COUNT_MAX = 6;

  window.remixChessBurgerTimeKeeperActive =
    function remixChessBurgerTimeKeeperActive() {
      return !!(
        (window.isChessActive && window.isChessActive()) ||
        (window.isBurgerActive && window.isBurgerActive())
      );
    };

  window.remixTimeKeeperOfficialSettings =
    function remixTimeKeeperOfficialSettings(ctx) {
      const c =
        ctx ||
        (window.timeKeeper &&
        typeof window.timeKeeper.resolveRunContext === "function"
          ? window.timeKeeper.resolveRunContext()
          : null);
      if (!c) return false;
      const maxCount =
        typeof window.REMIX_OFFICIAL_COUNT_MAX === "number"
          ? window.REMIX_OFFICIAL_COUNT_MAX
          : 6;
      return (
        typeof c.count === "number" &&
        c.count >= 0 &&
        c.count <= maxCount &&
        typeof c.speed === "number" &&
        c.speed >= 0 &&
        c.speed <= 2 &&
        typeof c.size === "number" &&
        c.size >= 0 &&
        c.size <= 2
      );
    };

  window.remixSpeedInfoAllowed = function remixSpeedInfoAllowed() {
    return (
      window.remixChessBurgerTimeKeeperActive() &&
      window.remixTimeKeeperOfficialSettings()
    );
  };

  // Chess/Burger: never record PBs outside official count/speed/size.
  if (
    window.timeKeeper &&
    typeof window.timeKeeper.shouldTrack === "function" &&
    !window.timeKeeper.shouldTrack.__remixOfficial
  ) {
    const origShouldTrack = window.timeKeeper.shouldTrack;
    window.timeKeeper.shouldTrack = function remixShouldTrack(ctx) {
      if (!origShouldTrack.call(this, ctx)) return false;
      if (window.remixChessBurgerTimeKeeperActive()) {
        return window.remixTimeKeeperOfficialSettings(ctx);
      }
      return true;
    };
    window.timeKeeper.shouldTrack.__remixOfficial = true;
  }

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

  // Teach ModeRegistry about trophies Remix appends after Blender.
  // Upstream assumes last trophy = Blender and second-last = Peaceful.
  window.remixInstallModeRegistry = function remixInstallModeRegistry() {
    if (!window.ModeRegistry) return;

    window.ModeRegistry.LABELS.candy = "Candy";
    window.ModeRegistry.LABELS.chess = "Chess";
    window.ModeRegistry.LABELS.burger = "Burger";

    if (window.ModeRegistry.listActiveModes.__remix) return;

    window.ModeRegistry.listActiveModes = function remixListActiveModes() {
      const root = document.getElementById("trophy");
      if (!root || !root.children || root.children.length === 0) {
        return [{ id: "classic", label: "Classic", index: 0 }];
      }
      const children = [...root.children];
      let blenderIndex = -1;
      let peacefulIndex = -1;
      for (let i = 0; i < children.length; i++) {
        const src = window.ModeRegistry._trophySrc(children[i]) || "";
        if (src.includes("random.png")) blenderIndex = i;
        if (/trophy_21(?:\.png)?/i.test(src)) peacefulIndex = i;
      }
      if (blenderIndex < 0 && typeof window.remixNativeBlenderMode === "number") {
        blenderIndex = window.remixNativeBlenderMode;
      }

      const used = new Set();
      const list = [];
      for (let i = 0; i < children.length; i++) {
        const src = window.ModeRegistry._trophySrc(children[i]) || "";
        let id;
        if (i === 0) {
          id = "classic";
        } else if (i === blenderIndex || src.includes("random.png")) {
          id = "blender";
        } else if (i === peacefulIndex || /trophy_21(?:\.png)?/i.test(src)) {
          id = "peaceful";
        } else if (window.CANDY_MODE != null && i === window.CANDY_MODE) {
          id = "candy";
        } else if (window.CHESS_MODE != null && i === window.CHESS_MODE) {
          id = "chess";
        } else if (window.BURGER_MODE != null && i === window.BURGER_MODE) {
          id = "burger";
        } else {
          id = window.ModeRegistry._matchMiddleId(src);
          if (!id) {
            const middleSlot = i - 1;
            if (
              middleSlot >= 0 &&
              middleSlot < window.ModeRegistry.MIDDLE.length
            ) {
              id = window.ModeRegistry.MIDDLE[middleSlot].id;
            } else {
              id = window.ModeRegistry._provisionalId(src, i);
            }
          }
          if (used.has(id)) id = window.ModeRegistry._provisionalId(src, i);
        }
        used.add(id);
        list.push({
          id: id,
          label: window.ModeRegistry.LABELS[id] || id,
          index: i,
        });
      }
      return list;
    };
    window.ModeRegistry.listActiveModes.__remix = true;

    // Prefer live blend flags so Candy/Chess/Burger toggles stay in the key
    // even if blender-panel DOM order drifts from trophy order.
    if (!window.ModeRegistry.getCurrentModeKey.__remix) {
      const origKey = window.ModeRegistry.getCurrentModeKey.bind(
        window.ModeRegistry
      );
      window.ModeRegistry.getCurrentModeKey = function remixGetCurrentModeKey() {
        const modes = window.ModeRegistry.listActiveModes();
        let selectedIndex = 0;
        if (
          window.timeKeeper &&
          typeof window.timeKeeper.getCurrentSetting === "function"
        ) {
          selectedIndex = window.timeKeeper.getCurrentSetting("trophy");
        }
        if (
          typeof window.CurrentModeNum === "number" &&
          window.CurrentModeNum >= 0 &&
          window.CurrentModeNum < modes.length
        ) {
          selectedIndex = window.CurrentModeNum;
        }
        if (selectedIndex < 0 || selectedIndex >= modes.length) selectedIndex = 0;
        const selected = modes[selectedIndex];
        if (!selected || selected.id === "classic") return "classic";
        if (selected.id !== "blender") return selected.id;

        const ids = [];
        // DOM-selected blender modes (vanilla + remix slots)
        const fromDom = window.ModeRegistry._blenderSelectedIds(modes) || [];
        for (let i = 0; i < fromDom.length; i++) {
          if (ids.indexOf(fromDom[i]) < 0) ids.push(fromDom[i]);
        }
        if (window.candy_blending && ids.indexOf("candy") < 0) ids.push("candy");
        if (window.chess_blending && ids.indexOf("chess") < 0) ids.push("chess");
        if (window.burger_blending && ids.indexOf("burger") < 0) {
          ids.push("burger");
        }
        if (!ids.length) return "blender";
        return ids.slice().sort().join("+");
      };
      window.ModeRegistry.getCurrentModeKey.__remix = true;
    }
  };
  window.remixInstallModeRegistry();

  // Display helper used by tests / dialogs. Accepts modeKey (preferred) or a
  // legacy 01-bitstring from older Pudding builds.
  window.remixTimeKeeperFormatGamemode = function remixTimeKeeperFormatGamemode(
    modeStr
  ) {
    if (window.ModeRegistry) {
      let key = modeStr;
      if (key == null || key === "") {
        key = window.ModeRegistry.getCurrentModeKey();
      } else if (/^[01]+$/.test(String(key))) {
        key = window.ModeRegistry.bitstringV3ToModeKey(String(key));
        // Legacy bitstrings never encoded Remix trophies; prefer live key when
        // the selection is a Remix mode / blender mix.
        const live = window.ModeRegistry.getCurrentModeKey();
        if (live && live !== "classic") key = live;
      }
      const label = window.ModeRegistry.labelModeKey(key);
      return label ? label + ", " : "Classic, ";
    }
    return modeStr ? String(modeStr) + ", " : "Classic, ";
  };

  window.remixSpeedInfoApplyModeLabel = function remixSpeedInfoApplyModeLabel() {
    const modeLabel = document.getElementById("mode-selected");
    if (!modeLabel || typeof window.HandleCount !== "function") return;
    if (!window.timeKeeper || typeof window.timeKeeper.getCurrentSetting !== "function") {
      return;
    }
    const count = window.timeKeeper.getCurrentSetting("count");
    const modeKey =
      typeof window.timeKeeper.getCurrentMode === "function"
        ? window.timeKeeper.getCurrentMode()
        : window.ModeRegistry && window.ModeRegistry.getCurrentModeKey();
    const gamemode = window.ModeRegistry
      ? window.ModeRegistry.labelModeKey(modeKey)
      : window.remixTimeKeeperFormatGamemode(modeKey).replace(/,\s*$/, "");
    const countTxt = window.HandleCount(count);
    modeLabel.innerHTML =
      gamemode + ", " + countTxt.substring(0, countTxt.lastIndexOf(","));
  };

  window.remixSpeedInfoClearRows = function remixSpeedInfoClearRows() {
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
      "25track",
      "50track",
      "100track",
      "Alltrack",
      "Htrack",
    ]) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = "";
    }
  };

  window.remixSpeedInfoShowSwitchMessage = function remixSpeedInfoShowSwitchMessage() {
    const modeLabel = document.getElementById("mode-selected");
    if (modeLabel) modeLabel.innerHTML = "Switch to PuddingMod";
    const modeLabel2 = document.getElementById("mode-selected2");
    if (modeLabel2) modeLabel2.innerHTML = "";
    window.remixSpeedInfoClearRows();
  };

  window.remixSpeedInfoShowOfficialOnlyMessage =
    function remixSpeedInfoShowOfficialOnlyMessage() {
      const modeLabel = document.getElementById("mode-selected");
      if (modeLabel) {
        modeLabel.innerHTML = "Official counts only (1–Tally)";
      }
      const modeLabel2 = document.getElementById("mode-selected2");
      if (modeLabel2) modeLabel2.innerHTML = "";
      window.remixSpeedInfoClearRows();
    };

  window.remixSpeedInfoEnableCheckbox = function remixSpeedInfoEnableCheckbox() {
    if (window.isSnakeMobileVersion) return;
    const cb = document.getElementById("AlwaysOnTimeKeeper");
    if (!cb) return;

    cb.disabled = false;

    let want = !!(window.pudding_settings && window.pudding_settings.SpeedInfo);
    try {
      const raw = JSON.parse(
        localStorage.getItem(window.REMIX_SETTINGS_KEY || "RemixSettings") ||
          "null"
      );
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

  // Do NOT replace getCurrentMode — Pudding now returns ModeRegistry modeKeys
  // used for PB storage. Keep a light CurrentModeNum preference on the key path
  // (installed above). Refresh dialog labels after show.
  if (
    window.timeKeeper &&
    typeof window.timeKeeper.showDialog === "function" &&
    !window.timeKeeper.showDialog.__remixPatched
  ) {
    const origShow = window.timeKeeper.showDialog;
    window.timeKeeper.showDialog = function remixShowDialog() {
      origShow.apply(this, arguments);
      const dialog = document.getElementById("timeKeeperDialog");
      if (!dialog || !window.ModeRegistry) return;
      const nice = window.ModeRegistry.labelModeKey(
        window.ModeRegistry.getCurrentModeKey()
      );
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
      if (!window.remixChessBurgerTimeKeeperActive()) {
        window.remixSpeedInfoShowSwitchMessage();
        return;
      }
      if (!window.remixTimeKeeperOfficialSettings()) {
        window.remixSpeedInfoShowOfficialOnlyMessage();
        return;
      }
      window.remixInstallModeRegistry();
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
      if (!window.remixChessBurgerTimeKeeperActive()) {
        window.remixSpeedInfoShowSwitchMessage();
        return;
      }
      if (!window.remixTimeKeeperOfficialSettings()) {
        window.remixSpeedInfoShowOfficialOnlyMessage();
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
      if (!window.remixChessBurgerTimeKeeperActive()) {
        window.remixSpeedInfoShowSwitchMessage();
        return;
      }
      if (!window.remixTimeKeeperOfficialSettings()) {
        window.remixSpeedInfoShowOfficialOnlyMessage();
        return;
      }
      window.remixSpeedInfoEnsureModeLabels();
      return origRec.apply(this, arguments);
    };
    window.getRecordSRC.__remixGated = true;
  }

  // Timer settings (#edit-mode) is hardcoded Classic…Peaceful. Append only
  // Candy / Chess / Burger. Hidden placeholders fill index gaps (e.g. Blender)
  // so getSelected indices still match mode ids for PB storage.
  window.remixEnsureTimerEditModes = function remixEnsureTimerEditModes() {
    window.remixSpeedInfoEnsureModeLabels();
    const editMode = document.getElementById("edit-mode");
    if (!editMode) return;

    const unsBorder = "0.5vh ridge #00000000";
    const selBorder = "0.5vh ridge #af4490ff";
    const baseStyle =
      "cursor: pointer; border-radius: 1vh; width: 3.5vh; height: 3.5vh;";

    const remixModes = [
      {
        id: window.CANDY_MODE,
        icon: window.CANDY_ICON,
        name: "Candy",
      },
      {
        id: window.CHESS_MODE,
        icon: window.CHESS_ICON,
        name: "Chess",
      },
      {
        id: window.BURGER_MODE,
        icon: window.BURGER_ICON,
        name: "Burger",
      },
    ].filter(function (m) {
      return typeof m.id === "number" && m.icon;
    });
    if (!remixModes.length) return;

    const byId = {};
    for (const m of remixModes) byId[m.id] = m;
    const maxId = Math.max.apply(
      null,
      remixModes.map(function (m) {
        return m.id;
      })
    );

    function refreshTimesFromMode() {
      const countSel =
        document.querySelector("#edit-count .sel") ||
        document.querySelector("#edit-count img");
      if (countSel) countSel.click();
    }

    function paintSelection(selectedIdx) {
      for (let i = 0; i < editMode.children.length; i++) {
        const c = editMode.children[i];
        const on = i === selectedIdx;
        c.style.border = on ? selBorder : unsBorder;
        c.className = on ? "sel" : "uns";
      }
    }

    function selectModeImg(img) {
      const idx = [...editMode.children].indexOf(img);
      paintSelection(idx);
      refreshTimesFromMode();
    }

    function ensureSlot(i) {
      const want = byId[i];
      let img = editMode.children[i];
      if (want) {
        if (!img) {
          img = document.createElement("img");
          editMode.appendChild(img);
        }
        img.className = img.className === "sel" ? "sel" : "uns";
        img.style.cssText =
          baseStyle +
          " border: " +
          (img.className === "sel" ? selBorder : unsBorder) +
          ";";
        img.style.display = "";
        img.src = want.icon;
        img.alt = want.name;
        img.removeAttribute("data-remix-placeholder");
        if (!img.__remixModeClick) {
          img.addEventListener("click", function () {
            selectModeImg(img);
          });
          img.__remixModeClick = true;
        }
        return;
      }

      // Gap (e.g. Blender at 22): keep index alignment, do not show an icon.
      if (!img) {
        img = document.createElement("img");
        img.className = "uns";
        img.setAttribute("data-remix-placeholder", "1");
        img.alt = "";
        img.style.display = "none";
        editMode.appendChild(img);
      } else if (
        img.getAttribute("data-remix-placeholder") === "1" ||
        i === window.remixNativeBlenderMode
      ) {
        img.setAttribute("data-remix-placeholder", "1");
        img.style.display = "none";
        img.alt = "";
        img.removeAttribute("src");
      }
    }

    for (let i = editMode.children.length; i <= maxId; i++) {
      ensureSlot(i);
    }
    for (const m of remixModes) ensureSlot(m.id);
    if (typeof window.remixNativeBlenderMode === "number") {
      ensureSlot(window.remixNativeBlenderMode);
    }

    const live =
      typeof window.CurrentModeNum === "number"
        ? window.CurrentModeNum
        : typeof window.getSelected === "function"
          ? window.getSelected("#trophy")
          : 0;
    if (byId[live] && editMode.children[live]) {
      paintSelection(live);
    }
  };

  if (
    typeof window.editTimer === "function" &&
    !window.editTimer.__remixModes
  ) {
    const origEdit = window.editTimer;
    window.editTimer = function remixEditTimer() {
      const opening = !document.getElementById("edit-box");
      origEdit.apply(this, arguments);
      if (opening && document.getElementById("edit-box")) {
        window.remixEnsureTimerEditModes();
        const countSel = document.querySelector("#edit-count .sel");
        if (countSel) countSel.click();
      }
    };
    window.editTimer.__remixModes = true;
  }

  // BootstrapMenu binds click to the pre-wrap editTimer reference — rebind.
  window.remixBindTimerSettingsButton = function remixBindTimerSettingsButton() {
    const btn = document.getElementById("TimerSettings");
    if (!btn || btn.__remixEditBound) return;
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener("click", function () {
      window.editTimer();
    });
    fresh.__remixEditBound = true;
  };
  window.remixBindTimerSettingsButton();

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
  // Pudding refreshes SpeedInfo + SRC on trophy change via queueMicrotask.
  // Both window.SpeedInfoUpdate / getAllSrc are Remix-gated already.
  if (
    code.match(
      /case "trophy":queueMicrotask\(function\(\)\{window\.(?:SpeedInfoUpdate|getAllSrc)\(\)/
    )
  ) {
    return code;
  }
  // Legacy Pudding builds only assigned CurrentModeNum.
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
  window.remixInstallModeRegistry && window.remixInstallModeRegistry();
  window.remixBindTimerSettingsButton && window.remixBindTimerSettingsButton();
  window.remixSpeedInfoEnableCheckbox && window.remixSpeedInfoEnableCheckbox();
  if (
    window.pudding_settings &&
    window.pudding_settings.SpeedInfo &&
    typeof window.SpeedInfoUpdate === "function"
  ) {
    window.SpeedInfoUpdate().catch(function () {});
  }
};
