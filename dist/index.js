// src/index.ts
var BRAILLE_OFFSET = 10240;
var PIXEL_MAP = [
  [1, 8],
  [2, 16],
  [4, 32],
  [64, 128]
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
export {
  BRAILLE_OFFSET,
  PIXEL_MAP,
  animate,
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
};
//# sourceMappingURL=index.js.map