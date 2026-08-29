import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

function read(rel) {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("Chess + Portal combo (offline)", () => {
  it("ChessInit gates P6E for pieces and notes portal twin on fruit", () => {
    const chess = read("src/ChessInit.js");
    assert.match(chess, /chess_portal_combo/);
    assert.match(chess, /just_ate==='piece'/);
    assert.match(chess, /chess_spawn_unlock_twin/);
    assert.match(chess, /chess_portal_note_fruit_twin/);
    assert.match(chess, /chess_portal_after_fruit_splice/);
    assert.match(chess, /P6E\(a\.Sa,k,f,e,g\)/);
    assert.match(chess, /_ti=k%2===0\?k\+1:k-1/);
    assert.match(chess, /rSa\.has\(window\.CHESS_MODE\)/);
    assert.match(
      chess,
      /chess_portal_combo\(\)\)\{window\.chess_portal_note_fruit_twin/
    );
    assert.match(
      chess,
      /else if\(!\(a\.settings\.ka===4\|\|a\.settings\.ka===6\|\|\(a\.settings\.ka===5&&!a\.kc\)\)\)\{window\.chess_fruit_respawn/
    );
    assert.match(chess, /chess_portal_combo_respawn/);
    assert.match(chess, /chess_spawn_n_pairs/);
    assert.match(chess, /a\.wa\.ka\.splice\(k,1\),k--,window\.chess_portal_after_fruit_splice/);
  });

  it("Mexico eat patch matches Chess portal-combo spawn string", () => {
    const mx = read("src/MexicoInit.js");
    assert.match(mx, /__chessMakeApple=g7/);
    assert.match(mx, /chess_portal_note_fruit_twin/);
    assert.match(mx, /else if\(!\(a\.settings\.ka===4/);
    assert.match(mx, /else if\(window\.isMexicoActive&&window\.isMexicoActive\(\)\)\{e=!window\.cat_allows_pair_spawn\|\|window\.cat_allows_pair_spawn\(a\);\}/);
  });
});

describe("Chess + Portal combo (browser)", { skip: !runBrowser }, () => {
  async function enableChessPortalBlender(page) {
    return page.evaluate(() => {
      const g = window.__remixGame;
      window.chess_blending = true;
      window.CurrentModeNum = 22;
      g.settings.ob = 22;
      g.settings.ub = 22;
      if (!g.settings.rSa) g.settings.rSa = new Set();
      g.settings.rSa.add(window.CHESS_MODE);
      g.settings.rSa.add(2);
      g.wa.reset();
      // reset() must not drop blender portal bit
      g.settings.rSa.add(window.CHESS_MODE);
      g.settings.rSa.add(2);
      g.settings.ub = 22;
      g.settings.ob = 22;
      window.CurrentModeNum = 22;
      window.appleArray = g.wa.ka;
      return {
        chess: window.isChessActive(),
        combo: window.chess_portal_combo(),
        apples: g.wa.ka.length,
        pieces: g.wa.ka.filter((a) => a.isPiece).length,
        rSa: [...g.settings.rSa],
      };
    });
  }

  it("piece eat does not teleport; becomes that piece", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 31, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      const setup = await enableChessPortalBlender(h.page);
      assert.equal(setup.chess, true, JSON.stringify(setup));
      assert.equal(setup.combo, true, JSON.stringify(setup));

      const r = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const apples = g.wa.ka;
        const head = g.oa.ka[0];
        g.oa.direction = "RIGHT";
        window.head_state = "OPEN";
        window.shield_empty_all && window.shield_empty_all();

        // Two pieces as a portal-ish pair for twin index.
        const eaten = apples[0];
        const twin = apples[1];
        const twinPos = { x: twin.pos.x, y: twin.pos.y };
        eaten.isPiece = true;
        eaten.ChessPiece = "knight";
        eaten.ChessColor = "w";
        twin.isPiece = true;
        twin.ChessPiece = "pawn";
        twin.ChessColor = "b";

        eaten.pos.x = head.x + 1;
        eaten.pos.y = head.y;

        const headBefore = { x: head.x, y: head.y };
        const sh0 = g.Sh | 0;
        g.tick();
        const headAfter = { x: g.oa.ka[0].x, y: g.oa.ka[0].y };
        return {
          just_ate: window.just_ate,
          head_state: window.head_state,
          sh: g.Sh | 0,
          sh0,
          headBefore,
          headAfter,
          teleportedToTwin:
            headAfter.x === twinPos.x && headAfter.y === twinPos.y,
          appleCount: g.wa.ka.length,
        };
      });

      assert.equal(r.just_ate, "piece", JSON.stringify(r));
      assert.equal(r.head_state, "knight", JSON.stringify(r));
      assert.equal(r.sh, r.sh0, "no score on piece: " + JSON.stringify(r));
      assert.equal(r.teleportedToTwin, false, JSON.stringify(r));
      // Head advances one cell onto the piece, not warp to twin.
      assert.equal(r.headAfter.x, r.headBefore.x + 1, JSON.stringify(r));
      assert.equal(r.headAfter.y, r.headBefore.y, JSON.stringify(r));
    } finally {
      await h.close();
    }
  });

  it("unlock spawns a twin fruit; fruit eat teleports and spawns 2 pieces", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 32, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      await enableChessPortalBlender(h.page);

      const unlock = await h.page.evaluate(() => {
        const g = window.__remixGame;
        // Unlock at an ODD index — old insert-after pairing left an orphan twin.
        const target = g.wa.ka[1];
        target.isPiece = true;
        target.ChessPiece = "pawn";
        target.ChessColor = "b";
        g.wa.ka[0].isPiece = true;
        g.wa.ka[0].ChessPiece = "rook";
        g.wa.ka[0].ChessColor = "w";
        const before = g.wa.ka.length;
        window.head_state = "rook";
        window.head_color = "w";
        window.selectedFruit = 0;
        window.appleArray = g.wa.ka;
        const ok = window.capture_attempt(target.pos.x, target.pos.y);
        const fruits = [];
        for (let i = 0; i < g.wa.ka.length; i++) {
          if (g.wa.ka[i] && !g.wa.ka[i].isPiece) fruits.push(i);
        }
        // Unlocked fruit and twin must occupy one even/odd portal pair.
        let paired = false;
        for (let i = 0; i + 1 < g.wa.ka.length; i += 2) {
          if (!g.wa.ka[i].isPiece && !g.wa.ka[i + 1].isPiece) {
            paired = true;
            break;
          }
        }
        return {
          ok,
          before,
          after: g.wa.ka.length,
          fruitCount: fruits.length,
          fruitIdxs: fruits,
          paired,
          head_state: window.head_state,
          combo: window.chess_portal_combo(),
        };
      });
      assert.equal(unlock.ok, true, JSON.stringify(unlock));
      assert.equal(unlock.head_state, "OPEN", JSON.stringify(unlock));
      assert.ok(unlock.after >= unlock.before, "twin placed: " + JSON.stringify(unlock));
      assert.ok(unlock.fruitCount >= 2, JSON.stringify(unlock));
      assert.equal(unlock.paired, true, "unlock twin must be portal-paired: " + JSON.stringify(unlock));

      const eat = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const head = g.oa.ka[0];
        g.oa.direction = "RIGHT";
        window.head_state = "OPEN";
        window.shield_empty_all && window.shield_empty_all();

        // Find a fruit pair (two consecutive non-pieces at even base).
        let fi = -1;
        for (let i = 0; i + 1 < g.wa.ka.length; i += 2) {
          if (!g.wa.ka[i].isPiece && !g.wa.ka[i + 1].isPiece) {
            fi = i;
            break;
          }
        }
        if (fi < 0) return { ok: false, reason: "need portal-paired fruits" };
        const fruit = g.wa.ka[fi];
        const twin = g.wa.ka[fi + 1];
        const twinPos = { x: twin.pos.x, y: twin.pos.y };
        fruit.pos.x = head.x + 1;
        fruit.pos.y = head.y;

        const sh0 = g.Sh | 0;
        const piecesBefore = g.wa.ka.filter((a) => a.isPiece).length;
        g.tick();
        const headAfter = { x: g.oa.ka[0].x, y: g.oa.ka[0].y };
        const piecesAfter = g.wa.ka.filter((a) => a.isPiece).length;
        const fruitsAfter = g.wa.ka.filter((a) => !a.isPiece).length;
        return {
          ok: true,
          just_ate: window.just_ate,
          sh0,
          sh: g.Sh | 0,
          teleported:
            headAfter.x === twinPos.x && headAfter.y === twinPos.y,
          piecesBefore,
          piecesAfter,
          fruitsAfter,
          appleCount: g.wa.ka.length,
        };
      });
      assert.equal(eat.ok, true, JSON.stringify(eat));
      assert.equal(eat.just_ate, "fruit", JSON.stringify(eat));
      assert.equal(eat.sh, eat.sh0 + 1, JSON.stringify(eat));
      assert.equal(eat.teleported, true, JSON.stringify(eat));
      assert.equal(eat.fruitsAfter, 0, "no orphan fruit twin: " + JSON.stringify(eat));
      assert.equal(
        eat.piecesAfter,
        eat.piecesBefore + 2,
        "2 new pieces: " + JSON.stringify(eat)
      );
    } finally {
      await h.close();
    }
  });

  it("solo portal still teleports; solo chess piece still does not", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 33, headless: true });
    try {
      await h.start({ mode: "portal", count: COUNT.ONE, size: SIZE.NORMAL });
      const portal = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const head = g.oa.ka[0];
        g.oa.direction = "RIGHT";
        const a0 = g.wa.ka[0];
        const a1 = g.wa.ka[1];
        const twinPos = { x: a1.pos.x, y: a1.pos.y };
        a0.pos.x = head.x + 1;
        a0.pos.y = head.y;
        g.tick();
        const headAfter = { x: g.oa.ka[0].x, y: g.oa.ka[0].y };
        return {
          teleported: headAfter.x === twinPos.x && headAfter.y === twinPos.y,
          combo: window.chess_portal_combo && window.chess_portal_combo(),
        };
      });
      assert.equal(portal.combo, false, JSON.stringify(portal));
      assert.equal(portal.teleported, true, JSON.stringify(portal));

      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      const chess = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const head = g.oa.ka[0];
        g.oa.direction = "RIGHT";
        window.head_state = "OPEN";
        window.shield_empty_all && window.shield_empty_all();
        const eaten = g.wa.ka[0];
        const twin = g.wa.ka[1];
        // Keep twin far from the step cell so a normal step cannot look like a warp.
        twin.pos.x = 0;
        twin.pos.y = 0;
        const twinPos = { x: twin.pos.x, y: twin.pos.y };
        eaten.isPiece = true;
        eaten.ChessPiece = "bishop";
        eaten.ChessColor = "w";
        eaten.pos.x = head.x + 1;
        eaten.pos.y = head.y;
        const before = { x: head.x, y: head.y };
        g.tick();
        const after = { x: g.oa.ka[0].x, y: g.oa.ka[0].y };
        return {
          combo: window.chess_portal_combo(),
          head_state: window.head_state,
          teleportedToTwin: after.x === twinPos.x && after.y === twinPos.y,
          stepped: after.x === before.x + 1 && after.y === before.y,
        };
      });
      assert.equal(chess.combo, false, JSON.stringify(chess));
      assert.equal(chess.head_state, "bishop", JSON.stringify(chess));
      assert.equal(chess.teleportedToTwin, false, JSON.stringify(chess));
      assert.equal(chess.stepped, true, JSON.stringify(chess));
    } finally {
      await h.close();
    }
  });

  it("lone fruit on odd Chess+Portal board does not crash P6E", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 34, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      await enableChessPortalBlender(h.page);
      const r = await h.page.evaluate(() => {
        const g = window.__remixGame;
        // Reproduce: single fruit, no twin — native P6E would throw on .pos
        const one = g.wa.ka[0];
        one.isPiece = false;
        g.wa.ka.length = 1;
        const head = g.oa.ka[0];
        g.oa.direction = "RIGHT";
        window.head_state = "OPEN";
        window.shield_empty_all && window.shield_empty_all();
        one.pos.x = head.x + 1;
        one.pos.y = head.y;
        const sh0 = g.Sh | 0;
        try {
          g.tick();
          return {
            ok: true,
            just_ate: window.just_ate,
            sh: (g.Sh | 0) - sh0,
            apples: g.wa.ka.length,
          };
        } catch (e) {
          return { ok: false, crash: e.message };
        }
      });
      assert.equal(r.ok, true, JSON.stringify(r));
      assert.equal(r.just_ate, "fruit", JSON.stringify(r));
      assert.equal(r.sh, 1, JSON.stringify(r));
    } finally {
      await h.close();
    }
  });

  it("rSa Chess+Portal without chess_blending still clears twin and spawns 2 pieces", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 35, headless: true });
    try {
      await h.start({ mode: "portal", count: COUNT.ONE, size: SIZE.NORMAL });
      const r = await h.page.evaluate(() => {
        const g = window.__remixGame;
        // Chess in blender set but remix toggle flag off (mode-grid selection).
        window.chess_blending = false;
        window.CurrentModeNum = 22;
        g.settings.ub = 22;
        g.settings.ob = 22;
        g.settings.rSa = new Set([window.CHESS_MODE, 2]);
        g.wa.reset();
        g.settings.rSa.add(window.CHESS_MODE);
        g.settings.rSa.add(2);
        g.settings.ub = 22;
        g.settings.ob = 22;
        window.appleArray = g.wa.ka;

        if (!window.isChessActive() || !window.chess_portal_combo()) {
          return {
            ok: false,
            reason: "active/combo",
            chess: window.isChessActive(),
            combo: window.chess_portal_combo(),
            blending: window.chess_blending,
          };
        }

        // Build a fruit portal pair (+ optional orphan piece) like unlock.
        window.head_state = "rook";
        window.head_color = "w";
        window.selectedFruit = 0;
        if (g.wa.ka.length < 2) return { ok: false, reason: "apples" };
        g.wa.ka[0].isPiece = true;
        g.wa.ka[0].ChessColor = "w";
        g.wa.ka[1].isPiece = true;
        g.wa.ka[1].ChessColor = "b";
        window.capture_attempt(g.wa.ka[1].pos.x, g.wa.ka[1].pos.y);

        let fi = -1;
        for (let i = 0; i + 1 < g.wa.ka.length; i += 2) {
          if (!g.wa.ka[i].isPiece && !g.wa.ka[i + 1].isPiece) {
            fi = i;
            break;
          }
        }
        if (fi < 0) return { ok: false, reason: "no pair", map: g.wa.ka.map((a) => (a.isPiece ? "P" : "F")) };

        const head = g.oa.ka[0];
        g.oa.direction = "RIGHT";
        window.head_state = "OPEN";
        window.shield_empty_all && window.shield_empty_all();
        const fruit = g.wa.ka[fi];
        const twin = g.wa.ka[fi + 1];
        const twinPos = { x: twin.pos.x, y: twin.pos.y };
        fruit.pos.x = head.x + 1;
        fruit.pos.y = head.y;
        const piecesBefore = g.wa.ka.filter((a) => a.isPiece).length;
        g.tick();
        const headAfter = { x: g.oa.ka[0].x, y: g.oa.ka[0].y };
        return {
          ok: true,
          blending: window.chess_blending,
          teleported: headAfter.x === twinPos.x && headAfter.y === twinPos.y,
          fruitsAfter: g.wa.ka.filter((a) => !a.isPiece).length,
          piecesBefore,
          piecesAfter: g.wa.ka.filter((a) => a.isPiece).length,
          just_ate: window.just_ate,
        };
      });
      assert.equal(r.ok, true, JSON.stringify(r));
      assert.equal(r.blending, false, JSON.stringify(r));
      assert.equal(r.teleported, true, JSON.stringify(r));
      assert.equal(r.fruitsAfter, 0, "exit fruit must clear: " + JSON.stringify(r));
      assert.equal(
        r.piecesAfter,
        r.piecesBefore + 2,
        "2 chess pieces: " + JSON.stringify(r)
      );
    } finally {
      await h.close();
    }
  });

  it("Dice/Tally/Bomb Chess+Portal use count-specific respawns", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");

    // Bomb: first fruit → ~48 pieces (board-space may trim), kc set; later +2.
    {
      const h = await launchHarness({ seed: 71, headless: true });
      try {
        await h.start({ mode: "chess", count: COUNT.BOMB, size: SIZE.NORMAL });
        await enableChessPortalBlender(h.page);
        const r = await h.page.evaluate(() => {
          const g = window.__remixGame;
          g.kc = false;
          window.head_state = "rook";
          window.head_color = "w";
          window.selectedFruit = 0;
          g.wa.ka[0].isPiece = true;
          g.wa.ka[0].ChessColor = "w";
          g.wa.ka[1].isPiece = true;
          g.wa.ka[1].ChessColor = "b";
          window.appleArray = g.wa.ka;
          window.capture_attempt(g.wa.ka[1].pos.x, g.wa.ka[1].pos.y);
          let fi = -1;
          for (let i = 0; i + 1 < g.wa.ka.length; i += 2) {
            if (!g.wa.ka[i].isPiece && !g.wa.ka[i + 1].isPiece) {
              fi = i;
              break;
            }
          }
          if (fi < 0) return { ok: false, reason: "pair" };
          const fruit = g.wa.ka[fi];
          const twin = g.wa.ka[fi + 1];
          g.nj = false;
          const head = g.oa.ka[0];
          g.oa.direction = "RIGHT";
          window.head_state = "OPEN";
          window.shield_empty_all && window.shield_empty_all();
          fruit.pos.x = head.x + 1;
          fruit.pos.y = head.y;
          g.tick();
          const afterFirst = {
            pieces: g.wa.ka.filter((a) => a.isPiece).length,
            fruits: g.wa.ka.filter((a) => !a.isPiece).length,
            kc: !!g.kc,
          };
          // Later fruit: unlock again and expect +2
          const pieces = g.wa.ka.filter((a) => a.isPiece);
          if (pieces.length < 2) return { ok: false, afterFirst, reason: "need pieces" };
          window.head_state = "rook";
          window.head_color = pieces[0].ChessColor;
          pieces[1].ChessColor = pieces[0].ChessColor === "w" ? "b" : "w";
          window.capture_attempt(pieces[1].pos.x, pieces[1].pos.y);
          fi = -1;
          for (let i = 0; i + 1 < g.wa.ka.length; i += 2) {
            if (!g.wa.ka[i].isPiece && !g.wa.ka[i + 1].isPiece) {
              fi = i;
              break;
            }
          }
          if (fi < 0) return { ok: false, afterFirst, reason: "pair2" };
          const fruit2 = g.wa.ka[fi];
          const before2 = g.wa.ka.filter((a) => a.isPiece).length;
          const head2 = g.oa.ka[0];
          fruit2.pos.x = head2.x + 1;
          fruit2.pos.y = head2.y;
          window.head_state = "OPEN";
          g.tick();
          return {
            ok: true,
            afterFirst,
            afterSecond: {
              pieces: g.wa.ka.filter((a) => a.isPiece).length,
              fruits: g.wa.ka.filter((a) => !a.isPiece).length,
              before: before2,
            },
          };
        });
        assert.equal(r.ok, true, JSON.stringify(r));
        assert.equal(r.afterFirst.kc, true, JSON.stringify(r));
        assert.equal(r.afterFirst.fruits, 0, JSON.stringify(r));
        assert.ok(
          r.afterFirst.pieces >= 20,
          "first bomb fruit should flood pieces: " + JSON.stringify(r)
        );
        assert.equal(r.afterSecond.fruits, 0, JSON.stringify(r));
        assert.equal(
          r.afterSecond.pieces,
          r.afterSecond.before + 2,
          "later bomb fruit +2: " + JSON.stringify(r)
        );
      } finally {
        await h.close();
      }
    }

    // Dice: last pair → 2R pieces (R in 1..6).
    {
      const h = await launchHarness({ seed: 72, headless: true });
      try {
        await h.start({ mode: "chess", count: COUNT.DICE, size: SIZE.NORMAL });
        await enableChessPortalBlender(h.page);
        const r = await h.page.evaluate(() => {
          const g = window.__remixGame;
          const rolls = [];
          const orig = Math.random;
          Math.random = () => 0.5; // ceil(0.5*6)=3 → 6 pieces
          try {
            window.head_state = "rook";
            window.head_color = "w";
            window.selectedFruit = 0;
            g.wa.ka[0].isPiece = true;
            g.wa.ka[0].ChessColor = "w";
            g.wa.ka[1].isPiece = true;
            g.wa.ka[1].ChessColor = "b";
            window.appleArray = g.wa.ka;
            window.capture_attempt(g.wa.ka[1].pos.x, g.wa.ka[1].pos.y);
            // Dice start-2 unlock should leave only the fruit pair.
            const onlyPair =
              g.wa.ka.length === 2 &&
              g.wa.ka.every((a) => a && !a.isPiece);
            let fi = 0;
            const fruit = g.wa.ka[fi];
            const twin = g.wa.ka[fi + 1];
            g.nj = false;
            const head = g.oa.ka[0];
            g.oa.direction = "RIGHT";
            window.head_state = "OPEN";
            window.shield_empty_all && window.shield_empty_all();
            fruit.pos.x = head.x + 1;
            fruit.pos.y = head.y;
            const twinPos = { x: twin.pos.x, y: twin.pos.y };
            g.tick();
            return {
              ok: true,
              onlyPair,
              teleported:
                g.oa.ka[0].x === twinPos.x && g.oa.ka[0].y === twinPos.y,
              fruits: g.wa.ka.filter((a) => !a.isPiece).length,
              pieces: g.wa.ka.filter((a) => a.isPiece).length,
            };
          } finally {
            Math.random = orig;
          }
        });
        assert.equal(r.ok, true, JSON.stringify(r));
        assert.equal(r.onlyPair, true, JSON.stringify(r));
        assert.equal(r.teleported, true, JSON.stringify(r));
        assert.equal(r.fruits, 0, JSON.stringify(r));
        assert.equal(r.pieces, 6, "2*R with R=3: " + JSON.stringify(r));
      } finally {
        await h.close();
      }
    }

    // Tally: empty after last pair → 10 pieces in 5 numbered pairs; unlock twin shares seq.
    {
      const h = await launchHarness({ seed: 73, headless: true });
      try {
        await h.start({ mode: "chess", count: COUNT.TALLY, size: SIZE.NORMAL });
        await enableChessPortalBlender(h.page);
        const r = await h.page.evaluate(() => {
          const g = window.__remixGame;
          // Leave a single opposite-color pair, unlock → fruit pair, eat → empty → wave.
          const a0 = g.wa.ka[0];
          const a1 = g.wa.ka[1];
          g.wa.ka.length = 0;
          g.wa.ka.push(a0, a1);
          a0.isPiece = true;
          a0.ChessColor = "w";
          a0.sequenceNumber = 3;
          a1.isPiece = true;
          a1.ChessColor = "b";
          a1.sequenceNumber = 3;
          window.head_state = "rook";
          window.head_color = "w";
          window.selectedFruit = 0;
          window.appleArray = g.wa.ka;
          window.capture_attempt(a1.pos.x, a1.pos.y);
          const fruits = g.wa.ka.filter((a) => !a.isPiece);
          const twinSeqMatch =
            fruits.length >= 2 &&
            fruits[0].sequenceNumber === fruits[1].sequenceNumber &&
            fruits[0].sequenceNumber === 3;
          g.wa.wa = 3;
          g.nj = false;
          const fi = g.wa.ka.findIndex((a) => !a.isPiece);
          const fruit = g.wa.ka[fi];
          const twin = g.wa.ka[fi % 2 === 0 ? fi + 1 : fi - 1];
          const head = g.oa.ka[0];
          g.oa.direction = "RIGHT";
          window.head_state = "OPEN";
          window.shield_empty_all && window.shield_empty_all();
          fruit.pos.x = head.x + 1;
          fruit.pos.y = head.y;
          g.tick();
          const seqs = g.wa.ka.map((a) => a.sequenceNumber);
          const pairSeqs = [];
          for (let i = 0; i + 1 < g.wa.ka.length; i += 2) {
            pairSeqs.push([g.wa.ka[i].sequenceNumber, g.wa.ka[i + 1].sequenceNumber]);
          }
          return {
            ok: true,
            twinSeqMatch,
            pieces: g.wa.ka.filter((a) => a.isPiece).length,
            fruits: g.wa.ka.filter((a) => !a.isPiece).length,
            seqs,
            pairSeqs,
            counter: g.wa.wa,
            allPieces: g.wa.ka.every((a) => a.isPiece),
          };
        });
        assert.equal(r.ok, true, JSON.stringify(r));
        assert.equal(r.twinSeqMatch, true, JSON.stringify(r));
        assert.equal(r.fruits, 0, JSON.stringify(r));
        assert.equal(r.pieces, 10, JSON.stringify(r));
        assert.equal(r.allPieces, true, JSON.stringify(r));
        assert.equal(r.pairSeqs.length, 5, JSON.stringify(r));
        for (const [a, b] of r.pairSeqs) {
          assert.equal(a, b, "pair shares seq: " + JSON.stringify(r));
        }
        assert.ok(
          r.seqs.includes(r.counter),
          "counter matches a wave seq: " + JSON.stringify(r)
        );
      } finally {
        await h.close();
      }
    }
  });
});
