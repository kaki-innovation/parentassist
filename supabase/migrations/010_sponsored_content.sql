-- =============================================================
-- 010_sponsored_content.sql
-- Sponsored recipes/activities/tips from brand partners.
-- Global content — no per-user RLS.
-- RULES (enforced in API, not DB):
--   - max 1 sponsored per 10 organic items
--   - NEVER in kids section (show_in_kids_section = FALSE enforced at API layer)
--   - always display display_label to user
-- =============================================================

CREATE TABLE sponsored_content (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_name         TEXT NOT NULL,      -- "MDH Spices", "Patak's"
  content_type         TEXT NOT NULL
                       CHECK (content_type IN ('recipe','activity','festival_tip')),
  content_data         JSONB NOT NULL,     -- same schema as recipe or activity

  festival_tags        TEXT[],             -- which festivals this content suits
  diet_tags            TEXT[],             -- ['vegetarian','vegan'] for targeting

  display_label        TEXT NOT NULL DEFAULT 'Sponsored',  -- ALWAYS shown to user
  cta_text             TEXT,               -- "Shop MDH Spices at Woolworths"
  cta_url              TEXT,

  -- Frequency rules (also enforced at API layer)
  max_per_session      INTEGER DEFAULT 1,   -- max 1 sponsored per session
  min_organic_before   INTEGER DEFAULT 10,  -- show 10 organic items first
  show_in_kids_section BOOLEAN DEFAULT FALSE NOT NULL,  -- NEVER TRUE in production

  is_active            BOOLEAN DEFAULT TRUE,
  starts_at            TIMESTAMPTZ,
  ends_at              TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sponsored_active ON sponsored_content (is_active, starts_at, ends_at)
  WHERE is_active = TRUE;

-- Constraint: can never be shown in kids section
-- Belt-and-suspenders: DB + API both enforce this
ALTER TABLE sponsored_content
  ADD CONSTRAINT no_kids_sponsored
  CHECK (show_in_kids_section = FALSE);
