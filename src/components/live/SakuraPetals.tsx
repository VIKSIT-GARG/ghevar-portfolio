'use client'

import { useEffect, useRef } from 'react'

type Petal = {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  angle: number
  spin: number
  sway: number
  swayPhase: number
  opacity: number
  hue: number
  depth: number // 0..1, affects parallax / size
}

/**
 * Falling sakura petals rendered on a canvas.
 * - Reacts to a gentle wind that follows the pointer (parallax-like).
 * - Depth-based sizing + blur for a dreamy dof effect.
 */
export function SakuraPetals({ count = 70 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const petals: Petal[] = []

    const makePetal = (initial = false): Petal => {
      const depth = Math.random()
      const size = 6 + depth * 12
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -size - Math.random() * h * 0.4,
        size,
        speedY: 0.35 + depth * 1.1,
        speedX: (Math.random() - 0.5) * 0.4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.04,
        sway: 0.4 + Math.random() * 1.1,
        swayPhase: Math.random() * Math.PI * 2,
        opacity: 0.35 + depth * 0.55,
        hue: 330 + Math.random() * 20,
        depth,
      }
    }

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const target = Math.round(count * Math.min(1.4, (w * h) / (1280 * 800)))
      while (petals.length < target) petals.push(makePetal(true))
      while (petals.length > target) petals.pop()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.current.tx = (e.clientX - rect.left) / rect.width - 0.5
      pointer.current.ty = (e.clientY - rect.top) / rect.height - 0.5
    }
    window.addEventListener('pointermove', onMove)

    let t = 0
    const draw = () => {
      t += 1
      ctx.clearRect(0, 0, w, h)

      // ease pointer for soft wind
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.04
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.04
      const windX = pointer.current.x * 26

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i]
        p.swayPhase += 0.01
        p.x += p.speedX + Math.sin(p.swayPhase) * p.sway * 0.4 + windX * 0.01 * (0.4 + p.depth)
        p.y += p.speedY
        p.angle += p.spin

        if (p.y > h + p.size) {
          Object.assign(p, makePetal(false))
        }
        if (p.x > w + p.size) p.x = -p.size
        if (p.x < -p.size) p.x = w + p.size

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.globalAlpha = p.opacity

        // soft depth blur for far petals
        if (p.depth < 0.35) ctx.filter = 'blur(1.2px)'

        // petal shape — a little five-petal sakura
        const s = p.size
        const grad = ctx.createLinearGradient(-s, -s, s, s)
        grad.addColorStop(0, `hsla(${p.hue}, 90%, 92%, 0.95)`)
        grad.addColorStop(0.5, `hsla(${p.hue + 6}, 85%, 86%, 0.95)`)
        grad.addColorStop(1, `hsla(${p.hue - 8}, 80%, 78%, 0.9)`)
        ctx.fillStyle = grad

        ctx.beginPath()
        for (let k = 0; k < 5; k++) {
          const a = (Math.PI * 2 * k) / 5 - Math.PI / 2
          const px = Math.cos(a) * s * 0.5
          const py = Math.sin(a) * s * 0.5
          ctx.moveTo(0, 0)
          ctx.quadraticCurveTo(px * 1.4, py * 1.4, px, py)
          ctx.quadraticCurveTo(px * 0.6, py * 0.6, 0, 0)
        }
        ctx.closePath()
        ctx.fill()

        // tiny center dot
        ctx.fillStyle = `hsla(${p.hue - 10}, 90%, 70%, 0.9)`
        ctx.beginPath()
        ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
    />
  )
}
