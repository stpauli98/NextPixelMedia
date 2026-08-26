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
