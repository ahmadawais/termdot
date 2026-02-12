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
declare const BRAILLE_OFFSET = 10240;
declare const PIXEL_MAP: readonly (readonly [number, number])[];
/** A single cell can hold a braille bitmask (number) or a text character (string). */
type CellValue = number | string;
/** Sparse row → col → cell storage. */
interface CanvasChars {
    readonly [row: number]: {
        readonly [col: number]: CellValue;
    } | undefined;
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
/** Normalize a coordinate to an integer. */
declare function normalize(coord: number): number;
/** Convert pixel (x, y) to cell (col, row). */
declare function getPos(x: number, y: number): readonly [number, number];
/** Create a new braille canvas. */
declare function createCanvas(options?: CreateCanvasOptions): Canvas;
/** Remove all pixels from the canvas. */
declare function clear(canvas: Canvas): void;
/** Set (draw) a pixel at (x, y). */
declare function set(canvas: Canvas, x: number, y: number): void;
/** Unset (erase) a pixel at (x, y). */
declare function unset(canvas: Canvas, x: number, y: number): void;
/** Toggle a pixel at (x, y). */
declare function toggle(canvas: Canvas, x: number, y: number): void;
/** Get the state of a pixel at (x, y). Returns true if set. */
declare function get(canvas: Canvas, x: number, y: number): boolean;
/** Set text at the given pixel coords. Each character occupies one cell column. */
declare function setText(canvas: Canvas, x: number, y: number, text: string): void;
/** Return the canvas content as an array of strings (one per row). */
declare function rows(canvas: Canvas, bounds?: FrameBounds): readonly string[];
/** Render the canvas as a string. */
declare function frame(canvas: Canvas, bounds?: FrameBounds): string;
/** Generate coordinates along a line from (x1, y1) to (x2, y2) using Bresenham-style interpolation. */
declare function line(x1: number, y1: number, x2: number, y2: number): Generator<Point, void, unknown>;
/** Generate coordinates for a regular polygon. */
declare function polygon(centerX?: number, centerY?: number, sides?: number, radius?: number): Generator<Point, void, unknown>;
/** Create a new turtle state. */
declare function createTurtle(posX?: number, posY?: number): TurtleState;
/** Pull the brush up (stop drawing on move). */
declare function turtleUp(t: TurtleState): void;
/** Push the brush down (draw on move). */
declare function turtleDown(t: TurtleState): void;
/** Move the turtle to an absolute position, drawing if the brush is down. */
declare function turtleMove(t: TurtleState, x: number, y: number): void;
/** Move the turtle forward by `step` pixels in its current direction. */
declare function turtleForward(t: TurtleState, step: number): void;
/** Move the turtle backward by `step` pixels. */
declare function turtleBack(t: TurtleState, step: number): void;
/** Rotate the turtle right (clockwise) by `angle` degrees. */
declare function turtleRight(t: TurtleState, angle: number): void;
/** Rotate the turtle left (counter-clockwise) by `angle` degrees. */
declare function turtleLeft(t: TurtleState, angle: number): void;
/** Terminal dimensions in characters. */
interface TerminalSize {
    readonly width: number;
    readonly height: number;
}
/** Get terminal width and height. Falls back to 80x25. */
declare function getTerminalSize(): TerminalSize;
/** Options for the animate function. */
interface AnimateOptions {
    readonly delay?: number;
    readonly signal?: AbortSignal;
}
/** Frame generator yields arrays of points per frame. */
type FrameGenerator = Generator<readonly Point[], void, unknown>;
/** Run an animation loop. Clears the canvas each frame, draws points from the generator, and writes to stdout. */
declare function animate(canvas: Canvas, fn: () => FrameGenerator, options?: AnimateOptions): Promise<void>;
/** A fixed-size canvas backed by a Uint8Array buffer. */
interface FixedCanvas {
    readonly width: number;
    readonly height: number;
    readonly content: Uint8Array;
}
/** Create a fixed-size canvas with the given dimensions. Width rounds to multiple of 2, height to multiple of 4. */
declare function createFixedCanvas(width: number, height: number): FixedCanvas;
/** Clear all pixels from a fixed canvas. */
declare function fixedClear(canvas: FixedCanvas): void;
/** Set a pixel on a fixed canvas. */
declare function fixedSet(canvas: FixedCanvas, x: number, y: number): void;
/** Unset a pixel on a fixed canvas. */
declare function fixedUnset(canvas: FixedCanvas, x: number, y: number): void;
/** Toggle a pixel on a fixed canvas. */
declare function fixedToggle(canvas: FixedCanvas, x: number, y: number): void;
/** Get the state of a pixel on a fixed canvas. */
declare function fixedGet(canvas: FixedCanvas, x: number, y: number): boolean;
/** Render a fixed canvas as a string. */
declare function fixedFrame(canvas: FixedCanvas, delimiter?: string): string;

export { type AnimateOptions, BRAILLE_OFFSET, type Canvas, type CanvasChars, type CellValue, type CreateCanvasOptions, type FixedCanvas, type FrameBounds, type FrameGenerator, PIXEL_MAP, type Point, type TerminalSize, type TurtleState, animate, clear, createCanvas, createFixedCanvas, createTurtle, fixedClear, fixedFrame, fixedGet, fixedSet, fixedToggle, fixedUnset, frame, get, getPos, getTerminalSize, line, normalize, polygon, rows, set, setText, toggle, turtleBack, turtleDown, turtleForward, turtleLeft, turtleMove, turtleRight, turtleUp, unset };
