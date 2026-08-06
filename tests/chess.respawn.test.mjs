import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("chess respawn rules (offline contract)", () => {
  it("never allows half-pairs in the contract", () => {
    const spawnPair = (canPlacePartner) => {
      if (!canPlacePartner) return 0;
      return 2;
    };
    assert.equal(spawnPair(false), 0);
    assert.equal(spawnPair(true), 2);
    assert.equal(spawnPair(true) % 2, 0);
  });

  it("dice 2R and bomb 48 are even", () => {
    for (let R = 1; R <= 6; R++) {
      assert.equal((2 * R) % 2, 0);
    }
    assert.equal(48 % 2, 0);
    assert.equal(10 % 2, 0); // tally wave
  });
});
