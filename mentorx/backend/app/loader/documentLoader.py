from fastapi import UploadFile
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader

async def load_document(file: UploadFile):
    file_path = f"temp/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    document_loader = PyPDFLoader(file_path)
    document = document_loader.load()

    return document