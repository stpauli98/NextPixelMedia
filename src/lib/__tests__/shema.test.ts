import { describe, expect, it } from 'vitest'
import { upitShema } from '@/lib/shema'

const validan = {
  tip: 'firma',
  ime: 'Restoran Dva Ribara',
  kontakt: 'marko@primjer.ba',
  kadaGdje: '12.09.2026, Gradiška',
  upotreba: ['instagram', 'sajt'],
  poruka: 'Treba nam sadržaj za novi meni.',
  web: '',
  otvorenoU: Date.now() - 10_000,
}

describe('upitShema', () => {
  it('prihvata potpun validan upit', () => {
    expect(upitShema.safeParse(validan).success).toBe(true)
  })

  it('odbija prazno ime', () => {
    expect(upitShema.safeParse({ ...validan, ime: '' }).success).toBe(false)
  })

  it('odbija nepoznat tip', () => {
    expect(upitShema.safeParse({ ...validan, tip: 'vjencanje' }).success).toBe(false)
  })

  it('traži bar jednu stavku upotrebe', () => {
    expect(upitShema.safeParse({ ...validan, upotreba: [] }).success).toBe(false)
  })

  it('dozvoljava praznu poruku', () => {
    expect(upitShema.safeParse({ ...validan, poruka: '' }).success).toBe(true)
  })

  it('odbija popunjen honeypot', () => {
    expect(upitShema.safeParse({ ...validan, web: 'bot' }).success).toBe(false)
  })
})
