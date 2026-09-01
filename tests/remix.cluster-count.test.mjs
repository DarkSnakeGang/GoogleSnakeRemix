import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import vm from "vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const INIT = path.join(ROOT, "src", "ClusterCountInit.js");
const DICE = path.join(ROOT, "src", "DiceCountsInit.js");
const REMIX = path.join(ROOT, "RemixMod.js");
const ULTRA = path.join(ROOT, "RemixUltraMod.js");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function runClusterSandbox(extra = "") {
  const countRoot = {
    children: [],
    appendChild(el) {
      this.children.push(el);
    },
  };
  const sandbox = {
    window: {
      console,
      countToTxt: {},
      HandleCount: (c) => "native, ",
      remixRefreshCountImgArr: () => {},
    },
    console,
    document: {
      querySelector(sel) {
        if (sel === "#count") return countRoot;
        return null;
      },
    },
    Image: function Image() {
      this.src = "";
      this.width = 0;
      this.height = 0;
      this.classList = { add() {} };
    },
  };
  sandbox.window.Image = sandbox.Image;
  vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(INIT, "utf8") +
      `\nwindow.ClusterCount.runCodeBefore();\n${extra}`,
    sandbox
  );
  return sandbox.window;
}

describe("Cluster count (apple amount type)", () => {
  it("ships constants, icon embed, and count-menu hooks", () => {
    assert.equal(fs.existsSync(INIT), true);
    const init = fs.readFileSync(INIT, "utf8");
    assert.match(init, /window\.ClusterCount/);
    assert.match(init, /CLUSTER_COUNT_ICON/);
    assert.match(init, /data:image\/png;base64,/);
    assert.match(init, /CLUSTER_COUNT_CAP\s*=\s*24/);
    assert.match(init, /remixClusterCountRoll/);
    assert.match(init, /remixClusterCountReset/);
    assert.match(init, /remixIsClusterCount/);
    assert.match(init, /Cluster count, /);
    assert.match(init, /countToTxt\[window\.CLUSTER_COUNT\]/);
    assert.doesNotMatch(init, /CLUSTER_MODE/);
    assert.doesNotMatch(init, /#trophy/);
    assert.doesNotMatch(init, /alterSnakeCode/);
  });

  it("builder / splice list ClusterCountInit after DiceCountsInit", () => {
    const builder = read("RemixBuilder.py");
    const splice = read("tools/splice_remix_bundles.cjs");
    for (const [name, body] of [
      ["builder", builder],
      ["splice", splice],
    ]) {
      const dice = body.indexOf("DiceCountsInit.js");
      const cluster = body.indexOf("ClusterCountInit.js");
      const custom = body.indexOf("CustomSettingsInit.js");
      assert.ok(dice >= 0 && cluster > dice, name + " after DiceCounts");
      assert.ok(custom > cluster, name + " before CustomSettings");
    }
  });

  it("RemixInit wires ClusterCount.runCodeBefore after DiceCounts", () => {
    const remix = read("src/RemixInit.js");
    const dice = remix.indexOf("DiceCounts.runCodeBefore()");
    const cluster = remix.indexOf("ClusterCount.runCodeBefore()");
    assert.ok(dice >= 0 && cluster > dice);
    assert.doesNotMatch(remix, /ClusterCount\.alterSnakeCode/);
  });

  it("DiceCounts hooks cluster count for dice-like spawn and reset", () => {
    const dice = fs.readFileSync(DICE, "utf8");
    assert.match(dice, /remixIsClusterCount/);
    assert.match(dice, /remixClusterCountRoll/);
    assert.match(dice, /remixClusterCountReset/);
    assert.match(
      dice,
      /remixClusterCountRunReset/
    );
    assert.match(
      dice,
      /remixClusterCountPlayReset/
    );
    assert.match(
      dice,
      /remixIsClusterCount\(this\.settings\.ka\)\)\{try\{window\.remixClusterCountReset/
    );
    assert.match(dice, /remixIsClusterCount&&window\.remixIsClusterCount\(\$\{countExpr\}\)/);
    assert.match(dice, /\} else if\(\$\{cluster\}&&!a\)/);
    assert.doesNotMatch(dice, /remixUsesPairAppleLayout/);
    assert.match(
      dice,
      /remixIsClusterCount&&window\.remixIsClusterCount\(this\.settings\.ka\)\)/
    );
    assert.match(dice, /remixIsDiceLike&&window\.remixIsDiceLike\(this\.settings\.ka\)/);
    assert.match(dice, /remixDiceSpawnCount\(this\.settings\.ka,1\)/);
  });

  it("Chess portal combo respawn treats cluster count like dice", () => {
    const chess = fs.readFileSync(
      path.join(ROOT, "src", "ChessInit.js"),
      "utf8"
    );
    assert.match(chess, /remixIsDiceLike && window\.remixIsDiceLike\(ka\)/);
    assert.match(chess, /remixDiceSpawnCount\(ka, Math\.ceil\(Math\.random\(\) \* 6\)\)/);
  });

  it("remixClusterCountRoll sequence: 2,4,8,16,24 then reset", () => {
    const w = runClusterSandbox();
    w.CLUSTER_COUNT = 16;
    w.CLUSTER_COUNT_CAP = 24;

    const seq = [];
    for (let i = 0; i < 8; i++) seq.push(w.remixClusterCountRoll());
    assert.deepEqual(seq.slice(0, 5), [2, 4, 8, 16, 24], "×2 wave capped at 24 not 32");
    assert.deepEqual(seq.slice(5, 8), [2, 4, 8], "cycle resets after 24");
  });

  it("registers #count icon and HandleCount label", () => {
    const w = runClusterSandbox();
    assert.equal(typeof w.CLUSTER_COUNT, "number");
    assert.ok(w.CLUSTER_COUNT >= 0);
    assert.equal(w.countToTxt[w.CLUSTER_COUNT].name, "Cluster count");
    assert.equal(w.HandleCount(w.CLUSTER_COUNT), "Cluster count, ");
  });

  it("bundles include Cluster Count after splice", () => {
    assert.equal(fs.existsSync(REMIX), true, "run npm run build");
    assert.equal(fs.existsSync(ULTRA), true, "run npm run build");
    const remix = fs.readFileSync(REMIX, "utf8");
    const ultra = fs.readFileSync(ULTRA, "utf8");
    for (const [name, body] of [
      ["RemixMod", remix],
      ["RemixUltraMod", ultra],
    ]) {
      assert.match(body, /window\.ClusterCount/);
      assert.match(body, /remixClusterCountRoll/);
      assert.match(body, /ClusterCount\.runCodeBefore/);
      const dice = body.indexOf("window.DiceCounts = {}");
      const cluster = body.indexOf("window.ClusterCount = {}");
      assert.ok(dice >= 0 && cluster > dice, name + " splice order");
      assert.doesNotMatch(body, /CLUSTER_MODE/);
    }
  });
});
