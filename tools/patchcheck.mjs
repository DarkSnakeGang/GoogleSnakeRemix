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

const tests = [
  ["chess e7", /e7=function\(a,b\)\{return a\.Qa\?a\.Lc\.has\(b\):a\.ub===22&&a\.rSa\.has\(b\)\?!0:a\.ub===b\}/],
  ["chess tick", /\}tick\(\)\{var a=this\.Aa,b=this\.nj;/],
  ["apple reset Y3E", /this\.ka=\s*\[\];var a=Y3E\(this\.settings\)/],
  ["shield init nba", /if\(e7\(this\.settings,15\)\)for\(let q of this\.ka\)q\.nba=\s*P3E\(this,q\.pos\);/],
  ["pair splice", /e7\(this\.settings,2\)\?n%2===0\?\(this\.ka\.splice\(n,2\),n--\):\(this\.ka\.splice\(n-\s*1,2\),n-=2\)/],
  ["f4E portal pair", /e7\(a\.settings,\s*2\)&&!f\?/],
  ["f4E after nba", /g=a\.ka\.length-g;if\(e!==void 0\)for\(c=0;c<g;c\+\+\)a\.ka\[a\.ka\.length-1-c\]\.sequenceNumber=e;if\(e7\(a\.settings,15\)\)for\(e=0;e<g;e\+\+\)c=a\.ka\[a\.ka\.length-1-e\],c\.nba=P3E\(a,c\.pos\);/],
  ["score a.Sh++", /a\.Sh\+\+;/],
  ["snake length", /e7\(a\.settings,3\)\?a\.oa\.Ua\+=2:a\.oa\.Ua\+=1;/],
  ["shield clear", /e7\(a\.settings,15\)&&\(b4E\(a\.wa,([a-zA-Z0-9_$]+)\),/],
  ["Vm respawn", /e=!1;e7\(a\.settings,2\)\?e=!0:e7\(a\.settings,10\)&&d\.Oka\?e=!1:\(e=a\.settings\.ka!==6&&\(d7\(a\.settings\)\|\|e7\(a\.settings,7\)\),e=a\.Vm\(k,\s*!e,null\)\);/],
  ["tally wave size", /var b=e7\(a\.settings,11\)\?10:5;/],
  ["play start", /a\.ub=a\.ob;a\.ka=a\.Ca;/],
  ["candy deathscreen", /a\.settings\.Zb=`https:\/\/www\.google\.com\/logos\/fnbx\/\$\{a\.settings\.Ba===1\?`snake_arcade\/pixel\/v22\/px_trophy_\$\{b\}\.png`:`snake_arcade\/v22\/trophy_\$\{b\}\.png`\}`/],
  ["candy blender forEach", /a\.Ua\.forEach\(\(c,d\)=>\{_\.zm\(c,"lH9Ipd"\)&&b\.push\(d\)\}\)/],
  ["candy Ua fallback", /this\.Ua\.set\(22,e\),this\.Uk\.set\(e,22\)/],
  ["burger Y3E", /Y3E=function\(a\)\{return e7\(a,2\)\|\|e7\(a,8\)\|\|e7\(a,9\)\|\|e7\(a,10\)\}/],
  ["burger e4E gate", /e7\(a\.settings,10\)&&!f&&e4E\(a\)/],
  ["burger poison top-up", /(for\(let c of a\.ka\)c\.Oka&&b\+\+;b<a\.ka\.length\/2&&\s*)e4E\(a\)/],
  ["burger eat index", /e7\(a\.settings,10\)\s*&&\s*i4E\(a\.wa,([a-zA-Z0-9_$]{1,6}),[a-zA-Z0-9_$]{1,6},a\.Lc\.bind\(a\)\)\s*&&\s*\1--/],
  ["burger l4E", /l4E=function\(a\)\{for\(let b=0;b\+1<a\.ka\.length;b\+=2\)\{let c=Math\.random\(\)<\.5;/],
  ["burger l4E start call", /e7\(this\.settings,10\)&&l4E\(this\.wa\)/],
  ["burger f4E Oka pair", /e7\(a\.settings,10\)&&\(c=Math\.random\(\)<\.5,a\.ka\[a\.ka\.length-1\]\.Oka=c,a\.ka\[a\.ka\.length-2\]\.Oka=!c\)/],
  ["burger fruit drawImage", /this\.ka\.drawImage\(f,0,0,g,g,-d\/2,-d\/2,d,d\);/],
  ["burger g7", /g7=function\(a,b,c\)\{b=new _\.Od/],
  ["pause cond", /\(this\.[a-zA-Z0-9_$]{1,8}\.direction!=="NONE"\|\|[a-zA-Z0-9_$]{1,8}\(this\.[a-zA-Z0-9_$]{1,8}\)\)/],
  ["place bridgeColor", /([$a-zA-Z0-9_]{1,8})=function\(a,b\)\{return [$a-zA-Z0-9_]{1,8}\[a\.settings\.wa===10/],
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
