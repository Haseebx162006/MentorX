---
name: langsmith-dataset
description: "INVOKE THIS SKILL when creating, managing, or querying LangSmith datasets."
---

# LangSmith Datasets

Manage evaluation datasets using LangSmith client:
```python
from langsmith import Client

client = Client()
dataset = client.create_dataset(
    dataset_name="mentorx_admission_evals",
    description="Evaluation test questions for MentorX admission guidance"
)
```
