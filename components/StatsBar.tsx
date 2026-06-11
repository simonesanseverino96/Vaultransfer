import { useTranslations } from 'next-intl'
import ScrollReveal from './ScrollReveal'

export default function StatsBar() {
  const t = useTranslations('home.stats')

  const STATS = [
    { value: '2 GB', label: t('maxFileSize') },
    { value: '256-bit', label: t('encryption') },
    { value: '20', label: t('filesPerTransfer') },
    { value: t('days90'), label: t('maxExpiry') },
  ]

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-6 py-8">
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {STATS.map((s, i) => (
            <div key={i} className="bg-surface px-6 py-5 text-center hover:bg-surface-2 transition-colors">
              <p className="font-display text-2xl font-700 text-paper mb-1">{s.value}</p>
              <p className="text-xs text-muted font-body uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}
