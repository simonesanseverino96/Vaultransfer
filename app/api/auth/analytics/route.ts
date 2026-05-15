import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { logger } from '@/lib/logger'

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
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Use admin client to bypass any potential RLS issues on aggregate queries if necessary,
    // though using regular client with RLS is also fine if policies are set up correctly.
    // The previous transfers route uses admin client.
    const admin = supabaseAdmin()
    
    const { data: transfers } = await admin
      .from('transfers')
      .select('created_at, total_size, download_count, max_downloads, expires_at')
      .eq('user_id', user.id)

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    let totalTransfers = 0
    let last30DaysTransfers = 0
    let totalSize = 0
    let totalDownloads = 0
    let activeTransfers = 0
    let expiredTransfers = 0
    let maxDownloadsTransfer = 0

    const chartMap = new Map<string, number>()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      chartMap.set(d.toISOString().split('T')[0], 0)
    }

    if (transfers) {
      totalTransfers = transfers.length
      for (const t of transfers) {
        totalSize += t.total_size || 0
        totalDownloads += t.download_count || 0
        if ((t.download_count || 0) > maxDownloadsTransfer) maxDownloadsTransfer = t.download_count || 0

        const createdAt = new Date(t.created_at)
        const expiresAt = new Date(t.expires_at)

        if (createdAt >= thirtyDaysAgo) {
          last30DaysTransfers++
          const dayStr = createdAt.toISOString().split('T')[0]
          if (chartMap.has(dayStr)) chartMap.set(dayStr, chartMap.get(dayStr)! + 1)
        }

        if (expiresAt < now) expiredTransfers++
        else activeTransfers++
      }
    }

    const chartData = Array.from(chartMap.entries()).map(([date, count]) => ({ date, count }))
    const avgFileSize = totalTransfers > 0 ? Math.round(totalSize / totalTransfers) : 0
    const downloadRate = totalTransfers > 0 ? parseFloat((totalDownloads / totalTransfers).toFixed(2)) : 0

    logger.info('analytics fetched', { userId: user.id, totalTransfers, totalSize })

    return NextResponse.json({
      totalTransfers,
      last30DaysTransfers,
      totalSize,
      totalDownloads,
      activeTransfers,
      expiredTransfers,
      avgFileSize,
      downloadRate,
      maxDownloadsTransfer,
      chartData,
    })
  } catch (error) {
    logger.error('analytics fetch failed', { error: String(error) })
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
