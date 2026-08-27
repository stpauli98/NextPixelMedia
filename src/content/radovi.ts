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
