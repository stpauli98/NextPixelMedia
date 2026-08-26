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
