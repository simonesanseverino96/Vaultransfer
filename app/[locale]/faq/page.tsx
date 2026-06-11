export const revalidate = 86400

import { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { buildMetadata } from '@/lib/metadata'
import FaqClient from './FaqClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  const locale = await getLocale()
  return buildMetadata({
    title: t('faqTitle'),
    description: t('faqDescription'),
    path: '/faq',
    locale,
  })
}

export default function FAQPage() {
  return <FaqClient />
}
