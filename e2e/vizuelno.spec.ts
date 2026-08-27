import { expect, test } from '@playwright/test'

const stranice = ['/', '/radovi', '/usluge', '/o-nama', '/kontakt', '/uslovi', '/privatnost']

for (const putanja of stranice) {
  test(`desktop ${putanja}`, async ({ page }) => {
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
