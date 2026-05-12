-- =============================================================
-- 003_user_kids.sql
-- Children profiles. Age is always computed from birth_year,
-- never stored directly. Max 4 children per user (Family plan).
-- =============================================================

CREATE TABLE user_kids (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name         TEXT NOT NULL,
  birth_year   INTEGER NOT NULL
               CHECK (birth_year BETWEEN 2010 AND EXTRACT(YEAR FROM NOW())::INTEGER),
  birth_month  INTEGER
               CHECK (birth_month BETWEEN 1 AND 12),
  gender       TEXT CHECK (gender IN ('girl','boy','prefer_not_to_say','other')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Age computed on read — never stored:
-- DATE_PART('year', AGE(NOW(), MAKE_DATE(birth_year, COALESCE(birth_month,1), 1)))

CREATE INDEX idx_kids_user ON user_kids (user_id);

-- ── Row-Level Security ────────────────────────────────────────
ALTER TABLE user_kids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kids_select_own" ON user_kids
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "kids_insert_own" ON user_kids
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "kids_update_own" ON user_kids
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "kids_delete_own" ON user_kids
  FOR DELETE USING (auth.uid() = user_id);
