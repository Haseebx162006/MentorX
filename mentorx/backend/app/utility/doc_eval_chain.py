import json
import re
from typing import List
from concurrent.futures import ThreadPoolExecutor
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.LLM.llm import create_llm
from app.config.settings import settings


class DocEvalScore(BaseModel):
    score: float
    reason: str


llm = create_llm(
    model=settings.GROQ_MODEL,
    api_key=settings.GROQ_API_KEY,
    temperature=0.1,
    max_tokens=300,
)

doc_eval_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an objective relevance evaluator for an academic RAG system.\n"
            "Evaluate whether the retrieved chunk contains relevant facts or answers for the user's question.\n\n"
            "Scoring Guidelines:\n"
            "- 1.0: Chunk directly answers the user's specific question (e.g. contains the exact rector/vice-chancellor name, exact aggregate formula, or closing merit cutoff).\n"
            "- 0.5: Chunk provides partial or general context on the topic.\n"
            "- 0.0: Chunk does NOT contain the requested information or is completely irrelevant.\n\n"
            "Format your response as valid JSON:\n"
            "{\"score\": 1.0, \"reason\": \"brief explanation\"}",
        ),
        ("human", "Question: {question}\n\nChunk:\n{chunk}"),
    ]
)


class ResilientDocEvalChain:
    def invoke(self, inputs: dict) -> DocEvalScore:
        try:
            chain = doc_eval_prompt | llm | StrOutputParser()
            raw_output = chain.invoke(inputs)
            
            # Find JSON block in raw output
            json_match = re.search(r"\{.*\}", raw_output, re.DOTALL)
            if json_match:
                parsed = json.loads(json_match.group(0))
                score = float(parsed.get("score", 0.5))
                reason = str(parsed.get("reason", "Evaluated relevance"))
                return DocEvalScore(score=score, reason=reason)
            
            # Score regex fallback
            score_match = re.search(r'score["\']?\s*:\s*([0-9.]+)', raw_output, re.IGNORECASE)
            if score_match:
                return DocEvalScore(score=float(score_match.group(1)), reason="Extracted score")
        except Exception as e:
            print(f"Doc eval parsing notice: {e}")

        return DocEvalScore(score=0.0, reason="Default fallback")

    def batch(self, inputs_list: List[dict], max_workers: int = 5) -> List[DocEvalScore]:
        """Evaluates multiple chunks concurrently in parallel using ThreadPoolExecutor."""
        if not inputs_list:
            return []
        with ThreadPoolExecutor(max_workers=min(max_workers, len(inputs_list))) as executor:
            return list(executor.map(self.invoke, inputs_list))

    async def abatch(self, inputs_list: List[dict]) -> List[DocEvalScore]:
        """Async parallel evaluation of multiple document chunks."""
        import asyncio
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.batch, inputs_list)


doc_eval_chain = ResilientDocEvalChain()
