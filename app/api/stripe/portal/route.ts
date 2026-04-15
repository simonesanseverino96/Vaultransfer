import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getStripeCustomerPortalUrl } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const user = await getServerSession()
    if (!user) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })

    const supabase = supabaseAdmin()
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'Nessun abbonamento attivo' }, { status: 400 })
    }

    const url = await getStripeCustomerPortalUrl(profile.stripe_customer_id)
    return NextResponse.json({ url })
  } catch (err) {
    console.error('Portal error:', err)
    return NextResponse.json({ error: 'Errore' }, { status: 500 })
  }
}
