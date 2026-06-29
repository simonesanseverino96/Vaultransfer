import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const intlMiddleware = createIntlMiddleware(routing)

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API routes: skip next-intl entirely, only run Supabase auth logic
  if (pathname.startsWith('/api')) {
    const isUploadInit = pathname === '/api/upload/init'
    const isUpload     = pathname === '/api/upload'

    if (!isUploadInit && !isUpload) {
      return NextResponse.next()
    }

    let accessToken = request.headers.get('Authorization')?.replace('Bearer ', '')
    let body: any = null
    if (request.method === 'POST') {
      const contentType = request.headers.get('content-type') || ''
      if (!contentType.includes('multipart/form-data')) {
        try {
          body = await request.clone().json()
          if (body?.accessToken) accessToken = body.accessToken
        } catch (e) {}
      }
    }

    const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL     || 'http://localhost:54321'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon_key'
    const apiResponse     = NextResponse.next()

    const clientOptions: any = {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            apiResponse.cookies.set(name, value, options)
          )
        },
      },
    }
    if (accessToken) {
      clientOptions.global = { headers: { Authorization: `Bearer ${accessToken}` } }
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, clientOptions)
    let user = null
    if (accessToken) {
      const { data } = await supabase.auth.getUser(accessToken)
      user = data?.user
    } else {
      const { data } = await supabase.auth.getUser()
      user = data?.user
    }

    let isPremiumFeatureRequested = false
    if (body?.config) {
      const { expiry, password, maxDownloads } = body.config
      if (password && password.trim() !== '') isPremiumFeatureRequested = true
      if (expiry && parseInt(expiry, 10) > 7)  isPremiumFeatureRequested = true
      if (maxDownloads === null || maxDownloads > 5) isPremiumFeatureRequested = true
    }

    if (isPremiumFeatureRequested) {
      if (!user) {
        return NextResponse.json({ error: 'ERR_UNAUTHORIZED' }, { status: 401 })
      }

      let profile = null
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('plan, subscription_status, subscription_ends_at')
        .eq('id', user.id)
        .single()
      if (userProfile) {
        profile = userProfile
      } else {
        const { data: profileOrig } = await supabase
          .from('profiles')
          .select('plan, subscription_status, subscription_ends_at')
          .eq('id', user.id)
          .single()
        if (profileOrig) {
          profile = profileOrig
        } else {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan, subscription_status, subscription_ends_at')
            .eq('id', user.id)
            .single()
          profile = subscription
        }
      }

      let plan = 'free'
      if (profile && profile.plan !== 'free') {
        if (profile.subscription_status === 'active') {
          plan = profile.plan
        } else if (profile.subscription_ends_at && new Date(profile.subscription_ends_at) > new Date()) {
          plan = profile.plan
        }
      }

      if (plan === 'free') {
        return NextResponse.json({ error: 'ERR_PLAN_REQUIRED', requiredPlan: 'pro' }, { status: 403 })
      }
    }

    return apiResponse
  }

  const isDashboard = pathname === '/dashboard' || /^\/[a-z]{2}\/dashboard$/.test(pathname)

  let supabaseResponse = intlMiddleware(request)

  if (!isDashboard) {
    return supabaseResponse
  }

  let accessToken = request.headers.get('Authorization')?.replace('Bearer ', '')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon_key'

  const clientOptions: any = {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: any[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  }

  if (accessToken) {
    clientOptions.global = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, clientOptions)

  let user = null
  if (accessToken) {
    const { data } = await supabase.auth.getUser(accessToken)
    user = data?.user
  } else {
    const { data } = await supabase.auth.getUser()
    user = data?.user
  }

  if (!user) {
    return NextResponse.json({ error: 'ERR_UNAUTHORIZED' }, { status: 401 })
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard',
    '/:locale/dashboard',
    '/api/upload/init',
    '/api/upload',
    '/',
    '/(en|it|de|fr|es|pt|ja|zh|ar)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}
