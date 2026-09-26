import { queryDatabase } from '../db';
import { DbAiGeneration } from '../types/db.types';

export class AiGenerationsRepository {
  async logGeneration(data: {
    userId: string;
    generationType: string;
    inputContext?: any;
    outputJson?: any;
    model?: string;
  }): Promise<DbAiGeneration> {
    const result = await queryDatabase(
      `INSERT INTO ai_generations (user_id, generation_type, input_context, output_json, model)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, generation_type, input_context, output_json, model, created_at`,
      [
        data.userId,
        data.generationType,
        data.inputContext ? JSON.stringify(data.inputContext) : null,
        data.outputJson ? JSON.stringify(data.outputJson) : null,
        data.model || null,
      ]
    );
    return result.rows[0];
  }

  async getUserGenerations(userId: string, generationType?: string): Promise<DbAiGeneration[]> {
    if (generationType) {
      const result = await queryDatabase(
        `SELECT id, user_id, generation_type, input_context, output_json, model, created_at
         FROM ai_generations WHERE user_id = $1 AND generation_type = $2 ORDER BY created_at DESC`,
        [userId, generationType]
      );
      return result.rows;
    }
    const result = await queryDatabase(
      `SELECT id, user_id, generation_type, input_context, output_json, model, created_at
       FROM ai_generations WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }
}

export const aiGenerationsRepository = new AiGenerationsRepository();
