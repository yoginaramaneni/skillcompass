import { getGeminiClient } from './gemini.client';
import { logger } from '../utils/logger';

export class GeminiService {
  /**
   * Basic Gemini AI Foundation Service Method.
   * Business-specific prompts and structured outputs will be implemented in subsequent steps.
   */
  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      return response.text || '';
    } catch (error) {
      logger.error('Error invoking Gemini API:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
