import { describe, it } from "node:test";
import assert from "node:assert/strict";

/** Mirrors BurgerInit burger_timer_roll / burger_late_game formulas. */
function timerRoll(width, height, snakeLength) {
  const base = width + height - 7;
  const half = Math.floor((width * height) / 2);
  const L = snakeLength | 0;
  const delta = L <= half ? L : 2 * half - L;
  return Math.max(1, base + delta);
}

function lateGame(L, width, height) {
  return L >= width * height - 5;
}

function updateGrey(timer, timerMax) {
  if (!(timerMax > 0)) return 0;
  const elapsed = Math.max(0, timerMax - Math.max(0, timer | 0));
  const stepped = Math.floor(elapsed / 3) * 3;
  if (stepped <= 0) return 0;
  return Math.min(100, Math.floor((stepped / timerMax) * 100));
}

describe("burger formulas (offline)", () => {
  it("small 10×9: base 12 (−7), +1 with length until half board, then −1", () => {
    assert.equal(timerRoll(10, 9, 0), 12);
    assert.equal(timerRoll(10, 9, 1), 13);
    const half = Math.floor((10 * 9) / 2); // 45
    assert.equal(timerRoll(10, 9, half), 12 + half);
    assert.equal(timerRoll(10, 9, half + 1), 12 + half - 1);
    assert.equal(timerRoll(10, 9, half + 5), 12 + half - 5);
  });

  it("normal 17×15: base 25 (−7), peaks at half board, then declines", () => {
    assert.equal(timerRoll(17, 15, 0), 25);
    assert.equal(timerRoll(17, 15, 4), 29);
    const half = Math.floor((17 * 15) / 2); // 127
    assert.equal(timerRoll(17, 15, half), 25 + half);
    assert.equal(timerRoll(17, 15, half + 10), 25 + half - 10);
  });

  it("large 24×21: base 38 (−7)", () => {
    assert.equal(timerRoll(24, 21, 0), 38);
    assert.equal(timerRoll(24, 21, 10), 48);
  });

  it("never returns below 1", () => {
    assert.equal(timerRoll(10, 9, 1000), 1);
  });

  it("late-game at L >= W*H - 5", () => {
    assert.equal(lateGame(84, 10, 9), false);
    assert.equal(lateGame(85, 10, 9), true);
  });

  it("greyscale cache steps every 3 ticks and stays 0 until then", () => {
    assert.equal(updateGrey(20, 20), 0);
    assert.equal(updateGrey(19, 20), 0);
    assert.equal(updateGrey(18, 20), 0);
    assert.equal(updateGrey(17, 20), 15); // elapsed 3 → 3/20
    assert.equal(updateGrey(14, 20), 30); // elapsed 6
  });
});
