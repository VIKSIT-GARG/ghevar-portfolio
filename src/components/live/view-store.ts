import { create } from 'zustand'

export type View = 'home' | 'letters' | 'photos'

type ViewState = {
  view: View
  setView: (v: View) => void
  // gallery modal
  galleryOpen: boolean
  galleryIndex: number
  openGallery: (i: number) => void
  closeGallery: () => void
  setGalleryIndex: (i: number) => void
  // letters modal (view all)
  lettersOpen: boolean
  setLettersOpen: (b: boolean) => void
}

export const useView = create<ViewState>((set) => ({
  view: 'home',
  setView: (view) => set({ view }),
  galleryOpen: false,
  galleryIndex: 0,
  openGallery: (i) => set({ galleryOpen: true, galleryIndex: i }),
  closeGallery: () => set({ galleryOpen: false }),
  setGalleryIndex: (i) => set({ galleryIndex: i }),
  lettersOpen: false,
  setLettersOpen: (lettersOpen) => set({ lettersOpen }),
}))
