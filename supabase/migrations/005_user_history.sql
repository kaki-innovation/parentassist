-- =============================================================
-- 005_user_history.sql
-- Every user interaction is logged here — this powers personalisation.
-- Never delete rows. High-volume table: indexed carefully.
-- =============================================================

CREATE TABLE user_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- What was interacted with
  content_type  TEXT NOT NULL
                CHECK (content_type IN ('recipe','activity','festival_plan','day_flow','meal_suggestion')),
  content_id    TEXT NOT NULL,    -- recipe slug, activity id, or 'ai_generated'
  content_name  TEXT NOT NULL,    -- denormalised for quick display, avoids joins

  -- How they interacted
  action        TEXT NOT NULL
                CHECK (action IN ('viewed','liked','disliked','saved','cooked',
                                  'refreshed_away','added_to_plan','shared')),

  -- Context at time of interaction
  filters_used  JSONB,            -- {mealType, mood, timeFilter, diet}
  metadata      JSONB,            -- per-recipe: {spiceOverride: 'mild'|'medium'|'hot'|'extra_hot'}
  session_id    TEXT,             -- groups interactions within one app session
  refresh_count INTEGER DEFAULT 0, -- how many refreshes before this item was chosen

  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes (performance-critical — high row count) ───────────
-- Personalisation: "what has this user liked of this content type?"
CREATE INDEX idx_history_user_action ON user_history (user_id, action, content_type);

-- Recency: "what has this user seen in the last 7 days?"
CREATE INDEX idx_history_user_recent ON user_history (user_id, created_at DESC);

-- Session grouping
CREATE INDEX idx_history_session ON user_history (user_id, session_id)
  WHERE session_id IS NOT NULL;

-- ── Row-Level Security ────────────────────────────────────────
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "history_select_own" ON user_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "history_insert_own" ON user_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- History rows are never updated or deleted by users
