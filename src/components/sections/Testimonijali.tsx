import { Labela } from '@/components/ui/Labela'
import { testimonijali } from '@/content/testimonijali'

export function Testimonijali() {
  if (testimonijali.length === 0) return null

  return (
    <section className="w-full bg-cream px-[4vw] py-[6vw] max-md:px-[6vw] max-md:py-[14vw]">
      <div className="flex flex-col gap-[3vw] max-md:gap-[10vw]">
        {testimonijali.map((t) => (
          <figure key={t.ime} className="border border-dashed border-black/25 p-[2vw] max-md:p-[6vw]">
            <blockquote className="naslov text-[2vw] max-md:text-[6vw] text-black">{t.citat}</blockquote>
            <figcaption className="mt-[1.5vw] max-md:mt-[5vw]">
              <Labela className="!text-black/60">{t.ime} — {t.uloga}</Labela>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
