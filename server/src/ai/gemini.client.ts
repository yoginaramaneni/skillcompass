import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/apiError';

let aiInstance: GoogleGenAI | null = null;

export const getGeminiClient = (): GoogleGenAI => {
  if (!config.geminiApiKey) {
    logger.error('GEMINI_API_KEY is missing from backend environment variables.');
    throw new ApiError(500, 'Gemini API key is not configured on the server.');
  }

  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }
  return aiInstance;
};

