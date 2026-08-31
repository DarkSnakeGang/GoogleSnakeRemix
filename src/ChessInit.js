window.ChessMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.ChessMod.runCodeBefore = function () {
  console.log("Adding Chess Mode (v13, independent mode)");

  window.CHESS_ICON = "https://i.postimg.cc/ZqK0CB95/bn.png";

  window.uiImage =
    window.uiImage ||
    function (src) {
      let img = new Image();
      img.src = src;
      img.classList.add("DqMRee");
      img.classList.add("SsAred");
      return img;
    };

  // Inject chess piece fruits into Pudding's new_fruit (hidden from fruit picker)
  window.injectChessFruits = function injectChessFruits() {
    if (!window.new_fruit || window._chessFruitsInjected) return;
    window._chessFruitsInjected = true;

    let pieces = [
      { Normal: "https://i.postimg.cc/NG8bwZw7/bb.png", Pixel: "https://i.postimg.cc/zvbZcVNz/Chess-bishop.png", Real: "https://i.postimg.cc/NG8bwZw7/bb.png" },
      { Normal: "https://i.postimg.cc/zGNyYP8W/bk.png", Pixel: "https://i.postimg.cc/tRwHVtdY/Chess-king.png", Real: "https://i.postimg.cc/zGNyYP8W/bk.png" },
      { Normal: "https://i.postimg.cc/ZqK0CB95/bn.png", Pixel: "https://i.postimg.cc/rwC6bBBr/Chess-knight.png", Real: "https://i.postimg.cc/ZqK0CB95/bn.png" },
      { Normal: "https://i.postimg.cc/fLVLfGf4/bp.png", Pixel: "https://i.postimg.cc/jjxVr8Tk/Chess-pawn.png", Real: "https://i.postimg.cc/fLVLfGf4/bp.png" },
      { Normal: "https://i.postimg.cc/g0SjRzRq/bq.png", Pixel: "https://i.postimg.cc/J4XC3DKK/Chess-queen.png", Real: "https://i.postimg.cc/g0SjRzRq/bq.png" },
      { Normal: "https://i.postimg.cc/fL1b288V/br.png", Pixel: "https://i.postimg.cc/CLTmFLXt/Chess-Rook.png", Real: "https://i.postimg.cc/fL1b288V/br.png" },
      { Normal: "https://i.postimg.cc/nc4L2YBL/wb.png", Pixel: "https://i.postimg.cc/QtnZmcRY/Chess-bishop-white.png", Real: "https://i.postimg.cc/nc4L2YBL/wb.png" },
      { Normal: "https://i.postimg.cc/4ytxrp0B/wk.png", Pixel: "https://i.postimg.cc/vTJFFb8W/Chess-king-white.png", Real: "https://i.postimg.cc/4ytxrp0B/wk.png" },
      { Normal: "https://i.postimg.cc/ncbzqws5/wn.png", Pixel: "https://i.postimg.cc/VkcQKfVw/chess-knight-white.png", Real: "https://i.postimg.cc/ncbzqws5/wn.png" },
      { Normal: "https://i.postimg.cc/VsbvrcNn/wp.png", Pixel: "https://i.postimg.cc/vBTp4ccr/chess-pawn-white.png", Real: "https://i.postimg.cc/VsbvrcNn/wp.png" },
      { Normal: "https://i.postimg.cc/mgTg5zyy/wq.png", Pixel: "https://i.postimg.cc/JhPf7b47/chess-queen-white.png", Real: "https://i.postimg.cc/mgTg5zyy/wq.png" },
      { Normal: "https://i.postimg.cc/kgwg3Jj3/wr.png", Pixel: "https://i.postimg.cc/xCZBMnzW/chess-rook-white.png", Real: "https://i.postimg.cc/kgwg3Jj3/wr.png" },
    ];

    // last_fruit_num is set by Pudding Fruit.make (vanilla menu count - 1)
    let base = typeof last_fruit_num !== "undefined" ? last_fruit_num : document.querySelector("#apple").children.length - 1;

    // Pudding addresses its own trailing entries by offset from the end of the
    // array: goldenIndex = length - 6 (the five secret golden fruits) and the
    // skull poison sprite = length - 1. Appending after them silently rebinds
    // both to chess pieces, so slot the pieces in ahead of that tail instead.
    let secretTail = 6;
    let insertAt = window.new_fruit.length - secretTail;
    let skull = window.new_fruit[window.new_fruit.length - 1];
    if (insertAt < 0 || !skull || !/poison-skull/.test(skull.Real || "")) {
      console.error("ChessMod: Pudding secret-fruit tail not found, appending at end");
      insertAt = window.new_fruit.length;
    }
    let startType = base + 1 + insertAt;

    for (let i = 0; i < pieces.length; i++) {
      pieces[i].Poison_values = "b,'#eaca23','#909090',20";
    }
    window.new_fruit.splice(insertAt, 0, ...pieces);

    // Order pushed: bbishop, bking, bknight, bpawn, bqueen, brook, wbishop, wking, wknight, wpawn, wqueen, wrook
    window.bbishop = startType;
    window.bking = startType + 1;
    window.bknight = startType + 2;
    window.bpawn = startType + 3;
    window.bqueen = startType + 4;
    window.brook = startType + 5;
    window.wbishop = startType + 6;
    window.wking = startType + 7;
    window.wknight = startType + 8;
    window.wpawn = startType + 9;
    window.wqueen = startType + 10;
    window.wrook = startType + 11;

    console.log("Chess fruits injected, wrook=", window.wrook);
  };

  // Pudding already ran Fruit.make in its runCodeBefore when called from Remix.
  // Remix calls MorePudding (Pudding → Visibility → MoreMenu) then Chess, so
  // new_fruit and the Visibility panel both exist by now.
  if (window.new_fruit) {
    window.injectChessFruits();
  }

  // Adds a "Chess Pieces" row to the Visibility panel that MorePudding bundles,
  // so pieces can be hidden without hiding ordinary fruit.
  window.addChessVisibilityToggle = function addChessVisibilityToggle() {
    if (!window.checkboxes || !window.checkboxes.checkboxStatuses) return;
    let statuses = window.checkboxes.checkboxStatuses;
    if (statuses.chessPieces === undefined) statuses.chessPieces = true;

    // Pieces are drawn in the same pass as fruit, so the shadow silhouette pass
    // has to know about the key too or hidden pieces keep their shadows.
    if (Array.isArray(window.visiShadowPassKeys) && !window.visiShadowPassKeys.includes("chessPieces")) {
      let at = window.visiShadowPassKeys.indexOf("poison");
      window.visiShadowPassKeys.splice(at < 0 ? window.visiShadowPassKeys.length : at + 1, 0, "chessPieces");
    }

    if (document.getElementById("chess-pieces")) return;
    let lightFruit = document.getElementById("light-fruit");
    if (!lightFruit) return;
    let row = lightFruit.closest("li");
    if (!row || !row.parentElement) return;

    let item = document.createElement("li");
    item.innerHTML =
      '<label class="form-check-label"><input class="form-check-input" id="chess-pieces" type="checkbox">Chess Pieces</label>';
    row.parentElement.insertBefore(item, row.nextSibling);

    let box = item.querySelector("#chess-pieces");
    box.checked = statuses.chessPieces;
    box.onchange = function () {
      window.checkboxes.checkboxStatuses.chessPieces = this.checked;
    };

    let template = document.getElementById("tooltiptemplate");
    if (template) {
      let tooltip = template.content.cloneNode(true);
      tooltip.querySelector(".tooltiptext").textContent =
        "Chess pieces spawned by Chess mode. Uncheck to hide pieces while keeping normal fruit visible.";
      box.parentElement.parentElement.appendChild(tooltip);
    }
  };

  window.addChessVisibilityToggle();

  // Own trophy slot (do not wipe other modes / do not steal Shield)
  document.querySelector("#trophy").appendChild(uiImage(window.CHESS_ICON));
  window.CHESS_MODE = document.querySelector("#trophy").children.length - 1;

  let trophyEl = document.querySelector('img[src$="trophy_00.png"]');
  if (trophyEl) {
    let trophy_jsname = trophyEl.getAttribute("jsname");
    window.trophy_src =
      window.trophy_src ||
      `document.querySelector('img[jsname="${trophy_jsname}"]').src `;
  }

  // Capture sound
  fetch(
    "https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakeRemix/main/ChessCapture.mp3"
  )
    .then(function (response) {
      return response.arrayBuffer();
    })
    .then(function (buffer) {
      window.capture_sound = new Audio();
      window.capture_sound.src = URL.createObjectURL(new Blob([buffer]));
    })
    .catch(function () {
      // Fallback to Chess repo URL while Remix audio may not be published yet
      fetch(
        "https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakeChess/main/ChessCapture.mp3"
      )
        .then(function (r) {
          return r.arrayBuffer();
        })
        .then(function (buffer) {
          window.capture_sound = new Audio();
          window.capture_sound.src = URL.createObjectURL(new Blob([buffer]));
        })
        .catch(function (err) {
          console.error("Error loading chess capture sound:", err);
        });
    });

  window.chess_blending = false;

  window.toggle_chess_blender = function () {
    window.chess_blending = !window.chess_blending;
    window.correct_chess_selection();
  };

  window.correct_chess_selection = function correct_chess_selection() {
    let el = document.getElementById("remix-chess-blend");
    if (!el) return;
    if (window.chess_blending) {
      el.setAttribute("class", "vuOknd lH9Ipd blender_icon blender_icon_on");
      el.innerHTML =
        `<img class="DEvgAc FMN3L blender_icon_img blender_icon_img_selected" src="` +
        window.CHESS_ICON +
        `" alt="">`;
    } else {
      el.setAttribute("class", "vuOknd blender_icon");
      el.innerHTML =
        `<img class="DEvgAc blender_icon_img" src="` +
        window.CHESS_ICON +
        `" alt="">`;
    }
  };

  window.add_chess_blender_toggle = function add_chess_blender_toggle() {
    if (document.getElementById("remix-chess-blend")) return;
    if (!window.populateRemixBlenderSlot) return;
    window.populateRemixBlenderSlot({
      id: "remix-chess-blend",
      slotIndex: 1,
      icon: window.CHESS_ICON,
      ariaLabel: "Toggle Chess in Blender",
      onToggle: window.toggle_chess_blender,
    });
    window.correct_chess_selection();
  };

  window.add_chess_blender_toggle();
};

////////////////////////////////////////////////////////////////////
//ALTERSNAKECODE
////////////////////////////////////////////////////////////////////

window.ChessMod.alterSnakeCode = function (code) {
  console.log("Coding Chess Mode into the game (v13)");

  // Ensure fruits exist if alter runs in odd order
  if (window.new_fruit && !window._chessFruitsInjected) {
    window.injectChessFruits();
  }

  // Visibility gates fruit drawing on one checkbox for everything that is not
  // poison. Split pieces out of that branch so the Chess Pieces row applies.
  // Both the normal and the twin/infinity mirrored draw carry the same guard.
  // MorePudding currently marks poison as (b.nla||b.Oka); older builds used b.Oka.
  const fruit = "window.checkboxes.checkboxStatuses.fruit";
  const pieces =
    "(b.isPiece ? window.checkboxes.checkboxStatuses.chessPieces : window.checkboxes.checkboxStatuses.fruit)";
  const poisonMarks = ["(b.nla||b.Oka)", "b.Oka"];
  let fruitGatePatched = false;
  for (let i = 0; i < poisonMarks.length; i++) {
    const from =
      "(window.visiFullPass || (" +
      poisonMarks[i] +
      " ? window.checkboxes.checkboxStatuses.poison : " +
      fruit +
      "))";
    if (!code.includes(from)) continue;
    code = code.replaceAll(
      from,
      "(window.visiFullPass || (" +
        poisonMarks[i] +
        " ? window.checkboxes.checkboxStatuses.poison : " +
        pieces +
        "))"
    );
    fruitGatePatched = true;
    break;
  }
  if (!fruitGatePatched) {
    console.error("ChessMod: failed to find Visibility fruit gate for chess pieces");
  }

  window.PiecesDict = {
    [window.wrook]: "https://i.postimg.cc/kgwg3Jj3/wr.png",
    [window.wqueen]: "https://i.postimg.cc/mgTg5zyy/wq.png",
    [window.wpawn]: "https://i.postimg.cc/VsbvrcNn/wp.png",
    [window.wknight]: "https://i.postimg.cc/ncbzqws5/wn.png",
    [window.wking]: "https://i.postimg.cc/4ytxrp0B/wk.png",
    [window.wbishop]: "https://i.postimg.cc/nc4L2YBL/wb.png",
    [window.brook]: "https://i.postimg.cc/fL1b288V/br.png",
    [window.bqueen]: "https://i.postimg.cc/g0SjRzRq/bq.png",
    [window.bpawn]: "https://i.postimg.cc/fLVLfGf4/bp.png",
    [window.bknight]: "https://i.postimg.cc/ZqK0CB95/bn.png",
    [window.bking]: "https://i.postimg.cc/zGNyYP8W/bk.png",
    [window.bbishop]: "https://i.postimg.cc/NG8bwZw7/bb.png",
  };

  window.updateTrophySRC = function updateTrophySRC(type) {
    if (!window.trophy_src) return;
    if (typeof type === "undefined") {
      eval(window.trophy_src + `= window.CHESS_ICON`);
    } else {
      eval(window.trophy_src + `= window.PiecesDict[` + type + `]`);
    }
  };

  window.isChessActive = function isChessActive() {
    if (window.CHESS_MODE == null) return false;
    if (window.CurrentModeNum === window.CHESS_MODE) return true;
    if (window.CurrentModeNum === 22 && window.chess_blending) return true;
    // Chess may be in blender rSa via the mode grid without chess_blending.
    // Match e7(...,15) so eat/respawn/unlock stay on the Chess path.
    const g = window.__remixGame;
    const s = g && g.settings;
    if (!s) return false;
    if (s.ub === window.CHESS_MODE || s.ob === window.CHESS_MODE) return true;
    if (
      (s.ub === 22 || window.CurrentModeNum === 22) &&
      s.rSa &&
      typeof s.rSa.has === "function" &&
      s.rSa.has(window.CHESS_MODE)
    ) {
      return true;
    }
    return false;
  };

  // Chess trophy + Portal physics (mode or blender). Solo Chess / solo Portal stay off.
  // Do not call e7() here — it lives in the game closure, not on window.
  window.chess_portal_combo = function chess_portal_combo() {
    if (!window.isChessActive || !window.isChessActive()) return false;
    const g = window.__remixGame;
    if (!g || !g.settings) return false;
    const s = g.settings;
    if (s.ub === 2 || s.ob === 2) return true;
    if (
      (s.ub === 22 || window.CurrentModeNum === 22 || s.ob === 22) &&
      s.rSa &&
      typeof s.rSa.has === "function" &&
      s.rSa.has(2)
    ) {
      return true;
    }
    return false;
  };

  window.head_pos = [{ y: 0, x: 0 }];
  window.head_dir = "RIGHT";
  window.head_state = "OPEN";
  window.head_color = "NONE";
  window.color_turn = "w";
  window.just_ate = "fruit";
  window.appleArray = [];
  window.selectedFruit = 0;
  window.dice_doubler = 1;
  window.muted = false;
  window.__chessPortalNeedRespawn = false;
  window.__chessPortalTwinKey = null;
  window.__chessPortalTwinApple = null;

  // Shield field name on apple objects in v12
  window.chess_shield_field = "nba";

  // Native Peaceful (e7 21) makes P3E return an empty shield set — fruit stay
  // edible. Chess lock via shield_all must match that: while Peaceful / Cat
  // grace / Slot Peaceful-roll is on, do not keep 4-way locks (otherwise the
  // snake skips Sc death and walks through locked pieces without eating).
  window.chess_peaceful_active = function chess_peaceful_active(game) {
    if ((window.cat_peaceful_ticks | 0) > 0) {
      if (!window.isCatActive || window.isCatActive()) return true;
    }
    if (
      window.isSlotMachineActive &&
      window.isSlotMachineActive() &&
      (window.__slotActive | 0) === 21
    ) {
      return true;
    }
    const g = game || window.__remixGame;
    if (!g || !g.settings) return false;
    const s = g.settings;
    if ((s.ub | 0) === 21) return true;
    if ((s.ub | 0) === 22) {
      if (s.rSa && typeof s.rSa.has === "function" && s.rSa.has(21)) return true;
      if (g.rSa && typeof g.rSa.has === "function" && g.rSa.has(21)) return true;
    }
    if (s.Qa && s.Lc && typeof s.Lc.has === "function" && s.Lc.has(21)) {
      return true;
    }
    return false;
  };

  window.shield_all = function shield_all() {
    if (!window.appleArray) return;
    // Peaceful / Cat grace: unlock leftover pieces only when head is OPEN.
    // While carrying a piece, keep full Chess locks regardless of peaceful.
    const carrying =
      !!window.head_state && window.head_state !== "OPEN";
    if (
      !carrying &&
      window.chess_peaceful_active &&
      window.chess_peaceful_active()
    ) {
      window.shield_empty_all();
      return;
    }
    // Original Chess: lock EVERY apple (fruit and pieces) while carrying a piece
    window.appleArray.forEach(function (apple) {
      apple[window.chess_shield_field] = new Set([
        "UP",
        "DOWN",
        "LEFT",
        "RIGHT",
      ]);
    });
  };

  window.shield_empty_all = function shield_empty_all() {
    if (!window.appleArray) return;
    window.appleArray.forEach(function (apple) {
      apple[window.chess_shield_field] = undefined;
    });
  };

  // Sc shield hit: under Peaceful/Cat with OPEN head, drop the lock so the
  // same-tick eat can land. While carrying, do not clear locks via peaceful.
  window.chess_shield_hit_absorb = function chess_shield_hit_absorb(
    game,
    fruit
  ) {
    if (!fruit) return false;
    // Only chess piece locks — not Shield-badge fruit leftovers.
    if (!fruit.isPiece) return false;
    const carrying =
      !!window.head_state && window.head_state !== "OPEN";
    if (
      !carrying &&
      window.chess_peaceful_active &&
      window.chess_peaceful_active(game)
    ) {
      fruit[window.chess_shield_field || "nba"] = undefined;
      return true;
    }
    if (
      !carrying &&
      window.isCatActive &&
      window.isCatActive() &&
      ((window.cat_peaceful_ticks | 0) > 0 || (window.cat_lives | 0) > 0)
    ) {
      fruit[window.chess_shield_field || "nba"] = undefined;
      if (
        (window.cat_peaceful_ticks | 0) <= 0 &&
        typeof window.cat_try_spend_life === "function"
      ) {
        window.cat_try_spend_life(game || window.__remixGame);
      }
      return true;
    }
    return false;
  };

  // Original order: shield_all first, then unlock attempts; OPEN empties shields
  window.chess_tick_logic = function chess_tick_logic() {
    if (!window.isChessActive()) return;

    const carrying =
      !!window.head_state && window.head_state !== "OPEN";
    // Peaceful: leftover pieces are edible pickups only when head is OPEN.
    // Piece mode always runs the lock/unlock dance.
    if (
      !carrying &&
      window.chess_peaceful_active &&
      window.chess_peaceful_active()
    ) {
      window.shield_empty_all();
      return;
    }

    window.shield_all();
    switch (window.head_state) {
      case "pawn":
        window.pawn_open(window.head_pos[0]);
        break;
      case "rook":
        window.rook_open(window.head_pos[0]);
        break;
      case "bishop":
        window.bishop_open(window.head_pos[0]);
        break;
      case "knight":
        window.knight_open(window.head_pos[0]);
        break;
      case "king":
        window.king_open(window.head_pos[0]);
        break;
      case "queen":
        if (!window.rook_open(window.head_pos[0])) {
          window.bishop_open(window.head_pos[0]);
        }
        break;
      case "OPEN":
      default:
        window.shield_empty_all();
        break;
    }
  };

  window.capture_attempt = function capture_attempt(x, y) {
    // Unlock is not eat: convert exactly one opposite piece to fruit, then OPEN.
    if (window.head_state === "OPEN") return false;
    for (let index = 0; index < window.appleArray.length; index++) {
      let apple = window.appleArray[index];
      if (
        apple.isPiece &&
        !apple.Oka &&
        apple.pos.x == x &&
        apple.pos.y == y &&
        window.head_color != apple.ChessColor
      ) {
        window.head_state = "OPEN";
        if (window.selectedFruit == 22) {
          let randomNumber = Math.floor(Math.random() * 51 + 1) % 52;
          let finalResult =
            randomNumber === 22 ? (randomNumber + 1) % 52 : randomNumber;
          apple.type = finalResult;
        } else {
          apple.type = window.selectedFruit;
        }
        apple.isPiece = false;
        window.shield_empty_all();

        if (!window.muted && window.capture_sound) {
          window.capture_sound.play();
        }
        // Chess+Portal: unlocked fruit needs a portal twin apple.
        if (window.chess_portal_combo && window.chess_portal_combo()) {
          try {
            window.chess_spawn_unlock_twin(apple, index);
          } catch (_e) {}
        }
        return true;
      }
    }
    return false;
  };

  window.capture_loop = function capture_loop(headPos, possibleMoves) {
    for (let index = 0; index < possibleMoves.length; index++) {
      let element = possibleMoves[index];
      if (
        window.capture_attempt(headPos.x + element.dx, headPos.y - element.dy)
      ) {
        break;
      }
    }
  };

  window.pawn_open = function pawn_open(headPos) {
    window.capture_loop(headPos, [
      { dx: -1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
    ]);
  };

  window.king_open = function king_open(headPos) {
    window.capture_loop(headPos, [
      { dx: -1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: 0, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
    ]);
  };

  window.knight_open = function knight_open(headPos) {
    window.capture_loop(headPos, [
      { dx: -1, dy: 2 },
      { dx: -2, dy: 1 },
      { dx: -2, dy: -1 },
      { dx: -1, dy: -2 },
      { dx: 2, dy: 1 },
      { dx: 1, dy: 2 },
      { dx: 1, dy: -2 },
      { dx: 2, dy: -1 },
    ]);
  };

  function getClosestPiecesToRook(rookPos, pieces) {
    const closestPieces = {
      up: { piece: null, distance: Infinity },
      down: { piece: null, distance: Infinity },
      left: { piece: null, distance: Infinity },
      right: { piece: null, distance: Infinity },
    };

    pieces.forEach(function (piece) {
      const distance =
        Math.abs(piece.pos.x - rookPos.x) + Math.abs(piece.pos.y - rookPos.y);

      if (
        piece.pos.x === rookPos.x &&
        piece.pos.y < rookPos.y &&
        distance < closestPieces.up.distance
      ) {
        closestPieces.up = { piece: piece, distance: distance };
      } else if (
        piece.pos.x === rookPos.x &&
        piece.pos.y > rookPos.y &&
        distance < closestPieces.down.distance
      ) {
        closestPieces.down = { piece: piece, distance: distance };
      } else if (
        piece.pos.y === rookPos.y &&
        piece.pos.x < rookPos.x &&
        distance < closestPieces.left.distance
      ) {
        closestPieces.left = { piece: piece, distance: distance };
      } else if (
        piece.pos.y === rookPos.y &&
        piece.pos.x > rookPos.x &&
        distance < closestPieces.right.distance
      ) {
        closestPieces.right = { piece: piece, distance: distance };
      }
    });

    return Object.values(closestPieces)
      .map(function (o) {
        return o.piece;
      })
      .filter(function (piece) {
        return piece !== null;
      });
  }

  window.rook_open = function rook_open(headPos) {
    let closestPieces = getClosestPiecesToRook(headPos, window.appleArray);
    for (let index = 0; index < closestPieces.length; index++) {
      let element = closestPieces[index];
      if (element.ChessColor != window.head_color) {
        return window.capture_attempt(element.pos.x, element.pos.y);
      }
    }
    return false;
  };

  function getDistance(dx, dy) {
    return Math.abs(dx) + Math.abs(dy);
  }

  function getClosestPiecesToBishop(bishopPos, pieces) {
    const closestPieces = {};

    pieces.forEach(function (piece) {
      const dx = piece.pos.x - bishopPos.x;
      const dy = piece.pos.y - bishopPos.y;

      if (Math.abs(dx) === Math.abs(dy)) {
        const direction =
          (dx < 0 ? "left-" : "right-") + (dy < 0 ? "up" : "down");

        if (
          !closestPieces[direction] ||
          getDistance(dx, dy) <
            getDistance(
              closestPieces[direction].pos.x - bishopPos.x,
              closestPieces[direction].pos.y - bishopPos.y
            )
        ) {
          closestPieces[direction] = piece;
        }
      }
    });

    return Object.values(closestPieces).sort(function (a, b) {
      return (
        getDistance(a.pos.x - bishopPos.x, a.pos.y - bishopPos.y) -
        getDistance(b.pos.x - bishopPos.x, b.pos.y - bishopPos.y)
      );
    });
  }

  window.bishop_open = function bishop_open(headPos) {
    let closestPieces = getClosestPiecesToBishop(headPos, window.appleArray);
    for (let index = 0; index < closestPieces.length; index++) {
      let element = closestPieces[index];
      if (element.ChessColor != window.head_color) {
        return window.capture_attempt(element.pos.x, element.pos.y);
      }
    }
    return false;
  };

  window.getRandomPiece = function getRandomPiece() {
    const randomNumber = Math.floor(Math.random() * 16) + 1;
    if (randomNumber <= 8) return "pawn";
    if (randomNumber <= 10) return "knight";
    if (randomNumber <= 12) return "bishop";
    if (randomNumber <= 14) return "rook";
    if (randomNumber === 15) return "queen";
    return "king";
  };

  window.SwitchTurn = function SwitchTurn() {
    window.color_turn = window.color_turn == "b" ? "w" : "b";
  };

  window.randomize_pieces = function randomize_pieces() {
    for (let index = 0; index < window.appleArray.length; index++) {
      let element = window.appleArray[index];
      element.ChessPiece = window.getRandomPiece();
      element.ChessColor = window.color_turn;
      element.isPiece = true;
      element.type = window[window.color_turn + element.ChessPiece];
      window.SwitchTurn();
    }
  };

  window.findApple = function findApple(headPos, appleArray) {
    for (let index = 0; index < appleArray.length; index++) {
      let element = appleArray[index];
      if (element.pos.x == headPos.x && element.pos.y == headPos.y) {
        element.myIndex = index;
        return element;
      }
    }
    return null;
  };

  // --- Legal spawn helpers (board bounds, snake, fruits/pieces) ---
  window.chess_pos_key = function chess_pos_key(pos) {
    if (!pos || pos.x == null || pos.y == null) return null;
    return (pos.x << 16) | (pos.y & 65535);
  };

  window.chess_board_size = function chess_board_size(board) {
    const box = board && board.oa;
    if (!box) return null;
    return { width: box.width | 0, height: box.height | 0 };
  };

  window.chess_in_bounds = function chess_in_bounds(board, pos) {
    const size = window.chess_board_size(board);
    if (!size || !pos || pos.x == null || pos.y == null) return false;
    return (
      pos.x >= 0 &&
      pos.y >= 0 &&
      pos.x < size.width &&
      pos.y < size.height
    );
  };

  // Occupied keys: snake segments + every apple except skipIndexes.
  window.chess_occupied_keys = function chess_occupied_keys(
    game,
    apples,
    skipIndexes
  ) {
    const keys = new Set();
    const skip =
      skipIndexes instanceof Set
        ? skipIndexes
        : new Set(skipIndexes || []);
    if (game && game.oa && Array.isArray(game.oa.ka)) {
      for (let i = 0; i < game.oa.ka.length; i++) {
        const seg = game.oa.ka[i];
        const k = window.chess_pos_key(seg);
        if (k != null) keys.add(k);
      }
    }
    const list = apples || [];
    for (let i = 0; i < list.length; i++) {
      if (skip.has(i)) continue;
      const k = window.chess_pos_key(list[i] && list[i].pos);
      if (k != null) keys.add(k);
    }
    return keys;
  };

  window.chess_is_legal_spawn = function chess_is_legal_spawn(
    board,
    pos,
    occupiedKeys
  ) {
    if (!window.chess_in_bounds(board, pos)) return false;
    // Bridges are solid for fruit/piece spawn (same as Slot freePos).
    if (window.chess_pos_on_bridge && window.chess_pos_on_bridge(null, pos)) {
      return false;
    }
    if (!occupiedKeys) return true;
    const k = window.chess_pos_key(pos);
    return k == null || !occupiedKeys.has(k);
  };

  // Bridge tiles (game.Ga.oa[y][x]) are not free cells for piece/fruit spawn.
  window.chess_pos_on_bridge = function chess_pos_on_bridge(game, posOrX, y) {
    const g = game || window.__remixGame;
    const grid = g && g.Ga && g.Ga.oa;
    if (!grid || !grid.length) return false;
    let xi;
    let yi;
    if (posOrX && typeof posOrX === "object") {
      xi = posOrX.x | 0;
      yi = posOrX.y | 0;
    } else {
      xi = posOrX | 0;
      yi = y | 0;
    }
    return !!(grid[yi] && grid[yi][xi]);
  };

  // Native Tb bans cells with l7(board, head, cell) <= 3 when portal/shield
  // spawn (b===2). Chess enables shield via f7(..., 15), so new piece spawns
  // must keep the same head radius. Start-layout (iaF) positions are exempt.
  window.chess_spawn_radius = 3;

  window.chess_spawn_dist = function chess_spawn_dist(board, from, to) {
    if (!from || !to) return Infinity;
    if (typeof l7 === "function" && board) {
      try {
        return l7(board, from, to);
      } catch (_e) {}
    }
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
  };

  window.chess_outside_spawn_radius = function chess_outside_spawn_radius(
    game,
    pos,
    maxDist
  ) {
    if (!pos || pos.x == null || pos.y == null) return false;
    const limit =
      maxDist == null ? window.chess_spawn_radius : maxDist;
    const snake = game && game.oa;
    const head = snake && snake.ka && snake.ka[0];
    if (!head) return true;
    const board = game.ka || (game.wa && game.wa.oa) || null;
    if (window.chess_spawn_dist(board, head, pos) <= limit) return false;
    // Twin snake: also ban the head-radius mirror, matching Tb.
    if (
      snake &&
      snake.settings &&
      typeof e7 === "function" &&
      e7(snake.settings, 7) &&
      typeof k7 === "function" &&
      board
    ) {
      try {
        const twin = k7(board, pos);
        if (
          twin &&
          window.chess_spawn_dist(board, head, twin) <= limit
        ) {
          return false;
        }
      } catch (_e) {}
    }
    return true;
  };

  window.chess_make_pos = function chess_make_pos(x, y) {
    if (typeof _ !== "undefined" && _ && typeof _.Od === "function") {
      return new _.Od(x, y);
    }
    if (typeof _ !== "undefined" && _ && typeof _.Sd === "function") {
      return new _.Sd(x, y);
    }
    return { x: x, y: y };
  };

  // Prefer native freePos/Tb (spawn radius); validate; fall back to board scan
  // that still enforces the same head radius (never unrestricted).
  window.chess_find_legal_spawn = function chess_find_legal_spawn(
    board,
    freePos,
    occupiedKeys,
    excludeRef
  ) {
    const game = window.__remixGame;
    const ok = function (p) {
      return (
        p &&
        window.chess_is_legal_spawn(board, p, occupiedKeys) &&
        window.chess_outside_spawn_radius(game, p)
      );
    };
    if (typeof freePos === "function" && board) {
      for (let attempt = 0; attempt < 12; attempt++) {
        const p = freePos(board, excludeRef || null, 2);
        if (ok(p)) return p;
      }
    }
    const nativeFree =
      game && typeof game.Rb === "function"
        ? game.Rb.bind(game)
        : game && typeof game.Tb === "function"
          ? game.Tb.bind(game)
          : null;
    if (nativeFree) {
      for (let attempt = 0; attempt < 8; attempt++) {
        const p = nativeFree(excludeRef || null, 2);
        if (ok(p)) return p;
      }
    }
    const size = window.chess_board_size(board);
    if (!size || size.width <= 0 || size.height <= 0) return null;
    const total = size.width * size.height;
    const start = Math.floor(Math.random() * total);
    for (let n = 0; n < total; n++) {
      const i = (start + n) % total;
      const x = i % size.width;
      const y = (i / size.width) | 0;
      const pos = window.chess_make_pos(x, y);
      if (ok(pos)) return pos;
    }
    return null;
  };

  window.chess_assign_piece = function chess_assign_piece(el) {
    el.ChessPiece = window.getRandomPiece();
    el.ChessColor = window.color_turn;
    el.isPiece = true;
    el.type = window[window.color_turn + el.ChessPiece];
    el.nba = undefined;
    window.SwitchTurn();
  };

  // Relocate an eaten piece identity to a different legal cell. Returns true
  // if a new apple was pushed onto mgr.ka.
  // Does NOT remove the eaten apple — native eat splice owns that (splicing
  // here would desync the eat index and drop the wrong apple).
  window.chess_respawn_eaten_piece = function chess_respawn_eaten_piece(
    snapshot,
    mgr
  ) {
    if (!snapshot || !mgr || !mgr.ka) return false;
    const piece = snapshot.ChessPiece;
    const color = snapshot.ChessColor;
    if (!piece || (color !== "w" && color !== "b")) return false;
    const game = window.__remixGame;
    const board = mgr.oa;
    const eatenKey =
      snapshot.pos && window.chess_pos_key
        ? window.chess_pos_key(snapshot.pos)
        : snapshot.pos
          ? (snapshot.pos.x | 0) + "," + (snapshot.pos.y | 0)
          : null;
    const sameCell = function (p) {
      if (!p || !snapshot.pos) return false;
      return (
        (p.x | 0) === (snapshot.pos.x | 0) &&
        (p.y | 0) === (snapshot.pos.y | 0)
      );
    };

    let pos = null;
    // Slot leftovers (fruit/walls/bridges/soko): prefer slot_free_pos.
    if (
      window.isSlotMachineActive &&
      window.isSlotMachineActive() &&
      typeof window.slot_free_pos === "function"
    ) {
      for (let attempt = 0; attempt < 24 && !pos; attempt++) {
        const p = window.slot_free_pos(mgr);
        if (!p || p.x == null || p.y == null) break;
        if (sameCell(p)) continue;
        if (eatenKey && (p.x | 0) + "," + (p.y | 0) === eatenKey) continue;
        pos = p;
      }
    }
    if (!pos) {
      const freePos =
        typeof window.__chessFreePos === "function"
          ? window.__chessFreePos
          : typeof d4E === "function"
            ? d4E
            : null;
      const occ = window.chess_occupied_keys(game, mgr.ka, new Set());
      // Also ban the eaten cell explicitly (still in ka until native splice).
      if (eatenKey != null) occ.add(eatenKey);
      pos = window.chess_find_legal_spawn(board, freePos, occ, null);
      if (pos && sameCell(pos)) pos = null;
    }
    if (!pos) return false;

    const make =
      window.__chessMakeApple ||
      window.__bombFruitMakeApple ||
      null;
    let dup = null;
    if (typeof make === "function") {
      try {
        dup = make(mgr, 0, 0);
      } catch (_e) {
        dup = null;
      }
    }
    if (!dup) {
      dup = {};
      if (snapshot && typeof snapshot === "object") {
        for (const key in snapshot) {
          if (!Object.prototype.hasOwnProperty.call(snapshot, key)) continue;
          if (key === "pos" || key === "nba" || key === "Oba") continue;
          try {
            dup[key] = snapshot[key];
          } catch (_e2) {}
        }
      }
    }
    if (typeof pos.clone === "function") {
      dup.pos = pos.clone();
    } else {
      dup.pos = window.chess_make_pos(pos.x, pos.y);
    }
    dup.isPiece = true;
    dup.ChessPiece = piece;
    dup.ChessColor = color;
    const typeId =
      snapshot.type != null
        ? snapshot.type
        : window[color + piece];
    if (typeId != null) dup.type = typeId;
    dup.nba = undefined;
    dup.Oba = undefined;
    dup.wm = true;
    dup.cM = 0;
    dup.nD = 0;
    // Not a Slot badge fruit.
    try {
      delete dup.slotMode;
      delete dup.__slotPortal;
      delete dup.__slotPortalPairId;
      delete dup.__slotPortalTwin;
      delete dup.__slotYinYangPair;
    } catch (_slot) {}
    mgr.ka.push(dup);
    window.appleArray = mgr.ka;
    return true;
  };

  window.chess_remove_random_opposite_piece = function chess_remove_random_opposite_piece(
    mgr,
    color
  ) {
    const list = mgr && mgr.ka;
    if (!list || !list.length) return false;
    const opposites = [];
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || !f.isPiece || f.Oka) continue;
      if (f.ChessColor && f.ChessColor !== color) opposites.push(i);
    }
    if (!opposites.length) return false;
    const pick =
      opposites[Math.floor(Math.random() * opposites.length) | 0];
    list.splice(pick, 1);
    window.appleArray = list;
    return true;
  };

  // Law: eating a piece while already carrying.
  // Success relocating → keep current carry. Fail + opposite → exit.
  // Fail + same → become eaten piece; remove one random opposite for balance.
  // Native eat splice always removes the eaten apple from its cell — this law
  // must never re-plant at that cell on fail (relocate only pushes a *new* apple).
  window.chess_on_second_piece_eat = function chess_on_second_piece_eat(eaten) {
    if (!eaten || !eaten.isPiece) return;
    if (window.head_state === "OPEN") return;

    const game = window.__remixGame;
    const mgr = (game && game.wa) || null;
    const snapshot = {
      ChessPiece: eaten.ChessPiece,
      ChessColor: eaten.ChessColor,
      type: eaten.type,
      pos: eaten.pos
        ? typeof eaten.pos.clone === "function"
          ? eaten.pos.clone()
          : { x: eaten.pos.x, y: eaten.pos.y }
        : null,
    };

    const relocated =
      !!mgr &&
      window.chess_respawn_eaten_piece &&
      window.chess_respawn_eaten_piece(snapshot, mgr);

    if (relocated) {
      // Keep head_state / head_color; board stays locked.
      if (typeof window.shield_all === "function") window.shield_all();
      return;
    }

    const sameColor =
      snapshot.ChessColor &&
      window.head_color &&
      snapshot.ChessColor === window.head_color;

    if (!sameColor) {
      // Opposite (or unknown): exit carry.
      window.head_state = "OPEN";
      window.head_color = "NONE";
      if (typeof window.shield_empty_all === "function") {
        window.shield_empty_all();
      }
      try {
        if (
          window.isSlotMachineActive &&
          window.isSlotMachineActive() &&
          typeof window.slot_update_active_trophy === "function"
        ) {
          window.slot_update_active_trophy();
        }
      } catch (_t) {}
      return;
    }

    // Same color: become the eaten piece; cull one opposite for balance.
    window.head_state = snapshot.ChessPiece;
    window.head_color = snapshot.ChessColor;
    try {
      if (
        typeof window.updateTrophySRC === "function" &&
        snapshot.type != null
      ) {
        window.updateTrophySRC(snapshot.type);
      }
    } catch (_tr) {}
    if (mgr && typeof window.chess_remove_random_opposite_piece === "function") {
      window.chess_remove_random_opposite_piece(mgr, snapshot.ChessColor);
    }
    if (typeof window.shield_all === "function") window.shield_all();
  };

  // Drop or relocate any apple whose cell is off-board / on snake / overlapping.
  // Returns false if the list had to shrink to stay even and legal.
  window.chess_sanitize_spawns = function chess_sanitize_spawns(
    mgr,
    freePos,
    fromIndex
  ) {
    if (!mgr || !mgr.ka) return true;
    const board = mgr.oa;
    const game = window.__remixGame;
    const start = fromIndex == null ? 0 : fromIndex;
    let ok = true;
    for (let i = start; i < mgr.ka.length; i++) {
      const el = mgr.ka[i];
      if (!el || !el.pos) continue;
      const occ = window.chess_occupied_keys(game, mgr.ka, new Set([i]));
      if (window.chess_is_legal_spawn(board, el.pos, occ)) continue;
      const fixed = window.chess_find_legal_spawn(board, freePos, occ, null);
      if (!fixed) {
        mgr.ka.splice(i, 1);
        i--;
        ok = false;
        continue;
      }
      if (typeof el.pos.clone === "function" && fixed.clone) {
        el.pos = fixed.clone();
      } else {
        el.pos.x = fixed.x;
        el.pos.y = fixed.y;
      }
    }
    window.appleArray = mgr.ka;
    return ok;
  };

  // Fruit eat: the game removes the eaten fruit (we skip its reposition), and this
  // spawns exactly 2 new pieces. All-or-nothing: if either cell is unavailable
  // under the spawn radius, neither spawns. Returns how many were added.
  window.chess_fruit_respawn = function chess_fruit_respawn(
    mgr,
    makeApple,
    freePos,
    pickType
  ) {
    if (!mgr || !mgr.ka) return 0;
    if (typeof makeApple !== "function") return 0;
    const board = mgr.oa;
    const game = window.__remixGame;
    window.appleArray = mgr.ka;

    const occ = window.chess_occupied_keys(game, mgr.ka, new Set());
    const posA = window.chess_find_legal_spawn(board, freePos, occ, null);
    if (!posA) return 0;
    const keyA = window.chess_pos_key(posA);
    occ.add(keyA);
    const posB = window.chess_find_legal_spawn(board, freePos, occ, null);
    if (!posB || window.chess_pos_key(posB) === keyA) return 0;

    const mk = function (pos) {
      let dup = makeApple(mgr, 0, 0);
      if (typeof pos.clone === "function") {
        dup.pos = pos.clone();
      } else {
        dup.pos.x = pos.x;
        dup.pos.y = pos.y;
      }
      if (typeof pickType === "function") dup.type = pickType(mgr);
      // wm is the game's spawn-in animation flag (cleared by manager refresh()).
      dup.wm = true;
      dup.cM = 0;
      dup.nD = 0;
      window.chess_assign_piece(dup);
      return dup;
    };
    mgr.ka.push(mk(posA), mk(posB));

    // Re-validate the committed pair; drop both together if anything is off.
    const iA = mgr.ka.length - 2;
    const iB = mgr.ka.length - 1;
    const occA = window.chess_occupied_keys(game, mgr.ka, new Set([iA]));
    const occB = window.chess_occupied_keys(game, mgr.ka, new Set([iB]));
    const okA =
      window.chess_is_legal_spawn(board, mgr.ka[iA].pos, occA) &&
      window.chess_outside_spawn_radius(game, mgr.ka[iA].pos);
    const okB =
      window.chess_is_legal_spawn(board, mgr.ka[iB].pos, occB) &&
      window.chess_outside_spawn_radius(game, mgr.ka[iB].pos);
    const same =
      window.chess_pos_key(mgr.ka[iA].pos) ===
      window.chess_pos_key(mgr.ka[iB].pos);
    if (!okA || !okB || same) {
      mgr.ka.splice(iA, 2);
      window.appleArray = mgr.ka;
      return 0;
    }
    window.appleArray = mgr.ka;
    return 2;
  };

  // Build a non-piece twin apple for Chess+Portal unlock (clone when g7 is not exposed).
  window.chess_clone_as_fruit = function chess_clone_as_fruit(src, pos) {
    if (!src) return null;
    const make = window.__chessMakeApple;
    const game = window.__remixGame;
    const mgr = game && game.wa;
    let dup = null;
    if (typeof make === "function" && mgr) {
      try {
        dup = make(mgr, 0, 0);
      } catch (_e) {
        dup = null;
      }
    }
    if (!dup) {
      dup = {};
      for (const key in src) {
        if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
        if (key === "pos") continue;
        try {
          dup[key] = src[key];
        } catch (_e2) {}
      }
    }
    if (pos) {
      if (typeof pos.clone === "function") {
        dup.pos = pos.clone();
      } else if (src.pos && typeof src.pos.constructor === "function") {
        try {
          dup.pos = new src.pos.constructor(pos.x, pos.y);
        } catch (_e3) {
          dup.pos = window.chess_make_pos(pos.x, pos.y);
        }
      } else {
        dup.pos = window.chess_make_pos(pos.x, pos.y);
      }
    }
    dup.isPiece = false;
    dup.type = src.type;
    // Tally / numbered counts: twin must share the unlocked fruit's index.
    if (src.sequenceNumber !== undefined) {
      dup.sequenceNumber = src.sequenceNumber;
    }
    dup.nba = undefined;
    dup.wm = true;
    dup.cM = 0;
    dup.nD = 0;
    return dup;
  };

  // After unlock convert: place a non-piece twin in the portal pair slot of the
  // unlocked fruit (even/odd indices). Mid-list insert breaks later pairs when
  // the unlock index is odd, so replace the existing pair partner instead.
  window.chess_spawn_unlock_twin = function chess_spawn_unlock_twin(
    unlockedApple,
    unlockedIndex
  ) {
    const game = window.__remixGame;
    if (!game || !game.wa || !unlockedApple) return null;
    const mgr = game.wa;
    const board = mgr.oa;
    window.appleArray = mgr.ka;
    const occ = window.chess_occupied_keys(game, mgr.ka, new Set());
    const freePos =
      typeof window.__chessFreePos === "function"
        ? window.__chessFreePos
        : typeof d4E === "function"
          ? d4E
          : null;
    const pos = window.chess_find_legal_spawn(board, freePos, occ, null);
    if (!pos) return null;
    const twin = window.chess_clone_as_fruit(unlockedApple, pos);
    if (!twin) return null;
    let at =
      typeof unlockedIndex === "number"
        ? unlockedIndex
        : mgr.ka.indexOf(unlockedApple);
    if (at < 0) at = mgr.ka.indexOf(unlockedApple);
    if (at < 0) at = mgr.ka.length - 1;
    const partner = at % 2 === 0 ? at + 1 : at - 1;
    if (partner >= 0 && partner < mgr.ka.length) {
      const displaced = mgr.ka[partner];
      mgr.ka[partner] = twin;
      // Keep the displaced piece when the board has more than this portal pair
      // (Dice/Bomb start at 2: partner becomes the twin; don't leave an orphan).
      if (
        displaced &&
        displaced !== unlockedApple &&
        displaced !== twin &&
        mgr.ka.length > 2
      ) {
        mgr.ka.push(displaced);
      }
    } else {
      // No pair slot (empty/odd orphan): leave unlocked unpaired only if push fails.
      mgr.ka.push(twin);
    }
    window.appleArray = mgr.ka;
    return twin;
  };

  // Before splice: remember portal twin so Chess+Portal fruit eats can clear it.
  window.chess_portal_note_fruit_twin = function chess_portal_note_fruit_twin(
    mgr,
    eatenIndex
  ) {
    window.__chessPortalNeedRespawn = false;
    window.__chessPortalTwinKey = null;
    window.__chessPortalTwinApple = null;
    if (!mgr || !mgr.ka || eatenIndex == null) return;
    const twin = eatenIndex % 2 === 0 ? eatenIndex + 1 : eatenIndex - 1;
    if (twin < 0 || twin >= mgr.ka.length) return;
    const el = mgr.ka[twin];
    if (!el || !el.pos) return;
    window.__chessPortalTwinApple = el;
    window.__chessPortalTwinKey =
      typeof window.chess_pos_key === "function"
        ? window.chess_pos_key(el.pos)
        : el.pos.x + "," + el.pos.y;
    window.__chessPortalNeedRespawn = true;
  };

  // Spawn `pairCount` legal chess pairs (2 * pairCount pieces). Stops early if
  // the board has no room. Optional assignSeq(a, b, pairIndex) for tally nums.
  window.chess_spawn_n_pairs = function chess_spawn_n_pairs(
    mgr,
    makeApple,
    freePos,
    pickType,
    pairCount,
    assignSeq
  ) {
    if (!mgr || !mgr.ka || typeof makeApple !== "function") return 0;
    let added = 0;
    const n = Math.max(0, pairCount | 0);
    for (let i = 0; i < n; i++) {
      const got = window.chess_fruit_respawn(mgr, makeApple, freePos, pickType);
      if (got < 2) break;
      if (typeof assignSeq === "function") {
        const a = mgr.ka[mgr.ka.length - 2];
        const b = mgr.ka[mgr.ka.length - 1];
        try {
          assignSeq(a, b, i);
        } catch (_e) {}
      }
      added += got;
    }
    window.appleArray = mgr.ka;
    return added;
  };

  // Chess+Portal post-fruit refill: bomb first → 48; dice/tally on empty board;
  // otherwise +2 like vanilla Chess fruit.
  window.chess_portal_combo_respawn = function chess_portal_combo_respawn(
    mgr,
    game,
    makeApple,
    freePos,
    pickType
  ) {
    if (!mgr || !mgr.ka || typeof makeApple !== "function") return 0;
    const ka = game && game.settings ? game.settings.ka : null;
    const empty = mgr.ka.length === 0;

    // Bomb: first fruit → 24 pairs (48 pieces), then normal +2.
    if (ka === 5 && game && !game.kc) {
      const n = window.chess_spawn_n_pairs(
        mgr,
        makeApple,
        freePos,
        pickType,
        24,
        null
      );
      game.kc = true;
      return n;
    }

    // Dice: last pair left (board empty after twin clear) → roll R, spawn 2R.
    if (ka === 4) {
      if (!empty) return 0;
      let R = Math.ceil(Math.random() * 6);
      if (
        window.remixIsColoredDice &&
        window.remixIsColoredDice(ka) &&
        typeof window.remixColoredDiceRoll === "function"
      ) {
        R = window.remixColoredDiceRoll(ka) || R;
      }
      return window.chess_spawn_n_pairs(
        mgr,
        makeApple,
        freePos,
        pickType,
        R,
        null
      );
    }

    // Tally: last index / empty board → 5 pairs (10 pieces), paired sequence nums.
    if (ka === 6) {
      if (!empty) return 0;
      const n = window.chess_spawn_n_pairs(
        mgr,
        makeApple,
        freePos,
        pickType,
        5,
        function (a, b, i) {
          const seq = i;
          if (a) a.sequenceNumber = seq;
          if (b) b.sequenceNumber = seq;
        }
      );
      // Point the tally counter at a living sequence so the wave is edible.
      if (mgr.ka.length > 0 && mgr.ka[0]) {
        mgr.wa = mgr.ka[0].sequenceNumber;
      }
      return n;
    }

    return window.chess_fruit_respawn(mgr, makeApple, freePos, pickType);
  };

  // After native splice(k,1): drop noted twin, then count-aware combo respawn.
  window.chess_portal_after_fruit_splice = function chess_portal_after_fruit_splice(
    mgr,
    game
  ) {
    if (!window.__chessPortalNeedRespawn) return;
    window.__chessPortalNeedRespawn = false;
    const key = window.__chessPortalTwinKey;
    const twinApple = window.__chessPortalTwinApple;
    window.__chessPortalTwinKey = null;
    window.__chessPortalTwinApple = null;
    if (!mgr || !mgr.ka) return;
    let removed = false;
    if (twinApple) {
      const byRef = mgr.ka.indexOf(twinApple);
      if (byRef >= 0) {
        mgr.ka.splice(byRef, 1);
        removed = true;
      }
    }
    if (!removed && key != null) {
      for (let i = mgr.ka.length - 1; i >= 0; i--) {
        const el = mgr.ka[i];
        if (!el || !el.pos) continue;
        const k =
          typeof window.chess_pos_key === "function"
            ? window.chess_pos_key(el.pos)
            : el.pos.x + "," + el.pos.y;
        if (k === key) {
          mgr.ka.splice(i, 1);
          break;
        }
      }
    }
    window.appleArray = mgr.ka;
    const make =
      typeof window.__chessMakeApple === "function"
        ? window.__chessMakeApple
        : typeof g7 === "function"
          ? g7
          : null;
    const freePos =
      typeof window.__chessFreePos === "function"
        ? window.__chessFreePos
        : typeof d4E === "function"
          ? d4E
          : null;
    const pickType =
      typeof window.__chessPickType === "function"
        ? window.__chessPickType
        : typeof Q3E === "function"
          ? Q3E
          : null;
    if (typeof make === "function") {
      window.chess_portal_combo_respawn(mgr, game, make, freePos, pickType);
    }
    if (
      game &&
      window.isBurgerActive &&
      window.isBurgerActive() &&
      typeof window.burger_after_respawn === "function"
    ) {
      try {
        window.burger_after_respawn(game);
      } catch (_e) {}
    }
  };

  // Convert newly spawned apples (trailing count from qaF) into alternating pieces.
  // Relocate illegal cells; drop what cannot be placed; keep an even count.
  window.chess_convert_new_apples = function chess_convert_new_apples(mgr, added) {
    if (!mgr || !mgr.ka || !added || added <= 0) return;
    window.appleArray = mgr.ka;
    let start = mgr.ka.length - added;
    for (let i = start; i < mgr.ka.length; i++) {
      window.chess_assign_piece(mgr.ka[i]);
    }
    // Prefer native freePos via game.Tb when sanitizing qaF results.
    const freePos =
      window.__remixGame && typeof window.__remixGame.Rb === "function"
        ? function (board, excl, radius) {
            return window.__remixGame.Rb(excl, radius);
          }
        : window.__remixGame && typeof window.__remixGame.Tb === "function"
        ? function (board, excl, radius) {
            return window.__remixGame.Tb(excl, radius);
          }
        : null;
    window.chess_sanitize_spawns(mgr, freePos, start);
    window.appleArray = mgr.ka;
  };

  // True while the snake head is standing on a chess piece (checked live, before
  // the score hook splices it out of appleArray).
  window.chess_eating_piece = function chess_eating_piece() {
    if (!window.isChessActive || !window.isChessActive()) return false;
    if (!window.head_pos || !window.appleArray) return false;
    let apple = window.findApple(window.head_pos[0], window.appleArray);
    return !!(apple && apple.isPiece && !apple.Oka);
  };

  // --- Code patches for v13 ---

  // Make Chess activate Shield physics via e7(..., 15)
  let f7_regex = new RegExp(
    /e7=function\(a,b\)\{return a\.Qa\?a\.Lc\.has\(b\):a\.ub===22&&a\.rSa\.has\(b\)\?!0:a\.ub===b\}/
  );
  if (code.match(f7_regex)) {
    code = code.assertReplace(
      f7_regex,
      `e7=function(a,b){var r=a.Qa?a.Lc.has(b):a.ub===22&&a.rSa.has(b)?!0:a.ub===b;if(!r&&b===15&&window.CHESS_MODE!=null){if(a.ub===window.CHESS_MODE)return!0;if(a.ub===22&&a.rSa&&a.rSa.has(window.CHESS_MODE))return!0;}return r}`
    );
  } else {
    console.error("ChessMod: failed to patch e7");
  }

  // Shield bars on chess locks: under Peaceful/Cat absorb the hit (clear nba)
  // instead of Oa, so the same-tick head move can eat the piece.
  if (
    code.match(
      /\(\(g=f\.nba\)==null\?0:g\.has\(d\)\)&&this\.Oa\(\);/
    )
  ) {
    code = code.assertReplace(
      /\(\(g=f\.nba\)==null\?0:g\.has\(d\)\)&&this\.Oa\(\);/,
      `((g=f.nba)==null?0:g.has(d))&&(window.chess_shield_hit_absorb&&window.chess_shield_hit_absorb(this,f)?0:this.Oa());`
    );
  } else {
    console.error("ChessMod: failed to patch Sc shield hit absorb");
  }
  if (
    code.match(
      /\(\(h=f\.nba\)==null\?0:h\.has\(this\.oa\.direction\)\)&&this\.Oa\(\)/
    )
  ) {
    code = code.assertReplace(
      /\(\(h=f\.nba\)==null\?0:h\.has\(this\.oa\.direction\)\)&&this\.Oa\(\)/,
      `((h=f.nba)==null?0:h.has(this.oa.direction))&&(window.chess_shield_hit_absorb&&window.chess_shield_hit_absorb(this,f)?0:this.Oa())`
    );
  }

  // Inject into game tick: track head + run chess unlock logic BEFORE other updates.
  // Visibility may have already patched this tick(); keep the matcher loose.
  // Also expose __remixGame for the Playwright harness.
  let tick_regex = /\}tick\(\)\{/;
  if (code.match(/\}tick\(\)\{var a=this\.Aa,b=this\.nj;/)) {
    code = code.assertReplace(
      /\}tick\(\)\{var a=this\.Aa,b=this\.nj;/,
      `}tick(){window.__remixGame=this;if(window.isChessActive&&window.isChessActive()){try{window.head_pos=this.oa.ka;window.head_dir=this.oa.direction;window.appleArray=this.wa.ka;window.chess_tick_logic();}catch(_ce){console.error("ChessMod: tick failed",_ce);}}var a=this.Aa,b=this.nj;`
    );
  } else if (code.match(tick_regex)) {
    code = code.assertReplace(
      tick_regex,
      `}tick(){window.__remixGame=this;if(window.isChessActive&&window.isChessActive()){try{window.head_pos=this.oa.ka;window.head_dir=this.oa.direction;window.appleArray=this.wa.ka;window.chess_tick_logic();}catch(_e){}}`
    );
  } else {
    console.error("ChessMod: failed to find tick()");
  }

  // On apple manager reset: chess state + Portal pair layout (Y3E force).
  // Pudding prepends timer code to reset(){ so we must NOT match reset(){this.ka=[] —
  // only the inner this.ka=[] / Y3E line that still exists after Pudding.
  if (code.match(/this\.ka=\s*\[\];var a=Y3E\(this\.settings\)/)) {
    code = code.assertReplace(
      /this\.ka=\s*\[\];var a=Y3E\(this\.settings\)/,
      `this.ka=[];window.appleArray=this.ka;window.head_dir="RIGHT";window.head_state="OPEN";window.head_color="NONE";window.color_turn="w";window.just_ate="fruit";var a=Y3E(this.settings)||!!(window.isChessActive&&window.isChessActive())`
    );
  } else if (code.match(/var a=Y3E\(this\.settings\)/)) {
    code = code.assertReplace(
      /var a=Y3E\(this\.settings\)/,
      `var a=Y3E(this.settings)||!!(window.isChessActive&&window.isChessActive())`
    );
  } else {
    console.error("ChessMod: failed to find Y3E apple-layout flag");
  }

  // After shield nba init on reset: turn the apples into alternating pieces, start OPEN
  let after_shield_init = new RegExp(
    /if\(e7\(this\.settings,15\)\)for\(let q of this\.ka\)q\.nba=\s*P3E\(this,q\.pos\);/
  );
  if (code.match(after_shield_init)) {
    code = code.assertReplace(
      after_shield_init,
      `if(e7(this.settings,15)&&(!window.ultraShouldSpawnFruitShields||window.ultraShouldSpawnFruitShields()))for(let q of this.ka)q.nba=P3E(this,q.pos);if(window.isChessActive&&window.isChessActive()){try{window.appleArray=this.ka;window.randomize_pieces();window.shield_empty_all();}catch(_ce){console.error("ChessMod: reset failed",_ce);}}`
    );
  } else {
    console.error("ChessMod: failed to find shield init on reset");
  }

  // Collision cleanup: remove doomed apples in pairs while chess (keep even count)
  let pair_splice = new RegExp(
    /e7\(this\.settings,2\)\?n%2===0\?\(this\.ka\.splice\(n,2\),n--\):\(this\.ka\.splice\(n-\s*1,2\),n-=2\)/
  );
  if (code.match(pair_splice)) {
    code = code.assertReplace(
      pair_splice,
      `(e7(this.settings,2)||(window.isChessActive&&window.isChessActive()))?n%2===0?(this.ka.splice(n,2),n--):(this.ka.splice(n-1,2),n-=2)`
    );
  } else {
    console.error("ChessMod: failed to find pair-splice on reset");
  }

  // Portal pair-spawn in f4E: include chess so fruit eats / dice / bomb double via all-or-nothing pairs
  let qaf_pair = new RegExp(
    /e7\(a\.settings,\s*2\)&&!f\?/
  );
  if (code.match(qaf_pair)) {
    code = code.assertReplace(
      qaf_pair,
      `(e7(a.settings,2)||(window.isChessActive&&window.isChessActive()))&&!f?`
    );
  } else {
    console.error("ChessMod: failed to find f4E portal pair condition");
  }

  // After f4E adds apples (+ optional shields), convert new ones to chess pieces
  let qaf_after_oba = new RegExp(
    /g=a\.ka\.length-g;if\(e!==void 0\)for\(c=0;c<g;c\+\+\)a\.ka\[a\.ka\.length-1-c\]\.sequenceNumber=e;if\(e7\(a\.settings,15\)\)for\(e=0;e<g;e\+\+\)c=a\.ka\[a\.ka\.length-1-e\],c\.nba=P3E\(a,c\.pos\);/
  );
  if (code.match(qaf_after_oba)) {
    code = code.assertReplace(
      qaf_after_oba,
      `g=a.ka.length-g;if(e!==void 0)for(c=0;c<g;c++)a.ka[a.ka.length-1-c].sequenceNumber=e;if(e7(a.settings,15)&&(!window.ultraShouldSpawnFruitShields||window.ultraShouldSpawnFruitShields()))for(e=0;e<g;e++)c=a.ka[a.ka.length-1-e],c.nba=P3E(a,c.pos);if(window.isChessActive&&window.isChessActive()&&g>0){window.chess_convert_new_apples(a,g);}if(g>0&&window.ultraShouldSpawnFruitShields&&!window.ultraShouldSpawnFruitShields()){for(e=0;e<g;e++){c=a.ka[a.ka.length-1-e];if(!c.isPiece)c.nba=void 0;}}`
    );
  } else {
    console.error("ChessMod: failed to find f4E trailing convert hook");
  }

  // Track selected fruit
  let case_apple = new RegExp(/case "apple":/);
  if (code.match(case_apple)) {
    code = code.assertReplace(
      case_apple,
      `case "apple":window.selectedFruit=d;`
    );
  }

  // Mute tracking
  let muted = new RegExp(/this\.muted=!this\.muted;/);
  if (code.match(muted)) {
    code = code.assertReplace(
      muted,
      `this.muted=!this.muted;window.muted=this.muted;`
    );
  }

  // Do NOT multiply dice roll by 2 — Portal pairing already doubles (R apples -> 2R pieces).

  // Score / eat: pieces never score; fruit scores. Eat helper uses a.Sh++.
  // Second piece eat while carrying → chess_on_second_piece_eat law (Chess+Slot).
  let score_regex = new RegExp(/a\.Sh\+\+;/);
  if (code.match(score_regex)) {
    code = code.assertReplace(
      score_regex,
      `if(window.isChessActive&&window.isChessActive()){let _ae=window.findApple(window.head_pos[0],window.appleArray);if(_ae&&!_ae.isPiece){window.just_ate='fruit';a.Sh++;}else if(_ae&&_ae.isPiece){window.just_ate='piece';if(window.head_state!=='OPEN'&&window.chess_on_second_piece_eat){window.chess_on_second_piece_eat(_ae);}else{window.head_state=_ae.ChessPiece;window.updateTrophySRC(_ae.type);window.head_color=_ae.ChessColor;window.shield_all();}}else{window.just_ate='fruit';a.Sh++;}}else{a.Sh++;}`
    );
  } else {
    console.error("ChessMod: failed to find score increment");
  }

  // Don't grow when eating a chess piece. This runs before the score hook, so the
  // piece is still in appleArray and can be detected live.
  let snakeLength = new RegExp(
    /e7\(a\.settings,3\)\?a\.oa\.Ua\+=2:a\.oa\.Ua\+=1;/
  );
  if (code.match(snakeLength)) {
    code = code.assertReplace(
      snakeLength,
      `e7(a.settings,3)?a.oa.Ua+=2:a.oa.Ua+=1;if(window.chess_eating_piece&&window.chess_eating_piece()){a.oa.Ua-=e7(a.settings,3)?2:1;}`
    );
  }

  // Also block Candy's random length bonus on chess piece pickup
  let candy_len_bonus = new RegExp(
    /if\(window\.isCandyActive && window\.isCandyActive\(\)\) \{\s*a\.oa\.Ua \+= Math\.floor\(Math\.random\(\) \* 6\);\s*\}/
  );
  if (code.match(candy_len_bonus)) {
    code = code.assertReplace(
      candy_len_bonus,
      `if(window.isCandyActive && window.isCandyActive() && !(window.chess_eating_piece&&window.chess_eating_piece())) {a.oa.Ua += Math.floor(Math.random() * 6);}`
    );
  }

  // Prevent native shield clear from fighting chess shields:
  let shield_clear = new RegExp(
    /e7\(a\.settings,15\)&&\(b4E\(a\.wa,([a-zA-Z0-9_$]+)\),/
  );
  if (code.match(shield_clear)) {
    code = code.assertReplace(
      shield_clear,
      `e7(a.settings,15)&&!(window.isChessActive&&window.isChessActive())&&(b4E(a.wa,$1),`
    );
  }

  // Gate Portal teleport / odd wipe for Chess+Portal:
  // - piece eats: skip entire portal branch (no P6E)
  // - while Chess active: never wipe the board on odd apple count
  // - only call P6E when the even/odd twin apple exists (odd Chess boards
  //   after piece eats / unlock can leave a lone apple; native P6E crashes on .pos)
  let portal_teleport = new RegExp(
    /if\(e7\(a\.settings,2\)\)if\(a\.wa\.ka\.length%2!==0\)\{a\.wa\.ka\.splice\(0,a\.wa\.ka\.length\);break\}else b=!0,P6E\(a\.Sa,k,f,e,g\),f&&e7\(a\.settings,20\)&&p5E\(a\.Ga\);/
  );
  if (code.match(portal_teleport)) {
    code = code.assertReplace(
      portal_teleport,
      `if(e7(a.settings,2)&&!(window.isChessActive&&window.isChessActive()&&window.just_ate==='piece'))if(a.wa.ka.length%2!==0&&!(window.isChessActive&&window.isChessActive())){a.wa.ka.splice(0,a.wa.ka.length);break}else{let _ti=k%2===0?k+1:k-1;if(_ti>=0&&_ti<a.wa.ka.length&&a.wa.ka[_ti])b=!0,P6E(a.Sa,k,f,e,g),f&&e7(a.settings,20)&&p5E(a.Ga);}`
    );
  } else {
    console.error("ChessMod: failed to find portal P6E teleport gate");
  }

  // Chess never uses native Vm reposition: e=!1 splices the eaten apple, so a
  // piece eat removes only that piece and a fruit eat spawns exactly 2 fresh
  // pieces through chess_fruit_respawn.
  // Chess+Portal fruit (incl. Dice/Tally/Bomb): note twin, splice clears it, then
  // 2-piece respawn. Solo Chess still leaves Dice/Tally/pre-bomb to native refill.
  // Key/Soko stay excluded for now.
  let spawn = new RegExp(
    /e=!1;e7\(a\.settings,2\)\?e=!0:e7\(a\.settings,10\)&&d\.Oka\?e=!1:\(e=a\.settings\.ka!==6&&\(d7\(a\.settings\)\|\|e7\(a\.settings,7\)\),e=a\.Vm\(k,\s*!e,null\)\);/
  );
  if (code.match(spawn)) {
    code = code.assertReplace(
      spawn,
      `e=!1;if(window.isChessActive&&window.isChessActive()){window.__chessMakeApple=g7;window.__chessFreePos=d4E;window.__chessPickType=Q3E;e=!1;if(window.just_ate==='fruit'&&!(e7(a.settings,8)||e7(a.settings,9))){if(window.chess_portal_combo&&window.chess_portal_combo()){window.chess_portal_note_fruit_twin(a.wa,k);}else if(!(a.settings.ka===4||a.settings.ka===6||(a.settings.ka===5&&!a.kc))){window.chess_fruit_respawn(a.wa,g7,d4E,Q3E);}}}else e7(a.settings,2)?e=!0:e7(a.settings,10)&&d.Oka?e=!1:(e=a.settings.ka!==6&&(d7(a.settings)||e7(a.settings,7)),e=a.Vm(k,!e,null));`
    );
  } else {
    console.error("ChessMod: failed to find Vm respawn path");
  }

  // After non-portal splice of eaten apple: Chess+Portal clears twin + respawns 2 pieces.
  let eat_splice = new RegExp(
    /\(a\.wa\.ka\.splice\(k,1\),k--\)/
  );
  if (code.match(eat_splice)) {
    code = code.assertReplace(
      eat_splice,
      `(a.wa.ka.splice(k,1),k--,window.chess_portal_after_fruit_splice&&window.chess_portal_after_fruit_splice(a.wa,a))`
    );
  } else {
    console.error("ChessMod: failed to find eat splice for portal twin clear");
  }

  // Tally wave refill spawns 5 slots; Chess needs 10 pieces per wave.
  let tally_wave = new RegExp(
    /var b=e7\(a\.settings,11\)\?10:5;/
  );
  if (code.match(tally_wave)) {
    code = code.assertReplace(
      tally_wave,
      `var b=(e7(a.settings,11)||(window.isChessActive&&window.isChessActive()))?10:5;`
    );
  } else {
    console.error("ChessMod: failed to find tally wave size");
  }

  // New piece placement after fruit eaten — handled by qaF pair spawn + chess_convert_new_apples

  // On play start with chess: set trophy icon (dice_doubler unused; pairing doubles)
  let play_start = new RegExp(/a\.ub=a\.ob;a\.ka=a\.Ca;/);
  if (code.indexOf("updateCandyTrophySRC") >= 0) {
    code = code.assertReplace(
      /if\(window\.CurrentModeNum===window\.CANDY_MODE\)\{window\.updateCandyTrophySRC\(\);\}/,
      `if(window.CurrentModeNum===window.CANDY_MODE){window.updateCandyTrophySRC();}if(window.CurrentModeNum===window.CHESS_MODE){window.updateTrophySRC();}`
    );
  } else if (code.match(play_start)) {
    code = code.assertReplace(
      play_start,
      `a.ub=a.ob;a.ka=a.Ca;if(window.CurrentModeNum===window.CHESS_MODE){window.updateTrophySRC();}`
    );
  }

  return code;
};

////////////////////////////////////////////////////////////////////
//RUNCODEAFTER
////////////////////////////////////////////////////////////////////

window.ChessMod.runCodeAfter = function () {
  window.add_chess_blender_toggle && window.add_chess_blender_toggle();
};
