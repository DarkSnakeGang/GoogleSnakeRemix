import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "assets");
const COUNT_00 =
  "https://www.google.com/logos/fnbx/snake_arcade/v18/count_00.png";

const VARIANTS = [
  { file: "incrementing-dice-icon-a.png", id: "a", name: "split lobes" },
  { file: "incrementing-dice-icon-b.png", id: "b", name: "+1 badge" },
  { file: "incrementing-dice-icon-c.png", id: "c", name: "twin apples" },
  { file: "incrementing-dice-icon-d.png", id: "d", name: "up arrow" },
  { file: "incrementing-dice-icon-e.png", id: "e", name: "staircase" },
];

const browser = await chromium.launch();
const page = await browser.newPage();

const icons = await page.evaluate(async (count00Url) => {
  const S = 128;

  const load = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("failed: " + url));
      img.src = url;
    });

  const count00 = await load(count00Url);

  function canvas() {
    const c = document.createElement("canvas");
    c.width = S;
    c.height = S;
    return c;
  }

  function blitCount(c, dx = 0, dy = 0) {
    c.getContext("2d").drawImage(count00, dx, dy, S, S);
  }

  function stampTop(c, limit = 44) {
    const tmp = canvas();
    blitCount(tmp);
    const src = tmp.getContext("2d").getImageData(0, 0, S, limit);
    c.getContext("2d").putImageData(src, 0, 0);
  }

  function badge(ctx, x, y, r, color, draw) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
    draw(ctx, x, y, r);
  }

  function drawMiniApple(ctx, cx, cy, r) {
    const g = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.1, cx, cy, r);
    g.addColorStop(0, "#ff7a55");
    g.addColorStop(0.55, "#e84818");
    g.addColorStop(1, "#c03010");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5a3018";
    ctx.fillRect(cx - r * 0.1, cy - r - 3, r * 0.2, r * 0.28);
    ctx.fillStyle = "#48b848";
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.42, cy - r * 0.82, r * 0.32, r * 0.2, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  const out = {};

  // A — clean bacterial lobes: two clipped copies + waist
  {
    const c = canvas();
    const ctx = c.getContext("2d");
    const tmp = canvas();
    blitCount(tmp);
    const drawLobe = (cx, offX) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, 82, 40, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(tmp, offX, 0);
      ctx.restore();
    };
    drawLobe(40, -16);
    drawLobe(88, 16);
    ctx.fillStyle = "#b83820";
    ctx.beginPath();
    ctx.ellipse(64, 80, 5, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    stampTop(c);
    out.a = c.toDataURL("image/png");
  }

  // B — native count_00 + purple +1
  {
    const c = canvas();
    blitCount(c);
    const ctx = c.getContext("2d");
    badge(ctx, 98, 98, 22, "#9b59b6", (g, x, y, r) => {
      g.fillStyle = "#fff";
      g.font = `bold ${Math.round(r * 1.05)}px Arial,sans-serif`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("+1", x, y + 1);
    });
    out.b = c.toDataURL("image/png");
  }

  // C — two apples pinching apart (twin, clear gap)
  {
    const c = canvas();
    const ctx = c.getContext("2d");
    drawMiniApple(ctx, 46, 76, 34);
    drawMiniApple(ctx, 82, 76, 34);
    ctx.fillStyle = "#8a2818";
    ctx.beginPath();
    ctx.ellipse(64, 78, 4, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5a3018";
    ctx.fillRect(61, 36, 6, 10);
    ctx.fillStyle = "#48b848";
    ctx.beginPath();
    ctx.ellipse(72, 34, 10, 6, 0.5, 0, Math.PI * 2);
    ctx.fill();
    out.c = c.toDataURL("image/png");
  }

  // D — count_00 + orange up arrow
  {
    const c = canvas();
    blitCount(c);
    const ctx = c.getContext("2d");
    badge(ctx, 98, 98, 22, "#ff6600", (g, x, y, r) => {
      g.fillStyle = "#fff";
      g.beginPath();
      g.moveTo(x, y - r * 0.55);
      g.lineTo(x + r * 0.5, y + r * 0.12);
      g.lineTo(x + r * 0.15, y + r * 0.12);
      g.lineTo(x + r * 0.15, y + r * 0.55);
      g.lineTo(x - r * 0.15, y + r * 0.55);
      g.lineTo(x - r * 0.15, y + r * 0.12);
      g.lineTo(x - r * 0.5, y + r * 0.12);
      g.closePath();
      g.fill();
    });
    out.d = c.toDataURL("image/png");
  }

  // E — staircase 1→2→3 tiny apples
  {
    const c = canvas();
    const ctx = c.getContext("2d");
    drawMiniApple(ctx, 28, 88, 20);
    drawMiniApple(ctx, 54, 72, 18);
    drawMiniApple(ctx, 68, 72, 18);
    drawMiniApple(ctx, 92, 56, 16);
    drawMiniApple(ctx, 104, 56, 16);
    drawMiniApple(ctx, 116, 56, 16);
    ctx.fillStyle = "#9b59b6";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(38 + i * 14, 80 - i * 12, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    out.e = c.toDataURL("image/png");
  }

  return out;
}, COUNT_00);

await browser.close();

for (const v of VARIANTS) {
  const p = path.join(assetsDir, v.file);
  fs.writeFileSync(
    p,
    Buffer.from(icons[v.id].replace(/^data:image\/png;base64,/, ""), "base64")
  );
  console.log("Wrote", v.file, "-", v.name);
}

// Remove rejected old single icon if present
const old = path.join(assetsDir, "incrementing-dice-icon.png");
if (fs.existsSync(old)) {
  fs.unlinkSync(old);
  console.log("Removed incrementing-dice-icon.png (replaced by variants a–e)");
}
