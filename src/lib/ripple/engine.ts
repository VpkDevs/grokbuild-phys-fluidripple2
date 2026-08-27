import { getPalette, samplePalette, type ColorMapId } from "./palettes";
import { DRAW_FRAG, SIM_FRAG, VERT } from "./shaders";

const MAX_DROPS = 32;
const REST = 0;

type PointerTrail = {
  x: number;
  y: number;
  active: boolean;
};

type GlTarget = {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
};

type GlBackend = {
  kind: "webgl";
  gl: WebGL2RenderingContext;
  vao: WebGLVertexArrayObject;
  simProg: WebGLProgram;
  drawProg: WebGLProgram;
  simUniforms: SimUniforms;
  drawUniforms: DrawUniforms;
  read: GlTarget;
  write: GlTarget;
  encoded: boolean;
  simW: number;
  simH: number;
};

type SimUniforms = {
  uState: WebGLUniformLocation;
  uTexel: WebGLUniformLocation;
  uDamping: WebGLUniformLocation;
  uSpeed: WebGLUniformLocation;
  uEncode: WebGLUniformLocation;
  uDropCount: WebGLUniformLocation;
  uDrops: WebGLUniformLocation;
};

type DrawUniforms = {
  uHeight: WebGLUniformLocation;
  uTexel: WebGLUniformLocation;
  uEncode: WebGLUniformLocation;
  uC0: WebGLUniformLocation;
  uC1: WebGLUniformLocation;
  uC2: WebGLUniformLocation;
  uC3: WebGLUniformLocation;
};

type CpuBackend = {
  kind: "cpu";
  ctx: CanvasRenderingContext2D;
  curr: Float32Array;
  prev: Float32Array;
  pixels: Uint8ClampedArray;
  image: ImageData;
  offscreen: HTMLCanvasElement;
  offCtx: CanvasRenderingContext2D;
  simW: number;
  simH: number;
};

export class RippleEngine {
  private canvas: HTMLCanvasElement;
  private backend: GlBackend | CpuBackend | null = null;
  private raf = 0;
  private running = false;
  private lastTs = 0;
  private accum = 0;
  private viscosity = 0.32;
  private strength = 0.64;
  private colorMap: ColorMapId = "abyss";
  private pointers = new Map<number, PointerTrail>();
  private pending: { x: number; y: number; amp: number; radius: number }[] = [];
  private dropScratch = new Float32Array(MAX_DROPS * 4);
  private cssW = 1;
  private cssH = 1;
  private energy = 0;
  private lost = false;
  private software = false;
  private onLost: ((event: Event) => void) | null = null;
  private onRestored: (() => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  start(): void {
    if (this.running) return;
    this.resize();
    this.seed();
    this.running = true;
    this.lastTs = performance.now();
    const loop = (ts: number) => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (ts - this.lastTs) / 1000);
      this.lastTs = ts;
      this.accum += dt;
      const step = 1 / 60;
      let guard = 0;
      const maxSteps = this.software ? 1 : 4;
      while (this.accum >= step && guard < maxSteps) {
        this.simulate();
        this.accum -= step;
        guard += 1;
      }
      this.render();
    };
    this.raf = requestAnimationFrame(loop);
  }

  destroy(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.pointers.clear();
    this.pending.length = 0;
    if (this.onLost) {
      this.canvas.removeEventListener("webglcontextlost", this.onLost);
    }
    if (this.onRestored) {
      this.canvas.removeEventListener("webglcontextrestored", this.onRestored);
    }
    this.onLost = null;
    this.onRestored = null;
    const backend = this.backend;
    this.backend = null;
    if (backend?.kind === "webgl") this.destroyGl(backend);
  }

  setViscosity(value: number): void {
    this.viscosity = clamp01(value / 100);
  }

  setStrength(value: number): void {
    this.strength = clamp01(value / 100);
  }

  setColorMap(id: ColorMapId): void {
    this.colorMap = id;
  }

  clear(): void {
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

  pointerDown(id: number, cssX: number, cssY: number, pressure = 0.5): void {
    const uv = this.toUv(cssX, cssY);
    this.pointers.set(id, { x: uv.x, y: uv.y, active: true });
    this.queueDrop(uv.x, uv.y, this.pulseAmp(pressure) * 1.15, this.dropRadius());
  }

  pointerMove(id: number, cssX: number, cssY: number, pressure = 0.5): void {
    const uv = this.toUv(cssX, cssY);
    const prev = this.pointers.get(id);
    if (!prev || !prev.active) {
      this.pointers.set(id, { x: uv.x, y: uv.y, active: true });
      this.queueDrop(uv.x, uv.y, this.pulseAmp(pressure), this.dropRadius());
      return;
    }
    this.splatSegment(prev.x, prev.y, uv.x, uv.y, this.pulseAmp(pressure));
    prev.x = uv.x;
    prev.y = uv.y;
  }

  pointerUp(id: number): void {
    const prev = this.pointers.get(id);
    if (prev) prev.active = false;
    this.pointers.delete(id);
  }

  getEnergy(): number {
    return this.energy;
  }

  splash(uvX: number, uvY: number, amp?: number): void {
    this.queueDrop(
      uvX,
      uvY,
      amp ?? this.pulseAmp(0.7) * 1.2,
      this.dropRadius() * 1.1,
    );
  }

  resize(): void {
    const parent = this.canvas.parentElement ?? this.canvas;
    const rect = parent.getBoundingClientRect();
    this.cssW = Math.max(1, rect.width);
    this.cssH = Math.max(1, rect.height);
    if (!this.backend) {
      const gl = this.getGl();
      if (gl) this.software = isSoftwareGl(gl);
    }
    const dpr = Math.min(window.devicePixelRatio || 1, this.software ? 1 : 2);
    const pixelW = Math.max(1, Math.round(this.cssW * dpr));
    const pixelH = Math.max(1, Math.round(this.cssH * dpr));
    if (this.canvas.width !== pixelW || this.canvas.height !== pixelH) {
      this.canvas.width = pixelW;
      this.canvas.height = pixelH;
    }
    const sim = pickSimSize(this.cssW, this.cssH, this.software);
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
    } else if (
      backend?.kind === "cpu" &&
      backend.simW === sim.w &&
      backend.simH === sim.h
    ) {
      return;
    }
    this.initBackend(sim.w, sim.h);
  }

  private initBackend(simW: number, simH: number): void {
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

  private getGl(): WebGL2RenderingContext | null {
    const opts: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    };
    try {
      return (
        this.canvas.getContext("webgl2", { ...opts, desynchronized: true }) ||
        this.canvas.getContext("webgl2", opts)
      );
    } catch {
      return this.canvas.getContext("webgl2", opts);
    }
  }

  private bindContextLoss(): void {
    if (this.onLost) return;
    this.onLost = (event: Event) => {
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

  private buildGl(
    gl: WebGL2RenderingContext,
    simW: number,
    simH: number,
  ): GlBackend | null {
    gl.getExtension("EXT_color_buffer_float");
    gl.getExtension("EXT_color_buffer_half_float");
    gl.getExtension("OES_texture_float_linear");
    this.software = isSoftwareGl(gl);
    const vao = gl.createVertexArray();
    if (!vao) return null;
    gl.bindVertexArray(vao);
    const simProg = compile(gl, VERT, SIM_FRAG);
    const drawProg = compile(gl, VERT, DRAW_FRAG);
    if (!simProg || !drawProg) return null;

    const encodedTry: Array<{
      encoded: boolean;
      internal: number;
      format: number;
      type: number;
    }> = this.software
      ? [
          {
            encoded: true,
            internal: gl.RGBA8,
            format: gl.RGBA,
            type: gl.UNSIGNED_BYTE,
          },
        ]
      : [
          {
            encoded: false,
            internal: gl.RGBA16F,
            format: gl.RGBA,
            type: gl.HALF_FLOAT,
          },
          {
            encoded: false,
            internal: gl.RGBA32F,
            format: gl.RGBA,
            type: gl.FLOAT,
          },
          {
            encoded: true,
            internal: gl.RGBA8,
            format: gl.RGBA,
            type: gl.UNSIGNED_BYTE,
          },
        ];

    let read: GlTarget | null = null;
    let write: GlTarget | null = null;
    let encoded = false;
    for (const spec of encodedTry) {
      read = makeTarget(gl, simW, simH, spec.internal, spec.format, spec.type);
      write = read
        ? makeTarget(gl, simW, simH, spec.internal, spec.format, spec.type)
        : null;
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

    const simUniforms: SimUniforms = {
      uState: loc(gl, simProg, "uState"),
      uTexel: loc(gl, simProg, "uTexel"),
      uDamping: loc(gl, simProg, "uDamping"),
      uSpeed: loc(gl, simProg, "uSpeed"),
      uEncode: loc(gl, simProg, "uEncode"),
      uDropCount: loc(gl, simProg, "uDropCount"),
      uDrops: loc(gl, simProg, "uDrops"),
    };
    const drawUniforms: DrawUniforms = {
      uHeight: loc(gl, drawProg, "uHeight"),
      uTexel: loc(gl, drawProg, "uTexel"),
      uEncode: loc(gl, drawProg, "uEncode"),
      uC0: loc(gl, drawProg, "uC0"),
      uC1: loc(gl, drawProg, "uC1"),
      uC2: loc(gl, drawProg, "uC2"),
      uC3: loc(gl, drawProg, "uC3"),
    };

    const backend: GlBackend = {
      kind: "webgl",
      gl,
      vao,
      simProg,
      drawProg,
      simUniforms,
      drawUniforms,
      read,
      write,
      encoded,
      simW,
      simH,
    };
    this.clearTarget(backend, read);
    this.clearTarget(backend, write);
    return backend;
  }

  private buildCpu(simW: number, simH: number): CpuBackend {
    const ctx = this.canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      throw new Error("Canvas 2D is not available on this device.");
    }
    const offscreen = document.createElement("canvas");
    offscreen.width = simW;
    offscreen.height = simH;
    const offCtx = offscreen.getContext("2d", { alpha: false });
    if (!offCtx) {
      throw new Error("Offscreen canvas is not available on this device.");
    }
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
      simH,
    };
  }

  private destroyGl(backend: GlBackend): void {
    const { gl } = backend;
    gl.deleteProgram(backend.simProg);
    gl.deleteProgram(backend.drawProg);
    gl.deleteVertexArray(backend.vao);
    deleteTarget(gl, backend.read);
    deleteTarget(gl, backend.write);
  }

  private seed(): void {
    const drops: Array<[number, number, number]> = [
      [0.34, 0.42, 0.22],
      [0.62, 0.56, 0.18],
      [0.5, 0.28, 0.14],
      [0.22, 0.68, 0.12],
      [0.78, 0.38, 0.1],
    ];
    for (const [x, y, amp] of drops) {
      this.queueDrop(x, y, amp, 0.028);
    }
    const warmup = this.software ? 6 : 18;
    for (let i = 0; i < warmup; i++) this.simulate();
  }

  private simulate(): void {
    const backend = this.backend;
    if (!backend || this.lost) return;
    const drops = this.consumeDrops();
    const damping = lerp(0.995, 0.935, this.viscosity);
    const speed = lerp(0.26, 0.16, this.viscosity * 0.55);
    if (backend.kind === "webgl") {
      this.simulateGl(backend, drops, damping, speed);
    } else {
      this.simulateCpu(backend, drops, damping, speed);
    }
  }

  private simulateGl(
    backend: GlBackend,
    drops: Float32Array,
    damping: number,
    speed: number,
  ): void {
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

  private simulateCpu(
    backend: CpuBackend,
    drops: Float32Array,
    damping: number,
    speed: number,
  ): void {
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
        const uvx = (x + 0.5) / w;
        const uvy = (y + 0.5) / h;
        for (let d = 0; d < count; d++) {
          const ox = drops[d * 4] ?? 0;
          const oy = drops[d * 4 + 1] ?? 0;
          const amp = drops[d * 4 + 2] ?? 0;
          const rad = drops[d * 4 + 3] ?? 0.02;
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

  private render(): void {
    const backend = this.backend;
    if (!backend || this.lost) return;
    if (backend.kind === "webgl") this.renderGl(backend);
    else this.renderCpu(backend);
  }

  private renderGl(backend: GlBackend): void {
    const { gl } = backend;
    const palette = getPalette(this.colorMap);
    gl.bindVertexArray(backend.vao);
    gl.useProgram(backend.drawProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, backend.read.tex);
    gl.uniform1i(backend.drawUniforms.uHeight, 0);
    gl.uniform2f(
      backend.drawUniforms.uTexel,
      1 / backend.simW,
      1 / backend.simH,
    );
    gl.uniform1f(backend.drawUniforms.uEncode, backend.encoded ? 1 : 0);
    gl.uniform3f(
      backend.drawUniforms.uC0,
      palette.stops[0][0],
      palette.stops[0][1],
      palette.stops[0][2],
    );
    gl.uniform3f(
      backend.drawUniforms.uC1,
      palette.stops[1][0],
      palette.stops[1][1],
      palette.stops[1][2],
    );
    gl.uniform3f(
      backend.drawUniforms.uC2,
      palette.stops[2][0],
      palette.stops[2][1],
      palette.stops[2][2],
    );
    gl.uniform3f(
      backend.drawUniforms.uC3,
      palette.stops[3][0],
      palette.stops[3][1],
      palette.stops[3][2],
    );
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.energy = Math.max(this.energy * 0.96, this.pending.length > 0 ? 0.05 : 0);
  }

  private renderCpu(backend: CpuBackend): void {
    const { simW: w, simH: h, curr, pixels } = backend;
    const palette = getPalette(this.colorMap);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
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
        const llen = Math.hypot(0.38, 0.62, 0.72);
        const Lx = 0.38 / llen;
        const Ly = 0.62 / llen;
        const Lz = 0.72 / llen;
        const diff = 0.38 + 0.62 * Math.max(nxx * Lx + nyy * Ly + nz * Lz, 0);
        const hlen = Math.hypot(Lx, Ly, Lz + 1);
        const spec = Math.pow(
          Math.max(nxx * (Lx / hlen) + nyy * (Ly / hlen) + nz * ((Lz + 1) / hlen), 0),
          72,
        );
        const fres = Math.pow(1 - Math.max(nz, 0), 2.6);
        const t = 0.46 + hh * 1.35 + spec * 0.22;
        const albedo = samplePalette(palette.stops, t);
        let r = albedo[0] * diff + spec * 0.9 + fres * albedo[0] * 0.28;
        let g = albedo[1] * diff + spec * 0.93 + fres * albedo[1] * 0.28;
        let b = albedo[2] * diff + spec * 0.96 + fres * albedo[2] * 0.28;
        const cx = x / w - 0.5;
        const cy = y / h - 0.5;
        const vig = smoothstep(1.15, 0.22, Math.hypot(cx, cy) * 1.15);
        const shade = 0.58 + 0.42 * vig;
        r *= shade;
        g *= shade;
        b *= shade;
        const pi = i * 4;
        pixels[pi] = Math.round(clamp01(r) * 255);
        pixels[pi + 1] = Math.round(clamp01(g) * 255);
        pixels[pi + 2] = Math.round(clamp01(b) * 255);
        pixels[pi + 3] = 255;
      }
    }
    backend.offCtx.putImageData(backend.image, 0, 0);
    backend.ctx.imageSmoothingEnabled = true;
    backend.ctx.imageSmoothingQuality = "high";
    backend.ctx.drawImage(
      backend.offscreen,
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
  }

  private consumeDrops(): Float32Array {
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

  private dropCountFrom(drops: Float32Array): number {
    let n = 0;
    for (let i = 0; i < MAX_DROPS; i++) {
      if ((drops[i * 4 + 2] ?? 0) !== 0) n = i + 1;
    }
    return n;
  }

  private queueDrop(x: number, y: number, amp: number, radius: number): void {
    if (this.pending.length >= 96) this.pending.shift();
    this.pending.push({
      x: clamp01(x),
      y: clamp01(y),
      amp,
      radius,
    });
    this.energy = Math.max(this.energy, Math.abs(amp));
  }

  private splatSegment(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    amp: number,
  ): void {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.hypot(dx, dy);
    if (dist < 1e-5) {
      this.queueDrop(x1, y1, amp * 0.35, this.dropRadius());
      return;
    }
    const sim = this.backend;
    const cell = sim ? 1 / Math.max(sim.simW, sim.simH) : 0.004;
    const steps = Math.min(
      MAX_DROPS,
      Math.max(1, Math.ceil(dist / (cell * 0.85))),
    );
    const scaled = (amp * Math.min(1.4, 0.35 + dist * 8)) / Math.sqrt(steps);
    const radius = this.dropRadius();
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      this.queueDrop(x0 + dx * t, y0 + dy * t, scaled, radius);
    }
  }

  private pulseAmp(pressure: number): number {
    const p = pressure > 0 && pressure <= 1 ? 0.45 + pressure * 0.7 : 1;
    return lerp(0.045, 0.28, this.strength) * p;
  }

  private dropRadius(): number {
    return lerp(0.016, 0.034, this.strength);
  }

  private toUv(cssX: number, cssY: number): { x: number; y: number } {
    return {
      x: this.cssW > 0 ? cssX / this.cssW : 0,
      y: this.cssH > 0 ? 1 - cssY / this.cssH : 0,
    };
  }

  private clearTarget(
    backend: Pick<GlBackend, "gl" | "encoded">,
    target: GlTarget,
  ): void {
    const { gl } = backend;
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    if (backend.encoded) gl.clearColor(0.5, 0.5, 0.5, 1);
    else gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

function pickSimSize(
  cssW: number,
  cssH: number,
  software: boolean,
): { w: number; h: number } {
  const cores = navigator.hardwareConcurrency || 4;
  const area = cssW * cssH;
  const low = software || (cores <= 4 && area > 1.4e6);
  const long = software ? 192 : low ? 288 : 448;
  const aspect = cssW / Math.max(1, cssH);
  let w: number;
  let h: number;
  if (aspect >= 1) {
    w = long;
    h = Math.max(software ? 96 : 160, Math.round(long / aspect));
  } else {
    h = long;
    w = Math.max(software ? 96 : 160, Math.round(long * aspect));
  }
  return { w: quantize(w), h: quantize(h) };
}

function quantize(n: number): number {
  return Math.max(96, Math.round(n / 8) * 8);
}

function compile(
  gl: WebGL2RenderingContext,
  vertSrc: string,
  fragSrc: string,
): WebGLProgram | null {
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

function makeShader(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
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

function loc(
  gl: WebGL2RenderingContext,
  prog: WebGLProgram,
  name: string,
): WebGLUniformLocation {
  const found =
    gl.getUniformLocation(prog, name) ??
    gl.getUniformLocation(prog, `${name}[0]`);
  if (!found) {
    throw new Error(`Missing uniform ${name}`);
  }
  return found;
}

function makeTarget(
  gl: WebGL2RenderingContext,
  w: number,
  h: number,
  internal: number,
  format: number,
  type: number,
): GlTarget | null {
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
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    tex,
    0,
  );
  const ok =
    gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  if (!ok) {
    gl.deleteTexture(tex);
    gl.deleteFramebuffer(fbo);
    return null;
  }
  return { tex, fbo };
}

function deleteTarget(gl: WebGL2RenderingContext, target: GlTarget): void {
  gl.deleteTexture(target.tex);
  gl.deleteFramebuffer(target.fbo);
}

function isSoftwareGl(gl: WebGL2RenderingContext): boolean {
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = info
    ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || "")
    : "";
  const vendor = info
    ? String(gl.getParameter(info.UNMASKED_VENDOR_WEBGL) || "")
    : "";
  return /swiftshader|llvmpipe|softpipe|microsoft basic render|cpu/i.test(
    `${renderer} ${vendor}`,
  );
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}
