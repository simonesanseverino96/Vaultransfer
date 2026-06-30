import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

let _stripe: Stripe | null = null

function createStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
    })
  }
  return _stripe
}

// Proxy keeps the `stripe` export signature intact so no callers need to change,
// while deferring initialization until the first actual API call (not at module load).
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    return Reflect.get(createStripe(), prop)
  },
})

export const getStripeCustomerPortalUrl = async (customerId: string): Promise<string> => {
  const session = await createStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })
  return session.url
}

async function createAndSaveCustomer(userId: string): Promise<string> {
  const supabase = supabaseAdmin()
  const { data: authData } = await supabase.auth.admin.getUserById(userId)
  const customer = await createStripe().customers.create({
    email: authData.user?.email,
    metadata: { supabase_user_id: userId },
  })
  await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId)
  return customer.id
}

async function retrieveOrRecreate(userId: string, customerId: string): Promise<string> {
  try {
    const existing = await createStripe().customers.retrieve(customerId)
    if (!(existing as Stripe.DeletedCustomer).deleted) return customerId
  } catch (err: any) {
    if (err?.code !== 'resource_missing') throw err
  }
  return createAndSaveCustomer(userId)
}

// Checkout: crea il customer se non esiste, recupera/ricrea se stale
export async function getOrCreateStripeCustomer(userId: string): Promise<string> {
  const supabase = supabaseAdmin()
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()

  const existingId = profile?.stripe_customer_id ?? null
  return existingId
    ? retrieveOrRecreate(userId, existingId)
    : createAndSaveCustomer(userId)
}

// Portal: richiede customer preesistente in Supabase, ricrea solo se stale su Stripe
export async function ensureStripeCustomer(userId: string, customerId: string): Promise<string> {
  return retrieveOrRecreate(userId, customerId)
}
