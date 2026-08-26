'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Meni } from './Meni'
import { Okvir } from '@/components/ui/Okvir'
import { tekstovi } from '@/content/tekstovi'

export function Nav() {
  const [otvoren, postaviOtvoren] = useState(false)
  const dugmeRef = useRef<HTMLButtonElement>(null)

  // Poziva Meni kad zatvara preko linka ili Escape-a — fokus se mora
  // vratiti na dugme koje ga je otvorilo, inače korisnik tastature ostaje
  // bez orijentacije.
  function zatvoriMeni() {
    postaviOtvoren(false)
    dugmeRef.current?.focus()
  }

  return (
    <>
      <Meni otvoren={otvoren} zatvori={zatvoriMeni} />

      <nav className="fixed top-0 left-0 z-[999] flex w-full items-center justify-between px-[4vw] py-[2.2vw] max-md:px-[6vw] max-md:py-[5vw]">
        <Link href="/" aria-label={tekstovi.chrome.nav.logoAria} className="relative z-10">
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
              {tekstovi.chrome.nav.cta}
            </Link>
          </Okvir>

          <Okvir>
            <button
              ref={dugmeRef}
              type="button"
              onClick={() => postaviOtvoren((v) => !v)}
              aria-expanded={otvoren}
              className="inline-flex items-center gap-[0.6vw] max-md:gap-[2vw] border border-white/15 bg-black px-[1.2vw] py-[0.6vw] max-md:px-[4vw] max-md:py-[2.5vw] font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.1em] text-white"
            >
              {otvoren ? tekstovi.chrome.nav.meniZatvori : tekstovi.chrome.nav.meniOtvori}
              <span aria-hidden="true">{otvoren ? '✕' : '☰'}</span>
            </button>
          </Okvir>
        </div>
      </nav>
    </>
  )
}
