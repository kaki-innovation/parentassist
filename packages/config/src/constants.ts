/** App-wide constants. Keep values in sync with Supabase schema + RevenueCat products. */

export const APP_NAME = 'ParentAssist';
export const BUNDLE_ID = 'com.parentassist.app';
export const APP_STORE_ID = ''; // Fill in after App Store Connect listing created

// Subscription tiers
export const TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
  FAMILY: 'family',
} as const;

export type Tier = (typeof TIERS)[keyof typeof TIERS];

// Free tier limits
export const FREE_TIER = {
  AI_QUERIES_PER_DAY: 5,
  FESTIVAL_SAMPLE_ITEMS: 3,
  GRACE_PERIOD_DAYS: 3,
  TRIAL_DAYS: 14,
} as const;

// Paywall display limits
export const PAYWALL = {
  MAX_TOTAL_SHOWS: 4,
  MAX_PER_DAY: 1,
} as const;

// Sponsored content limits
export const SPONSORED = {
  MAX_RATIO: 10, // 1 sponsored per this many organic
} as const;

// Spice levels
export const SPICE_LEVELS = ['mild', 'medium', 'hot', 'extra_hot'] as const;
export type SpiceLevel = (typeof SPICE_LEVELS)[number];

// Age safety thresholds (align with SAFETY_POLICY in CLAUDE.md)
export const SAFETY = {
  MIN_AGE_SHARP_IMPLEMENTS: 8,
  MIN_AGE_FIRE: 12,        // No fire/flames below this age
  MAX_AGE_CHOKING_HAZARD: 5, // Small parts warning for under-5
} as const;

// AI response cache TTL
export const CACHE_TTL_SECONDS = 4 * 60 * 60; // 4 hours

// Supervision levels for kids activities
export const SUPERVISION_LEVELS = [
  'independent',        // child can do alone
  'light',              // parent nearby but not hands-on
  'active',             // parent actively involved
  'adult_only',         // adult must perform, child observes only
] as const;

export type SupervisionLevel = (typeof SUPERVISION_LEVELS)[number];
