'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { formatBytes } from '@/lib/utils'
import { UploadConfig } from '@/types'
import UploadSuccess from './UploadSuccess'
import { isBlockedFile, getBlockedReason } from '@/lib/blocklist'
import { v4 as uuidv4 } from 'uuid'

const MAX_SIZE = 2 * 1024 * 1024 * 1024
const MAX_FILES = 20

interface FileWithProgress {
  file: File
  id: string
  progress: number
  speed: number // bytes/sec
  timeLeft: number // seconds
  status: 'pending' | 'uploading' | 'done' | 'error'
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}min`
  return `${(seconds / 3600).toFixed(1)}h`
}

function getFileTypeInfo(file: File): { color: string; label: string } {
  const t = file.type
  if (t.startsWith('image/')) return { color: '#a78bfa', label: 'IMG' }
  if (t === 'application/pdf') return { color: '#f87171', label: 'PDF' }
  if (t.startsWith('video/')) return { color: '#60a5fa', label: 'VID' }
  if (t.startsWith('audio/')) return { color: '#34d399', label: 'AUD' }
  if (t.includes('zip') || t.includes('rar') || t.includes('7z') || t.includes('tar')) return { color: '#fbbf24', label: 'ZIP' }
  if (t.includes('word') || t.includes('document')) return { color: '#60a5fa', label: 'DOC' }
  if (t.includes('sheet') || t.includes('excel')) return { color: '#34d399', label: 'XLS' }
  if (t.includes('presentation') || t.includes('powerpoint')) return { color: '#fb923c', label: 'PPT' }
  if (t.startsWith('text/') || t.includes('javascript') || t.includes('json') || t.includes('xml')) return { color: '#94a3b8', label: 'TXT' }
  return { color: '#00e5a0', label: 'FILE' }
}

function FileTypeIcon({ file }: { file: File }) {
  if (file.type.startsWith('image/')) {
    const url = URL.createObjectURL(file)
    return (
      <Image
        src={url}
        alt={file.name}
        width={32}
        height={32}
        unoptimized
        onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
      />
    )
  }
  const { color, label } = getFileTypeInfo(file)
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
      <span className="text-[9px] font-display font-700" style={{ color }}>{label}</span>
    </div>
  )
}

function getPasswordStrength(pw: string): { level: 0 | 1 | 2; label: string; color: string } {
  if (!pw) return { level: 0, label: '', color: '' }
  const hasLower = /[a-z]/.test(pw)
  const hasUpper = /[A-Z]/.test(pw)
  const hasDigit = /\d/.test(pw)
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw)
  const variety = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length
  if (pw.length >= 12 && variety >= 3) return { level: 2, label: 'Strong', color: '#00e5a0' }
  if (pw.length >= 8 && variety >= 2) return { level: 1, label: 'Medium', color: '#fbbf24' }
  return { level: 0, label: 'Weak', color: '#f87171' }
}

function PasswordStrength({ password }: { password: string }) {
  const { level, label, color } = getPasswordStrength(password)
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= level ? color : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <p className="text-xs font-body transition-colors" style={{ color }}>{label}</p>
    </div>
  )
}

export default function UploadSection() {
  const t = useTranslations('upload')
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [config, setConfig] = useState<UploadConfig>({
    expiry: '7', maxDownloads: 5, password: '', message: '', senderEmail: '',
  })
  const [showOptions, setShowOptions] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [transferToken, setTransferToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const startTimeRef = useRef<Record<string, number>>({})
  const [userPlan, setUserPlan] = useState<string>('free')
  const [customExpiryWarning, setCustomExpiryWarning] = useState<string | null>(null)
  const [showDownloadUpgrade, setShowDownloadUpgrade] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data?.user?.plan) {
          setUserPlan(data.user.plan)
        }
      })
      .catch(() => {})
  }, [])

  const handleExpiryChange = (val: string | number) => {
    const numVal = typeof val === 'string' ? parseInt(val) : val;
    if (userPlan === 'free' && numVal > 7) {
      setCustomExpiryWarning(t('options.expiryWarningFree'));
      setConfig(c => ({ ...c, expiry: '7' }));
    } else {
      setCustomExpiryWarning(null);
      const maxAllowed = (userPlan === 'pro' || userPlan === 'business') ? 90 : 7;
      const finalVal = Math.min(numVal || 1, maxAllowed);
      setConfig(c => ({ ...c, expiry: finalVal.toString() }));
    }
  }

  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    if (rejected.length > 0) setError(t('error.tooLarge', { limit: formatBytes(MAX_SIZE) }))
    const blockedFiles = accepted.filter(f => isBlockedFile(f.name))
    if (blockedFiles.length > 0) {
      setError(getBlockedReason(blockedFiles[0].name) || t('error.blocked'))
      return
    }
    const newFiles = accepted.map(f => ({
      file: f, id: Math.random().toString(36).slice(2),
      progress: 0, speed: 0, timeLeft: 0, status: 'pending' as const,
    }))
    setFiles(prev => {
      const combined = [...prev, ...newFiles]
      if (combined.length > MAX_FILES) { setError(t('error.maxFiles', { max: MAX_FILES })); return prev }
      return combined
    })
    setError(null)
  }, [t])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxSize: MAX_SIZE })
  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id))
  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0)

  const uploadFileWithProgress = (file: File, signedUrl: string, fileId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      startTimeRef.current[fileId] = Date.now()
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (!e.lengthComputable) return
        const progress = Math.round((e.loaded / e.total) * 100)
        const elapsed = (Date.now() - startTimeRef.current[fileId]) / 1000
        const speed = elapsed > 0 ? e.loaded / elapsed : 0
        const timeLeft = speed > 0 ? (e.total - e.loaded) / speed : 0
        setFiles(prev => prev.map(f =>
          f.id === fileId ? { ...f, progress, speed, timeLeft, status: 'uploading' } : f
        ))
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setFiles(prev => prev.map(f =>
            f.id === fileId ? { ...f, progress: 100, speed: 0, timeLeft: 0, status: 'done' } : f
          ))
          resolve()
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => reject(new Error('Network error')))
      xhr.open('PUT', signedUrl)
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
      xhr.send(file)
    })
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setIsUploading(true)
    setError(null)

    try {
      // 1. Chiedi al server di generare i link di upload e gli ID univoci
      const initRes = await fetch('/api/upload/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: files.map(f => ({
            clientFileId: f.id,
            filename: f.file.name,
            size: f.file.size,
            mimeType: f.file.type || 'application/octet-stream'
          }))
        })
      });

      if (!initRes.ok) {
        const initData = await initRes.json();
        throw new Error(initData.error ? t(`errors.${initData.error}`) : t('error.upload'));
      }

      const { transferId, files: signedFiles } = await initRes.json();

      // 2. Esegui l'upload verso i Signed URL generati dal backend
      const uploadedFiles = await Promise.all(
        files.map(async ({ file, id }) => {
          const signedFile = signedFiles.find((sf: any) => sf.clientFileId === id);
          if (!signedFile) throw new Error(t('errors.ERR_SIGNED_URL_NOT_FOUND', { defaultValue: 'Signed URL non trovato' }));

          setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading' } : f))
          await uploadFileWithProgress(file, signedFile.signedUrl, id)

          return {
            id: signedFile.id, 
            filename: signedFile.filename, 
            size: signedFile.size,
            mimeType: signedFile.mimeType, 
            storagePath: signedFile.storagePath,
          }
        })
      )

      let accessToken: string | null = null
      try {
        const tokenRes = await fetch('/api/auth/token', { cache: 'no-store' })
        const tokenData = await tokenRes.json()
        accessToken = tokenData.token ?? null
      } catch {}

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transferId, files: uploadedFiles, config, totalSize, accessToken }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (data.error === 'ERR_INTERNAL') {
          throw new Error('An unexpected error occurred. Please try again.')
        }
        throw new Error(data.error ? t(`errors.${data.error}`) : t('error.transfer'))
      }

      const data = await res.json()
      setTransferToken(data.token)
    } catch (err: any) {
      setError(err.message === 'ERR_INTERNAL' ? 'An unexpected error occurred. Please try again.' : (err.message || t('error.upload')))
      setFiles(prev => prev.map(f => ({ ...f, status: f.status === 'done' ? 'done' : 'error' })))
    } finally {
      setIsUploading(false)
    }
  }

  if (transferToken) {
    return <UploadSuccess token={transferToken} config={config} files={files.map(f => f.file)} />
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        role="button"
        tabIndex={0}
        aria-label={t('dropzone.aria')}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && e.currentTarget.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 md:p-12 cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-accent bg-accent/5 drop-active'
            : 'border-gray-200 dark:border-white/10 bg-white dark:bg-surface hover:border-accent/40 hover:bg-gray-50 dark:hover:bg-surface-2'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragActive ? 'bg-accent' : 'bg-gray-100 dark:bg-surface-2'}`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDragActive ? '#0a0a0f' : '#00e5a0'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
              <path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>
            </svg>
          </div>
          <div>
            <p className="font-display text-lg font-600 text-gray-900 dark:text-paper mb-1">
              {isDragActive ? t('dropzone.active') : t('dropzone.idle')}
            </p>
            <p className="text-muted text-sm font-body">
              {t.rich('dropzone.hint', {
                browse: chunks => <span className="text-accent underline underline-offset-2">{chunks}</span>,
              })}
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map(({ file, id, progress, speed, timeLeft, status }) => (
            <div key={id} className="stagger-item bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <FileTypeIcon file={file} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-paper truncate font-body">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-muted font-body">{formatBytes(file.size)}</p>
                </div>
                {status === 'done' && <span className="text-xs text-accent font-body flex-shrink-0">{t('file.uploaded')}</span>}
                {status === 'error' && <span className="text-xs text-red-400 font-body flex-shrink-0">{t('file.error')}</span>}
                {!isUploading && status === 'pending' && (
                  <button onClick={() => removeFile(id)} aria-label={`Remove ${file.name}`} className="text-muted hover:text-paper transition-colors p-1 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>

              {(status === 'uploading' || status === 'done') && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-display font-600 text-accent">{progress}%</span>
                      {status === 'uploading' && speed > 0 && (
                        <span className="text-xs text-muted font-body">{formatBytes(speed)}/s</span>
                      )}
                    </div>
                    {status === 'uploading' && timeLeft > 0 && (
                      <span className="text-xs text-muted font-body">
                        {t('file.remaining', { time: formatTime(timeLeft) })}
                      </span>
                    )}
                    {status === 'done' && (
                      <span className="text-xs text-accent font-body">{t('file.completed')}</span>
                    )}
                  </div>
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${status === 'done' ? 'bg-accent' : 'progress-shimmer'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center px-1 pt-1 text-xs text-muted font-body">
            <span>{t('summary', { count: files.length, size: formatBytes(totalSize) })}</span>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-2 text-sm text-muted hover:text-paper transition-colors font-body"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: showOptions ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {t('options.toggle')}
          </button>

          {showOptions && (
            <div className="mt-3 bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-xl p-5 space-y-4 animate-fade-up">
              <div>
                <label className="text-xs text-muted mb-2 block font-body">{t('options.expiry')}</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {(['1', '3', '7', '14', '30'] as const).map(d => (
                    <button key={d} onClick={() => handleExpiryChange(d)}
                      className={`flex-1 py-2 rounded-lg text-sm font-body transition-all ${config.expiry === d ? 'bg-accent text-ink font-500' : 'bg-surface-2 text-muted hover:text-paper border border-white/5'}`}>
                      {d === '1' ? t('options.expiry1') : d === '7' ? t('options.expiry7') : d === '30' ? t('options.expiry30') : t('options.expiryDays', { count: d })}
                    </button>
                  ))}
                </div>
                {(userPlan === 'pro' || userPlan === 'business') && (
                  <div className="flex items-center gap-2">
                    <input type="number" min="1" max="90" placeholder={t('options.expiryCustomPlaceholder')}
                      value={config.expiry}
                      onChange={e => handleExpiryChange(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-surface-2 border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-paper placeholder-gray-400 dark:placeholder-muted font-body focus:outline-none focus:border-accent/50 transition-colors" />
                  </div>
                )}
                {customExpiryWarning && (
                  <p className="text-xs text-red-400 mt-1 font-body">{customExpiryWarning}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-muted mb-2 block font-body">{t('options.maxDownloads')}</label>
                <div className="flex gap-2 flex-wrap">
                  {([
                    { value: 1,    label: '1'  },
                    { value: 5,    label: '5'  },
                    { value: 10,   label: '10' },
                    { value: 25,   label: '25' },
                    { value: null, label: t('options.maxDownloadsPlaceholder') },
                  ] as { value: number | null; label: string }[]).map(({ value, label }) => {
                    const isGated = !['pro', 'business', 'enterprise'].includes(userPlan)
                      && (value === 10 || value === 25 || value === null)
                    const isSelected = config.maxDownloads === value
                    return (
                      <button
                        key={String(value)}
                        onClick={() => {
                          if (isGated) {
                            setShowDownloadUpgrade(true)
                          } else {
                            setShowDownloadUpgrade(false)
                            setConfig(c => ({ ...c, maxDownloads: value }))
                          }
                        }}
                        className={`flex-1 py-2 rounded-lg text-sm font-body transition-all flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-accent text-ink font-500'
                            : 'bg-surface-2 text-muted hover:text-paper border border-white/5'
                        }`}
                      >
                        {label}
                        {isGated && (
                          <span className="inline-flex items-center text-[9px] font-display font-700 bg-amber-400/20 text-amber-400 rounded px-1 ml-0.5">
                            Pro
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {showDownloadUpgrade && (
                  <p className="text-xs text-amber-400 mt-1 font-body">{t('options.maxDownloadsPro')}</p>
                )}
              </div>
              {['pro', 'business', 'enterprise'].includes(userPlan) && (
                <div>
                  <label className="text-xs text-muted mb-2 block font-body">{t('options.password')}</label>
                  <input type="password" placeholder="••••••••" value={config.password}
                    onChange={e => setConfig(c => ({ ...c, password: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-surface-2 border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-paper placeholder-gray-400 dark:placeholder-muted font-body focus:outline-none focus:border-accent/50 transition-colors" />
                  {config.password && <PasswordStrength password={config.password} />}
                </div>
              )}
              <div>
                <label className="text-xs text-muted mb-2 block font-body">{t('options.message')}</label>
                <textarea placeholder={t('options.messagePlaceholder')} value={config.message} rows={2}
                  onChange={e => setConfig(c => ({ ...c, message: e.target.value }))}
                  className="w-full bg-surface-2 border border-white/5 rounded-lg px-3 py-2 text-sm text-paper placeholder-muted font-body focus:outline-none focus:border-accent/50 transition-colors resize-none" />
              </div>
              <div>
                <label className="text-xs text-muted mb-2 block font-body">{t('options.senderEmail')}</label>
                <input type="email" placeholder={t('options.emailPlaceholder')} value={config.senderEmail}
                  onChange={e => setConfig(c => ({ ...c, senderEmail: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-surface-2 border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-paper placeholder-gray-400 dark:placeholder-muted font-body focus:outline-none focus:border-accent/50 transition-colors" />
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 font-body">
          {error}
        </div>
      )}

      {error === 'An unexpected error occurred. Please try again.' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-surface border border-red-500/20 px-6 py-3 rounded-full text-sm text-red-400 shadow-xl z-50 animate-fade-up flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {files.length > 0 && (
        <button onClick={handleUpload} disabled={isUploading} aria-busy={isUploading}
          className={`mt-4 w-full py-4 rounded-xl font-display font-600 text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            isUploading ? 'bg-accent/50 text-ink/50 cursor-not-allowed' : 'bg-accent text-ink hover:bg-accent-dim active:scale-[0.98] shadow-lg shadow-accent/20'
          }`}>
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
              </svg>
              {t('button.uploading')}
            </span>
          ) : t('button.upload')}
        </button>
      )}
    </div>
  )
}