import { randomUUID } from 'crypto';
import { assessmentsRepository } from '../repositories/assessments.repository';
import { skillsRepository, STATIC_SKILLS_REFERENCE } from '../repositories/skill.repository';
import { QUESTION_BANK, SeedQuestion } from '../seeds/assessmentQuestions.seed';
import { scoreToVerifiedLevel, levelToNumber } from '../utils/skillLevel';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { DbAssessment, DbAssessmentQuestion } from '../types/db.types';

export interface ActiveAssessmentSession {
  assessmentId: string;
  userId: string;
  skillId: string;
  skillName: string;
  skillSlug: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  score?: number;
  verifiedLevelName?: string;
  verifiedLevelNumber?: number;
  questions: SeedQuestion[];
  userAnswers?: Map<string, { selectedAnswer: string; isCorrect: boolean }>;
  startedAt: string;
  completedAt?: string;
}

// In-memory session store for active and completed assessment sessions
const activeSessionsStore = new Map<string, ActiveAssessmentSession>();

export class AssessmentService {
  async getAvailableSkills(): Promise<any[]> {
    const allSkills = await skillsRepository.findAllSkills();
    const availableSlugs = Array.from(new Set(QUESTION_BANK.map((q) => q.skillSlug.toLowerCase())));

    return availableSlugs.map((slug) => {
      const match = allSkills.find((s) => s.slug.toLowerCase() === slug) ||
        STATIC_SKILLS_REFERENCE.find((s) => s.slug.toLowerCase() === slug);
      const qCount = QUESTION_BANK.filter((q) => q.skillSlug.toLowerCase() === slug).length;

      return {
        id: match?.id || `sk-${slug}`,
        name: match?.name || slug.toUpperCase(),
        slug: slug,
        category: match?.category || 'Software Engineering',
        description: match?.description || `Demonstrate your knowledge in ${slug}.`,
        questionCount: qCount,
      };
    });
  }

  async startAssessment(userId: string, skillId: string): Promise<any> {
    // Locate target skill
    const allSkills = await skillsRepository.findAllSkills();
    let targetSkill = allSkills.find((s) => s.id === skillId || s.slug.toLowerCase() === skillId.toLowerCase());

    if (!targetSkill) {
      targetSkill = STATIC_SKILLS_REFERENCE.find(
        (s) => s.id === skillId || s.slug.toLowerCase() === skillId.toLowerCase()
      );
    }

    if (!targetSkill) {
      throw new ApiError(404, 'Target skill not found for assessment.');
    }

    // Select questions matching skill slug
    const matchingQuestions = QUESTION_BANK.filter(
      (q) => q.skillSlug.toLowerCase() === targetSkill!.slug.toLowerCase()
    );

    if (matchingQuestions.length === 0) {
      throw new ApiError(400, `No assessment questions currently available for ${targetSkill.name}.`);
    }

    // Pick questions (up to 7 questions)
    const selectedQuestions = matchingQuestions.slice(0, 7);

    // Create DB Assessment Record
    let dbAssessment: DbAssessment | null = null;
    const assessmentId = randomUUID();

    try {
      dbAssessment = await assessmentsRepository.createAssessment({
        user_id: userId,
        skill_id: targetSkill.id,
        claimed_level: 'beginner',
        status: 'in_progress',
      });
    } catch (dbErr) {
      logger.warn('Could not persist assessment to PostgreSQL, using session store:', dbErr);
    }

    const finalId = dbAssessment ? dbAssessment.id : assessmentId;

    // Create active session object
    const session: ActiveAssessmentSession = {
      assessmentId: finalId,
      userId,
      skillId: targetSkill.id,
      skillName: targetSkill.name,
      skillSlug: targetSkill.slug,
      status: 'in_progress',
      questions: selectedQuestions,
      startedAt: new Date().toISOString(),
    };

    activeSessionsStore.set(finalId, session);

    // SECURITY: Return questions WITHOUT correct_answer or explanation!
    return {
      assessmentId: finalId,
      skill: {
        id: targetSkill.id,
        name: targetSkill.name,
        slug: targetSkill.slug,
      },
      questions: selectedQuestions.map((q, idx) => ({
        id: q.id,
        questionNumber: idx + 1,
        questionText: q.questionText,
        options: q.options,
        difficulty: q.difficulty,
      })),
    };
  }

  async submitAssessment(
    userId: string,
    assessmentId: string,
    submittedAnswers: Array<{ questionId: string; selectedAnswer: string }>
  ): Promise<any> {
    const session = activeSessionsStore.get(assessmentId);

    if (!session) {
      throw new ApiError(404, 'Assessment session not found or expired.');
    }

    // Security Check: Verify user ownership
    if (session.userId !== userId) {
      throw new ApiError(403, 'You are not authorized to submit answers for this assessment.');
    }

    // Status Check
    if (session.status !== 'in_progress') {
      throw new ApiError(400, 'This assessment has already been completed.');
    }

    // Validate and score submitted answers
    let correctCount = 0;
    const totalQuestions = session.questions.length;
    const userAnswersMap = new Map<string, { selectedAnswer: string; isCorrect: boolean }>();

    for (const q of session.questions) {
      const match = submittedAnswers.find((a) => a.questionId === q.id);
      const selected = match ? match.selectedAnswer : '';
      const isCorrect = selected.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

      if (isCorrect) {
        correctCount += 1;
      }

      userAnswersMap.set(q.id, { selectedAnswer: selected, isCorrect });

      // Save individual answer to DB repository
      try {
        await assessmentsRepository.saveAnswer({
          assessment_id: assessmentId,
          question_id: q.id,
          user_answer: selected,
          is_correct: isCorrect,
          score: isCorrect ? 100 : 0,
        });
      } catch (err) {
        // Fallback for offline DB
      }
    }

    // Calculate score percentage
    const rawScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const score = Math.round(rawScore * 100) / 100;

    // Map score to verified skill level
    const levelResult = scoreToVerifiedLevel(score);

    // Update Session
    session.status = 'completed';
    session.score = score;
    session.verifiedLevelNumber = levelResult.numericLevel;
    session.verifiedLevelName = levelResult.levelName;
    session.userAnswers = userAnswersMap;
    session.completedAt = new Date().toISOString();

    activeSessionsStore.set(assessmentId, session);

    // Update user_skills.verified_level in database/repository
    try {
      await skillsRepository.upsertUserSkill(userId, session.skillId, {
        verified_level: levelResult.levelName as any,
      });
    } catch (err) {
      logger.warn('Failed to update user_skills.verified_level in database:', err);
    }

    return {
      assessmentId,
      skill: session.skillName,
      score,
      correctAnswers: correctCount,
      totalQuestions,
      verifiedLevel: levelResult.numericLevel,
      verifiedLevelName: levelResult.levelName,
    };
  }

  async getAssessmentDetails(userId: string, assessmentId: string): Promise<any> {
    const session = activeSessionsStore.get(assessmentId);

    if (!session) {
      throw new ApiError(404, 'Assessment session not found.');
    }

    if (session.userId !== userId) {
      throw new ApiError(403, 'Unauthorized access to assessment record.');
    }

    const userSkillList = await skillsRepository.getUserSkills(userId);
    const matchedSkill = userSkillList.find((us) => us.skill_id === session.skillId);

    return {
      assessmentId: session.assessmentId,
      skill: session.skillName,
      status: session.status,
      score: session.score || 0,
      verifiedLevel: session.verifiedLevelNumber || 1,
      verifiedLevelName: session.verifiedLevelName || 'beginner',
      selfReportedLevel: matchedSkill?.self_reported_level || 'beginner',
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      questions: session.questions.map((q) => {
        const uAns = session.userAnswers?.get(q.id);
        return {
          id: q.id,
          questionText: q.questionText,
          options: q.options,
          userAnswer: uAns?.selectedAnswer || null,
          correctAnswer: q.correctAnswer,
          isCorrect: uAns?.isCorrect ?? false,
          explanation: q.explanation,
        };
      }),
    };
  }

  async getUserAssessmentHistory(userId: string): Promise<any[]> {
    const userSessions = Array.from(activeSessionsStore.values()).filter(
      (s) => s.userId === userId && s.status === 'completed'
    );

    return userSessions.map((s) => ({
      assessmentId: s.assessmentId,
      skillName: s.skillName,
      score: s.score || 0,
      verifiedLevelName: s.verifiedLevelName || 'beginner',
      verifiedLevelNumber: s.verifiedLevelNumber || 1,
      completedAt: s.completedAt,
    }));
  }
}

export const assessmentService = new AssessmentService();
