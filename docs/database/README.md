# Database Architecture & Schema Specification - SkillCompass

## Database Engine & Setup
- **Engine**: Supabase PostgreSQL
- **Primary Keys**: UUID generated with `gen_random_uuid()`
- **Timestamps**: `TIMESTAMPTZ` with automated `update_updated_at_column()` triggers
- **Primary Auth**: Custom backend JWT auth (`users` table with `bcrypt` password hashes)
- **Isolation Principle**: All student data entities enforce strict `user_id` foreign key isolation.

---

## Completed Table DDL Specifications (23 Tables)

1. `users`: Identity credentials & bcrypt password hash.
2. `career_roles`: Master global taxonomy of career roles.
3. `profiles`: Student bio, education level, experience, target role.
4. `education`: Student academic history records.
5. `courses`: Completed student courses and certificate references.
6. `skills`: Canonical global master list of technical & soft skills.
7. `user_skills`: Demonstrated student skills, self-reported level vs. verified level.
8. `projects`: Student technical projects & repository links.
9. `project_skills`: Cross-reference connecting projects to demonstrated skills.
10. `certifications`: Industry certifications & issuer details.
11. `experience`: Student internships and employment history.
12. `experience_skills`: Cross-reference connecting work experience to skills.
13. `career_role_skills`: Industry requirements for target career roles with importance & minimum level.
14. `assessments`: Student skill evaluation sessions.
15. `assessment_questions`: Question bank for skill evaluations.
16. `assessment_answers`: Student attempt responses & scores.
17. `skill_gaps`: Calculated gaps between student skills and target career role requirements.
18. `learning_roadmaps`: Generated learning paths for bridging identified skill gaps.
19. `roadmap_items`: Milestone skill goals and sequence ordering within a roadmap.
20. `learning_plan_tasks`: Actionable weekly tasks supporting roadmap items.
21. `market_skills`: Extracted market data skill references.
22. `market_skill_trends`: Time-series demand trends and regional observations.
23. `ai_generations`: Audit log of AI prompts, JSON outputs, and model parameters.

---

## SQL Migration & Seed Files

- Migration DDL: `server/migrations/002_production_schema.sql`
- Reference Seeds: `server/seeds/001_initial_seeds.sql`
- TypeScript Interfaces: `server/src/types/db.types.ts`
- Repositories: `server/src/repositories/`

---

## Status
> **Step 2 Completed**: Complete 23-table schema DDL migration, reference seeds, TypeScript interfaces, and backend repository access layers created.
