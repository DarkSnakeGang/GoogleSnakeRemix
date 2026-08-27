window.CustomSettings = {};

// Chrome changes <input type="number"> on mouse wheel even when you're just
// scrolling the settings panel — feels like the value "keeps going". Also
// never overwrite a field the user is actively editing.
window.remixStabilizeNumberInput = function remixStabilizeNumberInput(el) {
  if (!el || el.dataset.remixNumStable === "1") return el;
  el.dataset.remixNumStable = "1";
  // No spinner UI: typing / arrows-when-focused only.
  el.setAttribute("inputmode", "decimal");
  el.addEventListener(
    "wheel",
    function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      const panel =
        el.closest(".remix-custom-panel") ||
        el.closest(".ultra-settings-page") ||
        document.getElementById("settings-popup-pudding");
      if (panel) panel.scrollTop += ev.deltaY;
    },
    { passive: false }
  );
  // Ignore accidental arrow key repeats unless the field is focused.
  el.addEventListener("keydown", function (ev) {
    if (
      (ev.key === "ArrowUp" || ev.key === "ArrowDown") &&
      document.activeElement !== el
    ) {
      ev.preventDefault();
    }
  });
  return el;
};

window.remixSetNumberInputValue = function remixSetNumberInputValue(el, value) {
  if (!el) return;
  if (document.activeElement === el) return;
  const next = String(value);
  if (el.value !== next) el.value = next;
};

window.REMIX_CUSTOM_SUBPAGES = [
  ["board", "Board"],
  ["colors", "Colors"],
  ["speeds", "Speeds"],
  ["dice", "Dice"],
  ["fruit", "Fruit"],
  ["poison", "Poison"],
];

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
      '<div id="remix-custom-panel-dice" class="remix-custom-panel"></div>' +
      '<div id="remix-custom-panel-fruit" class="remix-custom-panel"></div>' +
      '<div id="remix-custom-panel-poison" class="remix-custom-panel"></div>';
    page.appendChild(host);

    const sub = document.getElementById("remix-custom-subpager");
    window.REMIX_CUSTOM_SUBPAGES.forEach(function (pair) {
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
  } else {
    if (host.parentElement !== page) page.appendChild(host);
    // Upgrade older hosts that lack the Poison panel/tab.
    if (!document.getElementById("remix-custom-panel-poison")) {
      const poisonPanel = document.createElement("div");
      poisonPanel.id = "remix-custom-panel-poison";
      poisonPanel.className = "remix-custom-panel";
      host.appendChild(poisonPanel);
    }
    const sub = document.getElementById("remix-custom-subpager");
    if (sub && !document.getElementById("remix-custom-subtab-poison")) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "remix-custom-subtab";
      b.id = "remix-custom-subtab-poison";
      b.textContent = "Poison";
      b.addEventListener("click", function () {
        window.remixShowCustomSubPage("poison");
      });
      sub.appendChild(b);
    }
  }

  window.remixShowCustomSubPage(
    window.__remixCustomSubPage || "board"
  );
  return host;
};

window.remixShowCustomSubPage = function remixShowCustomSubPage(id) {
  window.__remixCustomSubPage = id;
  window.REMIX_CUSTOM_SUBPAGES.forEach(function (pair) {
    const name = pair[0];
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
