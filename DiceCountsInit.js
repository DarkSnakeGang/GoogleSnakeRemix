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
      ka === window.BLUE_DICE_COUNT || ka === window.GREEN_DICE_COUNT
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
    img.className = "XUtzXd WwRsj LaTyvd";
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
            child.className = "XUtzXd WwRsj LaTyvd";
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

  const blueImg = window.uiImage(window.NATIVE_DICE_ICON);
  blueImg.alt = "Blue Dice";
  const greenImg = window.uiImage(window.NATIVE_DICE_ICON);
  greenImg.alt = "Green Dice";
  countRoot.appendChild(blueImg);
  countRoot.appendChild(greenImg);
  window.BLUE_DICE_COUNT = [...countRoot.children].indexOf(blueImg);
  window.GREEN_DICE_COUNT = [...countRoot.children].indexOf(greenImg);
  window._remixDiceCountsInserted = true;

  // Native dice ~hue 11°. Rotate to blue (~215°) / green (~125°).
  // TopBar snapshots count_img_arr at alter-time (still red) — refresh on tint.
  window.remixHueShiftDiceIcon(204, function (url) {
    blueImg.src = url;
    window.remixRefreshHudCountIcon(window.BLUE_DICE_COUNT, url);
  });
  window.remixHueShiftDiceIcon(114, function (url) {
    greenImg.src = url;
    window.remixRefreshHudCountIcon(window.GREEN_DICE_COUNT, url);
  });

  function onColoredDiceSelected() {
    const idx = [...countRoot.children].indexOf(this);
    if (!window.remixIsColoredDice(idx)) return;
    const src = this.src;
    if (src) window.remixRefreshHudCountIcon(idx, src);
  }
  blueImg.addEventListener("click", onColoredDiceSelected);
  greenImg.addEventListener("click", onColoredDiceSelected);

  window.remixRefreshCountImgArr();

  if (!window.countToTxt) window.countToTxt = {};
  window.countToTxt[window.BLUE_DICE_COUNT] = { name: "Blue Dice" };
  window.countToTxt[window.GREEN_DICE_COUNT] = { name: "Green Dice" };

  if (
    typeof window.HandleCount === "function" &&
    !window.HandleCount.__dicePatched
  ) {
    const orig = window.HandleCount;
    window.HandleCount = function (count) {
      if (count === window.BLUE_DICE_COUNT) return "Blue Dice, ";
      if (count === window.GREEN_DICE_COUNT) return "Green Dice, ";
      return orig(count);
    };
    window.HandleCount.__dicePatched = true;
  }
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

  // After MoreMenu's `} else if(a)` — start colored dice with one apple.
  const countGate = code.match(/if\(([a-zA-Z0-9_$.]+) > 6 && \1 <= 12\)/);
  const stemMatch = code.match(
    /(this\.[a-zA-Z0-9_$]{1,8}\.push\([a-zA-Z0-9_$]{1,8}\(this,)/
  );
  if (countGate && stemMatch && code.match(/\} else if\(a\)/)) {
    const countExpr = countGate[1];
    const stem = stemMatch[1];
    code = code.assertReplace(
      /\} else if\(a\)/,
      `} else if(window.remixIsColoredDice&&window.remixIsColoredDice(${countExpr})) {
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
  } else {
    console.error("DiceCounts: failed to find native dice tdF refill path");
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
