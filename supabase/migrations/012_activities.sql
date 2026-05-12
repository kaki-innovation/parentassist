-- =============================================================
-- 012_activities.sql
-- Global kids activity content. Not per-user.
-- All activities must be safety_verified before is_published = TRUE.
-- Safety fields are non-negotiable (see SAFETY_POLICY in CLAUDE.md).
-- =============================================================

CREATE TABLE activities (
  id                  TEXT PRIMARY KEY,    -- slug: 'chalk_rangoli_v1'
  name                TEXT NOT NULL,
  description         TEXT,

  -- Age range — ALWAYS required, used for safety filtering
  age_min             INTEGER NOT NULL CHECK (age_min >= 0 AND age_min <= 18),
  age_max             INTEGER NOT NULL CHECK (age_max >= 0 AND age_max <= 18),

  time_minutes        INTEGER,
  setting             TEXT CHECK (setting IN ('indoor','outdoor','either')),

  -- Supervision level — ALWAYS required
  supervision_level   TEXT NOT NULL
                      CHECK (supervision_level IN ('independent','light','close','adult_only')),

  -- Safety
  safety_notes        TEXT[],
  safety_verified     BOOLEAN DEFAULT FALSE,
  safety_review_date  DATE,

  -- Materials
  materials_needed    TEXT,
  materials_australia TEXT,               -- where to buy in Australia
  cost_aud_min        DECIMAL(8,2),
  cost_aud_max        DECIMAL(8,2),
  mess_level          TEXT CHECK (mess_level IN ('none','low','medium','high')),
  sibling_friendly    BOOLEAN DEFAULT FALSE,

  -- Tags
  festival_tags       TEXT[],
  age_tags            TEXT[],             -- ['toddler','early-primary','upper-primary']
  learning_value      TEXT,
  cultural_note       TEXT,

  -- RAG
  embedding_id        TEXT,

  -- Publishing — safety_verified must be TRUE before is_published
  is_published        BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT age_range_valid CHECK (age_min <= age_max)
);

-- Constraint: cannot publish an activity that hasn't been safety-verified
CREATE OR REPLACE FUNCTION check_activity_safety()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = TRUE AND NEW.safety_verified = FALSE THEN
    RAISE EXCEPTION 'Cannot publish activity without safety_verified = TRUE';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_activity_safety
  BEFORE INSERT OR UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION check_activity_safety();

-- Indexes
CREATE INDEX idx_activities_age       ON activities (age_min, age_max);
CREATE INDEX idx_activities_festival  ON activities USING GIN (festival_tags);
CREATE INDEX idx_activities_published ON activities (is_published) WHERE is_published = TRUE;
CREATE INDEX idx_activities_setting   ON activities (setting);

-- No RLS: global content readable by all authenticated users
