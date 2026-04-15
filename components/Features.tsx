export default function Features() {
  const features = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      title: 'Cifrato in transito',
      desc: 'Tutti i trasferimenti viaggiano su HTTPS con TLS 1.3. I tuoi file non vengono mai letti.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      title: 'Scadenza automatica',
      desc: 'Scegli 24 ore, 7 o 30 giorni. Alla scadenza i file vengono eliminati definitivamente.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: 'Protezione password',
      desc: 'Aggiungi una password: l\'hash viene conservato con bcrypt. La password non viene mai salvata in chiaro.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      title: 'Limite di download',
      desc: 'Imposta il numero massimo di download. Superato il limite, il link si disattiva automaticamente.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      title: 'Zero account',
      desc: 'Nessuna registrazione. Nessuna email obbligatoria. Upload anonimo e immediato.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
      title: 'GDPR Compliant',
      desc: 'Nessun tracciamento. Nessuna profilazione. I dati restano in Europa.',
    },
  ]

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-xs text-muted uppercase tracking-widest font-body mb-3">Sicurezza by design</p>
        <h2 className="font-display text-3xl md:text-4xl font-700 text-paper">
          Costruito per chi non vuole compromessi
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-surface border border-white/5 rounded-2xl p-6 hover:border-accent/20 transition-all duration-300 hover:bg-surface-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-2 group-hover:bg-accent/10 flex items-center justify-center mb-4 transition-colors">
              {f.icon}
            </div>
            <h3 className="font-display font-600 text-paper mb-2">{f.title}</h3>
            <p className="text-sm text-muted font-body leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
