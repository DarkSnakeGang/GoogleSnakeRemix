import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

describe("candy/chess icons", () => {
  it("CandyInit and ChessInit use postimg icon URLs", () => {
    const candy = readFileSync(path.join(ROOT, "src", "CandyInit.js"), "utf8");
    const chess = readFileSync(path.join(ROOT, "src", "ChessInit.js"), "utf8");
    assert.match(candy, /i\.postimg\.cc\/rsSFx6gg\/candy\.png/);
    assert.match(chess, /i\.postimg\.cc\/ZqK0CB95\/bn\.png/);
  });

  it("deathscreen compares numeric settings.ob not padded string b", () => {
    const candy = readFileSync(path.join(ROOT, "src", "CandyInit.js"), "utf8");
    assert.match(candy, /a\.settings\.ob===window\.CANDY_MODE/);
    assert.match(candy, /a\.settings\.ob===window\.CHESS_MODE/);
  });
});
