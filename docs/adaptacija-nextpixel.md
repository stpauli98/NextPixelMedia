# NextPixel Media — sajt po LAYR mehanici

> **Šta je ovo:** LAYR struktura, animacije, 3D i UI/UX iz [stranica1.md](stranica1.md) — sa NextPixel Media sadržajem, bojama, uslugama, klijentima i tonom.
> **Izvori:** `NextPixelMedia/` (Logo Guide, Ponuda i Cjenovnik, Produkcijski Proces, Klijenti i Kanali, Templejti, Uslovi)
> **Datum:** 26.08.2026.
> **Domen:** `nextpixel.media`

---

## 0. Princip zamjene

| Sloj | Odluka |
|---|---|
| **Mehanika** (scroll, pin, marquee, drag-grid, hover-video, split-text) | **1:1 preuzeti** |
| **UI obrasci** (uglovne zagrade, `[ labele ]`, numeracija, fullscreen meni, vw-skaliranje) | **1:1 preuzeti** — poklapaju se s NextPixel identitetom |
| **3D u meniju** | **preuzeti mehaniku, zamijeniti objekat** |
| **Boje, tipografija, ton** | **zamijeniti kompletno** |
| **Sadržaj, usluge, brojke, copy** | **zamijeniti kompletno** |
| **Literalna kamera kao motiv** | **izbaciti** — zabranjeno logo guide-om |

---

## 1. Tri odluke koje sam donio (i zašto)

Sve tri su **već odgovorene tvojim Logo Guide-om** — nisu moja procjena.

### 1.1 Šampanj se NE koristi kako LAYR koristi crvenu

LAYR crvenu (`#f03`) koristi agresivno: cijela traka procesa je crvena, brojevi su crveni, naljepnice preko naslova su crvene.

Logo Guide §5 kaže suprotno:
> 70% tamne pozadine / 20% neutralne površine / **10% šampanj**. *"Champagne should remain an accent, not become a full gold-luxury aesthetic. Avoid large gold gradients, excessive metallic effects."*

**Rješenje:** velike obojene površine (traka procesa, hover stanja, sekcijske pozadine) idu na **NextPixel Navy `#1E3A5F`** ili **Cinematic Black `#0B1018`**. Šampanj ostaje na: linijama, uglovnim zagradama, brojevima, jednoj riječi u naslovu, aktivnom stanju. Nikad kao fill cijele sekcije.

> Efekat je i dalje jak — samo je *hladniji i skuplji* umjesto *glasniji*. To je tačno razlika između LAYR-a i tvog brenda.

### 1.2 Kamera izlazi, vizir ulazi

Ovo je najveća intervencija. Cijeli LAYR koncept je **doslovna kamera**: preloader crta gornju ploču fotoaparata, sredina sajta je PNG poleđine fotoaparata s videom u LCD-u, meni ima 3D model Exakta VX 1954.

Logo Guide §2 to eksplicitno zabranjuje:
> *Avoid obvious visual clichés such as: camera body icons, aperture/shutter symbols, drone silhouettes, film reels, lens illustrations, clapperboards.* … *The identity should communicate **media production**, not merely "photographer".*

Ali isti paragraf **daje zamjenu**:
> *four corner marks inspired by: camera framing, focus guides, crop marks, **viewfinder UI***

**Rješenje — motiv je vizir, ne aparat:**

| LAYR element | NextPixel zamjena |
|---|---|
| SVG crtež gornje ploče aparata (145 path-ova) u preloaderu | **NP monogram + četiri fokus-ugla**, ista stroke-draw animacija |
| Crveni okidač "CLICK TO ENTER" | **Centralna fokus-tačka** u šampanju |
| PNG poleđina aparata s videom u LCD ekranu | **Vizir okvir** oko videa + HUD metapodaci (`f/2.8 · 1/250 · ISO 400 · GRADIŠKA`) |
| 3D model vintage fotoaparata (GLB, 1,2 MB) | **3D NP monogram s okvirom** — ekstrudiran iz logo SVG-a |
| Uglovne zagrade 7×7px na dugmadima | **ostaju** — to je već tvoj motiv, LAYR ga koristi slučajno, ti ga koristiš namjerno |

> Ovo nije gubitak. LAYR mora crtati kameru jer nema simbol. **Ti imaš simbol koji sam po sebi znači fokus i kadar** — svaka animacija koja kod njih traži ilustraciju, kod tebe je logo koji radi posao.

### 1.3 Tipografija ostaje Montserrat + Poppins

LAYR-ova udarna snaga je Koulen — kondenzovan display font. Montserrat nije kondenzovan, pa džinovski naslov neće imati identičan pritisak.

Logo Guide §9 je jasan: Montserrat/Poppins zadržavaju vezu s `.dev` brendom.

**Rješenje:** Montserrat **800, uppercase, `tracking-tighter` (−0.05em), `leading-[0.85]`**. Tako se dobija blok teksta koji je gušći od standardnog Montserrata i drži se brend sistema.

**Ako kasnije poželiš LAYR-ov pritisak:** to traži dopunu Logo Guide-a (kondenzovan treći font, npr. Archivo Condensed / Oswald). Ne radim to sam — to je brend odluka, ne web odluka.

---

## 2. Dizajn tokeni — mapiranje

```css
/* LAYR                          →  NextPixel Media */
--color-black:  #171717;         →  --npm-black:     #0B1018;  /* Cinematic Black */
--color-white:  #f8f7f6;         →  --npm-cream:     #F8F6F0;  /* Warm Cream */
                                    --npm-white:     #F5F5F3;  /* Soft White — tekst na tamnom */
--color-red:    #f03;            →  --npm-champagne: #C6A96B;  /* akcent, max 10% */
/* nema ekvivalent */            →  --npm-navy:      #1E3A5F;  /* velike obojene površine */
/* nema ekvivalent */            →  --npm-gray:      #8A919B;  /* metapodaci, sekundarni tekst */
```

| Element | LAYR | NextPixel |
|---|---|---|
| Display font | Koulen | **Montserrat 700/800**, uppercase, tracking −0.05em |
| Body font | Work Sans | **Poppins 300/400/500** |
| Dekorativni | Better Signature | *(opciono)* Cormorant Garamond — samo za veliki editorial naslov |
| Skaliranje | `vw` jedinice + `max-md:` | **isto, 1:1** |
| Uglovne zagrade | 7×7px SVG, hover-razmicanje | **isto, ali u šampanju** |
| `[ labele ]` | `[ SOUND: OFF ]` | **isto** — `[ FOKUS ]`, `[ 01 ]`, `[ ŠTA DOBIJAŠ ]` |
| Akcent kvadrat (logo mark) | crveni kvadrat | **NP monogram** |

**Odnos površina — provjeri na svakoj sekciji:** 70% tamno/fotografija · 20% cream/neutralno · 10% šampanj.

---

## 3. Jezik i rute

LAYR je jednojezičan (EN). Ti gađaš **Gradišku i Banju Luku** — primarni jezik je **BS/SR**, engleski je opcion.

```
/                     Početna
/radovi               Galerija (LAYR: /projects)
/usluge               Usluge (LAYR: /services)
/o-nama               O nama (LAYR: /about)
/kontakt              Kontakt (LAYR: /contact)
/uslovi               Uslovi saradnje  ← Uslovi §15, gotov tekst
/privatnost           Privatnost i lica na snimcima  ← Uslovi §11
```

Nav u meniju: `POČETNA · RADOVI · USLUGE · O NAMA · KONTAKT`
Projekat `Next-Pixel-NJS` već ima `src/app/[lang]` + `i18next` — svi tekstovi (uključujući marquee trake) idu kroz `locales/`.

---

## 4. Početna — sekcija po sekcija

Kolona "Mehanika" je preuzeta iz LAYR-a bez izmjene. Kolona "Sadržaj" je nova.

| # | Mehanika (LAYR, zadržati) | Sadržaj (NextPixel) |
|---|---|---|
| **0** | Fullscreen preloader, stroke-draw SVG, custom kursor | **NP monogram + 4 fokus-ugla** se iscrtavaju, fokus-tačke uskaču, cijeli mark prelazi iz blur u oštrinu. Ispod: `[ FOKUS ]` → `UĐI`. **Bez audio gate-a** (vidi §8.1). |
| **1** | `<header class="h-[200vh]">`, fullscreen video + džinovski naslov preko | Dron kadar (Gradiška Open / objekat iz vazduha). Naslov: **NEXTPIXEL MEDIA**. Ispod: `FOTO · VIDEO · DRON` |
| **2** | Horizontalni marquee traka fotografija, kontra-smjer scrolla | 8–12 najboljih fotografija. Labela desno: `FOTO · VIDEO · DRON` |
| **3** | SplitText reveal statement teksta | *"Ljudi biraju gdje će jesti, gdje će trenirati i koga će zvati — **po slikama.** → Tvoje su slabije nego tvoj posao."* |
| **4** | Video unutar okvira, s bočnim metapodacima ⭐ | **Vizir okvir** umjesto poleđine aparata. HUD okolo: `MADE IN GRADIŠKA, BA`, `f/2.8 · 1/250 · ISO 400`, `EST. 2026`. Video: highlight klip. |
| **5** | Beskonačna paralaksna mreža videa, hover-preview u centru ⭐ | Radovi po kategorijama. Naslov na hover: `▶ GRADIŠKA OPEN 3x3` |
| **6** | Intro tekst + dva CTA dugmeta | *"Nas je dvoje. Snimamo vikendom, jedan do dva posla mjesečno — i zato svaki odradimo do kraja."* → `VIDI RADOVE →` · `KAKO RADIMO →` |
| **7** | Obojena marquee traka procesa (LAYR: crvena, 13vw) | **Navy pozadina**, šampanj tekst: `01 Dogovor · 02 Priprema · 03 Snimanje · 04 Backup · 05 Obrada · 06 Isporuka` |
| **8** | Veliki citat s navodnicima + CTA | *"Rok koji ispuniš svaki put vrijedi više od roka koji zvuči brzo i probije se."* → `KAKO RADIMO →` |
| **9** | 3 kolone, h-50vw, hover otkriva sliku, outline broj | **01 Sadržaj za firme** — „Snimamo kako radiš."<br>**02 Nekretnine i dron** — „Objekat koji se proda."<br>**03 Eventi i sport** — „Dan koji se ne ponavlja." |
| **10** | Galerija CTA | *"Ima još."* → `SVI RADOVI ➔` |
| **11** | Džinovska riječ preko širine + naljepnice | **`ROKOVI`** preko širine, šampanj naljepnice: `bez izgovora` · `zapisano u ponudi` · `isto svaki put` |
| **12** | Kartice s isprekidanim borderom + veliki KPI broj | **Rok kartice** (vidi §5) — umjesto testimonijala kojih još nema |
| **13** | CTA blok | *"Imaš objekat, event ili firmu za snimanje?"* + `nikola@nextpixel.media` |
| **14** | Džinovski logo preko širine + nagnuta razglednica | **NEXTPIXEL MEDIA** preko širine + kartica: **„Treba ti i sajt? → nextpixel.dev"** (LAYR tu ima LAYR-WEDDINGS; ti tu imaš `.dev` crossover) |

### Navigacija i meni

- Fiksni nav: **NP monogram** · `[ FOKUS ]` *(ili izbaciti — vidi §8.1)* · `ZAPOČNI PROJEKAT` (šampanj pill) · `MENI` (crni pill)
- Fullscreen meni: Cinematic Black, 5 stavki u Montserrat 800 (aktivna šampanj, ostale `#8A919B`), desno **rotirajući 3D NP monogram s okvirom**

---

## 5. Ono što ne postoji — i čime se popunjava

> **Pravilo:** nijedna brojka, citat ni logo na sajtu ne smije biti izmišljen. Ovo je najvažniji dio dokumenta.

| LAYR ima | Ti nemaš | Zamjena |
|---|---|---|
| `30M+ views · 50+ brands · 350+ projects` | jedan odrađen posao | **Rokovi i uslovi kao brojke** (dolje) |
| 2 video testimonijala s imenima | nula preporuka | **sekcija se gradi ali stoji skrivena** dok ne stigne prva prava |
| 12 logotipa klijenata (logo wall) | nula klijenata | **sekcija se izostavlja** iz prve verzije |
| 47 projekata u galeriji | 1 + jedan nadolazeći | **galerija se ne pušta prije 3–5 radova** (Klijenti §3.1) |

### Zamjena za KPI traku — istinite brojke koje te razlikuju

Isti vizuelni tretman (isprekidane kartice, veliki šampanj broj), samo tačan sadržaj:

| Broj | Ispod |
|---|---|
| **48h** | Prvi izbor fotografija, od snimanja |
| **7 dana** | Kompletne fotografije |
| **14 dana** | Video, s vertikalnom verzijom |
| **2 diska** | Backup prije nego što legnemo |

Ovo su tvoja stvarna pravila iz Produkcijskog Procesa §5.1 i §3.2. Konkurencija koja obećava „tri dana" ovo ne može napisati — jer to ne radi.

> Kad stignu prve preporuke (mehanizam uvodnih cijena, Cjenovnik §12 — popust u zamjenu za preporuku), one **zamjenjuju** ovu sekciju, a rokovi se sele na `/usluge`.

---

## 6. Podstranice

### `/usluge` — LAYR mehanika: 6 pinovanih fullscreen panela

LAYR ima 6 usluga. **Ti imaš tačno 6** — poklapa se bez natezanja:

| # | Usluga | Naslov panela | Chipovi `[ ŠTA JE UKLJUČENO ]` |
|---|---|---|---|
| 01 | **Sadržaj za firme** | „Snimamo kako radiš." | Foto za sajt i mreže · Video do 2 min · Vertikalna verzija · Dron · Portret vlasnika |
| 02 | **Nekretnine** | „Objekat koji se proda." | Enterijer i eksterijer · Vazdušni kadrovi · Video obilazak · **Rok 5 dana** |
| 03 | **Dron** | „Kadar koji niko drugi nema." | Vazdušna fotografija · Vazdušni video · Objekat u okruženju |
| 04 | **Eventi i proslave** | „Dan koji se ne ponavlja." | Firmini eventi · Konferencije · Proslave · Kratki highlight video |
| 05 | **Sport i turniri** | „Napor se vidi izbliza." | Akcija · Atmosfera · Dron iznad terena · Dodjela nagrada |
| 06 | **Sajt + sadržaj** | „Sadržaj i sajt iz iste kuće." | Zajedno s **NextPixel.dev** · Foto paket −15% uz sajt |

**Hero:** `JEDNA EKIPA. SVAKI KADAR. SVAKI FORMAT.` *(LAYR: „ONE CREW. EVERY SHOT. EVERY PLATFORM.")*

**Cijene:** tri B2B paketa (MINI 350 · **STANDARD 650** · PLUS 1.200 KM), srednji vizuelno istaknut — to je tvoje pravilo prodaje iz Cjenovnika §3.

> ⚠️ **Prije objave cijena:** uradi provjeru tržišta iz Cjenovnika §14. Cijene su izvedene računicom, ne s tržišta. Objavljena cijena se teško mijenja.

### `/radovi` — LAYR mehanika: beskonačna drag mreža, grayscale → boja na hover

Filteri: `SVE · FIRME · NEKRETNINE · EVENTI · SPORT · DRON`
Naslov: **NAŠ RAD.** / *„Izbor onoga što smo snimili."*

**Ne puštati** dok ne postoji bar po jedan rad u tri kategorije (Klijenti §3.1: ugostiteljstvo, nekretnine, servis/zanat).

### `/o-nama` — LAYR mehanika: intro → logo wall → 6 faza procesa → ekipa → CTA

**Intro:** *„Nas je dvoje. NextPixel Media je media strana NextPixel-a — `.dev` gradi sajt, mi snimamo ono što na njemu stoji."*

**Logo wall:** izbaciti iz prve verzije.

**6 faza** — LAYR ima „WE LISTEN BEFORE WE SHOOT." format. Tvoja verzija, sve tačno iz Produkcijskog Procesa:

```
01 →  PITAMO PRIJE NEGO ŠTO SNIMIMO.
02 →  OBIĐEMO PROSTOR I NAPIŠEMO SHOT LISTU.
03 →  DOĐEMO 30 MINUTA RANIJE.
04 →  MATERIJAL JE NA DVA DISKA PRIJE NEGO ŠTO LEGNEMO.
05 →  OBRAĐUJEMO DOK SET NE IZGLEDA KAO JEDAN SET.
06 →  PRVI IZBOR STIŽE ZA 48 SATI.
```

**Ekipa:** LAYR ima 3 člana s portretom, funkcijom i opisom. Ti imaš dvoje — ista mehanika, dvije kartice.

### `/kontakt` — LAYR mehanika: numerisana forma `[ 01 ]`–`[ 05 ]` u karticama

Ovdje je najveća nadogradnja nad LAYR-om: **forma postaje tvoj brief**. Polja su izvučena iz Templejti §2, tako da popunjena forma sadrži sve što ti treba da pošalješ ponudu bez dodatnog dopisivanja.

| # | Polje |
|---|---|
| `[ 01 ]` | **Šta ti treba** — chipovi: `Sadržaj za firmu` · `Nekretnina` · `Event ili proslava` · `Dron` · `Nisam siguran/na` |
| `[ 02 ]` | Ime i prezime / firma * |
| `[ 03 ]` | Email ili telefon * |
| `[ 04 ]` | Kada i gdje — datum + mjesto |
| `[ 05 ]` | **Gdje ćeš koristiti materijal** — `Instagram` · `Sajt` · `Štampa` · `Oglašavanje` · `Ne znam još` ⚠️ *određuje cijenu prava* |
| `[ 06 ]` | Poruka |

**Naslov:** `DOBRO DOŠAO. DA SE UPOZNAMO.` *(LAYR: „Welcome! Nice to meet you.")*
**Bočno:** `[ RADIJE DIREKTNO? ]` → `nikola@nextpixel.media` + Viber/WhatsApp
**Ispod dugmeta:** *„Javljam se u roku od 2 sata."* — to je tvoje pravilo iz Templejti §1, i jak je argument.

**Backend:** LAYR koristi Google Apps Script. Ti **već imaš `resend`** u `Next-Pixel-NJS` — ide Next.js API ruta, ne Apps Script.

---

## 7. Šta se NE prenosi s LAYR-a

| Ne prenosi se | Zašto |
|---|---|
| Doslovna kamera (preloader, poleđina aparata, 3D model) | Logo Guide §2 zabrana |
| Crvena kao dominantna boja | Logo Guide §5 — šampanj je akcent, 10% |
| Video produkcija sa zvukom, intervjui | **Nemaš opremu za zvuk** (Proces §7.2) |
| Social media management, plaćeno oglašavanje | Nisu u tvojoj ponudi (Cjenovnik §2) |
| Vjenčanja / „WEDDINGS" kartica u footeru | **Ne radiš vjenčanja** (Cjenovnik §15) → zamijenjeno `.dev` karticom |
| Izmišljene brojke i testimonijali | Nema ih — vidi §5 |
| Audio gate na svakom loadu | UX teret, i nije brend potreba |
| 8 MB hero video, JPG bez `srcset`, 1,2 MB GLB | Tehnički loše — vidi §9 |

### Opciona nadogradnja koju LAYR nema: „Za koga nismo"

Tvoji dokumenti imaju jasan filter klijenata (Klijenti §8). To je neobično iskreno za sajt — i **radi kao filter**: odbija pogrešnog klijenta prije nego što ti pojede vrijeme.

Mehanika: LAYR-ova marquee traka ili jednostavna lista na cream pozadini.

```
Ne radimo vjenčanja.  ·  Ne isporučujemo sirov materijal.
Ne snimamo izjave i govore.  ·  Nismo najjeftiniji.
```

Preporučujem da uđe — ali odluči ti, ovo nije iz LAYR-a.

---

## 8. UX ispravke nad LAYR-om

### 8.1 Preloader — zadržati, ali ispraviti

LAYR pušta preloader s prisilnim izborom audio/bez audio **na svakom hard loadu**. To je najslabija tačka njihovog UX-a.

**Tvoja verzija:**
- animacija ostaje (stroke-draw NP monograma + fokus prelaz)
- prikazuje se **samo pri prvoj posjeti** — `sessionStorage`
- **bez prisilnog audio izbora** — bez zvuka uopšte, ili diskretan toggle u navu
- ako je `prefers-reduced-motion` — preskoči animaciju, prikaži mark statično

### 8.2 Ostalo

- `prefers-reduced-motion` na **svim** scroll animacijama (LAYR to ne radi nigdje)
- Vidljiv fokus na tastaturi — LAYR-ov custom kursor (`cursor-none`) ne smije ukinuti keyboard navigaciju
- Alt tekstovi na svim fotografijama — ti prodaješ fotografiju, ne smiješ je sakriti od pretrage

---

## 9. Tehnička implementacija na `Next-Pixel-NJS`

**Već imaš:** Next 15 (App Router, `src/app/[lang]`), Tailwind 3.4, `framer-motion`, `i18next`, `resend`, `@vercel/analytics`, MDX.

**Dodati:**
```bash
npm i gsap lenis
# opciono, samo ako se radi 3D meni:
npm i three @react-three/fiber @react-three/drei
```

**Podjela poslova:**
- **GSAP + ScrollTrigger + SplitText** → pinovane scene, marquee, reveal naslova, drag mreža
- **Lenis** → smooth scroll (LAYR koristi Lenis, ne ScrollSmoother — isto radi i kod tebe)
- **framer-motion** *(već imaš)* → UI mikrointerakcije, hover stanja, meni tranzicija
- Tailwind 3.4 **ne treba migrirati** — `px-[4vw]` arbitrary vrijednosti rade i u v3

**3D monogram bez GLB fajla:** LAYR skida 1,2 MB model. Tvoj monogram je vektor — može se ekstrudirati direktno iz SVG-a preko `SVGLoader` + `ExtrudeGeometry`. **Nula dodatnih KB**, i geometrija je uvijek u savršenom skladu s logotipom.

**Gdje smo bolji od LAYR-a:**

| LAYR | NextPixel |
|---|---|
| `<img src="*.jpg">`, bez `srcset`, 150–420 KB po slici | `next/image` + AVIF/WebP + `srcset` |
| 8 MB hero MP4 | ≤2 MB, poster slika, `preload="none"` na mobilnom |
| 1,2 MB nekomprimovan GLB | ekstruzija iz SVG-a, 0 KB |
| 934 KB three.js u meniju | isto — **ali lazy, i samo ako meni bude 3D** |
| Nema analitike | `@vercel/analytics` već imaš |
| Statički export na Hostingeru | Vercel |

---

## 10. Šta fali prije nego što se piše kod

Ovo su stvarne blokade, ne formalnost.

| # | Šta fali | Odakle | Bez ovoga |
|---|---|---|---|
| 1 | **NP monogram kao produkcijski SVG** | Logo Guide §8 — trenutno postoji samo AI koncept, „not production-ready" | Nema preloadera, nema 3D-a, nema favicona, nema watermarka |
| 2 | **Radovi u 3 kategorije** — ugostiteljstvo, nekretnine, servis | Klijenti §3.1 | Galerija je prazna, sajt izgleda kao šablon |
| 3 | **Hero video** — dron kadar, ≤2 MB | imaš Gradiška Open materijal | Nema početne |
| 4 | **`nikola@nextpixel.media` + BiH broj** | Templejti — upozorenje prije prve upotrebe | Kontakt strana ne može ići uživo s `icloud.com` i `+43` |
| 5 | **Fotografije vas dvoje** | — | Nema `/o-nama` |
| 6 | **Provjera cijena na tržištu** | Cjenovnik §14 | Cijene na sajtu se teško mijenjaju kasnije |
| 7 | Tekst za `/privatnost` — lica na snimcima, dron | Uslovi §11 | Pravna izloženost |

`/uslovi` **ne fali** — gotov tekst je u Uslovi §15, kopira se direktno.

---

## 11. Faznost

Tvoj vlastiti dokument (Klijenti §3.3) kaže: *„Sajt `nextpixel.media` može čekati. Instagram + galerija su dovoljni prvih šest mjeseci."*

To se ne kosi s ovim planom — samo određuje redoslijed. Ne gradi punu LAYR mašinu prije nego što imaš šta da staviš u nju.

| Faza | Šta | Preduslov |
|---|---|---|
| **0** | Produkcijski SVG monogram, `nextpixel.media` email, 3–5 radova po uvodnoj cijeni | — |
| **1** | Skelet: Lenis + ScrollTrigger, nav, meni (2D), footer, `/kontakt` s resend formom, `/uslovi` | Faza 0 tačke 1 i 4 |
| **2** | Početna sekcije 1–9, `/usluge` s pinovanim panelima | Faza 0 kompletna + provjera cijena |
| **3** | `/radovi` drag mreža, `/o-nama`, preloader animacija | ≥10 radova u galeriji |
| **4** | 3D monogram u meniju, hover-video mreža | sve gore radi i mjeri se |

**Ne obrni redoslijed.** LAYR sajt izgleda tako dobro zato što iza njega stoji 47 odrađenih projekata — mehanika je nosač, materijal je sadržaj.

---

## 12. Gotov copy — spreman za `locales/`

Sve u tvom tonu iz dokumenata: bez buzzwordova, fokus na rezultat, sigurno bez naduvavanja.

**Hero**
> NEXTPIXEL MEDIA
> FOTO · VIDEO · DRON
> Sadržaj za firme, nekretnine i događaje — Gradiška, Banja Luka i okolina.

**Statement**
> Ljudi biraju gdje će jesti, gdje će trenirati i koga će zvati — **po slikama.**
> → Tvoje su slabije nego tvoj posao.

**Intro**
> Nas je dvoje. Snimamo vikendom, jedan do dva posla mjesečno — i zato svaki odradimo do kraja.

**Rokovi**
> Prvi izbor za 48 sati. Kompletne fotografije za 7 dana. Video za 14.
> Rok koji ispuniš svaki put vrijedi više od roka koji zvuči brzo i probije se.

**Tri usluge (početna)**
> **01 Sadržaj za firme** — Snimamo kako radiš.
> **02 Nekretnine i dron** — Objekat koji se proda.
> **03 Eventi i sport** — Dan koji se ne ponavlja.

**Usluge hero**
> JEDNA EKIPA. SVAKI KADAR. SVAKI FORMAT.

**Radovi hero**
> NAŠ RAD.
> Izbor onoga što smo snimili.

**O nama**
> NextPixel Media je media strana NextPixel-a.
> `.dev` gradi sajt — mi snimamo ono što na njemu stoji.

**Kontakt**
> DOBRO DOŠAO. DA SE UPOZNAMO.
> Javljam se u roku od 2 sata.

**Footer kartica**
> Treba ti i sajt?
> → nextpixel.dev

---

*Verzija 1.0 — 26.08.2026. Prati [stranica1.md](stranica1.md) (analiza LAYR-a) i dokumente u `NextPixelMedia/`.*
