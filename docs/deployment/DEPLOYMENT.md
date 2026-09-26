# SkillCompass Deployment Guide

## Overview
SkillCompass is designed for streamlined deployment across Vercel (Frontend), Render (Backend), and Supabase (PostgreSQL Database).

---

## 1. Database Setup (Supabase PostgreSQL)
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Open SQL Editor and execute migration files in order:
   - `server/migrations/001_initial_schema.sql`
   - `server/migrations/002_production_schema.sql`
3. Optionally seed reference roles and market signals:
   - `cd server && npm run seed`
4. Copy Connection String (`DATABASE_URL`).

---

## 2. Backend Deployment (Render)
1. Create a **Web Service** on [render.com](https://render.com) connected to the repository.
2. Settings:
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Environment Variables:
   - `PORT`: `5000` (Render overrides with `$PORT` automatically; backend binds to `0.0.0.0`)
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://your-skillcompass-frontend.vercel.app`
   - `DATABASE_URL`: `<supabase_postgresql_connection_string>`
   - `JWT_SECRET`: `<random_secure_secret>`
   - `GEMINI_API_KEY`: `<google_gemini_api_key>`

---

## 3. Frontend Deployment (Vercel)
1. Import repository on [vercel.com](https://vercel.com).
2. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-skillcompass-backend.onrender.com/api`
4. Deploy! Single Page Application (SPA) rewrite rules are handled automatically via `client/vercel.json` or Vite router.
