import { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'
const OG_IMAGE = `${BASE_URL}/icon-512x512.png`

export function buildMetadata({
  title,
  description,
  path = '',
  noIndex = false,
}: {
  title: string
  description: string
  path?: string
  noIndex?: boolean
}): Metadata {
  const url = `${BASE_URL}${path}`
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
    alternates: { canonical: url },
  }
}
