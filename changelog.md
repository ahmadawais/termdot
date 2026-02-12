# Changelog

## [0.1.10](https://github.com/ahmadawais/termdot/compare/v0.1.9...v0.1.10) (2026-02-12)

### Bug Fixes

* changelog ([14c36b2](https://github.com/ahmadawais/termdot/commit/14c36b2ed06d52b7f67d640971ea9875233a2bee))
* log ([b687298](https://github.com/ahmadawais/termdot/commit/b6872983710dd4402916fc223fd6fda0dee69337))

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.9](https://github.com/ahmadawais/termdot/compare/v0.1.8...v0.1.9) (2026-02-12)

### Bug Fixes

* examples ([446f556](https://github.com/ahmadawais/termdot/commit/446f556e8e8a31759da71026e4df10896bbb2ff7))

## [0.1.8](https://github.com/ahmadawais/termdot/compare/v0.1.7...v0.1.8) (2026-02-11)

### Documentation

* author and examples ([1c4b367](https://github.com/ahmadawais/termdot/commit/1c4b3670df7f8f03435afd977b90e44c87ab4d14))

## [0.1.7](https://github.com/ahmadawais/termdot/compare/v0.1.6...v0.1.7) (2026-02-11)

## [0.1.6](https://github.com/ahmadawais/termdot/compare/v0.1.5...v0.1.6) (2026-02-11)

## [0.1.5](https://github.com/ahmadawais/termdot/compare/v0.1.4...v0.1.5) (2026-02-11)

## [0.1.4](https://github.com/ahmadawais/termdot/compare/v0.1.3...v0.1.4) (2026-02-11)

## [0.1.3](https://github.com/ahmadawais/termdot/compare/v0.1.2...v0.1.3) (2026-02-11)

## [0.1.2](https://github.com/ahmadawais/termdot/compare/v0.1.1...v0.1.2) (2026-02-11)

## [0.1.1](https://github.com/ahmadawais/termdot/compare/v0.1.0...v0.1.1) (2026-02-11)

### Bug Fixes

* steps ([b891401](https://github.com/ahmadawais/termdot/commit/b891401a0ceff3256302c2732b97332d5eb94bec))

## [0.1.0](https://github.com/ahmadawais/termdot/releases/tag/v0.1.0) (2026-02-11)

### New

* `braille(pattern)` — build a braille character from an 8-element boolean tuple (dots 1–8)
* `brailleDots(...dots)` — build a braille character by listing which dot numbers are ON
* `brailleIcon(...chars)` — build 1–3 character braille icons with dot numbers per character
* `brailleGrid(pixels)` — build braille icons from a visual 2D pixel grid (up to 6×4)
* `DotPattern` type for the 8-element boolean tuple
* `DOT_MASKS` constant mapping dot numbers to bit masks
* Icons example (`examples/icons.ts`)
* Sparse canvas with auto-expanding `Map`-backed storage
* Fixed-size canvas with `Uint8Array` buffer for predictable bounds
* Pixel operations: `set`, `unset`, `toggle`, `get` for both canvas types
* Text overlay with `setText` on sparse canvas
* Line drawing generator using Bresenham-style interpolation
* Regular polygon generator
* Turtle graphics: `forward`, `back`, `left`, `right`, `up`, `down`, `move`
* Frame rendering with optional bounds clipping
* Terminal size detection via `getTerminalSize`
* Animation loop with `AbortSignal` support
* Coordinate helpers: `normalize`, `getPos`
* Exported constants: `BRAILLE_OFFSET`, `PIXEL_MAP`
* Full TypeScript types for all interfaces
* ESM and CJS dual builds with `.d.ts` declarations
* Examples: basic, turtle, clock, sine-wave, rotating-cube, cube, speed-test, spinners, kitchen-sink
