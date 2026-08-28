'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The anime-couple background scene.
 * - The illustration gently breathes (scale).
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
      {/* base colour wash */}
      <div className="anim-hue absolute inset-0 bg-[linear-gradient(180deg,#ffe9f1_0%,#fcd5e6_40%,#f9b8d6_75%,#f7a6cb_100%)]" />

      {/* the breathing illustration, parallax-follows pointer */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(${parallax.x * -18}px, ${parallax.y * -18}px, 0)`,
        }}
      >
        <div className="anim-breathe absolute inset-0">
          <img
            src="/couple-bg-clean.png"
            alt=""
            className="h-full w-full object-cover object-center"
            style={{
              transform: `scale(1.08) translate3d(${parallax.x * 8}px, ${parallax.y * 8}px, 0)`,
              filter: 'saturate(1.05) contrast(1.02) brightness(1.03)',
            }}
          />
        </div>
      </div>

      {/* drifting light rays */}
      <div
        className="anim-drift absolute -top-1/4 left-1/2 h-[150%] w-[60%] -translate-x-1/2 opacity-40 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.55) 0%, rgba(255,236,244,0.25) 35%, transparent 70%)',
          transform: `translate3d(calc(-50% + ${parallax.x * 20}px), ${parallax.y * 20}px, 0)`,
        }}
      />

      {/* god rays */}
      <div className="pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay">
        <div
          className="anim-drift absolute -top-10 left-[12%] h-[130%] w-40 origin-top -rotate-12 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),transparent)] blur-2xl"
          style={{ animationDelay: '-4s' }}
        />
        <div
          className="anim-drift absolute -top-10 left-[34%] h-[130%] w-56 origin-top -rotate-6 bg-[linear-gradient(180deg,rgba(255,236,244,0.5),transparent)] blur-2xl"
          style={{ animationDelay: '-9s' }}
        />
        <div
          className="anim-drift absolute -top-10 right-[18%] h-[130%] w-44 origin-top rotate-8 bg-[linear-gradient(180deg,rgba(255,255,255,0.45),transparent)] blur-2xl"
          style={{ animationDelay: '-14s' }}
        />
      </div>

      {/* top sakura branch vignette */}
      <div
        className="anim-drift pointer-events-none absolute -top-6 left-0 right-0 h-44 opacity-90"
        style={{
          background:
            'radial-gradient(120% 100% at 20% -10%, rgba(255,182,214,0.85), transparent 60%), radial-gradient(120% 100% at 80% -10%, rgba(255,192,203,0.8), transparent 60%)',
          maskImage: 'linear-gradient(180deg, black, transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, black, transparent)',
        }}
      />

      {/* colour grade overlay for cohesion + legibility */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,228,236,0.18)_0%,rgba(247,166,203,0.12)_60%,rgba(219,39,119,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_40%,rgba(190,24,93,0.18)_100%)]" />
    </div>
  )
}
