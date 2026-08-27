'use client'

import { useState } from 'react'
import { DragMreza } from '@/components/radovi/DragMreza'
import { Filter } from '@/components/radovi/Filter'
import { radovi } from '@/content/radovi'
import { tekstovi } from '@/content/tekstovi'
import type { Kategorija } from '@/content/tipovi'

export default function Radovi() {
  const [aktivna, postaviAktivnu] = useState<Kategorija | 'SVE'>('SVE')
  const vidljivi = aktivna === 'SVE' ? radovi : radovi.filter((r) => r.kategorija === aktivna)

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center">
        <h1 className="naslov text-[6vw] max-md:text-[14vw] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
          {tekstovi.radoviHero.naslov}
        </h1>
        <p className="font-body text-[1vw] max-md:text-[3.6vw] uppercase tracking-[0.15em] text-white/70">
          {tekstovi.radoviHero.opis}
        </p>
      </div>

      <DragMreza key={aktivna} stavke={vidljivi} />
      <Filter aktivna={aktivna} promijeni={postaviAktivnu} />
    </main>
  )
}
