# 🔍 MentorX LangSmith Traceable Names Registry

This file documents all `@traceable` functions, their LangSmith run names, run types, and corresponding source files across the MentorX RAG architecture.

---

## Traceable Functions Index

| # | Traceable Name (`name=`) | Function Name | Run Type (`run_type=`) | Source File | Description |
|---|---|---|---|---|---|
| **1** | `mentorx_retrieve_qdrant` | `retrieve_node` | `retriever` | `mentorx/backend/app/Pipeline/retrieve_node.py` | Retrieves top-k matching academic chunks from Qdrant vector database using Google embeddings (`text-embedding-004`). |
| **2** | `mentorx_eval_relevance` | `eval_node` | `chain` | `mentorx/backend/app/Pipeline/eval_node.py` | Evaluates retrieved document chunks against the student query for factual relevance. |
| **3** | `mentorx_refine_context` | `refine` | `chain` | `mentorx/backend/app/Pipeline/refine.py` | Formats and consolidates verified document chunks into a unified context block. |
| **4** | `mentorx_rewrite_query` | `rewrite_query_node` | `chain` | `mentorx/backend/app/Pipeline/web_node.py` | Rewrites ambiguous or stream-transition queries for live web search when local chunks are insufficient. |
| **5** | `mentorx_tavily_web_search` | `web_search_node` | `tool` | `mentorx/backend/app/Pipeline/web_node.py` | Executes live external web searches via Tavily Search tool. |
| **6** | `mentorx_combine_docs` | `combine_docs_node` | `chain` | `mentorx/backend/app/Pipeline/combine_docs_node.py` | Merges local verified prospectus chunks with live web search results. |
| **7** | `mentorx_generate_response` | `generate_node` | `llm` | `mentorx/backend/app/Pipeline/generate_node.py` | Generates final structured admission mentorship guidance using Groq (`openai/gpt-oss-120b`). |
| **8** | `mentorx_stream_generation` | `stream_generation_chain` | `llm` | `mentorx/backend/app/Pipeline/generate_node.py` | Real-time token streaming generator for token-by-token SSE streaming to the client. |
| **9** | `mentorx_rag_workflow` | `execute_rag_pipeline` | `chain` | `mentorx/backend/app/Pipeline/workflow.py` | Top-level LangGraph workflow execution with PostgreSQL checkpointer state. |
