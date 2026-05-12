-- =============================================================
-- 001_users.sql
-- Core users table. id matches auth.uid() from Supabase Auth.
-- Never hard delete — use deleted_at for soft delete.
-- =============================================================

CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT UNIQUE NOT NULL,
  name              TEXT NOT NULL,
  avatar_url        TEXT,
  location_city     TEXT DEFAULT 'Melbourne',
  location_country  TEXT DEFAULT 'Australia',
  location_postcode TEXT,
  onboarding_done   BOOLEAN DEFAULT FALSE,
  onboarding_step   INTEGER DEFAULT 0,  -- 0–4, tracks where user left off
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  last_active_at    TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ           -- soft delete only, never hard delete
);

-- Partial index: fast lookup of active (non-deleted) users
CREATE INDEX idx_users_active ON users (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email  ON users (email) WHERE deleted_at IS NULL;

-- ── Row-Level Security ────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read/update their own row only
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT is handled by the auth sync trigger (015_triggers.sql)
-- which runs as SECURITY DEFINER and bypasses RLS.
-- Direct client inserts are intentionally blocked.
