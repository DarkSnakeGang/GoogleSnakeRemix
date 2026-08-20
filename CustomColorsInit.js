window.CustomColors = {};

window.CLASSIC_RAINBOW_HEXES = [
  "#4E7CF6",
  "#5499C7",
  "#AF7AC5",
  "#E74C3C",
  "#F39C12",
  "#CCC31C",
  "#27AE60",
];

window.remixEnsureCustomColorSettings = function remixEnsureCustomColorSettings() {
  if (!window.pudding_settings) window.pudding_settings = {};
  function validHex(v, fallback) {
    const s = String(v || "").trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s.toUpperCase();
    if (/^[0-9A-Fa-f]{6}$/.test(s)) return ("#" + s).toUpperCase();
    return fallback;
  }
  window.pudding_settings.CustomGradientColor1 = validHex(
    window.pudding_settings.CustomGradientColor1,
    "#4E7CF6"
  );
  window.pudding_settings.CustomGradientColor2 = validHex(
    window.pudding_settings.CustomGradientColor2,
    "#17439F"
  );
  let count = Number(window.pudding_settings.CustomRainbowCount);
  if (!Number.isFinite(count)) count = 7;
  count = Math.max(2, Math.min(32, Math.round(count)));
  window.pudding_settings.CustomRainbowCount = count;

  let colors = window.pudding_settings.CustomRainbowColors;
  if (!Array.isArray(colors)) colors = window.CLASSIC_RAINBOW_HEXES.slice();
  colors = colors.map(function (c, i) {
    return validHex(c, window.CLASSIC_RAINBOW_HEXES[i % window.CLASSIC_RAINBOW_HEXES.length]);
  });
  while (colors.length < count) {
    colors.push(
      window.CLASSIC_RAINBOW_HEXES[colors.length % window.CLASSIC_RAINBOW_HEXES.length]
    );
  }
  if (colors.length > count) colors = colors.slice(0, count);
  window.pudding_settings.CustomRainbowColors = colors;

  if (!window._remixCustomGradientColors) {
    window._remixCustomGradientColors = ["#4E7CF6", "#17439F"];
  }
  window._remixCustomGradientColors[0] = window.pudding_settings.CustomGradientColor1;
  window._remixCustomGradientColors[1] = window.pudding_settings.CustomGradientColor2;

  if (!window._remixCustomRainbowColors) {
    window._remixCustomRainbowColors = colors.slice();
  } else {
    window._remixCustomRainbowColors.length = 0;
    for (let i = 0; i < colors.length; i++) {
      window._remixCustomRainbowColors.push(colors[i]);
    }
  }
};

window.remixDrawGradientSnakeIcon = function remixDrawGradientSnakeIcon() {
  const c = document.createElement("canvas");
  c.width = 40;
  c.height = 40;
  const ctx = c.getContext("2d");
  window.remixEnsureCustomColorSettings();
  const g = ctx.createLinearGradient(6, 8, 34, 32);
  g.addColorStop(0, window.pudding_settings.CustomGradientColor1);
  g.addColorStop(1, window.pudding_settings.CustomGradientColor2);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(8, 28);
  ctx.quadraticCurveTo(6, 12, 18, 10);
  ctx.quadraticCurveTo(32, 8, 33, 18);
  ctx.quadraticCurveTo(34, 28, 22, 30);
  ctx.quadraticCurveTo(12, 32, 8, 28);
  ctx.fill();
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(27, 16, 2.2, 0, Math.PI * 2);
  ctx.fill();
  return c.toDataURL("image/png");
};

window.remixDrawRainbowSnakeIcon = function remixDrawRainbowSnakeIcon() {
  const c = document.createElement("canvas");
  c.width = 40;
  c.height = 40;
  const ctx = c.getContext("2d");
  window.remixEnsureCustomColorSettings();
  const cols = window.pudding_settings.CustomRainbowColors;
  const n = Math.max(2, cols.length);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = cols[i];
    const y = 8 + (i * 24) / n;
    const h = 24 / n + 0.5;
    ctx.fillRect(8, y, 24, h);
  }
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(20, 20, 13, 15, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  return c.toDataURL("image/png");
};

window.remixRefreshCustomColorIcons = function remixRefreshCustomColorIcons() {
  if (typeof window.CUSTOM_GRADIENT_COLOR_INDEX === "number") {
    const el = document.querySelector("#color");
    if (el && el.children[window.CUSTOM_GRADIENT_COLOR_INDEX]) {
      el.children[window.CUSTOM_GRADIENT_COLOR_INDEX].src =
        window.remixDrawGradientSnakeIcon();
    }
  }
  if (typeof window.CUSTOM_RAINBOW_COLOR_INDEX === "number") {
    const el = document.querySelector("#color");
    if (el && el.children[window.CUSTOM_RAINBOW_COLOR_INDEX]) {
      el.children[window.CUSTOM_RAINBOW_COLOR_INDEX].src =
        window.remixDrawRainbowSnakeIcon();
    }
  }
};

window.remixInjectCustomColorSettingsUi = function remixInjectCustomColorSettingsUi() {
  const panel = document.getElementById("remix-custom-panel-colors");
  if (!panel) return;
  window.remixEnsureCustomColorSettings();
  let card = document.getElementById("remix-custom-colors-card");
  if (!card) {
    card = document.createElement("div");
    card.id = "remix-custom-colors-card";
    card.className = "remix-custom-card";
    card.innerHTML =
      '<div class="remix-custom-title">Custom gradient</div>' +
      '<div class="remix-custom-hint">Body + shade (select the gradient color icon)</div>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:10px;">' +
      '<label>C1 <input id="remix-custom-grad-1" type="color" /></label>' +
      '<label>C2 <input id="remix-custom-grad-2" type="color" /></label>' +
      "</div>" +
      '<div class="remix-custom-title">Custom rainbow</div>' +
      '<div class="remix-custom-hint">2–32 colors (select the rainbow color icon)</div>' +
      '<label>Count <input id="remix-custom-rainbow-count" type="number" min="2" max="32" step="1" /></label>' +
      '<div id="remix-custom-rainbow-grid"></div>';
    panel.appendChild(card);

    function commitGradient() {
      const a = document.getElementById("remix-custom-grad-1");
      const b = document.getElementById("remix-custom-grad-2");
      if (!a || !b) return;
      window.pudding_settings.CustomGradientColor1 = a.value;
      window.pudding_settings.CustomGradientColor2 = b.value;
      window.remixEnsureCustomColorSettings();
      window.remixRefreshCustomColorIcons();
      if (typeof window.saveSettings === "function") window.saveSettings();
    }
    document.getElementById("remix-custom-grad-1").addEventListener("input", commitGradient);
    document.getElementById("remix-custom-grad-2").addEventListener("input", commitGradient);
    document.getElementById("remix-custom-grad-1").addEventListener("change", commitGradient);
    document.getElementById("remix-custom-grad-2").addEventListener("change", commitGradient);

    document
      .getElementById("remix-custom-rainbow-count")
      .addEventListener("change", function () {
        window.pudding_settings.CustomRainbowCount = Number(this.value);
        window.remixEnsureCustomColorSettings();
        window.remixRebuildRainbowGrid();
        window.remixRefreshCustomColorIcons();
        if (typeof window.saveSettings === "function") window.saveSettings();
      });
  }

  document.getElementById("remix-custom-grad-1").value =
    window.pudding_settings.CustomGradientColor1;
  document.getElementById("remix-custom-grad-2").value =
    window.pudding_settings.CustomGradientColor2;
  document.getElementById("remix-custom-rainbow-count").value = String(
    window.pudding_settings.CustomRainbowCount
  );
  window.remixRebuildRainbowGrid();
};

window.remixRebuildRainbowGrid = function remixRebuildRainbowGrid() {
  const grid = document.getElementById("remix-custom-rainbow-grid");
  if (!grid) return;
  window.remixEnsureCustomColorSettings();
  grid.innerHTML = "";
  const colors = window.pudding_settings.CustomRainbowColors;
  for (let i = 0; i < colors.length; i++) {
    const input = document.createElement("input");
    input.type = "color";
    input.value = colors[i];
    input.title = "Color " + (i + 1);
    input.dataset.idx = String(i);
    input.addEventListener("input", function () {
      const idx = Number(this.dataset.idx);
      window.pudding_settings.CustomRainbowColors[idx] = this.value;
      window.remixEnsureCustomColorSettings();
      window.remixRefreshCustomColorIcons();
      if (typeof window.saveSettings === "function") window.saveSettings();
    });
    grid.appendChild(input);
  }
};

window.CustomColors.runCodeBefore = function () {
  window.remixEnsureCustomColorSettings();
};

window.CustomColors.alterSnakeCode = function (code) {
  window.remixEnsureCustomColorSettings();
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

  const colorRoot = document.querySelector("#color");
  if (colorRoot && !window._customColorsIconsInserted) {
    // Insert solids before rainbows: at regularColors index; rainbows before random.
    const randomEl = colorRoot.lastChild;
    const grad = window.uiImage(window.remixDrawGradientSnakeIcon());
    grad.alt = "Custom Gradient";

    let insertAt =
      typeof window.regularColors === "number"
        ? window.regularColors
        : colorRoot.children.length - 1;
    if (insertAt < 0) insertAt = 0;
    if (insertAt >= colorRoot.children.length) {
      colorRoot.insertBefore(grad, randomEl);
    } else {
      colorRoot.insertBefore(grad, colorRoot.children[insertAt]);
    }
    window.CUSTOM_GRADIENT_COLOR_INDEX = [...colorRoot.children].indexOf(grad);
    window.regularColors = (window.regularColors || insertAt) + 1;

    const rain = window.uiImage(window.remixDrawRainbowSnakeIcon());
    rain.alt = "Custom Rainbow";
    colorRoot.insertBefore(rain, randomEl);
    window.CUSTOM_RAINBOW_COLOR_INDEX = [...colorRoot.children].indexOf(rain);
    window.allColorsLength = colorRoot.children.length - 1;

    const nextKey =
      window.rainbowAlts && typeof window.rainbowAlts === "object"
        ? Math.max.apply(
            null,
            Object.keys(window.rainbowAlts).map(Number).concat([0])
          ) + 1
        : 12;
    window.CUSTOM_RAINBOW_ALT_KEY = nextKey;
    if (!window.rainbowAlts) window.rainbowAlts = {};
    window.rainbowAlts[nextKey] = {
      name: "Custom Rainbow",
      set: window._remixCustomRainbowColors,
      icon: rain.src,
      yinyang: 10,
    };

    window._customColorsIconsInserted = true;
  }

  if (code.indexOf("window._remixCustomGradientColors") >= 0) return code;

  // Append custom gradient pair to the solid color table (mutable array ref).
  const colorArrRe =
    /\[\[\"#4E7CF6\",\"#17439F\"\][\s\S]*?\]\]/;
  const colorArr = code.match(colorArrRe);
  if (colorArr) {
    const patched = colorArr[0].replace(
      /\]\]$/,
      ",window._remixCustomGradientColors]]"
    );
    code = code.assertReplace(colorArr[0], patched);
  } else {
    console.error("CustomColors: failed to append gradient to color table");
  }

  // Yin-yang partner index for the new solid (pair with default blue-ish).
  const yyRe =
    /\[5,4,7,7,1,2,0,3,9,8,0,14,15,15,11,[\s\n]*12,17,16[^\]]*\]/;
  const yy = code.match(yyRe);
  if (yy) {
    const patchedYy = yy[0].replace(/\]$/, ",0]");
    code = code.assertReplace(yy[0], patchedYy);
  } else {
    // Fallback: extend whatever yinyang list SnakeColor already grew.
    const yy2 = code.match(
      /\[5,4,7,7,1,2,0,3,9,8,0,14,15,15,11[\s\S]{0,400}?\]/
    );
    if (yy2 && yy2[0].indexOf("window._remixCustomGradientColors") < 0) {
      code = code.assertReplace(yy2[0], yy2[0].replace(/\]$/, ",0]"));
    } else {
      console.error("CustomColors: failed to extend yinyang color map");
    }
  }

  return code;
};
