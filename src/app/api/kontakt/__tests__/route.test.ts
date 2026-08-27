import { beforeEach, describe, expect, it, vi } from 'vitest'

const posalji = vi.fn()

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: posalji }
  },
}))

const { POST } = await import('../route')

function zahtjev(tijelo: unknown) {
  return new Request('http://localhost/api/kontakt', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(tijelo),
  })
}

const validan = {
  tip: 'firma',
  ime: 'Restoran Dva Ribara',
  kontakt: 'marko@primjer.ba',
  kadaGdje: '12.09.2026, Gradiška',
  upotreba: ['instagram'],
  poruka: 'Treba nam sadržaj.',
  web: '',
  otvorenoU: Date.now() - 10_000,
}

describe('POST /api/kontakt', () => {
  beforeEach(() => {
    posalji.mockReset()
    posalji.mockResolvedValue({ data: { id: 'x' }, error: null })
  })

  it('šalje email za validan upit', async () => {
    const odgovor = await POST(zahtjev(validan))
    expect(odgovor.status).toBe(200)
    expect(posalji).toHaveBeenCalledOnce()
  })

  it('odbija nevalidan upit i ne šalje email', async () => {
    const odgovor = await POST(zahtjev({ ...validan, ime: '' }))
    expect(odgovor.status).toBe(400)
    expect(posalji).not.toHaveBeenCalled()
  })

  it('odbija popunjen honeypot bez slanja', async () => {
    const odgovor = await POST(zahtjev({ ...validan, web: 'bot' }))
    expect(odgovor.status).toBe(400)
    expect(posalji).not.toHaveBeenCalled()
  })

  it('odbija formu popunjenu prebrzo', async () => {
    const odgovor = await POST(zahtjev({ ...validan, otvorenoU: Date.now() }))
    expect(odgovor.status).toBe(400)
    expect(posalji).not.toHaveBeenCalled()
  })

  it('vraća 502 kad resend padne', async () => {
    posalji.mockResolvedValue({ data: null, error: { message: 'pao' } })
    const odgovor = await POST(zahtjev(validan))
    expect(odgovor.status).toBe(502)
  })
})
