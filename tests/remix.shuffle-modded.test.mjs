import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

function loadLogic() {
  const code = fs.readFileSync(
    path.join(ROOT, "src/ShuffleModdedInit.js"),
    "utf8"
  );
  const sandbox = { window: {}, console, Math, Set, Object, Number };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.remixShuffleModdedLogic;
}

describe("shuffle incl. modded modes (pools)", () => {
  const logic = loadLogic();

  it("keeps vanilla modes and appended modes, and drops Peaceful and Blender", () => {
    const pool = [...logic.trophyPool(32)];
    assert.deepEqual(pool.slice(0, 21), [...Array(21).keys()]);
    assert.equal(pool.includes(21), false);
    assert.equal(pool.includes(22), false);
    assert.deepEqual(pool.slice(21), [23, 24, 25, 26, 27, 28, 29, 30, 31]);
    assert.equal(logic.trophyPool(23).includes(22), false);
    assert.deepEqual([...logic.trophyPool(22)], [...Array(21).keys()]);
  });

  it("keeps vanilla counts except tally, and keeps every modded count", () => {
    assert.deepEqual([...logic.countPool(7)], [0, 1, 2, 3, 4, 5]);
    const pool = [...logic.countPool(16)];
    assert.equal(pool.includes(6), false);
    assert.deepEqual(
      pool,
      [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    );
  });

  it("skips the current apple, color, theme, and trophy", () => {
    const rows = {
      apple: 26,
      color: 22,
      theme: 9,
      graphics: 7,
      trophy: 32,
      count: 16,
      speed: 17,
      size: 12,
    };
    const chosen = logic.chooseSettings(
      { rows, current: { apple: 0, color: 3, theme: 1, trophy: 0 } },
      () => 0
    );
    assert.equal(chosen.apple, 1);
    assert.equal(chosen.color, 0);
    assert.equal(chosen.theme, 0);
    assert.equal(chosen.trophy, 1);
    assert.equal(chosen.graphics, 0);
  });

  it("can land on a modded mode, speed, size, and count", () => {
    const rows = {
      apple: 26,
      color: 22,
      theme: 9,
      graphics: 7,
      trophy: 32,
      count: 16,
      speed: 17,
      size: 12,
    };
    const chosen = logic.chooseSettings(
      { rows, current: { apple: 0, color: 0, theme: 0, trophy: 0 } },
      () => 0.999999
    );
    assert.equal(chosen.trophy, 31);
    assert.equal(chosen.apple, 25);
    assert.equal(chosen.color, 21);
    assert.equal(chosen.speed, 16);
    assert.equal(chosen.size, 11);
    assert.equal(chosen.count, 15);
    assert.ok(chosen.speed > 2);
    assert.ok(chosen.count !== 6);
  });

  it("leaves trophy, count, speed, and size alone during a daily challenge", () => {
    const chosen = logic.chooseSettings(
      {
        daily: true,
        rows: { apple: 25, color: 19, theme: 9, graphics: 4, trophy: 32, count: 16, speed: 17, size: 12 },
        current: { apple: 1, color: 1, theme: 1, trophy: 4 },
      },
      () => 0
    );
    assert.equal("trophy" in chosen, false);
    assert.equal("count" in chosen, false);
    assert.equal("speed" in chosen, false);
    assert.equal("size" in chosen, false);
    assert.equal(typeof chosen.apple, "number");
  });

  it("blends at least two modes, then stops unless the 30% roll hits", () => {
    const pool = logic.buildBlenderPool(() => true);
    assert.equal(pool.length, 28);
    assert.equal(pool.filter((x) => x.kind === "native").length, 20);
    assert.equal(pool.some((x) => x.flag === "candy_blending"), true);
    assert.equal(pool.some((x) => x.id === "remix-slot-blend"), false);
    const stopped = logic.blenderPick(pool, () => 0.99);
    assert.equal(stopped.length, 2);
    const all = logic.blenderPick(pool, () => 0);
    assert.equal(all.length, pool.length);
    const present = logic.buildBlenderPool((id) => id === "remix-fear-blend");
    assert.deepEqual(
      [...present.filter((x) => x.kind === "mod").map((x) => x.flag)],
      ["fear_blending"]
    );
  });

  it("treats Disable Randomizer, pointer-events, and the Disabled label as off", () => {
    assert.equal(logic.controlDisabled({}), false);
    assert.equal(
      logic.controlDisabled({ text: "Shuffle", pointerEvents: "auto" }),
      false
    );
    assert.equal(logic.controlDisabled({ disableRandom: true }), true);
    assert.equal(logic.controlDisabled({ pointerEvents: "none" }), true);
    assert.equal(logic.controlDisabled({ text: " Disabled " }), true);
  });

  it("is concatenated into both committed bundles", () => {
    for (const name of ["RemixMod.js", "RemixUltraMod.js"]) {
      const text = fs.readFileSync(path.join(ROOT, name), "utf8");
      const at = text.indexOf('btn.id = "remix-shuffle-modded"');
      assert.ok(at > 0, name);
      assert.ok(text.includes("Shuffle incl. modded modes"));
    }
    const ultra = fs.readFileSync(path.join(ROOT, "RemixUltraMod.js"), "utf8");
    const buttonAt = ultra.indexOf("remix-shuffle-modded");
    const levelAt = ultra.indexOf("window.levelEditorMod = {}");
    assert.ok(buttonAt < levelAt);
  });
});

describe("shuffle incl. modded modes (browser)", { skip: !runBrowser }, () => {
  it("adds the button, reaches a modded mode, and disables it with shuffle", async () => {
    const { launchHarness } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 7, headless: true });
    try {
      await openSettings(h.page);
      const shots = path.join("/opt/cursor/artifacts");
      fs.mkdirSync(shots, { recursive: true });
      await shotToolbar(h.page, path.join(shots, "shuffle-modded-enabled.png"));

      const info = await h.page.evaluate(() => {
        const orig = document.querySelector('[jsname="qycu7d"]');
        const extra = document.getElementById("remix-shuffle-modded");
        const trophy = document.getElementById("trophy");
        return {
          origAction: orig && orig.getAttribute("jsaction"),
          origLabel: orig && orig.getAttribute("aria-label"),
          extraLabel: extra && extra.getAttribute("aria-label"),
          extraTitle: extra && extra.getAttribute("title"),
          nextToOrig: orig && extra && orig.nextElementSibling === extra,
          sameClass: extra && extra.classList.contains("FL0z2d"),
          hidden: extra && extra.classList.contains("LaTyvd"),
          hasSvg: !!(extra && extra.querySelector("svg")),
          modes: window.remixShuffleModdedLogic.trophyPool(trophy.children.length),
          candy: window.CANDY_MODE,
          slot: window.SLOT_MACHINE_MODE,
          menu: !!(window._puddingSnakeMenu && window._puddingSnakeP7),
        };
      });
      assert.equal(info.origAction, "Km979c");
      assert.equal(info.origLabel, "Shuffle");
      assert.equal(info.extraLabel, "Shuffle incl. modded modes");
      assert.equal(info.extraTitle, "Shuffle incl. modded modes");
      assert.equal(info.nextToOrig, true);
      assert.equal(info.sameClass, true);
      assert.equal(info.hidden, false);
      assert.equal(info.hasSvg, true);
      assert.equal(info.menu, true);
      assert.ok(info.candy >= 23);
      assert.ok(info.modes.includes(info.candy));
      assert.ok(info.modes.includes(info.slot));
      assert.equal(info.modes.includes(21), false);
      assert.equal(info.modes.includes(22), false);

      const forced = await h.page.evaluate(() => {
        const menu = window._puddingSnakeMenu;
        const pool = window.remixShuffleModdedLogic.trophyPool(
          document.getElementById("trophy").children.length
        );
        const choices = pool.filter((i) => i !== menu.settings.ob);
        let call = 0;
        const ok = window.remixShuffleModdedRun(() => {
          call += 1;
          return call === 5 ? 0.999999 : 0;
        });
        return {
          ok,
          ob: menu.settings.ob,
          expected: choices[choices.length - 1],
          daily: !!menu.settings.Ga,
        };
      });
      assert.equal(forced.daily, false);
      assert.equal(forced.ok, true);
      assert.equal(forced.ob, forced.expected);
      assert.ok(forced.ob >= 23, "modded mode " + forced.ob);

      await h.page.click('[jsname="qycu7d"]');
      const native = await h.page.evaluate(() => ({
        action: document.querySelector('[jsname="qycu7d"]').getAttribute("jsaction"),
        ob: window._puddingSnakeMenu.settings.ob,
      }));
      assert.equal(native.action, "Km979c");
      assert.ok(native.ob <= 20, "native shuffle stayed vanilla: " + native.ob);

      await h.page.evaluate(() => window.ToggleRandom());
      await shotToolbar(h.page, path.join(shots, "shuffle-modded-disabled.png"));
      const disabled = await h.page.evaluate(() => {
        const orig = document.querySelector('[jsname="qycu7d"]');
        const extra = document.getElementById("remix-shuffle-modded");
        const ob = window._puddingSnakeMenu.settings.ob;
        const ran = window.remixShuffleModdedRun(() => 0);
        extra.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        return {
          flag: window.pudding_settings.DisableRandom,
          origText: orig.textContent,
          extraText: extra.textContent,
          origPe: orig.style.pointerEvents,
          extraPe: extra.style.pointerEvents,
          origColor: orig.style.color,
          extraColor: extra.style.color,
          ran,
          ob,
          after: window._puddingSnakeMenu.settings.ob,
        };
      });
      assert.equal(disabled.flag, true);
      assert.equal(disabled.origText, "Disabled");
      assert.equal(disabled.extraText, "Disabled");
      assert.equal(disabled.origPe, "none");
      assert.equal(disabled.extraPe, "none");
      assert.equal(disabled.origColor, "grey");
      assert.equal(disabled.extraColor, "grey");
      assert.equal(disabled.ran, false);
      assert.equal(disabled.after, disabled.ob);

      await h.page.evaluate(() => window.ToggleRandom());
      const enabled = await h.page.evaluate(() => {
        const orig = document.querySelector('[jsname="qycu7d"]');
        const extra = document.getElementById("remix-shuffle-modded");
        return {
          flag: window.pudding_settings.DisableRandom,
          origSvg: !!orig.querySelector("svg"),
          extraSvg: !!extra.querySelector("svg"),
          extraLabel: extra.getAttribute("aria-label"),
          extraPe: extra.style.pointerEvents,
        };
      });
      assert.equal(enabled.flag, false);
      assert.equal(enabled.origSvg, true);
      assert.equal(enabled.extraSvg, true);
      assert.equal(enabled.extraLabel, "Shuffle incl. modded modes");
      assert.equal(enabled.extraPe, "auto");
      await h.page.evaluate(() => {
        document.querySelector('[jsname="qycu7d"]').classList.add("LaTyvd");
      });
      await h.page.waitForFunction(() =>
        document.getElementById("remix-shuffle-modded").classList.contains("LaTyvd")
      );
      await h.page.evaluate(() => {
        document.querySelector('[jsname="qycu7d"]').classList.remove("LaTyvd");
      });
      await h.page.waitForFunction(
        () =>
          !document
            .getElementById("remix-shuffle-modded")
            .classList.contains("LaTyvd")
      );

      const blend = await h.page.evaluate(() => {
        const menu = window._puddingSnakeMenu;
        menu.oa = "combo";
        window.candy_blending = false;
        window.fear_blending = false;
        const ok = window.remixShuffleModdedRun(() => 0);
        const wall = menu.settings.Ua && menu.settings.Ua.get(1);
        const peaceful = menu.settings.Ua && menu.settings.Ua.get(21);
        return {
          ok,
          candy: window.candy_blending,
          fear: window.fear_blending,
          candyBtn: document.getElementById("remix-candy-blend")?.className || "",
          wallOn: !!(wall && wall.classList.contains("lH9Ipd")),
          peacefulOn: !!(peaceful && peaceful.classList.contains("lH9Ipd")),
        };
      });
      assert.equal(blend.ok, true);
      assert.equal(blend.candy, true);
      assert.equal(blend.fear, true);
      assert.match(blend.candyBtn, /lH9Ipd/);
      assert.equal(blend.wallOn, true);
      assert.equal(blend.peacefulOn, false);
      assert.deepEqual(h.modErrors(), []);
    } finally {
      await h.close();
    }
  });

  it("installs the same button in Ultra Remix, including the animated color", async () => {
    const { launchHarness, ultraHarnessOpts } = await import("../tools/harness.mjs");
    const h = await launchHarness(ultraHarnessOpts({ seed: 9, headless: true }));
    try {
      await openSettings(h.page);
      const shots = path.join("/opt/cursor/artifacts");
      fs.mkdirSync(shots, { recursive: true });
      await shotToolbar(h.page, path.join(shots, "shuffle-modded-ultra.png"));
      const info = await h.page.evaluate(() => {
        const extra = document.getElementById("remix-shuffle-modded");
        const orig = document.querySelector('[jsname="qycu7d"]');
        const colorN = document.getElementById("color").children.length;
        window.ToggleRandom();
        const disabled = extra.textContent === "Disabled" && orig.textContent === "Disabled";
        window.ToggleRandom();
        return {
          label: extra && extra.getAttribute("aria-label"),
          beside: orig && extra && orig.nextElementSibling === extra,
          animated: window.ANIMATED_COLOR_INDEX,
          colorN,
          disabled,
          restored: !!extra.querySelector("svg"),
        };
      });
      assert.equal(info.label, "Shuffle incl. modded modes");
      assert.equal(info.beside, true);
      assert.ok(info.animated >= 0 && info.animated < info.colorN);
      assert.equal(info.disabled, true);
      assert.equal(info.restored, true);
      assert.deepEqual(h.modErrors(), []);
    } finally {
      await h.close();
    }
  });
});

async function openSettings(page) {
  await page.waitForSelector('[jsname="iyH4Cb"]', { timeout: 60000 });
  await page.click('[jsname="iyH4Cb"]');
  await page.waitForFunction(
    () => {
      const shuffle = document.querySelector('[jsname="qycu7d"]');
      const extra = document.getElementById("remix-shuffle-modded");
      return (
        shuffle &&
        extra &&
        !shuffle.classList.contains("LaTyvd") &&
        window._puddingSnakeMenu &&
        window._puddingSnakeMenu.oa === "settings"
      );
    },
    null,
    { timeout: 30000 }
  );
}

async function shotToolbar(page, file) {
  const extra = page.locator("#remix-shuffle-modded");
  const parent = extra.locator("xpath=..");
  await parent.screenshot({ path: file });
}
