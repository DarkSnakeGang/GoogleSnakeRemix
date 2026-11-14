#!/usr/bin/env node
/**
 * Assert every critical Remix/Chess/Candy regex still matches cached game code.
 * Uses .cache/snake-current.js (run npm run fetch-game first) or TEMP research copy.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadGameCode() {
  const candidates = [
    path.join(ROOT, ".cache", "snake-current.js"),
    path.join(
      process.env.TEMP || "/tmp",
      "snake-mod-research",
      "snake-fresh.js"
    ),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return { path: p, code: fs.readFileSync(p, "utf8") };
  }
  throw new Error(
    "No cached game JS. Run: npm run fetch-game  (or place snake-fresh.js in TEMP/snake-mod-research)"
  );
}

const { path: gamePath, code: raw } = loadGameCode();
// Pudding renames $$ -> doubleD (so $$E -> doubleDE)
let code = raw.replaceAll(/\$\$/gm, "doubleD");
// Game v14: Remix Ultra drops newlines before patching (see ultraFlattenSnakeCode).
code = code.replace(/([\w$]?)\n(?!\/\/)(?=([\w$]?))/g, (m, a, b) => (a && b ? a + " " : a));

const tests = [
  ["chess M7", /M7=function\(a,b\)\{return a\.La\?a\.jd\.has\(b\):a\.yb===22&&a\.NSa\.has\(b\)\?!0:a\.yb===b\}/],
  ["chess tick", /\}tick\(\)\{var a=this\.Oy,b=this\.uj;/],
  ["apple reset Y3E", /this\.ka=\s*\[\];var a=ooF\(this\.settings\)/],
  ["shield init nba", /if\(M7\(this\.settings,15\)\)for\(let r of this\.ka\)r\.h7=\s*goF\(this,r\.pos\);/],
  ["pair splice", /M7\(this\.settings,2\)\?c%2===0\?\(this\.ka\.splice\(c,2\),c--\):\(this\.ka\.splice\(c-\s*1,2\),c-=2\)/],
  ["f4E portal pair", /M7\(a\.settings,\s*2\)&&!f\?/],
  ["f4E after nba", /g=a\.ka\.length-g;if\(e!==void 0\)for\(c=0;c<g;c\+\+\)a\.ka\[a\.ka\.length-1-c\]\.sequenceNumber=e;if\(M7\(a\.settings,15\)\)for\(e=0;e<g;e\+\+\)c=a\.ka\[a\.ka\.length-1-e\],c\.h7=goF\(a,c\.pos\);/],
  ["score a.Bi++", /a\.Bi\+\+;/],
  ["wall every-other apple", /([a-zA-Z_$][\w$]*)=!([a-zA-Z_$][\w$]*)\.uj&&!([a-zA-Z_$][\w$]*)&&\(\2\.Bi%2===1\|\|M7\(\2\.settings,11\)\);M7\(\2\.settings,1\)&&\1&&/],
  ["snake length", /M7\(a\.settings,3\)\?a\.Yc\.Ra\+=2:a\.Yc\.Ra\+=1;/],
  ["shield clear", /M7\(a\.settings,15\)&&\(soF\(a\.oa,([a-zA-Z0-9_$]+)\),/],
  ["Vm respawn", /e=!1;M7\(a\.settings,2\)\?e=!0:M7\(a\.settings,10\)&&d\.Bea\?e=!1:\(e=a\.settings\.ka!==6&&\(Q7\(a\.settings\)\|\|M7\(a\.settings,7\)\),e=a\.Kc\(k,\s*!e,null\)\);/],
  ["tally wave size", /var b=M7\(a\.settings,11\)\?10:5;/],
  ["play start", /c\.yb=c\.wb;c\.ka=c\.Ca;/],
  ["candy deathscreen", /a\.settings\.Zb=`https:\/\/www\.google\.com\/logos\/fnbx\/\$\{a\.settings\.Ba===1\?`snake_arcade\/pixel\/v22\/px_trophy_\$\{b\}\.png`:`snake_arcade\/v22\/trophy_\$\{b\}\.png`\}`/],
  ["candy blender forEach", /a\.Za\.forEach\(\(c,d\)=>\{_\.Gd\(c,"lH9Ipd"\)&&b\.push\(d\)\}\)/],
  ["candy Ua fallback", /this\.Za\.set\(22,d\),this\.Hl\.set\(d,22\)/],
  ["burger Y3E", /ooF=function\(a\)\{return M7\(a,2\)\|\|M7\(a,8\)\|\|M7\(a,9\)\|\|M7\(a,10\)\}/],
  ["burger e4E gate", /M7\(a\.settings,10\)&&!f&&uoF\(a\)/],
  ["burger poison top-up", /(for\(let c of a\.ka\)c\.Bea&&b\+\+;b<a\.ka\.length\/2&&\s*)uoF\(a\)/],
  ["burger eat index", /M7\(a\.settings,10\)\s*&&\s*zoF\(a\.oa,([a-zA-Z0-9_$]{1,6}),[a-zA-Z0-9_$]{1,6},a\.Cc\.bind\(a\)\)\s*&&\s*\1--/],
  ["burger l4E", /BoF=function\(a\)\{for\(let b=0;b\+1<a\.ka\.length;b\+=2\)\{let c=Math\.random\(\)<\.5;/],
  ["burger l4E start call", /M7\(this\.settings,10\)&&BoF\(this\.oa\)/],
  ["burger f4E Oka pair", /M7\(a\.settings,10\)&&\(c=Math\.random\(\)<\.5,a\.ka\[a\.ka\.length-1\]\.Bea=c,a\.ka\[a\.ka\.length-2\]\.Bea=!c\)/],
  ["burger fruit drawImage", /this\.ka\.drawImage\(f,0,0,g,g,-d\/2,-d\/2,d,d\);/],
  ["burger g7", /S7=function\(a,b,c\)\{b=new _\.Yd/],
  ["pause cond", /\(this\.[a-zA-Z0-9_$]{1,8}\.direction!=="NONE"\|\|[a-zA-Z0-9_$]{1,8}\(this\.[a-zA-Z0-9_$]{1,8}\)\)/],
  // Raw game uses ===10; after Pudding it becomes ==10||window.isRainbow.
  ["place bridgeColor", /([$a-zA-Z0-9_]{1,8})=function\(a,b\)\{return [$a-zA-Z0-9_]{1,8}\[a\.settings\.wa={2,3}10/],
];

let failed = 0;
console.log(`Checking against ${gamePath}`);
for (const [name, re] of tests) {
  const ok = re.test(code);
  console.log((ok ? "MATCH  " : "MISS   ") + name);
  if (!ok) failed++;
}
if (failed) {
  console.error(`\n${failed} patch target(s) missing`);
  process.exit(1);
}
console.log("\nAll patch targets OK");
