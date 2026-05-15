import { useTranslations } from 'next-intl'
import { getTranslations, getLocale } from 'next-intl/server'
import { Metadata } from 'next'
import UploadSectionLazy from '@/components/UploadSectionLazy'
import Features from '@/components/Features'
import ErrorBoundary from '@/components/ErrorBoundary'
import StatsBar from '@/components/StatsBar'
import CtaSection from '@/components/CtaSection'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  const locale = await getLocale()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'
  
  return {
    title: t('titleDefault'),
    description: t('description'),
    alternates: {
      canonical: locale === 'en' ? baseUrl : `${baseUrl}?lang=${locale}`,
    }
  }
}

export default function Home() {
  const t = useTranslations('home')

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb absolute w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #00e5a0, transparent)', top: '-200px', right: '-100px' }} />
        <div className="orb orb-2 absolute w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #00e5a0, transparent)', bottom: '10%', left: '-100px' }} />
        <div className="orb orb-3 absolute w-[300px] h-[300px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #00b37e, transparent)', top: '40%', left: '40%' }} />
      </div>

      <section id="upload" className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-20 pb-12 text-center">
        <div className="hero-animate inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs mb-8 font-body">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <path d="M6 1l1.12 2.27L10 3.77l-2 1.95.47 2.75L6 7.27l-2.47 1.2.47-2.75-2-1.95 2.88-.5L6 1z"/>
          </svg>
          {t('badge')}
        </div>

        <h1 className="hero-animate font-display text-5xl md:text-7xl font-800 leading-none tracking-tight mb-6">
          {t('headline')}<br />
          <span className="animate-gradient-text">{t('headlineAccent')}</span>
        </h1>

        <p className="hero-animate text-muted text-base md:text-lg max-w-lg mx-auto leading-relaxed font-body mb-12">
          {t('description')}
        </p>

        <div className="hero-animate">
          <ErrorBoundary>
            <UploadSectionLazy />
          </ErrorBoundary>
        </div>
      </section>

      <StatsBar />
      <Features />
      <CtaSection />
    </main>
  )
}