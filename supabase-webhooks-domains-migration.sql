-- Migration: webhook_endpoints and custom_domains tables
-- Run this in the Supabase SQL editor

-- Add 'enterprise' to the plan_type enum (if not already present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'enterprise'
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'plan_type')
  ) THEN
    ALTER TYPE plan_type ADD VALUE 'enterprise';
  END IF;
END
$$;

-- Webhook endpoints table
CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  secret      TEXT NOT NULL,
  events      TEXT[] NOT NULL DEFAULT ARRAY['transfer.created','transfer.downloaded','transfer.expired'],
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_user_id ON webhook_endpoints(user_id);

ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own webhook endpoints"
  ON webhook_endpoints FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access to webhook_endpoints"
  ON webhook_endpoints FOR ALL
  USING (auth.role() = 'service_role');

-- Custom domains table
CREATE TABLE IF NOT EXISTS custom_domains (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain              TEXT NOT NULL UNIQUE,
  verification_token  TEXT NOT NULL,
  verified            BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_domains_user_id ON custom_domains(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_domains_domain  ON custom_domains(domain);

ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own custom domains"
  ON custom_domains FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access to custom_domains"
  ON custom_domains FOR ALL
  USING (auth.role() = 'service_role');
