export type PriorityType = 'critical' | 'high' | 'medium' | 'low';
export type ItemStatusType = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface RoadmapItem {
  id: string;
  sequenceNumber: number;
  skillName: string;
  title: string;
  priority: PriorityType;
  whyToLearn: string;
  estimatedHours: number;
  practiceTasks: string[];
  status: ItemStatusType;
}

export interface LearningRoadmap {
  id?: string;
  title: string;
  description: string;
  targetCareerRole: string;
  totalEstimatedHours: number;
  items: RoadmapItem[];
  createdAt?: string;
}
