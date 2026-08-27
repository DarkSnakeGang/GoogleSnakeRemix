window.CustomFruit = {};

window.CUSTOM_FRUIT_ICON =
  "https://i.postimg.cc/HLr5YJmb/modloader-icon.png";

window.remixCustomFruitSlots = [
  ["CustomFruitNormal", "Normal", "fruitnormal"],
  ["CustomFruitPixel", "Pixel", "fruitpixel"],
  ["CustomFruitReal", "Real", "fruitreal"],
];

window.remixCustomPoisonSlots = [
  ["CustomPoisonNormal", "Normal", "poisonnormal"],
  ["CustomPoisonPixel", "Pixel", "poisonpixel"],
  ["CustomPoisonReal", "Real", "poisonreal"],
];

window.remixEnsureCustomFruitSettings = function remixEnsureCustomFruitSettings() {
  if (!window.pudding_settings) window.pudding_settings = {};
  const s = window.pudding_settings;
  window.remixCustomFruitSlots
    .concat(window.remixCustomPoisonSlots)
    .forEach(function (pair) {
      if (typeof s[pair[0]] !== "string") s[pair[0]] = "";
    });
  if (typeof s.CustomFruitApplied !== "boolean") s.CustomFruitApplied = false;
  if (typeof s.CustomPoisonApplied !== "boolean") s.CustomPoisonApplied = false;
  if (typeof s.CustomPoison !== "boolean") s.CustomPoison = false;
  if (!Array.isArray(s.CustomFruitUserPresets)) s.CustomFruitUserPresets = [];
  if (!Array.isArray(s.CustomPoisonUserPresets)) s.CustomPoisonUserPresets = [];
  return s;
};

window.remixMergedCustomFruitPresets = function remixMergedCustomFruitPresets() {
  window.remixEnsureCustomFruitSettings();
  return (window.REMIX_CUSTOM_FRUIT_PRESETS || []).concat(
    window.pudding_settings.CustomFruitUserPresets || []
  );
};

window.remixMergedCustomPoisonPresets = function remixMergedCustomPoisonPresets() {
  window.remixEnsureCustomFruitSettings();
  return (window.REMIX_CUSTOM_POISON_PRESETS || []).concat(
    window.pudding_settings.CustomPoisonUserPresets || []
  );
};

window.remixCustomFruitPresetById = function remixCustomFruitPresetById(id) {
  const list = window.remixMergedCustomFruitPresets();
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i];
  }
  return null;
};

window.remixCustomPoisonPresetById = function remixCustomPoisonPresetById(id) {
  const list = window.remixMergedCustomPoisonPresets();
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i];
  }
  return null;
};

window.remixSlugifyPresetId = function remixSlugifyPresetId(label) {
  const base = String(label || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "preset";
};

window.remixPromptPresetName = function remixPromptPresetName(kind) {
  const ask =
    typeof window.prompt === "function"
      ? window.prompt
      : function () {
          return null;
        };
  const raw = ask("Name for this " + (kind || "custom") + " preset:", "");
  if (raw == null) return null;
  const label = String(raw).trim();
  if (!label) return "";
  return label;
};

window.remixFillPresetSelectOptions = function remixFillPresetSelectOptions(
  selectEl,
  presets,
  selectedId
) {
  if (!selectEl) return;
  const keep = selectedId != null ? selectedId : selectEl.value;
  let html = '<option value="">— choose preset —</option>';
  (presets || []).forEach(function (p) {
    if (!p || !p.id) return;
    const label = p.user ? p.label + " (saved)" : p.label;
    html +=
      '<option value="' +
      String(p.id).replace(/"/g, "&quot;") +
      '">' +
      String(label)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;") +
      "</option>";
  });
  selectEl.innerHTML = html;
  if (keep && selectEl.querySelector('option[value="' + keep + '"]')) {
    selectEl.value = keep;
  }
};

window.remixRefreshCustomFruitPresetSelect = function remixRefreshCustomFruitPresetSelect(
  selectedId
) {
  window.remixFillPresetSelectOptions(
    document.getElementById("remix-custom-fruit-preset"),
    window.remixMergedCustomFruitPresets(),
    selectedId
  );
};

window.remixRefreshCustomPoisonPresetSelect = function remixRefreshCustomPoisonPresetSelect(
  selectedId
) {
  window.remixFillPresetSelectOptions(
    document.getElementById("remix-custom-poison-preset"),
    window.remixMergedCustomPoisonPresets(),
    selectedId
  );
};

/** Save currently applied fruit URLs (https or data:) as a named user preset. */
window.remixSaveCustomFruitPreset = function remixSaveCustomFruitPreset() {
  const s = window.remixEnsureCustomFruitSettings();
  if (
    !s.CustomFruitApplied ||
    !s.CustomFruitNormal ||
    !s.CustomFruitPixel ||
    !s.CustomFruitReal
  ) {
    window.remixSetCustomFruitStatus(
      "Apply custom fruit successfully before saving a preset.",
      false
    );
    return false;
  }
  const label = window.remixPromptPresetName("custom fruit");
  if (label == null) return false;
  if (!label) {
    window.remixSetCustomFruitStatus("Preset name required.", false);
    return false;
  }
  let id = "user-" + window.remixSlugifyPresetId(label);
  const list = s.CustomFruitUserPresets;
  let existing = -1;
  for (let i = 0; i < list.length; i++) {
    if (list[i].label === label || list[i].id === id) {
      existing = i;
      break;
    }
  }
  if (existing < 0) {
    let n = 2;
    const taken = function (candidate) {
      if (window.remixCustomFruitPresetById(candidate)) return true;
      return false;
    };
    while (taken(id)) {
      id = "user-" + window.remixSlugifyPresetId(label) + "-" + n;
      n++;
    }
  } else {
    id = list[existing].id;
  }
  const preset = {
    id: id,
    label: label,
    normal: s.CustomFruitNormal,
    pixel: s.CustomFruitPixel,
    real: s.CustomFruitReal,
    user: true,
  };
  if (existing >= 0) list[existing] = preset;
  else list.push(preset);
  if (typeof window.saveSettings === "function") window.saveSettings();
  window.remixRefreshCustomFruitPresetSelect(id);
  window.remixSetCustomFruitStatus('Saved preset "' + label + '".', true);
  return true;
};

/** Save currently applied poison URLs (https or data:) as a named user preset. */
window.remixSaveCustomPoisonPreset = function remixSaveCustomPoisonPreset() {
  const s = window.remixEnsureCustomFruitSettings();
  if (
    !s.CustomPoisonApplied ||
    !s.CustomPoisonNormal ||
    !s.CustomPoisonPixel ||
    !s.CustomPoisonReal
  ) {
    window.remixSetCustomPoisonStatus(
      "Apply custom poison successfully before saving a preset.",
      false
    );
    return false;
  }
  const label = window.remixPromptPresetName("custom poison");
  if (label == null) return false;
  if (!label) {
    window.remixSetCustomPoisonStatus("Preset name required.", false);
    return false;
  }
  let id = "user-" + window.remixSlugifyPresetId(label);
  const list = s.CustomPoisonUserPresets;
  let existing = -1;
  for (let i = 0; i < list.length; i++) {
    if (list[i].label === label || list[i].id === id) {
      existing = i;
      break;
    }
  }
  if (existing < 0) {
    let n = 2;
    while (window.remixCustomPoisonPresetById(id)) {
      id = "user-" + window.remixSlugifyPresetId(label) + "-" + n;
      n++;
    }
  } else {
    id = list[existing].id;
  }
  const preset = {
    id: id,
    label: label,
    poisonNormal: s.CustomPoisonNormal,
    poisonPixel: s.CustomPoisonPixel,
    poisonReal: s.CustomPoisonReal,
    user: true,
  };
  if (existing >= 0) list[existing] = preset;
  else list.push(preset);
  if (typeof window.saveSettings === "function") window.saveSettings();
  window.remixRefreshCustomPoisonPresetSelect(id);
  window.remixSetCustomPoisonStatus('Saved preset "' + label + '".', true);
  return true;
};

// Board/HUD sprites when Custom is selected but no preset has been Applied.
// Never use CUSTOM_FRUIT_ICON in-game — that art is menu-only.
window.remixCustomFruitDefaultSprites = function remixCustomFruitDefaultSprites() {
  const ghost = window.remixCustomFruitPresetById("pacman-ghost");
  if (ghost) {
    return {
      Normal: ghost.normal,
      Pixel: ghost.pixel,
      Real: ghost.real,
    };
  }
  return {
    Normal: "https://i.postimg.cc/TP7ZGZGf/pacman-ghost.png",
    Pixel: "https://i.postimg.cc/BvtK8fxb/px-pacman-ghost.png",
    Real: "https://i.postimg.cc/3Nc4x2Ch/ghost-real.png",
  };
};

window.remixLoadImageDimensions = function remixLoadImageDimensions(src) {
  return new Promise(function (resolve, reject) {
    const url = (src || "").trim();
    if (!url) {
      reject(new Error("empty"));
      return;
    }
    const img = new Image();
    if (!url.startsWith("data:")) img.crossOrigin = "anonymous";
    img.onload = function () {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = function () {
      reject(new Error("load failed"));
    };
    img.src = url;
  });
};

window.remixCustomFruitSlotSize = function remixCustomFruitSlotSize(keyOrSlug) {
  const s = String(keyOrSlug || "");
  if (/pixel/i.test(s)) return 170;
  return 128;
};

window.remixValidateCustomFruitImageSize = function remixValidateCustomFruitImageSize(
  src,
  size,
  label
) {
  const expected = size | 0;
  const name = label || "Image";
  return window.remixLoadImageDimensions(src).then(function (dim) {
    if (dim.width !== expected || dim.height !== expected) {
      throw new Error(
        "size:" +
          name +
          ":" +
          expected +
          ":" +
          dim.width +
          "x" +
          dim.height
      );
    }
    return src.trim();
  });
};

// Back-compat alias used by older tests/callers (Normal/Real size).
window.remixValidateCustomFruitImage128 = function remixValidateCustomFruitImage128(
  src
) {
  return window.remixValidateCustomFruitImageSize(src, 128, "Image");
};

window.remixReadCustomFruitFile = function remixReadCustomFruitFile(file) {
  return new Promise(function (resolve, reject) {
    if (!file) {
      reject(new Error("no file"));
      return;
    }
    if (file.size > 900000) {
      reject(new Error("file too large"));
      return;
    }
    const reader = new FileReader();
    reader.onload = function () {
      resolve(String(reader.result || ""));
    };
    reader.onerror = function () {
      reject(new Error("read failed"));
    };
    reader.readAsDataURL(file);
  });
};

window.remixResolveCustomFruitSlot = function remixResolveCustomFruitSlot(
  key,
  label,
  urlId,
  fileId
) {
  const size = window.remixCustomFruitSlotSize(key);
  const name = label || key;
  const fileEl = document.getElementById(fileId);
  const urlEl = document.getElementById(urlId);
  if (fileEl && fileEl.files && fileEl.files[0]) {
    return window
      .remixReadCustomFruitFile(fileEl.files[0])
      .then(function (dataUri) {
        return window.remixValidateCustomFruitImageSize(dataUri, size, name);
      })
      .then(function (valid) {
        return { key: key, url: valid };
      })
      .catch(function (err) {
        const msg = String(err && err.message ? err.message : err);
        if (msg.indexOf("size:") === 0 || msg.indexOf("empty:") === 0) {
          throw err;
        }
        if (msg === "file too large" || msg === "read failed" || msg === "no file") {
          throw err;
        }
        throw new Error("load:" + name);
      });
  }
  const url = urlEl ? String(urlEl.value || "").trim() : "";
  if (!url) {
    return Promise.reject(new Error("empty:" + name));
  }
  return window
    .remixValidateCustomFruitImageSize(url, size, name)
    .then(function (valid) {
      return { key: key, url: valid };
    })
    .catch(function (err) {
      const msg = String(err && err.message ? err.message : err);
      if (msg.indexOf("size:") === 0 || msg.indexOf("empty:") === 0) {
        throw err;
      }
      throw new Error("load:" + name);
    });
};

window.remixApplySlotErrorMessage = function remixApplySlotErrorMessage(err) {
  const msg = String(err && err.message ? err.message : err);
  if (msg.indexOf("empty:") === 0) {
    return msg.slice(6) + " is required.";
  }
  if (msg.indexOf("size:") === 0) {
    const parts = msg.split(":");
    // size:Label:expected:actualWxH
    const label = parts[1] || "Image";
    const expected = parts[2] || "?";
    const actual = parts[3] || "wrong size";
    return (
      label +
      " must be exactly " +
      expected +
      "×" +
      expected +
      " (got " +
      actual +
      ")."
    );
  }
  if (msg.indexOf("load:") === 0) {
    return "Could not load " + msg.slice(5) + ".";
  }
  if (msg.indexOf("load failed") >= 0 || msg === "load failed") {
    return "Could not load one of the images.";
  }
  if (msg === "file too large") {
    return "Uploaded file is too large (max ~900 KB).";
  }
  return "Apply failed.";
};

window.remixSyncCustomFruitEntryFromSettings = function remixSyncCustomFruitEntryFromSettings() {
  window.remixEnsureCustomFruitSettings();
  const s = window.pudding_settings;
  if (s.CustomPoisonApplied) {
    window.__remixCustomPoison = {
      Normal: s.CustomPoisonNormal,
      Pixel: s.CustomPoisonPixel,
      Real: s.CustomPoisonReal,
    };
  } else {
    window.__remixCustomPoison = null;
  }
  if (
    typeof window.CUSTOM_FRUIT_NEW_FRUIT_INDEX !== "number" ||
    !window.new_fruit
  ) {
    return false;
  }
  const entry = window.new_fruit[window.CUSTOM_FRUIT_NEW_FRUIT_INDEX];
  if (!entry) return false;
  if (!s.CustomFruitApplied) {
    const defaults = window.remixCustomFruitDefaultSprites();
    entry.Normal = defaults.Normal;
    entry.Pixel = defaults.Pixel;
    entry.Real = defaults.Real;
    return false;
  }
  entry.Normal = s.CustomFruitNormal;
  entry.Pixel = s.CustomFruitPixel;
  entry.Real = s.CustomFruitReal;
  return true;
};

// Hot-reload an F3E sprite (path + Image + both canvases). Fruit.alterCode bakes
// URLs at load; Apply must mutate the live atlas or the board keeps the old art.
window.remixReloadFruitSprite = function remixReloadFruitSprite(sprite, url) {
  if (!sprite || !url) return;
  sprite.path = url;
  const img = sprite.jB || sprite.Hr;
  if (!img) return;
  const paint = function () {
    sprite.loaded = true;
    try {
      if (sprite.oa && sprite.oa.canvas) {
        sprite.oa.canvas.width = img.width;
        sprite.oa.canvas.height = img.height;
        sprite.oa.clearRect(0, 0, img.width, img.height);
        sprite.oa.drawImage(img, 0, 0);
      }
      if (sprite.ka && sprite.ka.canvas) {
        sprite.ka.canvas.width = img.width;
        sprite.ka.canvas.height = img.height;
        sprite.ka.clearRect(0, 0, img.width, img.height);
        sprite.ka.drawImage(img, 0, 0);
      }
    } catch (_e) {}
  };
  img.onload = paint;
  img.crossOrigin = "Anonymous";
  if (
    url.indexOf("postimg") >= 0 ||
    url.indexOf("data:image") === 0 ||
    /^https?:\/\//.test(url)
  ) {
    img.src = url;
  } else {
    img.src = "https://www.google.com/logos/fnbx/" + url;
  }
  if (img.complete && img.naturalWidth) paint();
};

window.remixPatchCustomFruitAtlas = function remixPatchCustomFruitAtlas() {
  // Keep new_fruit + poison atlas in sync before mutating live sprites
  // (fruit managers are rebuilt on new games with baked URLs).
  window.remixSyncCustomFruitEntryFromSettings();
  const b7 = window.__remixCustomFruitB7;
  const entry =
    window.new_fruit &&
    typeof window.CUSTOM_FRUIT_NEW_FRUIT_INDEX === "number" &&
    window.new_fruit[window.CUSTOM_FRUIT_NEW_FRUIT_INDEX];
  if (b7 && entry) {
    window.remixReloadFruitSprite(b7.oa, entry.Normal);
    window.remixReloadFruitSprite(b7.Ba, entry.Pixel);
    window.remixReloadFruitSprite(b7.Ca, entry.Real);
  }
  const poison = window.__remixCustomPoison;
  if (poison) {
    window.__remixCustomPoisonAtlas = window.__remixCustomPoisonAtlas || {};
    ["Normal", "Pixel", "Real"].forEach(function (key) {
      const slot = key === "Normal" ? "oa" : key === "Pixel" ? "Ba" : "Ca";
      let sprite = window.__remixCustomPoisonAtlas[slot];
      if (!sprite) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        const color = document.createElement("canvas").getContext("2d");
        const grey = document.createElement("canvas").getContext("2d");
        sprite = { path: "", jB: img, oa: color, ka: grey, loaded: false };
        window.__remixCustomPoisonAtlas[slot] = sprite;
      }
      window.remixReloadFruitSprite(sprite, poison[key]);
    });
  } else {
    window.__remixCustomPoisonAtlas = null;
  }
};

window.remixCustomPoisonAtlasCanvas = function remixCustomPoisonAtlasCanvas(graphics) {
  const atlas = window.__remixCustomPoisonAtlas;
  if (!atlas) return null;
  let g = graphics;
  if (typeof g !== "number") g = window.graphics_selected;
  let sprite = atlas.oa;
  if (g === 1 && atlas.Ba) sprite = atlas.Ba;
  else if (g === 2 && atlas.Ca) sprite = atlas.Ca;
  return sprite && sprite.oa && sprite.oa.canvas;
};

window.remixRefreshCustomFruitRuntime = function remixRefreshCustomFruitRuntime() {
  window.remixSyncCustomFruitEntryFromSettings();
  window.remixPatchCustomFruitAtlas();
  const appleRoot = document.querySelector("#apple");
  // Menu icon is always the modloader mark — never swap it to board art.
  if (
    appleRoot &&
    typeof window.CUSTOM_FRUIT_MENU_INDEX === "number" &&
    appleRoot.children[window.CUSTOM_FRUIT_MENU_INDEX]
  ) {
    const icon = appleRoot.children[window.CUSTOM_FRUIT_MENU_INDEX];
    icon.src = window.CUSTOM_FRUIT_ICON;
    icon.alt = "Custom Fruit";
  }
  if (appleRoot) {
    window.apple_img_arr = Array.from(appleRoot.children).map(function (el) {
      return el.src;
    });
  }
  if (typeof window.apply_topbar_icons === "function") {
    try {
      window.apply_topbar_icons();
    } catch (_e) {}
  }
  if (
    typeof window.fruit_selected !== "undefined" &&
    window.fruit_selected === window.CUSTOM_FRUIT_MENU_INDEX &&
    typeof window.graphics_selected !== "undefined"
  ) {
    const idx = window.CUSTOM_FRUIT_NEW_FRUIT_INDEX;
    const fruit = window.new_fruit && window.new_fruit[idx];
    if (fruit) {
      let img = fruit.Normal;
      if (window.graphics_selected === 1) img = fruit.Pixel;
      else if (window.graphics_selected === 2) img = fruit.Real;
      window.current_fruit_img = img;
      const hud = document.querySelector('[jsname="Jesp7b"]');
      if (hud) hud.src = img;
    }
  }
  window.remixReapplyCustomFruitIfSelected();
};

window.remixReapplyCustomFruitIfSelected = function remixReapplyCustomFruitIfSelected() {
  const root = document.querySelector("#apple");
  if (!root || typeof window.CUSTOM_FRUIT_MENU_INDEX !== "number") return;
  let selected = -1;
  for (let i = 0; i < root.children.length; i++) {
    if (((root.children[i].className || "") + "").indexOf("tuJOWd") >= 0) {
      selected = i;
      break;
    }
  }
  if (selected !== window.CUSTOM_FRUIT_MENU_INDEX) return;
  if (typeof window.puddingMenuSelect === "function") {
    window.puddingMenuSelect("apple", window.CUSTOM_FRUIT_MENU_INDEX);
  }
};

window.remixSetCustomFruitStatus = function remixSetCustomFruitStatus(msg, ok) {
  const el = document.getElementById("remix-custom-fruit-status");
  if (!el) return;
  el.textContent = msg || "";
  el.classList.toggle("remix-custom-status-ok", !!ok);
  el.classList.toggle("remix-custom-status-err", !ok);
};

window.remixSetCustomPoisonStatus = function remixSetCustomPoisonStatus(msg, ok) {
  const el = document.getElementById("remix-custom-poison-status");
  if (!el) return;
  el.textContent = msg || "";
  el.classList.toggle("remix-custom-status-ok", !!ok);
  el.classList.toggle("remix-custom-status-err", !ok);
};

window.remixResolveCustomSlotsInOrder = function remixResolveCustomSlotsInOrder(
  slots
) {
  let chain = Promise.resolve([]);
  slots.forEach(function (pair) {
    chain = chain.then(function (acc) {
      return window
        .remixResolveCustomFruitSlot(
          pair[0],
          pair[1],
          "remix-custom-fruit-url-" + pair[2],
          "remix-custom-fruit-file-" + pair[2]
        )
        .then(function (resolved) {
          acc.push(resolved);
          return acc;
        });
    });
  });
  return chain;
};

window.remixApplyCustomFruit = function remixApplyCustomFruit() {
  window.remixSetCustomFruitStatus("Validating…", true);
  return window
    .remixResolveCustomSlotsInOrder(window.remixCustomFruitSlots)
    .then(function (resolved) {
      resolved.forEach(function (slot) {
        window.pudding_settings[slot.key] = slot.url;
      });
      window.pudding_settings.CustomFruitApplied = true;
      window.remixSyncCustomFruitEntryFromSettings();
      if (typeof window.saveSettings === "function") window.saveSettings();
      window.remixRefreshCustomFruitRuntime();
      window.remixSetCustomFruitStatus("Custom fruit applied.", true);
    })
    .catch(function (err) {
      window.remixSetCustomFruitStatus(
        window.remixApplySlotErrorMessage(err),
        false
      );
    });
};

window.remixApplyCustomPoison = function remixApplyCustomPoison() {
  window.remixSetCustomPoisonStatus("Validating…", true);
  return window
    .remixResolveCustomSlotsInOrder(window.remixCustomPoisonSlots)
    .then(function (resolved) {
      resolved.forEach(function (slot) {
        window.pudding_settings[slot.key] = slot.url;
      });
      window.pudding_settings.CustomPoisonApplied = true;
      window.remixSyncCustomFruitEntryFromSettings();
      if (typeof window.saveSettings === "function") window.saveSettings();
      window.remixRefreshCustomFruitRuntime();
      if (typeof window.remixSyncCustomPoisonCheckbox === "function") {
        window.remixSyncCustomPoisonCheckbox();
      }
      window.remixSetCustomPoisonStatus("Custom poison applied.", true);
    })
    .catch(function (err) {
      window.remixSetCustomPoisonStatus(
        window.remixApplySlotErrorMessage(err),
        false
      );
    });
};

window.remixFillCustomFruitPresetFields = function remixFillCustomFruitPresetFields(
  preset
) {
  [
    ["CustomFruitNormal", "normal"],
    ["CustomFruitPixel", "pixel"],
    ["CustomFruitReal", "real"],
  ].forEach(function (pair) {
    const val = preset[pair[1]] || "";
    window.pudding_settings[pair[0]] = val;
    const slug = pair[0].replace(/^Custom/, "").toLowerCase();
    const urlEl = document.getElementById("remix-custom-fruit-url-" + slug);
    const fileEl = document.getElementById("remix-custom-fruit-file-" + slug);
    if (urlEl) urlEl.value = val;
    if (fileEl) fileEl.value = "";
  });
};

window.remixFillCustomPoisonPresetFields = function remixFillCustomPoisonPresetFields(
  preset
) {
  [
    ["CustomPoisonNormal", "poisonNormal"],
    ["CustomPoisonPixel", "poisonPixel"],
    ["CustomPoisonReal", "poisonReal"],
  ].forEach(function (pair) {
    const val = preset[pair[1]] || "";
    window.pudding_settings[pair[0]] = val;
    const slug = pair[0].replace(/^Custom/, "").toLowerCase();
    const urlEl = document.getElementById("remix-custom-fruit-url-" + slug);
    const fileEl = document.getElementById("remix-custom-fruit-file-" + slug);
    if (urlEl) urlEl.value = val;
    if (fileEl) fileEl.value = "";
  });
};

window.remixLoadCustomFruitPreset = function remixLoadCustomFruitPreset() {
  const sel = document.getElementById("remix-custom-fruit-preset");
  if (!sel) return Promise.resolve();
  const preset = window.remixCustomFruitPresetById(sel.value);
  if (!preset) {
    window.remixSetCustomFruitStatus("Choose a preset first.", false);
    return Promise.resolve();
  }
  window.remixFillCustomFruitPresetFields(preset);
  window.remixSetCustomFruitStatus(
    'Applying preset "' + preset.label + '"…',
    true
  );
  return window.remixApplyCustomFruit();
};

window.remixLoadCustomPoisonPreset = function remixLoadCustomPoisonPreset() {
  const sel = document.getElementById("remix-custom-poison-preset");
  if (!sel) return Promise.resolve();
  const preset = window.remixCustomPoisonPresetById(sel.value);
  if (!preset) {
    window.remixSetCustomPoisonStatus("Choose a preset first.", false);
    return Promise.resolve();
  }
  window.remixFillCustomPoisonPresetFields(preset);
  window.remixSetCustomPoisonStatus(
    'Applying preset "' + preset.label + '"…',
    true
  );
  return window.remixApplyCustomPoison();
};

window.remixBuildCustomSlotRows = function remixBuildCustomSlotRows(slots) {
  let rows = "";
  slots.forEach(function (pair) {
    const size = window.remixCustomFruitSlotSize(pair[0]);
    rows +=
      '<div class="remix-custom-fruit-row">' +
      "<label>" +
      pair[1] +
      "</label>" +
      '<input id="remix-custom-fruit-url-' +
      pair[2] +
      '" class="remix-custom-input" type="url" placeholder="https://…" />' +
      '<input id="remix-custom-fruit-file-' +
      pair[2] +
      '" class="remix-custom-file" type="file" accept="image/*" title="Upload ' +
      size +
      "×" +
      size +
      '" />' +
      "</div>";
  });
  return rows;
};

window.remixInjectCustomFruitSettingsUi = function remixInjectCustomFruitSettingsUi() {
  const panel = document.getElementById("remix-custom-panel-fruit");
  if (!panel) return;
  window.remixEnsureCustomFruitSettings();
  let card = document.getElementById("remix-custom-fruit-card");
  if (!card) {
    card = document.createElement("div");
    card.id = "remix-custom-fruit-card";
    card.className = "remix-custom-card";
    card.innerHTML =
      '<div class="remix-custom-title">Custom fruit</div>' +
      '<div class="remix-custom-hint">Normal / Real: 128×128. Pixel: 170×170. Adds a modloader icon to the fruit row. Save stores the last successful Apply (links or uploads).</div>' +
      '<div class="remix-custom-toolbar">' +
      '<select id="remix-custom-fruit-preset" class="remix-custom-select"></select>' +
      '<div class="remix-custom-toolbar-actions">' +
      '<button type="button" id="remix-custom-fruit-apply" class="btn remix-custom-btn-inline">Apply</button>' +
      '<button type="button" id="remix-custom-fruit-save-preset" class="btn remix-custom-btn-inline">Save preset</button>' +
      "</div>" +
      "</div>" +
      window.remixBuildCustomSlotRows(window.remixCustomFruitSlots) +
      '<div id="remix-custom-fruit-status" class="remix-custom-hint remix-custom-status"></div>';
    panel.appendChild(card);
    document
      .getElementById("remix-custom-fruit-preset")
      .addEventListener("change", function () {
        if (!this.value) return;
        window.__remixFruitPresetApply = window.remixLoadCustomFruitPreset();
      });
    document
      .getElementById("remix-custom-fruit-apply")
      .addEventListener("click", function () {
        window.remixApplyCustomFruit();
      });
    document
      .getElementById("remix-custom-fruit-save-preset")
      .addEventListener("click", function () {
        window.remixSaveCustomFruitPreset();
      });
  }
  window.remixRefreshCustomFruitPresetSelect();
  window.remixCustomFruitSlots.forEach(function (pair) {
    const urlEl = document.getElementById("remix-custom-fruit-url-" + pair[2]);
    if (urlEl && document.activeElement !== urlEl) {
      urlEl.value = window.pudding_settings[pair[0]] || "";
    }
  });
};

window.remixInjectCustomPoisonSettingsUi = function remixInjectCustomPoisonSettingsUi() {
  const panel = document.getElementById("remix-custom-panel-poison");
  if (!panel) return;
  window.remixEnsureCustomFruitSettings();
  let card = document.getElementById("remix-custom-poison-card");
  if (!card) {
    card = document.createElement("div");
    card.id = "remix-custom-poison-card";
    card.className = "remix-custom-card";
    card.innerHTML =
      '<div class="remix-custom-title">Custom poison</div>' +
      '<div class="remix-custom-hint">Normal / Real: 128×128. Pixel: 170×170. Toggle below to use these sprites for all poisons (overrides Skull when on). Save stores the last successful Apply (links or uploads).</div>' +
      '<div class="form-check form-switch remix-custom-poison-enable" style="margin:6px 0 10px;">' +
      '<input class="form-check-input" type="checkbox" role="switch" id="CustomPoisonFruit">' +
      '<label class="form-check-label" for="CustomPoisonFruit" style="margin:3px;color:white;font-family:Roboto,Arial,sans-serif;">Custom Poison Fruit</label>' +
      "</div>" +
      '<div class="remix-custom-toolbar">' +
      '<select id="remix-custom-poison-preset" class="remix-custom-select"></select>' +
      '<div class="remix-custom-toolbar-actions">' +
      '<button type="button" id="remix-custom-poison-apply" class="btn remix-custom-btn-inline">Apply</button>' +
      '<button type="button" id="remix-custom-poison-save-preset" class="btn remix-custom-btn-inline">Save preset</button>' +
      "</div>" +
      "</div>" +
      window.remixBuildCustomSlotRows(window.remixCustomPoisonSlots) +
      '<div id="remix-custom-poison-status" class="remix-custom-hint remix-custom-status"></div>';
    panel.appendChild(card);
    document
      .getElementById("remix-custom-poison-preset")
      .addEventListener("change", function () {
        if (!this.value) return;
        window.__remixPoisonPresetApply = window.remixLoadCustomPoisonPreset();
      });
    document
      .getElementById("remix-custom-poison-apply")
      .addEventListener("click", function () {
        window.remixApplyCustomPoison();
      });
    document
      .getElementById("remix-custom-poison-save-preset")
      .addEventListener("click", function () {
        window.remixSaveCustomPoisonPreset();
      });
  }
  window.remixRefreshCustomPoisonPresetSelect();
  window.remixBindCustomPoisonCheckbox();
  window.remixCustomPoisonSlots.forEach(function (pair) {
    const urlEl = document.getElementById("remix-custom-fruit-url-" + pair[2]);
    if (urlEl && document.activeElement !== urlEl) {
      urlEl.value = window.pudding_settings[pair[0]] || "";
    }
  });
};

window.remixSyncCustomPoisonCheckbox = function remixSyncCustomPoisonCheckbox() {
  window.remixEnsureCustomFruitSettings();
  const box = document.getElementById("CustomPoisonFruit");
  if (!box) return;
  // Stay off unless the user opts in — Apply / presets never flip this on.
  box.checked = !!window.pudding_settings.CustomPoison;
};

window.remixBindCustomPoisonCheckbox = function remixBindCustomPoisonCheckbox() {
  window.remixEnsureCustomFruitSettings();
  const box = document.getElementById("CustomPoisonFruit");
  if (!box) return;
  // Drop any leftover Play-tab copy from older layouts.
  const play = document.getElementById("ultra-settings-page-play");
  if (play) {
    const playBox = play.querySelector("#CustomPoisonFruit");
    if (playBox && playBox !== box) {
      const w = playBox.closest(".form-check") || playBox.parentElement;
      if (w && w.parentElement === play) w.remove();
    } else if (playBox === box) {
      const card = document.getElementById("remix-custom-poison-card");
      const wrap = box.closest(".form-check") || box.parentElement;
      if (card && wrap && wrap.parentElement === play) {
        const hint = card.querySelector(".remix-custom-hint");
        card.insertBefore(wrap, hint ? hint.nextSibling : card.firstChild);
      }
    }
  }
  window.remixSyncCustomPoisonCheckbox();
  if (box.dataset.remixCustomPoisonBound === "1") return;
  box.dataset.remixCustomPoisonBound = "1";
  box.addEventListener("change", function () {
    window.pudding_settings.CustomPoison = !!this.checked;
    if (typeof window.saveSettings === "function") window.saveSettings();
    if (!this.checked && typeof window.remixPatchCustomFruitAtlas === "function") {
      window.remixPatchCustomFruitAtlas();
    }
  });
};

window.remixInstallCustomPoisonCheckbox = function remixInstallCustomPoisonCheckbox() {
  window.remixBindCustomPoisonCheckbox();
};

window.injectCustomFruit = function injectCustomFruit() {
  if (!window.new_fruit || window._customFruitInjected) return;
  window._customFruitInjected = true;

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

  // Menu index maps to new_fruit via fruit_index = fruit_selected - (last_fruit_num+1).
  // Chess pieces sit in new_fruit but have NO menu icons, so custom must be the
  // next entry after the visible Pudding fruits (before chess + secret tail).
  // Otherwise selecting the custom menu icon binds to black bishop / other pieces.
  const secretTail = 6;
  let insertAt = window.new_fruit.length - secretTail;
  const skull = window.new_fruit[window.new_fruit.length - 1];
  if (insertAt < 0 || !skull || !/poison-skull/.test(skull.Real || "")) {
    console.error("CustomFruit: secret tail not found, appending at end");
    insertAt = window.new_fruit.length;
  }
  while (
    insertAt > 0 &&
    window.ultraPlaceIsChessFruit &&
    window.ultraPlaceIsChessFruit(window.new_fruit[insertAt - 1])
  ) {
    insertAt--;
  }
  // Fallback chess detect when Ultra helpers are not loaded (Remix-only).
  while (
    insertAt > 0 &&
    window.new_fruit[insertAt - 1] &&
    /\/(bb|bk|bn|bp|bq|br|wb|wk|wn|wp|wq|wr)\.png/.test(
      window.new_fruit[insertAt - 1].Normal || ""
    )
  ) {
    insertAt--;
  }

  // If chess already claimed type ids and we insert ahead of them, bump ids.
  if (window._chessFruitsInjected && typeof window.bbishop === "number") {
    [
      "bbishop",
      "bking",
      "bknight",
      "bpawn",
      "bqueen",
      "brook",
      "wbishop",
      "wking",
      "wknight",
      "wpawn",
      "wqueen",
      "wrook",
    ].forEach(function (key) {
      if (typeof window[key] === "number") window[key] += 1;
    });
  }

  const defaults = window.remixCustomFruitDefaultSprites();
  const placeholder = {
    Normal: defaults.Normal,
    Pixel: defaults.Pixel,
    Real: defaults.Real,
    Poison_values: "b,'#909090','#909090',20",
  };
  window.new_fruit.splice(insertAt, 0, placeholder);

  window.CUSTOM_FRUIT_NEW_FRUIT_INDEX = insertAt;
  const base =
    typeof last_fruit_num !== "undefined"
      ? last_fruit_num
      : document.querySelector("#apple").children.length - 1;
  window.CUSTOM_FRUIT_TYPE = base + 1 + insertAt;

  const appleRoot = document.querySelector("#apple");
  if (appleRoot && !window._customFruitMenuIconInserted) {
    window._customFruitMenuIconInserted = true;
    const img = window.uiImage(window.CUSTOM_FRUIT_ICON);
    img.alt = "Custom Fruit";
    appleRoot.appendChild(img);
    window.CUSTOM_FRUIT_MENU_INDEX = appleRoot.children.length - 1;
  }

  window.remixSyncCustomFruitEntryFromSettings();
};

window.CustomFruit.runCodeBefore = function () {
  window.remixEnsureCustomFruitSettings();
  if (window.new_fruit) {
    window.injectCustomFruit();
  }
};

window.CustomFruit.alterSnakeCode = function (code) {
  if (window.remixCustomFruitHook) return code;
  window.remixCustomFruitHook = true;
  // Ensure entry exists if alter runs without the usual runCodeBefore order.
  if (window.new_fruit && !window._customFruitInjected) {
    window.injectCustomFruit();
  }

  const getAppleStuff = new RegExp(
    /(?:let|const|var).*[a-zA-Z0-9_$]{1,8}\.canvas\:.*\([a-zA-Z0-9_$]{1,8}\.[a-zA-Z0-9_$]{1,8}\);/
  );
  if (getAppleStuff.test(code)) {
    const poisonDefault = code.match(getAppleStuff)[0];
    const poisonCond = poisonDefault.split("?")[1].split("=")[1];
    const skullTypeExpr = poisonDefault.split("<")[1].split("?")[0];
    // Custom Poison Fruit (Custom → Poison checkbox) overrides Skull only when enabled + applied.
    // Otherwise Skull keeps mapping poison apples to the last atlas entry (skull).
    const customPoisonBlock =
      "if(window.pudding_settings.CustomPoison && window.pudding_settings.CustomPoisonApplied && typeof window.CUSTOM_FRUIT_TYPE === 'number' && " +
      poisonCond +
      "){ b.type = window.CUSTOM_FRUIT_TYPE; } else if(window.pudding_settings.Skull){ b.type = " +
      poisonCond +
      " ? " +
      skullTypeExpr +
      " - 1 : b.type; }";
    const patchedApple =
      "if(window.pudding_settings.Skull || (window.pudding_settings.CustomPoison && window.pudding_settings.CustomPoisonApplied)){" +
      customPoisonBlock +
      "} " +
      poisonDefault;
    const skullWrap = new RegExp(
      "if\\(window\\.pudding_settings\\.Skull\\)\\{\\s*b\\.type = [\\s\\S]*?\\}\\s*" +
        poisonDefault.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    if (skullWrap.test(code)) {
      code = code.assertReplace(skullWrap, patchedApple);
    } else if (!code.includes("pudding_settings.CustomPoison && window.pudding_settings.CustomPoisonApplied")) {
      code = code.assertReplace(getAppleStuff, patchedApple);
    }
  }

  // Bind live atlas slot by type index after Fruit.alterCode's goldenIndex line.
  // URL-based capture breaks when defaults/presets change what was baked.
  if (
    typeof window.CUSTOM_FRUIT_TYPE === "number" &&
    !code.includes("window.__remixCustomFruitB7=this.")
  ) {
    const goldRe =
      /(window\.goldenIndex\s*=\s*this\.([a-zA-Z0-9_$]{1,8})\.length\s*-\s*6)/;
    if (goldRe.test(code)) {
      code = code.assertReplace(
        goldRe,
        "$1;window.__remixCustomFruitB7=this.$2[window.CUSTOM_FRUIT_TYPE];if(window.remixPatchCustomFruitAtlas)window.remixPatchCustomFruitAtlas();"
      );
    }
  }

  // G3E image loader: `a` is the F3E sprite, `b` is the onload callback (NOT an apple).
  // Keep postimg/data:image support; board art after Apply is handled via atlas hot-reload.
  const shhGrabber = new RegExp(
    /[a-zA-Z0-9_$]{1,8}\.[a-zA-Z0-9_$]{1,8}\.src=`https:\/\/www\.google\.com\/logos\/fnbx\/\${a\.path}`/
  );
  if (shhGrabber.test(code)) {
    const firstvar = code.match(shhGrabber)[0].split(".")[0];
    const hrName = code.match(shhGrabber)[0].split(".")[1];
    const customLine =
      "if((" +
      firstvar +
      '.path||"").includes("postimg")||(' +
      firstvar +
      '.path||"").indexOf("data:image")===0)' +
      firstvar +
      "." +
      hrName +
      ".src=" +
      firstvar +
      ".path;else $&";
    code = code.assertReplace(shhGrabber, customLine);
  }

  // Poison apples with Custom Poison Fruit: draw poison atlas instead of greyed fruit.
  // Live build: f=b.Oka?E3E(this.oa[e],b.xsa).ka.canvas:this.oa[e].uH(b.xsa)
  const poisonDrawRe =
    /([a-zA-Z0-9_$])=([a-zA-Z0-9_$])\.Oka\?E3E\(this\.([a-zA-Z0-9_$]{1,8})\[([a-zA-Z0-9_$])\],\2\.([a-zA-Z0-9_$]{1,8})\)\.ka\.canvas:this\.\3\[\4\]\.uH\(\2\.\5\)/;
  if (!code.includes("remixCustomPoisonAtlasCanvas") && poisonDrawRe.test(code)) {
    code = code.assertReplace(
      poisonDrawRe,
      "$1=($2.Oka&&window.pudding_settings.CustomPoison&&window.pudding_settings.CustomPoisonApplied&&typeof window.remixCustomPoisonAtlasCanvas==='function'&&window.remixCustomPoisonAtlasCanvas($2.$5))||($2.Oka?E3E(this.$3[$4],$2.$5).ka.canvas:this.$3[$4].uH($2.$5))"
    );
  }

  // HUD / deathscreen: map custom menu icon onto the custom new_fruit slot
  // (chess/hidden fruits live in new_fruit without menu icons).
  if (
    /fruit_index = window\.fruit_selected - \d+/.test(code) &&
    !code.includes("CUSTOM_FRUIT_NEW_FRUIT_INDEX) ? window.CUSTOM_FRUIT_NEW_FRUIT_INDEX")
  ) {
    code = code.replace(
      /fruit_index = window\.fruit_selected - (\d+)/g,
      "fruit_index = (typeof window.CUSTOM_FRUIT_MENU_INDEX==='number' && window.fruit_selected===window.CUSTOM_FRUIT_MENU_INDEX) ? window.CUSTOM_FRUIT_NEW_FRUIT_INDEX : (window.fruit_selected - $1)"
    );
  }

  const disableRealGrey = new RegExp(
    /\(f=[a-zA-Z0-9_$]{1,8}.[a-zA-Z0-9_$]{1,8}\)==null\|\|[a-zA-Z0-9_$]{1,8}\(f,b,c,-1\)/
  );
  if (disableRealGrey.test(code)) {
    const realGrey = code.match(disableRealGrey)[0];
    const realGreyPath = realGrey.split(")")[0].split("=")[1];
    const customGrey =
      "if(window.pudding_settings.CustomPoison && window.pudding_settings.CustomPoisonApplied && window.__remixCustomPoison && " +
      realGreyPath +
      " && ((" +
      realGreyPath +
      '.path||"").indexOf("postimg")>=0 || (' +
      realGreyPath +
      '.path||"").indexOf("data:image")===0 || (' +
      realGreyPath +
      '.path||"").indexOf("poison-ghost")>=0 || (' +
      realGreyPath +
      '.path||"").indexOf("poison-skull")>=0 || (' +
      realGreyPath +
      '.path||"").indexOf("trophy_10")>=0 || (' +
      realGreyPath +
      '.path||"").indexOf("modloader-icon")>=0)){ ' +
      realGrey.slice(0, -1).slice(0, -1).slice(0, -1) +
      "0) } else if (" +
      realGreyPath +
      " && " +
      realGreyPath +
      '.path.includes("poison-skull")) { ' +
      realGrey.slice(0, -1).slice(0, -1).slice(0, -1) +
      "0) } else { " +
      realGrey +
      " }";
    code = code.assertReplace(disableRealGrey, customGrey);
  }

  return code;
};
