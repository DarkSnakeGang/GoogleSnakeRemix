const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const b64 = fs
  .readFileSync(path.join(root, "assets", "slot-machine-icon.b64.txt"), "utf8")
  .trim();
const icon = `data:image/png;base64,${b64}`;
const initPath = path.join(root, "src", "SlotMachineInit.js");
let js = fs.readFileSync(initPath, "utf8");
const re = /window\.SLOT_MACHINE_ICON\s*=\s*"data:image\/png;base64,[^"]+";/;
if (!re.test(js)) {
  console.error("SLOT_MACHINE_ICON assignment not found");
  process.exit(1);
}
js = js.replace(re, `window.SLOT_MACHINE_ICON = ${JSON.stringify(icon)};`);
fs.writeFileSync(initPath, js);
console.log("updated SLOT_MACHINE_ICON bytes", icon.length);

// verify transparent corners in source png
const { execSync } = require("child_process");
