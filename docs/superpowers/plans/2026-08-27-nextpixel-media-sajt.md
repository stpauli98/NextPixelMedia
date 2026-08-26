# NextPixel Media sajt — plan implementacije

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sajt za NextPixel Media na `nextpixel.media` — LAYR scroll mehanika i UI obrasci, NextPixel sadržaj, boje i ton.

**Architecture:** Next.js 15 App Router, sadržaj odvojen od prikaza u `src/content/` kao tipizirani podaci. Animacije žive u sekciji koja ih koristi, kroz `useGsap` hook koji čisti za sobom i gasi pokret na `prefers-reduced-motion`. Lenis i GSAP dijele jedan RAF.

**Tech Stack:** Next.js 15, TypeScript, Tailwind v4, GSAP 3 (ScrollTrigger, SplitText, Observer), Lenis, zod, resend, Vitest, Playwright, Docker.

**Spec:** [`docs/superpowers/specs/2026-08-27-nextpixel-media-sajt-design.md`](../specs/2026-08-27-nextpixel-media-sajt-design.md)

## Global Constraints

- Jezik sajta: BS/SR. Bez `[lang]` segmenta u rutama.
- Boje su isključivo iz `@theme` tokena: `#0B1018` `#1E3A5F` `#C6A96B` `#F8F6F0` `#F5F5F3` `#8A919B`. Nema hardkodovanih hex vrijednosti u komponentama.
- Šampanj `#C6A96B` pokriva najviše 10% površine ekrana. Nikad kao pozadina cijele sekcije.
- Fontovi: Montserrat (naslovi, 700/800, uppercase, `tracking-[-0.05em]`, `leading-[0.85]`), Poppins (tijelo, 300/400/500).
- Mjere u `vw` jedinicama, s `max-md:` setom za mobilni. Prelom 768px.
- Nijedan tekst ne stoji u JSX-u. Sav sadržaj dolazi iz `src/content/`.
- Nijedna brojka, citat, logotip ni preporuka ne smije biti izmišljena. Prazan niz sakriva sekciju.
- `three` se ne instalira.
- Svaka animacija ide kroz `useGsap`. Direktan `gsap.to` u komponenti je greška.
- Backend se testira u Dockeru, sa `.env` fajlom.

---

## Struktura fajlova

| Fajl | Odgovornost |
|---|---|
| `src/styles/globals.css` | Tailwind import, `@theme` tokeni, keyframes za marquee |
| `src/lib/gsap.ts` | Registracija GSAP plugina, jednom, samo na klijentu |
| `src/lib/useGsap.ts` | Hook: `gsap.context` + `matchMedia` + čišćenje |
| `src/lib/media.ts` | Jedini izvor URL-ova slika, `MEDIA_MODE` zastavica |
| `src/lib/shema.ts` | `zod` shema upita, dijeljena klijent/server |
| `src/content/tipovi.ts` | Tipovi sadržaja |
| `src/content/*.ts` | Podaci: usluge, radovi, proces, rokovi, paketi, ekipa, testimonijali |
| `src/components/ui/*` | Primitivi bez znanja o domenu: Okvir, Labela, Dugme, Broj |
| `src/components/layout/*` | Nav, Meni, Footer, SmoothScroll, Preloader |
| `src/components/sections/*` | Sekcije početne, jedna po fajlu, svaka drži svoju animaciju |
| `src/components/radovi/*` | DragMreza, Filter |
| `src/components/usluge/*` | PinPanel |
| `src/app/api/kontakt/route.ts` | Prijem upita, validacija, slanje kroz resend |
| `scripts/check-placeholders.mjs` | Obara produkcijski build dok su slike placeholder |

---

### Task 1: Skelet projekta, tokeni i fontovi

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/styles/globals.css`
- Test: `src/lib/__tests__/tokeni.test.ts`

**Interfaces:**
- Consumes: ništa
- Produces: `@theme` tokeni dostupni kao Tailwind klase (`bg-black`, `text-champagne`, `font-display`); `npm run dev`, `npm run test`, `npm run build`

- [ ] **Step 1: Napravi Next.js projekat**

Pokreni u korijenu repoa (folder već sadrži `.git` i `docs/`):

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-eslint --import-alias "@/*" --use-npm --yes
```

Ako alat odbije da piše u neprazan folder, napravi u `/tmp/npm-scaffold` pa prekopiraj sve osim `.git`.

- [ ] **Step 2: Instaliraj ostale zavisnosti**

```bash
npm i gsap lenis zod resend
npm i -D vitest
```

- [ ] **Step 3: Napiši `src/styles/globals.css`**

Obriši generisani `src/app/globals.css` i napravi:

```css
@import "tailwindcss";

@theme {
  --color-black:     #0B1018;
  --color-navy:      #1E3A5F;
  --color-champagne: #C6A96B;
  --color-cream:     #F8F6F0;
  --color-white:     #F5F5F3;
  --color-gray:      #8A919B;

  --font-display: var(--font-montserrat), system-ui, sans-serif;
  --font-body:    var(--font-poppins), system-ui, sans-serif;
}

@keyframes marqueeLijevo {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}

@keyframes marqueeDesno {
  from { transform: translate3d(-50%, 0, 0); }
  to   { transform: translate3d(0, 0, 0); }
}

html {
  background: var(--color-black);
  color: var(--color-white);
  font-family: var(--font-body);
}

.naslov {
  font-family: var(--font-display);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.05em;
  line-height: 0.85;
}
```

- [ ] **Step 4: Napiši `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Montserrat, Poppins } from 'next/font/google'
import '@/styles/globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NextPixel Media — foto, video i dron produkcija',
  description:
    'Sadržaj za firme, nekretnine i događaje. Gradiška, Banja Luka i okolina.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bs" className={`${montserrat.variable} ${poppins.variable}`}>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Napiši `src/app/page.tsx` privremeno**

```tsx
export default function Pocetna() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="naslov text-[8vw] text-white">
        NextPixel <span className="text-champagne">Media</span>
      </h1>
    </main>
  )
}
```

- [ ] **Step 6: Napravi `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: { environment: 'node', include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'] },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

Dodaj u `package.json` skripte:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: Napiši test koji pada**

`src/lib/__tests__/tokeni.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync('src/styles/globals.css', 'utf8')

describe('dizajn tokeni', () => {
  it('definiše svih šest brend boja', () => {
    for (const hex of ['#0B1018', '#1E3A5F', '#C6A96B', '#F8F6F0', '#F5F5F3', '#8A919B']) {
      expect(css).toContain(hex)
    }
  })

  it('veže font tokene na next/font varijable', () => {
    // Razmaci se normalizuju — formatter ne smije oboriti test.
    const zbijeno = css.replace(/\s+/g, ' ')
    expect(zbijeno).toContain('--font-display: var(--font-montserrat)')
    expect(zbijeno).toContain('--font-body: var(--font-poppins)')
  })
})
```

- [ ] **Step 8: Pokreni test**

Run: `npm run test`
Expected: PASS (test opisuje fajl koji si upravo napisao — ako padne, `globals.css` nije tačan)

- [ ] **Step 9: Provjeri da dev server radi**

Run: `npm run dev`
Expected: `localhost:3000` prikazuje naslov, „Media" u šampanj boji, tamna pozadina.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: skelet projekta, dizajn tokeni i fontovi"
```

---

### Task 2: Sadržajni sloj

**Files:**
- Create: `src/content/tipovi.ts`, `src/content/usluge.ts`, `src/content/radovi.ts`, `src/content/proces.ts`, `src/content/rokovi.ts`, `src/content/paketi.ts`, `src/content/ekipa.ts`, `src/content/testimonijali.ts`, `src/content/tekstovi.ts`
- Test: `src/content/__tests__/sadrzaj.test.ts`

**Interfaces:**
- Consumes: ništa
- Produces: `Kategorija`, `Rad`, `Usluga`, `Faza`, `Rok`, `Paket`, `Clan`, `Testimonijal` tipovi; `radovi`, `usluge`, `proces`, `rokovi`, `paketi`, `ekipa`, `testimonijali`, `tekstovi` nizovi i objekti; `KATEGORIJE` niz

- [ ] **Step 1: Napiši testove koji padaju**

`src/content/__tests__/sadrzaj.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { KATEGORIJE, radovi } from '@/content/radovi'
import { usluge } from '@/content/usluge'
import { proces } from '@/content/proces'
import { rokovi } from '@/content/rokovi'
import { paketi } from '@/content/paketi'
import { testimonijali } from '@/content/testimonijali'

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
```

- [ ] **Step 2: Pokreni testove**

Run: `npm run test`
Expected: FAIL — moduli ne postoje

- [ ] **Step 3: Napiši `src/content/tipovi.ts`**

```ts
export type Kategorija = 'FIRME' | 'NEKRETNINE' | 'EVENTI' | 'SPORT' | 'DRON'

export type Rad = {
  id: string
  naslov: string
  kategorija: Kategorija
  medij: 'foto' | 'video'
}

export type Usluga = {
  broj: string
  naziv: string
  naslov: string
  opis: string
  ukljuceno: string[]
}

export type Faza = { broj: string; tekst: string }
export type Rok = { vrijednost: string; opis: string }

export type Paket = {
  naziv: string
  cijena: number
  zaKoga: string
  stavke: string[]
  istaknut: boolean
}

export type Clan = { ime: string; uloga: string; opis: string; slikaId: string }
export type Testimonijal = { citat: string; ime: string; uloga: string }
```

- [ ] **Step 4: Napiši `src/content/radovi.ts`**

```ts
import type { Kategorija, Rad } from './tipovi'

export const KATEGORIJE: Kategorija[] = ['FIRME', 'NEKRETNINE', 'EVENTI', 'SPORT', 'DRON']

export const radovi: Rad[] = [
  { id: 'gradiska-open', naslov: 'Gradiška Open 3x3', kategorija: 'SPORT', medij: 'video' },
  { id: 'gradiska-open-teren', naslov: 'Gradiška Open — teren iz vazduha', kategorija: 'DRON', medij: 'foto' },
  { id: 'gradiska-open-finale', naslov: 'Gradiška Open — finale', kategorija: 'SPORT', medij: 'foto' },
  { id: 'restoran-enterijer', naslov: 'Restoran — enterijer', kategorija: 'FIRME', medij: 'foto' },
  { id: 'restoran-kuhinja', naslov: 'Restoran — kuhinja u radu', kategorija: 'FIRME', medij: 'foto' },
  { id: 'restoran-promo', naslov: 'Restoran — promo klip', kategorija: 'FIRME', medij: 'video' },
  { id: 'kafic-atmosfera', naslov: 'Kafić — atmosfera', kategorija: 'FIRME', medij: 'foto' },
  { id: 'teretana-oprema', naslov: 'Teretana — oprema i prostor', kategorija: 'FIRME', medij: 'foto' },
  { id: 'servis-rad', naslov: 'Auto servis — ruke u radu', kategorija: 'FIRME', medij: 'foto' },
  { id: 'stan-dnevni', naslov: 'Stan — dnevni boravak', kategorija: 'NEKRETNINE', medij: 'foto' },
  { id: 'stan-kuhinja', naslov: 'Stan — kuhinja', kategorija: 'NEKRETNINE', medij: 'foto' },
  { id: 'kuca-eksterijer', naslov: 'Kuća — eksterijer', kategorija: 'NEKRETNINE', medij: 'foto' },
  { id: 'kuca-iz-vazduha', naslov: 'Kuća — objekat u okruženju', kategorija: 'DRON', medij: 'foto' },
  { id: 'kuca-obilazak', naslov: 'Kuća — video obilazak', kategorija: 'NEKRETNINE', medij: 'video' },
  { id: 'rodjendan-sala', naslov: 'Proslava — sala', kategorija: 'EVENTI', medij: 'foto' },
  { id: 'rodjendan-gosti', naslov: 'Proslava — gosti', kategorija: 'EVENTI', medij: 'foto' },
  { id: 'firmin-event', naslov: 'Firmin event — prezentacija', kategorija: 'EVENTI', medij: 'foto' },
  { id: 'firmin-event-klip', naslov: 'Firmin event — highlight', kategorija: 'EVENTI', medij: 'video' },
  { id: 'okolina-dron', naslov: 'Gradiška iz vazduha', kategorija: 'DRON', medij: 'video' },
]
```

> Ovi naslovi opisuju radove koje tek treba snimiti. Kad stigne pravi materijal, mijenjaju se `naslov` i `id`, a `id` postaje ime fajla u `/public/media/`.

- [ ] **Step 5: Napiši `src/content/usluge.ts`**

```ts
import type { Usluga } from './tipovi'

export const usluge: Usluga[] = [
  {
    broj: '01',
    naziv: 'Sadržaj za firme',
    naslov: 'Snimamo kako radiš.',
    opis: 'Fotografije i video za sajt, Instagram i marketing. Snimamo prostor, ljude u radu i ono što prodaješ — tako da izgleda kao tvoj posao, a ne kao katalog.',
    ukljuceno: ['Foto za sajt i mreže', 'Video do 2 minuta', 'Vertikalna verzija', 'Dron ako uslovi dozvole', 'Portret vlasnika'],
  },
  {
    broj: '02',
    naziv: 'Nekretnine',
    naslov: 'Objekat koji se proda.',
    opis: 'Enterijer, eksterijer i vazdušni kadrovi za oglas. Rok je pet dana jer agenciji treba odmah, ne za sedmicu.',
    ukljuceno: ['Enterijer i eksterijer', 'Vazdušni kadrovi', 'Video obilazak', 'Rok 5 dana'],
  },
  {
    broj: '03',
    naziv: 'Dron',
    naslov: 'Kadar koji niko drugi nema.',
    opis: 'Vazdušna fotografija i video. Objekat u okruženju, teren, gradilište, imanje. Letimo kad vrijeme i propisi dozvole — i to kažemo unaprijed.',
    ukljuceno: ['Vazdušna fotografija', 'Vazdušni video', 'Objekat u okruženju'],
  },
  {
    broj: '04',
    naziv: 'Eventi i proslave',
    naslov: 'Dan koji se ne ponavlja.',
    opis: 'Firmini eventi, konferencije i privatne proslave. Dolazimo trideset minuta ranije i planiramo grupnu fotografiju umjesto da čekamo da se desi.',
    ukljuceno: ['Firmini eventi', 'Konferencije', 'Proslave', 'Highlight video'],
  },
  {
    broj: '05',
    naziv: 'Sport i turniri',
    naslov: 'Napor se vidi izbliza.',
    opis: 'Akcija, atmosfera i dodjela nagrada. Dron ide iznad terena, nikad iznad publike.',
    ukljuceno: ['Akcija', 'Atmosfera i publika', 'Dron iznad terena', 'Dodjela nagrada'],
  },
  {
    broj: '06',
    naziv: 'Sajt i sadržaj',
    naslov: 'Sadržaj i sajt iz iste kuće.',
    opis: 'Sajt radi NextPixel.dev, sadržaj radimo mi. Kad ide zajedno, foto paket je petnaest posto jeftiniji.',
    ukljuceno: ['Zajedno s NextPixel.dev', 'Foto paket −15% uz sajt'],
  },
]
```

- [ ] **Step 6: Napiši `src/content/proces.ts`, `rokovi.ts`, `paketi.ts`**

`src/content/proces.ts`:

```ts
import type { Faza } from './tipovi'

export const proces: Faza[] = [
  { broj: '01', tekst: 'Pitamo prije nego što snimimo.' },
  { broj: '02', tekst: 'Obiđemo prostor i napišemo shot listu.' },
  { broj: '03', tekst: 'Dođemo trideset minuta ranije.' },
  { broj: '04', tekst: 'Materijal je na dva diska prije nego što legnemo.' },
  { broj: '05', tekst: 'Obrađujemo dok set ne izgleda kao jedan set.' },
  { broj: '06', tekst: 'Prvi izbor stiže za 48 sati.' },
]

export const procesKratko = [
  'Dogovor', 'Priprema', 'Snimanje', 'Backup', 'Obrada', 'Isporuka',
]
```

`src/content/rokovi.ts`:

```ts
import type { Rok } from './tipovi'

export const rokovi: Rok[] = [
  { vrijednost: '48h', opis: 'Prvi izbor fotografija, od snimanja' },
  { vrijednost: '7 dana', opis: 'Kompletne fotografije' },
  { vrijednost: '14 dana', opis: 'Video, s vertikalnom verzijom' },
  { vrijednost: '2 diska', opis: 'Backup prije nego što legnemo' },
]
```

`src/content/paketi.ts`:

```ts
import type { Paket } from './tipovi'

export const paketi: Paket[] = [
  {
    naziv: 'MINI',
    cijena: 350,
    zaKoga: 'Mala radnja, salon, kafić.',
    stavke: ['2 sata snimanja', '20 obrađenih fotografija', 'Dron uz doplatu', '1 runda korekcija'],
    istaknut: false,
  },
  {
    naziv: 'STANDARD',
    cijena: 650,
    zaKoga: 'Restoran, teretana, servis, stolarija.',
    stavke: ['4 sata snimanja', '40 obrađenih fotografija', 'Video do 60 sekundi', 'Vertikalna verzija', 'Dron ako uslovi dozvole', '1 runda korekcija'],
    istaknut: true,
  },
  {
    naziv: 'PLUS',
    cijena: 1200,
    zaKoga: 'Proizvodni pogon, veći objekat, godišnji sadržaj.',
    stavke: ['8 sati snimanja', '80 obrađenih fotografija', 'Video do 2 minuta', 'Vertikalna verzija i 2 isječka', 'Dron', '1 runda korekcija'],
    istaknut: false,
  },
]
```

> Samo STANDARD je `istaknut: true`. Pravilo prodaje iz Cjenovnika §3: ponudi tri paketa i preporuči srednji.

- [ ] **Step 7: Napiši `src/content/ekipa.ts` i `testimonijali.ts`**

```ts
// src/content/ekipa.ts
import type { Clan } from './tipovi'

export const ekipa: Clan[] = [
  {
    ime: 'Nikola Milošević',
    uloga: 'Snimanje i post-produkcija',
    opis: 'Snima, montira i isporučuje. Drži rokove jer ih sam postavlja.',
    slikaId: 'ekipa-nikola',
  },
  {
    ime: 'Druga osoba',
    uloga: 'Snimanje i organizacija',
    opis: 'Drugo tijelo na lokaciji, detalji i portreti, dogovor s klijentom.',
    slikaId: 'ekipa-druga',
  },
]
```

```ts
// src/content/testimonijali.ts
import type { Testimonijal } from './tipovi'

/**
 * Prazno namjerno. Sekcija se ne renderuje dok ne stigne prva prava preporuka.
 * Mehanizam uvodnih cijena (Cjenovnik §12) traži preporuku u zamjenu za popust.
 */
export const testimonijali: Testimonijal[] = []
```

- [ ] **Step 8: Napiši `src/content/tekstovi.ts`**

```ts
export const tekstovi = {
  hero: {
    naslov: 'NextPixel Media',
    podnaslov: 'Foto · Video · Dron',
    opis: 'Sadržaj za firme, nekretnine i događaje — Gradiška, Banja Luka i okolina.',
  },
  statement: {
    prvi: 'Ljudi biraju gdje će jesti, gdje će trenirati i koga će zvati —',
    naglasak: 'po slikama.',
    drugi: 'Tvoje su slabije nego tvoj posao.',
  },
  intro: 'Nas je dvoje. Snimamo vikendom, jedan do dva posla mjesečno — i zato svaki odradimo do kraja.',
  citat: 'Rok koji ispuniš svaki put vrijedi više od roka koji zvuči brzo i probije se.',
  rokoviNaslov: 'Rokovi',
  rokoviNaljepnice: ['bez izgovora', 'zapisano u ponudi', 'isto svaki put'],
  cta: {
    naslov: 'Imaš objekat, event ili firmu za snimanje?',
    email: 'nikola@nextpixel.media',
  },
  footerKartica: { naslov: 'Treba ti i sajt?', link: 'nextpixel.dev' },
  uslugeHero: 'Jedna ekipa. Svaki kadar. Svaki format.',
  radoviHero: { naslov: 'Naš rad.', opis: 'Izbor onoga što smo snimili.' },
  oNama: 'NextPixel Media je media strana NextPixel-a. .dev gradi sajt — mi snimamo ono što na njemu stoji.',
  kontaktHero: 'Dobro došao. Da se upoznamo.',
  kontaktObecanje: 'Javljam se u roku od dva sata.',
} as const
```

- [ ] **Step 9: Pokreni testove**

Run: `npm run test`
Expected: PASS. Ako `paketi` test padne, PLUS ima `istaknut: true` — postavi na `false`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: sadržajni sloj sa invarijantama"
```

---

### Task 3: Placeholder mediji i build zaštita

**Files:**
- Create: `src/lib/media.ts`, `scripts/check-placeholders.mjs`
- Modify: `next.config.ts`, `package.json`
- Test: `scripts/check-placeholders.test.mjs`

**Interfaces:**
- Consumes: ništa
- Produces: `MEDIA_MODE: 'placeholder' | 'real'`, `slika(id: string, w: number, h: number): string`, `video(id: string): string`, `provjeriPlaceholdere(sadrzajMedia: string): { ok: boolean; poruka: string }`

- [ ] **Step 1: Napiši test koji pada**

`scripts/check-placeholders.test.mjs`:

```js
import { describe, expect, it } from 'vitest'
import { provjeriPlaceholdere } from './check-placeholders.mjs'

describe('provjeriPlaceholdere', () => {
  it('obara build kad je MEDIA_MODE placeholder', () => {
    const rezultat = provjeriPlaceholdere(`export const MEDIA_MODE = 'placeholder'`)
    expect(rezultat.ok).toBe(false)
    expect(rezultat.poruka).toContain('placeholder')
  })

  it('propušta build kad je MEDIA_MODE real', () => {
    const rezultat = provjeriPlaceholdere(`export const MEDIA_MODE = 'real'`)
    expect(rezultat.ok).toBe(true)
  })

  it('obara build kad MEDIA_MODE uopšte ne postoji', () => {
    const rezultat = provjeriPlaceholdere(`export const nesto = 1`)
    expect(rezultat.ok).toBe(false)
  })
})
```

- [ ] **Step 2: Pokreni test**

Run: `npm run test -- check-placeholders`
Expected: FAIL — `check-placeholders.mjs` ne postoji

- [ ] **Step 3: Napiši `scripts/check-placeholders.mjs`**

```js
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
```

- [ ] **Step 4: Napiši `src/lib/media.ts`**

```ts
/**
 * Jedini izvor URL-ova slika i videa.
 *
 * Dok je 'placeholder', sajt vuče privremene slike sa picsum.photos.
 * Kad stigne pravi materijal: ubaci fajlove u public/media/ pod imenom
 * koje odgovara `id` iz src/content/radovi.ts, pa prebaci na 'real'.
 *
 * scripts/check-placeholders.mjs obara produkcijski build dok je 'placeholder'.
 */
export const MEDIA_MODE: 'placeholder' | 'real' = 'placeholder'

export function slika(id: string, sirina: number, visina: number): string {
  if (MEDIA_MODE === 'placeholder') {
    return `https://picsum.photos/seed/${id}/${sirina}/${visina}`
  }
  return `/media/${id}.jpg`
}

export function video(id: string): string {
  if (MEDIA_MODE === 'placeholder') return ''
  return `/media/${id}.mp4`
}

export const jePlaceholder = MEDIA_MODE === 'placeholder'
```

- [ ] **Step 5: Dozvoli picsum u `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'picsum.photos' }],
  },
}

export default nextConfig
```

- [ ] **Step 6: Veži zaštitu na produkcijski build**

U `package.json`:

```json
"build": "next build",
"build:prod": "node scripts/check-placeholders.mjs && next build"
```

`build` ostaje čist da Vercel preview deploy radi. `build:prod` je ono što se pušta na produkciju.

- [ ] **Step 7: Pokreni testove**

Run: `npm run test`
Expected: PASS

- [ ] **Step 8: Provjeri da zaštita stvarno obara**

Run: `npm run build:prod`
Expected: izlazi s greškom i porukom „Build zaustavljen: MEDIA_MODE je još placeholder"

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: placeholder mediji i build zaštita"
```

---

### Task 4: UI primitivi

**Files:**
- Create: `src/components/ui/Okvir.tsx`, `src/components/ui/Labela.tsx`, `src/components/ui/Dugme.tsx`, `src/components/ui/Broj.tsx`

**Interfaces:**
- Consumes: tokeni iz Task 1
- Produces: `<Okvir>` (uglovne zagrade oko djeteta), `<Labela>` (tekst u `[ ]`), `<Dugme href variant>`, `<Broj vrijednost opis>`

- [ ] **Step 1: Napiši `src/components/ui/Okvir.tsx`**

Ovo je najprepoznatljiviji detalj sajta — četiri ugla koja se razmiču na hover.

```tsx
type Props = { children: React.ReactNode; className?: string }

function Ugao({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 7 7"
      aria-hidden="true"
      className={`pointer-events-none absolute size-[0.55vw] max-md:size-[1.8vw] text-champagne transition-transform duration-300 ease-out ${className}`}
    >
      <path d="M0.5 7L0.5 3.5C0.5 1.84315 1.84315 0.5 3.5 0.5L7 0.5" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  )
}

// Korijen je div, ne span: Okvir ponekad obavija kartice i druge blok
// elemente (paketi), a span sa blok djetetom je nevažeći HTML.
export function Okvir({ children, className = '' }: Props) {
  return (
    <div className={`group relative inline-block ${className}`}>
      <Ugao className="top-[-0.4vw] left-[-0.7vw] max-md:top-[-1.2vw] max-md:left-[-2vw] group-hover:-translate-x-[0.2vw] group-hover:-translate-y-[0.2vw]" />
      <Ugao className="top-[-0.4vw] right-[-0.7vw] max-md:top-[-1.2vw] max-md:right-[-2vw] -scale-x-100 group-hover:translate-x-[0.2vw] group-hover:-translate-y-[0.2vw]" />
      <Ugao className="bottom-[-0.4vw] left-[-0.7vw] max-md:bottom-[-1.2vw] max-md:left-[-2vw] -scale-y-100 group-hover:-translate-x-[0.2vw] group-hover:translate-y-[0.2vw]" />
      <Ugao className="bottom-[-0.4vw] right-[-0.7vw] max-md:bottom-[-1.2vw] max-md:right-[-2vw] rotate-180 group-hover:translate-x-[0.2vw] group-hover:translate-y-[0.2vw]" />
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Napiši `src/components/ui/Labela.tsx`**

```tsx
type Props = { children: React.ReactNode; className?: string }

export function Labela({ children, className = '' }: Props) {
  return (
    <span className={`font-body text-[0.75vw] max-md:text-[2.6vw] uppercase tracking-[0.15em] text-gray ${className}`}>
      [ {children} ]
    </span>
  )
}
```

- [ ] **Step 3: Napiši `src/components/ui/Dugme.tsx`**

```tsx
import Link from 'next/link'
import { Okvir } from './Okvir'

type Props = {
  href: string
  children: React.ReactNode
  varijanta?: 'puno' | 'obris'
}

export function Dugme({ href, children, varijanta = 'obris' }: Props) {
  const osnova =
    'inline-flex items-center gap-[0.5vw] max-md:gap-[2vw] px-[1.4vw] py-[0.7vw] max-md:px-[5vw] max-md:py-[3vw] font-body text-[0.85vw] max-md:text-[3.2vw] uppercase tracking-[0.1em] transition-colors duration-300'

  const stil =
    varijanta === 'puno'
      ? 'bg-champagne text-black hover:bg-white'
      : 'border border-champagne/40 text-white hover:border-champagne'

  return (
    <Okvir>
      <Link href={href} className={`${osnova} ${stil}`}>
        {children}
        <span aria-hidden="true">→</span>
      </Link>
    </Okvir>
  )
}
```

- [ ] **Step 4: Napiši `src/components/ui/Broj.tsx`**

```tsx
type Props = { vrijednost: string; opis: string }

export function Broj({ vrijednost, opis }: Props) {
  return (
    <div className="flex flex-col gap-[0.4vw] max-md:gap-[1.5vw]">
      <span className="naslov text-champagne text-[5vw] max-md:text-[14vw]">{vrijednost}</span>
      <span className="font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.12em] text-gray">
        {opis}
      </span>
    </div>
  )
}
```

- [ ] **Step 5: Provjeri vizuelno**

Privremeno ubaci u `src/app/page.tsx` po jedan primjer svakog primitiva, pokreni `npm run dev`, otvori `localhost:3000`.
Expected: uglovne zagrade se razmiču na hover nad dugmetom; labela ima uglaste zagrade; broj je u šampanju.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: UI primitivi — okvir, labela, dugme, broj"
```

---

### Task 5: Scroll temelj

**Files:**
- Create: `src/lib/gsap.ts`, `src/lib/useGsap.ts`, `src/components/layout/SmoothScroll.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: ništa
- Produces: `gsap`, `ScrollTrigger`, `SplitText`, `Observer` iz `@/lib/gsap`; `useGsap(setup: (mm: MatchMedia) => void, deps?: unknown[]): RefObject<HTMLDivElement>`; `<SmoothScroll>` wrapper

- [ ] **Step 1: Napiši `src/lib/gsap.ts`**

```ts
'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Observer } from 'gsap/Observer'

if (typeof window !== 'undefined' && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger, SplitText, Observer)
}

export { gsap, ScrollTrigger, SplitText, Observer }
```

- [ ] **Step 2: Napiši `src/lib/useGsap.ts`**

Ovaj hook je jedino mjesto gdje se `prefers-reduced-motion` provjerava. Sekcija koja ga zaobiđe pravi grešku.

```ts
'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from './gsap'

type MatchMedia = ReturnType<typeof gsap.matchMedia>
type Setup<T extends HTMLElement> = (mm: MatchMedia, korijen: T) => void

/**
 * Registruje animacije sekcije unutar gsap.context, pa se sve poništi
 * na unmount. Bez konteksta React dvostruki mount ostavlja duple
 * ScrollTrigger instance i pozicije se udvoje.
 *
 * Animacije se dodaju kroz mm.add('(prefers-reduced-motion: no-preference)', ...)
 * tako da posjetilac koji je isključio pokret dobija krajnje stanje bez tweena.
 *
 * `korijen` je element sekcije. Koristi ga za pretragu unutar sekcije
 * umjesto document.querySelector — inače dvije instance iste komponente
 * gađaju jedna drugu.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: Setup<T>,
  deps: unknown[] = [],
) {
  const scope = useRef<T>(null)

  useLayoutEffect(() => {
    if (!scope.current) return
    const korijen = scope.current

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      setup(mm, korijen)
    }, scope)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return scope
}

export const BEZ_REDUKCIJE = '(prefers-reduced-motion: no-preference)'
```

- [ ] **Step 3: Napiši `src/components/layout/SmoothScroll.tsx`**

```tsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const voliPokret = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    if (!voliPokret) return

    const lenis = new Lenis({ autoRaf: false })

    // Jedan sat, dva potrošača. Dvije nezavisne petlje razilaze
    // pin pozicije od stvarnog scrolla.
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (vrijeme: number) => lenis.raf(vrijeme * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // SplitText prije učitanog Montserrata prelama linije pogrešno.
    document.fonts.ready.then(() => ScrollTrigger.refresh())

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
```

- [ ] **Step 4: Uvezi u layout**

U `src/app/layout.tsx` umotaj `{children}`:

```tsx
import { SmoothScroll } from '@/components/layout/SmoothScroll'
// ...
<body className="bg-black text-white antialiased">
  <SmoothScroll>{children}</SmoothScroll>
</body>
```

- [ ] **Step 5: Provjeri**

Privremeno dodaj u `page.tsx` `<div className="h-[300vh]" />` pa `npm run dev`.
Expected: scroll ima inerciju. U sistemskim postavkama uključi „Reduce motion" i osvježi — scroll postaje običan, bez greške u konzoli.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: Lenis i GSAP dijele jedan RAF, useGsap hook"
```

---

### Task 6: Nav, meni, footer i skelet ruta

**Files:**
- Create: `src/components/layout/Nav.tsx`, `src/components/layout/Meni.tsx`, `src/components/layout/Footer.tsx`
- Create: `src/app/radovi/page.tsx`, `src/app/usluge/page.tsx`, `src/app/o-nama/page.tsx`, `src/app/kontakt/page.tsx`, `src/app/uslovi/page.tsx`, `src/app/privatnost/page.tsx`
- Create: `src/app/error.tsx`, `src/app/not-found.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `Okvir`, `Dugme`, `Labela` (Task 4); `useGsap` (Task 5); `tekstovi` (Task 2)
- Produces: `<Nav>`, `<Footer>`, `RUTE` niz `{ href, naziv }`

- [ ] **Step 1: Napravi `src/content/rute.ts`**

```ts
export const RUTE = [
  { href: '/', naziv: 'Početna' },
  { href: '/radovi', naziv: 'Radovi' },
  { href: '/usluge', naziv: 'Usluge' },
  { href: '/o-nama', naziv: 'O nama' },
  { href: '/kontakt', naziv: 'Kontakt' },
] as const
```

- [ ] **Step 2: Napiši `src/components/layout/Meni.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RUTE } from '@/content/rute'

type Props = { otvoren: boolean; zatvori: () => void }

export function Meni({ otvoren, zatvori }: Props) {
  const putanja = usePathname()

  return (
    <div
      className={`fixed inset-0 z-[998] bg-black transition-opacity duration-500 ${
        otvoren ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <nav className="flex h-full flex-col justify-center px-[10vw] max-md:px-[8vw]">
        {RUTE.map((ruta, i) => (
          <Link
            key={ruta.href}
            href={ruta.href}
            onClick={zatvori}
            style={{ transitionDelay: otvoren ? `${120 + i * 60}ms` : '0ms' }}
            className={`naslov py-[0.6vw] max-md:py-[2vw] text-[5vw] max-md:text-[12vw] transition-all duration-500 ${
              otvoren ? 'translate-y-0 opacity-100' : 'translate-y-[1vw] opacity-0'
            } ${putanja === ruta.href ? 'text-champagne' : 'text-gray hover:text-white'}`}
          >
            {ruta.naziv}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-[3vw] left-[10vw] right-[10vw] flex justify-between max-md:bottom-[8vw] max-md:left-[8vw] max-md:right-[8vw]">
        <span className="font-body text-[0.75vw] max-md:text-[2.6vw] uppercase tracking-[0.15em] text-gray">
          © 2026 NextPixel Media — Gradiška, BA
        </span>
        <span className="font-body text-[0.75vw] max-md:text-[2.6vw] uppercase tracking-[0.15em] text-gray">
          Foto · Video · Dron
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Napiši `src/components/layout/Nav.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Meni } from './Meni'
import { Okvir } from '@/components/ui/Okvir'

export function Nav() {
  const [otvoren, postaviOtvoren] = useState(false)

  return (
    <>
      <Meni otvoren={otvoren} zatvori={() => postaviOtvoren(false)} />

      <nav className="fixed top-0 left-0 z-[999] flex w-full items-center justify-between px-[4vw] py-[2.2vw] max-md:px-[6vw] max-md:py-[5vw]">
        <Link href="/" aria-label="NextPixel Media, početna" className="relative z-10">
          <span className="naslov text-[1.4vw] max-md:text-[5vw] text-white">
            N<span className="text-champagne">P</span>
          </span>
        </Link>

        <div className="relative z-10 flex items-center gap-[1.5vw] max-md:gap-[4vw]">
          <Okvir>
            <Link
              href="/kontakt"
              className="inline-block bg-champagne px-[1.2vw] py-[0.6vw] max-md:px-[4vw] max-md:py-[2.5vw] font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.1em] text-black transition-colors hover:bg-white"
            >
              Započni projekat
            </Link>
          </Okvir>

          <Okvir>
            <button
              type="button"
              onClick={() => postaviOtvoren((v) => !v)}
              aria-expanded={otvoren}
              className="inline-flex items-center gap-[0.6vw] max-md:gap-[2vw] border border-white/15 bg-black px-[1.2vw] py-[0.6vw] max-md:px-[4vw] max-md:py-[2.5vw] font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.1em] text-white"
            >
              {otvoren ? 'Zatvori' : 'Meni'}
              <span aria-hidden="true">{otvoren ? '✕' : '☰'}</span>
            </button>
          </Okvir>
        </div>
      </nav>
    </>
  )
}
```

- [ ] **Step 4: Napiši `src/components/layout/Footer.tsx`**

```tsx
import Link from 'next/link'
import { RUTE } from '@/content/rute'
import { tekstovi } from '@/content/tekstovi'

export function Footer() {
  return (
    <footer className="w-full bg-black px-[4vw] pt-[5vw] pb-[2vw] max-md:px-[6vw] max-md:pt-[14vw] max-md:pb-[8vw]">
      <div className="flex items-start justify-between gap-[4vw] max-md:flex-col max-md:gap-[10vw]">
        <h2 className="naslov text-[9vw] max-md:text-[16vw] leading-[0.8] text-white">
          NextPixel<span className="text-champagne">.</span>
          <br />
          Media
        </h2>

        <div className="flex flex-col items-end gap-[2vw] max-md:items-start max-md:gap-[6vw]">
          <div className="border border-champagne/30 px-[2vw] py-[1.5vw] max-md:px-[6vw] max-md:py-[5vw]">
            <p className="font-body text-[1vw] max-md:text-[4vw] text-white">
              {tekstovi.footerKartica.naslov}
            </p>
            <a
              href={`https://${tekstovi.footerKartica.link}`}
              className="font-body text-[1vw] max-md:text-[4vw] text-champagne hover:text-white"
            >
              → {tekstovi.footerKartica.link}
            </a>
          </div>

          <nav className="flex flex-col items-end gap-[0.3vw] max-md:items-start max-md:gap-[2vw]">
            {RUTE.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="font-body text-[0.9vw] max-md:text-[3.5vw] text-gray hover:text-champagne"
              >
                {r.naziv}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-[4vw] flex items-center justify-between border-t border-white/10 pt-[1.5vw] max-md:mt-[12vw] max-md:flex-col max-md:gap-[3vw] max-md:pt-[5vw]">
        <span className="font-body text-[0.75vw] max-md:text-[2.8vw] text-gray">
          © 2026 NextPixel Media. Sva prava zadržana.
        </span>
        <div className="flex gap-[1.5vw] max-md:gap-[5vw]">
          <Link href="/uslovi" className="font-body text-[0.75vw] max-md:text-[2.8vw] text-gray hover:text-champagne">
            Uslovi
          </Link>
          <Link href="/privatnost" className="font-body text-[0.75vw] max-md:text-[2.8vw] text-gray hover:text-champagne">
            Privatnost
          </Link>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Ubaci Nav i Footer u layout**

```tsx
<body className="bg-black text-white antialiased">
  <SmoothScroll>
    <Nav />
    {children}
    <Footer />
  </SmoothScroll>
</body>
```

- [ ] **Step 6: Napravi šest praznih ruta**

Svaka po ovom obrascu — zamijeni naslov i putanju:

```tsx
// src/app/radovi/page.tsx
export const metadata = { title: 'Radovi — NextPixel Media' }

export default function Radovi() {
  return (
    <main className="min-h-screen px-[4vw] pt-[12vw] max-md:px-[6vw] max-md:pt-[30vw]">
      <h1 className="naslov text-[6vw] max-md:text-[12vw]">Radovi</h1>
    </main>
  )
}
```

Isto za `usluge` („Usluge"), `o-nama` („O nama"), `kontakt` („Kontakt"), `uslovi` („Uslovi saradnje"), `privatnost` („Privatnost").

- [ ] **Step 7: Napiši `error.tsx` i `not-found.tsx`**

```tsx
// src/app/not-found.tsx
import { Dugme } from '@/components/ui/Dugme'

export default function NijePronadjeno() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-[2vw] max-md:gap-[6vw] px-[6vw]">
      <h1 className="naslov text-[8vw] max-md:text-[16vw] text-champagne">404</h1>
      <p className="font-body text-[1.1vw] max-md:text-[4vw] text-gray">
        Ova stranica ne postoji.
      </p>
      <Dugme href="/">Nazad na početnu</Dugme>
    </main>
  )
}
```

```tsx
// src/app/error.tsx
'use client'

export default function Greska({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-[2vw] max-md:gap-[6vw] px-[6vw] text-center">
      <h1 className="naslov text-[5vw] max-md:text-[10vw] text-champagne">Nešto je puklo</h1>
      <p className="font-body text-[1.1vw] max-md:text-[4vw] text-gray">
        Pokušaj ponovo. Ako se ponovi, javi se na nikola@nextpixel.media
      </p>
      <button
        type="button"
        onClick={reset}
        className="border border-champagne/40 px-[1.5vw] py-[0.7vw] max-md:px-[6vw] max-md:py-[3vw] font-body text-[0.9vw] max-md:text-[3.5vw] uppercase tracking-[0.1em] text-white hover:border-champagne"
      >
        Pokušaj ponovo
      </button>
    </main>
  )
}
```

- [ ] **Step 8: Provjeri**

Run: `npm run dev`
Expected: sve rute rade, meni se otvara i zatvara, aktivna stavka je šampanj, `/nepostoji` daje 404 stranicu.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: nav, fullscreen meni, footer i skelet ruta"
```

---

### Task 7: Shema upita i API ruta u Dockeru

**Files:**
- Create: `src/lib/shema.ts`, `src/app/api/kontakt/route.ts`, `Dockerfile`, `compose.yaml`, `.env.example`
- Test: `src/lib/__tests__/shema.test.ts`, `src/app/api/kontakt/__tests__/route.test.ts`

**Interfaces:**
- Consumes: ništa
- Produces: `upitShema` (zod), `type Upit`, `POST` handler na `/api/kontakt`

- [ ] **Step 1: Napiši testove sheme koji padaju**

`src/lib/__tests__/shema.test.ts`:

```ts
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
```

- [ ] **Step 2: Pokreni test**

Run: `npm run test -- shema`
Expected: FAIL — `@/lib/shema` ne postoji

- [ ] **Step 3: Napiši `src/lib/shema.ts`**

```ts
import { z } from 'zod'

export const TIPOVI = ['firma', 'nekretnina', 'event', 'dron', 'nisam-siguran'] as const
export const UPOTREBE = ['instagram', 'sajt', 'stampa', 'oglasavanje', 'ne-znam'] as const

export const upitShema = z.object({
  tip: z.enum(TIPOVI),
  ime: z.string().trim().min(2, 'Upiši ime ili naziv firme.').max(120),
  kontakt: z.string().trim().min(5, 'Upiši email ili telefon.').max(160),
  kadaGdje: z.string().trim().max(300).default(''),
  upotreba: z.array(z.enum(UPOTREBE)).min(1, 'Odaberi bar jedno.'),
  poruka: z.string().trim().max(3000).default(''),

  // Honeypot: pravi posjetilac ovo polje ne vidi, pa ga ne popunjava.
  web: z.literal('').default(''),
  // Vrijeme otvaranja forme, za odbacivanje trenutnih slanja.
  otvorenoU: z.number(),
})

export type Upit = z.infer<typeof upitShema>

export const NAJKRACE_POPUNJAVANJE_MS = 3000

export const OZNAKE_TIPA: Record<(typeof TIPOVI)[number], string> = {
  firma: 'Sadržaj za firmu',
  nekretnina: 'Nekretnina',
  event: 'Event ili proslava',
  dron: 'Dron',
  'nisam-siguran': 'Nisam siguran',
}

export const OZNAKE_UPOTREBE: Record<(typeof UPOTREBE)[number], string> = {
  instagram: 'Instagram',
  sajt: 'Sajt',
  stampa: 'Štampa',
  oglasavanje: 'Oglašavanje',
  'ne-znam': 'Ne znam još',
}
```

- [ ] **Step 4: Pokreni test sheme**

Run: `npm run test -- shema`
Expected: PASS

- [ ] **Step 5: Napiši test API rute koji pada**

`src/app/api/kontakt/__tests__/route.test.ts`:

```ts
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
```

- [ ] **Step 6: Pokreni test**

Run: `npm run test -- route`
Expected: FAIL — ruta ne postoji

- [ ] **Step 7: Napiši `src/app/api/kontakt/route.ts`**

```ts
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
```

- [ ] **Step 8: Napravi `.env.example`**

```
RESEND_API_KEY=re_xxx
KONTAKT_EMAIL=nikola@nextpixel.media
KONTAKT_POSILJALAC=sajt@nextpixel.media
```

Kopiraj u `.env` i popuni pravim ključem.

- [ ] **Step 9: Napravi Dockerfile i compose**

`Dockerfile`:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "test"]
```

`compose.yaml`:

```yaml
services:
  test:
    build: .
    env_file: .env
    command: npm run test
```

- [ ] **Step 10: Pokreni testove u Dockeru**

```bash
docker compose build
docker compose run --rm test
```

Expected: svi testovi prolaze unutar kontejnera, sa `.env` fajlom.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: shema upita i API ruta za kontakt, testirano u Dockeru"
```

---

### Task 8: Kontakt stranica

**Files:**
- Create: `src/components/kontakt/Forma.tsx`
- Modify: `src/app/kontakt/page.tsx`

**Interfaces:**
- Consumes: `upitShema`, `TIPOVI`, `UPOTREBE`, `OZNAKE_TIPA`, `OZNAKE_UPOTREBE` (Task 7); `Okvir`, `Labela` (Task 4); `tekstovi` (Task 2)
- Produces: `<Forma>`

- [ ] **Step 1: Napiši `src/components/kontakt/Forma.tsx`**

```tsx
'use client'

import { useRef, useState } from 'react'
import { Labela } from '@/components/ui/Labela'
import { Okvir } from '@/components/ui/Okvir'
import {
  OZNAKE_TIPA, OZNAKE_UPOTREBE, TIPOVI, UPOTREBE, upitShema,
} from '@/lib/shema'
import { tekstovi } from '@/content/tekstovi'

type Stanje = 'mirno' | 'salje' | 'poslato' | 'greska'

const polje =
  'w-full bg-transparent border-b border-white/20 py-[0.6vw] max-md:py-[3vw] font-body text-[1vw] max-md:text-[4vw] text-white placeholder:text-gray/60 focus:border-champagne focus:outline-none'

export function Forma() {
  const otvorenoU = useRef(Date.now())
  const [tip, postaviTip] = useState<(typeof TIPOVI)[number]>('firma')
  const [upotreba, postaviUpotrebu] = useState<string[]>([])
  const [stanje, postaviStanje] = useState<Stanje>('mirno')
  const [greske, postaviGreske] = useState<Record<string, string>>({})

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
      return
    }

    postaviGreske({})
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
      <div className="border border-champagne/30 p-[3vw] max-md:p-[8vw]">
        <p className="naslov text-[2.5vw] max-md:text-[8vw] text-champagne">Primljeno.</p>
        <p className="mt-[1vw] max-md:mt-[4vw] font-body text-[1vw] max-md:text-[4vw] text-white">
          {tekstovi.kontaktObecanje}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={posalji} className="flex flex-col gap-[1.5vw] max-md:gap-[6vw]">
      <fieldset className="border border-white/10 p-[1.5vw] max-md:p-[5vw]">
        <Labela>01</Labela>
        <legend className="sr-only">Šta ti treba</legend>
        <p className="naslov mt-[0.4vw] text-[1.6vw] max-md:text-[6vw] text-white">Šta ti treba?</p>
        <div className="mt-[1vw] max-md:mt-[4vw] flex flex-wrap gap-[0.6vw] max-md:gap-[2.5vw]">
          {TIPOVI.map((t) => (
            <button
              key={t} type="button" onClick={() => postaviTip(t)}
              className={`px-[1vw] py-[0.5vw] max-md:px-[4vw] max-md:py-[2.5vw] font-body text-[0.8vw] max-md:text-[3.2vw] uppercase tracking-[0.08em] transition-colors ${
                tip === t ? 'bg-champagne text-black' : 'border border-white/20 text-gray hover:text-white'
              }`}
            >
              {OZNAKE_TIPA[t]}
            </button>
          ))}
        </div>
      </fieldset>

      {[
        { br: '02', ime: 'ime', naslov: 'Ime i prezime ili firma', obavezno: true },
        { br: '03', ime: 'kontakt', naslov: 'Email ili telefon', obavezno: true },
        { br: '04', ime: 'kadaGdje', naslov: 'Kada i gdje', obavezno: false },
      ].map((p) => (
        <div key={p.ime} className="border border-white/10 p-[1.5vw] max-md:p-[5vw]">
          <Labela>{p.br}</Labela>
          <label htmlFor={p.ime} className="naslov mt-[0.4vw] block text-[1.6vw] max-md:text-[6vw] text-white">
            {p.naslov}{p.obavezno && <span className="text-champagne">*</span>}
          </label>
          <input id={p.ime} name={p.ime} className={`${polje} mt-[0.6vw] max-md:mt-[3vw]`} placeholder="Upiši" />
          {greske[p.ime] && (
            <p className="mt-[0.4vw] font-body text-[0.75vw] max-md:text-[3vw] text-champagne">{greske[p.ime]}</p>
          )}
        </div>
      ))}

      <fieldset className="border border-white/10 p-[1.5vw] max-md:p-[5vw]">
        <Labela>05</Labela>
        <legend className="sr-only">Gdje ćeš koristiti materijal</legend>
        <p className="naslov mt-[0.4vw] text-[1.6vw] max-md:text-[6vw] text-white">
          Gdje ćeš koristiti materijal?<span className="text-champagne">*</span>
        </p>
        <div className="mt-[1vw] max-md:mt-[4vw] flex flex-wrap gap-[0.6vw] max-md:gap-[2.5vw]">
          {UPOTREBE.map((u) => (
            <button
              key={u} type="button" onClick={() => prebaci(u)}
              className={`px-[1vw] py-[0.5vw] max-md:px-[4vw] max-md:py-[2.5vw] font-body text-[0.8vw] max-md:text-[3.2vw] uppercase tracking-[0.08em] transition-colors ${
                upotreba.includes(u) ? 'bg-champagne text-black' : 'border border-white/20 text-gray hover:text-white'
              }`}
            >
              {OZNAKE_UPOTREBE[u]}
            </button>
          ))}
        </div>
        {greske.upotreba && (
          <p className="mt-[0.6vw] font-body text-[0.75vw] max-md:text-[3vw] text-champagne">{greske.upotreba}</p>
        )}
      </fieldset>

      <div className="border border-white/10 p-[1.5vw] max-md:p-[5vw]">
        <Labela>06</Labela>
        <label htmlFor="poruka" className="naslov mt-[0.4vw] block text-[1.6vw] max-md:text-[6vw] text-white">
          Poruka
        </label>
        <textarea id="poruka" name="poruka" rows={4} className={`${polje} mt-[0.6vw] max-md:mt-[3vw] resize-none`} placeholder="Upiši" />
      </div>

      {/* Honeypot — sakriveno od ljudi i od čitača ekrana. */}
      <input type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px]" />

      <div className="flex items-center gap-[1.5vw] max-md:flex-col max-md:items-start max-md:gap-[4vw]">
        <Okvir>
          <button
            type="submit" disabled={stanje === 'salje'}
            className="bg-champagne px-[2vw] py-[0.8vw] max-md:px-[8vw] max-md:py-[4vw] font-body text-[0.9vw] max-md:text-[3.5vw] uppercase tracking-[0.1em] text-black transition-colors hover:bg-white disabled:opacity-50"
          >
            {stanje === 'salje' ? 'Šaljem…' : 'Pošalji'}
          </button>
        </Okvir>
        <span className="font-body text-[0.8vw] max-md:text-[3vw] text-gray">{tekstovi.kontaktObecanje}</span>
      </div>

      {stanje === 'greska' && (
        <p className="font-body text-[0.9vw] max-md:text-[3.5vw] text-champagne">
          Slanje nije uspjelo. Pošalji direktno na{' '}
          <a href={`mailto:${tekstovi.cta.email}`} className="underline">{tekstovi.cta.email}</a>
        </p>
      )}
    </form>
  )
}
```

- [ ] **Step 2: Napiši `src/app/kontakt/page.tsx`**

```tsx
import { Forma } from '@/components/kontakt/Forma'
import { Labela } from '@/components/ui/Labela'
import { tekstovi } from '@/content/tekstovi'

export const metadata = {
  title: 'Kontakt — NextPixel Media',
  description: 'Pošalji upit za snimanje. Javljamo se u roku od dva sata.',
}

export default function Kontakt() {
  return (
    <main className="min-h-screen px-[4vw] pt-[10vw] pb-[6vw] max-md:px-[6vw] max-md:pt-[30vw] max-md:pb-[15vw]">
      <div className="grid grid-cols-[1fr_1.6fr] gap-[4vw] max-md:grid-cols-1 max-md:gap-[10vw]">
        <div>
          <Labela>Razgovor</Labela>
          <h1 className="naslov mt-[1vw] max-md:mt-[4vw] text-[4vw] max-md:text-[11vw] text-white">
            {tekstovi.kontaktHero}
          </h1>
          <a
            href={`mailto:${tekstovi.cta.email}`}
            className="mt-[2vw] max-md:mt-[6vw] inline-block font-body text-[1.1vw] max-md:text-[4.5vw] text-champagne hover:text-white"
          >
            {tekstovi.cta.email}
          </a>
        </div>
        <Forma />
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Provjeri ručno**

Run: `npm run dev`, otvori `/kontakt`.
Expected: prazan submit prikazuje greške ispod polja; popunjen submit poziva API; bez `RESEND_API_KEY` javlja grešku s mailto fallbackom.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: kontakt stranica sa formom koja nosi brief"
```

---

### Task 9: Početna — hero, marquee, statement

**Files:**
- Create: `src/components/sections/Hero.tsx`, `src/components/sections/MarqueeSlika.tsx`, `src/components/sections/Statement.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `useGsap`, `BEZ_REDUKCIJE` (Task 5); `slika` (Task 3); `tekstovi`, `radovi` (Task 2)
- Produces: `<Hero>`, `<MarqueeSlika>`, `<Statement>`

- [ ] **Step 1: Napiši `src/components/sections/Hero.tsx`**

Header je 200vh — pin drži prvi ekran dok se scroll troši, po LAYR obrascu.

```tsx
'use client'

import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { BEZ_REDUKCIJE, useGsap } from '@/lib/useGsap'
import { slika } from '@/lib/media'
import { tekstovi } from '@/content/tekstovi'

export function Hero() {
  const scope = useGsap<HTMLElement>((mm) => {
    mm.add(BEZ_REDUKCIJE, () => {
      gsap.to('[data-hero-naslov]', {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-hero]',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          pin: '[data-hero-ekran]',
          pinSpacing: false,
        },
      })
    })
  })

  return (
    <header ref={scope} data-hero className="relative h-[200vh] w-full">
      <div data-hero-ekran className="relative h-screen w-full overflow-hidden">
        <Image
          src={slika('hero', 1920, 1080)}
          alt="Kadar iz vazduha, okolina Gradiške"
          fill priority sizes="100vw"
          className="object-cover brightness-[0.55]"
        />

        <div data-hero-naslov className="absolute inset-0 flex flex-col justify-center px-[4vw] max-md:px-[6vw]">
          <h1 className="naslov text-[9vw] max-md:text-[15vw] text-white">
            NextPixel<span className="text-champagne">.</span>
            <br />
            Media
          </h1>
          <p className="mt-[1.5vw] max-md:mt-[5vw] font-body text-[1.1vw] max-md:text-[4vw] uppercase tracking-[0.2em] text-champagne">
            {tekstovi.hero.podnaslov}
          </p>
          <p className="mt-[0.8vw] max-md:mt-[3vw] max-w-[32vw] max-md:max-w-none font-body text-[0.95vw] max-md:text-[3.6vw] text-white/80">
            {tekstovi.hero.opis}
          </p>
        </div>

        <span className="absolute bottom-[2vw] left-[4vw] max-md:bottom-[6vw] max-md:left-[6vw] font-body text-[0.75vw] max-md:text-[3vw] uppercase tracking-[0.2em] text-white/60">
          ↓ Scroll
        </span>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Napiši `src/components/sections/MarqueeSlika.tsx`**

Marquee je čist CSS — bez JS-a, po LAYR obrascu. Niz se duplira da petlja bude bešavna.

```tsx
import Image from 'next/image'
import { slika } from '@/lib/media'
import { radovi } from '@/content/radovi'
import { tekstovi } from '@/content/tekstovi'

export function MarqueeSlika() {
  const izbor = radovi.slice(0, 10)
  const traka = [...izbor, ...izbor]

  return (
    <section className="w-full overflow-hidden bg-black py-[2vw] max-md:py-[8vw]">
      <div
        className="flex w-max gap-[1vw] max-md:gap-[3vw]"
        style={{ animation: 'marqueeLijevo 40s linear infinite' }}
      >
        {traka.map((rad, i) => (
          <div key={`${rad.id}-${i}`} className="relative h-[14vw] w-[20vw] max-md:h-[38vw] max-md:w-[55vw] shrink-0">
            <Image
              src={slika(rad.id, 800, 560)}
              alt={rad.naslov}
              fill sizes="(max-width: 768px) 55vw, 20vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <p className="mt-[1.5vw] max-md:mt-[6vw] px-[4vw] max-md:px-[6vw] text-right font-body text-[0.9vw] max-md:text-[3.4vw] uppercase tracking-[0.2em] text-champagne">
        {tekstovi.hero.podnaslov}
      </p>
    </section>
  )
}
```

- [ ] **Step 3: Napiši `src/components/sections/Statement.tsx`**

```tsx
'use client'

import { gsap, SplitText } from '@/lib/gsap'
import { BEZ_REDUKCIJE, useGsap } from '@/lib/useGsap'
import { tekstovi } from '@/content/tekstovi'

export function Statement() {
  const scope = useGsap<HTMLElement>((mm) => {
    mm.add(BEZ_REDUKCIJE, () => {
      const split = new SplitText('[data-statement]', { type: 'lines', linesClass: 'linija' })

      gsap.from(split.lines, {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-statement]', start: 'top 75%' },
      })

      return () => split.revert()
    })
  })

  return (
    <section ref={scope} className="w-full bg-cream px-[4vw] py-[8vw] max-md:px-[6vw] max-md:py-[18vw]">
      <p data-statement className="naslov max-w-[70vw] max-md:max-w-none text-[4vw] max-md:text-[8.5vw] text-black">
        {tekstovi.statement.prvi}{' '}
        <span className="text-champagne">{tekstovi.statement.naglasak}</span>{' '}
        {tekstovi.statement.drugi}
      </p>
    </section>
  )
}
```

- [ ] **Step 4: Dodaj `.linija` u `src/styles/globals.css`**

Bez `overflow: hidden` na liniji, `yPercent: 110` se vidi izvan okvira umjesto da bude sakriven.

```css
.linija { overflow: hidden; }
```

- [ ] **Step 5: Sastavi početnu**

```tsx
// src/app/page.tsx
import { Hero } from '@/components/sections/Hero'
import { MarqueeSlika } from '@/components/sections/MarqueeSlika'
import { Statement } from '@/components/sections/Statement'

export default function Pocetna() {
  return (
    <main>
      <Hero />
      <MarqueeSlika />
      <Statement />
    </main>
  )
}
```

- [ ] **Step 6: Provjeri**

Run: `npm run dev`
Expected: hero se drži pinovan kroz 200vh dok naslov blijedi; marquee klizi bešavno; statement se otkriva po linijama pri dolasku u vidno polje. Uključi „Reduce motion" — tekst stoji vidljiv, bez animacije, bez greške.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: početna — hero pin, marquee, statement reveal"
```

---

### Task 10: Početna — vizir, mreža radova, intro

**Files:**
- Create: `src/components/sections/Vizir.tsx`, `src/components/sections/MrezaRadova.tsx`, `src/components/sections/Intro.tsx`, `src/components/sections/GalerijaCTA.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `useGsap`, `BEZ_REDUKCIJE`, `gsap` (Task 5); `slika`, `video`, `jePlaceholder` (Task 3); `radovi`, `tekstovi` (Task 2); `Dugme`, `Labela` (Task 4)
- Produces: `<Vizir>`, `<MrezaRadova>`, `<Intro>`, `<GalerijaCTA>`

- [ ] **Step 1: Napiši `src/components/sections/Vizir.tsx`**

Ovdje LAYR ima PNG poleđine fotoaparata s videom u LCD ekranu. Logo Guide §2 zabranjuje doslovnu kameru, ali dopušta viewfinder UI — pa okvir vizira zamjenjuje kućište aparata.

```tsx
'use client'

import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { BEZ_REDUKCIJE, useGsap } from '@/lib/useGsap'
import { jePlaceholder, slika, video } from '@/lib/media'
import { Labela } from '@/components/ui/Labela'

const HUD_LIJEVO = ['f/2.8', '1/250', 'ISO 400']
const HUD_DESNO = ['Gradiška, BA', 'Est. 2026', 'REC ●']

function UgaoVizira({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`absolute size-[2.2vw] max-md:size-[7vw] text-champagne ${className}`}>
      <path d="M1 9 L1 1 L9 1" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  )
}

export function Vizir() {
  const scope = useGsap<HTMLElement>((mm) => {
    mm.add(BEZ_REDUKCIJE, () => {
      gsap.from('[data-vizir-okvir]', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-vizir]', start: 'top 70%' },
      })
    })
  })

  return (
    <section ref={scope} data-vizir className="w-full bg-black px-[4vw] py-[7vw] max-md:px-[6vw] max-md:py-[16vw]">
      <div className="mb-[2vw] max-md:mb-[6vw] flex justify-between">
        <Labela>Kadar</Labela>
        <Labela>Fokus</Labela>
      </div>

      <div data-vizir-okvir className="relative mx-auto w-[72vw] max-md:w-full">
        <UgaoVizira className="left-[-1vw] top-[-1vw] max-md:left-[-2vw] max-md:top-[-2vw]" />
        <UgaoVizira className="right-[-1vw] top-[-1vw] max-md:right-[-2vw] max-md:top-[-2vw] -scale-x-100" />
        <UgaoVizira className="bottom-[-1vw] left-[-1vw] max-md:bottom-[-2vw] max-md:left-[-2vw] -scale-y-100" />
        <UgaoVizira className="bottom-[-1vw] right-[-1vw] max-md:bottom-[-2vw] max-md:right-[-2vw] rotate-180" />

        <div className="relative aspect-video w-full overflow-hidden">
          {jePlaceholder ? (
            <Image src={slika('vizir', 1600, 900)} alt="Kadar iz snimanja" fill sizes="72vw" className="object-cover" />
          ) : (
            <video
              src={video('vizir')}
              autoPlay muted loop playsInline
              className="h-full w-full object-cover"
            />
          )}

          {/* Krstić u sredini — oznaka fokusa, ne ukras. */}
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[3vw] max-md:size-[10vw] -translate-x-1/2 -translate-y-1/2">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-champagne/50" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-champagne/50" />
          </div>
        </div>

        <div className="mt-[0.8vw] max-md:mt-[3vw] flex justify-between font-body text-[0.7vw] max-md:text-[2.6vw] uppercase tracking-[0.18em] text-champagne">
          <span>{HUD_LIJEVO.join('  ·  ')}</span>
          <span>{HUD_DESNO.join('  ·  ')}</span>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Napiši `src/components/sections/MrezaRadova.tsx`**

Tri reda klize različitim brzinama dok se skrola. Hover otvara uvećani pregled u centru, s naslovom projekta.

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { BEZ_REDUKCIJE, useGsap } from '@/lib/useGsap'
import { slika } from '@/lib/media'
import { radovi } from '@/content/radovi'
import type { Rad } from '@/content/tipovi'

export function MrezaRadova() {
  const [aktivan, postaviAktivan] = useState<Rad | null>(null)

  const scope = useGsap<HTMLElement>((mm, korijen) => {
    mm.add(BEZ_REDUKCIJE, () => {
      korijen.querySelectorAll('[data-red]').forEach((red, i) => {
        gsap.fromTo(
          red,
          { xPercent: i % 2 === 0 ? 0 : -10 },
          {
            xPercent: i % 2 === 0 ? -10 : 0,
            ease: 'none',
            scrollTrigger: { trigger: korijen, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    })
  })

  const redovi = [radovi.slice(0, 7), radovi.slice(7, 13), radovi.slice(13, 19)]

  return (
    <section
      ref={scope}
      className="relative w-full overflow-hidden bg-black py-[4vw] max-md:py-[12vw]"
      onMouseLeave={() => postaviAktivan(null)}
    >
      <div className="flex flex-col gap-[1vw] max-md:gap-[2vw]">
        {redovi.map((red, i) => (
          <div key={i} data-red className="flex w-max gap-[1vw] max-md:gap-[2vw]">
            {red.map((rad) => (
              <button
                key={rad.id}
                type="button"
                onMouseEnter={() => postaviAktivan(rad)}
                onFocus={() => postaviAktivan(rad)}
                className="relative h-[13vw] w-[19vw] max-md:h-[26vw] max-md:w-[38vw] shrink-0 overflow-hidden"
              >
                <Image
                  src={slika(rad.id, 700, 480)}
                  alt={rad.naslov}
                  fill sizes="(max-width: 768px) 38vw, 19vw"
                  className={`object-cover transition-all duration-500 ${
                    aktivan && aktivan.id !== rad.id ? 'brightness-[0.3]' : 'brightness-75'
                  }`}
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Pregled u centru. Ne hvata pokazivač da ne prekine hover ispod. */}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 z-20 w-[38vw] max-md:w-[70vw] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          aktivan ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {aktivan && (
          <>
            <p className="mb-[0.6vw] max-md:mb-[2vw] font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.15em] text-champagne">
              ▶ {aktivan.naslov}
            </p>
            <div className="relative aspect-video w-full overflow-hidden border border-champagne/40">
              <Image
                src={slika(aktivan.id, 1200, 675)}
                alt={aktivan.naslov}
                fill sizes="38vw"
                className="object-cover"
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Napiši `src/components/sections/Intro.tsx`**

```tsx
import { Dugme } from '@/components/ui/Dugme'
import { Labela } from '@/components/ui/Labela'
import { tekstovi } from '@/content/tekstovi'

export function Intro() {
  return (
    <section className="w-full bg-black px-[4vw] py-[7vw] max-md:px-[6vw] max-md:py-[16vw]">
      <Labela>Ko smo</Labela>
      <p className="naslov mt-[1.5vw] max-md:mt-[5vw] max-w-[55vw] max-md:max-w-none text-[3.2vw] max-md:text-[8vw] text-white">
        {tekstovi.intro}
      </p>
      <div className="mt-[2.5vw] max-md:mt-[8vw] flex gap-[1.5vw] max-md:flex-col max-md:items-start max-md:gap-[4vw]">
        <Dugme href="/radovi" varijanta="puno">Vidi radove</Dugme>
        <Dugme href="/o-nama">Kako radimo</Dugme>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Napiši `src/components/sections/GalerijaCTA.tsx`**

```tsx
import { Dugme } from '@/components/ui/Dugme'

export function GalerijaCTA() {
  return (
    <section className="w-full bg-black px-[4vw] py-[6vw] max-md:px-[6vw] max-md:py-[14vw]">
      <div className="flex items-end justify-between gap-[3vw] max-md:flex-col max-md:items-start max-md:gap-[5vw]">
        <h2 className="naslov text-[3.5vw] max-md:text-[9vw] text-white">Ima još.</h2>
        <Dugme href="/radovi" varijanta="puno">Svi radovi</Dugme>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Ubaci sekcije u početnu na tačna mjesta**

```tsx
// src/app/page.tsx
import { Hero } from '@/components/sections/Hero'
import { MarqueeSlika } from '@/components/sections/MarqueeSlika'
import { Statement } from '@/components/sections/Statement'
import { Vizir } from '@/components/sections/Vizir'
import { MrezaRadova } from '@/components/sections/MrezaRadova'
import { Intro } from '@/components/sections/Intro'
import { GalerijaCTA } from '@/components/sections/GalerijaCTA'

export default function Pocetna() {
  return (
    <main>
      <Hero />
      <MarqueeSlika />
      <Statement />
      <Vizir />
      <MrezaRadova />
      <Intro />
      <GalerijaCTA />
    </main>
  )
}
```

- [ ] **Step 6: Provjeri**

Run: `npm run dev`
Expected: okvir vizira ulazi uvećanjem; HUD tekst stoji iznad i ispod kadra; tri reda mreže klize različitim brzinama pri skrolu; hover nad pločicom zatamnjuje ostale i otvara pregled u centru s naslovom. Uključi „Reduce motion" — redovi stoje mirno, hover i dalje radi.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: početna — vizir, paralaksna mreža radova, intro"
```

---

### Task 11: Početna — proces, citat, tri usluge

**Files:**
- Create: `src/components/sections/Proces.tsx`, `src/components/sections/Citat.tsx`, `src/components/sections/TriUsluge.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `useGsap`, `BEZ_REDUKCIJE` (Task 5); `slika` (Task 3); `procesKratko`, `usluge`, `tekstovi` (Task 2); `Dugme` (Task 4)
- Produces: `<Proces>`, `<Citat>`, `<TriUsluge>`

- [ ] **Step 1: Napiši `src/components/sections/Proces.tsx`**

LAYR ovu traku boji crveno preko cijele širine. Kod nas ide navy — šampanj ostaje na tekstu, po pravilu od 10% površine.

```tsx
import { procesKratko } from '@/content/proces'

export function Proces() {
  const traka = [...procesKratko, ...procesKratko]

  return (
    <section className="flex h-[9vw] max-md:h-[22vw] w-full items-center overflow-hidden bg-navy">
      <div className="flex w-max gap-[3vw] max-md:gap-[8vw]" style={{ animation: 'marqueeLijevo 30s linear infinite' }}>
        {traka.map((faza, i) => (
          <span key={`${faza}-${i}`} className="naslov shrink-0 text-[2.6vw] max-md:text-[7vw] text-white">
            <span className="text-champagne">{String((i % procesKratko.length) + 1).padStart(2, '0')}</span>{' '}
            {faza}
          </span>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Napiši `src/components/sections/Citat.tsx`**

```tsx
import { Dugme } from '@/components/ui/Dugme'
import { tekstovi } from '@/content/tekstovi'

export function Citat() {
  return (
    <section className="relative w-full bg-black px-[4vw] py-[10vw] max-md:px-[6vw] max-md:py-[20vw]">
      <span aria-hidden="true" className="naslov absolute left-[4vw] top-[4vw] max-md:left-[6vw] max-md:top-[10vw] text-[12vw] max-md:text-[26vw] leading-none text-champagne">
        &ldquo;
      </span>

      <blockquote className="naslov mx-auto max-w-[60vw] max-md:max-w-none text-center text-[3.2vw] max-md:text-[7.5vw] text-white">
        {tekstovi.citat}
      </blockquote>

      <div className="mt-[3vw] max-md:mt-[10vw] flex justify-center">
        <Dugme href="/o-nama">Kako radimo</Dugme>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Napiši `src/components/sections/TriUsluge.tsx`**

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { slika } from '@/lib/media'
import { usluge } from '@/content/usluge'

export function TriUsluge() {
  const prve = usluge.slice(0, 3)

  return (
    <section className="flex h-[46vw] max-md:h-auto max-md:flex-col w-full bg-black">
      {prve.map((usluga) => (
        <Link
          key={usluga.broj}
          href="/usluge"
          className="group relative flex flex-1 flex-col justify-between overflow-hidden border-r border-white/10 p-[2vw] max-md:h-[80vw] max-md:border-r-0 max-md:border-b max-md:p-[6vw]"
        >
          <Image
            src={slika(`usluga-${usluga.broj}`, 900, 1200)}
            alt=""
            fill sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-25 transition-opacity duration-500 group-hover:opacity-45"
          />

          <div className="relative">
            <p className="font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.15em] text-champagne">
              {usluga.naziv}
            </p>
            <h3 className="naslov mt-[0.6vw] max-md:mt-[2vw] text-[2.6vw] max-md:text-[8vw] text-white">
              {usluga.naslov}
            </h3>
            <p className="mt-[1vw] max-md:mt-[4vw] max-w-[20vw] max-md:max-w-none font-body text-[0.85vw] max-md:text-[3.4vw] text-white/70">
              {usluga.opis}
            </p>
          </div>

          <span
            aria-hidden="true"
            className="naslov relative self-end text-[7vw] max-md:text-[18vw] text-transparent"
            style={{ WebkitTextStroke: '1px var(--color-champagne)' }}
          >
            {usluga.broj}
          </span>
        </Link>
      ))}
    </section>
  )
}
```

- [ ] **Step 4: Dodaj u početnu**

Tri nove sekcije idu **između `Intro` i `GalerijaCTA`**, po redoslijedu iz adaptacije §4.

```tsx
// src/app/page.tsx
import { Hero } from '@/components/sections/Hero'
import { MarqueeSlika } from '@/components/sections/MarqueeSlika'
import { Statement } from '@/components/sections/Statement'
import { Vizir } from '@/components/sections/Vizir'
import { MrezaRadova } from '@/components/sections/MrezaRadova'
import { Intro } from '@/components/sections/Intro'
import { Proces } from '@/components/sections/Proces'
import { Citat } from '@/components/sections/Citat'
import { TriUsluge } from '@/components/sections/TriUsluge'
import { GalerijaCTA } from '@/components/sections/GalerijaCTA'

export default function Pocetna() {
  return (
    <main>
      <Hero />
      <MarqueeSlika />
      <Statement />
      <Vizir />
      <MrezaRadova />
      <Intro />
      <Proces />
      <Citat />
      <TriUsluge />
      <GalerijaCTA />
    </main>
  )
}
```

- [ ] **Step 5: Provjeri**

Run: `npm run dev`
Expected: navy traka klizi; brojevi 01–03 su obrisni u šampanju; slika u koloni posvjetli na hover. Na mobilnom kolone se slažu vertikalno.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: početna — proces traka, citat, tri usluge"
```

---

### Task 12: Početna — rokovi, CTA

**Files:**
- Create: `src/components/sections/Rokovi.tsx`, `src/components/sections/CTA.tsx`, `src/components/sections/Testimonijali.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Broj`, `Okvir` (Task 4); `rokovi`, `testimonijali`, `tekstovi` (Task 2)
- Produces: `<Rokovi>`, `<CTA>`, `<Testimonijali>`

- [ ] **Step 1: Napiši `src/components/sections/Rokovi.tsx`**

Ovo je slot gdje LAYR ima izmišljene milione. Kod nas stoje tačne brojke iz Produkcijskog Procesa.

```tsx
import { Broj } from '@/components/ui/Broj'
import { rokovi } from '@/content/rokovi'
import { tekstovi } from '@/content/tekstovi'

export function Rokovi() {
  return (
    <section className="w-full bg-cream px-[4vw] py-[8vw] max-md:px-[6vw] max-md:py-[16vw]">
      <div className="relative">
        <h2 className="naslov text-[13vw] max-md:text-[22vw] leading-none text-black">
          {tekstovi.rokoviNaslov}
        </h2>

        {tekstovi.rokoviNaljepnice.map((naljepnica, i) => (
          <span
            key={naljepnica}
            className="absolute bg-champagne px-[0.6vw] py-[0.2vw] max-md:px-[2.5vw] max-md:py-[1vw] font-body text-[0.85vw] max-md:text-[3vw] uppercase tracking-[0.08em] text-black"
            style={{ top: `${25 + i * 26}%`, left: `${12 + i * 26}%`, transform: `rotate(${i % 2 ? 2 : -2}deg)` }}
          >
            {naljepnica}
          </span>
        ))}
      </div>

      <div className="mt-[5vw] max-md:mt-[14vw] grid grid-cols-4 gap-[2vw] max-md:grid-cols-2 max-md:gap-[8vw] border-t border-dashed border-black/25 pt-[3vw] max-md:pt-[10vw]">
        {rokovi.map((rok) => (
          <div key={rok.vrijednost} className="[&_span:last-child]:text-black/60">
            <Broj vrijednost={rok.vrijednost} opis={rok.opis} />
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Napiši `src/components/sections/Testimonijali.tsx`**

Sekcija se ne renderuje dok niz je prazan. To je struktura koja sprječava izmišljene preporuke.

```tsx
import { testimonijali } from '@/content/testimonijali'

export function Testimonijali() {
  if (testimonijali.length === 0) return null

  return (
    <section className="w-full bg-cream px-[4vw] py-[6vw] max-md:px-[6vw] max-md:py-[14vw]">
      <div className="flex flex-col gap-[3vw] max-md:gap-[10vw]">
        {testimonijali.map((t) => (
          <figure key={t.ime} className="border border-dashed border-black/25 p-[2vw] max-md:p-[6vw]">
            <blockquote className="naslov text-[2vw] max-md:text-[6vw] text-black">{t.citat}</blockquote>
            <figcaption className="mt-[1.5vw] max-md:mt-[5vw] font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.12em] text-black/60">
              [ {t.ime} — {t.uloga} ]
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Napiši `src/components/sections/CTA.tsx`**

```tsx
import { tekstovi } from '@/content/tekstovi'

export function CTA() {
  return (
    <section className="w-full bg-cream px-[4vw] pb-[6vw] max-md:px-[6vw] max-md:pb-[14vw]">
      <div className="flex items-end justify-between gap-[3vw] border-t border-black/15 pt-[3vw] max-md:flex-col max-md:items-start max-md:gap-[6vw] max-md:pt-[10vw]">
        <p className="font-body text-[2vw] max-md:text-[6vw] text-black/70">{tekstovi.cta.naslov}</p>
        <a
          href={`mailto:${tekstovi.cta.email}`}
          className="font-body text-[1.8vw] max-md:text-[5vw] text-black hover:text-champagne"
        >
          {tekstovi.cta.email}
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Dopuni početnu**

Tri nove sekcije idu **na kraj**, poslije `GalerijaCTA`. Konačan redoslijed:

```tsx
<main>
  <Hero />
  <MarqueeSlika />
  <Statement />
  <Vizir />
  <MrezaRadova />
  <Intro />
  <Proces />
  <Citat />
  <TriUsluge />
  <GalerijaCTA />
  <Rokovi />
  <Testimonijali />
  <CTA />
</main>
```

Dodaj i uvoze za `Rokovi`, `Testimonijali` i `CTA` iz `@/components/sections/`.

- [ ] **Step 5: Provjeri**

Run: `npm run dev`
Expected: „Rokovi" ide skoro preko cijele širine; naljepnice su blago zarotirane; četiri broja stoje u šampanju; sekcija testimonijala se **ne pojavljuje**. Dodaj privremeno jedan objekat u `testimonijali.ts` da potvrdiš da se pojavi, pa ga vrati na prazno.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: početna — rokovi, uslovna sekcija preporuka, CTA"
```

---

### Task 13: Stranica usluga s pinovanim panelima

**Files:**
- Create: `src/components/usluge/PinPanel.tsx`, `src/components/usluge/Paketi.tsx`
- Modify: `src/app/usluge/page.tsx`

**Interfaces:**
- Consumes: `useGsap`, `BEZ_REDUKCIJE` (Task 5); `slika` (Task 3); `usluge`, `paketi`, `rokovi`, `tekstovi` (Task 2); `Labela`, `Okvir`, `Broj` (Task 4)
- Produces: `<PinPanel usluga>`, `<Paketi>`

- [ ] **Step 1: Napiši `src/components/usluge/PinPanel.tsx`**

```tsx
'use client'

import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGsap } from '@/lib/useGsap'
import { slika } from '@/lib/media'
import { Labela } from '@/components/ui/Labela'
import type { Usluga } from '@/content/tipovi'

const NA_DESKTOPU = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'

export function PinPanel({ usluga, ukupno, redoslijed }: { usluga: Usluga; ukupno: number; redoslijed: number }) {
  const scope = useGsap<HTMLElement>((mm, korijen) => {
    mm.add(NA_DESKTOPU, () => {
      // pinSpacing: false znači da sljedeći panel klizi preko ovog,
      // pa se paneli slažu jedan na drugi umjesto da se nižu.
      ScrollTrigger.create({
        trigger: korijen,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: false,
      })

      gsap.from(korijen.querySelector('[data-panel-sadrzaj]'), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: korijen, start: 'top 60%' },
      })
    })
  })

  return (
    <section
      ref={scope}
      data-panel
      style={{ zIndex: redoslijed }}
      className="relative h-screen w-full overflow-hidden bg-black max-md:h-auto max-md:min-h-[120vw]"
    >
      <Image
        src={slika(`usluga-${usluga.broj}`, 1920, 1080)}
        alt=""
        fill sizes="100vw"
        className="object-cover brightness-[0.4]"
      />

      <div data-panel-sadrzaj className="relative flex h-full flex-col justify-end p-[4vw] max-md:p-[6vw] max-md:pt-[25vw]">
        <div className="flex items-end gap-[2vw] max-md:flex-col max-md:items-start max-md:gap-[5vw]">
          <span className="naslov text-[7vw] max-md:text-[20vw] leading-none text-champagne">
            {usluga.broj}
            <span className="font-body text-[1.2vw] max-md:text-[4vw] text-white/50">/{String(ukupno).padStart(2, '0')}</span>
          </span>

          <div className="flex-1 border-l border-white/20 pl-[2vw] max-md:border-l-0 max-md:pl-0">
            <h2 className="naslov text-[2.4vw] max-md:text-[8vw] text-white">{usluga.naziv}</h2>
            <p className="mt-[0.8vw] max-md:mt-[3vw] max-w-[26vw] max-md:max-w-none font-body text-[0.9vw] max-md:text-[3.5vw] text-white/75">
              {usluga.opis}
            </p>
          </div>

          <div className="max-w-[24vw] max-md:max-w-none">
            <Labela>Šta je uključeno</Labela>
            <ul className="mt-[0.8vw] max-md:mt-[3vw] flex flex-wrap justify-end gap-[0.5vw] max-md:justify-start max-md:gap-[2vw]">
              {usluga.ukljuceno.map((stavka) => (
                <li key={stavka} className="border border-white/25 px-[0.8vw] py-[0.35vw] max-md:px-[3.5vw] max-md:py-[2vw] font-body text-[0.75vw] max-md:text-[3vw] uppercase tracking-[0.06em] text-white">
                  {stavka}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Napiši `src/components/usluge/Paketi.tsx`**

```tsx
import { Okvir } from '@/components/ui/Okvir'
import { Labela } from '@/components/ui/Labela'
import { paketi } from '@/content/paketi'

export function Paketi() {
  return (
    <section className="w-full bg-cream px-[4vw] py-[7vw] max-md:px-[6vw] max-md:py-[16vw]">
      <Labela>Paketi za firme</Labela>
      <h2 className="naslov mt-[1vw] max-md:mt-[4vw] text-[4vw] max-md:text-[10vw] text-black">
        Tri paketa. Srednji pokriva većinu.
      </h2>

      <div className="mt-[4vw] max-md:mt-[12vw] grid grid-cols-3 gap-[2vw] max-md:grid-cols-1 max-md:gap-[8vw]">
        {paketi.map((paket) => (
          <Okvir key={paket.naziv} className="block">
            <div className={`flex h-full flex-col p-[2vw] max-md:p-[6vw] ${paket.istaknut ? 'bg-black text-white' : 'border border-black/15 text-black'}`}>
              <h3 className={`naslov text-[2.2vw] max-md:text-[7vw] ${paket.istaknut ? 'text-champagne' : 'text-black'}`}>
                {paket.naziv}
              </h3>
              <p className={`mt-[0.4vw] max-md:mt-[2vw] font-body text-[0.85vw] max-md:text-[3.2vw] ${paket.istaknut ? 'text-white/60' : 'text-black/60'}`}>
                {paket.zaKoga}
              </p>
              <p className="naslov mt-[1.5vw] max-md:mt-[5vw] text-[3vw] max-md:text-[9vw]">
                {paket.cijena} <span className="text-[1.2vw] max-md:text-[4vw]">KM</span>
              </p>
              <ul className="mt-[1.5vw] max-md:mt-[5vw] flex flex-col gap-[0.5vw] max-md:gap-[2vw]">
                {paket.stavke.map((s) => (
                  <li key={s} className={`font-body text-[0.85vw] max-md:text-[3.4vw] ${paket.istaknut ? 'text-white/80' : 'text-black/75'}`}>
                    <span className="text-champagne">—</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </Okvir>
        ))}
      </div>

      <p className="mt-[2vw] max-md:mt-[8vw] font-body text-[0.8vw] max-md:text-[3vw] text-black/50">
        Cijene su za zonu Gradiška +30 km. Banja Luka i Prijedor: +50 KM.
      </p>
    </section>
  )
}
```

- [ ] **Step 3: Napiši `src/app/usluge/page.tsx`**

```tsx
import { PinPanel } from '@/components/usluge/PinPanel'
import { Paketi } from '@/components/usluge/Paketi'
import { Broj } from '@/components/ui/Broj'
import { Labela } from '@/components/ui/Labela'
import { usluge } from '@/content/usluge'
import { rokovi } from '@/content/rokovi'
import { tekstovi } from '@/content/tekstovi'

export const metadata = {
  title: 'Usluge — NextPixel Media',
  description: 'Sadržaj za firme, nekretnine, dron, eventi, sport. Gradiška i Banja Luka.',
}

export default function Usluge() {
  return (
    <main>
      <header className="flex min-h-screen flex-col justify-center px-[4vw] pt-[10vw] pb-[4vw] max-md:px-[6vw] max-md:pt-[30vw]">
        <div className="flex justify-end">
          <ul className="text-right">
            <li><Labela>Naše usluge</Labela></li>
            {usluge.map((u) => (
              <li key={u.broj} className="font-body text-[0.85vw] max-md:text-[3vw] uppercase tracking-[0.1em] text-gray">
                [ {u.naziv} ] [ {u.broj} ]
              </li>
            ))}
          </ul>
        </div>

        <h1 className="naslov mt-[3vw] max-md:mt-[10vw] text-[7vw] max-md:text-[13vw] text-white">
          {tekstovi.uslugeHero}
        </h1>

        <div className="mt-[5vw] max-md:mt-[14vw] grid grid-cols-4 gap-[2vw] max-md:grid-cols-2 max-md:gap-[6vw]">
          {rokovi.map((r) => <Broj key={r.vrijednost} vrijednost={r.vrijednost} opis={r.opis} />)}
        </div>
      </header>

      {usluge.map((u, i) => (
        <PinPanel key={u.broj} usluga={u} ukupno={usluge.length} redoslijed={i + 1} />
      ))}

      <Paketi />
    </main>
  )
}
```

- [ ] **Step 4: Provjeri**

Run: `npm run dev`, otvori `/usluge`.
Expected: šest panela puni ekran, sadržaj svakog dolazi odozdo pri ulasku; srednji paket je tamna kartica; brojevi 01/06 … 06/06.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: stranica usluga sa panelima i paketima"
```

---

### Task 14: Galerija radova s drag mrežom

**Files:**
- Create: `src/components/radovi/Filter.tsx`, `src/components/radovi/DragMreza.tsx`
- Modify: `src/app/radovi/page.tsx`

**Interfaces:**
- Consumes: `Observer`, `gsap` (Task 5); `slika` (Task 3); `radovi`, `KATEGORIJE` (Task 2)
- Produces: `<Filter aktivna promijeni>`, `<DragMreza stavke>`

- [ ] **Step 1: Napiši `src/components/radovi/Filter.tsx`**

```tsx
'use client'

import { Labela } from '@/components/ui/Labela'
import { KATEGORIJE } from '@/content/radovi'
import type { Kategorija } from '@/content/tipovi'

type Props = { aktivna: Kategorija | 'SVE'; promijeni: (k: Kategorija | 'SVE') => void }

export function Filter({ aktivna, promijeni }: Props) {
  const opcije: (Kategorija | 'SVE')[] = ['SVE', ...KATEGORIJE]

  return (
    <div className="fixed bottom-[2vw] left-1/2 z-50 -translate-x-1/2 border border-white/15 bg-black/85 px-[1.5vw] py-[1vw] backdrop-blur max-md:bottom-[4vw] max-md:w-[88vw] max-md:px-[4vw] max-md:py-[4vw]">
      <Labela>Filter</Labela>
      <div className="mt-[0.6vw] max-md:mt-[3vw] flex flex-wrap gap-[0.5vw] max-md:gap-[2vw]">
        {opcije.map((opcija) => (
          <button
            key={opcija} type="button" onClick={() => promijeni(opcija)}
            className={`px-[0.9vw] py-[0.4vw] max-md:px-[3.5vw] max-md:py-[2vw] font-body text-[0.75vw] max-md:text-[3vw] uppercase tracking-[0.08em] transition-colors ${
              aktivna === opcija ? 'bg-champagne text-black' : 'text-gray hover:text-white'
            }`}
          >
            {opcija}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Napiši `src/components/radovi/DragMreza.tsx`**

Beskonačnost dolazi iz `gsap.utils.wrap`. Ključ je da se **jedna ploča ponovi četiri puta u rasporedu 2×2**, pa omotavanje po obje ose nema šav. Ćelije se pozicioniraju apsolutno, jer tada su širina i visina ploče poznat broj, a ne nešto što se mjeri iz layouta.

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap, Observer } from '@/lib/gsap'
import { BEZ_REDUKCIJE, useGsap } from '@/lib/useGsap'
import { slika } from '@/lib/media'
import type { Rad } from '@/content/tipovi'

// Sve mjere u vw. Korak uključuje razmak, pa ploče naliježu bez šava.
const DESKTOP = { kolone: 4, sirina: 22, visina: 16, razmak: 1 }
const MOBILNI = { kolone: 2, sirina: 44, visina: 30, razmak: 2 }

const KOPIJE = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
] as const

export function DragMreza({ stavke }: { stavke: Rad[] }) {
  const pomak = useRef({ x: 0, y: 0 })
  const [jeMobilni, postaviMobilni] = useState(false)

  useEffect(() => {
    const upit = window.matchMedia('(max-width: 767px)')
    const osvjezi = () => postaviMobilni(upit.matches)
    osvjezi()
    upit.addEventListener('change', osvjezi)
    return () => upit.removeEventListener('change', osvjezi)
  }, [])

  const r = jeMobilni ? MOBILNI : DESKTOP
  const korakX = r.sirina + r.razmak
  const korakY = r.visina + r.razmak
  const redova = Math.ceil(stavke.length / r.kolone)
  const plocaSirina = r.kolone * korakX // vw
  const plocaVisina = redova * korakY // vw

  const scope = useGsap<HTMLDivElement>(
    (mm, korijen) => {
      mm.add(BEZ_REDUKCIJE, () => {
        const platno = korijen.querySelector('[data-platno]') as HTMLElement | null
        if (!platno) return

        let omotajX = (v: number) => v
        let omotajY = (v: number) => v

        const izracunaj = () => {
          const vw = window.innerWidth / 100
          omotajX = gsap.utils.wrap(-plocaSirina * vw, 0)
          omotajY = gsap.utils.wrap(-plocaVisina * vw, 0)
        }

        const nacrtaj = () => {
          gsap.set(platno, { x: omotajX(pomak.current.x), y: omotajY(pomak.current.y) })
        }

        const naPromjenuVelicine = () => {
          izracunaj()
          nacrtaj()
        }

        izracunaj()
        nacrtaj()
        window.addEventListener('resize', naPromjenuVelicine)

        const posmatrac = Observer.create({
          target: korijen,
          type: 'wheel,touch,pointer',
          onChange: (self) => {
            pomak.current.x += self.deltaX * -1
            pomak.current.y += self.deltaY * -1
            nacrtaj()
          },
        })

        return () => {
          window.removeEventListener('resize', naPromjenuVelicine)
          posmatrac.kill()
        }
      })
    },
    [stavke.length, jeMobilni],
  )

  return (
    <div ref={scope} className="relative h-screen w-full overflow-hidden touch-none md:cursor-grab">
      <div data-platno className="absolute left-0 top-0 will-change-transform">
        {KOPIJE.map(([kx, ky]) =>
          stavke.map((rad, i) => (
            <figure
              key={`${kx}-${ky}-${rad.id}`}
              className="group absolute overflow-hidden"
              style={{
                left: `${kx * plocaSirina + (i % r.kolone) * korakX}vw`,
                top: `${ky * plocaVisina + Math.floor(i / r.kolone) * korakY}vw`,
                width: `${r.sirina}vw`,
                height: `${r.visina}vw`,
              }}
            >
              <Image
                src={slika(rad.id, 700, 500)}
                alt={rad.naslov}
                fill
                sizes={jeMobilni ? '44vw' : '22vw'}
                draggable={false}
                className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-[0.8vw] max-md:p-[2vw] font-body text-[0.7vw] max-md:text-[2.4vw] uppercase tracking-[0.08em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {rad.naslov}
              </figcaption>
            </figure>
          )),
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Napiši `src/app/radovi/page.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { DragMreza } from '@/components/radovi/DragMreza'
import { Filter } from '@/components/radovi/Filter'
import { radovi } from '@/content/radovi'
import { tekstovi } from '@/content/tekstovi'
import type { Kategorija } from '@/content/tipovi'

export default function Radovi() {
  const [aktivna, postaviAktivnu] = useState<Kategorija | 'SVE'>('SVE')
  const vidljivi = aktivna === 'SVE' ? radovi : radovi.filter((r) => r.kategorija === aktivna)

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center">
        <h1 className="naslov text-[6vw] max-md:text-[14vw] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
          {tekstovi.radoviHero.naslov}
        </h1>
        <p className="font-body text-[1vw] max-md:text-[3.6vw] uppercase tracking-[0.15em] text-white/70">
          {tekstovi.radoviHero.opis}
        </p>
      </div>

      <DragMreza key={aktivna} stavke={vidljivi} />
      <Filter aktivna={aktivna} promijeni={postaviAktivnu} />
    </main>
  )
}
```

> `key={aktivna}` prisiljava remount pri promjeni filtera, pa se `Observer` i omotavanje ponovo izračunaju za novi broj stavki.

- [ ] **Step 4: Napravi `src/app/radovi/layout.tsx` za metapodatke**

Stranica je klijentska, pa metapodaci idu u layout:

```tsx
export const metadata = {
  title: 'Radovi — NextPixel Media',
  description: 'Izbor onoga što smo snimili — firme, nekretnine, eventi, sport, dron.',
}

export default function RadoviLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

- [ ] **Step 5: Provjeri**

Run: `npm run dev`, otvori `/radovi`.
Expected: mreža se pomjera mišem, wheel-om i prstom; nema vidljivog šava pri omotavanju; slike su sive dok hover ne vrati boju; filter mijenja broj stavki.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: galerija sa beskonačnom drag mrežom i filterima"
```

---

### Task 15: O nama, uslovi, privatnost

**Files:**
- Modify: `src/app/o-nama/page.tsx`, `src/app/uslovi/page.tsx`, `src/app/privatnost/page.tsx`
- Create: `src/content/uslovi.ts`

**Interfaces:**
- Consumes: `proces`, `ekipa`, `tekstovi` (Task 2); `slika` (Task 3); `Labela`, `Dugme` (Task 4)
- Produces: `uslovi` niz `{ naslov, tekst }`

- [ ] **Step 1: Napiši `src/content/uslovi.ts`**

Tekst dolazi doslovno iz `docs/brend/NextPixel Media - Uslovi, Prava Koristenja i Arhiva.md` §15. Ne prepisuj ga svojim riječima.

```ts
export const uslovi = [
  { naslov: 'Rezervacija termina', tekst: 'Termin je rezervisan nakon uplate avansa. Avans za evente iznosi 50%, za ostale poslove 30–50% zavisno od vrijednosti.' },
  { naslov: 'Otkazivanje', tekst: 'Otkazivanje više od 14 dana prije termina — avans se vraća u cijelosti. Od 7 do 14 dana — avans se prenosi na novi termin. Manje od 7 dana — avans se ne vraća. Ako mi otkažemo iz bilo kojeg razloga, avans se vraća u cijelosti.' },
  { naslov: 'Pomjeranje termina', tekst: 'Jedno pomjeranje je besplatno ako je najavljeno više od 7 dana unaprijed. Svako sljedeće se naplaćuje 100 KM.' },
  { naslov: 'Vremenski uslovi', tekst: 'Vazdušno (dron) snimanje zavisi od vremenskih uslova i zakonskih ograničenja na lokaciji. Ako let nije moguć, vazdušni dio se nadoknađuje u dodatnom terminu ili se odbija od cijene. Ostatak snimanja se izvodi po planu.' },
  { naslov: 'Isporuka', tekst: 'Izbor od 10–15 fotografija isporučuje se u roku od 48 sati. Kompletne fotografije u roku od 7 dana, video u roku od 14 dana, računajući od dana snimanja.' },
  { naslov: 'Broj fotografija', tekst: 'Broj obrađenih fotografija naveden je u ponudi i fiksan je. Dodatne fotografije se mogu naručiti po 10 KM po komadu.' },
  { naslov: 'Neobrađeni materijal', tekst: 'Neobrađene (RAW) fotografije i sirovi video materijal se ne isporučuju. Obrada je sastavni dio usluge.' },
  { naslov: 'Korekcije', tekst: 'Uključena je jedna runda korekcija, do 5 fotografija ili jedna izmjena na videu. Primjedbe se dostavljaju u roku od 7 dana od isporuke. Dodatna runda se naplaćuje 100 KM.' },
  { naslov: 'Prava korištenja', tekst: 'Klijent dobija trajno pravo korištenja isporučenog materijala za vlastite društvene mreže, sajt i marketinške materijale. Korištenje u plaćenom oglašavanju, na bilbordima, u TV kampanjama ili velikom formatu naplaćuje se dodatno (+50%). Preprodaja i ustupanje materijala trećim licima nisu dozvoljeni.' },
  { naslov: 'Autorska prava', tekst: 'Autorska prava ostaju kod NextPixel Media. Klijent dobija pravo korištenja u gore navedenom obimu.' },
  { naslov: 'Portfolio', tekst: 'NextPixel Media zadržava pravo korištenja materijala u vlastitom portfoliju i na društvenim mrežama. Kod privatnih proslava i snimaka s djecom dozvola se traži posebno. Klijent može ovo pravo isključiti — dovoljno je da to napomene.' },
  { naslov: 'Arhiva', tekst: 'Isporučeni materijal se čuva 12 mjeseci, sirovi materijal 3 mjeseca. Preporučujemo da materijal preuzmete i sačuvate kod sebe.' },
  { naslov: 'Plaćanje', tekst: 'Rok plaćanja je 7 dana od datuma fakture.' },
  { naslov: 'Odgovornost', tekst: 'Ukupna odgovornost NextPixel Media ograničena je na iznos plaćen za konkretan posao.' },
] as const
```

- [ ] **Step 2: Napiši `src/app/o-nama/page.tsx`**

```tsx
import Image from 'next/image'
import { Dugme } from '@/components/ui/Dugme'
import { Labela } from '@/components/ui/Labela'
import { slika } from '@/lib/media'
import { proces } from '@/content/proces'
import { ekipa } from '@/content/ekipa'
import { tekstovi } from '@/content/tekstovi'

export const metadata = {
  title: 'O nama — NextPixel Media',
  description: 'Dvoje ljudi, jedan do dva posla mjesečno, i proces koji se ne preskače.',
}

export default function ONama() {
  return (
    <main className="px-[4vw] pt-[10vw] pb-[6vw] max-md:px-[6vw] max-md:pt-[30vw] max-md:pb-[14vw]">
      <Labela>Ko smo</Labela>
      <h1 className="naslov mt-[1vw] max-md:mt-[4vw] max-w-[60vw] max-md:max-w-none text-[4.5vw] max-md:text-[10vw] text-white">
        {tekstovi.oNama}
      </h1>
      <p className="mt-[2vw] max-md:mt-[6vw] max-w-[40vw] max-md:max-w-none font-body text-[1vw] max-md:text-[4vw] text-white/70">
        {tekstovi.intro}
      </p>

      <section className="mt-[7vw] max-md:mt-[18vw]">
        <Labela>Šest faza svakog posla</Labela>
        <ul className="mt-[2vw] max-md:mt-[6vw] flex flex-col">
          {proces.map((faza) => (
            <li key={faza.broj} className="group flex items-baseline gap-[2vw] max-md:gap-[4vw] border-t border-white/10 py-[1.4vw] max-md:py-[5vw]">
              <span className="naslov text-[1.6vw] max-md:text-[5vw] text-champagne">{faza.broj}</span>
              <span aria-hidden="true" className="text-champagne">→</span>
              <span className="naslov text-[2.2vw] max-md:text-[6vw] text-white transition-colors group-hover:text-champagne">
                {faza.tekst}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-[7vw] max-md:mt-[18vw]">
        <Labela>Ekipa</Labela>
        <div className="mt-[2vw] max-md:mt-[6vw] grid grid-cols-2 gap-[2vw] max-md:grid-cols-1 max-md:gap-[8vw]">
          {ekipa.map((clan) => (
            <article key={clan.slikaId}>
              <div className="relative h-[24vw] max-md:h-[80vw] w-full overflow-hidden">
                <Image src={slika(clan.slikaId, 800, 1000)} alt={clan.ime} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover grayscale" />
              </div>
              <h3 className="naslov mt-[1vw] max-md:mt-[4vw] text-[1.8vw] max-md:text-[6vw] text-white">{clan.ime}</h3>
              <p className="font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.12em] text-champagne">[ {clan.uloga} ]</p>
              <p className="mt-[0.6vw] max-md:mt-[2vw] font-body text-[0.9vw] max-md:text-[3.5vw] text-white/70">{clan.opis}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-[5vw] max-md:mt-[14vw]">
        <Dugme href="/usluge" varijanta="puno">Vidi usluge</Dugme>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Napiši `src/app/uslovi/page.tsx`**

```tsx
import { Labela } from '@/components/ui/Labela'
import { uslovi } from '@/content/uslovi'

export const metadata = {
  title: 'Uslovi saradnje — NextPixel Media',
  description: 'Rezervacija, otkazivanje, isporuka, prava korištenja i arhiva.',
}

export default function Uslovi() {
  return (
    <main className="px-[4vw] pt-[10vw] pb-[6vw] max-md:px-[6vw] max-md:pt-[30vw] max-md:pb-[14vw]">
      <Labela>Uslovi</Labela>
      <h1 className="naslov mt-[1vw] max-md:mt-[4vw] text-[4vw] max-md:text-[10vw] text-white">Uslovi saradnje</h1>

      <dl className="mt-[4vw] max-md:mt-[12vw] max-w-[55vw] max-md:max-w-none">
        {uslovi.map((stavka) => (
          <div key={stavka.naslov} className="border-t border-white/10 py-[1.5vw] max-md:py-[6vw]">
            <dt className="naslov text-[1.4vw] max-md:text-[5vw] text-champagne">{stavka.naslov}</dt>
            <dd className="mt-[0.5vw] max-md:mt-[2vw] font-body text-[0.95vw] max-md:text-[3.6vw] leading-relaxed text-white/75">
              {stavka.tekst}
            </dd>
          </div>
        ))}
      </dl>
    </main>
  )
}
```

- [ ] **Step 4: Napiši `src/app/privatnost/page.tsx`**

Sadržaj slijedi Uslovi §11 — lica na snimcima i dron.

```tsx
import { Labela } from '@/components/ui/Labela'

export const metadata = {
  title: 'Privatnost — NextPixel Media',
  description: 'Lica na snimcima, snimanje djece, dron i privatnost.',
}

const odjeljci = [
  {
    naslov: 'Podaci koje prikupljamo',
    tekst: 'Kroz kontakt formu prikupljamo ime, kontakt podatak i opis posla. Koristimo ih isključivo da odgovorimo na upit i pošaljemo ponudu. Ne prodajemo ih i ne prosljeđujemo trećim licima.',
  },
  {
    naslov: 'Lica na snimcima',
    tekst: 'Na javnim događajima snimamo prostor i atmosferu. Ako ne želiš da se pojaviš na snimku, javi nam na licu mjesta ili naknadno na nikola@nextpixel.media i uklonićemo materijal.',
  },
  {
    naslov: 'Snimanje djece',
    tekst: 'Za objavu snimaka na kojima su djeca tražimo izričitu dozvolu roditelja ili staratelja prije objave, bez izuzetka.',
  },
  {
    naslov: 'Dron i privatnost',
    tekst: 'Vazdušno snimanje izvodimo u skladu s propisima i uz dozvolu vlasnika objekta. Ne snimamo tuđe posjede bez dozvole i ne letimo iznad okupljene mase ljudi.',
  },
  {
    naslov: 'Arhiva',
    tekst: 'Isporučeni materijal čuvamo 12 mjeseci, sirovi materijal 3 mjeseca. Nakon toga se briše.',
  },
  {
    naslov: 'Kolačići',
    tekst: 'Sajt ne koristi kolačiće za praćenje niti reklamne mreže.',
  },
]

export default function Privatnost() {
  return (
    <main className="px-[4vw] pt-[10vw] pb-[6vw] max-md:px-[6vw] max-md:pt-[30vw] max-md:pb-[14vw]">
      <Labela>Privatnost</Labela>
      <h1 className="naslov mt-[1vw] max-md:mt-[4vw] text-[4vw] max-md:text-[10vw] text-white">Privatnost</h1>

      <dl className="mt-[4vw] max-md:mt-[12vw] max-w-[55vw] max-md:max-w-none">
        {odjeljci.map((o) => (
          <div key={o.naslov} className="border-t border-white/10 py-[1.5vw] max-md:py-[6vw]">
            <dt className="naslov text-[1.4vw] max-md:text-[5vw] text-champagne">{o.naslov}</dt>
            <dd className="mt-[0.5vw] max-md:mt-[2vw] font-body text-[0.95vw] max-md:text-[3.6vw] leading-relaxed text-white/75">{o.tekst}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-[3vw] max-md:mt-[10vw] font-body text-[0.8vw] max-md:text-[3vw] text-gray">
        Ovaj tekst nije pravni savjet. Provjeri ga kod pravnika prije objave sajta.
      </p>
    </main>
  )
}
```

- [ ] **Step 5: Provjeri**

Run: `npm run dev`
Expected: `/o-nama` prikazuje šest faza i dva člana ekipe; `/uslovi` prikazuje 14 stavki; `/privatnost` šest odjeljaka.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: o nama, uslovi saradnje i privatnost"
```

---

### Task 16: Preloader

**Files:**
- Create: `src/components/layout/Preloader.tsx`
- Modify: `src/app/layout.tsx`, `src/styles/globals.css`

**Interfaces:**
- Consumes: `useGsap`, `BEZ_REDUKCIJE` (Task 5)
- Produces: `<Preloader>`

- [ ] **Step 1: Napiši `src/components/layout/Preloader.tsx`**

Monogram i četiri fokus-ugla se iscrtavaju, pa cijeli mark prelazi iz blur u oštrinu. Prikazuje se jednom po sesiji — LAYR ga pušta na svakom loadu i to je njihova najslabija UX tačka.

```tsx
'use client'

import { useEffect, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { BEZ_REDUKCIJE, useGsap } from '@/lib/useGsap'

const KLJUC = 'npm-preloader-vidjen'

export function Preloader() {
  const [prikazi, postaviPrikazi] = useState(false)
  const [gotovo, postaviGotovo] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(KLJUC)) return
    sessionStorage.setItem(KLJUC, '1')
    postaviPrikazi(true)
  }, [])

  const scope = useGsap(
    (mm) => {
      if (!prikazi) return

      mm.add(BEZ_REDUKCIJE, () => {
        const vremenska = gsap.timeline({ onComplete: () => postaviGotovo(true) })

        vremenska
          .set('[data-crtez] path, [data-crtez] line', { strokeDasharray: 200, strokeDashoffset: 200 })
          .to('[data-crtez] path, [data-crtez] line', {
            strokeDashoffset: 0, duration: 1, stagger: 0.06, ease: 'power2.inOut',
          })
          .from('[data-tacka]', { scale: 0, opacity: 0, duration: 0.3, stagger: 0.05, ease: 'back.out(2)' }, '-=0.3')
          .fromTo('[data-mark]', { filter: 'blur(6px)' }, { filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' })
          .to('[data-zavjesa]', { yPercent: -100, duration: 0.7, ease: 'power3.inOut' }, '+=0.2')
      })

      // Kad je pokret isključen, zavjesa nestaje odmah.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        postaviGotovo(true)
      })
    },
    [prikazi],
  )

  if (!prikazi || gotovo) return null

  return (
    <div ref={scope} className="fixed inset-0 z-[99999]" aria-hidden="true">
      <div data-zavjesa className="flex h-full w-full flex-col items-center justify-center bg-black">
        <div data-mark className="relative">
          <svg data-crtez viewBox="0 0 120 120" className="h-[14vw] w-[14vw] max-md:h-[40vw] max-md:w-[40vw]">
            {/* N */}
            <path d="M35 82 L35 38 L62 72 L62 38" stroke="#F5F5F3" strokeWidth="4" fill="none" strokeLinecap="square" />
            {/* P */}
            <path d="M72 82 L72 38 L86 38 A11 11 0 0 1 86 60 L72 60" stroke="#C6A96B" strokeWidth="4" fill="none" strokeLinecap="square" />
            {/* fokus uglovi */}
            <path d="M8 26 L8 8 L26 8" stroke="#C6A96B" strokeWidth="2.5" fill="none" />
            <path d="M94 8 L112 8 L112 26" stroke="#C6A96B" strokeWidth="2.5" fill="none" />
            <path d="M112 94 L112 112 L94 112" stroke="#C6A96B" strokeWidth="2.5" fill="none" />
            <path d="M26 112 L8 112 L8 94" stroke="#C6A96B" strokeWidth="2.5" fill="none" />
            {/* fokus tačke */}
            <circle data-tacka cx="60" cy="8" r="2" fill="#C6A96B" />
            <circle data-tacka cx="112" cy="60" r="2" fill="#C6A96B" />
            <circle data-tacka cx="60" cy="112" r="2" fill="#C6A96B" />
            <circle data-tacka cx="8" cy="60" r="2" fill="#C6A96B" />
          </svg>
        </div>

        <p className="mt-[2vw] max-md:mt-[8vw] font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.25em] text-gray">
          [ Fokus ]
        </p>
      </div>
    </div>
  )
}
```

> Ovaj SVG je privremen. Kad stigne produkcijski monogram iz Logo Guide-a §8, zamijeni `path` podatke — animacija ostaje ista jer radi nad svim `path` elementima.

- [ ] **Step 2: Ubaci u layout**

Preloader ide prije `Nav`, unutar `SmoothScroll`:

```tsx
<SmoothScroll>
  <Preloader />
  <Nav />
  {children}
  <Footer />
</SmoothScroll>
```

- [ ] **Step 3: Provjeri**

Run: `npm run dev`
Expected: pri prvom otvaranju monogram se iscrtava, tačke uskaču, mark izoštri i zavjesa ode gore. Osvježi stranicu — preloader se **ne pojavljuje ponovo**. Otvori novi anonimni prozor — pojavi se opet. Uključi „Reduce motion" — stranica se prikazuje odmah.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: preloader sa iscrtavanjem monograma, jednom po sesiji"
```

---

### Task 17: SEO, sitemap i vizuelna provjera

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/icon.svg`
- Modify: `src/app/layout.tsx`
- Create: `e2e/vizuelno.spec.ts`, `playwright.config.ts`

**Interfaces:**
- Consumes: `RUTE` (Task 6)
- Produces: `sitemap.xml`, `robots.txt`, favicon, Playwright provjera

- [ ] **Step 1: Dopuni metapodatke u `src/app/layout.tsx`**

```tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://nextpixel.media'),
  title: {
    default: 'NextPixel Media — foto, video i dron produkcija',
    template: '%s',
  },
  description:
    'Sadržaj za firme, nekretnine i događaje. Gradiška, Banja Luka i okolina. Prvi izbor fotografija za 48 sati.',
  openGraph: {
    type: 'website',
    locale: 'bs_BA',
    siteName: 'NextPixel Media',
    url: 'https://nextpixel.media',
  },
  robots: { index: true, follow: true },
}
```

- [ ] **Step 2: Napiši `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next'
import { RUTE } from '@/content/rute'

export default function sitemap(): MetadataRoute.Sitemap {
  const osnova = 'https://nextpixel.media'
  const dodatne = ['/uslovi', '/privatnost']

  return [...RUTE.map((r) => r.href), ...dodatne].map((href) => ({
    url: `${osnova}${href === '/' ? '' : href}`,
    lastModified: new Date(),
    changeFrequency: href === '/' ? 'weekly' : 'monthly',
    priority: href === '/' ? 1 : 0.7,
  }))
}
```

- [ ] **Step 3: Napiši `src/app/robots.ts`**

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: 'https://nextpixel.media/sitemap.xml',
  }
}
```

- [ ] **Step 4: Napravi `src/app/icon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <rect width="120" height="120" fill="#0B1018"/>
  <path d="M35 82 L35 38 L62 72 L62 38" stroke="#F5F5F3" stroke-width="8" fill="none"/>
  <path d="M72 82 L72 38 L86 38 A11 11 0 0 1 86 60 L72 60" stroke="#C6A96B" stroke-width="8" fill="none"/>
</svg>
```

- [ ] **Step 5: Postavi Playwright**

```bash
npm i -D @playwright/test
npx playwright install chromium
```

`playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3000' },
  webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true },
})
```

- [ ] **Step 6: Napiši `e2e/vizuelno.spec.ts`**

```ts
import { expect, test } from '@playwright/test'

const stranice = ['/', '/radovi', '/usluge', '/o-nama', '/kontakt', '/uslovi', '/privatnost']

for (const putanja of stranice) {
  test(`desktop ${putanja}`, async ({ page }) => {
    await page.setViewportSize({ width: 1512, height: 900 })
    await page.goto(putanja)
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `e2e/snimci/desktop${putanja.replace(/\//g, '_')}.png` })

    // Body nikad ne smije horizontalno skrolati.
    const prekoracenje = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(prekoracenje).toBe(false)
  })

  test(`mobilni ${putanja}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(putanja)
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `e2e/snimci/mobilni${putanja.replace(/\//g, '_')}.png` })

    const prekoracenje = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(prekoracenje).toBe(false)
  })
}
```

Dodaj u `package.json`: `"test:e2e": "playwright test"`.

- [ ] **Step 7: Pokreni provjeru**

Run: `npm run test:e2e`
Expected: sve stranice prolaze provjeru horizontalnog prekoračenja. Otvori snimke u `e2e/snimci/` i pogledaj ih — test hvata prelivanje, ne ružnoću.

- [ ] **Step 8: Pokreni sve testove i build**

```bash
npm run test
npm run build
```

Expected: testovi prolaze, `next build` uspijeva. `npm run build:prod` i dalje pada na placeholder zaštiti — to je ispravno ponašanje.

- [ ] **Step 9: Commit i push**

```bash
git add -A
git commit -m "feat: SEO metapodaci, sitemap, robots i vizuelna provjera"
git push
```

---

## Poslije plana

Kad su svi zadaci gotovi, sajt radi s placeholder slikama i ne može u produkciju dok se ne ispune preduslovi iz spec §13:

1. Produkcijski SVG monograma → zamijeni `path` u `Preloader.tsx` i `icon.svg`
2. Pravi materijal u `public/media/` po `id` iz `radovi.ts` → `MEDIA_MODE: 'real'`
3. Hero video, najviše 2 MB
4. `RESEND_API_KEY` i `nikola@nextpixel.media`
5. Fotografije ekipe kao `ekipa-nikola.jpg` i `ekipa-druga.jpg`
6. Provjera cijena na tržištu prije objave `/usluge`
7. Pravna provjera teksta na `/privatnost`

Odgođeno za kasnije: 3D monogram u meniju, logo wall klijenata, engleski jezik.
