import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors';
import apiRoutes from './routes/index';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';

import { getHealth } from './controllers/health.controller';

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development)
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Root & Health Check Endpoints
app.get('/', getHealth);
app.get('/health', getHealth);

// API Routes
app.use('/api', apiRoutes);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
