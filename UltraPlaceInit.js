window.UltraPlace = window.UltraPlace || {};

window.FNBX = window.FNBX || "https://www.google.com/logos/fnbx/";
window.ultraPlaceFruitType = 0;
window.disableMineMode = true;
window.disableGateMode = true;
window.disableBridgeMode = true;
window.disableStatueBodyPlant = true;
window.disableKeyResetPlant = true;

/* ULTRA_PLACE_CODEC_START */
window.ULTRA_PLACE_SIZES = [
  { id: "standard", label: "Standard", w: 17, h: 15, idx: 0 },
  { id: "small", label: "Small", w: 10, h: 9, idx: 1 },
  { id: "large", label: "Large", w: 24, h: 21, idx: 2 },
  { id: "micro", label: "Micro", w: 5, h: 4, idx: 3 },
  { id: "tiny", label: "Tiny", w: 7, h: 6, idx: 4 },
  { id: "compact", label: "Compact", w: 12, h: 11, idx: 5 },
  { id: "super", label: "Super", w: 37, h: 32, idx: 6 },
  { id: "tooBig", label: "Too Big", w: 64, h: 56, idx: 7 },
  { id: "humongous", label: "Humongous", w: 105, h: 92, idx: 8 },
  { id: "wayTooBig", label: "Way Too Big", w: 168, h: 147, idx: 9 },
  { id: "enormous", label: "Enormous", w: 600, h: 530, idx: 10 },
];

window.ultraPlaceCodec = {
  sizes: window.ULTRA_PLACE_SIZES,
  // Export letters: Yx,y Cx,y Ex,y,h Ex,y,v Px,y Vx,y,U Hx,y,ULDR Nx,y Tx,y,0 Fx,y,bB Kx,y,t Lx,y,t
  appleOffsetForSize: function (w, h) {
    if (w === 17 && h === 15) return { x: -12, y: -7 };
    if (w === 10 && h === 9) return { x: -7, y: -4 };
    if (w === 24 && h === 21) return { x: -18, y: -10 };
    if (w > 0 && h > 0) {
      return { x: -Math.floor((3 * w) / 4), y: -Math.floor(h / 2) };
    }
    return { x: -7, y: -4 };
  },
  sizeById: function (id) {
    return this.sizes.find(function (s) {
      return s.id === id;
    });
  },
  sizeByDims: function (w, h) {
    return this.sizes.find(function (s) {
      return s.w === w && s.h === h;
    });
  },
  dirFromLetter: function (raw) {
    const t = String(raw || "").toUpperCase();
    if (t === "U" || t === "UP") return "UP";
    if (t === "D" || t === "DOWN") return "DOWN";
    if (t === "L" || t === "LEFT") return "LEFT";
    if (t === "R" || t === "RIGHT") return "RIGHT";
    return null;
  },
  dirLetter: function (dir) {
    const d = String(dir || "").toUpperCase();
    if (d === "UP") return "U";
    if (d === "DOWN") return "D";
    if (d === "LEFT") return "L";
    if (d === "RIGHT") return "R";
    return d.charAt(0) || "U";
  },
  statueIsCracked: function (extra, type) {
    const v = extra === undefined || extra === null || extra === "" ? type : extra;
    return v === true || v === 1 || v === "1";
  },
  dirsFromCode: function (raw) {
    const t = String(raw || "").toUpperCase();
    if (!t) return [];
    const dirs = [];
    let i = 0;
    while (i < t.length) {
      const ch = t.charAt(i);
      if (t.indexOf("DOWN", i) === i) {
        dirs.push("DOWN");
        i += 4;
      } else if (t.indexOf("LEFT", i) === i) {
        dirs.push("LEFT");
        i += 4;
      } else if (t.indexOf("RIGHT", i) === i) {
        dirs.push("RIGHT");
        i += 5;
      } else if (t.indexOf("UP", i) === i) {
        dirs.push("UP");
        i += 2;
      } else if (ch === "U") {
        dirs.push("UP");
        i += 1;
      } else if (ch === "D") {
        dirs.push("DOWN");
        i += 1;
      } else if (ch === "L") {
        dirs.push("LEFT");
        i += 1;
      } else if (ch === "R") {
        dirs.push("RIGHT");
        i += 1;
      } else {
        i += 1;
      }
    }
    const seen = {};
    const out = [];
    for (let n = 0; n < dirs.length; n++) {
      if (!seen[dirs[n]]) {
        seen[dirs[n]] = true;
        out.push(dirs[n]);
      }
    }
    return out;
  },
  dirLettersPacked: function (dirs) {
    const order = ["UP", "DOWN", "LEFT", "RIGHT"];
    const seen = {};
    const list = dirs || [];
    for (let i = 0; i < list.length; i++) {
      const full = this.dirFromLetter(list[i]) || this.dirFromLetter(this.dirLetter(list[i]));
      if (full) seen[full] = true;
    }
    let packed = "";
    for (let j = 0; j < order.length; j++) {
      if (seen[order[j]]) packed += this.dirLetter(order[j]);
    }
    return packed;
  },
  chessFromCode: function (raw) {
    const t = String(raw || "");
    const color = t.charAt(0);
    const p = t.charAt(1);
    if ((color !== "b" && color !== "w") || !p) return null;
    const map = { B: "bishop", K: "king", N: "knight", P: "pawn", Q: "queen", R: "rook" };
    const piece = map[p.toUpperCase()];
    if (!piece) return null;
    return { color: color, piece: piece };
  },
  chessToCode: function (color, piece) {
    const map = { bishop: "B", king: "K", knight: "N", pawn: "P", queen: "Q", rook: "R" };
    return String(color || "w") + (map[piece] || "P");
  },
  parseEntity: function (token) {
    if (!token) return null;
    const letter = token.charAt(0);
    const parts = token.slice(1).split(",");
    const x = parseInt(parts[0], 10);
    const y = parseInt(parts[1], 10);
    if (!isFinite(x) || !isFinite(y) || x < 0 || y < 0) return null;
    switch (letter) {
      case "A": {
        let type = 0;
        if (parts[2] !== undefined && parts[2] !== "") {
          type = parseInt(parts[2], 10);
          if (!isFinite(type)) type = 0;
        }
        return { x: x, y: y, category: "apple", type: type };
      }
      case "W":
        return { x: x, y: y, category: "wall", type: -1 };
      case "B":
        return { x: x, y: y, category: "box", type: -1 };
      case "S":
        return { x: x, y: y, category: "snakehead", type: -1 };
      case "Y":
        return { x: x, y: y, category: "goal", type: -1 };
      case "C":
        return { x: x, y: y, category: "bridge", type: -1 };
      case "E": {
        const ori = String(parts[2] || "h").toLowerCase().charAt(0);
        return { x: x, y: y, category: "gate", type: -1, extra: ori === "v" ? "v" : "h" };
      }
      case "P": {
        let type = 0;
        if (parts[2] !== undefined && parts[2] !== "") {
          type = parseInt(parts[2], 10);
          if (!isFinite(type)) type = 0;
        }
        return { x: x, y: y, category: "poison", type: type };
      }
      case "V": {
        const dir = this.dirFromLetter(parts[2]);
        if (!dir) return null;
        return { x: x, y: y, category: "arrow", type: -1, extra: dir };
      }
      case "H": {
        const dirs = this.dirsFromCode(parts.slice(2).join(","));
        if (!dirs.length) return null;
        if (dirs.length === 1) {
          return { x: x, y: y, category: "shield", type: -1, extra: dirs[0] };
        }
        return dirs.map(function (dir) {
          return { x: x, y: y, category: "shield", type: -1, extra: dir };
        });
      }
      case "N":
        return { x: x, y: y, category: "mine", type: -1 };
      case "T": {
        const cracked = String(parts[2] || "0") === "1" ? 1 : 0;
        return { x: x, y: y, category: "statue", type: cracked, extra: cracked };
      }
      case "F": {
        const chess = this.chessFromCode(parts[2]);
        if (!chess) return null;
        return {
          x: x,
          y: y,
          category: "chess",
          type: -1,
          extra: chess.color + chess.piece,
          ChessColor: chess.color,
          ChessPiece: chess.piece,
        };
      }
      case "K": {
        let type = parseInt(parts[2], 10);
        if (!isFinite(type)) type = 0;
        type = Math.max(0, Math.min(23, type));
        return { x: x, y: y, category: "key", type: type };
      }
      case "L": {
        let type = parseInt(parts[2], 10);
        if (!isFinite(type)) type = 0;
        type = Math.max(0, Math.min(23, type));
        return { x: x, y: y, category: "keyblock", type: type };
      }
      default:
        return null;
    }
  },
  exportEntity: function (entity) {
    if (!entity) return "";
    const x = entity.x;
    const y = entity.y;
    switch (entity.category) {
      case "apple":
        return "A" + x + "," + y + "," + (entity.type || 0);
      case "wall":
        return "W" + x + "," + y;
      case "box":
        return "B" + x + "," + y;
      case "snakehead":
        return "S" + x + "," + y;
      case "goal":
        return "Y" + x + "," + y;
      case "bridge":
        return "C" + x + "," + y;
      case "gate":
        return "E" + x + "," + y + "," + (entity.extra === "v" ? "v" : "h");
      case "poison":
        return "P" + x + "," + y + "," + (entity.type || 0);
      case "arrow":
        return "V" + x + "," + y + "," + this.dirLetter(entity.extra);
      case "shield":
        return "H" + x + "," + y + "," + this.dirLettersPacked([entity.extra]);
      case "mine":
        return "N" + x + "," + y;
      case "statue":
        return "T" + x + "," + y + "," + (this.statueIsCracked(entity.extra, entity.type) ? 1 : 0);
      case "chess":
        return (
          "F" +
          x +
          "," +
          y +
          "," +
          this.chessToCode(
            entity.ChessColor || (entity.extra || "w").charAt(0),
            entity.ChessPiece ||
              (entity.extra && entity.extra.length > 2 ? entity.extra.slice(1) : entity.extra)
          )
        );
      case "key":
        return "K" + x + "," + y + "," + (entity.type || 0);
      case "keyblock":
        return "L" + x + "," + y + "," + (entity.type || 0);
      default:
        return "";
    }
  },
  parseLevel: function (levelCode) {
    const out = [];
    const codes = String(levelCode || "").trim().split(/\s+/);
    for (let i = 1; i < codes.length; i++) {
      try {
        const ent = this.parseEntity(codes[i]);
        if (Array.isArray(ent)) {
          for (let j = 0; j < ent.length; j++) out.push(ent[j]);
        } else if (ent) {
          out.push(ent);
        }
      } catch (_err) {}
    }
    return out;
  },
  exportLevel: function (width, height, pixelList) {
    const parts = [width + "x" + height];
    const list = pixelList || [];
    const shieldAt = {};
    const shieldOrder = [];
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (e && e.category === "shield") {
        const key = e.x + "," + e.y;
        if (!shieldAt[key]) {
          shieldAt[key] = { x: e.x, y: e.y, dirs: [] };
          shieldOrder.push(key);
        }
        if (e.extra) shieldAt[key].dirs.push(e.extra);
        continue;
      }
      const token = this.exportEntity(e);
      if (token) parts.push(token);
    }
    for (let s = 0; s < shieldOrder.length; s++) {
      const cell = shieldAt[shieldOrder[s]];
      const packed = this.dirLettersPacked(cell.dirs);
      if (packed) parts.push("H" + cell.x + "," + cell.y + "," + packed);
    }
    return parts.join(" ");
  },
};
/* ULTRA_PLACE_CODEC_END */

window.ultraPlaceStatueIsCracked = function (extra, type) {
  if (window.ultraPlaceCodec && typeof window.ultraPlaceCodec.statueIsCracked === "function") {
    return window.ultraPlaceCodec.statueIsCracked(extra, type);
  }
  const v = extra === undefined || extra === null || extra === "" ? type : extra;
  return v === true || v === 1 || v === "1";
};

window.ULTRA_CHESS_PLACE = [
  { color: "b", piece: "bishop", key: "bbishop", url: "https://i.postimg.cc/NG8bwZw7/bb.png" },
  { color: "b", piece: "king", key: "bking", url: "https://i.postimg.cc/zGNyYP8W/bk.png" },
  { color: "b", piece: "knight", key: "bknight", url: "https://i.postimg.cc/ZqK0CB95/bn.png" },
  { color: "b", piece: "pawn", key: "bpawn", url: "https://i.postimg.cc/fLVLfGf4/bp.png" },
  { color: "b", piece: "queen", key: "bqueen", url: "https://i.postimg.cc/g0SjRzRq/bq.png" },
  { color: "b", piece: "rook", key: "brook", url: "https://i.postimg.cc/fL1b288V/br.png" },
  { color: "w", piece: "bishop", key: "wbishop", url: "https://i.postimg.cc/nc4L2YBL/wb.png" },
  { color: "w", piece: "king", key: "wking", url: "https://i.postimg.cc/4ytxrp0B/wk.png" },
  { color: "w", piece: "knight", key: "wknight", url: "https://i.postimg.cc/ncbzqws5/wn.png" },
  { color: "w", piece: "pawn", key: "wpawn", url: "https://i.postimg.cc/VsbvrcNn/wp.png" },
  { color: "w", piece: "queen", key: "wqueen", url: "https://i.postimg.cc/mgTg5zyy/wq.png" },
  { color: "w", piece: "rook", key: "wrook", url: "https://i.postimg.cc/kgwg3Jj3/wr.png" },
];

window.ultraPlaceIsChessFruit = function (fruit) {
  const n = (fruit && (fruit.Normal || fruit.Real || "")) || "";
  return /\/(bb|bk|bn|bp|bq|br|wb|wk|wn|wp|wq|wr)\.png/.test(n);
};

window.ultraPlaceIsGoldenFruit = function (fruit) {
  const n = (fruit && (fruit.Normal || fruit.Pixel || fruit.Real || "")) || "";
  return /gold/i.test(n);
};

window.ultraPlaceIsSkullFruit = function (fruit) {
  const n = (fruit && (fruit.Normal || fruit.Pixel || fruit.Real || "")) || "";
  return /poison-skull|trophy_10/.test(n);
};

window.ultraPlacePuddingEntries = function () {
  const fruits = window.new_fruit || [];
  const base =
    typeof last_fruit_num !== "undefined"
      ? last_fruit_num
      : document.querySelector("#apple")
        ? document.querySelector("#apple").children.length - 1
        : 23;
  const out = [];
  for (let i = 0; i < fruits.length; i++) {
    const f = fruits[i];
    if (!f) continue;
    if (window.ultraPlaceIsChessFruit(f)) continue;
    if (window.ultraPlaceIsGoldenFruit(f)) continue;
    if (window.ultraPlaceIsSkullFruit(f)) continue;
    out.push({ fruit: f, type: base + 1 + i, index: i });
  }
  return out;
};

window.ultraPlaceSpritePos = function (frames, frame, axis) {
  frames = Math.max(1, frames | 0);
  frame = Math.max(0, Math.min(frames - 1, frame | 0));
  const size =
    axis === "y" ? "100% " + frames * 100 + "%" : frames * 100 + "% 100%";
  const pct = frames <= 1 ? 0 : (frame / (frames - 1)) * 100;
  const pos = axis === "y" ? "0 " + pct.toFixed(4) + "%" : pct.toFixed(4) + "% 0";
  return { size: size, pos: pos };
};

window.ultraPlaceArrowIcon = function (dir) {
  const cache = (window.__ultraPlaceArrowIcons = window.__ultraPlaceArrowIcons || {});
  if (cache[dir]) return cache[dir];
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.translate(64, 64);
  if (dir === "UP") ctx.rotate(-Math.PI / 2);
  else if (dir === "DOWN") ctx.rotate(Math.PI / 2);
  else if (dir === "LEFT") ctx.rotate(Math.PI);
  ctx.strokeStyle = "#EA7E0B";
  ctx.lineWidth = 14;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-36, -32);
  ctx.lineTo(40, 0);
  ctx.lineTo(-36, 32);
  ctx.stroke();
  cache[dir] = c.toDataURL("image/png");
  return cache[dir];
};

window.ultraPlaceShieldIcon = function (dir) {
  const cache = (window.__ultraPlaceShieldIcons = window.__ultraPlaceShieldIcons || {});
  if (cache[dir]) return cache[dir];
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#E53935";
  ctx.beginPath();
  ctx.arc(64, 64, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#43A047";
  ctx.lineWidth = 16;
  ctx.lineCap = "butt";
  ctx.beginPath();
  if (dir === "UP") {
    ctx.moveTo(28, 22);
    ctx.lineTo(100, 22);
  } else if (dir === "DOWN") {
    ctx.moveTo(28, 106);
    ctx.lineTo(100, 106);
  } else if (dir === "LEFT") {
    ctx.moveTo(22, 28);
    ctx.lineTo(22, 100);
  } else {
    ctx.moveTo(106, 28);
    ctx.lineTo(106, 100);
  }
  ctx.stroke();
  cache[dir] = c.toDataURL("image/png");
  return cache[dir];
};

window.ultraPlacePoisonSrc = function () {
  const fruits = window.new_fruit || [];
  for (let i = 0; i < fruits.length; i++) {
    const f = fruits[i];
    if (!f || !window.ultraPlaceIsSkullFruit(f)) continue;
    const n = f.Normal || "";
    if (!n) break;
    return n.indexOf("http") === 0 ? n : window.FNBX + n;
  }
  return window.FNBX + "snake_arcade/v12/trophy_10.png";
};

window.ultraPlaceEraseIcon = function () {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
    '<rect width="64" height="64" rx="10" fill="#37474f"/>' +
    '<path fill="#ef9a9a" d="M16 38l20-20 12 12-20 20z"/>' +
    '<path fill="#90caf9" d="M36 18l8 8-8 8-8-8z"/>' +
    '<path fill="#eceff1" d="M16 50h32v4H16z"/>' +
    "</svg>";
  return "data:image/svg+xml," + encodeURIComponent(svg);
};

window.ultraPlaceOptionHtml = function (category, type, extra, title, visual) {
  visual = visual || {};
  const extraAttr = extra === undefined || extra === null ? "" : ' data-extra="' + extra + '"';
  const attrs =
    ' class="place-option" draggable="false" data-type="' +
    type +
    '" data-category="' +
    category +
    '"' +
    extraAttr +
    (title ? ' title="' + title + '"' : "");
  if (visual.kind === "sprite") {
    const sp = window.ultraPlaceSpritePos(visual.frames, visual.frame, visual.axis);
    const rot = visual.rotate ? "transform:rotate(" + visual.rotate + "deg);" : "";
    return (
      "<div" +
      attrs +
      ' style="background-image:url(\'' +
      visual.src +
      "');background-repeat:no-repeat;background-size:" +
      sp.size +
      ";background-position:" +
      sp.pos +
      ";" +
      rot +
      '"></div>'
    );
  }
  if (visual.kind === "overlay") {
    const ov = window.ultraPlaceSpritePos(
      visual.overlayFrames,
      visual.overlayFrame,
      visual.overlayAxis || "x"
    );
    const rot = visual.rotate ? "transform:rotate(" + visual.rotate + "deg);" : "";
    return (
      "<div" +
      attrs +
      ' style="position:relative;background-image:url(\'' +
      visual.src +
      "');background-repeat:no-repeat;background-size:contain;background-position:center;" +
      rot +
      '"><span class="ultra-place-overlay" style="background-image:url(\'' +
      visual.overlay +
      "');background-repeat:no-repeat;background-size:" +
      ov.size +
      ";background-position:" +
      ov.pos +
      ';"></span></div>'
    );
  }
  const src = visual.src || visual.dataUrl || "";
  const rot = visual.rotate ? ' style="transform:rotate(' + visual.rotate + 'deg)"' : "";
  return "<img" + attrs + ' src="' + src + '"' + rot + ">";
};

window.ultraPlaceTabDefs = function () {
  return [
    { id: "original", label: "Original Fruit", cols: 4 },
    { id: "pudding", label: "Pudding Fruit", cols: 4 },
    { id: "objects", label: "Objects", cols: 4 },
    { id: "key", label: "Key", cols: 5 },
    { id: "chess", label: "Chess", cols: 6 },
  ];
};

window.ultraPlaceBuildGridHtml = function (tabId) {
  const fnbx = window.FNBX;
  if (tabId === "original") {
    let html = "";
    for (let i = 0; i < 24; i++) {
      const n = i < 10 ? "0" + i : String(i);
      html += window.ultraPlaceOptionHtml("apple", i, "", "Fruit " + i, {
        src: fnbx + "snake_arcade/v18/apple_" + n + ".png",
      });
    }
    return html;
  }
  if (tabId === "pudding") {
    const entries = window.ultraPlacePuddingEntries();
    if (!entries.length) {
      return '<div class="ultra-place-empty">Pudding fruit loads with the fruit picker.</div>';
    }
    return entries
      .map(function (e) {
        const src = e.fruit.Normal || e.fruit.Real || "";
        return window.ultraPlaceOptionHtml("apple", e.type, "", "Pudding fruit", { src: src });
      })
      .join("");
  }
  if (tabId === "objects") {
    const box = fnbx + "snake_arcade/v4/box.png";
    const dirs = ["UP", "RIGHT", "DOWN", "LEFT"];
    let html = "";
    html += window.ultraPlaceOptionHtml("erase", -1, "", "Erase", {
      dataUrl: window.ultraPlaceEraseIcon(),
    });
    html += window.ultraPlaceOptionHtml("wall", -1, "", "Wall", {
      src: fnbx + "snake_arcade/v22/trophy_01.png",
    });
    html += window.ultraPlaceOptionHtml("box", -1, "", "Sokobox", {
      kind: "sprite",
      src: box,
      frames: 8,
      frame: 0,
      axis: "x",
    });
    html += window.ultraPlaceOptionHtml("goal", -1, "", "Sokogoal", {
      kind: "sprite",
      src: box,
      frames: 8,
      frame: 2,
      axis: "x",
    });
    html += window.ultraPlaceOptionHtml("bridge", -1, "", "Bridge", {
      src: fnbx + "snake_arcade/v22/trophy_20.png",
    });
    html += window.ultraPlaceOptionHtml("gate", -1, "h", "Gate H", {
      src: fnbx + "snake_arcade/v21/trophy_19.png",
    });
    html += window.ultraPlaceOptionHtml("gate", -1, "v", "Gate V", {
      src: fnbx + "snake_arcade/v21/trophy_19.png",
      rotate: 90,
    });
    html += window.ultraPlaceOptionHtml("poison", -1, "", "Poison", {
      src: window.ultraPlacePoisonSrc(),
    });
    dirs.forEach(function (d) {
      html += window.ultraPlaceOptionHtml("arrow", -1, d, "Arrow " + d.toLowerCase(), {
        dataUrl: window.ultraPlaceArrowIcon(d),
      });
    });
    dirs.forEach(function (d) {
      html += window.ultraPlaceOptionHtml("shield", -1, d, "Shield " + d.toLowerCase(), {
        dataUrl: window.ultraPlaceShieldIcon(d),
      });
    });
    html += window.ultraPlaceOptionHtml("mine", -1, "", "Mine", {
      kind: "sprite",
      src: fnbx + "snake_arcade/mine.png",
      frames: 10,
      frame: 9,
      axis: "y",
    });
    html += window.ultraPlaceOptionHtml("statue", 0, 0, "Statue", {
      src: fnbx + "snake_arcade/v16/trophy_13.png",
    });
    html += window.ultraPlaceOptionHtml("statue", 1, 1, "Cracked statue", {
      kind: "overlay",
      src: fnbx + "snake_arcade/v16/trophy_13.png",
      overlay: fnbx + "snake_arcade/cracks.png",
      overlayFrames: 4,
      overlayFrame: 0,
      overlayAxis: "x",
    });
    return html;
  }
  if (tabId === "key") {
    const keys = fnbx + "snake_arcade/v19/key_types.png";
    const blocks = fnbx + "snake_arcade/v19/key_types_dark.png";
    let html = '<div class="ultra-place-row-label">Keys</div><div class="ultra-place-key-row">';
    for (let i = 0; i < 24; i++) {
      html += window.ultraPlaceOptionHtml("key", i, "", "Key " + i, {
        kind: "sprite",
        src: keys,
        frames: 24,
        frame: i,
        axis: "x",
      });
    }
    html += '</div><div class="ultra-place-row-label">Blocks</div><div class="ultra-place-key-row">';
    for (let j = 0; j < 24; j++) {
      html += window.ultraPlaceOptionHtml("keyblock", j, "", "Keyblock " + j, {
        kind: "sprite",
        src: blocks,
        frames: 24,
        frame: j,
        axis: "x",
      });
    }
    html += "</div>";
    return html;
  }
  if (tabId === "chess") {
    if (typeof window.injectChessFruits === "function") window.injectChessFruits();
    return window.ULTRA_CHESS_PLACE.map(function (p) {
      return window.ultraPlaceOptionHtml(
        "chess",
        window[p.color + p.piece] != null ? window[p.color + p.piece] : -1,
        p.color + p.piece,
        p.color + " " + p.piece,
        { src: p.url }
      );
    }).join("");
  }
  return "";
};

window.ultraPlaceEnhanceIcons = function () {};

window.ultraPlaceSelectOption = function (el) {
  if (!el) return;
  const type = parseInt(el.dataset.type, 10);
  const category = el.dataset.category;
  const extra = el.dataset.extra;
  window.mousePlaceMode = {
    category: category,
    type: isFinite(type) ? type : 0,
    extra: extra,
  };
  if (category === "statue") {
    const cracked = window.ultraPlaceStatueIsCracked(extra, window.mousePlaceMode.type);
    window.mousePlaceMode.extra = cracked ? 1 : 0;
    window.mousePlaceMode.type = cracked ? 1 : 0;
  }
  if (category === "apple") {
    window.ultraPlaceFruitType = window.mousePlaceMode.type;
  }
  if (category === "chess" && extra) {
    const color = extra.charAt(0);
    const piece = extra.slice(1);
    window.mousePlaceMode.ChessColor = color;
    window.mousePlaceMode.ChessPiece = piece;
    if (typeof window.injectChessFruits === "function") window.injectChessFruits();
    if (window[color + piece] != null) window.mousePlaceMode.type = window[color + piece];
  }
  const panel = document.getElementById("place-panel");
  if (panel) {
    panel.querySelectorAll(".place-option").forEach(function (img) {
      img.style.filter = "";
      img.classList.remove("ultra-place-on");
    });
  }
  el.style.filter = "";
  el.classList.add("ultra-place-on");
  window.ultraSetCustomBrush(category === "erase" ? "erase" : "place");
};

window.ultraPlaceShowTab = function (tabId) {
  window.ultraPlaceTab = tabId;
  const panel = document.getElementById("place-panel");
  const grid = document.getElementById("ultra-place-grid");
  if (!panel || !grid) return;
  const def = window.ultraPlaceTabDefs().find(function (t) {
    return t.id === tabId;
  });
  panel.setAttribute("data-ultra-place-tab", tabId);
  panel.setAttribute("data-ultra-place-cols", def ? String(def.cols) : "4");
  grid.innerHTML = window.ultraPlaceBuildGridHtml(tabId);
  window.ultraPlaceEnhanceIcons(grid);
  grid.querySelectorAll(".place-option").forEach(function (img) {
    img.addEventListener("click", function () {
      window.ultraPlaceSelectOption(this);
    });
  });
  panel.querySelectorAll(".ultra-place-tab").forEach(function (btn) {
    btn.classList.toggle("ultra-place-tab-on", btn.dataset.tab === tabId);
  });
  const mode = window.mousePlaceMode || {};
  let match = null;
  grid.querySelectorAll(".place-option").forEach(function (img) {
    const sameCat = img.dataset.category === mode.category;
    const sameType = String(img.dataset.type) === String(mode.type);
    const sameExtra = (img.dataset.extra || "") === (mode.extra || "");
    if (sameCat && (mode.category === "apple" ? sameType : true) && (img.dataset.extra ? sameExtra : sameType || sameExtra)) {
      match = img;
    }
  });
  if (match) window.ultraPlaceSelectOption(match);
  else {
    grid.querySelectorAll(".place-option").forEach(function (img) {
      img.style.filter = "";
      img.classList.remove("ultra-place-on");
    });
  }
};

window.ultraInstallPlaceUi = function () {
  const panel = document.getElementById("place-panel");
  if (!panel || panel.dataset.ultraPlace === "1") return;
  const tabs = window.ultraPlaceTabDefs();
  const tabHtml = tabs
    .map(function (t) {
      return (
        '<button type="button" class="ultra-place-tab" data-tab="' +
        t.id +
        '">' +
        t.label +
        "</button>"
      );
    })
    .join("");
  panel.innerHTML =
    '<div id="ultra-place-tabs" class="ultra-place-tabs">' +
    tabHtml +
    '</div><div id="ultra-place-grid" class="ultra-place-grid"></div>';
  panel.dataset.ultraPlace = "1";
  panel.querySelectorAll(".ultra-place-tab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.ultraPlaceShowTab(this.dataset.tab);
    });
  });
  window.ultraPlaceShowTab("original");
};

window.ultraPlaceToolLabel = function (mode) {
  mode = mode || window.mousePlaceMode || {};
  const cat = mode.category || "apple";
  const extra = mode.extra || "";
  const names = {
    apple: "Fruit " + (mode.type || 0),
    wall: "Wall",
    box: "Sokobox",
    goal: "Sokogoal",
    bridge: "Bridge",
    gate: extra === "v" ? "Gate V" : "Gate H",
    poison: "Poison",
    arrow: "Arrow " + extra,
    shield: "Shield " + extra,
    mine: "Mine",
    statue: (typeof window.ultraPlaceStatueIsCracked === "function"
      ? window.ultraPlaceStatueIsCracked(mode.extra, mode.type)
      : mode.extra === 1 || mode.extra === "1" || mode.type === 1 || mode.type === "1")
      ? "Statue cracked"
      : "Statue",
    key: "Key " + (mode.type || 0),
    keyblock: "Keyblock " + (mode.type || 0),
    chess: "Chess " + extra,
    snakehead: "Snake Start",
    erase: "Erase",
  };
  return names[cat] || cat;
};

window.ultraSetCustomBrush = function (kind) {
  if (kind === "place" || !kind) {
    window.ultraCustomBrushOverride = null;
    if (window.customPresetManager) window.customPresetManager.brush = "place";
  } else {
    window.ultraCustomBrushOverride = kind;
    if (window.customPresetManager) window.customPresetManager.brush = kind;
  }
  window.ultraSyncCustomBrushChip();
};

window.ultraSyncCustomBrushChip = function () {
  const status = document.getElementById("ultra-custom-status");
  const override = window.ultraCustomBrushOverride;
  if (status) {
    if (override === "erase") status.textContent = "Click cells to delete";
    else if (override === "snakehead") status.textContent = "Click a cell for snake start";
    else status.textContent = window.ultraPlaceToolLabel();
  }
  document.querySelectorAll("#ultra-custom-tools .ultra-custom-chip").forEach(function (el) {
    el.classList.toggle("ultra-custom-chip-on", el.dataset.customBrush === (override || "place"));
  });
};

window.ultraInstallCustomPicker = function () {
  const panel = document.getElementById("custom-panel");
  const brush = document.getElementById("custom-brush");
  if (!panel || !brush || brush.dataset.ultraPlace === "1") return;
  brush.dataset.ultraPlace = "1";
  brush.style.display = "none";
  const brushLabel = panel.querySelector('label[for="custom-brush"]');
  if (brushLabel) brushLabel.style.display = "none";
  panel.querySelectorAll("br").forEach(function (br) {
    br.remove();
  });

  const header = panel.querySelector(":scope > div");
  if (!header) return;

  const actions = document.createElement("div");
  actions.id = "ultra-custom-actions";
  ["custom-import", "custom-export", "custom-clear", "custom-refresh"].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) actions.appendChild(el);
  });
  header.insertBefore(actions, header.firstChild);

  const size = document.getElementById("custom-map-size");
  const sizeLabel = panel.querySelector('label[for="custom-map-size"]');
  if (size && sizeLabel) {
    const row = document.createElement("div");
    row.className = "ultra-custom-field";
    sizeLabel.textContent = "Map size";
    row.appendChild(sizeLabel);
    row.appendChild(size);
    header.insertBefore(row, actions.nextSibling);
  }

  const tools = document.createElement("div");
  tools.id = "ultra-custom-tools";
  tools.innerHTML =
    '<div class="ultra-custom-modes">' +
    '<button type="button" class="ultra-custom-chip" data-custom-brush="place">Paint</button>' +
    '<button type="button" class="ultra-custom-chip" data-custom-brush="snakehead">Start</button>' +
    '<button type="button" class="ultra-custom-chip" data-custom-brush="erase">Erase</button>' +
    "</div>" +
    '<div id="ultra-custom-status" class="ultra-custom-status"></div>';
  const sizeRow = header.querySelector(".ultra-custom-field");
  header.insertBefore(tools, sizeRow ? sizeRow.nextSibling : actions.nextSibling);

  const intro = header.querySelector("p");
  if (intro) {
    intro.className = "ultra-custom-hint";
    intro.textContent = "Pick an object on the right, then click the grid. Right-click erases.";
    header.appendChild(intro);
  }

  tools.querySelectorAll(".ultra-custom-chip").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.ultraSetCustomBrush(this.dataset.customBrush);
    });
  });
  window.ultraSetCustomBrush("place");
};

window.ultraInstallCustomSizes = function () {
  const sel = document.getElementById("custom-map-size");
  if (!sel || sel.dataset.ultraPlace === "1") return;
  sel.dataset.ultraPlace = "1";
  const current = window.customPresetManager && window.customPresetManager.currentMapSize;
  sel.innerHTML = window.ULTRA_PLACE_SIZES.map(function (s) {
    return '<option value="' + s.id + '">' + s.label + "</option>";
  }).join("");
  if (current) sel.value = current;
};

window.ultraPlaceDrawEntity = function (ctx, x, y, w, h, category, type, extra) {
  const colors = {
    apple: "#E05826",
    wall: "#578A34",
    box: "#F0A036",
    snakehead: "#4673E8",
    goal: "#C62828",
    bridge: "#8D6E63",
    gate: "#7E57C2",
    poison: "#212121",
    arrow: "#1565C0",
    shield: "#1A237E",
    mine: "#455A64",
    statue: "#90A4AE",
    key: "#FDD835",
    keyblock: "#F9A825",
    chess: "#5D4037",
  };
  ctx.fillStyle = colors[category] || "#E05826";
  ctx.fillRect(x, y, w, h);
  const glyphMap = {
    goal: "Y",
    bridge: "C",
    gate: extra === "v" ? "E|" : "E-",
    poison: "P",
    mine: "N",
    statue: (typeof window.ultraPlaceStatueIsCracked === "function"
      ? window.ultraPlaceStatueIsCracked(extra, type)
      : extra === 1 || extra === "1" || type === 1 || type === "1")
      ? "T*"
      : "T",
    key: "K",
    keyblock: "L",
    chess: "F",
    arrow: extra === "DOWN" ? "v" : extra === "LEFT" ? "<" : extra === "RIGHT" ? ">" : "^",
  };
  const g = glyphMap[category];
  if (g && w >= 6) {
    ctx.fillStyle = "#fff";
    ctx.font = Math.max(7, Math.floor(h * 0.55)) + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(g, x + w / 2, y + h / 2);
  }
};

window.ultraPlaceDrawShieldBars = function (ctx, x, y, w, h, dirs) {
  const list = dirs || [];
  if (!list.length) return;
  ctx.save();
  ctx.strokeStyle = "#1B5E20";
  ctx.lineWidth = Math.max(2, Math.round(Math.min(w, h) * 0.18));
  ctx.lineCap = "butt";
  const inset = ctx.lineWidth / 2;
  for (let i = 0; i < list.length; i++) {
    const dir = list[i];
    ctx.beginPath();
    if (dir === "UP") {
      ctx.moveTo(x + inset, y + inset);
      ctx.lineTo(x + w - inset, y + inset);
    } else if (dir === "DOWN") {
      ctx.moveTo(x + inset, y + h - inset);
      ctx.lineTo(x + w - inset, y + h - inset);
    } else if (dir === "LEFT") {
      ctx.moveTo(x + inset, y + inset);
      ctx.lineTo(x + inset, y + h - inset);
    } else if (dir === "RIGHT") {
      ctx.moveTo(x + w - inset, y + inset);
      ctx.lineTo(x + w - inset, y + h - inset);
    }
    ctx.stroke();
  }
  ctx.restore();
};

window.ultraCustomHasAppleAt = function (list, x, y) {
  return (list || []).some(function (e) {
    return e.x === x && e.y === y && (e.category === "apple" || e.category === "poison" || e.category === "chess");
  });
};

window.ultraWrapCustomManager = function () {
  const mgr = window.customPresetManager;
  if (!mgr || mgr.__ultraPlace) return;
  mgr.__ultraPlace = true;

  mgr.changeMapSize = function (newSize) {
    const spec = window.ultraPlaceCodec.sizeById(newSize);
    if (!spec) throw new Error("Unrecognised map size! Found " + newSize);
    this.currentMapSize = newSize;
    this.currentBoardWidth = spec.w;
    this.currentBoardHeight = spec.h;
    this.clearAll();
    this.placeInitialApple();
    this.draw();
    window.selectNewSizeSettingAndHardReset(spec.idx);
  };

  mgr.drawEntity = function (xCoord, yCoord, width, height, category, type, extra) {
    window.ultraPlaceDrawEntity(this.ctx, xCoord, yCoord, width, height, category, type, extra);
  };

  const origDraw = mgr.draw.bind(mgr);
  mgr.draw = function () {
    const tileWidth = this.canvasWidth / this.currentBoardWidth;
    const tileHeight = this.canvasHeight / this.currentBoardHeight;
    this.ctx.fillStyle = "#a2d149";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillStyle = "#aad751";
    for (let j = 0; j < this.currentBoardHeight; j++) {
      for (let i = 0; i < this.currentBoardWidth; i++) {
        if ((i + j) % 2 === 0) this.ctx.fillRect(i * tileWidth, j * tileHeight, tileWidth, tileHeight);
      }
    }
    for (let k of this.pixelList) {
      if (k.category === "shield") continue;
      this.drawEntity(k.x * tileWidth, k.y * tileHeight, tileWidth, tileHeight, k.category, k.type, k.extra);
    }
    const bars = {};
    for (let s = 0; s < this.pixelList.length; s++) {
      const e = this.pixelList[s];
      if (!e || e.category !== "shield") continue;
      const key = e.x + "," + e.y;
      if (!bars[key]) bars[key] = { x: e.x, y: e.y, dirs: [] };
      if (e.extra) bars[key].dirs.push(e.extra);
    }
    Object.keys(bars).forEach(function (key) {
      const cell = bars[key];
      if (!window.ultraCustomHasAppleAt(this.pixelList, cell.x, cell.y)) {
        this.drawEntity(cell.x * tileWidth, cell.y * tileHeight, tileWidth, tileHeight, "apple", 0, "");
      }
      window.ultraPlaceDrawShieldBars(
        this.ctx,
        cell.x * tileWidth,
        cell.y * tileHeight,
        tileWidth,
        tileHeight,
        cell.dirs
      );
    }, this);
  };

  mgr.removeAtCoord = function (boardX, boardY) {
    let i = this.pixelList.length;
    while (i--) {
      const e = this.pixelList[i];
      if (e.x === boardX && e.y === boardY) {
        this.pixelList.splice(i, 1);
        continue;
      }
      if (e.category === "gate") {
        if (boardX >= e.x && boardX <= e.x + 1 && boardY >= e.y && boardY <= e.y + 1) {
          this.pixelList.splice(i, 1);
        }
      }
    }
  };

  mgr.attemptPlace = function (xPixelCoord, yPixelCoord, isErase) {
    const tileWidth = this.canvasWidth / this.currentBoardWidth;
    const tileHeight = this.canvasHeight / this.currentBoardHeight;
    const boardXCoord = Math.floor(xPixelCoord / tileWidth);
    const boardYCoord = Math.floor(yPixelCoord / tileHeight);
    if (this.lastSpotDrawnOn.x === boardXCoord && this.lastSpotDrawnOn.y === boardYCoord) return;
    this.lastSpotDrawnOn = { x: boardXCoord, y: boardYCoord };
    if (
      boardXCoord < 0 ||
      boardYCoord < 0 ||
      boardXCoord >= this.currentBoardWidth ||
      boardYCoord >= this.currentBoardHeight
    ) {
      return;
    }

    const override = window.ultraCustomBrushOverride || this.brush;
    const mode = window.mousePlaceMode || { category: "apple", type: 0 };
    if (isErase || override === "erase" || mode.category === "erase") {
      this.removeAtCoord(boardXCoord, boardYCoord);
      this.draw();
      return;
    }
    if (override === "snakehead") {
      this.removeAtCoord(boardXCoord, boardYCoord);
      this.removeSnakeHeads();
      this.pixelList.push({ x: boardXCoord, y: boardYCoord, category: "snakehead", type: -1 });
      this.draw();
      return;
    }
    if (mode.category === "shield") {
      if (!window.ultraCustomHasAppleAt(this.pixelList, boardXCoord, boardYCoord)) {
        this.pixelList.push({
          x: boardXCoord,
          y: boardYCoord,
          category: "apple",
          type: window.ultraPlaceFruitType || 0,
        });
      }
      const dir = mode.extra || "UP";
      let found = -1;
      for (let s = 0; s < this.pixelList.length; s++) {
        const e = this.pixelList[s];
        if (e.category === "shield" && e.x === boardXCoord && e.y === boardYCoord && e.extra === dir) {
          found = s;
          break;
        }
      }
      if (found >= 0) this.pixelList.splice(found, 1);
      else this.pixelList.push({ x: boardXCoord, y: boardYCoord, category: "shield", type: -1, extra: dir });
      this.draw();
      return;
    }

    if (mode.category === "gate") {
      const vertical = mode.extra === "v";
      if (boardXCoord + 1 >= this.currentBoardWidth || boardYCoord + 1 >= this.currentBoardHeight) {
        this.draw();
        return;
      }
      this.removeAtCoord(boardXCoord, boardYCoord);
      this.removeAtCoord(boardXCoord + 1, boardYCoord);
      this.removeAtCoord(boardXCoord, boardYCoord + 1);
      this.removeAtCoord(boardXCoord + 1, boardYCoord + 1);
      this.pixelList.push({
        x: boardXCoord,
        y: boardYCoord,
        category: "gate",
        type: -1,
        extra: vertical ? "v" : "h",
      });
      this.draw();
      return;
    }

    const keepShields =
      mode.category === "apple" || mode.category === "poison" || mode.category === "chess";
    const savedShields = keepShields
      ? this.pixelList.filter(function (e) {
          return e.category === "shield" && e.x === boardXCoord && e.y === boardYCoord;
        })
      : [];
    this.removeAtCoord(boardXCoord, boardYCoord);
    const ent = {
      x: boardXCoord,
      y: boardYCoord,
      category: mode.category || "apple",
      type: mode.type,
      extra: mode.extra,
    };
    if (mode.category === "apple") ent.type = mode.type || 0;
    if (mode.category === "statue") {
      ent.extra = window.ultraPlaceStatueIsCracked(mode.extra, mode.type) ? 1 : 0;
      ent.type = ent.extra;
    }
    if (mode.category === "poison") {
      ent.type = window.ultraPlaceFruitType || 0;
    }
    if (mode.category === "chess") {
      ent.ChessColor = mode.ChessColor;
      ent.ChessPiece = mode.ChessPiece;
      ent.extra = (mode.ChessColor || "") + (mode.ChessPiece || "");
      ent.type = mode.type;
    }
    this.pixelList.push(ent);
    for (let sh = 0; sh < savedShields.length; sh++) this.pixelList.push(savedShields[sh]);
    this.draw();
  };

  mgr.getExportCode = function () {
    return window.ultraPlaceCodec.exportLevel(this.currentBoardWidth, this.currentBoardHeight, this.pixelList);
  };

  mgr.getPixelListFromLevelCode = function (levelCode) {
    return window.ultraPlaceCodec.parseLevel(levelCode);
  };

  mgr.importCode = function (fullCode) {
    fullCode = String(fullCode || "").trim();
    this.pixelList = this.getPixelListFromLevelCode(fullCode);
    try {
      const mapPart = fullCode.split(" ")[0];
      const bits = mapPart.split("x");
      const boardWidth = parseInt(bits[0], 10);
      const boardHeight = parseInt(bits[1], 10);
      if (isFinite(boardWidth) && isFinite(boardHeight) && boardWidth > 0 && boardHeight > 0) {
        this.currentBoardWidth = boardWidth;
        this.currentBoardHeight = boardHeight;
        const spec = window.ultraPlaceCodec.sizeByDims(boardWidth, boardHeight);
        let newSizeSetting = null;
        if (spec) {
          this.currentMapSize = spec.id;
          newSizeSetting = spec.idx;
        }
        const sel = document.getElementById("custom-map-size");
        if (sel) sel.value = this.currentMapSize;
        window.selectNewSizeSettingAndHardReset(newSizeSetting);
      }
    } catch (_err) {}
    this.draw();
  };

  void origDraw;
};

window.ultraWrapAppleOffset = function () {
  if (typeof window.getAppleSpawnPointOffset !== "function") return;
  if (window.getAppleSpawnPointOffset.__ultraPlace) return;
  window.getAppleSpawnPointOffset = function () {
    try {
      const dims = window.wholeSnakeObject && window.boardDimensions
        ? eval("window.wholeSnakeObject." + window.boardDimensions)
        : null;
      const w = dims && dims.width;
      const h = dims && dims.height;
      if (w && h) {
        const off = window.ultraPlaceCodec.appleOffsetForSize(w, h);
        window.ultraDerivedAppleOffset = off;
        return off;
      }
    } catch (_e) {}
    if (window.ultraDerivedAppleOffset) return window.ultraDerivedAppleOffset;
    return { x: -7, y: -4 };
  };
  window.getAppleSpawnPointOffset.__ultraPlace = true;
};

window.ultraCaptureAppleOffsetFromBoard = function () {
  try {
    const dims = window.wholeSnakeObject && window.boardDimensions
      ? eval("window.wholeSnakeObject." + window.boardDimensions)
      : null;
    if (dims && dims.width && dims.height) {
      window.ultraDerivedAppleOffset = window.ultraPlaceCodec.appleOffsetForSize(dims.width, dims.height);
    }
  } catch (_e) {}
};

window.ultraEnsureChessMode = function () {
  if (window.CHESS_MODE == null) return;
  if (typeof window.ensureGameMode === "function") window.ensureGameMode(window.CHESS_MODE);
  try {
    const settings = window.wholeSnakeObject && window.wholeSnakeObject.settings;
    if (settings && settings.ub === 22) {
      window.chess_blending = true;
      if (typeof window.correct_chess_selection === "function") window.correct_chess_selection();
    }
  } catch (_e) {}
};

window.ultraPlaceAppend = function (code, snippet) {
  const fn = window.appendCodeWithinSnakeModule;
  if (typeof fn === "function") return fn(code, snippet, false);
  return code.replace(/}\)\(this\._s\);\n\/\/ Google Inc\.|}\);\n\/\/ Google Inc\./, snippet + "$&");
};

window.ultraPlaceCapture = function (code, re, idx, label) {
  const idxN = idx == null ? 1 : idx;
  function hit(regex) {
    try {
      const m = code.match(regex);
      return m ? m[idxN] : null;
    } catch (_e) {
      return null;
    }
  }
  let found = hit(re);
  if (!found && re instanceof RegExp) {
    found = hit(
      new RegExp(
        re.source.replace(/\\n\?/g, "\\s*").replace(/=/g, "\\s*=\\s*"),
        re.flags
      )
    );
  }
  if (!found) {
    console.error("UltraPlace: failed to capture " + label);
    return null;
  }
  return found;
};

window.UltraPlace.alterSnakeCode = function (code) {
  const coordCtor = window.coordConstructor || "_.Od";
  const modeCheck = window.ultraPlaceCapture(
    code,
    /([$a-zA-Z0-9_]{0,8})=function\(a,b\)\{(?:return |var r=)a\.[$a-zA-Z0-9_]{0,8}\?a\.[$a-zA-Z0-9_]{0,8}\.has\(b\):a\.[$a-zA-Z0-9_]{0,8}===22/,
    1,
    "modeCheck"
  );
  const addGoal = window.ultraPlaceCapture(
    code,
    /([$a-zA-Z0-9_]{0,8})=function\(a,b,c\)\{c=\(a\.oa\.size\+c\)\*/,
    1,
    "addSokogoal"
  );
  const addArrow = window.ultraPlaceCapture(
    code,
    /([$a-zA-Z0-9_]{0,8})=function\(a,b,c\)\{var d=a\.ka\[c\.y\]\[c\.x\];d\.direction=b/,
    1,
    "addArrow"
  );
  const addGate = window.ultraPlaceCapture(
    code,
    /([$a-zA-Z0-9_]{0,8})=function\(a,b,c,d\)\{c\?\(a\.ka\[b\.y\]\[b\.x\]\.B7\.set\("RIGHT"/,
    1,
    "addGate"
  );
  const addStatue = window.ultraPlaceCapture(
    code,
    /([$a-zA-Z0-9_]{0,8})=function\(a,b,c\)\{a\.oa\.set\([$a-zA-Z0-9_]{0,8}\(b\),c\);[$a-zA-Z0-9_]{0,8}\(a\.Aa,b,c\)\}/,
    1,
    "addStatue"
  );
  const addWall = window.ultraPlaceCapture(
    code,
    /([$a-zA-Z0-9_]{0,8})=function\(a,b,c\)\{a\.Aa\.set\([$a-zA-Z0-9_]{0,8}\(b\),c\);a\.wa\[b\.y\]\[b\.x\]\+\+\}/,
    1,
    "addWall"
  );
  const delWall = window.ultraPlaceCapture(
    code,
    /([$a-zA-Z0-9_]{0,8})=function\(a,b\)\{a\.Aa\.delete\([$a-zA-Z0-9_]{0,8}\(b\)\);a\.wa\[b\.y\]\[b\.x\]--\}/,
    1,
    "delWall"
  );
  const serialCoord = window.ultraPlaceCapture(
    code,
    /([$a-zA-Z0-9_]{0,8})=function\(a\)\{return a\.x<<16\|a\.y\}/,
    1,
    "Y6"
  );
  const wallContainer = window.ultraPlaceCapture(
    code,
    /this\.([$a-zA-Z0-9_]{0,8})=new [$a-zA-Z0-9_]{0,8}\(this\.settings,this\.ka,this\.oa,this\.Ka,this\.Ja\.bind\(this\)\)/,
    1,
    "walls"
  );
  const sokoContainer = window.ultraPlaceCapture(
    code,
    /this\.([$a-zA-Z0-9_]{0,8})=new [$a-zA-Z0-9_]{0,8}\(this\.settings,this\.ka,this\.oa,this\.wa,this\.Ka,this\.Qa,this\.hb,this\.Ga\)/,
    1,
    "soko"
  );
  const arrowContainer = window.ultraPlaceCapture(
    code,
    /this\.([$a-zA-Z0-9_]{0,8})=new [$a-zA-Z0-9_]{0,8}\(this\.settings,\s*this\.ka,\s*this\.Ja\.bind\(this\)\);\s*this\.[$a-zA-Z0-9_]{0,8}=new [$a-zA-Z0-9_]{0,8}\(this\.settings,\s*this\.ka,\s*this\.Ja\.bind\(this\)\)/,
    1,
    "arrows"
  );
  const gateContainer = window.ultraPlaceCapture(
    code,
    /this\.[$a-zA-Z0-9_]{0,8}=new [$a-zA-Z0-9_]{0,8}\(this\.settings,this\.ka,this\.Ja\.bind\(this\)\);this\.([$a-zA-Z0-9_]{0,8})=new [$a-zA-Z0-9_]{0,8}\(this\.settings,this\.ka,this\.Ja\.bind\(this\)\);this\.[$a-zA-Z0-9_]{0,8}=new [$a-zA-Z0-9_]{0,8}\(this\.settings,this\.ka\)/,
    1,
    "gates"
  );
  const bridgeContainer = window.ultraPlaceCapture(
    code,
    /this\.([$a-zA-Z0-9_]{0,8})=new [$a-zA-Z0-9_]{0,8}\(this\.settings,this\.ka\);this\.[$a-zA-Z0-9_]{0,8}=\n?new/,
    1,
    "bridges"
  );
  const statueContainer = window.ultraPlaceCapture(
    code,
    /this\.([$a-zA-Z0-9_]{0,8})=new [$a-zA-Z0-9_]{0,8}\(this\.settings,\s*this\.ka,\s*this\.oa,\s*this\.hb,\s*this\.Ca\)/,
    1,
    "statues"
  );
  const mineContainer = window.ultraPlaceCapture(
    code,
    /this\.([$a-zA-Z0-9_]{0,8})=new [$a-zA-Z0-9_]{0,8}\(this\.settings,\s*this\.ka,\s*this\.oa,\s*this\.wa,\s*this\.hb,\s*this\.Aa/,
    1,
    "mines"
  );
  const keyContainer = window.ultraPlaceCapture(
    code,
    /this\.([$a-zA-Z0-9_]{0,8})=new [$a-zA-Z0-9_]{0,8}\(this\.settings,this\.ka,this\.oa,this\.wa,this\.hb,this\.Ca,this\.Aa,this\.Ka\)/,
    1,
    "keys"
  );
  const appleHolder = window.appleArrayHolderOfWholeSnakeObject || "wa";
  const appleArr = window.appleArray || "ka";
  const wallSet = window.ultraPlaceCapture(
    code,
    /[a-z]\.([$a-zA-Z0-9_]{0,8})\.set\([$a-zA-Z0-9_]{0,8}\([a-z]\),[a-z]\);[a-z]\.[$a-zA-Z0-9_]{0,8}\[[a-z]\.y\]\[[a-z]\.x\]\+\+/,
    1,
    "wallSet"
  );
  const sokoBoxSet = window.ultraPlaceCapture(
    code,
    /[a-z]\.([$a-zA-Z0-9_]{0,8})\.add\([a-z]\);[$a-zA-Z0-9_]{0,8}\([a-z]\.settings,16\)/,
    1,
    "sokoBoxSet"
  );
  const sokoGoalSet = window.ultraPlaceCapture(
    code,
    /[a-z]\.([$a-zA-Z0-9_]{0,8})\.add\([a-z]\),[$a-zA-Z0-9_]{0,8}\([a-z]\.settings,7\)&&[a-z]\.[$a-zA-Z0-9_]{0,8}\.add/,
    1,
    "sokoGoalSet"
  ) || "d_";
  const bridgeColor = window.ultraPlaceCapture(
    code,
    /([$a-zA-Z0-9_]{1,8})\s*=\s*function\s*\(\s*a\s*,\s*b\s*\)\s*\{\s*return\s+[$a-zA-Z0-9_]{1,8}\s*\[\s*a\.settings\.wa\s*===\s*10/,
    1,
    "bridgeColor"
  );

  const names = {
    coordCtor: coordCtor,
    modeCheck: modeCheck,
    addGoal: addGoal,
    addArrow: addArrow,
    addGate: addGate,
    addStatue: addStatue,
    addWall: addWall,
    delWall: delWall,
    serialCoord: serialCoord,
    wallContainer: wallContainer,
    sokoContainer: sokoContainer,
    arrowContainer: arrowContainer,
    gateContainer: gateContainer,
    bridgeContainer: bridgeContainer,
    statueContainer: statueContainer,
    mineContainer: mineContainer,
    keyContainer: keyContainer,
    appleHolder: appleHolder,
    appleArr: appleArr,
    wallSet: wallSet,
    sokoBoxSet: sokoBoxSet,
    sokoGoalSet: sokoGoalSet,
    bridgeColor: bridgeColor,
  };
  window.ultraPlaceNames = names;

  function patchFn(re, insert, label) {
    if (!code.match(re)) {
      console.error("UltraPlace: failed to suppress " + label);
      return;
    }
    code = code.replace(re, insert);
  }

  patchFn(
    /([$a-zA-Z0-9_]{0,8}=function\(a\)\{)(var b=[$a-zA-Z0-9_]{0,8}\(a\.ka,null,9\);)/,
    "$1if(window.disableMineMode)return;$2",
    "mines"
  );
  patchFn(
    /([$a-zA-Z0-9_]{0,8}=function\(a\)\{)(var b=[$a-zA-Z0-9_]{0,8}\(a\.ka,null,10\);)/,
    "$1if(window.disableBridgeMode)return;$2",
    "bridges"
  );
  patchFn(
    /([$a-zA-Z0-9_]{0,8}=function\(a,b\)\{)(var c=\[\],d=\[\];for\(var e=0;e<a\.oa\.oa\.height)/,
    "$1if(window.disableGateMode)return;$2",
    "gates"
  );
  patchFn(
    /([$a-zA-Z0-9_]{0,8}=function\(a,b\)\{)(for\(var c=a\.wa\.ka,d=[$a-zA-Z0-9_]{0,8}\(a\.settings,5\))/,
    "$1if(window.disableStatueBodyPlant)return;$2",
    "statues"
  );
  patchFn(
    /([$a-zA-Z0-9_]{0,8}=function\(a\)\{)(var b=a\.wa\.ka,c=!1;for\(let d of a\.oa\.keys\(\))/,
    "$1if(window.disableStatueBodyPlant)return;$2",
    "statueCrumble"
  );

  const keyResetRe =
    /reset\(\)\{this\.keys=\[\];if\(([$a-zA-Z0-9_]{0,8})\(this\.settings,8\)\)\{/;
  if (code.match(keyResetRe)) {
    code = code.replace(
      keyResetRe,
      "reset(){this.keys=[];if(!window.disableKeyResetPlant&&$1(this.settings,8)){"
    );
  } else {
    console.error("UltraPlace: failed to suppress key reset plant");
  }

  const n = names;
  const missing = Object.keys(n).filter(function (k) {
    return !n[k];
  });
  if (missing.length) {
    console.error("UltraPlace: missing captures", missing.join(","));
  }

  code = window.ultraPlaceAppend(
    code,
    `
  globalThis.ultraBoardSize = function() {
    const game = window.wholeSnakeObject;
    if(!game) return {width:0,height:0};
    try {
      return eval('game.' + window.boardDimensions);
    } catch(e) {
      return game.ka && game.ka.oa ? game.ka.oa : {width:0,height:0};
    }
  };

  globalThis.ultraAppleList = function() {
    const game = window.wholeSnakeObject;
    if(!game) return [];
    const holder = game.${n.appleHolder} || game.wa;
    if(!holder) return [];
    return holder.${n.appleArr} || holder.ka || [];
  };

  globalThis.ultraApplePos = function(apple) {
    if(!apple) return null;
    if(apple.pos && isFinite(apple.pos.x) && isFinite(apple.pos.y)) return apple.pos;
    const named = window.applePosProperty && apple[window.applePosProperty];
    if(named && isFinite(named.x) && isFinite(named.y)) return named;
    return apple.pos || named || null;
  };

  globalThis.ultraFindAppleAt = function(x, y) {
    const apples = ultraAppleList();
    const spots = ultraAppleSearchSpots(x, y);
    for(let s=0;s<spots.length;s++) {
      const sx = spots[s].x, sy = spots[s].y;
      for(let i=0;i<apples.length;i++) {
        const p = ultraApplePos(apples[i]);
        if(p && Math.round(Number(p.x)) === sx && Math.round(Number(p.y)) === sy) return apples[i];
      }
    }
    return null;
  };

  globalThis.ultraAppleSearchSpots = function(x, y) {
    const spots = [{x: Math.round(Number(x)), y: Math.round(Number(y))}];
    try {
      const off = typeof window.getAppleSpawnPointOffset === 'function' ? window.getAppleSpawnPointOffset() : null;
      if(off && (off.x || off.y)) {
        spots.push({x: Math.round(Number(x) - off.x), y: Math.round(Number(y) - off.y)});
        spots.push({x: Math.round(Number(x) + off.x), y: Math.round(Number(y) + off.y)});
      }
    } catch(_e) {}
    return spots;
  };

  globalThis.ultraRemoveAppleAt = function(x, y) {
    const apples = ultraAppleList();
    const spots = ultraAppleSearchSpots(x, y);
    for(let i=apples.length-1;i>=0;i--) {
      const p = ultraApplePos(apples[i]);
      if(!p) continue;
      const px = Math.round(Number(p.x)), py = Math.round(Number(p.y));
      for(let s=0;s<spots.length;s++) {
        if(px === spots[s].x && py === spots[s].y) { apples.splice(i,1); break; }
      }
    }
  };

  globalThis.ultraArrowManager = function() {
    const game = window.wholeSnakeObject;
    if(!game) return null;
    const named = ${n.arrowContainer ? JSON.stringify(n.arrowContainer) : "null"};
    const byName = named && game[named];
    function isArrows(v) {
      const cell = v && Array.isArray(v.ka) && v.ka[0] && v.ka[0][0];
      return !!(cell && typeof cell.direction === 'string');
    }
    if(isArrows(byName)) return byName;
    const keys = Object.keys(game);
    for(let i=0;i<keys.length;i++) {
      if(isArrows(game[keys[i]])) return game[keys[i]];
    }
    return byName || null;
  };
  globalThis.emptyArrows = function() {
    const arrows = ultraArrowManager();
    if(arrows && typeof arrows.reset === 'function') arrows.reset();
  };
  globalThis.emptyGates = function() {
    const game = window.wholeSnakeObject;
    if(game && game.${n.gateContainer} && typeof game.${n.gateContainer}.reset === 'function') game.${n.gateContainer}.reset();
  };
  globalThis.emptyBridges = function() {
    const game = window.wholeSnakeObject;
    if(game && game.${n.bridgeContainer} && typeof game.${n.bridgeContainer}.reset === 'function') game.${n.bridgeContainer}.reset();
  };
  globalThis.ultraMineManager = function() {
    const game = window.wholeSnakeObject;
    if(!game) return null;
    const named = ${n.mineContainer ? JSON.stringify(n.mineContainer) : "null"};
    const byName = named && game[named];
    if(byName && byName.oa instanceof Set) return byName;
    const keys = Object.keys(game);
    for(let i=0;i<keys.length;i++) {
      const v = game[keys[i]];
      if(v && v !== game && v.oa instanceof Set && v.Aa instanceof Set && v.wa instanceof Set) return v;
    }
    return byName || null;
  };
  globalThis.emptyMines = function() {
    const ma = ultraMineManager();
    if(ma && typeof ma.reset === 'function') ma.reset();
    else if(ma && ma.oa && typeof ma.oa.clear === 'function') ma.oa.clear();
  };
  globalThis.ultraStatueManager = function() {
    const game = window.wholeSnakeObject;
    if(!game) return null;
    const named = ${n.statueContainer ? JSON.stringify(n.statueContainer) : "null"};
    const byName = named && game[named];
    if(byName && byName.oa instanceof Map) return byName;
    const keys = Object.keys(game);
    for(let i=0;i<keys.length;i++) {
      const v = game[keys[i]];
      if(v && v.oa instanceof Map && v.Ca instanceof Set && typeof v.Ba === 'number') return v;
    }
    return byName || null;
  };
  globalThis.emptyStatues = function() {
    const game = window.wholeSnakeObject;
    const ya = ultraStatueManager();
    if(!game || !ya || !ya.oa) return;
    for(const st of ya.oa.values()) {
      if(st && st.pos && ${n.delWall}) ${n.delWall}(game.${n.wallContainer}, st.pos);
    }
    ya.oa.clear();
  };
  globalThis.emptyKeys = function() {
    const game = window.wholeSnakeObject;
    if(game && game.${n.keyContainer}) game.${n.keyContainer}.keys = [];
  };
  globalThis.emptyKeyblocks = function() {
    const game = window.wholeSnakeObject;
    if(!game || !game.${n.wallContainer} || !game.${n.wallContainer}.${n.wallSet}) return;
    const walls = game.${n.wallContainer}.${n.wallSet};
    const drop = [];
    for(const [k,v] of walls.entries()) {
      if(v && v.yNa !== undefined && v.yNa !== null) drop.push(v);
    }
    for(const w of drop) {
      if(w.pos && ${n.delWall}) ${n.delWall}(game.${n.wallContainer}, w.pos);
    }
  };
  globalThis.ultraEmptyExtraObjects = function() {
    emptyArrows();
    emptyGates();
    emptyBridges();
    emptyMines();
    emptyStatues();
    emptyKeys();
    emptyKeyblocks();
  };

  globalThis.ultraPairKeysAndBlocks = function() {
    const game = window.wholeSnakeObject;
    if(!game || !game.${n.keyContainer} || !game.${n.wallContainer}) return;
    const keys = game.${n.keyContainer}.keys || [];
    const walls = game.${n.wallContainer}.${n.wallSet};
    if(!walls) return;
    const blocks = [];
    for(const v of walls.values()) {
      if(v && v.yNa !== undefined && v.yNa !== null && v.pos) blocks.push(v);
    }
    const used = new Set();
    for(const key of keys) {
      if(key.r7a) {
        const hit = blocks.find(b => b.pos.x === key.r7a.x && b.pos.y === key.r7a.y && b.yNa === key.type);
        if(hit) { used.add(hit); continue; }
      }
      const free = blocks.find(b => b.yNa === key.type && !used.has(b));
      if(free) {
        key.r7a = free.pos.clone ? free.pos.clone() : new ${n.coordCtor}(free.pos.x, free.pos.y);
        used.add(free);
      }
    }
  };

  globalThis.ultraEmptyCell = function(boardX, boardY, appleX, appleY) {
    boardX = Math.round(boardX); boardY = Math.round(boardY);
    const game = window.wholeSnakeObject;
    if(!game) return;
    if(appleX === undefined) appleX = boardX;
    if(appleY === undefined) appleY = boardY;
    ultraRemoveAppleAt(appleX, appleY);
    if(typeof window.checkWall === 'function' && window.checkWall(boardX, boardY) && ${n.delWall}) {
      ${n.delWall}(game.${n.wallContainer}, new ${n.coordCtor}(boardX, boardY));
    }
    if(game.${n.sokoContainer} && game.${n.sokoContainer}.${n.sokoBoxSet}) {
      const boxes = game.${n.sokoContainer}.${n.sokoBoxSet};
      for(const b of Array.from(boxes)) {
        const p = b.pos || b;
        if(p && Math.round(p.x) === boardX && Math.round(p.y) === boardY) boxes.delete(b);
      }
    }
    if(game.${n.sokoContainer} && game.${n.sokoContainer}.${n.sokoGoalSet}) {
      const goals = game.${n.sokoContainer}.${n.sokoGoalSet};
      for(const g of Array.from(goals)) {
        const p = g.pos || g;
        if(p && Math.round(p.x) === boardX && Math.round(p.y) === boardY) goals.delete(g);
      }
    }
    if(ultraArrowManager && ultraArrowManager()) {
      const grid = ultraArrowManager().ka;
      if(grid && grid[boardY] && grid[boardY][boardX]) {
        grid[boardY][boardX].direction = 'NONE';
        grid[boardY][boardX].wm = false;
      }
    }
    if(game.${n.bridgeContainer} && game.${n.bridgeContainer}.oa && game.${n.bridgeContainer}.oa[boardY]) {
      game.${n.bridgeContainer}.oa[boardY][boardX] = null;
    }
    if(ultraMineManager && ultraMineManager()) {
      const mines = ultraMineManager().oa;
      for(const m of Array.from(mines)) {
        if(m.pos && m.pos.x === boardX && m.pos.y === boardY) mines.delete(m);
      }
    }
    if(ultraStatueManager && ultraStatueManager()) {
      const ya = ultraStatueManager();
      const key = ${n.serialCoord} ? ${n.serialCoord}(new ${n.coordCtor}(boardX, boardY)) : (boardX << 16 | boardY);
      const st = ya.oa && ya.oa.get(key);
      if(st) {
        if(${n.delWall}) ${n.delWall}(game.${n.wallContainer}, new ${n.coordCtor}(boardX, boardY));
        ya.oa.delete(key);
      }
    }
    if(game.${n.keyContainer} && game.${n.keyContainer}.keys) {
      game.${n.keyContainer}.keys = game.${n.keyContainer}.keys.filter(k => !(k.pos && k.pos.x === boardX && k.pos.y === boardY));
    }
    if(game.${n.gateContainer} && game.${n.gateContainer}.pfa) {
      const qa = game.${n.gateContainer};
      const keep = [];
      for(const g of qa.pfa) {
        const ox = g.Upa && g.Upa.x, oy = g.Upa && g.Upa.y;
        if(ox <= boardX && boardX <= ox+1 && oy <= boardY && boardY <= oy+1) {
          for(let gy=oy; gy<=oy+1; gy++) for(let gx=ox; gx<=ox+1; gx++) {
            if(qa.ka[gy] && qa.ka[gy][gx]) {
              qa.ka[gy][gx].B7 && qa.ka[gy][gx].B7.clear();
              qa.ka[gy][gx].pfa && qa.ka[gy][gx].pfa.clear();
            }
          }
        } else keep.push(g);
      }
      qa.pfa = keep;
    }
  };

  globalThis.placeSokogoal = function(x,y) {
    window.ensureGameMode(9);
    x = Math.round(x); y = Math.round(y);
    const soko = window.wholeSnakeObject && window.wholeSnakeObject.${n.sokoContainer};
    if(!soko) return;
    const coord = new ${n.coordCtor}(x,y);
    const set = soko.${n.sokoGoalSet};
    const have = set && typeof set.size === 'number' ? set.size : 0;
    if(typeof ${n.addGoal} === 'function') ${n.addGoal}(soko, coord, have + 1);
    if(set && set.size === have && typeof set.add === 'function') set.add(coord);
  };
  globalThis.placeArrow = function(x,y,dir) {
    window.ensureGameMode(16);
    x = Math.round(x); y = Math.round(y);
    if(window.ultraPlaceCodec && dir) dir = window.ultraPlaceCodec.dirFromLetter(dir) || dir;
    dir = dir || 'UP';
    const arrows = ultraArrowManager();
    if(!arrows || !arrows.ka || !arrows.ka[y] || !arrows.ka[y][x]) return;
    if(typeof ${n.addArrow} === 'function') ${n.addArrow}(arrows, dir, new ${n.coordCtor}(x,y));
    const cell = arrows.ka[y][x];
    cell.direction = dir;
    cell.wm = false;
    cell.Lh = true;
    if(!cell.color) cell.color = '#4E7CF6';
  };
  globalThis.placeGate = function(x,y,vertical) {
    window.ensureGameMode(19);
    x = Math.round(x); y = Math.round(y);
    const size = ultraBoardSize();
    if(x+1 >= size.width || y+1 >= size.height || x < 0 || y < 0) return;
    const qa = window.wholeSnakeObject.${n.gateContainer};
    ${n.addGate}(qa, new ${n.coordCtor}(x,y), !!vertical, false);
    // Native addGate always sets wm:true (spawn-in). Show the gate while paused.
    if(qa && Array.isArray(qa.pfa)) {
      for(let i = qa.pfa.length - 1; i >= 0; i--) {
        const g = qa.pfa[i];
        if(g && g.Upa && g.Upa.x === x && g.Upa.y === y) {
          g.wm = false;
          break;
        }
      }
    }
  };
  globalThis.placeBridge = function(x,y) {
    window.ensureGameMode(20);
    x = Math.round(x); y = Math.round(y);
    const ga = window.wholeSnakeObject.${n.bridgeContainer};
    if(!ga || !ga.oa[y]) return;
    const col = ${n.bridgeColor} ? ${n.bridgeColor}(ga, false) : '#e68f1b';
    // wm:false so the tile is full-size while the board is paused.
    ga.oa[y][x] = {wm:false, color:col, Lh:!${n.modeCheck}(window.wholeSnakeObject.settings, 11)};
  };
  globalThis.placeMine = function(x,y) {
    window.ensureGameMode(12);
    x = Math.round(x); y = Math.round(y);
    const game = window.wholeSnakeObject;
    const ma = ultraMineManager();
    if(!game || !ma) return;
    if(!(ma.oa instanceof Set)) ma.oa = new Set();
    for(const m of Array.from(ma.oa)) {
      if(m && m.pos && m.pos.x === x && m.pos.y === y) ma.oa.delete(m);
    }
    // xL:2 so the flag is visible while the board is paused.
    ma.oa.add({
      pos: new ${n.coordCtor}(x,y),
      X1a: -1,
      xL: 2,
      Lh: !${n.modeCheck}(game.settings, 11)
    });
  };
  globalThis.placeStatue = function(x,y,cracked) {
    window.ensureGameMode(13);
    x = Math.round(x); y = Math.round(y);
    const game = window.wholeSnakeObject;
    const st = ultraStatueManager();
    if(!game || !st) return;
    if(!(st.oa instanceof Map)) st.oa = new Map();
    const coord = new ${n.coordCtor}(x,y);
    const obj = {
      pos: coord,
      wm: false,
      m0: false,
      Lh: true,
      WQ: {
        pdb: (typeof window.ultraPlaceStatueIsCracked === 'function')
          ? window.ultraPlaceStatueIsCracked(cracked)
          : (cracked === true || cracked === 1 || cracked === '1'),
        O0b: 0,
        xBb: -1,
        color: '#90A4AE',
        type: 1,
        angle: 0,
        tBc: 0,
        sBc: 0
      }
    };
    if(typeof ${n.addStatue} === 'function') ${n.addStatue}(st, coord, obj);
    else {
      const key = ${n.serialCoord} ? ${n.serialCoord}(coord) : (x << 16 | y);
      st.oa.set(key, obj);
      if(typeof ${n.addWall} === 'function') ${n.addWall}(game.${n.wallContainer}, coord, obj);
    }
  };
  globalThis.placeKey = function(x,y,type) {
    window.ensureGameMode(8);
    x = Math.round(x); y = Math.round(y);
    type = Math.max(0, Math.min(23, type|0));
    const coord = new ${n.coordCtor}(x,y);
    window.wholeSnakeObject.${n.keyContainer}.keys.push({pos:coord, r7a:coord.clone ? coord.clone() : new ${n.coordCtor}(x,y), xL:0, type:type, wm:false, Lh:true});
    ultraPairKeysAndBlocks();
  };
  globalThis.placeKeyblock = function(x,y,type) {
    window.ensureGameMode(8);
    x = Math.round(x); y = Math.round(y);
    type = Math.max(0, Math.min(23, type|0));
    const coord = new ${n.coordCtor}(x,y);
    ${n.addWall}(window.wholeSnakeObject.${n.wallContainer}, coord, {pos:coord, wm:false, yNa:type, m0:false, Lh:!${n.modeCheck}(window.wholeSnakeObject.settings, 11)});
    ultraPairKeysAndBlocks();
  };
  globalThis.placePoison = function(x,y,type) {
    window.ensureGameMode(10);
    if(!(type >= 0)) type = window.ultraPlaceFruitType || 0;
    window.placeApple(x,y,type, undefined, {Oka:true});
  };
  globalThis.placeShield = function(x,y,dir,opts) {
    window.ensureGameMode(15);
    if(window.ultraPlaceCodec && dir) dir = window.ultraPlaceCodec.dirFromLetter(dir) || dir;
    dir = dir || 'UP';
    const addOnly = !!(opts && opts.add);
    const field = window.chess_shield_field || 'nba';
    let apple = ultraFindAppleAt(x,y);
    const created = !apple;
    if(!apple) {
      const dirs = new Set();
      const props = {nba: dirs, wm: false};
      props[field] = dirs;
      window.placeApple(x,y, window.ultraPlaceFruitType || 0, undefined, props);
      apple = ultraFindAppleAt(x,y) || ultraAppleList().slice(-1)[0];
    }
    if(!apple) return;
    apple.wm = false;
    const next = new Set();
    const cur = apple[field] || apple.nba;
    if(cur && typeof cur.forEach === 'function') cur.forEach(function(d){ next.add(d); });
    apple[field] = next;
    apple.nba = next;
    if(!addOnly && !created && next.has(dir)) next.delete(dir);
    else next.add(dir);
  };
  globalThis.placeChessPiece = function(x,y,color,piece,type) {
    window.ultraEnsureChessMode();
    if(typeof window.injectChessFruits === 'function') window.injectChessFruits();
    if((!color || !piece) && window.mousePlaceMode && window.mousePlaceMode.extra) {
      color = color || String(window.mousePlaceMode.extra).charAt(0);
      piece = piece || String(window.mousePlaceMode.extra).slice(1);
    }
    if(!(type >= 0) && color && piece && window[color + piece] != null) type = window[color + piece];
    if(!(type >= 0)) return;
    window.placeApple(x,y,type, undefined, {isPiece:true, ChessPiece:piece, ChessColor:color});
  };
  `
  );

  return code;
};

window.ultraWrapBlitAndClick = function () {
  if (typeof window.blitPattern === "function" && !window.blitPattern.__ultraPlace) {
    window.blitPattern = function (pixelList, offsetX, offsetY) {
      offsetX = offsetX || 0;
      offsetY = offsetY || 0;
      window.ultraCaptureAppleOffsetFromBoard();
      customSnakeStart.isActive = false;
      if (typeof emptyApples === "function") emptyApples();
      if (typeof emptySokoboxes === "function") emptySokoboxes();
      if (typeof emptySokogoals === "function") emptySokogoals();
      if (typeof window.ultraEmptyExtraObjects === "function") window.ultraEmptyExtraObjects();
      for (let i = 0; i < pixelList.length; i++) {
        const p = pixelList[i];
        const ax = p.x + offsetX;
        const ay = p.y + offsetY;
        switch (p.category) {
          case "apple":
            if (p.type != -1) {
              let initialSpeed = undefined;
              if (disableAppleInitialSpeed) initialSpeed = { x: 0, y: 0 };
              window.placeApple(ax, ay, p.type, initialSpeed);
            }
            break;
          case "wall":
            window.placeWall(p.x, p.y, true);
            break;
          case "box":
            window.placeSokobox(p.x, p.y);
            break;
          case "snakehead":
          case "erase":
            break;
          case "goal":
            if (typeof window.placeSokogoal === "function") window.placeSokogoal(p.x, p.y);
            break;
          case "bridge":
            if (typeof window.placeBridge === "function") window.placeBridge(p.x, p.y);
            break;
          case "gate":
            if (typeof window.placeGate === "function") window.placeGate(p.x, p.y, p.extra === "v");
            break;
          case "poison":
            if (typeof window.placePoison === "function") window.placePoison(ax, ay, p.type);
            break;
          case "arrow":
            if (typeof window.placeArrow === "function") window.placeArrow(p.x, p.y, p.extra || "UP");
            break;
          case "shield":
            break;
          case "mine":
            if (typeof window.placeMine === "function") window.placeMine(p.x, p.y);
            break;
          case "statue":
            if (typeof window.placeStatue === "function") {
              window.placeStatue(
                p.x,
                p.y,
                window.ultraPlaceStatueIsCracked ? window.ultraPlaceStatueIsCracked(p.extra, p.type) : p.extra === 1 || p.type === 1
              );
            }
            break;
          case "key":
            if (typeof window.placeKey === "function") window.placeKey(p.x, p.y, p.type);
            break;
          case "keyblock":
            if (typeof window.placeKeyblock === "function") window.placeKeyblock(p.x, p.y, p.type);
            break;
          case "chess":
            if (typeof window.placeChessPiece === "function") {
              window.placeChessPiece(ax, ay, p.ChessColor, p.ChessPiece, p.type);
            }
            break;
          default:
            throw Error("Unrecognised category!");
        }
      }
      if (typeof window.placeShield === "function") {
        for (let s = 0; s < pixelList.length; s++) {
          const p = pixelList[s];
          if (!p || p.category !== "shield") continue;
          const ax = p.x + offsetX;
          const ay = p.y + offsetY;
          const packed = window.ultraPlaceCodec
            ? window.ultraPlaceCodec.dirsFromCode(p.extra)
            : p.extra
            ? [p.extra]
            : ["UP"];
          const dirs = packed.length ? packed : [p.extra || "UP"];
          for (let d = 0; d < dirs.length; d++) {
            window.placeShield(ax, ay, dirs[d], { add: true });
          }
        }
      }
      if (typeof window.ultraPairKeysAndBlocks === "function") window.ultraPairKeysAndBlocks();
      if (typeof window.retallyAllPlacedApples === "function") window.retallyAllPlacedApples();
    };
    window.blitPattern.__ultraPlace = true;
  }

  if (typeof window.placeAppleAtMouse === "function" && !window.placeAppleAtMouse.__ultraPlace) {
    const origClick = window.placeAppleAtMouse;
    window.placeAppleAtMouse = function (event) {
      const mode = window.mousePlaceMode || {};
      const canvasEl =
        window.gameCanvasElMakePattern ||
        document.getElementsByClassName("cer0Bd")[0];
      if (canvasEl && !window.gameCanvasElMakePattern) window.gameCanvasElMakePattern = canvasEl;
      if (!canvasEl || !window.wholeSnakeObject || !window.tileWidth) {
        return origClick(event);
      }
      const canvasRect = canvasEl.getBoundingClientRect();
      const calculatedTileWidth = eval("window.wholeSnakeObject." + window.tileWidth);
      const scaleX = canvasEl.width / canvasRect.width;
      const scaleY = canvasEl.height / canvasRect.height;
      const offsetX = globalThis.leftBorderWidth || 0;
      const offsetY = globalThis.topBorderWidth || 0;
      const mouseX = (event.clientX - canvasRect.left) * scaleX - offsetX - calculatedTileWidth / 2;
      const mouseY = (event.clientY - canvasRect.top) * scaleY - offsetY - calculatedTileWidth / 2;
      let gameCoordX = mouseX / calculatedTileWidth;
      let gameCoordY = mouseY / calculatedTileWidth;
      const boardX = Math.round(gameCoordX);
      const boardY = Math.round(gameCoordY);
      const spawnOffset =
        typeof window.getAppleSpawnPointOffset === "function"
          ? window.getAppleSpawnPointOffset()
          : { x: 0, y: 0 };
      const appleX = boardX + spawnOffset.x;
      const appleY = boardY + spawnOffset.y;

      try {
        if (mode.category === "erase") {
          if (typeof window.ultraEmptyCell === "function") window.ultraEmptyCell(boardX, boardY, appleX, appleY);
          return;
        }

        if (mode.category === "shield") {
          window.placeShield(appleX, appleY, mode.extra || "UP");
          return;
        }

        if (typeof window.ultraEmptyCell === "function") window.ultraEmptyCell(boardX, boardY, appleX, appleY);

        switch (mode.category) {
          case "apple":
            window.placeApple(appleX, appleY, mode.type);
            break;
          case "wall":
            window.placeWall(gameCoordX, gameCoordY, true);
            break;
          case "box":
            window.placeSokobox(gameCoordX, gameCoordY);
            break;
          case "goal":
            window.placeSokogoal(boardX, boardY);
            break;
          case "bridge":
            window.placeBridge(boardX, boardY);
            break;
          case "gate":
            window.placeGate(boardX, boardY, mode.extra === "v");
            break;
          case "poison":
            window.placePoison(appleX, appleY, window.ultraPlaceFruitType || 0);
            break;
          case "arrow":
            window.placeArrow(boardX, boardY, mode.extra || "UP");
            break;
          case "mine":
            window.placeMine(boardX, boardY);
            break;
          case "statue":
            window.placeStatue(
              boardX,
              boardY,
              window.ultraPlaceStatueIsCracked
                ? window.ultraPlaceStatueIsCracked(mode.extra, mode.type)
                : mode.extra === 1 || mode.type === 1
            );
            break;
          case "key":
            window.placeKey(boardX, boardY, mode.type);
            break;
          case "keyblock":
            window.placeKeyblock(boardX, boardY, mode.type);
            break;
          case "chess": {
            let color = mode.ChessColor;
            let piece = mode.ChessPiece;
            if ((!color || !piece) && mode.extra) {
              color = String(mode.extra).charAt(0);
              piece = String(mode.extra).slice(1);
            }
            window.placeChessPiece(appleX, appleY, color, piece, mode.type);
            break;
          }
          default:
            origClick(event);
        }
      } catch (err) {
        console.error("RemixUltra: board place failed", mode && mode.category, err);
      }
    };
    window.placeAppleAtMouse.__ultraPlace = true;
    const canvas =
      window.gameCanvasElMakePattern ||
      document.getElementsByClassName("cer0Bd")[0];
    if (canvas) {
      window.gameCanvasElMakePattern = canvas;
      canvas.removeEventListener("mousedown", origClick);
      canvas.removeEventListener("mousedown", window.placeAppleAtMouse);
      canvas.addEventListener("mousedown", window.placeAppleAtMouse);
    }
  }
};

window.UltraPlace.runCodeAfter = function () {
  window.ultraInstallPlaceUi();
  window.ultraInstallCustomPicker();
  window.ultraInstallCustomSizes();
  window.ultraWrapCustomManager();
  window.ultraWrapAppleOffset();
  window.ultraWrapBlitAndClick();
};
