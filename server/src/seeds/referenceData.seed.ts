import { queryDatabase } from '../db';
import { logger } from '../utils/logger';

export const seedReferenceData = async () => {
  logger.info('Starting Idempotent Reference Data Seeding...');

  // 1. SEED SKILLS
  const skillsData = [
    // Programming Languages
    { name: 'C', slug: 'c', category: 'Programming Languages', description: 'Low-level systems programming language.' },
    { name: 'C++', slug: 'cpp', category: 'Programming Languages', description: 'High-performance object-oriented programming language.' },
    { name: 'Java', slug: 'java', category: 'Programming Languages', description: 'Enterprise object-oriented programming language.' },
    { name: 'Python', slug: 'python', category: 'Programming Languages', description: 'High-level programming language popular for AI, Data Science, and Web Backends.' },
    { name: 'JavaScript', slug: 'javascript', category: 'Programming Languages', description: 'Core programming language of the web.' },
    { name: 'TypeScript', slug: 'typescript', category: 'Programming Languages', description: 'Strongly typed superset of JavaScript.' },
    { name: 'SQL', slug: 'sql', category: 'Programming Languages', description: 'Domain-specific language for querying relational databases.' },
    { name: 'Go', slug: 'go', category: 'Programming Languages', description: 'Statically typed language designed for concurrent microservices.' },
    { name: 'Rust', slug: 'rust', category: 'Programming Languages', description: 'Memory-safe systems programming language.' },

    // Frontend
    { name: 'HTML', slug: 'html', category: 'Frontend', description: 'Standard markup language for web document structure.' },
    { name: 'CSS', slug: 'css', category: 'Frontend', description: 'Style sheet language for styling web pages.' },
    { name: 'React', slug: 'react', category: 'Frontend', description: 'Declarative component-based UI framework for web apps.' },
    { name: 'Next.js', slug: 'nextjs', category: 'Frontend', description: 'Full-stack React framework with server-side rendering.' },
    { name: 'Angular', slug: 'angular', category: 'Frontend', description: 'Opinionated TypeScript-based web application framework.' },
    { name: 'Vue.js', slug: 'vuejs', category: 'Frontend', description: 'Progressive JavaScript framework for building user interfaces.' },
    { name: 'Tailwind CSS', slug: 'tailwind-css', category: 'Frontend', description: 'Utility-first CSS framework for rapid UI styling.' },

    // Backend
    { name: 'Node.js', slug: 'nodejs', category: 'Backend', description: 'Asynchronous event-driven JavaScript backend runtime.' },
    { name: 'Express.js', slug: 'expressjs', category: 'Backend', description: 'Minimalist web API framework for Node.js.' },
    { name: 'FastAPI', slug: 'fastapi', category: 'Backend', description: 'High-performance Python web framework for APIs.' },
    { name: 'Django', slug: 'django', category: 'Backend', description: 'High-level Python web framework.' },
    { name: 'Spring Boot', slug: 'spring-boot', category: 'Backend', description: 'Java-based framework for enterprise REST APIs and microservices.' },
    { name: 'REST APIs', slug: 'rest-apis', category: 'Backend', description: 'Architectural style for HTTP networked application APIs.' },
    { name: 'GraphQL', slug: 'graphql', category: 'Backend', description: 'Query language and server runtime for APIs.' },

    // Databases
    { name: 'PostgreSQL', slug: 'postgresql', category: 'Databases', description: 'Advanced open-source relational database management system.' },
    { name: 'MySQL', slug: 'mysql', category: 'Databases', description: 'Popular open-source relational database engine.' },
    { name: 'MongoDB', slug: 'mongodb', category: 'Databases', description: 'Document-oriented NoSQL database system.' },
    { name: 'Redis', slug: 'redis', category: 'Databases', description: 'In-memory key-value data structure store.' },
    { name: 'Database Design', slug: 'database-design', category: 'Databases', description: 'Process of producing a detailed data model of a database.' },

    // Cloud
    { name: 'AWS', slug: 'aws', category: 'Cloud', description: 'Amazon Web Services cloud computing platform.' },
    { name: 'Microsoft Azure', slug: 'azure', category: 'Cloud', description: 'Enterprise cloud computing services by Microsoft.' },
    { name: 'Google Cloud', slug: 'google-cloud', category: 'Cloud', description: 'Google Cloud Platform infrastructure and services.' },
    { name: 'Cloud Computing', slug: 'cloud-computing', category: 'Cloud', description: 'On-demand availability of computer systems and cloud infrastructure.' },

    // DevOps
    { name: 'Git', slug: 'git', category: 'DevOps', description: 'Distributed version control system.' },
    { name: 'GitHub', slug: 'github', category: 'DevOps', description: 'Cloud platform for hosting code repositories and collaboration.' },
    { name: 'Docker', slug: 'docker', category: 'DevOps', description: 'Platform for developing, shipping, and running containerized apps.' },
    { name: 'Kubernetes', slug: 'kubernetes', category: 'DevOps', description: 'Container orchestration system for automating application deployment.' },
    { name: 'CI/CD', slug: 'cicd', category: 'DevOps', description: 'Continuous Integration and Continuous Deployment automation pipelines.' },
    { name: 'Linux', slug: 'linux', category: 'DevOps', description: 'Open-source operating system kernel for server infrastructure.' },

    // AI & Machine Learning
    { name: 'Machine Learning', slug: 'machine-learning', category: 'AI & Machine Learning', description: 'Subfield of AI focusing on data-driven statistical models.' },
    { name: 'Deep Learning', slug: 'deep-learning', category: 'AI & Machine Learning', description: 'Neural network architectures for complex pattern recognition.' },
    { name: 'Natural Language Processing', slug: 'nlp', category: 'AI & Machine Learning', description: 'AI subfield for understanding human text and language.' },
    { name: 'Generative AI', slug: 'generative-ai', category: 'AI & Machine Learning', description: 'AI models capable of generating synthetic text, images, and content.' },
    { name: 'Large Language Models', slug: 'llm', category: 'AI & Machine Learning', description: 'Foundation neural network models trained on extensive text datasets.' },
    { name: 'RAG', slug: 'rag', category: 'AI & Machine Learning', description: 'Retrieval-Augmented Generation pattern combining vector search with LLMs.' },
    { name: 'Prompt Engineering', slug: 'prompt-engineering', category: 'AI & Machine Learning', description: 'Structuring text inputs for optimal LLM generation.' },
    { name: 'Vector Databases', slug: 'vector-databases', category: 'AI & Machine Learning', description: 'Databases optimized for indexing high-dimensional vector embeddings.' },

    // Data
    { name: 'Data Structures', slug: 'data-structures', category: 'Data', description: 'Specialized formats for organizing, processing, and storing data.' },
    { name: 'Algorithms', slug: 'algorithms', category: 'Data', description: 'Step-by-step procedures for solving computational problems.' },
    { name: 'Pandas', slug: 'pandas', category: 'Data', description: 'Python library for data manipulation and tabular analysis.' },
    { name: 'NumPy', slug: 'numpy', category: 'Data', description: 'Python library for multi-dimensional numerical computing.' },
    { name: 'Data Visualization', slug: 'data-visualization', category: 'Data', description: 'Graphical representation of data and statistical insights.' },
    { name: 'Statistics', slug: 'statistics', category: 'Data', description: 'Mathematical collection, analysis, interpretation of data.' },

    // Cybersecurity
    { name: 'Network Security', slug: 'network-security', category: 'Cybersecurity', description: 'Policies and practices to prevent unauthorized network access.' },
    { name: 'Application Security', slug: 'app-security', category: 'Cybersecurity', description: 'Measures taken to improve application security and patch vulnerabilities.' },
    { name: 'Authentication', slug: 'authentication', category: 'Cybersecurity', description: 'Verifying identity credentials.' },
    { name: 'Authorization', slug: 'authorization', category: 'Cybersecurity', description: 'Determining user permissions and access rights.' },
    { name: 'Cryptography', slug: 'cryptography', category: 'Cybersecurity', description: 'Securing communications using mathematical algorithms.' },

    // Software Engineering
    { name: 'System Design', slug: 'system-design', category: 'Software Engineering', description: 'Defining architecture, modules, and interfaces for scalable software.' },
    { name: 'Software Architecture', slug: 'software-architecture', category: 'Software Engineering', description: 'High-level structure and design principles of software systems.' },
    { name: 'Object-Oriented Programming', slug: 'oop', category: 'Software Engineering', description: 'Programming paradigm based on objects and classes.' },

    // Professional Skills
    { name: 'Communication', slug: 'communication', category: 'Professional Skills', description: 'Clear technical communication and documentation.' },
    { name: 'Problem Solving', slug: 'problem-solving', category: 'Professional Skills', description: 'Analytical approach to diagnosing and resolving complex technical issues.' },
    { name: 'Teamwork', slug: 'teamwork', category: 'Professional Skills', description: 'Collaborative engineering in Agile and cross-functional teams.' },
    { name: 'Leadership', slug: 'leadership', category: 'Professional Skills', description: 'Guiding technical initiatives and mentoring team members.' }
  ];

  for (const s of skillsData) {
    await queryDatabase(
      `INSERT INTO skills (name, slug, category, description)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         category = EXCLUDED.category,
         description = EXCLUDED.description,
         updated_at = CURRENT_TIMESTAMP`,
      [s.name, s.slug, s.category, s.description]
    );
  }
  logger.info(`Seeded ${skillsData.length} skills reference records.`);

  // 2. SEED CAREER ROLES
  const rolesData = [
    { name: 'Frontend Developer', slug: 'frontend-developer', category: 'Software Engineering', description: 'Builds responsive user interfaces, web applications, and client-side logic.' },
    { name: 'Backend Developer', slug: 'backend-developer', category: 'Software Engineering', description: 'Designs server-side architecture, RESTful APIs, microservices, and database persistence.' },
    { name: 'Full Stack Developer', slug: 'full-stack-developer', category: 'Software Engineering', description: 'Handles client-side user interfaces, server APIs, and database persistence.' },
    { name: 'Software Engineer', slug: 'software-engineer', category: 'Software Engineering', description: 'Applies engineering principles to design, develop, test, and maintain software.' },
    { name: 'Data Analyst', slug: 'data-analyst', category: 'Data & Analytics', description: 'Translates raw tabular data into actionable business intelligence insights.' },
    { name: 'Data Scientist', slug: 'data-scientist', category: 'Data & Analytics', description: 'Applies statistical algorithms, predictive models, and machine learning.' },
    { name: 'Machine Learning Engineer', slug: 'ml-engineer', category: 'Artificial Intelligence', description: 'Deploys machine learning models and training pipelines into production scale.' },
    { name: 'AI Engineer', slug: 'ai-engineer', category: 'Artificial Intelligence', description: 'Integrates LLMs, Generative AI, RAG architectures, and intelligent agents.' },
    { name: 'DevOps Engineer', slug: 'devops-engineer', category: 'Cloud & Infrastructure', description: 'Automates CI/CD deployment pipelines, containerization, and server infrastructure.' },
    { name: 'Cloud Engineer', slug: 'cloud-engineer', category: 'Cloud & Infrastructure', description: 'Architects and manages cloud platform services, networks, and cloud security.' },
    { name: 'Cybersecurity Engineer', slug: 'cybersecurity-engineer', category: 'Security', description: 'Safeguards IT infrastructure, applications, and networks from cyber threats.' },
  ];

  for (const r of rolesData) {
    await queryDatabase(
      `INSERT INTO career_roles (name, slug, category, description)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         category = EXCLUDED.category,
         description = EXCLUDED.description,
         updated_at = CURRENT_TIMESTAMP`,
      [r.name, r.slug, r.category, r.description]
    );
  }
  logger.info(`Seeded ${rolesData.length} target career role reference records.`);

  // 3. SEED ROLE-SKILL MAPPINGS (Benchmark Requirements Matrix)
  const roleSkillMap: { roleSlug: string; skillSlug: string; importance: string; minimumLevel: string }[] = [
    // Full Stack Developer
    { roleSlug: 'full-stack-developer', skillSlug: 'javascript', importance: 'critical', minimumLevel: 'intermediate' },
    { roleSlug: 'full-stack-developer', skillSlug: 'typescript', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'full-stack-developer', skillSlug: 'react', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'full-stack-developer', skillSlug: 'nodejs', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'full-stack-developer', skillSlug: 'expressjs', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'full-stack-developer', skillSlug: 'postgresql', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'full-stack-developer', skillSlug: 'sql', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'full-stack-developer', skillSlug: 'git', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'full-stack-developer', skillSlug: 'html', importance: 'high', minimumLevel: 'advanced' },
    { roleSlug: 'full-stack-developer', skillSlug: 'css', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'full-stack-developer', skillSlug: 'docker', importance: 'medium', minimumLevel: 'beginner' },
    { roleSlug: 'full-stack-developer', skillSlug: 'aws', importance: 'medium', minimumLevel: 'beginner' },

    // Frontend Developer
    { roleSlug: 'frontend-developer', skillSlug: 'javascript', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'frontend-developer', skillSlug: 'react', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'frontend-developer', skillSlug: 'html', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'frontend-developer', skillSlug: 'css', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'frontend-developer', skillSlug: 'typescript', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'frontend-developer', skillSlug: 'nextjs', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'frontend-developer', skillSlug: 'tailwind-css', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'frontend-developer', skillSlug: 'git', importance: 'high', minimumLevel: 'intermediate' },

    // Backend Developer
    { roleSlug: 'backend-developer', skillSlug: 'nodejs', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'backend-developer', skillSlug: 'expressjs', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'backend-developer', skillSlug: 'postgresql', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'backend-developer', skillSlug: 'sql', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'backend-developer', skillSlug: 'rest-apis', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'backend-developer', skillSlug: 'system-design', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'backend-developer', skillSlug: 'typescript', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'backend-developer', skillSlug: 'docker', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'backend-developer', skillSlug: 'git', importance: 'high', minimumLevel: 'intermediate' },

    // AI Engineer
    { roleSlug: 'ai-engineer', skillSlug: 'python', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'ai-engineer', skillSlug: 'rag', importance: 'critical', minimumLevel: 'intermediate' },
    { roleSlug: 'ai-engineer', skillSlug: 'generative-ai', importance: 'critical', minimumLevel: 'intermediate' },
    { roleSlug: 'ai-engineer', skillSlug: 'llm', importance: 'critical', minimumLevel: 'intermediate' },
    { roleSlug: 'ai-engineer', skillSlug: 'prompt-engineering', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'ai-engineer', skillSlug: 'vector-databases', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'ai-engineer', skillSlug: 'machine-learning', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'ai-engineer', skillSlug: 'deep-learning', importance: 'medium', minimumLevel: 'beginner' },
    { roleSlug: 'ai-engineer', skillSlug: 'git', importance: 'high', minimumLevel: 'intermediate' },

    // Data Scientist
    { roleSlug: 'data-scientist', skillSlug: 'python', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'data-scientist', skillSlug: 'machine-learning', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'data-scientist', skillSlug: 'pandas', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'data-scientist', skillSlug: 'numpy', importance: 'high', minimumLevel: 'intermediate' },
    { roleSlug: 'data-scientist', skillSlug: 'sql', importance: 'high', minimumLevel: 'advanced' },
    { roleSlug: 'data-scientist', skillSlug: 'statistics', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'data-scientist', skillSlug: 'deep-learning', importance: 'high', minimumLevel: 'intermediate' },

    // DevOps Engineer
    { roleSlug: 'devops-engineer', skillSlug: 'docker', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'devops-engineer', skillSlug: 'kubernetes', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'devops-engineer', skillSlug: 'cicd', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'devops-engineer', skillSlug: 'linux', importance: 'critical', minimumLevel: 'advanced' },
    { roleSlug: 'devops-engineer', skillSlug: 'git', importance: 'high', minimumLevel: 'advanced' },
    { roleSlug: 'devops-engineer', skillSlug: 'aws', importance: 'high', minimumLevel: 'intermediate' }
  ];

  for (const item of roleSkillMap) {
    await queryDatabase(
      `INSERT INTO career_role_skills (career_role_id, skill_id, importance, minimum_level)
       SELECT c.id, s.id, $3, $4
       FROM career_roles c, skills s
       WHERE c.slug = $1 AND s.slug = $2
       ON CONFLICT (career_role_id, skill_id) DO UPDATE SET
         importance = EXCLUDED.importance,
         minimum_level = EXCLUDED.minimum_level,
         updated_at = CURRENT_TIMESTAMP`,
      [item.roleSlug, item.skillSlug, item.importance, item.minimumLevel]
    );
  }
  logger.info(`Seeded ${roleSkillMap.length} benchmark career_role_skills requirement records.`);
  logger.info('Reference Data Seeding Completed Successfully.');
};
