"""
Build transparent 40x40 menu icons from approved mockups.

Edge flood-fill for backgrounds only. Never punch interior whites (eyes).
After resize, force near-white content pixels to full opacity.
"""
from __future__ import annotations

import base64
import json
from collections import deque
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path(
    r"C:\Users\someo\.cursor\projects\c-Users-someo-OneDrive-Desktop-Quick-Access-vscode-GoogleSnakeRemix\assets"
)


def is_bg_candidate(r: int, g: int, b: int, a: int, mode: str) -> bool:
    if a < 8:
        return True
    mx = max(r, g, b)
    mn = min(r, g, b)
    sat = mx - mn
    if mode in ("dark", "auto") and mx < 58 and sat < 20:
        return True
    if mode in ("dark", "auto") and 18 <= mx <= 58 and sat < 16:
        return True
    if mode in ("light", "auto") and mn > 200 and sat < 24:
        return True
    if mode in ("light", "auto") and 155 <= mn <= 220 and sat < 20:
        return True
    return False


def punch_transparency(im: Image.Image, mode: str = "auto") -> Image.Image:
    """Flood-fill ONLY from image edges — interior whites (eyes) stay put."""
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def try_seed(x: int, y: int) -> None:
        if visited[y][x]:
            return
        r, g, b, a = px[x, y]
        if is_bg_candidate(r, g, b, a, mode):
            visited[y][x] = True
            q.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        try_seed(x, h - 1)
    for y in range(h):
        try_seed(0, y)
        try_seed(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, _a = px[x, y]
        px[x, y] = (r, g, b, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if nx < 0 or ny < 0 or nx >= w or ny >= h or visited[ny][nx]:
                continue
            nr, ng, nb, na = px[nx, ny]
            if is_bg_candidate(nr, ng, nb, na, mode):
                visited[ny][nx] = True
                q.append((nx, ny))
    return im


def harden_eyes(im: Image.Image) -> Image.Image:
    """Make near-white content fully opaque; kill lone transparent-white flecks."""
    im = im.copy()
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            mn = min(r, g, b)
            mx = max(r, g, b)
            sat = mx - mn
            # Near-white with any coverage → solid opaque white-ish
            if mn >= 190 and sat <= 35 and a > 0:
                # If it's a tiny fringe speck with almost no alpha, drop it
                if a < 40:
                    px[x, y] = (0, 0, 0, 0)
                else:
                    # Pull toward pure white, full opacity
                    px[x, y] = (255, 255, 255, 255)
    return im


def paint_speed_eye(im: Image.Image) -> Image.Image:
    """Guarantee a solid white eye + black pupil on the custom-speed snake."""
    im = im.copy()
    # Eye sits on the upper-left head in the v5 pose (approx after fit).
    # Search for the densest white cluster; if missing, paint a default.
    px = im.load()
    w, h = im.size
    whites = [
        (x, y)
        for y in range(h)
        for x in range(w)
        if px[x, y][3] > 200 and min(px[x, y][:3]) >= 220
    ]
    draw = ImageDraw.Draw(im)
    if whites:
        cx = sum(x for x, _ in whites) / len(whites)
        cy = sum(y for _, y in whites) / len(whites)
    else:
        # Fallback: head region of the green snake icon
        cx, cy = 14.5, 11.5
    # Solid eye disc
    r = 3.2
    draw.ellipse(
        (cx - r, cy - r, cx + r, cy + r),
        fill=(255, 255, 255, 255),
        outline=(255, 255, 255, 255),
    )
    pr = 1.35
    draw.ellipse(
        (cx - pr, cy - pr, cx + pr, cy + pr),
        fill=(0, 0, 0, 255),
        outline=(0, 0, 0, 255),
    )
    return im


def paint_gradient_eye(im: Image.Image) -> Image.Image:
    """Guarantee a solid white eye + black pupil on the gradient snake."""
    im = im.copy()
    px = im.load()
    w, h = im.size
    whites = [
        (x, y)
        for y in range(h)
        for x in range(w)
        if px[x, y][3] > 200 and min(px[x, y][:3]) >= 210
    ]
    draw = ImageDraw.Draw(im)
    if whites:
        cx = sum(x for x, _ in whites) / len(whites)
        cy = sum(y for _, y in whites) / len(whites)
    else:
        cx, cy = 28.0, 9.0
    r = 2.8
    draw.ellipse(
        (cx - r, cy - r, cx + r, cy + r),
        fill=(255, 255, 255, 255),
        outline=(255, 255, 255, 255),
    )
    pr = 1.2
    draw.ellipse(
        (cx - pr, cy - pr, cx + pr, cy + pr),
        fill=(20, 40, 90, 255),
        outline=(20, 40, 90, 255),
    )
    return im


def content_bbox(im: Image.Image, pad: int = 8) -> tuple[int, int, int, int]:
    alpha = im.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        return (0, 0, im.width, im.height)
    l, t, r, b = bbox
    return (
        max(0, l - pad),
        max(0, t - pad),
        min(im.width, r + pad),
        min(im.height, b + pad),
    )


def fit_square(im: Image.Image, size: int = 40) -> Image.Image:
    im = im.crop(content_bbox(im))
    w, h = im.size
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - w) // 2, (side - h) // 2), im)
    # Nearest after a mild downsample path keeps eyes blockier/opaque better than LANCZOS alone:
    # do LANCZOS then harden.
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def to_data_uri(im: Image.Image) -> tuple[str, int]:
    buf = BytesIO()
    im.save(buf, format="PNG", optimize=True)
    raw = buf.getvalue()
    return "data:image/png;base64," + base64.b64encode(raw).decode("ascii"), len(raw)


def eye_stats(im: Image.Image) -> str:
    whites = [p for p in im.getdata() if min(p[0], p[1], p[2]) >= 210 and p[3] > 0]
    if not whites:
        return "no-white"
    alphas = sorted({p[3] for p in whites})
    return f"white={len(whites)} alphas={alphas}"


def main() -> None:
    sources = {
        "gradient": (ASSETS / "icon-custom-gradient-2tone.png", "light", "gradient"),
        "rainbow": (ASSETS / "icon-custom-rainbow.png", "dark", None),
        "speed": (ASSETS / "icon-custom-speed-v5.png", "light", "speed"),
        "switcher": (ASSETS / "icon-custom-speed-switcher.png", "dark", None),
    }
    out: dict[str, str] = {}
    preview = ROOT / "tools" / "_preview_icons"
    preview.mkdir(parents=True, exist_ok=True)
    for key, (path, mode, eye) in sources.items():
        if not path.exists():
            raise SystemExit(f"missing {path}")
        im = punch_transparency(Image.open(path), mode=mode)
        small = fit_square(im, 40)
        small = harden_eyes(small)
        if eye == "speed":
            small = paint_speed_eye(small)
        elif eye == "gradient":
            small = paint_gradient_eye(small)
        uri, nbytes = to_data_uri(small)
        out[key] = uri
        small.save(preview / f"{key}.png")
        corners = [small.getpixel(p)[3] for p in ((0, 0), (39, 0), (0, 39), (39, 39))]
        print(f"{key}: {nbytes}B corners={corners} {eye_stats(small)}")

    out_path = ROOT / "tools" / "_custom_menu_icons.json"
    out_path.write_text(json.dumps(out), encoding="utf-8")
    print("wrote", out_path)


if __name__ == "__main__":
    main()
