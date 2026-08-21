"""
Build transparent 40x40 menu icons from approved mockups.
- Removes baked checkerboard / solid backgrounds to true alpha
- Uses 2-tone body+shade icon for custom gradient (not teal→coral wash)
"""
from __future__ import annotations

import base64
import json
import os
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path(
    r"C:\Users\someo\.cursor\projects\c-Users-someo-OneDrive-Desktop-Quick-Access-vscode-GoogleSnakeRemix\assets"
)


def is_bg_pixel(r: int, g: int, b: int, a: int, mode: str) -> bool:
    if a < 8:
        return True
    mx = max(r, g, b)
    mn = min(r, g, b)
    sat = mx - mn
    # Near-grayscale dark (checkerboard dark/mid)
    if mode in ("dark", "auto") and mx < 55 and sat < 18:
        return True
    # Near-white / light gray (speed v5 / light checkerboard)
    if mode in ("light", "auto") and mn > 200 and sat < 22:
        return True
    # Mid light-gray checker cells
    if mode in ("light", "auto") and 160 <= mn <= 220 and sat < 18:
        return True
    # Mid gray checker light squares on dark boards (~30-45)
    if mode in ("dark", "auto") and 18 <= mx <= 55 and sat < 14:
        return True
    return False


def punch_transparency(im: Image.Image, mode: str = "auto") -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    # First pass: hard punch
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_bg_pixel(r, g, b, a, mode):
                px[x, y] = (r, g, b, 0)
    # Second pass: feather edges near transparent (anti-alias leftover bg)
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if not is_bg_pixel(r, g, b, a, mode):
                # if mostly surrounded by transparent and low sat, fade
                neigh = [
                    px[x + dx, y + dy][3]
                    for dy in (-1, 0, 1)
                    for dx in (-1, 0, 1)
                    if not (dx == 0 and dy == 0)
                ]
                if sum(1 for n in neigh if n == 0) >= 5 and max(r, g, b) - min(r, g, b) < 25:
                    if max(r, g, b) < 70 or min(r, g, b) > 200:
                        px[x, y] = (r, g, b, 0)
    return im


def content_bbox(im: Image.Image, pad: int = 8) -> tuple[int, int, int, int]:
    alpha = im.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        return (0, 0, im.width, im.height)
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return (l, t, r, b)


def fit_square(im: Image.Image, size: int = 40) -> Image.Image:
    im = im.crop(content_bbox(im))
    w, h = im.size
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - w) // 2, (side - h) // 2), im)
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def to_data_uri(im: Image.Image) -> str:
    buf = BytesIO()
    im.save(buf, format="PNG", optimize=True)
    raw = buf.getvalue()
    return "data:image/png;base64," + base64.b64encode(raw).decode("ascii"), len(raw)


def main() -> None:
    sources = {
        "gradient": (ASSETS / "icon-custom-gradient-2tone.png", "light"),
        "rainbow": (ASSETS / "icon-custom-rainbow.png", "dark"),
        "speed": (ASSETS / "icon-custom-speed-v5.png", "light"),
        "switcher": (ASSETS / "icon-custom-speed-switcher.png", "dark"),
    }
    out: dict[str, str] = {}
    preview = ROOT / "tools" / "_preview_icons"
    preview.mkdir(parents=True, exist_ok=True)
    for key, (path, mode) in sources.items():
        if not path.exists():
            raise SystemExit(f"missing {path}")
        im = punch_transparency(Image.open(path), mode=mode)
        small = fit_square(im, 40)
        uri, nbytes = to_data_uri(small)
        out[key] = uri
        small.save(preview / f"{key}.png")
        # corner alpha check
        corners = [small.getpixel(p)[3] for p in ((0, 0), (39, 0), (0, 39), (39, 39))]
        print(f"{key}: {nbytes} bytes, corner alpha={corners}, src={path.name}")

    out_path = ROOT / "tools" / "_custom_menu_icons.json"
    out_path.write_text(json.dumps(out), encoding="utf-8")
    print("wrote", out_path)


if __name__ == "__main__":
    main()
