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
    print("TalentFlow AI — Tool-Calling Agents & Sandbox Test")
    print("==================================================")

    # 1. Config & Security Check
    print(f"[OK] Project Name: {settings.PROJECT_NAME}")
    assert verify_password("Pass123!", get_password_hash("Pass123!")), "Security check failed"
    print("[OK] Security & Password Utilities verified.")

    # 2. LangChain Tools Test
    entities_out = extract_resume_entities_tool.invoke({"raw_text": "Experienced Python and FastAPI developer."})
    parsed_entities = json.loads(entities_out)
    assert "Python" in parsed_entities["skills"], "Skills tool extraction failed"
    print("[OK] LangChain extract_resume_entities_tool verified.")

    ats_out = calculate_ats_audit_tool.invoke({"resume_json_str": entities_out, "target_jd": "AI Architect"})
    parsed_ats = json.loads(ats_out)
    assert parsed_ats["ats_score"] > 80, "ATS audit tool score failed"
    print(f"[OK] LangChain calculate_ats_audit_tool verified (Score: {parsed_ats['ats_score']}%).")

    # 3. Live Code Execution Sandbox Tool Test
    code_sample = "x = [1, 2, 3, 4]\nprint('Sum:', sum(x))\nassert sum(x) == 10"
    sandbox_out = execute_python_code_sandbox_tool.invoke({"code_string": code_sample})
    sandbox_res = json.loads(sandbox_out)
    assert sandbox_res["status"] == "Success", "Code sandbox tool failed"
    assert "Sum: 10" in sandbox_res["stdout"], "Code sandbox stdout mismatch"
    print(f"[OK] LangChain execute_python_code_sandbox_tool verified ({sandbox_res['status']}).")

    # 4. LangGraph Stateful Tool Pipeline Test
    sample_resume = "Senior AI Software Engineer proficient in Python, FastAPI, React, SQL, and Docker."
    pipeline_res = MultiAgentOrchestrator.execute_candidate_pipeline(sample_resume, "AI Solutions Architect")
    assert pipeline_res["pipeline_status"] == "Success", "LangGraph Tool Pipeline failed"
    assert len(pipeline_res["telemetry_logs"]) >= 4, "Telemetry logs count mismatch"
    print(f"[OK] LangGraph Tool-Calling Pipeline verified ({len(pipeline_res['telemetry_logs'])} tool nodes executed).")

    print("\n[SUCCESS] ALL TOOL-CALLING AGENTS AND CODE SANDBOX MODULES PASSED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
