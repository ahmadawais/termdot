/**
 * btui — Braille TUI canvas for terminal drawing with Unicode braille characters.
 *
 * Braille dot layout per character cell:
 *   ,___,
 *   |1 4|
 *   |2 5|
 *   |3 6|
 *   |7 8|
 *   `````
 *
 * Each character maps to a 2x4 pixel grid.
 * Unicode braille characters: U+2800 to U+28FF.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BRAILLE_OFFSET = 0x2800;

const PIXEL_MAP: readonly (readonly [number, number])[] = [
	[0x01, 0x08],
	[0x02, 0x10],
	[0x04, 0x20],
	[0x40, 0x80],
] as const;

/** Bitmask for each braille dot number (1–8). */
const DOT_MASKS: readonly number[] = [
	0x01, // dot 1
	0x02, // dot 2
	0x04, // dot 3
	0x08, // dot 4
	0x10, // dot 5
	0x20, // dot 6
	0x40, // dot 7
	0x80, // dot 8
] as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single cell can hold a braille bitmask (number) or a text character (string). */
type CellValue = number | string;

/** Sparse row → col → cell storage. */
interface CanvasChars {
	readonly [row: number]: {readonly [col: number]: CellValue} | undefined;
}

/** The braille canvas data structure. */
interface Canvas {
	chars: Map<number, Map<number, CellValue>>;
	readonly lineEnding: string;
}

/** Options for creating a canvas. */
interface CreateCanvasOptions {
	readonly lineEnding?: string;
}

/** Bounds for frame/rows rendering. */
interface FrameBounds {
	readonly minX?: number;
	readonly minY?: number;
	readonly maxX?: number;
	readonly maxY?: number;
}

/** A 2D point. */
interface Point {
	readonly x: number;
	readonly y: number;
}

/** Turtle graphics state. */
interface TurtleState {
	readonly canvas: Canvas;
	posX: number;
	posY: number;
	rotation: number;
	brushOn: boolean;
}

// ---------------------------------------------------------------------------
// Coordinate helpers
// ---------------------------------------------------------------------------

/** Normalize a coordinate to an integer. */
function normalize(coord: number): number {
	return Math.round(coord);
}

/** Convert pixel (x, y) to cell (col, row). */
function getPos(x: number, y: number): readonly [number, number] {
	return [Math.floor(normalize(x) / 2), Math.floor(normalize(y) / 4)];
}

// ---------------------------------------------------------------------------
// Canvas — creation & mutation
// ---------------------------------------------------------------------------

/** Create a new braille canvas. */
function createCanvas(options?: CreateCanvasOptions): Canvas {
	return {
		chars: new Map(),
		lineEnding: options?.lineEnding ?? '\n',
	};
}

/** Remove all pixels from the canvas. */
function clear(canvas: Canvas): void {
	canvas.chars.clear();
}

/** Set (draw) a pixel at (x, y). */
function set(canvas: Canvas, x: number, y: number): void {
	const nx = normalize(x);
	const ny = normalize(y);
	const [col, row] = getPos(nx, ny);

	let rowMap = canvas.chars.get(row);
	if (!rowMap) {
		rowMap = new Map();
		canvas.chars.set(row, rowMap);
	}

	const current = rowMap.get(col);
	if (current !== undefined && typeof current !== 'number') {
		return;
	}

	const mask = PIXEL_MAP[ny % 4]?.[nx % 2];
	if (mask === undefined) return;

	rowMap.set(col, ((current as number | undefined) ?? 0) | mask);
}

/** Unset (erase) a pixel at (x, y). */
function unset(canvas: Canvas, x: number, y: number): void {
	const nx = normalize(x);
	const ny = normalize(y);
	const [col, row] = getPos(nx, ny);

	const rowMap = canvas.chars.get(row);
	if (!rowMap) return;

	const current = rowMap.get(col);
	if (current === undefined || typeof current !== 'number') return;

	const mask = PIXEL_MAP[ny % 4]?.[nx % 2];
	if (mask === undefined) return;

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

/** Toggle a pixel at (x, y). */
function toggle(canvas: Canvas, x: number, y: number): void {
	const nx = normalize(x);
	const ny = normalize(y);
	const [col, row] = getPos(nx, ny);

	const rowMap = canvas.chars.get(row);
	const current = rowMap?.get(col);

	const mask = PIXEL_MAP[ny % 4]?.[nx % 2];
	if (mask === undefined) return;

	if (
		current !== undefined &&
		(typeof current !== 'number' || (current & mask) !== 0)
	) {
		unset(canvas, x, y);
	} else {
		set(canvas, x, y);
	}
}

/** Get the state of a pixel at (x, y). Returns true if set. */
function get(canvas: Canvas, x: number, y: number): boolean {
	const nx = normalize(x);
	const ny = normalize(y);
	const [col, row] = getPos(nx, ny);

	const rowMap = canvas.chars.get(row);
	if (!rowMap) return false;

	const cell = rowMap.get(col);
	if (cell === undefined) return false;
	if (typeof cell !== 'number') return true;

	const mask = PIXEL_MAP[ny % 4]?.[nx % 2];
	if (mask === undefined) return false;

	return (cell & mask) !== 0;
}

/** Set text at the given pixel coords. Each character occupies one cell column. */
function setText(canvas: Canvas, x: number, y: number, text: string): void {
	const [col, row] = getPos(x, y);

	let rowMap = canvas.chars.get(row);
	if (!rowMap) {
		rowMap = new Map();
		canvas.chars.set(row, rowMap);
	}

	for (let i = 0; i < text.length; i++) {
		rowMap.set(col + i, text[i] as string);
	}
}

// ---------------------------------------------------------------------------
// Braille character builders
// ---------------------------------------------------------------------------

/**
 * 8-element tuple: on/off state for dots 1–8.
 *
 *   ,___,
 *   |1 4|
 *   |2 5|
 *   |3 6|
 *   |7 8|
 *   `````
 */
type DotPattern = readonly [
	boolean,
	boolean,
	boolean,
	boolean,
	boolean,
	boolean,
	boolean,
	boolean,
];

/** Build a braille character from an 8-element on/off pattern (dots 1–8). */
function braille(dots: DotPattern): string {
	let mask = 0;
	for (let i = 0; i < 8; i++) {
		if (dots[i]) {
			mask |= DOT_MASKS[i] as number;
		}
	}
	return String.fromCharCode(BRAILLE_OFFSET + mask);
}

/** Build a braille character by listing which dot numbers (1–8) are on. */
function brailleDots(...dots: readonly number[]): string {
	let mask = 0;
	for (const d of dots) {
		if (d < 1 || d > 8) continue;
		mask |= DOT_MASKS[d - 1] as number;
	}
	return String.fromCharCode(BRAILLE_OFFSET + mask);
}

/**
 * Build a 1–3 character braille icon. Each argument is an array of
 * dot numbers (1–8) that are ON for that character position.
 *
 * @example
 * brailleIcon([1, 2, 3, 7], [4, 5, 6, 8]) // "⡇⢸" — left bar + right bar
 * brailleIcon([1, 4])                       // "⠉"   — single char, top row
 * brailleIcon([1], [1, 8], [1])             // 3-char
 */
function brailleIcon(...chars: readonly (readonly number[])[]): string {
	if (chars.length === 0 || chars.length > 3) return '';

	const parts: string[] = [];
	for (let i = 0; i < chars.length; i++) {
		const dots = chars[i];
		if (!dots) continue;
		let mask = 0;
		for (const d of dots) {
			if (d < 1 || d > 8) continue;
			mask |= DOT_MASKS[d - 1] as number;
		}
		parts.push(String.fromCharCode(BRAILLE_OFFSET + mask));
	}
	return parts.join('');
}

/**
 * Build a braille icon from a visual pixel grid.
 * Each row is an array of 0/1 values. Max 6 columns wide × 4 rows tall.
 * Every 2 columns map to one braille character.
 *
 *   col:  0 1 │ 2 3 │ 4 5
 *         ────┼─────┼────
 *   row0: 1 4 │ 1 4 │ 1 4
 *   row1: 2 5 │ 2 5 │ 2 5
 *   row2: 3 6 │ 3 6 │ 3 6
 *   row3: 7 8 │ 7 8 │ 7 8
 *         ─ch0─ ─ch1─ ─ch2─
 *
 * @example
 * brailleGrid([
 *   [0, 1, 1, 0],
 *   [1, 0, 0, 1],
 *   [1, 0, 0, 1],
 *   [0, 1, 1, 0],
 * ]) // "⠳⠞" — a diamond shape, 2 chars wide
 */
function brailleGrid(pixels: readonly (readonly number[])[]): string {
	let maxWidth = 0;
	for (const row of pixels) {
		if (row.length > maxWidth) maxWidth = row.length;
	}

	const height = Math.min(pixels.length, 4);
	const width = Math.min(maxWidth, 6);
	const charCount = Math.ceil(width / 2);

	const masks: number[] = Array.from({length: charCount}, () => 0);

	for (let y = 0; y < height; y++) {
		const row = pixels[y];
		if (!row) continue;
		for (let x = 0; x < width; x++) {
			if (!row[x]) continue;
			const charIdx = Math.floor(x / 2);
			const mask = PIXEL_MAP[y]?.[x % 2];
			if (mask === undefined) continue;
			masks[charIdx] = (masks[charIdx] ?? 0) | mask;
		}
	}

	return masks.map(m => String.fromCharCode(BRAILLE_OFFSET + m)).join('');
}

// ---------------------------------------------------------------------------
// Canvas — rendering
// ---------------------------------------------------------------------------

/** Return the canvas content as an array of strings (one per row). */
function rows(canvas: Canvas, bounds?: FrameBounds): readonly string[] {
	if (canvas.chars.size === 0) return [];

	const allRows = [...canvas.chars.keys()];
	const minRow =
		bounds?.minY != null
			? Math.floor(bounds.minY / 4)
			: Math.min(...allRows);
	const maxRow =
		bounds?.maxY != null
			? Math.floor((bounds.maxY - 1) / 4)
			: Math.max(...allRows);

	// Global min col for left alignment
	let globalMinCol: number;
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

	const result: string[] = [];

	for (let rowNum = minRow; rowNum <= maxRow; rowNum++) {
		const rowMap = canvas.chars.get(rowNum);
		if (!rowMap) {
			result.push('');
			continue;
		}

		let maxCol: number;
		if (bounds?.maxX != null) {
			maxCol = Math.floor((bounds.maxX - 1) / 2);
		} else {
			maxCol = Math.max(...rowMap.keys());
		}

		const chars: string[] = [];
		for (let c = globalMinCol; c <= maxCol; c++) {
			const cell = rowMap.get(c);
			if (cell === undefined || cell === 0) {
				chars.push(' ');
			} else if (typeof cell !== 'number') {
				chars.push(cell);
			} else {
				chars.push(String.fromCharCode(BRAILLE_OFFSET + cell));
			}
		}

		result.push(chars.join(''));
	}

	return result;
}

/** Render the canvas as a string. */
function frame(canvas: Canvas, bounds?: FrameBounds): string {
	return rows(canvas, bounds).join(canvas.lineEnding);
}

// ---------------------------------------------------------------------------
// Drawing utilities — line
// ---------------------------------------------------------------------------

/** Generate coordinates along a line from (x1, y1) to (x2, y2) using Bresenham-style interpolation. */
function* line(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
): Generator<Point, void, unknown> {
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
			py += Math.round((i * yDiff) / steps) * yDir;
		}
		if (xDiff) {
			px += Math.round((i * xDiff) / steps) * xDir;
		}

		yield {x: px, y: py};
	}
}

// ---------------------------------------------------------------------------
// Drawing utilities — polygon
// ---------------------------------------------------------------------------

/** Generate coordinates for a regular polygon. */
function* polygon(
	centerX = 0,
	centerY = 0,
	sides = 4,
	radius = 4,
): Generator<Point, void, unknown> {
	const degree = 360 / sides;

	for (let n = 0; n < sides; n++) {
		const a = n * degree;
		const b = (n + 1) * degree;
		const x1 =
			(centerX + Math.cos((a * Math.PI) / 180)) * ((radius + 1) / 2);
		const y1 =
			(centerY + Math.sin((a * Math.PI) / 180)) * ((radius + 1) / 2);
		const x2 =
			(centerX + Math.cos((b * Math.PI) / 180)) * ((radius + 1) / 2);
		const y2 =
			(centerY + Math.sin((b * Math.PI) / 180)) * ((radius + 1) / 2);

		for (const pt of line(x1, y1, x2, y2)) {
			yield pt;
		}
	}
}

// ---------------------------------------------------------------------------
// Turtle graphics
// ---------------------------------------------------------------------------

/** Create a new turtle state. */
function createTurtle(posX = 0, posY = 0): TurtleState {
	return {
		canvas: createCanvas(),
		posX,
		posY,
		rotation: 0,
		brushOn: true,
	};
}

/** Pull the brush up (stop drawing on move). */
function turtleUp(t: TurtleState): void {
	t.brushOn = false;
}

/** Push the brush down (draw on move). */
function turtleDown(t: TurtleState): void {
	t.brushOn = true;
}

/** Move the turtle to an absolute position, drawing if the brush is down. */
function turtleMove(t: TurtleState, x: number, y: number): void {
	if (t.brushOn) {
		for (const pt of line(t.posX, t.posY, x, y)) {
			set(t.canvas, pt.x, pt.y);
		}
	}
	t.posX = x;
	t.posY = y;
}

/** Move the turtle forward by `step` pixels in its current direction. */
function turtleForward(t: TurtleState, step: number): void {
	const x = t.posX + Math.cos((t.rotation * Math.PI) / 180) * step;
	const y = t.posY + Math.sin((t.rotation * Math.PI) / 180) * step;
	const prevBrush = t.brushOn;
	t.brushOn = true;
	turtleMove(t, x, y);
	t.brushOn = prevBrush;
}

/** Move the turtle backward by `step` pixels. */
function turtleBack(t: TurtleState, step: number): void {
	turtleForward(t, -step);
}

/** Rotate the turtle right (clockwise) by `angle` degrees. */
function turtleRight(t: TurtleState, angle: number): void {
	t.rotation += angle;
}

/** Rotate the turtle left (counter-clockwise) by `angle` degrees. */
function turtleLeft(t: TurtleState, angle: number): void {
	t.rotation -= angle;
}

// ---------------------------------------------------------------------------
// Terminal size
// ---------------------------------------------------------------------------

/** Terminal dimensions in characters. */
interface TerminalSize {
	readonly width: number;
	readonly height: number;
}

/** Get terminal width and height. Falls back to 80x25. */
function getTerminalSize(): TerminalSize {
	const width = process.stdout?.columns ?? 80;
	const height = process.stdout?.rows ?? 25;
	return {width, height};
}

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

/** Options for the animate function. */
interface AnimateOptions {
	readonly delay?: number;
	readonly signal?: AbortSignal;
}

/** Frame generator yields arrays of points per frame. */
type FrameGenerator = Generator<readonly Point[], void, unknown>;

/** Sleep for the given number of milliseconds. */
function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/** Run an animation loop. Clears the canvas each frame, draws points from the generator, and writes to stdout. */
async function animate(
	canvas: Canvas,
	fn: () => FrameGenerator,
	options?: AnimateOptions,
): Promise<void> {
	const delay = options?.delay ?? 1000 / 24;

	for (const points of fn()) {
		if (options?.signal?.aborted) break;

		for (const pt of points) {
			set(canvas, pt.x, pt.y);
		}

		const f = frame(canvas);
		process.stdout.write(`\x1b[H\x1b[J${f}\n`);

		if (delay > 0) {
			await sleep(delay);
		}

		clear(canvas);
	}
}

// ---------------------------------------------------------------------------
// Fixed-size canvas (node-drawille style)
// ---------------------------------------------------------------------------

/** A fixed-size canvas backed by a Uint8Array buffer. */
interface FixedCanvas {
	readonly width: number;
	readonly height: number;
	readonly content: Uint8Array;
}

/** Create a fixed-size canvas with the given dimensions. Width rounds to multiple of 2, height to multiple of 4. */
function createFixedCanvas(width: number, height: number): FixedCanvas {
	const w = Math.floor(width / 2) * 2;
	const h = Math.floor(height / 4) * 4;
	return {
		width: w,
		height: h,
		content: new Uint8Array((w * h) / 8),
	};
}

/** Clear all pixels from a fixed canvas. */
function fixedClear(canvas: FixedCanvas): void {
	canvas.content.fill(0);
}

/** Set a pixel on a fixed canvas. */
function fixedSet(canvas: FixedCanvas, x: number, y: number): void {
	if (!(x >= 0 && x < canvas.width && y >= 0 && y < canvas.height)) return;
	const fx = Math.floor(x);
	const fy = Math.floor(y);
	const nx = Math.floor(fx / 2);
	const ny = Math.floor(fy / 4);
	const coord = nx + (canvas.width / 2) * ny;
	const mask = PIXEL_MAP[fy % 4]?.[fx % 2];
	if (mask === undefined) return;
	const val = canvas.content[coord];
	if (val === undefined) return;
	canvas.content[coord] = val | mask;
}

/** Unset a pixel on a fixed canvas. */
function fixedUnset(canvas: FixedCanvas, x: number, y: number): void {
	if (!(x >= 0 && x < canvas.width && y >= 0 && y < canvas.height)) return;
	const fx = Math.floor(x);
	const fy = Math.floor(y);
	const nx = Math.floor(fx / 2);
	const ny = Math.floor(fy / 4);
	const coord = nx + (canvas.width / 2) * ny;
	const mask = PIXEL_MAP[fy % 4]?.[fx % 2];
	if (mask === undefined) return;
	const val = canvas.content[coord];
	if (val === undefined) return;
	canvas.content[coord] = val & ~mask;
}

/** Toggle a pixel on a fixed canvas. */
function fixedToggle(canvas: FixedCanvas, x: number, y: number): void {
	if (!(x >= 0 && x < canvas.width && y >= 0 && y < canvas.height)) return;
	const fx = Math.floor(x);
	const fy = Math.floor(y);
	const nx = Math.floor(fx / 2);
	const ny = Math.floor(fy / 4);
	const coord = nx + (canvas.width / 2) * ny;
	const mask = PIXEL_MAP[fy % 4]?.[fx % 2];
	if (mask === undefined) return;
	const val = canvas.content[coord];
	if (val === undefined) return;
	canvas.content[coord] = val ^ mask;
}

/** Get the state of a pixel on a fixed canvas. */
function fixedGet(canvas: FixedCanvas, x: number, y: number): boolean {
	if (!(x >= 0 && x < canvas.width && y >= 0 && y < canvas.height))
		return false;
	const fx = Math.floor(x);
	const fy = Math.floor(y);
	const nx = Math.floor(fx / 2);
	const ny = Math.floor(fy / 4);
	const coord = nx + (canvas.width / 2) * ny;
	const mask = PIXEL_MAP[fy % 4]?.[fx % 2];
	if (mask === undefined) return false;
	const val = canvas.content[coord];
	if (val === undefined) return false;
	return (val & mask) !== 0;
}

/** Render a fixed canvas as a string. */
function fixedFrame(canvas: FixedCanvas, delimiter = '\n'): string {
	const frameWidth = canvas.width / 2;
	const parts: string[] = [];

	for (let i = 0; i < canvas.content.length; i++) {
		if (i % frameWidth === 0) {
			parts.push(delimiter);
		}
		const val = canvas.content[i];
		parts.push(val ? String.fromCharCode(BRAILLE_OFFSET + val) : ' ');
	}
	parts.push(delimiter);

	return parts.join('');
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
	// Constants
	BRAILLE_OFFSET,
	PIXEL_MAP,
	DOT_MASKS,
	// Types
	type AnimateOptions,
	type Canvas,
	type CanvasChars,
	type CellValue,
	type CreateCanvasOptions,
	type DotPattern,
	type FixedCanvas,
	type FrameBounds,
	type FrameGenerator,
	type Point,
	type TerminalSize,
	type TurtleState,
	// Coordinate helpers
	normalize,
	getPos,
	// Terminal
	getTerminalSize,
	// Braille builders
	braille,
	brailleDots,
	brailleIcon,
	brailleGrid,
	// Sparse canvas
	createCanvas,
	clear,
	set,
	unset,
	toggle,
	get,
	setText,
	rows,
	frame,
	// Animation
	animate,
	// Drawing utilities
	line,
	polygon,
	// Turtle
	createTurtle,
	turtleUp,
	turtleDown,
	turtleMove,
	turtleForward,
	turtleBack,
	turtleRight,
	turtleLeft,
	// Fixed canvas
	createFixedCanvas,
	fixedClear,
	fixedSet,
	fixedUnset,
	fixedToggle,
	fixedGet,
	fixedFrame,
};
