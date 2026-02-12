/**
 * Braille clock — renders an analog clock in the terminal.
 * Run: npx tsx examples/clock.ts
 *
 * Uses the fixed-size canvas for consistent layout.
 */

import {
	createFixedCanvas,
	fixedClear,
	fixedFrame,
	fixedSet,
	line,
} from '../src/index.js';

const c = createFixedCanvas(160, 160);

function sinPos(i: number, len: number): number {
	return Math.floor(Math.sin(i * 2 * Math.PI) * len + 80);
}

function cosPos(i: number, len: number): number {
	return Math.floor(Math.cos(i * 2 * Math.PI) * len + 80);
}

function drawHand(x1: number, y1: number, x2: number, y2: number): void {
	for (const pt of line(x1, y1, x2, y2)) {
		fixedSet(c, pt.x, pt.y);
	}
}

function draw(): void {
	fixedClear(c);
	const t = new Date();

	// Hour hand
	const h = t.getHours() / 12;
	drawHand(80, 80, sinPos(h, 30), 160 - cosPos(h, 30));

	// Minute hand
	const m = t.getMinutes() / 60;
	drawHand(80, 80, sinPos(m, 50), 160 - cosPos(m, 50));

	// Second hand (smooth)
	const s = t.getSeconds() / 60 + t.getMilliseconds() / 60000;
	drawHand(80, 80, sinPos(s, 75), 160 - cosPos(s, 75));

	process.stdout.write(fixedFrame(c));
}

setInterval(draw, 1000 / 24);
