'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { BEZ_REDUKCIJE, useGsap } from '@/lib/useGsap'
import { tekstovi } from '@/content/tekstovi'
import { Labela } from '@/components/ui/Labela'

const KLJUC = 'npm-preloader-vidjen'
const NAJDUZE_TRAJANJE_S = 4

/**
 * Monogram i četiri fokus-ugla se iscrtavaju, pa cijeli mark prelazi iz
 * blur u oštrinu i zavjesa ode gore. Prikazuje se jednom po sesiji.
 *
 * `gotovo` je jedini prekidač za prikaz. Podrazumijevano je `false` — i na
 * serveru i na prvom klijentskom renderu — jer server ne zna za
 * sessionStorage: prvi posjetilac tako od prvog kadra vidi zavjesu, nikad
 * sadržaj stranice ispod nje. Tek `useLayoutEffect` (prije bojanja, ne
 * `useEffect` poslije njega) je gasi sinhrono za posjetioca koji je
 * zavjesu već vidio ove sesije — vidi napomenu o preostalom treptaju niže.
 */
export function Preloader() {
  const [gotovo, postaviGotovo] = useState(false)
  const [pokreniIscrtavanje, postaviPokreniIscrtavanje] = useState(false)
  const roditelj = useRef<Element | null>(null)
  const provjereno = useRef(false)

  useLayoutEffect(() => {
    // React (dev/StrictMode) namjerno pokreće efekat dvaput na mountu da bi
    // uhvatio baš ovakve greške: bez ove čuvarice, drugi poziv bi pročitao
    // KLJUC koji je upravo upisao prvi poziv i zaključio "već viđeno",
    // gaseći zavjesu odmah čak i prvom posjetiocu. Efekat mora ostati
    // idempotentan po mountu, ne po promjeni zavisnosti.
    if (provjereno.current) return
    provjereno.current = true

    if (typeof window === 'undefined') return

    let vidjenoRanije = false
    try {
      vidjenoRanije = Boolean(window.sessionStorage.getItem(KLJUC))
    } catch {
      // Privatni mod / blokiran storage — tretiraj kao prvi put, nikad ne blokiraj.
      vidjenoRanije = false
    }

    if (vidjenoRanije) {
      postaviGotovo(true)
      return
    }

    try {
      window.sessionStorage.setItem(KLJUC, '1')
    } catch {
      // Ništa — samo se neće zapamtiti za ovu sesiju.
    }

    postaviPokreniIscrtavanje(true)
  }, [])

  // Scoped selektori: '[data-crtez]', '[data-tacka]' i '[data-zavjesa]' su
  // POTOMCI scope korijena (samog `<div ref={scope}>`), nikad sam korijen —
  // inače bi gsap.context tražio izvan konteksta i tiho pogodio ništa.
  const scope = useGsap<HTMLDivElement>(
    (mm, korijen) => {
      roditelj.current = korijen.parentElement

      if (!pokreniIscrtavanje) return

      mm.add(BEZ_REDUKCIJE, () => {
        try {
          const vremenska = gsap.timeline({ onComplete: () => postaviGotovo(true) })

          vremenska
            .set('[data-crtez] path, [data-crtez] line', { strokeDasharray: 200, strokeDashoffset: 200 })
            .to('[data-crtez] path, [data-crtez] line', {
              strokeDashoffset: 0, duration: 1, stagger: 0.06, ease: 'power2.inOut',
            })
            .from('[data-tacka]', { scale: 0, opacity: 0, duration: 0.3, stagger: 0.05, ease: 'back.out(2)' }, '-=0.3')
            .fromTo('[data-mark]', { filter: 'blur(6px)' }, { filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' })
            .to('[data-zavjesa]', { yPercent: -100, duration: 0.7, ease: 'power3.inOut' }, '+=0.2')
        } catch {
          // Path nedostaje ili GSAP baci — zavjesa se svejedno mora podići.
          postaviGotovo(true)
        }
      })

      // Kad je pokret isključen, zavjesa nestaje odmah — nikad ne ostaje zaglavljena.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        postaviGotovo(true)
      })

      // Sigurnosna mreža: ako iz bilo kog razloga animacija nikad ne
      // završi (npr. tab izgubi fokus usred tweena), zavjesa se ipak
      // podiže. gsap.delayedCall je gsap-tracked poziv, pa ga
      // gsap.context (unutar useGsap) sam poništi pri unmountu ili
      // promjeni zavisnosti — nema ručnog čišćenja.
      gsap.delayedCall(NAJDUZE_TRAJANJE_S, () => postaviGotovo(true))
    },
    [pokreniIscrtavanje],
  )

  // Dok zavjesa stoji, ostatak stranice (Nav, sadržaj, Footer — braća ovog
  // diva unutar SmoothScroll) je `inert`: nefokusibilan i van pristupačnog
  // stabla. aria-hidden samo na samoj zavjesi bi sakrio pogrešnu stvar —
  // ona nema fokusibilan sadržaj, dok bi pozadina iza nje ostala dostupna
  // Tabu i čitaču ekrana iako je vizuelno prekrivena.
  useLayoutEffect(() => {
    const rod = roditelj.current
    if (!rod) return

    const braca = Array.from(rod.children).filter((el) => el !== scope.current)

    if (gotovo) {
      braca.forEach((el) => el.removeAttribute('inert'))
      return
    }

    braca.forEach((el) => el.setAttribute('inert', ''))

    return () => {
      braca.forEach((el) => el.removeAttribute('inert'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gotovo])

  if (gotovo) return null

  return (
    <div ref={scope} className="fixed inset-0 z-[99999]" aria-hidden="true">
      <div data-zavjesa className="flex h-full w-full flex-col items-center justify-center bg-black">
        <div data-mark className="relative">
          <svg data-crtez viewBox="0 0 120 120" className="h-[14vw] w-[14vw] max-md:h-[40vw] max-md:w-[40vw]">
            {/* N */}
            <path d="M35 82 L35 38 L62 72 L62 38" stroke="#F5F5F3" strokeWidth="4" fill="none" strokeLinecap="square" />
            {/* P */}
            <path d="M72 82 L72 38 L86 38 A11 11 0 0 1 86 60 L72 60" stroke="#C6A96B" strokeWidth="4" fill="none" strokeLinecap="square" />
            {/* fokus uglovi */}
            <path d="M8 26 L8 8 L26 8" stroke="#C6A96B" strokeWidth="2.5" fill="none" />
            <path d="M94 8 L112 8 L112 26" stroke="#C6A96B" strokeWidth="2.5" fill="none" />
            <path d="M112 94 L112 112 L94 112" stroke="#C6A96B" strokeWidth="2.5" fill="none" />
            <path d="M26 112 L8 112 L8 94" stroke="#C6A96B" strokeWidth="2.5" fill="none" />
            {/* fokus tačke */}
            <circle data-tacka cx="60" cy="8" r="2" fill="#C6A96B" />
            <circle data-tacka cx="112" cy="60" r="2" fill="#C6A96B" />
            <circle data-tacka cx="60" cy="112" r="2" fill="#C6A96B" />
            <circle data-tacka cx="8" cy="60" r="2" fill="#C6A96B" />
          </svg>
        </div>

        <Labela className="mt-[2vw] max-md:mt-[8vw]">{tekstovi.chrome.preloader.fokus}</Labela>
      </div>
    </div>
  )
}
