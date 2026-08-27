import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("Custom fruit presets + validator (offline)", () => {
  it("exports separate fruit and poison preset lists", () => {
    globalThis.window = globalThis;
    eval(
      fs.readFileSync(path.join(ROOT, "src/PacmanGhostUris.js"), "utf8")
    );
    const src = fs.readFileSync(
      path.join(ROOT, "src/CustomFruitPresets.js"),
      "utf8"
    );
    eval(src);
    const fruit = globalThis.REMIX_CUSTOM_FRUIT_PRESETS;
    const poison = globalThis.REMIX_CUSTOM_POISON_PRESETS;
    assert.ok(Array.isArray(fruit));
    assert.ok(fruit.length >= 10);
    for (const p of fruit) {
      assert.match(p.id, /^[a-z0-9-]+$/);
      assert.ok(p.label);
      assert.match(p.normal, /^https:\/\//);
      assert.match(p.pixel, /^https:\/\//);
      assert.match(p.real, /^https:\/\//);
    }
    assert.equal(
      fruit.some((p) => /poison/.test(p.id)),
      false,
      "poison presets belong on poison list"
    );
    assert.ok(Array.isArray(poison));
    assert.equal(
      poison.some((p) => p.id === "pacman-ghost-poison"),
      false,
      "Pacman Ghost is not a poison preset name"
    );
    const ghosts = ["blinky", "pinky", "inky", "clyde"].map(
      (id) => poison.find((p) => p.id === id + "-poison")
    );
    assert.equal(ghosts.filter(Boolean).length, 4);
    const blinky = ghosts[0];
    assert.match(blinky.poisonNormal, /pacman-ghost\.png/);
    assert.match(blinky.poisonPixel, /px-pacman-ghost\.png/);
    assert.match(blinky.poisonReal, /ghost-real\.png/);
    for (const g of ghosts.slice(1)) {
      assert.match(g.poisonNormal, /^data:image\/png;base64,/);
      assert.match(g.poisonPixel, /^data:image\/png;base64,/);
      assert.match(g.poisonReal, /^data:image\/png;base64,/);
    }
    assert.ok(poison.some((p) => p.id === "skull-poison"));
  });

  it("remixCustomFruitSlotSize uses 170 for pixel slots", () => {
    globalThis.window = globalThis;
    const src = fs.readFileSync(
      path.join(ROOT, "src/CustomFruitInit.js"),
      "utf8"
    );
    eval(src);
    assert.equal(globalThis.remixCustomFruitSlotSize("CustomFruitPixel"), 170);
    assert.equal(globalThis.remixCustomFruitSlotSize("fruitpixel"), 170);
    assert.equal(globalThis.remixCustomFruitSlotSize("CustomFruitNormal"), 128);
    assert.equal(
      globalThis.remixApplySlotErrorMessage(
        new Error("size:Pixel:170:128x128")
      ),
      "Pixel must be exactly 170×170 (got 128x128)."
    );
  });

  it("default board sprites are ghost variants, not the menu icon", () => {
    globalThis.window = globalThis;
    globalThis.REMIX_CUSTOM_FRUIT_PRESETS = [
      {
        id: "pacman-ghost",
        label: "Pacman Ghost",
        normal: "https://example.com/ghost.png",
        pixel: "https://example.com/px-ghost.png",
        real: "https://example.com/ghost-real.png",
      },
    ];
    const src = fs.readFileSync(
      path.join(ROOT, "src/CustomFruitInit.js"),
      "utf8"
    );
    eval(src);
    const d = globalThis.remixCustomFruitDefaultSprites();
    assert.match(d.Normal, /ghost/);
    assert.notEqual(d.Normal, globalThis.CUSTOM_FRUIT_ICON);
  });

  it("remixValidateCustomFruitImage128 rejects wrong size", async () => {
    globalThis.window = globalThis;
    const src = fs.readFileSync(
      path.join(ROOT, "src/CustomFruitInit.js"),
      "utf8"
    );
    eval(src);
    globalThis.Image = class MockImage {
      set crossOrigin(_v) {}
      set src(_v) {
        this.naturalWidth = 1;
        this.naturalHeight = 1;
        if (this.onload) this.onload();
      }
    };
    const tiny =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    await assert.rejects(() =>
      globalThis.remixValidateCustomFruitImage128(tiny)
    );
  });

  it("saves applied fruit/poison as named user presets (data URIs OK)", () => {
    globalThis.window = globalThis;
    globalThis.document = {
      getElementById() {
        return null;
      },
    };
    globalThis.prompt = () => "My Upload";
    eval(
      fs.readFileSync(path.join(ROOT, "src/PacmanGhostUris.js"), "utf8")
    );
    eval(
      fs.readFileSync(path.join(ROOT, "src/CustomFruitPresets.js"), "utf8")
    );
    eval(fs.readFileSync(path.join(ROOT, "src/CustomFruitInit.js"), "utf8"));
    globalThis.pudding_settings = {};
    globalThis.remixEnsureCustomFruitSettings();
    assert.equal(globalThis.remixSaveCustomFruitPreset(), false);
    const data =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    Object.assign(globalThis.pudding_settings, {
      CustomFruitApplied: true,
      CustomFruitNormal: data,
      CustomFruitPixel: data,
      CustomFruitReal: data,
      CustomPoisonApplied: true,
      CustomPoisonNormal: data,
      CustomPoisonPixel: data,
      CustomPoisonReal: data,
    });
    assert.equal(globalThis.remixSaveCustomFruitPreset(), true);
    const fruit = globalThis.remixCustomFruitPresetById("user-my-upload");
    assert.ok(fruit);
    assert.equal(fruit.user, true);
    assert.match(fruit.normal, /^data:image\/png/);
    globalThis.prompt = () => "Poison Pack";
    assert.equal(globalThis.remixSaveCustomPoisonPreset(), true);
    const poison = globalThis.remixCustomPoisonPresetById("user-poison-pack");
    assert.ok(poison);
    assert.match(poison.poisonNormal, /^data:image\/png/);
    assert.equal(
      globalThis.pudding_settings.CustomFruitUserPresets.length,
      1
    );
    assert.equal(
      globalThis.pudding_settings.CustomPoisonUserPresets.length,
      1
    );
  });
});

describe("Custom fruit bundle artifacts", () => {
  it("ships CustomFruit module and UI hooks", () => {
    const remix = fs.readFileSync(path.join(ROOT, "RemixMod.js"), "utf8");
    assert.match(remix, /window\.CustomFruit/);
    assert.match(remix, /REMIX_CUSTOM_FRUIT_PRESETS/);
    assert.match(remix, /REMIX_CUSTOM_POISON_PRESETS/);
    assert.match(remix, /remix-custom-panel-fruit/);
    assert.match(remix, /remix-custom-panel-poison/);
    assert.match(remix, /CustomPoisonFruit/);
    assert.match(remix, /CUSTOM_FRUIT_MENU_INDEX/);
    assert.match(remix, /CUSTOM_FRUIT_TYPE/);
    assert.match(remix, /remixApplyCustomFruit/);
    assert.match(remix, /remixApplyCustomPoison/);
    assert.match(remix, /remixSaveCustomFruitPreset/);
    assert.match(remix, /remixSaveCustomPoisonPreset/);
    assert.match(remix, /CustomFruitUserPresets/);
    assert.match(remix, /CustomPoisonUserPresets/);
    assert.match(remix, /remix-custom-fruit-save-preset/);
    assert.match(remix, /remix-custom-poison-save-preset/);
    assert.match(remix, /HLr5YJmb\/modloader-icon/);
    assert.match(remix, /grid-template-columns:\s*repeat\(3,\s*1fr\)/);
    assert.match(
      remix,
      /chess\/hidden fruits|next entry after the visible|before chess \+ secret/
    );
    assert.match(
      remix,
      /CUSTOM_FRUIT_MENU_INDEX.*CUSTOM_FRUIT_NEW_FRUIT_INDEX|fruit_index = \(typeof window\.CUSTOM_FRUIT_MENU_INDEX/
    );
    assert.match(remix, /__remixCustomFruitB7/);
    assert.match(remix, /remixPatchCustomFruitAtlas/);
    const ultra = fs.readFileSync(path.join(ROOT, "RemixUltraMod.js"), "utf8");
    assert.match(ultra, /window\.CustomFruit/);
    assert.match(
      ultra,
      /next entry after the visible|before chess \+ secret/
    );
  });
});

describe("Custom fruit (browser)", { skip: !runBrowser }, () => {
  it("applies fruit from Fruit tab and selects menu icon", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 71, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(async () => {
        window.remixOrganizeSettings();
        document.getElementById("ultra-settings-tab-custom").click();
        window.remixShowCustomSubPage("fruit");
        const panelOn = document
          .getElementById("remix-custom-panel-fruit")
          .classList.contains("remix-custom-panel-on");
        function makeSquare(color, size) {
          const c = document.createElement("canvas");
          c.width = c.height = size;
          const ctx = c.getContext("2d");
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, size, size);
          return c.toDataURL("image/png");
        }
        [
          ["fruitnormal", makeSquare("#c0392b", 128)],
          ["fruitpixel", makeSquare("#e74c3c", 170)],
          ["fruitreal", makeSquare("#ff6b6b", 128)],
        ].forEach(function (pair) {
          const el = document.getElementById("remix-custom-fruit-url-" + pair[0]);
          if (el) el.value = pair[1];
        });
        await window.remixApplyCustomFruit();
        const status = document.getElementById("remix-custom-fruit-status")
          .textContent;
        const apple = document.querySelector("#apple");
        const idx = window.CUSTOM_FRUIT_MENU_INDEX;
        window.fruit_selected = idx;
        if (typeof window.puddingMenuSelect === "function") {
          window.puddingMenuSelect("apple", idx);
        }
        window.remixRefreshCustomFruitRuntime();
        const hud = document.querySelector('[jsname="Jesp7b"]');
        const sub = document.getElementById("remix-custom-subpager");
        const subStyle = sub && getComputedStyle(sub);
        const applyBtn = document.getElementById("remix-custom-fruit-apply");
        const saveBtn = document.getElementById("remix-custom-fruit-save-preset");
        const fruitSel = document.getElementById("remix-custom-fruit-preset");
        return {
          panelOn,
          applied: !!window.pudding_settings.CustomFruitApplied,
          status,
          menuIdx: idx,
          menuSrc: apple && apple.children[idx] && apple.children[idx].src,
          hudSrc: hud && hud.src,
          atlasPath:
            window.__remixCustomFruitB7 &&
            window.__remixCustomFruitB7.oa &&
            window.__remixCustomFruitB7.oa.path,
          modErr: window.modErrors ? window.modErrors() : null,
          type: window.CUSTOM_FRUIT_TYPE,
          gridCols: subStyle && subStyle.gridTemplateColumns,
          poisonTab: !!document.getElementById("remix-custom-subtab-poison"),
          poisonCheckbox: !!document.getElementById("CustomPoisonFruit"),
          toolbarSibling:
            !!(
              applyBtn &&
              saveBtn &&
              applyBtn.parentElement === saveBtn.parentElement
            ),
          saveBtn: !!saveBtn,
          noLoadBtn: !document.getElementById("remix-custom-fruit-load-preset"),
          hasPresetSelect: !!fruitSel,
        };
      });
      assert.equal(probe.panelOn, true, JSON.stringify(probe));
      assert.equal(probe.applied, true, JSON.stringify(probe));
      assert.match(probe.status, /applied/i, JSON.stringify(probe));
      assert.ok(probe.menuIdx >= 0, JSON.stringify(probe));
      assert.match(
        probe.menuSrc || "",
        /modloader-icon/,
        "menu stays modloader: " + JSON.stringify(probe)
      );
      assert.match(
        probe.atlasPath || "",
        /^data:image\/png/,
        "board atlas uses applied art: " + JSON.stringify(probe)
      );
      assert.match(
        probe.hudSrc || "",
        /^data:image\/png/,
        "HUD uses applied board art: " + JSON.stringify(probe)
      );
      assert.equal(probe.modErr, null, JSON.stringify(probe));
      assert.equal(typeof probe.type, "number", JSON.stringify(probe));
      assert.ok(probe.poisonTab, JSON.stringify(probe));
      assert.equal(probe.poisonCheckbox, true, JSON.stringify(probe));
      assert.equal(probe.toolbarSibling, true, JSON.stringify(probe));
      assert.equal(probe.saveBtn, true, JSON.stringify(probe));
      assert.equal(probe.noLoadBtn, true, JSON.stringify(probe));
      assert.equal(probe.hasPresetSelect, true, JSON.stringify(probe));
      assert.ok(
        /repeat\(\s*3/.test(probe.gridCols || ""),
        JSON.stringify(probe)
      );
    } finally {
      await h.close();
    }
  });

  it("Apply fruit names the bad slot on size mismatch", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 72, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(async () => {
        window.remixOrganizeSettings();
        document.getElementById("ultra-settings-tab-custom").click();
        window.remixShowCustomSubPage("fruit");
        function makeSquare(color, size) {
          const c = document.createElement("canvas");
          c.width = c.height = size;
          const ctx = c.getContext("2d");
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, size, size);
          return c.toDataURL("image/png");
        }
        document.getElementById("remix-custom-fruit-url-fruitnormal").value =
          makeSquare("#c0392b", 128);
        document.getElementById("remix-custom-fruit-url-fruitpixel").value =
          makeSquare("#e74c3c", 128);
        document.getElementById("remix-custom-fruit-url-fruitreal").value =
          makeSquare("#ff6b6b", 128);
        await window.remixApplyCustomFruit();
        return {
          applied: !!window.pudding_settings.CustomFruitApplied,
          status: document.getElementById("remix-custom-fruit-status").textContent,
        };
      });
      assert.equal(probe.applied, false, JSON.stringify(probe));
      assert.match(probe.status, /Pixel/i, JSON.stringify(probe));
      assert.match(probe.status, /170/i, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });

  it("fruit and poison presets fill only their own fields", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 73, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(async () => {
        window.remixOrganizeSettings();
        document.getElementById("ultra-settings-tab-custom").click();
        window.remixShowCustomSubPage("fruit");
        const fruitSel = document.getElementById("remix-custom-fruit-preset");
        fruitSel.value = "blackberries";
        fruitSel.dispatchEvent(new Event("change", { bubbles: true }));
        await window.__remixFruitPresetApply;
        const fruitNormal = document.getElementById(
          "remix-custom-fruit-url-fruitnormal"
        ).value;
        const fruitApplied = !!window.pudding_settings.CustomFruitApplied;
        window.remixShowCustomSubPage("poison");
        const poisonSel = document.getElementById("remix-custom-poison-preset");
        poisonSel.value = "blinky-poison";
        poisonSel.dispatchEvent(new Event("change", { bubbles: true }));
        await window.__remixPoisonPresetApply;
        const poisonNormal = document.getElementById(
          "remix-custom-fruit-url-poisonnormal"
        ).value;
        return {
          fruitNormal,
          poisonNormal,
          fruitApplied,
          poisonApplied: !!window.pudding_settings.CustomPoisonApplied,
          poisonToggle: !!window.pudding_settings.CustomPoison,
          poisonChecked: !!(
            document.getElementById("CustomPoisonFruit") &&
            document.getElementById("CustomPoisonFruit").checked
          ),
          poisonPanel: document
            .getElementById("remix-custom-panel-poison")
            .classList.contains("remix-custom-panel-on"),
          fruitLoadFn: typeof window.remixLoadCustomFruitPreset,
          noLoadFruit: !document.getElementById("remix-custom-fruit-load-preset"),
          noLoadPoison: !document.getElementById(
            "remix-custom-poison-load-preset"
          ),
        };
      });
      assert.match(probe.fruitNormal, /blackberries/);
      assert.match(probe.poisonNormal, /pacman-ghost\.png/);
      assert.equal(probe.fruitApplied, true, JSON.stringify(probe));
      assert.equal(probe.poisonApplied, true, JSON.stringify(probe));
      assert.equal(probe.poisonToggle, false, JSON.stringify(probe));
      assert.equal(probe.poisonChecked, false, JSON.stringify(probe));
      assert.equal(probe.poisonPanel, true);
      assert.equal(probe.noLoadFruit, true);
      assert.equal(probe.noLoadPoison, true);
    } finally {
      await h.close();
    }
  });

  it("Save preset after Apply stores uploads and reloads from dropdown", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 77, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(async () => {
        window.remixOrganizeSettings();
        document.getElementById("ultra-settings-tab-custom").click();
        window.remixShowCustomSubPage("fruit");
        function makeSquare(color, size) {
          const c = document.createElement("canvas");
          c.width = c.height = size;
          const ctx = c.getContext("2d");
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, size, size);
          return c.toDataURL("image/png");
        }
        const n = makeSquare("#112233", 128);
        const p = makeSquare("#223344", 170);
        const r = makeSquare("#334455", 128);
        document.getElementById("remix-custom-fruit-url-fruitnormal").value = n;
        document.getElementById("remix-custom-fruit-url-fruitpixel").value = p;
        document.getElementById("remix-custom-fruit-url-fruitreal").value = r;
        await window.remixApplyCustomFruit();
        const beforeApplyGate = (() => {
          const was = window.pudding_settings.CustomFruitApplied;
          window.pudding_settings.CustomFruitApplied = false;
          window.prompt = () => "Nope";
          const blocked = window.remixSaveCustomFruitPreset();
          window.pudding_settings.CustomFruitApplied = was;
          return blocked;
        })();
        window.prompt = function () {
          return "Upload Red";
        };
        const saved = window.remixSaveCustomFruitPreset();
        const sel = document.getElementById("remix-custom-fruit-preset");
        const opt = sel && sel.querySelector('option[value="user-upload-red"]');
        document.getElementById("remix-custom-fruit-url-fruitnormal").value = "";
        document.getElementById("remix-custom-fruit-url-fruitpixel").value = "";
        document.getElementById("remix-custom-fruit-url-fruitreal").value = "";
        sel.value = "user-upload-red";
        await window.remixLoadCustomFruitPreset();
        return {
          beforeApplyGate,
          saved,
          hasOption: !!opt,
          users: (window.pudding_settings.CustomFruitUserPresets || []).length,
          reloaded: document.getElementById("remix-custom-fruit-url-fruitnormal")
            .value,
          status: document.getElementById("remix-custom-fruit-status").textContent,
        };
      });
      assert.equal(probe.beforeApplyGate, false, JSON.stringify(probe));
      assert.equal(probe.saved, true, JSON.stringify(probe));
      assert.equal(probe.hasOption, true, JSON.stringify(probe));
      assert.equal(probe.users, 1, JSON.stringify(probe));
      assert.match(probe.reloaded, /^data:image\/png/, JSON.stringify(probe));
      assert.match(probe.status, /applied|Saved/i, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });

  it("Custom Poison checkbox toggles independently of fruit apply", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 74, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(async () => {
        window.remixOrganizeSettings();
        document.getElementById("ultra-settings-tab-custom").click();
        window.remixShowCustomSubPage("poison");
        const box = document.getElementById("CustomPoisonFruit");
        box.checked = true;
        box.dispatchEvent(new Event("change", { bubbles: true }));
        function makeSquare(color, size) {
          const c = document.createElement("canvas");
          c.width = c.height = size;
          const ctx = c.getContext("2d");
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, size, size);
          return c.toDataURL("image/png");
        }
        [
          ["poisonnormal", makeSquare("#111", 128)],
          ["poisonpixel", makeSquare("#222", 170)],
          ["poisonreal", makeSquare("#333", 128)],
        ].forEach(function (pair) {
          const el = document.getElementById("remix-custom-fruit-url-" + pair[0]);
          if (el) el.value = pair[1];
        });
        await window.remixApplyCustomPoison();
        return {
          toggle: !!window.pudding_settings.CustomPoison,
          applied: !!window.pudding_settings.CustomPoisonApplied,
          fruitApplied: !!window.pudding_settings.CustomFruitApplied,
          status: document.getElementById("remix-custom-poison-status")
            .textContent,
          hasPoison: !!window.__remixCustomPoison,
        };
      });
      assert.equal(probe.toggle, true, JSON.stringify(probe));
      assert.equal(probe.applied, true, JSON.stringify(probe));
      assert.equal(probe.fruitApplied, false, JSON.stringify(probe));
      assert.match(probe.status, /applied/i, JSON.stringify(probe));
      assert.equal(probe.hasPoison, true, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });

  it("custom fruit slot is before chess and updates board apples", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 75, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(async () => {
        function makeSquare(color, size) {
          const c = document.createElement("canvas");
          c.width = c.height = size;
          const ctx = c.getContext("2d");
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, size, size);
          return c.toDataURL("image/png");
        }
        const urls = [
          makeSquare("#c0392b", 128),
          makeSquare("#e74c3c", 170),
          makeSquare("#ff6b6b", 128),
        ];
        window.remixOrganizeSettings();
        document.getElementById("ultra-settings-tab-custom").click();
        window.remixShowCustomSubPage("fruit");
        ["fruitnormal", "fruitpixel", "fruitreal"].forEach(function (slug, i) {
          const el = document.getElementById("remix-custom-fruit-url-" + slug);
          if (el) el.value = urls[i];
        });
        await window.remixApplyCustomFruit();
        if (typeof window.puddingMenuSelect === "function") {
          window.puddingMenuSelect("apple", window.CUSTOM_FRUIT_MENU_INDEX);
        }
        window.fruit_selected = window.CUSTOM_FRUIT_MENU_INDEX;

        const idx = window.CUSTOM_FRUIT_NEW_FRUIT_INDEX;
        const entry = window.new_fruit && window.new_fruit[idx];
        const next = window.new_fruit && window.new_fruit[idx + 1];
        const fruitIndex =
          typeof window.CUSTOM_FRUIT_MENU_INDEX === "number" &&
          window.fruit_selected === window.CUSTOM_FRUIT_MENU_INDEX
            ? window.CUSTOM_FRUIT_NEW_FRUIT_INDEX
            : window.fruit_selected -
              (typeof last_fruit_num === "number"
                ? last_fruit_num + 1
                : document.querySelector("#apple").children.length);

        const g = window.__remixGame;
        const apples = g && g.wa && g.wa.ka ? g.wa.ka : [];
        // Force respawn apples under the selected custom type.
        if (apples.length && typeof window.CUSTOM_FRUIT_TYPE === "number") {
          apples.forEach(function (a) {
            if (!a.isPiece) a.type = window.CUSTOM_FRUIT_TYPE;
          });
          g.tick();
        }
        const boardTypes = apples
          .filter(function (a) {
            return a && !a.isPiece;
          })
          .map(function (a) {
            return a.type;
          });

        return {
          menuIdx: window.CUSTOM_FRUIT_MENU_INDEX,
          fruitIdx: idx,
          type: window.CUSTOM_FRUIT_TYPE,
          bbishop: window.bbishop,
          entryNormal: entry && entry.Normal,
          nextNormal: next && next.Normal,
          fruitIndexMapsCustom: fruitIndex === idx,
          notChessType: window.CUSTOM_FRUIT_TYPE !== window.bbishop,
          boardTypes,
          boardUsesCustom:
            boardTypes.length > 0 &&
            boardTypes.every(function (t) {
              return t === window.CUSTOM_FRUIT_TYPE;
            }),
          applied: !!window.pudding_settings.CustomFruitApplied,
          modErr: window.modErrors ? window.modErrors() : null,
          atlasPatched: !!(
            window.__remixCustomFruitB7 &&
            window.__remixCustomFruitB7.oa &&
            window.__remixCustomFruitB7.oa.path
          ),
          atlasPath:
            window.__remixCustomFruitB7 &&
            window.__remixCustomFruitB7.oa &&
            window.__remixCustomFruitB7.oa.path,
        };
      });
      assert.equal(probe.applied, true, JSON.stringify(probe));
      assert.equal(probe.modErr, null, JSON.stringify(probe));
      assert.equal(probe.fruitIndexMapsCustom, true, JSON.stringify(probe));
      assert.equal(probe.notChessType, true, JSON.stringify(probe));
      assert.ok(
        typeof probe.bbishop === "number",
        "chess should still be injected: " + JSON.stringify(probe)
      );
      assert.ok(
        probe.type < probe.bbishop,
        "custom type must precede black bishop: " + JSON.stringify(probe)
      );
      assert.match(probe.entryNormal || "", /^data:image\/png/, JSON.stringify(probe));
      assert.match(
        probe.nextNormal || "",
        /\/bb\.png|bbishop|Chess-bishop/i,
        "slot after custom should be black bishop: " + JSON.stringify(probe)
      );
      assert.equal(probe.boardUsesCustom, true, JSON.stringify(probe));
      assert.equal(probe.atlasPatched, true, JSON.stringify(probe));
      assert.match(
        probe.atlasPath || "",
        /^data:image\/png/,
        JSON.stringify(probe)
      );
    } finally {
      await h.close();
    }
  });

  it("Custom Poison checkbox sits on Custom → Poison; defaults are ghosts", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 76, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        window.remixOrganizeSettings();
        document.getElementById("ultra-settings-tab-custom").click();
        window.remixShowCustomSubPage("poison");
        const skull = document.getElementById("SkullPoisonFruit");
        const poison = document.getElementById("CustomPoisonFruit");
        const entry =
          window.new_fruit &&
          window.new_fruit[window.CUSTOM_FRUIT_NEW_FRUIT_INDEX];
        const menu =
          document.querySelector("#apple") &&
          document.querySelector("#apple").children[window.CUSTOM_FRUIT_MENU_INDEX];
        return {
          poisonOnPoisonTab: !!(
            poison && poison.closest("#remix-custom-panel-poison")
          ),
          poisonNotOnPlay: !(
            poison && poison.closest("#ultra-settings-page-play")
          ),
          skullStillOnPlay: !!(
            skull && skull.closest("#ultra-settings-page-play")
          ),
          defaultNormal: entry && entry.Normal,
          menuIsModloader: !!(menu && /modloader-icon/.test(menu.src)),
          customPoison: !!window.pudding_settings.CustomPoison,
          poisonChecked: !!(poison && poison.checked),
          atlasPath:
            window.__remixCustomFruitB7 &&
            window.__remixCustomFruitB7.oa &&
            window.__remixCustomFruitB7.oa.path,
        };
      });
      assert.equal(probe.poisonOnPoisonTab, true, JSON.stringify(probe));
      assert.equal(probe.poisonNotOnPlay, true, JSON.stringify(probe));
      assert.equal(probe.skullStillOnPlay, true, JSON.stringify(probe));
      assert.match(
        probe.defaultNormal || "",
        /pacman-ghost|ghost/,
        JSON.stringify(probe)
      );
      assert.equal(probe.menuIsModloader, true, JSON.stringify(probe));
      assert.equal(probe.customPoison, false, JSON.stringify(probe));
      assert.equal(probe.poisonChecked, false, JSON.stringify(probe));
      assert.match(
        probe.atlasPath || "",
        /pacman-ghost|ghost/,
        "board atlas defaults to ghost: " + JSON.stringify(probe)
      );
      assert.doesNotMatch(
        probe.atlasPath || "",
        /modloader-icon/,
        JSON.stringify(probe)
      );
    } finally {
      await h.close();
    }
  });
});
