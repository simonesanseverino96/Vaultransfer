export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-800 text-paper mb-2">Privacy Policy</h1>
        <p className="text-muted font-body text-sm mb-12">Ultimo aggiornamento: Aprile 2026</p>

        <div className="space-y-10 font-body text-muted leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">1. Chi siamo</h2>
            <p>VaultTransfer è un servizio di trasferimento file sicuro accessibile su <a href="https://vaultransfer.com" className="text-accent hover:underline">vaultransfer.com</a>. Il titolare del trattamento dei dati è il gestore del servizio, contattabile a <a href="mailto:privacy@vaultransfer.com" className="text-accent hover:underline">privacy@vaultransfer.com</a>.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">2. Dati che raccogliamo</h2>
            <p className="mb-3">Raccogliamo solo i dati strettamente necessari al funzionamento del servizio:</p>
            <ul className="space-y-2 ml-4">
              <li>• <span className="text-paper">Indirizzo email</span> — solo se scegli di registrarti o accedere</li>
              <li>• <span className="text-paper">File caricati</span> — temporaneamente, fino alla scadenza del link</li>
              <li>• <span className="text-paper">Metadati dei trasferimenti</span> — nome file, dimensione, data di scadenza</li>
              <li>• <span className="text-paper">Dati di pagamento</span> — gestiti da Stripe, non li conserviamo noi</li>
              <li>• <span className="text-paper">Cookie tecnici</span> — necessari per il funzionamento del sito (sessione utente)</li>
              <li>• <span className="text-paper">Cookie pubblicitari</span> — Google AdSense, solo con il tuo consenso esplicito</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">3. Come usiamo i tuoi dati</h2>
            <ul className="space-y-2 ml-4">
              <li>• Per permetterti di caricare e condividere file</li>
              <li>• Per gestire il tuo account e abbonamento</li>
              <li>• Per inviarti il link magico di accesso</li>
              <li>• Per eliminare automaticamente i file alla scadenza</li>
              <li>• Per mostrare pubblicità contestuale (solo utenti Free, solo con consenso)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">4. Cookie e tracciamento</h2>
            <p className="mb-3">Utilizziamo i seguenti tipi di cookie:</p>
            <ul className="space-y-2 ml-4">
              <li>• <span className="text-paper">Cookie tecnici</span> — strettamente necessari per il login e la sessione. Non richiedono consenso.</li>
              <li>• <span className="text-paper">Cookie pubblicitari (Google AdSense)</span> — utilizzati per mostrare annunci pertinenti agli utenti Free. Richiedono il tuo consenso esplicito tramite il banner cookie.</li>
            </ul>
            <p className="mt-3">Puoi modificare le tue preferenze cookie in qualsiasi momento cancellando i dati del browser o contattandoci.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">5. Conservazione dei dati</h2>
            <p>I file vengono eliminati automaticamente alla scadenza del link (1, 7 o 30 giorni) sia dal database che dallo storage. I dati dell'account vengono conservati finché l'account è attivo. Puoi richiedere la cancellazione del tuo account in qualsiasi momento scrivendo a <a href="mailto:privacy@vaultransfer.com" className="text-accent hover:underline">privacy@vaultransfer.com</a>.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">6. Condivisione con terze parti</h2>
            <p className="mb-3">Non vendiamo i tuoi dati. Utilizziamo i seguenti servizi di terze parti:</p>
            <ul className="space-y-2 ml-4">
              <li>• <span className="text-paper">Supabase</span> — database e storage (server in Europa)</li>
              <li>• <span className="text-paper">Vercel</span> — hosting dell'applicazione (server USA con CDN globale)</li>
              <li>• <span className="text-paper">Stripe</span> — gestione pagamenti (server USA/EU)</li>
              <li>• <span className="text-paper">Google AdSense</span> — pubblicità contestuale (solo utenti Free con consenso)</li>
              <li>• <span className="text-paper">Cloudflare</span> — DNS e protezione (server globali)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">7. I tuoi diritti (GDPR)</h2>
            <p className="mb-3">Se sei residente nell'Unione Europea, hai diritto a:</p>
            <ul className="space-y-2 ml-4">
              <li>• Accedere ai tuoi dati personali</li>
              <li>• Rettificare dati inesatti</li>
              <li>• Richiedere la cancellazione dei dati ("diritto all'oblio")</li>
              <li>• Opporti al trattamento per fini pubblicitari</li>
              <li>• Portabilità dei dati</li>
              <li>• Revocare il consenso in qualsiasi momento</li>
            </ul>
            <p className="mt-3">Per esercitare questi diritti scrivi a <a href="mailto:privacy@vaultransfer.com" className="text-accent hover:underline">privacy@vaultransfer.com</a>. Risponderemo entro 30 giorni.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">8. Sicurezza</h2>
            <p>Tutti i trasferimenti avvengono su connessione HTTPS cifrata con TLS 1.3. I file sono archiviati in bucket privati accessibili solo tramite link firmati temporanei. Le password di protezione sono hashate con bcrypt a 12 round. Non è possibile accedere ai file senza il link univoco.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">9. Trasferimenti internazionali</h2>
            <p>Alcuni dei nostri fornitori (Vercel, Stripe) operano negli Stati Uniti. I trasferimenti di dati verso gli USA avvengono nel rispetto delle garanzie previste dal GDPR (Standard Contractual Clauses). I dati del database e dello storage sono ospitati in Europa tramite Supabase.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">10. Contatti e reclami</h2>
            <p>Per qualsiasi domanda sulla privacy scrivi a <a href="mailto:privacy@vaultransfer.com" className="text-accent hover:underline">privacy@vaultransfer.com</a>. Hai anche il diritto di presentare reclamo al Garante per la Protezione dei Dati Personali (<a href="https://www.garanteprivacy.it" className="text-accent hover:underline" target="_blank">garanteprivacy.it</a>).</p>
          </section>

        </div>
      </div>
    </main>
  )
}