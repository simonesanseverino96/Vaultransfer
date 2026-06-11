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
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const page of pages) {
    const languages = Object.fromEntries(
      locales.map(locale => [locale, `${baseUrl}/${locale}${page.path}`])
    )

    // Una entry per OGNI lingua, ciascuna con i propri hreflang
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: page.lastMod,
        changeFrequency: page.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority: locale === 'en' ? page.priority : page.priority - 0.05,
        alternates: { languages },
      })
    }
  }

  return entries
}
