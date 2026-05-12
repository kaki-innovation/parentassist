-- =============================================================
-- 009_affiliate_links.sql
-- Affiliate links for grocery ingredients.
-- affiliate_links is global content (no RLS).
-- affiliate_clicks tracks per-user but user_id is nullable (anonymous).
-- =============================================================

CREATE TABLE affiliate_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_name TEXT NOT NULL,         -- "Besan (chickpea flour)"
  ingredient_key  TEXT,                  -- normalised: 'besan'
  partner_name    TEXT NOT NULL,         -- "Woolworths", "Patel Brothers Online"
  partner_type    TEXT
                  CHECK (partner_type IN ('supermarket','indian_grocery','specialty','online')),
  affiliate_url   TEXT NOT NULL,
  commission_rate DECIMAL(5,4),          -- e.g. 0.0400 = 4%
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_affiliate_ingredient ON affiliate_links (ingredient_key)
  WHERE is_active = TRUE;

-- ── Click tracking ────────────────────────────────────────────
CREATE TABLE affiliate_clicks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,  -- nullable: allow anonymous
  link_id     UUID REFERENCES affiliate_links(id) NOT NULL,
  recipe_id   TEXT,         -- which recipe context triggered the click
  clicked_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_affiliate_clicks_user   ON affiliate_clicks (user_id)
  WHERE user_id IS NOT NULL;
CREATE INDEX idx_affiliate_clicks_link   ON affiliate_clicks (link_id);
CREATE INDEX idx_affiliate_clicks_recent ON affiliate_clicks (clicked_at DESC);

-- affiliate_links: no RLS — global content
-- affiliate_clicks: open insert (analytics), read restricted to service_role

ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Users can see their own click history
CREATE POLICY "clicks_select_own" ON affiliate_clicks
  FOR SELECT USING (auth.uid() = user_id);

-- Clicks are inserted by the API (service_role), also allow authenticated insert
CREATE POLICY "clicks_insert_auth" ON affiliate_clicks
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
