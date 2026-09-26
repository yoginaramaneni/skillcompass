# API Specification - SkillCompass

## Overview
SkillCompass backend provides a structured RESTful API under the `/api` prefix.

---

## Endpoint Catalog

### 1. System Health
- `GET /api/health`: Public system health check.

### 2. Authentication (`/api/auth`)
- `POST /api/auth/register`: Create student account.
- `POST /api/auth/login`: Authenticate user and receive JWT.
- `GET /api/auth/me`: Fetch authenticated user identity.

### 3. Student Profile (`/api/profile`)
- `GET /api/profile`: Fetch student profile.
- `PUT /api/profile`: Update profile info, education, experience.

### 4. Skills (`/api/skills`)
- `GET /api/skills`: Search master skills catalog.
- `GET /api/skills/user`: Fetch authenticated user's skills.
- `POST /api/skills/user`: Add or update user skill.
- `DELETE /api/skills/user/:skillId`: Remove user skill.

### 5. Assessments (`/api/assessments`)
- `GET /api/assessments`: List available assessments.
- `POST /api/assessments/start`: Initiate a skill test.
- `POST /api/assessments/submit`: Submit assessment responses.

### 6. Careers (`/api/careers`)
- `GET /api/careers`: Explore target career roles.
- `GET /api/careers/:careerId`: Detailed role overview & required skills.

### 7. Skill Gaps (`/api/skill-gaps`)
- `GET /api/skill-gaps`: Compute gap between user skills and target career.

### 8. Roadmaps (`/api/roadmap`)
- `GET /api/roadmap`: Fetch personal learning roadmap.
- `POST /api/roadmap/generate`: Request new roadmap generation.

### 9. Weekly Learning Plans (`/api/learning-plans`)
- `GET /api/learning-plans`: Fetch active weekly tasks.
- `PATCH /api/learning-plans/tasks/:taskId`: Toggle task completion.

### 10. Industry Market Trends (`/api/market`)
- `GET /api/market/trends`: Fetch trending and emerging skills.

### 11. AI Career Coach (`/api/ai`)
- `POST /api/ai/coach/chat`: Send prompt to AI Career Coach.
- `POST /api/ai/recommendations`: Generate AI career advice.

---

## Standard JSON Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired authentication token"
  }
}
```

---

## Status
> **Step 1 Foundation**: API routing skeleton mounted. Controllers return structured foundation responses. Logic will be implemented in subsequent steps.
