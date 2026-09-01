import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconOut = path.join(__dirname, "..", "assets", "incrementing-dice-icon.png");
const FRUIT_00 =
  "https://www.google.com/logos/fnbx/snake_arcade/v18/apple_00.png";

const browser = await chromium.launch();
const page = await browser.newPage();

const dataUrl = await page.evaluate(async (fruitUrl) => {
  const S = 128;

  const load = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("failed: " + url));
      img.src = url;
    });

  const fruit00 = await load(fruitUrl);

  function drawShell(ctx) {
    ctx.fillStyle = "#5c6e34";
    ctx.strokeStyle = "#2a3418";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-40, -20, 80, 40, 9);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#e8c820";
    ctx.strokeStyle = "#a89018";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-40, -6, 80, 12, 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#3a4620";
    [[-44, -16, -54, -8], [-44, -2, -56, 2], [-44, 12, -54, 10], [-44, 18, -50, 15]].forEach(
      ([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y1 + 5);
        ctx.closePath();
        ctx.fill();
      }
    );

    ctx.fillStyle = "#4a5828";
    ctx.beginPath();
    ctx.ellipse(40, 0, 5, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1a1008";
    ctx.beginPath();
    ctx.ellipse(34, 0, 9, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    function petal(ox, oy, rot, sc) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.rotate(rot);
      ctx.scale(sc, sc);
      ctx.fillStyle = "#6a7c3c";
      ctx.strokeStyle = "#2a3418";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(5, -9, 14, -3);
      ctx.quadraticCurveTo(16, 7, 3, 12);
      ctx.quadraticCurveTo(-3, 5, 0, 0);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    petal(32, -12, -0.35, 0.95);
    petal(38, 0, 0.05, 1.0);
    petal(32, 12, 0.35, 0.95);
  }

  const hi = document.createElement("canvas");
  hi.width = S * 2;
  hi.height = S * 2;
  const hctx = hi.getContext("2d");

  hctx.save();
  hctx.translate(S, S);
  hctx.rotate(-0.36);
  hctx.scale(0.92, 0.92);
  drawShell(hctx);

  const appleS = 17;
  const pad = 4;
  const seeds = [
    { x: 46, y: -24 },
    { x: 58, y: -14 },
    { x: 48, y: -2 },
    { x: 62, y: 2 },
    { x: 52, y: 14 },
    { x: 66, y: 18 },
    { x: 56, y: 30 },
  ];

  const placed = [];
  for (const seed of seeds) {
    let x = seed.x - appleS / 2;
    let y = seed.y - appleS / 2;
    for (let t = 0; t < 20; t++) {
      let hit = false;
      for (const p of placed) {
        const dx = x + appleS / 2 - (p.x + appleS / 2);
        const dy = y + appleS / 2 - (p.y + appleS / 2);
        if (Math.hypot(dx, dy) < appleS + pad) {
          hit = true;
          break;
        }
      }
      if (!hit) break;
      x += 3;
      y += 2;
    }
    hctx.drawImage(fruit00, x, y, appleS, appleS);
    placed.push({ x, y });
  }

  hctx.restore();

  // Crop to content and center in 128×128
  const imgData = hctx.getImageData(0, 0, S * 2, S * 2);
  const d = imgData.data;
  let minX = S * 2,
    minY = S * 2,
    maxX = 0,
    maxY = 0;
  for (let y = 0; y < S * 2; y++) {
    for (let x = 0; x < S * 2; x++) {
      if (d[(y * S * 2 + x) * 4 + 3] > 12) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const scale = Math.min((S - 8) / cw, (S - 8) / ch);
  const out = document.createElement("canvas");
  out.width = S;
  out.height = S;
  const octx = out.getContext("2d");
  const dw = cw * scale;
  const dh = ch * scale;
  octx.drawImage(hi, minX, minY, cw, ch, (S - dw) / 2, (S - dh) / 2, dw, dh);

  return out.toDataURL("image/png");
}, FRUIT_00);

await browser.close();

fs.writeFileSync(
  iconOut,
  Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ""), "base64")
);
console.log("Wrote", iconOut);
