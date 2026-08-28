'use client'

import { useEffect, useRef } from 'react'

type Orb = {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  alpha: number
  twPhase: number
  twSpeed: number
  hue: number
}

/**
 * Soft bokeh light orbs drifting upward like floating dust / fireflies.
 * Rendered on a canvas for cheap compositing of many translucent circles.
 */
export function BokehParticles({ count = 38 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const orbs: Orb[] = []

    const makeOrb = (): Orb => {
      const r = 14 + Math.random() * 70
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r,
        vy: -0.08 - Math.random() * 0.22,
        vx: (Math.random() - 0.5) * 0.12,
        alpha: 0.05 + Math.random() * 0.22,
        twPhase: Math.random() * Math.PI * 2,
        twSpeed: 0.005 + Math.random() * 0.012,
        hue: 330 + Math.random() * 30,
      }
    }

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      while (orbs.length < count) orbs.push(makeOrb())
      while (orbs.length > count) orbs.pop()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      for (const o of orbs) {
        o.x += o.vx
        o.y += o.vy
        o.twPhase += o.twSpeed
        const tw = 0.55 + Math.sin(o.twPhase) * 0.45
        const a = o.alpha * tw

        if (o.y < -o.r) {
          o.y = h + o.r
          o.x = Math.random() * w
        }
        if (o.x < -o.r) o.x = w + o.r
        if (o.x > w + o.r) o.x = -o.r

        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        grad.addColorStop(0, `hsla(${o.hue}, 100%, 96%, ${a})`)
        grad.addColorStop(0.5, `hsla(${o.hue}, 95%, 90%, ${a * 0.5})`)
        grad.addColorStop(1, `hsla(${o.hue}, 90%, 85%, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full"
    />
  )
}
