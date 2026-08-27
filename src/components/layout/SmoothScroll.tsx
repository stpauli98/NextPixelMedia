'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const voliPokret = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    if (!voliPokret) return

    const lenis = new Lenis({ autoRaf: false })

    // Jedan sat, dva potrošača. Dvije nezavisne petlje razilaze
    // pin pozicije od stvarnog scrolla.
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (vrijeme: number) => lenis.raf(vrijeme * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // SplitText prije učitanog Montserrata prelama linije pogrešno.
    document.fonts.ready.then(() => ScrollTrigger.refresh())

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
