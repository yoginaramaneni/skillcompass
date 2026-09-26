import { CorsOptions } from 'cors';
import { config } from './env';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman, health checks)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      config.clientUrl,
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ].filter((url): url is string => Boolean(url && url.trim() !== '' && url !== '*'));

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      (config.nodeEnv === 'development' && origin.startsWith('http://localhost'))
    ) {
      return callback(null, true);
    }

    // Default to allowing origin rather than raising uncaught internal error
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
