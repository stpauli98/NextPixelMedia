import { Forma } from '@/components/kontakt/Forma'
import { Labela } from '@/components/ui/Labela'
import { tekstovi } from '@/content/tekstovi'

export const metadata = {
  title: 'Kontakt — NextPixel Media',
  description: tekstovi.kontaktForma.metaOpis,
}

export default function Kontakt() {
  return (
    <main className="min-h-screen px-[4vw] pt-[10vw] pb-[6vw] max-md:px-[6vw] max-md:pt-[30vw] max-md:pb-[15vw]">
      <div className="grid grid-cols-[1fr_1.6fr] gap-[4vw] max-md:grid-cols-1 max-md:gap-[10vw]">
        <div>
          <Labela>{tekstovi.kontaktForma.labela}</Labela>
          <h1 className="naslov mt-[1vw] max-md:mt-[4vw] text-[4vw] max-md:text-[11vw] text-white">
            {tekstovi.kontaktHero}
          </h1>
          <a
            href={`mailto:${tekstovi.cta.email}`}
            className="mt-[2vw] max-md:mt-[6vw] inline-block font-body text-[1.1vw] max-md:text-[4.5vw] text-champagne hover:text-white"
          >
            {tekstovi.cta.email}
          </a>
        </div>
        <Forma />
      </div>
    </main>
  )
}
