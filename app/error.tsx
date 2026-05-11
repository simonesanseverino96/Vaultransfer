'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled app error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="flex flex-col items-center justify-center p-8 bg-surface border border-red-500/20 rounded-2xl max-w-md w-full animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="font-display text-2xl font-700 text-paper mb-2">Something went wrong!</h2>
        <p className="text-muted text-sm font-body text-center mb-6">
          An unexpected error occurred. Our team has been notified.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-accent text-ink rounded-xl text-sm font-display font-600 hover:bg-accent-dim transition-colors w-full"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
