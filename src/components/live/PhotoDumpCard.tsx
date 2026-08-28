'use client'

import { useState } from 'react'
import { Camera, ChevronRight, Heart } from 'lucide-react'

type Shot = {
  src: string
  label: string
  fallback: string
}

const SHOTS: Shot[] = [
  { src: '/photos/sunset.png', label: 'golden sky', fallback: 'from-[#fda4af] to-[#fbbf24]' },
  { src: '/photos/strawberry-milk.png', label: 'sweet', fallback: 'from-[#f9a8d4] to-[#fbcfe8]' },
  { src: '/photos/sakura-branch.png', label: 'in bloom', fallback: 'from-[#fbcfe8] to-[#f9a8d4]' },
  { src: '/photos/sketchbook.png', label: 'doodles', fallback: 'from-[#fde2e8] to-[#fbcfe8]' },
  { src: '/photos/window.png', label: 'the view', fallback: 'from-[#f9a8d4] to-[#fda4af]' },
  { src: '/photos/bouquet.png', label: 'for you', fallback: 'from-[#fbcfe8] to-[#fda4af]' },
  { src: '/photos/cityscape.png', label: 'that day', fallback: 'from-[#c4b5fd] to-[#f9a8d4]' },
  { src: '/photos/teddy.png', label: 'soft', fallback: 'from-[#fde2e8] to-[#fbbf24]' },
]

/** Photo dump — a 2-column grid of memories with hover zoom + heart pop. */
export function PhotoDumpCard() {
  const [liked, setLiked] = useState<Record<number, boolean>>({})
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})

  return (
    <div className="glass anim-enter relative overflow-hidden rounded-3xl p-5">
      <span className="anim-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.5),transparent)]" />

      <div className="relative z-10 mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-ink">
          <Camera size={16} className="text-sakura" />
          Photo Dump
        </h2>
        <button className="glass-pill flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-sakura transition hover:scale-105">
          View all <ChevronRight size={12} />
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2.5">
        {SHOTS.map((shot, i) => {
          const isLiked = liked[i]
          return (
            <figure
              key={i}
              className="anim-enter group relative aspect-square overflow-hidden rounded-2xl shadow-sm ring-1 ring-white/50"
              style={{ animationDelay: `${0.1 + i * 0.06}s` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${shot.fallback} ${
                  loaded[i] ? 'opacity-0' : 'opacity-100'
                } transition-opacity duration-500`}
              />
              <img
                src={shot.src}
                alt={shot.label}
                loading="lazy"
                onLoad={() => setLoaded((p) => ({ ...p, [i]: true }))}
                onError={() => setLoaded((p) => ({ ...p, [i]: false }))}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
              />
              {/* glossy overlay on hover */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(219,39,119,0.55))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* shimmer sweep */}
              <span className="anim-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.45),transparent)]" />

              <figcaption className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
                  {shot.label}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setLiked((p) => ({ ...p, [i]: !p[i] }))
                  }}
                  aria-label="like photo"
                  className="grid h-7 w-7 place-items-center rounded-full bg-white/80 opacity-0 backdrop-blur transition-all duration-500 hover:scale-110 group-hover:opacity-100"
                >
                  <Heart
                    size={13}
                    className={
                      isLiked
                        ? 'anim-heartbeat fill-pink-500 text-pink-500'
                        : 'text-pink-400'
                    }
                  />
                </button>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </div>
  )
}
