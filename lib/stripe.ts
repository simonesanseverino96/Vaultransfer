import Stripe from 'stripe'

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
