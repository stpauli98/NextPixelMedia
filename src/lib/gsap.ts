'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Observer } from 'gsap/Observer'

if (
  typeof window !== 'undefined' &&
  !(gsap.core as unknown as { globals(): Record<string, unknown> }).globals().ScrollTrigger
) {
  gsap.registerPlugin(ScrollTrigger, SplitText, Observer)
}

export { gsap, ScrollTrigger, SplitText, Observer }
