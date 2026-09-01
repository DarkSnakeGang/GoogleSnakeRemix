import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const iconOut = path.join(root, "assets", "incrementing-dice-icon.png");
const genPath =
  "C:\\Users\\someo\\.cursor\\projects\\c-Users-someo-OneDrive-Desktop-Quick-Access-vscode-GoogleSnakeRemix\\assets\\incrementing-dice-icon-gen.png";

if (!fs.existsSync(genPath)) throw new Error("Missing incrementing-dice-icon-gen.png");

const genB64 = fs.readFileSync(genPath).toString("base64");
const fruitRes = await fetch(
  "https://www.google.com/logos/fnbx/snake_arcade/v18/apple_00.png"
);
const fruitB64 = Buffer.from(await fruitRes.arrayBuffer()).toString("base64");

const browser = await chromium.launch();
const page = await browser.newPage();

const dataUrl = await page.evaluate(
  async ({ genDataUrl, fruitDataUrl }) => {
    const S = 128;

    const load = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("load failed"));
        img.src = src;
      });

    const gen = await load(genDataUrl);
    const fruit = await load(fruitDataUrl);
    const W = gen.width;
    const H = gen.height;

    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    ctx.drawImage(gen, 0, 0);
    let img = ctx.getImageData(0, 0, W, H);
    const d = img.data;

    function isBg(r, g, b, a) {
      if (a < 20) return true;
      const avg = (r + g + b) / 3;
      if (avg > 238) return true;
      if (Math.abs(r - g) < 18 && Math.abs(g - b) < 18 && avg > 155 && avg < 245) return true;
      return false;
    }

    function isBombGreen(r, g, b) {
      return g > r + 18 && g > b + 10 && g > 70;
    }

    function isAppleRed(r, g, b, a) {
      if (a < 40) return false;
      if (r < 110 || r < g + 30 || r < b + 30) return false;
      if (g > 120 && g > r - 25) return false;
      return true;
    }

    // Transparent background (checkerboard + white)
    for (let i = 0; i < d.length; i += 4) {
      if (isBg(d[i], d[i + 1], d[i + 2], d[i + 3])) d[i + 3] = 0;
    }

    const seen = new Uint8Array(W * H);
    const queue = [];
    for (let x = 0; x < W; x++) {
      queue.push([x, 0], [x, H - 1]);
    }
    for (let y = 0; y < H; y++) {
      queue.push([0, y], [W - 1, y]);
    }
    while (queue.length) {
      const [x, y] = queue.pop();
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const idx = y * W + x;
      if (seen[idx]) continue;
      seen[idx] = 1;
      const i = idx * 4;
      const r = d[i],
        g = d[i + 1],
        b = d[i + 2],
        a = d[i + 3];
      if (a < 8) continue;
      if (isBg(r, g, b, a)) {
        d[i + 3] = 0;
        queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    }
    ctx.putImageData(img, 0, 0);

    // Second pass: decontaminate fringe background pixels
    for (let pass = 0; pass < 2; pass++) {
      img = ctx.getImageData(0, 0, W, H);
      const dd = img.data;
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const i = (y * W + x) * 4;
          if (dd[i + 3] === 0) continue;
          let transparentN = 0;
          for (const [nx, ny] of [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
          ]) {
            if (dd[(ny * W + nx) * 4 + 3] === 0) transparentN++;
          }
          if (transparentN >= 3 && isBg(dd[i], dd[i + 1], dd[i + 2], dd[i + 3])) {
            dd[i + 3] = 0;
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    }
    const src = document.createElement("canvas");
    src.width = W;
    src.height = H;
    src.getContext("2d").drawImage(gen, 0, 0);
    const sd = src.getContext("2d").getImageData(0, 0, W, H).data;
    const appleMask = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (isAppleRed(sd[i], sd[i + 1], sd[i + 2], sd[i + 3])) appleMask[y * W + x] = 1;
      }
    }

    const visited = new Uint8Array(W * H);
    const blobs = [];

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const start = y * W + x;
        if (!appleMask[start] || visited[start]) continue;
        let minX = x,
          maxX = x,
          minY = y,
          maxY = y,
          sumX = 0,
          sumY = 0,
          n = 0;
        const stack = [x, y];
        visited[start] = 1;
        while (stack.length) {
          const cy = stack.pop();
          const cx = stack.pop();
          const ci = cy * W + cx;
          sumX += cx;
          sumY += cy;
          n++;
          minX = Math.min(minX, cx);
          maxX = Math.max(maxX, cx);
          minY = Math.min(minY, cy);
          maxY = Math.max(maxY, cy);
          for (const [nx, ny] of [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1],
          ]) {
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
            const ni = ny * W + nx;
            if (!appleMask[ni] || visited[ni]) continue;
            visited[ni] = 1;
            stack.push(nx, ny);
          }
        }
        const w = maxX - minX + 1;
        const h = maxY - minY + 1;
        if (n < 120 || w < 10 || h < 10) continue;

        const cx = sumX / n;
        const cy = sumY / n;
        const gi = (Math.round(cy) * W + Math.round(cx)) * 4;
        const gr = sd[gi],
          gg = sd[gi + 1],
          gb = sd[gi + 2];
        if (isBombGreen(gr, gg, gb)) continue;
        if (gr + gg + gb < 90) continue;
        if (cy < H * 0.36 && cx < W * 0.5) continue;

        const radius = Math.max(w, h) * 0.52;
        blobs.push({ cx, cy, radius, n });
      }
    }

    blobs.sort((a, b) => a.cy - b.cy || a.cx - b.cx);

    // Erase detected apples from composited layer
    img = ctx.getImageData(0, 0, W, H);
    const out = img.data;
    for (const b of blobs) {
      const r = b.radius * 1.08;
      const x0 = Math.max(0, Math.floor(b.cx - r));
      const x1 = Math.min(W - 1, Math.ceil(b.cx + r));
      const y0 = Math.max(0, Math.floor(b.cy - r));
      const y1 = Math.min(H - 1, Math.ceil(b.cy + r));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          if ((x - b.cx) ** 2 + (y - b.cy) ** 2 <= r * r) {
            out[(y * W + x) * 4 + 3] = 0;
          }
        }
      }
    }
    ctx.putImageData(img, 0, 0);

    // Place apple_00 at each blob center (nudge apart if needed, slight tilt each)
    function tiltFor(i, cx, cy) {
      const s = Math.sin(cx * 12.9898 + cy * 78.233 + i * 43.17) * 43758.5453;
      const r = s - Math.floor(s);
      return (r - 0.5) * 0.95;
    }

    const placed = [];
    for (let bi = 0; bi < blobs.length; bi++) {
      const b = blobs[bi];
      let cx = b.cx;
      let cy = b.cy;
      const size = Math.round(b.radius * 2.05);
      const tilt = tiltFor(bi, cx, cy);
      for (let t = 0; t < 16; t++) {
        let hit = false;
        for (const p of placed) {
          const dx = cx - p.cx;
          const dy = cy - p.cy;
          const need = ((size + p.size) / 2) * 1.18 + 2;
          if (dx * dx + dy * dy < need * need) {
            hit = true;
            break;
          }
        }
        if (!hit) break;
        cx += 2;
        cy += 1.5;
      }
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);
      ctx.drawImage(fruit, -size / 2, -size / 2, size, size);
      ctx.restore();
      placed.push({ cx, cy, size });
    }

    // Crop to opaque bounds + center in 128
    img = ctx.getImageData(0, 0, W, H);
    const px = img.data;
    let minX = W,
      minY = H,
      maxX = 0,
      maxY = 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (px[(y * W + x) * 4 + 3] > 8) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    const cw = maxX - minX + 1;
    const ch = maxY - minY + 1;
    const pad = 6;
    const scale = Math.min((S - pad * 2) / cw, (S - pad * 2) / ch);

    const final = document.createElement("canvas");
    final.width = S;
    final.height = S;
    const fctx = final.getContext("2d");
    const dw = cw * scale;
    const dh = ch * scale;
    fctx.drawImage(
      c,
      minX,
      minY,
      cw,
      ch,
      (S - dw) / 2,
      (S - dh) / 2,
      dw,
      dh
    );

    return { png: final.toDataURL("image/png"), blobCount: blobs.length };
  },
  {
    genDataUrl: "data:image/png;base64," + genB64,
    fruitDataUrl: "data:image/png;base64," + fruitB64,
  }
);

await browser.close();

fs.writeFileSync(
  iconOut,
  Buffer.from(dataUrl.png.replace(/^data:image\/png;base64,/, ""), "base64")
);
console.log("Wrote", iconOut, "— replaced", dataUrl.blobCount, "apples with apple_00");
