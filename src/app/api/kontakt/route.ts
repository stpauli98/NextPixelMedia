import { Resend } from 'resend'
import {
  NAJKRACE_POPUNJAVANJE_MS,
  OZNAKE_TIPA,
  OZNAKE_UPOTREBE,
  upitShema,
  type Upit,
} from '@/lib/shema'

const PRIMALAC = process.env.KONTAKT_EMAIL ?? 'nikola@nextpixel.media'
const POSILJALAC = process.env.KONTAKT_POSILJALAC ?? 'sajt@nextpixel.media'

function tijeloEmaila(upit: Upit): string {
  return [
    `Tip: ${OZNAKE_TIPA[upit.tip]}`,
    `Ime: ${upit.ime}`,
    `Kontakt: ${upit.kontakt}`,
    `Kada i gdje: ${upit.kadaGdje || '—'}`,
    `Upotreba: ${upit.upotreba.map((u) => OZNAKE_UPOTREBE[u]).join(', ')}`,
    '',
    upit.poruka || '(bez poruke)',
  ].join('\n')
}

export async function POST(zahtjev: Request) {
  let sirovo: unknown
  try {
    sirovo = await zahtjev.json()
  } catch {
    return Response.json({ greska: 'Neispravan zahtjev.' }, { status: 400 })
  }

  const rezultat = upitShema.safeParse(sirovo)
  if (!rezultat.success) {
    return Response.json({ greska: 'Provjeri polja.' }, { status: 400 })
  }

  const upit = rezultat.data

  if (Date.now() - upit.otvorenoU < NAJKRACE_POPUNJAVANJE_MS) {
    return Response.json({ greska: 'Provjeri polja.' }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: POSILJALAC,
    to: PRIMALAC,
    replyTo: upit.kontakt.includes('@') ? upit.kontakt : undefined,
    subject: `Upit sa sajta — ${OZNAKE_TIPA[upit.tip]} — ${upit.ime}`,
    text: tijeloEmaila(upit),
  })

  if (error) {
    return Response.json({ greska: 'Slanje nije uspjelo.' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
