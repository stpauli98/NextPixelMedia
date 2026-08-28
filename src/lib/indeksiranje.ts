import { jePlaceholder } from '@/lib/media'

/**
 * Jedno mjesto koje odlučuje smije li sajt u pretragu.
 *
 * Postoji zato što su se robots.txt i <meta name="robots"> već jednom
 * razišli u produkciji: robots.txt je slao Disallow: /, a stranice
 * "index, follow". Obje odluke sad čitaju odavde.
 *
 * Dok su slike placeholder (picsum.photos), sajt ne smije u Google —
 * inače se stock fotografije indeksiraju kao NextPixel portfolio.
 */
export const smijeUPretragu = !jePlaceholder
