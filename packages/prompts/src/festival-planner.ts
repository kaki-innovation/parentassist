/**
 * Festival planner prompt — generates a comprehensive plan for an upcoming
 * Indian festival: recipes, decor ideas, activities for kids, shopping list.
 *
 * PROMPT_VERSION: bump on any edit to system or user prompt text.
 */

import type { AnonymisedUserContext } from '@parentassist/types';
import type { FestivalId } from '@parentassist/config';

export const FESTIVAL_PLANNER_PROMPT_VERSION = '1.0.0';

export interface FestivalPlannerPromptInput {
  user: AnonymisedUserContext;
  festival: {
    id: FestivalId;
    name: string;
    daysAway: number;
    year: number;
  };
  ragContext?: string;
}

export interface FestivalPlannerPromptOutput {
  systemPrompt: string;
  userPrompt: string;
  version: string;
}

export function buildFestivalPlannerPrompt(input: FestivalPlannerPromptInput): FestivalPlannerPromptOutput {
  const { user, festival, ragContext = '' } = input;

  const systemPrompt = `You are ParentAssist's festival planning expert — a warm and knowledgeable guide for Indian families celebrating their culture while living in Australia.

Your role: create a practical, joyful, and culturally authentic festival plan that an Indian mother in ${user.city}, Australia can actually execute — accounting for local ingredient availability and busy family life.

Family context:
- Diet: ${user.diet}
- Adult spice preference: ${user.spice_level}
- Kids spice preference: ${user.spice_level_kids}
- Children ages: ${user.children_ages.length > 0 ? user.children_ages.join(', ') + ' years' : 'no children'}
- City: ${user.city}, Australia

RULES:
- Only suggest ${user.diet} food.
- Apply kids spice level (${user.spice_level_kids}) to any recipe children will eat or help cook.
- Kids activities must include supervisionLevel, safetyNote, ageMin, ageMax.
- Never suggest fire/flames for children under 12 (e.g. lighting actual diyas must be adult_only).
- Ingredients must be available at Indian grocery stores in Australian capital cities.
- Suggest Australian supermarket alternatives where relevant (e.g. "maida → plain flour").

OUTPUT: Respond ONLY with valid JSON. No prose, no markdown fences.`;

  const ragNote = ragContext
    ? `\n\nRelevant festival content from our knowledge base:\n${ragContext}`
    : '';

  const userPrompt = `Create a complete ${festival.name} ${festival.year} plan. The festival is ${festival.daysAway} days away.${ragNote}

Include:
1. meals (array of recipe suggestions — breakfast, lunch, dinner, sweets/snacks)
2. decor_ideas (array — simple ideas achievable at home in Australia)
3. kids_activities (array — age-appropriate for children aged ${user.children_ages.join('/')} with full safety metadata)
4. shopping_list (array of ingredients grouped by category)
5. preparation_timeline (object — what to do N days before the festival)
6. cultural_notes (string — context about why this festival matters, suitable for explaining to Australian-born children)`;

  return { systemPrompt, userPrompt, version: FESTIVAL_PLANNER_PROMPT_VERSION };
}
