window.CandyMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.CandyMod.runCodeBefore = function () {
  // MoreMenu intentionally omitted until it supports v12.
  // Future: window.moreMenu.runCodeBefore();

  console.log("Adding Candy Mode (v13)");

  window.CANDY_ICON = "data:image/png;base64,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";

  window.uiImage =
    window.uiImage ||
    function (src) {
      let img = new Image();
      img.src = src;
      img.classList.add("DqMRee");
      img.classList.add("SsAred");
      return img;
    };

  document.querySelector("#trophy").appendChild(uiImage(window.CANDY_ICON));
  window.CANDY_MODE = document.querySelector("#trophy").children.length - 1;

  let trophyEl = document.querySelector('img[src$="trophy_00.png"]');
  if (trophyEl) {
    let trophy_jsname = trophyEl.getAttribute("jsname");
    window.trophy_src =
      window.trophy_src ||
      `document.querySelector('img[jsname="${trophy_jsname}"]').src `;
  }

  window.candy_blending = false;

  window.toggle_candy_blender = function () {
    window.candy_blending = !window.candy_blending;
    window.correct_candy_selection();
  };

  window.correct_candy_selection = function correct_candy_selection() {
    let el = document.getElementById("remix-candy-blend");
    if (!el) return;
    if (window.candy_blending) {
      el.setAttribute("class", "vuOknd lH9Ipd blender_icon blender_icon_on");
      el.innerHTML =
        `<img class="DEvgAc FMN3L blender_icon_img blender_icon_img_selected" src="` +
        window.CANDY_ICON +
        `" alt="">`;
    } else {
      el.setAttribute("class", "vuOknd blender_icon");
      el.innerHTML =
        `<img class="DEvgAc blender_icon_img" src="` +
        window.CANDY_ICON +
        `" alt="">`;
    }
  };

  window.add_candy_blender_toggle = function add_candy_blender_toggle() {
    if (document.getElementById("remix-candy-blend")) return;
    if (!window.populateRemixBlenderSlot) return;
    window.populateRemixBlenderSlot({
      id: "remix-candy-blend",
      slotIndex: 0,
      icon: window.CANDY_ICON,
      ariaLabel: "Toggle Candy in Blender",
      onToggle: window.toggle_candy_blender,
    });
    window.correct_candy_selection();
  };

  window.add_candy_blender_toggle();
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.CandyMod.alterSnakeCode = function (code) {
  // MoreMenu intentionally omitted until it supports v12.
  // Future: code = window.moreMenu.alterSnakeCode(code);

  console.log("Coding Candy Mode into the game (v13)");

  window.updateCandyTrophySRC = function updateCandyTrophySRC() {
    if (window.trophy_src) {
      eval(window.trophy_src + `= window.CANDY_ICON`);
    }
  };

  window.isCandyActive = function isCandyActive() {
    return (
      window.CurrentModeNum === window.CANDY_MODE ||
      (window.CurrentModeNum === 22 && window.candy_blending)
    );
  };

  // Death-screen / header trophy URL for custom candy mode
  let deathscreen_trophy = new RegExp(
    /a\.settings\.Zb=`https:\/\/www\.google\.com\/logos\/fnbx\/\$\{a\.settings\.Ba===1\?`snake_arcade\/pixel\/v22\/px_trophy_\$\{b\}\.png`:`snake_arcade\/v22\/trophy_\$\{b\}\.png`\}`/
  );
  // `b` here is j$E(a.settings.ob) — a zero-padded string, so compare against the
  // raw numeric mode id instead.
  if (code.match(deathscreen_trophy)) {
    code = code.assertReplace(
      deathscreen_trophy,
      `a.settings.Zb=(a.settings.ob===window.CANDY_MODE)?window.CANDY_ICON:(a.settings.ob===window.CHESS_MODE)?window.CHESS_ICON:\`https://www.google.com/logos/fnbx/\${a.settings.Ba===1?\`snake_arcade/pixel/v22/px_trophy_\${b}.png\`:\`snake_arcade/v22/trophy_\${b}.png\`}\``
    );
  }

  // Blender's mode summary strip builds trophy_NN.png per selected mode; custom
  // modes have no such file, so point them at their own icons.
  let blender_mode_icons = new RegExp(
    /b3E\(d,`https:\/\/www\.google\.com\/logos\/fnbx\/\$\{`snake_arcade\/v22\/trophy_\$\{Z2E\(c\)\}\.png`\}`\)/
  );
  if (code.match(blender_mode_icons)) {
    code = code.assertReplace(
      blender_mode_icons,
      `b3E(d,(c===window.CANDY_MODE)?window.CANDY_ICON:(c===window.CHESS_MODE)?window.CHESS_ICON:\`https://www.google.com/logos/fnbx/\${\`snake_arcade/v22/trophy_\${Z2E(c)}.png\`}\`)`
    );
  }

  // Refresh topbar trophy when starting a candy game
  let reset_regex = new RegExp(/a\.ub=a\.ob;a\.ka=a\.Ca;/);
  if (code.match(reset_regex)) {
    code = code.assertReplace(
      reset_regex,
      `a.ub=a.ob;a.ka=a.Ca;if(window.CurrentModeNum===window.CANDY_MODE){window.updateCandyTrophySRC();}`
    );
  }

  // +1..+6 extra length on candy (and blender with candy toggle)
  let candy_logic = new RegExp(
    /e7\(a\.settings,3\)\?a\.oa\.Ua\+=2:a\.oa\.Ua\+=1;/
  );
  let candy_match = code.match(candy_logic);
  if (candy_match) {
    let snake_length = "a.oa.Ua";
    let candy_logic_set = `${candy_match[0]}
    if(window.isCandyActive && window.isCandyActive()) {
        ${snake_length} += Math.floor(Math.random() * 6);
    }
    `;
    code = code.assertReplace(candy_logic, candy_logic_set);
  } else {
    console.error("CandyMod: failed to find length increment regex");
  }

  // Inject candy/chess into blender mode set builder
  let blender_foreach = new RegExp(
    /a\.Ua\.forEach\(\(c,d\)=>\{_\.zm\(c,"lH9Ipd"\)&&b\.push\(d\)\}\)/
  );
  if (code.match(blender_foreach)) {
    code = code.assertReplace(
      blender_foreach,
      `a.Ua.forEach((c,d)=>{_.zm(c,"lH9Ipd")&&b.push(d)});if(window.candy_blending&&window.CANDY_MODE!=null)b.push(window.CANDY_MODE);if(window.chess_blending&&window.CHESS_MODE!=null)b.push(window.CHESS_MODE)`
    );
  } else {
    console.error("CandyMod: failed to find blender forEach regex");
  }

  // Map custom blender panel icons into Ta with correct mode ids.
  // Must stay an expression (ternary false-branch) — a bare {let ...} block is a SyntaxError.
  let ta_fallback = new RegExp(
    /this\.Ua\.set\(22,e\),this\.Uk\.set\(e,22\)/
  );
  if (code.match(ta_fallback)) {
    code = code.assertReplace(
      ta_fallback,
      `((function(el){var s=el.children[0]&&el.children[0].src||"",m=22;if(window.CANDY_MODE!=null&&s.indexOf("rsSFx6gg")>=0)m=window.CANDY_MODE;else if(window.CHESS_MODE!=null&&s.indexOf("ZqK0CB95")>=0)m=window.CHESS_MODE;this.Ua.set(m,el);this.Uk.set(el,m);}).call(this,e))`
    );
  }

  return code;
};

////////////////////////////////////////////////////////////////////
//RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.CandyMod.runCodeAfter = function () {
  window.add_candy_blender_toggle && window.add_candy_blender_toggle();
};
