import type { KidsSafetyMetadata } from './ai';

export interface KidsActivity {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  materials: string[];
  steps: ActivityStep[];
  tags: ActivityTag[];
  festival_ids?: string[];
  /** All kids activities MUST carry safety metadata */
  safety: KidsSafetyMetadata;
  image_query: string;
}

export interface ActivityStep {
  step: number;
  instruction: string;
  tip?: string;
}

export type ActivityTag =
  | 'craft'
  | 'cooking'
  | 'outdoor'
  | 'indoor'
  | 'sensory'
  | 'educational'
  | 'music'
  | 'dance'
  | 'storytelling'
  | 'art'
  | 'science'
  | 'festival';

/** Paired recipe + activity suggestion (Premium feature) */
export interface PairedSuggestion {
  recipe_name: string;
  activity_name: string;
  pairing_reason: string;
  total_time_minutes: number;
  activity: KidsActivity;
}

/** AI-generated gentle day flow */
export interface DayFlow {
  date: string;
  morning: DayFlowBlock;
  midday: DayFlowBlock;
  afternoon: DayFlowBlock;
  evening: DayFlowBlock;
}

export interface DayFlowBlock {
  time_range: string;
  meal?: string;
  activity?: string;
  note?: string;
}
