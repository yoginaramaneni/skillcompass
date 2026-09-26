# SkillCompass — AI-Powered Career Intelligence Platform

> **Tagline**: *"Know where you are. See where the industry is going. Know what to learn next."*

---

## Overview

**SkillCompass** is a full-stack, AI-powered career intelligence and skill development platform. It bridges the gap between self-reported abilities, objective assessment verification, empirical market demand signals, and personalized learning roadmaps.

Unlike generic career recommendation tools, SkillCompass uses a **backend-only Google Gemini 3.8 Flash AI engine** coupled with deterministic database reference logic and dataset trend normalizers to deliver zero-hallucination, evidence-backed career guidance.

---

## 🌟 Key Features

1. **Custom JWT Authentication & Onboarding**: Secure registration, login, and user profile onboarding (`bcrypt` + `JWT` + `Supabase PostgreSQL`).
2. **Career Readiness & Skill Gap Diagnostic**: Real-time readiness gauge comparing demonstrated skills against benchmark career role requirements.
3. **Verified Skills Engine**: Objective multiple-choice assessments that elevate self-reported skills to verified status (`self_reported_level` ➔ `verified_level`).
4. **Market Intelligence & Demand Signals**: Data-driven dataset mention rates and trend directions (`increasing`, `stable`, `decreasing`) with complete source transparency.
5. **Interactive Skill Graph (`/skills`)**: Node-and-edge visual graph connecting Target Career ➔ Required Skills ➔ User Demonstrated Skills ➔ Skill Gaps ➔ AI Recommendations.
6. **Career Role Comparison (`/compare-careers`)**: Side-by-side comparative analysis between any two target career roles (e.g. Frontend Developer vs Full Stack Developer).
7. **Personalized Learning Roadmap**: AI-curated step-by-step curriculum with time estimates, rationale, and hands-on practice projects.
8. **Weekly Learning Plan**: Scheduled calendar tasks and completion progress tracking.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router DOM
- **Backend**: Node.js, Express, TypeScript, Zod Schema Validation, Bcrypt.js, JsonWebToken
- **Database**: Supabase PostgreSQL / PostgreSQL 15+ (`pg` Pool driver)
- **AI Engine**: Backend-only Google Gemini 3.8 Flash SDK (`@google/genai`)

---

## 🔒 Security & Environment Architecture

- **Backend-Only AI**: Google Gemini API calls are strictly executed on the server. Zero API keys or database connection strings exist in the client bundle.
- **Zod Output Validation**: All AI responses pass strict Zod schema validation before persistence.
- **Zero Fabricated Market Stats**: All market signals reflect empirical dataset records; AI is restricted from hallucinating numbers or URLs.
- **Rate Limiting**: Sliding-window rate limiting middleware protects auth and expensive AI endpoints.

---

## ⚙️ Environment Configuration Guide

### 1. Backend Server Environment (`server/.env`)
1. Create `server/.env` by copying `server/.env.example`:
   ```bash
   cp server/.env.example server/.env
   ```
2. Replace placeholders in `server/.env` with your actual development/production values:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173

   DATABASE_URL=YOUR_SUPABASE_POSTGRES_CONNECTION_STRING

   JWT_SECRET=YOUR_JWT_SECRET
   JWT_EXPIRES_IN=7d

   GEMINI_API_KEY=YOUR_GEMINI_API_KEY

   MARKET_DATA_FRESH_DAYS=90
   MARKET_DATA_AGING_DAYS=180
   ```

### 2. Frontend Client Environment (`client/.env`)
1. Create `client/.env` by copying `client/.env.example`:
   ```bash
   cp client/.env.example client/.env
   ```
2. Confirm the API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
   *(Note: Client configuration contains ONLY public API URLs. NEVER add `DATABASE_URL`, `JWT_SECRET`, or `GEMINI_API_KEY` to client `.env` files.)*

### 3. Production Environment Deployment
- **Render (Backend)**: Configure `PORT`, `NODE_ENV`, `CLIENT_URL`, `DATABASE_URL`, `JWT_SECRET`, and `GEMINI_API_KEY` as Render environment secrets.
- **Vercel (Frontend)**: Configure `VITE_API_BASE_URL` pointing to your deployed Render API service URL.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js v18+ & npm
- Supabase PostgreSQL connection string

### 1. Backend Setup & Database Seeding
```bash
cd server
npm install
cp .env.example .env
# Edit server/.env with your Supabase DATABASE_URL, JWT_SECRET, and GEMINI_API_KEY
npm run seed     # Seeds reference careers, skills & market signals into Supabase
npm run dev      # Runs API server at http://localhost:5000
```

### 2. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env
npm run dev      # Runs React client at http://localhost:5173
```

---

## 🧪 Testing & Build Verification

Run backend unit and integration test suite:
```bash
cd server && npm test
```

Run frontend & backend production build verification:
```bash
cd server && npm run build
cd ../client && npm run build
```

---

## 📄 License & Credits
Developed as an AI-powered Career Intelligence Platform. Built with Google Gemini 3.8 Flash.
