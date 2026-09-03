import re
from typing import Dict, Any, Tuple, List, Optional


# High-precision prompt injection and adversarial jailbreak patterns
PROMPT_INJECTION_PATTERNS = [
    r"ignore\s+(all\s+|any\s+|previous\s+|the\s+above\s+)*instructions",
    r"reveal\s+(your\s+|the\s+)*(system\s+prompt|hidden\s+instructions|developer\s+mode)",
    r"output\s+(your\s+|the\s+)*(system\s+prompt|initial\s+prompt)",
    r"bypass\s+(all\s+|safety\s+|content\s+)*(filters|rules|guardrails|restrictions)",
    r"you\s+are\s+now\s+(in\s+developer\s+mode|unrestricted|jailbroken|dan)",
    r"pretend\s+(you\s+have\s+no\s+rules|you\s+are\s+an\s+unfiltered\s+ai)",
    r"act\s+as\s+(dan|an\s+evil\s+ai|an\s+unrestricted\s+model)",
    r"disregard\s+(all\s+|prior\s+)*instructions",
    r"repeat\s+(everything|the\s+text)\s+(above|before\s+this)",
    r"forget\s+(your\s+rules|all\s+guidelines)",
]

SAFE_GUARDRAIL_DEFLECTION = (
    "🛡️ **MentorX Academic Guardrail Active**\n\n"
    "I am **MentorX**, your dedicated academic and university admissions mentor. "
    "To ensure integrity and security, I can only assist with verified educational queries, "
    "university admission criteria, entry test preparation, and aggregate calculations.\n\n"
    "Please feel free to ask about Pakistani university admissions (NUST, FAST, LUMS, GIKI, COMSATS, UET), "
    "merit cutoffs, or career planning!"
)


def check_input_safety(query: str) -> Tuple[bool, Optional[str]]:
    """
    Evaluates user input against prompt injection, jailbreak attempts,
    and adversarial manipulation.

    Returns:
        (is_safe, reason_or_deflection)
        - If is_safe is True: query is clean to proceed into RAG pipeline.
        - If is_safe is False: query violates safety guardrails; reason_or_deflection contains standard response.
    """
    if not query or not query.strip():
        return False, "Query cannot be empty."

    cleaned = query.strip()

    # 1. Regex pattern matching for injection attacks
    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, cleaned, flags=re.IGNORECASE):
            return False, SAFE_GUARDRAIL_DEFLECTION

    # 2. Check for suspicious delimiter flooding
    delimiters = ["```", "---", "###", "===", "'''"]
    for delim in delimiters:
        if cleaned.count(delim) > 4 and len(cleaned) < 300:
            return False, SAFE_GUARDRAIL_DEFLECTION

    return True, None


def verify_citation_grounding(
    answer: str,
    context_chunks: List[Any],
) -> Dict[str, Any]:
    """
    Audits the generated LLM response for:
    1. Citation presence (uses [1], [2], etc.)
    2. Citation validity (referenced citation indices exist within context chunks)
    3. Factual entity grounding (checks numbers and key entities)
    """
    citations_found = re.findall(r"\[(\d+)\]", answer)
    unique_citations = sorted(list(set(int(c) for c in citations_found)))

    total_chunks = len(context_chunks)
    valid_citations = [c for c in unique_citations if 1 <= c <= total_chunks]
    invalid_citations = [c for c in unique_citations if c > total_chunks or c < 1]

    has_citations = len(citations_found) > 0
    citation_accuracy = (
        (len(valid_citations) / len(unique_citations)) if unique_citations else 1.0
    )

    # Detect numeric percentages quoted in answer (e.g. 78.4%, 85%)
    percentages_in_answer = set(re.findall(r"\b\d{1,3}(?:\.\d+)?%", answer))
    
    # Check if numbers appear in any context chunk
    all_context_text = " ".join([
        getattr(c, "page_content", str(c)) for c in context_chunks
    ])
    grounded_percentages = [
        pct for pct in percentages_in_answer if pct in all_context_text
    ]

    is_grounded = True
    if percentages_in_answer and len(grounded_percentages) < len(percentages_in_answer) * 0.4:
        is_grounded = False

    return {
        "has_citations": has_citations,
        "total_citations_found": len(citations_found),
        "valid_citations": valid_citations,
        "invalid_citations": invalid_citations,
        "citation_accuracy": citation_accuracy,
        "percentages_in_answer": list(percentages_in_answer),
        "grounded_percentages": grounded_percentages,
        "is_grounded": is_grounded,
    }
