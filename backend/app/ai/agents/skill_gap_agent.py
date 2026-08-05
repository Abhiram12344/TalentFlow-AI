import json
from app.ai.orchestrator import AIOrchestrator

class SkillGapAgent:
    """Agent 3: Identifies skill gaps by comparing candidate skills against industry benchmark roles."""
    NAME = "Skill Gap Agent"
    ROLE = "Competency Gap & Readiness Evaluator"

    @classmethod
    def analyze_gaps(cls, current_skills: list, target_role: str) -> dict:
        prompt = f"""
        Role: Senior Competency Benchmarking Strategist.
        Current Skills: {current_skills}
        Target Role: {target_role}

        Analyze competency gaps for this target role. Return JSON with:
        - "readiness_score": float 0-100
        - "mastered_skills": list of candidate skills that align with target role
        - "gap_skills": list of priority missing skills
        - "skill_category_gaps": {{"core_cs": list, "frameworks": list, "system_design": list}}
        """
        output_text, provider, latency, fallback = AIOrchestrator.generate_completion(prompt, task_name="skill_gap_agent")
        
        try:
            parsed = json.loads(output_text)
        except Exception:
            parsed = {
                "readiness_score": 75.0,
                "mastered_skills": [s for s in current_skills if s in ["Python", "FastAPI", "React", "SQL"]],
                "gap_skills": ["System Design (HLD/LLD)", "ChromaDB Vector Embeddings", "Async Microservices"],
                "skill_category_gaps": {
                    "core_cs": ["Operating Systems & Concurrency", "DBMS Indexing & Normalization"],
                    "frameworks": ["LangChain/LangGraph"],
                    "system_design": ["Caching & Load Balancing"]
                }
            }
        return {
            "agent_name": cls.NAME,
            "provider": provider,
            "latency_ms": latency,
            "fallback_used": fallback,
            "data": parsed
        }
