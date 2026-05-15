'use client'

import { useState } from 'react'
import { useRouter, Link } from '@/i18n/routing'
import { getBrowserClient } from '@/lib/supabase'
import { useTranslations } from 'next-intl'

// ─── Static data ────────────────────────────────────────────────────────────

const COMPARISON_SECTIONS = [
  {
    title: 'Storage & transfers',
    rows: [
      { label: 'Max upload size',           free: '2 GB',        pro: '50 GB',       business: '200 GB',    enterprise: 'Custom' },
      { label: 'Link expiry',               free: '7 days',      pro: '30 days',     business: 'No limit',  enterprise: 'No limit' },
      { label: 'Max downloads per link',    free: 'Unlimited',   pro: 'Unlimited',   business: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Simultaneous transfers',    free: 'Unlimited',   pro: 'Unlimited',   business: 'Unlimited', enterprise: 'Unlimited' },
    ],
  },
  {
    title: 'Features',
    rows: [
      { label: 'Ads-free experience',       free: false, pro: true,  business: true,  enterprise: true },
      { label: 'Password-protected links',  free: false, pro: false, business: true,  enterprise: true },
      { label: 'Download statistics',       free: false, pro: true,  business: true,  enterprise: true },
      { label: 'Custom expiry dates',       free: false, pro: true,  business: true,  enterprise: true },
      { label: 'Transfer notes & messages', free: true,  pro: true,  business: true,  enterprise: true },
      { label: 'Email on first download',   free: true,  pro: true,  business: true,  enterprise: true },
    ],
  },
  {
    title: 'Developer & API',
    rows: [
      { label: 'Public REST API',           free: false, pro: false, business: true,  enterprise: true },
      { label: 'API key management',        free: false, pro: false, business: true,  enterprise: true },
      { label: 'Webhook events',            free: false, pro: false, business: false, enterprise: true },
      { label: 'Custom domain',             free: false, pro: false, business: false, enterprise: true },
    ],
  },
  {
    title: 'Support',
    rows: [
      { label: 'Community support',         free: true,  pro: true,  business: true,  enterprise: true },
      { label: 'Email support',             free: false, pro: true,  business: true,  enterprise: true },
      { label: 'Priority support',          free: false, pro: false, business: true,  enterprise: true },
      { label: 'Dedicated account manager', free: false, pro: false, business: false, enterprise: true },
      { label: 'Custom SLA',                free: false, pro: false, business: false, enterprise: true },
      { label: 'SSO / SAML',               free: false, pro: false, business: false, enterprise: true },
    ],
  },
]

const FAQS = [
  {
    q: 'Can I cancel my subscription at any time?',
    a: 'Yes — cancel any time from your dashboard with one click. You keep full access until the end of your current billing period. No penalties, no questions asked.',
  },
  {
    q: 'What happens to my files when a link expires?',
    a: 'Once a transfer link expires, the files are permanently deleted from our servers. We send an expiry reminder 24 hours in advance so your recipients have time to download.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'All paid plans come with a 30-day money-back guarantee. If VaultTransfer doesn\'t meet your needs in the first month, contact support for a full refund — no conditions.',
  },
  {
    q: 'How does the 2 GB limit on the Free plan work?',
    a: 'The 2 GB limit applies per individual transfer, not to your total account usage. You can create as many transfers as you like; each one can be up to 2 GB.',
  },
  {
    q: 'Can I upgrade or downgrade my plan later?',
    a: 'Absolutely. You can switch plans at any time from the Billing section of your dashboard. Upgrades take effect immediately; downgrades apply at the next renewal date.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as Apple Pay and Google Pay, all processed securely via Stripe.',
  },
  {
    q: 'Are my files encrypted and secure?',
    a: 'All data is transmitted over HTTPS (TLS 1.3). Files are stored encrypted at rest using AES-256 on Supabase-managed infrastructure. Password-protected links add an additional layer of access control at download time.',
  },
  {
    q: 'What is the Enterprise plan?',
    a: 'Enterprise is a custom plan for large organizations that need higher storage, dedicated support, custom SLAs, SSO/SAML, webhook integrations, and custom domain hosting. Contact our sales team to discuss your requirements.',
  },
  {
    q: 'Can I use VaultTransfer for commercial purposes?',
    a: 'Yes. All plans, including Free, allow commercial use. The Business and Enterprise plans are specifically designed for professional workflows with API access, team features, and advanced security.',
  },
  {
    q: 'Do you offer discounts for annual billing?',
    a: 'Yes — switching to annual billing saves you up to 33% compared to monthly pricing. The discount is applied automatically when you toggle to Annual before checkout.',
  },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function Check({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={`w-4 h-4 ${className}`} aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function Cross() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-white/15 mx-auto" aria-hidden="true">
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

type CellVal = string | boolean
function TableCell({ val }: { val: CellVal }) {
  if (val === true)  return <Check className="text-accent mx-auto" />
  if (val === false) return <Cross />
  return <span className="text-sm text-white/70 font-body">{val}</span>
}

function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[600px]">
        <thead className="sticky top-0 z-10 bg-[#0a0a0f]">
          <tr>
            <th className="text-left py-4 pr-6 text-xs text-white/30 font-body uppercase tracking-widest w-[40%]" />
            {(['Free', 'Pro', 'Business', 'Enterprise'] as const).map((col, i) => (
              <th key={col} className={`py-4 px-3 text-center text-sm font-display font-600 w-[15%] ${
                i === 1 ? 'text-violet-400' : i === 2 ? 'text-accent' : i === 3 ? 'text-amber-400' : 'text-white/40'
              }`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON_SECTIONS.map((section) => (
            <>
              <tr key={section.title}>
                <td colSpan={5} className="pt-6 pb-2">
                  <span className="text-xs text-white/30 font-body uppercase tracking-widest">{section.title}</span>
                </td>
              </tr>
              {section.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-6 text-sm text-white/60 font-body">{row.label}</td>
                  <td className="py-3 px-3 text-center"><TableCell val={row.free} /></td>
                  <td className="py-3 px-3 text-center bg-violet-500/[0.04]"><TableCell val={row.pro} /></td>
                  <td className="py-3 px-3 text-center"><TableCell val={row.business} /></td>
                  <td className="py-3 px-3 text-center"><TableCell val={row.enterprise} /></td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-2">
      {FAQS.map((faq, i) => (
        <div key={i} className="border border-white/8 rounded-2xl overflow-hidden bg-white/[0.02]">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-start justify-between px-6 py-5 text-left gap-4 group"
            aria-expanded={open === i}
          >
            <span className="text-sm text-white/80 group-hover:text-white transition-colors font-body leading-relaxed">{faq.q}</span>
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className={`flex-shrink-0 mt-0.5 text-white/30 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-sm text-white/40 font-body leading-relaxed border-t border-white/5">
              <p className="pt-4">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function PricingClient() {
  const supabase = getBrowserClient()
  const t = useTranslations('pricing')
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAnnual, setIsAnnual] = useState(false)

  const annualTotals: Record<number, number> = { 4.99: 45, 14.99: 120 }

  const getDisplayPrice = (monthly: number) => {
    if (monthly === 0) return '0'
    if (isAnnual) return (annualTotals[monthly] / 12).toFixed(2)
    return monthly.toFixed(2)
  }

  const handleUpgrade = async (key: string, priceId?: string | null, annualPriceId?: string | null) => {
    if (key === 'enterprise') {
      window.location.href = 'mailto:enterprise@vaultransfer.com?subject=Enterprise plan inquiry'
      return
    }
    if (!priceId && !annualPriceId) {
      router.push('/login')
      return
    }
    setLoading(key)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      const selectedPriceId = isAnnual ? annualPriceId : priceId
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: selectedPriceId, userId: session.user.id, accessToken: session.access_token }),
      })
      const data = await response.json()
      if (data.url) window.location.href = data.url
      else setError(data.error ? t(`errors.${data.error}`) : t('error'))
    } catch {
      setError(t('error'))
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      key: 'free',
      name: 'Free',
      desc: 'Send files quickly, no sign-up required.',
      monthlyPrice: 0,
      priceLabel: '€0',
      priceSub: 'forever',
      highlight: false,
      badge: null,
      cta: 'Get started free',
      ctaStyle: 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10',
      features: [
        '2 GB per transfer',
        'Links expire after 7 days',
        'Unlimited downloads',
        'Transfer notes',
        'Email on first download',
      ],
      priceId: null,
      annualPriceId: null,
    },
    {
      key: 'pro',
      name: 'Pro',
      desc: 'More space, longer links, and zero ads.',
      monthlyPrice: 4.99,
      priceLabel: `€${getDisplayPrice(4.99)}`,
      priceSub: isAnnual ? `€${annualTotals[4.99]} billed annually` : 'per month',
      highlight: true,
      badge: 'Most popular',
      cta: 'Start Pro',
      ctaStyle: 'bg-violet-600 hover:bg-violet-500 text-white',
      features: [
        '50 GB per transfer',
        'Links expire after 30 days',
        'No ads',
        'Download statistics',
        'Custom expiry dates',
        'Email support',
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
      annualPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL,
    },
    {
      key: 'business',
      name: 'Business',
      desc: 'Unlimited expiry, API access, and advanced security.',
      monthlyPrice: 14.99,
      priceLabel: `€${getDisplayPrice(14.99)}`,
      priceSub: isAnnual ? `€${annualTotals[14.99]} billed annually` : 'per month',
      highlight: false,
      badge: null,
      cta: 'Start Business',
      ctaStyle: 'bg-accent hover:bg-accent-dim text-ink',
      features: [
        '200 GB per transfer',
        'No expiry limit',
        'Password-protected links',
        'Public REST API & keys',
        'Priority support',
        'Everything in Pro',
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS,
      annualPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_ANNUAL,
    },
    {
      key: 'enterprise',
      name: 'Enterprise',
      desc: 'Custom limits, SSO, dedicated support, and SLAs.',
      monthlyPrice: -1,
      priceLabel: 'Custom',
      priceSub: 'volume pricing',
      highlight: false,
      badge: null,
      cta: 'Contact sales',
      ctaStyle: 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/20',
      features: [
        'Custom storage limits',
        'Webhooks & custom domain',
        'SSO / SAML',
        'Dedicated account manager',
        'Custom SLA',
        'Everything in Business',
      ],
      priceId: null,
      annualPriceId: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <main className="max-w-6xl mx-auto px-6 py-24">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/40 mb-6 font-body">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            Simple, transparent pricing
          </div>
          <h1 className="text-5xl font-display font-700 tracking-tight mb-4">
            Pick the plan that fits
          </h1>
          <p className="text-white/40 text-lg max-w-md mx-auto font-body">
            Start for free. Upgrade when you need more space, longer links, or API access.
          </p>
        </div>

        {/* ── Billing toggle ── */}
        <div className="flex flex-col items-center gap-3 mb-14">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-5 py-2">
            <button
              onClick={() => setIsAnnual(false)}
              className={`text-sm font-body transition-colors px-2 py-0.5 rounded-full ${!isAnnual ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${isAnnual ? 'bg-accent' : 'bg-white/15'}`}
              aria-label="Toggle annual billing"
              role="switch"
              aria-checked={isAnnual}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${isAnnual ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`text-sm font-body transition-colors px-2 py-0.5 rounded-full flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              Annual
              <span className="text-xs font-body px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/20">
                Save up to 33%
              </span>
            </button>
          </div>
          {isAnnual && (
            <p className="text-xs text-white/30 font-body animate-fade-up">
              Pro saves €{(4.99 * 12 - 45).toFixed(2)}/yr · Business saves €{(14.99 * 12 - 120).toFixed(2)}/yr
            </p>
          )}
        </div>

        {error && (
          <div className="mb-10 text-center text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 font-body">
            {error}
          </div>
        )}

        {/* ── Plan cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                plan.highlight
                  ? 'bg-gradient-to-b from-violet-900/40 to-violet-900/10 border-violet-500/40 ring-1 ring-violet-500/20 shadow-xl shadow-violet-900/20'
                  : 'bg-white/[0.03] border-white/8 hover:border-white/15'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-violet-600 text-white text-xs font-display font-600 px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name & desc */}
              <div className="mb-5">
                <p className={`text-xs font-body uppercase tracking-widest mb-1 ${
                  plan.key === 'pro' ? 'text-violet-400' :
                  plan.key === 'business' ? 'text-accent' :
                  plan.key === 'enterprise' ? 'text-amber-400' : 'text-white/30'
                }`}>{plan.name}</p>
                <p className="text-xs text-white/40 font-body leading-relaxed">{plan.desc}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-display font-700 tracking-tight text-white leading-none">
                    {plan.monthlyPrice === -1 ? 'Custom' : plan.priceLabel}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-white/30 text-xs font-body mb-1">/mo</span>
                  )}
                </div>
                <p className="text-xs text-white/25 font-body mt-1">{plan.priceSub}</p>
              </div>

              {/* CTA */}
              <button
                onClick={() => handleUpgrade(plan.key, plan.priceId, plan.annualPriceId)}
                disabled={loading === plan.key}
                className={`w-full py-2.5 rounded-xl text-sm font-display font-600 transition-all mb-6 disabled:opacity-50 disabled:cursor-not-allowed ${plan.ctaStyle}`}
              >
                {loading === plan.key ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Loading…
                  </span>
                ) : plan.cta}
              </button>

              {/* Feature list */}
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className={`flex-shrink-0 mt-0.5 ${
                      plan.key === 'pro' ? 'text-violet-400' :
                      plan.key === 'business' ? 'text-accent' :
                      plan.key === 'enterprise' ? 'text-amber-400' : 'text-white/30'
                    }`} />
                    <span className="text-sm text-white/60 font-body">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Comparison table ── */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-700 tracking-tight mb-3">Compare all features</h2>
            <p className="text-white/40 text-sm font-body">Everything included in each plan, side by side.</p>
          </div>
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl px-6 py-4">
            <ComparisonTable />
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-700 tracking-tight mb-3">Frequently asked questions</h2>
            <p className="text-white/40 text-sm font-body">{"Can't find the answer?"} <a href="mailto:support@vaultransfer.com" className="text-accent hover:underline">Email our support team.</a></p>
          </div>
          <FaqAccordion />
        </div>

        {/* ── Trust bar ── */}
        <div className="border-t border-white/8 pt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-white/25 font-body">
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-white/20" aria-hidden="true">
              <rect x="2" y="5" width="12" height="9" rx="1.5" strokeLinejoin="round"/>
              <path d="M5 5V3.5a3 3 0 0 1 6 0V5" strokeLinecap="round"/>
            </svg>
            Payments secured by Stripe
          </span>
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-white/20" aria-hidden="true">
              <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z" strokeLinejoin="round"/>
            </svg>
            30-day money-back guarantee
          </span>
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-white/20" aria-hidden="true">
              <circle cx="8" cy="8" r="6"/>
              <path d="M8 5v3.5l2 1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Cancel any time
          </span>
          <Link href="/faq" className="hover:text-white/50 transition-colors underline underline-offset-2">
            Full FAQ
          </Link>
        </div>

      </main>
    </div>
  )
}
