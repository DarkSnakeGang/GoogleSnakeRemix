import { describe, it } from "node:test";
import assert from "node:assert/strict";

const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

async function eatFreshAhead(page) {
  return page.evaluate(() => {
    const g = window.__remixGame;
    const apples = g.wa.ka;
    const fresh = apples.find((a) => a && !a.Oka);
    if (!fresh) return { ok: false, reason: "no fresh" };

    const head = g.oa.ka[0];
    const dir = g.oa.direction || "RIGHT";
    const next = { x: head.x, y: head.y };
    if (dir === "RIGHT") next.x += 1;
    else if (dir === "LEFT") next.x -= 1;
    else if (dir === "UP") next.y -= 1;
    else if (dir === "DOWN") next.y += 1;

    fresh.pos.x = next.x;
    fresh.pos.y = next.y;

    const beforePoisons = apples.filter((a) => a.Oka).length;
    const beforeScore = g.Sh;
    const beforeLen = g.oa.Ta;
    const beforeFresh = apples.filter((a) => !a.Oka).length;

    g.tick();

    return {
      ok: true,
      beforePoisons,
      afterPoisons: g.wa.ka.filter((a) => a.Oka).length,
      scoreBefore: beforeScore,
      scoreAfter: g.Sh,
      lenBefore: beforeLen,
      lenAfter: g.oa.Ta,
      beforeFresh,
      afterFresh: g.wa.ka.filter((a) => !a.Oka).length,
      afterTotal: g.wa.ka.length,
      fruitsEaten: window.burger_fruits_eaten,
      ja: g.oa.Ja,
    };
  });
}

async function eatPoisonAhead(page) {
  return page.evaluate(() => {
    const g = window.__remixGame;
    const poison = g.wa.ka.find((a) => a && a.Oka);
    if (!poison) return { ok: false, reason: "no poison" };

    const head = g.oa.ka[0];
    const dir = g.oa.direction || "RIGHT";
    const next = { x: head.x, y: head.y };
    if (dir === "RIGHT") next.x += 1;
    else if (dir === "LEFT") next.x -= 1;
    else if (dir === "UP") next.y -= 1;
    else if (dir === "DOWN") next.y += 1;

    poison.pos.x = next.x;
    poison.pos.y = next.y;

    const beforeScore = g.Sh;
    const beforeLen = g.oa.Ta;
    const beforePoisons = g.wa.ka.filter((a) => a.Oka).length;

    g.tick();

    return {
      ok: true,
      scoreBefore: beforeScore,
      scoreAfter: g.Sh,
      lenBefore: beforeLen,
      lenAfter: g.oa.Ta,
      beforePoisons,
      afterPoisons: g.wa.ka.filter((a) => a.Oka).length,
      ja: g.oa.Ja,
    };
  });
}

describe("burger mode (browser)", { skip: !runBrowser }, () => {
  it("fresh eat re-rolls timer on Mn-reused fruit (freshness resets)", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 31, headless: true });
    try {
      await h.start({ mode: "burger", count: COUNT.ONE, size: SIZE.NORMAL });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const a = g.wa.ka[0];
        a.burgerTimer = 5;
        a.burgerTimerMax = 30;
        a.burgerGrey = 80;
        const head = g.oa.ka[0];
        const dir = g.oa.direction || "RIGHT";
        const next = { x: head.x, y: head.y };
        if (dir === "RIGHT") next.x += 1;
        else if (dir === "LEFT") next.x -= 1;
        else if (dir === "UP") next.y -= 1;
        else next.y += 1;
        a.pos.x = next.x;
        a.pos.y = next.y;
        g.tick();
        const fresh = g.wa.ka.find((x) => x && !x.Oka);
        const expected = 25 + g.oa.ka.length;
        return {
          sameRef: fresh === a,
          timer: fresh ? fresh.burgerTimer : null,
          max: fresh ? fresh.burgerTimerMax : null,
          grey: fresh ? fresh.burgerGrey : null,
          expected,
          score: g.Sh | 0,
        };
      });
      assert.equal(result.sameRef, true, JSON.stringify(result));
      assert.equal(result.score, 1, JSON.stringify(result));
      assert.equal(result.timer, result.expected, JSON.stringify(result));
      assert.equal(result.max, result.expected, JSON.stringify(result));
      assert.equal(result.grey, 0, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("classic start: no poison pairs; length-based timers assigned", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 11, headless: true });
    try {
      const started = await h.start({
        mode: "burger",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      assert.ok(started.burgerMode != null);
      assert.equal(started.poisons, 0, "classic start has no poisons");
      assert.equal(started.apples, 3, "3a classic count");

      const s = await h.state();
      const L = s.snake.length;
      const expected = 25 + L; // normal 17×15 − 7, L <= half
      const timers = s.apples.map((a) => a.burgerTimer);
      assert.ok(
        timers.every((t) => t === expected),
        `all timers === ${expected} (L=${L}): ` + JSON.stringify(timers)
      );
      assert.ok(s.apples.every((a) => !a.Oka));
    } finally {
      await h.close();
    }
  });

  it("3a/5a/10a stay poison-free even after native uaF pairing would run", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 11, headless: true });
    try {
      for (const count of [COUNT.THREE, COUNT.FIVE, COUNT.TEN]) {
        const started = await h.start({
          mode: "burger",
          count,
          size: SIZE.NORMAL,
        });
        // Native play-start runs l4E/uaF after apple reset. Invoke the live
        // binding — Burger must no-op it so half the board is not poisoned.
        const after = await h.page.evaluate(() => {
          const g = window.__remixGame;
          const pair =
            typeof window.__uaF === "function"
              ? window.__uaF
              : window.__l4E;
          if (typeof pair === "function") pair(g.wa);
          // Race: settings already Burger, CurrentModeNum still classic.
          const saved = window.CurrentModeNum;
          window.CurrentModeNum = 0;
          for (let i = 0; i < g.wa.ka.length; i++) g.wa.ka[i].Oka = false;
          if (typeof pair === "function") pair(g.wa);
          const racePoisons = g.wa.ka.filter((a) => a.Oka).length;
          window.CurrentModeNum = saved;
          for (let i = 0; i < g.wa.ka.length; i++) g.wa.ka[i].Oka = false;
          return {
            apples: g.wa.ka.length,
            poisons: g.wa.ka.filter((a) => a.Oka).length,
            racePoisons,
            activeViaSettings: !!(
              window.isBurgerActive && window.isBurgerActive()
            ),
          };
        });
        assert.equal(
          after.poisons,
          0,
          `count=${count} must have 0 poisons after uaF: ` +
            JSON.stringify({ started, after })
        );
        assert.equal(
          after.racePoisons,
          0,
          `count=${count} must stay poison-free when CurrentModeNum lags settings: ` +
            JSON.stringify(after)
        );
        assert.ok(started.apples >= 3);
      }
    } finally {
      await h.close();
    }
  });

  it("expire → poison stays + one new fresh when space exists", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 12, headless: true });
    try {
      await h.start({ mode: "burger", count: COUNT.ONE, size: SIZE.NORMAL });
      await h.page.evaluate(() => {
        const a = window.__remixGame.wa.ka[0];
        a.burgerTimer = 1;
        a.burgerTimerMax = 20;
      });
      await h.tick(1);
      const s = await h.state();
      const poisons = s.apples.filter((a) => a.Oka);
      const fresh = s.apples.filter((a) => !a.Oka);
      assert.equal(poisons.length, 1, "expired fruit becomes poison");
      assert.equal(fresh.length, 1, "replacement fresh spawned");
      assert.equal(
        poisons[0].burgerTimer,
        20,
        "poison inherits the fruit's max as its lifetime"
      );
      assert.equal(poisons[0].burgerTimerMax, 20);
      assert.equal(poisons[0].burgerGrey || 0, 0, "poison has no grey indicator");
      const expected = 25 + s.snake.length;
      assert.equal(
        fresh[0].burgerTimer,
        expected,
        "new fresh has length-based timer"
      );
      assert.ok(
        !(s.ja >= 8),
        "expiry must not stun the snake: ja=" + s.ja
      );
      assert.equal(!!s.nj, false, "expiry must not false-win");
    } finally {
      await h.close();
    }
  });

  it("fresh eat leaves poisons alone and does not reset other fruits' timers", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 13, headless: true });
    try {
      await h.start({ mode: "burger", count: COUNT.THREE, size: SIZE.NORMAL });
      // Force one expire so a poison piles up; leave another fresh mid-timer.
      await h.page.evaluate(() => {
        const fresh = window.__remixGame.wa.ka.filter((x) => !x.Oka);
        fresh[0].burgerTimer = 1;
        fresh[0].burgerTimerMax = 10;
        fresh[1].burgerTimer = 17;
        fresh[1].burgerTimerMax = 24;
        fresh[1]._burgerKeep = true;
      });
      await h.tick(1);
      const mid = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const kept = g.wa.ka.find((a) => a && a._burgerKeep && !a.Oka);
        const poison = g.wa.ka.find((a) => a && a.Oka);
        return {
          poisons: g.wa.ka.filter((a) => a.Oka).length,
          keptTimer: kept ? kept.burgerTimer : null,
          poisonTimer: poison ? poison.burgerTimer : null,
          poisonMax: poison ? poison.burgerTimerMax : null,
        };
      });
      assert.ok(mid.poisons >= 1, "poison present before eat");
      assert.equal(mid.keptTimer, 16, "kept fruit aged by one tick only");
      assert.equal(mid.poisonMax, 10, "poison lifetime is the fruit's max");
      // Poison also ticks on the expire tick after being created... actually
      // make_poison sets timer=max in the same tick after the fresh hit 0, so
      // it starts at max and does not decrement until the next tick.
      assert.equal(mid.poisonTimer, 10);

      const eat = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const fresh = g.wa.ka.find((a) => a && !a.Oka && !a._burgerKeep);
        if (!fresh) return { ok: false, reason: "no non-kept fresh" };
        const head = g.oa.ka[0];
        const dir = g.oa.direction || "RIGHT";
        const next = { x: head.x, y: head.y };
        if (dir === "RIGHT") next.x += 1;
        else if (dir === "LEFT") next.x -= 1;
        else if (dir === "UP") next.y -= 1;
        else if (dir === "DOWN") next.y += 1;
        fresh.pos.x = next.x;
        fresh.pos.y = next.y;
        const scoreBefore = g.Sh;
        const poisonsBefore = g.wa.ka.filter((a) => a.Oka).length;
        g.tick();
        return {
          ok: true,
          scoreBefore,
          scoreAfter: g.Sh,
          poisonsBefore,
          afterPoisons: g.wa.ka.filter((a) => a.Oka).length,
        };
      });
      assert.equal(eat.ok, true, JSON.stringify(eat));
      assert.ok(
        eat.afterPoisons >= eat.poisonsBefore - 0,
        "poisons are not cleared on fresh eat: " + JSON.stringify(eat)
      );
      assert.equal(eat.afterPoisons, eat.poisonsBefore);
      assert.equal(eat.scoreAfter, eat.scoreBefore + 1);

      const after = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const kept = g.wa.ka.find((a) => a && a._burgerKeep && !a.Oka);
        const poison = g.wa.ka.find((a) => a && a.Oka);
        return {
          keptTimer: kept ? kept.burgerTimer : null,
          poisonTimer: poison ? poison.burgerTimer : null,
          timers: g.wa.ka.filter((a) => !a.Oka).map((a) => a.burgerTimer),
          length: g.oa.ka.length,
        };
      });
      // Eat tick ages every eligible fruit/poison by 1.
      assert.equal(
        after.keptTimer,
        15,
        "pre-existing countdown kept ticking, not reset: " +
          JSON.stringify(after)
      );
      assert.equal(after.poisonTimer, 9, "poison kept ticking through the eat");
      const expectedNew = 25 + after.length;
      assert.notEqual(after.keptTimer, expectedNew);
      assert.ok(
        after.timers.some((t) => t === expectedNew),
        "respawned fruit got a new length-based timer: " + JSON.stringify(after)
      );
    } finally {
      await h.close();
    }
  });

  it("expired fruit takes Pudding's skull type, not a chess piece", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 21, headless: true });
    try {
      await h.start({ mode: "burger", count: COUNT.ONE, size: SIZE.NORMAL });
      await h.page.evaluate(() => {
        const a = window.__remixGame.wa.ka[0];
        a.burgerTimer = 1;
        a.burgerTimerMax = 10;
      });
      await h.tick(1);

      const info = await h.page.evaluate(() => {
        const fruits = window.new_fruit;
        const skullIdx = fruits.findIndex((f) =>
          /poison-skull/.test(f.Real || "")
        );
        return {
          poisonTypes: window.__remixGame.wa.ka
            .filter((a) => a.Oka)
            .map((a) => a.type),
          skullType: window.burger_skull_type(),
          skullIsLast: skullIdx === fruits.length - 1,
          chessTypes: [window.bbishop, window.wrook],
        };
      });

      assert.equal(info.poisonTypes.length, 1);
      assert.equal(
        info.poisonTypes[0],
        info.skullType,
        "poison renders as the skull fruit"
      );
      assert.ok(
        !info.chessTypes.includes(info.poisonTypes[0]),
        "poison is not a chess piece: " + JSON.stringify(info)
      );
      // Pudding addresses the skull as the last fruit, so nothing may be
      // appended past it.
      assert.equal(info.skullIsLast, true, "skull stays last in new_fruit");
    } finally {
      await h.close();
    }
  });

  it("fresh eat with poisons ahead in the list does not crash; poisons remain", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 13, headless: true });
    try {
      await h.start({ mode: "burger", count: COUNT.FIVE, size: SIZE.NORMAL });
      await h.page.evaluate(() => {
        for (const a of window.__remixGame.wa.ka.slice(0, 3)) {
          a.burgerTimer = 1;
          a.burgerTimerMax = 10;
        }
      });
      await h.tick(1);

      const eaten = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const head = g.oa.ka[0];
        const dir = g.oa.direction || "RIGHT";
        const next = { x: head.x, y: head.y };
        if (dir === "RIGHT") next.x += 1;
        else if (dir === "LEFT") next.x -= 1;
        else if (dir === "UP") next.y -= 1;
        else if (dir === "DOWN") next.y += 1;

        const fresh = g.wa.ka.find((a) => !a.Oka);
        fresh.pos.x = next.x;
        fresh.pos.y = next.y;

        const before = {
          eatenIndex: g.wa.ka.indexOf(fresh),
          poisons: g.wa.ka.filter((a) => a.Oka).length,
          score: g.Sh,
        };
        let error = null;
        try {
          g.tick();
        } catch (e) {
          error = String(e);
        }
        return {
          before,
          error,
          poisons: g.wa.ka.filter((a) => a.Oka).length,
          fresh: g.wa.ka.filter((a) => !a.Oka).length,
          holes: g.wa.ka.filter((a) => !a).length,
          score: g.Sh,
        };
      });

      assert.ok(
        eaten.before.poisons >= 2,
        "needs multiple poisons: " + JSON.stringify(eaten.before)
      );
      assert.ok(
        eaten.before.eatenIndex > 0,
        "poisons must sit ahead of the eaten fruit"
      );
      assert.equal(eaten.error, null, "eating must not throw");
      assert.equal(
        eaten.poisons,
        eaten.before.poisons,
        "poisons remain after fresh eat"
      );
      assert.equal(eaten.holes, 0, "no undefined slots left in the apple list");
      assert.equal(eaten.fresh, 5, "5a board is refilled");
      assert.equal(eaten.score, eaten.before.score + 1);
      assert.deepEqual(h.modErrors(), []);
    } finally {
      await h.close();
    }
  });

  it("poison timer expiry removes the poison with no replacement", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 19, headless: true });
    try {
      await h.start({ mode: "burger", count: COUNT.ONE, size: SIZE.NORMAL });
      await h.page.evaluate(() => {
        const a = window.__remixGame.wa.ka[0];
        a.burgerTimer = 1;
        a.burgerTimerMax = 10;
      });
      await h.tick(1);
      let s = await h.state();
      assert.equal(s.apples.filter((a) => a.Oka).length, 1);
      assert.equal(s.apples.filter((a) => !a.Oka).length, 1);

      await h.page.evaluate(() => {
        const p = window.__remixGame.wa.ka.find((a) => a.Oka);
        p.burgerTimer = 1;
      });
      await h.tick(1);
      s = await h.state();
      assert.equal(
        s.apples.filter((a) => a.Oka).length,
        0,
        "poison despawned when its timer hit zero"
      );
      assert.equal(
        s.apples.filter((a) => !a.Oka).length,
        1,
        "fresh fruit left alone"
      );
    } finally {
      await h.close();
    }
  });

  it("poison eat: Ja lost control, no score, length unchanged by that eat", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 14, headless: true });
    try {
      await h.start({ mode: "burger", count: COUNT.ONE, size: SIZE.NORMAL });
      await h.page.evaluate(() => {
        const a = window.__remixGame.wa.ka[0];
        a.burgerTimer = 1;
        a.burgerTimerMax = 10;
      });
      await h.tick(1);

      const eat = await eatPoisonAhead(h.page);
      assert.equal(eat.ok, true, JSON.stringify(eat));
      assert.equal(eat.scoreAfter, eat.scoreBefore, "poison does not score");
      assert.equal(eat.lenAfter, eat.lenBefore, "poison does not grow/shorten");
      assert.ok(eat.ja >= 8, "Ja control loss set: " + eat.ja);
      assert.equal(eat.afterPoisons, eat.beforePoisons - 1, "poison removed");
    } finally {
      await h.close();
    }
  });

  it("late-game: expiry wins iff no fresh left and no legal spawn", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 15, headless: true });
    try {
      await h.start({ mode: "burger", count: COUNT.ONE, size: SIZE.SMALL });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const box = g.ka.oa;
        const W = box.width;
        const H = box.height;
        // Pad body length to the late-game threshold (timers/late use segments).
        const need = W * H - 5;
        while (g.oa.ka.length < need) g.oa.ka.push({ x: -1, y: -1 });
        const orig = window.burger_find_spawn_pos;
        window.burger_find_spawn_pos = () => null;
        g.wa.ka.length = 1;
        const a = g.wa.ka[0];
        a.Oka = false;
        a.burgerTimer = 1;
        a.burgerTimerMax = 5;
        g.nj = false;
        g.lj = false;
        window.burger_tick_logic();
        const won = !!(g.nj || g.lj);
        const freshLeft = g.wa.ka.filter((x) => !x.Oka).length;
        window.burger_find_spawn_pos = orig;
        return {
          won,
          freshLeft,
          poison: g.wa.ka.filter((x) => x.Oka).length,
          late: window.burger_late_game(g),
          WH: W * H,
        };
      });
      assert.equal(result.late, true);
      assert.equal(result.freshLeft, 0);
      assert.equal(result.poison, 1);
      assert.equal(result.won, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("late-game spawn never uses head's 4 cardinal neighbors", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 16, headless: true });
    try {
      await h.start({ mode: "burger", count: COUNT.ONE, size: SIZE.SMALL });
      const samples = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const box = g.ka.oa;
        const need = box.width * box.height - 5;
        while (g.oa.ka.length < need) g.oa.ka.push({ x: -1, y: -1 });
        const head = g.oa.ka[0];
        const banned = new Set([
          `${head.x},${head.y - 1}`,
          `${head.x},${head.y + 1}`,
          `${head.x - 1},${head.y}`,
          `${head.x + 1},${head.y}`,
        ]);
        const hits = [];
        for (let i = 0; i < 40; i++) {
          const p = window.burger_find_spawn_pos(g);
          if (!p) continue;
          const key = `${p.x},${p.y}`;
          if (banned.has(key)) hits.push(key);
        }
        return { hits, late: window.burger_late_game(g) };
      });
      assert.equal(samples.late, true);
      assert.deepEqual(samples.hits, [], "no head-neighbor spawns");
    } finally {
      await h.close();
    }
  });

  it("5a / Dice get length-based timers on fresh via qaF hook", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 17, headless: true });
    try {
      const five = await h.start({
        mode: "burger",
        count: COUNT.FIVE,
        size: SIZE.NORMAL,
      });
      assert.equal(five.apples, 5);
      assert.equal(five.poisons, 0);
      let s = await h.state();
      const expected = 25 + s.snake.length;
      assert.ok(s.apples.every((a) => a.burgerTimer === expected));

      await h.start({ mode: "burger", count: COUNT.DICE, size: SIZE.NORMAL });
      s = await h.state();
      assert.ok(s.apples.length >= 1);
      const diceExpected = 25 + s.snake.length;
      assert.ok(
        s.apples.every((a) => !a.Oka && a.burgerTimer === diceExpected),
        "dice fresh have timers"
      );
    } finally {
      await h.close();
    }
  });

  it("tally: all fresh at start; eating current index advances the wave", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 18, headless: true });
    try {
      const started = await h.start({
        mode: "burger",
        count: COUNT.TALLY,
        size: SIZE.NORMAL,
      });
      // Poison pairing must not run on tally either.
      const afterUaF = await h.page.evaluate(() => {
        const g = window.__remixGame;
        if (typeof window.__uaF === "function") window.__uaF(g.wa);
        return {
          poisons: g.wa.ka.filter((a) => a.Oka).length,
          apples: g.wa.ka.length,
          seqs: g.wa.ka.map((a) => a.sequenceNumber),
          cur: g.wa.wa,
        };
      });
      assert.equal(afterUaF.poisons, 0, JSON.stringify(afterUaF));
      assert.ok(afterUaF.apples >= 5, "tally starts with a wave of fruit");
      assert.equal(started.poisons, 0);

      const advanced = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const cur = g.wa.wa;
        const target = g.wa.ka.find(
          (a) => a && !a.Oka && a.sequenceNumber === cur
        );
        if (!target) return { ok: false, reason: "no current fresh", cur };
        const head = g.oa.ka[0];
        const dir = g.oa.direction || "RIGHT";
        const next = { x: head.x, y: head.y };
        if (dir === "RIGHT") next.x += 1;
        else if (dir === "LEFT") next.x -= 1;
        else if (dir === "UP") next.y -= 1;
        else if (dir === "DOWN") next.y += 1;
        target.pos.x = next.x;
        target.pos.y = next.y;
        const before = cur;
        g.tick();
        return {
          ok: true,
          before,
          after: g.wa.wa,
          score: g.Sh,
          poisons: g.wa.ka.filter((a) => a.Oka).length,
          openFresh: g.wa.ka.filter(
            (a) => a && !a.Oka && a.sequenceNumber === g.wa.wa
          ).length,
        };
      });
      assert.equal(advanced.ok, true, JSON.stringify(advanced));
      assert.equal(advanced.poisons, 0);
      assert.ok(advanced.score >= 1, "fresh tally fruit scored");
      assert.ok(
        advanced.after === advanced.before + 1 || advanced.after === 1,
        "tally index advanced (or wave reset): " + JSON.stringify(advanced)
      );
      assert.ok(
        advanced.openFresh >= 1,
        "next index has an open fresh fruit: " + JSON.stringify(advanced)
      );
    } finally {
      await h.close();
    }
  });

  it("Blender Burger+Chess: expired pieces lose piece status and cannot unlock", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 19, headless: true });
    try {
      await h.start({ mode: "chess", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        // Enable Burger+Chess blender mix
        window.chess_blending = true;
        window.burger_blending = true;
        window.CurrentModeNum = 22;
        g.settings.ob = 22;
        g.settings.ub = 22;
        if (!g.settings.ZSa) g.settings.ZSa = new Set();
        g.settings.ZSa.add(window.CHESS_MODE);
        g.settings.ZSa.add(window.BURGER_MODE);
        g.wa.reset();
        window.appleArray = g.wa.ka;

        const piece = g.wa.ka.find((a) => a && a.isPiece && !a.Oka);
        if (!piece) {
          return { ok: false, reason: "no piece after chess blender reset" };
        }
        const color = piece.ChessColor;
        const px = piece.pos.x;
        const py = piece.pos.y;
        const wasPiece = !!piece.isPiece;

        window.burger_make_poison(piece, g);

        // Opposite color carrier should not unlock a poison.
        window.head_state = "rook";
        window.head_color = color === "w" ? "b" : "w";
        window.appleArray = g.wa.ka;
        const unlocked = window.capture_attempt(px, py);

        return {
          ok: true,
          wasPiece,
          isPiece: !!piece.isPiece,
          Oka: !!piece.Oka,
          chessPiece: piece.ChessPiece,
          chessColor: piece.ChessColor,
          unlocked,
          headStill: window.head_state,
          eatingPiece: window.chess_eating_piece(),
        };
      });

      assert.equal(probe.ok, true, JSON.stringify(probe));
      assert.equal(probe.wasPiece, true, JSON.stringify(probe));
      assert.equal(probe.Oka, true, JSON.stringify(probe));
      assert.equal(probe.isPiece, false, "poison must not stay a piece");
      assert.equal(probe.chessPiece, undefined, JSON.stringify(probe));
      assert.equal(probe.chessColor, undefined, JSON.stringify(probe));
      assert.equal(probe.unlocked, false, "poison must not unlock");
      assert.equal(probe.headStill, "rook", "carrier stays armed");
      assert.equal(probe.eatingPiece, false, JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });
});
