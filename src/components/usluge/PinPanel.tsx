'use client'

import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { slika } from '@/lib/media'
import { Labela } from '@/components/ui/Labela'
import { tekstovi } from '@/content/tekstovi'
import type { Usluga } from '@/content/tipovi'

const NA_DESKTOPU = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'

export function PinPanel({ usluga, ukupno, redoslijed }: { usluga: Usluga; ukupno: number; redoslijed: number }) {
  const scope = useGsap<HTMLElement>((mm, korijen) => {
    mm.add(NA_DESKTOPU, () => {
      // pinSpacing: false znači da sljedeći panel klizi preko ovog,
      // pa se paneli slažu jedan na drugi umjesto da se nižu.
      ScrollTrigger.create({
        trigger: korijen,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: false,
      })

      gsap.from(korijen.querySelector('[data-panel-sadrzaj]'), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: korijen, start: 'top 60%' },
      })
    })
  })

  return (
    <section
      ref={scope}
      data-panel
      style={{ zIndex: redoslijed }}
      className="relative h-screen w-full overflow-hidden bg-black max-md:h-auto max-md:min-h-[120vw]"
    >
      <Image
        src={slika(`usluga-${usluga.broj}`, 1920, 1080)}
        alt=""
        fill sizes="100vw"
        className="object-cover brightness-[0.4]"
      />

      <div data-panel-sadrzaj className="relative flex h-full flex-col justify-end p-[4vw] max-md:p-[6vw] max-md:pt-[25vw]">
        <div className="flex items-end gap-[2vw] max-md:flex-col max-md:items-start max-md:gap-[5vw]">
          <span className="naslov text-[7vw] max-md:text-[20vw] leading-none text-champagne">
            {usluga.broj}
            <span className="font-body text-[1.2vw] max-md:text-[4vw] text-white/50">/{String(ukupno).padStart(2, '0')}</span>
          </span>

          <div className="flex-1 border-l border-white/20 pl-[2vw] max-md:border-l-0 max-md:pl-0">
            <h2 className="naslov text-[2.4vw] max-md:text-[8vw] text-white">{usluga.naziv}</h2>
            <p className="mt-[0.8vw] max-md:mt-[3vw] max-w-[26vw] max-md:max-w-none font-body text-[0.9vw] max-md:text-[3.5vw] text-white/75">
              {usluga.opis}
            </p>
          </div>

          <div className="max-w-[24vw] max-md:max-w-none">
            <Labela>{tekstovi.usluge.ukljuceno}</Labela>
            <ul className="mt-[0.8vw] max-md:mt-[3vw] flex flex-wrap justify-end gap-[0.5vw] max-md:justify-start max-md:gap-[2vw]">
              {usluga.ukljuceno.map((stavka) => (
                <li key={stavka} className="border border-white/25 px-[0.8vw] py-[0.35vw] max-md:px-[3.5vw] max-md:py-[2vw] font-body text-[0.75vw] max-md:text-[3vw] uppercase tracking-[0.06em] text-white">
                  {stavka}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
