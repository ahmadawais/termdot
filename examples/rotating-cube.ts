/**
 * Rotating cube — 3D wireframe cube rendered in braille.
 * Port of drawille/examples/rotating_cube.py
 * Run: npx tsx examples/rotating-cube.ts
 * Add -p flag for perspective projection: npx tsx examples/rotating-cube.ts -p
 */

import {clear, createCanvas, frame, line, set} from '../src/index.js';

interface Point3D {
	readonly x: number;
	readonly y: number;
	readonly z: number;
}

function rotateX(p: Point3D, angle: number): Point3D {
	const rad = (angle * Math.PI) / 180;
	const cosa = Math.cos(rad);
	const sina = Math.sin(rad);
	return {
		x: p.x,
		y: p.y * cosa - p.z * sina,
		z: p.y * sina + p.z * cosa,
	};
}

function rotateY(p: Point3D, angle: number): Point3D {
	const rad = (angle * Math.PI) / 180;
	const cosa = Math.cos(rad);
	const sina = Math.sin(rad);
	return {
		x: p.z * sina + p.x * cosa,
		y: p.y,
		z: p.z * cosa - p.x * sina,
	};
}

function rotateZ(p: Point3D, angle: number): Point3D {
	const rad = (angle * Math.PI) / 180;
	const cosa = Math.cos(rad);
	const sina = Math.sin(rad);
	return {
		x: p.x * cosa - p.y * sina,
		y: p.x * sina + p.y * cosa,
		z: p.z,
	};
}

function project(
	p: Point3D,
	winW: number,
	winH: number,
	fov: number,
	dist: number,
): Point3D {
	const factor = fov / (dist + p.z);
	return {
		x: p.x * factor + winW / 2,
		y: -p.y * factor + winH / 2,
		z: 1,
	};
}

const vertices: readonly Point3D[] = [
	{x: -20, y: 20, z: -20},
	{x: 20, y: 20, z: -20},
	{x: 20, y: -20, z: -20},
	{x: -20, y: -20, z: -20},
	{x: -20, y: 20, z: 20},
	{x: 20, y: 20, z: 20},
	{x: 20, y: -20, z: 20},
	{x: -20, y: -20, z: 20},
];

const faces: readonly (readonly [number, number, number, number])[] = [
	[0, 1, 2, 3],
	[1, 5, 6, 2],
	[5, 4, 7, 6],
	[4, 0, 3, 7],
	[0, 4, 5, 1],
	[3, 2, 6, 7],
];

const useProjection = process.argv.includes('-p');
const c = createCanvas();

let angleX = 0;
let angleY = 0;
let angleZ = 0;

function draw(): void {
	const transformed = vertices.map(v => {
		let p = rotateX(v, angleX);
		p = rotateY(p, angleY);
		p = rotateZ(p, angleZ);
		if (useProjection) {
			p = project(p, 50, 50, 50, 50);
		}
		return p;
	});

	for (const f of faces) {
		for (let i = 0; i < 4; i++) {
			const a = transformed[f[i] as number];
			const b = transformed[f[(i + 1) % 4] as number];
			if (!a || !b) continue;
			for (const pt of line(a.x, a.y, b.x, b.y)) {
				set(c, pt.x, pt.y);
			}
		}
	}

	const f = frame(c, {minX: -40, minY: -40, maxX: 80, maxY: 80});
	process.stdout.write(`\x1b[H\x1b[J${f}\n`);

	angleX += 2;
	angleY += 3;
	angleZ += 5;
	clear(c);
}

setInterval(draw, 1000 / 20);
