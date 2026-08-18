# GoogleSnakeRemix

Remix Mod for Google Snake — adds **Chess Mode**, **Candy Mode** and **Burger Mode** on top of **More Pudding Mod**, targeting game **v13** (`googlesnakemods.com/v/current`).

## Features

- **Candy Mode** — extra snake length (+1..+6) per fruit; own trophy after Blender
- **Chess Mode** — chess-piece apples with attack/unlock rules; own trophy (does **not** replace Shield)
- **Burger Mode** — every fruit carries a timer; it greys out as it ages, turns into a skull poison when it runs out, and a fresh one spawns. Eating a fresh fruit clears every poison on the board; eating a poison costs you control like native Poison mode.
- **Cat Speed** — between Normal and Fast in feel (`0.85×`), appended after MoreMenu speeds
- **Blue / Green / Black Dice** — DiceMod-style counts (roll **1–12** / **4–9** / **custom spawn range**) when the last apple is eaten; tinted game dice icons after Nuke. **Black Dice** min/max fruits per roll (default **6–24**, clamp **1–10000**) are set in Pudding Settings.
- **Blender** — separate Candy, Chess and Burger toggles with their own icons in the Blender panel. In Burger+Chess, expired pieces become plain skull poisons (no chess-piece status, cannot be unlocked).
- **Pause** — press **Q** to pause/unpause (PauseMod, included in both Remix and Remix Ultra)

## Build

Requires Python 3.

```bash
python RemixBuilder.py
```

This downloads `MorePudding.js` (and bootstrap CSS) from [GoogleSnakePudding](https://github.com/DarkSnakeGang/GoogleSnakePudding), applies Remix CE-level SRC patches, then concatenates:

1. `MorePudding.js`
2. `CandyInit.js`
3. `ChessInit.js`
4. `BurgerInit.js`
5. `CatSpeedInit.js`
6. `DiceCountsInit.js`
7. `RemixSpeedInfoInit.js`
8. `CspMenuIcons.js`
9. `PauseInit.js`
10. `RemixInit.js`

Output: **`RemixMod.js`** (committed for raw-GitHub / custom URL use). The same command also writes **`RemixUltraMod.js`** (Remix + Level Editor v13). See RemixUltra below.

More Pudding already bundles Pudding Mod, Visibility Mod and More Menu Mod and runs them in that order, so Remix calls `window.MorePudding` rather than wiring those three itself. `RemixInit.js` still falls back to Pudding + Visibility directly if a build ever ships without More Pudding.

**Settings isolation:** Remix persists to `RemixSettings` and `snake_timeKeeper_remix` (seeded once from Pudding’s keys if empty) so extra trophies/counts/speeds and Remix-only options never overwrite plain PuddingMod’s `PuddingSettings` / `snake_timeKeeper`.

**Pudding Settings:** The sidebar uses **Play | Stats | Setup** tabs (same layout and control sizes in Remix and Remix Ultra). Speed Info / split panel / scrollbar toggles stay hidden; Black Dice min/max live on Setup. Setup has a **Show / Hide Visibility settings** button for the Visibility overlay.

**ModeRegistry:** Upstream TimeKeeper / SpeedInfo now use stable mode keys (`chess`, `wall+burger`, …). Remix registers Candy/Chess/Burger, detects Blender by `random.png` (not “last trophy”), and keeps blender mix keys in sync with the Remix blend toggles.

**SpeedInfo:** Remix keeps the toggle usable and shows TimeKeeper / SRC data only in **Chess** and **Burger**; every other mode shows `Switch to PuddingMod`. Chess/Burger map to Category Extensions level boards (including High Score), matching FastSnakeStats. TimeKeeper for those modes only tracks **official counts through Tally** (plus Normal/Fast/Slow and Standard/Small/Large) — not MoreMenu or colored-dice counts.

**Timer settings:** The Custom Timer/Splits dialog's mode row adds **Candy**, **Chess**, and **Burger** so those modes can store PBs/splits like the vanilla ones.

## Load

On [googlesnakemods.com](https://googlesnakemods.com/v/current/), use custom URL / Mod Loader pointing at:

`https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakeRemix/main/RemixMod.js`

The exported API object is `window.RemixMod`.

## RemixUltra (Remix + Level Editor)

A second loadable bundle that is Remix plus [Level Editor v13](https://github.com/DarkSnakeGang/GoogleSnakeLevelEditor/tree/v13). Remix itself is unchanged.

**Desktop only** — Level Editor has no mobile support.

Custom URL:

`https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakeRemix/main/RemixUltraMod.js`

API: `window.RemixUltraMod` (the bundle also aliases `window.RemixMod` to Ultra so a leftover custom-mod name of `RemixMod` still runs the Ultra chain).

Settings are isolated to `RemixUltraSettings` and `snake_timeKeeper_remix_ultra` (seeded once from Remix keys if empty). Saving Ultra does not write `PuddingSettings` or `RemixSettings`.

Menus share one right dock and one left dock with tabs (**Place | Presets | More** on the right, **Custom | Challenge | Splits** on the left) instead of stacking every 220px sidebar. Full-screen Pudding overlays hide the docks and restore the previous tab when closed. The canvas label is **Remix Ultra**.

**Presets / Challenge:** clicking a Presets thumbnail (or Random HAM) still hard-resets and immediately blits that pattern onto the board, same as Level Editor. Challenge lives on the left dock instead of the old CHALLENGE button; picking a level (and Speedrun mode) is unchanged, and the selected level applies on tab open and on dropdown change.

**Place tabs:** the right-hand Place dock has inner tabs **Original Fruit | Pudding Fruit | Objects | Key | Chess**. Original is vanilla apples `0–23`. Pudding lists More Pudding fruits (not chess pieces, goldens, or the skull). Objects cover wall, sokobox, sokogoal, bridge, both gate orientations, poison (Normal skull, not Realism), arrows, shields, mines, and statues (cracked has the crack overlay). Key is one tab with keys `0–23` over matching keyblocks (the in-game `key_types` sheet). Chess plants an exact piece (`isPiece`, no random assign). Live clicks overwrite the cell. A shield click plants fruit if the cell is empty, then toggles that edge. Click other shield directions on the same fruit to keep several sides at once (native `nba` set).

**Custom codes** stay space-separated with no version header. Old `17x15 A11,7 W3,4 B5,5 S4,1` still imports (`A` is apple type 0). Export writes apple type and these extra letters: `Y` sokogoal, `C` bridge, `Ex,y,h|v` gate, `P` poison, `V` arrow, `Hx,y,ULDR` shield sides on a fruit (`H5,5,U` or packed `H5,5,UL`), `N` mine, `Tx,y,0|1` statue, `Fx,y,bB` chess piece, `K` key, `L` keyblock. PNG presets are unchanged.

**Custom brush:** the left Custom dock is the canvas, not a second palette. A **Paint | Start | Erase** row plus a status line is the whole tool UI. Paint uses whatever is selected in the right-hand Place dock. Start drops the snake spawn. Erase (and right-click) deletes. Import / Export / Clear / Refresh sit in a 2×2 grid above map size.

**Custom map sizes** match More Menu `#size` 0–10: Standard 17×15, Small 10×9, Large 24×21, Micro 5×4, Tiny 7×6, Compact 12×11, Super 37×32, Too Big 64×56, Humongous 105×92, Way Too Big 168×147, Enormous 600×530.

Build still uses `python RemixBuilder.py` — it writes both `RemixMod.js` and `RemixUltraMod.js`. Level Editor source is re-downloaded each build; Place/object work lives in `UltraPlaceInit.js` so `LevelEditorInit.js` and `RemixMod.js` stay untouched.

## Mode IDs (v13)

| Mode   | ID |
|--------|----|
| Blender | 22 (native) |
| Candy   | 23 (appended) |
| Chess   | 24 (appended) |
| Burger  | 25 (appended) |

Modes claim their trophy slots after More Pudding has added its own, so the ids sit at the end of the list. Shield (15) remains a normal playable mode. Chess uses Shield **physics** only while Chess (or Chess-in-Blender) is active.

## Chess spawn rules (summary)

Chess reuses **Portal’s pair layout** at start (`Y3E` force) and Portal’s all-or-nothing pair spawner for respawns:

| Count | Start pieces | After fruit eat (not unlock) |
|-------|--------------|------------------------------|
| 1 / 3 / 5 / 10 | 2 / 6 / 10 / 20 | +2 |
| Dice | 2 | 2×roll (1–6) |
| Bomb | 2 | 48, then +2 each later fruit |
| Tally | 10 (sequenced) | +10 after last index of a wave |

**Unlock ≠ eat:** geometry converts exactly one opposite piece to fruit and returns to `OPEN` (no score, no spawn). Half-pairs are never spawned.

## Burger rules (summary)

- Classic start and layout — no poison pairs (native Poison's `uaF` half-board pairing is gated off).
- Each fresh fruit gets a timer of `W+H−7`, plus snake length while length ≤ half the board, then minus the overshoot after that (no random stagger). Existing fruits keep their countdown when you eat; only the respawned/new fruit rolls a new timer.
- On expiry a fresh fruit becomes a skull poison that inherits that fruit's max as its own silent timer (no grey circle); a replacement fresh fruit also spawns (Tally keeps the same sequence number). When a poison's timer hits zero it simply disappears.
- Eating a fresh fruit does **not** clear poisons — they keep counting down on their own. Only the respawned/new fruit rolls a new timer; existing fresh fruits keep theirs.
- Eating a poison triggers native Poison control loss, with no score and no growth.
- Late game (`body length >= W*H - 5`) fresh fruit never spawns on the head's four neighbours, and you win only once no fresh fruit remains and no legal spawn is left.

### Fruit type numbering

Pudding addresses its own trailing fruits by offset from the end of `new_fruit`: the skull poison sprite is the **last** entry and `goldenIndex` is `length - 6`. Chess therefore splices its twelve pieces in *ahead* of that six-entry tail instead of appending. Appending past it rebinds both — poisons render as a white rook and the golden-fruit restore clobbers piece types.

## Dev tooling

Requires Node 18+ and Python 3.

```bash
npm install                 # also installs Playwright Chromium
python RemixBuilder.py     # or: npm run build
npm run fetch-game         # cache game JS into .cache/
npm run check              # assert patch regexes still match
npm test                   # offline unit tests (+ patchcheck)
RUN_BROWSER_TESTS=1 npm test   # live browser suites (needs network)
npm run board              # ASCII dump Chess vs Portal → tools/fixtures/
npm run capture            # dump original ChessMod on /v/3
```

`npm run check` only validates patterns against the **raw** game code. Patches that run late in the chain match text that earlier mods have already rewritten (More Menu, for instance, respaces operators in the statements it touches), so those need the browser suites to catch. `launchHarness({ debug: true })` stashes the code Burger sees as `window.__remixPreBurgerCode`, and `harness.modErrors()` surfaces patch failures logged during load.

| Path | Role |
|------|------|
| `tools/harness.mjs` | Playwright boot of `v/current` with local `RemixMod.js` |
| `tools/patchcheck.mjs` | Patch-target regex gate |
| `tools/board.mjs` | Side-by-side board dump |
| `tools/capture-v3.mjs` | Legacy ChessMod reference |
| `tools/fixtures/` | Spawn tables / captures |
| `tests/` | node:test suites |

## Source layout

| File | Role |
|------|------|
| `RemixBuilder.py` | Fetch More Pudding + Level Editor; concat Remix and RemixUltra |
| `UltraInit.js` | `window.RemixUltraMod` chain, dock tabs, LE+Chess/Burger hooks |
| `UltraPlaceInit.js` | Place inner tabs, object placers, custom export letters, MoreMenu sizes |
| `RemixUltraMod.js` | Built Ultra bundle (Remix + Level Editor) |
| `ChessInit.js` | Chess mode + blender toggle + fruit inject + Chess Pieces visibility row |
| `CandyInit.js` | Candy mode + blender toggle |
| `BurgerInit.js` | Burger mode + blender toggle |
| `PauseInit.js` | Q-to-pause overlay (PauseMod) |
| `RemixInit.js` | `window.RemixMod` chain + shared blender slot helper |
| `ChessCapture.mp3` | Capture sound |
| `RemixMod.js` | Built Remix bundle |

## Versions

- Game: **v13**
- Legacy Chess last supported: v3; Candy: v5 (see ModLoader `mod-info.json`)
- More Pudding (Pudding + Visibility + More Menu): current `main` (v13)
- PauseMod: bundled via `PauseInit.js` (Q key)
- Frozen v12 snapshot: git branch `v12`
