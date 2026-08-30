from pydantic import BaseModel
from typing import Optional, List


class ChatRequest(BaseModel):
    question: str
    user_id: Optional[str] = None
    deep_research: Optional[bool] = False
    web_search: Optional[bool] = False


class SourceItem(BaseModel):
    title: str
    sourceType: str
    snippet: str
    relevanceScore: Optional[float] = 0.95


class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceItem] = []
    verdict: Optional[str] = "good"
