import { create } from 'zustand'

export type Track = {
  title: string
  artist: string
  cover: string
  duration: number // seconds
}

export const TRACKS: Track[] = [
  { title: 'Kirakira', artist: 'Goose house', cover: '/album.png', duration: 299 },
  { title: 'Nandemonaiya', artist: 'RADWIMPS', cover: '/album.png', duration: 264 },
  { title: 'Sparkle', artist: 'RADWIMPS', cover: '/album.png', duration: 252 },
]

type MusicState = {
  index: number
  playing: boolean
  progress: number // seconds
  volume: number // 0..1
  setPlaying: (p: boolean) => void
  toggle: () => void
  setProgress: (s: number) => void
  tick: (dt: number) => void
  next: () => void
  prev: () => void
  setVolume: (v: number) => void
}

export const useMusic = create<MusicState>((set, get) => ({
  index: 0,
  playing: true,
  progress: 84,
  volume: 0.7,
  setPlaying: (p) => set({ playing: p }),
  toggle: () => set((s) => ({ playing: !s.playing })),
  setProgress: (progress) => set({ progress }),
  tick: (dt) => {
    const s = get()
    if (!s.playing) return
    const track = TRACKS[s.index]
    let np = s.progress + dt
    if (np >= track.duration) {
      np = 0
      set({ progress: 0, index: (s.index + 1) % TRACKS.length })
      return
    }
    set({ progress: np })
  },
  next: () =>
    set((s) => ({
      index: (s.index + 1) % TRACKS.length,
      progress: 0,
    })),
  prev: () =>
    set((s) => ({
      index: (s.index - 1 + TRACKS.length) % TRACKS.length,
      progress: 0,
    })),
  setVolume: (volume) => set({ volume }),
}))

export const fmt = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
