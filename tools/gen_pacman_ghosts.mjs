/**
 * Generate Pacman ghost poison sprites (Pinky/Inky/Clyde).
 * Blinky uses Distinct Visual’s existing Pudding poison-ghost postimg art.
 * Normal/Real: 128×128. Pixel: 170×170. Writes PNG files + a JS snippet of data URIs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "assets", "pacman-ghosts");
fs.mkdirSync(OUT, { recursive: true });

const GHOSTS = [
  { id: "pinky", label: "Pinky (pink)", color: "#FFB8FF", shade: "#E89AE8" },
  { id: "inky", label: "Inky (cyan)", color: "#00FFFF", shade: "#00C8C8" },
  { id: "clyde", label: "Clyde (orange)", color: "#FFB852", shade: "#E09030" },
];

async function renderGhost(page, { color, shade, size, style }) {
  return page.evaluate(
    ({ color, shade, size, style }) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const bodyR = size * 0.36;
      const topY = size * 0.42;
      const skirtY = size * 0.72;
      const eyeWhiteR = size * (style === "pixel" ? 0.075 : 0.08);
      const pupilR = eyeWhiteR * 0.45;
      const eyeY = topY - size * 0.02;
      const eyeDX = size * 0.12;

      function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      }

      if (style === "pixel") {
        const cell = Math.max(4, Math.floor(size / 17));
        const grid = 17;
        const ox = Math.floor((size - grid * cell) / 2);
        const oy = Math.floor((size - grid * cell) / 2);
        // Classic-ish 17×17 pacman ghost silhouette (regular, not scared)
        // 17 columns — classic regular ghost (colored body, not scared blue)
        const map = [
          ".....XXXXXXX.....",
          "...XXXXXXXXXXX...",
          "..XXXXXXXXXXXXX..",
          ".XXXXXXXXXXXXXXX.",
          ".XXX..XXXXX..XXX.",
          ".XX....XXX....XX.",
          "XXX....XXX....XXX",
          "XXXX..XXXXX..XXXX",
          "XXXXXXXXXXXXXXXXX",
          "XXXXXXXXXXXXXXXXX",
          "XXXXXXXXXXXXXXXXX",
          "XXXXXXXXXXXXXXXXX",
          "XXXXXXXXXXXXXXXXX",
          "XXXXXXXXXXXXXXXXX",
          "XX.XXXXX.XXXXX.XX",
          "X...XXX...XXX...X",
          ".................",
        ];

        for (let y = 0; y < 17; y++) {
          for (let x = 0; x < 17; x++) {
            const ch = map[y][x];
            if (ch !== "X") continue;
            ctx.fillStyle = color;
            ctx.fillRect(ox + x * cell, oy + y * cell, cell, cell);
          }
        }
        // Eyes
        const eyeCells = [
          [4, 4],
          [5, 4],
          [4, 5],
          [5, 5],
          [11, 4],
          [12, 4],
          [11, 5],
          [12, 5],
        ];
        for (const [x, y] of eyeCells) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(ox + x * cell, oy + y * cell, cell, cell);
        }
        const pupils = [
          [5, 5],
          [12, 5],
        ];
        for (const [x, y] of pupils) {
          ctx.fillStyle = "#2121DE";
          ctx.fillRect(ox + x * cell, oy + y * cell, cell, cell);
        }
      } else {
        // Smooth arcade body (dome + wavy skirt)
        ctx.beginPath();
        ctx.arc(cx, topY, bodyR, Math.PI, 0, false);
        ctx.lineTo(cx + bodyR, skirtY);
        const waves = 3;
        const left = cx - bodyR;
        const right = cx + bodyR;
        const waveW = (right - left) / waves;
        for (let i = waves - 1; i >= 0; i--) {
          const x0 = left + i * waveW;
          const x1 = x0 + waveW;
          const mid = (x0 + x1) / 2;
          const dip = skirtY + bodyR * 0.22;
          ctx.quadraticCurveTo(mid, dip, x0, skirtY);
        }
        ctx.closePath();
        if (style === "real") {
          const g = ctx.createLinearGradient(cx, topY - bodyR, cx, skirtY);
          g.addColorStop(0, color);
          g.addColorStop(1, shade);
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = color;
        }
        ctx.fill();

        // Eyes (looking right — not scared/edible)
        for (const side of [-1, 1]) {
          const ex = cx + side * eyeDX;
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.ellipse(ex, eyeY, eyeWhiteR * 0.85, eyeWhiteR, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#2121DE";
          ctx.beginPath();
          ctx.arc(ex + eyeWhiteR * 0.25, eyeY + eyeWhiteR * 0.1, pupilR, 0, Math.PI * 2);
          ctx.fill();
        }

        if (style === "real") {
          ctx.strokeStyle = "rgba(0,0,0,0.18)";
          ctx.lineWidth = Math.max(1, size * 0.015);
          ctx.beginPath();
          ctx.arc(cx, topY, bodyR, Math.PI, 0, false);
          ctx.stroke();
        }
      }

      return canvas.toDataURL("image/png");
    },
    { color, shade, size, style }
  );
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent("<html><body></body></html>");

const uriMap = {};

for (const g of GHOSTS) {
  for (const [style, size] of [
    ["normal", 128],
    ["pixel", 170],
    ["real", 128],
  ]) {
    const dataUrl = await renderGhost(page, {
      color: g.color,
      shade: g.shade,
      size,
      style,
    });
    const b64 = dataUrl.replace(/^data:image\/png;base64,/, "");
    const file = path.join(OUT, `${g.id}-${style}.png`);
    fs.writeFileSync(file, Buffer.from(b64, "base64"));
    uriMap[`${g.id}-${style}`] = dataUrl;
    const img = await page.evaluate(async (url) => {
      const im = new Image();
      im.src = url;
      await im.decode();
      return { w: im.naturalWidth, h: im.naturalHeight };
    }, dataUrl);
    if (img.w !== size || img.h !== size) {
      throw new Error(`${g.id} ${style} got ${img.w}x${img.h}, want ${size}`);
    }
    console.log("ok", g.id, style, size);
  }
}

await browser.close();

const presetsJs = `// Generated by tools/gen_pacman_ghosts.mjs — do not hand-edit URIs.
window.__REMIX_PACMAN_GHOST_URIS = ${JSON.stringify(uriMap, null, 2)};
`;
fs.writeFileSync(path.join(OUT, "uris.js"), presetsJs);
fs.writeFileSync(path.join(__dirname, "..", "src", "PacmanGhostUris.js"), presetsJs);
console.log("wrote", OUT, "and src/PacmanGhostUris.js");
