import { tekstovi } from '@/content/tekstovi'

export function CTA() {
  return (
    <section className="w-full bg-cream px-[4vw] pb-[6vw] max-md:px-[6vw] max-md:pb-[14vw]">
      <div className="flex items-end justify-between gap-[3vw] border-t border-black/15 pt-[3vw] max-md:flex-col max-md:items-start max-md:gap-[6vw] max-md:pt-[10vw]">
        <p className="font-body text-[2vw] max-md:text-[6vw] text-black/70">{tekstovi.cta.naslov}</p>
        <a
          href={`mailto:${tekstovi.cta.email}`}
          className="font-body text-[1.8vw] max-md:text-[5vw] text-black hover:text-champagne"
        >
          {tekstovi.cta.email}
        </a>
      </div>
    </section>
  )
}
