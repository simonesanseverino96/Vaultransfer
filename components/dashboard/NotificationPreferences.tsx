'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const PREFS_KEY = 'vt:notification_prefs'

interface Prefs {
  uploadConfirmation: boolean
  downloadNotification: boolean
  storageWarning: boolean
  expiryReminder: boolean
}

const DEFAULT_PREFS: Prefs = {
  uploadConfirmation: true,
  downloadNotification: true,
  storageWarning: true,
  expiryReminder: false,
}

const PREF_KEYS: (keyof Prefs)[] = ['uploadConfirmation', 'downloadNotification', 'storageWarning', 'expiryReminder']

function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex-shrink-0 ${checked ? 'bg-accent' : 'bg-white/10'}`}
    >
      <span className={`inline-block w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 mt-0.5 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function NotificationPreferences() {
  const t = useTranslations('dashboard.notifications')
  const [prefs, setPrefs] = useState<Prefs>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(PREFS_KEY) : null
      if (stored) return { ...DEFAULT_PREFS, ...JSON.parse(stored) }
    } catch {}
    return DEFAULT_PREFS
  })
  const [saved, setSaved] = useState(false)

  const update = (key: keyof Prefs, value: boolean) => {
    const next = { ...prefs, [key]: value }
    setPrefs(next)
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(next)) } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-lg font-700 text-paper">{t('title')}</h3>
          <p className="text-xs text-muted font-body mt-1">{t('subtitle')}</p>
        </div>
        {saved && <span className="text-xs text-accent font-body animate-fade-up">{t('saved')}</span>}
      </div>

      <div className="space-y-4">
        {PREF_KEYS.map(key => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div>
              <label htmlFor={`pref-${key}`} className="text-sm text-paper font-body cursor-pointer">{t(key)}</label>
              <p className="text-xs text-muted font-body mt-0.5">{t(`${key}Desc`)}</p>
            </div>
            <Toggle id={`pref-${key}`} checked={prefs[key]} onChange={v => update(key, v)} />
          </div>
        ))}
      </div>

      <p className="text-xs text-muted font-body mt-6 pt-4 border-t border-white/5">
        {t('localNote')}
      </p>
    </div>
  )
}
