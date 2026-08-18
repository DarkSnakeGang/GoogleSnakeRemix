import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = [
  "none.png",
  "image-presets/ez_loop.png",
  "image-presets/straight_line.png",
  "image-presets/rooms.png",
  "image-presets/pacman.png",
  "image-presets/maze_for_key_statue_large.png",
  "image-presets/regular_grid.png",
  "image-presets/knight_grid.png",
  "image-presets/max_rooms.png",
  "image-presets/soko2.png",
  "image-presets/soko1.png",
  "image-presets/soko3_beta.png",
  "image-presets/soko_widegrid.png",
  "image-presets/use_reversing_at_will.png",
  "image-presets/ham_path.png",
  "image-presets/maze_beta.png",
];

const out = {};
for (const file of files) {
  const url =
    "https://api.github.com/repos/DarkSnakeGang/GoogleSnakeLevelEditor/contents/" +
    file +
    "?ref=v13";
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "remixultra" },
  });
  if (!res.ok) throw new Error(file + " " + res.status + " " + (await res.text()));
  const json = await res.json();
  const b64 = String(json.content || "").replace(/\s/g, "");
  if (!b64) throw new Error(file + " empty");
  out[file] = "data:image/png;base64," + b64;
  console.error("ok", file, Buffer.from(b64, "base64").length);
}

const dest = path.join(__dirname, "..", "UltraPresetImages.js");
const body =
  "window.ULTRA_PRESET_PNG = " +
  JSON.stringify(out, null, 0) +
  ";\n";
fs.writeFileSync(dest, body);
console.error("wrote", dest, body.length);
