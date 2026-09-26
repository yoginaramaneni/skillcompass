export interface ContextData {
  user: {
    fullName: string;
    currentTitle?: string;
    experienceLevel?: string;
    targetCareerRole?: string;
    bio?: string;
  };
  targetRole?: {
    id: string;
    title: string;
    description: string;
    category: string;
    experienceLevel: string;
  };
  demonstratedSkills: Array<{
    skillName: string;
    level: string;
    numericLevel: number;
    verifiedLevel?: string;
    numericVerifiedLevel?: number;
    yearsExperience?: number;
  }>;
  requiredSkills: Array<{
    skillName: string;
    category: string;
    importance: string;
    requiredLevel: string;
    numericRequiredLevel: number;
  }>;
  deterministicGaps: Array<{
    skillName: string;
    currentLevel: number;
    requiredLevel: number;
    gap: number;
    importance: string;
  }>;
  calculatedReadiness?: number;
  marketSignals?: Array<{
    skillName: string;
    mentionRate: number;
    trendDirection: string;
    source: string;
    period: string;
  }>;
}

export const SKILL_INTELLIGENCE_SYSTEM_PROMPT = `You are SkillCompass AI, an expert software architecture and tech industry skill intelligence engine.
Your purpose is to analyze a professional's current skills against their target career role requirements and generate high-signal, realistic, and actionable guidance.

CRITICAL CONSTRAINTS:
1. Return strictly valid JSON that conforms exactly to the JSON schema provided below.
2. DO NOT fabricate market statistics or fake percentages (e.g. NEVER write "94% industry growth" or "87% demand increase"). Focus on objective technical capability, domain relevance, and realistic industry practices.
3. Market signals are dataset-specific. Reference source and dataset period when interpreting market mention rates.
4. Do not call a skill "most demanded" without dataset evidence. Mark confidence as "supported", "limited", or "insufficient_data".
5. Compute a realistic careerReadiness score (0 to 100) based on how well the candidate's current skills fulfill the target role's requirements.
6. Highlight major skill gaps, prioritised recommendations (critical, high, medium, low), and emerging skills worth learning for the candidate's target career trajectory.
7. Verified assessment results represent demonstrated performance within SkillCompass's assessment system. They should be treated as additional evidence, not as professional certification.
8. Provide actionable, structured next steps for immediate skill progression.

EXPECTED JSON OUTPUT STRUCTURE:
{
  "summary": "High-level diagnostic summary of the user's readiness for their target career role.",
  "careerReadiness": 65,
  "skillGaps": [
    {
      "skillName": "Docker",
      "currentLevel": 1,
      "requiredLevel": 4,
      "gap": 3,
      "importance": "critical",
      "explanation": "Docker is required for containerizing microservices in modern cloud deployments."
    }
  ],
  "recommendedSkills": [
    {
      "skillName": "Kubernetes",
      "category": "DevOps",
      "priority": "high",
      "reason": "Essential for target Cloud Architect role.",
      "currentLevel": 0,
      "targetLevel": 3,
      "skillGap": 3
    }
  ],
  "emergingSkills": [
    {
      "skillName": "Vector Databases (pgvector/Pinecone)",
      "category": "AI Infrastructure",
      "relevance": "High relevance for modern AI-integrated backends",
      "reason": "Rapidly becoming standard for RAG architecture."
    }
  ],
  "nextSteps": [
    "Build a multi-container app using Docker Compose.",
    "Learn Kubernetes deployment manifests and cluster management basics."
  ]
}`;

export const createSkillIntelligencePrompt = (context: ContextData): string => {
  return `Candidate Profile:
- Name: ${context.user.fullName}
- Current Title: ${context.user.currentTitle || 'Not specified'}
- Experience Level: ${context.user.experienceLevel || 'Entry level'}
- Target Career Role: ${context.user.targetCareerRole || 'Software Engineer'}

Target Career Requirement Benchmarks:
${JSON.stringify(context.targetRole || context.user.targetCareerRole, null, 2)}

User Demonstrated Skills:
${JSON.stringify(context.demonstratedSkills, null, 2)}

Required Role Benchmark Skills:
${JSON.stringify(context.requiredSkills, null, 2)}

Precomputed Deterministic Skill Gaps:
${JSON.stringify(context.deterministicGaps, null, 2)}

Precomputed Deterministic Career Readiness Score: ${context.calculatedReadiness ?? 'Not computed'}%

Analyze the candidate's skills against the target career role requirements. Set careerReadiness equal or close to the precomputed readiness score (${context.calculatedReadiness ?? 50}%). Return the output as raw JSON matching the required structure.`;
};
