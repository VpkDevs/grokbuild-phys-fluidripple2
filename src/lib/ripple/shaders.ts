export const VERT = `#version 300 es
precision highp float;
const vec2 POS[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
out vec2 vUv;
void main() {
  vec2 p = POS[gl_VertexID];
  gl_Position = vec4(p, 0.0, 1.0);
  vUv = p * 0.5 + 0.5;
}
`;

export const SIM_FRAG = `#version 300 es
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
    float on = step(float(i) + 0.5, float(uDropCount));
    vec4 d = uDrops[i];
    vec2 delta = uv - d.xy;
    float rad2 = max(d.w * d.w, 1.0e-8);
    float bump = d.z * exp(-dot(delta, delta) / rad2);
    next += bump * on;
  }

  next = clamp(next, -1.8, 1.8);
  vec2 packed = store(next, h);
  fragColor = vec4(packed, 0.0, 1.0);
}
`;

export const DRAW_FRAG = `#version 300 es
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
