'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Heart,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { fmt, TRACKS, useMusic } from './music-store'

/** Glassmorphism music player with rotating album, live progress + equaliser + real audio. */
export function MusicPlayer() {
  const { index, playing, progress, volume, muted, toggle, next, prev, setVolume, toggleMute, tick } =
    useMusic()
  const track = TRACKS[index]
  const last = useRef(performance.now())
  const [liked, setLiked] = useState(true)

  useEffect(() => {
    let raf = 0
    const loop = (t: number) => {
      const dt = (t - last.current) / 1000
      last.current = t
      tick(dt)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [tick])

  const pct = (progress / track.duration) * 100

  return (
    <div className="glass anim-enter relative overflow-hidden rounded-3xl p-4">
      <span className="anim-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.55),transparent)]" />

      <div className="relative z-10 flex items-center gap-3">
        {/* rotating album */}
        <div className="relative h-14 w-14 shrink-0">
          <div
            className={`anim-spin-slow h-full w-full overflow-hidden rounded-full ring-2 ring-white/70 ${
              playing ? '' : '[animation-play-state:paused]'
            }`}
          >
            <img src={track.cover} alt={track.title} className="h-full w-full object-cover" />
          </div>
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
        </div>

        {/* track info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-bold text-ink">{track.title}</p>
            {/* equaliser */}
            <div className="flex h-3 items-end gap-[2px]">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`anim-eq w-[2px] rounded-full bg-sakura ${
                    playing ? '' : '[animation-play-state:paused] h-1'
                  }`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
          <p className="truncate text-[11px] text-ink-soft">{track.artist}</p>

          {/* progress */}
          <div className="mt-2 flex items-center gap-2">
            <span className="w-8 text-right text-[10px] font-mono text-ink-soft tabular-nums">
              {fmt(progress)}
            </span>
            <div className="group relative h-1.5 flex-1 cursor-pointer rounded-full bg-pink-200/60">
              <div
                className="anim-progress-sheen absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#f9a8d4,#ec4899,#f472b6)]"
                style={{ width: `${pct}%` }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow ring-2 ring-pink-400 transition-transform group-hover:scale-125"
                style={{ left: `calc(${pct}% - 6px)` }}
              />
            </div>
            <span className="w-8 text-[10px] font-mono text-ink-soft tabular-nums">
              {fmt(track.duration)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setLiked((v) => !v)}
          aria-label="like"
          className="shrink-0 rounded-full p-1.5 text-pink-500 transition hover:scale-110 hover:bg-pink-100/60"
        >
          <Heart className={liked ? 'anim-heartbeat fill-pink-500' : ''} size={16} />
        </button>
      </div>

      {/* controls */}
      <div className="relative z-10 mt-3 flex items-center justify-center gap-5">
        <button
          onClick={prev}
          aria-label="previous"
          className="text-ink/70 transition hover:scale-110 hover:text-sakura"
        >
          <SkipBack size={16} />
        </button>
        <button
          onClick={toggle}
          aria-label={playing ? 'pause' : 'play'}
          className={`anim-pulse-glow grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#f9a8d4] to-[#ec4899] text-white transition hover:scale-105 ${
            playing ? '' : '[animation-play-state:paused]'
          }`}
        >
          {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button
          onClick={next}
          aria-label="next"
          className="text-ink/70 transition hover:scale-110 hover:text-sakura"
        >
          <SkipForward size={16} />
        </button>
      </div>

      {/* volume */}
      <div className="relative z-10 mt-3 flex items-center gap-2">
        <button
          onClick={toggleMute}
          aria-label="mute"
          className="text-ink-soft transition hover:text-sakura"
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          aria-label="volume"
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full accent-pink-500"
          style={{
            background: `linear-gradient(90deg,#ec4899 ${(muted ? 0 : volume) * 100}%, rgba(252,205,230,0.6) ${(muted ? 0 : volume) * 100}%)`,
          }}
        />
      </div>
    </div>
  )
}
