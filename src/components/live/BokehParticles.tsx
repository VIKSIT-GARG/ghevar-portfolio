'use client'

import { useEffect, useRef } from 'react'

/**
 * GPU light haze — drifting bokeh orbs + soft animated atmosphere,
 * all in one fragment shader on a fullscreen quad. Additive glow.
 * Replaces the old Canvas2D particle system.
 * Robust: silently no-ops if WebGL is unavailable.
 */
const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`
const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uWind;
uniform float uDPR;

float h1(float n){ return fract(sin(n)*43758.5453123); }

// smooth value noise (cheap)
float vnoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = h1(i.x*12.1 + i.y*3.7);
  float b = h1((i.x+1.0)*12.1 + i.y*3.7);
  float c = h1(i.x*12.1 + (i.y+1.0)*3.7);
  float d = h1((i.x+1.0)*12.1 + (i.y+1.0)*3.7);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

void main() {
  vec2 px = gl_FragCoord.xy;
  px.y = uRes.y - px.y;

  vec3 col = vec3(0.0);

  // soft animated haze (two octaves)
  float n1 = vnoise(px*0.004 + vec2(uTime*0.02, -uTime*0.015));
  float n2 = vnoise(px*0.011 - vec2(uTime*0.01, uTime*0.02));
  float haze = n1*0.6 + n2*0.4;
  col += vec3(1.0, 0.82, 0.90) * haze * 0.10;

  // drifting bokeh orbs (additive)
  const int N = 18;
  for (int i = 0; i < N; i++) {
    float fi = float(i);
    float s1 = h1(fi*1.71 + 0.5);
    float s2 = h1(fi*3.13 + 1.9);
    float s3 = h1(fi*0.77 + 4.2);

    float r = mix(26.0, 95.0, s1) * uDPR;
    float baseX = h1(fi*5.9+2.1) * uRes.x;
    // drift upward slowly, wrap
    float speed = mix(6.0, 20.0, s2);
    float yoff = mod(h1(fi*8.1)*uRes.y + uTime*speed, uRes.y + r*4.0) - r*2.0;
    float xoff = baseX + sin(uTime*0.3 + fi*2.0) * (30.0 + 40.0*s3) + uWind.x * (40.0*s3);

    vec2 c = vec2(xoff, yoff);
    float d = length(px - c);
    // gaussian-ish orb
    float orb = exp(-(d*d) / (r*r*0.6));
    // twinkle
    float tw = 0.55 + 0.45*sin(uTime*(0.8+s2*1.5) + fi*3.0);
    vec3 oc = mix(vec3(1.0,0.92,0.96), vec3(1.0,0.74,0.86), s2);
    col += oc * orb * tw * 0.22;
  }

  // gentle top glow wash
  float topG = smoothstep(uRes.y, uRes.y*0.2, px.y);
  col += vec3(1.0, 0.78, 0.88) * topG * 0.05;

  float a = clamp(max(max(col.r, col.g), col.b), 0.0, 0.85);
  gl_FragColor = vec4(col, a);
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

export function BokehParticles({ count = 18 }: { count?: number }) {
  void count
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
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

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
      className="pointer-events-none fixed inset-0 z-10 h-full w-full"
    />
  )
}
