/**
 * 3D rotating cube with perspective projection.
 * Port of node-drawille/examples/cube.js (inlined gl-matrix math).
 * Run: npx tsx examples/cube.ts
 */

import {
	createFixedCanvas,
	fixedClear,
	fixedFrame,
	fixedSet,
	line,
} from '../src/index.js';

// Inline minimal mat4/vec3 math (no gl-matrix dependency)

type Vec3 = [number, number, number];
type Mat4 = Float64Array;

function mat4Create(): Mat4 {
	const out = new Float64Array(16);
	out[0] = 1;
	out[5] = 1;
	out[10] = 1;
	out[15] = 1;
	return out;
}

function mat4Perspective(
	fovy: number,
	aspect: number,
	near: number,
	far: number,
): Mat4 {
	const out = new Float64Array(16);
	const f = 1.0 / Math.tan(fovy / 2);
	out[0] = f / aspect;
	out[5] = f;
	out[10] = (far + near) / (near - far);
	out[11] = -1;
	out[14] = (2 * far * near) / (near - far);
	return out;
}

function mat4LookAt(eye: Vec3, center: Vec3, up: Vec3): Mat4 {
	const out = new Float64Array(16);
	const zx = eye[0] - center[0];
	const zy = eye[1] - center[1];
	const zz = eye[2] - center[2];
	let len = 1 / Math.sqrt(zx * zx + zy * zy + zz * zz);
	const z0 = zx * len;
	const z1 = zy * len;
	const z2 = zz * len;
	const xx = up[1] * z2 - up[2] * z1;
	const xy = up[2] * z0 - up[0] * z2;
	const xz = up[0] * z1 - up[1] * z0;
	len = 1 / Math.sqrt(xx * xx + xy * xy + xz * xz);
	const x0 = xx * len;
	const x1 = xy * len;
	const x2 = xz * len;
	const y0 = z1 * x2 - z2 * x1;
	const y1 = z2 * x0 - z0 * x2;
	const y2 = z0 * x1 - z1 * x0;
	out[0] = x0;
	out[1] = y0;
	out[2] = z0;
	out[4] = x1;
	out[5] = y1;
	out[6] = z1;
	out[8] = x2;
	out[9] = y2;
	out[10] = z2;
	out[12] = -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]);
	out[13] = -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]);
	out[14] = -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]);
	out[15] = 1;
	return out;
}

function mat4Mul(a: Mat4, b: Mat4): Mat4 {
	const out = new Float64Array(16);
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			let sum = 0;
			for (let k = 0; k < 4; k++) {
				sum += (a[i * 4 + k] ?? 0) * (b[k * 4 + j] ?? 0);
			}
			out[i * 4 + j] = sum;
		}
	}
	return out;
}

function mat4RotateY(m: Mat4, rad: number): Mat4 {
	const r = mat4Create();
	r[0] = Math.cos(rad);
	r[2] = Math.sin(rad);
	r[8] = -Math.sin(rad);
	r[10] = Math.cos(rad);
	return mat4Mul(m, r);
}

function mat4RotateZ(m: Mat4, rad: number): Mat4 {
	const r = mat4Create();
	r[0] = Math.cos(rad);
	r[1] = Math.sin(rad);
	r[4] = -Math.sin(rad);
	r[5] = Math.cos(rad);
	return mat4Mul(m, r);
}

function mat4RotateX(m: Mat4, rad: number): Mat4 {
	const r = mat4Create();
	r[5] = Math.cos(rad);
	r[6] = Math.sin(rad);
	r[9] = -Math.sin(rad);
	r[10] = Math.cos(rad);
	return mat4Mul(m, r);
}

function mat4Scale(m: Mat4, s: Vec3): Mat4 {
	const r = mat4Create();
	r[0] = s[0];
	r[5] = s[1];
	r[10] = s[2];
	return mat4Mul(m, r);
}

function vec3TransformMat4(v: Vec3, m: Mat4): Vec3 {
	const x = v[0];
	const y = v[1];
	const z = v[2];
	let w = (m[3] ?? 0) * x + (m[7] ?? 0) * y + (m[11] ?? 0) * z + (m[15] ?? 0);
	w = w || 1.0;
	return [
		((m[0] ?? 0) * x + (m[4] ?? 0) * y + (m[8] ?? 0) * z + (m[12] ?? 0)) /
			w,
		((m[1] ?? 0) * x + (m[5] ?? 0) * y + (m[9] ?? 0) * z + (m[13] ?? 0)) /
			w,
		((m[2] ?? 0) * x + (m[6] ?? 0) * y + (m[10] ?? 0) * z + (m[14] ?? 0)) /
			w,
	];
}

// Cube geometry
const points: readonly Vec3[] = [
	[-1, -1, -1],
	[-1, -1, 1],
	[1, -1, 1],
	[1, -1, -1],
	[-1, 1, -1],
	[-1, 1, 1],
	[1, 1, 1],
	[1, 1, -1],
];
const quads = [
	[0, 1, 2, 3],
	[0, 4, 5, 1],
	[1, 5, 6, 2],
	[2, 6, 7, 3],
	[3, 7, 4, 0],
	[4, 7, 6, 5],
];
const cube = quads.map(q => q.map(i => points[i] as Vec3));

const projection = mat4Perspective(Math.PI / 3, 1, 1, 50);
const c = createFixedCanvas(160, 160);

function draw(): void {
	const now = Date.now();
	let mv = mat4LookAt([0, 0.1, 4], [0, 0, 0], [0, 1, 0]);
	mv = mat4RotateY(mv, (Math.PI * 2 * now) / 10000);
	mv = mat4RotateZ(mv, (Math.PI * 2 * now) / 11000);
	mv = mat4RotateX(mv, (Math.PI * 2 * now) / 9000);
	mv = mat4Scale(mv, [Math.sin((now / 1000) * Math.PI) / 2 + 1, 1, 1]);

	fixedClear(c);
	const mvp = mat4Mul(projection, mv);

	const transformed = cube.map(quad =>
		quad.map(v => {
			const out = vec3TransformMat4(v, mvp);
			return {
				x: Math.floor(out[0] * 40 + 80),
				y: Math.floor(out[1] * 40 + 80),
			};
		}),
	);

	for (const quad of transformed) {
		for (let i = 0; i < 4; i++) {
			const a = quad[i];
			const b = quad[(i + 1) % 4];
			if (!a || !b) continue;
			for (const pt of line(a.x, a.y, b.x, b.y)) {
				fixedSet(c, pt.x, pt.y);
			}
		}
	}

	process.stdout.write(fixedFrame(c));
}

setInterval(draw, 1000 / 24);
