import { NextRequest, NextResponse } from 'next/server'
import { loginRatelimit } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous'
  
  // Limita per IP e per email
  const [ipResult, emailResult] = await Promise.all([
    loginRatelimit.limit(ip),
    loginRatelimit.limit(`email:${email}`),
  ])

  if (!ipResult.success || !emailResult.success) {
    return NextResponse.json(
      { error: 'Troppi tentativi. Riprova tra 15 minuti.' },
      { status: 429 }
    )
  }

  return NextResponse.json({ success: true })
}