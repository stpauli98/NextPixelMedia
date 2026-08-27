import { Dugme } from '@/components/ui/Dugme'
import { tekstovi } from '@/content/tekstovi'

export function GalerijaCTA() {
  return (
    <section className="w-full bg-black px-[4vw] py-[6vw] max-md:px-[6vw] max-md:py-[14vw]">
      <div className="flex items-end justify-between gap-[3vw] max-md:flex-col max-md:items-start max-md:gap-[5vw]">
        <h2 className="naslov text-[3.5vw] max-md:text-[9vw] text-white">{tekstovi.galerijaCta.naslov}</h2>
        <Dugme href="/radovi" varijanta="puno">{tekstovi.galerijaCta.dugme}</Dugme>
      </div>
    </section>
  )
}
