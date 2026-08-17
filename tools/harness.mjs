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
    indicator: "Remix Ultra",
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
  const indicator = opts.indicator || "Remix Mod";

  if (!fs.existsSync(modPath)) {
    throw new Error(`${modFile} missing — run: python RemixBuilder.py`);
  }

  const { server, customUrl } = await startModServer(modPath, modFile);
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext();
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
            (/^(CandyMod|ChessMod|BurgerMod|RemixMod|RemixUltraMod):/.test(
              e.text
            ) ||
              /failed to (find|patch|expose)/i.test(e.text) ||
              /Level Editor alterSnakeCode failed/i.test(e.text)))
      );
    },

    async start({ mode, count = COUNT.ONE, speed = 0, size = SIZE.NORMAL }) {
      const hasGame = await page.evaluate(() => !!window.__remixGame);
      if (!hasGame) {
        await page.evaluate(() => {
          for (const el of document.querySelectorAll(
            "div[role=button],button"
          )) {
            if ((el.innerText || "").trim() === "Play") {
              el.click();
              return;
            }
          }
        });
        await page.waitForTimeout(400);
        await page.keyboard.press("ArrowRight");
        await page.waitForFunction(() => !!window.__remixGame, null, {
          timeout: 60000,
        });
      }

      return page.evaluate(
        ({ mode, count, speed, size }) => {
          let modeId = mode;
          if (mode === "chess") modeId = window.CHESS_MODE;
          if (mode === "candy") modeId = window.CANDY_MODE;
          if (mode === "burger") modeId = window.BURGER_MODE;
          if (mode === "portal") modeId = 2;
          if (mode === "shield") modeId = 15;
          if (mode === "classic") modeId = 0;

          const g = window.__remixGame;
          window.CurrentModeNum = modeId;
          g.settings.ob = modeId;
          g.settings.Ca = count;
          g.settings.Na = speed;
          g.settings.Sa = size;
          g.settings.ub = modeId;
          g.settings.ka = count;
          g.settings.yb = speed;
          g.settings.Aa = size;

          g.wa.reset();
          // Native play-start also runs uaF when mode 10 is active. Burger
          // gates it; calling the live binding here keeps Burger harness
          // starts honest to that path (and must not run for other modes).
          if (
            window.isBurgerActive &&
            window.isBurgerActive() &&
            typeof window.__uaF === "function"
          ) {
            window.__uaF(g.wa);
          }
          window.appleArray = g.wa.ka;

          return {
            modeId,
            chessMode: window.CHESS_MODE,
            candyMode: window.CANDY_MODE,
            burgerMode: window.BURGER_MODE,
            apples: g.wa.ka.length,
            pieces: g.wa.ka.filter((a) => a.isPiece).length,
            poisons: g.wa.ka.filter((a) => a.nla).length,
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
        const list = g?.wa?.ka || window.appleArray || [];
        const apples = list.map((a, i) => ({
          i,
          x: a.pos?.x,
          y: a.pos?.y,
          type: a.type,
          isPiece: !!a.isPiece,
          nla: !!a.nla,
          burgerTimer: a.burgerTimer,
          burgerTimerMax: a.burgerTimerMax,
          ChessColor: a.ChessColor,
          ChessPiece: a.ChessPiece,
          sequenceNumber: a.sequenceNumber,
          shields: a.Oba ? [...a.Oba] : null,
        }));
        const head = g?.oa?.ka?.[0] || window.head_pos?.[0];
        const snake = (g?.oa?.ka || []).map((s) => ({ x: s.x, y: s.y }));
        const boardObj = g?.wa?.oa?.oa || g?.oa?.oa || g?.ka?.oa;
        return {
          apples,
          snake,
          head: head ? { x: head.x, y: head.y } : null,
          head_state: window.head_state,
          head_color: window.head_color,
          score: g?.Oh,
          length: g?.oa?.Ta,
          ja: g?.oa?.Ja,
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
                ub: g.settings.ub,
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
