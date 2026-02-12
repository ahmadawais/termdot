"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BRAILLE_OFFSET: () => BRAILLE_OFFSET,
  DOT_MASKS: () => DOT_MASKS,
  PIXEL_MAP: () => PIXEL_MAP,
  animate: () => animate,
  braille: () => braille,
  brailleDots: () => brailleDots,
  brailleGrid: () => brailleGrid,
  brailleIcon: () => brailleIcon,
  clear: () => clear,
  createCanvas: () => createCanvas,
  createFixedCanvas: () => createFixedCanvas,
  createTurtle: () => createTurtle,
  fixedClear: () => fixedClear,
  fixedFrame: () => fixedFrame,
  fixedGet: () => fixedGet,
  fixedSet: () => fixedSet,
  fixedToggle: () => fixedToggle,
  fixedUnset: () => fixedUnset,
  frame: () => frame,
  get: () => get,
  getPos: () => getPos,
  getTerminalSize: () => getTerminalSize,
  line: () => line,
  normalize: () => normalize,
  polygon: () => polygon,
  rows: () => rows,
  set: () => set,
  setText: () => setText,
  toggle: () => toggle,
  turtleBack: () => turtleBack,
  turtleDown: () => turtleDown,
  turtleForward: () => turtleForward,
  turtleLeft: () => turtleLeft,
  turtleMove: () => turtleMove,
  turtleRight: () => turtleRight,
  turtleUp: () => turtleUp,
  unset: () => unset
});
module.exports = __toCommonJS(index_exports);
var BRAILLE_OFFSET = 10240;
var PIXEL_MAP = [
  [1, 8],
  [2, 16],
  [4, 32],
  [64, 128]
];
var DOT_MASKS = [
  1,
  // dot 1
  2,
  // dot 2
  4,
  // dot 3
  8,
  // dot 4
  16,
  // dot 5
  32,
  // dot 6
  64,
  // dot 7
  128
  // dot 8
];
function normalize(coord) {
  return Math.round(coord);
}
function getPos(x, y) {
  return [Math.floor(normalize(x) / 2), Math.floor(normalize(y) / 4)];
}
function createCanvas(options) {
  return {
    chars: /* @__PURE__ */ new Map(),
    lineEnding: options?.lineEnding ?? "\n"
  };
}
function clear(canvas) {
  canvas.chars.clear();
}
function set(canvas, x, y) {
  const nx = normalize(x);
  const ny = normalize(y);
  const [col, row] = getPos(nx, ny);
  let rowMap = canvas.chars.get(row);
  if (!rowMap) {
    rowMap = /* @__PURE__ */ new Map();
    canvas.chars.set(row, rowMap);
  }
  const current = rowMap.get(col);
  if (current !== void 0 && typeof current !== "number") {
    return;
  }
  const mask = PIXEL_MAP[ny % 4]?.[nx % 2];
  if (mask === void 0) return;
  rowMap.set(col, (current ?? 0) | mask);
}
function unset(canvas, x, y) {
  const nx = normalize(x);
  const ny = normalize(y);
  const [col, row] = getPos(nx, ny);
  const rowMap = canvas.chars.get(row);
  if (!rowMap) return;
  const current = rowMap.get(col);
  if (current === void 0 || typeof current !== "number") return;
  const mask = PIXEL_MAP[ny % 4]?.[nx % 2];
  if (mask === void 0) return;
  const updated = current & ~mask;
  if (updated === 0) {
    rowMap.delete(col);
    if (rowMap.size === 0) {
      canvas.chars.delete(row);
    }
    return;
  }
  rowMap.set(col, updated);
}
function toggle(canvas, x, y) {
  const nx = normalize(x);
  const ny = normalize(y);
  const [col, row] = getPos(nx, ny);
  const rowMap = canvas.chars.get(row);
  const current = rowMap?.get(col);
  const mask = PIXEL_MAP[ny % 4]?.[nx % 2];
  if (mask === void 0) return;
  if (current !== void 0 && (typeof current !== "number" || (current & mask) !== 0)) {
    unset(canvas, x, y);
  } else {
    set(canvas, x, y);
  }
}
function get(canvas, x, y) {
  const nx = normalize(x);
  const ny = normalize(y);
  const [col, row] = getPos(nx, ny);
  const rowMap = canvas.chars.get(row);
  if (!rowMap) return false;
  const cell = rowMap.get(col);
  if (cell === void 0) return false;
  if (typeof cell !== "number") return true;
  const mask = PIXEL_MAP[ny % 4]?.[nx % 2];
  if (mask === void 0) return false;
  return (cell & mask) !== 0;
}
function setText(canvas, x, y, text) {
  const [col, row] = getPos(x, y);
  let rowMap = canvas.chars.get(row);
  if (!rowMap) {
    rowMap = /* @__PURE__ */ new Map();
    canvas.chars.set(row, rowMap);
  }
  for (let i = 0; i < text.length; i++) {
    rowMap.set(col + i, text[i]);
  }
}
function braille(dots) {
  let mask = 0;
  for (let i = 0; i < 8; i++) {
    if (dots[i]) {
      mask |= DOT_MASKS[i];
    }
  }
  return String.fromCharCode(BRAILLE_OFFSET + mask);
}
function brailleDots(...dots) {
  let mask = 0;
  for (const d of dots) {
    if (d < 1 || d > 8) continue;
    mask |= DOT_MASKS[d - 1];
  }
  return String.fromCharCode(BRAILLE_OFFSET + mask);
}
function brailleIcon(...chars) {
  if (chars.length === 0 || chars.length > 3) return "";
  const parts = [];
  for (let i = 0; i < chars.length; i++) {
    const dots = chars[i];
    if (!dots) continue;
    let mask = 0;
    for (const d of dots) {
      if (d < 1 || d > 8) continue;
      mask |= DOT_MASKS[d - 1];
    }
    parts.push(String.fromCharCode(BRAILLE_OFFSET + mask));
  }
  return parts.join("");
}
function brailleGrid(pixels) {
  let maxWidth = 0;
  for (const row of pixels) {
    if (row.length > maxWidth) maxWidth = row.length;
  }
  const height = Math.min(pixels.length, 4);
  const width = Math.min(maxWidth, 6);
  const charCount = Math.ceil(width / 2);
  const masks = Array.from({ length: charCount }, () => 0);
  for (let y = 0; y < height; y++) {
    const row = pixels[y];
    if (!row) continue;
    for (let x = 0; x < width; x++) {
      if (!row[x]) continue;
      const charIdx = Math.floor(x / 2);
      const mask = PIXEL_MAP[y]?.[x % 2];
      if (mask === void 0) continue;
      masks[charIdx] = (masks[charIdx] ?? 0) | mask;
    }
  }
  return masks.map((m) => String.fromCharCode(BRAILLE_OFFSET + m)).join("");
}
function rows(canvas, bounds) {
  if (canvas.chars.size === 0) return [];
  const allRows = [...canvas.chars.keys()];
  const minRow = bounds?.minY != null ? Math.floor(bounds.minY / 4) : Math.min(...allRows);
  const maxRow = bounds?.maxY != null ? Math.floor((bounds.maxY - 1) / 4) : Math.max(...allRows);
  let globalMinCol;
  if (bounds?.minX != null) {
    globalMinCol = Math.floor(bounds.minX / 2);
  } else {
    let min = Number.POSITIVE_INFINITY;
    for (const rowMap of canvas.chars.values()) {
      for (const c of rowMap.keys()) {
        if (c < min) min = c;
      }
    }
    globalMinCol = min === Number.POSITIVE_INFINITY ? 0 : min;
  }
  const result = [];
  for (let rowNum = minRow; rowNum <= maxRow; rowNum++) {
    const rowMap = canvas.chars.get(rowNum);
    if (!rowMap) {
      result.push("");
      continue;
    }
    let maxCol;
    if (bounds?.maxX != null) {
      maxCol = Math.floor((bounds.maxX - 1) / 2);
    } else {
      maxCol = Math.max(...rowMap.keys());
    }
    const chars = [];
    for (let c = globalMinCol; c <= maxCol; c++) {
      const cell = rowMap.get(c);
      if (cell === void 0 || cell === 0) {
        chars.push(" ");
      } else if (typeof cell !== "number") {
        chars.push(cell);
      } else {
        chars.push(String.fromCharCode(BRAILLE_OFFSET + cell));
      }
    }
    result.push(chars.join(""));
  }
  return result;
}
function frame(canvas, bounds) {
  return rows(canvas, bounds).join(canvas.lineEnding);
}
function* line(x1, y1, x2, y2) {
  const nx1 = normalize(x1);
  const ny1 = normalize(y1);
  const nx2 = normalize(x2);
  const ny2 = normalize(y2);
  const xDiff = Math.abs(nx2 - nx1);
  const yDiff = Math.abs(ny2 - ny1);
  const xDir = nx1 <= nx2 ? 1 : -1;
  const yDir = ny1 <= ny2 ? 1 : -1;
  const steps = Math.max(xDiff, yDiff);
  for (let i = 0; i <= steps; i++) {
    let px = nx1;
    let py = ny1;
    if (yDiff) {
      py += Math.round(i * yDiff / steps) * yDir;
    }
    if (xDiff) {
      px += Math.round(i * xDiff / steps) * xDir;
    }
    yield { x: px, y: py };
  }
}
function* polygon(centerX = 0, centerY = 0, sides = 4, radius = 4) {
  const degree = 360 / sides;
  for (let n = 0; n < sides; n++) {
    const a = n * degree;
    const b = (n + 1) * degree;
    const x1 = (centerX + Math.cos(a * Math.PI / 180)) * ((radius + 1) / 2);
    const y1 = (centerY + Math.sin(a * Math.PI / 180)) * ((radius + 1) / 2);
    const x2 = (centerX + Math.cos(b * Math.PI / 180)) * ((radius + 1) / 2);
    const y2 = (centerY + Math.sin(b * Math.PI / 180)) * ((radius + 1) / 2);
    for (const pt of line(x1, y1, x2, y2)) {
      yield pt;
    }
  }
}
function createTurtle(posX = 0, posY = 0) {
  return {
    canvas: createCanvas(),
    posX,
    posY,
    rotation: 0,
    brushOn: true
  };
}
function turtleUp(t) {
  t.brushOn = false;
}
function turtleDown(t) {
  t.brushOn = true;
}
function turtleMove(t, x, y) {
  if (t.brushOn) {
    for (const pt of line(t.posX, t.posY, x, y)) {
      set(t.canvas, pt.x, pt.y);
    }
  }
  t.posX = x;
  t.posY = y;
}
function turtleForward(t, step) {
  const x = t.posX + Math.cos(t.rotation * Math.PI / 180) * step;
  const y = t.posY + Math.sin(t.rotation * Math.PI / 180) * step;
  const prevBrush = t.brushOn;
  t.brushOn = true;
  turtleMove(t, x, y);
  t.brushOn = prevBrush;
}
function turtleBack(t, step) {
  turtleForward(t, -step);
}
function turtleRight(t, angle) {
  t.rotation += angle;
}
function turtleLeft(t, angle) {
  t.rotation -= angle;
}
function getTerminalSize() {
  const width = process.stdout?.columns ?? 80;
  const height = process.stdout?.rows ?? 25;
  return { width, height };
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function animate(canvas, fn, options) {
  const delay = options?.delay ?? 1e3 / 24;
  for (const points of fn()) {
    if (options?.signal?.aborted) break;
    for (const pt of points) {
      set(canvas, pt.x, pt.y);
    }
    const f = frame(canvas);
    process.stdout.write(`\x1B[H\x1B[J${f}
`);
    if (delay > 0) {
      await sleep(delay);
    }
    clear(canvas);
  }
}
function createFixedCanvas(width, height) {
  const w = Math.floor(width / 2) * 2;
  const h = Math.floor(height / 4) * 4;
  return {
    width: w,
    height: h,
    content: new Uint8Array(w * h / 8)
  };
}
function fixedClear(canvas) {
  canvas.content.fill(0);
}
function fixedSet(canvas, x, y) {
  if (!(x >= 0 && x < canvas.width && y >= 0 && y < canvas.height)) return;
  const fx = Math.floor(x);
  const fy = Math.floor(y);
  const nx = Math.floor(fx / 2);
  const ny = Math.floor(fy / 4);
  const coord = nx + canvas.width / 2 * ny;
  const mask = PIXEL_MAP[fy % 4]?.[fx % 2];
  if (mask === void 0) return;
  const val = canvas.content[coord];
  if (val === void 0) return;
  canvas.content[coord] = val | mask;
}
function fixedUnset(canvas, x, y) {
  if (!(x >= 0 && x < canvas.width && y >= 0 && y < canvas.height)) return;
  const fx = Math.floor(x);
  const fy = Math.floor(y);
  const nx = Math.floor(fx / 2);
  const ny = Math.floor(fy / 4);
  const coord = nx + canvas.width / 2 * ny;
  const mask = PIXEL_MAP[fy % 4]?.[fx % 2];
  if (mask === void 0) return;
  const val = canvas.content[coord];
  if (val === void 0) return;
  canvas.content[coord] = val & ~mask;
}
function fixedToggle(canvas, x, y) {
  if (!(x >= 0 && x < canvas.width && y >= 0 && y < canvas.height)) return;
  const fx = Math.floor(x);
  const fy = Math.floor(y);
  const nx = Math.floor(fx / 2);
  const ny = Math.floor(fy / 4);
  const coord = nx + canvas.width / 2 * ny;
  const mask = PIXEL_MAP[fy % 4]?.[fx % 2];
  if (mask === void 0) return;
  const val = canvas.content[coord];
  if (val === void 0) return;
  canvas.content[coord] = val ^ mask;
}
function fixedGet(canvas, x, y) {
  if (!(x >= 0 && x < canvas.width && y >= 0 && y < canvas.height))
    return false;
  const fx = Math.floor(x);
  const fy = Math.floor(y);
  const nx = Math.floor(fx / 2);
  const ny = Math.floor(fy / 4);
  const coord = nx + canvas.width / 2 * ny;
  const mask = PIXEL_MAP[fy % 4]?.[fx % 2];
  if (mask === void 0) return false;
  const val = canvas.content[coord];
  if (val === void 0) return false;
  return (val & mask) !== 0;
}
function fixedFrame(canvas, delimiter = "\n") {
  const frameWidth = canvas.width / 2;
  const parts = [];
  for (let i = 0; i < canvas.content.length; i++) {
    if (i % frameWidth === 0) {
      parts.push(delimiter);
    }
    const val = canvas.content[i];
    parts.push(val ? String.fromCharCode(BRAILLE_OFFSET + val) : " ");
  }
  parts.push(delimiter);
  return parts.join("");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BRAILLE_OFFSET,
  DOT_MASKS,
  PIXEL_MAP,
  animate,
  braille,
  brailleDots,
  brailleGrid,
  brailleIcon,
  clear,
  createCanvas,
  createFixedCanvas,
  createTurtle,
  fixedClear,
  fixedFrame,
  fixedGet,
  fixedSet,
  fixedToggle,
  fixedUnset,
  frame,
  get,
  getPos,
  getTerminalSize,
  line,
  normalize,
  polygon,
  rows,
  set,
  setText,
  toggle,
  turtleBack,
  turtleDown,
  turtleForward,
  turtleLeft,
  turtleMove,
  turtleRight,
  turtleUp,
  unset
});
//# sourceMappingURL=index.cjs.map