import app from './app';
import { config } from './config/env';
import { dbPool } from './db';
import { logger } from './utils/logger';

if (!config.databaseUrl) {
  logger.warn('DATABASE_URL is not configured. Set the Supabase PostgreSQL connection string before starting database-backed features.');
}

const server = app.listen(config.port, () => {
  logger.info(`==================================================`);
  logger.info(`  SkillCompass Backend API Server Running`);
  logger.info(`  Environment: ${config.nodeEnv}`);
  logger.info(`  URL: http://localhost:${config.port}`);
  logger.info(`  Health Check: http://localhost:${config.port}/api/health`);
  logger.info(`==================================================`);
});

const shutdown = () => {
  logger.info('Shutdown signal received: closing HTTP server');
  server.close(async () => {
    if (dbPool) {
      await dbPool.end();
    }
    logger.info('HTTP server and database pool closed');
    process.exit(0);
  });
};

// Graceful Shutdown Handlers
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
