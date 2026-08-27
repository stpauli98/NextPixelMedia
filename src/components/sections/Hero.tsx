'use client'

import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { BEZ_REDUKCIJE, useGsap } from '@/lib/useGsap'
import { slika } from '@/lib/media'
import { tekstovi } from '@/content/tekstovi'

export function Hero() {
  const scope = useGsap<HTMLElement>((mm, korijen) => {
    mm.add(BEZ_REDUKCIJE, () => {
      gsap.to('[data-hero-naslov]', {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: korijen,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          pin: '[data-hero-ekran]',
          pinSpacing: false,
        },
      })
    })
  })

  return (
    <header ref={scope} data-hero className="relative h-[200vh] w-full motion-reduce:h-screen">
      <div data-hero-ekran className="relative h-screen w-full overflow-hidden">
        <Image
          src={slika('hero', 1920, 1080)}
          alt="Kadar iz vazduha, okolina Gradiške"
          fill priority sizes="100vw"
          className="object-cover brightness-[0.55]"
        />

        <div data-hero-naslov className="absolute inset-0 flex flex-col justify-center px-[4vw] max-md:px-[6vw]">
          <h1 className="naslov text-[9vw] max-md:text-[15vw] text-white">
            {tekstovi.hero.marka.prvi}<span className="text-champagne">.</span>
            <br />
            {tekstovi.hero.marka.drugi}
          </h1>
          <p className="mt-[1.5vw] max-md:mt-[5vw] font-body text-[1.1vw] max-md:text-[4vw] uppercase tracking-[0.2em] text-champagne">
            {tekstovi.hero.podnaslov}
          </p>
          <p className="mt-[0.8vw] max-md:mt-[3vw] max-w-[32vw] max-md:max-w-none font-body text-[0.95vw] max-md:text-[3.6vw] text-white/80">
            {tekstovi.hero.opis}
          </p>
        </div>

        <span className="absolute bottom-[2vw] left-[4vw] max-md:bottom-[6vw] max-md:left-[6vw] font-body text-[0.75vw] max-md:text-[3vw] uppercase tracking-[0.2em] text-white/60">
          {tekstovi.hero.scroll}
        </span>
      </div>
    </header>
  )
}
