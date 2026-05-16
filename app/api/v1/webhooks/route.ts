import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

async function verifyApiKey(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer vt_live_')) return null

  const rawKey = authHeader.replace('Bearer vt_live_', '')
  const parts = rawKey.split('_')
  if (parts.length !== 2) return null

  const [keyId, secret] = parts
  const supabase = supabaseAdmin()

  const { data: key } = await supabase
    .from('api_keys')
    .select('id, user_id, key_hash')
    .eq('id', keyId)
    .eq('is_active', true)
    .single()

  if (!key) return null

  const match = await bcrypt.compare(secret, key.key_hash)
  if (!match) return null

  await supabase.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', key.id)
  return key.user_id
}

async function requireEnterprise(userId: string): Promise<boolean> {
  const supabase = supabaseAdmin()
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single()
  return profile?.plan === 'enterprise'
}

// GET /api/v1/webhooks — list webhook endpoints
export async function GET(req: NextRequest) {
  const userId = await verifyApiKey(req)
  if (!userId) return NextResponse.json({ error: 'ERR_UNAUTHORIZED' }, { status: 401 })
  if (!await requireEnterprise(userId)) return NextResponse.json({ error: 'ERR_ENTERPRISE_REQUIRED' }, { status: 403 })

  const supabase = supabaseAdmin()
  const { data: endpoints } = await supabase
    .from('webhook_endpoints')
    .select('id, url, events, created_at, is_active')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return NextResponse.json({ endpoints: endpoints || [] })
}

// POST /api/v1/webhooks — create webhook endpoint
export async function POST(req: NextRequest) {
  const userId = await verifyApiKey(req)
  if (!userId) return NextResponse.json({ error: 'ERR_UNAUTHORIZED' }, { status: 401 })
  if (!await requireEnterprise(userId)) return NextResponse.json({ error: 'ERR_ENTERPRISE_REQUIRED' }, { status: 403 })

  const { url, events } = await req.json()
  if (!url || typeof url !== 'string') return NextResponse.json({ error: 'ERR_MISSING_URL' }, { status: 400 })

  try { new URL(url) } catch {
    return NextResponse.json({ error: 'ERR_INVALID_URL' }, { status: 400 })
  }

  const allowedEvents = ['transfer.created', 'transfer.downloaded', 'transfer.expired']
  const selectedEvents: string[] = Array.isArray(events) ? events.filter((e: string) => allowedEvents.includes(e)) : allowedEvents

  const secret = uuidv4().replace(/-/g, '')
  const supabase = supabaseAdmin()

  const { data, error } = await supabase
    .from('webhook_endpoints')
    .insert({ user_id: userId, url, events: selectedEvents, secret })
    .select('id, url, events, created_at')
    .single()

  if (error) return NextResponse.json({ error: 'ERR_CREATION_FAILED' }, { status: 500 })

  return NextResponse.json({ endpoint: data, secret }, { status: 201 })
}

// DELETE /api/v1/webhooks — remove webhook endpoint
export async function DELETE(req: NextRequest) {
  const userId = await verifyApiKey(req)
  if (!userId) return NextResponse.json({ error: 'ERR_UNAUTHORIZED' }, { status: 401 })
  if (!await requireEnterprise(userId)) return NextResponse.json({ error: 'ERR_ENTERPRISE_REQUIRED' }, { status: 403 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ERR_MISSING_ID' }, { status: 400 })

  const supabase = supabaseAdmin()
  const { error } = await supabase
    .from('webhook_endpoints')
    .update({ is_active: false })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: 'ERR_DELETE_FAILED' }, { status: 500 })
  return NextResponse.json({ success: true })
}
