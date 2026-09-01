from pydantic import BaseModel, Field
from typing import Optional, List, Any


class SourceItem(BaseModel):
    title: str
    sourceType: str = "syllabus"
    snippet: str
    relevanceScore: Optional[float] = 0.95


class ChatRequest(BaseModel):
    question: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    deep_research: Optional[bool] = False
    web_search: Optional[bool] = False
    model: Optional[str] = "MentorX AI"


class ChatResponse(BaseModel):
    answer: str
    session_id: Optional[str] = None
    sources: List[SourceItem] = []
    verdict: Optional[str] = "good"


class ChatMessageSchema(BaseModel):
    id: str
    role: str
    content: str
    sources: Optional[List[SourceItem]] = []
    verdict: Optional[str] = None
    timestamp: Optional[str] = ""
    createdAt: Optional[str] = ""


class ChatSessionCreate(BaseModel):
    user_id: Optional[str] = None
    title: Optional[str] = "New Conversation"
    session_id: Optional[str] = None


class ChatSessionItem(BaseModel):
    id: str
    title: str
    userId: Optional[str] = None
    createdAt: str
    updatedAt: str
    category: str
    messageCount: Optional[int] = 0


class ChatSessionDetail(BaseModel):
    id: str
    title: str
    userId: Optional[str] = None
    createdAt: str
    updatedAt: str
    category: str
    messages: List[ChatMessageSchema] = []
