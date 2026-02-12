/**
 * Braille status indicators with colored labels.
 * Small braille icons next to colored text — exactly like the reference image.
 * Run: npx tsx examples/spinners.ts
 */

import {createCanvas, frame, set} from '../src/index.js';

// ANSI color helpers
const yellow = (s: string): string => `\x1b[33m${s}\x1b[0m`;
const green = (s: string): string => `\x1b[32m${s}\x1b[0m`;
const cyan = (s: string): string => `\x1b[36m${s}\x1b[0m`;

// Build a single-line braille icon from pixels in a 4x4 grid (2 braille chars wide, 1 row tall)
function brailleIcon(
	pixels: readonly (readonly [number, number])[],
): string {
	const c = createCanvas();
	for (const [x, y] of pixels) {
		set(c, x, y);
	}
	return frame(c);
}

// Icon 1 — sparse ascending diagonal (thin line ↗)
// Matches "Connection issues" in the reference
const icon1 = brailleIcon([
	[0, 3],
	[1, 2],
	[2, 1],
	[3, 0],
]);

// Icon 2 — medium ascending diagonal (thicker ↗)
// Matches "Write" in the reference
const icon2 = brailleIcon([
	[0, 3],
	[0, 2],
	[1, 2],
	[1, 1],
	[2, 1],
	[2, 0],
	[3, 0],
]);

// Icon 3 — dense filled ascending triangle
// Matches "Read" in the reference
const icon3 = brailleIcon([
	[0, 3],
	[0, 2],
	[0, 1],
	[1, 3],
	[1, 2],
	[1, 1],
	[1, 0],
	[2, 3],
	[2, 2],
	[2, 1],
	[2, 0],
	[3, 3],
	[3, 2],
	[3, 1],
	[3, 0],
]);

const output = [
	'',
	`  ${icon1} ${yellow('Connection issues')}`,
	'',
	'',
	`  ${icon2} ${green('Write')}`,
	'',
	'',
	`  ${icon3} ${cyan('Read')}`,
	'',
].join('\n');

console.log(output);
