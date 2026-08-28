import type { MetadataRoute } from 'next'
import { smijeUPretragu } from '@/lib/indeksiranje'

export default function robots(): MetadataRoute.Robots {
  if (!smijeUPretragu) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: 'https://nextpixel.media/sitemap.xml',
  }
}
