import pg from 'pg';
import { config, hasDatabaseConfig } from '../config/env';
import { logger } from '../utils/logger';

const { Pool } = pg;

export const getSanitizedDatabaseUrl = (): string => {
  if (!config.databaseUrl) return '';

  let url = config.databaseUrl.trim();

  // Strip literal square brackets around password if present (e.g. postgres:[pass]@host -> postgres:pass@host)
  url = url.replace(/:\[([^\]]+)\]@/, ':$1@');

  return url;
};

const sanitizedUrl = getSanitizedDatabaseUrl();

const poolConfig = hasDatabaseConfig && sanitizedUrl
  ? {
      connectionString: sanitizedUrl,
      ssl:
        config.nodeEnv === 'production' ||
        sanitizedUrl.includes('supabase') ||
        !sanitizedUrl.includes('localhost')
          ? { rejectUnauthorized: false }
          : false,
      connectionTimeoutMillis: 10000,
    }
  : undefined;

// Supabase PostgreSQL Pool Foundation
export const dbPool = poolConfig ? new Pool(poolConfig) : null;

if (dbPool) {
  dbPool.on('error', (err) => {
    logger.error('Unexpected Supabase PostgreSQL client pool error:', err.message);
  });
}

export const queryDatabase = async (text: string, params?: any[]) => {
  if (!dbPool || !hasDatabaseConfig) {
    throw new Error(
      'DATABASE_URL is not configured. Set your Supabase PostgreSQL connection string in server/.env before querying the database.'
    );
  }

  const start = Date.now();
  try {
    const res = await dbPool.query(text, params);
    const duration = Date.now() - start;
    logger.info(`Executed query (${duration}ms): ${text.substring(0, 50)}...`);
    return res;
  } catch (err: any) {
    logger.error(`Database query failure: ${text.substring(0, 60)}... - ${err.message}`);
    throw err;
  }
};
