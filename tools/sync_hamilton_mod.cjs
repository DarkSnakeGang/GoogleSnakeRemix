/**
 * Sync vendored src/HamiltonMod.js from sibling GoogleSnakeWallSolver.
 * Usage: node tools/sync_hamilton_mod.cjs
 */
const fs = require("fs");
const path = require("path");
const base = path.join(__dirname, "..");
const src = path.join(base, "..", "GoogleSnakeWallSolver", "HamiltonMod.js");
const dest = path.join(base, "src", "HamiltonMod.js");
if (!fs.existsSync(src)) {
  console.error("missing", src);
  process.exit(1);
}
const header =
  "/* Vendored from GoogleSnakeWallSolver/HamiltonMod.js - sync: node tools/sync_hamilton_mod.cjs */\n";
const body = fs.readFileSync(src, "utf8").replace(/^\uFEFF/, "");
const stripped = body.replace(
  /^\/\* Vendored from GoogleSnakeWallSolver[\s\S]*?\*\/\r?\n/,
  ""
);
fs.writeFileSync(dest, header + stripped);
console.log("wrote", dest, fs.statSync(dest).size);
