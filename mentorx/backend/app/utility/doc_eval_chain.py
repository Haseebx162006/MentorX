from langchain_core.prompts import ChatPromptTemplate
from LLM.llm import create_llm
from config.settings import settings
from pydantic import BaseModel


llm= create_llm(model=settings.GROQ_MODEL, api_key=settings.GROQ_API_KEY, temperature=0.7, max_tokens=2000)
class DocEvalScore:
    score: float
    reason: str

doc_eval_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a strict retrieval evaluator for RAG.\n"
            "You will be given ONE retrieved chunk and a question.\n"
            "Return a relevance score in [0.0, 1.0].\n"
            "- 1.0: chunk alone is sufficient to answer fully/mostly\n"
            "- 0.0: chunk is irrelevant\n"
            "Be conservative with high scores.\n"
            "Also return a short reason.\n"
            "Output JSON only.",
        ),
        ("human", "Question: {question}\n\nChunk:\n{chunk}"),
    ]
)

doc_eval_chain = doc_eval_prompt | llm.with_structured_output(DocEvalScore)
