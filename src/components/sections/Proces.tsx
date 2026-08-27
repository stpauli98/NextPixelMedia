import { procesKratko } from '@/content/proces'

export function Proces() {
  const traka = [...procesKratko, ...procesKratko]

  return (
    <section className="flex h-[9vw] max-md:h-[22vw] w-full items-center overflow-hidden bg-navy">
      <div className="marquee-traka flex w-max gap-[3vw] max-md:gap-[8vw]" style={{ animation: 'marqueeLijevo 30s linear infinite' }}>
        {traka.map((faza, i) => (
          <span key={`${faza}-${i}`} className="naslov shrink-0 text-[2.6vw] max-md:text-[7vw] text-white">
            <span className="text-champagne">{String((i % procesKratko.length) + 1).padStart(2, '0')}</span>{' '}
            {faza}
          </span>
        ))}
      </div>
    </section>
  )
}
