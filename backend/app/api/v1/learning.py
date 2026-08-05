from typing import Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db, AICallLog
from app.ai.agents.learning_path_agent import LearningPathAgent
from app.ai.agents.practice_tutor_agent import PracticeTutorAgent

router = APIRouter(prefix="/learning", tags=["TakeUForward Learning Paths & Socratic Practice Tutor"])

class CustomPlanRequest(BaseModel):
    target_role: str
    gap_skills: List[str]

class PracticeHintRequest(BaseModel):
    problem_title: str
    problem_description: str
    candidate_query: Optional[str] = None

@router.get("/domains")
def list_domains():
    return [
        {"id": "dsa", "name": "DSA Sheet & Problem Solving", "badge": "TakeUForward Striver Inspired"},
        {"id": "core_cs", "name": "Core CS Fundamentals (OS, DBMS, CN)", "badge": "University & Core Rounds"},
        {"id": "system_design", "name": "System Design (HLD & LLD)", "badge": "Enterprise Scale"},
        {"id": "aptitude", "name": "Aptitude & Logical Reasoning", "badge": "Screening Rounds"}
    ]

@router.get("/path/{domain}")
def get_learning_path(domain: str = "dsa"):
    path = LearningPathAgent.get_curated_path(domain)
    return {
        "domain": domain,
        "curriculum": path
    }

@router.post("/custom-plan")
def generate_custom_plan(req: CustomPlanRequest, db: Session = Depends(get_db)):
    agent_res = LearningPathAgent.generate_custom_plan(req.gap_skills, req.target_role)
    
    log = AICallLog(
        provider=agent_res["provider"],
        task_name="custom_learning_plan",
        tokens_used=400,
        latency_ms=agent_res["latency_ms"],
        fallback_used=agent_res["fallback_used"]
    )
    db.add(log)
    db.commit()

    return agent_res

@router.post("/practice-hint")
def get_socratic_practice_hint(req: PracticeHintRequest, db: Session = Depends(get_db)):
    agent_res = PracticeTutorAgent.assist_practice(
        problem_title=req.problem_title,
        problem_description=req.problem_description,
        candidate_query=req.candidate_query
    )
    
    log = AICallLog(
        provider=agent_res["provider"],
        task_name="socratic_practice_tutor",
        tokens_used=350,
        latency_ms=agent_res["latency_ms"],
        fallback_used=agent_res["fallback_used"]
    )
    db.add(log)
    db.commit()

    return agent_res
