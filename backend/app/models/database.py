import uuid
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from app.core.config import settings

db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
engine = create_engine(db_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    users = relationship("User", back_populates="organization")
    jobs = relationship("Job", back_populates="organization")

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(String(50), nullable=False, default="candidate")  # candidate, recruiter, admin
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    organization = relationship("Organization", back_populates="users")
    resumes = relationship("Resume", back_populates="candidate")
    applications = relationship("Application", back_populates="candidate")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_id = Column(String, ForeignKey("users.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_content_text = Column(Text, nullable=False)
    ats_score = Column(Float, default=0.0)
    parsed_json = Column(JSON, nullable=True)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    candidate = relationship("User", back_populates="resumes")
    applications = relationship("Application", back_populates="resume")

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    title = Column(String(255), nullable=False)
    department = Column(String(100), default="Engineering")
    description = Column(Text, nullable=False)
    parsed_requirements = Column(JSON, nullable=True)
    status = Column(String(50), default="open")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    organization = relationship("Organization", back_populates="jobs")
    applications = relationship("Application", back_populates="job")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    candidate_id = Column(String, ForeignKey("users.id"), nullable=False)
    resume_id = Column(String, ForeignKey("resumes.id"), nullable=False)
    match_score = Column(Float, default=0.0)
    match_reason = Column(Text, nullable=True)
    status = Column(String(50), default="applied")  # applied, shortlisted, interviewed, rejected, hired
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    job = relationship("Job", back_populates="applications")
    candidate = relationship("User", back_populates="applications")
    resume = relationship("Resume", back_populates="applications")

class AICallLog(Base):
    __tablename__ = "ai_call_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    provider = Column(String(50), nullable=False)  # gemini, groq, local_fallback
    task_name = Column(String(100), nullable=False)
    tokens_used = Column(Integer, default=0)
    latency_ms = Column(Integer, default=0)
    fallback_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
