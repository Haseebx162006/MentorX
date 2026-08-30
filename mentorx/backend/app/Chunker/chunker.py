from langchain_text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from app.config.settings import settings


def convert_to_chunks(
    text: Document,
    chunk_size: int | None = None,
    chunk_overlap: int | None = None,
):
    """
    Splits document into chunks using configured or custom chunk sizes.
    """
    size = chunk_size or settings.CHUNK_SIZE
    overlap = chunk_overlap or settings.CHUNK_OVERLAP

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=size,
        chunk_overlap=overlap,
    )
    return text_splitter.split_documents([text])