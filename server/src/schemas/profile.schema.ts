import { z } from 'zod';

export const userSkillInputSchema = z.object({
  skill_id: z.string().optional(),
  skill_name: z.string().optional(),
  self_reported_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  years_experience: z.number().min(0).optional(),
  is_primary: z.boolean().optional(),
});

export const projectInputSchema = z.object({
  name: z.string().min(1, 'Project name required'),
  description: z.string().optional(),
  project_url: z.string().optional(),
  github_url: z.string().optional(),
  role: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export const courseInputSchema = z.object({
  course_name: z.string().min(1, 'Course name required'),
  provider: z.string().optional(),
  completion_date: z.string().optional(),
  certificate_url: z.string().optional(),
  description: z.string().optional(),
});

export const certificationInputSchema = z.object({
  name: z.string().min(1, 'Certification name required'),
  issuer: z.string().min(1, 'Issuer required'),
  credential_id: z.string().optional(),
  credential_url: z.string().optional(),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
});

export const experienceInputSchema = z.object({
  company_name: z.string().min(1, 'Company name required'),
  job_title: z.string().min(1, 'Job title required'),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_current: z.boolean().optional(),
  skills: z.array(z.string()).optional(),
});

export const onboardingProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  education_level: z.string().optional(),
  institution: z.string().optional(),
  field_of_study: z.string().optional(),
  target_career_id: z.string().optional(),
  years_of_experience: z.number().min(0).optional(),
  weekly_learning_hours: z.number().min(0).optional(),
  skills: z.array(userSkillInputSchema).optional(),
  projects: z.array(projectInputSchema).optional(),
  courses: z.array(courseInputSchema).optional(),
  certifications: z.array(certificationInputSchema).optional(),
  experience: z.array(experienceInputSchema).optional(),
});

export type OnboardingProfileInput = z.infer<typeof onboardingProfileSchema>;
