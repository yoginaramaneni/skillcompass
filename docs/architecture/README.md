# Architecture Specification - SkillCompass

## Overview
SkillCompass implements a strict 3-tier architecture:

1. **Presentation Layer (Frontend)**: React 18, Vite, TypeScript, Tailwind CSS, React Router DOM.
2. **Application / Business Logic Layer (Backend)**: Express.js, TypeScript, Node.js.
3. **Data & AI Layer**: Supabase PostgreSQL & Google Gemini API.

```
+--------------------------------------------------------+
|                     Client (Vercel)                    |
|          React + Vite + TypeScript + React Router      |
+--------------------------------------------------------+
                           |
                     HTTP REST API (JWT)
                           v
+--------------------------------------------------------+
|                     Server (Render)                    |
|      Express + Router + Controller + Service + Repo    |
+--------------------------------------------------------+
               /                        \
        SQL (Pool)                   HTTPS (JSON)
             v                            v
+------------------------+   +---------------------------+
|  Supabase PostgreSQL   |   |   Google Gemini API       |
|  (Data Isolation)      |   |   (Backend Only)          |
+------------------------+   +---------------------------+
```

---

## Key Architectural Boundaries

1. **Security Isolation**:
   - The React frontend NEVER accesses Supabase PostgreSQL directly.
   - The React frontend NEVER calls the Gemini API directly.
   - The Gemini API Key resides strictly in backend environment variables.

2. **Authentication Flow**:
   - Primary user authentication is handled via custom Express endpoints (`/api/auth/register`, `/api/auth/login`).
   - Passwords are hashed using `bcryptjs` with salt rounds = 10.
   - Authenticated sessions issue signed JSON Web Tokens (JWT).
   - Frontend stores JWT in secure state/storage and passes `Authorization: Bearer <token>` on protected routes.

3. **Backend Layering Pattern**:
   - `Route`: Defines endpoint path & attaches HTTP verbs and middlewares.
   - `Controller`: Extracts request params/body, invokes Service, formats JSON response.
   - `Service`: Encapsulates business logic, data isolation rules, and orchestration.
   - `Repository`: Executes database queries against Supabase PostgreSQL.
   - `AI`: Formats structured prompts, calls Gemini SDK, validates responses with Zod schemas.

---

## Status
> **Step 1 Foundation**: Architecture boundaries and folder structure established. Implementation details to be built in subsequent steps.
