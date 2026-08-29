'use client'

import { Music2, Flower2, Heart } from 'lucide-react'
import { TRACKS, useMusic } from './music-store'

/**
 * Floating music control + sticky footer.
 * The footer pins to the bottom of the viewport and is pushed down on long content.
 */
export function FooterBar() {
  const { playing, toggle, index } = useMusic()
  const track = TRACKS[index]

  return (
    <>
      {/* floating action button — overlaps footer */}
      <button
        onClick={toggle}
        aria-label={playing ? 'pause music' : 'play music'}
        className={`anim-pulse-glow fixed bottom-20 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#f9a8d4] to-[#ec4899] text-white shadow-xl transition-transform duration-300 hover:scale-110 md:bottom-24 md:right-8 ${
          playing ? '' : '[animation-play-state:paused]'
        }`}
      >
        <Music2 size={22} className={playing ? 'anim-spin-slow' : ''} />
        <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-dashed border-white/60 [animation:spin-slow_8s_linear_infinite]" />
        <span className="sr-only">{track.title} — {playing ? 'pause' : 'play'}</span>
      </button>

      {/* sticky footer */}
      <footer className="z-40 mt-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 md:px-8">
        <div className="glass-pill anim-enter mx-auto flex max-w-2xl items-center justify-center gap-2 rounded-full px-6 py-2.5 text-center">
          <span className="text-[12.5px] font-medium tracking-wide text-ink/80">
            Made with all my love for you
          </span>
          <Heart size={13} className="anim-heartbeat fill-pink-500 text-pink-500" />
          <Flower2 size={13} className="anim-wiggle text-pink-400" />
        </div>
      </footer>
    </>
  )
}
