import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconOut = path.join(__dirname, "..", "assets", "incrementing-dice-icon.png");
const COUNT_00 =
  "https://www.google.com/logos/fnbx/snake_arcade/v18/count_00.png";

const browser = await chromium.launch();
const page = await browser.newPage();

const dataUrl = await page.evaluate(async (count00Url) => {
  const load = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("failed: " + url));
      img.src = url;
    });

  const count00 = await load(count00Url);
  const S = 128;

  const src = document.createElement("canvas");
  src.width = S;
  src.height = S;
  const sctx = src.getContext("2d");
  sctx.drawImage(count00, 0, 0, S, S);
  const srcPx = sctx.getImageData(0, 0, S, S).data;

  const out = new Uint8ClampedArray(S * S * 4);
  const mid = S / 2;
  const shift = 14;
  const gap = 10;
  const topKeep = 46;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const oi = (y * S + x) * 4;

      if (y < topKeep) {
        out[oi] = srcPx[oi];
        out[oi + 1] = srcPx[oi + 1];
        out[oi + 2] = srcPx[oi + 2];
        out[oi + 3] = srcPx[oi + 3];
        continue;
      }

      let sx = x;
      let use = false;

      if (x < mid - gap / 2) {
        sx = x + shift;
        use = true;
      } else if (x > mid + gap / 2) {
        sx = x - shift;
        use = true;
      } else {
        const dy = y - topKeep;
        const bodyH = S - topKeep;
        const t = dy / bodyH;
        const waist = 5 + Math.sin(t * Math.PI) * 7;
        if (Math.abs(x - mid) <= waist) {
          sx = x + (x < mid ? shift * 0.55 : -shift * 0.55);
          use = true;
        }
      }

      if (!use) continue;
      sx = Math.round(sx);
      if (sx < 0 || sx >= S) continue;
      const si = (y * S + sx) * 4;
      if (srcPx[si + 3] < 16) continue;

      out[oi] = srcPx[si];
      out[oi + 1] = srcPx[si + 1];
      out[oi + 2] = srcPx[si + 2];
      out[oi + 3] = srcPx[si + 3];
    }
  }

  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d");
  ctx.putImageData(new ImageData(out, S, S), 0, 0);

  ctx.fillStyle = "rgba(85, 12, 6, 0.55)";
  ctx.beginPath();
  ctx.ellipse(mid, S * 0.56, 3, S * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  return c.toDataURL("image/png");
}, COUNT_00);

await browser.close();

fs.writeFileSync(
  iconOut,
  Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ""), "base64")
);
console.log("Wrote", iconOut, "(128x128 transparent)");
