import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ULTRA = path.join(ROOT, "RemixUltraMod.js");
const PLACE_SRC = path.join(ROOT, "src", "UltraPlaceInit.js");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

function fromVm(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadCodec() {
  const src = fs.readFileSync(PLACE_SRC, "utf8");
  const start = src.indexOf("/* ULTRA_PLACE_CODEC_START */");
  const end = src.indexOf("/* ULTRA_PLACE_CODEC_END */");
  assert.ok(start >= 0 && end > start, "codec markers missing");
  const slice = src.slice(start, end);
  const sandbox = { window: {} };
  vm.runInNewContext(slice, sandbox);
  const codec = sandbox.window.ultraPlaceCodec;
  return {
    sizes: fromVm(codec.sizes),
    appleOffsetForSize: function (w, h) {
      return fromVm(codec.appleOffsetForSize(w, h));
    },
    sizeById: function (id) {
      return fromVm(codec.sizeById(id));
    },
    parseEntity: function (token) {
      return fromVm(codec.parseEntity(token));
    },
    parseLevel: function (code) {
      return fromVm(codec.parseLevel(code));
    },
    exportLevel: function (w, h, list) {
      return codec.exportLevel(w, h, list);
    },
    statueIsCracked: function (extra, type) {
      return codec.statueIsCracked(extra, type);
    },
  };
}

describe("Ultra Place export / sizes", () => {
  it("round-trips old A/W/B/S codes and parses apple types", () => {
    const codec = loadCodec();
    const old = "17x15 A11,7 W3,4 B5,5 S4,1";
    const parsed = codec.parseLevel(old);
    assert.deepEqual(parsed, [
      { x: 11, y: 7, category: "apple", type: 0 },
      { x: 3, y: 4, category: "wall", type: -1 },
      { x: 5, y: 5, category: "box", type: -1 },
      { x: 4, y: 1, category: "snakehead", type: -1 },
    ]);
    const exported = codec.exportLevel(17, 15, parsed);
    assert.match(exported, /^17x15 /);
    assert.match(exported, /A11,7,0/);
    assert.match(exported, /W3,4/);
    assert.match(exported, /B5,5/);
    assert.match(exported, /S4,1/);
    const rich = codec.parseEntity("A11,7,24");
    assert.deepEqual(rich, { x: 11, y: 7, category: "apple", type: 24 });
  });

  it("parses new object letters and skips unknown ones", () => {
    const codec = loadCodec();
    const code = "10x9 Y1,1 C2,2 E3,3,h E4,4,v P5,5 P6,6,3 V7,1,U H5,5,R N0,0 T1,2,1 F2,3,bB K0,1,2 L0,2,2 Z9,9";
    const parsed = codec.parseLevel(code);
    const cats = parsed.map((e) => e.category);
    assert.deepEqual(cats, [
      "goal",
      "bridge",
      "gate",
      "gate",
      "poison",
      "poison",
      "arrow",
      "shield",
      "mine",
      "statue",
      "chess",
      "key",
      "keyblock",
    ]);
    assert.equal(parsed.find((e) => e.category === "gate" && e.x === 3).extra, "h");
    assert.equal(parsed.find((e) => e.category === "gate" && e.x === 4).extra, "v");
    assert.equal(parsed.find((e) => e.category === "poison" && e.x === 6).type, 3);
    assert.equal(parsed.find((e) => e.category === "chess").ChessPiece, "bishop");
    assert.equal(parsed.find((e) => e.category === "chess").ChessColor, "b");
    assert.equal(parsed.find((e) => e.category === "key").type, 2);
    const intact = codec.parseEntity("T4,5,0");
    assert.equal(intact.category, "statue");
    assert.equal(intact.extra, 0);
    assert.equal(intact.type, 0);
    const crackedTok = codec.parseEntity("T4,5,1");
    assert.equal(crackedTok.extra, 1);
    assert.match(
      codec.exportLevel(10, 9, [{ x: 4, y: 5, category: "statue", type: 0, extra: "0" }]),
      /T4,5,0/
    );
    assert.doesNotMatch(
      codec.exportLevel(10, 9, [{ x: 4, y: 5, category: "statue", type: 0, extra: "0" }]),
      /T4,5,1/
    );
    assert.match(
      codec.exportLevel(10, 9, [{ x: 4, y: 5, category: "statue", type: 1, extra: 1 }]),
      /T4,5,1/
    );
    assert.equal(codec.statueIsCracked("0", 0), false);
    assert.equal(codec.statueIsCracked(0, 0), false);
    assert.equal(codec.statueIsCracked(false, 0), false);
    assert.equal(codec.statueIsCracked(1, 0), true);
    assert.equal(codec.statueIsCracked("1", 0), true);
    assert.equal(codec.statueIsCracked(true, 0), true);
    const keyMax = codec.parseEntity("K0,1,23");
    assert.equal(keyMax.type, 23);
    const keyClamp = codec.parseEntity("K0,1,99");
    assert.equal(keyClamp.type, 23);
    assert.ok(!parsed.some((e) => e.x === 9 && e.y === 9));
  });

  it("packs several shield sides on one fruit", () => {
    const codec = loadCodec();
    const fromPacked = codec.parseLevel("10x9 A1,1,0 H1,1,UL");
    const shields = fromPacked.filter((e) => e.category === "shield");
    assert.equal(shields.length, 2, JSON.stringify(fromPacked));
    assert.deepEqual(
      shields.map((e) => e.extra).sort(),
      ["LEFT", "UP"]
    );
    const fromWords = codec.parseEntity("H2,2,UP");
    assert.equal(fromWords.extra, "UP");
    const exported = codec.exportLevel(10, 9, fromPacked);
    assert.match(exported, /A1,1,0/);
    assert.match(exported, /H1,1,UL/);
    assert.doesNotMatch(exported, /H1,1,U H1,1,L/);
    const roundTrip = codec.parseLevel(exported).filter((e) => e.category === "shield");
    assert.equal(roundTrip.length, 2);
  });

  it("has the MoreMenu size table including Micro, Enormous, and Custom", () => {
    const codec = loadCodec();
    assert.equal(codec.sizes.length, 12);
    assert.deepEqual(codec.sizeById("micro"), {
      id: "micro",
      label: "Micro",
      w: 5,
      h: 4,
      idx: 3,
    });
    assert.equal(codec.sizeById("enormous").w, 600);
    const custom = codec.sizeById("custom");
    assert.equal(custom.id, "custom");
    assert.equal(custom.label, "Custom");
    assert.equal(custom.idx, 11);
    assert.equal(custom.w, 17);
    assert.equal(custom.h, 15);
    assert.deepEqual(codec.appleOffsetForSize(17, 15), { x: -12, y: -7 });
    assert.deepEqual(codec.appleOffsetForSize(5, 4), { x: -3, y: -2 });
    assert.deepEqual(codec.appleOffsetForSize(600, 530), { x: -450, y: -265 });
  });

  it("Ultra bundle includes Place-tab HTML builders", () => {
    assert.equal(fs.existsSync(ULTRA), true, "run python RemixBuilder.py");
    const ultra = fs.readFileSync(ULTRA, "utf8");
    assert.match(ultra, /window\.UltraPlace/);
    assert.match(ultra, /ultraPlaceBuildGridHtml/);
    assert.match(ultra, /trophy_19\.png/);
    assert.match(ultra, /trophy_20\.png/);
    assert.match(ultra, /ultraPlacePoisonSrc/);
    assert.match(ultra, /ultra-place-overlay/);
    assert.match(ultra, /Original Fruit/);
    assert.match(ultra, /Pudding Fruit/);
    assert.match(ultra, /ultra-place-tab/);
    assert.match(ultra, /Yx,y/);
    assert.match(ultra, /xL: 2/);
    assert.match(ultra, /ultraMineManager/);
    assert.match(ultra, /ultraStatueManager/);
    assert.match(ultra, /ultraArrowManager/);
    assert.match(ultra, /wm: false/);
    assert.match(ultra, /ultraPlaceEraseIcon/);
    assert.match(ultra, /category === "erase"/);
    assert.match(ultra, /ultraSyncChessPlaceState/);
    assert.match(ultra, /window\.CurrentModeNum = chessId/);
    assert.doesNotMatch(fs.readFileSync(path.join(ROOT, "RemixMod.js"), "utf8"), /window\.UltraPlace/);
  });
});

describe("Ultra Place (browser)", { skip: !runBrowser }, () => {
  async function launchUltra(extra = {}) {
    const { launchHarness, ultraHarnessOpts } = await import("../tools/harness.mjs");
    return launchHarness(ultraHarnessOpts(extra));
  }

  it("shows Place inner tabs and Micro in the custom size dropdown", async () => {
    const h = await launchUltra({ seed: 41, headless: true });
    try {
      await h.page.waitForFunction(
        () => !!document.getElementById("ultra-place-tabs"),
        null,
        { timeout: 60000 }
      );
      const probe = await h.page.evaluate(() => {
        const tabs = [...document.querySelectorAll("#ultra-place-tabs .ultra-place-tab")].map(
          (el) => el.textContent.trim()
        );
        const size = document.getElementById("custom-map-size");
        const sizeOpts = size ? [...size.options].map((o) => o.textContent.trim()) : [];
        document.querySelector('#ultra-place-tabs [data-tab="objects"]').click();
        const arrows = [...document.querySelectorAll('#ultra-place-grid .place-option[data-category="arrow"]')].map(
          (el) => el.getAttribute("src") || ""
        );
        const box = document.querySelector('#ultra-place-grid .place-option[data-category="box"]');
        const goal = document.querySelector('#ultra-place-grid .place-option[data-category="goal"]');
        const poison = document.querySelector('#ultra-place-grid .place-option[data-category="poison"]');
        const gates = [...document.querySelectorAll('#ultra-place-grid .place-option[data-category="gate"]')];
        const cracked = document.querySelector(
          '#ultra-place-grid .place-option[data-category="statue"][data-extra="1"]'
        );
        const statue = document.querySelector(
          '#ultra-place-grid .place-option[data-category="statue"][data-extra="0"]'
        );
        const bridge = document.querySelector('#ultra-place-grid .place-option[data-category="bridge"]');
        const erase = document.querySelector('#ultra-place-grid .place-option[data-category="erase"]');
        if (statue) statue.click();
        const statueMode = window.mousePlaceMode
          ? { extra: window.mousePlaceMode.extra, type: window.mousePlaceMode.type }
          : null;
        const statueCs = statue && getComputedStyle(statue);
        const statueSel = statue && {
          on: statue.classList.contains("ultra-place-on"),
          outline: statueCs && statueCs.outlineColor,
          shadow: statueCs && statueCs.boxShadow,
          filter: statueCs && statueCs.filter,
        };
        document.querySelector('#ultra-place-tabs [data-tab="key"]').click();
        const keys = document.querySelectorAll('#ultra-place-grid .place-option[data-category="key"]').length;
        const blocks = document.querySelectorAll('#ultra-place-grid .place-option[data-category="keyblock"]').length;
        document.querySelector('#ultra-place-tabs [data-tab="chess"]').click();
        const chess = document.querySelectorAll('#ultra-place-grid .place-option[data-category="chess"]').length;
        return {
          tabs,
          sizeOpts,
          hasGrid: !!document.getElementById("ultra-place-grid"),
          arrows,
          boxBg: box && box.style.backgroundImage,
          goalBg: goal && goal.style.backgroundImage,
          poisonSrc: poison && (poison.getAttribute("src") || poison.style.backgroundImage),
          gateSrcs: gates.map((el) => el.getAttribute("src") || el.style.backgroundImage),
          bridgeSrc: bridge && (bridge.getAttribute("src") || bridge.style.backgroundImage),
          eraseSrc: erase && (erase.getAttribute("src") || erase.style.backgroundImage),
          crackedOverlay: !!(cracked && cracked.querySelector(".ultra-place-overlay")),
          crackedBg: cracked && cracked.style.backgroundImage,
          statueSel,
          statueMode,
          keys,
          blocks,
          chess,
        };
      });
      assert.deepEqual(probe.tabs, [
        "Original Fruit",
        "Pudding Fruit",
        "Objects",
        "Key",
        "Chess",
      ]);
      assert.ok(probe.hasGrid);
      assert.ok(probe.sizeOpts.includes("Micro"), JSON.stringify(probe.sizeOpts));
      assert.equal(probe.arrows.length, 4, JSON.stringify(probe.arrows));
      assert.ok(
        probe.arrows.every((s) => s.startsWith("data:image/png")),
        JSON.stringify(probe.arrows)
      );
      assert.match(String(probe.boxBg), /box\.png/, JSON.stringify(probe));
      assert.match(String(probe.goalBg), /box\.png/, JSON.stringify(probe));
      assert.match(String(probe.poisonSrc), /trophy_10/, JSON.stringify(probe));
      assert.doesNotMatch(String(probe.poisonSrc), /poison-skull/, JSON.stringify(probe));
      assert.equal(probe.gateSrcs.length, 2, JSON.stringify(probe.gateSrcs));
      assert.ok(
        probe.gateSrcs.every((s) => /trophy_19/.test(s) && !/trophy_18/.test(s)),
        JSON.stringify(probe.gateSrcs)
      );
      assert.match(String(probe.bridgeSrc), /trophy_20/, JSON.stringify(probe));
      assert.ok(probe.eraseSrc, JSON.stringify(probe));
      assert.match(String(probe.eraseSrc), /data:image\/svg\+xml/, JSON.stringify(probe));
      assert.equal(probe.crackedOverlay, true, JSON.stringify(probe));
      assert.match(String(probe.crackedBg), /trophy_13/, JSON.stringify(probe));
      assert.equal(probe.statueSel && probe.statueSel.on, true, JSON.stringify(probe.statueSel));
      assert.equal(probe.statueMode && probe.statueMode.extra, 0, JSON.stringify(probe.statueMode));
      assert.equal(probe.statueMode && probe.statueMode.type, 0, JSON.stringify(probe.statueMode));
      assert.match(String(probe.statueSel && probe.statueSel.outline), /rgb\(255,\s*255,\s*255\)/, JSON.stringify(probe.statueSel));
      assert.match(String(probe.statueSel && probe.statueSel.shadow), /26,\s*115,\s*232/, JSON.stringify(probe.statueSel));
      assert.ok(
        !/grayscale/.test(String(probe.statueSel && probe.statueSel.filter)),
        JSON.stringify(probe.statueSel)
      );
      assert.equal(probe.keys, 24, JSON.stringify(probe));
      assert.equal(probe.blocks, 24, JSON.stringify(probe));
      assert.equal(probe.chess, 12, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });

  it("Custom brush is Paint/Start/Erase and follows the Place selection", async () => {
    const h = await launchUltra({ seed: 43, headless: true });
    try {
      await h.page.waitForFunction(
        () => !!document.getElementById("ultra-custom-tools"),
        null,
        { timeout: 60000 }
      );
      const probe = await h.page.evaluate(() => {
        document.getElementById("ultra-tab-custom").click();
        const tools = [...document.querySelectorAll("#ultra-custom-tools .ultra-custom-chip")].map(
          (el) => el.textContent.trim()
        );
        const brush = document.getElementById("custom-brush");
        const brushCs = brush && getComputedStyle(brush);
        const actions = document.getElementById("ultra-custom-actions");
        const actionIds = actions
          ? [...actions.querySelectorAll("button")].map((el) => el.id)
          : [];
        const paint = document.querySelector('#ultra-custom-tools [data-custom-brush="place"]');
        document.querySelector('#ultra-place-tabs [data-tab="objects"]').click();
        const wall = document.querySelector('#ultra-place-grid .place-option[data-category="wall"]');
        if (wall) wall.click();
        const afterWall = {
          status: (document.getElementById("ultra-custom-status") || {}).textContent,
          paintOn: paint && paint.classList.contains("ultra-custom-chip-on"),
          override: window.ultraCustomBrushOverride,
        };
        document.querySelector('#ultra-custom-tools [data-custom-brush="erase"]').click();
        const afterErase = {
          status: (document.getElementById("ultra-custom-status") || {}).textContent,
          override: window.ultraCustomBrushOverride,
          eraseOn: document
            .querySelector('#ultra-custom-tools [data-custom-brush="erase"]')
            .classList.contains("ultra-custom-chip-on"),
          paintOn: paint && paint.classList.contains("ultra-custom-chip-on"),
        };
        return {
          tools,
          brushDisplay: brushCs && brushCs.display,
          actionIds,
          afterWall,
          afterErase,
          hasPlaceTool: /Place tool/i.test(document.getElementById("custom-panel").innerText),
        };
      });
      assert.deepEqual(probe.tools, ["Paint", "Start", "Erase"], JSON.stringify(probe));
      assert.equal(probe.brushDisplay, "none", JSON.stringify(probe));
      assert.deepEqual(
        probe.actionIds,
        ["custom-import", "custom-export", "custom-clear", "custom-refresh"],
        JSON.stringify(probe)
      );
      assert.equal(probe.hasPlaceTool, false, JSON.stringify(probe));
      assert.equal(probe.afterWall.status, "Wall", JSON.stringify(probe));
      assert.equal(probe.afterWall.paintOn, true, JSON.stringify(probe));
      assert.equal(probe.afterWall.override, null, JSON.stringify(probe));
      assert.match(String(probe.afterErase.status), /delete/i);
      assert.equal(probe.afterErase.override, "erase", JSON.stringify(probe));
      assert.equal(probe.afterErase.eraseOn, true, JSON.stringify(probe));
      assert.equal(probe.afterErase.paintOn, false, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });

  it("poison place sets Oka and keyblock sets yNa", async () => {
    const h = await launchUltra({ seed: 42, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const off =
          typeof window.getAppleSpawnPointOffset === "function"
            ? window.getAppleSpawnPointOffset()
            : { x: -12, y: -7 };
        if (typeof window.placePoison === "function") {
          window.placePoison(1 + off.x, 1 + off.y, 0);
        }
        if (typeof window.placeKeyblock === "function") {
          window.placeKeyblock(2, 2, 3);
        }
        if (typeof window.placeSokogoal === "function") {
          window.placeSokogoal(4, 4);
        }
        if (typeof window.placeShield === "function") {
          window.placeShield(3 + off.x, 3 + off.y, "UP");
          window.placeShield(3 + off.x, 3 + off.y, "LEFT");
        }
        if (typeof window.placeChessPiece === "function") {
          window.placeChessPiece(2 + off.x, 3 + off.y, "w", "knight");
        }
        if (typeof window.placeStatue === "function") {
          window.placeStatue(5, 5, false);
        }
        const apples =
          window.wholeSnakeObject && window.wholeSnakeObject.wa && window.wholeSnakeObject.wa.ka
            ? window.wholeSnakeObject.wa.ka
            : [];
        const poison = apples.find((a) => a && a.Oka);
        const piece = apples.find((a) => a && a.isPiece);
        const pieceShielded = !!(
          piece &&
          piece.nba &&
          typeof piece.nba.has === "function" &&
          piece.nba.size > 0
        );
        const shielded = apples.find(
          (a) => a && !a.isPiece && a.nba && a.nba.has && a.nba.has("UP") && a.nba.has("LEFT")
        );
        const walls =
          window.wholeSnakeObject && window.wholeSnakeObject.Ca && window.wholeSnakeObject.Ca.Aa
            ? [...window.wholeSnakeObject.Ca.Aa.values()]
            : [];
        const block = walls.find((w) => w && w.yNa === 3);
        const names = window.ultraPlaceNames || {};
        const soko = names.sokoContainer && window.wholeSnakeObject[names.sokoContainer];
        const goals = soko && names.sokoGoalSet && soko[names.sokoGoalSet];
        const st = names.statueContainer && window.wholeSnakeObject[names.statueContainer];
        return {
          hasPoisonFn: typeof window.placePoison === "function",
          hasKeyblockFn: typeof window.placeKeyblock === "function",
          oka: !!(poison && poison.Oka),
          yNa: block ? block.yNa : null,
          goals: goals && typeof goals.size === "number" ? goals.size : -1,
          isPiece: !!(piece && piece.isPiece),
          chessPiece: piece && piece.ChessPiece,
          chessActive: !!(window.isChessActive && window.isChessActive()),
          pieceShielded,
          shielded: !!shielded,
          statues: st && st.oa ? st.oa.size : -1,
        };
      });
      assert.equal(probe.hasPoisonFn, true);
      assert.equal(probe.hasKeyblockFn, true);
      assert.equal(probe.oka, true, JSON.stringify(probe));
      assert.equal(probe.yNa, 3, JSON.stringify(probe));
      assert.ok(probe.goals >= 1, JSON.stringify(probe));
      assert.equal(probe.isPiece, true, JSON.stringify(probe));
      assert.equal(probe.chessPiece, "knight", JSON.stringify(probe));
      assert.equal(probe.chessActive, true, JSON.stringify(probe));
      assert.equal(probe.pieceShielded, false, JSON.stringify(probe));
      assert.equal(probe.shielded, true, JSON.stringify(probe));
      assert.ok(probe.statues >= 1, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });

  it("placed chess pieces follow chess mode and snake piece shields", async () => {
    const h = await launchUltra({ seed: 50, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        function shieldSize(a) {
          return a && a.nba && typeof a.nba.size === "number" ? a.nba.size : 0;
        }
        const off =
          typeof window.getAppleSpawnPointOffset === "function"
            ? window.getAppleSpawnPointOffset()
            : { x: -12, y: -7 };
        const beforeActive = !!(window.isChessActive && window.isChessActive());
        window.head_state = "OPEN";
        window.placeChessPiece(2 + off.x, 3 + off.y, "w", "knight");
        const apples =
          window.wholeSnakeObject && window.wholeSnakeObject.wa && window.wholeSnakeObject.wa.ka
            ? window.wholeSnakeObject.wa.ka
            : [];
        const openPiece = apples.find((a) => a && a.isPiece && a.ChessPiece === "knight");
        const openShields = shieldSize(openPiece);
        window.head_pos = openPiece && openPiece.pos ? [openPiece.pos] : window.head_pos;
        window.appleArray = apples;
        const eatingOpen = !!(window.chess_eating_piece && window.chess_eating_piece());

        window.head_state = "rook";
        window.head_color = "w";
        window.placeChessPiece(4 + off.x, 5 + off.y, "b", "pawn");
        const lockedPiece = apples.find((a) => a && a.isPiece && a.ChessPiece === "pawn");
        const lockedShields = shieldSize(lockedPiece);

        window.head_state = "OPEN";
        if (typeof window.ultraSyncChessPlaceState === "function") {
          window.ultraSyncChessPlaceState();
        }

        return {
          beforeActive,
          afterActive: !!(window.isChessActive && window.isChessActive()),
          modeNum: window.CurrentModeNum,
          chessMode: window.CHESS_MODE,
          settingsMode:
            window.wholeSnakeObject && window.wholeSnakeObject.settings
              ? window.wholeSnakeObject.settings.ub
              : null,
          openPiece: !!(openPiece && openPiece.isPiece),
          openShields,
          eatingOpen,
          lockedPiece: !!(lockedPiece && lockedPiece.isPiece),
          lockedShields,
          unlockedAgain: shieldSize(openPiece) === 0 && shieldSize(lockedPiece) === 0,
        };
      });
      assert.equal(probe.beforeActive, false, JSON.stringify(probe));
      assert.equal(probe.afterActive, true, JSON.stringify(probe));
      assert.equal(probe.modeNum, probe.chessMode, JSON.stringify(probe));
      assert.equal(probe.settingsMode, probe.chessMode, JSON.stringify(probe));
      assert.equal(probe.openPiece, true, JSON.stringify(probe));
      assert.equal(probe.openShields, 0, JSON.stringify(probe));
      assert.equal(probe.eatingOpen, true, JSON.stringify(probe));
      assert.equal(probe.lockedPiece, true, JSON.stringify(probe));
      assert.equal(probe.lockedShields, 4, JSON.stringify(probe));
      assert.equal(probe.unlockedAgain, true, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });

  it("places mines on the live board while paused", async () => {
    const h = await launchUltra({ seed: 45, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const names = window.ultraPlaceNames || {};
        const canvas =
          window.gameCanvasElMakePattern ||
          document.getElementsByClassName("cer0Bd")[0];
        function clickBoard() {
          const r = canvas.getBoundingClientRect();
          canvas.dispatchEvent(
            new MouseEvent("mousedown", {
              bubbles: true,
              clientX: r.left + r.width * 0.72,
              clientY: r.top + r.height * 0.28,
            })
          );
        }
        let err = null;
        try {
          window.placeMine(1, 1);
        } catch (e) {
          err = String(e && e.message ? e.message : e);
        }
        const ma =
          typeof window.ultraMineManager === "function"
            ? window.ultraMineManager()
            : names.mineContainer && window.wholeSnakeObject[names.mineContainer];
        const afterFn = ma && ma.oa ? [...ma.oa] : [];
        const placed = afterFn.find((m) => m && m.pos && m.pos.x === 1 && m.pos.y === 1);
        const beforeClick = afterFn.length;
        window.mousePlaceMode = { category: "mine", type: -1 };
        clickBoard();
        const afterClick = ma && ma.oa ? ma.oa.size : -1;
        return {
          wrapped: !!(window.placeAppleAtMouse && window.placeAppleAtMouse.__ultraPlace),
          hasFn: typeof window.placeMine === "function",
          mineContainer: names.mineContainer || null,
          err,
          count: afterFn.length,
          xL: placed ? placed.xL : null,
          X1a: placed ? placed.X1a : null,
          beforeClick,
          afterClick,
        };
      });
      assert.equal(probe.hasFn, true, JSON.stringify(probe));
      assert.equal(probe.err, null, JSON.stringify(probe));
      assert.ok(probe.mineContainer, JSON.stringify(probe));
      assert.ok(probe.count >= 1, JSON.stringify(probe));
      assert.ok(probe.xL >= 2, JSON.stringify(probe));
      assert.equal(probe.X1a, -1, JSON.stringify(probe));
      assert.equal(probe.wrapped, true, JSON.stringify(probe));
      assert.ok(probe.afterClick > probe.beforeClick, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });

  it("places statues on the live board while paused", async () => {
    const h = await launchUltra({ seed: 46, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const names = window.ultraPlaceNames || {};
        const canvas =
          window.gameCanvasElMakePattern ||
          document.getElementsByClassName("cer0Bd")[0];
        function clickBoard() {
          const r = canvas.getBoundingClientRect();
          canvas.dispatchEvent(
            new MouseEvent("mousedown", {
              bubbles: true,
              clientX: r.left + r.width * 0.28,
              clientY: r.top + r.height * 0.72,
            })
          );
        }
        let err = null;
        try {
          window.placeStatue(1, 1, false);
          window.placeStatue(2, 2, true);
          window.placeStatue(3, 3, "0");
        } catch (e) {
          err = String(e && e.message ? e.message : e);
        }
        const ya =
          typeof window.ultraStatueManager === "function"
            ? window.ultraStatueManager()
            : names.statueContainer && window.wholeSnakeObject[names.statueContainer];
        const list = ya && ya.oa ? [...ya.oa.values()] : [];
        const plain = list.find((s) => s && s.pos && s.pos.x === 1 && s.pos.y === 1);
        const cracked = list.find((s) => s && s.pos && s.pos.x === 2 && s.pos.y === 2);
        const zeroStr = list.find((s) => s && s.pos && s.pos.x === 3 && s.pos.y === 3);
        const beforeClick = list.length;
        window.mousePlaceMode = { category: "statue", type: 0, extra: "0" };
        clickBoard();
        const afterList = ya && ya.oa ? [...ya.oa.values()] : [];
        const clickPlaced = afterList.filter(function (s) {
          if (!s || !s.pos) return false;
          const x = s.pos.x;
          const y = s.pos.y;
          return !(x === 1 && y === 1) && !(x === 2 && y === 2) && !(x === 3 && y === 3);
        });
        return {
          wrapped: !!(window.placeAppleAtMouse && window.placeAppleAtMouse.__ultraPlace),
          hasFn: typeof window.placeStatue === "function",
          statueContainer: names.statueContainer || null,
          err,
          count: list.length,
          wm: plain ? plain.wm : null,
          plainPdb: plain && plain.WQ ? plain.WQ.pdb : null,
          pdb: cracked && cracked.WQ ? cracked.WQ.pdb : null,
          zeroStrPdb: zeroStr && zeroStr.WQ ? zeroStr.WQ.pdb : null,
          hasWQ: !!(plain && plain.WQ),
          beforeClick,
          afterClick: afterList.length,
          clickPdb: clickPlaced.length
            ? clickPlaced.every(function (s) {
                return s.WQ && s.WQ.pdb === false;
              })
            : null,
        };
      });
      assert.equal(probe.hasFn, true, JSON.stringify(probe));
      assert.equal(probe.err, null, JSON.stringify(probe));
      assert.ok(probe.statueContainer, JSON.stringify(probe));
      assert.ok(probe.count >= 3, JSON.stringify(probe));
      assert.equal(probe.wm, false, JSON.stringify(probe));
      assert.equal(probe.plainPdb, false, JSON.stringify(probe));
      assert.equal(probe.pdb, true, JSON.stringify(probe));
      assert.equal(probe.zeroStrPdb, false, JSON.stringify(probe));
      assert.equal(probe.hasWQ, true, JSON.stringify(probe));
      assert.equal(probe.wrapped, true, JSON.stringify(probe));
      assert.ok(probe.afterClick > probe.beforeClick, JSON.stringify(probe));
      assert.equal(probe.clickPdb, true, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });

  it("places arrows on the live board while paused", async () => {
    const h = await launchUltra({ seed: 47, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const names = window.ultraPlaceNames || {};
        const canvas =
          window.gameCanvasElMakePattern ||
          document.getElementsByClassName("cer0Bd")[0];
        function clickBoard() {
          const r = canvas.getBoundingClientRect();
          canvas.dispatchEvent(
            new MouseEvent("mousedown", {
              bubbles: true,
              clientX: r.left + r.width * 0.72,
              clientY: r.top + r.height * 0.72,
            })
          );
        }
        let err = null;
        try {
          window.placeArrow(1, 1, "UP");
        } catch (e) {
          err = String(e && e.message ? e.message : e);
        }
        const arrows =
          typeof window.ultraArrowManager === "function"
            ? window.ultraArrowManager()
            : names.arrowContainer && window.wholeSnakeObject[names.arrowContainer];
        const cell = arrows && arrows.ka && arrows.ka[1] && arrows.ka[1][1];
        window.mousePlaceMode = { category: "arrow", type: -1, extra: "RIGHT" };
        clickBoard();
        let clickDir = null;
        if (arrows && arrows.ka) {
          for (let y = 0; y < arrows.ka.length; y++) {
            for (let x = 0; x < (arrows.ka[y] || []).length; x++) {
              const c = arrows.ka[y][x];
              if (c && c.direction === "RIGHT") clickDir = c.direction;
            }
          }
        }
        return {
          wrapped: !!(window.placeAppleAtMouse && window.placeAppleAtMouse.__ultraPlace),
          hasFn: typeof window.placeArrow === "function",
          arrowContainer: names.arrowContainer || null,
          err,
          direction: cell && cell.direction,
          wm: cell && cell.wm,
          color: cell && cell.color,
          clickDir,
        };
      });
      assert.equal(probe.hasFn, true, JSON.stringify(probe));
      assert.equal(probe.err, null, JSON.stringify(probe));
      assert.ok(probe.arrowContainer, JSON.stringify(probe));
      assert.equal(probe.direction, "UP", JSON.stringify(probe));
      assert.equal(probe.wm, false, JSON.stringify(probe));
      assert.ok(probe.color, JSON.stringify(probe));
      assert.equal(probe.wrapped, true, JSON.stringify(probe));
      assert.equal(probe.clickDir, "RIGHT", JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });

  it("places shields on the live board while paused", async () => {
    const h = await launchUltra({ seed: 48, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const off =
          typeof window.getAppleSpawnPointOffset === "function"
            ? window.getAppleSpawnPointOffset()
            : { x: -12, y: -7 };
        const canvas =
          window.gameCanvasElMakePattern ||
          document.getElementsByClassName("cer0Bd")[0];
        function clickBoard() {
          const r = canvas.getBoundingClientRect();
          canvas.dispatchEvent(
            new MouseEvent("mousedown", {
              bubbles: true,
              clientX: r.left + r.width * 0.22,
              clientY: r.top + r.height * 0.22,
            })
          );
        }
        let err = null;
        try {
          window.placeShield(1 + off.x, 1 + off.y, "UP");
        } catch (e) {
          err = String(e && e.message ? e.message : e);
        }
        const apples =
          window.wholeSnakeObject && window.wholeSnakeObject.wa && window.wholeSnakeObject.wa.ka
            ? window.wholeSnakeObject.wa.ka
            : [];
        const placed = apples.find(
          (a) => a && a.nba && a.nba.has && a.nba.has("UP")
        );
        window.mousePlaceMode = { category: "shield", type: -1, extra: "LEFT" };
        clickBoard();
        const after = window.wholeSnakeObject.wa.ka || [];
        const clicked = after.find(
          (a) => a && a.nba && a.nba.has && a.nba.has("LEFT")
        );
        return {
          wrapped: !!(window.placeAppleAtMouse && window.placeAppleAtMouse.__ultraPlace),
          hasFn: typeof window.placeShield === "function",
          err,
          hasUp: !!(placed && placed.nba.has("UP")),
          wm: placed ? placed.wm : null,
          clickLeft: !!(clicked && clicked.nba.has("LEFT")),
          clickWm: clicked ? clicked.wm : null,
        };
      });
      assert.equal(probe.hasFn, true, JSON.stringify(probe));
      assert.equal(probe.err, null, JSON.stringify(probe));
      assert.equal(probe.hasUp, true, JSON.stringify(probe));
      assert.equal(probe.wm, false, JSON.stringify(probe));
      assert.equal(probe.wrapped, true, JSON.stringify(probe));
      assert.equal(probe.clickLeft, true, JSON.stringify(probe));
      assert.equal(probe.clickWm, false, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });

  it("live board clicks place keys, keyblocks, and chess pieces", async () => {
    const h = await launchUltra({ seed: 44, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const canvas =
          window.gameCanvasElMakePattern ||
          document.getElementsByClassName("cer0Bd")[0];
        function clickBoard() {
          const r = canvas.getBoundingClientRect();
          canvas.dispatchEvent(
            new MouseEvent("mousedown", {
              bubbles: true,
              clientX: r.left + r.width / 2,
              clientY: r.top + r.height / 2,
            })
          );
        }
        const names = window.ultraPlaceNames || {};
        const g = window.wholeSnakeObject;
        const keyBox = names.keyContainer && g[names.keyContainer];
        const beforeKeys = keyBox && keyBox.keys ? keyBox.keys.length : -1;
        const wallsBefore =
          g.Ca && g.Ca.Aa ? [...g.Ca.Aa.values()].filter((w) => w && w.yNa != null).length : 0;
        const applesBefore = g.wa && g.wa.ka ? g.wa.ka.length : 0;

        window.mousePlaceMode = { category: "key", type: 4 };
        clickBoard();
        const afterKey = keyBox && keyBox.keys ? keyBox.keys.length : -1;
        const keyType = keyBox && keyBox.keys && keyBox.keys.length
          ? keyBox.keys[keyBox.keys.length - 1].type
          : null;

        window.mousePlaceMode = { category: "keyblock", type: 7 };
        clickBoard();
        const wallsAfterBlock =
          g.Ca && g.Ca.Aa ? [...g.Ca.Aa.values()].filter((w) => w && w.yNa != null) : [];
        const yNa = wallsAfterBlock.length
          ? wallsAfterBlock[wallsAfterBlock.length - 1].yNa
          : null;

        if (typeof window.injectChessFruits === "function") window.injectChessFruits();
        window.mousePlaceMode = {
          category: "chess",
          type: window.wknight,
          extra: "wknight",
          ChessColor: "w",
          ChessPiece: "knight",
        };
        clickBoard();
        const apples = g.wa && g.wa.ka ? g.wa.ka : [];
        const piece = apples.find((a) => a && a.isPiece);

        return {
          wrapped: !!(window.placeAppleAtMouse && window.placeAppleAtMouse.__ultraPlace),
          beforeKeys,
          afterKey,
          keyType,
          wallsBefore,
          keyblocks: wallsAfterBlock.length,
          yNa,
          applesBefore,
          applesAfter: apples.length,
          isPiece: !!(piece && piece.isPiece),
          chessPiece: piece && piece.ChessPiece,
          chessActive: !!(window.isChessActive && window.isChessActive()),
          pieceShielded: !!(
            piece &&
            piece.nba &&
            typeof piece.nba.has === "function" &&
            piece.nba.size > 0
          ),
        };
      });
      assert.equal(probe.wrapped, true, JSON.stringify(probe));
      assert.ok(probe.afterKey > probe.beforeKeys, JSON.stringify(probe));
      assert.equal(probe.keyType, 4, JSON.stringify(probe));
      assert.ok(probe.keyblocks > probe.wallsBefore, JSON.stringify(probe));
      assert.equal(probe.yNa, 7, JSON.stringify(probe));
      assert.equal(probe.isPiece, true, JSON.stringify(probe));
      assert.equal(probe.chessPiece, "knight", JSON.stringify(probe));
      assert.equal(probe.chessActive, true, JSON.stringify(probe));
      assert.equal(probe.pieceShielded, false, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });

  it("shows gates and bridges while paused, and erase removes them", async () => {
    const h = await launchUltra({ seed: 49, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const names = window.ultraPlaceNames || {};
        const game = window.wholeSnakeObject;
        const canvas =
          window.gameCanvasElMakePattern ||
          document.getElementsByClassName("cer0Bd")[0];
        function clickBoard() {
          const r = canvas.getBoundingClientRect();
          canvas.dispatchEvent(
            new MouseEvent("mousedown", {
              bubbles: true,
              clientX: r.left + r.width * 0.35,
              clientY: r.top + r.height * 0.35,
            })
          );
        }
        let err = null;
        try {
          window.placeBridge(2, 2);
          window.placeGate(4, 4, false);
          window.placeMine(1, 1);
        } catch (e) {
          err = String(e && e.message ? e.message : e);
        }
        const gates = names.gateContainer && game[names.gateContainer];
        const bridges = names.bridgeContainer && game[names.bridgeContainer];
        const gate = gates && Array.isArray(gates.pfa)
          ? gates.pfa.find((g) => g && g.Upa && g.Upa.x === 4 && g.Upa.y === 4)
          : null;
        const bridge = bridges && bridges.oa && bridges.oa[2] ? bridges.oa[2][2] : null;
        const minesBefore =
          typeof window.ultraMineManager === "function" && window.ultraMineManager()
            ? window.ultraMineManager().oa.size
            : -1;

        window.mousePlaceMode = { category: "mine", type: -1 };
        clickBoard();
        const minesAfterPlace =
          typeof window.ultraMineManager === "function" && window.ultraMineManager()
            ? window.ultraMineManager().oa.size
            : -1;
        window.mousePlaceMode = { category: "erase", type: -1 };
        window.ultraSetCustomBrush && window.ultraSetCustomBrush("erase");
        clickBoard();
        const minesAfterErase =
          typeof window.ultraMineManager === "function" && window.ultraMineManager()
            ? window.ultraMineManager().oa.size
            : -1;

        if (typeof window.ultraEmptyCell === "function") {
          window.ultraEmptyCell(2, 2);
          window.ultraEmptyCell(4, 4);
          window.ultraEmptyCell(5, 5);
        }
        const gateAfter = gates && Array.isArray(gates.pfa)
          ? gates.pfa.find((g) => g && g.Upa && g.Upa.x === 4 && g.Upa.y === 4)
          : null;
        const bridgeAfter = bridges && bridges.oa && bridges.oa[2] ? bridges.oa[2][2] : null;

        document.querySelector('#ultra-place-tabs [data-tab="objects"]').click();
        const erase = document.querySelector('#ultra-place-grid .place-option[data-category="erase"]');
        if (erase) erase.click();
        return {
          err,
          hasGateFn: typeof window.placeGate === "function",
          hasBridgeFn: typeof window.placeBridge === "function",
          gateWm: gate ? gate.wm : null,
          gateVertical: gate ? gate.vertical : null,
          bridgeWm: bridge ? bridge.wm : null,
          bridgeColor: bridge ? !!bridge.color : null,
          minesBefore,
          minesAfterPlace,
          minesAfterErase,
          gateGone: !gateAfter,
          bridgeGone: !bridgeAfter,
          eraseSelected: !!(
            window.mousePlaceMode &&
            window.mousePlaceMode.category === "erase"
          ),
          eraseOverride: window.ultraCustomBrushOverride,
        };
      });
      assert.equal(probe.hasGateFn, true, JSON.stringify(probe));
      assert.equal(probe.hasBridgeFn, true, JSON.stringify(probe));
      assert.equal(probe.err, null, JSON.stringify(probe));
      assert.equal(probe.gateWm, false, JSON.stringify(probe));
      assert.equal(probe.gateVertical, false, JSON.stringify(probe));
      assert.equal(probe.bridgeWm, false, JSON.stringify(probe));
      assert.equal(probe.bridgeColor, true, JSON.stringify(probe));
      assert.ok(probe.minesAfterPlace > probe.minesBefore, JSON.stringify(probe));
      assert.ok(probe.minesAfterErase < probe.minesAfterPlace, JSON.stringify(probe));
      assert.equal(probe.gateGone, true, JSON.stringify(probe));
      assert.equal(probe.bridgeGone, true, JSON.stringify(probe));
      assert.equal(probe.eraseSelected, true, JSON.stringify(probe));
      assert.equal(probe.eraseOverride, "erase", JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });
});
