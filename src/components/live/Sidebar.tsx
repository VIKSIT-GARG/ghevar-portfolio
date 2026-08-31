'use client'

import { Flower2, Heart, Home, Image, Mail } from 'lucide-react'
import { useView, type View } from './view-store'
import { MusicPlayer } from './MusicPlayer'

const NAV: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'letters', label: 'Letters', icon: Mail },
  { id: 'photos', label: 'Photo Dump', icon: Image },
]

/** Left column: brand, navigation (switches the center stage), quote, music. */
export function Sidebar() {
  const { view, setView } = useView()

  return (
    <aside className="anim-enter pointer-events-auto flex w-full flex-col gap-4">
      {/* brand */}
      <div className="glass-strong relative overflow-hidden rounded-3xl px-5 py-5 text-center">
        <span className="anim-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.6),transparent)]" />
        <h1 className="glow-text font-script relative z-10 text-4xl font-bold leading-none text-sakura">
          From me to You
          <Heart className="anim-heartbeat ml-1 inline fill-pink-400 text-pink-400" size={20} />
        </h1>
        <p className="relative z-10 mt-1.5 text-[11px] lowercase tracking-wide text-ink-soft">
          a little corner just for you
        </p>
        <div className="anim-wiggle relative z-10 mt-1 flex justify-center text-pink-400/80">
          <Flower2 size={16} />
        </div>
      </div>

      {/* navigation — switches the center stage view */}
      <nav className="flex flex-col gap-1.5">
        {NAV.map((item, i) => {
          const isActive = view === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`anim-enter group relative flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                isActive
                  ? 'anim-nav glass-strong text-sakura shadow-md'
                  : 'glass text-ink/80 hover:text-sakura'
              }`}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br from-[#f9a8d4] to-[#ec4899] text-white shadow'
                    : 'bg-white/60 text-pink-500 group-hover:bg-pink-100'
                }`}
              >
                <Icon size={15} />
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && (
                <span className="anim-twinkle h-1.5 w-1.5 rounded-full bg-pink-500" />
              )}
            </button>
          )
        })}
      </nav>

      {/* quote */}
      <div className="glass anim-enter relative overflow-hidden rounded-3xl p-5 text-center">
        <span className="anim-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.5),transparent)]" />
        <div className="font-script relative z-10 text-5xl leading-none text-pink-300">“</div>
        <p className="font-jp relative z-10 mt-1 text-base font-medium leading-relaxed text-ink">
          あなたに<br />出会えてよかった。
        </p>
        <p className="relative z-10 mt-2 text-xs italic text-ink-soft">
          I&rsquo;m glad I met you.
        </p>
        <div className="relative z-10 mt-3 flex items-center justify-center gap-2 text-pink-300">
          <span className="h-px w-8 bg-pink-200" />
          <Heart size={10} className="fill-pink-300" />
          <span className="h-px w-8 bg-pink-200" />
        </div>
      </div>

      {/* music player */}
      <MusicPlayer />
    </aside>
  )
}
