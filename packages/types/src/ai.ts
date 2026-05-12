import type { SupervisionLevel } from '@parentassist/config';

/** Standard wrapper for every AI API response */
export interface AIResponse<T> {
  data: T;
  model: string;
  prompt_version: string;
  cached: boolean;
  latency_ms: number;
}

/** Every kids-adjacent AI output must carry these fields */
export interface KidsSafetyMetadata {
  ageMin: number;
  ageMax: number;
  supervisionLevel: SupervisionLevel;
  safetyNote: string;
}

/** Structured error returned by all AI routes */
export interface AIError {
  code: 'rate_limited' | 'paywall' | 'moderation_fail' | 'provider_error' | 'validation_error';
  message: string;
  retryAfterSeconds?: number;
}

/** Zod-validated output from validateAIOutput() in services/moderation.ts */
export interface ValidatedAIOutput<T> {
  valid: boolean;
  data?: T;
  violations: string[];
}
