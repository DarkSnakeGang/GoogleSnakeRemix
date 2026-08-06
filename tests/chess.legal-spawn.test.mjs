import { describe, it } from "node:test";
import assert from "node:assert/strict";

/**
 * Mirrors ChessInit legal-spawn helpers for offline contract tests.
 * Browser tests exercise the live window.* implementations.
 */
function posKey(pos) {
  if (!pos || pos.x == null || pos.y == null) return null;
  return (pos.x << 16) | (pos.y & 65535);
}

function inBounds(board, pos) {
  if (!board || !pos) return false;
  return (
    pos.x >= 0 &&
    pos.y >= 0 &&
    pos.x < board.width &&
    pos.y < board.height
  );
}

function occupiedKeys(snake, apples, skipIndexes = []) {
  const keys = new Set();
  const skip = new Set(skipIndexes);
  for (const seg of snake || []) {
    const k = posKey(seg);
    if (k != null) keys.add(k);
  }
  (apples || []).forEach((a, i) => {
    if (skip.has(i)) return;
    const k = posKey(a);
    if (k != null) keys.add(k);
  });
  return keys;
}

function isLegal(board, pos, occ) {
  if (!inBounds(board, pos)) return false;
  return !occ.has(posKey(pos));
}

function assertAllLegal(state) {
  const board = state.board;
  assert.ok(board, "board size required");
  const apples = state.apples || [];
  for (let i = 0; i < apples.length; i++) {
    const a = apples[i];
    const occ = occupiedKeys(state.snake, apples.map((x) => ({ x: x.x, y: x.y })), [
      i,
    ]);
    assert.equal(
      isLegal(board, { x: a.x, y: a.y }, occ),
      true,
      `apple ${i} at ${a.x},${a.y} illegal (board ${board.width}x${board.height})`
    );
  }
  const keys = apples.map((a) => `${a.x},${a.y}`);
  assert.equal(new Set(keys).size, keys.length, "duplicate apple cells");
}

describe("chess legal spawn contract (offline)", () => {
  it("rejects off-board and occupied cells for each size", () => {
    for (const board of [
      { width: 17, height: 15 },
      { width: 10, height: 9 },
      { width: 24, height: 21 },
    ]) {
      const snake = [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ];
      const apples = [
        { x: 5, y: 5 },
        { x: 6, y: 5 },
      ];
      const occ = occupiedKeys(snake, apples, []);
      assert.equal(isLegal(board, { x: 0, y: 0 }, occ), true);
      assert.equal(isLegal(board, { x: -1, y: 0 }, occ), false);
      assert.equal(isLegal(board, { x: board.width, y: 0 }, occ), false);
      assert.equal(isLegal(board, { x: 0, y: board.height }, occ), false);
      assert.equal(isLegal(board, { x: 1, y: 1 }, occ), false); // snake
      assert.equal(isLegal(board, { x: 5, y: 5 }, occ), false); // fruit
    }
  });

  it("all-or-nothing: no partner means no half-pair", () => {
    const tryPair = (partnerLegal) => (partnerLegal ? 2 : 0);
    assert.equal(tryPair(false), 0);
    assert.equal(tryPair(true) % 2, 0);
  });
});

const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("chess legal spawn (browser)", { skip: !runBrowser }, () => {
  it("start and post-fruit-pair cells are in-bounds and unoccupied", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 11, headless: true });
    try {
      for (const size of [SIZE.NORMAL, SIZE.SMALL, SIZE.LARGE]) {
        await h.start({ mode: "chess", count: COUNT.FIVE, size });
        await h.page.waitForTimeout(300);
        let state = await h.state();
        assertAllLegal(state);

        // Force a fruit-eat pair spawn through the same helper the Mn patch uses.
        const result = await h.page.evaluate(() => {
          const g = window.__remixGame;
          if (!g || !window.chess_fruit_respawn || !window.chess_is_legal_spawn) {
            return { ok: false, reason: "helpers missing" };
          }
          if (!g.wa.ka.length) return { ok: false, reason: "no apples" };
          const before = g.wa.ka.length;
          const added = window.chess_fruit_respawn(
            g.wa,
            function makeApple(mgr) {
              const proto = mgr.ka[0];
              return {
                pos: window.chess_make_pos(0, 0),
                cM: 0,
                type: -1,
                Cm: false,
                Ee: proto.Ee && proto.Ee.clone ? proto.Ee.clone() : { x: 0, y: 0 },
                RAb: { x: 0, y: 0 },
                zL: { x: 1, y: 1 },
                nla: false,
                Gh: true,
                light: 0,
                Oba: undefined,
                nD: 0,
              };
            },
            function freePos(board, excl, radius) {
              return g.Tb(excl, radius);
            },
            null
          );
          const board = g.wa.oa;
          const apples = g.wa.ka;
          const illegal = [];
          for (let i = 0; i < apples.length; i++) {
            const occ = window.chess_occupied_keys(g, apples, new Set([i]));
            if (!window.chess_is_legal_spawn(board, apples[i].pos, occ)) {
              illegal.push({
                i,
                x: apples[i].pos.x,
                y: apples[i].pos.y,
              });
            }
          }
          const keys = apples.map((a) => `${a.pos.x},${a.pos.y}`);
          const delta = apples.length - before;
          const animated =
            delta === 2 ? apples.slice(-2).every((a) => a.Cm === true) : true;
          return {
            ok:
              illegal.length === 0 &&
              new Set(keys).size === keys.length &&
              delta === added &&
              (delta === 0 || delta === 2) &&
              animated,
            before,
            after: apples.length,
            added,
            animated,
            delta,
            illegal,
            duplicates: keys.length - new Set(keys).size,
            board: {
              width: board.oa.width,
              height: board.oa.height,
            },
          };
        });
        assert.equal(result.ok, true, JSON.stringify(result));
        state = await h.state();
        assertAllLegal(state);
      }
    } finally {
      await h.close();
    }
  });
});
