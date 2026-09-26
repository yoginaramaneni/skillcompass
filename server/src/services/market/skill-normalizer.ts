import { STATIC_SKILLS_REFERENCE } from '../../repositories/skill.repository';

// Alias dictionary mapping common variations to canonical slugs
const ALIAS_MAP: Record<string, string> = {
  'react.js': 'react',
  'reactjs': 'react',
  'react js': 'react',
  'react': 'react',

  'nodejs': 'nodejs',
  'node.js': 'nodejs',
  'node js': 'nodejs',
  'node': 'nodejs',

  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'postgresql database': 'postgresql',
  'pg': 'postgresql',

  'typescript': 'typescript',
  'ts': 'typescript',

  'javascript': 'javascript',
  'js': 'javascript',

  'python': 'python',
  'py': 'python',

  'c++': 'cpp',
  'cpp': 'cpp',
  'c#': 'csharp',
  'c sharp': 'csharp',

  'vue': 'vuejs',
  'vue.js': 'vuejs',
  'vuejs': 'vuejs',

  'express': 'expressjs',
  'express.js': 'expressjs',
  'expressjs': 'expressjs',

  'tailwind': 'tailwind-css',
  'tailwindcss': 'tailwind-css',
  'tailwind css': 'tailwind-css',

  'spring': 'spring-boot',
  'springboot': 'spring-boot',
  'spring boot': 'spring-boot',

  'git': 'git',
  'docker': 'docker',
  'k8s': 'kubernetes',
  'kubernetes': 'kubernetes',

  'aws': 'aws',
  'amazon web services': 'aws',

  'system design': 'system-design',
  'sql': 'sql',

  'rag': 'rag',
  'llm': 'llm',
  'generative ai': 'generative-ai',
  'genai': 'generative-ai',
};

export class SkillNormalizer {
  normalizeToSlug(rawSkillName: string): string {
    if (!rawSkillName) return 'unknown';
    const clean = rawSkillName.trim().toLowerCase();
    return ALIAS_MAP[clean] || clean.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  getCanonicalName(rawSkillName: string): { slug: string; name: string } {
    const slug = this.normalizeToSlug(rawSkillName);
    const match = STATIC_SKILLS_REFERENCE.find((s) => s.slug === slug);

    if (match) {
      return { slug: match.slug, name: match.name };
    }

    // Capitalize fallback if not found in reference dataset
    const formattedName = rawSkillName
      .trim()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return { slug, name: formattedName };
  }
}

export const skillNormalizer = new SkillNormalizer();
