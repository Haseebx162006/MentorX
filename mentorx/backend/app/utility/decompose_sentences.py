import re
def decompose(text:str):
    """
    Decomposes the input text into sentences.

    Args:
        text (str): The input text to be decomposed.

    Returns:
        list: A list of sentences extracted from the input text.
    """

    text = re.sub(r"\s+", " ", text).strip() # Replace multiple spaces with a single space
    sentences = re.split(r'(?<=[.!?]) +', text) # Split text into sentences based on punctuation

    return [s.strip() for s in sentences if len(s.strip()) > 20] 