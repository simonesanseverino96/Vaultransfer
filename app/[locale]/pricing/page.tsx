export const revalidate = 3600

import { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { buildMetadata } from '@/lib/metadata'
import PricingClient from './PricingClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  const locale = await getLocale()
  return buildMetadata({
    title: t('pricingTitle'),
    description: t('pricingDescription'),
    path: '/pricing',
    locale,
  })
}

export default function PricingPage() {
  return <PricingClient />
}
