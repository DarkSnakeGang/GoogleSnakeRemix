import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

describe("patchcheck", () => {
  it("all Chess/Candy patch targets still match cached game code", () => {
    const r = spawnSync("node", ["tools/patchcheck.mjs"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    if (r.status !== 0) {
      console.log(r.stdout);
      console.error(r.stderr);
    }
    assert.equal(r.status, 0, r.stderr || r.stdout);
  });
});
