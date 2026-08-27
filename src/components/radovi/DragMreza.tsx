'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap, Observer } from '@/lib/gsap'
import { BEZ_REDUKCIJE, useGsap } from '@/lib/useGsap'
import { slika } from '@/lib/media'
import type { Rad } from '@/content/tipovi'

// Sve mjere u vw. Korak uključuje razmak, pa ploče naliježu bez šava.
const DESKTOP = { kolone: 4, sirina: 22, visina: 16, razmak: 1 }
const MOBILNI = { kolone: 2, sirina: 44, visina: 30, razmak: 2 }

const KOPIJE = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
] as const

export function DragMreza({ stavke }: { stavke: Rad[] }) {
  const pomak = useRef({ x: 0, y: 0 })
  const [jeMobilni, postaviMobilni] = useState(false)

  useEffect(() => {
    const upit = window.matchMedia('(max-width: 767px)')
    const osvjezi = () => postaviMobilni(upit.matches)
    osvjezi()
    upit.addEventListener('change', osvjezi)
    return () => upit.removeEventListener('change', osvjezi)
  }, [])

  const r = jeMobilni ? MOBILNI : DESKTOP
  const korakX = r.sirina + r.razmak
  const korakY = r.visina + r.razmak
  const redova = Math.ceil(stavke.length / r.kolone)
  const plocaSirina = r.kolone * korakX // vw
  const plocaVisina = redova * korakY // vw

  const scope = useGsap<HTMLDivElement>(
    (mm, korijen) => {
      mm.add(BEZ_REDUKCIJE, () => {
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

        const posmatrac = Observer.create({
          target: korijen,
          type: 'wheel,touch,pointer',
          onChange: (self) => {
            pomak.current.x += self.deltaX * -1
            pomak.current.y += self.deltaY * -1
            nacrtaj()
          },
        })

        return () => {
          window.removeEventListener('resize', naPromjenuVelicine)
          posmatrac.kill()
        }
      })
    },
    [stavke.length, jeMobilni],
  )

  return (
    <div ref={scope} className="relative h-screen w-full overflow-hidden touch-none md:cursor-grab">
      <div data-platno className="absolute left-0 top-0 will-change-transform">
        {KOPIJE.map(([kx, ky]) =>
          stavke.map((rad, i) => (
            <figure
              key={`${kx}-${ky}-${rad.id}`}
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
                sizes={jeMobilni ? '44vw' : '22vw'}
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
