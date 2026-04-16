export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-800 text-paper mb-2">Termini di Servizio</h1>
        <p className="text-muted font-body text-sm mb-12">Ultimo aggiornamento: Aprile 2026</p>

        <div className="space-y-10 font-body text-muted leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">1. Accettazione dei termini</h2>
            <p>Utilizzando VaultTransfer accetti questi Termini di Servizio. Se non accetti, non utilizzare il servizio. Ci riserviamo il diritto di modificare questi termini con notifica agli utenti registrati con almeno 15 giorni di preavviso.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">2. Età minima</h2>
            <p>Il servizio è riservato a persone di età pari o superiore a <span className="text-paper">16 anni</span>, in conformità al GDPR (art. 8). Utilizzando VaultTransfer dichiari di avere almeno 16 anni. Non raccogliamo consapevolmente dati di minori di 16 anni.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">3. Descrizione del servizio</h2>
            <p>VaultTransfer è un servizio di trasferimento file che permette di caricare file e condividerli tramite link sicuri con scadenza automatica. Il servizio è disponibile in versione gratuita (Free) e a pagamento (Pro, Business).</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">4. Uso accettabile</h2>
            <p className="mb-3">È vietato utilizzare VaultTransfer per:</p>
            <ul className="space-y-2 ml-4">
              <li>• Caricare contenuti illegali, offensivi o che violino diritti di terzi</li>
              <li>• Distribuire malware, virus o software dannosi</li>
              <li>• Violare diritti d'autore o proprietà intellettuale</li>
              <li>• Attività di spam, phishing o truffe</li>
              <li>• Contenuti che sfruttano o danneggiano minori (CSAM)</li>
              <li>• Qualsiasi attività che violi le leggi vigenti in Italia e nell'UE</li>
            </ul>
            <p className="mt-3">Ci riserviamo il diritto di rimuovere contenuti e sospendere account che violino queste regole, senza preavviso e senza rimborso.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">5. Piani e pagamenti</h2>
            <p className="mb-3">Il piano Free è gratuito con le limitazioni descritte nella pagina <a href="/prezzi" className="text-accent hover:underline">Prezzi</a>. I piani Pro e Business sono in abbonamento mensile con rinnovo automatico.</p>
            <p>I pagamenti sono gestiti da Stripe. Non conserviamo i dati della tua carta di credito.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">6. Diritto di recesso (14 giorni)</h2>
            <p className="mb-3">In conformità alla Direttiva UE 2011/83/UE e al Codice del Consumo italiano, hai diritto di recedere dal contratto di abbonamento entro <span className="text-paper">14 giorni</span> dalla sottoscrizione, senza necessità di fornire motivazioni.</p>
            <p className="mb-3">Per esercitare il diritto di recesso scrivi a <a href="mailto:support@vaultransfer.com" className="text-accent hover:underline">support@vaultransfer.com</a> entro 14 giorni dall'acquisto. Rimborseremo l'importo pagato entro 14 giorni dalla ricezione della richiesta.</p>
            <p>Il diritto di recesso non si applica se hai già usufruito del servizio premium (es. caricato file oltre i limiti Free) e hai espressamente acconsentito all'esecuzione immediata del contratto.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">7. Cancellazione abbonamento</h2>
            <p>Puoi cancellare il tuo abbonamento in qualsiasi momento dal portale di gestione nella Dashboard. L'accesso al piano pagato rimane attivo fino alla fine del periodo fatturato. Non effettuiamo rimborsi parziali per periodi non utilizzati, salvo esercizio del diritto di recesso entro 14 giorni.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">8. Eliminazione dei file</h2>
            <p>I file vengono eliminati automaticamente alla scadenza del link impostata dall'utente (1, 7 o 30 giorni), sia dal database che dallo storage. Non effettuiamo backup dei file caricati. Non siamo responsabili per la perdita di file scaduti.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">9. Limitazione di responsabilità</h2>
            <p>VaultTransfer è fornito "così com'è". Non garantiamo la disponibilità continua del servizio. Non siamo responsabili per danni diretti o indiretti derivanti dall'uso o dall'impossibilità di usare il servizio, inclusa la perdita di dati, nei limiti consentiti dalla legge italiana.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">10. Proprietà intellettuale</h2>
            <p>Il codice, il design e i contenuti di VaultTransfer sono di proprietà del gestore del servizio. I file caricati dagli utenti rimangono di loro proprietà. Caricare un file non ci trasferisce alcun diritto su di esso.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">11. Segnalazione contenuti illegali (DSA)</h2>
            <p>In conformità al Digital Services Act (Regolamento UE 2022/2065), puoi segnalare contenuti illegali o violazioni scrivendo a <a href="mailto:abuse@vaultransfer.com" className="text-accent hover:underline">abuse@vaultransfer.com</a>. Esamineremo ogni segnalazione entro 72 ore lavorative e adotteremo le misure necessarie.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">12. Sospensione e chiusura</h2>
            <p>Ci riserviamo il diritto di sospendere o chiudere account che violino questi termini, senza preavviso. In caso di chiusura del servizio, forniremo almeno 30 giorni di preavviso agli utenti registrati e rimborseremo gli abbonamenti attivi pro-rata.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">13. Legge applicabile e foro competente</h2>
            <p>Questi termini sono regolati dalla legge italiana. Per controversie con consumatori è competente il foro del luogo di residenza o domicilio del consumatore, in conformità al Codice del Consumo (D.Lgs. 206/2005). Per la risoluzione alternativa delle controversie puoi rivolgerti alla piattaforma ODR della Commissione Europea: <a href="https://ec.europa.eu/consumers/odr" className="text-accent hover:underline" target="_blank">ec.europa.eu/consumers/odr</a>.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-700 text-paper mb-3">14. Contatti</h2>
            <div className="space-y-1">
              <p>Supporto generale: <a href="mailto:support@vaultransfer.com" className="text-accent hover:underline">support@vaultransfer.com</a></p>
              <p>Privacy e GDPR: <a href="mailto:privacy@vaultransfer.com" className="text-accent hover:underline">privacy@vaultransfer.com</a></p>
              <p>Questioni legali: <a href="mailto:legal@vaultransfer.com" className="text-accent hover:underline">legal@vaultransfer.com</a></p>
              <p>Segnalazioni abusi: <a href="mailto:abuse@vaultransfer.com" className="text-accent hover:underline">abuse@vaultransfer.com</a></p>
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}