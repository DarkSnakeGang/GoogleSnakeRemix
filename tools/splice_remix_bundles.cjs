/**
 * Rebuild RemixMod.js / RemixUltraMod.js from local parts without re-download.
 * Uses existing MorePudding.js / MorePudding.ultra.js / LevelEditorInit.js.
 */
const fs = require("fs");
const path = require("path");
const base = path.join(__dirname, "..");

const REMIX_PARTS = [
  "src/CandyInit.js",
  "src/ChessInit.js",
  "src/BurgerInit.js",
  "src/CatInit.js",
  "src/MexicoInit.js",
  "src/BombFruitInit.js",
  "src/TempWallsInit.js",
  "src/FearInit.js",
  "src/SlotMachineInit.js",
  "src/CatSpeedInit.js",
  "src/DiceCountsInit.js",
  "src/ClusterCountInit.js",
  "src/CustomSettingsInit.js",
  "src/CustomSizeInit.js",
  "src/CustomColorsInit.js",
  "src/CustomSpeedsInit.js",
  "src/PacmanGhostUris.js",
  "src/CatFruitUris.js",
  "src/CustomFruitPresets.js",
  "src/CustomFruitInit.js",
  "src/HamiltonMod.js",
  "src/HamiltonInit.js",
  "src/RemixSpeedInfoInit.js",
  "src/CspMenuIcons.js",
  "src/PauseInit.js",
  "src/RemixInit.js",
];

const ULTRA_PARTS = [
  ...REMIX_PARTS,
  "LevelEditorInit.js",
  "src/UltraPresetImages.js",
  "src/UltraPresetLevels.js",
  "src/UltraPlaceInit.js",
  "src/AnimationModInit.js",
  "src/UltraInit.js",
];

const FEAR_ASSET_TOKENS = {
  __FEAR_MODE_ICON__: "assets/fear-mode-icon.png",
  __FEAR_GHOST_NORMAL__: "assets/fear-ghost-normal.png",
  __FEAR_GHOST_PIXEL__: "assets/fear-ghost-pixel.png",
  __FEAR_GHOST_REAL__: "assets/fear-ghost-real.png",
};

function inlineAssetTokens(text) {
  for (const [token, relative] of Object.entries(FEAR_ASSET_TOKENS)) {
    if (!text.includes(token)) continue;
    const encoded = fs.readFileSync(path.join(base, relative)).toString("base64");
    text = text.split(token).join("data:image/png;base64," + encoded);
  }
  return text;
}

function concat(outName, parts) {
  const out = path.join(base, outName);
  let body = "";
  for (const name of parts) {
    const p = path.join(base, name);
    if (!fs.existsSync(p)) throw new Error("missing " + name);
    console.log("append", name);
    body += inlineAssetTokens(fs.readFileSync(p, "utf8")) + "\n";
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
concat("RemixUltraMod.js", ["MorePudding.ultra.js", ...ULTRA_PARTS]);
console.log("done");
