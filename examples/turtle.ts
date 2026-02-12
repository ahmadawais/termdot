/**
 * Turtle graphics example — nested circles forming a spirograph.
 * Run: npx tsx examples/turtle.ts
 */

import {createTurtle, frame, turtleForward, turtleRight} from '../src/index.js';

const t = createTurtle();

for (let i = 0; i < 36; i++) {
	turtleRight(t, 10);
	for (let j = 0; j < 36; j++) {
		turtleRight(t, 10);
		turtleForward(t, 8);
	}
}

console.log(frame(t.canvas));
