import { Broj } from '@/components/ui/Broj'
import { rokovi } from '@/content/rokovi'
import { tekstovi } from '@/content/tekstovi'

export function Rokovi() {
  return (
    <section className="w-full bg-cream px-[4vw] py-[8vw] max-md:px-[6vw] max-md:py-[16vw]">
      <div className="relative">
        <h2 className="naslov text-[13vw] max-md:text-[22vw] leading-none text-black">
          {tekstovi.rokoviNaslov}
        </h2>

        {tekstovi.rokoviNaljepnice.map((naljepnica, i) => {
          const positions = [
            { top: 25, left: 12 },
            { top: 51, left: 32 },
            { top: 77, left: 48 },
          ]
          const pos = positions[i] || { top: 25, left: 12 }
          return (
            <span
              key={naljepnica}
              className="absolute bg-champagne px-[0.6vw] py-[0.2vw] max-md:px-[2.5vw] max-md:py-[1vw] font-body text-[0.85vw] max-md:text-[3vw] uppercase tracking-[0.08em] text-black"
              style={{ top: `${pos.top}%`, left: `${pos.left}%`, transform: `rotate(${i % 2 ? 2 : -2}deg)` }}
            >
              {naljepnica}
            </span>
          )
        })}
      </div>

      <div className="mt-[5vw] max-md:mt-[14vw] grid grid-cols-4 gap-[2vw] max-md:grid-cols-2 max-md:gap-[8vw] border-t border-dashed border-black/25 pt-[3vw] max-md:pt-[10vw]">
        {rokovi.map((rok) => (
          <div key={rok.vrijednost}>
            <Broj vrijednost={rok.vrijednost} opis={rok.opis} naSvijetloj />
          </div>
        ))}
      </div>
    </section>
  )
}
