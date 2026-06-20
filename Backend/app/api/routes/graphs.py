from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from app.api.deps import get_current_active_user
from app.api.routes.search import search_tasks

router = APIRouter()

@router.get("/{search_id}", response_model=dict)
async def get_graph(
    search_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """
    Get the generated knowledge graph for a specific search session.
    """
    if search_id not in search_tasks:
        raise HTTPException(status_code=404, detail="Search session not found or expired")
    
    task = search_tasks[search_id]
    if task["status"] != "completed":
        raise HTTPException(status_code=400, detail="Search pipeline is not completed yet")
    
    results = task["result"]
    knowledge_graph = results.get("knowledge_graph", {})
    return knowledge_graph
