import { runMigrations } from '../db/runMigrations';
import { seedReferenceData } from './referenceData.seed';
import { logger } from '../utils/logger';

const run = async () => {
  try {
    logger.info('Running database migrations...');
    await runMigrations();
    
    logger.info('Running reference data seeders...');
    await seedReferenceData();

    logger.info('Database migration & seed execution finished successfully.');
    process.exit(0);
  } catch (err) {
    logger.error('Error during database migration/seed execution:', err);
    process.exit(1);
  }
};

run();
