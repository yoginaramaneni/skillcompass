import { getGeminiClient } from './gemini.client';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/apiError';
import { buildSkillIntelligenceContext } from './context-builder';
import {
  SKILL_INTELLIGENCE_SYSTEM_PROMPT,
  createSkillIntelligencePrompt,
} from './prompts/skill-intelligence.prompt';
import {
  skillIntelligenceResponseSchema,
  SkillIntelligenceResponse,
} from '../schemas/ai.schema';
import { aiGenerationsRepository } from '../repositories/aiGenerations.repository';

// In-memory fallback cache for development when database persistence is inactive
const latestGenerationsCache = new Map<string, SkillIntelligenceResponse>();

export class SkillIntelligenceService {
  async generateAnalysis(userId: string): Promise<SkillIntelligenceResponse> {
    const context = await buildSkillIntelligenceContext(userId);

    // Profile Completeness Validation: Requires demonstrated skills
    if (!context.demonstratedSkills || context.demonstratedSkills.length === 0) {
      throw new ApiError(
        400,
        'Please complete your profile by adding at least 1 demonstrated skill before generating AI Skill Intelligence.'
      );
    }

    const ai = getGeminiClient();
    const prompt = createSkillIntelligencePrompt(context);

    logger.info(`Invoking Gemini (${config.geminiModel}) for user ${userId}`);

    try {
      const response = await ai.models.generateContent({
        model: config.geminiModel,
        contents: prompt,
        config: {
          systemInstruction: SKILL_INTELLIGENCE_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text || '';
      const cleanedText = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      if (!cleanedText) {
        throw new ApiError(500, 'Gemini returned an empty response.');
      }

      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(cleanedText);
      } catch (parseErr) {
        logger.error('Failed to parse Gemini JSON output:', rawText);
        throw new ApiError(500, 'Failed to parse AI output into structured JSON.');
      }

      // Zod Validation
      const validatedOutput = skillIntelligenceResponseSchema.parse(parsedJson);

      // Attach createdAt timestamp
      const timestamp = new Date().toISOString();
      const responseWithTimestamp = {
        ...validatedOutput,
        createdAt: timestamp,
      };

      // Save to Database Audit Store
      try {
        await aiGenerationsRepository.logGeneration({
          userId,
          generationType: 'SKILL_INTELLIGENCE',
          inputContext: context,
          outputJson: responseWithTimestamp,
          model: config.geminiModel,
        });
      } catch (dbErr) {
        logger.warn('Could not persist AI generation to database, using memory cache:', dbErr);
      }

      // Update in-memory fallback cache
      latestGenerationsCache.set(userId, responseWithTimestamp);

      return responseWithTimestamp;
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode < 500) {
        throw error;
      }
      logger.warn('Gemini API temporary error, generating deterministic fallback analysis:', error?.message || error);

      const fallbackAnalysis = this.generateDeterministicFallbackAnalysis(context);
      try {
        await aiGenerationsRepository.logGeneration({
          userId,
          generationType: 'SKILL_INTELLIGENCE',
          inputContext: context,
          outputJson: fallbackAnalysis,
          model: `${config.geminiModel}-fallback`,
        });
      } catch (err) {}

      latestGenerationsCache.set(userId, fallbackAnalysis);
      return fallbackAnalysis;
    }
  }

  private generateDeterministicFallbackAnalysis(context: any): SkillIntelligenceResponse {
    const targetRole = context.targetRole?.title || context.user?.targetCareerRole || 'Software Engineer';
    const readiness = context.calculatedReadiness ?? 50;

    const skillGaps = (context.deterministicGaps || []).map((gap: any) => ({
      skillName: gap.skillName,
      currentLevel: gap.currentLevel,
      requiredLevel: gap.requiredLevel,
      gap: gap.gap,
      importance: gap.importance,
      explanation: `${gap.skillName} is required for ${targetRole}.`,
    }));

    const recommendedSkills = (context.deterministicGaps || []).slice(0, 3).map((gap: any) => ({
      skillName: gap.skillName,
      category: 'Technical',
      priority: gap.importance,
      reason: `High priority skill gap for ${targetRole}.`,
      currentLevel: gap.currentLevel,
      targetLevel: gap.requiredLevel,
      skillGap: gap.gap,
    }));

    return {
      summary: `You are currently ${readiness}% aligned with target career role ${targetRole}. Focus on closing high-priority skill gaps.`,
      careerReadiness: readiness,
      skillGaps: skillGaps.length > 0 ? skillGaps : [],
      recommendedSkills: recommendedSkills.length > 0 ? recommendedSkills : [],
      emergingSkills: [
        {
          skillName: 'Generative AI & LLMs',
          category: 'Artificial Intelligence',
          relevance: 'High industry adoption',
          reason: 'Rapidly growing market demand across software engineering roles.',
        }
      ],
      nextSteps: [
        'Complete skill assessments to elevate self-reported skills to verified status.',
        'Follow your personalized learning roadmap to close identified skill gaps.',
      ],
      createdAt: new Date().toISOString(),
    };
  }

  async getLatestAnalysis(userId: string): Promise<SkillIntelligenceResponse | null> {
    try {
      const logs = await aiGenerationsRepository.getUserGenerations(userId, 'SKILL_INTELLIGENCE');
      if (logs && logs.length > 0 && logs[0].output_json) {
        const json = typeof logs[0].output_json === 'string'
          ? JSON.parse(logs[0].output_json)
          : logs[0].output_json;
        const parsed = skillIntelligenceResponseSchema.parse(json);
        return {
          ...parsed,
          createdAt: parsed.createdAt || logs[0].created_at || new Date().toISOString(),
        };
      }
    } catch (err) {
      logger.warn('Failed to fetch AI generation from database, checking fallback cache:', err);
    }

    return latestGenerationsCache.get(userId) || null;
  }
}

export const skillIntelligenceService = new SkillIntelligenceService();
