from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str = "candidate"  # candidate | recruiter | admin
    organization_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: str
    role: str
    organization_id: Optional[str] = None

# Resume & ATS Schemas
class ResumeParseRequest(BaseModel):
    filename: str
    content_text: str

class ResumeAnalysisResponse(BaseModel):
    resume_id: str
    candidate_id: str
    ats_score: float
    skills: List[str]
    missing_skills: List[str]
    improvement_suggestions: List[str]
    parsed_json: dict

# Skill Gap & Roadmap Schemas
class RoadmapRequest(BaseModel):
    target_role: str
    current_skills: List[str]

class RoadmapStep(BaseModel):
    step_number: int
    title: str
    description: str
    recommended_resources: List[str]
    estimated_time: str

class SkillGapRoadmapResponse(BaseModel):
    target_role: str
    gap_skills: List[str]
    readiness_percentage: float
    steps: List[RoadmapStep]

# Job Schemas
class JobCreate(BaseModel):
    title: str
    department: str = "Engineering"
    description: str

class JobResponse(BaseModel):
    id: str
    organization_id: str
    title: str
    department: str
    description: str
    parsed_requirements: Optional[dict] = None
    status: str
    created_at: datetime

# Candidate Match & Application Schemas
class CandidateMatchResult(BaseModel):
    application_id: str
    candidate_id: str
    candidate_name: str
    email: str
    ats_score: float
    match_score: float
    match_reason: str
    status: str

# Mock Interview Schemas
class MockInterviewStartRequest(BaseModel):
    target_role: str
    topic: str = "General Technical & Behavioral"

class MockInterviewResponse(BaseModel):
    session_id: str
    questions: List[dict]

class MockInterviewSubmitAnswer(BaseModel):
    question: str
    user_answer: str

class MockInterviewEvaluation(BaseModel):
    score: float
    feedback: str
    strengths: List[str]
    areas_to_improve: List[str]
