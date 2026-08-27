import { Dugme } from '@/components/ui/Dugme'
import { tekstovi } from '@/content/tekstovi'

export function Citat() {
  return (
    <section className="relative w-full bg-black px-[4vw] py-[10vw] max-md:px-[6vw] max-md:py-[20vw]">
      <span aria-hidden="true" className="naslov absolute left-[4vw] top-[4vw] max-md:left-[6vw] max-md:top-[10vw] text-[12vw] max-md:text-[26vw] leading-none text-champagne">
        &ldquo;
      </span>

      <blockquote className="naslov mx-auto max-w-[60vw] max-md:max-w-none text-center text-[3.2vw] max-md:text-[7.5vw] text-white">
        {tekstovi.citat}
      </blockquote>

      <div className="mt-[3vw] max-md:mt-[10vw] flex justify-center">
        <Dugme href="/o-nama">{tekstovi.introDugmad.kako}</Dugme>
      </div>
    </section>
  )
}
