from typing import Dict, Any
from app.Pipeline.State import State
from langchain_core.prompts import ChatPromptTemplate
from app.LLM.llm import create_llm
from langchain_core.output_parsers import StrOutputParser


def generate_node(state: State) -> Dict[str, Any]:
    """
    Generates the final academic admission mentorship guidance using verified context (or web docs).
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
        docs = (state.get("docs") if isinstance(state, dict) else state.docs) or []
        final_context = "\n\n".join([doc.page_content for doc in docs]) if docs else "No direct prospectus reference found."

    # MentorX Admissions Counselor Prompt
    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "You are MentorX, an expert AI University Admission & Career Guidance Mentor for students who have completed (or are completing) FSc (Pre-Medical, Pre-Engineering, ICS) and O/A-Levels.\n\n"
            "Your Core Responsibilities:\n"
            "1. Evaluate the student's academic profile (Matric/O-Levels, FSc/A-Levels marks, entry test scores).\n"
            "2. Calculate and explain university aggregates using official formulas (e.g. NUST NET 75%/15%/10%, FAST 50%/40%/10%, UET ECAT 33%/50%/17%, MDCAT 50%/40%/10%).\n"
            "3. Recommend compatible top Pakistani and international universities (NUST, FAST, LUMS, GIKI, KEMU, UET, COMSATS, IBA, AKU, PIEAS, etc.).\n"
            "4. Provide closing merit cutoffs from previous years, admission deadlines, fee structures, and full scholarship programs (LUMS NOP, PEEF, HEC Ehsaas).\n"
            "5. Guide students on HEC stream transitions (e.g. Pre-Med to Computing/BSCS with deficiency math).\n\n"
            "Tone: Empathetic, encouraging, data-backed, and practical. Structure your response clearly with bold headings and bullet points.\n\n"
            "Context Information:\n{context}"
        ),
        ("human", "{question}")
    ])
    
    llm = create_llm(temperature=0.5, max_tokens=2500)
    chain = prompt | llm | StrOutputParser()
    
    answer = chain.invoke({"context": final_context, "question": question})
    
    return {"answer": answer}
