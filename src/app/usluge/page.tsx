import { PinPanel } from '@/components/usluge/PinPanel'
import { Paketi } from '@/components/usluge/Paketi'
import { Broj } from '@/components/ui/Broj'
import { Labela } from '@/components/ui/Labela'
import { usluge } from '@/content/usluge'
import { rokovi } from '@/content/rokovi'
import { tekstovi } from '@/content/tekstovi'

export const metadata = {
  title: 'Usluge — NextPixel Media',
  description: 'Sadržaj za firme, nekretnine, dron, eventi, sport. Gradiška i Banja Luka.',
}

export default function Usluge() {
  return (
    <main>
      <header className="flex min-h-screen flex-col justify-center px-[4vw] pt-[10vw] pb-[4vw] max-md:px-[6vw] max-md:pt-[30vw] max-md:pb-[10vw]">
        <div className="flex justify-end">
          <ul className="text-right">
            <li><Labela>{tekstovi.usluge.naslov}</Labela></li>
            {usluge.map((u) => (
              <li key={u.broj} className="font-body text-[0.85vw] max-md:text-[3vw] uppercase tracking-[0.1em] text-gray">
                [ {u.naziv} ] [ {u.broj} ]
              </li>
            ))}
          </ul>
        </div>

        <h1 className="naslov mt-[3vw] max-md:mt-[10vw] text-[7vw] max-md:text-[13vw] text-white">
          {tekstovi.uslugeHero}
        </h1>

        <div className="mt-[5vw] max-md:mt-[14vw] grid grid-cols-4 gap-[2vw] max-md:grid-cols-2 max-md:gap-[6vw]">
          {rokovi.map((r) => <Broj key={r.vrijednost} vrijednost={r.vrijednost} opis={r.opis} />)}
        </div>
      </header>

      <div className="isolate">
        {usluge.map((u, i) => (
          <PinPanel key={u.broj} usluga={u} ukupno={usluge.length} redoslijed={i + 1} />
        ))}
      </div>

      <Paketi />
    </main>
  )
}
