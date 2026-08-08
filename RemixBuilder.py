import urllib.request
import os

BASE = os.path.dirname(os.path.abspath(__file__))

# MorePudding = PuddingMod + MoreMenuMod + VisibilityMod + MorePuddingInit.
# It exposes window.MorePudding as well as the individual window.PuddingMod /
# window.VisibilityModCode / window.moreMenu objects it bundles.
MOREPUDDING_URL = "https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakePudding/main/MorePudding.js"
BOOTSTRAP_URL = "https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakePudding/main/bootstrap-stripped.css"

def download(url, dest):
    print(f"Downloading {url} -> {dest}")
    urllib.request.urlretrieve(url, dest)

def main():
    morepudding_path = os.path.join(BASE, "MorePudding.js")
    bootstrap_path = os.path.join(BASE, "bootstrap-stripped.css")
    out_path = os.path.join(BASE, "RemixMod.js")

    download(MOREPUDDING_URL, morepudding_path)
    download(BOOTSTRAP_URL, bootstrap_path)

    parts = [
        "MorePudding.js",
        "CandyInit.js",
        "ChessInit.js",
        "BurgerInit.js",
        "RemixSpeedInfoInit.js",
        "RemixInit.js",
    ]

    with open(out_path, "w", encoding="utf-8") as out:
        for name in parts:
            path = os.path.join(BASE, name)
            print(f"Appending {name}")
            with open(path, "r", encoding="utf-8") as f:
                out.write(f.read())
                out.write("\n")

    print(f"Wrote {out_path}")

if __name__ == "__main__":
    main()
