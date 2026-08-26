import { describe, expect, it } from 'vitest'
import { provjeriPlaceholdere } from './check-placeholders.mjs'

describe('provjeriPlaceholdere', () => {
  it('obara build kad je MEDIA_MODE placeholder', () => {
    const rezultat = provjeriPlaceholdere(`export const MEDIA_MODE = 'placeholder'`)
    expect(rezultat.ok).toBe(false)
    expect(rezultat.poruka).toContain('placeholder')
  })

  it('propušta build kad je MEDIA_MODE real', () => {
    const rezultat = provjeriPlaceholdere(`export const MEDIA_MODE = 'real'`)
    expect(rezultat.ok).toBe(true)
  })

  it('obara build kad MEDIA_MODE uopšte ne postoji', () => {
    const rezultat = provjeriPlaceholdere(`export const nesto = 1`)
    expect(rezultat.ok).toBe(false)
  })
})
