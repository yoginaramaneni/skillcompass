# SkillCompass API Documentation

## Base URL
`http://localhost:5000/api` (Development)

## Authentication & Headers
Most endpoints require a valid JWT bearer token in the HTTP Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Register a new user account.
- **Access**: Public (Rate limited: 20 req/15m)
- **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "Password123!",
    "firstName": "Alex",
    "lastName": "Developer"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "uuid", "email": "student@example.com", "firstName": "Alex", "lastName": "Developer" },
      "token": "jwt_token_string"
    }
  }
  ```

### `POST /api/auth/login`
Authenticate existing user.
- **Access**: Public (Rate limited: 20 req/15m)
- **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (`200 OK`): Same format as `/register`.

### `GET /api/auth/me`
Fetch currently authenticated user profile & payload.
- **Access**: Protected (JWT Bearer Token)

---

## 2. Profile & Onboarding (`/api/profile`)

### `GET /api/profile`
Get student profile, target career role details, and demonstrated skills.
- **Access**: Protected

### `POST /api/profile`
Create or update profile details (headline, bio, location, education, experience, target career, demonstrated skills).
- **Access**: Protected

---

## 3. Reference Data Endpoints (`/api/careers`, `/api/skills`)

### `GET /api/careers`
Fetch list of target career roles.
- **Access**: Public / Optional Auth

### `GET /api/careers/:careerId`
Fetch specific career role details and required skills.
- **Access**: Public / Optional Auth

### `GET /api/careers/compare?firstCareerId=<id1>&secondCareerId=<id2>`
Compare two career roles, required skills, importance, and user proficiency match.
- **Access**: Optional Auth (includes user skill match stats if token provided)

### `GET /api/skills`
Fetch reference skills catalog.
- **Access**: Public

---

## 4. AI Skill Intelligence (`/api/ai`)

### `POST /api/ai/skill-intelligence`
Trigger backend Gemini 2.5 Flash analysis comparing user demonstrated skills against target career requirements.
- **Access**: Protected (Rate limited: 10 req/5m)
- **Response** (`200 OK`): Validated `SkillIntelligenceResponse` containing `careerReadiness`, `summary`, `skillGaps`, `recommendedSkills`, `emergingSkills`, and `nextSteps`.

### `GET /api/ai/skill-intelligence/latest`
Fetch latest cached AI skill analysis without triggering new Gemini API call.
- **Access**: Protected

---

## 5. Skill Assessments (`/api/assessments`)

### `GET /api/assessments/skills`
List skills available for assessment.
- **Access**: Protected

### `POST /api/assessments/start`
Start assessment for a skill (returns multiple-choice question set).
- **Access**: Protected

### `POST /api/assessments/:assessmentId/submit`
Submit assessment answers and receive score, evaluation, and updated `verified_level`.
- **Access**: Protected

---

## 6. Personalized Learning Roadmap (`/api/roadmap`)

### `POST /api/roadmap/generate`
Generate AI-driven structured learning curriculum based on validated skill gaps.
- **Access**: Protected (Rate limited)

### `GET /api/roadmap`
Get active learning roadmap.
- **Access**: Protected

### `PUT /api/roadmap/items/:itemId`
Update roadmap module status (`pending`, `in_progress`, `completed`, `skipped`).
- **Access**: Protected

---

## 7. Market Intelligence (`/api/market`)

### `GET /api/market/skills`
Fetch all normalized market skill signals with mention rates and trends.
- **Access**: Public

### `GET /api/market/me`
Fetch personalized market view tailored to user's target career role and demonstrated skills.
- **Access**: Protected

---

## Standard Error Response Format
All errors output standard payload:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | NOT_FOUND | RATE_LIMIT_EXCEEDED | INTERNAL_SERVER_ERROR",
    "message": "Human-readable error description",
    "details": []
  }
}
```
