'use client'

import Image from 'next/image'
import Link from 'next/link'
import { slika } from '@/lib/media'
import { usluge } from '@/content/usluge'

export function TriUsluge() {
  const prve = usluge.slice(0, 3)

  return (
    <section className="flex h-[46vw] max-md:h-auto max-md:flex-col w-full bg-black">
      {prve.map((usluga) => (
        <Link
          key={usluga.broj}
          href="/usluge"
          className="group relative flex flex-1 flex-col justify-between overflow-hidden border-r border-white/10 p-[2vw] max-md:h-[80vw] max-md:border-r-0 max-md:border-b max-md:p-[6vw]"
        >
          <Image
            src={slika(`usluga-${usluga.broj}`, 900, 1200)}
            alt=""
            fill sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-25 transition-opacity duration-500 group-hover:opacity-45 group-focus-visible:opacity-45"
          />

          <div className="relative">
            <p className="font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.15em] text-champagne">
              {usluga.naziv}
            </p>
            <h3 className="naslov mt-[0.6vw] max-md:mt-[2vw] text-[2.6vw] max-md:text-[8vw] text-white">
              {usluga.naslov}
            </h3>
            <p className="mt-[1vw] max-md:mt-[4vw] max-w-[20vw] max-md:max-w-none font-body text-[0.85vw] max-md:text-[3.4vw] text-white/70">
              {usluga.opis}
            </p>
          </div>

          <span
            aria-hidden="true"
            className="naslov relative self-end text-[7vw] max-md:text-[18vw] text-transparent"
            style={{ WebkitTextStroke: '1px var(--color-champagne)' }}
          >
            {usluga.broj}
          </span>
        </Link>
      ))}
    </section>
  )
}
