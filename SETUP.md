# 🚀 FileDrop — Guida al Setup Completo

## Prerequisiti
- Node.js 18+ installato
- Account gratuito su [supabase.com](https://supabase.com)
- Account gratuito su [vercel.com](https://vercel.com)

---

## 1. Configura Supabase

### 1a. Crea il progetto
1. Vai su [supabase.com](https://supabase.com) → **New Project**
2. Scegli un nome (es. `filedrop`) e una password sicura per il DB
3. Scegli la regione **EU West (Ireland)** per GDPR
4. Attendi ~2 minuti che il progetto si avvii

### 1b. Copia le chiavi API
1. Nel pannello Supabase → **Settings → API**
2. Copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 1c. Crea il database
1. Vai su **SQL Editor** nel pannello Supabase
2. Incolla il contenuto di `supabase-schema.sql`
3. Clicca **Run** — dovresti vedere "Success"

### 1d. Verifica il bucket Storage
1. Vai su **Storage** nel pannello Supabase
2. Dovresti vedere il bucket `filedrop` già creato dallo schema
3. Se non c'è, clicca **New Bucket** → nome: `filedrop` → **Public**: NO

---

## 2. Configura il progetto locale

```bash
# Clona / entra nella cartella
cd filedrop

# Installa le dipendenze
npm install

# Copia il file di configurazione
cp .env.local.example .env.local
```

Apri `.env.local` e incolla le chiavi copiare al punto 1b:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 3. Avvia in locale

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) — l'app è pronta!

Testa:
1. Trascina un file
2. Clicca **Carica e genera link**
3. Copia il link e aprilo in un'altra scheda

---

## 4. Deploy su Vercel (produzione)

### 4a. Crea un repository GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TUO-USERNAME/filedrop.git
git push -u origin main
```

### 4b. Deploy su Vercel
1. Vai su [vercel.com](https://vercel.com) → **New Project**
2. Importa il tuo repository GitHub
3. Nella sezione **Environment Variables**, aggiungi:
   ```
   NEXT_PUBLIC_SUPABASE_URL     = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY    = eyJhbGc...
   NEXT_PUBLIC_APP_URL          = https://TUO-DOMINIO.vercel.app
   ```
4. Clicca **Deploy** — in ~2 minuti è online!

### 4c. (Opzionale) Dominio personalizzato
In Vercel → **Domains** → aggiungi il tuo dominio

---

## 5. Pulizia automatica file scaduti

### Opzione A: pg_cron (Supabase Pro)
Nel SQL Editor di Supabase, decommenta e lancia il job cron nel file `supabase-schema.sql`.

### Opzione B: Vercel Cron (Free)
Aggiungi in `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cleanup",
    "schedule": "0 * * * *"
  }]
}
```
Poi crea il file `app/api/cleanup/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const supabase = supabaseAdmin()
  
  // Recupera i path dei file scaduti prima di cancellarli
  const { data: expired } = await supabase
    .from('transfers')
    .select('id, transfer_files(storage_path)')
    .lt('expires_at', new Date().toISOString())

  if (expired && expired.length > 0) {
    // Elimina i file dallo storage
    for (const transfer of expired) {
      const paths = (transfer.transfer_files as any[]).map(f => f.storage_path)
      if (paths.length > 0) {
        await supabase.storage.from('filedrop').remove(paths)
      }
    }
    // Elimina i record (CASCADE elimina transfer_files)
    await supabase
      .from('transfers')
      .delete()
      .lt('expires_at', new Date().toISOString())
  }

  return NextResponse.json({ cleaned: expired?.length ?? 0 })
}
```

---

## 6. Checklist sicurezza ✅

- [x] HTTPS obbligatorio (Vercel gestisce TLS 1.3 automaticamente)
- [x] Password hashata con bcrypt (12 rounds)
- [x] Link con UUID v4 (non indovinabili)
- [x] Download URL firmati (scadono in 60 secondi)
- [x] Bucket Storage privato (nessun accesso diretto)
- [x] RLS attivo su tutte le tabelle
- [x] Scadenza automatica configurabile
- [x] Limite download configurabile
- [x] File eliminati alla scadenza
- [x] Nessun cookie di tracking
- [x] Server EU (GDPR compliant)

---

## 7. Struttura del progetto

```
filedrop/
├── app/
│   ├── layout.tsx              # Layout root
│   ├── page.tsx                # Home page
│   ├── globals.css             # Stili globali
│   ├── api/
│   │   ├── upload/route.ts     # POST /api/upload
│   │   ├── transfer/[token]/route.ts  # GET metadata
│   │   └── download/[token]/route.ts # POST download
│   └── download/[token]/
│       └── page.tsx            # Pagina download
├── components/
│   ├── UploadSection.tsx       # Drag & drop + config
│   ├── UploadSuccess.tsx       # Pagina successo upload
│   ├── DownloadClient.tsx      # UI download + password
│   ├── Features.tsx            # Sezione features
│   └── Footer.tsx
├── lib/
│   ├── supabase.ts             # Client Supabase
│   └── utils.ts                # Helpers
├── types/index.ts              # TypeScript types
├── supabase-schema.sql         # Schema DB
└── SETUP.md                    # Questa guida
```

---

## 8. Costi stimati (piano gratuito Supabase + Vercel)

| Utilizzo          | Costo  |
|-------------------|--------|
| Fino a 500MB storage | Gratis |
| Fino a 2GB bandwidth | Gratis |
| Fino a 50k richieste/mese | Gratis |
| Dominio personalizzato | ~10€/anno |

Per scalare: Supabase Pro (~25$/mese) include 8GB storage e 50GB bandwidth.
