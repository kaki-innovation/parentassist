-- =============================================================
-- 002_user_preferences.sql
-- One row per user. Created automatically by trigger on user insert.
-- Stores diet, spice levels, cooking preferences, and app settings.
-- =============================================================

CREATE TABLE user_preferences (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Diet — set during onboarding, editable in Me screen
  diet                 TEXT NOT NULL DEFAULT 'vegetarian'
                       CHECK (diet IN ('vegetarian','non-vegetarian','eggetarian','vegan','jain')),

  -- Cooking
  cooking_time_max     INTEGER DEFAULT 30,     -- max minutes willing to cook
  cooking_skill        TEXT DEFAULT 'home_cook'
                       CHECK (cooking_skill IN ('beginner','home_cook','confident','advanced')),

  -- Spice levels — both injected into every AI prompt
  -- spice_level      : adult meals
  -- spice_level_kids : any recipe where kidsCanHelp=true or served to children
  spice_level          TEXT NOT NULL DEFAULT 'medium'
                       CHECK (spice_level IN ('mild','medium','hot','extra_hot')),
  spice_level_kids     TEXT NOT NULL DEFAULT 'mild'
                       CHECK (spice_level_kids IN ('mild','medium','hot')),
  -- Per-recipe spice overrides stored in user_history.metadata JSONB

  -- Preferences learned over time (AI updates these)
  preferred_cuisines   TEXT[] DEFAULT ARRAY['North Indian','South Indian'],
  disliked_ingredients TEXT[] DEFAULT ARRAY[]::TEXT[],
  allergies            TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- App behaviour
  voice_enabled        BOOLEAN DEFAULT TRUE,
  notifications_on     BOOLEAN DEFAULT TRUE,
  notification_time    TIME DEFAULT '07:30',   -- morning nudge time (local)

  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id)
);

-- ── Row-Level Security ────────────────────────────────────────
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prefs_select_own" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "prefs_insert_own" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "prefs_update_own" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
