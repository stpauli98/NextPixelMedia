import { describe, expect, it } from 'vitest'
import { provjeriPlaceholdere } from './check-placeholders.mjs'

const STVARNI_MEDIA = `export const MEDIA_MODE: 'placeholder' | 'real' = 'real'`
const CISTA_PRIVATNOST = `export const napomenaPrivatnost = 'Tekst je pregledan kod pravnika.'`

function osnova(izmjene = {}) {
  return { media: STVARNI_MEDIA, privatnost: CISTA_PRIVATNOST, ...izmjene }
}

describe('provjeriPlaceholdere', () => {
  it('obara build kad je MEDIA_MODE placeholder', () => {
    const rezultat = provjeriPlaceholdere(osnova({ media: `export const MEDIA_MODE = 'placeholder'` }))
    expect(rezultat.ok).toBe(false)
    expect(rezultat.poruka).toContain('placeholder')
  })

  it('obara build kad MEDIA_MODE uopšte ne postoji', () => {
    const rezultat = provjeriPlaceholdere(osnova({ media: `export const nesto = 1` }))
    expect(rezultat.ok).toBe(false)
  })

  it('obara build kad privatnost.ts i dalje ima napomenu "nije pravni savjet"', () => {
    const rezultat = provjeriPlaceholdere(
      osnova({
        privatnost: `export const napomenaPrivatnost = 'Ovaj tekst nije pravni savjet. Provjeri ga kod pravnika prije objave sajta.'`,
      }),
    )
    expect(rezultat.ok).toBe(false)
    expect(rezultat.poruka).toContain('pravni savjet')
  })

  it('imenuje sve razloge odjednom kad ih ima više', () => {
    const rezultat = provjeriPlaceholdere({
      media: `export const MEDIA_MODE = 'placeholder'`,
      privatnost: `nije pravni savjet`,
    })
    expect(rezultat.ok).toBe(false)
    expect(rezultat.poruka).toContain('placeholder')
    expect(rezultat.poruka).toContain('pravni savjet')
  })

  it('propušta build uz upozorenje kad je prekidač namjerno upaljen', () => {
    const rezultat = provjeriPlaceholdere({
      media: `export const MEDIA_MODE = 'placeholder'`,
      privatnost: `nije pravni savjet`,
      dozvoli: true,
    })
    expect(rezultat.ok).toBe(true)
    expect(rezultat.poruka).toContain('UPOZORENJE')
    // Razlozi moraju ostati vidljivi — prekidač ih ne smije sakriti.
    expect(rezultat.poruka).toContain('placeholder')
    expect(rezultat.poruka).toContain('pravni savjet')
  })

  it('prekidač ne mijenja ništa kad nema šta da se propusti', () => {
    const rezultat = provjeriPlaceholdere(osnova({ dozvoli: true }))
    expect(rezultat.ok).toBe(true)
    expect(rezultat.poruka).not.toContain('UPOZORENJE')
  })

  it('propušta build kad je sve stvarno', () => {
    const rezultat = provjeriPlaceholdere(osnova())
    expect(rezultat.ok).toBe(true)
  })
})
