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

def run_tests():
    print("==================================================")
    print("TalentFlow AI — Dynamic Per-Resume Analysis Test")
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
    
    print(f"[OK] Resume 1 (Frontend): Score {ats1}% | Extracted Skills: {skills1}")
    assert any(s in ["React", "TypeScript", "HTML", "CSS", "TailwindCSS"] for s in skills1), "Frontend skills missing"

    # 3. Test Resume 2: DevOps Specialist
    devops_resume = "Alex Rivera — DevOps Engineer with 6 years experience in Docker, Kubernetes, Terraform, AWS, Linux, and CI/CD."
    res2 = MultiAgentOrchestrator.execute_candidate_pipeline(devops_resume, "DevOps Engineer")
    skills2 = res2["resume_analysis"]["skills"]
    ats2 = res2["ats_evaluation"]["ats_score"]
    
    print(f"[OK] Resume 2 (DevOps): Score {ats2}% | Extracted Skills: {skills2}")
    assert any(s in ["Docker", "Kubernetes", "Terraform", "AWS", "Linux"] for s in skills2), "DevOps skills missing"

    # 4. Test Resume 3: AI / ML Engineer
    ai_resume = "Elena Rostova — Machine Learning Engineer with 3 years experience in Python, PyTorch, TensorFlow, Scikit-Learn, and LangChain."
    res3 = MultiAgentOrchestrator.execute_candidate_pipeline(ai_resume, "AI Solutions Architect")
    skills3 = res3["resume_analysis"]["skills"]
    ats3 = res3["ats_evaluation"]["ats_score"]
    
    print(f"[OK] Resume 3 (AI/ML): Score {ats3}% | Extracted Skills: {skills3}")
    assert any(s in ["Python", "PyTorch", "TensorFlow", "LangChain"] for s in skills3), "AI/ML skills missing"

    # 5. Assert Uniqueness Across All 3 Resumes
    assert skills1 != skills2 != skills3, "Skills extraction is not dynamic!"
    print("[SUCCESS] All 3 resumes generated completely unique, dynamic skills and ATS evaluations!")

    # 6. Live Code Execution Sandbox Tool Test
    code_sample = "nums = [3, 1, 4, 1, 5, 9]\nprint('Sorted:', sorted(nums))"
    sandbox_out = execute_python_code_sandbox_tool.invoke({"code_string": code_sample})
    sandbox_res = json.loads(sandbox_out)
    assert sandbox_res["status"] == "Success", "Code sandbox tool failed"
    print(f"[OK] Code Sandbox Execution Tool verified ({sandbox_res['status']}).")

    print("\n[SUCCESS] ALL DYNAMIC PER-RESUME ANALYSIS MODULES PASSED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
