'use client'

import { useEffect, useState } from 'react'

/** Live, ticking clock + date widget (top-right of the layout). */
export function DateTimeWidget() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const update = () => setNow(new Date())
    queueMicrotask(update)
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) {
    return (
      <div className="glass-pill flex items-center gap-3 rounded-2xl px-4 py-2.5">
        <span className="font-script text-xl text-sakura">From me to You</span>
      </div>
    )
  }

  const dateStr = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  let hh = now.getHours()
  const mm = now.getMinutes().toString().padStart(2, '0')
  const ss = now.getSeconds().toString().padStart(2, '0')
  const ampm = hh >= 12 ? 'PM' : 'AM'
  hh = hh % 12 || 12

  return (
    <div className="glass-pill anim-enter relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-2.5">
      {/* shimmer */}
      <span className="anim-shimmer pointer-events-none absolute inset-0 -z-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.55),transparent)]" />
      <span className="anim-wiggle text-lg leading-none">🌸</span>
      <div className="relative z-10 leading-tight">
        <div className="text-[11px] font-medium tracking-wide text-ink-soft">
          {dateStr}
        </div>
        <div className="font-mono text-base font-semibold text-ink tabular-nums">
          {hh}:{mm}
          <span className="text-sakura">:{ss}</span>{' '}
          <span className="text-[10px] font-bold tracking-widest text-sakura">
            {ampm}
          </span>
        </div>
      </div>
    </div>
  )
}
