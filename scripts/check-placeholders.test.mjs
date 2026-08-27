import { describe, expect, it } from 'vitest'
import { provjeriPlaceholdere } from './check-placeholders.mjs'

const STVARNI_MEDIA = `export const MEDIA_MODE: 'placeholder' | 'real' = 'real'`
const CISTA_PRIVATNOST = `export const napomenaPrivatnost = 'Tekst je pregledan kod pravnika.'`
const CISTA_EKIPA = `export const ekipa = [{ ime: 'Nikola Milošević' }]`

function osnova(izmjene = {}) {
  return { media: STVARNI_MEDIA, privatnost: CISTA_PRIVATNOST, ekipa: CISTA_EKIPA, ...izmjene }
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

  it('obara build kad ekipa.ts i dalje sadrži "Druga osoba"', () => {
    const rezultat = provjeriPlaceholdere(osnova({ ekipa: `ime: 'Druga osoba'` }))
    expect(rezultat.ok).toBe(false)
    expect(rezultat.poruka).toContain('Druga osoba')
  })

  it('imenuje sve razloge odjednom kad ih ima više', () => {
    const rezultat = provjeriPlaceholdere({
      media: `export const MEDIA_MODE = 'placeholder'`,
      privatnost: `nije pravni savjet`,
      ekipa: `ime: 'Druga osoba'`,
    })
    expect(rezultat.ok).toBe(false)
    expect(rezultat.poruka).toContain('placeholder')
    expect(rezultat.poruka).toContain('pravni savjet')
    expect(rezultat.poruka).toContain('Druga osoba')
  })

  it('propušta build kad je sve stvarno', () => {
    const rezultat = provjeriPlaceholdere(osnova())
    expect(rezultat.ok).toBe(true)
  })
})
