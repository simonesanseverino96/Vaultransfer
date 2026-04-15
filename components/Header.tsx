'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Header() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [plan, setPlan] = useState<string>('free')
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser({ email: user.email! })
        const { data } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single()
        setPlan(data?.plan || 'free')
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email! })
        const { data } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', session.user.id)
          .single()
        setPlan(data?.plan || 'free')
      } else {
        setUser(null)
        setPlan('free')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <header className="relative z-10 border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M5 7l3 3 3-3M3 12h10" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display text-xl font-700 tracking-tight text-paper">VaultTransfer</span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/prezzi" className="text-sm text-muted hover:text-paper font-body transition-colors">
            Prezzi
          </a>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Piano badge */}
                  <span className={`px-2 py-1 rounded-full text-xs font-body ${
                    plan === 'free' ? 'bg-white/10 text-muted' : 'bg-accent/15 text-accent'
                  }`}>
                    {plan === 'free' ? 'Free' : plan === 'pro' ? '⭐ Pro' : '🏢 Business'}
                  </span>

                  {/* User menu */}
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-white/10 rounded-xl text-sm font-body text-paper hover:border-accent/30 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-ink text-xs font-display font-700">
                        {user.email[0].toUpperCase()}
                      </div>
                      <span className="max-w-[120px] truncate text-xs">{user.email}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                        <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-body text-paper hover:bg-white/5 transition-colors">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                          </svg>
                          Dashboard
                        </a>
                        {plan === 'free' && (
                          <a href="/prezzi" className="flex items-center gap-3 px-4 py-3 text-sm font-body text-accent hover:bg-accent/5 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            Passa a Pro
                          </a>
                        )}
                        <div className="border-t border-white/5" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-muted hover:text-paper hover:bg-white/5 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                          </svg>
                          Esci
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <a href="/login" className="text-sm text-muted hover:text-paper font-body transition-colors">
                    Accedi
                  </a>
                  <a href="/login" className="px-4 py-2 bg-accent text-ink rounded-xl text-sm font-display font-600 hover:bg-accent-dim transition-colors">
                    Registrati gratis →
                  </a>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-muted hover:text-paper transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-surface px-6 py-4 space-y-3">
          <a href="/prezzi" className="block text-sm text-muted hover:text-paper font-body transition-colors py-2">Prezzi</a>
          {user ? (
            <>
              <a href="/dashboard" className="block text-sm text-paper font-body py-2">Dashboard</a>
              {plan === 'free' && <a href="/prezzi" className="block text-sm text-accent font-body py-2">⭐ Passa a Pro</a>}
              <button onClick={handleLogout} className="block text-sm text-muted font-body py-2">Esci</button>
            </>
          ) : (
            <>
              <a href="/login" className="block text-sm text-muted hover:text-paper font-body py-2">Accedi</a>
              <a href="/login" className="block px-4 py-2 bg-accent text-ink rounded-xl text-sm font-display font-600 text-center">Registrati gratis →</a>
            </>
          )}
        </div>
      )}
    </header>
  )
}