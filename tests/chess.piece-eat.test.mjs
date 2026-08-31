import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("chess double-eat law (offline)", () => {
  const chess = readFileSync(path.join(ROOT, "src", "ChessInit.js"), "utf8");

  it("ChessInit defines second-piece-eat helpers and score-hook branch", () => {
    assert.match(chess, /chess_respawn_eaten_piece/);
    assert.match(chess, /chess_remove_random_opposite_piece/);
    assert.match(chess, /chess_on_second_piece_eat/);
    assert.match(chess, /chess_pos_on_bridge/);
    assert.match(chess, /chess_pos_on_bridge && window\.chess_pos_on_bridge/);
    assert.match(
      chess,
      /head_state!=='OPEN'&&window\.chess_on_second_piece_eat/
    );
    assert.match(chess, /chess_on_second_piece_eat\(_ae\)/);
    assert.match(chess, /While carrying a piece, keep full Chess locks/);
    assert.match(chess, /Piece mode always runs the lock\/unlock dance/);
    assert.match(chess, /prefer slot_free_pos/);
    assert.match(
      chess,
      /must never re-plant at that cell on fail/
    );
  });

  it("unit: chess spawn rejects bridge tiles", () => {
    const extract = (name) => {
      const re = new RegExp(
        `window\\.${name} = function ${name}\\([\\s\\S]*?\\n  \\};`
      );
      const m = chess.match(re);
      assert.ok(m, "missing " + name);
      return m[0];
    };
    const sandbox = { window: {}, Math, Object, Set, console };
    const src = `
      window.chess_pos_key = function(p){ return p ? ((p.x|0)+","+(p.y|0)) : null; };
      window.chess_board_size = function(board){
        return board && board.width != null
          ? { width: board.width|0, height: board.height|0 }
          : null;
      };
      window.chess_in_bounds = function(board, pos){
        const size = window.chess_board_size(board);
        if (!size || !pos || pos.x == null || pos.y == null) return false;
        return pos.x >= 0 && pos.y >= 0 && pos.x < size.width && pos.y < size.height;
      };
      ${extract("chess_pos_on_bridge")}
      ${extract("chess_is_legal_spawn")}
    `;
    const fn = new Function("window", "Math", "Object", "Set", src);
    fn(sandbox.window, Math, Object, Set);
    const w = sandbox.window;
    const board = { width: 8, height: 8 };
    // Bridge at 2,3
    const grid = Array.from({ length: 8 }, () => Array(8).fill(null));
    grid[3][2] = { wm: false };
    w.__remixGame = { Ga: { oa: grid } };

    assert.equal(w.chess_pos_on_bridge(null, { x: 2, y: 3 }), true);
    assert.equal(w.chess_pos_on_bridge(null, { x: 1, y: 1 }), false);
    assert.equal(
      w.chess_is_legal_spawn(board, { x: 2, y: 3 }, new Set()),
      false,
      "bridge cell illegal"
    );
    assert.equal(
      w.chess_is_legal_spawn(board, { x: 1, y: 1 }, new Set()),
      true,
      "empty cell legal"
    );
  });

  it("unit: respawn success keeps carry; fail opposite exits; fail same swaps+culls", () => {
    const extract = (name) => {
      const re = new RegExp(
        `window\\.${name} = function ${name}\\([\\s\\S]*?\\n  \\};`
      );
      const m = chess.match(re);
      assert.ok(m, "missing " + name);
      return m[0];
    };
    const sandbox = { window: {}, Math, Object, Set, console };
    const src = `
      window.isSlotMachineActive = function(){ return !!window.__slotOn; };
      window.slot_free_pos = function(){ return window.__slotFreePos || null; };
      window.chess_pos_key = function(p){ return p ? ((p.x|0)+","+(p.y|0)) : null; };
      window.chess_make_pos = function(x,y){ return { x:x|0, y:y|0 }; };
      window.chess_occupied_keys = function(game, list, skip){
        const s = new Set();
        for (let i = 0; i < (list||[]).length; i++) {
          if (skip && skip.has(i)) continue;
          const f = list[i];
          if (f && f.pos) s.add(window.chess_pos_key(f.pos));
        }
        return s;
      };
      window.chess_find_legal_spawn = function(board, freePos, occ){
        // Controllable via window.__testSpawnPos
        if (window.__testSpawnPos === null) return null;
        if (window.__testSpawnPos) return window.__testSpawnPos;
        for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
          const k = x+","+y;
          if (!occ.has(k)) return { x, y };
        }
        return null;
      };
      window.shield_all = function(){ window.__shieldAll = (window.__shieldAll|0)+1; };
      window.shield_empty_all = function(){ window.__shieldEmpty = (window.__shieldEmpty|0)+1; };
      window.updateTrophySRC = function(t){ window.__trophy = t; };
      ${extract("chess_respawn_eaten_piece")}
      ${extract("chess_remove_random_opposite_piece")}
      ${extract("chess_on_second_piece_eat")}
    `;
    const fn = new Function("window", "Math", "Object", "Set", src);
    fn(sandbox.window, Math, Object, Set);
    const w = sandbox.window;

    // --- success: relocate, keep carry ---
    w.__slotOn = false;
    w.__remixGame = { wa: { ka: [], oa: { width: 8, height: 8 } } };
    w.head_state = "rook";
    w.head_color = "w";
    w.__shieldAll = 0;
    w.__testSpawnPos = { x: 5, y: 5 };
    const eatenA = {
      isPiece: true,
      ChessPiece: "pawn",
      ChessColor: "b",
      type: 101,
      pos: { x: 1, y: 1 },
    };
    w.__remixGame.wa.ka = [eatenA];
    w.chess_on_second_piece_eat(eatenA);
    assert.equal(w.head_state, "rook", "keep carry on relocate");
    assert.equal(w.head_color, "w");
    assert.ok(w.__shieldAll > 0);
    const relocated = w.__remixGame.wa.ka.filter(
      (f) => f && f !== eatenA && f.isPiece
    );
    assert.equal(relocated.length, 1);
    assert.equal(relocated[0].ChessPiece, "pawn");
    assert.equal(relocated[0].ChessColor, "b");
    assert.equal(relocated[0].pos.x, 5);
    assert.equal(relocated[0].pos.y, 5);

    // --- Slot: prefer slot_free_pos ---
    w.__slotOn = true;
    w.__testSpawnPos = null;
    w.__slotFreePos = { x: 7, y: 2 };
    w.head_state = "rook";
    w.head_color = "w";
    const eatenSlot = {
      isPiece: true,
      ChessPiece: "bishop",
      ChessColor: "b",
      type: 103,
      pos: { x: 1, y: 2 },
    };
    w.__remixGame.wa.ka = [eatenSlot];
    w.chess_on_second_piece_eat(eatenSlot);
    assert.equal(w.head_state, "rook", "slot freePos keeps carry");
    const slotReloc = w.__remixGame.wa.ka.filter(
      (f) => f && f !== eatenSlot && f.isPiece
    );
    assert.equal(slotReloc.length, 1);
    assert.equal(slotReloc[0].pos.x, 7);
    assert.equal(slotReloc[0].pos.y, 2);
    // Fail must never re-plant at eaten cell.
    assert.equal(
      slotReloc.some((f) => (f.pos.x | 0) === 1 && (f.pos.y | 0) === 2),
      false
    );

    // --- fail + opposite → exit; no new piece at eaten cell ---
    w.__slotOn = false;
    w.__slotFreePos = null;
    w.__testSpawnPos = null;
    w.head_state = "knight";
    w.head_color = "w";
    w.__shieldEmpty = 0;
    const eatenOpp = {
      isPiece: true,
      ChessPiece: "bishop",
      ChessColor: "b",
      type: 102,
      pos: { x: 2, y: 2 },
    };
    w.__remixGame.wa.ka = [eatenOpp];
    w.chess_on_second_piece_eat(eatenOpp);
    assert.equal(w.head_state, "OPEN");
    assert.equal(w.head_color, "NONE");
    assert.ok(w.__shieldEmpty > 0);
    assert.equal(
      w.__remixGame.wa.ka.filter((f) => f && f !== eatenOpp && f.isPiece).length,
      0,
      "fail opposite must not plant a replacement"
    );

    // --- fail + same → become eaten; cull opposite ---
    w.__testSpawnPos = null;
    w.head_state = "queen";
    w.head_color = "w";
    w.__shieldAll = 0;
    w.__trophy = null;
    const same = {
      isPiece: true,
      ChessPiece: "king",
      ChessColor: "w",
      type: 55,
      pos: { x: 3, y: 3 },
    };
    const opp1 = {
      isPiece: true,
      ChessPiece: "pawn",
      ChessColor: "b",
      type: 56,
      pos: { x: 4, y: 4 },
    };
    const opp2 = {
      isPiece: true,
      ChessPiece: "rook",
      ChessColor: "b",
      type: 57,
      pos: { x: 6, y: 6 },
    };
    w.__remixGame.wa.ka = [same, opp1, opp2];
    w.chess_on_second_piece_eat(same);
    assert.equal(w.head_state, "king");
    assert.equal(w.head_color, "w");
    assert.equal(w.__trophy, 55);
    assert.ok(w.__shieldAll > 0);
    const left = w.__remixGame.wa.ka.filter((f) => f && f.isPiece);
    // same is still in list (native splice not simulated); one opposite removed
    const blackLeft = left.filter((f) => f.ChessColor === "b");
    assert.equal(blackLeft.length, 1, JSON.stringify(left));
    assert.equal(
      left.filter((f) => f !== same && (f.pos.x | 0) === 3 && (f.pos.y | 0) === 3)
        .length,
      0,
      "fail same must not plant at eaten cell"
    );
  });

  it("unit: peaceful does not wipe locks while carrying", () => {
    const extract = (name) => {
      const re = new RegExp(
        `window\\.${name} = function ${name}\\([\\s\\S]*?\\n  \\};`
      );
      const m = chess.match(re);
      assert.ok(m, "missing " + name);
      return m[0];
    };
    const sandbox = { window: {}, Math, Object, Set, console };
    const src = `
      window.chess_shield_field = "nba";
      window.chess_peaceful_active = function(){ return !!window.__peaceful; };
      window.isChessActive = function(){ return true; };
      window.head_pos = [{ x: 4, y: 4 }];
      window.pawn_open = function(){ window.__opened = "pawn"; return false; };
      window.rook_open = function(){ window.__opened = "rook"; return false; };
      window.bishop_open = function(){ window.__opened = "bishop"; return false; };
      window.knight_open = function(){ window.__opened = "knight"; return false; };
      window.king_open = function(){ window.__opened = "king"; return false; };
      ${extract("shield_empty_all")}
      ${extract("shield_all")}
      ${extract("chess_tick_logic")}
    `;
    const fn = new Function("window", "Math", "Object", "Set", src);
    fn(sandbox.window, Math, Object, Set);
    const w = sandbox.window;
    const piece = { isPiece: true, nba: new Set(["UP"]) };
    w.appleArray = [piece];

    // OPEN + peaceful → empty
    w.head_state = "OPEN";
    w.__peaceful = true;
    w.shield_all();
    assert.equal(piece.nba, undefined, "OPEN+peaceful clears");

    // Carrying + peaceful → still lock
    piece.nba = undefined;
    w.head_state = "rook";
    w.__peaceful = true;
    w.__opened = null;
    w.shield_all();
    assert.ok(piece.nba && piece.nba.size === 4, "carry+peaceful locks");
    w.chess_tick_logic();
    assert.equal(w.__opened, "rook", "carry+peaceful still runs unlock rays");
    assert.ok(piece.nba && piece.nba.size === 4, "tick keeps locks while carrying");
  });
});

/**
 * Place apple[0] one cell ahead of the head, tick once so the snake eats it.
 * Returns before/after snapshots for assertions.
 */
async function eatPieceAtHead(page) {
  return page.evaluate(() => {
    const g = window.__remixGame;
    const apples = g.wa.ka;
    if (!apples.length) return { ok: false, reason: "no apples" };

    const head = g.oa.ka[0];
    const dir = g.oa.direction || "RIGHT";
    const next = { x: head.x, y: head.y };
    if (dir === "RIGHT") next.x += 1;
    else if (dir === "LEFT") next.x -= 1;
    else if (dir === "UP") next.y -= 1;
    else if (dir === "DOWN") next.y += 1;

    // Ensure OPEN so shields don't block the eat; place piece 0 on next cell.
    window.head_state = "OPEN";
    window.shield_empty_all && window.shield_empty_all();

    const eaten = apples[0];
    const beforePositions = apples.map((a) => ({
      x: a.pos.x,
      y: a.pos.y,
      isPiece: !!a.isPiece,
      ChessColor: a.ChessColor,
      ChessPiece: a.ChessPiece,
    }));
    const beforeKeys = new Set(
      beforePositions.slice(1).map((a) => `${a.x},${a.y}`)
    );

    eaten.pos.x = next.x;
    eaten.pos.y = next.y;
    eaten.isPiece = true;
    if (!eaten.ChessPiece) eaten.ChessPiece = "pawn";
    if (!eaten.ChessColor) eaten.ChessColor = "w";
    eaten.Oba = undefined;

    const beforeCount = apples.length;
    const beforeScore = g.Sh;
    const beforeLen = g.oa.Ta;
    const beforeUb = g.ub;
    const beforeLj = g.lj;

    g.tick();

    function shieldCount(a) {
      if (a.nba) {
        if (typeof a.nba.size === "number") return a.nba.size;
        if (Array.isArray(a.nba)) return a.nba.length;
      }
      if (a.Oba) return a.Oba.length;
      return 0;
    }

    const after = g.wa.ka;
    const afterPositions = after.map((a) => ({
      x: a.pos.x,
      y: a.pos.y,
      isPiece: !!a.isPiece,
      ChessColor: a.ChessColor,
      ChessPiece: a.ChessPiece,
      shieldCount: shieldCount(a),
    }));
    const survivorsMatch = afterPositions.every((a) =>
      beforeKeys.has(`${a.x},${a.y}`)
    );
    // Every survivor was in the pre-eat set excluding the eaten one.
    // Also no extras appeared (no spawn on piece eat).
    const afterKeys = new Set(afterPositions.map((a) => `${a.x},${a.y}`));
    let extras = 0;
    for (const k of afterKeys) if (!beforeKeys.has(k)) extras++;

    return {
      ok: true,
      beforeCount,
      afterCount: after.length,
      removed: beforeCount - after.length,
      scoreBefore: beforeScore,
      scoreAfter: g.Sh,
      lenBefore: beforeLen,
      lenAfter: g.oa.Ta,
      head_state: window.head_state,
      head_color: window.head_color,
      just_ate: window.just_ate,
      won: !!(g.ub && g.lj),
      ubBefore: beforeUb,
      ljBefore: beforeLj,
      ubAfter: g.ub,
      ljAfter: g.lj,
      survivorsMatch,
      extras,
      afterPositions,
      remainingShielded: afterPositions.every((a) => a.shieldCount >= 4),
    };
  });
}

describe("chess piece eat (browser)", { skip: !runBrowser }, () => {
  it("1a: eating a piece removes exactly one apple and does not win", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 21, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      await h.page.waitForTimeout(200);
      const r = await eatPieceAtHead(h.page);
      assert.equal(r.ok, true, JSON.stringify(r));
      assert.equal(r.beforeCount, 2, "1a starts with 2 pieces");
      assert.equal(r.removed, 1, "exactly one apple removed");
      assert.equal(r.afterCount, 1, "one piece remains");
      assert.equal(r.scoreAfter, r.scoreBefore, "no score on piece eat");
      assert.equal(r.lenAfter, r.lenBefore, "no growth on piece eat");
      assert.equal(r.extras, 0, "no spawn on piece eat");
      assert.equal(r.survivorsMatch, true, "remaining piece kept its cell");
      assert.equal(r.won, false, "must not win with apples still on board");
      assert.ok(
        ["pawn", "rook", "bishop", "knight", "king", "queen"].includes(
          r.head_state
        ),
        "head_state is a piece: " + r.head_state
      );
      assert.equal(r.just_ate, "piece");
      assert.equal(r.remainingShielded, true, "remaining apples shielded");
    } finally {
      await h.close();
    }
  });

  it("5a: eating a piece removes one and leaves the other nine untouched", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 33, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.FIVE, size: SIZE.NORMAL });
      await h.page.waitForTimeout(200);
      const r = await eatPieceAtHead(h.page);
      assert.equal(r.ok, true, JSON.stringify(r));
      assert.equal(r.beforeCount, 10, "5a starts with 10 pieces");
      assert.equal(r.removed, 1, "exactly one apple removed");
      assert.equal(r.afterCount, 9);
      assert.equal(r.scoreAfter, r.scoreBefore);
      assert.equal(r.lenAfter, r.lenBefore);
      assert.equal(r.extras, 0);
      assert.equal(r.survivorsMatch, true);
      assert.equal(r.won, false);
      assert.equal(r.just_ate, "piece");
    } finally {
      await h.close();
    }
  });

  it("peaceful blender: walking into a locked piece eats it (no ghost)", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 41, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.THREE, size: SIZE.NORMAL });
      const r = await h.page.evaluate(() => {
        const g = window.__remixGame;
        g.Sh = 0;
        window.cat_check_score_win = () => false;
        g.settings.ub = 22;
        window.CurrentModeNum = 22;
        const rSa = new Set([window.CHESS_MODE, 21]);
        g.rSa = rSa;
        g.settings.rSa = rSa;
        window.chess_blending = true;

        window.head_state = "OPEN";
        window.shield_empty_all();
        const head = g.oa.ka[0];
        g.oa.direction = "RIGHT";
        g.oa.Ca = "RIGHT";
        const step = (h) => ({ x: h.x + 1, y: h.y });

        const first = g.wa.ka[0];
        first.pos.x = step(head).x;
        first.pos.y = step(head).y;
        first.isPiece = true;
        first.ChessPiece = "pawn";
        first.ChessColor = "w";
        g.tick();

        const target = g.wa.ka.find((a) => a && a.isPiece);
        target.ChessColor = "w"; // same color — no unlock via pawn diagonals
        target.ChessPiece = "rook";
        target.isPiece = true;
        // Force locks then let peaceful chess_tick clear them / eat.
        target.nba = new Set(["UP", "DOWN", "LEFT", "RIGHT"]);
        window.appleArray = g.wa.ka;
        window.shield_all();
        const lockedAfterShieldAll =
          target.nba && typeof target.nba.size === "number"
            ? target.nba.size
            : 0;

        const h2 = g.oa.ka[0];
        const n2 = step(h2);
        target.pos.x = n2.x;
        target.pos.y = n2.y;
        const before = g.wa.ka.length;
        g.tick();
        return {
          peaceful: window.chess_peaceful_active(g),
          lockedAfterShieldAll,
          before,
          after: g.wa.ka.length,
          removed: before - g.wa.ka.length,
          nj: !!g.nj,
          just_ate: window.just_ate,
          head_state: window.head_state,
          targetStill: g.wa.ka.includes(target),
          headOn: g.oa.ka[0].x === n2.x && g.oa.ka[0].y === n2.y,
        };
      });

      assert.equal(r.peaceful, true, JSON.stringify(r));
      // Carrying after first pickup: peaceful must NOT wipe Chess locks.
      assert.equal(
        r.lockedAfterShieldAll,
        4,
        "carry+peaceful keeps locks: " + JSON.stringify(r)
      );
      assert.equal(r.targetStill, false, JSON.stringify(r));
      assert.equal(r.nj, false, JSON.stringify(r));
      assert.equal(r.just_ate, "piece", JSON.stringify(r));
      assert.equal(r.headOn, true, JSON.stringify(r));
      // Relocate success → net count unchanged; fail → −1. Either is fine.
      assert.ok(
        r.removed === 0 || r.removed === 1,
        "second-eat removes eaten cell: " + JSON.stringify(r)
      );
    } finally {
      await h.close();
    }
  });

  it("cat blender life: walking into a locked piece eats it", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 42, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.THREE, size: SIZE.NORMAL });
      const r = await h.page.evaluate(() => {
        const g = window.__remixGame;
        g.Sh = 0;
        window.cat_check_score_win = () => false;
        g.settings.ub = 22;
        window.CurrentModeNum = 22;
        const rSa = new Set([window.CHESS_MODE, window.CAT_MODE]);
        g.rSa = rSa;
        g.settings.rSa = rSa;
        window.cat_lives = 3;
        window.cat_peaceful_ticks = 0;
        window.cat_blending = true;
        window.chess_blending = true;

        window.head_state = "OPEN";
        window.shield_empty_all();
        const head = g.oa.ka[0];
        g.oa.direction = "RIGHT";
        g.oa.Ca = "RIGHT";
        const step = (h) => ({ x: h.x + 1, y: h.y });

        const first = g.wa.ka[0];
        first.pos.x = step(head).x;
        first.pos.y = step(head).y;
        first.isPiece = true;
        first.ChessPiece = "pawn";
        first.ChessColor = "w";
        g.tick();

        const target = g.wa.ka.find((a) => a && a.isPiece);
        target.ChessColor = "w";
        target.ChessPiece = "rook";
        target.isPiece = true;
        window.appleArray = g.wa.ka;
        window.shield_all();
        target.nba = new Set(["UP", "DOWN", "LEFT", "RIGHT"]);

        const h2 = g.oa.ka[0];
        const n2 = step(h2);
        target.pos.x = n2.x;
        target.pos.y = n2.y;
        const before = g.wa.ka.length;
        const lives0 = window.cat_lives | 0;
        g.tick();
        return {
          before,
          after: g.wa.ka.length,
          removed: before - g.wa.ka.length,
          nj: !!g.nj,
          lives0,
          lives1: window.cat_lives | 0,
          just_ate: window.just_ate,
          targetStill: g.wa.ka.includes(target),
          headOn: g.oa.ka[0].x === n2.x && g.oa.ka[0].y === n2.y,
        };
      });

      // Second piece while carrying: relocate may keep net count; eaten cell gone.
      assert.ok(
        r.removed === 0 || r.removed === 1,
        "second-eat board delta: " + JSON.stringify(r)
      );
      assert.equal(r.targetStill, false, JSON.stringify(r));
      assert.equal(r.nj, false, JSON.stringify(r));
      assert.equal(r.just_ate, "piece", JSON.stringify(r));
      assert.equal(r.headOn, true, JSON.stringify(r));
      assert.ok(r.lives1 <= r.lives0, "life spent or already in grace");
    } finally {
      await h.close();
    }
  });
});
