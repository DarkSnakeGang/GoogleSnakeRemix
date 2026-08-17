import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function githubText(file) {
  const url =
    "https://api.github.com/repos/DarkSnakeGang/GoogleSnakeLevelEditor/contents/" +
    file +
    "?ref=v12";
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "remixultra" },
  });
  if (!res.ok) throw new Error(file + " " + res.status + " " + (await res.text()));
  const json = await res.json();
  const b64 = String(json.content || "").replace(/\s/g, "");
  if (!b64) throw new Error(file + " empty");
  const text = Buffer.from(b64, "base64").toString("utf8");
  console.error("ok", file, text.length);
  return text;
}

const challenge = await githubText("challenge.txt");
const ham = await githubText("random_ham.txt");
const dest = path.join(__dirname, "..", "UltraPresetLevels.js");
const body =
  "window.ULTRA_CHALLENGE_TXT = " +
  JSON.stringify(challenge) +
  ";\nwindow.ULTRA_HAM_TXT = " +
  JSON.stringify(ham) +
  ";\n";
fs.writeFileSync(dest, body);
console.error("wrote", dest, body.length);
