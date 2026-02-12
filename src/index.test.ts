import {describe, expect, it} from 'vitest';
import {
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
	set,
	setText,
	toggle,
	turtleDown,
	turtleForward,
	turtleLeft,
	turtleMove,
	turtleRight,
	turtleUp,
	unset,
} from './index.js';

// ---------------------------------------------------------------------------
// normalize
// ---------------------------------------------------------------------------

describe('normalize', () => {
	it('returns integers unchanged', () => {
		expect(normalize(5)).toBe(5);
		expect(normalize(0)).toBe(0);
		expect(normalize(-3)).toBe(-3);
	});

	it('rounds floats to nearest integer', () => {
		expect(normalize(1.4)).toBe(1);
		expect(normalize(1.5)).toBe(2);
		expect(normalize(1.6)).toBe(2);
		expect(normalize(-0.6)).toBe(-1);
	});
});

// ---------------------------------------------------------------------------
// braille
// ---------------------------------------------------------------------------

describe('braille', () => {
	it('returns blank braille for all dots off', () => {
		expect(
			braille([false, false, false, false, false, false, false, false]),
		).toBe('\u2800');
	});

	it('returns full braille for all dots on', () => {
		expect(braille([true, true, true, true, true, true, true, true])).toBe(
			'\u28ff',
		);
	});

	it('turns on dot 1 only', () => {
		expect(
			braille([true, false, false, false, false, false, false, false]),
		).toBe('\u2801');
	});

	it('turns on dot 4 only', () => {
		expect(
			braille([false, false, false, true, false, false, false, false]),
		).toBe('\u2808');
	});

	it('turns on dots 2 and 4 (off, on, off, on, ...)', () => {
		expect(
			braille([false, true, false, true, false, false, false, false]),
		).toBe('\u280a');
	});

	it('turns on left column only (dots 1,2,3,7)', () => {
		expect(
			braille([true, true, true, false, false, false, true, false]),
		).toBe('\u2847');
	});

	it('turns on right column only (dots 4,5,6,8)', () => {
		expect(
			braille([false, false, false, true, true, true, false, true]),
		).toBe('\u28b8');
	});
});

// ---------------------------------------------------------------------------
// brailleDots
// ---------------------------------------------------------------------------

describe('brailleDots', () => {
	it('returns blank braille for no dots', () => {
		expect(brailleDots()).toBe('\u2800');
	});

	it('returns full braille for all 8 dots', () => {
		expect(brailleDots(1, 2, 3, 4, 5, 6, 7, 8)).toBe('\u28ff');
	});

	it('turns on single dot', () => {
		expect(brailleDots(1)).toBe('\u2801');
		expect(brailleDots(8)).toBe('\u2880');
	});

	it('turns on dots 2 and 4', () => {
		expect(brailleDots(2, 4)).toBe('\u280a');
	});

	it('ignores out-of-range dot numbers', () => {
		expect(brailleDots(0, 9, -1)).toBe('\u2800');
		expect(brailleDots(1, 0, 9)).toBe('\u2801');
	});

	it('handles duplicate dot numbers', () => {
		expect(brailleDots(1, 1, 1)).toBe('\u2801');
	});
});

// ---------------------------------------------------------------------------
// brailleIcon
// ---------------------------------------------------------------------------

describe('brailleIcon', () => {
	it('returns empty string for no arguments', () => {
		expect(brailleIcon()).toBe('');
	});

	it('returns empty string for more than 3 characters', () => {
		expect(brailleIcon([1], [2], [3], [4])).toBe('');
	});

	it('builds a single character icon', () => {
		expect(brailleIcon([1, 4])).toBe('\u2809');
	});

	it('builds a 2-character icon', () => {
		// Left column bar + right column bar
		const result = brailleIcon([1, 2, 3, 7], [4, 5, 6, 8]);
		expect(result).toBe('\u2847\u28b8');
		expect(result.length).toBe(2);
	});

	it('builds a 3-character icon', () => {
		const result = brailleIcon([1], [1, 8], [1]);
		expect(result.length).toBe(3);
		expect(result).toBe('\u2801\u2881\u2801');
	});

	it('handles empty dot arrays as blank braille', () => {
		expect(brailleIcon([])).toBe('\u2800');
		expect(brailleIcon([], [1])).toBe('\u2800\u2801');
	});

	it('ignores out-of-range dot numbers', () => {
		expect(brailleIcon([0, 9, 1])).toBe('\u2801');
	});
});

// ---------------------------------------------------------------------------
// brailleGrid
// ---------------------------------------------------------------------------

describe('brailleGrid', () => {
	it('returns blank for all-zero grid', () => {
		expect(
			brailleGrid([
				[0, 0],
				[0, 0],
				[0, 0],
				[0, 0],
			]),
		).toBe('\u2800');
	});

	it('returns full braille for all-one 2x4 grid', () => {
		expect(
			brailleGrid([
				[1, 1],
				[1, 1],
				[1, 1],
				[1, 1],
			]),
		).toBe('\u28ff');
	});

	it('maps top-left pixel to dot 1', () => {
		expect(
			brailleGrid([
				[1, 0],
				[0, 0],
				[0, 0],
				[0, 0],
			]),
		).toBe('\u2801');
	});

	it('maps top-right pixel to dot 4', () => {
		expect(
			brailleGrid([
				[0, 1],
				[0, 0],
				[0, 0],
				[0, 0],
			]),
		).toBe('\u2808');
	});

	it('maps bottom-left pixel to dot 7', () => {
		expect(
			brailleGrid([
				[0, 0],
				[0, 0],
				[0, 0],
				[1, 0],
			]),
		).toBe('\u2840');
	});

	it('maps bottom-right pixel to dot 8', () => {
		expect(
			brailleGrid([
				[0, 0],
				[0, 0],
				[0, 0],
				[0, 1],
			]),
		).toBe('\u2880');
	});

	it('builds a 2-character wide icon from 4-column grid', () => {
		// Left bar | right bar
		const result = brailleGrid([
			[1, 0, 0, 1],
			[1, 0, 0, 1],
			[1, 0, 0, 1],
			[1, 0, 0, 1],
		]);
		expect(result.length).toBe(2);
		expect(result).toBe('\u2847\u28b8');
	});

	it('builds a 3-character wide icon from 6-column grid', () => {
		const result = brailleGrid([
			[1, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
		]);
		expect(result.length).toBe(3);
		// char 0: dot 1, char 1: blank, char 2: dot 4
		expect(result).toBe('\u2801\u2800\u2808');
	});

	it('handles ragged rows by treating missing cols as 0', () => {
		const result = brailleGrid([[1, 1, 1, 1], [1], [1, 1], [1, 1, 1]]);
		expect(result.length).toBe(2);
	});

	it('clamps to max 4 rows', () => {
		const result = brailleGrid([
			[1, 1],
			[1, 1],
			[1, 1],
			[1, 1],
			[1, 1], // row 5 — ignored
		]);
		expect(result).toBe('\u28ff');
	});

	it('clamps to max 6 columns', () => {
		const result = brailleGrid([
			[1, 1, 1, 1, 1, 1, 1, 1], // cols 7-8 ignored
		]);
		expect(result.length).toBe(3);
	});

	it('handles empty grid', () => {
		expect(brailleGrid([])).toBe('');
	});
});

// ---------------------------------------------------------------------------
// getPos
// ---------------------------------------------------------------------------

describe('getPos', () => {
	it('converts pixel coords to cell coords', () => {
		expect(getPos(0, 0)).toEqual([0, 0]);
		expect(getPos(1, 0)).toEqual([0, 0]);
		expect(getPos(2, 0)).toEqual([1, 0]);
		expect(getPos(0, 4)).toEqual([0, 1]);
		expect(getPos(3, 7)).toEqual([1, 1]);
	});
});

// ---------------------------------------------------------------------------
// Canvas: set
// ---------------------------------------------------------------------------

describe('set', () => {
	it('sets a pixel at (0,0)', () => {
		const c = createCanvas();
		set(c, 0, 0);
		const rowMap = c.chars.get(0);
		expect(rowMap).toBeDefined();
		expect(rowMap?.get(0)).toBe(1);
	});

	it('sets multiple pixels in same cell', () => {
		const c = createCanvas();
		set(c, 0, 0);
		set(c, 0, 1);
		const rowMap = c.chars.get(0);
		expect(rowMap?.get(0)).toBe(0x01 | 0x02);
	});

	it('sets pixel in right column of cell', () => {
		const c = createCanvas();
		set(c, 1, 0);
		const rowMap = c.chars.get(0);
		expect(rowMap?.get(0)).toBe(0x08);
	});
});

// ---------------------------------------------------------------------------
// Canvas: unset
// ---------------------------------------------------------------------------

describe('unset', () => {
	it('unsets a pixel leaving empty canvas', () => {
		const c = createCanvas();
		set(c, 1, 1);
		unset(c, 1, 1);
		expect(c.chars.size).toBe(0);
	});

	it('unsets one pixel, keeps others in same cell', () => {
		const c = createCanvas();
		set(c, 0, 0);
		set(c, 0, 1);
		unset(c, 0, 1);
		const rowMap = c.chars.get(0);
		expect(rowMap?.get(0)).toBe(1);
	});

	it('does nothing on empty canvas', () => {
		const c = createCanvas();
		unset(c, 5, 5);
		expect(c.chars.size).toBe(0);
	});
});

// ---------------------------------------------------------------------------
// Canvas: toggle
// ---------------------------------------------------------------------------

describe('toggle', () => {
	it('toggles on then off', () => {
		const c = createCanvas();
		toggle(c, 0, 0);
		expect(c.chars.get(0)?.get(0)).toBe(1);
		toggle(c, 0, 0);
		expect(c.chars.size).toBe(0);
	});

	it('toggles independent pixels in same cell', () => {
		const c = createCanvas();
		toggle(c, 0, 0);
		toggle(c, 1, 0);
		expect(c.chars.get(0)?.get(0)).toBe(0x01 | 0x08);
		toggle(c, 0, 0);
		expect(c.chars.get(0)?.get(0)).toBe(0x08);
	});
});

// ---------------------------------------------------------------------------
// Canvas: clear
// ---------------------------------------------------------------------------

describe('clear', () => {
	it('removes all pixels', () => {
		const c = createCanvas();
		set(c, 1, 1);
		set(c, 10, 10);
		clear(c);
		expect(c.chars.size).toBe(0);
	});
});

// ---------------------------------------------------------------------------
// Canvas: get
// ---------------------------------------------------------------------------

describe('get', () => {
	it('returns false for empty canvas', () => {
		const c = createCanvas();
		expect(get(c, 0, 0)).toBe(false);
	});

	it('returns true for set pixel', () => {
		const c = createCanvas();
		set(c, 0, 0);
		expect(get(c, 0, 0)).toBe(true);
	});

	it('returns false for adjacent unset pixels', () => {
		const c = createCanvas();
		set(c, 0, 0);
		expect(get(c, 0, 1)).toBe(false);
		expect(get(c, 1, 0)).toBe(false);
		expect(get(c, 1, 1)).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// Canvas: setText
// ---------------------------------------------------------------------------

describe('setText', () => {
	it('sets text and renders it in frame', () => {
		const c = createCanvas();
		setText(c, 0, 0, 'asdf');
		expect(frame(c)).toBe('asdf');
	});

	it('sets text across multiple cells', () => {
		const c = createCanvas();
		setText(c, 0, 0, 'hi');
		expect(frame(c)).toBe('hi');
	});
});

// ---------------------------------------------------------------------------
// Canvas: frame
// ---------------------------------------------------------------------------

describe('frame', () => {
	it('returns empty string for empty canvas', () => {
		const c = createCanvas();
		expect(frame(c)).toBe('');
	});

	it('renders single pixel at (0,0) as braille dot-1', () => {
		const c = createCanvas();
		set(c, 0, 0);
		expect(frame(c)).toBe('\u2801');
	});

	it('renders pixel at (1,0) as braille dot-4', () => {
		const c = createCanvas();
		set(c, 1, 0);
		expect(frame(c)).toBe('\u2808');
	});

	it('renders all 8 dots in a cell', () => {
		const c = createCanvas();
		for (let x = 0; x < 2; x++) {
			for (let y = 0; y < 4; y++) {
				set(c, x, y);
			}
		}
		expect(frame(c)).toBe('\u28ff');
	});

	it('respects custom line ending', () => {
		const c = createCanvas({lineEnding: '\r\n'});
		set(c, 0, 0);
		set(c, 0, 4);
		const f = frame(c);
		expect(f).toContain('\r\n');
	});
});

// ---------------------------------------------------------------------------
// Canvas: frame with bounds
// ---------------------------------------------------------------------------

describe('frame with bounds', () => {
	it('returns empty when minX excludes all pixels', () => {
		const c = createCanvas();
		set(c, 0, 0);
		expect(frame(c, {minX: 2})).toBe('');
	});

	it('returns empty when maxX excludes all pixels', () => {
		const c = createCanvas();
		set(c, 0, 0);
		expect(frame(c, {maxX: 0})).toBe('');
	});

	it('clips rendering to bounds', () => {
		const c = createCanvas();
		set(c, 0, 0);
		set(c, 10, 10);
		const f = frame(c, {minX: 0, minY: 0, maxX: 2, maxY: 4});
		expect(f).toBe('\u2801');
	});
});

// ---------------------------------------------------------------------------
// line
// ---------------------------------------------------------------------------

describe('line', () => {
	it('generates single pixel for same start/end', () => {
		const pts = [...line(0, 0, 0, 0)];
		expect(pts).toEqual([{x: 0, y: 0}]);
	});

	it('generates horizontal line', () => {
		const pts = [...line(0, 0, 1, 0)];
		expect(pts).toEqual([
			{x: 0, y: 0},
			{x: 1, y: 0},
		]);
	});

	it('generates vertical line', () => {
		const pts = [...line(0, 0, 0, 1)];
		expect(pts).toEqual([
			{x: 0, y: 0},
			{x: 0, y: 1},
		]);
	});

	it('generates diagonal line', () => {
		const pts = [...line(0, 0, 1, 1)];
		expect(pts).toEqual([
			{x: 0, y: 0},
			{x: 1, y: 1},
		]);
	});

	it('generates reverse direction line', () => {
		const pts = [...line(3, 0, 0, 0)];
		expect(pts.length).toBe(4);
		expect(pts[0]).toEqual({x: 3, y: 0});
		expect(pts[3]).toEqual({x: 0, y: 0});
	});

	it('draws on canvas correctly', () => {
		const c = createCanvas();
		for (const pt of line(0, 0, 3, 0)) {
			set(c, pt.x, pt.y);
		}
		expect(get(c, 0, 0)).toBe(true);
		expect(get(c, 1, 0)).toBe(true);
		expect(get(c, 2, 0)).toBe(true);
		expect(get(c, 3, 0)).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// polygon
// ---------------------------------------------------------------------------

describe('polygon', () => {
	it('generates points for a square', () => {
		const pts = [...polygon(0, 0, 4, 4)];
		expect(pts.length).toBeGreaterThan(0);
	});

	it('generates points for a triangle', () => {
		const pts = [...polygon(0, 0, 3, 10)];
		expect(pts.length).toBeGreaterThan(0);
	});
});

// ---------------------------------------------------------------------------
// Turtle
// ---------------------------------------------------------------------------

describe('turtle', () => {
	it('starts at given position', () => {
		const t = createTurtle();
		expect(t.posX).toBe(0);
		expect(t.posY).toBe(0);
	});

	it('tracks position after move', () => {
		const t = createTurtle();
		turtleMove(t, 1, 1);
		expect(t.posX).toBe(1);
		expect(t.posY).toBe(1);
	});

	it('tracks rotation', () => {
		const t = createTurtle();
		expect(t.rotation).toBe(0);
		turtleRight(t, 30);
		expect(t.rotation).toBe(30);
		turtleLeft(t, 30);
		expect(t.rotation).toBe(0);
	});

	it('draws when brush is down', () => {
		const t = createTurtle();
		expect(get(t.canvas, 0, 0)).toBe(false);
		turtleForward(t, 1);
		expect(get(t.canvas, 0, 0)).toBe(true);
		expect(get(t.canvas, t.posX, t.posY)).toBe(true);
	});

	it('does not draw when brush is up', () => {
		const t = createTurtle();
		turtleUp(t);
		turtleMove(t, 2, 0);
		expect(get(t.canvas, t.posX, t.posY)).toBe(false);
	});

	it('resumes drawing after brush down', () => {
		const t = createTurtle();
		turtleUp(t);
		turtleMove(t, 2, 0);
		turtleDown(t);
		turtleMove(t, 3, 0);
		expect(get(t.canvas, 3, 0)).toBe(true);
	});

	it('renders a frame', () => {
		const t = createTurtle();
		turtleForward(t, 2);
		const f = frame(t.canvas);
		expect(f.length).toBeGreaterThan(0);
	});
});

// ---------------------------------------------------------------------------
// FixedCanvas
// ---------------------------------------------------------------------------

describe('fixedCanvas', () => {
	it('creates with correct dimensions', () => {
		const c = createFixedCanvas(160, 160);
		expect(c.width).toBe(160);
		expect(c.height).toBe(160);
		expect(c.content.length).toBe((160 * 160) / 8);
	});

	it('rounds dimensions to multiples', () => {
		const c = createFixedCanvas(161, 163);
		expect(c.width).toBe(160);
		expect(c.height).toBe(160);
	});

	it('sets and gets pixels', () => {
		const c = createFixedCanvas(10, 8);
		expect(fixedGet(c, 0, 0)).toBe(false);
		fixedSet(c, 0, 0);
		expect(fixedGet(c, 0, 0)).toBe(true);
		expect(fixedGet(c, 1, 0)).toBe(false);
	});

	it('unsets pixels', () => {
		const c = createFixedCanvas(10, 8);
		fixedSet(c, 0, 0);
		fixedUnset(c, 0, 0);
		expect(fixedGet(c, 0, 0)).toBe(false);
	});

	it('toggles pixels', () => {
		const c = createFixedCanvas(10, 8);
		fixedToggle(c, 0, 0);
		expect(fixedGet(c, 0, 0)).toBe(true);
		fixedToggle(c, 0, 0);
		expect(fixedGet(c, 0, 0)).toBe(false);
	});

	it('ignores out-of-bounds', () => {
		const c = createFixedCanvas(10, 8);
		fixedSet(c, -1, 0);
		fixedSet(c, 100, 0);
		fixedSet(c, 0, -1);
		fixedSet(c, 0, 100);
		expect(fixedGet(c, -1, 0)).toBe(false);
	});

	it('clears all pixels', () => {
		const c = createFixedCanvas(10, 8);
		fixedSet(c, 0, 0);
		fixedSet(c, 2, 4);
		fixedClear(c);
		expect(fixedGet(c, 0, 0)).toBe(false);
		expect(fixedGet(c, 2, 4)).toBe(false);
	});

	it('renders frame with braille characters', () => {
		const c = createFixedCanvas(4, 4);
		fixedSet(c, 0, 0);
		const f = fixedFrame(c);
		expect(f).toContain('\u2801');
	});

	it('renders frame with custom delimiter', () => {
		const c = createFixedCanvas(4, 8);
		fixedSet(c, 0, 0);
		const f = fixedFrame(c, '|');
		expect(f).toContain('|');
	});
});

// ---------------------------------------------------------------------------
// getTerminalSize
// ---------------------------------------------------------------------------

describe('getTerminalSize', () => {
	it('returns width and height numbers', () => {
		const size = getTerminalSize();
		expect(typeof size.width).toBe('number');
		expect(typeof size.height).toBe('number');
		expect(size.width).toBeGreaterThan(0);
		expect(size.height).toBeGreaterThan(0);
	});
});

// ---------------------------------------------------------------------------
// animate
// ---------------------------------------------------------------------------

describe('animate', () => {
	it('runs frames from generator and can be aborted', async () => {
		const c = createCanvas();
		const controller = new AbortController();
		let frameCount = 0;

		function* gen(): Generator<readonly {x: number; y: number}[]> {
			for (let i = 0; i < 100; i++) {
				frameCount++;
				if (frameCount >= 3) controller.abort();
				yield [{x: i, y: 0}];
			}
		}

		await animate(c, gen, {delay: 0, signal: controller.signal});
		expect(frameCount).toBe(3);
	});
});
