-- =============================================================
-- 007_subscriptions.sql
-- One row per user, created automatically by trigger (015_triggers.sql).
-- Tracks tier, billing state, daily AI usage, and paywall counters.
-- All IAP managed via RevenueCat — never call StoreKit/Google Billing directly.
-- =============================================================

CREATE TABLE subscriptions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Tier
  tier                     TEXT NOT NULL DEFAULT 'free'
                           CHECK (tier IN ('free','trial','premium','family')),
  billing_interval         TEXT CHECK (billing_interval IN ('monthly','annual')),
  status                   TEXT NOT NULL DEFAULT 'active'
                           CHECK (status IN ('active','cancelled','expired','paused','win_back')),

  -- Trial
  trial_started_at         TIMESTAMPTZ,
  trial_ends_at            TIMESTAMPTZ,
  trial_converted          BOOLEAN DEFAULT FALSE,

  -- Billing period
  current_period_start     TIMESTAMPTZ,
  current_period_end       TIMESTAMPTZ,
  cancelled_at             TIMESTAMPTZ,
  cancellation_reason      TEXT,

  -- Store IDs (managed via RevenueCat webhooks)
  revenuecat_user_id       TEXT UNIQUE,
  apple_subscription_id    TEXT UNIQUE,
  google_subscription_id   TEXT UNIQUE,
  stripe_subscription_id   TEXT UNIQUE,

  -- Win-back offers
  win_back_offered_at      TIMESTAMPTZ,
  win_back_accepted        BOOLEAN DEFAULT FALSE,
  win_back_discount_pct    INTEGER,              -- e.g. 50 = 50% off

  -- Free tier daily AI usage
  -- Resets at midnight user local time (handled by API, not DB)
  daily_ai_calls_used      INTEGER DEFAULT 0,
  daily_ai_calls_reset_at  TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 day',

  -- Grace period: days 1–3 after signup = unlimited queries
  grace_period_ends_at     TIMESTAMPTZ DEFAULT NOW() + INTERVAL '3 days',

  -- Paywall display limits
  -- Max 4 total shows, max 1 per day (CLAUDE.md MONETISATION rules)
  sessions_since_signup    INTEGER DEFAULT 0,
  paywall_shown_count      INTEGER DEFAULT 0,
  paywall_last_shown_at    TIMESTAMPTZ,

  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id)
);

-- Fast lookup for daily reset jobs
CREATE INDEX idx_subs_reset_at ON subscriptions (daily_ai_calls_reset_at)
  WHERE tier = 'free';

-- ── Row-Level Security ────────────────────────────────────────
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subs_select_own" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users must not be able to modify their own subscription tier
-- (that's handled server-side via RevenueCat webhooks using service_role)
-- Allow update only of non-sensitive fields
CREATE POLICY "subs_update_own" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
