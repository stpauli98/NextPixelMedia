import Image from 'next/image'
import { Dugme } from '@/components/ui/Dugme'
import { Labela } from '@/components/ui/Labela'
import { slika } from '@/lib/media'
import { proces } from '@/content/proces'
import { ekipa } from '@/content/ekipa'
import { tekstovi } from '@/content/tekstovi'

export const metadata = {
  title: 'O nama — NextPixel Media',
  description: 'Dvoje ljudi, jedan do dva posla mjesečno, i proces koji se ne preskače.',
}

export default function ONama() {
  return (
    <main className="px-[4vw] pt-[10vw] pb-[6vw] max-md:px-[6vw] max-md:pt-[30vw] max-md:pb-[14vw]">
      <Labela>{tekstovi.introLabela}</Labela>
      <h1 className="naslov mt-[1vw] max-md:mt-[4vw] max-w-[60vw] max-md:max-w-none text-[4.5vw] max-md:text-[10vw] text-white">
        {tekstovi.oNama}
      </h1>
      <p className="mt-[2vw] max-md:mt-[6vw] max-w-[40vw] max-md:max-w-none font-body text-[1vw] max-md:text-[4vw] text-white/70">
        {tekstovi.intro}
      </p>

      <section className="mt-[7vw] max-md:mt-[18vw]">
        <Labela>{tekstovi.oNamaStranica.labelaProces}</Labela>
        <ul className="mt-[2vw] max-md:mt-[6vw] flex flex-col">
          {proces.map((faza) => (
            <li key={faza.broj} className="group flex items-baseline gap-[2vw] max-md:gap-[4vw] border-t border-white/10 py-[1.4vw] max-md:py-[5vw]">
              <span className="naslov text-[1.6vw] max-md:text-[5vw] text-champagne">{faza.broj}</span>
              <span aria-hidden="true" className="text-champagne">→</span>
              <span className="naslov text-[2.2vw] max-md:text-[6vw] text-white transition-colors group-hover:text-champagne">
                {faza.tekst}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-[7vw] max-md:mt-[18vw]">
        <Labela>{tekstovi.oNamaStranica.labelaEkipa}</Labela>
        <div className="mt-[2vw] max-md:mt-[6vw] grid grid-cols-2 gap-[2vw] max-md:grid-cols-1 max-md:gap-[8vw]">
          {ekipa.map((clan) => (
            <article key={clan.slikaId}>
              <div className="relative h-[24vw] max-md:h-[80vw] w-full overflow-hidden">
                <Image src={slika(clan.slikaId, 800, 1000)} alt={clan.ime} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover grayscale" />
              </div>
              <h3 className="naslov mt-[1vw] max-md:mt-[4vw] text-[1.8vw] max-md:text-[6vw] text-white">{clan.ime}</h3>
              <p className="font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.12em] text-champagne">[ {clan.uloga} ]</p>
              <p className="mt-[0.6vw] max-md:mt-[2vw] font-body text-[0.9vw] max-md:text-[3.5vw] text-white/70">{clan.opis}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-[5vw] max-md:mt-[14vw]">
        <Dugme href="/usluge" varijanta="puno">{tekstovi.oNamaStranica.dugmeUsluge}</Dugme>
      </div>
    </main>
  )
}
