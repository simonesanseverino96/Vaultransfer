import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

const PAGE_SIZE = 10

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ transfers: [], hasMore: false, total: 0 })

    const page = Math.max(0, parseInt(req.nextUrl.searchParams.get('page') ?? '0', 10))
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const admin = supabaseAdmin()
    const { data: transfers, count } = await admin
      .from('transfers')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to)

    return NextResponse.json({
      transfers: transfers || [],
      hasMore: count !== null ? from + PAGE_SIZE < count : false,
      total: count ?? 0,
      page,
    })
  } catch {
    return NextResponse.json({ transfers: [], hasMore: false, total: 0 })
  }
}
