-- =============================================================
-- 006_saved_plans.sql
-- Stores full AI-generated plans (festival, day flow, meal week).
-- plan_data holds the complete Claude output as JSONB so it
-- never needs to be regenerated unless the user explicitly requests it.
-- =============================================================

CREATE TABLE saved_plans (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  plan_type             TEXT NOT NULL
                        CHECK (plan_type IN ('festival','day_flow','meal_week')),
  plan_name             TEXT NOT NULL,       -- e.g. "Diwali 2025 Plan"
  festival_key          TEXT,               -- 'diwali' | 'holi' | null for day_flow/meal_week
  plan_date             DATE,               -- the date this plan applies to

  -- Full AI output
  plan_data             JSONB NOT NULL,

  -- Audit trail — used for debugging and prompt iteration
  prompt_version        TEXT NOT NULL,       -- e.g. 'festival_planner_v1.0'
  user_context_snapshot JSONB,              -- snapshot of user profile at generation time

  -- State
  is_active             BOOLEAN DEFAULT TRUE,
  shopping_checked      JSONB DEFAULT '{}', -- {itemId: boolean} grocery list checkboxes

  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Fast lookup: "show me this user's active festival plans"
CREATE INDEX idx_plans_user_type_active ON saved_plans (user_id, plan_type, is_active);
CREATE INDEX idx_plans_user_date        ON saved_plans (user_id, plan_date DESC)
  WHERE plan_date IS NOT NULL;

-- ── Row-Level Security ────────────────────────────────────────
ALTER TABLE saved_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_select_own" ON saved_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "plans_insert_own" ON saved_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "plans_update_own" ON saved_plans
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "plans_delete_own" ON saved_plans
  FOR DELETE USING (auth.uid() = user_id);
