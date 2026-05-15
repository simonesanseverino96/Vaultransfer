export const revalidate = 3600

import { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import PricingClient from './PricingClient'

export const metadata: Metadata = buildMetadata({
  title: 'Pricing — VaultTransfer',
  description: 'Simple, transparent pricing. Start for free with 2 GB transfers, or upgrade to Pro and Business for more storage, longer expiry, and no ads.',
  path: '/pricing',
})

export default function PricingPage() {
  return <PricingClient />
}
