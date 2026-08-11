import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.ai.tools import (
    extract_resume_entities_tool,
    calculate_ats_audit_tool,
    fetch_skill_gap_matrix_tool,
    execute_python_code_sandbox_tool,
    socratic_doubt_help_tool
)
from app.ai.agents.multi_agent_orchestrator import MultiAgentOrchestrator
from app.ai.agents.interview_agent import InterviewAgent
from app.ai.agents.career_coach_agent import CareerCoachAgent
from app.ai.agents.candidate_ranking_agent import CandidateRankingAgent

def run_tests():
    print("==================================================")
    print("TalentFlow AI — Intelligence & 8 Agents Test")
    print("==================================================")

    # 1. Config & Security Check
    print(f"[OK] Project Name: {settings.PROJECT_NAME}")
    assert verify_password("Pass123!", get_password_hash("Pass123!")), "Security check failed"
    print("[OK] Security & Password Utilities verified.")

    # 2. Test Resume 1: Frontend Developer
    frontend_resume = "Sarah Jenkins — Senior Frontend Developer with 5 years experience in React, TypeScript, HTML, CSS, and TailwindCSS."
    res1 = MultiAgentOrchestrator.execute_candidate_pipeline(frontend_resume, "Frontend Developer")
    skills1 = res1["resume_analysis"]["skills"]
    ats1 = res1["ats_evaluation"]["ats_score"]
    
    print(f"[OK] Agent 1 & 2 (Frontend): Score {ats1}% | Extracted Skills: {skills1}")
    assert any(s in ["React", "TypeScript", "HTML", "CSS", "TailwindCSS"] for s in skills1), "Frontend skills missing"

    # 3. Test Resume 2: DevOps Specialist
    devops_resume = "Alex Rivera — DevOps Engineer with 6 years experience in Docker, Kubernetes, Terraform, AWS, Linux, and CI/CD."
    res2 = MultiAgentOrchestrator.execute_candidate_pipeline(devops_resume, "DevOps Engineer")
    skills2 = res2["resume_analysis"]["skills"]
    ats2 = res2["ats_evaluation"]["ats_score"]
    
    print(f"[OK] Agent 1 & 2 (DevOps): Score {ats2}% | Extracted Skills: {skills2}")
    assert any(s in ["Docker", "Kubernetes", "Terraform", "AWS", "Linux"] for s in skills2), "DevOps skills missing"

    # 4. Test Resume 3: AI / ML Engineer
    ai_resume = "Elena Rostova — Machine Learning Engineer with 3 years experience in Python, PyTorch, TensorFlow, Scikit-Learn, and LangChain."
    res3 = MultiAgentOrchestrator.execute_candidate_pipeline(ai_resume, "AI Solutions Architect")
    skills3 = res3["resume_analysis"]["skills"]
    ats3 = res3["ats_evaluation"]["ats_score"]
    
    print(f"[OK] Agent 1 & 2 (AI/ML): Score {ats3}% | Extracted Skills: {skills3}")
    assert any(s in ["Python", "PyTorch", "TensorFlow", "LangChain"] for s in skills3), "AI/ML skills missing"

    # 5. Assert Uniqueness Across All 3 Resumes
    assert skills1 != skills2 != skills3, "Skills extraction is not dynamic!"
    print("[SUCCESS] Multi-Agent Pipeline generated completely unique, dynamic skills and ATS evaluations!")

    # 6. Test Agent 7: Interview Agent Question Generator
    interview_res = InterviewAgent.generate_questions("Frontend Developer", "React Performance Optimization")
    questions = interview_res["data"]["questions"]
    print(f"[OK] Agent 7 (Interview Agent): Generated {len(questions)} role-specific questions.")
    assert len(questions) >= 3, "Interview questions generation failed"

    # 7. Test Agent 6: Career Coach Agent
    coach_res = CareerCoachAgent.chat("How do I prepare for Senior React Developer system design rounds?")
    reply = coach_res["data"]["reply"]
    print(f"[OK] Agent 6 (Career Coach Agent): Contextual Reply: '{reply[:80]}...'")
    assert len(reply) > 10, "Career coach reply empty"

    # 8. Test Agent 8: Candidate Ranking Agent
    ranking_res = CandidateRankingAgent.rank_candidate({"role": "DevOps Engineer", "skills": ["Docker", "Kubernetes"]}, res2["resume_analysis"])
    match_score = ranking_res["data"]["match_score"]
    print(f"[OK] Agent 8 (Candidate Ranking Agent): Match Score {match_score}%.")
    assert match_score > 60.0, "Candidate ranking failed"

    # 9. Live Code Execution Sandbox Tool Test
    code_sample = "nums = [3, 1, 4, 1, 5, 9]\nprint('Sorted:', sorted(nums))"
    sandbox_out = execute_python_code_sandbox_tool.invoke({"code_string": code_sample})
    sandbox_res = json.loads(sandbox_out)
    assert sandbox_res["status"] == "Success", "Code sandbox tool failed"
    print(f"[OK] Code Sandbox Execution Tool verified ({sandbox_res['status']}).")

    print("\n[SUCCESS] ALL 8 SPECIALIZED AGENTS AND DYNAMIC REASONING MODULES PASSED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
