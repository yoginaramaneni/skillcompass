export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillImportance = 'low' | 'medium' | 'high' | 'critical';
export type AssessmentStatus = 'in_progress' | 'completed' | 'abandoned';
export type QuestionType = 'mcq' | 'short_answer' | 'coding';
export type GapPriority = 'low' | 'medium' | 'high' | 'critical';
export type RoadmapStatus = 'draft' | 'active' | 'completed' | 'archived';
export type ItemStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';
export type TrendDirection = 'rising' | 'stable' | 'declining';

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCareerRole {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbProfile {
  id: string;
  user_id: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  education_level?: string | null;
  years_of_experience: number;
  weekly_learning_hours: number;
  target_career_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbEducation {
  id: string;
  user_id: string;
  institution: string;
  degree?: string | null;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCourse {
  id: string;
  user_id: string;
  course_name: string;
  provider?: string | null;
  completion_date?: string | null;
  certificate_url?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSkill {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbUserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  self_reported_level?: SkillLevel | null;
  verified_level?: SkillLevel | null;
  years_experience: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProject {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  project_url?: string | null;
  github_url?: string | null;
  role?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbProjectSkill {
  id: string;
  project_id: string;
  skill_id: string;
}

export interface DbCertification {
  id: string;
  user_id: string;
  name: string;
  issuer: string;
  credential_id?: string | null;
  credential_url?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbExperience {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbExperienceSkill {
  id: string;
  experience_id: string;
  skill_id: string;
}

export interface DbCareerRoleSkill {
  id: string;
  career_role_id: string;
  skill_id: string;
  importance: SkillImportance;
  minimum_level: SkillLevel;
  created_at: string;
  updated_at: string;
}

export interface DbAssessment {
  id: string;
  user_id: string;
  skill_id: string;
  claimed_level?: SkillLevel | null;
  status: AssessmentStatus;
  score?: number | null;
  started_at: string;
  completed_at?: string | null;
  created_at: string;
}

export interface DbAssessmentQuestion {
  id: string;
  assessment_id: string;
  question_number: number;
  question_text: string;
  question_type: QuestionType;
  options?: any;
  correct_answer: string;
  difficulty?: string | null;
  created_at: string;
}

export interface DbAssessmentAnswer {
  id: string;
  assessment_id: string;
  question_id: string;
  user_answer?: string | null;
  is_correct?: boolean | null;
  score?: number | null;
  created_at: string;
}

export interface DbSkillGap {
  id: string;
  user_id: string;
  career_role_id: string;
  skill_id: string;
  current_level?: string | null;
  required_level?: string | null;
  gap_score?: number | null;
  priority: GapPriority;
  reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbLearningRoadmap {
  id: string;
  user_id: string;
  career_role_id: string;
  title: string;
  description?: string | null;
  status: RoadmapStatus;
  target_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbRoadmapItem {
  id: string;
  roadmap_id: string;
  skill_id?: string | null;
  title: string;
  description?: string | null;
  sequence_number: number;
  estimated_hours?: number | null;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export interface DbLearningPlanTask {
  id: string;
  user_id: string;
  roadmap_item_id?: string | null;
  task_date: string;
  title: string;
  description?: string | null;
  estimated_minutes?: number | null;
  status: TaskStatus;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbMarketSkill {
  id: string;
  skill_id?: string | null;
  normalized_name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbMarketSkillTrend {
  id: string;
  skill_id: string;
  career_role_id?: string | null;
  region?: string | null;
  time_period?: string | null;
  frequency: number;
  trend_direction?: TrendDirection | null;
  trend_score?: number | null;
  source?: string | null;
  source_url?: string | null;
  collected_at: string;
  created_at: string;
}

export interface DbAiGeneration {
  id: string;
  user_id: string;
  generation_type: string;
  input_context?: any;
  output_json?: any;
  model?: string | null;
  created_at: string;
}
