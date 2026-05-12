import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

const app = Fastify({
  logger: {
    level: process.env['NODE_ENV'] === 'production' ? 'warn' : 'info',
  },
});

async function main() {
  await app.register(helmet);
  await app.register(cors, {
    origin: process.env['ALLOWED_ORIGINS']?.split(',') ?? ['http://localhost:8081'],
  });
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Health check — Railway uses this
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // AI routes (stubbed — implemented Session 3+)
  app.get('/api/v1', async () => ({ message: 'ParentAssist API v1' }));

  const port = Number(process.env['PORT'] ?? 3001);
  const host = process.env['HOST'] ?? '0.0.0.0';

  await app.listen({ port, host });
  console.log(`ParentAssist API running on http://${host}:${port}`);
}

main().catch((err) => {
  console.error('Failed to start API:', err);
  process.exit(1);
});
