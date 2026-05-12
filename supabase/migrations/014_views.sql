-- =============================================================
-- 014_views.sql
-- Read-only views used by the API for common queries.
-- These avoid repetitive joins and keep query logic in one place.
--
-- FIXES vs DATA_MODELS.md:
--   - s.ai_calls_this_month → s.daily_ai_calls_used (column doesn't exist)
--   - json_agg FILTER (WHERE uk.id IS NOT NULL) — avoids [null] when no kids
-- =============================================================

-- ── View 1: Full user profile with computed kids ages ─────────
-- Used by: every AI route to build AnonymisedUserContext
CREATE VIEW user_profile_full AS
SELECT
  u.id,
  u.email,
  u.name,
  u.avatar_url,
  u.location_city,
  u.location_country,
  u.location_postcode,
  u.onboarding_done,
  u.onboarding_step,
  u.created_at,
  u.last_active_at,
  u.deleted_at,

  -- Preferences (flattened — avoids a second query in the API)
  up.diet,
  up.cooking_time_max,
  up.cooking_skill,
  up.spice_level,
  up.spice_level_kids,
  up.preferred_cuisines,
  up.disliked_ingredients,
  up.allergies,
  up.voice_enabled,
  up.notifications_on,
  up.notification_time,

  -- Kids with computed ages (FILTER avoids [null] when user has no children)
  COALESCE(
    json_agg(
      json_build_object(
        'id',         uk.id,
        'name',       uk.name,
        'birth_year', uk.birth_year,
        'age',        DATE_PART('year', AGE(NOW(), MAKE_DATE(uk.birth_year, COALESCE(uk.birth_month, 1), 1)))
      )
    ) FILTER (WHERE uk.id IS NOT NULL),
    '[]'::json
  ) AS kids,

  -- Subscription (flattened)
  s.tier                    AS subscription_tier,
  s.status                  AS subscription_status,
  s.daily_ai_calls_used     AS ai_calls_today,
  s.daily_ai_calls_reset_at,
  s.grace_period_ends_at,
  s.paywall_shown_count,
  s.paywall_last_shown_at

FROM users u
LEFT JOIN user_preferences up ON up.user_id = u.id
LEFT JOIN user_kids         uk ON uk.user_id = u.id
LEFT JOIN subscriptions     s  ON s.user_id  = u.id
WHERE u.deleted_at IS NULL
GROUP BY
  u.id, u.email, u.name, u.avatar_url,
  u.location_city, u.location_country, u.location_postcode,
  u.onboarding_done, u.onboarding_step,
  u.created_at, u.last_active_at, u.deleted_at,
  up.diet, up.cooking_time_max, up.cooking_skill,
  up.spice_level, up.spice_level_kids,
  up.preferred_cuisines, up.disliked_ingredients, up.allergies,
  up.voice_enabled, up.notifications_on, up.notification_time,
  s.tier, s.status, s.daily_ai_calls_used, s.daily_ai_calls_reset_at,
  s.grace_period_ends_at, s.paywall_shown_count, s.paywall_last_shown_at;

-- ── View 2: User's liked/cooked/saved recipes ─────────────────
-- Used by: personalisation layer when building AI prompts
CREATE VIEW user_liked_recipes AS
SELECT
  uh.user_id,
  uh.content_id    AS recipe_id,
  uh.content_name  AS recipe_name,
  COUNT(*)         AS interaction_count,
  MAX(uh.created_at) AS last_seen
FROM user_history uh
WHERE uh.content_type = 'recipe'
  AND uh.action IN ('liked', 'cooked', 'saved')
GROUP BY uh.user_id, uh.content_id, uh.content_name;

-- ── View 3: Recent meals (last 7 days, for AI deduplication) ──
-- Used by: meal-planner prompt — passed as recentMeals to avoid repeats
CREATE VIEW user_recent_meals AS
SELECT
  user_id,
  content_name  AS meal_name,
  created_at
FROM user_history
WHERE content_type = 'recipe'
  AND action NOT IN ('disliked', 'refreshed_away')
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
