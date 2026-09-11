window.CustomFruit = {};

window.CUSTOM_FRUIT_ICON =
  "data:image/png;base64,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";

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

/** Persist Custom fruit/poison fields via Pudding's saveSettings → RemixSettings. */
window.remixPersistCustomFruitSettings = function remixPersistCustomFruitSettings() {
  window.remixEnsureCustomFruitSettings();
  if (typeof window.saveSettings === "function") window.saveSettings();
};

/** Make every saveSettings flush include ensured Custom fruit/poison keys. */
window.remixInstallCustomFruitSaveSettingsHook = function remixInstallCustomFruitSaveSettingsHook() {
  if (window._remixCustomFruitSaveHooked) return;
  if (typeof window.saveSettings !== "function") return;
  window._remixCustomFruitSaveHooked = true;
  const orig = window.saveSettings;
  window.saveSettings = function remixSaveSettingsWithCustomFruit() {
    window.remixEnsureCustomFruitSettings();
    return orig.apply(this, arguments);
  };
};

/** Copy URL inputs into pudding_settings (draft or applied) and persist. */
window.remixCommitCustomFruitUrlFields = function remixCommitCustomFruitUrlFields() {
  const s = window.remixEnsureCustomFruitSettings();
  window.remixCustomFruitSlots
    .concat(window.remixCustomPoisonSlots)
    .forEach(function (pair) {
      const urlEl = document.getElementById("remix-custom-fruit-url-" + pair[2]);
      if (!urlEl) return;
      s[pair[0]] = String(urlEl.value || "").trim();
    });
  window.remixPersistCustomFruitSettings();
};

window.remixBindCustomFruitUrlPersistence = function remixBindCustomFruitUrlPersistence(
  slots
) {
  (slots || []).forEach(function (pair) {
    const urlEl = document.getElementById("remix-custom-fruit-url-" + pair[2]);
    if (!urlEl || urlEl.dataset.remixFruitPersistBound === "1") return;
    urlEl.dataset.remixFruitPersistBound = "1";
    urlEl.addEventListener("change", function () {
      window.remixCommitCustomFruitUrlFields();
    });
  });
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
  window.remixPersistCustomFruitSettings();
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
  window.remixPersistCustomFruitSettings();
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
    Normal: "data:image/png;base64,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",
    Pixel: "data:image/png;base64,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",
    Real: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAC4jAAAuIwF4pT92AAAgAElEQVR42u1ddXwUV9e+d2Z2N4K7uzsULbRA0UIp0ELxFveQENfduBNCEogSnAAhuBT3QrHi7pIQglv7luyc79w7s5slpa98b3nD+3354/xmdWZ2znOe85wz994lvr6+pND+/1rhRSgEQOFFKARAoRUCoNAKAVBohQAotEIAFFohAAqtEACFVgiAQisEQKEVAqDQCgFQaIUAKLRCABRaIQAKrRAAhVYIgEIrBEChFQKg0AoBUGiFACi0QgB8pGYwGPjWz8+P+DLzVcxg8CV6vYH6+OjfMfYae8/0OfYd/l2LfRUC4L/A4cpj7kh0rEFwcXYT3N3cqKeHG/Hx9sDXfUhIcAAJCw0iYWFBJDxM2YaE+ON73sTb2514ebkR9h32XbYPti9ln77/5wDxf8LhStT6Uw8PL8HT01Mw+OqJQe9JImcFkDUb0siStDSSmLKchEcmkKDQeClt9U/lFi7bXXtJ2p56qQv3NJu/cE/T1WuOVg4OTbGKiJxPYuctJ0uWrSDr8LuRkYFEb/DC/euJp5en4O7hKbJjmdjhvx0Q/4WOVy64n58/QerGiPUWvL298LELSU2NIzFz5pD4uAWahQt213fxPNvv+0kng7v32ZfW4fPDGxs327+tctUdB7W6jIuEpN0jZPkDQhY/JmRRtpX1yotVa2w92LjZzh1tOu5Z07XnlhUTpp/08/I53is1fkfduTELrOfMiSGp8+fhMV2Ju7sbMoWXwM6BnQs7J0uWKATAB4t4P8Jo2dXVhYZHBJOo2RFkfupiEhG5s8YMu4PfD+h/ZG7VKss3ieLyJ0T4WSZkHxByGO042mm0yyCQm2i3QKDXQCtcAo14Hp+fxPcOou1E24C2Gi2DWa6VLj6zfLmkXf2/3ho9w27zD9FztlTZvmMfiY+fR0JCAwk7FzVV/Ncxwkfv9Lyo4o6nnp5uJDzcj6SvWk3S0s5WdHLeM6Rdu60J5cvtvq7TnpS1VldBZ5sFGqsboNWeka2tLubqdFfe6rTX3mo1V3Il8WKuIJ7OpcJJo4CmEU4ZBXLCKNLjRkk8iu8fUUw6nCuKB3LzAHQAbQ1aXG6pkkk32rZZkOrotHlk2oozVVasWIPnFEA8Pd2JNwrK/yYg/FeoeA93T8ELL25YWABJTk4ns6OOt/vum3MxtarsPFe6yL7fa1a+BjUqZ0Ht6s/kypUe51ao9NBoW/SabGNzSbayuiRrNJdBFNGEK7IoXsLH50AQz4AgnAKJngaR/oJ2Au2oLNDDMiWHmMMZe6i2VxaE/UZBPIhscFgWyBZ8fxVaFBQvknKzX9/9McEhu9okpSxDzRCsAMHbh/43pIaP1vnM8T7eehR2HjQ+MY4kz19JPDx3f9ahzcHF5Uscf1ap/BVoXP8RNK73Um5U7zdjvVpv5Do1XsvVKj+Wq1fNkcuVvysXK35DtrVFmtdekyXhCkjiVZAk3EoXQJTOIhDOcAAI5BRPAQI9DpQeAUp+AkJZOtgvE4qRT/fJgnQYgXBIpvQ4bn/G/R0zarWHjYRs42AQyPxn7dovjPf2zWjDBWd4MFYSrh89G3y0ed7D00sIDvEla9atJ4mpV9t92mH/skqlz76oUfEWtGiRCc1aX89t9skdY9OWmXLzlo/lpk0fy40aPJEb1X8qV6tyT65Y/i6UKnUHihW7DVa668AAoJGuYb6/hkBAFpDO4fYsvn4GIx9ZgCALkBPoyKMIhMOgsgADAT4/yEzmrEB/wu1umYg7ZCptwW26UdBmvBUFphvWoaW8aNV6XmxI5NqGy1dmqGWlN/1YewofXdTr9X6UUWhs7GyycuUvNYZ9czKyvO2px5VL3oGmjZ7AJ61zclu2vyl/0vmS/Gn3W9Cp+z34tGum3K5jJrT6JAsaN8yEOjXvQo2qWVCu3AMoWfI+WFvdwqhHEIg3OAgkiaUEZAEEgFa4gKBgYGBAwJQgnMRUcQwdjkzAgEAPIRgOqoBAPUB3AREwBYhrZSKtkIluqUw0y5lwRHbYmiuQHfh4Be436mbXbpHTwyMX2MbExCAbuAimVPAxgeCjyvWenl7UR+9MNm7aTdwdz44oX+TA9arFbkHzus+gVdMnuW3bZsudvsiUu/R4CF/0fiH3/uql3Lvfc+jR5zF0/eIhdOqUDa1bZUHThvegdo1MKF8+G0qVzAIb6zvo5JtotxAA13F7FRngIjr9AmjFi+is8/gaY4PToBF+wdePIwh+BiocRp2A6YDs5c6nZA8CAI0gCMh2fIz0T7eibUZWWI+vISjIKqMkrMjVCUwjxEHx4uH7R49e3C5ubioJCDBwIWv+3Yb/5wCwjAQXV2eSkpxI0pfcrvRp658TS9nued2g+k1o2RAd3+qJsX2Hu+j4O9CrX5bc9+tX8sB+AN9+Y4SBA15D368ew1d9n0DPHk/g0/YPESwPoG6tbKhQ/iGULvUAbG3ugla6rZjmpsoCWP4hCDSYDjgLCOc4ACQUhqKIqYAeVVngJ54GqJoOlLRgMqYTflJf38ScjyliCT5ejkJyaa6N1WqjSObj87D7Hdqle4YHpmsCAr0wJXgqbWlfw/9fAJicr/cx4AXxIPOTUkjKrDMtGlU9vKtMsbtI9w+MDRtey+3QLlvu3PkpdO/xRO7X/6k8aNgTGDHiBYwe8QbGjHoJI4fnwODB92HgwCz4svdD6Ng+G5o3zobaNXOgQoVHUKb0Qyhiex90mjvo/Dug097C7XW0q2gIAgFBgACQ6HlMAWcQEL+Y0wBnAXIEHXhEdTSmAro3jwHQBDRKtqol4lo0xgZbOSNQuhwrh8VvRYmxQbxco0JIjK9LRrWkhETUOG7U18B0geH/HwBMzvfx8eV995+OniXOjlfHFS2Scada5XPQpN7j3BaNc4ztkfJ79XgE/fuh4799ASPR6WPHvYbJk57DtMlPYeqUpzB+3CN8PQeZ4CH07vUEAfAIwZONOiAHKlV6gikgG1PAXQSAyW4jCDANaK8iA1wGHZaHWvGSAgLhLG5PKwCgx1QWYCBgdlhlgT1qs4g5fRO+xmy9yfloP6KxMnG9zEBBaTqywkqjKC4zUiwbrWjIoamTfuw0OzqBeHu5oS5QQFBQpWIBOt/ALgDZs/eUbvykM95Et/VvlernQH10fKuGd+TP2jyA3l+g8/s+lEcMeQY/jHoKE8a9gCmTf4Xp01/BDLtnMH3aS3ztFYwY/gpB8gJ6dXsFHdo9gSaNs6AOpoCKFR9D8WKZWAXc5s630tzDkpClAdYkuoLbK2CF6UAnXeVagHUENbw0ZH0BVhIqYlBEBhCQAQQuBvermoCxABN82zgYKHe6qRJYo3YSV8lKv2Al2lIjFRYYiZDM+gfXvxm0tm9oWDQyoBctSBAUmPN9fNzJjztOaocOuhirEbZDzToX5bqNH+S2bP6UO79Xl0eY55/DsO+eoZN/hSmTXqPDf4WZDr+D48y/gaPjK7Cf8QYmjH/NAdC37zPo1uUZtPkkBxrWvwc1qmVC2TI5ULTIPQTAHbDS3kMQ3OOpQMcAoLmGmuCK6vwrKgMwAKg6gJWEwlEEws/oeFM1wGyfCoCdKgBMEb9ZBYCJDVgbOZ05X9EGZDEI2mSZCgtzJS4QIx5/3jlmdGBwGF4XBIHet0BAUADO1/NO2bY9P2kGDN4121Z3HBrV/02uU/uesUmjHLnrZ6/gy26P5G+/fg7fI+VPHP8r2E3/G9jbv0Hn/wZOjr+Dk9NvMNPxNb7+Gn4Y/RwGf/sUevV8DJ91egwtmqMArH0bKle6AyVLZHIBqNPeAWtdJm7vo9PvqkJQqQasNIwBrqgMoAhB1hkUCGMATAEkPwPss0gD280AoBwAGy0AsFrtFpoYYBmCIAVBlY7lYkauRJfia4Gve3aLnxgSMguvi6eZCf7PAcCEah8u+FzJ7r2npW8HH4mxtt4FVWvcMdarn2NsXP8JRv4b6NP9mfxNvxwYOfQZTJrwBmZM/xWd/xrtFTjMfA0z0ewdkA1mvIaJk1/BsGGPoR9+vlu3R/Bph8fQtMkDqFn9NpQvdweKFb0H1lZK9NtYPUBnZyo6gFcDKAQx+q3Q/pACGANQxgDHVAZAAFAGgEP/IAVsfA8DrOJ9AbaVxC2yIKxAYM2XdeKiXI2Qit+L/Fu3zsn2YeGzibe3B1UGrRj+rwFA+UGenp7kyOEzZPqUK7NspCNQvdrT3Op1bxobNbsrf9qeOf8FRv4DGIlKf+rk3zDPI/VPeQIODi/QnvOts9OvCARkhRlvYRwCZACKvz5I/x06ZGP0Z0O9OllQpfJdFH+3wdr6NgpABoIssNFlIxAecBZgIGAsoMX8b6X5EwAIJ5RK4E8AQMnufxkAlPUMhKUyEaOQDaJlgSxBJljGmODVkMFp4+bExBN3d9f/KAj+I8739w8gM2c60C1b9xBf/VVXW3Ef1Kr0OLdWzUxjoybZ8ietn8AXSPsDBtyG4cPuYs5HZ9szuv8VZtg/xYh/hk5/jtH/krPAjBm/w/gJv8PQYS+gX/9n0PWLJ9Cq1QNo1DAHox/r/3KZUEKNflvrTHT+A7C1ygZrLWOBLEUPYDmoQxZQGEBNAagBtNJZRQeIJ9WG0FFeCloCgCIABEwD1CINULMGMInANRZpII31BhQg0IUIggR8PA9Ty3zZWlpqtJbmISC8X0wYu2NUYmIC8fL0FP5TIPjw7V38Ic4ursLCBQkkJvZ0Xyqtel2t4l25Qa1MY9NGt+QOrV9B189fyf0GZsKQ7zNh7MRnYDftNYq838DF5Q04Ob+EGQ5PMOe/xNfewLTpL2DixN+Q+lkD6An07PUc2rZ9iM5/AHVq50DFCtlQvOh9Xvqx6LfB6LdG+rexeoiOf6gAgItBJQ1YiSYNcEFhAOmsuRmktIRVBiB/nwHIHwCQoQJgpcoAmPOFBQiARewxOnwRpoP5eIwY2VoXa9SIcXj8iPs+bivq+fl7YjrQ/0faxh+c9r28vMm8ufHkp11Xq1eqknLGtuwRqFH7nLFh7dty59a/Qq/Pn8n9+t6BwSMfwsjJb2GSnRHVPcv5LNpfouOfg53dExR+b8DZ+W9Y+7+AkSOfwcBvXqHzn0C7dpnQnAm/utlQvUoOlC75QIlwCaPfRgGAje4h2OoeIwPkYORnK2KQVQPSDTSsBlAMakTWGj6HDMCaQco9AUk4zm4RcwCwKuDvM0D+FJCfAZDqBWQBLv6WcBOFJbJAFyBAU42iFG0UaSBULeW4Li4qrXhAoIENVP3govCDD91yd3chFy8+sunZZc1yW+stcr1GKPoanJHbtcqWe332Rh7YJwuGDLkOY8Y/g4nTZbCzl2Gm/d+46Jth/xzsZzL6RwHoiM7HamD06Ffo/KfQs88L6Nz1CTRrdg8aNHgIVapkQrkyWSj8MjGKb6MTUfxZIxjMDJDNRSCLfitVCDL6t9Kcw8dI/awjSNWuILtDKGL0SwdBEA/yMtCSAf4IgK1q9Fvm/vR8VcAq9T0EAk3FbRLrDrK7hwiCBGSDKKOVNiyXkEnGrp/HhyclLiFubs4fXA980Dt7rq6uZOu2/cRDf2GaRtoNNatkynWrXzV+0vwOdP0sE3r3ugtDB2fBuNGPkPYx78/AiJ+BJZ7DW8z3WPM7ovhzxtzvgmIQq4ER37+Ggd++hF59nkOHzo+gZVvWOMLIr5kNJUvegSJF7vAbP7zM02CU656DBiNfq2NAQPGnZQ2hm+hwzP8igkC4iSC4hGmA3RQ6zzuBbIyAgBpAQBYgmAYIpgHKS8G/rwGIuQw0gSDDIg2stnjM2ABTAWE6IAbBEI3bWNzfXCwP44yiVSSmh+Dfx43b0jM2NpqNO6T/lQzAFH9sXAzZsi2ncckSy+9WrnRarl3jsrFpw5ty+zZ35Z7ds+T+/bNg5IhsrPUf8c6e48wXYG/3AqZjnrdH1T/TCUGBGmDStGfww7gX8O3gF/AlKv7OXR9Dq3Y50KhpNlSreR/KV8jkJV8RG8z9VvfVli9T/M/R+c9w+xR0ukeg1WaBBulfwvdFBIKIINAK2Uj9d0CSLmLE/4KvY+5nAKCX0MG30a4rYwTI30sBO9TScI/62ASGdarjV1logWVqCmBaYKHJeKOIkFSZCBHIAn5QprT/gfDwlSX1endi+IBa4MNFv4sLOXr8JBky6GBqSevDUKvm+dxGjc/LbVrdgq6dM6E/1u5DhubA+HFPYPq0p9z5zk7IAKj4mfK3s38C09CmIjBGjc6Bb797Ar2+fAyfYeR/0uYhNGCRXysTypS9jc5njZ67vNljrcvixrt/1kjxVnfxMXP+c3T8U3TwAxB0N4BanwNidRYE7WUQsBSkqAOocA0j/wrm5ksgCGzI2AmzBvjzFLCNg4CaBeEWVQegBqDodFbmCehcrPmJmILP56tOX2xhjBHmy4wVRO0co85qFoLABfp9tdx1+fIMZFJnPqDkQ4DggwDAw8OTJiXNJYuWnutZTLPhZa0KmcaqVU8ZW31yUe7Y4Ybcq9c9GDwoB0b98BjrfMzxmOtdMNKdnRAELqj2XV/BdIenMHHKIxgz4TEMGvoIvur3DLp0eYKK/xE0afIIatbKgQqVsqAoOl+51cuUfRav9W11OcgECAibK2hY5lmj0re5BZLVbXQ+s5tAuF0GiiCg2gtAJeb868DGDArSKbQDCJYtIEo/8iFiig44pI4LyM8Am9lNH1PrVzGaxmp+dDpGusScjzlfnIefQ+qn7H4AAwLTAon4uVj8zCy0cFnUxsiCNAurgljZSmu4FxS0qWHU7HBMBT70oweAaby+u5sr2X/wmKZju21bi+sOQb3qD43161+X27S9BJ99dgX69L0Lw4Y/grHjMcKnPsWoZwB4hXX/C1T7qP6dXsOEqU9g5A8PYdCQR9C7bw50QcH3ySc5KPgeQI0a2Uj7D6FEcUb5WO8jtVvzEi8Ht9lc9FlpHmGuf4qa4AHqARR3Vicx0k+ADQJGlHLQ0W/wu39DZniMDrmOKeIK7/1rtYdRNxzAVHEQxeRP6migw2r05zHAu53ATUq0C6tVEKxGNmG3g9cpYJBWIsMsxVSzEJjqF1AEirwcRBBQBIDEABAKRBPOB5oSEo6iMAFZIBxatAydHRoaysYQ0A9RFv7liPJw96Qp8+eRuMSTXwtktbF6xRvGalXPGRs0uia3a39d7t79OvTvfx9Gff8IJkxC+p/+DAHwknf4HGe+hqnTXvCKYNioHOg3MAt69s7hOb99+2cY+Y+hVo0HULlSNr/PX9Q2k9M+6/LZIM0zEFij4OOpQPMEmeA3FHvPwRbpv5j1MyiC7xXFqoCSa3x+ACEo9PhYwNMgkeMoBI8hMA7ycQBaPkLoMkhYGTARSPngD6YDDqgAMEX/NlUEqkZ34fcPoJN34L5Yh3CdBdUnKsIP1b9EUvBzSfiZRAQLVgPc2PuxMqERmA5QEJJk3E7Nmjo9ovGsWWGMBYSPlgEUZPoRFxcnFH6/6Dp8uv5HW6udcpWK13LrNjgu12twDjp3fgBffnkTvvk2E75H+p8wSbmnbzf9JcyY/gqmTn4GY8c8g6HDn0P/b55Aj1458NnnOdAKI78x0n6tWg+gYkV2ly8Lihd7wAWflTaTN3lMzrexQudr2TjAu2Brg8+1j6Co9hU67j5e3HP4+CeoUikDOrTbAn167YZObbdB7SoZULbYevW+/h6sDtgNobMcHJTbYfO4wHfHBOwwawBlVNBuZZAI3YLAWc2HhBEyC8qVmgON66dAry4boHfnDdC8YRKULOaN1Yorvu+JFopskaKmBfwOjWSGLBBjpNQbr8GciNTUJUxY0486BbDcv2BhMlmw+PoXGmnF64oVfjFWqnbIWKfRIWja4rLcuct9DoAB39yF4aj+R495BOPG5sDEcY9hPD7+fkQWfDf4IW/v9uj5CDp2zOYt3nr1M6Fm9Sx0/n0oyUf63uFdPuXW7n2wtcrh7V4GBmsda/7cBhvWBLK5ixrhOndW5ao7YMLkc5C+5g38fPwFHD+dA0dPZMLuPTdh85YsmJ/yECaMPwONGmLU0lWc4q11F9ARp7gGUAaFsp6AZQowMQCqfroBBSWKQWElb/PqtBFY5q6E5KTTsG/fYzh5MgtOnsiBY8cfwN6DtyBt9S8QGLYTuveOB52VO34nBEGXpDLELJmI/lgRBBkFOlsWqd316DlrawYGKjOb/8o08JftiKlUZ4z+deu3kG8G7FvO1HCFCqffVq3xs1yv4QW5+SdXUMFfRsdeRQffhsFDsmAYgmDEiAcwYvhDGDI4G74ZkAm9v3wAnb94BO0/zYbmLTKhfoMsqFbtPlSqkAWlSt6HIrYo7pjzMfdrNfe58GNgsNKwaH8Ktvi+TncLwZADRazYFLDVMHHaSTh04g3kvAK49eAxnLl4BS5cPgenzhyBn48dgL37DsKWbUdh/dYLkLToAgrPvVCyRCrP7SwFKFPK9qNGOKCmgt2q401pADWAuBm0Viz/u0L7dnGwJuMGZGfnwtNnv8GFK9fg7KVzcP7SL3D85AHYdWAzbNy2Hjb+uBdWr/0FDIbd0LJ5IH53IthIs/EY0ZgOkBWkCFkQY4yC4ALtOzjNjIqK/stZ4C+jfzbHPijYlyxPO92wdNEfH5WyuSCXKn3AWKnCDahXOwuatzoDbTseRzF3Efr0u4UUfx8GDsqEbwZlQ/8B2fBln2zo2fMhdELKb9EmG5q0yII6DTKhRs0sXueXKoWK3zaLR7lGk4mKPgsFG2vtovizugwa8T7m+d8x6m+CtS2CgyJLCBkwO+IyPHoO8PDlK7h1/z7cu5cNmfcews1rV+HyhRNw/OeD8NOBI7B9G3PGWkjLWAWLV+wGT/efoVqlNNCy/C/eQIGGql/arY4N3KF2/kz3AzaClXSQC7gvuyfD5XMv4fdXr+BR5gM81gO4eScTLly9CRcvXkMmOA0HDu6DPXu3w+bNG2Dd2i2wctl2WJiyDbp2tEfA2mEKicB9zUGNME8WpZhcQXCVy5aZcjAyYrGNf4CeKC3ij4wBPD29aXxCLPHwOjiZNTvKFT9tLFV6t1yx/GW5Vs1b0KjpGWjZ+heM7IvQtfsNpL7b0AOtZ5970K1nJrLDffi04z3M9/egfuP7UKvuPahU9TaUK38bnX8Pc34WFLFhNM8cfw+V+n0EwhNkAASADut9HvWPeVVgY3uF1+Kzwi5hBAJcu/cY7j25DY9eZkNOznO4c+sh3L5xB86cPA4njx6DE0fPwv59R2Hjlo2wevNySFyyAOKT94Gv9wUoW2oxd7KgNY0EOmgu/ZQW8DZMGdt4bd/583S4eQPB9uAlPMt+Dm+evIXnj3MhK+cR3Mi8BpcvX4czp8/DsWNH4OixQ3Dw0F7YtGkLpC1dD0nzVkFq4h7o2H4WZxEsA5EJWDoIMmo1mA7Idy/dnNO6R0SEsxnRf1ka+Ivo35+4OKP427pd7N5lWwYlW+SiNntzS5XZKZcvdxop/CLUqXsWGjU+Cy1aXYR27a9Ch0+vQ7sOVxEQN6FN25vQosVNaNL4OjRoeAfq1MuEKtXvQtnytzDn30Jav8Udy6JfJ2XxW7karOc1WOZpEQBa3Q20i6jcr0MJm2cYQbthzMRjcCcL4DI6O+vlXXj62014/ftTePnqd3iUjWxw/R48wAi9ef0W7N5xCBLjF0Pk7EiISQqGpevmIQgWwtykzfDDhLUgauMwGn/kN4cUEaiKP2Et2lbe7atSZR4cOQpwN+sl3M+6Ab++/A3evgD4FQH4+PlTuJdzGa5dv4kAuQMnTh6DJUsXQGxcFMTERkNa2mpYvmwdnkM6hEf8CFUqu+FxDJhyUAiKoTKlQQiAmdCxrT5o4YIlbJ0C85SzjwIAjJICAvVk/sKj1csU3ZitIUeRlrcaGQDKljsOlav8grX7Bahb9zI0anIZa9vrCITr0KzFFWjW/Boq/OtQr951qFXzGoLlFlSsdAdKlbkBtkWuoGOv8FG8yrBudpcvkw/plrTX0CFPsKbPAlFzC3Q2pxEkl7D8uwPVq++FPUdeweXb9+Hq/Yvw6M01ePH7Pfjd+AZ+fYMRmfkU3rz+DbZs2gAD+g9AUVkGU0cpsLaxASsbLdRsUBG+nzwEohOiISR6BbT6NIXX8xp6AiTpSF7LV2D1PYo/IRWCwo7Crczf4eqt63D3/iV48fQ5vEXN8etLgEdPn0DOs3tw53YmODm6oZitgCxlDYIo4P5EBHkJFMdfQmRkFMTOWwBjxqTgb7ZHQekDghRiJCQYzVsuV9r+2Ny4dFtPT1fzcjcFDgDe+XP3oInJccTH7+epAtn6ViseN1rbbJdti+2A4iUPQPnyRzGfXkQlfw1q174EteswRlCMPa9Z8wpUq3IV6/trWOJdh2LFr2PUXwGN9iJG80U+fk8r3eJ3+DQi0r8Wc76OTezIAQGFoKhDcFifxu+c5esATJ1+Dy7ffQOnL56DG/euQNaj2/D0xUN49eY15Dx8Bi9fvIbFGOE2Nlb4eaKagEYtnhNo0+ETiIhJhCkOGSgyF4FG+AmdvRsdo1YBXPEvgJq10uHIL7fh9KVLcBVzwIMHmfD82WN4/eolPHr0GJ49fwGXLl+FLp27mfdNBfLOsZiVKFkcHF0nwazZa/C6sMoAQUD9ZUqisBoIx8cTXgwdqu88e3Y4n3380TCAFyrT+MREMvDbXZGsGaKRfn6rkXYatbrdcpGiezCHH4aKZc6jgy9DlaoXuFWtdgGqVWePL0IlfL18uStQtvRVKMGdfw2V/lXg07pZM4bdr+eDOG/gYzaxA+kewSEhIwjaO7y9a1PsJjLCMShutQOWrXgFP5++BOcvXIWrV2+j8HvIHZ95/yG8ZpG/dRMylI5fdBEjUHEAc76EgNOhk61w39b89baffgb6wBVQt8YSfnOH9fyppPQBRIkJwXCYMv0EnLp4Ak6cOgJXr9yFe3ey4X7mLch5cg0e5FyDRzlPoYKnwNsAACAASURBVHv3/nx/Op01j3pK8ZhUdT5lgBD446LFNeDpFQKDBsXi8+nIElwQYioIRxYYC98OSvWaNWs28fby/Et0wF8CAG8vd7Lxx5+L1qq9cj9eIFmgO/Fk9xhF8RDorLejej8EJYqcwDLuFJQpc5pb2bKnoVy5M/xxqVLnUOSdx8+dB2ukcTZmX6O5wqdvsd48m83LJnQqzy8jG1xAEJxXbuJorgHBFCFKt3n016uzDnbufQQHjhyD06cuwPmz1+Hq5fuYe7PgOub7e/fuogZpozhDBYHZESwyEQAitUWwFcPj2uJzESZO9oEuHRei8xfhaz8qZR9WAAJlj4MhJv48nDp9FI7+fATOnbkGVy7fgqvXL8D127/As5f3ICQ4ku/bxqYY7k/A3yDxbX7GEVQQtGvbERwck/H5ZASGMn6QiPpcQqbJlSr6bktOTtPo9V4FnwJM3T+9jyuZE7ennlab+lJkN0aETQiAY0hdx9ExmzFvH8Dc/BPY2qAVPQZFih1FpB9DO4rPj2LZdgKdzsbg/cLvwlHhAm7P8xm83OnocEE8h9vzfMuGb2s054Bqz6HzL/ObOhrtE7x4J6Bfvz2w7/ANOHTkCBw/+jOcOnEazp2+COfOnoe7d2/C+g2r+UXWaGxw/0XwsfYdJ4giYwQR2USHukN5r9NnfeDrPokgkQQ8x43KLV6BDQvbhSkuBuJTj8Cxn87CkQPH4cSJX+D0mZNw4RIe9+JpuH7jGrRs0RodTnHfgupoiR+DEg3fMuYxbTV4PiWLl4Ax4/SoFXzUzmCMTDSORiI4yFqt16PFi3dWMfCFqz6CFODtraeRkf4kMPh0F0lck8smQWi0P8pEnVMnoEoW6X4UUPuQxveDpDuC+fswaKyOKIbPJc0xfuuVOVBpvbL78WeR/s/id87zoVrssSSe51O6lcGbZ1D8/YIAOI8AYADJ4d/9ZtAG2LLzAOzZsw2OHt6Bdf5+OHn8KJzA0uv27cvgo3fhTpAkjEZSHB9bvxOJlL2HjhIYQ0iUU3W1qg1g+JD5CIBo/B4CQFiDx1NawlWrJ0Pa2hNwYPdZOLTnJB4Ty8oTyAZHD2PdfxEOH/kZma6CCi6qsgzunzLna1QAalUQ6MCKluCfGTxkKopmb55iKLtbqHFCELjidw1vnJ2TGvv6eppHXRUYAFj3z8XFTVi9ejGxtz+pZwMftLqtuZRuQfrfIbPbpSxK2IRKke6zmFF7SG2osJssR/kkDJEiA/D5+aeVadpsvr5whg/PkoRz6gxezPt86BY+Z4M2peNAEAhEi+CQGABOQJ8+6bB+8x7Ytm0d7N+zFg7t24aReQAOHzgIF8+fgUkTRysAEFGFU+s/0LBJD1A0QX1eqmR1+LZ/Mp4jloMi0r+wHgHwExeCpcvGQWzqHti6dT9s23wA9u84Bj/tOYrH2w+nfjkCGzevgdLlyuVLNVQVnRrV8XlbgShpqV//CVCr1gx8zFgA0wD1kQWNFwaWo3HUqOQpqQuSiLu7By1wBnBzc6OLFi0ifftuXEDIClmj2fKWTYykPD9u5xeJzasX+H10ZTo1VQGg3GX7WQEBVUCgrNVzki/WINBTfPUOZdImGmXDthAIlM3jZ3fukAEkVP4IFo32Nt9n+zZrYe2G07Bxy3rYtmUT7PxxJ+zFOn/v9p/g5LHT4O6qMoBKx390jFZlBR2elyIQq1VrBR3bxbFlYPCYW9h6AGj7+chgQRMB+pCdsGHzVlizZi38uGk77Nq6G4+3Aw7u3wXr1q+GipUrqZFP3wFZHhDou0BEhujdZzqUK2sPbHQQu1lEBHejoPNChrWDgQNT5yxavMI8h6AANQBb1MGDzItPIt2+2LqMq2RhzVtK2QCJH9V++Q4zCJQmyiF8T2EBvhYPv9OmMgGbjMmHYh9Tl2s5qS7gdFphApYWyDnekJGEo1wnEEwLhL0nneJlWtmSGZCYfBnS0tNhTfpGWJexDTat2wub1+9FMByEeXGJqjNUx7/jfBZ9tqpZcUHI3mvVZgC0abEMz3ElHnMT/kZ1FBBdy3P09JmHIH3jGliVsQg2bMiArZs24rF+hO1oO3dsh8ZNG3Hnv0/4vWPsXLA8LF68HPTu7Yu/0YGLTPQSAn2mLGjdEQCOcrcv5qXEx6fyKXbKdLICAwDTAF5k1qwY0qL50jUMAIK4EVPAJlkQTOPlt6s3TXapDZT96oIL+9V0YEoJbNCFMhWbzchlU7MpOcbTgwKEUworoD4Q+codR5R7+lQBgKg5iFG9C0XUNphhfwaWpG+AJUvTYMWKdFi9ei2sydgEq1dsRFbYC00aNVGEoFbI53wblQGoCgxMA6jY+w/2hcpll6jrAGzDYys3gCgf4h0H7dtnwKKV6ZC6LB7SVi2E1RlpsB7ZYNXy1bANGcjJ1VEVf1o14t/jePa+JPDHrdr2gk4dWfnnxu8SEuqJGsAO2cYVAeAMrVqEpkdGziU+3p7/diXwFwz99sEqIIDUq5O6Vhn1uu6tMiZuo7lXrrCAygR8iZW9qu036wIlLRxSRt/wRZoOqzNyjvK0IFETG6Bh/qUiG6t/BaPxPG4xbWh2IAvsQoY4Cp067Yf4RbsgKXU+LFiaBItXJMDS5SmwdOlyWLfmRwj0DYXiRWxRQ5hKL+YYpSJgDRrBmpniqNYdu0GvfvF4LikoAve/MxOYCsrAziI2ieAXthziFy6B1CWpsHTZQliZthKWLERbvAqWpi2FZi2bqkJQxysNxkCixACmAMBUAhYrVRJGjQmFsqU9eeQLAtK/5I4AcEAN4PaWjRWsUd1ju14fJvgavAsWAOzetL+/gSTFr7AuViT8oDohIlcBwAb1YlmAgCIAhN243c2BoNheZZgVVZZdYUBg07AIPZQ3Fo+BgKeGE+qkTWQNkQHkEn7uNIIBmUPcjpXBIQTAKazvV8Bk+00Qm5AGMYlYpi0MhcSFYTA/NRFSkpbAsoUZ4OHkBiWKFlWj0JqbKKEQ0xDFEAhN2nwCdi5JUKZCmDKzhw/22KaCO4PP8hFpBh/h0+nzcIhL2gNRMQsgBYGXOn8BJCcsgQXJafg8BRKS5sInLdvl1fwiK0UFDgRTE6iIbRkYOdYDOnfBqCeO+F4I/q5ABIAHmhuen0cuRQYoUXTqKXf3oOLs2v+7dwb/rS+zqd6BgX5k7Yp9ZQTie5ZQ5vgMowKEDWqkbFGHS6nDp+lOJSXQ3cqKW/yW6j7V9nIgMI3AAcG2XCyqrMCnaR1V1u0R2OqdZ3jpSIR9GP37OFA00kl+3MpVMSp998DsuAyYNTcS5qWGQeTsYIibkwAxs5NhQdJC8Pf2gs6dPofiRcspKQCdIRURoFrDqtBrwFBwdlsGzZpH86FckrSO32GUeGpbq87zW6asEUiXg1ajh/HjfoTYudthVnQ8zJ2bAInzFkNMVArEzZ2Hr0dz/TF82CioXr2qogkEJfJLlqgEbVt3B6eZUfDd0Hmg003H133wfX/8beh8ESsBfCwI3kaNNBPPYczd9IydVdm19+ErkxYgAwThSdhNcy8pkUAEgIkB1qkA2GixbMo2i/FzprH0OxVWUNOCsv5OHhjyUoRpQKYiGgll+f9nNOZsBggWmRj99AJYWTN9sIs7qXXTNAgNPg6B4fHgF+oFEVGBEBkRDVFhcTArNALND6Iig8BX7w/Tp82EH8aNgrHThsNUJwdw9VwJbVsl8+gWxL2gtWbKfzX/XQJJR1uK52Oa+rUUy9YVYGvlD5MnL4A5cakQERGB+46D2REJEBoaDqFhQeDvHwJzoueCv58B7O2nYUk6Hm0qTJ7oAr5esTBmRDCywBTcnzfuO5jfFiZaJ4x+VgnMxt/nJ2u10/C9UZnpq3fXCApiy+oZhAIFQCCehIujf1mBBF5WAGBigPX5QLDVwrZZaIOdKhPssZhcsce8NJtiB9QKIk8wmvoIyuPtXC+wKoHQLUibezFf/8Kd07D+fHBwXgP+YYngHxoGBv8AwLwJwYG+4GdwAIPvdHBzmwnOru7g5O4LDu7BMH5aHLRszUbmzMZ9/qiuD4jOpiv4eH/Knb5EnfSxEp8jA4g7EISxCIRRMGRIGLLPQgjyT8HjzAVfvyAICDLgsTzBy8cZ/ILcwc0TQebhBi54PAeHWOj/lS+UKDIUWI6nTPghACStN6YjFJAiVgEkEvfva5S0dvj+mKyVq/bUMA0RK3AGWLV8f0VCgm4ojk83KmJwjTozxgSEDWoPfWs+bbD9HUZQegYHuC4QuB1Qbb/62gG1gthnUU3sM1cXeamE6YZD3EElyqbAF1+uRF2wGtz1qaAPjEYH+ODFdwJ3L2dwcPKASdOCYPT4ZOjxZSpUqDpbGZ5NF6tOXp9veteqvPH/fKrXCg4KgYMiBmx0YdCyWTyM/n4FuLsvA7/AeHD3NiCrOIOThz3Yu9mBvbsLTHMOhCE/RELdBu54vqxSMLC7f7z2pygAKdUjmH0Y9aN54WMPWWR6gEx6kp6+q/ZHwwBpS3eVE0jIZXUalFHZrlXNBAJTZbDFIi1s/2NKMPcL9qlj8JU1+ixfMzmaWoBAMdNr+7jYFKTtKJz2IhD2cUAWt02HRvVXQp8+S2HIsFgYMjQahny7GPr2XogCLR4qV4rBix7Jc74grEXqN60GZnJ8er5FH9LMM38lcRkeZ5Ey75/O4QM6CJkKtWu6QZfOATBk0BwYNTQZRg5Lhv79o6B9Bx+oU88FtLoJXPBJprGAJAC3eg4GgRkCQKReuG8P/D3uRkn0wPcnP1y1enfNwKCPgAECkIacHA2ltFLYeXVmTK5ygVZbrJ1nAoIpJWzKlxa2WbCB0jRSgPA+2/vO++QPttu8VSqLg+jMQ1wjKCBL5zNyNGIC2FjNB1uNabLmQt7okVDIStSSpbZaOH+VhfOXq/P8lqtj/udyvUBJsmKUTfiM4g5luVyg7mAjYo4XI8BKCMLXWCS7YyUQBpJmFtb4+HkpWu38GZQRQYwBePR7IhA8sHx0NwqiK1iJ029u2Li/YoGnAKUKMBA7O4/i1rrQ0+oESGPedGgTba7JSwl0owqCjRZVwlaLyRWWbPDnRnljaZdyr8HClIbTTi4aWe9A6T2wYV3pSKHL8IIiGOl2dZIHE5bbuIhk4/qUZeDXYjRuwohbwx0s0HzTvKkp8peqtoTP/RM0CXyWL58Kxub+i4tx3wtBK7CBJPPxcRxbDwiPMQefx2FUx6BjZymdPhFBQlH1a5TIJ5wB9MqIIBb93PmsDHTNFUQXsNVOv7J+4/5yAYF86dmC7QMEBPgSR0fvIkWLhB1X6TDXlBfzgGCizjUWCyhYagMTGDZZdA//ke2w2Fra9nfH67PjMCeiSqcaPBchgwtF0yQOZUz/Jj6uXwFrGoIhTe3yLVAncq7IW+Thndm9i5X36QLcd4oy55+tAsLfS+UAIMgGAk3B/c3DbSh+Nljp7RPm/DA8LwYAdDo6lkhO6HQ9gkTJ/4Ip+gXUCIIrAtjZSOhM0GnGXd609Uh5du31+gIsA1kXys/PQNzcfKUypSP38YigS98qkbEM3g+ENRa29j1CcfMfp1u9Y3/vvR8tUsoGtUzbaDF9W53SxZzN1upjQ7rY/D0+h29tvgUeVuP3TZM9l1rYYtXBC1RLVWf0pKiPU7jTlWlgcQorYDWhzPZBgUcDVQBEcGXPbvdyULCaX2RONyD7sNyvx60Xp36KtE8EZ9w65bJRQmVL2x2dl7DE1s9PX7C3g/V8cUM90lAQqVIlejOPBmFJrhIhyyxy5Io8INB0i9TwPqFoWSlsyVc+/jO2JV+VscuiStinPt+iHnOthTjdkE+jmGyd4nheESxRtybHmxyeks/x8eoMnyjF8QJzcrjqcJPjZ1mY8pwiI1Dqy4WfOfcz8adEP2oEJwyuKVCzusseL88AyaC0gmmB3wvw8wsjtWrPW88jQVisAIAuUalyqQqC5RYAWKXW1RmKmUvGdfkcsPl/aSYQmVby3GSxgNMGvqIXy/0s54v4GjMBwSDwGl+xPJCutHD8ImWVL0vH86neSfjdeDS28hcTf8z50Urkc4tWARGrPmZgCMLj+Cl0T/xxG4iGrzEGEE25XxF/TPhh9AOVHPHaToZaNZ134jUX2X8gFigDKP/C6U0CAsJJ3Xpz17ILQumi3LzZsCYALLNICSstRFW6RbVgIRTN0fg+2/iex5bCckPe6hxUrdnpKgtaz+DOpvg5EY8n4esSfkZkFQCylEDYbV8TeBdb5Ho13yuLOVhEfDJf7oU5XmSzeVSjaIRbjFohxKnPI3mXj5V6lKJzqRtuUeBhVSASpHzqw2t+Fv0idz7L/y5ojvh4Zi6bPtawgesGf/9waijom0Hs4D4+PiQ4OIw0ajgnXYmE1FzlIi3CH7nYwpbmSwv59cEqeLd8/Ee2Nl8KWWdB65YLNluu0ZNhATrlMeWdvHS1kcMep+F2Oe/uUTMYFubL/ZZ5H0GPABC4c5VIp+boZ7Q+S3V6BFo4fi6M3+IVeKvXz6z6TWWfSD0REO7cRMENP8cGsGD+JwgAyhhgHDRuaLc+JJgtL1vgdwMVBggNDSdNGs1ZxfIf5QBQFLCgRo5gZgJLRlhuAYAVFt21dAvnrcm34FKGhfPWWTDG2vfYGosSNCPf2n2rzbW9oAKPbfmAD1YFqDW+YCH6KO8TLFBtPr89TEmyutpXAp/GRdXIVyxKzffhFttQ3uZVGID1AvzVmh/LPlbzs+hXWYHlfhMAqID0T51kQWAicCw0qD9lAwMAu/aKDivwASHRpHWrhOWsCybQ+bkmRUzVhZCoOR2YqHSphTZIew8brLaI1NV/cNq74HgfO2TkW64t/T1LtylGVeBR3s5NUyNfASs1n/PC90R+kmqJagNIyfuK82erADCJvjDVQs3OF3iDyFeNflX0US8FAMSdpwWBskGgzsz5+JmZbIvXdjS0aeWaFhkZg9e+gAeEKKOCvWhU1BzStnXCUpbnRCE5l10YFiECj5ZU3C40g0GpmxebF0t8VyRaVAtmW5Vvvb1/BJJ0i+3KfOv0rbQ4hmICd/xynvsVW8KZi3LmWqTW8qnmiFcsUbUE1flzeQqgHACzeQdQoX6F9pnzqep8LvTQ+QL1Uxs+XsoiEdRTyftY8wuq80XM/QKLfj42wAEZgGmAUfBZR/3imDkJ/J9WCnxeAGOA6NkxpF3bxCUsAgSamKuUQYn8ohFOl/Pz1c2mBsuifECwZAVLdkizeG25hZj8e7bC4vPL830/z0yCj3JbzIFK1YinZsGXaGEJapk3T7W5XN1TotxAotyUnE9U5yt1f4ja5/dX1b+fcrMHo56LQV7uMeej03nUK5FPeOQ74HdmGEXR4S0DwKftPVQAeBZsFaBMC/egc+PiyWefzV/IxY4QrwIgPt+FS35HOBEzKBblVQx0cb6my5/Zsr8DkjSLPv2ffXfJezp6JoZKzXeephU9LR1vavDEqip/jrmmpyrts8inZtoP4WWfQvl5fX7W6RN5nx8jX3JXyj10vKA6nhAHdX7gDPyOnaxUAaOg82f65LjYpIJnAP4Hjx7uJDExhXT7Ysl8hnZBmJurRMVclSITOF0qFzBJAQI1befzNio37oBFCgjoEouthZlBssTCwcveYxZ9epO9s5/F5m2eTlHSlSLwFHFHzY0dy2g3Od+k+ueouT/yHbWfF/nBavQHmp2vtHkx8gWF9qmgOF+QnBXKZzmfKs4nhDsfn9vJouSA13YE9OoRMjcpaSHx8HQnBTosXFkXyJ0mJ6eSXj2XJbIfSmlsbl50zFNzpAIEwtbIYxfUvDWBIFUFwUILEJi2+W2R6ki1O8e3lmbp7MXvN9MxON0vUHN8ar6ot6R8k+PjLCJeBQA1lXwRauQr1G9S+8o1MTGAXp3ogaKPlXvKHT7e6hUl3unjABA47c9UAcCdjzZdFsUZRkKGQd8vIyJTkhfjtXcraA3gpwIghfTssSSBIV4QGADmqHkxznyblJhBYHqcLzXQ+Rb6YIGF8l5oYan5tMPid6P8ndcW59uXpS3Ip+xN9XyewFOYy0T7+Sk/2qLTZ6L+cNXxiuAj6qgexfFB6m1hbzXnM8WvtnlFFHyiiwIA1u2jzPlI+2r0KwBgLDBdFjgDDIfePUPDklUAFOi8AEY/bu6uwpLFS8jA/unRfKUrDoBomXBVHINojlVVsqKWqfqcsQNV2UHgF5s1kUy0a9lbz99rN732ZyBZYAGW/N/Pv99kflyqOluxeaqZzjVO3caqTR4T9UdZ9PLDzcO4lMg3OdzvnbwvUja4A51P1NzPAEAV1S+i6meLQbFoJ3SasuUAmMHBgKDAFOCMDDASvvlqln7RwjR27Qt2ZpCfH58aJi5bvoR8Nyg9jCFdFGIQALNlVhIJ6gUT1Asp8D55rPp6HO+dM2CIKghENhJH1QlKNFqWXqbnSepjU75OzWfz32nUvN+SzM4XVGYSuLF+PgPru+cq8N9g+i3Rao0/yyLvh/HOnlLjB/K+fl6Xz6ACwNcMAOZ8SVBG+VCiOF/k6h/FHwfAdIX2WfQzALAqgM5EALgamQj8YehshxVpacTV1YX6FWQKUJeEF1asSCPDhmYEMbRLYjQCIMpIeDPEVBtbdslMURSjRtc8DgSFCUz0a8rBSe8x0+sp/yDCky3SzJ/twxT18ep5zFXPKSbfOUdb2Gyz0n+3wxekCj2l1FMAoLR4mfMFauCNHkmNfM4AvOXrqpR+AhOAjpzuFdq3VyPfgfcBCGGdQDfWCpa7dZlmnxAfSzw9vATfgp4c6uXlLcbGRpJOnQJ92Y8WaDjWqhFsWRMeLYrN+cNjqkYVizaRRx27kxbPo5CoTZa8hkviO80XZZtksc1vlp9NeO8+TMcQVLrPi3pTxJtsttmU32Sq8U25XinzBO74AIs7fL4W5R67x69XRvZQpcUrsRE+guJ4EXO/KM5Ulb8CAEUAOigdQMKaQc6yJHpgYI2QR4+InJaRvpq4uLgIpr+lL7BGEBuVGhqqJ82a23kg4mVK/XMpDZMVRRxtbosqzZFZ6jZKbZrMVnVCDM+xpggkqkbI287L99xCVP6pxb/n+/n3oziemul9jkVDZ7bF+UaamztKfW8p8ixrfN+84VxsiBc3b/PdPSXanXmuF0VnfoePOxmjXRAUo5ZG7dVeAKsIHGVkCryu30OPrtNHJcTP/UsWjfy3GcDHRy+EhfmRjp3cJ/KJDMTLKAjBslIDR5lFkvI8zOLmiGlQhGk0bLQ5NeQp7vwWY/H+PwJJXL7Pv39fphYu72KaVX2kBb2Hmzt6VK3r827mBKGTAtWbOj5c5SvmxY0KXnzwJ+v0EcoWfXLiTmd1vkL3SpNHlOxB0swErc4RbIq4gC2aja0zWNu4gk6HDCFxdsBrymzM7190HdslKMjwlywb++8DAE8iOFhP+g8I6UEIG7PmgSwQyAAgE3PkKDlSuXChaocsQo2oWSq9Rpu37zZZ8pvp9dh/6Ny/vx/FlGOajh9lUceHq+dqMtNdPEXoEZXymfPZKB7KSzzFWG9fudfvwad2mcf0YYknIM0LggMygGIajQM62gmKFHWF4iXcoXRZDyhV1h1KlkEr7QHFSrghGJxknW6mLIgsPYx5MXaMobE6J6Dgl4jRG3xJUJA3mTgppTURnH4j+EMJW9pMHQJFTSUSDVBBEKKWTHlsIPCoi+JbDgA6Rx1HpzZaqIXTaPR7wDDnTxwenfecWpi5gWNyepR6/EgLtlJonpoNHc8HdJoiXhV6zPlM4AlKxFN+R08RepQ73k0Z0ye68BwvsJpeRLpHZ2ow6q1tnbiTy5TzgQqVfKFCZS8oX8kdylX0gHIVPKFseU8OhiLFHGWNboYsSOOe2M8Ir8tGBH8U6wQqI4O9iYvr8qaSduZLIrjLCAAjpYwBwlQqDeHiSLlowebcqTRNWAkVoeZbU1Ml6p02qzK2jg+vkvlyKfy1WNzGoN6IY40no6n3gK/JZgags99x9rsNHGUrqMdlkc/X4lMHbJii3ZznKUtrQTLr6gn4GKMfU51/LqEGPLYBFTozH3SQh8waO8ooHmW0j6CO6OF9fWEGOt+BA0Bn7QDFirlAmTKeUKmyAarX8IfadfyhVl0/qFnHF2rU9oUq1fUIBk+5RClno87aDlPC2AcGQ0JNf38+HKzgNQAblOjn50XCwtfWsraalikJgezC4UXQy0peVKJdYLmQ5UUSqFqwOboEMxjCeQ0t8TFysyx67kjBYojM58uJUWhzjVREBa9J5PuWxDlYXsXIGmGuLEnxrB0tK1og8k8swrwVVBAymhfM0R6kWiAv6UTUNKLAmlzsWOGyjk3koEHK7B3BG3Ra/L1CBBoqfc000FpNRKBM47+ZDfOSmNIXpnOFLwgz8fNOYGPlBCVLukGlip5Qo5oX1KtjgMYNA6B5kwho2TICmrUKgvpN/aB2gwAEQYCxTDlv2dbaHr838kZCwqpKbDjYR7JQJJui7ElWZ+wvYmM9+rhA3GVRDDOKopdRmf0SrA6BckfzVEulAPMgSIHfIw/mF593EvF1DX8/RHUSRqsYzf5Ni/XUZUkINSrCy/mt1tbz59JlXbZQOuUmxX1rhNlGUZhrFCWs6dl3zM4Nz2dhQMzskwdCQb1fL3DHB6iDNX1l5VZtEG6DjFY6lven4L6H3iheym47pRNusXF61lYITo0nRilStXYyi3KZdfg0bPYPRr8k2PEUoNE4QxFbNyiJ+b58OQ+oVtUL6tfzhU+ah0CHtrP4WkQdO86Bdh0joHnbYKjbOAiq1wqRK1b2NxazdZCL2448lJKcZsMG434kS8WySsCLzJuXTNq1DZjNhi2L1Neo0WBJKLBVrQJ4JImENT68+X1w3i8w1815bMDAImIkSvy5qY3K6BdLNTqXRZ6R1c94jLu9v0yZZD8zoqSTs0Hzww+GBrVrei9jVUgRmxgEAFtVk32XpSGTgTFxiQAADiNJREFU5gh9J7ebtnkdvLzBGqZ79ryhw0Sd4IS/xceo0frg/sa/rVlvYvT4yYa60+zcbaZODa79ecewQEGY8EpnZS9b6dyNkuAmS2xMH3UBCRW/RB0Vk1Dl27pDmdI+GPl6qFHdFxrUD4BWLcOgc6c50LN7IvTungy9esZDl27R0O6zWdCgWahcAwFQrWqgsbitHdSvYz/X09OH/6PoR7FSqPIvYR5CfHw8sZ+ROoSQQW+tdZ7IAh5GwrtdvnySo8TFkZe5QcK7YxwIpiHRSmklYYRKjI7ZujhstgxbGIHGYM6Nxehmy6b/8HjI4KjuySnLCJsbx4ZGh4eHkICAucWqVJmWyBotWg3Pz/K7tbqloMt7Lqh0r5yDv3pOeeeIAGCLMxk1Vt64vwm5tepPC06av04KDvYjbIUOdg6p85eSJs2/n0bI4LeS6GgUid5oJfgiCGai0+0U1Y9pwMraBZW+BzrfF2rW9IcmTcKgbdto6NQpGnr2mAdf9UmGr/skQd++86B7z2ho32kWNG0ZCVUxBVSv5ospbvjvI4clT4qPT+LjMD6iP4zwJX7+3iQ4KLVCUdvvblA6TtZo3I1U8MbI8eQUyka7cgBQtTtGldmvpgtNVWXNcrLIb6Gi80U7pH4fpM/ZGFVRucwBA/vHT122nHXBZgpMfyjjEvX42I0kxK/T1qnjv5gi7UpiMH4+AIGI+xKYeAtUFbypZauYoOZ5k+MFtW2L5yWzwZqC4GuUdEG5gmayXLu+3Tz/wFmiv5+e/4GTwn566uXljkI4gLRo6RghipOR8vW5GuqDQEDVLkySKYo+SXLl9X0pFHw1agZCw0ah0LpNFHz+eRz06InO75sIX/dLhIH9EnA7VwFAxyho1iJKrlLFYKxS2UW2sRp62cM9tUFMTBT/T+aPZq1gpgPc3d3IsmVrSJvWU2IpGYxCxw2rAS+ZTWggvJHhrtwJE734pEdl8oPBfH+cENPEyCC1vnZB57NOmAfmfbZkuhPUqeWRGhe7XPT29jD/p67pIrAVS1lt7OGeXMbGyvEgG3MnCn6oF/zQCehowXRzxpRalK3A6V51vKl1y6Ked/GQyRAArMa3LjJms19waomQ0CDipa7UbTo2Xy4/wI8GBydalS01cYdImAB0NAoEAUwmgSg5yFbWblC8pCuWeN5Qr34ItGwVCR0w13frjs7vlwTffjMfLRm++ToB+iMD9Og+B9p2mCU3bRYp16sXLJcpNREqVx6WHBGRIiLgyEf1fwHK2EAfGhYWTHwNyS0J+TJHK7kYMeKNVJohU800DgA+6YFNduA3RLz5SFilceJjnhOvsAEbJs26Zx54AVFYadjds/Hn/PzWVAkKNPxhXRwLEAhBQT5k4ICAdoIw4z6jb0r1KEj9kYn8mCkgoO/epTMNzVacrtbx7NhovIlDJlwdOjSgcUCAj3mZdtMx847tIzAATpwY046SQdlacaqMADASOkPWoOIvUhxr/fIeUKWGHho3RepvNxu6fjEXnY9O/zYVhgxJhe8GJ8NAdH7f3rHQ9fMoaNEiBBo3Cc+tXVsva7UDn/f9yrFvSEgQnxD6Uf1jSN6qoa5k+fIM+mkH30VsCpMk6t9SDV4I7STuTDb8WZDc+UgYDgLeMFEHSHAwWM6WMaDzA1H0+eF2xJv+A+aNSkpZTjw93P7kH7WVhau9vb2E6DnzSIcOgTOZKJRQD+D+jQJbZoXqzY0bIhiUdMSHaPko4OSdPNbJdEewuKOYZKLvh5c9u/kMjo1JxMj3eu+fN3Im4iDwpHNiksknre3DCfmGCUAMAjfZuqibXKqcG1Su5g216/tDq9az4LPOcdCzdyL0HzgfBn3HAJAMgwbh895x8GW3GLljuwgUiP5yrZq+uRUrOECJEgNWOzn5WrEZwQrzfZR/G+dBU1JSibNTSgtUy8gCmP+laUaqmYwXnA119pGV6U7qQEh+k4TNgGUAYLNiDMrYONEFKTjQKNIIIwNE+QqOaQFBC2zylkUzvFeHsNfZRAnUI1Tvu7R48RLeWzRaFtlsqXUEFIKK9ycENvfeT2nh8g6euY0r87H5ggdbiCGXDdAsXnzC/PDQJMlPPfbfu/gYmSQo0J/4By2qqdMOviIStqKXt7FIcQ+5bGU3uXotP2jYOBTatY+BL7rHQ2+W9wcg/X+bgpYAA/ojI6AY7NE5FtpgZVC7psFYraqnrNONev5VX++eociw/+6qYB/8jyORBYSIyAjSubPzFJF8/7tO45eLkY5loaOsRSEkEU9ZIh64dVeaQ1RhAu4AFo2ilyxpvDHv+xttdKylPPzed99FfBoZGcmHQf8zf5/q4+NDg5Eqhw0JaSSSsRd1mnBZpFFG5niiceDz8AXTwA3Jma/Bh+/JhDd9fDHvu+H5TsXzGn5o1Ki42kzxsylw//j3K6Ok4+ISyZd9guwIGZOr0/kYi5Z0NZauOBNq1giVmzWOg04dk6FHj2To+2US9Mf8P/DrJPi6bwL07jEXK4J4uWnTSLl+3RBjneqG3HIlJxlLl+gbviB1HTreQE0g/Gj/O1iJDm8SHrFQKl92UjIlqIAFt1xBmMJVsUScUeU7YX50VMa/sXFworNS8okoHDHnarX+qPr1KPwmy1Ur2YUHBSVT5Q8S/P7pczAYfKi/XzipWWPCBEJm/C6JKCRFbyPR2MsURZnI0hETgpKLCgo8FwFzPkHdQmYiGIZnNms+rWdgYDTRG3zoP7c0u8ISfn4+WB6uKFW06PiftJI9lC7nmVseGaB2nSDM66j8O8+FHr3mQZ8+c1Hxz4P+X8fDV71j5W5douU2bWOwQogw1q7ll1ut0kwoUeS7nT5eC8obDO7/9nIw/wEAKBeBLR0TFBRA7B3mlbO2GrqqqM000En2qIqnYX0+nbdJCW6JOB0v/Aw0VPsa3GpwKzgy4YdlFKYCMubU9yMTaoeFhakTIf/53MciNigokEycHGwlSf0XCMJU1pvPJYKrkYFOFGbK7P48wZRENHhOuvFYsUxD4LkbrTSuWMZ+F/TDWA8h6F9YhsV0buzvXKKjkxgLDCVk0KviJVyN5Sv6Gms28JGbtfaXO3YJh849IqBb7wjo9WUUaoHZctcuEdChfQg0ahRkbNwoKLdaFTvQafqcmjI5qXVKygo+Aee/4s+jTU5SZg0HkBEjvbAsG7SAkh+QUqezAY9slQuZj3xh97hFR2YIAtyyyJTQAZI3RuHYX6tVnTjB338WUdqehn/xHAzK2gX+fqRpi+G1CPn6oAaPIxJ9rsBKSxFLNd5nwFKVgVAzQZakqbla9ph8v7VjR7vKAYF+Fnnf8E8fW8//RV1P3LxidJWrDl9QtIgdVCgfYqxez1Ou39wbPvk0GNp+FgYdOkfKHTvPwnIwEpkhSG5Qz9tYp6aHXK0yBoy255GRo8Lbx8XNR23l8kGc/0EAkKfIfVUm8CejRvmWKlpk9GxU1H8T2OgXwqY5uxh5rY+1NivXCIovInmyVm+utWgHkjQwbcRI3xLqSljvRNi/AgI2cNVhphcpXabfFzo6+Z4V5nmd4Jsr0imyqJmizM0XUWhJXig6Z6AQHXW+XNlh7WbYs3UP/ncXXVk3wYf4BwaTgd95NituO/pmjSqRUKGqd279JqFyk5az5CYtori1aBUtN28+G6M+IrdOLQOULT06t2SxAavHjo1uNGvWPMKaTErNb/ggvvogOzWlAuVC6EkwgmDqxFhdzWoeYwkZd4qQCfwOmYYtfMgVOl58EXM+9Xqr4xHY72jrT2Y0NhiCcB96Naf/71cyYyJu+FAHqiVD7KyIy2s2Dk+S7HI1uimYklATELdcrcA6gXZPihQZOHT0GAe2BjLNA57hXw4AXo346omXTzipVWOsSwnbabmVqwTm1qwdkVu1Wohcq9YsY53aEca6tcLlhnXDoXxpV8z3k25+0txumrNjVAk25d7Hx4taBtR/DQAsQWDKx4FYHvkZ4slXfQLqlCg2LAxz4xXM8Uj1k8EKqVkjYvQJduiEYVeqVhrU3cXZjy9A9Wdl3z+fBgxmXfJ5u2lWNsL3npSMeykIE1F8jsdjTgQtu11LHF9bSWMdun4xQQoNC+Cf/9/SrgmwDPy+fn5k0sSQomVKDllQpqQTVKnoB9Uq+0HNqr5QrZIHlCs5DUoXH3O5VvWpISOGRjUNDJjDuopM85id/yGo/4MDIO9C5LVLDb5eGI2BxMM9jAzo71G/Xu0xE2y1g5foxKGHMEefR9tYteLwPjMdfEhAoHoBfX3/7aYHTwX+yjl0/WyKxtZqyBhCRh5DEDzXSONfi+SHK9a64Q6fdZqs8dHr84Hnf58GzQwYHES++861pq318AwrzYjHRW1GPi9Xaszl6lXGpH/a3m7y6B8C64UEzyWhoch4vj7Eknk+pPM/OADy18jKBWGlDGsbhxKD3p/YTQvVfjfYtXzbNt/V7tplXJkZdj4kL+//+xfAfGxVzLF9jx7tTipWmtRYpxszThKGzqxUadSnY8a4Cuy9v+qiW6ZBg8oEY0ZHl/m0vUuvjh1mDhwxzLeum2uUdVBQGAkJDcHf64UpRy+YwP6hHf8fBcD7gMCaNayxERBg4Dk6PDyIhIUFEn9/xVl/ReT/8bgmEPgRTy8/MmOGO5k+3QVVtvKapfP/chAY2KqqQRjlUSQiYg5hPX0/fxbtekHp7vn9Rx1fIADInxZMJSNjBXYRsN6m+Z31gViI6QvKhB7XJn6+aoftr48+kwZR0wEex5sycafc0PEl/+mIL3AAFKRZOsMyz+c1mD5Qzn2HCf4IyoK0/1cAKLRCABRaIQAKrRAAhVYIgEIrBEChFQKg0P4HSCsuDFd2naUAAAAASUVORK5CYII=",
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
        const color = document.createElement("canvas").getContext("2d", {
          willReadFrequently: true,
        });
        const grey = document.createElement("canvas").getContext("2d", {
          willReadFrequently: true,
        });
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
      window.remixPersistCustomFruitSettings();
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
      window.remixPersistCustomFruitSettings();
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
  window.remixBindCustomFruitUrlPersistence(window.remixCustomFruitSlots);
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
  window.remixBindCustomFruitUrlPersistence(window.remixCustomPoisonSlots);
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
    window.remixPersistCustomFruitSettings();
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
  window.remixInstallCustomFruitSaveSettingsHook();
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
