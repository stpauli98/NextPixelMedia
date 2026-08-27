import type { MetadataRoute } from 'next'
import { RUTE } from '@/content/rute'

export default function sitemap(): MetadataRoute.Sitemap {
  const osnova = 'https://nextpixel.media'
  const dodatne = ['/uslovi', '/privatnost']

  return [...RUTE.map((r) => r.href), ...dodatne].map((href) => ({
    url: `${osnova}${href === '/' ? '' : href}`,
    lastModified: new Date(),
    changeFrequency: href === '/' ? 'weekly' : 'monthly',
    priority: href === '/' ? 1 : 0.7,
  }))
}
