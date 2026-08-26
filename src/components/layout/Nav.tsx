'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Meni } from './Meni'
import { Okvir } from '@/components/ui/Okvir'

export function Nav() {
  const [otvoren, postaviOtvoren] = useState(false)

  return (
    <>
      <Meni otvoren={otvoren} zatvori={() => postaviOtvoren(false)} />

      <nav className="fixed top-0 left-0 z-[999] flex w-full items-center justify-between px-[4vw] py-[2.2vw] max-md:px-[6vw] max-md:py-[5vw]">
        <Link href="/" aria-label="NextPixel Media, početna" className="relative z-10">
          <span className="naslov text-[1.4vw] max-md:text-[5vw] text-white">
            N<span className="text-champagne">P</span>
          </span>
        </Link>

        <div className="relative z-10 flex items-center gap-[1.5vw] max-md:gap-[4vw]">
          <Okvir>
            <Link
              href="/kontakt"
              className="inline-block bg-champagne px-[1.2vw] py-[0.6vw] max-md:px-[4vw] max-md:py-[2.5vw] font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.1em] text-black transition-colors hover:bg-white"
            >
              Započni projekat
            </Link>
          </Okvir>

          <Okvir>
            <button
              type="button"
              onClick={() => postaviOtvoren((v) => !v)}
              aria-expanded={otvoren}
              className="inline-flex items-center gap-[0.6vw] max-md:gap-[2vw] border border-white/15 bg-black px-[1.2vw] py-[0.6vw] max-md:px-[4vw] max-md:py-[2.5vw] font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.1em] text-white"
            >
              {otvoren ? 'Zatvori' : 'Meni'}
              <span aria-hidden="true">{otvoren ? '✕' : '☰'}</span>
            </button>
          </Okvir>
        </div>
      </nav>
    </>
  )
}
