'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { RUTE } from '@/content/rute'
import { tekstovi } from '@/content/tekstovi'

type Props = { otvoren: boolean; zatvori: () => void }

export function Meni({ otvoren, zatvori }: Props) {
  const putanja = usePathname()
  const prviLinkRef = useRef<HTMLAnchorElement>(null)

  // Kad se meni otvori, fokus ide na prvi link — inače tastatura
  // ostaje na dugmetu iza nevidljivog panela.
  useEffect(() => {
    if (otvoren) prviLinkRef.current?.focus()
  }, [otvoren])

  // Escape zatvara meni isto kao klik na link.
  useEffect(() => {
    if (!otvoren) return
    function naTaster(dogadjaj: KeyboardEvent) {
      if (dogadjaj.key === 'Escape') zatvori()
    }
    window.addEventListener('keydown', naTaster)
    return () => window.removeEventListener('keydown', naTaster)
  }, [otvoren, zatvori])

  return (
    <div
      inert={!otvoren}
      className={`fixed inset-0 z-[998] bg-black transition-opacity duration-500 ${
        otvoren ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <nav className="flex h-full flex-col justify-center px-[10vw] max-md:px-[8vw]">
        {RUTE.map((ruta, i) => (
          <Link
            key={ruta.href}
            ref={i === 0 ? prviLinkRef : undefined}
            href={ruta.href}
            onClick={zatvori}
            style={{ transitionDelay: otvoren ? `${120 + i * 60}ms` : '0ms' }}
            className={`naslov py-[0.6vw] max-md:py-[2vw] text-[5vw] max-md:text-[12vw] transition-all duration-500 ${
              otvoren ? 'translate-y-0 opacity-100' : 'translate-y-[1vw] max-md:translate-y-[3vw] opacity-0'
            } ${putanja === ruta.href ? 'text-champagne' : 'text-gray hover:text-white'}`}
          >
            {ruta.naziv}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-[3vw] left-[10vw] right-[10vw] flex justify-between max-md:bottom-[8vw] max-md:left-[8vw] max-md:right-[8vw]">
        <span className="font-body text-[0.75vw] max-md:text-[2.6vw] uppercase tracking-[0.15em] text-gray">
          {tekstovi.chrome.meni.copyright}
        </span>
        <span className="font-body text-[0.75vw] max-md:text-[2.6vw] uppercase tracking-[0.15em] text-gray">
          {tekstovi.chrome.meni.oznaka}
        </span>
      </div>
    </div>
  )
}
