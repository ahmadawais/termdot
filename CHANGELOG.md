# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
