"""Remove golden payline bar from slot-machine icon mock."""
from PIL import Image
from pathlib import Path

src = Path(__file__).resolve().parents[1] / "assets" / "slot-machine-snake-icon-mock.png"
im = Image.open(src).convert("RGBA")
w, h = im.size
px = im.load()

# Detect dense gold horizontal rows in the reel window (middle of image).
gold_rows = []
for y in range(int(h * 0.38), int(h * 0.62)):
    count = 0
    for x in range(int(w * 0.18), int(w * 0.72)):
        r, g, b, a = px[x, y]
        if a < 180:
            continue
        if r > 170 and g > 130 and b < 130 and (r - b) > 35 and (g - b) > 20:
            count += 1
    if count > 40:
        gold_rows.append((y, count))

if not gold_rows:
    raise SystemExit("no gold payline rows found")

# Keep contiguous band around the densest rows.
gold_rows.sort()
ys = [y for y, _ in gold_rows]
y0, y1 = min(ys), max(ys)
# Expand slightly for antialias
y0 = max(0, y0 - 2)
y1 = min(h - 1, y1 + 2)
print(f"payline y={y0}..{y1} size={w}x{h}")

# For each gold pixel in band, replace with vertical neighbor average from reel white/icon.
for y in range(y0, y1 + 1):
    for x in range(int(w * 0.16), int(w * 0.78)):
        r, g, b, a = px[x, y]
        if a < 180:
            continue
        is_gold = r > 170 and g > 130 and b < 130 and (r - b) > 35
        # also catch gold-ish over dark symbols
        is_goldish = r > 150 and g > 110 and b < 140 and (r + g) > 2 * b + 40
        if not (is_gold or is_goldish):
            continue
        # Sample above and below outside the bar
        samples = []
        for yy in (y0 - 3, y0 - 6, y1 + 3, y1 + 6):
            if 0 <= yy < h:
                rr, gg, bb, aa = px[x, yy]
                if aa > 180 and not (
                    rr > 150 and gg > 110 and bb < 140 and (rr + gg) > 2 * bb + 40
                ):
                    samples.append((rr, gg, bb, aa))
        if samples:
            rr = sum(s[0] for s in samples) // len(samples)
            gg = sum(s[1] for s in samples) // len(samples)
            bb = sum(s[2] for s in samples) // len(samples)
            aa = sum(s[3] for s in samples) // len(samples)
            px[x, y] = (rr, gg, bb, aa)
        else:
            px[x, y] = (245, 245, 250, a)

out = src  # overwrite mock used by plan
im.save(out)
print("wrote", out)

# Also emit a compact base64 snippet path for inlining
import base64
import io

buf = io.BytesIO()
# Downscale for trophy size to keep data-URI smaller
thumb = im.copy()
thumb.thumbnail((128, 128), Image.Resampling.LANCZOS)
thumb.save(buf, format="PNG", optimize=True)
b64 = base64.b64encode(buf.getvalue()).decode("ascii")
b64_path = Path(__file__).resolve().parents[1] / "assets" / "slot-machine-icon.b64.txt"
b64_path.write_text(b64, encoding="ascii")
print("b64 bytes", len(b64), "->", b64_path)
