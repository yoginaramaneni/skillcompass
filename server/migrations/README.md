# Database Migrations - SkillCompass

This directory contains SQL migration scripts for Supabase PostgreSQL.

## Migration Principles
- All table schema definitions will be incrementally added in numbered files (`001_...sql`, `002_...sql`).
- Foreign keys and indexes will enforce relational integrity and query performance.
- User data isolation (`user_id` foreign keys) must be strictly enforced on all user-owned tables.
