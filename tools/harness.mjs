/**
 * Playwright harness: boot googlesnakemods.com/v/current with local RemixMod.js
 * via ModLoader customUrl localStorage + route fulfillment.
 */
import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DEFAULT_MOD_FILE = "RemixMod.js";

function resolveModPath(opts = {}) {
  return path.join(ROOT, opts.modFile || DEFAULT_MOD_FILE);
}

export const MODE = {
  CLASSIC: 0,
  PORTAL: 2,
  SHIELD: 15,
  BLENDER: 22,
};

export const COUNT = {
  ONE: 0,
  THREE: 1,
  FIVE: 2,
  TEN: 3,
  DICE: 4,
  BOMB: 5,
  TALLY: 6,
};

export const SIZE = {
  NORMAL: 0,
  SMALL: 1,
  LARGE: 2,
};

export function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function startModServer(modPath, urlName) {
  const server = http.createServer((req, res) => {
    if (req.url === `/${urlName}` || req.url === "/") {
      res.writeHead(200, {
        "Content-Type": "application/javascript; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      });
      res.end(fs.readFileSync(modPath));
      return;
    }
    res.writeHead(404);
    res.end();
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        server,
        port,
        customUrl: `http://127.0.0.1:${port}/${urlName}`,
      });
    });
  });
}

export function ultraHarnessOpts(extra = {}) {
  return {
    modFile: "RemixUltraMod.js",
    customModName: "RemixUltraMod",
    indicator: "Remix Ultra v14",
    ...extra,
  };
}

/**
 * @param {{ seed?: number, headless?: boolean, modFile?: string, customModName?: string, indicator?: string }} opts
 */
export async function launchHarness(opts = {}) {
  const seed = opts.seed ?? 42;
  const headless = opts.headless !== false;
  const modFile = opts.modFile || DEFAULT_MOD_FILE;
  const modPath = resolveModPath(opts);
  const customModName = opts.customModName || "RemixMod";
  const indicator = opts.indicator || "Remix Mod v14";

  if (!fs.existsSync(modPath)) {
    throw new Error(`${modFile} missing — run: python RemixBuilder.py`);
  }

  const { server, customUrl } = await startModServer(modPath, modFile);
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext();
  // v14 site loader: with any mod selected it sync-XHRs a google.com/xjs script
  // that isn't in v14's urlMap and CORS blocks it, so snake.js never loads.
  // Until the site is fixed, answer those requests with CORS headers here.
  await context.route(
    (url) => url.href.includes("www.google.com/xjs/"),
    async (route) => {
      // The page can close mid-request when a test ends; ignore that.
      try {
        const resp = await route.fetch();
        await route.fulfill({
          response: resp,
          headers: { ...resp.headers(), "access-control-allow-origin": "*" },
        });
      } catch (_e) {
        await route.abort().catch(() => {});
      }
    }
  );
  const page = await context.newPage();

  // Attached before navigation so mod-time patch failures are not missed.
  const consoleLog = [];
  page.on("console", (msg) => {
    const entry = { type: msg.type(), text: msg.text() };
    consoleLog.push(entry);
    if (opts.onConsole) opts.onConsole(entry);
  });
  page.on("pageerror", (err) => {
    const entry = { type: "pageerror", text: err.message };
    consoleLog.push(entry);
    if (opts.onConsole) opts.onConsole(entry);
  });

  await page.route(customUrl, async (route) => {
    const body = fs.readFileSync(modPath);
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body,
    });
  });

  await page.addInitScript(
    ({ url, seedVal, debug, name }) => {
      if (debug) window.RemixDebug = true;
      localStorage.setItem("snakeForceDevMode", "true");
      localStorage.setItem("snakeChosenMod", "customUrl");
      localStorage.setItem(
        "snakeAdvancedSettings",
        JSON.stringify({
          customModName: name,
          customUrl: url,
        })
      );
      let s = seedVal >>> 0;
      Math.random = function () {
        s |= 0;
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    },
    {
      url: customUrl,
      seedVal: seed,
      debug: !!opts.debug,
      name: customModName,
    }
  );

  await page.goto("https://googlesnakemods.com/v/current/", {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });

  await page.waitForFunction(
    ({ text, api }) =>
      !!document.body?.innerText?.includes(text) ||
      window.CHESS_MODE != null ||
      window[api],
    { text: indicator, api: customModName },
    { timeout: 120000 }
  );

  const api = {
    page,
    browser,
    server,
    seed,
    customUrl,
    consoleLog,

    modErrors() {
      return consoleLog.filter(
        (e) =>
          e.type === "pageerror" ||
          (e.type === "error" &&
            (/^(CandyMod|ChessMod|BurgerMod|CatMod|MexicoMod|BombFruitMod|TempWallsMod|FearMod|SlotMachineMod|RemixMod|RemixUltraMod):/.test(
              e.text
            ) ||
              /failed to (find|patch|expose)/i.test(e.text) ||
              /Level Editor alterSnakeCode failed/i.test(e.text)))
      );
    },

    async start({ mode, count = COUNT.ONE, speed = 0, size = SIZE.NORMAL }) {
      const bootGame = async () => {
        const clickPlay = () =>
          page.evaluate(() => {
            const plays = [
              ...document.querySelectorAll("div[role=button],button"),
            ].filter((el) => (el.innerText || "").trim() === "Play");
            const visible = plays.find((el) => {
              const r = el.getBoundingClientRect();
              return (
                r.width > 0 &&
                r.height > 0 &&
                el.id !== "ultra-settings-tab-play"
              );
            });
            (visible || plays[plays.length - 1] || plays[0])?.click();
          });

        for (let attempt = 0; attempt < 3; attempt++) {
          if (await page.evaluate(() => !!window.__remixGame)) return;
          await clickPlay();
          await page.waitForTimeout(400);
          await page.keyboard.press("ArrowRight");
          try {
            await page.waitForFunction(() => !!window.__remixGame, null, {
              timeout: 45000,
            });
            return;
          } catch (err) {
            if (attempt === 2) throw err;
            await page.reload({ waitUntil: "domcontentloaded", timeout: 120000 });
            await page.waitForFunction(
              ({ text, api }) =>
                !!document.body?.innerText?.includes(text) ||
                window.CHESS_MODE != null ||
                window[api],
              { text: indicator, api: customModName },
              { timeout: 120000 }
            );
          }
        }
      };

      await bootGame();

      return page.evaluate(
        ({ mode, count, speed, size }) => {
          let modeId = mode;
          if (mode === "chess") modeId = window.CHESS_MODE;
          if (mode === "candy") modeId = window.CANDY_MODE;
          if (mode === "burger") modeId = window.BURGER_MODE;
          if (mode === "cat") modeId = window.CAT_MODE;
          if (mode === "mexico") modeId = window.MEXICO_MODE;
          if (mode === "bomb" || mode === "bomb_fruit") modeId = window.BOMB_FRUIT_MODE;
          if (mode === "temp_walls" || mode === "temp-walls") modeId = window.TEMP_WALLS_MODE;
          if (mode === "slot" || mode === "slot_machine") modeId = window.SLOT_MACHINE_MODE;
          if (mode === "fear") modeId = window.FEAR_MODE;
          if (mode === "portal") modeId = 2;
          if (mode === "shield") modeId = 15;
          if (mode === "classic") modeId = 0;

          const g = window.__remixGame;
          window.CurrentModeNum = modeId;
          // Game v14 settings: menu mode/count/speed/size = wb/Ca/Ra/Ua,
          // gameplay mode/count/speed/size = yb/ka/Lb/Aa.
          g.settings.wb = modeId;
          g.settings.Ca = count;
          g.settings.Ra = speed;
          g.settings.Ua = size;
          g.settings.yb = modeId;
          g.settings.ka = count;
          g.settings.Lb = speed;
          g.settings.Aa = size;

          // v14: apple manager is g.oa, snake is g.Yc.
          g.oa.reset();
          // Ensure a playable heading — reset can leave direction NONE until
          // the first key, which breaks eat-placement tests.
          if (g.Yc && (g.Yc.direction == null || g.Yc.direction === "NONE")) {
            g.Yc.direction = "RIGHT";
          }
          // Native play-start also runs l4E/uaF when mode 10 is active. Burger
          // gates it; calling the live binding here keeps Burger harness
          // starts honest to that path (and must not run for other modes).
          // Fear uses the same poison-pair path (ghosts), so invoke it too.
          if (
            (window.isBurgerActive && window.isBurgerActive()) ||
            (window.isFearActive && window.isFearActive())
          ) {
            const pair =
              typeof window.__uaF === "function"
                ? window.__uaF
                : window.__l4E;
            if (typeof pair === "function") pair(g.oa);
          }
          // The reset above re-arms Burger's "sanitize on first tick". Whether a
          // live game tick runs before the test edits timers is a race, so do
          // that first-tick sanitize here.
          if (
            window.isBurgerActive &&
            window.isBurgerActive() &&
            typeof window.burger_sanitize_start === "function"
          ) {
            window.burger_sanitize_start(g.oa, g);
            window.__burgerStartOk = true;
          }
          window.appleArray = g.oa.ka;

          return {
            modeId,
            chessMode: window.CHESS_MODE,
            candyMode: window.CANDY_MODE,
            burgerMode: window.BURGER_MODE,
            apples: g.oa.ka.length,
            pieces: g.oa.ka.filter((a) => a.isPiece).length,
            poisons: g.oa.ka.filter((a) => a.Bea || a.nla).length,
          };
        },
        { mode, count, speed, size }
      );
    },

    async waitForGame(timeout = 30000) {
      await page.waitForFunction(() => !!window.__remixGame, null, {
        timeout,
      });
    },

    async dir(direction) {
      const key = {
        UP: "ArrowUp",
        DOWN: "ArrowDown",
        LEFT: "ArrowLeft",
        RIGHT: "ArrowRight",
      }[direction];
      if (!key) throw new Error("bad dir " + direction);
      await page.keyboard.press(key);
    },

    async tick(n = 1) {
      return page.evaluate((n) => {
        const g = window.__remixGame;
        if (!g || typeof g.tick !== "function") {
          throw new Error("__remixGame.tick missing");
        }
        for (let i = 0; i < n; i++) g.tick();
        return n;
      }, n);
    },

    async state() {
      return page.evaluate(() => {
        const g = window.__remixGame;
        const list = g?.oa?.ka || window.appleArray || [];
        const apples = list.map((a, i) => ({
          i,
          x: a.pos?.x,
          y: a.pos?.y,
          type: a.type,
          isPiece: !!a.isPiece,
          Oka: !!(a.Bea || a.nla),
          nla: !!(a.Bea || a.nla),
          burgerTimer: a.burgerTimer,
          burgerTimerMax: a.burgerTimerMax,
          ChessColor: a.ChessColor,
          ChessPiece: a.ChessPiece,
          sequenceNumber: a.sequenceNumber,
          shields: a.h7 ? [...a.h7] : null,
        }));
        const head = g?.Yc?.ka?.[0] || window.head_pos?.[0];
        const snake = (g?.Yc?.ka || []).map((s) => ({ x: s.x, y: s.y }));
        const boardObj = g?.oa?.oa?.oa || g?.ka?.oa;
        return {
          apples,
          snake,
          head: head ? { x: head.x, y: head.y } : null,
          head_state: window.head_state,
          head_color: window.head_color,
          score: g?.Bi,
          length: g?.Yc?.ka?.length,
          ja: g?.Yc?.Ca,
          nj: !!g?.uj,
          mode: window.CurrentModeNum,
          chessMode: window.CHESS_MODE,
          candyMode: window.CANDY_MODE,
          burgerMode: window.BURGER_MODE,
          burgerFruitsEaten: window.burger_fruits_eaten,
          board: boardObj
            ? { width: boardObj.width, height: boardObj.height }
            : null,
          settings: g?.settings
            ? {
                ub: g.settings.yb,
                ka: g.settings.ka,
                Aa: g.settings.Aa,
                isMobile: g.settings.isMobile,
              }
            : null,
        };
      });
    },

    async ascii() {
      const s = await api.state();
      return renderAscii(s);
    },

    async close() {
      await browser.close();
      await new Promise((r) => server.close(r));
    },
  };

  return api;
}

export function renderAscii(state) {
  if (!state.board) return "(no board)";
  const { width, height } = state.board;
  const grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ".")
  );
  for (const a of state.apples || []) {
    if (a.x == null || a.y == null) continue;
    if (a.y >= 0 && a.y < height && a.x >= 0 && a.x < width) {
      const ch = a.isPiece
        ? a.ChessColor === "w"
          ? "W"
          : a.ChessColor === "b"
            ? "B"
            : "P"
        : "F";
      grid[a.y][a.x] = ch;
    }
  }
  if (state.head) {
    const { x, y } = state.head;
    if (y >= 0 && y < height && x >= 0 && x < width) grid[y][x] = "@";
  }
  const header = `mode=${state.mode} head_state=${state.head_state} score=${state.score} apples=${state.apples?.length}`;
  return header + "\n" + grid.map((row) => row.join("")).join("\n");
}
