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

window.remixDrawCustomSpeedIcon = function remixDrawCustomSpeedIcon() {
  // Compact green vanilla-pose snake (v5 look) — avoid embedding huge mockups.
  const c = document.createElement("canvas");
  c.width = 40;
  c.height = 40;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#4CAF50";
  ctx.beginPath();
  ctx.moveTo(10, 28);
  ctx.bezierCurveTo(8, 14, 16, 8, 24, 10);
  ctx.bezierCurveTo(34, 12, 34, 22, 28, 26);
  ctx.bezierCurveTo(22, 30, 14, 32, 10, 28);
  ctx.fill();
  ctx.fillStyle = "#2E7D32";
  ctx.beginPath();
  ctx.ellipse(14, 26, 5, 4, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1B5E20";
  ctx.beginPath();
  ctx.arc(27, 15, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#81C784";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(6, 12);
  ctx.lineTo(2, 10);
  ctx.moveTo(6, 16);
  ctx.lineTo(1, 16);
  ctx.moveTo(6, 20);
  ctx.lineTo(2, 22);
  ctx.stroke();
  return c.toDataURL("image/png");
};

window.remixDrawSpeedSwitcherIcon = function remixDrawSpeedSwitcherIcon() {
  const c = document.createElement("canvas");
  c.width = 40;
  c.height = 40;
  const ctx = c.getContext("2d");
  // Two speed pills A/B with a flip arrow.
  ctx.fillStyle = "#42A5F5";
  ctx.fillRect(5, 8, 14, 10);
  ctx.fillStyle = "#EF5350";
  ctx.fillRect(21, 22, 14, 10);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 9px sans-serif";
  ctx.fillText("A", 9, 16);
  ctx.fillText("B", 25, 30);
  ctx.strokeStyle = "#FFD54F";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(22, 12);
  ctx.lineTo(30, 12);
  ctx.lineTo(28, 9);
  ctx.moveTo(30, 12);
  ctx.lineTo(28, 15);
  ctx.moveTo(18, 28);
  ctx.lineTo(10, 28);
  ctx.lineTo(12, 25);
  ctx.moveTo(10, 28);
  ctx.lineTo(12, 31);
  ctx.stroke();
  return c.toDataURL("image/png");
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
