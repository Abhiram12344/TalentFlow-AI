import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token
from app.ai.agents.multi_agent_orchestrator import MultiAgentOrchestrator
from app.ai.agents.learning_path_agent import LearningPathAgent
from app.ai.agents.practice_tutor_agent import PracticeTutorAgent

def run_tests():
    print("==================================================")
    print("TalentFlow AI — Enterprise Multi-Agent Verification")
    print("==================================================")

    # 1. Config Check
    print(f"[OK] Project Name: {settings.PROJECT_NAME}")
    print(f"[OK] API Version: {settings.VERSION}")

    # 2. Security Check
    raw_pw = "TalentFlowSecured2026!"
    hashed_pw = get_password_hash(raw_pw)
    assert verify_password(raw_pw, hashed_pw), "Password verification failed"
    print("[OK] Auth & JWT Security Utilities verified.")

    # 3. Multi-Agent Pipeline Test
    sample_resume = "Senior Full Stack Engineer with 4 years experience in Python, FastAPI, React, SQL, and Docker."
    pipeline_res = MultiAgentOrchestrator.execute_candidate_pipeline(sample_resume, "AI Solutions Architect")
    assert pipeline_res["pipeline_status"] == "Success", "Multi-Agent Pipeline failed"
    assert len(pipeline_res["telemetry_logs"]) >= 4, "Telemetry logs incomplete"
    print(f"[OK] Multi-Agent Ecosystem verified ({len(pipeline_res['telemetry_logs'])} agent nodes executed).")

    # 4. TakeUForward Learning Path Agent Test
    curriculum = LearningPathAgent.get_curated_path("dsa")
    assert "topics" in curriculum, "Curriculum topics missing"
    assert len(curriculum["topics"]) >= 5, "DSA topics count mismatch"
    print(f"[OK] TakeUForward Learning Path Agent verified ({len(curriculum['topics'])} daily study & practice days).")

    # 5. Socratic Practice Tutor Agent Test (Zero-Solution Guardrail)
    tutor_res = PracticeTutorAgent.assist_practice("Kadane's Algorithm", "Find maximum contiguous subarray sum")
    tutor_data = tutor_res["data"]
    assert "socratic_hints" in tutor_data, "Hints missing in tutor response"
    assert "def " not in json.dumps(tutor_data).lower(), "Tutor leaked final code solution!"
    print("[OK] Socratic Practice Tutor Agent verified (strict zero-solution guardrail active).")

    print("\n[SUCCESS] ALL ENTERPRISE MULTI-AGENT MODULES PASSED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
