/**
 * Replace MoreMenu extra-size GitHub URLs with inlined PNGs.
 * Google Snake CSP blocks github.com / raw.githubusercontent.com, so those
 * <img>s stay broken and the HUD/menu drawImage throws InvalidStateError.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const icons = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_size_icons.json"), "utf8")
);
const target = process.argv[2] || "MorePudding.js";
let code = fs.readFileSync(target, "utf8");
const before = code;

function urlFor(name) {
  return (
    "https://github.com/carlgustavh/GoogleSnakeCustomMenuStuffImages/blob/main/" +
    name.replace(/ /g, "%20") +
    "?raw=true"
  );
}

for (const [name, data] of Object.entries(icons)) {
  const url = urlFor(name);
  if (!code.includes(url)) {
    if (code.includes(data)) continue;
    console.error("missing size icon URL", name);
    process.exit(1);
  }
  code = code.split(url).join(data);
}

if (code === before) {
  console.log("already patched: size icons");
} else {
  fs.writeFileSync(target, code);
  console.log("patched size icons ->", target);
}
