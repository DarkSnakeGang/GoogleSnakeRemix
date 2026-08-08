window.CatSpeed = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.CatSpeed.runCodeBefore = function () {
  window.CAT_SPEED_MULT = 0.85;
  window.CAT_SPEED_ICON =
    "https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakeIcons/main/Speeds/Cat.png";

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

  // MoreMenu owns cases 3..13. Append Cat as the next case only — no shifting.
  const tickSwitch = code.match(
    /let speedMultiplier\s*;?\s*switch\([^)]+\)\s*\{[\s\S]*?default:\s*speedMultiplier\s*=\s*1\s*;?\s*break\s*;?\s*\}/
  );
  if (!tickSwitch) {
    console.error("CatSpeed: failed to find speedMultiplier switch");
    return code;
  }

  let body = tickSwitch[0];
  const catCaseTick = new RegExp(
    "case\\s+" + catIdx + ":\\s*speedMultiplier\\s*=\\s*window\\.CAT_SPEED_MULT"
  );
  if (!catCaseTick.test(body)) {
    body = body.replace(
      /default:\s*speedMultiplier\s*=\s*1\s*;?\s*break\s*;?/,
      `case ${catIdx}:
              speedMultiplier = window.CAT_SPEED_MULT || .85
              break
            default:
              speedMultiplier = 1
              break`
    );
  }
  if (!catCaseTick.test(body)) {
    console.error("CatSpeed: failed to inject case " + catIdx + " into tick switch");
  } else {
    code = code.assertReplace(tickSwitch[0], body);
  }

  // Reset-path speed switch (MoreMenu uses `break a`).
  const resetSwitch = code.match(
    /case 1:\s*a\s*=\s*\.66[\s\S]*?default:\s*a\s*=\s*1[\s\S]*?break a\s*\}/
  );
  if (resetSwitch) {
    let rb = resetSwitch[0];
    const catCaseReset = new RegExp(
      "case\\s+" + catIdx + ":\\s*a\\s*=\\s*window\\.CAT_SPEED_MULT"
    );
    if (!catCaseReset.test(rb)) {
      rb = rb.replace(
        /default:\s*a\s*=\s*1[\s\S]*?break a/,
        `case ${catIdx}:
            a = window.CAT_SPEED_MULT || .85
            break a
          default:
            a = 1
            break a`
      );
    }
    if (!catCaseReset.test(rb)) {
      console.error("CatSpeed: failed to inject case " + catIdx + " into reset switch");
    } else {
      code = code.assertReplace(resetSwitch[0], rb);
    }
  } else {
    console.error("CatSpeed: failed to find reset speed switch");
  }

  return code;
};
