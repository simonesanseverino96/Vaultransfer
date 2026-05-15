import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'

const locales = ['en', 'it', 'de', 'fr', 'es', 'pt', 'ja', 'zh', 'ar']

const LAUNCH_DATE = new Date('2026-04-15')
const TODAY = new Date()

const pages = [
  { path: '',         changeFrequency: 'weekly',  priority: 1.0, lastMod: TODAY },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.8, lastMod: TODAY },
  { path: '/faq',     changeFrequency: 'monthly', priority: 0.7, lastMod: TODAY },
  { path: '/login',   changeFrequency: 'yearly',  priority: 0.5, lastMod: LAUNCH_DATE },
  { path: '/privacy', changeFrequency: 'yearly',  priority: 0.3, lastMod: LAUNCH_DATE },
  { path: '/terms',   changeFrequency: 'yearly',  priority: 0.3, lastMod: LAUNCH_DATE },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const page of pages) {
    // URL canonico in inglese
    entries.push({
      url: `${baseUrl}/en${page.path}`,
      lastModified: page.lastMod,
      changeFrequency: page.changeFrequency as any,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map(locale => [locale, `${baseUrl}/${locale}${page.path}`])
        ),
      },
    })
  }

  return entries
}