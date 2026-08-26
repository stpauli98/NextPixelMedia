import { readFileSync } from 'node:fs'

export function provjeriPlaceholdere(sadrzajMedia) {
  const podudaranje = sadrzajMedia.match(/MEDIA_MODE[^=]*=\s*'(placeholder|real)'/)

  if (!podudaranje) {
    return { ok: false, poruka: 'Ne mogu pronaći MEDIA_MODE u src/lib/media.ts' }
  }

  if (podudaranje[1] === 'placeholder') {
    return {
      ok: false,
      poruka:
        'Build zaustavljen: MEDIA_MODE je još "placeholder".\n' +
        'Sajt koristi privremene slike i ne smije u produkciju.\n' +
        'Ubaci pravi materijal u public/media/ i postavi MEDIA_MODE na "real".',
    }
  }

  return { ok: true, poruka: 'Mediji su pravi.' }
}

// Pokreće se samo kad je fajl pozvan direktno, ne pri importu iz testa.
if (process.argv[1]?.endsWith('check-placeholders.mjs')) {
  const rezultat = provjeriPlaceholdere(readFileSync('src/lib/media.ts', 'utf8'))
  if (!rezultat.ok) {
    console.error(`\n${rezultat.poruka}\n`)
    process.exit(1)
  }
  console.log(rezultat.poruka)
}
