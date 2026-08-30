from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel
from app.LLM.llm import create_llm
from app.config.settings import settings


class keepDrop(BaseModel):
    keep: bool


llm = create_llm(
    model=settings.GROQ_MODEL,
    api_key=settings.GROQ_API_KEY,
    temperature=0.7,
    max_tokens=2000,
)

filter_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a strict relevance filter.\n"
            "Return keep=true only if the sentence directly helps answer the question.\n"
            "Use ONLY the sentence. Output JSON only.",
        ),
        (
            "human",
            "Question: {question}\n\nSentence:\n{sentence}",
        ),
    ]
)

filter_chain = filter_prompt | llm.with_structured_output(keepDrop)