/**
 * Harden MoreMenu custom-speed injection for current snake.js.
 *
 * Upstream MoreMenu matches `.5:1.25);this.XXX++;` and immediately uses [0].
 * Current game moved the score/light site out of tick (now `a.Sh++`), so restore
 * Remix's null-safe inject that falls back to Pudding's TimeKeeper tick anchor.
 */
import fs from "fs";

const target = process.argv[2];
if (!target) {
  console.error("usage: node tools/patch_moremenu_speed.mjs <MoreMenuMod.js|MorePudding.js>");
  process.exit(1);
}

let text = fs.readFileSync(target, "utf8");
const nl = text.includes("\r\n") ? "\r\n" : "\n";
if (text.includes("__remixMoreMenuSpeedPatched")) {
  console.log("already patched: MoreMenu speed inject");
  process.exit(0);
}

const oldMatch = [
  "const replacePoint = tickFunction.match(",
  "      /\\.5\\n?:\\n?1\\.25\\n?\\);\\n?this\\n?\\.\\n?[a-zA-Z0-9_$]{1,8}\\+\\+;/",
  "    )[0]",
].join(nl);

const newMatch = [
  "const replacePoint = tickFunction.match(",
  "      // Legacy this.Sh++; current a.Sh++ after light+=...?.5:1.25)",
  "      /\\.5\\n?:\\n?1\\.25\\n?\\);\\n?(?:this\\n?\\.\\n?)?[a-zA-Z0-9_$]{1,8}\\n?(?:\\.\\n?[a-zA-Z0-9_$]{1,8}\\n?)?\\+\\+;/",
  "    )",
  "    // __remixMoreMenuSpeedPatched",
].join(nl);

if (!text.includes(oldMatch)) {
  console.error("patch_moremenu_speed: replacePoint match site not found");
  process.exit(1);
}
text = text.replace(oldMatch, newMatch);

const startNeedle = [
  "window.bunnyTurtleSpeed = 1.33",
  "    window.lightningSnailSpeed = 1.85",
  "  ",
  "    code = code.assertReplace(tickFunction,",
].join(nl);
const start = text.indexOf(startNeedle);
const endNeedle = nl + "    const resetFunction1";
const end = start >= 0 ? text.indexOf(endNeedle, start) : -1;

if (start < 0 || end < 0) {
  fs.writeFileSync(target, text);
  console.log("patched MoreMenu replacePoint regex only ->", target);
  process.exit(0);
}

const replacement = [
  "window.bunnyTurtleSpeed = 1.33",
  "    window.lightningSnailSpeed = 1.85",
  "",
  "    const speedMultiplierBlock = `",
  "          window.bunnyTurtleSpeed = Math.random() < .5 ? .66 : 1.33",
  "          window.lightningSnailSpeed = Math.random() < .5 ? .45 : 1.85",
  "          let speedMultiplier",
  "          switch(${selectedSpeed}) {",
  "            case 1:",
  "              speedMultiplier = .66",
  "              break",
  "            case 2:",
  "              speedMultiplier = 1.33",
  "              break",
  "            case 3:",
  "              speedMultiplier = window.bunnyTurtleSpeed",
  "              break",
  "            case 4:",
  "              speedMultiplier = .45",
  "              break",
  "            case 5:",
  "              speedMultiplier = 1.85",
  "              break",
  "            case 6:",
  "              speedMultiplier = window.lightningSnailSpeed",
  "              break",
  "            case 7:",
  "              speedMultiplier = 18.5",
  "              break",
  "            case 8:",
  "              speedMultiplier = .35",
  "              break",
  "            case 9:",
  "              speedMultiplier = .25",
  "              break",
  "            case 10:",
  "              speedMultiplier = .15",
  "              break",
  "            case 11:",
  "              speedMultiplier = .05",
  "              break",
  "            case 12:",
  "              speedMultiplier = 26640",
  "              break",
  "            case 13:",
  "              speedMultiplier = .00001",
  "              break",
  "            default:",
  "              speedMultiplier = 1",
  "              break",
  "          }",
  "          ${tileLengthSetLine.replace(/\\*\\n?a/, '* speedMultiplier').replace(/d\\.isMobile/g, 'this.settings.isMobile')}",
  "        `",
  "",
  "    if (replacePoint) {",
  "      code = code.assertReplace(tickFunction,",
  "        tickFunction.replaceAll(",
  "          '&&', ' && '",
  "        ).replace(",
  "          replacePoint[0],",
  "          replacePoint[0] + speedMultiplierBlock",
  "        )",
  "      )",
  "    } else {",
  "      const tickAnchor = tickFunction.match(",
  "        /\\}else if\\(!window\\.timeKeeper\\.runStarted\\)\\{window\\.timeKeeper\\.start\\(\\);\\}/",
  "      )",
  "      if (!tickAnchor) {",
  "        throw new Error('More Menu: could not find tick speed injection point')",
  "      }",
  "      code = code.assertReplace(",
  "        tickFunction,",
  "        tickFunction.assertReplace(tickAnchor[0], tickAnchor[0] + speedMultiplierBlock)",
  "      )",
  "    }",
].join(nl);

text = text.slice(0, start) + replacement + text.slice(end);
fs.writeFileSync(target, text);
console.log("patched MoreMenu speed inject ->", target);
