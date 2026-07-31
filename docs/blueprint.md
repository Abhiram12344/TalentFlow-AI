# TalentFlow AI — Master Technical Blueprint
## AI-Powered Intelligent Hiring & Career Development Platform
### Version 1.0 — Zero-Cost Production Architecture

> **Constraint & Principle**: Every external/third-party service in this blueprint operates on a genuinely free tier (no trial credits that expire, no "free for 14 days" traps). Where a paid service is industry-standard, a free-tier-compatible substitute is specified, with transparent limits.

---

## 0. Free-Services Audit (Source of Truth)

| Layer | Original/Common Choice | Free Substitute Used | Free Tier Limit | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **LLM (reasoning)** | OpenAI GPT-4 | Google Gemini 1.5/2.0 Flash (AI Studio) | 15 RPM / 1,500 requests/day | Rate-limited, zero credit card required. |
| **LLM (fallback)** | OpenAI GPT-4 | Groq (Llama 3.1 / 3.3) | High free RPM/TPM | Ultra-fast inference, secondary fallback. |
| **Embeddings** | OpenAI text-embedding-3 | Gemini `text-embedding-004` or `sentence-transformers` | Self-hosted: unlimited, CPU-based | Local sentence-transformers avoids rate limits. |
| **Vector DB** | Pinecone | ChromaDB (self-hosted) / Qdrant Cloud | Chroma: local storage; Qdrant: 1GB cluster | ChromaDB is zero-cost & simple for MVP. |
| **Relational DB** | AWS RDS | Supabase (Postgres) / Neon Postgres | Supabase: 500MB; Neon: 0.5GB | Production-normalized PostgreSQL. |
| **Cache** | AWS ElastiCache | Upstash Redis Free Tier | 10,000 commands/day, 256MB | Serverless Redis for caching & rate limiting. |
| **Object Storage** | AWS S3 | Cloudflare R2 / Supabase Storage | R2: 10GB storage, $0 egress fees | Zero egress cost for resume/DOCX uploads. |
| **Frontend Hosting** | Vercel Pro | Vercel Free (Hobby) | 100GB bandwidth/mo | Ideal for React + Vite SPA. |
| **Backend Hosting** | AWS ECS | Render Free / Fly.io / Local dev | Render: sleeps after idle; Fly.io: VM allowance | FastAPI lightweight deployment. |
| **CI/CD** | CircleCI | GitHub Actions | 2,000 min/mo private repos | Automated linting & testing pipeline. |
| **Monitoring** | Datadog | Grafana Cloud + Sentry Free Tier | Sentry: 5K errors/mo; Grafana: 10k series | Full observability stack. |
| **Auth** | Auth0 | Self-rolled JWT (FastAPI) / Supabase Auth | Free, bundled | Secure RBAC without vendor lock-in. |
| **Email/Alerts** | SendGrid | Resend Free / Brevo Free | Resend: 3,000 emails/mo (100/day) | Clean transaction email API. |
| **Voice/Speech** | AWS Transcribe | Google Speech-to-Text / Whisper | Whisper small/base local model | True $0 voice interview parsing. |

---

## 1. Software Requirements Specification (SRS)

### 1.1 Functional Requirements
- **Candidate Portal**:
  - Secure registration & authentication (JWT session with candidate role).
  - Resume upload (PDF/DOCX) with automated structural parsing (skills, work history, education).
  - Real-time ATS compatibility scoring & granular improvement feedback.
  - Interactive AI skill-gap analyzer & personalized learning roadmap generation.
  - Text-based & voice mock interview simulator with automated evaluation & rubrics.
  - Job application tracking dashboard & AI semantic job recommendations.
  - Interactive AI Career Coach chat assistant.

- **Recruiter Portal**:
  - Organization registration & RBAC user invitations (`recruiter`, `hiring_manager`, `org_admin`).
  - Job posting editor with AI job description requirement parsing.
  - AI-ranked candidate shortlists (semantic match score + explainable reasoning breakdown).
  - Natural-language semantic talent candidate search.
  - Interview scheduling, feedback collection, and hiring funnel visual analytics.

- **Admin Portal**:
  - User, role, and organization lifecycle management.
  - Real-time AI quota tracking dashboard & multi-provider fallback logs.
  - Knowledge Base RAG document management.

---

## 2. System Architecture

```
                        ┌─────────────────────┐
                        │ TalentFlow React UI │ (Vercel Free)
                        └──────────┬───────────┘
                                   │ HTTPS
                        ┌──────────▼───────────┐
                        │   FastAPI Gateway    │ (Routing, AuthN/AuthZ,
                        │  (Rate Limiting/CORS)│  Render / Fly.io / Local)
                        └──────────┬───────────┘
          ┌───────────┬────────────┼────────────┬─────────────┐
          ▼           ▼            ▼             ▼             ▼
   ┌───────────┐┌───────────┐┌───────────┐┌───────────┐┌───────────────┐
   │   Auth    ││   User    ││  Resume   ││    Job    ││   Interview   │
   │  Service  ││  Service  ││  Service  ││  Service  ││    Service    │
   └─────┬─────┘└─────┬─────┘└─────┬─────┘└─────┬─────┘└───────┬───────┘
         │             │            │            │              │
         └─────────────┴─────┬──────┴────────────┴──────────────┘
                              ▼
                   ┌────────────────────┐
                   │  AI Orchestrator    │ (LangGraph agent router,
                   │  Service            │  provider fallback, cache)
                   └──────────┬─────────┘
              ┌───────────────┼────────────────┐
              ▼                ▼                ▼
      ┌───────────────┐ ┌────────────┐ ┌──────────────────┐
      │ Gemini (Free) │ │ Groq (Free)│ │ Self-Hosted      │
      │ Primary LLM   │ │ Fallback   │ │ sentence-embed   │
      └───────────────┘ └────────────┘ └──────────────────┘

   Data Layer:
   ┌───────────────┐ ┌────────────────┐ ┌───────────────┐ ┌────────────────┐
   │ Postgres      │ │ ChromaDB       │ │ Upstash Redis │ │ Cloudflare R2  │
   │ DB (Neon/Supa)│ │ Vector DB      │ │ Cache / Queue │ │ Resume Storage │
   └───────────────┘ └────────────────┘ └───────────────┘ └────────────────┘
```

---

## 3. Module Architecture & Folder Structure

```
talentflow-ai/
├── frontend/                  # React + Vite + Vanilla CSS / Tailwind (Vercel)
│   ├── src/
│   │   ├── components/        # Reusable UI elements (Buttons, Glass Cards, Badges)
│   │   ├── modules/
│   │   │   ├── candidate/     # Candidate Portal, Resume Analyzer, Roadmap, Mock Interviews
│   │   │   ├── recruiter/     # Recruiter Portal, Job Management, Applicant Matcher
│   │   │   ├── admin/         # Admin & AI Quota Analytics Dashboard
│   │   │   └── auth/          # Login, Register, Protected Routes
│   │   ├── services/          # API Client Layer (Axios / Fetch)
│   │   └── context/           # Auth & Application State
├── backend/                   # FastAPI Backend Application
│   ├── app/
│   │   ├── api/v1/            # API Route Handlers per module
│   │   ├── services/          # Core Business logic
│   │   ├── ai/                # AI Orchestrator, LangChain/LangGraph routers
│   │   ├── models/            # SQLAlchemy / Pydantic Data Models
│   │   ├── schemas/           # API request/response schemas
│   │   └── core/              # Config, Security, JWT, DB engine
│   └── tests/                 # Pytest test suite
├── ai-services/               # Standalone AI modules & ChromaDB client
└── docs/
    └── blueprint.md           # Master Blueprint documentation
```

---

## 4. Development Roadmap

1. **M1 — Foundation**: Auth Service, JWT RBAC, Database Schemas, FastAPI Skeleton.
2. **M2 — Resume Engine**: PDF/DOCX Parsing, Rule & AI-driven ATS Compatibility Scorer.
3. **M3 — Vector & Semantic Search**: ChromaDB integration, candidate ↔ job embedding matcher.
4. **M4 — Resilient AI Orchestrator**: Provider router (Gemini → Groq fallback), Redis caching, token logging.
5. **M5 — Career & Skill Gap Coach**: Skill gap identification agent + interactive learning roadmap.
6. **M6 — Recruiter Portal**: Smart Job Posting, Candidate AI Ranking with Explainable Insights.
7. **M7 — Mock Interview Center**: Dynamic question generator & AI audio/text performance evaluator.
8. **M8 — Admin & Quota Dashboard**: AI usage analytics, quota monitor, system health checks.
9. **M9 — Async Queue & Notifications**: Async worker for parsing & email dispatch (Resend/Brevo).
10. **M10 — Production CI/CD & Deployment**: GitHub Actions workflow & cloud hosting deployment.
