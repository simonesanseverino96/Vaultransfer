export type PlanType = 'free' | 'pro' | 'business' | 'enterprise'

export interface PlanConfig {
  name: string
  price: number // EUR/mese
  maxFileSizeMB: number
  maxTotalSizeMB: number
  maxDaysExpiry: number | null  // null = nessun limite di scadenza
  maxDownloads: number | null // null = illimitati
  hasAds: boolean
  hasPasswordProtection: boolean
  hasHistory: boolean
  hasApiAccess: boolean
  stripePriceIdMonthly: string | null
  stripePriceIdAnnual: string | null
}

export const ENTERPRISE_PLANS: PlanType[] = ['enterprise']
export const BUSINESS_AND_ABOVE: PlanType[] = ['business', 'enterprise']

export const PLANS: Record<PlanType, PlanConfig> = {
  free: {
    name: 'Free',
    price: 0,
    maxFileSizeMB: 2048,        // 2GB
    maxTotalSizeMB: 2048,       // 2GB totali per trasferimento
    maxDaysExpiry: 7,
    maxDownloads: 5,
    hasAds: true,
    hasPasswordProtection: false,
    hasHistory: false,
    hasApiAccess: false,
    stripePriceIdMonthly: null,
    stripePriceIdAnnual: null,
  },
  pro: {
    name: 'Pro',
    price: 4.99,
    maxFileSizeMB: 20480,       // 20GB
    maxTotalSizeMB: 20480,
    maxDaysExpiry: 90,
    maxDownloads: null,         // illimitati
    hasAds: false,
    hasPasswordProtection: true,
    hasHistory: true,
    hasApiAccess: false,
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO ?? null,
    stripePriceIdAnnual: process.env.STRIPE_PRICE_PRO_ANNUAL ?? null,
  },
  business: {
    name: 'Business',
    price: 14.99,
    maxFileSizeMB: 102400,      // 100GB
    maxTotalSizeMB: 102400,
    maxDaysExpiry: null,        // illimitato
    maxDownloads: null,
    hasAds: false,
    hasPasswordProtection: true,
    hasHistory: true,
    hasApiAccess: true,
    stripePriceIdMonthly: process.env.STRIPE_PRICE_BUSINESS ?? null,
    stripePriceIdAnnual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL ?? null,
  },
  enterprise: {
    name: 'Enterprise',
    price: -1,
    maxFileSizeMB: -1,
    maxTotalSizeMB: -1,
    maxDaysExpiry: -1,
    maxDownloads: null,
    hasAds: false,
    hasPasswordProtection: true,
    hasHistory: true,
    hasApiAccess: true,
    stripePriceIdMonthly: null,
    stripePriceIdAnnual: null,
  },
}

export function getPlanLimits(plan: PlanType): PlanConfig {
  return PLANS[plan]
}
