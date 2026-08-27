'use client'

import { Labela } from '@/components/ui/Labela'
import { KATEGORIJE } from '@/content/radovi'
import { tekstovi } from '@/content/tekstovi'
import type { Kategorija } from '@/content/tipovi'

type Props = { aktivna: Kategorija | 'SVE'; promijeni: (k: Kategorija | 'SVE') => void }

export function Filter({ aktivna, promijeni }: Props) {
  const opcije: (Kategorija | 'SVE')[] = ['SVE', ...KATEGORIJE]

  return (
    <div className="fixed bottom-[2vw] left-1/2 z-50 -translate-x-1/2 border border-white/15 bg-black/85 px-[1.5vw] py-[1vw] backdrop-blur max-md:bottom-[4vw] max-md:w-[88vw] max-md:px-[4vw] max-md:py-[4vw]">
      <Labela>{tekstovi.radoviFilter.labela}</Labela>
      <div className="mt-[0.6vw] max-md:mt-[3vw] flex flex-wrap gap-[0.5vw] max-md:gap-[2vw]">
        {opcije.map((opcija) => (
          <button
            key={opcija} type="button" onClick={() => promijeni(opcija)}
            className={`px-[0.9vw] py-[0.4vw] max-md:px-[3.5vw] max-md:py-[2vw] font-body text-[0.75vw] max-md:text-[3vw] uppercase tracking-[0.08em] transition-colors ${
              aktivna === opcija ? 'bg-champagne text-black' : 'text-gray hover:text-white'
            }`}
          >
            {opcija === 'SVE' ? tekstovi.radoviFilter.sve : opcija}
          </button>
        ))}
      </div>
    </div>
  )
}
