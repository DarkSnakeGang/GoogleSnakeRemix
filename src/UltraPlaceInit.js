window.UltraPlace = window.UltraPlace || {};

window.FNBX = window.FNBX || "https://www.google.com/logos/fnbx/";
window.ultraPlaceFruitType = 0;
window.disableMineMode = true;
window.disableGateMode = true;
window.disableBridgeMode = true;
window.disableStatueBodyPlant = true;
window.disableKeyResetPlant = false;

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
  {
    id: "custom",
    label: "Custom",
    get w() {
      return window.remixCustomBoardSize
        ? window.remixCustomBoardSize().width
        : 17;
    },
    get h() {
      return window.remixCustomBoardSize
        ? window.remixCustomBoardSize().height
        : 15;
    },
    get idx() {
      return typeof window.CUSTOM_SIZE_INDEX === "number"
        ? window.CUSTOM_SIZE_INDEX
        : 11;
    },
  },
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
  { color: "b", piece: "bishop", key: "bbishop", url: "data:image/png;base64,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" },
  { color: "b", piece: "king", key: "bking", url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAADAFBMVEX///8WFhaSkpKBfn5hXl5ZVVRRTk00MzN5dnYnKChJRkZBPz9xbm4fICCJiYlWU1JqZ2g9OztEQkJ+fn0wLy9bWFdMS0ocHBx1c3NkY2JTUE+AgIAoJyc4NjaJh4ZpZWVKSEcoKCcwMC+DgH8kJCRcW1sqKip6eHdiYF8nJygfHyBCQD9ta2sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAADJzWDF0HUAdckAAAAAAAAAAQBRAAB3d4QZ9IgAAAAwAAAAAAAAAAAAAACoAAB3d4QAAAAAAAAAAAAAAAAAAADGdAAAdckAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAB3fHtOKLAAAAQAAMkAAAAAAAAAAAAAAAAAAAAAAAAAAABkAAAAAAAAAAD8SAATBE0AAAAAAAAADgCYABMETh9OKLD8OAQABE0AyQAAAAD0xABWABl3eDx5q7kAAHcAAAAAAAAAAAAAAAAAAAAAAADHzFuQLi1odbsAGfW7kIkAt3UAAAAAAAAAAACQ/sBgdbsAAAAAAAUAgACAAADAEAAAAAAKqAAAAAAAAAAAAAMAAABqAAAAbABOKLD1gAQAABkAAAAAAAAosAAABE4AAAAgZmYAADgAAAAAAAAAAAAAAAAYAAAAAAAAAAD1CABAABkAAAAAAAD1WAAzABk2NgA2NjYADDZbYDbCAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAALiMAAC4jAXilP3YAAAYNSURBVHja7Vttd6MoFG5OFay6y0AyoDaZdLrIzO76/3/fXtQkKlhRqTl7mudD54QY7sPlct9wnp4eeOCBBx5YCLoTXew2J8CkkjcosT0BIRW+QMp7EFD5n68/avxSdyFwzPd5g/A+BF7yPUEFABF1py3YkwZ30QAV8r4E4Ox1CUi5lWABh76G7G1BO7YBESBw8X7BhQC5Dm1CAJft6dv/ClsNNJ9/51x8PgEp2evr81+A531V1PKL6vVZjzz/CITaQAPJPid9hJd/mdxCA0CgIFZsReA5J1+cwP6uBMSXtwHQQEWQPv092foTItsQuGZi/CqetSOHbWLBBehK4NTJT7cjgMObBm7yt0oMNIGbBaAN84GbIljHBj83JbJtL4Q93iGA+wQ82gPkGNcKCPKeaxEGw91TmEjVPK8LNtX9iVijGil0lvWPzsKwOl6rMD2nlKcuAV4vt8P2mqEpJXZqmXgl5AuYGkNBnlcBBH3GaD0pLEv2TYCgv3Wm1kg8UcZirhGzBDfPLz1viuVZlkV5WYY1CEKc4WaNvOcJm0F1Ylx7h7AFeEjEDvXmzV6+no5nUZTlhttFDMOMqDeWaA/JkDVE8Pf5/kEvn6b7KM2JNfIhSvthKFb/IjIKOpfBDhSgl5+TsVnDIaMiJB/gDc9qIcCGqiCLqt+IeEJYzGIgdNWTpd+9ydcqmsEAjJZEWRoSr4idC0h5lCzzLp8UVLkSkDiNsu/EN7g2LTcPQPZZTvwToG4uUchTllX+5Wv/5aICWSug/AQChCUuKoAjWEXfPkM+iROXhiKk3VFWmv43DK0ecM5zPGHTvgC8dhjZLIAzCnk3ZfxDDiE8Bs9RGltCSOGyBxAFKgsBbcFtpoHpuNuPr48dcWKxwuQw6QrABCw7EDfztim5oiNmTrv9a0ktGqBS7aYIUNMJ8lv7qy0JRn1t+5iwMSgYSyatUMg4qoZB6CSPopsp6lzF9LS1inrnObZpYJIANwjwIW1l6qAujOXgIWohMK0BZBCAubERLtBkZT7I3OstcNGASYAarO0EBm4WkmQ0PAXT59BGIFlMgA+3wMUIuUUDQ+26EjA8oYsNUINAbGycEwHDUuPEyQZUNiQACeVRzCYACmBDE9AaUJOuOBgSCOPhHjgQEMehAmAHHGIBBEySWQuLeQR0icyHBBxssG7HV2Y++N7/5TSBYfWqw2nCXFJz+GV5NgqCQvUYTBKAWZJBRHlLEuaUFMI5qMyKhPcYTBGADaBGNpLUdbVTQ4ZbMiKuOuqbIADysSm/doPYqS54L0airXAiMCKfOdYFT7Zc4hJuhAOBMfn06Nq10hZkyziSK4OPCAijedHoP5lxuWjmEo0QesuLRgmAA7I5AC3fvT43W0AdBrL+2poPNN9Z5DN9AudcqIG2DtbmAL42iu0ELPLfavl0ZtvSspGXnmzTfzRSsviSETPb+rX8eY0y/QNkLXEZgMfmDvE3/Q2N/cgfZ0AuHcCR8dCT/LpRo9Y2idbI98Fgnfz1DG7y8dMyjNqBE67nTy1/zWqsDJy3/lU3BvbA5Cx/lgP2yqBdv1r/lpnp25zlJz7k1xcHcbhAfhOAPFym4Q8MMbS7xVa+Uc8svyKkvZsChOIWlFFtae0nhJD2xKEugRYEwIn8BPG3hJ0wVl10r8gu0JfYVKdgh6UO0MZA4WO3/3R5aak/cBs5alL+rnPbWf8Q8ggrfNcr1GAd1AO6kfheCxY+b9J3jWzdo+RlmefnKk33dqRpdc7zkHDOTqpWyA6vPgOQGwnFw7LKIi0jAmTj0F/rx7IqIAjycCV3a0/ACxzCKgPJ2SwAjyg9s7Xv2+oclMNszZRzxLd/88M6BrCNpNF5CjiXQRCUQViMesBAPxGUZ/10syEpXnMY6+vLtKrysNSvr864oCoQKcvyXFVRtebdBiFVEIDnKxamBKgA4+XLEyIGh4+szEsLhH4uVsGySGyppsTiHfjp4/I2WUFAebksk4ItJYB9EOCL02JvBJbugT8NfHEC6N4EyBoCyAPYCgLqsBrqIFecAl9YSkB5kn+H/4X0wAMPPPDA/wj/AaDW/ygF9oIkAAAAAElFTkSuQmCC" },
  { color: "b", piece: "knight", key: "bknight", url: "data:image/png;base64,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" },
  { color: "b", piece: "pawn", key: "bpawn", url: "data:image/png;base64,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" },
  { color: "b", piece: "queen", key: "bqueen", url: "data:image/png;base64,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" },
  { color: "b", piece: "rook", key: "brook", url: "data:image/png;base64,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" },
  { color: "w", piece: "bishop", key: "wbishop", url: "data:image/png;base64,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" },
  { color: "w", piece: "king", key: "wking", url: "data:image/png;base64,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" },
  { color: "w", piece: "knight", key: "wknight", url: "data:image/png;base64,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" },
  { color: "w", piece: "pawn", key: "wpawn", url: "data:image/png;base64,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" },
  { color: "w", piece: "queen", key: "wqueen", url: "data:image/png;base64,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" },
  { color: "w", piece: "rook", key: "wrook", url: "data:image/png;base64,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" },
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

window.ultraChessSnakeIsPiece = function () {
  const s = window.head_state;
  return !!(s && s !== "OPEN" && s !== "NONE");
};

window.ultraEnsureChessMode = function () {
  if (window.CHESS_MODE == null) return;
  if (typeof window.ensureGameMode === "function") window.ensureGameMode(window.CHESS_MODE);
  try {
    const settings = window.wholeSnakeObject && window.wholeSnakeObject.settings;
    const chessId = window.CHESS_MODE;
    if (!settings) {
      window.CurrentModeNum = chessId;
      return;
    }
    const blended =
      settings.ub === 22 ||
      !!(settings.Qa && settings.Lc && typeof settings.Lc.has === "function" && settings.Lc.has(chessId));
    if (blended) {
      window.CurrentModeNum = 22;
      window.chess_blending = true;
      if (typeof window.correct_chess_selection === "function") window.correct_chess_selection();
    } else {
      window.CurrentModeNum = chessId;
    }
  } catch (_e) {
    window.CurrentModeNum = window.CHESS_MODE;
  }
};

window.ultraSyncChessPlaceState = function () {
  try {
    const mgr = typeof window.ultraAppleManager === "function" ? window.ultraAppleManager() : null;
    const apples =
      (mgr && mgr.ka) ||
      (window.wholeSnakeObject && window.wholeSnakeObject.wa && window.wholeSnakeObject.wa.ka) ||
      window.appleArray;
    if (apples) window.appleArray = apples;
    const game = window.__remixGame || window.megaWholeSnakeObject || window.wholeSnakeObject;
    if (game && game.oa) {
      if (game.oa.ka) window.head_pos = game.oa.ka;
      if (game.oa.direction) window.head_dir = game.oa.direction;
    }
  } catch (_e) {}
  const apples = window.appleArray;
  if (!apples || !apples.length) return;
  const field = window.chess_shield_field || "nba";
  const locked = window.ultraChessSnakeIsPiece();
  for (let i = 0; i < apples.length; i++) {
    const a = apples[i];
    if (!a || !a.isPiece) continue;
    if (locked) {
      const dirs = new Set(["UP", "DOWN", "LEFT", "RIGHT"]);
      a[field] = dirs;
      a.nba = dirs;
    } else {
      a[field] = undefined;
      a.nba = undefined;
    }
  }
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
  if (addArrow) {
    const arrowStem = addArrow + "=function(a,b,c){var d=a.ka[c.y][c.x];d.direction=b";
    if (code.indexOf(arrowStem) >= 0) {
      code = code.replace(
        arrowStem,
        addArrow +
          "=function(a,b,c){if(window.ultraBlockNativeArrowTurns&&window.ultraBlockNativeArrowTurns()&&!window.__ultraPaintArrowFromPlace)return;var d=a.ka[c.y][c.x];d.direction=b"
      );
    }
  }
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
  // Pudding rewrites theme checks to `wa==10||window.isRainbow` (also == not ===).
  const bridgeColor = window.ultraPlaceCapture(
    code,
    /([$a-zA-Z0-9_]{1,8})\s*=\s*function\s*\(\s*a\s*,\s*b\s*\)\s*\{\s*return\s+[$a-zA-Z0-9_]{1,8}\s*\[\s*a\.settings\.wa\s*={2,3}\s*10(?:\s*\|\|\s*window\.isRainbow)?/,
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
    window.__ultraPaintArrowFromPlace = true;
    try {
      if(typeof ${n.addArrow} === 'function') ${n.addArrow}(arrows, dir, new ${n.coordCtor}(x,y));
    } finally {
      window.__ultraPaintArrowFromPlace = false;
    }
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
    apple.__ultraKeepShield = true;
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
    if(typeof window.ultraSyncChessPlaceState === "function") window.ultraSyncChessPlaceState();
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
