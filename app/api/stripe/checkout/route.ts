import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getServerSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { PLANS, PlanType } from '@/lib/plans'

export async function POST(req: NextRequest) {
  try {
    const user = await getServerSession()
    if (!user) {
      return NextResponse.json({ error: 'Devi accedere per abbonarti' }, { status: 401 })
    }

    const { plan } = await req.json() as { plan: PlanType }
    const planConfig = PLANS[plan]

    if (!planConfig.stripePriceId) {
      return NextResponse.json({ error: 'Piano non valido' }, { status: 400 })
    }

    const supabase = supabaseAdmin()
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    // Crea customer Stripe se non esiste
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

    // Crea checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: planConfig.stripePriceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/prezzi?cancelled=true`,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Errore nel checkout' }, { status: 500 })
  }
}
