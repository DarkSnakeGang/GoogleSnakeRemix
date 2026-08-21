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

window.CUSTOM_GRADIENT_ICON =
  "data:image/png;base64,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";

window.CUSTOM_RAINBOW_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAALMklEQVR42n2YXagl2VXHf2t/Vd17T9/bnemH/pgIM5iZkRAzGtEMM+CbMQ8iCQpK0IAEzNMEIfrciCABEfRBRPIiIhIUzGQiET8ImoBKEL9Ix6CQzCQjGc30dPe9fU7V/lo+7F11TveMHij22XXq7Fp7rf9e6/9f8uSTT+puu+Xo6IhpnghhIMWI856SM9ZZaq2AIAK1Vqx15JzwPjDPM+MwMM0zR+PIbprWcRxHpmliGAIxJkLwpJja2iVjjEFVQUGMoZSCd46YEiEE5nlCrl+7psM4EueZMCzGOXIuWGuptWCkLaSAMUIpFecsOWec86QYCSEQU2QIA/M8MwwDc5wJYSDGSPCelBPOHa5dEREEqFoxxlJKxjlHSplhGDDDMKzGxe65nDLOWmop6y4VmgdLxRhDzqUtFCO+Gxe6cWE1Lvw/xhVEBFCqKkaaB6115JTx3jNNE+bRhVroPKUUjDUP7RKlGVwrzhpKzoQQyDmt0BiGgdQ9mWJqxqWEd46SS9t4jwqqCIIRoapiraWUtvGc0uLBsS3QF3LWkXPGWEutihMDQEEpKFkragyxFDCWOSXEOuYYMc6xixHrPFOMGO/b784xpwzWtv9145wIiqKqGGM6vhfoOGKckRs3rqv3vt20jlwy1jpqKVhjOFdwKKfWNDCjqAioNg/0hZtnlxeVPrZ5WXFcETFUrVwgTLVyZpoDWphlXavUhnPnnG94sq5hwLQQOGO4KIUXSuQTj51xrRQqigwjzDPm6BjteFwXV8UuBi2GS4eJaYY1A5X/VuWlOfNHD2YGMev/H/Wk3Lx5U5cTtezeGcO9Cs+kiS/9xqewz73A/U9+gpP3/RD2Ix9l+1u/SfrC52GzgVLb6UE7ThUQVIB2e/2ISEsrgAOOjfCHU+KT93YEIwjNyPZcxRqLvXL58i1dbzZPZBWGmvm9J27yu2/c585zL/DeK2f82uf+jH97zw/w/DNPceePPwObS5RaKSIUhAL7Uejzt78icL8qzwfHfYG/mTPHwgof6anNnp6e3lp2KoABzlX5lbMjPqwZ+fa3+N6Le2xe/iwnr3yDJ0pi87k/RacJsRbpnhORftrbqaQ78G2vnhVEhKTwPc7w0pSJ2oKh/TkEnAJmcX0fnQiXEb5d4UfGQH35s3zVOrabSzz7F1/grrHYcYBaUaHns8OPLjHtX9vcLC/uYRYgA1eBa0b4zwKj6goNEcEZI+20rSAXtFRe3k58+MoJGxG+utnw2hx5ASVsNlzVilQFI6s5suBttbV/MbLYw4UqVfQtz1kRLLRTvhw600603Lx5Q1t6aUm01IIVw0VV3m3hx49HrCqjgKLkjteWtKVVFtvSgj0oVUsuK6WAtZxQ+aAJnKglo4jSvN/d9dMXD/j3UhhbYW5pxq5pJuFcIwfGWnLJXLKWr5XKP19MOJSpCnMWSu1AoVWVWkpL6jljnKOWjLHa5230zpKi8umnIz9/rXKewMrei4LAbUETGGdIpaeZknFLFck54d1Bwq6FE2vYqHIvOt45Zt59Y+bqcQ+ZaktJ3pPig1aH47aRhbhtZGHeMoTAFHdcGi0/9tybuLPMWdlDojEkMN+8DjtPqa1QNGbjca0Oz3gfWqnrTGYJ9644Pv7sOR9/9h7vPKsg+tbzIA/D7vCcPHQ/CWVn3vIzPbVorVjviKmXuhRxjck0vua9J6fGOrQWLrLj1nP3ePG5uxCFHJek8jbGLOBH9r8dnGBFMLKgQ1fLRZS5wK4YnDV77ObMEAbcMHaKFDqp9J5aEtvqef7GxIvvu0vatl1bo/vyoPKI5wSkFf417Rjac+iaWtZnFYqC8co33wy8ck9wUjC2GeeDZ44zbtpNDOPYSWYgxcQQHNNF5afedYF6qBm8XV4GVRccPhpGeTjsdXGi8FAWUqjaNiwBfvsfj9klw5Vj9uGNiWEYcYfGtTA3NnsUPE9fAUlgFaToapxzCl4PI/VIbuORMP8fmKzCr3/xlM98fcPlIyVl7Uy9yYlpmnDTNDGOA3GOhO7BEBxMhXhUyGeGeTYY0wzyVnntbuD2qw4jjcxWVQwHbETrAZuRHnazEoGqyqvngT+5Hfj774ycBqXUTlhzxrvGTcdxxB11D4YQiHPEB0/KGYMjv8eSvx+2W8H00xu84WdevMSX/3XD5gRiKp3sRrzv1N+HPvfs09g+cRtjUAqnR8LloZCrNFq2sOncKP88TbhFycXUjUuZ4B1zUigFAxgU0zmqQfnA+zOGmaOhgFhKmTtdv1jHlqYS1hhyiZ0nzo2MFuW7dz2vfgfMaAhOyaVi+ym2zpFSIgwDbggDcaX8uWmHkqnVMScHzHtpCMQEv/xz93nxZ8+bxQu7Zj99KyAPDr+CqnDvwvCX/3DEp35/w/nWMIamFtsGmwdjnDGxC5rFuFwKzlvmqPzLf1iCbyfukC9d7IRSoNQ+ljbWKv2eaePhVYRSW9VQVS5fynzsQ/f5g199g+Ox0iRLr+ldF4UwYN9x5cqtdIAPaw21VJwzvPJfhp/80R2nJ8oUzVKCV6f1itdGhCXzrPcPrjWJ96tWuHdu+L4nE9ZY/vzvRo6GCvIw5bebzcmtQ/Au+sGZyv/c9Xz9FccH3r/j6uXaCKQFa8E5cKbN3TJ3LV86C96Bc9ruW8UaReveRCPt/yXD9auZl/72mCkKwsO6xFnrqLUpuFWdaaM8m+PCX3/lmJ/4JcfHPvSA9z6VGUPtxLYeqLCudbuuXfTtIsBEDN4pV66ArhqmeTYl5fgErl4u3D33HA3SqVvTR/L444+rrLlKVqS3OVgj7KJhtyucnijBK1oVWYjuwcYOR2sMRZuqK6oMFJ75yGNsntlQ5ooYWQ8fCv/0O2/w4PWEcQ0K2kmrk7WUHzALtG9SyCkzSOb4sVNyFZIKKq0j8NAohipdZkqlICgVwaBSeJBPeO38JpfjOSUaxOgiAKFCVhBV+oorKXZrJTjQJb1LhOaIOzrj+Id/EXv16V5umzjS3hLRRbwvGO7VpHThX7VipVLqGSePfx5f/gprNnuVtsS6aidCi7psYt7VWnsPZtEBiwQFrYnxB3+B4V0fRKc3QUxjvyuG9szF9QaT6yjxBwIMCiYfU2vup35PKsRCvF/I5xWxZl1z2aizzlLyIcC7sQLVn+CuPoXu7jRKI9JTsKBvr+MeHleGU6CGh5K30PSM21jOv7wjXWTcsWk1fWl/lIzJqZWWuoim3s5QBNKW+uY3MMNp53sWEds8KaZ/b3PEIMYgpt0T03/HrM+IEcS0FCMWhjPP+e0dr3/xDexoEMz6/taDdDjXC7l3jpTz2li01lKM4/wrn8b4Y9w7nljTzyomlhNf96xGjFnBrwtcKGhV6i5SR6i5UnaZ796+z+tfugNVECf707+IppSR69evawi9aXnIOpYWXI4tsZ481in6EoJHcqDpEHF2bXIuOXF5DrYYk6lVqVMlbwt2tIhh3wkrpXHClPEh4IZhIPYm5tI/zjmxJHDjBlQrZXun1fsO3lwKxjWB470j5oR3gfig0ayFgMSU8KEJMms9KVeMtSiKO7FoZd846BvKuTkrzjOmccHhEdHke3WxaC2tPBkHxmFcoGKwYaRUIYxHpAJhOCYVZTg6IRUlHJ2QC4TxmFwUF44oqrjBoUZb5ugsfW29dSbT2sCNbplxJaxtt0uYm3AurWLoXvQszckGBdt61N61PndoJLOR3xkffOt7O0dKEWctOZeVnBqzaJwOmaVH3dvQ8zxjttstwxAOlF1cWa21HU8HeW9pdjtrV7YcYyQMA9M0rWMT7vs1/UEjvZR9i7nl/saglvB6H5hjZBxH/hdeFa6iSpoGsAAAAABJRU5ErkJggg==";

window.CUSTOM_GRADIENT_ICON =
  "data:image/png;base64,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";

window.CUSTOM_RAINBOW_ICON =
  "data:image/png;base64,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";

window.remixDrawGradientSnakeIcon = function remixDrawGradientSnakeIcon() {
  return window.CUSTOM_GRADIENT_ICON;
};

window.remixDrawRainbowSnakeIcon = function remixDrawRainbowSnakeIcon() {
  return window.CUSTOM_RAINBOW_ICON;
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
