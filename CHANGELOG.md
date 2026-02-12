# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-11

### New

- `braille(pattern)` — build a braille character from an 8-element boolean tuple (dots 1–8)
- `brailleDots(...dots)` — build a braille character by listing which dot numbers are ON
- `brailleIcon(...chars)` — build 1–3 character braille icons with dot numbers per character
- `brailleGrid(pixels)` — build braille icons from a visual 2D pixel grid (up to 6×4)
- `DotPattern` type for the 8-element boolean tuple
- `DOT_MASKS` constant mapping dot numbers to bitmasks
- Icons example (`examples/icons.ts`)

## [0.0.1] - 2026-02-12

### New

- Sparse canvas with auto-expanding `Map`-backed storage
- Fixed-size canvas with `Uint8Array` buffer for predictable bounds
- Pixel operations: `set`, `unset`, `toggle`, `get` for both canvas types
- Text overlay with `setText` on sparse canvas
- Line drawing generator using Bresenham-style interpolation
- Regular polygon generator
- Turtle graphics: `forward`, `back`, `left`, `right`, `up`, `down`, `move`
- Frame rendering with optional bounds clipping
- Terminal size detection via `getTerminalSize`
- Animation loop with `AbortSignal` support
- Coordinate helpers: `normalize`, `getPos`
- Exported constants: `BRAILLE_OFFSET`, `PIXEL_MAP`
- Full TypeScript types for all interfaces
- ESM and CJS dual builds with `.d.ts` declarations
- Examples: basic, turtle, clock, sine-wave, rotating-cube, cube, speed-test, spinners, kitchen-sink
