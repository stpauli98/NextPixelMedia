import { readFileSync } from 'node:fs'

/**
 * Provjerava poznate razloge zašto sajt ne smije u produkciju:
 * - MEDIA_MODE je još 'placeholder' (privremene slike sa picsum.photos)
 * - privatnost.ts i dalje nosi javno vidljivu napomenu "nije pravni savjet"
 *
 * Oba se provjeravaju uvijek, pa build:prod jednim pokretanjem ispiše
 * SVE razloge koji ga blokiraju, ne samo prvi na koji naleti.
 *
 * Treći razlog — izmišljeni član ekipe "Druga osoba" — otpao je 28.08.2026.
 * kad je drugi član dobio stvarno ime. Zato `ekipa` više nije parametar.
 */
export function provjeriPlaceholdere({ media, privatnost }) {
  const razlozi = []

  const podudaranje = media.match(/MEDIA_MODE[^=]*=\s*'(placeholder|real)'/)
  if (!podudaranje) {
    razlozi.push('Ne mogu pronaći MEDIA_MODE u src/lib/media.ts.')
  } else if (podudaranje[1] === 'placeholder') {
    razlozi.push(
      'MEDIA_MODE je još "placeholder" — sajt koristi privremene slike. ' +
        'Ubaci pravi materijal u public/media/ i postavi MEDIA_MODE na "real".',
    )
  }

  if (privatnost.includes('nije pravni savjet')) {
    razlozi.push(
      'privatnost.ts i dalje sadrži javnu napomenu "nije pravni savjet" — ' +
        'provjeri tekst kod pravnika i ukloni napomenu prije objave.',
    )
  }

  if (razlozi.length > 0) {
    return {
      ok: false,
      poruka: `Build zaustavljen:\n${razlozi.map((r) => `- ${r}`).join('\n')}`,
    }
  }

  return { ok: true, poruka: 'Nema placeholder sadržaja — build može u produkciju.' }
}

// Pokreće se samo kad je fajl pozvan direktno, ne pri importu iz testa.
if (process.argv[1]?.endsWith('check-placeholders.mjs')) {
  const rezultat = provjeriPlaceholdere({
    media: readFileSync('src/lib/media.ts', 'utf8'),
    privatnost: readFileSync('src/content/privatnost.ts', 'utf8'),
  })
  if (!rezultat.ok) {
    console.error(`\n${rezultat.poruka}\n`)
    process.exit(1)
  }
  console.log(rezultat.poruka)
}
