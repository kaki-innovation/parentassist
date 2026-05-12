/**
 * subscriptionGate — checks whether a user is allowed to perform an AI action.
 * Registers as a Fastify preHandler on every AI route.
 * Session 3+ will wire this to Supabase subscriptions table.
 */

import type { FastifyRequest, FastifyReply } from 'fastify';
import type { PremiumAction } from '@parentassist/types';

export async function subscriptionGate(
  request: FastifyRequest<{ Body: { userId?: string; action?: PremiumAction } }>,
  reply: FastifyReply
): Promise<void> {
  // TODO (Session 3): implement real subscription check via Supabase
  // For now: allow all requests in development
  if (process.env['NODE_ENV'] !== 'production') {
    return;
  }

  const { userId, action } = request.body ?? {};
  if (!userId || !action) {
    await reply.code(400).send({ error: 'userId and action are required' });
    return;
  }

  // Real check implemented in Session 3
}
