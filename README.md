# TalentFlow AI — AI-Powered Intelligent Hiring & Career Platform

[![Zero-Cost Architecture](https://img.shields.io/badge/Architecture-Zero--Cost%20Production-success)](docs/blueprint.md)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-blue)](backend/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Vanilla%20CSS-purple)](frontend/)
[![AI Orchestrator](https://img.shields.io/badge/AI-Gemini%201.5%2F2.0%20%2B%20Groq%20Fallback-orange)](backend/app/ai/)

**TalentFlow AI** is an enterprise-grade, zero-cost production-ready AI platform designed to transform hiring and career growth. Built with robust fallback orchestration, semantic matching, automated ATS resume scoring, personalized career roadmaps, dynamic mock interviews, and recruiter talent analytics.

---

## 🌟 Key Features

- **Candidate Career Engine**:
  - **ATS Compatibility Scorer**: Detailed formatting & skill gap breakdown with instant scoring.
  - **AI Skill Roadmap**: Interactive step-by-step career path with free resources.
  - **AI Mock Interviewer**: Scenario-based mock interviews with AI evaluation rubrics.
  - **AI Job Recommendations**: Semantic matching using vector embeddings.

- **Recruiter Hiring Hub**:
  - **Smart Job Posting**: Automated requirement breakdown from plain text JDs.
  - **AI Applicant Ranking**: Ranked candidate pool with explainable match rationale.
  - **Natural Language Candidate Search**: Semantic query system across resumes.

- **Resilient AI Architecture**:
  - **Multi-Provider Fallback**: Google Gemini 1.5/2.0 Flash as primary, Groq (Llama 3.3) as instant rate-limit fallback.
  - **Zero-Cost Vectors**: Self-hosted ChromaDB vector database.
  - **Quota Monitoring**: Real-time admin usage logs tracking tokens and fallback events.

---

## 🚀 Quickstart Guide

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
# Windows activate:
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/api/v1/health`

### 2. Frontend Setup (React + Vite)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```
- App UI: `http://localhost:5173`

---

## 🌐 Production Deployment Summary

- **Frontend**: Deploy to Vercel (Hobby Tier - $0/mo)
- **Backend API**: Deploy to Render Web Service or Fly.io ($0/mo)
- **Database**: PostgreSQL on Supabase / Neon ($0/mo)
- **AI Models**: Google AI Studio (Gemini Flash) + Groq Cloud ($0/mo)

See complete deployment instructions in [docs/blueprint.md](docs/blueprint.md).
