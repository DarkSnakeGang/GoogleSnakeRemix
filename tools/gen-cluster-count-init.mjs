import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const b64 = fs
  .readFileSync(path.join(root, "assets/cluster-count-icon.b64.txt"), "utf8")
  .trim();

const body = `window.ClusterCount = {};

////////////////////////////////////////////////////////////////////
//RUNCODEBEFORE
////////////////////////////////////////////////////////////////////

window.ClusterCount.runCodeBefore = function () {
  window.CLUSTER_COUNT_ICON = "data:image/png;base64,${b64}";
  window.CLUSTER_COUNT_CAP = 24;

  window.remixIsClusterCount = function remixIsClusterCount(ka) {
    return ka === window.CLUSTER_COUNT;
  };

  window.remixClusterCountReset = function remixClusterCountReset() {
    window.__clusterCountNext = 2;
  };

  window.remixClusterCountRoll = function remixClusterCountRoll() {
    const cap = window.CLUSTER_COUNT_CAP || 24;
    let next = window.__clusterCountNext;
    if (typeof next !== "number" || !Number.isFinite(next) || next < 2) {
      next = 2;
    }
    const count = Math.min(next, cap);
    if (count >= cap) {
      window.__clusterCountNext = 2;
    } else {
      const doubled = count * 2;
      window.__clusterCountNext = doubled > cap ? cap : doubled;
    }
    return count;
  };

  window.remixClusterCountReset();

  if (window._remixClusterCountInserted) return;

  const countRoot = document.querySelector("#count");
  if (!countRoot) return;

  window.uiImage =
    window.uiImage ||
    function (src) {
      const img = new Image();
      img.src = src;
      img.width = 40;
      img.height = 40;
      img.classList.add("DqMRee");
      img.classList.add("SsAred");
      return img;
    };

  const clusterImg = window.uiImage(window.CLUSTER_COUNT_ICON);
  clusterImg.alt = "Cluster count";
  countRoot.appendChild(clusterImg);
  window.CLUSTER_COUNT = [...countRoot.children].indexOf(clusterImg);
  window._remixClusterCountInserted = true;

  if (typeof window.remixRefreshCountImgArr === "function") {
    window.remixRefreshCountImgArr();
  }

  if (!window.countToTxt) window.countToTxt = {};
  window.countToTxt[window.CLUSTER_COUNT] = { name: "Cluster count" };

  if (
    typeof window.HandleCount === "function" &&
    !window.HandleCount.__clusterCountPatched
  ) {
    const orig = window.HandleCount;
    window.HandleCount = function (count) {
      if (count === window.CLUSTER_COUNT) return "Cluster count, ";
      return orig(count);
    };
    window.HandleCount.__clusterCountPatched = true;
  }
};
`;

fs.writeFileSync(path.join(root, "src/ClusterCountInit.js"), body);
console.log("wrote ClusterCountInit.js", body.length, "bytes");
