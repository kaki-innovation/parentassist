-- =============================================================
-- 015_triggers.sql
-- All trigger functions and trigger definitions.
--
-- Three concerns:
--   1. Supabase Auth sync — when auth.users gets a new row,
--      mirror it into public.users so RLS works.
--   2. Auto-create subscription + preferences on new user.
--   3. Auto-update updated_at on all mutable tables.
-- =============================================================

-- ── 1. Shared updated_at function ────────────────────────────
-- Reused across all tables that have an updated_at column.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Wire updated_at to every mutable table
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_prefs_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_plans_updated_at
  BEFORE UPDATE ON saved_plans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_subs_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── 2. Supabase Auth → public.users sync ─────────────────────
-- When a user signs up via Supabase Auth (email, Google, or Apple),
-- their row lands in auth.users. This trigger mirrors it to public.users
-- so all our RLS policies (auth.uid() = id) work correctly.
--
-- auth.users.raw_user_meta_data contains: { full_name, avatar_url }
-- populated by Google OAuth and by our signup form.

CREATE OR REPLACE FUNCTION sync_auth_user_to_public()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)   -- fallback: use email prefix as display name
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email      = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_auth_user_to_public();

-- Also sync email/avatar on profile update (e.g. Google re-auth)
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email, raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_auth_user_to_public();

-- ── 3. Auto-create subscription on new public.users row ──────
-- Fires AFTER the auth sync trigger has created the public.users row.

CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (
    user_id,
    tier,
    status,
    grace_period_ends_at,
    daily_ai_calls_reset_at
  )
  VALUES (
    NEW.id,
    'free',
    'active',
    NOW() + INTERVAL '3 days',   -- days 1-3 = unlimited AI queries
    NOW() + INTERVAL '1 day'     -- first daily reset at tomorrow midnight
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_subscription
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION create_default_subscription();

-- ── 4. Auto-create preferences on new public.users row ───────

CREATE OR REPLACE FUNCTION create_default_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_preferences
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION create_default_preferences();

-- ── 5. last_active_at refresh ─────────────────────────────────
-- Bumps users.last_active_at whenever the user writes any history row.
-- Cheap way to track engagement without a separate heartbeat call.

CREATE OR REPLACE FUNCTION refresh_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET last_active_at = NOW() WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_history_insert_refresh_active
  AFTER INSERT ON user_history
  FOR EACH ROW EXECUTE FUNCTION refresh_last_active();
