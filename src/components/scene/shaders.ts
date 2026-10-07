/** Ashima / Stefan Gustavson 3D simplex noise, MIT. */
export const simplex3d = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

/** Displacement used by the liquid blob: slow swells, fine shimmer, and a pointer ripple. */
export const blobDisplacement = /* glsl */ `
uniform float uTime;
uniform vec3 uHit;
uniform float uHitStrength;
uniform float uAmp;

float blobDisp(vec3 p) {
  vec3 n = normalize(p);
  float swell = snoise(n * 1.35 + vec3(0.0, uTime * 0.22, uTime * 0.11)) * 0.26;
  float shimmer = snoise(n * 3.6 - vec3(uTime * 0.35, 0.0, uTime * 0.18)) * 0.055;
  float d = acos(clamp(dot(n, normalize(uHit)), -1.0, 1.0));
  float ripple = uHitStrength * sin(d * 16.0 - uTime * 7.0) * exp(-d * 3.2) * 0.14;
  float dent = -uHitStrength * exp(-d * 6.0) * 0.18;
  return (swell + shimmer) * uAmp + ripple + dent;
}

vec3 blobPoint(vec3 p) {
  return p + normalize(p) * blobDisp(p);
}
`;

export const fluidFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uPointer;
uniform vec2 uTrail[8];
uniform float uTrailAge[8];
uniform float uScroll;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColC;
uniform vec3 uBase;
varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i), f), dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise2(p);
    p = r * p * 2.03 + 11.3;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(1.6, 1.0);
  float t = uTime * 0.045;

  // The pointer and its trail stir the field.
  vec2 stir = vec2(0.0);
  for (int i = 0; i < 8; i++) {
    vec2 d = uv - uTrail[i];
    float age = uTrailAge[i];
    float w = exp(-dot(d, d) * 55.0) * (1.0 - age);
    stir += normalize(d + 1e-4) * w * 0.28;
  }
  vec2 dp = uv - uPointer;
  stir += normalize(dp + 1e-4) * exp(-dot(dp, dp) * 30.0) * 0.18;

  vec2 q = vec2(fbm(p + t + stir), fbm(p - t * 0.7 + vec2(5.2, 1.3)));
  vec2 r = vec2(fbm(p + 2.3 * q + vec2(1.7, 9.2) + t * 0.6), fbm(p + 2.3 * q + vec2(8.3, 2.8) - t * 0.4));
  float f = fbm(p + 2.0 * r - uScroll * 0.6);

  vec3 col = uBase;
  col = mix(col, uColA, smoothstep(0.15, 0.75, f) * 0.55);
  col = mix(col, uColB, smoothstep(0.35, 0.9, length(q)) * 0.45);
  col = mix(col, uColC, smoothstep(0.45, 0.95, r.y) * 0.35);

  // Pointer highlight
  float glow = exp(-dot(dp * vec2(1.6, 1.0), dp * vec2(1.6, 1.0)) * 14.0);
  col += uColB * glow * 0.18;

  float vignette = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(1.4, 1.1)));
  col *= 0.55 + 0.45 * vignette;

  gl_FragColor = vec4(col, 1.0);
}
`;

export const fluidVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
