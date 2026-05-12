-- =============================================================
-- 011_recipes.sql
-- Global recipe content. Not per-user — readable by all authenticated users.
-- Populated via rag:ingest script, not by users.
-- =============================================================

CREATE TABLE recipes (
  id               TEXT PRIMARY KEY,       -- slug: 'besan_ladoo_v1'
  name             TEXT NOT NULL,
  description      TEXT,
  time_minutes     INTEGER,
  servings         INTEGER,
  difficulty       TEXT CHECK (difficulty IN ('easy','medium','hard')),

  -- Tag arrays — use GIN indexes for fast array containment queries
  diet_tags        TEXT[],                 -- ['vegetarian','gluten-free']
  allergens        TEXT[],                 -- ['dairy','nuts']
  festival_tags    TEXT[],                 -- ['diwali','holi']
  mood_tags        TEXT[],                 -- ['comfort','festive','healthy']
  meal_type        TEXT[],                 -- ['breakfast','lunch','dinner','snack']

  -- Kids safety
  kids_can_help    BOOLEAN DEFAULT FALSE,
  kids_help_task   TEXT,                   -- e.g. "roll the dough balls"
  make_ahead       BOOLEAN DEFAULT FALSE,
  make_ahead_days  INTEGER,

  -- Content (stored as structured JSONB)
  ingredients      JSONB,                  -- [{name, quantity, unit, notes}]
  steps            JSONB,                  -- [{stepNum, instruction, timeMinutes, tip}]

  australian_notes TEXT,                   -- local substitutions / where to buy
  region_origin    TEXT,                   -- "Rajasthan", "Tamil Nadu"

  -- Image fields (provider-agnostic, see IMAGE_ARCHITECTURE in CLAUDE.md)
  image_url        TEXT,                   -- populated Supabase Storage URL
  unsplash_id      TEXT,                   -- Unsplash photo ID (Phase 1 only)
  unsplash_credit  TEXT,                   -- "Photo by Name on Unsplash" — required by license
  image_blurhash   TEXT,                   -- blurhash for placeholder
  image_generated  BOOLEAN DEFAULT FALSE,  -- TRUE when AI-generated (Phase 3)

  -- RAG / Pinecone
  embedding_id     TEXT,                   -- Pinecone vector ID
  rag_version      INTEGER DEFAULT 1,

  -- Publishing
  safety_verified  BOOLEAN DEFAULT FALSE,
  is_published     BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- GIN indexes for array tag searches (WHERE 'diwali' = ANY(festival_tags))
CREATE INDEX idx_recipes_festival_tags ON recipes USING GIN (festival_tags);
CREATE INDEX idx_recipes_diet_tags     ON recipes USING GIN (diet_tags);
CREATE INDEX idx_recipes_meal_type     ON recipes USING GIN (meal_type);
CREATE INDEX idx_recipes_published     ON recipes (is_published) WHERE is_published = TRUE;
CREATE INDEX idx_recipes_kids          ON recipes (kids_can_help) WHERE kids_can_help = TRUE;

-- No RLS: global content readable by all authenticated users via Supabase anon key
