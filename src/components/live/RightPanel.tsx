'use client'

import { DateTimeWidget } from './DateTimeWidget'
import { LettersCard } from './LettersCard'
import { PhotoDumpCard } from './PhotoDumpCard'

/** Right column: floating datetime + letters + photo dump. */
export function RightPanel() {
  return (
    <section className="pointer-events-auto flex w-full flex-col gap-4">
      <div className="flex justify-end">
        <DateTimeWidget />
      </div>
      <LettersCard />
      <PhotoDumpCard />
    </section>
  )
}
