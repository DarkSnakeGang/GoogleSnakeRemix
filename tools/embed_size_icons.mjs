import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const icons = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_size_icons.json"), "utf8")
);
const body =
  "window.REMIX_SIZE_ICONS = " +
  JSON.stringify(icons) +
  ";\n\n" +
  "window.remixInlineCspMenuIcons = function remixInlineCspMenuIcons() {\n" +
  "  const map = window.REMIX_SIZE_ICONS || {};\n" +
  "  const root = document.querySelector(\"#size\");\n" +
  "  if (!root) return;\n" +
  "  for (let i = 0; i < root.children.length; i++) {\n" +
  "    const img = root.children[i];\n" +
  "    const src = (img.getAttribute && img.getAttribute(\"src\")) || img.src || \"\";\n" +
  "    if (src.indexOf(\"github.com\") < 0 && src.indexOf(\"raw.githubusercontent.com\") < 0) continue;\n" +
  "    let name = src.split(\"/\").pop().split(\"?\")[0];\n" +
  "    try { name = decodeURIComponent(name); } catch (_e) {}\n" +
  "    if (map[name]) img.src = map[name];\n" +
  "  }\n" +
  "};\n";
fs.writeFileSync(path.join(__dirname, "..", "CspMenuIcons.js"), body);
console.log("wrote CspMenuIcons.js", body.length);
