window.CustomSettings = {};

// Chrome changes <input type="number"> on mouse wheel even when you're just
// scrolling the settings panel — feels like the value "keeps going". Also
// never overwrite a field the user is actively editing.
window.remixStabilizeNumberInput = function remixStabilizeNumberInput(el) {
  if (!el || el.dataset.remixNumStable === "1") return el;
  el.dataset.remixNumStable = "1";
  el.addEventListener(
    "wheel",
    function (ev) {
      ev.preventDefault();
      // Keep scrolling the settings panel instead of spinning the value.
      const panel =
        el.closest(".remix-custom-panel") ||
        el.closest(".ultra-settings-page") ||
        document.getElementById("settings-popup-pudding");
      if (panel) panel.scrollTop += ev.deltaY;
    },
    { passive: false }
  );
  return el;
};

window.remixSetNumberInputValue = function remixSetNumberInputValue(el, value) {
  if (!el) return;
  if (document.activeElement === el) return;
  const next = String(value);
  if (el.value !== next) el.value = next;
};

window.remixEnsureCustomSettingsUi = function remixEnsureCustomSettingsUi() {
  const root = document.getElementById("settings-popup-pudding");
  if (!root) return null;

  let page = document.getElementById("ultra-settings-page-custom");
  if (!page) {
    page = document.createElement("div");
    page.id = "ultra-settings-page-custom";
    page.className = "ultra-settings-page";
    root.appendChild(page);
  }

  let pager = document.getElementById("ultra-settings-pager");
  if (pager && !document.getElementById("ultra-settings-tab-custom")) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "ultra-settings-tab-custom";
    btn.className = "ultra-settings-tab";
    btn.textContent = "Custom";
    btn.addEventListener("click", function () {
      window.remixShowSettingsPage("custom");
    });
    const modesTab = document.getElementById("ultra-settings-tab-modes");
    if (modesTab) pager.insertBefore(btn, modesTab);
    else pager.appendChild(btn);
  }

  let host = document.getElementById("remix-custom-settings");
  if (!host) {
    host = document.createElement("div");
    host.id = "remix-custom-settings";
    host.innerHTML =
      '<div id="remix-custom-subpager" class="remix-custom-subpager"></div>' +
      '<div id="remix-custom-panel-board" class="remix-custom-panel"></div>' +
      '<div id="remix-custom-panel-colors" class="remix-custom-panel"></div>' +
      '<div id="remix-custom-panel-speeds" class="remix-custom-panel"></div>' +
      '<div id="remix-custom-panel-dice" class="remix-custom-panel"></div>';
    page.appendChild(host);

    const sub = document.getElementById("remix-custom-subpager");
    [
      ["board", "Board"],
      ["colors", "Colors"],
      ["speeds", "Speeds"],
      ["dice", "Dice"],
    ].forEach(function (pair) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "remix-custom-subtab";
      b.id = "remix-custom-subtab-" + pair[0];
      b.textContent = pair[1];
      b.addEventListener("click", function () {
        window.remixShowCustomSubPage(pair[0]);
      });
      sub.appendChild(b);
    });
  } else if (host.parentElement !== page) {
    page.appendChild(host);
  }

  window.remixShowCustomSubPage(
    window.__remixCustomSubPage || "board"
  );
  return host;
};

window.remixShowCustomSubPage = function remixShowCustomSubPage(id) {
  window.__remixCustomSubPage = id;
  ["board", "colors", "speeds", "dice"].forEach(function (name) {
    const panel = document.getElementById("remix-custom-panel-" + name);
    const tab = document.getElementById("remix-custom-subtab-" + name);
    const on = name === id;
    if (panel) panel.classList.toggle("remix-custom-panel-on", on);
    if (tab) tab.classList.toggle("remix-custom-subtab-on", on);
  });
};

window.CustomSettings.runCodeBefore = function () {};
window.CustomSettings.alterSnakeCode = function (code) {
  return code;
};
