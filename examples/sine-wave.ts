/**
 * Animated sine wave tracking — a line sweeps while a sine wave oscillates.
 * Run: npx tsx examples/sine-wave.ts
 */

import {
	createFixedCanvas,
	fixedClear,
	fixedFrame,
	fixedSet,
	line,
} from '../src/index.js';

const width = 180;
const height = 80;
const c = createFixedCanvas(width, height);
let i = 0;

function draw(): void {
	fixedClear(c);

	const half = height / 2;

	// Sweeping line
	const endY = Math.sin((i * Math.PI) / 180) * half + half;
	for (const pt of line(0, half, width, Math.round(endY))) {
		fixedSet(c, pt.x, pt.y);
	}

	// Sine wave
	for (let x = 0; x < 360; x += 2) {
		const px = (x / 360) * width;
		const py = half + Math.sin(((x + i) * Math.PI) / 180) * half;
		fixedSet(c, px, py);
	}

	process.stdout.write(fixedFrame(c));
	i += 2;
}

setInterval(draw, 1000 / 60);
