# GoogleSnakeRemix

Remix Mod for Google Snake — adds **Chess Mode**, **Candy Mode** and **Burger Mode** on top of **More Pudding Mod**, targeting game **v12** (`googlesnakemods.com/v/current`).

## Features

- **Candy Mode** — extra snake length (+1..+6) per fruit; own trophy after Blender
- **Chess Mode** — chess-piece apples with attack/unlock rules; own trophy (does **not** replace Shield)
- **Burger Mode** — every fruit carries a timer; it greys out as it ages, turns into a skull poison when it runs out, and a fresh one spawns. Eating a fresh fruit clears every poison on the board; eating a poison costs you control like native Poison mode.
- **Cat Speed** — between Normal and Fast in feel (`0.85×`), appended after MoreMenu speeds
- **Blue / Green / Black Dice** — DiceMod-style counts (roll **1–12** / **4–9** / **custom spawn range**) when the last apple is eaten; tinted game dice icons after Nuke. **Black Dice** min/max fruits per roll (default **6–24**, clamp **1–10000**) are set in Pudding Settings.
- **Blender** — separate Candy, Chess and Burger toggles with their own icons in the Blender panel. In Burger+Chess, expired pieces become plain skull poisons (no chess-piece status, cannot be unlocked).
- **Chess Pieces** hide toggle added to the Visibility panel

## Build

Requires Python 3.

```bash
python RemixBuilder.py
```

This downloads `MorePudding.js` (and bootstrap CSS) from [GoogleSnakePudding](https://github.com/DarkSnakeGang/GoogleSnakePudding), then concatenates:

1. `MorePudding.js`
2. `CandyInit.js`
3. `ChessInit.js`
4. `BurgerInit.js`
5. `CatSpeedInit.js`
6. `DiceCountsInit.js`
7. `RemixSpeedInfoInit.js`
8. `RemixInit.js`

Output: **`RemixMod.js`** (committed for raw-GitHub / custom URL use).

More Pudding already bundles Pudding Mod, Visibility Mod and More Menu Mod and runs them in that order, so Remix calls `window.MorePudding` rather than wiring those three itself. `RemixInit.js` still falls back to Pudding + Visibility directly if a build ever ships without More Pudding.

**ModeRegistry:** Upstream TimeKeeper / SpeedInfo now use stable mode keys (`chess`, `wall+burger`, …). Remix registers Candy/Chess/Burger, detects Blender by `random.png` (not “last trophy”), and keeps blender mix keys in sync with the Remix blend toggles.

**SpeedInfo:** Remix keeps the toggle usable and shows TimeKeeper / SRC data only in **Chess** and **Burger**; every other mode shows `Switch to PuddingMod`. Chess/Burger map to Category Extensions level boards (including High Score), matching FastSnakeStats.

**Timer settings:** The Custom Timer/Splits dialog's mode row adds **Candy**, **Chess**, and **Burger** so those modes can store PBs/splits like the vanilla ones.

## Load

On [googlesnakemods.com](https://googlesnakemods.com/v/current/), use custom URL / Mod Loader pointing at:

`https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakeRemix/main/RemixMod.js`

The exported API object is `window.RemixMod`.

## Mode IDs (v12)

| Mode   | ID |
|--------|----|
| Blender | 22 (native) |
| Candy   | 23 (appended) |
| Chess   | 24 (appended) |
| Burger  | 25 (appended) |

Modes claim their trophy slots after More Pudding has added its own, so the ids sit at the end of the list. Shield (15) remains a normal playable mode. Chess uses Shield **physics** only while Chess (or Chess-in-Blender) is active.

## Chess spawn rules (summary)

Chess reuses **Portal’s pair layout** at start (`iaF` force) and Portal’s all-or-nothing pair spawner for respawns:

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
| `RemixBuilder.py` | Fetch More Pudding + concat build |
| `ChessInit.js` | Chess mode + blender toggle + fruit inject + Chess Pieces visibility row |
| `CandyInit.js` | Candy mode + blender toggle |
| `BurgerInit.js` | Burger mode + blender toggle |
| `RemixInit.js` | `window.RemixMod` chain + shared blender slot helper |
| `ChessCapture.mp3` | Capture sound |
| `RemixMod.js` | Built bundle |

## Versions

- Game: **v12**
- Legacy Chess last supported: v3; Candy: v5 (see ModLoader `mod-info.json`)
- More Pudding (Pudding + Visibility + More Menu): current `main` (v12)
