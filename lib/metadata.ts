import { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'
const OG_IMAGE = `${BASE_URL}/icon-512x512.png`
const LOCALES = ['en', 'it', 'de', 'fr', 'es', 'pt', 'ja', 'zh', 'ar'] as const

/**
 * Costruisce canonical + hreflang per una pagina localizzata.
 * canonical: sempre l'URL della lingua corrente (mai la root o URL senza locale).
 * languages: tutte le versioni linguistiche + x-default sull'inglese.
 */
export function buildAlternates(locale: string, path = ''): NonNullable<Metadata['alternates']> {
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages: {
      ...Object.fromEntries(LOCALES.map(l => [l, `${BASE_URL}/${l}${path}`])),
      'x-default': `${BASE_URL}/en${path}`,
    },
  }
}

export function buildMetadata({
  title,
  description,
  path = '',
  locale = 'en',
  noIndex = false,
}: {
  title: string
  description: string
  path?: string
  locale?: string
  noIndex?: boolean
}): Metadata {
  const url = `${BASE_URL}/${locale}${path}`
  const fullTitle = title.includes('VaultTransfer') ? title : `${title} — VaultTransfer`

  return {
    title: fullTitle,
    description,
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'VaultTransfer',
      images: [{ url: OG_IMAGE, width: 512, height: 512, alt: 'VaultTransfer' }],
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    alternates: buildAlternates(locale, path),
  }
}
