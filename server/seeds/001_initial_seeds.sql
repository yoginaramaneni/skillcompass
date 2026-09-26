-- SkillCompass Step 2: Canonical Reference Seed Data

-- 1. SEED SKILLS
INSERT INTO skills (name, slug, category, description) VALUES
('Python', 'python', 'Programming Languages', 'High-level programming language popular for AI, data science, and web backends.'),
('JavaScript', 'javascript', 'Programming Languages', 'Core programming language of the web for browser and Node.js environments.'),
('TypeScript', 'typescript', 'Programming Languages', 'Strongly typed superset of JavaScript.'),
('React', 'react', 'Frontend Frameworks', 'Declarative, component-based UI library for web interfaces.'),
('Node.js', 'nodejs', 'Backend Runtimes', 'Asynchronous event-driven JavaScript runtime built on Chrome V8 engine.'),
('SQL', 'sql', 'Databases', 'Domain-specific language used in programming and managing relational databases.'),
('PostgreSQL', 'postgresql', 'Databases', 'Advanced open-source relational database management system.'),
('Machine Learning', 'machine-learning', 'Artificial Intelligence', 'Subfield of AI focusing on data-driven statistical models.'),
('Deep Learning', 'deep-learning', 'Artificial Intelligence', 'Subfield of ML based on artificial neural networks with representation learning.'),
('RAG', 'rag', 'Artificial Intelligence', 'Retrieval-Augmented Generation pattern combining vector search with LLMs.'),
('Cloud Computing', 'cloud-computing', 'Infrastructure', 'On-demand availability of computer system resources and cloud services.'),
('Docker', 'docker', 'DevOps', 'Platform for developing, shipping, and running applications in containers.'),
('Git', 'git', 'Developer Tools', 'Distributed version control system for tracking changes in source code.'),
('Cybersecurity', 'cybersecurity', 'Security', 'Practice of protecting systems, networks, and programs from digital attacks.'),
('REST APIs', 'rest-apis', 'Web Development', 'Architectural style for designing networked application APIs.'),
('System Design', 'system-design', 'Software Engineering', 'Process of defining the architecture, modules, and interfaces for scalable software.')
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED CAREER ROLES
INSERT INTO career_roles (name, slug, description, category) VALUES
('Frontend Developer', 'frontend-developer', 'Builds responsive user interfaces and client-side web applications.', 'Software Engineering'),
('Backend Developer', 'backend-developer', 'Designs server-side logic, database schemas, and RESTful APIs.', 'Software Engineering'),
('Full Stack Developer', 'full-stack-developer', 'Handles client-side interfaces, server APIs, and database persistence.', 'Software Engineering'),
('Data Analyst', 'data-analyst', 'Translates raw data into actionable business intelligence insights.', 'Data & Analytics'),
('Data Scientist', 'data-scientist', 'Applies statistical algorithms, ML models, and predictive analytics.', 'Data & Analytics'),
('ML Engineer', 'ml-engineer', 'Deploys machine learning models to production scale.', 'Artificial Intelligence'),
('AI Engineer', 'ai-engineer', 'Integrates LLMs, generative AI, RAG systems, and AI workflows.', 'Artificial Intelligence'),
('Cybersecurity Analyst', 'cybersecurity-analyst', 'Monitors and safeguards IT infrastructures against security threats.', 'Security'),
('Cloud Engineer', 'cloud-engineer', 'Manages cloud infrastructure architectures and cloud platform services.', 'Cloud & Infrastructure'),
('DevOps Engineer', 'devops-engineer', 'Automates CI/CD deployment pipelines, containerization, and operations.', 'Cloud & Infrastructure')
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED CAREER ROLE SKILLS (Sample benchmark requirements)
-- Connect Full Stack Developer to React, Node.js, PostgreSQL, TypeScript, Git
INSERT INTO career_role_skills (career_role_id, skill_id, importance, minimum_level)
SELECT c.id, s.id, 'critical', 'intermediate'
FROM career_roles c, skills s
WHERE c.slug = 'full-stack-developer' AND s.slug IN ('javascript', 'typescript', 'react', 'nodejs', 'postgresql', 'git')
ON CONFLICT (career_role_id, skill_id) DO NOTHING;

-- Connect AI Engineer to Python, Machine Learning, Deep Learning, RAG
INSERT INTO career_role_skills (career_role_id, skill_id, importance, minimum_level)
SELECT c.id, s.id, 'critical', 'advanced'
FROM career_roles c, skills s
WHERE c.slug = 'ai-engineer' AND s.slug IN ('python', 'machine-learning', 'deep-learning', 'rag')
ON CONFLICT (career_role_id, skill_id) DO NOTHING;
