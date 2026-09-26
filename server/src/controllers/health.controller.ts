import { Request, Response } from 'express';
import { dbPool } from '../db';
import { config, hasDatabaseConfig } from '../config/env';

export const getHealth = async (req: Request, res: Response) => {
  if (!config.databaseUrl || !hasDatabaseConfig || !dbPool) {
    return res.status(200).json({
      success: true,
      server: 'healthy',
      database: 'disconnected',
      message: 'Database configuration is pending. Set your valid Supabase DATABASE_URL in server/.env.',
    });
  }

  try {
    await dbPool.query('SELECT 1');
    return res.status(200).json({
      success: true,
      server: 'healthy',
      database: 'connected',
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      server: 'healthy',
      database: 'disconnected',
      message: 'Database connection unavailable.',
    });
  }
};
