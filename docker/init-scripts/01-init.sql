-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create separate database for Lago billing
CREATE DATABASE lago;

-- ── Row Level Security helper function ───────────────────
CREATE OR REPLACE FUNCTION current_company_id()
RETURNS uuid AS $$
BEGIN
  RETURN current_setting('app.current_company_id', true)::uuid;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Auto-update trigger for updated_at ───────────────────
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
