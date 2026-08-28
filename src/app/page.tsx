'use client'

import { BackgroundScene } from '@/components/live/BackgroundScene'
import { BokehParticles } from '@/components/live/BokehParticles'
import { SakuraPetals } from '@/components/live/SakuraPetals'
import { Sidebar } from '@/components/live/Sidebar'
import { RightPanel } from '@/components/live/RightPanel'
import { FooterBar } from '@/components/live/FooterBar'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* live layers (fixed, behind everything) */}
      <BackgroundScene />
      <BokehParticles count={22} />
      <SakuraPetals count={48} />

      {/* foreground content */}
      <main className="relative z-30 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 pb-4 pt-4 md:gap-6 md:px-8 md:pb-8 md:pt-8 lg:grid lg:grid-cols-[clamp(260px,22vw,300px)_minmax(0,1fr)_clamp(320px,28vw,380px)] lg:items-start">
        <Sidebar />

        {/* center breathing space — the couple shows through */}
        <div className="hidden lg:block" aria-hidden />

        <RightPanel />
      </main>

      <FooterBar />
    </div>
  )
}
