# SkillCompass Architecture Documentation

## System Architecture Overview

SkillCompass is built on a clean 3-tier full-stack architecture with strict separation of concerns, backend-only AI integration, deterministic fallback logic, and real-time market signal processing.

```
┌─────────────────────────────────────────────────────────────┐
│                       REACT FRONTEND                        │
│          Vite + React + TypeScript + Tailwind CSS           │
│   (Dashboard, Skill Graph, Roadmap, Assessments, Market)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST (JWT Auth)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    NODE.JS / EXPRESS API                    │
│    Controllers ➔ Services ➔ Repositories ➔ Zod Validation   │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐┌─────────────────────────────┐
│   SUPABASE POSTGRESQL DB     ││   BACKEND GEMINI AI ENGINE  │
│ Auth, Profiles, Skills, Gaps ││ Gemini 3.8 Flash + Zod Parse│
│ Roadmaps, Market Signals     ││  (Strict Backend-Only Calls)│
└──────────────────────────────┘└─────────────────────────────┘
```

---

## Key Design Principles

1. **Backend-Only AI Execution**:
   - Google Gemini API calls are strictly executed on the Node.js backend (`server/src/ai/`).
   - The frontend React client NEVER imports `@google/genai` nor holds `GEMINI_API_KEY`.
2. **Deterministic Calculations & Zod Validation**:
   - Readiness scores, profile completion percentages, and market mention rates are calculated deterministically by backend code.
   - All AI responses are validated against strict Zod schemas before being accepted or stored.
3. **Data-Driven Market Intelligence**:
   - Market signals reflect normalized industry datasets across quarterly snapshot benchmarks (`2026-Q1`, `2026-Q2`, `2026-Q3`).
   - Zero fabricated market statistics; all signals disclose exact dataset record counts and snapshot period.
4. **Self-Reported vs Verified Skill Distinction**:
   - Users declare initial proficiency via onboarding (`self_reported_level`).
   - Objective multiple-choice assessments grant empirical verification (`verified_level`).

---

## Directory Structure
- `client/src/`:
  - `components/`: UI components categorized by feature (dashboard, market, roadmap, assessment, UI primitives).
  - `pages/`: Page containers (`DashboardPage`, `SkillsPage`, `CareerComparisonPage`, `MarketTrendsPage`, `RoadmapPage`, `AssessmentsPage`, `OnboardingPage`).
  - `services/`: API wrappers (`auth`, `profile`, `ai`, `roadmap`, `assessment`, `market`, `careers`).
  - `types/`: Strongly-typed TypeScript interfaces.
- `server/src/`:
  - `ai/`: Gemini client, context builders, prompt generators, skill intelligence service.
  - `controllers/`: HTTP request handlers.
  - `middleware/`: Auth (JWT), rate limiting, error handling, 404 handler.
  - `repositories/`: Database queries and fallback static reference mappings.
  - `routes/`: Express endpoint definitions.
  - `schemas/`: Zod validation schemas for AI payloads, auth, profile, and market datasets.
  - `services/`: Business logic, skill normalizer, trend service, roadmap engine, career comparison.
