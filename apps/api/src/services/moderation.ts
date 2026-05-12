/**
 * validateAIOutput — safety gate for all AI-generated content involving children.
 * Every kids activity and festival plan output runs through this before returning to client.
 *
 * SAFETY RULES (must mirror CLAUDE.md SAFETY_POLICY):
 * - No fire/flames for children under 12
 * - No small parts for children under 5
 * - No sharp implements for children under 8 without adult_only supervision
 * - supervisionLevel, safetyNote, ageMin, ageMax must be present
 */

import { z } from 'zod';
import type { ValidatedAIOutput } from '@parentassist/types';
import { SAFETY } from '@parentassist/config';

const KidsSafetySchema = z.object({
  ageMin: z.number().int().min(0).max(18),
  ageMax: z.number().int().min(0).max(18),
  supervisionLevel: z.enum(['independent', 'light', 'active', 'adult_only']),
  safetyNote: z.string().min(1),
});

const FIRE_KEYWORDS = ['fire', 'flame', 'candle', 'diya', 'match', 'lighter', 'burn', 'torch'];
const SHARP_KEYWORDS = ['knife', 'scissors', 'blade', 'cutter', 'skewer'];
const SMALL_PARTS_KEYWORDS = ['bead', 'button', 'coin', 'marble', 'small piece', 'tiny'];

export function validateAIOutput<T extends { safety?: unknown }>(
  data: T,
  childAges: number[]
): ValidatedAIOutput<T> {
  const violations: string[] = [];
  const minAge = childAges.length > 0 ? Math.min(...childAges) : 99;

  // Validate safety metadata is present when kids are involved
  if (childAges.length > 0 && 'safety' in data) {
    const safetyResult = KidsSafetySchema.safeParse(data.safety);
    if (!safetyResult.success) {
      violations.push('Missing or invalid safety metadata (ageMin, ageMax, supervisionLevel, safetyNote required)');
    }
  }

  // Convert data to string for keyword scanning
  const contentStr = JSON.stringify(data).toLowerCase();

  // Fire check
  if (minAge < SAFETY.MIN_AGE_FIRE) {
    const fireFound = FIRE_KEYWORDS.find((kw) => contentStr.includes(kw));
    if (fireFound) {
      violations.push(`Fire/flame content detected ("${fireFound}") — not allowed for children under ${SAFETY.MIN_AGE_FIRE}`);
    }
  }

  // Small parts check
  if (minAge < SAFETY.MAX_AGE_CHOKING_HAZARD) {
    const smallPartFound = SMALL_PARTS_KEYWORDS.find((kw) => contentStr.includes(kw));
    if (smallPartFound) {
      violations.push(`Small parts content detected ("${smallPartFound}") — choking hazard for children under ${SAFETY.MAX_AGE_CHOKING_HAZARD}`);
    }
  }

  // Sharp implements check — allow if adult_only
  if (minAge < SAFETY.MIN_AGE_SHARP_IMPLEMENTS) {
    const sharpFound = SHARP_KEYWORDS.find((kw) => contentStr.includes(kw));
    const isAdultOnly =
      typeof data.safety === 'object' &&
      data.safety !== null &&
      'supervisionLevel' in data.safety &&
      data.safety.supervisionLevel === 'adult_only';

    if (sharpFound && !isAdultOnly) {
      violations.push(`Sharp implement detected ("${sharpFound}") without adult_only supervision — not allowed for children under ${SAFETY.MIN_AGE_SHARP_IMPLEMENTS}`);
    }
  }

  return {
    valid: violations.length === 0,
    data: violations.length === 0 ? data : undefined,
    violations,
  };
}
