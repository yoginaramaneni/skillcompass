import { CorsOptions } from 'cors';
import { config } from './env';

const ALLOWED_PRODUCTION_ORIGIN = 'https://skillcompass-fohuio07q-acme-faa6.vercel.app';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman, health checks)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      config.clientUrl,
      process.env.CLIENT_URL,
      ALLOWED_PRODUCTION_ORIGIN,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ].filter((url): url is string => Boolean(url && url.trim() !== '' && url !== '*'));

    if (allowedOrigins.includes(origin) || (config.nodeEnv === 'development' && origin.startsWith('http://localhost'))) {
      return callback(null, true);
    }

    callback(new Error(`CORS policy blocked access from origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
