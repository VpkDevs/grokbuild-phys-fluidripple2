import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as RotateCcw } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BfrMMo62.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[opacity,transform,background-color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-smooth-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90 active:scale-[0.96]",
			secondary: "bg-surface text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)] active:scale-[0.96]",
			ghost: "bg-transparent text-fg hover:bg-surface-subtle active:scale-[0.96]"
		},
		size: {
			default: "h-11 px-4 text-sm",
			sm: "h-10 px-3 text-sm",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-11 w-full touch-none select-none items-center", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow overflow-hidden rounded-full bg-surface-subtle",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-fg shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-[var(--motion-quick)] ease-[var(--ease-smooth-out)] hover:shadow-[var(--shadow-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg" })]
	});
}
var COLOR_MAPS = [
	{
		id: "abyss",
		label: "Abyss",
		stops: [
			[
				.02,
				.05,
				.08
			],
			[
				.04,
				.2,
				.3
			],
			[
				.12,
				.48,
				.5
			],
			[
				.74,
				.91,
				.88
			]
		],
		swatch: "linear-gradient(135deg, #0a1418 0%, #0a334d 48%, #bde8e0 100%)"
	},
	{
		id: "tide",
		label: "Tide",
		stops: [
			[
				.02,
				.08,
				.07
			],
			[
				.05,
				.3,
				.24
			],
			[
				.2,
				.58,
				.46
			],
			[
				.72,
				.91,
				.78
			]
		],
		swatch: "linear-gradient(135deg, #0a1614 0%, #0d4a3d 48%, #b8e8c7 100%)"
	},
	{
		id: "ink",
		label: "Ink",
		stops: [
			[
				.035,
				.035,
				.04
			],
			[
				.16,
				.16,
				.18
			],
			[
				.4,
				.4,
				.44
			],
			[
				.88,
				.87,
				.84
			]
		],
		swatch: "linear-gradient(135deg, #0c0c0e 0%, #3a3a42 50%, #e0ded6 100%)"
	},
	{
		id: "glacier",
		label: "Glacier",
		stops: [
			[
				.04,
				.08,
				.14
			],
			[
				.12,
				.3,
				.44
			],
			[
				.42,
				.64,
				.8
			],
			[
				.9,
				.94,
				.98
			]
		],
		swatch: "linear-gradient(135deg, #0c1824 0%, #1e4e70 48%, #e4f0fa 100%)"
	},
	{
		id: "copper",
		label: "Copper",
		stops: [
			[
				.08,
				.035,
				.025
			],
			[
				.34,
				.14,
				.08
			],
			[
				.64,
				.36,
				.18
			],
			[
				.94,
				.84,
				.7
			]
		],
		swatch: "linear-gradient(135deg, #160c08 0%, #5c2814 48%, #f0d6b2 100%)"
	}
];
var DEFAULT_COLOR_MAP = "abyss";
function getPalette(id) {
	return COLOR_MAPS.find((p) => p.id === id) ?? COLOR_MAPS[0];
}
function samplePalette(stops, t) {
	const x = Math.min(1, Math.max(0, t));
	if (x < 1 / 3) return mixRgb(stops[0], stops[1], x / (1 / 3));
	if (x < 2 / 3) return mixRgb(stops[1], stops[2], (x - 1 / 3) / (1 / 3));
	return mixRgb(stops[2], stops[3], (x - 2 / 3) / (1 / 3));
}
function mixRgb(a, b, t) {
	const k = Math.min(1, Math.max(0, t));
	return [
		a[0] + (b[0] - a[0]) * k,
		a[1] + (b[1] - a[1]) * k,
		a[2] + (b[2] - a[2]) * k
	];
}
function ControlDock({ viscosity, strength, colorMap, onViscosity, onStrength, onColorMap, onClear }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("pointer-events-auto w-full max-w-sm", "rounded-xl bg-surface/90 p-4 text-fg shadow-[var(--shadow-border)]", "backdrop-saturate-150", "md:max-w-72"),
		onPointerDown: (event) => event.stopPropagation(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl leading-tight tracking-display text-fg",
					children: "Wake"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-snug text-muted",
					children: "Drag to send a wave."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "secondary",
				size: "sm",
				className: "shrink-0 rounded-sm",
				onClick: onClear,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Clear"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Viscosity",
					value: Math.round(viscosity),
					id: "viscosity",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						id: "viscosity",
						min: 0,
						max: 100,
						step: 1,
						value: [viscosity],
						onValueChange: (v) => onViscosity(v[0] ?? viscosity),
						"aria-label": "Viscosity"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Wave strength",
					value: Math.round(strength),
					id: "strength",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						id: "strength",
						min: 0,
						max: 100,
						step: 1,
						value: [strength],
						onValueChange: (v) => onStrength(v[0] ?? strength),
						"aria-label": "Wave strength"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium uppercase tracking-wide text-subtle",
					children: "Color map"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "radiogroup",
					"aria-label": "Color map",
					className: "flex flex-wrap gap-2",
					children: COLOR_MAPS.map((palette) => {
						const selected = palette.id === colorMap;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "radio",
							"aria-checked": selected,
							"aria-label": palette.label,
							title: palette.label,
							onClick: () => onColorMap(palette.id),
							className: cn("relative size-11 overflow-hidden rounded-sm", "shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-smooth-out)]", "hover:shadow-[var(--shadow-border-hover)] active:scale-[0.96]", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg", selected && "ring-2 ring-fg ring-offset-2 ring-offset-bg"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-0",
								style: { background: palette.swatch }
							})
						}, palette.id);
					})
				})] })
			]
		})]
	});
}
function Field({ label, value, id, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-baseline justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			htmlFor: id,
			className: "text-sm font-medium text-fg",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-xs tabular-nums text-subtle",
			children: value
		})]
	}), children] });
}
var VERT = `#version 300 es
precision highp float;
const vec2 POS[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
out vec2 vUv;
void main() {
  vec2 p = POS[gl_VertexID];
  gl_Position = vec4(p, 0.0, 1.0);
  vUv = p * 0.5 + 0.5;
}
`;
var SIM_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uDamping;
uniform float uSpeed;
uniform float uEncode;
uniform int uDropCount;
uniform vec4 uDrops[32];
in vec2 vUv;
out vec4 fragColor;

vec2 load(vec2 uv) {
  vec4 t = texture(uState, uv);
  float h = mix(t.r, (t.r - 0.5) * 2.0, uEncode);
  float hp = mix(t.g, (t.g - 0.5) * 2.0, uEncode);
  return vec2(h, hp);
}

vec2 store(float h, float hp) {
  vec2 raw = vec2(h, hp);
  vec2 encoded = raw * 0.5 + 0.5;
  return mix(raw, encoded, uEncode);
}

void main() {
  vec2 uv = vUv;
  vec2 state = load(uv);
  float h = state.x;
  float hp = state.y;
  float n = load(uv + vec2(0.0, uTexel.y)).x;
  float s = load(uv - vec2(0.0, uTexel.y)).x;
  float e = load(uv + vec2(uTexel.x, 0.0)).x;
  float w = load(uv - vec2(uTexel.x, 0.0)).x;
  float lap = n + s + e + w - 4.0 * h;
  float next = (2.0 * h - hp + uSpeed * lap) * uDamping;

  for (int i = 0; i < 32; i++) {
    float active = step(float(i) + 0.5, float(uDropCount));
    vec4 d = uDrops[i];
    vec2 delta = uv - d.xy;
    float rad2 = max(d.w * d.w, 1.0e-8);
    float bump = d.z * exp(-dot(delta, delta) / rad2);
    next += bump * active;
  }

  next = clamp(next, -1.8, 1.8);
  vec2 packed = store(next, h);
  fragColor = vec4(packed, 0.0, 1.0);
}
`;
var DRAW_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uHeight;
uniform vec2 uTexel;
uniform float uEncode;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
in vec2 vUv;
out vec4 fragColor;

float load(vec2 uv) {
  float r = texture(uHeight, clamp(uv, 0.0, 1.0)).r;
  return mix(r, (r - 0.5) * 2.0, uEncode);
}

vec3 colormap(float t) {
  t = clamp(t, 0.0, 1.0);
  float s0 = 0.33;
  float s1 = 0.66;
  vec3 a = mix(uC0, uC1, clamp(t / s0, 0.0, 1.0));
  vec3 b = mix(uC1, uC2, clamp((t - s0) / (s1 - s0), 0.0, 1.0));
  vec3 c = mix(uC2, uC3, clamp((t - s1) / (1.0 - s1), 0.0, 1.0));
  vec3 ab = mix(a, b, step(s0, t));
  return mix(ab, c, step(s1, t));
}

void main() {
  vec2 uv = vUv;
  float h = load(uv);
  float hx = load(uv + vec2(uTexel.x, 0.0)) - load(uv - vec2(uTexel.x, 0.0));
  float hy = load(uv + vec2(0.0, uTexel.y)) - load(uv - vec2(0.0, uTexel.y));
  vec3 N = normalize(vec3(-hx * 28.0, -hy * 28.0, 1.0));
  vec3 L = normalize(vec3(0.38, 0.62, 0.72));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float diff = 0.38 + 0.62 * max(dot(N, L), 0.0);
  float spec = pow(max(dot(N, H), 0.0), 72.0);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.6);

  float t = 0.46 + h * 1.35 + spec * 0.22;
  vec3 albedo = colormap(t);
  vec3 highlight = mix(vec3(0.82, 0.9, 0.96), uC3, 0.35);
  vec3 col = albedo * diff + spec * highlight * 0.95 + fres * albedo * 0.28;

  vec2 fromCenter = uv - vec2(0.5);
  float vig = smoothstep(1.15, 0.22, length(fromCenter) * 1.15);
  col *= 0.58 + 0.42 * vig;

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
var MAX_DROPS = 32;
var REST = 0;
var RippleEngine = class {
	canvas;
	backend = null;
	raf = 0;
	running = false;
	lastTs = 0;
	accum = 0;
	viscosity = .32;
	strength = .64;
	colorMap = "abyss";
	pointers = /* @__PURE__ */ new Map();
	pending = [];
	dropScratch = /* @__PURE__ */ new Float32Array(128);
	cssW = 1;
	cssH = 1;
	energy = 0;
	lost = false;
	onLost = null;
	onRestored = null;
	constructor(canvas) {
		this.canvas = canvas;
	}
	start() {
		if (this.running) return;
		this.resize();
		this.seed();
		this.running = true;
		this.lastTs = performance.now();
		const loop = (ts) => {
			if (!this.running) return;
			this.raf = requestAnimationFrame(loop);
			const dt = Math.min(.1, (ts - this.lastTs) / 1e3);
			this.lastTs = ts;
			this.accum += dt;
			const step = 1 / 60;
			let guard = 0;
			while (this.accum >= step && guard < 4) {
				this.simulate();
				this.accum -= step;
				guard += 1;
			}
			this.render();
		};
		this.raf = requestAnimationFrame(loop);
	}
	destroy() {
		this.running = false;
		cancelAnimationFrame(this.raf);
		this.pointers.clear();
		this.pending.length = 0;
		if (this.onLost) this.canvas.removeEventListener("webglcontextlost", this.onLost);
		if (this.onRestored) this.canvas.removeEventListener("webglcontextrestored", this.onRestored);
		this.onLost = null;
		this.onRestored = null;
		const backend = this.backend;
		this.backend = null;
		if (backend?.kind === "webgl") this.destroyGl(backend);
	}
	setViscosity(value) {
		this.viscosity = clamp01(value / 100);
	}
	setStrength(value) {
		this.strength = clamp01(value / 100);
	}
	setColorMap(id) {
		this.colorMap = id;
	}
	clear() {
		this.pending.length = 0;
		this.pointers.forEach((p) => {
			p.active = false;
		});
		const backend = this.backend;
		if (!backend) return;
		if (backend.kind === "webgl") {
			this.clearTarget(backend, backend.read);
			this.clearTarget(backend, backend.write);
		} else {
			backend.curr.fill(REST);
			backend.prev.fill(REST);
		}
		this.energy = 0;
	}
	pointerDown(id, cssX, cssY, pressure = .5) {
		const uv = this.toUv(cssX, cssY);
		this.pointers.set(id, {
			x: uv.x,
			y: uv.y,
			active: true
		});
		this.queueDrop(uv.x, uv.y, this.pulseAmp(pressure) * 1.15, this.dropRadius());
	}
	pointerMove(id, cssX, cssY, pressure = .5) {
		const uv = this.toUv(cssX, cssY);
		const prev = this.pointers.get(id);
		if (!prev || !prev.active) {
			this.pointers.set(id, {
				x: uv.x,
				y: uv.y,
				active: true
			});
			this.queueDrop(uv.x, uv.y, this.pulseAmp(pressure), this.dropRadius());
			return;
		}
		this.splatSegment(prev.x, prev.y, uv.x, uv.y, this.pulseAmp(pressure));
		prev.x = uv.x;
		prev.y = uv.y;
	}
	pointerUp(id) {
		const prev = this.pointers.get(id);
		if (prev) prev.active = false;
		this.pointers.delete(id);
	}
	getEnergy() {
		return this.energy;
	}
	splash(uvX, uvY, amp) {
		this.queueDrop(uvX, uvY, amp ?? this.pulseAmp(.7) * 1.2, this.dropRadius() * 1.1);
	}
	resize() {
		const rect = (this.canvas.parentElement ?? this.canvas).getBoundingClientRect();
		this.cssW = Math.max(1, rect.width);
		this.cssH = Math.max(1, rect.height);
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const pixelW = Math.max(1, Math.round(this.cssW * dpr));
		const pixelH = Math.max(1, Math.round(this.cssH * dpr));
		if (this.canvas.width !== pixelW || this.canvas.height !== pixelH) {
			this.canvas.width = pixelW;
			this.canvas.height = pixelH;
		}
		const sim = pickSimSize(this.cssW, this.cssH);
		const backend = this.backend;
		if (backend?.kind === "webgl") {
			if (backend.gl.isContextLost()) {
				this.lost = true;
				return;
			}
			if (backend.simW === sim.w && backend.simH === sim.h) {
				backend.gl.viewport(0, 0, pixelW, pixelH);
				return;
			}
			this.destroyGl(backend);
			this.backend = null;
		} else if (backend?.kind === "cpu" && backend.simW === sim.w && backend.simH === sim.h) return;
		this.initBackend(sim.w, sim.h);
	}
	initBackend(simW, simH) {
		const gl = this.getGl();
		if (gl) {
			try {
				const built = this.buildGl(gl, simW, simH);
				if (built) {
					this.backend = built;
					this.bindContextLoss();
					return;
				}
			} catch (err) {
				console.error(err);
			}
			throw new Error("WebGL surface failed to initialize.");
		}
		this.backend = this.buildCpu(simW, simH);
	}
	getGl() {
		const opts = {
			alpha: false,
			antialias: false,
			depth: false,
			stencil: false,
			premultipliedAlpha: false,
			preserveDrawingBuffer: false,
			powerPreference: "high-performance"
		};
		try {
			return this.canvas.getContext("webgl2", {
				...opts,
				desynchronized: true
			}) || this.canvas.getContext("webgl2", opts);
		} catch {
			return this.canvas.getContext("webgl2", opts);
		}
	}
	bindContextLoss() {
		if (this.onLost) return;
		this.onLost = (event) => {
			event.preventDefault();
			this.lost = true;
		};
		this.onRestored = () => {
			this.lost = false;
			if (this.backend?.kind === "webgl") {
				this.destroyGl(this.backend);
				this.backend = null;
			}
			this.resize();
			this.seed();
		};
		this.canvas.addEventListener("webglcontextlost", this.onLost, false);
		this.canvas.addEventListener("webglcontextrestored", this.onRestored, false);
	}
	buildGl(gl, simW, simH) {
		gl.getExtension("EXT_color_buffer_float");
		gl.getExtension("EXT_color_buffer_half_float");
		gl.getExtension("OES_texture_float_linear");
		const vao = gl.createVertexArray();
		if (!vao) return null;
		gl.bindVertexArray(vao);
		const simProg = compile(gl, VERT, SIM_FRAG);
		const drawProg = compile(gl, VERT, DRAW_FRAG);
		if (!simProg || !drawProg) return null;
		const encodedTry = [
			{
				encoded: false,
				internal: gl.RGBA16F,
				format: gl.RGBA,
				type: gl.HALF_FLOAT
			},
			{
				encoded: false,
				internal: gl.RGBA32F,
				format: gl.RGBA,
				type: gl.FLOAT
			},
			{
				encoded: true,
				internal: gl.RGBA8,
				format: gl.RGBA,
				type: gl.UNSIGNED_BYTE
			}
		];
		let read = null;
		let write = null;
		let encoded = false;
		for (const spec of encodedTry) {
			read = makeTarget(gl, simW, simH, spec.internal, spec.format, spec.type);
			write = read ? makeTarget(gl, simW, simH, spec.internal, spec.format, spec.type) : null;
			if (read && write) {
				encoded = spec.encoded;
				break;
			}
			if (read) deleteTarget(gl, read);
			if (write) deleteTarget(gl, write);
			read = null;
			write = null;
		}
		if (!read || !write) return null;
		const backend = {
			kind: "webgl",
			gl,
			vao,
			simProg,
			drawProg,
			simUniforms: {
				uState: loc(gl, simProg, "uState"),
				uTexel: loc(gl, simProg, "uTexel"),
				uDamping: loc(gl, simProg, "uDamping"),
				uSpeed: loc(gl, simProg, "uSpeed"),
				uEncode: loc(gl, simProg, "uEncode"),
				uDropCount: loc(gl, simProg, "uDropCount"),
				uDrops: loc(gl, simProg, "uDrops")
			},
			drawUniforms: {
				uHeight: loc(gl, drawProg, "uHeight"),
				uTexel: loc(gl, drawProg, "uTexel"),
				uEncode: loc(gl, drawProg, "uEncode"),
				uC0: loc(gl, drawProg, "uC0"),
				uC1: loc(gl, drawProg, "uC1"),
				uC2: loc(gl, drawProg, "uC2"),
				uC3: loc(gl, drawProg, "uC3")
			},
			read,
			write,
			encoded,
			simW,
			simH
		};
		this.clearTarget(backend, read);
		this.clearTarget(backend, write);
		return backend;
	}
	buildCpu(simW, simH) {
		const ctx = this.canvas.getContext("2d", { alpha: false });
		if (!ctx) throw new Error("Canvas 2D is not available on this device.");
		const offscreen = document.createElement("canvas");
		offscreen.width = simW;
		offscreen.height = simH;
		const offCtx = offscreen.getContext("2d", { alpha: false });
		if (!offCtx) throw new Error("Offscreen canvas is not available on this device.");
		const image = offCtx.createImageData(simW, simH);
		return {
			kind: "cpu",
			ctx,
			curr: new Float32Array(simW * simH),
			prev: new Float32Array(simW * simH),
			pixels: image.data,
			image,
			offscreen,
			offCtx,
			simW,
			simH
		};
	}
	destroyGl(backend) {
		const { gl } = backend;
		gl.deleteProgram(backend.simProg);
		gl.deleteProgram(backend.drawProg);
		gl.deleteVertexArray(backend.vao);
		deleteTarget(gl, backend.read);
		deleteTarget(gl, backend.write);
	}
	seed() {
		for (const [x, y, amp] of [
			[
				.34,
				.42,
				.22
			],
			[
				.62,
				.56,
				.18
			],
			[
				.5,
				.28,
				.14
			],
			[
				.22,
				.68,
				.12
			],
			[
				.78,
				.38,
				.1
			]
		]) this.queueDrop(x, y, amp, .028);
		for (let i = 0; i < 48; i++) this.simulate();
	}
	simulate() {
		const backend = this.backend;
		if (!backend || this.lost) return;
		const drops = this.consumeDrops();
		const damping = lerp(.995, .935, this.viscosity);
		const speed = lerp(.26, .16, this.viscosity * .55);
		if (backend.kind === "webgl") this.simulateGl(backend, drops, damping, speed);
		else this.simulateCpu(backend, drops, damping, speed);
	}
	simulateGl(backend, drops, damping, speed) {
		const { gl } = backend;
		const count = this.dropCountFrom(drops);
		gl.bindVertexArray(backend.vao);
		gl.useProgram(backend.simProg);
		gl.viewport(0, 0, backend.simW, backend.simH);
		gl.bindFramebuffer(gl.FRAMEBUFFER, backend.write.fbo);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, backend.read.tex);
		gl.uniform1i(backend.simUniforms.uState, 0);
		gl.uniform2f(backend.simUniforms.uTexel, 1 / backend.simW, 1 / backend.simH);
		gl.uniform1f(backend.simUniforms.uDamping, damping);
		gl.uniform1f(backend.simUniforms.uSpeed, speed);
		gl.uniform1f(backend.simUniforms.uEncode, backend.encoded ? 1 : 0);
		gl.uniform1i(backend.simUniforms.uDropCount, count);
		gl.uniform4fv(backend.simUniforms.uDrops, drops);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		const tmp = backend.read;
		backend.read = backend.write;
		backend.write = tmp;
	}
	simulateCpu(backend, drops, damping, speed) {
		const { simW: w, simH: h, curr, prev } = backend;
		const next = prev;
		let energy = 0;
		const count = this.dropCountFrom(drops);
		for (let y = 0; y < h; y++) {
			const yOff = y * w;
			for (let x = 0; x < w; x++) {
				const i = yOff + x;
				const c = curr[i] ?? 0;
				const n = curr[y > 0 ? i - w : i] ?? 0;
				const s = curr[y < h - 1 ? i + w : i] ?? 0;
				const e = curr[x < w - 1 ? i + 1 : i] ?? 0;
				const ww = curr[x > 0 ? i - 1 : i] ?? 0;
				const lap = n + s + e + ww - 4 * c;
				let v = (2 * c - (prev[i] ?? 0) + speed * lap) * damping;
				const uvx = (x + .5) / w;
				const uvy = (y + .5) / h;
				for (let d = 0; d < count; d++) {
					const ox = drops[d * 4] ?? 0;
					const oy = drops[d * 4 + 1] ?? 0;
					const amp = drops[d * 4 + 2] ?? 0;
					const rad = drops[d * 4 + 3] ?? .02;
					const dx = uvx - ox;
					const dy = uvy - oy;
					v += amp * Math.exp(-(dx * dx + dy * dy) / Math.max(rad * rad, 1e-8));
				}
				if (v > 1.8) v = 1.8;
				else if (v < -1.8) v = -1.8;
				next[i] = v;
				energy += v * v;
			}
		}
		backend.prev = curr;
		backend.curr = next;
		this.energy = energy / (w * h);
	}
	render() {
		const backend = this.backend;
		if (!backend || this.lost) return;
		if (backend.kind === "webgl") this.renderGl(backend);
		else this.renderCpu(backend);
	}
	renderGl(backend) {
		const { gl } = backend;
		const palette = getPalette(this.colorMap);
		gl.bindVertexArray(backend.vao);
		gl.useProgram(backend.drawProg);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, backend.read.tex);
		gl.uniform1i(backend.drawUniforms.uHeight, 0);
		gl.uniform2f(backend.drawUniforms.uTexel, 1 / backend.simW, 1 / backend.simH);
		gl.uniform1f(backend.drawUniforms.uEncode, backend.encoded ? 1 : 0);
		gl.uniform3f(backend.drawUniforms.uC0, palette.stops[0][0], palette.stops[0][1], palette.stops[0][2]);
		gl.uniform3f(backend.drawUniforms.uC1, palette.stops[1][0], palette.stops[1][1], palette.stops[1][2]);
		gl.uniform3f(backend.drawUniforms.uC2, palette.stops[2][0], palette.stops[2][1], palette.stops[2][2]);
		gl.uniform3f(backend.drawUniforms.uC3, palette.stops[3][0], palette.stops[3][1], palette.stops[3][2]);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		this.energy = Math.max(this.energy * .96, this.pending.length > 0 ? .05 : 0);
	}
	renderCpu(backend) {
		const { simW: w, simH: h, curr, pixels } = backend;
		const palette = getPalette(this.colorMap);
		for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
			const i = y * w + x;
			const hh = curr[i] ?? 0;
			const left = curr[y * w + Math.max(0, x - 1)] ?? 0;
			const right = curr[y * w + Math.min(w - 1, x + 1)] ?? 0;
			const up = curr[Math.max(0, y - 1) * w + x] ?? 0;
			const down = curr[Math.min(h - 1, y + 1) * w + x] ?? 0;
			const hx = right - left;
			const hy = down - up;
			const nx = -hx * 28;
			const ny = -hy * 28;
			const inv = 1 / Math.hypot(nx, ny, 1);
			const nxx = nx * inv;
			const nyy = ny * inv;
			const nz = inv;
			const llen = Math.hypot(.38, .62, .72);
			const Lx = .38 / llen;
			const Ly = .62 / llen;
			const Lz = .72 / llen;
			const diff = .38 + .62 * Math.max(nxx * Lx + nyy * Ly + nz * Lz, 0);
			const hlen = Math.hypot(Lx, Ly, Lz + 1);
			const spec = Math.pow(Math.max(nxx * (Lx / hlen) + nyy * (Ly / hlen) + nz * ((Lz + 1) / hlen), 0), 72);
			const fres = Math.pow(1 - Math.max(nz, 0), 2.6);
			const t = .46 + hh * 1.35 + spec * .22;
			const albedo = samplePalette(palette.stops, t);
			let r = albedo[0] * diff + spec * .9 + fres * albedo[0] * .28;
			let g = albedo[1] * diff + spec * .93 + fres * albedo[1] * .28;
			let b = albedo[2] * diff + spec * .96 + fres * albedo[2] * .28;
			const cx = x / w - .5;
			const cy = y / h - .5;
			const shade = .58 + .42 * smoothstep(1.15, .22, Math.hypot(cx, cy) * 1.15);
			r *= shade;
			g *= shade;
			b *= shade;
			const pi = i * 4;
			pixels[pi] = Math.round(clamp01(r) * 255);
			pixels[pi + 1] = Math.round(clamp01(g) * 255);
			pixels[pi + 2] = Math.round(clamp01(b) * 255);
			pixels[pi + 3] = 255;
		}
		backend.offCtx.putImageData(backend.image, 0, 0);
		backend.ctx.imageSmoothingEnabled = true;
		backend.ctx.imageSmoothingQuality = "high";
		backend.ctx.drawImage(backend.offscreen, 0, 0, this.canvas.width, this.canvas.height);
	}
	consumeDrops() {
		const out = this.dropScratch;
		out.fill(0);
		const n = Math.min(MAX_DROPS, this.pending.length);
		for (let i = 0; i < n; i++) {
			const d = this.pending[i];
			if (!d) continue;
			out[i * 4] = d.x;
			out[i * 4 + 1] = d.y;
			out[i * 4 + 2] = d.amp;
			out[i * 4 + 3] = d.radius;
		}
		this.pending.splice(0, n);
		if (this.pending.length > 64) this.pending.length = 64;
		return out;
	}
	dropCountFrom(drops) {
		let n = 0;
		for (let i = 0; i < MAX_DROPS; i++) if ((drops[i * 4 + 2] ?? 0) !== 0) n = i + 1;
		return n;
	}
	queueDrop(x, y, amp, radius) {
		if (this.pending.length >= 96) this.pending.shift();
		this.pending.push({
			x: clamp01(x),
			y: clamp01(y),
			amp,
			radius
		});
		this.energy = Math.max(this.energy, Math.abs(amp));
	}
	splatSegment(x0, y0, x1, y1, amp) {
		const dx = x1 - x0;
		const dy = y1 - y0;
		const dist = Math.hypot(dx, dy);
		if (dist < 1e-5) {
			this.queueDrop(x1, y1, amp * .35, this.dropRadius());
			return;
		}
		const sim = this.backend;
		const cell = sim ? 1 / Math.max(sim.simW, sim.simH) : .004;
		const steps = Math.min(MAX_DROPS, Math.max(1, Math.ceil(dist / (cell * .85))));
		const scaled = amp * Math.min(1.4, .35 + dist * 8) / Math.sqrt(steps);
		const radius = this.dropRadius();
		for (let i = 1; i <= steps; i++) {
			const t = i / steps;
			this.queueDrop(x0 + dx * t, y0 + dy * t, scaled, radius);
		}
	}
	pulseAmp(pressure) {
		const p = pressure > 0 && pressure <= 1 ? .45 + pressure * .7 : 1;
		return lerp(.045, .28, this.strength) * p;
	}
	dropRadius() {
		return lerp(.016, .034, this.strength);
	}
	toUv(cssX, cssY) {
		return {
			x: this.cssW > 0 ? cssX / this.cssW : 0,
			y: this.cssH > 0 ? 1 - cssY / this.cssH : 0
		};
	}
	clearTarget(backend, target) {
		const { gl } = backend;
		gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
		if (backend.encoded) gl.clearColor(.5, .5, .5, 1);
		else gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
};
function pickSimSize(cssW, cssH) {
	const cores = navigator.hardwareConcurrency || 4;
	const area = cssW * cssH;
	const long = cores <= 4 && area > 14e5 ? 288 : 448;
	const aspect = cssW / Math.max(1, cssH);
	let w;
	let h;
	if (aspect >= 1) {
		w = long;
		h = Math.max(160, Math.round(long / aspect));
	} else {
		h = long;
		w = Math.max(160, Math.round(long * aspect));
	}
	return {
		w: quantize(w),
		h: quantize(h)
	};
}
function quantize(n) {
	return Math.max(160, Math.round(n / 8) * 8);
}
function compile(gl, vertSrc, fragSrc) {
	const vs = makeShader(gl, gl.VERTEX_SHADER, vertSrc);
	const fs = makeShader(gl, gl.FRAGMENT_SHADER, fragSrc);
	if (!vs || !fs) return null;
	const prog = gl.createProgram();
	if (!prog) return null;
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	gl.deleteShader(vs);
	gl.deleteShader(fs);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		console.error(gl.getProgramInfoLog(prog));
		gl.deleteProgram(prog);
		return null;
	}
	return prog;
}
function makeShader(gl, type, src) {
	const shader = gl.createShader(type);
	if (!shader) return null;
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}
function loc(gl, prog, name) {
	const found = gl.getUniformLocation(prog, name) ?? gl.getUniformLocation(prog, `${name}[0]`);
	if (!found) throw new Error(`Missing uniform ${name}`);
	return found;
}
function makeTarget(gl, w, h, internal, format, type) {
	const tex = gl.createTexture();
	const fbo = gl.createFramebuffer();
	if (!tex || !fbo) return null;
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
	const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindTexture(gl.TEXTURE_2D, null);
	if (!ok) {
		gl.deleteTexture(tex);
		gl.deleteFramebuffer(fbo);
		return null;
	}
	return {
		tex,
		fbo
	};
}
function deleteTarget(gl, target) {
	gl.deleteTexture(target.tex);
	gl.deleteFramebuffer(target.fbo);
}
function clamp01(n) {
	return Math.min(1, Math.max(0, n));
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function smoothstep(edge0, edge1, x) {
	const t = clamp01((x - edge0) / (edge1 - edge0));
	return t * t * (3 - 2 * t);
}
var KEY = "wake.settings.v1";
var DEFAULT_SETTINGS = {
	viscosity: 32,
	strength: 64,
	colorMap: DEFAULT_COLOR_MAP
};
function loadSettings() {
	if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return { ...DEFAULT_SETTINGS };
		const parsed = JSON.parse(raw);
		return {
			viscosity: clampNum(parsed.viscosity, 0, 100, DEFAULT_SETTINGS.viscosity),
			strength: clampNum(parsed.strength, 0, 100, DEFAULT_SETTINGS.strength),
			colorMap: isColorMap(parsed.colorMap) ? parsed.colorMap : DEFAULT_SETTINGS.colorMap
		};
	} catch {
		return { ...DEFAULT_SETTINGS };
	}
}
function saveSettings(settings) {
	try {
		localStorage.setItem(KEY, JSON.stringify(settings));
	} catch {}
}
function clampNum(value, min, max, fallback) {
	return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}
function isColorMap(value) {
	return value === "abyss" || value === "tide" || value === "ink" || value === "glacier" || value === "copper";
}
function RippleStage() {
	const canvasRef = (0, import_react.useRef)(null);
	const engineRef = (0, import_react.useRef)(null);
	const cursorRef = (0, import_react.useRef)(null);
	const [settings, setSettings] = (0, import_react.useState)(loadSettings);
	const [hint, setHint] = (0, import_react.useState)(true);
	const [finePointer, setFinePointer] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const applySettings = (0, import_react.useCallback)((next) => {
		setSettings((prev) => {
			const merged = {
				...prev,
				...next
			};
			saveSettings(merged);
			const engine = engineRef.current;
			if (engine) {
				engine.setViscosity(merged.viscosity);
				engine.setStrength(merged.strength);
				engine.setColorMap(merged.colorMap);
			}
			return merged;
		});
	}, []);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		let engine;
		try {
			engine = new RippleEngine(canvas);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to start the surface.");
			return;
		}
		engine.setViscosity(settings.viscosity);
		engine.setStrength(settings.strength);
		engine.setColorMap(settings.colorMap);
		engine.start();
		engineRef.current = engine;
		window.__rippleTest = {
			splash: (x, y) => engine.splash(x, y),
			clear: () => engine.clear(),
			getEnergy: () => engine.getEnergy(),
			setColorMap: (id) => {
				applySettings({ colorMap: id });
			}
		};
		const onResize = () => engine.resize();
		const ro = new ResizeObserver(onResize);
		ro.observe(canvas.parentElement ?? canvas);
		window.addEventListener("resize", onResize);
		window.visualViewport?.addEventListener("resize", onResize);
		const onKey = (event) => {
			if (event.code === "KeyC" || event.code === "Space") {
				const target = event.target;
				if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
				event.preventDefault();
				engine.clear();
			}
		};
		window.addEventListener("keydown", onKey);
		const mq = window.matchMedia("(pointer: fine)");
		const syncPointer = () => setFinePointer(mq.matches);
		syncPointer();
		mq.addEventListener("change", syncPointer);
		const onVis = () => {
			if (document.hidden) engine.pointerUp(-1);
		};
		document.addEventListener("visibilitychange", onVis);
		return () => {
			delete window.__rippleTest;
			ro.disconnect();
			window.removeEventListener("resize", onResize);
			window.visualViewport?.removeEventListener("resize", onResize);
			window.removeEventListener("keydown", onKey);
			mq.removeEventListener("change", syncPointer);
			document.removeEventListener("visibilitychange", onVis);
			engine.destroy();
			engineRef.current = null;
		};
	}, []);
	const localPoint = (event, canvas) => {
		const rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	};
	const moveCursor = (x, y, visible) => {
		const el = cursorRef.current;
		if (!el) return;
		el.style.opacity = visible ? "1" : "0";
		el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
	};
	const onPointerDown = (event) => {
		const canvas = event.currentTarget;
		const engine = engineRef.current;
		if (!engine) return;
		event.preventDefault();
		canvas.setPointerCapture(event.pointerId);
		const { x, y } = localPoint(event.nativeEvent, canvas);
		const coalesced = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent];
		const first = coalesced[0] ?? event.nativeEvent;
		const start = localPoint(first, canvas);
		engine.pointerDown(event.pointerId, start.x, start.y, event.pressure);
		for (let i = 1; i < coalesced.length; i++) {
			const ce = coalesced[i];
			if (!ce) continue;
			const p = localPoint(ce, canvas);
			engine.pointerMove(event.pointerId, p.x, p.y, ce.pressure);
		}
		setHint(false);
		if (event.pointerType === "mouse" || event.pointerType === "pen") moveCursor(x, y, true);
	};
	const onPointerMove = (event) => {
		const canvas = event.currentTarget;
		const { x, y } = localPoint(event.nativeEvent, canvas);
		if (event.pointerType === "mouse" || event.pointerType === "pen") moveCursor(x, y, true);
		const engine = engineRef.current;
		if (!engine || !canvas.hasPointerCapture(event.pointerId)) return;
		const coalesced = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent];
		for (const ce of coalesced) {
			const p = localPoint(ce, canvas);
			engine.pointerMove(event.pointerId, p.x, p.y, ce.pressure);
		}
	};
	const endPointer = (event) => {
		engineRef.current?.pointerUp(event.pointerId);
		if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-full min-h-0 w-full select-none overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: cn("absolute inset-0 size-full touch-none", finePointer && "cursor-none"),
				"aria-label": "Ripple surface",
				onPointerDown,
				onPointerMove,
				onPointerUp: endPointer,
				onPointerCancel: endPointer,
				onPointerLeave: () => moveCursor(0, 0, false),
				onContextMenu: (event) => event.preventDefault()
			}),
			finePointer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: cursorRef,
				className: "ripple-cursor",
				"aria-hidden": "true"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "dock-slot",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlDock, {
					viscosity: settings.viscosity,
					strength: settings.strength,
					colorMap: settings.colorMap,
					onViscosity: (viscosity) => applySettings({ viscosity }),
					onStrength: (strength) => applySettings({ strength }),
					onColorMap: (colorMap) => applySettings({ colorMap }),
					onClear: () => engineRef.current?.clear()
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("hint-copy text-center text-sm text-muted", "transition-opacity duration-[var(--motion-slow)] ease-[var(--ease-smooth-out)]", hint ? "opacity-100" : "opacity-0"),
				children: "Drag across the surface"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-30 flex items-center justify-center bg-bg p-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-sm text-sm text-muted",
					children: error
				})
			}) : null
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "fixed inset-0 overflow-hidden bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RippleStage, {})
	});
}
//#endregion
export { Home as component };
