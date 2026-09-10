import urllib.request
import os
import subprocess
import base64

BASE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(BASE, ".cache", "pudding-build")

# MorePudding = PuddingMod + MoreMenuMod + VisibilityMod + MorePuddingInit.
# Upstream MorePudding.js is often stale vs PuddingMod.js, so Remix rebuilds it
# from the same parts MoreBuilder.py uses (mirrors GoogleSnakePudding).
PUDDING_REPO = "https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakePudding/main"
PUDDINGMOD_URL = f"{PUDDING_REPO}/PuddingMod.js"
MOREPUDDING_INIT_URL = f"{PUDDING_REPO}/MorePuddingInit.js"
# Fallback only if a local rebuild is impossible.
MOREPUDDING_URL = f"{PUDDING_REPO}/MorePudding.js"
MOREMENU_URL = (
    "https://raw.githubusercontent.com/DarkSnakeGang/"
    "GoogleSnakeCustomMenuStuff/main/modloadercode.js"
)
VISIBILITY_URL = (
    "https://raw.githubusercontent.com/DarkSnakeGang/"
    "GoogleSnakeDeleteStuffMod/main/VisibilityInit.js"
)
BOOTSTRAP_URL = f"{PUDDING_REPO}/bootstrap-stripped.css"
LEVEL_EDITOR_URL = "https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakeLevelEditor/v13/modloadercode.js"

REMIX_PARTS = [
    "src/CandyInit.js",
    "src/ChessInit.js",
    "src/BurgerInit.js",
    "src/CatInit.js",
    "src/MexicoInit.js",
    "src/BombFruitInit.js",
    "src/TempWallsInit.js",
    "src/FearInit.js",
    "src/SlotMachineInit.js",
    "src/CatSpeedInit.js",
    "src/DiceCountsInit.js",
    "src/ClusterCountInit.js",
    "src/CustomSettingsInit.js",
    "src/CustomSizeInit.js",
    "src/CustomColorsInit.js",
    "src/CustomSpeedsInit.js",
    "src/PacmanGhostUris.js",
    "src/CatFruitUris.js",
    "src/CustomFruitPresets.js",
    "src/CustomFruitInit.js",
    "src/HamiltonMod.js",
    "src/HamiltonInit.js",
    "src/RemixSpeedInfoInit.js",
    "src/CspMenuIcons.js",
    "src/PauseInit.js",
    "src/RemixInit.js",
]

ULTRA_PARTS = [
    *REMIX_PARTS,
    "LevelEditorInit.js",
    "src/UltraPresetImages.js",
    "src/UltraPresetLevels.js",
    "src/UltraPlaceInit.js",
    "src/AnimationModInit.js",
    "src/UltraInit.js",
]


def download(url, dest):
    print(f"Downloading {url} -> {dest}")
    os.makedirs(os.path.dirname(dest) or ".", exist_ok=True)
    urllib.request.urlretrieve(url, dest)


def rebuild_morepudding(dest):
    """Concatenate latest PuddingMod + menu/visibility like upstream MoreBuilder."""
    os.makedirs(CACHE, exist_ok=True)
    pudding = os.path.join(CACHE, "PuddingMod.js")
    more_menu = os.path.join(CACHE, "MoreMenuMod.js")
    visibility = os.path.join(CACHE, "VisibilityMod.js")
    more_init = os.path.join(CACHE, "MorePuddingInit.js")
    download(PUDDINGMOD_URL, pudding)
    download(MOREMENU_URL, more_menu)
    download(VISIBILITY_URL, visibility)
    download(MOREPUDDING_INIT_URL, more_init)
    print(f"Rebuilding MorePudding.js from PuddingMod + deps -> {dest}")
    with open(dest, "w", encoding="utf-8") as out:
        for path in (pudding, more_menu, visibility, more_init):
            with open(path, "r", encoding="utf-8") as f:
                out.write(f.read())
    print(f"Wrote rebuilt {dest} ({os.path.getsize(dest)} bytes)")


FEAR_ASSET_TOKENS = {
    "__FEAR_MODE_ICON__": "assets/fear-mode-icon.png",
    "__FEAR_GHOST_NORMAL__": "assets/fear-ghost-normal.png",
    "__FEAR_GHOST_PIXEL__": "assets/fear-ghost-pixel.png",
    "__FEAR_GHOST_REAL__": "assets/fear-ghost-real.png",
}


def inline_asset_tokens(text):
    for token, relative_path in FEAR_ASSET_TOKENS.items():
        if token not in text:
            continue
        path = os.path.join(BASE, relative_path)
        with open(path, "rb") as image:
            encoded = base64.b64encode(image.read()).decode("ascii")
        text = text.replace(token, "data:image/png;base64," + encoded)
    return text


def concat(out_path, parts):
    with open(out_path, "w", encoding="utf-8") as out:
        for name in parts:
            path = os.path.join(BASE, name)
            print(f"Appending {name}")
            with open(path, "r", encoding="utf-8") as f:
                out.write(inline_asset_tokens(f.read()))
                out.write("\n")
    print(f"Wrote {out_path}")


def rewrite_ultra_storage_keys(src, dest):
    with open(src, "r", encoding="utf-8") as f:
        text = f.read()
    if "RemixUltraSettings" in text and "snake_timeKeeper_remix_ultra" in text:
        print("already patched: Ultra storage keys")
        with open(dest, "w", encoding="utf-8") as f:
            f.write(text)
        return
    if "RemixSettings" not in text:
        raise SystemExit("MorePudding copy missing RemixSettings; run Remix key patch first")
    # Longer TimeKeeper key first so we don't double-suffix.
    text = text.replace("snake_timeKeeper_remix", "snake_timeKeeper_remix_ultra")
    text = text.replace("RemixSettings", "RemixUltraSettings")
    with open(dest, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"rewrote Ultra storage keys -> {dest}")


def main():
    morepudding_path = os.path.join(BASE, "MorePudding.js")
    bootstrap_path = os.path.join(BASE, "bootstrap-stripped.css")
    remix_out = os.path.join(BASE, "RemixMod.js")
    ultra_pudding = os.path.join(BASE, "MorePudding.ultra.js")
    le_path = os.path.join(BASE, "LevelEditorInit.js")
    ultra_out = os.path.join(BASE, "RemixUltraMod.js")

    try:
        rebuild_morepudding(morepudding_path)
    except Exception as err:
        print(f"MorePudding rebuild failed ({err}); falling back to upstream bundle")
        download(MOREPUDDING_URL, morepudding_path)
    download(BOOTSTRAP_URL, bootstrap_path)
    # Chess/Burger are CE level HS modes in FastSnakeStats; upstream SpeedInfo
    # only knows vanilla trophy ids, so teach it about Remix mode globals.
    print("Patching CE level SRC support into MorePudding.js")
    subprocess.check_call(
        ["node", os.path.join("tools", "patch_pudding_ce_levels.mjs"), morepudding_path],
        cwd=BASE,
    )
    # Keep Remix saves off PuddingMod's PuddingSettings / snake_timeKeeper.
    print("Patching Remix-isolated storage keys into MorePudding.js")
    subprocess.check_call(
        ["node", os.path.join("tools", "patch_pudding_storage_keys.mjs"), morepudding_path],
        cwd=BASE,
    )
    print("Inlining extra size icons (CSP-safe data URIs)")
    subprocess.check_call(
        ["node", os.path.join("tools", "patch_pudding_menu_icons.mjs"), morepudding_path],
        cwd=BASE,
    )

    concat(remix_out, ["MorePudding.js"] + REMIX_PARTS)

    rewrite_ultra_storage_keys(morepudding_path, ultra_pudding)
    download(LEVEL_EDITOR_URL, le_path)
    concat(ultra_out, ["MorePudding.ultra.js"] + ULTRA_PARTS)


if __name__ == "__main__":
    main()
