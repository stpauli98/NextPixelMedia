import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync('src/styles/globals.css', 'utf8')

describe('dizajn tokeni', () => {
  it('definiše svih šest brend boja', () => {
    for (const hex of ['#0B1018', '#1E3A5F', '#C6A96B', '#F8F6F0', '#F5F5F3', '#8A919B']) {
      expect(css).toContain(hex)
    }
  })

  it('veže font tokene na next/font varijable', () => {
    // Razmaci se normalizuju — formatter ne smije oboriti test.
    const zbijeno = css.replace(/\s+/g, ' ')
    expect(zbijeno).toContain('--font-display: var(--font-montserrat)')
    expect(zbijeno).toContain('--font-body: var(--font-poppins)')
  })
})
