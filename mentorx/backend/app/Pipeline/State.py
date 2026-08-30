from pydantic import BaseModel
from typing import List
from langchain_core.documents import Document       
class State(BaseModel):
    question : str
    docs : List[Document]
    answer: str

    strips: List[str]
    kept_strips: List[str]

    refined_context: str


    good_docs: List[Document]
    verdict: str
    reason: str


    web_docs: List[Document]
    web_query: str
    