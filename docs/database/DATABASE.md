# SkillCompass Database Documentation

## Database System
**Supabase PostgreSQL** / PostgreSQL 15+

---

## ER Model & Schema Structure

```
users (id, email, password_hash, first_name, last_name)
  │
  ├── profiles (id, user_id, headline, bio, location, education_level, years_of_experience, weekly_learning_hours, target_career_id)
  │     └── FOREIGN KEY (target_career_id) ➔ career_roles(id)
  │
  ├── user_skills (id, user_id, skill_id, self_reported_level, verified_level, years_experience, is_primary)
  │     └── FOREIGN KEY (skill_id) ➔ skills(id)
  │
  ├── ai_generations (id, user_id, generation_type, model, prompt_version, input_context, output_json)
  │
  ├── assessment_submissions (id, user_id, skill_id, score, passed, verified_level, submitted_at)
  │
  └── learning_roadmaps (id, user_id, title, description, target_career_role, total_estimated_hours)
        └── roadmap_items (id, roadmap_id, sequence_number, skill_name, title, priority, why_to_learn, estimated_hours, practice_tasks, status)

Reference Tables:
- career_roles (id, name, slug, category, description)
- skills (id, name, slug, category, description)
- career_role_skills (career_role_id, skill_id, importance, minimum_level)
- market_skill_signals (id, skill_id, time_period, total_job_records, mention_count, mention_rate, trend_direction, freshness_status)
- assessment_questions (id, skill_id, question_text, options_json, correct_option_index, difficulty_level)
```

---

## Integrity & Constraint Guarantees
1. **Foreign Keys & Cascade Deletes**: `user_id` relations maintain `ON DELETE CASCADE` to prevent orphan records.
2. **Unique Constraints**:
   - `users(email)` UNIQUE
   - `skills(slug)` UNIQUE
   - `career_roles(slug)` UNIQUE
   - `user_skills(user_id, skill_id)` UNIQUE ON CONFLICT
3. **Automated Timestamp Triggers**: `updated_at` timestamps update automatically via PostgreSQL triggers.
