'use client'

import { gsap, SplitText } from '@/lib/gsap'
import { BEZ_REDUKCIJE, useGsap } from '@/lib/useGsap'
import { tekstovi } from '@/content/tekstovi'

export function Statement() {
  const scope = useGsap<HTMLElement>((mm) => {
    mm.add(BEZ_REDUKCIJE, () => {
      const split = new SplitText('[data-statement]', { type: 'lines', linesClass: 'linija', mask: 'lines' })

      gsap.from(split.lines, {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-statement]', start: 'top 75%' },
      })

      return () => split.revert()
    })
  })

  return (
    <section ref={scope} className="w-full bg-cream px-[4vw] py-[8vw] max-md:px-[6vw] max-md:py-[18vw]">
      <p data-statement className="naslov max-w-[70vw] max-md:max-w-none text-[4vw] max-md:text-[8.5vw] text-black">
        {tekstovi.statement.prvi}{' '}
        <span className="text-champagne">{tekstovi.statement.naglasak}</span>{' '}
        {tekstovi.statement.drugi}
      </p>
    </section>
  )
}
