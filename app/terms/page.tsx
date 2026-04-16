export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-800 text-paper mb-2">Termini di Servizio</h1>
        <p className="text-muted font-body text-sm mb-12">Ultimo aggiornamento: Aprile 2026</p>

        <div className="space-y-10 font-body text-muted leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">1. Accettazione dei termini</h2>
            <p>Utilizzando VaultTransfer accetti questi Termini di Servizio. Se non accetti, non utilizzare il servizio. Ci riserviamo il diritto di modificare questi termini in qualsiasi momento con notifica agli utenti registrati.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">2. Descrizione del servizio</h2>
            <p>VaultTransfer è un servizio di trasferimento file che permette di caricare file e condividerli tramite link sicuri con scadenza automatica. Il servizio è disponibile in versione gratuita (Free) e a pagamento (Pro, Business).</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">3. Uso accettabile</h2>
            <p className="mb-3">È vietato utilizzare VaultTransfer per:</p>
            <ul className="space-y-2 ml-4">
              <li>• Caricare contenuti illegali, offensivi o che violino diritti di terzi</li>
              <li>• Distribuire malware, virus o software dannosi</li>
              <li>• Violare diritti d'autore o proprietà intellettuale</li>
              <li>• Attività di spam o phishing</li>
              <li>• Qualsiasi attività che violi le leggi vigenti</li>
            </ul>
            <p className="mt-3">Ci riserviamo il diritto di rimuovere contenuti e sospendere account che violino queste regole.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">4. Piani e pagamenti</h2>
            <p className="mb-3">Il piano Free è gratuito con le limitazioni descritte nella pagina <a href="/prezzi" className="text-accent hover:underline">Prezzi</a>. I piani Pro e Business sono in abbonamento mensile con rinnovo automatico. Puoi cancellare in qualsiasi momento dal portale di gestione — l'accesso rimane attivo fino alla fine del periodo pagato. I pagamenti sono gestiti da Stripe e non sono rimborsabili salvo diversa disposizione di legge.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">5. Eliminazione dei file</h2>
            <p>I file vengono eliminati automaticamente alla scadenza del link impostata dall'utente (1, 7 o 30 giorni). Non siamo responsabili per la perdita di file scaduti. Non effettuiamo backup dei file caricati.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">6. Limitazione di responsabilità</h2>
            <p>VaultTransfer è fornito "così com'è". Non garantiamo la disponibilità continua del servizio. Non siamo responsabili per danni diretti o indiretti derivanti dall'uso o dall'impossibilità di usare il servizio, inclusa la perdita di dati.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">7. Proprietà intellettuale</h2>
            <p>Il codice, il design e i contenuti di VaultTransfer sono di proprietà del gestore del servizio. I file caricati dagli utenti rimangono di loro proprietà. Caricare un file non ci trasferisce alcun diritto su di esso.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">8. Sospensione e chiusura</h2>
            <p>Ci riserviamo il diritto di sospendere o chiudere account che violino questi termini, senza preavviso. In caso di chiusura del servizio, forniremo almeno 30 giorni di preavviso agli utenti registrati.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">9. Legge applicabile</h2>
            <p>Questi termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il foro di residenza dell'utente consumatore.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">10. Contatti</h2>
            <p>Per qualsiasi domanda sui Termini di Servizio scrivi a <a href="mailto:legal@vaultransfer.com" className="text-accent hover:underline">legal@vaultransfer.com</a>.</p>
          </section>

        </div>
      </div>
    </main>
  )
}