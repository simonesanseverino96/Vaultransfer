'use client'

import { useEffect } from 'react'

interface Props {
  slot: string
}

export default function AdBanner({ slot }: Props) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID

  if (!adsenseId) return null

  return (
    <div className="my-6">
      <p className="text-xs text-muted font-body text-center mb-2 uppercase tracking-widest">Pubblicità</p>
      <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adsenseId}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
      <p className="text-xs text-muted font-body text-center mt-2">
        <a href="/prezzi" className="text-accent hover:underline">Passa a Pro</a> per rimuovere la pubblicità
      </p>
    </div>
  )
}
