from pydantic import BaseModel
from LLM.llm import create_llm
from langchain_core.prompts import ChatPromptTemplate
from config.settings import settings
class WebQuery( BaseModel):
    query: str

llm = create_llm(model=settings.GROQ_MODEL, api_key=settings.GROQ_API_KEY, temperature=0.7, max_tokens=2000)

rewrite_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Rewrite the user question into a web search query composed of keywords.\n"
            "Rules:\n"
            "- Keep it short (6-14 words).\n"
            "- If the question implies recency (e.g., recent/latest/last week/last month), add a constraint like (last\n"
            "- Do NOT answer the question.\n"
            "- Return JSON with a single key: query",
        ),
        ("human", "Question: {question}"),
    ]
)

rewrite_chain = rewrite_prompt | llm.with_structured_output(WebQuery)


