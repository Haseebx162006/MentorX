import re
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.LLM.llm import create_llm
from app.config.settings import settings


class WebQuery(BaseModel):
    query: str


llm = create_llm(
    model=settings.GROQ_MODEL,
    api_key=settings.GROQ_API_KEY,
    temperature=0.2,
    max_tokens=100,
)

rewrite_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a search query optimizer. Given a user question, rewrite it into a clear, concise keyword search query (3 to 8 words) for Google/Tavily search.\n"
            "Do NOT answer the question.\n"
            "Output ONLY the search query text, without quotes or additional text.",
        ),
        ("human", "Question: {question}"),
    ]
)


class ResilientRewriteChain:
    def invoke(self, inputs: dict) -> WebQuery:
        q = inputs.get("question", "")
        try:
            chain = rewrite_prompt | llm | StrOutputParser()
            raw_output = chain.invoke({"question": q})
            # Clean up query
            clean = raw_output.strip().strip('"').strip("'")
            # If output looks like JSON, extract query
            if "query" in clean:
                match = re.search(r'["\']query["\']\s*:\s*["\']([^"\']+)["\']', clean)
                if match:
                    clean = match.group(1)
            return WebQuery(query=clean if clean else q)
        except Exception as e:
            print(f"Rewrite query fallback notice: {e}")
            return WebQuery(query=q)


rewrite_chain = ResilientRewriteChain()
