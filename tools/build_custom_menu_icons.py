"""
Build transparent 40x40 menu icons from approved mockups.

Uses edge flood-fill so interior whites (eyes) stay opaque while baked
checkerboard / solid backgrounds become real alpha.
"""
from __future__ import annotations

import base64
import json
from collections import deque
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path(
    r"C:\Users\someo\.cursor\projects\c-Users-someo-OneDrive-Desktop-Quick-Access-vscode-GoogleSnakeRemix\assets"
)


def is_bg_candidate(r: int, g: int, b: int, a: int, mode: str) -> bool:
    """Color looks like background — only punched if edge-connected."""
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
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def try_seed(x: int, y: int) -> None:
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
        r, g, b, a = px[x, y]
        px[x, y] = (r, g, b, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if nx < 0 or ny < 0 or nx >= w or ny >= h or visited[ny][nx]:
                continue
            nr, ng, nb, na = px[nx, ny]
            if is_bg_candidate(nr, ng, nb, na, mode):
                visited[ny][nx] = True
                q.append((nx, ny))

    # Soft-clear low-sat fringe only when touching already-transparent bg
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if not is_bg_candidate(r, g, b, a, mode):
                continue
            neigh_t = sum(
                1
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))
                if px[x + dx, y + dy][3] == 0
            )
            if neigh_t >= 2:
                px[x, y] = (r, g, b, 0)
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
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def to_data_uri(im: Image.Image) -> tuple[str, int]:
    buf = BytesIO()
    im.save(buf, format="PNG", optimize=True)
    raw = buf.getvalue()
    return "data:image/png;base64," + base64.b64encode(raw).decode("ascii"), len(raw)


def eye_ok(im: Image.Image) -> bool:
    """Heuristic: some near-white opaque pixels remain (eye fill)."""
    for r, g, b, a in im.getdata():
        if a > 200 and min(r, g, b) > 210 and max(r, g, b) - min(r, g, b) < 30:
            return True
    return False


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
        corners = [small.getpixel(p)[3] for p in ((0, 0), (39, 0), (0, 39), (39, 39))]
        print(
            f"{key}: {nbytes}B corners={corners} eye_ok={eye_ok(small)} src={path.name}"
        )

    out_path = ROOT / "tools" / "_custom_menu_icons.json"
    out_path.write_text(json.dumps(out), encoding="utf-8")
    print("wrote", out_path)


if __name__ == "__main__":
    main()
