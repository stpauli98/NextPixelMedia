'use client'

import { useState } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { BEZ_REDUKCIJE, useGsap } from '@/lib/useGsap'
import { slika } from '@/lib/media'
import { radovi } from '@/content/radovi'
import type { Rad } from '@/content/tipovi'

export function MrezaRadova() {
  const [aktivan, postaviAktivan] = useState<Rad | null>(null)

  const scope = useGsap<HTMLElement>((mm, korijen) => {
    mm.add(BEZ_REDUKCIJE, () => {
      korijen.querySelectorAll('[data-red]').forEach((red, i) => {
        gsap.fromTo(
          red,
          { xPercent: i % 2 === 0 ? 0 : -10 },
          {
            xPercent: i % 2 === 0 ? -10 : 0,
            ease: 'none',
            scrollTrigger: { trigger: korijen, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    })
  })

  const redovi = [radovi.slice(0, 7), radovi.slice(7, 13), radovi.slice(13, 19)]

  return (
    <section
      ref={scope}
      className="relative w-full overflow-hidden bg-black py-[4vw] max-md:py-[12vw]"
      onMouseLeave={() => postaviAktivan(null)}
      onBlur={(e) => {
        // Ako fokus ide na drugu pločicu unutar iste sekcije, ne gasi pregled —
        // samo kad napusti sekciju (npr. tab iza posljednje pločice).
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) postaviAktivan(null)
      }}
    >
      <div className="flex flex-col gap-[1vw] max-md:gap-[2vw]">
        {redovi.map((red, i) => (
          <div key={i} data-red className="flex w-max gap-[1vw] max-md:gap-[2vw]">
            {red.map((rad) => (
              <button
                key={rad.id}
                type="button"
                onMouseEnter={() => postaviAktivan(rad)}
                onFocus={() => postaviAktivan(rad)}
                className="relative h-[13vw] w-[19vw] max-md:h-[26vw] max-md:w-[38vw] shrink-0 overflow-hidden"
              >
                <Image
                  src={slika(rad.id, 700, 480)}
                  alt={rad.naslov}
                  fill sizes="(max-width: 768px) 38vw, 19vw"
                  className={`object-cover transition-all duration-500 ${
                    aktivan && aktivan.id !== rad.id ? 'brightness-[0.3]' : 'brightness-75'
                  }`}
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Pregled u centru. Ne hvata pokazivač da ne prekine hover ispod, i sakriven
          od screen readera — naslov i slika samo ponavljaju već fokusiranu pločicu. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 z-20 w-[38vw] max-md:w-[70vw] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          aktivan ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {aktivan && (
          <>
            <p className="mb-[0.6vw] max-md:mb-[2vw] font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.15em] text-champagne">
              ▶ {aktivan.naslov}
            </p>
            <div className="relative aspect-video w-full overflow-hidden border border-champagne/40">
              <Image
                src={slika(aktivan.id, 1200, 675)}
                alt={aktivan.naslov}
                fill sizes="(max-width: 768px) 70vw, 38vw"
                className="object-cover"
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
