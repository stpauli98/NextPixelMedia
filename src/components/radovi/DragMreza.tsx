'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap, Observer } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { slika } from '@/lib/media'
import type { Rad } from '@/content/tipovi'

// Sve mjere u vw. Korak uključuje razmak, pa ploče naliježu bez šava.
// kolone × (sirina + razmak) mora biti ≥ 100 na X osi, inače dva
// susjedna kopija ploče ne pokriju cijeli ekran i pri svakom punom
// ciklusu omotavanja proviri prazna traka.
const DESKTOP = { kolone: 5, sirina: 20, visina: 15, razmak: 1 } // ploča: 105vw širine
const MOBILNI = { kolone: 3, sirina: 32, visina: 22, razmak: 2 } // ploča: 102vw širine

const KOPIJE = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
] as const

// Korak tastature, u vw — pretvara se u piksele u trenutku pritiska.
const KORAK_TIPKE_VW = 10

const SMJER_TIPKE: Record<string, readonly [number, number]> = {
  ArrowLeft: [1, 0],
  ArrowRight: [-1, 0],
  ArrowUp: [0, 1],
  ArrowDown: [0, -1],
}

export function DragMreza({ stavke }: { stavke: Rad[] }) {
  const pomak = useRef({ x: 0, y: 0 })
  const [jeMobilni, postaviMobilni] = useState(false)
  // Lijeno čitanje iz window-a već na prvi render (uz SSR stražu) — bez
  // ovoga minRedova kreće od 0, pa se rijedak filter pri učitavanju vidno
  // "iskoči" na pravu visinu tek nakon prvog efekta, uz nepotreban
  // rušenje/podizanje Observer-a, resize i tastature.
  const [visinaVw, postaviVisinuVw] = useState(() =>
    typeof window === 'undefined' ? 0 : window.innerHeight / (window.innerWidth / 100),
  )

  useEffect(() => {
    const upit = window.matchMedia('(max-width: 767px)')
    const osvjezi = () => postaviMobilni(upit.matches)
    osvjezi()
    upit.addEventListener('change', osvjezi)
    return () => upit.removeEventListener('change', osvjezi)
  }, [])

  // Visina prozora izražena u vw (relativno prema širini) — koristi se
  // da ploča bude dovoljno visoka i kad filter ostavi svega par stavki.
  useEffect(() => {
    const osvjezi = () => postaviVisinuVw(window.innerHeight / (window.innerWidth / 100))
    osvjezi()
    window.addEventListener('resize', osvjezi)
    return () => window.removeEventListener('resize', osvjezi)
  }, [])

  const r = jeMobilni ? MOBILNI : DESKTOP
  const korakX = r.sirina + r.razmak
  const korakY = r.visina + r.razmak
  const redovaSadrzaja = stavke.length > 0 ? Math.ceil(stavke.length / r.kolone) : 0
  // Rijetki filter (npr. SPORT sa dvije stavke) inače daje jedan nizak red —
  // ploča ispadne niža od ekrana i korisnik zapadne u prazninu iz koje nema
  // povratka jer je platno overflow-hidden. Zato se broj redova diže na
  // najmanju vrijednost koja stvarno pokriva visinu prozora.
  const minRedova = visinaVw > 0 ? Math.ceil(visinaVw / korakY) : redovaSadrzaja
  const redova = Math.max(redovaSadrzaja, minRedova)
  const plocaSirina = r.kolone * korakX // vw
  const plocaVisina = redova * korakY // vw

  // Popuni cijelu ploču ponavljanjem stavki po modulu — i višak redova
  // iznad broja stavki, i nepotpun zadnji red — umjesto praznih ćelija.
  const celije =
    stavke.length > 0
      ? Array.from({ length: redova * r.kolone }, (_, i) => stavke[i % stavke.length])
      : []

  const scope = useGsap<HTMLDivElement>(
    (mm, korijen) => {
      // Namjerno bez geste za reducirani pokret: ovo nije animacija nego
      // jedini način da se korisnik kreće po galeriji (gsap.set je trenutan,
      // ništa se ne animira). Ko je isključio pokret ne smije ostati
      // zaglavljen bez ijedne interakcije na jedinoj stranici sa radovima.
      mm.add('all', () => {
        const platno = korijen.querySelector('[data-platno]') as HTMLElement | null
        if (!platno) return

        let omotajX = (v: number) => v
        let omotajY = (v: number) => v

        const izracunaj = () => {
          const vw = window.innerWidth / 100
          omotajX = gsap.utils.wrap(-plocaSirina * vw, 0)
          omotajY = gsap.utils.wrap(-plocaVisina * vw, 0)
        }

        const nacrtaj = () => {
          gsap.set(platno, { x: omotajX(pomak.current.x), y: omotajY(pomak.current.y) })
        }

        const naPromjenuVelicine = () => {
          izracunaj()
          nacrtaj()
        }

        izracunaj()
        nacrtaj()
        window.addEventListener('resize', naPromjenuVelicine)

        // Bez 'wheel': Observer ne gasi preventDefault (ostaje passive), pa bi
        // wheel istovremeno pomjerao platno I skrolovao stranicu (Lenis) ispod
        // njega — u par notch-eva stranica prođe kroz galeriju i pomjeranje
        // više nije ni dostupno. Wheel sad samo skroluje, kao na svakoj drugoj
        // stranici; pomjeranje ostaje na drag, dodir i strelice.
        const posmatrac = Observer.create({
          target: korijen,
          type: 'touch,pointer',
          onChange: (self) => {
            pomak.current.x += self.deltaX * -1
            pomak.current.y += self.deltaY * -1
            nacrtaj()
          },
        })

        // Tastatura vozi istu pomak/omotaj cijev kao pokazivač — bez ovoga
        // je jedini popis radova studija nedostupan bez miša ili dodira.
        const naTastaturu = (e: KeyboardEvent) => {
          const smjer = SMJER_TIPKE[e.key]
          if (!smjer) return
          e.preventDefault()
          const korak = (window.innerWidth / 100) * KORAK_TIPKE_VW
          pomak.current.x += smjer[0] * korak
          pomak.current.y += smjer[1] * korak
          nacrtaj()
        }
        korijen.addEventListener('keydown', naTastaturu)

        return () => {
          window.removeEventListener('resize', naPromjenuVelicine)
          korijen.removeEventListener('keydown', naTastaturu)
          posmatrac.kill()
        }
      })
    },
    [stavke.length, jeMobilni, redova],
  )

  return (
    <div
      ref={scope}
      tabIndex={0}
      className="relative h-screen w-full overflow-hidden touch-none md:cursor-grab focus-visible:outline focus-visible:outline-2 focus-visible:outline-champagne focus-visible:outline-offset-[-4px]"
    >
      <div data-platno className="absolute left-0 top-0 will-change-transform">
        {KOPIJE.map(([kx, ky]) =>
          celije.map((rad, i) => (
            <figure
              key={`${kx}-${ky}-${i}`}
              // Svaki rad postoji jednom po redu i četiri puta po ploči (KOPIJE) —
              // bez ovoga čitač ekrana isti portfolio pročita i po nekoliko puta.
              aria-hidden={!(kx === 0 && ky === 0 && i < stavke.length)}
              className="group absolute overflow-hidden"
              style={{
                left: `${kx * plocaSirina + (i % r.kolone) * korakX}vw`,
                top: `${ky * plocaVisina + Math.floor(i / r.kolone) * korakY}vw`,
                width: `${r.sirina}vw`,
                height: `${r.visina}vw`,
              }}
            >
              <Image
                src={slika(rad.id, 700, 500)}
                alt={rad.naslov}
                fill
                sizes={`${r.sirina}vw`}
                draggable={false}
                className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-[0.8vw] max-md:p-[2vw] font-body text-[0.7vw] max-md:text-[2.4vw] uppercase tracking-[0.08em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {rad.naslov}
              </figcaption>
            </figure>
          )),
        )}
      </div>
    </div>
  )
}
