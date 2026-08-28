'use client'

import { useState } from 'react'
import { Camera, ChevronRight, Heart, Mail, Sparkles, Star } from 'lucide-react'
import { LETTERS, SHOTS } from './data'
import { useView } from './view-store'
import { DateTimeWidget } from './DateTimeWidget'

/* ============== HOME VIEW — hero welcome over the couple ============== */
function HomeView() {
  return (
    <div key="home" className="anim-view flex flex-col items-center gap-5 px-2 py-6 text-center">
      {/* floating date widget on home */}
      <div className="anim-bob self-end">
        <DateTimeWidget />
      </div>

      <div className="anim-enter glass-strong relative w-full max-w-md overflow-hidden rounded-[2rem] px-7 py-8">
        <span className="anim-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.6),transparent)]" />
        <div className="anim-floaty relative z-10 mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#f9a8d4] to-[#ec4899] text-white shadow-lg">
          <Sparkles size={22} />
        </div>
        <p className="glow-text font-script relative z-10 text-4xl font-bold leading-tight text-sakura">
          welcome back,
          <br /> love ♡
        </p>
        <p className="relative z-10 mt-3 text-sm leading-relaxed text-ink/80">
          You have <span className="font-bold text-sakura">{LETTERS.length} unread letters</span> and{' '}
          <span className="font-bold text-sakura">{SHOTS.length} new memories</span> waiting for you.
        </p>
        <div className="relative z-10 mt-4 flex items-center justify-center gap-2 text-pink-300">
          <span className="h-px w-10 bg-pink-200" />
          <Star size={11} className="fill-pink-300" />
          <span className="h-px w-10 bg-pink-200" />
        </div>
      </div>

      {/* quick stats */}
      <div className="grid w-full max-w-md grid-cols-3 gap-3">
        {[
          { label: 'letters', value: LETTERS.length, icon: Mail },
          { label: 'photos', value: SHOTS.length, icon: Camera },
          { label: 'days', value: 142, icon: Heart },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <button
              key={s.label}
              onClick={() => useView.getState().setView(s.label === 'photos' ? 'photos' : 'letters')}
              className="anim-enter glass group flex flex-col items-center gap-1 rounded-2xl px-3 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              <Icon size={18} className="text-sakura transition group-hover:scale-110" />
              <span className="glow-text font-script text-2xl font-bold text-sakura">{s.value}</span>
              <span className="text-[10px] uppercase tracking-wider text-ink-soft">{s.label}</span>
            </button>
          )
        })}
      </div>

      <p className="anim-enter max-w-sm text-[12px] italic leading-relaxed text-ink-soft" style={{ animationDelay: '0.4s' }}>
        pick something from the left to wander through your little corner.
      </p>
    </div>
  )
}

/* ============== LETTERS VIEW — full letters list ============== */
function LettersView() {
  const [openId, setOpenId] = useState<number | null>(LETTERS[0].id)

  return (
    <div key="letters" className="anim-view flex flex-col gap-3 px-1 py-2">
      <div className="anim-enter mb-1 flex items-center justify-between">
        <h2 className="glow-text flex items-center gap-2 font-script text-3xl font-bold text-sakura">
          <Mail size={22} className="text-sakura" />
          Open Letters
        </h2>
        <span className="glass-pill rounded-full px-3 py-1 text-[11px] font-semibold text-sakura">
          {LETTERS.length} letters
        </span>
      </div>

      <div className="scroll-soft flex max-h-[68vh] flex-col gap-2.5 overflow-y-auto pr-1">
        {LETTERS.map((l, i) => {
          const open = openId === l.id
          return (
            <button
              key={l.id}
              onClick={() => setOpenId(open ? null : l.id)}
              className={`anim-enter glass group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg ${
                open ? 'ring-1 ring-pink-300' : ''
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="anim-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.45),transparent)]" />
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-[12px] font-bold text-ink">
                  <span className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${l.hue} text-white shadow-sm`}>
                    <Mail size={12} />
                  </span>
                  Letter #{l.id}
                </span>
                <span className="text-[10px] text-ink-soft">{l.date}</span>
              </div>

              <p className="relative z-10 mt-2 font-script text-xl font-bold text-sakura">{l.title}</p>

              <div className="grid transition-all duration-500" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                <div className="overflow-hidden">
                  <p className="font-jp relative z-10 py-2 text-[13px] leading-relaxed text-ink/85">
                    {l.body}
                  </p>
                  <p className="relative z-10 text-right text-[11px] italic text-ink-soft">{l.signature}</p>
                </div>
              </div>

              <div className="relative z-10 mt-1 flex items-center justify-between">
                <span className={`text-[10px] font-semibold text-pink-400 transition ${open ? 'opacity-100' : 'opacity-60'}`}>
                  {open ? 'close ✕' : 'read →'}
                </span>
                <Heart
                  size={13}
                  className={`fill-pink-300 text-pink-300 transition group-hover:scale-110 ${open ? 'anim-heartbeat' : ''}`}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ============== PHOTOS VIEW — full gallery + lightbox ============== */
function PhotosView() {
  const { openGallery } = useView()
  const [liked, setLiked] = useState<Record<number, boolean>>({})
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})

  return (
    <div key="photos" className="anim-view flex flex-col gap-3 px-1 py-2">
      <div className="anim-enter mb-1 flex items-center justify-between">
        <h2 className="glow-text flex items-center gap-2 font-script text-3xl font-bold text-sakura">
          <Camera size={22} className="text-sakura" />
          Photo Dump
        </h2>
        <span className="glass-pill rounded-full px-3 py-1 text-[11px] font-semibold text-sakura">
          {SHOTS.length} memories
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {SHOTS.map((shot, i) => (
          <figure
            key={i}
            className="anim-enter group relative aspect-square cursor-pointer overflow-hidden rounded-2xl shadow-sm ring-1 ring-white/50"
            style={{ animationDelay: `${i * 0.06}s` }}
            onClick={() => openGallery(i)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${shot.fallback} ${loaded[i] ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`} />
            <img
              src={shot.src}
              alt={shot.label}
              loading="lazy"
              onLoad={() => setLoaded((p) => ({ ...p, [i]: true }))}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(219,39,119,0.6))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="anim-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.5),transparent)]" />
            <figcaption className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
                {shot.label}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLiked((p) => ({ ...p, [i]: !p[i] }))
                }}
                aria-label="like photo"
                className="grid h-7 w-7 place-items-center rounded-full bg-white/85 opacity-0 backdrop-blur transition-all duration-500 hover:scale-110 group-hover:opacity-100"
              >
                <Heart size={13} className={liked[i] ? 'anim-heartbeat fill-pink-500 text-pink-500' : 'text-pink-400'} />
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

/* ============== GALLERY LIGHTBOX ============== */
function GalleryLightbox() {
  const { galleryOpen, galleryIndex, closeGallery, setGalleryIndex, openGallery } = useView()
  if (!galleryOpen) return null
  const shot = SHOTS[galleryIndex]
  const go = (dir: number) => {
    const ni = (galleryIndex + dir + SHOTS.length) % SHOTS.length
    setGalleryIndex(ni)
    openGallery(ni)
  }
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-pink-950/50 p-4 backdrop-blur-md"
      onClick={closeGallery}
    >
      <div
        className="anim-pop glass-strong relative max-h-[85vh] w-full max-w-lg overflow-hidden rounded-3xl p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-2xl">
          <img src={shot.src} alt={shot.label} className="max-h-[60vh] w-full object-contain" />
          <span className="anim-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.4),transparent)]" />
        </div>
        <div className="mt-3 flex items-center justify-between px-2">
          <button onClick={() => go(-1)} className="glass-pill rounded-full px-4 py-2 text-sm font-semibold text-sakura transition hover:scale-105">
            ‹ prev
          </button>
          <div className="text-center">
            <p className="glow-text font-script text-xl font-bold text-sakura">{shot.label}</p>
            <p className="text-[11px] italic text-ink-soft">{shot.caption}</p>
          </div>
          <button onClick={() => go(1)} className="glass-pill rounded-full px-4 py-2 text-sm font-semibold text-sakura transition hover:scale-105">
            next ›
          </button>
        </div>
        <button
          onClick={closeGallery}
          aria-label="close photo"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-ink shadow transition hover:scale-110 hover:bg-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

/* ============== RIGHT PANEL — compact preview cards for home view ============== */
function CompactLetters() {
  const { setView, setLettersOpen } = useView()
  const [openId, setOpenId] = useState<number | null>(LETTERS[0].id)
  return (
    <div className="glass anim-enter relative overflow-hidden rounded-3xl p-5">
      <span className="anim-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.5),transparent)]" />
      <div className="relative z-10 mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-ink">
          <Mail size={16} className="text-sakura" />
          Open Letters
        </h2>
        <button
          onClick={() => setLettersOpen(true)}
          className="glass-pill flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-sakura transition hover:scale-105"
        >
          View all <ChevronRight size={12} />
        </button>
      </div>
      <div className="relative z-10 flex flex-col gap-2.5">
        {LETTERS.slice(0, 3).map((l, i) => {
          const open = openId === l.id
          return (
            <button
              key={l.id}
              onClick={() => {
                if (open) setView('letters')
                else setOpenId(l.id)
              }}
              className={`anim-enter group relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-500 hover:-translate-y-0.5 ${open ? 'ring-1 ring-pink-200 shadow-lg' : ''}`}
              style={{ animationDelay: `${0.1 + i * 0.1}s`, background: open ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.42)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-[12px] font-bold text-ink">
                  <span className={`grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br ${l.hue} text-white shadow-sm`}>
                    <Mail size={11} />
                  </span>
                  Letter #{l.id}
                </span>
                <span className="text-[10px] text-ink-soft">{l.date}</span>
              </div>
              <p className="mt-2 font-script text-lg font-bold text-sakura">{l.title}</p>
              <div className="grid transition-all duration-500" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                <p className="overflow-hidden text-[12.5px] leading-relaxed text-ink/80">{l.body}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[10px] font-semibold text-pink-400 transition ${open ? 'opacity-100' : 'opacity-0'}`}>
                  {open ? 'see all →' : 'read →'}
                </span>
                <Heart size={12} className={`fill-pink-300 text-pink-300 transition group-hover:scale-110 ${open ? 'anim-heartbeat' : ''}`} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CompactPhotos() {
  const { openGallery } = useView()
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
        <button
          onClick={() => useView.getState().setView('photos')}
          className="glass-pill flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-sakura transition hover:scale-105"
        >
          View all <ChevronRight size={12} />
        </button>
      </div>
      <div className="relative z-10 grid grid-cols-2 gap-2.5">
        {SHOTS.map((shot, i) => (
          <figure
            key={i}
            className="anim-enter group relative aspect-square cursor-pointer overflow-hidden rounded-2xl shadow-sm ring-1 ring-white/50"
            style={{ animationDelay: `${0.1 + i * 0.06}s` }}
            onClick={() => openGallery(i)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${shot.fallback} ${loaded[i] ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`} />
            <img src={shot.src} alt={shot.label} loading="lazy" onLoad={() => setLoaded((p) => ({ ...p, [i]: true }))} className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(219,39,119,0.55))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="anim-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.45),transparent)]" />
            <figcaption className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span className="rounded-full bg-white/75 px-2 py-0.5 text-[10px] font-semibold text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
                {shot.label}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setLiked((p) => ({ ...p, [i]: !p[i] })) }}
                aria-label="like photo"
                className="grid h-7 w-7 place-items-center rounded-full bg-white/85 opacity-0 backdrop-blur transition-all duration-500 hover:scale-110 group-hover:opacity-100"
              >
                <Heart size={13} className={liked[i] ? 'anim-heartbeat fill-pink-500 text-pink-500' : 'text-pink-400'} />
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

/* ============== LETTERS MODAL (view all) ============== */
function LettersModal() {
  const { lettersOpen, setLettersOpen } = useView()
  const [openId, setOpenId] = useState<number | null>(LETTERS[0].id)
  if (!lettersOpen) return null
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-pink-950/50 p-4 backdrop-blur-md" onClick={() => setLettersOpen(false)}>
      <div className="anim-pop glass-strong scroll-soft relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="glow-text font-script mb-4 text-center text-3xl font-bold text-sakura">all my letters ♡</h2>
        <div className="flex flex-col gap-3">
          {LETTERS.map((l, i) => {
            const open = openId === l.id
            return (
              <button
                key={l.id}
                onClick={() => setOpenId(open ? null : l.id)}
                className="anim-enter glass relative overflow-hidden rounded-2xl p-4 text-left transition hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[12px] font-bold text-ink">
                    <span className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${l.hue} text-white`}>
                      <Mail size={12} />
                    </span>
                    Letter #{l.id}
                  </span>
                  <span className="text-[10px] text-ink-soft">{l.date}</span>
                </div>
                <p className="font-script mt-2 text-xl font-bold text-sakura">{l.title}</p>
                <div className="grid transition-all duration-500" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                  <p className="font-jp overflow-hidden py-2 text-[13px] leading-relaxed text-ink/85">{l.body}</p>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className={`text-[10px] font-semibold text-pink-400 ${open ? 'opacity-100' : 'opacity-60'}`}>{open ? 'close ✕' : 'read →'}</span>
                  <Heart size={13} className={`fill-pink-300 text-pink-300 ${open ? 'anim-heartbeat' : ''}`} />
                </div>
              </button>
            )
          })}
        </div>
        <button onClick={() => setLettersOpen(false)} aria-label="close letters" className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-ink shadow transition hover:scale-110 hover:bg-white">
          ✕
        </button>
      </div>
    </div>
  )
}

/* ============== MAIN EXPORTS ============== */
/** The center stage that swaps between Home / Letters / Photo Dump. */
export function CenterStage() {
  const { view } = useView()
  return (
    <section className="pointer-events-auto flex w-full flex-col">
      {view === 'home' && <HomeView />}
      {view === 'letters' && <LettersView />}
      {view === 'photos' && <PhotosView />}
    </section>
  )
}

/** Compact right-side preview column shown alongside the couple on home view. */
export function RightPanel() {
  const { view } = useView()
  // On letters/photos views the center stage shows full content, so hide the right panel
  if (view !== 'home') return null
  return (
    <section className="pointer-events-auto flex w-full flex-col gap-4">
      <div className="flex justify-end">
        <DateTimeWidget />
      </div>
      <CompactLetters />
      <CompactPhotos />
    </section>
  )
}

export { GalleryLightbox, LettersModal }
