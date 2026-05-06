import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import HeaderWrapper from '@/components/HeaderWrapper'
import CookieBanner from '@/components/CookieBanner'
import './globals.css'
import Footer from '@/components/Footer'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  const locale = await getLocale()

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t('titleDefault'),
      template: '%s | VaultTransfer',
    },
    description: t('description'),
    keywords: t.raw('keywords'),
    authors: [{ name: 'VaultTransfer' }],
    creator: 'VaultTransfer',
    publisher: 'VaultTransfer',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    openGraph: {
      title: t('titleDefault'),
      description: t('description'),
      type: 'website',
      url: baseUrl,
      siteName: 'VaultTransfer',
      locale: locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('titleDefault'),
      description: t('description'),
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        'en': baseUrl,
        'it': `${baseUrl}?lang=it`,
        'de': `${baseUrl}?lang=de`,
        'fr': `${baseUrl}?lang=fr`,
        'es': `${baseUrl}?lang=es`,
        'pt': `${baseUrl}?lang=pt`,
        'ja': `${baseUrl}?lang=ja`,
        'zh': `${baseUrl}?lang=zh`,
        'ar': `${baseUrl}?lang=ar`,
        'x-default': baseUrl,
      },
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID

  return (
    <html lang={locale}>
      <head>
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <HeaderWrapper />
          {children}
          <CookieBanner />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}