from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db, AICallLog
from app.ai.agents.career_coach_agent import CareerCoachAgent

router = APIRouter(prefix="/chat", tags=["AI Career Coach Assistant"])

class ChatMessageRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, Any]]] = []

@router.post("/message")
def chat_with_career_coach(req: ChatMessageRequest, db: Session = Depends(get_db)):
    agent_res = CareerCoachAgent.chat(req.message, req.history)
    
    log = AICallLog(
        provider=agent_res["provider"],
        task_name="career_coach_chat",
        tokens_used=len(req.message.split()) + 200,
        latency_ms=agent_res["latency_ms"],
        fallback_used=agent_res["fallback_used"]
    )
    db.add(log)
    db.commit()

    return agent_res
