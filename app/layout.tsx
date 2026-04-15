import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FileDrop — Trasferisci file in sicurezza',
  description: 'Invia file fino a 2GB gratis. Link cifrati, con scadenza e protezione password. Nessun account richiesto.',
  keywords: 'trasferimento file, file sharing, sicuro, cifrato, gratis',
  openGraph: {
    title: 'FileDrop — Trasferisci file in sicurezza',
    description: 'Invia file fino a 2GB gratis. Link cifrati, scadenza automatica, protezione password.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
