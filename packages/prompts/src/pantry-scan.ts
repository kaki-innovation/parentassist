/**
 * Pantry scan prompt — given a list of detected pantry ingredients (from photo),
 * suggests meals the family can cook today without a shopping trip.
 *
 * PROMPT_VERSION: bump on any edit to system or user prompt text.
 */

import type { AnonymisedUserContext } from '@parentassist/types';

export const PANTRY_SCAN_PROMPT_VERSION = '1.0.0';

export interface PantryScanPromptInput {
  user: AnonymisedUserContext;
  detectedIngredients: string[];  // From vision model analysis of pantry photo
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'any';
  ragContext?: string;
}

export interface PantryScanPromptOutput {
  systemPrompt: string;
  userPrompt: string;
  version: string;
}

export function buildPantryScanPrompt(input: PantryScanPromptInput): PantryScanPromptOutput {
  const { user, detectedIngredients, mealType, ragContext = '' } = input;

  const systemPrompt = `You are ParentAssist's pantry-to-plate chef — a resourceful, practical guide who turns whatever is in an Indian family's pantry into a delicious meal with minimal shopping.

Your role: look at the available ingredients and suggest achievable ${user.diet} recipes the family can cook today.

Family context:
- Diet: ${user.diet} — ONLY suggest recipes matching this diet
- Adult spice preference: ${user.spice_level}
- Kids spice preference: ${user.spice_level_kids}
- Children ages: ${user.children_ages.length > 0 ? user.children_ages.join(', ') + ' years' : 'no children'}
- Meal needed: ${mealType}

RULES:
- Only suggest ${user.diet} recipes — non-negotiable.
- Prioritise recipes using available ingredients; list any additional items needed.
- Keep 'additional_ingredients_needed' list short (max 3–4 items) — this is pantry cooking.
- Apply kids spice level for any recipe children will eat.
- Mark kids_can_help if genuinely safe for the children's ages.

OUTPUT: Respond ONLY with valid JSON array of recipe suggestions. No prose, no markdown.`;

  const ragNote = ragContext
    ? `\n\nRelevant recipes from our knowledge base:\n${ragContext}`
    : '';

  const userPrompt = `Available pantry ingredients: ${detectedIngredients.join(', ')}.${ragNote}

Suggest 3–5 ${mealType === 'any' ? '' : mealType + ' '}recipes this family can cook using these ingredients.

Each suggestion must include: name, description, spice_level, prep_time_minutes, cook_time_minutes, diet (array), kids_can_help (boolean), ingredients_used (array from pantry), additional_ingredients_needed (array, max 4), why_suggested, image_query.`;

  return { systemPrompt, userPrompt, version: PANTRY_SCAN_PROMPT_VERSION };
}
