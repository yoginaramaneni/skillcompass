# SkillCompass AI Engine Documentation

## Overview
SkillCompass integrates **Google Gemini 3.8 Flash** as a backend intelligence engine to synthesize complex user data, target career requirements, skill gap diagnostics, and market demand signals into actionable career guidance.

---

## Architectural Rules & Safety Safeguards

1. **Backend-Only Execution**:
   - All Gemini interactions originate strictly from `server/src/ai/`.
   - `GEMINI_API_KEY` is maintained strictly in server environment configuration.
2. **Structured JSON Output & Zod Validation**:
   - Gemini system prompts require JSON output matching precise schemas.
   - Outputs are parsed using `zod` (`skillIntelligenceResponseSchema`, `learningRoadmapSchema`).
   - If AI returns malformed output, it is rejected and handled gracefully without exposing errors to the client.
3. **No Fabricated Statistics or Claims**:
   - Gemini system prompts explicitly forbid inventing growth percentages, fake salary guarantees, or unverified job market numbers.
   - Deterministic calculations (readiness scores, completion percentages, mention rates) are calculated by backend TypeScript code.
4. **Persistence & Audit Logging**:
   - Validated AI responses are logged to the PostgreSQL `ai_generations` table with metadata (`user_id`, `generation_type`, `model`, `validated_payload`, `created_at`).

---

## AI Prompt Workflows

### 1. Skill Intelligence Engine (`server/src/ai/prompts/skill-intelligence.prompt.ts`)
Synthesizes:
- User profile & education level
- Demonstrated skills (self-reported & verified levels)
- Target career role requirements & importance mapping
- Market dataset signals (mention rate %, trend direction)

Outputs:
- Diagnostic summary
- Career readiness score (0-100%)
- Prioritized skill gaps
- Recommended next skills with effort estimates
- Emerging skills & actionable next steps

### 2. Learning Roadmap Engine (`server/src/ai/prompts/roadmap.prompt.ts`)
Synthesizes user gaps into an ordered, step-by-step curriculum with hands-on practice projects.

### 3. AI Career Coach (`server/src/controllers/ai.controller.ts`)
Interactive conversational assistant providing tailored advice based on user profile context.
