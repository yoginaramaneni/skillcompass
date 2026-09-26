import fs from 'fs';
import path from 'path';
import { queryDatabase, dbPool } from './index';
import { logger } from '../utils/logger';

export const runMigrations = async () => {
  logger.info('Starting Supabase PostgreSQL database schema migrations...');

  if (!dbPool) {
    throw new Error('DATABASE_URL is not configured. Set your Supabase connection string in server/.env before running migrations.');
  }

  const migrationFilePath = path.resolve(__dirname, '../../migrations/002_production_schema.sql');
  if (!fs.existsSync(migrationFilePath)) {
    throw new Error(`Migration SQL file not found at: ${migrationFilePath}`);
  }

  const sqlContent = fs.readFileSync(migrationFilePath, 'utf8');

  // Execute full production schema SQL
  await queryDatabase(sqlContent);
  logger.info('Successfully executed 002_production_schema.sql DDL statements.');

  // Verify core tables exist in PostgreSQL information_schema
  const verificationResult = await queryDatabase(
    `SELECT table_name 
     FROM information_schema.tables 
     WHERE table_schema = 'public' 
     ORDER BY table_name ASC`
  );

  const tableNames = verificationResult.rows.map((row: any) => row.table_name);
  logger.info(`Verified ${tableNames.length} tables in public schema: ${tableNames.join(', ')}`);

  if (!tableNames.includes('users')) {
    throw new Error('Migration failed: "users" table was not created.');
  }

  return tableNames;
};

// If executed directly via CLI: npx ts-node src/db/runMigrations.ts
if (require.main === module) {
  runMigrations()
    .then((tables) => {
      console.log(`🎉 Migrations completed successfully! Created/verified ${tables.length} tables.`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Migration failed:', err.message);
      process.exit(1);
    });
}
