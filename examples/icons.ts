/**
 * Braille icon builder examples.
 * Demos for braille(), brailleDots(), brailleIcon(), and brailleGrid().
 * Run: npx tsx examples/icons.ts
 */

import {braille, brailleDots, brailleGrid, brailleIcon} from '../src/index.js';

// ANSI helpers
const dim = (s: string): string => `\x1b[90m${s}\x1b[0m`;
const bold = (s: string): string => `\x1b[1m${s}\x1b[0m`;
const green = (s: string): string => `\x1b[32m${s}\x1b[0m`;
const cyan = (s: string): string => `\x1b[36m${s}\x1b[0m`;
const yellow = (s: string): string => `\x1b[33m${s}\x1b[0m`;
const red = (s: string): string => `\x1b[31m${s}\x1b[0m`;

const hr = dim('─'.repeat(50));

// ---------------------------------------------------------------------------
// 1. braille() — single char with boolean pattern for dots 1-8
// ---------------------------------------------------------------------------
console.log('');
console.log(bold('braille(pattern)') + dim(' — 8 booleans for dots 1-8'));
console.log(hr);
console.log('');

// Dot layout reminder:
//   ,___,
//   |1 4|
//   |2 5|
//   |3 6|
//   |7 8|
//   `````

const full = braille([true, true, true, true, true, true, true, true]);
const leftCol = braille([true, true, true, false, false, false, true, false]);
const rightCol = braille([false, false, false, true, true, true, false, true]);
const topRow = braille([true, false, false, true, false, false, false, false]);
const botRow = braille([false, false, false, false, false, false, true, true]);
const corners = braille([true, false, false, true, false, false, true, true]);

console.log(`  ${full}  all dots on`);
console.log(`  ${leftCol}  left column  ${dim('(dots 1,2,3,7)')}`);
console.log(`  ${rightCol}  right column ${dim('(dots 4,5,6,8)')}`);
console.log(`  ${topRow}  top row      ${dim('(dots 1,4)')}`);
console.log(`  ${botRow}  bottom row   ${dim('(dots 7,8)')}`);
console.log(`  ${corners}  corners      ${dim('(dots 1,4,7,8)')}`);

// ---------------------------------------------------------------------------
// 2. brailleDots() — single char by listing ON dot numbers
// ---------------------------------------------------------------------------
console.log('');
console.log(bold('brailleDots(...dots)') + dim(' — list which dots are ON'));
console.log(hr);
console.log('');

console.log(`  ${brailleDots(1, 2, 3, 4, 5, 6, 7, 8)}  all dots`);
console.log(`  ${brailleDots(1, 4)}  dots 1,4`);
console.log(`  ${brailleDots(2, 3, 5, 6)}  dots 2,3,5,6 ${dim('(middle rows)')}`);
console.log(`  ${brailleDots(1, 2, 4, 5)}  dots 1,2,4,5 ${dim('(top half)')}`);
console.log(`  ${brailleDots(3, 6, 7, 8)}  dots 3,6,7,8 ${dim('(bottom half)')}`);

// ---------------------------------------------------------------------------
// 3. brailleIcon() — multi-char icons with dot numbers per char
// ---------------------------------------------------------------------------
console.log('');
console.log(
	bold('brailleIcon(...chars)') + dim(' — 1-3 chars, dot numbers each'),
);
console.log(hr);
console.log('');

// 1-char
const dot = brailleIcon([1, 2, 3, 4, 5, 6, 7, 8]);
console.log(`  ${dot}   1-char full block`);

// 2-char: vertical bars
const bars = brailleIcon([1, 2, 3, 7], [4, 5, 6, 8]);
console.log(`  ${bars}  2-char vertical bars`);

// 2-char: arrow right →
const arrowR = brailleIcon([2, 5], [1, 4, 7, 8]);
console.log(`  ${arrowR}  2-char arrow right`);

// 3-char: spread
const spread = brailleIcon([3, 7], [1, 2, 3, 4, 5, 6, 7, 8], [6, 8]);
console.log(`  ${spread} 3-char spread`);

// ---------------------------------------------------------------------------
// 4. brailleGrid() — visual pixel grid design
// ---------------------------------------------------------------------------
console.log('');
console.log(bold('brailleGrid(pixels)') + dim(' — visual 2D grid of 0/1'));
console.log(hr);
console.log('');

// Dot reference:
//   col: 0 1 | 2 3 | 4 5
//   row0: .   .   .
//   row1: .   .   .
//   row2: .   .   .
//   row3: .   .   .

// 1-char: X pattern
const x = brailleGrid([
	[1, 1], //
	[0, 0],
	[0, 0],
	[1, 1],
]);
console.log(`  ${x}   X marks the spot`);

// 2-char: checkmark
const check = brailleGrid([
	[0, 0, 0, 1], //
	[0, 0, 0, 1],
	[1, 0, 1, 0],
	[0, 1, 0, 0],
]);
console.log(`  ${green(check)}  checkmark`);

// 2-char: heart
const heart = brailleGrid([
	[0, 1, 1, 0], //
	[1, 1, 1, 1],
	[1, 1, 1, 1],
	[0, 1, 1, 0],
]);
console.log(`  ${red(heart)}  heart`);

// 2-char: up arrow
const arrowUp = brailleGrid([
	[0, 1, 1, 0], //
	[1, 1, 1, 1],
	[0, 1, 1, 0],
	[0, 1, 1, 0],
]);
console.log(`  ${cyan(arrowUp)}  arrow up`);

// 2-char: down arrow
const arrowDn = brailleGrid([
	[0, 1, 1, 0], //
	[0, 1, 1, 0],
	[1, 1, 1, 1],
	[0, 1, 1, 0],
]);
console.log(`  ${yellow(arrowDn)}  arrow down`);

// 2-char: box outline
const box = brailleGrid([
	[1, 1, 1, 1], //
	[1, 0, 0, 1],
	[1, 0, 0, 1],
	[1, 1, 1, 1],
]);
console.log(`  ${box}  box`);

// 3-char: progress bar (filled)
const progFull = brailleGrid([
	[1, 1, 1, 1, 1, 1], //
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1],
]);
console.log(`  ${green(progFull)} progress full`);

// 3-char: progress bar (half)
const progHalf = brailleGrid([
	[1, 1, 1, 1, 0, 0], //
	[1, 1, 1, 1, 0, 0],
	[1, 1, 1, 1, 0, 0],
	[1, 1, 1, 1, 0, 0],
]);
console.log(`  ${yellow(progHalf)} progress half`);

// 3-char: signal bars (ascending)
const signal = brailleGrid([
	[0, 0, 0, 0, 0, 1], //
	[0, 0, 0, 1, 0, 1],
	[0, 1, 0, 1, 0, 1],
	[0, 1, 0, 1, 0, 1],
]);
console.log(`  ${green(signal)} signal bars`);

// 3-char: warning triangle
const warn = brailleGrid([
	[0, 0, 1, 1, 0, 0], //
	[0, 1, 0, 0, 1, 0],
	[0, 1, 0, 0, 1, 0],
	[1, 1, 1, 1, 1, 1],
]);
console.log(`  ${yellow(warn)} warning`);

// ---------------------------------------------------------------------------
// Practical: status line demo
// ---------------------------------------------------------------------------
console.log('');
console.log(bold('Practical use: status indicators'));
console.log(hr);
console.log('');

const iconOk = brailleGrid([
	[0, 0, 0, 1],
	[0, 0, 0, 1],
	[1, 0, 1, 0],
	[0, 1, 0, 0],
]);
const iconWarn = brailleGrid([
	[0, 1, 1, 0],
	[0, 1, 1, 0],
	[0, 1, 1, 0],
	[0, 0, 0, 0],
]);
const iconErr = brailleGrid([
	[1, 0, 0, 1],
	[0, 1, 1, 0],
	[0, 1, 1, 0],
	[1, 0, 0, 1],
]);
const iconInfo = brailleGrid([
	[0, 1, 1, 0],
	[0, 0, 0, 0],
	[0, 1, 1, 0],
	[0, 1, 1, 0],
]);

console.log(`  ${green(iconOk)}  ${green('Build passed')}`);
console.log(`  ${yellow(iconWarn)}  ${yellow('3 warnings')}`);
console.log(`  ${red(iconErr)}  ${red('Connection lost')}`);
console.log(`  ${cyan(iconInfo)}  ${cyan('Update available')}`);
console.log('');
