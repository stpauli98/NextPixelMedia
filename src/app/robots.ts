import type { MetadataRoute } from 'next'
import { jePlaceholder } from '@/lib/media'

export default function robots(): MetadataRoute.Robots {
  // Dok su slike placeholder (picsum.photos), sajt ne smije u pretragu —
  // inače Google indeksira stock fotografije kao NextPixel portfolio, a to
  // se poslije briše mnogo teže nego što se objavi. Kad MEDIA_MODE pređe na
  // 'real', indeksiranje se vraća samo od sebe, bez dodatne izmjene ovdje.
  if (jePlaceholder) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: 'https://nextpixel.media/sitemap.xml',
  }
}
