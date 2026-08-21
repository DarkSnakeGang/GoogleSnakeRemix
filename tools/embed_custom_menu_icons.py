import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
icons = json.loads((root / "tools" / "_custom_menu_icons.json").read_text(encoding="utf-8"))


def replace_between(src: str, start_marker: str, end_marker: str, new_block: str) -> str:
    start = src.find(start_marker)
    end = src.find(end_marker)
    if start < 0 or end < 0 or end <= start:
        raise SystemExit(f"markers not found: {start_marker!r} .. {end_marker!r}")
    return src[:start] + new_block + src[end:]


colors = root / "CustomColorsInit.js"
src = colors.read_text(encoding="utf-8")
src = replace_between(
    src,
    "window.remixDrawGradientSnakeIcon",
    "window.remixRefreshCustomColorIcons",
    (
        "window.CUSTOM_GRADIENT_ICON =\n  "
        + json.dumps(icons["gradient"])
        + ";\n\n"
        "window.CUSTOM_RAINBOW_ICON =\n  "
        + json.dumps(icons["rainbow"])
        + ";\n\n"
        "window.remixDrawGradientSnakeIcon = function remixDrawGradientSnakeIcon() {\n"
        "  return window.CUSTOM_GRADIENT_ICON;\n"
        "};\n\n"
        "window.remixDrawRainbowSnakeIcon = function remixDrawRainbowSnakeIcon() {\n"
        "  return window.CUSTOM_RAINBOW_ICON;\n"
        "};\n\n"
    ),
)
colors.write_text(src, encoding="utf-8", newline="\n")
print("patched", colors.name)

speeds = root / "CustomSpeedsInit.js"
src = speeds.read_text(encoding="utf-8")
src = replace_between(
    src,
    "window.remixDrawCustomSpeedIcon",
    "window.remixInjectCustomSpeedSettingsUi",
    (
        "window.CUSTOM_SPEED_ICON =\n  "
        + json.dumps(icons["speed"])
        + ";\n\n"
        "window.CUSTOM_SPEED_SWITCH_ICON =\n  "
        + json.dumps(icons["switcher"])
        + ";\n\n"
        "window.remixDrawCustomSpeedIcon = function remixDrawCustomSpeedIcon() {\n"
        "  return window.CUSTOM_SPEED_ICON;\n"
        "};\n\n"
        "window.remixDrawSpeedSwitcherIcon = function remixDrawSpeedSwitcherIcon() {\n"
        "  return window.CUSTOM_SPEED_SWITCH_ICON;\n"
        "};\n\n"
    ),
)
speeds.write_text(src, encoding="utf-8", newline="\n")
print("patched", speeds.name)
