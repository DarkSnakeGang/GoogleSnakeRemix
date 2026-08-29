/**
 * Convert play-icon mock → transparent 40×40 picker PNG + base64 for AnimationModInit.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(
  process.env.USERPROFILE || "",
  ".cursor/projects/c-Users-someo-OneDrive-Desktop-Quick-Access-vscode-GoogleSnakeRemix/assets/anim-icon-mock-play.png"
);
const OUT_PNG = path.join(ROOT, "assets", "anim-color-icon.png");
const INIT = path.join(ROOT, "src", "AnimationModInit.js");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("about:blank");

const dataUrl =
  "data:image/png;base64," + fs.readFileSync(SRC).toString("base64");

const result = await page.evaluate(async (src) => {
  function load(url) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = url;
    });
  }
  const img = await load(src);
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const id = ctx.getImageData(0, 0, w, h);
  const d = id.data;

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const chroma = max - min;
    // Black rounded-square fill → transparent
    if (max <= 22 && lum <= 16) {
      d[i + 3] = 0;
      continue;
    }
    if (max <= 55 && lum <= 40 && chroma < 16) {
      const t = (lum - 8) / 32;
      d[i + 3] = Math.max(0, Math.min(255, Math.round(d[i + 3] * t)));
      if (d[i + 3] < 10) d[i + 3] = 0;
    }
  }

  // Flood-fill near-white outer margin from image corners → transparent
  // (keeps the white play triangle in the center).
  function isOuterWhite(i) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const a = d[i + 3];
    if (a === 0) return false;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    return min >= 220 && max - min <= 20;
  }
  const seen = new Uint8Array(w * h);
  const stack = [];
  function push(x, y) {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (seen[p]) return;
    if (!isOuterWhite(p * 4)) return;
    seen[p] = 1;
    stack.push(p);
  }
  push(0, 0);
  push(w - 1, 0);
  push(0, h - 1);
  push(w - 1, h - 1);
  push(Math.floor(w / 2), 0);
  push(Math.floor(w / 2), h - 1);
  push(0, Math.floor(h / 2));
  push(w - 1, Math.floor(h / 2));
  while (stack.length) {
    const p = stack.pop();
    d[p * 4 + 3] = 0;
    const x = p % w;
    const y = (p - x) / w;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  ctx.putImageData(id, 0, 0);

  // Crop to non-transparent content, then fit into 40×40 with padding.
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (d[(y * w + x) * 4 + 3] > 12) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error("no opaque pixels after knockout");
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const pad = Math.round(Math.max(bw, bh) * 0.04);
  const side = Math.max(bw, bh) + pad * 2;
  const cropped = document.createElement("canvas");
  cropped.width = side;
  cropped.height = side;
  const cctx = cropped.getContext("2d");
  cctx.clearRect(0, 0, side, side);
  const ox = Math.floor((side - bw) / 2);
  const oy = Math.floor((side - bh) / 2);
  cctx.drawImage(c, minX, minY, bw, bh, ox, oy, bw, bh);

  const out = document.createElement("canvas");
  out.width = 40;
  out.height = 40;
  const octx = out.getContext("2d");
  octx.imageSmoothingEnabled = true;
  octx.imageSmoothingQuality = "high";
  octx.clearRect(0, 0, 40, 40);
  octx.drawImage(cropped, 0, 0, side, side, 0, 0, 40, 40);

  const check = octx.getImageData(0, 0, 40, 40).data;
  const cornerAlpha = [
    check[3],
    check[(0 * 40 + 39) * 4 + 3],
    check[(39 * 40 + 0) * 4 + 3],
    check[(39 * 40 + 39) * 4 + 3],
  ];
  const mid = (20 * 40 + 20) * 4;
  return {
    srcSize: [w, h],
    cornerAlpha,
    center: [check[mid], check[mid + 1], check[mid + 2], check[mid + 3]],
    png: out.toDataURL("image/png"),
  };
}, dataUrl);

await browser.close();

const prefix = "data:image/png;base64,";
if (!result.png.startsWith(prefix)) throw new Error("expected png data url");
const b64 = result.png.slice(prefix.length);
fs.mkdirSync(path.dirname(OUT_PNG), { recursive: true });
fs.writeFileSync(OUT_PNG, Buffer.from(b64, "base64"));

let init = fs.readFileSync(INIT, "utf8");
const re =
  /window\.ANIMATED_COLOR_ICON\s*=\s*"data:image\/png;base64,[^"]*";/;
if (!re.test(init)) throw new Error("ANIMATED_COLOR_ICON assignment not found");
init = init.replace(
  re,
  `window.ANIMATED_COLOR_ICON =\n  "${result.png}";`
);
fs.writeFileSync(INIT, init);

console.log(
  JSON.stringify(
    {
      out: OUT_PNG,
      bytes: Buffer.from(b64, "base64").length,
      srcSize: result.srcSize,
      cornerAlpha: result.cornerAlpha,
      center: result.center,
    },
    null,
    2
  )
);
