import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { PLANS, PlanType } from '@/lib/plans'

export async function POST(req: NextRequest) {
  try {
    const { plan, accessToken } = await req.json() as { plan: PlanType; accessToken: string }

    if (!accessToken) {
      return NextResponse.json({ error: 'Non autenticato', requiresLogin: true }, { status: 401 })
    }

    const planConfig = PLANS[plan]
    if (!planConfig.stripePriceId) {
      return NextResponse.json({ error: 'Piano non valido' }, { status: 400 })
    }

    // Verifica il token con Supabase
    const supabase = supabaseAdmin()
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)

    if (authError || !user) {
      return NextResponse.json({ error: 'Token non valido', requiresLogin: true }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: planConfig.stripePriceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/prezzi?cancelled=true`,
      metadata: { supabase_user_id: user.id, plan },
      subscription_data: { metadata: { supabase_user_id: user.id, plan } },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Errore nel checkout' }, { status: 500 })
  }
}