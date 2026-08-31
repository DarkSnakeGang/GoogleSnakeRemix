import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("Custom size/colors/speeds artifacts", () => {
  it("ships Custom modules and a valid Cat PNG data-URI", () => {
    const remix = fs.readFileSync(path.join(ROOT, "RemixMod.js"), "utf8");
    assert.match(remix, /window\.CustomSettings/);
    assert.match(remix, /window\.CustomSize/);
    assert.match(remix, /window\.CustomColors/);
    assert.match(remix, /window\.CustomSpeeds/);
    assert.match(remix, /window\.CustomFruit/);
    assert.match(remix, /remix-custom-panel-fruit/);
    assert.match(remix, /remix-custom-panel-board/);
    assert.match(remix, /\["slot", "Slot"\]/);
    assert.match(remix, /remix-custom-panel-slot/);
    assert.match(remix, /remixInjectSlotMachineSettingsUi/);
    assert.match(remix, /remixCustomBoardSize/);
    assert.match(remix, /_remixCustomGradientColors/);
    assert.match(remix, /remixCustomSpeedSwitcherMult/);
    const m = remix.match(
      /window\.CAT_SPEED_ICON\s*=\s*"data:image\/png;base64,([A-Za-z0-9+/=]+)"/
    );
    assert.ok(m, "cat data-uri missing");
    const png = Buffer.from(m[1], "base64");
    assert.equal(png[0], 0x89);
    assert.equal(png.toString("ascii", 1, 4), "PNG");
    assert.ok(png.length > 1000, "cat png too small");
  });

  it("Ultra Place size list includes Custom", () => {
    const ultra = fs.readFileSync(path.join(ROOT, "RemixUltraMod.js"), "utf8");
    assert.match(ultra, /id:\s*"custom"/);
    assert.match(ultra, /label:\s*"Custom"/);
  });
});

describe("Custom menus (browser)", { skip: !runBrowser }, () => {
  it("exposes custom size/color/speed icons and Custom settings sub-tabs", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 61, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        window.remixOrganizeSettings();
        const size = document.querySelector("#size");
        const speed = document.querySelector("#speed");
        const color = document.querySelector("#color");
        const catOk =
          speed &&
          speed.children[window.CAT_SPEED_INDEX] &&
          speed.children[window.CAT_SPEED_INDEX].complete &&
          speed.children[window.CAT_SPEED_INDEX].naturalWidth > 0;
        document.getElementById("ultra-settings-tab-custom").click();
        window.remixShowCustomSubPage("board");
        const boardShown = document
          .getElementById("remix-custom-panel-board")
          .classList.contains("remix-custom-panel-on");
        window.remixShowCustomSubPage("dice");
        const boardAfterDice = document
          .getElementById("remix-custom-panel-board")
          .classList.contains("remix-custom-panel-on");
        const diceOn = document
          .getElementById("remix-custom-panel-dice")
          .classList.contains("remix-custom-panel-on");
        window.remixShowCustomSubPage("fruit");
        const fruitOn = document
          .getElementById("remix-custom-panel-fruit")
          .classList.contains("remix-custom-panel-on");
        window.remixShowCustomSubPage("poison");
        const poisonOn = document
          .getElementById("remix-custom-panel-poison")
          .classList.contains("remix-custom-panel-on");
        const fruitAfterPoison = document
          .getElementById("remix-custom-panel-fruit")
          .classList.contains("remix-custom-panel-on");
        window.remixShowCustomSubPage("slot");
        const slotOn = document
          .getElementById("remix-custom-panel-slot")
          .classList.contains("remix-custom-panel-on");
        const slotGrid = document.getElementById("remix-slot-mode-grid");
        return {
          customSize: window.CUSTOM_SIZE_INDEX,
          sizeLen: size && size.children.length,
          customAlt: size && size.children[window.CUSTOM_SIZE_INDEX]?.alt,
          customSpeed: window.CUSTOM_SPEED_INDEX,
          switchSpeed: window.CUSTOM_SPEED_SWITCH_INDEX,
          gradColor: window.CUSTOM_GRADIENT_COLOR_INDEX,
          rainColor: window.CUSTOM_RAINBOW_COLOR_INDEX,
          catOk,
          boardShown,
          boardAfterDice,
          diceOn,
          fruitOn,
          poisonOn,
          fruitAfterPoison,
          slotOn,
          slotCells: slotGrid ? slotGrid.children.length : 0,
          slotPool: (window.SLOT_MACHINE_POOL || []).length,
          diceUi: !!document.querySelector(
            "#remix-custom-panel-dice #black-dice-settings"
          ),
          boardUi: !!document.getElementById("remix-custom-board-w"),
          size: window.remixCustomBoardSize(),
          speedMult: window.remixCustomSpeedMult(),
        };
      });
      assert.equal(probe.customSize, 11, JSON.stringify(probe));
      assert.equal(probe.customAlt, "Custom Size", JSON.stringify(probe));
      assert.ok(probe.customSpeed >= 15, JSON.stringify(probe));
      assert.equal(probe.switchSpeed, probe.customSpeed + 1, JSON.stringify(probe));
      assert.equal(typeof probe.gradColor, "number", JSON.stringify(probe));
      assert.equal(typeof probe.rainColor, "number", JSON.stringify(probe));
      assert.equal(probe.catOk, true, JSON.stringify(probe));
      assert.equal(probe.boardShown, true, JSON.stringify(probe));
      assert.equal(probe.boardAfterDice, false, JSON.stringify(probe));
      assert.equal(probe.diceOn, true, JSON.stringify(probe));
      assert.equal(probe.fruitOn, true, JSON.stringify(probe));
      assert.equal(probe.poisonOn, true, JSON.stringify(probe));
      assert.equal(probe.fruitAfterPoison, false, JSON.stringify(probe));
      assert.equal(probe.slotOn, true, JSON.stringify(probe));
      assert.ok(probe.slotPool >= 20, JSON.stringify(probe));
      assert.equal(probe.slotCells, probe.slotPool, JSON.stringify(probe));
      assert.equal(probe.diceUi, true, JSON.stringify(probe));
      assert.equal(probe.boardUi, true, JSON.stringify(probe));
      assert.equal(probe.size.width, 17, JSON.stringify(probe));
      assert.equal(probe.size.height, 15, JSON.stringify(probe));
      assert.equal(probe.speedMult, 1, JSON.stringify(probe));
      // Soft SlotMachine find failures are logged for alternate regexes; ignore those.
      const hard = h
        .modErrors()
        .filter((e) => !/SlotMachineMod: failed to find/.test(e.text || e));
      assert.deepEqual(hard, [], "no mod errors: " + JSON.stringify(h.modErrors()));
    } finally {
      await h.close();
    }
  });
});
