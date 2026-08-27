'use client'

import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { BEZ_REDUKCIJE, useGsap } from '@/lib/useGsap'
import { jePlaceholder, slika, video } from '@/lib/media'
import { Labela } from '@/components/ui/Labela'
import { tekstovi } from '@/content/tekstovi'

function UgaoVizira({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`absolute size-[2.2vw] max-md:size-[7vw] text-champagne ${className}`}>
      <path d="M1 9 L1 1 L9 1" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  )
}

export function Vizir() {
  // trigger je `korijen`, ne selektor. Selektori unutar gsap.context traže
  // POTOMKE scope elementa, pa '[data-vizir]' — koji stoji na samom scope
  // korijenu — nikad ne bi pogodio. ScrollTrigger bi tiho pao na cijeli
  // dokument i sekcija bi se okidala na pogrešnom mjestu.
  const scope = useGsap<HTMLElement>((mm, korijen) => {
    mm.add(BEZ_REDUKCIJE, () => {
      gsap.from('[data-vizir-okvir]', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: korijen, start: 'top 70%' },
      })
    })
  })

  return (
    <section ref={scope} data-vizir className="w-full bg-black px-[4vw] py-[7vw] max-md:px-[6vw] max-md:py-[16vw]">
      <div className="mb-[2vw] max-md:mb-[6vw] flex justify-between">
        <Labela>{tekstovi.vizir.labelaKadar}</Labela>
        <Labela>{tekstovi.vizir.labelaFokus}</Labela>
      </div>

      <div data-vizir-okvir className="relative mx-auto w-[72vw] max-md:w-full">
        <UgaoVizira className="left-[-1vw] top-[-1vw] max-md:left-[-2vw] max-md:top-[-2vw]" />
        <UgaoVizira className="right-[-1vw] top-[-1vw] max-md:right-[-2vw] max-md:top-[-2vw] -scale-x-100" />
        <UgaoVizira className="bottom-[-1vw] left-[-1vw] max-md:bottom-[-2vw] max-md:left-[-2vw] -scale-y-100" />
        <UgaoVizira className="bottom-[-1vw] right-[-1vw] max-md:bottom-[-2vw] max-md:right-[-2vw] rotate-180" />

        <div className="relative aspect-video w-full overflow-hidden">
          {jePlaceholder ? (
            <Image src={slika('vizir', 1600, 900)} alt={tekstovi.vizir.alt} fill sizes="72vw" className="object-cover" />
          ) : (
            <video
              src={video('vizir')}
              autoPlay muted loop playsInline
              className="h-full w-full object-cover"
            />
          )}

          {/* Krstić u sredini — oznaka fokusa, ne ukras. */}
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[3vw] max-md:size-[10vw] -translate-x-1/2 -translate-y-1/2">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-champagne/50" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-champagne/50" />
          </div>
        </div>

        <div className="mt-[0.8vw] max-md:mt-[3vw] flex justify-between font-body text-[0.7vw] max-md:text-[2.6vw] uppercase tracking-[0.18em] text-champagne">
          <span>{tekstovi.vizir.hudLijevo.join('  ·  ')}</span>
          <span>{tekstovi.vizir.hudDesno.join('  ·  ')}</span>
        </div>
      </div>
    </section>
  )
}
