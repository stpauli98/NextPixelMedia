/**
 * Politika privatnosti.
 *
 * Pravni skelet (kontrolor, pravni osnov, prava, rokovi, nadzorno tijelo)
 * preuzet je iz postojeće politike NextPixel-a na nextpixel.dev —
 * Next-Pixel-NJS/src/locales/sr/legal.json. Isto pravno lice, ista adresa.
 *
 * Namjerno NIJE preuzeto: kolačići, Google Analytics i Meta Pixel. Ovaj sajt
 * ih nema — jedina vanjska usluga je Resend za kontakt formu. Prepisivanje
 * tih sekcija značilo bi objaviti obradu koja se ne dešava.
 *
 * Sekcije o licima na snimcima, snimanju djece, dronu i arhivi postoje samo
 * ovdje i nisu pravno pregledane — zato `napomenaPrivatnost` i dalje stoji i
 * scripts/check-placeholders.mjs zbog nje obara produkcijski build.
 */

export const azuriranoPrivatnost = 'Posljednje ažuriranje: 28. avgust 2026.'

export const odjeljciPrivatnosti = [
  {
    naslov: 'Ko obrađuje tvoje podatke',
    tekst: 'Za obradu ličnih podataka odgovoran je NextPixel, Jovana Dučića 15, 78400 Gradiška, Republika Srpska, Bosna i Hercegovina. Kontakt za sva pitanja o privatnosti: nikola@nextpixel.media, telefon +387 66 603 900.',
  },
  {
    naslov: 'Pravni osnov obrade',
    tekst: 'Podatke iz kontakt forme obrađujemo radi izvršenja ugovora, odnosno pripreme ponude na tvoj zahtjev (čl. 6(1)(b) GDPR). Serverske logove obrađujemo po legitimnom interesu za sigurnost sajta (čl. 6(1)(f) GDPR). Saglasnost nam nije osnov ni za šta jer ovaj sajt ne koristi kolačiće za praćenje ni marketinške alate.',
  },
  {
    naslov: 'Podaci koje prikupljamo',
    tekst: 'Kroz kontakt formu prikupljamo ime, kontakt podatak i opis posla. Koristimo ih isključivo da odgovorimo na upit i pošaljemo ponudu. Server automatski bilježi IP adresu, tip preglednika i vrijeme pristupa u sigurnosne svrhe.',
  },
  {
    naslov: 'Kome prosljeđujemo podatke',
    tekst: 'Poruke iz kontakt forme dostavlja Resend (Resend Inc., SAD), koji u tu svrhu obrađuje tvoje ime, kontakt i tekst poruke. Prenos je pokriven standardnim ugovornim klauzulama. Osim toga ne prosljeđujemo podatke nikome i ne prodajemo ih.',
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
    naslov: 'Koliko dugo čuvamo',
    tekst: 'Podatke iz kontakt forme čuvamo 12 mjeseci od upita, zatim ih brišemo. Isporučeni materijal čuvamo 12 mjeseci, sirovi materijal 3 mjeseca. Serverske logove čuvamo 30 dana.',
  },
  {
    naslov: 'Kolačići',
    tekst: 'Sajt ne koristi kolačiće — ni za praćenje, ni za analitiku, ni za reklamne mreže. Zato nema ni banera za saglasnost.',
  },
  {
    naslov: 'Tvoja prava',
    tekst: 'Imaš pravo da tražiš pristup svojim podacima, ispravku netačnih, brisanje, ograničenje obrade, prenos podataka u čitljivom formatu i prigovor na obradu zasnovanu na legitimnom interesu (čl. 15–21 GDPR). Javi se na nikola@nextpixel.media i odgovaramo u roku od mjesec dana.',
  },
  {
    naslov: 'Žalba nadzornom tijelu',
    tekst: 'Ako smatraš da tvoje podatke ne obrađujemo kako treba, imaš pravo na žalbu nadzornom tijelu. U Bosni i Hercegovini to je Agencija za zaštitu ličnih podataka u BiH.',
  },
  {
    naslov: 'Izmjene ove politike',
    tekst: 'Politiku mijenjamo kad se promijeni način na koji radimo. Kod svake izmjene mijenjamo i datum na vrhu stranice.',
  },
] as const

export const napomenaPrivatnost =
  'Ovaj tekst nije pravni savjet. Provjeri ga kod pravnika prije objave sajta.'
