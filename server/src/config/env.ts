import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
};

export const isProduction = config.nodeEnv === 'production';

// Check if database URL is configured with a valid connection string (not empty or default placeholder)
export const hasDatabaseConfig = Boolean(
  config.databaseUrl &&
    config.databaseUrl.trim() !== '' &&
    !config.databaseUrl.includes('YOUR_SUPABASE_POSTGRES_CONNECTION_STRING')
);

// Check if JWT secret is configured (not empty or default placeholder)
export const hasJwtSecret = Boolean(
  config.jwtSecret &&
    config.jwtSecret.trim() !== '' &&
    !config.jwtSecret.includes('YOUR_JWT_SECRET')
);
