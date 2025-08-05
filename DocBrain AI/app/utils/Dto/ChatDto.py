from pydantic import BaseModel
from typing import List, Optional

class DocumentChunkDto(BaseModel):
    id: int
    chunkOrder: int
    content: str
    embedding: Optional[str] = None

class ChatMessageDto(BaseModel):
    userMessage: bool #it mean isUserMessage true or model message then false
    content: str

class ChatRequestDto(BaseModel):
    documentId: int
    prompt: str
    history: List[ChatMessageDto] = []
    chunks: List[DocumentChunkDto] = []  # Spring will send chunks with the request

class ChatModelResponseDto(BaseModel):
    content: str