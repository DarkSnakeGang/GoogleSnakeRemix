import { describe, it } from "node:test";
import assert from "node:assert/strict";

const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("Cat Speed + Blue/Green Dice (browser)", { skip: !runBrowser }, () => {
  it("places Cat after MoreMenu speeds and Blue/Green dice after Nuke", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 21, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const menu = await h.page.evaluate(() => {
        const speed = [...document.querySelector("#speed").children].map(
          (c, i) => ({ i, alt: c.alt || "", src: (c.src || "").slice(-40) })
        );
        const count = [...document.querySelector("#count").children].map(
          (c, i) => ({ i, alt: c.alt || "", src: (c.src || "").slice(0, 30) })
        );
        return {
          catIndex: window.CAT_SPEED_INDEX,
          speedLen: speed.length,
          catChild: speed[window.CAT_SPEED_INDEX],
          catIsLast: window.CAT_SPEED_INDEX === speed.length - 1,
          turtleStill3: speed[3]?.src?.includes("Turtle-Bunny"),
          blue: window.BLUE_DICE_COUNT,
          green: window.GREEN_DICE_COUNT,
          blueAlt: count[window.BLUE_DICE_COUNT]?.alt,
          greenAlt: count[window.GREEN_DICE_COUNT]?.alt,
          errors: (window.__remixModErrors || []).slice?.() || [],
        };
      });
      assert.ok(menu.catIndex >= 14, "cat after MoreMenu: " + JSON.stringify(menu));
      assert.equal(menu.catIsLast, true, JSON.stringify(menu));
      assert.equal(menu.catChild?.alt, "Cat Speed", JSON.stringify(menu));
      assert.equal(menu.turtleStill3, true, JSON.stringify(menu));
      assert.ok(menu.blue > 12, "blue after MoreMenu: " + JSON.stringify(menu));
      assert.equal(menu.green, menu.blue + 1, JSON.stringify(menu));
      assert.equal(menu.blueAlt, "Blue Dice");
      assert.equal(menu.greenAlt, "Green Dice");
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("Cat speed uses 0.85 multiplier (not turtle)", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 23, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(() => ({
        idx: window.CAT_SPEED_INDEX,
        mult: window.CAT_SPEED_MULT,
        label: window.speedToTxt?.[window.CAT_SPEED_INDEX]?.name,
        handle: typeof window.HandleSpeed === "function"
          ? window.HandleSpeed(window.CAT_SPEED_INDEX)
          : null,
      }));
      assert.equal(probe.mult, 0.85, JSON.stringify(probe));
      assert.ok(probe.idx >= 14, JSON.stringify(probe));
      assert.equal(probe.label, "Cat", JSON.stringify(probe));
      assert.match(String(probe.handle), /Cat/i, JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("blue/green dice roll in range when the last apple is eaten", async () => {
    const { launchHarness, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 22, headless: true });
    try {
      await h.start({ mode: "classic", count: 0, size: SIZE.NORMAL });

      const probe = await h.page.evaluate(() => {
        const g = window.__remixGame;
        const tickSrc = Function.prototype.toString.call(g.tick);
        const hasTdfPatch =
          tickSrc.includes("remixIsColoredDice") &&
          tickSrc.includes("remixColoredDiceRoll");

        function eatLast(ka) {
          g.settings.ka = ka;
          g.settings.Ca = ka;
          g.wa.reset();
          const snake = g.oa.ka;
          for (let i = 0; i < snake.length; i++) {
            snake[i].x = 3;
            snake[i].y = 3;
          }
          g.oa.direction = "RIGHT";
          const apples = g.wa.ka;
          while (apples.length > 1) apples.pop();
          if (!apples.length) return { after: 0, scored: false };
          apples[0].pos.x = 4;
          apples[0].pos.y = 3;
          const scoreBefore = g.Oh;
          g.tick();
          return {
            after: g.wa.ka.length,
            scored: g.Oh > scoreBefore,
            ka: g.settings.ka,
          };
        }

        const liveBlue = [];
        const liveGreen = [];
        for (let i = 0; i < 20; i++) {
          liveBlue.push(eatLast(window.BLUE_DICE_COUNT));
          liveGreen.push(eatLast(window.GREEN_DICE_COUNT));
        }

        return {
          hasTdfPatch,
          liveBlue: liveBlue.map((r) => r.after),
          liveGreen: liveGreen.map((r) => r.after),
          blueScored: liveBlue.every((r) => r.scored),
          greenScored: liveGreen.every((r) => r.scored),
        };
      });

      assert.equal(probe.hasTdfPatch, true, JSON.stringify(probe));
      assert.equal(probe.blueScored, true, JSON.stringify(probe));
      assert.equal(probe.greenScored, true, JSON.stringify(probe));
      for (const n of probe.liveBlue) {
        assert.ok(n >= 1 && n <= 12, "blue " + n + " " + JSON.stringify(probe.liveBlue));
      }
      for (const n of probe.liveGreen) {
        assert.ok(n >= 4 && n <= 9, "green " + n + " " + JSON.stringify(probe.liveGreen));
      }
      assert.ok(new Set(probe.liveBlue).size >= 3, JSON.stringify(probe.liveBlue));
      assert.ok(new Set(probe.liveGreen).size >= 2, JSON.stringify(probe.liveGreen));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });

  it("top bar count icon uses tinted blue/green dice", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 24, headless: true });
    try {
      await h.start({ mode: "classic", count: COUNT.ONE, size: SIZE.NORMAL });
      const probe = await h.page.evaluate(async () => {
        await new Promise((r) => {
          const t0 = Date.now();
          const tick = () => {
            const b = document.querySelector("#count").children[window.BLUE_DICE_COUNT];
            if (b && b.src.startsWith("data:")) return r(true);
            if (Date.now() - t0 > 5000) return r(false);
            setTimeout(tick, 40);
          };
          tick();
        });
        const root = document.querySelector("#count");
        const blue = root.children[window.BLUE_DICE_COUNT];
        const g = window.__remixGame;
        g.settings.ka = window.BLUE_DICE_COUNT;
        g.settings.Ca = window.BLUE_DICE_COUNT;
        for (const c of root.children) c.classList.remove("tuJOWd");
        blue.classList.add("tuJOWd");
        g.wa.reset();
        window.remixRefreshHudCountIcon(window.BLUE_DICE_COUNT, blue.src);
        const disp = document.body.getElementsByClassName("UJhXPd wSwbef EWyEF")[0];
        const visible = disp
          ? [...disp.querySelectorAll("img")].filter((img) => {
              if (img.style.display === "none") return false;
              const s = img.src || "";
              return /count_|data:image/.test(s) || /WwRsj/.test(img.className || "");
            })
          : [];
        return {
          blueData: blue.src.startsWith("data:"),
          visibleKinds: visible.map((img) =>
            img.src.startsWith("data:")
              ? "data"
              : /count_04/.test(img.src)
                ? "red"
                : "other"
          ),
          arrData: !!(
            window.count_img_arr &&
            window.count_img_arr[window.BLUE_DICE_COUNT] &&
            window.count_img_arr[window.BLUE_DICE_COUNT].startsWith("data:")
          ),
        };
      });
      assert.equal(probe.blueData, true, JSON.stringify(probe));
      assert.equal(probe.arrData, true, JSON.stringify(probe));
      assert.ok(probe.visibleKinds.includes("data"), JSON.stringify(probe));
      assert.ok(!probe.visibleKinds.includes("red"), JSON.stringify(probe));
      assert.deepEqual(h.modErrors(), [], "no mod errors");
    } finally {
      await h.close();
    }
  });
});
