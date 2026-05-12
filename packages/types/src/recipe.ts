import type { DietType, SpiceLevel } from './user';
import type { KidsSafetyMetadata } from './ai';

export interface Recipe {
  id: string;
  name: string;
  slug: string;
  description: string;
  diet: DietType[];
  spice_level: SpiceLevel;
  prep_time_minutes: number;
  cook_time_minutes: number;
  serves: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tags: string[];
  region?: string;
  festival_ids?: string[];
  kids_can_help: boolean;
  kids_help_notes?: string;
  /** Present when kids_can_help = true */
  kids_safety?: KidsSafetyMetadata;
  image_slug?: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit?: string;
  optional?: boolean;
}

export interface RecipeStep {
  step: number;
  instruction: string;
  duration_minutes?: number;
  tip?: string;
}

/** AI-generated meal suggestion (subset of Recipe) */
export interface MealSuggestion {
  name: string;
  description: string;
  spice_level: SpiceLevel;
  prep_time_minutes: number;
  cook_time_minutes: number;
  diet: DietType[];
  kids_can_help: boolean;
  why_suggested: string;
  image_query: string;
}

export interface MealPlan {
  week_start: string;   // ISO date
  days: DayMealPlan[];
}

export interface DayMealPlan {
  date: string;
  breakfast?: MealSuggestion;
  lunch?: MealSuggestion;
  dinner?: MealSuggestion;
  snack?: MealSuggestion;
}

export interface GroceryList {
  meal_plan_id: string;
  items: GroceryItem[];
  generated_at: string;
}

export interface GroceryItem {
  name: string;
  quantity: string;
  unit?: string;
  category: 'produce' | 'dairy' | 'pantry' | 'spices' | 'frozen' | 'other';
  checked: boolean;
}
