export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
  errors?: any[];
}

export interface UserSkillItem {
  skill_id?: string;
  skill_name?: string;
  self_reported_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | string | null;
  years_experience?: number;
  is_primary?: boolean;
  category?: string;
}

export interface ProjectItem {
  name: string;
  description?: string;
  project_url?: string;
  github_url?: string;
  role?: string;
}

export interface CourseItem {
  course_name: string;
  provider?: string;
  completion_date?: string;
  certificate_url?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  credential_id?: string;
  credential_url?: string;
}

export interface ExperienceItem {
  company_name: string;
  job_title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
}

export interface StudentProfileData {
  user?: User;
  profile?: {
    headline?: string;
    bio?: string;
    location?: string;
    education_level?: string;
    years_of_experience?: number;
    weekly_learning_hours?: number;
    target_career_id?: string;
  };
  targetCareer?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    category?: string;
  } | null;
  skills?: UserSkillItem[];
  education?: any[];
  projects?: ProjectItem[];
  courses?: CourseItem[];
  certifications?: CertificationItem[];
  experience?: ExperienceItem[];
}
