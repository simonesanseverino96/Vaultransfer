import { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { buildAlternates } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  const locale = await getLocale()
  return {
    title: t('login.title'),
    description: t('login.subtitle'),
    alternates: buildAlternates(locale, '/login'),
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
