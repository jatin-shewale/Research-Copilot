from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from app.api.deps import get_current_active_user
from app.api.routes.search import search_tasks

router = APIRouter()

class ChatRequest(BaseModel):
    search_id: str
    question: str
    chat_history: Optional[List[Dict[str, str]]] = None

class ChatResponse(BaseModel):
    answer: str
    citations: List[Dict[str, Any]]
    confidence: float

@router.post("/", response_model=ChatResponse)
async def chat_with_papers(
    request: ChatRequest,
    current_user = Depends(get_current_active_user)
):
    """
    Chat with the research papers retrieved in a specific search session.
    """
    from app.agents.research_chat_agent import ResearchChatAgent

    if request.search_id not in search_tasks:
        raise HTTPException(status_code=404, detail="Search session not found or expired")
    
    task = search_tasks[request.search_id]
    if task["status"] != "completed":
        raise HTTPException(status_code=400, detail="Search pipeline is not completed yet")
    
    results = task["result"]
    extracted_papers = results.get("extracted_papers", [])
    
    chat_agent = ResearchChatAgent()
    chat_result = await chat_agent.chat(
        question=request.question,
        papers=extracted_papers,
        chat_history=request.chat_history
    )
    
    return ChatResponse(
        answer=chat_result.get("answer", ""),
        citations=chat_result.get("citations", []),
        confidence=chat_result.get("confidence", 0.8)
    )
