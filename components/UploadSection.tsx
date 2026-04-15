'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatBytes } from '@/lib/utils'
import { UploadConfig } from '@/types'
import UploadSuccess from './UploadSuccess'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

const MAX_SIZE = 2 * 1024 * 1024 * 1024 // 2GB
const MAX_FILES = 20

interface FileWithProgress {
  file: File
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
}

export default function UploadSection() {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [config, setConfig] = useState<UploadConfig>({
    expiry: '7',
    maxDownloads: null,
    password: '',
    message: '',
    senderEmail: '',
  })
  const [showOptions, setShowOptions] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [transferToken, setTransferToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    if (rejected.length > 0) {
      setError(`Alcuni file superano il limite di ${formatBytes(MAX_SIZE)}.`)
    }
    const newFiles = accepted.map(f => ({
      file: f,
      id: Math.random().toString(36).slice(2),
      progress: 0,
      status: 'pending' as const,
    }))
    setFiles(prev => {
      const combined = [...prev, ...newFiles]
      if (combined.length > MAX_FILES) {
        setError(`Puoi caricare al massimo ${MAX_FILES} file per trasferimento.`)
        return prev
      }
      return combined
    })
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_SIZE,
  })

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id))
  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0)

  const updateProgress = (id: string, progress: number, status?: FileWithProgress['status']) => {
    setFiles(prev => prev.map(f =>
      f.id === id ? { ...f, progress, status: status ?? (progress === 100 ? 'done' : 'uploading') } : f
    ))
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setIsUploading(true)
    setError(null)

    try {
      const transferId = uuidv4()
      const uploadedFiles = []

      // Upload ogni file direttamente su Supabase Storage (bypassa Vercel)
      for (const { file, id } of files) {
        updateProgress(id, 10, 'uploading')
        const fileId = uuidv4()
        const storagePath = `transfers/${transferId}/${fileId}_${file.name}`

        const { error: storageError } = await supabase.storage
          .from('filedrop')
          .upload(storagePath, file, {
            contentType: file.type || 'application/octet-stream',
            upsert: false,
          })

        if (storageError) {
          throw new Error(`Errore upload ${file.name}: ${storageError.message}`)
        }

        updateProgress(id, 100, 'done')
        uploadedFiles.push({
          id: fileId,
          filename: file.name,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
          storagePath,
        })
      }

      // Invia solo i metadati all'API (piccola richiesta JSON)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferId,
          files: uploadedFiles,
          config,
          totalSize,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nella creazione del trasferimento')
      }

      const data = await res.json()
      setTransferToken(data.token)
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'upload')
      setFiles(prev => prev.map(f => ({ ...f, status: 'error' })))
    } finally {
      setIsUploading(false)
    }
  }

  if (transferToken) {
    return <UploadSuccess token={transferToken} config={config} files={files.map(f => f.file)} />
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all duration-300
          ${isDragActive
            ? 'border-accent bg-accent/5 drop-active'
            : 'border-white/10 bg-surface hover:border-accent/40 hover:bg-surface-2'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragActive ? 'bg-accent' : 'bg-surface-2'}`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDragActive ? '#0a0a0f' : '#00e5a0'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
              <path d="M12 12v9"/>
              <path d="m16 16-4-4-4 4"/>
            </svg>
          </div>
          <div>
            <p className="font-display text-lg font-600 text-paper mb-1">
              {isDragActive ? 'Rilascia i file qui' : 'Trascina i file qui'}
            </p>
            <p className="text-muted text-sm font-body">
              oppure <span className="text-accent underline underline-offset-2">sfoglia</span> dal tuo dispositivo · max 2GB · 20 file
            </p>
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map(({ file, id, progress, status }) => (
            <div key={id} className="stagger-item flex items-center gap-3 bg-surface border border-white/5 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-paper truncate font-body">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted">{formatBytes(file.size)}</p>
                  {isUploading && status === 'uploading' && (
                    <div className="flex-1 h-1 bg-surface-2 rounded-full overflow-hidden">
                      <div
                        className="h-full progress-shimmer rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                  {status === 'done' && <span className="text-xs text-accent">✓ Caricato</span>}
                  {status === 'error' && <span className="text-xs text-red-400">✗ Errore</span>}
                </div>
              </div>
              {!isUploading && (
                <button onClick={() => removeFile(id)} className="text-muted hover:text-paper transition-colors p-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center px-1 pt-1 text-xs text-muted font-body">
            <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
            <span>{formatBytes(totalSize)} totali</span>
          </div>
        </div>
      )}

      {/* Options toggle */}
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
            Opzioni di sicurezza
          </button>

          {showOptions && (
            <div className="mt-3 bg-surface border border-white/5 rounded-xl p-5 space-y-4 animate-fade-up">
              <div>
                <label className="text-xs text-muted mb-2 block font-body">Scadenza link</label>
                <div className="flex gap-2">
                  {(['1', '7', '30'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setConfig(c => ({ ...c, expiry: d }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-body transition-all ${
                        config.expiry === d
                          ? 'bg-accent text-ink font-500'
                          : 'bg-surface-2 text-muted hover:text-paper border border-white/5'
                      }`}
                    >
                      {d === '1' ? '24 ore' : d === '7' ? '7 giorni' : '30 giorni'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted mb-2 block font-body">Max download (opzionale)</label>
                <input
                  type="number" min="1" max="100" placeholder="Illimitati"
                  value={config.maxDownloads ?? ''}
                  onChange={e => setConfig(c => ({ ...c, maxDownloads: e.target.value ? parseInt(e.target.value) : null }))}
                  className="w-full bg-surface-2 border border-white/5 rounded-lg px-3 py-2 text-sm text-paper placeholder-muted font-body focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-muted mb-2 block font-body">Password protezione (opzionale)</label>
                <input
                  type="password" placeholder="••••••••"
                  value={config.password}
                  onChange={e => setConfig(c => ({ ...c, password: e.target.value }))}
                  className="w-full bg-surface-2 border border-white/5 rounded-lg px-3 py-2 text-sm text-paper placeholder-muted font-body focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-muted mb-2 block font-body">Messaggio per il destinatario</label>
                <textarea
                  placeholder="Aggiungi un messaggio..." value={config.message} rows={2}
                  onChange={e => setConfig(c => ({ ...c, message: e.target.value }))}
                  className="w-full bg-surface-2 border border-white/5 rounded-lg px-3 py-2 text-sm text-paper placeholder-muted font-body focus:outline-none focus:border-accent/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted mb-2 block font-body">La tua email (opzionale)</label>
                <input
                  type="email" placeholder="tu@esempio.com"
                  value={config.senderEmail}
                  onChange={e => setConfig(c => ({ ...c, senderEmail: e.target.value }))}
                  className="w-full bg-surface-2 border border-white/5 rounded-lg px-3 py-2 text-sm text-paper placeholder-muted font-body focus:outline-none focus:border-accent/50 transition-colors"
                />
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

      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`
            mt-4 w-full py-4 rounded-xl font-display font-600 text-base transition-all duration-200
            ${isUploading
              ? 'bg-accent/50 text-ink/50 cursor-not-allowed'
              : 'bg-accent text-ink hover:bg-accent-dim active:scale-[0.98] shadow-lg shadow-accent/20'
            }
          `}
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
              </svg>
              Caricamento in corso...
            </span>
          ) : `Carica e genera link →`}
        </button>
      )}
    </div>
  )
}