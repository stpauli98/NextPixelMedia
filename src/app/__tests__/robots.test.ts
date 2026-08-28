import { describe, expect, it, vi, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'

// robots.ts i indeksiranje.ts čitaju MEDIA_MODE iz media.ts, pa se moduli
// moraju resetovati između testova da bi svaki dobio svoju verziju.
beforeEach(() => vi.resetModules())

describe('robots.txt', () => {
  it('zabranjuje indeksiranje dok su slike placeholder', async () => {
    vi.doMock('@/lib/media', () => ({ jePlaceholder: true }))
    const { default: robots } = await import('../robots')
    const pravila = robots().rules as { allow?: string; disallow?: string | string[] }

    expect(pravila.disallow).toBe('/')
    expect(pravila.allow).toBeUndefined()
  })

  it('pušta indeksiranje kad su slike prave', async () => {
    vi.doMock('@/lib/media', () => ({ jePlaceholder: false }))
    const { default: robots } = await import('../robots')
    const pravila = robots().rules as { allow?: string; disallow?: string | string[] }

    expect(pravila.allow).toBe('/')
    expect(pravila.disallow).toEqual(['/api/'])
  })
})

describe('smijeUPretragu', () => {
  it('prati MEDIA_MODE', async () => {
    vi.doMock('@/lib/media', () => ({ jePlaceholder: true }))
    expect((await import('@/lib/indeksiranje')).smijeUPretragu).toBe(false)

    vi.resetModules()
    vi.doMock('@/lib/media', () => ({ jePlaceholder: false }))
    expect((await import('@/lib/indeksiranje')).smijeUPretragu).toBe(true)
  })
})

describe('layout meta robots', () => {
  // layout.tsx se ne može uvesti u node okruženju (next/font/google), pa se
  // provjerava izvor. Bez ovoga bi meta tag mogao opet odlutati od
  // robots.txt-a — što se već desilo u produkciji 28.08.2026.
  const izvor = readFileSync('src/app/layout.tsx', 'utf8')

  it('čita odluku iz indeksiranje.ts, ne hardkoduje je', () => {
    expect(izvor).toContain('robots: { index: smijeUPretragu, follow: smijeUPretragu }')
  })

  it('nema hardkodovanog index: true', () => {
    expect(izvor).not.toMatch(/robots:\s*\{\s*index:\s*true/)
  })
})
