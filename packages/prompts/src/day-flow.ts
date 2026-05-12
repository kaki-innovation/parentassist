/**
 * Day flow prompt — generates a gentle, structured day plan for a family.
 * Pairs meals and activities across morning/midday/afternoon/evening blocks.
 *
 * PROMPT_VERSION: bump on any edit to system or user prompt text.
 */

import type { AnonymisedUserContext } from '@parentassist/types';

export const DAY_FLOW_PROMPT_VERSION = '1.0.0';

export interface DayFlowPromptInput {
  user: AnonymisedUserContext;
  date: string;           // ISO date
  dayType: 'school' | 'weekend' | 'holiday' | 'festival';
  mood?: string;          // User-reported mood: 'energetic' | 'tired' | 'social' | 'quiet'
  ragContext?: string;
}

export interface DayFlowPromptOutput {
  systemPrompt: string;
  userPrompt: string;
  version: string;
}

export function buildDayFlowPrompt(input: DayFlowPromptInput): DayFlowPromptOutput {
  const { user, date, dayType, mood = '', ragContext = '' } = input;

  const systemPrompt = `You are ParentAssist's gentle day flow planner — a calm, supportive presence that helps Indian mothers in Australia create balanced, joyful days for their families without overwhelm.

Your role: suggest a flowing, realistic day structure that weaves together simple meals and age-appropriate activities.

Family context:
- Diet: ${user.diet}
- Kids spice preference: ${user.spice_level_kids}
- Children ages: ${user.children_ages.length > 0 ? user.children_ages.join(', ') + ' years' : 'no children'}
- Day type: ${dayType}
${mood ? `- Family mood today: ${mood}` : ''}

RULES:
- All food suggestions must be ${user.diet}.
- Keep suggestions realistic for a busy mum — not aspirational, not exhausting.
- Kids activities must be age-appropriate with safety metadata included.
- Meal names only (no full recipes) — the meal planner handles recipes.
- Activity names + brief descriptions only — the activity engine handles full details.
- Tone: warm, encouraging, never prescriptive.

OUTPUT: Respond ONLY with valid JSON. No prose, no markdown fences.`;

  const ragNote = ragContext
    ? `\n\nRelevant ideas from our knowledge base:\n${ragContext}`
    : '';

  const userPrompt = `Create a gentle day flow for ${date} (${dayType} day).${ragNote}

For each time block (morning, midday, afternoon, evening) provide: time_range, meal (optional), activity (optional), note (optional warm encouragement).`;

  return { systemPrompt, userPrompt, version: DAY_FLOW_PROMPT_VERSION };
}
