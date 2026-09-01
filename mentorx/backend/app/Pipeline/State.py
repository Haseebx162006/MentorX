from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from langchain_core.documents import Document


class State(BaseModel):
    question: str
    docs: List[Document] = Field(default_factory=list)
    answer: str = ""

    strips: List[str] = Field(default_factory=list)
    kept_strips: List[str] = Field(default_factory=list)

    refined_context: str = ""

    good_docs: List[Document] = Field(default_factory=list)
    verdict: str = "good"
    reason: str = ""

    web_docs: List[Document] = Field(default_factory=list)
    web_query: str = ""

    # Short-term conversational memory
    history: List[Dict[str, str]] = Field(default_factory=list)