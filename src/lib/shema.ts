import { z } from 'zod'

export const TIPOVI = ['firma', 'nekretnina', 'event', 'dron', 'nisam-siguran'] as const
export const UPOTREBE = ['instagram', 'sajt', 'stampa', 'oglasavanje', 'ne-znam'] as const

export const upitShema = z.object({
  tip: z.enum(TIPOVI),
  ime: z.string().trim().min(2, 'Upiši ime ili naziv firme.').max(120),
  kontakt: z.string().trim().min(5, 'Upiši email ili telefon.').max(160),
  kadaGdje: z.string().trim().max(300).default(''),
  upotreba: z.array(z.enum(UPOTREBE)).min(1, 'Odaberi bar jedno.'),
  poruka: z.string().trim().max(3000).default(''),

  // Honeypot: pravi posjetilac ovo polje ne vidi, pa ga ne popunjava.
  web: z.literal('').default(''),
  // Vrijeme otvaranja forme, za odbacivanje trenutnih slanja.
  otvorenoU: z.number(),
})

export type Upit = z.infer<typeof upitShema>

export const NAJKRACE_POPUNJAVANJE_MS = 3000

export const OZNAKE_TIPA: Record<(typeof TIPOVI)[number], string> = {
  firma: 'Sadržaj za firmu',
  nekretnina: 'Nekretnina',
  event: 'Event ili proslava',
  dron: 'Dron',
  'nisam-siguran': 'Nisam siguran',
}

export const OZNAKE_UPOTREBE: Record<(typeof UPOTREBE)[number], string> = {
  instagram: 'Instagram',
  sajt: 'Sajt',
  stampa: 'Štampa',
  oglasavanje: 'Oglašavanje',
  'ne-znam': 'Ne znam još',
}
