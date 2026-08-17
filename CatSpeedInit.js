window.CatSpeed = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.CatSpeed.runCodeBefore = function () {
  window.CAT_SPEED_MULT = 0.85;
  // Data URI: Google Snake CSP blocks raw.githubusercontent.com, and a
  // broken <img> in #speed makes the HUD drawImage throw InvalidStateError
  // which freezes the whole menu.
  window.CAT_SPEED_ICON =
    "data:image/png;base64,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";

  window.remixDrawMenuIcon = function remixDrawMenuIcon(ctx, sel, idx, x, y, w, h) {
    try {
      const root = document.querySelector(sel);
      const im = root && root.children[idx];
      if (!im || !im.complete || !im.naturalWidth) return;
      ctx.drawImage(im, x, y, w, h);
    } catch (_e) {}
  };

  window.remixDrawSpeedIcon = function remixDrawSpeedIcon(ctx, speedIdx, x, y, w, h) {
    window.remixDrawMenuIcon(ctx, "#speed", speedIdx, x, y, w, h);
  };

  // Extra sizes (Micro+) live in #size but vanilla only sprites 0-2.
  window.remixDrawSizeIcon = function remixDrawSizeIcon(ctx, x, y, w, h) {
    const root = document.querySelector("#size");
    if (!root) return;
    let idx = -1;
    for (let i = 0; i < root.children.length; i++) {
      if (((root.children[i].className || "") + "").indexOf("tuJOWd") >= 0) {
        idx = i;
        break;
      }
    }
    if (idx < 3) return;
    window.remixDrawMenuIcon(ctx, "#size", idx, x, y, w, h);
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

  const speedRoot = document.querySelector("#speed");
  if (speedRoot && !window._catSpeedIconInserted) {
    // Append after all MoreMenu speeds so we never shift their case indices.
    const cat = window.uiImage(window.CAT_SPEED_ICON);
    cat.alt = "Cat Speed";
    speedRoot.appendChild(cat);
    window._catSpeedIconInserted = true;
    window.CAT_SPEED_INDEX = [...speedRoot.children].indexOf(cat);
  }

  if (typeof window.CAT_SPEED_INDEX !== "number") {
    window.CAT_SPEED_INDEX = speedRoot ? speedRoot.children.length - 1 : 14;
  }

  if (window.speed_img_arr && document.querySelector("#speed")) {
    window.speed_img_arr = Array.from(
      document.querySelector("#speed").children
    ).map((el) => el.src);
  }

  if (!window.speedToTxt) window.speedToTxt = {};
  window.speedToTxt[window.CAT_SPEED_INDEX] = { name: "Cat" };

  if (typeof window.HandleSpeed === "function" && !window.HandleSpeed.__catPatched) {
    const orig = window.HandleSpeed;
    window.HandleSpeed = function (speed) {
      if (speed === window.CAT_SPEED_INDEX) return "Cat speed, ";
      return orig(speed);
    };
    window.HandleSpeed.__catPatched = true;
  }
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.CatSpeed.alterSnakeCode = function (code) {
  const catIdx =
    typeof window.CAT_SPEED_INDEX === "number" ? window.CAT_SPEED_INDEX : 14;

  const catCaseTick = new RegExp(
    "case\\s+" + catIdx + ":\\s*speedMultiplier\\s*=\\s*window\\.CAT_SPEED_MULT"
  );
  const catCaseReset = new RegExp(
    "case\\s+" + catIdx + ":\\s*a\\s*=\\s*window\\.CAT_SPEED_MULT"
  );
  const tickDefault =
    /default:\s*speedMultiplier\s*=\s*1\s*;?\s*break\s*;?/;
  const tickCase = `case ${catIdx}:
              speedMultiplier = window.CAT_SPEED_MULT || .85
              break
            default:
              speedMultiplier = 1
              break`;
  const resetDefault = /default:\s*a\s*=\s*1[\s\S]*?break a/;
  const resetCase = `case ${catIdx}:
            a = window.CAT_SPEED_MULT || .85
            break a
          default:
            a = 1
            break a`;

  // MoreMenu owns cases 3..13. Append Cat as the next case only — no shifting.
  if (!catCaseTick.test(code)) {
    const tickSwitch = code.match(
      /let speedMultiplier\s*;?\s*switch\([\s\S]{0,80}?\)\s*\{[\s\S]*?default:\s*speedMultiplier\s*=\s*1\s*;?\s*break\s*;?\s*\}/
    );
    if (tickSwitch) {
      let body = tickSwitch[0].replace(tickDefault, tickCase);
      if (catCaseTick.test(body)) {
        code = code.assertReplace(tickSwitch[0], body);
      }
    }
    if (!catCaseTick.test(code) && tickDefault.test(code)) {
      code = code.replace(tickDefault, tickCase);
    }
    if (!catCaseTick.test(code)) {
      console.error("CatSpeed: failed to inject case " + catIdx + " into tick switch");
    }
  }

  // Reset-path speed switch (MoreMenu uses `break a`).
  if (!catCaseReset.test(code)) {
    const resetSwitch = code.match(
      /case 1:\s*a\s*=\s*\.66[\s\S]*?default:\s*a\s*=\s*1[\s\S]*?break a\s*\}/
    );
    if (resetSwitch) {
      let rb = resetSwitch[0].replace(resetDefault, resetCase);
      if (catCaseReset.test(rb)) {
        code = code.assertReplace(resetSwitch[0], rb);
      }
    }
    if (!catCaseReset.test(code) && resetDefault.test(code)) {
      code = code.replace(resetDefault, resetCase);
    }
    if (!catCaseReset.test(code)) {
      console.error("CatSpeed: failed to inject case " + catIdx + " into reset switch");
    }
  }

  // MoreMenu draws the selected speed sprite from #speed children. A broken
  // GitHub/CSP image throws InvalidStateError and freezes the HUD. Extra
  // sizes have the same problem, so draw those from #size when selected.
  // Comma-operator: this sits inside `&& ( ... )` so a semicolon is a SyntaxError.
  if (code.indexOf("window.remixDrawSpeedIcon") < 0) {
    const drawRe =
      /([a-zA-Z0-9_$.]+)\.context\.drawImage\(document\.querySelector\('#speed'\)\.children\[([^\]]+)\],\s*([^,]+),\s*([^,]+),\s*80,\s*80\)/;
    if (drawRe.test(code)) {
      code = code.replace(
        drawRe,
        "(window.remixDrawSpeedIcon($1.context,$2,$3,$4,80,80),window.remixDrawSizeIcon($1.context,$3-80,$4,80,80))"
      );
    }
  }

  return code;
};
