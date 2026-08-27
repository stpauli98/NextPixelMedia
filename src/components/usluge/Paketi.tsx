import { Okvir } from '@/components/ui/Okvir'
import { Labela } from '@/components/ui/Labela'
import { paketi } from '@/content/paketi'
import { tekstovi } from '@/content/tekstovi'

export function Paketi() {
  return (
    <section className="isolate w-full bg-cream px-[4vw] py-[7vw] max-md:px-[6vw] max-md:py-[16vw]">
      <Labela className="text-black/60">{tekstovi.paketi.labela}</Labela>
      <h2 className="naslov mt-[1vw] max-md:mt-[4vw] text-[4vw] max-md:text-[10vw] text-black">
        {tekstovi.paketi.naslov}
      </h2>

      <div className="mt-[4vw] max-md:mt-[12vw] grid grid-cols-3 gap-[2vw] max-md:grid-cols-1 max-md:gap-[8vw]">
        {paketi.map((paket) => (
          <Okvir key={paket.naziv} className="block">
            <div className={`flex h-full flex-col p-[2vw] max-md:p-[6vw] ${paket.istaknut ? 'bg-black text-white' : 'border border-black/15 text-black'}`}>
              <h3 className={`naslov text-[2.2vw] max-md:text-[7vw] ${paket.istaknut ? 'text-champagne' : 'text-black'}`}>
                {paket.naziv}
              </h3>
              <p className={`mt-[0.4vw] max-md:mt-[2vw] font-body text-[0.85vw] max-md:text-[3.2vw] ${paket.istaknut ? 'text-white/60' : 'text-black/60'}`}>
                {paket.zaKoga}
              </p>
              <p className="naslov mt-[1.5vw] max-md:mt-[5vw] text-[3vw] max-md:text-[9vw]">
                {paket.cijena} <span className="text-[1.2vw] max-md:text-[4vw]">{tekstovi.paketi.valuta}</span>
              </p>
              <ul className="mt-[1.5vw] max-md:mt-[5vw] flex flex-col gap-[0.5vw] max-md:gap-[2vw]">
                {paket.stavke.map((s) => (
                  <li key={s} className={`font-body text-[0.85vw] max-md:text-[3.4vw] ${paket.istaknut ? 'text-white/80' : 'text-black/75'}`}>
                    <span className={paket.istaknut ? 'text-champagne' : 'text-navy'}>—</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </Okvir>
        ))}
      </div>

      <p className="mt-[2vw] max-md:mt-[8vw] font-body text-[0.8vw] max-md:text-[3vw] text-black/60">
        {tekstovi.paketi.napomena}
      </p>
    </section>
  )
}
