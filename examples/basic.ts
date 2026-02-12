/**
 * Basic example — sine waves, filled rectangles, and toggles.
 * Run: npx tsx examples/basic.ts
 */

import {clear, createCanvas, frame, set, toggle} from '../src/index.js';

const c = createCanvas();

// Sine wave
for (let x = 0; x < 1800; x++) {
	set(c, x / 10, Math.sin((x * Math.PI) / 180) * 10);
}
console.log(frame(c));

clear(c);

// Sine + cosine
for (let x = 0; x < 1800; x += 10) {
	set(c, x / 10, 10 + Math.sin((x * Math.PI) / 180) * 10);
	set(c, x / 10, 10 + Math.cos((x * Math.PI) / 180) * 10);
}
console.log(frame(c));

clear(c);

// Compact sine
for (let x = 0; x < 3600; x += 20) {
	set(c, x / 20, 4 + Math.sin((x * Math.PI) / 180) * 4);
}
console.log(frame(c));

clear(c);

// Sine wave with filled + toggled rectangles
for (let x = 0; x < 360; x += 4) {
	set(c, x / 4, 30 + Math.sin((x * Math.PI) / 180) * 30);
}

for (let x = 0; x < 30; x++) {
	for (let y = 0; y < 30; y++) {
		set(c, x, y);
		toggle(c, x + 30, y + 30);
		toggle(c, x + 60, y);
	}
}
console.log(frame(c));
