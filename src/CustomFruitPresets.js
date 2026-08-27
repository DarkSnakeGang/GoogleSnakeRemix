window.REMIX_CUSTOM_FRUIT_PRESETS = [
  {
    id: "blackberries",
    label: "Blackberries",
    normal: "https://i.postimg.cc/hPTVGdNX/blackberries.png",
    pixel: "https://i.postimg.cc/RZTf7zS9/px-blackberries.png",
    real: "https://i.postimg.cc/RVgCjj3c/blackberries-real.png",
  },
  {
    id: "pacman-ghost",
    label: "Pacman Ghost",
    normal: "https://i.postimg.cc/TP7ZGZGf/pacman-ghost.png",
    pixel: "https://i.postimg.cc/BvtK8fxb/px-pacman-ghost.png",
    real: "https://i.postimg.cc/3Nc4x2Ch/ghost-real.png",
  },
  {
    id: "sonic-rings",
    label: "Sonic Rings",
    normal: "https://i.postimg.cc/pX1xYGp9/sonic-ring.png",
    pixel: "https://i.postimg.cc/BvzJqWhs/ring-1.png",
    real: "https://i.postimg.cc/W3WrCR8H/ring-real.png",
  },
  {
    id: "mango",
    label: "Mango",
    normal: "https://i.postimg.cc/R0NbYNSH/Mango.png",
    pixel: "https://i.postimg.cc/bNny7wv4/mango-px.png",
    real: "https://i.postimg.cc/Hsb6V2tP/mango-real.png",
  },
  {
    id: "melon",
    label: "Melon",
    normal: "https://i.postimg.cc/8knkL3WN/melon.png",
    pixel: "https://i.postimg.cc/Qt8NqZ0x/pixel-melon.png",
    real: "https://i.postimg.cc/kG6h1PKn/melon-real.png",
  },
  {
    id: "soccer-ball",
    label: "Soccer Ball",
    normal: "https://i.postimg.cc/C1yT8vjL/soccer-ball.png",
    pixel: "https://i.postimg.cc/kGDnkN00/pixel-soccer-ball.png",
    real: "https://i.postimg.cc/J7cnn0n8/soccer-real.png",
  },
  {
    id: "dirt-block",
    label: "Dirt Block",
    normal: "https://i.postimg.cc/9FwzBRY4/mc-dirt.png",
    pixel: "https://i.postimg.cc/7ZvhtHKK/mc-dirt-px.png",
    real: "https://i.postimg.cc/Z5rR1Gg4/mc-dirt-real.png",
  },
  {
    id: "cabbage",
    label: "Cabbage",
    normal: "https://i.postimg.cc/j59z8v1m/cabbage.png",
    pixel: "https://i.postimg.cc/FR1ygwT0/cabbage-px.png",
    real: "https://i.postimg.cc/yd1GyLFv/cabbage-real.png",
  },
  {
    id: "heart",
    label: "Heart",
    normal: "https://i.postimg.cc/8PGLRXCb/heart.png",
    pixel: "https://i.postimg.cc/v8fW6wGB/pixel-heart.png",
    real: "https://i.postimg.cc/3NXmMmtp/real-heart.png",
  },
  {
    id: "bread",
    label: "Bread",
    normal: "https://i.postimg.cc/YSMVtPr1/bread.png",
    pixel: "https://i.postimg.cc/265KZBBy/bread-px.png",
    real: "https://i.postimg.cc/sgpqdzrj/bread-real.png",
  },
  {
    id: "santa-hat",
    label: "Santa Hat",
    normal: "https://i.postimg.cc/kgV7FKDL/santa.png",
    pixel: "https://i.postimg.cc/SN1yMDQW/santa-px.png",
    real: "https://i.postimg.cc/FsHrz2vr/santa-rtx.png",
  },
];

window.remixPacmanGhostUri = function remixPacmanGhostUri(key) {
  const map = window.__REMIX_PACMAN_GHOST_URIS || {};
  return map[key] || "";
};

/** Poison presets: Blinky (Distinct Visual poison-ghost) + Pinky/Inky/Clyde + Skull. */
window.REMIX_CUSTOM_POISON_PRESETS = [
  {
    id: "blinky-poison",
    label: "Blinky poison",
    poisonNormal: "https://i.postimg.cc/DZqL146Z/poison-ghost.png",
    poisonPixel: "https://i.postimg.cc/cLF34LtP/px-poison-ghost.png",
    poisonReal: "https://i.postimg.cc/DZqL146Z/poison-ghost.png",
  },
  {
    id: "pinky-poison",
    label: "Pinky poison",
    poisonNormal: window.remixPacmanGhostUri("pinky-normal"),
    poisonPixel: window.remixPacmanGhostUri("pinky-pixel"),
    poisonReal: window.remixPacmanGhostUri("pinky-real"),
  },
  {
    id: "inky-poison",
    label: "Inky poison",
    poisonNormal: window.remixPacmanGhostUri("inky-normal"),
    poisonPixel: window.remixPacmanGhostUri("inky-pixel"),
    poisonReal: window.remixPacmanGhostUri("inky-real"),
  },
  {
    id: "clyde-poison",
    label: "Clyde poison",
    poisonNormal: window.remixPacmanGhostUri("clyde-normal"),
    poisonPixel: window.remixPacmanGhostUri("clyde-pixel"),
    poisonReal: window.remixPacmanGhostUri("clyde-real"),
  },
  {
    id: "skull-poison",
    label: "Skull poison",
    poisonNormal:
      "https://www.google.com/logos/fnbx/snake_arcade/v12/trophy_10.png",
    poisonPixel:
      "https://www.google.com/logos/fnbx/snake_arcade/pixel/px_trophy_10.png",
    poisonReal: "https://i.postimg.cc/prstgqbL/poison-skull.png",
  },
];
