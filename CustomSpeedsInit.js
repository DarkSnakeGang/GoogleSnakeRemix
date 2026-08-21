window.CustomSpeeds = {};

window.remixClampSpeedMult = function remixClampSpeedMult(v, fallback) {
  let n = Number(v);
  if (!Number.isFinite(n)) n = fallback;
  if (n < 0.00001) n = 0.00001;
  if (n > 18.5) n = 18.5;
  return n;
};

window.remixEnsureCustomSpeedSettings = function remixEnsureCustomSpeedSettings() {
  if (!window.pudding_settings) window.pudding_settings = {};
  window.pudding_settings.CustomSpeedMult = window.remixClampSpeedMult(
    window.pudding_settings.CustomSpeedMult,
    1.0
  );
  window.pudding_settings.CustomSpeedA = window.remixClampSpeedMult(
    window.pudding_settings.CustomSpeedA,
    1.0
  );
  window.pudding_settings.CustomSpeedB = window.remixClampSpeedMult(
    window.pudding_settings.CustomSpeedB,
    0.66
  );
  if (typeof window.remixSpeedSwitchState !== "number") {
    window.remixSpeedSwitchState = 0;
  }
};

window.remixCustomSpeedMult = function remixCustomSpeedMult() {
  window.remixEnsureCustomSpeedSettings();
  return window.pudding_settings.CustomSpeedMult;
};

window.remixCustomSpeedSwitcherMult = function remixCustomSpeedSwitcherMult() {
  window.remixEnsureCustomSpeedSettings();
  return window.remixSpeedSwitchState
    ? window.pudding_settings.CustomSpeedB
    : window.pudding_settings.CustomSpeedA;
};

window.remixOnAppleEatenSpeedSwitch = function remixOnAppleEatenSpeedSwitch() {
  if (typeof window.CUSTOM_SPEED_SWITCH_INDEX !== "number") return;
  const root = document.querySelector("#speed");
  if (!root) return;
  let selected = -1;
  for (let i = 0; i < root.children.length; i++) {
    if (((root.children[i].className || "") + "").indexOf("tuJOWd") >= 0) {
      selected = i;
      break;
    }
  }
  if (selected !== window.CUSTOM_SPEED_SWITCH_INDEX) return;
  window.remixSpeedSwitchState = window.remixSpeedSwitchState ? 0 : 1;
};

window.remixResetSpeedSwitchState = function remixResetSpeedSwitchState() {
  window.remixSpeedSwitchState = 0;
};

window.CUSTOM_SPEED_ICON =
  "data:image/png;base64,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";

window.CUSTOM_SPEED_SWITCH_ICON =
  "data:image/png;base64,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";

window.remixDrawCustomSpeedIcon = function remixDrawCustomSpeedIcon() {
  return window.CUSTOM_SPEED_ICON;
};

window.remixDrawSpeedSwitcherIcon = function remixDrawSpeedSwitcherIcon() {
  return window.CUSTOM_SPEED_SWITCH_ICON;
};

window.remixInjectCustomSpeedSettingsUi = function remixInjectCustomSpeedSettingsUi() {
  const panel = document.getElementById("remix-custom-panel-speeds");
  if (!panel) return;
  window.remixEnsureCustomSpeedSettings();
  let card = document.getElementById("remix-custom-speeds-card");
  if (!card) {
    card = document.createElement("div");
    card.id = "remix-custom-speeds-card";
    card.className = "remix-custom-card";
    card.innerHTML =
      '<div class="remix-custom-title">Custom speed</div>' +
      '<div class="remix-custom-hint">Multiplier (lower = faster). Clamp 0.00001–18.5</div>' +
      '<label>Mult <input id="remix-custom-speed-mult" type="number" min="0.00001" max="18.5" step="0.01" /></label>' +
      '<div class="remix-custom-title" style="margin-top:10px;">Speed switcher</div>' +
      '<div class="remix-custom-hint">Flips A↔B every apple eaten</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">' +
      '<label>A <input id="remix-custom-speed-a" type="number" min="0.00001" max="18.5" step="0.01" /></label>' +
      '<label>B <input id="remix-custom-speed-b" type="number" min="0.00001" max="18.5" step="0.01" /></label>' +
      "</div>";
    panel.appendChild(card);

    function commit() {
      const m = document.getElementById("remix-custom-speed-mult");
      const a = document.getElementById("remix-custom-speed-a");
      const b = document.getElementById("remix-custom-speed-b");
      if (!m || !a || !b) return;
      window.pudding_settings.CustomSpeedMult = Number(m.value);
      window.pudding_settings.CustomSpeedA = Number(a.value);
      window.pudding_settings.CustomSpeedB = Number(b.value);
      window.remixEnsureCustomSpeedSettings();
      m.value = String(window.pudding_settings.CustomSpeedMult);
      a.value = String(window.pudding_settings.CustomSpeedA);
      b.value = String(window.pudding_settings.CustomSpeedB);
      if (typeof window.saveSettings === "function") window.saveSettings();
    }
    ["remix-custom-speed-mult", "remix-custom-speed-a", "remix-custom-speed-b"].forEach(
      function (id) {
        document.getElementById(id).addEventListener("change", commit);
      }
    );
  }
  document.getElementById("remix-custom-speed-mult").value = String(
    window.pudding_settings.CustomSpeedMult
  );
  document.getElementById("remix-custom-speed-a").value = String(
    window.pudding_settings.CustomSpeedA
  );
  document.getElementById("remix-custom-speed-b").value = String(
    window.pudding_settings.CustomSpeedB
  );
};

window.CustomSpeeds.runCodeBefore = function () {
  window.remixEnsureCustomSpeedSettings();
  window.uiImage =
    window.uiImage ||
    function (src) {
      const img = new Image();
      img.src = src;
      img.width = 40;
      img.height = 40;
      img.classList.add("DqMRee");
      img.classList.add("SsAred");
      return img;
    };

  const speedRoot = document.querySelector("#speed");
  if (!speedRoot) {
    window.CUSTOM_SPEED_INDEX =
      typeof window.CAT_SPEED_INDEX === "number" ? window.CAT_SPEED_INDEX + 1 : 15;
    window.CUSTOM_SPEED_SWITCH_INDEX = window.CUSTOM_SPEED_INDEX + 1;
    return;
  }
  if (window._customSpeedsIconsInserted) {
    if (typeof window.CUSTOM_SPEED_INDEX !== "number") {
      window.CUSTOM_SPEED_INDEX = speedRoot.children.length - 2;
      window.CUSTOM_SPEED_SWITCH_INDEX = speedRoot.children.length - 1;
    }
    return;
  }

  const custom = window.uiImage(window.remixDrawCustomSpeedIcon());
  custom.alt = "Custom Speed";
  speedRoot.appendChild(custom);
  window.CUSTOM_SPEED_INDEX = [...speedRoot.children].indexOf(custom);

  const sw = window.uiImage(window.remixDrawSpeedSwitcherIcon());
  sw.alt = "Speed Switcher";
  speedRoot.appendChild(sw);
  window.CUSTOM_SPEED_SWITCH_INDEX = [...speedRoot.children].indexOf(sw);
  window._customSpeedsIconsInserted = true;

  if (window.speed_img_arr) {
    window.speed_img_arr = Array.from(speedRoot.children).map(function (el) {
      return el.src;
    });
  }
  if (!window.speedToTxt) window.speedToTxt = {};
  window.speedToTxt[window.CUSTOM_SPEED_INDEX] = { name: "Custom" };
  window.speedToTxt[window.CUSTOM_SPEED_SWITCH_INDEX] = { name: "Switcher" };

  if (typeof window.HandleSpeed === "function" && !window.HandleSpeed.__customSpeedsPatched) {
    const orig = window.HandleSpeed;
    window.HandleSpeed = function (speed) {
      if (speed === window.CUSTOM_SPEED_INDEX) return "Custom speed, ";
      if (speed === window.CUSTOM_SPEED_SWITCH_INDEX) return "Speed switcher, ";
      return orig(speed);
    };
    window.HandleSpeed.__customSpeedsPatched = true;
  }
};

window.CustomSpeeds.alterSnakeCode = function (code) {
  const customIdx =
    typeof window.CUSTOM_SPEED_INDEX === "number" ? window.CUSTOM_SPEED_INDEX : 15;
  const switchIdx =
    typeof window.CUSTOM_SPEED_SWITCH_INDEX === "number"
      ? window.CUSTOM_SPEED_SWITCH_INDEX
      : customIdx + 1;

  const tickCustom =
    "case " +
    customIdx +
    ":\\s*speedMultiplier\\s*=\\s*window\\.remixCustomSpeedMult";
  const tickSwitch =
    "case " +
    switchIdx +
    ":\\s*speedMultiplier\\s*=\\s*window\\.remixCustomSpeedSwitcherMult";

  if (!new RegExp(tickCustom).test(code)) {
    const tickDefault =
      /default:\s*speedMultiplier\s*=\s*1\s*;?\s*break\s*;?/;
    const tickCase =
      `case ${customIdx}:
              speedMultiplier = window.remixCustomSpeedMult()
              break
            case ${switchIdx}:
              speedMultiplier = window.remixCustomSpeedSwitcherMult()
              break
            default:
              speedMultiplier = 1
              break`;
    const tickSwitchBlock = code.match(
      /let speedMultiplier\s*;?\s*switch\([\s\S]{0,80}?\)\s*\{[\s\S]*?default:\s*speedMultiplier\s*=\s*1\s*;?\s*break\s*;?\s*\}/
    );
    if (tickSwitchBlock) {
      const body = tickSwitchBlock[0].replace(tickDefault, tickCase);
      code = code.assertReplace(tickSwitchBlock[0], body);
    } else if (tickDefault.test(code)) {
      code = code.replace(tickDefault, tickCase);
    } else {
      console.error("CustomSpeeds: failed to inject tick cases");
    }
  }

  if (!new RegExp("case\\s+" + customIdx + ":\\s*a\\s*=\\s*window\\.remixCustomSpeedMult").test(code)) {
    const resetDefault = /default:\s*a\s*=\s*1[\s\S]*?break a/;
    const resetCase =
      `case ${customIdx}:
            a = window.remixCustomSpeedMult()
            break a
          case ${switchIdx}:
            a = window.remixCustomSpeedSwitcherMult()
            break a
          default:
            a = 1
            break a`;
    const resetSwitch = code.match(
      /case 1:\s*a\s*=\s*\.66[\s\S]*?default:\s*a\s*=\s*1[\s\S]*?break a\s*\}/
    );
    if (resetSwitch) {
      const rb = resetSwitch[0].replace(resetDefault, resetCase);
      code = code.assertReplace(resetSwitch[0], rb);
    } else if (resetDefault.test(code)) {
      code = code.replace(resetDefault, resetCase);
    } else {
      console.error("CustomSpeeds: failed to inject reset cases");
    }
  }

  // Flip A↔B when score increases (apple eaten). Current builds don't
  // keep a stable `a.Sh++` token in tick, so detect Sh deltas at tick start.
  if (code.indexOf("window.remixOnAppleEatenSpeedSwitch") < 0) {
    const tickHead = code.match(/tick\(\)\s*\{\s*window\.__remixGame\s*=\s*this\s*;/);
    if (tickHead) {
      code = code.assertReplace(
        tickHead[0],
        tickHead[0] +
          "if(window.__remixLastSh!=null&&this.Sh>window.__remixLastSh){window.remixOnAppleEatenSpeedSwitch();}window.__remixLastSh=this.Sh;"
      );
    } else if (code.indexOf("a.Sh++;") >= 0) {
      code = code.replace(/a\.Sh\+\+;/g, "a.Sh++;window.remixOnAppleEatenSpeedSwitch();");
    } else {
      console.error("CustomSpeeds: failed to find apple eat / tick head hook");
    }
  }

  // Reset switcher state when game resets (inside case 1 body — not between cases).
  if (code.indexOf("window.remixResetSpeedSwitchState") < 0) {
    const resetSpeedHead = code.match(/case 1:\s*a\s*=\s*\.66/);
    if (resetSpeedHead) {
      code = code.assertReplace(
        resetSpeedHead[0],
        "case 1: window.remixResetSpeedSwitchState(); window.__remixLastSh=null; a = .66"
      );
    }
  }

  return code;
};
