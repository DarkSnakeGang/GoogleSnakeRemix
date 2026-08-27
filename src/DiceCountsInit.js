window.DiceCounts = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.DiceCounts.runCodeBefore = function () {
  window.NATIVE_DICE_ICON =
    "https://www.google.com/logos/fnbx/snake_arcade/v18/count_04.png";

  // Hue-rotate the red native dice → blue/green. Preserve lightness & white pips.
  window.remixHueShiftDiceIcon = function remixHueShiftDiceIcon(hueRotateDeg, done) {
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
          const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
          let h;
          if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
          else if (max === g) h = ((b - r) / delta + 2) / 6;
          else h = ((r - g) / delta + 4) / 6;
          return [h, s, l];
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
          // Keep white pips / near-gray outlines untouched.
          if (hsl[1] < 0.12 || hsl[2] > 0.88) continue;
          const rgb = hslToRgb((hsl[0] + delta) % 1, hsl[1], hsl[2]);
          d[i] = rgb[0];
          d[i + 1] = rgb[1];
          d[i + 2] = rgb[2];
        }

        ctx.putImageData(imageData, 0, 0);
        done(c.toDataURL("image/png"));
      } catch (e) {
        console.error("DiceCounts: hue shift failed", e);
        done(window.NATIVE_DICE_ICON);
      }
    };
    img.onerror = function () {
      done(window.NATIVE_DICE_ICON);
    };
    img.src = window.NATIVE_DICE_ICON;
  };

  // Black dice: crush body to near-black, keep white pips.
  window.remixBlackenDiceIcon = function remixBlackenDiceIcon(done) {
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
          const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
          let h;
          if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
          else if (max === g) h = ((b - r) / delta + 2) / 6;
          else h = ((r - g) / delta + 4) / 6;
          return [h, s, l];
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

        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] < 8) continue;
          const hsl = rgbToHsl(d[i], d[i + 1], d[i + 2]);
          if (hsl[1] < 0.12 || hsl[2] > 0.88) continue;
          const l = Math.max(0.06, Math.min(0.22, hsl[2] * 0.35));
          const rgb = hslToRgb(hsl[0], 0.04, l);
          d[i] = rgb[0];
          d[i + 1] = rgb[1];
          d[i + 2] = rgb[2];
        }

        ctx.putImageData(imageData, 0, 0);
        done(c.toDataURL("image/png"));
      } catch (e) {
        console.error("DiceCounts: blacken failed", e);
        done(window.NATIVE_DICE_ICON);
      }
    };
    img.onerror = function () {
      done(window.NATIVE_DICE_ICON);
    };
    img.src = window.NATIVE_DICE_ICON;
  };

  window.remixEnsureBlackDiceSettings = function remixEnsureBlackDiceSettings() {
    if (!window.pudding_settings || typeof window.pudding_settings !== "object") {
      window.pudding_settings = {};
    }
    let min = Number(window.pudding_settings.BlackDiceMin);
    let max = Number(window.pudding_settings.BlackDiceMax);
    if (!Number.isFinite(min)) min = 6;
    if (!Number.isFinite(max)) max = 24;
    min = Math.max(1, Math.min(10000, Math.floor(min)));
    max = Math.max(1, Math.min(10000, Math.floor(max)));
    if (min > max) {
      const t = min;
      min = max;
      max = t;
    }
    window.pudding_settings.BlackDiceMin = min;
    window.pudding_settings.BlackDiceMax = max;
    return { min: min, max: max };
  };

  window.remixBlackDiceRoll = function remixBlackDiceRoll() {
    const range = window.remixEnsureBlackDiceSettings();
    return (
      range.min + Math.floor(Math.random() * (range.max - range.min + 1))
    );
  };

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

  window.remixIsColoredDice = function remixIsColoredDice(ka) {
    return (
      ka === window.BLUE_DICE_COUNT ||
      ka === window.GREEN_DICE_COUNT ||
      ka === window.BLACK_DICE_COUNT
    );
  };

  window.remixIsDiceLike = function remixIsDiceLike(ka) {
    return ka === 4 || window.remixIsColoredDice(ka);
  };

  window.remixColoredDiceRoll = function remixColoredDiceRoll(ka) {
    if (ka === window.BLUE_DICE_COUNT) {
      return 1 + Math.floor(Math.random() * 12);
    }
    if (ka === window.GREEN_DICE_COUNT) {
      return 4 + Math.floor(Math.random() * 6);
    }
    if (ka === window.BLACK_DICE_COUNT) {
      return window.remixBlackDiceRoll();
    }
    return null;
  };

  window.remixDiceSpawnCount = function remixDiceSpawnCount(ka, fallback) {
    const rolled = window.remixColoredDiceRoll(ka);
    return rolled == null ? fallback : rolled;
  };

  window.remixTopBarCountIcon = function remixTopBarCountIcon(src) {
    const img = document.createElement("img");
    img.src = src;
    // Match native scoreboard count sprites (not menu uiImage 40×40).
    // Do not include LaTyvd — that class is display:none and is only for
    // native sprites that O7E toggles. MoreMenu appends this icon visible.
    img.className = "XUtzXd WwRsj";
    img.draggable = false;
    return img;
  };

  window.remixRefreshCountImgArr = function remixRefreshCountImgArr() {
    const root = document.querySelector("#count");
    if (!root) return;
    window.count_img_arr = Array.from(root.children).map(function (el) {
      return el.src;
    });
  };

  window.remixRefreshHudCountIcon = function remixRefreshHudCountIcon(index, url) {
    if (typeof index !== "number" || !url) return;
    if (window.count_img_arr) {
      window.count_img_arr[index] = url;
    } else {
      window.remixRefreshCountImgArr();
    }

    let selected = -1;
    try {
      const ka =
        window.__remixGame && window.__remixGame.settings
          ? window.__remixGame.settings.ka
          : null;
      if (typeof ka === "number") selected = ka;
    } catch (_e) {}
    try {
      const root = document.querySelector("#count");
      if (root) {
        const fromDom = [...root.children].findIndex(function (c) {
          return ((c.className || "") + "").indexOf("tuJOWd") >= 0;
        });
        if (fromDom >= 0) selected = fromDom;
      }
    } catch (_e2) {}
    if (selected !== index) return;

    try {
      const disp = document.body.getElementsByClassName("UJhXPd wSwbef EWyEF")[0];
      if (disp) {
        let target = null;
        for (let i = 0; i < disp.children.length; i++) {
          const child = disp.children[i];
          if (!child || child.tagName !== "IMG") continue;
          const cls = child.className || "";
          const src = child.src || "";
          const isCountSprite =
            cls.indexOf("WwRsj") >= 0 ||
            cls.indexOf("DqMRee") >= 0 ||
            /count_\d+/.test(src) ||
            src.indexOf("data:image") === 0;
          if (!isCountSprite) continue;
          if (!target) {
            target = child;
            child.src = url;
            child.className = "XUtzXd WwRsj";
            child.classList.remove("LaTyvd");
            child.style.display = "";
            child.style.left = "";
            child.style.position = "";
            child.removeAttribute("width");
            child.removeAttribute("height");
          } else {
            // Native scoreboard keeps extra count_* sprites; hide them for colored dice.
            child.style.display = "none";
          }
        }
        if (!target && window.remixTopBarCountIcon) {
          disp.appendChild(window.remixTopBarCountIcon(url));
        }
      }
    } catch (_e4) {}
  };

  if (window._remixDiceCountsInserted) return;

  const countRoot = document.querySelector("#count");
  if (!countRoot) return;

  window.remixEnsureBlackDiceSettings();

  const blueImg = window.uiImage(window.NATIVE_DICE_ICON);
  blueImg.alt = "Blue Dice";
  const greenImg = window.uiImage(window.NATIVE_DICE_ICON);
  greenImg.alt = "Green Dice";
  const blackImg = window.uiImage(window.NATIVE_DICE_ICON);
  blackImg.alt = "Black Dice";
  countRoot.appendChild(blueImg);
  countRoot.appendChild(greenImg);
  countRoot.appendChild(blackImg);
  window.BLUE_DICE_COUNT = [...countRoot.children].indexOf(blueImg);
  window.GREEN_DICE_COUNT = [...countRoot.children].indexOf(greenImg);
  window.BLACK_DICE_COUNT = [...countRoot.children].indexOf(blackImg);
  window._remixDiceCountsInserted = true;

  // Native dice ~hue 11°. Rotate to blue (~215°) / green (~125°); blacken for Black.
  // TopBar snapshots count_img_arr at alter-time (still red) — refresh on tint.
  window.remixHueShiftDiceIcon(204, function (url) {
    blueImg.src = url;
    window.remixRefreshHudCountIcon(window.BLUE_DICE_COUNT, url);
  });
  window.remixHueShiftDiceIcon(114, function (url) {
    greenImg.src = url;
    window.remixRefreshHudCountIcon(window.GREEN_DICE_COUNT, url);
  });
  window.remixBlackenDiceIcon(function (url) {
    blackImg.src = url;
    window.remixRefreshHudCountIcon(window.BLACK_DICE_COUNT, url);
  });

  function onColoredDiceSelected() {
    const idx = [...countRoot.children].indexOf(this);
    if (!window.remixIsColoredDice(idx)) return;
    const src = this.src;
    if (src) window.remixRefreshHudCountIcon(idx, src);
  }
  blueImg.addEventListener("click", onColoredDiceSelected);
  greenImg.addEventListener("click", onColoredDiceSelected);
  blackImg.addEventListener("click", onColoredDiceSelected);

  window.remixRefreshCountImgArr();

  if (!window.countToTxt) window.countToTxt = {};
  window.countToTxt[window.BLUE_DICE_COUNT] = { name: "Blue Dice" };
  window.countToTxt[window.GREEN_DICE_COUNT] = { name: "Green Dice" };
  window.countToTxt[window.BLACK_DICE_COUNT] = { name: "Black Dice" };

  if (
    typeof window.HandleCount === "function" &&
    !window.HandleCount.__dicePatched
  ) {
    const orig = window.HandleCount;
    window.HandleCount = function (count) {
      if (count === window.BLUE_DICE_COUNT) return "Blue Dice, ";
      if (count === window.GREEN_DICE_COUNT) return "Green Dice, ";
      if (count === window.BLACK_DICE_COUNT) return "Black Dice, ";
      return orig(count);
    };
    window.HandleCount.__dicePatched = true;
  }

  // Black Dice spawn range UI lives in main Pudding Settings (not Custom Bowl).
  window.remixSyncBlackDiceSettingsUi = function remixSyncBlackDiceSettingsUi() {
    const range = window.remixEnsureBlackDiceSettings();
    const minEl = document.getElementById("black-dice-min");
    const maxEl = document.getElementById("black-dice-max");
    if (typeof window.remixSetNumberInputValue === "function") {
      window.remixSetNumberInputValue(minEl, range.min);
      window.remixSetNumberInputValue(maxEl, range.max);
    } else {
      if (minEl) minEl.value = String(range.min);
      if (maxEl) maxEl.value = String(range.max);
    }
  };

  window.remixInjectBlackDiceSettingsUi = function remixInjectBlackDiceSettingsUi() {
    if (document.getElementById("black-dice-settings")) {
      window.remixSyncBlackDiceSettingsUi();
      return;
    }
    const settingsRoot =
      document.getElementsByClassName("sEOCsb")[0] ||
      document.getElementById("settings-box") ||
      null;
    if (!settingsRoot) return;

    window.remixEnsureBlackDiceSettings();
    const block = document.createElement("div");
    block.id = "black-dice-settings";
    block.style.cssText =
      "margin:6px 3px;padding:8px 10px;border-radius:6px;" +
      "background:rgba(0,0,0,0.18);border:1px solid rgba(255,255,255,0.14);" +
      "color:white;font-family:Roboto,Arial,sans-serif;";
    block.innerHTML =
      '<div style="font-size:14px;font-weight:bold;margin-bottom:4px;">Black Dice spawn range</div>' +
      '<div style="font-size:12px;opacity:0.85;margin-bottom:8px;">Fruits spawned when the last apple is eaten (1–10000)</div>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">' +
      '<label style="font-size:13px;margin:0;">Min ' +
      '<input id="black-dice-min" type="number" min="1" max="10000" step="1" ' +
      'style="width:5.5em;margin-left:6px;padding:3px 6px;border-radius:4px;border:1px solid #ccc;" />' +
      "</label>" +
      '<label style="font-size:13px;margin:0;">Max ' +
      '<input id="black-dice-max" type="number" min="1" max="10000" step="1" ' +
      'style="width:5.5em;margin-left:6px;padding:3px 6px;border-radius:4px;border:1px solid #ccc;" />' +
      "</label>" +
      "</div>";

    const anchor =
      document.getElementById("TimerSettings") ||
      document.getElementById("CustomBowlFruits");
    if (anchor && anchor.parentElement) {
      if (anchor.nextSibling) {
        anchor.parentElement.insertBefore(block, anchor.nextSibling);
      } else {
        anchor.parentElement.appendChild(block);
      }
    } else {
      settingsRoot.appendChild(block);
    }

    function commit() {
      const minEl = document.getElementById("black-dice-min");
      const maxEl = document.getElementById("black-dice-max");
      if (!minEl || !maxEl) return;
      window.pudding_settings.BlackDiceMin = Number(minEl.value);
      window.pudding_settings.BlackDiceMax = Number(maxEl.value);
      window.remixEnsureBlackDiceSettings();
      window.remixSyncBlackDiceSettingsUi();
      if (typeof window.saveSettings === "function") window.saveSettings();
    }
    const minInput = document.getElementById("black-dice-min");
    const maxInput = document.getElementById("black-dice-max");
    if (typeof window.remixStabilizeNumberInput === "function") {
      window.remixStabilizeNumberInput(minInput);
      window.remixStabilizeNumberInput(maxInput);
    }
    minInput.addEventListener("change", commit);
    maxInput.addEventListener("change", commit);
    window.remixSyncBlackDiceSettingsUi();
  };

  setTimeout(function () {
    window.remixInjectBlackDiceSettingsUi();
  }, 0);
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.DiceCounts.alterSnakeCode = function (code) {
  // Narrow MoreMenu custom layouts to indices 7..12 so blue/green don't
  // hit the off-board fallthrough. Then handle colored-dice start placement.
  if (code.match(/if\(([a-zA-Z0-9_$.]+) > 6\) \{/)) {
    code = code.assertReplace(
      /if\(([a-zA-Z0-9_$.]+) > 6\) \{/,
      "if($1 > 6 && $1 <= 12) {"
    );
  } else {
    console.error("DiceCounts: failed to narrow MoreMenu count > 6 gate");
  }

  // Native reset: a = key/sokoban/portal/poison (or chess), b = one/dice/bomb.
  // if(a) places -1,-2 and -1,+2, then extra apples when !b. Colored dice must
  // count as b so Key/Sokoban start like Dice (two apples), not the !b extras.
  if (
    code.match(
      /b=this\.settings\.ka===0\|\|this\.settings\.ka===4\|\|this\.settings\.ka===5/
    )
  ) {
    code = code.assertReplace(
      /b=this\.settings\.ka===0\|\|this\.settings\.ka===4\|\|this\.settings\.ka===5/,
      "b=this.settings.ka===0||this.settings.ka===4||this.settings.ka===5||(window.remixIsColoredDice&&window.remixIsColoredDice(this.settings.ka))"
    );
  } else {
    console.error("DiceCounts: failed to extend reset b (one/dice/bomb) for colored dice");
  }

  // After MoreMenu's `} else if(a)` — classic colored dice uses +0,+0 like Dice.
  // When a is set, fall through to the native two-apple body (b now includes us).
  const countGate = code.match(/if\(([a-zA-Z0-9_$.]+) > 6 && \1 <= 12\)/);
  const stemMatch = code.match(
    /(this\.[a-zA-Z0-9_$]{1,8}\.push\([a-zA-Z0-9_$]{1,8}\(this,)/
  );
  if (countGate && stemMatch && code.match(/\} else if\(a\)/)) {
    const countExpr = countGate[1];
    const stem = stemMatch[1];
    const colored = `window.remixIsColoredDice&&window.remixIsColoredDice(${countExpr})`;
    code = code.assertReplace(
      /\} else if\(a\)/,
      `} else if(${colored}&&!a) {
          ${stem} +0, +0));
        } else if(a)`
    );
  } else {
    console.error("DiceCounts: failed to inject colored-dice start placement");
  }

  // Native last-apple refill for Dice is NOT Mn — Mn early-returns for dice-like
  // counts. Refill is: ka===4 ? … || (tdF(this, roll), play) : tally…
  // Extend that path so blue/green roll 1–12 / 4–9 via tdF.
  const diceRefill = code.match(
    /this\.settings\.ka===4\?odF\(this\)!==0\|\|ecF\(this\.settings\)\s*&&\s*rdF\(this\)<=0\|\|\(tdF\(this,Math\.ceil\(Math\.random\(\)\*6\)\),odF\(this\)>0\s*&&\s*([a-zA-Z0-9_$.]+)\.play\(\)\)/
  );
  if (diceRefill) {
    const sound = diceRefill[1];
    code = code.assertReplace(
      diceRefill[0],
      `(this.settings.ka===4||(window.remixIsColoredDice&&window.remixIsColoredDice(this.settings.ka)))?odF(this)!==0||ecF(this.settings) && rdF(this)<=0||(tdF(this,this.settings.ka===4?Math.ceil(Math.random()*6):(window.remixColoredDiceRoll(this.settings.ka)||1)),odF(this)>0 && ${sound}.play())`
    );
  } else if (code.match(/a\.settings\.ka===4\?r7E\(a\)===0&&s7E\(a\)/)) {
    code = code.assertReplace(
      /a\.settings\.ka===4\?r7E\(a\)===0&&s7E\(a\)/,
      `(a.settings.ka===4||(window.remixIsColoredDice&&window.remixIsColoredDice(a.settings.ka)))?r7E(a)===0&&(a.settings.ka===4?s7E(a):u7E(a,window.remixColoredDiceRoll(a.settings.ka)||1))`
    );
  } else {
    console.error("DiceCounts: failed to find native dice tdF/s7E refill path");
  }

  // Mn still early-returns for dice-like; keep spawn-count wrap for safety on
  // any non-dice path that might still call Mn with a count.
  if (code.match(/Xh=this\.Mn\(vd,!Ni,null\)/)) {
    code = code.assertReplace(
      /Xh=this\.Mn\(vd,!Ni,null\)/g,
      `Xh=this.Mn(window.remixDiceSpawnCount?window.remixDiceSpawnCount(this.settings.ka,vd):vd,!Ni,null)`
    );
  }

  // Chess dice-like gates (skip chess_fruit_respawn for dice/tally/bomb…).
  if (code.match(/this\.settings\.ka===4\|\|this\.settings\.ka===6/)) {
    code = code.assertReplace(
      /this\.settings\.ka===4\|\|this\.settings\.ka===6/g,
      `(window.remixIsDiceLike?window.remixIsDiceLike(this.settings.ka):this.settings.ka===4)||this.settings.ka===6`
    );
  } else if (code.match(/a\.settings\.ka===4\|\|a\.settings\.ka===6/)) {
    code = code.assertReplace(
      /a\.settings\.ka===4\|\|a\.settings\.ka===6/g,
      `(window.remixIsDiceLike?window.remixIsDiceLike(a.settings.ka):a.settings.ka===4)||a.settings.ka===6`
    );
  }

  // MoreMenu appends window.uiImage for count>3 — menu-sized, wrong for HUD.
  if (code.includes("const __img = window.uiImage(__src)")) {
    code = code.assertReplace(
      "const __img = window.uiImage(__src)",
      "const __img = (window.remixTopBarCountIcon||window.uiImage)(__src)"
    );
    // Drop the menu-only positioning hack when our scoreboard icon is used.
    code = code.replace(
      /__img\.style\.position = 'relative'\s*;\s*__img\.style\.left = '50px'\s*;/g,
      "if(__img.className.indexOf('WwRsj')<0){__img.style.position='relative';__img.style.left='50px';}"
    );
  } else {
    console.error("DiceCounts: failed to patch MoreMenu scoreboard count icon");
  }

  // TopBar fruit icon uses count_img_arr snapshotted before async hue-tint.
  // Prefer live #count src so blue/green stay correct after tint + on reset.
  const topBarFruit = code.match(
    /if\s*\(\s*window\.pudding_settings\.TopBar\s*&&\s*!window\.daily_challenge\s*\)\s*\{\s*([^=;\n]+)=\s*window\.count_img_arr\[([^\]]+)\]/
  );
  if (topBarFruit) {
    code = code.assertReplace(
      topBarFruit[0],
      `if (window.pudding_settings.TopBar && !window.daily_challenge) {
    ${topBarFruit[1].trim()}=(document.querySelector("#count").children[${topBarFruit[2]}]&&document.querySelector("#count").children[${topBarFruit[2]}].src)||window.count_img_arr[${topBarFruit[2]}]`
    );
  }

  return code;
};
