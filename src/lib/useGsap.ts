'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from './gsap'

type MatchMedia = ReturnType<typeof gsap.matchMedia>
type Setup<T extends HTMLElement> = (mm: MatchMedia, korijen: T) => void

/**
 * Registruje animacije sekcije unutar gsap.context, pa se sve poništi
 * na unmount. Bez konteksta React dvostruki mount ostavlja duple
 * ScrollTrigger instance i pozicije se udvoje.
 *
 * Animacije se dodaju kroz mm.add('(prefers-reduced-motion: no-preference)', ...)
 * tako da posjetilac koji je isključio pokret dobija krajnje stanje bez tweena.
 *
 * `korijen` je element sekcije. Koristi ga za pretragu unutar sekcije
 * umjesto document.querySelector — inače dvije instance iste komponente
 * gađaju jedna drugu.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: Setup<T>,
  deps: unknown[] = [],
) {
  const scope = useRef<T>(null)

  useLayoutEffect(() => {
    if (!scope.current) return
    const korijen = scope.current

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      setup(mm, korijen)
    }, scope)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return scope
}

export const BEZ_REDUKCIJE = '(prefers-reduced-motion: no-preference)'
