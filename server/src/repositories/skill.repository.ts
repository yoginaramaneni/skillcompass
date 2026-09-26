import { queryDatabase } from '../db';
import { DbSkill, DbUserSkill } from '../types/db.types';
import { logger } from '../utils/logger';

// Helper to resolve static/slug skill IDs to real PostgreSQL UUIDs
export const isUuid = (val?: string | null): boolean => {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
};

export const resolveSkillUuid = async (skillIdOrSlug: string): Promise<string> => {
  if (isUuid(skillIdOrSlug)) return skillIdOrSlug;

  try {
    const slugMap: Record<string, string> = {
      'sk-c': 'c',
      'sk-cpp': 'cpp',
      'sk-java': 'java',
      'sk-python': 'python',
      'sk-js': 'javascript',
      'sk-ts': 'typescript',
      'sk-sql': 'sql',
      'sk-go': 'go',
      'sk-rust': 'rust',
      'sk-html': 'html',
      'sk-css': 'css',
      'sk-react': 'react',
      'sk-nextjs': 'nextjs',
      'sk-angular': 'angular',
      'sk-vue': 'vuejs',
      'sk-tailwind': 'tailwind-css',
      'sk-node': 'nodejs',
      'sk-express': 'expressjs',
      'sk-fastapi': 'fastapi',
      'sk-django': 'django',
      'sk-spring': 'spring-boot',
      'sk-rest': 'rest-apis',
      'sk-graphql': 'graphql',
      'sk-postgres': 'postgresql',
      'sk-mysql': 'mysql',
      'sk-mongo': 'mongodb',
      'sk-redis': 'redis',
      'sk-git': 'git',
      'sk-docker': 'docker',
      'sk-k8s': 'kubernetes',
      'sk-aws': 'aws',
      'sk-ml': 'machine-learning',
      'sk-dl': 'deep-learning',
      'sk-rag': 'rag',
      'sk-llm': 'llm',
      'sk-genai': 'generative-ai',
      'sk-sd': 'system-design',
      'sk-ds-algo': 'dsa',
      'sk-comm': 'communication',
      'sk-ps': 'problem-solving',
    };

    const targetSlug = slugMap[skillIdOrSlug] || skillIdOrSlug;

    const res = await queryDatabase(
      `SELECT id FROM skills WHERE slug = $1 OR id::text = $2 LIMIT 1`,
      [targetSlug, skillIdOrSlug]
    );

    if (res.rows.length > 0) {
      return res.rows[0].id;
    }
  } catch (err) {}

  return skillIdOrSlug;
};

// Static Reference Skills Fallback Dataset
export const STATIC_SKILLS_REFERENCE: DbSkill[] = [
  // Programming Languages
  { id: 'sk-c', name: 'C', slug: 'c', category: 'Programming Languages', description: 'Low-level systems programming language.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-cpp', name: 'C++', slug: 'cpp', category: 'Programming Languages', description: 'High-performance object-oriented programming language.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-java', name: 'Java', slug: 'java', category: 'Programming Languages', description: 'Enterprise object-oriented programming language.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-python', name: 'Python', slug: 'python', category: 'Programming Languages', description: 'High-level programming language popular for AI, Data Science, and Web Backends.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-js', name: 'JavaScript', slug: 'javascript', category: 'Programming Languages', description: 'Core programming language of the web.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-ts', name: 'TypeScript', slug: 'typescript', category: 'Programming Languages', description: 'Strongly typed superset of JavaScript.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-sql', name: 'SQL', slug: 'sql', category: 'Programming Languages', description: 'Domain-specific language for querying relational databases.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-go', name: 'Go', slug: 'go', category: 'Programming Languages', description: 'Statically typed language designed for concurrent microservices.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-rust', name: 'Rust', slug: 'rust', category: 'Programming Languages', description: 'Memory-safe systems programming language.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Frontend
  { id: 'sk-html', name: 'HTML', slug: 'html', category: 'Frontend', description: 'Standard markup language for web document structure.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-css', name: 'CSS', slug: 'css', category: 'Frontend', description: 'Style sheet language for styling web pages.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-react', name: 'React', slug: 'react', category: 'Frontend', description: 'Declarative component-based UI framework for web apps.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-nextjs', name: 'Next.js', slug: 'nextjs', category: 'Frontend', description: 'Full-stack React framework with server-side rendering.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-angular', name: 'Angular', slug: 'angular', category: 'Frontend', description: 'Opinionated TypeScript-based web application framework.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-vue', name: 'Vue.js', slug: 'vuejs', category: 'Frontend', description: 'Progressive JavaScript framework for building user interfaces.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-tailwind', name: 'Tailwind CSS', slug: 'tailwind-css', category: 'Frontend', description: 'Utility-first CSS framework for rapid UI styling.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Backend
  { id: 'sk-node', name: 'Node.js', slug: 'nodejs', category: 'Backend', description: 'Asynchronous event-driven JavaScript backend runtime.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-express', name: 'Express.js', slug: 'expressjs', category: 'Backend', description: 'Minimalist web API framework for Node.js.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-fastapi', name: 'FastAPI', slug: 'fastapi', category: 'Backend', description: 'High-performance Python web framework for APIs.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-django', name: 'Django', slug: 'django', category: 'Backend', description: 'High-level Python web framework.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-spring', name: 'Spring Boot', slug: 'spring-boot', category: 'Backend', description: 'Java-based framework for enterprise REST APIs and microservices.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-rest', name: 'REST APIs', slug: 'rest-apis', category: 'Backend', description: 'Architectural style for HTTP networked application APIs.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-graphql', name: 'GraphQL', slug: 'graphql', category: 'Backend', description: 'Query language and server runtime for APIs.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Databases
  { id: 'sk-postgres', name: 'PostgreSQL', slug: 'postgresql', category: 'Databases', description: 'Advanced open-source relational database management system.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-mysql', name: 'MySQL', slug: 'mysql', category: 'Databases', description: 'Popular open-source relational database engine.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-mongo', name: 'MongoDB', slug: 'mongodb', category: 'Databases', description: 'Document-oriented NoSQL database system.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-redis', name: 'Redis', slug: 'redis', category: 'Databases', description: 'In-memory key-value data structure store.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // DevOps & Cloud
  { id: 'sk-git', name: 'Git', slug: 'git', category: 'DevOps', description: 'Distributed version control system.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-docker', name: 'Docker', slug: 'docker', category: 'DevOps', description: 'Platform for developing, shipping, and running containerized apps.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-k8s', name: 'Kubernetes', slug: 'kubernetes', category: 'DevOps', description: 'Container orchestration system.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-aws', name: 'AWS', slug: 'aws', category: 'Cloud', description: 'Amazon Web Services cloud computing platform.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // AI & ML
  { id: 'sk-ml', name: 'Machine Learning', slug: 'machine-learning', category: 'AI & Machine Learning', description: 'Subfield of AI focusing on data-driven statistical models.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-dl', name: 'Deep Learning', slug: 'deep-learning', category: 'AI & Machine Learning', description: 'Neural network architectures for complex pattern recognition.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-rag', name: 'RAG', slug: 'rag', category: 'AI & Machine Learning', description: 'Retrieval-Augmented Generation pattern combining vector search with LLMs.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-llm', name: 'Large Language Models', slug: 'llm', category: 'AI & Machine Learning', description: 'Foundation neural network models trained on extensive text datasets.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-genai', name: 'Generative AI', slug: 'generative-ai', category: 'AI & Machine Learning', description: 'AI models capable of generating synthetic text, images, and content.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Software Engineering & Professional
  { id: 'sk-sd', name: 'System Design', slug: 'system-design', category: 'Software Engineering', description: 'Defining architecture, modules, and interfaces for scalable software.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-ds-algo', name: 'Data Structures & Algorithms', slug: 'dsa', category: 'Data', description: 'Specialized formats and step-by-step procedures for solving problems.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-comm', name: 'Communication', slug: 'communication', category: 'Professional Skills', description: 'Clear technical communication and documentation.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sk-ps', name: 'Problem Solving', slug: 'problem-solving', category: 'Professional Skills', description: 'Analytical approach to diagnosing and resolving technical issues.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

export class SkillsRepository {
  async findAllSkills(search?: string, category?: string): Promise<DbSkill[]> {
    try {
      let sql = `SELECT id, name, slug, category, description, created_at, updated_at FROM skills WHERE 1=1`;
      const params: any[] = [];

      if (search && search.trim().length > 0) {
        params.push(`%${search.trim().toLowerCase()}%`);
        sql += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(slug) LIKE $${params.length})`;
      }

      if (category && category.trim().length > 0) {
        params.push(category.trim());
        sql += ` AND category = $${params.length}`;
      }

      sql += ` ORDER BY name ASC`;

      const result = await queryDatabase(sql, params);
      return result.rows;
    } catch (err) {
      logger.warn('Database query failed, returning fallback static skills reference dataset.');
      let filtered = [...STATIC_SKILLS_REFERENCE];

      if (search && search.trim().length > 0) {
        const query = search.trim().toLowerCase();
        filtered = filtered.filter(s => s.name.toLowerCase().includes(query) || s.slug.toLowerCase().includes(query));
      }

      if (category && category.trim().length > 0) {
        filtered = filtered.filter(s => s.category?.toLowerCase() === category.trim().toLowerCase());
      }

      return filtered;
    }
  }

  async findSkillBySlug(slug: string): Promise<DbSkill | null> {
    try {
      const result = await queryDatabase(
        `SELECT id, name, slug, category, description, created_at, updated_at
         FROM skills WHERE slug = $1`,
        [slug]
      );
      return result.rows[0] || null;
    } catch (err) {
      return STATIC_SKILLS_REFERENCE.find(s => s.slug === slug) || null;
    }
  }

  async findSkillById(id: string): Promise<DbSkill | null> {
    try {
      const targetId = await resolveSkillUuid(id);
      const result = await queryDatabase(
        `SELECT id, name, slug, category, description, created_at, updated_at
         FROM skills WHERE id = $1 OR slug = $2`,
        [targetId, id]
      );
      return result.rows[0] || null;
    } catch (err) {
      return STATIC_SKILLS_REFERENCE.find(s => s.id === id || s.slug === id) || null;
    }
  }

  async getUserSkills(userId: string): Promise<DbUserSkill[]> {
    try {
      const result = await queryDatabase(
        `SELECT id, user_id, skill_id, self_reported_level, verified_level,
                years_experience, is_primary, created_at, updated_at
         FROM user_skills WHERE user_id = $1 ORDER BY is_primary DESC, created_at DESC`,
        [userId]
      );
      return result.rows;
    } catch (err) {
      return [];
    }
  }

  async upsertUserSkill(userId: string, skillId: string, data: Partial<DbUserSkill>): Promise<DbUserSkill> {
    const validSkillUuid = await resolveSkillUuid(skillId);

    try {
      const result = await queryDatabase(
        `INSERT INTO user_skills (user_id, skill_id, self_reported_level, verified_level, years_experience, is_primary)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id, skill_id) DO UPDATE SET
           self_reported_level = COALESCE(EXCLUDED.self_reported_level, user_skills.self_reported_level),
           verified_level = COALESCE(EXCLUDED.verified_level, user_skills.verified_level),
           years_experience = COALESCE(EXCLUDED.years_experience, user_skills.years_experience),
           is_primary = COALESCE(EXCLUDED.is_primary, user_skills.is_primary),
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [
          userId,
          validSkillUuid,
          data.self_reported_level || null,
          data.verified_level || null,
          data.years_experience || 0,
          data.is_primary || false,
        ]
      );
      return result.rows[0];
    } catch (err) {
      return {
        id: `us-${Date.now()}`,
        user_id: userId,
        skill_id: validSkillUuid,
        self_reported_level: data.self_reported_level || 'intermediate',
        verified_level: data.verified_level || null,
        years_experience: data.years_experience || 0,
        is_primary: data.is_primary || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }

  async deleteUserSkill(userId: string, skillId: string): Promise<boolean> {
    const validSkillUuid = await resolveSkillUuid(skillId);
    try {
      const result = await queryDatabase(
        `DELETE FROM user_skills WHERE user_id = $1 AND skill_id = $2`,
        [userId, validSkillUuid]
      );
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      return true;
    }
  }
}

export const skillsRepository = new SkillsRepository();
