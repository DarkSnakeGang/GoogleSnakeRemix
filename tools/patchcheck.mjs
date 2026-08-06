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
  ["chess f7", /f7=function\(a,b\)\{return a\.Qa\?a\.Jc\.has\(b\):a\.ub===22&&a\.ZSa\.has\(b\)\?!0:a\.ub===b\}/],
  ["chess tick", /\}tick\(\)\{var a=this\.Aa,b=this\.lj;/],
  ["apple reset iaF", /this\.ka=\[\];var a=iaF\(this\.settings\)/],
  ["shield init doubleDE", /if\(f7\(this\.settings,15\)\)for\(let q of this\.ka\)q\.Oba=doubleDE\(this,q\.pos\);/],
  ["pair splice", /f7\(this\.settings,2\)\?n%2===0\?\(this\.ka\.splice\(n,2\),n--\):\(this\.ka\.splice\(n-\s*1,2\),n-=2\)/],
  ["qaF portal pair", /f7\(a\.settings,\s*2\)&&!f\?/],
  ["qaF after Oba", /g=a\.ka\.length-g;if\(e!==void 0\)for\(c=0;c<g;c\+\+\)a\.ka\[a\.ka\.length-1-c\]\.sequenceNumber=e;if\(f7\(a\.settings,15\)\)for\(e=0;e<g;e\+\+\)c=a\.ka\[a\.ka\.length-1-e\],c\.Oba=doubleDE\(a,c\.pos\);/],
  ["score Oh++", /this\.Oh\+\+;/],
  ["snake length", /f7\(this\.settings,3\)\?this\.oa\.Ta\+=2:this\.oa\.Ta\+=1;/],
  ["shield clear", /f7\(this\.settings,15\)&&\(maF\(this\.wa,([a-zA-Z0-9_$]+)\),/],
  ["Mn respawn", /else\{let Ni=e7\(this\.settings\)\|\|f7\(this\.settings,7\);Xh=this\.Mn\(vd,!Ni,null\)\}/],
  ["tally wave size", /var b=f7\(a\.settings,11\)\?10:5;a\.wa\.wa=1;/],
  ["play start", /a\.ub=a\.ob;a\.ka=a\.Ca;/],
  ["candy deathscreen", /a\.settings\.Zb=`https:\/\/www\.google\.com\/logos\/fnbx\/\$\{a\.settings\.Ba===1\?`snake_arcade\/pixel\/v22\/px_trophy_\$\{b\}\.png`:`snake_arcade\/v22\/trophy_\$\{b\}\.png`\}`/],
  ["candy blender forEach", /a\.Ta\.forEach\(\(c,d\)=>\{_\.zm\(c,"lH9Ipd"\)&&b\.push\(d\)\}\)/],
  ["candy Ta fallback", /this\.Ta\.set\(22,e\),this\.kl\.set\(e,22\)/],
  ["burger iaF", /iaF=function\(a\)\{return f7\(a,2\)\|\|f7\(a,8\)\|\|f7\(a,9\)\|\|f7\(a,10\)\}/],
  ["burger paF gate", /f7\(a\.settings,10\)&&!f&&paF\(a\)/],
  ["burger poison top-up", /(for\(let Ok of hd\.ka\)Ok\.nla\s*&&\s*Ni\+\+;Ni<hd\.ka\.length\/2\s*&&\s*)paF\(hd\)/],
  ["burger eat index", /f7\(this\.settings,10\)\s*&&\s*saF\(this\.wa,([a-zA-Z0-9_$]{1,6}),[a-zA-Z0-9_$]{1,6},this\.Jc\.bind\(this\)\)\s*&&\s*\1--/],
  ["burger uaF", /uaF=function\(a\)\{for\(let b=0;b\+1<a\.ka\.length;b\+=2\)\{let c=Math\.random\(\)<\.5;/],
  ["burger uaF start call", /f7\(this\.settings,10\)&&uaF\(this\.wa\)/],
  ["burger qaF nla pair", /f7\(a\.settings,10\)&&\(c=Math\.random\(\)<\.5,a\.ka\[a\.ka\.length-1\]\.nla=c,a\.ka\[a\.ka\.length-2\]\.nla=!c\)/],
  ["burger fruit drawImage", /this\.ka\.drawImage\(f,0,0,g,g,-d\/2,-d\/2,d,d\);/],
  ["burger h7", /h7=function\(a,b,c\)\{b=new _\.Sd/],
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
