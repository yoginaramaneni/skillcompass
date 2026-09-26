import { z } from 'zod';

export const startAssessmentSchema = z.object({
  skillId: z.string().min(1, 'skillId is required'),
});

export const submitAssessmentSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1, 'questionId is required'),
      selectedAnswer: z.string().min(1, 'selectedAnswer cannot be empty'),
    })
  ).min(1, 'At least one answer must be submitted'),
});

export type StartAssessmentInput = z.infer<typeof startAssessmentSchema>;
export type SubmitAssessmentInput = z.infer<typeof submitAssessmentSchema>;
