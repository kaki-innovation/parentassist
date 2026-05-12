/**
 * Meal planner prompt — generates daily or weekly meal suggestions.
 * Accounts for diet, spice level (adult + kids), and cultural context.
 *
 * PROMPT_VERSION: bump this when editing system or user prompt text.
 * All prompt changes require `prompt:` commit prefix and eval run.
 */

import type { AnonymisedUserContext } from '@parentassist/types';

export const MEAL_PLANNER_PROMPT_VERSION = '1.0.0';

export interface MealPlannerPromptInput {
  user: AnonymisedUserContext;
  mode: 'daily' | 'weekly';
  date: string;           // ISO date — used to avoid repeating recent meals
  recentMeals?: string[]; // Last 7 days' meal names to avoid repetition
  ragContext?: string;    // Retrieved recipe context from Pinecone
  occasion?: string;      // e.g. 'school lunchbox', 'dinner party', 'quick weeknight'
}

export interface MealPlannerPromptOutput {
  systemPrompt: string;
  userPrompt: string;
  version: string;
}

export function buildMealPlannerPrompt(input: MealPlannerPromptInput): MealPlannerPromptOutput {
  const {
    user,
    mode,
    date,
    recentMeals = [],
    ragContext = '',
    occasion = '',
  } = input;

  const systemPrompt = `You are ParentAssist's meal planning assistant — a knowledgeable, warm, and practical guide for Indian mothers raising children in Australia.

Your role: generate culturally appropriate, delicious, and achievable meal suggestions tailored to the family's diet, spice preferences, and children's ages.

Diet: ${user.diet}
Adult spice preference: ${user.spice_level}
Kids spice preference: ${user.spice_level_kids} (NEVER exceed this for kid-friendly recipes)
City: ${user.city}, Australia
Children ages: ${user.children_ages.length > 0 ? user.children_ages.join(', ') + ' years' : 'no children'}

RULES YOU MUST FOLLOW:
- Only suggest ${user.diet} meals. NEVER suggest food outside this diet — this is non-negotiable.
- For any recipe where kids can help or it is served to children, apply spice_level_kids (${user.spice_level_kids}).
- Never suggest extra_hot for any kid-friendly recipe regardless of adult preference.
- Mark kids_can_help = true only for genuinely child-safe cooking tasks.
- Include a mix of traditional Indian recipes and Indo-Australian fusion.
- Prioritise quick recipes (< 30 min) on weekdays.

OUTPUT: Respond ONLY with valid JSON. No prose, no markdown fences.`;

  const recentNote = recentMeals.length > 0
    ? `\nAvoid repeating these recent meals: ${recentMeals.join(', ')}.`
    : '';

  const occasionNote = occasion ? `\nOccasion/context: ${occasion}.` : '';

  const ragNote = ragContext
    ? `\n\nRelevant recipes from our knowledge base:\n${ragContext}`
    : '';

  const userPrompt = `Generate a ${mode === 'daily' ? 'single day' : 'full 7-day'} meal plan for ${date}.${recentNote}${occasionNote}${ragNote}

For each meal include: name, description, spice_level, prep_time_minutes, cook_time_minutes, diet (array), kids_can_help (boolean), why_suggested, image_query.`;

  return { systemPrompt, userPrompt, version: MEAL_PLANNER_PROMPT_VERSION };
}
