import { describe, expect, it, vi, beforeEach } from 'vitest'

// robots.ts čita MEDIA_MODE iz media.ts, pa se modul mora resetovati
// između testova da bi svaki dobio svoju verziju te konstante.
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
