---
name: langsmith-evaluator
description: "INVOKE THIS SKILL when writing or running LangSmith evaluators."
---

# LangSmith Evaluator

Run evaluations against LangSmith datasets:
```python
from langsmith.evaluation import evaluate

# Run evaluation job
experiment_results = evaluate(
    target=rag_pipeline,
    data="mentorx_admission_evals",
    evaluators=[...],
    experiment_prefix="mentorx-eval"
)
```
