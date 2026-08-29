/**
 * Build Cat fruit preset sprites from the flat original + AI mock-ups.
 * Normal/Real: 128×128. Pixel: 170×170 from original pixel mock (+1 mouth pixel).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "assets", "cat-fruit");
const CURSOR_ASSETS = path.join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-someo-OneDrive-Desktop-Quick-Access-vscode-GoogleSnakeRemix",
  "assets"
);

fs.mkdirSync(OUT, { recursive: true });

function findMock(name) {
  const candidates = [
    path.join(OUT, name),
    path.join(ROOT, "assets", name),
    path.join(CURSOR_ASSETS, name),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("missing mock: " + name);
}

function toDataUrl(filePath) {
  const b64 = fs.readFileSync(filePath).toString("base64");
  return "data:image/png;base64," + b64;
}

const SRC = {
  normal: path.join(ROOT, "tools", "cat-original.png"),
  pixel: findMock("cat-fruit-pixel-mock.png"),
  real: findMock("cat-fruit-real-mock.png"),
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent("<html><body></body></html>");

async function processSlot({ srcDataUrl, size, style }) {
  return page.evaluate(
    async ({ srcDataUrl, size, style }) => {
      function load(url) {
        return new Promise((resolve, reject) => {
          const im = new Image();
          im.onload = () => resolve(im);
          im.onerror = () => reject(new Error("load failed"));
          im.src = url;
        });
      }

      const img = await load(srcDataUrl);
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const work = document.createElement("canvas");
      work.width = iw;
      work.height = ih;
      const wctx = work.getContext("2d", { willReadFrequently: true });
      wctx.clearRect(0, 0, iw, ih);
      wctx.drawImage(img, 0, 0);
      const data = wctx.getImageData(0, 0, iw, ih);
      const px = data.data;

      function cornerAvg(x0, y0) {
        let r = 0,
          g = 0,
          b = 0,
          a = 0,
          n = 0;
        for (let y = y0; y < y0 + 8; y++) {
          for (let x = x0; x < x0 + 8; x++) {
            const i = (y * iw + x) * 4;
            r += px[i];
            g += px[i + 1];
            b += px[i + 2];
            a += px[i + 3];
            n++;
          }
        }
        return { r: r / n, g: g / n, b: b / n, a: a / n };
      }
      const corners = [
        cornerAvg(0, 0),
        cornerAvg(iw - 8, 0),
        cornerAvg(0, ih - 8),
        cornerAvg(iw - 8, ih - 8),
      ];
      const opaqueCorners = corners.filter((c) => c.a > 200);
      let punch = null;
      if (opaqueCorners.length >= 3) {
        const avg = opaqueCorners.reduce(
          (acc, c) => ({
            r: acc.r + c.r,
            g: acc.g + c.g,
            b: acc.b + c.b,
          }),
          { r: 0, g: 0, b: 0 }
        );
        avg.r /= opaqueCorners.length;
        avg.g /= opaqueCorners.length;
        avg.b /= opaqueCorners.length;
        const lum = (avg.r + avg.g + avg.b) / 3;
        if (lum < 18 || lum > 245) punch = avg;
      }
      if (punch) {
        for (let i = 0; i < px.length; i += 4) {
          const dr = px[i] - punch.r;
          const dg = px[i + 1] - punch.g;
          const db = px[i + 2] - punch.b;
          if (dr * dr + dg * dg + db * db < 40 * 40 && px[i + 3] > 0) {
            px[i + 3] = 0;
          }
        }
        wctx.putImageData(data, 0, 0);
      }

      // Treat near-white / light-gray backdrop as transparent (baked checkerboards).
      for (let i = 0; i < px.length; i += 4) {
        if (px[i + 3] < 16) continue;
        const r = px[i],
          g = px[i + 1],
          b = px[i + 2];
        if (r > 200 && g > 200 && b > 200) px[i + 3] = 0;
        else if (Math.abs(r - g) < 12 && Math.abs(g - b) < 12 && r > 170) {
          px[i + 3] = 0;
        }
      }
      wctx.putImageData(data, 0, 0);

      let minX = iw,
        minY = ih,
        maxX = -1,
        maxY = -1;
      for (let y = 0; y < ih; y++) {
        for (let x = 0; x < iw; x++) {
          const a = px[(y * iw + x) * 4 + 3];
          if (a < 16) continue;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
      if (maxX < 0) throw new Error("empty after alpha punch");

      const bw = maxX - minX + 1;
      const bh = maxY - minY + 1;

      const out = document.createElement("canvas");
      out.width = size;
      out.height = size;
      const octx = out.getContext("2d");
      octx.clearRect(0, 0, size, size);

      if (style === "pixel") {
        const grid = 34;
        const tiny = document.createElement("canvas");
        tiny.width = grid;
        tiny.height = grid;
        const tctx = tiny.getContext("2d", { willReadFrequently: true });
        tctx.imageSmoothingEnabled = false;
        tctx.clearRect(0, 0, grid, grid);
        const tPad = 1;
        const tFit = grid - tPad * 2;
        const tScale = Math.min(tFit / bw, tFit / bh);
        const tw = Math.max(1, Math.round(bw * tScale));
        const th = Math.max(1, Math.round(bh * tScale));
        const tx = Math.floor((grid - tw) / 2);
        const ty = Math.floor((grid - th) / 2);
        tctx.drawImage(work, minX, minY, bw, bh, tx, ty, tw, th);

        // One black pixel connecting nose → mouth on the logical grid.
        const td = tctx.getImageData(0, 0, grid, grid);
        const tp = td.data;
        function cellLum(x, y) {
          if (x < 0 || y < 0 || x >= grid || y >= grid) return 999;
          const i = (y * grid + x) * 4;
          if (tp[i + 3] < 128) return 999;
          return (tp[i] + tp[i + 1] + tp[i + 2]) / 3;
        }
        function isDark(x, y) {
          return cellLum(x, y) < 80;
        }
        function isBody(x, y) {
          const L = cellLum(x, y);
          return L >= 80 && L < 900;
        }
        let filled = false;
        const y0 = ty + Math.floor(th * 0.35);
        const y1 = ty + Math.floor(th * 0.55);
        const x0 = tx + Math.floor(tw * 0.35);
        const x1 = tx + Math.floor(tw * 0.65);
        for (let x = x0; x <= x1 && !filled; x++) {
          for (let y = y0; y <= y1 && !filled; y++) {
            if (!isDark(x, y)) continue;
            let y2 = y;
            while (y2 + 1 <= y1 + 2 && isDark(x, y2 + 1)) y2++;
            const run = y2 - y + 1;
            // Nose is a short dark run (not tall eye columns).
            if (run > 3) {
              y = y2;
              continue;
            }
            const gapY = y2 + 1;
            if (!isBody(x, gapY)) {
              y = y2;
              continue;
            }
            let mouth = false;
            for (let k = 1; k <= 3; k++) {
              if (isDark(x, gapY + k)) {
                mouth = true;
                break;
              }
            }
            // Also accept diagonal mouth pixels.
            if (!mouth) {
              for (let k = 1; k <= 2; k++) {
                if (isDark(x - 1, gapY + k) || isDark(x + 1, gapY + k)) {
                  mouth = true;
                  break;
                }
              }
            }
            if (!mouth) {
              y = y2;
              continue;
            }
            const i = (gapY * grid + x) * 4;
            tp[i] = 42;
            tp[i + 1] = 42;
            tp[i + 2] = 42;
            tp[i + 3] = 255;
            filled = true;
          }
        }
        if (filled) tctx.putImageData(td, 0, 0);
        globalThis.__catMouthFilled = filled;

        octx.imageSmoothingEnabled = false;
        octx.drawImage(tiny, 0, 0, grid, grid, 0, 0, size, size);
      } else {
        const pad = Math.round(size * 0.06);
        const fit = Math.max(1, size - pad * 2);
        const scale = Math.min(fit / bw, fit / bh);
        const dw = Math.max(1, Math.round(bw * scale));
        const dh = Math.max(1, Math.round(bh * scale));
        const dx = Math.floor((size - dw) / 2);
        const dy = Math.floor((size - dh) / 2);
        octx.imageSmoothingEnabled = true;
        octx.imageSmoothingQuality = "high";
        octx.drawImage(work, minX, minY, bw, bh, dx, dy, dw, dh);
      }

      const od = octx.getImageData(0, 0, size, size);
      for (let i = 3; i < od.data.length; i += 4) {
        if (od.data[i] < 12) od.data[i] = 0;
      }
      octx.putImageData(od, 0, 0);
      return out.toDataURL("image/png");
    },
    { srcDataUrl, size, style }
  );
}

const uriMap = {};
const slots = [
  { key: "normal", style: "normal", size: 128, src: SRC.normal },
  { key: "pixel", style: "pixel", size: 170, src: SRC.pixel },
  { key: "real", style: "real", size: 128, src: SRC.real },
];

for (const slot of slots) {
  const destMock = path.join(OUT, path.basename(slot.src));
  if (path.resolve(slot.src) !== path.resolve(destMock)) {
    fs.copyFileSync(slot.src, destMock);
  }

  const result = await processSlot({
    srcDataUrl: toDataUrl(slot.src),
    size: slot.size,
    style: slot.style,
  });
  const dataUrl = result;
  if (slot.style === "pixel") {
    const filled = await page.evaluate(() => !!globalThis.__catMouthFilled);
    console.log("pixel mouth connect:", filled ? "yes" : "NO");
  }
  const b64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  const file = path.join(OUT, `cat-${slot.key}.png`);
  fs.writeFileSync(file, Buffer.from(b64, "base64"));
  uriMap[`cat-${slot.key}`] = dataUrl;

  const dim = await page.evaluate(async (url) => {
    const im = new Image();
    im.src = url;
    await im.decode();
    return { w: im.naturalWidth, h: im.naturalHeight };
  }, dataUrl);
  if (dim.w !== slot.size || dim.h !== slot.size) {
    throw new Error(`cat ${slot.key} got ${dim.w}x${dim.h}, want ${slot.size}`);
  }
  console.log("ok", slot.key, slot.size, file);
}

await browser.close();

const presetsJs = `// Generated by tools/gen_cat_fruit.mjs — do not hand-edit URIs.
window.__REMIX_CAT_FRUIT_URIS = ${JSON.stringify(uriMap, null, 2)};
`;
fs.writeFileSync(path.join(OUT, "uris.js"), presetsJs);
fs.writeFileSync(path.join(ROOT, "src", "CatFruitUris.js"), presetsJs);
console.log("wrote", OUT, "and src/CatFruitUris.js");
