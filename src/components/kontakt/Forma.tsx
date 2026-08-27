'use client'

import { useEffect, useRef, useState } from 'react'
import { Labela } from '@/components/ui/Labela'
import { Okvir } from '@/components/ui/Okvir'
import {
  OZNAKE_TIPA, OZNAKE_UPOTREBE, TIPOVI, UPOTREBE, upitShema, type Upit,
} from '@/lib/shema'
import { tekstovi } from '@/content/tekstovi'

type Stanje = 'mirno' | 'salje' | 'poslato' | 'greska'

const t = tekstovi.kontaktForma

const polje =
  'w-full bg-transparent border-b border-white/20 py-[0.6vw] max-md:py-[3vw] font-body text-[1vw] max-md:text-[4vw] text-white placeholder:text-gray/60 focus:border-champagne focus:outline-none'

// Isti oblik teksta kao serverski tijeloEmaila u route.ts, za mailto fallback.
function mailtoHref(upit: Upit): string {
  const naslov = `Upit sa sajta — ${OZNAKE_TIPA[upit.tip]} — ${upit.ime}`
  const tijelo = [
    `Tip: ${OZNAKE_TIPA[upit.tip]}`,
    `Ime: ${upit.ime}`,
    `Kontakt: ${upit.kontakt}`,
    `Kada i gdje: ${upit.kadaGdje || '—'}`,
    `Upotreba: ${upit.upotreba.map((u) => OZNAKE_UPOTREBE[u]).join(', ')}`,
    '',
    upit.poruka || '(bez poruke)',
  ].join('\n')

  return `mailto:${tekstovi.cta.email}?subject=${encodeURIComponent(naslov)}&body=${encodeURIComponent(tijelo)}`
}

export function Forma() {
  const otvorenoU = useRef(Date.now())
  const uspjehRef = useRef<HTMLDivElement>(null)
  const [tip, postaviTip] = useState<(typeof TIPOVI)[number]>('firma')
  const [upotreba, postaviUpotrebu] = useState<string[]>([])
  const [stanje, postaviStanje] = useState<Stanje>('mirno')
  const [greske, postaviGreske] = useState<Record<string, string>>({})
  const [posljednjiUpit, postaviPosljednjiUpit] = useState<Upit | null>(null)

  useEffect(() => {
    if (stanje === 'poslato') uspjehRef.current?.focus()
  }, [stanje])

  function prebaci(vrijednost: string) {
    postaviUpotrebu((prosli) =>
      prosli.includes(vrijednost) ? prosli.filter((v) => v !== vrijednost) : [...prosli, vrijednost],
    )
  }

  async function posalji(dogadjaj: React.FormEvent<HTMLFormElement>) {
    dogadjaj.preventDefault()
    const podaci = new FormData(dogadjaj.currentTarget)

    const upit = {
      tip,
      ime: String(podaci.get('ime') ?? ''),
      kontakt: String(podaci.get('kontakt') ?? ''),
      kadaGdje: String(podaci.get('kadaGdje') ?? ''),
      upotreba,
      poruka: String(podaci.get('poruka') ?? ''),
      web: String(podaci.get('web') ?? ''),
      otvorenoU: otvorenoU.current,
    }

    const provjera = upitShema.safeParse(upit)
    if (!provjera.success) {
      const nadjene: Record<string, string> = {}
      for (const g of provjera.error.issues) nadjene[String(g.path[0])] = g.message
      postaviGreske(nadjene)
      postaviPosljednjiUpit(null)
      postaviStanje('mirno')
      return
    }

    postaviGreske({})
    postaviPosljednjiUpit(provjera.data)
    postaviStanje('salje')

    try {
      const odgovor = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(provjera.data),
      })
      postaviStanje(odgovor.ok ? 'poslato' : 'greska')
    } catch {
      postaviStanje('greska')
    }
  }

  if (stanje === 'poslato') {
    return (
      <div
        ref={uspjehRef}
        tabIndex={-1}
        aria-live="polite"
        className="border border-champagne/30 p-[3vw] max-md:p-[8vw] focus:outline-none"
      >
        <p className="naslov text-[2.5vw] max-md:text-[8vw] text-champagne">{t.primljeno}</p>
        <p className="mt-[1vw] max-md:mt-[4vw] font-body text-[1vw] max-md:text-[4vw] text-white">
          {tekstovi.kontaktObecanje}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={posalji} className="flex flex-col gap-[1.5vw] max-md:gap-[6vw]">
      <fieldset className="border border-white/10 p-[1.5vw] max-md:p-[5vw]">
        <Labela>{t.brojevi[0]}</Labela>
        <legend className="sr-only">{t.sta.legenda}</legend>
        <p className="naslov mt-[0.4vw] max-md:mt-[1.5vw] text-[1.6vw] max-md:text-[6vw] text-white">{t.sta.naslov}</p>
        <div className="mt-[1vw] max-md:mt-[4vw] flex flex-wrap gap-[0.6vw] max-md:gap-[2.5vw]">
          {TIPOVI.map((tp) => (
            <button
              key={tp} type="button" onClick={() => postaviTip(tp)} aria-pressed={tip === tp}
              className={`px-[1vw] py-[0.5vw] max-md:px-[4vw] max-md:py-[2.5vw] font-body text-[0.8vw] max-md:text-[3.2vw] uppercase tracking-[0.08em] transition-colors ${
                tip === tp ? 'bg-champagne text-black' : 'border border-white/20 text-gray hover:text-white'
              }`}
            >
              {OZNAKE_TIPA[tp]}
            </button>
          ))}
        </div>
      </fieldset>

      {[
        { br: t.brojevi[1], ime: 'ime', naslov: t.polja.ime, obavezno: true },
        { br: t.brojevi[2], ime: 'kontakt', naslov: t.polja.kontakt, obavezno: true },
        { br: t.brojevi[3], ime: 'kadaGdje', naslov: t.polja.kadaGdje, obavezno: false },
      ].map((p) => (
        <div key={p.ime} className="border border-white/10 p-[1.5vw] max-md:p-[5vw]">
          <Labela>{p.br}</Labela>
          <label htmlFor={p.ime} className="naslov mt-[0.4vw] max-md:mt-[1.5vw] block text-[1.6vw] max-md:text-[6vw] text-white">
            {p.naslov}{p.obavezno && <span className="text-champagne">*</span>}
          </label>
          <input id={p.ime} name={p.ime} className={`${polje} mt-[0.6vw] max-md:mt-[3vw]`} placeholder={t.placeholder} />
          {greske[p.ime] && (
            <p role="alert" className="mt-[0.4vw] max-md:mt-[1.6vw] font-body text-[0.75vw] max-md:text-[3vw] text-champagne">
              {greske[p.ime]}
            </p>
          )}
        </div>
      ))}

      <fieldset className="border border-white/10 p-[1.5vw] max-md:p-[5vw]">
        <Labela>{t.brojevi[4]}</Labela>
        <legend className="sr-only">{t.gdje.legenda}</legend>
        <p className="naslov mt-[0.4vw] max-md:mt-[1.5vw] text-[1.6vw] max-md:text-[6vw] text-white">
          {t.gdje.naslov}<span className="text-champagne">*</span>
        </p>
        <div className="mt-[1vw] max-md:mt-[4vw] flex flex-wrap gap-[0.6vw] max-md:gap-[2.5vw]">
          {UPOTREBE.map((u) => (
            <button
              key={u} type="button" onClick={() => prebaci(u)} aria-pressed={upotreba.includes(u)}
              className={`px-[1vw] py-[0.5vw] max-md:px-[4vw] max-md:py-[2.5vw] font-body text-[0.8vw] max-md:text-[3.2vw] uppercase tracking-[0.08em] transition-colors ${
                upotreba.includes(u) ? 'bg-champagne text-black' : 'border border-white/20 text-gray hover:text-white'
              }`}
            >
              {OZNAKE_UPOTREBE[u]}
            </button>
          ))}
        </div>
        {greske.upotreba && (
          <p role="alert" className="mt-[0.6vw] max-md:mt-[2.4vw] font-body text-[0.75vw] max-md:text-[3vw] text-champagne">
            {greske.upotreba}
          </p>
        )}
      </fieldset>

      <div className="border border-white/10 p-[1.5vw] max-md:p-[5vw]">
        <Labela>{t.brojevi[5]}</Labela>
        <label htmlFor="poruka" className="naslov mt-[0.4vw] max-md:mt-[1.5vw] block text-[1.6vw] max-md:text-[6vw] text-white">
          {t.poruka}
        </label>
        <textarea id="poruka" name="poruka" rows={4} className={`${polje} mt-[0.6vw] max-md:mt-[3vw] resize-none`} placeholder={t.placeholder} />
      </div>

      {/* Honeypot — sakriveno od ljudi i od čitača ekrana, ali se šalje. */}
      <input type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px]" />

      <div className="flex items-center gap-[1.5vw] max-md:flex-col max-md:items-start max-md:gap-[4vw]">
        <Okvir>
          <button
            type="submit" disabled={stanje === 'salje'}
            className="bg-champagne px-[2vw] py-[0.8vw] max-md:px-[8vw] max-md:py-[4vw] font-body text-[0.9vw] max-md:text-[3.5vw] uppercase tracking-[0.1em] text-black transition-colors hover:bg-white disabled:opacity-50"
          >
            {stanje === 'salje' ? t.saljem : t.posalji}
          </button>
        </Okvir>
        <span className="font-body text-[0.8vw] max-md:text-[3vw] text-gray">{tekstovi.kontaktObecanje}</span>
      </div>

      {stanje === 'greska' && (
        <p role="alert" className="font-body text-[0.9vw] max-md:text-[3.5vw] text-champagne">
          {t.greska}{' '}
          <a
            href={posljednjiUpit ? mailtoHref(posljednjiUpit) : `mailto:${tekstovi.cta.email}`}
            className="underline"
          >
            {tekstovi.cta.email}
          </a>
        </p>
      )}
    </form>
  )
}
