import { Labela } from '@/components/ui/Labela'
import { odjeljciPrivatnosti, napomenaPrivatnost } from '@/content/privatnost'
import { tekstovi } from '@/content/tekstovi'

export const metadata = {
  title: 'Privatnost — NextPixel Media',
  description: 'Lica na snimcima, snimanje djece, dron i privatnost.',
}

export default function Privatnost() {
  return (
    <main className="px-[4vw] pt-[10vw] pb-[6vw] max-md:px-[6vw] max-md:pt-[30vw] max-md:pb-[14vw]">
      <Labela>{tekstovi.privatnostStranica.labela}</Labela>
      <h1 className="naslov mt-[1vw] max-md:mt-[4vw] text-[4vw] max-md:text-[10vw] text-white">{tekstovi.privatnostStranica.naslov}</h1>

      <dl className="mt-[4vw] max-md:mt-[12vw] max-w-[55vw] max-md:max-w-none">
        {odjeljciPrivatnosti.map((o) => (
          <div key={o.naslov} className="border-t border-white/10 py-[1.5vw] max-md:py-[6vw]">
            <dt className="naslov text-[1.4vw] max-md:text-[5vw] text-champagne">{o.naslov}</dt>
            <dd className="mt-[0.5vw] max-md:mt-[2vw] font-body text-[0.95vw] max-md:text-[3.6vw] leading-relaxed text-white/75">{o.tekst}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-[3vw] max-md:mt-[10vw] font-body text-[0.8vw] max-md:text-[3vw] text-gray">
        {napomenaPrivatnost}
      </p>
    </main>
  )
}
