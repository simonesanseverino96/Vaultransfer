'use client'

import dynamic from 'next/dynamic'

const UploadSection = dynamic(() => import('./UploadSection'), {
  loading: () => <div className="max-w-2xl mx-auto h-64 animate-pulse bg-surface rounded-2xl" />,
  ssr: false,
})

export default function UploadSectionLazy() {
  return <UploadSection />
}
