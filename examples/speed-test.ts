/**
 * Speed test — benchmarks frame rendering at various canvas sizes.
 * Port of drawille/examples/speed_test.py
 * Run: npx tsx examples/speed-test.ts
 */

import {clear, createCanvas, frame, set} from '../src/index.js';

const c = createCanvas();
const frames = 10_000;

const sizes: readonly (readonly [number, number])[] = [
	[0, 0],
	[10, 10],
	[20, 20],
	[20, 40],
	[40, 20],
	[40, 40],
	[100, 100],
];

for (const [sx, sy] of sizes) {
	set(c, 0, 0);

	for (let i = 0; i < sy; i++) {
		set(c, sx, i);
	}

	const start = performance.now();
	for (let i = 0; i < frames; i++) {
		frame(c);
	}
	const elapsed = ((performance.now() - start) / 1000).toFixed(3);

	console.log(`${sx}x${sy}\t${elapsed}s`);
	clear(c);
}
