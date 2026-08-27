import { Dugme } from '@/components/ui/Dugme'
import { Labela } from '@/components/ui/Labela'
import { tekstovi } from '@/content/tekstovi'

export function Intro() {
  return (
    <section className="w-full bg-black px-[4vw] py-[7vw] max-md:px-[6vw] max-md:py-[16vw]">
      <Labela>{tekstovi.introLabela}</Labela>
      <p className="naslov mt-[1.5vw] max-md:mt-[5vw] max-w-[55vw] max-md:max-w-none text-[3.2vw] max-md:text-[8vw] text-white">
        {tekstovi.intro}
      </p>
      <div className="mt-[2.5vw] max-md:mt-[8vw] flex gap-[1.5vw] max-md:flex-col max-md:items-start max-md:gap-[4vw]">
        <Dugme href="/radovi" varijanta="puno">{tekstovi.introDugmad.radovi}</Dugme>
        <Dugme href="/o-nama">{tekstovi.introDugmad.kako}</Dugme>
      </div>
    </section>
  )
}
