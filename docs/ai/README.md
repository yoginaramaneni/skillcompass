# AI Integration Specification - SkillCompass

## Overview
SkillCompass leverages **Google Gemini API** (`gemini-3.8-flash` or latest standard Gemini models) for AI-driven intelligence:

1. **Personalized Learning Roadmaps**: Structuring milestone-based learning plans.
2. **Skill Gap Diagnostics**: Contextual interpretation of missing technical and soft skills.
3. **AI Career Coach**: Interactive conversational guidance focused on skill acquisition.

---

## Strict AI Guardrails & Architecture Rules

1. **Backend Isolation**:
   - The React client NEVER makes direct HTTP requests to Gemini.
   - All AI calls originate from `server/src/ai/gemini.service.ts`.
   - `GEMINI_API_KEY` is loaded strictly on the backend.

2. **Structured Outputs & Schema Validation**:
   - AI responses must request JSON outputs using Gemini system instructions.
   - Every AI response must be validated using **Zod** schemas (`server/src/ai/schemas/`) before returning data to the client or persisting to PostgreSQL.

3. **Anti-Hallucination & Fallback Policy**:
   - If AI response fails Zod validation, the system falls back safely without throwing unhandled exceptions.
   - System prompts enforce factual, career-focused advice without fake statistical guarantees.

---

## Directory Layout (`server/src/ai/`)

- `gemini.client.ts`: Google Gemini SDK initialization and client instance export.
- `gemini.service.ts`: Core AI invocation methods (e.g. `generateRoadmap()`, `chatWithCoach()`).
- `prompts/`: Standardized system prompt templates.
- `schemas/`: Zod schemas for AI response validation.

---

## Status
> **Step 1 Foundation**: AI module structure established. Gemini SDK client initialized cleanly with environment variable isolation. Prompts and generators will be implemented in subsequent steps.
