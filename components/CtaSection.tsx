import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import ScrollReveal from './ScrollReveal'

export default function CtaSection() {
  const t = useTranslations('home')

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
      <ScrollReveal>
        <div className="cta-glow bg-surface border border-white/10 rounded-3xl px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/3 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs text-accent uppercase tracking-widest font-body mb-4">{t('ctaTagline')}</p>
            <h2 className="font-display text-3xl md:text-5xl font-800 text-paper mb-4 leading-tight">
              {t('ctaHeadline')}<br />
              <span className="animate-gradient-text">{t('ctaHeadlineAccent')}</span>
            </h2>
            <p className="text-muted font-body text-sm md:text-base max-w-md mx-auto mb-8">
              {t('ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#upload" className="px-6 py-3 bg-accent text-ink rounded-xl text-sm font-display font-600 hover:bg-accent-dim transition-colors shadow-lg shadow-accent/20">
                {t('ctaButton')}
              </a>
              <Link href="/pricing" className="px-6 py-3 bg-surface-2 text-muted hover:text-paper border border-white/10 rounded-xl text-sm font-body transition-colors">
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
