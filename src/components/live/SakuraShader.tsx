'use client'

import { useEffect, useRef } from 'react'

/**
 * GPU sakura — a single full-screen quad rendered by a fragment shader.
 * Every petal is computed entirely on the GPU (position, rotation, depth,
 * sway, wind). One draw call ⇒ thousands of effective ops at 60fps.
 *
 * Robust: silently no-ops if WebGL is unavailable.
 */
const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
uniform vec2  uRes;      // canvas CSS size (px)
uniform float uTime;    // seconds
uniform vec2  uWind;    // pointer-derived wind (-1..1), eased
uniform float uDPR;

// hash
float h1(float n){ return fract(sin(n)*43758.5453123); }

// 5-petal flower signed distance.
// p in local space (flower centered at origin), r = outer radius.
float flower(vec2 p, float r) {
  float rad = length(p);
  float a = atan(p.y, p.x);
  // 5 lobes
  float lobe = 0.5 + 0.5*cos(a*5.0);
  float rEdge = r * (0.38 + 0.50*lobe);
  // tiny notch at the very tip of each petal
  float notch = smoothstep(0.86, 1.0, lobe) * 0.10;
  rEdge -= notch * r;
  return rad - rEdge;
}

void main() {
  vec2 px = gl_FragCoord.xy;
  // gl_FragCoord origin is bottom-left; flip y so it matches CSS top-left
  px.y = uRes.y - px.y;

  vec3 outCol = vec3(0.0);
  float outA = 0.0;

  const int N = 30;
  for (int i = 0; i < N; i++) {
    float fi = float(i);
    float s1 = h1(fi*1.37 + 0.123);
    float s2 = h1(fi*2.71 + 0.7);
    float s3 = h1(fi*0.91 + 3.3);
    float depth = s3;                       // 0 (far) .. 1 (near)

    // size & speed scale with depth (parallax)
    float size = mix(16.0, 46.0, depth) * uDPR;
    float fall = mix(14.0, 48.0, depth);    // px / sec
    float swayAmp = mix(18.0, 46.0, depth);

    // base x across the screen
    float baseX = h1(fi*5.3 + 1.1) * (uRes.x + size*4.0) - size*2.0;
    // sway
    float swayPhase = fi*1.7 + uTime*0.7;
    float sway = sin(swayPhase) * swayAmp;

    // y: falls from top to bottom, wraps. stagger start by hash.
    float startY = h1(fi*7.7) * (uRes.y + size*6.0);
    float y = mod(startY + uTime*fall, uRes.y + size*6.0) - size*3.0;

    // wind from pointer (near petals drift more)
    float wind = uWind.x * (70.0 * (0.35 + depth));
    float x = baseX + sway + wind + (s2 - 0.5) * 24.0;

    // rotation
    float rot = uTime * (0.25 + s1*0.6) * (s2 > 0.5 ? 1.0 : -1.0) + fi * 1.3;

    // vector from petal center to this pixel, in petal-local (rotated) space
    vec2 d = px - vec2(x, y);
    float cs = cos(-rot), sn = sin(-rot);
    vec2 lp = vec2(cs*d.x - sn*d.y, sn*d.x + cs*d.y);

    float dist = flower(lp, size);

    // soft fill + outer glow halo
    float soft = 1.6 * uDPR;
    float fill = 1.0 - smoothstep(-soft, soft, dist);
    float glow = exp(-max(dist, 0.0) / (size * 0.55));

    float a = clamp(fill * 0.92 + glow * 0.30, 0.0, 1.0);
    a *= mix(0.45, 1.0, depth);   // far petals fainter

    // warm sakura colour — brighter near centre, deeper at edges
    vec3 base = mix(vec3(1.0, 0.72, 0.82), vec3(1.0, 0.92, 0.95), fill);
    vec3 col = base * (0.9 + 0.35 * glow);

    // over-blend accumulation (front-to-back)
    col *= a;
    outCol = outCol + (1.0 - outA) * col;
    outA = outA + (1.0 - outA) * a;
  }

  gl_FragColor = vec4(outCol, outA);
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

export function SakuraShader() {
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

    // fullscreen quad
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uWind = gl.getUniformLocation(prog, 'uWind')
    const uDPR = gl.getUniformLocation(prog, 'uDPR')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA) // premultiplied over-blend

    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = canvas.clientWidth
      h = canvas.clientHeight
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
      // ease wind
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.04
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.04
      const t = (performance.now() - t0) / 1000
      gl.useProgram(prog)
      gl.uniform1f(uTime, t)
      gl.uniform2f(uWind, pointer.current.x, pointer.current.y)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
    />
  )
}
