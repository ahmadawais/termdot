# termdot

Draw in the terminal with Unicode braille characters (U+2800–U+28FF). Each character is a 2×4 pixel grid — giving you 8 dots per cell for high-resolution terminal graphics.

## Install

```sh
npm install termdot
```

## Usage

```ts
import {createCanvas, set, frame, line} from 'termdot';

const c = createCanvas();

// Draw a sine wave
for (let x = 0; x < 100; x++) {
  set(c, x, Math.sin(x / 10) * 10 + 10);
}

// Draw a line
for (const pt of line(0, 0, 50, 20)) {
  set(c, pt.x, pt.y);
}

console.log(frame(c));
```

## API

### Sparse Canvas

Auto-expanding canvas backed by a `Map`. Grows as you draw.

```ts
createCanvas(options?)     // Create a canvas
set(canvas, x, y)          // Draw a pixel
unset(canvas, x, y)        // Erase a pixel
toggle(canvas, x, y)       // Toggle a pixel
get(canvas, x, y)          // Check if pixel is set
clear(canvas)              // Clear all pixels
setText(canvas, x, y, str) // Overlay text at position
frame(canvas, bounds?)     // Render to string
rows(canvas, bounds?)      // Render to string[]
```

### Fixed Canvas

Fixed-size canvas backed by a `Uint8Array`. Fast, predictable bounds.

```ts
createFixedCanvas(width, height) // Create fixed canvas
fixedSet(canvas, x, y)           // Draw a pixel
fixedUnset(canvas, x, y)         // Erase a pixel
fixedToggle(canvas, x, y)        // Toggle a pixel
fixedGet(canvas, x, y)           // Check if pixel is set
fixedClear(canvas)               // Clear all pixels
fixedFrame(canvas, delimiter?)   // Render to string
```

### Drawing

```ts
line(x1, y1, x2, y2)                    // Line generator (Bresenham)
polygon(centerX, centerY, sides, radius) // Regular polygon generator
```

### Turtle Graphics

```ts
createTurtle(x?, y?)       // Create turtle at position
turtleForward(t, step)     // Move forward
turtleBack(t, step)        // Move backward
turtleRight(t, angle)      // Rotate clockwise
turtleLeft(t, angle)       // Rotate counter-clockwise
turtleUp(t)                // Lift brush (stop drawing)
turtleDown(t)              // Lower brush (start drawing)
turtleMove(t, x, y)        // Move to absolute position
```

### Utilities

```ts
getTerminalSize()                    // Get terminal {width, height}
animate(canvas, generator, options?) // Run animation loop
normalize(coord)                     // Round to nearest int
getPos(x, y)                        // Pixel → cell coords
```

## Braille Dot Layout

Each character cell maps to a 2×4 pixel grid:

```
,___,
|1 4|
|2 5|
|3 6|
|7 8|
`````
```

## Scripts

```sh
pnpm build        # Bundle with tsup
pnpm test         # Run tests (vitest)
pnpm test:watch   # Run tests in watch mode
pnpm lint         # Lint with Biome
pnpm lint:fix     # Auto-fix lint issues
pnpm typecheck    # Type-check (tsc --noEmit)
```

## Examples

```sh
npx tsx examples/basic.ts          # Sine waves, fills, toggles
npx tsx examples/turtle.ts         # Spirograph
npx tsx examples/clock.ts          # Animated analog clock
npx tsx examples/sine-wave.ts      # Animated sine wave
npx tsx examples/rotating-cube.ts  # 3D wireframe cube
npx tsx examples/cube.ts           # Perspective-projected cube
npx tsx examples/speed-test.ts     # Benchmark
npx tsx examples/spinners.ts       # Braille status indicators
npx tsx examples/icons.ts          # Icon rendering
npx tsx examples/kitchen-sink.ts   # Every feature demo
```

## License

MIT — [Ahmad Awais](https://x.com/MrAhmadAwais)
