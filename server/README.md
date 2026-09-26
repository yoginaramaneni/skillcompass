# SkillCompass Server

Node.js + Express + TypeScript backend service for SkillCompass.

## Features & Architecture

- **RESTful API Architecture**: Divided cleanly into Routes, Controllers, Services, Repositories.
- **Supabase PostgreSQL Connection Foundation**: `server/src/db/index.ts` pool setup.
- **Backend-Only Gemini Integration**: Isolated inside `server/src/ai/`.
- **JWT & bcrypt Auth Foundation**: Schema validation and token handling stubs.
- **Render Deployment Ready**: Includes standard build (`npm run build`) and start (`npm start`) scripts.

## API Base Route

`/api`

Health Endpoint: `GET /api/health`

## Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=
```
