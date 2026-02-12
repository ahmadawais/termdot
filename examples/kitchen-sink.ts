/**
 * Kitchen sink — demonstrates every feature of btui in one file.
 * Run: npx tsx examples/kitchen-sink.ts
 */

import {
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
	line,
	polygon,
	set,
	setText,
	toggle,
	turtleDown,
	turtleForward,
	turtleLeft,
	turtleRight,
	turtleUp,
	unset,
} from '../src/index.js';

function separator(title: string): void {
	console.log(`\n${'='.repeat(60)}`);
	console.log(`  ${title}`);
	console.log(`${'='.repeat(60)}\n`);
}

// ── 1. Sparse Canvas: set/unset/toggle/get ──────────────────────────────

separator('1. Sparse Canvas — set, unset, toggle, get');

const c = createCanvas();

// Draw a small filled rectangle
for (let x = 0; x < 20; x++) {
	for (let y = 0; y < 12; y++) {
		set(c, x, y);
	}
}

// Punch a hole in the middle with unset
for (let x = 6; x < 14; x++) {
	for (let y = 4; y < 8; y++) {
		unset(c, x, y);
	}
}

// Toggle a checkerboard pattern next to it
for (let x = 24; x < 44; x++) {
	for (let y = 0; y < 12; y++) {
		if ((x + y) % 2 === 0) {
			toggle(c, x, y);
		}
	}
}

console.log(frame(c));
console.log(`\nPixel (0,0) is set: ${get(c, 0, 0)}`);
console.log(`Pixel (8,5) is set (hole): ${get(c, 8, 5)}`);

// ── 2. setText ──────────────────────────────────────────────────────────

separator('2. setText — mix text with braille');

clear(c);
setText(c, 0, 0, 'Hello btui!');
for (let x = 0; x < 90; x++) {
	set(c, x, 4 + Math.round(Math.sin((x * Math.PI) / 15) * 3));
}
console.log(frame(c));

// ── 3. Lines ────────────────────────────────────────────────────────────

separator('3. Line drawing');

clear(c);
// Fan of lines from origin
for (let angle = 0; angle < 180; angle += 15) {
	const rad = (angle * Math.PI) / 180;
	const endX = Math.round(Math.cos(rad) * 40);
	const endY = Math.round(Math.sin(rad) * 20);
	for (const pt of line(0, 20, endX, 20 + endY)) {
		set(c, pt.x, pt.y);
	}
}
console.log(frame(c));

// ── 4. Polygons ─────────────────────────────────────────────────────────

separator('4. Polygon — triangle, pentagon, hexagon');

clear(c);
// Triangle
for (const pt of polygon(10, 10, 3, 16)) {
	set(c, pt.x + 10, pt.y + 10);
}
// Pentagon
for (const pt of polygon(10, 10, 5, 16)) {
	set(c, pt.x + 40, pt.y + 10);
}
// Hexagon
for (const pt of polygon(10, 10, 6, 16)) {
	set(c, pt.x + 70, pt.y + 10);
}
console.log(frame(c));

// ── 5. Sine waves ───────────────────────────────────────────────────────

separator('5. Sine + cosine overlay');

clear(c);
for (let x = 0; x < 1800; x += 5) {
	set(c, x / 10, 10 + Math.sin((x * Math.PI) / 180) * 10);
	set(c, x / 10, 10 + Math.cos((x * Math.PI) / 180) * 10);
}
console.log(frame(c));

// ── 6. Turtle graphics ─────────────────────────────────────────────────

separator('6. Turtle — spirograph');

const t = createTurtle();
for (let i = 0; i < 36; i++) {
	turtleRight(t, 10);
	for (let j = 0; j < 36; j++) {
		turtleRight(t, 10);
		turtleForward(t, 8);
	}
}
console.log(frame(t.canvas));

// ── 7. Turtle — pen up/down ────────────────────────────────────────────

separator('7. Turtle — pen up/down, dashed line');

const t2 = createTurtle();
for (let i = 0; i < 20; i++) {
	if (i % 2 === 0) {
		turtleDown(t2);
	} else {
		turtleUp(t2);
	}
	turtleForward(t2, 5);
}
// Move down and draw backward
turtleDown(t2);
turtleLeft(t2, 90);
turtleForward(t2, 10);
turtleLeft(t2, 90);
turtleForward(t2, 50);
console.log(frame(t2.canvas));

// ── 8. Frame with bounds ────────────────────────────────────────────────

separator('8. Frame with bounds (clipping)');

clear(c);
for (let x = 0; x < 100; x++) {
	set(c, x, Math.round(Math.sin((x * Math.PI) / 20) * 10 + 10));
}
console.log('Full:');
console.log(frame(c));
console.log('\nClipped to x=[20..60], y=[0..20]:');
console.log(frame(c, {minX: 20, maxX: 60, minY: 0, maxY: 20}));

// ── 9. Fixed-size canvas ────────────────────────────────────────────────

separator('9. Fixed-size canvas — fast buffer-backed');

const fc = createFixedCanvas(80, 32);

// Draw a border
for (let x = 0; x < 80; x++) {
	fixedSet(fc, x, 0);
	fixedSet(fc, x, 31);
}
for (let y = 0; y < 32; y++) {
	fixedSet(fc, 0, y);
	fixedSet(fc, 79, y);
}

// Draw an X
for (let i = 0; i < 32; i++) {
	fixedSet(fc, Math.round((i / 32) * 80), i);
	fixedSet(fc, 80 - Math.round((i / 32) * 80), i);
}

console.log(fixedFrame(fc));

// Toggle some pixels
for (let x = 20; x < 60; x += 2) {
	fixedToggle(fc, x, 16);
}

// Unset part of the border
for (let x = 30; x < 50; x++) {
	fixedUnset(fc, x, 0);
}

console.log('After toggle + unset:');
console.log(fixedFrame(fc));
console.log(`Pixel (0,0) set: ${fixedGet(fc, 0, 0)}`);
console.log(`Pixel (40,0) set (unset part): ${fixedGet(fc, 40, 0)}`);

// ── 10. Fixed canvas clear ─────────────────────────────────────────────

separator('10. Fixed canvas — clear');
fixedClear(fc);
fixedSet(fc, 40, 16);
console.log('Single dot after clear:');
console.log(fixedFrame(fc));

separator('Done — all btui features demonstrated!');
