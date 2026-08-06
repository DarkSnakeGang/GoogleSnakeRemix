window.ChessMod = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.ChessMod.runCodeBefore = function () {
  console.log("Adding Chess Mode (v12, independent mode)");

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
  console.log("Coding Chess Mode into the game (v12)");

  // Ensure fruits exist if alter runs in odd order
  if (window.new_fruit && !window._chessFruitsInjected) {
    window.injectChessFruits();
  }

  // Visibility gates fruit drawing on one checkbox for everything that is not
  // poison. Split pieces out of that branch so the Chess Pieces row applies.
  // Both the normal and the twin/infinity mirrored draw carry the same guard.
  let fruitGate =
    "(window.visiFullPass || (b.nla ? window.checkboxes.checkboxStatuses.poison : window.checkboxes.checkboxStatuses.fruit))";
  if (code.includes(fruitGate)) {
    code = code.replaceAll(
      fruitGate,
      "(window.visiFullPass || (b.nla ? window.checkboxes.checkboxStatuses.poison : (b.isPiece ? window.checkboxes.checkboxStatuses.chessPieces : window.checkboxes.checkboxStatuses.fruit)))"
    );
  } else {
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
    return (
      window.CurrentModeNum === window.CHESS_MODE ||
      (window.CurrentModeNum === 22 && window.chess_blending)
    );
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

  // Shield field name on apple objects in v12
  window.chess_shield_field = "Oba";

  window.shield_all = function shield_all() {
    if (!window.appleArray) return;
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

  // Original order: shield_all first, then unlock attempts; OPEN empties shields
  window.chess_tick_logic = function chess_tick_logic() {
    if (!window.isChessActive()) return;

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
    if (!occupiedKeys) return true;
    const k = window.chess_pos_key(pos);
    return k == null || !occupiedKeys.has(k);
  };

  window.chess_make_pos = function chess_make_pos(x, y) {
    if (typeof _ !== "undefined" && _ && typeof _.Sd === "function") {
      return new _.Sd(x, y);
    }
    return { x: x, y: y };
  };

  // Prefer native freePos/Tb (spawn radius); validate; fall back to full board scan.
  window.chess_find_legal_spawn = function chess_find_legal_spawn(
    board,
    freePos,
    occupiedKeys,
    excludeRef
  ) {
    if (typeof freePos === "function" && board) {
      for (let attempt = 0; attempt < 12; attempt++) {
        const p = freePos(board, excludeRef || null, 2);
        if (p && window.chess_is_legal_spawn(board, p, occupiedKeys)) {
          return p;
        }
      }
    }
    const game = window.__remixGame;
    if (game && typeof game.Tb === "function") {
      for (let attempt = 0; attempt < 8; attempt++) {
        const p = game.Tb(excludeRef || null, 2);
        if (p && window.chess_is_legal_spawn(board, p, occupiedKeys)) {
          return p;
        }
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
      if (window.chess_is_legal_spawn(board, pos, occupiedKeys)) return pos;
    }
    return null;
  };

  window.chess_assign_piece = function chess_assign_piece(el) {
    el.ChessPiece = window.getRandomPiece();
    el.ChessColor = window.color_turn;
    el.isPiece = true;
    el.type = window[window.color_turn + el.ChessPiece];
    el.Oba = undefined;
    window.SwitchTurn();
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
      // Cm is the game's spawn-in animation flag (cleared by manager refresh()).
      dup.Cm = true;
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
    const okA = window.chess_is_legal_spawn(board, mgr.ka[iA].pos, occA);
    const okB = window.chess_is_legal_spawn(board, mgr.ka[iB].pos, occB);
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
      window.__remixGame && typeof window.__remixGame.Tb === "function"
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
    return !!(apple && apple.isPiece);
  };

  // --- Code patches for v12 ---

  // Make Chess activate Shield physics via f7(..., 15)
  let f7_regex = new RegExp(
    /f7=function\(a,b\)\{return a\.Qa\?a\.Jc\.has\(b\):a\.ub===22&&a\.ZSa\.has\(b\)\?!0:a\.ub===b\}/
  );
  if (code.match(f7_regex)) {
    code = code.assertReplace(
      f7_regex,
      `f7=function(a,b){var r=a.Qa?a.Jc.has(b):a.ub===22&&a.ZSa.has(b)?!0:a.ub===b;if(!r&&b===15&&window.CHESS_MODE!=null){if(a.ub===window.CHESS_MODE)return!0;if(a.ub===22&&a.ZSa&&a.ZSa.has(window.CHESS_MODE))return!0;}return r}`
    );
  } else {
    console.error("ChessMod: failed to patch f7");
  }

  // Inject into game tick: track head + run chess unlock logic BEFORE other updates.
  // Visibility may have already patched this tick(); keep the matcher loose.
  // Also expose __remixGame for the Playwright harness.
  let tick_regex = /\}tick\(\)\{/;
  if (code.match(/\}tick\(\)\{var a=this\.Aa,b=this\.lj;/)) {
    code = code.assertReplace(
      /\}tick\(\)\{var a=this\.Aa,b=this\.lj;/,
      `}tick(){window.__remixGame=this;if(window.isChessActive&&window.isChessActive()){try{window.head_pos=this.oa.ka;window.head_dir=this.oa.direction;window.appleArray=this.wa.ka;window.chess_tick_logic();}catch(_ce){console.error("ChessMod: tick failed",_ce);}}var a=this.Aa,b=this.lj;`
    );
  } else if (code.match(tick_regex)) {
    code = code.assertReplace(
      tick_regex,
      `}tick(){window.__remixGame=this;if(window.isChessActive&&window.isChessActive()){try{window.head_pos=this.oa.ka;window.head_dir=this.oa.direction;window.appleArray=this.wa.ka;window.chess_tick_logic();}catch(_e){}}`
    );
  } else {
    console.error("ChessMod: failed to find tick()");
  }

  // On apple manager reset: chess state + Portal pair layout (iaF force).
  // Pudding prepends timer code to reset(){ so we must NOT match reset(){this.ka=[] —
  // only the inner this.ka=[] / iaF line that still exists after Pudding.
  if (code.match(/this\.ka=\[\];var a=iaF\(this\.settings\)/)) {
    code = code.assertReplace(
      /this\.ka=\[\];var a=iaF\(this\.settings\)/,
      `this.ka=[];window.appleArray=this.ka;window.head_dir="RIGHT";window.head_state="OPEN";window.head_color="NONE";window.color_turn="w";window.just_ate="fruit";var a=iaF(this.settings)||!!(window.isChessActive&&window.isChessActive())`
    );
  } else if (code.match(/var a=iaF\(this\.settings\)/)) {
    code = code.assertReplace(
      /var a=iaF\(this\.settings\)/,
      `var a=iaF(this.settings)||!!(window.isChessActive&&window.isChessActive())`
    );
  } else {
    console.error("ChessMod: failed to find iaF apple-layout flag");
  }

  // After shield Oba init on reset: turn the apples into alternating pieces, start OPEN
  // Note: Pudding rewrites $$E -> doubleDE before this runs
  let after_shield_init = new RegExp(
    /if\(f7\(this\.settings,15\)\)for\(let q of this\.ka\)q\.Oba=doubleDE\(this,q\.pos\);/
  );
  if (code.match(after_shield_init)) {
    code = code.assertReplace(
      after_shield_init,
      `if(f7(this.settings,15))for(let q of this.ka)q.Oba=doubleDE(this,q.pos);if(window.isChessActive&&window.isChessActive()){try{window.appleArray=this.ka;window.randomize_pieces();window.shield_empty_all();}catch(_ce){console.error("ChessMod: reset failed",_ce);}}`
    );
  } else {
    console.error("ChessMod: failed to find shield init on reset");
  }

  // Collision cleanup: remove doomed apples in pairs while chess (keep even count)
  let pair_splice = new RegExp(
    /f7\(this\.settings,2\)\?n%2===0\?\(this\.ka\.splice\(n,2\),n--\):\(this\.ka\.splice\(n-\s*1,2\),n-=2\)/
  );
  if (code.match(pair_splice)) {
    code = code.assertReplace(
      pair_splice,
      `(f7(this.settings,2)||(window.isChessActive&&window.isChessActive()))?n%2===0?(this.ka.splice(n,2),n--):(this.ka.splice(n-1,2),n-=2)`
    );
  } else {
    console.error("ChessMod: failed to find pair-splice on reset");
  }

  // Portal pair-spawn in qaF: include chess so fruit eats / dice / bomb double via all-or-nothing pairs
  let qaf_pair = new RegExp(
    /f7\(a\.settings,\s*2\)&&!f\?/
  );
  if (code.match(qaf_pair)) {
    code = code.assertReplace(
      qaf_pair,
      `(f7(a.settings,2)||(window.isChessActive&&window.isChessActive()))&&!f?`
    );
  } else {
    console.error("ChessMod: failed to find qaF portal pair condition");
  }

  // After qaF adds apples (+ optional shields), convert new ones to chess pieces
  let qaf_after_oba = new RegExp(
    /g=a\.ka\.length-g;if\(e!==void 0\)for\(c=0;c<g;c\+\+\)a\.ka\[a\.ka\.length-1-c\]\.sequenceNumber=e;if\(f7\(a\.settings,15\)\)for\(e=0;e<g;e\+\+\)c=a\.ka\[a\.ka\.length-1-e\],c\.Oba=doubleDE\(a,c\.pos\);/
  );
  if (code.match(qaf_after_oba)) {
    code = code.assertReplace(
      qaf_after_oba,
      `g=a.ka.length-g;if(e!==void 0)for(c=0;c<g;c++)a.ka[a.ka.length-1-c].sequenceNumber=e;if(f7(a.settings,15))for(e=0;e<g;e++)c=a.ka[a.ka.length-1-e],c.Oba=doubleDE(a,c.pos);if(window.isChessActive&&window.isChessActive()&&g>0){window.chess_convert_new_apples(a,g);}`
    );
  } else {
    console.error("ChessMod: failed to find qaF trailing convert hook");
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

  // Score / eat: pieces never score; fruit scores; native qaF pairing handles respawn pieces
  let score_regex = new RegExp(/this\.Oh\+\+;/);
  if (code.match(score_regex)) {
    code = code.assertReplace(
      score_regex,
      `if(window.isChessActive&&window.isChessActive()){let _ae=window.findApple(window.head_pos[0],window.appleArray);if(_ae&&!_ae.isPiece){window.just_ate='fruit';this.Oh++;}else if(_ae&&_ae.isPiece){window.just_ate='piece';window.head_state=_ae.ChessPiece;window.updateTrophySRC(_ae.type);window.head_color=_ae.ChessColor;window.shield_all();}else{window.just_ate='fruit';this.Oh++;}}else{this.Oh++;}`
    );
  } else {
    console.error("ChessMod: failed to find score increment");
  }

  // Don't grow when eating a chess piece. This runs before the score hook, so the
  // piece is still in appleArray and can be detected live.
  let snakeLength = new RegExp(
    /f7\(this\.settings,3\)\?this\.oa\.Ta\+=2:this\.oa\.Ta\+=1;/
  );
  if (code.match(snakeLength)) {
    code = code.assertReplace(
      snakeLength,
      `f7(this.settings,3)?this.oa.Ta+=2:this.oa.Ta+=1;if(window.chess_eating_piece&&window.chess_eating_piece()){this.oa.Ta-=f7(this.settings,3)?2:1;}`
    );
  }

  // Also block Candy's random length bonus on chess piece pickup
  let candy_len_bonus = new RegExp(
    /if\(window\.isCandyActive && window\.isCandyActive\(\)\) \{\s*this\.oa\.Ta \+= Math\.floor\(Math\.random\(\) \* 6\);\s*\}/
  );
  if (code.match(candy_len_bonus)) {
    code = code.assertReplace(
      candy_len_bonus,
      `if(window.isCandyActive && window.isCandyActive() && !(window.chess_eating_piece&&window.chess_eating_piece())) {this.oa.Ta += Math.floor(Math.random() * 6);}`
    );
  }

  // Prevent native shield clear from fighting chess shields:
  // f7(this.settings,15)&&(maF(this.wa,Wd),...)
  let shield_clear = new RegExp(
    /f7\(this\.settings,15\)&&\(maF\(this\.wa,([a-zA-Z0-9_$]+)\),/
  );
  if (code.match(shield_clear)) {
    code = code.assertReplace(
      shield_clear,
      `f7(this.settings,15)&&!(window.isChessActive&&window.isChessActive())&&(maF(this.wa,$1),`
    );
  }

  // Chess never uses the native reposition (Mn): Xh=!1 makes the game splice the
  // eaten apple, so a piece eat removes only that piece and a fruit eat spawns
  // exactly 2 fresh pieces through chess_fruit_respawn.
  // Dice (ka 4), Tally (ka 6) and pre-first-explosion Bomb (ka 5) keep their own
  // refills, which the game fires when the board empties; Key/Soko spawn elsewhere.
  let spawn = new RegExp(
    /else\{let Ni=e7\(this\.settings\)\|\|f7\(this\.settings,7\);Xh=this\.Mn\(vd,!Ni,null\)\}/
  );
  if (code.match(spawn)) {
    code = code.assertReplace(
      spawn,
      `else{if(window.isChessActive&&window.isChessActive()){Xh=!1;if(window.just_ate==='fruit'&&!(this.settings.ka===4||this.settings.ka===6||(this.settings.ka===5&&!this.hc)||f7(this.settings,8)||f7(this.settings,9))){window.chess_fruit_respawn(this.wa,h7,oaF,aaF);}}else{let Ni=e7(this.settings)||f7(this.settings,7);Xh=this.Mn(vd,!Ni,null);}}`
    );
  } else {
    console.error("ChessMod: failed to find Mn respawn path");
  }

  // Tally wave refill (sdF) spawns 5 slots; Chess needs 10 pieces per wave.
  // Each slot gets its own tally index, so we raise the slot count instead of
  // routing through iaF pairing — paired slots share one sequence number, and
  // since every Chess eat advances the tally counter the twin would never
  // become edible again. Fewer than 10 spawn when the board has no room.
  let tally_wave = new RegExp(
    /var b=f7\(a\.settings,11\)\?10:5;a\.wa\.wa=1;/
  );
  if (code.match(tally_wave)) {
    code = code.assertReplace(
      tally_wave,
      `var b=(f7(a.settings,11)||(window.isChessActive&&window.isChessActive()))?10:5;a.wa.wa=1;`
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
