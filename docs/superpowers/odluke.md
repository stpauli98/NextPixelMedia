# Dnevnik odluka — izgradnja sajta, 27.08.2026.

> Ovo je zapis svake odluke donesene tokom izvršavanja plana
> [2026-08-27-nextpixel-media-sajt.md](plans/2026-08-27-nextpixel-media-sajt.md),
> uz cijenu ako je odluka pogrešna. Sačuvano jer 53 odluke ne smiju živjeti
> samo u transkriptu razgovora.

Grana: feat/sajt (repo je bio prazan; grana napravljena prije prvog dispatcha)
Spec: docs/superpowers/specs/2026-08-27-nextpixel-media-sajt-design.md

## Pre-flight skeniranje

### Parovi zadataka koji dijele fajl ili interfejs

| Fajl / interfejs | Proizvodi | Troši | Nalaz |
|---|---|---|---|
| `src/styles/globals.css` | T1 kreira | T9 dopunjuje (.linija) | Aditivno, bez sudara |
| `src/app/layout.tsx` | T1 kreira | T5, T6, T16, T17 mijenjaju | Sekvencijalno aditivno; T17 zamjenjuje T1 metadata namjerno |
| `src/app/page.tsx` | T1 stub | T9, T10, T11, T12 zamjenjuju | Svaki daje pun ili jasno opisan sastav; T12 traži dodavanje uvoza |
| `slika(id,w,h)` / `video(id)` / `jePlaceholder` | T3 | T9, T10, T11, T13, T14, T15 | Potpisi se poklapaju u svim pozivima |
| `usluga-NN` seed | T11 (900x1200) | T13 (1920x1080) | Isti seed, druge dimenzije — namjerno, ista slika kroz sajt |
| `Okvir/Labela/Dugme/Broj` | T4 | T6, T10, T11, T12, T13, T15 | Propsi se poklapaju |
| `useGsap(setup, deps)` | T5 | T9, T10, T13, T14, T16 | Generik + korijen param usklađen u svim pozivima |
| `RUTE` | T6 | T6 (Meni, Footer), T17 (sitemap) | OK |
| `upitShema` i oznake | T7 | T8 | OK; Forma ne treba NAJKRACE_POPUNJAVANJE_MS (serverska provjera) |
| Stub rute | T6 | T8, T13, T14, T15 zamjenjuju | OK; T14 uklanja `export const metadata` iz klijentske strane i seli ga u layout.tsx |

### Samodosljednost pojedinih zadataka

| Zadatak | Nalaz |
|---|---|
| T1 | **NALAZ**: test je zavisio od tačnog broja razmaka u CSS-u — formatter bi ga oborio |
| T2 | Testovi i podaci se slažu (19 radova ≥ 18, 6 usluga, 6 faza, 1 istaknut paket na indeksu 1) |
| T3 | Vitest include pokriva `scripts/**/*.test.mjs`; guard izlazi 1 samo kad je pozvan direktno |
| T4 | **NALAZ**: Okvir je renderovao `<span>`, a T13 stavlja `<div>` unutra — nevažeći HTML |
| T5–T9 | Testovi opisuju kod koji zadatak piše; nema protivrječja |
| T10–T13 | Animacije idu kroz useGsap; PinPanel pinuje samo na desktopu |
| T14 | **NALAZ**: wrap je računao `scrollWidth/2` nad grid layoutom koji nije horizontalno udvostručen |
| T15–T17 | OK |

## Rulings

Ruling: T1 test normalizuje razmake prije poređenja — whitespace-osjetljiv assert je lažni pad koji bi Prettier izazvao. Cijena ako griješim: test je nešto labaviji, i dalje hvata pogrešno ime tokena.

Ruling: Okvir renderuje `<div class="inline-block"` umjesto `<span>` — span sa blok djetetom je nevažeći HTML, a Okvir obavija i kartice paketa. Cijena ako griješim: nijedna poznata; inline-block čuva postojeći raspored dugmadi.

Ruling: DragMreza se prepisuje — jedna ploča se ponavlja 2x2 uz apsolutno pozicionirane ćelije, pa su širina i visina ploče poznat broj umjesto mjerenja iz layouta. Cijena ako griješim: više koda nego grid varijanta, ali grid varijanta jednostavno ne bi omotavala bešavno.

Ruling: rad ide na grani `feat/sajt` bez zasebnog worktreea — repo je bio prazan i ništa drugo nije u toku, pa je grana dovoljna izolacija. Cijena ako griješim: nijedna; grana se briše ili mijenja bez posljedica.

## Napredak

Task 1: dispatched (BASE 352ce4e, model sonnet)
Task 1: implementer DONE (commit 3211e54, 2/2 testa) — review dispatched (sonnet)
Task 1: review spec ❌ — 2 Important (oba plan-mandated), 3 Minor

Ruling: nedostajuci `max-md:` na text-[8vw] u page.tsx se popravlja. Global constraint trazi vw + max-md set, a plan ga je u Step 5 izostavio — nalaz je protiv plana i plan grijesi. Cijena ako grijesim: nikakva, jedna klasa na stranici koju Task 9 ionako zamjenjuje.

Ruling: vitest.config.ts se preimenuje u .mts i gubi __dirname. Plan je mandirao .ts sa __dirname, sto pod Vitest 4 daje advisory upozorenje — a test izlaz mora biti cist. .mts rjesava i ESM i __dirname bez diranja package.json. Cijena ako grijesim: ako .mts pravi problem, povratak na .ts uz "type": "module".

Ruling: Montserrat 600 se izbacuje iako je recenzent ocijenio Minor. Global constraint doslovno kaze 700/800, pa je ovo krsenje ogranicenja a ne poliranje, i mijenja se u istom fajlu kao nalaz iznad. Cijena ako grijesim: ako neki kasniji task zatrazi 600, vraca se jedan clan niza.

Task 1: minor (deferred): test cita globals.css putanjom relativnom na CWD, radi samo iz korijena repoa
Task 1: minor (deferred): nema regresijskog testa da Tailwind stvarno kompajlira tokene u upotrebljive klase
Task 1: fix round 1/5 dispatched (FIX_BASE 3211e54)
Task 1: fix round 1/5 (3 addressed, 0 open; commits 3211e54..d485db2)
Task 1: complete (commits 352ce4e..d485db2, review clean)
Task 2: dispatched (BASE d485db2, model sonnet)
Task 2: implementer DONE (commit 3e8d4e6, 13/13) — review: spec OK, kvalitet odobren, 1 Important (netacan broj testova u TDD evidenciji izvjestaja), 1 Minor
Task 2: minor (deferred): rokovi test pinuje isti literal koji modul izvozi — plan-mandated, najslabiji test u skupu
Task 2: fix round 1/5 dispatched (FIX_BASE 3e8d4e6) — ispravka izvjestaja, bez izmjene koda
Ruling: fix round bez ijedne izmjene koda provjeravam sam citanjem, umjesto da dispatchujem re-review agenta. Izvjestaj je git-ignorisan scratch fajl, diff je prazan, pa re-review nema sta da pregleda. Potvrdjeno: izvjestaj kaze 11+2=13, stvarni brojevi it() blokova su 11 i 2. Cijena ako grijesim: propustena greska u disposable artefaktu koji se brise na kraju; kod je vec odobren.
Task 2: fix round 1/5 (1 addressed, 0 open; bez code commita — samo izvjestaj)
Task 2: complete (commits d485db2..3e8d4e6, review clean, 1 parked minor)
Task 3: dispatched (BASE 3e8d4e6, model haiku)
Task 3: complete (commits 3e8d4e6..da7fc72, review clean — spec OK, kvalitet odobren, 0 Critical/Important)
Task 3: minor (deferred): guard test ne pokriva stvarni format media.ts sa TS anotacijom — recenzent rucno potvrdio da regex radi, ali test to ne dokazuje. ZA FINALNI REVIEW: ovo je jedina zastita izmedju placeholdera i produkcije, vrijedi trijazirati.
Task 3: minor (deferred): guard cita media.ts putanjom relativnom na cwd, radi samo iz korijena repoa
Task 4: dispatched (BASE da7fc72, model haiku)
Task 4: review spec ❌ — 2 Important, 1 Minor

Ruling: hover translate od 0.2vw dobija max-md: pratioca (0.65vw). Global constraint trazi par za svaku vw mjeru, a plan ga je izostavio bas na ovim klasama. Omjer je izveden iz velicine ugla: mobilni 1.8vw / desktop 0.55vw = 3.27, pa 0.2 x 3.27 ~ 0.65. Cijena ako grijesim: hover se na dodiru ionako rijetko okida, pa je efekat kozmeticki.

Ruling: izvjestaj mora reci sta je stvarno provjereno umjesto da tvrdi vizuelnu provjeru. Implementer je curl-ovao SSR HTML i potvrdio da su klase prisutne — to je staticka provjera koja bi prosla i da su uglovi okrenuti naopako. Stvarna vizuelna potvrda hovera se odlaze na Task 17 gdje Playwright prolaz ionako postoji. Cijena ako grijesim: geometrija uglova ostaje nepotvrdjena okom do Taska 17; recenzent je rucno provjerio da su sve cetiri transformacije razlicite i da se sve sire prema van.

Task 4: minor (deferred): Okvir se siri samo na hover, nema group-focus-visible parnjaka — korisnik na tastaturi ne vidi brend animaciju
Task 4: fix round 1/5 dispatched (FIX_BASE 1c01b13)
Task 4: fix round 1/5 (2 addressed, 0 open; commits 1c01b13..f038b71)
Task 4: complete (commits da7fc72..f038b71, review clean, 1 parked minor)
Task 5: dispatched (BASE f038b71, model sonnet)
Task 5: complete (commits f038b71..c7ff60a, review clean — spec OK, kvalitet odobren, 0 Critical/Important)
Task 5: minor (deferred): document.fonts.ready callback u SmoothScroll nema unmount guard — nekancelirani efekat, bezopasan u praksi
Task 5: minor (deferred): reduced-motion se cita jednom na mountu, bez change listenera — promjena OS postavke uz otvoren tab ne prekida Lenis
Napomena: recenzent je odstupanje sa gsap.core.globals() provjerio protiv node_modules izvora i potvrdio da je tip-gap stvaran, cast uzak i ponasanje nepromijenjeno. Prihvaceno.
Task 6: dispatched (BASE c7ff60a, model sonnet)
Task 6: review spec ❌ — 3 Important, 3 Minor, 2 ⚠️

⚠️ razrijesen: RUTE ima 5 unosa bez /uslovi i /privatnost, ali Task 17 sitemap ih dodaje eksplicitno preko `dodatne` niza. Provjereno u planu. Nije rupa — RUTE su namjerno samo navigacijske rute.
⚠️ Playwright tvrdnja: recenzent kaze da je narativ konzistentan sa stvarnom sesijom ali neprovjerljiv iz diffa. Prihvatam — Task 17 ionako radi vizuelni prolaz.

Ruling: "tekst ne zivi u JSX-u" se prosiruje i na chrome mikrokopiju (nav, meni, footer, stranice gresaka), a NE na stub rute koje kasniji zadaci ionako zamjenjuju. Svrha ogranicenja iz speca je dvostruka — mijenjati copy bez diranja animacija, i imati sav prevodivi tekst na jednom mjestu za kasniji engleski. Oba razloga vaze za "Zapocni projekat" jednako kao za hero copy. Popravlja se sada, na Tasku 6, jer bi inace jos 11 zadataka kopiralo isti obrazac. Cijena ako grijesim: malo vise indirekcije za stringove koji se rijetko mijenjaju.

Ruling: px-[6vw] na stranicama gresaka postaje px-[4vw] max-md:px-[6vw] umjesto da dobije no-op pratioca. Tako su stranice gresaka konzistentne sa svakom drugom stranicom sajta i ogranicenje je zadovoljeno smisleno, a ne mehanicki. Cijena ako grijesim: nikakva.

Ruling: fokus u meniju se popravlja sada, ne odlaze. Ozbiljniji dio nalaza je da su linkovi ZATVORENOG menija i dalje u tab redoslijedu (opacity-0 i pointer-events-none ih ne uklanjaju), pa korisnik na tastaturi prolazi kroz pet nevidljivih linkova. To je stvarna greska, ne poliranje. Puni focus trap preko pozadine se odlaze. Cijena ako grijesim: inert atribut trazi React 19, sto projekat ima.

Task 6: minor (deferred): metadata izvozi u stub rutama nisu tipizirani kao Metadata
Task 6: minor (deferred): error.tsx tipizira prop kao Error umjesto Error & { digest?: string }
Task 6: fix round 1/5 dispatched (FIX_BASE 7a09b00)
Task 6: fix round 1/5 (4 addressed, 0 open; commits 7a09b00..3cac0af)
Task 6: complete (commits c7ff60a..3cac0af, review clean, 3 parked minora)
Task 6: minor (deferred): zatvoriMeni nije u useCallback, pa se Escape listener registruje ponovo na svaki Nav render dok je meni otvoren — nije curenje ni dvostruko okidanje, samo nepotrebno
Task 7: dispatched (BASE 3cac0af, model sonnet)
Ruling: Dockerfile mijenja bazu sa node:22-alpine na node:20-alpine, koja je vec lokalno prisutna. Docker korak postoji da se backend testira u kontejneru sa .env fajlom, ne da pinuje odredjenu Node minor verziju. Implementer je zapeo cekajuci pull. Cijena ako grijesim: ako neki alat trazi Node 22+, vraca se na 22-alpine uz jedan pull.
Task 7: review spec OK, kvalitet "needs fixes" — 1 Important, 3 Minor

Ruling: dodaju se tvrdnje nad stvarnim payloadom koji ide mail provideru. Testovi su provjeravali da li je posalji pozvan, ali nikad sta mu je proslijedjeno — a cijeli endpoint postoji zato da mejl nosi sve sto treba za ponudu. Preimenovano polje u tijeluEmaila ili obrnut replyTo uslov prosli bi cijeli suite. Cijena ako grijesim: nekoliko redova testa vise.

Ruling: .dockerignore se dodaje iako je ocijenjen Minor. Recenzent je imenovao konkretnu opasnost — COPY . . uvlaci host node_modules u linux kontejner, sto je danas bezopasno samo zato sto native paketi imaju per-platform imena. To je latentna greska, ne poliranje, a build kontekst je 660MB na svaki build. Cijena ako grijesim: jedan fajl od tri reda.

Ruling: dodaje se test za malformed JSON granu. Zadatak je radjen TDD-om, a ta grana je jedina netestirana; test ide u fajl koji se ionako mijenja. Cijena ako grijesim: jedan test vise.

Task 7: minor (deferred): route ima hardkodovane fallback adrese umjesto da padne kad env var fali — ZA KORISNIKA: te adrese jos ne postoje, odluka je njegova
Task 7: fix round 1/5 dispatched (FIX_BASE 68cb1b5)
Task 7: fix round 1/5 (3 addressed, 0 open; commits 68cb1b5..ee0a037)
Task 7: complete (commits 3cac0af..ee0a037, review clean, 1 parked minor za korisnika)
Napomena: .dockerignore je smanjio build kontekst sa ~660MB na 9.13kB
Task 8: dispatched (BASE ee0a037, model sonnet)
Task 8: review spec ❌ — 4 Important, 3 Minor

Ruling: mailto rezerva mora nositi korisnikov tekst. Nalaz je plan-mandated, ali pogadja svrhu: rezerva postoji tacno za slucaj kad slanje padne, a trenutno korisnik mora rucno prekucati sve sto je vec upisao — to je "dodatno dopisivanje" koje forma treba da ukine. Cijena ako grijesim: nekoliko redova vise i duzi mailto link.

Ruling: aria-live i aria-pressed se dodaju. Implementer je naveo da postojeci kod nema aria-live; presedan ne smanjuje tezinu. Ovo je jedina tacka konverzije na sajtu — korisnik citaca ekrana koji posalje formu i dobije tisinu ne zna ni da li je uspjelo. aria-pressed je isti problem na chipovima: izbor se saopstava samo bojom. Cijena ako grijesim: nikakva.

Ruling: sest vw bez max-md para se popravlja. Isti propust po treci put u projektu, opet iz teksta plana. Cijena ako grijesim: nikakva.

Task 8: minor (deferred): metadata.title ostaje hardkodovan dok je description presao u tekstovi — nedosljedno, ali trazi prolaz kroz sve stranice
Task 8: minor (deferred): tip default hardkoduje 'firma' umjesto TIPOVI[0]
Task 8: minor (deferred): Forma.tsx nema automatizovan test — ZA FINALNI REVIEW: jedina tacka konverzije na sajtu bez pokrivenosti; spec je namjerno izostavio komponentne testove (nema jsdom), pa je ovo svjesna rupa
Task 8: fix round 1/5 dispatched (FIX_BASE 41cbe96)
Task 8: fix round 1/5 (4 addressed, 0 open; commits 41cbe96..f18a890) — ali re-review nasao novu gresku u fix diffu

Ruling: zastarjeli mailto se popravlja u rundi 2. Klijentska validacija koja padne ne resetuje stanje, pa nakon serverske greske korisnik moze izmijeniti polje da bude nevalidno, ponovo poslati, i dobiti stari error banner sa mailto linkom iz RANIJEG pokusaja — uz nove greske po poljima. Mailto tada nudi da posalje vrijednosti koje se vise ne vide u formi. To je aktivno obmanjujuce na jedinoj putanji konverzije, i popravlja se jednom linijom. Cijena ako grijesim: nikakva.

Task 8: minor (deferred): tri role="alert" cvora se okidaju istovremeno pri praznom submitu; recenzent kaze da je to posljedica mog vlastitog teksta nalaza ("per-field errors"), i da bi jedan grupni alert bio robusniji obrazac
Task 8: fix round 2/5 dispatched (FIX_BASE f18a890)
Task 8: fix round 2/5 (1 addressed, 0 open; commits f18a890..0267d43)
Task 8: complete (commits ee0a037..0267d43, review clean, 4 parked minora)
Task 9: dispatched (BASE 0267d43, model sonnet)
Task 9: implementer DONE (commit 6090d66) — prijavio odstupanje koje je STVARNA GRESKA U PLANU

Ruling: trigger u ScrollTriggeru mora biti `korijen` (DOM cvor), ne selektor koji gadja sam scope korijen. Selektori unutar gsap.context traze POTOMKE scope elementa, pa '[data-hero]' na <header ref={scope} data-hero> nikad ne pogodi. ScrollTrigger tada tiho pada na cijeli dokument — implementer je izmjerio end: 2026 umjesto 900, tj. hero se pinovao kroz skoro cijelu stranicu. Odstupanje prihvaceno.
Ruling: ista greska je pronadjena i u Tasku 10 (Vizir, trigger: '[data-vizir]' na scope korijenu). Plan je ISPRAVLJEN prije dispatcha i task-10-brief regenerisan. Provjereno da Statement (data-statement je na unutrasnjem <p>) i PinPanel/DragMreza (vec koriste korijen) nisu pogodjeni. Cijena ako grijesim: nikakva — trigger: korijen je striktno tacniji od selektora.
Task 9: review spec ❌ — 2 Important (oba plan-mandated), 2 Minor

Ruling: SplitText dobija mask: 'lines'. Recenzent je procitao node_modules/gsap/src/SplitText.js i dokazao da se maske prave SAMO kad je vars.mask postavljen; bez toga linesClass pada na isti element koji se transformise, a overflow:hidden ne kljuca vlastitu transformaciju elementa. Znaci .linija je bila inertna, a linije je krio iskljucivo opacity — pa tokom prelaza tekst moze da procuri u susjedni red, posebno uz leading 0.85. Provjereno: SplitText se u planu koristi samo ovdje, nema propagacije. Cijena ako grijesim: ako mask nije podrzan u 3.15, vraca se rucni wrapper.

Ruling: hero wordmark i scroll hint idu u tekstovi. Ogranicenje je apsolutno, a tekstovi.hero.naslov vec postoji i stoji NEISKORISTEN tacno pored hardkodovanog stringa. Cijena ako grijesim: nikakva.

Ruling: hero dobija motion-reduce:h-screen. Ocijenjeno Minor, ali korisnik sa iskljucenim pokretom trenutno skroluje 100vh praznog hero prostora bez ijedne animacije — a Tailwind ima motion-reduce varijantu, pa je popravka jedna klasa u fajlu koji se ionako mijenja. Cijena ako grijesim: nikakva.
Task 9: fix round 1/5 dispatched (FIX_BASE 6c62433)
Task 9: fix round 1/5 (3 addressed, 0 open; commits 6c62433..9501d2a)
Task 9: complete (commits 0267d43..9501d2a, review clean)
Task 9: minor (deferred): reduced-motion hero i dalje 200vh na desktopu — rijeseno motion-reduce klasom
STOJECI PROPUST ZA FINALNI REVIEW: nijedna sekcija dosad nije pogledana na stvarnoj mobilnoj sirini, samo staticka provjera max-md klasa. Task 17 Playwright prolaz na 390px je prvo mjesto gdje se to zaista vidi.
Task 10: dispatched (BASE 9501d2a, model sonnet)
Task 10: review spec ❌ — 3 Important, 4 Minor

Ruling: HUD gubi izmisljene ekspozicijske podatke (f/2.8, 1/250, ISO 400, REC). Dva razloga. Prvo, logo guide §2 zabranjuje blendu i zatvarac "as the primary mark" i trazi da identitet govori produkcija a ne fotograf — a ekspozicija je bas fotografski rjecnik. Vizir kao motiv je izricito dozvoljen, pa okvir i krstic fokusa ostaju. Drugo i vaznije: to su IZMISLJENI podaci na placeholder slici, a projekat ima apsolutno pravilo da se nista ne izmislja. Lijevi HUD postaje istinita servisna linija (FOTO / VIDEO / DRON), desni zadrzava mjesto i godinu bez laznog REC indikatora. Cijena ako grijesim: HUD djeluje manje tehnicki, ali djeluje istinito.

Ruling: sizes atributi postaju breakpoint-svjesni. Isti fajl to vec radi ispravno na trecoj slici, pa je obrazac bio poznat i samo nije primijenjen. Na mobilnom se slika dohvata za 72vw a renderuje na 100vw. Cijena ako grijesim: nikakva.

Ruling: dodaje se onBlur i aria-hidden na pregled. Korisnik na tastaturi koji prodje kroz zadnju plocicu ostavlja pregled zauvijek na ekranu jer ga nista ne gasi. Uz to pregled duplira alt tekst plocice u a11y stablu. Cijena ako grijesim: nikakva.

Task 10: minor (deferred): glif ▶ i separator · su inline u JSX-u — recenzent potvrdio da prati postojeci presedan (Footer ima → isto tako)
Task 10: minor (deferred): tri reda paralakse daju samo dva razlicita obrasca (redovi 0 i 2 identicni) — iz mog plana; prozni opis obecava razlicite brzine
Task 10: fix round 1/5 dispatched (FIX_BASE 822808a)
Task 10: fix round 1/5 (3 addressed, 0 open; commits 822808a..d979a6f)
Task 10: complete (commits 9501d2a..d979a6f, review clean, 2 parked minora)
Task 11: dispatched (BASE d979a6f, model sonnet)
Task 11: review spec OK, kvalitet odobren — 1 Important (plan-mandated), 1 Minor

Ruling: 'use client' se uklanja iz TriUsluge. Komponenta nema ni hook ni handler — group-hover i group-focus-visible su cisti CSS, a next/link i next/image rade u server komponentama. Direktiva je dolazila iz mog plana. Revidirao sam SVE klijentske komponente u projektu: od deset, devet je legitimno (useState, useGsap, usePathname, handleri), TriUsluge je jedina suvisna. Cijena ako grijesim: ako nesto u njoj ipak zatrazi klijent, direktiva se vraca jednom linijom.

Task 11: minor (deferred): veliki navodnik u Citat.tsx je apsolutno pozicioniran preko blockquote — treba oko, ide u Task 17
STOJECI PROPUST (dopuna): WebkitTextStroke obrisni brojevi i mobilno slaganje kolona nisu vidjeni u browseru. Provjereno je samo da se stilovi emituju. Task 17 mora oboje pogledati.
Task 11: fix round 1/5 dispatched (FIX_BASE 3b1fc5d)
Task 11: fix round 1/5 (1 addressed, 0 open; commits 3b1fc5d..9a49f48)
Task 11: complete (commits d979a6f..9a49f48, review clean, 1 parked minor)
Task 12: dispatched (BASE 9a49f48, model haiku)
Task 12: review spec ❌ — 3 Important (svi plan-mandated). Kontroler dodatno uradio vizuelnu provjeru u browseru.

NALAZ KONTROLERA (izmjeren, ne procijenjen): sampanj tekst na cream pozadini ima kontrast 2.09:1. WCAG AA za veliki tekst trazi 3:1 — pada. Izmjereno u browseru: gray na cream 2.94 (takodje pada), crno na cream 17.64, sampanj na crnom 8.43 (odlicno). Znaci sampanj kao TEKST radi samo na tamnim povrsinama. Pogodjeni: Rokovi brojevi (ogromni), Statement naglasena rijec, i buduci Paketi u Tasku 13.

Ruling: na svijetlim povrsinama akcenat prelazi sa sampanja na navy; sampanj ostaje akcenat na tamnom i pozadina cipova/naljepnica sa crnim tekstom. Navy je u paleti i logo guide ga sam koristi na svijetloj podlozi za N monograma. Ovo cuva ulogu sampanja i popravlja mjerljiv pad. Cijena ako grijesim: brojevi na Rokovima postaju plavi umjesto zlatni — vizuelna promjena koju korisnik moze vratiti ako mu je citljivost manje bitna od izgleda.

Ruling: Broj dobija prop za svijetlu temu umjesto arbitrarnog selektora koji poseze u njegov DOM. Recenzent je potvrdio da selektor danas radi zbog specificnosti, ali puca tiho cim se markup Broja promijeni. Prop rjesava i to i kontrast odjednom. Cijena ako grijesim: jedan prop vise.

NALAZ KONTROLERA: treca naljepnica na desktopu lebdi DESNO OD rijeci, izvan nje. Uzrok nije vertikalni kako je recenzent pretpostavio nego horizontalni — wrapper je pune sirine, a rijec zauzima oko 55%, pa left:64% pada u prazno. Na mobilnom je ispravno. Recenzentova strukturna analiza je bila tacna po mehanizmu ali pogresna po osi.

Ruling: overlap naljepnica preko rijeci je NAMJERAN (referentni dizajn radi isto) i ostaje. Popravlja se samo horizontalni raspon da sve tri padnu na rijec i na desktopu. Cijena ako grijesim: naljepnice se pomjere par procenata.

Ruling: rucno pisane uglaste zagrade u Testimonijali zamjenjuju se komponentom Labela koja za to i postoji. Kod je uspavan (niz prazan), pa je rizik nula, a divergencija nestaje prije nego sto se ijedna prava preporuka prikaze. Cijena ako grijesim: sitna stilska razlika.
Task 12: fix round 1/5 dispatched (FIX_BASE acb71dc)
Task 12: fix round 1/5 (4 addressed, 0 open; commits acb71dc..00cff56)
Task 12: complete (commits 9a49f48..00cff56, review clean) — POCETNA STRANICA KOMPLETNA
Task 12: minor (deferred): positions niz se rekreira u svakoj iteraciji mape; fallback bi tiho sudario cetvrtu naljepnicu sa prvom ako sadrzaj naraste
STOJECI NALAZ ZA FINALNI REVIEW: kontrast na cream povrsinama treba sistemski prolaz. Izmjereno: gray #8A919B na cream je 2.94:1 — pada AA i za veliki tekst. Labela podrazumijevano koristi text-gray, a koristi se i na cream sekcijama (Paketi u Tasku 13, Rokovi). Rijeseno je samo za Broj. Ostatak treba revizija.
Task 13: dispatched (BASE 00cff56, model sonnet)
Task 13: review spec OK, kvalitet "needs fixes" — 1 Important (strukturni), 1 provjereni ne-nalaz (Nav z-999 je siguran)

Ruling: z-index se rjesava izolacijom stacking konteksta, ne odbrambenim z-index-om po sekciji. Uzrok: paneli ostaju position:relative sa pozitivnim z-index i nakon sto im pin zavrsi, a pozicionirani element se po CSS paint redoslijedu crta IZNAD nepozicioniranog sibling-a bez obzira na redoslijed u DOM-u. Zato je Paketi bio sakriven, i zato je Footer bio sljedeci na redu — on je na SVAKOJ stranici. Rjesenje: omotac oko sekvence panela sa isolation:isolate (Tailwind `isolate`), koji zatvara njihove z-indexe u vlastiti kontekst. Vazno: omotac NE smije biti position:relative, jer bi tada i sam bio pozicioniran i crtao se iznad statickih sekcija koje slijede. isolation sam po sebi pravi stacking kontekst bez pozicioniranja, i ne pravi containing block za position:fixed, pa GSAP pin i dalje radi.
Cijena ako grijesim: ako isolate omета pin, vraca se na odbrambeni z-index na Paketi i Footer — ali tada moraju oba, ne samo jedan.

Napomena: ovo rjesava i ⚠️ o osjetljivosti na visinu viewporta — izolacija ne zavisi od geometrije.
Task 13: fix round 1/5 dispatched (FIX_BASE e778d13)
ISPRAVKA MOG RULINGA: bio sam u krivu. Tvrdio sam da staticki element sa isolation:isolate crta u istoj grupi kao obicni staticki susjedi, pa da omotac sam po sebi rjesava problem. Implementer je napravio izolovani CSS repro i pokazao da element koji formira stacking kontekst crta u grupi "stacking konteksti sa z-index 0", koja dolazi POSLIJE obicnih statickih potomaka — dakle iznad kasnijih statickih susjeda bez obzira na DOM redoslijed.
Prihvaceno rjesenje implementera: isolate se dodaje i na Paketi i na Footer, pa sva tri elementa zavrse u istoj grupi crtanja i redoslijed u DOM-u presudjuje. Bez magicnih brojeva i bez znanja o broju panela. Footer.tsx je izvan originalne liste fajlova Taska 13, ali je izlozen istim mehanizmom na svakoj stranici, pa je izmjena opravdana.
Task 13: fix round 1/5 (1 addressed, 0 open; commits e778d13..e4d6f38)
Task 13: complete (commits 00cff56..e4d6f38, review clean)
Task 13: ZA FINALNI REVIEW (ne blokira, ali vrijedi popraviti u jednom fix talasu): resenje sa isolate radi zato sto su SVA TRI susjeda izolovana. Bilo koja buduca obicna staticka sekcija ubacena medju njih — u usluge/page.tsx ili u root layout iza {children} — bez `isolate` klase bi zavrsila u ranijoj grupi crtanja i bila nevidljiva. To znanje trenutno postoji samo u izvjestaju. Lijek: kratak komentar na sva tri mjesta gdje stoji `isolate`, koji objasnjava zasto je tu i sta se trazi od novih susjeda.
Task 13: minor (deferred): isolate na Footer je danas inertan, ali Footer je globalan — ako ikad dobije fixed/sticky element sa visokim z-indexom, njegov stacking bi bio zarobljen u Footer kontekstu
Task 14: dispatched (BASE e4d6f38, model sonnet)
Task 14: review spec ❌ — 5 Important, 3 Minor. Najjaci review u projektu.

Ruling: konstante mreze su pogresne i mijenjaju se. Provjerio sam racun sam. Desktop: kolone 4 x (22+1) = 92vw ploca, viewport 100vw. Sa dvije kopije sadrzaj ide do 184vw, a vidljivi prozor pri x=-92 ide do 192vw — 8vw prazne trake, deterministicki, na svaki puni horizontalni ciklus. Tehnika sa dvije kopije radi samo ako je ploca >= viewport. Mobilni je isti (2 x 46 = 92). Nove konstante moraju dati plocu >= 100vw po obje ose. Cijena ako grijesim: vidi se vise ili manje celija odjednom.

Ruling: broj redova se ne smije izvoditi samo iz broja filtriranih stavki. SPORT ima 2 rada, DRON 3, EVENTI 4 — svi <= broja kolona, pa redova = 1 i ploca je 17vw visoka dok je desktop viewport oko 59vw. Dvije kopije daju 34vw, ostatak je praznina bez ikakvog nacina da se skroluje dalje jer je kontejner overflow-hidden. Rjesenje: minimalan broj redova se racuna iz stvarne visine viewporta, a celije se pune sa stavke[i % stavke.length]. Time se usput rjesava i prazna zadnja nepotpuna vrsta. Cijena ako grijesim: isti rad se ponavlja u mrezi kod rijetkih kategorija — sto je ionako slucaj, jer se ploca ponavlja 2x2.

Ruling: Observer izlazi iz BEZ_REDUKCIJE grane. Ovo je moj propust u dizajnu, ne implementerov. Cijelo postavljanje interakcije je bilo unutar reduced-motion grane, pa korisnik sa iskljucenim pokretom ne moze pomjerati galeriju UOPSTE — a kontejner nema scrollbar. Zaglavi na onom dijelu jedne kopije koji zatekne u viewportu. Gate za reduced-motion treba da guši ANIMACIJU, a ovdje animacije nema — pan je gsap.set, trenutan. Cijena ako grijesim: nikakva, nema tweena da se ugasi.

Ruling: dodaje se tastatura (strelice) na fokusabilan kontejner. Recenzent je potvrdio da je ovo jedini spisak radova na sajtu, pa je nedostupnost sadrzaja Important a ne poliranje. Cijena ako grijesim: nekoliko redova koda.

Ruling: tri od cetiri kopije dobijaju aria-hidden. Citac ekrana inace prolazi cijeli portfolio cetiri puta zaredom bez ikakvog signala da se ponavlja; figcaption je sakriven samo sa opacity-0, sto ga ne uklanja iz stabla pristupacnosti.

Ruling: 'SVE' se izvlaci u tekstovi, isto kao sto je implementer vec uradio za labelu Filter jedan red iznad.
Task 14: minor (deferred): akumulator pomaka raste bez granice; rgba u drop-shadow nije token
Task 14: fix round 1/5 dispatched (FIX_BASE 5ad603e)
Task 14: fix round 1/5 (5 addressed, 0 open; commits 5ad603e..9288e70). Recenzent nezavisno preracunao: desktop 5x21=105vw, mobilni 3x34=102vw, oba >= 100. SPORT slucaj potvrdjen racunom (minRedova=4 pri 1440x900). Tacno 19 pristupacnih figura od 80 renderovanih.

Ruling: `wheel` se uklanja iz Observer tipova umjesto da se dodaje preventDefault. Tri opcije su bile na stolu. Slijepi preventDefault popravlja dvostruki odziv ali zarobljava korisnika na /radovi — galerija bi progutala sav wheel input i do globalnog footera se ne bi moglo tockicem, sto je osnovno ocekivanje na svakoj drugoj stranici sajta. Sakrivanje footera na toj ruti trazi uslovni layout i uklanja linkove sa stranice. Uklanjanje wheela iz Observera je najmanja izmjena bez lose strane: tockic radi ono sto radi svuda drugdje, a pomjeranje ostaje na povlacenju, dodiru i tastaturi — sto vec radi. Dvostruki odziv nestaje.
Cijena ako grijesim: gubi se pomjeranje tockicem, koje danas ionako ne radi upotrebljivo jer stranica odskrola preko galerije za par zareza. Ako korisnik hoce impresivnu verziju gdje tockic pomjera platno, to je dizajn izmjena koja trazi rjesenje za footer na toj ruti — ZA KORISNIKA.

Ruling: visinaVw se inicijalizuje iz window-a umjesto iz nule. Trenutno startuje na 0, pa minRedova bude 0 na prvom renderu i mreza vidljivo poskoci kad useEffect stigne, uz jedan suvisan teardown slusalaca. Na portfolio stranici je to vidljivo. Cijena ako grijesim: treba SSR straza jer window ne postoji na serveru.
Task 14: fix round 2/5 dispatched (FIX_BASE 9288e70)
Task 14: fix round 2/5 (2 addressed, 0 open; commits 9288e70..558ed45)
Task 14: complete (commits e4d6f38..558ed45, review clean, 2 parked minora)
ZA KORISNIKA: pomjeranje galerije tockicem je namjerno uklonjeno. Impresivna varijanta (tockic pomjera platno, stranica stoji) trazi rjesenje za globalni footer na toj ruti — dizajn odluka, ne bug.
Task 15: dispatched (BASE 558ed45, model sonnet)
Task 15: complete (commits 558ed45..765bad6, review clean — spec OK, kvalitet odobren, 0 Critical/Important)
Task 15: minor (deferred) ZA FINALNI FIX TALAS: sadrzajni testovi nemaju provjeru duzine za uslovi (14) i odjeljciPrivatnosti (6), za razliku od proces/usluge/paketi. Vrijedi dodati jer cuva PRAVNI tekst od tihe skracenja.
Napomena: recenzent je nezavisno ekstraktovao §15 iz izvornog brend dokumenta i uporedio sve 14 tacaka znak po znak — ne oslanjajuci se na implementerov automatski diff.
Task 16: dispatched (BASE 765bad6, model sonnet)
Task 16: review spec ❌ — 1 Important (regresija koju je uveo a11y fix), 3 Minor

Ruling: inert cleanup mora vracati zateceno stanje, ne brisati ga svima. Preloader postavlja inert na svu bracu u body-ju dok je zavjesa gore, pa ga na kraju SKIDA svima bezuslovno. Ali Meni sam upravlja svojim inert stanjem preko Reacta (`inert={!otvoren}`), i vec je inert kad je zatvoren. Brisanjem atributa mimo Reacta fiber i dalje misli da je inert=true, pa ga ne resinhronizuje sve dok se otvoren ne promijeni — dakle dok korisnik ne otvori i zatvori meni, sto se mozda nikad ne desi. Do tada je pet nevidljivih linkova zatvorenog menija ponovo u tab redoslijedu, i to na SVAKOM ucitavanju stranice. To je tacno bug koji smo popravili u Tasku 6, vracen kroz popravku pristupacnosti u Tasku 16. Lijek: snimiti zateceno inert stanje svakog brata prije postavljanja i vratiti tacno to, umjesto grupnog removeAttribute.
Cijena ako grijesim: nekoliko redova vise u efektu.

Ruling: dodaje se komentar da je SVG monograma privremen. Brief ga je imao, implementer ga nije prenio. To je znanje bez kojeg sljedeci covjek ne zna da smije zamijeniti path podatke.
Task 16: minor (deferred): izvjestaj netacno tvrdi da try/catch stiti od "nedostajuceg path-a" — GSAP na selektor bez pogodaka ne baca nego no-op; backstop ionako pokriva
Task 16: minor (deferred) ZA KORISNIKA: posjetilac koji se vraca vidi kratak bljesak zavjese prije hidracije. Uklonjivo blokirajucom inline skriptom u head-u (isti obrazac kao sprjecavanje bljeska teme). Nije trazeno rulingom.
Task 16: fix round 1/5 dispatched (FIX_BASE 341ecb8)
Task 16: fix round 1/5 (2 addressed, 0 open; commits 341ecb8..414446a)
Task 16: complete (commits 765bad6..414446a, review clean, 2 parked minora)
Task 16: minor (deferred): snapshot brace se uzima jednom na mountu iz document.body.children — element portalovan u body kasnije ne bi dobio inert dok je zavjesa gore. Prethodno svojstvo, ne regresija.
Task 17: dispatched (BASE 414446a, model sonnet) — ukljucuje i sve odlozene vizuelne provjere
Task 17: review spec ❌ — 2 Important (u opsegu zadatka), 3 Minor (dva van opsega, za finalni talas)

Ruling: e2e snimci moraju hvatati stranicu, ne zavjesu. Svih 14 prikazuje preloader jer svjez browser kontekst nema sessionStorage, a networkidle se razrijesi prije nego sto se animacija zavrsi (~2.7-3s). Provjera horizontalnog prelivanja i dalje radi — recenzent je potvrdio da fixed inset-0 overlay ne doprinosi sirini dokumenta — ali snimci kao artefakt za ljudsko oko vrijede nula, a upravo to je bio razlog postojanja ovog spec-a. Lijek: addInitScript koji sije sessionStorage prije navigacije. Cijena ako grijesim: nikakva.

Ruling: port se parametrizuje kroz env umjesto da bude 3117. Ta vrijednost odrazava jedan lokalni sukob portova na jednoj masini (remotion studio na 3000) i nigdje nije objasnjena. Na cistoj masini ili u CI-u nema koristi od odstupanja, a ko ima nesto na 3117 udara u isti problem bez izlaza. Uz to reuseExistingServer postaje !process.env.CI, jer bi u CI-u zaostali server sakrio regresiju.

ZA FINALNI FIX TALAS (van opsega Taska 17, potvrdjeno recenzijom):
1. Paketi.tsx:9 — labela na cream je 2.94:1. text-black/60 gubi u Tailwind kaskadi jer text-gray i override imaju istu specificnost, pa odlucuje redoslijed generisanja stilova. Lijek: `!text-black/60`, isti obrazac koji Testimonijali vec koriste. MOJ RULING IZ TASKA 13 JE BIO PRIMIJENJEN ALI TIHO NIJE DJELOVAO.
2. DragMreza hidracijski mismatch — MOJA GRESKA IZ TASKA 14. Lijena inicijalizacija cita window vec pri PRVOM (hidracijskom) renderu klijenta, pa se markup razilazi sa serverskim. SSR straza sprjecava pad, ne neslaganje. Lijek: pocetno stanje ostaje 0 bezuslovno, a postojeci useEffect se promovise u useLayoutEffect — nema ni poskakivanja ni neslaganja.
3. sadrzaj testovi: dodati provjeru duzine za uslovi (14) i odjeljciPrivatnosti (6) — cuva pravni tekst.
4. Komentari uz `isolate` na sva tri mjesta (Task 13).
Task 17: fix round 1/5 dispatched (FIX_BASE ce21bfb)
Task 17: fix round 1/5 (2 addressed, 0 open; commits ce21bfb..a0ee3d4)
Task 17: complete (commits 414446a..a0ee3d4, review clean)
Task 17: sve tri odlozene vizuelne stavke PROVJERENE I CISTE: WebkitTextStroke brojevi se iscrtavaju citljivo, mobilne kolone se slazu bez prelivanja, navodnik ne prekriva citat.
Recenzent zakljucio da preloader namjerno nije pokriven e2e testovima — pokrivanje bi vratilo originalni problem (snimci zavjese umjesto sadrzaja).

=== SVIH 17 ZADATAKA ZAVRSENO ===

=== FINALNI WHOLE-BRANCH REVIEW (opus) ===
Mehanicki cist: NULA nesparenih vw vrijednosti u cijelom stablu, NULA hardkodovanih hex vrijednosti van SVG prezentacionih atributa. Sedam rundi na vw i pet na tekst u JSX-u dalo mjerljiv rezultat.

ISPRAVKE MOJE TRIJAZE (prihvatam obje):
- T3 guard test: recenzent osporio moj framing. Guard FAILS CLOSED — nema poklapanja znaci ok:false i build staje. Rizik od kojeg sam strahovao ne postoji u tom smjeru. Odbaceno.
- T2 rokovi test: zadrzati test, odbaciti primjedbu. Nije slab unit test nego content lock na cetiri stvarne poslovne brojke — ista vrsta kao length assertion za uslove koji upravo dodajem.

Ruling: Labela dobija naSvijetloj prop umjesto ! hacka. Task 12 je uveo taj obrazac na Broju uz obrazlozenje da arbitrarni override tiho puca — a Labela je zadrzala override pristup i tiho pukla, sto JESTE Paketi bug. Popravka sa ! bi propagirala obrazac koji je moj vlastiti ruling odbacio i ostavila dva idioma za jedan problem. Ovo je nalaz koji recenzija pojedinacnog zadatka strukturno nije mogla vidjeti: T12 je vlasnik Broja, T13 vlasnik Paketa, par nije imao vlasnika.

Ruling: DragMreza hidracija je TEZA nego sto sam zapisao. Na 390x844 server renderuje 80 figura, klijent pri hidraciji racuna 280. To je divergencija od nekoliko stotina cvorova na svakom mobilnom ucitavanju, ne kozmetika. Promovisu se OBA efekta koja citaju window, ne samo jedan — inace mobilni i dalje prefarbava geometriju sa desktop na mobilnu poslije prvog iscrtavanja.

Ruling: CSS marquee trake dobijaju reduced-motion stop. Moj spec kaze da guard zivi u useGsap "pa ga nijedna sekcija ne moze zaboraviti" — ali dvije CSS marquee trake nikad ne prolaze kroz useGsap. Guard je zaboravljen na jedinom mjestu do kojeg mehanizam ne dopire. Vidljivo samo na nivou grane.

Ruling: 'Druga osoba' u ekipi dobija tretman kao testimonijali. Uklonio sam izmisljene ekspozicijske podatke iz HUD-a pozivajuci se na "nista se ne izmislja" — a na /o-nama se renderuje osoba sa izmisljenom ulogom i biografijom koju ta osoba nije dala. Studio JESTE dvoje ljudi i uloga je izvedena iz njihovog procesnog dokumenta, ali ime i opis nisu njeni. Rjesenje: zadrzati sentinel string, filtrirati nepotpune unose iz prikaza, i naciniti ga detektabilnim za guard. Cijena ako grijesim: /o-nama privremeno prikazuje jednog clana umjesto dva — nepotpuno, ali ne netacno.

Ruling: guard se siri na jos dva sentinela. Moj spec kaze "zastita se mora testirati, inace je ukras", a guard pokriva samo jedan od tri produkcijska blokera iz §13. Okretanje MEDIA_MODE na 'real' — jedina radnja koju guard uci sljedeceg covjeka — danas isporucuje i pravnu ogradu i placeholder clana ekipe.

Ruling: PinPanel renderuje usluga.naslov. Plan §180-187 specificira kolonu "Naslov panela", a PinPanel renderuje naziv — pa naslovi usluga 04-06 ("Dan koji se ne ponavlja.", "Napor se vidi izbliza.", "Sadrzaj i sajt iz iste kuce.") ne pojavljuju se NIGDJE na sajtu. To je napisan copy koji se gubi.

Zabiljeska za buduceg citaoca: pocetna ima 13 sekcija, ne 14. Sekcija 14 iz adaptacije (dzinovski wordmark + .dev kartica) implementirana je kao globalni Footer — bolja odluka jer je na svakoj stranici. Nije rupa, ne "vracati".
=== FIX TALAS dispatched (FIX_BASE a0ee3d4) ===

=== 28.08.2026. — Jelena Tomic i pravni tekst ===

Ruling: sentinel 'Druga osoba' se ukida u cijelosti, ne mijenja drugim sentinelom. Drugi clan je dobio stvarno ime (Jelena Tomic), uloga i opis su izvedeni iz njihovog Produkcijskog Procesa §2.2 (Osoba B: foto — detalji, portreti, proizvod; reakcije i gosti; atmosfera i publika), ne izmisljeni. Time otpada i filter u o-nama/page.tsx i treci razlog u check-placeholders.mjs — `ekipa` vise nije parametar guarda. Slika ostaje placeholder, ali nju vec pokriva MEDIA_MODE, pa nema rupe. Cijena ako grijesim: uloga je izvedena iz procesnog dokumenta a ne iz njenih rijeci — ako se ne slaze sa opisom, to je jedan string u ekipa.ts.

Ruling: pravni tekst se SPAJA sa nextpixel.dev, ne prepisuje doslovno. Izvor je Next-Pixel-NJS/src/locales/sr/legal.json — isto pravno lice, ista adresa, vec na srpskom. Preuzeto: kontrolor, pravni osnov, prava, rokovi, nadzorno tijelo (Agencija za zastitu licnih podataka u BiH), Resend kao obradjivac. NIJE preuzeto: kolacici, Google Analytics, Meta Pixel — ovaj sajt ih nema (provjereno: jedina vanjska usluga u src/ je Resend), pa bi prepisivanje bilo objavljivanje obrade koja se ne desava. Iz impresuma izbaceni § 55 Abs. 2 RStV i EU ODR platforma — njemacki propis, ne vazi za firmu u BiH. Cijena ako grijesim: sajt tvrdi manje obrade nego sto radi — ali provjera koda kaze suprotno.

Ruling: ispravljena stvarna netacnost u starom tekstu. Stari privatnost.ts je tvrdio "ne prosljedjujemo trecim licima" dok kontakt forma ide kroz Resend (SAD). To je bila neistina na javnoj stranici, ne stilski propust. Nova sekcija "Kome prosljedjujemo podatke" to imenuje.

Ruling: napomena "nije pravni savjet" OSTAJE, guard i dalje pada na nju. Pola teksta sad dolazi iz njihovog objavljenog dokumenta, ali sekcije o dronu, snimanju djece i arhivi su i dalje moje i niko ih nije pravno pregledao. Build je ionako blokiran zbog MEDIA_MODE, pa zadrzavanje ne kosta nista. Produkcijskih blokera sad ima dva umjesto tri.
