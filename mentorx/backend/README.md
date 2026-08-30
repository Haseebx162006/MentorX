# ⚡ MentorX Backend API & LangGraph RAG Service

FastAPI-powered backend microservice orchestrating an **Adaptive Agentic RAG Pipeline** with LangGraph, PostgreSQL (Neon) ORM, and Qdrant Vector Store for academic admission guidance.

---

## 🏛️ Architecture & LangGraph Pipeline

```mermaid
graph LR
    subgraph FastAPI_Endpoints["FastAPI Endpoints"]
        Chat["POST /api/chat"]
        Auth["POST /api/auth/google"]
        Admin["POST /api/admin/documents/upload"]
    end

    subgraph LangGraph_RAG["LangGraph StateGraph"]
        Retrieve["1. retrieve_node (Qdrant)"]
        Eval["2. eval_node (Doc Evaluator LLM)"]
        Route{"route_decision"}
        Web["3. web_search (Tavily)"]
        Combine["4. combine_docs"]
        Refine["5. refine (Sentence Filter)"]
        Gen["6. generate_node (Admissions Counselor LLM)"]
    end

    subgraph Data_Stores["Data Stores"]
        Qdrant[("Qdrant Vector DB")]
        Postgres[("PostgreSQL (Neon)")]
    end

    Chat --> Retrieve
    Retrieve -->|Dense Vector Query| Qdrant
    Retrieve --> Eval
    Eval --> Route
    Route -->|good| Refine
    Route -->|mixed| Web
    Route -->|bad| Web
    Web --> Combine
    Combine --> Refine
    Refine --> Gen
    Auth --> Postgres
    Admin --> Postgres
    Admin --> Qdrant
```

---

## 📦 Key Modules

- **`app/Pipeline/`**: LangGraph StateGraph pipeline containing `retrieve_node`, `eval_node`, `refine`, `web_node`, `combine_docs_node`, and `generate_node`.
- **`app/models/`**: SQLAlchemy 2.0 ORM models (`User` and `Document`).
- **`app/api/`**: FastAPI APIRouters for Chat, Authentication, and Admin operations.
- **`app/services/`**: Business logic encapsulation for user management and document ingestion.
- **`app/utility/`**: Structured output Pydantic chains (`doc_eval_chain`, `filter_chain`, `web_rewrite_chain`).
- **`app/Chunker/`**: Recursive text chunking with configurable window and overlap.
- **`app/LLM/`**: LLM factory for Groq LLaMA 3.3 70B and Google Generative AI embeddings.

---

## 🚀 Quickstart

1. **Create Virtual Environment**:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. **Install Dependencies**:
   ```bash
   pip install -e .
   ```
3. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```
4. **Run Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Interactive OpenAPI docs available at `http://localhost:8000/docs`.
