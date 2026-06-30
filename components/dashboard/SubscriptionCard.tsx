'use client'

import { useTranslations } from 'next-intl'
import { PLANS, PlanType } from '@/lib/plans'
import { formatBytes } from '@/lib/utils'

interface Props {
  plan: PlanType
  email: string
  subscriptionStatus: string
  subscriptionEndsAt: string | null
  checkoutLoading: string | null
  onUpgrade: (plan: string) => void
  onManage: () => void
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-accent/15 text-accent',
  past_due: 'bg-amber-500/15 text-amber-400',
  cancelled: 'bg-red-500/15 text-red-400',
  trialing: 'bg-blue-500/15 text-blue-400',
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  past_due: 'Payment due',
  cancelled: 'Cancelled',
  trialing: 'Trial',
}

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function SubscriptionCard({
  plan, email, subscriptionStatus, subscriptionEndsAt,
  checkoutLoading, onUpgrade, onManage,
}: Props) {
  const t = useTranslations('dashboard')
  const planConfig = PLANS[plan]
  const isPaid = plan !== 'free'
  const statusLabel = STATUS_LABELS[subscriptionStatus] ?? subscriptionStatus
  const statusStyle = STATUS_STYLES[subscriptionStatus] ?? 'bg-white/10 text-muted'
  const renewalDate = formatDate(subscriptionEndsAt)

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs text-muted uppercase tracking-widest font-body mb-1">{t('currentPlan')}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display text-2xl font-700 text-paper">{planConfig.name}</h2>
            {isPaid ? (
              <>
                <span className="px-2 py-0.5 rounded-full text-xs font-body bg-accent/15 text-accent">
                  {planConfig.price}{t('perMonth')}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-body ${statusStyle}`}>
                  {statusLabel}
                </span>
              </>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-xs font-body bg-white/10 text-muted">{t('free')}</span>
            )}
          </div>
          <p className="text-sm text-muted font-body mt-1">{email}</p>
          {isPaid && renewalDate && (
            <p className="text-xs text-muted font-body mt-1">
              {subscriptionStatus === 'cancelled' ? `Access until ${renewalDate}` : `Renews ${renewalDate}`}
            </p>
          )}
          {subscriptionStatus === 'past_due' && (
            <p className="text-xs text-amber-400 font-body mt-1">
              ⚠ Payment failed — update your payment method to keep access.
            </p>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {plan === 'free' ? (
            <button
              onClick={() => onUpgrade('pro')}
              disabled={checkoutLoading === 'pro'}
              className="px-4 py-2 bg-accent text-ink rounded-lg text-sm font-display font-600 hover:bg-accent-dim transition-colors disabled:opacity-50"
            >
              {checkoutLoading === 'pro' ? t('loading') : t('upgradePro')}
            </button>
          ) : (
            <button
              onClick={onManage}
              className="px-4 py-2 bg-surface-2 text-muted hover:text-paper border border-white/10 rounded-lg text-sm font-body transition-colors flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              {t('manageSubscription')}
            </button>
          )}
        </div>
      </div>

      {/* Plan limits grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
        {[
          { label: t('maxUpload'), value: formatBytes(planConfig.maxTotalSizeMB * 1024 * 1024) },
          { label: t('maxExpiry'), value: planConfig.maxDaysExpiry === null ? t('unlimited') : t('days', { count: planConfig.maxDaysExpiry }) },
          { label: t('maxDownloads'), value: planConfig.maxDownloads === null ? t('unlimited') : String(planConfig.maxDownloads) },
          { label: t('ads'), value: planConfig.hasAds ? t('yes') : t('no') },
        ].map((item, i) => (
          <div key={i}>
            <p className="text-xs text-muted font-body mb-1">{item.label}</p>
            <p className="text-sm font-display font-600 text-paper">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Pro → Business upsell */}
      {plan === 'pro' && (
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-muted font-body">{t('wantMore')}</p>
          <button
            onClick={() => onUpgrade('business')}
            disabled={checkoutLoading === 'business'}
            className="px-4 py-2 bg-surface-2 text-paper hover:bg-white/10 border border-white/10 rounded-lg text-sm font-display font-600 transition-colors disabled:opacity-50"
          >
            {checkoutLoading === 'business' ? t('loading') : t('upgradeBusiness')}
          </button>
        </div>
      )}
    </div>
  )
}
