/**
 * Patch vendored MorePudding.js so Chess/Burger (CE level modes) count as
 * High Score modes for SpeedInfo SRC rows + submit links.
 *
 * Mode trophy indices are runtime (window.CHESS_MODE / BURGER_MODE), so the
 * patch checks those globals rather than hardcoding ids.
 */
import fs from "fs";

const path = process.argv[2] || "MorePudding.js";
let code = fs.readFileSync(path, "utf8");
const before = code;
const nl = code.includes("\r\n") ? "\r\n" : "\n";

function block(lines) {
  return lines.join(nl);
}

if (code.includes("function remixCeLevelName(mode)")) {
  console.log("already patched");
  process.exit(0);
}

const canShowRe =
  /function canShowSrcHighscore\(mode, count\) \{\r?\n(?:.*\r?\n)*?        return false;\r?\n    \}/;

const canShowMatch = code.match(canShowRe);
if (!canShowMatch) {
  console.error("canShowSrcHighscore pattern not found");
  process.exit(1);
}

code = code.replace(
  canShowRe,
  block([
    "function canShowSrcHighscore(mode, count) {",
    "        if (mode === 21 || mode === 22) return false; // Peaceful, Blender",
    "        if (TYPICAL_HIGHSCORE_MODES[mode]) return true;",
    "        if (count === TALLY_COUNT && TALLY_CE_HIGHSCORE_MODES[mode]) return true;",
    "        // Remix CE levels (Chess/Burger) — full HS boards on snake_game_ce",
    "        if (window.CHESS_MODE != null && mode === window.CHESS_MODE) return true;",
    "        if (window.BURGER_MODE != null && mode === window.BURGER_MODE) return true;",
    "        return false;",
    "    }",
  ])
);
console.log("patched canShowSrcHighscore");

const marker = 'const CE_MODE_VAR = "onvxz158";';
if (!code.includes(marker)) {
  console.error("CE_MODE_VAR marker not found");
  process.exit(1);
}

const ceLevelBlock = block([
  'const CE_MODE_VAR = "onvxz158";',
  "",
  "    // Remix / Category Extensions level boards (Chess, Burger)",
  '    const CE_LEVEL_BY_MODE_NAME = { Chess: "d1j51lyd", Burger: "wkk1rmqw" };',
  '    const CE_LEVEL_HS_CATEGORY = "8243lxgd";',
  "    const CE_LEVEL_IL_CATEGORY = {",
  '        "25": "02qm9qzd",',
  '        "50": "824jly32",',
  '        "100": "9d8eo7qd",',
  '        "ALL": "xd14168d",',
  '        "All": "xd14168d",',
  "    };",
  '    const CE_LEVEL_COUNT_VAR = "onvjo65n";',
  "    const CE_LEVEL_COUNT_VAL = {",
  '        0: "z19m7kyl", // 1 Apple',
  '        1: "p12d3pdq", // 3 Apples',
  '        2: "81pp82v1", // 5 Apples',
  '        3: "1gn6g6nl", // 10a',
  '        4: "1399n3x1", // Dice',
  '        5: "qznw4wgq", // Bomb',
  '        6: "lr3d7djl", // Tally',
  "    };",
  '    const CE_LEVEL_SIZE_VAR = "e8mpx9x8";',
  "    const CE_LEVEL_SIZE_VAL = {",
  '        0: "ln8e94nl", // Standard',
  '        1: "10v6popl", // Small',
  '        2: "14o42xwq", // Large',
  "    };",
  "    // Speed shares CE_SPEED_VAR / CE_SPEED_VAL (gnx3m4gn)",
  "",
  "    function remixCeLevelName(mode) {",
  '        if (window.CHESS_MODE != null && mode === window.CHESS_MODE) return "Chess";',
  '        if (window.BURGER_MODE != null && mode === window.BURGER_MODE) return "Burger";',
  "        return null;",
  "    }",
]);

code = code.replace(marker, ceLevelBlock);
console.log("patched CE level constants");

const buildRe =
  /if \(score === "H"\) \{\r?\n(?:            if \(!canSubmitHighscore\(mode, count\)\) return null;\r?\n)?            const hsCat = SRC_HS_CATEGORY_BY_MODE\[mode\];\r?\n[\s\S]*?return `https:\/\/www\.speedrun\.com\/\$\{SRC_GAME\}\/runs\/new\?x=\$\{x\}`;\r?\n    \}/;

if (!buildRe.test(code)) {
  console.error("buildSrcSubmitUrl HS/IL pattern not found");
  process.exit(1);
}

code = code.replace(
  buildRe,
  block([
    'if (score === "H") {',
    "            if (typeof canSubmitHighscore === \"function\" && !canSubmitHighscore(mode, count)) return null;",
    "            const hsCat = SRC_HS_CATEGORY_BY_MODE[mode];",
    "            if (hsCat) {",
    "                const x = [",
    "                    hsCat,",
    "                    srcVarPair(SRC_COUNT_VAR, SRC_COUNT_VAL[count]),",
    "                    srcVarPair(SRC_HS_SPEED_VAR, SRC_HS_SPEED_VAL[speed]),",
    "                    srcVarPair(SRC_SIZE_VAR, SRC_SIZE_VAL[size]),",
    '                ].join("-");',
    "                return `https://www.speedrun.com/${SRC_GAME}/runs/new?x=${x}`;",
    "            }",
    "            const ceLevelName = remixCeLevelName(mode);",
    "            if (ceLevelName && CE_LEVEL_BY_MODE_NAME[ceLevelName]) {",
    "                const x = [",
    '                    "l_" + CE_LEVEL_BY_MODE_NAME[ceLevelName],',
    "                    CE_LEVEL_HS_CATEGORY,",
    "                    srcVarPair(CE_LEVEL_COUNT_VAR, CE_LEVEL_COUNT_VAL[count]),",
    "                    srcVarPair(CE_SPEED_VAR, CE_SPEED_VAL[speed]),",
    "                    srcVarPair(CE_LEVEL_SIZE_VAR, CE_LEVEL_SIZE_VAL[size]),",
    '                ].join("-");',
    "                return `https://www.speedrun.com/${SRC_GAME_CE}/runs/new?x=${x}`;",
    "            }",
    "            const ceMode = CE_TALLY_MODE_BY_MODE[mode];",
    "            if (count === TALLY_COUNT && ceMode) {",
    "                const x = [",
    "                    CE_TALLY_HS_CATEGORY,",
    "                    srcVarPair(CE_SPEED_VAR, CE_SPEED_VAL[speed]),",
    "                    srcVarPair(CE_SIZE_VAR, CE_SIZE_VAL[size]),",
    "                    srcVarPair(CE_MODE_VAR, ceMode),",
    '                ].join("-");',
    "                return `https://www.speedrun.com/${SRC_GAME_CE}/runs/new?x=${x}`;",
    "            }",
    "            return null;",
    "        }",
    "",
    "        const ceLevelNameIl = remixCeLevelName(mode);",
    "        if (ceLevelNameIl && CE_LEVEL_BY_MODE_NAME[ceLevelNameIl]) {",
    "            const ceCat = CE_LEVEL_IL_CATEGORY[score];",
    "            if (!ceCat) return null;",
    "            const x = [",
    '                "l_" + CE_LEVEL_BY_MODE_NAME[ceLevelNameIl],',
    "                ceCat,",
    "                srcVarPair(CE_LEVEL_COUNT_VAR, CE_LEVEL_COUNT_VAL[count]),",
    "                srcVarPair(CE_SPEED_VAR, CE_SPEED_VAL[speed]),",
    "                srcVarPair(CE_LEVEL_SIZE_VAR, CE_LEVEL_SIZE_VAL[size]),",
    '            ].join("-");',
    "            return `https://www.speedrun.com/${SRC_GAME_CE}/runs/new?x=${x}`;",
    "        }",
    "",
    "        const levelId = SRC_LEVEL_BY_MODE[mode];",
    "        const catId = SRC_IL_CATEGORY[score];",
    "        if (!levelId || !catId) return null;",
    "",
    "        const x = [",
    '            "l_" + levelId,',
    "            catId,",
    "            srcVarPair(SRC_COUNT_VAR, SRC_COUNT_VAL[count]),",
    "            srcVarPair(SRC_IL_SPEED_VAR, SRC_IL_SPEED_VAL[speed]),",
    "            srcVarPair(SRC_SIZE_VAR, SRC_SIZE_VAL[size]),",
    '        ].join("-");',
    "        return `https://www.speedrun.com/${SRC_GAME}/runs/new?x=${x}`;",
    "    }",
  ])
);
console.log("patched buildSrcSubmitUrl");

if (code === before) {
  console.error("no file changes");
  process.exit(1);
}
fs.writeFileSync(path, code);
console.log("wrote", path);
