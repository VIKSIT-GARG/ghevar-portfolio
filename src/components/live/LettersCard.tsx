'use client'

import { useState } from 'react'
import { ChevronRight, Heart, Mail } from 'lucide-react'

type Letter = {
  id: number
  date: string
  title: string
  body: string
  hue: string
}

const LETTERS: Letter[] = [
  {
    id: 7,
    date: 'May 26, 2024',
    title: 'a little something',
    body: 'Just wanted to remind you how special you are. You mean the world to me, more than you\u2019ll ever know.',
    hue: 'from-[#fbcfe8] to-[#f9a8d4]',
  },
  {
    id: 6,
    date: 'May 20, 2024',
    title: 'today, again',
    body: 'I keep thinking about the way you laugh at your own jokes before you even finish them. It\u2019s my favourite sound.',
    hue: 'from-[#fde2e8] to-[#fbcfe8]',
  },
  {
    id: 5,
    date: 'May 14, 2024',
    title: 'rainy afternoon',
    body: 'The rain reminded me of you. Soft, warm, and making everything outside feel a little more possible.',
    hue: 'from-[#fce7f3] to-[#fbcfe8]',
  },
]

/** Open Letters card with an animated, expanding letter. */
export function LettersCard() {
  const [openId, setOpenId] = useState<number | null>(7)

  return (
    <div className="glass anim-enter relative overflow-hidden rounded-3xl p-5">
      <span className="anim-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.5),transparent)]" />

      <div className="relative z-10 mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-ink">
          <Mail size={16} className="text-sakura" />
          Open Letters
        </h2>
        <button className="glass-pill flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-sakura transition hover:scale-105">
          View all <ChevronRight size={12} />
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-2.5">
        {LETTERS.map((l, i) => {
          const open = openId === l.id
          return (
            <button
              key={l.id}
              onClick={() => setOpenId(open ? null : l.id)}
              className={`anim-enter group relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-500 ${
                open ? 'shadow-lg ring-1 ring-pink-200' : 'hover:-translate-y-0.5'
              }`}
              style={{
                animationDelay: `${0.1 + i * 0.1}s`,
                background: open
                  ? 'rgba(255,255,255,0.7)'
                  : 'rgba(255,255,255,0.4)',
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-[12px] font-bold text-ink">
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br ${l.hue} text-white shadow-sm`}
                  >
                    <Mail size={11} />
                  </span>
                  Letter #{l.id}
                </span>
                <span className="text-[10px] text-ink-soft">{l.date}</span>
              </div>

              <p className="mt-2 text-sm font-bold text-sakura">{l.title}</p>

              <div
                className="grid transition-all duration-500"
                style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
              >
                <p className="overflow-hidden text-[12.5px] leading-relaxed text-ink/80">
                  {l.body}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span
                  className={`text-[10px] font-semibold text-pink-400 transition ${
                    open ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {open ? 'close ✕' : 'read →'}
                </span>
                <Heart
                  size={12}
                  className={`fill-pink-300 text-pink-300 transition group-hover:scale-110 ${
                    open ? 'anim-heartbeat' : ''
                  }`}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
