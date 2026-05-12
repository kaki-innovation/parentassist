import type { Tier } from '@parentassist/config';

export interface Subscription {
  user_id: string;
  tier: Tier;
  status: SubscriptionStatus;
  trial_ends_at?: string;
  current_period_ends_at?: string;
  paywall_shown_count: number;
  paywall_last_shown_at?: string;
  revenuecat_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'cancelled'
  | 'expired';

export interface UsageRecord {
  user_id: string;
  date: string;           // YYYY-MM-DD in user local time
  ai_queries_used: number;
  ai_queries_limit: number;
  reset_at: string;       // midnight user local time ISO
}

export type PremiumAction =
  | 'full_festival_plan'
  | 'weekly_meal_plan'
  | 'grocery_list'
  | 'pantry_upload'
  | 'pair_activity';

export interface PaywallCheckResult {
  allowed: boolean;
  reason?: 'free_tier_limit' | 'paywall_gate' | 'grace_period';
  queries_remaining?: number;
  upgrade_prompt?: string;
}
