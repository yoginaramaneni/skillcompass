import { queryDatabase } from '../db';
import { DbAssessment, DbAssessmentQuestion, DbAssessmentAnswer } from '../types/db.types';
import { resolveSkillUuid } from './skill.repository';

const isUuid = (val?: string | null): boolean => {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
};

export class AssessmentsRepository {
  async getUserAssessments(userId: string): Promise<DbAssessment[]> {
    const result = await queryDatabase(
      `SELECT id, user_id, skill_id, claimed_level, status, score, started_at, completed_at, created_at
       FROM assessments WHERE user_id = $1 ORDER BY started_at DESC`,
      [userId]
    );
    return result.rows;
  }

  async createAssessment(data: Partial<DbAssessment>): Promise<DbAssessment> {
    const validSkillUuid = data.skill_id ? await resolveSkillUuid(data.skill_id) : null;
    const result = await queryDatabase(
      `INSERT INTO assessments (user_id, skill_id, claimed_level, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.user_id, validSkillUuid, data.claimed_level || null, data.status || 'in_progress']
    );
    return result.rows[0];
  }

  async getQuestionsByAssessment(assessmentId: string): Promise<DbAssessmentQuestion[]> {
    if (!isUuid(assessmentId)) return [];
    const result = await queryDatabase(
      `SELECT id, assessment_id, question_number, question_text, question_type, options, difficulty, created_at
       FROM assessment_questions WHERE assessment_id = $1 ORDER BY question_number ASC`,
      [assessmentId]
    );
    return result.rows;
  }

  async saveAnswer(answerData: Partial<DbAssessmentAnswer>): Promise<DbAssessmentAnswer | null> {
    if (!isUuid(answerData.assessment_id) || !isUuid(answerData.question_id)) {
      return null;
    }
    const result = await queryDatabase(
      `INSERT INTO assessment_answers (assessment_id, question_id, user_answer, is_correct, score)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (assessment_id, question_id) DO UPDATE SET
         user_answer = EXCLUDED.user_answer,
         is_correct = EXCLUDED.is_correct,
         score = EXCLUDED.score
       RETURNING *`,
      [answerData.assessment_id, answerData.question_id, answerData.user_answer || null, answerData.is_correct ?? null, answerData.score ?? null]
    );
    return result.rows[0];
  }
}

export const assessmentsRepository = new AssessmentsRepository();
