'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The anime-couple background scene.
 * - The illustration gently breathes + sways.
 * - A volumetric pink glow emanates from the couple's center (where foreheads touch).
 * - Parallax: layers shift subtly with the pointer.
 * - Animated god-rays + top sakura-branch vignette + colour wash.
 */
export function BackgroundScene() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let raf = 0
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      tx = nx
      ty = ny
    }
    const loop = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      setParallax({ x: cx, y: cy })
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={wrapRef} aria-hidden className="fixed inset-0 z-0 overflow-hidden">
      {/* base colour wash — warm pastel rose */}
      <div className="anim-hue absolute inset-0 bg-[linear-gradient(180deg,#ffe6f0_0%,#fbd5e8_35%,#f9b6d4_70%,#f49ecb_100%)]" />

      {/* the breathing + swaying illustration, parallax-follows pointer */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(${parallax.x * -22}px, ${parallax.y * -22}px, 0)`,
        }}
      >
        <div className="anim-sway absolute inset-0">
          <div className="anim-breathe absolute inset-0">
            <img
              src="/couple-bg-clean.png"
              alt=""
              className="h-full w-full object-cover object-center"
              style={{
                transform: `scale(1.1) translate3d(${parallax.x * 10}px, ${parallax.y * 10}px, 0)`,
                filter: 'saturate(1.08) contrast(1.03) brightness(1.04)',
              }}
            />
          </div>
        </div>
      </div>

      {/* VOLUMETRIC GLOW — emanates from the couple's center (forehead touch point) */}
      <div
        className="anim-glow-pulse pointer-events-none absolute left-[38%] top-[42%] h-[55vmax] w-[55vmax] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle, rgba(255,240,247,0.55) 0%, rgba(255,200,224,0.35) 25%, rgba(255,170,210,0.15) 50%, transparent 70%)',
          transform: `translate3d(calc(-50% + ${parallax.x * 30}px), calc(-50% + ${parallax.y * 30}px), 0)`,
        }}
      />

      {/* drifting light rays */}
      <div
        className="anim-drift absolute -top-1/4 left-1/2 h-[150%] w-[60%] -translate-x-1/2 opacity-50 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, rgba(255,236,244,0.3) 35%, transparent 70%)',
          transform: `translate3d(calc(-50% + ${parallax.x * 24}px), ${parallax.y * 24}px, 0)`,
        }}
      />

      {/* god rays */}
      <div className="pointer-events-none absolute inset-0 opacity-55 mix-blend-overlay">
        <div
          className="anim-drift absolute -top-10 left-[12%] h-[130%] w-40 origin-top -rotate-12 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),transparent)] blur-2xl"
          style={{ animationDelay: '-4s' }}
        />
        <div
          className="anim-drift absolute -top-10 left-[34%] h-[130%] w-56 origin-top -rotate-6 bg-[linear-gradient(180deg,rgba(255,236,244,0.55),transparent)] blur-2xl"
          style={{ animationDelay: '-9s' }}
        />
        <div
          className="anim-drift absolute -top-10 right-[18%] h-[130%] w-44 origin-top rotate-8 bg-[linear-gradient(180deg,rgba(255,255,255,0.5),transparent)] blur-2xl"
          style={{ animationDelay: '-14s' }}
        />
      </div>

      {/* top sakura branch vignette — dense blossoms framing the top */}
      <div
        className="anim-drift pointer-events-none absolute -top-6 left-0 right-0 h-48 opacity-95"
        style={{
          background:
            'radial-gradient(120% 100% at 15% -10%, rgba(255,182,214,0.9), transparent 55%), radial-gradient(120% 100% at 50% -10%, rgba(255,192,203,0.7), transparent 50%), radial-gradient(120% 100% at 85% -10%, rgba(255,182,214,0.85), transparent 55%)',
          maskImage: 'linear-gradient(180deg, black, transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, black, transparent)',
        }}
      />

      {/* colour grade overlay for cohesion + legibility */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,228,236,0.15)_0%,rgba(247,166,203,0.1)_60%,rgba(219,39,119,0.16)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_45%,rgba(190,24,93,0.18)_100%)]" />

      {/* soft vignette to draw eye to center */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_50%,transparent_50%,rgba(120,40,80,0.25)_100%)]" />
    </div>
  )
}
