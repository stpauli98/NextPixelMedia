# Analiza stranice #1 — LAYR Media (layrmedia.com)

**Datum analize:** 26.08.2026.
**URL:** https://layrmedia.com/
**Awwwards:** https://www.awwwards.com/sites/layr-media — *Nominee, 24.08.2026.*
**Autor sajta (agencija):** Lumina (PRO na Awwwards)
**Cilj:** referentni sajt za kopiranje strukture, mehanike i vizuelnog jezika → prilagoditi za NextPixel.

**Awwwards ocjene (community, uzorak od 5 glasova):** 7.40 – 9.90 (Design / Usability / Creativity / Content)
**Awwwards tagovi:** Business & Corporate, Events, Photography, Animation, Portfolio, Responsive Design, Gallery, Menu-Horizontal, UI design · *Built with: Figma, Next.js*

---

## 1. Tehnički stack (potvrđeno reverse-engineeringom bundle-a)

| Sloj | Tehnologija | Detalji |
|---|---|---|
| Framework | **Next.js (App Router) + Turbopack** | statički export (`out/`), nema SSR-a u runtime-u |
| Hosting | **Hostinger** (`platform: hostinger`, `hcdn` CDN) | čist static file serving, HTTP/2 + HTTP/3, `alt-svc: h3` |
| Styling | **Tailwind CSS v4** (`@theme` CSS varijable) | nema `tailwind.config.js` klasičnog tipa — sve kroz CSS layer |
| Animacije | **GSAP 3.15** + **ScrollTrigger** + **SplitText** + **Observer** | `gsap.registerPlugin(SplitText, ScrollTrigger)` na više mjesta |
| Smooth scroll | **Lenis 1.3.23** | `<html class="lenis">`, ne koristi ScrollSmoother iako je u bundle-u |
| 3D | **three.js + @react-three/fiber + drei** (GLTFLoader, DRACOLoader) | lazy-loaded, samo za meni |
| Video | **Vimeo Player SDK** (`player.vimeo.com`) + `vumbnail.com` za postere | 47 jedinstvenih Vimeo ID-eva kroz sajt |
| Forma | **Google Apps Script Web App** | `fetch("https://script.google.com/macros/s/AKfycb.../exec")` — nema backenda |
| Fontovi | **Koulen** (display) + **Work Sans** (tekst) + **Better Signature** (`/fonts/bs.ttf`, dekorativni) | next/font, self-hosted woff2, `font-display: swap` |
| Audio | `/audio/hover-fx.mp3` (7 KB) | globalni sound toggle |
| Analitika | — nije detektovana | nema GA/GTM/Plausible |

**Nema:** CMS-a, baze, API rute, i18n-a, cookie consent tool-a (linkovi postoje ali su statični).

---

## 2. Struktura sajta

```
/                 → Home (10.980 px scroll height @1512px)
/about            → About / crew / proces
/services         → 6 usluga, pinned panels (10.037 px)
/projects         → Gallery, infinite drag grid + filteri
/contact          → Forma "Start a Project"
/privacy-policy   /terms-of-use   /cookie-policy
```

`sitemap.xml` + `robots.txt` postoje (`Disallow: /api/, /_next/`), `lastmod` 19.08.2026.

---

## 3. Dizajn sistem

### Boje (kompletna paleta — samo 3 tokena!)
```css
:root{
  --color-black: #171717;   /* ne čisto crno */
  --color-white: #f8f7f6;   /* topli off-white */
  --color-red:   #f03;      /* #ff0033 — akcent */
}
```
Dodatno se koristi čisti `#000` za pojedine sekcije (galerija, services grid). Cijeli sajt je **3-bojni sistem** — snaga dizajna je u tipografiji i praznom prostoru, ne u boji.

### Tipografija
- **Koulen** — condensed display, sve VELIKIM, koristi se za sve naslove (`--default-font-family` je Koulen, tj. *default* font cijelog sajta)
- **Work Sans** (300/400/500/600) — body, labeli, UI (`font-secondary`)
- **Better Signature** — rukopisni, samo za "Layr." potpis u preloaderu i footer kartici
- Fallback metrike su override-ovane (`ascent-override`, `size-adjust`) → nema CLS-a

### Skaliranje — **ključni princip za kopiranje**
Sve mjere su u **`vw` jedinicama**, ne u `rem`/`px`:
```html
px-[4vw] py-[2.2vw] text-[0.8vw] gap-[8.5vw] size-[0.55vw]
max-md:px-[6vw] max-md:py-[5vw] max-md:text-[3vw]
```
→ Layout se **proporcionalno skalira** sa širinom viewporta na desktopu; mobilni dobija poseban set `max-md:` vrijednosti (breakpoint 768px). Ovo daje "isti kadar" na svim desktop rezolucijama.

### Vizuelni potpis (motivi koji se ponavljaju)
1. **Uglovne zagrade** — 7×7px SVG L-oblici u sva 4 ugla dugmadi/kartica, koji se na hover razmiču prema van (`group-hover:-translate-x-[0.2vw]`). To je *najprepoznatljiviji* mikrodetalj sajta.
2. **`[ Zagrade ]` oko labela** — `[ SOUND: OFF ]`, `[ OUR SERVICES ]`, `[ 01 ]`, `[ WHAT'S INCLUDED ]` — tehnički/kamerni jezik.
3. **Crveni kvadrat** kao logo-mark (gore lijevo) i kao tačka iza "LAYR**.**"
4. **Numeracija `01 / 02 / 03`** i `01/06` — outline crvena tipografija preko slika.
5. **Isječkane (dashed) linije** oko testimonial kartica.

---

## 4. Home stranica — sekcija po sekcija

| # | Sekcija | Mehanika |
|---|---|---|
| 0 | **Preloader / Audio gate** | Fullscreen `#171717`, ručno crtana SVG linijska ilustracija gornje ploče fotoaparata (**viewBox 0 0 1566 708, 145 path-ova**) sa stroke-draw animacijom. Crveni okidač = "CLICK TO ENTER". Dva ulaza: `ENTER WITH AUDIO` / `[ ENTER WITHOUT SOUND ]`. Custom kursor (`md:cursor-none`). **Pojavljuje se na svakom hard loadu.** |
| 1 | **Hero** — `<header class="h-[200vh]">` | Fullscreen autoplay/muted/loop MP4 (8,1 MB!) + ogroman "LAYR. MEDIA" u Koulen-u preko videa. Header je 200vh → pinned scroll scena. |
| 2 | **Horizontalni marquee slika** | Traka od 12 fotografija koja se kreće suprotno smjeru scrolla (`@keyframes scrollLeft/scrollRight`), sa `PHOTO. VIDEO. CONTENT.` labelom. |
| 3 | **Statement tekst** | "Founded in 2021, we've been building content that doesn't just look good → it actually means something." — SplitText reveal po riječima/linijama. |
| 4 | **"Kamera" sekcija** ⭐ | PNG render poleđine fotoaparata (`/home/camera/p1.png`, `p2.png`) sa **Vimeo videom koji se pušta unutar LCD ekrana**. Sa strane: `MADE IN TORONTO, CA / TRUSTED WORLDWIDE / EST 2021`. Signature element sajta. |
| 5 | **Beskonačna mreža videa** ⭐ | Crna sekcija (3420 px), grid thumbnailova koji se pomjeraju paralaksno u više redova različitim brzinama; na hover se u centru otvara video preview sa naslovom projekta (npr. `▶ HALAL RIB FEST`). Uglovne zagrade oko aktivnog. |
| 6 | **"We're LAYR." intro** | Tekst + `View Full gallery →` / `Learn more about us →` dugmad. |
| 7 | **Proces traka** (crvena, 13vw) | Marquee: `01 Ideation · 02 Scripting & Strategy · 03 Pre-Production · 04 Production · 05 Post Production` na `--color-red` pozadini. |
| 8 | **Big quote** | Ogromni crveni navodnici + centrirani statement + `LEARN MORE ABOUT US →`. |
| 9 | **3 usluge** (h-50vw, 3 kolone) | `WE MAKE FILMS.` / `WE CAPTURE MOMENTS.` / `WE GROW BRANDS.` — svaka kolona ima b/w sliku, halftone dot pattern overlay, outline broj 01/02/03; aktivna kolona se otkriva na hover. |
| 10 | **Galerija + CTA** | "THERE'S MORE WHERE THAT CAME FROM." + `VIEW FULL GALLERY ➔` |
| 11 | **TESTIMONIAL** | Riječ "TESTIMONIAL" preko cijele širine (Koulen, ~230px), preko nje crvene "naljepnice": `real clients`, `real results`, `real projects`. |
| 12 | **Testimonial kartice** | Video thumb + citat + ime/funkcija u `[ ]` + veliki crveni KPI (`50+ Projects completed`, `6M+ Organic views generated`). Dashed border. |
| 13 | **CTA** | "Got a project idea? We're here to team up." + `info@layrmedia.com` |
| 14 | **Footer** | Gigantski "LAYR. MEDIA" (skoro cijela širina) + nagnuta razglednica `card1.png` ("Want us at YOUR BIG DAY? — visit LAYR-WEDDINGS") + linkovi + `Made with love by Lumina` |

### Navigacija
- Fiksni transparentni nav: crveni kvadrat (logo) · `[ SOUND: OFF ]` · `START A PROJECT` (crveni pill) · `MENU` (crni pill sa hamburgerom)
- **Fullscreen meni**: crna pozadina, 5 stavki u Koulen-u (aktivna crvena, ostale sive), desno **rotirajući 3D wireframe model fotoaparata** (`/models/vintage_camera_exakta_vx_1954.glb`, 1,2 MB, R3F, wireframe materijal). Loading state: `[ Loading Model... ]`.

---

## 5. Podstranice

### `/services` — "ONE CREW. EVERY SHOT. EVERY PLATFORM."
- Hero: 3 reda ogromnog Koulen teksta + lista 6 usluga desno gore u `[ ... ] [ 0X ]` formatu
- KPI blok: **30M+** organic views · **50+** brands trusted · **350+** projects delivered
- 6 **pinned fullscreen panela** (`01/06` … `06/06`): fullbleed fotografija, veliki crveni broj, naziv usluge, opis, i chip-ovi `[ WHAT'S INCLUDED ]`
- Usluge: Video Production · Event & Conference Coverage · Photography · Social Media Management · Paid Advertising & Paid Media · Website Development

### `/projects` — "OUR WORK."
- **Beskonačna drag/scroll mreža** svih radova, **desaturirana (grayscale)**, boja se vraća na hover
- Plutajuća filter-pilula na dnu: `[ FILTER ] ALL · EVENTS · HOSPITALITY · BRAND & RETAIL · IMAGES`
- ~47 projekata sa nazivima (Halal Rib Fest, Atif Aslam Toronto Concert, Blockchain Futurist Conference, Mother Cocktail Bar, ON commercial, Asics, New Balance…)

### `/about` — "We're Layr."
- Sekcije: intro → logo-wall klijenata (12 SVG logotipa) → **6 faza procesa** (`WE LISTEN BEFORE WE SHOOT.` … `WE EDIT UNTIL IT'S WORTH WATCHING.`) → **crew** (3 člana sa fotografijom, funkcijom i opisom) → lista usluga → CTA

### `/contact` — "Welcome! Nice to meet you."
- Numerisana forma `[ 01 ]`–`[ 05 ]` u zasebnim karticama sa uglovnim zagradama:
  1. Tip upita (4 chip-a: I'd like to enquire / I have an idea / I need something specific / Work with us)
  2. Full Name* 3. Email Address* 4. Company 5. Poruka
- `SUBMIT` (crveni) → **POST na Google Apps Script**
- Sa strane: `[ ANYTHING ELSE ] Hey There! → info@layrmedia.com`

---

## 6. Performanse (izmjereno, desktop, 1512px)

| Metrika | Vrijednost |
|---|---|
| HTML dokument | 33 KB (gzip) / 212 KB raw |
| Ukupno prenešeno (home) | **~5,7 MB** |
| JS | 1,83 MB |
| Slike | 1,73 MB |
| Fetch (Vimeo manifesti) | 1,22 MB |
| DOMContentLoaded | 423 ms |
| Load | 824 ms |
| Broj resursa | 51 |

**Najteži pojedinačni fajlovi:**
- `/home/hero/1.mp4` → **8,1 MB** (hero video, ne ulazi u početni load ali se streamuje odmah)
- `vintage_camera_exakta_vx_1954.glb` → **1,2 MB**
- `44n_sgipac790.js` (three.js + R3F) → **934 KB** — lazy, samo za meni
- Hero JPEG-ovi → 150–420 KB **po slici**
- `/footer/card1.png` → 730 KB

### Slabosti koje NE treba kopirati
1. **Slike su obični `<img src="*.jpg">`** — bez `next/image`, bez `srcset`, bez WebP/AVIF. Statički export sa `unoptimized: true`. Ogroman prostor za popravku.
2. **8 MB hero MP4** bez poster-fallback-a i bez adaptivnog bitrate-a.
3. **1,2 MB nekomprimovan GLB** (bez Draco kompresije, iako je DRACOLoader u bundle-u) za dekorativni element.
4. **Preloader/audio gate na svakom loadu** — nije zapamćen u `sessionStorage`; usporava povratne posjete i šteti UX-u i (potencijalno) SEO/CWV mjerenju.
5. Nema analitike — ne mjere ništa.
6. `content-type: text/plain` na `.glb` fajlu (pogrešan MIME na Hostingeru).

---

## 7. Šta konkretno vrijedi preuzeti za NextPixel

### Prioritet A — jeftino, veliki efekat
- **`vw`-bazirano skaliranje** cijelog layouta + `max-md:` set za mobilni
- **Uglovne zagrade** (7×7 SVG) sa hover-razmicanjem — univerzalni "tech" detalj
- **`[ Label ]` sintaksa** za sve male labele
- **3-token paleta** (crna / off-white / jedna akcent boja) — kod nas: NextPixel brand boja umjesto `#f03`
- **Numerisana kontakt forma** u karticama + Google Apps Script kao backend (nula troška) — *napomena: mi već imamo `resend` u projektu, pa je bolja opcija Next.js API ruta*
- **Marquee trake** (proces / usluge) — čist CSS `@keyframes`, bez JS-a
- **Gigantski logo u footeru**

### Prioritet B — traži rad, ali je "wow" faktor
- **Pinned fullscreen paneli** za usluge (GSAP ScrollTrigger pin)
- **SplitText reveal** naslova po linijama/riječima
- **Beskonačna paralaksna mreža** radova sa hover-video preview-om
- **Fullscreen meni** sa velikim tipografskim linkovima
- **Testimonial sekcija** sa velikom riječi + naljepnicama + KPI brojevima

### Prioritet C — skupo / rizično
- **3D model u meniju** (R3F + 1,2 MB GLB) — mi bismo mogli lakšim putem: Lottie ili CSS/SVG wireframe animacija
- **Audio gate preloader** — zadržati *ideju* (branded preloader) ali:
  - prikazati **samo pri prvoj posjeti** (`sessionStorage`)
  - bez prisilnog audio izbora, ili audio kao diskretan toggle
- **Ručno crtana SVG ilustracija sa 145 path-ova** — zahtijeva ilustratora; alternativa: jednostavniji linijski motiv iz NextPixel logo sistema

### Šta obavezno raditi bolje od njih
- `next/image` + AVIF/WebP + `srcset` (kod nas Vercel, ne static export)
- Hero video: ≤2 MB, poster slika, `preload="none"` na mobilnom, `prefers-reduced-motion` fallback
- GSAP učitavati lazy/po sekciji, ne u glavnom bundle-u
- Analitika (već imamo `@vercel/analytics`)
- `prefers-reduced-motion` respekt na svim scroll animacijama (LAYR to ne radi)
- i18n (BS/EN) — LAYR je jednojezičan; naš projekat već ima `i18next` + `[lang]` rute

---

## 8. Mapiranje na naš postojeći projekat (`Next-Pixel-NJS`)

**Već imamo:** Next 15 (App Router, `src/app/[lang]`), Tailwind **v3.4**, `framer-motion`, `i18next`, `resend`, MDX, `@vercel/analytics`, `lucide-react`.

**Šta bi trebalo dodati:**
```
gsap                     ~ScrollTrigger + SplitText (SplitText je od GSAP 3.13 besplatan)
lenis                    ~smooth scroll
@react-three/fiber three  (samo ako idemo na 3D — opciono, Prioritet C)
```

**Ključne odluke prije implementacije:**
1. **Tailwind v3 vs v4** — LAYR koristi v4 sa `@theme`. Mi smo na v3.4 sa `tailwind.config.js`. `vw` arbitrary vrijednosti (`px-[4vw]`) rade i u v3, pa migracija **nije neophodna**.
2. **framer-motion vs GSAP** — za pinned scroll scene i SplitText, GSAP je jači. Preporuka: GSAP za scroll-scene, framer-motion zadržati za UI mikrointerakcije (već je u projektu).
3. **Video hosting** — LAYR koristi Vimeo. Za nas: Vimeo/Mux/Cloudflare Stream ili samohostovan MP4 na Vercelu (ali pazi na bandwidth).
4. **Forma** — koristiti postojeći `resend` + API rutu, ne Google Apps Script.
5. **i18n** — svi tekstovi iz ove strukture moraju ići kroz `locales/`, uključujući marquee i labele.

---

## 9. Sirovi materijali (sačuvano lokalno tokom analize)

Scratchpad ove sesije sadrži: `layr.html`, `about/services/projects/contact.html`, `layr.css` (74 KB), 20 JS chunk-ova (`chunks/`), listu asseta. Screenshotovi svih ključnih sekcija (desktop 1512×900 + mobile 390×844) napravljeni su preko Playwright-a.

**Popis asset foldera na njihovom sajtu** (za razumijevanje organizacije):
```
/home/hero/1–12.jpg, 1.mp4
/home/camera/p1.png, p2.png
/home/projects/1–11.jpg
/home/services/1–3.png
/about/crew/1–3.jpg
/logos/1–12.svg
/footer/card1.png
/models/vintage_camera_exakta_vx_1954.glb
/audio/hover-fx.mp3
/fonts/bs.ttf
```

---

## 10. Sljedeći korak (prijedlog)

1. Odabrati **koje sekcije preslikavamo 1:1**, koje adaptiramo, koje izbacujemo → napraviti wireframe mapu NextPixel home stranice
2. Definisati NextPixel 3-token paletu i font par (ekvivalent Koulen+Work Sans; Koulen je Google Font i slobodan za korištenje)
3. Popisati potreban foto/video materijal — **ovaj dizajn stoji ili pada na kvalitetu materijala**, to je 70% utiska
4. Tek onda kod: prvo scroll skelet (Lenis + ScrollTrigger), pa sekcije

> ⚠️ Napomena o kopiranju: struktura, mehanika i UX obrasci su slobodni za preuzimanje. **Ne preuzimati**: njihov SVG crtež kamere, GLB model, fotografije, logotipe klijenata, i doslovne tekstove (copy). Copy treba napisati iznova za NextPixel.
