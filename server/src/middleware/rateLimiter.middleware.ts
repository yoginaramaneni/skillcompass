import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const memoryStore: RateLimitStore = {};

/**
 * Higher-order middleware function to create rate limiters
 * @param windowMs Time window in milliseconds (e.g. 15 * 60 * 1000 for 15 minutes)
 * @param maxRequests Maximum requests allowed per IP within the window
 * @param message Custom message on rate limit exceeded
 */
export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000,
  maxRequests: number = 100,
  message: string = 'Too many requests from this IP, please try again later.'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Disable rate limiting during test executions
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const key = `${req.baseUrl || ''}${req.path}:${ip}`;
    const now = Date.now();

    if (!memoryStore[key] || memoryStore[key].resetTime <= now) {
      memoryStore[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    memoryStore[key].count += 1;

    if (memoryStore[key].count > maxRequests) {
      const retryAfterSeconds = Math.ceil((memoryStore[key].resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return next(new ApiError(429, message, 'RATE_LIMIT_EXCEEDED'));
    }

    next();
  };
};

// Pre-configured rate limiters for expensive endpoints
export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 mins
  20,             // max 20 auth attempts per IP per 15 mins
  'Too many login/registration attempts. Please wait 15 minutes.'
);

export const aiRateLimiter = createRateLimiter(
  5 * 60 * 1000,  // 5 mins
  10,             // max 10 AI generations per IP per 5 mins
  'AI generation limit reached. Please wait 5 minutes before generating new AI results.'
);
