import type { Tier, SpiceLevel } from '@parentassist/config';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  deleted_at?: string;
  grace_period_ends_at: string;
  preferences: UserPreferences;
  children: ChildProfile[];
}

export interface UserPreferences {
  diet: DietType;
  spice_level: SpiceLevel;
  spice_level_kids: Exclude<SpiceLevel, 'extra_hot'>;
  city: AustralianCity;
  language: 'en' | 'hi' | 'ta' | 'te' | 'ml' | 'gu' | 'mr';
  notification_enabled: boolean;
  onboarding_completed: boolean;
}

export interface ChildProfile {
  id: string;
  user_id: string;
  nickname: string;
  birth_year: number;
  /** Computed at runtime — never stored directly in DB */
  age?: number;
}

export type DietType =
  | 'vegetarian'
  | 'vegan'
  | 'eggetarian'
  | 'non_vegetarian'
  | 'jain';

export type AustralianCity =
  | 'melbourne'
  | 'sydney'
  | 'brisbane'
  | 'perth'
  | 'adelaide'
  | 'canberra'
  | 'other';

/** Stripped profile sent to AI — no PII */
export interface AnonymisedUserContext {
  tokenId: string;          // replaces real user ID
  diet: DietType;
  spice_level: SpiceLevel;
  spice_level_kids: Exclude<SpiceLevel, 'extra_hot'>;
  city: AustralianCity;
  children_ages: number[];  // ages only, no names
  tier: Tier;
}
