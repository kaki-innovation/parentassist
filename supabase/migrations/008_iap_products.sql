-- =============================================================
-- 008_iap_products.sql
-- One-time purchasable content packs (e.g. Diwali Activity Pack).
-- iap_products is global (no RLS). user_iap_purchases is per-user.
-- =============================================================

CREATE TABLE iap_products (
  id                TEXT PRIMARY KEY,     -- 'diwali_activity_pack_v1'
  name              TEXT NOT NULL,         -- "Diwali Activity Pack"
  description       TEXT,
  price_aud         DECIMAL(10,2) NOT NULL,
  product_type      TEXT NOT NULL
                    CHECK (product_type IN ('activity_pack','recipe_bundle','other')),
  festival_key      TEXT,                  -- 'diwali' | 'holi' | null
  asset_url         TEXT,                  -- S3/Supabase Storage URL for PDF/zip
  apple_product_id  TEXT,                  -- com.parentassist.diwali_pack
  google_product_id TEXT,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- No RLS — global catalogue, readable by all authenticated users

-- ── User purchases ────────────────────────────────────────────
CREATE TABLE user_iap_purchases (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id       TEXT REFERENCES iap_products(id) NOT NULL,
  transaction_id   TEXT UNIQUE NOT NULL,
  amount_paid_aud  DECIMAL(10,2),
  store            TEXT NOT NULL CHECK (store IN ('apple','google','stripe')),
  purchased_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_iap_purchases_user ON user_iap_purchases (user_id);

-- ── Row-Level Security ────────────────────────────────────────
ALTER TABLE user_iap_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "iap_select_own" ON user_iap_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Purchases are written server-side by RevenueCat webhook (service_role)
-- Direct client inserts blocked intentionally
