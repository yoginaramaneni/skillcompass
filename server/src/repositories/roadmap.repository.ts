import { queryDatabase } from '../db';
import { DbLearningRoadmap, DbRoadmapItem, DbLearningPlanTask } from '../types/db.types';

export class RoadmapRepository {
  async getUserRoadmaps(userId: string): Promise<DbLearningRoadmap[]> {
    const result = await queryDatabase(
      `SELECT id, user_id, career_role_id, title, description, status, target_date, created_at, updated_at
       FROM learning_roadmaps WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  async getRoadmapItems(roadmapId: string): Promise<DbRoadmapItem[]> {
    const result = await queryDatabase(
      `SELECT id, roadmap_id, skill_id, title, description, sequence_number, estimated_hours, status, created_at, updated_at
       FROM roadmap_items WHERE roadmap_id = $1 ORDER BY sequence_number ASC`,
      [roadmapId]
    );
    return result.rows;
  }

  async getUserPlanTasks(userId: string, date: string): Promise<DbLearningPlanTask[]> {
    const result = await queryDatabase(
      `SELECT id, user_id, roadmap_item_id, task_date, title, description, estimated_minutes, status, completed_at, created_at, updated_at
       FROM learning_plan_tasks WHERE user_id = $1 AND task_date = $2 ORDER BY created_at ASC`,
      [userId, date]
    );
    return result.rows;
  }
}

export const roadmapRepository = new RoadmapRepository();
