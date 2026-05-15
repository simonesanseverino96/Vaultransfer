'use client'

import { useEffect, useState } from 'react'

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

const PREF_ITEMS: { key: keyof Prefs; label: string; desc: string }[] = [
  { key: 'uploadConfirmation', label: 'Upload confirmation', desc: 'Email when your transfer is ready to share' },
  { key: 'downloadNotification', label: 'Download notification', desc: 'Email when someone downloads your files (first download only)' },
  { key: 'storageWarning', label: 'Storage warning', desc: 'Email when you reach 80% of your storage limit' },
  { key: 'expiryReminder', label: 'Expiry reminder', desc: 'Email 24 hours before a transfer expires' },
]

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
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFS_KEY)
      if (stored) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(stored) })
    } catch {}
  }, [])

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
          <h3 className="font-display text-lg font-700 text-paper">Email notifications</h3>
          <p className="text-xs text-muted font-body mt-1">Choose which emails VaultTransfer sends you</p>
        </div>
        {saved && <span className="text-xs text-accent font-body animate-fade-up">Saved</span>}
      </div>

      <div className="space-y-4">
        {PREF_ITEMS.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div>
              <label htmlFor={`pref-${key}`} className="text-sm text-paper font-body cursor-pointer">{label}</label>
              <p className="text-xs text-muted font-body mt-0.5">{desc}</p>
            </div>
            <Toggle id={`pref-${key}`} checked={prefs[key]} onChange={v => update(key, v)} />
          </div>
        ))}
      </div>

      <p className="text-xs text-muted font-body mt-6 pt-4 border-t border-white/5">
        Notification preferences are saved locally. Server-side sync coming soon.
      </p>
    </div>
  )
}
