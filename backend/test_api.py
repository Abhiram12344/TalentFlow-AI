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
from app.api.v1.resume import extract_text_from_file

def run_tests():
    print("==================================================")
    print("TalentFlow AI — Role Select Dropdown & PDF Stream Test")
    print("==================================================")

    # 1. Config & Security Check
    print(f"[OK] Project Name: {settings.PROJECT_NAME}")
    assert verify_password("Pass123!", get_password_hash("Pass123!")), "Security check failed"
    print("[OK] Security & Password Utilities verified.")

    # 2. Test PDF Stream Extractor on Abhiram_Resume_Eidiko_TraineeSWE.pdf filename & bytes
    pdf_bytes = b"%PDF-1.4 1 0 obj <<>> stream (Abhiram) Tj (Eidiko) Tj (Trainee) Tj (SWE) Tj (Java) Tj (Python) Tj (SQL) Tj endstream endobj"
    filename = "Abhiram_Resume_Eidiko_TraineeSWE.pdf"
    
    parsed_text = extract_text_from_file(filename, pdf_bytes)
    assert "Abhiram" in parsed_text, "Candidate Name Abhiram missing from PDF stream extraction"
    print(f"[OK] Multi-Strategy PDF Extractor extracted text: '{parsed_text[:100]}...'")

    # 3. Test Abhiram's Resume against Role 1: AI Solutions Architect
    res_ai = MultiAgentOrchestrator.execute_candidate_pipeline(parsed_text, "AI Solutions Architect")
    score_ai = res_ai["ats_evaluation"]["ats_score"]
    missing_ai = res_ai["ats_evaluation"]["missing_keywords"]
    print(f"[OK] Abhiram vs AI Solutions Architect: Score = {score_ai}% | Missing Keywords: {missing_ai}")

    # 4. Test Abhiram's Resume against Role 2: Trainee / Associate Software Engineer
    res_trainee = MultiAgentOrchestrator.execute_candidate_pipeline(parsed_text, "Trainee / Associate Software Engineer")
    score_trainee = res_trainee["ats_evaluation"]["ats_score"]
    missing_trainee = res_trainee["ats_evaluation"]["missing_keywords"]
    print(f"[OK] Abhiram vs Trainee Software Engineer: Score = {score_trainee}% | Missing Keywords: {missing_trainee}")

    # 5. Test Abhiram's Resume against Role 3: DevOps Engineer
    res_devops = MultiAgentOrchestrator.execute_candidate_pipeline(parsed_text, "DevOps Engineer")
    score_devops = res_devops["ats_evaluation"]["ats_score"]
    missing_devops = res_devops["ats_evaluation"]["missing_keywords"]
    print(f"[OK] Abhiram vs DevOps Engineer: Score = {score_devops}% | Missing Keywords: {missing_devops}")

    # 6. Assert Role Sensitivity & Dynamic Re-Scoring
    assert score_ai != score_trainee != score_devops, "ATS Score failed to adapt to target role changes!"
    assert missing_ai != missing_trainee != missing_devops, "Missing keywords failed to adapt to target role changes!"
    print("[SUCCESS] Changing target roles dynamically recalculates ATS scores and missing keywords!")

    # 7. Live Code Execution Sandbox Tool Test
    code_sample = "def fib(n):\n return n if n <= 1 else fib(n-1) + fib(n-2)\nprint('Fib(6):', fib(6))"
    sandbox_out = execute_python_code_sandbox_tool.invoke({"code_string": code_sample})
    sandbox_res = json.loads(sandbox_out)
    assert sandbox_res["status"] == "Success", "Code sandbox tool failed"
    print(f"[OK] Code Sandbox Execution Tool verified ({sandbox_res['status']}).")

    print("\n[SUCCESS] ALL TARGET ROLE DROPDOWN AND PDF STREAM PARSER MODULES PASSED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
