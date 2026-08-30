
from State import State
from Correct_gen.decompose_sentences import decompose
from Correct_gen.filter_chain import filter_chain

def refine(state: State):

    q= state["question"]

    context = "\n\n".join(d.page_content for d in state["docs"])

    strips = decompose(context)

    kept_strips = []

    for s in strips:
        result = filter_chain.invoke({"question": q, "sentence": s})
        if result.keep:
            kept_strips.append(s)


    refined_context = "\n\n".join(kept_strips)

    return {
        "strips": strips,
        "kept_strips": kept_strips,
        "refined_context": refined_context
    }


    