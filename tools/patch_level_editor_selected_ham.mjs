/**
 * Re-apply Ultra Selected Ham hooks after LevelEditorInit.js is re-downloaded.
 * Idempotent — safe to run on an already-patched file.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const dest = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, "LevelEditorInit.js");

let src = fs.readFileSync(dest, "utf8");
let changed = false;

function once(label, find, insert) {
  if (src.includes(insert.trim().slice(0, 40))) return;
  if (!src.includes(find)) {
    throw new Error("patch_level_editor_selected_ham: missing anchor for " + label);
  }
  src = src.replace(find, find + insert);
  changed = true;
}

if (!src.includes("isUsingSelectedHamPreset")) {
  once(
    "blitSelectedPreset",
    "let isUsingRandomHamPreset = presetEl.classList.contains('preset-random-ham');\n",
    "    let isUsingSelectedHamPreset = presetEl.classList.contains('preset-selected-ham');\n"
  );
  once(
    "blitSelectedHamBranch",
    "    } else if(isUsingRandomHamPreset) {\n      patternPixelList = otherPresetmanager.getRandomHamPixelList();\n",
    "    } else if(isUsingSelectedHamPreset) {\n" +
      "      patternPixelList = otherPresetmanager.getSelectedHamPixelList\n" +
      "        ? otherPresetmanager.getSelectedHamPixelList()\n" +
      "        : [];\n"
  );
}

if (!src.includes("preset-selected-ham')) return")) {
  once(
    "setSelectedSnakeHead",
    "    if(presetEl.classList.contains('preset-random-ham')) return;\n",
    "    if(presetEl.classList.contains('preset-selected-ham')) return;\n"
  );
}

if (!src.includes("preset-selected-ham\"")) {
  once(
    "presetHtml",
    '<div class="preset-option preset-random-ham" style="height: 40px;background-color: #2d3f76;grid-column: 1 / 4;font-size: 1.5em;font-family: Arial;text-align: center;color: white;line-height: 40px;cursor: pointer; margin-top:9px;">RANDOM HAM</div>\n',
    '      <div class="preset-option preset-selected-ham" style="height: 40px;background-color: #2d3f76;grid-column: 1 / 4;font-size: 1.5em;font-family: Arial;text-align: center;color: white;line-height: 40px;cursor: pointer; margin-top:9px;">SELECTED HAM</div>\n'
  );
}

if (!src.includes("preset-selected-ham')) {\n            //Selected Ham")) {
  once(
    "sizeClick",
    "          } else if(this.classList.contains('preset-random-ham')) {\n            //For the random ham just set the new size to small\n            newSizeSetting = 1;\n",
    "          } else if(this.classList.contains('preset-selected-ham')) {\n" +
      "            //Selected Ham boards are always small (10x9)\n" +
      "            newSizeSetting = 1;\n"
  );
}

if (changed) {
  fs.writeFileSync(dest, src);
  console.error("patched Selected Ham into", dest);
} else {
  console.error("Selected Ham already present in", dest);
}
