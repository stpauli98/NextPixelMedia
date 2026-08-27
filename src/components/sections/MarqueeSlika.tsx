import Image from 'next/image'
import { slika } from '@/lib/media'
import { radovi } from '@/content/radovi'
import { tekstovi } from '@/content/tekstovi'

export function MarqueeSlika() {
  const izbor = radovi.slice(0, 10)
  const traka = [...izbor, ...izbor]

  return (
    <section className="w-full overflow-hidden bg-black py-[2vw] max-md:py-[8vw]">
      <div
        className="flex w-max gap-[1vw] max-md:gap-[3vw]"
        style={{ animation: 'marqueeLijevo 40s linear infinite' }}
      >
        {traka.map((rad, i) => (
          <div key={`${rad.id}-${i}`} className="relative h-[14vw] w-[20vw] max-md:h-[38vw] max-md:w-[55vw] shrink-0">
            <Image
              src={slika(rad.id, 800, 560)}
              alt={rad.naslov}
              fill sizes="(max-width: 768px) 55vw, 20vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <p className="mt-[1.5vw] max-md:mt-[6vw] px-[4vw] max-md:px-[6vw] text-right font-body text-[0.9vw] max-md:text-[3.4vw] uppercase tracking-[0.2em] text-champagne">
        {tekstovi.hero.podnaslov}
      </p>
    </section>
  )
}
