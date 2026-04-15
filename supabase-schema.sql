-- ============================================
-- FileDrop — Schema SQL per Supabase (v2)
-- ============================================

-- Tabella trasferimenti
CREATE TABLE IF NOT EXISTS transfers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token         UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL,
  password_hash TEXT,
  max_downloads INT,
  download_count INT NOT NULL DEFAULT 0,
  message       TEXT,
  sender_email  TEXT,
  total_size    BIGINT NOT NULL DEFAULT 0
);

-- Tabella file del trasferimento
CREATE TABLE IF NOT EXISTS transfer_files (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id  UUID NOT NULL REFERENCES transfers(id) ON DELETE CASCADE,
  filename     TEXT NOT NULL,
  size         BIGINT NOT NULL,
  mime_type    TEXT NOT NULL DEFAULT 'application/octet-stream',
  storage_path TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_transfers_token ON transfers(token);
CREATE INDEX IF NOT EXISTS idx_transfers_expires_at ON transfers(expires_at);
CREATE INDEX IF NOT EXISTS idx_transfer_files_transfer_id ON transfer_files(transfer_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_files ENABLE ROW LEVEL SECURITY;

-- Elimina le policy se esistono già, poi le ricrea
DROP POLICY IF EXISTS "Service role full access on transfers" ON transfers;
DROP POLICY IF EXISTS "Service role full access on transfer_files" ON transfer_files;

CREATE POLICY "Service role full access on transfers"
  ON transfers FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on transfer_files"
  ON transfer_files FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- Storage bucket
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('filedrop', 'filedrop', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Service role manages filedrop storage" ON storage.objects;

CREATE POLICY "Service role manages filedrop storage"
  ON storage.objects FOR ALL
  USING (bucket_id = 'filedrop' AND auth.role() = 'service_role');