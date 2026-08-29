import { create } from 'zustand'

export type Track = {
  title: string
  artist: string
  cover: string
  duration: number // seconds
  // base frequency for the ambient pad (Hz)
  freq: number
  // chord intervals relative to base
  chord: number[]
}

export const TRACKS: Track[] = [
  {
    title: 'Kirakira',
    artist: 'Goose house',
    cover: '/album.png',
    duration: 299,
    freq: 261.63, // C4
    chord: [1, 1.25, 1.5], // major triad
  },
  {
    title: 'Nandemonaiya',
    artist: 'RADWIMPS',
    cover: '/album.png',
    duration: 264,
    freq: 220.0, // A3
    chord: [1, 1.2, 1.5],
  },
  {
    title: 'Sparkle',
    artist: 'RADWIMPS',
    cover: '/album.png',
    duration: 252,
    freq: 293.66, // D4
    chord: [1, 1.25, 1.5, 2],
  },
]

/**
 * Ambient pad audio engine using the Web Audio API.
 * Each track plays a soft sustained chord with slow LFO tremolo +
 * gentle gain envelope. No external files needed.
 */
class AmbientEngine {
  ctx: AudioContext | null = null
  master: GainNode | null = null
  voices: { osc: OscillatorNode; gain: GainNode; lfo: OscillatorNode }[] = []
  started = false

  ensure() {
    if (this.ctx) return
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    this.ctx = new AC()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0
    // soft lowpass to make it pad-like
    const lp = this.ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 1200
    lp.Q.value = 0.6
    this.master.connect(lp)
    lp.connect(this.ctx.destination)
  }

  start(track: Track, volume: number) {
    this.ensure()
    if (!this.ctx || !this.master) return
    this.stopVoices()
    const now = this.ctx.currentTime
    track.chord.forEach((mult, i) => {
      if (!this.ctx || !this.master) return
      const osc = this.ctx.createOscillator()
      osc.type = i === 0 ? 'sine' : 'triangle'
      osc.frequency.value = track.freq * mult
      // slight detune for warmth
      osc.detune.value = (i - 1) * 4

      const g = this.ctx.createGain()
      g.gain.value = 0
      osc.connect(g)
      g.connect(this.master)

      // tremolo LFO
      const lfo = this.ctx.createOscillator()
      lfo.frequency.value = 0.18 + i * 0.05
      const lfoGain = this.ctx.createGain()
      lfoGain.gain.value = 0.06
      lfo.connect(lfoGain)
      lfoGain.connect(g.gain)

      osc.start(now)
      lfo.start(now)
      // fade in this voice
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(0.12 / track.chord.length, now + 1.5)
      this.voices.push({ osc, gain: g, lfo })
    })
    // master fade in to target volume
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(volume * 0.5, now + 0.6)
    this.started = true
  }

  stopVoices() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    for (const v of this.voices) {
      try {
        v.gain.gain.cancelScheduledValues(now)
        v.gain.gain.setValueAtTime(v.gain.gain.value, now)
        v.gain.gain.linearRampToValueAtTime(0, now + 0.4)
        v.osc.stop(now + 0.5)
        v.lfo.stop(now + 0.5)
      } catch {
        // ignore
      }
    }
    this.voices = []
  }

  stop() {
    if (!this.ctx || !this.master) return
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(0, now + 0.4)
    setTimeout(() => this.stopVoices(), 450)
    this.started = false
  }

  setVolume(v: number) {
    if (!this.ctx || !this.master || !this.started) return
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(v * 0.5, now + 0.15)
  }

  get playing() {
    return this.started
  }
}

export const engine = new AmbientEngine()

type MusicState = {
  index: number
  playing: boolean
  progress: number // seconds
  volume: number // 0..1
  muted: boolean
  setPlaying: (p: boolean) => void
  toggle: () => void
  setProgress: (s: number) => void
  tick: (dt: number) => void
  next: () => void
  prev: () => void
  setVolume: (v: number) => void
  toggleMute: () => void
}

export const useMusic = create<MusicState>((set, get) => ({
  index: 0,
  playing: false,
  progress: 84,
  volume: 0.7,
  muted: false,
  setPlaying: (p) => {
    const s = get()
    if (p) engine.start(TRACKS[s.index], s.muted ? 0 : s.volume)
    else engine.stop()
    set({ playing: p })
  },
  toggle: () => {
    const s = get()
    if (s.playing) {
      engine.stop()
      set({ playing: false })
    } else {
      engine.start(TRACKS[s.index], s.muted ? 0 : s.volume)
      set({ playing: true })
    }
  },
  setProgress: (progress) => set({ progress }),
  tick: (dt) => {
    const s = get()
    if (!s.playing) return
    const track = TRACKS[s.index]
    let np = s.progress + dt
    if (np >= track.duration) {
      np = 0
      engine.start(TRACKS[(s.index + 1) % TRACKS.length], s.muted ? 0 : s.volume)
      set({ progress: 0, index: (s.index + 1) % TRACKS.length })
      return
    }
    set({ progress: np })
  },
  next: () => {
    const s = get()
    const ni = (s.index + 1) % TRACKS.length
    if (s.playing) engine.start(TRACKS[ni], s.muted ? 0 : s.volume)
    set({ index: ni, progress: 0 })
  },
  prev: () => {
    const s = get()
    const ni = (s.index - 1 + TRACKS.length) % TRACKS.length
    if (s.playing) engine.start(TRACKS[ni], s.muted ? 0 : s.volume)
    set({ index: ni, progress: 0 })
  },
  setVolume: (v) => {
    engine.setVolume(v)
    set({ volume: v, muted: v === 0 })
  },
  toggleMute: () => {
    const s = get()
    const nm = !s.muted
    const vol = nm ? s.volume || 0.7 : 0
    engine.setVolume(vol)
    set({ muted: nm })
  },
}))

export const fmt = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
