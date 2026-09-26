import { z } from 'zod';

export const roadmapItemSchema = z.object({
  id: z.string(),
  sequenceNumber: z.number(),
  skillName: z.string(),
  title: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  whyToLearn: z.string(),
  estimatedHours: z.number().min(1),
  practiceTasks: z.array(z.string()).min(1),
  status: z.enum(['pending', 'in_progress', 'completed', 'skipped']).default('pending'),
});

export const learningRoadmapSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  targetCareerRole: z.string(),
  totalEstimatedHours: z.number(),
  items: z.array(roadmapItemSchema),
  createdAt: z.string().optional(),
});

export type RoadmapItem = z.infer<typeof roadmapItemSchema>;
export type LearningRoadmap = z.infer<typeof learningRoadmapSchema>;
