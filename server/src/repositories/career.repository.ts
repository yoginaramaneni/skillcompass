import { queryDatabase } from '../db';
import { DbCareerRole } from '../types/db.types';
import { levelToNumber } from '../utils/skillLevel';
import { logger } from '../utils/logger';

export interface DbCareerRoleSkillRow {
  skillId: string;
  skillName: string;
  slug: string;
  category: string | null;
  importance: 'low' | 'medium' | 'high' | 'critical';
  minimumLevel: string;
}

export interface CareerRoleSkillDetail {
  skillId: string;
  skillName: string;
  slug: string;
  category: string | null;
  importance: 'low' | 'medium' | 'high' | 'critical';
  minimumLevel: string;
  minimumLevelNumber: number;
}

// Static Target Career Roles Reference Fallback
export const STATIC_CAREERS_REFERENCE: DbCareerRole[] = [
  { id: 'role-fsd', name: 'Full Stack Developer', slug: 'full-stack-developer', category: 'Software Engineering', description: 'Handles client-side user interfaces, server APIs, and database persistence.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-fed', name: 'Frontend Developer', slug: 'frontend-developer', category: 'Software Engineering', description: 'Builds responsive user interfaces, web applications, and client-side logic.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-bed', name: 'Backend Developer', slug: 'backend-developer', category: 'Software Engineering', description: 'Designs server-side architecture, RESTful APIs, microservices, and database persistence.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-swe', name: 'Software Engineer', slug: 'software-engineer', category: 'Software Engineering', description: 'Applies engineering principles to design, develop, test, and maintain software.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-da', name: 'Data Analyst', slug: 'data-analyst', category: 'Data & Analytics', description: 'Translates raw tabular data into actionable business intelligence insights.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-ds', name: 'Data Scientist', slug: 'data-scientist', category: 'Data & Analytics', description: 'Applies statistical algorithms, predictive models, and machine learning.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-mle', name: 'Machine Learning Engineer', slug: 'ml-engineer', category: 'Artificial Intelligence', description: 'Deploys machine learning models and training pipelines into production scale.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-aie', name: 'AI Engineer', slug: 'ai-engineer', category: 'Artificial Intelligence', description: 'Integrates LLMs, Generative AI, RAG architectures, and intelligent agents.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-devops', name: 'DevOps Engineer', slug: 'devops-engineer', category: 'Cloud & Infrastructure', description: 'Automates CI/CD deployment pipelines, containerization, and server infrastructure.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-cloud', name: 'Cloud Engineer', slug: 'cloud-engineer', category: 'Cloud & Infrastructure', description: 'Architects and manages cloud platform services, networks, and cloud security.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'role-sec', name: 'Cybersecurity Engineer', slug: 'cybersecurity-engineer', category: 'Security', description: 'Safeguards IT infrastructure, applications, and networks from cyber threats.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const STATIC_ROLE_SKILLS_MAP: Record<string, CareerRoleSkillDetail[]> = {
  'role-fsd': [
    { skillId: 'sk-js', skillName: 'JavaScript', slug: 'javascript', category: 'Programming Languages', importance: 'critical', minimumLevel: 'intermediate', minimumLevelNumber: 3 },
    { skillId: 'sk-ts', skillName: 'TypeScript', slug: 'typescript', category: 'Programming Languages', importance: 'high', minimumLevel: 'intermediate', minimumLevelNumber: 3 },
    { skillId: 'sk-react', skillName: 'React', slug: 'react', category: 'Frontend', importance: 'high', minimumLevel: 'intermediate', minimumLevelNumber: 3 },
    { skillId: 'sk-node', skillName: 'Node.js', slug: 'nodejs', category: 'Backend', importance: 'high', minimumLevel: 'intermediate', minimumLevelNumber: 3 },
    { skillId: 'sk-express', skillName: 'Express.js', slug: 'expressjs', category: 'Backend', importance: 'high', minimumLevel: 'intermediate', minimumLevelNumber: 3 },
    { skillId: 'sk-postgres', skillName: 'PostgreSQL', slug: 'postgresql', category: 'Databases', importance: 'high', minimumLevel: 'intermediate', minimumLevelNumber: 3 },
    { skillId: 'sk-git', skillName: 'Git', slug: 'git', category: 'DevOps', importance: 'high', minimumLevel: 'intermediate', minimumLevelNumber: 3 },
    { skillId: 'sk-docker', skillName: 'Docker', slug: 'docker', category: 'DevOps', importance: 'medium', minimumLevel: 'beginner', minimumLevelNumber: 1 },
  ],
  'role-aie': [
    { skillId: 'sk-python', skillName: 'Python', slug: 'python', category: 'Programming Languages', importance: 'critical', minimumLevel: 'advanced', minimumLevelNumber: 4 },
    { skillId: 'sk-rag', skillName: 'RAG', slug: 'rag', category: 'AI & Machine Learning', importance: 'critical', minimumLevel: 'intermediate', minimumLevelNumber: 3 },
    { skillId: 'sk-genai', skillName: 'Generative AI', slug: 'generative-ai', category: 'AI & Machine Learning', importance: 'critical', minimumLevel: 'intermediate', minimumLevelNumber: 3 },
    { skillId: 'sk-llm', skillName: 'Large Language Models', slug: 'llm', category: 'AI & Machine Learning', importance: 'critical', minimumLevel: 'intermediate', minimumLevelNumber: 3 },
    { skillId: 'sk-ml', skillName: 'Machine Learning', slug: 'machine-learning', category: 'AI & Machine Learning', importance: 'high', minimumLevel: 'intermediate', minimumLevelNumber: 3 },
  ]
};

export class CareersRepository {
  async findAllRoles(): Promise<DbCareerRole[]> {
    try {
      const result = await queryDatabase(
        `SELECT id, name, slug, description, category, created_at, updated_at
         FROM career_roles ORDER BY name ASC`
      );
      return result.rows;
    } catch (err) {
      logger.warn('Database query failed, returning fallback static career roles reference dataset.');
      return STATIC_CAREERS_REFERENCE;
    }
  }

  async findRoleById(id: string): Promise<DbCareerRole | null> {
    try {
      const result = await queryDatabase(
        `SELECT id, name, slug, description, category, created_at, updated_at
         FROM career_roles WHERE id = $1`,
        [id]
      );
      return result.rows[0] || null;
    } catch (err) {
      return STATIC_CAREERS_REFERENCE.find(r => r.id === id || r.slug === id) || STATIC_CAREERS_REFERENCE[0];
    }
  }

  async findRoleSkills(careerRoleId: string): Promise<CareerRoleSkillDetail[]> {
    try {
      const result = await queryDatabase(
        `SELECT 
           crs.skill_id AS "skillId",
           s.name AS "skillName",
           s.slug AS "slug",
           s.category AS "category",
           crs.importance AS "importance",
           crs.minimum_level AS "minimumLevel"
         FROM career_role_skills crs
         JOIN skills s ON s.id = crs.skill_id
         WHERE crs.career_role_id = $1
         ORDER BY 
           CASE crs.importance
             WHEN 'critical' THEN 1
             WHEN 'high' THEN 2
             WHEN 'medium' THEN 3
             WHEN 'low' THEN 4
             ELSE 5
           END ASC, s.name ASC`,
        [careerRoleId]
      );

      return result.rows.map((row: DbCareerRoleSkillRow) => ({
        ...row,
        minimumLevelNumber: levelToNumber(row.minimumLevel),
      }));
    } catch (err) {
      return STATIC_ROLE_SKILLS_MAP[careerRoleId] || STATIC_ROLE_SKILLS_MAP['role-fsd'];
    }
  }
}

export const careersRepository = new CareersRepository();
