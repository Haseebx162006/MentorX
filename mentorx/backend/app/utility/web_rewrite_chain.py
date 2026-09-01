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
            "You are a search query optimizer for an academic admissions assistant.\n"
            "Given recent conversation history and the student's latest question, rewrite the question into a specific, standalone search query (3 to 8 words) for admission information.\n\n"
            "Guidelines:\n"
            "- Resolve any pronouns or references (e.g. 'its fees', 'their closing merit') to the specific university or program mentioned in the history.\n"
            "- If the question is purely conversational, a greeting, or asking what the student previously said in chat (e.g. 'hello', 'what did I ask earlier?', 'about which university did I ask', 'how much marks do I have'), output: 'CONVERSATIONAL_QUERY'.\n"
            "- Do NOT answer the question. Output ONLY the search query string.",
        ),
        ("human", "Recent Conversation:\n{history}\n\nLatest Question: {question}"),
    ]
)


class ResilientRewriteChain:
    def invoke(self, inputs: dict) -> WebQuery:
        q = inputs.get("question", "")
        history = inputs.get("history", "No previous conversation.")
        try:
            chain = rewrite_prompt | llm | StrOutputParser()
            raw_output = chain.invoke({"question": q, "history": history})
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
