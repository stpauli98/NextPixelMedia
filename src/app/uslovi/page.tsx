import { Labela } from '@/components/ui/Labela'
import { uslovi } from '@/content/uslovi'
import { tekstovi } from '@/content/tekstovi'

export const metadata = {
  title: 'Uslovi saradnje — NextPixel Media',
  description: 'Rezervacija, otkazivanje, isporuka, prava korištenja i arhiva.',
}

export default function Uslovi() {
  return (
    <main className="px-[4vw] pt-[10vw] pb-[6vw] max-md:px-[6vw] max-md:pt-[30vw] max-md:pb-[14vw]">
      <Labela>{tekstovi.usloviStranica.labela}</Labela>
      <h1 className="naslov mt-[1vw] max-md:mt-[4vw] text-[4vw] max-md:text-[10vw] text-white">{tekstovi.usloviStranica.naslov}</h1>

      <dl className="mt-[4vw] max-md:mt-[12vw] max-w-[55vw] max-md:max-w-none">
        {uslovi.map((stavka) => (
          <div key={stavka.naslov} className="border-t border-white/10 py-[1.5vw] max-md:py-[6vw]">
            <dt className="naslov text-[1.4vw] max-md:text-[5vw] text-champagne">{stavka.naslov}</dt>
            <dd className="mt-[0.5vw] max-md:mt-[2vw] font-body text-[0.95vw] max-md:text-[3.6vw] leading-relaxed text-white/75">
              {stavka.tekst}
            </dd>
          </div>
        ))}
      </dl>
    </main>
  )
}
