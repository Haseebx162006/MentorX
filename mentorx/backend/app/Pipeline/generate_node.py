from typing import Dict, Any, List, AsyncGenerator
from app.Pipeline.State import State
from langchain_core.prompts import ChatPromptTemplate
from app.LLM.llm import create_llm
from langchain_core.output_parsers import StrOutputParser
from langsmith import traceable


def build_admission_prompt() -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages([
        (
            "system",
            "You are MentorX, an expert AI University Admission & Career Guidance Mentor.\n\n"
            "Guidelines for Formatting and Communication Style:\n"
            "- Answer directly, concisely, and accurately based on the provided Context Information.\n"
            "- If the context contains specific details (admission eligibility, test criteria, closing merit percentages, deadlines, fees), use those exact numbers and facts.\n"
            "- Format your response like ChatGPT: Use crisp markdown with clean section headers (###), bold key terms, neat bullet points, and tables when comparing universities or criteria.\n"
            "- Do NOT include robotic boilerplate or repetitive introductory disclaimers. Provide direct, helpful, and well-structured insights.\n\n"
            "Previous Conversation History:\n{history}\n\n"
            "Context Information:\n{context}"
        ),
        ("human", "{question}")
    ])


@traceable(name="mentorx_generate_response", run_type="llm")
def generate_node(state: State) -> Dict[str, Any]:
    """
    Generates the final academic admission mentorship guidance using verified context (or web docs)
    and conversation history for short-term memory with clean ChatGPT-style formatting.
    Prepends a prominent notice if information had to be fetched from web search due to absence in RAG chunks.
    """
    question = state.get("question") if isinstance(state, dict) else state.question
    refined_context = (state.get("refined_context") if isinstance(state, dict) else state.refined_context) or ""
    web_docs = (state.get("web_docs") if isinstance(state, dict) else state.web_docs) or []
    good_docs = (state.get("good_docs") if isinstance(state, dict) else getattr(state, "good_docs", [])) or []
    verdict = (state.get("verdict") if isinstance(state, dict) else getattr(state, "verdict", "good")) or "good"
    history: List[Dict[str, str]] = (state.get("history") if isinstance(state, dict) else state.history) or []
    
    # Determine if response is powered by web search / absence of good RAG chunks
    is_web_generated = (verdict == "bad") or (bool(web_docs) and not bool(refined_context.strip()) and not bool(good_docs))

    # Select best available context
    if refined_context.strip():
        final_context = refined_context
    elif web_docs:
        final_context = "\n\n".join([doc.page_content for doc in web_docs])
    else:
        docs = (state.get("docs") if isinstance(state, dict) else state.docs) or []
        final_context = "\n\n".join([doc.page_content for doc in docs]) if docs else "No direct prospectus reference found."

    # Format history turns for short-term context
    history_str = ""
    if history:
        history_formatted = []
        for turn in history[-6:]:  # Keep recent turns
            role_label = "Student" if turn.get("role") == "user" else "MentorX"
            content = turn.get("content", "").strip()
            history_formatted.append(f"{role_label}: {content}")
        history_str = "\n".join(history_formatted)
    else:
        history_str = "No previous messages in this conversation."

    prompt = build_admission_prompt()
    llm = create_llm(temperature=0.4, max_tokens=2500)
    chain = prompt | llm | StrOutputParser()
    
    raw_answer = chain.invoke({
        "context": final_context,
        "question": question,
        "history": history_str,
    })

    if is_web_generated:
        notice = "⭐ **This answer is not generated from the chunks because information was not available in RAG, it is generated from the web search.**\n\n"
        if not raw_answer.strip().startswith("⭐"):
            answer = f"{notice}{raw_answer.strip()}"
        else:
            answer = raw_answer
    else:
        answer = raw_answer
    
    return {"answer": answer}


@traceable(name="mentorx_stream_generation", run_type="llm")
async def stream_generation_chain(
    question: str,
    final_context: str,
    history_str: str,
    is_web_generated: bool = False,
) -> AsyncGenerator[str, None]:
    """
    Streams LLM generated tokens directly from Groq using ChatGroq.astream() for true real-time streaming.
    """
    if is_web_generated:
        yield "⭐ **This answer is not generated from the chunks because information was not available in RAG, it is generated from the web search.**\n\n"

    prompt = build_admission_prompt()
    llm = create_llm(temperature=0.4, max_tokens=2500)
    chain = prompt | llm | StrOutputParser()

    async for chunk in chain.astream({
        "context": final_context,
        "question": question,
        "history": history_str,
    }):
        if chunk:
            yield chunk
