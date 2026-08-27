import { expect, test } from '@playwright/test'

const stranice = ['/', '/radovi', '/usluge', '/o-nama', '/kontakt', '/uslovi', '/privatnost']

// Preloader (Preloader.tsx) pušta ~3s ulaznu animaciju jednom po sesiji,
// upisujući ovaj ključ u sessionStorage kad završi. Svaki Playwright test
// kreće sa svježim kontekstom (bez sessionStorage), pa bi bez ovoga zavjesa
// puštala na svakom snimku, a `waitForLoadState('networkidle')` se ispuni
// znatno prije nego animacija završi — snimak bi uhvatio zavjesu, ne
// stranicu. Ovo ne dira provjeru horizontalnog prelivanja ispod: zavjesa je
// `fixed inset-0` i ne doprinosi širini dokumenta.
const KLJUC_PRELOADERA = 'npm-preloader-vidjen'

for (const putanja of stranice) {
  test(`desktop ${putanja}`, async ({ page }) => {
    await page.addInitScript((kljuc) => window.sessionStorage.setItem(kljuc, '1'), KLJUC_PRELOADERA)
    await page.setViewportSize({ width: 1512, height: 900 })
    await page.goto(putanja)
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `e2e/snimci/desktop${putanja.replace(/\//g, '_')}.png` })

    // Body nikad ne smije horizontalno skrolati.
    const prekoracenje = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(prekoracenje).toBe(false)
  })

  test(`mobilni ${putanja}`, async ({ page }) => {
    await page.addInitScript((kljuc) => window.sessionStorage.setItem(kljuc, '1'), KLJUC_PRELOADERA)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(putanja)
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `e2e/snimci/mobilni${putanja.replace(/\//g, '_')}.png` })

    const prekoracenje = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(prekoracenje).toBe(false)
  })
}
