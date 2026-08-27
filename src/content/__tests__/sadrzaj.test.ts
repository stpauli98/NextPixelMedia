import { describe, expect, it } from 'vitest'
import { KATEGORIJE, radovi } from '@/content/radovi'
import { usluge } from '@/content/usluge'
import { proces } from '@/content/proces'
import { rokovi } from '@/content/rokovi'
import { paketi } from '@/content/paketi'
import { testimonijali } from '@/content/testimonijali'
import { uslovi } from '@/content/uslovi'
import { odjeljciPrivatnosti } from '@/content/privatnost'

describe('radovi', () => {
  it('svaki rad ima kategoriju koja postoji', () => {
    for (const rad of radovi) {
      expect(KATEGORIJE).toContain(rad.kategorija)
    }
  })

  it('svaki rad ima jedinstven id', () => {
    const ids = radovi.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('ima dovoljno stavki da wrap u mreži ne bude očigledan', () => {
    expect(radovi.length).toBeGreaterThanOrEqual(18)
  })
})

describe('usluge', () => {
  it('ima tačno šest usluga', () => {
    expect(usluge).toHaveLength(6)
  })

  it('svaka usluga ima bar jedan chip', () => {
    for (const u of usluge) expect(u.ukljuceno.length).toBeGreaterThan(0)
  })

  it('brojevi su 01 do 06 redom', () => {
    expect(usluge.map((u) => u.broj)).toEqual(['01', '02', '03', '04', '05', '06'])
  })
})

describe('proces', () => {
  it('ima šest faza', () => {
    expect(proces).toHaveLength(6)
  })
})

describe('rokovi', () => {
  it('nosi tačne brojke iz Produkcijskog Procesa', () => {
    expect(rokovi.map((r) => r.vrijednost)).toEqual(['48h', '7 dana', '14 dana', '2 diska'])
  })
})

describe('paketi', () => {
  it('ima tri paketa i tačno jedan istaknut', () => {
    expect(paketi).toHaveLength(3)
    expect(paketi.filter((p) => p.istaknut)).toHaveLength(1)
  })

  it('istaknut je srednji paket', () => {
    expect(paketi[1].istaknut).toBe(true)
  })
})

describe('testimonijali', () => {
  it('je prazan dok ne stigne prva prava preporuka', () => {
    expect(testimonijali).toHaveLength(0)
  })
})

describe('pravni sadržaj', () => {
  it('uslovi imaju svih 14 tačaka', () => {
    expect(uslovi).toHaveLength(14)
  })

  it('privatnost ima svih 6 odjeljaka', () => {
    expect(odjeljciPrivatnosti).toHaveLength(6)
  })
})
