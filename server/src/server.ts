import app from './app';
import { config } from './config/env';
import { dbPool } from './db';
import { logger } from './utils/logger';

if (!config.databaseUrl) {
  logger.warn('DATABASE_URL is not configured. Set the Supabase PostgreSQL connection string before starting database-backed features.');
}

const PORT = parseInt(String(process.env.PORT || config.port || 5000), 10);

const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`==================================================`);
  logger.info(`  SkillCompass Backend API Server Running`);
  logger.info(`  Environment: ${config.nodeEnv}`);
  logger.info(`  Server running on port ${PORT}`);
  logger.info(`  Health Check: http://localhost:${PORT}/api/health`);
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
