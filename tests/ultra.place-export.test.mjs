import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ULTRA = path.join(ROOT, "RemixUltraMod.js");
const PLACE_SRC = path.join(ROOT, "UltraPlaceInit.js");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

function fromVm(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadCodec() {
  const src = fs.readFileSync(PLACE_SRC, "utf8");
  const start = src.indexOf("/* ULTRA_PLACE_CODEC_START */");
  const end = src.indexOf("/* ULTRA_PLACE_CODEC_END */");
  assert.ok(start >= 0 && end > start, "codec markers missing");
  const slice = src.slice(start, end);
  const sandbox = { window: {} };
  vm.runInNewContext(slice, sandbox);
  const codec = sandbox.window.ultraPlaceCodec;
  return {
    sizes: fromVm(codec.sizes),
    appleOffsetForSize: function (w, h) {
      return fromVm(codec.appleOffsetForSize(w, h));
    },
    sizeById: function (id) {
      return fromVm(codec.sizeById(id));
    },
    parseEntity: function (token) {
      return fromVm(codec.parseEntity(token));
    },
    parseLevel: function (code) {
      return fromVm(codec.parseLevel(code));
    },
    exportLevel: function (w, h, list) {
      return codec.exportLevel(w, h, list);
    },
  };
}

describe("Ultra Place export / sizes", () => {
  it("round-trips old A/W/B/S codes and parses apple types", () => {
    const codec = loadCodec();
    const old = "17x15 A11,7 W3,4 B5,5 S4,1";
    const parsed = codec.parseLevel(old);
    assert.deepEqual(parsed, [
      { x: 11, y: 7, category: "apple", type: 0 },
      { x: 3, y: 4, category: "wall", type: -1 },
      { x: 5, y: 5, category: "box", type: -1 },
      { x: 4, y: 1, category: "snakehead", type: -1 },
    ]);
    const exported = codec.exportLevel(17, 15, parsed);
    assert.match(exported, /^17x15 /);
    assert.match(exported, /A11,7,0/);
    assert.match(exported, /W3,4/);
    assert.match(exported, /B5,5/);
    assert.match(exported, /S4,1/);
    const rich = codec.parseEntity("A11,7,24");
    assert.deepEqual(rich, { x: 11, y: 7, category: "apple", type: 24 });
  });

  it("parses new object letters and skips unknown ones", () => {
    const codec = loadCodec();
    const code = "10x9 Y1,1 C2,2 E3,3,h E4,4,v P5,5 P6,6,3 V7,1,U H5,5,R N0,0 T1,2,1 F2,3,bB K0,1,2 L0,2,2 Z9,9";
    const parsed = codec.parseLevel(code);
    const cats = parsed.map((e) => e.category);
    assert.deepEqual(cats, [
      "goal",
      "bridge",
      "gate",
      "gate",
      "poison",
      "poison",
      "arrow",
      "shield",
      "mine",
      "statue",
      "chess",
      "key",
      "keyblock",
    ]);
    assert.equal(parsed.find((e) => e.category === "gate" && e.x === 3).extra, "h");
    assert.equal(parsed.find((e) => e.category === "gate" && e.x === 4).extra, "v");
    assert.equal(parsed.find((e) => e.category === "poison" && e.x === 6).type, 3);
    assert.equal(parsed.find((e) => e.category === "chess").ChessPiece, "bishop");
    assert.equal(parsed.find((e) => e.category === "chess").ChessColor, "b");
    assert.ok(!parsed.some((e) => e.x === 9 && e.y === 9));
  });

  it("has the MoreMenu size table including Micro and Enormous", () => {
    const codec = loadCodec();
    assert.equal(codec.sizes.length, 11);
    assert.deepEqual(codec.sizeById("micro"), {
      id: "micro",
      label: "Micro",
      w: 5,
      h: 4,
      idx: 3,
    });
    assert.equal(codec.sizeById("enormous").w, 600);
    assert.deepEqual(codec.appleOffsetForSize(17, 15), { x: -12, y: -7 });
    assert.deepEqual(codec.appleOffsetForSize(5, 4), { x: -3, y: -2 });
    assert.deepEqual(codec.appleOffsetForSize(600, 530), { x: -450, y: -265 });
  });

  it("Ultra bundle includes Place-tab HTML builders", () => {
    assert.equal(fs.existsSync(ULTRA), true, "run python RemixBuilder.py");
    const ultra = fs.readFileSync(ULTRA, "utf8");
    assert.match(ultra, /window\.UltraPlace/);
    assert.match(ultra, /ultraPlaceBuildGridHtml/);
    assert.match(ultra, /Original Fruit/);
    assert.match(ultra, /Pudding Fruit/);
    assert.match(ultra, /ultra-place-tab/);
    assert.match(ultra, /Yx,y/);
    assert.doesNotMatch(fs.readFileSync(path.join(ROOT, "RemixMod.js"), "utf8"), /window\.UltraPlace/);
  });
});

describe("Ultra Place (browser)", { skip: !runBrowser }, () => {
  async function launchUltra(extra = {}) {
    const { launchHarness, ultraHarnessOpts } = await import("../tools/harness.mjs");
    return launchHarness(ultraHarnessOpts(extra));
  }

  it("shows Place inner tabs and Micro in the custom size dropdown", async () => {
    const h = await launchUltra({ seed: 41, headless: true });
    try {
      await h.page.waitForFunction(
        () => !!document.getElementById("ultra-place-tabs"),
        null,
        { timeout: 60000 }
      );
      const probe = await h.page.evaluate(() => {
        const tabs = [...document.querySelectorAll("#ultra-place-tabs .ultra-place-tab")].map(
          (el) => el.textContent.trim()
        );
        const size = document.getElementById("custom-map-size");
        const sizeOpts = size ? [...size.options].map((o) => o.textContent.trim()) : [];
        return { tabs, sizeOpts, hasGrid: !!document.getElementById("ultra-place-grid") };
      });
      assert.deepEqual(probe.tabs, [
        "Original Fruit",
        "Pudding Fruit",
        "Objects",
        "Key",
        "Chess",
      ]);
      assert.ok(probe.hasGrid);
      assert.ok(probe.sizeOpts.includes("Micro"), JSON.stringify(probe.sizeOpts));
    } finally {
      await h.close();
    }
  });

  it("poison place sets Oka and keyblock sets yNa", async () => {
    const h = await launchUltra({ seed: 42, headless: true });
    try {
      const { COUNT, SIZE } = await import("../tools/harness.mjs");
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => {
        const off =
          typeof window.getAppleSpawnPointOffset === "function"
            ? window.getAppleSpawnPointOffset()
            : { x: -12, y: -7 };
        if (typeof window.placePoison === "function") {
          window.placePoison(1 + off.x, 1 + off.y, 0);
        }
        if (typeof window.placeKeyblock === "function") {
          window.placeKeyblock(2, 2, 3);
        }
        const apples =
          window.wholeSnakeObject && window.wholeSnakeObject.wa && window.wholeSnakeObject.wa.ka
            ? window.wholeSnakeObject.wa.ka
            : [];
        const poison = apples.find((a) => a && a.Oka);
        const walls =
          window.wholeSnakeObject && window.wholeSnakeObject.Ca && window.wholeSnakeObject.Ca.Aa
            ? [...window.wholeSnakeObject.Ca.Aa.values()]
            : [];
        const block = walls.find((w) => w && w.yNa === 3);
        return {
          hasPoisonFn: typeof window.placePoison === "function",
          hasKeyblockFn: typeof window.placeKeyblock === "function",
          oka: !!(poison && poison.Oka),
          yNa: block ? block.yNa : null,
        };
      });
      assert.equal(probe.hasPoisonFn, true);
      assert.equal(probe.hasKeyblockFn, true);
      assert.equal(probe.oka, true, JSON.stringify(probe));
      assert.equal(probe.yNa, 3, JSON.stringify(probe));
    } finally {
      await h.close();
    }
  });
});
