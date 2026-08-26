# NextPixel Media — sajt: dizajn

> **Datum:** 27.08.2026.
> **Status:** odobren dizajn, čeka plan implementacije
> **Izvori:** [analiza LAYR-a](../../analiza-layr.md) · [adaptacija](../../adaptacija-nextpixel.md) · [brend dokumenti](../../brend/)

---

## 1. Cilj

Sajt za NextPixel Media na `nextpixel.media` — foto, video i dron produkcija za Gradišku, Banju Luku i okolinu.

Sajt preuzima scroll mehaniku, animacije i UI obrasce sa `layrmedia.com`. Sadržaj, boje, tipografija i ton dolaze iz NextPixel Media brend dokumenata.

**Uspjeh znači:** posjetilac razumije šta radimo, vidi dokaz da to radimo dobro, i pošalje upit koji sadrži dovoljno podataka za ponudu bez dodatnog dopisivanja.

---

## 2. Odluke

| Odluka | Izbor | Razlog |
|---|---|---|
| Lokacija | Zaseban projekat, repo `stpauli98/NextPixelMedia` | Sister brend, ne odjel `.dev`-a (Logo Guide §1). Različit jezik, tržište i stack. |
| Hosting | Next.js 15 + Vercel | Čuva `next/image` optimizaciju i API rutu za formu — obje su tačke gdje nadmašujemo LAYR. |
| Jezik | BS/SR, bez `[lang]` segmenta | Lokalno tržište. Sadržajni sloj drži šav za kasniji engleski. |
| 3D meni | Odgođen | Traži produkcijski SVG monograma koji još ne postoji (Logo Guide §8). |
| Slike | Placeholder, s build zaštitom | Odluka naručioca. Zaštita sprječava odlazak u produkciju. |
| Motiv | Vizir i fokus-oznake, ne fotoaparat | Logo Guide §2 zabranjuje doslovnu kameru; isti paragraf nudi viewfinder UI kao zamjenu. |

---

## 3. Stack

```
Next.js 15          App Router, TypeScript
Tailwind v4         @theme tokeni, bez tailwind.config.js
GSAP 3              ScrollTrigger, SplitText, Observer
Lenis               smooth scroll
resend              kontakt forma
zod                 validacija, dijeljena klijent/server
Vitest              jedinični testovi
Playwright          vizuelna provjera
Docker              testiranje API rute
```

`three` se ne instalira u v1.

---

## 4. Struktura

```
src/
  app/
    layout.tsx              fontovi, SmoothScroll, Nav, Footer
    page.tsx                početna
    radovi/page.tsx
    usluge/page.tsx
    o-nama/page.tsx
    kontakt/page.tsx
    uslovi/page.tsx
    privatnost/page.tsx
    error.tsx  not-found.tsx
    api/kontakt/route.ts
  components/
    layout/    Nav · Meni · Footer · Preloader · SmoothScroll
    ui/        Okvir · Labela · Dugme · Broj
    sections/  Hero · Marquee · Statement · Vizir · MrezaRadova ·
               Proces · Citat · TriUsluge · Rokovi · CTA
    radovi/    DragMreza · Filter
    usluge/    PinPanel
  content/     usluge.ts · radovi.ts · proces.ts · rokovi.ts ·
               paketi.ts · ekipa.ts · testimonijali.ts
  lib/         gsap.ts · useGsap.ts · media.ts · shema.ts
  styles/      globals.css
scripts/
  check-placeholders.mjs
docs/
  brend/  superpowers/specs/  analiza-layr.md  adaptacija-nextpixel.md
```

Svaka sekcija živi u vlastitoj datoteci i drži vlastitu animaciju. Kad datoteka poraste, sekcija radi previše.

---

## 5. Rute

| Ruta | Sadržaj |
|---|---|
| `/` | 14 sekcija po mapiranju u adaptaciji §4 |
| `/radovi` | Drag-mreža, filteri `SVE · FIRME · NEKRETNINE · EVENTI · SPORT · DRON` |
| `/usluge` | Hero, KPI rokovi, 6 pinovanih panela, tri paketa |
| `/o-nama` | Intro, 6 faza procesa, ekipa |
| `/kontakt` | Forma 01–06 |
| `/uslovi` | Tekst iz Uslovi §15, kopira se direktno |
| `/privatnost` | Lica na snimcima i dron, po Uslovi §11 |

---

## 6. Dizajn tokeni

```css
@theme {
  --color-black:     #0B1018;  /* Cinematic Black */
  --color-navy:      #1E3A5F;  /* velike obojene površine */
  --color-champagne: #C6A96B;  /* akcent, najviše 10% površine */
  --color-cream:     #F8F6F0;  /* svijetle sekcije */
  --color-white:     #F5F5F3;  /* tekst na tamnom */
  --color-gray:      #8A919B;  /* metapodaci */
  --font-display:    Montserrat;
  --font-body:       Poppins;
}
```

**Tipografija.** Naslovi: Montserrat 800, uppercase, `tracking-[-0.05em]`, `leading-[0.85]`. Tijelo: Poppins 300–500.

**Skaliranje.** Sve mjere u `vw`, s `max-md:` setom za mobilni. Prelom na 768px.

**Odnos površina.** 70% tamno ili fotografija, 20% cream, 10% šampanj. Šampanj nikad ne popunjava cijelu sekciju — ide na linije, uglove, brojeve i aktivna stanja.

**Uglovne zagrade.** SVG 7×7px u sva četiri ugla dugmadi i kartica, razmiču se na hover. Komponenta `Okvir`.

---

## 7. Animacijski sloj

**Jedan RAF.** Lenis se veže na `gsap.ticker`, a `ScrollTrigger.update` na Lenis `scroll` event. Dvije nezavisne petlje razilaze pin pozicije od stvarnog scrolla.

**Vlasništvo.** Sekcija registruje svoju animaciju kroz `useGsap`, koji umotava `gsap.context()` i čisti na unmount. Bez konteksta React 19 dvostruki mount ostavlja duple ScrollTrigger instance.

**Reduced motion.** `gsap.matchMedia()` s granom za `(prefers-reduced-motion: reduce)` koja postavlja krajnje stanje bez tweena. Guard živi u `useGsap`, pa se ne zaboravlja po sekciji.

**Fontovi prije SplitText.** `await document.fonts.ready`, zatim `ScrollTrigger.refresh()`. SplitText prije učitanog Montserrata prelama linije pogrešno i tekst poskoči.

| Mehanika | Alat |
|---|---|
| Marquee trake | CSS `@keyframes` |
| Hero 200vh | ScrollTrigger `pin` + `scrub` |
| Reveal naslova | SplitText + ScrollTrigger |
| Pinovani paneli | ScrollTrigger `pin`, jedan po panelu |
| Drag-mreža | GSAP `Observer` + `gsap.utils.wrap` |
| Preloader | SVG `stroke-dashoffset`, `sessionStorage` gate |

**Preloader.** Iscrtava NP monogram i četiri fokus-ugla, zatim prelazi iz blur u oštrinu. Prikazuje se jednom po sesiji. Bez audio gate-a — LAYR ga ima i to je njihova najslabija UX tačka.

---

## 8. Sadržajni sloj

Sav tekst i svi podaci žive u `content/` kao tipizirani objekti. Sekcije ih čitaju. Nijedan tekst ne stoji u JSX-u.

```ts
type Rad = { id: string; naslov: string; kategorija: Kategorija; medij: 'foto' | 'video' }
type Usluga = { broj: string; naziv: string; naslov: string; opis: string; ukljuceno: string[] }
type Paket = { naziv: string; cijena: number; stavke: string[]; istaknut: boolean }
```

**Prazno umjesto izmišljenog.** `testimonijali.ts` i `logotipiKlijenata.ts` vraćaju prazne nizove, a sekcije se uslovno ne renderuju. Kad stigne prva prava preporuka, dodaje se objekat i sekcija se pojavljuje. Nijedna brojka, citat ni logotip na sajtu ne smije biti izmišljen.

**Rokovi popunjavaju slot izmišljenih brojki.** LAYR tu ima `30M+ / 50+ / 350+`. Mi imamo tačno: **48h** prvi izbor, **7 dana** fotografije, **14 dana** video, **2 diska** backup. Izvor: Produkcijski Proces §5.1 i §3.2.

**Placeholder slike.** `lib/media.ts` je jedini izvor, s fiksnim seedom po stavci da se slike ne mijenjaju između reloada. Zastavica `MEDIA_MODE: 'placeholder' | 'real'`.

**Build zaštita.** `scripts/check-placeholders.mjs` obara produkcijski build dok je `MEDIA_MODE` na `placeholder`. Isti obrazac koji `.dev` projekat već koristi za `check-forbidden-names.mjs`.

`/radovi` dobija 18 placeholder stavki raspoređenih po kategorijama, dovoljno da wrap u drag-mreži ne bude očigledan.

---

## 9. Kontakt forma

Polja slijede brief iz Templejti §2, pa popunjena forma sadrži sve za slanje ponude:

| # | Polje | Tip |
|---|---|---|
| 01 | Šta ti treba | chipovi: firma · nekretnina · event · dron · nisam siguran |
| 02 | Ime i prezime ili firma | obavezno |
| 03 | Email ili telefon | obavezno |
| 04 | Kada i gdje | datum + mjesto |
| 05 | Gdje ćeš koristiti materijal | chipovi: Instagram · sajt · štampa · oglašavanje · ne znam još |
| 06 | Poruka | tekst |

Polje 05 određuje cijenu prava korištenja (Cjenovnik §9), zato stoji u formi a ne u naknadnom dopisivanju.

**Validacija.** Jedna `zod` shema u `lib/shema.ts`, koriste je i klijent i server. Server validira nezavisno.

**Spam.** Honeypot polje i minimalno vrijeme popunjavanja. Pri jednom do dva upita mjesečno rate-limit servis bi bio oprema bez potrebe.

**Slanje.** `resend` na `nikola@nextpixel.media`. Ispod dugmeta stoji obećanje iz Templejti §1: odgovor u roku od dva sata.

---

## 10. Greške

Ako `resend` padne, forma prikazuje poruku i **mailto fallback** s popunjenim sadržajem. Klijent koji je otkucao upit ne smije ga izgubiti zbog naše infrastrukture.

`error.tsx` i `not-found.tsx` nose brend stil i vode nazad na početnu.

---

## 11. Testiranje

Testovi se pišu prije implementacije za sve osim animacija.

| Šta | Kako |
|---|---|
| `zod` shema | Vitest — validni i nevalidni ulazi |
| `/api/kontakt` | Vitest u Dockeru, sa `.env` |
| Invarijante sadržaja | Vitest — svaki rad ima postojeću kategoriju; prazan niz sakriva sekciju |
| `check-placeholders.mjs` | Vitest — obara build na `MEDIA_MODE: 'placeholder'` |
| Animacije i layout | Playwright screenshotovi na 1512px i 390px |

Animacije nemaju jedinične testove. Test koji potvrđuje da je `opacity` prešao iz 0 u 1 ne govori radi li scena.

---

## 12. Van opsega v1

3D monogram u meniju · logo wall klijenata · sekcija testimonijala s pravim sadržajem · engleski jezik · blog · online rezervacija termina · galerija `photos.nextpixel.media`.

---

## 13. Preduslovi za produkciju

| # | Šta | Bez toga |
|---|---|---|
| 1 | Produkcijski SVG monograma | Nema preloadera, favicona, watermarka |
| 2 | Radovi u tri kategorije | Galerija prazna |
| 3 | Hero video, najviše 2 MB | Nema početne |
| 4 | `nikola@nextpixel.media` i BiH broj | Kontakt ne može uživo |
| 5 | Fotografije ekipe | Nema `/o-nama` |
| 6 | Provjera cijena na tržištu (Cjenovnik §14) | Objavljena cijena se teško mijenja |
| 7 | Tekst za `/privatnost` | Pravna izloženost |

---

## 14. Rizici

**Placeholder slike odu u produkciju.** Ublaženo build zaštitom iz §8. Zaštita se mora testirati, inače je ukras.

**Sajt izgleda prazno dok nema radova.** LAYR mehanika nosi 47 projekata. Sa 3–5 radova drag-mreža i mreža videa gube smisao. Ako materijal kasni, te dvije sekcije prelaze u jednostavan grid dok se galerija ne popuni.

**Montserrat nema Koulen pritisak.** Džinovski naslovi biće blaži nego kod LAYR-a. Ako rezultat ne zadovolji, rješenje je dopuna Logo Guide-a kondenzovanim fontom — brend odluka, ne web odluka.

**Cijene su neprovjerene.** Cjenovnik §14 traži provjeru tržišta prije treće ponude. Objavljena cijena na sajtu je javna i mijenja se teže od cijene u ponudi.
