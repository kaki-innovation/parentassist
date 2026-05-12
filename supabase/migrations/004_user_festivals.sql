-- =============================================================
-- 004_user_festivals.sql
-- Which festivals a user has enabled and their reminder preferences.
-- =============================================================

CREATE TABLE user_festivals (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  festival_key         TEXT NOT NULL,         -- matches festivals.key: 'diwali', 'holi', etc.
  enabled              BOOLEAN DEFAULT TRUE,
  reminder_days_before INTEGER DEFAULT 18,    -- how early to start showing festival content
  created_at           TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id, festival_key)
);

CREATE INDEX idx_user_festivals_user ON user_festivals (user_id);

-- ── Row-Level Security ────────────────────────────────────────
ALTER TABLE user_festivals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "festivals_select_own" ON user_festivals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "festivals_insert_own" ON user_festivals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "festivals_update_own" ON user_festivals
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "festivals_delete_own" ON user_festivals
  FOR DELETE USING (auth.uid() = user_id);
