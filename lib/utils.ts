import { formatDistanceToNow } from 'date-fns'
import { it, de, fr, es, pt, ja, zhCN, ar } from 'date-fns/locale'

const dateFnsLocales: Record<string, Locale> = {
  it, de, fr, es, pt, ja, zh: zhCN, ar,
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatExpiry(expiresAt: string, locale = 'en'): string {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  if (diff <= 24 * 3600 * 1000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}h`
  }
  return formatDistanceToNow(new Date(expiresAt), { addSuffix: true, locale: dateFnsLocales[locale] })
}

export function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
