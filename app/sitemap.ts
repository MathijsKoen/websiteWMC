import type { MetadataRoute } from 'next'
import { getAllNews, getAllTracks, getAllEvents } from '@/lib/contentful/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, tracks, events] = await Promise.allSettled([
    getAllNews(),
    getAllTracks(),
    getAllEvents(),
  ])

  const base = 'https://dewmc.nl'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                      changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/over-ons`,        changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/onze-banen`,      changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/nieuws`,          changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/agenda`,          changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/contact`,         changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/sponsoren`,       changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/beurs-2026`,      changeFrequency: 'weekly',  priority: 0.8 },
  ]

  const trackRoutes: MetadataRoute.Sitemap =
    tracks.status === 'fulfilled'
      ? tracks.value.map((t) => ({
          url: `${base}/onze-banen/${t.slug}`,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        }))
      : []

  const newsRoutes: MetadataRoute.Sitemap =
    news.status === 'fulfilled'
      ? news.value.map((n) => ({
          url: `${base}/nieuws/${n.slug}`,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      : []

  const eventRoutes: MetadataRoute.Sitemap =
    events.status === 'fulfilled'
      ? events.value.map((e) => ({
          url: `${base}/agenda/${e.slug}`,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      : []

  return [...staticRoutes, ...trackRoutes, ...newsRoutes, ...eventRoutes]
}
