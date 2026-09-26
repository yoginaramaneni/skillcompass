export interface AssessmentSkill {
  id: string;
  name: string;
  slug: string;
  category?: string;
  description?: string;
  questionCount: number;
  selfReportedLevel?: string;
  verifiedLevel?: string;
}

export interface AssessmentQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  options: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface AssessmentAnswer {
  questionId: string;
  selectedAnswer: string;
}

export interface AssessmentStartResponse {
  assessmentId: string;
  skill: {
    id: string;
    name: string;
    slug: string;
  };
  questions: AssessmentQuestion[];
}

export interface AssessmentResult {
  assessmentId: string;
  skill: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  verifiedLevel: number;
  verifiedLevelName: string;
}

export interface QuestionReviewItem {
  id: string;
  questionText: string;
  options: string[];
  userAnswer?: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface AssessmentDetails {
  assessmentId: string;
  skill: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  score: number;
  verifiedLevel: number;
  verifiedLevelName: string;
  selfReportedLevel?: string;
  startedAt?: string;
  completedAt?: string;
  questions: QuestionReviewItem[];
}

export interface AssessmentHistoryItem {
  assessmentId: string;
  skillName: string;
  score: number;
  verifiedLevelName: string;
  verifiedLevelNumber: number;
  completedAt?: string;
}
