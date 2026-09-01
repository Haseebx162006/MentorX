---
name: langsmith-trace
description: "INVOKE THIS SKILL when working with LangSmith tracing OR querying traces. Covers adding tracing to applications and querying/exporting trace data. Uses the langsmith CLI tool."
---

# LangSmith Tracing

## Setup & Environment Variables
```bash
LANGSMITH_TRACING=true
LANGCHAIN_TRACING_V2=true
LANGSMITH_API_KEY=lsv2_...
LANGSMITH_PROJECT=mentorx
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
```

## LangChain & LangGraph Automatic Tracing
For LangChain/LangGraph applications, tracing is automatic when the above environment variables are set.

## Custom Traceable Decorator
Use `@traceable` from `langsmith` for granular pipeline, node, or function-level tracing:
```python
from langsmith import traceable

@traceable(name="mentorx_rag_pipeline")
def execute_rag(question: str):
    ...
```
