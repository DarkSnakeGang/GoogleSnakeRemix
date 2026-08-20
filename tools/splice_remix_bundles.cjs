/**
 * Rebuild RemixMod.js / RemixUltraMod.js from local parts without re-download.
 * Uses existing MorePudding.js / MorePudding.ultra.js / LevelEditorInit.js.
 */
const fs = require("fs");
const path = require("path");
const base = path.join(__dirname, "..");

const REMIX_PARTS = [
  "CandyInit.js",
  "ChessInit.js",
  "BurgerInit.js",
  "CatSpeedInit.js",
  "DiceCountsInit.js",
  "CustomSettingsInit.js",
  "CustomSizeInit.js",
  "CustomColorsInit.js",
  "CustomSpeedsInit.js",
  "RemixSpeedInfoInit.js",
  "CspMenuIcons.js",
  "PauseInit.js",
  "RemixInit.js",
];

function concat(outName, parts) {
  const out = path.join(base, outName);
  let body = "";
  for (const name of parts) {
    const p = path.join(base, name);
    if (!fs.existsSync(p)) throw new Error("missing " + name);
    console.log("append", name);
    body += fs.readFileSync(p, "utf8") + "\n";
  }
  fs.writeFileSync(out, body);
  console.log("wrote", outName, body.length);
}

const more = path.join(base, "MorePudding.js");
const moreUltra = path.join(base, "MorePudding.ultra.js");
const le = path.join(base, "LevelEditorInit.js");
if (!fs.existsSync(more)) throw new Error("MorePudding.js missing — run RemixBuilder.py");
if (!fs.existsSync(moreUltra)) throw new Error("MorePudding.ultra.js missing");
if (!fs.existsSync(le)) throw new Error("LevelEditorInit.js missing");

concat("RemixMod.js", ["MorePudding.js", ...REMIX_PARTS]);
concat("RemixUltraMod.js", [
  "MorePudding.ultra.js",
  ...REMIX_PARTS,
  "LevelEditorInit.js",
  "UltraPresetImages.js",
  "UltraPresetLevels.js",
  "UltraPlaceInit.js",
  "UltraInit.js",
]);
console.log("done");
