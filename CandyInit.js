window.CandyMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.CandyMod.runCodeBefore = function () {
  // MoreMenu intentionally omitted until it supports v12.
  // Future: window.moreMenu.runCodeBefore();

  console.log("Adding Candy Mode (v12)");

  window.CANDY_ICON = "https://i.postimg.cc/rsSFx6gg/candy.png";

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

  console.log("Coding Candy Mode into the game (v12)");

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
    /m\$E\(d,`https:\/\/www\.google\.com\/logos\/fnbx\/\$\{`snake_arcade\/v22\/trophy_\$\{j\$E\(c\)\}\.png`\}`\)/
  );
  if (code.match(blender_mode_icons)) {
    code = code.assertReplace(
      blender_mode_icons,
      `m$E(d,(c===window.CANDY_MODE)?window.CANDY_ICON:(c===window.CHESS_MODE)?window.CHESS_ICON:\`https://www.google.com/logos/fnbx/\${\`snake_arcade/v22/trophy_\${j$E(c)}.png\`}\`)`
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
    /f7\(this\.settings,3\)\?this\.oa\.Ta\+=2:this\.oa\.Ta\+=1;/
  );
  let candy_match = code.match(candy_logic);
  if (candy_match) {
    let snake_length = candy_match[0].split("+=")[0].split("?")[1] || "this.oa.Ta";
    // Prefer the +=1 target: this.oa.Ta
    snake_length = "this.oa.Ta";
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
    /a\.Ta\.forEach\(\(c,d\)=>\{_\.zm\(c,"lH9Ipd"\)&&b\.push\(d\)\}\)/
  );
  if (code.match(blender_foreach)) {
    code = code.assertReplace(
      blender_foreach,
      `a.Ta.forEach((c,d)=>{_.zm(c,"lH9Ipd")&&b.push(d)});if(window.candy_blending&&window.CANDY_MODE!=null)b.push(window.CANDY_MODE);if(window.chess_blending&&window.CHESS_MODE!=null)b.push(window.CHESS_MODE)`
    );
  } else {
    console.error("CandyMod: failed to find blender forEach regex");
  }

  // Map custom blender panel icons into Ta with correct mode ids.
  // Must stay an expression (ternary false-branch) — a bare {let ...} block is a SyntaxError.
  let ta_fallback = new RegExp(
    /this\.Ta\.set\(22,e\),this\.kl\.set\(e,22\)/
  );
  if (code.match(ta_fallback)) {
    code = code.assertReplace(
      ta_fallback,
      `((function(el){var s=el.children[0]&&el.children[0].src||"",m=22;if(window.CANDY_MODE!=null&&s.indexOf("rsSFx6gg")>=0)m=window.CANDY_MODE;else if(window.CHESS_MODE!=null&&s.indexOf("ZqK0CB95")>=0)m=window.CHESS_MODE;this.Ta.set(m,el);this.kl.set(el,m);}).call(this,e))`
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
