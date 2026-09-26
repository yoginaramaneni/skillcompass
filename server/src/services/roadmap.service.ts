import { getGeminiClient } from '../ai/gemini.client';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/apiError';
import { buildSkillIntelligenceContext } from '../ai/context-builder';
import { ROADMAP_SYSTEM_PROMPT, createRoadmapPrompt } from '../ai/prompts/roadmap.prompt';
import { learningRoadmapSchema, LearningRoadmap, RoadmapItem } from '../schemas/roadmap.schema';
import { aiGenerationsRepository } from '../repositories/aiGenerations.repository';

// In-memory cache for roadmap persistence in dev mode
const userRoadmapsCache = new Map<string, LearningRoadmap>();

export class RoadmapService {
  async generateRoadmap(userId: string): Promise<LearningRoadmap> {
    const context = await buildSkillIntelligenceContext(userId);

    if (!context.demonstratedSkills || context.demonstratedSkills.length === 0) {
      throw new ApiError(
        400,
        'Please complete your profile by adding at least 1 demonstrated skill before generating a Learning Roadmap.'
      );
    }

    const ai = getGeminiClient();
    const prompt = createRoadmapPrompt(context);

    logger.info(`Invoking Gemini (${config.geminiModel}) for user roadmap ${userId}`);

    try {
      const response = await ai.models.generateContent({
        model: config.geminiModel,
        contents: prompt,
        config: {
          systemInstruction: ROADMAP_SYSTEM_PROMPT,
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
        throw new ApiError(500, 'Gemini returned an empty response for roadmap.');
      }

      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(cleanedText);
      } catch (parseErr) {
        logger.error('Failed to parse Gemini Roadmap JSON:', rawText);
        throw new ApiError(500, 'Failed to parse AI output into structured Roadmap JSON.');
      }

      const validatedOutput = learningRoadmapSchema.parse(parsedJson);

      const timestamp = new Date().toISOString();
      const roadmapId = `rdm-${Date.now()}`;
      const finalRoadmap: LearningRoadmap = {
        ...validatedOutput,
        id: roadmapId,
        createdAt: timestamp,
        items: validatedOutput.items.map((item, idx) => ({
          ...item,
          id: item.id || `item-${idx + 1}`,
          sequenceNumber: idx + 1,
          status: item.status || 'pending',
        })),
      };

      // Save to database audit store
      try {
        await aiGenerationsRepository.logGeneration({
          userId,
          generationType: 'LEARNING_ROADMAP',
          inputContext: context,
          outputJson: finalRoadmap,
          model: config.geminiModel,
        });
      } catch (dbErr) {
        logger.warn('Could not persist roadmap to database, using memory cache:', dbErr);
      }

      userRoadmapsCache.set(userId, finalRoadmap);
      return finalRoadmap;
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode < 500) throw error;
      logger.warn('Gemini API temporary error, generating deterministic fallback roadmap:', error?.message || error);

      // Deterministic fallback if Gemini is temporarily unavailable
      const fallbackRoadmap = this.generateDeterministicFallbackRoadmap(context);
      try {
        await aiGenerationsRepository.logGeneration({
          userId,
          generationType: 'LEARNING_ROADMAP',
          inputContext: context,
          outputJson: fallbackRoadmap,
          model: `${config.geminiModel}-fallback`,
        });
      } catch (err) {}

      userRoadmapsCache.set(userId, fallbackRoadmap);
      return fallbackRoadmap;
    }
  }

  private generateDeterministicFallbackRoadmap(context: any): LearningRoadmap {
    const targetRole = context.targetRole?.title || context.user?.targetCareerRole || 'Software Engineer';
    const gaps = context.deterministicGaps || [];

    const items: RoadmapItem[] = gaps.map((gap: any, idx: number) => ({
      id: `item-${idx + 1}`,
      sequenceNumber: idx + 1,
      title: `Master ${gap.skillName} Core Concepts`,
      skillName: gap.skillName,
      priority: (gap.importance === 'critical' ? 'critical' : gap.importance === 'high' ? 'high' : 'medium') as any,
      whyToLearn: `${gap.skillName} is required for ${targetRole} with target level ${gap.requiredLevel}.`,
      estimatedHours: Math.max(10, gap.gap * 8),
      practiceTasks: [
        `Study ${gap.skillName} documentation and core patterns`,
        `Build a hands-on project module implementing ${gap.skillName}`,
        `Take SkillCompass skill assessment to earn verified status`
      ],
      status: 'pending' as const,
    }));

    const defaultItems: RoadmapItem[] = [
      {
        id: 'item-1',
        sequenceNumber: 1,
        title: `${targetRole} Core Competencies`,
        skillName: 'System Architecture',
        priority: 'high',
        whyToLearn: `Core architectural principles required for ${targetRole}.`,
        estimatedHours: 20,
        practiceTasks: ['Architect full-stack software application', 'Implement REST API integration'],
        status: 'pending',
      }
    ];

    const finalItems = items.length > 0 ? items : defaultItems;
    const totalHours = finalItems.reduce((acc, it) => acc + it.estimatedHours, 0);

    return {
      id: `rdm-${Date.now()}`,
      title: `${targetRole} Mastery Path`,
      description: `Structured curriculum tailored to address your identified skill gaps for ${targetRole}.`,
      targetCareerRole: targetRole,
      totalEstimatedHours: totalHours,
      items: finalItems,
      createdAt: new Date().toISOString(),
    };
  }

  async getLatestRoadmap(userId: string): Promise<LearningRoadmap | null> {
    try {
      const logs = await aiGenerationsRepository.getUserGenerations(userId, 'LEARNING_ROADMAP');
      if (logs && logs.length > 0 && logs[0].output_json) {
        const json = typeof logs[0].output_json === 'string'
          ? JSON.parse(logs[0].output_json)
          : logs[0].output_json;
        return learningRoadmapSchema.parse(json);
      }
    } catch (err) {
      logger.warn('Failed to fetch roadmap from database, checking fallback cache:', err);
    }

    return userRoadmapsCache.get(userId) || null;
  }

  async updateItemStatus(userId: string, itemId: string, status: 'pending' | 'in_progress' | 'completed' | 'skipped'): Promise<LearningRoadmap> {
    let roadmap = await this.getLatestRoadmap(userId);

    if (!roadmap) {
      throw new ApiError(404, 'No active learning roadmap found.');
    }

    const itemIndex = roadmap.items.findIndex(
      (it) => it.id === itemId || `item-${it.sequenceNumber}` === itemId
    );

    if (itemIndex === -1) {
      throw new ApiError(404, `Roadmap item ${itemId} not found.`);
    }

    roadmap.items[itemIndex].status = status;

    // Update in-memory cache
    userRoadmapsCache.set(userId, roadmap);

    // Save updated state to audit store if available
    try {
      await aiGenerationsRepository.logGeneration({
        userId,
        generationType: 'LEARNING_ROADMAP',
        inputContext: { updatedItemId: itemId, newStatus: status },
        outputJson: roadmap,
        model: config.geminiModel,
      });
    } catch (err) {}

    return roadmap;
  }
}

export const roadmapService = new RoadmapService();
