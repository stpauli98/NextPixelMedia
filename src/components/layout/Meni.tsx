'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RUTE } from '@/content/rute'

type Props = { otvoren: boolean; zatvori: () => void }

export function Meni({ otvoren, zatvori }: Props) {
  const putanja = usePathname()

  return (
    <div
      className={`fixed inset-0 z-[998] bg-black transition-opacity duration-500 ${
        otvoren ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <nav className="flex h-full flex-col justify-center px-[10vw] max-md:px-[8vw]">
        {RUTE.map((ruta, i) => (
          <Link
            key={ruta.href}
            href={ruta.href}
            onClick={zatvori}
            style={{ transitionDelay: otvoren ? `${120 + i * 60}ms` : '0ms' }}
            className={`naslov py-[0.6vw] max-md:py-[2vw] text-[5vw] max-md:text-[12vw] transition-all duration-500 ${
              otvoren ? 'translate-y-0 opacity-100' : 'translate-y-[1vw] opacity-0'
            } ${putanja === ruta.href ? 'text-champagne' : 'text-gray hover:text-white'}`}
          >
            {ruta.naziv}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-[3vw] left-[10vw] right-[10vw] flex justify-between max-md:bottom-[8vw] max-md:left-[8vw] max-md:right-[8vw]">
        <span className="font-body text-[0.75vw] max-md:text-[2.6vw] uppercase tracking-[0.15em] text-gray">
          © 2026 NextPixel Media — Gradiška, BA
        </span>
        <span className="font-body text-[0.75vw] max-md:text-[2.6vw] uppercase tracking-[0.15em] text-gray">
          Foto · Video · Dron
        </span>
      </div>
    </div>
  )
}
