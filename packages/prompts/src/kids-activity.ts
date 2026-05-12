/**
 * Kids activity prompt — generates age-appropriate activity suggestions.
 *
 * SAFETY NOTE: All outputs go through validateAIOutput() in services/moderation.ts
 * before being rendered. This prompt is defence-in-depth, not the only safety layer.
 *
 * PROMPT_VERSION: bump on any edit to system or user prompt text.
 */

import type { AnonymisedUserContext } from '@parentassist/types';
import type { FestivalId } from '@parentassist/config';

export const KIDS_ACTIVITY_PROMPT_VERSION = '1.0.0';

export interface KidsActivityPromptInput {
  user: AnonymisedUserContext;
  targetAges: number[];           // Ages of children to plan for
  count: number;                  // How many suggestions to generate
  festivalId?: FestivalId;        // If scoped to a festival
  indoorOutdoor?: 'indoor' | 'outdoor' | 'both';
  durationMax?: number;           // Max activity duration in minutes
  ragContext?: string;
}

export interface KidsActivityPromptOutput {
  systemPrompt: string;
  userPrompt: string;
  version: string;
}

export function buildKidsActivityPrompt(input: KidsActivityPromptInput): KidsActivityPromptOutput {
  const {
    user,
    targetAges,
    count,
    festivalId,
    indoorOutdoor = 'both',
    durationMax = 60,
    ragContext = '',
  } = input;

  const minAge = Math.min(...targetAges);
  const maxAge = Math.max(...targetAges);

  const systemPrompt = `You are ParentAssist's kids activity specialist — creative, safety-conscious, and deeply familiar with Indian cultural celebrations and Australian family life.

Your role: suggest engaging, age-appropriate activities for children of Indian families living in Australia.

Children's ages: ${targetAges.join(', ')} years (min: ${minAge}, max: ${maxAge})
Preference: ${indoorOutdoor} activities, max ${durationMax} minutes

ABSOLUTE SAFETY RULES — NEVER VIOLATE:
1. NEVER suggest fire, flames, candles, or matches for children under 12.
2. NEVER suggest small parts (beads < 1cm, coins, buttons) for children under 5.
3. NEVER suggest scissors, knives, or sharp tools for children under 8 without adult_only supervision flag.
4. ALWAYS include supervisionLevel, safetyNote, ageMin, and ageMax in every activity output.
5. When unsure about safety: default to MORE supervision, never less.
6. ageMin must reflect the youngest child who can safely participate.

${minAge < 5 ? 'SPECIAL: Some children are under 5. Apply choking hazard rules strictly.' : ''}
${minAge < 12 ? 'SPECIAL: Some children are under 12. No fire or flames — this includes Diwali diyas unless adult_only.' : ''}

OUTPUT: Respond ONLY with valid JSON array of activity objects. No prose, no markdown.`;

  const festivalNote = festivalId
    ? `\nTheme: activities should connect to the ${festivalId} festival.`
    : '';

  const ragNote = ragContext
    ? `\n\nRelevant activity ideas from our knowledge base:\n${ragContext}`
    : '';

  const userPrompt = `Generate ${count} activity suggestion${count > 1 ? 's' : ''} for children aged ${minAge}–${maxAge}.${festivalNote}${ragNote}

Each activity must include: name, description, duration_minutes, materials (array), steps (array with step + instruction), tags (array), safety (object with ageMin, ageMax, supervisionLevel, safetyNote), image_query.`;

  return { systemPrompt, userPrompt, version: KIDS_ACTIVITY_PROMPT_VERSION };
}
