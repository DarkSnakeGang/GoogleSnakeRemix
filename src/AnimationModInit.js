////////////////////////////////////////////////////////////////////
// Ultra-only Animation Mod (Animated Colours port for v13)
////////////////////////////////////////////////////////////////////

window.AnimationMod = {};

window.ANIMATED_COLOR_ALT_KEY = null;
window.ANIMATED_COLOR_INDEX = null;

window.animModApplyTheme = function animModApplyTheme() {
  const visiTitle = document.getElementById("visi-title");
  const visiBoxes = document.getElementById("visi-boxes");
  const flashSel = document.getElementById("flash-snake-timing");
  const animTitle = document.getElementById("anim-mod-title");
  const animPanel = document.getElementById("anim-mod-panel");
  if (!animTitle || !animPanel) return;

  const bar =
    (visiTitle && visiTitle.style.backgroundColor) ||
    window.real_topbar_color ||
    "#4a752c";
  const btn =
    (flashSel && flashSel.style.backgroundColor) ||
    window.button_color ||
    "#1155CC";

  animTitle.style.backgroundColor = bar;
  animTitle.style.color = "#fff";
  animPanel.style.backgroundColor =
    (visiBoxes && visiBoxes.style.backgroundColor) || bar;
  animPanel.style.color = "#fff";

  const controlIds = [
    "anim-snake-pattern",
    "anim-bg-pattern",
    "anim-frame-rate",
  ];
  for (let i = 0; i < controlIds.length; i++) {
    const el = document.getElementById(controlIds[i]);
    if (!el) continue;
    el.style.backgroundColor = btn;
    el.style.color = "#fff";
    el.style.borderColor = btn;
  }
};

window.animModSyncColourGate = function animModSyncColourGate() {
  if (!window.animateSnakeGlobals) return;
  const on = !!(
    window.isRainbow &&
    window.ANIMATED_COLOR_ALT_KEY != null &&
    Number(window.snakeRainbowOverride) === Number(window.ANIMATED_COLOR_ALT_KEY)
  );
  window.animateSnakeGlobals.isPatternDisabled = !on;
};

////////////////////////////////////////////////////////////////////
// Pattern + background helpers (ported from AnimatedColors.js)
////////////////////////////////////////////////////////////////////

window.animModInstallPatternFns = function animModInstallPatternFns() {
  function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  function hsvToRgb(h, s, v) {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
    return [r * 255, g * 255, b * 255];
  }

  window.defaultPattern = function defaultPattern() {
    let randColour = "#";
    for (let i = 0; i < 6; i++) randColour += Math.floor(Math.random() * 10);
    const colourArray = [];
    for (let i = 0; i < 504; i++) colourArray[i] = randColour;
    return colourArray;
  };

  window.seizure = function seizure() {
    const colourArray = [];
    const randColour = rgbToHex(
      Math.floor(256 * Math.random()),
      Math.floor(256 * Math.random()),
      Math.floor(256 * Math.random())
    );
    for (let i = 0; i < 10; i++) colourArray[i] = randColour;
    return colourArray;
  };

  window.temporalRainbow = function temporalRainbow(frameNum) {
    const colourArray = [];
    const hue = (frameNum % 60) / 60;
    let rgb = hsvToRgb(hue, 1, 1);
    rgb = [Math.floor(rgb[0]), Math.floor(rgb[1]), Math.floor(rgb[2])];
    const hex = rgbToHex(...rgb);
    for (let i = 0; i < 10; i++) colourArray[i] = hex;
    return colourArray;
  };

  window.rollingRainbow = function rollingRainbow(frameNum) {
    const colourArray = [];
    for (let i = 0; i < 30; i++) {
      const hue = ((frameNum + i * 2) % 60) / 60;
      let rgb = hsvToRgb(hue, 1, 1);
      rgb = [Math.floor(rgb[0]), Math.floor(rgb[1]), Math.floor(rgb[2])];
      colourArray[i] = rgbToHex(...rgb);
    }
    return colourArray;
  };

  window.rollingRainbowRev = function rollingRainbowRev(frameNum) {
    const colourArray = [];
    for (let i = 0; i < 30; i++) {
      const hue = ((frameNum - i * 2 + 60) % 60) / 60;
      let rgb = hsvToRgb(hue, 1, 1);
      rgb = [Math.floor(rgb[0]), Math.floor(rgb[1]), Math.floor(rgb[2])];
      colourArray[i] = rgbToHex(...rgb);
    }
    return colourArray;
  };

  window.strobeRainbow = (function () {
    const colorsSplashes = [];
    return function strobeRainbow() {
      if (Math.random() < 0.2) {
        let splashColour = hsvToRgb(Math.random(), 1, 1);
        splashColour = [
          Math.floor(splashColour[0]),
          Math.floor(splashColour[1]),
          Math.floor(splashColour[2]),
        ];
        colorsSplashes.push({ rgb: splashColour, position: 50, spread: 3 });
      }
      const colourArray = [];
      for (let i = 0; i < 50; i++) {
        let colourTotal = [0, 0, 0];
        let weight = 0.1;
        for (const splash of colorsSplashes) {
          if (Math.abs(splash.position - i) <= splash.spread) {
            const splashWeight = 1 / (Math.abs(splash.position - i) + 1);
            colourTotal = [
              colourTotal[0] + splashWeight * splash.rgb[0],
              colourTotal[1] + splashWeight * splash.rgb[1],
              colourTotal[2] + splashWeight * splash.rgb[2],
            ];
            weight += splashWeight;
          }
        }
        colourArray[i] = rgbToHex(
          Math.floor(colourTotal[0] / weight),
          Math.floor(colourTotal[1] / weight),
          Math.floor(colourTotal[2] / weight)
        );
      }
      for (let i = 0; i < colorsSplashes.length; i++) {
        if (colorsSplashes[i].position > 0) {
          colorsSplashes[i].position--;
        } else {
          colorsSplashes[i].spread++;
          if (colorsSplashes[i].spread > 5 + Math.floor(4 * Math.random())) {
            colorsSplashes.splice(i, 1);
          }
        }
      }
      return colourArray;
    };
  })();

  window.variation = (function () {
    const colorsSplashes = [];
    const baseColour = [0.3, 1, 1];
    const patternLength = 50;
    return function variation(frameNum) {
      for (let n = 0; n < 4; n++) {
        const splashColour = [
          (baseColour[0] + Math.random() * 0.4 - 0.4 + 1) % 1,
          1,
          1,
        ];
        colorsSplashes.push({
          hsv: splashColour,
          position: Math.floor((patternLength - 1) * Math.random()),
          spread: 4,
          aliveTime: 0,
          weightMultiplier: 0.2,
        });
      }
      const colourArray = [];
      for (let i = 0; i < patternLength; i++) {
        let weight = 0.1;
        let hsvTotal = [
          baseColour[0] * weight,
          baseColour[1] * weight,
          baseColour[2] * weight,
        ];
        for (const splash of colorsSplashes) {
          if (Math.abs(splash.position - i) <= splash.spread) {
            const splashWeight =
              splash.weightMultiplier *
              (1 / (Math.abs(splash.position - i) + 1));
            hsvTotal = [
              hsvTotal[0] + splashWeight * splash.hsv[0],
              hsvTotal[1] + splashWeight * splash.hsv[1],
              hsvTotal[2] + splashWeight * splash.hsv[2],
            ];
            weight += splashWeight;
          }
        }
        const hsvColour = [
          hsvTotal[0] / weight,
          hsvTotal[1] / weight,
          0.85 + 0.15 * Math.sin((2 * Math.PI * frameNum) / 120),
        ];
        const segmentColour = hsvToRgb(...hsvColour);
        colourArray[i] = rgbToHex(
          Math.floor(segmentColour[0]),
          Math.floor(segmentColour[1]),
          Math.floor(segmentColour[2])
        );
      }
      for (let i = 0; i < colorsSplashes.length; i++) {
        colorsSplashes[i].position += Math.random() - 0.5;
        colorsSplashes[i].position = Math.min(
          colorsSplashes[i].position,
          patternLength - 1
        );
        colorsSplashes[i].position = Math.max(colorsSplashes[i].position, 0);
        if (colorsSplashes[i].aliveTime < 15) {
          colorsSplashes[i].weightMultiplier += 0.08;
        } else {
          colorsSplashes[i].weightMultiplier -= 0.08;
        }
        colorsSplashes[i].spread += Math.random() - 0.5;
        colorsSplashes[i].spread = Math.max(colorsSplashes[i].spread, 1);
        colorsSplashes[i].aliveTime++;
        if (colorsSplashes[i].aliveTime > 30) colorsSplashes.splice(i, 1);
      }
      return colourArray;
    };
  })();

  window.variationV2 = (function () {
    const baseColour = [0, 1, 1];
    const patternLength = 50;
    const totalWaveCount = 10;
    const waves = [];
    for (let i = 0; i < totalWaveCount; i++) {
      waves.push({
        weight: 0.15 * Math.random(),
        bias: patternLength * Math.random(),
        wavelength: i + 1,
        period: 240 * Math.random() + 1,
        timeBias: 240 * Math.random(),
      });
    }
    return function variationV2(frameNum) {
      const colourArray = [];
      for (let i = 0; i < patternLength; i++) {
        let hue = baseColour[0];
        for (let j = 0; j < totalWaveCount; j++) {
          hue +=
            waves[j].weight *
            Math.sin(
              2 * Math.PI * (1 / waves[j].wavelength) * (i + waves[j].bias)
            ) *
            Math.sin(
              2 *
                Math.PI *
                (1 / waves[j].period) *
                (frameNum + waves[j].timeBias)
            );
        }
        hue = (hue % 1) + 1;
        const vibrance = 0.85 + 0.15 * Math.sin((2 * Math.PI * frameNum) / 120);
        let colour = hsvToRgb(hue, 1, vibrance);
        colour = [Math.floor(colour[0]), Math.floor(colour[1]), Math.floor(colour[2])];
        colourArray[i] = rgbToHex(...colour);
      }
      return colourArray;
    };
  })();

  window.singleColourFunctionCreator = function singleColourFunctionCreator(hexcode) {
    if (!/^#[0-9a-f]{6}$/i.test(hexcode)) hexcode = "#ffffff";
    return function singleColour() {
      const colourArray = [];
      for (let i = 0; i < 10; i++) colourArray[i] = hexcode;
      return colourArray;
    };
  };

  window.randomHexBg = function randomHexBg() {
    let randColour = "#";
    for (let i = 0; i < 6; i++) randColour += Math.floor(Math.random() * 10);
    return randColour;
  };

  window.randomHexSameBg = (function () {
    let currentFrameNum = 0;
    let currentColour = "#FFFFFF";
    return function (a, frameNum) {
      if (frameNum !== currentFrameNum) {
        currentFrameNum = frameNum;
        currentColour = "#";
        for (let i = 0; i < 6; i++) currentColour += Math.floor(Math.random() * 10);
      }
      return currentColour;
    };
  })();

  window.temporalBg = function temporalBg(a, frameNum) {
    const hue = (frameNum % 60) / 60;
    let rgb = hsvToRgb(hue, 1, 1);
    rgb = [Math.floor(rgb[0]), Math.floor(rgb[1]), Math.floor(rgb[2])];
    return rgbToHex(...rgb);
  };

  window.rollingRainbowBg = function rollingRainbowBg(a, frameNum, x, y) {
    const hue = ((frameNum + (x + y) * 2) % 60) / 60;
    let saturation = 0.62;
    let vibrance = 0.84;
    if ((x + y) % 2 === 1) {
      saturation += 0.13;
      vibrance -= 0.13;
    }
    let rgb = hsvToRgb(hue, saturation, vibrance);
    rgb = [Math.floor(rgb[0]), Math.floor(rgb[1]), Math.floor(rgb[2])];
    return rgbToHex(...rgb);
  };

  window.rollingRainbowBgOld = function rollingRainbowBgOld(a, frameNum, x, y) {
    const hue = ((frameNum + (x + y) * 2) % 60) / 60;
    let rgb = hsvToRgb(hue, 1, 1);
    rgb = [Math.floor(rgb[0]), Math.floor(rgb[1]), Math.floor(rgb[2])];
    return rgbToHex(...rgb);
  };

  window.getColourArrayFromCurrentPattern = function getColourArrayFromCurrentPattern(
    frameNum
  ) {
    const name = window.animateSnakeGlobals.currentPatternString;
    const fn = window[name];
    if (typeof fn !== "function") return window.rollingRainbowRev(frameNum);
    return fn(frameNum);
  };

  window.getAnimBgColour = function getAnimBgColour(a, frameNum, x, y) {
    const name = window.animateSnakeGlobals.currentBackgroundPatternString;
    if (!name || name === "none") return "#a2d149";
    const fn = window[name];
    if (typeof fn !== "function") return "#a2d149";
    return fn(a, frameNum, x, y);
  };

  window.updateAnimBackground = function updateAnimBackground(board, frameNum) {
    if (
      !board ||
      !window.animateSnakeGlobals ||
      window.animateSnakeGlobals.isBackgroundPatternDisabled
    ) {
      return;
    }
    const w = board.wb.ka.oa.width;
    const h = board.wb.ka.oa.height;
    const tile = board.wb.ka.ka;
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        board.ka.fillStyle = window.getAnimBgColour(board, frameNum, x, y);
        board.ka.fillRect(x * tile, y * tile, tile, tile);
      }
    }
  };

  /** Re-paint checkerboard from the current theme (native u4E). */
  window.restoreAnimBoardTheme = function restoreAnimBoardTheme(board) {
    board = board || window.__animBoardRef;
    if (!board) return;
    if (typeof window.__animPaintThemeBoard === "function") {
      window.__animPaintThemeBoard(board);
      return;
    }
    // Fallback if paint hook not bound yet (mirrors u4E).
    try {
      const light = c7(board.settings, board.settings.oa, 0);
      const dark = c7(board.settings, board.settings.oa, 1);
      const tile = board.wb.ka.ka;
      const w = board.wb.ka.oa.width;
      const h = board.wb.ka.oa.height;
      const boxes = window.checkboxes && window.checkboxes.checkboxStatuses;
      board.ka.fillStyle = light;
      if (!boxes || boxes.lightTiles) {
        board.ka.fillRect(0, 0, board.ka.canvas.width, board.ka.canvas.height);
      }
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          if ((x + y) % 2 === 0) continue;
          board.ka.fillStyle = dark;
          if (!boxes || boxes.darkTiles) {
            board.ka.fillRect(x * tile, y * tile, tile, tile);
          }
        }
      }
    } catch (_) {
      /* c7 may be out of scope */
    }
  };
};

window.changePatterns = function changePatterns(pattern, backgroundPattern) {
  if (!window.animateSnakeGlobals) return;
  window.animateSnakeGlobals.currentPatternString = pattern;
  window.animateSnakeGlobals.currentBackgroundPatternString = backgroundPattern;
  window.animateSnakeGlobals.cacheMode = [
    "temporalRainbow",
    "rollingRainbow",
    "rollingRainbowRev",
    "none",
  ].includes(pattern);
  if (String(pattern).startsWith("singleColourFunctionCreator")) {
    window.animateSnakeGlobals.cacheMode = true;
  }
  // New pattern → allow head tint even if first colour matches previous.
  window.__animLastHeadHex = null;
  window.animateSnakeGlobals.isBackgroundPatternDisabled =
    backgroundPattern === "none";
  if (window.animateSnakeGlobals.isBackgroundPatternDisabled) {
    if (typeof window.restoreAnimBoardTheme === "function") {
      window.restoreAnimBoardTheme();
    }
  }
  window.animModSyncColourGate();
};

/**
 * Wrap game a7 recolour: ImageData cache + skip huge die sheet on the hot path.
 * Blink/eat/tongue are small; die.png is ~130×4292 and was the main FPS killer.
 */
window.animModBindHeadRecolor = function animModBindHeadRecolor(recolor) {
  if (typeof recolor !== "function") return;
  const cacheOrder = [];

  function cachedRecolor(sprite, fromHex, toHex, threshold) {
    if (!sprite) return;
    if (threshold === undefined) threshold = -1;
    // Deferred-tint sprites (ka>0): keep native path.
    if (sprite.ka > 0) {
      recolor(sprite, fromHex, toHex, threshold);
      return;
    }
    const g = window.animateSnakeGlobals;
    const path = (sprite.oa && sprite.oa.path) || "";
    const key = path + "|" + fromHex + "|" + toHex + "|" + threshold;
    const hit = g && g.cache && g.cache[key];
    if (hit && hit.main && sprite.oa && sprite.oa.ka) {
      try {
        sprite.oa.ka.putImageData(hit.main, 0, 0);
        if (hit.ba && sprite.Ba && sprite.Ba.ka) {
          sprite.Ba.ka.putImageData(hit.ba, 0, 0);
        }
        return;
      } catch (_) {
        /* fall through to full recolour */
      }
    }
    recolor(sprite, fromHex, toHex, threshold);
    if (!g || !sprite.oa || !sprite.oa.ka) return;
    if (!g.cache) g.cache = {};
    try {
      const mainCtx = sprite.oa.ka;
      const entry = {
        main: mainCtx.getImageData(
          0,
          0,
          mainCtx.canvas.width,
          mainCtx.canvas.height
        ),
        ba: null,
      };
      if (sprite.Ba && sprite.Ba.ka) {
        const baCtx = sprite.Ba.ka;
        entry.ba = baCtx.getImageData(
          0,
          0,
          baCtx.canvas.width,
          baCtx.canvas.height
        );
      }
      if (!g.cache[key]) cacheOrder.push(key);
      g.cache[key] = entry;
      const max = g.cacheMode ? 200 : 48;
      while (cacheOrder.length > max) {
        const old = cacheOrder.shift();
        delete g.cache[old];
      }
    } catch (_) {
      /* tainted canvas / size mismatch — skip cache */
    }
  }

  window.updateAnimHeadColour = function updateAnimHeadColour(face, headColour) {
    face = face || window.__animFaceRef;
    if (!face || !headColour) return;
    if (window.__animLastHeadHex === headColour) return;
    window.__animLastHeadHex = headColour;

    // Hot path: blink + eat + tongue only. Skip die (face.Ba) — enormous sheet.
    cachedRecolor(face.oa, "#5282F2", headColour);
    cachedRecolor(face.Aa, "#5282F2", headColour);
    const hue = _.AKd(headColour);
    const tongue = _.AKd("#C73104");
    tongue[0] = (hue[0] + 180) % 360;
    cachedRecolor(
      face.wa,
      "#C73104",
      _.HG(_.yKd(tongue[0], tongue[1], tongue[2]))
    );
  };
};

window.animModApplyFrameRate = function animModApplyFrameRate(raw) {
  const frameRate = parseFloat(raw);
  if (isNaN(frameRate) || frameRate < 0.00001) return false;
  if (frameRate > 60) {
    if (!confirm("This frame rate may be buggy/laggy")) return false;
  }
  window.animateSnakeGlobals.framesPerSecond = frameRate;
  const cur = document.getElementById("anim-current-frame-rate");
  if (cur) cur.textContent = String(frameRate);
  return true;
};

window.ANIMATED_COLOR_ICON =
  "data:image/png;base64,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";

window.animModInjectPanel = function animModInjectPanel() {
  const drag = document.getElementById("delete-stuff-draggable");
  if (!drag || document.getElementById("anim-mod-panel")) return;

  drag.style.width = "740px";

  const kids = [...drag.children];
  let visiWrap = null;
  for (let i = 0; i < kids.length; i++) {
    if (kids[i].id === "drag-handle") continue;
    if (kids[i].querySelector && kids[i].querySelector("#visi-title")) {
      visiWrap = kids[i];
      break;
    }
  }
  if (!visiWrap && kids.length > 1) visiWrap = kids[1];
  if (visiWrap) {
    visiWrap.style.display = "inline-block";
    visiWrap.style.verticalAlign = "top";
    visiWrap.style.boxSizing = "border-box";
  }

  const wrap = document.createElement("div");
  wrap.id = "anim-mod-wrap";
  wrap.style.cssText =
    "display:inline-block;vertical-align:top;padding:10px;width:350px;margin:0;box-sizing:border-box;";
  const controlStyle =
    "margin-top:4px;width:100%;max-width:300px;box-sizing:border-box;" +
    "background-color:#1155CC;color:white;font-family:Roboto,Arial,sans-serif;" +
    "font-size:inherit;border:none;border-radius:0.375rem;padding:3px 6px;";
  const fpsStyle =
    "width:3.5em;background-color:#1155CC;color:white;font-family:Roboto,Arial,sans-serif;" +
    "font-size:inherit;border:none;border-radius:0.375rem;padding:3px 6px;text-align:center;";

  wrap.innerHTML =
    '<div id="anim-mod-title" class="form-check-label" style="text-align:center;padding:5px;background-color:rgb(74,117,44);color:white;font-size:20px;">Animation Mod</div>' +
    '<div id="anim-mod-panel" class="form-check-label" style="background-color:rgb(74,117,44);margin-top:5px;padding:8px 10px 12px;color:white;font-family:Roboto,Arial,sans-serif;">' +
    '<p class="form-check-label" style="margin:0 0 8px;"><span style="color:#ffb4b4;">Warning: flashing lights.</span></p>' +
    '<div class="form-check-label" style="margin:0 0 8px;">Snake Pattern<br>' +
    '<span style="opacity:0.9;font-size:0.9em;">Requires the Animated snake colour.</span><br>' +
    '<select id="anim-snake-pattern" style="' +
    controlStyle +
    '">' +
    '<option value="temporalRainbow">temporalRainbow</option>' +
    '<option value="rollingRainbow">rollingRainbow</option>' +
    '<option value="rollingRainbowRev" selected>rollingRainbowRev</option>' +
    "</select>" +
    "</div>" +
    '<div class="form-check-label" style="margin:0 0 8px;">Background Pattern<br>' +
    '<select id="anim-bg-pattern" style="' +
    controlStyle +
    '">' +
    '<option value="none" selected>none</option>' +
    '<option value="randomHexBg">randomHexBg</option>' +
    '<option value="randomHexSameBg">randomHexSameBg</option>' +
    '<option value="temporalBg">temporalBg</option>' +
    '<option value="rollingRainbowBg">rollingRainbowBg</option>' +
    '<option value="rollingRainbowBgOld">rollingRainbowBgOld</option>' +
    "</select>" +
    "</div>" +
    '<div class="form-check-label" style="margin:0 0 4px;">Frame rate ' +
    '<input id="anim-frame-rate" type="text" inputmode="decimal" size="3" value="30" style="' +
    fpsStyle +
    '">' +
    ' <span>| Current Value: <span id="anim-current-frame-rate">30</span></span>' +
    "</div>" +
    "</div>";

  drag.appendChild(wrap);

  const snakeSel = document.getElementById("anim-snake-pattern");
  const bgSel = document.getElementById("anim-bg-pattern");
  const fpsInput = document.getElementById("anim-frame-rate");

  if (snakeSel) {
    snakeSel.addEventListener("change", function () {
      window.changePatterns(
        this.value,
        window.animateSnakeGlobals.currentBackgroundPatternString
      );
    });
  }
  if (bgSel) {
    bgSel.addEventListener("change", function () {
      window.changePatterns(
        window.animateSnakeGlobals.currentPatternString,
        this.value
      );
    });
  }
  function onFps() {
    window.animModApplyFrameRate(fpsInput.value);
  }
  if (fpsInput) {
    // Text field (no spinner). Apply on commit — not on every keystroke.
    fpsInput.addEventListener("change", onFps);
    fpsInput.addEventListener("blur", onFps);
    fpsInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        onFps();
        fpsInput.blur();
      }
    });
  }

  window.changePatterns(
    (snakeSel && snakeSel.value) || "rollingRainbowRev",
    (bgSel && bgSel.value) || "none"
  );
  window.animModApplyTheme();
};

////////////////////////////////////////////////////////////////////
// RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.AnimationMod.runCodeBefore = function () {
  window.animModInstallPatternFns();

  const colourArr = [
    "#4E7CF6",
    "#5499C7",
    "#AF7AC5",
    "#E74C3C",
    "#F39C12",
    "#CCC31C",
    "#27AE60",
  ];
  window.animateSnakeGlobals = {
    startPlayback: true,
    startingTime: performance.now(),
    framesPerSecond: 30,
    frameDoneSoFar: -1,
    currentColourArray: colourArr.slice(),
    cacheMode: true,
    cache: {},
    currentPatternString: "rollingRainbowRev",
    isPatternDisabled: true,
    currentBackgroundPatternString: "none",
    isBackgroundPatternDisabled: true,
  };

  window.changePatterns("rollingRainbowRev", "none");
};

////////////////////////////////////////////////////////////////////
// ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.AnimationMod.alterSnakeCode = function (code) {
  const originalCode = code;
  try {
    if (!window.animateSnakeGlobals) {
      window.AnimationMod.runCodeBefore();
    }

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
    if (colorRoot && !window._animColorIconInserted) {
      const randomEl = colorRoot.lastChild;
      const iconSrc = window.ANIMATED_COLOR_ICON;
      const img = window.uiImage(iconSrc);
      img.alt = "Animated";
      img.title = "Animated";
      colorRoot.insertBefore(img, randomEl);
      window.ANIMATED_COLOR_INDEX = [...colorRoot.children].indexOf(img);
      window.allColorsLength = colorRoot.children.length - 1;

      const nextKey =
        window.rainbowAlts && typeof window.rainbowAlts === "object"
          ? Math.max.apply(
              null,
              Object.keys(window.rainbowAlts).map(Number).concat([0])
            ) + 1
          : 12;
      window.ANIMATED_COLOR_ALT_KEY = nextKey;
      if (!window.rainbowAlts) window.rainbowAlts = {};
      window.rainbowAlts[nextKey] = {
        name: "Animated",
        set: window.animateSnakeGlobals.currentColourArray,
        icon: iconSrc,
        yinyang: 10,
      };
      window._animColorIconInserted = true;

      colorRoot.addEventListener("click", function () {
        setTimeout(window.animModSyncColourGate, 0);
      });
    }

    if (code.indexOf("window.__animModPatched") >= 0) return code;

    // Literal first-occurrence replace only — never RegExp (needles contain '.')
    function safeReplaceOnce(label, needle, replacement) {
      try {
        const i = code.indexOf(needle);
        if (i < 0) {
          console.error("AnimationMod: missing " + label);
          return false;
        }
        const next = code.slice(0, i) + replacement + code.slice(i + needle.length);
        try {
          // eslint-disable-next-line no-new-func
          new Function(next);
        } catch (syntaxErr) {
          console.error(
            "AnimationMod: patch breaks syntax: " + label,
            syntaxErr && syntaxErr.message
          );
          return false;
        }
        code = next;
        return true;
      } catch (e) {
        console.error("AnimationMod: failed " + label, e);
        return false;
      }
    }

    // Capture face + bind cached head recolour (a7 in scope). Classic (wa===0)
    // takes a different branch, so patch both.
    safeReplaceOnce(
      "face-ref-rainbow",
      "b=a.Ga;var c=a.wb.oa.Sc;",
      "b=a.Ga;window.__animFaceRef=b;window.__animGameRef=a;" +
        "if(window.animModBindHeadRecolor)window.animModBindHeadRecolor(a7);" +
        "var c=a.wb.oa.Sc;"
    );

    safeReplaceOnce(
      "face-ref-classic",
      "b=a.Ga,C3E(b.oa),C3E(b.Aa),C3E(b.Ba),C3E(b.wa);",
      "b=a.Ga,window.__animFaceRef=b," +
        "(window.animModBindHeadRecolor&&window.animModBindHeadRecolor(a7))," +
        "C3E(b.oa),C3E(b.Aa),C3E(b.Ba),C3E(b.wa);"
    );

    safeReplaceOnce(
      "u4E-board-ref",
      "u4E=function(a){a.ka.fillStyle=c7(a.settings,a.settings.oa,0);",
      "u4E=function(a){window.__animBoardRef=a;window.__animPaintThemeBoard=u4E;" +
        "a.ka.fillStyle=c7(a.settings,a.settings.oa,0);"
    );

    // Frame clock + background: run for every snake colour (Ja always called).
    safeReplaceOnce(
      "Ja-frame-bg",
      "Ja(a,b,c,d,e=!0){",
      "Ja(a,b,c,d,e=!0){" +
        "if(window.animateSnakeGlobals){" +
        "if(this.ticks==0){" +
        "window.animateSnakeGlobals.startPlayback=true;" +
        "window.animateSnakeGlobals.startingTime=performance.now();" +
        "window.animateSnakeGlobals.frameDoneSoFar=-1;" +
        "window.animateSnakeGlobals.__lastColourFrame=-1;" +
        "window.__animLastHeadHex=null;" +
        "}" +
        "if(window.animateSnakeGlobals.startPlayback){" +
        "var __afn=Math.floor((performance.now()+(0.5*1000/window.animateSnakeGlobals.framesPerSecond)" +
        "-window.animateSnakeGlobals.startingTime)/(1000/window.animateSnakeGlobals.framesPerSecond));" +
        "if(__afn!==window.animateSnakeGlobals.frameDoneSoFar){" +
        "window.animateSnakeGlobals.frameDoneSoFar=__afn;" +
        "window.animateSnakeGlobals.__lastFrameNum=__afn;" +
        "if(typeof window.updateAnimBackground==='function'&&window.__animBoardRef)" +
        "window.updateAnimBackground(window.__animBoardRef,__afn);" +
        "}" +
        "}" +
        "}"
    );

    // Snake body colours only when Animated rainbow path is active.
    const gAssign = "var g=d?r3E:q3E;";
    const inject =
      "if(window.animModSyncColourGate)window.animModSyncColourGate();" +
      "if(window.animateSnakeGlobals&&window.animateSnakeGlobals.startPlayback" +
      "&&!window.animateSnakeGlobals.isPatternDisabled){" +
      "var __afn=window.animateSnakeGlobals.__lastFrameNum;" +
      "if(typeof __afn!=='number')__afn=Math.floor((performance.now()" +
      "+(0.5*1000/window.animateSnakeGlobals.framesPerSecond)" +
      "-window.animateSnakeGlobals.startingTime)/(1000/window.animateSnakeGlobals.framesPerSecond));" +
      "if(__afn!==window.animateSnakeGlobals.__lastColourFrame){" +
      "window.animateSnakeGlobals.__lastColourFrame=__afn;" +
      "var __cols=window.getColourArrayFromCurrentPattern(__afn);" +
      "var __dest=window.animateSnakeGlobals.currentColourArray;" +
      "__dest.length=0;" +
      "for(var __ai=0;__ai<__cols.length;__ai++)__dest.push(__cols[__ai]);" +
      "if(this.oa)this.oa.Sc=__dest[0];" +
      "if(typeof window.updateAnimHeadColour==='function'&&window.__animFaceRef)" +
      "window.updateAnimHeadColour(window.__animFaceRef,__dest[0]);" +
      "}" +
      "}" +
      gAssign;
    safeReplaceOnce("rainbow-hijack", gAssign, inject);

    code = "window.__animModPatched=true;" + code;
    try {
      // eslint-disable-next-line no-new-func
      new Function(code);
    } catch (syntaxErr) {
      console.error("AnimationMod: final SyntaxError", syntaxErr);
      return originalCode;
    }
    return code;
  } catch (e) {
    console.error("AnimationMod.alterSnakeCode failed", e);
    return originalCode;
  }
};

////////////////////////////////////////////////////////////////////
// RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.AnimationMod.runCodeAfter = function () {
  window.animModInjectPanel();
  window.animModApplyTheme();
  window.animModSyncColourGate();
};
