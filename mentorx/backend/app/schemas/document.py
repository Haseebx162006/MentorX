from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class DocumentBase(BaseModel):
    title: str
    subject: str = "Physics"
    board: str = "Punjab Board"


class DocumentResponse(BaseModel):
    id: str
    filename: str
    title: str
    subject: str
    board: str
    chunk_count: int
    status: str
    uploaded_by: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class DocumentUploadResponse(BaseModel):
    message: str
    document: DocumentResponse
