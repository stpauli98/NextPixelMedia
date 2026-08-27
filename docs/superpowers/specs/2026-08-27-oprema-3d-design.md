# 3D oprema na stranici usluga — dizajn

> **Datum:** 27.08.2026.
> **Status:** odobren dizajn, čeka plan implementacije
> **Nadograđuje:** [sajt NextPixel Media](2026-08-27-nextpixel-media-sajt-design.md)

**Ovaj spec ukida jedno ograničenje matičnog speca.** Matični §3 kaže „`three` se ne instalira u v1", a §12 stavlja 3D van opsega. Ta odluka je donesena jer je jedini kandidat za 3D tada bio monogram u meniju, koji je tražio produkcijski logotip što još ne postoji. Ovdje 3D dolazi iz drugog razloga i s drugim sadržajem, pa se ograničenje ukida **samo za `/usluge`**. Monogram u meniju ostaje van opsega.

**Nove zavisnosti:** `three`, `@react-three/fiber`, `@react-three/drei`. Alat za obradu modela (`@gltf-transform/cli`) je razvojna zavisnost i ne ide u bundle.

---

## 1. Cilj

Šest pinovanih panela na `/usluge` dobija 3D modele stvarne opreme studija. Oprema objašnjava uslugu — ne stoji kao ukras.

**Uspjeh znači:** posjetilac koji skrola kroz uslugu vidi čime se ona radi, a panel ostaje potpun i kad model ne stigne.

---

## 2. Odluke

| Odluka | Izbor | Razlog |
|---|---|---|
| Svrha | Oprema vezana za uslugu | Objašnjava, ne ukrašava |
| Pokrivenost | Samo gdje je oprema iskren odgovor | Nekretnine ostaju bez modela |
| Domašaj | 3D na svim uređajima | Odluka naručioca; mobilni se štiti obradom modela, ne zamjenskom slikom |
| Pokret | Rotacija vezana za skrol | Isti jezik kao ostatak sajta; bez sukoba sa skrolom na dodiru |
| Arhitektura | Jedno platno, modeli se smjenjuju | Jedan WebGL kontekst umjesto pet |
| Izvor modela | Preuzet i samohostovan `.glb` | Sketchfab iframe nosi tuđi brending i kontrole |

---

## 3. Raspored

| Panel | Model | Osnov |
|---|---|---|
| 01 Sadržaj za firme | Gimbal | Podjela uloga za B2B: „video + gimbal + dron" |
| 02 Nekretnine | — | Kamera je otišla na 06; nekretnine ostaju bez |
| 03 Dron | DJI Mini 4 Pro | Usluga jeste dron |
| 04 Eventi i proslave | Insta360 | Procjena, nije izvedeno iz shot liste |
| 05 Sport i turniri | GoPro Hero 11 | Procjena, nije izvedeno iz shot liste |
| 06 Sajt i sadržaj | Canon R6 | Kamera predstavlja sadržajnu polovinu paketa |

Pet modela, pet panela, bez ponavljanja.

> **Zabilježeno:** Canon R6 je nova oprema koja ne postoji u `docs/brend/NextPixel Media - Produkcijski Proces.md`. Taj dokument u §7.1 izvodi ograničenja („ne prihvatati mračne sale i vjenčanja") iz APS-C senzora Canona R10. S full-frame R6 ta računica pada. Sajt ne pominje opremu ni ograničenja, pa nijedna tvrdnja na njemu nije netačna — ali interni dokument treba osvježiti jer iz njega slijede odluke koje poslove studio prima.

---

## 4. Arhitektura

### 4.1 Platno

Jedan `<Canvas>` na `/usluge`, `fixed`, preko cijelog ekrana, `pointer-events-none`.

Model se crta **isključivo u gornjoj polovini** viewporta. Paneli drže sav sadržaj u donjoj trećini (`justify-end`), pa se model i tekst ne preklapaju bez obzira na redoslijed crtanja. Time se izbjegava petljanje sa `z-index`-om preko `isolate` omotača — problem koji je ovaj projekat već jednom platio.

### 4.2 Stanje

`PinPanel` već drži ScrollTrigger sa `trigger: korijen`. Dodaje mu se `onUpdate` koji upisuje `{ aktivniModel, napredak }` u **modul van Reacta**.

Rotacija se računa na svakoj sličici. Da ta vrijednost ide kroz `useState`, stranica bi se renderovala šezdeset puta u sekundi. Renderer čita mutabilnu vrijednost u svojoj petlji; React stanje mijenja se samo kad panel uđe ili izađe iz vidnog polja.

### 4.3 Učitavanje

Model se dovlači kad njegov panel priđe, ne prije. Panel bez opreme ne učitava ništa. Posjetilac koji prođe cijelu stranicu na kraju je povukao svih pet — ali raspoređeno kroz skrol, ne odjednom na dolasku.

### 4.4 Isključene animacije

Rotacija je vezana za skrol, ne za vrijeme, pa nije samostalan pokret. Pri `prefers-reduced-motion: reduce` model stoji u fiksnom uglu. Funkcija se ne uklanja — model se i dalje vidi.

---

## 5. Licence i atribucija

Licenca je preduslov, ne formalnost.

| Licenca | Posljedica |
|---|---|
| CC0 | Slobodno |
| CC BY | Dozvoljeno uz **vidljivu** atribuciju autoru |
| CC BY-NC | **Zabranjeno** — sajt je komercijalan. Model se mijenja. |
| Sketchfab Store | Po uslovima kupovine |

Svaki model se provjerava prije nego što uđe u repo.

### Atribucija je podatak

Novi modul `src/content/modeli.ts` nosi po modelu:

```ts
type Model = {
  id: string          // ime fajla bez ekstenzije, npr. 'dji-mini-4-pro'
  usluga: string      // mora se poklapati sa Usluga.broj iz usluge.ts: '01'...'06'
  autor: string
  licenca: 'CC0' | 'CC BY' | 'Sketchfab Store'
  izvor: string       // URL izvorne stranice modela
}
```

`licenca` namjerno **ne sadrži `CC BY-NC`** — takav model ne smije ući u repo, pa mu ni tip ne treba postojati.

Pravna obaveza time postaje testabilna i ne može se izgubiti pri refaktoru. Vidljiva linija sa zaslugama stoji diskretno na dnu `/usluge`.

---

## 6. Obrada modela

| Stavka | Granica |
|---|---|
| GLB nakon kompresije | **≤ 800 KB**, cilj 500 KB |
| Teksture | najviše 1024×1024, WebP |
| Geometrija | Draco kompresija |

Obrada kroz `gltf-transform`. Sirovi Sketchfab eksport **ne ulazi u repo**. Model koji nakon obrade ne stane u granicu vraća se na doradu ili se traži drugi.

Modeli žive u `public/modeli/`.

---

## 7. Otkazi

**Panel je potpun bez modela.** Model živi u praznom gornjem dijelu ekrana; sav sadržaj panela je u donjoj trećini. Ako model ne stigne, uređaj nema WebGL, ili se kontekst izgubi — panel i dalje čita kompletno.

**Bez spinnera.** Vrtuljak na mjestu gdje posjetilac ne zna da nešto treba da bude samo skreće pažnju na odsustvo.

**Izgubljen WebGL kontekst** — telefon u pozadini, reset GPU-a — ne smije srušiti stranicu. Platno hvata taj događaj i prestaje.

---

## 8. Zaštita

`scripts/check-placeholders.mjs` već obara produkcijski build zbog tri sentinela. Dodaje se četvrti: **model bez potpune licence i atribucije ne prolazi.**

---

## 9. Testiranje

| Šta | Kako |
|---|---|
| Svaki model gađa postojeću uslugu | Vitest |
| Nijedna usluga nema dva modela | Vitest |
| Svaki model ima autora, licencu i izvor | Vitest |
| Zaštita obara build na modelu bez licence | Vitest |
| Platno postoji, nema grešaka u konzoli, nema horizontalnog prelivanja | Playwright |

**Ne testira se jedinično:** da li se model iscrtava, okreće kako treba i izgleda dobro. To je oko — isto kao animacije kroz cijeli projekat.

**Obavezna provjera prije prihvatanja:** stvarno izmjeren prenos i broj sličica na **prigušenoj mobilnoj vezi**, ne na lokalnom serveru. Odluka je bila 3D na svim uređajima; ako model od 800 KB na 3G čini panel neupotrebljivim, to se mora znati prije nego što uđe.

---

## 10. Van opsega

3D monogram u meniju · slobodna rotacija mišem ili prstom · zumiranje · modeli na drugim stranicama · opremna sekcija van `/usluge`.

---

## 11. Preduslovi

| # | Šta | Bez toga |
|---|---|---|
| 1 | Pet modela sa provjerenim licencama | Ništa ne ulazi u repo |
| 2 | Zamjena za svaki CC BY-NC model | Taj panel ostaje bez opreme |
| 3 | Potvrda za panele 04 i 05 | Sajt bi tvrdio praksu koja nije potvrđena |

---

## 12. Rizici

**Model prelazi budžet nakon obrade.** Sketchfab modeli često nisu pravljeni za web. Ublaženo tvrdom granicom i spremnošću da se model odbaci.

**Mjerenje na 3G pokaže da je neupotrebljivo.** Odluka o 3D svuda je naručiočeva i donesena uz iznesenu procjenu. Ako mjerenje to opovrgne, odluka se preispituje s podacima umjesto s procjenom.

**Redoslijed crtanja platna preko `isolate` omotača.** Jedini netrivijalan spoj. Provjerava se u browseru, ne pretpostavlja.
