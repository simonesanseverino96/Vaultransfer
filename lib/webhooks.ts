import { supabaseAdmin } from './supabase'

export type WebhookEventType =
  | 'transfer.created'
  | 'transfer.downloaded'
  | 'transfer.expired'

export interface WebhookEvent {
  event: WebhookEventType
  transfer_token: string
  timestamp: string
  data: Record<string, unknown>
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const buf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return 'sha256=' + Buffer.from(buf).toString('hex')
}

export async function dispatchWebhooks(userId: string, event: WebhookEvent): Promise<void> {
  const supabase = supabaseAdmin()
  const { data: endpoints } = await supabase
    .from('webhook_endpoints')
    .select('url, secret')
    .eq('user_id', userId)
    .eq('is_active', true)

  if (!endpoints?.length) return

  const payload = JSON.stringify(event)

  await Promise.allSettled(
    endpoints.map(async (ep: { url: string; secret: string }) => {
      const sig = await sign(payload, ep.secret)
      await fetch(ep.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VT-Signature': sig,
          'X-VT-Event': event.event,
        },
        body: payload,
        signal: AbortSignal.timeout(5000),
      }).catch(() => {})
    })
  )
}
