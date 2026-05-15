export const revalidate = 86400

import { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import FaqClient from './FaqClient'

export const metadata: Metadata = buildMetadata({
  title: 'FAQ — VaultTransfer',
  description: 'Frequently asked questions about VaultTransfer: how file transfer works, encryption, GDPR compliance, expiry, password protection, and more.',
  path: '/faq',
})

export default function FAQPage() {
  return <FaqClient />
}
