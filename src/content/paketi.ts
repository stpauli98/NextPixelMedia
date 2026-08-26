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
