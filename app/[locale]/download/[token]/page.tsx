import { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import DownloadClient from '@/components/DownloadClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  const locale = await getLocale()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'
  return {
    title: 'Download — VaultTransfer',
    description: t('description'),
    alternates: {
      canonical: locale === 'en' ? `${baseUrl}/download/token` : `${baseUrl}/download/token?lang=${locale}`
    }
  }
}

export default async function DownloadPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const t = await getTranslations('download')

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb absolute w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #00e5a0, transparent)', top: '-150px', left: '-100px' }} />
        <div className="orb orb-2 absolute w-[350px] h-[350px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #00e5a0, transparent)', bottom: '5%', right: '-80px' }} />
      </div>

      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-end">
          <div className="flex items-center gap-2 text-xs text-muted font-body">
            <span className="w-2 h-2 rounded-full bg-accent inline-block animate-pulse" />
            {t('secureDownload').replace('🔒 ', '').split('·')[0].trim()}
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-16 pb-20">
        <DownloadClient token={token} />
      </div>
    </main>
  )
}