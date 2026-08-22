window.PauseMod = {};
window.PauseGameMod = window.PauseMod;

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.PauseMod.runCodeBefore = function () {
  window.pauseGame = false;
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.PauseMod.alterSnakeCode = function (code) {
  // MoreMenu already gates the tick with && !window.pauseGame. Skip if so —
  // this stays idempotent if both run.
  if (code.indexOf("!window.pauseGame") >= 0) return code;

  const pauseRe =
    /\(\n?this\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\.\n?direction\n?!==\n?"NONE"\n?\|\|\n?[a-zA-Z0-9_$]{1,8}\n?\(\n?this\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\)\n?\)/;
  const pauseCondition = code.match(pauseRe);
  if (!pauseCondition) {
    console.error("PauseMod: failed to find tick pause condition");
    return code;
  }
  if (typeof code.assertReplace === "function") {
    return code.assertReplace(
      pauseCondition[0],
      `(${pauseCondition[0]} && !window.pauseGame)`
    );
  }
  return code.replace(
    pauseCondition[0],
    `(${pauseCondition[0]} && !window.pauseGame)`
  );
};

////////////////////////////////////////////////////////////////////
//RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.PauseMod.runCodeAfter = function () {
  if (window.__remixPauseBound) return;
  window.__remixPauseBound = true;

  document.addEventListener("keydown", function (evt) {
    if (evt.code !== "KeyQ") return;
    window.pauseGame = !window.pauseGame;
    const overlay = document.getElementsByClassName("wjOYOd")[0];
    if (!overlay) return;
    const menuDiv = overlay.children[0];
    if (window.pauseGame) {
      overlay.style.visibility = "visible";
      overlay.style.opacity = 1;
      if (menuDiv) menuDiv.style.visibility = "hidden";
    } else {
      setTimeout(function () {
        if (!window.pauseGame && menuDiv) menuDiv.style.visibility = "visible";
      }, 500);
      overlay.style.visibility = "hidden";
      overlay.style.opacity = 0;
    }
  });
};
