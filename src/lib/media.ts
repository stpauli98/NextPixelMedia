/**
 * Jedini izvor URL-ova slika i videa.
 *
 * Dok je 'placeholder', sajt vuče privremene slike sa picsum.photos.
 * Kad stigne pravi materijal: ubaci fajlove u public/media/ pod imenom
 * koje odgovara `id` iz src/content/radovi.ts, pa prebaci na 'real'.
 *
 * scripts/check-placeholders.mjs obara produkcijski build dok je 'placeholder'.
 */
export const MEDIA_MODE: 'placeholder' | 'real' = 'placeholder'

export function slika(id: string, sirina: number, visina: number): string {
  if (MEDIA_MODE === 'placeholder') {
    return `https://picsum.photos/seed/${id}/${sirina}/${visina}`
  }
  return `/media/${id}.jpg`
}

export function video(id: string): string {
  if (MEDIA_MODE === 'placeholder') return ''
  return `/media/${id}.mp4`
}

export const jePlaceholder = MEDIA_MODE === 'placeholder'
