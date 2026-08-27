import { readFileSync } from 'node:fs'

/**
 * Provjerava sva tri poznata razloga zašto sajt ne smije u produkciju:
 * - MEDIA_MODE je još 'placeholder' (privremene slike sa picsum.photos)
 * - privatnost.ts i dalje nosi javno vidljivu napomenu "nije pravni savjet"
 * - ekipa.ts i dalje sadrži izmišljenog člana "Druga osoba"
 *
 * Sva tri se provjeravaju uvijek, pa build:prod jednim pokretanjem ispiše
 * SVE razloge koji ga blokiraju, ne samo prvi na koji naleti.
 */
export function provjeriPlaceholdere({ media, privatnost, ekipa }) {
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

  if (ekipa.includes('Druga osoba')) {
    razlozi.push(
      'ekipa.ts i dalje sadrži izmišljenog člana "Druga osoba" — ' +
        'zamijeni pravim imenom, ulogom i opisom prije objave.',
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
    ekipa: readFileSync('src/content/ekipa.ts', 'utf8'),
  })
  if (!rezultat.ok) {
    console.error(`\n${rezultat.poruka}\n`)
    process.exit(1)
  }
  console.log(rezultat.poruka)
}
