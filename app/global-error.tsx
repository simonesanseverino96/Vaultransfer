'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global unhandled app error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0f] text-[#f2f2f2]">
          <div className="flex flex-col items-center justify-center p-8 bg-[#12121a] border border-red-500/20 rounded-2xl max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">A critical error occurred!</h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              Please try refreshing the page.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-[#00e5a0] text-[#0a0a0f] rounded-xl text-sm font-bold hover:bg-[#00cc8e] transition-colors w-full"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
