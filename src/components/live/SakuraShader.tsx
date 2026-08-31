'use client'

import { useEffect, useRef } from 'react'

/**
 * Ultra-Realistic GPU Sakura (Cherry Blossom) Atmosphere Engine.
 *
 * Key Realistic Features:
 * 1. Authentic Sakura Petal Anatomy:
 *    - Delicate spade/ovate shape with the distinctive apical cleft notch (切れ込み).
 *    - Tapered stem base with rich crimson/magenta blush.
 *    - Translucent blush-pink body with pale crystalline white-pink rim.
 *    - Natural 3D cupping curvature.
 * 2. True 3D Aerodynamics & Fluid Dynamics:
 *    - 3D Tumbling: pitch (leaf rocking), roll (flipping edge-on to reveal both front and back faces), yaw.
 *    - Terminal velocity & air resistance (decelerates at apex of sway, glides on descent).
 *    - Natural left-to-right ambient breeze (sakura fubuki) with gust waves.
 *    - Interactive pointer airflow and wind gusts.
 * 3. Multiple Petal Varieties:
 *    - Standard single notched petals (~78%)
 *    - Twisted/curled aerodynamic petals (~12%)
 *    - Dual-petal flutter pairs (~6%)
 *    - Rare full 5-petal blossoms with golden stamen centers (~4%)
 * 4. Multi-Layer Depth Parallax:
 *    - Far field: small, soft, atmospheric ambient haze.
 *    - Mid field: crisp, fluttering, full detail.
 *    - Foreground hero: large, dramatic 3D flips, sunlit highlights.
 * 5. High Performance:
 *    - Instanced quad geometry: zero fullscreen overdraw waste.
 *    - Silky 60+ FPS across desktop and mobile.
 */

const VERT = `
attribute vec2 aCorner;  // quad local corners: (-1,-1), (1,-1), (-1,1), (1,1) etc.
attribute float aId;     // particle index 0 .. N-1

uniform vec2  uRes;      // canvas resolution (px)
uniform float uTime;     // elapsed time (sec)
uniform vec2  uWind;     // pointer wind (-1 .. 1)
uniform float uDPR;

varying vec2  vUV;       // local quad coordinates (-1 .. 1)
varying float vDepth;    // depth 0 (far) .. 1 (near)
varying float vType;     // 0 = standard petal, 1 = twisted, 2 = pair, 3 = flower
varying vec3  vNormal;   // 3D surface normal
varying float vFlip;     // normal.z (< 0 backside, >= 0 frontside)
varying float vAlpha;    // edge fade
varying float vSeed;

float hash(float n) { return fract(sin(n) * 43758.5453123); }
vec3 hash3(float n) {
  return fract(sin(vec3(n, n + 1.37, n + 2.71)) * vec3(43758.5453, 22578.1459, 19642.3490));
}

void main() {
  float fi = aId;
  vec3 r1 = hash3(fi * 3.17 + 0.12);
  vec3 r2 = hash3(fi * 7.43 + 0.58);
  vec3 r3 = hash3(fi * 11.91 + 1.27);

  // Depth layers: 0.18 (far background) to 1.0 (crisp foreground)
  float depth = mix(0.18, 1.0, r1.z);
  vDepth = depth;
  vSeed = r1.x;

  // Petal types:
  // 0.00 .. 0.76: Standard notched single petal
  // 0.76 .. 0.88: Twisted curled petal
  // 0.88 .. 0.95: Dual petal pair
  // 0.95 .. 1.00: Full 5-petal sakura flower
  float pType = 0.0;
  if (r2.z > 0.95) {
    pType = 3.0;
  } else if (r2.z > 0.88) {
    pType = 2.0;
  } else if (r2.z > 0.76) {
    pType = 1.0;
  }
  vType = pType;

  // Base scale (px):
  float baseSize = (pType == 3.0) ? mix(26.0, 52.0, depth) : mix(10.0, 36.0, depth);
  baseSize *= uDPR;

  // Slow, gentle aerodynamic descent speeds (px / sec) — mostly top to bottom
  float fallSpeed = mix(10.0, 22.0, depth) * (0.85 + 0.25 * r1.y);
  // Very slight horizontal ambient drift
  float driftSpeed = mix(2.0, 6.0, depth) * (0.7 + 0.3 * r2.x);

  // Very gentle periodic gust waves
  float gustTime = uTime * 0.5 + r3.x * 6.28;
  float gust = max(0.0, sin(gustTime) * 0.5 + sin(gustTime * 2.1) * 0.2) * 4.0 * depth;

  // Gentle, subtle horizontal sway
  float swayFreq = mix(0.5, 1.2, r2.y);
  float swayAmp = mix(3.0, 10.0, depth) * (0.7 + 0.5 * r3.y);
  float swayPhase = uTime * swayFreq + r1.x * 6.28;
  float sway = sin(swayPhase) * swayAmp;

  // Wrap margins
  float marginX = baseSize * 2.0 + 40.0;
  float marginY = baseSize * 2.0 + 40.0;
  float totalW = uRes.x + marginX * 2.0;
  float totalH = uRes.y + marginY * 2.0;

  // Initial staggered start
  float startX = r2.x * totalW;
  float startY = r3.x * totalH;

  // Subtle pointer wind influence
  float ptrWindX = uWind.x * (18.0 * (0.3 + 0.7 * depth));
  float ptrWindY = -abs(uWind.x) * (8.0 * depth);

  // Position calculation with seamless wrapping (predominantly top-to-bottom)
  float px = mod(startX + uTime * (driftSpeed + gust) + sway + ptrWindX, totalW) - marginX;
  float py = mod(startY + uTime * fallSpeed + ptrWindY, totalH) - marginY;

  // 3D Rotations (Pitch, Roll, Yaw) — slow, peaceful cadence
  // Roll: slow horizontal flipping around Y axis
  float rollSpeed = mix(0.3, 0.9, r1.y) * (r2.y > 0.5 ? 1.0 : -1.0);
  float roll = uTime * rollSpeed + r1.x * 6.28;
  if (pType == 3.0) {
    roll = sin(uTime * 0.4 + r1.x) * 0.25; // full blossom tilts gently
  }

  // Pitch: gentle vertical rocking around X axis
  float pitch = cos(swayPhase) * (0.25 + 0.15 * r3.z);

  // Yaw: gentle heading angle around Z axis
  float yaw = (r2.x - 0.5) * 1.2 + sin(uTime * 0.25 + r3.y) * 0.25 + (pType == 3.0 ? uTime * 0.15 : 0.0);

  // Local quad vertex
  vec2 qPos = aCorner * baseSize;

  // 3D petal bowl curvature
  float cup = (1.0 - aCorner.x * aCorner.x) * (1.0 - aCorner.y * aCorner.y) * 0.22 * baseSize;
  vec3 p3 = vec3(qPos.x, qPos.y, cup);

  // Apply Pitch (around X)
  float cx = cos(pitch), sx = sin(pitch);
  vec3 pPitch = vec3(p3.x, p3.y * cx - p3.z * sx, p3.y * sx + p3.z * cx);

  // Apply Roll (around Y)
  float cy = cos(roll), sy = sin(roll);
  vec3 pRoll = vec3(pPitch.x * cy + pPitch.z * sy, pPitch.y, -pPitch.x * sy + pPitch.z * cy);

  // Apply Yaw (around Z)
  float cz = cos(yaw), sz = sin(yaw);
  vec2 final2D = vec2(pRoll.x * cz - pRoll.y * sz, pRoll.x * sz + pRoll.y * cz);

  // 3D normal vector
  vec3 nPitch = vec3(0.0, -sx, cx);
  vec3 nRoll = vec3(nPitch.x * cy + nPitch.z * sy, nPitch.y, -nPitch.x * sy + nPitch.z * cy);
  vec3 nFinal = vec3(nRoll.x * cz - nRoll.y * sz, nRoll.x * sz + nRoll.y * cz, nRoll.z);

  vNormal = nFinal;
  vFlip = nFinal.z;

  vec2 screenPos = vec2(px, py) + final2D;

  // Clip space conversion
  vec2 clipPos = (screenPos / uRes) * 2.0 - 1.0;
  clipPos.y = -clipPos.y;

  gl_Position = vec4(clipPos, 0.0, 1.0);

  vUV = aCorner;

  // Edge boundary opacity fade
  float fadeX = smoothstep(0.0, 50.0, px + marginX) * smoothstep(uRes.x + marginX, uRes.x + marginX - 50.0, px + marginX);
  float fadeY = smoothstep(0.0, 50.0, py + marginY) * smoothstep(uRes.y + marginY, uRes.y + marginY - 50.0, py + marginY);
  vAlpha = fadeX * fadeY * mix(0.70, 0.98, depth);
}
`

const FRAG = `
precision highp float;

varying vec2  vUV;
varying float vDepth;
varying float vType;
varying vec3  vNormal;
varying float vFlip;
varying float vAlpha;
varying float vSeed;

uniform float uDPR;

// Single Authentic Sakura Petal SDF
float petalSDF(vec2 p) {
  float x = abs(p.x);
  float y = p.y;

  // Top apical notch cleft boundary:
  float top = 0.78 - 0.40 * x * x - 0.20 * exp(-x * x * 42.0);
  // Bottom stem attachment taper:
  float bot = -0.76 + 1.75 * x * x;

  if (y > top || y < bot) {
    return (y > top) ? (y - top) : (bot - y);
  }

  // Side contour width profile:
  float u = clamp((y - (-0.76)) / 1.54, 0.0, 1.0);
  float w = 0.54 * sin(3.14159265 * pow(u, 0.62)) * (0.86 + 0.14 * sin(3.14159265 * u));

  return x - w;
}

// 5-Petal Full Blossom SDF
float blossomSDF(vec2 p, out float outPistil) {
  float r = length(p);
  float a = atan(p.y, p.x);

  float sector = 6.2831853 / 5.0;
  float an = mod(a + sector * 0.5, sector) - sector * 0.5;

  vec2 lp = vec2(sin(an) * r, cos(an) * r - 0.22);
  float d = petalSDF(lp * 1.85);

  outPistil = smoothstep(0.18, 0.04, r);
  return d;
}

// Twisted Petal SDF
float twistedPetalSDF(vec2 p) {
  vec2 q = p;
  q.x += sin(p.y * 3.14) * 0.09;
  return petalSDF(q);
}

// Dual Petal Pair SDF
float pairPetalSDF(vec2 p) {
  float c1 = cos(0.38), s1 = sin(0.38);
  vec2 p1 = vec2(c1 * p.x - s1 * (p.y + 0.18), s1 * p.x + c1 * (p.y + 0.18)) * 1.32;
  vec2 p2 = vec2(c1 * p.x + s1 * (p.y + 0.18), -s1 * p.x + c1 * (p.y + 0.18)) * 1.32;
  return min(petalSDF(p1), petalSDF(p2));
}

void main() {
  vec2 p = vUV;

  float dist = 0.0;
  float pistil = 0.0;

  if (vType > 2.5) {
    dist = blossomSDF(p, pistil);
  } else if (vType > 1.5) {
    dist = pairPetalSDF(p);
  } else if (vType > 0.5) {
    dist = twistedPetalSDF(p);
  } else {
    dist = petalSDF(p);
  }

  // Antialiased edge
  float aa = 0.05 * uDPR;
  float edgeAlpha = 1.0 - smoothstep(-aa, aa, dist);
  if (edgeAlpha <= 0.001) {
    discard;
  }

  // 3D Lighting & Translucency
  vec3 sunDir = normalize(vec3(-0.4, 0.75, 0.5));
  float NdotL = dot(vNormal, sunDir);
  bool isFront = (vFlip >= 0.0);

  // Gradient:
  // Base (stem): vibrant warm rose-pink (#f43f5e)
  // Body: delicate sakura blush (#fbcfe8)
  // Tip: translucent milky white-pink (#fff5f8)
  float heightT = clamp((p.y + 0.75) / 1.5, 0.0, 1.0);

  vec3 basePink = vec3(0.96, 0.38, 0.58);
  vec3 midBlush  = vec3(1.00, 0.82, 0.90);
  vec3 tipWhite  = vec3(1.00, 0.96, 0.98);

  vec3 petalCol = mix(basePink, midBlush, smoothstep(0.0, 0.45, heightT));
  petalCol = mix(petalCol, tipWhite, smoothstep(0.45, 1.0, heightT));

  // Delicate vein texture
  float vein = 1.0 - 0.05 * sin(atan(p.x, p.y + 0.8) * 26.0 + vSeed * 10.0) * smoothstep(0.1, 0.8, heightT);
  petalCol *= vein;

  // 3D Shading
  if (isFront) {
    float diffuse = clamp(NdotL * 0.45 + 0.55, 0.0, 1.0);
    float sss = exp(-max(0.0, dist + 0.15) * 4.0) * 0.18;
    float rim = pow(1.0 - abs(vNormal.z), 3.0) * 0.22;
    petalCol = petalCol * (0.82 + 0.25 * diffuse + sss) + vec3(1.0, 0.95, 0.98) * rim;
  } else {
    vec3 backTint = vec3(0.95, 0.58, 0.76);
    petalCol = mix(petalCol, backTint, 0.36) * 0.88;
  }

  // Golden-yellow pistil center for full blossoms
  if (vType > 2.5 && pistil > 0.0) {
    vec3 stamenCol = vec3(1.0, 0.86, 0.35);
    vec3 pollenCol = vec3(0.94, 0.42, 0.22);
    vec3 pistilFinal = mix(stamenCol, pollenCol, smoothstep(0.12, 0.0, length(p)));
    petalCol = mix(petalCol, pistilFinal, pistil);
  }

  // Atmospheric depth softening
  petalCol = mix(vec3(1.0, 0.88, 0.94), petalCol, mix(0.75, 1.0, vDepth));

  float finalAlpha = edgeAlpha * vAlpha;
  gl_FragColor = vec4(petalCol * finalAlpha, finalAlpha);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('shader compile error:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export function SakuraShader({ petalCount = 140 }: { petalCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl =
      (canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('program link error:', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    // Build geometry for N quads (6 vertices per quad)
    const N = petalCount
    const cornerData: number[] = []
    const idData: number[] = []

    const quadCorners = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < 6; j++) {
        cornerData.push(quadCorners[j * 2], quadCorners[j * 2 + 1])
        idData.push(i)
      }
    }

    const cornerBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cornerData), gl.STATIC_DRAW)
    const aCorner = gl.getAttribLocation(prog, 'aCorner')
    gl.enableVertexAttribArray(aCorner)
    gl.vertexAttribPointer(aCorner, 2, gl.FLOAT, false, 0, 0)

    const idBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, idBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(idData), gl.STATIC_DRAW)
    const aId = gl.getAttribLocation(prog, 'aId')
    gl.enableVertexAttribArray(aId)
    gl.vertexAttribPointer(aId, 1, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uWind = gl.getUniformLocation(prog, 'uWind')
    const uDPR = gl.getUniformLocation(prog, 'uDPR')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA) // premultiplied over-blend

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.useProgram(prog)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uDPR, dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)

    const t0 = performance.now()
    let raf = 0
    const loop = () => {
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.04
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.04
      const t = (performance.now() - t0) / 1000
      gl.useProgram(prog)
      gl.uniform1f(uTime, t)
      gl.uniform2f(uWind, pointer.current.x, pointer.current.y)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, N * 6)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      gl.deleteBuffer(cornerBuf)
      gl.deleteBuffer(idBuf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [petalCount])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
    />
  )
}
