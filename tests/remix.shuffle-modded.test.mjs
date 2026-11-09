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

  it("replaces the native shuffle function and leaves the following function intact", () => {
    const patch = loadPatch();
    const sample =
      'a8E=function(a){if(a.visible){if(a.oa===\n"settings"){var b=Math.floor(Math.random()*24);b+=b>=a.settings.Fb?1:0;}_.Ow(a.qc)}},b8E=function(a){return a}';
    const patched = patch(sample);
    assert.match(
      patched,
      /a8E=function\(a\)\{if\(a\.visible\)\{window\._puddingSnakeMenu=a;if\(typeof window\.remixShuffleModdedRun==="function"\)window\.remixShuffleModdedRun\(\);_\.Ow\(a\.qc\)\}\},b8E=function/
    );
    assert.equal(patch(patched), patched);
  });

  it("is concatenated into both committed bundles and adds no extra button", () => {
    for (const name of ["RemixMod.js", "RemixUltraMod.js"]) {
      const text = fs.readFileSync(path.join(ROOT, name), "utf8");
      assert.ok(text.includes("window.remixPatchNativeShuffle(code)"), name);
      assert.ok(text.includes("window.remixShuffleModdedRun()"), name);
      assert.equal(text.includes("remix-shuffle-modded"), false, name);
      assert.equal(text.includes("Shuffle incl. modded modes"), false, name);
    }
  });
});

function loadPatch() {
  const code = fs.readFileSync(
    path.join(ROOT, "src/ShuffleModdedInit.js"),
    "utf8"
  );
  const sandbox = { window: {}, console, Math, Set, Object, Number };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.remixPatchNativeShuffle;
}

describe("regular shuffle includes modded modes (browser)", { skip: !runBrowser }, () => {
  it("Remix Shuffle reaches a modded mode and still disables", async () => {
    const { launchHarness } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 7, headless: true });
    try {
      await exerciseShuffle(h, "remix");
      assert.deepEqual(h.modErrors(), []);
    } finally {
      await h.close();
    }
  });

  it("Ultra Remix Shuffle reaches a modded mode and still disables", async () => {
    const { launchHarness, ultraHarnessOpts } = await import("../tools/harness.mjs");
    const h = await launchHarness(ultraHarnessOpts({ seed: 9, headless: true }));
    try {
      await exerciseShuffle(h, "ultra");
      const animated = await h.page.evaluate(() => ({
        index: window.ANIMATED_COLOR_INDEX,
        colorN: document.getElementById("color").children.length,
      }));
      assert.ok(animated.index >= 0 && animated.index < animated.colorN);
      assert.deepEqual(h.modErrors(), []);
    } finally {
      await h.close();
    }
  });
});

async function exerciseShuffle(h, name) {
  const page = h.page;
  await openSettings(page);
  const shots = path.join("/opt/cursor/artifacts");
  fs.mkdirSync(shots, { recursive: true });
  await page.screenshot({ path: path.join(shots, `${name}_shuffle_menu.png`) });

  const info = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('[jsname="qycu7d"]')];
    const orig = buttons[0];
    const trophy = document.getElementById("trophy");
    return {
      count: buttons.length,
      extra: !!document.getElementById("remix-shuffle-modded"),
      action: orig && orig.getAttribute("jsaction"),
      label: orig && orig.getAttribute("aria-label"),
      text: orig && orig.textContent.trim(),
      candy: window.CANDY_MODE,
      slot: window.SLOT_MACHINE_MODE,
      modes: window.remixShuffleModdedLogic.trophyPool(trophy.children.length),
      menu: !!(window._puddingSnakeMenu && window._puddingSnakeP7),
    };
  });
  assert.equal(info.count, 1, name);
  assert.equal(info.extra, false, name);
  assert.equal(info.action, "Km979c", name);
  assert.equal(info.label, "Shuffle", name);
  assert.equal(info.text, "Shuffle", name);
  assert.equal(info.menu, true, name);
  assert.ok(info.candy >= 23, name);
  assert.ok(info.modes.includes(info.candy), name);
  assert.ok(info.modes.includes(info.slot), name);
  assert.equal(info.modes.includes(21), false, name);
  assert.equal(info.modes.includes(22), false, name);

  let landed = null;
  for (let i = 0; i < 40 && !(landed && landed.ob >= 23); i++) {
    await page.click('[jsname="qycu7d"]');
    landed = await page.evaluate(() => {
      const menu = window._puddingSnakeMenu;
      const trophy = document.getElementById("trophy");
      const selected = [...trophy.children].findIndex((el) =>
        el.classList.contains("tuJOWd")
      );
      return {
        ob: menu.settings.ob,
        selected,
        name: window.modeToTxt?.[menu.settings.ob]?.name || "",
      };
    });
  }
  assert.ok(landed && landed.ob >= 23, name + " " + JSON.stringify(landed));
  assert.equal(landed.selected, landed.ob, name);
  console.log(name + " shuffle landed on", landed);
  await page.evaluate(() => {
    const trophy = document.getElementById("trophy");
    const selected = trophy.children[window._puddingSnakeMenu.settings.ob];
    if (selected && selected.scrollIntoView) {
      selected.scrollIntoView({ inline: "center", block: "nearest" });
    }
  });
  await page.screenshot({
    path: path.join(shots, `${name}_shuffle_modded_mode.png`),
  });
  const clip = await page.evaluate(() => {
    const row = document.getElementById("trophy");
    let vis = row.parentElement;
    while (vis && vis.clientWidth > 0 && vis.scrollWidth <= vis.clientWidth + 2) {
      vis = vis.parentElement;
    }
    const r = (vis || row).getBoundingClientRect();
    return {
      x: Math.max(0, r.x),
      y: Math.max(0, r.y),
      width: Math.min(r.width, 900),
      height: Math.max(r.height, 48),
    };
  });
  await page.screenshot({
    path: path.join(shots, `${name}_shuffle_mode_row.png`),
    clip,
  });

  const daily = await page.evaluate(() => {
    const menu = window._puddingSnakeMenu;
    const before = menu.settings.ob;
    menu.settings.Ga = true;
    const ran = window.remixShuffleModdedRun(() => 0.2);
    const after = menu.settings.ob;
    menu.settings.Ga = false;
    return { ran, before, after };
  });
  assert.equal(daily.ran, true, name);
  assert.equal(daily.after, daily.before, name);

  await page.evaluate(() => window.ToggleRandom());
  await page.screenshot({
    path: path.join(shots, `${name}_shuffle_disabled.png`),
  });
  const disabled = await page.evaluate(() => {
    const orig = document.querySelector('[jsname="qycu7d"]');
    const ob = window._puddingSnakeMenu.settings.ob;
    orig.click();
    const ran = window.remixShuffleModdedRun(() => 0);
    return {
      flag: window.pudding_settings.DisableRandom,
      text: orig.textContent.trim(),
      pe: orig.style.pointerEvents,
      color: orig.style.color,
      ran,
      ob,
      after: window._puddingSnakeMenu.settings.ob,
      buttons: document.querySelectorAll('[jsname="qycu7d"]').length,
    };
  });
  assert.equal(disabled.flag, true, name);
  assert.equal(disabled.text, "Disabled", name);
  assert.equal(disabled.pe, "none", name);
  assert.equal(disabled.color, "grey", name);
  assert.equal(disabled.ran, false, name);
  assert.equal(disabled.after, disabled.ob, name);
  assert.equal(disabled.buttons, 1, name);

  await page.evaluate(() => window.ToggleRandom());
  const restored = await page.evaluate(() => {
    const orig = document.querySelector('[jsname="qycu7d"]');
    return {
      flag: window.pudding_settings.DisableRandom,
      text: orig.textContent.trim(),
      label: orig.getAttribute("aria-label"),
    };
  });
  assert.equal(restored.flag, false, name);
  assert.equal(restored.text, "Shuffle", name);
  assert.equal(restored.label, "Shuffle", name);

  const blend = await page.evaluate(() => {
    const menu = window._puddingSnakeMenu;
    menu.oa = "combo";
    window.candy_blending = false;
    window.fear_blending = false;
    const ok = window.remixShuffleModdedRun(() => 0);
    const wall = menu.settings.Ua && menu.settings.Ua.get(1);
    const peaceful = menu.settings.Ua && menu.settings.Ua.get(21);
    menu.oa = "settings";
    return {
      ok,
      candy: window.candy_blending,
      fear: window.fear_blending,
      candyBtn: document.getElementById("remix-candy-blend")?.className || "",
      wallOn: !!(wall && wall.classList.contains("lH9Ipd")),
      peacefulOn: !!(peaceful && peaceful.classList.contains("lH9Ipd")),
    };
  });
  assert.equal(blend.ok, true, name);
  assert.equal(blend.candy, true, name);
  assert.equal(blend.fear, true, name);
  assert.match(blend.candyBtn, /lH9Ipd/);
  assert.equal(blend.wallOn, true, name);
  assert.equal(blend.peacefulOn, false, name);
}

async function openSettings(page) {
  await page.waitForSelector('[jsname="iyH4Cb"]', { timeout: 60000 });
  await page.click('[jsname="iyH4Cb"]');
  await page.waitForFunction(
    () => {
      const shuffle = document.querySelector('[jsname="qycu7d"]');
      return (
        shuffle &&
        !shuffle.classList.contains("LaTyvd") &&
        !document.getElementById("remix-shuffle-modded") &&
        window._puddingSnakeMenu &&
        window._puddingSnakeMenu.oa === "settings"
      );
    },
    null,
    { timeout: 30000 }
  );
}
