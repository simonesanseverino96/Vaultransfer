import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { promises as dns } from 'dns'

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

async function checkDnsTxt(domain: string, expectedToken: string): Promise<boolean> {
  try {
    const records = await dns.resolveTxt(`_vaultransfer-verify.${domain}`)
    return records.some(r => r.join('').includes(expectedToken))
  } catch {
    return false
  }
}

// GET /api/v1/domains — list registered custom domains
export async function GET(req: NextRequest) {
  const userId = await verifyApiKey(req)
  if (!userId) return NextResponse.json({ error: 'ERR_UNAUTHORIZED' }, { status: 401 })
  if (!await requireEnterprise(userId)) return NextResponse.json({ error: 'ERR_ENTERPRISE_REQUIRED' }, { status: 403 })

  const supabase = supabaseAdmin()
  const { data: domains } = await supabase
    .from('custom_domains')
    .select('id, domain, verified, verification_token, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return NextResponse.json({ domains: domains || [] })
}

// POST /api/v1/domains — register or verify a custom domain
// Body: { domain } to register | { id, action: "verify" } to verify
export async function POST(req: NextRequest) {
  const userId = await verifyApiKey(req)
  if (!userId) return NextResponse.json({ error: 'ERR_UNAUTHORIZED' }, { status: 401 })
  if (!await requireEnterprise(userId)) return NextResponse.json({ error: 'ERR_ENTERPRISE_REQUIRED' }, { status: 403 })

  const body = await req.json()
  const supabase = supabaseAdmin()

  if (body.action === 'verify' && body.id) {
    const { data: record } = await supabase
      .from('custom_domains')
      .select('id, domain, verification_token, verified')
      .eq('id', body.id)
      .eq('user_id', userId)
      .single()

    if (!record) return NextResponse.json({ error: 'ERR_NOT_FOUND' }, { status: 404 })
    if (record.verified) return NextResponse.json({ verified: true, domain: record.domain })

    const ok = await checkDnsTxt(record.domain, record.verification_token)
    if (!ok) {
      return NextResponse.json({
        verified: false,
        message: `Add TXT record: _vaultransfer-verify.${record.domain} = ${record.verification_token}`,
      })
    }

    await supabase.from('custom_domains').update({ verified: true }).eq('id', record.id)
    return NextResponse.json({ verified: true, domain: record.domain })
  }

  const { domain } = body
  if (!domain || typeof domain !== 'string') return NextResponse.json({ error: 'ERR_MISSING_DOMAIN' }, { status: 400 })

  const hostname = domain.replace(/^https?:\/\//, '').toLowerCase().trim()
  if (!/^[a-z0-9][a-z0-9.-]+\.[a-z]{2,}$/.test(hostname)) {
    return NextResponse.json({ error: 'ERR_INVALID_DOMAIN' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('custom_domains')
    .select('id')
    .eq('domain', hostname)
    .single()

  if (existing) return NextResponse.json({ error: 'ERR_DOMAIN_TAKEN' }, { status: 409 })

  const verificationToken = `vt-verify=${uuidv4().replace(/-/g, '')}`

  const { data, error } = await supabase
    .from('custom_domains')
    .insert({ user_id: userId, domain: hostname, verification_token: verificationToken })
    .select('id, domain, verification_token, created_at')
    .single()

  if (error) return NextResponse.json({ error: 'ERR_CREATION_FAILED' }, { status: 500 })

  return NextResponse.json({
    domain: data,
    instructions: {
      step1: `Add a DNS TXT record on your domain:`,
      record: `_vaultransfer-verify.${hostname}`,
      value: verificationToken,
      step2: `Then call POST /api/v1/domains with { "id": "${data.id}", "action": "verify" }`,
    },
  }, { status: 201 })
}

// DELETE /api/v1/domains — remove a custom domain
export async function DELETE(req: NextRequest) {
  const userId = await verifyApiKey(req)
  if (!userId) return NextResponse.json({ error: 'ERR_UNAUTHORIZED' }, { status: 401 })
  if (!await requireEnterprise(userId)) return NextResponse.json({ error: 'ERR_ENTERPRISE_REQUIRED' }, { status: 403 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ERR_MISSING_ID' }, { status: 400 })

  const supabase = supabaseAdmin()
  const { error } = await supabase
    .from('custom_domains')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: 'ERR_DELETE_FAILED' }, { status: 500 })
  return NextResponse.json({ success: true })
}
