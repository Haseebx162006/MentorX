# 🎓 MentorX — AI Academic Intelligence & University Admission Platform

MentorX is an enterprise-grade AI Academic Mentorship Platform designed to empower FSc (Pre-Medical & Pre-Engineering), ICS, and A-Level students across Pakistan with verified university admission guidance, exact aggregate calculations, closing merit predictions, and career stream compatibility.

---

## ✨ Key Features & Recent Enhancements

### 1. Claude-Inspired Chat Interface
- **Minimalist Aesthetic**: Clean proportions, generous reading width, and refined typography preserving MentorX's black-and-white theme.
- **Claude Prompt Input**: Auto-expanding textarea with smooth line-height, clean placeholder, and a circular send button with active/disabled state and stop-generation control.
- **Automated Streaming Auto-Scroll**: Synchronous `useLayoutEffect` scroll-anchoring, `ResizeObserver` for dynamic markdown/table expansions, and intentional wheel-intent tracking.

### 2. Adaptive Agentic RAG Pipeline (LangGraph)
- **Multi-Node StateGraph**: Dynamic execution across `retrieve_node` (Qdrant), `eval_node` (Doc Evaluator LLM), `web_node` (Tavily Search), `combine_docs_node`, `refine` (Sentence Decomposer), and `stream_generation_chain` (Groq LPU).
- **Server-Sent Events (SSE)**: True real-time token-by-token streaming generator with persistent turn storage in Neon PostgreSQL.

### 3. AI Safety Guardrails & Anti-Hallucination
- **Input Injection Defense (`check_input_safety`)**: Sanitizes prompt overrides, role hijack attempts, delimiters, and adversarial inputs before reaching vector or LLM layers.
- **Citation Grounding (`verify_citation_grounding`)**: Cross-checks numerical assertions (aggregate percentages, cutoff numbers, years) and verifies inline citations (`[1]`, `[2]`) against retrieved prospectus chunks.

### 4. Cryptographic RBAC & Dedicated Admin Portal
- **JWT Authentication**: Cryptographic token management (`app.core.security`) using HMAC-SHA256 (`HS256`) and configurable expiration.
- **1-Click Admin Access**: High-visibility **Admin Portal** button directly in the top navigation header and sidebar.
- **Modernized Admin Dashboard**: Segmented tabs for **Student Directory & Access** and **Knowledge Base & Ingestion**, with user blocking/unblocking and direct Qdrant document vectorization.

### 5. Cinematic Welcome Loader
- **Sequential Line Highlighting**: Progressive illumination sequence across the 4 brutalist lines (`MENTORX AGENTS` → `MERIT INGESTION` → `PROSPECTUS RAG` → `CAREER MATRIX` → unison illumination).
- **Cursor Spotlight Effect**: Interactive radial spotlight that tracks your mouse across the words with individual word hover micro-interactions.
- **Reliable Refresh Trigger**: Seamlessly plays on page refresh before routing authenticated supervisors or students.

---

## 🏛️ System Architecture

```mermaid
graph TD
    Client["Client Browser (Next.js 16 + React 19)"]
    FastAPI["FastAPI Backend Microservice"]
    Guardrails["Input Safety & RBAC Guardrails"]
    LangGraph["LangGraph Adaptive RAG Engine"]
    Qdrant[("Qdrant Vector DB")]
    Postgres[("Neon PostgreSQL")]
    Groq["Groq LPU (LLaMA 3.3 70B)"]

    Client -->|SSE Stream / JSON| FastAPI
    FastAPI --> Guardrails
    Guardrails -->|Authorized & Safe| LangGraph
    LangGraph -->|Vector Cosine Search| Qdrant
    LangGraph -->|Inference & Streaming| Groq
    FastAPI -->|Users, Sessions & History| Postgres
```

---

## ⚙️ Environment Configuration

### Backend Configuration (`backend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET_KEY` | Secret key used for cryptographic JWT signing | `your-secure-random-32-byte-string` |
| `JWT_ALGORITHM` | Algorithm for JWT tokens | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifespan | `10080` (7 days) |
| `ADMIN_EMAILS` | Emails granted automatic supervisor status | `haseebahmadcool678@gmail.com,admin@mentorx.edu` |
| `GOOGLE_API_KEY` | Google AI API key for embeddings | `AIzaSy...` |
| `GROQ_API_KEY` | Groq Cloud API key for high-speed inference | `gsk_...` |
| `GROQ_MODEL` | Groq LLM model name | `openai/gpt-oss-120b` |
| `QDRANT_URL` | Qdrant Cloud cluster URL | `https://xyz.qdrant.io` |
| `QDRANT_API_KEY` | Qdrant vector database API key | `your-qdrant-key` |
| `QDRANT_COLLECTION_NAME` | Vector collection name | `mentorx` |
| `TAVILY_API_KEY` | Optional live web search API key | `tvly-...` |
| `LANGCHAIN_TRACING_V2` | Enable LangSmith tracing | `true` |
| `LANGCHAIN_API_KEY` | Optional LangSmith API key | `lsv2_pt_...` |
| `LANGCHAIN_PROJECT` | LangSmith project name | `mentorx` |

### Frontend Configuration (`frontend/.env.local`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend FastAPI service URL | `http://localhost:8000` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Web Client ID | `your-client-id.apps.googleusercontent.com` |

---

## 🚀 Quickstart Guide

### 1. Run Backend Service
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # Configure keys
uvicorn app.main:app --reload --port 8000
```
*API documentation available at `http://localhost:8000/docs`.*

### 2. Run Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Web client accessible at `http://localhost:3000`.*

---

## 🧪 Testing & Verification

```bash
cd backend
# 1. Run AI Safety Guardrails & Injection Tests
PYTHONPATH=. python3 tests/test_guardrails.py

# 2. Run JWT & RBAC Access Control Tests
PYTHONPATH=. python3 tests/test_auth_rbac.py

# 3. Run RAG Triad Benchmark Suite (Faithfulness, Relevance, Context Precision)
PYTHONPATH=. python3 tests/eval_rag_triad.py

cd ../frontend
# 4. Run TypeScript Compilation Check
npx tsc --noEmit
```

---

## 🚢 Deployment Overview

- **Backend**: Deployed on [Render](https://render.com) as an always-on Web Service (or containerized via multi-stage `backend/Dockerfile`), maintaining active connection pooling and unbroken SSE streaming.
- **Frontend**: Deployed on [Vercel](https://vercel.com) or any modern Edge / Node.js hosting platform with environment variable `NEXT_PUBLIC_API_URL` pointing to the Render backend service.
