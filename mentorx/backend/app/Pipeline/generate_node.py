from typing import Dict, Any
from State import State
from langchain_core.prompts import ChatPromptTemplate
from LLM.llm import create_llm
from langchain_core.output_parsers import StrOutputParser
def generate_node(state: State) -> Dict[str, Any]:
    """
    Generates the final answer using the refined context (or web docs fallback).
    """
    question = state.get("question") if isinstance(state, dict) else state.question
    refined_context = (state.get("refined_context") if isinstance(state, dict) else state.refined_context) or ""
    web_docs = (state.get("web_docs") if isinstance(state, dict) else state.web_docs) or []
    
    # Select best available context
    if refined_context.strip():
        final_context = refined_context
    elif web_docs:
        final_context = "\n\n".join([doc.page_content for doc in web_docs])
    else:
        # Fallback to raw docs if available
        docs = (state.get("docs") if isinstance(state, dict) else state.docs) or []
        final_context = "\n\n".join([doc.page_content for doc in docs]) if docs else "No direct reference found."
    # Prompt template for MentorX academic guidance
    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "You are MentorX, an expert AI academic mentor and guidance assistant. "
            "Answer the student's question accurately, concisely, and helpfully using the provided context. "
            "If the context contains relevant information, ground your answer in it. "
            "If unsure, acknowledge limitations gracefully.\n\n"
            "Context:\n{context}"
        ),
        ("human", "{question}")
    ])
    
    llm = create_llm(temperature=0.5, max_tokens=2000)
    chain = prompt | llm | StrOutputParser()
    
    answer = chain.invoke({"context": final_context, "question": question})
    
    return {"answer": answer}
