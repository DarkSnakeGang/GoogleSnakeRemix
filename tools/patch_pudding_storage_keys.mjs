/**
 * Point vendored MorePudding settings + TimeKeeper storage at Remix-only keys
 * so saving in Remix (extra trophies/counts/speeds, Black Dice, etc.) never
 * overwrites plain PuddingMod's PuddingSettings / snake_timeKeeper.
 */
import fs from "fs";

const path = process.argv[2] || "MorePudding.js";
let code = fs.readFileSync(path, "utf8");
const before = code;

if (code.includes("RemixSettings") && code.includes("snake_timeKeeper_remix")) {
  console.log("already patched: Remix storage keys");
  process.exit(0);
}

const pairs = [
  ["PuddingSettings", "RemixSettings"],
  ["snake_timeKeeper", "snake_timeKeeper_remix"],
];

for (const [from, to] of pairs) {
  const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  const count = (code.match(re) || []).length;
  if (!count) {
    console.error("missing key to rewrite:", from);
    process.exit(1);
  }
  code = code.replace(re, to);
  console.log("rewrote", from, "→", to, "(" + count + ")");
}

if (code === before) {
  console.error("no file changes");
  process.exit(1);
}
fs.writeFileSync(path, code);
console.log("wrote", path);
