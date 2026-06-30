import { NextRequest, NextResponse } from 'next/server'
import { stripe, getOrCreateStripeCustomer } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { PLANS, PlanType } from '@/lib/plans'
import { checkoutRatelimit } from '@/lib/ratelimit'

const PAID_PLANS: PlanType[] = ['pro', 'business']
type BillingCycle = 'monthly' | 'annual'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous'
  const { success } = await checkoutRatelimit.limit(ip)
  if (!success) return NextResponse.json({ error: 'ERR_RATE_LIMITED' }, { status: 429 })

  try {
    const { plan, billing, accessToken } = await req.json() as {
      plan: PlanType
      billing: BillingCycle
      accessToken: string
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'ERR_UNAUTHORIZED', requiresLogin: true }, { status: 401 })
    }

    if (!PAID_PLANS.includes(plan)) {
      return NextResponse.json({ error: 'ERR_INVALID_PLAN' }, { status: 400 })
    }

    if (billing !== 'monthly' && billing !== 'annual') {
      return NextResponse.json({ error: 'ERR_INVALID_BILLING' }, { status: 400 })
    }

    const planConfig = PLANS[plan]
    const priceId = billing === 'annual'
      ? planConfig.stripePriceIdAnnual
      : planConfig.stripePriceIdMonthly

    if (!priceId) {
      return NextResponse.json({ error: 'ERR_INVALID_PLAN' }, { status: 400 })
    }

    // Verifica il token con Supabase
    const supabase = supabaseAdmin()
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)

    if (authError || !user) {
      return NextResponse.json({ error: 'ERR_INVALID_TOKEN', requiresLogin: true }, { status: 401 })
    }

    const customerId = await getOrCreateStripeCustomer(user.id)

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/prezzi?cancelled=true`,
      metadata: { supabase_user_id: user.id, plan },
      subscription_data: { metadata: { supabase_user_id: user.id, plan } },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
  console.error('Stripe checkout error:', err)
  return NextResponse.json({ error: err.message || 'Errore nel checkout' }, { status: 500 })
}
}