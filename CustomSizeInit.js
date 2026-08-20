window.CustomSize = {};

window.remixCustomBoardSize = function remixCustomBoardSize() {
  window.remixEnsureCustomBoardSettings();
  return {
    width: window.pudding_settings.CustomBoardWidth | 0,
    height: window.pudding_settings.CustomBoardHeight | 0,
  };
};

window.remixEnsureCustomBoardSettings = function remixEnsureCustomBoardSettings() {
  if (!window.pudding_settings) window.pudding_settings = {};
  let w = Number(window.pudding_settings.CustomBoardWidth);
  let h = Number(window.pudding_settings.CustomBoardHeight);
  if (!Number.isFinite(w)) w = 17;
  if (!Number.isFinite(h)) h = 15;
  w = Math.max(2, Math.min(10000, Math.round(w)));
  h = Math.max(2, Math.min(10000, Math.round(h)));
  window.pudding_settings.CustomBoardWidth = w;
  window.pudding_settings.CustomBoardHeight = h;
  return { width: w, height: h };
};

window.remixHueShiftImageUrl = function remixHueShiftImageUrl(src, hueRotateDeg, done) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function () {
    try {
      const c = document.createElement("canvas");
      c.width = 40;
      c.height = 40;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, 40, 40);
      const imageData = ctx.getImageData(0, 0, 40, 40);
      const d = imageData.data;
      function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;
        if (max === min) return [0, 0, l];
        const delta = max - min;
        const sat = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        let h;
        if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / delta + 2) / 6;
        else h = ((r - g) / delta + 4) / 6;
        return [h, sat, l];
      }
      function hslToRgb(h, s, l) {
        if (s === 0) {
          const v = Math.round(l * 255);
          return [v, v, v];
        }
        function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return [
          Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
          Math.round(hue2rgb(p, q, h) * 255),
          Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
        ];
      }
      const delta = (((hueRotateDeg % 360) + 360) % 360) / 360;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 8) continue;
        const hsl = rgbToHsl(d[i], d[i + 1], d[i + 2]);
        if (hsl[1] < 0.08 || hsl[2] > 0.92) continue;
        const rgb = hslToRgb((hsl[0] + delta) % 1, hsl[1], hsl[2]);
        d[i] = rgb[0];
        d[i + 1] = rgb[1];
        d[i + 2] = rgb[2];
      }
      ctx.putImageData(imageData, 0, 0);
      done(c.toDataURL("image/png"));
    } catch (e) {
      console.error("CustomSize: hue shift failed", e);
      done(src);
    }
  };
  img.onerror = function () {
    done(src);
  };
  img.src = src;
};

window.remixReapplyCustomSizeIfSelected = function remixReapplyCustomSizeIfSelected() {
  const root = document.querySelector("#size");
  if (!root || typeof window.CUSTOM_SIZE_INDEX !== "number") return;
  let selected = -1;
  for (let i = 0; i < root.children.length; i++) {
    if (((root.children[i].className || "") + "").indexOf("tuJOWd") >= 0) {
      selected = i;
      break;
    }
  }
  if (selected !== window.CUSTOM_SIZE_INDEX) return;
  if (typeof window.selectNewSizeSettingAndHardReset === "function") {
    window.selectNewSizeSettingAndHardReset(window.CUSTOM_SIZE_INDEX);
  } else if (typeof window.puddingMenuSelect === "function") {
    window.puddingMenuSelect("size", window.CUSTOM_SIZE_INDEX);
  }
};

window.remixInjectCustomBoardSettingsUi = function remixInjectCustomBoardSettingsUi() {
  const panel = document.getElementById("remix-custom-panel-board");
  if (!panel) return;
  window.remixEnsureCustomBoardSettings();
  let card = document.getElementById("remix-custom-board-card");
  if (!card) {
    card = document.createElement("div");
    card.id = "remix-custom-board-card";
    card.className = "remix-custom-card";
    card.innerHTML =
      '<div class="remix-custom-title">Custom board</div>' +
      '<div class="remix-custom-hint">Used when the red Custom size icon is selected (2–10000)</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">' +
      '<label>Width <input id="remix-custom-board-w" type="number" min="2" max="10000" step="1" /></label>' +
      '<label>Height <input id="remix-custom-board-h" type="number" min="2" max="10000" step="1" /></label>' +
      "</div>";
    panel.appendChild(card);
    function commit() {
      const wEl = document.getElementById("remix-custom-board-w");
      const hEl = document.getElementById("remix-custom-board-h");
      if (!wEl || !hEl) return;
      window.pudding_settings.CustomBoardWidth = Number(wEl.value);
      window.pudding_settings.CustomBoardHeight = Number(hEl.value);
      window.remixEnsureCustomBoardSettings();
      wEl.value = String(window.pudding_settings.CustomBoardWidth);
      hEl.value = String(window.pudding_settings.CustomBoardHeight);
      if (typeof window.saveSettings === "function") window.saveSettings();
      window.remixReapplyCustomSizeIfSelected();
    }
    document.getElementById("remix-custom-board-w").addEventListener("change", commit);
    document.getElementById("remix-custom-board-h").addEventListener("change", commit);
  }
  document.getElementById("remix-custom-board-w").value = String(
    window.pudding_settings.CustomBoardWidth
  );
  document.getElementById("remix-custom-board-h").value = String(
    window.pudding_settings.CustomBoardHeight
  );
};

window.CustomSize.runCodeBefore = function () {
  window.remixEnsureCustomBoardSettings();
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

  const sizeRoot = document.querySelector("#size");
  if (!sizeRoot) {
    window.CUSTOM_SIZE_INDEX = 11;
    return;
  }
  if (window._customSizeIconInserted) {
    if (typeof window.CUSTOM_SIZE_INDEX !== "number") {
      window.CUSTOM_SIZE_INDEX = sizeRoot.children.length - 1;
    }
    return;
  }

  const standard =
    sizeRoot.children[0] && sizeRoot.children[0].src
      ? sizeRoot.children[0].src
      : "https://www.google.com/logos/fnbx/snake_arcade/v3/size_00.png";

  // Append Custom immediately so CUSTOM_SIZE_INDEX is stable for alterSnakeCode.
  const custom = window.uiImage(standard);
  custom.alt = "Custom Size";
  sizeRoot.appendChild(custom);
  window._customSizeIconInserted = true;
  window.CUSTOM_SIZE_INDEX = [...sizeRoot.children].indexOf(custom);
  if (!window.sizeToTxt) window.sizeToTxt = {};
  window.sizeToTxt[window.CUSTOM_SIZE_INDEX] = { name: "Custom" };
  if (typeof window.HandleSize === "function" && !window.HandleSize.__customPatched) {
    const orig = window.HandleSize;
    window.HandleSize = function (size) {
      if (size === window.CUSTOM_SIZE_INDEX) return "Custom size, ";
      return orig(size);
    };
    window.HandleSize.__customPatched = true;
  }

  // Compact (idx 5): Standard + blue hue. Custom: Standard + red hue.
  window.remixHueShiftImageUrl(standard, 200, function (blueUrl) {
    if (sizeRoot.children[5]) sizeRoot.children[5].src = blueUrl;
  });
  window.remixHueShiftImageUrl(standard, -20, function (redUrl) {
    custom.src = redUrl;
  });
};

window.CustomSize.alterSnakeCode = function (code) {
  const idx =
    typeof window.CUSTOM_SIZE_INDEX === "number" ? window.CUSTOM_SIZE_INDEX : 11;

  if (code.indexOf("window.remixCustomBoardSize") >= 0) return code;

  // Tile-budget cases after Enormous (case 10).
  const eCase = code.match(
    /case\s+10:\s*[a-zA-Z0-9_$]+\s*=\s*318000\s*;?\s*break/
  );
  if (eCase) {
    const varName = eCase[0].match(/[a-zA-Z0-9_$]+\s*=/)[0].replace(/\s*=/, "").trim();
    code = code.assertReplace(
      eCase[0],
      eCase[0] +
        `
        case ${idx}:
          ${varName} = (function(){var s=window.remixCustomBoardSize();return Math.max(1,s.width*s.height);})()
          break`
    );
  } else {
    console.error("CustomSize: failed to inject tile-budget case " + idx);
  }

  const dimCase = code.match(
    /case\s+10:\s*[a-zA-Z0-9_$.]+\s*=\s*\{\s*width:\s*600,\s*height:\s*530\s*\}\s*;?\s*break/
  );
  if (dimCase) {
    const holder = dimCase[0].match(/[a-zA-Z0-9_$.]+\s*=/)[0].replace(/\s*=/, "").trim();
    code = code.assertReplace(
      dimCase[0],
      dimCase[0] +
        `
        case ${idx}:
          ${holder} = window.remixCustomBoardSize()
          break`
    );
  } else {
    console.error("CustomSize: failed to inject sizeHolder case " + idx);
  }

  // Mobile square-size list: include custom index with compact-like handling.
  code = code.replace(
    /\[3,\s*4,\s*5\]\.includes\(([^)]+)\)/,
    "[3, 4, 5, " + idx + "].includes($1)"
  );

  // Early width/height path for compact-style sizes (MoreMenu injection).
  const widthRe =
    /([a-zA-Z0-9_$.]+)\s*===\s*5\s*\?\s*12\s*:\s*Math\.floor\(([^)]+)\)/;
  if (widthRe.test(code)) {
    code = code.replace(
      widthRe,
      "$1 === 5 ? 12 : $1 === " +
        idx +
        " ? window.remixCustomBoardSize().width : Math.floor($2)"
    );
  }
  const heightRe =
    /([a-zA-Z0-9_$.]+)\s*===\s*5\s*\?\s*11\s*:\s*Math\.floor\(([^)]+)\)/;
  if (heightRe.test(code)) {
    code = code.replace(
      heightRe,
      "$1 === 5 ? 11 : $1 === " +
        idx +
        " ? window.remixCustomBoardSize().height : Math.floor($2)"
    );
  }

  return code;
};
