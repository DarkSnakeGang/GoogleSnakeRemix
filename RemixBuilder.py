import urllib.request
import os
import subprocess

BASE = os.path.dirname(os.path.abspath(__file__))

# MorePudding = PuddingMod + MoreMenuMod + VisibilityMod + MorePuddingInit.
# It exposes window.MorePudding as well as the individual window.PuddingMod /
# window.VisibilityModCode / window.moreMenu objects it bundles.
MOREPUDDING_URL = "https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakePudding/main/MorePudding.js"
BOOTSTRAP_URL = "https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakePudding/main/bootstrap-stripped.css"
LEVEL_EDITOR_URL = "https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakeLevelEditor/v13/modloadercode.js"

REMIX_PARTS = [
    "src/CandyInit.js",
    "src/ChessInit.js",
    "src/BurgerInit.js",
    "src/CatInit.js",
    "src/MexicoInit.js",
    "src/BombFruitInit.js",
    "src/TempWallsInit.js",
    "src/SlotMachineInit.js",
    "src/CatSpeedInit.js",
    "src/DiceCountsInit.js",
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
    urllib.request.urlretrieve(url, dest)


def concat(out_path, parts):
    with open(out_path, "w", encoding="utf-8") as out:
        for name in parts:
            path = os.path.join(BASE, name)
            print(f"Appending {name}")
            with open(path, "r", encoding="utf-8") as f:
                out.write(f.read())
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
