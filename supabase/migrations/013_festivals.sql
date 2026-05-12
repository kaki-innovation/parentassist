-- =============================================================
-- 013_festivals.sql
-- Global festival metadata. Not per-user.
-- Seed data added here for the 15 festivals from packages/config/festivals.ts.
-- =============================================================

CREATE TABLE festivals (
  key                    TEXT PRIMARY KEY,    -- 'diwali', 'holi', 'navratri'
  name                   TEXT NOT NULL,
  alternate_names        TEXT[],
  description            TEXT,
  meaning                TEXT,
  spiritual_context      TEXT,
  duration_days          INTEGER,

  -- Australian context
  typical_month          INTEGER CHECK (typical_month BETWEEN 1 AND 12),
  melbourne_events       TEXT[],             -- known Melbourne events/locations
  melbourne_stores       TEXT[],             -- where to buy supplies in Melbourne

  -- Content arrays
  key_traditions         TEXT[],
  typical_foods          TEXT[],
  typical_activities     TEXT[],
  apartment_adaptations  TEXT[],             -- how to celebrate in an apartment
  child_safety_notes     TEXT[],             -- safety notes specific to this festival

  -- RAG
  embedding_id           TEXT,

  is_published           BOOLEAN DEFAULT FALSE,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_festivals_month     ON festivals (typical_month);
CREATE INDEX idx_festivals_published ON festivals (is_published) WHERE is_published = TRUE;

-- No RLS: global content

-- ── Seed Data ─────────────────────────────────────────────────
-- Core 15 festivals matching packages/config/festivals.ts
INSERT INTO festivals (key, name, typical_month, description, is_published) VALUES
  ('diwali',            'Diwali',            10, 'Festival of lights — sweets, diyas, and family.',              TRUE),
  ('holi',              'Holi',               3, 'Festival of colours — spring celebration of love and renewal.',TRUE),
  ('navratri',          'Navratri',          10, 'Nine nights of the goddess — garba, fasting, colour dressing.',TRUE),
  ('dussehra',          'Dussehra',          10, 'Triumph of good over evil — Ramlila and celebration.',         TRUE),
  ('ganesh_chaturthi',  'Ganesh Chaturthi',   8, 'Birthday of Lord Ganesha — modaks, processions, prayer.',      TRUE),
  ('raksha_bandhan',    'Raksha Bandhan',     8, 'Bond between siblings — rakhi tying and sweets.',              TRUE),
  ('janmashtami',       'Janmashtami',        8, 'Krishna''s birthday — fasting, bhajans, dahi handi.',          TRUE),
  ('baisakhi',          'Baisakhi',           4, 'Punjabi harvest festival — bhangra, langar, gratitude.',       TRUE),
  ('eid_al_fitr',       'Eid al-Fitr',        4, 'End of Ramadan — feasting, gifts, and family visits.',         TRUE),
  ('eid_al_adha',       'Eid al-Adha',        6, 'Festival of sacrifice — prayer, feasting, charity.',           TRUE),
  ('christmas',         'Christmas',         12, 'Celebrated by many Indian families — carols, gifts, cake.',    TRUE),
  ('new_year',          'New Year''s Day',    1, 'Rang in with fireworks, resolutions, family gatherings.',      TRUE),
  ('pongal',            'Pongal',             1, 'South Indian harvest — sweet rice, kolam, gratitude.',         TRUE),
  ('onam',              'Onam',               8, 'Kerala harvest — sadya feast, pookalam art, boat races.',      TRUE),
  ('ugadi',             'Ugadi',              3, 'Telugu/Kannada New Year — pachadi and new beginnings.',        TRUE)
ON CONFLICT (key) DO NOTHING;
